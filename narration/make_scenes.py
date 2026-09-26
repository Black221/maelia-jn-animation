# Builds narration/scenes.json from the V2 storyboard's narration, split into lines (one sentence or short group each).
# `texte` = V2 wording, kept for subtitles. `texte_tts` = the same words written for speech synthesis (numbers and
# acronyms spelled out, "κ" read "kappa"). Character lines (Videur, Arbitre, Tacti) are the V2 "répliques courtes".
import json, re, os
N = 'narrateur'
S = [
 ('1.1', 1, 'La carte avant le voyage', 0, 30, [
   (N, "Voici Awa."),
   (N, "Elle rêve d'un jumeau numérique capable de dire à son territoire quels futurs sont encore possibles."),
   (N, "Pas si vite."),
   (N, "Mais avant de construire quoi que ce soit, il faut savoir ce que le monde sait déjà."),
   (N, "Et pour ça, on ne fouille pas au hasard : on écrit d'abord les règles de la quête."),
   (N, "Quatre questions. Des critères clairs."),
   (N, "Et un protocole… verrouillé."),
   (N, "Toute modification ? Datée et justifiée."),
 ]),
 ('1.2', 1, 'Les mots magiques', 30, 50, [
   (N, "Pour ouvrir la bibliothèque, il faut les bons mots :", None),
   (N, "jumeau numérique, assimilation de données, modèles multi-agents, systèmes agricoles, trajectoires, décision, exploration de modèles."),
   (N, "Combinés, ils forment six clés."),
   (N, "On cherche de 2010 à 2026, et seulement des articles.", "On cherche de deux mille dix à deux mille vingt-six, et seulement des articles."),
 ]),
 ('1.3', 1, 'La pêche aux documents', 50, 75, [
   (N, "OpenAlex : trois mille cent quarante-sept.", "Open Alex : trois mille cent quarante-sept."),
   (N, "Semantic Scholar : mille huit cent cinquante-deux."),
   (N, "HAL : trois cent trente-deux.", "Hal : trois cent trente-deux."),
   (N, "arXiv : cent quarante-sept.", "Arkiv : cent quarante-sept."),
   (N, "Et en tirant sur les références des premiers articles… deux mille cent quatre-vingt-dix de plus."),
   (N, "Total : sept mille six cent soixante-huit."),
   (N, "Oui, vraiment."),
 ]),
 ('1.4', 1, 'Le grand tri', 75, 120, [
   (N, "Premier étage : les doublons."),
   (N, "Deuxième : tout ce qui n'est pas un article du bon type, ou pas de la bonne époque."),
   (N, "Troisième : on lit chaque titre et chaque résumé."),
   (N, "Et là, une règle d'or : dans le doute, on exclut."),
   ('videur', "Pas sûr ? Dehors.", "Pas sûr ?… Dehors !"),
   (N, "Pas de résumé ? Pas d'entrée."),
   (N, "Il en reste six cent quatre-vingt-six."),
   (N, "On en lit deux cent quarante et un en entier, obtenus légalement ; les autres attendent leur tour."),
   (N, "Et à la fin… cent trente-neuf études."),
 ]),
 ('1.5', 1, 'Bip, Bop et le dernier mot', 120, 150, [
   (N, "Chaque parchemin est lu deux fois, par deux intelligences artificielles qui ne se voient pas."),
   (N, "Quand elles ne sont pas d'accord, l'arbitre tranche."),
   (N, "Et à la fin, c'est Awa qui décide : elle revoit toutes les inclusions et un échantillon des exclusions."),
   ('arbitre', "C'est elle la cheffe."),
   (N, "Accord entre Bip et Bop : zéro virgule neuf, ou presque."),
   (N, "C'est ce que les statisticiens appellent un κ, et c'est très bon.", "C'est ce que les statisticiens appellent un kappa, et c'est très bon."),
 ]),
 ('1.6', 1, 'La carte aux trésors cachés', 150, 175, [
   (N, "Pour vérifier qu'on n'avait rien raté d'important, Awa a testé sa recherche sur une liste de travaux connus."),
   (N, "Premier essai : cinq sur seize."),
   (N, "Elle a ajouté une clé et remonté les références : neuf."),
   (N, "Pas parfait, mais honnête, et ça se dit.", "… Pas parfait. Mais honnête, et ça se dit."),
   (N, "Et chaque information notée est reliée à une phrase exacte de l'article, vérifiée automatiquement."),
   (N, "Ici, on ne cite rien de mémoire."),
 ]),
 ('2.1', 2, 'Un territoire qui change vite', 175, 190, [
   (N, "Le territoire d'Awa vit dans l'incertitude : le climat, les prix, les techniques, tout bouge vite."),
   (N, "Et chaque choix agricole a des effets sur l'eau, l'azote, les sols."),
 ]),
 ('2.2', 2, 'La maquette qui n’écoute pas', 190, 210, [
   (N, "Voici MAELIA, une plateforme qui simule le territoire, ses fermes et ses rivières, agent par agent.", "Voici Maélia, une plateforme qui simule le territoire, ses fermes et ses rivières, agent par agent."),
   (N, "Elle sait jouer des scénarios."),
   (N, "Mais elle a été conçue pour la simulation planifiée : les données du terrain, collectées au fil de la saison… ne rentrent pas."),
 ]),
 ('2.3', 2, 'Jumo prend des antennes', 210, 230, [
   (N, "Un modèle, c'est une copie."),
   (N, "Une ombre numérique, c'est une copie qui reçoit les données du terrain."),
   (N, "Un jumeau numérique, c'est une copie qui reçoit… et qui répond, pour éclairer les décisions."),
 ]),
 ('2.4', 2, 'Tacti contre Jumo', 230, 245, [
   ('tacti', "Maintenant ! Maintenant ! Maintenant !"),
   (N, "Beaucoup de jumeaux agricoles sont comme Tacti : ils pilotent en temps réel, pour aujourd'hui."),
   (N, "Awa veut autre chose : un jumeau stratégique, qui réévalue à chaque saison les chemins encore possibles."),
 ]),
 ('2.5', 2, 'L’arbre des futurs', 245, 260, [
   (N, "Car les futurs ne sont pas figés."),
   (N, "Des options apparaissent, restent ouvertes, deviennent trop chères, ou se referment pour de bon."),
   (N, "Parfois, une porte ne s'ouvre qu'un instant."),
 ]),
 ('2.6', 2, 'La boucle de Jumo', 260, 280, [
   (N, "Le plan d'Awa : un prototype de jumeau stratégique."),
   (N, "Il observe,"),
   (N, "il intègre les données,"),
   (N, "il met à jour le territoire simulé,"),
   (N, "il recalcule les futurs possibles en explorant le modèle avec OpenMOLE,", "il recalcule les futurs possibles en explorant le modèle avec Open Mole,"),
   (N, "et il montre l'écart entre ce qui était prévu et ce qui s'est passé."),
   (N, "Pour décider mieux, et ensemble."),
 ]),
 ('2.7', 2, 'Deux terrains d’aventure', 280, 295, [
   (N, "L'aventure est prévue sur deux terrains :"),
   (N, "La Réunion, bien équipée en capteurs, pour faire entrer les données ;"),
   (N, "et le Sénégal, à l'échelle d'un territoire, pour étudier les trajectoires et leurs bifurcations."),
 ]),
 ('3.1', 3, 'Île RQ1 : la foire aux jumeaux', 295, 315, [
   (N, "Première île, première leçon : le mot “jumeau” est à la mode.", "Première île, première leçon : le mot jumeau est à la mode."),
   (N, "Mais beaucoup de ces outils sont des ombres, ou de simples modèles."),
   (N, "Et presque tous servent le pilotage tactique."),
   (N, "L'idée d'un jumeau qui explore plusieurs futurs ne fait qu'émerger."),
 ]),
 ('3.2', 3, 'Île RQ2 : la vallée des artisans des données', 315, 340, [
   (N, "Deuxième île : les méthodes pour faire entrer les données existent."),
   (N, "En agriculture, on les utilise surtout pour recaler des modèles de culture grâce aux satellites."),
   (N, "Mais pour les modèles multi-agents comme MAELIA, les meilleurs artisans travaillent… ailleurs :", "Mais pour les modèles multi-agents comme Maélia, les meilleurs artisans travaillent… ailleurs :"),
   (N, "sur les foules, les épidémies, la finance."),
 ]),
 ('3.3', 3, 'Trois leçons à la vallée', 340, 360, [
   (N, "Leçon un : mettre à jour l'état ne suffit pas, il faut aussi recaler les paramètres."),
   (N, "Leçon deux : certains paramètres se ressemblent tant qu'on ne peut pas les distinguer."),
   (N, "Leçon trois : ce qui marche sur des données simulées devient bien plus difficile sur des données réelles."),
   (N, "Une prévision toute simple reste parfois difficile à battre !"),
 ]),
 ('3.4', 3, 'Île RQ3 : le labyrinthe des futurs', 360, 380, [
   (N, "Troisième île : on sait dessiner les futurs."),
   (N, "Portes qui se verrouillent, pentes qu'on ne remonte pas, seuils qui font tout basculer."),
   (N, "Et en explorant le modèle intelligemment, on découvre bien plus de chemins :"),
   (N, "deux cent soixante comportements au lieu de trente-trois."),
 ]),
 ('3.5', 3, 'Île RQ4 : le village aux chaises vides', 380, 395, [
   (N, "Quatrième île : ces outils sont rarement testés avec ceux qui décident."),
   (N, "Heureusement, il y a des exceptions, et MAELIA en fait partie, grâce aux démarches participatives.", "Heureusement, il y a des exceptions, et Maélia en fait partie, grâce aux démarches participatives."),
 ]),
 ('3.6', 3, 'Le pont manquant', 395, 415, [
   (N, "En rassemblant tout ce savoir, Awa découvre un vide :"),
   (N, "personne n'a encore fait entrer, au fil des saisons, les observations d'un vrai territoire agricole dans un modèle multi-agents, pour réévaluer ses futurs."),
   (N, "Ce pont-là n'existe pas encore."),
   (N, "C'est exactement celui qu'Awa va construire."),
 ]),
 ('3.7', 3, 'Épilogue et générique', 415, 430, [
   (N, "Et l'aventure ne fait que commencer."),
 ]),
]
out = []
for sid, act, titre, a, b, lines in S:
  L = []
  for ln in lines:
    qui, txt = ln[0], ln[1]
    tts = ln[2] if len(ln) > 2 and ln[2] else txt
    L.append({'qui': qui, 'texte': txt, 'texte_tts': tts})
  narr = [l for l in L if l['qui'] == N]
  out.append({
    'id': sid, 'acte': act, 'titre': titre, 'cible': [a, b],
    'texte': ' '.join(l['texte'] for l in narr),
    'texte_tts': ' '.join(l['texte_tts'] for l in narr),
    'lignes': L,
  })
os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scenes.json'), 'w'), ensure_ascii=False, indent=1)
tot = sum(len(l['texte_tts']) for s in out for l in s['lignes'])
print(len(out), 'scènes,', sum(len(s['lignes']) for s in out), 'lignes,', tot, 'caractères TTS')
