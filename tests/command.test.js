import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCommand } from '../js/command.js';

const UNKNOWN = 'Unknown command. Try: identity, technology, leadership, business, career, resume, contact, tower.';

test('normalizes case, whitespace, and prompt prefixes', () => {
  for (const input of ['leadership', '  LEADERSHIP ', '/leadership', '> Leadership', '$ leadership']) {
    assert.equal(parseCommand(input).target, '#leadership', input);
  }
});

test('every name and alias reaches its destination with its response', () => {
  const cases = [
    [['identity', 'about', 'whoami'], '#identity', 'Opening Identity.'],
    [['technology', 'tech', 'skills'], '#technology', 'Opening Technology.'],
    [['leadership'], '#leadership', 'Opening Leadership.'],
    [['business'], '#business', 'Opening Business.'],
    [['career', 'career planning'], '#career', 'Opening Career Planning.'],
    [['contact', 'email'], '#contact', 'Opening Contact.'],
    [['tower', 'willis', 'model'], '#gis', 'Opening Willis Tower.'],
  ];
  for (const [inputs, target, message] of cases) {
    for (const input of inputs) {
      assert.deepEqual(parseCommand(input), { action: 'navigate', target, message }, input);
    }
  }
});

test('resume and cv return the resume action', () => {
  for (const input of ['resume', 'cv']) {
    assert.deepEqual(parseCommand(input), { action: 'resume', target: null, message: 'Opening resume in a new tab.' });
  }
});

test('help lists every command name', () => {
  for (const input of ['help', '?', 'ls']) {
    const { action, message } = parseCommand(input);
    assert.equal(action, 'help');
    for (const name of ['identity', 'technology', 'leadership', 'business', 'career', 'resume', 'contact', 'tower', 'help']) {
      assert.match(message, new RegExp(`\\b${name}\\b`), name);
    }
  }
});

test('removed sections and stages are no longer commands', () => {
  for (const input of ['wellness', 'rfp', 'begin', 'descent', 'experience']) assert.equal(parseCommand(input).action, 'help', input);
});

test('empty and unknown input return the unknown-command help', () => {
  for (const input of ['', '   ', 'xyz', 'lead', undefined]) {
    assert.deepEqual(parseCommand(input), { action: 'help', target: null, message: UNKNOWN });
  }
});
