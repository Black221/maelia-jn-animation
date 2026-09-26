// scène 3.7 — Épilogue et générique (V2 § 4, acte III).
// Line: L0 « Et l'aventure ne fait que commencer. »
// Shots:
//   A  0 → 2.5     the last frame of 3.6 held: the roundabout and its banner (read on); an iris closes on the ring
//   B  2.5 → 12.3  dusk on the fields (rhymes with the dawn of 1.1): the iris opens from the setting sun; Awa, sitting
//                  on the tractor hood, launches Jumo, who rises with both antennas lit; above the land the tree of
//                  futures glows, some branches light up for the first time. The credits scroll up on the left,
//                  stop, then fade.
//   C  12.3 → end  after the credits: Tacti opens and shuts his valve again and again; Jumo gently sets a calendar on
//                  his head; Tacti calms down. Iris out.
(() => {
  const SUN = [1350, 690];
  const TR = { x: 1600, y: 1060, s: 1 }, HOOD = [TR.x + 219, TR.y - 152];
  const ROOT = [1250, 520];
  definePlate('a3s7_dusk', { w: 2400, h: 1350, paint(w, h) {
    sky(w, h, [[0, '#3B4680'], [230, '#7C5E96'], [430, '#D2789A'], [600, '#F2A064'], [760, '#F7C56E']], 880);
    blob(SUN[0], SUN[1] - 10, 320, '#FBD58A', 120, .25);
    paint(ellPts(SUN[0], SUN[1], 128, 124, 30, 3), { wash: '#F6B04C', washOp: 255, fill: '#EE8E3A', fillOp: 110, bleed: .05, tex: .5, border: .5, ink: null });
    for (const [x, y, r] of [[380, 260, 90], [520, 285, 70], [1850, 220, 80], [2000, 250, 60]]) { blob(x, y, r, '#F4B4A8', 180, .18); blob(x + r * .6, y + r * .15, r * .7, '#E89AA0', 150, .18); }
    for (let i = 0; i < 40; i++) { const x = hash(i * 3.3) * w, y = hash(i * 5.9) * 260, r = 1.4 + hash(i) * 2; paint(ellPts(x, y, r, r, 8), { wash: '#FBF3E6', washOp: 120 + hash(i + 1) * 100, ink: null }); }
    band(-40, w + 40, wave(720, 26, .004, 1), h + 40, '#8E6E8E', 170);                       // far hills in the dusk
    band(-40, w + 40, wave(780, 34, .003, 2), h + 40, '#7E7A7A', 190);
    band(-40, w + 40, wave(850, 40, .0026, 4), h + 40, '#6E7E5E', 210);
    const rows = [['#8E9A5E', 870, 910], ['#B89A5A', 910, 955], ['#7E8E52', 955, 1010], ['#A8864E', 1010, 1075]];
    for (const [c, a, b] of rows) band(-40, w + 40, wave(a, 6, .006, a), b + 20, c, 160, .02, .6);
    for (const [c, a, b] of rows) for (let r = 1; r < 3; r++) { const y0 = lerp(a, b, r / 3); pen(Array.from({ length: 13 }, (_, i) => [i * w / 12, y0 + 6 * Math.sin(i * w / 12 * .006 + a) + 3 * Math.sin(i * 1.7)]), .35, mixCol(c, PAL.ink, .35), .5); }
    // farm and greenhouse against the sky (warm silhouettes)
    wcw([[350, 852], [570, 852], [570, 800], [460, 762], [350, 800]], '#C9A6A0', 255, '#B08E8A', 80); pen([[350, 852], [350, 800], [460, 762], [570, 800], [570, 852]], .7);
    wcw([[2060, 800], [2180, 800], [2180, 750], [2120, 715], [2060, 750]], '#C8A890', 255, '#B09078', 80);
    paint([[2050, 752], [2120, 710], [2190, 752]], { wash: '#9A4A3A', washOp: 255, ink: PAL.ink, sw: .6 });
    treeP(760, 800, 110, '#5E6E4A'); treeP(840, 810, 80, '#6E7A52'); treeP(2300, 830, 120, '#5E6E4A');
    band(-40, w + 40, wave(1080, 18, .008, 3), h + 40, '#6E8E52', 230);
    band(-40, w + 40, wave(1170, 14, .011, 5), h + 40, '#5E7E48', 220);
    for (let i = 0; i < 70; i++) { const x = hash(i) * w, y = 1100 + hash(i + 50) * 230, l = 14 + hash(i + 9) * 22; pen([[x, y], [x + 4, y - l]], .7, '#4E6A3E', .3); pen([[x + 6, y], [x + 12, y - l * .8]], .6, '#4E6A3E', .3); }
  } });

  // ---------------- the credits ----------------
  // [text, size, colour, weight, gap after]
  const CREDITS = [
    ['Awa et Jumo', 52, PAL.night, 700, 4], ['la quête du jumeau stratégique', 30, '#6A3A12', 600, 30],
    ['Vers un jumeau numérique pour l’aide à la décision\nstratégique en temps réel : intégration de données\nen temps réel pour l’évaluation de trajectoires\nsocio-agroécologiques', 29, PAL.night, 600, 26],
    ['CIRAD / UMR SENS', 30, PAL.night, 700, 12],
    ['AgriFutur — PEPR Agroécologie et numérique\n(ANR-24-PEAE-0002)', 27, PAL.night, 600, 14],
    ['direction : É. Delay, J.-C. Soulié', 28, PAL.night, 600, 24],
    ['Méthode : PRISMA 2020 — revue réalisée avec\ndes agents d’IA sous contrôle humain', 26, PAL.night, 600, 22],
    ['Animation : p5.js · p5.brush (A. Campos) · d’après ClaudeAnimationBase\net PDoomVideo (J. Heibel) et clawd-video (aadil6971) ·\nPuppeteer · FFmpeg · voix : Fish Audio', 21, '#3A2B40', 500, 16],
    ['Narration : voix Fish Audio', 25, PAL.night, 600, 0],
  ];
  const LAYOUT = (() => { let y = 0; return CREDITS.map(([txt, size, col, wt, gap]) => { const n = txt.split('\n').length, h = n * size * 1.18; const o = { txt, size, col, wt, y: y + h / 2 }; y += h + gap; return o; }); })();
  const BLOCK_H = LAYOUT[LAYOUT.length - 1].y + 20;
  function credits(st, t0, tStop, tOut) {
    const X = 540, top = 135, bottom = 930, restTop = top + (bottom - top - BLOCK_H) / 2;
    const y0 = lerp(bottom + 10, restTop, easeOut(seg(st, t0, tStop)) * .15 + seg(st, t0, tStop) * .85);
    const fade = 1 - seg(st, tOut, tOut + .6);
    if (fade <= 0 || st < t0) return;
    // a soft paper card behind the lines, for legibility over the sky
    boilSeed('credcard');
    const cTop = Math.max(top - 25, y0 - 30), cBot = Math.min(bottom + 5, y0 + BLOCK_H + 20);
    if (cBot - cTop > 20) paint(rrPts(X - 470, cTop, 940, cBot - cTop, 26), { wash: '#FFF4E4', washOp: 150 * fade * clamp((cBot - cTop - 20) / 220), ink: null });
    for (const L of LAYOUT) {
      const y = y0 + L.y, a = seg(y, bottom, bottom - 50) * seg(y, top - 30, top + 20) * fade;
      if (a > .01) letter(L.txt, X, y, L.size, L.col, { weight: L.wt, alpha: a, lh: 1.18, maxW: 900, stroke: '#FFF4E4', strokeW: .12 });
    }
  }
  function calendar(x, y, rot, s = 1) {           // a small wall calendar
    boilSeed('cal');
    push(); translate(x, y); rotate(rot); scale(s);
    paint(rrPts(-46, -34, 92, 72, 6), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(-46, -34, 92, 20), { wash: PAL.red, washOp: 255, ink: PAL.ink, sw: .7 });
    for (let k = 0; k < 4; k++) paint(ellPts(-30 + k * 20, -36, 4, 6, 8), { ink: PAL.ink, sw: .7 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) paint(rectPts(-38 + c * 16, -8 + r * 14, 11, 9), { wash: r === 1 && c === 2 ? PAL.ochre : '#E8DCC8', washOp: 255, ink: null });
    pop();
  }

  function finalHold(t, lt, dur, S, st) {
    A3.finalBridges(st, { z: 1.3 + .05 * seg(st, 0, dur), cy: 660 });
    const ik = seg(st, dur - .75, dur);
    if (ik > 0) { const [cx, cy] = [960, 540 + 30 * 1.2]; iris(cx, cy, lerp(2300, 0, easeIn(ik)), PAL.night); }
  }
  function dusk(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i), t0 = st - lt;
    const toss = t0 + 1.2, up = [toss + .1, toss + 2.2], treeG = [toss + 1.0, toss + 3.6], cr0 = t0 + 2.0, crStop = t0 + 6.4, crOut = dur + t0 - .9;
    camBegin(1200 - 20 * seg(lt, 0, dur), 700 + 10 * seg(lt, 0, dur), 1.0 + .03 * seg(lt, 0, dur));
    drawPlate('a3s7_dusk', 0, 0);
    // the tree of futures in the sky; a few branches light up for the first time
    const g = ease(seg(st, ...treeG));
    if (g > .01) {
      const B = futureTree(ROOT[0], ROOT[1], .72, st, { seed: 3, depth: 3, grow: g, state: b => ({ a: 1, noGlow: true, col: hash(b.i * 7.1) > .78 && st > treeG[1] + (hash(b.i) * 1.5) ? '#FFE08A' : PAL.data }) });
      for (const b of B) if (b.depth === 3 && hash(b.i * 7.1) > .78) { const k = seg(st, treeG[1] + hash(b.i) * 1.5, treeG[1] + hash(b.i) * 1.5 + .4); if (k > 0) glow(b.tip[0], b.tip[1], 50 * backOut(k), '#FFE08A', .9 * k); }
      glow(ROOT[0] + 300, ROOT[1], 520, PAL.data, .18 * g);
    }
    tractor(TR.x, TR.y, TR.s);
    // Awa on the hood: holds Jumo up… and launches him
    const throwK = seg(st, toss - .35, toss), after = st > toss;
    const arms = st < toss - .35 ? { aL: 2.45, aR: 2.45, eL: .5, eR: .5 } : st < toss ? { aL: lerp(2.3, 3.0, easeIn(throwK)), aR: lerp(2.3, 3.0, easeIn(throwK)), eL: lerp(.7, 0, throwK), eR: lerp(.7, 0, throwK) } : { aL: lerp(2.9, .5, ease(seg(st, toss + .5, toss + 1.2))), aR: lerp(2.9, .9, ease(seg(st, toss + .5, toss + 1.2))), eL: -.4, eR: -.6 };
    A3.awa(HOOD[0], HOOD[1], 20, { ...actP(st, [[t0, 'joie', { lookX: .2 }], [toss, 'emerveillee', { lookX: -.4, lookY: -.9 }], [treeG[1] + .4, 'fiere', { lookY: -.6 }]]), ...arms, sit: true, view: 'front', noShadow: true, kick: .6, boilKey: 'awa' });
    const hp = A3.hand(HOOD[0], HOOD[1] - 1.55 * 20, 20, arms.aR, arms.eR, 'R'), hl = A3.hand(HOOD[0], HOOD[1] - 1.55 * 20, 20, arms.aL, arms.eL, 'L');
    let jx = (hp[0] + hl[0]) / 2, jy = Math.min(hp[1], hl[1]) - 36, jr = 0;
    if (after) { const k = seg(st, ...up); const p = arcPt([jx, jy], [ROOT[0] + 90, ROOT[1] + 60], 140, easeOut(k)); jx = p[0]; jy = p[1] + Math.sin(st * 2.2) * 8 * k; jr = -.25 * Math.sin(k * Math.PI); }
    const beams = seg(st, toss + .3, toss + .9);
    A3.jumo(jx, jy, 10, { face: after ? (st > treeG[0] ? 'tree' : 'happy') : 'happy', beamIn: beams, beamOut: beams, glowScreen: 1, rot: jr, boilKey: 'jumo' });
    camEnd();
    credits(st, cr0, crStop, crOut);
    if (lt < .9) iris(...toScreen(SUN[0], SUN[1], LAST_CAM), lerp(0, 2300, easeIn(seg(lt, .05, .9))), '#2B2233');
    flash(seg(lt, dur - .15, dur), PAL.cream);
  }
  function postCredits(t, lt, dur, S, st) {
    const cal = [.9, 1.5], rest = cal[1] + .05;
    camBegin(1300, 950, 2.0);
    drawPlate('a3s7_dusk', 0, 0);
    tractor(TR.x, TR.y, TR.s);
    // Tacti, still hyperactive: open, shut, open, shut… until the calendar lands on his head
    const calm = seg(lt, rest, rest + .5), open = calm < 1 ? (Math.sin(lt * 10) > 0 ? 1 : 0) * (1 - calm) : 0;
    const vx = 1225, vy = 1070;
    tacti(vx, vy, 16, { valve: lt < rest ? Math.floor(lt * 5) * 1.3 : Math.floor(rest * 5) * 1.3, open, jitter: 1 - calm, eyes: lt < rest ? 'wide' : 'wide', mouth: lt < rest ? 'shout' : 'grin', boilKey: 'tacti' });
    if (lt < rest) { const n = Math.floor(lt / .45); sfx(n % 2 ? 'CLAC !' : 'CLIC !', vx + (n % 2 ? 140 : -150), vy - 200, 34, PAL.red, lt - n * .45, { life: .42, rot: n % 2 ? .1 : -.1 }); }
    // Jumo floats down with the calendar and sets it gently on the valve
    const k = ease(seg(lt, .2, cal[1]));
    const top = [vx, vy - 7.3 * 16 - 26];
    const cx = lerp(vx + 260, top[0], k), cy = lerp(vy - 520, top[1], k);
    calendar(cx, cy, lerp(-.3, .05, k), 1.1);
    const jx = cx + lerp(0, 40, seg(lt, rest, rest + .6)), jy = cy - 70 - 60 * ease(seg(lt, rest, rest + .8));
    A3.jumo(jx, jy + Math.sin(lt * 2.5) * 3, 9, { face: lt < rest ? 'happy' : 'wink', lookX: -.5, boilKey: 'jumo' });
    camEnd();
    const ik = seg(lt, dur - .9, dur - .05);
    if (ik > 0) iris(...toScreen(vx, vy - 60, LAST_CAM), lerp(1400, 0, easeIn(ik)), PAL.night);
    flash(1 - seg(lt, 0, .2), PAL.cream);
  }

  scene('3.7', S => [[0, finalHold], [2.5, dusk], [12.3, postCredits]],
    (st, S) => ({}),
    S => {
      const toss = 2.5 + 1.2;
      return [[.3, 'sparkle', .04], [1.8, 'whoosh', .08], [2.6, 'chime', .06], [toss - .3, 'boing', .08], [toss, 'whoosh', .1], [toss + .4, 'bip2', .08], [toss + 1.2, 'sparkle', .06],
        [toss + 3.6, 'chime', .05], [12.3, 'whoosh', .06], [12.4, 'squeak', .06], [12.9, 'squeak', .06], [13.4, 'squeak', .06], [13.85, 'pop', .08], [13.95, 'ding', .08], [14.1, 'bip', .06]];
    });
})();
