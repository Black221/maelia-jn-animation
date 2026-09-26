// scène 2.1 — Un territoire qui change vite (V2 § 4, acte II).
// Lines: L0 « Le territoire d'Awa vit dans l'incertitude : | le climat, | les prix, | les techniques, | tout bouge vite. »
//        L1 « Et chaque choix agricole | a des effets sur l'eau, | l'azote, | les sols. »
// Shots:  A  0 → L0+3.6   aerial view of the territory (after the act wipe): the sky speeds up, cloud shadows race;
//                         drought (the fields bleach, the river thins), then a storm on « le climat » (clouds, rain,
//                         lightning, the river swells).
//         B  → L1−.3      ground level at the field edge: the price board flashes on « les prix » (arrows, no figures),
//                         the phones buzz on « les techniques », the farmers look sky / phone / sky, faster and faster
//                         on « tout bouge vite »; the camera tilts up into the sky (whoosh).
//         C  → end        aerial again: ochre decision pins drop on three fields (« chaque choix agricole »), ripples, and
//                         the indicator bubbles rise: eau · azote · carbone des sols (on the words), biomasse · gaz à
//                         effet de serre. Exit: the view closes to an ellipse, the shape of MAELIA's tabletop (→ 2.2).
(() => {
  // ================= kit shared by the Act II scenes (a2_s1 … a2_s7 are loaded in order) =================
  const K = window.A2K = window.A2K || {};
  // a phone held in a person's hand (hand hook): o.lit 0..1 = notification glow
  K.phone = (lit = 0) => (s, sw) => {
    paint(rrPts(-.6 * s, -.1 * s, 1.2 * s, 1.9 * s, .2 * s), { wash: '#2B2530', washOp: 255, ink: PAL.ink, sw: sw * .5 });
    paint(rrPts(-.47 * s, .05 * s, .94 * s, 1.55 * s, .1 * s), { wash: mixCol('#7FB2C8', '#CFF6FA', lit), washOp: 255, ink: null });
  };
  // an indicator bubble: pictogram + label (kinds: eau, azote, carbone, biomasse, ges)
  const BUB = { eau: [PAL.data, 'eau'], azote: ['#7B5CA8', 'azote'], carbone: ['#8A6246', 'carbone des sols'], biomasse: [PAL.soil, 'biomasse'], ges: ['#7D8594', 'gaz à effet de serre'] };
  K.bubbleCol = kind => BUB[kind][0];
  K.bubble = (x, y, r, k, kind, o = {}) => {
    const p = backOut(k); if (p < .03) return;
    const [col, label] = BUB[kind], rr = r * p;
    boilSeed('bub ' + kind);
    glow(x, y, rr * 1.7, col, .28 * clamp(k * 2));
    paint(ellPts(x, y, rr, rr, 24), { wash: PAL.cream, washOp: 215, ink: col, sw: 1.1 });
    inkLine([[x - rr * .62, y - rr * .38], [x - rr * .42, y - rr * .66], [x - rr * .12, y - rr * .8]], 1.3, PAL.cream, 'ink', .6);
    K.icon(kind, x, y - rr * .05, rr * .58);
    if (o.label !== false) letter(label, x, y + rr + 24 * p, 27 * p, mixCol(col, PAL.ink, .45), { weight: 600, stroke: PAL.cream, strokeW: .22 });
  };
  K.icon = (kind, x, y, r) => {
    boilSeed('icon ' + kind);
    if (kind === 'eau') paint([[x, y - r], [x + .52 * r, y + .05 * r], [x + .5 * r, y + .5 * r], [x, y + .8 * r], [x - .5 * r, y + .5 * r], [x - .52 * r, y + .05 * r]], { wash: PAL.data, washOp: 255, ink: PAL.ink, sw: .7, curv: .45 });
    else if (kind === 'azote') {
      for (const [dx, dy, rr] of [[-.42, .12, .42], [.42, -.12, .42]]) paint(ellPts(x + dx * r, y + dy * r, rr * r, rr * r, 14), { wash: '#A68BD0', washOp: 255, ink: PAL.ink, sw: .7 });
      letter('N', x - .42 * r, y + .14 * r, .5 * r, PAL.cream, { weight: 700 }); letter('N', x + .42 * r, y - .1 * r, .5 * r, PAL.cream, { weight: 700 });
    } else if (kind === 'carbone') {
      for (let i = 0; i < 3; i++) paint(rrPts(x - .8 * r, y - .2 * r + i * .36 * r, 1.6 * r, .34 * r, .08 * r), { wash: ['#A8764A', '#8A6246', '#6E4A34'][i], washOp: 255, ink: PAL.ink, sw: .5 });
      inkLine([[x, y - .2 * r], [x - .05 * r, y + .5 * r], [x + .2 * r, y + .8 * r]], 1.1, '#E9DDC4', 'inkfine', .5);
      paint(ellPts(x - .22 * r, y - .52 * r, .26 * r, .14 * r, 10, 0, -.5), { wash: PAL.sap, washOp: 255, ink: PAL.ink, sw: .5 });
      paint(ellPts(x + .22 * r, y - .52 * r, .26 * r, .14 * r, 10, 0, .5), { wash: PAL.sap, washOp: 255, ink: PAL.ink, sw: .5 });
      inkLine([[x, y - .2 * r], [x, y - .55 * r]], 1, PAL.soil, 'inkfine', 0);
    } else if (kind === 'biomasse') {
      paint([[x - .1 * r, y + .75 * r], [x - .75 * r, y - .05 * r], [x - .2 * r, y - .85 * r], [x + .7 * r, y - .8 * r], [x + .45 * r, y + .15 * r]], { wash: '#7FB35E', washOp: 255, ink: PAL.ink, sw: .7, curv: .5 });
      inkLine([[x - .15 * r, y + .7 * r], [x + .05 * r, y - .05 * r], [x + .5 * r, y - .6 * r]], 1, PAL.soil, 'inkfine', .5);
    } else {   // gaz à effet de serre: a grey cloud with wavy rising lines
      for (const [dx, dy, rr] of [[-.45, .15, .38], [0, -.15, .5], [.45, .15, .38]]) paint(ellPts(x + dx * r, y + dy * r, rr * r, rr * .85 * r, 12), { wash: '#AEB4BE', washOp: 255, ink: null });
      paint([[x - .85 * r, y + .45 * r], [x + .85 * r, y + .45 * r], [x + .8 * r, y + .15 * r], [x - .8 * r, y + .15 * r]], { wash: '#AEB4BE', washOp: 255, ink: null });
      paint([[x - .88 * r, y + .45 * r], [x - .8 * r, y - .05 * r], [x - .35 * r, y - .45 * r], [x + .2 * r, y - .62 * r], [x + .7 * r, y - .2 * r], [x + .88 * r, y + .45 * r]], { ink: PAL.ink, sw: .7, curv: .5 });
      for (const dx of [-.3, .3]) inkLine([[x + dx * r, y - .7 * r], [x + (dx + .1) * r, y - .9 * r], [x + dx * r, y - 1.1 * r]], .9, '#7D8594', 'inkfine', .6);
    }
  };
  // the territory plate's river centre line (same maths as decor.js parcels()), for overlays
  K.riverLine = (w = 2400, h = 1350) => { const R = []; for (let k = 0; k <= 12; k++) R.push([k * w / 12, h * .55 + Math.sin(k * .9) * h * .16 + Math.sin(k * 2.1) * 40]); return R; };

  // ================= plates of this scene =================
  // ground level at the edge of a field: the territory stretches to the horizon, a fence, a dirt track
  definePlate('a2s1_edge', { w: 2400, h: 1350, paint(w, h) {
    sky(w, h, [[0, '#A9CDE0'], [360, '#D6E8EC'], [680, '#F1E4C8']], 760);
    for (const [x, y, r] of [[420, 180, 90], [1500, 140, 110], [2000, 230, 70]]) blob(x, y, r, PAL.cream, 150, .2);
    const cs = ['#C6D98F', '#E3C98A', '#A9C97E', '#D9C27A', '#B5CFA3', '#C9D68A'];
    for (let k = 0; k < 6; k++) band(-40, w + 40, wave(690 + k * 26, 4 + k * 2, .004, k * 1.3), 760 + k * 30, cs[k], 150, .02, .6);
    const R = []; for (let k = 0; k <= 8; k++) R.push([k * w / 8, 745 + 14 * Math.sin(k * 1.4)]);
    paint(subdiv(ribbon(R, 8, 16), 40), { fill: '#56A6B3', fillOp: 200, bleed: .04, tex: .4, border: .3, ink: null });
    treeP(260, 715, 60); treeP(980, 722, 46, '#7FA968'); treeP(1900, 718, 64); treeP(2250, 725, 50, '#7FA968');
    for (const [x, y] of [[640, 712], [1560, 716]]) { paint(rectPts(x, y - 22, 44, 22), { wash: '#EFE3CF', washOp: 255, ink: PAL.ink, sw: .4 }); paint([[x - 4, y - 22], [x + 48, y - 22], [x + 22, y - 36]], { wash: PAL.red, washOp: 255, ink: PAL.ink, sw: .4 }); }
    // the near field: wheat
    band(-40, w + 40, wave(860, 10, .003, 2), h + 40, '#E3C27A', 230);
    for (let r = 0; r < 5; r++) { const y0 = 880 + r * 26; pen(Array.from({ length: 13 }, (_, i) => [i * w / 12, y0 + 5 * Math.sin(i * 1.3 + r)]), .45, '#B08A48', .5); }
    for (let i = 0; i < 90; i++) { const x = hash(i * 1.3) * w, y = 880 + hash(i * 2.9) * 120; pen([[x, y], [x + 3, y - 18 - hash(i) * 10]], .5, '#A67E3E', .3); }
    // fence
    for (let i = 0; i < 12; i++) { const x = 120 + i * 200; paint(rectPts(x - 7, 955, 14, 90), { wash: '#9A6E44', washOp: 255, ink: PAL.ink, sw: .6 }); }
    for (const y of [975, 1010]) paint(ribbon([[80, y], [1200, y + 4], [2340, y - 2]], 9, 9), { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: .6 });
    // grass and dirt track in the foreground
    band(-40, w + 40, wave(1040, 8, .006, 3), h + 40, '#A9CC7E', 230);
    band(-40, w + 40, wave(1150, 10, .004, 1), h + 40, '#CDB287', 220);
    for (let i = 0; i < 40; i++) { const x = hash(i + 7) * w, y = 1050 + hash(i + 31) * 80; pen([[x, y], [x + 4, y - 14]], .6, '#6E9A55', .3); pen([[x + 7, y], [x + 12, y - 11]], .5, '#6E9A55', .3); }
    for (let i = 0; i < 14; i++) { const x = hash(i * 5 + 2) * w, y = 1190 + hash(i * 3 + 1) * 140; paint(ellPts(x, y, 9 + hash(i) * 8, 5, 8), { wash: '#A8906A', washOp: 200, ink: null }); }
  } });
  // clouds: soft cream puffs cut out by their silhouette (tinted grey for the storm, dark for shadows)
  const CLOUDS = []; for (let k = 0; k < 6; k++) { const cx = 200 + k * 400 + hash(k * 3) * 120, cy = 300 + hash(k * 7) * 180, r = 110 + hash(k) * 60; CLOUDS.push([[cx, cy, r], [cx + r * .85, cy + r * .25, r * .72], [cx - r * .75, cy + r * .3, r * .62], [cx + r * .1, cy + r * .5, r * .8]]); }
  window.A2K.CLOUDS = CLOUDS;
  definePlate('a2s1_clouds', { w: 2400, h: 700, deps: [], mask(c) { for (const C of window.A2K.CLOUDS) for (const [x, y, r] of C) { c.beginPath(); c.ellipse(x, y, r, r * .8, 0, 0, TAU); c.fill(); } }, paint(w, h) {
    for (const C of window.A2K.CLOUDS) {
      for (const [x, y, r] of C) paint(ellPts(x, y, r + 4, r * .8 + 4, 22), { wash: '#F6F3EC', washOp: 255, fill: '#E6E8EC', fillOp: 90, bleed: .05, tex: .5, border: .4, ink: null });
      const [x, y, r] = C[3]; blob(x, y + r * .35, r * .9, '#C4CCD6', 150, .15);
      const [x0, y0, r0] = C[0]; blob(x0 - r0 * .25, y0 - r0 * .3, r0 * .5, '#FFFFFF', 140, .15);
    }
  } });
  // rain streaks (tiled)
  definePlate('a2s1_rain', { w: 900, h: 900, c2a: true, paint(w, h) {
    for (let i = 0; i < 110; i++) { const x = hash(i * 1.7) * w, y = hash(i * 4.3) * h, l = 40 + hash(i + 3) * 50; pen([[x, y], [x - l * .28, y + l]], .55 + hash(i) * .4, '#6F8FAF', 0); }
  } });

  // ================= helpers =================
  const RIV = through(K.riverLine(), 6);
  const RIVW = i => lerp(70, 90, i / (RIV.length - 1));
  function riverState(dry, flood) {           // dry 0..1 thins the water to a thread; flood 0..1 swells it muddy
    if (dry < .02 && flood < .02) return;
    boilSeed('river');
    if (dry > .02) {
      paint(ribbon(RIV.filter((_, i) => i % 3 === 0), 98, 118), { wash: mixCol('#C9BE92', '#D9C58E', dry), washOp: 215 * clamp(dry * 2), ink: null });
      paint(ribbon(RIV.filter((_, i) => i % 3 === 0), lerp(80, 14, ease(dry)), lerp(98, 20, ease(dry))), { wash: '#56A6B3', washOp: 190 * clamp(dry * 2), ink: null });
    }
    if (flood > .02) paint(ribbon(RIV.filter((_, i) => i % 3 === 0), lerp(76, 150, ease(flood)), lerp(94, 170, ease(flood))), { wash: mixCol('#56A6B3', '#8A9A86', .45), washOp: 230 * flood, ink: null });
  }
  function cloudLayer(x, y, s, a, tintCol) {   // the cloud plate, tinted and faded
    if (a < .02) return;
    const c = color(tintCol || '#FFFFFF'); c.setAlpha(255 * clamp(a));
    const pw = 2400 * s, x0 = ((x % pw) + pw) % pw - pw;
    for (let xx = x0; xx < 2500; xx += pw) drawPlate('a2s1_clouds', xx, y, { s, tint: c });
  }
  function rain(a, t, x0, y0, w, h) {
    if (a < .02) return;
    const c = color('#FFFFFF'); c.setAlpha(255 * a);
    const off = (t * 1100) % 900, offx = (t * 300) % 900;
    for (let i = -1; i <= Math.ceil(w / 900); i++) for (let j = -1; j <= Math.ceil(h / 900); j++) drawPlate('a2s1_rain', x0 + i * 900 - offx + 300, y0 + j * 900 + off - 900, { tint: c });
  }
  function bolt(x0, y0, x1, y1, seed, k) {    // a lightning bolt, jagged, drawn quickly then gone
    if (k <= 0 || k >= 1) return;
    boilSeed('bolt' + seed);
    const P = []; for (let i = 0; i <= 7; i++) P.push([lerp(x0, x1, i / 7) + (i && i < 7 ? (hash(seed * 9 + i) - .5) * 90 : 0), lerp(y0, y1, i / 7)]);
    const a = 1 - k;
    glow(lerp(x0, x1, .4), lerp(y0, y1, .4), 420, '#FFF3C8', .7 * a);
    for (let i = 1; i < 7; i += 2) glow(P[i][0], P[i][1], 90, '#FFF6D8', .8 * a);
    paint(ribbon(P, 16, 5), { wash: '#FFF8E0', washOp: 255 * a, ink: null });
  }
  // price board on a post: a price curve and arrows that flash, no figures (none in the V2)
  function priceBoard(x, y, st, k, t0) {
    const p = backOut(k); if (p < .02) return;
    boilSeed('board');
    push(); translate(x, y); scale(p);
    paint(rectPts(-8, 60, 16, 190), { wash: '#6E6A72', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(-150, -90, 300, 170, 14), { wash: '#2B2E3A', washOp: 255, ink: PAL.ink, sw: 1.2 });
    const age = st - t0, ph = Math.floor(age * 5) % 2;
    // zig-zag price line, redrawn as it jitters
    const P = []; for (let i = 0; i < 9; i++) P.push([-120 + i * 24, 20 - 50 * Math.sin(i * 1.7 + Math.floor(age * 4) * 1.3) * (i % 2 ? 1 : .6)]);
    inkLine(P, 1.8, ph ? '#F2C14E' : '#8FD694', 'ink', 0);
    // flashing arrows
    const up = ph === 0;
    if (up) paint([[92, -58], [122, -18], [104, -18], [104, 20], [80, 20], [80, -18], [62, -18]], { wash: '#8FD694', washOp: 255, ink: null });
    else paint([[92, 20], [122, -20], [104, -20], [104, -58], [80, -58], [80, -20], [62, -20]], { wash: '#F08A7A', washOp: 255, ink: null });
    pop();
    letter('€', x - 104 * p, y - 58 * p, 34 * p, '#F2C14E', { weight: 700 });
    glow(x + 92 * p, y - 20 * p, 70 * p, ph ? '#F08A7A' : '#8FD694', .5);
  }
  function decisionPin(x, y, k) {             // an ochre pin dropping onto a field (a choice)
    if (k <= 0) return;
    const f = easeIn(seg(k, 0, .5)), yy = lerp(y - 260, y, f), sq = k > .5 ? spring(k * 2, 1, 5, 20) * .25 : 0;
    boilSeed('pin' + Math.round(x));
    if (k > .5) { const rk = seg(k, .5, 1); paint(ellPts(x, y + 4, 70 * rk + 10, 34 * rk + 5, 20), { ink: PAL.ochre, sw: 1.4 * (1 - rk) + .2 }); }
    paint(ellPts(x, y + 6, 14, 6, 10), { wash: PAL.ink, washOp: 60 * f, ink: null });
    push(); translate(x, yy); scale(1 + sq, 1 - sq);
    inkLine([[0, 0], [0, -34]], 2, PAL.ink, 'ink', 0);
    paint(ellPts(0, -44, 16, 16, 14), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(ellPts(-5, -49, 5, 5, 8), { wash: PAL.cream, washOp: 255, ink: null });
    pop();
  }
  // tint the whole world (camera space) with a flat wash
  const veil = (col, a, key) => { if (a < .01) return; boilSeed('veil' + key); paint(rectPts(-60, -60, 2520, 1470), { wash: col, washOp: 255 * a, ink: null }); };

  // the three farmers at the fence (ground shot) and their gaze sequence
  const FARMERS = [
    { x: 680, preset: ACTEURS.agricultrice, key: 'f1', view: 'q', ph: 0 },
    { x: 960, preset: ACTEURS.eleveur, key: 'f2', view: 'front', ph: .08 },
    { x: 1240, preset: { ...ACTEURS.agricultrice, hat: null, hairStyle: 'bun', hair: '#2A1E22', skin: SKIN.c, shirt: '#3E7C4A', shirtDk: '#2F6139', pants: '#8A6246', pantsDk: '#6E4A34' }, key: 'f3', view: 'q', flip: true, ph: .14 },
  ];

  // ================= shot A: the territory from the sky, weather in fast-forward =================
  function aerial(t, lt, dur, S, st) {
    const L = i => S.cue(i);
    const clim = L(0) + 2.66, dryA = .9, dryB = clim - .25, storm0 = clim - .35;
    const dry = ease(seg(st, dryA, dryB)) * (1 - ease(seg(st, clim + .1, clim + .6)));
    const storm = ease(seg(st, storm0, clim + .2));
    const flood = ease(seg(st, clim + .3, clim + 1.0));
    camBegin(kf(st, [[0, 1180], [4, 1260]]), kf(st, [[0, 640], [4, 690]]), kf(st, [[0, 1.02], [4, 1.1]]));
    drawPlate('territory', 0, 0);
    riverState(dry, flood);
    veil('#F2C66A', .28 * dry, 'heat');                                    // the fields bleach in the drought
    // the sun's hot glare during the drought
    glow(1900, 250, 700 * dry, '#FFE9A8', .5 * dry);
    // cloud shadows racing over the fields (the sky accelerates): 2 passes, faster and faster
    const cs = st * st * 60;
    cloudLayer(-2400 + (cs + 900) % 4800, 380, 1.4, .3 * (1 - dry) * (1 - storm), '#39445A');
    cloudLayer(-2400 + (cs * 1.6 + 2600) % 4800, 180, 1.1, .22 * (1 - dry) * (1 - storm), '#39445A');
    cloudLayer(-2400 + (cs * 1.3 + 300) % 4800, 60, 1.2, .75 * (1 - seg(st, 0, dryA + .3)), '#FFFFFF');   // puffs racing past
    // storm: dark cloud tops sweep in from the left, rain, lightning
    const sweep = ease(seg(st, storm0 - .3, clim + .9));
    veil('#2F3C52', .32 * storm, 'dark');
    cloudLayer(lerp(-1500, -500, sweep) + st * 60, 120, 1.45, .95 * storm, '#6E7A8E');
    cloudLayer(lerp(-1900, -900, sweep) + st * 80, 620, 1.3, .8 * storm, '#58657A');
    camEnd();
    rain(.75 * storm, st, 0, 0, W, H);
    for (const [tb, x0, x1, sd] of [[clim + .05, 760, 900, 1], [clim + .55, 1300, 1180, 2]]) { const k = seg(st, tb, tb + .22); if (k > 0 && k < 1) { flash(.55 * (1 - k), '#FFF6DE'); bolt(x0, -20, x1, 640, sd, k); } }
  }

  // ================= shot B: at the field edge — sky, phone, sky =================
  function edge(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const t0 = S.shots[1][0], prix = L(0) + 3.64, tech = L(0) + 4.5, vite = L(0) + 5.5, out = L(1) - .3;
    const tilt = ease(seg(st, out - 1.0, out));
    camBegin(1000 + lt * 14, 800 - 300 * tilt, 1.5 + .02 * lt);
    drawPlate('a2s1_edge', 0, 0);
    // the sky keeps racing: the storm moves off, clouds stream by fast; light flickers day / grey
    const clear = ease(seg(st, t0, t0 + 1.2)), fl = .5 + .5 * Math.sin(st * 9);
    boilSeed('skyveil'); paint(rectPts(-60, -60, 2520, 790), { wash: '#56627A', washOp: 255 * (.45 * (1 - clear) + .12 * fl * clear), ink: null });
    cloudLayer((st - t0) * 500 - 1800, 20, 1.0, .85, mixCol('#6E7A8E', '#FFFFFF', clear));
    cloudLayer((st - t0) * 700 - 600, 180, .8, .7, mixCol('#58657A', '#F4F1EA', clear));
    // price board (left)
    priceBoard(1500, 840, st, seg(st, prix - .3, prix + .1), prix);
    // the farmers: the phones buzz on « les techniques »; then sky / phone / sky, faster and faster
    const beats = [[t0, 'sky'], [tech, 'phone'], [vite - .1, 'sky'], [vite + .35, 'phone'], [vite + .62, 'sky'], [vite + .85, 'phone'], [vite + 1.05, 'sky'], [vite + 1.25, 'phone'], [vite + 1.45, 'sky']];
    FARMERS.forEach((F, i) => {
      const lt2 = st - F.ph * (st > vite ? .3 : 1);
      let bi = 0; while (bi + 1 < beats.length && lt2 >= beats[bi + 1][0]) bi++;
      const look = beats[bi][1], age = lt2 - beats[bi][0], snap = backOut(seg(age, 0, .16));
      const dizzy = st > vite + 1.6;
      const phoneUp = look === 'phone' ? snap : 1 - snap;
      const lit = seg(st, tech - .15, tech) * (1 - seg(st, tech + .5, tech + .9));
      const ex = look === 'sky' ? (st < prix ? 'inquiete' : 'surprise') : 'concentree';
      const P = { ...feelP(dizzy ? 'soupir' : ex, st), view: F.view, flip: F.flip, lookY: look === 'sky' ? -1 : .9, lookX: look === 'sky' ? (F.flip ? .3 : -.3) : .2,
        ['a' + (F.flip ? 'L' : 'R')]: lerp(.15, .55, phoneUp), ['e' + (F.flip ? 'L' : 'R')]: lerp(-.1, -2.05, phoneUp), ['hand' + (F.flip ? 'L' : 'R')]: K.phone(lit),
        headTilt: (look === 'sky' ? -.06 : .08) * (F.flip ? -1 : 1), take: look === 'sky' && age < .2 ? -.05 : 0, sq: take(lt2, beats[bi][0], .4).sq };
      if (dizzy) P.dy = -.05 * Math.sin(st * 8 + i);
      person(F.x, 1100, 19, { ...P, preset: F.preset, boilKey: F.key, seed: i + 2 });
      if (dizzy) sfx('?!', F.x + 30, 845 - (i % 2) * 20, 38, PAL.night, st - vite - 1.6, { life: .9 });
    });
    // phone notification ping marks
    const pk = st - tech; if (pk > 0 && pk < .7) FARMERS.forEach((F, i) => { boilSeed('ping' + i); const r = 20 + pk * 60; paint(ellPts(F.x + (F.flip ? -25 : 25), 1000, r, r, 16), { ink: PAL.data, sw: 1.4 * (1 - pk / .7) + .1 }); });
    camEnd();
  }

  // ================= shot C: choices and their effects — the indicator bubbles =================
  const PINS = [[880, 330], [1480, 380], [1150, 900]];
  const BUBS = [   // kind, source (world), destination (world), cue offset from L1
    ['eau', [1320, 820], [1000, 470], 2.2],
    ['azote', [880, 330], [740, 560], 3.02],
    ['carbone', [1150, 900], [1330, 650], 3.84],
    ['biomasse', [1480, 380], [1590, 520], 4.55],
    ['ges', [1700, 760], [1780, 740], 5.0],
  ];
  function effects(t, lt, dur, S, st) {
    const L = i => S.cue(i), l1 = L(1), close0 = S.dur - 1.15;
    const z = kf(st, [[l1 - .3, 1.18], [S.dur, 1.3]]);
    camBegin(kf(st, [[l1 - .3, 1240], [S.dur, 1260]]), kf(st, [[l1 - .3, 560], [S.dur, 620]]) + 60 * easeOut(1 - seg(lt, 0, .6)), z);
    drawPlate('territory', 0, 0);
    // the fields a choice changes: a new crop colour washes over, row lines
    PINS.forEach(([x, y], i) => {
      const k = seg(st, l1 + .15 + i * .4, l1 + .55 + i * .4);
      decisionPin(x, y, k);
      const ck = seg(st, l1 + .45 + i * .4, l1 + .8 + i * .4);
      if (ck > 0) { boilSeed('crop' + i); paint(ellPts(x, y + 4, 90 * ease(ck), 70 * ease(ck), 18), { wash: ['#86B06A', '#E8D39A', '#9DC07B'][i], washOp: 150 * ck, ink: null }); }
    });
    // effect ripples from the sources, then the bubbles float up and bob
    for (const [kind, src, dst, off] of BUBS) {
      const tb = l1 + off, k = seg(st, tb - .35, tb + .25), m = ease(seg(st, tb - .35, tb + .45));
      if (st > tb - .5 && st < tb + .5) { boilSeed('rip' + kind); const rk = seg(st, tb - .5, tb + .5); paint(ellPts(src[0], src[1], 20 + 90 * rk, 12 + 50 * rk, 18), { ink: K.bubbleCol(kind), sw: 1.6 * (1 - rk) + .2 }); }
      if (k <= 0) continue;
      const bob = Math.sin(st * 2.2 + off * 3) * 10 * m;
      const x = lerp(src[0], dst[0], m), y = lerp(src[1], dst[1], m) + bob;
      inkLine([[src[0], src[1]], [lerp(src[0], x, .5) + 10, lerp(src[1], y, .5)], [x, y]], .7, mixCol(K.bubbleCol(kind), PAL.cream, .3), 'inkfine', .5);
      K.bubble(x, y, 56, k, kind);
    }
    camEnd();
    // exit: the frame closes to an ellipse — MAELIA's tabletop in 2.2's first frame
    const ck = ease(seg(st, close0, S.dur - .1));
    if (ck > 0) { const E0 = K.MAQ_E; irisShape(ellPts(E0[0], E0[1], lerp(1500, E0[2], ck), lerp(1500 * E0[3] / E0[2], E0[3], ck), 44), K.MAQ_BG); }
  }
  // 2.2 opens on this exact ellipse (screen space) and colour
  K.MAQ_E = [960, 520, 820, 389]; K.MAQ_BG = '#D2E5EA';

  scene('2.1', S => [[0, aerial], [S.cue(0) + 3.6, edge], [S.cue(1) - .3, effects]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), clim = L(0) + 2.66, prix = L(0) + 3.64, tech = L(0) + 4.5, vite = L(0) + 5.5, l1 = L(1);
      const out = [[.5, 'whoosh', .06], [1.2, 'whoosh', .07], [clim - .3, 'rustle', .1], [clim + .05, 'thud', .3], [clim + .55, 'thud', .22], [clim + .3, 'rustle', .12],
        [L(0) + 3.6, 'whoosh', .08], [prix, 'bip2', .07, -.5], [prix + .4, 'bip', .06, -.5], [tech, 'ding', .06], [tech + .05, 'ding', .05, .3], [tech + .1, 'ding', .05, -.3],
        [vite - .1, 'whoosh', .05], [vite + .35, 'whoosh', .05], [vite + .62, 'whoosh', .05], [vite + .85, 'whoosh', .05], [vite + 1.05, 'whoosh', .05], [vite + 1.25, 'whoosh', .05],
        [l1 - .6, 'whoosh', .12]];
      for (let i = 0; i < 3; i++) out.push([l1 + .15 + i * .4 + .2, 'thud', .12]);
      for (const [, , , off] of BUBS) out.push([l1 + off - .1, 'bloop', .1]);
      out.push([S.dur - 1.1, 'whoosh', .08]);
      return out;
    });
})();
