# Revue de mise en page et interactions

## Refonte du 1er octobre 2026

La feuille de style a été réécrite en une seule passe (elle empilait plusieurs séries de correctifs), la page réorganisée et les contenus recalés sur les ressources.

- Collection : les deux pièces sont présentées en grand, avec dimensions, matériaux, bouton de devis et accès à la fiche. Les filtres ont été retirés, ils n’avaient pas d’utilité pour deux pièces.
- Le projet : repères chiffrés tirés du dossier de presse et du dossier technique (18 tours, 1973 – 1981, 1 607 logements, verre de 120 × 106 cm).
- Dessins d’étude : libellés corrigés d’après la planche de collection (trois vues portaient une teinte ou un type erroné).
- Galerie : 17 photographies, la photographie fournie en double n’apparaît plus qu’une fois. Vignettes allégées, ouverture plein écran, balayage tactile.
- En-tête fixe, pied de page complété, balises de partage, dimensions des images déclarées.
- Une demande de devis répétée sur la même pièce n’ajoute plus un exemplaire à chaque clic.

## Contrôles effectués

Chrome sans interface, pilotage automatisé, site servi en local.

- Largeurs 320, 360, 390, 768, 1024 et 1440 px : aucun débordement horizontal, aucune erreur dans la console. Avant la refonte, la page débordait de 11 px à 390 px.
- Liens et boutons : hauteur d’au moins 44 px à toutes ces largeurs.
- À 320 et 390 px : menu, fiche pièce, sélection, formulaire, galerie et dessin d’étude ouverts et capturés.
- Téléphone : `0612345678`, `06.12.34.56.78`, `+33 6 12 34 56 78`, `0033612345678` et `+33 (0)6 12 34 56 78` donnent `06 12 34 56 78` ; `+44 20 7946 0958` est accepté ; `06 12 34`, `061234567890`, `abc`, `0012` et `1234567890` sont refusés.

## Non vérifié

- Aucun envoi réel : les réponses de FormSubmit ont été simulées. La réception dépend de l’activation de l’adresse destinataire.
- Aucun essai sur un téléphone physique ni dans Safari ou Firefox.
- La page publiée sur GitHub Pages n’a pas été contrôlée.
