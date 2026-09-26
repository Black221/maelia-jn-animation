// scène 3.1 — Île RQ1 : la foire aux jumeaux (V2 § 4, acte III).
// Lines: L0 « Première île, première leçon : le mot “jumeau” est à la mode. » · L1 « Mais beaucoup de ces outils sont
//        des ombres, ou de simples modèles. » · L2 « Et presque tous servent le pilotage tactique. » ·
//        L3 « L'idée d'un jumeau qui explore plusieurs futurs ne fait qu'émerger. »
// One continuous shot on the fair plate (the camera travels), after a dive from the archipelago:
//   0 → 1.8   (under the act wipe) the archipelago seen from the plane, the camera dives on RQ1, through clouds
//   L0        wide on the fair: three stalls shout « Vrai jumeau numérique ! Garanti ! »; push on stall 2: the
//             merchant slaps a « JUMEAU » tag on a plain thermometer (gag); Jumo « ? »
//   L1        Jumo's mirror-scanner: gadgets roll past on a belt, the mirror shows what each really is
//             (Jumo at stage 0 / 1 / 2 = modèle / ombre / jumeau): mostly « ombre » or « modèle » + buzzer, once the
//             two arrows (ding) — Patil et al., 2025
//   L2        tilt up to the big « tactique / stratégique » balance, heavy on the tactical side where Tacti clowns
//   L3        Awa trots to a small, quiet stand « navigateur de décision » whose screen grows a tree of futures;
//             she stops, intrigued — El Jarroudi et al., 2026 · Fur et al., 2023
//   end       clouds close in (→ 3.2 opens by clearing the same clouds)
// Also defines window.A3: small helpers shared by the Act III scene files (3.1–3.7, same author).
(() => {
  // ================= shared Act III helpers (loaded first; a3_s2 … a3_s7 use them) =================
  const A3 = window.A3 = {};
  // Awa in Act III: cap « terrain » side. Jumo in Act III: two antennas, the « provisoire » tag, rotors spinning.
  A3.awa = (x, y, s, o = {}) => awa(x, y, s, { cap: 'terrain', ...o });
  A3.jumo = (x, y, u, o = {}) => jumo(x, y, u, { stage: 2, badge: true, prop: 'spin', ...o });
  // is a world point (with radius r) inside the current camera's frame? (skip costly drawing off-screen)
  // profiling marks (only when window.A3PROF is set by a profiling script): time since the previous mark
  let _pm = 0; A3.P = name => { if (!window.A3PROF) return; flushBrush(true); const n = performance.now(); if (name) window.A3PROF[name] = (window.A3PROF[name] || 0) + n - _pm; _pm = n; };
  A3.vis = (x, y, r = 200) => { const [sx, sy] = toScreen(x, y); const rr = r * (CAM ? CAM.zoom : 1); return sx > -rr && sx < W + rr && sy > -rr && sy < H + rr; };
  // hand position of a person seen from the front, arm 'R' (screen right) or 'L', angles as in person()
  A3.hand = (x, y, s, a, e, which = 'R') => {
    const sd = which === 'L' ? -1 : 1, u1 = [sd * Math.sin(a), Math.cos(a)], u2 = [sd * Math.sin(a + e), Math.cos(a + e)];
    return [x + sd * 1.72 * s + (u1[0] * 1.95 + u2[0] * 1.75) * s, y - 6.75 * s + (u1[1] * 1.95 + u2[1] * 1.75) * s];
  };
  // an arrow (ink shaft + painted head)
  A3.arrow = (x0, y0, x1, y1, col, sw = 2, head = 14, key = 'arr') => {
    boilSeed(key + Math.round(x0) + Math.round(y0));
    const a = Math.atan2(y1 - y0, x1 - x0), bx = x1 - Math.cos(a) * head * .8, by = y1 - Math.sin(a) * head * .8;
    inkLine([[x0, y0], [(x0 + bx) / 2, (y0 + by) / 2 - 3], [bx, by]], sw, col, 'ink', .4);
    paint([[x1, y1], [x1 - Math.cos(a - .5) * head, y1 - Math.sin(a - .5) * head], [x1 - Math.cos(a + .5) * head, y1 - Math.sin(a + .5) * head]], { wash: col, washOp: 255, ink: PAL.ink, sw: .5 });
  };
  // Travel between the islands: big cream clouds that bloom in from the sides and close the frame (k 0 → 1),
  // or clear it (the next scene plays k 1 → 0 with the same clouds). Screen space.
  A3.clouds = (k, key = 'cl') => {
    if (k <= .001) return;
    for (let i = 0; i < 15; i++) {
      const gx = (i % 5) / 4, gy = Math.floor(i / 5) / 2, sd = gx < .5 ? -1 : gx > .5 ? 1 : (i % 2 ? 1 : -1);
      const tx = lerp(-40, W + 40, gx) + (hash(i * 3.1) - .5) * 150, ty = lerp(90, H - 70, gy) + (hash(i * 5.3) - .5) * 110;
      const d = hash(i * 7.7) * .35, kk = ease(clamp((k - d) / (1 - d)));
      if (kk <= .01) continue;
      const x = tx + sd * 420 * (1 - kk), y = ty + 60 * (1 - kk), r = (250 + hash(i * 2.2) * 110) * lerp(.35, 1, kk);
      boilSeed(key + i);
      paint(ellPts(x - .55 * r, y + .18 * r, .68 * r, .5 * r, 18), { wash: '#DDE9EE', washOp: 255, ink: null });
      paint(ellPts(x + .5 * r, y + .14 * r, .72 * r, .52 * r, 18), { wash: '#E6EEF1', washOp: 255, ink: null });
      paint(ellPts(x, y - .12 * r, r, .74 * r, 22), { wash: '#F8F5EE', washOp: 255, ink: '#B9CCD6', sw: .7 });
    }
    const f = seg(k, .72, .98); if (f > 0) paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#F4F2EC', washOp: 255 * f, ink: null });
  };
  // plate-time helper: a palm tree
  A3.palmP = (x, y, h, lean = .15) => {
    const top = [x + lean * h, y - h];
    paint(subdiv(ribbon([[x, y], [x + lean * h * .3, y - h * .5], top], h * .07, h * .045), 30), { wash: '#A67C52', washOp: 255, fill: '#8A6246', fillOp: 90, bleed: .03, tex: .5, border: .4, ink: null });
    for (let k = 0; k < 5; k++) pen([[x + lean * h * (k / 5) * .6 - h * .03, y - h * k / 5], [x + lean * h * (k / 5) * .6 + h * .03, y - h * k / 5 - h * .02]], .6, '#6E4A34', 0);
    for (const a of [-2.8, -2.2, -1.6, -1.0, -.35, .2]) {
      const e = [top[0] + Math.cos(a) * h * .45, top[1] + Math.sin(a) * h * .28 + h * .12];
      paint(ribbon([top, [lerp(top[0], e[0], .5), lerp(top[1], e[1], .5) - h * .08], e], h * .09, h * .02), { wash: '#5E9A55', washOp: 255, ink: '#3E6A3E', sw: .5 });
    }
    blob(top[0], top[1] + h * .04, h * .05, '#6E4A34', 220, .05);
  };

  // ================= the fair =================
  const GY = 1010;                       // foreground ground line (Awa, the scanner)
  const STALLS = [
    { x: 190, a: '#C8553D', b: '#FFF1DC', board: '#F3D27A' },
    { x: 520, a: '#7B5CA8', b: '#F8E6A0', board: '#F7E3C0' },
    { x: 1590, a: '#2F8F8A', b: '#FBEEDC', board: '#F3C9B8' },
  ];
  const SB = 860, SW = 300;              // stalls: base line, width
  const NAV = { x: 1985, y: 930 };       // the quiet stand
  const BAL = { x: 1060, y: 330, base: 820, half: 285 };
  const MIR = { x: 1060, y: 872 };       // the mirror-scanner (foreground)
  const MERCH = [
    { skin: SKIN.a, hair: '#6A3A22', hairStyle: 'short', hat: 'flat', shirt: '#E27A92', shirtDk: '#B85A72', pants: '#3E5F8A', pantsDk: '#2E4868', boots: '#3A2A22', cap: null, braid: false, tablet: false, pockets: false, overalls: false },
    { skin: SKIN.b, hair: '#2A1E22', hairStyle: 'curly', shirt: '#E8C66A', shirtDk: '#B89A48', pants: '#5A4A6A', pantsDk: '#433752', boots: '#3A2A22', cap: null, braid: false, tablet: false, pockets: false, overalls: false },
    { skin: SKIN.c, hair: '#1E1A1C', hairStyle: 'bald', shirt: '#7FB8D8', shirtDk: '#5A92B2', pants: '#6B5238', pantsDk: '#4E3B28', boots: '#3A2A22', cap: null, braid: false, tablet: false, pockets: false, overalls: false },
  ];

  function stallP(S) {                   // plate: back wall, posts, striped scalloped awning, blank board
    const x0 = S.x - SW / 2, x1 = S.x + SW / 2;
    area([[x0 + 10, SB - 280], [x1 - 10, SB - 280], [x1 - 10, SB - 90], [x0 + 10, SB - 90]], mixCol(S.b, S.a, .18), null, 90);
    for (const px of [x0 + 8, x1 - 8]) paint(rectPts(px - 7, SB - 300, 14, 300), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .7 });
    const n = 7, sw = SW / n;
    for (let i = 0; i < n; i++) {
      const a = x0 + i * sw - 8, b = a + sw + 1;
      paint([[a + 10, SB - 360], [b - 6, SB - 360], [b + 6, SB - 300], [(a + b) / 2 + 4, SB - 282], [a - 4, SB - 300]], { wash: i % 2 ? S.b : S.a, washOp: 255, ink: null });
    }
    paint([[x0 + 2, SB - 360], [x1 - 2, SB - 360], [x1 + 18, SB - 300], [x0 - 18, SB - 300]], { ink: PAL.ink, sw: .8 });
    for (let i = 0; i < n; i++) { const a = x0 - 18 + i * (SW + 36) / n, b = a + (SW + 36) / n; pen([[a, SB - 300], [(a + b) / 2, SB - 280], [b, SB - 300]], .7, PAL.ink, .5); }
    paint(rrPts(S.x - 125, SB - 440, 250, 70, 12), { wash: S.board, washOp: 255, fill: mixCol(S.board, PAL.ochre, .3), fillOp: 70, bleed: .02, tex: .4, border: .4, ink: PAL.ink, sw: .9 });
    pen([[S.x - 90, SB - 370], [S.x - 90, SB - 360]], .8); pen([[S.x + 90, SB - 370], [S.x + 90, SB - 360]], .8);
  }
  definePlate('a3s1_fair', { w: 2400, h: 1350, paint(w, h) {
    sky(w, h, [[0, '#86C4D4'], [260, '#BFE2E4'], [470, '#EAF1E2']], 520);
    for (const [x, y, r] of [[380, 150, 90], [520, 175, 70], [1500, 110, 80], [1640, 140, 60], [2150, 200, 70]]) { blob(x, y, r, '#FFF8EE', 200, .18); blob(x + r * .7, y + r * .2, r * .7, '#F6F1E8', 170, .18); }
    band(-40, w + 40, x => 468 + 4 * Math.sin(x * .01), 560, '#8FCBD0', 230, .02);                   // the sea on the horizon
    for (let i = 0; i < 24; i++) { const x = hash(i * 1.3) * w, y = 478 + hash(i * 2.9) * 30; pen([[x, y], [x + 22, y - 2], [x + 40, y]], .5, '#E9F6F4', .5); }
    band(-40, w + 40, wave(515, 8, .004, 1), h + 40, '#EAD7BE', 255);                               // far sand
    for (const [x, hh, l] of [[90, 260, .2], [150, 200, -.1], [1250, 230, .18], [2280, 270, -.16], [2210, 190, .1]]) A3.palmP(x, 560, hh, l);
    band(-40, w + 40, wave(700, 10, .003, 2), h + 40, '#EBCFB4', 230);                              // fairground floor
    band(-40, w + 40, wave(960, 12, .004, 3), h + 40, '#E6C4A6', 220);                              // foreground
    for (let i = 0; i < 60; i++) { const x = hash(i * 4.1) * w, y = 720 + hash(i * 6.7) * 600; paint(ellPts(x, y, 5 + hash(i) * 7, 3 + hash(i) * 3, 8), { wash: '#D8B394', washOp: 200, ink: null }); }
    // bunting over the fair
    for (const [a, b, sag] of [[-40, 760, 60], [760, 1400, 70], [1400, 2440, 80]]) {
      const P = Array.from({ length: 13 }, (_, i) => { const k = i / 12; return [lerp(a, b, k), 250 + sag * 4 * k * (1 - k)]; });
      pen(P, .7, PAL.ink, .5);
      P.slice(1, -1).forEach(([x, y], i) => paint([[x - 16, y + 2], [x + 16, y + 2], [x, y + 36]], { wash: [PAL.red, PAL.ochre, PAL.data, '#7B5CA8', PAL.soil][i % 5], washOp: 230, ink: PAL.ink, sw: .5 }));
    }
    // the balance's footing, far back, and a queue rope (the balance itself is live: it tilts)
    paint(ellPts(BAL.x, BAL.base + 6, 150, 22, 18), { wash: '#D8B394', washOp: 220, ink: null });
    STALLS.forEach(stallP);
    // the small quiet stand: low canopy of faded cloth on two poles, a little table
    const N = NAV;
    for (const px of [N.x - 115, N.x + 115]) paint(rectPts(px - 5, N.y - 270, 10, 270), { wash: '#9A7A5A', washOp: 255, ink: PAL.ink, sw: .6 });
    paint([[N.x - 135, N.y - 262], [N.x + 135, N.y - 262], [N.x + 120, N.y - 225], [N.x - 120, N.y - 225]], { wash: '#B9CDB0', washOp: 255, fill: '#A6BE9C', fillOp: 90, bleed: .03, tex: .5, border: .4, ink: PAL.ink, sw: .7 });
    paint(rectPts(N.x - 110, N.y - 92, 220, 16), { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: .7 });
    paint([[N.x - 104, N.y - 78], [N.x + 104, N.y - 78], [N.x + 98, N.y], [N.x - 98, N.y]], { wash: '#E9E1CF', washOp: 255, fill: '#D8CFBA', fillOp: 80, bleed: .02, tex: .4, border: .4, ink: PAL.ink, sw: .6 });
  } });

  // ---------------- live props ----------------
  function counter(S, i) {
    boilSeed('counter' + i);
    paint(rectPts(S.x - SW / 2 + 6, SB - 104, SW - 12, 104), { wash: mixCol(S.a, PAL.cream, .25), washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(S.x - SW / 2 + 6, SB - 104, SW - 12, 20), { wash: S.b, washOp: 255, ink: PAL.ink, sw: .6 });
  }
  function wares(S, i, st) {             // boxes and gadgets on the counter, each with its « jumeau » sticker
    boilSeed('wares' + i);
    const y = SB - 104;
    if (i === 0) { paint(rrPts(S.x - 120, y - 58, 70, 58, 8), { wash: '#9FB9CF', washOp: 255, ink: PAL.ink, sw: .6 }); paint(rrPts(S.x - 108, y - 48, 46, 26, 4), { wash: PAL.night, washOp: 255, ink: null }); inkLine([[S.x - 104, y - 30], [S.x - 92, y - 40], [S.x - 80, y - 34], [S.x - 68, y - 44]], .8, PAL.data, 'inkfine', .2); }
    if (i === 2) { paint(rectPts(S.x + 40, y - 70, 76, 70), { wash: '#E8C66A', washOp: 255, ink: PAL.ink, sw: .6 }); paint(ellPts(S.x + 78, y - 38, 18, 18, 12), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 }); inkLine([[S.x + 78, y - 38], [S.x + 90, y - 48]], 1, PAL.red, 'ink', 0); }
    if (i !== 1) { paint(ellPts(S.x + (i ? -60 : 70), y - 30, 34, 30, 14), { wash: i ? '#C8D98F' : '#F0B5A8', washOp: 255, ink: PAL.ink, sw: .6 }); }
  }
  function thermometer(x, yb, k) {
    boilSeed('thermo');
    paint(rrPts(x - 11, yb - 150, 22, 136, 11), { wash: '#EEF4F4', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rectPts(x - 4, yb - 92, 8, 80), { wash: PAL.red, washOp: 255, ink: null });
    paint(ellPts(x, yb - 12, 17, 17, 14), { wash: PAL.red, washOp: 255, ink: PAL.ink, sw: .8 });
    for (let j = 0; j < 6; j++) inkLine([[x + 11, yb - 132 + j * 18], [x + 20, yb - 132 + j * 18]], .5, PAL.ink, 'inkfine', 0);
    paint(rectPts(x - 22, yb - 6, 44, 8), { wash: '#9C98A6', washOp: 255, ink: PAL.ink, sw: .5 });
  }
  function tag(x, y, rot, s = 1) {       // the « JUMEAU » sticker
    boilSeed('tag' + Math.round(x));
    push(); translate(x, y); rotate(rot); scale(s);
    paint(rrPts(-46, -15, 92, 30, 5), { wash: '#FFF6E0', washOp: 255, ink: PAL.red, sw: 1.1 });
    pop();
    letter('JUMEAU', x, y + 1, 19 * s, PAL.red, { rot, weight: 700 });
  }
  function bubble(x, y, k, i) {          // a shouting burst over a stall
    if (k <= .02) return;
    boilSeed('bub' + i);
    push(); translate(x, y); scale(backOut(k)); rotate((i - 1) * .05);
    paint(starPts(0, 0, 160, .82, 14, .1), { wash: PAL.cream, washOp: 255, ink: PAL.red, sw: 1.2 });
    pop();
    letter('Vrai jumeau\nnumérique !\nGaranti !', x, y + 2, 27, PAL.red, { pop: k, font: FONT.marker, weight: 400, rot: (i - 1) * .05, lh: 1.02 });
  }
  function balance(st, tilt, tactiK) {
    const { x, y, base, half } = BAL, c = Math.cos(tilt), s = Math.sin(tilt);
    boilSeed('balpost');
    paint([[x - 70, base], [x + 70, base], [x + 30, base - 40], [x - 30, base - 40]], { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(x - 13, y, 26, base - 40 - y), { wash: PAL.wood, washOp: 255, ink: PAL.ink, sw: .9 });
    const L = [x - half * c, y + half * s], R = [x + half * c, y - half * s];
    boilSeed('balbeam');
    paint(ribbon([L, [x, y - 6], R], 18, 18), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .9 });
    paint(ellPts(x, y, 20, 20, 14), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(starPts(x, y - 34, 18, .4, 5), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 });
    const pans = [];
    for (const [E, sd] of [[L, -1], [R, 1]]) {
      const px = E[0], py = E[1] + 150;
      boilSeed('pan' + sd);
      inkLine([E, [px - 108, py]], .7, PAL.ink, 'inkfine', 0); inkLine([E, [px + 108, py]], .7, PAL.ink, 'inkfine', 0);
      paint([[px - 116, py], [px + 116, py], [px + 86, py + 40], [px - 86, py + 40]], { wash: '#D9B25A', washOp: 255, ink: PAL.ink, sw: .9, curv: .3 });
      pans.push([px, py]);
    }
    return pans;
  }
  function gadgetHeap(px, py) {          // the tactical pan: a pile of dashboards, gauges, sprinklers
    boilSeed('heap');
    const items = [[-60, -22, 46, 34, '#9FB9CF'], [-12, -28, 50, 40, '#E8C66A'], [40, -20, 44, 30, '#F0B5A8'], [-40, -58, 44, 34, '#C8D98F'], [10, -64, 40, 34, '#7FB8D8'], [-20, -92, 36, 28, '#E27A92']];
    for (const [dx, dy, w, h, c] of items.map(([a, b, c2, d, e]) => [a * 1.3, b * 1.3, c2 * 1.3, d * 1.3, e])) paint(rrPts(px + dx - w / 2, py + dy - h / 2, w, h, 6), { wash: c, washOp: 255, ink: PAL.ink, sw: .6 });
    for (const [dx, dy] of [[-16, -36], [13, -83]]) paint(ellPts(px + dx, py + dy, 12, 12, 10), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .4 });
  }
  function mirror(st, lv, vk) {          // the mirror-scanner on its stand; lv = verdict level shown in the glass
    const { x, y } = MIR;
    boilSeed('mirstand');
    for (const sd of [-1, 1]) inkLine([[x + sd * 36, GY], [x + sd * 16, y + 100]], 3, PAL.woodDk, 'ink', 0);
    boilSeed('mirframe');
    paint(ellPts(x, y, 96, 122, 30), { wash: '#D9A44A', washOp: 255, ink: PAL.ink, sw: 1.1 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; paint(ellPts(x + Math.cos(a) * 89, y + Math.sin(a) * 114, 6, 6, 8), { wash: '#F3D27A', washOp: 255, ink: null }); }
    paint(ellPts(x, y, 79, 104, 28), { wash: '#CFE6EE', washOp: 255, ink: PAL.ink, sw: .8 });
    inkLine([[x - 48, y - 48], [x - 32, y - 78]], 3, PAL.cream, 'ink', .3); inkLine([[x + 40, y + 56], [x + 52, y + 36]], 2, PAL.cream, 'ink', .3);
    if (lv != null && vk > .02) {        // the reflection: what the object really is (the three stages of 2.3)
      const p = backOut(vk);
      jumo(x, y - 20, 5.6 * p, { stage: lv, face: lv === 2 ? 'happy' : 'neutral', prop: 'fold', glowScreen: 0, boilKey: 'refl' });
      if (lv >= 1) A3.arrow(x - 76, y - 34, x - 38, y - 28, PAL.data, 2.4, 12, 'ain');
      if (lv === 2) A3.arrow(x + 38, y - 28, x + 76, y - 34, PAL.ochre, 2.4, 12, 'aout');
    }
  }
  function verdictPanel(lv, k) {         // the little sign over the mirror: the word + a light
    if (k <= .02) return;
    const x = MIR.x, y = MIR.y - 168, good = lv === 2;
    panel(x, y, 190, 54, null, { k, col: good ? '#DDF0D2' : '#F6DCD4', key: 'verdict' });
    boilSeed('vlight');
    paint(ellPts(x - 70, y, 11 * backOut(k), 11 * backOut(k), 10), { wash: good ? '#7FC47A' : PAL.red, washOp: 255, ink: PAL.ink, sw: .5 });
    if (good) glow(x - 70, y, 40, '#9BE39A', .6 * k);
    letter(['modèle', 'ombre', 'jumeau'][lv], x + 14, y + 1, 30 * backOut(k), good ? PAL.soil : PAL.red, { weight: 700 });
  }
  // gadgets that roll through the scanner, each with its « JUMEAU » sticker
  function gadget(i, x, y) {
    boilSeed('gad' + i);
    switch (i % 5) {
      case 0: paint(rrPts(x - 44, y - 64, 88, 64, 8), { wash: '#9FB9CF', washOp: 255, ink: PAL.ink, sw: .7 }); paint(rrPts(x - 32, y - 54, 64, 34, 4), { wash: PAL.night, washOp: 255, ink: null }); inkLine([[x - 26, y - 28], [x - 10, y - 44], [x + 6, y - 34], [x + 24, y - 48]], 1, PAL.data, 'inkfine', .2); break;
      case 1: paint(rectPts(x - 36, y - 82, 72, 82), { wash: '#E8C66A', washOp: 255, ink: PAL.ink, sw: .7 }); paint(ellPts(x, y - 50, 22, 22, 14), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 }); inkLine([[x, y - 50], [x + 14, y - 62]], 1.2, PAL.red, 'ink', 0); break;
      case 2: inkLine([[x, y], [x, y - 90]], 2, PAL.ink, 'ink', 0); paint([[x, y - 90], [x + 44, y - 80], [x, y - 70]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 }); paint(rectPts(x - 30, y - 16, 60, 16), { wash: '#9C98A6', washOp: 255, ink: PAL.ink, sw: .6 }); break;
      case 3: paint(ellPts(x, y - 44, 44, 40, 20), { wash: '#8DB8E2', washOp: 255, ink: PAL.ink, sw: .7 }); paint(rrPts(x - 26, y - 62, 52, 30, 8), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: .5 }); for (const sd of [-1, 1]) inkLine([[x + sd * 12, y - 82], [x + sd * 20, y - 106]], 1.4, PAL.ink, 'ink', 0); paint(ellPts(x - 20, y - 108, 6, 6, 8), { wash: PAL.data, washOp: 255, ink: null }); paint(ellPts(x + 20, y - 108, 6, 6, 8), { wash: PAL.ochre, washOp: 255, ink: null }); break;
      default: paint(rrPts(x - 40, y - 56, 80, 56, 10), { wash: '#F0B5A8', washOp: 255, ink: PAL.ink, sw: .7 }); for (let k = 0; k < 3; k++) paint(ellPts(x - 22 + k * 22, y - 30, 7, 7, 8), { wash: [PAL.red, PAL.ochre, PAL.soil][k], washOp: 255, ink: null });
    }
    tag(x, y - (i % 5 === 2 ? 44 : 18), .06 * (i % 2 ? 1 : -1), .72);
  }
  function navScreen(st, g) {            // the quiet stand's screen: a tree of futures that branches out
    const x = NAV.x, y = NAV.y - 150;
    boilSeed('navscr');
    inkLine([[x - 40, NAV.y - 92], [x - 10, y + 50]], 2, PAL.woodDk, 'ink', 0); inkLine([[x + 40, NAV.y - 92], [x + 10, y + 50]], 2, PAL.woodDk, 'ink', 0);
    paint(rrPts(x - 90, y - 62, 180, 116, 12), { wash: '#5A6A7A', washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rrPts(x - 80, y - 53, 160, 98, 8), { wash: PAL.night, washOp: 255, ink: null });
    if (g > .01) futureTree(x - 68, y + 2, .15, st, { seed: 5, depth: 3, grow: g, state: () => ({ a: 1, noGlow: true }) });
  }
  function plane(x, y, s, rot) {
    boilSeed('plane');
    push(); translate(x, y); rotate(rot); scale(s);
    paint([[-90, 0], [80, -8], [110, 6], [80, 22], [-90, 18]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1, curv: .3 });
    paint([[-10, 4], [30, 4], [-30, 70], [-60, 70]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 });
    paint([[-10, 4], [30, 4], [-30, -62], [-60, -62]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 });
    paint([[-80, 8], [-60, 8], [-96, 40], [-110, 40]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .7 });
    paint([[-80, 8], [-60, 8], [-96, -24], [-110, -24]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .7 });
    pop();
  }

  // ---------------- the shot ----------------
  function fair(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const cloudIn = [.5, 1.0], cloudOut = [1.0, 1.6];
    // --- the dive, from the plane (under the act wipe) ---
    if (st < cloudIn[1]) {
      const k = ease(seg(st, 0, cloudIn[1]));
      camBegin(lerp(1200, 640, k), lerp(690, 430, k), lerp(1.0, 2.3, easeIn(k)));
      drawPlate('archipel', 0, 0);
      for (const I of ISLES) letter(I.id, I.x, I.y + I.r * .9, 34, PAL.night, { weight: 600, stroke: PAL.cream, alpha: 1 - k });
      const pk = seg(st, 0, cloudIn[1]);
      plane(lerp(1080, 700, pk), lerp(640, 450, pk), lerp(.55, .3, pk), -2.6);
      camEnd();
      flushLetters();
      A3.clouds(seg(st, cloudIn[0], cloudIn[1]), 'cl31');
      return;
    }
    // --- the fair ---
    const pushA = [3.0, 3.6], toScan = [4.9, 5.55], toBal = [8.85, 9.5], toNav = [11.3, 13.1], outK = seg(st, S.dur - 1.3, S.dur - .15);
    const cx = kf(st, [[cloudOut[0], 1190], [pushA[0], 1190], [pushA[1], 720], [toScan[0], 720], [toScan[1], 1020], [toBal[0], 1020], [toBal[1], 1070], [toNav[0], 1070], [toNav[1], 1680], [S.dur, 1715]]);
    const cy = kf(st, [[cloudOut[0], 660], [pushA[0], 650], [pushA[1], 720], [toScan[0], 720], [toScan[1], 790], [toBal[0], 790], [toBal[1], 530], [toNav[0], 530], [toNav[1], 800], [S.dur - 1.3, 830], [S.dur, 700]]);
    const z = kf(st, [[cloudOut[0], .86], [pushA[0], .82], [pushA[1], 1.35], [toScan[0], 1.38], [toScan[1], 1.3], [toBal[0], 1.32], [toBal[1], 1.12], [toNav[0], 1.15], [toNav[1], 1.34], [S.dur - 1.3, 1.44], [S.dur, 1.5]]);
    A3.P();
    camBegin(cx, cy, z);
    drawPlate('a3s1_fair', 0, 0);
    A3.P('plate');
    // the balance (back): heavy on the tactical side; Tacti hops on the pile and every landing dips the pan
    const hopP = .52, hops = [], tactiOn = st > toBal[0] - .2 && st < E(2) + .6;
    for (let h = 2; h < S.dur; h += tactiOn || h < toBal[0] ? hopP : 99) hops.push(h);
    const hopI = Math.floor((st - 2) / hopP), h0 = 2 + hopI * hopP, big = st > L(2) - .3 && st < E(2) + .4;
    const tilt = .3 + .05 * ring(st, hops.filter(h => h <= st && h > st - 2).map(h => h + hopP * .92), 5, 16) + (big ? .04 : 0);
    let pans = null;
    if (A3.vis(BAL.x, 520, 420)) {
      pans = balance(st, tilt);
      const [lx, ly] = pans[0], [rx, ry] = pans[1];
      gadgetHeap(lx, ly);
      const J = jump(st, h0 + .05, h0 + hopP * .92, big ? 5 : 2.4);
      tacti(lx + 8, ly - 132, 12, { dy: J.dy, valve: st * (big ? 16 : 9), open: big ? .9 : .4 + .3 * Math.sin(st * 3), mouth: big ? 'shout' : 'grin', eyes: big && st > E(2) - .2 ? 'dizzy' : 'wide', boilKey: 'tacti' });
      boilSeed('seedling');                                     // the strategic pan: one small seedling of the future
      inkLine([[rx, ry], [rx, ry - 34]], 1.6, PAL.sap, 'ink', .3);
      paint(ellPts(rx - 12, ry - 34, 12, 7, 10, 0, -.4), { wash: '#7FB56A', washOp: 255, ink: PAL.ink, sw: .4 }); paint(ellPts(rx + 12, ry - 38, 12, 7, 10, 0, .4), { wash: '#7FB56A', washOp: 255, ink: PAL.ink, sw: .4 });
      letter('tactique', lx, ly + 20, 32, '#6A3A12', { weight: 700 });
      letter('stratégique', rx, ry + 20, 30, '#6A3A12', { weight: 700 });
      if (big) sfx('HOP !', lx + 110, ly - 170, 40, PAL.red, st - L(2) - .2, { life: 1.1, rot: .1 });
    }
    A3.P('balance');
    // stalls: merchants behind their counters
    STALLS.forEach((Sx, i) => {
      if (!A3.vis(Sx.x, SB - 200, 260)) return;
      letter('JUMEAUX', Sx.x, SB - 404, 36, PAL.night, { font: FONT.marker, weight: 400 });
      const mx = Sx.x - (i === 1 ? 60 : 20), shout = seg(st, 1.3 + i * .25, 1.6 + i * .25) * (1 - seg(st, 2.95, 3.3));
      let M = { ...feelP(shout > .1 ? 'rire' : 'joie', st), aR: 2.5 + .4 * Math.sin(st * 9 + i), eR: .3, aL: .3, preset: MERCH[i], boilKey: 'merch' + i, seed: i + 3 };
      let tagHand = null;
      if (i === 1) {                                            // the thermometer gag
        const up = seg(st, 3.5, 3.8), slap = seg(st, 3.95, 4.1);
        const a = st < 3.95 ? lerp(.3, 2.7, ease(up)) : lerp(2.7, 1.75, easeIn(slap)), e = st < 3.95 ? lerp(-.1, .3, up) : lerp(.3, .2, slap);
        M = { ...actP(st, [[0, 'joie'], [3.45, 'fiere'], [4.1, 'rire']]), aR: a, eR: e, aL: .25, preset: MERCH[1], boilKey: 'merch1', seed: 4, view: 'front' };
        tagHand = A3.hand(mx, SB, 18, a, e, 'R');
      }
      person(mx, SB, 18, M);
      counter(Sx, i); wares(Sx, i, st);
      if (i === 1) {
        thermometer(Sx.x + 52, SB - 104, 1);
        if (st > 3.47 && st < 4.1) tag(tagHand[0] + 6, tagHand[1] - 6, -.3, 1);
        else if (st >= 4.1) { const sq = spring(st, 4.1, 9, 30) * .15; tag(Sx.x + 52, SB - 104 - 92, -.2, 1 + sq); }
      }
    });
    A3.P('stalls');
    // the shouting bursts (L0)
    STALLS.forEach((Sx, i) => bubble(Sx.x, SB - 540, seg(st, 1.3 + i * .25, 1.6 + i * .25) * (1 - seg(st, 2.95, 3.3)), i));
    // the quiet stand (L3): the sign and the screen
    if (A3.vis(NAV.x, NAV.y - 150, 300)) {
      navScreen(st, seg(st, L(3) + .9, L(3) + 3.0));
      letter('navigateur\nde décision', NAV.x, NAV.y - 244, 24, '#3E5A3A', { font: FONT.hand, weight: 400, lh: .95 });
    }
    A3.P('nav');
    // the mirror-scanner and its belt (L1)
    const V = [1, 0, 1, 2, 0], P = .72, T0 = toScan[0] + .9, v = 225 / P;
    let cur = null, ck = 0;
    if (A3.vis(MIR.x, MIR.y, 360)) {
      boilSeed('belt');
      paint(rrPts(760, GY - 40, 600, 34, 14), { wash: '#6B6A7A', washOp: 255, ink: PAL.ink, sw: .9 });
      for (let k = 0; k < 12; k++) { const bx = 780 + ((k * 50 + st * v) % 560); inkLine([[bx, GY - 36], [bx, GY - 12]], .7, '#9C98A6', 'inkfine', 0); }
      mirror(st, null, 0);
      for (let i = 0; i < V.length; i++) {
        const ti = T0 + i * P, x = MIR.x + (st - ti) * v;
        if (Math.abs(st - ti) < P / 2) { cur = V[i]; ck = seg(st, ti - .06, ti + .05) * (1 - seg(st, ti + P * .42, ti + P * .5)); }
        if (x > 760 && x < 1370) gadget(i, x, GY - 40);
      }
      if (cur != null) mirror(st, cur, ck);
      boilSeed('booth');                                        // the entry curtain and the exit bin hide the ends of the belt
      paint(rrPts(700, GY - 190, 110, 190, 10), { wash: '#8A5AA8', washOp: 255, ink: PAL.ink, sw: .9 });
      for (let k = 1; k < 4; k++) inkLine([[700 + k * 27, GY - 186], [702 + k * 27, GY - 6]], .6, '#6A3A88', 'inkfine', .2);
      paint([[1330, GY - 110], [1450, GY - 110], [1435, GY], [1345, GY]], { wash: '#9C98A6', washOp: 255, ink: PAL.ink, sw: .9 });
      verdictPanel(cur ?? 0, cur != null ? ck : 0);
    }
    A3.P('scanner');
    // Awa: walks in (L0), watches the scanner (L1), looks up at the balance (L2), trots to the quiet stand (L3)
    const walks = [[1.0, 3.3, 20, 400], [toScan[0] - .1, toScan[1] + .2, 420, 700], [toNav[0] - .1, toNav[1] + .6, 700, 1780]];
    let ax = 60, A = null;
    for (const [a, b, x0, x1] of walks) if (st >= a) ax = st < b ? lerp(x0, x1, ease(seg(st, a, b))) : x1;
    const walking = walks.find(([a, b]) => st > a && st < b);
    const mood = actP(st, [[0, 'neutre'], [4.15, 'doute', { lookX: .6 }], [toScan[1] + .2, 'concentree', { lookX: .5, lookY: -.2 }], [T0 + 3 * P, 'surprise', { lookX: .5, lookY: -.3 }], [T0 + 3 * P + .7, 'neutre', { lookX: .4 }],
                         [toBal[0] + .4, 'grimace', { lookX: .2, lookY: -.9 }], [toNav[0] - .1, 'determinee'], [toNav[1] + .6, 'doute', { lookX: .5, lookY: -.3 }], [L(3) + 2.2, 'emerveillee', { lookX: .6, lookY: -.4 }]]);
    if (walking) { const [a, b, x0, x1] = walking, d = Math.abs(ax - x0) / 34; A = { ...mood, view: 'side', walk: d, aL: undefined, aR: undefined, eL: undefined, eR: undefined, fist: false, handR: undefined, finger: undefined }; }
    else A = { ...mood, view: 'q' };
    A3.awa(ax, GY + 8, 20, A);
    A3.P('awa');
    // Jumo
    const jx = kf(st, [[1.0, 120], [3.3, 560], [4.2, 700], [toScan[0], 610], [toScan[1], 1230], [toBal[0], 1230], [toBal[1], 1180], [toNav[0], 1180], [toNav[1] + .4, 1905], [99, 1905]]);
    const jy = kf(st, [[1.0, 760], [3.3, 640], [4.2, 600], [toScan[0], 700], [toScan[1], 640], [toBal[0], 640], [toBal[1], 560], [toNav[0], 560], [toNav[1] + .4, 585], [99, 585]]) + Math.sin(st * 2.4) * 8;
    let jf = 'happy';
    if (st > 4.2 && st < toScan[0]) jf = 'question';
    else if (cur != null && ck > .3) jf = cur === 2 ? 'love' : 'cross';
    else if (st > toScan[1] && st < toBal[0]) jf = 'scan';
    else if (st > toBal[0] && st < toNav[0]) jf = 'wide';
    else if (st > L(3) + 1) jf = 'tree';
    A3.jumo(jx, jy, 11, { face: jf, rot: .08 * Math.sin(st * 1.7), lookX: st > toBal[0] && st < toNav[0] ? -.4 : .3, boilKey: 'jumo' });
    A3.P('jumo');
    camEnd();
    // study citations
    cite(['Patil et al., 2025 : modèle, ombre, jumeau'], seg(st, L(1) + .6, L(1) + 1.1) * (1 - seg(st, E(2) + .3, E(2) + .7)));
    cite(['El Jarroudi et al., 2026 : des jumeaux comme « navigateurs de décision »', 'Fur et al., 2023 : réplique multi-agents d’une communauté rurale au Sénégal'], seg(st, L(3) + .8, L(3) + 1.6) * (1 - seg(st, S.dur - 1.6, S.dur - 1.2)));
    A3.P('cite');
    flushLetters();                                            // lettering under the clouds, not over them
    A3.clouds(1 - seg(st, cloudOut[0], cloudOut[1]), 'cl31');
    A3.clouds(outK, 'cl32');
    A3.P('clouds');
  }

  scene('3.1', S => [[0, fair]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i), P = .72, T0 = 4.9 + .9, V = [1, 0, 1, 2, 0];
      const out = [[.4, 'rotor', .05], [.55, 'whoosh', .12], [1.05, 'whoosh', .1, .3],
        [1.3, 'pop', .1, -.5], [1.55, 'pop', .1, -.2], [1.8, 'pop', .1, .4], [3.0, 'whoosh', .06],
        [3.55, 'rustle', .06], [4.0, 'stamp', .25, -.2], [4.25, 'bipq', .08], [4.9, 'whoosh', .06],
        [8.85, 'whoosh', .06], [11.3, 'whoosh', .06], [L(3) + .9, 'sparkle', .05, .5], [L(3) + 2.2, 'bip2', .07, .5], [S.dur - 1.3, 'whoosh', .12]];
      V.forEach((v, i) => out.push([T0 + i * P, v === 2 ? 'ding' : 'buzzer', v === 2 ? .1 : .07]));
      for (let h = 2 + .52 * Math.ceil((8.5 - 2) / .52); h < E(2) + .6; h += .52) out.push([h + .48, 'boing', .05, -.3]);
      for (let k = 0; k < 7; k++) out.push([1.1 + k * .34, 'step', .04]);
      for (let k = 0; k < 7; k++) out.push([11.3 + k * .3, 'step', .05]);
      return out;
    });
})();
