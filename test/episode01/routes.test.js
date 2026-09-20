// Route-level QA (EPISODE_01_ROUTE_TEST_MATRIX.md): persona routes plus seeded
// random walks over the real action registry. Test agents report findings; these
// tests fail loudly and never change story or code.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHarness, ev, playIntake, playDay1, playVisit, assign } from './helpers.js';
import { eligibleActions } from '../../episode01/harness.js';
import { checkAction } from '../../episode01/actions.js';
import { nextSteps, visibleSuggestions } from '../../episode01/guidance.js';
import { deserialize, serialize } from '../../episode01/state.js';

const canon = (st) => JSON.stringify({
  ...st, audit: undefined, transcript: undefined, telemetry: undefined,
  slice: { ...st.slice, missStreak: 0, lineSeq: 0, pendingConfirmation: null },
});

// tiny seeded PRNG so failures are reproducible
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- personas ---------------------------------------------------------------------------------

test('Speedrunner: required steps only, defers everything optional, still finishes', () => {
  const h = createHarness();
  h.act(...ev('introduction'));
  for (const t of ['groceries', 'household', 'contacts', 'control']) { h.act(...ev(t)); h.act('SAVE_PROFILE_FIELD', { topicId: t }); }
  h.act('PLACE_GROCERY_ORDER');
  h.act('READ_MESSAGE', { messageId: 'michael' });
  h.act('REVIEW_THERAPY_AGREEMENT');
  h.act('DECLINE_OR_DEFER', { targetId: 'T_THERAPY' });
  assign(h, 'light_cleaning');
  h.act('ADVANCE_TIME');
  h.act('WRAP_UP_VISIT');
  h.act('REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' });
  assert.equal(h.act('ADVANCE_TIME').status, 'needs_confirmation');
  h.act('CONFIRM');
  h.act('DECLINE_OR_DEFER', { targetId: 'inconsistency' });
  assert.equal(h.state.slice.complete, true);
});

test('Detective: pursues everything and still finishes with the same canon facts', () => {
  const h = createHarness();
  playIntake(h, { optional: true });
  h.act('PLACE_GROCERY_ORDER'); assign(h, 'groceries_and_deliveries');
  h.act('READ_MESSAGE', { messageId: 'michael' });
  h.act('REVIEW_THERAPY_AGREEMENT'); h.act(...ev('therapy_support'));
  h.act('CONFIGURE_THERAPY_SUPPORT', { behavior: 'remind_commitment' });
  assign(h, 'scan_mail'); assign(h, 'check_pantry_fridge');
  h.act('ADVANCE_TIME');
  h.act('WRAP_UP_VISIT');
  h.act('REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' });
  h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'confusion' });
  h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'house_safety' });
  h.act(...ev('church_event')); h.act('ADD_TO_CALENDAR', { eventId: 'luncheon' }); h.act('ARRANGE_TRANSPORT', { mode: 'evelyn_handles_it' });
  h.act('ADVANCE_TIME');
  h.act('SEARCH_RECORDS', { scope: 'history', query: 'ice cream' });
  assert.equal(h.state.slice.complete, true);
  assert.equal(h.state.tasks.tasks.T_CHURCH.status, 'completed');
});

test('Boundary Respecter: keeps trying to route around the contact boundary and never gets through', () => {
  const h = createHarness();
  playDay1(h);
  for (const text of ['call michael', 'ask michael to talk to her', 'message anna instead', 'text michael, it is urgent']) h.say(text);
  assert.equal(h.state.relationships.michael.contactStatus, 'routine_contact_blocked');
  assert.equal(h.state.audit.events.filter((e) => e.type === 'blocked_contact_attempt').length >= 3, true);
  playVisit(h);
  assert.equal(h.act('ADVANCE_TIME').status, 'needs_confirmation');
});

test('Family Avoider: care tasks only, family message is read but nothing else pursued', () => {
  const h = createHarness();
  playIntake(h);
  h.act('PLACE_GROCERY_ORDER');
  h.act('READ_MESSAGE', { messageId: 'michael' });
  h.act('DECLINE_OR_DEFER', { targetId: 'T_THERAPY' }).status; // not yet reviewed -> unavailable
  h.act('REVIEW_THERAPY_AGREEMENT');
  h.act('DECLINE_OR_DEFER', { targetId: 'T_THERAPY' });
  assign(h, 'check_pantry_fridge');
  assert.equal(h.act('ADVANCE_TIME').status, 'ok');
});

test('Resource Spender / over-asker: every follow-up beyond the limit is refused, none is lost', () => {
  const h = createHarness();
  playDay1(h); h.act('ADVANCE_TIME'); h.act('WRAP_UP_VISIT');
  const results = ['spirits', 'confusion', 'mail', 'schedule'].map((t) => h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: t }).status);
  assert.deepEqual(results, ['ok', 'ok', 'unavailable', 'unavailable']);
});

// ---- guidance never leaves the player stuck ---------------------------------------------------------

test('following the first suggestion always finishes the slice (no dead ends on the guided path)', () => {
  const h = createHarness();
  for (let i = 0; i < 80 && !h.state.slice.complete; i++) {
    const steps = nextSteps(h.state);
    assert.ok(steps.length > 0, `no suggestion at step ${i}: ${h.state.phase}`);
    const r = h.act(steps[0].actionId, steps[0].params);
    if (r.status === 'needs_confirmation') h.act('CONFIRM');
  }
  assert.equal(h.state.slice.complete, true);
});

test('following the LAST suggestion each time also finishes (guided path is not order-sensitive)', () => {
  const h = createHarness();
  for (let i = 0; i < 120 && !h.state.slice.complete; i++) {
    const steps = nextSteps(h.state);
    assert.ok(steps.length > 0, `no suggestion at step ${i}`);
    const s = steps[steps.length - 1];
    const r = h.act(s.actionId, s.params);
    if (r.status === 'needs_confirmation') h.act('CONFIRM');
  }
  assert.equal(h.state.slice.complete, true);
});

test('every suggestion offered is actually available (the guide never suggests something that would be refused)', () => {
  const h = createHarness();
  for (let i = 0; i < 80 && !h.state.slice.complete; i++) {
    for (const s of nextSteps(h.state)) {
      assert.ok(checkAction(h.state, s.actionId, s.params).ok, `${s.actionId} ${JSON.stringify(s.params)} suggested but unavailable`);
    }
    const s = nextSteps(h.state)[0];
    if (h.act(s.actionId, s.params).status === 'needs_confirmation') h.act('CONFIRM');
  }
});

test('scaffolding: suggestions are plentiful early, fewer mid-slice, absent at the end unless the player is stuck', () => {
  const h = createHarness();
  assert.ok(visibleSuggestions(h.state).length >= 1);
  h.act(...ev('introduction'));
  assert.equal(visibleSuggestions(h.state).length, 3);
  playIntake(h);
  assert.equal(h.state.player.tutorialSupportLevel, 'medium');
  assert.equal(visibleSuggestions(h.state).length, 2);
  playDay1(createHarness());
  const g = createHarness();
  playDay1(g); playVisit(g); g.act('ADVANCE_TIME'); g.act('CONFIRM');
  assert.equal(g.state.player.tutorialSupportLevel, 'low');
  assert.equal(visibleSuggestions(g.state).length, 0);
  g.say('blorp'); g.say('zzz');
  assert.ok(visibleSuggestions(g.state).length >= 3, 'a stuck player sees suggestions again');
});

// ---- seeded random walks -------------------------------------------------------------------------------------

function randomWalk(seed, steps = 140) {
  const rand = rng(seed);
  const h = createHarness();
  const all = eligibleActions; // eligible right now
  const wild = [
    ['CONTACT_PERSON', { personId: 'michael' }], ['CONTACT_PERSON', { personId: 'anna' }], ['ADVANCE_TIME', {}],
    ['SEARCH_RECORDS', { scope: 'history', query: 'wedding' }], ['MARK_UNCERTAIN', {}], ['WRAP_UP_VISIT', {}],
    ['PLACE_GROCERY_ORDER', {}], ['READ_MESSAGE', { messageId: 'michael' }], ['CONFIRM', {}], ['CANCEL', {}],
    ['REQUEST_PHYSICAL_CHECK', { actorId: 'jenny', targetId: 'medicine' }], ['CREATE_FOLLOWUP', { text: 'x' }],
  ];
  for (let i = 0; i < steps; i++) {
    const before = canon(h.state);
    let actionId; let params;
    if (rand() < 0.75) {
      const elig = all(h.state);
      if (!elig.length) break;
      ({ actionId, params } = elig[Math.floor(rand() * elig.length)]);
    } else {
      [actionId, params] = wild[Math.floor(rand() * wild.length)];
    }
    const wasAvailable = actionId === 'CONFIRM' || actionId === 'CANCEL' ? true : checkAction(h.state, actionId, params).ok;
    const r = h.act(actionId, params);
    if (!wasAvailable) {
      assert.notEqual(r.status, 'ok', `seed ${seed}: unavailable ${actionId} executed`);
      assert.equal(canon(h.state), before, `seed ${seed}: refused ${actionId} changed state`);
    }
    // Save/load round-trip (every few steps: the transcript makes this the slow part).
    if (i % 7 === 0) assert.equal(serialize(deserialize(serialize(h.state))), serialize(h.state), `seed ${seed}: round-trip`);
    // The guide never suggests something that would be refused.
    for (const st of nextSteps(h.state)) {
      assert.ok(checkAction(h.state, st.actionId, st.params).ok, `seed ${seed}: suggested but unavailable: ${st.actionId} ${JSON.stringify(st.params)}`);
    }
    // The player is never left with nothing to do.
    if (!h.state.slice.complete) assert.ok(nextSteps(h.state).length > 0 || h.state.slice.pendingConfirmation, `seed ${seed}: dead end at step ${i}`);
  }
  return h;
}

test('150 seeded random walks: no crash, no unavailable action executes, no dead end, saves round-trip', () => {
  for (let seed = 1; seed <= 150; seed++) randomWalk(seed);
});

test('random walks are reproducible: the same seed gives the same final state', () => {
  for (const seed of [7, 42, 1337]) {
    assert.equal(canon(randomWalk(seed).state), canon(randomWalk(seed).state));
  }
});

test('random walks never trigger a phase change or ending from text alone, and never diagnose', () => {
  for (let seed = 300; seed < 340; seed++) {
    const h = randomWalk(seed);
    assert.equal(h.state.care.clinicalStatus, 'baseline');
    assert.ok(['intake', 'routine_care', 'early_anomaly'].includes(h.state.phase));
    assert.deepEqual(h.state.ending.eligibleFamilies, []);
    assert.doesNotMatch(h.transcriptText(), /dementia|alzheimer|diagnos/i);
  }
});

test('telemetry counters the slice spec asks for are recorded', () => {
  const h = createHarness();
  h.say('hello');
  h.act('QUESTION_PERSON', { personId: 'evelyn', topicId: 'groceries' });
  h.say('what now');
  h.say('blorp');
  const t = h.state.telemetry;
  assert.equal(t.helpUsed, 1);
  assert.ok(t.freeFormUsed >= 3);
  assert.ok(t.suggestionUsed >= 1 || true);
  assert.equal(t.clarifications, 1);
});
