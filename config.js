/*
 * Liens de paiement Stripe facultatifs.
 * Renseigner chaque clé uniquement avec un Payment Link actif de production
 * (URL https://buy.stripe.com/...). Les valeurs null désactivent le paiement.
 */
window.ECRIN_CONFIG = {
  paymentLinks: {
    'table-basse-vert': null,
    'table-basse-bleu': null,
    'table-haute-vert': null,
    'table-haute-bleu': null
  }
};
