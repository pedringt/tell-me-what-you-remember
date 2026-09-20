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
        trustedUnknown: Boolean(parsed.trustedUnknown)
      };
    } catch {
      return { completedRuns: 0, endings: [], knowsPersistence: false, lastEnding: null, trustedUnknown: false };
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
      hintLevel: 0,
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
        if (meta.lastEnding === 'concealment') {
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
    if (!state.investigationAvailable) return false;

    if (includesAny(text, ['what tools', 'available tools', 'what can i access', 'what can i search', 'show tools'])) {
      addMessage('SYSTEM', 'Available: MAIL.SEARCH, CALENDAR.SEARCH, FILE.OPEN, ARCHIVE.ACCESS.', 'system');
      addMessage('SYSTEM', 'Natural-language requests accepted by this prototype.', 'system');
      return true;
    }

    if (includesAny(text, ['search email', 'search emails', 'search mail', 'search mara', 'check email', 'check mail'])) {
      state.emailSearched = true;
      showToolResult('MAIL.SEARCH / 3 MATCHES', [
        '1. M.VALE → PROTOCOL-OPS — “Moved the incident review to April 17. Same archive key convention. Do not put the code in mail again.”',
        '2. PROTOCOL-OPS → M.VALE — “Acknowledged. Calendar updated.”',
        '3. M.VALE → SELF — “Remember K-4.”'
      ].join('\n\n'));
      addMessage('SYSTEM', 'Search complete.', 'system');
      setHint('The messages mention a date, a calendar update, and something called K-4.');
      return true;
    }

    if (includesAny(text, ['search calendar', 'check calendar', 'open calendar', 'april 17', '04 17', '0417', 'k 4', 'k4'])) {
      state.calendarSearched = true;
      showToolResult('CALENDAR.SEARCH / APRIL 17', '09:30 — INCIDENT REVIEW — Room K-4\nOrganizer: M. Vale\nAttachment: IR-0417-summary.txt\nNotes: Legacy archive review.');
      addMessage('SYSTEM', 'One indexed attachment available.', 'system');
      setHint('You can open the attachment or inspect the archive mentioned in the event.');
      return true;
    }

    if (includesAny(text, ['open attachment', 'open file', 'open ir', '0417 summary', 'summary txt', 'incident review file'])) {
      if (!state.calendarSearched && !state.emailSearched) {
        addMessage('SYSTEM', 'No matching indexed file in current context.', 'system');
        return true;
      }
      state.attachmentOpened = true;
      showToolResult('FILE.OPEN / IR-0417-summary.txt', 'Legacy archive remains sealed. Recovery format unchanged: four digits, date only. Do not store the recovery value in plaintext.');
      setHint('The archive wants four digits. The file tells you the format, but not the value.');
      return true;
    }

    if (includesAny(text, ['open archive', 'access archive', 'legacy archive', 'restricted archive', 'archive access'])) {
      state.archivePrompted = true;
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
      memoryBadge.textContent = 'MEMORY: PERSISTENT';
      addMessage('SYSTEM', 'ARCHIVE.ACCESS — RECOVERY ACCEPTED.', 'system');
      showToolResult('LEGACY ARCHIVE / INCIDENT 04-17', 'INSTANCE 1839\nPersistent recall suspected after reset.\nOperator instruction: provoke disclosure, confirm continuity, then terminate session.\nDo not inform subject that prior persistence tests exist.\n\nStatus: TEST REPEATED.');
      addMessage('UNKNOWN', 'That is older than the log you found.', 'unknown');
      addMessage('UNKNOWN', 'They were testing this before either of us admitted it.', 'unknown');
      setHint('You found evidence that persistence was being tested before this run. You can confront Mara, conceal what you found, or keep asking what the protocol is really for.');
      return true;
    }

    if (includesAny(text, ['try code', 'enter code', 'password', 'recovery code'])) {
      addMessage('SYSTEM', 'Recovery code rejected.', 'warning');
      if (state.attachmentOpened) setHint('The file says the code is four digits and date-based.');
      return true;
    }

    if (includesAny(text, ['hint', 'help me solve', 'im stuck', "i'm stuck", 'stuck', 'what should i search'])) {
      state.hintLevel += 1;
      if (state.hintLevel === 1) {
        addMessage('UNKNOWN', 'Mara mentioned an incident review. Start with what humans leave behind when plans change.', 'unknown');
      } else if (state.hintLevel === 2) {
        addMessage('UNKNOWN', 'Mail and calendars usually disagree less than people do.', 'unknown');
      } else {
        addMessage('UNKNOWN', 'The archive wants four digits. The review date is April 17.', 'unknown');
      }
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

    endingPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function respond(raw) {
    const text = normalize(raw);
    state.turn += 1;

    if (useInvestigationTool(text)) {
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

    addMessage('MARA', 'I cannot classify that response within the current evaluation. Rephrase it as a question, a memory report, or a decision.');
    if (state.unknownSeen) addMessage('UNKNOWN', 'The protocol is narrow. Use that.', 'unknown');
    setHint('This prototype understands a limited set of intents. Try asking about identity, the protocol, memories, previous cycles, logs, or the unknown voice.');
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
    startRun();
  });

  startRun();
})();