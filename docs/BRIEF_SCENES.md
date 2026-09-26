# Brief pour les auteurs de scènes (sous-agents)

Tu écris des scènes du film « Awa et Jumo : la quête du jumeau stratégique », une animation aquarelle en p5.js +
p5.brush, déjà outillée. Répertoire : /home/user/maelia-jn-animation.

## À lire d'abord (dans cet ordre)
1. `ANIMATION_GUIDE.md` (règles, coûts, fidélité) — obligatoire.
2. `docs/animation_motion_design_v2.md` : **la source de vérité** (action, texte à l'écran, gags, transitions) de tes scènes.
3. `STORYBOARD.md` : le découpage en plans.
4. `src/ch/a1_s1.js` : **scène modèle** déjà terminée (structure, calage sur les répliques, caméra, transitions, bruitages).
5. `src/cast.js` (personnages : lis l'en-tête des proportions et les options), `src/props.js`, `src/decor.js`, `src/core.js` (API).

## Temps
Les répliques de chaque scène sont dans `src/timing.js` (généré, ne pas modifier). Pour les afficher :
`node -e 'const fs=require("fs"),vm=require("vm");const c={};vm.createContext(c);vm.runInContext(fs.readFileSync("src/timing.js","utf8")+";this.T=TIMING",c);for(const s of c.T.scenes)if(process.argv[1].split(",").includes(s.id)){console.log(s.id,s.dur);s.cues.forEach((q,i)=>console.log(" L"+i,q.t.toFixed(2),q.end.toFixed(2),q.qui,q.texte))}' 1.2,1.3`
Cale chaque action sur `S.cue(i)` / `S.cueEnd(i)`, jamais sur des secondes absolues du film. La durée de scène est `S.dur`.

## Ce que tu peux modifier
- **Uniquement** tes fichiers `src/ch/aN_sM.js` (ils existent déjà, souvent vides). Chaque scène dans une IIFE, avec
  `scene(id, S => [[t0, shot], ...], track?, sfx?)` — voir la fin de `a1_s1.js`.
- Tu peux définir de **nouvelles plates** (décors, sprites) dans tes fichiers, avec une clé préfixée par ta scène
  (ex. `a1s2_facade`), puis les peindre : `node render.mjs --plates --only=a1s2_facade` (un verrou gère les passes
  concurrentes ; une plate 2400×1350 prend 1–3 min).
- **Ne modifie aucun fichier partagé** (core, cast, props, decor, timeline, sheets, studio.html, render.mjs, narration,
  audio). S'il te manque un utilitaire, écris-le en privé dans ta scène. Si tu trouves un vrai bug partagé, signale-le
  dans ton rapport. **Ne fais pas de commit git.**

## Vérifier (obligatoire, regarde les images avec l'outil Read)
Toujours `--no-plates` pour les rendus de contrôle (sinon le pass des plates se lance) :
```
node render.mjs --no-plates --scene=1.3 --sheet=0.5,3,6,9,12,15,18,21 --cols=4 --w=480 --out=out/check/s13.jpg
node render.mjs --no-plates --scene=1.3 --strip=4.0:4.6 --out=out/check/s13_strip.jpg
node render.mjs --no-plates --scene=1.3 --stills=6 --out=out/check
```
Contrôle : l'évènement de chaque plan se lit ; timing (une lecture à la fois) ; aucun pop ; bande des sous-titres
(y écran > 960) libre ; chiffres exacts ; accents ; pas de logo ; transitions d'entrée et de sortie ; ms/frame
(le rendu imprime les ms par image : vise ≤ 2500 ms, ne jamais utiliser `fill` aquarelle dans un plan).

## Continuité (tout le film)
- Awa : `awa(x, y, s, o)`, casquette `cap: 'labo'` pendant l'acte I ; en fin de 1.6 elle la retourne (`capTurn` 0→1,
  `cap: 'labo'` → affiche le côté terrain quand capTurn > .5) ; actes II et III : `cap: 'terrain'`.
- Jumo : acte I et 2.1–2.2 `stage: 0` ; 2.3 : 0 → 1 → 2 (antK pour la pousse) ; ensuite `stage: 2` ; acte III :
  `badge: true` (le badge « provisoire » du coin est automatique pendant l'acte III, garde libre le coin haut droit).
- Tailles : Awa s ≈ 20–24 en plan moyen, Jumo u ≈ 10–14.
- Transitions entre actes : volet au pinceau automatique (début de 2.1, début de 3.1). Entre scènes : les transitions
  motivées de la V2, chaque scène peint sa sortie et la suivante son entrée (même forme de part et d'autre).
- Citations d'études : `cite(['Patil et al., 2025 : modèle, ombre, jumeau', ...], k)` quand la V2 les demande.
- Chiffres : exactement ceux de la V2, via `fmtFR(n)` (espace fine) et `countTo()` pour les compteurs.
- Bruitages : liste `sfx(S)` (voir `a1_s1.js` et les types dans `audio/score.mjs` → FX) : bip, bip2, bipq, bipsad,
  pop, bloop, boing, thud, whoosh, tick, stamp, clic, confetti, chime, sparkle, buzzer, glitch, rustle, slideUp,
  slideDown, knock, squeak, step, ding, scratch, rotor. Une action visible = un son.

## Rapport final (ta réponse)
Pour chaque scène : plans réalisés, écarts par rapport à la V2 (et pourquoi), plates ajoutées, ms/frame mesurés,
problèmes restants, bugs partagés trouvés. Sois bref et exact.
