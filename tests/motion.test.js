import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapOffset } from '../js/nav.js';
import { stackLabels } from '../js/gis/render.js';
import { nearestLevel } from '../js/descent.js';
import { stepAzimuth, project } from '../js/gis/geometry.js';

test('ticker offset wraps within one copy in both directions', () => {
  assert.equal(wrapOffset(10, 300), 10);
  assert.equal(wrapOffset(305, 300), 5);
  assert.equal(wrapOffset(-5, 300), 295);
  assert.equal(wrapOffset(42, 0), 0, 'no period: no drift');
});

test('rotation follows elapsed time, wraps at 360°, and caps long gaps', () => {
const close = (a, b) => Math.abs(a - b) < 1e-9;
  assert.ok(close(stepAzimuth(0, 50, 4), 0.2));
  assert.ok(close(stepAzimuth(359.9, 50, 4), 0.1));
  assert.equal(stepAzimuth(10, 60_000, 4), stepAzimuth(10, 100, 4), 'a minute in a background tab is one capped step');
  assert.ok(close(stepAzimuth(10, -20, 4), 10));
  // Same total turn at 30 fps and 120 fps.
  let slow = 0;
  let fast = 0;
  for (let i = 0; i < 30; i++) slow = stepAzimuth(slow, 1000 / 30, 4);
  for (let i = 0; i < 120; i++) fast = stepAzimuth(fast, 1000 / 120, 4);
  assert.ok(close(slow, 4) && close(fast, 4));
});

test('perspective is optional, mild, and keeps the orthographic default', () => {
  const view = { azimuth: 30, tilt: 20, zoom: 1, width: 800, height: 1000, center: 725, span: 1669 };
  const near = [0, 725, 200];
  const far = [0, 725, -200];
  assert.deepEqual(project(near, view), project(near, { ...view, camera: 0 }));
  const o = project(near, view);
  const p = project(near, { ...view, camera: 3 });
  const q = project(far, { ...view, camera: 3 });
  assert.ok(Math.abs(p[1] - 500) > Math.abs(o[1] - 500), 'near points spread out');
  assert.ok(Math.abs(q[1] - 500) < Math.abs(project(far, view)[1] - 500), 'far points draw in');
  assert.ok(Math.abs(p[1] - 500) / Math.abs(o[1] - 500) < 1.1, 'within 10%');
});

test('labels are stacked without overlap, in order, inside the stage', () => {
  const boxes = [{ y: 100, h: 30 }, { y: 95, h: 30 }, { y: 110, h: 30 }, { y: 980, h: 30 }];
  const tops = stackLabels(boxes, 8, 1000);
  const sorted = boxes.map((b, i) => ({ top: tops[i], h: b.h })).sort((a, b) => a.top - b.top);
  for (let i = 1; i < sorted.length; i++) assert.ok(sorted[i].top >= sorted[i - 1].top + sorted[i - 1].h, 'no overlap');
  assert.ok(tops[1] < tops[0] && tops[0] < tops[2], 'keeps vertical order');
  assert.ok(Math.min(...tops) >= 8 && Math.max(...tops.map((t, i) => t + boxes[i].h)) <= 1000, 'inside bounds');
});

test('nearest level is the one closest to the viewport middle', () => {
  assert.equal(nearestLevel([100, 300, 500], 320), 1);
  assert.equal(nearestLevel([100, 300, 500], -50), 0);
  assert.equal(nearestLevel([], 10), -1);
});
