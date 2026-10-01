# Revue de mise en page et interactions

## Corrections apportées

- Les photos de catalogue au format portrait s’affichent au complet dans un cadre vertical ; les rendus restent contenus dans ce même cadre.
- Le portrait des créatrices est centré, limité à 620 px de large et conserve son ratio 2:3. La grande galerie centre les images avec `object-fit: contain`, y compris la dernière image du Collectif Feuille de Sauge.
- Les images ont une hauteur intrinsèque par défaut. Les cadres qui ont une hauteur définie règlent explicitement l’affichage de leur image, ce qui évite l’agrandissement involontaire des cartes d’études.
- Le titre d’accueil garde ses deux lignes à largeur intermédiaire. La navigation se défile horizontalement sous 1 020 px, avec des liens et boutons d’au moins 44 px de haut.
- Les filtres mettent à jour les nombres et le total affiché. Le faux compteur « 01 / 04 » a été retiré.
- Les dialogs partagent le verrouillage du défilement, gardent le focus au changement de teinte et rendent le focus à l’origine à la fermeture du panier. Les contrôles de quantité conservent aussi le focus après mise à jour.
- La sélection valide ses variantes et quantités, ignore le stockage invalide, et tolère l’indisponibilité de `localStorage`. Limite : 20 exemplaires par variante.
- Les crédits indiquent Luc Bertrand, le Collectif Feuille de Sauge et les archives du projet selon le visuel. L’action de contact de Clémence affiche désormais un libellé cohérent avec son lien courriel.

## Vérification

Contrôles statiques effectués : cohérence des imports des modules, présence des 18 photographies, six rendus, deux plans (les liens de téléchargement ont ensuite été retirés). Le dossier de presse a servi de source pour le récit et les crédits ; son PDF n’est pas publié.

La capture navigateur n’était pas disponible pendant cette revue. Contrôles manuels recommandés avant publication : affichage catalogue et portrait sur ordinateur et mobile ; défilement de la navigation étroite ; filtres et compteurs ; navigation de la galerie ; ouverture/fermeture au clavier des dialogs ; conservation du focus pendant le changement de teinte et les quantités ; ajout, retrait, persistance et limite de sélection.

## Revue directe de l’agencement

Revue effectuée sans délégation : accueil, catalogue et dessins techniques observés dans les vues navigateur disponibles. La grille passe à quatre colonnes au-dessus de 1 180 px, deux aux largeurs intermédiaires et une sur mobile. Les cadres produit suivent le ratio portrait 2:3 sans recadrage ; les marges communes sont plafonnées et les textes de section passent sous leurs titres sur tablette. Les retours à la ligne sont adaptés aux petits écrans.

Les boutons de téléchargement de la section technique sont supprimés et le PDF technique est retiré du dépôt courant ; les deux dessins restent affichés. La suppression n’efface pas les anciennes révisions Git. Le contrôle visuel mobile complet reste à faire, la surface de contrôle étant intermittente.

## Formulaire de devis

Le brouillon `mailto:` du devis est remplacé par un formulaire intégré utilisant FormSubmit. L’adresse destinataire est configurable. La réception finale dépend de son activation initiale ; aucun message réel ni demande client de test n’a été envoyé. Les cas locaux de validation et réponses du service sont vérifiés avec des réponses simulées, distinctement de la livraison réelle.

## Refonte smartphone

Sous 700 px : menu dépliant au lieu des liens comprimés, sections et études en une colonne, textes courants de 16 px, marges de 24 px, filtres qui passent à la ligne, légendes à hauteur naturelle. Les commandes de quantité et de retrait sont séparées et les fenêtres produit/galerie/formulaire utilisent la largeur de l’écran. La galerie place ses flèches dans une rangée distincte de l’image et de sa légende.

Contrôles : syntaxe des modules et imports, liens locaux, absence du PDF technique courant et six cas de formulaire avec réponses simulées. L’émulation Chrome a été ouverte à 400 px, mais les captures et actions suivantes ont rencontré des erreurs ScreenCaptureKit et des changements de fenêtre ; aucun contrôle visuel mobile complet n’est revendiqué.
