import { products } from '../../catalogue/frontend/catalogue.js';

const cartDialog = document.querySelector('[data-cart-dialog]');
const cartItems = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const cartFooter = document.querySelector('[data-cart-footer]');
const countNode = document.querySelector('[data-cart-count]');
const backdrop = document.querySelector('[data-scrim]');
const storageKey = 'ecrin-des-nuages-selection-v1';
const paymentLinks = window.ECRIN_CONFIG?.paymentLinks || {};
let cart = readCart();

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return Object.fromEntries(Object.entries(parsed).filter(([id, qty]) => products.some(item => item.id === id) && Number.isInteger(qty) && qty > 0));
  } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* Le panier reste utilisable en mémoire si le navigateur bloque le stockage. */ }
  renderCart();
}
function getProduct(id) { return products.find(item => item.id === id); }
function safePaymentLink(id) {
  const link = paymentLinks[id];
  if (typeof link !== 'string') return null;
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com' || url.username || url.password || url.search || url.hash) return null;
    if (!/^\/[A-Za-z0-9]+$/.test(url.pathname) || url.pathname.startsWith('/test_')) return null;
    return url.href;
  } catch { return null; }
}
function quoteUrl() {
  const lines = Object.entries(cart).map(([id,qty]) => { const p=getProduct(id); return `• ${p.kindLabel} — ${p.colorLabel} × ${qty}`; }).join('\n');
  const subject = 'Demande de disponibilité — Écrin des Nuages';
  const body = `Bonjour Anaïs,\n\nJe souhaiterais connaître le prix et la disponibilité des pièces suivantes :\n\n${lines}\n\nMerci !`;
  return `mailto:af@anaisfernon.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((sum,[,qty]) => sum + qty,0);
  countNode.textContent = String(count);
  countNode.setAttribute('aria-label', `${count} ${count === 1 ? 'pièce' : 'pièces'} dans la sélection`);
  cartEmpty.hidden = count > 0;
  cartItems.hidden = count === 0;
  cartFooter.hidden = count === 0;
  cartItems.innerHTML = entries.map(([id,qty]) => {
    const p=getProduct(id); const link=safePaymentLink(id);
    return `<article class="cart-row">
      <img src="${p.image}" alt="${p.alt}">
      <div><h3>${p.kindLabel}</h3><p>${p.colorLabel} · Prix sur demande</p>
        <div class="cart-row-actions"><span class="quantity-control" aria-label="Quantité">
          <button type="button" data-quantity="minus" data-id="${id}" aria-label="Retirer une pièce">−</button><span>${qty}</span><button type="button" data-quantity="plus" data-id="${id}" aria-label="Ajouter une pièce">+</button>
        </span><button class="remove-item" type="button" data-remove="${id}">Retirer</button></div>
        ${link ? `<div class="stripe-row"><span class="product-meta">Paiement en ligne · 1 pièce</span>${qty === 1 ? `<a class="button-dark" href="${link}" target="_blank" rel="noopener noreferrer">Acheter cette pièce <span aria-hidden="true">↗</span></a>` : '<p class="product-meta">Pour payer en ligne, choisissez une pièce à la fois.</p>'}</div>` : ''}
      </div>
    </article>`;
  }).join('');
  document.querySelector('[data-quote-link]').href = quoteUrl();
  const stripeActive = entries.some(([id]) => safePaymentLink(id));
  document.querySelector('[data-stripe-note]').textContent = stripeActive ? 'Vous pouvez régler une pièce depuis sa ligne, ou demander les disponibilités de toute la sélection.' : 'Votre message préparera une demande de prix et de disponibilité, sans engagement.';
}

document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => {
  cartDialog.showModal(); document.body.classList.add('dialog-open'); backdrop.hidden = false; document.querySelector('[data-close-cart]').focus();
}));
document.querySelector('[data-close-cart]').addEventListener('click', () => cartDialog.close());
document.querySelector('[data-close-cart-link]').addEventListener('click', () => cartDialog.close());
cartDialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (!document.querySelector('[data-product-dialog]').open) backdrop.hidden = true; });
cartDialog.addEventListener('click', event => {
  if (event.target !== cartDialog) return;
  const rect = cartDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cartDialog.close();
});
cartItems.addEventListener('click', event => {
  const quantityButton=event.target.closest('[data-quantity]');
  const removeButton=event.target.closest('[data-remove]');
  if (removeButton) { delete cart[removeButton.dataset.remove]; saveCart(); }
  if (quantityButton) {
    const id=quantityButton.dataset.id;
    cart[id] += quantityButton.dataset.quantity === 'plus' ? 1 : -1;
    if (cart[id] < 1) delete cart[id];
    saveCart();
  }
});
window.addEventListener('ecrin:add-to-cart', event => { const id=event.detail.productId; cart[id]=(cart[id]||0)+1; saveCart(); });
window.addEventListener('storage', event => { if (event.key === storageKey) { cart=readCart(); renderCart(); } });
renderCart();
