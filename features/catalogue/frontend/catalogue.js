import { products } from './products.js';
import { syncDialogState } from '../../frontend/dialog-state.js';

const grid = document.querySelector('[data-product-grid]');
const dialog = document.querySelector('[data-product-dialog]');
let activeType = 'all';
let activeColor = 'all';
let currentProduct = products[0];
let galleryIndex = 0;
let productReturnFocus = null;
let renderedVariantKind = null;

function renderProducts() {
  const visible = products.filter(item => (activeType === 'all' || item.kind === activeType) && (activeColor === 'all' || item.color === activeColor));
  document.querySelectorAll('[data-filter-type]').forEach(button => {
    const type = button.dataset.filterType;
    const count = products.filter(item => (type === 'all' || item.kind === type) && (activeColor === 'all' || item.color === activeColor)).length;
    button.querySelector('[data-filter-count]').textContent = String(count).padStart(2, '0');
  });
  document.querySelector('[data-results-count]').textContent = `${visible.length} ${visible.length === 1 ? 'pièce affichée' : 'pièces affichées'} · prix sur demande`;
  grid.innerHTML = visible.length ? visible.map(item => `
    <article class="product-card">
      <div class="product-image${item.caption ? ' product-image-render' : ''}">
        <img src="${item.image}" alt="${item.alt}" loading="lazy">
        <span class="product-tag">${item.kindLabel} · ${item.colorLabel}</span>
        <button class="product-open" type="button" data-product-id="${item.id}" aria-label="Voir la fiche : ${item.kindLabel}, ${item.colorLabel}">Voir la fiche</button>
      </div>
      <div class="product-caption">
        <div><h3 class="product-title">${item.kindLabel} <span aria-hidden="true">—</span> ${item.colorLabel}</h3><p class="product-meta">Verre récupéré · Nanterre</p>${item.caption ? `<p class="product-meta">${item.caption}</p>` : ''}<div class="product-colors" aria-label="Teinte ${item.colorLabel}"><span class="swatch ${item.color}" aria-hidden="true"></span></div></div>
        <span class="product-price">Sur demande</span>
      </div>
    </article>`).join('') : '<p class="collection-empty">Cette association n’est pas proposée. Les pièces disponibles sont la table basse vert feuille et la table haute bleu ciel.</p>';
}

function updateProductContent(product) {
  currentProduct = product;
  galleryIndex = 0;
  document.querySelector('[data-dialog-title]').textContent = `${product.kindLabel} · ${product.colorLabel}`;
  document.querySelector('[data-dialog-kicker]').textContent = `Écrin des Nuages · ${product.kindLabel}`;
  document.querySelector('[data-dialog-description]').textContent = product.description;
  const specs = [['Dimensions', product.dimensions]];
  if (product.material) specs.push(['Matériaux', product.material]);
  specs.push(['Prix', 'Sur demande']);
  document.querySelector('[data-dialog-specs]').innerHTML = specs.map(([key,value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join('');
  const colors = products.filter(item => item.kind === product.kind);
  const variants = document.querySelector('[data-dialog-variants]');
  variants.closest('fieldset').hidden = colors.length < 2;
  if (renderedVariantKind !== product.kind) {
    variants.innerHTML = colors.map(item => `<label class="variant-option"><input type="radio" name="product-color" value="${item.id}"><span class="swatch ${item.color}" aria-hidden="true"></span>${item.colorLabel}</label>`).join('');
    renderedVariantKind = product.kind;
  }
  variants.querySelectorAll('input').forEach(input => { input.checked = input.value === product.id; });
  setGalleryImage();
}

function showProduct(product) {
  productReturnFocus = document.activeElement;
  updateProductContent(product);
  dialog.showModal();
  syncDialogState();
  document.querySelector('[data-close-product]').focus();
}

function setGalleryImage() {
  const image = document.querySelector('[data-dialog-image]');
  image.src = currentProduct.gallery[galleryIndex];
  image.alt = currentProduct.galleryAlt[galleryIndex];
  document.querySelector('[data-gallery-count]').textContent = `${String(galleryIndex + 1).padStart(2,'0')} / ${String(currentProduct.gallery.length).padStart(2,'0')}`;
}

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-product-id]');
  if (button) showProduct(products.find(item => item.id === button.dataset.productId));
});
document.querySelectorAll('[data-filter-type]').forEach(button => button.addEventListener('click', () => {
  activeType = button.dataset.filterType;
  document.querySelectorAll('[data-filter-type]').forEach(item => { const active = item === button; item.classList.toggle('is-active',active); item.setAttribute('aria-pressed',String(active)); });
  renderProducts();
}));
document.querySelector('[data-filter-color]').addEventListener('change', event => { activeColor = event.target.value; renderProducts(); });
document.querySelector('[data-close-product]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', syncDialogState);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('keydown', event => {
  if (!dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    galleryIndex = (galleryIndex + (event.key === 'ArrowRight' ? 1 : -1) + currentProduct.gallery.length) % currentProduct.gallery.length;
    setGalleryImage();
  }
});
document.querySelector('[data-gallery-prev]').addEventListener('click', () => { galleryIndex = (galleryIndex - 1 + currentProduct.gallery.length) % currentProduct.gallery.length; setGalleryImage(); });
document.querySelector('[data-gallery-next]').addEventListener('click', () => { galleryIndex = (galleryIndex + 1) % currentProduct.gallery.length; setGalleryImage(); });
document.querySelector('[data-dialog-variants]').addEventListener('change', event => { if (event.target.matches('input')) updateProductContent(products.find(item => item.id === event.target.value)); });
document.querySelector('[data-add-to-cart]').addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('ecrin:add-to-cart', {detail: {productId: currentProduct.id, returnFocus: productReturnFocus}}));
  dialog.close();
  document.querySelector('[data-cart-dialog]').showModal();
  syncDialogState();
  document.querySelector('[data-close-cart]').focus();
});
renderProducts();
