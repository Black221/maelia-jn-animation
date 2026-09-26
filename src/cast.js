// cast.js: every character of "Awa et Jumo", painted live with wash + ink (≈10 ms per shape in software GL).
// All characters are ORIGINAL designs for this film. The rig technique (drawn key views, acted mood changes with
// anticipation / take / overshoot, per-part boil seeds, hand hooks) follows ClaudeAnimationBase's clawd.js (MIT,
// John Heibel) and PDoomVideo's researcher; the characters themselves are new.
//
// ============================== PROPORTIONS (numbers are the model sheet) ==============================
// person(x, y, s, o) — Awa and the territory actors. (x, y) = ground point between the feet, s = unit.
//   total height ≈ 12.0 s (cap top ≈ 12.6 s). Picture-book proportions: the head is 38 % of the height.
//   head: centre (0, -9.55 s), rx 2.35 s, ry 2.25 s · neck -7.45..-7.05 s
//   torso: shoulders y -7.1 s (±1.75 s), hips y -3.7 s (±1.85 s)
//   arms: shoulder pivot (±1.72 s, -6.75 s); upper arm 1.95 s, forearm 1.75 s, width .78 s; hand r .46 s
//         angle a = 0 hangs, π/2 out sideways, π straight up; elbow e > 0 bends up/outward, e < 0 across the body
//   legs: hip joints (±.78 s, -3.75 s) to ankles (±.82 s, -1.0 s), width 1.08 s; boots 1.0 s tall, 1.5 s long
//   Awa at s = 22 is 264 px tall: a medium shot. Close-up s = 45–60, wide shot s = 9–13.
// jumo(x, y, u, o) — the drone. (x, y) = centre of the body; u = unit.
//   body r 4 u · screen 5.4 × 3.5 u, centre (0, -.5 u) · propeller arms from (±3.3 u, -2.2 u), 3.2 u long
//   antennas from (∓1.4 u, -3.8 u), 2.6 u tall · skids at y +3.9 u. Jumo at u = 14 is ~130 px wide.
//   stage 0 = MODÈLE (no antenna, grey screen) · 1 = OMBRE (one antenna, cyan in) · 2 = JUMEAU (two, ochre out)
// bipbop(x, y, u, o) — librarian robot twins (o.who 'bip' blue, 'bop' orange). Ground point; 11 u tall.
// arbitre(x, y, u, o) — Maître Arbitre, old owl-robot with spectacles. Ground point; 10 u tall.
// videur(x, y, u, o) — le Videur « Doute ». Ground point; 16 u tall, 9 u wide.
// tacti(x, y, u, o) — hyperactive irrigation robot with a valve wheel on its head. Ground point; 8 u tall.
// ========================================================================================================

const SKIN = { awa: '#8D5B3E', a: '#E8B791', b: '#B97A56', c: '#6E4632', d: '#D9A07A' };
const AWA = {
  skin: SKIN.awa, skinDk: '#6F432D', hair: '#2A1E22', shirt: PAL.ochre, shirtDk: '#B07A2A',
  pants: PAL.soil, pantsDk: '#2F6139', boots: '#5A3A2A', cap: 'terrain', braid: true, tablet: true, pockets: true
};
// Cap colours: the reversible cap. 'terrain' side (ochre crown, green brim) and 'labo' side (night blue, cyan brim).
const CAP = { terrain: ['#D99A3D', '#3E7C4A'], labo: ['#1F3A5F', '#3BC4D8'] };

// ---------------- expressions (faces + a little body) ----------------
// Each: eyes (open | happy | closed | wide | squint | look), brows [lift, tilt] (tilt > 0 = angry, < 0 = worried),
// mouth, blush, take (size of the reaction when it arrives), body(t) = idle motion.
const _bp = t => bpOf(t);
const EXPR = {
  neutre:     { eyes: 'open', brows: [0, 0], mouth: 'smile0', take: .3, body: t => ({ dy: -.05 * Math.abs(Math.sin(_bp(t) * Math.PI)) }) },
  joie:       { eyes: 'happy', brows: [.25, 0], mouth: 'grin', blush: .5, take: .6, body: t => ({ dy: -.18 * Math.abs(Math.sin(_bp(t) * Math.PI)), sq: .03 * pulse(t) }) },
  rire:       { eyes: 'happy', brows: [.35, 0], mouth: 'laugh', blush: .7, take: .8, body: t => ({ dy: -.3 * Math.abs(Math.sin(_bp(t) * TAU)), rot: .03 * Math.sin(_bp(t) * TAU) }) },
  doute:      { eyes: 'look', lookX: .5, lookY: -.6, brows: [.1, -.35], browsAsym: .35, mouth: 'wobble', take: .3,
                body: t => ({ aR: 2.35, eR: 1.55 + .18 * Math.sin(t * 9), headTilt: -.08, handR: 'scratch' }) },
  surprise:   { eyes: 'wide', brows: [.6, 0], mouth: 'o', take: 1.1, body: t => ({ aL: .55, aR: .55, eL: .5, eR: .5 }) },
  determinee: { eyes: 'open', lid: .25, brows: [-.1, .35], mouth: 'smirk', take: .5, body: t => ({ aL: .35, aR: .35, eL: -1.2, eR: -1.2, fist: true, dy: -.03 * pulse(t) }) },
  grimace:    { eyes: 'squint', brows: [.05, -.3], mouth: 'grimace', take: .5, body: t => ({ sq: .03, headTilt: .06 }) },
  idee:       { eyes: 'wide', brows: [.45, 0], mouth: 'grin', take: .9, body: t => ({ aR: 2.7, eR: .2, finger: 'R' }) },
  fiere:      { eyes: 'happy', brows: [.15, 0], mouth: 'smile', blush: .35, take: .4, body: t => ({ aL: .5, aR: .5, eL: -1.9, eR: -1.9, dy: -.06 }) },
  inquiete:   { eyes: 'open', lookX: -.3, brows: [.25, -.45], mouth: 'flat', take: .4, body: t => ({ aL: .2, aR: .2, eL: -.8, eR: -.8 }) },
  emerveillee:{ eyes: 'wide', brows: [.5, -.1], mouth: 'open', blush: .6, take: .6, body: t => ({ aL: .45, aR: .45, eL: -.9, eR: -.9, dy: -.05 }) },
  soupir:     { eyes: 'open', lid: .55, brows: [-.05, -.2], mouth: 'flat', take: .3, body: t => ({ sq: .05, aL: .1, aR: .1 }) },
  concentree: { eyes: 'look', lookX: .15, lookY: .6, lid: .2, brows: [0, .15], mouth: 'tongue', take: .2, body: t => ({}) },
};
// feelP(name, t, over): one expression, alive. actP(t, keys): acted changes, like ClaudeAnimationBase's emotions():
// a squint just before each change (anticipation), the face swaps under the squint, then a take sized to the new
// expression, and the body settles with overshoot. keys = [[t0, 'neutre'], [t1, 'surprise', { lookX: .8 }], ...].
function feelP(name, t, over = {}) {
  const E = EXPR[name] || EXPR.neutre;
  return { eyes: E.eyes, brows: E.brows, browsAsym: E.browsAsym || 0, mouth: E.mouth, blush: E.blush || 0, lid: E.lid || 0,
           lookX: E.lookX || 0, lookY: E.lookY || 0, expr: name, ...(E.body ? E.body(t) : {}), ...over };
}
function actP(t, keys, o = {}) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const [tc, name, over] = keys[i], age = t - tc, cur = feelP(name, t, over);
  const tn = i + 1 < keys.length ? keys[i + 1][0] : Infinity, E = EXPR[name] || EXPR.neutre;
  let squint = 0;
  if (tn - t < .1) squint = Math.max(squint, 1 - (tn - t) / .1);
  if (i > 0 && age < .14) squint = Math.max(squint, 1 - age / .14);
  const prev = i > 0 ? feelP(keys[i - 1][1], t, keys[i - 1][2]) : null;
  if (prev && age < .55) {
    const base = { dy: 0, sq: 0, aL: .12, aR: .12, eL: -.15, eR: -.15, rot: 0, headTilt: 0, lookX: 0, lookY: 0, lid: 0, blush: 0 };
    const k = backOut(seg(age, 0, .42)), kc = ease(seg(age, 0, .3));
    for (const f in base) { const a = prev[f] ?? base[f], b = cur[f] ?? base[f]; cur[f] = (f === 'lid' || f === 'blush') ? lerp(a, b, kc) : lerp(a, b, k); }
    cur.brows = [0, 1].map(j => lerp(prev.brows[j], cur.brows[j], kc));
  }
  const tkS = o.take ?? 1;
  const t1 = prev ? take(t, tc, (E.take ?? .5) * tkS * .6) : { sq: 0, dy: 0 };
  const En = i + 1 < keys.length ? EXPR[keys[i + 1][1]] : null, t2 = En ? take(t, tn, (En.take ?? .5) * tkS * .6) : { sq: 0, dy: 0 };
  cur.sq = (cur.sq || 0) + t1.sq * .6 + t2.sq * .6; cur.dy = (cur.dy || 0) + t1.dy * .25 + t2.dy * .25;
  cur.squint = squint; cur.exprAge = age;
  return cur;
}

// ---------------- person ----------------
// o: view (front | q | side | back), flip, dy (in s, − = up), sq, rot, sx
//    aL/aR, eL/eR (arms), handL/handR ('open' | 'fist' | 'scratch' | 'point' | fn(s, sw) hook at the hand)
//    walk (phase) or run (phase), sit, kneel, headTilt, headTurn (-1..1 look shift of features)
//    face: eyes, lookX/lookY, lid, squint, brows [lift, tilt], browsAsym, mouth, blush
//    look: cap ('terrain' | 'labo' | null), capTurn (0..1 flip progress, for the reversal gag), braid, braidSwing,
//          tablet (true | 'hand'), pockets, preset (AWA or an ACTEURS entry), prop(s, sw) hook between body and arms
//    boilKey
function person(x, y, s, o = {}) {
  const P = { ...AWA, ...(o.preset || {}), ...o };
  const id = o.boilKey ?? ('p' + (++CAST_N)), rs = part => boilSeed(`person ${id} ${part}`);
  const sw = clamp(s / 30, .32, 1.7), J = s * .045;
  const view = P.view || 'front', side = view === 'side', back = view === 'back', q = view === 'q';
  const dy = (P.dy || 0) * s, sq = (P.sq || 0) + (P.take || 0);
  const skinDk = P.skinDk || mixCol(P.skin, PAL.ink, .22), far = c => mixCol(c, PAL.ink, .2);

  rs('shadow');
  if (!P.noShadow) {
    const f = 1 - Math.min(.5, Math.abs(P.dy || 0) * .08);
    paint(ellPts(x, y + s * .12, s * (side ? 2.4 : 2.9) * f, s * .55 * f, 16), { wash: PAL.ink, washOp: 40, ink: null });
  }
  push();
  translate(x, y + dy);
  if (P.rot) rotate(P.rot);
  scale((P.flip ? -1 : 1) * (P.sx ?? 1) * (1 + sq * .5), 1 - sq);

  const bw = side ? .62 : q ? .88 : 1;                  // body width factor per view
  const hipY = -3.75, drop = P.sit ? 1.55 * s : 0;          // sitting lowers the whole upper body onto the seat
  // ---- arms (helper). which: 'L' (screen-left in front view) or 'R'
  const arm = (which, layer) => {
    rs('arm' + which);
    const sd = which === 'L' ? -1 : 1;
    const holdClip = P.tablet === 'hand' && P['a' + which] == null;
    let a = holdClip ? .25 : P['a' + which] ?? .12, e = holdClip ? -1.75 : P['e' + which] ?? -.15;
    if (P.walk != null && P['a' + which] == null) a = .12 + .45 * Math.sin((P.walk + (sd > 0 ? .5 : 0)) * TAU);
    if (P.run != null && P['a' + which] == null) { a = .3 + .9 * Math.sin((P.run + (sd > 0 ? .5 : 0)) * TAU); e = -1.3; }
    let px = sd * 1.72 * bw, py = -6.75;
    if (side) { px = layer === 0 ? -.25 : .15; }
    const dir = side ? 1 : sd;                            // in profile both arms swing in the facing direction
    const col = layer === 0 && (side || q) ? far(P.shirt) : P.shirt, skinC = layer === 0 && (side || q) ? far(P.skin) : P.skin;
    const u1 = [dir * Math.sin(a), Math.cos(a)], a2 = a + e, u2 = [dir * Math.sin(a2), Math.cos(a2)];
    const L1 = 1.95, L2 = 1.75, wd = .78;
    const sx0 = px * s, sy0 = py * s, ex = sx0 + u1[0] * L1 * s, ey = sy0 + u1[1] * L1 * s, hx = ex + u2[0] * L2 * s, hy = ey + u2[1] * L2 * s;
    // bare arm (skin) as one tapered ribbon, then the short sleeve over the shoulder and upper arm
    const long = P.longSleeves;
    paint(ribbon([[sx0, sy0], [ex, ey], [hx, hy]], wd * .8 * s, wd * .66 * s), { wash: long ? col : skinC, washOp: 255, ink: PAL.ink, sw: sw * .8 });
    if (!long) { const kx = lerp(sx0, ex, .78), ky = lerp(sy0, ey, .78); paint(ribbon([[sx0 - u1[0] * .25 * s, sy0 - u1[1] * .25 * s], [kx, ky]], wd * 1.15 * s, wd * 1.02 * s), { wash: col, washOp: 255, ink: PAL.ink, sw: sw * .8 }); }
    // hand
    const hand = P['hand' + which] ?? (P.fist ? 'fist' : P.finger === which ? 'point' : 'open');
    push(); translate(hx, hy); rotate(Math.atan2(u2[1], u2[0]) - Math.PI / 2);
    if (typeof hand === 'function') { paint(ellPts(0, .15 * s, .44 * s, .48 * s, 12), { wash: skinC, ink: PAL.ink, sw: sw * .6 }); hand(s, sw); }
    else if (hand === 'fist') paint(ellPts(0, .2 * s, .5 * s, .46 * s, 12), { wash: skinC, ink: PAL.ink, sw: sw * .7 });
    else if (hand === 'point') {
      paint(ellPts(0, .15 * s, .44 * s, .44 * s, 12), { wash: skinC, ink: PAL.ink, sw: sw * .6 });
      paint(ribbon([[0, .3 * s], [0, 1.05 * s]], .26 * s, .22 * s), { wash: skinC, ink: PAL.ink, sw: sw * .5 });
    } else {
      paint(ellPts(0, .25 * s, .46 * s, .52 * s, 12), { wash: skinC, ink: PAL.ink, sw: sw * .6 });
      if (hand !== 'scratch') inkLine([[-.44 * s * -dir, .15 * s], [-.62 * s * -dir, -.12 * s]], sw * .9, PAL.ink, 'inkfine', 0); // thumb
    }
    pop();
    return [hx, hy];
  };

  // back arm in profile / 3/4
  if (side || q) { push(); translate(0, drop); arm(P.flip ? 'R' : 'L', 0); pop(); }
  // ---- legs & boots
  const legs = () => {
    for (const sd of [-1, 1]) {
      rs('leg' + sd);
      let hx = sd * .78 * bw, lx = sd * .82 * bw, lift = 0, swing = 0;
      if (side) { hx = sd * .18; lx = hx; }
      if (P.walk != null) {
        const ph = (P.walk + (sd > 0 ? .5 : 0)) * TAU;
        if (side) swing = Math.sin(ph) * .5; else lift = Math.max(0, Math.sin(ph)) * .55;
        if (side) lift = Math.max(0, Math.cos(ph)) * .45;
      }
      if (P.run != null) { const ph = (P.run + (sd > 0 ? .5 : 0)) * TAU; swing = Math.sin(ph) * .8; lift = Math.max(0, Math.cos(ph)) * .9; }
      const kneeLen = (-hipY - 1.0);
      const ax = hx * s + Math.sin(swing) * kneeLen * s, ay = hipY * s + Math.cos(swing) * kneeLen * s - lift * s;
      const pc = side && sd < 0 ? far(P.pants) : P.pants;
      if (P.sit) {   // seat at -2.2 s: thighs forward (profile) or foreshortened (front), shins down to the ground
        const seat = (hipY + 1.55) * s, kx = hx * s + (side ? 2.0 * s : sd * .08 * s), ky = seat + (side ? .1 * s : .55 * s);
        const swingK = (P.kick || 0) * Math.sin(T * 5 + sd) * .5 * s;
        paint(ribbon([[hx * s - (side ? .3 * s : 0), seat], [kx, ky], [kx + swingK, -1.0 * s]], 1.12 * s, 1.0 * s), { wash: pc, washOp: 255, ink: PAL.ink, sw: sw * .8 });
        boot(kx + swingK, 0, sd); continue;
      }
      paint(ribbon([[hx * s, (hipY - .2) * s], [lerp(hx * s, ax, .5), lerp(hipY * s, ay, .5)], [ax, ay]], 1.12 * s, 1.02 * s), { wash: pc, washOp: 255, ink: PAL.ink, sw: sw * .8 });
      boot(ax, ay + 1.0 * s, sd);
    }
  };
  const boot = (bx, by, sd) => {
    const f = side ? 1 : 0, bc = side && sd < 0 ? far(P.boots) : P.boots;
    const pts = side ? [[bx - .55 * s, by - 1.15 * s], [bx + .5 * s, by - 1.15 * s], [bx + .55 * s, by - .45 * s], [bx + 1.25 * s, by - .35 * s], [bx + 1.3 * s, by], [bx - .62 * s, by]]
                     : [[bx - .62 * s, by - 1.12 * s], [bx + .62 * s, by - 1.12 * s], [bx + .7 * s, by - .2 * s], [bx + .72 * s + sd * .15 * s, by], [bx - .72 * s + sd * .15 * s, by], [bx - .7 * s, by - .2 * s]];
    paint(pts, { wash: bc, washOp: 255, ink: PAL.ink, sw: sw * .8 });
    inkLine([[bx - .6 * s, by - .3 * s], [bx + (side ? 1.2 : .65) * s, by - .3 * s]], sw * .5, mixCol(bc, PAL.cream, .35), 'inkfine', 0);
  };
  legs();

  push(); translate(0, drop);
  // ---- torso
  rs('torso');
  const tw = 1.78 * bw, hw = 1.9 * bw, ty = -7.1, torso = [[-tw * s, ty * s], [tw * s, ty * s], [(tw + .12) * s, (ty + 1.1) * s], [hw * s, (hipY + .1) * s], [-hw * s, (hipY + .1) * s], [-(tw + .12) * s, (ty + 1.1) * s]];
  paint(torso, { wash: P.shirt, washOp: 255, ink: PAL.ink, sw: sw * .9, curv: .15 });
  if (P.overalls !== false) {
    // overalls: bib + pants top; straps
    const bibT = -6.25, bx0 = 1.05 * bw, sh = side ? -.1 : 0;
    const bib = [[(-bx0 + sh) * s, bibT * s], [(bx0 + sh) * s, bibT * s], [hw * s, (hipY + .1) * s], [(hw + .02) * s, (hipY + .9) * s], [-(hw + .02) * s, (hipY + .9) * s], [-hw * s, (hipY + .1) * s]];
    paint(bib, { wash: P.pants, washOp: 255, ink: PAL.ink, sw: sw * .85 });
    if (!back) {
      paint(rrPts((-.62 + sh) * s, -5.9 * s, 1.24 * s, .95 * s, .2 * s), { wash: P.pantsDk, washOp: 255, ink: PAL.ink, sw: sw * .55 });   // bib pocket
      if (P.pockets) {   // tools poking out: a pencil, a ruler
        inkLine([[(-.35 + sh) * s, -5.95 * s], [(-.3 + sh) * s, -6.55 * s]], sw * 1.4, PAL.red, 'ink', 0);
        inkLine([[(.15 + sh) * s, -5.95 * s], [(.2 + sh) * s, -6.45 * s]], sw * 1.8, '#E8D9A8', 'ink', 0);
      }
      for (const sd of side ? [1] : [-1, 1]) paint(ellPts((sd * (bx0 - .22) + sh) * s, (bibT + .25) * s, .16 * s, .16 * s, 8), { wash: '#E8C66A', ink: PAL.ink, sw: sw * .4 });
    }
    // straps to the shoulders (crossed in the back)
    for (const sd of side ? [1] : [-1, 1]) {
      const a0 = back ? [-sd * (bx0 - .2) * s, bibT * s] : [(sd * (bx0 - .22) + sh) * s, bibT * s];
      inkLine([a0, [sd * (tw - .55) * s, ty * s]], sw * 2.2, P.pantsDk, 'ink', 0);
    }
  }
  // tablet on its strap (bandoulière)
  if (P.tablet === true && !back) {
    rs('tablet');
    inkLine([[-(tw - .45) * s, ty * s], [(hw - .25) * s, (hipY + .4) * s]], sw * 1.8, '#7A5638', 'ink', 0);
    const tx = (hw - .15) * s * (side ? .4 : 1), tyy = (hipY + .3) * s;
    paint(rrPts(tx - .95 * s, tyy - .7 * s, 1.9 * s, 1.35 * s, .18 * s), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    paint(rrPts(tx - .78 * s, tyy - .55 * s, 1.56 * s, 1.05 * s, .1 * s), { wash: PAL.data, washOp: 200, ink: null });
  }
  if (P.tie && !back) {
    rs('tie');
    paint([[-.55 * s * bw, ty * s], [.55 * s * bw, ty * s], [0, (ty + 1.3) * s]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .5 });
    paint([[-.2 * s, (ty + .3) * s], [.2 * s, (ty + .3) * s], [.32 * s, (ty + 2.4) * s], [0, (ty + 2.8) * s], [-.32 * s, (ty + 2.4) * s]], { wash: PAL.ochre, washOp: 255, ink: PAL.ink, sw: sw * .5 });
    inkLine([[-.6 * s * bw, ty * s], [-.1 * s, (ty + 2.6) * s], [-.25 * s, (hipY + .1) * s]], sw * .6, PAL.ink, 'inkfine', 0);
    inkLine([[.6 * s * bw, ty * s], [.1 * s, (ty + 2.6) * s]], sw * .6, PAL.ink, 'inkfine', 0);
  }
  if (P.tablet === 'hand' && !back) {   // a clipboard held against the chest
    rs('clip');
    const cx0 = side ? 1.1 * s : 0;
    paint(rrPts(cx0 - 1.2 * s, -6.3 * s, 2.4 * s, 2.9 * s, .2 * s), { wash: '#B98A57', washOp: 255, ink: PAL.ink, sw: sw * .7 });
    paint(rectPts(cx0 - 1.0 * s, -6.0 * s, 2.0 * s, 2.45 * s), { wash: PAL.cream, washOp: 255, ink: null });
    for (let k = 0; k < 4; k++) inkLine([[cx0 - .75 * s, (-5.6 + k * .5) * s], [cx0 + .7 * s, (-5.6 + k * .5) * s]], sw * .5, PAL.grey, 'inkfine', 0);
    paint(rrPts(cx0 - .45 * s, -6.5 * s, .9 * s, .4 * s, .1 * s), { wash: '#9C98A6', ink: PAL.ink, sw: sw * .4 });
  }
  if (P.prop) { rs('prop'); P.prop(s, sw); }

  // ---- head
  rs('head');
  const tilt = P.headTilt || 0, hcx = side ? .35 : q ? .12 : 0, hcy = -9.55;
  push(); translate(0, -7.2 * s); rotate(tilt); translate(0, 7.2 * s);
  paint(rectPts(-.42 * s, -7.7 * s, .84 * s, .8 * s), { wash: skinDk, washOp: 255, ink: null });   // neck
  // braid (behind the head, swings)
  if (P.braid) {
    rs('braid');
    const swg = P.braidSwing ?? (.18 * Math.sin(T * 2.1) + (P.walk != null ? .12 * Math.sin(P.walk * TAU * 2) : 0));
    const bx = back ? 0 : side ? -1.9 : -1.95, byy = -9.0;
    const bp = [[bx * s, byy * s], [(bx - .25 + swg * 1.2) * s, (byy + 1.6) * s], [(bx - .1 + swg * 2.4) * s, (byy + 3.3) * s]];
    if (!(view === 'front' && !P.braidFront)) {
      paint(ribbon(bp, .95 * s, .55 * s), { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .7 });
      for (let k = 1; k < 4; k++) { const pp = through(bp)[k * 3]; if (pp) inkLine([[pp[0] - .35 * s, pp[1] - .1 * s], [pp[0] + .35 * s, pp[1] + .15 * s]], sw * .5, mixCol(P.hair, PAL.cream, .3), 'inkfine', 0); }
      const tip = bp[2]; paint(ellPts(tip[0], tip[1] + .15 * s, .32 * s, .22 * s, 10), { wash: PAL.ochre, ink: PAL.ink, sw: sw * .5 });   // bead
    }
  }
  // head shape
  const hr = 2.35, hv = 2.25;
  let headPts;
  if (side) {   // profile facing +x: skull, forehead, nose, lips, chin, jaw
    const C = []; for (let i = 0; i <= 16; i++) { const a = -Math.PI * .42 - i / 16 * Math.PI * 1.2; C.push([hcx + Math.cos(a) * hr * .98, hcy + Math.sin(a) * hv]); }
    C.push([hcx + .9, hcy + 2.05], [hcx + 1.75, hcy + 1.75], [hcx + 2.05, hcy + 1.35], [hcx + 2.0, hcy + 1.15], [hcx + 2.18, hcy + .95],
           [hcx + 2.1, hcy + .72], [hcx + 2.55, hcy + .45], [hcx + 2.28, hcy + .05], [hcx + 2.18, hcy - .6], [hcx + 1.75, hcy - 1.6]);
    headPts = through(C, 3).map(([a, b]) => [a * s, b * s]);
  } else headPts = ellPts(hcx * s, hcy * s, hr * s * (q ? .97 : 1), hv * s, 28, J * .4);
  // ears
  if (!back) for (const sd of side ? [-1] : q ? [-1] : [-1, 1]) paint(ellPts((hcx + sd * (side ? .15 : hr - .05)) * s, (hcy + .25) * s, .42 * s, .58 * s, 12), { wash: P.skin, ink: PAL.ink, sw: sw * .6 });
  paint(headPts, { wash: back ? P.hair : P.skin, washOp: 255, ink: PAL.ink, sw: sw * .9 });
  if (back) {   // the back of the head: hair texture strokes
    for (let k = -2; k <= 2; k++) inkLine([[(hcx + k * .7) * s, (hcy - 1.4) * s], [(hcx + k * .85) * s, (hcy + 1.2) * s]], sw * .6, mixCol(P.hair, PAL.cream, .25), 'inkfine', .4);
  } else {
    if (!P.cap || P.hairStyle) hairStyle(P, hcx, hcy, s, sw, view);
    else {   // hair under the cap: sideburn curls at the temples
      for (const sd of side ? [-1] : q ? [-1] : [-1, 1]) {
        const tx = side ? hcx - .9 : hcx + sd * 2.05;
        paint(ellPts(tx * s, (hcy - .75) * s, .55 * s, .75 * s, 12), { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .5 });
      }
      if (side) paint(ellPts((hcx - 1.3) * s, (hcy - .6) * s, 1.05 * s, 1.05 * s, 14), { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .5 });
    }
    personFace(P, hcx, hcy, s, sw, view);
  }
  if (P.cap) capDraw(P, hcx, hcy, s, sw, view);
  pop();

  // ---- front arms
  if (side || q) arm(P.flip ? 'L' : 'R', 1);
  else { arm('L', 1); arm('R', 1); }
  if (P.draw) { rs('draw'); P.draw(s, sw); }
  pop();   // upper body
  pop();
  rs('after');
}

function hairStyle(P, hcx, hcy, s, sw, view) {
  const hs = P.hairStyle || 'short', hr = 2.35;
  if (hs === 'bun') {
    paint(ellPts(hcx * s, (hcy - 1.2) * s, 2.3 * s, 1.35 * s, 20), { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts((hcx - .2) * s, (hcy - 2.6) * s, 1.0 * s, .85 * s, 14), { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .6 });
  } else if (hs === 'bald') {
    for (const sd of view === 'side' ? [-1] : [-1, 1]) paint(ellPts((hcx + sd * 2.0) * s, (hcy - .2) * s, .5 * s, .9 * s, 12), { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .5 });
  } else if (hs === 'curly') {
    const pts = []; for (let i = 0; i <= 22; i++) { const a = Math.PI * (.95 + i / 22 * 1.1), r = hr * (1.1 + .07 * Math.sin(i * 2.7)); pts.push([(hcx + Math.cos(a) * r) * s, (hcy - .25 + Math.sin(a) * r * .95) * s]); }
    pts.push([(hcx + 1.8) * s, (hcy - .7) * s], [(hcx - 1.8) * s, (hcy - .7) * s]);
    paint(pts, { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .6, curv: .3 });
  } else if (hs === 'long' && view === 'side') {
    paint([[(hcx + 1.2) * s, (hcy - 2.2) * s], [(hcx - 1.5) * s, (hcy - 2.1) * s], [(hcx - 2.5) * s, (hcy - .6) * s], [(hcx - 2.6) * s, (hcy + 2.4) * s], [(hcx - 1.0) * s, (hcy + 2.3) * s], [(hcx - .6) * s, (hcy - .5) * s], [(hcx + 1.4) * s, (hcy - 1.2) * s]], { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .6, curv: .3 });
  } else if (hs === 'long') {
    paint([[(hcx - 2.5) * s, (hcy + 2.3) * s], [(hcx - 2.55) * s, (hcy - 1.2) * s], [(hcx - 1.2) * s, (hcy - 2.4) * s], [(hcx + 1.3) * s, (hcy - 2.4) * s], [(hcx + 2.55) * s, (hcy - 1.2) * s], [(hcx + 2.5) * s, (hcy + 2.3) * s], [(hcx + 1.9) * s, (hcy + 2.3) * s], [(hcx + 1.8) * s, (hcy - .7) * s], [(hcx - 1.8) * s, (hcy - .7) * s], [(hcx - 1.9) * s, (hcy + 2.3) * s]], { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .6, curv: .3 });
  } else {
    const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (1.0 + i / 12), r = hr * 1.06; pts.push([(hcx + Math.cos(a) * r) * s, (hcy - .1 + Math.sin(a) * r) * s]); }
    pts.push([(hcx + 1.6) * s, (hcy - 1.0) * s], [(hcx - 1.6) * s, (hcy - 1.0) * s]);
    paint(pts, { wash: P.hair, washOp: 255, ink: PAL.ink, sw: sw * .6 });
  }
  if (P.hat === 'straw') {   // agricultrice's straw hat
    paint(ellPts(hcx * s, (hcy - 1.7) * s, 3.9 * s, .75 * s, 22), { wash: '#E6C77A', washOp: 255, ink: PAL.ink, sw: sw * .7 });
    paint([[(hcx - 1.7) * s, (hcy - 1.8) * s], [(hcx - 1.4) * s, (hcy - 3.3) * s], [(hcx + 1.4) * s, (hcy - 3.3) * s], [(hcx + 1.7) * s, (hcy - 1.8) * s]], { wash: '#E6C77A', washOp: 255, ink: PAL.ink, sw: sw * .7, curv: .3 });
    inkLine([[(hcx - 1.65) * s, (hcy - 2.1) * s], [(hcx + 1.65) * s, (hcy - 2.1) * s]], sw * 2.2, PAL.red, 'ink', 0);
  } else if (P.hat === 'flat') {  // éleveur's flat cap
    paint([[(hcx - 2.4) * s, (hcy - 1.0) * s], [(hcx - 2.0) * s, (hcy - 2.4) * s], [(hcx + 1.6) * s, (hcy - 2.55) * s], [(hcx + 2.4) * s, (hcy - 1.5) * s], [(hcx + 3.2) * s, (hcy - .95) * s], [(hcx + 2.2) * s, (hcy - .8) * s]], { wash: '#6B6A5A', washOp: 255, ink: PAL.ink, sw: sw * .7, curv: .3 });
  }
}

function capDraw(P, hcx, hcy, s, sw, view) {
  // capTurn 0..1: the reversal gag. The cap squashes flat at .5 and comes back showing the other side.
  const ct = clamp(P.capTurn || 0), which = ct < .5 ? P.cap : (P.cap === 'terrain' ? 'labo' : 'terrain');
  const [crown, brim] = CAP[which], k = Math.abs(Math.cos(ct * Math.PI));
  push(); translate(hcx * s, (hcy - 1.62) * s); scale(lerp(.25, 1, k) * (view === 'side' ? .92 : 1), 1);
  const side = view === 'side', back = view === 'back';
  paint([[-2.5 * s, .32 * s], [-2.35 * s, -.75 * s], [-1.35 * s, -1.7 * s], [0, -1.95 * s], [1.35 * s, -1.7 * s], [2.35 * s, -.75 * s], [2.5 * s, .32 * s]], { wash: crown, washOp: 255, ink: PAL.ink, sw: sw * .8, curv: .35 });
  inkLine([[0, -1.9 * s], [0, .3 * s]], sw * .45, mixCol(crown, PAL.ink, .4), 'inkfine', 0);
  paint(ellPts(0, -1.95 * s, .3 * s, .2 * s, 8), { wash: brim, ink: PAL.ink, sw: sw * .4 });
  if (!back) {
    if (side) paint([[1.4 * s, .05 * s], [3.4 * s, .22 * s], [3.45 * s, .5 * s], [1.4 * s, .45 * s]], { wash: brim, washOp: 255, ink: PAL.ink, sw: sw * .7, curv: .4 });
    else paint([[-2.35 * s, .15 * s], [2.35 * s, .15 * s], [2.0 * s, .58 * s], [0, .72 * s], [-2.0 * s, .58 * s]], { wash: brim, washOp: 255, ink: PAL.ink, sw: sw * .7, curv: .4 });
  }
  pop();
}

function personFace(P, hcx, hcy, s, sw, view) {
  const side = view === 'side', q = view === 'q', turn = P.headTurn || 0;
  const fx = (side ? 1.35 : q ? .7 : 0) + turn * .5;
  const sq = clamp(P.squint || 0), lid = clamp(P.lid || 0);
  const blinkT = (T * .73 + (P.seed || 0) * .37) % 3.9, blink = blinkT < .13 && P.eyes !== 'happy' && P.eyes !== 'closed';
  const eyesX = side ? [fx + .55] : q ? [fx - .95, fx + 1.0] : [fx - 1.0, fx + 1.0];
  const ey = hcy + .25, lx = (P.lookX || 0) * .22, ly = (P.lookY || 0) * .2;
  // blush
  if (P.blush > .02) for (const ex of eyesX) paint(ellPts((ex + (ex < fx ? -.35 : .35)) * s, (ey + 1.05) * s, .55 * s, .3 * s, 12), { wash: PAL.rose, washOp: 120 * clamp(P.blush), ink: null });
  eyesX.forEach((ex, i) => {
    const small = q && i === 0 ? .85 : 1, e = sq > .75 || blink ? 'closed' : P.eyes || 'open';
    const cx = ex * s, cy = ey * s;
    if (e === 'closed') inkLine([[cx - .42 * s, cy + .05 * s], [cx, cy + .22 * s], [cx + .42 * s, cy + .05 * s]], sw * 1.1, PAL.ink, 'ink', .5);
    else if (e === 'happy') inkLine([[cx - .45 * s, cy + .2 * s], [cx, cy - .28 * s], [cx + .45 * s, cy + .2 * s]], sw * 1.2, PAL.ink, 'ink', .5);
    else if (e === 'squint') { inkLine([[cx - .45 * s, cy - .15 * s], [cx + .4 * s, cy + .05 * s]], sw * 1.2, PAL.ink, 'ink', 0); inkLine([[cx - .45 * s, cy + .2 * s], [cx + .4 * s, cy + .05 * s]], sw * 1.1, PAL.ink, 'ink', 0); }
    else {
      const wide = e === 'wide', rx = (wide ? .42 : .3) * small, ry = (wide ? .52 : .42) * (1 - lid * .5) * (1 - sq * .7);
      if (wide) paint(ellPts(cx, cy, rx * s * 1.45, ry * s * 1.3, 14), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .5 });
      paint(ellPts(cx + lx * s * .6, cy + ly * s * .6, rx * s, ry * s, 14), { wash: '#24171B', washOp: 255, ink: null });
      paint(ellPts(cx + lx * s * .6 + rx * .35 * s, cy + ly * s * .6 - ry * .4 * s, .1 * s, .1 * s, 8), { wash: PAL.cream, washOp: 255, ink: null });
      if (lid > .1) inkLine([[cx - rx * 1.3 * s, cy - ry * (1 - lid) * s], [cx + rx * 1.3 * s, cy - ry * (1 - lid) * s]], sw * 1.3, PAL.ink, 'ink', 0);
    }
  });
  if (P.glasses) { eyesX.forEach(ex => paint(ellPts(ex * s, ey * s, .62 * s, .56 * s, 16), { ink: '#5A3A2A', sw: sw * .9 })); if (eyesX.length > 1) inkLine([[(eyesX[0] + .6) * s, ey * s], [(eyesX[1] - .6) * s, ey * s]], sw * .8, '#5A3A2A', 'inkfine', 0); }
  // brows
  const [lift, tilt] = P.brows || [0, 0], asym = P.browsAsym || 0;
  eyesX.forEach((ex, i) => {
    const sd = eyesX.length > 1 ? (i ? 1 : -1) : 1, by = hcy - .62 - lift * .5 - (i ? asym : 0) * .4;
    const t2 = tilt * sd;
    inkLine([[(ex - .4) * s, (by - t2 * .3) * s], [(ex + .4) * s, (by + t2 * .3) * s]], sw * 1.6, P.hair, 'ink', 0);
  });
  // nose
  const nx = fx + (side ? 1.95 : q ? .35 : 0);
  if (!side) inkLine([[(nx - .05) * s, (hcy + .55) * s], [(nx + .18) * s, (hcy + .85) * s], [(nx - .08) * s, (hcy + .95) * s]], sw * .6, mixCol(P.skin, PAL.ink, .5), 'inkfine', .4);
  // mouth
  const mx = (fx + (side ? 1.15 : q ? .3 : 0)) * s, my = (hcy + 1.45) * s, m = P.mouth || 'smile0', dk = '#5A2230';
  const W1 = s * (side ? .55 : .75);
  if (m === 'smile0') inkLine([[mx - W1 * .6, my], [mx, my + .16 * s], [mx + W1 * .6, my]], sw * .8, PAL.ink, 'ink', .6);
  else if (m === 'smile') inkLine([[mx - W1, my - .1 * s], [mx, my + .28 * s], [mx + W1, my - .1 * s]], sw * .9, PAL.ink, 'ink', .6);
  else if (m === 'grin' || m === 'laugh') {
    const hh = m === 'laugh' ? .75 : .5;
    paint([[mx - W1 * 1.05, my - .12 * s], [mx + W1 * 1.05, my - .12 * s], [mx + W1 * .55, my + hh * s], [mx - W1 * .55, my + hh * s]], { wash: dk, washOp: 255, ink: PAL.ink, sw: sw * .6, curv: .5 });
    paint(ellPts(mx, my + (hh - .12) * s, W1 * .45, .13 * s, 10), { wash: PAL.rose, washOp: 255, ink: null });
    paint([[mx - W1 * .85, my - .1 * s], [mx + W1 * .85, my - .1 * s], [mx + W1 * .7, my + .06 * s], [mx - W1 * .7, my + .06 * s]], { wash: PAL.cream, washOp: 255, ink: null });
  }
  else if (m === 'o') paint(ellPts(mx, my + .1 * s, .26 * s, .33 * s, 10), { wash: dk, washOp: 255, ink: PAL.ink, sw: sw * .5 });
  else if (m === 'open') paint(ellPts(mx, my + .12 * s, .42 * s, .4 * s, 12), { wash: dk, washOp: 255, ink: PAL.ink, sw: sw * .5 });
  else if (m === 'flat') inkLine([[mx - W1 * .7, my + .05 * s], [mx + W1 * .7, my + .05 * s]], sw * .8, PAL.ink, 'ink', 0);
  else if (m === 'wobble') inkLine([[mx - W1, my + .05 * s], [mx - W1 * .5, my - .08 * s], [mx, my + .06 * s], [mx + W1 * .5, my - .08 * s], [mx + W1, my + .05 * s]], sw * .75, PAL.ink, 'ink', .3);
  else if (m === 'smirk') inkLine([[mx - W1 * .7, my + .1 * s], [mx + W1 * .3, my + .12 * s], [mx + W1 * .85, my - .12 * s]], sw * .9, PAL.ink, 'ink', .5);
  else if (m === 'frown') inkLine([[mx - W1 * .8, my + .2 * s], [mx, my - .05 * s], [mx + W1 * .8, my + .2 * s]], sw * .9, PAL.ink, 'ink', .6);
  else if (m === 'tongue') { inkLine([[mx - W1 * .6, my], [mx + W1 * .5, my + .05 * s]], sw * .8, PAL.ink, 'ink', .3); paint(ellPts(mx + W1 * .45, my + .15 * s, .16 * s, .16 * s, 8), { wash: PAL.rose, ink: PAL.ink, sw: sw * .4 }); }
  else if (m === 'grimace') {
    paint(rrPts(mx - W1 * 1.0, my - .15 * s, W1 * 2, .45 * s, .12 * s), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    for (let k = 1; k < 4; k++) inkLine([[mx - W1 + k * W1 / 2, my - .15 * s], [mx - W1 + k * W1 / 2, my + .3 * s]], sw * .45, PAL.ink, 'inkfine', 0);
    inkLine([[mx - W1, my + .08 * s], [mx + W1, my + .08 * s]], sw * .45, PAL.ink, 'inkfine', 0);
  }
}
// shorthand: Awa
function awa(x, y, s, o = {}) { person(x, y, s, { preset: AWA, boilKey: o.boilKey ?? 'awa', ...o }); }

// The territory actors (4 silhouettes, original designs). Spread one into person(): person(x, y, s, { preset: ACTEURS.eleveur }).
const ACTEURS = {
  agricultrice: { skin: SKIN.d, hair: '#6A3A22', hairStyle: 'long', hat: 'straw', shirt: '#C8553D', shirtDk: '#9A3F2D', pants: '#3E5F8A', pantsDk: '#2E4868', boots: '#4E7A4A', cap: null, braid: false, tablet: false, pockets: false },
  eleveur:      { skin: SKIN.c, hair: '#1E1A1C', hairStyle: 'short', hat: 'flat', shirt: '#7B8B4A', shirtDk: '#5E6B37', pants: '#6B5238', pantsDk: '#4E3B28', boots: '#3A2A22', cap: null, braid: false, tablet: false, pockets: false },
  elu:          { skin: SKIN.a, hair: '#9A9AA0', hairStyle: 'bald', shirt: '#46557A', shirtDk: '#343F5C', pants: '#3A3F52', pantsDk: '#2A2E3C', boots: '#2B2530', cap: null, braid: false, tablet: false, pockets: false, overalls: false, tie: true },
  conseillere:  { skin: SKIN.b, hair: '#2A1E22', hairStyle: 'curly', shirt: '#7B5CA8', shirtDk: '#5C4480', pants: '#D99A3D', pantsDk: '#A87A2E', boots: '#5A3A2A', cap: null, braid: false, tablet: 'hand', pockets: false, overalls: false, glasses: true },
};

// ---------------- Jumo ----------------
// o: stage 0 | 1 | 2, face ('neutral' | 'happy' | 'wide' | 'sad' | 'love' | 'dizzy' | 'question' | 'cookie' | 'loading' |
//    'tree' | 'excl' | 'wink' | 'angry' | 'sleep' | 'scan' | 'check' | 'cross'), faceK (0..1 pop of the face change),
//    lookX/lookY, rot, sq, flip, prop ('fold' | 'spin'), spin (rotor phase), antK (0..1 growth of the newest antenna),
//    beamIn / beamOut (0..1 data flows on the antenna tips), badge (Act III: "provisoire" tag), glowScreen, boilKey,
//    grin (screen shows a projection: fn(u, sw) drawn inside the screen)
const JUMO = { body: '#4E86C4', bodyDk: '#34629A', bodyLt: '#8DB8E2', screen: '#1F3A5F', rim: '#F4EAD8', grey: '#8E96A3' };
function jumo(x, y, u, o = {}) {
  const id = o.boilKey ?? 'jumo', rs = part => boilSeed(`jumo ${id} ${part}`);
  const sw = clamp(u / 22, .3, 1.5), st = o.stage ?? 0, sq = o.sq || 0;
  rs('shadow');
  if (o.shadowY != null) { const d = Math.max(0, o.shadowY - y), f = clamp(1 - d / 700, .25, 1); paint(ellPts(x, o.shadowY, u * 3.4 * f, u * .6 * f, 14), { wash: PAL.ink, washOp: 38 * f, ink: null }); }
  push(); translate(x, y); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + sq * .5) * (o.s ?? 1), (1 - sq) * (o.s ?? 1));
  // skids
  rs('skids');
  for (const sd of [-1, 1]) {
    inkLine([[sd * 1.6 * u, 3.3 * u], [sd * 2.1 * u, 4.1 * u]], sw * 1.6, PAL.ink, 'ink', 0);
    paint(rrPts(sd * 2.1 * u - 1 * u, 3.95 * u, 2 * u, .45 * u, .2 * u), { wash: JUMO.bodyDk, ink: PAL.ink, sw: sw * .6 });
  }
  // propeller arms + rotors
  const spinning = o.prop === 'spin', ph = o.spin ?? T * 9;
  for (const sd of [-1, 1]) {
    rs('prop' + sd);
    const ax = sd * 3.3 * u, ay = -2.2 * u, tx = sd * 5.9 * u, ty = -3.9 * u;
    paint(ribbon([[ax, ay], [(ax + tx) / 2, (ay + ty) / 2 - .2 * u], [tx, ty]], .8 * u, .6 * u), { wash: JUMO.bodyDk, ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(tx, ty, .55 * u, .45 * u, 10), { wash: JUMO.rim, ink: PAL.ink, sw: sw * .6 });
    if (spinning) {
      paint(ellPts(tx, ty - .3 * u, 2.5 * u, .42 * u, 18), { wash: '#DDE8EE', washOp: 90, ink: null });
      paint(ellPts(tx, ty - .3 * u, 2.5 * u, .42 * u, 18), { ink: mixCol(PAL.ink, PAL.cream, .55), sw: sw * .35, br: 'inkfine' });
      const b = Math.cos(ph * TAU + sd * 1.3) * 2.3 * u;
      inkLine([[tx - b, ty - .3 * u], [tx + b, ty - .3 * u]], sw * .9, '#4A5260', 'ink', 0);
      for (const e of [-1, 1]) inkLine([[tx + e * 2.1 * u, ty - .55 * u], [tx + e * 2.7 * u, ty - .7 * u]], sw * .4, PAL.ink, 'inkfine', 0);
    } else {   // folded blades lie along the arm
      paint(ribbon([[tx, ty], [tx - sd * 1.6 * u, ty + 1.1 * u]], .5 * u, .3 * u), { wash: JUMO.rim, ink: PAL.ink, sw: sw * .5 });
    }
  }
  // antennas: 0, 1 or 2 (stage), the newest grows in with antK
  rs('ant');
  const ants = st >= 1 ? (st >= 2 ? [[-1, PAL.data, 1], [1, PAL.ochre, o.antK ?? 1]] : [[-1, PAL.data, o.antK ?? 1]]) : [];
  for (const [sd, col, k] of ants) {
    if (k < .02) continue;
    const bx = sd * 1.4 * u, by = -3.75 * u, h = 2.6 * u * backOut(k), wig = Math.sin(T * 3 + sd) * .25 * u;
    inkLine([[bx, by], [bx + sd * .3 * u + wig * .5, by - h * .55], [bx + sd * .5 * u + wig, by - h]], sw * 1.5, PAL.ink, 'ink', .5);
    const tip = [bx + sd * .5 * u + wig, by - h], beam = sd < 0 ? o.beamIn || 0 : o.beamOut || 0;
    if (beam > .02) glow(tip[0], tip[1], (2.2 + .6 * Math.sin(T * 10)) * u * beam, col, .9 * beam);
    paint(ellPts(tip[0], tip[1], .62 * u * k, .62 * u * k, 12), { wash: col, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(tip[0] - .18 * u, tip[1] - .2 * u, .18 * u * k, .18 * u * k, 8), { wash: PAL.cream, ink: null });
  }
  // body
  rs('body');
  paint(ellPts(0, 0, 4 * u, 3.85 * u, 30), { wash: JUMO.body, washOp: 255, ink: null });
  paint(ellPts(0, 1.9 * u, 3.5 * u, 1.9 * u, 22), { wash: JUMO.bodyDk, washOp: 150, ink: null });
  paint(ellPts(-1.3 * u, -2.3 * u, 1.6 * u, .8 * u, 16, 0, -.35), { wash: JUMO.bodyLt, washOp: 200, ink: null });
  paint(ellPts(0, 0, 4 * u, 3.85 * u, 30), { ink: PAL.ink, sw: sw * 1.05 });
  // screen with a cream rim
  rs('screen');
  paint(rrPts(-3.0 * u, -2.45 * u, 6.0 * u, 3.9 * u, 1.3 * u), { wash: JUMO.rim, washOp: 255, ink: PAL.ink, sw: sw * .8 });
  const scr = st === 0 ? '#5E6573' : JUMO.screen;
  paint(rrPts(-2.65 * u, -2.1 * u, 5.3 * u, 3.2 * u, 1.05 * u), { wash: scr, washOp: 255, ink: PAL.ink, sw: sw * .6 });
  if (st > 0 && (o.glowScreen ?? .5) > 0) glow(0, -.5 * u, 3.4 * u, PAL.data, .25 * (o.glowScreen ?? .5));
  const fc = st === 0 ? JUMO.grey : PAL.data;
  if (o.grin) o.grin(u, sw); else jumoFace(o.face || 'neutral', u, sw, fc, o);
  // little status light + badge
  rs('badge');
  paint(ellPts(0, 2.3 * u, .3 * u, .3 * u, 8), { wash: st === 2 ? PAL.ochre : st === 1 ? PAL.data : JUMO.grey, ink: PAL.ink, sw: sw * .4 });
  if (o.badge) jumoBadge(u, sw, o);
  if (o.draw) o.draw(u, sw);
  pop();
  // the tag's word, placed in world space (letters don't follow push/translate); only when it can be read
  if (o.badge && u * (o.s ?? 1) >= 9) { const d = o.flip ? -1 : 1, k = (o.s ?? 1); letter('provisoire', x + d * 2.2 * u * k, y + 2.78 * u * k, .62 * u * k, PAL.ink, { rot: d * .12 + (o.rot || 0), weight: 600 }); }
  rs('after');
}
function jumoFace(f, u, sw, c, o) {
  const k = o.faceK ?? 1, lx = (o.lookX || 0) * .45 * u, ly = (o.lookY || 0) * .35 * u, ex = 1.15 * u, ey = -.7 * u;
  const blink = f === 'neutral' && ((T * .9 + 2.1) % 3.3) < .12;
  const P = (x, y) => [x + lx, y + ly];
  push(); translate(0, 0); scale(lerp(.6, 1, backOut(k)));
  const dotEye = (sx, r = .42) => paint(ellPts(...P(sx, ey), r * u, r * 1.15 * u, 12), { wash: c, washOp: 255, ink: null });
  const arc = (sx, up = true) => inkLine([P(sx - .5 * u, ey + (up ? .2 : -.2) * u), P(sx, ey + (up ? -.3 : .3) * u), P(sx + .5 * u, ey + (up ? .2 : -.2) * u)], sw * 1.6, c, 'ink', .5);
  const mouthArc = (h = .3) => inkLine([P(-.7 * u, .25 * u), P(0, (.25 + h) * u), P(.7 * u, .25 * u)], sw * 1.4, c, 'ink', .5);
  switch (f) {
    case 'happy': arc(-ex); arc(ex); mouthArc(.4); break;
    case 'wide': for (const s of [-1, 1]) { paint(ellPts(...P(s * ex, ey), .62 * u, .72 * u, 14), { wash: c, washOp: 255, ink: null }); paint(ellPts(...P(s * ex + .15 * u, ey - .2 * u), .2 * u, .2 * u, 8), { wash: JUMO.screen, ink: null }); } paint(ellPts(...P(0, .45 * u), .3 * u, .35 * u, 10), { wash: c, ink: null }); break;
    case 'sad': for (const s of [-1, 1]) { dotEye(s * ex, .36); inkLine([P(s * ex - .45 * u, ey - .75 * u + (s < 0 ? .25 : 0) * u), P(s * ex + .45 * u, ey - .75 * u + (s < 0 ? 0 : .25) * u)], sw, c, 'ink', 0); } inkLine([P(-.6 * u, .6 * u), P(0, .3 * u), P(.6 * u, .6 * u)], sw * 1.3, c, 'ink', .5); break;
    case 'love': for (const s of [-1, 1]) paint(heartPts(...P(s * ex, ey), .62 * u * (1 + .12 * Math.sin(T * 12))), { wash: '#F07C9A', washOp: 255, ink: null }); mouthArc(.35); break;
    case 'dizzy': for (const s of [-1, 1]) { const sp = []; for (let i = 0; i < 14; i++) { const a = i * .7 + T * 8 * s, r = i * .045 * u; sp.push(P(s * ex + Math.cos(a) * r, ey + Math.sin(a) * r)); } inkLine(sp, sw * .9, c, 'inkfine', .6); } inkLine([P(-.6 * u, .5 * u), P(-.2 * u, .3 * u), P(.2 * u, .55 * u), P(.6 * u, .35 * u)], sw * 1.1, c, 'ink', .4); break;
    case 'question': dotEye(-ex, .32); dotEye(ex, .42); letterGlyph('?', 0, -.2, u, c, 2.1); break;
    case 'excl': dotEye(-ex, .45); dotEye(ex, .45); letterGlyph('!', 0, .35, u, c, 1.5); break;
    case 'cookie': {   // Jumo "says" cookies: a painted cookie on the screen
      paint(ellPts(...P(0, -.55 * u), 1.25 * u, 1.2 * u, 16), { wash: '#D9A45A', washOp: 255, ink: PAL.ink, sw: sw * .5 });
      for (const [a, b] of [[-.5, -.9], [.4, -.7], [-.1, -.2], [.55, .05], [-.6, 0]]) paint(ellPts(...P(a * u, (b - .15) * u), .17 * u, .15 * u, 8), { wash: '#5A3322', ink: null });
      break;
    }
    case 'loading': for (let i = 0; i < 3; i++) { const b = Math.max(0, Math.sin(T * 8 - i * .9)); paint(ellPts(...P((i - 1) * 1.1 * u, (-.5 - b * .4) * u), .32 * u, .32 * u, 10), { wash: c, ink: null }); } break;
    case 'wink': arc(-ex); dotEye(ex); mouthArc(.35); break;
    case 'angry': for (const s of [-1, 1]) { dotEye(s * ex, .38); inkLine([P(s * ex - .5 * u, ey - .85 * u + (s < 0 ? -.2 : .15) * u), P(s * ex + .5 * u, ey - .85 * u + (s < 0 ? .15 : -.2) * u)], sw * 1.1, c, 'ink', 0); } inkLine([P(-.6 * u, .45 * u), P(.6 * u, .45 * u)], sw * 1.2, c, 'ink', 0); break;
    case 'sleep': for (const s of [-1, 1]) inkLine([P(s * ex - .5 * u, ey), P(s * ex + .5 * u, ey)], sw * 1.2, c, 'ink', 0); break;
    case 'scan': { const yy = -2.0 * u + ((T * 1.6) % 1) * 3.0 * u; inkLine([[-2.4 * u, yy], [2.4 * u, yy]], sw * .7, c, 'inkfine', 0); dotEye(-ex, .3); dotEye(ex, .3); break; }
    case 'check': inkLine([P(-1.1 * u, -.5 * u), P(-.3 * u, .3 * u), P(1.2 * u, -1.3 * u)], sw * 2.4, '#8FD694', 'ink', 0); break;
    case 'cross': inkLine([P(-.9 * u, -1.3 * u), P(.9 * u, .3 * u)], sw * 2.2, '#F08A7A', 'ink', 0); inkLine([P(.9 * u, -1.3 * u), P(-.9 * u, .3 * u)], sw * 2.2, '#F08A7A', 'ink', 0); break;
    case 'tree': jumoTreeIcon(u, sw, c); break;
    default: if (blink) { for (const s of [-1, 1]) inkLine([P(s * ex - .4 * u, ey), P(s * ex + .4 * u, ey)], sw * 1.2, c, 'ink', 0); } else { dotEye(-ex); dotEye(ex); } mouthArc(.18);
  }
  pop();
}
// a painted glyph on Jumo's screen ('?' or '!'): strokes, not a font
function letterGlyph(g, cx, cy, u, c, sz) {
  const sw = clamp(u / 22, .3, 1.5);
  if (g === '?') { inkLine([[(cx - .55 * sz) * u, (cy - .7 * sz) * u], [(cx - .2 * sz) * u, (cy - 1.05 * sz) * u], [(cx + .45 * sz) * u, (cy - .85 * sz) * u], [(cx + .4 * sz) * u, (cy - .35 * sz) * u], [cx * u, (cy - .05 * sz) * u], [cx * u, (cy + .25 * sz) * u]], sw * 1.6, c, 'ink', .6); paint(ellPts(cx * u, (cy + .6 * sz) * u, .16 * sz * u, .16 * sz * u, 8), { wash: c, ink: null }); }
  else { inkLine([[cx * u, (cy - 1.3 * sz) * u], [cx * u, (cy - .1 * sz) * u]], sw * 2, c, 'ink', 0); paint(ellPts(cx * u, (cy + .35 * sz) * u, .17 * sz * u, .17 * sz * u, 8), { wash: c, ink: null }); }
}
// the "arbre des futurs" as a little screen icon
function jumoTreeIcon(u, sw, c) {
  const root = [0, 1.0 * u];
  inkLine([root, [0, 0]], sw * 1.2, c, 'inkfine', 0);
  const br = [[-1.6, -1.4], [-.5, -1.7], [.6, -1.6], [1.7, -1.2]];
  for (const [bx, by] of br) inkLine([[0, 0], [bx * .5 * u, by * .5 * u], [bx * u, by * u]], sw * .9, c, 'inkfine', .4);
  for (const [bx, by] of br) paint(ellPts(bx * u, by * u, .2 * u, .2 * u, 8), { wash: PAL.ochre, ink: null });
}
function jumoBadge(u, sw, o) {
  // pinned paper tag hanging on the body; readable when Jumo is big (u ≥ 12), otherwise the corner badge covers it
  push(); translate(2.2 * u, 2.1 * u); rotate(.12 + .05 * Math.sin(T * 2));
  paint(rrPts(-1.5 * u, 0, 3.0 * u, 1.3 * u, .25 * u), { wash: '#FFF1C9', washOp: 255, ink: PAL.ink, sw: sw * .5 });
  inkLine([[0, -.2 * u], [0, .15 * u]], sw * .6, PAL.ink, 'inkfine', 0);
  paint(ellPts(0, -.25 * u, .15 * u, .15 * u, 8), { wash: PAL.red, ink: null });
  pop();
}

// ---------------- Bip & Bop ----------------
// o: who ('bip' | 'bop'), sign (null | 'yes' | 'no'), signK (0..1 raise), read (0..1 book open), eye ('open'|'happy'|'closed'|'wide'),
//    lookX, aL/aR, dy, sq, rot, flip, highfive (0..1: raises the far arm over the head)
function bipbop(x, y, u, o = {}) {
  const who = o.who || 'bip', col = who === 'bip' ? '#4A7FC1' : '#E08A3C', dk = who === 'bip' ? '#335E93' : '#B0662A';
  const id = o.boilKey ?? who, rs = p => boilSeed(`bb ${id} ${p}`), sw = clamp(u / 20, .3, 1.4), V = o.view || 'front', side = V === 'side', back = V === 'back', bw = side ? .55 : 1;
  rs('shadow'); paint(ellPts(x, y + u * .1, 3.6 * u * bw, .6 * u, 14), { wash: PAL.ink, washOp: 40, ink: null });
  push(); translate(x, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .5), 1 - (o.sq || 0));
  // wheel base
  rs('base');
  paint(rrPts(-2.8 * u * bw, -1.5 * u, 5.6 * u * bw, 1.5 * u, .7 * u), { wash: '#6E6878', ink: PAL.ink, sw: sw * .7 });
  for (const sd of side ? [-.8, .8] : [-1.6, 0, 1.6]) paint(ellPts(sd * u, -.35 * u, .45 * u, .45 * u, 10), { wash: '#3A3440', ink: PAL.ink, sw: sw * .5 });
  // body (a book cart / lectern)
  rs('body');
  paint([[-2.4 * u * bw, -1.4 * u], [2.4 * u * bw, -1.4 * u], [2.1 * u * bw, -6.6 * u], [-2.1 * u * bw, -6.6 * u]], { wash: side ? dk : col, washOp: 255, ink: PAL.ink, sw: sw * .9 });
  if (V === 'front') for (const [yy, cs] of [[-2.6, ['#D9A45A', '#6E9F58', '#C8553D', '#7B5CA8']], [-4.3, ['#3BC4D8', '#E8D9A8', '#D99A3D']]]) {   // book spines
    inkLine([[-1.9 * u, yy * u], [1.9 * u, yy * u]], sw * .8, dk, 'ink', 0);
    cs.forEach((c2, i) => paint(rectPts((-1.7 + i * .95) * u, (yy - 1.3) * u, .7 * u, 1.3 * u), { wash: c2, washOp: 255, ink: PAL.ink, sw: sw * .4 }));
  } else if (back) { for (let k = 0; k < 4; k++) inkLine([[-1.3 * u, (-5.6 + k * .9) * u], [1.3 * u, (-5.6 + k * .9) * u]], sw * .7, dk, 'ink', 0); paint(ellPts(0, -2.4 * u, .5 * u, .5 * u, 10), { wash: dk, ink: PAL.ink, sw: sw * .5 }); }
  else { paint(rrPts(-.8 * u, -5.9 * u, 1.6 * u, 4 * u, .3 * u), { wash: col, washOp: 255, ink: PAL.ink, sw: sw * .5 }); }
  // neck + head: a round monitor with one big lens eye and a reading lamp
  rs('head');
  inkLine([[0, -6.6 * u], [0, -7.4 * u]], sw * 2, PAL.ink, 'ink', 0);
  const hy = -9.1 * u, hb = side ? .7 : 1;
  paint(rrPts(-2.2 * u * hb, hy - 1.7 * u, 4.4 * u * hb, 3.4 * u, 1.3 * u), { wash: mixCol(col, PAL.cream, .45), washOp: 255, ink: PAL.ink, sw: sw * .9 });
  const e = o.eye || 'open', lx = (o.lookX || 0) * .5 * u, ly = (o.lookY || 0) * .4 * u, ex = side ? 1.0 * u : 0, esx = side ? .6 : 1;
  const blink = e === 'open' && ((T * .8 + (who === 'bip' ? .3 : 1.9)) % 3.4) < .12;
  if (back) { for (let k = 0; k < 3; k++) inkLine([[-1.2 * u, hy + (k - 1) * .6 * u], [1.2 * u, hy + (k - 1) * .6 * u]], sw * .6, dk, 'inkfine', 0); }
  else if (e === 'happy') inkLine([[ex - .8 * u * esx, hy + .2 * u], [ex, hy - .6 * u], [ex + .8 * u * esx, hy + .2 * u]], sw * 1.8, PAL.ink, 'ink', .5);
  else if (e === 'closed' || blink) inkLine([[ex - .8 * u * esx, hy], [ex + .8 * u * esx, hy]], sw * 1.6, PAL.ink, 'ink', 0);
  else {
    const r = e === 'wide' ? 1.2 : 1.0;
    paint(ellPts(ex, hy, r * u * esx, r * u, 16), { wash: PAL.night, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    paint(ellPts(ex + lx * esx + (side ? .2 * u : 0), hy + ly, .45 * u * esx, .45 * u, 12), { wash: PAL.data, washOp: 255, ink: null });
    paint(ellPts(ex + lx * esx + .25 * u, hy + ly - .25 * u, .14 * u, .14 * u, 8), { wash: PAL.cream, ink: null });
  }
  inkLine([[1.6 * u * hb, hy - 1.6 * u], [2.2 * u * hb, hy - 2.6 * u], [1.4 * u * hb, hy - 3.0 * u]], sw * 1.1, PAL.ink, 'ink', .4);   // lamp arm
  paint([[.8 * u * hb, hy - 3.3 * u], [2.0 * u * hb, hy - 3.3 * u], [1.7 * u * hb, hy - 2.7 * u], [1.1 * u * hb, hy - 2.7 * u]], { wash: PAL.ochre, ink: PAL.ink, sw: sw * .5 });
  // arms: thin, with round grips; the right one may hold a sign ✔ / ✖
  for (const sd of side ? [1] : [-1, 1]) {
    rs('arm' + sd);
    const hold = sd === 1 && o.sign, k = hold ? backOut(o.signK ?? 1) : 0;
    let a = sd < 0 ? (o.aL ?? .35) : (o.aR ?? .35); if (hold) a = lerp(a, 2.6, k); if (sd < 0 && o.highfive) a = lerp(a, 2.9, ease(o.highfive));
    const sx = side ? 0 : sd * 2.3 * u, sy = -5.6 * u, ex2 = sx + sd * Math.sin(a) * 2.6 * u, ey = sy + Math.cos(a) * 2.6 * u;
    inkLine([[sx, sy], [(sx + ex2) / 2 + sd * .2 * u, (sy + ey) / 2], [ex2, ey]], sw * 1.5, PAL.ink, 'ink', .5);
    paint(ellPts(ex2, ey, .45 * u, .45 * u, 10), { wash: dk, ink: PAL.ink, sw: sw * .5 });
    if (hold && k > .05) {
      inkLine([[ex2, ey], [ex2, ey - 2.2 * u]], sw * 1.4, '#8A6246', 'ink', 0);
      const yes = o.sign === 'yes';
      paint(rrPts(ex2 - 1.5 * u, ey - 4.9 * u, 3 * u, 2.8 * u, .4 * u), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .7 });
      if (yes) inkLine([[ex2 - .9 * u, ey - 3.5 * u], [ex2 - .2 * u, ey - 2.8 * u], [ex2 + 1.0 * u, ey - 4.4 * u]], sw * 3, PAL.soil, 'ink', 0);
      else { inkLine([[ex2 - .8 * u, ey - 4.3 * u], [ex2 + .8 * u, ey - 2.7 * u]], sw * 3, PAL.red, 'ink', 0); inkLine([[ex2 + .8 * u, ey - 4.3 * u], [ex2 - .8 * u, ey - 2.7 * u]], sw * 3, PAL.red, 'ink', 0); }
    }
  }
  if (o.read && !back) {   // an open book held in front
    rs('book');
    const k = ease(o.read), bx = side ? 1.6 * u : 0, bk = side ? .45 : 1;
    paint([[bx - 2.2 * u * k * bk, -5.2 * u], [bx, -5.5 * u], [bx, -3.4 * u], [bx - 2.2 * u * k * bk, -3.2 * u]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    paint([[bx + 2.2 * u * k * bk, -5.2 * u], [bx, -5.5 * u], [bx, -3.4 * u], [bx + 2.2 * u * k * bk, -3.2 * u]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) inkLine([[bx + sd * .4 * u * bk, (-4.9 + i * .5) * u], [bx + sd * 1.8 * u * k * bk, (-4.75 + i * .5) * u]], sw * .4, PAL.grey, 'inkfine', 0);
  }
  pop(); rs('after');
}

// ---------------- Maître Arbitre (owl-robot) ----------------
// o: wing (0..1 flap / glide spread), glasses (0..1 push-up gesture), gavel (0..1 strike), eyes ('open'|'closed'|'narrow'|'wide'), lookX, dy, rot, flip, shrug (0..1)
function arbitre(x, y, u, o = {}) {
  const id = o.boilKey ?? 'arbitre', rs = p => boilSeed(`owl ${id} ${p}`), sw = clamp(u / 20, .3, 1.4), V = o.view || 'front', side = V === 'side', back = V === 'back', bw = side ? .78 : 1;
  const body = '#9A8468', dk = '#6F5D48', belly = '#EADBB8', brass = '#C9A04A';
  rs('shadow'); if (!o.noShadow) paint(ellPts(x, y + .1 * u, 3.2 * u, .55 * u, 14), { wash: PAL.ink, washOp: 40, ink: null });
  push(); translate(x, y + (o.dy || 0) * u); if (o.rot) rotate(o.rot); scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .5), 1 - (o.sq || 0));
  const shrug = o.shrug || 0, wing = o.wing || 0;
  // feet
  rs('feet');
  for (const sd of [-1, 1]) for (const k of [-1, 0, 1]) inkLine([[sd * 1.1 * u, -.5 * u], [sd * 1.1 * u + k * .45 * u, .05 * u]], sw * 1.4, brass, 'ink', 0);
  // wings (behind when folded, spread when gliding)
  rs('wings');
  for (const sd of side ? [-1] : [-1, 1]) {
    push(); translate(sd * 2.6 * u * bw + (side ? .6 * u : 0), (-5.8 - shrug * .6) * u); rotate(sd * (-.25 - wing * 1.5 + shrug * .5));
    const L = lerp(3.8, 6.2, wing) * u;
    paint([[0, 0], [sd * .9 * u, L * .35], [sd * .5 * u, L * .8], [sd * .1 * u, L], [-sd * .7 * u, L * .6]], { wash: dk, washOp: 255, ink: PAL.ink, sw: sw * .8, curv: .3 });
    for (let k = 1; k < 4; k++) inkLine([[sd * .2 * u, L * k / 4.3], [sd * .8 * u, L * (k / 4.3 + .12)]], sw * .5, PAL.ink, 'inkfine', 0);
    pop();
  }
  // body egg + belly with rivets
  rs('body');
  paint(ellPts(0, -4.4 * u, 3.0 * u * bw, 4.2 * u, 26), { wash: body, washOp: 255, ink: PAL.ink, sw: sw });
  if (!back) paint(ellPts(side ? 1.0 * u : 0, -3.4 * u, 1.9 * u * (side ? .6 : 1), 2.7 * u, 20), { wash: belly, washOp: 255, ink: PAL.ink, sw: sw * .6 });
  if (!back) for (let k = 0; k < 3; k++) for (const sd of side ? [1] : [-1, 1]) inkLine([[sd * .9 * u + (side ? .6 * u : 0), (-4.6 + k * .9) * u], [(side ? .8 * u : 0), (-4.2 + k * .9) * u], [-sd * .1 * u + (side ? .8 * u : 0), (-4.2 + k * .9) * u]], sw * .5, dk, 'inkfine', .5);
  if (back) for (let k = 0; k < 4; k++) for (const sd of [-1, 1]) inkLine([[sd * 1.4 * u, (-6.4 + k * 1.1) * u], [0, (-5.8 + k * 1.1) * u]], sw * .6, dk, 'inkfine', .5);
  // ear tufts
  for (const sd of [-1, 1]) paint([[sd * 1.3 * u * bw, -7.9 * u], [sd * 2.6 * u * bw, -9.6 * u], [sd * 2.3 * u * bw, -7.4 * u]], { wash: dk, washOp: 255, ink: PAL.ink, sw: sw * .7 });
  inkLine([[0, -8.5 * u], [.15 * u, -9.5 * u]], sw * .9, brass, 'ink', 0); paint(ellPts(.15 * u, -9.6 * u, .22 * u, .22 * u, 8), { wash: PAL.data, ink: PAL.ink, sw: sw * .4 });
  for (const sd of side ? [-1] : [-1, 1]) for (const yy of [-3.2, -4.4, -5.6]) paint(ellPts(sd * 2.55 * u * bw, yy * u, .13 * u, .13 * u, 6), { wash: brass, ink: null });
  if (back) { pop(); rs('after'); return; }
  // face disc + spectacles
  rs('face');
  const gy = (-6.3 - (o.glasses || 0) * .35) * u, e = o.eyes || 'open', lx = (o.lookX || 0) * .3 * u;
  for (const sd of side ? [1] : [-1, 1]) {
    push(); if (side) { translate(.5 * u, 0); scale(.8, 1); }
    paint(ellPts(sd * 1.2 * u, -6.3 * u, 1.35 * u, 1.3 * u, 16), { wash: belly, washOp: 255, ink: null });
    if (e === 'closed' || ((T * .6 + 1.1) % 4.1) < .12) inkLine([[sd * 1.2 * u - .6 * u, -6.2 * u], [sd * 1.2 * u + .6 * u, -6.2 * u]], sw * 1.2, PAL.ink, 'ink', 0);
    else if (e === 'narrow') { paint(ellPts(sd * 1.2 * u + lx, -6.2 * u, .6 * u, .25 * u, 10), { wash: '#F2B52E', ink: PAL.ink, sw: sw * .5 }); paint(ellPts(sd * 1.2 * u + lx, -6.2 * u, .2 * u, .18 * u, 8), { wash: PAL.ink, ink: null }); }
    else { const r = e === 'wide' ? .8 : .62; paint(ellPts(sd * 1.2 * u + lx * .3, -6.25 * u, r * u, r * u, 12), { wash: '#F2B52E', ink: PAL.ink, sw: sw * .5 }); paint(ellPts(sd * 1.2 * u + lx, -6.25 * u, .3 * u, .3 * u, 10), { wash: PAL.ink, ink: null }); paint(ellPts(sd * 1.2 * u + lx + .12 * u, -6.4 * u, .1 * u, .1 * u, 6), { wash: PAL.cream, ink: null }); }
    paint(ellPts(sd * 1.2 * u, gy, 1.1 * u, 1.05 * u, 18), { ink: brass, sw: sw * 1.4 });
    pop();
  }
  if (!side) inkLine([[-.1 * u, gy], [.1 * u, gy]], sw * 1.2, brass, 'ink', 0);
  if (side) paint([[2.0 * u, -5.9 * u], [3.1 * u, -5.3 * u], [2.0 * u, -4.9 * u]], { wash: '#E8A33A', ink: PAL.ink, sw: sw * .5 });
  else paint([[-.35 * u, -5.4 * u], [.35 * u, -5.4 * u], [0, -4.6 * u]], { wash: '#E8A33A', ink: PAL.ink, sw: sw * .5 });   // beak
  if (o.gavel != null) {   // a little judge's gavel in the near wing
    const k = o.gavel, a = lerp(-.9, .5, easeIn(k));
    push(); translate(3.4 * u, -4.6 * u); rotate(a);
    inkLine([[0, 0], [2.4 * u, 0]], sw * 1.6, '#8A6246', 'ink', 0);
    paint(rrPts(2.0 * u, -.75 * u, 1.3 * u, 1.5 * u, .25 * u), { wash: '#8A6246', ink: PAL.ink, sw: sw * .6 });
    pop();
  }
  pop(); rs('after');
}

// ---------------- le Videur « Doute » ----------------
// o: arms ('crossed' | 'finger' | 'point' | 'stop'), finger (0..1 wag phase driver), brow (0..1 raise), lookX, dy, sq, flip
function videur(x, y, u, o = {}) {
  const id = o.boilKey ?? 'videur', rs = p => boilSeed(`vid ${id} ${p}`), sw = clamp(u / 18, .35, 1.6), V = o.view || 'front';
  if (V !== 'front') return videurTurned(x, y, u, o, V, rs, sw);
  const suit = '#3B3350', suitLt = '#544A6E', skin = '#C98F6B';
  rs('shadow'); paint(ellPts(x, y + .1 * u, 5.2 * u, .7 * u, 16), { wash: PAL.ink, washOp: 40, ink: null });
  push(); translate(x, y + (o.dy || 0) * u); scale((o.flip ? -1 : 1) * (1 + (o.sq || 0) * .5), 1 - (o.sq || 0));
  rs('legs');
  for (const sd of [-1, 1]) { paint(rectPts(sd * 1.6 * u - 1.1 * u, -5.2 * u, 2.2 * u, 4.6 * u), { wash: suit, washOp: 255, ink: PAL.ink, sw: sw * .8 }); paint(rrPts(sd * 1.6 * u - 1.4 * u, -.9 * u, 2.8 * u, .95 * u, .4 * u), { wash: '#1F1A24', ink: PAL.ink, sw: sw * .6 }); }
  rs('torso');
  const torso = [[-4.4 * u, -13.2 * u], [4.4 * u, -13.2 * u], [4.9 * u, -11.2 * u], [3.4 * u, -5.0 * u], [-3.4 * u, -5.0 * u], [-4.9 * u, -11.2 * u]];
  paint(torso, { wash: suit, washOp: 255, ink: PAL.ink, sw: sw, curv: .2 });
  paint([[-1.2 * u, -13.2 * u], [1.2 * u, -13.2 * u], [0, -10.2 * u]], { wash: PAL.cream, ink: PAL.ink, sw: sw * .5 });   // shirt V
  inkLine([[0, -12.6 * u], [0, -10.6 * u]], sw * 1.8, '#1F1A24', 'ink', 0);   // tie
  // badge "DOUTE" (the one lettered word: his name tag)
  paint(rrPts(1.4 * u, -11.9 * u, 2.6 * u, 1.1 * u, .2 * u), { wash: '#F1D98A', ink: PAL.ink, sw: sw * .5 });
  // head: small, bald, sunglasses, earpiece
  rs('head');
  paint(rectPts(-.9 * u, -14.2 * u, 1.8 * u, 1.2 * u), { wash: skin, ink: null });
  paint(ellPts(0, -15.4 * u, 1.9 * u, 2.0 * u, 20), { wash: skin, washOp: 255, ink: PAL.ink, sw: sw * .8 });
  const br = (o.brow || 0);
  paint([[-1.7 * u, -15.9 * u], [-.2 * u, -15.9 * u], [-.35 * u, -15.1 * u], [-1.55 * u, -15.2 * u]], { wash: '#221C2A', ink: PAL.ink, sw: sw * .5 });
  paint([[.2 * u, -15.9 * u], [1.7 * u, -15.9 * u], [1.55 * u, -15.2 * u], [.35 * u, -15.1 * u]], { wash: '#221C2A', ink: PAL.ink, sw: sw * .5 });
  inkLine([[-1.6 * u, -16.3 * u], [-.4 * u, -16.25 * u]], sw * 1.6, '#3A2A22', 'ink', 0);
  inkLine([[.4 * u, (-16.25 - br * .7) * u], [1.6 * u, (-16.4 - br * .9) * u]], sw * 1.6, '#3A2A22', 'ink', 0);   // the one sceptical eyebrow
  inkLine([[-.6 * u, -14.3 * u], [.6 * u, -14.35 * u]], sw * 1.1, PAL.ink, 'ink', 0);
  inkLine([[-1.9 * u, -15.3 * u], [-2.3 * u, -14.4 * u], [-2.0 * u, -13.6 * u]], sw * .6, '#2B2B2B', 'inkfine', .4);   // earpiece cord
  // arms
  rs('arms');
  const arms = o.arms || 'crossed';
  if (arms === 'crossed') {
    paint(rrPts(-4.2 * u, -10.4 * u, 8.4 * u, 2.2 * u, 1.0 * u), { wash: suitLt, washOp: 255, ink: PAL.ink, sw: sw * .9 });
    inkLine([[-.4 * u, -10.3 * u], [.3 * u, -8.3 * u]], sw * .8, PAL.ink, 'ink', 0);
    for (const sd of [-1, 1]) paint(ellPts(sd * 3.0 * u, -9.2 * u, .9 * u, .85 * u, 12), { wash: skin, ink: PAL.ink, sw: sw * .6 });
  } else {
    for (const sd of [-1, 1]) {
      const act = sd === 1 && arms !== 'crossed';
      const sx = sd * 4.4 * u, sy = -12.2 * u;
      let ex, ey;
      if (act && arms === 'finger') { ex = sx + 1.2 * u; ey = sy - 3.2 * u; }
      else if (act && arms === 'point') { ex = sx + 4.2 * u; ey = sy - .8 * u; }
      else if (act && arms === 'stop') { ex = sx + 3.6 * u; ey = sy - 1.8 * u; }
      else { ex = sx + sd * .6 * u; ey = sy + 5.2 * u; }
      paint(ribbon([[sx, sy], [(sx + ex) / 2 + sd * .5 * u, (sy + ey) / 2], [ex, ey]], 2.0 * u, 1.6 * u), { wash: suitLt, washOp: 255, ink: PAL.ink, sw: sw * .9 });
      paint(ellPts(ex, ey, 1.0 * u, .95 * u, 12), { wash: skin, ink: PAL.ink, sw: sw * .6 });
      if (act && arms === 'finger') { const wag = Math.sin((o.finger ?? T) * TAU * 3) * .35; push(); translate(ex, ey - .6 * u); rotate(wag); paint(ribbon([[0, 0], [0, -1.8 * u]], .55 * u, .45 * u), { wash: skin, ink: PAL.ink, sw: sw * .5 }); pop(); }
    }
  }
  pop();
  letter('DOUTE', x + (o.flip ? -2.7 : 2.7) * u, y + (o.dy || 0) * u - 11.35 * u, .75 * u, PAL.ink, { weight: 700 });
  rs('after');
}

function videurTurned(x, y, u, o, V, rs, sw) {
  const suit = '#3B3350', suitLt = '#544A6E', skin = '#C98F6B', side = V === 'side', bw = side ? .62 : 1;
  rs('shadow'); paint(ellPts(x, y + .1 * u, 5.2 * u * bw, .7 * u, 16), { wash: PAL.ink, washOp: 40, ink: null });
  push(); translate(x, y + (o.dy || 0) * u); scale(o.flip ? -1 : 1, 1);
  rs('legs');
  for (const sd of side ? [-.5, .5] : [-1, 1]) { paint(rectPts(sd * 1.6 * u - 1.1 * u, -5.2 * u, 2.2 * u, 4.6 * u), { wash: suit, washOp: 255, ink: PAL.ink, sw: sw * .8 }); paint(rrPts(sd * 1.6 * u - (side ? .9 : 1.4) * u, -.9 * u, (side ? 3.2 : 2.8) * u, .95 * u, .4 * u), { wash: '#1F1A24', ink: PAL.ink, sw: sw * .6 }); }
  rs('torso');
  paint([[-4.4 * u * bw, -13.2 * u], [4.4 * u * bw, -13.2 * u], [4.9 * u * bw, -11.2 * u], [3.4 * u * bw, -5.0 * u], [-3.4 * u * bw, -5.0 * u], [-4.9 * u * bw, -11.2 * u]], { wash: suit, washOp: 255, ink: PAL.ink, sw, curv: .2 });
  if (!side) inkLine([[0, -12.8 * u], [0, -5.2 * u]], sw * .6, '#2A2438', 'inkfine', 0);
  rs('head');
  paint(rectPts(-.9 * u, -14.2 * u, 1.8 * u, 1.2 * u), { wash: skin, ink: null });
  paint(ellPts(side ? .3 * u : 0, -15.4 * u, 1.9 * u, 2.0 * u, 20), { wash: skin, washOp: 255, ink: PAL.ink, sw: sw * .8 });
  if (side) {
    paint([[.9 * u, -15.9 * u], [2.2 * u, -15.9 * u], [2.1 * u, -15.15 * u], [1.0 * u, -15.2 * u]], { wash: '#221C2A', ink: PAL.ink, sw: sw * .5 });
    inkLine([[.9 * u, -15.6 * u], [-1.2 * u, -15.5 * u]], sw * .8, '#221C2A', 'ink', 0);
    paint([[2.1 * u, -15.0 * u], [2.6 * u, -14.6 * u], [2.05 * u, -14.4 * u]], { wash: skin, ink: PAL.ink, sw: sw * .5 });
    inkLine([[1.4 * u, (-16.3 - (o.brow || 0) * .8) * u], [2.2 * u, (-16.35 - (o.brow || 0)) * u]], sw * 1.6, '#3A2A22', 'ink', 0);
  } else inkLine([[-1.9 * u, -15.3 * u], [-2.3 * u, -14.4 * u], [-2.0 * u, -13.6 * u]], sw * .6, '#2B2B2B', 'inkfine', .4);
  rs('arms');
  const ex = side ? 1.2 * u : 4.9 * u;
  for (const sd of side ? [1] : [-1, 1]) paint(ribbon([[side ? 0 : sd * 4.4 * u, -12.2 * u], [side ? .8 * u : sd * 4.9 * u, -9.5 * u], [side ? ex : sd * 5 * u, -7.2 * u]], 2.0 * u, 1.6 * u), { wash: suitLt, washOp: 255, ink: PAL.ink, sw: sw * .9 });
  for (const sd of side ? [1] : [-1, 1]) paint(ellPts(side ? ex : sd * 5 * u, -6.8 * u, 1.0 * u, .95 * u, 12), { wash: skin, ink: PAL.ink, sw: sw * .6 });
  pop(); rs('after');
}

// ---------------- Tacti (irrigation robot) ----------------
// o: valve (angle of the wheel), open (0..1 spray), jitter (0..1 hyperactivity), eyes ('wide'|'spin'|'dizzy'), dy, flip, mouth ('shout'|'grin'|'o')
function tacti(x, y, u, o = {}) {
  const id = o.boilKey ?? 'tacti', rs = p => boilSeed(`tac ${id} ${p}`), sw = clamp(u / 18, .3, 1.4), V = o.view || 'front', side = V === 'side', back = V === 'back', bw = side ? .7 : 1;
  const body = '#EFC74A', dk = '#C79A28', wheel = '#2F5FA8';
  const jt = o.jitter ?? 1, jx = Math.sin(T * 61) * .18 * u * jt, jy = Math.abs(Math.sin(T * 47)) * -.25 * u * jt;
  rs('shadow'); paint(ellPts(x, y + .1 * u, 3.0 * u, .5 * u, 14), { wash: PAL.ink, washOp: 40, ink: null });
  push(); translate(x + jx, y + jy + (o.dy || 0) * u); scale(o.flip ? -1 : 1, 1);
  // hose tail with a sprinkler
  rs('hose');
  const hp = [[1.8 * u, -1.5 * u], [4.2 * u, -1.0 * u + Math.sin(T * 7) * .4 * u], [6.0 * u, -2.6 * u]];
  paint(ribbon(hp, .8 * u, .7 * u), { wash: '#6E9F58', ink: PAL.ink, sw: sw * .6 });
  paint(ellPts(6.1 * u, -2.7 * u, .6 * u, .5 * u, 10), { wash: '#9C98A6', ink: PAL.ink, sw: sw * .5 });
  const op = o.open ?? 0;
  if (op > .05) for (let k = 0; k < 7; k++) { const a = -1.2 + k * .28, ph = frac(T * 3 + k * .37), r = (1 + ph * 3.2) * u * op; paint(ellPts(6.1 * u + Math.cos(a) * r, -2.7 * u + Math.sin(a) * r + ph * ph * 2 * u, .22 * u, .3 * u, 8), { wash: PAL.data, washOp: 200 * (1 - ph), ink: null }); }
  // legs: little stubs
  rs('legs');
  for (const sd of [-1, 1]) paint(rrPts(sd * 1.2 * u - .5 * u, -1.2 * u, 1.0 * u, 1.2 * u, .3 * u), { wash: dk, ink: PAL.ink, sw: sw * .6 });
  // body: a squat pipe-fitting
  rs('body');
  paint(rrPts(-2.4 * u * bw, -5.6 * u, 4.8 * u * bw, 4.6 * u, 1.1 * u), { wash: body, washOp: 255, ink: PAL.ink, sw: sw });
  paint(rrPts(-2.6 * u * bw, -3.6 * u, 5.2 * u * bw, .8 * u, .3 * u), { wash: dk, washOp: 255, ink: PAL.ink, sw: sw * .6 });
  // face
  rs('face');
  if (back) { for (let k = 0; k < 3; k++) inkLine([[-1.2 * u, (-5 + k * .45) * u], [1.2 * u, (-5 + k * .45) * u]], sw * .6, dk, 'inkfine', 0); }
  else {
  push(); if (side) { translate(.9 * u, 0); scale(.6, 1); }
  const e = o.eyes || 'wide', ex = .95 * u, ey = -4.5 * u, shake = Math.sin(T * 40) * .08 * u * jt;
  for (const sd of [-1, 1]) {
    paint(ellPts(sd * ex, ey, .8 * u, .85 * u, 14), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: sw * .6 });
    if (e === 'dizzy') { const sp = []; for (let i = 0; i < 12; i++) { const a = i * .8 + T * 9 * sd, r = i * .055 * u; sp.push([sd * ex + Math.cos(a) * r, ey + Math.sin(a) * r]); } inkLine(sp, sw * .7, PAL.ink, 'inkfine', .6); }
    else paint(ellPts(sd * ex + shake + sd * .15 * u, ey + shake, .3 * u, .3 * u, 10), { wash: PAL.ink, ink: null });
  }
  const m = o.mouth || 'shout';
  if (m === 'shout') paint(ellPts(0, -2.3 * u, .75 * u, .55 * u * (1 + .4 * Math.abs(Math.sin(T * 14))), 12), { wash: '#5A2230', ink: PAL.ink, sw: sw * .5 });
  else if (m === 'o') paint(ellPts(0, -2.3 * u, .35 * u, .4 * u, 10), { wash: '#5A2230', ink: PAL.ink, sw: sw * .5 });
  else inkLine([[-.8 * u, -2.5 * u], [0, -2.1 * u], [.8 * u, -2.5 * u]], sw * .9, PAL.ink, 'ink', .5);
  pop(); }
  // the valve wheel on its head
  rs('wheel');
  inkLine([[0, -5.6 * u], [0, -6.5 * u]], sw * 2.2, PAL.ink, 'ink', 0);
  push(); translate(0, -7.3 * u); scale(1, .45); rotate(o.valve ?? T * 12);
  paint(ellPts(0, 0, 2.1 * u, 2.1 * u, 20), { ink: wheel, sw: sw * 2.6 });
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; inkLine([[0, 0], [Math.cos(a) * 2 * u, Math.sin(a) * 2 * u]], sw * 1.6, wheel, 'ink', 0); }
  paint(ellPts(0, 0, .45 * u, .45 * u, 10), { wash: wheel, ink: PAL.ink, sw: sw * .5 });
  pop();
  pop(); rs('after');
}
