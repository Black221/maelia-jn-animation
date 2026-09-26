# Brief de production — animation « Awa et Jumo : la quête du jumeau stratégique »

Ce fichier est le brief à donner à une session **Claude Code (cloud)**. Il décrit la démarche technique. Le **contenu** du
film (scènes, narration, chiffres) est dans `animation_motion_design_v2.md` : c'est la **source de vérité**.

---

## 0. Ta mission

Produire un court métrage d'animation en **aquarelle peinte** (style livre d'images, p5.js + p5.brush), avec :
- un narrateur en voix off française, générée avec **Fish Audio** ;
- de la musique et des bruitages ;
- des sous-titres.

Ce film suit **exactement** le storyboard de `animation_motion_design_v2.md` (V2, ≈ 7 min 10, trois actes).

Livrables finaux :
1. `out/awa_jumo_v2_full.mp4` : **version longue uniquement** (≈ 7 min 10), 1920×1080, 24 images/s, audio AAC.
   La version courte du § 8 de la V2 n'est **pas** à produire ;
2. `out/awa_jumo_v2_fr.srt` : sous-titres français, calés sur la narration ;
3. le projet source complet et réexécutable, avec `README.md` (comment rendre) et `CREDITS.md`.

---

## 1. Fichiers d'entrée

| Fichier | Rôle |
|---|---|
| `animation_motion_design_v2.md` | **Storyboard à suivre** : personnages, univers, 21 scènes, narration mot pour mot, texte à l'écran, gags, minutage (ignorer le § 8, version courte) |
| `animation_motion_design.md` (V1) | Seulement pour son **§ 6, tableau des sources des chiffres**. Ne pas suivre sa mise en scène |

**Règles de fidélité (non négociables).**
- **Les chiffres affichés et prononcés** sont ceux de la V2, **au caractère près** : 7 668 ; 3 147 ; 1 852 ; 332 ; 147 ;
  5 478 ; 2 190 ; 2 690 ; 4 978 ; 750 ; 4 228 ; 686 ; 241 ; 445 ; 139 ; κ = 0,899 et 0,897 ; 1 249 ; 149 ; 24, 16, 5 puis
  9 ; 260 contre 33. N'en ajoute aucun, n'en arrondis aucun.
- **La narration** est lue telle qu'écrite dans la V2. Tu peux seulement l'adapter à l'oral : ponctuation, et chiffres
  écrits en toutes lettres pour la synthèse vocale.
- **Les citations d'études** (« Auteur et al., année ») apparaissent en petit, comme indiqué dans chaque scène.
- **Le bandeau « synthèse provisoire »** est affiché pendant tout l'acte III (badge porté par Jumo).
- **Pas de Clawd, ni aucun logo ou marque** : ni de base de données, ni d'éditeur, ni d'institution. Tous les
  personnages sont **originaux** : Awa, Jumo, Bip & Bop, Maître Arbitre, le Videur « Doute », Tacti, les acteurs du
  territoire.
- **En cas de doute sur le contenu**, garde la formulation de la V2 et signale-le dans ton rapport. N'invente pas.

---

## 2. Dépôts de référence

Clone-les dans `ref/`. Ils ne font pas partie du livrable.

| Dépôt | Licence | Usage |
|---|---|---|
| https://github.com/JohnHeibel/ClaudeAnimationBase | **MIT** | **Base de code du projet.** Kit de départ pour dessins animés peints avec Claude : p5.js + p5.brush, rendu, guide pour le modèle. Garde sa notice MIT dans `CREDITS.md` et dans les fichiers repris. **N'utilise pas son personnage Clawd** : reprends seulement la technique de rig et d'émotions pour Awa et Jumo |
| https://github.com/JohnHeibel/PDoomVideo | aucune (utilisation autorisée par le commanditaire, avec crédit) | **Modèle d'architecture pour un film long** : un fichier par chapitre (`src/ch/`), `timeline.js`, `cast.js`, `props.js`, `ANIMATION_GUIDE.md`, `STORYBOARD.md`, rendu parallèle. Il montre aussi les caméras (`camBegin/camEnd`, `shakeXY`), les transitions (volets au pinceau, `iris`, `irisShape`, `flash`), le lettrage (`letter`, `sfx`), les changements d'humeur sans à-coup (`mood`) et le personnage humain « Researcher » (modèle pour Awa) |
| https://github.com/aadil6971/clawd-video | aucune (utilisation autorisée par le commanditaire, avec crédit) | **Style et qualité** : lis `skills/clawd-video/references/` (`style.md`, `characters.md`, `animation.md`, `sound.md`, `qa.md`). Il apporte la palette « Meadow », le rendu papier (grain, vignette), la musique et les bruitages synthétisés (`audio/synth.mjs`), la normalisation à −16 LUFS en deux passes, et les outils `check-motion.mjs` et `sheet.mjs`. Lis aussi la section « Things that bite » de son `SKILL.md` |

Dans `CREDITS.md`, crédite les trois dépôts avec leurs auteurs et liens, ainsi que p5.js, p5.brush (Alejandro Campos),
Puppeteer, FFmpeg et Fish Audio (voix). Le générique de fin (scène 3.7) reprend ces crédits techniques en une ligne.

---

## 3. Direction artistique

### Rendu
- Aquarelle et encre façon livre d'images : papier chaud (`#FBF3E6`), lavis qui bavent, contours encrés légèrement
  tremblés, grain papier et vignette.
- **Les personnages sont l'élément le plus saturé et le plus contrasté** de l'image ; les décors restent clairs et doux.
- Lignes qui « bouillonnent » légèrement, avec une gigue réinitialisée 12 fois par seconde, comme dans PDoomVideo.

### Palettes par décor
Base V2 : vert sol `#3E7C4A`, bleu nuit `#1F3A5F`, cyan données `#3BC4D8`, ocre décision `#D99A3D`, rouge doux
exclusions et manques `#C8553D`.

| Décor | Palette |
|---|---|
| Champ connecté à l'aube (1.1, 3.7) | Ciel `#CFE2EA` → `#F7D7B0`, soleil `#F8C95C`, collines `#B5CFA3` / `#98BF86`, herbe `#B8D48E` |
| Grande Bibliothèque-silo (acte I) | Intérieur boisé chaud `#EBCB96` / `#B98A57`, puits lumineux cyan, entonnoir métal bleu nuit |
| Territoire, maquette MAELIA (2.1–2.2) | Mosaïque de parcelles verts et ocres, rivière `#56A6B3`, cloche de verre avec reflet `screen` |
| Arbre des futurs (2.5, 3.4, 3.6) | Fond bleu nuit, branches cyan lumineuses, cadenas ocre, vallée et chemins fermés en rouge doux |
| La Réunion (2.7) | Relief volcanique vert sombre `#4E7A4A`, terrasses, capteurs-lucioles `#F9C86A` |
| Sénégal (2.7, 3.5) | Plaine ocre `#E3B77A`, baobabs `#8A6246`, ciel chaud |
| Archipel (acte III) | Mer `#9FD3D6` → `#3E8FA3`, îles avec une dominante par question de recherche |

### Personnages
Pour chaque personnage : planche de référence de face, de profil et de dos, et cinq expressions.
- **Awa** : proportions de personnage de livre ; salopette de terrain, tablette, casquette réversible.
- **Jumo** : trois apparences strictes (0, 1 ou 2 antennes), écran-visage avec émoticônes.

Les proportions sont écrites en nombres en tête de `cast.js`.

### Caméra et transitions
- **Chaque plan bouge** : poussée lente, panoramique, bascule, ou secousse sur un impact.
- **Entre les actes**, volet au pinceau.
- **Entre les scènes**, les transitions motivées décrites dans la V2 : la carte devient une porte, les pages deviennent
  des parcelles, etc.

### Texte à l'écran
- **Les chiffres font partie du décor** : compteur de l'entonnoir, étiquettes des puits, panneaux « PAS ENCORE »,
  jauge d'accord. Pas de carton plein écran.
- **Lettrage** : police arrondie ou style marqueur, avec **accents français** (vérifier « é, è, à, ç, ô »).
- **Réserve pour les sous-titres** : garder la bande basse (y > 960) libre d'action importante.

---

## 4. Démarche, étape par étape

### Étape 1 — Mise en place
1. Environnement : Node 18+, FFmpeg, Chrome sans interface (via Puppeteer).
2. Cloner les trois dépôts dans `ref/`.
3. Créer le projet à partir de **ClaudeAnimationBase**, en y ajoutant l'architecture de PDoomVideo :
   - `src/ch/` : un fichier par scène, `a1_s1.js` … `a3_s7.js` ;
   - `src/timeline.js`, `src/cast.js` (Awa, Jumo et les autres), `src/props.js` (entonnoir, puits, cloche MAELIA,
     arbre des futurs, boucle de Jumo, îles…).
4. Écrire `ANIMATION_GUIDE.md` (règles communes : API de peinture, palettes, tailles des personnages, zone des
   sous-titres, fidélité) et `STORYBOARD.md` (la V2 découpée en plans).
5. Vérifier que le rendu fonctionne sur une image de test avant d'aller plus loin.

### Étape 2 — La narration d'abord (Fish Audio)

C'est la voix qui fixe le rythme du film : le minutage de la V2 est une cible, la durée réelle de la voix fait foi.

1. Extraire la narration de chaque scène de la V2 dans `narration/scenes.json`, sous la forme
   `{ id: "1.3", texte: "...", texte_tts: "..." }`. `texte_tts` écrit les chiffres en toutes lettres
   (« sept mille six cent soixante-huit ») et ajoute des pauses. `texte` garde l'écriture de la V2 pour les
   sous-titres.
2. Générer un fichier audio par scène avec l'API Fish Audio :
   - la clé vient de la variable d'environnement **`FISH_AUDIO_API_KEY`** ;
   - la voix vient de **`FISH_AUDIO_VOICE_ID`** (identifiant du modèle de voix choisi par le commanditaire) ;
   - consulter la documentation actuelle de l'API (https://docs.fish.audio) pour l'URL, les en-têtes, le modèle et le
     format de sortie. Ne pas deviner les paramètres ;
   - ne jamais écrire la clé dans un fichier du projet ni dans les journaux.
3. Voix recherchée : narrateur chaleureux, complice, un brin malicieux, débit posé. Les chiffres sont dits sur un ton
   plus sérieux et bref (V2, § 2).
4. Mesurer la durée de chaque fichier (`ffprobe`). Construire `src/timeline.js` à partir des durées réelles :
   - **durée de scène = max(minutage V2, voix + 0,6 s)** ;
   - l'action principale de chaque scène est calée sur les mots correspondants.
5. Générer `out/awa_jumo_v2_fr.srt` à partir de `texte` et des temps réels.

Si `FISH_AUDIO_API_KEY` est absente, arrête-toi après l'étape 2.1 et demande-la. Ne remplace pas la voix par une autre
synthèse sans accord.

### Étape 3 — Personnages et planches de style (point de validation 🛑)
1. Rendre en PNG :
   - la planche de chaque personnage ;
   - Jumo en 3 paliers ;
   - une **image de style par décor** (7 images).
2. **S'arrêter et présenter ces images au commanditaire** avant d'animer. Ne continuer qu'après validation.

### Étape 4 — Animation, acte par acte
- **Règles techniques** :
  - chaque plan est une **fonction pure du temps t** : aucun état conservé d'une image à l'autre, aléatoire seulement
    par graine (`hash`, `G.rng`) ;
  - peindre une seule fois les décors statiques ;
  - découper les accessoires qui bougent au pinceau selon leur contour, sinon un halo blanc apparaît.
- **Principes d'animation** (voir `clawd-video/references/animation.md`) :
  - anticipation avant chaque saut ;
  - étirement au décollage, écrasement à l'atterrissage ;
  - changements d'humeur sans à-coup (`mood`) ;
  - pas plus de 60 px et 0,7 rad par image.
- **Ordre de production** : acte I (scènes 1.1 à 1.6), puis acte II, puis acte III. Après chaque acte :
  - images fixes aux moments clés et planche contact (`sheet.mjs`) ;
  - `check-motion.mjs` ;
  - corriger, puis passer à l'acte suivant.
- **Rendu parallèle, reprenable** (comme `render.mjs` de PDoomVideo) : les images vont dans `out/frames/`, puis sont
  encodées.
- Des sous-agents peuvent écrire des scènes en parallèle, un fichier chacun, à partir de `ANIMATION_GUIDE.md` et
  `STORYBOARD.md`. Ils ne modifient pas les fichiers partagés.

### Étape 5 — Son
1. **Musique** synthétisée en code (méthode clawd-video) : thème principal ukulélé, marimba et pulsation douce, avec
   des variations « enquête » (acte I), « épique » (construction de Jumo, 2.3 et 2.6) et « mystère » (3.6, avec un
   silence avant la révélation).
2. **Bruitages** sur chaque action visible, calés sur les repères de la timeline : bips de Jumo, tampon, confettis,
   buzzer de la foire, porte qui se ferme, rebonds des données sur la cloche.
3. **Mixage** :
   - baisser la musique d'environ 8 dB sous la voix ;
   - voix prioritaire et intelligible ;
   - normaliser à −16 LUFS en deux passes.
4. Tu ne peux pas écouter : contrôle par la mesure (LUFS, crête, forme d'onde en image), et **dis-le** dans ton rapport.

### Étape 6 — Assemblage
1. Encoder la version longue : H.264, 24 images/s, AAC.
2. Vérifier avec `ffprobe` : résolution, images/s, nombre d'images = images/s × durée, présence de l'audio.

### Étape 7 — Contrôle final et rapport
- **Liste de fidélité**, cochée scène par scène :
  - chaque chiffre de la V2 apparaît et est prononcé correctement ;
  - aucun chiffre en plus ;
  - accents corrects ;
  - citations d'études présentes ;
  - badge « provisoire » pendant l'acte III ;
  - aucun logo.
- **Rapport** :
  - ce qui a été vérifié ;
  - ce qui a été corrigé ;
  - ce qui n'a pas pu l'être (écoute du son) ;
  - les écarts de minutage par rapport à la V2 ;
  - les temps de rendu.

---

## 5. Contraintes pratiques

- **Budget de rendu** : viser au plus environ 2,5 s par image (PDoomVideo). Préférer peu de grandes formes à des
  milliers de traits.
- **Durée** : 7 min × 24 images/s ≈ 10 000 images. Utiliser plusieurs workers et un rendu reprenable.
- **Secrets** : `FISH_AUDIO_API_KEY` se configure dans les secrets de l'environnement cloud. Aucun fichier `.env` dans
  le dépôt, et vérifier le `.gitignore`.
- **Réutilisation** : le code de base vient de ClaudeAnimationBase (MIT). Les idées et outils repris de PDoomVideo et
  clawd-video sont crédités dans `CREDITS.md`.
