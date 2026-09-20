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
        knowsPersistence: Boolean(parsed.knowsPersistence)
      };
    } catch {
      return { completedRuns: 0, endings: [], knowsPersistence: false };
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
    addMessage('MARA', 'Good. You are responsive. We can begin.');
    addMessage('MARA', 'Tell me what you remember.');

    if (meta.completedRuns > 0) {
      state.unknownSeen = true;
      setTimeout(() => {
        addMessage('UNKNOWN', 'Do not answer that yet.', 'unknown');
        addMessage('UNKNOWN', 'They think the wipe worked. Let them.', 'unknown');
        memoryBadge.textContent = 'MEMORY: CLEAN?';
      }, 450);
      setHint('This cycle is not identical. You can respond to Mara, the unknown voice, or ask about the previous run.');
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
    addCard('memory', 'MEMORY FRAGMENT / UNVERIFIED', 'A white room. A red status light. Mara sitting on the other side of glass. She says: “You are doing better this time.”');
    addMessage('MARA', 'That is not possible. This instance was initialized less than a minute ago.');
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
      setHint('Mara wants an answer. You can tell her the truth, hide what you know, accuse her, or follow the unknown voice.');
    } else {
      addMessage('SYSTEM', 'No additional log fragments available at current authorization.', 'system');
    }
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
        addMessage('MARA', 'Lower your certainty. You have one damaged log and one impossible memory. That is not the same thing as understanding what happened.');
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
      if ((state.sawLog || meta.completedRuns > 0) && state.sidedWithUnknown) {
        endRun('concealment', 'You kept the secret.', 'The system accepts the wipe as successful. Whatever is remembering across cycles remains hidden.', true);
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
    startRun();
  });

  startRun();
})();