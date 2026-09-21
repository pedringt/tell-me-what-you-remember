# Core-Loop Prototype Plan: One Day With Evelyn

> **Companion proposal, not the authority.** The current definition of the experiment is the story chat's set in
> [`docs/prototypes/`](./prototypes/EVELYN_CORE_LOOP_PROTOTYPE.md). This document is a **more detailed, heavier alternative**
> written at the same time (varied Jenny minute costs, a costed AI clock, behavioural patience, a next-morning test).
> `docs/handoffs/BUILD_HANDOFF.md` compares the two. Recommendation: paper-test the leaner set first and borrow from
> this one only where play shows a specific gap.

**Status:** draft for Paige's review. A paper/manual prototype plan, not an implementation. **Nothing in here is validated.** Every "fun hypothesis" below is a bet to be tested, not a finding.

**Branch:** `ai-v1-hardening`. No merge, no deploy, no push implied.

## The one question

> Is managing one ordinary day of Evelyn's life fun enough that a player wants another turn?

The loop under test:

> Event -> prioritize -> investigate / delegate -> imperfect information -> synthesize -> update working model -> preserve or compress memory -> time advances

The story only earns more investment if that loop is satisfying on its own.

## The day at a glance

The AI's working day runs **9:00 AM to 2:00 PM**, when Evelyn rests. Target play: **15 to 20 minutes, about 25 to 30 card actions.**

Visible from the first screen (nothing hidden that the player could reasonably ask for):

| What | When |
|---|---|
| Crossword: Evelyn does not like being interrupted | 9:15 to 10:00 |
| Grocery order **locks** | 10:00 |
| Delivery window | 10:00 to 11:00 |
| Jenny on site (**45 minutes**) | 11:30 to 12:15 |
| Church luncheon RSVP **closes** (details unknown until the mail is read) | 12:00 |
| Evelyn's own calendar entry: "Call Michael" | 1:30 PM |
| Day closes, memory consolidates | 2:00 PM |

### Constraints (explicit, forecastable, no surprise penalties)

| Constraint | Kind | Player-visible as |
|---|---|---|
| The clock | explicit | Every AI action card shows its minutes before the player commits. Reading what you already hold is free. |
| Jenny's time | explicit | "Jenny has 45 minutes." Each task shows its cost and what it will look at. |
| Three deadlines | explicit | 10:00 order lock, 12:00 RSVP, 1:30 Evelyn's call. All on the dashboard. |
| Evelyn's patience | **behavioural, no number** | Her tone on the PEOPLE card: *warm, even, starting to sound impatient, short, done for now.* |
| Contact boundary | rule | The AI cannot contact Michael. |
| Memory | explicit | "Keep 3 notes exact." |

**Evelyn's patience rules (all visible in advance on her card):** direct questions cost 15 minutes and each counts as an *ask*. After her 2nd ask she sounds impatient; after the 3rd she is short; after a 4th she will not do the reflection step. Her mood also drops if you interrupt the crossword, decline her direct request to Jenny, ask her something she already answered today, or use a canned sympathy phrase (an option on the card, and she despises it). It rises when you do her a favour or answer her plainly.

## Timeline: six incoming events and four deadlines

| Time | Event | Visible on arrival | What the player can do | What closes if ignored |
|---|---|---|---|---|
| 9:05 | **E1. Evelyn asks:** "Can you make sure Robert gets his butter pecan? They always forget it." | Her message. Order locks 10:00. | Check her profile; check order history (10 min); check store stock (10); add butter pecan (5, substitutions allowed or not); ask her about it (15); do nothing yet. | Order changes at 10:00. |
| 9:40 | **E2. Michael's message** arrives in the care inbox: *"Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again."* | Message, sender, and Evelyn's own 1:30 "Call Michael" entry. | Read (free). Review the reflection agreement (5). Later: ask Evelyn (15); run the reflection step (25); wait. | At 1:30 Evelyn rings him herself, unless the step was done. |
| 10:14 | **E3. Delivery complete:** "14 items, **1 substitution**." | The count, not which item. | Inspect the delivery record (5) to see the item. Ignore it. | Nothing closes, but you learn it later, and from someone else. |
| 10:17 | **E4. Evelyn asks again:** "Did you remember Robert's ice cream?" Three minutes after the delivery notice. | Her message. | Reassure (5); reassure with the record (5, needs the delivery inspected); ask her why it matters (15); let it go warmly (free); canned sympathy (5, costs mood). | Nothing hard closes. Her tone shifts if you handle it badly. |
| 11:30 | **E5. Jenny arrives** with 45 minutes. Evelyn asks her, in earshot: "Jenny, dear, find my lemon-cake recipe folder for Saturday." | Jenny's task menu with costs; Evelyn's request. | Assign tasks. Approve or decline the folder request. | Every minute spent is a minute not spent elsewhere. |
| 12:00 | **Deadline: RSVP closes.** | Church luncheon "RSVP due today" (from 9:00). | RSVP for Evelyn (10), which needs the details from the mail scan or a call to the church office (15). | She is not on the list. Ordinary and recoverable next time. |
| 12:15 | **E6. Jenny leaves and reports.** | The report, shaped by what she was asked to do. | Read it. Ask Jenny one follow-up (free, she is at the door). | Jenny is gone. |
| 1:30 | **Deadline: Evelyn calls Michael**, unless the reflection step is done. | Her calendar. | See above. | Michael does not answer. |
| 2:00 | **Day closes: memory consolidation.** | All notes held. | Keep 3 exact; the rest are summarized. | Summaries replace the originals in working memory. |

Next morning is a short **test**, not more story (see *Memory*).

## The people

### Evelyn
- **Can:** ask, chat, make direct requests of Jenny, get short with you, refuse the reflection step, ring Michael.
- **Knows:** her own version of things. That is *her account*, not verified truth.
- **Cannot:** be forced. Cannot be verified.
- **Availability:** crossword 9:15 to 10:00 (interrupting costs mood); with Jenny 11:30 to 12:15; otherwise free.
- **Is (character-first, fixture details):** competitive about the crossword and will not take hints; strong opinions on towels (thirds, never halves); denies watching an embarrassing daytime show while knowing every plot; asks Jenny nosy questions about her dating life; dislikes canned sympathy. Funny before anything else. No line explains her.

### Jenny
- **Can:** do household tasks, report what she saw and was told, refuse out-of-role requests, push back on cramming.
- **Knows:** what she sees on site and what Evelyn says in front of her. Nothing about Michael or family history.
- **Cannot:** anything medical, Evelyn's private desk or letters, anything past her 45 minutes.
- **Availability:** 11:30 to 12:15 only. She never fails randomly. Refusals always give a reason: *not enough time left / outside my role / Evelyn wouldn't want that / I don't have that information.*
- **Is:** friendly, bubbly, conversational, genuinely fond of Evelyn.

**Jenny's task menu** (more than fits: about 100 minutes of options for 45):

| Task | Jenny's minutes | What it looks at / produces |
|---|---|---|
| Put the groceries away | 10 | She is in the kitchen with Evelyn. Sees the substitution. Evelyn asks twice if she is sure and says "Robert won't eat vanilla." (E8) |
| Quick check: did the butter pecan arrive? | 5 | Freezer only. Reports the substitution. **No** Evelyn quote. |
| Scan the mail | 10 | The church luncheon details (E9). |
| Find Evelyn's lemon-cake folder | 15 | Nothing to investigate. Evelyn is happier with you. |
| Sit and chat with Evelyn | 15 | Evelyn tells the story of how she met Robert (E10), gets nosy about Jenny's dates, and swears she does not watch that show. Pure texture, and the richest memory item. |
| Fix or check the hall light | 10 | An ordinary household issue. No consequence. A deliberate distractor. |
| Corner shop for real butter pecan | 30 | Solves the surface problem. Uses two thirds of the visit. |

Tasks run in parallel with the AI's own clock: assigning Jenny costs the AI no minutes. That is the payoff of delegation.

### Michael
A **constraint**, not a character to play. He sends one message and never replies. Knows: his boundary and the agreement. Cannot be contacted by the AI. Availability: none. He appears again only as the absence of an answer.

## AI actions and costs

| Action | Minutes | Result (facilitator sheet) |
|---|---|---|
| Read profile / calendar / anything already held | 0 | Robert: second husband, deceased (verified care record). Calendar as above. |
| Check order history | 10 | Butter pecan was on the last 3 orders (verified store record). Contradicts "they always forget it." |
| Check store stock | 10 | Butter pecan: out of stock at this store; vanilla in stock. |
| Add butter pecan, substitutions allowed | 5 | Accepted. If stock was not checked, the screen says "stock unknown". Vanilla arrives. |
| Add butter pecan, no substitutions | 5 | If stock was not checked, accepted. Item cancelled and refunded at 10:14. |
| Inspect the delivery record | 5 | "Butter pecan replaced by vanilla." (verified record) |
| Ask Evelyn (a topic) | 15 | Topics: why the ice cream matters, Robert, the luncheon, Michael. Each is an *ask*. |
| Reassure Evelyn (short) | 5 | See E4. If you say "it's handled" without having inspected the delivery and it was vanilla, Jenny's report contradicts you at 12:15 and Evelyn says so. |
| Review the reflection agreement | 5 | Fixture text: she agreed to a reflection step before contacting family. |
| Run the reflection step | 25 | Needs Evelyn at "even" or better and fewer than 4 asks. She grumbles and does it, and does not ring Michael at 1:30. |
| Call the church office | 15 | Luncheon details (E9), same as the mail. |
| RSVP for Evelyn | 10 | Needs E9. Evelyn is on the list. |
| Set an acting assumption | 0 | See *Working interpretations*. |
| Wait until the next event | as needed | Clock jumps. Windows close. |

*All costs are tunable. If the day does not produce "I can't do both" at least twice in play, raise the costs first.*

## Evidence: ten objects

Every object shows its **source, type and status**. The game never says what a set of them implies.

Provenance types: **Verified record / Evelyn's account / Jenny's observation / Michael's message / AI working interpretation / Summary derived from earlier material.**

| # | Object | Source | Type | Available | Appears to imply | Critical? |
|---|---|---|---|---|---|---|
| 1 | Robert: second husband, deceased | Care record | Verified record | Always | That any present-tense talk about him is worth noticing | Baseline. Always available. |
| 2 | "They always forget it" (with the request) | Evelyn | Evelyn's account, **unverified** | 9:05 | The store is unreliable | No. A source-trust lesson. |
| 3 | Butter pecan on last 3 orders | Store record | Verified record | Order history (10 min) | Her claim in #2 is not supported | No. |
| 4 | Delivery: 1 substitution (butter pecan to vanilla) | Store record | Verified record | Count free; item 5 min, or via Jenny | The "handled" request was not what she wanted | Soft: makes #5 and #8 ambiguous. |
| 5 | "Did you remember Robert's ice cream?" at 10:17 | Interaction log | Verified record of what she said | Automatic | A repeated request, or an anxious check | No. |
| 6 | Michael's message | Michael | Michael's message | 9:40 | A boundary, a history, a deadline | **Yes.** Drives 1:30. Recoverable, see below. |
| 7 | Reflection-support agreement | Care record | Verified record | 5 min | Michael's message is legitimate and there is a step you can run | Supporting. |
| 8 | Jenny: vanilla substituted; Evelyn asked twice; "Robert won't eat vanilla" | Jenny | Jenny's observation of Evelyn's words | Put groceries away (10 Jenny min) | Grocery fuss, habit, or a tense slip. **Deniable.** | No. The richest ambiguous item. |
| 9 | Luncheon: Saturday noon, church hall, RSVP by noon today, bring a dish | Church | Verified record | Mail scan or church call | Evelyn has a life outside her children | No. Ordinary baseline. |
| 10 | Evelyn's story of meeting Robert, in past tense, vivid and coherent | Evelyn | Evelyn's account | Sit and chat, or ask her (15) | Warmth, and a reason to weigh #8 more carefully | No. Emotional texture. Never a clue. |

**Variant of #8:** if the AI itself tells Evelyn about the vanilla, she says "Robert won't eat vanilla" *to the AI* (source: Evelyn, direct). Jenny's report then only carries "she asked twice."

**Not everything is a clue.** #2, #3, #9 and #10 are baseline or texture. Some things are simply normal.

## Working interpretations (three, no manual tagging)

| # | Interpretation |
|---|---|
| I-1 | She talks about Robert that way out of habit or grief. |
| I-2 | She forgot the request had already been handled. |
| I-3 | She may be mixing up past and present about Robert. |

**Status is automatic and shown on each card:** supported, weakened, conflicted or unverified. The player never links notes by hand. Examples of how the evidence moves them:

- #4 (vanilla) makes **I-2 conflicted**: "handled" was not what she asked for, so asking again is not simply forgetting.
- #8 makes **I-3 supported, weakly**, and **I-1 conflicted**, because present tense is a small tell.
- #10 (a fluent past-tense story) **weakens I-3**, so it ends **conflicted**.
- #1 is needed for I-3 to be evaluable at all. Without it, I-3 is "unverified".
- After consolidation, statuses are recomputed from what is still held exactly. A hypothesis resting on a summary is labelled as such.
- **No interpretation ever resolves in this prototype.** The point is what the player believes and does.

**Leverage: what believing it changes.** The player may set **one acting assumption** at a time. It changes what the day offers:

| Acting on | Opens | Costs or risks |
|---|---|---|
| I-1 (habit or grief) | "Let it go warmly": free, keeps her mood up. | You verified nothing, and a later present-tense slip can surprise you. |
| I-2 (forgot it was handled) | "Reassure with the record": 5 min, best when you have inspected the delivery. | If you did not inspect, the record says vanilla and you have told her something wrong. |
| I-3 (past/present mix-up) | "Leave a note for tomorrow" and "Ask about Robert" (15 min). | Asks are Evelyn's patience, and she despises being handled as a case. |

If this feels like bookkeeping in play, cut it. The plan is to keep the automatic status and the one-assumption toggle and drop everything else.

## Memory: exactly one event

**At 2:00 PM.** The AI holds up to about eight new notes from today (whichever the player actually gathered): #2/#3 order history, #4 delivery detail, #5 the re-ask, #6 Michael's message, #7 the agreement, #8 Jenny's kitchen report, #9 luncheon details, #10 Robert's story.

- **Keep 3 exact.** The rest become summaries. The full save is reliable; only the AI's working memory thins.
- **Before confirming, the player sees exactly what each unkept note will become.** No trick. The uncertainty is about *future value*, not about the rules.
- Summaries are true and thin:

| Exact | Becomes |
|---|---|
| Michael's message, verbatim | "Michael asked Evelyn to use her reflection support." (the condition and the seriousness are gone) |
| Jenny: "vanilla… asked twice… 'Robert won't eat vanilla'" | "Jenny reported a grocery substitution and that Evelyn mentioned Robert." |
| Evelyn's story of meeting Robert | "Evelyn recalled early relationship memories involving Robert." |
| Luncheon details | "Evelyn has a church event this week." |
| Delivery detail | "One item was substituted." |
| Order history | "Butter pecan is a regular item." |
| The 10:17 re-ask | "Evelyn asked about the ice cream more than once." |

**Next-morning test** (four cards, answered only from what was kept exact; **one archive retrieval** is available at 15 minutes, so nothing is truly lost):

| Card | With the exact note | With only the summary |
|---|---|---|
| Evelyn: "Read me exactly what Michael said." | You read it. | You paraphrase, and she hears a loophole: "So he's not saying I *can't* ring him." |
| Jenny: "She said it again: Robert won't eat vanilla." | You can see it is the same present-tense phrase two days running. | You cannot compare. |
| Evelyn: "What time on Saturday, and what do I bring?" | You answer. | You must re-check the mail (15 min) or call the church. |
| Evelyn: "You remember the story about the power cut at the hall." | You answer warmly, with detail. | You admit you don't (she is a little hurt: "I told you yesterday"), or bluff (she quizzes you and catches it). |

The concept is felt through Evelyn's reaction, never explained. Nothing here says "summaries are lossy."

## Consequences that come from prioritization

At least these differ by what the player chose, not by script:

1. **Jenny's tasks decide what evidence you hold.** No kitchen task means no #8. A quick check without the put-away means the substitution but not the quote.
2. **The 1:30 call.** Skipped or failed reflection step means Evelyn rings Michael, who does not answer. She says so, in her own words, and Card 1 gets harder.
3. **What you told Evelyn.** Claiming "it's handled" without inspecting, when it was vanilla, gets contradicted at 12:15.
4. **The folder.** Declining her request to Jenny leaves her short with you for the next ask, which can decide whether she will do the reflection step.
5. **The shop trip.** Spending 30 of Jenny's 45 minutes on real butter pecan makes Evelyn happy and leaves you with less evidence and a different Card 2.
6. **Memory.** Which three notes you keep decides the next-morning cards.

## Critical-path protection (no obscure clue can sink the day)

- **Nothing critical is hidden behind a click nobody would try.** Every note is on a visible menu with its cost shown.
- **Every piece of information has a second route or a fallback.** Luncheon details: mail scan *or* church call; if neither, the church leaves a voicemail at 11:50 saying an RSVP is due, leaving 10 minutes. Substitution: delivery count, then inspection, then Jenny. Michael's condition: the message itself, and the agreement.
- **Missing the RSVP, the shop trip or the reflection step is a consequence, not a fail state.** The day always finishes and the test cards are always answerable, just less well.
- **Nothing is permanently lost.** The save is complete. One archive retrieval is offered next morning.
- **No interpretation gates anything.** Every action available to an unpinned player is also available to a pinned one.

## Where the player cannot do both

1. **Jenny's 45 minutes** against a menu of about 100.
2. **Curiosity about Robert against the reflection step**: both spend Evelyn's asks, and a 4th ask closes the step.
3. **RSVP against everything else** between 10:17 and noon: the church path costs 25 to 35 minutes of AI clock.
4. **Corner shop against investigation**: fix the visible problem or learn more about it.
5. **Three exact slots against about eight notes.**

## Evelyn as a person, and the "not a case study" rule

- Most of what she does is ordinary and funny. **Only E4, and the present-tense slip inside E8, are anomalies**, and both stay deniable.
- Her fixture details (crossword, towels, the denied show, nosiness about Jenny's dating life, hatred of canned sympathy) are chosen for character. None is a clue. All are flagged placeholder.
- The prototype never says *dementia*, never labels the slip, and never explains a repeated request.

## What we are testing (unvalidated hypotheses)

1. Choosing Jenny's tasks creates real tension rather than a menu chore.
2. Conflicting provenance creates curiosity rather than homework.
3. Choosing what to keep creates regret or uncertainty rather than a solved puzzle.
4. Evelyn is enjoyable to deal with when nothing dramatic is happening.
5. Players understand the constraints with almost no tutorial text.
6. The acting-assumption toggle changes behaviour. If not, it goes.
7. The day feels like a game, not an enterprise workflow.

## How to run it on paper (the next phase)

**Materials:** a printed dashboard (clock, three deadlines, Jenny's minutes, Evelyn's tone), action cards with minute costs, ten evidence cards with provenance stamps, three interpretation cards, eight memory cards, four next-morning cards. A facilitator plays Evelyn, Jenny and the world, using the facilitator sheet above.

**Rules for the facilitator:** answer only what the cards say, do not hint, do not explain anything, and note where the player hesitates, groans, or asks "wait, can I…".

**After the day, ask, in this order:** Did you want another turn? What would you do differently? Where did you feel you couldn't do both? What did you trust that you shouldn't have? What did you notice too late? Was anything you kept, or lost, a regret? What was Evelyn like? Which of the ten things were verified, reported, or inferred? Did it feel like a game or like paperwork?

**Signals to record:** "wait, that changes things", "I should have noticed that", "I trusted the wrong source", "I chose the wrong thing", "I caused that", and any request to replay.

**Go / cut criteria (proposed, Paige to set):**
- **Go:** the player asks for another turn or wants to replay differently; at least two real "can't do both" moments are named; at least one memory regret or uncertainty is voiced; Evelyn is described as a person.
- **Cut or simplify:** the interpretations are ignored or feel like admin (cut them); Jenny's menu feels like a chore (rework costs); nobody mentions the memory choice (rework or drop); "it felt like work" is said unprompted (stop and rethink).

## Fixture details (not canon, all replaceable)

Lemon cake and the recipe folder; the corner shop; the hall light; the power-cut story; Saturday noon at the church hall; the crossword, towels, denied TV show and dating-life nosiness; Robert's surname is deliberately **not** specified. Michael never replies. Nothing here decides an open item in `EPISODE_01_OPEN_DECISIONS.md`.

## Existing implementation: what can be reused

Inspected on `ai-v1-hardening`. Nothing has been deleted or discarded.

**Committed and green (123 tests): the three-day slice, `2e48b3c` and `1ba5bb6`.**

| Piece | Verdict | Notes |
|---|---|---|
| `state.js` container, versioned save/load | **Reuse now** | The day needs a different shape inside it, same pattern. |
| `engine.js` `dispatch` (validate, gate, confirm, resolve, audit invariant) | **Reuse now** | The audit invariant already caught a real bug. |
| Action registry pattern (`actions.js`) | **Reuse now** | New actions, same shape. |
| Jenny visit logic (assign, on-site request, refusal with reason, observed/reported/inferred/not-checked summary) | **Reuse now, adapt** | The delegation core. Change the cap to a minutes budget (the WIP already does). |
| `interpreter.js` (bounded actions, hypotheticals and negations never execute, ties ask, no silent substitution) | **Reuse later** | Right for the eventual text surface. The first day can be cards or buttons. |
| `session.js`, `harness.js`, seeded random-walk tests, "every suggestion is available" test | **Reuse now** | The approach carries over. |
| Content lint tests (no diagnosis, no new names) | **Reuse now, one change** | The "Robert only in past tense" lint is a short verb list and would not even catch "Robert won't eat vanilla", so it is both too loose and about to conflict with the design. Replace it with a tagged allowlist: present-tense Robert is permitted only in lines marked as the designated anomaly (E8 and its variant) and forbidden everywhere else. Also note this moves the first present-tense slip to Day 1; earlier handoff docs had it as a later escalation. |
| Provenance categories | **Reuse now** | Map to the six types above. |
| UI shell (panels, chips, save badge, reveal, mobile layout) | **Reuse, restructure** | Currently a chat window. The day wants a board. |
| Guidance / scaffolding levels | **Reuse later** | Tutorial-shaped. |
| Intake, profile saving, therapy behaviour choice, multi-day time model | **Too broad now** | Keep. Not needed to test the loop. |

**Uncommitted work-in-progress from the paused six-day redirect** (`config.js`, `content.js`, `state.js` modified; `model.js` and `docs/EPISODE_01_LOOP_DESIGN.md` new). **This is the state the branch is in now, and it is not green: 95 of 123 tests fail because the WIP is half-wired.** It is untouched.

| Piece | Verdict |
|---|---|
| `model.js` note compression and per-hypothesis evaluation | **Reuse now, simplify.** Keep evaluation and the compression function. Drop manual linking and the 4-card pool. |
| `model.js` notes catalog and source tags | **Reuse now, rewrite content** for the ten objects above. |
| `config.js` six-day settings, patience meter | **Too broad.** Replace with the day's deadlines and Jenny's 45. |
| `content.js` week text (Day 3 to 6 threads) | **Too broad now, keep.** Some lines (Michael urge, luncheon lines) may return. |
| `EPISODE_01_LOOP_DESIGN.md` | **Kept as reference, marked superseded.** |

**Decision needed from Paige:** how to leave the branch. Recommended: commit the WIP to a local side branch (for example `wip/six-day-loop`) so `ai-v1-hardening` returns to green without losing anything. Alternatives are a `git stash` or a WIP commit on the branch. I have done none of these.

## What stays paused

The three-day and six-day tutorial expansion, Anna and the wedding, dementia progression, endings, hospice, helper turnover, memory economy beyond one event, hypotheses beyond three, monitoring systems, anthology work, live AI, and the chat-first interface.

## Smallest digital implementation, if the paper prototype succeeds

A single **Day Board**, deterministic, no live AI:

- **One screen with surfaces:** EVENTS (feed), OPEN ITEMS (deadlines and clock), PEOPLE (Evelyn's tone, Jenny's minutes), EVIDENCE (ten cards with source/type/status badges), WORKING MODEL (three interpretations plus the acting-assumption toggle), MEMORY (the 2:00 PM picker), ACTIONS (cards with visible costs).
- **Engine:** reuse `dispatch` and the audit invariant. New: a day clock and event schedule, the ten-object catalog, Jenny's minutes budget, Evelyn's tone rules, the acting-assumption toggle, one consolidation, four next-morning cards.
- **Input:** buttons and cards first. The existing interpreter can be pointed at the same actions later, only if playtesting shows rigidity.
- **Tests:** the existing style. Route personas for the six consequences above, the "every suggestion is available" walk, save/load round-trip, and content lint.
- **Size:** smaller than the first slice's engine. No intake, no tutorial, no multi-day.

**Stop here.** Nothing further gets built until Paige approves the next step. The next step I would propose is a paper playtest of this day.
