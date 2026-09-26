// scène 1.1 — La carte avant le voyage (V2 § 4, acte I).
// Lines: L0 « Voici Awa. » · L1 « Elle rêve… » · L2 « Pas si vite. » · L3 « Mais avant de construire… » ·
//        L4 « Et pour ça… les règles de la quête. » · L5 « Quatre questions. Des critères clairs. » ·
//        L6 « Et un protocole… verrouillé. » · L7 « Toute modification ? Datée et justifiée. »
// Shots:  A  0 → L4   dawn field: iris from the sun, title, Awa on the tractor hood waves (L0), dream bubble with the
//                     tree of futures (L1), she jumps off and dashes (end of L1), FREEZE on « Pas si vite. » (L2),
//                     time restarts, she sighs and sits on the grass, takes out her tablet (L3)
//         B  L4 → end close-up on the tablet: she draws the treasure map, four islands RQ1–RQ4 (L4), the questions
//                     (L5), gag: Jumo adds a cookie island, Awa wipes it (hold after L5), the « Protocole » parchment
//                     and Jumo's padlock « clic » (L6), the date stamp (L7), then the map flies off and becomes the
//                     library door (→ 1.2 opens on the same door).
(() => {
  // ---------------- shared geometry ----------------
  const GROUND = 1045, HOOD = [990, 880];          // dawn plate: ground line, Awa's seat on the tractor hood
  const MAP = { x0: 432, y0: 183, k: .44 };        // the archipelago (ISLES, decor.js) drawn on the tablet
  const M = (x, y) => [MAP.x0 + x * MAP.k, MAP.y0 + y * MAP.k];
  const QUESTIONS = {
    RQ1: 'C’est quoi, un jumeau\nagricole ?', RQ2: 'Comment faire entrer\nles données ?',
    RQ3: 'Comment dessiner les\nfuturs possibles ?', RQ4: 'Comment le partager\navec les acteurs ?',
  };
  // the arch of the library door (screen space), also used at the start of 1.2: sampled like the map rectangle
  const perim = (P, n) => {   // resample a closed polygon to n points, starting at P[0]
    const L = [0]; for (let i = 1; i <= P.length; i++) L.push(L[i - 1] + Math.hypot(P[i % P.length][0] - P[i - 1][0], P[i % P.length][1] - P[i - 1][1]));
    const out = []; for (let k = 0; k < n; k++) { const d = k / n * L[P.length]; let i = 0; while (L[i + 1] < d) i++; const a = P[i], b = P[(i + 1) % P.length], f = (d - L[i]) / (L[i + 1] - L[i] || 1); out.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]); }
    return out;
  };
  const rectP = (x, y, w, h) => [[x, y + h], [x, y], [x + w, y], [x + w, y + h]];
  const archP = (cx, top, w, h) => { const P = [[cx - w / 2, top + h]]; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; P.push([cx + Math.cos(a) * w / 2, top + w / 2 + Math.sin(a) * w / 2]); } P.push([cx + w / 2, top + h]); return P; };
  window.DOOR_ARCH = () => archP(960, 170, 560, 790);    // 1.2 opens on this shape

  // ---------------- props of this scene ----------------
  function dreamBubble(x, y, r, k, t) {                    // the dream: a cloud bubble with the tree of futures
    const p = backOut(k); if (p < .02) return;
    boilSeed('bubble');
    for (const [dx, dy, rr] of [[150, 150, 14], [110, 112, 22]]) paint(ellPts(x + dx * p, y + dy * p, rr * p, rr * p, 12), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 });
    const C = []; for (let i = 0; i < 36; i++) { const a = i / 36 * TAU, b = 1 + .08 * Math.abs(Math.sin(a * 4)); C.push([x + Math.cos(a) * r * 1.25 * b * p, y + Math.sin(a) * r * .9 * b * p]); }
    paint(C, { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .8, curv: .4 });
    paint(ellPts(x, y, r * 1.02 * p, r * .7 * p, 26), { wash: PAL.night, washOp: 255, ink: null });
    futureTree(x - r * .8 * p, y + r * .1 * p, .3 * p, t, { seed: 2, depth: 2, grow: clamp(k * 1.4 - .3) });
  }
  function stylusHand(x, y, s, rot = -.6) {                 // Awa's hand holding the stylus, the tip at (x, y)
    boilSeed('stylus');
    push(); translate(x, y); rotate(rot);
    paint([[-4 * s, 0], [4 * s, 0], [5 * s, 140 * s], [-5 * s, 140 * s]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .8 });
    paint([[-4 * s, 0], [4 * s, 0], [0, -14 * s]], { wash: PAL.ink, washOp: 255, ink: null });
    paint(ellPts(10 * s, 150 * s, 46 * s, 36 * s, 16, 0, .3), { wash: AWA.skin, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(ribbon([[-8 * s, 120 * s], [-22 * s, 138 * s], [-20 * s, 160 * s]], 18 * s, 14 * s), { wash: AWA.skin, washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rectPts(-20 * s, 180 * s, 70 * s, 90 * s), { wash: AWA.shirt, washOp: 255, ink: PAL.ink, sw: .9 });   // sleeve
    pop();
  }
  function cookieIsland(x, y, r, k) {
    if (k <= .01) return;
    boilSeed('cookie');
    const C = []; for (let i = 0; i < 20; i++) { const a = i / 20 * TAU; C.push([x + Math.cos(a) * r * (1 + .06 * Math.sin(i * 3)), y + Math.sin(a) * r * .8]); }
    paint(C, { wash: '#D9A45A', washOp: 255 * k, ink: PAL.ink, sw: .8 });
    for (const [a, b] of [[-.4, -.3], [.3, -.2], [-.1, .25], [.45, .3], [-.5, .2]]) paint(ellPts(x + a * r, y + b * r, r * .12, r * .1, 8), { wash: '#5A3322', washOp: 255 * k, ink: null });
  }
  function eraseSmear(x, y, k) {                            // the stylus swipe: dry-brush streaks that wipe
    if (k <= 0 || k >= 1) return;
    boilSeed('smear');
    for (let i = 0; i < 4; i++) { const yy = y - 60 + i * 40, x0 = x - 160 + k * 60, x1 = x0 + 320 * Math.sin(k * Math.PI); inkLine([[x0, yy], [(x0 + x1) / 2, yy + 8], [x1, yy]], 7, '#F6EBD8', 'ink', .4); }
  }

  // ---------------- shot A: the dawn field ----------------
  function field(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const jumpT0 = E(1) - .25, jumpT1 = jumpT0 + .55, freezeA = L(2), freezeB = E(2) + .75;
    // motion time: everything stops dead during the freeze (« Pas si vite. »), then carries on
    const tm = st < freezeA ? st : st < freezeB ? freezeA : st - (freezeB - freezeA);
    const frozen = st >= freezeA && st < freezeB;
    if (frozen) BOILN = Math.floor((S.start + freezeA) * BOIL);          // the linework stops boiling too
    const runT0 = jumpT1 + .12, runX0 = 1140, runX = runX0 + Math.max(0, tm - runT0) * 420;
    const sitT = freezeA + .9, sitX = Math.min(runX, runX0 + (freezeA - runT0) * 420);
    // camera: slow push on Awa, then pans with the dash, then settles on her sitting in the grass
    const cx = kf(tm, [[0, 1000], [jumpT0, 1110], [freezeA, 1260], [sitT + .5, sitX + 40], [99, sitX + 40]]);
    const cy = kf(tm, [[0, 720], [freezeA, 760], [sitT + .6, 820], [99, 830]]), z = kf(tm, [[0, 1.08], [jumpT0, 1.16], [freezeA, 1.14], [sitT + .6, 1.35], [99, 1.42]]);
    camBegin(cx, cy, z);
    drawPlate('dawn', 0, 0);
    // soil sensors light up one by one in the grass
    for (let i = 0; i < 8; i++) { const on = seg(tm, .6 + i * .35, 1.2 + i * .35); sensor(260 + i * 250 + (i % 2) * 70, 1060 + (i % 3) * 45, 1.7, tm, { key: i, on: on * (.55 + .45 * Math.sin(tm * 3 + i)) }); }
    tractor(760, 1040, 1.05);
    // Awa
    let A;
    if (tm < jumpT0 - .15) {
      const wave = seg(tm, L(0) - .2, L(0) + .25) * (1 - seg(tm, E(0) + .6, E(0) + 1.0));
      A = { ...actP(tm, [[0, 'neutre'], [L(0) - .1, 'joie'], [L(1) + .2, 'emerveillee', { lookY: -.8, lookX: .3 }], [E(1) - 1.3, 'determinee']]),
            x: HOOD[0], y: HOOD[1], sit: true, view: 'side', noShadow: true, kick: 1 };
      if (wave > 0) Object.assign(A, { aR: lerp(.3, 2.6, ease(wave)) + .25 * Math.sin(tm * 12) * wave, eR: .5 });
    } else if (tm < jumpT1) {                     // the hop off the hood: crouch, arc, squash
      const k = seg(tm, jumpT0, jumpT1), p = arcPt([HOOD[0], HOOD[1] - 30], [runX0, GROUND], 110, ease(k)), J = jump(tm, jumpT0, jumpT1, 0);
      A = { ...feelP('determinee', tm), x: p[0], y: p[1], view: 'side', sq: J.sq, aL: 2.2, aR: 2.4, eL: .4, eR: .4, sit: tm < jumpT0, noShadow: k < .9 };
    } else if (tm < freezeA + .02) {              // the dash
      A = { ...feelP('determinee', tm), x: runX, y: GROUND, view: 'side', run: (tm - runT0) * 2.4, rot: .12, sq: jump(tm, jumpT0, jumpT1, 0).sq };
    } else {                                      // after the freeze: deflate, sigh, sit, tablet
      const a = seg(tm, freezeA, freezeA + .5), sat = seg(tm, sitT - .25, sitT);
      A = { ...actP(tm, [[freezeA, 'surprise', { lookX: -.6 }], [freezeA + .45, 'soupir'], [L(3) + .4, 'neutre', { lookX: .6, lookY: -.3 }], [E(3) - .8, 'concentree']]),
            x: sitX, y: GROUND, view: sat > .5 ? 'front' : 'side', sit: sat > .5, rot: .12 * (1 - a), run: a < 1 ? (freezeA - runT0) * 2.4 + a * .3 : null,
            hold: tm > L(3) + 1.6 ? 'tablet' : null, sq: sat > .5 ? spring(tm, sitT, 7, 18) * .25 : 0 };
      if (A.sit) A.sit = 'cross';
    }
    awa(A.x, A.y, 23, { ...A, cap: 'labo' });
    // Jumo (palier 0) orbits Awa, follows the dash, hangs frozen, then settles by her side
    let jx, jy, jr = 0, jf = 'happy';
    if (tm < jumpT0) { jx = HOOD[0] + 60 + Math.cos(tm * 1.3) * 330; jy = 640 + Math.sin(tm * 2.6) * 55; jr = -.15 * Math.sin(tm * 1.3); }
    else if (tm < freezeA) { const f = seg(tm, jumpT0, freezeA); jx = lerp(HOOD[0] + 60 + Math.cos(jumpT0 * 1.3) * 330, runX - 190, ease(f)); jy = lerp(640, 760, f) + Math.sin(tm * 9) * 8; jr = .25; jf = 'wide'; }
    else { const f = ease(seg(tm, freezeA + .3, sitT + .8)); jx = lerp(runX - 190, sitX + 170, f); jy = lerp(760, 905, f) + Math.sin(tm * 2.2) * 6 * f; jr = lerp(.25, 0, f); jf = tm < sitT + .5 ? 'wide' : tm < L(3) + 1 ? 'question' : 'happy'; }
    jumo(jx, jy, 11.5, { stage: 0, face: jf, prop: 'spin', spin: tm * 9, rot: jr, shadowY: GROUND + 12, boilKey: 'jumo' });
    // the dream bubble (L1)
    dreamBubble(HOOD[0] - 250, 590, 108, seg(tm, L(1) + 1.0, L(1) + 1.6) * (1 - seg(tm, E(1) - .5, E(1) - .1)), tm);
    camEnd();
    // title painted in the sky
    const tk = seg(st, .7, 1.3) * (1 - seg(st, L(1) + .5, L(1) + .95));
    if (tk > .01) { letter('Awa et Jumo', 960, 150, 104, PAL.night, { pop: tk, weight: 700, stroke: PAL.cream, screen: true }); letter('la quête du jumeau stratégique', 960, 238, 46, '#8A5A1E', { pop: seg(st, 1.1, 1.7) * (1 - seg(st, L(1) + .5, L(1) + .95)), weight: 600, stroke: PAL.cream, screen: true }); }
    // the freeze: a cold, desaturated pause (a still frame, paint and all)
    if (frozen) { boilSeed('freeze'); const fk = seg(st, freezeA, freezeA + .12) * (1 - seg(st, freezeB - .2, freezeB)); paint(rectPts(-40, -40, W + 80, H + 80), { wash: '#D8E2EA', washOp: 120 * fk, ink: null }); }
    if (st < 1.25) iris(...toScreen(1560, 610, LAST_CAM), lerp(0, 2300, easeIn(seg(st, .05, 1.25))), '#2B2233');
  }

  // ---------------- shot B: the treasure map on the tablet ----------------
  function mapShot(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const t0 = L(4), draw0 = L(4) + .35, per = (E(4) - draw0 + .2) / 4;
    const gag0 = E(5) + .15, gag1 = L(6) - .1, lock = E(6) - .55, stamp = L(7) + 1.4, fly = E(7) + .15;
    const fk = seg(st, fly, S.dur);                     // the map flies off and becomes the door
    const push0 = 1 + .02 * seg(st, t0, fly);            // a slow push the whole time
    camBegin(960, 520, push0 * (1 + .5 * easeIn(fk)));
    // desk: soft grass beyond the tablet
    boilSeed('desk'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#A9CC7E', washOp: 255, ink: null });
    // the tablet
    boilSeed('tablet');
    paint(rrPts(150, 60, 1620, 880, 60), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: 1.6 });
    paint(ellPts(960, 918, 14, 8, 10), { wash: '#34547E', ink: null });
    const scr = [190, 100, 1540, 780];
    paint(rrPts(...scr, 24), { wash: '#FAF1DF', washOp: 255, ink: null });
    // the map itself (it may be flying away)
    const mapRect = rectP(300, 150, 1320, 690), door = window.DOOR_ARCH();
    const mf = ease(seg(fk, .15, .9));
    const outline = perim(mapRect, 60).map((p, i) => { const d = perim(door, 60)[i]; const lift = [p[0], p[1] - 60 * easeOut(seg(fk, 0, .3))]; return [lerp(lift[0], d[0], mf), lerp(lift[1], d[1], mf)]; });
    boilSeed('mapsheet');
    paint(outline, { wash: mixCol('#F3E3C3', '#8A6246', mf), washOp: 255, ink: PAL.ink, sw: 1.1 + mf });
    if (mf > .6) { for (let i = 1; i < 4; i++) inkLine([[lerp(700, 1220, i / 4), 420], [lerp(700, 1220, i / 4), 950]], 1.2, '#6E4A34', 'ink', 0); paint(ellPts(1140, 640, 14, 14, 10), { wash: PAL.ochre, ink: PAL.ink, sw: .7 }); }
    const ma = 1 - seg(fk, .1, .45);                    // map content fades as the sheet turns to wood
    if (ma > .02) {
      // sea wash
      boilSeed('sea'); paint(ellPts(960, 470, 620, 300, 36), { wash: '#BFE3E4', washOp: 200 * ma * seg(st, t0, t0 + .6), ink: null });
      // compass rose
      boilSeed('compass'); const cr = seg(st, t0 + .2, t0 + .8) * ma; if (cr > .02) { paint(starPts(1520, 740, 42 * cr, .3, 4), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .7 }); }
      // islands: traced one by one (outline first, then the wash)
      let pen = null;
      ISLES.forEach((I, i) => {
        const a = draw0 + i * per, k = seg(st, a, a + per * .8), fillK = seg(st, a + per * .7, a + per * 1.1);
        if (k <= 0) return;
        boilSeed('isle' + i);
        const P = islandShape(I).map(([x, y]) => M(x, y)), C = through([...P, P[0]], 3), n = Math.max(2, Math.round(C.length * k));
        if (fillK > 0) paint(P, { wash: I.land, washOp: 255 * fillK * ma, ink: null });
        if (fillK > 0) paint(islandShape(I, .45).map(([x, y]) => M(x - I.r * .2, y - I.r * .15)), { wash: I.col, washOp: 200 * fillK * ma, ink: null });
        inkLine(C.slice(0, n), 1.3, PAL.ink, 'ink', .3);
        if (k < 1) pen = C[n - 1];
        const [lx, ly] = M(I.x, I.y);
        const lk = seg(st, a + per * .8, a + per * 1.1);
        if (lk > 0) letter(I.id, lx, ly + 4, 40, PAL.night, { pop: lk, weight: 700, alpha: ma });
      });
      // cartouche
      const ck = seg(st, t0 + .1, t0 + .7);
      if (ck > .01) letter('Revue systématique — méthode PRISMA 2020', 960, 128, 40, PAL.night, { pop: ck, weight: 600, alpha: ma });
      // the four questions (L5)
      ISLES.forEach((I, i) => {
        const qk = seg(st, L(5) + i * .35, L(5) + i * .35 + .4); if (qk <= 0) return;
        const [lx, ly] = M(I.x, I.y), left = i % 2 === 0;
        letter(QUESTIONS[I.id], lx + (left ? -135 : 135), ly, 34, '#3A2B24', { pop: qk, font: FONT.hand, weight: 400, align: left ? 'right' : 'left', alpha: ma, lh: 1.05 });
      });
      // "Des critères clairs": a tiny legend, ✓ and ✗ marks, no words
      const lg = seg(st, L(5) + 1.3, L(5) + 1.7) * ma;
      if (lg > .02) { boilSeed('legend'); push(); translate(420, 770); scale(backOut(lg)); paint(rrPts(-40, -30, 120, 60, 10), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .7 }); inkLine([[-26, 0], [-16, 12], [2, -14]], 2.4, PAL.soil, 'ink', 0); inkLine([[30, -12], [56, 12]], 2.4, PAL.red, 'ink', 0); inkLine([[56, -12], [30, 12]], 2.4, PAL.red, 'ink', 0); pop(); }
      // gag: Jumo draws a fifth island… a cookie; Awa wipes it
      const gk = seg(st, gag0, gag0 + .6), wipe = seg(st, gag0 + 1.05, gag0 + 1.45);
      if (st > gag0 && st < gag1 + .3) { cookieIsland(1420, 470, 70, gk * (1 - wipe)); eraseSmear(1420, 470, wipe); }
      // the protocol parchment (L6), Jumo's padlock, the date stamp (L7)
      const pk = seg(st, L(6) - .2, L(6) + .4);
      if (pk > 0) {
        boilSeed('protocol'); const py = lerp(900, 470, backOut(pk));
        push(); translate(960, py); rotate(-.03);
        paint(rrPts(-170, -110, 340, 220, 12), { wash: '#FFF6E2', washOp: 255 * ma, ink: PAL.ink, sw: .9 });
        for (let r = 0; r < 4; r++) inkLine([[-120, -30 + r * 30], [110 - (r % 2) * 40, -30 + r * 30]], .6, '#A48A6A', 'inkfine', 0);
        pop();
        letter('Protocole', 960, py - 72, 36, PAL.night, { weight: 700, alpha: ma, rot: -.03 });
        const lockK = seg(st, lock - .35, lock);
        if (lockK > 0) padlock(1080, lerp(300, py + 60, easeIn(lockK)), 1.6, { shut: seg(st, lock, lock + .12) });
        const sk = seg(st, stamp - .15, stamp);
        if (sk > 0) { boilSeed('stamp'); push(); translate(850, py + 55); rotate(-.2); scale(lerp(1.8, 1, easeIn(sk))); paint(rrPts(-48, -30, 96, 60, 8), { ink: PAL.red, sw: 2.2 }); paint(rectPts(-30, -18, 60, 14), { wash: PAL.red, washOp: 200 * sk, ink: null }); inkLine([[-30, 10], [-10, 2], [8, 12], [28, 0]], 1.8, PAL.red, 'ink', .4); pop(); }
      }
      // Awa's stylus hand follows the pen (while drawing), swipes the cookie, rests otherwise
      const rest = [1500, 820], wipeP = [lerp(1300, 1560, ease(wipe)), 470 + 20 * Math.sin(wipe * Math.PI)];
      const hp = pen || (wipe > 0 && wipe < 1 ? wipeP : rest);
      const hk = seg(st, t0, t0 + .4) * (1 - seg(st, fly - .5, fly));
      if (hk > 0) stylusHand(hp[0], lerp(1200, hp[1], ease(hk)), 1.25, -.55);
    }
    camEnd();
    // Jumo pops into the frame edge for the gag and the padlock
    const jin = seg(st, gag0 - .3, gag0 + .1) * (1 - seg(st, E(6) + .3, E(6) + .8));
    if (jin > 0) {
      const jf = st < gag0 + 1.05 ? 'cookie' : st < gag0 + 1.9 ? 'sad' : st < lock + .1 ? 'neutral' : 'happy';
      jumo(lerp(2080, 1745, ease(jin)), 330 + Math.sin(st * 3) * 8, 16, { stage: 0, face: jf, prop: 'spin', rot: -.12, boilKey: 'jumo' });
    }
    if (st - t0 < .25) flash(1 - (st - t0) / .25, PAL.cream);   // cut in on a soft flash (camera "lands" on the tablet)
  }

  scene('1.1', S => [[0, field], [S.cue(4) - .02, mapShot]],
    (st, S) => ({ cue4: st > S.cue(4) ? 1 : 0 }),
    S => {   // sound effects, on the same cues as the picture
      const L = i => S.cue(i), E = i => S.cueEnd(i), j0 = E(1) - .25, gag0 = E(5) + .15;
      const out = [[.4, 'rotor', .04], [L(0) + .1, 'bip2', .07, .3], [L(1) + .05, 'sparkle', .04], [j0 - .1, 'boing', .14], [j0 + .55, 'thud', .25],
        [j0 + .7, 'step', .08], [j0 + .95, 'step', .08], [L(2) - .02, 'scratch', .12], [E(2) + .75, 'whoosh', .08], [L(2) + 1.3, 'thud', .18], [L(3) + 1.5, 'rustle', .06],
        [L(4) - .05, 'whoosh', .1], [gag0, 'bipq', .09, .6], [gag0 + .2, 'pop', .12, .6], [gag0 + 1.05, 'whoosh', .14, .5], [gag0 + 1.3, 'bipsad', .08, .6],
        [L(6) - .1, 'rustle', .07], [E(6) - .55, 'clic', .14], [L(7) + 1.4, 'stamp', .3], [E(7) + .2, 'whoosh', .16], [S.dur - .4, 'knock', .2]];
      for (let i = 0; i < 4; i++) out.push([L(4) + .35 + i * (E(4) - L(4)) / 4, 'tick', .05]);
      return out;
    });
})();
