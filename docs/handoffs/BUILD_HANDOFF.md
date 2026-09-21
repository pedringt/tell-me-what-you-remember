# Build Chat Handoff: Core-Loop Prototype

**Written:** 2026-09-20, by the chat that did the implementation work.
**Purpose:** repository and code state, what was learned while building, and how this relates to the story chat's documents. Creative direction lives in `NEXT_CHAT_START_HERE.md` and `docs/prototypes/`; this file does not override them.

## Where things stand in one paragraph

The project is **paused between two goals**. A three-day Evelyn slice was built and tested. Then the goal narrowed: prove that managing **one ordinary day** of Evelyn's life is fun enough that a player wants another turn, before investing further in story. **No further implementation is approved.** The next step is a **paper playtest**, which is Paige's to run or authorize.

## Rules that apply to everything

- Work on `ai-v1-hardening` only. Do **not** merge to `main`, deploy production, or publish anything without Paige's explicit authorization in the current conversation.
- **Do not resume the 30 to 45 minute vertical slice.** No broad Episode 1 content, endings, more characters, later-game systems, or story progression until the core loop has been proven.
- Cast is **Evelyn, Jenny, Michael** only.
- **No live AI** until testing shows a concrete rigidity problem that deterministic handling does not solve. The game must work without it.
- **Canon safety:** fixture or generated text must not invent clues, relatives, diagnoses, historical events, permissions or consequences. Do not fill anything in `docs/story-development/EPISODE_01_OPEN_DECISIONS.md`.
- All Evelyn and Jenny dialogue written in code so far is **fixture text**, flagged `placeholder` in `episode01/content.js`. Only Michael's message is `working` wording.

## Read in this order

1. `docs/handoffs/NEXT_CHAT_START_HERE.md`, the story chat's handoff. **It defines the current experiment.**
2. `docs/prototypes/EVELYN_CORE_LOOP_PROTOTYPE.md` and the other four files in `docs/prototypes/`: the current definition of the one-day paper prototype (event map, manual playtest, scorecard, state fixture).
3. This file.
4. `docs/CORE_LOOP_PROTOTYPE_PLAN.md`: the build chat's **more detailed companion proposal**. See the comparison below. It is not the authority.
5. `docs/EPISODE_01_SLICE_IMPLEMENTATION_NOTES.md`: what the three-day slice is and what testing found.
6. `docs/EPISODE_01_LOOP_DESIGN.md`: a six-day design. **Superseded**, kept for reference.

## Two plans exist: decide which to run

The story chat and the build chat each wrote a one-day plan at the same time. They agree on the goal, cast, loop, non-goals, Robert/butter pecan/vanilla/church-mail/Michael material, and the paper-first gate. They differ in how much machinery they add:

| | `docs/prototypes/` (story chat) | `docs/CORE_LOOP_PROTOTYPE_PLAN.md` (build chat) |
|---|---|---|
| Jenny | 45 minutes, **3 task slots** of 15 minutes | 45 minutes, **7 tasks with different minute costs** |
| The AI's own time | Not costed | **Every AI action costs minutes** on a visible clock |
| Evelyn's limits | Not modelled | **Behavioural patience**: her tone changes after repeated asks; no number |
| Events | 8, including the 9:30 church item and Michael late in the day | 6 events and 4 deadlines; Michael arrives 9:40 with a 1:30 consequence |
| Memory | **5 items, keep 3** | ~8 items, keep 3, plus a **four-card next-morning test** |
| Interpretations | Up to 3; must affect behaviour | 3, automatic status, plus a one-at-a-time "acting assumption" toggle |
| Size | Leaner | Heavier: more systems to test at once |

**My recommendation:** run the story chat's leaner version on paper first. The brief said to cut aggressively, and the build chat's plan tests seven things at once. Borrow from the heavier plan **only if paper play shows a specific gap**:

- If Jenny's three equal slots feel flat, try varied minute costs.
- If nobody feels the memory choice, try the next-morning test cards.
- If the AI has too much free time, try costing its actions.

That decision is Paige's; nothing in either document was silently overridden.

## Decisions Paige has made (do not reopen without new evidence)

- Work is redirected to a **one-day core-loop prototype**; a paper playtest comes before more code.
- The half-finished six-day scaffolding was **moved to a side branch**, not discarded.
- The first present-tense Robert slip ("Robert won't eat vanilla", in Jenny's report) **appears on Day 1**. Earlier docs had it as a later escalation; the new brief overrides that.

## Repository state

| Thing | State |
|---|---|
| `ai-v1-hardening` | Contains the story chat's docs, the merge of `main`, `.gitignore` and lockfile, the three-day slice (`2e48b3c`, `1ba5bb6`), and the build chat's plan and handoff. |
| Tests | `npm test`: 123 passing. Node's built-in runner, no extra dependencies. |
| `wip/six-day-loop` | **Local only, on the implementation machine (`~/dev/tell-me-what-you-remember`), commit `2dd7c51`. Not pushed.** Half-wired scaffolding (resources, threads, notes/hypothesis model, week config); the suite is red on that branch by design. Salvage material, not a starting point. Ask Paige if it is needed. |
| `main` | Untouched. |

## What exists in the code (under `episode01/`, page at `evelyn.html`)

The committed code is the **three-day slice**. It is *not* the target, but its foundations are reusable:

- **Reuse now:** `state.js` (versioned save/load), `engine.js` (`dispatch`: validate, gate, confirm, resolve, audit invariant), `actions.js` (bounded action registry, including the Jenny visit logic), `session.js`, `harness.js`, and the test approach (seeded random walks, "every suggestion is available", mutation-checked).
- **Reuse later:** `interpreter.js` (text to bounded action; hypotheticals and negations never execute; ties ask; never substitutes an action) and `guidance.js`.
- **Too broad for now:** the intake and tutorial flow, profile saving, the therapy-behaviour choice, the three-day time model, the chat-first UI.

Run it: `npm test`. To see the old slice: `python3 -m http.server 8137`, then open `http://127.0.0.1:8137/evelyn.html` (`?dev=1` adds a state panel). Progress is stored only in that browser's local storage.

## Known follow-ups (do these when building resumes)

1. **The "Robert only in past tense" content test is defective.** It is a short verb list and does not catch "Robert won't eat vanilla" or "Robert doesn't eat vanilla". Replace it with a **tagged allowlist**: present-tense Robert allowed only in lines explicitly marked as the designated anomaly, forbidden everywhere else.
2. **Jenny's model differs between the two plans** (3 slots versus a minutes budget). The existing code uses a 3-task cap; the uncommitted-then-shelved work moved to minutes. Settle this before building.
3. **Pushing to this branch may start a Vercel preview build**, which would make `evelyn.html` reachable on a preview URL. Nothing is on `main`. Vercel is build-rate limited on this account, so batch pushes.

## What is paused (do not start)

The three-day and six-day tutorial expansion, Anna and the wedding arc, dementia progression, endings, hospice, helper turnover, any memory economy beyond one event, more than three interpretations, monitoring systems, anthology work, live AI, and a chat-first interface.

## The next step

**A paper playtest of the one-day plan**, following `docs/prototypes/EVELYN_MANUAL_PLAYTEST.md` and its scorecard. Report on the ten questions in the brief, especially: *did the player want another turn?*

If it succeeds, the smallest digital build is a single deterministic **Day Board** (specified at the end of the build chat's plan). If it does not, cut or simplify, and do not preserve a system because it maps neatly to an AI concept.

## How the two chats work together

Story planning happens in one chat, which pushes docs to `ai-v1-hardening`. Building happens in another. **Always `git fetch` before pushing**, and put build notes in **new files** rather than editing the other chat's documents. Both chats acted on the same brief at the same moment this session and produced two plans; a quick check-in before writing a design document would avoid that.
