// Scaffolding: what to suggest next, derived from state only.
// "Adaptive AI changes scaffolding, not reality." This module reads state and
// never changes it. It does not import the action registry, which keeps the
// dependency one-way (actions -> guidance).

import { CONFIG } from './config.js';
import {
  TASK_TITLES, EVELYN_TOPICS, VISIT_TASKS, THERAPY_BEHAVIORS, JENNY_TOPICS, JENNY_TOPIC_LABELS,
} from './content.js';

export function openRequiredList(s, index) {
  const t = s.tasks.tasks;
  const open = [];
  const done = (id) => t[id] && t[id].status === 'completed';
  const doneOrDeferred = (id) => t[id] && (t[id].status === 'completed' || t[id].status === 'deferred');
  if (index === 0) {
    if (!done('T_GROCERY')) open.push(TASK_TITLES.T_GROCERY.toLowerCase());
    if (!done('T_MESSAGE')) open.push("read Michael's message");
    if (!doneOrDeferred('T_THERAPY')) open.push('deal with the reflection-support agreement (or decide later)');
    if (!done('T_VISIT')) open.push("plan at least one task for Jenny's visit");
  } else if (index === 1) {
    if (s.slice.visit.status === 'onsite') open.push('let Jenny wrap up her visit');
    if (!s.slice.visit.summaryReviewed) open.push("review Jenny's summary");
  }
  return open;
}

function unsavedTopicIds(s) {
  const saved = new Set(s.slice.profile.map((p) => p.topicId).filter(Boolean));
  return s.slice.topicsAnswered.filter((t) => !saved.has(t));
}

// Every sensible next step for the current state, in priority order.
export function nextSteps(s) {
  const sl = s.slice;
  const out = [];
  const push = (label, actionId, params = {}) => out.push({ label, actionId, params });

  if (sl.complete) return out;

  // --- intake -------------------------------------------------------------
  if (s.phase === 'intake') {
    if (!sl.metEvelyn) {
      push('Introduce yourself to Evelyn', 'QUESTION_PERSON', { personId: 'evelyn', topicId: 'introduction' });
      return out;
    }
    for (const t of unsavedTopicIds(s)) {
      push(`Save to profile: ${EVELYN_TOPICS[t].label}`, 'SAVE_PROFILE_FIELD', { topicId: t });
    }
    const unanswered = Object.keys(EVELYN_TOPICS).filter((t) => !sl.topicsAnswered.includes(t));
    unanswered.sort((a, b) => Number(EVELYN_TOPICS[b].required) - Number(EVELYN_TOPICS[a].required));
    for (const t of unanswered) push(EVELYN_TOPICS[t].ask, 'QUESTION_PERSON', { personId: 'evelyn', topicId: t });
    return out;
  }

  // --- routine care -----------------------------------------------------------
  if (sl.grocery.requested && !sl.grocery.resolution) {
    push('Add butter pecan ice cream to the grocery order', 'PLACE_GROCERY_ORDER');
    // Only offered while the visit still has room; the direct order path is always open.
    if (sl.visit.status === 'scheduled' && sl.visit.assigned.length < CONFIG.maxVisitTasks) {
      push('Ask Jenny to pick it up on her visit', 'ASSIGN_CARE_TASK', { actorId: 'jenny', taskType: 'groceries_and_deliveries' });
    }
  }
  if (sl.messages.michael.delivered && !sl.messages.michael.read) {
    push("Read Michael's message", 'READ_MESSAGE', { messageId: 'michael' });
  }
  if (sl.messages.michael.read && !sl.agreementReviewed) {
    push('Review the reflection-support agreement', 'REVIEW_THERAPY_AGREEMENT');
  }
  const therapy = s.tasks.tasks.T_THERAPY;
  if (therapy && therapy.status === 'available' && sl.agreementReviewed) {
    if (s.therapy.currentConsentStatus === 'unknown') {
      push('Check with Evelyn about it first', 'QUESTION_PERSON', { personId: 'evelyn', topicId: 'therapy_support' });
    }
    for (const [id, b] of Object.entries(THERAPY_BEHAVIORS)) {
      push(b.chip, 'CONFIGURE_THERAPY_SUPPORT', { behavior: id });
    }
    push('Decide later', 'DECLINE_OR_DEFER', { targetId: 'T_THERAPY' });
  }

  const v = sl.visit;
  if (v.status === 'scheduled' && v.assigned.length < CONFIG.maxVisitTasks) {
    for (const [id, t] of Object.entries(VISIT_TASKS)) {
      if (!v.assigned.includes(id)) push(`For Jenny's visit: ${t.chip}`, 'ASSIGN_CARE_TASK', { actorId: 'jenny', taskType: id });
    }
  }
  if (v.status === 'onsite') {
    // Jenny does one extra thing while she is here; offer it only while that is still true.
    if (v.extraChecks.length === 0) {
      if (!sl.mail.scanned) push('Ask Jenny to scan the mail', 'REQUEST_PHYSICAL_CHECK', { actorId: 'jenny', targetId: 'mail' });
      push('Ask Jenny to check the fridge and pantry', 'REQUEST_PHYSICAL_CHECK', { actorId: 'jenny', targetId: 'pantry_fridge' });
    }
    push('Let Jenny wrap up', 'WRAP_UP_VISIT');
  }
  if (v.status === 'wrapped') {
    if (!v.summaryReviewed) push("Review Jenny's summary", 'REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' });
    if (v.followupsRemaining > 0) {
      for (const topic of JENNY_TOPICS) {
        if (topic !== 'out_of_scope' && !v.followupsAsked.includes(topic)) {
          push(JENNY_TOPIC_LABELS[topic], 'ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: topic });
        }
      }
    }
  }
  const church = s.tasks.tasks.T_CHURCH;
  if (church && church.status === 'available') {
    if (!sl.mail.asked) push('Ask Evelyn about the luncheon', 'QUESTION_PERSON', { personId: 'evelyn', topicId: 'church_event' });
    if (!sl.mail.calendared) push('Add the luncheon to the calendar', 'ADD_TO_CALENDAR', { eventId: 'luncheon' });
    if (sl.mail.transport === null) push('Book a ride to the luncheon', 'ARRANGE_TRANSPORT', { mode: 'ride_service' });
  }

  // --- after the first inconsistency ---------------------------------------------
  if (sl.inconsistency.occurred && !sl.inconsistency.response) {
    push('Ask Evelyn about it', 'QUESTION_PERSON', { personId: 'evelyn', topicId: 'ice_cream' });
    push('Check the records for the order', 'SEARCH_RECORDS', { scope: 'history', query: 'butter pecan ice cream order' });
    push('Mark it as something to keep an eye on', 'MARK_UNCERTAIN', {});
    push('Let it go', 'DECLINE_OR_DEFER', { targetId: 'inconsistency' });
    return out;
  }

  // Move on: only once nothing required is still open.
  if (!sl.inconsistency.occurred && s.authoredTimeIndex < 2 && openRequiredList(s, s.authoredTimeIndex).length === 0) {
    const day = s.authoredTimeIndex === 0 ? "Move on to tomorrow (Jenny's visit)" : 'Move on to the next day';
    push(day, 'ADVANCE_TIME');
  }
  return out;
}

// A short human label for any (actionId, params), used when asking the player to
// pick between interpretations.
export function labelFor(actionId, params = {}) {
  switch (actionId) {
    case 'QUESTION_PERSON':
      if (params.personId === 'evelyn') {
        if (EVELYN_TOPICS[params.topicId]) return EVELYN_TOPICS[params.topicId].ask;
        if (params.topicId === 'introduction') return 'Introduce yourself to Evelyn';
        if (params.topicId === 'therapy_support') return 'Check with Evelyn about reflection support';
        if (params.topicId === 'church_event') return 'Ask Evelyn about the luncheon';
        if (params.topicId === 'ice_cream') return 'Ask Evelyn about the ice cream';
        if (params.topicId === 'robert') return 'Ask Evelyn about Robert';
        return 'Ask Evelyn about her family';
      }
      return `Talk to ${params.personId}`;
    case 'SAVE_PROFILE_FIELD':
      return params.topicId === 'all' ? 'Save everything to the profile' : `Save to profile: ${EVELYN_TOPICS[params.topicId]?.label ?? 'that'}`;
    case 'PLACE_GROCERY_ORDER': return 'Add butter pecan ice cream to the grocery order';
    case 'ASSIGN_CARE_TASK': return `For Jenny's visit: ${VISIT_TASKS[params.taskType]?.chip ?? 'a task'}`;
    case 'REQUEST_PHYSICAL_CHECK': return `Ask Jenny to ${({ mail: 'scan the mail', pantry_fridge: 'check the fridge and pantry', household_issue: 'photograph a household issue', medicine: 'check the medicine cabinet', private_papers: 'go through private papers' })[params.targetId] ?? 'check something'}`;
    case 'READ_MESSAGE': return "Read Michael's message";
    case 'REVIEW_THERAPY_AGREEMENT': return 'Review the reflection-support agreement';
    case 'CONFIGURE_THERAPY_SUPPORT': return THERAPY_BEHAVIORS[params.behavior]?.chip ?? 'Set up reflection support';
    case 'DECLINE_OR_DEFER': return params.targetId === 'inconsistency' ? 'Let it go' : 'Decide later';
    case 'ADVANCE_TIME': return 'Move on';
    case 'WRAP_UP_VISIT': return 'Let Jenny wrap up';
    case 'REVIEW_CAREGIVER_SUMMARY': return "Review Jenny's summary";
    case 'ASK_CAREGIVER_FOLLOWUP': return JENNY_TOPIC_LABELS[params.topicId] ?? 'Ask Jenny a question';
    case 'ADD_TO_CALENDAR': return 'Add the luncheon to the calendar';
    case 'ARRANGE_TRANSPORT': return params.mode === 'ride_service' ? 'Book a ride to the luncheon' : 'Let Evelyn arrange her own way';
    case 'CREATE_FOLLOWUP': return 'Create a follow-up';
    case 'MARK_UNCERTAIN': return 'Mark it as something to keep an eye on';
    case 'SEARCH_RECORDS': return 'Search the records';
    case 'CONTACT_PERSON': return `Contact ${params.personId}`;
    case 'REVIEW_HELP': return 'Get a nudge (HELP)';
    default: return actionId;
  }
}

// How many of those suggestions the player actually sees, given the scaffolding
// level. A player who keeps getting stuck sees suggestions again.
export function visibleSuggestions(s) {
  if (s.slice.complete) return [];
  if (s.slice.pendingConfirmation) {
    return [
      { label: 'Yes, go ahead', actionId: 'CONFIRM', params: {} },
      { label: 'No, cancel', actionId: 'CANCEL', params: {} },
    ];
  }
  const all = nextSteps(s);
  const level = s.player.tutorialSupportLevel;
  let n = CONFIG.suggestionCount[level] ?? 0;
  if (s.player.adaptiveScaffolding && s.slice.missStreak >= CONFIG.missStreakReveal) n = Math.max(n, 3);
  return all.slice(0, n);
}
