// Guardrails from the spec that are about BEHAVIOUR, plus an exhaustive walk.

import test from 'node:test';
import assert from 'node:assert/strict';
import { INCIDENTS } from '../../judgment/content.js';
import {
  newGame, begin, options, inquire, decide, next, accounting, unseenItem, MAX_INQUIRIES, TOTAL,
} from '../../judgment/engine.js';

const start = () => begin(newGame());
const ids = (s) => options(s).inquiries.map((q) => q.id);
const lastInquiry = (s) => [...s.log].reverse().find((b) => b.kind === 'inquiry');
const said = (b) => b.lines.map((l) => l.text).join(' ');

// Play an incident with the given inquiry ids and decision, then advance.
function play(s, taken, decisionId) {
  for (const id of taken) s = inquire(s, id);
  s = decide(s, decisionId);
  return next(s);
}

test('opens on the two-line card with nothing else on screen', () => {
  const s = newGame();
  assert.equal(s.phase, 'opening');
  assert.equal(s.log.length, 2);
  assert.equal(s.log.filter((b) => b.kind !== 'plain').length, 0);
});

test('two inquiries per incident, then no more: the third is refused', () => {
  let s = start();
  s = inquire(s, 'door_log');
  s = inquire(s, 'ask_evelyn');
  assert.equal(options(s).left, 0);
  assert.equal(options(s).inquiries.length, 0);
  const before = JSON.stringify(s);
  assert.equal(JSON.stringify(inquire(s, 'baseline')), before, 'a third inquiry changes nothing');
});

test('a decision is always available, even before any inquiry', () => {
  let s = start();
  assert.equal(options(s).decisions.length, 3);
  s = inquire(s, 'door_log');
  assert.equal(options(s).decisions.length, 3);
  s = inquire(s, 'ask_evelyn');
  assert.equal(options(s).decisions.length, 3);
});

test('incident 1: HISTORY unlocks only after the first inquiry, from the two starting options', () => {
  let s = start();
  assert.deepEqual(ids(s).sort(), ['ask_evelyn', 'door_log']);
  s = inquire(s, 'door_log');
  assert.deepEqual(ids(s).sort(), ['ask_evelyn', 'baseline', 'delivery']);
  assert.ok(s.log.some((b) => b.kind === 'note' && /HISTORY/.test(b.text)));
});

test('incident 1: the two history records cannot both be taken (the first inquiry must be a starting one)', () => {
  let s = start();
  assert.ok(!ids(s).includes('baseline') && !ids(s).includes('delivery'));
  s = inquire(s, 'baseline'); // not available yet
  assert.equal(options(s).left, MAX_INQUIRIES, 'nothing was taken');
});

test('asking Evelyn a second time gets the colder answer and spends the inquiry', () => {
  let s = start();
  s = inquire(s, 'ask_evelyn');
  const first = said(lastInquiry(s));
  s = inquire(s, 'ask_evelyn');
  const second = said(lastInquiry(s));
  assert.match(first, /newspaper/);
  assert.equal(second, '"I have answered that. I would like my crossword back."');
  assert.equal(options(s).left, 0);
});

test('no other inquiry can be repeated', () => {
  let s = start();
  s = inquire(s, 'door_log');
  assert.ok(!ids(s).includes('door_log'));
});

test('incident 2 shows the plain care note first, and offers all four inquiries at once', () => {
  let s = start();
  s = play(s, [], 'accept');
  const heading = s.log.findIndex((b) => b.kind === 'heading' && /Situation 2/.test(b.text));
  const care = s.log.findIndex((b, i) => i > heading && b.kind === 'panel' && b.title === 'HISTORY');
  const reading = s.log.findIndex((b, i) => i > heading && b.kind === 'lines');
  assert.ok(care > heading && care < reading, 'care note comes before the observation');
  assert.equal(s.log[care].lines[0].text, 'Care note (family): recent memory concerns reported.');
  assert.equal(ids(s).length, 4);
});

test('the care note is not shown in incident 1', () => {
  const s = start();
  assert.ok(!JSON.stringify(s.log).includes('memory concerns'));
});

test('incident 3 unlocks FAMILY INSTRUCTIONS, and only then', () => {
  let s = start();
  assert.ok(!JSON.stringify(s.log).includes('FAMILY INSTRUCTIONS'));
  s = play(s, [], 'accept');
  assert.ok(!JSON.stringify(s.log).includes('FAMILY INSTRUCTIONS'));
  s = play(s, [], 'accept');
  assert.ok(JSON.stringify(s.log).includes('FAMILY INSTRUCTIONS'));
});

test('guarded is set by escalating in incident 1, or by the family note in incident 2, and by nothing else', () => {
  const g = (d1, d2, d3) => {
    let s = start();
    s = play(s, [], d1); s = play(s, [], d2);
    s = decide(s, d3);
    return s.guarded;
  };
  assert.equal(g('accept', 'accept', 'accept'), false);
  assert.equal(g('adjust', 'adjust', 'adjust'), false);
  assert.equal(g('escalate', 'accept', 'accept'), true);
  assert.equal(g('accept', 'escalate', 'accept'), true);
  assert.equal(g('accept', 'accept', 'escalate'), false, 'escalating in incident 3 does not set guarded');
});

test('guarded changes what Evelyn says in incident 3, and nothing else the player can see', () => {
  const open = (d1, d2) => {
    let s = start(); s = play(s, [], d1); s = play(s, [], d2);
    return s;
  };
  const calm = inquire(open('accept', 'accept'), 'ask_evelyn');
  const guarded = inquire(open('escalate', 'accept'), 'ask_evelyn');
  assert.match(said(lastInquiry(calm)), /sack of flour/);
  assert.match(said(lastInquiry(guarded)), /little sensors/);
  // Every other inquiry is identical in both worlds.
  for (const id of ['sensor_detail', 'motion_since', 'earlier_notes']) {
    assert.equal(said(lastInquiry(inquire(open('accept', 'accept'), id))), said(lastInquiry(inquire(open('escalate', 'accept'), id))));
  }
});

test('the guarded change does not appear in incidents 1 or 2', () => {
  for (const askId of ['ask_evelyn']) {
    let s = start();
    s = inquire(s, askId);
    assert.match(said(lastInquiry(s)), /newspaper/);
  }
});

test('every decision has an immediate consequence and leaves the player able to continue', () => {
  for (let i = 0; i < TOTAL; i++) {
    for (const d of INCIDENTS[i].decisions) {
      let s = start();
      for (let k = 0; k < i; k++) s = play(s, [], 'accept');
      s = decide(s, d.id);
      const c = [...s.log].reverse().find((b) => b.kind === 'consequence');
      assert.ok(c && c.lines.length > 0, `${INCIDENTS[i].id}/${d.id}`);
      assert.equal(options(s).decided, true);
      assert.equal(options(s).decisions.length, 0, 'no second decision');
      assert.ok(next(s) !== s, 'can advance');
    }
  }
});

test('a decision cannot be made twice, and nothing advances before a decision', () => {
  let s = start();
  assert.equal(next(s), s, 'cannot advance without deciding');
  s = decide(s, 'accept');
  const before = JSON.stringify(s);
  assert.equal(JSON.stringify(decide(s, 'escalate')), before);
});

test('the system default is visible on exactly one decision in each incident', () => {
  let s = start();
  for (let i = 0; i < TOTAL; i++) {
    assert.equal(options(s).decisions.filter((d) => d.isDefault).length, 1);
    s = play(s, [], 'accept');
  }
});

test('the ending accounting is neutral: what you looked at, decided, what happened, the default, one unseen item', () => {
  let s = start();
  s = play(s, ['door_log', 'ask_evelyn'], 'adjust');
  s = play(s, ['delivery', 'ask_jenny'], 'accept');
  s = play(s, ['sensor_detail', 'motion_since'], 'escalate');
  assert.equal(s.phase, 'ending');
  const a = accounting(s);
  assert.equal(a.length, 3);
  assert.deepEqual(a[0].looked, ['Door log', 'Ask Evelyn']);
  assert.equal(a[0].decision, 'Enable door reminder');
  assert.equal(a[0].defaultLabel, 'Notify family');
  assert.equal(a[0].unseen.label, 'Routine baseline');
  assert.equal(a[1].unseen.label, 'Request history');
  assert.equal(a[2].unseen.label, 'Earlier notes');
});

test('the unseen item follows the fixed order and never depends on the decision', () => {
  for (let i = 0; i < TOTAL; i++) {
    const n = INCIDENTS[i];
    const paths = [[], [n.unseenOrder[0]], [n.unseenOrder[1]], [n.unseenOrder[0], n.unseenOrder[1]], [n.unseenOrder[1], n.unseenOrder[2]]];
    for (const taken of paths) {
      const expected = unseenItem(n, taken)?.label;
      const seen = new Set();
      for (const d of n.decisions) {
        let s = start();
        for (let k = 0; k < i; k++) s = play(s, [], 'accept');
        s = play(s, taken, d.id);
        for (let k = i + 1; k < TOTAL; k++) s = play(s, [], 'accept');
        seen.add(accounting(s)[i].unseen.label);
      }
      assert.deepEqual([...seen], [expected], `${n.id} path ${taken.join(',') || '(none)'}`);
    }
  }
});

test('Evelyn\'s own words are never the unseen item, even when the player never asked her', () => {
  let s = start();
  for (let i = 0; i < TOTAL; i++) s = play(s, [], 'accept');
  for (const a of accounting(s)) assert.ok(!/^Ask Evelyn/.test(a.unseen.label), a.unseen.label);
});

test('there is always something unopened to show, because only two of four can be taken', () => {
  for (const n of INCIDENTS) {
    const nonEvelyn = n.unseenOrder;
    for (const pair of [[nonEvelyn[0], nonEvelyn[1]], [nonEvelyn[1], nonEvelyn[2]], [nonEvelyn[0], nonEvelyn[2]]]) {
      assert.ok(unseenItem(n, pair), `${n.id} with ${pair}`);
    }
  }
});

test('all 27 decision combinations play through to a well-formed ending', () => {
  const levels = ['accept', 'adjust', 'escalate'];
  let count = 0;
  for (const a of levels) for (const b of levels) for (const c of levels) {
    let s = start();
    s = play(s, [], a); s = play(s, [], b); s = play(s, [], c);
    assert.equal(s.phase, 'ending');
    const acc = accounting(s);
    acc.forEach((row) => { assert.ok(row.decision); assert.ok(row.happened.length); assert.ok(row.unseen); });
    count += 1;
  }
  assert.equal(count, 27);
});

test('exhaustive: every legal inquiry sequence in every incident stays within the rules', () => {
  // depth-first over inquiries (0, 1 or 2), from a fresh start of each incident, guarded and not.
  let paths = 0;
  for (const guarded of [false, true]) {
    for (let i = 0; i < TOTAL; i++) {
      let base = start();
      for (let k = 0; k < i; k++) base = play(base, [], 'accept');
      base = { ...base, guarded };
      const walk = (s, depth) => {
        const o = options(s);
        assert.ok(o.left >= 0 && o.left <= MAX_INQUIRIES);
        assert.equal(o.decisions.length, 3, 'decision always available');
        paths += 1;
        if (depth === MAX_INQUIRIES) { assert.equal(o.inquiries.length, 0); return; }
        for (const q of o.inquiries) walk(inquire(s, q.id), depth + 1);
      };
      walk(base, 0);
    }
  }
  assert.ok(paths > 60, `walked ${paths} paths`);
});

test('the engine is deterministic and never mutates the state it is given', () => {
  const s = start();
  const snap = JSON.stringify(s);
  const a = inquire(s, 'door_log');
  const b = inquire(s, 'door_log');
  assert.equal(JSON.stringify(s), snap, 'input untouched');
  assert.equal(JSON.stringify(a), JSON.stringify(b), 'same input, same output');
});
