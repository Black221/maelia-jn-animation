// scène 3.5 — Île RQ4 : le village aux chaises vides (V2 § 4, acte III).
// Lines: L0 « Quatrième île : ces outils sont rarement testés avec ceux qui décident. » · L1 « Heureusement, il y a
//        des exceptions, et MAELIA en fait partie, grâce aux démarches participatives. »
// One travelling shot on the village plate:
//   0 → L1   the clouds of 3.4 clear on a big round table under the palaver tree: the chairs are empty, three
//            tools present their charts to nobody (pages flip, a pointer taps… a hopeful look at the chairs, a sad
//            bip); Awa sighs
//   L1       laughter on the right: pan to the one full, happy table where farmers, a breeder, an elected official
//            and an adviser handle a small MAELIA model; a token is moved, the model changes, Jumo projects the
//            tree of futures, everybody cheers; Awa joins them — Catarino · Martin · Tàbara
//   end      the camera cranes up into the canopy and the clouds close in (→ 3.6 opens on the archipelago from above)
(() => {
  const GY = 900;
  const BIG = { x: 860, y: 850, rx: 330, ry: 80 };               // the big round table
  const JOY = { x: 1840, y: 905 };                               // the happy table
  const CHAIRS = (() => { const o = []; for (let i = 0; i < 9; i++) { const a = Math.PI * (.08 + i / 8 * .84); o.push([BIG.x - Math.cos(a) * (BIG.rx + 70), BIG.y - Math.sin(a) * (BIG.ry + 26), a]); } return o; })();
  const chairP = (x, y, s = 1) => {
    paint([[x - 30 * s, y - 110 * s], [x + 30 * s, y - 110 * s], [x + 26 * s, y - 40 * s], [x - 26 * s, y - 40 * s]], { wash: '#B98A57', washOp: 255, fill: '#A67C52', fillOp: 90, bleed: .02, tex: .5, border: .4, ink: PAL.ink, sw: .7 });
    paint(rrPts(x - 34 * s, y - 44 * s, 68 * s, 14 * s, 4), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .7 });
    for (const sd of [-1, 1]) pen([[x + sd * 28 * s, y - 30 * s], [x + sd * 30 * s, y]], 1.1, PAL.woodDk, 0);
  };
  definePlate('a3s5_village', { w: 2400, h: 1350, paint(w, h) {
    sky(w, h, [[0, '#8EC6D6'], [260, '#CFE6E0'], [470, '#F4E2BE']], 540);
    band(-40, w + 40, wave(520, 12, .003, 1), h + 40, '#E6CC98', 220);
    // round huts on the horizon
    for (let k = 0; k < 9; k++) { const x = 120 + k * 270 + (k % 2) * 40, y = 560 + (k % 3) * 8, s = .8 + (k % 3) * .15; paint(rectPts(x - 50 * s, y - 60 * s, 100 * s, 60 * s), { wash: '#E3B77A', washOp: 255, ink: PAL.ink, sw: .6 }); paint([[x - 66 * s, y - 56 * s], [x + 66 * s, y - 56 * s], [x, y - 126 * s]], { wash: '#B98A57', washOp: 255, fill: '#9A7042', fillOp: 90, bleed: .02, tex: .6, border: .4, ink: PAL.ink, sw: .6 }); paint(rrPts(x - 12 * s, y - 36 * s, 24 * s, 36 * s, 6), { wash: '#6E4A34', washOp: 255, ink: null }); }
    band(-40, w + 40, wave(610, 10, .004, 3), h + 40, '#E8C68E', 235);
    for (let i = 0; i < 70; i++) { const x = hash(i * 4.1) * w, y = 640 + hash(i * 6.7) * 700; paint(ellPts(x, y, 6 + hash(i) * 7, 3 + hash(i) * 3, 8), { wash: '#D2A874', washOp: 200, ink: null }); }
    // the palaver tree: a thick trunk, a wide canopy that shades the big table
    wcw([[BIG.x - 70, 820], [BIG.x + 70, 820], [BIG.x + 50, 480], [BIG.x + 110, 380], [BIG.x - 110, 380], [BIG.x - 50, 480]], '#8A6246', 255, '#6E4A34', 110);
    for (const [a, l] of [[-2.6, 330], [-2.2, 260], [-1.3, 200], [-.8, 280], [-.45, 340]]) pen([[BIG.x + Math.cos(a) * 60, 400], [BIG.x + Math.cos(a) * l * .5, 400 + Math.sin(a) * l * .35], [BIG.x + Math.cos(a) * l, 400 + Math.sin(a) * l * .55]], 2.2, '#6E4A34', .4);
    paint(ellPts(BIG.x, BIG.y + 30, 520, 110, 30), { wash: '#C9A874', washOp: 200, ink: null });      // shade
    for (let k = 0; k < 16; k++) { const a = Math.PI * (1 + k / 15), x = BIG.x + Math.cos(a) * 560 * (.85 + .15 * hash(k)), y = 250 + Math.sin(a) * 170 + hash(k * 3) * 40; blob(x, y, 110 + hash(k) * 60, ['#5E8C4E', '#6E9A55', '#4E7A4A'][k % 3], 220, .08); }
    for (let k = 0; k < 8; k++) blob(BIG.x - 380 + k * 110, 130 + hash(k * 5) * 60, 90, '#6E9A55', 220, .08);
    // the empty chairs (back row), the big table, the chairs in front
    CHAIRS.forEach(([x, y]) => chairP(x, y, .95));
    paint(ellPts(BIG.x, BIG.y + 40, BIG.rx - 20, 30, 24), { wash: '#6E4A34', washOp: 200, ink: null });
    wcw(ellPts(BIG.x, BIG.y, BIG.rx, BIG.ry, 36), '#C99160', 255, '#B98A57', 100);
    paint(ellPts(BIG.x, BIG.y, BIG.rx, BIG.ry, 36), { ink: PAL.ink, sw: .9 });
    paint([[BIG.x - 40, BIG.y + 70], [BIG.x + 40, BIG.y + 70], [BIG.x + 30, GY + 20], [BIG.x - 30, GY + 20]], { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .8 });
    for (const dx of [-220, 220]) chairP(BIG.x + dx, BIG.y + 170, 1.05);
    // a smaller tree shading the happy table
    treeP(2150, 900, 380, '#5E8C4E');
  } });

  // ---------------- live props ----------------
  function easel(x, y, st, i, look) {             // a tool presenting charts to nobody
    boilSeed('easel' + i);
    for (const sd of [-1, 1]) inkLine([[x + sd * 30, y], [x + sd * 8, y - 190]], 2.2, PAL.woodDk, 'ink', 0);
    const page = Math.floor((st + i * .4) / 1.3), flip = frac((st + i * .4) / 1.3);
    paint(rectPts(x - 62, y - 200, 124, 96), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .8 });
    const kind = (page + i) % 3;
    if (kind === 0) for (let b = 0; b < 4; b++) { const hh = 20 + hash(page * 7 + b + i) * 50; paint(rectPts(x - 46 + b * 24, y - 112 - hh, 16, hh), { wash: [PAL.data, PAL.ochre, PAL.soil, PAL.red][b], washOp: 255, ink: null }); }
    else if (kind === 1) inkLine(Array.from({ length: 8 }, (_, k) => [x - 50 + k * 14, y - 124 - 50 * hash(page * 3 + k + i)]), 1.4, PAL.night, 'ink', .3);
    else { paint(ellPts(x, y - 152, 32, 32, 18), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 }); paint([[x, y - 152], [x + 32, y - 152], [x + 22, y - 176]], { wash: PAL.data, washOp: 255, ink: null }); }
    if (flip > .85) { const k = (flip - .85) / .15; paint([[x - 62, y - 200], [x + 62, y - 200], [x + 62, y - 200 + 96 * (1 - k)], [x - 62, y - 200 + 96 * (1 - k)]], { wash: '#F4EAD8', washOp: 255, ink: PAL.ink, sw: .6 }); }
    // the presenter: a small screen-headed tool on a stand, with a pointer
    const px = x + 96, sad = look;
    inkLine([[px, y], [px, y - 70]], 3, '#6B6A7A', 'ink', 0);
    paint(rrPts(px - 34, y - 132, 68, 62, 10), { wash: '#9FB9CF', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(px - 26, y - 124, 52, 36, 6), { wash: PAL.night, washOp: 255, ink: null });
    for (const sd of [-1, 1]) paint(ellPts(px + sd * 10 + (sad ? 6 : -6), y - 108 + (sad ? 3 : 0), 3.5, sad ? 2 : 4, 6), { wash: PAL.data, washOp: 255, ink: null });
    const tap = Math.sin(st * 6 + i) * .15 * (1 - sad);
    inkLine([[px - 30, y - 100], [x + 30, y - 150 + tap * 60]], 1.6, PAL.ink, 'ink', 0);
  }
  function tokens(x, y, st, moved) {              // the little pieces on the MAELIA model (live)
    for (let i = 0; i < 5; i++) {
      const tx = x - 90 + i * 45 + (i === 2 ? 55 * ease(moved) : 0), ty = y - 10 + (i % 2) * 22 - (i === 2 ? 40 * Math.sin(moved * Math.PI) : 0);
      boilSeed('tok' + i); paint(ellPts(tx, ty, 9, 7, 10), { wash: [PAL.red, PAL.ochre, PAL.data, PAL.soil, '#7B5CA8'][i], washOp: 255, ink: PAL.ink, sw: .5 });
    }
  }

  function village(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const pan = [E(0) + .5, L(1) + .7], mv = L(1) + 1.6, proj = L(1) + 2.6, cheer = L(1) + 3.7, crane = [E(1) + .2, S.dur];
    const cx = kf(st, [[0, 900], [pan[0], 930], [pan[1], 1640], [crane[0], 1650], [S.dur, 1500]]);
    const cy = kf(st, [[0, 640], [pan[0], 660], [pan[1], 770], [crane[0], 775], [S.dur, 420]]);
    const z = kf(st, [[0, 1.12], [pan[0], 1.16], [pan[1], 1.3], [crane[0], 1.32], [S.dur, 1.25]]);
    camBegin(cx, cy, z);
    drawPlate('a3s5_village', 0, 0);
    // the tools presenting to the empty chairs
    const hope = bump(st, 2.4, 3.6, .25);
    if (A3.vis(BIG.x, 700, 500)) [[BIG.x - 330, BIG.y - 30], [BIG.x + 20, BIG.y - 70], [BIG.x + 330, BIG.y - 30]].forEach(([x, y], i) => easel(x, y, st, i, i === 1 ? hope : 0));
    if (hope > .3 && A3.vis(BIG.x, 600, 300)) letter('?', BIG.x + 140, BIG.y - 250, 44, PAL.night, { pop: seg(st, 2.5, 2.8), font: FONT.marker, weight: 400, alpha: hope });
    // a leaf drifts down onto an empty chair
    const lf = seg(st, 1.4, 3.4); if (lf > 0 && lf < 1 && A3.vis(BIG.x, 600, 400)) { const [x0, y0] = CHAIRS[3]; boilSeed('leaf'); paint(ellPts(x0 + 60 * Math.sin(lf * 7) * (1 - lf), lerp(300, y0 - 44, ease(lf)), 12, 6, 10, 0, Math.sin(lf * 9)), { wash: '#7FA968', washOp: 255, ink: PAL.ink, sw: .5 }); }
    // the happy table: four actors around a small MAELIA model
    if (A3.vis(JOY.x, 800, 450)) {
      const joy = (t0, name = 'rire') => [[0, 'joie'], [cheer, name]];
      const moodA = actP(st, [[0, 'concentree', { lookY: .6 }], [mv + .3, 'joie'], [cheer, 'rire']]);
      person(JOY.x - 90, JOY.y - 40, 15, { preset: ACTEURS.eleveur, ...actP(st, joy()), sit: true, view: 'front', aR: .9 + .2 * Math.sin(st * 3), eR: .8, boilKey: 'j1', seed: 21 });
      person(JOY.x + 90, JOY.y - 40, 15, { preset: ACTEURS.elu, ...actP(st, [[0, 'neutre', { lookX: -.4 }], [proj + .2, 'emerveillee', { lookY: -.8 }], [cheer, 'rire']]), sit: true, view: 'front', aL: st > mv ? 2.3 : .3, eL: .2, finger: 'L', boilKey: 'j2', seed: 22 });
      // the table and the model in front of the two at the back
      boilSeed('joytable');
      paint(ellPts(JOY.x, JOY.y + 8, 250, 64, 30), { wash: '#C99160', washOp: 255, ink: PAL.ink, sw: .9 });
      paint([[JOY.x - 30, JOY.y + 60], [JOY.x + 30, JOY.y + 60], [JOY.x + 24, JOY.y + 140], [JOY.x - 24, JOY.y + 140]], { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .8 });
      drawPlate('maquette', JOY.x, JOY.y - 6, { s: .42, ax: .5, ay: .5 });
      tokens(JOY.x, JOY.y - 6, st, seg(st, mv, mv + .5));
      if (st > mv + .4) { boilSeed('newfield'); paint(ellPts(JOY.x + 40, JOY.y - 20, 40 * backOut(seg(st, mv + .4, mv + .8)), 16 * backOut(seg(st, mv + .4, mv + .8)), 14), { wash: '#A7D08A', washOp: 220, ink: PAL.soil, sw: .5 }); }
      if (st > proj) futureTree(JOY.x - 150, JOY.y - 230, .34, st, { seed: 8, depth: 2, grow: seg(st, proj, proj + 1.2), state: () => ({ a: 1, noGlow: true }) });
      person(JOY.x - 250, JOY.y + 50, 15.5, { preset: ACTEURS.agricultrice, ...moodA, sit: true, view: 'side', aR: st > mv - .4 && st < mv + .6 ? 1.35 : .8, eR: .3, boilKey: 'j3', seed: 23 });
      person(JOY.x + 250, JOY.y + 50, 15.5, { preset: ACTEURS.conseillere, ...actP(st, [[0, 'concentree', { lookY: .4 }], [cheer, 'joie']]), sit: true, view: 'side', flip: true, boilKey: 'j4', seed: 24 });
    }
    // Awa: watches the empty table (sighs), then walks over and joins the happy table
    const ax = kf(st, [[0, 380], [pan[0] + .2, 380], [L(1) + 1.8, 1470], [99, 1470]]), walking = st > pan[0] + .2 && st < L(1) + 1.8;
    const am = actP(st, [[0, 'neutre', { lookX: .6 }], [2.2, 'soupir', { lookX: .6 }], [pan[0] - .2, 'surprise', { lookX: .9 }], [L(1) + 1.9, 'joie', { lookX: .8 }], [cheer, 'rire']]);
    if (A3.vis(ax, 900, 300)) A3.awa(ax, GY + 75, 19, walking ? { ...am, view: 'side', walk: (ax - 380) / 125, aL: undefined, aR: undefined, eL: undefined, eR: undefined, fist: false, finger: undefined, handR: undefined } : { ...am, view: 'q' });
    const jx = kf(st, [[0, 520], [pan[0] + .2, 520], [L(1) + 1.6, 1700], [proj - .3, 1720], [99, 1700]]), jy = kf(st, [[0, 700], [L(1) + 1.6, 640], [99, 640]]) + Math.sin(st * 2.4) * 7;
    if (A3.vis(jx, jy, 200)) A3.jumo(jx, jy, 10, { face: st < 2.4 ? 'neutral' : st < pan[0] ? 'sad' : st < proj ? 'happy' : st < cheer ? 'tree' : 'love', beamOut: bump(st, proj, cheer + 1, .3), boilKey: 'jumo' });
    camEnd();
    cite(['Catarino et al., 2021 : scénarios co-conçus avec MAELIA', 'Martin et al., 2016 : MAELIA évalué avec des experts locaux', 'Tàbara et al., 2018 : trajectoires co-construites'],
      seg(st, L(1) + 1.4, L(1) + 2.6) * (1 - seg(st, S.dur - 1.4, S.dur - 1.1)));
    flushLetters();
    if (st < 1) A3.clouds(1 - seg(st, 0, .9), 'cl34');
    A3.clouds(seg(st, S.dur - 1.1, S.dur - .08), 'cl35');
  }

  scene('3.5', S => [[0, village]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i), mv = L(1) + 1.6, proj = L(1) + 2.6, cheer = L(1) + 3.7;
      const out = [[.05, 'whoosh', .1], [1.3, 'rustle', .05, -.3], [2.6, 'bipq', .06], [3.5, 'bipsad', .07], [3.4, 'tick', .03],
        [E(0) + .3, 'pop', .05, .6], [E(0) + .5, 'whoosh', .06], [mv, 'pop', .08, .3], [mv + .45, 'bloop', .08, .3], [proj, 'sparkle', .06, .4], [cheer, 'confetti', .1, .4], [S.dur - 1.1, 'whoosh', .12]];
      for (let k = 0; k < 6; k++) out.push([1 + k * 1.3, 'rustle', .03]);
      for (let k = 0; k < 6; k++) out.push([E(0) + .7 + k * .36, 'step', .04]);
      return out;
    });
})();
