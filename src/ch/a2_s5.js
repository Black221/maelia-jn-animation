// scène 2.5 — L'arbre des futurs (V2 § 4, acte II).
// Lines: L0 « Car les futurs ne sont pas figés. »
//        L1 « Des options apparaissent, | restent ouvertes, | deviennent trop chères, | ou se referment pour de bon. »
//        L2 « Parfois, | une porte ne s'ouvre qu'un instant. »
// One shot on the night: it opens out of 2.4's flare on the same tree (same branches, same place), then the camera
// dives in: the tree is now big enough to walk on. Awa and Jumo walk along its luminous branches:
//   « apparaissent »  new shoots sprout at the fork ahead · « restent ouvertes » the branch they take glows ·
//   « trop chères »   a branch thins to a thread · « se referment pour de bon » a padlock snaps shut (Verrouillage);
//   in the pause, a branch leans over (Point de bascule) and plunges into a valley: a little option-light rolls
//   down and can't climb back (Irréversibilité) · L2: a luminous door opens for a moment; Awa runs and gets through
//   just before it shuts (Fenêtre d'opportunité). Exit: Jumo zooms up, the night warms into the day sky (→ 2.6).
(() => {
  const K = window.A2K;
  const T25 = K.TREE25, SW = 2.6;                           // world tree: root (300, 700), scale 2.6
  const ROOT = [300, 700], KZ = T25.s / SW;                 // camera zoom that shows it exactly as 2.4 left it
  const B = treeBranches(ROOT[0], ROOT[1], SW, K.TREE.seed, K.TREE.depth);
  const path = i => through(B[i].pts, 8);
  const along = (P, f) => { f = clamp(f); const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); const d = f * L[L.length - 1]; let i = 0; while (i < P.length - 2 && L[i + 1] < d) i++; const k = (d - L[i]) / (L[i + 1] - L[i] || 1); return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k), Math.atan2(P[i + 1][1] - P[i][1], P[i + 1][0] - P[i][0])]; };
  const lenOf = P => { let s = 0; for (let i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return s; };
  // the walk: root → 15 → 23 → 24 (the door stands on 24)
  const WALK = [path(15), path(23), path(24)];
  const WL = WALK.map(lenOf), WTOT = WL.reduce((a, b) => a + b, 0);
  const walkAt = d => { for (let i = 0; i < 3; i++) { if (d <= WL[i] || i === 2) return along(WALK[i], d / WL[i]); d -= WL[i]; } };
  const DOOR_F = .78, DOOR = along(path(24), DOOR_F), DOOR_D = WL[0] + WL[1] + WL[2] * DOOR_F;
  // descendants of a branch (for the lock, the thread and the plunge)
  const kids = i => { const b = B[i], out = []; for (const c of B) if (c.depth > b.depth && Math.hypot(c.pts[0][0] - b.tip[0], c.pts[0][1] - b.tip[1]) < 1) { out.push(c.i, ...kids(c.i)); } return out; };
  const LOCKB = 17, THINB = 20, PLUNGE = 27, OPEN = 23;
  const LOCKK = new Set([LOCKB, ...kids(LOCKB)]), THINK = new Set([THINB, ...kids(THINB)]), PLK = new Set([PLUNGE, ...kids(PLUNGE)]);
  K.J26 = { x: 980, y: 250, u: 11 }; K.HILL26 = [-240, -40];

  function tag(txt, x, y, k, col = PAL.night, rot = 0, a = 1) {
    const p = backOut(k); if (p < .03 || a < .02) return;
    boilSeed('tag' + txt);
    const w = txt.length * 17 + 40;
    push(); translate(x, y); rotate(rot); scale(p);
    inkLine([[0, -60], [0, -26]], 1, '#E9DDC4', 'inkfine', 0);
    paint(rrPts(-w / 2, -26, w, 52, 10, 1), { wash: PAL.cream, washOp: 245, ink: PAL.ink, sw: .8 });
    pop();
    letter(txt, x, y + 1 * p, 30 * p, col, { weight: 700, rot, alpha: a });
  }
  function door(x, y, h, open, glowK) {                  // a luminous arch standing on the branch
    boilSeed('door');
    const w = h * .55;
    if (glowK > .02) { glow(x, y - h * .5, h * 1.3, PAL.ochre, .55 * glowK); glow(x, y - h * .5, h * .6, '#FFF3C8', .8 * glowK * open); }
    paint(rrPts(x - w / 2 - 10, y - h - 10, w + 20, h + 10, w * .5), { ink: PAL.ochre, sw: 3 });
    paint(rrPts(x - w / 2, y - h, w, h, w * .45), { wash: mixCol('#3A4E6E', '#FFF1C9', open), washOp: 255, ink: PAL.ink, sw: .9 });
    // the leaf swings open (it narrows toward its hinge on the left)
    const lw = w * (1 - open);
    if (lw > 3) { paint(rrPts(x - w / 2, y - h, lw, h, Math.min(lw, w) * .45), { wash: '#7A5A3A', washOp: 255, ink: PAL.ink, sw: .8 }); paint(ellPts(x - w / 2 + lw * .8, y - h * .45, 4, 4, 8), { wash: PAL.ochre, ink: null }); }
  }

  function tree(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const appear = L(1), openT = L(1) + 1.38, dear = L(1) + 2.32, shut = L(1) + 3.7, tip = E(1) + .1, lDoor = L(2);
    const doorOpen = lDoor + .75, doorShut = E(2) - .1;       // opens on « une porte », shuts at the end of the line
    const exit0 = S.dur - 1.6;
    // ---------- Awa's walk (distance along the path), a run to the door ----------
    const d1 = WL[0] + WL[1] * .5, dStop = DOOR_D - 380, dPast = DOOR_D + 150;
    let d;
    if (st < 1.0) d = 0;
    else if (st < shut) d = lerp(0, d1, ease(seg(st, 1.0, shut)));
    else if (st < lDoor + .6) d = lerp(d1, dStop, ease(seg(st, shut, lDoor + .6)));
    else d = lerp(dStop, dPast, ease(seg(st, doorShut - 1.2, doorShut + .15)));
    const running = st > doorShut - 1.1 && st < doorShut + .1;
    const [ax, ay] = walkAt(d);
    // ---------- camera ----------
    const dive = ease(seg(st, .2, 3.0));
    const zc = Math.exp(lerp(Math.log(KZ), Math.log(1.15), dive));
    const c0 = [ROOT[0] - (T25.x - 960) / KZ, ROOT[1] - (T25.y - 540) / KZ];
    const follow = [clamp(ax + 280, 1100, 1900), clamp(ay - 60, 380, 700)];
    let cx = lerp(c0[0], follow[0], dive), cy = lerp(c0[1], follow[1], dive);
    const look = bump(st, tip - .1, lDoor + .5, .5);          // tilt down to the valley, then back up to the door
    cy += 230 * look; cx += 60 * look;
    const zz = zc * (1 - .14 * look);
    const ex = ease(seg(st, exit0, S.dur));
    cy -= 420 * ex;
    drawPlate('night', -240, -135 + 80 * ex);                 // the sky, far away (no parallax)
    camBegin(cx, cy, zz);
    // ---------- the tree ----------
    const thin = ease(seg(st, dear - .1, dear + 1.0)), lockK = seg(st, shut - .2, shut + .15), plunge = ease(seg(st, tip, tip + 1.1));
    futureTree(ROOT[0], ROOT[1], SW, st, { branches: B, grow: 1, depth: K.TREE.depth, state: b => {
      if (PLK.has(b.i)) return { a: 0, noTip: true, noGlow: true, col: PAL.night };
      if (THINK.has(b.i)) return { w: lerp(1, .14, thin), col: mixCol(PAL.data, '#7D8CA0', thin), noGlow: true, a: 1 };
      if (LOCKK.has(b.i)) return { col: mixCol(PAL.data, '#8A94A6', lockK), a: 1, noGlow: true, tipCol: lockK > .5 ? '#8A94A6' : null };
      return { a: 1, noGlow: true };
    } });
    // soft light: along the branch that stays open, and at the tips (few glows, drawn together)
    const openK = bump(st, openT - .2, lDoor + 2, .4);
    for (const b of B) if (!PLK.has(b.i) && b.depth === 3) glow(b.tip[0], b.tip[1], 50, THINK.has(b.i) ? '#7D8CA0' : PAL.data, .3 * (THINK.has(b.i) ? 1 - thin : 1));
    if (openK > .02) { const P = path(OPEN); for (let j = 0; j < P.length; j += 3) glow(P[j][0], P[j][1], 70, PAL.data, .5 * openK); }
    // « apparaissent »: new shoots sprout from the fork ahead of them
    const N2 = B[OPEN].tip;
    [[-.9, 150], [-.25, 190], [.55, 160]].forEach(([a, l], i) => {
      const k = ease(seg(st, appear + i * .2, appear + .6 + i * .2)); if (k <= 0) return;
      boilSeed('shoot' + i);
      const e = [N2[0] + Math.cos(a) * l * k, N2[1] + Math.sin(a) * l * k], m = [lerp(N2[0], e[0], .5) + 12, lerp(N2[1], e[1], .5) - 10];
      glow(e[0], e[1], 40, PAL.data, .5 * k); inkLine([N2, m, e], 3.5, PAL.data, 'ink', .5); paint(ellPts(e[0], e[1], 6 * k, 6 * k, 8), { wash: PAL.cream, ink: null });
    });
    // the plunging branch: it leans over the tipping point and dives into a valley with no way back
    const pb = B[PLUNGE], P0 = pb.pts[0], tipDown = [lerp(pb.tip[0], P0[0] + 280, plunge), lerp(pb.tip[1], P0[1] + 430, plunge)];
    const mid = [lerp(pb.pts[1][0], P0[0] + 200, plunge), lerp(pb.pts[1][1], P0[1] + 60, plunge)];
    const valley = seg(st, tip + .3, tip + 1.0);
    if (valley > 0) { boilSeed('valley'); const vx = P0[0] + 290, vy = P0[1] + 470; paint([[vx - 360, vy - 40], [vx - 120, vy - 20], [vx, vy + 140], [vx + 120, vy - 20], [vx + 380, vy - 50], [vx + 380, vy + 400], [vx - 360, vy + 400]], { wash: '#142A45', washOp: 255 * valley, ink: mixCol(PAL.night, PAL.data, .3), sw: .9, curv: .3 }); }
    boilSeed('plunge');
    for (let j = 0; j < 3; j++) glow(lerp(P0[0], tipDown[0], j / 2), lerp(P0[1], tipDown[1], j / 2), 60, PAL.data, .3 * (1 - plunge * .5));
    inkLine([P0, mid, tipDown], (3.2 - pb.depth * .55) * SW, mixCol(PAL.data, '#5E7A9A', plunge), 'ink', .5);
    // the little option-light rolls down the plunge and can't climb back
    if (st > tip + .5) {
      const rk = seg(st, tip + .5, tip + 1.4), back = .12 * Math.max(0, Math.sin((st - tip - 1.4) * 5)) * Math.exp(-(st - tip - 1.4) * 1.5) * (st > tip + 1.4 ? 1 : 0);
      const P = through([P0, mid, tipDown], 8), q = along(P, clamp(easeIn(rk) - back));
      glow(q[0], q[1] - 14, 50, PAL.ochre, .7); boilSeed('orb'); paint(ellPts(q[0], q[1] - 14, 13, 13, 10), { wash: '#F8D98A', washOp: 255, ink: PAL.ink, sw: .6 });
    }
    // padlock on the locked branch
    if (lockK > 0) { const lp = along(path(LOCKB), .35); padlock(lp[0], lp[1] + 4 - 60 * (1 - easeIn(seg(st, shut - .2, shut))), 1.9, { shut: seg(st, shut, shut + .12) }); }
    // the door (Fenêtre d'opportunité)
    const dk = ease(seg(st, doorOpen - .3, doorOpen + .15)) * (1 - ease(seg(st, doorShut - .2, doorShut))), dg = bump(st, doorOpen - .5, doorShut + .4, .3);
    if (st > lDoor - .2) door(DOOR[0], DOOR[1] + 4, 200, dk, dg);
    // ---------- Awa and Jumo ----------
    const hop = running ? Math.abs(Math.sin(st * 9)) * .15 : 0;
    const A = actP(st, [[0, 'emerveillee', { lookY: -.3 }], [appear + .1, 'joie'], [dear + .1, 'inquiete'], [shut + .05, 'surprise'], [tip + .6, 'grimace'], [lDoor + .3, 'surprise', { lookY: -.2 }], [doorShut - 1.2, 'determinee'], [doorShut + .2, 'rire']]);
    const stepPh = d / (12 * 1.4);
    const P = { ...A, view: 'side', cap: 'terrain', dy: -hop };
    if (st > 1.0 && st < doorShut + .15 && !(st > lDoor + .6 && st < doorShut - 1.2)) { if (running) P.run = stepPh * .6; else P.walk = stepPh; }
    if (running) P.rot = .12;
    const [bx, by] = walkAt(Math.min(d, WTOT));
    // her braid almost gets caught: it flicks when the door shuts right behind her
    P.braidSwing = st > doorShut - .15 && st < doorShut + .5 ? -.6 * Math.exp(-(st - doorShut + .15) * 4) : undefined;
    awa(bx, by, 12, P);
    // Jumo: hovers ahead, dives through the door first, then waits on the other side; zooms up on the exit
    const jd = st < doorShut - 1.5 ? d + 150 : lerp(d + 150, DOOR_D + 260, ease(seg(st, doorShut - 1.5, doorShut - .7)));
    const jp = walkAt(Math.min(jd, WTOT));
    let jx = jp[0], jy = jp[1] - 130 + Math.sin(st * 2.4) * 10;
    const up = easeIn(seg(st, exit0 + .2, S.dur));
    const jumoFace = st < appear ? 'happy' : st < shut + .2 ? 'tree' : st < tip + .6 ? 'wide' : st < doorOpen ? 'sad' : st < doorShut + .3 ? 'excl' : 'love';
    jumo(jx + 200 * up, jy - 900 * up, 8, { stage: 2, face: jumoFace, prop: 'spin', spin: st * 9, rot: .1 * Math.sin(st * 1.7) - .3 * up, beamIn: .3, beamOut: .3, boilKey: 'jumo' });
    // ---------- the four labels ----------
    const lp = along(path(LOCKB), .35), ta = 1 - ease(seg(st, exit0 + .2, exit0 + .9));
    tag('Verrouillage', lp[0] + 40, lp[1] - 110, seg(st, shut + .15, shut + .5), '#8A5A1E', -.04, ta);
    tag('Point de bascule', P0[0] - 60, P0[1] + 150, seg(st, tip + .1, tip + .45), PAL.night, .03, ta);
    tag('Irréversibilité', P0[0] + 470, P0[1] + 390, seg(st, tip + 1.0, tip + 1.35), PAL.red, 0, ta);
    tag('Fenêtre d’opportunité', DOOR[0] + 30, DOOR[1] - 300, seg(st, doorOpen - .2, doorOpen + .15), '#8A5A1E', -.03, ta);
    camEnd();
    // entrance: 2.4's flare fades
    if (st < .4) { glow(T25.x, T25.y, 900 * (1 - st / .4), PAL.cream, .8 * (1 - st / .4)); flash(.75 * (1 - ease(st / .4)), '#EAF6F8'); }
    // exit: the night warms into the territory's day sky (2.6's backdrop, same framing)
    const dayK = ease(seg(st, exit0 + .4, S.dur - .1));
    if (dayK > 0) {
      drawPlate('hill', K.HILL26[0], K.HILL26[1], { alpha: dayK });
      const jj = toScreen(jx + 200 * up, jy - 900 * up, LAST_CAM);
      const jyS = lerp(jj[1], K.J26.y, ease(seg(st, exit0 + .4, S.dur)));
      jumo(lerp(jj[0], K.J26.x, dayK), Math.max(jyS, K.J26.y), lerp(8 * LAST_CAM.zoom, K.J26.u, dayK), { stage: 2, face: 'happy', prop: 'spin', spin: st * 9, rot: -.3 * (1 - dayK), beamIn: .3, beamOut: .3, boilKey: 'jumo2' });
    }
  }

  scene('2.5', S => [[0, tree]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i), appear = L(1), dear = L(1) + 2.32, shut = L(1) + 3.7, tip = E(1) + .1, doorOpen = L(2) + .75, doorShut = E(2) - .1;
      const out = [[.2, 'whoosh', .08], [appear, 'sparkle', .05], [appear + .2, 'pop', .05], [appear + .4, 'pop', .05], [L(1) + 1.4, 'chime', .05], [dear, 'squeak', .06],
        [shut, 'clic', .16], [tip, 'squeak', .08], [tip + .3, 'slideDown', .1], [tip + .9, 'thud', .12], [tip + 1.4, 'bipsad', .06], [doorOpen, 'chime', .1], [doorOpen + .05, 'sparkle', .06],
        [doorShut - .7, 'bipq', .07], [doorShut, 'thud', .2], [doorShut + .25, 'bip2', .07], [S.dur - 1.4, 'whoosh', .1], [S.dur - 1.0, 'rotor', .06]];
      for (let k = 0; k < 7; k++) out.push([1.1 + k * .45, 'step', .04]);
      for (let k = 0; k < 6; k++) out.push([doorShut - 1.1 + k * .19, 'step', .06]);
      return out;
    });
})();
