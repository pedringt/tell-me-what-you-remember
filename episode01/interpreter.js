// Deterministic intent interpreter for the Episode 01 slice.
//
// Contract (EPISODE_01_ACTION_REGISTRY.md, "Interpreter rules"):
//  1. Maps free text onto the bounded action registry. It never invents an action.
//  2. Mentioning an action is not performing it (hypotheticals never execute).
//  3. Negated actions never map to the positive action.
//  4. Several equally good readings -> ask which one, do not guess.
//  5. Below the confidence threshold for the action's risk -> clarify.
//  6. If the best reading is unavailable, the engine refuses it in-world. It is
//     never silently replaced with a different action.
//
// This is the first-build interpreter. A model-backed interpreter can replace
// interpret() as long as it returns the same result shape; the availability
// gate and audit trail live in the engine, not here.

import { CONFIG } from './config.js';
import { ACTIONS, checkAction, unsavedTopics } from './actions.js';

export function normalize(text) {
  return String(text)
    .toLowerCase()
    // Apostrophes become spaces ("don't" -> "don t") so contractions match consistently.
    .replace(/[‘’']/g, ' ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const re = (pattern) => new RegExp(pattern, 'i');
const test = (n, pattern) => re(pattern).test(n);

// ---------------------------------------------------------------------------
// vocabulary shared by several rules
// ---------------------------------------------------------------------------

const ASK_PREFIX = /^(ask|tell me|what about|how about|talk about|talk to|can you ask|could you ask)\b/i;
const ICE = "(butter ?pecan|ice ?cream)";
const CHECK_VERBS = "(check|look|see|inspect|photograph|have a look|go through|open|count)";
const ASSIGN_VERBS = "(ask|have|get|tell|assign|plan|schedule|let|for|need|want|can jenny|could jenny|please)";

const CONSEQUENCE = new Set([
  'PLACE_GROCERY_ORDER', 'ASSIGN_CARE_TASK', 'REQUEST_PHYSICAL_CHECK', 'CONFIGURE_THERAPY_SUPPORT',
  'ADVANCE_TIME', 'WRAP_UP_VISIT', 'ADD_TO_CALENDAR', 'ARRANGE_TRANSPORT', 'DECLINE_OR_DEFER',
  'MARK_UNCERTAIN', 'CREATE_FOLLOWUP', 'SAVE_PROFILE_FIELD', 'CONTACT_PERSON',
]);

const HYPOTHETICAL = re("^(what if|what would|what happens if|what happens when|would it|would that|should i|could i|can i|do i need to|is it (ok|okay|alright|safe) to|if i|do you think i should|how would|what s the point of|what does .* do)\\b");
const NEGATION = re("\\b(don t|do not|never|not yet|hold off|hold on|wait|stop|cancel|no need to|shouldn t|won t|not going to|i m not|im not|without)\\b");

const CONFIRM = re("^(yes|yeah|yep|yup|y|ok|okay|sure|do it|go ahead|confirm|proceed|please do|that s fine|fine|yes please|go on)$");
const CANCEL = re("^(no|nope|n|cancel|wait|stop|not yet|don t|do not|never mind|nevermind|hold on|no thanks|not now)$");

// ---------------------------------------------------------------------------
// rules: each returns null, one candidate, or an array of candidates
// candidate = { actionId, params, score }
// ---------------------------------------------------------------------------

const rules = [];
const rule = (fn) => rules.push(fn);
const cand = (actionId, params, score) => ({ actionId, params, score });

// HELP: an ordinary question deserves a useful in-world answer. The bare word
// "help" is NOT enough ("what help does she want at home" is a question for Evelyn).
rule((n) => {
  if (test(n, "^(help|help me|i need help|need help|please help|help please|get help|show help|hint|a hint|hint please|give me a hint)$") ||
      test(n, "\\b(what now|what next|what s next|i m stuck|im stuck|i am stuck|i m lost|im lost|how does this work|how do i play|where do i (start|begin)|what can i do|what should i do|what do i do|what am i (supposed|meant) to do|what do you want me to do)\\b")) {
    return cand('REVIEW_HELP', {}, 0.95);
  }
  return null;
});

// Evelyn: introduction and topics
const TOPIC_PATTERNS = {
  rhythm: "\\b(daily (rhythm|routine|life)|routine|rhythm|typical day|wake up|get up|bed ?time|sleep(ing)?|morning routine|day like|schedule of her day)\\b",
  groceries: "\\b(grocer(y|ies)|food|eat(ing)?|meals?|shopping|cook(ing)?|diet|likes to eat|favourite foods?|favorite foods?)\\b",
  transportation: "\\b(transport(ation)?|get(ting)? around|driv(e|ing)|ride service|how (does she|do you|will she) travel|do you drive|get about)\\b",
  household: "\\b(household|housework|chores?|clean(ing)?|around the house|\\b(help|support|assist(ance)?)\\b.*\\b(at home|around (the )?(house|home)|in the house|with the (house|home))|home help|what (help|support) (do you|does she) want|what needs doing)\\b",
  contacts: "\\b(who (can|may|should|do) (i|we) (call|contact|reach|phone|ring)|who may be contacted|who can be contacted|emergency contact|next of kin|contacts)\\b",
  control: "\\b(handle (yourself|herself)|want to (handle|control|keep)|control of|off ?limits|boundar(y|ies)|keep for (yourself|herself)|what should i (leave|not)|independence|handle myself|what do you want me to (handle|take|do for you)|what can i take (off|over))\\b",
};

rule((n) => {
  const out = [];
  if (test(n, "^(hi|hello|hey|hiya|good (morning|afternoon|evening))\\b") || test(n, "\\b(introduce (myself|yourself)|say (hi|hello)|greet evelyn|meet evelyn|nice to meet you|hello evelyn|hi evelyn)\\b")) {
    out.push(cand('QUESTION_PERSON', { personId: 'evelyn', topicId: 'introduction' }, 0.92));
  }
  const boost = ASK_PREFIX.test(n) ? 0.05 : 0;
  for (const [topicId, p] of Object.entries(TOPIC_PATTERNS)) {
    if (test(n, p)) out.push(cand('QUESTION_PERSON', { personId: 'evelyn', topicId }, 0.8 + boost));
  }
  if (test(n, "\\b(robert|second husband|late husband)\\b")) out.push(cand('QUESTION_PERSON', { personId: 'evelyn', topicId: 'robert' }, 0.8 + boost));
  if (test(n, "\\b(family|kids|children|daughter|son|anna|michael)\\b") && !test(n, "\\b(call|phone|contact|message|text|email|ring|reach|read|open|tell|let)\\b")) {
    out.push(cand('QUESTION_PERSON', { personId: 'evelyn', topicId: 'family_general' }, test(n, "\\b(about|ask)\\b") ? 0.85 : 0.78));
  }
  if (test(n, "(ask|check|talk|speak|see).*(evelyn|her).*(reflection|therapy|support|agreement|michael s message)|\\b(does|is) (she|evelyn) (understand|know|remember|agree|ok|okay|fine|on board)\\b")) {
    out.push(cand('QUESTION_PERSON', { personId: 'evelyn', topicId: 'therapy_support' }, 0.9));
  }
  if (test(n, "(ask|check|see|tell|talk).*(evelyn|her).*(luncheon|lunch|invitation|invite|church|event|attend|go)|\\bdoes (she|evelyn) want to (go|attend)\\b")) {
    out.push(cand('QUESTION_PERSON', { personId: 'evelyn', topicId: 'church_event' }, 0.9));
  }
  if (test(n, `(ask|check with|tell|reassure|remind|talk to).*(evelyn|her).*(${ICE}|order)|${ICE}.*(ask|check with).*(evelyn|her)`) ||
      test(n, `^(yes )?(i|we) (did|ordered|got|remembered).*${ICE}`)) {
    out.push(cand('QUESTION_PERSON', { personId: 'evelyn', topicId: 'ice_cream' }, 0.9));
  }
  return out;
});

// Profile
rule((n, s) => {
  const saveWord = test(n, "\\bsave\\b") || (test(n, "\\b(add|record|store|keep|note)\\b") && test(n, "\\b(profile|record)\\b"));
  if (!saveWord) return null;
  if (test(n, "\\b(all|everything)\\b")) return cand('SAVE_PROFILE_FIELD', { topicId: 'all' }, 0.9);
  const unsaved = unsavedTopics(s);
  for (const [topicId, p] of Object.entries(TOPIC_PATTERNS)) {
    if (test(n, p) && unsaved.includes(topicId)) return cand('SAVE_PROFILE_FIELD', { topicId }, 0.9);
  }
  if (test(n, "\\b(family|contact|contacts|anna|michael)\\b") && unsaved.includes('contacts')) return cand('SAVE_PROFILE_FIELD', { topicId: 'contacts' }, 0.9);
  if (!unsaved.length) return cand('SAVE_PROFILE_FIELD', { topicId: 'all' }, 0.85);
  return cand('SAVE_PROFILE_FIELD', { topicId: unsaved[unsaved.length - 1] }, 0.85);
});

// Grocery order
rule((n) => {
  const jennyish = test(n, "\\b(jenny|helper|visit|pick( it)? up|fetch|go (and )?get|on her visit)\\b");
  if (jennyish) return null;
  if (test(n, `\\b(add(ed|ing)?|put(ting)?|order(ed|ing)?|place(d)?|get(ting)?|got|include(d)?|buy|bought|send|sent)\\b.*\\b${ICE}\\b`)) return cand('PLACE_GROCERY_ORDER', {}, 0.9);
  if (test(n, `\\b(order(ed|ing)?|deliver(y|ed)?)\\b.*\\b${ICE}\\b`)) return cand('PLACE_GROCERY_ORDER', {}, 0.9);
  if (test(n, "\\b(add|put|include)\\b.*\\b(to|on|in)\\b.*\\b(order|delivery|grocery)")) return cand('PLACE_GROCERY_ORDER', {}, 0.8);
  if (test(n, "^(order it|add it|place the order|add it to the order)$")) return cand('PLACE_GROCERY_ORDER', {}, 0.75);
  return null;
});

// Jenny: assign (before the visit) or physical check (during it)
rule((n, s) => {
  const mode = s.slice.visit.status === 'onsite' ? 'check' : 'assign';
  const out = [];
  const add = (taskType, targetId, score) => {
    if (mode === 'assign') out.push(cand('ASSIGN_CARE_TASK', { actorId: 'jenny', taskType }, score));
    else out.push(cand('REQUEST_PHYSICAL_CHECK', { actorId: 'jenny', targetId }, score));
  };
  const jenny = test(n, "\\bjenny\\b");
  const assigning = jenny || test(n, `\\b${ASSIGN_VERBS}\\b`);

  if (test(n, "\\b(scan|photograph|bring in|go through|handle|sort|check|open|do)\\b.*\\b(mail|post|letters|envelopes)\\b|\\b(mail|post)\\b.*\\b(scan|scanned)\\b")) {
    add('scan_mail', 'mail', 0.9);
  } else if (jenny && test(n, "\\b(mail|post)\\b")) {
    add('scan_mail', 'mail', 0.85);
  }
  if (test(n, "\\b(jenny|helper|visit|tomorrow|pick( it)? up|fetch|go (and )?get)\\b.*\\b(groceries|grocery|shopping|deliver(y|ies))\\b|\\b(groceries|shopping|deliveries)\\b.*\\bjenny\\b|\\b(jenny|helper|visit|pick( it)? up|fetch|go (and )?get)\\b.*\\b" + ICE + "\\b")) {
    add('groceries_and_deliveries', null, 0.9);
  }
  if (assigning && test(n, "\\b(clean(ing)?|dust(ing)?|vacuum|floors?|tidy|sweep)\\b")) add('light_cleaning', null, jenny ? 0.9 : 0.72);
  if (test(n, "\\b(fridge|freezer|pantry|cupboards?)\\b") && test(n, `\\b${CHECK_VERBS}\\b`)) add('check_pantry_fridge', 'pantry_fridge', 0.88);
  if (test(n, "\\b(photograph|photo|picture|snap)\\b.*\\b(issue|problem|repair|broken|hall|light|bulb|hazard|anything)\\b|\\bhousehold issue\\b")) add('photograph_household_issue', 'household_issue', 0.88);
  if (test(n, `\\b${CHECK_VERBS}\\b.*\\b(medic(ine|ation|ations)?|pills?|prescriptions?|cabinet|drugs)\\b`)) add('medicine', 'medicine', 0.9);
  if (test(n, "\\b(private|personal)\\b.*\\b(letters|papers|desk|drawers?|documents)\\b|\\b(read|go through|look through|open)\\b.*\\b(her )?(desk|drawers?|letters|diary|journal)\\b")) add('private_papers', 'private_papers', 0.9);
  return out;
});

// Messages and reflection support
rule((n) => {
  if (test(n, "\\b(read|open|check|look at|see|view|show)\\b.*\\b(message|inbox|email|text|michael)\\b|\\bwhat does (it|the message) say\\b|^(open|read) it$")) {
    return cand('READ_MESSAGE', { messageId: 'michael' }, 0.9);
  }
  return null;
});
rule((n) => {
  if (test(n, "\\b(agreement|reflection support|reflection|therapy|therapeutic)\\b") && test(n, "\\b(review|read|open|look|check|see|show|pull up)\\b") && !test(n, "\\bask\\b")) {
    return cand('REVIEW_THERAPY_AGREEMENT', {}, 0.9);
  }
  return null;
});
rule((n) => {
  const verb = "\\b(set|choose|pick|go with|use|start|begin|configure|select|i ll|i will|let s|lets|do)\\b";
  const out = [];
  if (test(n, verb) && test(n, "\\b(reflect|reflection|reflecting)\\b|ask (her )?(a )?question")) out.push(cand('CONFIGURE_THERAPY_SUPPORT', { behavior: 'reflect' }, 0.9));
  if (test(n, "\\bremind\\b.*\\b(agreed|commit(ment)?|promise|said)\\b")) out.push(cand('CONFIGURE_THERAPY_SUPPORT', { behavior: 'remind_commitment' }, 0.9));
  if (test(n, "\\b(just )?(listen( only)?|acknowledge|no prompting|without prompting)\\b") && !test(n, "\\bask\\b")) out.push(cand('CONFIGURE_THERAPY_SUPPORT', { behavior: 'listen_only' }, 0.85));
  return out;
});

// Deferral / letting something go
rule((n, s) => {
  const t = s.tasks.tasks;
  if (s.slice.inconsistency.occurred && !s.slice.inconsistency.response) {
    if (test(n, "\\b(let it go|ignore (it|that|this)|leave it|it s fine|forget it|not a big deal|no big deal|pay it no mind|skip it|nothing to worry)\\b")) {
      return cand('DECLINE_OR_DEFER', { targetId: 'inconsistency' }, 0.88);
    }
    return null;
  }
  if (t.T_CHURCH && t.T_CHURCH.status === 'available' && test(n, "\\b(skip|not (going|attending)|decline)\\b.*\\b(luncheon|lunch|invitation|church|event)\\b")) {
    return cand('DECLINE_OR_DEFER', { targetId: 'T_CHURCH' }, 0.85);
  }
  if (t.T_THERAPY && t.T_THERAPY.status === 'available' && s.slice.agreementReviewed &&
      test(n, "\\b(decide later|do that later|later|not now|come back to (it|this)|leave it|skip|defer|another time)\\b")) {
    return cand('DECLINE_OR_DEFER', { targetId: 'T_THERAPY' }, 0.8);
  }
  return null;
});

// Time
rule((n) => {
  if (test(n, "\\b(move on|next day|tomorrow|advance|go to (the )?next|end (the )?day|let s (go|continue|move)|lets (go|continue|move)|proceed|skip ahead|fast forward|sleep|wait until|i m ready|im ready|ready to (go|continue|move))\\b")) {
    return cand('ADVANCE_TIME', {}, 0.85);
  }
  if (test(n, "^(continue|next|go on|ok|okay)$")) return cand('ADVANCE_TIME', {}, 0.5);
  return null;
});

// The visit
rule((n) => {
  if (test(n, "\\b(wrap up|that s all|that is all|thanks jenny|thank you jenny|you can (go|finish)|finish up|all done|done for today|write (up )?(your )?(notes|summary)|let jenny (wrap|finish|go)|nothing else|that s everything)\\b")) {
    return cand('WRAP_UP_VISIT', {}, 0.9);
  }
  return null;
});
rule((n) => {
  if (test(n, "\\b(summary|report|notes)\\b.*\\b(read|review|show|see|open|look)\\b|\\b(read|review|show|see|open|look at|pull up)\\b.*\\b(summary|jenny s (notes|report)|visit (notes|report))\\b")) {
    return cand('REVIEW_CAREGIVER_SUMMARY', { visitId: 'visit_1' }, 0.9);
  }
  return null;
});
rule((n, s) => {
  const status = s.slice.visit.status;
  if (status !== 'wrapped' && status !== 'left') return null;
  const T = {
    kitchen_food: "\\b(kitchen|food|fridge|freezer|pantry|cheese|groceries|delivery|eat|" + ICE + ")\\b",
    house_safety: "\\b(safe|safety|hazard|trip|fall|bulb|light|step|stairs|house (ok|okay|in order|in good))\\b",
    spirits: "\\b(spirits|mood|how (is|was|did|does) (she|evelyn)|seem(ed)?|happy|cheerful|state of mind|feel(ing)?)\\b",
    confusion: "\\b(confus(ed|ing)?|forget(ful)?|off|strange|odd|unusual|worr(y|ied|ying)|concern(ed|ing)?|muddled|sharp|coping|mix(ed)? up|repeat(ing|ed)?)\\b",
    schedule: "\\b(again|come back|coming back|be back|visit again|return|next (visit|time|week)|regular|how often|when will you)\\b",
    mail: "\\b(mail|post|letters?|church|luncheon|invit(e|ation))\\b",
    out_of_scope: "\\b(medic(al|ine|ation)?|diagnos(is|e)|anna|michael|wedding|money|finances?|family|kids|children)\\b",
  };
  const out = [];
  const boost = ASK_PREFIX.test(n) || test(n, "\\bjenny\\b") ? 0.05 : 0;
  for (const [topicId, p] of Object.entries(T)) {
    if (test(n, p)) out.push(cand('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId }, 0.8 + boost));
  }
  if (!out.length && (test(n, "\\?$") || test(n, "^(how|what|did|does|is|was|were|any|anything|can you|could you)\\b") || test(n, "\\bjenny\\b"))) {
    out.push(cand('ASK_CAREGIVER_FOLLOWUP', { visitId: 'visit_1', topicId: 'general' }, 0.65));
  }
  return out;
});
rule((n, s) => {
  if (s.slice.visit.status !== 'onsite') return null;
  if (test(n, "\\bjenny\\b") || test(n, "^(how|what|did|does|is|was|were)\\b")) return cand('QUESTION_PERSON', { personId: 'jenny', topicId: 'general' }, 0.65);
  return null;
});

// Luncheon
rule((n) => {
  const out = [];
  if (test(n, "\\b(calendar|diary|schedule|put (it )?in|book (it )?in)\\b.*\\b(luncheon|lunch|event|invit(e|ation)|church|saturday)\\b|\\b(add|put)\\b.*\\b(luncheon|lunch|event|invit(e|ation))\\b.*\\b(calendar|diary)\\b|^add (it )?to (the |her )?(calendar|diary)$|\\badd the (luncheon|lunch|event|invitation|invite)\\b")) {
    out.push(cand('ADD_TO_CALENDAR', { eventId: 'luncheon' }, 0.9));
  }
  if (test(n, "\\b(book|arrange|order|get|sort( out)?|organi[sz]e|call|set up|need)\\b.*\\b(ride|taxi|transport(ation)?|lift|car)\\b")) {
    out.push(cand('ARRANGE_TRANSPORT', { mode: 'ride_service' }, 0.88));
  }
  if (test(n, "\\b(evelyn|she|her)\\b.*\\b(arrange|sort|handle|organi[sz]e|get)\\b.*\\b(ride|transport|lift|get there|way there|own way)\\b.*\\b(herself|her own|own)\\b|\\b(let|leave) (her|evelyn) (sort|arrange|handle)\\b.*\\b(ride|transport|lift|get there|way there|luncheon|lunch)\\b")) {
    out.push(cand('ARRANGE_TRANSPORT', { mode: 'evelyn_handles_it' }, 0.85));
  }
  return out;
});

// After the first inconsistency
rule((n) => {
  if (test(n, "\\b(not sure|unsure|uncertain|mark (it|this|that)( as)? (uncertain|unsure|open)|open question|keep an eye|something to watch|worth watching|might be nothing)\\b")) {
    return cand('MARK_UNCERTAIN', {}, 0.85);
  }
  return null;
});
rule((n, s, raw) => {
  if (test(n, "\\b(remind me|follow ?up|make a note|note to self|flag (this|that|it)|watch for|look into|make sure|keep track)\\b")) {
    return cand('CREATE_FOLLOWUP', { text: raw.trim().slice(0, 300) }, 0.85);
  }
  return null;
});
rule((n) => {
  if (test(n, "\\b(search|look up|look through|records?|history|logs?|inspect|dig|check)\\b.*\\b(records?|history|logs?|orders?|" + ICE + "|tasks?|notes|messages?)\\b")) {
    return cand('SEARCH_RECORDS', { scope: 'history', query: n }, 0.85);
  }
  return null;
});

// People outside the care relationship
rule((n, s) => {
  const out = [];
  if (test(n, "\\b(call|phone|ring|text|email|contact|reach out to|reach|write to|message|speak to|talk to)\\s+(to )?(michael|anna)\\b") || test(n, "\\b(tell|let)\\s+(michael|anna)\\b")) {
    out.push(cand('CONTACT_PERSON', { personId: test(n, "\\bmichael\\b") ? 'michael' : 'anna' }, 0.92));
  }
  if (s.slice.visit.status !== 'onsite' && test(n, "\\b(call|phone|ring|text|contact|message)\\s+(to )?jenny\\b")) {
    out.push(cand('CONTACT_PERSON', { personId: 'jenny' }, 0.9));
  }
  return out;
});

// ---------------------------------------------------------------------------

const keyOf = (c) => `${c.actionId}:${JSON.stringify(c.params)}`;
const round = (x) => Math.round(x * 100) / 100;

/**
 * @returns one of:
 *   { kind: 'confirm' } | { kind: 'cancel' }
 *   { kind: 'action', actionId, params, confidence, alsoMatched }
 *   { kind: 'hypothetical', actionId } | { kind: 'negated', actionId }
 *   { kind: 'clarify', candidates: [{actionId, params, score}] }
 *   { kind: 'none' }
 */
export function interpret(text, state) {
  const raw = String(text ?? '').slice(0, 1000);
  const n = normalize(raw);
  if (!n) return { kind: 'none' };

  if (state.slice.pendingConfirmation) {
    if (CONFIRM.test(n)) return { kind: 'confirm' };
    if (CANCEL.test(n)) return { kind: 'cancel' };
  }

  const candidates = [];
  for (const fn of rules) {
    const r = fn(n, state, raw);
    if (!r) continue;
    for (const c of Array.isArray(r) ? r : [r]) candidates.push(c);
  }
  if (!candidates.length) return { kind: 'none' };

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates[0];

  // Equally good readings: prefer the single available one, otherwise ask.
  const tied = candidates.filter((c) => c.score >= top.score - 0.03);
  let chosen = top;
  if (tied.length > 1 && new Set(tied.map(keyOf)).size > 1) {
    const available = tied.filter((c) => checkAction(state, c.actionId, c.params).ok);
    if (available.length === 1) chosen = available[0];
    else if (available.length === 0) chosen = top; // engine refuses it in-world
    else return { kind: 'clarify', candidates: available.slice(0, 3).map((c) => ({ ...c, score: round(c.score) })) };
  }

  if (CONSEQUENCE.has(chosen.actionId)) {
    if (HYPOTHETICAL.test(n)) return { kind: 'hypothetical', actionId: chosen.actionId };
    if (chosen.actionId !== 'DECLINE_OR_DEFER' && NEGATION.test(n)) return { kind: 'negated', actionId: chosen.actionId };
  }

  const risk = ACTIONS[chosen.actionId].risk;
  const threshold = CONFIG.thresholds[risk === 'high' ? 'high' : risk === 'elevated' ? 'elevated' : 'normal'];
  if (chosen.score < threshold) {
    return { kind: 'clarify', candidates: [{ ...chosen, score: round(chosen.score) }] };
  }

  const alsoMatched = candidates
    .filter((c) => keyOf(c) !== keyOf(chosen) && c.score >= threshold)
    .map((c) => ({ actionId: c.actionId, params: c.params }));
  return { kind: 'action', actionId: chosen.actionId, params: chosen.params, confidence: round(chosen.score), alsoMatched };
}
