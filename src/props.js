// props.js: the recurring objects of the film. Heavy textured ones are plates (sprites painted once, cut out by
// their silhouette); light or animated ones are drawn live with wash + ink.
//
//   tractor(x, y, s, o)        electric tractor, side view, facing right; (x, y) = ground under the middle
//   sensor(x, y, s, t, o)      soil sensor planted like a glowing mushroom
//   well(x, y, s, t, o)        glowing data well (Act I); o.fill 0..1 = light column, o.count text
//   funnel(x, y, s, o)         the sorting funnel's top hopper (1.4); floors are drawn by the scene
//   dome(x, y, s, t, o)        MAELIA under its glass dome; o.open 0..1 lifts the dome (2.6)
//   futureTree(cx, cy, s, t, o) the tree of futures: branches from "aujourd'hui"; o.events per branch
//   padlock(x, y, s, o)        ochre padlock (lock-in); o.shut 0..1
//   parchment(x, y, s, o)      one document (a sprite: cheap, drawn hundreds of times)
//   cite(txt, k, o)            study citation "Auteur et al., année", small, bottom-right above the caption band

// ---------- the electric tractor (sprite) ----------
const TRACTOR_PTS = [[40, 330], [60, 210], [150, 200], [190, 90], [400, 70], [430, 90], [440, 200], [560, 215], [600, 250], [600, 330]];
definePlate('tractor', { w: 640, h: 420, res: 1.5, mask(c) {
  c.lineWidth = 14; c.beginPath(); TRACTOR_PTS.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.stroke();
  for (const [x, y, r] of [[160, 320, 96], [505, 345, 66]]) { c.beginPath(); c.arc(x, y, r + 7, 0, TAU); c.fill(); }
}, paint(w, h) {
  const body = '#E7EEF0', acc = PAL.soil;
  wcw([[40, 330], [60, 215], [440, 205], [560, 215], [600, 250], [600, 330]], PAL.soil, 255, '#2F6139', 110);       // chassis + hood
  wcw([[190, 205], [205, 95], [400, 78], [430, 95], [440, 205]], body, 255, '#C6D6DA', 90);                       // cab
  wcw([[222, 195], [232, 110], [385, 98], [410, 112], [415, 195]], '#BFE3EA', 255, '#9CCFD9', 80);               // glass
  paint([[150, 205], [190, 200], [205, 95], [400, 70], [430, 90], [440, 205]], { ink: PAL.ink, sw: 1.1 });
  paint([[40, 330], [60, 212], [440, 205], [560, 215], [600, 250], [600, 330]], { ink: PAL.ink, sw: 1.1 });
  pen([[300, 102], [306, 195]], .9);
  // solar roof and a lightning-bolt charge light
  paint([[196, 88], [412, 66], [432, 84], [214, 104]], { wash: '#3E5F8A', washOp: 255, ink: PAL.ink, sw: .8 });
  for (let k = 1; k < 5; k++) pen([[196 + k * 44, 88 - k * 4.4], [214 + k * 44, 104 - k * 4.4]], .5, '#9DB6D0', 0);
  paint([[500, 238], [520, 238], [508, 256], [524, 256], [496, 284], [504, 262], [490, 262]], { wash: PAL.data, washOp: 255, ink: PAL.ink, sw: .5 });
  pen([[455, 280], [590, 280]], .7, '#2F6139', 0); pen([[455, 300], [590, 300]], .7, '#2F6139', 0);
  // wheels
  for (const [x, y, r] of [[160, 320, 96], [505, 345, 66]]) {
    wcw(ellPts(x, y, r, r, 30), '#3A3440', 255, '#2B2530', 100);
    paint(ellPts(x, y, r * .55, r * .55, 22), { wash: '#D9A45A', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(ellPts(x, y, r * .18, r * .18, 12), { wash: '#5A4A3A', washOp: 255, ink: PAL.ink, sw: .6 });
    for (let k = 0; k < 14; k++) { const a = k / 14 * TAU; pen([[x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8], [x + Math.cos(a + .15) * r * .98, y + Math.sin(a + .15) * r * .98]], 1.1, '#1F1A22', 0); }
    paint(ellPts(x, y, r, r, 30), { ink: PAL.ink, sw: 1.1 });
  }
} });
function tractor(x, y, s = 1, o = {}) { drawPlate('tractor', x, y, { s, ax: .5, ay: 420 / 420 * .97, flip: o.flip }); }

// ---------- a soil sensor: a glowing mushroom ----------
function sensor(x, y, s, t, o = {}) {
  boilSeed('sensor' + (o.key ?? x));
  const on = o.on ?? (.5 + .5 * Math.sin(t * 3 + x * .01)), col = o.col || PAL.data;
  inkLine([[x, y], [x + 1 * s, y - 12 * s]], 2.2 * s, '#DCD3C2', 'ink', 0);
  if (on > .05) glow(x, y - 16 * s, 30 * s * (.6 + on * .6), col, .55 * on);
  paint([[x - 11 * s, y - 12 * s], [x + 12 * s, y - 12 * s], [x + 8 * s, y - 20 * s], [x, y - 23 * s], [x - 8 * s, y - 20 * s]], { wash: mixCol('#EDE6DA', col, .35 + .4 * on), washOp: 255, ink: PAL.ink, sw: .45 * s, curv: .4 });
  paint(ellPts(x, y - 17 * s, 2.2 * s, 2.2 * s, 8), { wash: col, washOp: 255, ink: null });
}

// ---------- a glowing data well ----------
definePlate('well', { w: 420, h: 300, res: 1.5, mask(c) { c.beginPath(); c.ellipse(210, 150, 200, 138, 0, 0, TAU); c.fill(); }, paint(w, h) {
  wcw(ellPts(210, 150, 196, 132, 36), '#9A8A7A', 255, '#7A6A5A', 110);           // stone rim
  for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; pen([[210 + Math.cos(a) * 150, 150 + Math.sin(a) * 100], [210 + Math.cos(a) * 196, 150 + Math.sin(a) * 132]], .8, '#5A4A3A', 0); }
  wcw(ellPts(210, 150, 150, 100, 32), '#1F3A5F', 255, '#16304F', 120);           // the dark mouth
  blob(210, 150, 110, '#3BC4D8', 170, .15); blob(210, 150, 60, '#BDF1F6', 170, .12);
  paint(ellPts(210, 150, 196, 132, 36), { ink: PAL.ink, sw: 1 }); paint(ellPts(210, 150, 150, 100, 32), { ink: PAL.ink, sw: .8 });
} });
function well(x, y, s, t, o = {}) {
  const f = o.fill ?? 0;
  if (f > .02) { glow(x, y - 20 * s, 160 * s * (.7 + .3 * f), PAL.data, .55 * f); }
  drawPlate('well', x, y, { s: s * .9, ax: .5, ay: .5 });
  boilSeed('well' + x);
  if (f > .02) {   // a column of light rising from the mouth
    const hh = 260 * s * f;
    paint([[x - 90 * s, y], [x + 90 * s, y], [x + 60 * s, y - hh], [x - 60 * s, y - hh]], { wash: '#BDF1F6', washOp: 60 * f, ink: null });
    glow(x, y - hh * .6, 110 * s, '#BDF1F6', .35 * f);
  }
}

// ---------- the funnel's hopper (the top of the sorting machine) ----------
function funnel(x, y, s, o = {}) {
  boilSeed('funnel');
  const c = PAL.night, lt = '#34547E', w0 = 520 * s, w1 = 120 * s, hh = 300 * s;
  paint([[x - w0, y], [x + w0, y], [x + w1, y + hh], [x - w1, y + hh]], { wash: c, washOp: 255, ink: PAL.ink, sw: 1.2 });
  paint([[x - w0 * .9, y + 16 * s], [x - w0 * .55, y + 16 * s], [x - w1 * .6, y + hh - 10 * s], [x - w1 * .9, y + hh - 10 * s]], { wash: lt, washOp: 200, ink: null });
  paint(rrPts(x - w0 - 20 * s, y - 26 * s, 2 * w0 + 40 * s, 36 * s, 14 * s), { wash: '#46638C', washOp: 255, ink: PAL.ink, sw: 1 });
  for (let k = -3; k <= 3; k++) paint(ellPts(x + k * w0 * .28, y - 8 * s, 6 * s, 6 * s, 8), { wash: '#C9A04A', ink: PAL.ink, sw: .4 });   // rivets
  paint(rrPts(x - w1 - 14 * s, y + hh - 6 * s, 2 * w1 + 28 * s, 50 * s, 10 * s), { wash: '#46638C', washOp: 255, ink: PAL.ink, sw: 1 });
  if (o.gauge != null) {   // a round counter dial on the side
    paint(ellPts(x + w0 * .62, y + 90 * s, 46 * s, 46 * s, 20), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1 });
    const a = -Math.PI * .8 + o.gauge * Math.PI * 1.6; inkLine([[x + w0 * .62, y + 90 * s], [x + w0 * .62 + Math.cos(a) * 36 * s, y + 90 * s + Math.sin(a) * 36 * s]], 1.4, PAL.red, 'ink', 0);
  }
}

// ---------- MAELIA under its glass dome ----------
// the miniature territory, painted once (a round tabletop world): parcels, a river, tiny farms and trees
definePlate('maquette', { w: 900, h: 440, res: 1.3, mask(c) { c.beginPath(); c.ellipse(450, 222, 447, 214, 0, 0, TAU); c.fill(); }, paint(w, h) {
  area(ellPts(450, 228, 444, 208, 40), '#8A6246', '#6E4A34', 120);                     // the wooden edge of the tabletop world
  area(ellPts(450, 210, 438, 196, 40), '#A2C676', '#8DB866', 110);
  const cols = ['#C6D98F', '#E3C98A', '#9DC07B', '#D9B872', '#B4CF84', '#E8D39A'];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 8; i++) {
    const cx = 80 + i * 105, cy = 70 + j * 90; if (Math.pow((cx - 450) / 420, 2) + Math.pow((cy - 210) / 190, 2) > .85) continue;
    area([[cx - 48, cy - 38], [cx + 50, cy - 36], [cx + 46, cy + 40], [cx - 50, cy + 38]], cols[(i * 3 + j) % 6], null, 110, .03);
  }
  const R = [[40, 250], [200, 200], [380, 240], [560, 180], [760, 220], [880, 170]];
  paint(subdiv(ribbon(R, 26, 34), 30), { fill: '#56A6B3', fillOp: 230, bleed: .03, tex: .4, border: .4, ink: null });
  pen(R, .6, '#2F6F7A');
  for (const [x, y] of [[230, 120], [620, 300], [700, 110], [330, 320]]) { paint(rectPts(x, y, 26, 18), { wash: '#EFE3CF', washOp: 255, ink: PAL.ink, sw: .45 }); paint([[x - 3, y], [x + 29, y], [x + 13, y - 12]], { wash: PAL.red, washOp: 255, ink: PAL.ink, sw: .45 }); }
  for (let k = 0; k < 14; k++) blob(80 + hash(k + 4) * 740, 60 + hash(k + 9) * 300, 12 + hash(k) * 8, '#5E8C4E', 220, .08);
  paint(ellPts(450, 210, 438, 196, 40), { ink: PAL.ink, sw: .9 }); paint(ellPts(450, 228, 444, 208, 40), { ink: PAL.ink, sw: 1 });
} });
function dome(x, y, s, t, o = {}) {
  boilSeed('dome');
  const open = o.open || 0, dy = -open * 520 * s;
  // pedestal: a round wooden table
  paint([[x - 520 * s, y], [x + 520 * s, y], [x + 470 * s, y + 90 * s], [x - 470 * s, y + 90 * s]], { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: 1.1 });
  paint(ellPts(x, y, 520 * s, 70 * s, 30), { wash: '#D2A874', washOp: 255, ink: PAL.ink, sw: 1.1 });
  drawPlate('maquette', x, y - 4 * s, { s: s * 1.05, ax: .5, ay: .5 });
  if (o.agents) o.agents(x, y, s, t);                           // tiny living agents drawn by the scene
  // the glass: a tall bell of pale light with bright rim strokes (no fill mud: a faint cream wash + highlights)
  const bh = 560 * s, bw = 470 * s, top = y - bh + dy;
  const bell = [[x - bw, y + dy], [x - bw * .98, y - bh * .55 + dy], [x - bw * .7, y - bh * .92 + dy], [x - bw * .25, top], [x + bw * .25, top], [x + bw * .7, y - bh * .92 + dy], [x + bw * .98, y - bh * .55 + dy], [x + bw, y + dy]];
  paint(bell, { wash: '#EAF6F8', washOp: 55, ink: null, curv: .5 });
  paint(bell, { ink: '#7FA9B8', sw: 1.2, curv: .5 });
  inkLine([[x - bw * .82, y - bh * .2 + dy], [x - bw * .8, y - bh * .62 + dy], [x - bw * .55, y - bh * .88 + dy]], 3.2, PAL.cream, 'ink', .6);
  inkLine([[x + bw * .6, y - bh * .78 + dy], [x + bw * .72, y - bh * .6 + dy]], 2.2, PAL.cream, 'ink', .6);
  paint(ellPts(x, top - 18 * s, 34 * s, 22 * s, 14), { wash: '#C9A04A', ink: PAL.ink, sw: .8 });   // knob
  paint(ellPts(x, y + dy, bw, 40 * s, 30), { ink: '#7FA9B8', sw: .9 });
}

// ---------- the tree of futures ----------
// futureTree(cx, cy, s, t, o): grows from the "aujourd'hui" node at (cx, cy) toward +x. o.grow 0..1, o.seed,
// o.dim (branches that fade), o.mark(branch, tip) callback to hang events (padlocks, doors, valleys).
// Returns the list of branches: { pts, tip, depth, i } so scenes can attach things to them.
function treeBranches(cx, cy, s, seed = 1, depth = 3) {
  const out = [];
  const grow = (x, y, a, len, d, id) => {
    if (d > depth) return;
    const n = d === 0 ? 3 : 2;
    for (let k = 0; k < n; k++) {
      const spread = d === 0 ? (k - 1) * .55 : (k - .5) * .6, a2 = a + spread + (hash(seed * 31 + id * 7 + k) - .5) * .25;
      const l = len * (.78 + hash(seed + id * 3 + k) * .3), ex = x + Math.cos(a2) * l, ey = y + Math.sin(a2) * l;
      const mx = (x + ex) / 2 + Math.cos(a2 + 1.4) * l * .12, my = (y + ey) / 2 + Math.sin(a2 + 1.4) * l * .12;
      const b = { pts: [[x, y], [mx, my], [ex, ey]], tip: [ex, ey], depth: d, i: out.length, id: id * 3 + k };
      out.push(b); grow(ex, ey, a2, l * .78, d + 1, id * 3 + k + 1);
    }
  };
  grow(cx, cy, 0, 300 * s, 0, 1);
  return out;
}
function futureTree(cx, cy, s, t, o = {}) {
  const B = o.branches || treeBranches(cx, cy, s, o.seed || 1, o.depth ?? 3), g = o.grow ?? 1;
  for (const b of B) {
    boilSeed('tb' + b.i);
    const k = clamp(g * (1 + (o.depth ?? 3)) - b.depth);            // branches grow in by depth
    if (k <= 0) continue;
    const state = (o.state && o.state(b)) || { a: 1 };
    const pts = through(b.pts, 6), m = Math.max(2, Math.round(pts.length * k)), P = pts.slice(0, m);
    const col = state.col || PAL.data, w = (state.w ?? 1) * (3.2 - b.depth * .55) * s;
    if (state.a > .05 && !state.noGlow) for (let j = 0; j < P.length; j += 3) glow(P[j][0], P[j][1], 26 * s * (1.2 - b.depth * .2), col, .22 * state.a);
    inkLine(P, Math.max(.4, w), state.a < 1 ? mixCol(PAL.night, col, state.a) : col, 'ink', .5);
    if (k >= 1 && !state.noTip) paint(ellPts(b.tip[0], b.tip[1], (7 - b.depth) * s, (7 - b.depth) * s, 10), { wash: state.tipCol || (state.a < 1 ? mixCol(PAL.night, col, state.a) : PAL.cream), washOp: 255, ink: null });
  }
  // today's node
  boilSeed('tb root');
  glow(cx, cy, 60 * s, PAL.ochre, .8);
  paint(ellPts(cx, cy, 16 * s, 16 * s, 14), { wash: PAL.ochre, ink: PAL.ink, sw: .8 });
  return B;
}
function padlock(x, y, s, o = {}) {
  boilSeed('lock' + Math.round(x));
  const shut = o.shut ?? 1, lift = (1 - ease(shut)) * 14 * s;
  inkLine([[x - 12 * s, y - 6 * s], [x - 12 * s, y - 22 * s - lift], [x, y - 32 * s - lift], [x + 12 * s, y - 22 * s - lift], [x + 12 * s, y - 6 * s - (1 - shut) * 10 * s]], 4 * s, '#8A6A2A', 'ink', .6);
  paint(rrPts(x - 20 * s, y - 8 * s, 40 * s, 32 * s, 6 * s), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 * s });
  paint(ellPts(x, y + 6 * s, 4 * s, 5 * s, 8), { wash: PAL.ink, ink: null });
}

// ---------- parchments (documents) ----------
definePlate('parch', { w: 90, h: 110, res: 2, variants: 2, mask(c) { c.beginPath(); c.moveTo(6, 6); c.lineTo(66, 6); c.lineTo(84, 24); c.lineTo(84, 104); c.lineTo(6, 104); c.closePath(); c.fill(); c.lineWidth = 6; c.stroke(); }, paint(w, h) {
  wcw([[8, 8], [64, 8], [82, 26], [82, 102], [8, 102]], '#FFF6E2', 255, '#EFD9AE', 90);
  paint([[64, 8], [64, 26], [82, 26]], { wash: '#E6CFA0', washOp: 255, ink: PAL.ink, sw: .6 });
  for (let k = 0; k < 6; k++) pen([[18, 36 + k * 11], [70 - (k % 3) * 8, 36 + k * 11]], .5, '#A48A6A', 0);
  paint([[8, 8], [64, 8], [82, 26], [82, 102], [8, 102]], { ink: PAL.ink, sw: .8 });
} });
definePlate('parch_x', { w: 90, h: 110, res: 2, mask(c) { c.beginPath(); c.moveTo(6, 6); c.lineTo(66, 6); c.lineTo(84, 24); c.lineTo(84, 104); c.lineTo(6, 104); c.closePath(); c.fill(); c.lineWidth = 6; c.stroke(); }, paint(w, h) {
  wcw([[8, 8], [64, 8], [82, 26], [82, 102], [8, 102]], '#F3D2C6', 255, '#E0A796', 90);
  paint([[64, 8], [64, 26], [82, 26]], { wash: '#D9A08E', washOp: 255, ink: PAL.ink, sw: .6 });
  for (let k = 0; k < 6; k++) pen([[18, 36 + k * 11], [70 - (k % 3) * 8, 36 + k * 11]], .5, '#A06A5A', 0);
  paint([[8, 8], [64, 8], [82, 26], [82, 102], [8, 102]], { ink: PAL.ink, sw: .8 });
} });
function parchment(x, y, s = 1, o = {}) { drawPlate(o.out ? 'parch_x' : 'parch', x, y, { s, rot: o.rot || 0, ax: .5, ay: .5, alpha: o.alpha, v: o.v }); }

// ---------- study citation (small, bottom right, above the subtitle band) ----------
// cites: ['Patil et al., 2025 : modèle, ombre, jumeau', ...] — stacked upward from y 930. k = 0..1 appear.
function cite(txts, k = 1, o = {}) {
  const L = Array.isArray(txts) ? txts : [txts], x = o.x ?? 1880, y0 = o.y ?? 928;
  L.forEach((txt, i) => {
    const kk = clamp(k * L.length - i * .5), p = backOut(kk); if (p < .02) return;
    const y = y0 - (L.length - 1 - i) * 40;
    boilSeed('cite' + i);
    const wdt = Math.min(760, txt.length * 11.2 + 34);
    push(); translate(x, y); scale(p);
    paint(rrPts(-wdt, -17, wdt, 34, 8, 1), { wash: PAL.cream, washOp: 225, ink: mixCol(PAL.ink, PAL.cream, .45), sw: .6 });
    pop();
    letter(txt, x - 14, y + 1, 20 * p, PAL.night, { align: 'right', weight: 500, screen: true, maxW: wdt - 24 });
  });
}
