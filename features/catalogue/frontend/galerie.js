import { syncDialogState } from '../../frontend/dialog-state.js';

const photos = [
  ['assets/photo-1.webp','Rencontre autour des tables et des verres des Tours Nuages','© Luc Bertrand'],
  ['assets/photo-2.webp','Table haute et verre feuille de sauge, en bleu ciel','© Luc Bertrand'],
  ['assets/photo-3.webp','Table basse et verre feuille de sauge, en vert','© Luc Bertrand'],
  ['assets/photo-4.webp','Table basse et table haute devant la façade des Tours Nuages','© Luc Bertrand'],
  ['assets/photo-5.webp','Les deux tables en dialogue avec les verres de la façade','© Luc Bertrand'],
  ['assets/photo-6.webp','Les tables à l’échelle de la façade des Tours Nuages','© Luc Bertrand'],
  ['assets/photo-7.webp','Détail de la tranche et du piétement vert de la table basse','© Luc Bertrand'],
  ['assets/photo-8.webp','Détail de l’assemblage du verre et du bois','© Luc Bertrand'],
  ['assets/photo-9.webp','Percements et attaches conservés dans le verre récupéré','© Luc Bertrand'],
  ['assets/photo-10.webp','Courbe du plateau et bord du verre feuille de sauge','© Luc Bertrand'],
  ['assets/photo-11.webp','Détail du plateau en verre et d’un piétement','© Luc Bertrand'],
  ['assets/photo-12.webp','Détail de la table haute et de son verre','© Luc Bertrand'],
  ['assets/photo-13.webp','Détail de la jonction entre verre et structure','© Luc Bertrand'],
  ['assets/photo-14.webp','Piètement et profil de la table basse','© Luc Bertrand'],
  ['assets/photo-15.webp','Deux tables sous les fenêtres feuille de sauge','© Luc Bertrand'],
  ['assets/photo-16.webp','Anaïs Fernon, Clémence Bondon et Camille Sardet dans le quartier des Tours Nuages','© Luc Bertrand'],
  ['assets/table-basse.webp','Une table basse Écrin des Nuages présentée seule','Écrin des Nuages'],
  ['assets/table-basse-collectif.webp','Table basse Écrin des Nuages — photographie du Collectif Feuille de Sauge','© Collectif Feuille de Sauge']
];
const studies = [
  ['assets/nuage-render-000.webp','Table basse · 1 verre','Bleu ciel','Variante dessinée dans la collection.'],
  ['assets/nuage-render-001.webp','Table haute · 1 verre','Vert feuille','Variante dessinée dans la collection.'],
  ['assets/nuage-render-002.webp','Table basse · 2 verres','Bleu ciel','Étude en cours · pas à la vente.'],
  ['assets/nuage-render-003.webp','Table haute · 2 verres','Bleu ciel','Étude en cours · pas à la vente.'],
  ['assets/nuage-render-004.webp','Table haute · 2 verres','Vert feuille','Étude en cours · pas à la vente.'],
  ['assets/nuage-render-005.webp','Table haute · 4 verres','Bleu ciel','Étude en cours · pas à la vente.']
];

const previewIndices = [3, 6, 8, 10, 14, 15];
const previewGrid = document.querySelector('[data-photo-previews]');
const galleryDialog = document.querySelector('[data-gallery-dialog]');
const photoImage = document.querySelector('[data-gallery-photo]');
let photoIndex = 0;

function renderPreviews() {
  previewGrid.innerHTML = previewIndices.map((index, position) => {
    const [src, alt, credit] = photos[index];
    return `<button class="photo-preview photo-preview-${position + 1}" type="button" data-open-photo="${index}" aria-label="Ouvrir la galerie sur la photo : ${alt}"><img src="${src}" alt="${alt}" loading="lazy"><span>${String(index + 1).padStart(2,'0')} / 18</span><span class="visually-hidden">${credit}</span></button>`;
  }).join('');
}
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const [src, alt, credit] = photos[photoIndex];
  photoImage.src = src;
  photoImage.alt = alt;
  document.querySelector('[data-gallery-caption]').textContent = alt;
  document.querySelector('[data-gallery-credit]').textContent = credit;
  document.querySelector('[data-gallery-counter]').textContent = `${String(photoIndex + 1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
}
function openGallery(index = 0) {
  showPhoto(index);
  galleryDialog.showModal();
  syncDialogState();
  document.querySelector('[data-gallery-close]').focus();
}
function closeGallery() { galleryDialog.close(); }

renderPreviews();
previewGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-open-photo]');
  if (button) openGallery(Number(button.dataset.openPhoto));
});
document.querySelector('[data-open-gallery]').addEventListener('click', () => openGallery(0));
document.querySelector('[data-gallery-close]').addEventListener('click', closeGallery);
document.querySelector('[data-photo-prev]').addEventListener('click', () => showPhoto(photoIndex - 1));
document.querySelector('[data-photo-next]').addEventListener('click', () => showPhoto(photoIndex + 1));
galleryDialog.addEventListener('close', () => {
  syncDialogState();
});
galleryDialog.addEventListener('click', event => {
  if (event.target !== galleryDialog) return;
  const rect = galleryDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeGallery();
});
galleryDialog.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
});

const studyGrid = document.querySelector('[data-study-grid]');
const studyDialog = document.querySelector('[data-study-dialog]');
studyGrid.innerHTML = studies.map(([src, title, color, status], index) => `
  <button class="study-card ${index > 1 ? 'study-card-in-progress' : ''}" type="button" data-study-index="${index}" aria-label="Voir l’étude : ${title}, ${color}. ${status}">
    <img src="${src}" alt="" loading="lazy"><span class="study-name">${title}</span><span class="study-color">${color}</span>${index > 1 ? '<span class="study-status">Étude en cours · pas à la vente</span>' : '<span class="study-status">Dessin de collection</span>'}
  </button>`).join('');
function openStudy(index) {
  const [src, title, color, status] = studies[index];
  document.querySelector('[data-study-dialog-content]').innerHTML = `<img src="${src}" alt="Dessin de collection : ${title}, ${color}"><div><p class="eyebrow">La collection se dessine</p><h3>${title}<br><em>${color}</em></h3><p>${status}</p></div>`;
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
