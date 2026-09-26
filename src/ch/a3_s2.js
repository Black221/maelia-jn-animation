// scène 3.2 — Île RQ2 : la vallée des artisans des données (V2 § 4, acte III).
// Lines: L0 « Deuxième île : les méthodes pour faire entrer les données existent. » · L1 « En agriculture, on les
//        utilise surtout pour recaler des modèles de culture grâce aux satellites. » · L2 « Mais pour les modèles
//        multi-agents comme MAELIA, les meilleurs artisans travaillent… ailleurs : » · L3 « sur les foules, les
//        épidémies, la finance. »
// One travelling shot on the valley plate (3000 px wide):
//   0 → L1   the clouds of 3.1 clear on the valley; four workshops by a cyan river of data, each at work, names
//            written on their boards: nuées (Kalman d'ensemble: a flock of model copies tightens around an
//            observation), lucioles (filtre particulaire: weighted fireflies, some go out, others split), luthier
//            (recalage bayésien, ABC, MCMC: pegs are tuned, the tuner needle settles), engrenages (règles et
//            paramétrage: simple, solid gears)
//   L1       truck right to the signpost « Agriculture → »: a satellite scans a crop plot, the crop model's gauge is
//            re-set (recalage) — Awa and Jumo watch
//   L2       Jumo projects a little MAELIA; Awa looks back at the workshops… « ailleurs » — the upper board
//            « Foules, épidémies, finance → » lights up
//   L3       tilt up to the far town across the river: a crowd, an epidemic curve, a finance chart, with the flock and
//            the fireflies at work over them
//   end      back on Awa (determined); Jumo flies into the lens and his blue body fills the frame (→ 3.3 opens on it)
(() => {
  const PW = 3000;
  const HUTS = [280, 780, 1280, 1780], HB = 660;          // workshop centres, base line (far bank)
  const NAMES = [['L’atelier des nuées', '(Kalman d’ensemble)'], ['L’atelier des lucioles', '(filtre particulaire)'],
                 ['L’atelier du luthier', '(recalage bayésien, ABC, MCMC)'], ['L’atelier des engrenages', '(règles et paramétrage)']];
  const RIVER = [[-40, 770], [400, 745], [900, 790], [1400, 760], [1900, 790], [2400, 770], [3040, 790]];
  const POST = { x: 2170, y: 960 };
  const TOWN = { x: 2560, y: 450 };
  const FIELD = { x: 2690, y: 985 };                        // the scanned crop plot
  const GAUGE = { x: 2520, y: 930 };

  function hutP(x, i) {
    const roof = ['#B7563F', '#6E7FA8', '#8A6246', '#5E8C4E'][i];
    area([[x - 170, HB], [x - 170, HB - 210], [x + 170, HB - 210], [x + 170, HB]], '#E3C9A0', '#CDAE82', 100);
    paint([[x - 128, HB], [x - 128, HB - 150], [x + 128, HB - 150], [x + 128, HB]], { wash: '#6A5040', washOp: 255, fill: '#5A4034', fillOp: 100, bleed: .02, tex: .5, border: .5, ink: PAL.ink, sw: .8 });
    paint([[x - 200, HB - 200], [x + 200, HB - 200], [x + 120, HB - 300], [x - 120, HB - 300]], { wash: roof, washOp: 255, fill: mixCol(roof, PAL.ink, .2), fillOp: 100, bleed: .02, tex: .6, border: .45, ink: PAL.ink, sw: .9 });
    for (let k = 1; k < 5; k++) pen([[x - 200 + k * 80, HB - 200], [x - 120 + k * 48, HB - 300]], .5, mixCol(roof, PAL.ink, .45), 0);
    paint([[x - 170, HB], [x - 170, HB - 210], [x + 170, HB - 210], [x + 170, HB]], { ink: PAL.ink, sw: .9 });
    paint(rrPts(x - 175, HB - 272, 350, 84, 10), { wash: '#F6E8C8', washOp: 255, fill: '#EAD3A8', fillOp: 70, bleed: .02, tex: .4, border: .4, ink: PAL.ink, sw: .9 });   // name board
    paint(rectPts(x - 150, HB - 12, 300, 12), { wash: '#9A7A5A', washOp: 255, ink: PAL.ink, sw: .6 });                                                          // workbench edge
  }
  definePlate('a3s2_valley', { w: PW, h: 1350, paint(w, h) {
    sky(w, h, [[0, '#94CEDA'], [250, '#C4E6E6'], [430, '#E8F1E2']], 480);
    for (const [x, y, r] of [[300, 120, 80], [450, 150, 60], [1300, 90, 90], [2000, 150, 70], [2800, 110, 80]]) { blob(x, y, r, '#FFF8EE', 190, .18); blob(x + r * .7, y + r * .2, r * .7, '#F6F1E8', 160, .18); }
    band(-40, w + 40, wave(420, 20, .003, 1), h + 40, '#BFD9B8', 200);                  // far hills
    // the far town's hill (right)
    area([[2180, 620], [2330, 470], [2520, 380], [2780, 360], [3040, 380], [3040, 640]], '#AFCB9C', null, 110);
    for (let k = 0; k < 11; k++) { const x = 2380 + k * 58 + (k % 3) * 10, y = 470 - Math.sin(k / 10 * Math.PI) * 60 + (k % 2) * 18; paint(rectPts(x, y - 26, 38, 26), { wash: '#F1E4CC', washOp: 255, ink: PAL.ink, sw: .5 }); paint([[x - 4, y - 26], [x + 42, y - 26], [x + 19, y - 44]], { wash: ['#C8553D', '#6E7FA8', '#B98A57'][k % 3], washOp: 255, ink: PAL.ink, sw: .5 }); }
    paint(rectPts(2640, 300, 26, 84), { wash: '#E9D6B8', washOp: 255, ink: PAL.ink, sw: .6 }); paint([[2634, 300], [2672, 300], [2653, 270]], { wash: '#6E7FA8', washOp: 255, ink: PAL.ink, sw: .6 });
    band(-40, 2300, wave(540, 14, .004, 2), h + 40, '#B3D39A', 230);                    // far bank meadow
    band(2200, w + 40, wave(600, 10, .004, 3), h + 40, '#B3D39A', 230);
    for (let k = 0; k < 18; k++) blob(80 + k * 130 + hash(k) * 40, 560 + hash(k * 3) * 40, 26 + hash(k + 1) * 16, '#86B06A', 200, .1);
    HUTS.forEach(hutP);
    // the river of data (cyan)
    paint(subdiv(ribbon(RIVER, 120, 130), 40), { wash: '#6FD3E0', washOp: 255, fill: '#3BC4D8', fillOp: 150, bleed: .03, tex: .5, border: .45, ink: null });
    pen(RIVER.map(([x, y]) => [x, y - 60]), .8, '#2F8F9A'); pen(RIVER.map(([x, y]) => [x, y + 64]), .8, '#2F8F9A');
    for (let i = 0; i < 40; i++) { const x = hash(i * 2.1) * w, y = 745 + hash(i * 3.3) * 60 + 20 * Math.sin(x * .004); pen([[x, y], [x + 30, y - 2], [x + 56, y]], .6, '#D8F7FA', .5); }
    // near bank, path, crop fields on the right
    band(-40, w + 40, wave(840, 8, .004, 5), h + 40, '#A9CC7E', 230);
    paint(subdiv(ribbon([[-40, 975], [700, 960], [1400, 985], [2100, 965], [2500, 1060], [3040, 1250]], 70, 90), 40), { wash: '#E6D3A8', washOp: 255, fill: '#D8C08E', fillOp: 90, bleed: .02, tex: .5, border: .4, ink: null });
    const cs = ['#C9D98A', '#E3C98A', '#9DC07B', '#D9B872', '#B4CF84'];
    for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) {
      const x0 = 2390 + i * 200 + j * 30, y0 = 880 + j * 60, P = [[x0, y0], [x0 + 190, y0 - 4], [x0 + 205, y0 + 54], [x0 + 12, y0 + 58]];
      if (j >= 2 && i === 0) continue;
      area(P, cs[(i * 2 + j) % 5], null, 110, .03);
      for (let r = 1; r < 5; r++) pen([[P[0][0] + 6 + r * 2, lerp(P[0][1], P[3][1], r / 5)], [P[1][0] - 4 + r * 2, lerp(P[1][1], P[2][1], r / 5)]], .4, mixCol(cs[(i * 2 + j) % 5], PAL.ink, .35), .1);
    }
    for (let i = 0; i < 70; i++) { const x = hash(i + 7) * 2300, y = 1040 + hash(i + 60) * 290, l = 12 + hash(i + 9) * 18; pen([[x, y], [x + 4, y - l]], .6, '#6E9A55', .3); }
    treeP(120, 900, 150, '#6E9A55'); treeP(2060, 880, 120, '#7FA968');
  } });

  // the workshop names on their boards (also used by 3.3, which plays in the same valley)
  A3.valleyNames = (k = () => 1) => HUTS.forEach((x, i) => {
    if (!A3.vis(x, HB - 230, 250)) return;
    const p = backOut(k(i));
    letter(NAMES[i][0], x, HB - 244, 31 * p, PAL.night, { weight: 700, maxW: 330 });
    letter(NAMES[i][1], x, HB - 212, 23 * p, '#5A4034', { weight: 600, maxW: 330 });
  });
  A3.gears = (x, y, st) => engrenages(x, y, st);
  // ---------------- the four workshops, at work (pure functions of st) ----------------
  function nuees(x, y, st, s = 1) {             // ensemble Kalman: model copies spread (forecast), then tighten (analysis)
    const per = 2.4, c = Math.floor(st / per), ph = frac(st / per);
    const obs = [x + 30 * Math.sin(c * 1.7), y + 16 * Math.cos(c * 2.3)];
    const R = ph < .78 ? lerp(38, 128, ease(ph / .78)) : lerp(128, 38, ease((ph - .78) / .22));
    boilSeed('nuee obs'); paint(starPts(obs[0], obs[1], 16 * s, .45, 5), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 });
    const P = [];
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + st * .6 + hash(i) * .8, rr = R * s * (.55 + .45 * hash(i * 3.3));
      const bx = obs[0] + Math.cos(a) * rr * 1.25, by = obs[1] + Math.sin(a) * rr * .7, f = Math.sin(st * 14 + i) * 6 * s;
      boilSeed('bird' + i);
      inkLine([[bx - 11 * s, by - 4 * s + f], [bx, by + 3 * s], [bx + 11 * s, by - 4 * s + f]], 1.6 * s, i % 3 ? PAL.night : '#2F8F9A', 'ink', .3);
      P.push([bx, by]);
    }
    if (ph > .8) glow(obs[0], obs[1], 70 * s, PAL.ochre, .7 * Math.sin((ph - .8) / .2 * Math.PI));
    return P;
  }
  function lucioles(x, y, st, s = 1) {         // particle filter: weighted fireflies; the weak go out, the strong split
    const per = 2.6, c = Math.floor(st / per), ph = frac(st / per);
    const obsAt = k => [x + 44 * Math.sin(k * 1.3 + 1), y + 20 * Math.cos(k * 1.9)];
    let P = Array.from({ length: 14 }, (_, i) => [x + (hash(i * 4.1) - .5) * 240, y + (hash(i * 6.7) - .5) * 120]);
    const step = (Q, k) => {                     // forecast drift, then resample
      const D = Q.map(([a, b], i) => [a + (hash(k * 31 + i) - .5) * 70, b + (hash(k * 17 + i * 3) - .5) * 40]);
      const o = obsAt(k), d = D.map(([a, b]) => Math.hypot(a - o[0], (b - o[1]) * 1.6)), ord = d.map((v, i) => i).sort((i, j) => d[i] - d[j]);
      return { D, keep: ord.slice(0, 10), split: ord.slice(0, 4), dead: ord.slice(10) };
    };
    for (let k = 0; k < c; k++) { const r = step(P, k); P = [...r.keep.map(i => r.D[i]), ...r.split.map((i, j) => [r.D[i][0] + 26 * Math.cos(j * 1.9), r.D[i][1] + 16 * Math.sin(j * 1.9)])]; }
    const r = step(P, c), o = obsAt(c), drift = ease(seg(ph, 0, .45));
    boilSeed('luc obs'); paint(starPts(o[0], o[1], 14 * s, .45, 5), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 });
    const L = [];                                // [x, y, brightness]
    r.D.forEach((p, i) => {
      const q = [lerp(P[i][0], p[0], drift), lerp(P[i][1], p[1], drift)];
      let b = 1;
      if (r.dead.includes(i)) b = 1 - seg(ph, .5, .72);
      L.push([q[0], q[1], b, i]);
      const sj = r.split.indexOf(i);
      if (sj >= 0 && ph > .72) { const k = ease(seg(ph, .72, 1)); L.push([q[0] + 26 * Math.cos(sj * 1.9) * k, q[1] + 16 * Math.sin(sj * 1.9) * k, seg(ph, .72, .8), 'c' + i]); }
    });
    for (const [a, b, br, i] of L) if (br > .02) { boilSeed('fly' + i); paint(ellPts(a, b, 5 * s, 5 * s, 8), { wash: mixCol('#6A7A3A', '#F4F7A0', br), washOp: 255, ink: null }); }
    for (const [a, b, br] of L) if (br > .05) glow(a, b, 30 * s, '#E9F58A', .75 * br);
  }
  function luthier(x, y, st, s = 1) {          // Bayesian calibration: pegs are tuned, the needle settles on the note
    const per = 3.0, c = Math.floor(st / per), ph = frac(st / per);
    boilSeed('lute');
    push(); translate(x - 50, y + 60); rotate(-.55); scale(.72);
    paint(ellPts(0, 40, 62, 52, 22), { wash: '#C98A4A', washOp: 255, ink: PAL.ink, sw: .9 });
    paint(ellPts(0, 40, 18, 18, 12), { wash: '#5A3A2A', washOp: 255, ink: null });
    paint(rectPts(-10, -150, 20, 150), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(-20, -200, 40, 54, 8), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .8 });
    for (let k = 0; k < 3; k++) {
      const turn = (k === c % 3 && ph < .6) ? Math.cos(st * 18) : 1;
      paint(ellPts(-26, -190 + k * 18, 8 * Math.abs(turn) + 2, 6, 8), { wash: '#F3D27A', washOp: 255, ink: PAL.ink, sw: .5 });
      paint(ellPts(26, -190 + k * 18, 8, 6, 8), { wash: '#F3D27A', washOp: 255, ink: PAL.ink, sw: .5 });
    }
    for (let k = -1; k <= 1; k++) { const v = Math.sin(st * 40 + k) * 2.4 * (1 - ph); inkLine([[k * 6, 70], [k * 6 + v, -40], [k * 5, -150]], .6, PAL.cream, 'inkfine', .4); }
    pop();
    // the tuner: a dial whose needle wobbles less and less, then settles on the mark
    const tx = x + 90, ty = y - 30;
    boilSeed('tuner');
    paint(rrPts(tx - 58, ty - 50, 116, 82, 12), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .8 });
    for (let k = -3; k <= 3; k++) { const a = -Math.PI / 2 + k * .32; inkLine([[tx + Math.cos(a) * 36, ty + 16 + Math.sin(a) * 36], [tx + Math.cos(a) * 44, ty + 16 + Math.sin(a) * 44]], k ? .6 : 1.4, k ? PAL.ink : PAL.soil, 'inkfine', 0); }
    const off = (1 - ease(seg(ph, 0, .7))) * .9 * Math.sin(st * 7) + (1 - ease(seg(ph, 0, .7))) * .5 * (hash(c) - .5), a = -Math.PI / 2 + off;
    inkLine([[tx, ty + 16], [tx + Math.cos(a) * 40, ty + 16 + Math.sin(a) * 40]], 1.4, PAL.red, 'ink', 0);
    paint(ellPts(tx, ty + 16, 5, 5, 8), { wash: PAL.ink, washOp: 255, ink: null });
    if (ph > .72 && ph < .95) { boilSeed('note' + c); const k = seg(ph, .72, .95); letter('♪', tx + 40 + 20 * k, ty - 60 - 40 * k, 34, PAL.soil, { alpha: 1 - k, font: '"DejaVu Sans", sans-serif' }); }
  }
  function gear(x, y, r, n, a, col) {
    const P = []; for (let i = 0; i < n * 4; i++) { const t = i / (n * 4) * TAU + a, rr = (i % 4 < 2) ? r : r * .8; P.push([x + Math.cos(t) * rr, y + Math.sin(t) * rr]); }
    paint(P, { wash: col, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(ellPts(x, y, r * .28, r * .28, 12), { wash: '#5A4A3A', washOp: 255, ink: PAL.ink, sw: .6 });
  }
  function engrenages(x, y, st) {              // rules and plain parameter setting: simple, solid gears
    boilSeed('gears');
    const w = st * .9;
    gear(x - 70, y + 10, 62, 10, w, '#B8B2A6');
    gear(x + 32, y - 36, 44, 7, -w * 62 / 44 + .2, '#D9B25A');
    gear(x + 60, y + 60, 38, 6, -w * 62 / 38 + .4, '#A7C27A');
  }
  function satellite(x, y, rot) {
    boilSeed('sat');
    push(); translate(x, y); rotate(rot);
    for (const sd of [-1, 1]) { paint(rectPts(sd > 0 ? 34 : -104, -18, 70, 36), { wash: '#3E5F8A', washOp: 255, ink: PAL.ink, sw: .7 }); for (let k = 1; k < 4; k++) inkLine([[(sd > 0 ? 34 : -104) + k * 17.5, -18], [(sd > 0 ? 34 : -104) + k * 17.5, 18]], .5, '#9DB6D0', 'inkfine', 0); inkLine([[sd * 22, 0], [sd * 34, 0]], 1.2, PAL.ink, 'ink', 0); }
    paint(rrPts(-22, -26, 44, 52, 8), { wash: '#E8E2D6', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(ellPts(0, 34, 14, 7, 10), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .6 });
    pop();
  }
  function signBoard(x, y, w, txt, k, rot, lit, key) {   // an arrow-shaped board on the signpost
    boilSeed('sb' + key);
    push(); translate(x, y); rotate(rot);
    const h = 58, P = [[-w / 2, -h / 2], [w / 2 - 24, -h / 2], [w / 2 + 10, 0], [w / 2 - 24, h / 2], [-w / 2, h / 2]];
    paint(P, { wash: mixCol('#F3E3C3', '#FFE9A8', lit), washOp: 255, ink: PAL.ink, sw: .9 });
    pop();
    if (lit > .05) glow(x, y, w * .6, '#FFE08A', .35 * lit);
    letter(txt, x - 8, y + 1, 27, PAL.night, { rot, weight: 600, maxW: w - 40 });
  }
  function crowd(x, y, st, k) {                // the town square: many little people milling about
    if (k <= .02) return;
    for (let i = 0; i < 26; i++) {
      const a = hash(i * 2.7) * TAU, r = 20 + hash(i * 1.9) * 80, px = x + Math.cos(a + st * .3 * (hash(i) - .5)) * r * 1.4, py = y + Math.sin(a) * r * .35 + Math.sin(st * 6 + i) * 1.5;
      boilSeed('crowd' + i); const p = backOut(clamp(k * 3 - i / 13));
      if (p < .05) continue;
      paint(rrPts(px - 5 * p, py - 14 * p, 10 * p, 14 * p, 3), { wash: [PAL.red, PAL.ochre, PAL.night, PAL.soil, '#7B5CA8'][i % 5], washOp: 255, ink: null });
      paint(ellPts(px, py - 19 * p, 4.5 * p, 4.5 * p, 8), { wash: SKIN[['a', 'b', 'c', 'd'][i % 4]], washOp: 255, ink: null });
    }
  }
  function epiBoard(x, y, st, k) {             // an epidemic curve that rises and falls, a virus icon
    if (k <= .02) return;
    const p = backOut(k);
    boilSeed('epi');
    push(); translate(x, y); scale(p);
    paint(rrPts(-95, -70, 190, 130, 10), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9 });
    inkLine([[-75, 40], [-75, -55]], .7, PAL.ink, 'inkfine', 0); inkLine([[-75, 40], [80, 40]], .7, PAL.ink, 'inkfine', 0);
    const C = []; for (let i = 0; i <= 20; i++) { const u = i / 20; C.push([-72 + u * 150, 38 - 88 * Math.exp(-Math.pow((u - .42) / .17, 2))]); }
    inkLine(C.slice(0, Math.max(3, Math.round(C.length * clamp(k * 1.4)))), 2, PAL.red, 'ink', .4);
    const vx = 55, vy = -38; paint(ellPts(vx, vy, 14, 14, 12), { wash: '#9BCB6A', washOp: 255, ink: PAL.ink, sw: .6 });
    for (let j = 0; j < 8; j++) { const a = j / 8 * TAU; inkLine([[vx + Math.cos(a) * 14, vy + Math.sin(a) * 14], [vx + Math.cos(a) * 21, vy + Math.sin(a) * 21]], 1, PAL.ink, 'inkfine', 0); }
    pop();
  }
  function finBoard(x, y, st, k) {             // a finance chart: candles and a zig-zag line
    if (k <= .02) return;
    const p = backOut(k);
    boilSeed('fin');
    push(); translate(x, y); scale(p);
    paint(rrPts(-95, -70, 190, 130, 10), { wash: '#EEF2F4', washOp: 255, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 7; i++) { const cx = -70 + i * 23, h0 = 10 + hash(i * 3) * 34, mid = 10 - i * 5 + (hash(i) - .5) * 20, up = hash(i * 7) > .4; inkLine([[cx, mid - h0 / 2 - 8], [cx, mid + h0 / 2 + 8]], .6, PAL.ink, 'inkfine', 0); paint(rectPts(cx - 6, mid - h0 / 2, 12, h0), { wash: up ? '#7FB56A' : PAL.red, washOp: 255, ink: PAL.ink, sw: .4 }); }
    pop();
  }

  // ---------------- the shot ----------------
  function valley(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const toPost = [E(0) + .45, E(0) + 2.45], toTown = [E(2) - .9, L(3) + .2], back = [E(3) + .3, E(3) + 1.6], dive = [S.dur - 1.3, S.dur];
    const cx = kf(st, [[0, 1010], [toPost[0], 1120], [toPost[1], 2240], [toTown[0], 2250], [toTown[1], 2420], [back[0], 2425], [back[1], 2150], [99, 2150]]);
    const cy = kf(st, [[0, 560], [toPost[0], 575], [toPost[1], 770], [toTown[0], 760], [toTown[1], 410], [back[0], 400], [back[1], 800], [99, 800]]);
    const z = kf(st, [[0, 1.0], [toPost[0], 1.02], [toPost[1], 1.32], [toTown[0], 1.34], [toTown[1], 1.66], [back[0], 1.7], [back[1], 1.4], [99, 1.45]]);
    camBegin(cx, cy, z);
    drawPlate('a3s2_valley', 0, 0);
    // river sparkles drift downstream (the data flows)
    const rs = []; for (let i = 0; i < 14; i++) { const u = frac(hash(i * 5.1) + st * .05), x = lerp(-40, 3040, u); let j = 0; while (j < RIVER.length - 2 && RIVER[j + 1][0] < x) j++; const f = (x - RIVER[j][0]) / (RIVER[j + 1][0] - RIVER[j][0]); rs.push([x, lerp(RIVER[j][1], RIVER[j + 1][1], f) + (hash(i) - .5) * 60]); }
    // the workshops
    if (A3.vis(HUTS[0], 560, 250)) nuees(HUTS[0], 560, st);
    if (A3.vis(HUTS[1], 560, 250)) lucioles(HUTS[1], 560, st);
    if (A3.vis(HUTS[2], 560, 250)) luthier(HUTS[2], 560, st);
    if (A3.vis(HUTS[3], 560, 250)) engrenages(HUTS[3], 575, st);
    A3.valleyNames(i => seg(st, L(0) + .5 + i * .55, L(0) + .9 + i * .55));
    for (const [x, y] of rs) glow(x, y, 16, '#E4FBFD', .45);
    // the fork: satellite over the crop plots, the crop model's gauge (L1)
    const agri = seg(st, L(1) + .2, L(1) + .7), far = seg(st, E(2) - 1.6, E(2) - 1.0);
    if (A3.vis(2600, 800, 500)) {
      const sk = seg(st, L(1) + .6, E(1) - .4), sx = lerp(2330, 2980, sk) + 900 * easeIn(seg(st, E(1) - .4, E(1) + .8)), sy = 520 - 40 * Math.sin(sk * Math.PI);
      const beam = bump(st, L(1) + 1.6, E(1) - 1.2, .35);
      if (beam > .02) {
        boilSeed('beam');
        paint([[sx - 10, sy + 40], [sx + 10, sy + 40], [FIELD.x + 110, FIELD.y + 20], [FIELD.x - 110, FIELD.y + 20]], { wash: '#BDF1F6', washOp: 90 * beam, ink: null });
        for (let r = 0; r < 4; r++) { const yy = FIELD.y - 20 + r * 16 + frac(st * 1.5) * 16; inkLine([[FIELD.x - 100, yy], [FIELD.x + 100, yy + 2]], .7, PAL.data, 'inkfine', 0); }
      }
      satellite(sx, sy, .15 * Math.sin(st));
      // the crop model: a young plant and a dial that gets re-set when the image arrives
      boilSeed('crop');
      inkLine([[GAUGE.x, GAUGE.y + 40], [GAUGE.x, GAUGE.y - 30]], 2.4, PAL.woodDk, 'ink', 0);
      paint(rrPts(GAUGE.x - 42, GAUGE.y - 96, 84, 70, 10), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .8 });
      const off = lerp(.9, 0, easeOut(seg(st, E(1) - 1.6, E(1) - 1.0))) + .05 * Math.sin(st * 3), a = -Math.PI / 2 + off;
      for (let k = -2; k <= 2; k++) { const aa = -Math.PI / 2 + k * .4; inkLine([[GAUGE.x + Math.cos(aa) * 26, GAUGE.y - 50 + Math.sin(aa) * 26], [GAUGE.x + Math.cos(aa) * 32, GAUGE.y - 50 + Math.sin(aa) * 32]], k ? .5 : 1.2, k ? PAL.ink : PAL.soil, 'inkfine', 0); }
      inkLine([[GAUGE.x, GAUGE.y - 50], [GAUGE.x + Math.cos(a) * 30, GAUGE.y - 50 + Math.sin(a) * 30]], 1.3, PAL.red, 'ink', 0);
      const gx = GAUGE.x + 70, gh = lerp(30, 58, seg(st, E(1) - 1.6, E(1) - .8));
      inkLine([[gx, GAUGE.y + 40], [gx, GAUGE.y + 40 - gh]], 2, PAL.sap, 'ink', .3);
      paint(ellPts(gx - 12, GAUGE.y + 40 - gh * .7, 13, 7, 10, 0, -.4), { wash: '#7FB56A', washOp: 255, ink: PAL.ink, sw: .4 }); paint(ellPts(gx + 12, GAUGE.y + 40 - gh, 13, 7, 10, 0, .4), { wash: '#7FB56A', washOp: 255, ink: PAL.ink, sw: .4 });
      if (agri > .02) letter('modèle de culture', GAUGE.x + 20, GAUGE.y + 66, 22, '#3E5A3A', { font: FONT.hand, weight: 400, alpha: agri });
      // the signpost
      boilSeed('post'); paint(rectPts(POST.x - 9, POST.y - 290, 18, 290), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .8 });
      signBoard(POST.x + 205, POST.y - 250, 430, 'Foules, épidémies, finance →', 1, -.1, far * (1 - seg(st, back[1], back[1] + .5)) * (.8 + .2 * Math.sin(st * 6)), 'far');
      signBoard(POST.x + 150, POST.y - 165, 300, 'Agriculture →', 1, .08, agri * (1 - seg(st, E(1) - .2, E(1) + .4)), 'agri');
    }
    // the far town (L3): a crowd, an epidemic curve, a finance chart — and the workshops' tricks at work there
    if (A3.vis(TOWN.x, TOWN.y, 400)) {
      const off = 1 - seg(st, back[0], back[0] + .5), k1 = seg(st, L(3) + .05, L(3) + .5) * off, k2 = seg(st, L(3) + .95, L(3) + 1.4) * off, k3 = seg(st, L(3) + 1.85, L(3) + 2.3) * off;
      crowd(TOWN.x - 180, TOWN.y + 75, st, k1);
      if (k1 > .3) nuees(TOWN.x - 180, TOWN.y - 10, st, .55);
      epiBoard(TOWN.x, TOWN.y - 30, st, k2);
      if (k2 > .5) { boilSeed('tfly'); const F = []; for (let i = 0; i < 6; i++) F.push([TOWN.x + Math.cos(st * 1.3 + i) * 110, TOWN.y - 40 + Math.sin(st * 1.9 + i * 2) * 60]); for (const [a, b] of F) paint(ellPts(a, b, 4, 4, 8), { wash: '#F4F7A0', washOp: 255, ink: null }); for (const [a, b] of F) glow(a, b, 22, '#E9F58A', .7); }
      finBoard(TOWN.x + 200, TOWN.y + 20, st, k3);
      if (k3 > .5) { boilSeed('tgear'); gear(TOWN.x + 290, TOWN.y - 45, 22, 6, st, '#D9B25A'); }
    }
    // Awa and Jumo: walk to the signpost (L0–L1), watch; Jumo projects MAELIA (L2); Awa looks back, then « ailleurs »
    const ax = kf(st, [[0, 1850], [toPost[1] + .3, 2045], [99, 2045]]), walking = st > .2 && st < toPost[1] + .3;
    const mood = actP(st, [[0, 'neutre'], [L(1) + .8, 'concentree', { lookX: .9, lookY: -.3 }], [E(1) - 1.0, 'joie', { lookX: .9 }],
      [L(2) + .8, 'doute', { lookX: -.9 }], [E(2) - 1.6, 'surprise', { lookX: .8, lookY: -.8 }], [L(3) + .6, 'emerveillee', { lookX: .8, lookY: -.9 }], [back[0] + .6, 'determinee', { lookX: -.2 }]]);
    const Aw = walking ? { ...mood, view: 'side', walk: (ax - 1850) / 130, aL: undefined, aR: undefined, eL: undefined, eR: undefined, fist: false, handR: undefined, finger: undefined }
      : { ...mood, view: st > L(2) + .8 && st < E(2) - 1.6 ? 'q' : 'side', flip: st > L(2) + .8 && st < E(2) - 1.6 };
    if (A3.vis(ax, 900, 300)) A3.awa(ax, 985, 21, Aw);
    const holo = bump(st, L(2) + .2, E(2) - .3, .35);
    const jx = kf(st, [[0, 1760], [toPost[1] + .4, 1960], [L(2), 1960], [L(2) + .6, 2100], [back[0], 2100], [dive[0], 2100], [99, 2150]]);
    const jy = kf(st, [[0, 760], [toPost[1] + .4, 760], [L(2), 760], [L(2) + .6, 700], [back[0], 700], [dive[0], 720], [99, 800]]) + Math.sin(st * 2.3) * 7;
    if (holo > .02) {                            // a little MAELIA projected above Jumo
      boilSeed('holo');
      paint([[jx - 20, jy - 50], [jx + 20, jy - 50], [jx + 110, jy - 190], [jx - 110, jy - 190]], { wash: '#BDF1F6', washOp: 70 * holo, ink: null });
      drawPlate('maquette', jx, jy - 205, { s: .24 * backOut(holo), ax: .5, ay: .5, alpha: .9 * holo });
      letter('MAELIA', jx, jy - 270, 26 * backOut(holo), PAL.night, { weight: 700, stroke: PAL.cream, alpha: holo });
    }
    const jf = st < L(1) ? 'happy' : st < E(1) ? 'scan' : holo > .3 ? 'happy' : st < E(3) ? 'wide' : 'excl';
    const dk = easeIn(seg(st, dive[0], dive[1]));
    const [sjx, sjy] = toScreen(jx, jy);
    if (dk <= 0 && A3.vis(jx, jy, 200)) A3.jumo(jx, jy, 11, { face: jf, lookX: st > E(2) - 1.6 && st < back[0] ? .6 : 0, lookY: st > E(2) - 1.6 && st < back[0] ? -.8 : 0, rot: .06 * Math.sin(st * 1.6), boilKey: 'jumo' });
    camEnd();
    // Jumo flies into the lens: his body fills the frame (3.3 opens by pulling back out of it)
    if (dk > 0) A3.jumo(lerp(sjx, 960, dk), lerp(sjy, 560, dk), lerp(11 * 1.45, 260, dk), { face: 'happy', rot: .06 * (1 - dk), boilKey: 'jumo', glowScreen: 0 });
    if (st < .9) { flushLetters(); A3.clouds(1 - seg(st, 0, .85), 'cl32'); }   // the clouds of 3.1 clear
  }

  scene('3.2', S => [[0, valley]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i);
      const out = [[.1, 'whoosh', .1, .3], [E(0) + .45, 'whoosh', .06], [L(1) + .6, 'rotor', .05, .5], [L(1) + 1.6, 'bip', .06, .5], [E(1) - 1.0, 'ding', .08, .4],
        [L(2) + .2, 'sparkle', .05], [E(2) - 1.6, 'chime', .08, .3], [E(2) - .9, 'whoosh', .06], [L(3) + .05, 'pop', .08], [L(3) + .95, 'pop', .08], [L(3) + 1.85, 'pop', .08],
        [E(3) + .3, 'whoosh', .06], [E(3) + 1.8, 'bip2', .08], [S.dur - 1.3, 'whoosh', .16]];
      for (let i = 0; i < 4; i++) out.push([L(0) + .5 + i * .55, 'tick', .05]);
      for (let k = 0; k < 8; k++) out.push([.3 + k * .38, 'step', .04]);
      return out;
    });
})();
