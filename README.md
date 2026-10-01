# Écrin des Nuages

Site statique en HTML, CSS et JavaScript natifs. Aucun outil de compilation ni dépendance externe n’est nécessaire.

## Prévisualiser

Lancer un serveur statique depuis ce dossier (par exemple `python3 -m http.server 8000`) puis visiter `http://localhost:8000`. Le serveur est nécessaire au chargement des modules JavaScript du site.

## Publier sur GitHub Pages

Publier le contenu du dossier `ecrin-des-nuages` depuis la branche et le répertoire choisis dans les réglages Pages du dépôt. Le fichier `.nojekyll` permet de publier les dossiers de modules tels quels. Le site utilise des chemins relatifs pour ses images et scripts.

## Activer un paiement Stripe plus tard

Le paiement en ligne n’est pas activé. La sélection ouvre un formulaire intégré qui demande une adresse e-mail et/ou un téléphone, un message et transmet les pièces sélectionnées via FormSubmit ; elle ne représente pas une commande.

La sélection accepte jusqu’à 20 exemplaires par variante. Les entrées de stockage inconnues ou hors limites sont ignorées.

Pour activer un paiement, créer d’abord dans Stripe un Payment Link de production pour chaque variante, avec le prix et les conditions validés. Dans `config.js`, remplacer la valeur `null` correspondante par le lien `https://buy.stripe.com/...` :

```js
paymentLinks: {
  'table-basse-vert': 'https://buy.stripe.com/…',
  'table-haute-bleu': null
}
```

Seuls les liens de production sous `buy.stripe.com` sont affichés. Une pièce peut alors être payée depuis sa ligne dans la sélection. Pour plusieurs exemplaires ou variantes, le parcours renvoie à une demande de devis afin que les quantités et disponibilités soient confirmées.

## Contenus

Les deux fiches proposées sont les pièces photographiées : la table basse vert feuille et la table haute bleu ciel. Leurs dimensions et matériaux viennent du dossier technique (plan et vue éclatée de la table basse) et du dossier de presse (table haute). Le devis se demande depuis ces fiches et depuis les photographies qui les montrent. Les dessins d’étude à un, deux et quatre verres restent des pistes, sans devis. Le site ne comporte pas de prix, quantité disponible ni caractéristique matière non confirmés.

L’épaisseur et le poids du verre ne sont pas rédigés dans le site : le dossier technique donne deux valeurs différentes (8 mm et 36 kg sur la fiche du verre, 10 mm et 35 kg sur la vue éclatée).

## Inventaire des ressources

- Les 17 photographies du site sont `assets/photo-1.webp` à `assets/photo-16.webp` et `assets/table-basse-collectif.webp`. Chacune n’apparaît qu’une fois sur la page : la galerie montre les 10 qui ne servent pas déjà à l’accueil, aux cartes de la collection, au projet, au verre et à l’équipe. Les deux fichiers sources `Table-Nuage-Basse.jpg` et `Table-Nuage-Basse-@collectiffeuilledesauge.jpg` sont identiques à l’octet près : la photographie n’apparaît qu’une fois, créditée au Collectif Feuille de Sauge.
- `assets/thumbs/` contient les mêmes photographies en 800 px de large, utilisées pour les vignettes et les petits écrans. `assets/partage.jpg` est l’image d’aperçu des liens partagés.
- Les six rendus `assets/nuage-render-000.webp` à `assets/nuage-render-005.webp` apparaissent dans « La collection se dessine ». Leurs libellés suivent la planche de collection : tables basses à un et deux verres, tables hautes à un, deux et quatre verres, en bleu ciel ou vert feuille.
- Les deux dessins `assets/plan-table-basse.webp` et `assets/eclate-table-basse.webp` restent visibles, sans lien de téléchargement. Le dossier technique n’est pas publié. Le PDF `documents/collection-ecrin-des-nuages.pdf` reste dans le dépôt, sans lien depuis l’interface.
- Le dossier de presse a servi à rédiger l’histoire du projet, les repères chiffrés et la présentation du collectif. Les CV, téléphones et autres coordonnées privées du dossier n’ont pas été reproduits ; seules les trois adresses e-mail de contact de sa dernière page sont affichées.

## Réception des demandes

`config.js` contient `inquiryRecipient`, actuellement `sardet.camille@gmail.com`. L’envoi utilise l’API AJAX officielle de FormSubmit, sans clé privée dans le site. L’adresse destinataire doit être activée via le lien de confirmation envoyé par FormSubmit lors du premier envoi. Aucune réception réelle n’a été testée tant que cette validation n’est pas effectuée.

Le formulaire exige au moins un moyen de contact et un message. Le téléphone accepte un numéro français à 10 chiffres (remis en forme `06 12 34 56 78`, y compris saisi en `+33` ou `0033`) ou un numéro international précédé de `+` ; les autres saisies sont refusées avec un message sous le formulaire. Il conserve les champs en cas d’erreur ou d’expiration de la requête, bloque les doubles clics et affiche un succès uniquement après une réponse positive du service. Les demandes ne sont pas stockées dans le navigateur. La sélection reste enregistrée indépendamment.
