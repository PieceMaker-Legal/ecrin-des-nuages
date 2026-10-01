# Écrin des Nuages

Site statique en HTML, CSS et JavaScript natifs. Aucun outil de compilation ni dépendance externe n’est nécessaire.

## Prévisualiser

Lancer un serveur statique depuis ce dossier (par exemple `python3 -m http.server 8000`) puis visiter `http://localhost:8000`. Le serveur est nécessaire au chargement des modules JavaScript du site.

## Publier sur GitHub Pages

Publier le contenu du dossier `ecrin-des-nuages` depuis la branche et le répertoire choisis dans les réglages Pages du dépôt. Le fichier `.nojekyll` permet de publier les dossiers de modules tels quels. Le site utilise des chemins relatifs pour ses images et scripts.

## Activer un paiement Stripe plus tard

Le paiement en ligne n’est pas activé. La sélection prépare une demande de prix et de disponibilité par courriel ; elle ne représente pas une commande.

Pour activer un paiement, créer d’abord dans Stripe un Payment Link de production pour chaque variante, avec le prix et les conditions validés. Dans `config.js`, remplacer la valeur `null` correspondante par le lien `https://buy.stripe.com/...` :

```js
paymentLinks: {
  'table-basse-vert': 'https://buy.stripe.com/…',
  'table-basse-bleu': null,
  'table-haute-vert': null,
  'table-haute-bleu': null
}
```

Seuls les liens de production sous `buy.stripe.com` sont affichés. Une pièce peut alors être payée depuis sa ligne dans la sélection. Pour plusieurs exemplaires ou variantes, le parcours renvoie à une demande de devis afin que les quantités et disponibilités soient confirmées.

## Contenus

Les quatre fiches correspondent aux tables basse et haute, en vert feuille et bleu ciel. Les visuels issus des dessins de collection sont identifiés comme « Vue de collection ». Les autres idées de mobilier figurant dans le dossier restent des pistes en cours de dessin et ne sont pas proposées comme produits. Le site ne comporte pas de prix, quantité disponible ni caractéristique matière non confirmés.
