/*
 * Liens de paiement Stripe facultatifs.
 * Renseigner chaque clé uniquement avec un Payment Link actif de production
 * (URL https://buy.stripe.com/...). Les valeurs null désactivent le paiement.
 */
window.ECRIN_CONFIG = {
  inquiryRecipient: 'sardet.camille@gmail.com',
  paymentLinks: {
    'table-basse-vert': null,
    'table-basse-bleu': null,
    'table-basse-bleu-2': null,
    'table-haute-bleu': null,
    'table-haute-vert': null,
    'table-haute-bleu-2': null,
    'table-haute-vert-2': null,
    'table-haute-bleu-4': null
  }
};
