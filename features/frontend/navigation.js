const header = document.querySelector('.site-header');
const toggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('.main-nav');
function setMenu(open) {
  header.classList.toggle('is-nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
header.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});
window.matchMedia('(max-width:900px)').addEventListener('change', () => setMenu(false));
document.addEventListener('click', event => {
  if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
});

// L’en-tête s’efface quand la page défile vers le bas et revient dès qu’elle remonte.
// Il reste visible en haut de page, menu ouvert ou quand le clavier y place le focus
// (un lien simplement touché ne le retient pas).
let lastY = window.scrollY;
function setAway(away) {
  header.classList.toggle('is-away', away);
}
window.addEventListener('scroll', () => {
  // Bornes : le rebond élastique de Safari dépasse le haut et le bas de la page.
  const limit = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.min(Math.max(window.scrollY, 0), limit);
  if (Math.abs(y - lastY) < 6) return;
  const down = y > lastY;
  lastY = y;
  const pinned = y <= header.offsetHeight || toggle.getAttribute('aria-expanded') === 'true' || header.querySelector(':focus-visible');
  setAway(down && !pinned);
}, { passive: true });
header.addEventListener('focusin', event => {
  if (event.target.matches(':focus-visible')) setAway(false);
});
