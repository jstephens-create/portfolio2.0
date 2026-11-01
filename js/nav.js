// Section ticker and scroll spy. Without this stage the nav is a plain sideways-scrolling list.

const SPEED = 24; // px per second: a slow, mechanical drift
const IDLE_MS = 4000; // drift resumes this long after the visitor stops interacting
const MAX_STEP_MS = 100; // a long frame gap (background tab, jank) never becomes a jump

// Keep the drift inside one copy of the list so the loop never visibly jumps.
export const wrapOffset = (offset, period) => (period > 0 ? ((offset % period) + period) % period : 0);

// One place marks the current section, in the nav and in the cutaway levels.
function markCurrent(id) {
  for (const link of document.querySelectorAll('.site-nav a[href^="#"], .cutaway .level')) {
    if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

export function init(nav) {
  const list = nav.querySelector('ol');
  const originals = [...list.children];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // The section crossing the middle of the viewport is current; stages above Identity clear it.
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) markCurrent(entry.target.id);
  }, { rootMargin: '-45% 0px -54% 0px' });
  for (const section of document.querySelectorAll('main > section[id]')) spy.observe(section);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'ticker-toggle';
  toggle.hidden = true;
  toggle.setAttribute('aria-label', 'Pause section ticker');
  nav.append(toggle);

  let period = 0;
  let offset = 0;
  let last = 0;
  let raf = 0;
  let held = false; // paused with the button: stays paused
  let idle = false; // paused by interaction: resumes after IDLE_MS
  let timer = 0;

  // Clone the list until one copy past the viewport is always available. Clones stay clickable
  // but are hidden from assistive technology and skipped by Tab.
  function fill() {
    for (const clone of list.querySelectorAll('[data-clone]')) clone.remove();
    period = 0;
    if (reduce.matches) return;
    let copies = 0;
    do {
      for (const item of originals) {
        const clone = item.cloneNode(true);
        clone.dataset.clone = '';
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelector('a').tabIndex = -1;
        list.append(clone);
      }
      copies += 1;
      period = list.children[originals.length].offsetLeft - originals[0].offsetLeft;
    } while (period * copies < list.clientWidth && copies < 12);
  }

  function frame(now) {
    offset = wrapOffset(offset + ((last ? Math.min(now - last, MAX_STEP_MS) : 0) * SPEED) / 1000, period);
    last = now;
    list.scrollLeft = offset;
    raf = requestAnimationFrame(frame);
  }

  function sync() {
    const run = period > 0 && !held && !idle && !document.hidden;
    if (run && !raf) {
      offset = wrapOffset(list.scrollLeft, period);
      last = 0;
      raf = requestAnimationFrame(frame);
    } else if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    nav.classList.toggle('is-ticking', period > 0);
    toggle.hidden = period === 0;
    toggle.setAttribute('aria-pressed', String(held));
    toggle.textContent = held ? '▸' : '‖';
  }

  const pause = () => {
    idle = true;
    clearTimeout(timer);
    sync();
  };
  const resumeLater = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (nav.matches(':hover, :focus-within')) return;
      idle = false;
      sync();
    }, IDLE_MS);
  };

  list.addEventListener('pointerenter', pause);
  list.addEventListener('pointerleave', resumeLater);
  list.addEventListener('focusin', pause);
  list.addEventListener('focusout', (event) => {
    if (!list.contains(event.relatedTarget)) resumeLater();
  });
  list.addEventListener('wheel', () => {
    pause();
    resumeLater();
  }, { passive: true });

  // Manual swipes loop too: shifting by exactly one copy shows identical content.
  // Skipped while a link has focus so the focused link never jumps out of view.
  list.addEventListener('scroll', () => {
    if (raf || !period || list.contains(document.activeElement)) return;
    if (list.scrollLeft >= period) list.scrollLeft -= period;
    else if (list.scrollLeft <= 0) list.scrollLeft += period;
  }, { passive: true });

  toggle.addEventListener('click', () => {
    held = !held;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', () => {
    fill();
    sync();
  });
  new ResizeObserver(() => {
    fill();
    sync();
  }).observe(list);
}
