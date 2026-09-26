// scène 2.6 — La boucle de Jumo (V2 § 4, acte II).
// Lines: L0 « Le plan d'Awa : | un prototype de jumeau stratégique. »  L1 « Il observe, »  L2 « il intègre les données, »
//        L3 « il met à jour le territoire simulé, »  L4 « il recalcule les futurs possibles | en explorant le modèle
//        avec OpenMOLE, »  L5 « et il montre l'écart entre ce qui était prévu | et ce qui s'est passé. »
//        L6 « Pour décider mieux, | et ensemble. »
// One shot in the territory's day sky (2.5 ends on this exact framing). L0: Jumo traces a big ochre loop, Awa below
// holds up her plan (tablet). Then a « tour de manège »: one station per clause, labelled on screen —
//   1 Observer (L1): sensors, a field notebook and a land-use map feed the cyan antenna.
//   2 Intégrer (L2): he turns two knobs; the model curve snaps onto the observations.
//   3 Actualiser (L3): the little MAELIA on the hill: its glass dome lifts at last (dome(…, { open })), data go in.
//   4 Recalculer les futurs (L4): a lantern with « OpenMOLE » written on it lights up hundreds of paths at once.
//   5 Comparer et décider (L5): the « prévu » tracing slides over the « réel » curve, the gap shows;
//     L6: Awa gathers the four actors around it. Exit: the little cargo plane flies in; the camera lifts to it (→ 2.7).
(() => {
  const K = window.A2K;
  const C = [960, 430], RX = 720, RY = 260, DEG = Math.PI / 180;
  const at = a => [C[0] + Math.cos(a * DEG) * RX, C[1] + Math.sin(a * DEG) * RY];
  const ST = [
    { a: 330, name: 'Observer' }, { a: 390, name: 'Intégrer' }, { a: 450, name: 'Actualiser' },
    { a: 510, name: 'Recalculer les futurs' }, { a: 570, name: 'Comparer et décider' },
  ];
  const DOME = [1250, 955, .3], LANT = [337, 700], PATHS = { x: 470, y: 250 }, BOARD = [590, 340];
  const AWA_P = [480, 990];

  // ---------- hundreds of paths (a sprite cut out by its own strokes) ----------
  const PATH_SEGS = (() => {
    const out = [];
    const grow = (x, y, a, len, d) => { if (d > 6) return; for (let k = 0; k < 2 + (d === 0 ? 1 : 0); k++) { const a2 = a + (k - (d === 0 ? 1 : .5)) * (.62 - d * .05) + (hash(out.length * 3.7 + d) - .5) * .3, l = len * (.8 + hash(out.length + 7) * .35); const e = [x + Math.cos(a2) * l, y + Math.sin(a2) * l]; out.push([[x, y], [(x + e[0]) / 2 + Math.cos(a2 + 1.5) * l * .08, (y + e[1]) / 2 + Math.sin(a2 + 1.5) * l * .08], e, d]); grow(e[0], e[1], a2, l * .8, d + 1); } };
    grow(10, 220, 0, 230, 0);
    return out;
  })();
  K.PATH_SEGS = PATH_SEGS;
  definePlate('a2s6_paths', { w: 1000, h: 440, maskBg: PAL.data, mask(c) { c.lineCap = 'round'; for (const [p0, p1, p2, d] of window.A2K.PATH_SEGS) { c.lineWidth = 9 - d; c.beginPath(); c.moveTo(p0[0], p0[1]); c.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]); c.stroke(); } }, paint(w, h) {
    for (const [p0, p1, p2, d] of window.A2K.PATH_SEGS) inkLine([p0, p1, p2], 2.6 - d * .25, d > 4 ? '#E9FAFC' : d > 2 ? '#9BE6F0' : PAL.data, 'ink', .5);
  } });

  // ---------- the little cargo plane (side view, facing right), a sprite with an open cockpit window ----------
  const PLANE_BODY = [[40, 250], [90, 190], [230, 170], [640, 165], [760, 175], [840, 215], [860, 250], [830, 290], [700, 310], [220, 310], [110, 300]];
  K.PLANE_WIN = [735, 212, 44, 30];   // cockpit window ellipse (plate coords): Awa shows through it
  definePlate('a2s6_plane', { w: 900, h: 420, res: 1.3, mask(c) {
    const f = P => { c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.lineWidth = 5; c.stroke(); };
    f([[40, 250], [90, 190], [230, 170], [640, 165], [760, 175], [840, 215], [860, 250], [830, 290], [700, 310], [220, 310], [110, 300]]);
    f([[60, 200], [20, 70], [80, 70], [170, 190]]);                                    // tail fin
    f([[330, 175], [600, 170], [640, 190], [300, 200]]);                              // high wing root
    f([[360, 150], [610, 145], [620, 175], [340, 180]]);                              // wing
    for (const [x, y] of [[420, 330], [640, 330]]) { c.beginPath(); c.arc(x, y, 26, 0, TAU); c.fill(); }   // wheels
    c.fillRect(410, 290, 20, 40); c.fillRect(630, 290, 20, 40);
    c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.ellipse(735, 212, 44, 30, 0, 0, TAU); c.fill(); c.globalCompositeOperation = 'source-over';
  }, paint(w, h) {
    wcw([[60, 200], [20, 70], [80, 70], [170, 190]], '#C8553D', 255, '#A8452F', 90);
    pen([[60, 200], [20, 70], [80, 70], [170, 190]], .9);
    wcw([[40, 250], [90, 190], [230, 170], [640, 165], [760, 175], [840, 215], [860, 250], [830, 290], [700, 310], [220, 310], [110, 300]], '#F1E6D2', 255, '#DCCDB4', 100);
    paint([[60, 262], [840, 262], [830, 290], [700, 310], [220, 310], [110, 300]], { wash: '#DCC8A8', washOp: 200, ink: null });
    paint([[90, 238], [850, 238], [852, 252], [80, 252]], { wash: PAL.ochre, washOp: 255, ink: null });           // ochre stripe
    for (let i = 0; i < 6; i++) paint(ellPts(260 + i * 70, 205, 15, 15, 12), { wash: '#9FD3D6', washOp: 255, ink: PAL.ink, sw: .6 });
    paint(rrPts(520, 190, 70, 100, 10), { ink: PAL.ink, sw: .8 });                                                  // cargo door
    paint([[40, 250], [90, 190], [230, 170], [640, 165], [760, 175], [840, 215], [860, 250], [830, 290], [700, 310], [220, 310], [110, 300]], { ink: PAL.ink, sw: 1.1 });
    paint(ellPts(735, 212, 48, 34, 20), { ink: PAL.ink, sw: 1 });
    wcw([[360, 150], [610, 145], [620, 175], [340, 180]], '#3E7C4A', 255, '#2F6139', 90);                            // wing
    pen([[360, 150], [610, 145], [620, 175], [340, 180]], .9);
    for (const x of [420, 560]) { paint(rrPts(x - 22, 128, 60, 34, 14), { wash: '#6E6A72', washOp: 255, ink: PAL.ink, sw: .8 }); }   // engines (props drawn live)
    for (const [x, y] of [[420, 330], [640, 330]]) { paint(ellPts(x, y, 24, 24, 16), { wash: '#3A3440', washOp: 255, ink: PAL.ink, sw: .8 }); paint(ellPts(x, y, 9, 9, 10), { wash: '#9C98A6', washOp: 255, ink: null }); }
    pen([[420, 290], [420, 310]], 1.2); pen([[640, 290], [640, 310]], 1.2);
  } });
  // plane(x, y, s, t, o): (x, y) = centre of the fuselage; o.awa (draw Awa in the cockpit), o.jumo (Jumo on the roof), o.flip
  K.plane = (x, y, s, t, o = {}) => {
    const ox = x - 450 * s, oy = y - 240 * s, P = (px, py) => [ox + px * s, oy + py * s];
    if (o.awa !== false) {   // Awa behind the cockpit window
      const [wx, wy] = P(735, 212);
      boilSeed('cockpit'); paint(ellPts(wx, wy, 46 * s, 32 * s, 16), { wash: '#BFE3EA', washOp: 255, ink: null });
      awa(wx - 6 * s, wy + 102 * s, 11 * s, { ...feelP(o.mood || 'joie', t), view: 'q', cap: 'terrain', boilKey: 'awaplane', aR: o.wave ? 2.6 + .3 * Math.sin(t * 12) : .3, eR: o.wave ? .6 : -.2, noShadow: true });
    }
    drawPlate('a2s6_plane', ox, oy, { s });
    // spinning propellers (live)
    boilSeed('props');
    for (const px of [460, 600]) { const [cx, cy] = P(px, 145); const b = Math.cos(t * 40) * 40 * s; paint(ellPts(cx + 6 * s, cy, 8 * s, 44 * s, 14), { wash: '#DDE8EE', washOp: 110, ink: null }); inkLine([[cx + 6 * s, cy - b], [cx + 6 * s, cy + b]], 2 * s + .6, '#4A5260', 'ink', 0); }
    if (o.jumo) { const [jx, jy] = P(610, 120); jumo(jx, jy - Math.abs(Math.sin(t * 3)) * 6 * s, 9 * s, { stage: 2, face: o.jumoFace || 'happy', prop: 'fold', rot: .05 * Math.sin(t * 2), beamIn: o.beam || 0, beamOut: o.beam || 0, boilKey: 'jumoplane' }); }
  };

  // ---------- station props ----------
  function stationSign(i, k, active) {
    const s = ST[i], [x, y] = at(s.a), p = backOut(k); if (p < .03) return;
    boilSeed('stn' + i);
    if (active > .02) glow(x, y, 120, PAL.ochre, .5 * active);
    paint(ellPts(x, y, 30 * p, 30 * p, 18), { wash: mixCol('#FFF1C9', PAL.ochre, active), washOp: 255, ink: PAL.ink, sw: 1 });
    letter(String(i + 1), x, y + 1, 30 * p, PAL.night, { weight: 700 });
    const below = i === 1, ly = y + (below ? 92 : -100);
    const w = s.name.length * 17 + 44;
    push(); translate(x, ly); scale(p); paint(rrPts(-w / 2, -24, w, 48, 10, 1), { wash: PAL.cream, washOp: 240, ink: mixCol(PAL.ink, PAL.ochre, active), sw: .8 + active * .8 }); pop();
    letter(s.name, x, ly + 1, 29 * p, active > .5 ? '#8A5A1E' : PAL.night, { weight: 700 });
  }
  function knob(x, y, r, a, k) {
    const p = backOut(k); if (p < .03) return;
    boilSeed('knob' + x);
    paint(ellPts(x, y, r * p, r * p, 18), { wash: '#46638C', washOp: 255, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 10; i++) { const b = i / 10 * TAU; inkLine([[x + Math.cos(b) * r * .82 * p, y + Math.sin(b) * r * .82 * p], [x + Math.cos(b) * r * p, y + Math.sin(b) * r * p]], .7, '#9DB6D0', 'inkfine', 0); }
    inkLine([[x, y], [x + Math.cos(a) * r * .7 * p, y + Math.sin(a) * r * .7 * p]], 2.4, PAL.ochre, 'ink', 0);
  }
  function curves(x, y, w, h, k, fit, key) {   // a little screen: observations (dots) and the model curve that snaps onto them
    const p = backOut(k); if (p < .03) return;
    boilSeed('curves' + key);
    paint(rrPts(x - w / 2 * p, y - h / 2 * p, w * p, h * p, 12), { wash: PAL.night, washOp: 245, ink: PAL.ink, sw: .9 });
    const obs = i => y + h * (.18 - .28 * Math.sin(i * .7 + .4)) * p;
    for (let i = 0; i < 8; i++) paint(ellPts(x + (-w / 2 + 22 + i * (w - 44) / 7) * p, obs(i), 4.5, 4.5, 8), { wash: PAL.data, washOp: 255, ink: null });
    const M = []; for (let i = 0; i <= 14; i++) { const u = i / 14, xx = x + (-w / 2 + 22 + u * (w - 44)) * p, off = (1 - fit) * h * .3 * Math.sin(u * 5 + 1); M.push([xx, lerp(obs(u * 7), obs(u * 7), 1) + off]); }
    inkLine(M, 1.6, PAL.ochre, 'ink', .5);
  }
  function notebook(x, y, k) { const p = backOut(k); if (p < .03) return; boilSeed('notebook'); push(); translate(x, y); rotate(-.15); scale(p); paint(rrPts(-40, -30, 80, 60, 6), { wash: '#F4EAD8', washOp: 255, ink: PAL.ink, sw: .7 }); for (let i = 0; i < 4; i++) inkLine([[-28, -16 + i * 11], [26, -16 + i * 11]], .5, PAL.grey, 'inkfine', 0); paint(rectPts(-42, -30, 8, 60), { wash: PAL.red, washOp: 255, ink: null }); pop(); }
  function landMap(x, y, k) { const p = backOut(k); if (p < .03) return; boilSeed('landmap'); push(); translate(x, y); rotate(.12); scale(p); paint(rrPts(-52, -36, 104, 72, 6), { wash: '#F4EAD8', washOp: 255, ink: PAL.ink, sw: .7 }); const cs = ['#9DC07B', '#E3C98A', '#86B06A', '#D9B872', '#B4CF84', '#E8D39A']; for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) paint(rectPts(-44 + i * 30, -28 + j * 30, 26, 26), { wash: cs[i + j * 3], washOp: 255, ink: null }); pop(); }
  function lantern(x, y, lit, k) {
    const p = backOut(k); if (p < .03) return;
    boilSeed('lantern');
    if (lit > .02) { glow(x, y + 20, 260 * lit, '#FFE9A8', .7 * lit); glow(x, y + 20, 90, PAL.cream, .9 * lit); }
    inkLine([[x, y - 70 * p], [x, y - 40 * p]], 1.4, PAL.ink, 'ink', 0);
    paint([[x - 30 * p, y - 40 * p], [x + 30 * p, y - 40 * p], [x + 22 * p, y - 28 * p], [x - 22 * p, y - 28 * p]], { wash: '#5A4A3A', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(x - 26 * p, y - 28 * p, 52 * p, 70 * p, 10 * p), { wash: mixCol('#C9D8DE', '#FFF1C9', lit), washOp: 235, ink: PAL.ink, sw: .9 });
    paint(ellPts(x, y + 8 * p, 9 * p, 14 * p * (.8 + .2 * Math.sin(T * 14)), 10), { wash: lit > .1 ? PAL.sun : '#9C98A6', washOp: 255, ink: null });
    paint([[x - 30 * p, y + 42 * p], [x + 30 * p, y + 42 * p], [x + 22 * p, y + 54 * p], [x - 22 * p, y + 54 * p]], { wash: '#5A4A3A', washOp: 255, ink: PAL.ink, sw: .8 });
    // the tool's name, written on a tag hanging from the lantern (a name, not a logo)
    paint(rrPts(x - 72 * p, y + 64 * p, 144 * p, 38 * p, 8), { wash: PAL.cream, washOp: 245, ink: PAL.ink, sw: .7 });
    letter('OpenMOLE', x, y + 84 * p, 25 * p, PAL.night, { weight: 700 });
  }
  function board(x, y, k, slide, gap) {   // « réel » (cyan curve) and the « prévu » tracing that slides over it
    const p = backOut(k); if (p < .03) return;
    boilSeed('board');
    const w = 380, h = 220;
    push(); translate(x, y); scale(p);
    paint(rrPts(-w / 2, -h / 2, w, h, 14), { wash: PAL.cream, washOp: 250, ink: PAL.ink, sw: 1 });
    pop();
    const real = u => [x + (-w / 2 + 30 + u * (w - 60)) * p, y + (40 - 70 * u + 30 * Math.sin(u * 7)) * p];
    const plan = u => [x + (-w / 2 + 30 + u * (w - 60)) * p + (1 - slide) * 420, y + (40 - 110 * u) * p];
    const R = [], Q = []; for (let i = 0; i <= 16; i++) { R.push(real(i / 16)); Q.push(plan(i / 16)); }
    inkLine(R, 2.2, PAL.data, 'ink', .5);
    letter('réel', R[16][0] + 34 * p, R[16][1] + 6, 24 * p, '#1E7F8E', { weight: 700 });
    if (slide > .02) {
      // the tracing paper
      const px0 = x - w / 2 * p + (1 - slide) * 420;
      boilSeed('tracing'); paint(rrPts(px0 + 10, y - h / 2 * p + 12, (w - 20) * p, (h - 24) * p, 10), { wash: '#FFF6E2', washOp: 110 * slide, ink: mixCol(PAL.ochre, PAL.cream, .4), sw: .7 });
      for (let i = 0; i < 16; i += 2) inkLine([Q[i], Q[i + 1]], 2, PAL.ochre, 'ink', 0);
      letter('prévu', Q[16][0] - 10, Q[16][1] - 26 * p, 24 * p, '#8A5A1E', { weight: 700, alpha: slide });
      // the gap between them lights up
      if (gap > .02) { for (const u of [.45, .7, .92]) { const a = real(u), b = plan(u); boilSeed('gap' + u); inkLine([a, [a[0] + 4, (a[1] + b[1]) / 2], b], 2.4 * gap, '#C8553D', 'ink', .3); } }
    }
  }

  function loop(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const arr = [L(1), L(2), L(3), L(4), L(5)];                 // Jumo reaches station i on its clause
    const lit = L(4) + 1.62, gap = L(5) + 1.2, planeT = S.dur - 1.9;
    // ---------- Jumo's angle on the loop ----------
    const keys = [[0, 270], [.4, 270], [3.5, 630], [arr[0] - .05, 690]];
    ST.forEach((s, i) => { if (i) keys.push([arr[i] - .1, s.a + 360]); keys.push([arr[i] + (i === 3 ? 4.2 : 1.05), s.a + 360]); });
    let ang = kf(st, keys);
    const lead = st > E(5) + .3 ? ease(seg(st, E(5) + .3, L(6) + .6)) : 0;          // then he drops down to the group
    let [jx, jy] = at(ang);
    jy += Math.sin(st * 2.6) * 6;
    const gp = [AWA_P[0] + 160, 760]; jx = lerp(jx, gp[0], lead); jy = lerp(jy, gp[1], lead);
    const up = ease(seg(st, planeT + .5, S.dur));
    // ---------- camera: wide for the loop, then from station to station, wide again for the group ----------
    const camK = [[0, [960, 540, 1]], [3.4, [960, 540, 1]], [arr[0] - .2, [1480, 520, 1.3]], [arr[1] - .2, [1480, 640, 1.3]], [arr[2] - .2, [960, 700, 1.3]], [arr[3] - .2, [760, 520, 1.1]], [lit + 2.4, [760, 500, 1.0]], [arr[4] - .2, [560, 560, 1.2]], [L(6) - .3, [620, 640, 1.05]], [planeT, [700, 600, 1.0]], [S.dur, [900, 500, 1.0]]];
    const [cx, cy, z] = kf(st, camK);
    camBegin(cx, cy, z);
    drawPlate('hill', K.HILL26[0], K.HILL26[1]);
    // ---------- the loop's ochre trail ----------
    boilSeed('looptrail');
    const trailTo = Math.min(ang, 630), A0 = 270, P = [];
    for (let a = A0; a <= trailTo; a += 8) P.push(at(a));
    P.push(at(trailTo));
    if (P.length > 2) { inkLine(P, 3.4, PAL.ochre, 'ink', .5); if (trailTo < 630) glow(...at(trailTo), 60, PAL.ochre, .6); }
    for (let a = 290; a < trailTo - 20 && a < 990; a += 60) { const [x, y] = at(a), [x2, y2] = at(a + 6); boilSeed('arrow' + a); const d = Math.atan2(y2 - y, x2 - x); inkLine([[x - Math.cos(d - .5) * 14, y - Math.sin(d - .5) * 14], [x, y], [x - Math.cos(d + .5) * 14, y - Math.sin(d + .5) * 14]], 2, PAL.ochre, 'ink', 0); }
    // ---------- station signs ----------
    ST.forEach((s, i) => stationSign(i, seg(st, arr[i] - .35, arr[i]), bump(st, arr[i] - .3, (arr[i + 1] || S.dur) - .3, .25)));
    // 1 · Observer: sensors, a notebook, a land-use map on the hill; the cyan flow up to the antenna
    const o1 = seg(st, arr[0] - .6, arr[0] - .2), flow1 = bump(st, arr[0] - .2, arr[1] - .4, .2);
    const SRC = [[1420, 900], [1540, 860], [1660, 905], [1780, 850], [1860, 900]];
    SRC.slice(0, 3).forEach(([x, y], i) => { const k = backOut(seg(st, arr[0] - .8 + i * .1, arr[0] - .4 + i * .1)); if (k > .03) sensor(x, y, 1.4 * k, st, { key: 'o' + i, on: .4 + .6 * flow1 }); });
    notebook(1780, 860, o1); landMap(1885, 910, o1);
    if (flow1 > .02) { const tip = [jx - 1.9 * 11, jy - 6.35 * 11]; const pts = []; SRC.forEach(([x, y], i) => { for (let n = 0; n < 3; n++) { const f = frac(st * 1.1 + n / 3 + i * .17); pts.push(arcPt([x, y - 30], tip, 80, ease(f))); } }); for (const q of pts) glow(q[0], q[1], 30, PAL.data, .5 * flow1); boilSeed('flow1'); for (const q of pts) paint(ellPts(q[0], q[1], 6, 6, 8), { wash: PAL.data, washOp: 255 * flow1, ink: null }); }
    // 2 · Intégrer: two knobs and the model curve snapping onto the observations
    const i2 = seg(st, arr[1] - .4, arr[1]), fit = ease(seg(st, arr[1] + .2, arr[1] + 1.1));
    const i2a = 1 - seg(st, arr[3], arr[3] + .5);
    if (i2a > .02) { knob(1720, 640, 30, -1.6 + fit * 2.4 + Math.sin(st * 8) * .1 * (1 - fit), i2 * i2a); knob(1800, 640, 30, -.4 - fit * 1.8, i2 * i2a); curves(1760, 745, 230, 110, i2 * i2a, fit, 'i'); }
    // 3 · Actualiser: MAELIA on the hill, the dome opens at last and the data go in
    const openK = ease(seg(st, arr[2] + .15, arr[2] + .9)), feed = seg(st, arr[2] + .7, arr[2] + 1.8);
    const flashP = bump(st, arr[2] + 1.4, arr[2] + 2.4, .3);
    const dk = backOut(seg(st, arr[2] - .7, arr[2] - .2));
    if (dk > .03) dome(DOME[0], DOME[1], DOME[2] * dk, st, { open: openK, agents: (x, y, s) => { if (flashP > .02) glow(x, y - 10, 220 * s * 2, PAL.data, .6 * flashP); } });
    if (feed > 0 && feed < 1) for (let n = 0; n < 4; n++) { const f = clamp(feed * 1.6 - n * .2); if (f <= 0 || f >= 1) continue; const q = arcPt([jx, jy + 30], [DOME[0] - 60 + n * 40, DOME[1] - 20], 60, ease(f)); glow(q[0], q[1], 30, PAL.data, .6); boilSeed('feed' + n); paint(ellPts(q[0], q[1], 9, 9, 10), { wash: PAL.data, washOp: 255, ink: PAL.ink, sw: .5 }); }
    // 4 · Recalculer les futurs: the lantern lights up hundreds of paths inside the loop
    const lk = seg(st, arr[3] - .4, arr[3]), litK = ease(seg(st, lit - .1, lit + .5));
    const dimPaths = 1 - .72 * seg(st, arr[4] - .5, arr[4] + .5);
    if (litK > .01) { drawPlate('a2s6_paths', PATHS.x, PATHS.y, { alpha: litK * dimPaths }); for (let n = 0; n < 6; n++) glow(PATHS.x + 150 + n * 150, PATHS.y + 220 + 80 * Math.sin(n * 1.7), 160, PAL.data, .22 * litK * dimPaths); }
    lantern(LANT[0], LANT[1], litK, lk);
    // 5 · Comparer et décider: the tracing slides over the real curve, the gap lights; the group gathers
    const b5 = seg(st, arr[4] - .4, arr[4]), slide = ease(seg(st, arr[4] + .3, gap - .1)), gk = seg(st, gap, gap + .5);
    board(BOARD[0], BOARD[1], b5, slide, gk);
    // ---------- people: Awa below the loop (her plan on the tablet); the actors come to her on L6 ----------
    const gather = L(6) - .2;
    const A = actP(st, [[0, 'fiere', { lookX: .5, lookY: -.7 }], [arr[0], 'emerveillee', { lookX: .7, lookY: -.6 }], [arr[2] + .2, 'joie', { lookX: .6, lookY: -.3 }], [lit, 'emerveillee', { lookX: .4, lookY: -.7 }], [arr[4], 'concentree', { lookX: .3, lookY: -.8 }], [gap + .2, 'idee'], [gather + .3, 'joie'], [planeT + .3, 'surprise', { lookX: .8, lookY: -.8 }]]);
    const tabletUp = st < 3.8 ? 1 : 0;
    const win = stroll(st, .1, 1.7, -120, AWA_P[0], 15 * 1.6);
    awa(win.x, AWA_P[1], 15, { ...A, view: win.moving ? 'side' : 'q', walk: win.walk, cap: 'terrain', hold: tabletUp ? 'tablet' : null, tabletScreen: '#F8D98A', aR: tabletUp ? undefined : A.aR });
    const FR = [[ACTEURS.agricultrice, -520, 120], [ACTEURS.eleveur, 1160, 250], [ACTEURS.elu, -620, -130], [ACTEURS.conseillere, 1260, 380]];
    FR.forEach(([pre, x0, x1], i) => {
      const w = stroll(st, gather + i * .18, gather + 1.4 + i * .18, x0, AWA_P[0] + x1, 15 * 1.6);
      if (st < gather + i * .18) return;
      const X = AWA_P[0] + x1, done = !w.moving;
      const F = actP(st, [[0, 'neutre', { lookX: .5, lookY: -.3 }], [gather + 1.5 + i * .18, 'joie', { lookY: -.6, lookX: x1 > 0 ? -.3 : .5 }]]);
      person(w.x, AWA_P[1] + (i % 2) * 8, 14, { ...F, preset: pre, view: done ? 'q' : 'side', flip: done ? x1 > 0 : w.flip, walk: w.walk, boilKey: 'act' + i, seed: i + 4 });
    });
    const warm = seg(st, L(6) + 1.66, L(6) + 2.1);
    if (warm > 0) glow(AWA_P[0] + 110, AWA_P[1] - 120, 380, PAL.ochre, .35 * warm);
    // ---------- Jumo ----------
    const face = st < 3.5 ? 'happy' : st < arr[1] ? 'scan' : st < arr[2] ? 'loading' : st < arr[3] ? 'check' : st < arr[4] ? 'tree' : st < L(6) ? 'wide' : 'love';
    const turn = st > arr[1] && st < arr[1] + 1.1 ? Math.sin(st * 10) * .15 : 0;
    jumo(jx, jy, 11, { stage: 2, face, prop: 'spin', spin: st * 9, rot: turn + .1 * Math.sin(st * 1.4), beamIn: flow1 > .02 ? 1 : .3, beamOut: .3 + .5 * seg(st, gap, gap + .5), boilKey: 'jumo' });
    // ---------- the cargo plane flies in; the camera lifts to it ----------
    if (st > planeT) { const pk = ease(seg(st, planeT, S.dur)); K.plane(lerp(-560, K.PLANE27.x - 60, seg(st, planeT, S.dur)), lerp(420, K.PLANE27.y - 40, pk), K.PLANE27.s, st, { awa: false }); }
    camEnd();
    K.cloudWipe(seg(st, S.dur - .55, S.dur + .55));   // the plane flies into a cloud (→ 2.7)
    K.fadeLetters(1 - K.wipeAmt(seg(st, S.dur - .55, S.dur + .55)));
  }
  // into a cloud and out: soft puffs thicken to a white-out; the cut happens inside it (k 0..1, white at .5)
  K.cloudWipe = k => {
    if (k <= 0 || k >= 1) return;
    const a = 1 - Math.abs(k - .5) * 2, c = color('#FFFFFF'); c.setAlpha(255 * clamp(a * 1.5));
    drawPlate('a2s1_clouds', lerp(300, -1500, k), -520, { s: 2.6, tint: c });
    flash(ease(clamp(a * 1.7 - .7)), '#F4F2EC');
  };
  // 2.7 opens with the plane here (screen), at this size
  K.PLANE27 = { x: 1180, y: 380, s: .62 };

  scene('2.6', S => [[0, loop]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), arr = [L(1), L(2), L(3), L(4), L(5)], lit = L(4) + 1.62, gap = L(5) + 1.2;
      const out = [[.2, 'step', .04], [.55, 'step', .04], [.9, 'step', .04], [1.25, 'step', .04], [.4, 'whoosh', .08], [1.8, 'whoosh', .07], [3.2, 'whoosh', .07], [lit, 'chime', .1], [lit + .05, 'sparkle', .08],
        [arr[1] + .2, 'squeak', .05], [arr[1] + .6, 'squeak', .05], [arr[1] + 1.1, 'clic', .08], [arr[2] + .15, 'slideUp', .1], [arr[2] + .9, 'ding', .07], [arr[2] + 1.4, 'sparkle', .05],
        [arr[4] + .3, 'rustle', .07], [gap, 'bip2', .07], [L(6) + 1.7, 'chime', .07], [S.dur - 1.9, 'rotor', .08], [S.dur - .5, 'whoosh', .1]];
      arr.forEach((a, i) => out.push([a - .1, 'pop', .08, -.3 + i * .15]));
      for (let k = 0; k < 6; k++) out.push([L(6) - .1 + k * .3, 'step', .04]);
      return out;
    });
})();
