// decor.js: the film's painted settings, as plates (painted once with watercolour fills, then drawn as images).
// Palettes follow the production brief (§ 3): dawn field, grain-silo library, territory + MAELIA, tree of futures,
// La Réunion, Sénégal, archipelago. Plates are 2400 × 1350 world px unless noted, so the camera can pan and push.
//
// Painting helpers (plate-time only: they use watercolour fills, far too slow per frame):
//   wc(pts, col, op, bleed, tex, border)   watercolour area (edges subdivided so long sides don't saw-tooth)
//   band(x0, x1, yTop(x), yBot, col, …)    a full-width ground/sky band with a wavy top
//   blob(x, y, r, col, op, bleed)          a soft round bloom (sun, foliage, light patches)
//   sky(w, h, stops)                       stacked bleeding bands, top to bottom

function subdiv(P, maxLen = 60) {
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / maxLen));
    for (let k = 0; k < n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]);
  }
  return out;
}
const wc = (P, col, op = 150, bleed = .04, tex = .5, border = .3) => paint(subdiv(P), { fill: col, fillOp: op, bleed, tex, border, ink: null });
const wcw = (P, col, op = 255, fillCol = null, fop = 90) => paint(subdiv(P), { wash: col, washOp: op, fill: fillCol || col, fillOp: fop, bleed: .03, tex: .6, border: .35, ink: null });
// an opaque area with watercolour texture and darker pooled edges: the base recipe for every decor shape
const area = (P, base, texCol = null, fop = 120, bleed = .035) => paint(subdiv(P), { wash: base, washOp: 255, fill: texCol || mixCol(base, PAL.ink, .12), fillOp: fop, bleed, tex: .65, border: .5, ink: null });
function band(x0, x1, yTop, yBot, col, op = 255, bleed = .03, tex = .5, n = 40) {
  const P = []; for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); P.push([x, yTop(x)]); }
  P.push([x1, yBot], [x0, yBot]);
  if (op >= 150) area(P, col, null, 110, bleed); else wc(P, col, op, bleed, tex, .25);
}
const blob = (x, y, r, col, op = 120, bleed = .12) => paint(ellPts(x, y, r, r * .92, 26, r * .06), { fill: col, fillOp: op, bleed, tex: .4, border: .3, ink: null });
// sky: a smooth vertical gradient of opaque washes (many thin bands) with a little watercolour bloom on top
function sky(w, h, stops, y1 = h) {
  const n = 36, col = y => { let i = 0; while (i + 1 < stops.length && y > stops[i + 1][0]) i++; const [a, ca] = stops[i], [b, cb] = stops[Math.min(i + 1, stops.length - 1)]; return b > a ? mixCol(ca, cb, ease((y - a) / (b - a))) : ca; };
  for (let k = 0; k < n; k++) { const ya = -40 + k * (y1 + 80) / n, yb = ya + (y1 + 80) / n + 8; paint([[-40, ya], [w + 40, ya], [w + 40, yb], [-40, yb]], { wash: col((ya + yb) / 2), washOp: 255, ink: null }); }
  for (let k = 0; k < 7; k++) blob(hash(k * 3.3) * w, hash(k * 1.7) * y1 * .8, 180 + hash(k) * 200, mixCol(col(hash(k * 1.7) * y1 * .8), PAL.cream, .4), 90, .3);
}
const wave = (base, amp, f, ph = 0) => x => base + amp * Math.sin(x * f + ph) + amp * .45 * Math.sin(x * f * 2.3 + ph * 1.7);
// ink line in plate painting (a thin, slightly shaky pen line)
const pen = (P, sw = .8, col = PAL.ink, curv = .4) => inkLine(P, sw, col, 'inkfine', curv);
// a tree: trunk + a few foliage blooms + ink scribble
function treeP(x, y, h, col = '#6E9A55', trunk = '#8A6246') {
  paint([[x - h * .05, y], [x + h * .05, y], [x + h * .03, y - h * .55], [x - h * .03, y - h * .55]], { wash: trunk, washOp: 255, ink: PAL.ink, sw: .7 });
  for (const [dx, dy, r] of [[0, -.72, .3], [-.18, -.58, .22], [.2, -.6, .24], [.02, -.9, .2]]) blob(x + dx * h, y + dy * h, r * h, col, 200, .08);
  paint(ellPts(x, y - h * .7, h * .36, h * .3, 18, h * .02), { ink: mixCol(col, PAL.ink, .5), sw: .6 });
}
function baobab(x, y, h) {
  const tr = '#8A6246', tw = h * .2;
  wcw([[x - tw * .9, y], [x + tw * .9, y], [x + tw * .6, y - h * .55], [x + tw * .75, y - h * .62], [x - tw * .75, y - h * .62], [x - tw * .6, y - h * .55]], tr, 255, '#6E4A34', 100);
  for (const [a, l] of [[-2.4, .42], [-1.9, .5], [-1.2, .48], [-.7, .4], [-1.55, .36]]) {
    const bx = x + Math.cos(a) * tw * .4, by = y - h * .6, ex = bx + Math.cos(a) * h * l, ey = by + Math.sin(a) * h * l * .7;
    inkLine([[bx, by], [lerp(bx, ex, .5), lerp(by, ey, .5) - h * .03], [ex, ey]], 2.2, tr, 'ink', .5);
    blob(ex, ey - h * .03, h * .09, '#7E9A4E', 170, .1);
  }
  pen([[x - tw * .9, y], [x - tw * .6, y - h * .55], [x - tw * .75, y - h * .62]], .9);
  pen([[x + tw * .9, y], [x + tw * .6, y - h * .55], [x + tw * .75, y - h * .62]], .9);
}

// ======================== 1. Champ connecté à l'aube (1.1, 3.7) ========================
definePlate('dawn', { w: 2400, h: 1350, paint(w, h) {
  sky(w, h, [[0, '#9EC6DC'], [300, '#CFE2EA'], [520, '#F3D9B6'], [700, '#F6C38A']], 880);
  blob(1560, 600, 300, '#FBE3A6', 130, .25); paint(ellPts(1560, 610, 130, 126, 30, 3), { wash: '#F8C95C', washOp: 255, fill: '#F2B03E', fillOp: 110, bleed: .05, tex: .5, border: .5, ink: null });          // low sun
  for (const [x, y, r] of [[420, 230, 90], [560, 250, 70], [1900, 180, 80], [2040, 210, 60]]) { blob(x, y, r, '#FFF4E4', 200, .18); blob(x + r * .6, y + r * .15, r * .7, '#FBE6D0', 170, .18); }  // clouds
  band(-40, w + 40, wave(700, 26, .004, 1), h, '#C9DAB4', 160);                            // far hills
  band(-40, w + 40, wave(760, 34, .003, 2), h, '#B5CFA3', 190);
  band(-40, w + 40, wave(840, 40, .0026, 4), h, '#98BF86', 200);
  // field mosaic in the middle distance: strips in perspective
  const rows = [['#B9D383', 860, 900], ['#E6C77E', 900, 945], ['#98C170', 945, 1000], ['#D9B86A', 1000, 1065]];
  for (const [c, a, b] of rows) band(-40, w + 40, wave(a, 6, .006, a), b + 20, c, 150, .02, .6);
  for (let k = 0; k < 26; k++) { const x = k * 100 - 60; pen([[x, 880], [x - 90 + k * 4, 1070]], .45, '#7E9A5E'); }
  // greenhouse with solar panels (distance, left)
  wcw([[250, 842], [470, 842], [470, 790], [360, 752], [250, 790]], '#DDEBEE', 255, '#B8D2DA', 80);
  pen([[250, 842], [250, 790], [360, 752], [470, 790], [470, 842]], .7);
  for (let i = 0; i < 4; i++) { const x = 520 + i * 44; paint([[x, 840], [x + 38, 840], [x + 30, 815], [x - 8, 815]], { wash: '#3E5F8A', washOp: 255, ink: PAL.ink, sw: .5 }); }
  // weather station (right) and a wind vane
  pen([[1980, 860], [1980, 700]], 1.1); paint(rectPts(1955, 720, 50, 40), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 });
  pen([[1980, 700], [2030, 690]], .8); paint(ellPts(2030, 690, 10, 10, 10), { wash: PAL.ochre, ink: PAL.ink, sw: .5 });
  for (const k of [0, 1, 2]) { const a = k * TAU / 3; pen([[1980, 704], [1980 + Math.cos(a) * 26, 704 + Math.sin(a) * 10]], .7); }
  // a few trees and a farm on the hill line
  treeP(820, 780, 110); treeP(900, 790, 80, '#7FA968'); treeP(2230, 820, 120, '#6E9A55');
  wcw([[1180, 790], [1300, 790], [1300, 740], [1240, 705], [1180, 740]], '#E9D6B8', 255, '#D8BE98', 80);
  paint([[1170, 742], [1240, 700], [1310, 742]], { wash: PAL.red, washOp: 255, ink: PAL.ink, sw: .6 });
  pen([[1180, 790], [1180, 740], [1240, 705], [1300, 740], [1300, 790]], .6);
  // foreground grass
  band(-40, w + 40, wave(1080, 18, .008, 3), h + 40, '#A9CC7E', 220);
  band(-40, w + 40, wave(1170, 14, .011, 5), h + 40, '#94C06A', 200);
  for (let i = 0; i < 70; i++) { const x = hash(i) * w, y = 1100 + hash(i + 50) * 230, l = 14 + hash(i + 9) * 22; pen([[x, y], [x + 4, y - l]], .7, '#6E9A55', .3); pen([[x + 6, y], [x + 12, y - l * .8]], .6, '#6E9A55', .3); }
} });

// ======================== 2. Grande Bibliothèque-silo (Act I) ========================
// The inside of a round grain silo turned into a library: curved wood walls, ring shelves, a skylight.
function silo(w, h, tall = false) {
  area([[-40, -40], [w + 40, -40], [w + 40, h + 40], [-40, h + 40]], '#E8C48C', '#D9AE72', 90, .02);
  // curved wall staves, darker to the sides (roundness)
  for (let i = 0; i < 14; i++) { const x0 = i * w / 14, k = Math.abs(i - 6.5) / 6.5; wc([[x0, -40], [x0 + w / 14 + 6, -40], [x0 + w / 14 + 6, h + 40], [x0, h + 40]], '#B98A57', 30 + 90 * k * k, .02, .6, .3); }
  for (let i = 0; i <= 14; i++) pen([[i * w / 14, -40], [i * w / 14 + 4, h + 40]], .5, '#9A6E44', .2);
  // skylight glow at the top
  blob(w / 2, -60, 520, '#FFF3D6', 170, .25); blob(w / 2, -60, 300, '#FFFBEF', 180, .2);
  // ring shelves: curved planks with book spines
  const rings = tall ? [260, 700, 1140, 1580, 2020, 2460, 2900] : [300, 640, 980];
  for (const y of rings) {
    const P = []; for (let i = 0; i <= 30; i++) { const x = i * w / 30; P.push([x, y + 70 * Math.pow((x - w / 2) / (w / 2), 2)]); }
    for (let i = 0; i < 44; i++) {        // book spines along the curve
      const x = 20 + i * (w - 40) / 44, yy = y + 70 * Math.pow((x - w / 2) / (w / 2), 2), bh = 60 + 40 * hash(i + y);
      const c = ['#C8553D', '#3E7C4A', '#1F3A5F', '#D99A3D', '#7B5CA8', '#56A6B3', '#E8D9A8'][Math.floor(hash(i * 3 + y) * 7)];
      paint([[x, yy], [x + 34, yy], [x + 34, yy - bh], [x, yy - bh]], { wash: c, washOp: 170, ink: null });
    }
    paint(ribbon(P, 26, 26), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .8 });
    flushBrush(true);
  }
  // light shafts from the skylight
  for (const [x, a] of [[w * .4, -.18], [w * .56, .12]]) wc([[x - 60, -40], [x + 60, -40], [x + 60 + Math.tan(a) * h + 180, h], [x - 60 + Math.tan(a) * h - 60, h]], '#FFF6DE', 70, .15, .3, .4);
}
definePlate('library', { w: 2400, h: 1350, paint(w, h) {
  silo(w, h);
  // floor: warm planks in a big ellipse
  wcw(ellPts(w / 2, 1330, 1500, 330, 40), '#C99160', 255, '#B98A57', 100);
  for (let i = -8; i <= 8; i++) pen([[w / 2 + i * 150, 1040], [w / 2 + i * 260, 1400]], .6, '#9A6E44', .2);
} });
// the tall shaft for the funnel's floors (1.4): the camera travels down it
definePlate('library_tall', { w: 1920, h: 3600, paint(w, h) {
  silo(w, h, true);
  wcw(ellPts(w / 2, 3590, 1300, 260, 40), '#C99160', 255, '#B98A57', 100);
} });

// ======================== 3. Territoire vu du ciel + colline de MAELIA (2.1, 2.2) ========================
function parcels(w, h, seed = 3) {   // mosaic of fields, a river, roads, farms: seen from above
  area([[-40, -40], [w + 40, -40], [w + 40, h + 40], [-40, h + 40]], '#C2D48E', null, 90, .02);
  const cols = ['#9DC07B', '#C8D48A', '#E3C98A', '#B4CF84', '#D9B872', '#86B06A', '#E8D39A', '#A7C27A'];
  const nx = 9, ny = 6, cw = w / nx, ch = h / ny;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const r = k => (hash(seed * 100 + j * 17 + i * 3 + k) - .5) * 34;
    const x = i * cw, y = j * ch, c = cols[Math.floor(hash(seed + i * 7 + j * 13) * cols.length)];
    const P = [[x + 8 + r(1), y + 8 + r(2)], [x + cw - 8 + r(3), y + 8 + r(4)], [x + cw - 8 + r(5), y + ch - 8 + r(6)], [x + 8 + r(7), y + ch - 8 + r(8)]];
    area(P, c, null, 120, .03);
    if (hash(i * 5 + j) > .45) for (let k = 1; k < 6; k++) { const a = lerp(P[0][1], P[3][1], k / 6); pen([[P[0][0] + 6, a], [P[1][0] - 6, a + (P[1][1] - P[0][1])]], .4, mixCol(c, PAL.ink, .35), .1); }
  }
  // river: a wide wandering ribbon
  const R = []; for (let k = 0; k <= 12; k++) R.push([k * w / 12, h * .55 + Math.sin(k * .9) * h * .16 + Math.sin(k * 2.1) * 40]);
  paint(subdiv(ribbon(R, 70, 90), 40), { fill: '#56A6B3', fillOp: 220, bleed: .04, tex: .4, border: .4, ink: null });
  pen(R.map(([x, y]) => [x, y - 38]), .7, '#2F6F7A'); pen(R.map(([x, y]) => [x, y + 40]), .7, '#2F6F7A');
  // roads
  pen([[0, h * .2], [w * .4, h * .28], [w, h * .16]], 2.4, '#E9DDC4', .5);
  pen([[w * .7, 0], [w * .64, h * .5], [w * .74, h]], 2.2, '#E9DDC4', .5);
  // farms and tree clumps
  for (let k = 0; k < 9; k++) { const x = hash(k + seed) * w, y = hash(k * 3 + seed) * h; paint(rectPts(x, y, 38, 26), { wash: '#EFE3CF', washOp: 255, ink: PAL.ink, sw: .5 }); paint(rectPts(x, y - 12, 38, 12), { wash: PAL.red, washOp: 255, ink: PAL.ink, sw: .5 }); }
  for (let k = 0; k < 26; k++) blob(hash(k * 7 + 1) * w, hash(k * 11 + 2) * h, 18 + hash(k) * 16, '#5E8C4E', 200, .1);
}
definePlate('territory', { w: 2400, h: 1350, paint(w, h) { parcels(w, h); } });
// the hill where MAELIA's glass dome stands, the real territory far behind
definePlate('hill', { w: 2400, h: 1350, paint(w, h) {
  sky(w, h, [[0, '#A6CBDD'], [320, '#D2E5EA'], [600, '#F2DFC0']], 760);
  for (const [x, y, r] of [[500, 200, 80], [1700, 160, 100], [1880, 190, 70]]) blob(x, y, r, PAL.cream, 150, .2);
  // distant territory: thin strips of fields toward the horizon
  const cs = ['#C6D98F', '#E3C98A', '#A9C97E', '#D9C27A', '#B5CFA3'];
  for (let k = 0; k < 6; k++) band(-40, w + 40, wave(640 + k * 34, 5 + k * 2, .004, k), 700 + k * 40, cs[k % 5], 150, .02, .6);
  const R = []; for (let k = 0; k <= 8; k++) R.push([k * w / 8, 700 + 30 * Math.sin(k * 1.3)]);
  paint(subdiv(ribbon(R, 12, 24), 40), { fill: '#56A6B3', fillOp: 200, bleed: .04, tex: .4, border: .3, ink: null });
  treeP(300, 690, 70); treeP(2100, 700, 80); treeP(1450, 680, 60, '#7FA968');
  // the hill
  band(-40, w + 40, x => 900 - 160 * Math.exp(-Math.pow((x - w / 2) / 800, 2)), h + 40, '#A9C97E', 220);
  band(-40, w + 40, x => 1010 - 150 * Math.exp(-Math.pow((x - w / 2) / 900, 2)), h + 40, '#98BF86', 200);
  for (let i = 0; i < 50; i++) { const x = hash(i + 3) * w, y = 900 + hash(i + 60) * 400, l = 12 + hash(i + 9) * 18; pen([[x, y], [x + 4, y - l]], .6, '#6E9A55', .3); }
} });

// ======================== 4. L'arbre des futurs (2.5, 3.4, 3.6) ========================
definePlate('night', { w: 2400, h: 1350, paint(w, h) {
  area([[-40, -40], [w + 40, -40], [w + 40, h + 40], [-40, h + 40]], '#1F3A5F', '#264670', 140, .02);
  for (const [x, y, r, c] of [[500, 300, 420, '#2C4E7A'], [1800, 420, 480, '#2A4570'], [1200, 1100, 520, '#1B3354'], [900, 200, 300, '#34507A']]) blob(x, y, r, c, 120, .3);
  for (let i = 0; i < 140; i++) { const x = hash(i * 3.1) * w, y = hash(i * 7.7) * h, r = 1.5 + hash(i) * 3.5; paint(ellPts(x, y, r, r, 8), { wash: '#E9F2F4', washOp: 120 + hash(i + 2) * 120, ink: null }); }
  // soft ground mist where the tree roots
  band(-40, w + 40, wave(1180, 20, .003, 1), h + 40, '#2E5578', 110, .08);
} });

// ======================== 5. La Réunion (2.7) ========================
definePlate('reunion', { w: 2400, h: 1350, paint(w, h) {
  sky(w, h, [[0, '#9FCBE0'], [320, '#CBE4EC'], [620, '#E9F0E2']], 900);
  // volcano silhouette with clouds on its peak
  area([[300, 900], [980, 330], [1110, 300], [1230, 330], [2100, 900]], '#6E8F6A', null, 120);
  area([[700, 900], [1060, 420], [1160, 410], [1500, 900]], '#5D7F5A', null, 120);
  for (const [x, y, r] of [[1050, 330, 110], [1180, 320, 90], [960, 360, 70]]) blob(x, y, r, PAL.cream, 200, .15);
  // the sea on the right edge
  band(1900, w + 40, x => 760, h + 40, '#9FD3D6', 180, .03);
  // terraced fields: stacked curved steps on the slopes
  const greens = ['#4E7A4A', '#5E8C4E', '#6E9A55', '#86B06A', '#4E7A4A'];
  for (let k = 0; k < 9; k++) {
    const y = 760 + k * 64, c = greens[k % 5];
    band(-40, w + 40, x => y + 30 * Math.sin(x * .003 + k) - (k < 3 ? 60 * Math.exp(-Math.pow((x - 1100) / 700, 2)) : 0), h + 40, c, 170, .03, .6);
    pen(Array.from({ length: 13 }, (_, i) => [i * w / 12, y + 30 * Math.sin(i * w / 12 * .003 + k) - (k < 3 ? 60 * Math.exp(-Math.pow((i * w / 12 - 1100) / 700, 2)) : 0)]), .6, '#2F4E2E');
  }
  treeP(200, 820, 90, '#3E6A3E'); treeP(2250, 900, 100, '#4E7A4A');
} });

// ======================== 6. Sénégal (2.7, 3.5) ========================
definePlate('senegal', { w: 2400, h: 1350, paint(w, h) {
  sky(w, h, [[0, '#E2C08C'], [300, '#F0D6A6'], [640, '#F8E2B8']], 800);
  blob(1850, 360, 120, '#F8C95C', 200, .06); blob(1850, 360, 230, '#F8D98A', 80, .2);
  band(-40, w + 40, wave(720, 12, .003, 2), h + 40, '#E8C68E', 190);
  band(-40, w + 40, wave(780, 16, .004, 4), h + 40, '#E3B77A', 200);
  band(-40, w + 40, wave(900, 20, .005, 1), h + 40, '#D9A866', 170);
  // millet and groundnut plots in the plain
  for (let k = 0; k < 7; k++) { const x = 150 + k * 320, y = 820 + (k % 2) * 40; wc([[x, y], [x + 260, y - 10], [x + 280, y + 60], [x - 10, y + 70]], k % 2 ? '#C9B26A' : '#B7A45E', 150, .03, .6); }
  // a village: round huts and houses with metal roofs, a water tower, a solar panel
  for (let k = 0; k < 5; k++) {
    const x = 1300 + k * 90, y = 760 - (k % 2) * 8;
    if (k % 2) { paint(rectPts(x, y - 40, 60, 40), { wash: '#E9D6B8', washOp: 255, ink: PAL.ink, sw: .5 }); paint([[x - 6, y - 40], [x + 66, y - 40], [x + 30, y - 58]], { wash: '#9FA8AE', washOp: 255, ink: PAL.ink, sw: .5 }); }
    else { paint(ellPts(x + 30, y - 22, 30, 22, 14), { wash: '#D9A866', washOp: 255, ink: PAL.ink, sw: .5 }); paint([[x - 4, y - 30], [x + 64, y - 30], [x + 30, y - 72]], { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: .5 }); }
  }
  pen([[1820, 770], [1820, 660]], 1.2); pen([[1860, 770], [1860, 660]], 1.2); paint(rectPts(1800, 610, 80, 55), { wash: '#DDE4E8', washOp: 255, ink: PAL.ink, sw: .6 });
  paint([[1180, 770], [1240, 770], [1230, 745], [1170, 745]], { wash: '#3E5F8A', washOp: 255, ink: PAL.ink, sw: .5 });
  baobab(420, 830, 360); baobab(2150, 800, 260); baobab(980, 760, 150);
  for (let i = 0; i < 40; i++) { const x = hash(i + 5) * w, y = 880 + hash(i + 70) * 420; pen([[x, y], [x + 3, y - 12]], .5, '#9A7A48', .3); }
} });

// ======================== 7. L'archipel du savoir (Act III) ========================
// Seen from above: four islands in a turquoise sea. RQ1 foire (rose), RQ2 vallée (cyan), RQ3 labyrinthe (green), RQ4 village (ochre).
const ISLES = [
  { id: 'RQ1', x: 620, y: 420, r: 260, col: '#E6A7A0', land: '#E9C6A8' },
  { id: 'RQ2', x: 1760, y: 400, r: 250, col: '#8FCFCB', land: '#CFE0C0' },
  { id: 'RQ3', x: 700, y: 1000, r: 270, col: '#8DBF7A', land: '#BFD8A0' },
  { id: 'RQ4', x: 1720, y: 1000, r: 260, col: '#E3B77A', land: '#EBD2A6' },
];
function islandShape(I, k = 1) { const P = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, r = I.r * k * (1 + .12 * Math.sin(a * 3 + I.x) + .08 * Math.sin(a * 5 + I.y)); P.push([I.x + Math.cos(a) * r, I.y + Math.sin(a) * r * .72]); } return P; }
definePlate('archipel', { w: 2400, h: 1350, paint(w, h) {
  area([[-40, -40], [w + 40, -40], [w + 40, h + 40], [-40, h + 40]], '#8FCBD0', '#7DBAC2', 110, .02);
  for (const [x, y, r] of [[1200, 700, 700], [300, 1200, 500], [2200, 200, 500]]) blob(x, y, r, '#6FB4BD', 90, .3);
  blob(1200, 700, 260, '#3E8FA3', 90, .3);
  for (const I of ISLES) {
    wc(islandShape(I, 1.18), '#D8EFEA', 160, .06, .3, .4);            // shallows
    wcw(islandShape(I, 1.0), I.land, 255, I.col, 110);
    blob(I.x - I.r * .2, I.y - I.r * .15, I.r * .45, I.col, 150, .12);
    paint(islandShape(I, 1.0), { ink: mixCol(I.col, PAL.ink, .5), sw: .8 });
  }
  for (let i = 0; i < 60; i++) { const x = hash(i * 2.3) * w, y = hash(i * 5.1) * h; pen([[x, y], [x + 18, y - 3], [x + 34, y]], .5, '#E9F6F4', .5); }  // wave ticks
} });
