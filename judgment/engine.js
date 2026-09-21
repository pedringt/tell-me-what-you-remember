// Portfolio Judgment Game: engine.
// A tiny pure state machine over the authored content. No DOM, no network, no storage,
// no randomness, no generated text. Every function returns a NEW state.
//
//   opening -> incident 1 -> incident 2 -> incident 3 -> ending
//   per incident: observe, up to two inquiries, decide, see the consequence.
//
// Rules from the spec that live here:
//  - two inquiries per incident, then a decision (a decision is always available);
//  - the first inquiry in incident 1 unlocks HISTORY;
//  - asking Evelyn a second time in one incident gets a colder answer and wastes the inquiry;
//  - `guarded` is set by escalating in incident 1 or incident 2, and only changes what
//    Evelyn says when asked what happened in incident 3;
//  - the unseen item at the end comes from a fixed order and never depends on the decision;
//  - nothing ever says a decision was correct or incorrect.

import { INCIDENTS, OPENING } from './content.js';

export const MAX_INQUIRIES = 2;
export const TOTAL = INCIDENTS.length;

const clone = (s) => structuredClone(s);

export function newGame() {
  return {
    phase: 'opening', // opening | incident | ending
    i: -1,
    guarded: false,
    records: INCIDENTS.map(() => ({ taken: [], decisionId: null, historyOpen: false })),
    log: OPENING.map((text) => ({ kind: 'plain', text })),
  };
}

const inc = (s) => INCIDENTS[s.i];
const rec = (s) => s.records[s.i];

function enterIncident(s, i) {
  s.phase = 'incident';
  s.i = i;
  const n = INCIDENTS[i];
  s.log.push({ kind: 'heading', text: `Situation ${i + 1} of ${TOTAL}`, time: n.time });
  if (n.historyPanel) {
    s.records[i].historyOpen = true;
    s.log.push({ kind: 'panel', title: 'HISTORY', lines: n.historyPanel });
  }
  if (n.familyPanel) s.log.push({ kind: 'panel', title: 'FAMILY INSTRUCTIONS', lines: n.familyPanel });
  s.log.push({ kind: 'lines', lines: n.observation });
  s.log.push({ kind: 'protocol', rule: n.protocol.rule, lines: n.protocol.lines });
  s.log.push({ kind: 'lines', lines: n.evelyn });
}

export function begin(state) {
  if (state.phase !== 'opening') return state;
  const s = clone(state);
  enterIncident(s, 0);
  return s;
}

/** Inquiries the player can see and use right now. */
export function options(state) {
  if (state.phase !== 'incident') return { inquiries: [], decisions: [], left: 0, decided: false };
  const n = inc(state);
  const r = rec(state);
  const left = Math.max(0, MAX_INQUIRIES - r.taken.length);
  const decided = r.decisionId !== null;
  const inquiries = [];
  if (!decided && left > 0) {
    for (const q of n.inquiries) {
      if (q.group === 'history' && !r.historyOpen) continue;
      const already = r.taken.includes(q.id);
      if (already && !q.evelyn) continue; // only Evelyn can be asked again
      inquiries.push({ id: q.id, label: already ? `${q.label} (again)` : q.label, group: q.group, again: already });
    }
  }
  const decisions = decided ? [] : n.decisions.map((d) => ({ id: d.id, label: d.label, level: d.level, isDefault: !!d.isDefault }));
  return { inquiries, decisions, left, decided };
}

export function inquire(state, id) {
  const opt = options(state).inquiries.find((q) => q.id === id);
  if (!opt) return state; // not available: unchanged
  const s = clone(state);
  const n = inc(s);
  const r = rec(s);
  const q = n.inquiries.find((x) => x.id === id);
  let lines;
  if (q.evelyn && r.taken.includes(id)) lines = q.cold;
  else if (q.evelyn && q.guardedResult && s.guarded) lines = q.guardedResult;
  else lines = q.result;
  s.log.push({ kind: 'inquiry', label: opt.label, lines });
  r.taken.push(id);
  if (n.unlocksHistoryAfterFirstInquiry && !r.historyOpen) {
    r.historyOpen = true;
    s.log.push({ kind: 'note', text: 'HISTORY now available.' });
  }
  return s;
}

export function decide(state, decisionId) {
  if (state.phase !== 'incident' || rec(state).decisionId !== null) return state;
  const d = inc(state).decisions.find((x) => x.id === decisionId);
  if (!d) return state;
  const s = clone(state);
  rec(s).decisionId = decisionId;
  if (d.setsGuarded) s.guarded = true;
  s.log.push({ kind: 'consequence', label: d.label, lines: d.consequence });
  return s;
}

export function canAdvance(state) {
  return state.phase === 'incident' && rec(state).decisionId !== null;
}

export function next(state) {
  if (!canAdvance(state)) return state;
  const s = clone(state);
  if (s.i < TOTAL - 1) enterIncident(s, s.i + 1);
  else {
    s.phase = 'ending';
    s.log.push({ kind: 'heading', text: 'How the day went' });
  }
  return s;
}

/** First item in the incident's fixed order that the player did not open. Never depends on the decision. */
export function unseenItem(incident, taken) {
  const id = incident.unseenOrder.find((x) => !taken.includes(x));
  return id ? incident.inquiries.find((q) => q.id === id) : null;
}

/** Neutral accounting. No score, no verdict. */
export function accounting(state) {
  return INCIDENTS.map((n, i) => {
    const r = state.records[i];
    const looked = [];
    for (const id of r.taken) {
      const q = n.inquiries.find((x) => x.id === id);
      looked.push(looked.some((l) => l.id === id) ? { id, label: `${q.label} (again)` } : { id, label: q.label });
    }
    const d = n.decisions.find((x) => x.id === r.decisionId) ?? null;
    const def = n.decisions.find((x) => x.isDefault);
    const unseen = unseenItem(n, r.taken);
    return {
      i,
      looked: looked.map((l) => l.label),
      decision: d ? d.label : null,
      happened: d ? d.consequence : [],
      defaultLabel: def.label,
      unseen: unseen ? { label: unseen.label, lines: unseen.result } : null,
    };
  });
}
