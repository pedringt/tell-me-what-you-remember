import test from 'node:test';
import assert from 'node:assert/strict';
import { TEXT, EVELYN_TOPICS, VISIT_TASKS, THERAPY_BEHAVIORS, ARTIFACTS } from '../../episode01/content.js';
import { createHarness } from './helpers.js';

const entries = Object.entries(TEXT);

test('every authored line declares whether it is working, placeholder or system copy', () => {
  for (const [key, e] of entries) {
    assert.ok(['working', 'placeholder', 'system'].includes(e.status), `${key} has status ${e.status}`);
    assert.ok(e.speaker && e.text, `${key} needs a speaker and text`);
  }
});

test('only the wording the design docs give as first-build wording is marked working', () => {
  const working = entries.filter(([, e]) => e.status === 'working').map(([k]) => k);
  assert.deepEqual(working, ['msg_michael_body']);
  assert.equal(
    TEXT.msg_michael_body.text,
    'Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again.',
  );
});

test('no line names a diagnosis or a dementia symptom (nothing clinical before authored progression)', () => {
  const forbidden = /(dementia|alzheimer|diagnos|senile|memory loss|cognitive|forgetful|declin)/i;
  for (const [key, e] of entries) {
    assert.doesNotMatch(e.text, forbidden, `${key} must not name a clinical condition`);
  }
});

test('Robert is referred to only in the past tense in the first slice', () => {
  const present = /\bRobert (is|says|likes|loves|wants|hates|does|has|will|would like|can)\b|\bRobert's (coming|waiting|here|home)\b/i;
  for (const [key, e] of entries) {
    assert.doesNotMatch(e.text, present, `${key} must not use Robert in the present tense`);
  }
});

test('no new named people: dialogue only names Evelyn, Anna, Michael, Robert and Jenny', () => {
  const allowed = new Set(['Evelyn', 'Anna', 'Michael', 'Robert', 'Jenny', 'Saturday', 'Robert']);
  for (const [key, e] of entries) {
    if (!['EVELYN', 'JENNY', 'MICHAEL'].includes(e.speaker)) continue;
    // Capitalised words that are not the first word of a sentence.
    const words = [...e.text.matchAll(/(?<![.!?]\s)(?<!^)\b([A-Z][a-z]+)\b/g)].map((m) => m[1]);
    for (const w of words) assert.ok(allowed.has(w), `${key} names "${w}", who is not established canon`);
  }
});

test('Michael\'s message does not explain the estrangement', () => {
  const t = TEXT.msg_michael_body.text;
  assert.doesNotMatch(t, /wedding|speech|partner|boyfriend|husband|gay|estrang|years/i);
});

test('the opening does not front-load exposition: two short system lines, then Evelyn', () => {
  const h = createHarness();
  const first = h.state.transcript;
  assert.equal(first.length, 2);
  assert.ok(first.every((l) => l.speaker === 'SYSTEM'));
});

test('first surfaces are exactly TASKS, PROFILE, CONTACTS, INBOX, HELP (no MEMORY / ARCHIVE / metrics)', () => {
  const h = createHarness();
  assert.deepEqual(h.state.player.visibleSurfaces, ['TASKS', 'PROFILE', 'CONTACTS', 'INBOX', 'HELP']);
});

test('profile entries carry source labels; one starts VERIFIED and the rest are CLIENT reports', () => {
  const h = createHarness();
  h.act('QUESTION_PERSON', { personId: 'evelyn', topicId: 'introduction' });
  h.act('QUESTION_PERSON', { personId: 'evelyn', topicId: 'contacts' });
  h.act('SAVE_PROFILE_FIELD', { topicId: 'contacts' });
  const p = h.state.slice.profile;
  assert.equal(p[0].source, 'VERIFIED RECORD');
  const anna = p.find((x) => x.id === 'contact_anna');
  assert.equal(anna.source, 'CLIENT');
  assert.equal(anna.status, 'unverified');
  assert.match(anna.label, /Anna - daughter/);
  assert.match(anna.value, /Limited availability/);
  assert.match(h.transcriptText(), /Saved as CLIENT REPORT/);
});

test('artifact ids and topic/task tables match the design docs', () => {
  for (const id of ['care_profile_v1', 'therapeutic_support_agreement', 'michael_boundary_message_early', 'first_mail_scan', 'first_home_helper_summary', 'repeated_request_events']) {
    assert.ok(ARTIFACTS[id], id);
  }
  assert.equal(Object.keys(VISIT_TASKS).length, 5);
  assert.equal(Object.keys(THERAPY_BEHAVIORS).length, 3);
  assert.ok(Object.values(EVELYN_TOPICS).filter((t) => t.required).length >= 4);
});
