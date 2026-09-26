// timeline.js: the film's scene registry, act wipes and the Act III "provisional" badge.
// Architecture after PDoomVideo (one file per chapter, chapter(name, start, end, shots)); here one file per scene.
//
// Each scene file calls scene(id, S => [[lt0, fn], [lt1, fn], ...]) with LOCAL times (seconds from the scene start).
// S is the scene's timing from TIMING (src/timing.js): S.dur, S.cue(i) / S.cueEnd(i) = start / end of spoken line i,
// so actions stay locked on the words even when the narration is re-recorded. A shot fn(t, lt, dur, S, st) gets
// t = film time, lt = time since the shot started, dur = shot length, st = time since the scene started.
// It paints the WHOLE frame and must be a pure function of t (frames render in parallel and out of order).

const SCENES = {}, SC = {}, TRACKS = {};
// scene(id, build, track?): track(st, S) → { name: number } lets tools/check-motion.mjs find pops (positions in px,
// angles in rad, squash as a fraction).
function scene(id, build, track) { SCENES[id] = build; if (track) TRACKS[id] = track; }
window.trackAt = t => { if (!Object.keys(SC).length) resolveScenes(); const s = SC[sceneAt(t).id], f = TRACKS[s.id]; return f ? { scene: s.id, v: f(t - s.start, s) } : { scene: s.id, v: null }; };
function resolveScenes() {
  for (const s of TIMING.scenes) {
    const S = { ...s, cue: i => (s.cues[i] || s.cues[s.cues.length - 1]).t, cueEnd: i => (s.cues[i] || s.cues[s.cues.length - 1]).end, line: i => s.cues[i] };
    S.shots = SCENES[s.id] ? SCENES[s.id](S) : null;
    SC[s.id] = S;
  }
}
const sceneAt = t => { const L = TIMING.scenes; let i = 0; while (i + 1 < L.length && t >= L[i + 1].start) i++; return L[i]; };

// Act breaks get a brush wipe (V2: "entre les actes, volet au pinceau"): cover by the boundary, reveal after it.
const ACT_WIPE = .45;
const WIPE_COLS = { 2: [PAL.soil, '#7FAF6A'], 3: [PAL.night, PAL.seaDk] };
const LOOPS = {};

function drawWorld(t) {
  if (window.LOOP) { window.LOOP(t); flushLetters(); return; }
  if (!Object.keys(SC).length) resolveScenes();
  const s = SC[sceneAt(t).id], st = t - s.start;
  if (!s.shots) placeholder(t, s, st);
  else {
    let i = 0; while (i + 1 < s.shots.length && st >= s.shots[i + 1][0]) i++;
    const t0 = s.shots[i][0], end = i + 1 < s.shots.length ? s.shots[i + 1][0] : s.dur;
    s.shots[i][1](t, st - t0, end - t0, s, st);
    if (CAM) camEnd();
  }
  flushLetters();
  if (s.act === 3) { provisionalBadge(t, st); flushLetters(); }
  for (const a of [2, 3]) {
    const b = TIMING.scenes.find(x => x.act === a).start;
    if (Math.abs(t - b) < ACT_WIPE) brushWipe((t - (b - ACT_WIPE)) / (2 * ACT_WIPE), WIPE_COLS[a]);
  }
}

function placeholder(t, s, st) {
  paint(rectPts(0, 0, W, H), { wash: '#EFE4D2', washOp: 255, ink: null });
  letter(`scène ${s.id} — ${s.titre}`, 960, 420, 64, PAL.ink, {});
  letter('(pas encore animée)', 960, 510, 40, PAL.grey, {});
  const c = s.cues.find(c => st >= c.t && st < c.end); if (c) letter(c.texte, 960, 640, 30, PAL.night, { maxW: 1600 });
  jumo(960, 800, 12 + 2 * Math.sin(t * 2), { stage: s.act === 1 ? 0 : 2, face: 'loading', prop: 'spin' });
}

// "Synthèse provisoire — extraction en cours": pinned on screen for the whole of Act III (Jumo also wears the tag).
function provisionalBadge(t, st) {
  const k = backOut(seg(st, .2, .7));
  if (k < .02) return;
  boilSeed('badge');
  push(); translate(1712, 70); scale(k); rotate(.035);
  paint(rrPts(-178, -30, 356, 60, 14, 1.5), { wash: '#FFF1C9', washOp: 245, ink: PAL.ink, sw: .9 });
  paint(ellPts(-160, -12, 7, 7, 10), { wash: PAL.red, ink: PAL.ink, sw: .5 });
  pop();
  letter('synthèse provisoire — extraction en cours', 1712 + 8, 71, 21 * k, PAL.night, { rot: .035, weight: 600, maxW: 316 * k });
}

// ---------- brush wipe ----------
// Fat paint strokes sweep across to cover the frame (p 0 → .5), then drag off (p .5 → 1). The cut happens under cover.
function brushWipe(p, cols = [PAL.soil, PAL.ochre]) {
  if (p <= 0 || p >= 1) return;
  const [c1, c2] = cols, n = 5, bh = (H + 420) / n + 40;
  boilSeed('wipe');
  push(); translate(W / 2, H / 2); rotate(-.1); translate(-W / 2, -H / 2);
  for (let i = 0; i < n; i++) {
    const y0 = -230 + i * (H + 420) / n, d = [0, .14, .06, .18, .1][i];
    const q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
    const x0 = p < .5 ? -300 : lerp(-300, W + 400, q), x1 = p < .5 ? lerp(-300, W + 400, q) : W + 400;
    if (x1 - x0 < 30) continue;
    const pts = [], rag = k => 40 + 50 * hash(i * 31 + k) + jit(12);
    for (let k = 0; k <= 8; k++) pts.push([lerp(x0, x1, k / 8), y0 + Math.sin(k * .9 + i) * 14 + jit(5)]);
    for (let k = 1; k < 9; k++) pts.push([x1 + rag(k) - 40, y0 + bh * k / 9]);
    for (let k = 8; k >= 0; k--) pts.push([lerp(x0, x1, k / 8), y0 + bh + Math.sin(k * .8 + i * 2) * 14 + jit(5)]);
    if (p >= .5) for (let k = 8; k > 0; k--) pts.push([x0 - rag(k + 20) + 40, y0 + bh * k / 9]);
    paint(pts, { wash: i % 2 ? c1 : c2, washOp: 255, ink: null, hatch: { d: 44, a: 0, o: { rand: .6, gradient: .5 }, b: 'charcoal', c: i % 2 ? c2 : PAL.cream, w: .8 } });
  }
  pop();
}
