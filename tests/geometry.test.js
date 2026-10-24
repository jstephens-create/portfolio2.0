import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTower, project, clampZoom, clampTilt } from '../js/gis/geometry.js';

const fact = (value, cls = 'verified') => ({ value, cls });
const FACTS = {
  'tube-size': fact(75),
  'height-architectural': fact(1451),
  'floors-above': fact(108),
  'setback-50': fact(50, 'approximate'),
  'setback-66': fact(66, 'approximate'),
  'setback-90': fact(90, 'approximate'),
};

test('nine tubes on a 75 ft grid, north up', () => {
  const { tubes } = buildTower(FACTS);
  assert.deepEqual(tubes.map((t) => t.name), ['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE']);
  const nw = tubes[0];
  const se = tubes[8];
  assert.equal(se.x - nw.x, 150);
  assert.ok(nw.z < se.z, 'north has smaller z');
  for (const t of tubes) assert.equal(t.size, 75);
});

test('setbacks leave 9, 7, 5, then 2 tubes', () => {
  const { tubes } = buildTower(FACTS);
  const above = (floor) => tubes.filter((t) => t.topFloor > floor).map((t) => t.name);
  assert.equal(tubes.filter((t) => t.topFloor >= 50).length, 9);
  assert.equal(above(50).length, 7);
  assert.equal(above(66).length, 5);
  assert.deepEqual(above(90).sort(), ['C', 'W']);
});

test('tube top height = setback floor × (architectural height ÷ floors above)', () => {
  const { tubes, height } = buildTower(FACTS);
  const perFloor = 1451 / 108;
  for (const t of tubes) assert.ok(Math.abs(t.top - t.topFloor * perFloor) < 1e-9, t.name);
  assert.ok(Math.abs(height - 1451) < 1e-9);
});

test('base measures 225 × 225 ft', () => {
  assert.equal(buildTower(FACTS).base, 225);
});

test('returns null when a required fact is pending or missing', () => {
  for (const key of Object.keys(FACTS)) {
    assert.equal(buildTower({ ...FACTS, [key]: fact(null, 'pending') }), null, `${key} pending`);
    const missing = { ...FACTS };
    delete missing[key];
    assert.equal(buildTower(missing), null, `${key} missing`);
  }
});

test('produces line segments for every tube', () => {
  const { segments } = buildTower(FACTS);
  assert.ok(segments.length > 9 * 4);
  for (const s of segments) assert.equal(s.length, 6);
});

test('a full 360° turn returns the same screen point', () => {
  const view = { azimuth: 37, tilt: 25, zoom: 1.5, width: 800, height: 600, center: 700, span: 1600 };
  const p = [40, 900, -60];
  const a = project(p, view);
  const b = project(p, { ...view, azimuth: view.azimuth + 360 });
  for (let i = 0; i < 2; i++) assert.ok(Math.abs(a[i] - b[i]) < 1e-9);
});

test('zoom stays within 0.5–4× and tilt within 5°–60°', () => {
  assert.equal(clampZoom(0.1), 0.5);
  assert.equal(clampZoom(9), 4);
  assert.equal(clampZoom(2), 2);
  assert.equal(clampTilt(-10), 5);
  assert.equal(clampTilt(80), 60);
  assert.equal(clampTilt(30), 30);
});
