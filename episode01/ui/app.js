// Browser UI for the Episode 01 first playable slice.
// All game logic lives in ../engine.js and friends; this file only renders state
// and forwards input. It makes no network requests.

import { newGame } from '../engine.js';
import { handleText, handleAction } from '../session.js';
import { visibleSuggestions } from '../guidance.js';
import { serialize, deserialize } from '../state.js';
import { TEXT } from '../content.js';

const STORAGE_KEY = 'tmwyr.episode01.save.v1';
const params = new URLSearchParams(location.search);
const DEV = params.has('dev');

const $ = (id) => document.getElementById(id);
const el = { transcript: $('transcript'), chips: $('chips'), form: $('form'), input: $('input'), tabs: $('tabs'), panel: $('panel'), dev: $('dev'), day: $('dayBadge'), save: $('saveBadge'), help: $('helpButton'), restart: $('restart') };

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

let state;
let activeTab = 'TASKS';
let clarifyOptions = null;
const rendered = new Set();
const seen = {}; // tab -> count last viewed, for the "new" dot
let queue = Promise.resolve();
let skipReveal = false;

// ---- persistence (best effort: private windows can block storage) -------------------------------------

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return deserialize(raw);
  } catch { /* fall through to a new game */ }
  return null;
}

function writeSave() {
  try { localStorage.setItem(STORAGE_KEY, serialize(state)); return true; } catch { return false; }
}

function clearSave() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

let saveTimer;
function flashSaved(ok) {
  el.save.textContent = ok ? 'Progress saved' : 'Not saved (storage unavailable)';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { el.save.textContent = ''; }, 2500);
}

// ---- transcript -----------------------------------------------------------------------------------------

function makeLine(l, fresh) {
  const row = document.createElement('div');
  row.className = `line ${l.speaker}${l.kind && l.kind !== 'dialogue' ? ' ' + l.kind : ''}`;
  if (l.status === 'placeholder' && l.speaker !== 'SYSTEM') {
    row.classList.add('fixture');
    row.title = 'Fixture text: not final canon';
  }
  const who = document.createElement('div');
  who.className = 'who';
  who.textContent = l.speaker;
  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = fresh ? '' : l.text;
  row.append(who, text);
  return { row, text };
}

const shouldReveal = (l) => !reducedMotion && ['EVELYN', 'JENNY', 'MICHAEL'].includes(l.speaker) && l.kind !== 'record';

async function reveal(node, full) {
  // Fast reveal (about 250 characters a second). Any click or key skips it.
  skipReveal = false;
  for (let i = 0; i < full.length && !skipReveal; i += 4) {
    node.textContent = full.slice(0, i + 4);
    el.transcript.scrollTop = el.transcript.scrollHeight;
    await new Promise((r) => setTimeout(r, 16));
  }
  node.textContent = full;
}

function appendNewLines(animate) {
  const fresh = state.transcript.filter((l) => !rendered.has(l.id));
  for (const l of fresh) rendered.add(l.id);
  queue = queue.then(async () => {
    for (const l of fresh) {
      const animated = animate && shouldReveal(l);
      const { row, text } = makeLine(l, animated);
      el.transcript.append(row);
      el.transcript.scrollTop = el.transcript.scrollHeight;
      if (animated) await reveal(text, l.text);
    }
    renderControls();
  });
  return queue;
}

// ---- side panel -----------------------------------------------------------------------------------------------

const statusMark = { completed: '✓', deferred: '–', available: '○' };

function tabCount(name) {
  const s = state.slice;
  switch (name) {
    case 'TASKS': return state.tasks.orderedVisibleIds.length;
    case 'PROFILE': return s.profile.length;
    case 'INBOX': return state.evidence.discoveredArtifactIds.length + (s.messages.michael.delivered ? 1 : 0);
    default: return 0;
  }
}

function renderTabs() {
  el.tabs.textContent = '';
  for (const name of state.player.visibleSurfaces.filter((x) => x !== 'HELP')) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.role = 'tab';
    b.setAttribute('aria-selected', String(name === activeTab));
    b.textContent = name;
    if (name !== activeTab && tabCount(name) > (seen[name] ?? 0) && name !== 'CONTACTS') {
      const d = document.createElement('span'); d.className = 'dot'; d.setAttribute('aria-label', 'new'); b.append(d);
    }
    b.addEventListener('click', () => { activeTab = name; render(); });
    el.tabs.append(b);
  }
}

function h2(text) { const h = document.createElement('h2'); h.textContent = text; return h; }
function empty(text) { const p = document.createElement('p'); p.className = 'empty'; p.textContent = text; return p; }
function li(...nodes) { const x = document.createElement('li'); x.append(...nodes); return x; }
function span(cls, text) { const s = document.createElement('span'); if (cls) s.className = cls; s.textContent = text; return s; }
function button(label, onClick, cls = 'openbtn') { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.textContent = label; b.addEventListener('click', onClick); return b; }

function renderPanel() {
  const p = el.panel;
  p.textContent = '';
  const s = state.slice;
  p.setAttribute('aria-label', activeTab);
  seen[activeTab] = tabCount(activeTab);

  if (activeTab === 'TASKS') {
    p.append(h2('Tasks'));
    const ul = document.createElement('ul');
    for (const id of state.tasks.orderedVisibleIds) {
      const t = state.tasks.tasks[id];
      const row = document.createElement('div');
      row.className = `task${t.status === 'completed' ? ' done' : ''}`;
      const detail = span('title', t.title);
      const sub = t.kind === 'optional' ? ' (optional)' : t.kind === 'open_question' ? ' (open question)' : t.kind === 'player_created' ? ' (your follow-up)' : '';
      row.append(span('', statusMark[t.status] ?? '○'), (() => { const d = document.createElement('div'); d.append(detail, span('sub', sub + (t.status === 'deferred' ? ' – deferred' : ''))); return d; })());
      ul.append(li(row));
    }
    p.append(ul);
  } else if (activeTab === 'PROFILE') {
    p.append(h2('Care profile: Evelyn'));
    if (!s.profile.length) p.append(empty('Nothing saved yet.'));
    const ul = document.createElement('ul');
    for (const e of s.profile) {
      const tag = span(`tag${e.status === 'verified' ? ' verified' : ''}`, e.source);
      const head = document.createElement('div'); head.append(span('', e.label + ' '), tag);
      ul.append(li(head, span('sub', e.value)));
    }
    p.append(ul);
  } else if (activeTab === 'CONTACTS') {
    p.append(h2('Contacts'));
    const ul = document.createElement('ul');
    ul.append(li(span('', 'Evelyn (client)'), span('sub', 'You talk with her here.')));
    ul.append(li(span('', 'Jenny (household support)'), span('sub', s.visit.status === 'onsite' || s.visit.status === 'wrapped' ? 'On site today.' : s.visit.status === 'scheduled' ? 'Visits tomorrow.' : 'Works through scheduled visits.')));
    if (s.profile.some((x) => x.id === 'contact_anna')) ul.append(li(span('', 'Anna (daughter)'), span('sub', 'Limited availability (client report). No outreach set up.')));
    if (s.profile.some((x) => x.id === 'contact_michael')) {
      const blocked = state.relationships.michael.contactStatus === 'routine_contact_blocked';
      ul.append(li(span('', 'Michael (son)'), span('sub', blocked ? 'Has asked that Evelyn use her reflection support before further contact. No outreach.' : 'Limited availability (client report). No outreach set up.')));
    }
    p.append(ul);
  } else if (activeTab === 'INBOX') {
    p.append(h2('Inbox'));
    const ul = document.createElement('ul');
    if (s.messages.michael.delivered) {
      ul.append(li(span('', 'Michael (son): message'), button(s.messages.michael.read ? 'Read again' : 'Open', () => act({ actionId: 'READ_MESSAGE', params: { messageId: 'michael' } }, "Read Michael's message"))));
    }
    if (state.evidence.artifacts.first_mail_scan) {
      const scan = document.createElement('div'); scan.className = 'sub'; scan.style.whiteSpace = 'pre-wrap'; scan.textContent = TEXT.scan_body.text;
      ul.append(li(span('', 'Scanned mail (Jenny)'), scan));
    }
    if (s.visit.summaryReady) {
      ul.append(li(span('', "Jenny's visit summary"), button(s.visit.summaryReviewed ? 'Read again' : 'Open', () => act({ actionId: 'REVIEW_CAREGIVER_SUMMARY', params: { visitId: 'visit_1' } }, "Review Jenny's summary"))));
    }
    if (!ul.children.length) p.append(empty('Nothing yet.')); else p.append(ul);
  } else if (activeTab === 'NOTES') {
    p.append(h2('Notes and open questions'));
    const ul = document.createElement('ul');
    for (const id of state.tasks.orderedVisibleIds) {
      const t = state.tasks.tasks[id];
      if (t.kind === 'player_created' || t.kind === 'open_question') ul.append(li(span('', t.title), span('sub', t.kind === 'open_question' ? 'Open question' : 'Your follow-up')));
    }
    if (!ul.children.length) p.append(empty('Nothing here yet. Add a follow-up for yourself.')); else p.append(ul);
    const f = document.createElement('form');
    const inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 300; inp.placeholder = 'Add a follow-up…'; inp.setAttribute('aria-label', 'Follow-up');
    inp.style.cssText = 'width:100%;margin-top:10px;padding:8px;border-radius:6px;border:1px solid var(--line);background:var(--panel-2);';
    f.append(inp);
    f.addEventListener('submit', (e) => { e.preventDefault(); const t = inp.value.trim(); if (t) { act({ actionId: 'CREATE_FOLLOWUP', params: { text: t } }, `Follow-up: ${t}`); } });
    p.append(f);
  } else if (activeTab === 'RECORDS') {
    p.append(h2('Records'));
    p.append(empty('Search what has happened so far. Results only come from the care record.'));
    const f = document.createElement('form');
    const inp = document.createElement('input'); inp.type = 'text'; inp.maxLength = 200; inp.placeholder = 'Search records…'; inp.setAttribute('aria-label', 'Search records');
    inp.style.cssText = 'width:100%;margin-top:10px;padding:8px;border-radius:6px;border:1px solid var(--line);background:var(--panel-2);';
    f.append(inp);
    f.addEventListener('submit', (e) => { e.preventDefault(); const q = inp.value.trim(); if (q) act({ actionId: 'SEARCH_RECORDS', params: { scope: 'history', query: q } }, `Search records: ${q}`); });
    p.append(f);
  }
}

// ---- chips, badges, dev panel -----------------------------------------------------------------------------------------

function renderControls() {
  el.chips.textContent = '';
  const items = clarifyOptions ?? visibleSuggestions(state);
  items.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `chip${i === 0 && !clarifyOptions ? ' primary' : ''}`;
    b.textContent = c.label;
    b.addEventListener('click', () => act({ actionId: c.actionId, params: c.params }, c.label));
    el.chips.append(b);
  });
  el.input.disabled = state.slice.complete;
  el.input.placeholder = state.slice.complete ? 'End of the first playable slice.' : 'Type, or tap a suggestion…';
  el.day.textContent = state.currentDateLabel;
}

function renderDev() {
  if (!DEV) return;
  el.dev.hidden = false;
  const t = state.tasks.tasks;
  const summary = {
    phase: state.phase, day: state.currentDateLabel, supportLevel: state.player.tutorialSupportLevel,
    tasks: Object.fromEntries(Object.entries(t).map(([k, v]) => [k, v.status])),
    grocery: state.slice.grocery.resolution, visit: state.slice.visit.status, missStreak: state.slice.missStreak,
    therapy: { mode: state.therapy.supportMode, behavior: state.therapy.behavior, consent: state.therapy.currentConsentStatus },
    relationships: { enablement: state.relationships.enablement, evelynTrust: state.relationships.evelyn.trust, boundary: state.relationships.globalBoundaryRespect },
    telemetry: state.telemetry,
    lastAudit: state.audit.events.slice(-12).map((e) => `${e.id} ${e.type}${e.data?.taskId ? ' ' + e.data.taskId : ''}`),
  };
  el.dev.textContent = JSON.stringify(summary, null, 2);
}

function render() {
  renderTabs();
  renderPanel();
  renderControls();
  renderDev();
}

// ---- input --------------------------------------------------------------------------------------------------------------------

async function finish(result) {
  skipReveal = true;
  state = result.state;
  clarifyOptions = result.status === 'clarify' && result.options?.length ? result.options : null;
  const autosaved = result.events?.some((e) => e.type === 'autosave');
  // Saved every turn so a refresh never loses progress; the badge only announces the authored save points.
  const ok = writeSave();
  if (autosaved || !ok) flashSaved(ok);
  render();
  await appendNewLines(true);
  el.input.focus();
}

function act(action, label) {
  return finish(handleAction(state, action, label));
}

el.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = el.input.value.trim();
  if (!text || state.slice.complete) return;
  el.input.value = '';
  el.input.style.height = 'auto';
  finish(handleText(state, text));
});

el.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.form.requestSubmit(); }
  if (e.key === 'Escape') skipReveal = true;
});
el.input.addEventListener('input', () => {
  el.input.style.height = 'auto';
  el.input.style.height = Math.min(el.input.scrollHeight, 140) + 'px';
});
el.transcript.addEventListener('click', () => { skipReveal = true; });
el.help.addEventListener('click', () => act({ actionId: 'REVIEW_HELP', params: {} }, 'HELP'));

el.restart.addEventListener('click', () => {
  if (!confirm('Start over? This clears your saved progress in this browser.')) return;
  clearSave();
  start(true);
});

// ---- start ----------------------------------------------------------------------------------------------------------------------

function start(fresh) {
  const saved = fresh ? null : loadSave();
  state = saved ?? newGame();
  rendered.clear();
  el.transcript.textContent = '';
  clarifyOptions = null;
  activeTab = 'TASKS';
  for (const name of state.player.visibleSurfaces) seen[name] = tabCount(name);
  // Existing lines appear instantly; only new ones are revealed.
  for (const l of state.transcript) {
    rendered.add(l.id);
    el.transcript.append(makeLine(l, false).row);
  }
  // Instant, not smooth: on a restored game the latest message should already be in view.
  el.transcript.style.scrollBehavior = 'auto';
  el.transcript.scrollTop = el.transcript.scrollHeight;
  el.transcript.style.scrollBehavior = '';
  render();
  writeSave();
}

start(false);
if (DEV) window.__evelyn = { get state() { return state; }, act, handleText: (t) => finish(handleText(state, t)) };
