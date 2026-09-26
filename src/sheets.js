// sheets.js: model sheets and style frames, as standalone loops (labels are fine here: reference, not film).
//   node render.mjs --loop=sheet_awa --stills=0.4 --out=out/sheets
// Loops: sheet_awa, sheet_jumo, sheet_bipbop, sheet_arbitre, sheet_videur, sheet_tacti, sheet_acteurs,
//        style_dawn, style_library, style_territory, style_tree, style_reunion, style_senegal, style_archipel
(() => {
  const label = (txt, x, y, size = 24, col = PAL.ink) => letter(txt, x, y, size, col, { weight: 500, alpha: .85 });
  const title = (txt) => letter(txt, 960, 58, 44, PAL.night, { weight: 600 });
  const floor = (y, x0 = 60, x1 = W - 60) => { boilSeed('floor' + y); inkLine([[x0, y + 6], [W / 2, y + 3], [x1, y + 7]], .6, mixCol(PAL.paper, PAL.ink, .35), 'inkfine', .5); };
  const bg = () => { boilSeed('bg'); paint(rectPts(-20, -20, W + 40, H + 40), { wash: PAL.paper, washOp: 255, ink: null }); };

  // ---------- Awa ----------
  LOOPS.sheet_awa = t => {
    bg(); title('Awa — planche de référence');
    const views = [['face', 'front'], ['trois-quarts', 'q'], ['profil', 'side'], ['dos', 'back']];
    views.forEach(([n, v], i) => { const x = 250 + i * 330; awa(x, 500, 26, { ...feelP('neutre', t), view: v, boilKey: 'v' + i, seed: i }); label(n, x, 535); });
    floor(500, 80, 1420);
    // the reversible cap: terrain / labo
    awa(1640, 500, 26, { ...feelP('joie', t), view: 'q', cap: 'labo', boilKey: 'labo' });
    label('casquette « labo »', 1640, 535); floor(500, 1480, 1840);
    const ex = [['joie', 'joie'], ['doute', 'doute (se gratte la tête)'], ['surprise', 'surprise'], ['determinee', 'déterminée'], ['grimace', 'grimace']];
    ex.forEach(([e, n], i) => { const x = 200 + i * 380; awa(x, 990, 26, { ...feelP(e, t), boilKey: 'e' + i, seed: i + 5 }); label(n, x, 1025, 22); });
    floor(990);
    label('proportions : hauteur 12 s · tête 38 % · s = 22 en plan moyen', 960, 104, 22, PAL.grey);
  };
  LOOPS.sheet_awa.len = 4;

  // ---------- Jumo ----------
  LOOPS.sheet_jumo = t => {
    bg(); title('Jumo — les trois paliers');
    const st = [['0 · MODÈLE — écran gris, ne capte rien', 0], ['1 · OMBRE — une antenne : il reçoit', 1], ['2 · JUMEAU — deux antennes : il répond', 2]];
    st.forEach(([n, s], i) => {
      const x = 330 + i * 630, y = 380 + Math.sin(t * 2 + i) * 8;
      if (s >= 1) { for (let k = 0; k < 4; k++) { const ph = frac(t * .7 + k / 4); glow(x - 1.4 * 24 - 10, y - 180 + ph * -120 + 120, 20, PAL.data, .6 * Math.sin(ph * Math.PI)); } }
      jumo(x, y, 24, { stage: s, face: s === 0 ? 'neutral' : s === 1 ? 'scan' : 'tree', prop: 'spin', beamIn: s >= 1 ? .7 : 0, beamOut: s === 2 ? .7 : 0, boilKey: 'j' + i, shadowY: 620 });
      label(n, x, 680, 23);
    });
    const faces = ['happy', 'wide', 'sad', 'love', 'question', 'cookie'];
    faces.forEach((f, i) => { const x = 210 + i * 300; jumo(x, 900 + Math.sin(t * 3 + i) * 5, 13, { stage: 2, face: f, boilKey: 'f' + i }); label(f, x, 1010, 21); });
    label('proportions : corps r 4 u · écran 5,4 × 3,5 u · u = 14 en plan moyen', 960, 112, 22, PAL.grey);
  };
  LOOPS.sheet_jumo.len = 4;

  // ---------- Bip & Bop ----------
  LOOPS.sheet_bipbop = t => {
    bg(); title('Bip & Bop — robots bibliothécaires jumeaux');
    const v = [['face', 'front'], ['profil', 'side'], ['dos', 'back']];
    v.forEach(([n, vv], i) => { bipbop(160 + i * 230, 480, 17, { who: 'bip', view: vv, boilKey: 'bi' + i }); label('Bip · ' + n, 160 + i * 230, 515, 21); });
    v.forEach(([n, vv], i) => { bipbop(1130 + i * 230, 480, 17, { who: 'bop', view: vv, boilKey: 'bo' + i, flip: true }); label('Bop · ' + n, 1130 + i * 230, 515, 21); });
    floor(480);
    const ex = [['lit', { read: 1, eye: 'open', lookY: .6 }], ['oui ✔', { sign: 'yes', signK: 1, eye: 'happy' }], ['non ✖', { sign: 'no', signK: 1, eye: 'open' }], ['surpris', { eye: 'wide' }], ['tape-m’en-cinq', { highfive: 1, eye: 'happy' }]];
    ex.forEach(([n, o], i) => { const x = 210 + i * 375; bipbop(x, 1000, 15, { who: i % 2 ? 'bop' : 'bip', boilKey: 'x' + i, ...o }); label(n, x, 1032, 21); });
    floor(1000);
  };
  LOOPS.sheet_bipbop.len = 4;

  // ---------- Maître Arbitre ----------
  LOOPS.sheet_arbitre = t => {
    bg(); title('Maître Arbitre — chouette-robot à lunettes');
    [['face', 'front'], ['profil', 'side'], ['dos', 'back']].forEach(([n, v], i) => { arbitre(330 + i * 630, 470, 22, { view: v, boilKey: 'a' + i }); label(n, 330 + i * 630, 505); });
    floor(470);
    const ex = [['plane', { wing: 1, eyes: 'open', dy: -1.5 }], ['ajuste ses lunettes', { glasses: 1, eyes: 'narrow' }], ['tranche !', { gavel: 1, eyes: 'wide' }], ['hausse les épaules', { shrug: 1, eyes: 'closed' }], ['sceptique', { eyes: 'narrow', lookX: .6 }]];
    ex.forEach(([n, o], i) => { const x = 210 + i * 375; arbitre(x, 1000, 17, { boilKey: 'x' + i, ...o }); label(n, x, 1032, 21); });
    floor(1000);
  };
  LOOPS.sheet_arbitre.len = 4;

  // ---------- le Videur ----------
  LOOPS.sheet_videur = t => {
    bg(); title('Le Videur « Doute »');
    [['face', 'front'], ['profil', 'side'], ['dos', 'back']].forEach(([n, v], i) => { videur(330 + i * 630, 520, 20, { view: v, boilKey: 'v' + i }); label(n, 330 + i * 630, 555); });
    floor(520);
    const ex = [['bras croisés', { arms: 'crossed' }], ['« non » du doigt', { arms: 'finger' }], ['« dehors ! »', { arms: 'point' }], ['stop', { arms: 'stop' }], ['sourcil levé', { arms: 'crossed', brow: 1 }]];
    ex.forEach(([n, o], i) => { const x = 210 + i * 375; videur(x, 1010, 13, { boilKey: 'x' + i, ...o }); label(n, x, 1040, 21); });
    floor(1010);
  };
  LOOPS.sheet_videur.len = 4;

  // ---------- Tacti ----------
  LOOPS.sheet_tacti = t => {
    bg(); title('Tacti — robot d’irrigation hyperactif');
    [['face', 'front'], ['profil', 'side'], ['dos', 'back']].forEach(([n, v], i) => { tacti(300 + i * 630, 500, 26, { view: v, boilKey: 't' + i, open: i === 0 ? .8 : 0 }); label(n, 300 + i * 630, 540); });
    floor(500);
    const ex = [['« Maintenant ! »', { mouth: 'shout', open: 1 }], ['ravi', { mouth: 'grin', jitter: .3 }], ['étonné', { mouth: 'o', jitter: .2 }], ['tourne la vanne', { mouth: 'shout', valve: t * 20 }], ['étourdi', { eyes: 'dizzy', mouth: 'o', jitter: .1 }]];
    ex.forEach(([n, o], i) => { const x = 190 + i * 380; tacti(x, 1000, 17, { boilKey: 'x' + i, ...o }); label(n, x, 1032, 21); });
    floor(1000);
  };
  LOOPS.sheet_tacti.len = 4;

  // ---------- the territory actors ----------
  LOOPS.sheet_acteurs = t => {
    bg(); title('Les acteurs du territoire');
    const A = [['agricultrice', 'joie'], ['eleveur', 'neutre'], ['elu', 'inquiete'], ['conseillere', 'fiere']];
    A.forEach(([k, e], i) => { const x = 260 + i * 470; person(x, 560, 28, { preset: ACTEURS[k], ...feelP(e, t), boilKey: k }); label({ agricultrice: 'agricultrice', eleveur: 'éleveur', elu: 'élu', conseillere: 'conseillère' }[k], x, 600); });
    floor(560);
    A.forEach(([k], i) => { const x = 260 + i * 470; person(x, 1000, 20, { preset: ACTEURS[k], ...feelP(['surprise', 'doute', 'joie', 'determinee'][i], t), view: i % 2 ? 'q' : 'side', boilKey: k + 'b' }); });
    floor(1000);
  };
  LOOPS.sheet_acteurs.len = 4;

  // ======================== style frames: one per setting ========================
  const cam = (cx, cy, z) => camBegin(cx, cy, z);

  LOOPS.style_dawn = t => {
    cam(1240, 700, 1.0);
    drawPlate('dawn', 0, 0);
    for (let i = 0; i < 7; i++) sensor(300 + i * 250 + (i % 2) * 60, 1000 + (i % 3) * 50, 1.6, t, { key: i });
    tractor(760, 1040, 1.05);
    awa(900, 848, 21, { ...feelP('joie', t), sit: true, view: 'q', aR: 2.6, eR: .3, handR: 'open', boilKey: 'awa' });
    jumo(1150, 700 + Math.sin(t * 2.2) * 10, 11, { stage: 0, face: 'happy', prop: 'spin', shadowY: 1060, rot: .06 });
    // a satellite passing like a shooting star
    const sx = 1700 + t * 40; inkLine([[sx - 220, 150], [sx, 120]], 1.4, PAL.cream, 'dry', .2); glow(sx, 120, 30, PAL.cream, .8);
    camEnd();
  };
  LOOPS.style_dawn.len = 4;

  LOOPS.style_library = t => {
    cam(1200, 700, 1.0);
    drawPlate('library', 0, 0);
    for (const [i, x] of [[0, 520], [1, 900], [2, 1500], [3, 1880]].map(([i, x]) => [i, x])) well(x, 1060 - (i === 1 || i === 2 ? 40 : 0), .8, t, { fill: .75 + .25 * Math.sin(t * 2 + i) });
    funnel(1200, 250, .75, { gauge: .6 });
    for (let k = 0; k < 16; k++) { const ph = frac(t * .35 + hash(k)), x = lerp(900 + hash(k + 3) * 600, 1200 + (hash(k) - .5) * 300, ph), y = lerp(900, 260, ph); parchment(x, y, .7, { rot: ph * 6 + k }); }
    awa(1260, 1150, 24, { ...feelP('emerveillee', t), view: 'q', cap: 'labo', boilKey: 'awa' });
    jumo(1470, 870 + Math.sin(t * 2.4) * 8, 11, { stage: 0, face: 'wide', prop: 'spin', flip: true });
    camEnd();
  };
  LOOPS.style_library.len = 4;

  LOOPS.style_territory = t => {
    cam(1200, 690, 1.0);
    drawPlate('hill', 0, 0);
    dome(1200, 1030, .95, t, {});
    awa(640, 1200, 24, { ...feelP('fiere', t), view: 'q', boilKey: 'awa' });
    // data balls bouncing off the glass
    const bx = 1720 + Math.sin(t * 4) * 20; for (let k = 0; k < 3; k++) { const ph = frac(t * .8 + k / 3), p = arcPt([1900, 700], [1680, 640], 120, ph); glow(p[0], p[1], 30, PAL.data, .5); paint(ellPts(p[0], p[1], 12, 12, 10), { wash: PAL.data, ink: PAL.ink, sw: .6 }); }
    jumo(1950, 620 + Math.sin(t * 2) * 10, 11, { stage: 0, face: 'angry', prop: 'spin', flip: true });
    camEnd();
  };
  LOOPS.style_territory.len = 4;

  LOOPS.style_tree = t => {
    cam(1200, 675, 1.0);
    drawPlate('night', 0, 0);
    const B = treeBranches(420, 760, 1.25, 4, 3);
    futureTree(420, 760, 1.25, t, { branches: B, grow: 1, state: b => b.i === 2 ? { col: PAL.red, a: .7 } : b.i === 5 ? { a: .35, w: .4 } : null });
    const lock = B[1]; padlock(lock.tip[0], lock.tip[1] - 6, 1.4, { shut: 1 });
    const door = B[8] || B[4]; glow(door.tip[0], door.tip[1], 90, PAL.ochre, .7); paint(rrPts(door.tip[0] - 26, door.tip[1] - 70, 52, 80, 22), { wash: '#FFE6A8', washOp: 220, ink: PAL.ochre, sw: 1.2 });
    const sx = 700, sy = 820;
    awa(sx, sy, 20, { ...feelP('emerveillee', t), view: 'q', boilKey: 'awa', noShadow: true });
    jumo(sx + 170, sy - 250 + Math.sin(t * 2) * 8, 10, { stage: 2, face: 'tree', prop: 'spin', beamOut: .6, beamIn: .6 });
    camEnd();
  };
  LOOPS.style_tree.len = 4;

  LOOPS.style_reunion = t => {
    cam(1200, 690, 1.0);
    drawPlate('reunion', 0, 0);
    for (let i = 0; i < 22; i++) { const x = 250 + hash(i) * 1900, y = 820 + hash(i + 7) * 420, k = .5 + .5 * Math.sin(t * 4 + i * 1.7); glow(x, y, 26, '#F9C86A', .8 * k); paint(ellPts(x, y, 4, 4, 8), { wash: '#FFE9A8', ink: null }); }
    awa(1250, 1180, 22, { ...feelP('joie', t), view: 'front', boilKey: 'awa' });
    jumo(1500, 930 + Math.sin(t * 3) * 10, 11, { stage: 1, face: 'love', prop: 'spin', beamIn: .8, rot: -.08 });
    camEnd();
  };
  LOOPS.style_reunion.len = 4;

  LOOPS.style_senegal = t => {
    cam(1200, 690, 1.0);
    drawPlate('senegal', 0, 0);
    // herd in transhumance crossing the plain (small cattle drawn live)
    for (let i = 0; i < 6; i++) { const x = 1400 + i * 95 - t * 10, y = 930 + (i % 2) * 20; boilSeed('cow' + i); paint(ellPts(x, y, 34, 18, 14), { wash: i % 3 ? '#E9DCC6' : '#8A6246', washOp: 255, ink: PAL.ink, sw: .7 }); paint(ellPts(x + 34, y - 10, 13, 10, 10), { wash: i % 3 ? '#E9DCC6' : '#8A6246', washOp: 255, ink: PAL.ink, sw: .6 }); inkLine([[x + 38, y - 20], [x + 48, y - 32]], 1.2, PAL.ink, 'ink', 0); for (const lx of [-20, -8, 12, 24]) inkLine([[x + lx, y + 14], [x + lx, y + 34]], 1.2, PAL.ink, 'ink', 0); }
    person(1250, 1000, 11, { preset: ACTEURS.eleveur, ...feelP('neutre', t), view: 'side', walk: t * .8, boilKey: 'eleveur' });
    awa(800, 1200, 23, { ...feelP('emerveillee', t), view: 'q', boilKey: 'awa' });
    jumo(1020, 880 + Math.sin(t * 2.5) * 10, 11, { stage: 2, face: 'happy', prop: 'spin', beamOut: .5 });
    camEnd();
  };
  LOOPS.style_senegal.len = 4;

  LOOPS.style_archipel = t => {
    cam(1200, 690, 1.0);
    drawPlate('archipel', 0, 0);
    for (const I of ISLES) letter(I.id, I.x, I.y + I.r * .9, 34, PAL.night, { weight: 600, stroke: PAL.cream });
    // the small cargo plane over the islands
    const px = 1180 + Math.sin(t) * 30, py = 660;
    boilSeed('plane');
    paint([[px - 90, py], [px + 80, py - 8], [px + 110, py + 6], [px + 80, py + 22], [px - 90, py + 18]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1, curv: .3 });
    paint([[px - 10, py + 4], [px + 30, py + 4], [px - 30, py + 70], [px - 60, py + 70]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 });
    paint([[px - 10, py + 4], [px + 30, py + 4], [px - 30, py - 62], [px - 60, py - 62]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 });
    jumo(px + 140, py - 60, 7, { stage: 2, face: 'happy', prop: 'spin', badge: true });
    camEnd();
  };
  LOOPS.style_archipel.len = 4;
})();
