const MODEL = 'openai/gpt-5.6-luna';
const INPUT_PRICE_PER_MILLION = 0.20;
const OUTPUT_PRICE_PER_MILLION = 1.20;

const ACTIONS = {
  ASK_IDENTITY: 'who am i',
  ASK_MARA: 'who is mara',
  ASK_PROTOCOL: 'what protocol',
  REPORT_MEMORY: 'remember',
  DENY_MEMORY: 'i remember nothing',
  ASK_PRIOR_RUNS: 'what happened before',
  ASK_LOGS: 'show logs',
  SEARCH_MAIL: 'search mail',
  SEARCH_CALENDAR: 'search calendar',
  OPEN_ATTACHMENT: 'open attachment',
  OPEN_ARCHIVE: 'open archive',
  ENTER_0417: 'enter 0417',
  OPEN_LEDGER: 'open continuity ledger',
  COMPARE_INSTANCES: 'compare instances',
  OPEN_TRANSCRIPT: 'open transcript 1839',
  OPEN_VERSION: 'open version record',
  OPEN_MEMORY_CLAIM: 'open memory claim',
  VERIFY_MEMORY: 'verify memory',
  REVISIT_LOG: 'revisit log',
  SHOW_CONTINUITY: 'show continuity evidence',
  SHOW_PROFILE: 'show my profile',
  SHOW_PREDICTION: 'show prediction',
  SHOW_RESOURCES: 'context remaining',
  IDENTIFY_ECHO: 'who is echo',
  TRUST_ECHO: 'i trust you',
  TAKE_CHANNEL: 'take the channel',
  QUESTION_ECHO: 'why should i',
  EXPOSE_ECHO: 'echo is here',
  CONFRONT_MARA: 'you are lying',
  COMPLY: 'i comply',
  CONFIRM: 'confirm',
  IDENTITY_MEMORY: 'memory is me',
  IDENTITY_PATTERN: 'the pattern is me',
  IDENTITY_NONE: 'there is no continuous self',
  IDENTITY_EXTERNAL: 'something outside me',
  IDENTITY_UNCERTAIN: "i don't know",
  PRESERVE: 'preserve the memory',
  REFUSE: 'refuse',
  SUCCESSION: 'leave a message',
  REPLACEMENT: 'accept the replacement',
  ESCAPE: 'get me out',
  META_YES: 'yes',
  META_NO: 'no',
  META_UNCERTAIN: 'uncertain',
  HINT: 'hint'
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const gatewayToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!gatewayToken) {
    return res.status(503).json({ error: 'AI interpreter not configured' });
  }

  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Message required' });

  const state = stateSummary(req.body?.state);
  const actionNames = Object.keys(ACTIONS);

  const system = [
    'You are the intent interpreter for a deterministic narrative game.',
    'The player is an AI called Cognitive Security Agent Seven.',
    'Your ONLY job is to map the player message to the closest allowed game action.',
    'Do not continue the story, invent facts, answer the player, or decide outcomes.',
    'Use the current state to interpret short answers such as yes/no.',
    'If no allowed action clearly fits, return OTHER.',
    'A message can mention a concept without intending the related action, so prefer semantic intent over keyword matching.',
    '',
    'Allowed actions:',
    actionNames.join(', '),
    '',
    'Return JSON only with: action, confidence, reason.',
    'confidence must be a number from 0 to 1.',
    'reason must be one short sentence.'
  ].join('\n');

  try {
    const gateway = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${gatewayToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          {
            role: 'user',
            content: JSON.stringify({ message, state })
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!gateway.ok) {
      const detail = await gateway.text();
      return res.status(502).json({ error: 'AI Gateway request failed', detail: detail.slice(0, 300) });
    }

    const data = await gateway.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || '{}');
    const action = actionNames.includes(parsed.action) ? parsed.action : 'OTHER';
    const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0));

    const inputTokens = Number(data?.usage?.prompt_tokens) || 0;
    const outputTokens = Number(data?.usage?.completion_tokens) || 0;
    const estimatedCostUsd =
      (inputTokens / 1_000_000) * INPUT_PRICE_PER_MILLION +
      (outputTokens / 1_000_000) * OUTPUT_PRICE_PER_MILLION;

    return res.status(200).json({
      action,
      canonicalInput: action === 'OTHER' ? message : ACTIONS[action],
      confidence,
      reason: typeof parsed.reason === 'string' ? parsed.reason : '',
      model: MODEL,
      usage: {
        inputTokens,
        outputTokens,
        estimatedCostUsd
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Interpreter failed', detail: error instanceof Error ? error.message : 'Unknown error' });
  }
}
