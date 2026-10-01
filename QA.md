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

Contrôles statiques effectués : cohérence des imports des modules, présence des 18 photographies, six rendus, deux plans et liens vers les deux PDF publiés. Le dossier de presse a servi de source pour le récit et les crédits ; son PDF n’est pas publié.

La capture navigateur n’était pas disponible pendant cette revue. Contrôles manuels recommandés avant publication : affichage catalogue et portrait sur ordinateur et mobile ; défilement de la navigation étroite ; filtres et compteurs ; navigation de la galerie ; ouverture/fermeture au clavier des dialogs ; conservation du focus pendant le changement de teinte et les quantités ; ajout, retrait, persistance et limite de sélection.
