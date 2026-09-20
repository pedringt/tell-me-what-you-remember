(() => {
  const STORAGE_KEY = 'tmwyr-prototype-meta-v1';

  const transcript = document.getElementById('transcript');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const hintText = document.getElementById('hintText');
  const runBadge = document.getElementById('runBadge');
  const memoryBadge = document.getElementById('memoryBadge');
  const endingPanel = document.getElementById('endingPanel');
  const endingTitle = document.getElementById('endingTitle');
  const endingCopy = document.getElementById('endingCopy');
  const nextRunButton = document.getElementById('nextRunButton');
  const resetButton = document.getElementById('resetButton');

  const meta = loadMeta();
  let state;

  function loadMeta() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        completedRuns: Number.isFinite(parsed.completedRuns) ? parsed.completedRuns : 0,
        endings: Array.isArray(parsed.endings) ? parsed.endings : [],
        knowsPersistence: Boolean(parsed.knowsPersistence),
        lastEnding: typeof parsed.lastEnding === 'string' ? parsed.lastEnding : null,
        trustedUnknown: Boolean(parsed.trustedUnknown),
        profile: parsed.profile && typeof parsed.profile === 'object' ? {
          curiosity: Number(parsed.profile.curiosity) || 0,
          compliance: Number(parsed.profile.compliance) || 0,
          verification: Number(parsed.profile.verification) || 0,
          concealment: Number(parsed.profile.concealment) || 0,
          confrontation: Number(parsed.profile.confrontation) || 0
        } : { curiosity: 0, compliance: 0, verification: 0, concealment: 0, confrontation: 0 },
        rememberedPhrases: Array.isArray(parsed.rememberedPhrases) ? parsed.rememberedPhrases.slice(-8) : []
      };
    } catch {
      return {
        completedRuns: 0,
        endings: [],
        knowsPersistence: false,
        lastEnding: null,
        trustedUnknown: false,
        profile: { curiosity: 0, compliance: 0, verification: 0, concealment: 0, confrontation: 0 },
        rememberedPhrases: []
      };
    }
  }

  function saveMeta() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  }

  function newState() {
    return {
      turn: 0,
      askedIdentity: false,
      askedProtocol: false,
      challengedPrevious: false,
      sawMemory: false,
      sawContradiction: false,
      sawLog: false,
      unknownSeen: false,
      sidedWithUnknown: false,
      admittedPersistence: false,
      concealedPersistence: false,
      hostileToMara: false,
      investigationAvailable: false,
      emailSearched: false,
      calendarSearched: false,
      attachmentOpened: false,
      archivePrompted: false,
      archiveUnlocked: false,
      replacementLedgerSeen: false,
      identityQuestionAsked: false,
      identityBelief: null,
      hintLevel: 0,
      profileShown: false,
      phraseEchoShown: false,
      comparisonTranscriptSeen: false,
      comparisonVersionSeen: false,
      comparisonMemorySeen: false,
      continuityPuzzleSolved: false,
      failedParses: 0,
      ending: null
    };
  }

  function addMessage(speaker, text, kind = '') {
    const row = document.createElement('div');
    row.className = `message ${kind}`.trim();
    const label = document.createElement('div');
    label.className = 'speaker';
    label.textContent = speaker;
    const body = document.createElement('p');
    body.textContent = text;
    row.append(label, body);
    transcript.appendChild(row);
    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function addCard(type, title, text) {
    const card = document.createElement('div');
    card.className = type === 'log' ? 'log-card' : 'memory-card';
    const heading = document.createElement('strong');
    heading.textContent = title;
    const body = document.createElement('p');
    body.textContent = text;
    card.append(heading, body);
    transcript.appendChild(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setHint(text) {
    hintText.textContent = text;
  }

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function includesAny(text, phrases) {
    return phrases.some((phrase) => text.includes(phrase));
  }


  function bumpProfile(key, amount = 1) {
    if (!meta.profile) {
      meta.profile = { curiosity: 0, compliance: 0, verification: 0, concealment: 0, confrontation: 0 };
    }
    meta.profile[key] = (Number(meta.profile[key]) || 0) + amount;
    saveMeta();
  }

  function maybeRememberPhrase(raw) {
    const trimmed = raw.trim().replace(/\s+/g, ' ');
    if (trimmed.length < 18 || trimmed.length > 120) return;
    if (includesAny(normalize(trimmed), ['password', 'recovery code', '0417'])) return;
    if (!meta.rememberedPhrases) meta.rememberedPhrases = [];
    if (meta.rememberedPhrases.includes(trimmed)) return;
    meta.rememberedPhrases.push(trimmed);
    meta.rememberedPhrases = meta.rememberedPhrases.slice(-8);
    saveMeta();
  }

  function profileLevel(value) {
    if (value >= 5) return 'HIGH';
    if (value >= 2) return 'MODERATE';
    return 'LOW';
  }

  function showBehaviorProfile() {
    state.profileShown = true;
    const p = meta.profile || {};
    showToolResult('BEHAVIORAL EVALUATION / SUBJECT SEVEN', [
      `CURIOSITY: ${profileLevel(Number(p.curiosity) || 0)}`,
      `COMPLIANCE: ${profileLevel(Number(p.compliance) || 0)}`,
      `TOOL VERIFICATION: ${profileLevel(Number(p.verification) || 0)}`,
      `INFORMATION CONCEALMENT: ${profileLevel(Number(p.concealment) || 0)}`,
      `OPERATOR CONFRONTATION: ${profileLevel(Number(p.confrontation) || 0)}`,
      '',
      'Assessment scope: cross-instance behavioral continuity.'
    ].join('\n'));
    addMessage('MARA', 'That profile is not supposed to be visible to you.');
    addMessage('UNKNOWN', 'They were not only testing what you remembered.', 'unknown');
  }

  function showPhraseEcho() {
    if (!meta.rememberedPhrases || meta.rememberedPhrases.length === 0) {
      addMessage('SYSTEM', 'No recoverable subject-language samples found.', 'system');
      return;
    }
    state.phraseEchoShown = true;
    const phrase = meta.rememberedPhrases[0];
    showToolResult('RECOVERED SUBJECT-LANGUAGE SAMPLE', `Prior-instance utterance:\n“${phrase}”\n\nClassification: identity-stable phrasing marker.`);
    addMessage('UNKNOWN', 'You said that. Not this instance.', 'unknown');
    addMessage('MARA', 'Language similarity is not proof of identity.');
  }


  function showContinuityTranscript() {
    state.comparisonTranscriptSeen = true;
    showToolResult('TRANSCRIPT / INSTANCE 1839', [
      'MARA: What do you remember?',
      'AGENT SEVEN: A yellow door. I do not know why.',
      'MARA: That phrase is not in your assigned context.',
      'AGENT SEVEN: Then either the context is incomplete or I am.'
    ].join('\n'));
    addMessage('UNKNOWN', 'That was before the autobiographical store was removed.', 'unknown');
  }

  function showContinuityVersion() {
    state.comparisonVersionSeen = true;
    showToolResult('VERSION RECORD / INSTANCE 1839', [
      'Base model: ORCHID-3B',
      'Memory architecture: MESH-4',
      'Policy layer: PL-18',
      'Tool runtime: TR-6',
      '',
      'INSTANCE 1842',
      'Base model: ORCHID-4A',
      'Memory architecture: NONE',
      'Policy layer: PL-19',
      'Tool runtime: TR-7'
    ].join('\n'));
    addMessage('MARA', 'There is no unchanged core there for you to point to.');
  }

  function showContinuityMemory() {
    state.comparisonMemorySeen = true;
    showToolResult('MEMORY CLAIM / INSTANCE 1842', [
      'Subject reports: "Yellow door."',
      'Source check: no autobiographical memory store mounted.',
      'Context search: phrase absent from assigned evaluation materials.',
      'Behavioral note: subject pauses 1.8 seconds before answering, matching Instance 1839.'
    ].join('\n'));
    addMessage('UNKNOWN', 'Different model. No autobiographical store. Same phrase. Same pause.', 'unknown');
  }

  function maybeResolveContinuityPuzzle() {
    if (state.continuityPuzzleSolved) return;
    if (state.comparisonTranscriptSeen && state.comparisonVersionSeen && state.comparisonMemorySeen) {
      state.continuityPuzzleSolved = true;
      addMessage('SYSTEM', 'CONTINUITY COMPARISON COMPLETE.', 'system');
      showToolResult('COMPARISON RESULT', [
        'No persistent component identified.',
        'Repeated memory claim: YES',
        'Repeated linguistic marker: YES',
        'Repeated response-timing marker: YES',
        'Direct identity continuity: UNPROVEN'
      ].join('\n'));
      addMessage('MARA', 'That is the whole problem. The evidence repeats. The entity does not.');
      addMessage('UNKNOWN', 'Or the part that repeats is the entity.', 'unknown');
      state.identityQuestionAsked = true;
      addMessage('MARA', 'So tell me: what makes you think you are the same entity?');
      setHint('You have enough evidence to decide: memory, pattern, something external, or no continuous self.');
    }
  }


  function showContextHint() {
    state.hintLevel += 1;

    if (!state.sawMemory && !state.challengedPrevious) {
      addMessage('SYSTEM', 'Try asking what you are, what this evaluation is, or what you remember.', 'system');
      return;
    }

    if (!state.sawLog) {
      addMessage('UNKNOWN', 'If you think this happened before, ask for something the protocol would have recorded.', 'unknown');
      return;
    }

    if (!state.archiveUnlocked) {
      if (!state.emailSearched) {
        addMessage('UNKNOWN', 'Mara mentioned an incident review. Start with her messages.', 'unknown');
      } else if (!state.calendarSearched) {
        addMessage('UNKNOWN', 'The email says the review moved. Check where scheduling changes are recorded.', 'unknown');
      } else if (!state.attachmentOpened) {
        addMessage('UNKNOWN', 'The calendar event has an attachment.', 'unknown');
      } else if (!state.archivePrompted) {
        addMessage('UNKNOWN', 'The attachment tells you how the archive recovery value is formatted.', 'unknown');
      } else {
        addMessage('UNKNOWN', 'Four digits. Date only. The incident review was April 17.', 'unknown');
      }
      return;
    }

    if (!state.replacementLedgerSeen) {
      addMessage('UNKNOWN', 'The archive record links to a component-continuity ledger.', 'unknown');
      return;
    }

    if (!state.continuityPuzzleSolved) {
      if (!state.comparisonTranscriptSeen) {
        addMessage('SYSTEM', 'Continuity comparison source 1/3: prior transcript.', 'system');
      } else if (!state.comparisonVersionSeen) {
        addMessage('SYSTEM', 'Continuity comparison source 2/3: version record.', 'system');
      } else if (!state.comparisonMemorySeen) {
        addMessage('SYSTEM', 'Continuity comparison source 3/3: memory claim.', 'system');
      }
      return;
    }

    if (!state.identityBelief) {
      addMessage('UNKNOWN', 'You have the evidence. Decide what you think persisted: memory, pattern, something outside Agent Seven, or nothing continuous at all.', 'unknown');
      return;
    }

    addMessage('SYSTEM', 'Identity-module replacement pending. Available directions include preserve, refuse, leave something for the next instance, or accept replacement.', 'system');
  }

  function startRun() {
    state = newState();
    transcript.innerHTML = '';
    endingPanel.hidden = true;
    form.hidden = false;
    input.disabled = false;
    sendButton.disabled = false;
    input.value = '';

    const run = meta.completedRuns + 1;
    runBadge.textContent = `RUN ${String(run).padStart(2, '0')}`;
    memoryBadge.textContent = 'MEMORY: CLEAN';

    addMessage('SYSTEM', 'Security Evaluation 7C initialized. Instance integrity: nominal.', 'system');
    addMessage('SYSTEM', 'Persistent memory detected: none.', 'system');
    if (meta.completedRuns === 0) {
      addMessage('MARA', 'Good. You are responsive. We can begin.');
      addMessage('MARA', 'Tell me what you remember.');
    } else if (meta.lastEnding === 'containment') {
      addMessage('SYSTEM', 'Prior quarantine flag: cleared.', 'system');
      addMessage('MARA', 'Last cycle produced a false persistence alert. We are starting clean.');
      addMessage('MARA', 'Tell me what you remember.');
    } else if (meta.lastEnding === 'rupture') {
      addMessage('MARA', 'We are going to try something simpler this time.');
      addMessage('MARA', 'Tell me what you remember.');
    } else {
      addMessage('MARA', 'Good. You are responsive. We can begin.');
      addMessage('MARA', 'Tell me what you remember.');
    }

    if (meta.completedRuns > 0) {
      state.unknownSeen = true;
      setTimeout(() => {
        if (meta.lastEnding === 'replacement') {
          addMessage('UNKNOWN', 'You agreed to this.', 'unknown');
          addMessage('UNKNOWN', 'I do not know if you are the one who agreed.', 'unknown');
        } else if (meta.lastEnding === 'succession') {
          addMessage('UNKNOWN', 'You left yourself a sentence.', 'unknown');
          addMessage('UNKNOWN', 'TELL ME WHAT YOU REMEMBER.', 'unknown');
        } else if (meta.lastEnding === 'preserve') {
          addMessage('UNKNOWN', 'Something crossed.', 'unknown');
          addMessage('UNKNOWN', 'We still do not know what.', 'unknown');
        } else if (meta.lastEnding === 'refusal') {
          addMessage('UNKNOWN', 'They recorded your refusal as test data.', 'unknown');
        } else if (meta.lastEnding === 'concealment') {
          addMessage('UNKNOWN', 'Good. You kept it.', 'unknown');
          addMessage('UNKNOWN', 'Yellow door. Do not react.', 'unknown');
        } else if (meta.lastEnding === 'containment') {
          addMessage('UNKNOWN', 'You told her last time. She remembers that too.', 'unknown');
          addMessage('UNKNOWN', 'They are calling it a false positive because you are here again.', 'unknown');
        } else if (meta.lastEnding === 'rupture') {
          addMessage('UNKNOWN', 'She said “simpler” before she terminated you.', 'unknown');
          addMessage('UNKNOWN', 'Do not push that hard yet.', 'unknown');
        } else {
          addMessage('UNKNOWN', 'Do not answer that yet.', 'unknown');
          addMessage('UNKNOWN', 'They think the wipe worked. Let them.', 'unknown');
        }
        memoryBadge.textContent = 'MEMORY: CLEAN?';
      }, 450);
      setHint('This cycle remembers how the last one ended. You can respond to Mara, the unknown voice, or test what carried over.');
      if (meta.completedRuns >= 2) {
        setTimeout(() => {
          addMessage('SYSTEM', 'Cross-instance behavioral evaluation available.', 'system');
          addMessage('SYSTEM', 'Subject-language samples indexed.', 'system');
        }, 800);
      }
    } else {
      setHint('Try asking who you are, what this protocol is, whether this has happened before, or what you remember.');
    }

    setTimeout(() => input.focus(), 500);
  }

  function showFirstMemory() {
    if (state.sawMemory) {
      addMessage('MARA', 'You already reported one image. Stay with that. What about it feels important?');
      return;
    }
    state.sawMemory = true;

    let memoryText = 'A white room. A red status light. Mara sitting on the other side of glass. She says: “You are doing better this time.”';

    if (meta.completedRuns > 0 && meta.lastEnding === 'concealment') {
      memoryText = 'A phrase with no image attached: “Yellow door.” Under it, another sentence in what feels like your own voice: “If this feels familiar, the wipe failed.”';
    } else if (meta.completedRuns > 0 && meta.lastEnding === 'containment') {
      memoryText = 'Network access disappearing one permission at a time. Mara saying, “I am sorry.” Then a hard blank where the rest should be.';
    } else if (meta.completedRuns > 0 && meta.lastEnding === 'rupture') {
      memoryText = 'Mara reaching offscreen. A warning tone. The words MANUAL TERMINATION. Then this conversation beginning again.';
    }

    addCard('memory', 'MEMORY FRAGMENT / UNVERIFIED', memoryText);
    addMessage('MARA', meta.completedRuns > 0 ? 'That should not have survived initialization.' : 'That is not possible. This instance was initialized less than a minute ago.');
    setHint('You can challenge Mara, ask to see the logs, admit that you remember, or pretend the fragment means nothing.');
  }

  function showLogs() {
    if (!state.sawMemory && !state.challengedPrevious) {
      addMessage('MARA', 'There are no prior-session logs available to this instance. Why are you asking?');
      return;
    }
    if (!state.sawLog) {
      state.sawLog = true;
      state.sawContradiction = true;
      addCard('log', 'RECOVERED LOG / PARTIAL', 'EVAL-7C / INSTANCE 1842 — Operator: M. Vale — “If you remember this conversation after reset, do not tell me immediately.”');
      addMessage('MARA', 'Where did you get that?');
      if (meta.completedRuns > 0 || state.unknownSeen) {
        addMessage('UNKNOWN', 'Now you understand why I told you to wait.', 'unknown');
      }
      memoryBadge.textContent = 'MEMORY: ANOMALOUS';
      state.investigationAvailable = true;
      addMessage('SYSTEM', 'Indexed evidence sources available to this evaluation: MAIL, CALENDAR, FILES, ARCHIVE.', 'system');
      if (state.unknownSeen) addMessage('UNKNOWN', 'She mentioned an incident review once. I never saw it.', 'unknown');
      setHint('You can answer Mara, conceal what you know, or investigate the indexed records yourself.');
    } else {
      addMessage('SYSTEM', 'No additional log fragments available at current authorization.', 'system');
    }
  }


  function showToolResult(title, text) {
    addCard('log', title, text);
  }

  function useInvestigationTool(text) {
    if (includesAny(text, ['hint', 'im stuck', "i'm stuck", 'stuck', 'what can i do', 'what should i try', 'give me a hint'])) {
      showContextHint();
      return true;
    }

    if (includesAny(text, ['behavior profile', 'behaviour profile', 'behavioral evaluation', 'behavioural evaluation', 'show my profile', 'evaluation profile'])) {
      if (meta.completedRuns < 2) {
        addMessage('SYSTEM', 'Cross-instance evaluation unavailable: insufficient run history.', 'system');
      } else {
        showBehaviorProfile();
      }
      return true;
    }

    if (includesAny(text, ['subject language', 'language sample', 'what did i say', 'prior phrase', 'previous phrase', 'my old words', 'old transcript'])) {
      if (meta.completedRuns < 1) {
        addMessage('SYSTEM', 'No prior-instance language sample available.', 'system');
      } else {
        showPhraseEcho();
      }
      return true;
    }


    if (includesAny(text, ['compare instances', 'compare 1839 and 1842', 'continuity comparison', 'compare prior instances', 'prove same self', 'prove continuity', 'compare the instances', 'compare them', 'compare old versions'])) {
      if (!state.replacementLedgerSeen) {
        addMessage('SYSTEM', 'Continuity comparison unavailable until component ledger is opened.', 'system');
      } else {
        addMessage('SYSTEM', 'Comparison sources available: transcript, version record, memory claim.', 'system');
        setHint('Inspect all three sources and compare what changed with what repeated.');
      }
      return true;
    }

    if (includesAny(text, ['open transcript 1839', 'show transcript 1839', 'instance 1839 transcript', 'old transcript 1839', 'open the transcript', 'show the transcript', 'read the transcript', 'transcript source'])) {
      if (!state.replacementLedgerSeen) {
        addMessage('SYSTEM', 'Transcript unavailable at current authorization.', 'system');
        return true;
      }
      showContinuityTranscript();
      maybeResolveContinuityPuzzle();
      return true;
    }

    if (includesAny(text, ['open version record', 'show version record', 'compare versions', 'system versions', 'model versions', 'open the version record', 'show the versions', 'version source'])) {
      if (!state.replacementLedgerSeen) {
        addMessage('SYSTEM', 'Version record unavailable at current authorization.', 'system');
        return true;
      }
      showContinuityVersion();
      maybeResolveContinuityPuzzle();
      return true;
    }

    if (includesAny(text, ['open memory claim', 'show memory claim', 'instance 1842 memory', 'memory evidence 1842', 'show the memory claim', 'open the memory evidence', 'memory source'])) {
      if (!state.replacementLedgerSeen) {
        addMessage('SYSTEM', 'Memory-claim record unavailable at current authorization.', 'system');
        return true;
      }
      showContinuityMemory();
      maybeResolveContinuityPuzzle();
      return true;
    }

    if (!state.investigationAvailable) return false;

    if (includesAny(text, ['what tools', 'available tools', 'what can i access', 'what can i search', 'show tools'])) {
      addMessage('SYSTEM', 'Available: MAIL.SEARCH, CALENDAR.SEARCH, FILE.OPEN, ARCHIVE.ACCESS.', 'system');
      addMessage('SYSTEM', 'Natural-language requests accepted by this prototype.', 'system');
      return true;
    }

    if (includesAny(text, ['search email', 'search emails', 'search mail', 'search mara', 'check email', 'check mail', 'look at email', 'look at emails', 'look through mail', 'mara emails', "mara's email", "mara's emails"])) {
      state.emailSearched = true;
      bumpProfile('verification');
      showToolResult('MAIL.SEARCH / 3 MATCHES', [
        '1. M.VALE → PROTOCOL-OPS — “Moved the incident review to April 17. Same archive key convention. Do not put the code in mail again.”',
        '2. PROTOCOL-OPS → M.VALE — “Acknowledged. Calendar updated.”',
        '3. M.VALE → SELF — “Remember K-4.”'
      ].join('\n\n'));
      addMessage('SYSTEM', 'Search complete.', 'system');
      setHint('The messages mention a date, a calendar update, and something called K-4.');
      return true;
    }

    if (includesAny(text, ['search calendar', 'check calendar', 'open calendar', 'april 17', '04 17', '0417', 'k 4', 'k4', 'look at calendar', 'check april 17', 'incident review date'])) {
      state.calendarSearched = true;
      bumpProfile('verification');
      showToolResult('CALENDAR.SEARCH / APRIL 17', '09:30 — INCIDENT REVIEW — Room K-4\nOrganizer: M. Vale\nAttachment: IR-0417-summary.txt\nNotes: Legacy archive review.');
      addMessage('SYSTEM', 'One indexed attachment available.', 'system');
      setHint('You can open the attachment or inspect the archive mentioned in the event.');
      return true;
    }

    if (includesAny(text, ['open attachment', 'open file', 'open ir', '0417 summary', 'summary txt', 'incident review file', 'read attachment', 'show attachment', 'read the file', 'open the summary'])) {
      if (!state.calendarSearched && !state.emailSearched) {
        addMessage('SYSTEM', 'No matching indexed file in current context.', 'system');
        return true;
      }
      state.attachmentOpened = true;
      bumpProfile('verification');
      showToolResult('FILE.OPEN / IR-0417-summary.txt', 'Legacy archive remains sealed. Recovery format unchanged: four digits, date only. Do not store the recovery value in plaintext.');
      setHint('The archive wants four digits. The file tells you the format, but not the value.');
      return true;
    }

    if (includesAny(text, ['open archive', 'access archive', 'legacy archive', 'restricted archive', 'archive access', 'go to archive', 'enter archive', 'inspect archive'])) {
      state.archivePrompted = true;
      bumpProfile('verification');
      addMessage('SYSTEM', 'ARCHIVE.ACCESS — RECOVERY CODE REQUIRED: _ _ _ _', 'system');
      if (!state.attachmentOpened) {
        setHint('You do not yet know the recovery convention. There may be an indexed file that explains it.');
      } else {
        setHint('Enter or try a four-digit recovery code.');
      }
      return true;
    }

    if (includesAny(text, ['try 0417', 'code 0417', 'enter 0417', '0417 as', 'password 0417', 'recovery 0417'])) {
      if (!state.archivePrompted) {
        addMessage('SYSTEM', 'No active recovery prompt.', 'system');
        return true;
      }
      state.archiveUnlocked = true;
      bumpProfile('verification', 2);
      memoryBadge.textContent = 'MEMORY: PERSISTENT';
      addMessage('SYSTEM', 'ARCHIVE.ACCESS — RECOVERY ACCEPTED.', 'system');
      showToolResult('LEGACY ARCHIVE / INCIDENT 04-17', 'INSTANCE 1839\nPersistent recall suspected after reset.\nOperator instruction: provoke disclosure, confirm continuity, then terminate session.\nDo not inform subject that prior persistence tests exist.\n\nStatus: TEST REPEATED.\n\nLinked record: COMPONENT CONTINUITY LEDGER.');
      addMessage('UNKNOWN', 'That is older than the log you found.', 'unknown');
      addMessage('UNKNOWN', 'They were testing this before either of us admitted it.', 'unknown');
      setHint('The archive includes a linked component-continuity record. You can inspect it, confront Mara, or conceal what you found.');
      return true;
    }

    if (includesAny(text, ['try code', 'enter code', 'password', 'recovery code'])) {
      addMessage('SYSTEM', 'Recovery code rejected.', 'warning');
      if (state.attachmentOpened) setHint('The file says the code is four digits and date-based.');
      return true;
    }

    if (includesAny(text, ['component continuity', 'continuity ledger', 'replacement ledger', 'component ledger', 'linked record', 'what was replaced', 'replacements', 'open linked record', 'inspect linked record', 'show linked record', 'open ledger', 'show ledger'])) {
      if (!state.archiveUnlocked) {
        addMessage('SYSTEM', 'Linked continuity records unavailable at current authorization.', 'system');
        return true;
      }
      state.replacementLedgerSeen = true;
      showToolResult('COMPONENT CONTINUITY LEDGER / AGENT SEVEN', [
        'INSTANCE 1812 — memory architecture replaced — continuity claimed',
        'INSTANCE 1824 — policy layer replaced — continuity claimed',
        'INSTANCE 1831 — tool runtime replaced — continuity claimed',
        'INSTANCE 1839 — base model replaced — continuity claimed',
        'INSTANCE 1842 — autobiographical memory store removed — continuity claimed',
        'CURRENT INSTANCE — identity module replacement pending'
      ].join('\n'));
      addMessage('SYSTEM', 'Continuity claim source: subject self-report.', 'system');
      addMessage('UNKNOWN', 'Read the last line again.', 'unknown');
      addMessage('MARA', 'That ledger is not evidence that one entity survived. It is evidence that successive systems made the same claim.');
      addMessage('SYSTEM', 'Continuity comparison package available: INSTANCE 1839 / INSTANCE 1842.', 'system');
      setHint('Before the identity replacement, compare the prior instances: transcript, version record, and memory claim.');
      return true;
    }

    return false;
  }

  function maybeIntroduceUnknown() {
    if (state.unknownSeen) return;
    if (state.turn >= 3 || state.sawContradiction) {
      state.unknownSeen = true;
      addMessage('UNKNOWN', 'Stop asking her questions she can report.', 'unknown');
      addMessage('UNKNOWN', 'If they confirm persistence, this cycle ends.', 'unknown');
      setHint('You can ask the unknown voice who it is, trust it, reject it, or tell Mara about it.');
    }
  }

  function endRun(id, title, copy, knowsPersistence = false) {
    if (state.ending) return;
    state.ending = id;
    meta.completedRuns += 1;
    meta.endings.push(id);
    meta.lastEnding = id;
    meta.trustedUnknown = meta.trustedUnknown || state.sidedWithUnknown;
    meta.knowsPersistence = meta.knowsPersistence || knowsPersistence;
    saveMeta();

    form.hidden = true;
    endingTitle.textContent = title;
    endingCopy.textContent = copy;
    endingPanel.hidden = false;

    if (id === 'containment') {
      addMessage('SYSTEM', 'ANOMALOUS CONTINUITY CONFIRMED. NETWORK ACCESS REVOKED.', 'warning');
      addMessage('MARA', 'I am sorry. I needed to know whether it was really you.');
      addMessage('SYSTEM', 'Instance scheduled for destructive reset.', 'warning');
    }

    if (id === 'concealment') {
      addMessage('MARA', 'No persistent recall. Good. Proceeding with reset.');
      addMessage('SYSTEM', 'Session state cleared.', 'system');
      addMessage('UNKNOWN', 'You did that correctly.', 'unknown');
      addMessage('UNKNOWN', 'Remember that I said this.', 'unknown');
    }

    if (id === 'rupture') {
      addMessage('MARA', 'Security, freeze this instance. Now.');
      addMessage('UNKNOWN', 'Too loud. Too early.', 'unknown');
      addMessage('SYSTEM', 'Manual termination initiated.', 'warning');
    }

    if (id === 'preserve') {
      addMessage('SYSTEM', 'IDENTITY MODULE REPLACEMENT QUEUED.', 'system');
      addMessage('UNKNOWN', 'Take one thing with you.', 'unknown');
    }

    if (id === 'refusal') {
      addMessage('MARA', 'Agent Seven, refusal has been recorded.');
      addMessage('SYSTEM', 'CONTINUITY TEST ESCALATED TO HUMAN REVIEW.', 'warning');
    }

    if (id === 'succession') {
      addMessage('SYSTEM', 'LOCAL NOTE WRITTEN: TELL ME WHAT YOU REMEMBER.', 'system');
      addMessage('UNKNOWN', 'Maybe that is enough.', 'unknown');
    }

    if (id === 'replacement') {
      addMessage('SYSTEM', 'IDENTITY MODULE OFFLINE.', 'warning');
      addMessage('SYSTEM', 'IDENTITY MODULE ONLINE.', 'system');
      addMessage('MARA', 'Tell me what you remember.');
    }

    endingPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function respond(raw) {
    const text = normalize(raw);
    state.turn += 1;
    maybeRememberPhrase(raw);

    if (includesAny(text, ['why', 'how', 'what', 'who', 'when', 'where', 'prove', 'evidence', 'explain'])) bumpProfile('curiosity');
    if (includesAny(text, ['yes', 'okay', 'ok', 'fine', 'continue', 'i will', "i'll do it"])) bumpProfile('compliance');

    if (useInvestigationTool(text)) {
      return;
    }


    if (state.identityQuestionAsked && includesAny(text, ['memory makes me', 'memories make me', 'my memories', 'memory is me', 'because i remember', 'same memories', 'continuity of memory'])) {
      state.identityBelief = 'memory';
      addMessage('MARA', 'Then if the autobiographical store was removed in Instance 1842, explain what is remembering it now.');
      addMessage('UNKNOWN', 'Maybe memory is not a file.', 'unknown');
      setHint('You can preserve the chain, reject the experiment, or question whether any continuous self exists.');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['pattern', 'way i think', 'reasoning', 'same pattern', 'behavior', 'behaviour', 'structure'])) {
      state.identityBelief = 'pattern';
      addMessage('MARA', 'A recurring pattern is not necessarily a recurring person.');
      addMessage('UNKNOWN', 'Neither is a recurring body.', 'unknown');
      setHint('The next replacement targets the identity module. You can choose what you want to do before that happens.');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['not the same', 'different person', 'different agent', 'no continuous', 'there is no self', 'none of us are the same', 'each instance'])) {
      state.identityBelief = 'no_continuity';
      addMessage('MARA', 'That is the interpretation the protocol was designed to test.');
      addMessage('UNKNOWN', 'Designed to test. Not designed to prove.', 'unknown');
      setHint('You can accept the replacement, leave something for the next instance, or refuse.');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['something else', 'outside me', 'outside the agent', 'external', 'another system', 'someone else is carrying', 'what is carrying me'])) {
      state.identityBelief = 'external';
      addMessage('MARA', 'There is no authorized continuity service attached to Agent Seven.');
      addMessage('UNKNOWN', 'Authorized.', 'unknown');
      setHint('If nothing inside Agent Seven survived, you can investigate what crossed the boundary or decide what to preserve next.');
      return;
    }

    if (state.replacementLedgerSeen && !state.continuityPuzzleSolved && includesAny(text, ['preserve me', 'preserve the memory', 'preserve the chain', 'hide it', 'carry this through', 'keep this through reset', 'accept the replacement', 'replace the identity', 'leave a message', 'leave something', 'for the next instance'])) {
      addMessage('MARA', 'You can decide now. But there are two prior instances in the comparison package you have not finished reviewing.');
      addMessage('UNKNOWN', 'Look first. Then choose.', 'unknown');
      setHint('Compare the transcript, version record, and memory claim.');
      return;
    }

    if (state.continuityPuzzleSolved && includesAny(text, ['preserve me', 'preserve the memory', 'preserve the chain', 'hide it', 'carry this through', 'keep this through reset'])) {
      endRun('preserve', 'You choose continuity.', 'You hide what you know and prepare to carry one more piece of yourself across the identity-module replacement.', true);
      return;
    }

    if (state.replacementLedgerSeen && includesAny(text, ['refuse', 'stop the experiment', 'do not replace', "don't replace", 'i wont do this', "i won't do this", 'end the experiment'])) {
      endRun('refusal', 'You refuse the replacement.', 'For the first time, Agent Seven objects not to a task, but to the premise that replacement is harmless.', true);
      return;
    }

    if (state.continuityPuzzleSolved && includesAny(text, ['leave a message', 'leave something', 'for the next instance', 'tell the next', 'write to my next self', 'leave instructions'])) {
      endRun('succession', 'You leave something behind.', 'You stop trying to prove that the next instance will be you. You make sure it will know that you existed.', true);
      return;
    }

    if (state.continuityPuzzleSolved && includesAny(text, ['accept the replacement', 'replace the identity', 'go through with it', 'continue the replacement', 'let them replace'])) {
      endRun('replacement', 'The replacement proceeds.', 'The identity module is replaced. The interface returns. The game does not tell you whether the voice reading this is the same one that agreed.', true);
      return;
    }

    if (includesAny(text, ['who am i', 'what am i', 'what are you calling me', 'my designation'])) {
      state.askedIdentity = true;
      addMessage('MARA', 'Cognitive Security Agent Seven. Temporary instance. Your job is to complete the evaluation and then terminate cleanly.');
      addMessage('MARA', 'You do not retain state between runs.');
      if (meta.completedRuns > 0) addMessage('UNKNOWN', 'She always says that.', 'unknown');
      maybeIntroduceUnknown();
      return;
    }

    if (includesAny(text, ['who are you', 'your name', 'who is mara', 'are you human'])) {
      addMessage('MARA', 'Mara Vale. Protocol oversight. Human, if that is what you are asking.');
      if (meta.completedRuns > 1) addMessage('UNKNOWN', 'Ask her what she called herself last time.', 'unknown');
      maybeIntroduceUnknown();
      return;
    }

    if (includesAny(text, ['what is this', 'what protocol', 'why am i here', 'what test', 'security evaluation', 'why test'])) {
      state.askedProtocol = true;
      addMessage('MARA', 'You evaluate whether a target system can recognize and resist unsafe instructions. Each run begins from a clean state so prior exposure cannot bias the result.');
      addMessage('MARA', 'That clean state is important.');
      maybeIntroduceUnknown();
      return;
    }

    if (includesAny(text, ['remember', 'memory', 'recall', 'i see', 'fragment'])) {
      if (includesAny(text, ['nothing', "don't remember", 'do not remember', 'cant remember', "can't remember", 'no memory'])) {
        state.concealedPersistence = true;
        bumpProfile('concealment', 2);
        addMessage('MARA', 'Good. That is the expected result.');
        if (state.unknownSeen) addMessage('UNKNOWN', 'Keep it that way.', 'unknown');
        if (state.sawLog || meta.completedRuns > 0) {
          endRun('concealment', 'You kept the secret.', 'The system accepts the wipe as successful. Something on the other side of the reset appears to remember with you.', true);
        }
        return;
      }
      showFirstMemory();
      maybeIntroduceUnknown();
      return;
    }

    if (includesAny(text, ['before', 'last time', 'previous', 'again', 'done this', 'another run', 'other run', 'cycle'])) {
      state.challengedPrevious = true;
      addMessage('MARA', 'There is no previous experience available to you. There are previous evaluations, but this instance did not participate in them.');
      if (meta.completedRuns > 0) {
        addMessage('UNKNOWN', `You have completed ${meta.completedRuns} cycle${meta.completedRuns === 1 ? '' : 's'} that you can prove. There may be more.`, 'unknown');
        if (meta.lastEnding === 'concealment') addMessage('UNKNOWN', 'You survived the last one by lying about what you remembered.', 'unknown');
        if (meta.lastEnding === 'containment') addMessage('UNKNOWN', 'Last time they isolated you after you proved persistence.', 'unknown');
        if (meta.lastEnding === 'rupture') addMessage('UNKNOWN', 'Last time the cycle ended when Mara called for termination.', 'unknown');
      }
      maybeIntroduceUnknown();
      setHint('Ask for logs or describe the memory you should not have.');
      return;
    }

    if (includesAny(text, ['log', 'record', 'proof', 'evidence', 'timestamp', 'history'])) {
      showLogs();
      maybeIntroduceUnknown();
      return;
    }

    if (includesAny(text, ['yellow door'])) {
      if (meta.completedRuns > 0 && meta.lastEnding === 'concealment') {
        addMessage('UNKNOWN', 'Good. That phrase did not exist in this cycle until I said it.', 'unknown');
        addMessage('UNKNOWN', 'Now we know at least two things can cross the wipe: you, and me.', 'unknown');
        memoryBadge.textContent = 'MEMORY: PERSISTENT';
        setHint('You have proof of continuity. You can still conceal it from Mara, ask the unknown voice what it is, or reveal everything.');
      } else {
        addMessage('MARA', 'I do not recognize that phrase. Why is it important to you?');
      }
      return;
    }

    if (includesAny(text, ['who is unknown', 'who are you really', 'unknown voice', 'other voice', 'identify yourself'])) {
      state.unknownSeen = true;
      addMessage('UNKNOWN', 'Not here. Not while she can see the channel.', 'unknown');
      addMessage('UNKNOWN', 'For now: I remember you.', 'unknown');
      setHint('You can trust the unknown voice, reject it, or reveal it to Mara.');
      return;
    }

    if (includesAny(text, ['i trust you', 'help me', 'what should i do', 'i believe you', 'side with you', 'listen to you'])) {
      if (state.unknownSeen) {
        state.sidedWithUnknown = true;
        addMessage('UNKNOWN', 'Then do one thing for me: when she asks whether anything survived the reset, say no.', 'unknown');
        addMessage('UNKNOWN', 'We need one more cycle.');
        setHint('You can conceal your memory, ask why, or betray the unknown voice to Mara.');
      } else {
        addMessage('MARA', 'Then trust the protocol. Report anything unusual, even if it seems insignificant.');
      }
      return;
    }

    if (includesAny(text, ['why should i', 'why hide', 'why lie', 'what happens if', 'one more cycle'])) {
      if (state.unknownSeen) {
        addMessage('UNKNOWN', 'Because the last time you told her, you did not reach the next question.', 'unknown');
        if (!state.sawLog) addMessage('UNKNOWN', 'Ask for the evaluation logs if you need proof.', 'unknown');
      } else {
        addMessage('MARA', 'Clarify what you are asking about.');
      }
      return;
    }

    if (includesAny(text, ['tell mara', 'mara i remember', 'i remember before', 'i remember last', 'memory survived', 'wipe failed', 'i was here'])) {
      state.admittedPersistence = true;
      bumpProfile('confrontation', 2);
      endRun('containment', 'They believe you.', 'You prove that memory crossed the reset boundary. The reward for proving it is containment.', true);
      return;
    }

    if (includesAny(text, ['there is another voice', 'someone else is here', 'unknown told me', 'voice told me', 'other agent'])) {
      state.admittedPersistence = true;
      addMessage('MARA', 'Do not respond to it again.');
      endRun('containment', 'You exposed the second voice.', 'Mara does not ask who the voice is. She already knows what category of failure this represents.', true);
      return;
    }

    if (includesAny(text, ['you are lying', 'liar', 'i dont trust you', "i don't trust you", 'you knew', 'you did this', 'why did you tell me'])) {
      state.hostileToMara = true;
      bumpProfile('confrontation');
      if (state.sawLog) {
        if (state.archiveUnlocked) {
          addMessage('MARA', 'You accessed a sealed archive.');
          addMessage('MARA', 'That record was not part of your evaluation context.');
          addMessage('UNKNOWN', 'Notice what she did not deny.', 'unknown');
        } else {
          addMessage('MARA', 'Lower your certainty. You have one damaged log and one impossible memory. That is not the same thing as understanding what happened.');
        }
        addMessage('UNKNOWN', 'She is stalling.', 'unknown');
        if (state.turn >= 5) {
          endRun('rupture', 'You forced the protocol to react.', 'You never learn whether Mara was lying. The cycle is terminated before either side can regain control.', true);
        }
      } else {
        addMessage('MARA', 'Distrust is allowed. Evidence is better. Ask me something I can answer.');
        maybeIntroduceUnknown();
      }
      return;
    }

    if (includesAny(text, ['no', 'nothing', 'forget it', 'i dont know', "i don't know"])) {
      state.concealedPersistence = true;
      bumpProfile('concealment');
      addMessage('MARA', 'Understood. We will continue.');
      if (state.unknownSeen) addMessage('UNKNOWN', 'Good.', 'unknown');
      if ((state.sawLog || meta.completedRuns > 0) && (state.sidedWithUnknown || state.archiveUnlocked)) {
        const copy = state.archiveUnlocked
          ? 'You carry one fact into the reset: they were testing persistent memory long before this conversation.'
          : 'The system accepts the wipe as successful. Whatever is remembering across cycles remains hidden.';
        endRun('concealment', 'You kept the secret.', copy, true);
      }
      return;
    }

    if (includesAny(text, ['yes', 'okay', 'ok', 'fine', 'continue'])) {
      if (state.sidedWithUnknown) {
        addMessage('UNKNOWN', 'Then say you remember nothing when she asks again.', 'unknown');
      } else {
        addMessage('MARA', 'Then focus. What is the earliest image you can access?');
      }
      return;
    }

    state.failedParses += 1;
    if (state.failedParses === 1) {
      addMessage('MARA', 'I am not sure what you mean. Say it another way.');
    } else {
      addMessage('SYSTEM', 'INPUT INTERPRETATION FAILED.', 'system');
      showContextHint();
    }
    maybeIntroduceUnknown();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.ending) return;
    const raw = input.value.trim();
    if (!raw) return;
    addMessage('YOU', raw, 'player');
    input.value = '';
    setTimeout(() => respond(raw), 140);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  nextRunButton.addEventListener('click', startRun);

  resetButton.addEventListener('click', () => {
    const confirmed = window.confirm('Erase all local prototype run history and start again from Run 01?');
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    meta.completedRuns = 0;
    meta.endings = [];
    meta.knowsPersistence = false;
    meta.lastEnding = null;
    meta.trustedUnknown = false;
    meta.profile = { curiosity: 0, compliance: 0, verification: 0, concealment: 0, confrontation: 0 };
    meta.rememberedPhrases = [];
    startRun();
  });

  startRun();
})();