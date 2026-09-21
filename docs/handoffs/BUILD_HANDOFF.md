# Build Chat Handoff: Core-Loop Prototype

**Written:** 2026-09-20, by the chat that did the implementation work.
**Read this before touching code.** It supersedes the "Immediate recommended task" in `NEXT_CHAT_START_HERE.md`.

## Where things stand in one paragraph

The project is **paused between two goals**. A three-day Evelyn slice was built and tested. Then the goal narrowed: prove that managing **one ordinary day** of Evelyn's life is fun enough that a player wants another turn, before investing further in story. A paper/manual prototype **plan** for that day is written and committed. **No further implementation is approved.** The next step is a **paper playtest**, which is Paige's to run or authorize.

## Rules that apply to everything

- Work on `ai-v1-hardening` only. Do **not** merge to `main`, deploy production, or publish anything without Paige's explicit authorization in the current conversation.
- **Do not resume the 30 to 45 minute vertical slice.** Do not add broad Episode 1 content, endings, more characters, later-game systems, or story progression until the core loop has been proven.
- Cast is **Evelyn, Jenny, Michael** only.
- **No live AI** until testing shows a concrete rigidity problem that deterministic handling does not solve. The game must work without it.
- **Canon safety:** generated or fixture text must not invent clues, relatives, diagnoses, historical events, permissions or consequences. Do not fill anything listed in `docs/story-development/EPISODE_01_OPEN_DECISIONS.md`.
- All Evelyn and Jenny dialogue written so far is **fixture text**, flagged `placeholder` in `episode01/content.js`. Only Michael's message is `working` wording.

## Read in this order

1. **`docs/CORE_LOOP_PROTOTYPE_PLAN.md`**, the current design. The day, events, evidence, interpretations, memory event, consequences, paper protocol, and the reuse assessment.
2. `docs/handoffs/NEXT_CHAT_START_HERE.md`, the story chat's handoff. Creative direction and canon still apply. Its "immediate task" section is superseded.
3. `docs/EPISODE_01_SLICE_IMPLEMENTATION_NOTES.md`, what the three-day slice is, how it was built, and what testing found.
4. `docs/EPISODE_01_LOOP_DESIGN.md`, the six-day design. **Superseded**, kept as reference.

## Decisions Paige has made (do not reopen without new evidence)

- Work is redirected to a **one-day core-loop prototype**; paper playtest comes before more code.
- The half-finished six-day scaffolding was **moved to a side branch**, not discarded.
- The first present-tense Robert slip ("Robert won't eat vanilla", in Jenny's report) **appears on Day 1**. Earlier docs had it as a later escalation; the new brief overrides that.
- The plan docs were committed to `ai-v1-hardening`.

## Repository state

| Thing | State |
|---|---|
| `ai-v1-hardening` | Pushed. Contains the story chat's docs, the merge of `main`, `.gitignore` and lockfile, the three-day slice (`2e48b3c`, `1ba5bb6`), and the plan (`7018ab8`). |
| Tests | `npm test`: 123 passing. Node built-in runner, no extra dependencies. |
| `wip/six-day-loop` | **Local only, on the implementation machine (`~/dev/tell-me-what-you-remember`), commit `2dd7c51`.** Half-wired scaffolding (resources, threads, notes/hypothesis model, week config). The suite is red on that branch by design. It was **not pushed**. If you need it, ask Paige. It is salvage material, not a starting point. |
| `main` | Untouched. |

## What exists in the code (all under `episode01/`, page at `evelyn.html`)

The committed code is the **three-day slice**. It is *not* the target, but its foundations are reusable. Full table in the plan; summary:

- **Reuse now:** `state.js` (versioned save/load), `engine.js` (`dispatch`: validate, gate, confirm, resolve, audit invariant), `actions.js` (bounded action registry, including the Jenny visit logic), `session.js`, `harness.js`, the test approach (seeded random walks, "every suggestion is available", mutation-checked).
- **Reuse later:** `interpreter.js` (deterministic text to bounded action; hypotheticals and negations never execute; ties ask; never substitutes an action), `guidance.js`.
- **Too broad for now:** the intake and tutorial flow, profile saving, the therapy-behaviour choice, the three-day time model, the chat-first UI.

Run it: `npm test`. To see the old slice: `python3 -m http.server 8137`, then `http://127.0.0.1:8137/evelyn.html` (add `?dev=1` for a state panel). Progress is stored only in that browser's local storage.

## Known follow-ups (small, do these when building resumes)

1. **The "Robert only in past tense" content test is defective.** It is a short verb list and does not catch "Robert won't eat vanilla" or "Robert doesn't eat vanilla". Replace it with a **tagged allowlist**: present-tense Robert allowed only in lines explicitly marked as the designated anomaly, forbidden everywhere else.
2. **The plan's costs are tunable and unproven.** If the paper day does not produce "I can't do both" at least twice, raise costs first.
3. **The working-interpretations toggle may feel like admin.** The plan says to cut it if so.
4. **Pushing to this branch may start a Vercel preview build**, which would make `evelyn.html` reachable on a preview URL. Nothing is on `main`. Vercel is build-rate limited on this account, so batch pushes.

## What is paused (do not start)

The three-day and six-day tutorial expansion, Anna and the wedding arc, dementia progression, endings, hospice, helper turnover, any memory economy beyond one event, more than three interpretations, monitoring systems, anthology work, live AI, and a chat-first interface.

## The next step

**A paper playtest of the one-day plan**, following the protocol in `docs/CORE_LOOP_PROTOTYPE_PLAN.md`. Report back on the ten questions in that document, especially: *did the player want another turn?*

If it succeeds, the smallest digital build is a single deterministic **Day Board** (also specified in the plan). If it does not, cut or simplify, and do not preserve a system because it maps neatly to an AI concept.

## How the two chats work together

Story planning happens in one chat, which pushes docs to `ai-v1-hardening`. Building happens in another. Always `git fetch` before pushing, and put build notes in **new files** rather than editing the other chat's documents. The one exception in this handoff: a short override block was added at the top of `NEXT_CHAT_START_HERE.md` because its old instruction would otherwise send a new chat to build the paused work.
