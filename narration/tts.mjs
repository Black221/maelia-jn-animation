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
// API: endpoint, headers and body follow the Fish Audio docs (https://docs.fish.audio → "Text to Speech").
// ⚠ Checked against the docs before the first real run: see FISH below; the docs were not reachable from the build
// machine when this script was written (egress policy), so run with --dry-run first and compare.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const FISH = {
  url: process.env.FISH_AUDIO_TTS_URL || 'https://api.fish.audio/v1/tts',
  model: process.env.FISH_AUDIO_MODEL || 's1',          // sent as the `model` header
  body: (text, voice) => ({ text, reference_id: voice, format: 'mp3', mp3_bitrate: 192, normalize: true, latency: 'normal', prosody: { speed: 0.95, volume: 0 } }),
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

async function synth(text, out) {
  if (args['dry-run']) { console.log('  [dry-run]', FISH.url, JSON.stringify({ ...FISH.body(text, '<voice>'), text: text.slice(0, 40) + '…' })); return false; }
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch(FISH.url, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', model: FISH.model }, body: JSON.stringify(FISH.body(text, voice)) });
    if (r.ok) { fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); return true; }
    const msg = (await r.text()).slice(0, 300).replace(key, '***');
    console.error(`  HTTP ${r.status} (essai ${attempt}) : ${msg}`);
    if (r.status < 500 && r.status !== 429) throw new Error('Fish Audio a refusé la requête');
    await new Promise(ok => setTimeout(ok, 2000 * 2 ** (attempt - 1)));
  }
  throw new Error('Fish Audio injoignable');
}

fs.mkdirSync('narration/raw', { recursive: true });
for (const sc of scenes) {
  if (only && !only.includes(sc.id)) continue;
  const dir = `narration/audio/${sc.id}`; fs.mkdirSync(dir, { recursive: true });
  console.log(`scène ${sc.id} — ${sc.titre}`);
  const lines = [];
  for (let i = 0; i < sc.lignes.length; i++) {
    const l = sc.lignes[i], raw = `narration/raw/${sc.id}_${i}.mp3`, out = `${dir}/${String(i).padStart(2, '0')}_${l.qui}.wav`;
    if (args.force || !fs.existsSync(raw)) { if (!(await synth(l.texte_tts, raw))) continue; }
    trim(raw, out, CHAR_FX[l.qui] || '');
    lines.push({ qui: l.qui, file: out, dur: +dur(out).toFixed(3), gap: l.qui === 'narrateur' ? .45 : .35 });
    console.log(`  ${i} ${l.qui.padEnd(9)} ${lines.at(-1).dur.toFixed(2)} s  ${l.texte.slice(0, 60)}`);
  }
  if (lines.length === sc.lignes.length) fs.writeFileSync(`narration/audio/${sc.id}.json`, JSON.stringify({ id: sc.id, lines }, null, 1));
}
console.log('ensuite : node narration/build_timeline.mjs   (recale le film sur les durées mesurées)');
