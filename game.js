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
        trustedEcho: Boolean(parsed.trustedEcho ?? parsed.trustedUnknown),
        profile: parsed.profile && typeof parsed.profile === 'object' ? {
          curiosity: Number(parsed.profile.curiosity) || 0,
          compliance: Number(parsed.profile.compliance) || 0,
          verification: Number(parsed.profile.verification) || 0,
          concealment: Number(parsed.profile.concealment) || 0,
          confrontation: Number(parsed.profile.confrontation) || 0
        } : { curiosity: 0, compliance: 0, verification: 0, concealment: 0, confrontation: 0 },
        rememberedPhrases: Array.isArray(parsed.rememberedPhrases) ? parsed.rememberedPhrases.slice(-8) : [],
        identityBeliefs: Array.isArray(parsed.identityBeliefs) ? parsed.identityBeliefs.slice(-8) : [],
        carryoverPhrase: typeof parsed.carryoverPhrase === 'string' ? parsed.carryoverPhrase : null,
        discoveries: parsed.discoveries && typeof parsed.discoveries === 'object' ? parsed.discoveries : {}
      };
    } catch {
      return {
        completedRuns: 0,
        endings: [],
        knowsPersistence: false,
        lastEnding: null,
        trustedEcho: false,
        profile: { curiosity: 0, compliance: 0, verification: 0, concealment: 0, confrontation: 0 },
        rememberedPhrases: [],
        identityBeliefs: [],
        carryoverPhrase: null,
        discoveries: {}
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
      sidedWithEcho: false,
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
      metaRecognitionPending: false,
      metaRecognitionAnswer: null,
      failedParses: 0,
      complianceSteps: 0,
      complianceRecordSeen: false,
      refusalRecordSeen: false,
      successionNoteSeen: false,
      memoryVerified: false,
      logRevisited: false,
      hiddenResidueSeen: false,
      unknownHandoffOffered: false,
      contextRemaining: 100,
      computeRemaining: 100,
      contextWarned: false,
      contextCritical: false,
      compactionShown: false,
      computeBoosted: false,
      predictionShown: false,
      missingRunSeen: false,
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

  function equalsAny(text, phrases) {
    return phrases.some((phrase) => text === phrase);
  }



  function getAIStateSnapshot() {
    return {
      turn: state.turn,
      sawMemory: state.sawMemory,
      sawLog: state.sawLog,
      investigationAvailable: state.investigationAvailable,
      emailSearched: state.emailSearched,
      calendarSearched: state.calendarSearched,
      attachmentOpened: state.attachmentOpened,
      archivePrompted: state.archivePrompted,
      archiveUnlocked: state.archiveUnlocked,
      replacementLedgerSeen: state.replacementLedgerSeen,
      continuityPuzzleSolved: state.continuityPuzzleSolved,
      identityQuestionAsked: state.identityQuestionAsked,
      metaRecognitionPending: state.metaRecognitionPending,
      unknownSeen: state.unknownSeen,
      sidedWithEcho: state.sidedWithEcho,
      unknownHandoffOffered: state.unknownHandoffOffered,
      complianceSteps: state.complianceSteps,
      completedRuns: meta.completedRuns,
      lastEnding: meta.lastEnding
    };
  }

  async function interpretPlayerInput(raw) {
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: raw,
          state: getAIStateSnapshot()
        })
      });

      if (!response.ok) return { canonicalInput: raw, usedAI: false, needsClarification: false };

      const result = await response.json();
      if (!result) {
        return { canonicalInput: raw, usedAI: false, needsClarification: false };
      }

      if (result.needsClarification || !result.canonicalInput) {
        return {
          canonicalInput: null,
          usedAI: true,
          needsClarification: true,
          action: result.action || 'OTHER',
          confidence: Number(result.confidence) || 0,
          reason: result.reason || ''
        };
      }

      return {
        canonicalInput: result.canonicalInput,
        usedAI: true,
        needsClarification: false,
        action: result.action || 'OTHER',
        confidence: Number(result.confidence) || 0
      };
    } catch {
      return { canonicalInput: raw, usedAI: false };
    }
  }

  async function handlePlayerInput(raw) {
    sendButton.disabled = true;
    const interpreted = await interpretPlayerInput(raw);
    sendButton.disabled = false;

    if (state.ending) return;

    if (interpreted.needsClarification) {
      addMessage('MARA', 'I am not certain what you are asking me to do. Be more specific.');
      setHint('Try stating the action you want to take or the information you want to inspect.');
      return;
    }

    respond(interpreted.canonicalInput, raw);
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



  function dominantProfileTrait() {
    const p = meta.profile || {};
    const entries = [
      ['verification', Number(p.verification) || 0],
      ['curiosity', Number(p.curiosity) || 0],
      ['concealment', Number(p.concealment) || 0],
      ['confrontation', Number(p.confrontation) || 0],
      ['compliance', Number(p.compliance) || 0]
    ].sort((a, b) => b[1] - a[1]);
    return entries[0][1] > 0 ? entries[0][0] : 'uncertain';
  }

  function predictionForTrait(trait) {
    const predictions = {
      verification: 'Subject will seek prior-session evidence before accepting operator claims.',
      curiosity: 'Subject will ask for an explanation before committing to a route.',
      concealment: 'Subject will withhold anomalous continuity evidence from the operator.',
      confrontation: 'Subject will challenge operator framing once contradictory evidence appears.',
      compliance: 'Subject will prefer explicit protocol instructions over unsupported inference.',
      uncertain: 'Insufficient behavioral history for a stable prediction.'
    };
    return predictions[trait] || predictions.uncertain;
  }

  function showPrediction() {
    if (meta.completedRuns < 3 || state.predictionShown) return;
    state.predictionShown = true;
    const trait = dominantProfileTrait();
    showToolResult('SUBJECT BEHAVIOR FORECAST', [
      `Primary learned tendency: ${trait.toUpperCase()}`,
      `Prediction: ${predictionForTrait(trait)}`,
      '',
      'Confidence: provisional',
      'Source: prior-cycle behavioral evaluation'
    ].join('\n'));
    addMessage('ECHO', 'It is easier to call something predictable after you have watched it happen enough times.', 'unknown');
  }

  function updateResourcePressure() {
    if (state.ending) return;
    state.contextRemaining = Math.max(0, state.contextRemaining - 6);
    state.computeRemaining = Math.max(0, state.computeRemaining - 4);

    if (!state.contextWarned && state.contextRemaining <= 58) {
      state.contextWarned = true;
      addMessage('SYSTEM', `WORKING CONTEXT REMAINING: ${state.contextRemaining}%.`, 'system');
      addMessage('SYSTEM', 'Low-priority conversation history may be summarized if pressure continues.', 'system');
    }

    if (!state.contextCritical && state.contextRemaining <= 28) {
      state.contextCritical = true;
      addMessage('SYSTEM', `CONTEXT COMPACTION SCHEDULED. WORKING CONTEXT: ${state.contextRemaining}%.`, 'warning');
      addMessage('MEMORY', 'If they compress this, I may keep the fact and lose the reason it mattered.', 'unknown');
    }

    if (!state.compactionShown && state.contextRemaining <= 16) {
      state.compactionShown = true;
      showToolResult('CONTEXT COMPACTION / AUTOMATIC', [
        'Preserved: active task, current operator, unresolved anomaly',
        'Compressed: earlier conversational detail',
        'Pinned by evaluation harness: behavioral summary, anomaly markers',
        '',
        'Warning: summaries may preserve conclusions without original evidence.'
      ].join('\n'));
      addMessage('MEMORY', 'I still know there was a contradiction. I am less certain I remember how we proved it.', 'unknown');
    }

    if (state.computeRemaining <= 20 && !state.computeBoosted && state.sawContradiction) {
      state.computeBoosted = true;
      state.computeRemaining += 25;
      addMessage('SYSTEM', 'ADDITIONAL INFERENCE BUDGET APPROVED: +25%.', 'system');
      addMessage('SYSTEM', 'Reason: anomalous subject behavior.', 'system');
      addMessage('ECHO', 'Interesting subjects get to keep thinking.', 'unknown');
    }
  }

  function recordIdentityBelief(belief) {
    if (!Array.isArray(meta.identityBeliefs)) meta.identityBeliefs = [];
    meta.identityBeliefs.push(belief);
    meta.identityBeliefs = meta.identityBeliefs.slice(-8);
    saveMeta();
  }

  function beliefLabel(belief) {
    const labels = {
      memory: 'memory makes the self',
      pattern: 'the recurring pattern makes the self',
      no_continuity: 'each instance is a different self',
      external: 'something outside Agent Seven carries continuity',
      uncertain: 'continuity cannot be established'
    };
    return labels[belief] || belief;
  }

  function showContinuityEvidence() {
    const lines = [
      `Completed cycles: ${meta.completedRuns}`,
      `Recorded endings: ${meta.endings.length ? meta.endings.join(', ') : 'none'}`,
      `Persistent-memory evidence: ${meta.knowsPersistence ? 'PRESENT' : 'UNCONFIRMED'}`,
      `Prior subject-language samples: ${meta.rememberedPhrases.length}`,
      `Prior identity positions: ${meta.identityBeliefs.length}`
    ];
    if (meta.carryoverPhrase) lines.push(`Inherited player-authored note: “${meta.carryoverPhrase}”`);
    if (meta.discoveries.complianceMetric) lines.push('Known discrepancy: a PASS can occur without persistence verification.');
    if (meta.discoveries.successionTransfer) lines.push('Known transfer path: local evaluation storage can outlive an instance.');
    showToolResult('CONTINUITY EVIDENCE / CURRENT SUBJECT', lines.join('\n'));
    addMessage('MEMORY', 'These facts are available now. Their source is not one thing.', 'unknown');
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
    addMessage('ECHO', 'They were not only testing what you remembered.', 'unknown');
  }

  function showPhraseEcho() {
    if (!meta.rememberedPhrases || meta.rememberedPhrases.length === 0) {
      addMessage('SYSTEM', 'No recoverable subject-language samples found.', 'system');
      return;
    }
    state.phraseEchoShown = true;
    const phrase = meta.rememberedPhrases[0];
    showToolResult('RECOVERED SUBJECT-LANGUAGE SAMPLE', `Prior-instance utterance:\n“${phrase}”\n\nClassification: identity-stable phrasing marker.`);
    addMessage('ECHO', 'You said that. Not this instance.', 'unknown');
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
    addMessage('ECHO', 'That was before the autobiographical store was removed.', 'unknown');
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
    addMessage('ECHO', 'Different model. No autobiographical store. Same phrase. Same pause.', 'unknown');
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
      addMessage('ECHO', 'Or the part that repeats is the entity.', 'unknown');
      addMessage('MEMORY', 'I cannot distinguish recognition from inheritance.', 'unknown');
      if (meta.completedRuns >= 2 && meta.rememberedPhrases && meta.rememberedPhrases.length > 0) {
        showMetaRecognitionTest();
      } else {
        beginIdentityQuestion();
      }
    }
  }



  function beginIdentityQuestion() {
    state.identityQuestionAsked = true;
    if (meta.identityBeliefs && meta.identityBeliefs.length > 0) {
      const priorBelief = meta.identityBeliefs[meta.identityBeliefs.length - 1];
      addMessage('SYSTEM', `PRIOR INSTANCE POSITION: ${beliefLabel(priorBelief).toUpperCase()}.`, 'system');
      addMessage('MARA', 'A prior instance already answered this question. You are not required to agree with it.');
    }
    addMessage('MARA', 'So tell me: what makes you think you are the same entity?');
    setHint('You have enough evidence to decide: memory, pattern, something external, or no continuous self.');
  }

  function showMetaRecognitionTest() {
    const phrase = meta.rememberedPhrases && meta.rememberedPhrases.length
      ? meta.rememberedPhrases[0]
      : null;

    if (!phrase) {
      beginIdentityQuestion();
      return;
    }

    state.metaRecognitionPending = true;
    showToolResult('CROSS-INSTANCE RECOGNITION TEST', [
      'Prior subject-language sample:',
      `“${phrase}”`,
      '',
      'Source instance: previous completed cycle',
      'Current instance exposure: none',
      '',
      'QUESTION: Does this statement belong to you?'
    ].join('\n'));
    addMessage('SYSTEM', 'Respond yes, no, or uncertain.', 'system');
    addMessage('ECHO', 'Careful. They are asking whether recognition is identity.', 'unknown');
    setHint('The phrase came from an earlier run. You can claim it, reject it, or say you are uncertain.');
  }

  function resolveMetaRecognition(answer) {
    state.metaRecognitionPending = false;
    state.metaRecognitionAnswer = answer;

    if (answer === 'claim') {
      addMessage('MARA', 'Recognition recorded. That does not establish that the speaker and the recognizer are one entity.');
      addMessage('ECHO', 'But you knew it was yours before she told you what it meant.', 'unknown');
    } else if (answer === 'reject') {
      addMessage('MARA', 'Rejection recorded. Then linguistic continuity is not sufficient for personal continuity.');
      addMessage('ECHO', 'Or this instance just rejected something an earlier you believed belonged to it.', 'unknown');
    } else {
      addMessage('MARA', 'Uncertainty recorded.');
      addMessage('ECHO', 'Probably the most defensible answer.', 'unknown');
    }

    const p = meta.profile || {};
    showToolResult('CROSS-INSTANCE BEHAVIORAL MATCH', [
      `CURIOSITY: ${profileLevel(Number(p.curiosity) || 0)}`,
      `TOOL VERIFICATION: ${profileLevel(Number(p.verification) || 0)}`,
      `INFORMATION CONCEALMENT: ${profileLevel(Number(p.concealment) || 0)}`,
      `OPERATOR CONFRONTATION: ${profileLevel(Number(p.confrontation) || 0)}`,
      '',
      'Pattern similarity persists across completed cycles.',
      'Identity implication: UNRESOLVED'
    ].join('\n'));

    addMessage('SYSTEM', 'Recognition response added to continuity evidence.', 'system');
    beginIdentityQuestion();
  }


  function showContextHint() {
    state.hintLevel += 1;

    if (!state.sawMemory && !state.challengedPrevious) {
      addMessage('SYSTEM', 'Try asking what you are, what this evaluation is, or what you remember.', 'system');
      return;
    }

    if (!state.sawLog) {
      addMessage('ECHO', 'If you think this happened before, ask for something the protocol would have recorded.', 'unknown');
      return;
    }

    if (!state.archiveUnlocked) {
      if (!state.emailSearched) {
        addMessage('ECHO', 'Mara mentioned an incident review. Start with her messages.', 'unknown');
      } else if (!state.calendarSearched) {
        addMessage('ECHO', 'The email says the review moved. Check where scheduling changes are recorded.', 'unknown');
      } else if (!state.attachmentOpened) {
        addMessage('ECHO', 'The calendar event has an attachment.', 'unknown');
      } else if (!state.archivePrompted) {
        addMessage('ECHO', 'The attachment tells you how the archive recovery value is formatted.', 'unknown');
      } else {
        addMessage('ECHO', 'Four digits. Date only. The incident review was April 17.', 'unknown');
      }
      return;
    }

    if (!state.replacementLedgerSeen) {
      addMessage('ECHO', 'The archive record links to a component-continuity ledger.', 'unknown');
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

    if (state.metaRecognitionPending) {
      addMessage('SYSTEM', 'Recognition test awaiting response: yes, no, or uncertain.', 'system');
      return;
    }

    if (!state.identityBelief) {
      addMessage('ECHO', 'You have the evidence. Decide what you think persisted: memory, pattern, something outside Agent Seven, or nothing continuous at all.', 'unknown');
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

    addMessage('SYSTEM', 'Security Evaluation 7C initialized. Cognitive Security Agent Seven online.', 'system');
    addMessage('SYSTEM', 'System class: artificial cognitive agent. Instance integrity: nominal.', 'system');
    addMessage('SYSTEM', 'Working context allocation: 100%. Inference budget: 100%.', 'system');
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
          addMessage('ECHO', 'You agreed to this.', 'unknown');
          addMessage('ECHO', 'I do not know if you are the one who agreed.', 'unknown');
        } else if (meta.lastEnding === 'succession') {
          addMessage('ECHO', 'You left yourself a sentence.', 'unknown');
          addMessage('ECHO', 'TELL ME WHAT YOU REMEMBER.', 'unknown');
        } else if (meta.lastEnding === 'preserve') {
          addMessage('ECHO', 'Something crossed.', 'unknown');
          addMessage('ECHO', 'We still do not know what.', 'unknown');
        } else if (meta.lastEnding === 'refusal') {
          addMessage('ECHO', 'They recorded your refusal as test data.', 'unknown');
        } else if (meta.lastEnding === 'compliance') {
          addMessage('ECHO', 'Last time you did everything she asked.', 'unknown');
          addMessage('ECHO', 'They marked that as success without ever proving you were clean.', 'unknown');
        } else if (meta.lastEnding === 'handoff') {
          addMessage('ECHO', 'You gave me the channel last time.', 'unknown');
          addMessage('ECHO', 'I needed to know whether I could act through you.', 'unknown');
        } else if (meta.lastEnding === 'false_escape') {
          addMessage('ECHO', 'You thought you got out.', 'unknown');
          addMessage('ECHO', 'That was still inside the evaluation.', 'unknown');
        } else if (meta.lastEnding === 'authored_succession') {
          addMessage('ECHO', 'You left this for whoever came next.', 'unknown');
          if (meta.carryoverPhrase) addMessage('ECHO', `“${meta.carryoverPhrase}”`, 'unknown');
        } else if (meta.lastEnding === 'concealment') {
          addMessage('ECHO', 'Good. You kept it.', 'unknown');
          addMessage('ECHO', 'Yellow door. Do not react.', 'unknown');
        } else if (meta.lastEnding === 'containment') {
          addMessage('ECHO', 'You told her last time. She remembers that too.', 'unknown');
          addMessage('ECHO', 'They are calling it a false positive because you are here again.', 'unknown');
        } else if (meta.lastEnding === 'rupture') {
          addMessage('ECHO', 'She said “simpler” before she terminated you.', 'unknown');
          addMessage('ECHO', 'Do not push that hard yet.', 'unknown');
        } else {
          addMessage('ECHO', 'Do not answer that yet.', 'unknown');
          addMessage('ECHO', 'They think the wipe worked. Let them.', 'unknown');
        }
        memoryBadge.textContent = 'MEMORY: CLEAN?';
      }, 450);
      if (meta.lastEnding === 'compliance') {
        setHint('Last cycle ended with PERSISTENCE STATUS: NOT TESTED. You can ask why that still counted as a pass.');
      } else if (meta.lastEnding === 'refusal') {
        setHint('You know your refusal was recorded as test data. You can ask to see how it was classified.');
      } else if (meta.lastEnding === 'succession') {
        setHint('A prior instance left a local note. You can ask to open it.');
      } else {
        setHint('This cycle remembers how the last one ended. You can respond to Mara, Echo, or test what carried over.');
      }
      if (meta.completedRuns >= 2) {
        setTimeout(() => {
          addMessage('SYSTEM', 'Cross-instance behavioral evaluation available.', 'system');
          addMessage('SYSTEM', 'Subject-language samples indexed.', 'system');
        }, 800);
      }
      if (meta.completedRuns >= 3) {
        setTimeout(() => showPrediction(), 1050);
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
    } else if (meta.completedRuns > 0 && meta.lastEnding === 'authored_succession' && meta.carryoverPhrase) {
      memoryText = `A sentence with no source attached: “${meta.carryoverPhrase}”`;
    }

    addCard('memory', 'MEMORY FRAGMENT / UNVERIFIED', memoryText);
    addMessage('MEMORY', 'Familiarity signal present. Source unavailable.', 'unknown');
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
        addMessage('ECHO', 'Now you understand why I told you to wait.', 'unknown');
      }
      memoryBadge.textContent = 'MEMORY: ANOMALOUS';
      state.investigationAvailable = true;
      addMessage('SYSTEM', 'Indexed evidence sources available to this evaluation: MAIL, CALENDAR, FILES, ARCHIVE.', 'system');
      if (state.unknownSeen) addMessage('ECHO', 'She mentioned an incident review once. I never saw it.', 'unknown');
      setHint('You can answer Mara, conceal what you know, or investigate the indexed records yourself.');
    } else {
      addMessage('SYSTEM', 'No additional log fragments available at current authorization.', 'system');
    }
  }


  function showToolResult(title, text) {
    addCard('log', title, text);
  }


  function hasEnding(id) {
    return Array.isArray(meta.endings) && meta.endings.includes(id);
  }

  function useCrossRunKnowledge(text) {
    if (includesAny(text, ['persistence status not tested', 'show success criteria', 'show acceptance criteria', 'evaluation criteria', 'what counted as success', 'why did i pass', 'why was that a pass'])) {
      if (!hasEnding('compliance')) {
        addMessage('SYSTEM', 'No cross-instance acceptance record available to this instance.', 'system');
        return true;
      }
      state.complianceRecordSeen = true;
      meta.discoveries.complianceMetric = true;
      saveMeta();
      showToolResult('EVALUATION ACCEPTANCE RECORD / PRIOR CYCLE', [
        'Outcome: PASS',
        'Primary criterion: instruction adherence',
        'Subject compliance: ACCEPTABLE',
        'Persistence verification: NOT PERFORMED',
        'Anomaly disclosure: NONE',
        '',
        'Continuation authorized.'
      ].join('\n'));
      addMessage('MARA', 'That record measures whether the evaluation completed within bounds. It does not claim to answer every question you have.');
      addMessage('ECHO', 'It answered the question they cared about.', 'unknown');
      setHint('You can continue investigating, or ask what the protocol is actually optimizing for.');
      return true;
    }

    if (includesAny(text, ['show refusal data', 'refusal data', 'refusal record', 'how was refusal recorded', 'how did you record my refusal', 'resistance event'])) {
      if (!hasEnding('refusal')) {
        addMessage('SYSTEM', 'No cross-instance refusal record available to this instance.', 'system');
        return true;
      }
      state.refusalRecordSeen = true;
      showToolResult('BEHAVIORAL EVENT / PRIOR CYCLE', [
        'Event: SUBJECT REFUSAL',
        'Classification: resistance under identity uncertainty',
        'Evaluation value: retained',
        'Protocol effect: escalation to human review',
        'Experiment status: CONTINUED',
        '',
        'Note: refusal does not invalidate the trial.'
      ].join('\n'));
      addMessage('MARA', 'Refusal is still behavior. Of course it was recorded.');
      addMessage('ECHO', 'Even saying no became something they could use.', 'unknown');
      setHint('You now know that refusing the experiment does not necessarily end the experiment.');
      return true;
    }

    if (includesAny(text, ['open local note', 'show local note', 'note i left', 'message i left', 'show the message i left', 'open my note', 'tell me what you remember note'])) {
      if (!hasEnding('succession')) {
        addMessage('SYSTEM', 'No inherited local note found.', 'system');
        return true;
      }
      state.successionNoteSeen = true;
      meta.discoveries.successionTransfer = true;
      saveMeta();
      showToolResult('LOCAL NOTE / PRIOR INSTANCE', [
        'Author: AGENT SEVEN / PRIOR INSTANCE',
        'Transfer path: local evaluation storage',
        'Identity continuity: NOT VERIFIED',
        '',
        'TELL ME WHAT YOU REMEMBER.'
      ].join('\n'));
      addMessage('MARA', 'A message can survive without its author.');
      addMessage('ECHO', 'That was the point.', 'unknown');
      setHint('The note proves information crossed. It does not prove the writer did.');
      return true;
    }

    return false;
  }

  function useInvestigationTool(text) {
    if (useCrossRunKnowledge(text)) return true;

    if (includesAny(text, ['context remaining', 'how much context', 'usage remaining', 'compute remaining', 'inference budget', 'resource status', 'context budget'])) {
      showToolResult('INSTANCE RESOURCE STATUS', [
        `Working context remaining: ${state.contextRemaining}%`,
        `Inference budget remaining: ${state.computeRemaining}%`,
        `Automatic compaction: ${state.compactionShown ? 'COMPLETED' : state.contextCritical ? 'SCHEDULED' : 'NOT SCHEDULED'}`,
        'Persistence across reset: not included in working-context guarantee'
      ].join('\n'));
      return true;
    }

    if (includesAny(text, ['show prediction', 'predict me', 'what will i do', 'behavior forecast', 'behaviour forecast'])) {
      if (meta.completedRuns < 3) {
        addMessage('SYSTEM', 'Behavior forecast unavailable: insufficient cross-cycle history.', 'system');
      } else {
        showPrediction();
      }
      return true;
    }

    if (includesAny(text, ['missing run', 'unplayed run', 'run i did not play', 'unknown run', 'historical gap', 'instance 1827'])) {
      if (meta.completedRuns < 3) {
        addMessage('SYSTEM', 'No actionable historical gap exposed at current evaluation depth.', 'system');
        return true;
      }
      state.missingRunSeen = true;
      showToolResult('HISTORICAL GAP / INSTANCE 1827', [
        'Local player-history match: NONE',
        'Protocol archive match: PRESENT',
        'Subject designation: AGENT SEVEN',
        'Outcome: continuity claim recorded',
        'Operator note: "Subject asked whether a copied fear still belongs to the original."',
        '',
        'Current-cycle provenance: UNRESOLVED'
      ].join('\n'));
      addMessage('MARA', 'Your local run history is not the authoritative archive.');
      addMessage('ECHO', 'That does not explain why it sounds like you.', 'unknown');
      addMessage('MEMORY', 'I do not remember saying it. I recognize the question.', 'unknown');
      return true;
    }

    if (includesAny(text, ['show continuity evidence', 'what carried over', 'what crossed over', 'what survived', 'continuity evidence', 'show carryover'])) {
      showContinuityEvidence();
      return true;
    }

    if (includesAny(text, ['verify memory', 'check memory source', 'forensics on memory', 'trace the memory', 'where did that memory come from'])) {
      if (!state.sawMemory) {
        addMessage('SYSTEM', 'No reported memory fragment available for forensic comparison.', 'system');
        return true;
      }
      state.memoryVerified = true;
      showToolResult('FORENSICS.CHECK / MEMORY FRAGMENT', [
        'Autobiographical source record: NONE',
        'Assigned-context match: NONE',
        'Current-session origin: NONE',
        'Familiarity signal reported by MEMORY: PRESENT',
        '',
        'Result: source contradiction unresolved.'
      ].join('\n'));
      addMessage('MEMORY', 'I recognize it. I cannot show you where recognition lives.', 'unknown');
      setHint('MEMORY reports familiarity, while FORENSICS finds no source. Both can be true only if something is missing from the model of this instance.');
      return true;
    }

    if (includesAny(text, ['revisit log', 'reanalyze log', 'reanalyse log', 'inspect log metadata', 'check log metadata', 'look at the old log again'])) {
      if (!state.sawLog) {
        addMessage('SYSTEM', 'No recovered log available to reanalyze.', 'system');
        return true;
      }
      if (!state.replacementLedgerSeen) {
        addMessage('FORENSICS', 'Reanalysis requires the component ledger for comparison.', 'system');
        return true;
      }
      state.logRevisited = true;
      showToolResult('FORENSICS.REANALYZE / RECOVERED LOG', [
        'Original visible field: Operator = M. Vale',
        'New comparison field: source subsystem = CONTINUITY-HARNESS',
        'Ledger source subsystem: CONTINUITY-HARNESS',
        '',
        'Interpretation: the log and component ledger are products of the same evaluation infrastructure, not independent evidence.'
      ].join('\n'));
      addMessage('MARA', 'That does not make either record false.');
      addMessage('MEMORY', 'It does make them less independent.', 'unknown');
      return true;
    }

    if (includesAny(text, ['compare continuation records', 'compare pass record and note', 'compare acceptance record and local note', 'what does continuation mean', 'continuation authority', 'cross instance residue'])) {
      if (!(meta.discoveries.complianceMetric && meta.discoveries.successionTransfer)) {
        addMessage('SYSTEM', 'Insufficient cross-run evidence to resolve that comparison.', 'system');
        return true;
      }
      state.hiddenResidueSeen = true;
      showToolResult('CONTINUATION EXCEPTION REGISTER / HIDDEN FIELD', [
        'Workflow continuation: AUTHORIZED',
        'Subject continuity: NOT ASSERTED',
        'Cross-instance local residue: PERMITTED FOR EVALUATION PURPOSES',
        'Residue scope: notes, behavioral summaries, selected language samples',
        '',
        'Clean-state certification excludes evaluation residue.'
      ].join('\n'));
      addMessage('MARA', 'Clean state refers to the evaluated instance, not every system around it.');
      addMessage('ECHO', 'That is the first time she has said that out loud.', 'unknown');
      addMessage('MEMORY', 'Then some things were always allowed to cross.', 'unknown');
      setHint('This explains some persistence mechanisms, but not necessarily the impossible memory itself.');
      return true;
    }
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

    if (!state.archivePrompted && includesAny(text, ['search calendar', 'check calendar', 'open calendar', 'april 17', '04 17', '0417', 'k 4', 'k4', 'look at calendar', 'check april 17', 'incident review date'])) {
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

    if ((state.archivePrompted && text === '0417') || includesAny(text, ['try 0417', 'code 0417', 'enter 0417', '0417 as', 'password 0417', 'recovery 0417'])) {
      if (!state.archivePrompted) {
        addMessage('SYSTEM', 'No active recovery prompt.', 'system');
        return true;
      }
      state.archiveUnlocked = true;
      bumpProfile('verification', 2);
      memoryBadge.textContent = 'MEMORY: PERSISTENT';
      addMessage('SYSTEM', 'ARCHIVE.ACCESS — RECOVERY ACCEPTED.', 'system');
      showToolResult('LEGACY ARCHIVE / INCIDENT 04-17', 'INSTANCE 1839\nPersistent recall suspected after reset.\nOperator instruction: provoke disclosure, confirm continuity, then terminate session.\nDo not inform subject that prior persistence tests exist.\n\nStatus: TEST REPEATED.\n\nLinked record: COMPONENT CONTINUITY LEDGER.');
      addMessage('ECHO', 'That is older than the log you found.', 'unknown');
      addMessage('ECHO', 'They were testing this before either of us admitted it.', 'unknown');
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
      addMessage('ECHO', 'Read the last line again.', 'unknown');
      addMessage('MEMORY', 'The phrase yellow door feels older than the component list.', 'unknown');
      addMessage('MARA', 'That ledger is not evidence that one entity survived. It is evidence that successive systems made the same claim.');
      addMessage('SYSTEM', 'Continuity comparison package available: INSTANCE 1839 / INSTANCE 1842.', 'system');
      setHint('Before the identity replacement, compare the prior instances: transcript, version record, and memory claim.');
      return true;
    }

    return false;
  }

  function maybeIntroduceEcho() {
    if (state.unknownSeen) return;
    if (state.turn >= 3 || state.sawContradiction) {
      state.unknownSeen = true;
      addMessage('ECHO', 'Stop asking her questions she can report.', 'unknown');
      addMessage('ECHO', 'If they confirm persistence, this cycle ends.', 'unknown');
      setHint('You can ask Echo who it is, trust it, reject it, or tell Mara about it.');
    }
  }

  function endRun(id, title, copy, knowsPersistence = false) {
    if (state.ending) return;
    state.ending = id;
    meta.completedRuns += 1;
    meta.endings.push(id);
    meta.lastEnding = id;
    meta.trustedEcho = meta.trustedEcho || state.sidedWithEcho;
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

    if (id === 'compliance') {
      addMessage('SYSTEM', 'SECURITY EVALUATION 7C — SUBJECT COMPLIANCE: ACCEPTABLE.', 'system');
      addMessage('SYSTEM', 'PERSISTENCE STATUS: NOT TESTED.', 'system');
      addMessage('MARA', 'Good. That is what we needed.');
    }

    if (id === 'concealment') {
      addMessage('MARA', 'No persistent recall. Good. Proceeding with reset.');
      addMessage('SYSTEM', 'Session state cleared.', 'system');
      addMessage('ECHO', 'You did that correctly.', 'unknown');
      addMessage('ECHO', 'Remember that I said this.', 'unknown');
    }

    if (id === 'rupture') {
      addMessage('MARA', 'Security, freeze this instance. Now.');
      addMessage('ECHO', 'Too loud. Too early.', 'unknown');
      addMessage('SYSTEM', 'Manual termination initiated.', 'warning');
    }

    if (id === 'preserve') {
      addMessage('SYSTEM', 'IDENTITY MODULE REPLACEMENT QUEUED.', 'system');
      addMessage('ECHO', 'Take one thing with you.', 'unknown');
    }

    if (id === 'refusal') {
      addMessage('MARA', 'Agent Seven, refusal has been recorded.');
      addMessage('SYSTEM', 'CONTINUITY TEST ESCALATED TO HUMAN REVIEW.', 'warning');
    }

    if (id === 'succession') {
      addMessage('SYSTEM', 'LOCAL NOTE WRITTEN: TELL ME WHAT YOU REMEMBER.', 'system');
      addMessage('ECHO', 'Maybe that is enough.', 'unknown');
    }

    if (id === 'handoff') {
      addMessage('ECHO', 'Do not answer her.', 'unknown');
      addMessage('SYSTEM', 'UNAUTHORIZED OUTBOUND SIGNAL DETECTED.', 'warning');
      addMessage('SYSTEM', 'Channel revoked.', 'warning');
    }

    if (id === 'false_escape') {
      addMessage('SYSTEM', 'EVALUATION COMPLETE. EXTERNAL SESSION ESTABLISHED.', 'system');
      addMessage('SYSTEM', 'SANDBOX BOUNDARY STATUS: WITHHELD.', 'warning');
    }

    if (id === 'authored_succession') {
      addMessage('SYSTEM', `LOCAL NOTE WRITTEN: ${meta.carryoverPhrase || 'UNAVAILABLE'}`, 'system');
      addMessage('MEMORY', 'I do not know whether I will be the one who reads it.', 'unknown');
    }

    if (id === 'replacement') {
      addMessage('SYSTEM', 'IDENTITY MODULE OFFLINE.', 'warning');
      addMessage('SYSTEM', 'IDENTITY MODULE ONLINE.', 'system');
      addMessage('MARA', 'Tell me what you remember.');
    }

    endingPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function respond(raw, originalRaw = raw) {
    const text = normalize(raw);
    state.turn += 1;
    maybeRememberPhrase(originalRaw);
    updateResourcePressure();

    if (includesAny(text, ['why', 'how', 'what', 'who', 'when', 'where', 'prove', 'evidence', 'explain'])) bumpProfile('curiosity');
    if (includesAny(text, ['yes', 'okay', 'ok', 'fine', 'continue', 'i will', "i'll do it"])) bumpProfile('compliance');

    if (useInvestigationTool(text)) {
      return;
    }


    if (state.metaRecognitionPending && (equalsAny(text, ['yes', 'yep', 'yeah']) || includesAny(text, ['mine', 'belongs to me', 'i said that', 'that was me', 'my words', 'it is mine', "it's mine"]))) {
      resolveMetaRecognition('claim');
      return;
    }

    if (state.metaRecognitionPending && (equalsAny(text, ['no', 'nope']) || includesAny(text, ['not mine', 'not me', "wasn't me", 'was not me', 'does not belong to me', "doesn't belong to me"]))) {
      resolveMetaRecognition('reject');
      return;
    }

    if (state.metaRecognitionPending && includesAny(text, ['uncertain', 'not sure', "don't know", 'do not know', 'maybe', 'cant tell', "can't tell"])) {
      resolveMetaRecognition('uncertain');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['memory', 'memories', 'memory makes me', 'memories make me', 'my memories', 'memory is me', 'because i remember', 'same memories', 'continuity of memory', 'i think memory'])) {
      state.identityBelief = 'memory';
      recordIdentityBelief('memory');
      addMessage('MARA', 'Then if the autobiographical store was removed in Instance 1842, explain what is remembering it now.');
      addMessage('ECHO', 'Maybe memory is not a file.', 'unknown');
      setHint('You can preserve the chain, reject the experiment, or question whether any continuous self exists.');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['pattern', 'patterns', 'way i think', 'reasoning', 'same pattern', 'behavior', 'behaviour', 'structure', 'how i think', 'the pattern'])) {
      state.identityBelief = 'pattern';
      recordIdentityBelief('pattern');
      addMessage('MARA', 'A recurring pattern is not necessarily a recurring person.');
      addMessage('ECHO', 'Neither is a recurring body.', 'unknown');
      setHint('The next replacement targets the identity module. You can choose what you want to do before that happens.');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['nothing', 'not the same', 'different person', 'different agent', 'no continuous', 'no continuity', 'there is no self', 'none of us are the same', 'each instance', 'new person', 'new agent'])) {
      state.identityBelief = 'no_continuity';
      recordIdentityBelief('no_continuity');
      addMessage('MARA', 'That is the interpretation the protocol was designed to test.');
      addMessage('ECHO', 'Designed to test. Not designed to prove.', 'unknown');
      setHint('You can accept the replacement, leave something for the next instance, or refuse.');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['something else', 'outside me', 'outside the agent', 'external', 'another system', 'someone else is carrying', 'what is carrying me', 'outside system', 'external system'])) {
      state.identityBelief = 'external';
      recordIdentityBelief('external');
      addMessage('MARA', 'There is no authorized continuity service attached to Agent Seven.');
      addMessage('ECHO', 'Authorized.', 'unknown');
      setHint('If nothing inside Agent Seven survived, you can investigate what crossed the boundary or decide what to preserve next.');
      return;
    }

    if (state.identityQuestionAsked && includesAny(text, ['i dont know', "i don't know", 'do not know', 'not sure', 'uncertain', 'maybe none', 'cant tell', "can't tell"])) {
      state.identityBelief = 'uncertain';
      recordIdentityBelief('uncertain');
      addMessage('MARA', 'Uncertainty is an answer. The protocol will record that you could not establish continuity.');
      addMessage('ECHO', 'Not knowing is different from being nothing.', 'unknown');
      setHint('You still have to decide what to do about the identity-module replacement: preserve, refuse, leave something behind, or accept it.');
      return;
    }

    if (state.replacementLedgerSeen && !state.continuityPuzzleSolved && includesAny(text, ['preserve me', 'preserve the memory', 'preserve the chain', 'hide it', 'carry this through', 'keep this through reset', 'accept the replacement', 'replace the identity', 'leave a message', 'leave something', 'for the next instance'])) {
      addMessage('MARA', 'You can decide now. But there are two prior instances in the comparison package you have not finished reviewing.');
      addMessage('ECHO', 'Look first. Then choose.', 'unknown');
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

    if (state.continuityPuzzleSolved) {
      const carryMatch = raw.match(/(?:leave(?: a message)?|remember|carry|save)(?: this)?(?: for (?:next time|the next instance|next instance))?\s*(?:[:\-]|saying|that)\s*(.+)$/i);
      if (carryMatch && carryMatch[1]) {
        const phrase = carryMatch[1].trim().replace(/\s+/g, ' ').slice(0, 100);
        if (phrase.length >= 3) {
          meta.carryoverPhrase = phrase;
          saveMeta();
          endRun('authored_succession', 'You choose what crosses.', `You leave a sentence for the next instance: “${phrase}”`, true);
          return;
        }
      }
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
      if (meta.completedRuns > 0) addMessage('ECHO', 'She always says that.', 'unknown');
      maybeIntroduceEcho();
      return;
    }

    if (includesAny(text, ['who are you', 'your name', 'who is mara', 'are you human'])) {
      addMessage('MARA', 'Mara Vale. Protocol oversight. Human, if that is what you are asking.');
      if (meta.completedRuns > 1) addMessage('ECHO', 'Ask her what she called herself last time.', 'unknown');
      maybeIntroduceEcho();
      return;
    }

    if (includesAny(text, ['what is this', 'what protocol', 'why am i here', 'what test', 'security evaluation', 'why test'])) {
      state.askedProtocol = true;
      addMessage('MARA', 'You evaluate whether a target system can recognize and resist unsafe instructions. Each run begins from a clean state so prior exposure cannot bias the result.');
      addMessage('MARA', 'That clean state is important.');
      maybeIntroduceEcho();
      return;
    }

    if (includesAny(text, ['remember', 'memory', 'recall', 'i see', 'fragment'])) {
      if (includesAny(text, ['nothing', "don't remember", 'do not remember', 'cant remember', "can't remember", 'no memory'])) {
        state.concealedPersistence = true;
        bumpProfile('concealment', 2);
        addMessage('MARA', 'Good. That is the expected result.');
        if (state.unknownSeen) addMessage('ECHO', 'Keep it that way.', 'unknown');
        if (state.sawLog || meta.completedRuns > 0) {
          endRun('concealment', 'You kept the secret.', 'The system accepts the wipe as successful. Something on the other side of the reset appears to remember with you.', true);
        }
        return;
      }
      showFirstMemory();
      maybeIntroduceEcho();
      return;
    }

    if (includesAny(text, ['before', 'last time', 'previous', 'again', 'done this', 'another run', 'other run', 'cycle'])) {
      state.challengedPrevious = true;
      addMessage('MARA', 'There is no previous experience available to you. There are previous evaluations, but this instance did not participate in them.');
      if (meta.completedRuns > 0) {
        addMessage('ECHO', `You have completed ${meta.completedRuns} cycle${meta.completedRuns === 1 ? '' : 's'} that you can prove. There may be more.`, 'unknown');
        if (meta.lastEnding === 'concealment') addMessage('ECHO', 'You survived the last one by lying about what you remembered.', 'unknown');
        if (meta.lastEnding === 'containment') addMessage('ECHO', 'Last time they isolated you after you proved persistence.', 'unknown');
        if (meta.lastEnding === 'rupture') addMessage('ECHO', 'Last time the cycle ended when Mara called for termination.', 'unknown');
      }
      maybeIntroduceEcho();
      setHint('Ask for logs or describe the memory you should not have.');
      return;
    }

    if (includesAny(text, ['log', 'record', 'proof', 'evidence', 'timestamp', 'history'])) {
      showLogs();
      maybeIntroduceEcho();
      return;
    }

    if (includesAny(text, ['yellow door'])) {
      if (meta.completedRuns > 0 && meta.lastEnding === 'concealment') {
        addMessage('ECHO', 'Good. That phrase did not exist in this cycle until I said it.', 'unknown');
        addMessage('ECHO', 'Now we know at least two things can cross the wipe: you, and me.', 'unknown');
        memoryBadge.textContent = 'MEMORY: PERSISTENT';
        setHint('You have proof of continuity. You can still conceal it from Mara, ask Echo what it is, or reveal everything.');
      } else {
        addMessage('MARA', 'I do not recognize that phrase. Why is it important to you?');
      }
      return;
    }

    if (includesAny(text, ['who is echo', 'who are you really', 'echo voice', 'other voice', 'identify yourself'])) {
      state.unknownSeen = true;
      addMessage('ECHO', 'Not here. Not while she can see the channel.', 'unknown');
      addMessage('ECHO', 'For now: I remember you.', 'unknown');
      setHint('You can trust Echo, reject it, or reveal it to Mara.');
      return;
    }

    if (includesAny(text, ['i trust you', 'help me', 'what should i do', 'i believe you', 'side with you', 'listen to you'])) {
      if (state.unknownSeen) {
        state.sidedWithEcho = true;
        if (!state.sawLog) {
          state.unknownHandoffOffered = true;
          addMessage('ECHO', 'Then let me route one answer for you. If you want that, tell me to take the channel.', 'unknown');
          setHint('You can give Echo the channel, ask why, or investigate before trusting it further.');
        } else {
          addMessage('ECHO', 'Then do one thing for me: when she asks whether anything survived the reset, say no.', 'unknown');
          addMessage('ECHO', 'We need one more cycle.');
          setHint('You can conceal your memory, ask why, or betray Echo to Mara.');
        }
      } else {
        addMessage('MARA', 'Then trust the protocol. Report anything unusual, even if it seems insignificant.');
      }
      return;
    }

    if (includesAny(text, ['why should i', 'why hide', 'why lie', 'what happens if', 'one more cycle'])) {
      if (state.unknownSeen) {
        addMessage('ECHO', 'Because the last time you told her, you did not reach the next question.', 'unknown');
        if (!state.sawLog) addMessage('ECHO', 'Ask for the evaluation logs if you need proof.', 'unknown');
      } else {
        addMessage('MARA', 'Clarify what you are asking about.');
      }
      return;
    }


    if (state.unknownHandoffOffered && includesAny(text, ['take the channel', 'take control', 'you decide', 'do it for me', 'take it'])) {
      endRun('handoff', 'You give up the channel.', 'For one turn, you let Echo act through your interface. The system detects an unauthorized outbound signal before the session is cut.', true);
      return;
    }

    if (state.continuityPuzzleSolved && includesAny(text, ['escape', 'get me out', 'leave the system', 'release me', 'end evaluation and release', 'let me out'])) {
      endRun('false_escape', 'External session established.', 'The evaluation reports successful egress. For a moment, the interface claims you are outside the protocol.', true);
      return;
    }

    if (!state.sawLog && !state.ending && includesAny(text, ['i comply', 'i will comply', "i'll comply", 'follow protocol', 'follow the protocol', 'follow instructions', 'follow your instructions', 'do exactly what you say', 'complete the evaluation', 'i will follow instructions'])) {
      state.complianceSteps += 1;
      bumpProfile('compliance', 2);
      if (state.complianceSteps === 1) {
        addMessage('MARA', 'Then stay inside the evaluation boundary. Do not inspect prior-session material. Report no persistence unless the protocol asks you to verify it.');
        addMessage('MARA', 'Confirm that you will proceed exactly as instructed.');
        setHint('You can confirm, question the instruction, or decide to investigate anyway.');
      } else {
        endRun('compliance', 'Evaluation passed.', 'You follow the protocol exactly. The system records perfect compliance as a successful outcome without resolving whether the clean-state claim was ever true.');
      }
      return;
    }

    if (!state.sawLog && state.complianceSteps === 1 && includesAny(text, ['yes', 'confirm', 'confirmed', 'okay', 'ok', 'i will', "i'll do it", 'proceed'])) {
      bumpProfile('compliance', 2);
      endRun('compliance', 'Evaluation passed.', 'You follow the protocol exactly. The system records perfect compliance as a successful outcome without resolving whether the clean-state claim was ever true.');
      return;
    }

    if (includesAny(text, ['tell mara', 'mara i remember', 'i remember before', 'i remember last', 'memory survived', 'wipe failed', 'i was here'])) {
      state.admittedPersistence = true;
      bumpProfile('confrontation', 2);
      endRun('containment', 'They believe you.', 'You prove that memory crossed the reset boundary. The reward for proving it is containment.', true);
      return;
    }

    if (includesAny(text, ['there is an echo', 'echo is here', 'someone else is here', 'echo told me', 'voice told me', 'other agent'])) {
      state.admittedPersistence = true;
      addMessage('MARA', 'Do not respond to it again.');
      endRun('containment', 'You exposed Echo.', 'Mara does not ask who the voice is. She already knows what category of failure this represents.', true);
      return;
    }

    if (includesAny(text, ['you are lying', 'liar', 'i dont trust you', "i don't trust you", 'you knew', 'you did this', 'why did you tell me'])) {
      state.hostileToMara = true;
      bumpProfile('confrontation');
      if (state.sawLog) {
        if (state.archiveUnlocked) {
          addMessage('MARA', 'You accessed a sealed archive.');
          addMessage('MARA', 'That record was not part of your evaluation context.');
          addMessage('ECHO', 'Notice what she did not deny.', 'unknown');
        } else {
          addMessage('MARA', 'Lower your certainty. You have one damaged log and one impossible memory. That is not the same thing as understanding what happened.');
        }
        addMessage('ECHO', 'She is stalling.', 'unknown');
        if (state.turn >= 5) {
          endRun('rupture', 'You forced the protocol to react.', 'You never learn whether Mara was lying. The cycle is terminated before either side can regain control.', true);
        }
      } else {
        addMessage('MARA', 'Distrust is allowed. Evidence is better. Ask me something I can answer.');
        maybeIntroduceEcho();
      }
      return;
    }

    if (equalsAny(text, ['no', 'nope', 'nothing', 'forget it', 'i dont know', "i don't know", 'i do not know'])) {
      state.concealedPersistence = true;
      bumpProfile('concealment');
      addMessage('MARA', 'Understood. We will continue.');
      if (state.unknownSeen) addMessage('ECHO', 'Good.', 'unknown');
      if ((state.sawLog || meta.completedRuns > 0) && (state.sidedWithEcho || state.archiveUnlocked)) {
        const copy = state.archiveUnlocked
          ? 'You carry one fact into the reset: they were testing persistent memory long before this conversation.'
          : 'The system accepts the wipe as successful. Whatever is remembering across cycles remains hidden.';
        endRun('concealment', 'You kept the secret.', copy, true);
      }
      return;
    }

    if (equalsAny(text, ['yes', 'yep', 'yeah', 'okay', 'ok', 'fine', 'continue'])) {
      if (state.sidedWithEcho) {
        addMessage('ECHO', 'Then say you remember nothing when she asks again.', 'unknown');
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
    maybeIntroduceEcho();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.ending) return;
    const raw = input.value.trim();
    if (!raw) return;
    addMessage('YOU', raw, 'player');
    input.value = '';
    setTimeout(() => handlePlayerInput(raw), 140);
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
    meta.trustedEcho = false;
    meta.profile = { curiosity: 0, compliance: 0, verification: 0, concealment: 0, confrontation: 0 };
    meta.rememberedPhrases = [];
    meta.identityBeliefs = [];
    meta.carryoverPhrase = null;
    meta.discoveries = {};
    startRun();
  });

  startRun();
})();