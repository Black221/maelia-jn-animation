// scène 1.5 — Bip, Bop et le dernier mot (V2 § 4, acte I). Décor : plate `library` (2400 × 1350).
// Lines: L0 « Chaque parchemin est lu deux fois, par deux IA qui ne se voient pas. » · L1 « Quand elles ne sont pas
//        d'accord, l'arbitre tranche. » · L2 « Et à la fin, c'est Awa qui décide : … un échantillon des exclusions. » ·
//        L3 (arbitre) « C'est elle la cheffe. » · L4 « Accord entre Bip et Bop : zéro virgule neuf, ou presque. » ·
//        L5 « C'est ce que les statisticiens appellent un κ, et c'est très bon. »
// One shot, the camera reframes:
//   0     opens on the lattice that ends 1.4 (A1_LATTICE, same size on screen): it is the paravent between Bip & Bop
//   L0    the same parchment, one copy each; both raise ✔ → they high-five over the paravent (telescopic arms), blind
//   L1    ✔ / ✖ : Maître Arbitre glides down, lands on the paravent, pushes up his spectacles, gavel: decided
//   L2    Awa walks in with the big stamp « VALIDÉ PAR L'HUMAIN »: stamps the whole inclusions pile, pulls a sample
//         from the exclusions; the desk banner « L'humain a toujours le dernier mot »
//   L3    gag: the owl tranches ✖, Awa turns the tag to ✔ and stamps it; the owl shrugs: « C'est elle la cheffe. »
//   L4–L5 the agreement striker (« tape-m'en-cinq-mètre »): Bip & Bop high-five, both pucks shoot up nearly to the bell;
//         the board: « Titre/résumé : accord A/B κ = 0,899 · 1 249 notices revues par l'humain » and
//         « Texte intégral : accord A/B κ = 0,897 · 149 notices revues par l'humain »
//   → end Awa stamps one last sheet, we push into the ochre stamp until it fills the frame (1.6 opens on an ochre seal)
(() => {
  const FLOOR = 1250;
  const PAR = { x: 1000, w: 330, h: 430 };                // the paravent = the lattice of 1.4 (bottom on the floor)
  const BIP = 790, BOP = 1210, BU = 20, OU = 15, Z0 = 8.5 * 230 / 330;
  const OWL_PERCH = [PAR.x, FLOOR - PAR.h];
  const DESK = { x0: 130, x1: 680, top: 1150 }, AWA_X = 370, AWA_S = 30, PILE_X = 525, EXC_X = 618;
  const GAUGE = { x: 1720, top: 470, w: 150 };
  const BOARD = { x: 1040, y: 300, w: 1150, h: 300 };
  const STAMP_AT = [525, 1100];                           // the last imprint (we push into it)
  const logZ = (a, b, k) => Math.exp(lerp(Math.log(a), Math.log(b), k));
  function camKF(t, keys) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const a = keys[i - 1], b = keys[i], k = ease((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), logZ(a[3], b[3], k)]; }
    return keys[keys.length - 1].slice(1);
  }
  // hand position of a person (standing, front arms; mirrors cast.js person() arm maths)
  function handPos(x, y, s, o, which) {
    const view = o.view || 'front', side = view === 'side', q = view === 'q', bw = side ? .62 : q ? .88 : 1, sd = which === 'L' ? -1 : 1;
    let px = sd * 1.72 * bw; if (side) px = .15;
    const dir = side ? 1 : sd, a = o['a' + which] ?? .12, e = o['e' + which] ?? -.15;
    const hx = px * s + dir * Math.sin(a) * 1.95 * s + dir * Math.sin(a + e) * 1.75 * s, hy = -6.75 * s + Math.cos(a) * 1.95 * s + Math.cos(a + e) * 1.75 * s;
    const sq = (o.sq || 0), f = o.flip ? -1 : 1;
    return [x + f * hx * (1 + sq * .5), y + (o.dy || 0) * s + hy * (1 - sq)];
  }
  // the big stamp, handle knob at (x, y)
  function bigStamp(x, y, s = 1, rot = 0) {
    boilSeed('a1s5 bigstamp');
    push(); translate(x, y); rotate(rot); scale(s);
    paint(ellPts(0, -6, 14, 12, 12), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .7 });
    paint(rrPts(-6, 2, 12, 22, 4), { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: .6 });
    paint(rrPts(-34, 22, 68, 22, 6), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(-32, 42, 64, 8, 3), { wash: PAL.ochre, washOp: 255, ink: null });
    pop();
  }
  // an imprint of the stamp (ochre: the colour of decisions)
  function imprint(x, y, s, k, rot = -.12) {
    if (k <= 0) return;
    boilSeed('a1s5 imprint' + Math.round(x));
    const p = lerp(1.25, 1, easeOut(k));
    push(); translate(x, y); rotate(rot); scale(s * p);
    paint(ellPts(0, 0, 44, 44, 24), { ink: PAL.ochre, sw: 2 });
    paint(ellPts(0, 0, 36, 36, 22), { ink: PAL.ochre, sw: 1 });
    pop();
    letter('VALIDÉ PAR\nL’HUMAIN', x, y, 12.5 * s * p, PAL.ochre, { weight: 700, rot, lh: 1.05, alpha: clamp(k * 3) });
  }
  // a sign card ✔ / ✖ (for the owl's decision and the tag Awa flips); flip 0..1 turns it over
  function card(x, y, s, yes, flipK = 0) {
    const sx = Math.abs(Math.cos(flipK * Math.PI)), showYes = flipK > .5 ? !yes : yes;
    boilSeed('a1s5 card' + Math.round(x));
    push(); translate(x, y); scale(s * Math.max(.06, sx), s);
    paint(rrPts(-30, -26, 60, 52, 8), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9 });
    if (showYes) inkLine([[-16, 0], [-4, 12], [18, -14]], 3.4, PAL.soil, 'ink', 0);
    else { inkLine([[-14, -13], [14, 13]], 3.4, PAL.red, 'ink', 0); inkLine([[14, -13], [-14, 13]], 3.4, PAL.red, 'ink', 0); }
    pop();
  }
  // telescopic arms of the twins for the blind high-five over the paravent
  function teleArms(k, clapT, st) {
    if (k <= 0) return;
    const top = [PAR.x, FLOOR - PAR.h - 34];
    for (const [bx, sd, col] of [[BIP, 1, '#335E93'], [BOP, -1, '#B0662A']]) {
      const hand = [bx + sd * 2.92 * BU, FLOOR - 8.12 * BU], tip = [lerp(hand[0], top[0] - sd * 12, k), lerp(hand[1], top[1], k)];
      boilSeed('a1s5 tele' + sd);
      const n = 3; for (let i = 0; i < n; i++) { const a = [lerp(hand[0], tip[0], i / n), lerp(hand[1], tip[1], i / n)], b = [lerp(hand[0], tip[0], (i + 1) / n), lerp(hand[1], tip[1], (i + 1) / n)]; inkLine([a, b], 2.6 - i * .5, PAL.ink, 'ink', 0); paint(ellPts(b[0], b[1], 4, 4, 8), { wash: '#9C98A6', ink: null }); }
      paint(ellPts(tip[0], tip[1], .5 * BU, .5 * BU, 12), { wash: col, ink: PAL.ink, sw: .6 });
    }
    const c = seg(st, clapT, clapT + .35);
    if (c > 0 && c < 1) { glow(top[0], top[1], 90 * c, '#FFE3A0', 1 - c); boilSeed('a1s5 clap'); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = 24 + 50 * easeOut(c); inkLine([[top[0] + Math.cos(a) * r * .6, top[1] + Math.sin(a) * r * .6], [top[0] + Math.cos(a) * r, top[1] + Math.sin(a) * r]], 2 * (1 - c), PAL.ochre, 'ink', 0); } }
  }
  // the agreement striker: a tower with two lanes, a bell on top; pucks at k1, k2 (0..1 of the height)
  function striker(k1, k2, lampK, kGlyph) {
    const { x, top, w } = GAUGE, h = FLOOR - top;
    boilSeed('a1s5 striker');
    paint(rrPts(x - w / 2 - 10, FLOOR - 30, w + 20, 30, 6), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .8 });
    paint(rrPts(x - w / 2, top, w, h - 28, 10), { wash: '#F3E3C3', washOp: 255, ink: PAL.ink, sw: 1 });
    for (const sd of [-1, 1]) paint(rrPts(x + sd * w / 4 - 12, top + 20, 24, h - 70, 8), { wash: '#E1D2B4', washOp: 255, ink: PAL.ink, sw: .5 });
    for (let i = 1; i < 10; i++) { const yy = FLOOR - 50 - (h - 70) * i / 10; inkLine([[x - w / 2 + 4, yy], [x - w / 2 + 16, yy]], .8, '#8A6246', 'inkfine', 0); inkLine([[x + w / 2 - 16, yy], [x + w / 2 - 4, yy]], .8, '#8A6246', 'inkfine', 0); }
    // lamps up the sides (they light up with « très bon »)
    for (let i = 0; i < 6; i++) { const yy = FLOOR - 90 - i * (h - 140) / 5, on = clamp(lampK * 6 - i); for (const sd of [-1, 1]) { if (on > .02) glow(x + sd * (w / 2 + 14), yy, 26, '#FFD27A', .6 * on); paint(ellPts(x + sd * (w / 2 + 14), yy, 7, 7, 10), { wash: mixCol('#7A6A5A', '#FFE7A8', on), washOp: 255, ink: PAL.ink, sw: .5 }); } }
    // the bell
    paint([[x - 34, top - 8], [x + 34, top - 8], [x + 26, top - 44], [x, top - 58], [x - 26, top - 44]], { wash: '#E8C66A', washOp: 255, ink: PAL.ink, sw: .9, curv: .3 });
    paint(ellPts(x, top - 4, 8, 6, 8), { wash: '#C9A04A', ink: PAL.ink, sw: .5 });
    // pucks
    const pk = (sd, k, col, key) => { const yy = FLOOR - 50 - (h - 70) * k; boilSeed('a1s5 puck' + key); if (k > .05) glow(x + sd * w / 4, yy, 44, col, .5); paint(rrPts(x + sd * w / 4 - 20, yy - 16, 40, 32, 8), { wash: col, washOp: 255, ink: PAL.ink, sw: .8 }); letter('κ', x + sd * w / 4, yy + 1, 22 * (1 + .35 * kGlyph), PAL.night, { weight: 700 }); };
    pk(-1, k1, PAL.ochre, 1); pk(1, k2, PAL.data, 2);
  }

  function hall(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    // beat A: agree
    const dropA = 1.1, readA = 1.6, signA = lerp(L(0), E(0), .62), clap1 = lerp(L(0), E(0), .88);
    // beat B: disagree → the owl
    const dropB = L(1) - .5, signB = L(1) + .55, owlA = L(1) + .75, owlLand = L(1) + 1.55, specs = owlLand + .1, gavel = lerp(L(1), E(1), .8);
    // beat C: Awa
    const walkA = E(1) + .5, walkB = L(2) + 1.0, decide = L(2) + 1.56, incA = L(2) + 2.85, incB = L(2) + 3.85, smpA = L(2) + 4.2, smpB = E(2) - .1;
    const gavel2 = E(2) + .05, flyT = gavel2 + .15, flipT = gavel2 + .7, stamp2 = flipT + .35, shrug = L(3) - .15;
    // beat D: the striker
    const clap2 = L(4) + .45, rise = clap2 + .1, riseB = rise + 1.5, line1 = L(4) + 1.75, line3 = L(4) + 2.8, kap = L(5) + 1.45, bon = L(5) + 2.65;
    // beat E: the last stamp
    const lastSt = E(5) + .35, push0 = lastSt + .2;
    const [cx, cy, z] = camKF(st, [[0, PAR.x, FLOOR - PAR.h / 2, Z0], [.25, PAR.x, FLOOR - PAR.h / 2, Z0], [1.9, 1000, 955, 1.36], [L(1) - .3, 1005, 950, 1.36],
      [owlA + .2, 1000, 900, 1.28], [E(1) + .2, 1005, 900, 1.28], [walkB, 890, 855, 1.1], [E(3), 900, 852, 1.1], [L(4) + .2, 1150, 725, .9], [E(5), 1150, 722, .92],
      [push0, 1000, 800, 1.0], [S.dur - .5, STAMP_AT[0], STAMP_AT[1], 7], [S.dur, STAMP_AT[0], STAMP_AT[1], 14]]);
    camBegin(cx, cy, z);
    drawPlate('library', 0, 0);
    // the board (appears for L4)
    const bk = seg(st, line1 - .5, line1);
    if (bk > 0) {
      boilSeed('a1s5 board');
      push(); translate(BOARD.x, BOARD.y); scale(backOut(bk));
      paint(rrPts(-BOARD.w / 2, -BOARD.h / 2, BOARD.w, BOARD.h, 22, 1.2), { wash: PAL.woodDk, washOp: 255, ink: PAL.ink, sw: 1.1 });
      paint(rrPts(-BOARD.w / 2 + 16, -BOARD.h / 2 + 16, BOARD.w - 32, BOARD.h - 32, 14), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: .7 });
      inkLine([[-BOARD.w / 2 + 50, 0], [BOARD.w / 2 - 50, 0]], .8, '#46638C', 'inkfine', 0);
      pop();
      const Y = BOARD.y, X = BOARD.x;
      letter('Titre/résumé : accord A/B κ = 0,899', X, Y - 96, 46, '#FFE3A0', { weight: 700, pop: seg(st, line1, line1 + .3) });
      letter(fmtFR(1249) + ' notices revues par l’humain', X, Y - 40, 38, '#FFF1CF', { weight: 600, pop: seg(st, line1 + .45, line1 + .75) });
      letter('Texte intégral : accord A/B κ = 0,897', X, Y + 44, 46, '#BDF1F6', { weight: 700, pop: seg(st, line3, line3 + .3) });
      letter(fmtFR(149) + ' notices revues par l’humain', X, Y + 100, 38, '#FFF1CF', { weight: 600, pop: seg(st, line3 + .45, line3 + .75) });
    }
    // the striker
    const r = easeOut(seg(st, rise, riseB));
    striker(.899 * r, .897 * r, seg(st, bon, bon + .6), bump(st, kap - .1, kap + .9, .2));
    // the paravent (the lattice of 1.4)
    A1_LATTICE(PAR.x, FLOOR, PAR.w, PAR.h, { glowK: .8 * (1 - seg(st, .2, 1.4)) });
    boilSeed('a1s5 feet'); for (const sd of [-1, 1]) paint(rrPts(PAR.x + sd * (PAR.w / 2 - 10) - 22, FLOOR - 10, 44, 14, 5), { wash: '#6E4A34', washOp: 255, ink: PAL.ink, sw: .6 });
    // parchments dropped on the paravent: one copy for each twin
    const drop = (tA, key) => {
      const a = seg(st, tA, tA + .4), sp = seg(st, tA + .45, tA + .9); if (a <= 0 || sp >= 1) return;
      if (sp <= 0) parchment(PAR.x, lerp(FLOOR - PAR.h - 500, FLOOR - PAR.h - 50, easeIn(a)), .7, { rot: a * 2 });
      else for (const [bx, sd] of [[BIP, -1], [BOP, 1]]) { const p = arcPt([PAR.x + sd * 20, FLOOR - PAR.h - 50], [bx + sd * 10, FLOOR - 5.2 * BU], 80, ease(sp)); parchment(p[0], p[1], .7 * (1 - .5 * sp), { rot: sd * sp * 3 }); }
      if (sp > 0 && sp < .3) glow(PAR.x, FLOOR - PAR.h - 50, 90, '#FFE3A0', 1 - sp / .3);
    };
    drop(dropA, 'a'); drop(dropB, 'b');
    // Bip & Bop, back to back, looking away from each other
    const readK = Math.max(bump(st, readA, clap1 + .2, .25), bump(st, dropB + .9, gavel + .3, .25), bump(st, E(3) + .3, clap2 + .1, .2));
    const signUp = (a, b) => bump(st, a, b, .2);
    const bipSign = st < L(1) ? signUp(signA, clap1 + .5) : signUp(signB, gavel + .4);
    const bopSign = bipSign;
    const bopYes = st < L(1);
    const hf = Math.max(bump(st, clap1 - .35, clap1 + .45, .3), bump(st, clap2 - .35, clap2 + .45, .3));
    const happy = (st > clap1 && st < clap1 + .9) || (st > clap2 && st < clap2 + 1.2) || st > bon;
    bipbop(BIP, FLOOR, BU, { who: 'bip', flip: true, lookX: 1, read: readK, sign: bipSign > .02 ? 'yes' : null, signK: bipSign, highfive: hf, eye: happy ? 'happy' : st > signB && st < gavel ? 'wide' : 'open', sq: take(st, clap1, .4).sq + take(st, clap2, .4).sq });
    bipbop(BOP, FLOOR, BU, { who: 'bop', lookX: 1, read: readK, sign: bopSign > .02 ? (bopYes ? 'yes' : 'no') : null, signK: bopSign, highfive: hf, eye: happy ? 'happy' : st > signB && st < gavel ? 'wide' : 'open', sq: take(st, clap1, .4).sq + take(st, clap2, .4).sq });
    teleArms(hf, Math.min(Math.abs(st - clap1), Math.abs(st - clap2)) === Math.abs(st - clap1) ? clap1 : clap2, st);
    // Maître Arbitre: glides down, perches, spectacles, gavel; later tranches again, then shrugs
    if (st > owlA) {
      const g = seg(st, owlA, owlLand), p = g < 1 ? arcPt([PAR.x - 800, FLOOR - PAR.h - 560], OWL_PERCH, -140, ease(g)) : OWL_PERCH;
      const land = take(st, owlLand, .6);
      const gv = Math.max(bump(st, gavel - .25, gavel + .25, .2), bump(st, gavel2 - .25, gavel2 + .25, .2));
      arbitre(p[0], p[1], OU, { wing: g < 1 ? .8 + .2 * Math.sin(st * 9) : bump(st, owlLand, owlLand + .4, .15) * .5, glasses: bump(st, specs, specs + .6, .15) + bump(st, gavel2 - .8, gavel2 - .3, .12),
        gavel: gv > 0 ? gv : null, eyes: st > shrug && st < shrug + 1.4 ? 'closed' : gv > .3 ? 'narrow' : 'open', shrug: bump(st, shrug, shrug + 1.4, .25), sq: land.sq, rot: g < 1 ? .2 * (1 - g) : 0, noShadow: true, lookX: st > flyT && st < shrug ? -1 : 0 });
      const dk = seg(st, gavel, gavel + .25) * (1 - seg(st, E(1) + 1.0, E(1) + 1.4));
      if (dk > 0) card(PAR.x, OWL_PERCH[1] - 13 * OU, 1.2 * backOut(dk), true);
    }
    // Awa (behind her desk), the desk, its piles and sheets, then the stamp in her hand
    {
      const TRAY = [205, DESK.top - 30], TOP = [PILE_X, DESK.top - 52];
      let hp = null, hitK = 0;
      if (st > walkA) {
        const w = stroll(st, walkA, walkB, -120, AWA_X, 1.9 * AWA_S);
        const A0 = actP(st, [[walkA, 'determinee'], [decide - .1, 'fiere'], [incA - .2, 'concentree'], [gavel2 + .1, 'doute'], [flipT - .15, 'determinee'], [stamp2 + .2, 'joie'], [L(4), 'neutre', { lookX: .8 }], [bon, 'joie']]);
        const hits = [...[0, 1, 2, 3].map(i => incA + i * .25), ...[0, 1, 2].map(i => smpA + i * .3 + .35), stamp2, lastSt];
        for (const h of hits) hitK = Math.max(hitK, bump(st, h - .22, h + .08, .12));
        const A = { ...A0, view: w.moving ? 'side' : 'q', walk: w.walk, cap: 'labo', aR: w.moving ? .6 : lerp(2.4, 1.63, hitK), eR: w.moving ? -1.2 : -.2 };
        if (A0.expr === 'doute') { A.aL = 2.35; A.eL = 1.55 + .18 * Math.sin(st * 9); A.handL = 'scratch'; }
        awa(w.x, FLOOR, AWA_S, A);
        hp = handPos(w.x, FLOOR, AWA_S, A, 'R');
      }
      boilSeed('a1s5 desk');
      paint(rrPts(DESK.x0, DESK.top, DESK.x1 - DESK.x0, 20, 6), { wash: PAL.wood, washOp: 255, ink: PAL.ink, sw: .9 });
      paint(rrPts(DESK.x0 + 20, DESK.top + 20, DESK.x1 - DESK.x0 - 40, FLOOR - DESK.top - 20, 6), { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: .9 });
      const bn = seg(st, decide - .1, decide + .35);
      if (bn > 0) { boilSeed('a1s5 banner'); push(); translate(420, 790); scale(backOut(bn)); for (const sd of [-1, 1]) inkLine([[sd * 230, -48], [sd * 270, -170]], 1, '#6E6878', 'ink', 0); paint(rrPts(-255, -50, 510, 100, 14), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9 }); pop(); letter('L’humain a toujours\nle dernier mot', 420, 792, 35, PAL.night, { weight: 700, pop: bn, lh: 1.08 }); }
      // the tray of validated sheets, the inclusions pile (✔), the exclusions pile (✖)
      paint(rrPts(TRAY[0] - 52, DESK.top - 14, 104, 14, 4), { wash: '#8A6246', washOp: 255, ink: PAL.ink, sw: .6 });
      for (let i = 0; i < 3; i++) parchment(PILE_X + (hash(i) - .5) * 8, DESK.top - 30 - i * 7, .62, { rot: (hash(i + 3) - .5) * .2 });
      card(PILE_X + 2, DESK.top - 118, .5, true);
      for (let i = 0; i < 6; i++) parchment(EXC_X + (hash(i + 9) - .5) * 8, DESK.top - 30 - i * 7, .62, { rot: (hash(i + 5) - .5) * .2, out: true });
      card(EXC_X + 2, DESK.top - 132, .5, false);
      // a sheet: from `from` to the pile top by t0, stamped at tS, then off to `to` (the tray, or back)
      const sheet = (from, t0, tS, to, out, key) => {
        const a = seg(st, t0 - .35, t0); if (a <= 0) return;
        const o = seg(st, tS + .12, tS + .38);
        let p = a < 1 ? arcPt(from, TOP, 60, ease(a)) : TOP;
        if (o > 0) p = arcPt(TOP, to, 50, ease(o));
        parchment(p[0], p[1], .62, { rot: .05 * Math.sin(key * 3) - .12 * o, out });
        imprint(p[0], p[1] + 2, .58 * (1 - .15 * o), seg(st, tS, tS + .08), -.1);
      };
      for (let i = 0; i < 4; i++) { const h = incA + i * .25; sheet(TOP, h - .02, h, [TRAY[0] + (hash(i) - .5) * 10, TRAY[1] - 6 - i * 5], false, i); }
      for (let i = 0; i < 3; i++) { const h = smpA + i * .3 + .35; sheet([EXC_X, DESK.top - 70], h - .05, h, [EXC_X + (hash(i + 4) - .5) * 10, DESK.top - 80 - i * 4], true, 10 + i); }
      // the gag: the owl's ✖ comes to Awa, she turns the tag over to ✔ and stamps the sheet
      const ga = seg(st, gavel2, gavel2 + .1), f = seg(st, flyT, flyT + .5);
      if (ga > 0 && st < E(3) + 1.2) {
        const o0 = [PAR.x, OWL_PERCH[1] - 13 * OU], p = f <= 0 ? o0 : arcPt(o0, [TOP[0] + 150, TOP[1] - 150], 160, ease(f)), q = f <= 0 ? [o0[0], o0[1] + 70] : arcPt([o0[0], o0[1] + 70], TOP, 120, ease(f));
        parchment(q[0], q[1], .62, { rot: f * .1 });
        imprint(q[0], q[1] + 2, .58, seg(st, stamp2, stamp2 + .08), -.1);
        card(p[0], p[1], 1.15 * backOut(ga) * (1 - .1 * f), false, seg(st, flipT, flipT + .3));
        if (st > flipT && st < flipT + .6) glow(p[0], p[1], 70, '#FFE3A0', .6 * (1 - seg(st, flipT, flipT + .6)));
      }
      // the last sheet: the imprint we push into
      if (st > lastSt - .6) { const sk = seg(st, lastSt - .6, lastSt - .15); parchment(TOP[0], lerp(TOP[1] - 220, TOP[1], easeIn(sk)), .62, { alpha: seg(sk, 0, .3) }); imprint(TOP[0], TOP[1] + 2, .58, seg(st, lastSt, lastSt + .08), -.1); }
      if (hp) bigStamp(hp[0], hp[1] + 2, 1.3, .08 * (1 - hitK));
    }
    // Jumo floats around, fascinated
    {
      const jx = 1380 + 70 * Math.sin(st * .7), jy = 700 + 20 * Math.sin(st * 1.9);
      const jf = st > shrug && st < E(3) + .6 ? 'wink' : st > rise && st < riseB + .6 ? 'wide' : st > bon ? 'love' : st > gavel2 && st < flipT ? 'question' : 'happy';
      jumo(jx, jy, 11, { stage: 0, face: jf, prop: 'spin', spin: st * 9, rot: .1 * Math.sin(st * .7), lookX: st > walkA && st < E(3) ? -1 : 0, boilKey: 'jumo' });
    }
    camEnd();
    // exit: the ochre imprint fills the frame (1.6 opens on the ochre seal of the old map)
    const fillK = seg(st, S.dur - .45, S.dur);
    if (fillK > 0) { flushLetters(); boilSeed('a1s5 exit'); paint(ellPts(W / 2, H / 2, 200 + 1100 * easeIn(fillK), 200 + 1100 * easeIn(fillK), 40), { wash: PAL.ochre, washOp: 255 * seg(fillK, 0, .4), ink: null }); }
  }

  scene('1.5', S => [[0, hall]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), E = i => S.cueEnd(i);
      const signA = lerp(L(0), E(0), .62), clap1 = lerp(L(0), E(0), .88), dropB = L(1) - .5, signB = L(1) + .55, owlA = L(1) + .75, owlLand = L(1) + 1.55, gavel = lerp(L(1), E(1), .8);
      const walkA = E(1) + .5, walkB = L(2) + 1.0, incA = L(2) + 2.85, smpA = L(2) + 4.2, gavel2 = E(2) + .05, flipT = gavel2 + .7, stamp2 = flipT + .35, shrug = L(3) - .15;
      const clap2 = L(4) + .45, rise = clap2 + .1, riseB = rise + 1.5, line1 = L(4) + 1.75, line3 = L(4) + 2.8, kap = L(5) + 1.45, bon = L(5) + 2.65, lastSt = E(5) + .35;
      const out = [[.1, 'whoosh', .08], [1.1, 'whoosh', .05], [1.55, 'pop', .06], [signA, 'pop', .08, -.2], [signA + .05, 'pop', .08, .2], [clap1, 'clic', .12], [clap1 + .02, 'sparkle', .08],
        [dropB, 'whoosh', .05], [dropB + .45, 'pop', .06], [signB, 'pop', .08, -.2], [signB + .05, 'buzzer', .06, .2], [owlA, 'whoosh', .1, -.4], [owlLand, 'thud', .1], [owlLand + .12, 'squeak', .05],
        [owlLand + .3, 'tick', .05], [gavel, 'knock', .2], [gavel + .05, 'ding', .06]];
      for (let t = walkA + .3; t < walkB; t += .36) out.push([t, 'step', .05, -.5]);
      for (let i = 0; i < 4; i++) out.push([incA + i * .25, 'stamp', .14, -.5]);
      for (let i = 0; i < 3; i++) out.push([smpA + i * .3, 'rustle', .05, -.4], [smpA + i * .3 + .35, 'stamp', .1, -.4]);
      out.push([gavel2, 'knock', .18], [gavel2 + .2, 'whoosh', .08, -.3], [flipT, 'clic', .08, -.4], [stamp2, 'stamp', .2, -.4], [shrug, 'boing', .05], [shrug + .1, 'bipq', .05, .3],
        [clap2, 'clic', .12], [clap2 + .02, 'sparkle', .08], [rise, 'slideUp', .1, .4], [riseB, 'ding', .08, .4], [line1, 'chime', .06], [line3, 'chime', .05], [kap, 'sparkle', .06, .4], [bon, 'chime', .1, .4], [bon + .1, 'bip2', .06, .2],
        [lastSt, 'stamp', .25, -.4], [S.dur - .5, 'whoosh', .12]);
      return out;
    });
})();
