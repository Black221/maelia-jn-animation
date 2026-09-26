# Awa et Jumo : la quête du jumeau stratégique

Court métrage d'animation (7 min 19 s, 10 544 images, 1920 × 1080, 24 i/s) en aquarelle peinte, qui présente dans l'ordre la méthode
de collecte (revue PRISMA 2020), la thèse (un jumeau numérique stratégique pour MAELIA) et l'état de l'art (provisoire).
Contenu : [`docs/animation_motion_design_v2.md`](docs/animation_motion_design_v2.md) (source de vérité).
Démarche technique : [`docs/PROMPT_claude_code_cloud.md`](docs/PROMPT_claude_code_cloud.md).

Livrables : `out/awa_jumo_v2_full.mp4` · `out/awa_jumo_v2_fr.srt` · ce projet.

## Prérequis

Node 18+, FFmpeg, Chromium ou Chrome (headless). Pas besoin de GPU : le rendu utilise WebGL logiciel (SwiftShader).

```bash
npm install
```

## Chaîne complète

```bash
# 1. narration (Fish Audio) — clé et voix dans l'environnement, jamais dans un fichier
export FISH_AUDIO_API_KEY=…  FISH_AUDIO_VOICE_ID=…
node narration/tts.mjs                    # une réplique = un fichier, mesuré avec ffprobe
node narration/build_timeline.mjs         # src/timing.js (horloge du film) + out/awa_jumo_v2_fr.srt

# 2. décors et sprites peints une fois (aquarelle p5.brush) — ne repeint que ce qui a changé
node render.mjs --plates

# 3. images (reprenable : relancer continue là où c'était arrêté)
node render.mjs --frames                  # ou --scene=1.4, ou --range=0:30

# 4. son : bruitages relevés dans les scènes, musique + bruitages synthétisés, voix, mixage, −16 LUFS en deux passes
node tools/export_sfx.mjs                 # src/sfx_cues.js
node audio/voice.mjs && node audio/score.mjs && node audio/mix.mjs

# 5. assemblage
node render.mjs --encode --audio=out/mix.wav --out=out/awa_jumo_v2_full.mp4
```

## Temps de calcul (sans GPU)

- Plates (décors et sprites aquarelle) : une fois, ≈ 1 à 2 s par tache de lavis ; ensuite seules les plates modifiées sont repeintes.
- Images : ≈ 1,9 s par image avec 2 workers (SwiftShader), soit ≈ 5 h 30 pour le film entier.
  Les personnages hors champ ne sont pas tracés : sans ce tri, p5.brush recompose toute l'image à chaque couleur (jusqu'à 14 s par image).
- Son et assemblage : quelques minutes.

## Regarder et vérifier

- `studio.html` dans Chrome (`?t=12.5` pour aller à un instant, `?loop=sheet_awa` pour une planche).
- Planches contact : `node render.mjs --scene=1.3 --sheet=0.5,3,6,9 --out=out/check/s13.jpg`.
- Planches de personnages et images de style : `node render.mjs --loop=sheet_jumo --stills=0.4 --out=out/sheets`.
- Chiffres à l'écran contre V2 : `node tools/fidelity.mjs`. Chiffres prononcés (transcription Whisper locale) : `python3 tools/asr_check.py` puis `python3 tools/asr_numbers.py`.
- À-coups de mouvement : `node tools/check-motion.mjs`.

## Organisation

| chemin | rôle |
|---|---|
| `src/timing.js` | **généré** : début, durée et répliques de chaque scène |
| `src/core.js` | moteur : peinture, plates, caméra, lettrage, papier (d'après ClaudeAnimationBase, MIT) |
| `src/cast.js` | personnages (proportions en tête de fichier) |
| `src/props.js`, `src/decor.js` | accessoires et décors |
| `src/timeline.js` | scènes, volets entre actes, badge « provisoire » de l'acte III |
| `src/ch/a1_s1.js` … `a3_s7.js` | une scène par fichier |
| `src/sheets.js` | planches de personnages et images de style |
| `narration/` | texte (`scenes.json`), synthèse (`tts.mjs`), horloge et sous-titres (`build_timeline.mjs`) |
| `audio/` | musique et bruitages synthétisés, mixage |
| `ANIMATION_GUIDE.md`, `STORYBOARD.md` | règles communes, V2 découpée en plans |

Crédits et licences : [`CREDITS.md`](CREDITS.md).
