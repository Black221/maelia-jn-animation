# Guide d'animation — « Awa et Jumo : la quête du jumeau stratégique »

À lire avant d'écrire une scène. Le **contenu** (actions, narration, texte à l'écran, chiffres) vient de
[`docs/animation_motion_design_v2.md`](docs/animation_motion_design_v2.md) ; le découpage en plans est dans
[`STORYBOARD.md`](STORYBOARD.md). Ce guide dit **comment** on peint. Il reprend les règles de
[ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) (MIT) et de
[PDoomVideo](https://github.com/JohnHeibel/PDoomVideo), adaptées à ce film.

## 1. Fidélité (non négociable)

- **Chiffres au caractère près**, et seulement ceux-ci : 7 668 · 3 147 · 1 852 · 332 · 147 · 5 478 · 2 190 · 2 690 ·
  4 978 · 750 · 4 228 · 686 · 241 · 445 · 139 · κ = 0,899 · κ = 0,897 · 1 249 · 149 · 24 · 16 · 5 puis 9 · 260 contre 33.
  Espace fine insécable des milliers : écrire `7 668` (U+202F) ou une espace normale ; virgule décimale (`0,899`).
- Le κ est un **accord** entre évaluateurs, jamais un « taux de réussite ».
- Les compteurs animés **s'arrêtent net sur la valeur exacte** (fonction `countTo()` de props.js).
- Les 445 textes en attente ne sont **pas** montrés comme exclus (banc, ticket d'attente, pas de rouge).
- La Réunion et le Sénégal sont des **configurations envisagées** : un voyage à venir, pas des résultats.
- Acte III : badge « synthèse provisoire — extraction en cours » en permanence (géré par `timeline.js`) + étiquette sur Jumo.
- Citations d'études en petit, en bas à droite, **au-dessus** de la bande des sous-titres : `cite([...], k)`.
- **Aucun logo ni marque** (bases, éditeurs, institutions) : pictogrammes génériques et nom écrit. Pas de Clawd.
- Le texte de narration ne s'écrit pas à l'écran (il est dans les sous-titres) ; seuls les « textes à l'écran » de la V2
  apparaissent, **intégrés au décor** (étiquettes des puits, compteur de l'entonnoir, panneaux, jauge), pas en carton plein écran.

## 2. Temps : la voix fait foi

- `src/timing.js` est **généré** (`node narration/build_timeline.mjs`) depuis les durées réelles de la voix.
  Durée de scène = max(minutage V2, 0,3 s + voix + 0,6 s).
- Une scène s'enregistre avec des temps **locaux**, calés sur les répliques :
  ```js
  scene('1.3', S => [[0, shotA], [S.cue(4) - .3, shotB]]);   // S.cue(i) = début de la réplique i, S.cueEnd(i) = sa fin
  ```
  Ne jamais écrire de seconde absolue du film : quand la voix change, tout se recale.
- Signature d'un plan : `fn(t, lt, dur, S, st)` — t = temps du film, lt = temps depuis le début du plan,
  dur = durée du plan, st = temps depuis le début de la scène.

## 3. Rendu : ce qui coûte, ce qui ne coûte rien (rendu logiciel, pas de GPU)

| appel | coût | usage |
|---|---|---|
| `paint(..., { fill })` aquarelle | **1–2 s** | **uniquement dans les plates** (`definePlate`) |
| `paint(..., { wash })`, `inkLine` | ~10 ms | personnages, accessoires animés |
| `drawPlate(key, x, y, o)` | ~1 ms | décors, sprites (parchemins ×100 : OK) |
| `glow()` | ~2 ms | lumière (données, lucioles, puits) |
| `letter()` | ~0 | texte à l'écran |

Budget : **≤ 2,5 s par image**. Un personnage ≈ 0,3–0,5 s. Pas plus de ~5 personnages détaillés par image.

- **Décors = plates** (`src/decor.js`), peints une fois (`node render.mjs --plates`), 2400 × 1350 px pour laisser
  la caméra bouger. Un sprite animé à texture = plate avec `mask` (découpe nette, pas de halo blanc).
- Une nouvelle plate se déclare avec `definePlate(key, { w, h, res, paint(w, h), mask(ctx, w, h), variants, c2a })`.
  Le pass `--plates` ne repeint que ce qui a changé.

## 4. Style

- Aquarelle + encre, livre d'images ; papier chaud `#FBF3E6`, grain et vignette (automatiques).
- **Personnages = éléments les plus saturés et contrastés** ; décors clairs et doux.
- Palette V2 : vert sol `#3E7C4A`, bleu nuit `#1F3A5F`, cyan données `#3BC4D8`, ocre décision `#D99A3D`,
  rouge doux `#C8553D` (exclusions et manques seulement). Pas de noir ni de blanc purs (`PAL.ink`, `PAL.cream`).
- Les traits « bouillonnent » 12 fois par seconde (`BOIL`). Chaque élément séparé appelle `boilSeed('clé')` avant
  d'être peint, sinon un objet qui bouge fait trembler tout ce qui est peint après lui. Les personnages le font seuls.
- Lumière : `glow()` (additif). Ne jamais peindre du jaune sur du bleu pour « éclairer » (ça fait du vert).

## 5. Personnages (src/cast.js — les proportions sont en tête du fichier)

| appel | taille type (plan moyen) |
|---|---|
| `awa(x, y, s, o)` — sol entre les pieds | s = 22 (264 px) ; gros plan 45–60 ; plan large 9–13 |
| `jumo(x, y, u, o)` — centre du corps | u = 12–14 ; `stage` 0 / 1 / 2 = 0, 1, 2 antennes (**toujours cohérent**) |
| `bipbop(x, y, u, { who })`, `arbitre(...)`, `videur(...)`, `tacti(...)` | u = 12–18 |
| `person(x, y, s, { preset: ACTEURS.eleveur })` | agricultrice, éleveur, élu, conseillère |

- Humeurs : **jamais de changement sec**. `actP(t, [[t0, 'neutre'], [t1, 'surprise'], ...])` fait le plissement
  d'anticipation, l'échange sous le plissement, la réaction (take) et le rebond. Expressions : neutre, joie, rire, doute
  (se gratte la tête), surprise, determinee, grimace, idee, fiere, inquiete, emerveillee, soupir, concentree.
- Vues d'Awa : `front`, `q` (3/4), `side` (profil), `back`. Tourner = passer par les vues dessinées, pas de 3D.
- Casquette réversible : `cap: 'labo'` (acte I, bibliothèque), `cap: 'terrain'` (actes II–III) ; `capTurn` 0→1 pour le gag.
- Jumo ne parle jamais : écran-visage (`face`: happy, wide, sad, love, question, cookie, loading, tree, scan, excl,
  wink, angry, dizzy, check, cross) et bips (bruitages).

## 6. Animation (principes, chiffres à 24 i/s)

- Anticipation avant chaque saut (0,15–0,3 s), étirement au décollage, écrasement à l'atterrissage (`jump`, `take`).
- Lent au départ, lent à l'arrivée (`ease`, `easeOut`, `backOut`) ; jamais de `lerp` linéaire nu.
- Arcs (`arcPt`), chevauchement (la tresse d'Awa, les hélices, les antennes traînent et rebondissent : `spring`, `ring`).
- **≤ 60 px et ≤ 0,7 rad par image** pour tout ce qui bouge (sinon stroboscope) ; cycles de marche ≤ 5 Hz.
- Une lecture à la fois : cause, puis réaction. Donner le temps de lire (le spectateur voit le film une fois).
- **Chaque plan bouge** : poussée lente, panoramique, bascule, ou secousse sur impact (`camBegin/camEnd`, `shakeXY`).

## 7. Mise en page

- 1920 × 1080, origine en haut à gauche, y vers le bas.
- **Bande des sous-titres : y > 960 libre de toute action importante** (visages, chiffres, citations).
- Coin haut droit réservé au badge « provisoire » pendant l'acte III (≈ x 1530–1890, y 40–100).

## 8. Transitions

- Entre les actes : volet au pinceau (automatique dans `timeline.js`, autour du début de 2.1 et de 3.1).
- Entre les scènes : les transitions motivées de la V2 (la carte devient une porte, les clés s'envolent vers les puits,
  les pages deviennent des parcelles, le globe devient une bibliothèque…). Chaque scène peint sa propre entrée et sa
  propre sortie, et le raccord doit se lire (même forme, même mouvement de part et d'autre de la coupe).

## 9. Vérifier

```bash
node render.mjs --scene=1.3 --sheet=0.5,3,6,9,12,15 --cols=3 --w=640 --out=out/check/s13.jpg   # planche contact
node render.mjs --scene=1.3 --strip=4.0:4.6 --out=out/check/s13_strip.jpg                     # chaque image d'un geste
node render.mjs --scene=1.3 --sheet=6 --crop=700,300,500,400 --w=500 --out=out/check/face.jpg  # détail
```
Ouvrir chaque image et la regarder : lecture de l'évènement, timing, pops, sous-titres libres, accents (é, è, à, ç, ô),
chiffres exacts, aucun logo.

## 10. Travail en parallèle

Une scène = un fichier `src/ch/aN_sM.js`, dans une IIFE. Ne pas modifier les fichiers partagés (core, cast, props,
decor, timeline, sheets, studio.html, render.mjs) : si un utilitaire manque, l'écrire en privé dans la scène et le
signaler.
