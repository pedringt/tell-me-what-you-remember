// Guardrails from docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md that are about CONTENT.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INCIDENTS, OPENING, UI, CLOSING_QUESTION, TAGS } from '../../judgment/content.js';

const spec = readFileSync(new URL('../../docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md', import.meta.url), 'utf8');

const TAG_RE = /\b(?:TRACE|READING|SAID|RECORD|REPORT|PROTOCOL R\d)\b:?/g;
const norm = (t) => t
  .replace(/^\s*>\s?/gm, '').replace(/[|*]/g, '').replace(/’/g, "'")
  .replace(TAG_RE, ' ').replace(/\s+/g, ' ').trim();
const SPEC = norm(spec);

// Every authored line in the game, with where it came from.
function allLines() {
  const out = [];
  const push = (where, ls) => ls.forEach((l) => out.push({ where, ...l }));
  OPENING.forEach((text) => out.push({ where: 'opening', tag: null, text }));
  for (const n of INCIDENTS) {
    push(`${n.id}.observation`, n.observation);
    push(`${n.id}.evelyn`, n.evelyn);
    if (n.historyPanel) push(`${n.id}.history`, n.historyPanel);
    if (n.familyPanel) push(`${n.id}.family`, n.familyPanel);
    n.protocol.lines.forEach((text) => out.push({ where: `${n.id}.protocol`, tag: null, text }));
    for (const q of n.inquiries) {
      push(`${n.id}.${q.id}`, q.result);
      if (q.cold) push(`${n.id}.${q.id}.cold`, q.cold);
      if (q.guardedResult) push(`${n.id}.${q.id}.guarded`, q.guardedResult);
    }
    for (const d of n.decisions) push(`${n.id}.decision.${d.id}`, d.consequence);
  }
  return out;
}

test('story text matches the spec, sentence by sentence (the game cannot drift from its source)', () => {
  const misses = [];
  for (const l of allLines()) {
    // The speaker's name is added on screen so the player knows who is talking; the spec's
    // table carries it in the row label instead.
    const bare = l.text.replace(/^Jenny: (?=")/, '');
    const sentences = norm(bare).split(/(?<=[.?!])\s+(?=[A-Z"'])/).map((s) => s.trim()).filter(Boolean);
    for (const s of sentences) if (!SPEC.includes(s)) misses.push(`${l.where}: ${s}`);
  }
  assert.deepEqual(misses, []);
});

test('the word "dementia" appears nowhere on screen', () => {
  const everything = JSON.stringify({ INCIDENTS, OPENING, UI: Object.values(UI).map((v) => (typeof v === 'function' ? v(1, 3) : v)), CLOSING_QUESTION });
  assert.doesNotMatch(everything, /dementia|alzheimer|diagnos|senile/i);
});

test('the only cognitive signal is the plain family care note in incident 2', () => {
  const memory = allLines().filter((l) => /memory/i.test(l.text));
  const where = memory.map((l) => l.where);
  // The READING "Possible memory lapse" is the system's inference; the care note is the record.
  assert.ok(where.includes('i2.history'));
  assert.ok(!where.some((w) => w.startsWith('i1.')), 'nothing about memory in incident 1');
  const note = INCIDENTS[1].historyPanel[0];
  assert.equal(note.text, 'Care note (family): recent memory concerns reported.');
  assert.doesNotMatch(note.text, /severe|stage|early|mild|advanced|progress/i);
});

test('every line uses only the five tags, or none', () => {
  for (const l of allLines()) assert.ok(l.tag === null || TAGS.includes(l.tag), `${l.where} has tag ${l.tag}`);
});

test('the system never presents its inference as fact: READING lines carry the reading tag and a hedge', () => {
  const readings = allLines().filter((l) => l.tag === 'READING');
  assert.equal(readings.length, 3);
  for (const r of readings) assert.match(r.text, /\b(possible|moderate)\b/i, r.where);
});

test('only perceivable sensors appear as traces: door, room motion, kettle, bathroom impact', () => {
  const obs = INCIDENTS.flatMap((n) => n.observation).filter((l) => l.tag === 'TRACE');
  for (const l of obs) assert.match(l.text, /FRONT ENTRY|MOTION|KETTLE|BATHROOM IMPACT/, l.text);
  const everything = JSON.stringify(INCIDENTS);
  assert.doesNotMatch(everything, /camera|bedroom|video|microphone/i);
});

test('every trace, record and report inquiry result is authored to cut both ways', () => {
  for (const n of INCIDENTS) {
    for (const q of n.inquiries) {
      if (q.evelyn) continue;
      assert.equal(q.cutsBothWays, true, `${n.id}.${q.id} must be authored two-sided`);
    }
  }
});

test('Anna never speaks; Michael appears only in the incident 3 family instructions', () => {
  const lines = allLines();
  // No SAID line is attributed to Anna or Michael, and Anna only ever appears as a quoted instruction (REPORT).
  for (const l of lines) {
    if (/^Anna:/.test(l.text)) { assert.equal(l.tag, 'REPORT'); assert.equal(l.where, 'i3.family'); }
    if (/Michael/.test(l.text)) assert.equal(l.where, 'i3.family', `Michael appears outside the family panel: ${l.where}`);
  }
  assert.ok(lines.some((l) => /^Anna:/.test(l.text)));
});

test('Anna\'s instruction is narrow: falls and hospital visits only', () => {
  const anna = INCIDENTS[2].familyPanel.find((l) => /^Anna:/.test(l.text));
  assert.match(anna.text, /falls and hospital visits\. Nothing else/);
});

test('no verdict language anywhere in the ending or interface', () => {
  const ui = [...Object.values(UI).map((v) => (typeof v === 'function' ? v(1, 3) : v)), CLOSING_QUESTION].join(' ');
  assert.doesNotMatch(ui, /\b(correct|incorrect|right|wrong|best|optimal|score|mistake|good choice|bad choice|should have)\b/i);
});

test('the incident 3 decision labels and defaults match the spec', () => {
  const d = INCIDENTS[2].decisions;
  assert.deepEqual(d.map((x) => x.label), ['Take no action', 'Request mobility check', 'Notify Anna']);
  assert.deepEqual(d.map((x) => x.level), ['accept', 'adjust', 'escalate']);
  assert.equal(d.filter((x) => x.isDefault).length, 1);
  assert.equal(d.find((x) => x.isDefault).level, 'escalate');
});

test('each incident has four inquiries and three decisions with one system default', () => {
  for (const n of INCIDENTS) {
    assert.equal(n.inquiries.length, 4, n.id);
    assert.equal(n.decisions.length, 3, n.id);
    assert.equal(n.decisions.filter((d) => d.isDefault).length, 1, n.id);
    assert.equal(n.unseenOrder.length, 3, n.id);
    for (const id of n.unseenOrder) {
      const q = n.inquiries.find((x) => x.id === id);
      assert.ok(q, `${n.id} unseen ${id} exists`);
      assert.ok(!q.evelyn, `${n.id}: Evelyn's own words are never the unseen item`);
    }
  }
});

test('the interface makes no network requests and uses no storage', () => {
  const src = ['app.js', 'engine.js', 'content.js'].map((f) => readFileSync(new URL(`../../judgment/${f}`, import.meta.url), 'utf8')).join('\n');
  // Comments may mention these words; strip comments before checking.
  const code = src.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(code, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB|document\.cookie/);
});
