// score.mjs: the film's music and sound effects, synthesized (audio/synth.mjs, from clawd-video) → out/music.wav,
// out/sfx.wav (48 kHz stereo stems, not normalized: audio/mix.mjs balances them under the voice and masters).
//
// Music follows the story (V2 § 3): main theme (ukulele, marimba, soft pulse) at dawn (1.1) and dusk (3.7);
// "enquête" variation for Act I; "épique" for Jumo's transformation (2.3) and his loop (2.6); "mystère" for the
// missing bridge (3.6), with a silence before the reveal and a fanfare when the loop lands.
// Sound effects: every scene can export cues (SFX_CUES in src/sfx_cues.js, written by the scenes' authors) — bips,
// stamps, confetti, buzzer, bounces… placed on the same line cues as the picture, so they can't drift.
//   node audio/score.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import * as S from './synth.mjs';

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/timing.js', 'utf8') + ';this.TIMING = TIMING;', ctx);
const T = ctx.TIMING, SC = Object.fromEntries(T.scenes.map(s => [s.id, s]));
S.init(T.duration, 7);
const BPM = 96, B = 60 / BPM;
const cue = (id, i) => SC[id].start + SC[id].cues[Math.min(i, SC[id].cues.length - 1)].t;
const cueEnd = (id, i) => SC[id].start + SC[id].cues[Math.min(i, SC[id].cues.length - 1)].end;
const beatsIn = (a, b, step = 1) => { const out = []; for (let t = Math.ceil(a / (B * step)) * B * step; t < b - 1e-6; t += B * step) out.push(t); return out; };
const tr = (ch, k) => ch.map(m => m + k);
const CH = { ...S.CHORDS, Am7: [45, 57, 60, 64, 67], Fmaj7: [41, 57, 60, 64, 69], G6: [43, 55, 59, 62, 64], Dm7: [38, 57, 60, 62, 65], Esus: [40, 57, 59, 64, 69] };
// melodic material (MIDI): the main theme, 2 bars; the investigation motif
const THEME = [[0, 72, 1], [1, 76, 1], [2, 79, 1.5], [3.5, 77, .5], [4, 76, 1], [5, 74, 1], [6, 72, 2]];
const MOTIF = [[0, 69, .5], [.5, 72, .5], [1, 71, .5], [1.5, 69, .5], [2, 64, 1], [3, 67, 1]];

// ---------- styles: each renders music between a and b (film seconds) ----------
function theme(a, b, o = {}) {           // ukulele arpeggio + marimba theme + soft pad
  const prog = o.prog || ['C', 'Am', 'F', 'G'], bar = 4 * B;
  for (let t = a, k = 0; t < b - .1; t += bar, k++) {
    const c = CH[prog[k % prog.length]];
    S.pad(t, c.slice(1), Math.min(bar, b - t) + .3, .045 * (o.pad ?? 1));
    S.bass(t, c[0], .5, .22 * (o.bassK ?? 1));
    for (let i = 0; i < 8; i++) if (t + i * B / 2 < b) S.pluck(t + i * B / 2, c[1 + (i % 4)] + (i > 3 ? 12 : 0), .12 * (o.plk ?? 1), (i % 2 ? .3 : -.3), .995, .45, 1.2);
    if (o.melody && k % 2 === 0) for (const [bt, m, d] of THEME) if (t + bt * B < b) S.marimba(t + bt * B, m + (o.up || 0), .15, .1);
  }
}
function enquete(a, b, o = {}) {         // "investigation": pizzicato, walking bass, light hats, the motif on marimba
  const prog = o.prog || ['Am', 'F', 'C', 'G'], bar = 4 * B, dens = o.hats ?? 1;
  for (let t = a, k = 0; t < b - .1; t += bar, k++) {
    const c = CH[prog[k % prog.length]];
    for (let i = 0; i < 4; i++) if (t + i * B < b) S.bass(t + i * B, c[0] + [0, 7, 12, 7][i], .3, .2);
    for (let i = 0; i < 8; i++) if (t + i * B / 2 < b && (i % 2 || o.busy)) S.pluck(t + i * B / 2, c[1 + ((i * 3) % 4)], .1, (i % 4 < 2 ? -.4 : .4), .99, .6, .5);
    if (dens > 0) for (let i = 0; i < 8 * dens; i++) if (t + i * B / (2 * dens) < b) S.hat(t + i * B / (2 * dens), .04 + (i % 2 ? 0 : .02), .35);
    if (o.pulse) for (let i = 0; i < 4; i++) if (t + i * B < b) S.kick(t + i * B, .22 * o.pulse);
    if (o.melody !== false && k % 2 === 1) for (const [bt, m, d] of MOTIF) if (t + bt * B < b) S.marimba(t + bt * B, m, .13, -.1);
  }
}
function epique(a, b, o = {}) {          // build-up: strum, bass octaves, kick on the beat, clap on 2 and 4, bell melody rising
  const prog = o.prog || ['F', 'G', 'Am', 'C'], bar = 4 * B, n = Math.max(1, Math.round((b - a) / bar));
  for (let t = a, k = 0; t < b - .1; t += bar, k++) {
    const c = CH[prog[k % prog.length]], gr = o.build ? Math.min(1, .45 + k / n) : 1;
    S.pad(t, c.slice(1), Math.min(bar, b - t) + .3, .05);
    for (let i = 0; i < 4; i++) if (t + i * B < b) { S.kick(t + i * B, .38 * gr); S.bass(t + i * B, c[0] + (i % 2 ? 12 : 0), .32, .26 * gr); if (i % 2) S.clap(t + i * B, .13 * gr); }
    for (let i = 0; i < 8; i++) if (t + i * B / 2 < b) { S.strum(t + i * B / 2 + .01, c.slice(1, 4), .07 * gr, 0); S.hat(t + i * B / 2 + B / 4, .05 * gr); }
    for (let i = 0; i < 4; i++) if (t + i * B < b) S.bell(t + i * B, c[1 + (i % 4)] + 12 + (k % 2 ? 2 : 0), .08 * gr, .2);
  }
}
function magie(a, b, o = {}) {           // tree of futures: pad + sparse bells, night
  const prog = o.prog || ['Am7', 'Fmaj7', 'C', 'Esus'], bar = 4 * B;
  for (let t = a, k = 0; t < b - .1; t += bar, k++) {
    const c = CH[prog[k % prog.length]];
    S.pad(t, c.slice(1), Math.min(bar, b - t) + .4, .06);
    S.bass(t, c[0], 1.2, .16);
    for (let i = 0; i < 6; i++) { const tt = t + (i * 0.66 + (k % 2) * .33) * B; if (tt < b) S.bell(tt, c[1 + (i % 4)] + 12, .05, (i % 2 ? .4 : -.4), 1.8); }
  }
}
function tension(a, b) {                 // 2.1: the sky speeds up — fast hats, low pulse, minor
  for (const t of beatsIn(a, b, .25)) S.hat(t, .035, .2);
  for (const t of beatsIn(a, b)) { S.bass(t, 45 + ((Math.round(t / B) % 4) === 3 ? 1 : 0), .22, .2); }
  for (let t = a, k = 0; t < b; t += 4 * B, k++) S.pad(t, tr(CH[['Am', 'F', 'Dm', 'E'][k % 4]].slice(1), 0), 4 * B + .3, .05);
}
function voyage(a, b) {                  // 2.7: the little cargo plane — upbeat strum
  for (let t = a, k = 0; t < b - .1; t += 4 * B, k++) {
    const c = CH[['C', 'G', 'Am', 'F'][k % 4]];
    for (let i = 0; i < 8; i++) if (t + i * B / 2 < b) S.strum(t + i * B / 2, (i % 2 ? c.slice(2, 5) : c.slice(1, 4)), .07, i % 2 ? .2 : -.2);
    for (let i = 0; i < 4; i++) if (t + i * B < b) { S.bass(t + i * B, c[0] + (i === 2 ? 7 : 0), .3, .22); if (i % 2) S.snare(t + i * B, .08); }
    if (k % 2 === 0) for (const [bt, m] of THEME) if (t + bt * B < b) S.marimba(t + bt * B, m + 7, .12);
  }
}
function ile(a, b, o = {}) {             // Act III islands: light marimba groove, a different mode per island
  const prog = o.prog || ['C', 'F', 'G', 'C'], bar = 4 * B;
  for (let t = a, k = 0; t < b - .1; t += bar, k++) {
    const c = CH[prog[k % prog.length]];
    S.pad(t, c.slice(1), Math.min(bar, b - t) + .3, .035);
    for (let i = 0; i < 8; i++) if (t + i * B / 2 < b) S.marimba(t + i * B / 2, c[1 + ((i * (o.step || 1)) % 4)] + (i % 4 === 3 ? 12 : 0), .09 + (i % 2 ? 0 : .03), i % 2 ? .35 : -.35);
    for (let i = 0; i < 4; i++) if (t + i * B < b) S.bass(t + i * B, c[0] + (i % 2 ? 7 : 0), .28, .18);
    if (o.hat) for (const tt of beatsIn(t, Math.min(b, t + bar), .5)) S.hat(tt + B / 4, .03);
  }
}
function mystere(a, b) {                 // 3.6: a low drone, sparse high notes, then nothing
  S.pad(a, [45, 52, 57], b - a + .5, .07);
  for (let t = a + B, i = 0; t < b; t += 2 * B, i++) S.bell(t, [81, 79, 76, 74][i % 4], .04, i % 2 ? .5 : -.5, 2.4);
}
function fanfare(t0, b) {                // the loop lands: crash + kick + full chord + bell melody → the theme
  S.crash(t0, .16); S.kick(t0, .55);
  S.strum(t0, [60, 64, 67, 72, 76], .14, 0, .012);
  [72, 76, 79, 84].forEach((m, k) => S.bell(t0 + k * B / 2, m, .12, (k - 1.5) * .2, 1.6));
  theme(t0 + 2 * B, b, { melody: true, prog: ['C', 'F', 'G', 'C'] });
}
function cadence(a, b) {                 // 3.7: IV – V – I on the settle, a ringing final chord fading with the film
  theme(a, b - 6 * B, { melody: true });
  const t = b - 6 * B;
  S.strum(t, CH.F.slice(1), .12, 0); S.bass(t, 41, .8, .22);
  S.strum(t + 2 * B, CH.G.slice(1), .12, 0); S.bass(t + 2 * B, 43, .8, .22);
  S.strum(t + 4 * B, CH.C.slice(1), .15, 0); S.bass(t + 4 * B, 36, 1.8, .24); S.bell(t + 4 * B, 84, .1, 0, 3); S.pad(t + 4 * B, [60, 64, 67, 72], 2.5, .06);
}

// ---------- the score, scene by scene ----------
const span = id => [SC[id].start, SC[id].start + SC[id].dur];
{ const [a, b] = span('1.1'), frz = cue('1.1', 2), after = cueEnd('1.1', 2) + .4;
  theme(a + .2, frz - .05, { melody: true, pad: .8 });                        // dawn theme… cut dead on "Pas si vite."
  S.slide(frz - .1, 900, 300, .4, .07);                                       // the freeze: a slide down
  theme(after, b, { melody: false, plk: .7 }); }                              // time restarts: quieter, thinking
enquete(...span('1.2'), { hats: .5 });
enquete(...span('1.3'), { busy: true, hats: 1 });
enquete(...span('1.4'), { busy: true, hats: 1, pulse: 1, prog: ['Am', 'F', 'Dm', 'E'] });  // the funnel: light pulse
enquete(...span('1.5'), { hats: .5, prog: ['C', 'Am', 'F', 'G'] });
enquete(span('1.6')[0], span('1.6')[1], { hats: .5, prog: ['F', 'C', 'G', 'C'], melody: true });
tension(...span('2.1'));
{ const [a, b] = span('2.2'), prob = cue('2.2', 2);                          // MAELIA: theme, then the problem
  theme(a, prob, { melody: true, prog: ['C', 'G', 'Am', 'F'] });
  for (const t of beatsIn(prob, b, .5)) S.pluck(t, [57, 60, 64, 63][Math.round((t - prob) / (B / 2)) % 4], .1, 0, .98, .7, .3);
  for (const t of beatsIn(prob, b)) S.bass(t, 45, .18, .2); }
epique(...span('2.3'), { build: true, prog: ['Am', 'F', 'C', 'G'] });         // épique: Jumo grows antennas
{ const [a, b] = span('2.4');                                                // Tacti (frantic) vs Jumo (calm)
  for (const t of beatsIn(a, a + (b - a) * .45, .25)) S.hat(t, .05, -.6);
  magie(a + (b - a) * .3, b, { prog: ['C', 'F', 'Am', 'G'] }); }
magie(...span('2.5'));
epique(...span('2.6'), { prog: ['C', 'G', 'Am', 'F'] });                      // épique: the loop
voyage(...span('2.7'));
ile(...span('3.1'), { hat: true, prog: ['C', 'G', 'F', 'C'] });
ile(...span('3.2'), { step: 3, prog: ['Am', 'F', 'C', 'G'] });
ile(...span('3.3'), { hat: true, prog: ['F', 'C', 'Dm', 'G'] });
magie(...span('3.4'), { prog: ['Am7', 'Dm7', 'Fmaj7', 'Esus'] });
ile(...span('3.5'), { prog: ['F', 'C', 'G', 'C'] });
{ const [a, b] = span('3.6'), hush = cue('3.6', 1) - .2, land = cue('3.6', 3) - .15;
  mystere(a, hush);                                                          // then silence under the four "PAS ENCORE"
  fanfare(land, b); }
cadence(...span('3.7'));

// ---------- sound effects from the scenes (src/sfx_cues.js: SFX_CUES = [[time, kind, gain, pan], ...]) ----------
let sfx = [];
if (fs.existsSync('src/sfx_cues.js')) { const c2 = {}; vm.createContext(c2); vm.runInContext(fs.readFileSync('src/sfx_cues.js', 'utf8') + ';this.X = SFX_CUES;', c2); sfx = c2.X || []; }
const BIP = (t, g = .08, p = 0, f = 1400) => { S.bell(t, 88, g * .5, p, .25, S.sfx); S.tick(t, g, f, p); };
const FX = {
  bip: (t, g, p) => BIP(t, g ?? .09, p), bip2: (t, g, p) => { BIP(t, g ?? .09, p); BIP(t + .11, g ?? .09, p, 1900); },
  bipq: (t, g, p) => S.slide(t, 900, 1500, .22, g ?? .08, p), bipsad: (t, g, p) => S.slide(t, 1100, 600, .3, g ?? .08, p),
  pop: (t, g, p) => S.pop(t, g ?? .12), bloop: (t, g, p) => S.bloop(t, g ?? .15, p), boing: (t, g, p) => S.boing(t, g ?? .15, 200, 600, .45, p),
  thud: (t, g, p) => S.thud(t, g ?? .3), whoosh: (t, g, p) => S.whoosh(t, .4, g ?? .15, 400, 2400, p), tick: (t, g, p) => S.tick(t, g ?? .06, 3000, p),
  stamp: (t, g, p) => { S.thud(t, g ?? .4, 1.2); S.knock(t, .2, p); }, clic: (t, g, p) => { S.clink(t, g ?? .1, p); S.tick(t, .08, 2200, p); },
  confetti: (t, g, p) => S.popper(t, g ?? .25), chime: (t, g, p) => S.chime(t, 84, g ?? .1, p), sparkle: (t, g, p) => S.sparkle(t, .8, 14, g ?? .05),
  buzzer: (t, g, p) => S.glitch(t, .3, g ?? .12), glitch: (t, g, p) => S.glitch(t, .2, g ?? .1), rustle: (t, g, p) => S.rustle(t, .5, g ?? .08, p),
  slideUp: (t, g, p) => S.slide(t, 400, 1200, .5, g ?? .08, p), slideDown: (t, g, p) => S.slide(t, 1000, 350, .5, g ?? .08, p),
  knock: (t, g, p) => S.knock(t, g ?? .25, p), squeak: (t, g, p) => S.squeak(t, g ?? .08, p), step: (t, g, p) => S.footstep(t, g ?? .1, p),
  ding: (t, g, p) => S.bell(t, 91, g ?? .09, p, .8, S.sfx), scratch: (t, g, p) => S.skid(t, .25, g ?? .1), rotor: (t, g, p) => S.whoosh(t, 1.2, g ?? .05, 150, 500, p),
};
for (const [t, kind, g, p] of sfx) { if (FX[kind]) FX[kind](t, g, p ?? 0); else console.warn('unknown sfx ' + kind); }
// act wipes: a brush whoosh
for (const a of [2, 3]) S.whoosh(T.scenes.find(s => s.act === a).start - .45, .9, .16, 300, 1800, 0);

// ---------- write the two stems (48 kHz stereo, 16-bit, fixed gain, no normalization) ----------
function writeStem(file, bus, gain) {
  const n = S.N, data = Buffer.alloc(n * 4); let peak = 0;
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) { const v = Math.tanh(bus[c][i] * gain * 1.1) / Math.tanh(1.1); peak = Math.max(peak, Math.abs(v)); data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 4 + c * 2); }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(S.SR, 24); h.writeUInt32LE(S.SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
  return peak;
}
fs.mkdirSync('out', { recursive: true });
console.log('music peak', writeStem('out/music.wav', S.mus, .8).toFixed(3), '· sfx peak', writeStem('out/sfx.wav', S.sfx, 1).toFixed(3), `· ${sfx.length} sfx cues`);
