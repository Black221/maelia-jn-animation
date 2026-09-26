// scène 3.6 — Le pont manquant (V2 § 4, acte III).
// Lines: L0 « En rassemblant tout ce savoir, Awa découvre un vide : » · L1 « personne n'a encore fait entrer, au fil
//        des saisons, les observations d'un vrai territoire agricole dans un modèle multi-agents, pour réévaluer ses
//        futurs. » · L2 « Ce pont-là n'existe pas encore. » · L3 « C'est exactement celui qu'Awa va construire. »
// (The score plays a drone, falls silent from L1 under the four signs, and bursts into a fanfare at L3 − 0.15 s:
//  the loop lands exactly then.)
// Shots:
//   A  0 → L2−1.4  the clouds of 3.5 clear on the archipelago from above: a bridge grows from each island… and stops
//                  halfway; a soft red void in the middle; Awa and Jumo reach the end of the RQ1 bridge; push in on the
//                  void; four « PAS ENCORE » signs are planted one by one (in the silence)
//   B  → L3−0.5    close on the end of the bridge: Awa looks at Jumo, Jumo looks at Awa… « bip ? ». Awa smiles, draws
//                  Jumo's loop on her tablet (Observer · Intégrer · Actualiser · Recalculer les futurs · Décider),
//                  the loop lifts off the tablet as a ring of light
//   C  → end       from above: the ring comes down into the void and lands (fanfare), becomes a roundabout; the four
//                  bridges reach it; the signs fly off; the final banner: « Intégrer les données du terrain dans MAELIA
//                  pour réévaluer, saison après saison, les futurs encore accessibles. » (it stays over the first
//                  seconds of 3.7)
(() => {
  const C = [1200, 690], RING = { rx: 180, ry: 128 };
  const STATIONS = ['Observer', 'Intégrer', 'Actualiser', 'Recalculer\nles futurs', 'Décider'];
  const PAS = ['Modèle multi-agents agricole\n+ assimilation, validé\nsur données réelles', 'Usages des sols et pratiques\nassimilés dans un modèle\nterritorial',
               'Études en Afrique,\nà La Réunion, au Sénégal', 'Données reliées\naux trajectoires'];
  const SIGNS = [[1200, 505], [1470, 700], [1200, 880], [930, 700]];
  const BR = ISLES.map(I => {                      // each bridge: from the island's shore toward the centre
    const dx = C[0] - I.x, dy = C[1] - I.y, d = Math.hypot(dx, dy), u = [dx / d, dy / d];
    return { p0: [I.x + u[0] * I.r * .74, I.y + u[1] * I.r * .52], u };
  });
  // the ring edge point exactly on the ellipse, toward each island
  BR.forEach(b => { const a = Math.atan2(-b.u[1] / RING.ry, -b.u[0] / RING.rx); b.ring = [C[0] + Math.cos(a) * (RING.rx + 22), C[1] + Math.sin(a) * (RING.ry + 22)]; b.half = [lerp(b.p0[0], b.ring[0], .5), lerp(b.p0[1], b.ring[1], .5)]; });

  function bridge(b, k, key) {                     // planks from p0 toward the ring, k = 0..1 of the whole length
    if (k <= .01) return;
    const e = [lerp(b.p0[0], b.ring[0], k), lerp(b.p0[1], b.ring[1], k)], n = [-b.u[1], b.u[0]], w = 26;
    boilSeed('br' + key);
    paint([[b.p0[0] + n[0] * w, b.p0[1] + n[1] * w], [e[0] + n[0] * w, e[1] + n[1] * w], [e[0] - n[0] * w, e[1] - n[1] * w], [b.p0[0] - n[0] * w, b.p0[1] - n[1] * w]], { wash: '#C99A62', washOp: 255, ink: PAL.ink, sw: .8 });
    const L = Math.hypot(e[0] - b.p0[0], e[1] - b.p0[1]), m = Math.floor(L / 16);
    for (let i = 1; i < m; i++) { const f = i / m, x = lerp(b.p0[0], e[0], f), y = lerp(b.p0[1], e[1], f); inkLine([[x + n[0] * w, y + n[1] * w], [x - n[0] * w, y - n[1] * w]], .5, '#8A6246', 'inkfine', 0); }
    for (const sd of [-1, 1]) inkLine([[b.p0[0] + n[0] * w * sd * 1.1, b.p0[1] + n[1] * w * sd * 1.1], [e[0] + n[0] * w * sd * 1.1, e[1] + n[1] * w * sd * 1.1]], 1.1, '#6E4A34', 'ink', 0);
  }
  function loopRing(x, y, s, k, labels, lit = 1, key = 'ring') {   // Jumo's loop: a ring with five stations (k = drawn fraction)
    if (k <= .01) return;
    boilSeed(key);
    const P = []; const n = Math.max(3, Math.round(60 * k)); for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / 60 * TAU; P.push([x + Math.cos(a) * RING.rx * s, y + Math.sin(a) * RING.ry * s]); }
    inkLine(P, 9 * s + 2, lit > .5 ? '#5A6A7A' : PAL.data, 'ink', .5);
    inkLine(P, 2.2 * s + .5, lit > .5 ? PAL.cream : '#E4FBFD', 'ink', .5);
    STATIONS.forEach((nm, i) => {
      const f = i / 5; if (f > k - .02) return;
      const a = -Math.PI / 2 + f * TAU, px = x + Math.cos(a) * RING.rx * s, py = y + Math.sin(a) * RING.ry * s;
      boilSeed(key + 'st' + i);
      paint(ellPts(px, py, 16 * s + 3, 16 * s + 3, 12), { wash: i === 4 ? PAL.ochre : PAL.data, washOp: 255, ink: PAL.ink, sw: .7 });
      letter(String(i + 1), px, py + 1, 18 * s + 4, PAL.night, { weight: 700 });
      if (labels) { const lx = x + Math.cos(a) * (RING.rx - 62) * s, ly = y + Math.sin(a) * (RING.ry - 42) * s; letter(nm, lx, ly, labels * s, PAL.night, { weight: 700, stroke: PAL.cream, lh: 1, strokeW: .2 }); }
    });
  }
  function sign(x, y, txt, k, fly, key, wob = 0) {          // a « PAS ENCORE » sign planted in the void
    if (k <= .01 || fly >= 1) return;
    const drop = (1 - easeIn(k)) * -260, fx = fly > 0 ? (x - C[0]) * 3 * easeIn(fly) : 0, fy = fly > 0 ? (y - C[1] - 200) * 2 * easeIn(fly) : 0;
    const X = x + fx, Y = y + drop + fy, rot = fly * 2 * (x < C[0] ? -1 : 1) + .06 * wob;
    boilSeed('pas' + key);
    if (fly <= 0 && k >= 1) paint(ellPts(x, y + 58, 40, 12, 14), { wash: '#E8F6F4', washOp: 160, ink: '#FFFFFF', sw: .4 });
    push(); translate(X, Y); rotate(rot);
    paint(rectPts(-5, 10, 10, 50), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .6 });
    paint(rrPts(-138, -66, 276, 124, 10, 1), { wash: '#FFF1E8', washOp: 255, ink: PAL.red, sw: 1.2 });
    pop();
    letter('PAS ENCORE', X, Y - 44, 26, PAL.red, { rot, weight: 700 });
    letter(txt, X, Y + 8, 17, PAL.night, { rot, weight: 600, lh: 1.08, maxW: 256 });
  }
  function banner(k) {                              // the final line, on a painted ribbon (screen space)
    if (k <= .01) return;
    const p = backOut(k);
    boilSeed('banner');
    push(); translate(960, 212); scale(p);
    paint([[-760, -70], [760, -70], [720, 0], [760, 70], [-760, 70], [-720, 0]], { wash: '#FFF4DC', washOp: 250, ink: PAL.ink, sw: 1.1 });
    paint([[-760, -70], [-820, -40], [-790, 0], [-820, 44], [-760, 70]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .8 });
    paint([[760, -70], [820, -40], [790, 0], [820, 44], [760, 70]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .8 });
    pop();
    letter('Intégrer les données du terrain dans MAELIA pour réévaluer,\nsaison après saison, les futurs encore accessibles.', 960, 214, 40 * p, PAL.night, { weight: 600, lh: 1.25 });
  }
  // the finished frame (used as it is by the first seconds of 3.7): roundabout, joined bridges, banner
  A3.finalBridges = (st, o = {}) => {
    const z = o.z ?? 1.3, cy = o.cy ?? C[1] - 30;
    camBegin(C[0], cy, z);
    drawPlate('archipel', 0, 0);
    boilSeed('greenzone'); paint(ellPts(C[0], C[1], RING.rx + 70, RING.ry + 55, 30), { wash: '#CDEFE4', washOp: 235, ink: '#7FC4B0', sw: .6 });
    BR.forEach((b, i) => bridge(b, 1, i));
    loopRing(C[0], C[1], 1, 1, 23, 1, 'ringfinal');
    glow(C[0], C[1], 280, PAL.ochre, .25 + .1 * Math.sin(st * 3));
    for (const I of ISLES) letter(I.id, I.x, I.y + I.r * .62, 34, PAL.night, { weight: 600, stroke: PAL.cream });
    camEnd();
    banner(o.banner ?? 1);
  };
  A3.RING_C = C;

  function aerial(t, lt, dur, S, st, part) {
    const L = i => S.cue(i), E = i => S.cueEnd(i), land = L(3) - .15;
    const signT = i => L(1) + .5 + i * 1.9;
    let cx, cy, z;
    if (part === 'A') { cx = 1200; cy = kf(st, [[0, 690], [3.9, 690], [5.5, 700], [99, 700]]); z = kf(st, [[0, .82], [3.9, .86], [5.5, 1.5], [99, 1.58]]); }
    else { cx = 1200; cy = kf(st, [[land - .6, 700], [land + .8, 680], [99, 660]]); z = kf(st, [[land - .6, 1.5], [land + .8, 1.34], [99, 1.3]]); }
    const [sx, sy] = part === 'C' ? shakeXY(st, 10 * Math.exp(-6 * Math.max(0, st - land)) * (st > land ? 1 : 0)) : [0, 0];
    camBegin(cx + sx, cy + sy, z);
    drawPlate('archipel', 0, 0);
    // the void: soft red, then (after the landing) it turns green-cyan
    const vk = seg(st, 2.6, 3.8), heal = part === 'C' ? seg(st, land, land + .8) : 0;
    if (vk > .02) { boilSeed('void'); paint(ellPts(C[0], C[1], RING.rx + 70, RING.ry + 55, 30), { wash: mixCol('#F2C4B6', '#CDEFE4', heal), washOp: 235 * vk, ink: heal < .5 ? PAL.red : '#7FC4B0', sw: .6 }); }
    // bridges: grow… and stop halfway; after the landing they reach the roundabout
    BR.forEach((b, i) => bridge(b, part === 'A' ? .5 * ease(seg(st, .6 + i * .25, 2.4 + i * .25)) : lerp(.5, 1, ease(seg(st, land + .15 + i * .1, land + .75 + i * .1))), i));
    if (part === 'A') for (const I of ISLES) letter(I.id, I.x, I.y + I.r * .62, 34, PAL.night, { weight: 600, stroke: PAL.cream, alpha: 1 - seg(st, 4, 5) });
    // the four signs
    SIGNS.forEach(([x, y], i) => sign(x, y, PAS[i], seg(st, signT(i) - .35, signT(i)), part === 'C' ? seg(st, land + .05, land + .6) : 0, i, spring(st, signT(i), 6, 16)));
    // Awa and Jumo, small, at the end of the RQ1 bridge
    if (part === 'A') {
      const b = BR[0], ak = ease(seg(st, 1.2, 3.4)), ap = [lerp(b.p0[0], b.half[0] - b.u[0] * 26, ak), lerp(b.p0[1], b.half[1] - b.u[1] * 26, ak)];
      A3.awa(ap[0], ap[1] + 10, 5.2, { ...feelP(st > 3.4 ? 'inquiete' : 'neutre', st, { lookX: .6 }), view: st < 3.4 ? 'side' : 'q', walk: st > 1.2 && st < 3.4 ? st * 2.4 : null, boilKey: 'awa' });
      A3.jumo(ap[0] + 36, ap[1] - 44 + Math.sin(st * 2.4) * 3, 3.4, { face: st > 3.6 ? 'sad' : 'happy', boilKey: 'jumo' });
    }
    // C: the ring comes down and lands, becomes the roundabout
    if (part === 'C') {
      const dk = seg(st, land - .55, land);
      if (st < land) { const s = lerp(2.6, 1, easeIn(dk)); glow(C[0], C[1] - 40 * (1 - dk), 300 * s, PAL.data, .6); loopRing(C[0], C[1] - 120 * (1 - easeIn(dk)), s, 1, 0, 0, 'ringfly'); }
      else {
        glow(C[0], C[1], 320, PAL.ochre, .5 * Math.exp(-2 * (st - land)) + .2);
        loopRing(C[0], C[1], 1, 1, 23 * backOut(seg(st, land + .2, land + .6)), seg(st, land, land + .3) > .5 ? 1 : 0, 'ringfinal');
      }
      for (const I of ISLES) letter(I.id, I.x, I.y + I.r * .62, 34, PAL.night, { weight: 600, stroke: PAL.cream, alpha: seg(st, land + .5, land + 1) });
    }
    camEnd();
    if (part === 'C') {
      if (st > land && st < land + .7) sfx('BOUM !', 960, 470, 70, PAL.ochre, st - land, { life: .7, stroke: PAL.cream });
      flash(seg(st, land - .04, land) * (1 - seg(st, land, land + .25)) * .8, '#FFF6DE');
      banner(seg(st, land + 1.0, land + 1.5));
    }
    if (part === 'A') {
      if (st < 1) { flushLetters(); A3.clouds(1 - seg(st, 0, .9), 'cl35'); }
      flash(seg(st, dur - .18, dur), PAL.cream);
    }
    if (part === 'C') flash(1 - seg(lt, 0, .2), PAL.cream);
  }

  // ---------------- B: close on the end of the bridge ----------------
  function closeUp(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i), land = L(3) - .15;
    const t0 = st - lt;                                       // shot start (scene time)
    const aLook = t0 + .25, jLook = t0 + .8, bipT = t0 + 1.35, smile = L(2) + .15, draw0 = L(2) + .8, draw1 = E(2) + .6, lift = draw1 + .15;
    const b = BR[0], E1 = b.half, z = 3.1;
    camBegin(E1[0] - b.u[0] * 30 + 20 * seg(st, t0, S.dur), E1[1] - 40, z + .1 * seg(lt, 0, dur));
    drawPlate('archipel', 0, 0);
    boilSeed('voidc'); paint(ellPts(C[0], C[1], RING.rx + 70, RING.ry + 55, 30), { wash: '#F2C4B6', washOp: 235, ink: PAL.red, sw: .6 });
    bridge(b, .5, 0);
    const ax = E1[0] - b.u[0] * 34, ay = E1[1] - b.u[1] * 34 + 12;
    const am = actP(st, [[t0, 'inquiete', { lookX: .2 }], [aLook, 'neutre', { lookX: .9, lookY: -.4 }], [smile, 'idee'], [draw0 - .1, 'concentree', { lookY: .6 }], [lift, 'emerveillee', { lookX: .6, lookY: -.9 }]]);
    const drawing = st > draw0 - .2 && st < lift + .1;
    A3.awa(ax, ay, 7.4, { ...am, view: 'q', hold: drawing ? 'tablet' : null, tabletScreen: '#DDF4F6', boilKey: 'awa' });
    const jx = ax + 40, jy = ay - 70 + Math.sin(st * 2.4) * 2;
    const jf = st < jLook ? 'sad' : st < bipT ? 'neutral' : st < smile + .3 ? 'question' : st < lift ? 'happy' : 'love';
    A3.jumo(jx, jy, 4.3, { face: jf, lookX: st > jLook ? -.8 : .4, flip: false, rot: st > bipT && st < bipT + .4 ? .12 * Math.sin((st - bipT) * 30) : 0, boilKey: 'jumo' });
    // the loop leaves the tablet as a ring of light, rising toward the void
    if (st > lift) { const k = easeIn(seg(st, lift, dur + t0 + .02)); const rx = lerp(ax + 6, C[0], k), ry = lerp(ay - 40, C[1] - 400, k); glow(rx, ry, 60 + 200 * k, PAL.data, .8); loopRing(rx, ry, lerp(.08, .7, k), 1, 0, 0, 'ringup'); }
    camEnd();
    if (st > bipT && st < bipT + .9) sfx('bip ?', ...toScreen(jx + 30, jy - 36, LAST_CAM), 44, PAL.data, st - bipT, { life: .9, font: FONT.round, weight: 700, stroke: PAL.night });
    // the tablet inset: what Awa draws (her tablet, seen close)
    const ik = seg(st, draw0 - .3, draw0) * (1 - seg(st, lift - .1, lift + .15));
    if (ik > .02) {
      const p = backOut(ik), X = 1340, Y = 480;
      boilSeed('inset');
      push(); translate(X, Y); scale(p);
      paint(rrPts(-380, -290, 760, 560, 40), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: 1.4 });
      paint(rrPts(-350, -260, 700, 500, 24), { wash: '#F6FBF9', washOp: 255, ink: null });
      pop();
      const dk = seg(st, draw0, draw1);
      loopRingScreen(X, Y - 10, p * .95, dk);
    }
  }
  // the loop in screen space (tablet inset): same geometry, labels outside for room
  function loopRingScreen(x, y, s, k) {
    if (k <= .01) return;
    boilSeed('rscreen');
    const n = Math.max(3, Math.round(60 * k)), P = []; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / 60 * TAU; P.push([x + Math.cos(a) * 190 * s, y + Math.sin(a) * 140 * s]); }
    inkLine(P, 4.5, PAL.data, 'ink', .5);
    const tip = P[P.length - 1]; paint([[tip[0] - 6, tip[1] - 6], [tip[0] + 6, tip[1] + 6], [tip[0] - 30, tip[1] + 40]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .6 });
    STATIONS.forEach((nm, i) => {
      const f = i / 5; if (f > k - .02) return;
      const a = -Math.PI / 2 + f * TAU, px = x + Math.cos(a) * 190 * s, py = y + Math.sin(a) * 140 * s;
      boilSeed('rs' + i); paint(ellPts(px, py, 17, 17, 12), { wash: i === 4 ? PAL.ochre : PAL.data, washOp: 255, ink: PAL.ink, sw: .8 });
      letter(String(i + 1), px, py + 1, 20, PAL.night, { weight: 700, screen: true });
      const lx = x + Math.cos(a) * 190 * s * .62, ly = y + Math.sin(a) * 140 * s * .55;
      letter(nm, lx, ly, 26 * s, PAL.night, { weight: 700, screen: true, lh: 1 });
    });
  }

  scene('3.6', S => [[0, (t, lt, d, S2, st) => aerial(t, lt, d, S2, st, 'A')], [S.cueEnd(1) + .2, closeUp], [S.cue(3) - .7, (t, lt, d, S2, st) => aerial(t, lt, d, S2, st, 'C')]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i), land = L(3) - .15, t0 = E(1) + .2;
      const out = [[.05, 'whoosh', .1], [2.7, 'bipsad', .05], [3.9, 'whoosh', .05],
        [t0 + 1.35, 'bipq', .1], [L(2) + .15, 'ding', .06], [E(2) + .75, 'sparkle', .07], [E(2) + .8, 'slideUp', .07], [land - .55, 'whoosh', .12], [land, 'thud', .3], [land + .2, 'confetti', .14]];
      for (let i = 0; i < 4; i++) { out.push([L(1) + .5 + i * 1.9 - .35, 'whoosh', .05]); out.push([L(1) + .5 + i * 1.9, 'thud', .16]); }
      for (let i = 0; i < 4; i++) out.push([.6 + i * .25, 'knock', .06]);
      for (let i = 0; i < 5; i++) out.push([L(2) + .8 + i * (E(2) + .6 - L(2) - .8) / 5, 'tick', .05]);
      for (let i = 0; i < 4; i++) out.push([land + .15 + i * .1, 'knock', .07]);
      return out;
    });
})();
