// Canvas 2D wireframe of Willis Tower. Draws on demand; the facts table stays the text equivalent.
import { buildTower, project, clampZoom, clampTilt } from './geometry.js';

const DEFAULT_VIEW = { azimuth: 30, tilt: 20, zoom: 1 };
const CLASS_WORDS = { verified: 'Verified', approximate: 'Approximate', interpretation: 'Interpretation', pending: 'Pending verification' };

function readFacts(doc) {
  const facts = {};
  for (const tr of doc.querySelectorAll('tr[data-fact]')) {
    const value = tr.dataset.value === undefined ? null : Number(tr.dataset.value);
    facts[tr.dataset.fact] = {
      value,
      cls: tr.dataset.class,
      label: tr.cells[0].textContent.trim(),
      text: tr.cells[1].textContent.trim(),
    };
  }
  return facts;
}

function el(tag, props = {}, parent) {
  const node = Object.assign(document.createElement(tag), props);
  parent?.append(node);
  return node;
}

export function init(section) {
  const facts = readFacts(document);
  const tower = buildTower(facts);
  if (!tower) return; // a required figure is pending: keep the static drawing

  const stage = section.querySelector('.tower-stage');
  const caption = section.querySelector('caption');
  caption.id ||= 'tower-facts-caption';

  const canvas = el('canvas', { className: 'tower-canvas', tabIndex: 0 }, stage);
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Interactive wireframe of Willis Tower. Drag or use the left and right arrow keys to rotate, plus and minus to zoom, Home to reset.');
  canvas.setAttribute('aria-describedby', caption.id);
  const ctx = canvas.getContext('2d');

  const labelLayer = el('ul', { className: 'tower-labels' }, stage);
  labelLayer.setAttribute('aria-hidden', 'true');
  el('p', { className: 'tower-note', textContent: 'Reconstruction from published dimensions; not a surveyed model.' }, stage);

  const controls = el('div', { className: 'tower-controls' }, stage);
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'View controls');
  const readout = el('output', { className: 'tower-readout' }, controls);

  let view = { ...DEFAULT_VIEW };
  let size = { width: 0, height: 0 };
  let queued = false;

  const set = (next) => {
    view = {
      azimuth: (((next.azimuth ?? view.azimuth) % 360) + 360) % 360,
      tilt: clampTilt(next.tilt ?? view.tilt),
      zoom: clampZoom(next.zoom ?? view.zoom),
    };
    if (!queued) {
      queued = true;
      requestAnimationFrame(draw);
    }
  };

  for (const [text, label, change] of [
    ['⟲', 'Rotate left', () => set({ azimuth: view.azimuth - 15 })],
    ['⟳', 'Rotate right', () => set({ azimuth: view.azimuth + 15 })],
    ['+', 'Zoom in', () => set({ zoom: view.zoom * 1.25 })],
    ['−', 'Zoom out', () => set({ zoom: view.zoom / 1.25 })],
    ['Reset', 'Reset view', () => set(DEFAULT_VIEW)],
  ]) {
    const button = el('button', { type: 'button', textContent: text }, controls);
    button.setAttribute('aria-label', label);
    button.addEventListener('click', change);
  }

  // Annotation anchors in model feet; each label shows its classification in words (FR-022).
  const half = tower.base / 2;
  const t = Object.fromEntries(tower.tubes.map((tube) => [tube.name, tube]));
  const anchors = [
    ['height-architectural', [-tower.base / 3, t.W.top, 0], 'Roof'],
    ['height-occupied', [0, facts['height-occupied']?.value ?? t.C.top, 0], 'Top floor'],
    ['setback-90', [half, t.E.top, 0], 'Floor 90'],
    ['setback-66', [half, t.NE.top, -half], 'Floor 66'],
    ['setback-50', [-half, t.NW.top, -half], 'Floor 50'],
    ['tube-size', [half, 0, half], 'Tube 75 ft'],
    ['coordinates', [-half - 75, 0, -half - 75], 'Location'],
  ].filter(([key]) => facts[key]);
  // Full text on wide stages; short names on phones, where the table below carries the figures.
  const labels = anchors.map(([key, , short]) => {
    const f = facts[key];
    const cls = CLASS_WORDS[f.cls] ?? f.cls;
    return Object.assign(el('li', {}, labelLayer), { full: `${f.label}: ${f.text || '—'} · ${cls}`, short: `${short} · ${cls}` });
  });

  const viewFor = () => ({ ...view, ...size, center: tower.height / 2, span: tower.height * 1.15 });

  function stroke(segments, alpha, width) {
    const v = viewFor();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (const s of segments) {
      const [x0, y0] = project([s[0], s[1], s[2]], v);
      const [x1, y1] = project([s[3], s[4], s[5]], v);
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.stroke();
  }

  function drawBearingRing(v) {
    const radius = tower.base * 1.6;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let deg = 0; deg < 360; deg += 10) {
      const a = deg * (Math.PI / 180);
      const inner = deg % 90 === 0 ? radius * 0.9 : radius * 0.96;
      const [x0, y0] = project([Math.sin(a) * inner, 0, -Math.cos(a) * inner], v);
      const [x1, y1] = project([Math.sin(a) * radius, 0, -Math.cos(a) * radius], v);
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.stroke();
    const [nx, ny] = project([0, 0, -radius * 1.1], v);
    ctx.globalAlpha = 1;
    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--accent').trim();
    ctx.fillText('N', nx - 4, ny + 4);
  }

  function draw() {
    queued = false;
    const ratio = devicePixelRatio || 1;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.strokeStyle = getComputedStyle(canvas).color;
    ctx.font = '12px ui-monospace, Consolas, monospace';
    const v = viewFor();

    ctx.setLineDash([4, 4]);
    stroke(tower.ground, 0.45, 1);
    ctx.setLineDash([]);
    drawBearingRing(v);
    stroke(tower.floorSegments, 0.18, 0.5);
    stroke(tower.segments, 0.9, 1);

    const accent = getComputedStyle(canvas).getPropertyValue('--accent').trim();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 1;
    const compact = size.width < 480;
    anchors.forEach(([, point], i) => {
      const [x, y] = project(point, v);
      const text = compact ? labels[i].short : labels[i].full;
      if (labels[i].textContent !== text) labels[i].textContent = text;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      const width = labels[i].offsetWidth;
      const left = x + 8 + width > size.width ? x - 8 - width : x + 8; // flip labels that would clip
      labels[i].style.transform = `translate(${Math.round(Math.max(0, left))}px, ${Math.round(y - 8)}px)`;
    });
    readout.textContent = `View ${String(Math.round(view.azimuth)).padStart(3, '0')}°`;
  }

  // Pointer: horizontal drag rotates; mouse vertical drag tilts; two pointers pinch-zoom.
  // touch-action: pan-y (CSS) leaves vertical swipes to the page (FR-025).
  const pointers = new Map();
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  });
  canvas.addEventListener('pointermove', (e) => {
    const previous = pointers.get(e.pointerId);
    if (!previous) return;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const before = Math.hypot(a.x - b.x, a.y - b.y);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [c, d] = [...pointers.values()];
      if (before > 0) set({ zoom: (view.zoom * Math.hypot(c.x - d.x, c.y - d.y)) / before });
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    set({
      azimuth: view.azimuth + (e.clientX - previous.x) * 0.4,
      tilt: e.pointerType === 'mouse' ? view.tilt + (e.clientY - previous.y) * 0.3 : view.tilt,
    });
  });
  for (const type of ['pointerup', 'pointercancel']) canvas.addEventListener(type, (e) => pointers.delete(e.pointerId));

  // Only trackpad pinch (ctrl+wheel) zooms; plain wheel keeps scrolling the page.
  canvas.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    set({ zoom: view.zoom * Math.exp(-e.deltaY * 0.01) });
  }, { passive: false });

  canvas.addEventListener('keydown', (e) => {
    const change = {
      ArrowLeft: { azimuth: view.azimuth - 15 },
      ArrowRight: { azimuth: view.azimuth + 15 },
      '+': { zoom: view.zoom * 1.25 },
      '=': { zoom: view.zoom * 1.25 },
      '-': { zoom: view.zoom / 1.25 },
      Home: DEFAULT_VIEW,
    }[e.key];
    if (!change) return;
    e.preventDefault();
    set(change);
  });

  new ResizeObserver(() => {
    const ratio = devicePixelRatio || 1;
    size = { width: stage.clientWidth, height: stage.clientHeight };
    canvas.width = Math.round(size.width * ratio);
    canvas.height = Math.round(size.height * ratio);
    set({});
  }).observe(stage);

  section.classList.add('is-live');
}
