// scène 3.3 — Trois leçons à la vallée (V2 § 4, acte III).
// Lines: L0 « Leçon un : mettre à jour l'état ne suffit pas, il faut aussi recaler les paramètres. » ·
//        L1 « Leçon deux : certains paramètres se ressemblent tant qu'on ne peut pas les distinguer. » ·
//        L2 « Leçon trois : ce qui marche sur des données simulées devient bien plus difficile sur des données
//        réelles. » · L3 « Une prévision toute simple reste parfois difficile à battre ! »
// Three mini-sketches, joined by whip pans:
//   A (L0)  the two knobs, at the gear workshop: Jumo pulls back out of the lens (from 3.2), Awa turns only the
//           « état » knob: Jumo veers off the target; she turns « paramètres » too: he flies straight in —
//           Knowling et al., 2023
//   B (L1)  the indistinguishable twins: two identical parameters on a scale swap places again and again; Jumo's
//           tags fall off, nobody can tell who is who, but the needle stays on the mark (the sum is right)
//   C (L2–L3) the test track and the mud: a filter-robot runs perfectly on the clean track « données simulées »,
//           then slips in the mud of the real field « données réelles »; the Videur « Doute », arms crossed, raises
//           an eyebrow — Ternes et al., 2021. A grandmother, « demain comme aujourd'hui » (a persistence forecast,
//           not a real person), walks steadily and arrives almost as fast — Ward et al., 2016
//   end     clouds close in (→ 3.4)
(() => {
  // ---------------- the test track (plate) ----------------
  const TY = 905, GY = 1000, START = 170, MUD = 1250, FIN = 2150;   // robot lane ground, grandma path ground
  definePlate('a3s3_track', { w: 2400, h: 1350, paint(w, h) {
    sky(w, h, [[0, '#94CEDA'], [260, '#C4E6E6'], [460, '#E8F1E2']], 520);
    for (const [x, y, r] of [[420, 140, 80], [560, 170, 60], [1650, 110, 90], [2150, 160, 70]]) { blob(x, y, r, '#FFF8EE', 190, .18); blob(x + r * .7, y + r * .2, r * .7, '#F6F1E8', 160, .18); }
    band(-40, w + 40, wave(470, 22, .003, 1), h + 40, '#BFD9B8', 200);
    band(-40, w + 40, wave(560, 16, .004, 2), h + 40, '#B3D39A', 230);
    for (let k = 0; k < 16; k++) blob(60 + k * 150 + hash(k) * 40, 600 + hash(k * 3) * 50, 30 + hash(k + 1) * 18, '#86B06A', 200, .1);
    treeP(300, 700, 160, '#6E9A55'); treeP(2250, 690, 140, '#7FA968');
    band(-40, w + 40, wave(760, 6, .004, 4), h + 40, '#A9CC7E', 235);
    // the clean test track (left): smooth blue-grey, white lanes, a start line
    area([[-40, TY - 110], [MUD + 20, TY - 110], [MUD + 60, TY + 20], [-40, TY + 20]], '#9FB2C4', '#8FA3B6', 70, .02);
    for (const y of [TY - 70, TY - 30]) pen([[-40, y], [MUD, y + 2]], 1.1, '#F4F2EC', .1);
    for (let k = 0; k < 8; k++) paint(rectPts(START - 6, TY - 108 + k * 16, 12, 16), { wash: k % 2 ? PAL.ink : PAL.cream, washOp: 255, ink: null });
    // the real field (right): mud, furrows, puddles
    area([[MUD - 20, TY - 112], [w + 40, TY - 120], [w + 40, GY + 120], [MUD + 30, GY + 120], [MUD - 40, TY + 30]], '#8A6A4A', '#6E5038', 150, .04);
    for (let r = 0; r < 7; r++) pen(Array.from({ length: 9 }, (_, i) => [MUD + 40 + i * 150, TY - 96 + r * 32 + 8 * Math.sin(i * 1.3 + r)]), .8, '#5A4030', .5);
    for (const [x, y, rx] of [[1450, TY - 40, 70], [1780, TY - 70, 90], [2000, TY + 10, 60], [1600, GY + 30, 80], [2250, GY - 10, 70]]) paint(ellPts(x, y, rx, rx * .28, 16), { wash: '#A5927E', washOp: 255, fill: '#8FA8B2', fillOp: 90, bleed: .03, tex: .4, border: .4, ink: null });
    for (let i = 0; i < 40; i++) { const x = MUD + hash(i * 2.3) * 1150, y = TY - 100 + hash(i * 4.7) * 230; paint(ellPts(x, y, 8 + hash(i) * 10, 4 + hash(i) * 4, 8), { wash: '#6E5038', washOp: 200, ink: null }); }
    // grandma's path in front: grass, then the same mud
    band(-40, MUD, wave(GY - 40, 4, .01, 2), h + 40, '#9DC47A', 235);
    for (let i = 0; i < 50; i++) { const x = hash(i + 3) * MUD, y = GY + hash(i + 60) * 300, l = 12 + hash(i + 9) * 18; pen([[x, y], [x + 4, y - l]], .6, '#6E9A55', .3); }
    // the finish line: two poles and a checkered banner
    for (const y of [TY - 130, GY + 10]) paint(rectPts(FIN - 5, y - 200, 10, 200), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .6 });
  } });

  // ---------------- props ----------------
  function knobBox(x, y, a1, a2, lit) {          // the control box with the two knobs
    boilSeed('kbox');
    inkLine([[x, y + 60], [x, y + 140]], 5, PAL.woodDk, 'ink', 0);
    paint(rrPts(x - 130, y - 62, 260, 124, 14), { wash: '#DCD3C2', washOp: 255, ink: PAL.ink, sw: 1 });
    for (const [kx, a, l] of [[x - 62, a1, lit[0]], [x + 62, a2, lit[1]]]) {
      if (l > .02) glow(kx, y - 8, 60, PAL.data, .5 * l);
      paint(ellPts(kx, y - 8, 36, 36, 18), { wash: '#5A6A7A', washOp: 255, ink: PAL.ink, sw: .9 });
      paint(ellPts(kx, y - 8, 26, 26, 16), { wash: '#8A9AAA', washOp: 255, ink: null });
      inkLine([[kx, y - 8], [kx + Math.cos(a) * 30, y - 8 + Math.sin(a) * 30]], 3, PAL.ochre, 'ink', 0);
      for (let k = -3; k <= 3; k++) { const aa = -Math.PI / 2 + k * .45; inkLine([[kx + Math.cos(aa) * 40, y - 8 + Math.sin(aa) * 40], [kx + Math.cos(aa) * 46, y - 8 + Math.sin(aa) * 46]], .6, PAL.ink, 'inkfine', 0); }
    }
    letter('état', x - 62, y + 44, 24, PAL.night, { weight: 700 });
    letter('paramètres', x + 62, y + 44, 24, PAL.night, { weight: 700 });
  }
  function target(x, y, hit) {
    boilSeed('target');
    inkLine([[x, y + 50], [x, y + 260]], 3, PAL.woodDk, 'ink', 0);
    if (hit > .02) glow(x, y, 120, '#9BE39A', .7 * hit);
    for (const [r, c] of [[56, PAL.red], [40, PAL.cream], [24, PAL.red], [10, PAL.cream]]) paint(ellPts(x, y, r, r, 20), { wash: c, washOp: 255, ink: PAL.ink, sw: .7 });
  }
  function scale2(x, y, needleOff) {             // a kitchen scale with a big dial: the needle on the green mark = the sum is right
    boilSeed('scale');
    paint([[x - 150, y], [x + 150, y], [x + 120, y + 150], [x - 120, y + 150]], { wash: '#E8C66A', washOp: 255, ink: PAL.ink, sw: 1 });
    paint(rrPts(x - 170, y - 16, 340, 22, 8), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .9 });
    paint(ellPts(x, y + 80, 56, 56, 22), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9 });
    paint([[x - 9, y + 26], [x + 9, y + 26], [x + 6, y + 40], [x - 6, y + 40]], { wash: '#7FC47A', washOp: 255, ink: null });
    for (let k = -4; k <= 4; k++) { const aa = -Math.PI / 2 + k * .3; inkLine([[x + Math.cos(aa) * 42, y + 80 + Math.sin(aa) * 42], [x + Math.cos(aa) * 50, y + 80 + Math.sin(aa) * 50]], .6, PAL.ink, 'inkfine', 0); }
    const a = -Math.PI / 2 + needleOff;
    inkLine([[x, y + 80], [x + Math.cos(a) * 44, y + 80 + Math.sin(a) * 44]], 2.2, PAL.red, 'ink', 0);
    paint(ellPts(x, y + 80, 6, 6, 8), { wash: PAL.ink, washOp: 255, ink: null });
  }
  function twin(x, y, i, sq, look, face) {        // one of the two identical parameters: a round weight with a face
    boilSeed('twin' + i);
    push(); translate(x, y); scale(1 + sq * .5, 1 - sq);
    paint([[-44, 0], [44, 0], [36, -70], [18, -86], [-18, -86], [-36, -70]], { wash: '#8FCFD8', washOp: 255, ink: PAL.ink, sw: .9, curv: .3 });
    paint(rrPts(-14, -104, 28, 22, 6), { wash: '#5A92B2', washOp: 255, ink: PAL.ink, sw: .7 });
    for (const sd of [-1, 1]) paint(ellPts(sd * 14 + look * 5, -48, 6, 7, 8), { wash: PAL.ink, washOp: 255, ink: null });
    if (face === 'grin') inkLine([[-12, -28], [0, -22], [12, -28]], 1.1, PAL.ink, 'ink', .5);
    else paint(ellPts(0, -26, 5, 5, 8), { wash: '#5A2230', washOp: 255, ink: null });
    pop();
  }
  function robot(x, y, o = {}) {                // the filter-robot: a runner with a sieve-funnel for a head
    const rot = o.rot || 0, run = o.run ?? 0, mud = o.mud || 0, sq = o.sq || 0;
    boilSeed('robot');
    push(); translate(x, y); rotate(rot); scale((1 + sq * .5) * 1.45, (1 - sq) * 1.45);
    for (const sd of [-1, 1]) { const ph = Math.sin(run * TAU + (sd > 0 ? Math.PI : 0)); inkLine([[sd * 10, -40], [sd * 10 + ph * 18, -18], [sd * 8 + ph * 26, 0]], 4, '#5A6A7A', 'ink', .3); paint(ellPts(sd * 8 + ph * 26 + 6, -2, 12, 6, 8), { wash: mixCol('#3A3440', '#6E5038', mud), washOp: 255, ink: null }); }
    paint(rrPts(-34, -104, 68, 66, 14), { wash: mixCol('#9FB9CF', '#8A6A4A', mud * .6), washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rrPts(-24, -94, 48, 28, 6), { wash: PAL.night, washOp: 255, ink: null });
    const e = o.eyes || 'open';
    for (const sd of [-1, 1]) { if (e === 'x') { inkLine([[sd * 10 - 5, -86], [sd * 10 + 5, -76]], 1.4, PAL.data, 'ink', 0); inkLine([[sd * 10 + 5, -86], [sd * 10 - 5, -76]], 1.4, PAL.data, 'ink', 0); } else paint(ellPts(sd * 10, -81, 4, 5, 8), { wash: PAL.data, washOp: 255, ink: null }); }
    paint([[-30, -106], [30, -106], [18, -132], [-18, -132]], { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .8 });
    for (let k = -2; k <= 2; k++) inkLine([[k * 9, -108], [k * 6, -130]], .5, PAL.ink, 'inkfine', 0);
    for (const sd of [-1, 1]) inkLine([[sd * 32, -80], [sd * 48, -64 + Math.sin(run * TAU + sd) * 10]], 3, '#5A6A7A', 'ink', .3);
    if (mud > .1) for (let k = 0; k < 5; k++) paint(ellPts(-20 + hash(k * 3) * 40, -100 + hash(k * 7) * 60, 6, 4, 8), { wash: '#6E5038', washOp: 255 * mud, ink: null });
    pop();
  }
  function splash(x, y, age) {
    if (age < 0 || age > .6) return;
    boilSeed('splash' + Math.round(x));
    const k = age / .6;
    for (let i = 0; i < 8; i++) { const a = -Math.PI * (.1 + .8 * i / 7), r = 30 + 80 * k; paint(ellPts(x + Math.cos(a) * r, y + Math.sin(a) * r * .8 + 60 * k * k, 9 * (1 - k * .5), 7 * (1 - k * .5), 8), { wash: '#6E5038', washOp: 255 * (1 - k), ink: null }); }
  }
  const GRANNY = { skin: SKIN.d, hair: '#D9D4CC', hairStyle: 'bun', shirt: '#7B5CA8', shirtDk: '#5C4480', pants: '#5A6A8A', pantsDk: '#46546E', boots: PAL.soil, cap: null, braid: false, tablet: false, pockets: false, overalls: false, glasses: true, longSleeves: true };
  const cane = (s, sw) => inkLine([[0, 0], [.2 * s, 2.2 * s], [.4 * s, 4.6 * s]], sw * 2.2, '#6E4A34', 'ink', .3);
  function whip(k, dir = 1) {                   // whip pan: streaks sweep across, the cut happens under them
    if (k <= 0 || k >= 1) return;
    const c = 1 - Math.abs(k * 2 - 1);
    boilSeed('whip' + Math.floor(k * 6));
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#F4F2EC', washOp: 255 * clamp(c * 1.6), ink: null });
    for (let i = 0; i < 16; i++) { const y = 40 + i * 66 + (hash(i) - .5) * 30, x0 = dir > 0 ? lerp(W + 200, -400, k) : lerp(-400, W + 200, k); inkLine([[x0 - 600 * c, y], [x0, y + 4], [x0 + 600 * c, y]], 5 + 6 * hash(i * 3), ['#C9DDE2', '#E6D8C0', '#B8D4A8'][i % 3], 'dry', .2); }
  }

  // ---------------- A: the two knobs ----------------
  function knobs(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const k1 = [.95, 1.45], fly1 = [1.55, 2.75], back = [2.95, 3.65], k2 = [3.5, 4.0], fly2 = [4.1, 4.95];
    const cx = 1880 + 20 * seg(st, 0, 5.6), cz = 1.34 + .04 * seg(st, 0, 5.6);
    camBegin(cx, 880, cz);
    drawPlate('a3s2_valley', 0, 0);
    A3.valleyNames(); A3.gears(1780, 575, st * .3);
    boilSeed('veil'); paint(rectPts(1000, 200, 1800, 1100), { wash: '#F4F2EC', washOp: 70, ink: null });
    const hit = seg(st, fly2[1] - .05, fly2[1] + .15) * (1 - seg(st, 5.3, 5.6));
    target(2330, 700, hit);
    const a1 = -Math.PI / 2 + lerp(-1.2, .3, ease(seg(st, ...k1))), a2 = -Math.PI / 2 + lerp(-1.2, .3, ease(seg(st, ...k2)));
    knobBox(1560, 860, a1, a2, [bump(st, k1[0], k1[1] + .4, .15), bump(st, k2[0], k2[1] + .4, .15)]);
    // Awa at the box: turns the left knob, then the right one
    const reach = st > k1[0] - .2 && st < k1[1] + .1 ? 1 : st > k2[0] - .2 && st < k2[1] + .1 ? 2 : 0;
    A3.awa(1380, 990, 20, { ...actP(st, [[0, 'concentree', { lookX: .6 }], [fly1[0] + .5, 'grimace', { lookX: .8, lookY: -.5 }], [back[1], 'determinee', { lookX: .6 }], [fly2[1], 'joie', { lookX: .8 }]]),
      view: 'q', aR: reach ? 1.25 + .08 * Math.sin(st * 20) : undefined, eR: reach ? (reach === 1 ? .1 : .45) : undefined });
    // Jumo: out of the lens to the start, veers off (state only), back, straight in (state + parameters)
    const P0 = [1700, 720], T = [2250, 700];
    let jx, jy, face = 'happy', rot = 0, u = 11;
    if (st < fly1[0]) { [jx, jy] = P0; face = st < k1[0] ? 'happy' : 'scan'; }
    else if (st < back[0]) { const k = ease(seg(st, ...fly1)); jx = lerp(P0[0], 2150, k); jy = lerp(P0[1], 700, k) - 300 * Math.sin(k * Math.PI * .75) * k; rot = -.5 * Math.sin(k * Math.PI) - .2 * k; face = k > .6 ? 'dizzy' : 'wide'; }
    else if (st < fly2[0]) { const k = ease(seg(st, ...back)); const e = [2150, 700 - 300 * Math.sin(Math.PI * .75)]; jx = lerp(e[0], P0[0], k); jy = lerp(e[1], P0[1], k); face = 'sad'; rot = .1 * Math.sin(st * 9) * (1 - k); }
    else { const k = ease(seg(st, ...fly2)); jx = lerp(P0[0], T[0], k); jy = P0[1] + Math.sin(k * Math.PI) * -12; face = st > fly2[1] ? 'check' : 'happy'; rot = .12 * (1 - k); }
    jy += Math.sin(st * 2.6) * 6;
    // pulled back out of the lens (3.2 ended with Jumo filling the frame)
    const pk = easeOut(seg(st, 0, .8));
    camEnd();
    const [sx, sy] = toScreen(jx, jy, LAST_CAM);
    A3.jumo(lerp(960, sx, pk), lerp(560, sy, pk), lerp(260, u * cz, pk), { face, rot: rot * pk, glowScreen: pk > .8 ? .5 : 0, boilKey: 'jumo' });
    if (st > fly1[0] && st < fly1[1] + .6) sfx('ZIOU…', sx + 40, sy - 140, 40, PAL.red, st - fly1[0] - .5, { life: 1.1 });
    cite(['Knowling et al., 2023 : état + paramètres'], seg(st, k2[0] - .2, k2[0] + .3) * (1 - seg(st, dur - .3, dur)));
    whip(seg(st, dur - .25, dur + .25), 1);
  }

  // ---------------- B: the indistinguishable twins ----------------
  function twins(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const sw = [L(1) + 1.1, L(1) + 2.2, L(1) + 3.2, L(1) + 4.0];                    // swaps
    camBegin(1280 + 30 * seg(lt, 0, dur), 850, 1.42 + .05 * seg(lt, 0, dur));
    drawPlate('a3s2_valley', 0, 0);
    A3.valleyNames();
    boilSeed('veil'); paint(rectPts(400, 200, 1800, 1100), { wash: '#F4F2EC', washOp: 70, ink: null });
    const X = 1300, Y = 860;
    // needle: jiggles on each landing, always back on the mark
    const jig = ring(st, sw.map(s => s + .5), 7, 22) * .08;
    scale2(X, Y, jig);
    // who stands where: they swap by hopping over each other
    let pos = [X - 70, X + 70], order = [0, 1];
    for (const s of sw) if (st > s + .5) order = [order[1], order[0]];
    const cur = sw.find(s => st > s && st < s + .5);
    for (let j = 0; j < 2; j++) {
      const who = order[j];
      let x = pos[j], y = Y - 16, sq = 0;
      if (cur != null) { const k = ease(seg(st, cur, cur + .5)), p = arcPt([pos[j], Y - 16], [pos[1 - j], Y - 16], j ? 40 : 110, k); x = p[0]; y = p[1]; sq = -.1 * Math.sin(k * Math.PI); }
      else { const land = sw.filter(s => st > s + .5).pop(); if (land != null) sq = spring(st, land + .5, 8, 20) * .18; }
      twin(x, y, who, sq, Math.sin(st * 3 + j), st > sw[3] + .6 ? 'grin' : 'o');
    }
    // Jumo tries to tag them « a » and « b »; the tags fall off at the first swap; then « ? » pops above each
    const tagK = seg(st, L(1) + .3, L(1) + .8), fall = seg(st, sw[0] + .1, sw[0] + .7);
    for (let j = 0; j < 2; j++) {
      if (tagK <= 0 || fall >= 1) continue;
      const tx = pos[j] + (j ? 14 : -14), ty = Y - 150 + 300 * fall * fall, rot = (j ? .4 : -.4) * fall * 3;
      boilSeed('tag' + j); push(); translate(tx, ty); rotate(rot); scale(backOut(tagK)); paint(rrPts(-22, -16, 44, 32, 6), { wash: '#FFF1C9', washOp: 255, ink: PAL.ink, sw: .7 }); pop();
      letter(j ? 'b' : 'a', tx, ty + 1, 26 * backOut(tagK), PAL.night, { rot, weight: 700 });
    }
    for (let j = 0; j < 2; j++) { const qk = seg(st, sw[1] + .55 + j * .15, sw[1] + .8 + j * .15) * (1 - seg(st, sw[3], sw[3] + .3)); if (qk > .02) letter('?', pos[j], Y - 170 + 6 * Math.sin(st * 5 + j), 54, PAL.red, { pop: qk, font: FONT.marker, weight: 400 }); }
    // the sum stays right
    const sk = seg(st, sw[3] + .6, sw[3] + 1.0);
    if (sk > .02) { panel(X + 270, Y + 40, 170, 64, null, { k: sk, col: '#E4F2DA', key: 'sum' }); letter('a + b', X + 245, Y + 41, 34, PAL.night, { pop: sk, weight: 700 }); boilSeed('check'); push(); translate(X + 318, Y + 40); scale(backOut(sk)); inkLine([[-14, 0], [-4, 12], [16, -14]], 3.4, PAL.soil, 'ink', 0); pop(); }
    A3.awa(1000, 990, 20, { ...actP(st, [[0, 'concentree', { lookX: .8 }], [sw[1] + .6, 'doute', { lookX: .8 }], [sw[3] + .6, 'rire', { lookX: .6 }]]), view: 'q' });
    const jf = st < sw[0] ? 'happy' : st < sw[2] ? 'question' : st < sw[3] + .6 ? 'dizzy' : 'happy';
    A3.jumo(1520 + 20 * Math.sin(st * 1.3), 640 + Math.sin(st * 2.4) * 8, 11, { face: jf, rot: st > sw[2] && st < sw[3] + .6 ? .2 * Math.sin(st * 6) : 0, flip: true, boilKey: 'jumo' });
    camEnd();
    whip(seg(lt, -.25, .25), 1);
    whip(seg(lt, dur - .25, dur + .25), 1);
  }

  // ---------------- C: the test track and the mud ----------------
  function track(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const go = L(2) + .5, onMud = go + 1.8, fall1 = onMud + .45, up1 = fall1 + .9, fall2 = up1 + 1.0, up2 = fall2 + .8, robotFin = E(3) - 1.6, granFin = E(3) - 1.1;
    // robot x: sprint on the track, then a slow, slippery crawl in the mud
    let rx, rrot = 0, rsq = 0, eyes = 'open', rrun = 0;
    if (st < go) rx = START;
    else if (st < onMud) { rx = lerp(START, MUD, seg(st, go, onMud)); rrun = (st - go) * 4.5; rrot = .12; }
    else {
      const k = seg(st, onMud, robotFin), slow = 1 - .55 * bump(st, fall1, up1, .15) - .6 * bump(st, fall2, up2, .15);
      rx = lerp(MUD, FIN + 130, 1 - Math.pow(1 - k, 1.25));
      rrun = (st - go) * 4.5 * slow; rrot = .12 + .5 * Math.sin(Math.min(1, seg(st, fall1, fall1 + .25)) * Math.PI / 2) * (1 - seg(st, up1 - .2, up1)) - .9 * bump(st, fall2, up2, .2);
      rsq = spring(st, fall1 + .25, 6, 20) * .25 + spring(st, fall2 + .2, 6, 20) * .2;
      eyes = (st > fall1 && st < up1) || (st > fall2 && st < up2) ? 'x' : 'open';
    }
    const gx = st < go ? START - 40 : lerp(START - 40, FIN + 10, seg(st, go, granFin));
    const cxk = [[0, 760], [go, 760], [onMud - .3, 1180], [onMud + .4, 1380], [E(2) - .1, 1420], [E(2) + .9, 1200], [L(3) + 1.0, 1250], [robotFin, 1720], [99, 1720]];
    const czk = [[0, 1.12], [go, 1.12], [onMud, 1.18], [E(2) - .1, 1.22], [E(2) + .9, .84], [L(3) + 1.0, .88], [robotFin, 1.1], [99, 1.14]];
    const cyk = [[0, 780], [E(2) - .1, 780], [E(2) + .9, 700], [L(3) + 1.0, 720], [robotFin, 800], [99, 800]];
    const cz = kf(st, czk), hw = W / 2 / cz;
    camBegin(clamp(kf(st, cxk), hw, 2400 - hw), kf(st, cyk), cz);
    drawPlate('a3s3_track', 0, 0);
    panel(640, TY - 190, 300, 60, 'données simulées', { key: 'sim', col: '#E6EEF4', size: 30, post: 80 });
    panel(1560, TY - 190, 290, 60, 'données réelles', { key: 'real', col: '#EAD9C0', size: 30, post: 80 });
    // the finish banner
    boilSeed('banner'); paint([[FIN - 5, TY - 330], [FIN + 5, TY - 330], [FIN + 5, GY - 190], [FIN - 5, GY - 190]], { ink: null });
    for (let k = 0; k < 10; k++) paint(rectPts(FIN - 14, TY - 320 + k * 12, 28, 12), { wash: k % 2 ? PAL.ink : PAL.cream, washOp: 255, ink: null });
    // the Videur, arms crossed at the edge of the mud: one eyebrow goes up when the robot falls
    if (A3.vis(1110, TY - 130, 300)) videur(1110, TY - 112, 15, { arms: 'crossed', brow: ease(seg(st, fall1 + .3, fall1 + .6)) * (1 - .3 * seg(st, E(2) + .5, E(2) + 1)), boilKey: 'videur' });
    robot(rx, TY, { rot: rrot, run: rrun, eyes, sq: rsq, mud: seg(st, onMud, onMud + 1.2) });
    if (st > go - .1 && st < onMud) { boilSeed('dust'); for (let k = 1; k < 4; k++) inkLine([[rx - 40 - k * 30, TY - 60 + k * 14], [rx - 70 - k * 36, TY - 60 + k * 14]], 1.2, PAL.cream, 'inkfine', 0); }
    splash(rx + 20, TY, st - fall1 - .2); splash(rx + 20, TY, st - fall2 - .15);
    if (A3.vis(rx, TY - 100, 200)) { sfx('SPLOTCH !', rx + 30, TY - 250, 42, '#6E5038', st - fall1 - .2, { life: 1.1 }); sfx('SPLOTCH !', rx + 30, TY - 250, 38, '#6E5038', st - fall2 - .15, { life: 1.0, rot: .08 }); }
    // grandma: the persistence forecast, steady as today
    const gw = st > go && st < granFin;
    person(gx, GY, 17, { preset: GRANNY, ...actP(st, [[0, 'neutre'], [granFin, 'fiere']]), view: gw ? 'side' : 'q', walk: gw ? (gx - START) / 100 : null, aR: gw ? .35 : .2, eR: -.3, handR: cane, noShadow: false, boilKey: 'granny', seed: 7 });
    const bk = Math.max(seg(st, L(2) + .3, L(2) + .6) * (1 - seg(st, go + .4, go + .7)), seg(st, E(2) + .5, E(2) + 1.0) * (1 - seg(st, S.dur - .9, S.dur - .5)));
    if (bk > .02) { boilSeed('gbub'); const bx = gx + 60, by = GY - 290; push(); translate(bx, by); scale(backOut(bk)); paint(rrPts(-150, -38, 300, 76, 30), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9 }); paint([[-60, 34], [-30, 34], [-80, 64]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .8 }); pop(); letter('demain comme\naujourd’hui', bx, by + 1, 28, PAL.night, { pop: bk, font: FONT.hand, weight: 400, lh: .95 }); }
    // Awa and Jumo watch from the start
    if (A3.vis(2330, GY, 300)) A3.awa(2330, GY + 40, 19, { ...actP(st, [[0, 'neutre', { lookX: -.8 }], [fall1 + .3, 'grimace', { lookX: -.9 }], [granFin, 'rire', { lookX: -.6 }]]), view: 'q', flip: true });
    if (A3.vis(2240, 660, 200)) A3.jumo(2240, 660 + Math.sin(st * 2.4) * 8, 10, { face: st < fall1 ? 'happy' : st < granFin ? 'sad' : 'love', flip: true, boilKey: 'jumo' });
    camEnd();
    const inT = seg(lt, 0, .25);
    cite(['Ternes et al., 2021 : sur données réelles, un filtre particulaire', 'standard fait moins bien que l’absence d’assimilation'], seg(st, fall1 + .3, fall1 + .9) * (1 - seg(st, E(2) + .4, E(2) + .8)));
    cite(['Ward et al., 2016 : pas encore mieux qu’une prévision de persistance'], seg(st, L(3) + .3, L(3) + .8) * (1 - seg(st, S.dur - 1.1, S.dur - .8)));
    whip(seg(lt, -.25, .25), 1);
    flushLetters();
    A3.clouds(seg(st, S.dur - .95, S.dur - .08), 'cl33');
  }

  scene('3.3', S => [[0, knobs], [S.cue(1) - .02, twins], [S.cue(2) - .1, track]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i), go = L(2) + .5, onMud = go + 1.8, fall1 = onMud + .45, fall2 = fall1 + 1.9;
      const out = [[.05, 'whoosh', .12], [.95, 'tick', .06], [1.2, 'tick', .06], [1.55, 'whoosh', .08], [2.3, 'buzzer', .06], [2.75, 'bipsad', .07], [3.5, 'tick', .06], [3.75, 'tick', .06], [4.1, 'whoosh', .08], [4.95, 'ding', .1],
        [L(1) - .1, 'whoosh', .1], [L(1) + .5, 'pop', .07], [L(1) + .7, 'pop', .07], [L(2) - .2, 'whoosh', .1], [go, 'whoosh', .1], [fall1 + .2, 'thud', .2], [fall1 + .25, 'scratch', .08], [fall2 + .15, 'thud', .16],
        [fall1 + .4, 'squeak', .06], [E(2) + .5, 'pop', .06], [E(3) - 1.6, 'ding', .08], [E(3) - 1.1, 'chime', .06], [S.dur - .95, 'whoosh', .12]];
      [1.1, 2.2, 3.2, 4.0].forEach(d => { out.push([L(1) + d, 'boing', .06]); out.push([L(1) + d + .5, 'bloop', .07]); });
      for (let k = 0; k < 14; k++) out.push([go + .3 + k * .5, 'step', .035, .2]);
      return out;
    });
})();
