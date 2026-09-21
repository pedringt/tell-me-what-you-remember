// Portfolio Judgment Game: browser UI. Renders engine state; contains no game rules.
// No network requests, no storage, no cookies. Everything resets on reload.

import { UI, CLOSING_QUESTION } from './content.js';
import {
  newGame, begin, options, inquire, decide, next, accounting, TOTAL, MAX_INQUIRIES,
} from './engine.js';

const $ = (id) => document.getElementById(id);
const logEl = $('log');
const controlsEl = $('controls');

let state = newGame();

// ---- tiny DOM helpers (textContent only; emphasis is the one inline exception) --------------

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function inline(parent, text) {
  // `*word*` becomes <em>. Everything else stays plain text.
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    if (/^\*[^*]+\*$/.test(part)) parent.append(el('em', null, part.slice(1, -1)));
    else if (part) parent.append(document.createTextNode(part));
  });
}

function row(tag, text) {
  const r = el('div', tag ? 'row' : 'row plainline');
  if (tag) r.append(el('span', `tag tag-${tag}`, tag));
  const t = el('span', 'txt');
  inline(t, text);
  r.append(t);
  return r;
}

function lines(wrap, ls) {
  ls.forEach((l) => wrap.append(row(l.tag, l.text)));
  return wrap;
}

// ---- log ---------------------------------------------------------------------------------------

function renderBlock(b) {
  switch (b.kind) {
    case 'plain': return el('p', 'plain', b.text);
    case 'heading': {
      const h = el('h2', 'heading');
      h.append(document.createTextNode(b.text));
      if (b.time) { h.append(document.createTextNode(' · ')); h.append(el('span', 'time', b.time)); }
      return h;
    }
    case 'panel': {
      const p = el('section', 'panel');
      p.append(el('div', 'title', b.title));
      return lines(p, b.lines);
    }
    case 'lines': return lines(el('div', 'obs'), b.lines);
    case 'protocol': {
      const p = el('div', 'protocol');
      p.append(row('PROTOCOL', `${b.rule}`));
      // Rule text follows the label in the same column.
      b.lines.forEach((t) => { const r = el('div', 'row plainline'); const x = el('span', 'txt'); inline(x, t); r.append(x); p.append(r); });
      return p;
    }
    case 'inquiry': {
      const w = el('div', 'inq');
      w.append(el('div', 'block-label', `You looked: ${b.label}`));
      return lines(w, b.lines);
    }
    case 'consequence': {
      const w = el('div', 'cons');
      w.append(el('div', 'block-label', `You decided: ${b.label}`));
      return lines(w, b.lines);
    }
    case 'note': return el('p', 'note', b.text);
    default: return el('div');
  }
}

function renderAccounting() {
  const wrap = el('section', 'acct');
  const acc = accounting(state);
  acc.forEach((a) => {
    const h = el('h3', null, `Situation ${a.i + 1}`);
    const dl = el('dl');
    const add = (k, v) => { dl.append(el('dt', null, k)); const dd = el('dd'); if (typeof v === 'string') dd.textContent = v; else dd.append(v); dl.append(dd); };
    add(UI.looked, a.looked.length ? a.looked.join(', ') : UI.nothingLooked);
    add(UI.decided, a.decision ?? '—');
    const happened = el('div');
    a.happened.forEach((l) => happened.append(row(l.tag, l.text)));
    add(UI.happened, happened);
    add(UI.systemDefault, a.defaultLabel);
    wrap.append(h, dl);
    if (a.unseen) {
      const u = el('div', 'unseen');
      u.append(el('div', 'block-label', `${UI.notOpened}: ${a.unseen.label}`));
      a.unseen.lines.forEach((l) => u.append(row(l.tag, l.text)));
      u.append(el('p', 'note', UI.unseenNote));
      wrap.append(u);
    }
  });
  wrap.append(el('p', 'closing', CLOSING_QUESTION));
  return wrap;
}

// ---- controls ------------------------------------------------------------------------------------

function button(label, onClick, { mark, primary } = {}) {
  const b = el('button', primary ? 'primary' : '');
  b.type = 'button';
  b.append(document.createTextNode(label));
  if (mark) b.append(el('span', 'mark', mark));
  b.addEventListener('click', onClick);
  return b;
}

function renderControls() {
  controlsEl.textContent = '';
  if (state.phase === 'opening') {
    controlsEl.append(button(UI.begin, () => update(begin(state)), { primary: true }));
    return;
  }
  if (state.phase === 'ending') {
    controlsEl.append(button(UI.replay, () => { state = newGame(); render(true); }, { primary: true }));
    return;
  }
  const o = options(state);
  if (o.decided) {
    const last = state.i === TOTAL - 1;
    controlsEl.append(button(last ? UI.seeAccounting : UI.nextSituation, () => update(next(state)), { primary: true }));
    return;
  }
  if (o.inquiries.length) {
    const g = el('div', 'group');
    g.append(el('h3', null, UI.inquireHeading(o.left)));
    const btns = el('div', 'btns');
    o.inquiries.forEach((q) => btns.append(button(q.label, () => update(inquire(state, q.id)))));
    g.append(btns);
    controlsEl.append(g);
  } else {
    const g = el('div', 'group');
    g.append(el('h3', null, UI.inquireHeading(0)));
    controlsEl.append(g);
  }
  const d = el('div', 'group');
  d.append(el('h3', null, UI.decideHeading));
  const btns = el('div', 'btns');
  o.decisions.forEach((x) => btns.append(button(x.label, () => update(decide(state, x.id)), { mark: x.isDefault ? UI.defaultMark : undefined })));
  d.append(btns);
  controlsEl.append(d);
}

// ---- render loop ------------------------------------------------------------------------------------

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function render(resetScroll) {
  logEl.textContent = '';
  if (state.phase === 'ending') {
    // The day is over: show only the accounting, on a clean screen.
    logEl.append(renderBlock(state.log[state.log.length - 1]));
    logEl.append(renderAccounting());
  } else {
    state.log.forEach((b) => logEl.append(renderBlock(b)));
  }
  renderControls();
  if (resetScroll || state.phase === 'ending') window.scrollTo(0, 0);
}

// Keep the newest text AND the buttons in view; a new situation scrolls to its own heading.
function reveal(newSituation) {
  const behavior = reduceMotion ? 'auto' : 'smooth';
  if (newSituation) {
    const heads = logEl.querySelectorAll('.heading');
    heads[heads.length - 1]?.scrollIntoView({ block: 'start', behavior });
  } else {
    controlsEl.scrollIntoView({ block: 'end', behavior });
  }
}

function update(newState) {
  const newSituation = newState.i !== state.i && newState.phase === 'incident';
  state = newState;
  render(false);
  const first = controlsEl.querySelector('button');
  if (first) first.focus({ preventScroll: true });
  if (state.phase !== 'ending') reveal(newSituation);
}

$('brand').textContent = UI.title;
$('sub').textContent = UI.subtitle;
$('foot').textContent = UI.footer;
render(true);

// Exposed for debugging in the browser console only.
window.__judgment = { get state() { return state; }, MAX_INQUIRIES };
