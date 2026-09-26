// scène 3.4 — Île RQ3 : le labyrinthe des futurs (V2 § 4, acte III).
// Lines: L0 « Troisième île : on sait dessiner les futurs. » · L1 « Portes qui se verrouillent, pentes qu'on ne
//        remonte pas, seuils qui font tout basculer. » · L2 « Et en explorant le modèle intelligemment, on découvre
//        bien plus de chemins : » · L3 « deux cent soixante comportements au lieu de trente-trois. »
// Shots:
//   A  0 → L1   the clouds of 3.3 clear on the living-hedge maze seen from above, at dusk: its corridors branch out
//               from the entrance like a tree of futures; Awa and Jumo walk in; push down to the entrance
//   B  L1       at hedge level, a truck through four devices: the gate that slams and padlocks (verrouillage), the
//               slide Jumo goes down and cannot climb back (hystérésis), the marble on the ridge that picks one of two
//               valleys (bifurcation), the lever « coût du pesticide »: Jumo pushes it one notch and the whole group of
//               farmers switches practice at once (point de bascule) — Hotz · Sanga · Bourceret · Pianet
//   C  L2 → end back above the maze: Awa's ordinary lamp lights 33 paths; Jumo's lantern « OpenMOLE », mode
//               « chercher la diversité », floods the maze: 260 (counter stops dead on 260) — Raimbault & Pumain, 2019;
//               clouds close in (→ 3.5)
(() => {
  // ---------------- the maze seen from above: corridors that branch like a tree of futures ----------------
  const ENT = [1200, 1290];
  const CORR = (() => {                                      // [{ pts, w, d }]
    const out = [];
    const grow = (x, y, a, len, d, id) => {
      if (d > 3) return;
      const n = d === 0 ? 3 : 2;
      for (let k = 0; k < n; k++) {
        const sp = d === 0 ? (k - 1) * .95 : (k - .5) * (1.1 - d * .12), a2 = a + sp + (hash(id * 7 + k) - .5) * .3;
        const l = len * (.8 + hash(id * 3 + k) * .35), ex = x + Math.cos(a2) * l * 1.35, ey = y + Math.sin(a2) * l * .8;
        const m1 = [lerp(x, ex, .33) + Math.cos(a2 + 1.57) * l * .12, lerp(y, ey, .33) + Math.sin(a2 + 1.57) * l * .08], m2 = [lerp(x, ex, .66) - Math.cos(a2 + 1.57) * l * .1, lerp(y, ey, .66) - Math.sin(a2 + 1.57) * l * .06];
        out.push({ pts: [[x, y], m1, m2, [ex, ey]], w: 96 - d * 16, d });
        grow(ex, ey, a2, len * .78, d + 1, id * 3 + k + 1);
      }
    };
    grow(ENT[0], ENT[1], -Math.PI / 2, 300, 0, 1);
    return out;
  })();
  // 260 lights spread evenly along all corridors, ordered by distance from the entrance
  const DOTS = (() => {
    const segs = []; let tot = 0;
    for (const c of CORR) { const P = through(c.pts, 8); for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); segs.push([P[i - 1], P[i], l, c.d]); tot += l; } }
    const out = [], step = tot / 260; let acc = step / 2;
    for (const [a, b, l] of segs) { while (acc <= l) { const f = acc / l; out.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]); acc += step; } acc -= l; }
    while (out.length > 260) out.pop();
    return out.map(p => [...p, Math.hypot(p[0] - ENT[0], (p[1] - ENT[1]) * 1.3)]).sort((a, b) => a[2] - b[2]);
  })();
  definePlate('a3s4_maze', { w: 2400, h: 1350, paint(w, h) {
    area([[-40, -40], [w + 40, -40], [w + 40, h + 40], [-40, h + 40]], '#2E5840', '#264A36', 130, .02);
    for (let i = 0; i < 90; i++) blob(hash(i * 2.1) * w, hash(i * 3.7) * h, 40 + hash(i) * 60, ['#3A6A4A', '#2A4E3A', '#46785A'][i % 3], 150, .1);
    for (const c of CORR) paint(subdiv(ribbon(c.pts, c.w + 26, c.w + 20), 40), { wash: '#1E3A2A', washOp: 200, ink: null });      // hedge shadow
    for (const c of CORR) paint(subdiv(ribbon(c.pts, c.w, c.w - 6), 40), { wash: '#B7AC8E', washOp: 255, fill: '#A39A80', fillOp: 90, bleed: .02, tex: .5, border: .45, ink: null });
    for (const c of CORR) { const P = c.pts; pen(P.map(([x, y]) => [x - c.w * .45, y]), .5, '#1E3A2A', .4); }
    for (let i = 0; i < 500; i++) { const x = hash(i * 5.3) * w, y = hash(i * 1.9) * h; paint(ellPts(x, y, 6, 5, 6), { wash: '#4E8A5E', washOp: 200, ink: null }); }   // leaf flecks
    paint(ellPts(ENT[0], ENT[1] + 20, 120, 50, 20), { wash: '#B7AC8E', washOp: 255, ink: null });
    // dusk veil
    paint(rectPts(-40, -40, w + 80, h + 80), { wash: '#1F3A5F', washOp: 60, ink: null });
  } });

  // ---------------- the hedge-level corridor ----------------
  const FY = 930;                                            // floor line
  const DOOR = 520, SLIDE = { x0: 980, y0: 470, x1: 1400, y1: FY }, HILL = { x: 1820, top: 690 }, LEVER = { x: 2330 };
  const hillY = x => { const u = (x - HILL.x) / 230; return FY + 18 - (FY + 18 - HILL.top) * Math.exp(-u * u * 1.6); };
  const slideY = x => { const u = clamp((x - SLIDE.x0) / (SLIDE.x1 - SLIDE.x0)); return lerp(SLIDE.y0, SLIDE.y1, u * u * (3 - 2 * u)); };
  definePlate('a3s4_hedges', { w: 3000, h: 1350, paint(w, h) {
    sky(w, h, [[0, '#24365E'], [260, '#4A5A92'], [480, '#9A86B0'], [620, '#E3AE9C']], 700);
    for (let i = 0; i < 70; i++) { const x = hash(i * 3.1) * w, y = hash(i * 7.7) * 420, r = 1.5 + hash(i) * 2.5; paint(ellPts(x, y, r, r, 8), { wash: '#F4F0E6', washOp: 150 + hash(i + 2) * 100, ink: null }); }
    // the back hedge wall, bumpy top, with an arch at the gate and a high block for the slide
    const top = x => 420 + 18 * Math.sin(x * .02) + 10 * Math.sin(x * .053) - (x > SLIDE.x0 - 150 && x < SLIDE.x0 + 30 ? 90 : 0);
    band(-40, w + 40, top, FY + 20, '#355E43', 255, .03);
    for (let i = 0; i < 120; i++) { const x = hash(i * 1.7) * w, y = 440 + hash(i * 2.9) * (FY - 460); blob(x, y, 24 + hash(i) * 26, ['#447552', '#2D5039', '#528A5E'][i % 3], 170, .08); }
    for (let i = 0; i < 60; i++) { const x = i * w / 60; paint(ellPts(x, top(x) + 6, 34, 20, 12), { wash: '#4A7E58', washOp: 255, ink: null }); }
    // the gate's arch (the door itself is live)
    paint([[DOOR - 110, FY], [DOOR - 110, 640], [DOOR - 80, 580], [DOOR, 555], [DOOR + 80, 580], [DOOR + 110, 640], [DOOR + 110, FY]], { wash: '#E3C9A0', washOp: 255, fill: '#F2D8A6', fillOp: 90, bleed: .03, tex: .4, border: .4, ink: PAL.ink, sw: .8 });
    for (const [x, y] of [[DOOR - 30, 700], [DOOR + 20, 780], [DOOR - 10, 860]]) blob(x, y, 30, '#FBE3A6', 120, .2);
    // the slide's platform: steps up the back
    for (let k = 0; k < 6; k++) paint(rectPts(SLIDE.x0 - 150 + k * 6, SLIDE.y0 + k * 76, 60, 12), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .6 });
    pen([[SLIDE.x0 - 150, SLIDE.y0], [SLIDE.x0 - 118, FY]], 1.4, PAL.woodDk, 0); pen([[SLIDE.x0 - 90, SLIDE.y0], [SLIDE.x0 - 58, FY]], 1.4, PAL.woodDk, 0);
    // floor
    band(-40, w + 40, x => FY + 4 * Math.sin(x * .01), h + 40, '#8C8F72', 255, .03);
    band(-40, w + 40, wave(FY + 60, 6, .006, 2), h + 40, '#A39C7C', 230, .03);
    for (let i = 0; i < 80; i++) { const x = hash(i + 3) * w, y = FY + 30 + hash(i + 60) * 380; paint(ellPts(x, y, 6 + hash(i) * 8, 3 + hash(i) * 3, 8), { wash: '#7E7A62', washOp: 200, ink: null }); }
    // the ridge between two valleys (the marble's hill)
    const P = []; for (let x = HILL.x - 420; x <= HILL.x + 420; x += 20) P.push([x, hillY(x)]); P.push([HILL.x + 420, FY + 60], [HILL.x - 420, FY + 60]);
    paint(subdiv(P, 30), { wash: '#6E9A6A', washOp: 255, fill: '#5E8A5A', fillOp: 100, bleed: .03, tex: .5, border: .4, ink: null });
    pen(P.slice(0, -2), .9, '#2D5039', .5);
    // dusk veil and lanterns glow on the wall
    paint(rectPts(-40, -40, w + 80, h + 80), { wash: '#2A3A6A', washOp: 45, ink: null });
  } });

  // ---------------- live props ----------------
  function gate(shut) {                              // the gate swings shut (shut 0 → 1)
    boilSeed('gate');
    const w = 200 * lerp(.12, 1, ease(shut));
    for (const sd of [-1, 1]) { const x0 = DOOR + sd * 100, x1 = x0 - sd * w / 2; paint([[x0, FY], [x0, 600], [x1, 600 + (1 - shut) * 20], [x1, FY]], { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .9 }); for (let k = 1; k < 4; k++) { const xx = lerp(x0, x1, k / 4); inkLine([[xx, 610], [xx, FY - 8]], .6, '#6E4A34', 'inkfine', 0); } }
  }
  function slideDraw() {
    boilSeed('slide');
    const P = [], Q = []; for (let x = SLIDE.x0; x <= SLIDE.x1; x += 30) { P.push([x, slideY(x) - 22]); Q.push([x, slideY(x) + 8]); }
    paint([...P, ...Q.reverse()], { wash: '#E0B040', washOp: 255, ink: PAL.ink, sw: 1 });
    inkLine(P, 1.4, '#F7DD8A', 'ink', .4);
    paint(rrPts(SLIDE.x0 - 160, SLIDE.y0 - 12, 170, 26, 6), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .8 });
    for (const x of [SLIDE.x0 + 120, SLIDE.x0 + 250]) inkLine([[x, slideY(x) + 8], [x, FY]], 2.2, PAL.woodDk, 'ink', 0);
  }
  function lever(k, t) {                             // the lever « coût du pesticide »: k = notch position 0 → 1
    const x = LEVER.x, y = FY;
    boilSeed('lever');
    paint(rrPts(x - 90, y - 70, 180, 70, 10), { wash: '#6B6A7A', washOp: 255, ink: PAL.ink, sw: .9 });
    paint([[x - 70, y - 70], [x + 70, y - 70], [x + 50, y - 96], [x - 50, y - 96]], { wash: '#8A8A9A', washOp: 255, ink: PAL.ink, sw: .8 });
    for (let j = -2; j <= 2; j++) { const a = -Math.PI / 2 + j * .32; inkLine([[x + Math.cos(a) * 60, y - 96 + Math.sin(a) * 60 * .5], [x + Math.cos(a) * 72, y - 96 + Math.sin(a) * 72 * .5]], j === 1 ? 2 : .8, j === 1 ? PAL.red : PAL.cream, 'ink', 0); }
    const a = -Math.PI / 2 - .64 + k * .96;          // two notches to the left → one notch to the right of the red threshold mark
    inkLine([[x, y - 96], [x + Math.cos(a) * 130, y - 96 + Math.sin(a) * 130]], 6, '#3A3440', 'ink', 0);
    paint(ellPts(x + Math.cos(a) * 136, y - 96 + Math.sin(a) * 136, 16, 16, 12), { wash: PAL.red, washOp: 255, ink: PAL.ink, sw: .7 });
    letter('coût du pesticide', x, y - 34, 24, PAL.cream, { weight: 700, maxW: 170 });
  }
  function placard(x, y, flip, k) {                 // a farmer's placard: spray can (before) → leaf (after); flips edge-on
    const f = Math.abs(Math.cos(flip * Math.PI)), side = flip < .5;
    boilSeed('plac' + Math.round(x));
    inkLine([[x, y], [x, y + 90]], 2, PAL.woodDk, 'ink', 0);
    push(); translate(x, y); scale(Math.max(.05, f), 1);
    paint(rrPts(-40, -40, 80, 70, 8), { wash: side ? '#F3D2C6' : '#DDF0D2', washOp: 255, ink: PAL.ink, sw: .8 });
    if (side) { paint(rrPts(-12, -22, 24, 38, 5), { wash: '#9C98A6', washOp: 255, ink: PAL.ink, sw: .6 }); paint(rectPts(-6, -30, 12, 8), { wash: PAL.red, washOp: 255, ink: null }); for (let j = 0; j < 3; j++) paint(ellPts(18 + j * 5, -24 - j * 3, 2.5, 2.5, 6), { wash: PAL.grey, washOp: 255, ink: null }); }
    else { paint(ellPts(0, -6, 22, 12, 12, 0, -.6), { wash: '#7FB56A', washOp: 255, ink: PAL.ink, sw: .6 }); inkLine([[-16, 8], [0, -6], [16, -20]], .8, PAL.soil, 'inkfine', .3); }
    pop();
  }
  function lantern(x, y, k, lit) {                   // the OpenMOLE lantern with its mode dial
    boilSeed('lantern');
    if (lit > .02) glow(x, y, 160 * lit, '#FFE08A', .9 * lit);
    inkLine([[x, y - 70], [x, y - 44]], 1.6, PAL.ink, 'ink', 0); paint(ellPts(x, y - 76, 10, 8, 10), { ink: PAL.ink, sw: .8 });
    paint([[x - 30, y - 44], [x + 30, y - 44], [x + 38, y + 36], [x - 38, y + 36]], { wash: mixCol('#E8DDBA', '#FFF3B8', lit), washOp: 255, ink: PAL.ink, sw: 1 });
    paint(rrPts(x - 44, y + 34, 88, 16, 5), { wash: '#6B6A7A', washOp: 255, ink: PAL.ink, sw: .8 }); paint(rrPts(x - 38, y - 54, 76, 12, 5), { wash: '#6B6A7A', washOp: 255, ink: PAL.ink, sw: .8 });
    for (const sd of [-1, 1]) inkLine([[x + sd * 16, y - 40], [x + sd * 20, y + 32]], .7, PAL.ink, 'inkfine', 0);
    letter('OpenMOLE', x, y + 70, 24, PAL.cream, { weight: 700, stroke: PAL.night, strokeW: .22 });
  }

  // ---------------- A: the maze from above ----------------
  function mazeAbove(t, lt, dur, S, st, part) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const lamp0 = L(2) + .35, lamp1 = lamp0 + .9, mole = L(2) + 1.9, flood1 = L(3) + .05;
    let cx, cy, z;
    if (part === 'A') { const k = ease(seg(st, 0, dur)); cx = 1200; cy = lerp(700, 1080, easeIn(k)); z = lerp(.86, 1.9, easeIn(k)); }
    else { cx = kf(st, [[L(2) - .1, 1200], [mole, 1200], [flood1, 1200], [99, 1200]]); cy = kf(st, [[L(2) - .1, 1060], [mole, 1080], [flood1 - .4, 690], [99, 680]]); z = kf(st, [[L(2) - .1, 1.6], [mole, 1.55], [flood1 - .4, .86], [99, .88]]); }
    camBegin(cx, cy, z);
    drawPlate('a3s4_maze', 0, 0);
    // A: the corridors glow faintly from the entrance, like the tree of futures being drawn
    if (part === 'A') {
      boilSeed('draw');
      const g = seg(st, .4, E(0));
      CORR.forEach((c, i) => { const k = clamp(g * 4.2 - c.d); if (k <= 0) return; const P = through(c.pts, 6), m = Math.max(3, Math.round(P.length * k)); inkLine(P.slice(0, m), 2.2 - c.d * .3, '#9FE6EE', 'ink', .5); });
      glow(ENT[0], ENT[1], 90, PAL.ochre, .8);
    }
    // B-C: the lights. The lamp: the 33 nearest; the lantern: all 260, in a wave from the entrance
    let n = 0, R = 0;
    if (part === 'C') {
      const nl = st < lamp0 ? 0 : st < mole + .3 ? countTo(st, lamp0, lamp1, 33) : 33;
      const nm = countTo(st, mole + .3, flood1, 260, 33);
      n = st < mole + .3 ? nl : nm;
      const dimLamp = st < mole + .3 ? seg(st, lamp0 - .1, lamp0 + .3) : 1;
      R = n ? DOTS[n - 1][2] + 60 : 0;
      if (R > 0) { boilSeed('pool'); paint(ellPts(ENT[0], ENT[1], R, R / 1.3, 40), { wash: '#FFF0B8', washOp: 38 * dimLamp, ink: null }); }
      for (let i = 0; i < n; i++) { boilSeed('dot' + i); paint(ellPts(DOTS[i][0], DOTS[i][1], 7, 7, 8), { wash: i < 33 ? '#FFF3B0' : '#F9E27A', washOp: 255, ink: null }); }
      for (let i = 0; i < n; i += 6) glow(DOTS[i][0], DOTS[i][1], 46, '#FFE08A', .5);
    }
    // Awa and Jumo at the entrance
    const ax = ENT[0] - 50, ay = ENT[1] + (part === 'A' ? lerp(80, 0, ease(seg(st, .6, 2.6))) : 0);
    const walk = part === 'A' && st > .6 && st < 2.6;
    A3.awa(ax, ay, 11, { ...(part === 'A' ? feelP('emerveillee', st, { lookY: -.8 }) : actP(st, [[0, 'concentree', { lookY: -.6 }], [mole + .4, 'emerveillee', { lookY: -.9 }], [L(3) + 1.2, 'rire']])),
      view: walk ? 'back' : 'front', walk: walk ? st * 2.2 : null, hold: null,
      aR: part === 'C' && st > lamp0 - .3 ? 2.6 : undefined, eR: part === 'C' && st > lamp0 - .3 ? .2 : undefined, boilKey: 'awa' });
    if (part === 'C' && st > lamp0 - .3) {           // the ordinary lamp, held up
      const hp = A3.hand(ax, ay, 11, 2.6, .2, 'R');
      boilSeed('lamp'); paint(ellPts(hp[0], hp[1] - 14, 10, 12, 10), { wash: '#FFF0B8', washOp: 255, ink: PAL.ink, sw: .6 });
      glow(hp[0], hp[1] - 14, 60, '#FFE08A', .7);
    }
    const jx = ENT[0] + 70, jy = ENT[1] - 110 + Math.sin(st * 2.4) * 5 - (part === 'C' ? 40 * ease(seg(st, mole - .4, mole)) : 0);
    A3.jumo(jx, jy, 7, { face: part === 'A' ? 'happy' : st > mole ? 'love' : 'scan', boilKey: 'jumo', beamOut: part === 'C' ? seg(st, mole, mole + .3) : 0 });
    if (part === 'C' && st > mole - .6) lantern(jx + 60, jy + 40, 1, seg(st, mole, mole + .3));
    camEnd();
    // the counters (screen space, integrated as painted tags)
    if (part === 'C') {
      const cL = seg(st, lamp0 + .1, lamp0 + .4), cM = seg(st, mole + .3, mole + .6);
      if (st < mole + .3 && cL > .02) { panel(960, 820, 250, 70, null, { k: cL, col: '#FFF6DE', key: 'c33' }); letter(fmtFR(n), 960, 821, 44, PAL.night, { pop: cL, weight: 700 }); }
      if (cM > .02) {
        panel(960, 150, 520, 92, null, { k: cM, col: '#FFF6DE', key: 'c260' });
        letter(fmtFR(n) + (st > flood1 - .05 ? ' comportements' : ''), 960, 152, 52, PAL.night, { pop: cM, weight: 700 });
        const k3 = seg(st, flood1 + 1.0, flood1 + 1.4);
        if (k3 > .02) letter('au lieu de ' + fmtFR(33), 960, 232, 34, '#6A3A12', { pop: k3, weight: 600, stroke: PAL.cream });
        const mk = seg(st, mole, mole + .4) * (1 - seg(st, flood1 - .3, flood1));
        if (mk > .02) letter('mode : « chercher la diversité »', 960, 232, 30, '#6A3A12', { pop: mk, weight: 600, stroke: PAL.cream });
      }
      cite(['Raimbault & Pumain, 2019 : 260 contre 33'], seg(st, flood1 + .2, flood1 + .7) * (1 - seg(st, S.dur - 1.3, S.dur - 1.0)));
    }
    if (part === 'A' && st < 1) { flushLetters(); A3.clouds(1 - seg(st, 0, .9), 'cl33'); }
    if (part === 'A') flash(seg(st, dur - .2, dur), PAL.cream);
    if (part === 'C') { flash(1 - seg(lt, 0, .25), PAL.cream); flushLetters(); A3.clouds(seg(st, S.dur - 1.0, S.dur - .08), 'cl34'); }
  }

  // ---------------- B: at hedge level, the four devices ----------------
  function hedges(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const b0 = L(1);
    const shut = [b0 + .45, b0 + .75], lock = b0 + 1.05;
    const sl = [b0 + 1.75, b0 + 2.3], climb = [b0 + 2.45, b0 + 3.2];
    const mb = [b0 + 3.35, b0 + 3.75, b0 + 4.35];            // wobble start, roll start, rest
    const lv = b0 + 4.95, flip = [lv + .15, lv + .45];
    const cx = kf(st, [[b0 - .3, 830], [b0 + 1.2, 860], [b0 + 1.55, 1230], [climb[1] - .1, 1260], [mb[0] - .15, 1800], [mb[2] + .2, 1830], [lv - .7, 2165], [99, 2165]]);
    const cz = kf(st, [[b0 - .3, 1.18], [b0 + 1.2, 1.2], [b0 + 1.55, 1.12], [mb[0] - .15, 1.2], [lv - .7, 1.15], [99, 1.18]]);
    camBegin(cx, kf(st, [[0, 720], [lv - .7, 740], [99, 740]]), cz);
    drawPlate('a3s4_hedges', 0, 0);
    // gate + padlock (verrouillage)
    if (A3.vis(DOOR, 750, 300)) {
      gate(seg(st, ...shut));
      const lk = seg(st, lock - .3, lock);
      if (lk > 0) padlock(DOOR, lerp(560, 770, easeIn(lk)), 2.2, { shut: seg(st, lock, lock + .1) });
      if (st > shut[1]) sfx('CLAC !', DOOR + 150, 600, 44, PAL.red, st - shut[1], { life: .9 });
    }
    // the slide (hystérésis): Jumo slides down, tries to climb back, slides back
    if (A3.vis(1200, 700, 400)) slideDraw();
    // the ridge and the marble (bifurcation)
    if (A3.vis(HILL.x, 800, 450)) {
      let mx = HILL.x;
      if (st > mb[0] && st < mb[1]) mx = HILL.x + 6 * Math.sin((st - mb[0]) * 30) * seg(st, mb[0], mb[1]);
      else if (st >= mb[1]) mx = HILL.x + 330 * ease(seg(st, mb[1], mb[2])) + 8 * spring(st, mb[2], 5, 14);
      const my = hillY(mx) - 26;
      boilSeed('marble'); paint(ellPts(mx, my, 26, 26, 16), { wash: '#C9A0E0', washOp: 255, ink: PAL.ink, sw: .9 }); paint(ellPts(mx - 8, my - 9, 7, 6, 8), { wash: PAL.cream, washOp: 255, ink: null });
      for (const sd of [-1, 1]) A3.arrow(HILL.x + sd * 60, HILL.top - 60, HILL.x + sd * 190, HILL.top + 10, mixCol(PAL.cream, PAL.data, .5), 2, 14, 'ha' + sd);
    }
    // the lever and the farmers (point de bascule)
    let lk = 0;
    if (A3.vis(LEVER.x + 250, 800, 500)) {
      lk = ease(seg(st, lv - .25, lv));
      lever(lk, st);
      const fk = ease(seg(st, ...flip)), F = [ACTEURS.agricultrice, ACTEURS.eleveur, ACTEURS.agricultrice, ACTEURS.eleveur];
      F.forEach((pr, i) => {
        const fx = 2560 + i * 105, fy = FY + 10 + (i % 2) * 18, jig = spring(st, flip[1] + i * .03, 6, 18) * .3;
        person(fx, fy, 11.5, { preset: pr, ...actP(st, [[0, 'neutre', { lookX: -.6 }], [flip[1], 'joie', { lookX: -.3 }]]), view: 'front', aR: 2.3, eR: .6, dy: -Math.abs(jig), boilKey: 'farm' + i, seed: i + 11 });
        placard(fx + 34, fy - 190, fk, 1);
      });
    }
    // Jumo: peeks at the gate, rides the slide and fails the climb, watches the marble, pushes the lever
    let jx, jy, jr = 0, jf = 'happy', ju = 11;
    if (st < b0 + 1.4) { jx = DOOR + 180; jy = 700 + Math.sin(st * 2.4) * 6; jf = st > shut[1] ? 'wide' : 'happy'; }
    else if (st < sl[0]) { const k = ease(seg(st, b0 + 1.4, sl[0])); jx = lerp(DOOR + 180, SLIDE.x0 + 10, k); jy = lerp(700, SLIDE.y0 - 40, k); }
    else if (st < sl[1]) { const k = easeIn(seg(st, ...sl)); jx = lerp(SLIDE.x0 + 10, SLIDE.x1 - 20, k); jy = slideY(jx) - 44; jr = .5 * Math.sin(k * Math.PI) ; jf = 'love'; }
    else if (st < climb[1]) {
      const k = seg(st, ...climb), up = Math.sin(Math.min(1, k * 1.3) * Math.PI);   // climbs part way… and slides back down
      jx = SLIDE.x1 - 20 - 170 * up; jy = slideY(jx) - 44; jr = -.4 * up; jf = k > .55 ? 'dizzy' : 'angry';
    }
    else if (st < lv - .4) { const k = ease(seg(st, climb[1], mb[0])); jx = lerp(SLIDE.x1 - 20, HILL.x - 160, k); jy = lerp(slideY(SLIDE.x1 - 20) - 44, HILL.top - 140, k) + Math.sin(st * 2.4) * 6; jf = st > mb[1] ? 'wide' : 'question'; }
    else { const k = ease(seg(st, lv - .9, lv - .3)); const a = -Math.PI / 2 - .64 + lk * .96, h = [LEVER.x + Math.cos(a) * 136, FY - 96 + Math.sin(a) * 136]; jx = lerp(HILL.x - 160, h[0] - 60, k); jy = lerp(HILL.top - 140, h[1] - 10, k); jf = st > flip[1] ? 'happy' : 'angry'; jr = .15 * k; }
    // the gate shot has Awa; the others centre on Jumo
    if (A3.vis(DOOR - 250, 800, 300)) A3.awa(DOOR - 250, FY + 30, 20, { ...actP(st, [[0, 'neutre', { lookX: .8 }], [shut[1], 'surprise', { lookX: .8 }], [lock + .4, 'grimace', { lookX: .8 }]]), view: 'q' });
    if (A3.vis(SLIDE.x0 - 330, 800, 300) && st > sl[0] - .6) A3.awa(SLIDE.x0 - 330, FY + 30, 20, { ...actP(st, [[0, 'neutre', { lookX: .8 }], [climb[0] + .4, 'rire', { lookX: .9 }]]), view: 'q' });
    A3.jumo(jx, jy, ju, { face: jf, rot: jr, boilKey: 'jumo' });
    camEnd();
    cite(['Hotz et al., 2026 : verrouillage, hystérésis', 'Sanga et al., 2025 : trappes à pauvreté, Mali'], seg(st, lock, lock + .5) * (1 - seg(st, mb[0] + .6, mb[0] + .9)));
    cite(['Bourceret et al., 2024 : point de bascule', 'Pianet et al., 2026 : leviers de décision dans MAELIA'], seg(st, lv - .4, lv + .2) * (1 - seg(st, dur + .5, dur + .8)));
    flash(1 - seg(lt, 0, .22), PAL.cream);
  }

  scene('3.4', S => [[0, (t, lt, d, S2, st) => mazeAbove(t, lt, d, S2, st, 'A')], [S.cue(1) - .15, hedges], [S.cue(2) - .1, (t, lt, d, S2, st) => mazeAbove(t, lt, d, S2, st, 'C')]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i), b0 = L(1), lamp0 = L(2) + .35, mole = L(2) + 1.9;
      const out = [[.05, 'whoosh', .1], [.5, 'sparkle', .05], [L(1) - .2, 'whoosh', .1],
        [b0 + .7, 'thud', .22, -.4], [b0 + 1.05, 'clic', .14, -.4], [b0 + 1.75, 'slideDown', .09], [b0 + 2.6, 'squeak', .06], [b0 + 2.95, 'slideDown', .06],
        [b0 + 3.35, 'tick', .05], [b0 + 3.75, 'bloop', .08, .3], [b0 + 4.95, 'clic', .12, .4], [b0 + 5.1, 'whoosh', .08, .5], [b0 + 5.3, 'pop', .08, .5],
        [L(2) - .15, 'whoosh', .1], [lamp0, 'chime', .06], [mole, 'bip2', .07], [mole + .3, 'sparkle', .07], [L(3) + .05, 'ding', .09], [S.dur - 1.0, 'whoosh', .12]];
      for (let k = 0; k < 8; k++) out.push([mole + .35 + k * .3, 'tick', .03]);
      return out;
    });
})();
