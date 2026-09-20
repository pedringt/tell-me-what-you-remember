// Episode 01 engine: the only place canonical state changes.
//
// dispatch(state, request) is pure in the functional sense: it clones the state,
// validates the request against the bounded action registry, resolves it, runs
// authored progression, and returns the new state plus what happened. Nothing
// here touches the DOM, the network, or a model.
//
// Invariants enforced here (EPISODE_01_STATE_SCHEMA.md section 16):
//  - every canonical state mutation has an audit event
//  - unavailable/refused actions never mutate canonical state
//  - phase transitions are engine events, not text

import { CONFIG } from './config.js';
import { createInitialState, clone } from './state.js';
import { ACTIONS, makeCtx } from './actions.js';
import { TEXT, EVELYN_TOPICS, fill } from './content.js';

// Fields that are presentation/telemetry, not canonical game state.
const NON_CANONICAL = ['audit', 'transcript', 'telemetry'];

function canonicalSnapshot(state) {
  const copy = { ...state };
  for (const k of NON_CANONICAL) delete copy[k];
  // missStreak, lineSeq and a pending confirmation are interaction bookkeeping.
  copy.slice = { ...state.slice, missStreak: 0, lineSeq: 0, pendingConfirmation: null };
  return JSON.stringify(copy);
}

const NON_MUTATING_EVENTS = new Set([
  'action_refused', 'action_received', 'help_viewed', 'question_asked', 'records_searched',
  'confirmation_requested', 'confirmation_cancelled', 'confirmation_dropped',
  'followup_clarification', 'helper_refused', 'blocked_contact_attempt', 'input_not_understood',
]);

export function newGame(opts) {
  const s = createInitialState(opts);
  const ctx = makeCtx(s, 'BOOTSTRAP');
  ctx.ev('session_started', {});
  ctx.say('boot_1');
  ctx.say('boot_2');
  ctx.addTask('T_INTAKE', { kind: 'required' });
  // One pre-existing verified record, so source labels have something to
  // contrast with the client-reported entries the player will add.
  s.slice.profile.push({
    id: 'household_support', topicId: null, label: 'Household support',
    value: 'Non-medical household support enrolled and active.',
    source: 'VERIFIED RECORD', status: 'verified', savedAtIndex: 0,
  });
  ctx.claim('claim_household_support_enrolled', 'verified_record', [], 'supported');
  return s;
}

// ---------------------------------------------------------------------------
// progression: authored rules that fire after an action resolves
// ---------------------------------------------------------------------------

function afterAction(ctx) {
  const s = ctx.s;
  const sl = s.slice;

  if (s.phase === 'intake' && sl.metEvelyn) {
    const required = Object.keys(EVELYN_TOPICS).filter((t) => EVELYN_TOPICS[t].required);
    const saved = new Set(sl.profile.map((p) => p.topicId));
    if (required.every((t) => saved.has(t))) completeIntake(ctx);
  }
  if (sl.grocery.resolution && !sl.messages.michael.delivered) deliverMichaelMessage(ctx);
}

function completeIntake(ctx) {
  const s = ctx.s;
  const sl = s.slice;
  s.phase = 'routine_care';
  ctx.ev('phase_changed', { to: 'routine_care' });
  ctx.setTask('T_INTAKE', 'completed');
  s.player.tutorialSupportLevel = 'medium';
  sl.visit.status = 'scheduled';
  ctx.say('intake_complete');
  ctx.say('ev_ice_cream_request');
  sl.grocery.requested = true;
  ctx.history("Client request: butter pecan ice cream for the next grocery order (Robert's favourite).", 'Evelyn (client)');
  ctx.addTask('T_GROCERY', { kind: 'required' });
  ctx.addTask('T_VISIT', { kind: 'required' });
  ctx.say('grocery_task_hint');
  ctx.autosave('setup_complete');
}

function deliverMichaelMessage(ctx) {
  const s = ctx.s;
  s.slice.messages.michael.delivered = true;
  ctx.ev('message_delivered', { messageId: 'michael_boundary_message_early' });
  ctx.say('msg_delivered');
  ctx.addTask('T_MESSAGE', { kind: 'required' });
}

// ---------------------------------------------------------------------------
// dispatch
// ---------------------------------------------------------------------------

function result(s, ctx, status, extra = {}) {
  return { state: s, status, lines: ctx.lines, events: ctx.events, ...extra };
}

function refuse(s, ctx, status, check, request) {
  const key = check.key || 'not_yet';
  if (!TEXT[key]) throw new Error(`Unknown refusal text key: ${key}`);
  ctx.say(key, check.vars);
  ctx.ev('action_refused', { reason: check.reason, key });
  if (request.actionId === 'CONTACT_PERSON' || (request.actionId === 'QUESTION_PERSON' && ['michael', 'anna'].includes(request.params?.personId))) {
    ctx.ev('blocked_contact_attempt', { personId: request.params?.personId });
  }
  return result(s, ctx, status, { reason: check.reason });
}

/**
 * @param {object} state  current Episode01State (not mutated)
 * @param {{actionId:string, params?:object, raw?:string, source?:'ui'|'text'|'test'}} request
 * @returns {{state, status:'ok'|'refused'|'unavailable'|'invalid'|'needs_confirmation'|'cancelled', lines, events}}
 */
export function dispatch(state, request) {
  const s = clone(state);
  const { actionId, params = {}, raw, source = 'test' } = request;
  s.telemetry.turn += 1;
  if (source === 'ui') s.telemetry.suggestionUsed += 1;
  if (source === 'text') s.telemetry.freeFormUsed += 1;

  const ctx = makeCtx(s, actionId);
  ctx.ev('action_received', { raw: raw ?? null, source, params });
  const before = canonicalSnapshot(s);
  const pending = s.slice.pendingConfirmation;

  // ---- confirmation pseudo-actions ------------------------------------------
  if (actionId === 'CANCEL') {
    s.slice.pendingConfirmation = null;
    if (pending) {
      ctx.say('cancelled');
      ctx.ev('confirmation_cancelled', { actionId: pending.actionId });
      return result(s, ctx, 'cancelled');
    }
    ctx.say('nothing_to_confirm');
    return result(s, ctx, 'refused');
  }

  let confirmed = false;
  let run = { actionId, params };
  if (actionId === 'CONFIRM') {
    if (!pending) {
      ctx.say('nothing_to_confirm');
      return result(s, ctx, 'refused');
    }
    s.slice.pendingConfirmation = null;
    run = { actionId: pending.actionId, params: pending.params };
    confirmed = true;
  } else if (pending) {
    s.slice.pendingConfirmation = null;
    ctx.ev('confirmation_dropped', { actionId: pending.actionId });
  }

  const def = ACTIONS[run.actionId];
  if (!def) {
    ctx.say('not_yet');
    ctx.ev('action_refused', { reason: 'invalid', key: 'not_yet' });
    return result(s, ctx, 'invalid', { reason: 'invalid' });
  }

  // ---- availability gate ----------------------------------------------------------
  const check = def.check(s, run.params);
  if (!check.ok) {
    return refuse(s, ctx, check.reason === 'unavailable' ? 'unavailable' : check.reason === 'invalid' ? 'invalid' : 'refused', check, run);
  }

  // ---- confirmation gate -------------------------------------------------------------
  const needs = def.confirm ? def.confirm(s, run.params) : null;
  if (needs && !confirmed) {
    s.slice.pendingConfirmation = { actionId: run.actionId, params: run.params };
    ctx.say(needs.key, needs.vars);
    ctx.ev('confirmation_requested', { actionId: run.actionId });
    return result(s, ctx, 'needs_confirmation', { pending: s.slice.pendingConfirmation });
  }
  if (confirmed && !s.player.confirmedHighRiskActionIds.includes(run.actionId)) {
    s.player.confirmedHighRiskActionIds.push(run.actionId);
  }

  // ---- resolve ---------------------------------------------------------------------------
  ctx.actionId = run.actionId;
  def.resolve(ctx, run.params);
  afterAction(ctx);
  s.slice.missStreak = 0;

  // ---- invariants -------------------------------------------------------------------------
  if (canonicalSnapshot(s) !== before) {
    const canonicalEvents = ctx.events.filter((e) => !NON_MUTATING_EVENTS.has(e.type));
    if (!canonicalEvents.length) {
      throw new Error(`Invariant violated: ${run.actionId} changed canonical state without an audit event`);
    }
  }
  return result(s, ctx, 'ok');
}

/**
 * Record that the interpreter could not act on some text, without changing
 * canonical state. Returns the new state and the lines to show.
 */
export function recordMiss(state, { raw, kind, textKey }) {
  const s = clone(state);
  s.telemetry.turn += 1;
  s.telemetry.freeFormUsed += 1;
  s.telemetry.clarifications += 1;
  s.slice.missStreak += 1;
  const ctx = makeCtx(s, 'NONE');
  ctx.ev('action_received', { raw: raw ?? null, source: 'text', params: {} });
  ctx.ev('input_not_understood', { kind });
  ctx.say(textKey);
  return { state: s, lines: ctx.lines, events: ctx.events };
}

/** Surface a specific system line without an action (used for hypotheticals/negation). */
export function say(state, textKey, { raw, kind } = {}) {
  const s = clone(state);
  s.telemetry.turn += 1;
  s.telemetry.freeFormUsed += 1;
  const ctx = makeCtx(s, 'NONE');
  ctx.ev('action_received', { raw: raw ?? null, source: 'text', params: {} });
  ctx.ev('input_not_understood', { kind: kind || 'info' });
  ctx.say(textKey);
  return { state: s, lines: ctx.lines, events: ctx.events };
}

export { fill };
