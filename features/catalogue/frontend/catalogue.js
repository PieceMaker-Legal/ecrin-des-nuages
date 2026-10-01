export const products = [
  {
    id: 'table-basse-vert', kind: 'basse', kindLabel: 'Table basse', color: 'vert', colorLabel: 'Vert feuille',
    image: 'assets/photo-3.webp', alt: 'Table basse Écrin des Nuages, verre feuille de sauge et structure vert feuille',
    gallery: ['assets/photo-3.webp','assets/table-basse.webp','assets/photo-7.webp'],
    galleryAlt: ['Table basse vert feuille','Vue de la table basse','Détail du verre feuille de sauge'],
    description: 'Une table basse qui révèle le contour organique du verre récupéré. Chaque pièce compose avec les marques et les nuances de son fragment architectural.',
    dimensions: 'L 129,7 × l 110,9 × h 40,2 cm', material: 'Verre trempé récupéré et structure en bois', caption: ''
  },
  {
    id: 'table-basse-bleu', kind: 'basse', kindLabel: 'Table basse', color: 'bleu', colorLabel: 'Bleu ciel',
    image: 'assets/nuage-render-000.webp', alt: 'Vue de collection de la table basse Écrin des Nuages en teinte bleu ciel',
    gallery: ['assets/nuage-render-000.webp','assets/photo-4.webp','assets/photo-5.webp'],
    galleryAlt: ['Vue de collection de la table basse bleu ciel','Deux tables Écrin des Nuages réunies','Deux tables Écrin des Nuages réunies'],
    description: 'La silhouette de la table basse se décline en bleu ciel. Le visuel principal est une vue de collection ; les photographies complémentaires présentent les tables dans leur ensemble.',
    dimensions: 'L 129,7 × l 110,9 × h 40,2 cm', material: 'Verre trempé récupéré et structure en bois', caption: 'Vue de collection'
  },
  {
    id: 'table-haute-vert', kind: 'haute', kindLabel: 'Table haute', color: 'vert', colorLabel: 'Vert feuille',
    image: 'assets/nuage-render-001.webp', alt: 'Vue de collection de la table haute Écrin des Nuages en teinte vert feuille',
    gallery: ['assets/nuage-render-001.webp','assets/photo-4.webp','assets/photo-15.webp'],
    galleryAlt: ['Vue de collection de la table haute vert feuille','Deux tables Écrin des Nuages réunies','Mobilier Écrin des Nuages en situation'],
    description: 'La table haute reprend le dessin du verre « feuille de sauge ». Le visuel principal est une vue de collection ; les photographies complémentaires montrent le mobilier en situation.',
    dimensions: 'L 124 × l 113 × h 75 cm', caption: 'Vue de collection'
  },
  {
    id: 'table-haute-bleu', kind: 'haute', kindLabel: 'Table haute', color: 'bleu', colorLabel: 'Bleu ciel',
    image: 'assets/photo-2.webp', alt: 'Table haute Écrin des Nuages en bleu ciel, verre feuille de sauge et structure en bois',
    gallery: ['assets/photo-2.webp','assets/photo-4.webp','assets/photo-8.webp'],
    galleryAlt: ['Table haute bleu ciel','Deux tables Écrin des Nuages réunies','Détail du mobilier'],
    description: 'La première table autoproduite, présentée à Paris Design Week Factory en 2025. Sa structure accueille le verre à fleur et reprend le dessin des anciennes fixations.',
    dimensions: 'L 124 × l 113 × h 75 cm', material: 'Bois de hêtre huilé teinté bleu ciel, verre trempé et platines aluminium', caption: ''
  }
];

const grid = document.querySelector('[data-product-grid]');
const dialog = document.querySelector('[data-product-dialog]');
const scrim = document.querySelector('[data-scrim]');
let activeType = 'all';
let activeColor = 'all';
let currentProduct = products[0];
let galleryIndex = 0;

function renderProducts() {
  const visible = products.filter(item => (activeType === 'all' || item.kind === activeType) && (activeColor === 'all' || item.color === activeColor));
  grid.innerHTML = visible.map(item => `
    <article class="product-card">
      <div class="product-image">
        <img src="${item.image}" alt="${item.alt}" loading="lazy">
        <span class="product-tag">${item.kindLabel} · ${item.colorLabel}</span>
        <button class="product-open" type="button" data-product-id="${item.id}" aria-label="Voir la fiche : ${item.kindLabel}, ${item.colorLabel}">Voir la fiche</button>
      </div>
      <div class="product-caption">
        <div><h3 class="product-title">${item.kindLabel} <span aria-hidden="true">—</span> ${item.colorLabel}</h3><p class="product-meta">Verre récupéré · Nanterre</p>${item.caption ? `<p class="product-meta">${item.caption}</p>` : ''}<div class="product-colors" aria-label="Teinte ${item.colorLabel}"><span class="swatch ${item.color}" aria-hidden="true"></span></div></div>
        <span class="product-price">Sur demande</span>
      </div>
    </article>`).join('');
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
  document.querySelector('[data-dialog-variants]').innerHTML = colors.map(item => `<label class="variant-option"><input type="radio" name="product-color" value="${item.id}" ${item.id === product.id ? 'checked' : ''}><span class="swatch ${item.color}" aria-hidden="true"></span>${item.colorLabel}</label>`).join('');
  setGalleryImage();
}

function showProduct(product) {
  updateProductContent(product);
  dialog.showModal();
  document.body.classList.add('dialog-open');
  scrim.hidden = false;
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
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); if (!document.querySelector('[data-cart-dialog]').open) scrim.hidden = true; });
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
  window.dispatchEvent(new CustomEvent('ecrin:add-to-cart', {detail: {productId: currentProduct.id}}));
  dialog.close();
  document.querySelector('[data-cart-dialog]').showModal();
  document.body.classList.add('dialog-open');
  scrim.hidden = false;
  document.querySelector('[data-close-cart]').focus();
});
renderProducts();
