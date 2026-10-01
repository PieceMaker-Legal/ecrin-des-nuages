const header = document.querySelector('.site-header');
const toggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('.main-nav');
const compactLayout = window.matchMedia('(max-width:900px)');
function syncToggleAvailability() {
  const inactive = !compactLayout.matches;
  toggle.tabIndex = inactive ? -1 : 0;
  toggle.setAttribute('aria-hidden', String(inactive));
  toggle.setAttribute('aria-disabled', String(inactive));
  if (inactive) setMenu(false);
}
function setMenu(open) {
  header.classList.toggle('is-nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
}
syncToggleAvailability();
toggle.addEventListener('click', () => {
  if (compactLayout.matches) setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
header.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});
compactLayout.addEventListener('change', () => {
  syncToggleAvailability();
  setAway(false);
  lastY = window.scrollY;
});
document.addEventListener('click', event => {
  if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
});

// Sur les petits écrans, l’en-tête s’efface quand la page défile vers le bas.
// Sur grand écran, il reste visible. En mobile, il reste aussi visible en haut,
// menu ouvert ou quand le clavier y place le focus (un lien simplement touché ne le retient pas).
let lastY = window.scrollY;
function setAway(away) {
  header.classList.toggle('is-away', away);
}
window.addEventListener('scroll', () => {
  // Bornes : le rebond élastique de Safari dépasse le haut et le bas de la page.
  const limit = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.min(Math.max(window.scrollY, 0), limit);
  if (!compactLayout.matches) {
    setAway(false);
    lastY = y;
    return;
  }
  if (Math.abs(y - lastY) < 6) return;
  const down = y > lastY;
  lastY = y;
  const pinned = y <= header.offsetHeight || toggle.getAttribute('aria-expanded') === 'true' || header.querySelector(':focus-visible');
  setAway(down && !pinned);
}, { passive: true });
header.addEventListener('focusin', event => {
  if (event.target.matches(':focus-visible')) setAway(false);
});
