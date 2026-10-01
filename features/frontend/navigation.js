const header = document.querySelector('.site-header');
const toggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('.main-nav');
const symbol = document.querySelector('[data-menu-symbol]');
function setMenu(open) {
  header.classList.toggle('is-nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  symbol.textContent = open ? '−' : '+';
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
