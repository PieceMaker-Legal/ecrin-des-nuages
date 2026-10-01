// Chaque slide tient dans la hauteur visible. Si son contenu dépasse encore après la mise en page
// fluide, il est réduit pas à pas ; en dernier recours la slide reprend une hauteur libre.
// Sur téléphone, le contenu n’est jamais réduit : la lisibilité passe avant la hauteur d’écran.
const slides = [...document.querySelectorAll('.slide')];
const phone = window.matchMedia('(max-width: 760px)');

// Un contenu trop haut peut déborder d’une grille interne sans allonger la slide :
// chaque conteneur flexible ou en grille est donc contrôlé.
function overflows(slide) {
  if (slide.scrollHeight > slide.clientHeight + 1) return true;
  for (const element of slide.querySelectorAll('div, section, figure, article, dl')) {
    // Tolérance : les jambages des titres dépassent leur ligne de quelques pixels.
    if (element.scrollHeight <= element.clientHeight + 6) continue;
    // Les bandes à défilement horizontal rognent en hauteur : elles comptent aussi.
    const { display, overflowX, overflowY } = getComputedStyle(element);
    if ((overflowY === 'visible' || overflowX === 'auto') && /flex|grid/.test(display)) return true;
  }
  return false;
}

function fitSlides() {
  const minimum = phone.matches ? 1 : 0.6;
  for (const slide of slides) {
    let fit = 1;
    slide.classList.remove('is-free');
    slide.style.setProperty('--fit', fit);
    while (overflows(slide) && fit > minimum) {
      fit = Math.round((fit - 0.04) * 100) / 100;
      slide.style.setProperty('--fit', fit);
    }
    if (overflows(slide)) {
      slide.style.setProperty('--fit', 1);
      slide.classList.add('is-free');
    }
  }
}

// Safari peut émettre « resize » pendant l’animation de ses barres. La clé évite un recalcul
// quand la largeur et la hauteur dynamique réellement mesurées n’ont pas changé.
const probe = document.createElement('div');
probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:var(--slide)';
document.body.append(probe);
let fitted = '';
function viewportKey() {
  return `${document.documentElement.clientWidth}x${probe.offsetHeight}`;
}

let frame = 0;
function scheduleFit(force) {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const key = viewportKey();
    if (force !== true && key === fitted) return;
    fitted = key;
    fitSlides();
  });
}

fitSlides();
fitted = viewportKey();
window.addEventListener('load', () => scheduleFit(true));
window.addEventListener('resize', scheduleFit);
