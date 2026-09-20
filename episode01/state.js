// Structured game state for Episode 01, following
// docs/story-development/EPISODE_01_STATE_SCHEMA.md. The `slice` block holds the
// first-slice specifics that the schema leaves to the implementation.

export const SCHEMA_VERSION = 1;

function track(overrides = {}) {
  return {
    trust: 0,
    contactStatus: 'normal',
    boundaryRespect: 0,
    repairProgress: 0,
    routeClosedReasons: [],
    ...overrides,
  };
}

export function createInitialState({ sessionId = 'session-1' } = {}) {
  return {
    schemaVersion: SCHEMA_VERSION,
    episodeId: 'evelyn',
    phase: 'intake',
    sessionId,
    authoredTimeIndex: 0,
    currentDateLabel: 'Day 1',

    player: {
      tutorialSupportLevel: 'high',
      adaptiveScaffolding: true,
      difficultyMode: 'unset',
      createdFollowupIds: [],
      learnedCapabilityIds: [],
      confirmedHighRiskActionIds: [],
      visibleSurfaces: ['TASKS', 'PROFILE', 'CONTACTS', 'INBOX', 'HELP'],
    },
    care: {
      careReliability: 0,
      distressBurden: 0,
      currentNeeds: [],
      activeServices: ['household_support'],
      caregiverVisitIds: [],
      clinicalStatus: 'baseline',
    },
    relationships: {
      evelyn: track(),
      anna: track({ contactStatus: 'limited' }),
      michael: track({ contactStatus: 'limited' }),
      globalBoundaryRespect: 0,
      aiAuthorshipSubstitution: 0,
      enablement: 0,
    },
    therapy: {
      supportAgreementDiscovered: false,
      earlierConsentVerified: false,
      currentConsentStatus: 'unknown',
      approvedGoalIds: [],
      therapeuticProgress: 0,
      repeatedInsightBurden: 0,
      supportMode: 'not_configured',
      behavior: null,
    },
    evidence: {
      artifacts: {},
      claims: {},
      discoveredArtifactIds: [],
      openQuestionIds: [],
      profileRevisionIdsSeen: [],
    },
    // Memory/context mechanics are not part of the first slice; the container
    // exists so the save shape matches the schema.
    memory: {
      activeItemIds: [], longTermItemIds: [], archiveItemIds: [], protectedItemIds: [],
      protectedCapacity: 0, items: {}, consolidationIds: [], continuityIntegrity: 1,
      pendingConsolidation: false,
    },
    opportunities: { opportunities: {} },
    tasks: { tasks: {}, orderedVisibleIds: [] },
    npc: {
      evelyn: { actorId: 'evelyn', relationshipStateKey: 'evelyn', currentKnowledgeUnlockIds: [], currentTopicBlocks: [], currentAvailability: 'available' },
      jenny: { actorId: 'jenny', relationshipStateKey: 'jenny', currentKnowledgeUnlockIds: [], currentTopicBlocks: [], currentAvailability: 'unavailable' },
    },
    generated: { outputs: {}, sentOutputIds: [], analysisGroupIds: [] },
    progression: {
      discoveredArcIds: [], completedPuzzleIds: [], optionalChainIds: [],
      hiddenDiscoveryIds: [], capabilityUnlockIds: [],
    },
    ending: { eligibleFamilies: [], lockedOutFamilies: {}, relationshipOutcomeIds: [], postscriptFlags: [] },
    audit: { events: [] },

    slice: {
      complete: false,
      metEvelyn: false,
      topicsAnswered: [],
      profile: [],
      grocery: { requested: false, resolution: null },
      messages: { michael: { delivered: false, read: false } },
      agreementReviewed: false,
      visit: {
        status: 'none', // none | scheduled | onsite | wrapped | left
        assigned: [],
        executed: [],
        extraChecks: [],
        overviewGiven: false,
        summaryReady: false,
        summaryReviewed: false,
        followupsRemaining: 0,
        followupsAsked: [],
        summary: null,
      },
      mail: { scanned: false, asked: false, calendared: false, transport: null },
      // Searchable record of what happened, written by resolvers. RECORDS search
      // reads only from here, so it can never return something that isn't in state.
      history: [],
      inconsistency: { occurred: false, response: null },
      recordsUnlocked: false,
      notesUnlocked: false,
      missStreak: 0,
      pendingConfirmation: null,
      lineSeq: 0,
    },

    transcript: [],

    // Local-only counters described in EPISODE_01_FIRST_PLAYABLE_SLICE.md.
    // Kept in the save file only; nothing here is sent anywhere.
    telemetry: {
      turn: 0,
      firstTaskTurn: null,
      helpUsed: 0,
      suggestionUsed: 0,
      freeFormUsed: 0,
      clarifications: 0,
      profileFieldsSaved: 0,
      followupsAsked: 0,
      inconsistencyPursued: null,
      firstSelfFollowupTurn: null,
      turnsBeforeSelfFollowup: null,
      notesUnlockedTurn: null,
    },
  };
}

export function clone(state) {
  return structuredClone(state);
}

export function serialize(state) {
  return JSON.stringify(state);
}

export function deserialize(json) {
  const parsed = JSON.parse(json);
  if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || parsed.episodeId !== 'evelyn') {
    throw new Error('Unsupported save');
  }
  return parsed;
}
