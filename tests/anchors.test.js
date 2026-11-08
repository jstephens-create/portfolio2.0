// Static checks on index.html: every in-page link and command target has a destination.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parseCommand } from '../js/command.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const hrefs = [...html.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]);

test('every in-page link points at an element that exists', () => {
  assert.ok(hrefs.length > 5);
  for (const id of hrefs) assert.ok(ids.has(id), `#${id}`);
});

test('every command name and alias reaches an existing section', () => {
  const { message } = parseCommand('help');
  const names = message.replace(/^Commands: |\.$/g, '').split(', ');
  for (const input of [...names, 'about', 'whoami', 'tech', 'skills', 'career planning', 'email', 'willis', 'model']) {
    const result = parseCommand(input);
    if (result.action === 'navigate') assert.ok(ids.has(result.target.slice(1)), `${input} → ${result.target}`);
  }
});

test('nav lists the six sections in narrative order; the descent is gone', () => {
  const navHrefs = [...html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)[0].matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(navHrefs, ['identity', 'resume', 'technology', 'leadership', 'career', 'contact']);
  assert.doesNotMatch(html, /id="descent"|data-level=|id="wellness|rfp-proposal/);
});

test('assignment sections keep their anchors and minimums (Business sits inside Leadership)', () => {
  for (const [id, minimum] of [['leadership', 5], ['business', 4], ['technology', 5], ['career', 4]]) {
    assert.match(html, new RegExp(`<section id="${id}"[^>]*data-section data-minimum="${minimum}"`), id);
  }
  const leadership = html.slice(html.indexOf('<section id="leadership"'), html.indexOf('<section id="career"'));
  assert.ok(leadership.includes('<section id="business"'), 'business is nested in leadership');
});

test('resume actions link to a file that exists, or are pending and not links', () => {
  const markup = html.replace(/<!--[\s\S]*?-->/g, ''); // the comment shows the replacement markup
  const resume = [...markup.matchAll(/<(a|span)\b[^>]*data-profile="resume-(?:view|download)"[^>]*>/g)];
  assert.equal(resume.length, 3, 'view and download in Identity, plus the Resume section link');
  for (const [element, tag] of resume) {
    if (element.includes('data-status="pending"')) {
      assert.equal(tag, 'span', `pending entries are never links: ${element}`);
      continue;
    }
    const href = element.match(/href="([^"]+)"/)?.[1];
    assert.ok(href && existsSync(new URL(`../${href}`, import.meta.url)), `${href} exists`);
  }
});
