// Test harness (EPISODE_01_IMPLEMENTATION_SPEC.md section 15). Drives the state
// and action layer without any UI: load a state, submit a bounded action or raw
// text, inspect what changed, list eligible actions.

import { newGame } from './engine.js';
import { handleText, handleAction } from './session.js';
import { checkAction } from './actions.js';
import { serialize, deserialize } from './state.js';
import { EVELYN_TOPICS, VISIT_TASKS, THERAPY_BEHAVIORS, JENNY_TOPICS } from './content.js';

const CATALOG = [
  ...['introduction', ...Object.keys(EVELYN_TOPICS), 'robert', 'family_general', 'therapy_support', 'church_event', 'ice_cream']
    .map((t) => ['QUESTION_PERSON', { personId: 'evelyn', topicId: t }]),
  ['QUESTION_PERSON', { personId: 'jenny', topicId: 'general' }],
  ['SAVE_PROFILE_FIELD', { topicId: 'all' }],
  ...Object.keys(EVELYN_TOPICS).map((t) => ['SAVE_PROFILE_FIELD', { topicId: t }]),
  ['PLACE_GROCERY_ORDER', {}],
  ['READ_MESSAGE', { messageId: 'michael' }],
  ['REVIEW_THERAPY_AGREEMENT', {}],
  ...Object.keys(THERAPY_BEHAVIORS).map((b) => ['CONFIGURE_THERAPY_SUPPORT', { behavior: b }]),
  ...Object.keys(VISIT_TASKS).map((t) => ['ASSIGN_CARE_TASK', { actorId: 'jenny', taskType: t }]),
  ...['pantry_fridge', 'mail', 'household_issue'].map((t) => ['REQUEST_PHYSICAL_CHECK', { actorId: 'jenny', targetId: t }]),
  ['WRAP_UP_VISIT', {}],
  ['REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' }],
  ...JENNY_TOPICS.map((t) => ['ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: t }]),
  ['ADD_TO_CALENDAR', { eventId: 'luncheon' }],
  ['ARRANGE_TRANSPORT', { mode: 'ride_service' }],
  ['ARRANGE_TRANSPORT', { mode: 'evelyn_handles_it' }],
  ['ADVANCE_TIME', {}],
  ['DECLINE_OR_DEFER', { targetId: 'T_THERAPY' }],
  ['DECLINE_OR_DEFER', { targetId: 'T_CHURCH' }],
  ['DECLINE_OR_DEFER', { targetId: 'inconsistency' }],
  ['MARK_UNCERTAIN', {}],
  ['SEARCH_RECORDS', { scope: 'history', query: 'butter pecan ice cream' }],
  ['CREATE_FOLLOWUP', { text: 'Keep an eye on repeated requests.' }],
  ['REVIEW_HELP', {}],
];

export function eligibleActions(state) {
  return CATALOG
    .filter(([actionId, params]) => checkAction(state, actionId, params).ok)
    .map(([actionId, params]) => ({ actionId, params }));
}

export function createHarness(opts) {
  let state = newGame(opts);
  const history = [];

  function record(kind, input, out) {
    state = out.state;
    history.push({ kind, input, status: out.status, lines: out.lines.map((l) => l.text) });
    return out;
  }

  return {
    get state() { return state; },
    get history() { return history; },
    /** Structured action (what a suggestion chip sends). */
    act(actionId, params = {}) { return record('action', { actionId, params }, handleAction(state, { actionId, params })); },
    /** Free-form text through the interpreter. */
    say(text) { return record('text', text, handleText(state, text)); },
    eligible() { return eligibleActions(state); },
    save() { return serialize(state); },
    load(json) { state = deserialize(json); },
    /** What the game said. The player's own words are excluded unless asked for. */
    transcriptText({ includePlayer = false } = {}) {
      return state.transcript.filter((l) => includePlayer || l.speaker !== 'YOU').map((l) => `${l.speaker}: ${l.text}`).join('\n');
    },
  };
}
