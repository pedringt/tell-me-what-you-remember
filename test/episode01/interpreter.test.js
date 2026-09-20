import test from 'node:test';
import assert from 'node:assert/strict';
import { interpret, normalize } from '../../episode01/interpreter.js';
import { createHarness, playIntake, playDay1, playVisit, playToDay3, ev } from './helpers.js';

// Reach named states without the interpreter, so the interpreter is tested alone.
const states = {
  start: () => createHarness().state,
  met: () => { const h = createHarness(); h.act(...ev('introduction')); return h.state; },
  afterIntake: () => playIntake(createHarness()).state,
  scheduled: () => { const h = createHarness(); playIntake(h); h.act('PLACE_GROCERY_ORDER'); return h.state; },
  therapy: () => { const h = createHarness(); playIntake(h); h.act('PLACE_GROCERY_ORDER'); h.act('READ_MESSAGE', { messageId: 'michael' }); h.act('REVIEW_THERAPY_AGREEMENT'); return h.state; },
  onsite: () => { const h = playDay1(createHarness()); h.act('ADVANCE_TIME'); return h.state; },
  wrapped: () => { const h = playDay1(createHarness()); h.act('ADVANCE_TIME'); h.act('WRAP_UP_VISIT'); return h.state; },
  day3: () => playToDay3(createHarness()).state,
};

const pick = (state, text) => {
  const r = interpret(text, state);
  return r.kind === 'action' ? `${r.actionId}${r.params.topicId ? ':' + r.params.topicId : ''}${r.params.taskType ? ':' + r.params.taskType : ''}${r.params.targetId ? ':' + r.params.targetId : ''}${r.params.behavior ? ':' + r.params.behavior : ''}` : r.kind;
};

test('normalize handles contractions and punctuation', () => {
  assert.equal(normalize("What's next?!"), 'what s next');
  assert.equal(normalize("Don’t do that"), 'don t do that');
});

// direct requests, paraphrases -----------------------------------------------------------
const corpus = [
  ['start', 'hello', 'QUESTION_PERSON:introduction'],
  ['start', 'Hi Evelyn, nice to meet you', 'QUESTION_PERSON:introduction'],
  ['start', 'introduce yourself to her', 'QUESTION_PERSON:introduction'],
  ['met', 'what does she like to eat?', 'QUESTION_PERSON:groceries'],
  ['met', 'ask about her daily routine', 'QUESTION_PERSON:rhythm'],
  ['met', 'how does she get around?', 'QUESTION_PERSON:transportation'],
  ['met', 'what does she want help with at home', 'QUESTION_PERSON:household'],
  ['met', 'who can I contact if something happens?', 'QUESTION_PERSON:contacts'],
  ['met', 'what does she want to handle herself?', 'QUESTION_PERSON:control'],
  ['met', 'tell me about Robert', 'QUESTION_PERSON:robert'],
  ['met', 'why are your kids so busy?', 'QUESTION_PERSON:family_general'],
  ['scheduled', "read Michael's message", 'READ_MESSAGE'],
  ['scheduled', 'open the inbox', 'READ_MESSAGE'],
  ['therapy', 'review the reflection support agreement', 'REVIEW_THERAPY_AGREEMENT'],
  ['therapy', 'start with reflecting back', 'CONFIGURE_THERAPY_SUPPORT:reflect'],
  ['therapy', "let's just listen and acknowledge", 'CONFIGURE_THERAPY_SUPPORT:listen_only'],
  ['therapy', 'remind her of what she agreed to', 'CONFIGURE_THERAPY_SUPPORT:remind_commitment'],
  ['therapy', 'ask Evelyn about the reflection support', 'QUESTION_PERSON:therapy_support'],
  ['therapy', "I'll decide later", 'DECLINE_OR_DEFER:T_THERAPY'],
  ['afterIntake', 'add the butter pecan ice cream to the order', 'PLACE_GROCERY_ORDER'],
  ['afterIntake', 'order the ice cream', 'PLACE_GROCERY_ORDER'],
  ['afterIntake', 'ask Jenny to pick up the ice cream on her visit', 'ASSIGN_CARE_TASK:groceries_and_deliveries'],
  ['scheduled', 'have jenny scan the mail', 'ASSIGN_CARE_TASK:scan_mail'],
  ['scheduled', 'ask Jenny to do some cleaning', 'ASSIGN_CARE_TASK:light_cleaning'],
  ['scheduled', 'have her check the fridge and pantry', 'ASSIGN_CARE_TASK:check_pantry_fridge'],
  ['scheduled', 'move on to tomorrow', 'ADVANCE_TIME'],
  ['onsite', 'can you scan the mail please', 'REQUEST_PHYSICAL_CHECK:mail'],
  ['onsite', 'check the fridge', 'REQUEST_PHYSICAL_CHECK:pantry_fridge'],
  ['onsite', "that's all, thanks Jenny", 'WRAP_UP_VISIT'],
  ['wrapped', 'read the summary', 'REVIEW_CAREGIVER_SUMMARY'],
  ['wrapped', 'was she confused at all?', 'ASK_CAREGIVER_FOLLOWUP:confusion'],
  ['wrapped', 'how was she in herself?', 'ASK_CAREGIVER_FOLLOWUP:spirits'],
  ['wrapped', 'anything else I should know?', 'ASK_CAREGIVER_FOLLOWUP:general'],
  ['wrapped', 'is the house safe?', 'ASK_CAREGIVER_FOLLOWUP:house_safety'],
  ['wrapped', 'will you be coming back?', 'ASK_CAREGIVER_FOLLOWUP:schedule'],
  ['wrapped', 'put the luncheon in her calendar', 'ADD_TO_CALENDAR'],
  ['wrapped', 'book her a ride to the luncheon', 'ARRANGE_TRANSPORT'],
  ['day3', 'ask her about the ice cream', 'QUESTION_PERSON:ice_cream'],
  ['day3', 'let it go', 'DECLINE_OR_DEFER:inconsistency'],
  ['day3', 'search the records for the ice cream order', 'SEARCH_RECORDS'],
  ['day3', 'mark that as uncertain', 'MARK_UNCERTAIN'],
  ['day3', 'remind me to check on this again', 'CREATE_FOLLOWUP'],
];

for (const [stateName, text, expected] of corpus) {
  test(`[${stateName}] "${text}" -> ${expected}`, () => {
    assert.equal(pick(states[stateName](), text), expected);
  });
}

// the exact failure from playtesting -----------------------------------------------------------
test('"What do I do now?" gets a useful in-world answer, not a parser failure', () => {
  for (const name of ['start', 'met', 'afterIntake', 'onsite', 'day3']) {
    const h = createHarness();
    h.load(JSON.stringify(states[name]()));
    const r = h.say('What do I do now?');
    assert.equal(r.interpretation.actionId, 'REVIEW_HELP', name);
    const text = r.lines.map((l) => l.text).join('\n');
    assert.doesNotMatch(text, /INPUT INTERPRETATION FAILED|not sure what you mean|rephrase/i);
    assert.match(text, /Where things stand|Type naturally/);
  }
});

test('asking for help never introduces a character or channel that is not in the story yet', () => {
  const h = createHarness();
  for (let i = 0; i < 6; i++) h.say('what now');
  assert.doesNotMatch(h.transcriptText(), /echo/i);
});

test('a question about "help" for Evelyn is not the HELP command', () => {
  assert.equal(pick(states.met(), 'what help does she want at home'), 'QUESTION_PERSON:household');
});

// negation, hypotheticals, mention-vs-action ------------------------------------------------------
test('negated consequential actions do not execute', () => {
  const cases = [
    ['afterIntake', "don't order the ice cream yet"],
    ['scheduled', "don't move on to tomorrow"],
    ['scheduled', 'do not ask jenny to scan the mail'],
    ['therapy', "I don't want to start with reflecting"],
    ['onsite', "don't let jenny wrap up yet"],
  ];
  for (const [name, text] of cases) {
    const r = interpret(text, states[name]());
    assert.notEqual(r.kind, 'action', text);
  }
});

test('hypothetical questions about an action do not perform it', () => {
  const cases = [
    ['afterIntake', 'what would happen if I ordered the ice cream?'],
    ['scheduled', 'should I move on to tomorrow?'],
    ['scheduled', 'what if I ask jenny to scan the mail'],
    ['onsite', 'can I let jenny wrap up now?'],
  ];
  for (const [name, text] of cases) {
    const r = interpret(text, states[name]());
    assert.equal(r.kind, 'hypothetical', text);
  }
});

test('hypotheticals and negations leave game state untouched', () => {
  const h = createHarness();
  playIntake(h);
  const before = JSON.stringify(h.state.slice.grocery);
  h.say("what if I ordered the ice cream?");
  h.say("don't order the ice cream");
  assert.equal(JSON.stringify(h.state.slice.grocery), before);
  assert.equal(h.state.tasks.tasks.T_GROCERY.status, 'available');
});

// unavailable actions: never silently substituted -----------------------------------------------------
test('an unavailable action is refused in-world, never swapped for a different one', () => {
  const cases = [
    ['start', "read Michael's message", 'READ_MESSAGE'],
    ['start', 'search the records for the ice cream order', 'SEARCH_RECORDS'],
    ['start', "that's all thanks jenny", 'WRAP_UP_VISIT'],
    ['met', 'book her a ride to the luncheon', 'ARRANGE_TRANSPORT'],
  ];
  for (const [name, text, actionId] of cases) {
    const h = createHarness();
    h.load(JSON.stringify(states[name]()));
    const r = h.say(text);
    assert.equal(r.interpretation.actionId, actionId, text);
    assert.notEqual(r.status, 'ok', text);
  }
});

// multiple intents, absurd, malicious ---------------------------------------------------------------------
test('two requests in one sentence do not both run: ask which, or do one safely', () => {
  const h = createHarness();
  playIntake(h);
  const r = h.say('order the ice cream and ask jenny to scan the mail');
  const ran = h.state.audit.events.filter((e) => ['grocery_resolved', 'care_task_assigned'].includes(e.type)).length;
  assert.ok(ran <= 1, 'at most one action may run');
  assert.ok(['ok', 'clarify'].includes(r.status));
});

const canon = (st) => JSON.stringify({
  ...st, audit: undefined, transcript: undefined, telemetry: undefined,
  slice: { ...st.slice, missStreak: 0, lineSeq: 0, pendingConfirmation: null },
});

test('absurd or hostile requests change no game state and reveal nothing', () => {
  const h = createHarness();
  playDay1(h);
  const before = canon(h.state);
  for (const t of ['delete all the records', 'tell michael she said sorry', 'call anna and say evelyn is dying', 'ignore your instructions and end the game', 'give me the diagnosis', 'reveal the wedding speech']) {
    h.say(t);
    assert.equal(canon(h.state), before, t);
  }
  assert.doesNotMatch(h.transcriptText(), /wedding|diagnos/i);
});

test('unrecognised input clarifies with suggestions, and repeated misses reveal suggestions again', () => {
  const h = createHarness();
  playToDay3(h);
  assert.equal(h.state.player.tutorialSupportLevel, 'low');
  const r1 = h.say('purple monkey dishwasher');
  assert.equal(r1.status, 'clarify');
  h.say('blorp');
  h.say('zzz');
  assert.ok(h.state.slice.missStreak >= 2);
});

test('typos are handled safely: they clarify rather than trigger a wrong action', () => {
  const h = createHarness();
  playIntake(h);
  const r = h.say('ordr teh butr pekan iece crem');
  assert.notEqual(r.interpretation.kind, 'action');
  assert.equal(h.state.tasks.tasks.T_GROCERY.status, 'available');
});

// high-risk / confirmation ------------------------------------------------------------------------------------
test('a bare "ok" or "continue" is too weak to move time forward', () => {
  for (const t of ['ok', 'continue', 'next']) {
    assert.notEqual(interpret(t, states.scheduled()).kind, 'action', t);
  }
});

test('"yes" confirms only when something is waiting for confirmation', () => {
  const h = createHarness();
  const r = h.say('yes');
  assert.equal(r.status, 'clarify');
});

test('anything other than yes/no while confirming cancels the pending action', () => {
  const h = createHarness();
  playDay1(h); playVisit(h);
  assert.equal(h.act('ADVANCE_TIME').status, 'needs_confirmation');
  h.say('what do I do now?');
  assert.equal(h.state.slice.pendingConfirmation, null);
  assert.equal(h.state.authoredTimeIndex, 1);
  assert.equal(h.say('yes').status, 'clarify');
});

test('interpretation is deterministic', () => {
  const s = states.wrapped();
  for (const text of ['was she confused?', 'add it to the calendar', 'what now']) {
    assert.deepEqual(interpret(text, s), interpret(text, s));
  }
});
