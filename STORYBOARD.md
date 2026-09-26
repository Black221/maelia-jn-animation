# STORYBOARD — « Awa et Jumo : la quête du jumeau stratégique » (V2 découpée en plans)

Source de vérité : [`docs/animation_motion_design_v2.md`](docs/animation_motion_design_v2.md). Ce fichier découpe
chaque scène en plans et cale chaque action sur une réplique de la narration (`L0`, `L1`… = lignes de
`narration/scenes.json`, dans l'ordre ; `S.cue(i)` dans le code). Les durées réelles viennent de la voix
(`src/timing.js`) ; les durées ci-dessous sont les cibles de la V2.

**Logline.** Awa rêve d'un jumeau numérique qui dise à son territoire quels futurs restent possibles ; mais avant de
construire, elle doit chercher avec méthode ce que le monde sait déjà — et découvre que la pièce qui manque est la sienne.

**Monde.** Un univers agricole d'aujourd'hui, en un peu plus lumineux, peint à l'aquarelle.
Arc de couleur : aube dorée (1.1) → bois chaud et cyan de la bibliothèque (acte I) → verts et ocres du territoire (acte II)
→ nuit bleue de l'arbre des futurs → turquoise de l'archipel (acte III) → coucher de soleil doré (3.7) qui rime avec l'aube.

**Motifs.** Les antennes de Jumo (0 → 1 → 2) ; la cloche de MAELIA qui s'ouvre enfin (2.2 → 2.6) ; l'arbre des futurs ;
la carte aux quatre îles (1.1 → 2.7 → acte III) ; la boucle de Jumo qui devient le rond-point du pont manquant (3.6).

**Arc d'Awa.** pressée (1.1) → méthodique (1.2–1.6) → inquiète devant la maquette sourde (2.2) → déterminée (2.4–2.6)
→ curieuse puis grave (acte III) → illuminée (3.6) → sereine (3.7).

**Casquette.** côté « labo » (bleu nuit / cyan) pendant l'acte I ; retournée côté « terrain » (ocre / vert) en 1.6→2.1.

---

## ACTE I — La Grande Bibliothèque (méthode)

### 1.1 La carte avant le voyage (≈ 30 s) · décor `dawn`
| plan | calage | image · évènement · caméra |
|---|---|---|
| A | 0 → L1 | Ouverture en iris depuis le soleil. Aube sur le champ connecté ; capteurs-champignons qui s'allument un à un. Awa assise sur le capot du tracteur électrique, Jumo (palier 0, écran gris) tourne autour d'elle. Poussée lente. « Voici Awa. » : elle salue ; « Elle rêve… » : au-dessus d'elle, un petit arbre des futurs griffonné sur sa tablette s'anime. Titre du film peint dans le ciel. |
| B | L1 fin → L2 | Awa saute du tracteur (anticipation, étirement, écrasement), elle fonce vers la droite… **« Pas si vite. »** : tout se fige (couleurs désaturées, lignes qui s'arrêtent de bouillir), Jumo figé en plein vol. |
| C | L3 → L4 | Le temps repart ; Awa soupire (soupir), s'assoit, sort sa tablette : gros plan tablette, elle dessine une **carte au trésor** avec quatre îles RQ1–RQ4 (le trait se trace). Les libellés RQ apparaissent. |
| D | L5 | « Quatre questions » : les îles pulsent une à une, textes RQ1–RQ4 lisibles. **Gag** : Jumo ajoute une 5e île en forme de cookie ; Awa l'efface d'un revers de stylet. |
| E | L6 → L7 | Sous la carte, un parchemin « Protocole » ; Jumo y appose un cadenas : « clic ». « Toute modification ? Datée et justifiée. » : un tampon de date s'imprime. |
| → | fin | **Transition** : la carte s'envole, grandit et devient la porte d'une immense bibliothèque-silo. |
Texte à l'écran : titre · « Revue systématique — méthode PRISMA 2020 » · RQ1 *C'est quoi, un jumeau agricole ?* ·
RQ2 *Comment faire entrer les données ?* · RQ3 *Comment dessiner les futurs possibles ?* · RQ4 *Comment le partager avec les acteurs ?*

### 1.2 Les mots magiques (≈ 20 s) · décor `library` (porte)
| A | 0 → L1 | Devant la porte, un pupitre-puzzle. Awa pioche sept pièces de mots-clés (les mots s'allument au fil de L1). |
| B | L2 | Les pièces s'assemblent en six clés de formes différentes (tamis, loupe, épi…), Q1–Q6. La frise « 2010 → 2026 » s'allume au-dessus de la porte. |
| C | L3 | Pancarte « Articles scientifiques bienvenus — thèses et mémoires : demi-tour ». **Gag** : un gros volume « THÈSE » tente d'entrer et repart, vexé. |
| → | fin | Les clés s'envolent vers quatre puits de données. |
Texte : « 6 équations de recherche · 2010–2026 · articles (thèses et mémoires exclus) »

### 1.3 La pêche aux documents (≈ 25 s) · décor `library`
| A | L0–L3 | Quatre puits lumineux (pictogrammes génériques, nom écrit). Awa lance ses clés comme des lignes de pêche ; chaque puits remonte une nuée de parchemins, son compteur s'emballe et s'arrête net sur la valeur dite (3 147 · 1 852 · 332 · 147). Caméra : panoramique de puits en puits. |
| B | L4 | Jumo tire un fil sur un parchemin : la bibliographie se déroule, 2 190 parchemins de plus. |
| C | L5 → L6 | Total 5 478 → 7 668. **Gag** : la pile atteint le plafond, Jumo disparaît dessous, seule son hélice dépasse. « Oui, vraiment. » |
| → | fin | Toutes les particules convergent vers le haut de l'entonnoir. |
Texte : OpenAlex **3 147** · Semantic Scholar **1 852** · HAL **332** · arXiv **147** → **5 478** · par citations **2 190** · **TOTAL 7 668**

### 1.4 Le grand tri (≈ 45 s) · décor `library_tall` (la caméra descend l'entonnoir)
| A | L0 | Étage des clones : scanner, doublons poussés dehors en file indienne. Compteur 7 668 → **4 978** (2 690 doublons). |
| B | L1 | Étage du tampon : erratums, avis, hors période rejetés. **750** → **4 228**. |
| C | L2–L5 | Étage de la lecture rapide : Bip & Bop lisent. À la sortie, le Videur « Doute » : **« Pas sûr ? Dehors. »** Parchemins sans résumé (sans visage) refoulés : « Pas de résumé ? Pas d'entrée. » |
| D | L6 | Il en reste **686**. **Gag** : Jumo cache un parchemin exclu sous son hélice, le Videur fait « non » du doigt. |
| E | L7 | Étage des textes complets : **241** parchemins s'ouvrent en entier ; **445** attendent sur un banc derrière une porte « accès institutionnel », ticket d'attente en main (**pas exclus**). |
| F | L8 | Sortie : petit tapis rouge, **139 études incluses** sous les confettis. |
| → | fin | Zoom sur un parchemin qui passe un filtre : on entre dans le filtre. |
Compteur central : 7 668 → 4 978 → 4 228 → 686 → 241 lus (445 en attente) → 139 études incluses

### 1.5 Bip, Bop et le dernier mot (≈ 30 s) · décor `library`
| A | L0 | Bip et Bop dos à dos, paravent. Même parchemin ; chacun lève ✔ ou ✖. S'ils coïncident : tape dans la main par-dessus le paravent sans se voir. |
| B | L1 | S'ils divergent : Maître Arbitre descend en planant, ajuste ses lunettes, tranche. |
| C | L2–L3 | Awa arrive avec le gros tampon « VALIDÉ PAR L'HUMAIN ». **Gag** : l'Arbitre tranche, Awa retourne la décision ; la chouette hausse les épaules : **« C'est elle la cheffe. »** |
| D | L4–L5 | La jauge d'accord (« tape-m'en-cinq-mètre ») monte presque au sommet. Panneaux : Titre/résumé κ = 0,899 · 1 249 notices revues par l'humain · Texte intégral κ = 0,897 · 149 notices revues. |
Texte : « L'humain a toujours le dernier mot » (κ = **accord**, jamais « réussite »)

### 1.6 La carte aux trésors cachés (≈ 25 s)
| A | L0–L2 | Awa déplie une vieille carte : 24 trésors, 16 « récents » (depuis 2010) mis en avant. D'abord **5** s'allument (grimace), elle forge une clé, tire sur des fils : **9**. Les 7 autres en pointillé avec « ? ». |
| B | L3 | « Pas parfait, mais honnête » : Awa hausse les épaules, sourire franc. |
| C | L4–L5 | La loupe de vérité : fils dorés entre une fiche et une phrase exacte (avec page) ; Jumo scanne, « ding » à chaque correspondance. |
| → | fin | Awa referme le grand livre, retourne sa casquette côté terrain ; le vent tourne les pages qui deviennent des parcelles vues du ciel. **Volet au pinceau** (acte II). |
Texte : « Test de rappel : 5 puis 9 sur 16 » · « Chaque information = une citation exacte + sa page »

## ACTE II — Le rêve d'Awa (la thèse)

### 2.1 Un territoire qui change vite (≈ 15 s) · `territory` (vue aérienne)
Ciel qui accélère : sécheresse (la rivière maigrit), orage, panneau de prix qui clignote ; agriculteurs qui regardent le
ciel, leur téléphone, le ciel. Bulles d'indicateurs : eau, azote, carbone des sols, biomasse, gaz à effet de serre.

### 2.2 La maquette qui n'écoute pas (≈ 20 s) · `hill` + `dome`
MAELIA sous sa cloche : petits agents fermiers. Awa appuie « Scénario A », « Scénario B » : deux futurs en accéléré (L1).
L2 : Jumo capte de vraies mesures et les lance : elles **rebondissent sur la cloche** ; il réessaie plus fort, une balle
le percute : « bip ! ».

### 2.3 Jumo prend des antennes (≈ 20 s) · fond `night` éclairé, jingles
L0 **Modèle** : écran gris, il copie le paysage mais ne reçoit rien. L1 **Ombre** : une antenne pousse, flux cyan
montant du terrain, l'écran reflète le champ en direct. L2 **Jumeau** : deuxième antenne, flux ocre vers Awa et les
agriculteurs en petites cartes « et si… ? ». Texte : « Modèle → Ombre (un sens) → Jumeau (deux sens) »

### 2.4 Tacti contre Jumo (≈ 15 s) · écran partagé
Gauche : Tacti ouvre et ferme une vanne : « Maintenant ! Maintenant ! Maintenant ! ». Droite : Jumo calme, calendrier
des saisons, arbre des futurs au-dessus de lui. Awa au milieu sourit à Jumo.
Texte : « Tactique : agir maintenant » · « Stratégique : réévaluer les futurs possibles »

### 2.5 L'arbre des futurs (≈ 15 s) · `night`
Awa et Jumo marchent sur les branches : cadenas (verrouillage) · vallée sans remontée (bascule, irréversibilité) ·
porte lumineuse qui s'ouvre quelques secondes, Awa passe de justesse (fenêtre d'opportunité) · branche qui s'amincit
(trop coûteuse). Texte : « Verrouillage · Point de bascule · Irréversibilité · Fenêtre d'opportunité »

### 2.6 La boucle de Jumo (≈ 20 s) · ciel du territoire
Jumo trace une boucle en cinq stations, un numéro par clause (L1–L5) : Observer · Intégrer · Actualiser (la cloche
s'ouvre enfin) · Recalculer les futurs (lanterne OpenMOLE) · Comparer et décider (calque prévu/réel, Awa réunit les acteurs).

### 2.7 Deux terrains d'aventure (≈ 15 s) · `reunion`, `senegal`
Petit avion-cargo. Escale La Réunion (capteurs-lucioles, Jumo aux anges) ; escale Sénégal (plaine, baobabs,
transhumance, arbre des futurs sur le territoire). Montré comme un **voyage à venir**. → l'avion survole l'archipel.

## ACTE III — L'archipel du savoir (provisoire) · badge « synthèse provisoire » en permanence

### 3.1 Île RQ1 : la foire aux jumeaux (≈ 20 s)
Stands « Vrai jumeau numérique ! Garanti ! » ; scanner-miroir de Jumo : « ombre » / « modèle » + buzzer, rares doubles
flèches ; balance tactique/stratégique qui penche (Tacti fait le pitre) ; petit stand « navigateur de décision ».
Gag : étiquette « JUMEAU » sur un thermomètre. Citations : Patil et al., 2025 · El Jarroudi et al., 2026 · Fur et al., 2023.

### 3.2 Île RQ2 : la vallée des artisans des données (≈ 25 s)
Quatre ateliers au bord d'une rivière cyan : nuées (Kalman d'ensemble), lucioles (filtre particulaire), luthier
(recalage bayésien, ABC, MCMC), engrenages (règles et paramétrage). Panneaux « Agriculture → » (modèles de culture +
satellites) et « Foules, épidémies, finance → » (méthodes pour multi-agents).

### 3.3 Trois leçons à la vallée (≈ 20 s)
Les deux molettes (état + paramètres) · les jumeaux indiscernables · la piste d'essai et la boue (le Videur lève un
sourcil ; la grand-mère « demain comme aujourd'hui » = prévision de persistance). Citations : Knowling et al., 2023 ·
Ward et al., 2016 · Ternes et al., 2021.

### 3.4 Île RQ3 : le labyrinthe des futurs (≈ 20 s)
Porte à cadenas · toboggan (hystérésis) · bille et deux vallées (bifurcation) · levier « coût du pesticide » (point de
bascule) · lanterne OpenMOLE « chercher la diversité » : 260 comportements au lieu de 33. Citations : Hotz et al., 2026 ·
Sanga et al., 2025 · Bourceret et al., 2024 · Raimbault & Pumain, 2019 · Pianet et al., 2026.

### 3.5 Île RQ4 : le village aux chaises vides (≈ 15 s)
Table ronde sous un arbre à palabres, chaises vides ; une tablée joyeuse autour d'une petite maquette MAELIA.
Citations : Catarino et al., 2021 · Martin et al., 2016 · Tàbara et al., 2018.

### 3.6 Le pont manquant (≈ 20 s)
Les quatre îles reliées par des ponts qui s'arrêtent au milieu ; la musique se tait ; quatre panneaux « PAS ENCORE » ;
« bip ? » ; Awa dessine la boucle de Jumo qui se pose dans le vide et devient un rond-point. Carton final :
« Intégrer les données du terrain dans MAELIA pour réévaluer, saison après saison, les futurs encore accessibles. »

### 3.7 Épilogue et générique (≈ 15 s)
Coucher de soleil (rime avec l'aube de 1.1) ; Awa sur le tracteur lance Jumo, deux antennes allumées ; l'arbre des
futurs brille. Post-générique : Tacti et le calendrier. Crédits (dont la ligne des crédits techniques).
