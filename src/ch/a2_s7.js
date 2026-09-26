// scène 2.7 — Deux terrains d'aventure (V2 § 4, acte II). Montré comme un VOYAGE À VENIR (configurations envisagées).
// Lines: L0 « L'aventure est prévue sur deux terrains : »
//        L1 « La Réunion, bien équipée en capteurs, | pour faire entrer les données ; »
//        L2 « et le Sénégal, | à l'échelle d'un territoire, | pour étudier les trajectoires et leurs bifurcations. »
// Shots:  A  0 → L1−.35   the little cargo plane from 2.6's last frame; Awa pops up at the cockpit window and waves,
//                         Jumo lands on the roof. A dotted route (a plan, not a trip already made) draws ahead to two
//                         pins. A cloud passes in front of the camera (→ B).
//         B  → L2−.35     La Réunion: the plane flies past the volcano's terraces; sensors blink everywhere like
//                         fireflies, their data rise to Jumo's cyan antenna, Jumo is over the moon. Signpost
//                         « Escale prévue : La Réunion ». A cloud (→ C).
//         C  → L2+5.3     Sénégal: the great plain, baobabs, a zebu herd on its transhumance; the tree of futures unfolds
//                         over the whole territory, its forks lit (« bifurcations »). Signpost « Escale prévue : Sénégal ».
//         D  → end        seen from above, the plane flies over the archipelago of four islands (1.1's map) toward RQ1;
//                         the act wipe covers the cut into 3.1, which opens on island RQ1.
(() => {
  const K = window.A2K;
  const P0 = K.PLANE27;

  // ---------- a zebu (two leg poses, cut out) ----------
  const cowPaint = pose => (w, h) => {
    const leg = (x, a) => paint(ribbon([[x, 70], [x + Math.sin(a) * 10, 92], [x + Math.sin(a) * 16, 108]], 9, 7), { wash: '#6E5A48', washOp: 255, ink: PAL.ink, sw: .6 });
    const sw = pose ? .35 : -.35;
    leg(48, sw); leg(62, -sw); leg(112, -sw); leg(124, sw);
    wcw(ellPts(86, 58, 56, 26, 22), '#EFE6D8', 255, '#D8CCB8', 90);
    paint(ellPts(64, 36, 16, 12, 12), { wash: '#E4D8C6', washOp: 255, ink: null });          // the hump
    paint([[132, 44], [152, 40], [160, 58], [150, 70], [134, 64]], { wash: '#EFE6D8', washOp: 255, ink: PAL.ink, sw: .7, curv: .4 });   // head
    inkLine([[140, 42], [134, 26], [128, 22]], 1.3, '#8A7A60', 'ink', .5); inkLine([[150, 40], [156, 24], [162, 20]], 1.3, '#8A7A60', 'ink', .5);   // horns
    paint(ellPts(150, 50, 2.5, 2.5, 6), { wash: PAL.ink, ink: null });
    inkLine([[32, 56], [22, 70], [20, 84]], 1, PAL.ink, 'inkfine', .5);                       // tail
    paint(ellPts(86, 58, 56, 26, 22), { ink: PAL.ink, sw: .8 });
    paint(ellPts(64, 36, 16, 12, 12), { ink: PAL.ink, sw: .6 });
  };
  const cowMask = c => { c.beginPath(); c.ellipse(86, 58, 60, 30, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(64, 36, 19, 15, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(128, 40); c.lineTo(156, 36); c.lineTo(166, 16); c.lineTo(164, 60); c.lineTo(152, 74); c.lineTo(130, 68); c.fill(); c.fillRect(38, 60, 100, 52); c.lineWidth = 4; c.beginPath(); c.moveTo(32, 56); c.lineTo(20, 86); c.stroke(); c.beginPath(); c.moveTo(140, 42); c.lineTo(126, 20); c.stroke(); };
  definePlate('a2s7_cow', { w: 170, h: 115, res: 1.5, mask: cowMask, paint: cowPaint(0) });
  definePlate('a2s7_cow2', { w: 170, h: 115, res: 1.5, mask: cowMask, paint: cowPaint(1) });

  function skyBack(off) { drawPlate('hill', -180 - off, 0); }
  function clouds(x, y, s, a) { const c = color('#FFFFFF'); c.setAlpha(255 * a); const pw = 2400 * s; const x0 = ((x % pw) + pw) % pw - pw; for (let xx = x0; xx < 2000; xx += pw) drawPlate('a2s1_clouds', xx, y, { s, tint: c }); }
  // a cloud that crosses right in front of the camera (the cut hides behind it): k 0..1
  const cloudWipe = k => K.cloudWipe(k);
  function firefly(x, y, t, i) { return .5 + .5 * Math.sin(t * (2.5 + hash(i) * 2) + i * 2.3); }
  function signpost(x, y, txt, k, a = 1) {   // a (0..1): hidden while a cloud whites the frame out (letters sit on top)
    const p = backOut(k); if (p < .03) return;
    boilSeed('sign' + txt);
    const w = txt.length * 16 + 60;
    push(); translate(x, y); rotate(-.02); scale(p);
    paint(rectPts(-7, 0, 14, 150), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rrPts(-w / 2, -36, w, 70, 12, 1.5), { wash: '#F3E3C3', washOp: 255, ink: PAL.ink, sw: .9 });
    for (const sx of [-1, 1]) paint(ellPts(sx * (w / 2 - 12), -24, 3, 3, 6), { wash: '#8A7A6A', ink: null });
    pop();
    letter(txt, x, y, 30 * p, PAL.night, { rot: -.02, weight: 600, alpha: a });
  }
  const whiteOut = k => (k <= 0 || k >= 1) ? 0 : clamp((1 - Math.abs(k - .5) * 2) * 1.7 - .5);
  // ---------- A: in the sky ----------
  function sky(t, lt, dur, S, st) {
    const L = i => S.cue(i), cut = S.shots[1][0];
    const off = st * 100, ty = 0;
    skyBack(off);
    clouds(-st * 900 + 600, 300 + ty, .9, .85);
    clouds(-st * 600 - 700, 560 + ty, .6, .7);
    // the planned route: a dotted line drawing ahead of the plane to two pins (a plan, not a trip made)
    const rk = ease(seg(st, L(0) + .3, L(0) + 1.6));
    const R = []; for (let i = 0; i <= 24; i++) { const u = i / 24; R.push([P0.x + 120 + u * 1100, P0.y + 40 - 120 * Math.sin(u * Math.PI * .9)]); }
    const nR = Math.floor(R.length * rk);
    boilSeed('route'); for (let i = 1; i < nR; i += 2) inkLine([R[i - 1], R[i]], 2.2, PAL.ochre, 'ink', 0);
    const pins = [[R[10], PAL.data], [R[23], PAL.ochre]];
    pins.forEach(([p, col], i) => { const k = seg(st, L(0) + .8 + i * .5, L(0) + 1.2 + i * .5); if (k <= 0) return; boilSeed('pin' + i); const pp = backOut(k); glow(p[0], p[1] - 30, 60, col, .5); inkLine([[p[0], p[1]], [p[0], p[1] - 30 * pp]], 2, PAL.ink, 'ink', 0); paint(ellPts(p[0], p[1] - 38 * pp, 14 * pp, 14 * pp, 12), { wash: col, washOp: 255, ink: PAL.ink, sw: .8 }); });
    // the plane; Awa pops up at the window and waves; Jumo flies up and lands on the roof
    const bob = Math.sin(st * 2.2) * 8, pop = seg(st, .15, .5);
    const px = P0.x + 30 * Math.sin(st * .7), py = P0.y + bob;
    const jl = ease(seg(st, .1, .8));
    K.plane(px, py + 40 * (1 - backOut(pop)) * 0, P0.s, st, { awa: pop > 0, wave: st > .5, mood: 'joie', jumo: jl >= 1, jumoFace: 'happy' });
    if (jl < 1) jumo(lerp(px - 200, px + (610 - 450) * P0.s, jl), lerp(py + 360, py + (120 - 240) * P0.s, jl) - 60 * Math.sin(jl * Math.PI), 9 * P0.s, { stage: 2, face: 'wide', prop: 'spin', spin: st * 9, boilKey: 'jumoplane' });
    cloudWipe(seg(st, cut - .55, cut + .55));
    if (st < .55) cloudWipe(seg(st, -.55, .55));   // out of 2.6's cloud
    K.fadeLetters(1 - K.wipeAmt(seg(st, cut - .55, cut + .55)));
  }

  // ---------- B: La Réunion ----------
  const FLIES = Array.from({ length: 26 }, (_, i) => [140 + hash(i * 3.1) * 2100, 790 + hash(i * 5.3) * 520]);
  function reunion(t, lt, dur, S, st) {
    const L = i => S.cue(i), t0 = S.shots[1][0], t1 = S.shots[2][0];
    const k = seg(st, t0, t1), cx = lerp(900, 1500, k);
    camBegin(cx, 640, 1.0);
    drawPlate('reunion', 0, 0);
    // sensors like fireflies on the terraces; their data rise to Jumo's antenna
    const px = cx + 180, py = 330 + Math.sin(st * 2.2) * 8, s = .5;
    const tip = [px + (610 - 450) * s - 1.9 * 9 * s, py + (120 - 240) * s - 6.35 * 9 * s];
    const on = FLIES.map(([x, y], i) => firefly(x, y, st, i));
    FLIES.forEach(([x, y], i) => glow(x, y, 40, i % 3 ? PAL.data : '#E9FF9A', .6 * on[i]));
    const up = []; FLIES.forEach(([x, y], i) => { if (i % 3) return; const f = frac(st * .6 + hash(i)); if (Math.abs(x - px) < 900) up.push(arcPt([x, y], tip, 120, ease(f))); });
    for (const q of up) glow(q[0], q[1], 26, PAL.data, .5);
    boilSeed('flies'); FLIES.forEach(([x, y], i) => paint(ellPts(x, y, 5, 5, 8), { wash: mixCol('#DDEFF6', PAL.data, on[i]), washOp: 255, ink: null }));
    for (const q of up) paint(ellPts(q[0], q[1], 5, 5, 8), { wash: PAL.data, washOp: 255, ink: null });
    signpost(1320, 860, 'Escale prévue : La Réunion', seg(st, t0 + .6, t0 + 1.0), 1 - whiteOut(seg(st, t1 - .55, t1 + .55)));
    K.plane(px, py, s, st, { wave: true, mood: 'emerveillee', jumo: true, jumoFace: 'love', beam: .8 });
    camEnd();
    cloudWipe(seg(st, t1 - .55, t1 + .55));
    if (st - t0 < .55) cloudWipe(seg(st, t0 - .55, t0 + .55));
    K.fadeLetters(1 - Math.max(K.wipeAmt(seg(st, t1 - .55, t1 + .55)), K.wipeAmt(seg(st, t0 - .55, t0 + .55))));
  }

  // ---------- C: Sénégal ----------
  function senegal(t, lt, dur, S, st) {
    const L = i => S.cue(i), t0 = S.shots[2][0], t1 = S.shots[3][0];
    const k = seg(st, t0, t1), cx = lerp(900, 1400, ease(k)), cy = lerp(620, 700, ease(k)), z = lerp(1.0, .9, ease(k));
    camBegin(cx, cy, z);
    drawPlate('senegal', 0, 0);
    // transhumance: zebus walking in a line with a herder
    const hs = st * 38;
    for (let i = 0; i < 7; i++) { const x = 300 + i * 150 + hs + (i % 2) * 20, y = 1040 + (i % 3) * 22, ph = Math.floor((st * 3 + i * .5) % 2); drawPlate(ph ? 'a2s7_cow2' : 'a2s7_cow', x, y, { s: .9, ax: .5, ay: .95 }); }
    person(300 + 7 * 150 + hs + 60, 1060, 8, { preset: ACTEURS.eleveur, view: 'side', walk: hs / 13, boilKey: 'herder', aR: 2.3, eR: .3, handR: (s, sw) => inkLine([[0, 0], [0, 2.8 * s]], sw * 2, PAL.woodDk, 'ink', 0) });
    // the tree of futures unfolds over the whole territory, its forks lit (bifurcations)
    const grow = ease(seg(st, L(2) + 2.1, L(2) + 4.2)), forks = seg(st, L(2) + 3.3, L(2) + 4.6);
    if (grow > 0) {
      const B = treeBranches(520, 860, 1.8, 7, 3);
      futureTree(520, 860, 1.8, st, { branches: B, grow, state: b => ({ a: 1, noGlow: true, col: b.depth > 1 ? PAL.ochre : PAL.data }) });
      if (forks > 0) { for (const b of B) if (b.depth < 3) glow(b.tip[0], b.tip[1], 70, PAL.ochre, .6 * forks); boilSeed('forks'); for (const b of B) if (b.depth < 3) paint(ellPts(b.tip[0], b.tip[1], 12 * forks, 12 * forks, 10), { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .7 }); }
    }
    signpost(1720, 880, 'Escale prévue : Sénégal', seg(st, t0 + .6, t0 + 1.0), 1 - whiteOut(seg(st, t1 - .55, t1 + .55)));
    const px = cx + 150 + 60 * Math.sin(st * .6), py = 330 + Math.sin(st * 2.2) * 8;
    K.plane(px, py, .5, st, { wave: st < L(2) + 2.0, mood: st < L(2) + 3.3 ? 'joie' : 'emerveillee', jumo: true, jumoFace: grow > .3 ? 'tree' : 'happy', beam: .5 });
    camEnd();
    if (st - t0 < .55) cloudWipe(seg(st, t0 - .55, t0 + .55));
    cloudWipe(seg(st, t1 - .55, t1 + .55));
    K.fadeLetters(1 - Math.max(K.wipeAmt(seg(st, t1 - .55, t1 + .55)), K.wipeAmt(seg(st, t0 - .55, t0 + .55))));
  }

  // ---------- D: over the archipelago (seen from above) ----------
  function topPlane(x, y, s, rot, t) {
    boilSeed('topplane');
    push(); translate(x, y); rotate(rot); scale(s);
    paint(ellPts(40, 60, 220, 30, 18), { wash: PAL.ink, washOp: 40, ink: null });            // shadow on the sea
    paint([[-40, -150], [40, -150], [60, 150], [-60, 150]].map(([a, b]) => [b, a]), { wash: '#3E7C4A', washOp: 255, ink: PAL.ink, sw: 1, curv: .2 });   // wing
    paint(ellPts(0, 0, 200, 34, 22), { wash: '#F1E6D2', washOp: 255, ink: PAL.ink, sw: 1.1 });
    paint([[-190, 0], [-200, -70], [-160, -70], [-140, 0], [-160, 70], [-200, 70]], { wash: '#C8553D', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(ellPts(150, 0, 30, 20, 12), { wash: '#9FD3D6', washOp: 255, ink: PAL.ink, sw: .7 });
    for (const sd of [-1, 1]) { const b = Math.cos(t * 40) * 60; inkLine([[40, sd * 90 - b], [40, sd * 90 + b]], 2.4, '#4A5260', 'ink', 0); }
    pop();
  }
  function archipel(t, lt, dur, S, st) {
    const t0 = S.shots[3][0];
    const k = ease(seg(st, t0, S.dur));
    // ends exactly on 3.1's first framing (camera 1200, 690, 1.0; the plane at 1080, 640 heading for RQ1)
    camBegin(lerp(1250, 1200, k), lerp(710, 690, k), lerp(.86, 1.0, k));
    drawPlate('archipel', 0, 0);
    const pk = ease(seg(st, t0, S.dur - .1));
    topPlane(lerp(1900, 1080, pk), lerp(1080, 640, pk), lerp(.7, .55, pk), -2.6, st);
    camEnd();
    if (st - t0 < .55) cloudWipe(seg(st, t0 - .55, t0 + .55));
  }

  scene('2.7', S => [[0, sky], [S.cue(1) - .35, reunion], [S.cue(2) - .35, senegal], [S.cue(2) + 5.3, archipel]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i);
      const out = [[0, 'rotor', .08], [.2, 'bip2', .07, .3], [.8, 'thud', .06], [.5, 'squeak', .05], [L(0) + .4, 'tick', .04], [L(0) + .9, 'pop', .07], [L(0) + 1.4, 'pop', .07],
        [L(1) - .5, 'whoosh', .1], [L(1) + .5, 'sparkle', .06], [L(1) + 1.0, 'bip2', .08, .3], [L(1) + .9, 'knock', .08], [L(2) - .5, 'whoosh', .1], [L(2) + .9, 'knock', .08],
        [L(2) + 2.1, 'chime', .08], [L(2) + 3.4, 'sparkle', .07], [L(2) + 5.0, 'whoosh', .1], [L(2) + 5.6, 'rotor', .07]];
      for (let k = 0; k < 6; k++) out.push([L(2) + .2 + k * .5, 'step', .025]);
      return out;
    });
})();
