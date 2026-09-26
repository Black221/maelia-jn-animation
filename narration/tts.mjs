// tts.mjs: narration → Fish Audio → narration/audio/<scene>/<line>.mp3, measured with ffprobe.
//
//   FISH_AUDIO_API_KEY=… FISH_AUDIO_VOICE_ID=… node narration/tts.mjs [--only=1.3,1.4] [--force] [--dry-run]
//
// The key and the voice come ONLY from the environment (the cloud environment's secrets); nothing is written to disk
// or to the logs. One file per spoken line (sentence or short group), then one file per scene (the lines joined with
// their gaps, narration/audio/<scene>.mp3), and narration/audio/<scene>.json with the measured durations, which
// build_timeline.mjs turns into the film's clock.
//
// Character lines (Videur, Arbitre, Tacti) use the same Fish Audio voice, then a pitch/tempo change with ffmpeg so
// each character sounds distinct (no other synthesis is used).
//
// API (checked against https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech.md, 2026-09-26):
//   POST https://api.fish.audio/v1/tts · headers Authorization: Bearer <key>, Content-Type: application/json,
//   model: s2.1-pro (the docs' production recommendation) · body TTSRequest { text, reference_id, format, sample_rate,
//   prosody { speed, volume, normalize_loudness }, latency, temperature, top_p, normalize } → audio bytes.
//   `normalize` only applies to English and Chinese text, so it is off (numbers are already written out in French).
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const FISH = {
  url: process.env.FISH_AUDIO_TTS_URL || 'https://api.fish.audio/v1/tts',
  model: process.env.FISH_AUDIO_MODEL || 's2.1-pro-free',  // `model` header. s2.1-pro-free = the same S2.1-Pro model on the free developer tier (the paid tier answered 402: no API credit)
  body: (text, voice) => ({ text, reference_id: voice, format: 'wav', sample_rate: 44100, normalize: false, latency: 'normal', temperature: 0.7, top_p: 0.7,
                            prosody: { speed: +(process.env.FISH_AUDIO_SPEED || 0.95), volume: 0, normalize_loudness: true } }),
};
// voice changes for the short character lines (ffmpeg rubberband-free: asetrate + atempo keeps the duration sane)
const CHAR_FX = {
  videur: 'asetrate=48000*0.84,aresample=48000,atempo=1.08',      // deeper, slow bouncer
  arbitre: 'asetrate=48000*0.93,aresample=48000,atempo=0.96,aecho=0.6:0.3:40:0.15', // older, a little hall
  tacti: 'asetrate=48000*1.22,aresample=48000,atempo=1.12',       // high, hyperactive
};
const key = process.env.FISH_AUDIO_API_KEY, voice = process.env.FISH_AUDIO_VOICE_ID;
if (!args['dry-run'] && (!key || !voice)) { console.error('FISH_AUDIO_API_KEY / FISH_AUDIO_VOICE_ID manquants (secrets de l’environnement).'); process.exit(1); }

const scenes = JSON.parse(fs.readFileSync('narration/scenes.json', 'utf8'));
const only = args.only ? String(args.only).split(',') : null;
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
// silence trimmed at both ends so our own gaps set the rhythm
const trim = (src, dst, fx = '') => execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-af',
  `${fx ? fx + ',' : ''}silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse`,
  '-ar', '48000', '-ac', '1', dst]);

// Requests go through curl (it honours the environment's HTTPS proxy); the Authorization header is written to curl's
// stdin (-H @-), so the key never appears in a file, in the process list or in the logs.
async function synth(text, out) {
  if (args['dry-run']) { console.log('  [dry-run]', FISH.url, FISH.model, JSON.stringify({ ...FISH.body(text, '<voice>'), text: text.slice(0, 40) + '…' })); return false; }
  const bodyFile = out + '.json'; fs.writeFileSync(bodyFile, JSON.stringify(FISH.body(text, voice)));
  try {
    for (let attempt = 1; attempt <= 4; attempt++) {
      const r = spawnSync('curl', ['-sS', '-X', 'POST', FISH.url, '-H', '@-', '-H', 'Content-Type: application/json', '-H', `model: ${FISH.model}`,
        '--data-binary', `@${bodyFile}`, '-o', out, '-w', '%{http_code}', '--max-time', '180'], { input: `Authorization: Bearer ${key}\n`, encoding: 'utf8' });
      const code = +(r.stdout || 0);
      if (code === 200 && fs.statSync(out).size > 1000) return true;
      const msg = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').slice(0, 300).split(key).join('***') : (r.stderr || '');
      console.error(`  HTTP ${code} (essai ${attempt}) : ${msg}`);
      if (code && code < 500 && code !== 429) throw new Error('Fish Audio a refusé la requête');
      await new Promise(ok => setTimeout(ok, 2000 * 2 ** (attempt - 1)));
    }
  } finally { fs.rmSync(bodyFile, { force: true }); }
  throw new Error('Fish Audio injoignable');
}

fs.mkdirSync('narration/raw', { recursive: true });
for (const sc of scenes) {
  if (only && !only.includes(sc.id)) continue;
  const dir = `narration/audio/${sc.id}`; fs.mkdirSync(dir, { recursive: true });
  console.log(`scène ${sc.id} — ${sc.titre}`);
  const lines = [];
  for (let i = 0; i < sc.lignes.length; i++) {
    const l = sc.lignes[i], raw = `narration/raw/${sc.id}_${i}.wav`, out = `${dir}/${String(i).padStart(2, '0')}_${l.qui}.wav`;
    const valid = f => fs.existsSync(f) && fs.statSync(f).size > 1000 && fs.readFileSync(f).subarray(0, 4).toString() === 'RIFF';
    if (args.force || !valid(raw)) { fs.rmSync(raw, { force: true }); if (!(await synth(l.texte_tts, raw))) continue; }
    trim(raw, out, CHAR_FX[l.qui] || '');
    lines.push({ qui: l.qui, file: out, dur: +dur(out).toFixed(3), gap: l.qui === 'narrateur' ? .45 : .35 });
    console.log(`  ${i} ${l.qui.padEnd(9)} ${lines.at(-1).dur.toFixed(2)} s  ${l.texte.slice(0, 60)}`);
  }
  if (lines.length === sc.lignes.length) fs.writeFileSync(`narration/audio/${sc.id}.json`, JSON.stringify({ id: sc.id, lines }, null, 1));
}
console.log('ensuite : node narration/build_timeline.mjs   (recale le film sur les durées mesurées)');
