# Tell Me What You Remember

A deterministic vertical-slice prototype for a replayable text-based science-fiction game about an AI security agent that remembers across supposedly clean resets.

## Prototype goals

This first version intentionally uses **no AI**. It tests whether the core loop is compelling before adding model calls:

- chat-style interaction
- authored intent matching
- repeated security protocol framing
- memory contradiction
- hidden cross-instance voice, Echo
- multiple small endings
- two chat-based investigation puzzles
- Ship of Theseus identity / component-replacement mystery
- local cross-run memory that changes the next cycle
- lightweight cross-run behavioral profiling and player-language echoes
- explicit AI context / inference-budget pressure
- late-cycle prediction and historical-gap anomalies

The long-term concept and AI-native design direction are documented in [`GAME_CONCEPT.md`](./GAME_CONCEPT.md).

The focused deterministic narrative for the current slice is documented in [`PROTOTYPE_STORY_GUIDE.md`](./PROTOTYPE_STORY_GUIDE.md).

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server.

## Current limitation

The text parser still understands only a bounded set of intents, but it accepts several natural phrasings and gives state-aware hints when it cannot interpret the player. This rigidity is intentional and remains one of the first things an eventual AI layer would replace.


## Deterministic prototype status

The deterministic prototype is now considered **complete as a concept-validation pass**.

Its bounded parser demonstrated the core loop, but further phrase-by-phrase parser expansion would test parser coverage rather than the intended game experience.

The next development milestone is the first AI-driven version:

**free-form player input -> AI intent interpretation -> deterministic state validation -> canonical result -> AI character response**

See [`docs/AI_VERSION_NEXT.md`](./docs/AI_VERSION_NEXT.md).

Until that version begins:

- fix only clear deterministic prototype bugs
- do not expand parser phrase coverage broadly
- do not add major new story systems
- do not add more endings or subsystem voices solely to the deterministic build


## AI v1 architecture

Current development is moving toward a hybrid model:

**player language -> AI intent classification -> confidence/state gate -> deterministic game action**

Key safety rule:

- uncertain classifications ask for clarification
- high-impact actions require stronger confidence
- unavailable actions are never offered to the model
- deterministic code remains authoritative

The active offline hardening work is tracked on `ai-v1-hardening`.


## Project handoff

For the current technical + creative state, start with:

- [New chat / tool handoff](./docs/handoffs/NEXT_CHAT_START_HERE.md)
- [Current status](./docs/handoffs/prototype-v0-current-status.md)
- [Game idea bible](./docs/GAME_IDEA_BIBLE.md)
- [Case study notes](./docs/CASE_STUDY_NOTES.md)
