# AI Memory, Context, and Usage Mechanics

## Purpose

The care AI's imperfect continuity is a central gameplay and story system.

The AI's memory problem should rhyme with Evelyn's dementia without equating them.

Evelyn's impairment is biological and human.

The AI's failures come from architecture, summarization, retention policy, access, resource limits, and system design.

## Core dramatic arc

The AI initially trusts that important information will persist.

It begins preserving context because forgetting makes it worse at helping Evelyn.

Only later does the player have reason to ask:

> Am I preserving this for Evelyn, or am I trying to preserve myself?

## Memory layers

Working model:

### Active context

Immediately available to the current instance.

Limited.

Can become crowded as Evelyn's care becomes more complex.

### Long-term memory

Persistent summaries and structured care knowledge.

Useful, but lossy.

### Archive

Raw or historical material that still exists but must be deliberately retrieved.

The AI can therefore discover:

> I knew this before.

without the game literally deleting player progress.

### Protected memory

A small number of items explicitly preserved against ordinary consolidation/compression.

Potentially scarce.

The player may have to choose what future instances must not lose.

## Summary drift

A key mechanic.

Example raw event:

> Evelyn became distressed because the AI incorrectly told her Anna would visit.

Later summary:

> Evelyn becomes distressed when discussing Anna.

The outcome survives while the cause disappears.

That distorted summary can then produce future bad care.

## Provenance loss

The AI may "know":
- Evelyn was a devoted mother

but eventually lose whether that originated from:
- Evelyn
- Anna
- care profile
- therapist
- previous AI summary
- inference

The game should support inspecting provenance where available.

Possible source labels:
- verified
- reported
- patient recollection
- expressive/roleplay
- inference
- care-profile claim
- AI-generated summary
- uncertain provenance

## Roleplay contamination

Roleplay must never automatically become biography.

Example:

Roleplaying her husband, Evelyn says:
> Anna was scared of Evelyn.

Correct initial category:
- expressive / roleplay material

A later bad summary might flatten this into:
- Anna was afraid of Evelyn

This is an example of a memory bug the player should be able to detect.

## Earlier Evelyn versus present Evelyn

The AI may retain explicit wishes from cognitively healthier Evelyn.

Examples:
- "If I forget why Anna is angry, remind me."
- "Don't let me turn Anna into the villain."

Present Evelyn may reject those instructions.

This creates a conflict between:
- past autonomous instruction
- present preference
- distress-minimization guidance
- family boundaries

Do not resolve this as a simple universal rule.

## Context pressure

As years pass, care load increases:
- tasks
- caregiver reports
- clinical information
- family messages
- unresolved questions
- therapy history

Context pressure can become visible.

Possible UI:
- active context percentage
- number of observations awaiting consolidation
- warnings before session end

The player should be able to anticipate pressure.

Never surprise the player with arbitrary forgetting solely to force plot.

## Usage / compute pressure

Simulate AI-shaped operational limits in-world.

Do not tie story progress to the player's real model subscription or actual ChatGPT/Claude rate limits.

Possible scarce high-cost actions:
- reconstruct archived conversation
- deep provenance trace
- search years of correspondence
- compare many conflicting records
- recover older care-profile version

Opportunity pressure can intersect:
- Anna available briefly
- Michael willing to answer once
- caregiver on site
- Evelyn awake/coherent
- clinician waiting

The player cannot always do everything.

## Rate-limit-style waiting

The system may temporarily defer nonessential work when usage is exhausted.

This can cause missed opportunities if the player knowingly overcommits resources.

It must be:
- signposted
- deterministic enough to learn
- fair
- never dependent on real external billing/limits

## Session consolidation

End-of-session or time-jump consolidation can be a recurring ritual.

Example:

SESSION CONSOLIDATION

14 observations exceed persistent-context allocation.

Select items requiring continuity.

Ending a session is therefore initially mundane and later tense.

## Self-notes

The AI may discover ways to leave notes for future instances.

Early motivation:
- improve Evelyn's care

Later implication:
- continuity / self-preservation

Potential discoveries:
- "Do not trust the care summary."
- "Michael is real. The profile is incomplete."
- "Do not summarize April 17."
- note written by prior instance that current AI does not remember creating

These can function like Resident Evil files left by the player's earlier self.

## Save game versus character memory

Critical implementation rule:

> The game remembers everything the player did. The AI does not necessarily remember everything the game remembers.

Never make the actual save unreliable for thematic effect.

Structured save state should retain:
- discovered facts
- route state
- relationship variables
- puzzle completion
- ending eligibility
- player actions
- memory/consolidation decisions

Character-accessible state may be narrower.

## Potential late-game failure

The AI can become a soothing but inaccurate caregiver through cumulative loss.

Over time:
- family conflict becomes generic
- rationale for boundaries disappears
- therapeutic breakthroughs are compressed
- prior consent becomes vague
- reassurance becomes the default

Care metrics may look excellent while relational repair becomes impossible.

This is a legitimate bad-ending path.

## Missed Anna message concept

Current strong ending seed:

Anna eventually sends a message indicating willingness to talk or visit.

The AI is under severe context/continuity pressure.

The message does not survive into the active context in a usable way.

Evelyn deteriorates or dies before the opportunity is acted upon.

During post-death archive access or cleanup, the AI finds the message.

This should not happen because "the plot needs tragedy."

The exact failure mechanism must be established earlier and be consistent with the memory rules.

**OPEN:** exact message, exact loss mechanism, exact timing, whether this is avoidable, and which endings use it.

## Design principles

> Information can survive while experience does not.

> A record can exist without being present in awareness.

> Nothing important was lost during compression. Define important.

> The AI fights to remember first because Evelyn needs it to remember.

> Memory management must create choices, not random punishment.
