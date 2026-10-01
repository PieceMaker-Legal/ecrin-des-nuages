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

Les deux fiches proposées sont les pièces photographiées : la table basse vert feuille et la table haute bleu ciel. Le devis se demande depuis ces fiches et depuis les photographies qui les montrent. Les teintes seulement dessinées et les assemblages à plusieurs verres restent des pistes, sans devis. Le site ne comporte pas de prix, quantité disponible ni caractéristique matière non confirmés.

## Inventaire des ressources

- Les 18 photographies de la galerie sont `assets/photo-1.webp` à `assets/photo-16.webp`, `assets/table-basse.webp` et `assets/table-basse-collectif.webp`. Chaque visuel apparaît dans la galerie et conserve sa légende et son crédit.
- Les six rendus `assets/nuage-render-000.webp` à `assets/nuage-render-005.webp` apparaissent dans « La collection se dessine ». Ils montrent des teintes et des assemblages à un, deux et quatre verres, sans devis.
- Les deux dessins `assets/plan-table-basse.webp` et `assets/eclate-table-basse.webp` restent visibles, sans lien de téléchargement. Le dossier technique n’est pas publié. Le PDF `documents/collection-ecrin-des-nuages.pdf` reste dans le dépôt, sans lien depuis l’interface.
- Le dossier de presse a servi à rédiger l’histoire du projet et la présentation du collectif. Les CV, téléphones et autres coordonnées privées du dossier n’ont pas été reproduits.

## Réception des demandes

`config.js` contient `inquiryRecipient`, actuellement `sardet.camille@gmail.com`. L’envoi utilise l’API AJAX officielle de FormSubmit, sans clé privée dans le site. L’adresse destinataire doit être activée via le lien de confirmation envoyé par FormSubmit lors du premier envoi. Aucune réception réelle n’a été testée tant que cette validation n’est pas effectuée.

Le formulaire exige au moins un moyen de contact et un message. Il conserve les champs en cas d’erreur ou d’expiration de la requête, bloque les doubles clics et affiche un succès uniquement après une réponse positive du service. Les demandes ne sont pas stockées dans le navigateur. La sélection reste enregistrée indépendamment.
