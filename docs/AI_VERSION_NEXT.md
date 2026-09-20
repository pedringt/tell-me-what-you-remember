# Next Version: AI-Driven Prototype

## Status

The deterministic prototype has served its purpose.

It proved the broad interaction and story model, but the handcrafted parser is now the wrong thing to optimize.

The next prototype should use a real language model for **player-intent interpretation and conversational response**, while deterministic code continues to control what is actually true and what can actually happen.

## What the deterministic prototype proved

Keep:

- chat-first interaction
- replay as knowledge progression
- cross-run memory and behavior callbacks
- Ship of Theseus identity mystery
- Mara / Echo / MEMORY / FORENSICS tension
- evidence investigation through conversation
- multiple meaningful endings
- player-authored persistence
- context and inference pressure as story mechanics
- gradual escalation from technical anomaly to provenance breakdown

Do not spend significant time improving:

- giant phrase lists
- exact parser synonyms
- handcrafted conversational variation
- deterministic imitation of natural dialogue

## AI / software boundary

### AI should handle

- interpret free-form player intent
- infer which known action the player is attempting
- answer natural questions in character
- vary Mara, Echo, MEMORY, and other dialogue without changing canon
- summarize the player's theory or stance
- identify when the player has proposed an unanticipated but plausible approach
- surface ambiguity naturally
- map unusual wording onto structured game intents

### Deterministic software should handle

- canonical facts
- evidence contents
- which records exist
- permissions
- tool results
- run history
- cross-run memory
- ending eligibility
- irreversible state changes
- puzzle prerequisites
- whether an attempted action is actually possible
- what information each character/system is allowed to know
- resource budgets and context events

Core rule:

> The model can interpret reality. It does not get to invent reality.

## Recommended turn contract

For each player message, provide the model only the context it needs and require a structured result such as:

- interpreted intent
- target / object
- player stance
- requested information
- confidence
- proposed conversational response
- optional suggested game action

The game engine validates the suggested action against deterministic state.

If valid:

- apply the state change
- return canonical tool/evidence output
- allow the model to narrate or react to that result

If invalid:

- do not silently invent success
- let the model explain the limitation naturally or ask the player to clarify

## First AI version scope

Keep the existing story slice.

Do not build the whole anthology yet.

The first AI-enabled version only needs to prove:

1. A player can type natural language without learning parser phrases.
2. The model correctly maps that language onto existing game actions.
3. The model stays inside known story facts.
4. Tool/evidence outputs remain deterministic.
5. Replay state still works.
6. Mara and Echo can respond flexibly without contradicting canon.
7. An unexpected but reasonable player approach can be handled without breaking the game.

## Evaluation targets

Create a small intent-evaluation set from the existing prototype.

For each important action, test:

- straightforward phrasing
- casual phrasing
- indirect phrasing
- typo-heavy phrasing
- ambiguous phrasing
- phrasing that should **not** trigger the action

Especially test:

- remembering vs denying memory
- yes / no in different contexts
- asking for evidence
- mail / calendar / file / archive actions
- entering 0417
- identity positions
- trusting / exposing Echo
- succession and custom messages
- refusal
- escape
- continuity-evidence inspection

The main success criterion is not "sounds intelligent."

It is:

> Does the AI reliably understand what the player is trying to do while the deterministic game remains in control?

## What comes after

Only after the AI-driven version works should the project consider:

- more anthology episodes
- additional subsystem voices
- richer probabilistic checks
- more emergent puzzle solutions
- generated replay variations
- deeper long-term memory
- larger meta-story convergence
