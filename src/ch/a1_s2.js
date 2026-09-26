// scène 1.2 — Les mots magiques (V2 § 4, acte I).
// Lines: L0 « Pour ouvrir la bibliothèque, il faut les bons mots : » · L1 « jumeau numérique, … exploration de modèles. » ·
//        L2 « Combinés, ils forment six clés. » · L3 « On cherche de 2010 à 2026, et seulement des articles. »
// One continuous shot on the façade of the silo-library (plate a1s2_facade), the camera does the cutting:
//   0 → L1      opens on the wooden door that ends 1.1 (window.DOOR_ARCH, same place on screen), pulls back to the
//               whole silo-library, then pushes in on the puzzle lectern (pupitre) where Awa and Jumo stand
//   L1          seven keyword pieces pop out of the lectern, one per spoken word, and line up in the air
//   L2          they spiral together, flash, and six keys of different shapes come out (Q1–Q6)
//   L3          pull back to the door: the « 2010 → 2026 » frieze lights up above it, the lintel plaque writes
//               « 6 équations de recherche · 2010–2026 · articles (thèses et mémoires exclus) », gag: a fat
//               « THÈSE » volume hops to the door, reads the sign (« … thèses et mémoires : demi-tour »), leaves vexed
//   → end       the door swings open, the keys fly in toward the four glowing wells (1.3 opens on a well)
(() => {
  // ---------------- world layout (plate a1s2_facade, 2400 × 1350) ----------------
  const GROUND = 1150;
  const DOOR = { cx: 1200, top: 783, w: 260, h: 367 };          // the door, world px (same shape as 1.1's DOOR_ARCH)
  const K1 = DOOR.w / 560;                                        // 1.1's door (560 wide) → this door
  const HINGE = DOOR.cx - DOOR.w / 2;
  const LECT = { x: 862, y: GROUND };                             // the puzzle lectern
  const AWA_X = 745, AWA_S = 17;
  const SIGN = { x: 1515, y: 985, w: 270, h: 170 };                // « Articles scientifiques bienvenus — … »
  const FRISE = { x0: 1020, x1: 1380, y: 722 };
  const PLAQUE = { x: 1200, y: 640, w: 1040, h: 66 };
  const archW = (cx, top, w, h) => { const P = [[cx - w / 2, top + h]]; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; P.push([cx + Math.cos(a) * w / 2, top + w / 2 + Math.sin(a) * w / 2]); } P.push([cx + w / 2, top + h]); return P; };
  const siloY = (x, base, amp) => base + amp * Math.sqrt(Math.max(0, 1 - Math.pow((x - 1200) / 560, 2)));

  // ---------------- the plate: the silo-library's façade ----------------
  definePlate('a1s2_facade', { w: 2400, h: 1350, res: 1.25, paint(w, h) {
    sky(w, h, [[0, '#9CC8DE'], [420, '#CFE3EA'], [820, '#F4E6CC'], [1100, '#F7DDB8']], 1150);
    for (const [x, y, r] of [[330, 250, 90], [470, 280, 64], [1990, 200, 84], [2130, 236, 58], [2250, 520, 50]]) { blob(x, y, r, '#FFF6E8', 200, .18); blob(x + r * .6, y + r * .2, r * .7, '#FBEAD6', 170, .18); }
    band(-40, w + 40, wave(1010, 22, .003, 1), h, '#C9DAB4', 170);
    band(-40, w + 40, wave(1060, 16, .004, 3), h, '#AFCB93', 190);
    treeP(260, 1080, 190, '#7FA968'); treeP(420, 1100, 130); treeP(2080, 1090, 210, '#6E9A55'); treeP(2250, 1100, 140, '#7FA968');
    band(-40, w + 40, wave(1128, 6, .004, 2), h + 40, '#B8D48E', 235);
    // the silo: a wooden cylinder, darker to the sides, metal hoops, a cone roof with a skylight lantern
    const L = 640, R = 1760, body = [];
    for (let i = 0; i <= 24; i++) { const x = lerp(L, R, i / 24); body.push([x, siloY(x, 392, 26)]); }
    for (let i = 24; i >= 0; i--) { const x = lerp(L, R, i / 24); body.push([x, siloY(x, 1128, 26)]); }
    area(body, '#E2BE86', '#D2A86C', 110);
    for (let i = 0; i < 16; i++) {   // staves: roundness
      const x0 = lerp(L, R, i / 16), x1 = lerp(L, R, (i + 1) / 16), k = Math.abs((x0 + x1) / 2 - 1200) / 560;
      wc([[x0, siloY(x0, 392, 26)], [x1, siloY(x1, 392, 26)], [x1, siloY(x1, 1128, 26)], [x0, siloY(x0, 1128, 26)]], '#A87A48', 20 + 110 * k * k * k, .02, .6, .3);
    }
    for (let i = 1; i < 16; i++) { const x = lerp(L, R, i / 16); pen([[x, siloY(x, 392, 26) + 4], [x + 2, siloY(x, 1128, 26) - 2]], .45, '#9A6E44', .2); }
    for (const yb of [470, 880, 1060]) {   // metal hoops
      const P = []; for (let i = 0; i <= 24; i++) { const x = lerp(L, R, i / 24); P.push([x, siloY(x, yb, 26)]); }
      paint(ribbon(P, 16, 16), { wash: '#8C8A92', washOp: 255, ink: PAL.ink, sw: .6 });
      for (let i = 1; i < 12; i++) { const x = lerp(L, R, i / 12); paint(ellPts(x, siloY(x, yb, 26), 3.5, 3.5, 6), { wash: '#5E5A66', ink: null }); }
    }
    paint(body, { ink: PAL.ink, sw: 1.1 });
    // roof
    const roof = [[L - 40, siloY(L, 392, 26) + 8]];
    for (let i = 0; i <= 12; i++) { const x = lerp(L - 40, R + 40, i / 12); roof.push([x, siloY(clamp(x, L, R), 392, 26) + 8 + 8 * Math.sin(i / 12 * Math.PI)]); }
    roof.push([R + 40, siloY(R, 392, 26) + 8], [1270, 150], [1130, 150]);
    area([[L - 40, 400], [1130, 150], [1270, 150], [R + 40, 400], [R + 40, 430], [1200, 440], [L - 40, 430]], '#58789A', '#46638C', 120);
    for (let i = 1; i < 10; i++) { const x = lerp(L - 30, R + 30, i / 10); pen([[lerp(1135, 1265, i / 10), 156], [x, 420 + 14 * Math.sin(i / 10 * Math.PI)]], .5, '#34547E', .1); }
    paint([[L - 40, 400], [1130, 150], [1270, 150], [R + 40, 400], [R + 40, 430], [1200, 440], [L - 40, 430]], { ink: PAL.ink, sw: 1 });
    wcw([[1135, 150], [1265, 150], [1255, 70], [1145, 70]], '#E9D6B0', 255, '#D8BE98', 80);            // lantern
    paint([[1150, 140], [1250, 140], [1242, 82], [1158, 82]], { wash: '#FBE3A6', washOp: 255, ink: PAL.ink, sw: .7 });
    for (let k = 1; k < 4; k++) pen([[1150 + k * 25, 140], [1150 + k * 25, 82]], .6, '#8A6246', 0);
    paint([[1125, 72], [1275, 72], [1200, 18]], { wash: '#46638C', washOp: 255, ink: PAL.ink, sw: .8 });
    pen([[1200, 20], [1200, -10]], 1.1); paint([[1200, -8], [1236, -2], [1200, 4]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: .5 });
    // two arched windows lit from inside, with shelves of books
    for (const wx of [860, 1540]) {
      const P = archW(wx, 470, 120, 140); area(P, '#FBE3A6', '#F2CE82', 100);
      for (const yy of [540, 580]) { pen([[wx - 56, yy], [wx + 56, yy]], .9, '#8A6246', 0); for (let k = 0; k < 7; k++) paint(rectPts(wx - 52 + k * 15, yy - 24 + 6 * hash(k + yy), 11, 24 - 6 * hash(k + yy)), { wash: ['#C8553D', '#3E7C4A', '#1F3A5F', '#D99A3D', '#7B5CA8', '#56A6B3'][Math.floor(hash(k * 3 + wx) * 6)], washOp: 200, ink: null }); }
      paint(P, { ink: PAL.ink, sw: 1 }); paint(archW(wx, 462, 136, 152), { ink: '#8A6246', sw: 1.6 });
    }
    // the lintel plaque (its words are lettered live) and the frieze beam (its lamps are painted live)
    wcw(rrPts(PLAQUE.x - PLAQUE.w / 2, PLAQUE.y - PLAQUE.h / 2, PLAQUE.w, PLAQUE.h, 14), '#8A6246', 255, '#6E4A34', 100);
    paint(rrPts(PLAQUE.x - PLAQUE.w / 2 + 10, PLAQUE.y - PLAQUE.h / 2 + 9, PLAQUE.w - 20, PLAQUE.h - 18, 10), { wash: '#F3E3C3', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(PLAQUE.x - PLAQUE.w / 2, PLAQUE.y - PLAQUE.h / 2, PLAQUE.w, PLAQUE.h, 14), { ink: PAL.ink, sw: 1 });
    wcw(rrPts(FRISE.x0 - 40, FRISE.y - 18, FRISE.x1 - FRISE.x0 + 80, 36, 10), '#6E4A34', 255, '#5A3A2A', 90);
    paint(rrPts(FRISE.x0 - 40, FRISE.y - 18, FRISE.x1 - FRISE.x0 + 80, 36, 10), { ink: PAL.ink, sw: .9 });
    // stone arch around the door; the doorway itself is the dark inside (seen when the door opens)
    const dP = archW(DOOR.cx, DOOR.top, DOOR.w, DOOR.h);
    area(archW(DOOR.cx, DOOR.top - 36, DOOR.w + 72, DOOR.h + 36), '#D8CDBA', '#BFB29C', 110);
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI, cx = DOOR.cx, cy = DOOR.top + DOOR.w / 2; pen([[cx + Math.cos(a) * DOOR.w / 2, cy + Math.sin(a) * DOOR.w / 2], [cx + Math.cos(a) * (DOOR.w / 2 + 36), cy + Math.sin(a) * (DOOR.w / 2 + 36)]], .7, '#8C7F6A', 0); }
    for (const sd of [-1, 1]) for (let k = 1; k < 5; k++) { const x = DOOR.cx + sd * (DOOR.w / 2 + 18), y = DOOR.top + DOOR.w / 2 + k * 42; pen([[x - 18, y], [x + 18, y]], .7, '#8C7F6A', 0); }
    paint(archW(DOOR.cx, DOOR.top - 36, DOOR.w + 72, DOOR.h + 36), { ink: PAL.ink, sw: 1 });
    area(dP, '#2E2C40', '#232133', 120);
    blob(DOOR.cx, DOOR.top + DOOR.h - 40, 130, '#3E6E8A', 170, .15);
    paint(dP, { ink: PAL.ink, sw: 1 });
    wcw([[DOOR.cx - 170, GROUND - 6], [DOOR.cx + 170, GROUND - 6], [DOOR.cx + 190, GROUND + 18], [DOOR.cx - 190, GROUND + 18]], '#CFC3AE', 255, '#B8AA92', 90);   // threshold
    pen([[DOOR.cx - 190, GROUND + 18], [DOOR.cx + 190, GROUND + 18]], .8);
    // gravel forecourt and a few pots
    wc(ellPts(1200, 1250, 760, 96, 30), '#E6D6B4', 170, .05, .5, .3);
    for (const [x, c] of [[640, '#6E9A55'], [1790, '#7FA968']]) {
      wcw([[x - 40, 1150], [x + 40, 1150], [x + 30, 1100], [x - 30, 1100]], '#C8703D', 255, '#A85A30', 90); pen([[x - 40, 1150], [x - 30, 1100], [x + 30, 1100], [x + 40, 1150]], .7);
      for (const [dx, dy, r] of [[0, -40, 46], [-30, -20, 32], [30, -22, 34]]) blob(x + dx, 1100 + dy, r, c, 210, .08);
    }
    for (let i = 0; i < 60; i++) { const x = hash(i + 3) * w, y = 1150 + hash(i + 70) * 190; if (Math.abs(x - 1200) < 700 && y < 1330) continue; pen([[x, y], [x + 4, y - 16 - hash(i) * 14]], .6, '#6E9A55', .3); }
  } });

  // ---------------- small private helpers ----------------
  const MC = document.createElement('canvas').getContext('2d');
  const textW = (txt, size, weight = 600, font = FONT.round) => { MC.font = `${weight} ${size}px ${font}`; return MC.measureText(txt).width; };
  const logZ = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
  // camera keys [t, cx, cy, z]: position eased, zoom interpolated in log space (constant perceived speed)
  function camKF(t, keys) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
      const a = keys[i - 1], b = keys[i], k = ease((t - a[0]) / (b[0] - a[0]));
      return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), logZ(a[3], b[3], k)];
    }
    return keys[keys.length - 1].slice(1);
  }

  // the door: 1.1's door shape, placed on the façade; open 0..1 swings it on its left hinge
  function door(open = 0, sw = 1.1 * K1 * 1.9) {
    const th = ease(open) * 1.3, c = Math.cos(th);
    const P = archW(DOOR.cx, DOOR.top, DOOR.w, DOOR.h).map(([x, y]) => [HINGE + (x - HINGE) * c, y + (x - HINGE) * Math.sin(th) * .06]);
    boilSeed('a1s2 door');
    paint(P, { wash: mixCol('#8A6246', '#5A3E2E', open * .6), washOp: 255, ink: PAL.ink, sw });
    for (let i = 1; i < 4; i++) { const x = HINGE + (lerp(700, 1220, i / 4) - 960) * K1 * c + (DOOR.w / 2) * c; inkLine([[x, DOOR.top + (420 - 170) * K1], [x, DOOR.top + (950 - 170) * K1]], 1.2 * K1 * 1.6, '#6E4A34', 'ink', 0); }
    paint(ellPts(HINGE + (DOOR.w / 2 + 180 * K1) * c, DOOR.top + 470 * K1, 14 * K1 * c + .5, 14 * K1, 10), { wash: PAL.ochre, ink: PAL.ink, sw: .7 * K1 * 1.6 });
  }

  // a wooden lectern with a puzzle tray on its slanted top
  function lectern(x, y, glowK = 0) {
    boilSeed('a1s2 lectern');
    paint([[x - 16, y], [x + 16, y], [x + 12, y - 92], [x - 12, y - 92]], { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .8 });
    paint(ellPts(x, y - 2, 52, 10, 14), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .7 });
    const top = [[x - 78, y - 98], [x + 78, y - 118], [x + 82, y - 102], [x - 74, y - 80]];
    paint(top, { wash: PAL.wood, washOp: 255, ink: PAL.ink, sw: .9 });
    paint([[x - 64, y - 96], [x + 66, y - 113], [x + 68, y - 106], [x - 62, y - 88]], { wash: '#6E4A34', washOp: 255, ink: null });   // the tray
    if (glowK > .02) glow(x, y - 104, 70, PAL.ochre, .5 * glowK);
    for (let k = 1; k < 5; k++) inkLine([[x - 64 + k * 26, y - 96 - k * 3.4], [x - 62 + k * 26, y - 88 - k * 3.4]], .5, '#D9A45A', 'inkfine', 0);
  }

  // a keyword piece: a jigsaw tile with a tab on its right and its top
  function piecePts(x, y, w, h, rot = 0) {
    const P = [], r = h * .2;
    P.push([-w / 2, -h / 2], [-w * .12, -h / 2]);
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; P.push([Math.cos(a) * r, -h / 2 - r * .8 + Math.sin(a) * r * .9 + r * .8]); }
    P.push([w * .12, -h / 2], [w / 2, -h / 2], [w / 2, -h * .2]);
    for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + i / 8 * Math.PI; P.push([w / 2 + r * .1 + Math.cos(a) * r, Math.sin(a) * r]); }
    P.push([w / 2, h * .2], [w / 2, h / 2], [-w / 2, h / 2]);
    return xform(P, x, y, rot);
  }
  function piece(x, y, s, label, lit, rot = 0, key = '') {
    const w = 136 * s, h = 58 * s;
    if (lit > .02) glow(x, y, 120 * s * (.7 + .3 * lit), PAL.ochre, .55 * lit);
    boilSeed('a1s2 piece ' + key);
    paint(piecePts(x, y, w, h, rot), { wash: mixCol('#F1E2C4', '#FFE7A8', lit), washOp: 255, ink: PAL.ink, sw: .8 * s + .2 });
    if (label && s > .25) letter(label, x, y + 1 * s, 15 * s, mixCol('#7A6A5A', PAL.night, lit), { weight: 600, rot, lh: 1.05, alpha: .45 + .55 * lit });
  }

  // one key, vertical, bow on top (its shape tells which key it is), (x, y) = centre, s = scale
  const KEY_KINDS = ['tamis', 'loupe', 'epi', 'engrenage', 'feuille', 'reseau'];
  function key(x, y, s, kind, o = {}) {
    const rot = o.rot || 0, brass = o.col || '#D9A45A', dk = '#9A6E2A';
    if (o.glow) glow(x, y - 20 * s, 60 * s, o.glowCol || '#FFE3A0', o.glow);
    boilSeed('a1s2 key ' + (o.key ?? kind));
    push(); translate(x, y); rotate(rot); scale(s);
    // shaft + bit
    paint(rrPts(-4, -16, 8, 58, 3), { wash: brass, washOp: 255, ink: PAL.ink, sw: .7 });
    paint([[4, 26], [18, 26], [18, 34], [12, 34], [12, 40], [4, 40]], { wash: brass, washOp: 255, ink: PAL.ink, sw: .7 });
    // bow
    const by = -34;
    if (kind === 'engrenage') paint(starPts(0, by, 24, .74, 8, 0), { wash: brass, washOp: 255, ink: PAL.ink, sw: .8 });
    else if (kind === 'feuille') paint([[0, by - 26], [16, by - 8], [12, by + 12], [0, by + 18], [-12, by + 12], [-16, by - 8]], { wash: '#9DBE6A', washOp: 255, ink: PAL.ink, sw: .8, curv: .5 });
    else if (kind === 'epi') { paint(ellPts(0, by, 14, 24, 14), { wash: '#E8C66A', washOp: 255, ink: PAL.ink, sw: .8 }); }
    else paint(ellPts(0, by, 20, 20, 18), { wash: brass, washOp: 255, ink: PAL.ink, sw: .8 });
    if (kind === 'tamis') { paint(ellPts(0, by, 13, 13, 16), { wash: '#F3E3C3', washOp: 255, ink: PAL.ink, sw: .5 }); for (let k = -1; k <= 1; k++) { inkLine([[k * 6, by - 11], [k * 6, by + 11]], .45, dk, 'inkfine', 0); inkLine([[-11, by + k * 6], [11, by + k * 6]], .45, dk, 'inkfine', 0); } }
    else if (kind === 'loupe') { paint(ellPts(0, by, 13, 13, 16), { wash: '#BFE9F0', washOp: 255, ink: PAL.ink, sw: .5 }); inkLine([[-6, by - 5], [-2, by - 9]], 1.2, PAL.cream, 'ink', 0); }
    else if (kind === 'epi') { for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) paint(ellPts(sd * 6, by - 15 + k * 9, 5, 7, 8, 0, sd * .5), { wash: '#D9A43A', ink: PAL.ink, sw: .4 }); inkLine([[0, by - 30], [0, by - 40]], .8, dk, 'inkfine', 0); }
    else if (kind === 'engrenage') paint(ellPts(0, by, 8, 8, 12), { wash: '#6E4A34', ink: PAL.ink, sw: .5 });
    else if (kind === 'feuille') { inkLine([[0, by + 16], [0, by - 22]], .7, '#4E7A3A', 'inkfine', 0); for (let k = 0; k < 3; k++) for (const sd of [-1, 1]) inkLine([[0, by - 10 + k * 9], [sd * 9, by - 16 + k * 9]], .5, '#4E7A3A', 'inkfine', 0); }
    else if (kind === 'reseau') { paint(ellPts(0, by, 14, 14, 16), { wash: '#1F3A5F', washOp: 255, ink: PAL.ink, sw: .5 }); const N = [[0, by - 8], [-8, by + 5], [8, by + 5]]; for (let k = 0; k < 3; k++) inkLine([N[k], N[(k + 1) % 3]], .6, PAL.data, 'inkfine', 0); for (const p of N) paint(ellPts(p[0], p[1], 2.6, 2.6, 8), { wash: PAL.data, ink: null }); }
    pop();
  }
  window.A1_KEY = key;          // reused by 1.3 (keys diving) and 1.6 (the new key)
  window.A1_KEY_KINDS = KEY_KINDS;

  // the « THÈSE » volume: a fat bound book with a face, (x, y) = ground point, it hops on its bottom edge
  function thesis(x, y, s, o = {}) {
    const f = o.flip ? -1 : 1, sq = o.sq || 0, W2 = 92 * s, H2 = 128 * s, D = 24 * s, rot = o.rot || 0;
    boilSeed('a1s2 thesis');
    paint(ellPts(x, y + 3, 56 * s, 9 * s, 14), { wash: PAL.ink, washOp: 40, ink: null });
    push(); translate(x, y + (o.dy || 0)); rotate(rot); scale(f * (1 + sq * .5), 1 - sq);
    // page block (seen on the right) and spine (left)
    paint([[W2 / 2 - 4 * s, -H2 + 4 * s], [W2 / 2 + D, -H2 - D * .5 + 4 * s], [W2 / 2 + D, -D * .5], [W2 / 2 - 4 * s, 0]], { wash: '#F6EBD2', washOp: 255, ink: PAL.ink, sw: .7 });
    for (let k = 1; k < 5; k++) inkLine([[W2 / 2 + k * D / 5, -H2 - k * D * .1 + 6 * s], [W2 / 2 + k * D / 5, -k * D * .1 - 3 * s]], .4, '#C9B894', 'inkfine', 0);
    paint([[-W2 / 2, -H2], [W2 / 2, -H2], [W2 / 2 + D, -H2 - D * .5], [-W2 / 2 + D, -H2 - D * .5]], { wash: '#4A2C58', washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rrPts(-W2 / 2, -H2, W2, H2, 6 * s), { wash: '#6B3F78', washOp: 255, ink: PAL.ink, sw: .9 });
    paint(rectPts(-W2 / 2, -H2, 14 * s, H2), { wash: '#4A2C58', washOp: 255, ink: null });
    for (const yy of [-H2 + 16 * s, -18 * s]) inkLine([[-W2 / 2 + 2 * s, yy], [-W2 / 2 + 13 * s, yy]], 1.4 * s, '#E8C66A', 'ink', 0);
    paint(rrPts(-W2 / 2 + 22 * s, -H2 + 14 * s, W2 - 36 * s, 26 * s, 4 * s), { wash: '#E8C66A', washOp: 255, ink: PAL.ink, sw: .5 });
    // face: eyes, brows (mood), a small mouth
    const mood = o.mood || 'neutre', lx = (o.lookX || 0) * 4 * s, ly = (o.lookY || 0) * 4 * s;
    for (const sd of [-1, 1]) {
      const ex = 6 * s + sd * 17 * s, ey = -62 * s;
      paint(ellPts(ex, ey, 10 * s, 12 * s, 14), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .6 });
      const lid = mood === 'vexe' ? .45 : 0;
      paint(ellPts(ex + lx, ey + ly + lid * 4 * s, 4.5 * s, 5.5 * s * (1 - lid * .4), 10), { wash: PAL.ink, washOp: 255, ink: null });
      if (lid) inkLine([[ex - 10 * s, ey - 3 * s], [ex + 10 * s, ey - 3 * s]], 1.2 * s, '#4A2C58', 'ink', 0);
      const tilt = mood === 'vexe' ? .5 : mood === 'lit' ? -.25 : 0;
      inkLine([[ex - 9 * s, ey - 17 * s + sd * tilt * -7 * s], [ex + 9 * s, ey - 17 * s + sd * tilt * 7 * s]], 1.6 * s, '#2A1830', 'ink', 0);
    }
    if (mood === 'vexe') { paint(ellPts(-14 * s, -40 * s, 8 * s, 4 * s, 10), { wash: PAL.rose, washOp: 150, ink: null }); paint(ellPts(26 * s, -40 * s, 8 * s, 4 * s, 10), { wash: PAL.rose, washOp: 150, ink: null }); inkLine([[-2 * s, -36 * s], [14 * s, -38 * s]], 1.2 * s, PAL.ink, 'ink', 0); }
    else if (mood === 'lit') paint(ellPts(6 * s, -36 * s, 4 * s, 5 * s, 10), { wash: '#5A2230', ink: PAL.ink, sw: .4 });
    else inkLine([[-2 * s, -38 * s], [6 * s, -35 * s], [14 * s, -38 * s]], 1.1 * s, PAL.ink, 'ink', .5);
    pop();
    // the title, placed in world space (letters don't follow push/rotate)
    const c = Math.cos(rot), n = Math.sin(rot), ox = f * (-W2 / 2 + 22 * s + (W2 - 36 * s) / 2) * (1 + sq * .5), oy = (-H2 + 27 * s) * (1 - sq);
    letter('THÈSE', x + ox * c - oy * n, y + (o.dy || 0) + ox * n + oy * c, 19 * s * (1 - sq * .5), '#4A2C58', { weight: 700, rot });
  }

  // the frieze « 2010 → 2026 »: 17 lamps along the beam, lit left to right
  function frieze(k, t) {
    const n = 17;
    for (let i = 0; i < n; i++) {
      const x = lerp(FRISE.x0, FRISE.x1, i / (n - 1)), on = clamp(k * n - i);
      boilSeed('a1s2 lamp' + i);
      if (on > .02) glow(x, FRISE.y, 26 * (.8 + .4 * on), '#FFD27A', .7 * on);
      paint(ellPts(x, FRISE.y, 6, 6, 10), { wash: mixCol('#7A6A5A', '#FFE7A8', on), washOp: 255, ink: PAL.ink, sw: .4 });
    }
    const a = seg(k, 0, .12), b = seg(k, .92, 1);
    if (a > 0) letter('2010', FRISE.x0 - 88, FRISE.y + 1, 26, '#FFF1CF', { pop: a, weight: 700, stroke: '#5A3A2A', strokeW: .22 });
    if (b > 0) {
      letter('2026', FRISE.x1 + 92, FRISE.y + 1, 26, '#FFF1CF', { pop: b, weight: 700, stroke: '#5A3A2A', strokeW: .22 });
      boilSeed('a1s2 arrow'); inkLine([[FRISE.x1 + 10, FRISE.y - 16], [FRISE.x1 + 26, FRISE.y - 16]], 2, '#FFE7A8', 'ink', 0);
      paint([[FRISE.x1 + 26, FRISE.y - 22], [FRISE.x1 + 36, FRISE.y - 16], [FRISE.x1 + 26, FRISE.y - 10]], { wash: '#FFE7A8', ink: null });
    }
  }

  // the lintel plaque, lettered in three beats
  const PLQ = ['6 équations de recherche', '·', '2010–2026', '·', 'articles (thèses et mémoires exclus)'];
  function plaque(ks) {
    const size = 25, ws = PLQ.map(s => textW(s, size, 600) + (s === '·' ? 24 : 0)), tot = ws.reduce((a, b) => a + b, 0);
    let x = PLAQUE.x - tot / 2;
    const kOf = [ks[0], ks[1], ks[1], ks[2], ks[2]];
    PLQ.forEach((s, i) => { const k = kOf[i]; if (k > 0) letter(s, x + ws[i] / 2, PLAQUE.y + 1, size, s === '·' ? '#8A6246' : PAL.night, { pop: k, weight: 600 }); x += ws[i]; });
  }

  // the sign by the door
  function doorSign(flash = 0) {
    boilSeed('a1s2 sign');
    paint(rectPts(SIGN.x - 7, SIGN.y + SIGN.h / 2 - 6, 14, GROUND - SIGN.y - SIGN.h / 2 + 8), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rrPts(SIGN.x - SIGN.w / 2, SIGN.y - SIGN.h / 2, SIGN.w, SIGN.h, 14, 1.2), { wash: '#F3E3C3', washOp: 255, ink: PAL.ink, sw: 1 });
    inkLine([[SIGN.x - SIGN.w / 2 + 20, SIGN.y + 2], [SIGN.x + SIGN.w / 2 - 20, SIGN.y + 2]], .6, '#B8A48A', 'inkfine', 0);
    if (flash > .02) { glow(SIGN.x, SIGN.y + 44, 120, PAL.red, .45 * flash); paint(rrPts(SIGN.x - SIGN.w / 2 + 8, SIGN.y + 8, SIGN.w - 16, SIGN.h / 2 - 16, 8), { wash: '#F6C9B9', washOp: 200 * flash, ink: null }); }
    for (const sd of [-1, 1]) paint(ellPts(SIGN.x + sd * (SIGN.w / 2 - 12), SIGN.y - SIGN.h / 2 + 12, 3, 3, 6), { wash: '#8A7A6A', ink: null });
    letter('Articles scientifiques\nbienvenus —', SIGN.x, SIGN.y - 40, 21, PAL.soil, { weight: 700, lh: 1.1 });
    letter('thèses et mémoires :\ndemi-tour', SIGN.x - 12, SIGN.y + 43, 21, PAL.red, { weight: 700, lh: 1.1 });
    // a little U-turn arrow
    const ax = SIGN.x + 110, ay = SIGN.y + 48;
    boilSeed('a1s2 uturn');
    inkLine([[ax - 8, ay + 16], [ax - 8, ay - 6], [ax, ay - 16], [ax + 8, ay - 6], [ax + 8, ay + 6]], 2.2 * (1 + .3 * flash), PAL.red, 'ink', .5);
    paint([[ax + 1, ay + 4], [ax + 15, ay + 4], [ax + 8, ay + 15]], { wash: PAL.red, ink: null });
  }

  // puff clouds (the vexed book's « hmpf »)
  function puffs(x, y, k) {
    if (k <= 0 || k >= 1) return;
    boilSeed('a1s2 puff');
    for (let i = 0; i < 3; i++) { const a = -1.9 + i * .5, r = 10 + 30 * easeOut(k); paint(ellPts(x + Math.cos(a) * r * 1.4, y + Math.sin(a) * r, 9 * (1 - k * .6), 7 * (1 - k * .6), 10), { wash: '#F4EEE6', washOp: 230 * (1 - k), ink: mixCol(PAL.ink, PAL.cream, .5), sw: .4 }); }
  }

  // ---------------- the shot ----------------
  const WORDS = ['jumeau\nnumérique', 'assimilation\nde données', 'modèles\nmulti-agents', 'systèmes\nagricoles', 'trajectoires', 'décision', 'exploration\nde modèles'];
  const WORD_F = [0, .1406, .3211, .489, .6443, .7534, .8562];      // word onsets inside L1 (fraction of the line, from the recording)
  const SLOTS = [[960, 826], [1100, 826], [1240, 826], [1380, 826], [1030, 900], [1170, 900], [1310, 900]];
  const KEYSLOT = i => [945 + i * 88, 850];
  const HOVER = i => [812 + (i % 3) * 58 + (i > 2 ? 29 : 0), 790 + (i > 2 ? 58 : 0)];   // keys gather above the lectern (L3)
  const C = [1170, 862];

  function facade(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i), wordT = i => lerp(L(1), E(1), WORD_F[i]);
    const combine = L(2) + .05, flashT = L(2) + .78, keysT = flashT + .06;
    const back0 = E(2) + .05, back1 = back0 + 1.0;
    const friseA = lerp(L(3), E(3), .14) - .1, friseB = lerp(L(3), E(3), .40) + .15;       // « 2010 » … « 2026 »
    const bookIn = L(3) + .7, stepN = 5, stepT = .38, bookAt = bookIn + stepN * stepT;          // the THÈSE volume
    const buzz = lerp(L(3), E(3), .71), vexT = buzz + .4, turnT = vexT + .25, leaveT = turnT + .15;
    const openT = E(3) - .45, flyT = openT + .1, endT = S.dur;
    // camera
    const z0 = 1.53 / K1, cy0 = DOOR.top + 350 * K1;
    const [cx, cy, z] = camKF(st, [[0, DOOR.cx, cy0, z0], [.3, DOOR.cx, cy0, z0], [2.05, 1200, 690, .86], [2.35, 1190, 700, .86], [3.2, 1010, 915, 1.9],
      [E(1), 1030, 912, 1.98], [back0, 1040, 905, 2.0], [back1, 1180, 850, 1.25], [openT, 1190, 855, 1.3], [endT, 1200, 975, 2.3]]);
    camBegin(cx, cy, z);
    drawPlate('a1s2_facade', 0, 0);
    // light spilling from the doorway once the door opens
    const op = seg(st, openT, openT + .45);
    if (op > 0) { glow(DOOR.cx, GROUND - 60, 120 + 160 * op, PAL.data, .6 * op); for (let i = 0; i < 4; i++) glow(DOOR.cx - 90 + i * 60, GROUND - 30, 40, '#BDF1F6', .7 * op); glow(DOOR.cx, GROUND - 160, 260 * op, '#BDF1F6', .35 * seg(st, flyT + .2, endT)); }
    // the frieze, the plaque
    frieze(seg(st, friseA, friseB), st);
    plaque([backOut(seg(st, back1 - .25, back1 + .2)), seg(st, friseB - .1, friseB + .3), seg(st, vexT + .1, vexT + .5)]);
    flushLetters();
    door(op);
    doorSign(bump(st, buzz, buzz + .9, .12));
    flushLetters();
    lectern(LECT.x, LECT.y, bump(st, wordT(0) - .3, E(1) + .2, .4));
    // Awa: at the lectern, taps it on each word, looks up at the pieces; watches the book; sends the keys
    const tap = WORD_F.reduce((m, f, i) => Math.max(m, bump(st, wordT(i) - .35, wordT(i) + .12, .16)), 0);
    const send = seg(st, openT - .3, openT + .05) * (1 - seg(st, endT - .3, endT));
    const A = actP(st, [[0, 'neutre', { lookX: .5 }], [2.3, 'determinee'], [L(1) - .3, 'concentree', { lookY: -.2, lookX: .6 }], [combine, 'emerveillee', { lookY: -.7, lookX: .6 }],
      [back1 - .2, 'neutre', { lookX: .8 }], [bookIn + 1.2, 'surprise', { lookX: 1 }], [vexT + .1, 'joie', { lookX: 1 }], [openT - .4, 'determinee', { lookX: .7, lookY: -.4 }]]);
    const armK = tap * (1 - seg(st, E(1), E(1) + .3));
    awa(AWA_X, GROUND, AWA_S, { ...A, view: 'q', cap: 'labo', aR: send > 0 ? lerp(.35, 2.5, ease(send)) : lerp(.35, 1.35, ease(armK)), eR: send > 0 ? -.2 : lerp(-.15, -.55, armK), handR: send > .3 ? 'point' : 'open' });
    // Jumo hovers by Awa, watches the gag, then follows the keys in
    const jf = st < 2.2 ? 'happy' : st < combine ? 'happy' : st < back0 ? 'love' : st < buzz ? 'wide' : st < vexT + .3 ? 'question' : st < openT ? 'wink' : 'excl';
    const jin = ease(seg(st, flyT + .15, endT));
    const jx = lerp(655 + 14 * Math.sin(st * 1.3), DOOR.cx + 40, jin), jy = lerp(880 + 10 * Math.sin(st * 2.3), GROUND - 110, jin);
    jumo(jx, jy, 6.5 * (1 - .5 * jin), { stage: 0, face: jf, prop: 'spin', spin: st * 9, rot: -.08 + .1 * Math.sin(st * 1.3) + .25 * jin, lookX: st > bookIn + 1 && st < openT ? 1 : .3, shadowY: GROUND + 6, boilKey: 'jumo' });
    // the seven keyword pieces (L1), then the combination into six keys (L2)
    for (let i = 0; i < 7; i++) {
      const t0 = wordT(i) - .12; if (st < t0) continue;
      const k = seg(st, t0, t0 + .55), [sx, sy] = SLOTS[i];
      let p = arcPt([LECT.x + 10, LECT.y - 108], [sx, sy], 90, easeOut(k)), s = lerp(.3, 1, backOut(k)), rot = lerp(-.5, (hash(i) - .5) * .08, easeOut(k));
      p = [p[0], p[1] + 3 * Math.sin(st * 2.2 + i)];
      const cm = seg(st, combine, flashT);
      if (cm > 0) { const a = cm * 3.2 + i * TAU / 7, r = (1 - easeIn(cm)) * Math.hypot(sx - C[0], sy - C[1]); p = [lerp(p[0], C[0] + Math.cos(a) * r, ease(seg(cm, 0, .25))), lerp(p[1], C[1] + Math.sin(a) * r * .6, ease(seg(cm, 0, .25)))]; s *= 1 - .75 * easeIn(cm); rot += cm * 2; }
      if (cm >= 1) continue;
      const lit = seg(st, t0 + .35, t0 + .6);
      piece(p[0], p[1], s, WORDS[i], lit * (cm > 0 ? 1 : .75 + .25 * bump(st, t0 + .35, t0 + 1.1, .2)), rot, i);
    }
    const fl = bump(st, flashT - .12, flashT + .35, .12);
    if (fl > 0) { glow(C[0], C[1], 190 * fl, '#FFE3A0', fl); glow(C[0], C[1], 90 * fl, PAL.cream, fl); }
    // the six keys: out of the flash, to their row (L2), gather above the lectern (L3), fly into the doorway (end)
    for (let i = 0; i < 6; i++) {
      const k0 = keysT + i * .07; if (st < k0) continue;
      const k = seg(st, k0, k0 + .5), [kx, ky] = KEYSLOT(i), [hx, hy] = HOVER(i);
      let p = [lerp(C[0], kx, easeOut(k)), lerp(C[1], ky, easeOut(k)) - 30 * Math.sin(k * Math.PI)], s = .9 * backOut(k), rot = (1 - easeOut(k)) * 3 + .06 * Math.sin(st * 2 + i);
      const g = ease(seg(st, back0 + .1 + i * .04, back1 + i * .04));
      p = [lerp(p[0], hx, g), lerp(p[1], hy, g) + 4 * Math.sin(st * 2.4 + i * 1.3)]; s *= lerp(1, .8, g);
      const f0 = flyT + i * .06, fk = seg(st, f0, f0 + .6);
      if (fk > 0) { p = arcPt(p, [DOOR.cx - 60 + i * 24, GROUND - 120], 120, easeIn(fk)); s *= 1 - .7 * easeIn(fk); rot += fk * 2.5; }
      if (fk >= 1) continue;
      key(p[0], p[1], s, KEY_KINDS[i], { rot, key: i, glow: .35 + .4 * bump(st, k0, k0 + .8, .2) + .5 * fk });
      const tg = seg(st, k0 + .3, k0 + .6) * (1 - g);
      if (tg > 0) letter('Q' + (i + 1), p[0], p[1] + 62 * s, 22, PAL.night, { pop: tg, weight: 700, stroke: PAL.cream, strokeW: .2 });
      else if (g > .9 && fk <= 0) letter('Q' + (i + 1), p[0] + 20 * s, p[1] + 28 * s, 14, PAL.night, { weight: 700, stroke: PAL.cream, strokeW: .25, alpha: seg(g, .9, 1) });
    }
    // the THÈSE volume: hops in, bumps into the rule, reads it, leaves vexed
    if (st > bookIn && st < endT) {
      const X0 = 2080, X1 = 1318, hopI = Math.min(stepN - 1, Math.floor((st - bookIn) / stepT));
      let bx, by = 0, sq = 0, flip = true, mood = 'neutre', lookX = -1, lookY = 0, rot = 0;
      if (st < bookAt) {
        const a = bookIn + hopI * stepT, J = jump(st, a + .06, a + stepT - .02, 26);
        bx = lerp(X0, X1, (hopI + ease(seg(st, a + .06, a + stepT - .02))) / stepN); by = J.dy; sq = J.sq;
      } else if (st < leaveT) {
        bx = X1; sq = jump(st, bookAt - .02, bookAt - .02, 0).sq + take(st, buzz, .8).sq * .8;
        const rd = seg(st, buzz + .05, vexT);
        mood = st < buzz ? 'neutre' : st < vexT ? 'lit' : 'vexe'; lookX = st < buzz ? -1 : lerp(1, .6, rd); lookY = st < buzz ? 0 : -1;
        flip = st < turnT;
        if (st >= turnT) { sq += .1 * Math.sin(seg(st, turnT, leaveT) * Math.PI); rot = -.12 * ease(seg(st, turnT, leaveT)); }
      } else {
        const n = Math.floor((st - leaveT) / (stepT * .85)), a = leaveT + n * stepT * .85, J = jump(st, a + .04, a + stepT * .85 - .02, 22);
        bx = X1 + (n + ease(seg(st, a + .04, a + stepT * .85 - .02))) * 125; by = J.dy; sq = J.sq; flip = false; mood = 'vexe'; lookX = 1; lookY = -.4; rot = -.12;
      }
      thesis(bx, GROUND, 1.08, { flip, sq, dy: by, mood, lookX, lookY, rot });
      puffs(bx + 30, GROUND - 165, seg(st, vexT, vexT + .8));
    }
    camEnd();
    // the cut in: 1.1 ends on this very door on its cream tablet page; the page melts away as we pull back
    const cream = 1 - ease(seg(st, .3, 1.25));
    if (cream > 0) {
      flushLetters();
      paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#FAF1DF', washOp: 255 * cream, ink: null });
      camBegin(cx, cy, z); door(0); camEnd();
    }
    // end: the doorway light swallows the frame (1.3 opens on the same cyan light over the first well)
    flushLetters();
    flash(seg(st, endT - .35, endT) * .85, '#DDF6F8');
  }

  scene('1.2', S => [[0, facade]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i), wordT = i => lerp(L(1), E(1), WORD_F[i]);
      const flashT = L(2) + .78, bookIn = L(3) + .7, buzz = lerp(L(3), E(3), .71), vexT = buzz + .4, turnT = vexT + .25, leaveT = turnT + .15, openT = E(3) - .45;
      const out = [[.35, 'whoosh', .12], [2.4, 'whoosh', .06], [2.9, 'step', .06], [flashT - .3, 'whoosh', .1], [flashT, 'sparkle', .14], [flashT + .02, 'chime', .08],
        [E(2) + .2, 'whoosh', .06], [lerp(L(3), E(3), .14), 'tick', .05], [lerp(L(3), E(3), .40) + .1, 'chime', .07],
        [buzz, 'buzzer', .09, .4], [buzz + .2, 'bipq', .07, -.3], [vexT + .05, 'bloop', .1, .4], [turnT, 'squeak', .06, .4],
        [openT, 'squeak', .08], [openT + .12, 'knock', .06], [openT + .15, 'whoosh', .14], [openT + .25, 'sparkle', .08], [openT + .3, 'bip2', .06, -.2]];
      for (let i = 0; i < 7; i++) { out.push([wordT(i) - .1, 'pop', .08, .2]); out.push([wordT(i) + .4, 'tick', .05, .3]); }
      for (let i = 0; i < 6; i++) out.push([flashT + .08 + i * .07, 'pop', .06, (i - 2.5) * .1]);
      for (let i = 1; i < 16; i++) out.push([lerp(L(3), E(3), .14) + i * (lerp(L(3), E(3), .40) - lerp(L(3), E(3), .14)) / 16, 'tick', .02, (i / 16 - .5) * .4]);
      for (let i = 0; i < 5; i++) out.push([bookIn + i * .38 + .36, 'boing', .05, .6 - i * .08]);
      for (let i = 0; i < 4; i++) out.push([leaveT + i * .34 + .3, 'boing', .045, .45 + i * .1]);
      return out;
    });
})();
