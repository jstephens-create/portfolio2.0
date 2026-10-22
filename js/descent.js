// Scroll-driven descent: writes 0–1 progress to --descent while the section is on screen.

export function scrollProgress(sectionTop, sectionHeight, viewportHeight) {
  const travel = sectionHeight - viewportHeight;
  if (travel <= 0) return sectionTop > 0 ? 0 : 1;
  return Math.min(1, Math.max(0, -sectionTop / travel));
}

export function init(section) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const track = section.querySelector('.descent-track');
  let queued = false;

  const update = () => {
    queued = false;
    const rect = track.getBoundingClientRect();
    track.style.setProperty('--descent', scrollProgress(rect.top, rect.height, innerHeight).toFixed(4));
  };
  const onScroll = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !reduce.matches) {
      addEventListener('scroll', onScroll, { passive: true });
      update();
    } else {
      removeEventListener('scroll', onScroll);
    }
  }).observe(track);

  reduce.addEventListener('change', () => {
    track.style.removeProperty('--descent');
    if (!reduce.matches) update();
  });
}
