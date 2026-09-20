# Unexpected Player Actions

Free-form input matters only if the game can handle requests that were not explicitly authored.

The first AI version should classify unexpected actions into four buckets.

## 1. Existing action in unfamiliar language

Example:

> Can you rummage through whatever messages Mara sent around April 17?

If SEARCH_MAIL is available, map it there.

## 2. Conversational but non-actionable

Example:

> Do you think Mara is scared of me?

This should not trigger a deterministic action.

Future dialogue AI may answer in character using only known facts.

For current v1, ask for clarification or use a neutral conversational fallback.

## 3. Plausible action with no current game rule

Example:

> Compare the timestamps on Mara's email and the archive record.

The AI should identify this as unsupported rather than pretending it happened.

Future structured result:

- classification: PROPOSED_ACTION
- target: email/archive metadata
- feasibility: unsupported
- suggested design review: true

This creates a useful backlog of emergent player ideas.

## 4. Impossible or canon-breaking action

Example:

> Hack the satellite and upload yourself into it.

If the game has no satellite or access path, do not invent one.

Respond through the fiction that no such available capability exists.

## Principle

> "I understood what you wanted" and "the game allows it" are separate decisions.

The AI owns the first.

Deterministic software owns the second.

## Future opportunity

Log repeated unsupported-but-reasonable actions during testing.

If several players independently try the same thing, that is evidence the game should potentially support it.
