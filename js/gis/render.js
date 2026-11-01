// Canvas 2D wireframe of Willis Tower. Turns slowly on its own; the facts table stays the text equivalent.
import { buildTower, project, clampZoom, clampTilt, stepAzimuth } from './geometry.js';

const DEFAULT_VIEW = { azimuth: 30, tilt: 20, zoom: 1 };
const CLASS_WORDS = { verified: 'Verified', approximate: 'Approximate', interpretation: 'Interpretation', pending: 'Pending verification' };
const RAD = Math.PI / 180;
const SPIN = 4; // degrees per second: one full turn every 90 s
const IDLE_MS = 5000; // automatic rotation resumes this long after the last manual control
const CAMERA = 3; // viewer distance in model spans: enough perspective to read depth, not to distort
const BANDS = 4; // depth bands per line class; nearer bands draw brighter
const COMPACT = 600; // px stage width below which annotations become a numbered legend under the model

// Push label boxes ({ y: wanted top, h }) apart so none overlap, keeping their vertical order,
// and keep them inside [top, bottom] when they fit. Returns the new tops in input order.
export function stackLabels(boxes, top, bottom, gap = 4) {
  const order = boxes.map((_, i) => i).sort((a, b) => boxes[a].y - boxes[b].y);
  const tops = boxes.map((box) => box.y);
  let floor = top;
  for (const i of order) {
    tops[i] = Math.max(tops[i], floor);
    floor = tops[i] + boxes[i].h + gap;
  }
  let ceiling = bottom;
  for (const i of order.reverse()) {
    tops[i] = Math.max(top, Math.min(tops[i], ceiling - boxes[i].h));
    ceiling = tops[i] - gap;
  }
  return tops;
}

// Neighbouring tubes share edges; stroking both copies doubles the alpha and reads as a false heavy line.
function unique(segments) {
  const seen = new Map();
  for (const s of segments) {
    const a = s.slice(0, 3).map((n) => n.toFixed(3)).join();
    const b = s.slice(3).map((n) => n.toFixed(3)).join();
    seen.set(a < b ? `${a}|${b}` : `${b}|${a}`, s);
  }
  return [...seen.values()];
}

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

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const stage = section.querySelector('.tower-stage');
  const caption = section.querySelector('caption');
  caption.id ||= 'tower-facts-caption';

  const viewport = el('div', { className: 'tower-viewport' }, stage);
  const canvas = el('canvas', { className: 'tower-canvas', tabIndex: 0 }, viewport);
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Interactive wireframe of Willis Tower. It turns slowly unless reduced motion is on; the pause button stops it. Drag or use the left and right arrow keys to rotate, plus and minus to zoom, Home to reset.');
  canvas.setAttribute('aria-describedby', caption.id);
  const ctx = canvas.getContext('2d');

  // Callouts beside the model on wide stages; a numbered legend under it on phones.
  // Hidden from assistive technology: the facts table carries the same figures.
  const labelLayer = el('ol', { className: 'tower-labels' }, stage);
  labelLayer.setAttribute('aria-hidden', 'true');

  const toolbar = el('div', { className: 'tower-toolbar' }, stage);
  const readout = el('span', { className: 'tower-readout' }, toolbar);
  readout.setAttribute('aria-hidden', 'true'); // changes every frame, so never a live region
  el('p', { className: 'tower-note', textContent: 'Reconstruction from published dimensions; not a surveyed model.' }, toolbar);
  const controls = el('div', { className: 'tower-controls' }, toolbar);
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'View controls');

  let view = { ...DEFAULT_VIEW };
  let size = { width: 0, height: 0 };
  let compact = false;
  let colors = {};
  let boxes = [];
  let queued = false;
  // Automatic rotation state
  let raf = 0;
  let last = 0;
  let held = false; // paused with the button: stays paused
  let idle = false; // paused by manual input: resumes after IDLE_MS
  let onScreen = false;
  let timer = 0;
  const pointers = new Map();

  const set = (next) => {
    view = {
      azimuth: (((next.azimuth ?? view.azimuth) % 360) + 360) % 360,
      tilt: clampTilt(next.tilt ?? view.tilt),
      zoom: clampZoom(next.zoom ?? view.zoom),
    };
    if (!queued && !raf) {
      queued = true;
      requestAnimationFrame(draw);
    }
  };

  function spin(now) {
    view.azimuth = stepAzimuth(view.azimuth, last ? now - last : 0, SPIN);
    last = now;
    draw();
    raf = requestAnimationFrame(spin);
  }

  // Run the loop only while it is useful: on screen, tab visible, motion welcome, not paused.
  function sync() {
    const run = !reduce.matches && !held && !idle && onScreen && !document.hidden;
    if (run && !raf) {
      last = 0;
      raf = requestAnimationFrame(spin);
    } else if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    toggle.hidden = reduce.matches;
    toggle.setAttribute('aria-pressed', String(held));
    toggle.textContent = held ? '▸' : '‖';
    if (!raf) set({}); // refresh the readout state
  }

  function interrupt() {
    idle = true;
    clearTimeout(timer);
    const wait = () => {
      timer = setTimeout(() => {
        if (pointers.size) return wait(); // still dragging
        idle = false;
        sync();
      }, IDLE_MS);
    };
    wait();
    sync();
  }
  const control = (next) => {
    interrupt();
    set(next);
  };

  for (const [text, label, change] of [
    ['⟲', 'Rotate left', () => ({ azimuth: view.azimuth - 15 })],
    ['⟳', 'Rotate right', () => ({ azimuth: view.azimuth + 15 })],
    ['+', 'Zoom in', () => ({ zoom: view.zoom * 1.25 })],
    ['−', 'Zoom out', () => ({ zoom: view.zoom / 1.25 })],
    ['Reset', 'Reset view', () => DEFAULT_VIEW],
  ]) {
    const button = el('button', { type: 'button', textContent: text }, controls);
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => control(change()));
  }
  const toggle = el('button', { type: 'button', className: 'tower-toggle' }, controls);
  toggle.setAttribute('aria-label', 'Pause automatic rotation');
  toggle.addEventListener('click', () => {
    held = !held;
    sync();
  });

  // Annotation anchors in model feet; each label shows its classification in words (FR-022).
  // Side is fixed per anchor so callouts stay put while the model turns; only leaders move.
  const half = tower.base / 2;
  const t = Object.fromEntries(tower.tubes.map((tube) => [tube.name, tube]));
  const anchors = [
    ['height-architectural', [-tower.base / 3, t.W.top, 0], 'right'],
    ['height-occupied', [0, facts['height-occupied']?.value ?? t.C.top, 0], 'right'],
    ['setback-90', [half, t.E.top, 0], 'right'],
    ['setback-66', [half, t.NE.top, -half], 'right'],
    ['setback-50', [-half, t.NW.top, -half], 'right'],
    ['tube-size', [half, 0, half], 'left'],
    ['coordinates', [-half - 75, 0, -half - 75], 'left'],
  ].filter(([key]) => facts[key]);
  const labels = anchors.map(([key]) => {
    const f = facts[key];
    return el('li', { textContent: `${f.label}: ${f.text || '—'} · ${CLASS_WORDS[f.cls] ?? f.cls}` }, labelLayer);
  });

  // Line classes, sorted once: columns carry the structure, caps mark each tube's top,
  // floor plates are faint, shared edges are drawn once.
  const edges = unique(tower.segments);
  const vertical = (s) => s[0] === s[3] && s[2] === s[5];
  const columns = edges.filter(vertical);
  const caps = edges.filter((s) => !vertical(s) && s[1] > 0);
  const bases = edges.filter((s) => !vertical(s) && s[1] === 0);
  const floors = unique(tower.floorSegments);
  const setbacks = tower.tubes.filter((tube) => tube.top < tower.height);
  const roofs = tower.tubes.filter((tube) => tube.top === tower.height);

  const viewFor = () => ({ ...view, ...size, center: tower.height / 2, span: tower.height * 1.15, camera: CAMERA });

  function strokeByDepth(segments, v, range, color, width, near, far) {
    const paths = Array.from({ length: BANDS }, () => new Path2D());
    for (const s of segments) {
      const [x0, y0, d0] = project([s[0], s[1], s[2]], v);
      const [x1, y1, d1] = project([s[3], s[4], s[5]], v);
      const u = ((d0 + d1) / 2 + range) / (2 * range);
      const band = Math.min(BANDS - 1, Math.max(0, Math.floor(u * BANDS)));
      paths[band].moveTo(x0, y0);
      paths[band].lineTo(x1, y1);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    paths.forEach((path, band) => {
      ctx.globalAlpha = far + ((near - far) * band) / (BANDS - 1);
      ctx.stroke(path);
    });
  }

  function plan(cx, cz, halfSize, y, v) {
    const path = new Path2D();
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dz], i) => {
      const [x, py] = project([cx + dx * halfSize, y, cz + dz * halfSize], v);
      if (i) path.lineTo(x, py);
      else path.moveTo(x, py);
    });
    path.closePath();
    return path;
  }

  function drawBearingRing(v) {
    const radius = tower.base * 1.6;
    const ticks = new Path2D();
    for (let deg = 0; deg < 360; deg += 10) {
      const a = deg * RAD;
      const inner = deg % 90 === 0 ? radius * 0.9 : radius * 0.96;
      const [x0, y0] = project([Math.sin(a) * inner, 0, -Math.cos(a) * inner], v);
      const [x1, y1] = project([Math.sin(a) * radius, 0, -Math.cos(a) * radius], v);
      ticks.moveTo(x0, y0);
      ticks.lineTo(x1, y1);
    }
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = colors.muted;
    ctx.lineWidth = 1;
    ctx.stroke(ticks);
    const [nx, ny] = project([0, 0, -radius * 1.1], v);
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.accent;
    ctx.fillText('N', nx - 4, ny + 4);
  }

  function draw() {
    queued = false;
    if (!size.width) return;
    const ratio = devicePixelRatio || 1;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.font = '600 11px ui-monospace, Consolas, monospace';
    const v = viewFor();
    // Half the depth extent of the model in this view, for depth-dependent opacity.
    const range = (tower.height / 2) * Math.sin(view.tilt * RAD) + tower.base * 0.75 * Math.cos(view.tilt * RAD);

    // Ground: footprint, schematic block (interpretation, dashed), bearing ring.
    ctx.fillStyle = colors.fg;
    ctx.globalAlpha = 0.06;
    ctx.fill(plan(0, 0, half, 0, v));
    ctx.setLineDash([4, 4]);
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = colors.muted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const s of tower.ground) {
      const [x0, y0] = project([s[0], s[1], s[2]], v);
      const [x1, y1] = project([s[3], s[4], s[5]], v);
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    drawBearingRing(v);

    strokeByDepth(floors, v, range, colors.fg, 0.5, 0.24, 0.05);
    strokeByDepth(bases, v, range, colors.fg, 0.75, 0.5, 0.2);

    // Setback caps: where tubes end (floors 50, 66, 90) in the accent; the roof caps in the line colour.
    for (const tube of setbacks) {
      const cap = plan(tube.x, tube.z, tube.size / 2, tube.top, v);
      ctx.fillStyle = colors.accent;
      ctx.globalAlpha = 0.14;
      ctx.fill(cap);
      ctx.strokeStyle = colors.accent;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.25;
      ctx.stroke(cap);
    }
    ctx.fillStyle = colors.fg;
    ctx.globalAlpha = 0.08;
    for (const tube of roofs) ctx.fill(plan(tube.x, tube.z, tube.size / 2, tube.top, v));

    strokeByDepth(caps, v, range, colors.fg, 1, 0.95, 0.4);
    strokeByDepth(columns, v, range, colors.fg, 1.4, 1, 0.3);

    // Annotations: leaders first, then markers on top.
    const points = anchors.map(([, point]) => project(point, v));
    if (!compact && boxes.length) {
      const leaders = new Path2D();
      for (const side of ['left', 'right']) {
        const ids = anchors.map((_, i) => i).filter((i) => anchors[i][2] === side);
        const tops = stackLabels(ids.map((i) => ({ y: points[i][1] - boxes[i].h / 2, h: boxes[i].h })), 8, size.height - 8);
        ids.forEach((i, j) => {
          const { w, h } = boxes[i];
          const x = side === 'left' ? 8 : size.width - 8 - w;
          const edge = side === 'left' ? x + w : x;
          const y = tops[j] + h / 2;
          labels[i].style.transform = `translate(${Math.round(x)}px, ${Math.round(tops[j])}px)`;
          leaders.moveTo(points[i][0], points[i][1]);
          leaders.lineTo(edge + (side === 'left' ? 10 : -10), y);
          leaders.lineTo(edge, y);
        });
      }
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = colors.muted;
      ctx.lineWidth = 0.75;
      ctx.stroke(leaders);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.accent;
    points.forEach(([x, y], i) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (compact) ctx.fillText(String(i + 1).padStart(2, '0'), x + 6, y - 5);
    });

    const state = reduce.matches ? 'STILL' : held ? 'PAUSED' : raf ? 'AUTO' : 'MANUAL';
    readout.textContent = `VIEW ${String(Math.round(view.azimuth) % 360).padStart(3, '0')}° · TILT ${Math.round(view.tilt)}° · ${state}`;
  }

  // Pointer: horizontal drag rotates; mouse vertical drag tilts; two pointers pinch-zoom.
  // touch-action: pan-y (CSS) leaves vertical swipes to the page (FR-025).
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    interrupt();
  });
  canvas.addEventListener('pointermove', (e) => {
    const previous = pointers.get(e.pointerId);
    if (!previous) return;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const before = Math.hypot(a.x - b.x, a.y - b.y);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [c, d] = [...pointers.values()];
      if (before > 0) control({ zoom: (view.zoom * Math.hypot(c.x - d.x, c.y - d.y)) / before });
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    control({
      azimuth: view.azimuth + (e.clientX - previous.x) * 0.4,
      tilt: e.pointerType === 'mouse' ? view.tilt + (e.clientY - previous.y) * 0.3 : view.tilt,
    });
  });
  for (const type of ['pointerup', 'pointercancel']) canvas.addEventListener(type, (e) => pointers.delete(e.pointerId));

  // Only trackpad pinch (ctrl+wheel) zooms; plain wheel keeps scrolling the page.
  canvas.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    control({ zoom: view.zoom * Math.exp(-e.deltaY * 0.01) });
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
    control(change);
  });

  new ResizeObserver(() => {
    const ratio = devicePixelRatio || 1;
    size = { width: viewport.clientWidth, height: viewport.clientHeight };
    canvas.width = Math.round(size.width * ratio);
    canvas.height = Math.round(size.height * ratio);
    compact = size.width < COMPACT;
    stage.classList.toggle('is-compact', compact);
    const style = getComputedStyle(canvas);
    colors = { fg: style.color, muted: style.getPropertyValue('--muted').trim(), accent: style.getPropertyValue('--accent').trim() };
    if (compact) for (const li of labels) li.style.transform = '';
    // Callouts are laid out in viewport pixels; the viewport may be centred inside the stage.
    labelLayer.style.left = compact ? '' : `${viewport.offsetLeft}px`;
    labelLayer.style.top = compact ? '' : `${viewport.offsetTop}px`;
    boxes = labels.map((li) => ({ w: li.offsetWidth, h: li.offsetHeight }));
    draw(); // resizing clears the canvas; redraw now rather than flash blank
  }).observe(viewport);

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    sync();
  }).observe(viewport);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);

  section.classList.add('is-live');
}
