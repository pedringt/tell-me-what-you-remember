> **Status: superseded for the current experiment.** The immediate goal is now one in-game day, not a six-day week.
> See [`CORE_LOOP_PROTOTYPE_PLAN.md`](./CORE_LOOP_PROTOTYPE_PLAN.md). This document is kept as reference for later
> slices (multi-day pacing, hypothesis cards, consolidation), not deleted, and none of it is validated.

# Episode 01 First Slice: The Game Loop

**Status:** design for the redirected first slice. Supersedes the "three-day tutorial" shape of the first build; keeps its architecture and the settled Evelyn / Jenny / Michael opening.

## What this slice has to prove

That this is a **game**, not an interactive narrative. Everything below serves one loop:

> Something happens -> the player decides what deserves attention -> spends a limited resource -> acts through people or tools -> the world responds -> the player updates their working model and memory -> time continues.

And one principle: *at first you learn to use your AI capabilities; later you learn when not to trust them.* This slice teaches the first half and plants three seeds of the second.

## Shape: one week of Evelyn's life (six days)

| Day | Jenny | What is new |
|---|---|---|
| 1 | plans visit | Guided setup (kept from the first build): intake, butter pecan request, Michael's message, reflection support. Teaches the vocabulary. |
| 2 | visit 1 | First visit. Jenny's time is now measured in **minutes**. Jenny's first reports become the first **notes**. |
| 3 | plans visit | **Two things arrive at once and you cannot do both well:** Evelyn asks again about the ice cream, and Evelyn asks you to contact Michael. ATTENTION and WORKING MODEL open. |
| 4 | visit 2 | Monitoring choices pay off (or add noise). Evening: **consolidation.** You can keep 3 notes exact; the rest are summarized. |
| 5 | none | Deadline day: the luncheon RSVP and ride close tonight. Consequences of Day 3 arrive. |
| 6 | visit 3 | Luncheon day. Final visit. Week review. |

## Constraints (natural, not mana bars)

| Constraint | How it shows up | What it forces |
|---|---|---|
| **Jenny's visit time** | 90 minutes per visit. Every task costs minutes. | Choosing what physical evidence and errands are worth it. |
| **Evelyn's patience** | About three real conversations a day. She says when she is tiring. | Choosing which questions to spend her on. |
| **Contact boundary** | You cannot contact Michael or Anna. | Redirecting Evelyn's urges instead of obeying them. |
| **Expiring opportunity** | Luncheon RSVP and ride close at the end of Day 5. | Not letting an ordinary thing lapse while chasing a puzzle. |
| **Full-fidelity memory** | Three notes stay exact at consolidation; the rest are summarized. | Deciding what is worth preserving exactly. |

## The decisions, one beat at a time

For each significant beat: *what is the player deciding, what makes it non-trivial, what tells them what happened.*

| Beat | Decision | Constraint | Feedback |
|---|---|---|---|
| Plan a visit | Which tasks are worth Jenny's minutes; whether to ask her to *watch* something | 90 minutes; watching costs minutes and produces detail others don't | The report is richer or poorer depending on what you asked for. Asking Jenny to fetch ice cream **and** placing the order gives you two tubs. |
| Day 3 arrivals | Which of two competing things gets Evelyn's limited patience | ~3 conversations a day | An ignored Michael urge becomes "I rang him myself" on Day 5. The ice cream re-ask can be reassured, questioned, checked, or let go. |
| Reflection response | How to respond to Evelyn's urge to contact Michael | Her patience; the behaviour you set on Day 1 | *Listen only* is kinder now and costs more of her patience (and feeds enablement). *Remind* costs less and lands harder. *Reflect* asks her a question. Hidden dimensions move; nothing is scored on screen. |
| Working model | Which 3 hypotheses to pin; which notes to link to which | Only 3 pinned; only linked notes count | Each link is graded: **supports / weakens / conflicts / doesn't bear on it**, with the source type shown. Her own claim is not a record. |
| Synthesis | Notice that ordinary, separate items form a pattern | Evidence arrives across days and from different sources | Four small re-asks, from two sources, add up to an established *pattern*. The **cause stays unverified**, deliberately. |
| Consolidation | Which 3 of ~8-10 notes to keep exact | 3 slots | Before you confirm, you see what each note becomes when summarized. Afterwards, hypotheses built on summaries lose strength. |
| Week review | (none) | | A plain account of what you established, what you only claimed, and what your summaries cost you. |

## The working model

Hypotheses are **authored cards**, not free text, because story truth stays deterministic. The pool for this slice:

- **The order failed.** Testable. Two observed freezer checks kill it.
- **She wants reassurance / to be heard.** Supported only by her own account. Can never be verified in this slice.
- **She is re-asking about things already handled.** A pattern claim. Needs several instances from several sources.
- **Jenny's visits give me the full picture.** A source-reliance claim. Conflicts with what Jenny later reports.

Notes carry a **source type** (system record, Jenny observed, Evelyn's own account, AI summary). Linking the wrong note is allowed and simply reports "doesn't bear on this".

## What this slice deliberately does not do

- It never says *why* Evelyn re-asks. No diagnosis, no symptom label, no confirmed cause. The pattern is real; the explanation is open.
- No late-game memory economy: one consolidation, three slots, no archive retrieval, no provenance-corruption chains.
- No live AI. Wording variation and phrasing tolerance are the places it might later help; the loop does not need it.
- Not every scene is a dilemma. Most days are ordinary, and some are funny.

## The three seeds of "when not to trust it"

1. **Summaries erase nuance**: consolidation.
2. **Pattern recognition outruns its evidence**: a pattern is established, a cause is not, and the review says so.
3. **Monitoring can create noise**: an optional "mood notes" watch fills the notebook with items that compete for slots.

Not yet touched: a working model of Evelyn mistaken for Evelyn, and polished AI communication standing in for the person. Those belong to later slices.

## Questions this prototype should answer

1. Is prioritizing incomplete information interesting?
2. Is acting through humans with their own limits interesting?
3. Is reconstructing a situation from imperfect sources satisfying?
4. Does maintaining and testing hypotheses feel useful?
5. Does choosing what to preserve or compress create tension?
6. Does the player feel they are getting better at operating as an AI?

Telemetry (local only) records the raw material for these: which threads were answered or let lapse, minutes spent versus wasted, hypotheses pinned and whether links were correct, what was protected, and how often the player needed a nudge.

## Canon safety

Nothing here decides an open story question. Fixture text stays flagged. Evelyn's repeated requests are a pattern of *events*; no line explains them. Michael never replies. The only new "world" facts are mundane and generic: a luncheon date, a tub or two of ice cream.
