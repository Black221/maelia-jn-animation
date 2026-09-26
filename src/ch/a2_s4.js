// scène 2.4 — Tacti contre Jumo (V2 § 4, acte II).
// Lines: L0 (Tacti) « Maintenant ! | Maintenant ! Maintenant ! »
//        L1 « Beaucoup de jumeaux agricoles sont comme Tacti : | ils pilotent en temps réel, | pour aujourd'hui. »
//        L2 « Awa veut autre chose : | un jumeau stratégique, | qui réévalue à chaque saison les chemins encore possibles. »
// One split-screen shot. It opens on 2.3's last frame (Jumo in the night, right) and Tacti's sunny panel SLAMS in
// from the left. Left: Tacti opens / shuts the valve on each « Maintenant ! » and then never stops (spray on / off),
// a clock races (« en temps réel »). Right: Jumo, calm, watches the calendar of the seasons scroll by; the tree of
// futures grows above him on « un jumeau stratégique ». Awa, in the middle, glances at Tacti (L1), then turns to
// Jumo and smiles (L2). Texts: « Tactique : agir maintenant » · « Stratégique : réévaluer les futurs possibles ».
// Exit: the divider slides away left, Awa walks into the night, the tree grows and flares (→ 2.5 opens on it).
(() => {
  const K = window.A2K;
  K.TREE = { seed: 4, depth: 3 };
  const J4 = K.J24, TREE0 = { x: 1110, y: 300, s: .62 };
  K.TREE25 = { x: 300, y: 600, s: 1.25 };                  // where 2.5's tree is (screen, first frame)
  const DIV = 960, EDGE = { sx: 380, sy: 480, s: 1.25 };   // the left panel: a crop of 2.1's field edge
  const TAC = [440, 930], AWA_X = 900, GROUND = 1000;

  // season pictograms on little calendar cards
  function seasonCard(x, y, kind, a = 1) {
    boilSeed('season' + kind + Math.round(x / 400));
    paint(rrPts(x - 58, y - 58, 116, 116, 12), { wash: '#F4EAD8', washOp: 235 * a, ink: PAL.ink, sw: .7 });
    paint(rectPts(x - 58, y - 58, 116, 20), { wash: ['#E27A92', PAL.sun, '#D9773D', '#8FC3D8'][kind], washOp: 235 * a, ink: null });
    for (const sx of [-30, 30]) paint(ellPts(x + sx, y - 58, 5, 5, 8), { wash: PAL.ink, washOp: 200 * a, ink: null });
    const cy = y + 10;
    if (kind === 0) { for (let i = 0; i < 5; i++) { const an = i / 5 * TAU - Math.PI / 2; paint(ellPts(x + Math.cos(an) * 15, cy + Math.sin(an) * 15, 12, 12, 10), { wash: '#F2A7B8', washOp: 255 * a, ink: null }); } paint(ellPts(x, cy, 8, 8, 10), { wash: PAL.sun, washOp: 255 * a, ink: null }); }
    else if (kind === 1) { for (let i = 0; i < 8; i++) { const an = i / 8 * TAU; inkLine([[x + Math.cos(an) * 20, cy + Math.sin(an) * 20], [x + Math.cos(an) * 30, cy + Math.sin(an) * 30]], 1.6, '#E0A43A', 'ink', 0); } paint(ellPts(x, cy, 15, 15, 12), { wash: PAL.sun, washOp: 255 * a, ink: PAL.ink, sw: .5 }); }
    else if (kind === 2) { paint([[x, cy + 28], [x - 26, cy], [x - 12, cy - 26], [x + 18, cy - 24], [x + 24, cy + 4]], { wash: '#D9773D', washOp: 255 * a, ink: PAL.ink, sw: .6, curv: .5 }); inkLine([[x, cy + 30], [x + 2, cy], [x + 10, cy - 18]], .9, '#8A3A1A', 'inkfine', .4); }
    else { for (let i = 0; i < 3; i++) { const an = i / 3 * Math.PI; inkLine([[x + Math.cos(an) * 26, cy + Math.sin(an) * 26], [x - Math.cos(an) * 26, cy - Math.sin(an) * 26]], 2, '#5E9CBF', 'ink', 0); } paint(ellPts(x, cy, 6, 6, 8), { wash: '#DDEFF6', washOp: 255 * a, ink: null }); }
  }
  function clock(x, y, r, t, k) {
    const p = backOut(k); if (p < .02) return;
    boilSeed('clock');
    paint(ellPts(x, y, r * p, r * p, 22), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[x + Math.cos(a) * r * .78 * p, y + Math.sin(a) * r * .78 * p], [x + Math.cos(a) * r * .9 * p, y + Math.sin(a) * r * .9 * p]], .8, PAL.ink, 'inkfine', 0); }
    const a1 = t * 11 - Math.PI / 2, a2 = t * 1.1 - Math.PI / 2;
    inkLine([[x, y], [x + Math.cos(a2) * r * .5 * p, y + Math.sin(a2) * r * .5 * p]], 2.2, PAL.ink, 'ink', 0);
    inkLine([[x, y], [x + Math.cos(a1) * r * .8 * p, y + Math.sin(a1) * r * .8 * p]], 1.4, PAL.red, 'ink', 0);
    paint(ellPts(x, y, 5, 5, 8), { wash: PAL.red, washOp: 255, ink: null });
    for (const sd of [-1, 1]) paint(ellPts(x + sd * r * .6 * p, y - r * .95 * p, r * .22 * p, r * .16 * p, 10), { wash: '#C9A04A', washOp: 255, ink: PAL.ink, sw: .6 });   // alarm bells
  }
  // a row of lettuces the sprinkler waters
  function crops(ox, t) { boilSeed('lettuce'); for (let i = 0; i < 4; i++) { const x = ox + 640 + i * 70, y = 930 + (i % 2) * 8; paint(ellPts(x, y - 14, 26, 16, 12), { wash: '#7FB35E', washOp: 255, ink: PAL.ink, sw: .5 }); paint(ellPts(x - 4, y - 20, 13, 8, 10), { wash: '#A6CF7E', washOp: 255, ink: null }); } }

  function split(t, lt, dur, S, st) {
    const L = i => S.cue(i), E = i => S.cueEnd(i);
    const slam = seg(st, .0, .28), exit0 = S.dur - 1.5, strat = L(2) + 1.7;
    const shots = [L(0) + .02, L(0) + .72, L(0) + 1.2];   // the three « Maintenant ! »
    const divK = ease(seg(st, exit0, exit0 + .9));          // the divider slides off to the left on the exit
    const div = lerp(DIV, -60, divK);
    const panelX = -DIV * (1 - backOut(slam));             // slide-in of the left panel
    // ---------- right: the night (2.3's backdrop, now framed from above) ----------
    const [shx, shy] = st > .28 && st < .55 ? shakeXY(st, 8 * (1 - seg(st, .28, .55))) : [0, 0];
    camBegin(W / 2 + shx, H / 2 + shy, 1 + .015 * ease(seg(st, 0, exit0)));
    drawPlate('night', K.NIGHT24[0], K.NIGHT24[1]);
    boilSeed('nightground'); paint([[-40, 950], [700, 938], [1400, 952], [1960, 940], [1960, 1120], [-40, 1120]], { wash: '#243F5E', washOp: 255, ink: null }); inkLine([[-40, 950], [700, 938], [1400, 952], [1960, 940]], .8, '#3E6A8E', 'inkfine', .5);
    // calendar of the seasons scrolling by (right half)
    const cal = st * 42;
    for (let i = -1; i < 8; i++) { const x = 2020 - ((cal + i * 150) % 1200); if (x < 1010 || x > 1960) continue; const a = clamp((x - 1010) / 80) * clamp((1960 - x) / 80) * (1 - divK) * ease(seg(st, .5 + (x - 1000) / 2000, 1.3 + (x - 1000) / 2000)); if (a < .03) continue; seasonCard(x, 850 + 60 * (1 - ease(seg(st, .5, 1.5))), ((i % 4) + 4) % 4, a); }
    boilSeed('calrail'); if (divK < .9) inkLine([[1000, 780], [1920, 780]], 1.2, '#E9DDC4', 'ink', 0);
    // the tree of futures grows above Jumo on « un jumeau stratégique »; on the exit it grows to 2.5's size
    const grow = ease(seg(st, L(2) + 1.6, L(2) + 4.6));
    const tx = lerp(TREE0.x, K.TREE25.x, ease(divK)), ty = lerp(TREE0.y, K.TREE25.y, ease(divK)), ts = lerp(TREE0.s, K.TREE25.s, ease(divK));
    if (grow > 0) {
      const B = treeBranches(tx, ty, ts, K.TREE.seed, K.TREE.depth);
      futureTree(tx, ty, ts, st, { branches: B, grow, depth: K.TREE.depth, state: () => ({ a: 1, noGlow: true }) });
      for (const b of B) if (b.depth >= 2 && clamp(grow * 4 - b.depth) >= 1) glow(b.tip[0], b.tip[1], 26 * ts * 2, PAL.data, .35);
    }
    // Jumo: calm, bobbing slowly, watching the calendar; his screen shows the tree once it grows
    const jy = J4.y + 90 * ease(seg(st, .3, 2.5)) + Math.sin(st * 1.6) * 7;
    const jf = st < L(2) + 1.6 ? (st < 1.8 ? 'wide' : 'neutral') : 'tree';
    jumo(J4.x + 60 * ease(divK), jy - 40 * divK, J4.u, { stage: 2, face: jf, lookX: -.2, lookY: st < L(2) ? .6 : -.4, prop: 'spin', spin: st * 7, rot: .04 * Math.sin(st * 1.1), beamIn: .35, beamOut: .3 + .5 * grow, boilKey: 'jumo' });
    camEnd();
    // ---------- left: Tacti's sunny panel (slams in, then slides away on the exit) ----------
    if (div > 0) {
      const pw = Math.min(DIV, div) , ox = panelX + (div - DIV);
      drawPlatePart('a2s1_edge', EDGE.sx, EDGE.sy, DIV / EDGE.s, H / EDGE.s, ox, 0, EDGE.s);
      push(); translate(ox, 0);
      // Tacti: a valve slam on each « Maintenant ! », then open / shut / open… all the time
      let mouth = 'grin', jit = .6;
      const TG = shots.slice(); for (let k = 0; shots[2] + .35 + k / 2.6 < S.dur; k++) TG.push(shots[2] + .35 + k / 2.6);
      let n = 0; while (n < TG.length && st >= TG[n]) n++;
      const open = n ? lerp((n - 1) % 2, n % 2, ease(seg(st, TG[n - 1], TG[n - 1] + .08))) : 0, valve = open * Math.PI * .9;
      if (st > shots[0] - .2 && st < E(0) + .1) { mouth = 'shout'; jit = 1; }
      const hop = shots.reduce((a, ts) => a + jump(st, ts - .02, ts + .22, .6).dy, 0);
      crops(0, st);
      tacti(TAC[0], TAC[1], 30, { valve, open, jitter: jit, mouth, eyes: 'wide', dy: hop, boilKey: 'tacti' });
      // temps réel: the clock races over his head
      clock(250, 470, 70, st, seg(st, L(1) + 2.6, L(1) + 3.0));
      pop();
      // the panel's torn edge (the divider): a cream brush line with ink
      boilSeed('divider');
      const dx = ox + DIV; paint([[dx - 10, -40], [dx + 8, 300], [dx - 6, 700], [dx + 10, 1120], [dx + 24, 1120], [dx + 12, 700], [dx + 24, 300], [dx + 10, -40]], { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .9, curv: .4 });
    }
    // ---------- Awa in the middle ----------
    const walk = stroll(st, exit0 + .2, S.dur, AWA_X, AWA_X + 460, 26 * 1.7);
    const onPanel = panelX + (div - DIV);   // she rides in on Tacti's panel
    const tl = L(2) - .1;                                   // she turns from Tacti to Jumo
    const view = st < tl ? 'side' : st < tl + .12 ? 'q' : st < tl + .24 ? 'front' : st < tl + .36 ? 'q' : 'side';
    const flip = st < tl + .12;
    const A = actP(st, [[0, 'surprise', { lookX: .5 }], [L(1) + .3, 'soupir'], [L(1) + 2.6, 'doute'], [tl + .3, 'joie', { lookY: -.3 }], [L(2) + 3.4, 'fiere', { lookY: -.4 }]]);
    if (walk.moving) A.walk = walk.walk;
    awa(walk.x + (st < exit0 ? onPanel : 0), GROUND, 26, { ...A, view, flip, cap: 'terrain' });
    // ---------- the two texts, one per side ----------
    const tk = seg(st, L(1) + .3, L(1) + .7) * (1 - divK), sk = seg(st, strat, strat + .4);
    if (div > 200) panel(panelX + (div - DIV) + 470, 120, 640, 76, 'Tactique : agir maintenant', { k: tk, size: 38, key: 'tact', col: '#FFF1C9', ink: '#8A3A1A' });
    panel(1440, 120 - 20 * divK, 860, 76, 'Stratégique : réévaluer les futurs possibles', { k: sk * (1 - seg(st, S.dur - .6, S.dur - .2)), size: 36, key: 'strat', col: '#E4F4F6', ink: PAL.night });
    // exit: the tree flares (a flash of its light) — 2.5 opens out of it
    const fl = seg(st, S.dur - .45, S.dur);
    if (fl > 0) { glow(K.TREE25.x, K.TREE25.y, 900 * fl, PAL.cream, .8 * fl); flash(.75 * ease(fl), '#EAF6F8'); }
  }

  scene('2.4', S => [[0, split]],
    (st, S) => ({}),
    S => {
      const L = i => S.cue(i), shots = [L(0) + .02, L(0) + .72, L(0) + 1.2], exit0 = S.dur - 1.5;
      const out = [[.02, 'whoosh', .12, -.6], [.28, 'thud', .3, -.5], [L(1) + 2.6, 'tick', .06, -.6], [L(1) + 2.9, 'tick', .06, -.6],
        [L(2) - .1, 'rustle', .05], [L(2) + 1.6, 'chime', .08, .5], [L(2) + 2.2, 'sparkle', .05, .5], [exit0, 'slideDown', .08], [S.dur - .4, 'sparkle', .08]];
      shots.forEach(ts => out.push([ts, 'clic', .14, -.5], [ts + .03, 'squeak', .07, -.5]));
      for (let k = 0; shots[2] + .35 + k / 2.6 < S.dur; k++) out.push([shots[2] + .35 + k / 2.6, k % 2 ? 'tick' : 'clic', .04, -.5]);
      for (let k = 0; k < 4; k++) out.push([exit0 + .3 + k * .35, 'step', .06]);
      return out;
    });
})();
