# Crédits

## Film

**« Awa et Jumo : la quête du jumeau stratégique »** — animation de présentation de la thèse
*Vers un jumeau numérique pour l'aide à la décision stratégique en temps réel : intégration de données en temps réel pour
l'évaluation de trajectoires socio-agroécologiques* — CIRAD / UMR SENS, AgriFutur (PEPR Agroécologie et numérique,
ANR-24-PEAE-0002). Direction : É. Delay, J.-C. Soulié.
Storyboard : `docs/animation_motion_design_v2.md` (contenu), `docs/animation_motion_design.md` (§ 6 : sources des chiffres).
Tous les personnages (Awa, Jumo, Bip & Bop, Maître Arbitre, le Videur « Doute », Tacti, les acteurs du territoire) sont
des créations originales pour ce film.

## Code repris ou inspiré

- **ClaudeAnimationBase** — John Heibel — https://github.com/JohnHeibel/ClaudeAnimationBase — **Licence MIT**.
  Base de code du projet : `src/core.js` (peinture, temps, caméra, papier, lettrage), `render.mjs`, la technique de
  rig par vues dessinées et d'humeurs jouées (`src/cast.js` reprend la méthode de `clawd.js`, pas son personnage),
  `brushWipe`. Notice :

  > MIT License — Copyright (c) 2026 John Heibel
  >
  > Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
  > documentation files (the "Software"), to deal in the Software without restriction, including without limitation
  > the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  > permit persons to whom the Software is furnished to do so, subject to the following conditions:
  >
  > The above copyright notice and this permission notice shall be included in all copies or substantial portions of
  > the Software.
  >
  > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
  > WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  > COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  > OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- **PDoomVideo** (« I'm Upping My P(doom) ») — John Heibel — https://github.com/JohnHeibel/PDoomVideo — sans licence,
  utilisation autorisée par le commanditaire, avec crédit. Architecture d'un film long : un fichier par chapitre
  (ici par scène, `src/ch/`), `timeline.js`, `cast.js`, `props.js`, `ANIMATION_GUIDE.md`, `STORYBOARD.md`, rendu
  parallèle reprenable ; le personnage humain « Researcher » a servi de modèle au rig humain d'Awa.
- **clawd-video** — aadil6971 — https://github.com/aadil6971/clawd-video — sans licence, utilisation autorisée par le
  commanditaire, avec crédit. Références de style et de qualité (palettes, papier, principes d'animation chiffrés,
  contrôle qualité), synthétiseur de musique et de bruitages (`audio/synth.mjs`), normalisation −16 LUFS en deux passes,
  outils `tools/sheet.mjs` et `tools/check-motion.mjs`.

## Bibliothèques et outils

- **p5.js** — Processing Foundation — https://p5js.org — LGPL-2.1
- **p5.brush** — Alejandro Campos — https://github.com/acamposuribe/p5.brush — MIT
- **Puppeteer** (puppeteer-core) — Google — https://pptr.dev — Apache-2.0
- **FFmpeg** — https://ffmpeg.org — LGPL/GPL
- **Chromium** (rendu headless, WebGL logiciel SwiftShader)
- **Fish Audio** — https://fish.audio — synthèse de la voix du narrateur (voix choisie par le commanditaire)

## Polices (assets/fonts, licences jointes)

- **Fredoka** — SIL Open Font License 1.1 — lettrage arrondi (accents français)
- **Permanent Marker** — Apache License 2.0 — onomatopées
- **Patrick Hand** — SIL Open Font License 1.1 — écriture manuscrite
- **DejaVu Sans** (police système, repli pour κ et les flèches)

## Ligne de générique (scène 3.7)

« Animation : p5.js · p5.brush (A. Campos) · d'après ClaudeAnimationBase et PDoomVideo (J. Heibel) et clawd-video
(aadil6971) · Puppeteer · FFmpeg · voix : Fish Audio »
