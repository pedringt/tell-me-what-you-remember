# Evelyn Core-Loop Prototype

**Status:** Active experiment - current implementation target  
**Scope:** One in-game day, approximately 15-20 minutes  
**Purpose:** Determine whether the core interaction is engaging before resuming Episode 1 production.

## Core question

> After one ordinary day with Evelyn, does the player want another turn?

This prototype is not a miniature version of the whole episode. It is a focused experiment that tests whether the player enjoys operating as a care AI under incomplete information and limited bandwidth.

## Current core loop

> Event -> prioritize -> investigate/delegate -> receive imperfect information -> synthesize -> update working model -> preserve/compress memory -> time advances

The player should get better at:
- deciding what deserves attention
- delegating useful physical-world tasks
- comparing conflicting sources
- distinguishing verified records from reported claims
- noticing patterns without overclaiming certainty
- deciding what deserves exact preservation

## Three primary mechanics

### 1. Attention

The player cannot fully pursue every thread.

Use forecastable constraints instead of a generic attention meter:
- deadlines
- visit windows
- limited human availability
- mutually exclusive actions
- time advancement

The prototype must contain at least one genuine "I cannot do both" decision.

### 2. Delegation

Jenny is the main physical-world interface.

Jenny:
- has a visible visit window
- can complete only a small number of meaningful tasks
- has clear role boundaries
- reports what she observed, not omniscient truth
- may refuse requests for explicit, understandable reasons

Do not use random failure.

### 3. Memory

Use one meaningful consolidation event only.

The player must choose which information remains at full fidelity and which becomes compressed. The correct future value of those items should not be obvious at selection time.

The real save remains complete. Only the AI character's accessible memory is lossy.

## Supporting mechanic: provenance

Every meaningful claim should expose source category.

Examples:
- verified record
- Evelyn recollection
- Jenny observation
- Michael message
- AI inference
- compressed summary

The game should preserve the difference between:
- "Evelyn said X"
- "Jenny observed X"
- "the system verified X"
- "the AI currently believes X"

## Supporting mechanic: working interpretations

At most 2-3 active interpretations.

They are useful only if they affect behavior.

Possible first-day interpretations:
- Evelyn is repeating a completed request.
- Evelyn is speaking about Robert out of habit.
- Evelyn may be confusing past and present regarding Robert.

Avoid clue-board bookkeeping.

## Characters

### Evelyn

Evelyn should feel like a person before she feels like a case.

Use a few low-stakes personality details in ordinary interactions. Candidate details may include:
- strong opinions about household routines
- competitive crossword behavior
- dislike of canned AI sympathy language
- nosy but affectionate questions for Jenny
- embarrassing TV taste she denies

Only a small number should become prototype canon.

### Jenny

Friendly, bubbly, practical, and genuinely inclined to like Evelyn.

Current role:
- groceries
- mail scanning
- light household tasks
- simple physical verification

Long-term helper burnout/reassignment is not part of this prototype.

### Michael

Present only through the existing boundary message and related decision pressure.

Do not expose the full family history.

Working message:

> Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again.

## Settled opening content

- Robert is Evelyn's deceased second husband.
- Butter pecan ice cream was one of Robert's favorites.
- Evelyn asks the AI to make sure Robert gets butter pecan ice cream.
- The request is handled.
- Evelyn asks again later.
- Jenny may later report hearing Evelyn speak about Robert in the present tense.
- First mail scan is ordinary church/community mail that creates a social/calendar follow-up.

The first Robert inconsistency must remain deniable. Do not label it as dementia or a solved mystery.

## Pressure rule

At least one decision must make another option unavailable or weaker.

Examples:
- Jenny can check the grocery issue or another physical concern, but not both.
- A time-sensitive RSVP competes with investigating an anomaly.
- A response opportunity closes after time advances.
- One exact memory can be protected only by allowing another to compress.

Pressure should be understandable before the choice.

## Consequence rule

At least one later state must differ specifically because of player prioritization.

Good:
- the player has weaker evidence because Jenny was assigned elsewhere
- a deadline closes
- a duplicate order is created
- one memory remains exact while another becomes lossy

Bad:
- hidden punishment for failing to inspect an obscure clue
- arbitrary random failure
- a prewritten consequence that happens regardless of player choice

## Natural language rule

The prototype must work deterministically.

If natural language is used later:

> natural-language surface -> bounded authored action -> deterministic state change

Freeform input must never create canon, clues, diagnoses, relationships, permissions, consequences, or world-state changes.

## Interface direction

Do not make chat the whole game.

Useful surfaces:
- INBOX / EVENTS
- OPEN ITEMS
- PEOPLE
- EVIDENCE
- WORKING MODEL
- MEMORY
- ACTIONS

The first digital version should optimize for legibility, not polish.

## Success criteria

The prototype succeeds if testers:
- understand what deserves attention
- feel at least one meaningful tradeoff
- understand source differences
- feel that a prioritization choice changed what happened
- find memory preservation meaningful
- care about at least one mundane Evelyn detail
- do not feel like they are doing office work
- want another turn

The prototype fails if the main reaction is:

> "The story is interesting, but playing it feels like work."

## Explicit non-goals

Do not implement yet:
- Anna wedding story
- dementia diagnosis progression
- full therapy arc
- multiple endings
- full replay system
- helper turnover
- anthology episodes
- advanced monitoring
- probabilistic multi-sample analysis
- full memory economy
- broad generative NPC simulation

## Development gate

Do not resume the broader Episode 1 build until Paige explicitly approves it after manual/paper playtesting.

The game comes first. Clever AI metaphors do not justify unfun mechanics.
