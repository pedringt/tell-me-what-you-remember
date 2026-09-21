# Tell Me What You Remember

A speculative narrative game project about an AI embedded inside human systems, currently focused on proving the **Evelyn care-AI core loop** before expanding into a full episode or anthology.

## Current development target

The active experiment is intentionally small:

> **One ordinary day with Evelyn. Does the player want another turn?**

The current prototype work tests three mechanics first:

- **Attention** - the player cannot pursue everything.
- **Delegation** - the AI acts through humans with limited time, access, and knowledge.
- **Memory** - the player cannot preserve everything at full fidelity.

Supporting systems include evidence provenance and a small working model of uncertain claims.

Start here:

- [Evelyn core-loop prototype](./docs/prototypes/EVELYN_CORE_LOOP_PROTOTYPE.md)
- [One-day event map](./docs/prototypes/EVELYN_ONE_DAY_EVENT_MAP.md)
- [Manual playtest guide](./docs/prototypes/EVELYN_MANUAL_PLAYTEST.md)
- [Playtest scorecard](./docs/prototypes/EVELYN_PLAYTEST_SCORECARD.md)
- [One-day state fixture](./docs/prototypes/EVELYN_ONE_DAY_STATE_FIXTURE.json)

## Development gate

Do **not** resume the broader 30-45 minute Evelyn vertical slice until the one-day loop has been manually tested and Paige explicitly approves the next implementation phase.

The immediate success criterion is not "the story is interesting."

It is:

> **The player wants another turn.**

## Deterministic-first rule

The game must work without live generative AI.

Authored software owns canon, permissions, consequences, and state changes. AI-backed features may be added later only where testing shows that they materially improve the experience.

Potential future seams include:
- mapping varied natural language to bounded actions
- constrained synthesis of multiple sources
- variable but canon-safe interpretation
- adaptive scaffolding
- intentionally lossy summaries

AI is not a requirement for a mechanic that deterministic software handles better.

## Existing prototype history

The repository also contains an earlier Agent Seven / security-evaluation prototype. That work remains useful as technical and creative history, but it is **not the current implementation target**.

The earlier deterministic prototype tested bounded parsing, memory contradiction, cross-run state, and an initial AI intent layer. Preserve it; do not treat it as current Episode 1 canon.

## Broader Evelyn design

Long-range Episode 1 material remains documented under:

- [Episode 1 implementation spec](./docs/EPISODE_01_IMPLEMENTATION_SPEC.md) - **future design, currently paused**
- [Episode 1 story-development docs](./docs/story-development/)
- [Game idea bible](./docs/GAME_IDEA_BIBLE.md)

These docs preserve future architecture, story, endings, and systems. They should not be used to expand current implementation scope until the core loop earns that expansion.

## Run existing prototype locally

The existing static prototype can still be opened through `index.html` or a local static server. It represents earlier prototype work, not the new Evelyn one-day experiment.

## Project handoff

For the latest technical and creative state, start with:

- [New chat / tool handoff](./docs/handoffs/NEXT_CHAT_START_HERE.md)
- [Evelyn core-loop prototype](./docs/prototypes/EVELYN_CORE_LOOP_PROTOTYPE.md)
- [Current older prototype status](./docs/handoffs/prototype-v0-current-status.md)
- [Case study notes](./docs/CASE_STUDY_NOTES.md)
