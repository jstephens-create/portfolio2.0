import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runAudit } from '../js/audit.js';

const item = (requirement, status = 'pending', source) => ({ requirement, status, source });
const items = (section, keys, status) => keys.map((k) => item(`${section}.${k}`, status));

// A model that passes every check in v1 mode.
function baseModel(status = 'pending') {
  return {
    sections: [
      { id: 'identity', minimum: 0, items: items('identity', ['introduction', 'headshot', 'mission-statement'], status) },
      { id: 'leadership', minimum: 5, items: items('leadership', ['team-week', 'gifts-project', 'community-role', 'tea-host', 'dream-speech'], status) },
      { id: 'business', minimum: 4, items: items('business', ['client-project', 'consulting-company', 'rfp-proposal', 'engagement-days'], status) },
      { id: 'technology', minimum: 5, items: items('technology', ['web-app', 'geek-week', 'coding-clicked', 'debugging-growth', 'github-collaboration'], status) },
      { id: 'career', minimum: 4, items: items('career', ['career-plans', 'career-director', 'employer-workshops', 'target-roles'], status) },
      { id: 'wellness', minimum: 0, items: [] },
      { id: 'wellness-financial', minimum: 1, items: items('wellness-financial', ['financial-goals'], status) },
      { id: 'wellness-emotional', minimum: 1, items: items('wellness-emotional', ['affirmations'], status) },
      { id: 'wellness-mental', minimum: 1, items: items('wellness-mental', ['coping-strategies'], status) },
      { id: 'wellness-physical', minimum: 1, items: items('wellness-physical', ['habit-tracker'], status) },
      { id: 'contact', minimum: 0, items: [] },
    ],
    profile: [{ key: 'location', status: 'supplied' }, { key: 'github', status: 'supplied' }],
    images: [{ src: 'assets/svg/willis-elevation.svg', alt: 'Elevation drawing' }],
    facts: [
      { key: 'height-architectural', cls: 'verified', value: '442.1 m / 1,451 ft', source: 'https://www.skyscrapercenter.com/building/willis-tower/169' },
      { key: 'antenna-each', cls: 'pending', value: '', source: null },
    ],
    levels: [{ href: '#identity' }, { href: '#contact' }],
    sectionIds: ['entry', 'gis', 'descent', 'identity', 'leadership', 'business', 'technology', 'career', 'wellness',
      'wellness-financial', 'wellness-emotional', 'wellness-mental', 'wellness-physical', 'contact'],
    text: '233 South Wacker Drive, Chicago 60606 · 442.1 m / 1,451 ft · 41.87874° N, 87.63596° W · 1899–1914',
  };
}

const row = (results, check) => results.find((r) => r.check === check);
const statusOf = (model, check, mode) => row(runAudit(model, { mode }), check).status;

test('the base model passes in v1 with pending content as warn', () => {
  const results = runAudit(baseModel());
  for (const r of results) assert.notEqual(r.status, 'fail', `${r.check}: ${r.details.join('; ')}`);
  assert.equal(row(results, 'Pending content').status, 'warn');
});

test('section coverage counts only non-bonus items', () => {
  const m = baseModel();
  m.sections[1].items = [...items('leadership', ['team-week', 'gifts-project', 'community-role', 'tea-host']), item('leadership.bonus')];
  assert.equal(statusOf(m, 'Section coverage'), 'fail');
});

test('unknown requirement key fails', () => {
  const m = baseModel();
  m.sections[1].items.push(item('leadership.made-up'));
  assert.equal(statusOf(m, 'Requirement labels'), 'fail');
});

test('a requirement key used twice fails', () => {
  const m = baseModel();
  m.sections[1].items.push(item('leadership.team-week'));
  assert.equal(statusOf(m, 'Duplicate options'), 'fail');
});

test('external item without a source fails; with a source passes', () => {
  const m = baseModel();
  m.sections[1].items[0] = item('leadership.team-week', 'external');
  assert.equal(statusOf(m, 'External sources'), 'fail');
  m.sections[1].items[0] = item('leadership.team-week', 'external', 'Google Drive');
  assert.equal(statusOf(m, 'External sources'), 'pass');
});

test('pending profile entry warns in v1 and fails in release', () => {
  const m = baseModel('final');
  m.profile.push({ key: 'linkedin', status: 'pending' });
  assert.equal(statusOf(m, 'Profile links'), 'warn');
  assert.equal(statusOf(m, 'Profile links', 'release'), 'fail');
});

test('image without alt fails; empty alt (decorative) passes', () => {
  const m = baseModel();
  m.images.push({ src: 'a.svg', alt: '' });
  assert.equal(statusOf(m, 'Images'), 'pass');
  m.images.push({ src: 'b.webp', alt: null });
  assert.equal(statusOf(m, 'Images'), 'fail');
});

test('a verified fact without a source, or a pending fact with a value, fails', () => {
  const unsourced = baseModel();
  unsourced.facts.push({ key: 'height-tip', cls: 'verified', value: '527 m', source: null });
  assert.equal(statusOf(unsourced, 'Facts'), 'fail');
  const valued = baseModel();
  valued.facts.push({ key: 'caisson-depth', cls: 'pending', value: '80 ft', source: null });
  assert.equal(statusOf(valued, 'Facts'), 'fail');
});

test('a phone number fails; building address, heights, and coordinates do not', () => {
  assert.equal(statusOf(baseModel(), 'Forbidden contact data'), 'pass');
  for (const phone of ['(312) 555-0142', '312-555-0142', '312.555.0142']) {
    const m = baseModel();
    m.text += ` Call ${phone}`;
    assert.equal(statusOf(m, 'Forbidden contact data'), 'fail', phone);
  }
});

test('cutaway level pointing at a missing section fails', () => {
  const m = baseModel();
  m.levels.push({ href: '#basement' });
  assert.equal(statusOf(m, 'Cutaway levels'), 'fail');
});

test('release mode fails pending content and counts only final items', () => {
  assert.equal(statusOf(baseModel(), 'Pending content', 'release'), 'fail');
  assert.equal(statusOf(baseModel(), 'Section coverage', 'release'), 'fail');
  const done = runAudit(baseModel('final'), { mode: 'release' });
  for (const r of done) assert.equal(r.status, 'pass', `${r.check}: ${r.details.join('; ')}`);
});
