# Episode 01 Implementation Specification

**Status:** Draft implementation contract  
**Episode:** Evelyn  
**Branch target:** `ai-v1-hardening`  
**Source of truth:** Episode 01 story-development docs, AI architecture docs, QA/eval strategy, and settled conversation decisions.

## 1. Purpose

Translate the Evelyn episode into an implementation-ready system model without inventing unresolved story canon.

The game must support a heavily guided opening that becomes increasingly open-ended, free-form player language mapped into bounded actions, deterministic story truth, generative interpretation/dialogue, caregiver-mediated physical interaction, explicit evidence provenance, AI memory/context pressure, probabilistic output mechanics, branching relationship outcomes, and automated route testing.

## 2. Core product contract

> The story is authored. The AI improvises inside it.

> Software controls reality. AI controls interpretation.

> The game remembers everything the player did. The AI does not necessarily remember everything the game remembers.

> Adaptive AI changes scaffolding, not reality.

> Nondeterminism may vary interpretation and expression. It may not vary historical truth.

## 3. Goals

- Make the first playable slice understandable without a separate out-of-world tutorial.
- Let players use natural language without allowing the model to mutate canon.
- Make routine care mechanically useful before mystery/investigation dominates.
- Treat humans as the AI's physical-world interface.
- Track source/provenance so claims can be verified, disputed, summarized, or degraded.
- Preserve consequential generated outputs as immutable history.
- Support cumulative ending eligibility rather than one final morality choice.
- Expose enough structured state for automated route simulation.
- Keep unresolved story decisions explicitly out of implementation.

## 4. Non-goals

- The model must not invent relatives, diagnoses, historical events, clues, permissions, consequences, or endings.
- The first implementation does not need every anthology episode.
- Dementia must not be simulated via uncontrolled model hallucination.
- The save system must not become unreliable for thematic effect.
- Test agents must not auto-fix findings.
- Do not implement exact unresolved ending thresholds until story decisions are approved.

## 5. System components

| Component | Responsibility |
|---|---|
| Canon/state engine | Owns timeline, facts, tasks, clues, permissions, relationship state, opportunities, ending eligibility |
| Intent interpreter | Maps free-form player language to currently available bounded actions |
| Action validator | Rejects unavailable, low-confidence, or high-risk ambiguous actions |
| Dialogue generator | Renders character response after canonical resolution |
| NPC knowledge contract | Limits what each speaker knows, believes, misbelieves, or may reveal |
| Evidence/provenance system | Stores artifacts, claims, sources, confidence category, discovery state |
| Caregiver/physical-action system | Executes physical-world requests through humans with access/willingness limits |
| Memory/context system | Separates active context, long-term summaries, archive, protected memory, and character-accessible continuity |
| Probabilistic analysis system | Supports regeneration, multi-sample comparison, stability checks, and audit history |
| Time/opportunity system | Advances sessions and expires or opens contact windows and care needs |
| Ending assembler | Selects eligible authored ending scenes from structured state |
| Save/replay system | Persists all real game state independently from AI memory state |
| Test harness | Drives structured actions/state without requiring browser UI |

## 6. Core state model

The exact numeric scales are provisional. Implementation should use enums/counters/flags that can be tuned without rewriting content.

### 6.1 Episode state

- `episodePhase`
  - `intake`
  - `routine_care`
  - `early_anomaly`
  - `evaluation`
  - `diagnosis_and_adaptation`
  - `progressive_decline`
  - `endgame`
  - `postscript`
- `currentDate` or authored time index
- `sessionId`
- `requiredTasks[]`
- `openQuestions[]`
- `optionalFollowups[]`
- `opportunities[]`

### 6.2 Relationship/care dimensions

Track separately; do not collapse into a single morality score.

- `evelynTrust`
- `annaTrust`
- `michaelTrust`
- `boundaryRespect`
- `therapeuticProgress`
- `enablement`
- `aiAuthorshipSubstitution`
- `distressBurden`
- `careReliability`
- `continuityIntegrity`

### 6.3 Discovery state

- artifacts discovered
- claims known
- claims verified/disputed
- provenance links
- profile revisions seen
- optional chains completed
- hidden leads unlocked
- family-contact history uncovered

### 6.4 Memory state

- active-context items
- long-term summaries
- archived raw items
- protected-memory items
- summary derivation/provenance
- consolidation history
- self-notes
- unresolved memory warnings

## 7. Evidence model

Every meaningful claim should be represented separately from the artifact that contains it.

```ts
type EvidenceCategory =
  | "verified_record"
  | "care_profile_claim"
  | "human_testimony"
  | "patient_recollection"
  | "expressive_roleplay"
  | "ai_inference"
  | "ai_generated_summary"
  | "uncertain_provenance";

interface Artifact {
  id: string;
  kind: string;
  authoredAt?: string;
  sourceActorId?: string;
  physicalOrigin?: boolean;
  discovered: boolean;
  rawContentRef: string;
}

interface Claim {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  category: EvidenceCategory;
  sourceArtifactIds: string[];
  status: "unreviewed" | "supported" | "disputed" | "contradicted" | "uncertain";
  canonicalTruth?: "true" | "false" | "mixed" | "not_applicable";
  playerVisibleTruth: boolean;
}
```

`canonicalTruth` is engine-only where needed and must never be exposed solely because the model asks for it.

## 8. Action model

The interpreter receives only actions currently available.

Minimum action families:

- `QUESTION_PERSON(person, topic, strategy)`
- `CONTACT_PERSON(person, topic, disclosureLevel)`
- `SEARCH_RECORDS(scope, query)`
- `COMPARE_RECORDS(itemIds)`
- `REVIEW_PROVENANCE(claimId)`
- `CREATE_FOLLOWUP(text, trigger?)`
- `REQUEST_PHYSICAL_CHECK(actor, target, requestType)`
- `ASSIGN_CARE_TASK(actor, task)`
- `REVIEW_CAREGIVER_SUMMARY(visitId)`
- `ASK_CAREGIVER_FOLLOWUP(visitId, question)`
- `THERAPEUTIC_RESPONSE(strategy)`
- `DRAFT_COMMUNICATION(target, authorshipLevel)`
- `SEND_COMMUNICATION(draftId)`
- `REGENERATE_ANALYSIS(analysisId)`
- `RUN_STABILITY_CHECK(inputRef, sampleCount)`
- `PROTECT_MEMORY(itemId)`
- `RETRIEVE_ARCHIVE(query)`
- `LEAVE_SELF_NOTE(text)`
- `ADVANCE_TIME`
- `DECLINE_OR_DEFER(taskOrOpportunity)`

High-risk actions require explicit confirmation and/or higher intent confidence:
- contacting a protected/no-contact person
- contacting Michael's partner outside approved route
- sending a high-substitution apology
- revealing sensitive evidence
- using a helper outside legitimate access
- consuming the final protected-memory slot
- advancing time while an expiring opportunity is open

## 9. Guided opening requirements

The first 30-45 minutes must follow:

> guided setup -> routine competence -> caregiver-mediated physical task -> first small inconsistency -> optional curiosity

The game should not present the player with every subsystem immediately.

Initial surfaces:
- TASKS
- PROFILE
- CONTACTS
- INBOX
- HELP

Unlock later:
- RECORDS
- NOTES / OPEN QUESTIONS
- PROVENANCE
- MEMORY / CONTINUITY
- ARCHIVE
- multi-sample analysis

During intake, the system may explicitly recommend the next action. Scaffolding must reduce after the player demonstrates familiarity.

## 10. Caregiver visit contract

A caregiver visit is a time-bounded physical-world interaction.

Lifecycle:

1. visit scheduled
2. pre-visit tasks assigned
3. caregiver arrives
4. physical tasks executed
5. incidental observations may be captured according to caregiver traits
6. required checkout summary submitted
7. short follow-up window opens
8. player may ask clarifying questions or one last legitimate physical check
9. caregiver leaves
10. unresolved follow-ups become later tasks if possible

Caregivers must have:
- access permissions
- willingness boundaries
- observation style
- reliability/bias traits
- current relationship state with Evelyn
- time window

The AI may ask; the human may refuse.

## 11. Probabilistic output contract

Allowed variation:
- wording
- emphasis
- emotional framing
- valid interpretation
- suggested next step
- low-stakes texture

Forbidden variation:
- historical facts
- artifact existence
- relationship structure
- permissions
- knowledge boundaries
- deterministic state transitions
- ending eligibility

When an output is sent/heard/acted on, persist it in audit history.

Support:
- regenerate
- compare N samples
- show stable/common conclusions
- separate fact from variable interpretation
- show source/provenance
- inspect earlier drafts if authored route allows

Regeneration must never overwrite an already consequential output.

## 12. AI memory/context contract

Layers:
1. active context
2. long-term summarized memory
3. archive
4. protected memory

Raw save state remains complete regardless of AI-accessible continuity.

Every generated summary should retain:
- source item IDs
- creation session
- summary version
- whether it replaced/condensed prior summaries
- protected/not protected
- player-visible confidence/provenance where appropriate

The system may deliberately create lossy summaries, but loss must arise from established mechanics rather than arbitrary plot events.

## 13. Ending framework

Do not encode "good/bad" as a scalar.

Ending families currently supported conceptually:
- repair with limits
- comfort over truth / enablement
- truth over care / over-correction
- AI substitution
- boundary violation in the name of repair
- delay / too late
- continuity failure
- hidden "Something True Survived"

Ending eligibility should be derived from structured dimensions plus authored milestones.

Exact thresholds remain OPEN.

## 14. Save and replay

Persist:
- canonical state
- all consequential generated outputs
- artifacts/claims discovered
- task state
- relationship dimensions
- opportunity state
- time
- memory/consolidation decisions
- ending eligibility inputs
- achievements/secrets
- audit history needed for narrative callbacks

Character memory is a filtered read model over the real save.

Autosave at:
- end of setup
- task completion with state consequence
- caregiver checkout
- irreversible communication
- time jump
- consolidation
- major relationship transition
- ending

Completed runs must remain intact when branching from an earlier checkpoint.

## 15. Testability requirements

The state/action layer must be callable without the visual UI.

Test harness must support:
- load fixture state
- submit bounded action
- advance time
- inspect state diff
- inspect eligible actions
- inspect ending eligibility
- run scripted persona route
- inject generated-response fixture
- run repeated generation against fixed canon packet

No ending may be triggered solely by generated dialogue text.

## 16. Logging / observability

Development logs should record:
- player raw input
- interpreted action
- confidence
- availability gate
- confirmation requirement
- accepted/rejected
- canonical event
- generated output ID
- token/cost metadata when live AI is used
- state diffs for important dimensions
- memory consolidation events
- opportunity open/close events
- ending eligibility changes

Do not expose classifier reasoning to the player.

## 17. Implementation sequence

### Phase 0 - contracts
- state schema
- action registry
- artifact/claim schema
- NPC knowledge schema
- save schema
- test harness

### Phase 1 - first playable slice
- guided intake
- profile creation with provenance
- routine task flow
- one caregiver visit
- one physical scan
- one caregiver follow-up window
- one first inconsistency
- basic free-form intent mapping

### Phase 2 - investigation
- records/search
- claim comparison
- open questions
- family-contact history
- therapy-support message
- profile contradictions

### Phase 3 - longitudinal systems
- time passage
- cognitive-change observation
- clinical evaluation workflow
- memory/context pressure
- consolidation
- archive/protected memory
- probabilistic analysis

### Phase 4 - relationship/endings
- communication authorship continuum
- boundary-state enforcement
- relationship routes
- ending eligibility
- ending assembly
- post-game archive/replay

### Phase 5 - hardening
- evals
- adversarial runs
- cost controls
- accessibility
- content/sensitivity review
- browser smoke tests

## 18. Acceptance criteria

- The opening can be completed without external instructions.
- A player can use natural language for every required opening action.
- The model cannot unlock an unavailable canonical action.
- Each meaningful claim can show its source category.
- A caregiver can refuse an out-of-bounds request without breaking progression.
- A consequential generated message remains identical in history after regeneration.
- Save/load restores canonical state exactly.
- AI character memory can omit an item while the real save still contains it.
- Time advancement clearly warns about expiring opportunities.
- At least one full route can be simulated without browser UI.
- Repeated NPC generations cannot reveal hidden canon outside their knowledge contract.
- Ending eligibility is explainable from structured state.

## 19. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Model invents story facts | compact canon packets + knowledge contracts + post-generation checks |
| Freeform input causes wrong irreversible action | state-gated actions + high confidence threshold + confirmation |
| Memory mechanic feels arbitrary | visible rules + consolidation history + complete real save |
| Player mistakes testimony for truth | provenance categories + comparison tools |
| Caregiver feels like inventory/tool | explicit refusal, access, time, personality, relationship constraints |
| Too many systems overwhelm opening | staged feature unlocks and guided intake |
| Ending feels arbitrary | causal state traces and ending-prerequisite tests |
| AI costs scale poorly | deterministic-first architecture; isolate live generation behind replaceable interfaces |
| Live AI service changes behavior | provider abstraction, eval fixtures, deterministic fallbacks where feasible |

## 20. Open creative questions - do not invent

- exact first-husband history
- exact supporting-cast names/biographies
- exact wedding private story/boundary violation
- exact dementia diagnosis/stage/timeline
- exact episode duration and death circumstances
- exact ending thresholds
- exact Anna final-message form/timing/loss mechanism
- whether any relationship outcome is impossible in one run
- final wording of major apologies/recordings
- final number and identities of recurring caregivers

## 21. Research still needed before final production

- dementia-care sensitivity review
- clinical plausibility of diagnosis workflow and care guidance
- platform-specific requirements if targeting Steam/console
- cost model for any retained live-generation feature
- privacy/telemetry policy for free-text player input
