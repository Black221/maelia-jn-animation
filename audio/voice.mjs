// voice.mjs: places every narration line at its cue time (src/timing.js) → out/voice.wav (the whole film's voice
// track, 48 kHz mono) and narration/audio/<scene>.wav (one narration file per scene, as the brief asks).
//   node audio/voice.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync('src/timing.js', 'utf8') + ';this.TIMING = TIMING;', ctx);
const T = ctx.TIMING, SR = 48000, N = Math.round(T.duration * SR);
const readWav = f => {   // decode any line file to raw 48 kHz mono float32 via ffmpeg
  const buf = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'], { maxBuffer: 1 << 28 });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
};
const writeWav = (file, data) => {
  const pcm = Buffer.alloc(data.length * 2);
  for (let i = 0; i < data.length; i++) pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i])) * 32767), i * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, pcm]));
};
const all = new Float32Array(N);
fs.mkdirSync('out', { recursive: true });
for (const s of T.scenes) {
  const sc = new Float32Array(Math.round(s.dur * SR));
  for (const c of s.cues) {
    if (!c.file) { console.warn(`scène ${s.id}: réplique sans audio (${c.texte.slice(0, 30)}…)`); continue; }
    const d = readWav(c.file), o = Math.round(c.t * SR), g = Math.round((s.start + c.t) * SR);
    for (let i = 0; i < d.length; i++) { if (o + i < sc.length) sc[o + i] += d[i]; if (g + i < N) all[g + i] += d[i]; }
  }
  writeWav(`narration/audio/${s.id}.wav`, sc);
}
writeWav('out/voice.wav', all);
console.log(`out/voice.wav  ${T.duration.toFixed(2)} s, ${T.scenes.reduce((n, s) => n + s.cues.length, 0)} lines`);
