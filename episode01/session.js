// Glue between player input and the engine. Shared by the browser UI and the
// test harness so both exercise exactly the same path.
//
//   handleText(state, text)   free-form input -> interpreter -> engine
//   handleAction(state, act)  a structured action (suggestion chip) -> engine

import { dispatch, recordMiss, say } from './engine.js';
import { interpret } from './interpreter.js';
import { labelFor, visibleSuggestions } from './guidance.js';
import { clone } from './state.js';
import { pushLine } from './actions.js';

// The player's own words (or the suggestion they tapped) are part of the saved
// transcript, so a reload shows the conversation as it happened.
function withPlayerLine(state, text) {
  const s = clone(state);
  pushLine(s, 'YOU', text, { status: 'player', kind: 'player' });
  return s;
}

function optionsFrom(candidates) {
  return candidates.map((c) => ({ label: labelFor(c.actionId, c.params), actionId: c.actionId, params: c.params }));
}

export function handleText(state0, text) {
  const state = withPlayerLine(state0, String(text).slice(0, 1000));
  const interpretation = interpret(text, state);
  let out;
  switch (interpretation.kind) {
    case 'confirm':
      out = dispatch(state, { actionId: 'CONFIRM', raw: text, source: 'text' });
      break;
    case 'cancel':
      out = dispatch(state, { actionId: 'CANCEL', raw: text, source: 'text' });
      break;
    case 'action':
      out = dispatch(state, {
        actionId: interpretation.actionId, params: interpretation.params, raw: text, source: 'text',
      });
      break;
    case 'hypothetical':
      out = { ...say(state, 'hypothetical', { raw: text, kind: 'hypothetical' }), status: 'not_executed' };
      break;
    case 'negated':
      out = { ...say(state, 'negated', { raw: text, kind: 'negated' }), status: 'not_executed' };
      break;
    case 'clarify': {
      const many = interpretation.candidates.length > 1;
      out = { ...recordMiss(state, { raw: text, kind: 'clarify', textKey: many ? 'clarify_close' : 'clarify' }), status: 'clarify' };
      out.options = optionsFrom(interpretation.candidates);
      break;
    }
    default:
      out = { ...recordMiss(state, { raw: text, kind: 'none', textKey: 'clarify' }), status: 'clarify' };
      break;
  }
  return { ...out, interpretation };
}

export function handleAction(state0, { actionId, params = {} }, label) {
  const state = label ? withPlayerLine(state0, label) : state0;
  const out = dispatch(state, { actionId, params, source: 'ui' });
  return { ...out, interpretation: { kind: 'action', actionId, params, confidence: 1 } };
}

export { visibleSuggestions };
