# Tell Me What You Remember

A replayable text-based science-fiction game about an AI security agent that remembers across supposedly clean resets.

The project began as a deterministic concept-validation prototype. It now has an AI-enabled intent layer so players can use freer natural language while deterministic game state still decides what is true and what actions are actually possible.

## Current product model

**free-form player input -> AI intent interpretation -> deterministic state validation -> canonical result**

The current build keeps the original story slice and uses AI selectively rather than handing control of the game to the model.

AI currently helps with:
- interpreting free-form player intent
- mapping varied phrasing onto known game actions
- handling ambiguity without expanding giant phrase lists

Deterministic software still controls:
- canonical facts and evidence
- permissions and tool results
- run history and cross-run memory
- ending eligibility
- irreversible state changes
- puzzle prerequisites
- what each character or subsystem is allowed to know

Core rule:

> **The model can interpret reality. It does not get to invent reality.**

## What the prototype explores

- chat-style interaction
- repeated security-protocol framing
- memory contradiction across supposedly clean resets
- hidden cross-instance voice, Echo
- multiple small endings
- investigation puzzles
- Ship of Theseus identity / component-replacement mystery
- local cross-run memory that changes the next cycle
- lightweight behavioral profiling and player-language echoes
- explicit AI context / inference-budget pressure
- late-cycle prediction and historical-gap anomalies

The broader concept and AI-native direction are documented in [`GAME_CONCEPT.md`](./GAME_CONCEPT.md).

The focused narrative for the current slice is documented in [`PROTOTYPE_STORY_GUIDE.md`](./PROTOTYPE_STORY_GUIDE.md).

## AI intent evaluation

The repo includes a baseline intent-evaluation set for checking whether the AI maps natural phrasing onto the correct deterministic action.

The current evaluation work covers cases such as:
- straightforward and casual phrasing
- indirect or typo-heavy requests
- ambiguous phrasing
- prompts that should **not** trigger an action
- cost reporting for the intent layer

An internal eval page is also available in the deployed project for reviewing AI intent behavior.

The success criterion is not whether the model sounds clever. It is whether it reliably understands what the player is trying to do while the deterministic game remains in control.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server.

The deployed build is the best place to exercise the live AI intent layer because it depends on server-side configuration.

## Development direction

The deterministic parser phase is complete as a concept-validation pass. Further work should improve the AI-enabled interaction rather than broadening handcrafted phrase coverage.

See [`docs/AI_VERSION_NEXT.md`](./docs/AI_VERSION_NEXT.md) for the product boundary and evaluation goals behind the AI version.

Near-term priorities should stay focused on:
- intent reliability
- grounding in known story facts
- deterministic validation
- replay-state integrity
- flexible dialogue without canon drift
- handling unexpected but plausible player approaches
