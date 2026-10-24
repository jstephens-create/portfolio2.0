// Boot: progressive enhancement. Content works without any of this.

document.documentElement.classList.add('js');

const $ = (selector) => document.querySelector(selector);

// Each stage loads in isolation so one failure never breaks the others (FR-039).
async function loadStage(name, importStage, section) {
  try {
    const stage = await importStage();
    await stage.init(section);
  } catch (error) {
    console.warn(`Stage "${name}" did not load; the page continues without it.`, error);
  }
}

function whenNear(section, callback) {
  if (!section) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      callback();
    }
  }, { rootMargin: '100% 0px' });
  observer.observe(section);
}

// Move focus to the heading of the section named in the URL fragment (FR-003).
function focusFragment() {
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  const heading = target.matches('h1, h2, h3, h4') ? target : target.querySelector('h1, h2, h3, h4') ?? target;
  if (!(heading instanceof HTMLElement)) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus();
}

addEventListener('hashchange', focusFragment);
focusFragment();

loadStage('command', () => import('./command.js'), $('#entry'));
whenNear($('#gis'), () => loadStage('gis', () => import('./gis/render.js'), $('#gis')));
whenNear($('#descent'), () => loadStage('descent', () => import('./descent.js'), $('#descent')));
if (new URLSearchParams(location.search).has('audit')) loadStage('audit', () => import('./audit.js'), null);
