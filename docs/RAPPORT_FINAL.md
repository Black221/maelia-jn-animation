# Rapport final : « Awa et Jumo : la quête du jumeau stratégique »

## Livrables

| fichier | contenu |
|---|---|
| `out/awa_jumo_v2_full.mp4` | version longue, 7 min 19 s (439,33 s), 1920 × 1080, 24 i/s, 10 544 images, H.264 (1,5 Mb/s, deux passes) + AAC stéréo 48 kHz 192 kb/s, 93,3 Mo |
| `out/awa_jumo_v2_fr.srt` | sous-titres français, 110 blocs, calés sur les durées mesurées de la narration |
| ce dépôt | projet complet et relançable : `README.md` (chaîne complète), `CREDITS.md` (licences et crédits) |

## Contrôlé

- **Fichier vidéo** (ffprobe) : 1920 × 1080, 24/1 i/s, 10 544 images = 24 × 439,33 s, piste audio présente et de même durée.
- **Sonie** (ebur128 sur le MP4 final) : −16,0 LUFS intégrés, crête vraie −1,5 dBFS, LRA 5,4 LU. Normalisation en deux passes (`audio/mix.mjs`).
- **Chiffres à l'écran** (`tools/fidelity.mjs`) : chaque nombre affiché figure dans V2. Seul signalement : « 6971 », qui fait partie
  d'un nom d'utilisateur GitHub dans le générique, pas un chiffre de l'étude. Les compteurs passent par des valeurs intermédiaires
  pendant qu'ils tournent, puis s'arrêtent exactement sur la valeur de V2.
- **Chiffres prononcés** (transcription Whisper locale, `tools/asr_check.py` + `tools/asr_numbers.py`) : tous les nombres de V2
  sont entendus correctement. Trois fausses alertes du parseur : « six clés » transcrit « si clé », « 241 » transcrit « 240 et 1 », « 0,9 » arrondi par Whisper.
- **Mise en page** : citations des études en petit, en bas à droite ; badge « synthèse provisoire — extraction en cours »
  pendant tout l'acte III ; aucun logo, aucun Clawd ; tous les personnages sont originaux ; bande des sous-titres (y > 960) gardée libre.
- **Relecture visuelle** : planche de tout le film, puis quatre images par heure de rendu, puis ouverture, milieu et fin du MP4 final.

## Non contrôlé

- **Écoute humaine.** Personne n'a écouté le mixage : il n'est vérifié que par la mesure (sonie, forme d'onde) et par la transcription.
  Le jeu de la voix, l'équilibre musique/voix et le timbre des répliques transposées (videur, arbitre, Tacti) restent à juger à l'oreille.
- **Modèle de voix.** La voix vient du modèle gratuit `s2.1-pro-free` de Fish Audio : le modèle payant `s2.1-pro` renvoie 402 (pas de crédit sur la clé).

## Écarts de durée avec V2

Durées cibles de V2 : 430 s au total ; film : 439,33 s (+ 9,3 s). Une scène s'allonge seulement quand la voix mesurée, plus les silences
demandés par le storyboard, dépasse la cible :

| scène | V2 | film | écart |
|---|---|---|---|
| 1.1 | 30 s | 31,6 s | + 1,6 s |
| 1.6 | 25 s | 27,3 s | + 2,3 s |
| 2.6 | 20 s | 23,0 s | + 3,0 s |
| 3.3 | 20 s | 20,8 s | + 0,8 s |
| 3.6 | 20 s | 21,5 s | + 1,5 s |

Les 15 autres scènes durent exactement leur cible.

## Temps de calcul (4 cœurs, sans GPU, WebGL logiciel SwiftShader)

- Images : ≈ 7 h 15 pour 10 544 images, soit ≈ 2,5 s par image avec 2 workers. Le plus lourd : les scènes 1.2 à 1.4 (≈ 3 s par image).
- Encodage deux passes : ≈ 12 min.
- Un premier rendu s'est arrêté après 114 images (une page du navigateur n'a jamais fini de charger) : `render.mjs` rouvre maintenant
  une page qui bloque au chargement ou meurt en cours d'image, et reprend là où il s'était arrêté.

## Pourquoi 1,5 Mb/s

Le grain du papier et le tremblé du pinceau changent à chaque image : à qualité constante, CRF 20 donne ≈ 14 Mb/s (≈ 750 Mo).
À 1,5 Mb/s, le film tient sous la limite de 100 Mo de GitHub ; à l'œil, la seule différence est un grain de papier un peu plus doux.
Pour une copie de diffusion plus lourde : `node render.mjs --encode --audio=out/mix.wav --crf=20 --out=out/awa_jumo_v2_hq.mp4`.

## Remarques mineures connues

- 1.6 : la tête d'Awa passe dans la bande des sous-titres pendant ≈ 1 s.
- Le mot du badge de Jumo n'est pas dessiné quand Jumo est petit ; le badge en coin de l'acte III le remplace.
- Le générique commence par une ligne « Awa et Jumo / la quête du jumeau stratégique » : c'est un ajout, à retirer facilement dans `src/ch/a3_s7.js`.
- La carte finale de 3.6 reste à l'écran pendant les 2,5 premières secondes de 3.7.
