// scène 1.4 — Le grand tri (V2 § 4, acte I). Décor : plate `a1s4_shaft` (the silo shaft of `library_tall`,
// 1920 × 3600, with the sorting machine painted in); the camera goes down the machine floor by floor.
// Lines: L0 « Premier étage : les doublons. » · L1 « Deuxième : … pas de la bonne époque. » · L2 « Troisième : on lit
//        chaque titre et chaque résumé. » · L3 « Et là, une règle d'or : dans le doute, on exclut. » ·
//        L4 (videur) « Pas sûr ? Dehors. » · L5 « Pas de résumé ? Pas d'entrée. » · L6 « Il en reste 686. » ·
//        L7 « On en lit 241 en entier, obtenus légalement ; les autres attendent leur tour. » · L8 « Et à la fin… 139 études. »
// Shots (one descending camera):
//   0     the hopper where 1.3 ends (same place on screen), parchments pouring in
//   L0    floor 1, the clones: a scanner ring spots twins, they slide out and leave in single file (− 2 690) → 4 978
//   L1    floor 2, the stamp: errata, notices, wrong period get stamped and chuted (− 750) → 4 228
//   L2–L6 floor 3, quick reading: Bip & Bop read at the table; the Videur « Doute » at the rope: a doubtful parchment
//         is thrown out (L3), « Pas sûr ? Dehors. » (L4), faceless parchments (no abstract) are stopped (L5);
//         gag: Jumo hides one under his propeller, the Videur wags his finger « non »; counter → 686 (L6)
//   L7    floor 4, full texts: 241 open up on the reading board (« 241 lus »); the others sit on a bench by the door
//         « accès institutionnel » with a waiting ticket, not excluded (« 445 en attente »)
//   L8    exit: a red carpet, 139 études incluses under confetti, Awa and Jumo cheer
//   → end zoom into the lattice filter the last parchment goes through (1.5 opens on the same lattice: the paravent)
(() => {
  const TX = 960, TW = 104;                             // the glass tube
  const D = [0, 1000, 1600, 2200, 2800, 3420];          // deck (floor) level of each floor, D[5] = the ground
  const HOP = { x: 960, y: 200, s: .9 };
  const RAIL_X = 190;
  const GATE = { x: 960, y: 3420, w: 230, h: 300 };     // the lattice filter at the exit (bottom centre = ground)
  const BENCH = { x0: 1090, x1: 1560, y: D[4] - 62 };
  const DOORI = { x: 1420, top: D[4] - 330, w: 210 };
  const archW = (cx, top, w, h) => { const P = [[cx - w / 2, top + h]]; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; P.push([cx + Math.cos(a) * w / 2, top + w / 2 + Math.sin(a) * w / 2]); } P.push([cx + w / 2, top + h]); return P; };

  // ---------------- the plate: silo shaft + the sorting machine ----------------
  definePlate('a1s4_shaft', { w: 1920, h: 3600, paint(w, h) {
    silo(w, h, true);
    wcw(ellPts(w / 2, 3590, 1300, 260, 40), '#C99160', 255, '#B98A57', 100);
    for (let i = -7; i <= 7; i++) pen([[w / 2 + i * 130, 3340], [w / 2 + i * 220, 3620]], .6, '#9A6E44', .2);
    // the counter's rail (left)
    paint(ribbon([[RAIL_X, 470], [RAIL_X, 3430]], 16, 16), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .7 });
    for (let y = 560; y < 3400; y += 300) paint(rrPts(RAIL_X - 18, y, 36, 16, 5), { wash: '#8A6A2A', washOp: 255, ink: PAL.ink, sw: .5 });
    // floor cabinets (pale steel with a blue frame) and decks
    for (let f = 1; f <= 4; f++) {
      const y = D[f];
      area(rrPts(330, y - 480, 1260, 480, 34), '#46638C', '#34547E', 110);
      area(rrPts(352, y - 458, 1216, 440, 24), '#DCE6EC', '#C9D6DE', 90);
      for (let k = 0; k < 9; k++) paint(ellPts(360 + k * 150, y - 470, 5, 5, 8), { wash: '#C9A04A', ink: PAL.ink, sw: .4 });
      paint(rrPts(330, y - 480, 1260, 480, 34), { ink: PAL.ink, sw: 1 });
      wcw(rrPts(300, y, 1320, 46, 12), '#46638C', 255, '#34547E', 100);
      paint(rrPts(300, y, 1320, 46, 12), { ink: PAL.ink, sw: 1 });
      for (let k = 0; k < 12; k++) paint(ellPts(330 + k * 115, y + 23, 5, 5, 8), { wash: '#C9A04A', ink: PAL.ink, sw: .4 });
    }
    // floor 1: the scanner ring's brackets, the twins' chute and their little door (right)
    const f1 = D[1];
    paint(ribbon([[1012, f1 - 190], [1120, f1 - 110], [1235, f1 - 8]], 34, 34), { wash: '#B8C4CC', washOp: 255, ink: PAL.ink, sw: .8 });
    area(archW(1520, f1 - 170, 120, 170), '#2E2C40', '#232133', 100); paint(archW(1520, f1 - 170, 120, 170), { ink: PAL.ink, sw: 1 });
    paint(archW(1520, f1 - 178, 136, 178), { ink: '#46638C', sw: 2.4 });
    // floor 2: the stamp gantry, the tray from the tube hatch, the chute to the bin
    const f2 = D[2];
    for (const x of [1130, 1330]) wcw(rrPts(x - 12, f2 - 430, 24, 430, 6), '#46638C', 255, '#34547E', 90);
    wcw(rrPts(1110, f2 - 440, 240, 34, 8), '#46638C', 255, '#34547E', 90); paint(rrPts(1110, f2 - 440, 240, 34, 8), { ink: PAL.ink, sw: .8 });
    paint(rrPts(1012, f2 - 190, 250, 22, 6), { wash: '#B8C4CC', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(ribbon([[1262, f2 - 178], [1360, f2 - 120], [1440, f2 - 60]], 30, 30), { wash: '#D9A08E', washOp: 255, ink: PAL.ink, sw: .8 });
    wcw([[1400, f2], [1560, f2], [1575, f2 - 110], [1385, f2 - 110]], '#B98A57', 255, '#8A6246', 100);
    for (let k = 1; k < 5; k++) pen([[1392 + k * 36, f2 - 108], [1395 + k * 34, f2 - 2]], .6, '#6E4A34', 0);
    paint([[1400, f2], [1560, f2], [1575, f2 - 110], [1385, f2 - 110]], { ink: PAL.ink, sw: .9 });
    // floor 3: the reading table with its intake, a velvet rope, the side exit
    const f3 = D[3];
    wcw(rrPts(680, f3 - 130, 560, 26, 8), '#B98A57', 255, '#8A6246', 100); paint(rrPts(680, f3 - 130, 560, 26, 8), { ink: PAL.ink, sw: .9 });
    for (const x of [712, 1208]) paint(rectPts(x - 8, f3 - 106, 16, 106), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .7 });
    area(archW(1530, f3 - 230, 110, 230), '#2E2C40', '#232133', 100); paint(archW(1530, f3 - 230, 110, 230), { ink: PAL.ink, sw: 1 });
    for (const x of [1330, 1440]) { paint(rectPts(x - 5, f3 - 110, 10, 110), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .6 }); paint(ellPts(x, f3 - 114, 10, 10, 10), { wash: '#C9A04A', ink: PAL.ink, sw: .6 }); }
    paint(ribbon([[1330, f3 - 96], [1385, f3 - 70], [1440, f3 - 96]], 9, 9), { wash: '#8A2F3A', washOp: 255, ink: PAL.ink, sw: .6 });
    // floor 4: the reading board (left), the door « accès institutionnel », the bench, the ticket machine
    const f4 = D[4];
    area(rrPts(390, f4 - 420, 430, 300, 14), '#C9A97A', '#B8955F', 110); paint(rrPts(390, f4 - 420, 430, 300, 14), { ink: PAL.ink, sw: 1 });
    for (const x of [430, 780]) paint(rectPts(x - 6, f4 - 120, 12, 120), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .7 });
    area(archW(DOORI.x, DOORI.top, DOORI.w, f4 - DOORI.top), '#6E4A34', '#5A3A2A', 110);
    for (let k = 1; k < 4; k++) pen([[DOORI.x - DOORI.w / 2 + k * DOORI.w / 4, DOORI.top + 40], [DOORI.x - DOORI.w / 2 + k * DOORI.w / 4, f4]], .8, '#4A2E22', 0);
    paint(archW(DOORI.x, DOORI.top, DOORI.w, f4 - DOORI.top), { ink: PAL.ink, sw: 1.1 });
    paint(rrPts(DOORI.x - 150, DOORI.top - 70, 300, 50, 10), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rrPts(DOORI.x + 58, DOORI.top + 150, 34, 50, 6), { wash: '#9C98A6', washOp: 255, ink: PAL.ink, sw: .6 });           // card reader
    paint(ellPts(DOORI.x + 75, DOORI.top + 166, 6, 6, 8), { wash: PAL.red, ink: null });
    wcw(rrPts(BENCH.x0, BENCH.y, BENCH.x1 - BENCH.x0, 22, 6), '#B98A57', 255, '#8A6246', 100); paint(rrPts(BENCH.x0, BENCH.y, BENCH.x1 - BENCH.x0, 22, 6), { ink: PAL.ink, sw: .8 });
    for (const x of [BENCH.x0 + 30, BENCH.x1 - 30]) paint(rectPts(x - 7, BENCH.y + 20, 14, f4 - BENCH.y - 20), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .6 });
    wcw(rrPts(1010, f4 - 190, 56, 190, 10), PAL.ochre, 255, '#B07A2A', 100); paint(rrPts(1010, f4 - 190, 56, 190, 10), { ink: PAL.ink, sw: .8 });
    paint(rrPts(1020, f4 - 170, 36, 16, 4), { wash: PAL.ink, washOp: 255, ink: null });
    // the exit: the red carpet on the floor, gold posts
    const g = D[5];
    wcw([[GATE.x - 90, g - 6], [GATE.x + 90, g - 6], [GATE.x + 230, 3600], [GATE.x - 230, 3600]], '#B8453A', 255, '#9A3530', 110);
    pen([[GATE.x - 78, g], [GATE.x - 205, 3600]], 1.4, '#E8C66A', .2); pen([[GATE.x + 78, g], [GATE.x + 205, 3600]], 1.4, '#E8C66A', .2);
    for (const [x, y] of [[GATE.x - 170, 3470], [GATE.x + 170, 3470], [GATE.x - 250, 3560], [GATE.x + 250, 3560]]) { paint(rectPts(x - 6, y - 90, 12, 90), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .6 }); paint(ellPts(x, y - 94, 11, 11, 10), { wash: '#E8C66A', ink: PAL.ink, sw: .6 }); }
    // the glass tube, floor to floor (openings at floor 3 and 4, it ends in the exit gate)
    const segs = [[520, D[3] - 250], [D[3] - 120, D[4] - 250], [D[4] + 10, D[5] - GATE.h + 10]];
    for (const [a, b] of segs) {
      paint(rectPts(TX - TW / 2, a, TW, b - a), { wash: '#E4F4F6', washOp: 150, ink: null });
      pen([[TX - TW / 2, a], [TX - TW / 2, b]], 1.1); pen([[TX + TW / 2, a], [TX + TW / 2, b]], 1.1);
      inkLine([[TX - TW / 2 + 16, a + 20], [TX - TW / 2 + 16, b - 20]], 2.4, PAL.cream, 'ink', 0);
      for (let y = a + 60; y < b - 30; y += 260) paint(rrPts(TX - TW / 2 - 10, y, TW + 20, 22, 6), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .6 });
      paint(rrPts(TX - TW / 2 - 16, b - 14, TW + 32, 28, 8), { wash: '#46638C', washOp: 255, ink: PAL.ink, sw: .7 });
    }
    paint(rrPts(TX - 80, D[3] - 142, 160, 24, 6), { wash: '#46638C', washOp: 255, ink: PAL.ink, sw: .7 });     // floor-3 intake
  } });

  // ---------------- helpers ----------------
  const logZ = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
  function camKF(t, keys) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const a = keys[i - 1], b = keys[i], k = ease((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), logZ(a[3], b[3], k)]; }
    return keys[keys.length - 1].slice(1);
  }
  // items falling in the tube between y0 and y1, `rate` per second, during [t0, t1]
  function tubeStream(st, y0, y1, t0, t1, rate, key, speed = 900) {
    const life = (y1 - y0) / speed;
    for (let b = Math.ceil((t0 - life) * rate) / rate; b < Math.min(st, t1); b += 1 / rate) {
      const age = st - b; if (age < 0 || age > life) continue;
      parchment(TX + (hash(b * 31 + key) - .5) * 36, y0 + age * speed, .5, { rot: (hash(b * 7 + key) - .5) * 1.6 + age * 3 * (hash(b) - .5) });
    }
  }
  // a parchment with a tiny face (it has an abstract) or none (faceless), or a « ? » (doubtful)
  function faceParch(x, y, s, o = {}) {
    parchment(x, y, s, { rot: o.rot || 0, out: o.out });
    boilSeed('a1s4 face ' + (o.key ?? x));
    const c = Math.cos(o.rot || 0), n = Math.sin(o.rot || 0), P = (dx, dy) => [x + (dx * c - dy * n) * s, y + (dx * n + dy * c) * s];
    if (o.kind === 'face') { for (const sd of [-1, 1]) paint(ellPts(...P(sd * 14, -8), 4 * s, 5 * s, 8), { wash: PAL.ink, ink: null }); inkLine([P(-12, 12), P(0, 20), P(12, 12)], 1.2 * s, PAL.ink, 'ink', .5); }
    if (o.kind === 'blank') { paint(rectPts(x - 36 * s, y - 20 * s, 72 * s, 66 * s), { wash: '#FFF6E2', washOp: 255, ink: null }); }
    if (o.kind === 'doubt') { paint(ellPts(...P(0, -2), 26 * s, 26 * s, 14), { wash: '#FFF1C9', washOp: 255, ink: null }); letter('?', ...P(0, 0), 44 * s, PAL.ochre, { weight: 700 }); }
  }
  function legs(x, y, s, ph) {   // two little legs under a walking parchment
    boilSeed('a1s4 legs');
    for (const sd of [-1, 1]) { const a = Math.sin(ph * TAU + (sd > 0 ? Math.PI : 0)) * .5; inkLine([[x + sd * 12 * s, y], [x + sd * 12 * s + Math.sin(a) * 16 * s, y + Math.cos(a) * 22 * s]], 1.6 * s, PAL.ink, 'ink', 0); }
  }
  // the counter box riding down the rail
  function counterBox(y, n, sub, subK, extra, extraK) {
    boilSeed('a1s4 counter');
    const x = RAIL_X + 170, w = 340, h = 150 + 42 * clamp(subK || 0) + 40 * clamp(extraK || 0), top = y - 75;
    paint(rrPts(x - w / 2, top, w, h, 20, 1), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: 1.1 });
    paint(rrPts(x - w / 2 + 14, top + 14, w - 28, h - 28, 12), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rrPts(RAIL_X - 26, y - 20, 52, 40, 8), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .7 });   // the carriage on the rail
    paint(rectPts(RAIL_X + 20, y - 8, x - w / 2 - RAIL_X - 18, 16), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .5 });
    letter(n, x, y, 72, '#FFF1CF', { weight: 700 });
    if (subK > 0) letter(sub, x, y + 68, 30, '#BDF1F6', { weight: 600, pop: subK });
    if (extraK > 0) letter(extra, x, y + 110, 26, '#FFE3A0', { weight: 600, pop: extraK });
  }

  // the lattice filter (also the paravent of 1.5): wooden bars on paper panels
  function lattice(x, y, w, h, o = {}) {
    const nx = 3, ny = 4, bar = o.bar ?? w * .07;
    boilSeed('a1s4 lattice');
    paint(rectPts(x - w / 2, y - h, w, h), { wash: o.paper || '#FFF3DC', washOp: 255, ink: null });
    if (o.glowK) glow(x, y - h / 2, w * .8, '#FFE3A0', o.glowK);
    for (let i = 0; i <= nx; i++) { const xx = x - w / 2 + i * w / nx; paint(rectPts(xx - bar / 2, y - h, bar, h), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: o.sw ?? .8 }); }
    for (let j = 0; j <= ny; j++) { const yy = y - h + j * h / ny; paint(rectPts(x - w / 2, yy - bar / 2, w, bar), { wash: '#9A6E44', washOp: 255, ink: PAL.ink, sw: o.sw ?? .8 }); }
  }
  window.A1_LATTICE = lattice;

  // ---------------- the shot ----------------
  function descent(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    // floor timings
    const f1A = 1.2, f1B = L(1) - .5, c1A = 1.4, c1B = 3.4;
    const f2A = L(1) + .6, f2B = E(1) + .6, c2A = L(1) + 1.0, c2B = E(1) + .2;
    const readA = L(2) - .2, doubt1 = lerp(L(3), E(3), .83), dehors = L(4) + .82, stopA = L(5) - .1, stopB = E(5) + .1;
    const gagA = E(5) + .2, wag = gagA + .8, drop = wag + 1.0, c3A = L(3) + .2, c3B = L(6) + 1.0;
    const f4A = L(7) - .3, c4A = L(7) + .2, c4B = L(7) + 1.9, waitK = lerp(L(7), E(7), .74);
    const exitA = L(8) - .4, c5A = L(8) + .5, c5B = L(8) + 1.4, conf = L(8) + 1.05;
    const zoomA = S.dur - 3.1;
    const [cx, cy, z] = camKF(st, [[0, HOP.x, 400, 1.35], [.3, HOP.x, 400, 1.35], [1.45, 960, 790, 1.0], [f1B - .1, 960, 780, 1.03],
      [f2A - .2, 960, 1390, 1.0], [f2B, 960, 1385, 1.04], [readA, 960, 1990, 1.0], [L(3) + .2, 975, 1990, 1.03], [doubt1 - .6, 1090, 2015, 1.15],
      [stopB, 1100, 2015, 1.18], [drop + .4, 1080, 2010, 1.16], [E(6) + .1, 960, 2000, 1.0], [f4A + .9, 960, 2590, 1.0], [E(7) - .2, 960, 2585, 1.04],
      [exitA + .9, 960, 3060, 1.0], [zoomA, 960, 3055, 1.03], [S.dur - .35, GATE.x, D[5] - GATE.h * .5, 8.0], [S.dur, GATE.x, D[5] - GATE.h * .5, 8.5]]);
    camBegin(cx, cy, z);
    drawPlate('a1s4_shaft', 0, 0);
    // the hopper (where 1.3 ended) and the flow in the tube
    funnel(HOP.x, HOP.y, HOP.s);
    glow(HOP.x, HOP.y - 20, 260, '#FFE3A0', .35 * (1 - seg(st, .1, .8)));
    for (let b = Math.floor((st - 1.2) * 14) / 14; b < Math.min(st, 2.4); b += 1 / 14) { const age = st - b; if (age < 0 || age > 1.2) continue; const k = age / 1.2; parchment(HOP.x + (hash(b * 13) - .5) * 700 * (1 - k), lerp(-60, HOP.y + 40, k * k), .55, { rot: k * 4 * (hash(b) - .5) }); }
    tubeStream(st, 520, D[3] - 260, 0, E(6), 9, 1);
    tubeStream(st, D[3] - 110, D[4] - 260, readA, E(7), 5, 2);
    tubeStream(st, D[4] + 20, D[5] - GATE.h, c4A, S.dur - .8, 3, 3, 700);
    // ---- floor 1: the clones
    {
      const ringY = D[1] - 230, scan = (st * 1.6) % 1;
      boilSeed('a1s4 ring');
      glow(TX, ringY, 90 + 30 * Math.sin(st * 6), PAL.data, .5);
      paint(ellPts(TX, ringY, 72, 20, 18), { ink: '#C9A04A', sw: 3 });
      inkLine([[TX - 64, ringY + 8 + scan * 30], [TX + 64, ringY + 8 + scan * 30]], 1.2, PAL.data, 'ink', 0);
      // twins spotted: a pair flashes, the copy slides down the chute, then they walk out in single file
      for (let b = Math.ceil(f1A * 2.6) / 2.6; b < Math.min(st, f1B); b += 1 / 2.6) {
        const age = st - b; if (age < 0) continue;
        const i = Math.round(b * 2.6);
        if (age < .35) { glow(TX, ringY + 10, 60, '#BDF1F6', .8 * (1 - age / .35)); parchment(TX - 18, ringY + 40, .5, { rot: -.2 }); parchment(TX + 18, ringY + 40, .5, { rot: .2 }); inkLine([[TX - 8, ringY + 40], [TX + 8, ringY + 40]], 2, PAL.data, 'ink', 0); }
        const sl = seg(age, .35, 1.0);
        let px, py, ph = null;
        if (sl < 1) { const p = through([[1012, D[1] - 200], [1120, D[1] - 122], [1235, D[1] - 22]], 4); const q = p[Math.min(p.length - 1, Math.floor(ease(sl) * (p.length - 1)))]; px = q[0]; py = q[1] - 22; }
        else { const w = age - 1.0; px = 1235 + w * 150; py = D[1] - 44 - Math.abs(Math.sin(w * 7)) * 8; ph = w * 3.5; if (px > 1525) continue; }
        if (age < .35) continue;
        parchment(px, py, .5, { rot: ph == null ? .5 : .06 * Math.sin(ph * TAU) });
        if (ph != null) legs(px, py + 26, .9, ph);
        if (i < 0) break;
      }
      const tk = seg(st, c1B - .2, c1B + .2);
      if (tk > 0) letter('− ' + fmtFR(2690), 1370, D[1] - 250, 40, PAL.night, { pop: tk, weight: 700, stroke: PAL.cream, strokeW: .2 });
    }
    // ---- floor 2: the stamp
    {
      const per = .55, tray = [1110, D[2] - 214];
      for (let b = Math.ceil(f2A / per) * per; b < Math.min(st, f2B); b += per) {
        const age = st - b, i = Math.round(b / per), kind = i % 3;
        let x = tray[0], y = tray[1], rot = 0;
        if (age < .15) { x = lerp(TX + 20, tray[0], age / .15); }
        else if (age > .45) { const k = seg(age, .45, 1.1); if (k >= 1) continue; const p = through([[1262, D[2] - 196], [1360, D[2] - 140], [1440, D[2] - 100]], 4); const q = p[Math.min(p.length - 1, Math.floor(easeIn(k) * (p.length - 1)))]; x = q[0]; y = q[1] - 10; rot = .6; }
        parchment(x, y, .5, { rot, out: age > .3 });
        boilSeed('a1s4 icon' + (i % 7));
        if (age < .45) {   // what it is: an erratum (struck text), a notice (speech bubble), out of period (calendar)
          if (kind === 0) { inkLine([[x - 16, y - 6], [x + 16, y + 8]], 1.6, PAL.red, 'ink', .3); inkLine([[x - 16, y + 8], [x + 12, y - 8]], 1.6, PAL.red, 'ink', .3); }
          else if (kind === 1) paint([[x - 14, y - 12], [x + 14, y - 12], [x + 14, y + 6], [x - 2, y + 6], [x - 10, y + 14], [x - 8, y + 6], [x - 14, y + 6]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 });
          else { paint(rrPts(x - 13, y - 12, 26, 24, 3), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 }); inkLine([[x - 13, y - 5], [x + 13, y - 5]], 1.4, PAL.red, 'ink', 0); }
        }
      }
      // the stamp arm: comes down at age .3 of each item
      const ph = ((st - f2A) % per + per) % per, active = st > f2A && st < f2B;
      const down = active ? (ph < .3 ? easeIn(seg(ph, .15, .3)) : 1 - ease(seg(ph, .3, .45))) : 0;
      const sy = lerp(D[2] - 420, D[2] - 250, down);
      boilSeed('a1s4 stamp');
      paint(rrPts(1206, D[2] - 440, 28, sy - (D[2] - 440), 6), { wash: '#9C98A6', washOp: 255, ink: PAL.ink, sw: .7 });
      paint(rrPts(1160, sy, 120, 34, 8), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .8 });
      paint(rrPts(1166, sy + 30, 108, 12, 4), { wash: PAL.red, washOp: 255, ink: null });
      const tk = seg(st, c2B - .2, c2B + .2);
      if (tk > 0) letter('− 750', 1480, D[2] - 230, 40, PAL.night, { pop: tk, weight: 700, stroke: PAL.cream, strokeW: .2 });
    }
    // ---- floor 3: quick reading, the Videur, the gag
    {
      const f3 = D[3], tableY = f3 - 150;
      // items slide from the tube outlet onto the table, get read, and go down the intake
      for (let b = Math.ceil(readA / .7) * .7; b < Math.min(st, E(6) + .5); b += .7) {
        const age = st - b, i = Math.round(b / .7); if (age > 2.1) continue;
        const x = TX + Math.sin(age * 1.5) * 150 * (i % 2 ? 1 : -1), y = lerp(f3 - 250, tableY - 20, ease(seg(age, 0, .4))) + 40 * ease(seg(age, 1.7, 2.1));
        faceParch(x, y, .55, { kind: 'face', rot: .1 * Math.sin(age * 3), key: 'r' + (i % 5) });
      }
      // Bip and Bop reading
      const reading = seg(st, readA, readA + .4);
      glow(710, f3 - 205, 80, '#FFE3A0', .4 * reading); glow(1210, f3 - 205, 80, '#FFE3A0', .4 * reading);
      bipbop(600, f3, 14, { who: 'bip', view: 'side', read: reading, lookX: .5, eye: st > doubt1 && st < doubt1 + .8 ? 'wide' : 'open' });
      bipbop(1320, f3, 14, { who: 'bop', view: 'side', flip: true, read: reading, lookX: .5, eye: st > dehors && st < dehors + .6 ? 'wide' : 'open' });
      // the Videur by the rope; doubtful ones are thrown out, faceless ones stopped
      const VX = 1500;
      let arms = 'crossed', brow = 0, fing = st;
      if (st > doubt1 - .8 && st < doubt1 + .5) { arms = st < doubt1 ? 'crossed' : 'point'; brow = seg(st, doubt1 - .8, doubt1 - .5); }
      if (st > dehors - 1.0 && st < dehors + .6) { arms = st < dehors ? 'crossed' : 'point'; brow = seg(st, dehors - 1, dehors - .6); }
      if (st > stopA && st < stopB) arms = 'stop';
      if (st > wag - .15 && st < drop) { arms = 'finger'; fing = (st - wag) * .8; brow = 1; }
      videur(VX, f3, 11.5, { arms, brow, finger: fing, sq: take(st, doubt1, .5).sq + take(st, dehors, .6).sq + take(st, stopA + .1, .4).sq });
      const toss = (tA, key) => {   // a doubtful parchment floats to the Videur, is weighed, then thrown out right
        const a = seg(st, tA - 1.1, tA - .5), k = seg(st, tA, tA + .7); if (a <= 0 || k >= 1) return;
        let p = arcPt([TX + 120, tableY - 20], [VX - 70, f3 - 170], 80, ease(a));
        if (k > 0) p = arcPt(p, [VX + 380, f3 - 420], 160, easeOut(k));
        faceParch(p[0], p[1], .6, { kind: 'doubt', rot: k * 5, key });
      };
      toss(doubt1, 'd1'); toss(dehors, 'd2');
      // faceless ones hop up to the rope and bounce off
      for (let i = 0; i < 3; i++) {
        const a = stopA + i * .45, k = seg(st, a, a + .5), bk = seg(st, a + .5, a + 1.2);
        if (k <= 0 || (bk >= 1 && i !== 1)) continue;
        let p = arcPt([TX + 150, tableY - 20], [VX - 120, f3 - 70], 60, ease(k));
        if (bk > 0) p = arcPt(p, [VX - 150 - i * 40, f3 - 30], 40, bk);
        if (i === 1 && st > gagA) continue;          // this one is Jumo's
        faceParch(p[0], p[1], .6, { kind: 'blank', rot: -.2 + bk * .3, key: 'b' + i });
        if (bk > 0) letter('!', p[0], p[1] - 60, 30, PAL.red, { alpha: 1 - bk, weight: 700 });
      }
    }
    // ---- floor 4: full texts, the bench
    {
      const f4 = D[4];
      // opened documents pinned on the board
      for (let i = 0; i < 6; i++) {
        const a = c4A + i * .28, k = seg(st, a, a + .5); if (k <= 0) continue;
        const col = i % 3, row = Math.floor(i / 3), bx = 470 + col * 135, by = f4 - 360 + row * 130;
        const p = arcPt([TX - 20, f4 - 240], [bx + 40, by + 45], 90, ease(k)), op = seg(k, .6, 1);
        boilSeed('a1s4 open' + i);
        const ww = lerp(40, 118, op), hh = lerp(50, 100, op);
        paint(rectPts(p[0] - ww / 2, p[1] - hh / 2, ww, hh), { wash: '#FFF6E2', washOp: 255, ink: PAL.ink, sw: .7 });
        if (op > .5) { inkLine([[p[0], p[1] - hh / 2 + 4], [p[0], p[1] + hh / 2 - 4]], .6, '#A48A6A', 'inkfine', 0); for (let r = 0; r < 5; r++) for (const sd of [-1, 1]) inkLine([[p[0] + sd * 8, p[1] - 34 + r * 15], [p[0] + sd * 50, p[1] - 34 + r * 15]], .5, '#A48A6A', 'inkfine', 0); paint(ellPts(p[0], p[1] - hh / 2 + 3, 5, 5, 8), { wash: PAL.red, ink: null }); }
      }
      // waiting ones: out of the tube, a ticket from the machine, a seat on the bench
      const nSeat = 9;
      for (let i = 0; i < nSeat; i++) {
        const a = L(7) + 1.0 + i * .42, k = seg(st, a, a + .7); if (k <= 0) continue;
        const sx = BENCH.x0 + 40 + i * ((BENCH.x1 - BENCH.x0 - 80) / (nSeat - 1)), sy = BENCH.y - 40;
        const p = k < .5 ? arcPt([TX + 30, f4 - 240], [1040, f4 - 200], 60, ease(k * 2)) : arcPt([1040, f4 - 200], [sx, sy], 70, ease(k * 2 - 1));
        const bob = k >= 1 ? 2 * Math.sin(st * 2 + i) : 0;
        parchment(p[0], p[1] + bob, .5, { rot: k >= 1 ? (hash(i) - .5) * .12 : .3 });
        boilSeed('a1s4 ticket' + i);
        if (k > .5) { paint(rrPts(p[0] + 14, p[1] + 6 + bob, 20, 26, 3), { wash: '#FFE3A0', washOp: 255, ink: PAL.ink, sw: .5 }); inkLine([[p[0] + 18, p[1] + 14 + bob], [p[0] + 30, p[1] + 14 + bob]], .6, PAL.ink, 'inkfine', 0); }
        if (k >= 1) for (const sd of [-1, 1]) inkLine([[p[0] + sd * 10, p[1] + 26], [p[0] + sd * 12, p[1] + 46 + 3 * Math.sin(st * 3 + i + sd)]], 1.4, PAL.ink, 'ink', 0);
      }
      letter('accès institutionnel', DOORI.x, DOORI.top - 45, 27, PAL.night, { weight: 600 });
    }
    // ---- the exit: the lattice filter, the red carpet, confetti
    {
      const g = D[5];
      // the included ones come through the filter and line up on the carpet
      for (let i = 0; i < 7; i++) {
        const a = exitA + .2 + i * .32, k = seg(st, a, a + .8); if (k <= 0) continue;
        const tx = GATE.x + ((i % 4) - 1.5) * 70 + (i > 3 ? 35 : 0), ty = g + 40 + (i > 3 ? 70 : 0);
        const p = arcPt([GATE.x, g - 140], [tx, ty], 40, ease(k)), bob = k >= 1 ? Math.abs(Math.sin(st * 5 + i)) * 10 * bump(st, conf - .2, conf + 1.8, .3) : 0;
        parchment(p[0], p[1] - bob, .62, { rot: (hash(i) - .5) * .2 });
        if (k >= 1) legs(p[0], p[1] + 32 - bob, 1, 0);
      }
      lattice(GATE.x, g, GATE.w, GATE.h, { glowK: .3 * seg(st, exitA, exitA + .5) + .5 * seg(st, zoomA, S.dur) });
      // the last parchment passes through the filter as we zoom in
      const lk = seg(st, zoomA + .1, zoomA + 1.4);
      if (lk > 0 && lk < 1) parchment(GATE.x + 20, lerp(g - GATE.h + 40, g - 140, ease(lk)), .5 * (1 + .3 * lk), { alpha: bump(lk, 0, 1, .2), rot: .1 });
      // Awa and Jumo cheer by the carpet
      const A = actP(st, [[0, 'neutre'], [exitA + .5, 'joie'], [conf, 'rire'], [conf + 2.0, 'fiere']]);
      awa(1350, g, 20, { ...A, view: 'q', flip: true, cap: 'labo', aL: 2.6 + .2 * Math.sin(st * 8) * seg(st, conf, conf + .3), aR: 2.4 + .2 * Math.sin(st * 8 + 1) * seg(st, conf, conf + .3), eL: .3, eR: .3 });
      // confetti
      if (st > conf - .05) for (let i = 0; i < 70; i++) {
        const age = st - conf - hash(i * 3) * .3; if (age < 0) continue;
        const side = i % 2 ? 1 : -1, vx = side * (200 + 380 * hash(i)), vy = -700 - 500 * hash(i + 5), x = GATE.x + side * 140 + vx * age, y = g - 260 + vy * age + 600 * age * age;
        if (y > g + 200) continue;
        boilSeed('a1s4 conf' + i);
        const c = [PAL.ochre, PAL.data, PAL.rose, '#9DBE6A', '#E8C66A', PAL.violet][i % 6], r = age * 9 + i;
        paint(xform([[-8, -4], [8, -4], [8, 4], [-8, 4]], x, y, r, 1), { wash: c, washOp: 255, ink: null });
      }
    }
    // ---- Jumo follows the camera down, and plays the gag on floor 3
    {
      let jx = cx + 330, jy = cy - 210 + 14 * Math.sin(st * 2.1), jf = 'happy', jr = .08 * Math.sin(st * 1.3), hold = false;
      if (st < 1.6) { const k = ease(seg(st, .3, 1.6)); jx = lerp(1190, jx, k); jy = lerp(640, jy, k); jf = st < .9 ? 'dizzy' : 'happy'; jr *= k; }
      if (st > f2A && st < f2B) jf = ((st - f2A) % .55) > .28 && ((st - f2A) % .55) < .4 ? 'wide' : 'happy';
      if (st > readA && st < E(6) + .5) {
        const home = [1190, D[3] - 330 + 10 * Math.sin(st * 2.3)], grab = [1330, D[3] - 50];
        jx = home[0]; jy = home[1]; jf = st < doubt1 ? 'happy' : st < stopB ? 'wide' : 'happy';
        const g1 = seg(st, gagA, gagA + .55), g2 = seg(st, drop, drop + .6);
        if (g1 > 0) { const p = arcPt(home, grab, -60, ease(g1)), q = arcPt(grab, [1250, D[3] - 260], 50, ease(seg(st, gagA + .55, wag - .2))); [jx, jy] = g1 < 1 ? p : q; jf = st < wag ? 'wink' : st < drop ? 'sad' : 'sad'; hold = st < drop + .1; jr = .2; }
        if (g2 > 0) { jx = lerp(1250, home[0], ease(g2)); jy = lerp(D[3] - 260, home[1], ease(g2)); jr = .2 * (1 - g2); }
      }
      if (st > f4A && st < exitA) { jx = BENCH.x1 - 30 + 0 * st; jy = BENCH.y - 150 + 8 * Math.sin(st * 2); jf = st > waitK ? 'loading' : 'happy'; }
      if (st > exitA) { jx = 1520; jy = D[5] - 300 + 20 * Math.sin(st * 3); jf = st > conf - .2 ? 'love' : 'happy'; }
      jumo(jx, jy, 9, { stage: 0, face: jf, prop: 'spin', spin: st * 9, rot: jr, boilKey: 'jumo' });
      if (hold) { const dropK = seg(st, drop, drop + .6); faceParch(jx + 50, jy - 44 + dropK * 400, .5, { kind: 'blank', rot: .5 + dropK * 3, key: 'jb' }); }
    }
    // ---- the counter on the rail follows us down
    {
      const n = st < c1A ? 7668 : st < c2A ? countTo(st, c1A, c1B, 4978, 7668) : st < c3A ? countTo(st, c2A, c2B, 4228, 4978) : st < c4A ? countTo(st, c3A, c3B, 686, 4228) : st < c5A ? countTo(st, c4A, c4B, 241, 686) : countTo(st, c5A, c5B, 139, 241);
      const sub = st >= c5A ? 'études incluses' : st >= c4A ? 'lus' : null;
      const k = st >= c5A ? seg(st, c5A, c5A + .3) : seg(st, c4A, c4A + .3);
      const wk = st >= c4A && st < c5A ? seg(st, waitK, waitK + .35) : 0;
      counterBox(cy - 300 / z, fmtFR(n), sub, sub ? k : 0, '(' + fmtFR(445) + ' en attente)', wk);
    }
    camEnd();
    if (st < .3) flash(0, PAL.cream);
  }

  scene('1.4', S => [[0, descent]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i);
      const f1A = 1.2, f1B = L(1) - .5, f2A = L(1) + .6, f2B = E(1) + .6, readA = L(2) - .2, doubt1 = lerp(L(3), E(3), .83), dehors = L(4) + .82;
      const stopA = L(5) - .1, gagA = E(5) + .2, wag = gagA + .8, drop = wag + 1.0, c3B = L(6) + 1.0, c4B = L(7) + 1.9, waitK = lerp(L(7), E(7), .74);
      const exitA = L(8) - .4, c5B = L(8) + 1.4, conf = L(8) + 1.05, zoomA = S.dur - 3.1;
      const out = [[.1, 'rustle', .08], [.4, 'slideDown', .06], [1.4, 'clic', .05], [3.4, 'clic', .1]];
      for (let b = Math.ceil(f1A * 2.6) / 2.6; b < f1B; b += 1 / 2.6) out.push([b, 'bip', .04, .1], [b + .4, 'whoosh', .03, .3]);
      out.push([f2A - .6, 'slideDown', .05]);
      for (let b = Math.ceil(f2A / .55) * .55; b < f2B; b += .55) out.push([b + .3, 'stamp', .12, .2]);
      out.push([E(1) + .2, 'clic', .1], [readA - .5, 'slideDown', .05], [readA + .3, 'rustle', .06]);
      out.push([doubt1 - .6, 'squeak', .05, .3], [doubt1, 'whoosh', .12, .5], [dehors, 'whoosh', .12, .5], [dehors + .05, 'thud', .08, .5]);
      for (let i = 0; i < 3; i++) out.push([stopA + i * .45 + .5, 'boing', .07, .3]);
      out.push([gagA, 'bipq', .08, .2], [gagA + .5, 'rustle', .06, .2], [wag, 'tick', .06, .4], [wag + .25, 'tick', .06, .4], [wag + .5, 'tick', .06, .4], [drop, 'bipsad', .08, .2], [c3B, 'clic', .12, -.4]);
      out.push([E(6) + .3, 'slideDown', .05], [L(7) + .2, 'rustle', .08, -.3]);
      for (let i = 0; i < 6; i++) out.push([L(7) + .2 + i * .28 + .4, 'pop', .05, -.4]);
      for (let i = 0; i < 9; i++) out.push([L(7) + 1.0 + i * .42 + .35, 'tick', .04, .4]);
      out.push([c4B, 'clic', .1, -.4], [waitK, 'chime', .05, .3], [E(7) + .2, 'slideDown', .05], [exitA + .3, 'step', .06], [c5B, 'chime', .1, -.3], [conf, 'confetti', .25], [conf + .1, 'sparkle', .1], [conf + .2, 'bip2', .06, .4], [zoomA, 'whoosh', .08], [S.dur - .5, 'whoosh', .12]);
      return out;
    });
})();
