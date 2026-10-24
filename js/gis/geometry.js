// Willis Tower wireframe geometry, built only from the facts table (feet, y up, north = -z).

const RAD = Math.PI / 180;
const REQUIRED = ['tube-size', 'height-architectural', 'floors-above', 'setback-50', 'setback-66', 'setback-90'];

// Grid positions, north row first. Which tubes stop at which setback comes from
// research.md (secondary source); the setback floor numbers come from the facts.
const TUBES = [
  ['NW', -1, -1], ['N', 0, -1], ['NE', 1, -1],
  ['W', -1, 0], ['C', 0, 0], ['E', 1, 0],
  ['SW', -1, 1], ['S', 0, 1], ['SE', 1, 1],
];
const ENDS_AT = { NW: 'setback-50', SE: 'setback-50', NE: 'setback-66', SW: 'setback-66', N: 'setback-90', E: 'setback-90', S: 'setback-90' };

export const clampZoom = (z) => Math.min(4, Math.max(0.5, z));
export const clampTilt = (t) => Math.min(60, Math.max(5, t));

function ring(segments, x0, z0, x1, z1, y) {
  segments.push([x0, y, z0, x1, y, z0], [x1, y, z0, x1, y, z1], [x1, y, z1, x0, y, z1], [x0, y, z1, x0, y, z0]);
}

export function buildTower(facts) {
  const value = (key) => facts[key]?.value;
  for (const key of REQUIRED) {
    if (!facts[key] || facts[key].cls === 'pending' || !Number.isFinite(value(key))) return null;
  }

  const size = value('tube-size');
  const floors = value('floors-above');
  const perFloor = value('height-architectural') / floors; // approximate: even floor spacing

  const tubes = TUBES.map(([name, col, row]) => {
    const topFloor = ENDS_AT[name] ? value(ENDS_AT[name]) : floors;
    return { name, x: col * size, z: row * size, size, topFloor, top: topFloor * perFloor };
  });

  const segments = [];
  const floorSegments = [];
  for (const t of tubes) {
    const [x0, x1, z0, z1] = [t.x - size / 2, t.x + size / 2, t.z - size / 2, t.z + size / 2];
    for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) segments.push([x, 0, z, x, t.top, z]);
    ring(segments, x0, z0, x1, z1, 0);
    ring(segments, x0, z0, x1, z1, t.top);
    for (let f = 1; f < t.topFloor; f++) ring(floorSegments, x0, z0, x1, z1, f * perFloor);
  }

  // Schematic block and street lines: interpretation, not surveyed.
  const base = size * 3;
  const block = base / 2 + size;
  const ground = [];
  ring(ground, -block, -block, block, block, 0);

  return { tubes, segments, floorSegments, ground, base, height: Math.max(...tubes.map((t) => t.top)), perFloor };
}

// Orthographic drafting view: rotate about the vertical axis, then tilt toward the viewer.
export function project([x, y, z], { azimuth, tilt, zoom, width, height, center, span }) {
  const a = azimuth * RAD;
  const t = tilt * RAD;
  const x1 = x * Math.cos(a) - z * Math.sin(a);
  const z1 = x * Math.sin(a) + z * Math.cos(a);
  const y0 = y - center;
  const s = (zoom * Math.min(width, height)) / span;
  return [width / 2 + x1 * s, height / 2 - (y0 * Math.cos(t) - z1 * Math.sin(t)) * s, y0 * Math.sin(t) + z1 * Math.cos(t)];
}
