// mix.mjs: voice + music + sound effects → out/mix.wav, mastered at −16 LUFS (two-pass linear loudnorm, as in
// clawd-video's render.mjs: one gain for the whole film, so impacts keep their punch).
//
// Balance: the voice has priority. The music is ducked by DUCK_DB (≈ 8 dB) whenever the narrator speaks, with a
// smooth envelope (attack 60 ms, release 450 ms) computed from the voice track itself; sound effects sit between.
//   node audio/mix.mjs
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const SR = 48000, DUCK_DB = 8, MUSIC_DB = -6, SFX_DB = -3, VOICE_DB = 0;
const dec = (f, ch) => { const b = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'f32le', '-ac', String(ch), '-ar', String(SR), '-'], { maxBuffer: 1 << 30 }); return new Float32Array(b.buffer, b.byteOffset, b.length / 4); };
const voice = dec('out/voice.wav', 1), music = dec('out/music.wav', 2), sfx = fs.existsSync('out/sfx.wav') ? dec('out/sfx.wav', 2) : new Float32Array(voice.length * 2);
const N = voice.length, db = d => Math.pow(10, d / 20);

// voice envelope → duck gain (1 = no duck, db(-DUCK_DB) under speech)
const win = Math.round(.03 * SR), env = new Float32Array(N);
{ let acc = 0; for (let i = 0; i < N; i++) { acc += voice[i] * voice[i]; if (i >= win) acc -= voice[i - win] * voice[i - win]; env[i] = Math.sqrt(Math.max(0, acc) / win); } }
const att = Math.exp(-1 / (.06 * SR)), rel = Math.exp(-1 / (.45 * SR)), thr = .012, duckMin = db(-DUCK_DB);
const duck = new Float32Array(N); { let g = 0; for (let i = 0; i < N; i++) { const target = env[i] > thr ? 1 : 0; g = target > g ? target + (g - target) * att : target + (g - target) * rel; duck[i] = 1 - (1 - duckMin) * g; } }

const out = new Float32Array(N * 2), gv = db(VOICE_DB), gm = db(MUSIC_DB), gs = db(SFX_DB);
let peak = 0;
for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) {
  const m = (music[i * 2 + c] || 0) * gm * duck[i], s = (sfx[i * 2 + c] || 0) * gs, v = voice[i] * gv;
  const x = v + m + s; out[i * 2 + c] = x; peak = Math.max(peak, Math.abs(x));
}
// pre-scale so nothing clips before loudnorm, then write a float WAV
const k = peak > .95 ? .95 / peak : 1;
const pcm = Buffer.alloc(N * 2 * 4); for (let i = 0; i < N * 2; i++) pcm.writeFloatLE(out[i] * k, i * 4);
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22);
h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
fs.writeFileSync('out/premix.wav', Buffer.concat([h, pcm]));

// two-pass loudnorm, linear mode: −16 LUFS integrated, true peak −1.5 dBTP
const target = 'I=-16:TP=-1.5:LRA=11';
const probe = spawnSync('ffmpeg', ['-hide_banner', '-i', 'out/premix.wav', '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
const m = JSON.parse(probe.stderr.slice(probe.stderr.lastIndexOf('{'), probe.stderr.lastIndexOf('}') + 1));
const af = `loudnorm=${target}:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'out/premix.wav', '-af', af, '-ar', String(SR), '-c:a', 'pcm_s16le', 'out/mix.wav']);
const chk = spawnSync('ffmpeg', ['-hide_banner', '-i', 'out/mix.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
console.log('out/mix.wav', (chk.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop(), '·', (chk.match(/Peak:\s+(-?[\d.]+) dBFS/g) || []).pop());
fs.rmSync('out/premix.wav');
