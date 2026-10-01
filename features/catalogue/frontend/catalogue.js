import { products } from './products.js';
import { syncDialogState } from '../../frontend/dialog-state.js';

const grid = document.querySelector('[data-product-grid]');
const dialog = document.querySelector('[data-product-dialog]');
let currentProduct = products[0];
let galleryIndex = 0;
let productReturnFocus = null;
let renderedVariantKind = null;

function specs(product) {
  const rows = [['Dimensions', product.dimensions]];
  if (product.material) rows.push(['Matériaux', product.material]);
  rows.push(['Prix', 'Sur demande']);
  return rows.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join('');
}

function renderProducts() {
  grid.innerHTML = products.map(item => `
    <article class="product-card">
      <div class="product-image">
        <img src="${item.image}" srcset="${item.image.replace('assets/', 'assets/thumbs/')} 800w, ${item.image} 1200w" sizes="(max-width: 760px) 100vw, 50vw" width="1200" height="1800" alt="${item.alt}" loading="lazy">
        <span class="product-tag">${item.gallery.length} photographies</span>
      </div>
      <div class="product-caption">
        <div>
          <h3 class="product-title"><button class="product-open" type="button" data-product-id="${item.id}" aria-haspopup="dialog">${item.kindLabel} <span aria-hidden="true">—</span> ${item.colorLabel}</button></h3>
          <p class="product-sub"><span class="swatch ${item.color}" aria-hidden="true"></span>Verre récupéré · Nanterre</p>
        </div>
        <span class="product-price">Sur demande</span>
        <span class="product-cta" aria-hidden="true">Dimensions et devis <span>→</span></span>
      </div>
    </article>`).join('');
}

function updateProductContent(product) {
  currentProduct = product;
  galleryIndex = 0;
  document.querySelector('[data-dialog-title]').textContent = `${product.kindLabel} · ${product.colorLabel}`;
  document.querySelector('[data-dialog-kicker]').textContent = `Écrin des Nuages · ${product.kindLabel}`;
  document.querySelector('[data-dialog-description]').textContent = product.description;
  document.querySelector('[data-dialog-specs]').innerHTML = specs(product);
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
  window.dispatchEvent(new CustomEvent('ecrin:add-to-cart', {detail: {productId: currentProduct.id, returnFocus: productReturnFocus, keepQuantity: true}}));
  dialog.close();
  document.querySelector('[data-cart-dialog]').showModal();
  syncDialogState();
  document.querySelector('[data-quote-link]').focus();
});
renderProducts();
