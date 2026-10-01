# Revue de mise en page et interactions

## Refonte du 1er octobre 2026

La feuille de style a été réécrite en une seule passe (elle empilait plusieurs séries de correctifs), la page réorganisée et les contenus recalés sur les ressources.

- Collection : deux cartes entièrement cliquables. La fiche s’ouvre en fenêtre avec les dimensions, les matériaux et le bouton de demande de devis.
- Le projet : repères chiffrés tirés du dossier de presse et du dossier technique (18 tours, 1973 – 1981, 1 607 logements, verre de 120 × 106 cm).
- Dessins d’étude : libellés corrigés d’après la planche de collection (trois vues portaient une teinte ou un type erroné).
- Galerie : une seule slide, mosaïque de 10 photographies avec une vue large et une vue mise en avant, sans boutons de catégories, apparition en cascade, légende au survol, ouverture plein écran et balayage tactile.
- Slides : chaque section tient dans la hauteur visible sous l’en-tête (accueil, collection, projet avec ses repères chiffrés sous la photographie — en deux slides sur mobile —, verre, dessins, études, galerie, créatrices, contact). Les images absorbent la hauteur restante ; `features/frontend/slides.js` réduit le contenu d’une slide qui dépasserait encore. Mesuré à 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, 360×740 et 320×568 : aucune slide ne dépasse. Sur un téléphone à l’horizontale (844×390), la slide des créatrices reprend une hauteur libre.
- Flèches des boutons : `→` et `↓` en texte, à la place des flèches diagonales que les téléphones affichaient en emoji.
- Aucune photographie n’apparaît deux fois sur la page : celles de l’accueil, des cartes, du projet, du verre et de l’équipe ne sont pas reprises dans la galerie, et les deux fiches n’ont aucune photographie en commun.
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
