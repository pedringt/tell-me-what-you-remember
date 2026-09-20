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
- local cross-run memory that changes the next cycle

The long-term concept and AI-native design direction are documented in [`GAME_CONCEPT.md`](./GAME_CONCEPT.md).

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server.

## Current limitation

The text parser only understands a small set of intents. If it cannot classify a message, it asks the player to rephrase. That rigidity is intentional in this prototype and is one of the first things an eventual AI layer would replace.
