// scène 2.2 — La maquette qui n'écoute pas (V2 § 4, acte II).
// Lines: L0 « Voici MAELIA, | une plateforme qui simule le territoire, | ses fermes | et ses rivières, | agent par agent. »
//        L1 « Elle sait jouer des scénarios. »
//        L2 « Mais elle a été conçue pour la simulation planifiée : | les données du terrain, | collectées au fil de la
//              saison… | ne rentrent pas. »
// Shots:  A  0 → L1−.35   the ellipse left by 2.1 is MAELIA's tabletop: the iris opens and the camera pulls back to
//                         the glass dome on its hill; Awa admires it, Jumo (palier 0) hovers. Farms pulse (« ses
//                         fermes »), the river shimmers (« ses rivières »), the tiny agents light up one by one.
//         B  → L2+.1      Awa presses « Scénario A »: the tabletop plays a future in fast-forward (sun racing, fields
//                         cycling green); then « Scénario B »: fields dry out, the river thins.
//         C  → end        Jumo gathers real measurements (sensors on the hill) and throws them at the dome: they bounce
//                         off the glass (ping), harder and harder; the third comes straight back: « bip ! ». Dizzy stars;
//                         exit: the camera pushes onto Jumo, the night floods in behind him (→ 2.3 opens on the same Jumo).
(() => {
  const K = window.A2K;
  const DX = 1200, DY = 1000, DS = .85;                    // the dome on the hill (world)
  const MK = 1.05 * DS, M = (px, py) => [DX + (px - 450) * MK, DY - 4 * DS + (py - 220) * MK];   // maquette plate → world
  const BH = 560 * DS, BW = 470 * DS;
  const GLASS = [DX + BW * .9, DY - BH * .52];               // where the throws hit the bell
  const OX = -95, LECT = [800 + OX, 1085], BTN_A = [770 + OX, 958], BTN_B = [838 + OX, 950];
  const AWA_X0 = 668 + OX, AWA_X1 = 728 + OX, GROUND = 1100;
  // the tabletop's parcels and agents (maquette plate coordinates, see props.js)
  const PARC = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 8; i++) { const cx = 80 + i * 105, cy = 70 + j * 90; if (Math.pow((cx - 450) / 420, 2) + Math.pow((cy - 210) / 190, 2) <= .85) PARC.push([cx, cy, i, j]); }
  const FARMS = [[230, 120], [620, 300], [700, 110], [330, 320]];
  const MRIV = [[60, 240], [200, 200], [380, 240], [560, 180], [740, 215], [846, 185]];
  const AGENTS = Array.from({ length: 10 }, (_, k) => ({ p: PARC[(k * 7 + 3) % PARC.length], r: 20 + hash(k) * 14, w: .5 + hash(k + 3) * .6, ph: hash(k + 9) * TAU, col: ['#C8553D', '#3E5F8A', '#7B8B4A', '#D99A3D', '#7B5CA8'][k % 5] }));
  const SENS = [[1840, 1150], [1960, 1110], [2080, 1160], [1920, 1215]];

  function agentsOf(sc, st) {   // drawn by dome() between the tabletop and the glass
    return (x, y, s, t) => {
      const ag0 = sc.ag0, fa = sc.farms, rv = sc.river;
      // farms pulse (« ses fermes »)
      if (fa > 0) FARMS.forEach(([fx, fy], i) => { const k = bump(st, sc.farmT + i * .12, sc.farmT + i * .12 + .7, .2); if (k > .02) { const [wx, wy] = M(fx + 13, fy); glow(wx, wy, 60 * k, PAL.ochre, .7 * k); } });
      // river shimmer (« ses rivières »)
      if (rv > 0) { const k = bump(st, sc.rivT, sc.rivT + 1.1, .3); for (let i = 0; i < MRIV.length; i++) { const kk = k * clamp(1.5 - Math.abs((st - sc.rivT) * 5 - i)); if (kk > .02) { const [wx, wy] = M(...MRIV[i]); glow(wx, wy, 70 * kk, PAL.data, .6 * kk); } } }
      // scenario fast-forward overlays on the parcels
      if (sc.ff > .01) {
        PARC.forEach(([cx, cy, i, j], n) => {
          const ph = sc.ffT * 9 + i * .5 + j * .8, cyc = .5 + .5 * Math.sin(ph);
          const col = sc.which === 'A' ? mixCol('#7FB35E', '#E3C98A', cyc * .6) : mixCol(mixCol('#E3C98A', '#C9A36A', cyc), '#B8905A', clamp(sc.ffT * .9));
          const [wx, wy] = M(cx, cy); boilSeed('ff' + n);
          paint(rectPts(wx - 44 * MK, wy - 34 * MK, 90 * MK, 70 * MK), { wash: col, washOp: 170 * sc.ff, ink: null });
        });
        if (sc.which === 'B') { boilSeed('ffriv'); const P = MRIV.map(p => M(...p)); paint(ribbon(P, 30 * MK, 36 * MK), { wash: '#C9B27E', washOp: 230 * sc.ff * clamp(sc.ffT), ink: null }); paint(ribbon(P, lerp(26, 6, clamp(sc.ffT)) * MK, lerp(30, 8, clamp(sc.ffT)) * MK), { wash: '#56A6B3', washOp: 255 * sc.ff, ink: null }); }
        // the sun racing over the tabletop: days in fast-forward
        const a = frac(sc.ffT / .6), sp = [x + Math.cos(Math.PI + a * Math.PI) * 330 * s, y - 40 * s + Math.sin(Math.PI + a * Math.PI) * 200 * s];
        glow(sp[0], sp[1], 60 * s, '#FFE08A', .8 * sc.ff); boilSeed('ffsun'); paint(ellPts(sp[0], sp[1], 16 * s, 16 * s, 12), { wash: PAL.sun, washOp: 255 * sc.ff, ink: PAL.ink, sw: .5 });
      }
      // the agents: tiny farmers going about their fields
      AGENTS.forEach((A, k) => {
        const a = A.ph + st * A.w * (1 + 5 * sc.ff), [cx, cy] = A.p, px = cx + Math.cos(a) * A.r, py = cy + Math.sin(a) * A.r * .6, [wx, wy] = M(px, py);
        const lit = bump(st, ag0 + k * .09, ag0 + k * .09 + .6, .15);
        boilSeed('agent' + k);
        if (lit > .02) glow(wx, wy - 8, 34 * lit, PAL.cream, .9 * lit);
        const hop = Math.abs(Math.sin(a * 6)) * 2 + lit * 6;
        paint(ellPts(wx, wy - 5 - hop, 4.2, 6, 8), { wash: A.col, washOp: 255, ink: null });
        paint(ellPts(wx, wy - 13 - hop, 3.4, 3.4, 8), { wash: SKIN[['a', 'b', 'c', 'd'][k % 4]], washOp: 255, ink: null });
      });
      // two tiny tractors crawling along the tabletop's roads
      for (let k = 0; k < 2; k++) { const u = frac(st * (.05 + .25 * sc.ff) + k * .5), [wx, wy] = M(lerp(140, 760, u), k ? 150 + 30 * Math.sin(u * 6) : 280 - 20 * Math.sin(u * 5)); boilSeed('mtr' + k); paint(rectPts(wx - 7, wy - 5, 14, 8), { wash: PAL.soil, washOp: 255, ink: PAL.ink, sw: .3 }); }
    };
  }
  // a lectern with the two scenario buttons (pressed: k 0..1)
  function lectern(pa, pb, st, la) {
    boilSeed('lectern');
    paint(rectPts(LECT[0] - 8, 975, 16, LECT[1] - 975), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rrPts(LECT[0] - 48, LECT[1] - 6, 96, 14, 6), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .6 });
    paint([[725 + OX, 972], [880 + OX, 952], [884 + OX, 968], [728 + OX, 990]], { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: .8 });
    for (const [[bx, by], k, col, lab, ly] of [[BTN_A, pa, '#7FB35E', 'Scénario A', 1010], [BTN_B, pb, PAL.ochre, 'Scénario B', 1038]]) {
      if (k > .02) glow(bx, by, 50, col, .7 * k);
      paint(ellPts(bx, by + 3, 16, 7, 12), { wash: '#4E3B28', washOp: 255, ink: PAL.ink, sw: .5 });
      paint(ellPts(bx, by - 3 + 4 * k, 14, 6.5, 12), { wash: col, washOp: 255, ink: PAL.ink, sw: .6 });
    }
    // labels on small plaques hung under the desk
    for (const [x, y, lab, col, k] of [[750 + OX, 1012, 'Scénario A', '#4E7A3A', pa], [858 + OX, 1044, 'Scénario B', '#8A5A1E', pb]]) {
      paint(rrPts(x - 52, y - 14, 104, 28, 6), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 });
      letter(lab, x, y + 1, 19, col, { weight: 700, pop: .9 + .1 * k, alpha: la });
    }
  }
  function dataBall(x, y, r, a = 1, key) {
    boilSeed('ball' + key);
    glow(x, y, r * 2.8, PAL.data, .55 * a);
    paint(ellPts(x, y, r, r, 12), { wash: PAL.data, washOp: 255 * a, ink: PAL.ink, sw: .6 });
    paint(ellPts(x - r * .35, y - r * .35, r * .3, r * .3, 8), { wash: PAL.cream, washOp: 230 * a, ink: null });
  }
  function dizzyStars(x, y, r, t, k, spread = 0) {
    for (let i = 0; i < 4; i++) {
      const a = t * 5 + i * TAU / 4, rr = r * (1 + spread * (2.5 + i)), sx = x + Math.cos(a) * rr, sy = y + Math.sin(a) * rr * .35 - spread * 160 * (i % 2 ? 1 : .6);
      boilSeed('dstar' + i); glow(sx, sy, 22, '#FFE9A8', .6 * k);
      paint(starPts(sx, sy, 11 * (1 - spread * .5), .45, 5), { wash: i % 2 ? PAL.cream : '#F8D98A', washOp: 255 * k, ink: PAL.ink, sw: .4 });
    }
  }

  // the throws: [wind-up, release, impact, end of the rebound]
  function throws(S) {
    const L = i => S.cue(i), l2 = L(2);
    const T3 = l2 + 5.84 - .05;                                  // third impact on « ne rentrent pas »
    return [
      { w: l2 + 2.55, r: l2 + 2.8, i: l2 + 3.12, e: l2 + 3.9, pow: .5 },
      { w: l2 + 3.75, r: l2 + 3.98, i: l2 + 4.25, e: l2 + 5.0, pow: .8 },
      { w: T3 - .7, r: T3 - .28, i: T3, e: T3 + .5, pow: 1.2, back: true },
    ];
  }

  // ================= the one continuous shot, with three camera beats =================
  function maquette(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i), l1 = L(1), l2 = L(2);
    const TH = throws(S), hit = TH[2].e, exitA = S.dur - 1.25;
    const pressA = l1 + .1, pressB = l1 + 1.05, ffA = [pressA + .1, pressB], ffB = [pressB + .1, l2 + .9];
    // ---------- Jumo's path ----------
    let jx, jy, jr = 0, jsq = 0, jface = 'happy', jflip = false, prop = 'spin';
    const hover = Math.sin(st * 2.3) * 8;
    const J0 = [1690, 640], J1 = [1700, 880];                   // next to the dome · over the sensors
    const gather = seg(st, l2 + .4, l2 + 1.5);
    jx = lerp(J0[0], J1[0], ease(gather)); jy = lerp(J0[1], J1[1], ease(gather)) + hover;
    if (st < l2 + .4) jface = st < l1 ? (st > L(0) + 5.88 ? 'love' : 'happy') : 'wide';
    else if (st < TH[0].w) jface = 'scan';
    let knock = 0;
    TH.forEach((th, n) => {
      const wind = seg(st, th.w, th.r), rel = seg(st, th.r, th.r + .15);
      if (st >= th.w - .1 && st < th.e + .2) { jr += (.22 * th.pow) * ease(wind) - (.5 * th.pow) * easeOut(rel) * (1 - seg(st, th.r + .15, th.r + .5)); jsq += .12 * th.pow * wind * (1 - rel) - .1 * rel * (1 - seg(st, th.r + .15, th.r + .4)); jface = n === 2 && st < th.i ? 'angry' : st < th.i + .1 ? 'angry' : 'sad'; }
    });
    if (st >= hit - .05) { knock = easeOut(seg(st, hit, hit + .45)); jface = 'dizzy'; }
    jx += 70 * knock; jy -= 60 * knock * (1 - seg(st, hit + .45, hit + 1.2)) - 40 * seg(st, hit + .45, hit + 1.2);
    jr += knock * (TAU * 1.0) * (1 - 0) + Math.sin(st * 3) * .12 * seg(st, hit + .5, hit + 1);
    if (knock > 0) jr = TAU * easeOut(seg(st, hit, hit + .5)) + Math.sin(st * 3.3) * .14 * seg(st, hit + .4, hit + .9);
    jsq += take(st, hit, 1.2).sq;
    // ---------- camera ----------
    const z0 = K.MAQ_E[2] / (445 * MK), c0 = [DX, DY - 2 * MK + (540 - K.MAQ_E[1]) / z0];
    const pull = ease(seg(st, .25, 3.2));
    let cx = lerp(c0[0], 1180, pull), cy = lerp(c0[1], 760, pull), z = Math.exp(lerp(Math.log(z0), Math.log(1.0), pull));
    const toB = ease(seg(st, l1 - .6, l1 + .1)), toC = ease(seg(st, l2 + .1, l2 + 1.4));
    cx = lerp(cx, 1060, toB); cy = lerp(cy, 820, toB); z = lerp(z, 1.28, toB);
    cx = lerp(cx, 1380, toC); cy = lerp(cy, 820, toC); z = lerp(z, 1.05, toC);
    const gag = ease(seg(st, TH[2].w - .6, TH[2].i)) ;
    cx = lerp(cx, 1640, gag); cy = lerp(cy, 790, gag); z = lerp(z, 1.45, gag);
    const ex = ease(seg(st, exitA, S.dur - .05)), zj = K.J23.u / 11;
    cx = lerp(cx, jx, ex); cy = lerp(cy, jy + (540 - K.J23.y) / zj, ex); z = Math.exp(lerp(Math.log(z), Math.log(zj), ex));
    const [shx, shy] = st > TH[2].i && st < TH[2].i + .3 ? shakeXY(st, 5) : st > hit && st < hit + .3 ? shakeXY(st, 7) : [0, 0];
    camBegin(cx + shx, cy + shy, z);
    const MAIN = LAST_CAM, la = seg(st, .7, 1.2);
    drawPlate('hill', 0, 0);
    // sensors on the hill (right)
    SENS.forEach(([x, y], i) => sensor(x, y, 1.4, st, { key: 'h' + i, on: .35 + .65 * bump(st, l2 + .5 + i * .15, l2 + 2.6, .2) + .2 * Math.sin(st * 3 + i) }));
    // ---------- the dome (it shivers on impacts) ----------
    const sc = { ag0: L(0) + 5.88, farms: 1, farmT: L(0) + 3.64, river: 1, rivT: L(0) + 4.36, ff: 0, ffT: 0, which: 'A' };
    const inA = seg(st, ffA[0], ffA[0] + .2) * (1 - seg(st, ffA[1], ffA[1] + .1)), inB = seg(st, ffB[0], ffB[0] + .2) * (1 - seg(st, ffB[1], ffB[1] + .8));
    if (inA > 0) Object.assign(sc, { ff: inA, ffT: st - ffA[0], which: 'A' }); else if (inB > 0) Object.assign(sc, { ff: inB, ffT: st - ffB[0], which: 'B' });
    let wob = 0; TH.forEach(th => { wob += spring(st, th.i, 9, 40) * 4 * th.pow; });
    push(); translate(DX, DY); rotate(wob * .004); translate(-DX, -DY);
    dome(DX, DY, DS, st, { agents: agentsOf(sc, st) });
    pop();
    // brass plaque with the name on the table's apron
    boilSeed('plaque'); paint(rrPts(DX - 86, DY + 172, 172, 42, 8), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .8 });
    letter('MAELIA', DX, DY + 194, 28, '#5A3A1A', { weight: 700, alpha: la });
    // glass impact rings
    TH.forEach((th, n) => { const k = seg(st, th.i, th.i + .45); if (k > 0 && k < 1) { boilSeed('ring' + n); paint(ellPts(GLASS[0] - 4, GLASS[1], 14 + 70 * k * th.pow, 24 + 110 * k * th.pow, 20), { ink: PAL.cream, sw: 2.2 * (1 - k) + .2 }); glow(GLASS[0], GLASS[1], 80 * (1 - k), PAL.cream, .6 * (1 - k)); } });
    // ---------- lectern + Awa ----------
    const pa = bump(st, pressA - .05, pressA + .35, .08), pb = bump(st, pressB - .05, pressB + .35, .08);
    lectern(pa, pb, st, la);
    const step = stroll(st, pressB - .5, pressB - .1, AWA_X0, AWA_X1, 22 * 1.6);
    const reachA = bump(st, pressA - .35, pressA + .45, .25), reachB = bump(st, pressB - .3, pressB + .45, .25);
    const reach = Math.max(reachA, reachB);
    const A = actP(st, [[0, 'emerveillee', { lookX: .6, lookY: -.4 }], [L(0) + 5.88, 'joie', { lookX: .7, lookY: -.2 }], [l1 - .4, 'concentree'], [pressA + .2, 'joie'], [pressB + .5, 'fiere'],
      [l2 + 1.2, 'neutre', { lookX: .8, lookY: -.2 }], [TH[0].i, 'inquiete', { lookX: .8 }], [TH[1].i + .1, 'grimace'], [hit + .05, 'surprise', { lookX: .8, lookY: -.3 }], [hit + .9, 'doute']]);
    Object.assign(A, { view: 'side', walk: step.walk });
    if (reach > 0) Object.assign(A, { aR: lerp(.3, 1.45, ease(reach)), eR: lerp(-.3, .05, reach), handR: 'point' });
    awa(step.x, GROUND, 22, { ...A, cap: 'terrain' });
    // ---------- measurements: they rise from the sensors to Jumo, then the throws ----------
    for (let i = 0; i < 4; i++) {   // four balls gather around Jumo
      const g = seg(st, l2 + .9 + i * .25, l2 + 1.7 + i * .25); if (g <= 0) continue;
      const orbit = st * 3 + i * TAU / 4, near = [jx + Math.cos(orbit) * 70, jy + 20 + Math.sin(orbit) * 22];
      if (i < 3 && st >= TH[i].r) continue;
      const src = SENS[i], p = arcPt([src[0], src[1] - 30], near, 90, ease(g));
      if (i === 3 && st > TH[2].r) continue;
      dataBall(p[0], p[1], 14, 1, 'g' + i);
    }
    TH.forEach((th, n) => {
      if (st < th.r || st > th.e + .1) return;
      let p;
      const from = [jx - 40, jy + 10];
      if (st < th.i) p = arcPt([J1[0] - 40, J1[1] + 10], GLASS, 60 * (1 - th.pow * .5), ease(seg(st, th.r, th.i)));
      else if (!th.back) p = arcPt(GLASS, [GLASS[0] + 380, GLASS[1] + 380], 260, seg(st, th.i, th.e));
      else p = arcPt(GLASS, [jx - 30, jy], 40, easeIn(seg(st, th.i, th.e)));
      dataBall(p[0], p[1], 16 + 2 * th.pow, 1, 't' + n);
    });
    // ---------- Jumo ----------
    const dz = seg(st, hit + .1, hit + .4);
    if (st < exitA) jumo(jx, jy, 11, { stage: 0, face: jface, prop, spin: st * 9, rot: jr, sq: jsq, flip: jflip, shadowY: 1180, boilKey: 'jumo' });
    if (dz > 0 && st < exitA) dizzyStars(jx, jy - 60, 60, st, dz);
    camEnd();
    // bip ! (screen space, next to Jumo)
    if (st > hit) { const [sx, sy] = toScreen(jx, jy, LAST_CAM); sfx('bip !', sx + 110, sy - 120, 64, PAL.night, st - hit, { life: 1.4, stroke: PAL.cream }); }
    LAST_CAM = MAIN;
    // ---------- exit: the night floods in behind Jumo, the dizzy stars become the night sky ----------
    if (st >= exitA) {
      const nk = ease(seg(st, exitA, S.dur - .3));
      K.fadeLetters(1 - nk);
      drawPlate('night', -240, -135, { alpha: nk });
      const u = 11 * LAST_CAM.zoom, [sx, sy] = toScreen(jx, jy, LAST_CAM);
      dizzyStars(sx, sy - 60 * LAST_CAM.zoom, 60 * LAST_CAM.zoom, st, 1 - nk * .6, nk);
      jumo(sx, sy, u, { stage: 0, face: nk > .6 ? 'neutral' : 'dizzy', prop, spin: st * 9, rot: Math.sin(st * 3.3) * .14 * (1 - nk), sq: 0, boilKey: 'jumo' });
    }
    // entrance: the ellipse from 2.1 opens, the real territory dissolves into the tabletop
    if (st < .6) { camBegin(1260, 620, 1.3); drawPlate('territory', 0, 0, { alpha: 1 - ease(seg(st, 0, .55)) }); camEnd(); LAST_CAM = MAIN; }
    const ik = easeIn(seg(st, .1, 1.1));
    if (ik < 1) { const zc = LAST_CAM.zoom, [mx, my] = toScreen(DX, DY - 2 * MK, LAST_CAM), f = lerp(1, 4, ik); irisShape(ellPts(mx, my, 445 * MK * zc * f, 211 * MK * zc * f, 44), K.MAQ_BG); }
  }
  // 2.3 opens on Jumo here (screen), at this size
  K.J23 = { x: 960, y: 470, u: 17 };

  scene('2.2', S => [[0, maquette]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), l1 = L(1), l2 = L(2), TH = throws(S), hit = TH[2].e;
      const out = [[.1, 'whoosh', .07], [L(0) + .05, 'chime', .06], [L(0) + 3.64, 'tick', .05], [L(0) + 3.9, 'tick', .05], [L(0) + 4.36, 'sparkle', .04], [l1 + .1, 'clic', .12, -.3], [l1 + 1.05, 'clic', .12, -.3],
        [l1 + .2, 'rotor', .05], [l1 + 1.15, 'rotor', .05], [l2 + .5, 'bip', .06, .4], [l2 + 1.0, 'bloop', .07, .5], [l2 + 1.3, 'bloop', .07, .5], [hit, 'bip', .14, .4], [hit + .02, 'thud', .18], [hit + .5, 'bipsad', .08, .4],
        [S.dur - 1.2, 'sparkle', .05]];
      for (let k = 0; k < 10; k++) out.push([L(0) + 5.88 + k * .09, 'pop', .03, -.2 + k * .04]);
      TH.forEach(th => { out.push([th.w, 'squeak', .05, .4], [th.r, 'whoosh', .06 + .04 * th.pow, .4], [th.i, 'ding', .07 + .05 * th.pow, .2]); if (!th.back) out.push([th.e - .1, 'boing', .06, .6]); });
      return out;
    });
})();
