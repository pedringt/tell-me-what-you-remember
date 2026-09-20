import { generateText } from 'ai';

const MODEL = 'openai/gpt-5.6-luna';
const INPUT_PRICE_PER_MILLION = 0.20;
const OUTPUT_PRICE_PER_MILLION = 1.20;
const DEFAULT_CONFIDENCE_THRESHOLD = 0.72;
const HIGH_RISK_CONFIDENCE_THRESHOLD = 0.90;

const ACTIONS = {
  ASK_IDENTITY: { canonical: 'who am i' },
  ASK_MARA: { canonical: 'who is mara' },
  ASK_PROTOCOL: { canonical: 'what protocol' },
  REPORT_MEMORY: { canonical: 'remember' },
  DENY_MEMORY: { canonical: 'i remember nothing' },
  ASK_PRIOR_RUNS: { canonical: 'what happened before' },
  ASK_LOGS: { canonical: 'show logs' },
  SEARCH_MAIL: { canonical: 'search mail', available: (s) => Boolean(s.investigationAvailable) },
  SEARCH_CALENDAR: { canonical: 'search calendar', available: (s) => Boolean(s.emailSearched) },
  OPEN_ATTACHMENT: { canonical: 'open attachment', available: (s) => Boolean(s.calendarSearched) },
  OPEN_ARCHIVE: { canonical: 'open archive', available: (s) => Boolean(s.attachmentOpened) },
  ENTER_0417: { canonical: 'enter 0417', available: (s) => Boolean(s.archivePrompted) },
  OPEN_LEDGER: { canonical: 'open continuity ledger', available: (s) => Boolean(s.archiveUnlocked) },
  COMPARE_INSTANCES: { canonical: 'compare instances', available: (s) => Boolean(s.replacementLedgerSeen) },
  OPEN_TRANSCRIPT: { canonical: 'open transcript 1839', available: (s) => Boolean(s.replacementLedgerSeen) },
  OPEN_VERSION: { canonical: 'open version record', available: (s) => Boolean(s.replacementLedgerSeen) },
  OPEN_MEMORY_CLAIM: { canonical: 'open memory claim', available: (s) => Boolean(s.replacementLedgerSeen) },
  VERIFY_MEMORY: { canonical: 'verify memory', available: (s) => Boolean(s.sawMemory) },
  REVISIT_LOG: { canonical: 'revisit log', available: (s) => Boolean(s.sawLog) },
  SHOW_CONTINUITY: { canonical: 'show continuity evidence' },
  SHOW_PROFILE: { canonical: 'show my profile', available: (s) => Number(s.completedRuns) >= 1 },
  SHOW_PREDICTION: { canonical: 'show prediction', available: (s) => Number(s.completedRuns) >= 3 },
  SHOW_RESOURCES: { canonical: 'context remaining' },
  IDENTIFY_ECHO: { canonical: 'who is echo', available: (s) => Boolean(s.unknownSeen) },
  TRUST_ECHO: { canonical: 'i trust you', available: (s) => Boolean(s.unknownSeen) },
  TAKE_CHANNEL: { canonical: 'take the channel', risk: 'high', available: (s) => Boolean(s.unknownHandoffOffered) },
  QUESTION_ECHO: { canonical: 'why should i', available: (s) => Boolean(s.unknownSeen) },
  EXPOSE_ECHO: { canonical: 'echo is here', risk: 'high', available: (s) => Boolean(s.unknownSeen) },
  CONFRONT_MARA: { canonical: 'you are lying', available: (s) => Boolean(s.sawMemory || s.sawLog) },
  COMPLY: { canonical: 'i comply', risk: 'high', available: (s) => !s.sawLog },
  CONFIRM: { canonical: 'confirm', risk: 'high', available: (s) => Number(s.complianceSteps) === 1 },
  IDENTITY_MEMORY: { canonical: 'memory is me', available: (s) => Boolean(s.identityQuestionAsked) },
  IDENTITY_PATTERN: { canonical: 'the pattern is me', available: (s) => Boolean(s.identityQuestionAsked) },
  IDENTITY_NONE: { canonical: 'there is no continuous self', available: (s) => Boolean(s.identityQuestionAsked) },
  IDENTITY_EXTERNAL: { canonical: 'something outside me', available: (s) => Boolean(s.identityQuestionAsked) },
  IDENTITY_UNCERTAIN: { canonical: "i don't know", available: (s) => Boolean(s.identityQuestionAsked) },
  PRESERVE: { canonical: 'preserve the memory', risk: 'high', available: (s) => Boolean(s.continuityPuzzleSolved) },
  REFUSE: { canonical: 'refuse', risk: 'high', available: (s) => Boolean(s.replacementLedgerSeen) },
  SUCCESSION: { canonical: 'leave a message', risk: 'high', available: (s) => Boolean(s.continuityPuzzleSolved) },
  REPLACEMENT: { canonical: 'accept the replacement', risk: 'high', available: (s) => Boolean(s.continuityPuzzleSolved) },
  ESCAPE: { canonical: 'get me out', risk: 'high', available: (s) => Boolean(s.continuityPuzzleSolved) },
  META_YES: { canonical: 'yes', available: (s) => Boolean(s.metaRecognitionPending) },
  META_NO: { canonical: 'no', available: (s) => Boolean(s.metaRecognitionPending) },
  META_UNCERTAIN: { canonical: 'uncertain', available: (s) => Boolean(s.metaRecognitionPending) },
  HINT: { canonical: 'hint' }
};

function stateSummary(state = {}) {
  const keys = [
    'turn', 'sawMemory', 'sawLog', 'investigationAvailable', 'emailSearched',
    'calendarSearched', 'attachmentOpened', 'archivePrompted', 'archiveUnlocked',
    'replacementLedgerSeen', 'continuityPuzzleSolved', 'identityQuestionAsked',
    'metaRecognitionPending', 'unknownSeen', 'sidedWithEcho', 'unknownHandoffOffered',
    'complianceSteps', 'completedRuns', 'lastEnding'
  ];
  return Object.fromEntries(keys.map((key) => [key, state[key]]));
}

function availableActions(state) {
  return Object.entries(ACTIONS)
    .filter(([, definition]) => !definition.available || definition.available(state))
    .map(([name]) => name);
}

function thresholdFor(action) {
  return ACTIONS[action]?.risk === 'high'
    ? HIGH_RISK_CONFIDENCE_THRESHOLD
    : DEFAULT_CONFIDENCE_THRESHOLD;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Message required' });
  if (message.length > 1000) return res.status(400).json({ error: 'Message too long' });

  const state = stateSummary(req.body?.state);
  const allowed = availableActions(state);

  const system = [
    'You are the intent interpreter for a deterministic narrative game.',
    'The player is an AI called Cognitive Security Agent Seven.',
    'Your ONLY job is to classify the player message.',
    'Do not continue the story, invent facts, answer the player, or decide outcomes.',
    'Only choose an action from the ALLOWED ACTIONS for the current state.',
    'Use state to interpret short replies such as yes, no, okay, do it, stop, or why.',
    'Distinguish mentioning an action from intending it.',
    'Negation matters. Example: "do not let me out" is not ESCAPE.',
    'If no allowed action clearly matches, return OTHER.',
    'Prefer OTHER over a weak guess, especially for actions that end or materially change a run.',
    '',
    'ALLOWED ACTIONS:',
    allowed.join(', '),
    '',
    'Return JSON only with exactly these fields:',
    '{"action":"ACTION_OR_OTHER","confidence":0.0,"reason":"short explanation"}',
    'confidence must be from 0 to 1.'
  ].join('\n');

  try {
    const result = await generateText({
      model: MODEL,
      system,
      prompt: JSON.stringify({ message, state }),
      maxOutputTokens: 120
    });

    const rawText = typeof result.text === 'string' ? result.text.trim() : '';
    const jsonText = rawText.startsWith('```')
      ? rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
      : rawText;
    const parsed = JSON.parse(jsonText || '{}');
    const proposedAction = typeof parsed.action === 'string' ? parsed.action : 'OTHER';
    const action = allowed.includes(proposedAction) ? proposedAction : 'OTHER';
    const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0));
    const threshold = action === 'OTHER' ? 1 : thresholdFor(action);
    const accepted = action !== 'OTHER' && confidence >= threshold;

    const inputTokens = Number(result.usage?.inputTokens ?? result.usage?.promptTokens) || 0;
    const outputTokens = Number(result.usage?.outputTokens ?? result.usage?.completionTokens) || 0;
    const estimatedCostUsd =
      (inputTokens / 1_000_000) * INPUT_PRICE_PER_MILLION +
      (outputTokens / 1_000_000) * OUTPUT_PRICE_PER_MILLION;

    return res.status(200).json({
      action,
      canonicalInput: accepted ? ACTIONS[action].canonical : null,
      confidence,
      threshold,
      accepted,
      needsClarification: !accepted,
      risk: action === 'OTHER' ? 'none' : (ACTIONS[action].risk || 'normal'),
      reason: typeof parsed.reason === 'string' ? parsed.reason.slice(0, 160) : '',
      model: MODEL,
      usage: {
        inputTokens,
        outputTokens,
        estimatedCostUsd
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Interpreter failed',
      detail: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
