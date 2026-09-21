# Build Chat Handoff

**Last updated:** 2026-09-20, by the chat that does the implementation work.
**Purpose:** repository and code state, what building taught us, and how the build chat and the story chat relate. Creative direction is in `docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md` and `NEXT_CHAT_START_HERE.md`.

## Where things stand in one paragraph

The target is now a **compact 8 to 12 minute portfolio judgment game** about Evelyn, inspired structurally by *Papers, Please*: three escalating incidents, two inquiries out of four per incident, and a judgment call each time about whether to trust an imperfect system's reading of a human. **The design is locked (Paige, 2026-09-20). No code has been written for it, and none is approved.** The next step is a five-minute **paper playtest**. Earlier work (a three-day slice, a six-day scaffold, two one-day management plans) is preserved but is not the target.

## Rules that apply to everything

- Work on `ai-v1-hardening` only. Do **not** merge to `main`, deploy, or publish anything without Paige's explicit authorization for that destination in the current conversation.
- **Do not build anything until Paige approves the paper playtest result.**
- **Never show the word "dementia" on screen** in this slice. It is canon; it is deliberately off-screen so players don't pathologize every anomaly.
- **The system never sees Evelyn, only traces of her.** No portraits, no cameras. See the sensory model in the spec.
- Cast is **Evelyn, Jenny (incident 2 only), Michael (a message only), and Anna (offstage, never speaks).**
- **No live AI.** The game must work without it. If a use is proposed, ask what it does better than authored state, and it must never generate canon.
- **Canon safety:** generated or fixture text must not invent clues, relatives, diagnoses, permissions or consequences. Do not fill anything in `docs/story-development/EPISODE_01_OPEN_DECISIONS.md`.
- All dialogue is **fixture text**, flagged `placeholder`. Only Michael's message is `working` wording.
- **No verdicts.** The game never says a decision was correct or incorrect, and the ending must not become a "you should have clicked that" quiz (see the unseen-item rule in the spec).
- **The design fails** if a player concludes "always ignore the computer" or "always obey the computer."

## Read in this order

1. **`docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md`**: the current design. Sensory model, protocol, all three incidents with their evidence and consequences, ending rules, canon log, guardrails, gates.
2. `docs/handoffs/NEXT_CHAT_START_HERE.md`: the story chat's handoff. Creative canon still applies. Its one-day management framing is superseded where it differs from the spec.
3. This file.
4. Background only: `docs/prototypes/EVELYN_CORE_LOOP_PROTOTYPE.md` and its siblings (story chat's one-day plan), `docs/CORE_LOOP_PROTOTYPE_PLAN.md` (build chat's heavier one-day plan, **superseded**), `docs/EPISODE_01_LOOP_DESIGN.md` (six-day design, **superseded**), `docs/EPISODE_01_SLICE_IMPLEMENTATION_NOTES.md` (the three-day slice).

## How the direction got here

| Step | What changed |
|---|---|
| Three-day Evelyn slice built | Linear tutorial. Green, 123 tests. Paused. |
| Six-day loop scaffold started | Half-wired, moved to a local side branch. |
| One-day management plans (two, written at the same time by the two chats) | Attention, delegation and memory as a management loop. |
| **Portfolio judgment game (current)** | Not "manage Evelyn's day" but "judge whether the system's interpretation of Evelyn should be trusted." Cut memory consolidation, hypothesis cards, Jenny scheduling and minute budgets. Kept: provenance (now five tags), patience, consequences for what you don't investigate, the Robert/vanilla thread, Michael's message, Evelyn's voice. |

## Decisions Paige has made (do not reopen without new evidence)

- Direction: compact portfolio judgment game; paper playtest before code.
- **Dementia is canon but never shown.** The only cognitive signal is a plain family care note in incident 2: `RECORD Care note (family): recent memory concerns reported.` It is held back from incident 1 so the first lesson is purely "real observation, wrong inference."
- **Consent model:** Evelyn agreed to assistance in broad terms and did not fully understand every inference the installed sensors allow.
- **The bathroom impact sensor** is the capability she didn't fully understand. It reports an impact and inactivity, never "Evelyn fell." Her reaction: "You can hear me sit down?"
- **Anna** is offstage only, with one narrow standing instruction: falls and hospital visits only.
- **Memory consolidation** is cut from this slice.
- **Action labels are natural** (for example "Log as routine exception / Enable door reminder / Notify family") over a consistent accept / adjust / escalate structure underneath.
- **The first present-tense Robert slip** ("Robert won't eat vanilla") stays, and now sits in incident 2.
- **A sensitivity and lived-experience review** is required before this is called portfolio-finished.

## Repository state

| Thing | State |
|---|---|
| `ai-v1-hardening` | Has the story chat's docs, the merge of `main`, `.gitignore` and lockfile, the three-day slice, the earlier plans, and now the locked spec. See git for whether the newest commit is pushed. |
| Tests | `npm test`: 123 passing (the three-day slice). The judgment game has no code or tests yet. |
| `wip/six-day-loop` | **Local only, on the implementation machine (`~/dev/tell-me-what-you-remember`), commit `2dd7c51`. Not pushed.** Half-wired six-day scaffolding; suite red on that branch by design. Salvage material only. |
| `main` | Untouched. |

## What exists in the code

Everything under `episode01/` and `evelyn.html` is the **three-day slice**. It is not the target, and its chat-first UI should not be expanded. What is reusable for the judgment game:

- **Reuse:** the deterministic engine core (`dispatch` and its audit invariant), the harness, the seeded random-walk and "every suggestion is available" test approach, the provenance idea, and the fixture-status flags.
- **Not needed:** the text interpreter (the game is buttons only), the guidance and scaffolding layer, the save system, the intake flow, the chat UI.

Run the old slice: `npm test`, or `python3 -m http.server 8137` and open `http://127.0.0.1:8137/evelyn.html`.

## Known follow-ups (when building resumes)

1. **The "Robert only in past tense" content test is defective** (a short verb list that misses "Robert won't eat vanilla"). Replace it with a **tagged allowlist**: present-tense Robert permitted only in the one designated incident-2 line, forbidden elsewhere.
2. **Guardrail tests** listed at the end of the spec: no "dementia" on screen, two inquiries then a decision, two-sided evidence, unseen item independent of the decision, no verdict language, sensors limited to the perceivable list, no Anna dialogue, no network.
3. **Hosting is undecided:** this repository's Vercel site, or embedded in the portfolio site. Decide before any deploy. Pushing may also start a Vercel preview build; Vercel is build-rate limited on this account, so batch pushes.

## What is paused (do not start)

Anything beyond three incidents, memory consolidation, hypothesis boards, Jenny scheduling, the 30 to 45 minute Episode 1 slice, Anna's wedding arc, dementia progression, endings, hospice, helper turnover, monitoring systems, anthology work, live AI, and any chat-first interface.

## The next step

A **five-minute paper playtest** of the three incidents (protocol at the end of the spec). Success looks like the player saying some version of *"I'm not sure what I should have done"* and wanting to replay. Watch for the failure signals: "always ignore the computer," feeling they fill out the same form three times, or reading incident 1 as a medical clue.

## How the two chats work together

Story planning happens in one chat, which pushes docs to `ai-v1-hardening`. Building happens in another. **Always `git fetch` before pushing**, and put build notes in **new files** rather than editing the other chat's documents. The story chat should now mark its `docs/prototypes/` one-day documents as superseded by the spec; the build chat has not edited them. Twice this session both chats wrote a plan for the same brief at the same moment, so a quick check-in before writing a design document would avoid duplicates.
