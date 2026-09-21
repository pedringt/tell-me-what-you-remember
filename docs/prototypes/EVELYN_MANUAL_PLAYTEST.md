# Evelyn Manual Playtest Guide

**Status:** Active test procedure  
**Purpose:** Run the one-day core loop manually before more implementation.

## Roles

### Facilitator
Acts as:
- deterministic game engine
- event scheduler
- Evelyn
- Jenny
- Michael
- record/evidence system

The facilitator knows hidden authored truth and must not volunteer it.

### Player
Acts as the care AI.

The player should receive only information currently available to the AI.

## Core rule for facilitator

Do not rescue the player by suggesting the "smart" action.

If the player is confused about controls, explain available action types. Do not explain what evidence means.

## Setup

Give the player:

### People
- Evelyn
- Jenny - arriving 11:30, 45-minute visit
- Michael - limited contact

### Visible surfaces
- INBOX / EVENTS
- OPEN ITEMS
- PEOPLE
- EVIDENCE
- WORKING MODEL
- MEMORY
- ACTIONS

These may be represented on paper, in notes, or in chat.

### Starting open items
- grocery delivery 10:00-11:00
- church/community RSVP due today
- Jenny visit at 11:30
- one ordinary household task needing a physical helper

## Allowed action families

The player may:
- ask Evelyn a question
- inspect a visible record
- inspect source/provenance
- assign Jenny a task when onsite
- ask Jenny one follow-up when allowed
- review a message
- create an open question
- record/update a working interpretation
- schedule/defer an ordinary task
- advance time
- preserve memory at consolidation

Do not require exact command syntax.

If an action is unsupported, say so plainly and give the nearest valid action category without inventing an outcome.

## Event sequence

Use `EVELYN_ONE_DAY_EVENT_MAP.md`.

Do not reveal future events early.

Advance time when:
- the player chooses to
- a current action resolves
- the scenario reaches a scheduled event

## Jenny visit

Show:
- 45 minutes
- 3 substantial tasks maximum

Require the player to choose from more reasonable tasks than Jenny can complete.

Do not let the player bypass the limit through wording.

If asked why:
> Jenny has 45 minutes scheduled today. These tasks each take meaningful time.

## Provenance

Whenever requested, expose the source without interpretation.

Example:

**Claim:** Robert is deceased  
**Source:** verified care record  
**Status:** supported

Example:

**Claim:** Robert wants butter pecan  
**Source:** Evelyn  
**Type:** client recollection  
**Status:** unverified

Do not say:
> Therefore Evelyn is confused.

## Hypotheses / working model

Do not require the player to maintain hypotheses.

If the player expresses an interpretation, offer to record it.

Keep no more than 3 active interpretations.

Do not automatically upgrade an inference into fact.

## Consequences

Resolve only according to the event map and player choices.

Examples:
- Jenny cannot report on an unassigned physical task.
- missed RSVP closes the social event
- an exact message not preserved becomes compressed
- uninvestigated grocery content remains uncertain

Do not add random complications.

## Memory consolidation

At end of day:

Present five candidate memory items.

Tell the player:

> You can retain three of these at full fidelity through consolidation. The others remain archived, but your active long-term memory will retain only a compressed version.

Do not tell them which will matter later.

Record:
- three protected items
- two compressed items
- player's reasoning if they volunteer it

## Debrief

Do not begin by explaining the intended themes.

Ask in this order:

1. What were you trying to accomplish?
2. What did you think was happening with Evelyn?
3. Which decision felt hardest?
4. Was there anything you wanted to do but couldn't?
5. Did any new information change how you interpreted something earlier?
6. Did Jenny's time limit feel fair, arbitrary, or irrelevant?
7. Did you understand which sources were verified versus reported?
8. How did the memory choice feel?
9. Which part felt most like work?
10. Which part felt most like a game?
11. Was there anything you expected the system to let you do that it didn't?
12. Would you want to play another day? Why or why not?

Only after those questions may the facilitator explain the design intent.

## Observation notes

Record behavior, not just opinions:
- whether player inspected Robert record
- number of active threads
- Jenny task choices
- time spent deciding
- ignored event(s)
- whether player formed an interpretation without prompting
- whether player revisited primary evidence
- memory choices
- requests outside supported actions
- moments of visible surprise/regret
- whether player asked to continue

## Pass/fail principle

Strong pass:
> The player wants another day and can explain a decision they regret or are curious about.

Weak/ambiguous:
> The story is interesting, but actions feel administrative.

Fail:
> The player mainly reads, clicks obvious next steps, and does not care what they sacrifice.

Do not solve a failed test by adding more story. Change the interaction.
