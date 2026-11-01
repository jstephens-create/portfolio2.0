// Static checks on index.html: every in-page link and command target has a destination.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCommand } from '../js/command.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const hrefs = [...html.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]);

test('every in-page link points at an element that exists', () => {
  assert.ok(hrefs.length > 10);
  for (const id of hrefs) assert.ok(ids.has(id), `#${id}`);
});

test('every command name and alias reaches an existing section', () => {
  const { message } = parseCommand('help');
  const names = message.replace(/^Commands: |\.$/g, '').split(', ');
  for (const input of [...names, 'start', 'enter', 'about', 'whoami', 'tech', 'career planning', 'email']) {
    const result = parseCommand(input);
    if (result.action === 'navigate') assert.ok(ids.has(result.target.slice(1)), `${input} → ${result.target}`);
  }
});

test('nav, ticker source, and cutaway levels list the same six sections in order', () => {
  const navHrefs = [...html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)[0].matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  const levels = [...html.matchAll(/data-level="([^"]+)"/g)].map((m) => m[1]);
  const expected = ['identity', 'leadership', 'business', 'technology', 'career', 'contact'];
  assert.deepEqual(navHrefs, expected);
  assert.deepEqual(levels, expected);
  assert.doesNotMatch(html, /id="wellness|rfp-proposal/);
});
