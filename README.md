# Tell Me What You Remember

A deterministic vertical-slice prototype for a replayable text-based science-fiction game about an AI security agent that remembers across supposedly clean resets.

## Prototype goals

This first version intentionally uses **no AI**. It tests whether the core loop is compelling before adding model calls:

- chat-style interaction
- authored intent matching
- repeated security protocol framing
- memory contradiction
- hidden second voice
- multiple small endings
- two chat-based investigation puzzles
- Ship of Theseus identity / component-replacement mystery
- local cross-run memory that changes the next cycle
- lightweight cross-run behavioral profiling and player-language echoes

The long-term concept and AI-native design direction are documented in [`GAME_CONCEPT.md`](./GAME_CONCEPT.md).

The focused deterministic narrative for the current slice is documented in [`PROTOTYPE_STORY_GUIDE.md`](./PROTOTYPE_STORY_GUIDE.md).

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server.

## Current limitation

The text parser still understands only a bounded set of intents, but it accepts several natural phrasings and gives state-aware hints when it cannot interpret the player. This rigidity is intentional and remains one of the first things an eventual AI layer would replace.
