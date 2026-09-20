import { createHarness } from '../../episode01/harness.js';

export const ev = (topicId) => ['QUESTION_PERSON', { personId: 'evelyn', topicId }];

/** Intake using structured actions: meet Evelyn, answer and save the required topics. */
export function playIntake(h, { optional = false } = {}) {
  h.act(...ev('introduction'));
  const topics = ['groceries', 'household', 'contacts', 'control'];
  if (optional) topics.push('rhythm', 'transportation');
  for (const topicId of topics) {
    h.act(...ev(topicId));
    h.act('SAVE_PROFILE_FIELD', { topicId });
  }
  return h;
}

export const assign = (h, taskType) => h.act('ASSIGN_CARE_TASK', { actorId: 'jenny', taskType });

/** Everything on Day 1 up to (not including) moving to Day 2. */
export function playDay1(h, { grocery = 'order', therapy = 'reflect', visitTasks = ['scan_mail'] } = {}) {
  playIntake(h);
  if (grocery === 'order') h.act('PLACE_GROCERY_ORDER');
  if (grocery === 'helper') assign(h, 'groceries_and_deliveries');
  h.act('READ_MESSAGE', { messageId: 'michael' });
  h.act('REVIEW_THERAPY_AGREEMENT');
  if (therapy === 'defer') h.act('DECLINE_OR_DEFER', { targetId: 'T_THERAPY' });
  else h.act('CONFIGURE_THERAPY_SUPPORT', { behavior: therapy });
  for (const t of visitTasks) if (!h.state.slice.visit.assigned.includes(t)) assign(h, t);
  return h;
}

/** Day 2: the visit, up to and including reading the summary. */
export function playVisit(h) {
  h.act('ADVANCE_TIME');
  h.act('WRAP_UP_VISIT');
  h.act('REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' });
  return h;
}

export function playToDay3(h, opts) {
  playDay1(h, opts);
  playVisit(h);
  const r = h.act('ADVANCE_TIME');
  if (r.status === 'needs_confirmation') h.say('yes');
  return h;
}

export { createHarness };
