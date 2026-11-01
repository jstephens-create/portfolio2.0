// Scroll-driven descent: writes 0–1 progress to --descent while the section is on screen.

export function scrollProgress(sectionTop, sectionHeight, viewportHeight) {
  const travel = sectionHeight - viewportHeight;
  if (travel <= 0) return sectionTop > 0 ? 0 : 1;
  return Math.min(1, Math.max(0, -sectionTop / travel));
}

// Index of the level whose center is closest to the target line (the middle of the viewport).
export function nearestLevel(centers, target) {
  let best = -1;
  for (const [index, center] of centers.entries()) {
    if (best < 0 || Math.abs(center - target) < Math.abs(centers[best] - target)) best = index;
  }
  return best;
}

export function init(section) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const track = section.querySelector('.descent-track');
  const levels = [...section.querySelectorAll('.level')];
  const readout = Object.assign(document.createElement('p'), { className: 'depth-readout' });
  readout.setAttribute('aria-hidden', 'true'); // visual echo of the focused or nearest level's own label
  section.querySelector('.descent-view').prepend(readout);
  let near = -1;
  let queued = false;

  const show = (index) => {
    if (index === near || !levels[index]) return;
    levels[near]?.classList.remove('is-near');
    levels[index].classList.add('is-near');
    near = index;
    const text = (name) => levels[index].querySelector(name).textContent;
    readout.textContent = `LEVEL ${index + 1}/${levels.length} · ${text('.level-layer')} · ${text('.level-depth')}`;
  };

  const update = () => {
    queued = false;
    const rect = track.getBoundingClientRect();
    const progress = scrollProgress(rect.top, rect.height, innerHeight);
    if (!reduce.matches) track.style.setProperty('--descent', progress.toFixed(4));
    // Measured after the write so the highlight matches what is on screen this frame.
    const centers = levels.map((level) => {
      const box = level.querySelector('rect').getBoundingClientRect();
      return box.top + box.height / 2;
    });
    // The target line sinks from the top of the view to the bottom as the descent progresses,
    // so every level, down to bedrock, becomes the active one in turn.
    show(nearestLevel(centers, innerHeight * (0.15 + 0.75 * progress)));
  };
  const onScroll = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };

  // Highlighting the nearest level is not motion, so it also runs with reduced motion.
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      addEventListener('scroll', onScroll, { passive: true });
      update();
    } else {
      removeEventListener('scroll', onScroll);
    }
  }).observe(track);

  reduce.addEventListener('change', () => {
    track.style.removeProperty('--descent');
    update();
  });

  // Arrow keys travel between levels like floors in a section drawing.
  section.querySelector('.levels').addEventListener('keydown', (event) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    const index = levels.indexOf(document.activeElement);
    if (!step || index < 0) return;
    event.preventDefault();
    levels[(index + step + levels.length) % levels.length].focus();
  });
  for (const [index, level] of levels.entries()) level.addEventListener('focus', () => show(index));
}
