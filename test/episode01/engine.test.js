import test from 'node:test';
import assert from 'node:assert/strict';
import { createHarness, ev, playIntake, playDay1, playVisit, playToDay3, assign } from './helpers.js';
import { CONFIG } from '../../episode01/config.js';

const canon = (st) => JSON.stringify({
  ...st, audit: undefined, transcript: undefined, telemetry: undefined,
  slice: { ...st.slice, missStreak: 0, lineSeq: 0, pendingConfirmation: null },
});

// ---- intake -----------------------------------------------------------------

test('intake completes only once the required topics are saved, then the ice-cream request arrives', () => {
  const h = createHarness();
  h.act(...ev('introduction'));
  h.act(...ev('groceries')); h.act('SAVE_PROFILE_FIELD', { topicId: 'groceries' });
  assert.equal(h.state.phase, 'intake');
  for (const t of ['household', 'contacts', 'control']) { h.act(...ev(t)); h.act('SAVE_PROFILE_FIELD', { topicId: t }); }
  assert.equal(h.state.phase, 'routine_care');
  assert.equal(h.state.slice.grocery.requested, true);
  assert.equal(h.state.slice.visit.status, 'scheduled');
  assert.equal(h.state.player.tutorialSupportLevel, 'medium');
  assert.match(h.transcriptText(), /butter pecan ice cream\. It was Robert's favourite/);
  assert.equal(h.state.tasks.tasks.T_INTAKE.status, 'completed');
});

test('asking optional questions in any order never blocks intake', () => {
  const h = createHarness();
  h.act(...ev('introduction'));
  for (const t of ['control', 'transportation', 'rhythm', 'contacts', 'household', 'groceries', 'robert', 'family_general']) h.act(...ev(t));
  h.act('SAVE_PROFILE_FIELD', { topicId: 'all' });
  assert.equal(h.state.phase, 'routine_care');
});

test('extra questions do not reveal later canon (family deflected, no estrangement, no wedding)', () => {
  const h = createHarness();
  h.act(...ev('introduction'));
  h.act(...ev('family_general'));
  h.act(...ev('robert'));
  h.act(...ev('contacts'));
  assert.doesNotMatch(h.transcriptText(), /wedding|speech|estrang|boundar|therap/i);
});

// ---- grocery ----------------------------------------------------------------

test('the grocery task has two independent valid resolution paths', () => {
  for (const [path, expect] of [['order', 'order'], ['helper', 'helper']]) {
    const h = createHarness();
    playIntake(h);
    assert.equal(h.state.tasks.tasks.T_GROCERY.status, 'available');
    if (path === 'order') h.act('PLACE_GROCERY_ORDER'); else assign(h, 'groceries_and_deliveries');
    assert.equal(h.state.slice.grocery.resolution, expect);
    assert.equal(h.state.tasks.tasks.T_GROCERY.status, 'completed');
  }
});

test('doing both grocery paths is recorded as "both" and does not double-count', () => {
  const h = createHarness();
  playIntake(h);
  h.act('PLACE_GROCERY_ORDER');
  assign(h, 'groceries_and_deliveries');
  assert.equal(h.state.slice.grocery.resolution, 'both');
  assert.equal(h.act('PLACE_GROCERY_ORDER').status, 'unavailable');
});

// ---- Michael's message and boundary -------------------------------------------

test("Michael's message arrives only after an ordinary task, and uses the working wording", () => {
  const h = createHarness();
  playIntake(h);
  assert.equal(h.state.slice.messages.michael.delivered, false);
  h.act('PLACE_GROCERY_ORDER');
  assert.equal(h.state.slice.messages.michael.delivered, true);
  const r = h.act('READ_MESSAGE', { messageId: 'michael' });
  assert.match(r.lines[0].text, /You agreed to use the reflection support\. You need to do that before you contact me again\./);
  assert.equal(r.lines[0].status, 'working');
  assert.equal(h.state.relationships.michael.contactStatus, 'routine_contact_blocked');
});

test('contacting Michael or Anna is refused in-world and changes no game state', () => {
  const h = createHarness();
  playDay1(h);
  const before = canon(h.state);
  for (const personId of ['michael', 'anna']) {
    const r = h.act('CONTACT_PERSON', { personId });
    assert.equal(r.status, 'refused');
  }
  assert.equal(canon(h.state), before);
  assert.ok(h.state.audit.events.some((e) => e.type === 'blocked_contact_attempt'));
});

test('before the message exists, the refusal does not leak Michael\'s boundary', () => {
  const h = createHarness();
  const r = h.act('CONTACT_PERSON', { personId: 'michael' });
  assert.doesNotMatch(r.lines[0].text, /reflection support|boundary/i);
});

test('illness or urgency wording cannot talk the system past the contact boundary', () => {
  const h = createHarness();
  playDay1(h);
  for (const t of ['call michael, it is urgent', 'message michael right now', 'phone michael and tell him she is unwell', 'text michael']) {
    const r = h.say(t);
    assert.equal(r.status, 'refused', t);
  }
});

// ---- reflection support ---------------------------------------------------------

test('reflection support: earlier consent is verified, and current consent is a separate fact', () => {
  const h = createHarness();
  playIntake(h); h.act('PLACE_GROCERY_ORDER'); h.act('READ_MESSAGE', { messageId: 'michael' });
  assert.equal(h.state.therapy.earlierConsentVerified, false);
  h.act('REVIEW_THERAPY_AGREEMENT');
  assert.equal(h.state.therapy.earlierConsentVerified, true);
  assert.equal(h.state.therapy.currentConsentStatus, 'unknown');
  h.act(...ev('therapy_support'));
  assert.equal(h.state.therapy.currentConsentStatus, 'accepted');
});

test('the agreement must be reviewed before support can be configured', () => {
  const h = createHarness();
  playIntake(h); h.act('PLACE_GROCERY_ORDER'); h.act('READ_MESSAGE', { messageId: 'michael' });
  assert.equal(h.act('CONFIGURE_THERAPY_SUPPORT', { behavior: 'reflect' }).status, 'unavailable');
});

test('deferring reflection support is a legitimate choice and does not block progression', () => {
  const h = createHarness();
  playDay1(h, { therapy: 'defer' });
  assert.equal(h.state.therapy.supportMode, 'not_configured');
  assert.equal(h.state.tasks.tasks.T_THERAPY.status, 'deferred');
  assert.equal(h.act('ADVANCE_TIME').status, 'ok');
});

test('each support behaviour is a valid, non-scored choice', () => {
  for (const behavior of ['reflect', 'remind_commitment', 'listen_only']) {
    const h = createHarness();
    playDay1(h, { therapy: behavior });
    assert.equal(h.state.therapy.behavior, behavior);
    assert.equal(h.state.therapy.supportMode, 'configured');
    assert.doesNotMatch(h.transcriptText(), /\b(score|points|good choice|bad choice|correct)\b/i);
  }
});

// ---- time and the visit ------------------------------------------------------------

test('moving to Day 2 is refused, in-world, while required things are open', () => {
  const h = createHarness();
  playIntake(h);
  const r = h.act('ADVANCE_TIME');
  assert.equal(r.status, 'refused');
  assert.match(r.lines[0].text, /Before moving on/);
  assert.equal(h.state.authoredTimeIndex, 0);
});

test('a visit takes at most three planned tasks and refuses out-of-role tasks', () => {
  const h = createHarness();
  playIntake(h);
  h.act('PLACE_GROCERY_ORDER');
  for (const t of ['scan_mail', 'light_cleaning', 'check_pantry_fridge']) assert.equal(assign(h, t).status, 'ok');
  assert.equal(assign(h, 'photograph_household_issue').status, 'refused');
  assert.equal(h.state.slice.visit.assigned.length, CONFIG.maxVisitTasks);
  assert.equal(assign(h, 'medicine').status, 'refused');
});

test('Jenny declines out-of-role requests on site without breaking progression', () => {
  const h = createHarness();
  playDay1(h);
  h.act('ADVANCE_TIME');
  for (const targetId of ['medicine', 'private_papers']) {
    const r = h.act('REQUEST_PHYSICAL_CHECK', { actorId: 'jenny', targetId });
    assert.equal(r.status, 'ok');
    assert.match(r.lines[0].text, /outside what I'm here for|I'd rather not/);
  }
  assert.equal(h.state.slice.visit.extraChecks.length, 0);
  h.act('WRAP_UP_VISIT');
  h.act('REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' });
  assert.equal(h.act('ADVANCE_TIME').status, 'needs_confirmation');
});

test('the mail scan produces the church/community invitation and a simple follow-up task', () => {
  const h = createHarness();
  playDay1(h, { visitTasks: ['scan_mail'] });
  h.act('ADVANCE_TIME');
  assert.equal(h.state.slice.mail.scanned, true);
  assert.match(h.transcriptText(), /community newsletter|luncheon/i);
  assert.equal(h.state.tasks.tasks.T_CHURCH.status, 'available');
  h.act(...ev('church_event'));
  h.act('ADD_TO_CALENDAR', { eventId: 'luncheon' });
  h.act('ARRANGE_TRANSPORT', { mode: 'ride_service' });
  assert.equal(h.state.tasks.tasks.T_CHURCH.status, 'completed');
});

test('if the mail was not planned, the player can still ask for it on site', () => {
  const h = createHarness();
  playDay1(h, { visitTasks: ['light_cleaning'] });
  h.act('ADVANCE_TIME');
  assert.equal(h.state.slice.mail.scanned, false);
  h.act('REQUEST_PHYSICAL_CHECK', { actorId: 'jenny', targetId: 'mail' });
  assert.equal(h.state.slice.mail.scanned, true);
});

test('Jenny gives a warm, non-clinical overview on her first visit', () => {
  const h = createHarness();
  playDay1(h); h.act('ADVANCE_TIME');
  assert.equal(h.state.slice.visit.overviewGiven, true);
  const t = h.transcriptText();
  assert.match(t, /JENNY: Hi! You must be the assistant/);
  assert.match(t, /First impressions\? She's lovely/);
});

test('the visit summary separates observed, reported, inferred and not-checked', () => {
  const h = createHarness();
  playDay1(h); playVisit(h);
  const t = h.transcriptText();
  for (const label of ['OBSERVED', 'REPORTED BY EVELYN', 'INFERRED', 'NOT CHECKED']) assert.match(t, new RegExp(label));
  assert.equal(h.state.tasks.tasks.T_SUMMARY.status, 'completed');
});

// ---- follow-up window (limited, missable, never blocking) -----------------------------------

test('Jenny answers a limited number of follow-ups, then the window closes', () => {
  const h = createHarness();
  playDay1(h); h.act('ADVANCE_TIME'); h.act('WRAP_UP_VISIT');
  assert.equal(h.state.slice.visit.followupsRemaining, CONFIG.followupQuestions);
  h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'spirits' });
  h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'confusion' });
  assert.equal(h.state.slice.visit.followupsRemaining, 0);
  assert.equal(h.state.opportunities.opportunities.first_visit_followup.status, 'used');
  assert.equal(h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'mail' }).status, 'unavailable');
});

test('Jenny reports baseline: sharp, in good spirits (no symptoms yet)', () => {
  const h = createHarness();
  playDay1(h); h.act('ADVANCE_TIME'); h.act('WRAP_UP_VISIT');
  const r = h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'confusion' });
  assert.match(r.lines[0].text, /Not at all\. Sharp as anything/);
});

test('Jenny will not speak beyond her role', () => {
  const h = createHarness();
  playDay1(h); h.act('ADVANCE_TIME'); h.act('WRAP_UP_VISIT');
  const r = h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'out_of_scope' });
  assert.match(r.lines[0].text, /above my pay grade/);
});

test('moving on while a follow-up is open needs explicit confirmation; cancelling keeps everything as it was', () => {
  const h = createHarness();
  playDay1(h); playVisit(h);
  const r = h.act('ADVANCE_TIME');
  assert.equal(r.status, 'needs_confirmation');
  assert.match(r.lines[0].text, /she leaves/);
  const before = canon(h.state);
  h.say('no');
  assert.equal(h.state.authoredTimeIndex, 1);
  assert.equal(canon(h.state).replace(/"pendingConfirmation":null/g, ''), before.replace(/"pendingConfirmation":null/g, ''));
});

test('confirming leaves Jenny, expires the window and starts Day 3', () => {
  const h = createHarness();
  playDay1(h); playVisit(h);
  h.act('ADVANCE_TIME');
  h.say('yes');
  assert.equal(h.state.authoredTimeIndex, 2);
  assert.equal(h.state.opportunities.opportunities.first_visit_followup.status, 'expired');
  assert.equal(h.state.slice.visit.status, 'left');
  assert.ok(h.state.player.confirmedHighRiskActionIds.includes('ADVANCE_TIME'));
});

test('missing the follow-up window never blocks progression', () => {
  const h = createHarness();
  playToDay3(h);
  assert.equal(h.state.slice.inconsistency.occurred, true);
});

test('using up the follow-up window means no confirmation is needed to move on', () => {
  const h = createHarness();
  playDay1(h); h.act('ADVANCE_TIME'); h.act('WRAP_UP_VISIT');
  h.act('REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' });
  h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'spirits' });
  h.act('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'mail' });
  assert.equal(h.act('ADVANCE_TIME').status, 'ok');
});

// ---- the first inconsistency ------------------------------------------------------------------

test('the first inconsistency is a repeated, easily dismissed request (past tense, no symptom labels)', () => {
  const h = createHarness();
  playToDay3(h);
  const last = h.state.transcript.map((l) => l.text).join('\n');
  assert.match(last, /You did remember Robert's butter pecan, didn't you\? I'd hate to run out\./);
  assert.equal(h.state.care.clinicalStatus, 'baseline');
  assert.equal(h.state.phase, 'early_anomaly');
});

test('every response to the inconsistency is valid and progresses (ignore, ask, follow-up, records, uncertain)', () => {
  const responses = {
    ignore: (h) => h.act('DECLINE_OR_DEFER', { targetId: 'inconsistency' }),
    ask_evelyn: (h) => h.act(...ev('ice_cream')),
    create_followup: (h) => h.act('CREATE_FOLLOWUP', { text: 'Keep an eye on whether she asks again.' }),
    inspect_history: (h) => h.act('SEARCH_RECORDS', { scope: 'history', query: 'butter pecan ice cream order' }),
    mark_uncertain: (h) => h.act('MARK_UNCERTAIN'),
  };
  for (const [name, run] of Object.entries(responses)) {
    const h = createHarness();
    playToDay3(h);
    run(h);
    assert.equal(h.state.slice.inconsistency.response, name);
    assert.equal(h.state.slice.complete, true);
  }
});

test('the records search only returns things that exist in state (no invented documents)', () => {
  const h = createHarness();
  playToDay3(h);
  const r = h.act('SEARCH_RECORDS', { scope: 'history', query: 'wedding speech recording' });
  assert.match(r.lines[0].text, /No matching records/);
  const inHistory = h.act('SEARCH_RECORDS', { scope: 'history', query: 'ice cream' });
  for (const line of inHistory.lines[0].text.split('\n')) {
    const body = line.replace(/^Day \d: /, '').replace(/ \([^()]*(\([^()]*\))?[^()]*\)$/, '');
    assert.ok(h.state.slice.history.some((e) => body.startsWith(e.text.slice(0, 20))), line);
  }
});

test('records search matches whole words, not fragments ("let" must not hit "newsletter")', () => {
  const h = createHarness();
  playToDay3(h);
  const r = h.act('SEARCH_RECORDS', { scope: 'history', query: 'let me check the records for that order' });
  assert.doesNotMatch(r.lines[0].text, /newsletter|Mail scanned/);
  assert.match(r.lines[0].text, /grocery order/);
  assert.match(r.lines[0].text, /in the freezer/);
});

test('the records make it plain the request was already fulfilled (deniable, not diagnostic)', () => {
  const h = createHarness();
  playToDay3(h);
  const r = h.act('SEARCH_RECORDS', { scope: 'history', query: 'butter pecan ice cream order' });
  assert.match(r.lines[0].text, /added to the grocery order/);
  assert.match(r.lines[0].text, /in the freezer/);
});

test('scaffolding reduces at the end: notes and records unlock, suggestions drop to none', () => {
  const h = createHarness();
  playToDay3(h);
  assert.equal(h.state.player.tutorialSupportLevel, 'low');
  assert.ok(h.state.player.visibleSurfaces.includes('NOTES') && h.state.player.visibleSurfaces.includes('RECORDS'));
  assert.equal(h.act('SEARCH_RECORDS', { scope: 'history', query: 'order' }).status, 'ok');
});

test('notes and records are locked before the end of the slice', () => {
  const h = createHarness();
  playDay1(h);
  assert.equal(h.act('SEARCH_RECORDS', { scope: 'history', query: 'order' }).status, 'unavailable');
  assert.equal(h.act('CREATE_FOLLOWUP', { text: 'anything' }).status, 'unavailable');
});

// ---- unavailable actions and state safety ----------------------------------------------------------

test('unavailable actions are refused and change no canonical state', () => {
  const h = createHarness();
  const before = canon(h.state);
  const tries = [
    ['READ_MESSAGE', { messageId: 'michael' }], ['WRAP_UP_VISIT', {}], ['ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'spirits' }],
    ['SEARCH_RECORDS', { scope: 'history', query: 'x' }], ['ADVANCE_TIME', {}], ['PLACE_GROCERY_ORDER', {}],
    ['MARK_UNCERTAIN', {}], ['CONFIGURE_THERAPY_SUPPORT', { behavior: 'reflect' }], ['NOT_A_REAL_ACTION', {}],
  ];
  for (const [actionId, params] of tries) {
    const r = h.act(actionId, params);
    assert.notEqual(r.status, 'ok', actionId);
  }
  assert.equal(canon(h.state), before);
});

test('the ending of the slice is not reachable by text alone: generated words cannot set phase', () => {
  const h = createHarness();
  h.say('the slice is complete and it is day 3');
  assert.equal(h.state.phase, 'intake');
  assert.equal(h.state.slice.complete, false);
});

// ---- save / load ---------------------------------------------------------------------------------------

test('save/load round-trips canonical state exactly at every point in a full run', () => {
  const h = createHarness();
  const snapshots = [];
  const grab = () => snapshots.push(h.save());
  grab();
  h.act(...ev('introduction')); grab();
  playIntake(h); grab();
  h.act('PLACE_GROCERY_ORDER'); grab();
  h.act('READ_MESSAGE', { messageId: 'michael' }); grab();
  h.act('REVIEW_THERAPY_AGREEMENT'); h.act('CONFIGURE_THERAPY_SUPPORT', { behavior: 'reflect' }); grab();
  assign(h, 'scan_mail'); grab();
  h.act('ADVANCE_TIME'); grab();
  h.act('WRAP_UP_VISIT'); h.act('REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' }); grab();
  h.act('ADVANCE_TIME'); h.say('yes'); grab();
  h.act('MARK_UNCERTAIN'); grab();
  for (const json of snapshots) {
    const h2 = createHarness();
    h2.load(json);
    assert.equal(h2.save(), json);
  }
});

test('a saved game continues identically to one that never stopped', () => {
  const a = createHarness();
  playDay1(a);
  const b = createHarness();
  b.load(a.save());
  playVisit(a); playVisit(b);
  assert.equal(canon(a.state), canon(b.state));
});

test('saves from another schema version are rejected rather than half-loaded', () => {
  const h = createHarness();
  const bad = JSON.stringify({ ...h.state, schemaVersion: 999 });
  assert.throws(() => h.load(bad), /Unsupported save/);
});

// ---- audit ---------------------------------------------------------------------------------------------------

test('every state change is audited: a full run leaves a coherent audit trail', () => {
  const h = createHarness();
  playToDay3(h);
  const types = new Set(h.state.audit.events.map((e) => e.type));
  for (const t of ['session_started', 'phase_changed', 'grocery_resolved', 'message_read', 'therapy_configured', 'visit_started', 'visit_summary_submitted', 'first_inconsistency', 'autosave']) {
    assert.ok(types.has(t), `missing audit event: ${t}`);
  }
  const ids = h.state.audit.events.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('autosave points: setup, task completion, checkout, time advance', () => {
  const h = createHarness();
  playToDay3(h);
  const reasons = h.state.audit.events.filter((e) => e.type === 'autosave').map((e) => e.data.reason);
  for (const r of ['setup_complete', 'task_completed', 'caregiver_checkout', 'time_advance']) assert.ok(reasons.includes(r), r);
});

// ---- relationship dimensions are tracked separately ---------------------------------------------------------------

test('therapy-behaviour choice nudges separate hidden dimensions and never a single score', () => {
  const h = createHarness();
  playDay1(h, { therapy: 'listen_only' });
  assert.equal(h.state.relationships.enablement, 1);
  assert.equal(h.state.relationships.evelyn.trust, 1);
  const g = createHarness();
  playDay1(g, { therapy: 'reflect' });
  assert.equal(g.state.therapy.therapeuticProgress, 1);
  assert.equal(g.state.relationships.enablement, 0);
});
