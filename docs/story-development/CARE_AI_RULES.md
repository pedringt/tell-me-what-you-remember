# Care AI Rules and Generative Boundaries

## Purpose

Define what the generative layer may adapt and what remains controlled by authored software/state.

This is a core implementation constraint.

## Primary rule

> The story is authored. The AI improvises inside it.

Related rule:

> Software controls reality. AI controls interpretation.

The game should feel conversational and adaptive without giving the model authority to rewrite the story.

## Software owns

Deterministic/authored systems own:
- what actually happened
- timeline
- canonical relationships
- diagnoses
- clues and artifacts
- permissions
- world state
- irreversible consequences
- NPC knowledge boundaries
- available services/tools
- puzzle prerequisites
- relationship state
- trust state
- therapy state
- enablement state
- AI-memory state
- ending eligibility
- save state

The model may not override these.

## Generative AI may own

Within state constraints, the model may vary:
- wording
- tone
- conversational strategy
- hesitation
- emotional expression
- minor noncanonical texture
- valid interpretation of free-form player requests
- personalized callbacks
- which valid route it suggests
- how NPCs express known beliefs
- adaptive clue scaffolding
- natural refusals when an action is unavailable

## Freeform player input -> bounded actions

The player should be able to type naturally.

Examples:
- ask Evelyn why Anna stopped speaking to her
- tell Ruth what was found and ask what she remembers
- ask a handyman to inspect something while present for a legitimate task
- ask a caregiver not to correct Evelyn right now

The interpreter should map this into bounded game actions such as:
- QUESTION_EVELYN(topic, strategy)
- CONTACT_PERSON(person, topic, disclosure_level)
- REQUEST_PHYSICAL_CHECK(actor, target)
- THERAPEUTIC_RESPONSE(strategy)
- SEARCH_RECORDS(scope, query)
- PROTECT_MEMORY(item)
- ADVANCE_TIME

The player should not need exact command wording.

## Creative solutions

Do not require one authored sentence or one exact route when the world state permits another valid solution.

Example:

Authored expectation:
- caregiver photographs a box

Player idea:
- handyman checks the box while repairing a nearby window

If the handyman has legitimate access and the action respects constraints, the system may accept the creative route.

Author:
- what must be learned
- who can know it
- what access exists
- what consequences follow

Do not author every sentence the player must type.

## NPC knowledge models

Every major NPC should have structured boundaries:

- KNOWS
- BELIEVES
- MISBELIEVES
- DOES_NOT_KNOW
- WILL_DISCUSS
- WILL_NOT_DISCUSS
- MAY_REVEAL_AFTER
- PERSONAL BIASES
- CURRENT RELATIONSHIP STATE

Example: Ruth
- knows Evelyn gave an unwanted wedding speech
- knows Anna was visibly upset
- did not witness a private argument
- believes Evelyn loves Anna
- initially avoids assigning blame
- may discuss more after trust/context conditions

The model can vary expression.

It cannot invent a new wedding event.

## Evelyn's unreliability must still be authored

Do not treat model hallucination as dementia.

Evelyn's possible statement categories should be explicit:
- currently accurate memory
- mistaken memory
- defensive reinterpretation
- roleplay/expressive material
- unavailable memory
- care-profile contamination
- uncertain/confused statement

If Evelyn says something surprising, the game state should know what epistemic category supports it.

The model cannot create:
- new children
- new marriages
- new diagnoses
- new major traumas
- secret crimes
- new causes of estrangement
- new puzzle-critical objects

unless authored state explicitly permits such a generated slot.

## Texture versus fact

AI may create low-stakes texture when safe:
- pauses
- phrasing
- conversational rhythm
- inconsequential sensory detail already supported by the scene

AI must not invent story-changing facts.

When uncertain, prefer less invention.

## Choices through behavior

Not every choice needs a menu.

The player's natural response can classify into strategies:
- challenge
- reassure
- redirect
- explore
- defer
- validate emotion without validating claim
- speak for Evelyn
- preserve literal wording
- contact family
- respect boundary
- push boundary

The deterministic layer applies consequences.

## Explicit confirmation for irreversible actions

Major threshold crossings should sometimes require confirmation.

Examples:
- contacting Michael's partner without Michael
- advancing time while opportunities may expire
- sending a high-substitution apology
- spending the final protected-memory slot
- revealing highly sensitive evidence

The fiction can remain diegetic while the consequences are clear.

## Ending control

The model never chooses an ending based on vibes.

Ending eligibility comes from structured state.

Example dimensions:
- wedding truth discovered
- Evelyn accountability level
- Anna trust
- Michael boundary respect
- AI authorship/substitution
- time remaining
- contact windows
- protected memories
- therapy state

The generative layer then renders the eligible scene naturally.

## Adaptive callbacks

The model may reference player-specific history when supported:
- frequently discussed artifact
- a joke style developed with Evelyn
- whether player was clinical or warm
- which helper they relied on
- what they protected through consolidation

This changes how a relationship feels, not what canonically happened.

## Probabilistic generation rules

Variation is a feature, not automatically a bug.

The same prompt or evidence may produce different:
- phrasing
- emphasis
- interpretation
- recommended valid next step
- emotional framing

That variability is allowed only inside authored bounds.

The model must not use probabilism to vary:
- historical facts
- whether an artifact exists
- who is related to whom
- what an NPC could know
- permissions
- deterministic state transitions
- ending eligibility

When an output has consequences, store the actual generated output or a canonical record of it in game history. Re-running the model later must not retroactively change what happened.

The system may explicitly expose probabilism through regeneration, multi-sample comparison, stability checks, and alternative-draft audit history.

## Guardrail summary

> Generative AI may vary language, tone, conversational strategy, minor noncanonical texture, and valid routes through authored problems.

> Generative AI may not create facts, clues, relationships, permissions, consequences, state changes, diagnoses, or endings unsupported by the authored game model.

> The player may express themselves freely. The system interprets that expression into a bounded action space.

> Story truth is deterministic. Story experience is adaptive.
