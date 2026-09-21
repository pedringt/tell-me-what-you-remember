# Tell Me What You Remember

A speculative narrative game project about an AI embedded inside human systems, currently focused on a compact **Evelyn judgment game** for a portfolio site, before expanding into a full episode or anthology.

## Current development target

A compact, **8 to 12 minute** playable judgment game, inspired structurally by *Papers, Please*:

> **Can a player enjoy making consequential judgments about an unpredictable human through an imperfect AI system?**

You are the support system in an older woman's home. You never see Evelyn. You see the traces her life produces (a door, a motion sensor, a delivery record), plus the system's reading of them, and Evelyn's own account. Across three escalating incidents you get two inquiries out of four, then decide whether to trust the system's reading, defer to Evelyn, or escalate.

The game never says whether you were right. The aim is the feeling of **"I'm not sure what I should have done."**

Start here:

- [Design spec (source of truth)](./docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md)
- [Five-minute paper playtest kit](./docs/prototypes/PORTFOLIO_PLAYTEST_KIT.md)
- [Build handoff](./docs/handoffs/BUILD_HANDOFF.md)

### Earlier one-day management prototype (superseded, kept as history)

- [Evelyn core-loop prototype](./docs/prototypes/EVELYN_CORE_LOOP_PROTOTYPE.md)
- [One-day event map](./docs/prototypes/EVELYN_ONE_DAY_EVENT_MAP.md)
- [Manual playtest guide](./docs/prototypes/EVELYN_MANUAL_PLAYTEST.md)
- [Playtest scorecard](./docs/prototypes/EVELYN_PLAYTEST_SCORECARD.md)
- [One-day state fixture](./docs/prototypes/EVELYN_ONE_DAY_STATE_FIXTURE.json)

## Development gate

There is **no implementation yet** for the judgment game. The next step is the paper playtest. Do **not** build it, and do not resume the broader 30-45 minute Evelyn vertical slice, until the paper test has been run and Paige explicitly approves the next phase.

The immediate question is not "did the player solve the incidents?" It is whether the player feels **genuine tension between the system's reading and Evelyn's autonomy**, and wants another incident.

Nothing is published until a **sensitivity and lived-experience review** of the depiction of dementia has happened.

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

The existing static prototype can still be opened through `index.html` or a local static server. It represents earlier prototype work, not the current Evelyn judgment game.

## Project handoff

For the latest technical and creative state, start with:

- [New chat / tool handoff](./docs/handoffs/NEXT_CHAT_START_HERE.md)
- [Portfolio judgment game spec](./docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md)
- [Build handoff](./docs/handoffs/BUILD_HANDOFF.md)
- [Current older prototype status](./docs/handoffs/prototype-v0-current-status.md)
- [Case study notes](./docs/CASE_STUDY_NOTES.md)
