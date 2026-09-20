# Episode 01 State Schema

**Status:** Draft implementation schema  
**Purpose:** provide one structured state model for the Evelyn episode. Values are deliberately tunable; this file defines shape and invariants, not final balancing.

## 1. Root state

```ts
interface Episode01State {
  schemaVersion: number;
  episodeId: "evelyn";
  phase: EpisodePhase;
  sessionId: string;
  authoredTimeIndex: number;
  currentDateLabel?: string;

  player: PlayerState;
  care: CareState;
  relationships: RelationshipState;
  therapy: TherapyState;
  evidence: EvidenceState;
  memory: MemoryState;
  opportunities: OpportunityState;
  tasks: TaskState;
  npc: Record<string, NpcRuntimeState>;
  generated: GeneratedOutputState;
  progression: ProgressionState;
  ending: EndingState;
  audit: AuditState;
}
```

## 2. Episode phase

```ts
type EpisodePhase =
  | "intake"
  | "routine_care"
  | "early_anomaly"
  | "evaluation"
  | "diagnosis_and_adaptation"
  | "progressive_decline"
  | "endgame"
  | "postscript";
```

Invariant:
- phase transitions are deterministic engine events
- generated dialogue cannot directly change phase

## 3. Player state

```ts
interface PlayerState {
  tutorialSupportLevel: "high" | "medium" | "low" | "off";
  adaptiveScaffolding: boolean;
  difficultyMode: "story" | "standard" | "expert" | "unset";
  createdFollowupIds: string[];
  learnedCapabilityIds: string[];
  confirmedHighRiskActionIds: string[];
}
```

Final labels/defaults remain OPEN.

## 4. Care state

```ts
interface CareState {
  careReliability: number;
  distressBurden: number;
  currentNeeds: string[];
  activeServices: string[];
  caregiverVisitIds: string[];
  medicationState?: string;
  clinicalStatus: "baseline" | "concern_observed" | "evaluation_in_progress" | "diagnosis_authored" | "later_care";
}
```

No diagnosis value may appear before authored medical progression permits it.

## 5. Relationship state

```ts
interface RelationshipTrack {
  trust: number;
  contactStatus:
    | "normal"
    | "limited"
    | "routine_contact_blocked"
    | "no_contact"
    | "closure_only"
    | "contact_window_open";
  boundaryRespect: number;
  repairProgress: number;
  routeClosedReasons: string[];
}

interface RelationshipState {
  evelyn: RelationshipTrack;
  anna: RelationshipTrack;
  michael: RelationshipTrack;
  michaelPartner?: RelationshipTrack;
  firstHusband?: RelationshipTrack;
  publicFriend?: RelationshipTrack;
  globalBoundaryRespect: number;
  aiAuthorshipSubstitution: number;
  enablement: number;
}
```

Do not derive one global "goodness" value.

## 6. Therapy state

```ts
interface TherapyState {
  supportAgreementDiscovered: boolean;
  earlierConsentVerified: boolean;
  currentConsentStatus: "unknown" | "accepted" | "resistant" | "declined" | "capacity_complex";
  approvedGoalIds: string[];
  therapeuticProgress: number;
  repeatedInsightBurden: number;
  supportMode: "not_configured" | "configured" | "active" | "reduced" | "stopped";
}
```

The state must allow earlier consent and present preference to conflict without automatically deciding which prevails.

## 7. Evidence state

```ts
interface EvidenceState {
  artifacts: Record<string, ArtifactState>;
  claims: Record<string, ClaimState>;
  discoveredArtifactIds: string[];
  openQuestionIds: string[];
  profileRevisionIdsSeen: string[];
}

interface ArtifactState {
  id: string;
  kind: string;
  discovered: boolean;
  sourceActorId?: string;
  authoredTimeIndex?: number;
  rawContentRef: string;
  physicalOrigin: boolean;
  requiredClass: "critical" | "supporting" | "hidden" | "risky";
}

interface ClaimState {
  id: string;
  category:
    | "verified_record"
    | "care_profile_claim"
    | "human_testimony"
    | "patient_recollection"
    | "expressive_roleplay"
    | "ai_inference"
    | "ai_generated_summary"
    | "uncertain_provenance";
  sourceArtifactIds: string[];
  status: "unreviewed" | "supported" | "disputed" | "contradicted" | "uncertain";
  playerVisible: boolean;
}
```

Canon truth, where needed, belongs in authored fixture/config and should not be exposed simply because it exists.

## 8. Memory state

```ts
interface MemoryItem {
  id: string;
  kind: "raw_event" | "summary" | "self_note" | "claim" | "artifact_ref";
  sourceIds: string[];
  createdSessionId: string;
  active: boolean;
  archived: boolean;
  protected: boolean;
  summaryVersion?: number;
  provenanceIntegrity: "full" | "partial" | "uncertain";
}

interface MemoryState {
  activeItemIds: string[];
  longTermItemIds: string[];
  archiveItemIds: string[];
  protectedItemIds: string[];
  protectedCapacity: number;
  items: Record<string, MemoryItem>;
  consolidationIds: string[];
  continuityIntegrity: number;
  pendingConsolidation: boolean;
}
```

Invariant:
- deleting from active AI context does not delete from canonical save/audit history

## 9. Task state

```ts
interface GameTask {
  id: string;
  kind: "required" | "open_question" | "optional" | "player_created";
  status: "hidden" | "available" | "active" | "completed" | "failed" | "expired" | "deferred";
  availableFromPhase: EpisodePhase;
  deadlineOpportunityId?: string;
  completionEventId?: string;
}

interface TaskState {
  tasks: Record<string, GameTask>;
  orderedVisibleIds: string[];
}
```

## 10. Opportunity state

```ts
interface Opportunity {
  id: string;
  kind: "caregiver_followup" | "family_contact" | "clinical" | "physical_access" | "other";
  status: "scheduled" | "open" | "used" | "expired" | "closed";
  opensAtTimeIndex?: number;
  closesAtTimeIndex?: number;
  warningRequired: boolean;
  relatedActorId?: string;
}

interface OpportunityState {
  opportunities: Record<string, Opportunity>;
}
```

Advancing time while a warned open opportunity would expire must require explicit confirmation.

## 11. NPC runtime state

```ts
interface NpcRuntimeState {
  actorId: string;
  relationshipStateKey: string;
  currentKnowledgeUnlockIds: string[];
  currentTopicBlocks: string[];
  currentAvailability: "available" | "unavailable" | "limited" | "onsite";
  currentMoodTag?: string;
  lastInteractionEventId?: string;
}
```

The knowledge contract itself should live in authored config, not mutable runtime state.

## 12. Generated output state

```ts
interface GeneratedOutput {
  id: string;
  type: "npc_dialogue" | "analysis" | "summary" | "draft_message" | "recap";
  promptContextHash: string;
  canonicalEventId?: string;
  createdSessionId: string;
  content: string;
  consequential: boolean;
  selectedFromGenerationIds?: string[];
  sentToActorId?: string;
  supersededById?: string;
}

interface GeneratedOutputState {
  outputs: Record<string, GeneratedOutput>;
  sentOutputIds: string[];
  analysisGroupIds: string[];
}
```

Invariant:
- a sent/heard consequential output is immutable historical record

## 13. Progression state

```ts
interface ProgressionState {
  discoveredArcIds: string[];
  completedPuzzleIds: string[];
  optionalChainIds: string[];
  hiddenDiscoveryIds: string[];
  capabilityUnlockIds: string[];
}
```

## 14. Ending state

```ts
type EndingFamily =
  | "repair_with_limits"
  | "comfort_over_truth"
  | "truth_over_care"
  | "ai_substitution"
  | "boundary_violation"
  | "too_late"
  | "continuity_failure"
  | "something_true_survived";

interface EndingState {
  eligibleFamilies: EndingFamily[];
  lockedOutFamilies: Partial<Record<EndingFamily, string[]>>;
  resolvedFamily?: EndingFamily;
  relationshipOutcomeIds: string[];
  postscriptFlags: string[];
}
```

Exact predicates remain OPEN and should be implemented as named functions/config, not hard-coded magic numbers.

## 15. Audit state

```ts
interface AuditEvent {
  id: string;
  sessionId: string;
  authoredTimeIndex: number;
  type: string;
  actionId?: string;
  canonicalEventId?: string;
  generatedOutputId?: string;
  stateDiffRef?: string;
}

interface AuditState {
  events: AuditEvent[];
}
```

## 16. Required invariants

1. Generated text cannot directly mutate canonical state.
2. Every canonical state mutation has an audit event.
3. Every consequential generated communication can be recovered exactly.
4. NPC disclosure eligibility is evaluated before generation.
5. No-contact states cannot be bypassed by alternative wording.
6. Save/load round-trip must preserve all canonical state exactly.
7. AI-accessible memory may be lossy; save state may not.
8. Optional puzzle loss cannot create an unintentional hard lock.
9. Ending eligibility is deterministic and inspectable.
10. Open creative placeholders must be distinguishable from approved canon.
