# Point de validation 🛑 — étape 3 (personnages, styles, voix)

Brief § 4, étape 3 : « S'arrêter et présenter ces images au commanditaire avant d'animer. »
L'animation (étape 4) n'a **pas** commencé. Ce document liste ce qui est prêt et ce qui demande une décision.

## Ce qui est prêt

| élément | fichier |
|---|---|
| Planches des personnages (face, 3/4, profil, dos + expressions) | `out/sheets/sheet_*.png` |
| Jumo : les trois paliers (0, 1, 2 antennes) + 6 visages | `out/sheets/sheet_jumo.png` |
| Une image de style par décor (7) | `out/sheets/style_*.png` |
| Narration Fish Audio : 87 répliques, 20 scènes, mesurées | `narration/audio/` |
| Horloge du film calée sur la voix : **7 min 17,75 s** (cible V2 ≈ 7 min 10) | `src/timing.js` |
| Sous-titres FR calés sur la voix réelle | `out/awa_jumo_v2_fr.srt` |
| Aperçu audio voix + musique synthétisée (sans bruitages) | `out/preview/apercu_voix_musique.mp3` |

## Contrôles déjà faits

- **Chiffres prononcés** : chaque réplique a été retranscrite par un moteur de reconnaissance local (faster-whisper) ;
  tous les nombres reviennent tels qu'envoyés (3 147 · 1 852 · 332 · 147 · 2 190 · 7 668 · 686 · 241 · 139 · 0,9 ·
  5 sur 16 · 9 · 2010–2026 · 260 · 33). Deux répliques où le « Pas » initial était avalé (« Pas sûr ? Dehors. »,
  « Pas parfait… ») ont été régénérées **en ne changeant que la ponctuation**.
- Mixage mesuré : −16,0 LUFS intégrés, crête −1,5 dBFS. **Je ne peux pas écouter** : merci d'écouter l'aperçu.

## Décisions à confirmer

1. **La voix.** L'identifiant fourni (`FISH_AUDIO_VOICE_ID`) est « Voix féminine pour histoire » (français, calme,
   conteuse). La V2 décrit « le Narrateur… Il ». Je garde la voix fournie (c'est votre choix de voix) : à confirmer.
2. **Modèle Fish Audio.** Le modèle de production `s2.1-pro` a répondu **402 : crédit API insuffisant** (le crédit API
   est séparé du crédit de la plateforme). J'ai utilisé `s2.1-pro-free`, qui est **le même modèle** en niveau gratuit
   (sans garantie de latence, sans effet sur un rendu hors ligne). Si vous ajoutez du crédit, `FISH_AUDIO_MODEL=s2.1-pro`
   régénère tout à l'identique.
3. **« Pas si vite. »** Dans la V2, c'est une réplique du narrateur écrite dans l'*action* de la scène 1.1, pas dans le
   bloc *Narrateur*. Je l'ai fait dire par le narrateur entre « …encore possibles. » et « Mais avant de construire… ».
4. **Répliques courtes des personnages** (Videur, Maître Arbitre, Tacti) : même voix Fish Audio, puis transformée
   (hauteur/tempo) avec FFmpeg pour distinguer chaque personnage. Aucune autre synthèse vocale.
   « Pas de résumé, pas d'entrée. » n'est dit qu'une fois, par le narrateur (la V2 le met aussi dans la bouche du Videur).
5. **Nombre de scènes.** Le brief parle de 21 scènes ; la V2 en contient **20** (6 + 7 + 7). Je suis la V2.
6. **Durée.** La voix est plus rapide que prévu : chaque scène garde au moins sa durée V2 ; total 7 min 18 s.
7. **Casquette.** Côté « labo » (bleu nuit / cyan) pendant l'acte I, retournée côté « terrain » (ocre / vert) au passage
   à l'acte II (gag de la casquette qui se retourne).

## Contraintes techniques (pour information)

- Pas de GPU sur la machine : WebGL logiciel. Un lavis aquarelle p5.brush coûte 1–2 s ; les décors et les accessoires
  texturés sont donc **peints une fois** (« plates ») et les personnages peints à chaque image (lavis + encre).
  Budget visé ≈ 1,5–2,5 s par image, soit **4 à 6 h** de rendu pour les 10 506 images.
- Deux défauts de p5.brush trouvés et contournés : une ligne d'encre à 2 points ne se dessine pas et corrompt la
  suite (corrigé dans `inkLine`), et l'ordre des couches aquarelle/lavis n'est garanti qu'entre deux passes de dessin
  (les plates sont rejouées appel par appel).
