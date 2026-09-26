// scène 2.3 — Jumo prend des antennes (V2 § 4, acte II).
// Lines: L0 « Un modèle, | c'est une copie. »
//        L1 « Une ombre numérique, | c'est une copie qui reçoit les données du terrain. »
//        L2 « Un jumeau numérique, | c'est une copie qui reçoit… | et qui répond, | pour éclairer les décisions. »
// One shot on the night backdrop, a lit mound of fields in front (a little stage), jingles on each palier:
//   L0  MODÈLE: grey screen, Jumo copies the landscape (grey lines on his screen); the sensors' data drift up and
//       fizzle out before reaching him: he receives nothing.
//   L1  OMBRE: jingle, the first antenna grows (cyan), the cyan flow rises from the sensors, his screen shows the
//       field live.
//   L2  JUMEAU: jingle, the second antenna (ochre); on « et qui répond » ochre cards « et si… ? » fly down to Awa and
//       the two farmers; on « éclairer les décisions » the cards glow and light their faces.
//   Text (a paper banner, built step by step): « Modèle → Ombre (un sens) → Jumeau (deux sens) »
//   Exit: the camera tilts up (the mound drops away), Jumo rises to the right-hand side of the sky: 2.4 opens with
//   the same night on its right half and Tacti's panel slamming in on the left.
(() => {
  const K = window.A2K;
  const J = K.J23;                                          // Jumo's start (from 2.2's last frame)
  K.J24 = { x: 1440, y: 540, u: 18 }; K.NIGHT24 = [-240, 0];
  const SENS = [[690, 850], [850, 812], [1070, 818], [1230, 852], [960, 890]];
  const AWA_P = [420, 885], F1 = [1440, 880], F2 = [1610, 892];
  const tipOf = (x, y, u, sd) => [x + sd * 1.9 * u, y - 6.35 * u];

  // the lit mound of fields (a sprite): a round tabletop of land floating in the night
  definePlate('a2s3_stage', { w: 2000, h: 720, mask(c) { c.beginPath(); c.ellipse(1000, 260, 975, 200, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(25, 260); c.bezierCurveTo(120, 560, 600, 700, 1000, 705); c.bezierCurveTo(1400, 700, 1880, 560, 1975, 260); c.fill(); }, paint(w, h) {
    const skirt = [[25, 260], [200, 470], [600, 650], [1000, 700], [1400, 650], [1800, 470], [1975, 260]];
    area(skirt.concat([[1975, 200], [25, 200]]), '#5E4232', '#4A3326', 130);
    for (let i = 0; i < 9; i++) pen([[120 + i * 220, 300 + 40 * Math.sin(i)], [140 + i * 220, 420 + 60 * Math.sin(i * 1.3)]], .6, '#3E2A20', .4);
    area(ellPts(1000, 255, 970, 196, 44), '#9DC07B', '#86B06A', 120);
    const cols = ['#B4CF84', '#E3C98A', '#86B06A', '#D9B872', '#A7C27A', '#C8D48A'];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 7; i++) {
      const cx = 190 + i * 270 + j * 40, cy = 150 + j * 105; if (Math.pow((cx - 1000) / 900, 2) + Math.pow((cy - 255) / 180, 2) > .82) continue;
      area([[cx - 118, cy - 42], [cx + 118, cy - 44], [cx + 124, cy + 44], [cx - 124, cy + 46]], cols[(i * 2 + j) % 6], null, 110, .03);
      for (let r = 1; r < 4; r++) pen([[cx - 105, cy - 42 + r * 22], [cx + 108, cy - 44 + r * 22]], .35, '#5E7A45', .1);
    }
    const R = [[80, 300], [420, 250], [760, 300], [1100, 240], [1500, 290], [1920, 250]];
    paint(subdiv(ribbon(R, 22, 30), 30), { fill: '#56A6B3', fillOp: 220, bleed: .03, tex: .4, border: .4, ink: null });
    for (const [x, y] of [[330, 190], [1640, 200], [1320, 370]]) treeP(x, y, 70, '#5E8C4E');
    paint(ellPts(1000, 255, 970, 196, 44), { ink: PAL.ink, sw: .9 });
    pen(skirt, 1);
  } });

  // Jumo's screen contents
  const screenCopy = (k, col) => (u, sw) => {   // the landscape he copies: horizon, hills, parcels
    const L = [[[-2.3, .2], [-1, -.3], [.2, 0], [1.3, -.4], [2.3, 0]], [[-2.3, .75], [2.3, .7]], [[-1.2, .72], [-1.5, 1.05]], [[.1, .7], [.05, 1.05]], [[1.3, .7], [1.6, 1.05]]];
    L.forEach((P, i) => { const kk = clamp(k * 5 - i); if (kk <= 0) return; const pts = P.map(([x, y]) => [x * u, (y - .5) * u]); const n = Math.max(2, Math.round(pts.length * kk)); inkLine(pts.slice(0, n), sw * 2.2, col, 'ink', .3); });
  };
  const screenLive = (t) => (u, sw) => {        // the field, live: coloured, with the sensors blinking
    paint(rrPts(-2.5 * u, -1.95 * u, 5 * u, 2.9 * u, .9 * u), { wash: '#2E5578', washOp: 255, ink: null });
    paint([[-2.5 * u, -.2 * u], [-1 * u, -.75 * u], [.3 * u, -.45 * u], [1.4 * u, -.85 * u], [2.5 * u, -.4 * u], [2.5 * u, .95 * u], [-2.5 * u, .95 * u]], { wash: '#7FB35E', washOp: 255, ink: null });
    paint([[-2.5 * u, .25 * u], [2.5 * u, .15 * u], [2.5 * u, .45 * u], [-2.5 * u, .55 * u]], { wash: '#56A6B3', washOp: 255, ink: null });
    for (let i = 0; i < 4; i++) { const on = .5 + .5 * Math.sin(t * 6 + i * 1.7); paint(ellPts((-1.8 + i * 1.2) * u, (.72 - (i % 2) * .5) * u, .2 * u, .2 * u, 8), { wash: mixCol('#2E5578', PAL.data, on), washOp: 255, ink: null }); }
    paint(ellPts(2.05 * u, -1.5 * u, .16 * u, .16 * u, 8), { wash: Math.floor(t * 2) % 2 ? PAL.red : '#8A3A2A', washOp: 255, ink: null });   // "live" dot
  };
  // a card « et si… ? » (ochre, handwritten)
  function card(x, y, s, rot, a, key, lit = 0) {
    boilSeed('card' + key);
    if (lit > .02) glow(x, y, 120 * s, PAL.ochre, .7 * lit);
    push(); translate(x, y); rotate(rot); scale(s);
    paint(rrPts(-62, -38, 124, 76, 10), { wash: '#FFF3DC', washOp: 255 * a, ink: PAL.ochre, sw: 1.6 });
    pop();
    letter('et si… ?', x, y + 2 * s, 30 * s, '#8A5A1E', { font: FONT.hand, weight: 400, rot, alpha: a });
  }
  // the banner: « Modèle → Ombre (un sens) → Jumeau (deux sens) », each part pops on its palier
  function banner(st, k0, k1, k2, a = 1) {
    const parts = [['Modèle', 470, k0], ['→', 745, k1], ['Ombre (un sens)', 1040, k1], ['→', 1335, k2], ['Jumeau (deux sens)', 1615, k2]];
    for (const [txt, x, k0] of parts) {
      const k = k0 * a; if (k <= .01 || a < .25) continue;
      const w = txt.length * 23 + 50, ar = txt === '→';
      if (!ar) { boilSeed('ban' + txt); push(); translate(x, 118); scale(backOut(k)); rotate(-.012 * (x % 3 - 1)); paint(rrPts(-w / 2, -36, w, 72, 12, 1.2), { wash: PAL.cream, washOp: 240 * a, ink: PAL.ink, sw: .8 }); pop(); }
      const col = txt.startsWith('Jumeau') ? '#A8691E' : txt.startsWith('Ombre') ? '#1E7F8E' : ar ? PAL.cream : PAL.night;
      letter(txt, x, 120, ar ? 50 : 42, col, { pop: k, weight: 700, alpha: a });
    }
  }
  // a stream of dots along an arc: ph0 = phase offset, k = strength; glows first, then the dots (one brush flush)
  function stream(P0, P1, h, t, k, col, n, key, fizz = false) {
    if (k <= .02) return;
    const pts = [];
    for (let i = 0; i < n; i++) { const f = frac(t * .8 + i / n); const a = fizz ? k * (1 - seg(f, .35, .6)) : k * seg(f, 0, .1) * (1 - seg(f, .92, 1)); if (a > .02 && (!fizz || f < .6)) pts.push([arcPt(P0, P1, h, ease(f)), a]); }
    for (const [p, a] of pts) glow(p[0], p[1], 34, col, .5 * a);
    boilSeed('stream' + key);
    for (const [p, a] of pts) paint(ellPts(p[0], p[1], 7, 7, 8), { wash: fizz ? mixCol(PAL.data, PAL.grey, .6) : col, washOp: 255 * a, ink: null });
  }

  function antennas(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const s1 = L(1) - .1, s2 = L(2) - .1, recv = L(1) + 1.32, recv2 = L(2) + 1.66, answer = L(2) + 3.48, light = L(2) + 4.58, exit0 = S.dur - 1.3;
    const stage = st < s1 + .05 ? 0 : st < s2 + .05 ? 1 : 2;
    const antK = stage === 1 ? seg(st, s1, s1 + .45) : stage === 2 ? seg(st, s2, s2 + .45) : 1;
    const ex = ease(seg(st, exit0, S.dur - .05));
    // camera: a slow push on the stage; on the exit, the backdrop drifts down 135 px (the camera tilts up)
    const push0 = ease(seg(st, .3, 3.2)), pz = lerp(1, 1.28, push0) + .04 * ease(seg(st, 3.2, exit0));
    const pzE = lerp(pz, 1, ease(ex));
    camBegin(960, lerp(540, 575, push0 * (1 - ease(ex))), pzE);
    drawPlate('night', -240, -135 + 135 * ex);
    const drop = 760 * easeIn(ex) + 760 * (1 - easeOut(seg(st, 0, 1.2)));   // the mound rises in (after 2.2's night), falls away on the exit
    // light on the stage
    glow(960, 780 + drop, 900, '#FFE8B8', .22);
    drawPlate('a2s3_stage', 960, 830 + drop, { ax: .5, ay: 260 / 720 });
    SENS.forEach(([x, y], i) => sensor(x, y + drop, 1.5, st, { key: 's3' + i, on: .45 + .45 * Math.sin(st * 3 + i * 1.3) }));
    // Jumo: bobs, jumps with joy at each palier, rises to the right on the exit
    const hop = (tt) => jump(st, tt, tt + .45, 1.2);
    const h1 = hop(s1 + .05), h2 = hop(s2 + .05);
    let jx = J.x, jy = J.y + Math.sin(st * 2.1) * 8 + (h1.dy + h2.dy) * J.u, ju = J.u, jrot = .08 * Math.sin(st * 1.3);
    const spinJoy = ease(seg(st, s2 + .45, s2 + 1.3));
    jrot += TAU * spinJoy * (st < s2 + 1.4 ? 1 : 0);
    jx = lerp(jx, K.J24.x, ease(ex)); jy = lerp(jy, K.J24.y, ease(ex)); ju = lerp(ju, K.J24.u, ease(ex));
    const tip1 = tipOf(jx, jy, ju, -1), tip2 = tipOf(jx, jy, ju, 1);
    // data: fizzle before a palier 1, then the cyan flow up; ochre cards down after « et qui répond »
    const fizz = seg(st, L(0) + 1.9, L(0) + 2.3) * (1 - seg(st, s1 - .4, s1));
    const cyan = seg(st, recv - .3, recv + .2) * (1 - ex);
    SENS.forEach(([x, y], i) => {
      stream([x, y - 34 + drop], fizz > 0 ? [lerp(x, jx, .5), lerp(y, jy, .5)] : tip1, fizz > 0 ? 60 : 120 + i * 20, st + i * .23, fizz || cyan * (1 + .3 * seg(st, recv2, recv2 + .5)), PAL.data, 3, i, fizz > 0);
    });
    let face = 'neutral', grin = null, glowScr = .5;
    if (st < L(0) + 1.2) face = st > L(0) ? 'neutral' : 'happy';
    else if (st < s1 - .5) { grin = screenCopy(seg(st, L(0) + 1.2, L(0) + 2.2), '#C4CAD4'); }
    else if (st < s1 + .9) face = st < s1 ? 'question' : 'wide';
    else if (st < recv) face = 'happy';
    else if (st < s2 - .3) grin = screenLive(st);
    else if (st < s2 + 1.4) face = st < s2 + .5 ? 'excl' : 'happy';
    else if (st < answer - .2) grin = screenLive(st);
    else face = st < exit0 ? 'tree' : 'happy';
    if (st > L(0) + 2.4 && st < s1 - .5) { face = 'sad'; grin = null; }   // nothing comes in: a sad little look
    const jingle = k => { if (k > 0 && k < 1) { for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + k * 2, r = 80 + 160 * easeOut(k); glow(jx + Math.cos(a) * r, jy + Math.sin(a) * r * .8, 30, i % 2 ? PAL.cream : (stage === 2 ? PAL.ochre : PAL.data), .9 * (1 - k)); } } };
    jingle(seg(st, s1, s1 + .8)); jingle(seg(st, s2, s2 + .8));
    jumo(jx, jy, ju, { stage, antK, face, grin, prop: 'spin', spin: st * 9, rot: jrot, sq: h1.sq + h2.sq, beamIn: stage >= 1 ? .4 + .6 * cyan : 0, beamOut: stage === 2 ? bump(st, answer - .2, exit0, .3) : 0, boilKey: 'jumo' });
    // the people on the stage
    const cards = [[AWA_P, 0], [F1, 1], [F2, 2]].map(([P, i]) => ({ P, i, t0: answer + i * .28, t1: answer + i * .28 + .75 }));
    const litK = seg(st, light, light + .5);
    const who = [
      [AWA_P, null, 'awa', 'q', false],
      [F1, ACTEURS.agricultrice, 'f1', 'q', true],
      [F2, ACTEURS.eleveur, 'f2', 'q', true],
    ];
    who.forEach(([P, preset, key, view, flip], i) => {
      const c = cards[i], got = st > c.t1;
      const keys = [[0, 'neutre', { lookX: flip ? -.5 : .5, lookY: -.3 }], [s1 + .2, 'emerveillee', { lookX: flip ? -.5 : .5, lookY: -.6 }], [s2 + .3, 'joie', { lookY: -.5 }], [c.t1 - .05, 'surprise', { lookY: .3 }], [light + i * .1, i === 0 ? 'idee' : 'joie', { lookY: .1 }]];
      const A = actP(st, keys);
      const hold = got ? 1 : seg(st, c.t1 - .35, c.t1);
      Object.assign(A, { view, flip, aL: lerp(A.aL ?? .12, .6, hold), eL: lerp(A.eL ?? -.15, -1.5, hold), aR: i === 0 && st > light ? A.aR : lerp(A.aR ?? .12, .6, hold), eR: i === 0 && st > light ? A.eR : lerp(A.eR ?? -.15, -1.5, hold) });
      if (litK > 0) glow(P[0] + (flip ? -8 : 8), P[1] - 9.5 * 18 + drop, 90, PAL.ochre, .4 * litK);
      person(P[0], P[1] + drop, 18, { ...A, preset: preset || AWA, cap: preset ? null : 'terrain', boilKey: key, seed: i });
    });
    // the ochre cards: fly from the second antenna down into their hands
    cards.forEach(c => {
      if (st < c.t0) return;
      const k = seg(st, c.t0, c.t1), [px, py] = c.P, hand = [px + (c.i ? -10 : 12), py - 5.4 * 18 + drop];
      const p = arcPt(tip2, hand, -40, ease(k)), rot = (1 - ease(k)) * (c.i % 2 ? -.8 : .8) + .06 * Math.sin(st * 2 + c.i);
      if (k < 1) glow(p[0], p[1], 50, PAL.ochre, .6);
      card(p[0], p[1] + (k >= 1 ? Math.sin(st * 2.5 + c.i) * 3 : 0), lerp(.45, .75, ease(k)), rot, 1, c.i, litK);
    });
    camEnd();
    // the banner (screen space), built palier by palier
    banner(st, seg(st, L(0) + .1, L(0) + .5), seg(st, L(1) + .1, L(1) + .5), seg(st, L(2) + .1, L(2) + .5), 1 - ex);
    // entrance: Jumo's dizzy stars from 2.2 settle into the sky (a few faint sparkles fade)
    if (st < .6) for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + st * 5; glow(J.x + Math.cos(a) * 170 * (1 + i * .3), J.y - 100 - (i % 2 ? 160 : 100) + Math.sin(a) * 30, 22, '#FFE9A8', .6 * (1 - st / .6)); }
  }

  scene('2.3', S => [[0, antennas]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), s1 = L(1) - .1, s2 = L(2) - .1, answer = L(2) + 3.48, light = L(2) + 4.58;
      const out = [[L(0) + .1, 'chime', .06], [L(0) + 1.3, 'tick', .05], [L(0) + 1.6, 'tick', .05], [L(0) + 2.0, 'glitch', .05], [L(0) + 2.5, 'bipsad', .07],
        [s1, 'chime', .11], [s1 + .1, 'sparkle', .06], [s1 + .1, 'boing', .08], [L(1) + 1.3, 'bloop', .06], [L(1) + 1.8, 'bloop', .05],
        [s2, 'chime', .12], [s2 + .15, 'chime', .08], [s2 + .1, 'sparkle', .07], [s2 + .5, 'whoosh', .07], [s2 + .9, 'bip2', .08],
        [light, 'sparkle', .07], [light + .1, 'ding', .06], [S.dur - 1.2, 'rotor', .06]];
      for (let i = 0; i < 3; i++) out.push([answer + i * .28, 'whoosh', .05, -.4 + i * .5], [answer + i * .28 + .75, 'pop', .08, -.4 + i * .5]);
      return out;
    });
})();
