// scène 1.6 — La carte aux trésors cachés (V2 § 4, acte I). Décor : plate `library` + plate `a1s6_map` (the old map).
// Lines: L0 « Pour vérifier qu'on n'avait rien raté… une liste de travaux connus. » · L1 « Premier essai : cinq sur seize. » ·
//        L2 « Elle a ajouté une clé et remonté les références : neuf. » · L3 « Pas parfait, mais honnête, et ça se dit. » ·
//        L4 « Et chaque information notée est reliée à une phrase exacte de l'article, vérifiée automatiquement. » ·
//        L5 « Ici, on ne cite rien de mémoire. »
// One shot, the camera reframes:
//   0      opens on the ochre stamp of 1.5 (full frame), which shrinks into the ochre wax seal of a rolled map
//   L0     the seal breaks, the old map unrolls: 24 known treasures, the 16 recent ones (since 2010) ringed
//   L1     5 of the 16 light up; Awa grimaces. Cartouche « Test de rappel : 5 … sur 16 »
//   L2     she forges a new key, golden reference threads run out: 9. The 7 others stay dotted with a « ? »
//   L3     « Pas parfait, mais honnête » : Awa shrugs with a frank smile
//   L4     the map rolls up on the big book of forms: « Chaque information = une citation exacte + sa page »;
//          golden threads tie each field of a form to an exact sentence of the article and its page; Jumo scans, « ding »
//   L5     Awa closes the book, turns her cap over (labo → terrain), a gust turns the pages, which fly up and become
//          fields seen from the sky (the territory of 2.1; the act wipe covers the cut)
(() => {
  const FLOOR = 1250;
  const MAP = { x: 700, y: 480, w: 1100, h: 640 };           // the unrolled map, world px (top-left)
  const SEAL = [MAP.x + MAP.w / 2, MAP.y + 22];
  const AWA_X = 470, AWA_S = 26;
  const LECT = { x: 1250, top: 1010 };
  const BOOK = { x: 1250, y: 835, pw: 260, ph: 330 };         // spine centre, page size
  const TOT = 24;
  // treasure positions on the map (map-local), which are recent, found first (5), found after the new key (4 more)
  const TREAS = [];
  for (let i = 0; i < TOT; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    TREAS.push({ x: 120 + col * 172 + (hash(i * 3.1) - .5) * 70 + (row % 2) * 50, y: 120 + row * 112 + (hash(i * 5.7) - .5) * 44 });
  }
  const RECENT = [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 21, 22];                 // 16 recent
  const FIRST = [1, 6, 10, 15, 21], THEN = [3, 12, 16, 19];                                   // 5, then 9
  const logZ = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
  function camKF(t, keys) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const a = keys[i - 1], b = keys[i], k = ease((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), logZ(a[3], b[3], k)]; }
    return keys[keys.length - 1].slice(1);
  }
  const MC = document.createElement('canvas').getContext('2d');
  const textW = (txt, size, weight = 700) => { MC.font = `${weight} ${size}px ${FONT.round}`; return MC.measureText(txt).width; };

  // ---------------- the old map (a plate) ----------------
  definePlate('a1s6_map', { w: MAP.w, h: MAP.h, res: 1.6, mask(c, w, h) { c.fillRect(4, 4, w - 8, h - 8); }, paint(w, h) {
    area([[0, 0], [w, 0], [w, h], [0, h]], '#EBD6A8', '#DCC08A', 120);
    for (let k = 0; k < 9; k++) blob(hash(k * 7) * w, hash(k * 3 + 1) * h, 60 + hash(k) * 90, '#D8B77E', 70, .2);   // age stains
    wc([[30, 30], [w - 30, 30], [w - 30, h - 30], [30, h - 30]], '#BFE0DC', 150, .05, .5, .3);                  // the sea
    for (let k = 0; k < 40; k++) { const x = 60 + hash(k * 11) * (w - 120), y = 60 + hash(k * 13) * (h - 120); pen([[x, y], [x + 10, y - 4], [x + 20, y]], .5, '#6FA6A8', .5); }
    // three lands
    const land = (cx, cy, rx, ry, seed) => { const P = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, r = 1 + .16 * Math.sin(a * 3 + seed) + .08 * Math.sin(a * 7 + seed * 2); P.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); } return P; };
    for (const [cx, cy, rx, ry, sd, c] of [[300, 290, 250, 200, 1, '#C9C98A'], [740, 250, 250, 170, 2, '#D9C48A'], [720, 480, 300, 120, 3, '#BFCB8A']]) {
      const P = land(cx, cy, rx, ry, sd); area(P, c, mixCol(c, PAL.ink, .15), 110); paint(P, { ink: '#6E4A34', sw: .9, curv: .4 });
      paint(land(cx, cy, rx * 1.06, ry * 1.08, sd), { ink: '#8FB8B4', sw: .5, curv: .4 });
    }
    for (let k = 0; k < 7; k++) { const x = 180 + hash(k * 17) * 700, y = 180 + hash(k * 19) * 300; pen([[x - 14, y + 8], [x, y - 12], [x + 14, y + 8]], .7, '#8A6246', .2); }     // hills
    // compass rose, double border
    paint(starPts(w - 110, 110, 56, .28, 4), { wash: '#D9A45A', washOp: 255, ink: '#6E4A34', sw: .8 });
    paint(starPts(w - 110, 110, 36, .3, 4, -Math.PI / 4), { wash: '#EBD6A8', washOp: 255, ink: '#6E4A34', sw: .6 });
    paint(rectPts(14, 14, w - 28, h - 28), { ink: '#6E4A34', sw: 1.2 }); paint(rectPts(24, 24, w - 48, h - 48), { ink: '#6E4A34', sw: .6 });
  } });

  // ---------------- props ----------------
  function rod(x0, x1, y, r = 16) {
    boilSeed('a1s6 rod' + Math.round(y));
    paint(rrPts(x0 - 20, y - r, x1 - x0 + 40, 2 * r, r), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .9 });
    for (const x of [x0 - 30, x1 + 30]) paint(ellPts(x, y, r * 1.2, r * 1.2, 12), { wash: '#C9A04A', ink: PAL.ink, sw: .7 });
  }
  function treasure(x, y, state, k, t) {   // state: 'old' | 'recent' | 'found' | 'missing'
    if (k <= 0) return;
    const p = backOut(k), r = 17 * p;
    boilSeed('a1s6 tr' + Math.round(x) + ',' + Math.round(y));
    if (state === 'found') glow(x, y, 60, '#FFD27A', .75);
    if (state === 'missing') {
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; inkLine([[x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2], [x + Math.cos(a + .35) * r * 1.2, y + Math.sin(a + .35) * r * 1.2]], 1.4, '#8A6246', 'ink', 0); }
      letter('?', x, y + 1, 26 * p, '#8A6246', { weight: 700 });
      return;
    }
    const col = state === 'found' ? '#F2C04A' : state === 'recent' ? '#D9A45A' : '#BFAE8E';
    paint(ellPts(x, y, r, r, 14), { wash: col, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(starPts(x, y, r * .6, .45, 5), { wash: state === 'old' ? '#9C8E74' : '#FFF1C9', washOp: 255, ink: null });
    if (state === 'recent' || state === 'found') paint(ellPts(x, y, r * 1.45, r * 1.45, 16), { ink: state === 'found' ? '#E8A33A' : PAL.data, sw: 1.1 });
  }
  function book(o) {   // o.close 0..1 (right page folds onto the left), o.gust 0..1 (pages flutter), o.fields, o.threads k[]
    const { x, y, pw, ph } = BOOK;
    boilSeed('a1s6 lectern');
    paint([[x - 30, FLOOR], [x + 30, FLOOR], [x + 22, LECT.top], [x - 22, LECT.top]], { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .9 });
    paint(ellPts(x, FLOOR - 4, 90, 14, 16), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .8 });
    paint([[x - pw - 40, y + ph / 2 + 20], [x + pw + 40, y + ph / 2 + 20], [x + pw + 30, y + ph / 2 + 50], [x - pw - 30, y + ph / 2 + 50]], { wash: PAL.wood, washOp: 255, ink: PAL.ink, sw: .9 });
    // cover (under the pages)
    boilSeed('a1s6 cover');
    paint(rrPts(x - pw - 14, y - ph / 2 - 12, 2 * pw + 28, ph + 26, 10), { wash: '#6B3F2E', washOp: 255, ink: PAL.ink, sw: 1 });
    const cl = ease(o.close || 0);
    // left page: a form (fiche)
    boilSeed('a1s6 left');
    paint([[x - pw, y - ph / 2], [x - 8, y - ph / 2 + 8], [x - 8, y + ph / 2], [x - pw, y + ph / 2 - 6]], { wash: '#FFF8EA', washOp: 255, ink: PAL.ink, sw: .8 });
    const fields = [];
    if (cl < .98) {
      paint(rrPts(x - pw + 24, y - ph / 2 + 22, pw - 56, 26, 5), { wash: PAL.night, washOp: 255, ink: null });
      for (let i = 0; i < 3; i++) {
        const fy = y - ph / 2 + 80 + i * 82;
        inkLine([[x - pw + 26, fy], [x - pw + 110, fy]], 1.4, '#8A7A6A', 'inkfine', 0);
        paint(rrPts(x - pw + 24, fy + 10, pw - 60, 40, 5), { wash: o.lit && o.lit[i] > .5 ? '#FFF1C9' : PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 });
        for (let r = 0; r < 2; r++) inkLine([[x - pw + 34, fy + 22 + r * 14], [x - 70 - r * 40, fy + 22 + r * 14]], .6, '#A48A6A', 'inkfine', 0);
        fields.push([x - 36, fy + 30]);
      }
    }
    // right page: the article (it folds over when closing)
    boilSeed('a1s6 right');
    const sx = lerp(1, -1, cl), rx = xx => x + (xx - x) * sx;
    const sentences = [];
    if (sx > 0) {
      paint([[rx(x + 8), y - ph / 2 + 8], [rx(x + pw), y - ph / 2], [rx(x + pw), y + ph / 2 - 6], [rx(x + 8), y + ph / 2]], { wash: '#FFF8EA', washOp: 255, ink: PAL.ink, sw: .8 });
      for (let r = 0; r < 15; r++) {
        const ly = y - ph / 2 + 30 + r * 19, hi = [3, 8, 12].indexOf(r), x1 = x + pw - 26 - (r % 4 === 3 ? 60 : 0);
        if (hi >= 0 && o.lit && o.lit[hi] > 0) paint(rectPts(rx(x + 26), ly - 8, (rx(x1) - rx(x + 26)), 16), { wash: '#FFE08A', washOp: 220 * o.lit[hi], ink: null });
        inkLine([[rx(x + 30), ly], [rx(x1), ly]], .7, '#8A7A6A', 'inkfine', 0);
        if (hi >= 0) sentences.push([rx(x + 30), ly]);
      }
      // the folio at the bottom corner of the article page
      paint(ellPts(rx(x + pw - 30), y + ph / 2 - 22, 10, 10, 10), { ink: '#8A7A6A', sw: .6 });
    } else {
      paint([[rx(x + 8), y - ph / 2 + 8], [rx(x + pw), y - ph / 2], [rx(x + pw), y + ph / 2 - 6], [rx(x + 8), y + ph / 2]], { wash: '#6B3F2E', washOp: 255, ink: PAL.ink, sw: 1 });
      if (sx < -.8) paint(rrPts(x - pw * .7, y - 40, pw * .4, 60, 8), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .7 });
    }
    return { fields, sentences };
  }
  // a golden thread from a to b, drawn up to k, with a small page tag at the end
  function thread(a, b, k, i) {
    if (k <= 0) return;
    boilSeed('a1s6 thread' + i);
    const mid = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 60], P = through([a, mid, b], 8), n = Math.max(2, Math.round(P.length * k));
    const Q = P.slice(0, n);
    for (let j = 0; j < Q.length; j += 4) glow(Q[j][0], Q[j][1], 18, '#FFD27A', .45);
    inkLine(Q, 2, '#E8A33A', 'ink', .5);
    if (k >= 1) { const e = b; paint(rrPts(e[0] + 180, e[1] - 12, 34, 24, 5), { wash: '#FFE08A', washOp: 255, ink: PAL.ink, sw: .6 }); letter('p.', e[0] + 197, e[1] + 1, 16, PAL.night, { weight: 700 }); }
  }

  function shot(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const crack = .95, unroll = crack + .15, unrolled = unroll + 1.3;
    const treA = unrolled + .1, recA = lerp(L(0), E(0), .72), cartA = L(1) + .05;
    const fiveA = L(1) + .4, fiveTxt = L(1) + .8, sixteen = L(1) + 1.55, grim = E(1) + .05;
    const keyA = L(2) + .5, threadsA = L(2) + 1.25, nineTxt = L(2) + 2.75, missA = nineTxt + .3;
    const shrugT = L(3) + .2, rollUp = E(3) + .15, header = L(4) + .1;
    const th = [lerp(L(4), E(4), .38), lerp(L(4), E(4), .55), lerp(L(4), E(4), .72)];
    const closeT = E(4) + .1, capA = L(5) + .05, capB = capA + .55, gust = capB + .1, fly = gust + .35, terr = S.dur - .95;
    const [cx, cy, z] = camKF(st, [[0, SEAL[0], SEAL[1] + 20, 3.0], [.9, SEAL[0], SEAL[1] + 20, 2.9], [unrolled + .2, 1150, 800, 1.2], [E(3), 1150, 800, 1.24],
      [rollUp + .5, 1200, 830, 1.3], [header + .2, BOOK.x, 815, 2.15], [th[2] + .9, BOOK.x, 818, 2.2], [closeT + .1, 1090, 830, 1.45], [gust, 1090, 830, 1.5], [S.dur, 1150, 700, 2.2]]);
    camBegin(cx, cy, z);
    drawPlate('library', 0, 0);
    // the book on its lectern (behind the map until the map rolls up)
    const lit = th.map(a => seg(st, a + .5, a + .7));
    const B = book({ close: seg(st, closeT, closeT + .35) * (1 - seg(st, gust, gust + .25)), lit });
    // pages turned by the gust (they flutter over the spine and fly off)
    if (st > gust) {
      for (let i = 0; i < 7; i++) {
        const a = gust + i * .09, k = seg(st, a, a + .3); if (k <= 0 || st > fly + .3) continue;
        const sx = Math.cos(k * Math.PI);
        boilSeed('a1s6 flutter' + i);
        paint([[BOOK.x, BOOK.y - BOOK.ph / 2 + 8], [BOOK.x + BOOK.pw * sx, BOOK.y - BOOK.ph / 2 - 20 * Math.sin(k * Math.PI)], [BOOK.x + BOOK.pw * sx, BOOK.y + BOOK.ph / 2 - 26 * Math.sin(k * Math.PI)], [BOOK.x, BOOK.y + BOOK.ph / 2]], { wash: '#FFF8EA', washOp: 255, ink: PAL.ink, sw: .6 });
      }
    }
    // the map: rolled with its seal → unrolls → (later) rolls up again
    const down = ease(seg(st, unroll, unrolled)) * (1 - ease(seg(st, rollUp, rollUp + .55)));
    const hh = MAP.h * down;
    if (hh > 2) drawPlatePart('a1s6_map', 0, 0, MAP.w, hh, MAP.x, MAP.y, 1);
    rod(MAP.x, MAP.x + MAP.w, MAP.y, 16);
    if (hh > 2 || st < unroll + .1) { boilSeed('a1s6 roll'); paint(rrPts(MAP.x - 6, MAP.y + hh - 22, MAP.w + 12, 44, 22), { wash: '#DCC08A', washOp: 255, ink: PAL.ink, sw: .9 }); rod(MAP.x, MAP.x + MAP.w, MAP.y + hh + 8, 14); }
    if (st < crack + .4) {   // the ochre wax seal, cracking
      const c = seg(st, crack, crack + .35);
      boilSeed('a1s6 seal');
      for (const sd of [-1, 1]) paint(ellPts(SEAL[0] + sd * c * 40, SEAL[1] + 10 + c * c * 60, 34 * (1 - .3 * c), 34 * (1 - .3 * c), 16, 0, sd * c), { wash: PAL.ochre, washOp: 255 * (1 - c), ink: mixCol(PAL.ink, PAL.ochre, .4), sw: .8 });
      if (c === 0) paint(starPts(SEAL[0], SEAL[1] + 10, 18, .45, 5), { wash: '#B07A2A', washOp: 255, ink: null });
    }
    // the treasures, the threads, the cartouche
    if (down > .98) {
      const found = i => (FIRST.includes(i) && st > fiveA + FIRST.indexOf(i) * .12) || (THEN.includes(i) && st > threadsA + .35 + THEN.indexOf(i) * .3);
      // reference threads from found treasures to the new ones (after the new key)
      THEN.forEach((j, n) => {
        const a = TREAS[FIRST[n % FIRST.length]], b = TREAS[j], k = seg(st, threadsA + n * .3, threadsA + n * .3 + .35);
        if (k > 0) { boilSeed('a1s6 ref' + n); const P = [[MAP.x + a.x, MAP.y + a.y], [MAP.x + lerp(a.x, b.x, k), MAP.y + lerp(a.y, b.y, k) - 30 * Math.sin(k * Math.PI)]]; inkLine(P, 2, '#E8A33A', 'ink', .4); }
      });
      TREAS.forEach((T0, i) => {
        const recent = RECENT.includes(i), missing = recent && !FIRST.includes(i) && !THEN.includes(i) && st > missA + (i % 7) * .06;
        const state = found(i) ? 'found' : missing ? 'missing' : st > recA + (RECENT.indexOf(i) % 8) * .06 && recent ? 'recent' : 'old';
        treasure(MAP.x + T0.x, MAP.y + T0.y, state, seg(st, treA + i * .05, treA + i * .05 + .3), st);
      });
      // cartouche « Test de rappel : 5 puis 9 sur 16 »
      const ck = seg(st, cartA - .2, cartA + .15);
      if (ck > 0) {
        const size = 34, parts = ['Test de rappel :', '5', 'puis 9', 'sur 16'], ks = [seg(st, cartA, cartA + .3), seg(st, fiveTxt, fiveTxt + .3), seg(st, nineTxt, nineTxt + .3), seg(st, sixteen, sixteen + .3)];
        const ws = parts.map(p => textW(p, size) + 18), tot = ws.reduce((a, b) => a + b, 0), cxm = MAP.x + MAP.w / 2, cym = MAP.y + MAP.h - 62;
        boilSeed('a1s6 cart'); push(); translate(cxm, cym); scale(backOut(ck)); paint(rrPts(-tot / 2 - 26, -30, tot + 52, 60, 14), { wash: '#FFF3DC', washOp: 255, ink: '#6E4A34', sw: 1 }); pop();
        let xx = cxm - tot / 2;
        parts.forEach((p, i) => { if (ks[i] > 0) letter(p, xx + ws[i] / 2, cym + 1, size, i === 2 ? '#B07A2A' : PAL.night, { weight: 700, pop: ks[i] }); xx += ws[i]; });
      }
    }
    // the threads of the « loupe de vérité » (book), the header
    if (st > header - .2 && st < closeT) {
      const hk = seg(st, header, header + .35);
      if (hk > 0) letter('Chaque information = une citation exacte + sa page', BOOK.x, BOOK.y - BOOK.ph / 2 - 46, 26, PAL.night, { weight: 700, pop: hk, stroke: PAL.cream, strokeW: .25 });
      th.forEach((a, i) => { if (B.fields[i] && B.sentences[i]) thread(B.fields[i], B.sentences[i], seg(st, a, a + .5), i); });
    }
    // Awa: points at the map, grimaces, forges a key, shrugs; later closes the book and turns her cap
    {
      const ax = st < rollUp + .3 ? AWA_X : lerp(AWA_X, 960, ease(seg(st, rollUp + .3, closeT - .5)));
      const walking = st > rollUp + .3 && st < closeT - .5;
      const A0 = actP(st, [[0, 'neutre', { lookX: .8 }], [unrolled - .3, 'emerveillee', { lookX: .8, lookY: -.3 }], [fiveTxt + .2, 'concentree', { lookX: .8 }], [grim, 'grimace'],
        [keyA - .2, 'determinee', { lookX: .6, lookY: -.3 }], [nineTxt + .1, 'joie', { lookX: .6 }], [shrugT, 'fiere'], [rollUp + .3, 'neutre', { lookX: .8 }], [closeT - .2, 'determinee', { lookX: .6 }], [capA + .2, 'joie'], [gust + .05, 'surprise', { lookY: -.8 }]]);
      const point = bump(st, treA + .3, grim - .2, .3), key = bump(st, keyA - .1, threadsA + 1.4, .25), sh = bump(st, shrugT, E(3) - .1, .25), close = bump(st, closeT - .25, closeT + .35, .15), cap = bump(st, capA - .1, capB + .1, .12);
      const A = { ...A0, view: walking ? 'side' : 'q', walk: walking ? (ax - AWA_X) / (1.9 * AWA_S) : null, cap: 'labo', capTurn: ease(seg(st, capA + .1, capB)), braidSwing: st > gust ? .6 + .15 * Math.sin(st * 20) : undefined };
      if (point > 0) { A.aR = lerp(.2, 2.0, point); A.eR = lerp(-.15, .1, point); A.handR = 'point'; }
      if (key > 0) { A.aR = lerp(.2, 2.6, key); A.eR = -.3; A.handR = 'fist'; }
      if (sh > 0) { A.aL = lerp(.12, .95, sh); A.aR = lerp(.12, .95, sh); A.eL = lerp(-.15, -1.4, sh); A.eR = lerp(-.15, -1.4, sh); }
      if (close > 0) { A.aR = lerp(.2, 1.4, close); A.eR = -.4; }
      if (cap > 0) { A.aL = lerp(.12, 2.9, cap); A.eL = lerp(-.15, 1.1, cap); A.aR = lerp(A.aR ?? .12, 2.9, cap); A.eR = lerp(A.eR ?? -.15, 1.1, cap); }
      awa(ax, FLOOR, AWA_S, A);
      if (key > .3) {   // the new key, forged in sparks in her raised hand
        const hx = ax + 1.5 * AWA_S + Math.sin(2.6) * 3.7 * AWA_S * .9, hy = FLOOR - 6.75 * AWA_S - 2.6 * AWA_S;
        A1_KEY(hx + 10, hy - 50, .9, 'reseau', { rot: .2 + .1 * Math.sin(st * 3), key: 'new', glow: .8 * seg(key, .3, .6) });
        const f = seg(st, keyA, keyA + .5); if (f > 0 && f < 1) { boilSeed('a1s6 forge'); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, r = 20 + 70 * easeOut(f); paint(ellPts(hx + 10 + Math.cos(a) * r, hy - 50 + Math.sin(a) * r, 4, 4, 6), { wash: '#FFD27A', washOp: 255 * (1 - f), ink: null }); } }
      }
    }
    // Jumo
    {
      let jx = 1880 + 20 * Math.sin(st * 1.1), jy = 600 + 14 * Math.sin(st * 2), jf = 'happy', jr = .06 * Math.sin(st * 1.3), ju = 9;
      if (st > fiveA && st < keyA) jf = st < grim ? 'wide' : 'sad';
      if (st > threadsA && st < rollUp) jf = st < nineTxt ? 'excl' : 'love';
      if (st > rollUp && st < closeT) { const k = ease(seg(st, rollUp + .2, header + .1)), i = th.findIndex(a => st < a + .7), tgt = i < 0 ? 2 : i, sx0 = BOOK.x + 140, sy0 = BOOK.y - BOOK.ph / 2 + 30 + [3, 8, 12][tgt] * 19;
        jx = lerp(1880, sx0 + 30 * Math.sin(st * 2), k); jy = lerp(600, sy0 - 80, k); ju = lerp(9, 5.5, k); jf = 'scan';
        if (k > .9) { boilSeed('a1s6 beam'); paint([[jx - 8, jy + 18], [jx + 8, jy + 18], [jx + 60, jy + 84], [jx - 60, jy + 84]], { wash: '#BDF1F6', washOp: 90, ink: null }); glow(jx, jy + 80, 50, PAL.data, .4); }
        const d = th.some(a => st > a + .5 && st < a + .9); if (d) jf = 'check';
      }
      if (st > closeT) { const k = ease(seg(st, closeT, closeT + .6)); jx = lerp(BOOK.x + 140, 1400, k); jy = lerp(BOOK.y - 100, 700, k); ju = lerp(5.5, 8, k); jf = st > gust ? 'dizzy' : 'happy'; if (st > gust) { jx += (st - gust) * 300; jy -= (st - gust) * 200; jr = (st - gust) * 4; } }
      jumo(jx, jy, ju, { stage: 0, face: jf, prop: 'spin', spin: st * 9, rot: jr, lookX: st < rollUp ? -1 : 0, boilKey: 'jumo' });
    }
    // the gust: wind strokes
    if (st > gust - .1) {
      boilSeed('a1s6 wind');
      for (let i = 0; i < 6; i++) { const k = seg(st, gust - .1 + i * .07, gust + .5 + i * .07); if (k <= 0 || k >= 1) continue; const y0 = 700 + i * 70, x0 = lerp(300, 2000, k); inkLine([[x0 - 260, y0 + 20], [x0 - 120, y0 - 10], [x0, y0 + 6]], 2.2 * Math.sin(k * Math.PI), '#EAF4F4', 'ink', .6); }
    }
    camEnd();
    // the pages fly up and become fields seen from the sky (screen space), then the territory of 2.1
    if (st > fly) {
      const COLS = ['#9DC07B', '#C8D48A', '#E3C98A', '#B4CF84', '#D9B872', '#86B06A', '#E8D39A', '#A7C27A'];
      const [bx, by] = toScreen(BOOK.x, BOOK.y, LAST_CAM), nx = 8, ny = 5, tw = W / nx, tht = H / ny;
      const terrK = seg(st, terr, terr + .55);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const id = j * nx + i, a = fly + hash(id * 1.7) * .5, k = seg(st, a, a + .75); if (k <= 0) continue;
        const tx = (i + .5) * tw, ty = (j + .5) * tht, e = ease(k), p = arcPt([bx, by], [tx, ty], 300 * (1 - hash(id)), e);
        const w = lerp(60, tw + 6, e), h = lerp(80, tht + 6, e), rot = (1 - e) * (hash(id * 3) - .5) * 5;
        boilSeed('a1s6 page' + id);
        paint(xform([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], p[0], p[1], rot), { wash: mixCol('#FFF8EA', COLS[Math.floor(hash(id * 5) * COLS.length)], seg(k, .3, .9)), washOp: 255 * (1 - terrK), ink: mixCol(PAL.ink, '#6E8A4E', e), sw: .7 * (1 - terrK) });
      }
      if (terrK > 0) drawPlate('territory', 0, 0, { s: W / 2400, alpha: terrK });
    }
    // entry: the ochre stamp of 1.5 fills the frame, and shrinks into the wax seal
    if (st < .75) {
      const k = easeIn(seg(st, 0, .7)), [sx, sy] = [lerp(W / 2, 960, k), lerp(H / 2, 510, k)], r = lerp(1300, 34 * 2.95, k);
      boilSeed('a1s6 entry'); paint(ellPts(sx, sy, r, r, 40), { wash: PAL.ochre, washOp: 255 * (1 - seg(st, .6, .75)), ink: null });
    }
  }

  scene('1.6', S => [[0, shot]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i);
      const crack = .95, unroll = crack + .15, unrolled = unroll + 1.3, treA = unrolled + .1, recA = lerp(L(0), E(0), .72), cartA = L(1) + .05, fiveA = L(1) + .4, grim = E(1) + .05;
      const keyA = L(2) + .5, threadsA = L(2) + 1.25, nineTxt = L(2) + 2.75, missA = nineTxt + .3, shrugT = L(3) + .2, rollUp = E(3) + .15, header = L(4) + .1;
      const th = [lerp(L(4), E(4), .38), lerp(L(4), E(4), .55), lerp(L(4), E(4), .72)], closeT = E(4) + .1, capA = L(5) + .05, capB = capA + .55, gust = capB + .1, fly = gust + .35;
      const out = [[.2, 'whoosh', .06], [crack, 'knock', .12], [crack + .05, 'scratch', .05], [unroll, 'rustle', .12], [unroll + .6, 'rustle', .08], [recA, 'sparkle', .05]];
      for (let i = 0; i < TOT; i += 3) out.push([treA + i * .05, 'tick', .03, (i / TOT - .5) * .6]);
      for (let i = 0; i < 5; i++) out.push([fiveA + i * .12, 'bip', .05, .2]);
      out.push([cartA, 'pop', .06], [grim, 'bipsad', .05, .5], [keyA, 'sparkle', .1, -.5], [keyA + .4, 'chime', .07, -.5]);
      for (let i = 0; i < 4; i++) out.push([threadsA + .35 + i * .3, 'ding', .05, .2]);
      out.push([missA, 'tick', .04], [shrugT, 'boing', .04, -.5], [rollUp, 'rustle', .1], [rollUp + .5, 'thud', .06], [header, 'pop', .05]);
      th.forEach(a => out.push([a, 'slideUp', .04, .2], [a + .5, 'ding', .09, .2]));
      out.push([closeT + .3, 'thud', .2], [capA + .1, 'whoosh', .05, -.2], [capA + .35, 'clic', .06, -.2], [gust, 'whoosh', .18], [gust + .15, 'rustle', .12], [fly, 'rustle', .12], [fly + .3, 'whoosh', .1], [fly + .25, 'bipq', .05, .4]);
      return out;
    });
})();
