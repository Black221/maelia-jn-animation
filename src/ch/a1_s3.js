// scène 1.3 — La pêche aux documents (V2 § 4, acte I). Décor : plate `library` (2400 × 1350).
// Lines: L0 « OpenAlex : 3 147. » · L1 « Semantic Scholar : 1 852. » · L2 « HAL : 332. » · L3 « arXiv : 147. » ·
//        L4 « Et en tirant sur les références… deux mille cent quatre-vingt-dix de plus. » · L5 « Total : 7 668. » ·
//        L6 « Oui, vraiment. »
// One shot inside the library, the camera pans from well to well:
//   L0–L3   four glowing wells (generic pictogram + written name, no logo). Awa, back to us, fishes with a rod: a key
//           dives down each line into its well, the well lights up and throws up parchments that land on the central
//           pile; its counter spins and stops dead on the spoken value (3 147 · 1 852 · 332 · 147)
//   end L3  pull back: the scoreboard shows → 5 478
//   L4      Jumo tugs at a parchment of the pile: its reference list unrolls into a long scroll that spits out more
//           parchments: « par citations » 2 190
//   L5      TOTAL 7 668; the pile climbs to the ceiling (bonk)
//   L6      gag: the top of the pile topples onto Jumo, only his propeller sticks out. « Oui, vraiment. »
//   → end   the funnel's hopper comes down from the ceiling and everything is sucked up into it (1.4 opens there)
(() => {
  const FLOOR = 1135, PILE = { x: 1200, base: 1130, top: 40 };        // the pile reaches the ceiling at 7 668
  const WELLS = [
    { x: 480, name: 'OpenAlex', n: 3147, pic: 'globe' },
    { x: 860, name: 'Semantic Scholar', n: 1852, pic: 'loupe' },
    { x: 1540, name: 'HAL', n: 332, pic: 'archive' },
    { x: 1920, name: 'arXiv', n: 147, pic: 'stack' },
  ];
  const WY = 1162, WS = .8, BOARD_Y = 832;
  const AWA = { x: 1200, y: 1278, s: 19 }, TIP = [1262, 948];
  const SCORE = { x: 1765, y: 470, w: 540, h: 270 };
  const HOP = { x: 1200, y: 200, s: .9 };                              // the hopper at the end (same place on screen as 1.4's first frame)
  const logZ = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
  function camKF(t, keys) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const a = keys[i - 1], b = keys[i], k = ease((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), logZ(a[3], b[3], k)]; }
    return keys[keys.length - 1].slice(1);
  }

  // ---------------- pictograms (generic, no logo) ----------------
  function picto(kind, x, y, r, on) {
    boilSeed('a1s3 pic ' + kind);
    const c = mixCol('#8A8A96', PAL.night, on), lt = mixCol('#D8D4CC', PAL.data, on);
    if (kind === 'globe') {
      paint(ellPts(x, y, r, r, 20), { wash: lt, washOp: 255, ink: c, sw: .9 });
      paint(ellPts(x, y, r * .45, r, 16), { ink: c, sw: .6 }); inkLine([[x - r, y], [x + r, y]], .6, c, 'inkfine', 0);
      inkLine([[x - r * .85, y - r * .5], [x + r * .85, y - r * .5]], .5, c, 'inkfine', 0); inkLine([[x - r * .85, y + r * .5], [x + r * .85, y + r * .5]], .5, c, 'inkfine', 0);
    } else if (kind === 'loupe') {
      paint(rrPts(x - r * .95, y - r, r * 1.3, r * 1.7, 4), { wash: PAL.cream, washOp: 255, ink: c, sw: .7 });
      for (let k = 0; k < 4; k++) inkLine([[x - r * .7, y - r * .6 + k * r * .35], [x + r * .1, y - r * .6 + k * r * .35]], .5, c, 'inkfine', 0);
      paint(ellPts(x + r * .35, y + r * .1, r * .5, r * .5, 14), { wash: lt, washOp: 220, ink: c, sw: .9 });
      inkLine([[x + r * .7, y + r * .45], [x + r * 1.05, y + r * .85]], 2.4, c, 'ink', 0);
    } else if (kind === 'archive') {
      paint(rrPts(x - r, y - r * .8, r * 2, r * 1.7, 4), { wash: lt, washOp: 255, ink: c, sw: .8 });
      inkLine([[x - r, y + .05 * r], [x + r, y + .05 * r]], .7, c, 'ink', 0);
      for (const yy of [-.38, .48]) paint(rrPts(x - r * .3, y + yy * r - r * .1, r * .6, r * .2, 2), { wash: c, washOp: 255, ink: null });
    } else {
      for (let k = 2; k >= 0; k--) paint(rrPts(x - r * .8 + k * 5, y - r * .9 + k * 5, r * 1.3, r * 1.6, 3), { wash: k ? '#EDE5D6' : PAL.cream, washOp: 255, ink: c, sw: .6 });
      inkLine([[x + r * .95, y + r * .6], [x + r * .95, y - r * .7]], 1.6, lt, 'ink', 0);
      paint([[x + r * .7, y - r * .5], [x + r * .95, y - r * .9], [x + r * 1.2, y - r * .5]], { wash: lt, ink: null });
    }
  }
  // the counter board of a well
  function board(W, i, on, n, done) {
    const x = W.x, y = BOARD_Y, w = 300, h = 164;
    boilSeed('a1s3 board' + i);
    for (const sd of [-1, 1]) paint(rectPts(x + sd * 110 - 5, y + h / 2 - 4, 10, WY - 60 - y - h / 2), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .6 });
    if (on > .02) glow(x, y, 190, PAL.data, .35 * on);
    paint(rrPts(x - w / 2, y - h / 2, w, h, 16, 1.2), { wash: mixCol('#E8DCC6', '#F6F0E2', on), washOp: 255, ink: PAL.ink, sw: 1 });
    paint(rrPts(x - w / 2 + 10, y + 2, w - 20, h / 2 - 12, 10), { wash: mixCol('#6E6A72', PAL.night, on), washOp: 255, ink: PAL.ink, sw: .6 });
    picto(W.pic, x - w / 2 + 40, y - 38, 23, on);
    letter(W.name, x + 24, y - 38, W.name.length > 10 ? 27 : 34, mixCol('#7A7480', PAL.night, on), { weight: 700, maxW: 210 });
    if (n > 0 || done) letter(fmtFR(n), x, y + 38, 54, done ? '#FFF1CF' : '#BDF1F6', { weight: 700 });
  }
  function scoreboard(k, rows) {
    const p = backOut(k); if (p < .02) return;
    const { x, y, w, h } = SCORE;
    boilSeed('a1s3 score');
    for (const sd of [-1, 1]) inkLine([[x + sd * (w / 2 - 40), y - h / 2], [x + sd * (w / 2 - 60), -20]], 1.2, '#6E6878', 'ink', 0);   // chains to the ceiling
    push(); translate(x, y); scale(p);
    paint(rrPts(-w / 2, -h / 2, w, h, 20, 1.2), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: 1.1 });
    paint(rrPts(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 12), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: .7 });
    inkLine([[-w / 2 + 40, 42], [w / 2 - 40, 42]], .8, '#46638C', 'inkfine', 0);
    pop();
    for (const r of rows) if (r.k > 0) letter(r.txt, x + (r.dx || 0) * p, y + r.dy * p, r.size * p, r.col, { pop: r.k, weight: 700, align: r.align || 'center' });
  }

  // ---------------- the pile: parchment sprites stacked in rows ----------------
  const ROW = 30, PAR_S = .62;
  const pileHW = j => 158 + 22 * Math.sin(j * .09 + .5) + 10 * Math.sin(j * .9);
  const pileTop = N => PILE.base - (PILE.base - PILE.top) * Math.pow(clamp(N / 7668), 1.8);
  // all sprite slots, bottom to top, each with the pile height at which it appears
  const SLOTS = [];
  for (let j = 0; ; j++) {
    const yc = PILE.base - ROW / 2 - j * ROW; if (yc < PILE.top + 8) break;
    const hw = pileHW(j), n = Math.max(2, Math.floor(2 * hw / 56));
    for (let k = 0; k < n; k++) SLOTS.push({ j, x: PILE.x - hw + (k + .5) * 2 * hw / n + (hash(j * 13 + k) - .5) * 18, y: yc + (hash(j * 7 + k * 3) - .5) * 8, rot: (hash(j * 5 + k * 11) - .5) * .9, v: Math.floor(hash(j + k * 17) * 2), f: (k + hash(j * 3 + k)) / n });
  }
  const slotOn = (s, top) => { const yc = PILE.base - ROW / 2 - s.j * ROW; return top < yc - ROW / 2 ? 1 : top > yc + ROW / 2 ? 0 : (s.f < (yc + ROW / 2 - top) / ROW ? 1 : 0); };

  // Jumo's propeller alone (when he's buried)
  function propeller(x, y, u, ph, rot = 0) {
    boilSeed('a1s3 prop');
    push(); translate(x, y); rotate(rot);
    paint(ribbon([[0, 2.2 * u], [0, -.2 * u]], .8 * u, .6 * u), { wash: JUMO.bodyDk, ink: PAL.ink, sw: .6 });
    paint(ellPts(0, -.3 * u, .55 * u, .45 * u, 10), { wash: JUMO.rim, ink: PAL.ink, sw: .5 });
    paint(ellPts(0, -.6 * u, 2.5 * u, .42 * u, 18), { wash: '#DDE8EE', washOp: 90, ink: null });
    const b = Math.cos(ph * TAU) * 2.3 * u; inkLine([[-b, -.6 * u], [b, -.6 * u]], .9, '#4A5260', 'ink', 0);
    pop();
  }

  function hall(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    // counters: each stops dead on its value near the end of the spoken number
    const runs = [[.55, E(0) - .35], [L(1) + .4, E(1) - .3], [L(2) + .25, E(2) - .3], [L(3) + .4, E(3) - .25]];
    const dive = i => runs[i][0] - .5;
    const sumT = E(3) + .45;
    const grab = L(4) + .15, pull = L(4) + .6, unrolled = L(4) + 1.9, citeA = L(4) + 2.0, citeB = E(4) - .9, rollback = E(4) - .1;
    const totA = L(5) + .05, totB = E(5) - 1.1, bonk = totB + .08;
    const tilt = E(5) + .05, fall = tilt + .5, buried = fall + .55, suck = E(6) + .25, hopIn = E(6) - .1, freeT = suck + .9;
    const counts = runs.map((r, i) => countTo(st, r[0], r[1], WELLS[i].n));
    const cites = countTo(st, citeA, citeB, 2190), sum = counts.reduce((a, b) => a + b, 0);
    const total = st < totA ? sum + cites : countTo(st, totA, totB, 7668, 5478);
    const N = st < totA ? sum + cites : total;
    const [cx, cy, z] = camKF(st, [[0, 738, 950, 1.34], [2.75, 745, 948, 1.3], [3.65, 880, 950, 1.3], [5.85, 890, 948, 1.3], [7.0, 1530, 950, 1.3],
      [8.35, 1545, 948, 1.3], [9.3, 1662, 950, 1.3], [E(3) - .05, 1662, 944, 1.32], [E(3) + 1.0, 1110, 760, 1.05], [E(4), 1090, 760, 1.08],
      [totA, 1100, 740, 1.05], [bonk - .1, 1150, 590, .95], [tilt, 1150, 588, .96], [buried + .1, 1280, 990, 1.45], [hopIn + .2, 1275, 985, 1.48], [freeT + .7, 1200, 400, 1.35], [S.dur, 1200, 400, 1.35]]);
    const [shx, shy] = shakeXY(st, 9 * Math.exp(-7 * Math.max(0, st - bonk)) * (st > bonk ? 1 : 0) + 7 * Math.exp(-7 * Math.max(0, st - (fall + .5))) * (st > fall + .5 ? 1 : 0));
    camBegin(cx + shx, cy + shy, z);
    drawPlate('library', 0, 0);
    // ---- the pile (behind everything on the floor); after `fall` its top has toppled; after `suck` it flies to the hopper
    const top = pileTop(N), cut = 520;                          // rows above `cut` topple onto Jumo
    const MOUND = [1335, 1205];
    const hopY = HOP.y - 900 * (1 - easeOut(seg(st, hopIn, hopIn + 1.1)));
    const sucked = (s, idx) => { const t0 = suck + (1 - idx / SLOTS.length) * .9 + hash(idx) * .3; return seg(st, t0, t0 + .7); };
    const mouth = [HOP.x, hopY - 10];
    SLOTS.forEach((s, idx) => {
      if (!slotOn(s, top)) return;
      let x = s.x, y = s.y, rot = s.rot, sc = PAR_S;
      if (s.y < cut && st > tilt) {                              // the toppling top
        const lean = ease(seg(st, tilt, fall)) * .12, dx = (cut - s.y) * lean;
        x += dx; rot += lean * 2;
        const t0 = fall + (cut - s.y) / 500 * .35 + hash(idx) * .15, k = seg(st, t0, t0 + .55);
        if (k > 0) { const hx = hash(idx * 3) - .5, tgt = [MOUND[0] + hx * 250, MOUND[1] - 10 - hash(idx * 5) * 130 * (1 - 1.8 * Math.abs(hx))]; const p = arcPt([x, y], tgt, -40, easeIn(k)); x = p[0]; y = p[1]; rot += k * 4 * (hash(idx) - .3); }
      }
      const sk = sucked(s, idx);
      if (sk >= 1) return;
      if (sk > 0) { const p = arcPt([x, y], mouth, 260, easeIn(sk)); x = p[0]; y = p[1]; sc *= 1 - .5 * sk; rot += sk * 6; }
      parchment(x, y, sc, { rot, v: s.v });
    });
    // ---- parchments flying from the active well to the pile top, and from the unrolled scroll (L4)
    const flyer = (x0, y0, t0, t1, rate, key, h = 300) => {
      for (let b = Math.ceil(t0 * rate) / rate; b < t1; b += 1 / rate) {
        const age = st - b; if (age < 0 || age > .95) continue;
        const k = age / .95, j = hash(b * 91 + key), p = arcPt([x0 + (j - .5) * 60, y0], [PILE.x + (hash(b * 37 + key) - .5) * 220, top + 10], h, easeOut(k * .6 + k * k * .4));
        parchment(p[0], p[1], .5 + .15 * Math.sin(k * Math.PI), { rot: k * 5 * (j - .5) + j, alpha: seg(k, 0, .1) });
      }
    };
    WELLS.forEach((Wl, i) => flyer(Wl.x, WY - 30, runs[i][0], runs[i][1] - .05, 16, i, 320 + i * 20));
    // ---- the boards and the scoreboard (their lettering is flushed now, so things in front can cover them)
    const done = i => st >= runs[i][1];
    WELLS.forEach((Wl, i) => board(Wl, i, clamp(seg(st, dive(i) + .3, dive(i) + .6) - .35 * seg(st, runs[i][1] + .6, runs[i][1] + 1.4)), counts[i], done(i)));
    const sk = seg(st, sumT - .25, sumT + .2), up = easeIn(seg(st, suck + .3, suck + 1.3));
    SCORE.y = 470 - 900 * up;
    scoreboard(sk, [
      { txt: '→ ' + fmtFR(5478), dy: -76, size: 46, col: '#BDF1F6', k: seg(st, sumT, sumT + .35) },
      { txt: 'par citations ' + fmtFR(cites), dy: -8, size: 38, col: '#FFE3A0', k: seg(st, citeA - .2, citeA + .15) },
      { txt: 'TOTAL ' + fmtFR(total), dy: 84, size: 56, col: '#FFF1CF', k: seg(st, totA - .2, totA + .15) },
    ]);
    flushLetters();
    // ---- the wells, the fishing lines, the diving keys
    WELLS.forEach((Wl, i) => {
      const f = clamp(seg(st, dive(i) + .35, dive(i) + .75) - .6 * seg(st, runs[i][1] + .2, runs[i][1] + 1.2)) + .15;
      well(Wl.x, WY, WS, st, { fill: f });
      const dk = seg(st, dive(i), dive(i) + .45);
      if (dk > 0) {
        boilSeed('a1s3 line' + i);
        const lineA = 1 - seg(st, E(4) - .5, E(4));
        const end = dk < 1 ? arcPt(TIP, [Wl.x, WY - 20], 60, easeIn(dk)) : [Wl.x, WY - 20];
        if (lineA > 0) inkLine([TIP, [lerp(TIP[0], end[0], .5), Math.max(TIP[1], end[1]) + 40], end], 1.8, mixCol('#E4FAFC', PAL.data, lineA), 'ink', .6);
        if (dk < 1) A1_KEY(end[0], end[1] - 30 * (1 - dk), .7 * (1 - .6 * dk), A1_KEY_KINDS[i], { rot: Math.PI * dk * .9, key: 'd' + i, glow: .6 });
        const sp = seg(st, dive(i) + .42, dive(i) + .9);
        if (sp > 0 && sp < 1) { glow(Wl.x, WY - 30, 160 * sp, '#E4FAFC', .9 * (1 - sp)); boilSeed('a1s3 splash' + i); for (let k = 0; k < 7; k++) { const a = -Math.PI * (.15 + k * .1), r = 30 + 110 * easeOut(sp); paint(ellPts(Wl.x + Math.cos(a) * r, WY - 40 + Math.sin(a) * r * .8 + 60 * sp * sp, 5, 6, 8), { wash: '#BDF1F6', washOp: 230 * (1 - sp), ink: null }); } }
      }
    });
    // ---- Awa, back to us, holds the rod; she turns round when the pile falls
    const turn = seg(st, fall + .2, fall + .55);
    const rodA = 1 - seg(st, E(4) - .5, E(4) + .2);
    if (rodA > 0 && turn < .5) { boilSeed('a1s3 rod'); inkLine([[AWA.x + 14, AWA.y - 6.4 * AWA.s], [lerp(AWA.x + 14, TIP[0], .6), lerp(AWA.y - 6.4 * AWA.s, TIP[1], .6) - 4], TIP], 4.2 * rodA, '#6E4A34', 'ink', .3); paint(ellPts(AWA.x + 22, AWA.y - 7.6 * AWA.s, 9, 9, 10), { wash: '#9C98A6', ink: PAL.ink, sw: .6 }); glow(TIP[0], TIP[1], 24, PAL.data, .6 * rodA); }
    const view = turn < .33 ? 'back' : turn < .66 ? 'q' : 'front';
    const A = actP(st, [[0, 'neutre'], [fall + .35, 'surprise', { lookX: .6 }], [E(6) - .3, 'rire'], [suck + .2, 'emerveillee', { lookY: -1, lookX: 0 }]]);
    const cast = bump(st, dive(0) - .2, dive(0) + .3, .15) + bump(st, dive(1) - .2, dive(1) + .3, .15) + bump(st, dive(2) - .2, dive(2) + .3, .15) + bump(st, dive(3) - .2, dive(3) + .3, .15);
    awa(AWA.x, AWA.y, AWA.s, { ...A, view, cap: 'labo', aL: turn < .5 ? 2.3 + .25 * cast : undefined, aR: turn < .5 ? 2.4 + .3 * cast : undefined, eL: turn < .5 ? .3 : undefined, eR: turn < .5 ? .25 : undefined, dy: -.15 * cast });
    // ---- Jumo
    let jx, jy, jf = 'happy', jr = 0, ju = 9, jlook = 0;
    const home = [1460 + 18 * Math.sin(st * 1.1), 660 + 10 * Math.sin(st * 2.2)];
    const PICK = [1030, 700], FAR = [560, 560];
    if (st < grab - .7) { [jx, jy] = home; jf = st > .6 && st < E(3) ? 'wide' : 'happy'; jlook = -.6; }
    else if (st < grab) { const k = ease(seg(st, grab - .7, grab)); jx = lerp(home[0], PICK[0] + 30, k); jy = lerp(home[1], PICK[1], k) - 50 * Math.sin(k * Math.PI); jf = 'excl'; jr = -.2 * Math.sin(k * Math.PI); }
    else if (st < pull) { jx = PICK[0] + 30 - 26 * ease(seg(st, grab, pull)) + 4 * Math.sin(st * 40) * seg(st, grab, pull); jy = PICK[1]; jf = 'excl'; jr = .15; }
    else if (st < rollback) { const k = easeOut(seg(st, pull, unrolled)); jx = lerp(PICK[0] + 4, FAR[0], k) + 8 * Math.sin(st * 2); jy = lerp(PICK[1], FAR[1], k) + 8 * Math.sin(st * 2.6); jf = st < unrolled ? 'wide' : 'love'; jr = .2 * (1 - k); }
    else if (st < totA + .9) { const k = ease(seg(st, rollback, totA + .9)); jx = lerp(FAR[0], home[0], k); jy = lerp(FAR[1], home[1], k) - 60 * Math.sin(k * Math.PI); jf = 'happy'; jr = -.15 * Math.sin(k * Math.PI); }
    else if (st < buried) { [jx, jy] = home; jf = st < fall - .05 ? 'wide' : 'wide'; jlook = 0; }
    else { jx = MOUND[0]; jy = MOUND[1] - 20; jr = .5; jf = 'dizzy'; }
    const freed = seg(st, freeT, freeT + .5);
    if (st >= buried && freed > 0) { jx = MOUND[0]; jx = lerp(MOUND[0], 1430, ease(freed)); jy = lerp(MOUND[1] - 20, 640, backOut(freed)); jr = lerp(.5, 0, freed); jf = 'dizzy'; }
    const hidden = st >= buried && freed <= 0;
    if (!hidden) jumo(jx, jy, ju, { stage: 0, face: jf, prop: 'spin', spin: st * 9, rot: jr + .06 * Math.sin(st * 1.4), lookX: jlook, lookY: st > totA + .9 && st < fall ? -1 : 0, shadowY: FLOOR + 20, boilKey: 'jumo' });
    // the parchment Jumo tugs, and its unrolling reference list
    if (st > grab && st < rollback + .6) {
      const hand = [jx - 4, jy + 4.4 * ju];
      const roll = seg(st, pull, unrolled) * (1 - seg(st, rollback, rollback + .6));
      const from = [PICK[0] - 20, PICK[1] + 30];
      if (roll > .01) {
        boilSeed('a1s3 scroll');
        const P = []; for (let k = 0; k <= 10; k++) { const u2 = k / 10 * roll; P.push([lerp(from[0], hand[0], u2), lerp(from[1], hand[1], u2) + 70 * Math.sin(u2 * Math.PI) * (1 - .4 * roll)]); }
        paint(ribbon(P, 46, 40), { wash: '#FFF6E2', washOp: 255, ink: PAL.ink, sw: .8 });
        const C2 = through(P, 4);
        for (let k = 2; k < C2.length - 2; k += 2) { const a = C2[k], b = C2[k + 1]; const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; inkLine([[a[0] - dy / d * 12, a[1] + dx / d * 12], [a[0] + dy / d * 14, a[1] - dx / d * 14]], .5, '#A48A6A', 'inkfine', 0); }
        // references pop out of the scroll and fly to the pile
        if (st > citeA - .3 && st < citeB) for (let b = Math.ceil((citeA - .3) * 18) / 18; b < Math.min(st, citeB); b += 1 / 18) {
          const age = st - b; if (age > .9) continue;
          const u2 = hash(b * 53) * .9 + .05, q = C2[Math.floor(u2 * (C2.length - 1))], k = age / .9;
          const p = arcPt(q, [PILE.x + (hash(b * 29) - .5) * 200, top + 10], 180, ease(k));
          parchment(p[0], p[1], .45 + .1 * Math.sin(k * Math.PI), { rot: k * 4 * (hash(b) - .5), alpha: seg(k, 0, .12) });
        }
      }
      if (st < pull + .2 || roll > .01) parchment(hand[0], hand[1] + 10, .55, { rot: -.3 + .1 * Math.sin(st * 9) });
    }
    // the mound over Jumo: the toppled parchments are drawn above him; only his propeller sticks out
    if (hidden) propeller(MOUND[0] + 12, MOUND[1] - 150, 17, st * (st > L(6) - .1 && st < E(6) + .2 ? 3.5 : .8), .25 + .12 * Math.sin(st * 3));
    // ---- the hopper comes down from the ceiling (the funnel of 1.4); the pile is sucked up into it
    if (st > hopIn) {
      funnel(HOP.x, hopY, HOP.s);
      const mk = seg(st, suck - .2, suck + .4);
      if (mk > 0) glow(HOP.x, hopY - 20, 260, '#FFE3A0', .35 * mk);
    }
    camEnd();
    if (st < .45) flash((1 - st / .45) * .85, '#DDF6F8');    // 1.2 ended in the doorway's cyan light
  }

  scene('1.3', S => [[0, hall]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i);
      const runs = [[.55, E(0) - .35], [L(1) + .4, E(1) - .3], [L(2) + .25, E(2) - .3], [L(3) + .4, E(3) - .25]];
      const grab = L(4) + .15, pull = L(4) + .6, citeA = L(4) + 2.0, citeB = E(4) - .9, totA = L(5) + .05, totB = E(5) - 1.1, bonk = totB + .08;
      const tilt = E(5) + .05, fall = tilt + .5, buried = fall + .55, suck = E(6) + .25, hopIn = E(6) - .1, freeT = suck + .9;
      const out = [[.05, 'whoosh', .08]];
      runs.forEach(([a, b], i) => {
        const pan = (i - 1.5) * .35;
        out.push([a - .5, 'whoosh', .07, pan], [a - .05, 'bloop', .14, pan], [a + .05, 'sparkle', .05, pan], [b, 'clic', .12, pan]);
        for (let t = a + .1; t < b - .1; t += .45) out.push([t, 'rustle', .05, pan]);
      });
      out.push([E(3) + .45, 'chime', .09, .3], [grab, 'bipq', .08, -.2], [pull - .05, 'squeak', .07, -.2], [pull + .1, 'slideUp', .06, -.3], [citeB, 'clic', .12, .3]);
      for (let t = citeA; t < citeB; t += .4) out.push([t, 'rustle', .05, -.2]);
      for (let t = totA; t < totB; t += .4) out.push([t, 'rustle', .04, 0]);
      out.push([totB, 'chime', .1, .3], [bonk, 'thud', .22], [tilt, 'squeak', .07, .2], [fall, 'whoosh', .12, .3], [fall + .5, 'thud', .2, .3], [fall + .6, 'rustle', .1, .3],
        [buried + .2, 'bipsad', .07, .3], [L(6) - .05, 'rotor', .05, .3], [E(6) + .05, 'bip', .06, .3],
        [hopIn, 'slideDown', .07], [hopIn + 1.0, 'knock', .12], [suck, 'whoosh', .14], [suck + .3, 'slideUp', .07], [freeT, 'pop', .1, .3], [freeT + .1, 'boing', .08, .3]);
      return out;
    });
})();
