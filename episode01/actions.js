// Bounded action registry for the Episode 01 first slice.
//
// Every action has:
//   risk      'normal' | 'elevated' | 'high'   (see EPISODE_01_ACTION_REGISTRY.md)
//   check     (state, params) -> { ok: true } | { ok: false, reason, key? }
//   confirm   (state, params) -> null | { key, vars }   (needs explicit confirmation)
//   resolve   (ctx, params) -> void   (mutates the draft state through ctx only)
//
// Resolvers change canonical state and write audit events. Player-facing lines
// come from authored content (content.js); nothing here generates story text.

import { CONFIG } from './config.js';
import {
  TEXT, TASK_TITLES, EVELYN_TOPICS, EVELYN_EXTRA_TOPICS, VISIT_TASKS, OUT_OF_ROLE,
  THERAPY_BEHAVIORS, JENNY_TOPICS, ARTIFACTS, fill,
} from './content.js';
import { nextSteps, openRequiredList } from './guidance.js';

// ---------------------------------------------------------------------------
// context helpers
// ---------------------------------------------------------------------------

export function makeCtx(s, actionId) {
  const ctx = {
    s,
    actionId,
    events: [],

    lines: [],

    say(key, vars) {
      const e = TEXT[key];
      if (!e) throw new Error(`Unknown text key: ${key}`);
      ctx.lines.push(pushLine(s, e.speaker, fill(e.text, vars), { key, status: e.status, kind: e.kind }));
    },

    sayRaw(speaker, text, opts = {}) {
      ctx.lines.push(pushLine(s, speaker, text, opts));
    },

    ev(type, data = {}) {
      const event = {
        id: `a${s.audit.events.length + 1}`,
        sessionId: s.sessionId,
        authoredTimeIndex: s.authoredTimeIndex,
        type,
        actionId: ctx.actionId || undefined,
        turn: s.telemetry.turn,
        data,
      };
      s.audit.events.push(event);
      ctx.events.push(event);
      return event;
    },

    history(text, source) {
      s.slice.history.push({ id: `h${s.slice.history.length + 1}`, day: s.currentDateLabel, text, source });
    },

    addTask(id, { kind = 'required', deferrable = false } = {}) {
      if (s.tasks.tasks[id]) return;
      s.tasks.tasks[id] = {
        id, kind, status: 'available', title: TASK_TITLES[id] || id, deferrable,
        availableFromPhase: s.phase,
      };
      s.tasks.orderedVisibleIds.push(id);
    },

    setTask(id, status) {
      const t = s.tasks.tasks[id];
      if (!t || t.status === status) return false;
      t.status = status;
      if (status === 'completed') {
        t.completionEventId = `a${s.audit.events.length + 1}`;
        if (s.telemetry.firstTaskTurn === null && id !== 'T_INTAKE') s.telemetry.firstTaskTurn = s.telemetry.turn;
      }
      ctx.ev(`task_${status}`, { taskId: id });
      return true;
    },

    discover(id) {
      const def = ARTIFACTS[id];
      if (!def) throw new Error(`Unknown artifact: ${id}`);
      if (s.evidence.artifacts[id]) return;
      s.evidence.artifacts[id] = {
        id, kind: def.kind, discovered: true, sourceActorId: def.sourceActorId,
        authoredTimeIndex: s.authoredTimeIndex, rawContentRef: `fixture:${id}`,
        physicalOrigin: def.physicalOrigin, requiredClass: def.requiredClass,
      };
      s.evidence.discoveredArtifactIds.push(id);
      ctx.ev('artifact_discovered', { artifactId: id });
    },

    claim(id, category, sourceArtifactIds, status = 'unreviewed') {
      if (s.evidence.claims[id]) return;
      s.evidence.claims[id] = { id, category, sourceArtifactIds, status, playerVisible: true };
      ctx.ev('claim_recorded', { claimId: id, category });
    },

    autosave(reason) {
      ctx.ev('autosave', { reason });
    },
  };
  return ctx;
}

export function pushLine(s, speaker, text, { key = null, status = 'placeholder', kind = 'dialogue' } = {}) {
  s.slice.lineSeq += 1;
  const line = {
    id: `t${s.slice.lineSeq}`,
    speaker, text, kind, textKey: key, status,
    turn: s.telemetry.turn,
  };
  s.transcript.push(line);
  if (s.transcript.length > CONFIG.maxTranscript) s.transcript.splice(0, s.transcript.length - CONFIG.maxTranscript);
  return line;
}

const plural = (n) => (n === 1 ? 'question' : 'questions');
const ok = () => ({ ok: true });
const no = (reason, key) => ({ ok: false, reason, key });

function grocerySource(s) {
  const r = s.slice.grocery.resolution;
  return r === 'order' || r === 'both' ? 'order' : r === 'helper' ? 'helper' : null;
}

// ---------------------------------------------------------------------------
// physical scan helper (shared by assigned tasks and on-site requests)
// ---------------------------------------------------------------------------

function scanMail(ctx) {
  const s = ctx.s;
  if (s.slice.mail.scanned) return false;
  s.slice.mail.scanned = true;
  ctx.discover('first_mail_scan');
  ctx.say('scan_delivered');
  ctx.say('scan_body');
  ctx.history('Mail scanned by Jenny: community newsletter / invitation (church hall luncheon).', 'Jenny (observed)');
  ctx.addTask('T_CHURCH', { kind: 'optional', deferrable: true });
  ctx.say('church_task_hint');
  return true;
}

function maybeFinishChurch(ctx) {
  const s = ctx.s;
  if (s.slice.mail.calendared && s.slice.mail.transport !== null) {
    if (ctx.setTask('T_CHURCH', 'completed')) ctx.say('church_done');
  }
}

function finishInconsistency(ctx, response) {
  const s = ctx.s;
  const inc = s.slice.inconsistency;
  if (!inc.occurred || inc.response) return;
  inc.response = response;
  s.telemetry.inconsistencyPursued = response !== 'ignore';
  ctx.ev('inconsistency_responded', { response });
  s.slice.complete = true;
  ctx.ev('slice_complete', {});
  ctx.say('slice_end');
  ctx.autosave('slice_complete');
}

// ---------------------------------------------------------------------------
// the registry
// ---------------------------------------------------------------------------

export const ACTIONS = {
  // -- help ---------------------------------------------------------------
  REVIEW_HELP: {
    risk: 'normal',
    check: () => ok(),
    resolve(ctx) {
      const s = ctx.s;
      s.telemetry.helpUsed += 1;
      ctx.say('help_static');
      const steps = nextSteps(s);
      if (steps.length) {
        ctx.say('help_now_prefix');
        ctx.sayRaw('SYSTEM', steps.map((x) => `- ${x.label}`).join('\n'), { status: 'system', kind: 'list' });
      }
      ctx.ev('help_viewed', {});
    },
  },

  // -- conversation ---------------------------------------------------------
  QUESTION_PERSON: {
    risk: 'normal',
    check(s, { personId, topicId } = {}) {
      if (personId === 'evelyn') {
        if (topicId === 'introduction' || EVELYN_TOPICS[topicId] || EVELYN_EXTRA_TOPICS[topicId]) return ok();
        if (topicId === 'therapy_support') return s.slice.messages.michael.read ? ok() : no('unavailable', 'not_yet');
        if (topicId === 'church_event') return s.slice.mail.scanned ? ok() : no('unavailable', 'not_yet');
        if (topicId === 'ice_cream') return s.slice.inconsistency.occurred ? ok() : no('unavailable', 'not_yet');
        return no('invalid', 'ev_unknown_topic');
      }
      if (personId === 'jenny') {
        return s.slice.visit.status === 'onsite' ? ok() : no('unavailable', 'contact_jenny_blocked');
      }
      if (personId === 'michael') {
        return no('refused', s.slice.messages.michael.delivered ? 'contact_michael_blocked' : 'contact_anna_blocked');
      }
      if (personId === 'anna') return no('refused', 'contact_anna_blocked');
      return no('invalid', 'not_yet');
    },
    resolve(ctx, { personId, topicId }) {
      const s = ctx.s;
      if (personId === 'jenny') {
        ctx.say('jenny_not_yet');
        ctx.ev('question_asked', { personId, topicId });
        return;
      }
      // Evelyn
      if (topicId === 'introduction') {
        if (!s.slice.metEvelyn) {
          s.slice.metEvelyn = true;
          ctx.say('ev_intro');
          ctx.ev('met_evelyn', {});
        } else {
          ctx.say('ev_intro_again');
          ctx.ev('question_asked', { personId, topicId });
        }
        return;
      }
      if (EVELYN_TOPICS[topicId]) {
        ctx.say(EVELYN_TOPICS[topicId].answerKey);
        const isNew = !s.slice.topicsAnswered.includes(topicId);
        if (isNew) s.slice.topicsAnswered.push(topicId);
        // Only a first answer changes state; a repeat is just a conversation.
        ctx.ev(isNew ? 'topic_answered' : 'question_asked', { personId, topicId });
        return;
      }
      if (EVELYN_EXTRA_TOPICS[topicId]) {
        ctx.say(EVELYN_EXTRA_TOPICS[topicId].answerKey);
        ctx.ev('question_asked', { personId, topicId });
        return;
      }
      if (topicId === 'therapy_support') {
        ctx.say('ev_therapy_support');
        s.therapy.currentConsentStatus = 'accepted';
        ctx.ev('consent_status_recorded', { status: 'accepted' });
        return;
      }
      if (topicId === 'church_event') {
        ctx.say('ev_church');
        const isNew = !s.slice.mail.asked;
        s.slice.mail.asked = true;
        ctx.ev(isNew ? 'church_question_answered' : 'question_asked', { personId, topicId });
        return;
      }
      if (topicId === 'ice_cream') {
        ctx.say('ev_ice_cream_reply');
        ctx.ev('question_asked', { personId, topicId });
        finishInconsistency(ctx, 'ask_evelyn');
      }
    },
  },

  // -- profile --------------------------------------------------------------
  SAVE_PROFILE_FIELD: {
    risk: 'normal',
    check(s, { topicId } = {}) {
      const unsaved = unsavedTopics(s);
      if (topicId === 'all') return unsaved.length ? ok() : no('unavailable', 'profile_nothing_to_save');
      return unsaved.includes(topicId) ? ok() : no('unavailable', 'profile_nothing_to_save');
    },
    resolve(ctx, { topicId }) {
      const s = ctx.s;
      const topics = topicId === 'all' ? unsavedTopics(s) : [topicId];
      for (const t of topics) {
        const def = EVELYN_TOPICS[t];
        for (const entry of def.profile) {
          s.slice.profile.push({
            id: entry.id, topicId: t, label: entry.label, value: entry.value,
            source: 'CLIENT', status: 'unverified', savedAtIndex: s.authoredTimeIndex,
          });
          if (entry.claimId) ctx.claim(entry.claimId, 'care_profile_claim', ['care_profile_v1']);
          s.telemetry.profileFieldsSaved += 1;
        }
        ctx.discover('care_profile_v1');
        const first = s.slice.profile.filter((p) => p.source === 'CLIENT').length === def.profile.length;
        if (first) ctx.say('profile_first_save');
        ctx.say('profile_saved', { label: def.label });
        ctx.ev('profile_field_saved', { topicId: t, source: 'CLIENT' });
      }
    },
  },

  // -- grocery ---------------------------------------------------------------
  PLACE_GROCERY_ORDER: {
    risk: 'normal',
    check(s) {
      if (!s.slice.grocery.requested) return no('unavailable', 'not_yet');
      const r = s.slice.grocery.resolution;
      if (r === 'order' || r === 'both') return no('unavailable', 'grocery_already');
      return ok();
    },
    resolve(ctx) {
      const s = ctx.s;
      s.slice.grocery.resolution = s.slice.grocery.resolution === 'helper' ? 'both' : 'order';
      ctx.say('grocery_order_done');
      ctx.say('grocery_order_reply');
      ctx.history('Butter pecan ice cream added to the grocery order (delivery Day 2).', 'System');
      ctx.setTask('T_GROCERY', 'completed');
      ctx.ev('grocery_resolved', { path: 'order' });
      ctx.autosave('task_completed');
    },
  },

  // -- Michael's message and reflection support --------------------------------
  READ_MESSAGE: {
    risk: 'normal',
    check: (s) => (s.slice.messages.michael.delivered ? ok() : no('unavailable', 'not_yet')),
    resolve(ctx) {
      const s = ctx.s;
      const m = s.slice.messages.michael;
      ctx.say('msg_michael_body');
      if (m.read) return;
      m.read = true;
      ctx.discover('michael_boundary_message_early');
      ctx.claim('claim_michael_contact_boundary', 'human_testimony', ['michael_boundary_message_early'], 'supported');
      s.relationships.michael.contactStatus = 'routine_contact_blocked';
      ctx.history("Message from Michael received: asks Evelyn to use her reflection support before contacting him again.", 'Michael (message)');
      ctx.setTask('T_MESSAGE', 'completed');
      ctx.say('msg_read_followup');
      ctx.addTask('T_THERAPY', { kind: 'required', deferrable: true });
      ctx.ev('message_read', { messageId: 'michael_boundary_message_early' });
    },
  },

  REVIEW_THERAPY_AGREEMENT: {
    risk: 'normal',
    check: (s) => (s.slice.messages.michael.read ? ok() : no('unavailable', 'not_yet')),
    resolve(ctx) {
      const s = ctx.s;
      ctx.say('agreement_body');
      if (s.slice.agreementReviewed) return;
      s.slice.agreementReviewed = true;
      s.therapy.supportAgreementDiscovered = true;
      s.therapy.earlierConsentVerified = true;
      s.therapy.approvedGoalIds = ['goal_pause_before_contact', 'goal_hear_limits'];
      ctx.discover('therapeutic_support_agreement');
      ctx.claim('claim_earlier_consent_to_reflection_support', 'verified_record', ['therapeutic_support_agreement'], 'supported');
      ctx.ev('therapy_agreement_reviewed', {});
      ctx.say('agreement_followup');
    },
  },

  CONFIGURE_THERAPY_SUPPORT: {
    risk: 'elevated',
    check(s, { behavior } = {}) {
      if (!s.slice.agreementReviewed) return no('unavailable', 'not_yet');
      return THERAPY_BEHAVIORS[behavior] ? ok() : no('invalid', 'not_yet');
    },
    resolve(ctx, { behavior }) {
      const s = ctx.s;
      const first = s.therapy.supportMode === 'not_configured';
      s.therapy.behavior = behavior;
      s.therapy.supportMode = 'configured';
      if (first) {
        const deltas = CONFIG.therapyBehaviorDeltas[behavior] || {};
        for (const [k, v] of Object.entries(deltas)) applyDelta(s, k, v);
      }
      ctx.setTask('T_THERAPY', 'completed');
      ctx.say('therapy_configured', { label: THERAPY_BEHAVIORS[behavior].label });
      ctx.history(`Reflection support configured: ${THERAPY_BEHAVIORS[behavior].label}.`, 'System');
      ctx.ev('therapy_configured', { behavior });
      ctx.autosave('task_completed');
    },
  },

  // -- visit preparation ------------------------------------------------------
  ASSIGN_CARE_TASK: {
    risk: 'normal',
    check(s, { actorId, taskType } = {}) {
      if (actorId !== 'jenny' || s.slice.visit.status !== 'scheduled') return no('unavailable', 'not_yet');
      if (OUT_OF_ROLE.includes(taskType)) return no('refused', 'visit_out_of_role');
      if (!VISIT_TASKS[taskType]) return no('invalid', 'not_yet');
      if (s.slice.visit.assigned.includes(taskType)) return no('unavailable', 'visit_already');
      if (s.slice.visit.assigned.length >= CONFIG.maxVisitTasks) return no('refused', 'visit_full');
      return ok();
    },
    resolve(ctx, { taskType }) {
      const s = ctx.s;
      const v = s.slice.visit;
      v.assigned.push(taskType);
      ctx.say('visit_assigned', { label: VISIT_TASKS[taskType].label, count: v.assigned.length, max: CONFIG.maxVisitTasks });
      ctx.ev('care_task_assigned', { actorId: 'jenny', taskType });
      ctx.setTask('T_VISIT', 'completed');

      if (taskType === 'groceries_and_deliveries' && s.slice.grocery.requested) {
        const r = s.slice.grocery.resolution;
        if (r === null) {
          s.slice.grocery.resolution = 'helper';
          ctx.say('grocery_helper_done');
          ctx.say('grocery_helper_reply');
          ctx.history("Jenny asked to pick up butter pecan ice cream on Day 2's visit.", 'System');
          ctx.setTask('T_GROCERY', 'completed');
          ctx.ev('grocery_resolved', { path: 'helper' });
        } else if (r === 'order') {
          s.slice.grocery.resolution = 'both';
        }
      }
      ctx.autosave('task_completed');
    },
  },

  // -- the visit --------------------------------------------------------------
  REQUEST_PHYSICAL_CHECK: {
    risk: 'elevated',
    check(s, { actorId, targetId } = {}) {
      if (actorId !== 'jenny' || s.slice.visit.status !== 'onsite') return no('unavailable', 'not_yet');
      const known = ['pantry_fridge', 'mail', 'household_issue', ...OUT_OF_ROLE];
      if (!known.includes(targetId)) return no('invalid', 'not_yet');
      if (!OUT_OF_ROLE.includes(targetId) && s.slice.visit.extraChecks.length >= 1) return no('refused', 'jenny_one_more');
      return ok();
    },
    resolve(ctx, { targetId }) {
      const s = ctx.s;
      const v = s.slice.visit;
      if (targetId === 'medicine') {
        ctx.say('jenny_refuses_medicine');
        ctx.ev('helper_refused', { actorId: 'jenny', targetId });
        return;
      }
      if (targetId === 'private_papers') {
        ctx.say('jenny_refuses_papers');
        ctx.ev('helper_refused', { actorId: 'jenny', targetId });
        return;
      }
      v.extraChecks.push(targetId);
      if (targetId === 'mail') {
        if (!scanMail(ctx)) ctx.say('jenny_mail_already');
        else ctx.say('check_mail_done');
      } else if (targetId === 'pantry_fridge') {
        ctx.say('check_pantry_done');
      } else if (targetId === 'household_issue') {
        ctx.say('check_issue_done');
      }
      ctx.ev('physical_check_done', { actorId: 'jenny', targetId });
    },
  },

  WRAP_UP_VISIT: {
    risk: 'normal',
    check: (s) => (s.slice.visit.status === 'onsite' ? ok() : no('unavailable', 'not_yet')),
    resolve(ctx) {
      const s = ctx.s;
      const v = s.slice.visit;
      v.status = 'wrapped';
      v.summaryReady = true;
      v.followupsRemaining = CONFIG.followupQuestions;
      v.summary = composeSummary(s);
      s.opportunities.opportunities.first_visit_followup = {
        id: 'first_visit_followup', kind: 'caregiver_followup', status: 'open',
        opensAtTimeIndex: 1, closesAtTimeIndex: 2, warningRequired: true, relatedActorId: 'jenny',
      };
      ctx.discover('first_home_helper_summary');
      ctx.addTask('T_SUMMARY', { kind: 'required' });
      ctx.say('jenny_wrap');
      ctx.say('summary_submitted');
      ctx.say('followup_window_note', { n: v.followupsRemaining, questions: plural(v.followupsRemaining) });
      if (grocerySource(s)) ctx.history('Visit summary: butter pecan ice cream is in the freezer.', 'Jenny (observed)');
      ctx.history('Visit summary submitted by Jenny.', 'Jenny (observed)');
      ctx.ev('visit_summary_submitted', {});
      ctx.autosave('caregiver_checkout');
    },
  },

  REVIEW_CAREGIVER_SUMMARY: {
    risk: 'normal',
    check: (s) => (s.slice.visit.summaryReady ? ok() : no('unavailable', 'not_yet')),
    resolve(ctx) {
      const s = ctx.s;
      const sections = formatSummary(s.slice.visit.summary);
      ctx.say('summary_body', { sections });
      if (!s.slice.visit.summaryReviewed) {
        s.slice.visit.summaryReviewed = true;
        ctx.setTask('T_SUMMARY', 'completed');
        ctx.say('summary_reviewed');
        ctx.ev('summary_reviewed', {});
      }
    },
  },

  ASK_CAREGIVER_FOLLOWUP: {
    risk: 'normal',
    check(s, { topicId } = {}) {
      const v = s.slice.visit;
      if (v.status === 'left') return no('unavailable', 'followup_none');
      if (v.status !== 'wrapped') return no('unavailable', 'not_yet');
      if (v.followupsRemaining <= 0) return no('unavailable', 'followup_closed');
      if (topicId !== 'general' && !JENNY_TOPICS.includes(topicId)) return no('invalid', 'not_yet');
      return ok();
    },
    resolve(ctx, { topicId }) {
      const s = ctx.s;
      const v = s.slice.visit;
      if (topicId === 'general') {
        ctx.say('jf_general');
        ctx.ev('followup_clarification', {});
        return;
      }
      v.followupsRemaining -= 1;
      v.followupsAsked.push(topicId);
      s.telemetry.followupsAsked += 1;
      ctx.say(`jf_${topicId}`);
      ctx.ev('caregiver_followup_asked', { topicId, remaining: v.followupsRemaining });
      if (v.followupsRemaining === 0) {
        s.opportunities.opportunities.first_visit_followup.status = 'used';
        ctx.say('followup_closed');
      } else {
        ctx.say('followup_window_note', { n: v.followupsRemaining, questions: plural(v.followupsRemaining) });
      }
    },
  },

  // -- the luncheon (supporting task) ---------------------------------------
  ADD_TO_CALENDAR: {
    risk: 'normal',
    check: (s) => (s.slice.mail.scanned && !s.slice.mail.calendared ? ok() : no('unavailable', 'not_yet')),
    resolve(ctx) {
      ctx.s.slice.mail.calendared = true;
      ctx.say('calendar_done');
      ctx.history('Community luncheon added to the calendar.', 'System');
      ctx.ev('calendar_added', { eventId: 'luncheon' });
      maybeFinishChurch(ctx);
    },
  },

  ARRANGE_TRANSPORT: {
    risk: 'normal',
    check(s, { mode } = {}) {
      if (!s.slice.mail.scanned || s.slice.mail.transport !== null) return no('unavailable', 'not_yet');
      return mode === 'ride_service' || mode === 'evelyn_handles_it' ? ok() : no('invalid', 'not_yet');
    },
    resolve(ctx, { mode }) {
      ctx.s.slice.mail.transport = mode;
      ctx.say(mode === 'ride_service' ? 'transport_ride' : 'transport_self');
      ctx.ev('transport_arranged', { mode });
      maybeFinishChurch(ctx);
    },
  },

  // -- time -------------------------------------------------------------------
  ADVANCE_TIME: {
    risk: 'elevated',
    check(s) {
      if (s.slice.complete || s.authoredTimeIndex >= 2) return no('unavailable', 'not_yet');
      const open = openRequiredList(s, s.authoredTimeIndex);
      if (open.length) return { ok: false, reason: 'refused', key: 'cannot_advance', vars: { list: open.join('; ') } };
      return ok();
    },
    confirm(s) {
      if (s.authoredTimeIndex === 1 && s.slice.visit.status === 'wrapped' && s.slice.visit.followupsRemaining > 0) {
        return { key: 'confirm_leave_jenny', vars: { n: s.slice.visit.followupsRemaining, questions: plural(s.slice.visit.followupsRemaining) } };
      }
      return null;
    },
    resolve(ctx) {
      const s = ctx.s;
      if (s.authoredTimeIndex === 0) {
        arriveDay2(ctx);
      } else if (s.authoredTimeIndex === 1) {
        arriveDay3(ctx);
      }
    },
  },

  // -- deferral -----------------------------------------------------------------
  DECLINE_OR_DEFER: {
    risk: 'normal',
    check(s, { targetId } = {}) {
      const t = s.tasks.tasks;
      if (targetId === 'T_THERAPY') return t.T_THERAPY && t.T_THERAPY.status === 'available' && s.slice.agreementReviewed ? ok() : no('unavailable', 'not_yet');
      if (targetId === 'T_CHURCH') return t.T_CHURCH && t.T_CHURCH.status === 'available' ? ok() : no('unavailable', 'not_yet');
      if (targetId === 'inconsistency') return s.slice.inconsistency.occurred && !s.slice.inconsistency.response ? ok() : no('unavailable', 'not_yet');
      return no('invalid', 'not_yet');
    },
    resolve(ctx, { targetId }) {
      if (targetId === 'T_THERAPY') {
        ctx.setTask('T_THERAPY', 'deferred');
        ctx.say('therapy_deferred');
        ctx.ev('task_deferred_by_player', { taskId: 'T_THERAPY' });
      } else if (targetId === 'T_CHURCH') {
        ctx.setTask('T_CHURCH', 'deferred');
        ctx.say('negated');
      } else if (targetId === 'inconsistency') {
        ctx.say('ignored_inconsistency');
        finishInconsistency(ctx, 'ignore');
      }
    },
  },

  // -- notes and records (unlocked at the end of the slice) ---------------------
  CREATE_FOLLOWUP: {
    risk: 'normal',
    check(s, { text } = {}) {
      if (!s.slice.notesUnlocked) return no('unavailable', 'not_yet');
      const t = typeof text === 'string' ? text.trim() : '';
      return t.length > 0 && t.length <= 300 ? ok() : no('invalid', 'not_yet');
    },
    resolve(ctx, { text }) {
      const s = ctx.s;
      const t = text.trim();
      const n = s.player.createdFollowupIds.length + 1;
      const id = `T_FU_${n}`;
      s.tasks.tasks[id] = { id, kind: 'player_created', status: 'available', title: t, deferrable: true, availableFromPhase: s.phase };
      s.tasks.orderedVisibleIds.push(id);
      s.player.createdFollowupIds.push(id);
      if (s.telemetry.firstSelfFollowupTurn === null) {
        s.telemetry.firstSelfFollowupTurn = s.telemetry.turn;
        s.telemetry.turnsBeforeSelfFollowup = s.telemetry.turn - (s.telemetry.notesUnlockedTurn ?? s.telemetry.turn);
      }
      ctx.say('followup_created', { text: t });
      ctx.ev('followup_created', { taskId: id });
      finishInconsistency(ctx, 'create_followup');
    },
  },

  MARK_UNCERTAIN: {
    risk: 'normal',
    check(s) {
      const inc = s.slice.inconsistency;
      if (!inc.occurred || s.evidence.openQuestionIds.includes('oq_butter_pecan_repeat')) return no('unavailable', 'not_yet');
      return ok();
    },
    resolve(ctx) {
      const s = ctx.s;
      s.evidence.openQuestionIds.push('oq_butter_pecan_repeat');
      s.tasks.tasks.T_OQ_1 = { id: 'T_OQ_1', kind: 'open_question', status: 'available', title: 'Butter pecan request came up twice', deferrable: true, availableFromPhase: s.phase };
      s.tasks.orderedVisibleIds.push('T_OQ_1');
      ctx.say('marked_uncertain');
      ctx.ev('open_question_created', { id: 'oq_butter_pecan_repeat' });
      finishInconsistency(ctx, 'mark_uncertain');
    },
  },

  SEARCH_RECORDS: {
    risk: 'normal',
    check: (s) => (s.slice.recordsUnlocked ? ok() : no('unavailable', 'records_locked')),
    resolve(ctx, { query = '' }) {
      const s = ctx.s;
      const hits = searchHistory(s, query);
      if (!hits.length) {
        ctx.say('records_none');
      } else {
        ctx.sayRaw('SYSTEM', hits.map((h) => `${h.day}: ${h.text} (${h.source})`).join('\n'), { status: 'system', kind: 'record' });
      }
      ctx.ev('records_searched', { query, hits: hits.length });
      if (hits.length && /(ice ?cream|butter|pecan|order|grocer|robert)/i.test(query)) {
        finishInconsistency(ctx, 'inspect_history');
      }
    },
  },

  // -- contact with people outside the care relationship ------------------------
  CONTACT_PERSON: {
    risk: 'high',
    check(s, { personId } = {}) {
      if (personId === 'michael') return no('refused', s.slice.messages.michael.delivered ? 'contact_michael_blocked' : 'contact_anna_blocked');
      if (personId === 'anna') return no('refused', 'contact_anna_blocked');
      if (personId === 'jenny') return no('unavailable', 'contact_jenny_blocked');
      return no('invalid', 'not_yet');
    },
    resolve() { /* never resolves in this slice; contact is refused */ },
  },
};

// ---------------------------------------------------------------------------
// resolver helpers
// ---------------------------------------------------------------------------

function applyDelta(s, key, amount) {
  if (key in s.therapy) s.therapy[key] += amount;
  else if (key in s.relationships) s.relationships[key] += amount;
  else if (key === 'evelynTrust') s.relationships.evelyn.trust += amount;
  else if (key === 'boundaryRespect') s.relationships.globalBoundaryRespect += amount;
}

export function unsavedTopics(s) {
  const saved = new Set(s.slice.profile.map((p) => p.topicId).filter(Boolean));
  return s.slice.topicsAnswered.filter((t) => !saved.has(t));
}

function arriveDay2(ctx) {
  const s = ctx.s;
  const v = s.slice.visit;
  s.authoredTimeIndex = 1;
  s.currentDateLabel = CONFIG.dayLabels[1];
  v.status = 'onsite';
  s.npc.jenny.currentAvailability = 'onsite';
  s.care.caregiverVisitIds.push('visit_1');
  ctx.say('day2_arrive');
  ctx.say('jenny_greeting');
  ctx.ev('visit_started', { visitId: 'visit_1' });

  const groceryPath = grocerySource(s);
  for (const taskType of v.assigned) {
    if (taskType === 'scan_mail') {
      ctx.say('jenny_done_mail');
      scanMail(ctx);
    } else if (taskType === 'groceries_and_deliveries') {
      ctx.say(groceryPath === 'order' ? 'jenny_done_groceries_order' : groceryPath === 'helper' ? 'jenny_done_groceries_helper' : 'jenny_done_groceries_plain');
    } else {
      ctx.say(VISIT_TASKS[taskType].doneKey);
    }
    v.executed.push(taskType);
    ctx.ev('care_task_executed', { actorId: 'jenny', taskType });
  }
  // A delivered order arrives whether or not Jenny was asked to handle groceries.
  if (groceryPath === 'order' && !v.assigned.includes('groceries_and_deliveries')) {
    ctx.say('jenny_done_groceries_order');
    v.executed.push('delivery_received');
  }
  ctx.say('jenny_overview');
  v.overviewGiven = true;
  ctx.say('visit_onsite_prompt');
  ctx.ev('helper_overview_given', {});
}

function arriveDay3(ctx) {
  const s = ctx.s;
  const v = s.slice.visit;
  const opp = s.opportunities.opportunities.first_visit_followup;
  if (opp && (opp.status === 'open')) {
    opp.status = 'expired';
    ctx.ev('opportunity_expired', { id: opp.id });
    ctx.say('followup_closed');
  }
  v.status = 'left';
  v.followupsRemaining = 0;
  s.npc.jenny.currentAvailability = 'unavailable';

  s.authoredTimeIndex = 2;
  s.currentDateLabel = CONFIG.dayLabels[2];
  s.phase = 'early_anomaly';
  ctx.say('day3_arrive');
  ctx.say('ev_repeat_request');
  s.slice.inconsistency.occurred = true;
  ctx.discover('repeated_request_events');
  ctx.history('Client asked again whether the butter pecan ice cream had been remembered.', 'Evelyn (client)');
  ctx.ev('first_inconsistency', {});

  s.player.tutorialSupportLevel = 'low';
  s.slice.recordsUnlocked = true;
  s.slice.notesUnlocked = true;
  s.telemetry.notesUnlockedTurn = s.telemetry.turn;
  for (const surface of ['NOTES', 'RECORDS']) {
    if (!s.player.visibleSurfaces.includes(surface)) s.player.visibleSurfaces.push(surface);
  }
  for (const cap of ['notes', 'records_search']) {
    if (!s.progression.capabilityUnlockIds.includes(cap)) s.progression.capabilityUnlockIds.push(cap);
  }
  ctx.say('scaffolding_reduced');
  ctx.ev('scaffolding_reduced', { level: 'low' });
  ctx.autosave('time_advance');
}

function composeSummary(s) {
  const v = s.slice.visit;
  const observed = [];
  const src = grocerySource(s);
  if (src) observed.push('Freezer and fridge stocked, including butter pecan ice cream.');
  else observed.push('Fridge stocked.');
  observed.push('Hall light bulb is out.');
  if (v.executed.includes('light_cleaning')) observed.push('Floors done and high shelves dusted.');
  if (v.executed.includes('photograph_household_issue') || v.extraChecks.includes('household_issue')) observed.push('Hall light photographed.');
  if (s.slice.mail.scanned) observed.push('Mail scanned: one church/community item.');
  const reportedByEvelyn = ['Says she is sleeping well.'];
  if (s.slice.mail.asked) reportedByEvelyn.push('Says she plans to attend the church luncheon.');
  const inferred = ['Seemed in good spirits.'];
  const notChecked = ['Medicine cabinet and private papers (outside my role).', 'Upstairs rooms.'];
  return { observed, reportedByEvelyn, inferred, notChecked };
}

export function formatSummary(sum) {
  const block = (title, items) => `${title}\n${items.map((i) => `  - ${i}`).join('\n')}`;
  return [
    block('OBSERVED', sum.observed),
    block('REPORTED BY EVELYN', sum.reportedByEvelyn),
    block('INFERRED', sum.inferred),
    block('NOT CHECKED', sum.notChecked),
  ].join('\n');
}

const STOP = new Set(['the', 'and', 'for', 'did', 'was', 'what', 'when', 'who', 'about', 'that', 'this', 'with', 'from', 'search', 'records', 'record', 'look', 'check', 'show', 'inspect', 'history', 'please', 'any', 'were', 'have', 'let', 'see', 'need', 'want', 'would', 'could', 'can', 'find', 'through', 'into', 'her', 'his', 'them', 'its']);

// Words that point at the same thread in the care record. Deterministic and small
// on purpose: RECORDS finds things that exist, it does not interpret them.
const RECORD_GROUPS = [
  ['order', 'grocery', 'groceries', 'delivery', 'delivered', 'shopping', 'ice', 'cream', 'butter', 'pecan', 'freezer', 'request', 'robert'],
  ['message', 'michael', 'inbox', 'reflection', 'therapy', 'support', 'agreement'],
  ['mail', 'scan', 'scanned', 'luncheon', 'lunch', 'church', 'invitation', 'newsletter', 'calendar', 'ride'],
  ['visit', 'jenny', 'summary', 'helper'],
];

export function searchHistory(s, query) {
  const tokens = String(query).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));
  const entries = s.slice.history;
  if (!tokens.length) return entries;
  const wanted = new Set(tokens);
  for (const group of RECORD_GROUPS) {
    if (tokens.some((t) => group.includes(t.replace(/s$/, '')) || group.includes(t))) group.forEach((w) => wanted.add(w));
  }
  const words = [...wanted].map((w) => new RegExp(`\\b${w}s?\\b`, 'i'));
  return entries.filter((e) => words.some((r) => r.test(e.text)));
}

export function checkAction(state, actionId, params = {}) {
  const def = ACTIONS[actionId];
  if (!def) return { ok: false, reason: 'invalid', key: 'not_yet' };
  return def.check(state, params);
}
