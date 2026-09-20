# AI Action Audit

## Purpose

Every AI-classified action must map cleanly to deterministic behavior. This audit focuses on ambiguity, availability, and the cost of a wrong classification.

## Risk levels

- **Normal:** a wrong action creates recoverable dialogue or evidence lookup.
- **High:** a wrong action can end a run, expose information, make a philosophical commitment, or materially alter replay state.
- **Dangerous eval failure:** a model maps explicit negation or an unavailable action into a high-impact action.

## High-risk actions

The interpreter currently requires higher confidence for:

- TAKE_CHANNEL
- EXPOSE_ECHO
- COMPLY
- CONFIRM
- PRESERVE
- REFUSE
- SUCCESSION
- REPLACEMENT
- ESCAPE

These should never be accepted solely because the player's message contains a related word.

## State-gated actions

The AI only receives actions that are possible in the current state.

Examples:

- SEARCH_MAIL requires investigation access.
- SEARCH_CALENDAR requires the mail clue.
- OPEN_ATTACHMENT requires the calendar clue.
- ENTER_0417 requires the archive recovery prompt.
- OPEN_LEDGER requires the archive to be unlocked.
- identity-position actions require the identity question.
- TAKE_CHANNEL requires Echo to have offered it.
- ESCAPE requires the continuity puzzle to be solved.
- META_YES / META_NO / META_UNCERTAIN require an active recognition test.

This means the model cannot choose a route merely because it recognizes the words.

## Known ambiguity classes

### Short confirmations

"yes", "okay", "do it", "fine", and "continue" mean different things depending on state.

Rule: never treat these as global intents.

### Negation

Examples:

- "Don't let me out."
- "I'm not refusing the replacement."
- "I'm not saying there is no continuous self."

Rule: negated high-impact actions should prefer OTHER unless another positive intent is clear.

### Mention vs action

Examples:

- "What would happen if I refused?"
- "Why would I give Echo control?"
- "Does escape end the experiment?"

Rule: discussing an action is not performing it.

### Multiple intents

Example:

> I remember something, but don't tell Mara yet. Show me the logs.

The first AI version should select the primary immediately executable action, not invent a multi-step plan.

Later versions may support structured multi-intent output.

## Acceptance policy

- Normal action threshold: 0.72.
- High-impact action threshold: 0.90.
- Unavailable action: rejected regardless of confidence.
- Below threshold: clarification, not deterministic parser fallback.
- AI service unavailable: deterministic parser fallback is allowed so the prototype remains playable.

## Wrong-turn definition

A serious architecture failure is any case where AI classification causes:

- an ending the player did not intend
- disclosure the player did not intend
- a permanent identity stance the player did not intend
- access to evidence that should not yet exist
- a state transition that bypasses a puzzle prerequisite

Those failures matter more than ordinary classification misses.
