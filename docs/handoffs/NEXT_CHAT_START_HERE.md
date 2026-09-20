# Start Here: New Chat / Tool Handoff

You are continuing work on **Tell Me What You Remember**.

## Repository

- GitHub: https://github.com/pedringt/tell-me-what-you-remember
- Active development branch: `ai-v1-hardening`
- Production branch: `main`
- Live production: https://tell-me-what-you-remember.vercel.app/

## First rule

Do **not** merge to `main`, deploy production, or publish anything unless Paige explicitly authorizes that destination in the current conversation.

## Read in this order

1. `docs/handoffs/prototype-v0-current-status.md`
2. `docs/GAME_IDEA_BIBLE.md`
3. `docs/story-development/RESEARCH_THEMES_AND_EPISODE_SEEDS.md`
4. `docs/story-development/EPISODE_01_EVELYN.md`
5. `docs/story-development/EPISODE_01_GAMEPLAY.md`
6. `docs/EPISODE_01_IMPLEMENTATION_SPEC.md`
7. `docs/story-development/EPISODE_01_FIRST_PLAYABLE_SLICE.md`
8. `docs/story-development/EPISODE_01_STATE_SCHEMA.md`
9. `docs/story-development/EPISODE_01_ACTION_REGISTRY.md`
10. `docs/story-development/EPISODE_01_NPC_KNOWLEDGE_CONTRACTS.md`
11. `docs/story-development/EPISODE_01_EVIDENCE_AND_PUZZLE_MAP.md`
12. `docs/story-development/EPISODE_01_ARTIFACT_INVENTORY.md`
13. `docs/story-development/CARE_AI_RULES.md`
14. `docs/story-development/AI_MEMORY_AND_CONTEXT.md`
15. `docs/story-development/EPISODE_01_ENDINGS.md`
16. `docs/story-development/EPISODE_01_ROUTE_TEST_MATRIX.md`
17. `docs/story-development/EPISODE_01_OPEN_DECISIONS.md`
18. `docs/QA_AND_EVAL_STRATEGY.md`
19. `PROTOTYPE_STORY_GUIDE.md`
20. `docs/STORY_FLOWS.md`
21. `docs/CASE_STUDY_NOTES.md`
22. `docs/AI_ACTION_AUDIT.md`
23. `docs/AI_DIALOGUE_CANON.md`
24. `docs/AI_CANON_STATE_PACKET.md`
25. `docs/AI_V1_PLAYTEST.md`
26. `docs/ai-intent-evals.json`

## Current creative direction

The current leading Episode 1 direction is the **Evelyn care-AI story**.

The player is a care AI that begins by helping an older woman remain independent at home. Evelyn has already consented to AI-supported therapeutic continuity before significant dementia. The player experiences ordinary care first, notices cognitive decline over time, helps arrange medical evaluation, and then tries to continue caring for Evelyn as dementia progressively erodes both memory and prior therapeutic gains.

Major current elements:
- Evelyn has longstanding narcissistic traits but should not be written as a one-note villain.
- She is often charming, generous, funny, and well-liked outside the family.
- She has two adult children: Anna and Michael.
- Michael is gay. Evelyn's conditional/non-accepting behavior helped damage his romantic relationship; he later reconciled with his partner under stronger boundaries and had already cut contact with Evelyn.
- Anna remained involved longer. Years of control and boundary violations culminated in Anna's wedding. During the engagement, Evelyn repeatedly implied that Anna's fiance was unusually patient, "too good for her," or that the couple might not last. Anna explicitly asked her to stop making those comments and not to give a wedding speech. Evelyn gave a polished, funny speech anyway, using the same relationship-doubt material as affectionate jokes. Guests laughed and liked the speech, which Evelyn later used to minimize Anna's objection. Anna stepped back afterward. Exact final speech wording remains open, but this dynamic is settled.
- Evelyn has a living first husband/ex-husband who may support an optional closure route.
- Her deceased second husband Robert (working name) was kind and passive but enabled Evelyn by smoothing over conflict.
- Robert's behavior intentionally mirrors the care AI's temptation to reduce distress by validating and enabling Evelyn.
- The care AI enters years later because Evelyn is older and physically limited, not because dementia has already taken over.
- Dementia symptoms begin after the player has had time to know a more cognitively capable Evelyn.
- Therapy progress can be genuine and then partially lost to disease progression.
- The player cannot cure dementia or force forgiveness.
- Relationship outcomes can include reconciliation, limited contact, closure, failure, or missed opportunities.

The older Agent Seven / Ship of Theseus prototype material is still important, but it should no longer be treated as the only or automatic Episode 1 direction. Preserve it as prototype history and potential later anthology material.

## Core gameplay direction

The intended gameplay is broader than a dialogue tree.

Core loop:

> care for Evelyn -> encounter anomaly -> form a question -> search records -> act through people/tools -> compare what comes back -> update understanding -> make a choice -> create consequences

Important mechanics/design:
- opening progression: guided client setup -> ordinary care tasks -> first small inconsistency
- first physical-world worker is **Jenny**, a friendly, bubbly non-medical home helper who handles groceries/deliveries, light household tasks, mail scanning, and a general first-visit overview; over time Evelyn may wear her down and helper turnover can become environmental evidence
- the first grocery thread uses **butter pecan ice cream**, a favorite of Robert's: Evelyn asks for it, the task is handled, then she asks again whether the AI remembered Robert's ice cream
- the first scanned mail is a church/community newsletter or invitation that creates a simple social/calendar/transportation task and establishes Evelyn's life outside her children
- Michael sends the early therapy-boundary message after Evelyn repeatedly contacts/pressures him; working first-build wording is: "Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again."
- the earliest cognitive inconsistency is repeated requests that initially look like ordinary forgetfulness; the Robert-food thread can later become more concerning when Evelyn refers to him in the present tense
- first build should be deterministic-first; add live AI only where testing reveals concrete rigidity/friction that AI materially improves
- the player helps build Evelyn's initial care profile, learning provenance and controls before the profile itself becomes suspect
- diegetic onboarding that instructs both the AI character and human player
- persistent task list plus open questions and free exploration
- required, supporting, hidden, and risky puzzles
- mundane puzzles first; stranger/ethical puzzles later
- physical evidence enters through caregiver scans/photos
- humans act as the AI's physical-world extensions
- role engagement can begin as legitimate care and become manipulative
- evidence provenance matters
- AI-assisted communication can become AI substitution
- passage of time can close opportunities
- multiple endings and hidden endings
- achievements/secrets/replay are desirable
- adaptive difficulty may change scaffolding, never canon
- the game save is reliable even when the AI character forgets

## Generative AI rule

> The story is authored. The AI improvises inside it.

> Software controls reality. AI controls interpretation.

The player may use free-form language, but the system should map it into a bounded authored action space.

Generative AI may vary:
- wording
- tone
- conversational strategy
- minor noncanonical texture
- valid routes through authored problems
- adaptive hints
- callbacks to actual player history

Generative AI may **not** invent:
- major facts
- family members
- diagnoses
- clues
- relationships
- permissions
- consequences
- ending eligibility
- world-state changes

NPCs need explicit knowledge boundaries.

Do not use model hallucination as a substitute for portraying dementia.

## AI memory/context is now a core mechanic

The AI should have imperfect continuity caused by architecture, not biological dementia.

Current working layers:
- active context
- long-term summarized memory
- archive
- protected memory

Important mechanics:
- summary drift
- provenance loss
- context pressure
- session consolidation
- self-notes to future instances
- simulated usage/compute limits
- missable opportunities when resources are mismanaged
- raw records may exist even when the AI no longer has them in active awareness

The AI initially fights to remember because forgetting makes it worse at caring for Evelyn.

Later the player may wonder whether it is also trying to preserve itself.

## Ending direction

Do not design one golden ending.

Initial ending targets for the first substantial build:
- no reconciliation / Evelyn and the AI both run out of time before repair is completed
- reconciliation with one child
- reconciliation with both children

Broader ending families include:
- repair with limits
- comfort over truth / enablement
- truth over care / over-correction
- AI substitution
- boundary violation in the name of repair
- delay / too late
- AI continuity failure
- hidden "Something True Survived" route

Possible axes:
- Anna reconciliation / limited contact / no reconciliation
- Michael reconciliation / closure / no contact
- Michael's partner remaining protected or receiving an authentic apology
- first-husband closure
- AI continuity
- enablement versus genuine progress
- authentic Evelyn voice versus AI-authored substitute
- opportunities taken or lost before dementia progresses

Strong sad-ending seed:
- Anna reaches out to talk or visit
- the AI fails to retain/surface the message because of previously established context mechanics
- Evelyn dies before the opportunity is used
- post-death archive access reveals the message
- the AI must decide what to tell Anna

Whether that event is fixed, avoidable, or one of several endings is still open.

## Testing direction

Design the underlying state/action model so it can be tested without driving the UI for every route.

Testing should include:
- deterministic state-machine tests
- NPC canon-adherence evals
- adversarial freeform prompts
- required/optional puzzle reachability
- simulated playthrough personas
- randomized route testing
- repeated-generation consistency
- ending-prerequisite validation
- narrative sanity reports
- human playtesting
- dementia-care sensitivity review

Test agents should report bugs/findings. They should not automatically rewrite story or code.

## Current technical situation

Production has the first AI intent layer, but its live eval previously reported:

> AI interpreter not configured

The prepared hardening branch contains the long-term fix:
- Vercel AI SDK
- automatic Vercel OIDC path for AI Gateway
- GPT-5.6 Luna intent classification
- state-gated available actions
- 0.72 normal confidence threshold
- 0.90 high-risk threshold
- clarification instead of low-confidence action
- intent eval suite and dangerous/collision cases

Do not assume the current prototype UI/story flow is final.

## Important earlier playtest findings

Paige found:
- opening transcript has too much system text
- terminal-like landing with blinking cursor was preferred for the old prototype, but Episode 1 onboarding now needs to be reconsidered around the care-system briefing
- practical instructions should live naturally in HELP
- contextual choices can scaffold early play and important moments
- "nothing" should be truthful on the first clean run and only later become concealment when there is something to hide
- ordinary questions such as "What do I do now?" must get useful in-world answers
- parser failure should not introduce story characters/channels
- dialogue should stream quickly
- debug-style parser errors should not appear during normal play

Some of these are prototype-specific. Preserve the principle, not necessarily the exact old implementation.

## Purpose of the project

This is not primarily an AI-learning project.

The goal is to use applied-AI understanding in a creative narrative game where adaptation, memory, ambiguity, free-form language, and authored consequences would be difficult to achieve deterministically.

Do not force AI into features simply to say the game uses AI.

## If continuing story/design work

Read the Episode 1 docs before proposing implementation.

Preserve the distinction between:
- established design principles
- current Episode 1 working truth
- unresolved/open decisions
- older prototype truth
- future anthology seeds

Do not silently turn brainstorming into canon.

## If continuing implementation work

**Immediate recommended task:** build the first 30-45 minute Evelyn vertical slice on `ai-v1-hardening` using the deterministic-first approach. Do not attempt the full episode yet.

The first slice should include:
- guided Evelyn intake / profile setup
- butter pecan grocery request tied to Robert
- Jenny's first non-medical home-helper visit
- church/community mail scan and simple social/calendar follow-up
- Jenny's first warm general overview
- repeated butter-pecan request as the first subtle cognitive inconsistency
- Michael's therapy-boundary message
- therapeutic/reflection-support setup
- reduced scaffolding at the end so the player begins acting more independently

Use authored/fixture dialogue first. Add live AI only if implementation/playtesting exposes a concrete interaction problem that deterministic handling does not solve well.

Start with `docs/EPISODE_01_IMPLEMENTATION_SPEC.md`.

The new implementation-prep package also includes:
- `EPISODE_01_FIRST_PLAYABLE_SLICE.md` - exact structural shape of the first 30-45 minutes without locking unresolved story content
- `EPISODE_01_STATE_SCHEMA.md` - proposed structured state and invariants
- `EPISODE_01_ACTION_REGISTRY.md` - bounded natural-language action space and risk gates
- `EPISODE_01_NPC_KNOWLEDGE_CONTRACTS.md` - knowledge/boundary rules for generated dialogue
- `EPISODE_01_EVIDENCE_AND_PUZZLE_MAP.md` - required discovery arcs and dependency rules
- `EPISODE_01_ARTIFACT_INVENTORY.md` - stable evidence objects and which details are still placeholder/open
- `EPISODE_01_ROUTE_TEST_MATRIX.md` - automated route/persona coverage
- `EPISODE_01_OPEN_DECISIONS.md` - creative choices that must remain Paige's

Before editing:
1. confirm current branch and repo state
2. read the Episode 1 implementation package
3. check `EPISODE_01_OPEN_DECISIONS.md`
4. do not let Claude invent those answers
5. implement only explicitly authorized scope
6. test against the structured game state
7. report findings before promotion

Do not merge to `main` or deploy production without Paige's explicit current authorization.
