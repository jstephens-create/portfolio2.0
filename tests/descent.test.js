import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scrollProgress } from '../js/descent.js';

const H = 3000; // section height
const V = 1000; // viewport height

test('0 before the section, 1 after it', () => {
  assert.equal(scrollProgress(500, H, V), 0);
  assert.equal(scrollProgress(0, H, V), 0);
  assert.equal(scrollProgress(-(H - V), H, V), 1);
  assert.equal(scrollProgress(-5000, H, V), 1);
});

test('linear in between', () => {
  assert.equal(scrollProgress(-(H - V) / 2, H, V), 0.5);
  assert.equal(scrollProgress(-(H - V) / 4, H, V), 0.25);
});

test('same value at the same position whichever way it was reached', () => {
  const down = [0, -400, -800, -1200].map((t) => scrollProgress(t, H, V));
  const up = [-1200, -800, -400, 0].map((t) => scrollProgress(t, H, V)).reverse();
  assert.deepEqual(down, up);
});

test('a section no taller than the viewport switches from 0 to 1', () => {
  assert.equal(scrollProgress(10, V, V), 0);
  assert.equal(scrollProgress(0, V, V), 1);
});
