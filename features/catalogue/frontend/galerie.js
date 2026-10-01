import { products } from './products.js';
import { syncDialogState } from '../../frontend/dialog-state.js';

// Chaque photographie n’apparaît qu’une fois sur la page : celles de l’accueil, des cartes de la
// collection, du projet, du verre et de l’équipe ne sont pas reprises ici.
const photos = [
  ['assets/photo-5.webp','Les deux tables en dialogue avec les verres de la façade','© Luc Bertrand',['table-basse-vert','table-haute-bleu'],'situation'],
  ['assets/photo-6.webp','Les tables à l’échelle de la façade des Tours Nuages','© Luc Bertrand',['table-basse-vert','table-haute-bleu'],'situation'],
  ['assets/photo-8.webp','Détail de l’assemblage du verre et du bois','© Luc Bertrand',['table-basse-vert'],'detail'],
  ['assets/photo-9.webp','Détail du bois teinté vert et de ses fixations','© Luc Bertrand',['table-basse-vert'],'detail'],
  ['assets/photo-11.webp','Détail du plateau en verre et d’un piétement','© Luc Bertrand',['table-basse-vert'],'detail'],
  ['assets/photo-12.webp','Détail de la table haute et de son verre','© Luc Bertrand',['table-haute-bleu'],'detail'],
  ['assets/photo-13.webp','Détail de la jonction entre verre et structure','© Luc Bertrand',['table-basse-vert','table-haute-bleu'],'detail'],
  ['assets/photo-14.webp','Piètements de la table haute et de la table basse','© Luc Bertrand',['table-basse-vert','table-haute-bleu'],'detail'],
  ['assets/photo-15.webp','Deux tables sous les fenêtres feuille de sauge','© Luc Bertrand',['table-basse-vert','table-haute-bleu'],'situation'],
  ['assets/table-basse-collectif.webp','Une table basse Écrin des Nuages sous une fenêtre feuille de sauge','© Collectif Feuille de Sauge',[],'situation']
];
const filters = [
  ['all','Toutes', () => true],
  ['situation','En situation', photo => photo[4] === 'situation'],
  ['detail','Détails', photo => photo[4] === 'detail'],
  ['table-basse-vert','Table basse', photo => photo[3].includes('table-basse-vert')],
  ['table-haute-bleu','Table haute', photo => photo[3].includes('table-haute-bleu')]
];
const studies = [
  ['assets/nuage-render-000.webp','Table basse · 1 verre','Bleu ciel','Dessin d’étude'],
  ['assets/nuage-render-003.webp','Table basse · 2 verres','Bleu ciel','Dessin d’étude'],
  ['assets/nuage-render-002.webp','Table basse · 2 verres','Vert feuille','Dessin d’étude'],
  ['assets/nuage-render-001.webp','Table haute · 1 verre','Vert feuille','Dessin d’étude'],
  ['assets/nuage-render-004.webp','Table haute · 2 verres','Bleu ciel','Dessin d’étude'],
  ['assets/nuage-render-005.webp','Table haute · 4 verres','Bleu ciel','Dessin d’étude']
];

const previewGrid = document.querySelector('[data-photo-previews]');
const filterBar = document.querySelector('[data-photo-filters]');
const galleryDialog = document.querySelector('[data-gallery-dialog]');
const photoImage = document.querySelector('[data-gallery-photo]');
const quoteActions = document.querySelector('[data-gallery-quotes]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeFilter = 'all';
let visible = photos;
let photoIndex = 0;
let galleryReturnFocus = null;

function pieceLabel(id) {
  return products.find(item => item.id === id)?.kindLabel.toLowerCase() || '';
}

const widePhotos = new Set(['assets/photo-5.webp']);
const featuredPhotos = new Set(['assets/photo-6.webp']);
function thumb(src) { return src.replace('assets/', 'assets/thumbs/'); }

function renderFilters() {
  filterBar.innerHTML = filters.map(([id, label, test]) =>
    `<button class="photo-filter" type="button" data-photo-filter="${id}" aria-pressed="${id === activeFilter}">${label} <span>${String(photos.filter(test).length).padStart(2,'0')}</span></button>`).join('');
}
function renderPreviews() {
  visible = photos.filter(filters.find(([id]) => id === activeFilter)[2]);
  previewGrid.innerHTML = visible.map(([src, alt, credit], index) => {
    const wide = widePhotos.has(src);
    const size = wide ? ' is-wide' : activeFilter === 'all' && featuredPhotos.has(src) ? ' is-featured' : '';
    return `<button class="photo-thumb${size}" type="button" style="--i:${index}" data-open-photo="${index}" aria-label="Agrandir la photographie ${index + 1} sur ${visible.length} : ${alt}. ${credit}"><img src="${wide || size ? src : thumb(src)}" alt="" loading="lazy" width="${wide ? 1800 : 800}" height="1200"><span class="photo-number" aria-hidden="true">${String(index + 1).padStart(2,'0')}</span><span class="photo-caption" aria-hidden="true">${alt}</span></button>`;
  }).join('');
  document.querySelector('[data-photo-total]').textContent = `${visible.length} ${visible.length === 1 ? 'photographie' : 'photographies'} · Luc Bertrand, Collectif Feuille de Sauge`;
}
function showPhoto(index) {
  photoIndex = (index + visible.length) % visible.length;
  const [src, alt, credit, pieces] = visible[photoIndex];
  photoImage.src = src;
  photoImage.alt = alt;
  if (!reducedMotion.matches) photoImage.animate([{opacity: 0, transform: 'scale(.985)'}, {opacity: 1, transform: 'none'}], {duration: 320, easing: 'ease-out'});
  document.querySelector('[data-gallery-caption]').textContent = alt;
  document.querySelector('[data-gallery-credit]').textContent = credit;
  document.querySelector('[data-gallery-counter]').textContent = `${String(photoIndex + 1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;
  quoteActions.hidden = pieces.length === 0;
  quoteActions.innerHTML = pieces.map(id => `<button type="button" data-quote-piece="${id}">Demander un devis · ${pieceLabel(id)}</button>`).join('');
  new Image().src = visible[(photoIndex + 1) % visible.length][0];
}
function openGallery(index = 0) {
  galleryReturnFocus = document.activeElement;
  showPhoto(index);
  galleryDialog.showModal();
  syncDialogState();
  document.querySelector('[data-gallery-close]').focus();
}
function closeGallery() { galleryDialog.close(); }
function requestQuote(productId, returnFocus) {
  const focusTarget = galleryDialog.open ? galleryReturnFocus : returnFocus;
  window.dispatchEvent(new CustomEvent('ecrin:add-to-cart', {detail: {productId, returnFocus: focusTarget, keepQuantity: true}}));
  if (galleryDialog.open) galleryDialog.close();
  document.querySelector('[data-cart-dialog]').showModal();
  syncDialogState();
  document.querySelector('[data-quote-link]').focus();
}

renderFilters();
renderPreviews();
// Les vignettes apparaissent en cascade quand la galerie entre dans l’écran.
if ('IntersectionObserver' in window) {
  new IntersectionObserver((entries, observer) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    previewGrid.classList.add('is-in');
    observer.disconnect();
  }, {rootMargin: '0px 0px -10% 0px'}).observe(previewGrid);
} else {
  previewGrid.classList.add('is-in');
}
filterBar.addEventListener('click', event => {
  const button = event.target.closest('[data-photo-filter]');
  if (!button || button.dataset.photoFilter === activeFilter) return;
  activeFilter = button.dataset.photoFilter;
  filterBar.querySelectorAll('[data-photo-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderPreviews();
});
previewGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-open-photo]');
  if (button) openGallery(Number(button.dataset.openPhoto));
});
document.querySelector('[data-open-gallery]').addEventListener('click', () => openGallery(0));
document.querySelector('[data-gallery-close]').addEventListener('click', closeGallery);
document.querySelector('[data-photo-prev]').addEventListener('click', () => showPhoto(photoIndex - 1));
document.querySelector('[data-photo-next]').addEventListener('click', () => showPhoto(photoIndex + 1));
document.addEventListener('click', event => {
  const button = event.target.closest('[data-quote-piece]');
  if (button) requestQuote(button.dataset.quotePiece, button);
});
galleryDialog.addEventListener('close', () => {
  syncDialogState();
});
galleryDialog.addEventListener('click', event => {
  if (event.target !== galleryDialog) return;
  const rect = galleryDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeGallery();
});
galleryDialog.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[data-quote-piece],[contenteditable="true"]')) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
});
let swipeStart = null;
galleryDialog.addEventListener('touchstart', event => {
  swipeStart = event.touches.length === 1 ? [event.touches[0].clientX, event.touches[0].clientY] : null;
}, {passive: true});
galleryDialog.addEventListener('touchend', event => {
  if (!swipeStart) return;
  const dx = event.changedTouches[0].clientX - swipeStart[0];
  const dy = event.changedTouches[0].clientY - swipeStart[1];
  swipeStart = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
}, {passive: true});

const studyGrid = document.querySelector('[data-study-grid]');
const studyDialog = document.querySelector('[data-study-dialog]');
studyGrid.innerHTML = studies.map(([src, title, color, status], index) => `
  <button class="study-card" type="button" data-study-index="${index}" aria-label="Agrandir le dessin : ${title}, ${color}. ${status}, pas de devis">
    <img src="${src}" alt="" loading="lazy" width="1085" height="936"><span class="study-name">${title}</span><span class="study-color">${color}</span>
  </button>`).join('');
function openStudy(index) {
  const [src, title, color, status] = studies[index];
  document.querySelector('[data-study-dialog-content]').innerHTML = `<img src="${src}" alt="Dessin : ${title}, ${color}"><div><p class="eyebrow">La collection se dessine</p><h3>${title}<br><em>${color}</em></h3><p>${status} · ce dessin n’ouvre pas de devis.</p></div>`;
  studyDialog.showModal();
  syncDialogState();
  document.querySelector('[data-study-close]').focus();
}
studyGrid.addEventListener('click', event => { const card=event.target.closest('[data-study-index]'); if (card) openStudy(Number(card.dataset.studyIndex)); });
document.querySelector('[data-study-close]').addEventListener('click', () => studyDialog.close());
studyDialog.addEventListener('click', event => {
  if (event.target !== studyDialog) return;
  const rect=studyDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) studyDialog.close();
});
studyDialog.addEventListener('close', () => {
  syncDialogState();
});
