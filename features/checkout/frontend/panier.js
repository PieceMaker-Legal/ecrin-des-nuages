import { products } from '../../catalogue/frontend/products.js';
import { syncDialogState } from '../../frontend/dialog-state.js';

const cartDialog = document.querySelector('[data-cart-dialog]');
const cartItems = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const cartFooter = document.querySelector('[data-cart-footer]');
const countNode = document.querySelector('[data-cart-count]');
const storageKey = 'ecrin-des-nuages-selection-v1';
const maxQuantity = 20;
const paymentLinks = window.ECRIN_CONFIG?.paymentLinks || {};
const productIds = new Set(products.map(product => product.id));
let cart = readCart();
let cartReturnFocus = null;

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([id, quantity]) =>
      productIds.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= maxQuantity
    ));
  } catch {
    return {};
  }
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function safePaymentLink(id) {
  const link = paymentLinks[id];
  if (typeof link !== 'string') return null;
  try {
    const url = new URL(link);
    const validPath = /^\/[A-Za-z0-9]+$/.test(url.pathname) && !url.pathname.startsWith('/test_');
    if (url.protocol !== 'https:' || url.hostname !== 'buy.stripe.com' || url.username || url.password || url.search || url.hash || !validPath) return null;
    return url.href;
  } catch {
    return null;
  }
}

function buildQuoteUrl() {
  const lines = Object.entries(cart).map(([id, quantity]) => {
    const product = getProduct(id);
    return `• ${product.kindLabel} — ${product.colorLabel} × ${quantity}`;
  }).join('\n');
  const subject = 'Demande de disponibilité — Écrin des Nuages';
  const body = `Bonjour Anaïs,\n\nJe souhaiterais connaître le prix et la disponibilité des pièces suivantes :\n\n${lines}\n\nMerci !`;
  return `mailto:af@anaisfernon.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function renderCart(restoreFocus = null) {
  const entries = Object.entries(cart);
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  countNode.textContent = String(count);
  countNode.setAttribute('aria-label', `${count} ${count === 1 ? 'pièce' : 'pièces'} dans la sélection`);
  cartEmpty.hidden = count > 0;
  cartItems.hidden = count === 0;
  cartFooter.hidden = count === 0;

  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = getProduct(id);
    const paymentLink = safePaymentLink(id);
    const productName = `${product.kindLabel.toLowerCase()} ${product.colorLabel.toLowerCase()}`;
    return `<article class="cart-row">
      <img src="${product.image}" alt="${product.alt}">
      <div class="cart-row-content">
        <h3>${product.kindLabel}</h3>
        <p>${product.colorLabel} · Prix sur demande</p>
        <div class="cart-row-actions">
          <div class="quantity-control" role="group" aria-label="Quantité : ${productName}">
            <button type="button" data-quantity="minus" data-id="${id}" aria-label="Retirer une ${productName}">−</button>
            <span aria-live="polite">${quantity}</span>
            <button type="button" data-quantity="plus" data-id="${id}" aria-label="Ajouter une ${productName}" ${quantity >= maxQuantity ? 'disabled' : ''}>+</button>
          </div>
          <button class="remove-item" type="button" data-remove="${id}" aria-label="Retirer la ${productName} de la sélection">Retirer</button>
        </div>
        ${paymentLink ? `<div class="stripe-row"><span class="product-meta">Paiement en ligne · 1 pièce</span>${quantity === 1 ? `<a class="button-dark" href="${paymentLink}" target="_blank" rel="noopener noreferrer">Acheter cette pièce <span aria-hidden="true">↗</span></a>` : '<p class="product-meta">Pour payer en ligne, choisissez une pièce à la fois.</p>'}</div>` : ''}
      </div>
    </article>`;
  }).join('');

  document.querySelector('[data-quote-link]').href = buildQuoteUrl();
  const stripeActive = entries.some(([id]) => safePaymentLink(id));
  document.querySelector('[data-stripe-note]').textContent = stripeActive
    ? 'Vous pouvez régler une pièce depuis sa ligne, ou demander les disponibilités de toute la sélection.'
    : 'Votre message préparera une demande de prix et de disponibilité, sans engagement.';

  if (restoreFocus) {
    const [id, action] = restoreFocus;
    const button = cartItems.querySelector(`[data-id="${id}"][data-quantity="${action}"]:not(:disabled)`);
    (button || cartItems.querySelector('[data-remove]') || document.querySelector('[data-close-cart]')).focus();
  }
}

function saveCart(restoreFocus = null) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch {
    // La sélection reste active en mémoire si le navigateur bloque le stockage.
  }
  renderCart(restoreFocus);
}

function openCart(returnFocus = document.activeElement) {
  cartReturnFocus = returnFocus;
  cartDialog.showModal();
  syncDialogState();
  document.querySelector('[data-close-cart]').focus();
}

document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => openCart(button)));
document.querySelector('[data-close-cart]').addEventListener('click', () => cartDialog.close());
document.querySelector('[data-close-cart-link]').addEventListener('click', () => cartDialog.close());
cartDialog.addEventListener('close', () => {
  syncDialogState();
  if (cartReturnFocus?.isConnected) cartReturnFocus.focus();
  cartReturnFocus = null;
});
cartDialog.addEventListener('click', event => {
  if (event.target !== cartDialog) return;
  const rect = cartDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cartDialog.close();
});

cartItems.addEventListener('click', event => {
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    delete cart[removeButton.dataset.remove];
    saveCart();
    (cartItems.querySelector('[data-remove]') || document.querySelector('[data-close-cart]')).focus();
    return;
  }
  if (!quantityButton) return;

  const { id, quantity: action } = quantityButton.dataset;
  if (!productIds.has(id) || !Number.isInteger(cart[id])) return;
  if (action === 'plus' && cart[id] < maxQuantity) cart[id] += 1;
  if (action === 'minus') cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  saveCart([id, action]);
});

window.addEventListener('ecrin:add-to-cart', event => {
  const { productId, returnFocus } = event.detail || {};
  if (!productIds.has(productId)) return;
  cartReturnFocus = returnFocus?.isConnected ? returnFocus : document.querySelector('[data-open-cart]');
  const quantity = cart[productId] || 0;
  if (quantity < maxQuantity) cart[productId] = quantity + 1;
  saveCart();
});

window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) {
    cart = readCart();
    renderCart();
  }
});

renderCart();
