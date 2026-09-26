// core.js: constants, helpers, paper, paint wrapper, plates, compositing and render hooks.
//
// Derived from ClaudeAnimationBase (https://github.com/JohnHeibel/ClaudeAnimationBase), MIT License,
// Copyright (c) 2026 John Heibel. Changes for this film: project palette, local fonts with French accents,
// pre-painted "plates" (backgrounds and sprites painted once with p5.brush, see PLATES below), a plate-painting
// page mode, and a caption-safe band.
//
// Length comes from TIMING (src/timing.js, generated from the narration's real durations).
const W = 1920, H = 1080;
const BPM = PROJECT.bpm, BEAT = 60 / BPM, OFF = PROJECT.offset || 0, BOIL = 12;
const DUR = PROJECT.duration;
const TAU = Math.PI * 2;
// Base palette of the V2 storyboard, plus soft utility colours. No pure black or white: ink is PAL.ink, white is PAL.cream.
const PAL = {
  paper: '#FBF3E6', ink: '#2E2530', cream: '#FFF8EC',
  soil: '#3E7C4A', night: '#1F3A5F', data: '#3BC4D8', ochre: '#D99A3D', red: '#C8553D',
  // utility tones
  sky: '#CFE2EA', dawn: '#F7D7B0', sun: '#F8C95C', hill: '#B5CFA3', hill2: '#98BF86', grass: '#B8D48E', tuft: '#6E9A55',
  wood: '#B98A57', woodLt: '#EBCB96', woodDk: '#8A6246', river: '#56A6B3', sea: '#9FD3D6', seaDk: '#3E8FA3',
  rose: '#E27A92', violet: '#7B5CA8', indigo: '#2F3C7A', teal: '#3A9C98', sap: '#6E9F58', grey: '#9C98A6'
};
// Lettering fonts (local files in assets/fonts, loaded by studio.html). DejaVu Sans covers κ and arrows.
const FONT = { round: '"Fredoka", "DejaVu Sans", sans-serif', marker: '"Permanent Marker", "Fredoka", "DejaVu Sans", sans-serif', hand: '"Patrick Hand", "DejaVu Sans", sans-serif' };
// Captions (subtitles) are burnt in by nobody: they're a separate .srt. Keep the band y > SAFE_Y free of key action.
const SAFE_Y = 960;

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const backOut = x => { x = clamp(x); const s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const elasticOut = x => { x = clamp(x); return x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (TAU / 3)) + 1; };
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const hashS = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
const bpOf = t => (t - OFF) / BEAT;
// Seeded by the boil frame, so linework "boils" at BOIL fps like hand-drawn animation.
const jit = a => (random() * 2 - 1) * a;
// boilSeed(key) restarts the random stream from the boil frame and a key that's the same every frame: call it before
// each separate element, so one moving thing never makes everything drawn after it re-boil (jitter).
let BOILN = 0, CAST_N = 0;
const boilSeed = key => { let h = 2166136261; for (const c of key + '|' + BOILN) h = Math.imul(h ^ c.charCodeAt(0), 16777619); randomSeed(h >>> 0); };

// ---------- timing helpers (everything is a pure function of t; no state survives between frames) ----------
const seg = (t, a, b) => clamp((t - a) / (b - a));
const frac = x => x - Math.floor(x);
const beatN = t => Math.floor(bpOf(t));
const pulse = (t, k = 6) => Math.exp(-frac(bpOf(t)) * k);
const pulse2 = (t, k = 6) => Math.exp(-frac(bpOf(t) * 2) * k);
const wob = (t, f = 1, ph = 0) => Math.sin((t * f + ph) * TAU);
// 0 → 1 → 0 bump over [a, b] with eased edges of length e
const bump = (t, a, b, e = .3) => ease(seg(t, a, a + e)) * (1 - ease(seg(t, b - e, b)));
function kf(t, keys, e = ease) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [a, va] = keys[i - 1], [b, vb] = keys[i], k = e((t - a) / (b - a));
      return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
    }
  }
  return keys[keys.length - 1][1];
}
function mixCol(a, b, k) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), c = i => Math.round(lerp((pa >> i) & 255, (pb >> i) & 255, clamp(k)));
  return '#' + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
const shakeXY = (t, amt) => { const f = Math.floor(t * 24); return [(hash(f * 1.7) - .5) * 2 * amt, (hash(f * 2.3 + 9) - .5) * 2 * amt]; };

// ---------- motion principles, as pure functions of t ----------
const spring = (t, t0, k = 6, w = 18) => t < t0 ? 0 : Math.exp(-k * (t - t0)) * Math.sin(w * (t - t0));
const ring = (t, evs, k = 6, w = 18) => evs.reduce((s, e) => s + spring(t, e, k, w), 0);
const onTwos = t => Math.floor(t * 12 + 1e-6) / 12;
const arcPt = (p0, p1, h, k) => [lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k) - h * 4 * k * (1 - k)];
// A hop from t0 to t1, h units high: crouch (anticipation), stretch on take-off, squash on landing. Returns { dy, sq }.
function jump(t, t0, t1, h = 3) {
  if (t < t0 - .14) return { dy: 0, sq: 0 };
  if (t < t0) return { dy: 0, sq: .18 * ease(seg(t, t0 - .14, t0)) };
  if (t < t1) { const k = (t - t0) / (t1 - t0); return { dy: -h * 4 * k * (1 - k), sq: -.16 * Math.abs(1 - 2 * k) }; }
  const a = t - t1; return { dy: 0, sq: .22 * Math.exp(-8 * a) * Math.cos(20 * a) };
}
function take(t, t0, amt = 1) {
  if (t < t0 - .1) return { sq: 0, dy: 0 };
  if (t < t0) return { sq: .12 * amt * ease(seg(t, t0 - .1, t0)), dy: 0 };
  const a = t - t0; return { sq: -.26 * amt * Math.exp(-6 * a) * Math.cos(16 * a), dy: -1.2 * amt * Math.exp(-7 * a) * Math.max(0, Math.cos(9 * a)) };
}
// Walk from x0 to x1 between t0 and t1 for a character whose stride is `stride` px: eased, with a step phase.
function stroll(t, t0, t1, x0, x1, stride) {
  const x = lerp(x0, x1, ease(seg(t, t0, t1))), d = Math.abs(x - x0) / stride, moving = t > t0 && t < t1;
  return { x, walk: moving ? d : null, flip: x1 < x0, moving };
}

// ---------- camera ----------
let CAM = null, LAST_CAM = null;
function camBegin(cx = W / 2, cy = H / 2, zoom = 1, rot = 0) { push(); translate(W / 2, H / 2); rotate(rot); scale(zoom); translate(-cx, -cy); CAM = LAST_CAM = { cx, cy, zoom, rot }; }
function camEnd() { pop(); CAM = null; }
function toScreen(x, y, cam = CAM) {
  if (!cam) return [x, y];
  const c = Math.cos(cam.rot), s = Math.sin(cam.rot), dx = (x - cam.cx) * cam.zoom, dy = (y - cam.cy) * cam.zoom;
  return [W / 2 + dx * c - dy * s, H / 2 + dx * s + dy * c];
}

// ---------- full-frame effects (call outside a camera, in screen space) ----------
function flash(k, col = PAL.cream) { if (k > .01) paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, washOp: 255 * clamp(k), ink: null }); }
// Light: glow() ADDS a soft halo (p5.brush mixes like pigment, so light can't be painted).
function glow(x, y, r, col = '#FFC766', a = 1) {
  if (a <= 0 || r < 1) return;
  flushBrush();
  const c = color(col), rr = r * (1 + jit(.03));
  push(); blendMode(ADD); tint(red(c), green(c), blue(c), 150 * clamp(a)); image(glowTex, x - rr, y - rr, 2 * rr, 2 * rr); noTint(); blendMode(BLEND); pop();
}
function makeGlowTex() {
  const g = createGraphics(256, 256); g.pixelDensity(1); const c = g.drawingContext, gr = c.createRadialGradient(128, 128, 0, 128, 128, 128);
  [[0, 1], [.18, .8], [.45, .32], [.75, .08], [1, 0]].forEach(([s, a]) => gr.addColorStop(s, `rgba(255,255,255,${a})`));
  c.fillStyle = gr; c.fillRect(0, 0, 256, 256);
  return g;
}
function irisShape(pts, col = PAL.ink, far = 4000) {
  const n = pts.length; let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; } cx /= n; cy /= n;
  const out = p => { const dx = p[0] - cx, dy = p[1] - cy, d = Math.hypot(dx, dy) || 1; return [cx + dx / d * far, cy + dy / d * far]; };
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], ex = (b[0] - a[0]) * .06, ey = (b[1] - a[1]) * .06;
    const a2 = [a[0] - ex, a[1] - ey], b2 = [b[0] + ex, b[1] + ey];
    paint([a2, b2, out(b2), out(a2)], { wash: col, washOp: 255, ink: null });
  }
}
function iris(cx, cy, r, col = PAL.ink) { if (r < 4) paint(rectPts(-60, -60, W + 120, H + 120), { wash: col, ink: null }); else irisShape(ellPts(cx, cy, r, r, 40), col); }

let T = 0, paperG = null, grainC = null, letG = null, glowTex = null, outC = null, outX = null;
let LETTERS = [];

// ---------- geometry ----------
function rectPts(x, y, w, h, j = 0) {
  return [[x + jit(j), y + jit(j)], [x + w / 2 + jit(j), y + jit(j) * .5], [x + w + jit(j), y + jit(j)],
          [x + w + jit(j) * .5, y + h / 2], [x + w + jit(j), y + h + jit(j)], [x + w / 2 + jit(j), y + h + jit(j) * .5],
          [x + jit(j), y + h + jit(j)], [x + jit(j) * .5, y + h / 2]];
}
function ellPts(cx, cy, rx, ry, n = 28, j = 0, rot = 0) {
  const p = []; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; p.push([cx + Math.cos(a) * rx + jit(j), cy + Math.sin(a) * ry + jit(j)]); } return p;
}
function rrPts(x, y, w, h, r, j = 0) {
  const p = [], sg = 5; r = Math.min(r, w / 2, h / 2);
  const corner = (cx, cy, a0) => { for (let i = 0; i <= sg; i++) { const a = a0 + i / sg * Math.PI / 2; p.push([cx + Math.cos(a) * r + jit(j), cy + Math.sin(a) * r + jit(j)]); } };
  corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI);
  return p;
}
function starPts(cx, cy, r, inner = .38, n = 4, rot = -Math.PI / 2) {
  const p = []; for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r * inner : r; p.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q]); } return p;
}
function heartPts(cx, cy, r, n = 22) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; p.push([cx + 16 * Math.pow(Math.sin(a), 3) * r / 16, cy - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * r / 16]); } return p;
}
// points transformed by translate(x, y) · rotate(a) · scale(s)
const xform = (P, x, y, a = 0, s = 1) => { const c = Math.cos(a), n = Math.sin(a); return P.map(([px, py]) => [x + (px * c - py * n) * s, y + (px * n + py * c) * s]); };
function through(P, n = 6) {
  if (P.length < 3) return P.slice();
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const u = k / n, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3)));
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
function ribbon(P, w0, w1 = w0) {
  const C = through(P), n = C.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / Math.max(1, n - 1)) / 2;
    L.push([C[i][0] - dy / d * w, C[i][1] + dx / d * w]); R.push([C[i][0] + dy / d * w, C[i][1] - dx / d * w]);
  }
  return L.concat(R.reverse());
}

// ---------- paint wrapper ----------
// One call = one painted shape: optional flat wash, optional watercolor fill, optional hatch, optional ink outline.
// COST: wash and ink are ~10 ms each in software GL; a watercolour `fill` is 1–2 s. So `fill` belongs in plates
// (painted once, see below), never in per-frame drawing.
// Cull shapes that land entirely off screen: p5.brush can't bound an off-screen stroke and then composites the
// WHOLE frame for it (a full blend pass per colour change): an off-screen character used to cost seconds.
let _R = null;
function offscreen(pts) {
  if (PLATE_MODE || PLATE_REC) return false;
  _R = _R || p5.instance._renderer; const m = _R.states.uModelMatrix.mat4, hw = width / 2, hh = height / 2, pad = 90;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { const sx = m[0] * x + m[4] * y + m[12] + hw, sy = m[1] * x + m[5] * y + m[13] + hh; if (sx < x0) x0 = sx; if (sx > x1) x1 = sx; if (sy < y0) y0 = sy; if (sy > y1) y1 = sy; }
  return x1 < -pad || x0 > width + pad || y1 < -pad || y0 > height + pad;
}
function centred(pts, draw) {
  if (!pts.length || offscreen(pts)) return;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  push(); translate(cx, cy); draw(pts.map(([x, y]) => [x - cx, y - cy])); pop();
}
// Plate painting records every paint/inkLine call and replays them one per p5 draw (see paintPlate): p5.brush
// fully composites at the end of each draw, so the painting order is exact (mixing watercolour fills, washes and
// strokes inside one draw can lose layers).
let PLATE_REC = null;
// plate-only: a smooth vertical gradient (Canvas2D) laid down as one op, for skies without banding
function gradientRect(x, y, w, h, stops) {
  const op = () => { flushBrush(true); const g = createGraphics(Math.max(1, Math.round(w)), Math.max(1, Math.round(h))); g.pixelDensity(1); const c = g.drawingContext, gr = c.createLinearGradient(0, 0, 0, h);
    for (const [t, col] of stops) gr.addColorStop(clamp(t), col); c.fillStyle = gr; c.fillRect(0, 0, w, h); image(g, x, y, w, h); g.remove(); };
  if (PLATE_REC) PLATE_REC.push(op); else op();
}
function paint(pts, o = {}) { if (PLATE_REC) { const P = pts.map(p => [p[0], p[1]]); PLATE_REC.push(() => paint(P, o)); return; } BRUSH_DIRTY = true; centred(pts, (P) => paintAt(P, o)); }
function paintAt(pts, o) {
  if (o.wash || o.fill || o.hatch) {
    if (o.wash) brush.wash(o.wash, o.washOp ?? 255); else brush.noWash();
    if (o.fill) { brush.fill(o.fill, o.fillOp ?? 170); brush.fillBleed(o.bleed ?? .1); brush.fillTexture(o.tex ?? .4, o.border ?? .35); } else brush.noFill();
    if (o.hatch) { brush.hatch(o.hatch.d, o.hatch.a, o.hatch.o || { rand: .15 }); brush.hatchStyle(o.hatch.b || 'HB', o.hatch.c || PAL.ink, o.hatch.w || 1); } else brush.noHatch();
    brush.noStroke();
    if (o.curv) { brush.beginShape(o.curv); for (const p of pts) brush.vertex(p[0], p[1]); brush.endShape(true); }
    else brush.polygon(pts);
  }
  if (o.ink !== null) {
    brush.noWash(); brush.noFill(); brush.noHatch(); brush.set(o.br || 'ink', o.ink || PAL.ink, o.sw ?? 1);
    brush.beginShape(o.curv || 0); for (const p of pts) brush.vertex(p[0], p[1]); brush.endShape(true);
  }
}
function inkLine(pts, sw = 1, col = PAL.ink, br = 'ink', curv = .5) {
  if (PLATE_REC) { const P = pts.map(p => [p[0], p[1]]); PLATE_REC.push(() => inkLine(P, sw, col, br, curv)); return; }
  BRUSH_DIRTY = true;
  if (pts.length === 2) pts = [pts[0], [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2], pts[1]];   // p5.brush splines need ≥ 3 points
  centred(pts, (P) => { brush.noFill(); brush.noWash(); brush.noHatch(); brush.set(br, col, sw); brush.spline(P, curv); });
}
// flat shape shorthand: wash + ink outline
const shape = (pts, col, sw = 1, o = {}) => paint(pts, { wash: col, washOp: 255, ink: PAL.ink, sw, ...o });

// ---------- plates: painted once, drawn as images ----------
// A plate is a background or a sprite painted with the full p5.brush kit (watercolour fills included), once, by
// `node render.mjs --plates`, into out/plates/<key>.png. Frames then draw it with drawPlate(), which costs almost
// nothing. definePlate(key, { w, h, res, paint(w, h), mask(ctx, w, h), variants, c2a, paperBg }):
//   w, h:     size in world px; res: pixel density of the PNG (1 default, 1.5–2 for close-ups)
//   paint:    draws the plate with paint()/inkLine(), origin at the plate's top-left
//   mask:     optional Canvas2D silhouette (fill it) that becomes the alpha channel: a clean cut-out, no paper halo
//   c2a:      true = "colour to alpha" against the paper: washes become transparent pigment (mist, shadows, clouds)
//   variants: n boil drawings (painted with different seeds); drawPlate cycles them at the boil rate
//   paperBg:  paint over the paper texture (default for opaque plates) instead of a flat paper colour
const PLATES = {};           // key -> def
const PLATE_IMG = {};        // key#variant -> p5.Image (filled at setup from out/plates)
function definePlate(key, def) { PLATES[key] = { w: W, h: H, res: 1, variants: 1, ...def }; }
function plateVariant(key, v = null) {
  const d = PLATES[key]; if (!d) return null;
  const n = d.variants || 1, i = v == null ? BOILN % n : v % n;
  return PLATE_IMG[key + '#' + i] || null;
}
// drawPlate(key, x, y, { s, rot, ax, ay, alpha, v, flip }): (x, y) is where the anchor (ax, ay in 0..1 of the plate) lands.
function drawPlate(key, x = 0, y = 0, o = {}) {
  const d = PLATES[key], img = plateVariant(key, o.v);
  if (!d) { console.warn('no plate ' + key); return; }
  const s = o.s ?? 1, w = d.w * s, h = d.h * s, ax = o.ax ?? 0, ay = o.ay ?? 0;
  if (!img) { paint(rectPts(x - ax * w, y - ay * h, w, h), { wash: '#E9C7C7', washOp: 120, ink: PAL.red, sw: 1 }); return; }
  flushBrush();
  push(); translate(x, y); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (o.sx ?? 1), o.sy ?? 1);
  if (o.tint) { const c = color(o.tint); if (o.alpha != null) c.setAlpha(255 * clamp(o.alpha)); tint(c); }
  else if (o.alpha != null && o.alpha < 1) tint(255, 255 * clamp(o.alpha));
  image(img, -ax * w, -ay * h, w, h);
  noTint(); pop();
}
// part of a plate: source rect (sx, sy, sw, sh) in world px → destination (dx, dy) at scale s
function drawPlatePart(key, sx, sy, sw, sh, dx, dy, s = 1, o = {}) {
  const d = PLATES[key], img = plateVariant(key, o.v); if (!d || !img) return;
  flushBrush(); const r = img.width / d.w;
  if (o.alpha != null && o.alpha < 1) tint(255, 255 * clamp(o.alpha));
  image(img, dx, dy, sw * s, sh * s, sx * r, sy * r, sw * r, sh * r); noTint();
}

// ---------- lettering (drawn on the 2D compositor, under the paper grain) ----------
function letter(txt, x, y, size, color, o = {}) {
  if (CAM && !o.screen) { [x, y] = toScreen(x, y); size *= CAM.zoom; o = { ...o, rot: (o.rot || 0) + CAM.rot, maxW: o.maxW ? o.maxW * CAM.zoom : o.maxW }; }
  LETTERS.push({ txt, x, y, size, color, ...o });
}
function sfx(txt, x, y, size, color, age, o = {}) {
  const life = o.life ?? 1.2; if (age < 0 || age > life) return;
  letter(txt, x, y, size, color, { font: FONT.marker, pop: age * 5, rot: (o.rot ?? -.08) + Math.sin(age * 20) * .03 * (1 - age / life), alpha: 1 - seg(age, life - .25, life), ...o });
}
function drawLetters(c) {
  for (const L of LETTERS) {
    const k = L.pop != null ? backOut(L.pop) : 1; if (k <= .01) continue;
    c.save(); c.translate(L.x, L.y); c.rotate(L.rot || 0); c.scale(k, k); c.globalAlpha = clamp(L.alpha ?? 1);
    c.font = `${L.weight || 600} ${L.size}px ${L.font || FONT.round}`;
    c.textAlign = L.align || 'center'; c.textBaseline = 'middle';
    const lines = String(L.txt).split('\n'), lh = L.size * (L.lh || 1.15);
    lines.forEach((ln, i) => {
      const yy = (i - (lines.length - 1) / 2) * lh;
      let sx = 1; if (L.maxW) { const w = c.measureText(ln).width; if (w > L.maxW) sx = L.maxW / w; }
      c.save(); c.scale(sx, 1);
      if (L.stroke) { c.lineJoin = 'round'; c.lineWidth = L.size * (L.strokeW || .16); c.strokeStyle = L.stroke; c.strokeText(ln, 0, yy); }
      if (L.ink) { c.fillStyle = PAL.ink; c.fillText(ln, L.size * .045, yy + L.size * .055); }
      c.fillStyle = L.color; c.fillText(ln, 0, yy);
      c.restore();
    });
    c.restore();
  }
}
// Only when brush work is pending: a flush costs ~70 ms, and sprites/glows call it before every image they draw.
let BRUSH_DIRTY = true;
function flushBrush(force = false) {
  if (PLATE_REC) return;
  if (!BRUSH_DIRTY && !force) return; BRUSH_DIRTY = false;
  push(); resetMatrix(); translate(-width / 2, -height / 2);
  brush.noStroke(); brush.noHatch(); brush.noWash(); brush.fill('#000000', 1); brush.fillBleed(0); brush.fillTexture(0, 0);
  brush.polygon([[-50, -50], [-40, -50], [-40, -40]]); brush.noFill(); pop();
}
function flushLetters() {
  if (!LETTERS.length) return;
  letG.clear(); drawLetters(letG.drawingContext); LETTERS = [];
  flushBrush();
  push(); resetMatrix(); translate(-W / 2, -H / 2); image(letG, 0, 0); pop();
}

// ---------- paper ----------
function lcg(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function makePaper(w = W, h = H, seed = 11) {
  const g = createGraphics(w, h); g.pixelDensity(1); const c = g.drawingContext, rnd = lcg(seed);
  c.fillStyle = PAL.paper; c.fillRect(0, 0, w, h);
  const k = w * h / (W * H);
  for (let i = 0; i < 70 * k; i++) { const x = rnd() * w, y = rnd() * h, r = 120 + rnd() * 380, gr = c.createRadialGradient(x, y, 0, x, y, r), a = .045 * rnd(); gr.addColorStop(0, `rgba(160,125,80,${a})`); gr.addColorStop(1, 'rgba(160,125,80,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, 2 * r, 2 * r); }
  c.lineWidth = 1;
  for (let i = 0; i < 1400 * k; i++) { const x = rnd() * w, y = rnd() * h, l = 6 + rnd() * 26, a = rnd() * TAU; c.strokeStyle = `rgba(110,88,60,${.035 + rnd() * .06})`; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a + .6) * l * .5, y + Math.sin(a + .6) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  return g;
}
function makeGrain() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), rnd = lcg(5);
  const id = c.createImageData(W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = 255 - (rnd() < .55 ? rnd() * rnd() * 34 : 0); d[i] = v; d[i + 1] = v - 1; d[i + 2] = v - 3; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
  const g = c.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(150,115,85,.32)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return cv;
}

// ---------- custom brushes ----------
function defineBrushes() {
  brush.add('ink', { type: 'default', weight: 5, scatter: .25, sharpness: .8, grain: 40, opacity: 235, spacing: .2, pressure: [1.15, .75], rotate: 'natural', noise: .15 });
  brush.add('inkfine', { type: 'default', weight: 2.6, scatter: .15, sharpness: .85, grain: 40, opacity: 230, spacing: .2, pressure: [1.1, .8], rotate: 'natural', noise: .1 });
  brush.add('dry', { type: 'default', weight: 14, scatter: 3, sharpness: .3, grain: 6, opacity: 90, spacing: .6, pressure: [1, .6], rotate: 'natural', noise: .4 });
}

// ---------- frame ----------
const QS = new URLSearchParams(location.search);
const PLATE_MODE = QS.get('plate');      // "key#variant": this page paints one plate and nothing else
async function setup() {
  let cw = W, ch = H, pd = null;
  if (PLATE_MODE) { const [k] = PLATE_MODE.split('#'); pd = PLATES[k]; cw = Math.round(pd.w * pd.res); ch = Math.round(pd.h * pd.res); }
  createCanvas(cw, ch, WEBGL); pixelDensity(1); noLoop();
  brush.scaleBrushes(5); defineBrushes();
  glowTex = makeGlowTex();
  if (PLATE_MODE) { window.ready = true; return; }
  paperG = makePaper(); grainC = makeGrain(); letG = createGraphics(W, H); letG.pixelDensity(1);
  outC = document.getElementById('out'); outX = outC.getContext('2d');
  await Promise.all(['600 100px "Fredoka"', '100px "Permanent Marker"', '100px "Patrick Hand"'].map(f => document.fonts.load(f)));
  await loadPlates();
  window.ready = true;
  if (!QS.has('render')) devUI();
}
// out/plates/manifest.js (written by render.mjs --plates) lists the PNGs that exist.
async function loadPlates() {
  if (QS.has('noplates')) return;
  const list = window.PLATE_FILES || {};
  await Promise.all(Object.entries(list).map(async ([id, file]) => { try { PLATE_IMG[id] = await loadImage(file); } catch (e) { console.warn('plate load failed ' + id); } }));
}
function draw() {
  if (!window.ready) return;
  LETTERS = []; CAM = LAST_CAM = null; BRUSH_DIRTY = true;
  if (PLATE_MODE) return;
  push(); translate(-W / 2, -H / 2);
  BOILN = Math.floor(T * BOIL); CAST_N = 0; boilSeed('frame'); noiseSeed(77);
  image(paperG, 0, 0);
  drawWorld(T);
  pop();
}
function composite(t) {
  const c = outX;
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  c.drawImage(drawingContext.canvas, 0, 0, W, H);
  drawLetters(c);
  c.globalCompositeOperation = 'multiply'; c.drawImage(grainC, 0, 0);
  c.globalCompositeOperation = 'source-over';
}
window.renderAt = async (t, type = 'image/png', q = .92) => { T = t; await redraw(); composite(t); return outC.toDataURL(type, q); };
// Paint one plate (plate mode): returns a PNG data URL, with the mask or colour-to-alpha applied.
window.paintPlate = async (id) => {
  const [key, vs] = id.split('#'), d = PLATES[key], v = +(vs || 0);
  const cw = width, ch = height;
  // 1. record the plate's paint calls (geometry and jitter are computed now, seeded)
  BOILN = 1000 + v * 7; boilSeed('plate ' + key); randomSeed(Math.floor(hashS(key + v) * 1e9)); noiseSeed(7 + v);
  PLATE_REC = []; d.paint(d.w, d.h, v); const ops = PLATE_REC; PLATE_REC = null;
  // 2. replay them, a few per draw (each draw ends with a full p5.brush composite)
  const per = d.opsPerDraw || 1;
  for (let i = 0; i < Math.max(1, ops.length); i += per) {
    window.draw = () => {
      push(); translate(-cw / 2, -ch / 2);
      if (i === 0) { const bg = d.mask || d.c2a ? null : makePaper(cw, ch, 11 + v); if (bg) image(bg, 0, 0); else { noStroke(); fill(d.mask ? (d.maskBg || PAL.ink) : '#FFFFFF'); rect(0, 0, cw, ch); } }
      scale(d.res); for (let j = i; j < Math.min(ops.length, i + per); j++) ops[j](); pop();
    };
    await redraw();
  }
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const c = cv.getContext('2d');
  c.drawImage(drawingContext.canvas, 0, 0);
  if (d.c2a) {                                   // colour to alpha against white: pigment stays, paper goes
    const id2 = c.getImageData(0, 0, cw, ch), p = id2.data;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i] / 255, g = p[i + 1] / 255, b = p[i + 2] / 255, a = Math.max(1 - r, 1 - g, 1 - b);
      if (a < 1e-3) { p[i + 3] = 0; continue; }
      p[i] = 255 * (1 - (1 - r) / a); p[i + 1] = 255 * (1 - (1 - g) / a); p[i + 2] = 255 * (1 - (1 - b) / a); p[i + 3] = 255 * a;
    }
    c.putImageData(id2, 0, 0);
  }
  if (d.mask) {                                  // silhouette → alpha: a clean cut-out, no paper halo
    const m = document.createElement('canvas'); m.width = cw; m.height = ch; const mc = m.getContext('2d');
    mc.scale(d.res, d.res); mc.fillStyle = '#fff'; mc.strokeStyle = '#fff'; mc.lineJoin = 'round'; d.mask(mc, d.w, d.h, v);
    c.globalCompositeOperation = 'destination-in'; c.drawImage(m, 0, 0); c.globalCompositeOperation = 'source-over';
  }
  return cv.toDataURL('image/png');
};
window.renderSheet = async (times, cols = 3, w = 640, crop = null, at = null) => {
  if (at) at = at.map((v) => typeof v === 'string' ? (0, eval)(v) : v);
  const [, , cw, ch] = at || crop || [0, 0, W, H], h = Math.round(w * ch / cw), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); T = times[i]; await redraw(); composite(times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h;
    const [cx, cy] = at ? toScreen(at[0], at[1], LAST_CAM).map((v, j) => v - (j ? ch : cw) / 2) : crop || [0, 0];
    c.drawImage(outC, cx, cy, cw, ch, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
window.gpuInfo = () => { const gl = drawingContext, e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); };

function devUI() {
  const s = document.getElementById('scrub'), lab = document.getElementById('tt'); if (!s) return; s.max = window.LOOP ? window.LOOP.len : DUR;
  let busy = false, want = null;
  const go = async () => { if (busy) return; busy = true; while (want != null) { const t = want; want = null; const t0 = performance.now(); await window.renderAt(t); lab.textContent = `${t.toFixed(2)}s  ·  ${Math.round(performance.now() - t0)} ms/frame`; } busy = false; };
  s.addEventListener('input', () => { want = +s.value; go(); });
  want = +(QS.get('t') || 0); s.value = want; go();
}
