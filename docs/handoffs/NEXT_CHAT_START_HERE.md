# Start Here: New Chat / Tool Handoff

> **CURRENT SOURCE OF TRUTH (2026-09-20): [`docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md`](../../docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md).**
> The target is now a compact 8 to 12 minute portfolio judgment game, and the next step is the five-minute paper playtest in
> [`docs/prototypes/PORTFOLIO_PLAYTEST_KIT.md`](../../docs/prototypes/PORTFOLIO_PLAYTEST_KIT.md). The sections below headed "Earlier phase" through "Current implementation gate" describe the
> **earlier one-day management prototype** (attention / delegation / memory, working interpretations, event map). They are
> preserved as history and source material. The **settled story anchors** (Evelyn, Jenny, Robert, butter pecan, Michael's
> message, canon and rules) remain valid.

You are continuing work on **Tell Me What You Remember**.

## Repository

- GitHub: https://github.com/pedringt/tell-me-what-you-remember
- Active development branch: `ai-v1-hardening`
- Production branch: `main`
- Live production: https://tell-me-what-you-remember.vercel.app/

## First rule

Do **not** merge to `main`, deploy production, or publish anything unless Paige explicitly authorizes that destination in the current conversation.

## Earlier phase (superseded by the portfolio judgment game): core-loop validation, not Episode 1 production

The project has deliberately stepped back from implementing the full Evelyn opening.

The current question is:

> **Can one ordinary day of Evelyn care produce 15-20 minutes of play that makes the player want another turn?**

Do not resume the broader 30-45 minute vertical slice yet.

Do not expand endings, dementia progression, anthology content, full replay, helper turnover, advanced monitoring, or the full memory economy.

The active work is a **manual/paper core-loop prototype** followed, only if it works, by the smallest possible ugly digital prototype.

## Read these first

**Start with** `docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md` (current source of truth) and `docs/prototypes/PORTFOLIO_PLAYTEST_KIT.md` (the next step). Items 1 to 5 below are the earlier one-day management prototype: **superseded**, kept as history.

1. `docs/prototypes/EVELYN_CORE_LOOP_PROTOTYPE.md`
2. `docs/prototypes/EVELYN_ONE_DAY_EVENT_MAP.md`
3. `docs/prototypes/EVELYN_MANUAL_PLAYTEST.md`
4. `docs/prototypes/EVELYN_PLAYTEST_SCORECARD.md`
5. `docs/prototypes/EVELYN_ONE_DAY_STATE_FIXTURE.json`
6. `docs/story-development/EPISODE_01_STATE_SCHEMA.md`
7. `docs/story-development/EPISODE_01_ACTION_REGISTRY.md`
8. `docs/story-development/EPISODE_01_NPC_KNOWLEDGE_CONTRACTS.md`
9. `docs/story-development/EPISODE_01_OPEN_DECISIONS.md`

Then, for future context only:

10. `docs/EPISODE_01_IMPLEMENTATION_SPEC.md` - broader design, currently paused
11. `docs/story-development/EPISODE_01_FIRST_PLAYABLE_SLICE.md` - future 30-45 minute slice, currently paused
12. `docs/story-development/EPISODE_01_EVELYN.md`
13. `docs/story-development/EPISODE_01_GAMEPLAY.md`
14. `docs/GAME_IDEA_BIBLE.md`
15. `docs/QA_AND_EVAL_STRATEGY.md`
16. `docs/handoffs/prototype-v0-current-status.md` - older Agent Seven prototype history

## Core gameplay hypothesis

The player is a care AI managing an incomplete model of a human life.

Current loop:

> **Event -> prioritize -> investigate/delegate -> receive imperfect information -> synthesize -> update working model -> preserve/compress memory -> time advances**

The first prototype centers three mechanics:

### Attention
The player cannot fully pursue everything.

Use concrete, forecastable constraints:
- time windows
- deadlines
- limited human availability
- mutually exclusive choices

Avoid a generic attention meter unless testing proves it is clearer.

### Delegation
The AI has no body and acts through humans.

Jenny is the primary physical-world interface in the first prototype.

She has:
- a visible 45-minute visit
- only three substantial task slots
- clear role boundaries
- incomplete human observations
- no random failure

### Memory
The player gets one meaningful consolidation decision.

Only some information remains at full fidelity in active long-term memory. The rest remains in canonical save/archive but is represented to the AI through compressed summaries.

Do not turn this into constant inventory management.

## Supporting systems

### Provenance
Keep visible distinctions between:
- verified record
- Evelyn recollection
- Jenny observation
- Michael message
- AI inference
- compressed summary

Never silently turn an inference into a fact.

### Working interpretations
At most 2-3 active interpretations.

They are useful only if believing them changes what the player does.

Do not build a clue-management bureaucracy.

## One-day scenario anchors

Current settled material:

- **Evelyn**: sharp, funny, charismatic, opinionated, physically limited, socially active, and not reducible to a diagnosis.
- **Jenny**: friendly, bubbly non-medical home helper who genuinely likes Evelyn at first.
- **Robert**: Evelyn's deceased second husband.
- **Butter pecan ice cream**: one of Robert's favorites and the first subtle repeated-request thread.
- **Church/community mail**: ordinary social mail that establishes Evelyn's life outside her family.
- **Michael**: boundary-limited contact. Working message:
  > Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again.

The first Robert inconsistency must remain ambiguous. Do not label it dementia or turn it into an obvious clue.

## What the first prototype must prove

Watch for:

- "I can't do both."
- "Wait, that changes things."
- "I should have noticed that."
- "I trusted the wrong thing."
- "I caused that."
- curiosity about another turn

The prototype should create at least:
- one meaningful sacrifice
- one player-caused consequence
- one provenance comparison
- one limited Jenny visit
- one memory-preservation decision
- one moment where new information changes an earlier interpretation

The critical question is not whether the story is interesting.

It is:

> **Did the player want another turn?**

## Important design warnings

### Do not make ordinary care feel like office work
A mundane interaction should do at least one useful job:
- establish baseline behavior
- reveal personality
- teach a mechanic
- create a future comparison point
- introduce a relationship
- create pressure
- add subtext

Not every grocery list needs to hide a clue.

### Do not over-intellectualize the AI concepts
The player should care about a lossy summary because the lost content mattered to Evelyn, not because the game lectures about summarization.

### Do not make every interaction morally heavy
Funny, mundane, affectionate, irritating, and ordinary moments are necessary.

### Do not use random intermediary failure
If Jenny cannot do something, the reason must be legible:
- time
- role
- access
- Evelyn refusal
- unavailable information

### Do not rely on live AI for fun
The deterministic scenario itself must be engaging.

## AI stance

The project is deterministic-first.

Core rule:

> **Software controls reality. AI controls interpretation.**

The game must work without live generation.

Future AI-backed features must earn their complexity by solving a demonstrated problem.

Potential seams to test later:
- varied natural language -> bounded actions
- constrained synthesis across sources
- multiple canon-safe interpretations
- adaptive scaffolding
- intentionally lossy summaries

Generated output may never create canon, clues, diagnoses, relationships, permissions, consequences, or state transitions.

## Broader Evelyn story remains preserved

Future Episode 1 design still includes:
- gradual dementia progression
- therapeutic continuity and lost insight
- Anna's wedding boundary violation
- Michael's family boundary arc
- Robert's enabling history
- AI substitution
- context/memory instability
- multiple relationship outcomes and endings

These are **not current implementation scope**.

Do not delete or rewrite those broader docs simply because the prototype scope narrowed.

## Anthology status

Treat the active project as **Evelyn** for now.

Agent Seven, inherited AI memory, institutional memory, digital immortality, childhood archive, last witness, and other anthology seeds remain future ideas only.

The anthology earns itself if Evelyn works as a game.

## Existing implementation history

The repository contains:
- the older deterministic Agent Seven/security prototype
- an initial AI intent-classification layer
- broader Evelyn state/action/design architecture

Preserve useful foundations.

Do not assume older UI/story flow is the desired Evelyn experience.

If another coding agent reports local/unpushed work from a previous paused session, inspect and classify it before discarding anything:
- reusable now
- reusable later
- too broad for current experiment

## Current implementation gate

Before writing more gameplay code:

1. Run the five-minute paper playtest (`docs/prototypes/PORTFOLIO_PLAYTEST_KIT.md`). *(Earlier wording: run the manual one-day prototype.)*
2. Record results with the kit's Observation Sheet. *(Earlier wording: `EVELYN_PLAYTEST_SCORECARD.md`, now superseded.)*
3. Identify what felt fun, what felt like work, and what the player tried to do.
4. Revise the loop.
5. Repeat cheaply if necessary.
6. Only when Paige explicitly approves, build the smallest deterministic digital version of the proven loop.

Do not jump directly from these docs into full Episode 1 implementation.

## Longer-term design principle

> **At first, you learn to use your AI capabilities. Later, you learn when not to trust them.**

Possible strengths that later become weaknesses:
- synthesis -> erased disagreement
- pattern recognition -> overconfidence
- monitoring -> noise
- compression -> lost humanity
- polished communication -> substitution for Evelyn
- a model of Evelyn -> mistaken for Evelyn herself

Do not explain this thesis to the player. Let gameplay produce it.

## Production boundary

Nothing in these instructions authorizes:
- merging to `main`
- production deployment
- publishing a public release

Those require Paige's explicit current approval.

## Implementation and repository state

For the state of the code, the branches, the test suite, and how the build chat relates to the story chat, see `docs/handoffs/BUILD_HANDOFF.md`.

The one-day prototype documents under `docs/prototypes/` (`EVELYN_CORE_LOOP_PROTOTYPE.md`, the event map, the manual playtest guide, the scorecard and the fixture) are **superseded** by `docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md`, and are marked as such. `docs/CORE_LOOP_PROTOTYPE_PLAN.md` (the build chat's heavier one-day plan) is superseded too.
