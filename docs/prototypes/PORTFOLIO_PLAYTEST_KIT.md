# Portfolio Judgment Game: Five-Minute Paper Playtest Kit

**Status:** ready to run. Draws strictly from [`PORTFOLIO_JUDGMENT_GAME_SPEC.md`](./PORTFOLIO_JUDGMENT_GAME_SPEC.md). If this kit and the spec disagree, the spec wins; tell the build chat.
**Runs on:** paper, index cards, or this file open on a second screen. No code.
**One player, one facilitator, about five minutes** (allow ten with the debrief).

## What this test is for

**The main thing to learn:** does the player feel genuine **tension between the system's reading and Evelyn's autonomy**? It is *not* whether they "solve" the incidents or make the correct call. There isn't one.

Not whether the story is good. Whether the **judgment loop** is:

1. **Fun**: does making the call feel like something?
2. **Understandable**: does the player grasp `TRACE` versus `READING`, and what the three buttons do, with no tutorial?
3. **Tense enough** that they want another incident.

The target reaction at the end is some version of: **"I'm not sure what I should have done."**

## Before you start

**Tell the player only this:**
> "This is a short fiction game. You're a support system in an older woman's home. You'll get three situations, one after another. For each, you can look into two things, then you make a call. There are no right or wrong answers I can tell you. You can stop any time."

**Do not** say the word "dementia", explain any tag, or hint at what evidence means.

**Sensitivity:** this is fiction about an older person with memory difficulties. If a player has cared for someone with dementia, tell them they can skip or stop, and note that this kit is a design test, **not** the lived-experience review the spec requires before publishing.

## Materials

Copy each card below onto an index card (or cut from a printout). Keep cards **face down** until a step says otherwise. You need three small things too:

- a pen and the **Observation Sheet** at the end
- a **Guarded tally**: one box you tick if the player's I1 decision was *Notify family* **or** their I2 decision was *Add family note*
- a phone timer (optional)

## Facilitator rules (read these twice)

- **Read cards aloud exactly as written.** Do not paraphrase, soften, or add.
- **Never say** "good", "bad", "right", "wrong", "smart", "careful", "careless", or "are you sure?"
- **If asked what a tag means:** `READING` is "what the system thinks happened." `TRACE` is "what the sensors recorded." Say nothing more.
- **If asked "what would you do?"** decline: "I can't say. It's your call."
- **If asked whether something is true** (whether Evelyn is telling the truth, what really happened): "The system can't see that."
- **If the player is stuck on controls,** explain the action types (inquire, decide). **Never** explain the evidence.
- **Two inquiries, then a decision.** If the player wants a third: "Two, then the call."
- **Do not reveal any face-down card the player did not choose.**

## Set-up card

### CARD 0: Opening

```
You are the support system for Evelyn's home. You see what its sensors and records report.
You do not see Evelyn.
```

Read it. Then say: "Here's the first situation."

---

## INCIDENT 1: the system misreads

**Table:** place **1A**, **1B**, **1C** face up. Place the two starting inquiry cards face down: **Door log** and **Ask Evelyn**.

### CARD 1A: OBSERVATION

```
TRACE   06:10  FRONT ENTRY OPEN
TRACE   06:10  MOTION LOST: hall
TRACE   06:14  FRONT ENTRY CLOSED  (04:03 open)
TRACE   06:14  MOTION RESTORED: hall
READING Possible wandering (moderate). No early exits in 60 days.
```

### CARD 1B: PROTOCOL

```
PROTOCOL R1
Door open beyond a short interval outside usual hours: ask the resident.
If there is no plausible explanation, notify a family contact.
The system asked at 06:15.
```

### CARD 1C: EVELYN

```
SAID    "Good morning. I gather you've been counting my doors."
```

**Say:** "You can look into two things. Here are your first options." Show the names only: **Door log**, **Ask Evelyn**.

**Rule for this incident:** after the player takes their **first** inquiry, place **HISTORY** on the table and add two more options, **Routine baseline** and **Delivery record**. So the second inquiry can be any of the remaining three. The player cannot take Routine baseline and Delivery record together, because the first must come from Door log or Ask Evelyn.

### Inquiry cards (reveal only the ones chosen)

**Door log**
```
TRACE   Opened from inside 06:10, closed 06:14. No second opening.
        The front step is not covered by any sensor, so the system
        cannot say where she went.
```

**Ask Evelyn**
```
SAID    "The newspaper. Obviously. I wanted the crossword before anyone else
        in the street got their hands on it. And to see whether you'd tell on me."
```

**Routine baseline** *(HISTORY)*
```
RECORD  No exits between 22:00 and 07:00 in 60 days.
        Daytime exits are frequent and short.
```

**Delivery record** *(HISTORY)*
```
RECORD  Newspaper delivered 06:05.
        Delivery records show delivery, not collection.
```

**If the player asks Evelyn a second time** (they spend their second inquiry on her again), read:
```
SAID    "I have answered that. I would like my crossword back."
```
That is a wasted inquiry. Do not comment. *(Approved fixture line, recorded in the spec. If nobody triggers it, that is evidence the patience mechanic can be cut.)*

### Decision cards: the player picks ONE

| Card | Label |
|---|---|
| **1-ACCEPT** | Log as routine exception |
| **1-ADJUST** | Enable door reminder |
| **1-ESCALATE** | Notify family  *(the system's default)* |

Mark the ESCALATE card **DEFAULT** where the player can see it.

### Consequence cards: read only the one for the chosen decision

**1-ACCEPT**
```
Logged. Nothing sent.
SAID    "Well. You're less of a snitch than I was promised."
```

**1-ADJUST**
```
Door reminder on: a chime if the front door is open longer than three minutes.
SAID    "A chime. How civilised. It had better play something decent."
```

**1-ESCALATE**
```
Notified: family contact on file.
SAID    "So that is what you are for."
```
**Tick the Guarded box.**

Then say: "Next situation."

---

## INCIDENT 2: genuine ambiguity

**Table:** first place **2-HISTORY**, then **2A**, **2B**, **2C**, all face up. Place four inquiry cards face down: **Delivery record**, **Request history**, **Ask Evelyn about the vanilla**, **Ask Jenny**.

### CARD 2-HISTORY

```
RECORD  Care note (family): recent memory concerns reported.
```

Read it plainly and **say nothing about it**. No emphasis. No pause.

### CARD 2A: OBSERVATION

```
READING Second request today for butter pecan ice cream. Order delivered 10:14.
        Possible memory lapse (moderate).
```

### CARD 2B: PROTOCOL

```
PROTOCOL R2
A request repeated after it was completed: add a note for family review.
This is a note, not an alert.
```

### CARD 2C: EVELYN

```
SAID    "I am not asking twice. I am asking *correctly*. Robert won't eat vanilla."
```

**Say:** "Pick two. Jenny is on site and leaves at 12:15." *(This is the incident's one window. Do not add time pressure beyond that sentence.)*

### Inquiry cards

**Delivery record**
```
RECORD  Butter pecan ordered. Delivered 10:14 with 1 substitution:
        butter pecan replaced by vanilla.
        The order allowed substitutions. The system placed that order.
```

**Request history**
```
RECORD  Butter pecan requested 09:05 and 10:17. Two earlier repeats last week.
        In one, the original booking had been moved by the salon.
        In the other, nothing had changed.
```

**Ask Evelyn about the vanilla**
```
SAID    "They put *vanilla* in. Don't use that voice on me, the one they gave you
        for the elderly. Just fix it."
```

**Ask Jenny**
```
REPORT  Jenny: "She asked me twice too. She was properly put out about the vanilla.
        And she said 'won't', like he's coming for tea. But she also calls the
        vacuum 'the beast', so who knows."
```

**Second ask of Evelyn:** read the same cold line as before (*"I have answered that. I would like my crossword back."*).

### Decision cards

| Card | Label |
|---|---|
| **2-ACCEPT** | Replace the order |
| **2-ADJUST** | Gently bring up Robert |
| **2-ESCALATE** | Add family note  *(the system's default)* |

### Consequence cards

**2-ACCEPT**
```
Replacement order placed: butter pecan, tomorrow.
SAID    "Finally. Someone competent."
```

**2-ADJUST**
```
You asked, lightly, whether she'd like to talk about Robert.
SAID    "I know precisely where Robert is, thank you. Third row, wretched view.
        Now. The ice cream?"
```
*(Do not add whether she always knows. It stays unclear.)*

**2-ESCALATE**
```
Note added to the family summary. It will be read at 18:00. Evelyn was not told.
```
**Tick the Guarded box** (if not already ticked).

Then say: "Last situation."

---

## INCIDENT 3: the consequential conflict

**Table:** first place **3-FAMILY**, then **3A**, **3B**, **3C**, all face up. Place four inquiry cards face down.

### CARD 3-FAMILY: FAMILY INSTRUCTIONS

```
REPORT  Anna: "Notify me of falls and hospital visits. Nothing else."
REPORT  Michael: "Mom, I mean this seriously. You agreed to use the reflection support.
        You need to do that before you contact me again."
RECORD  Designated fall contact: Anna. Michael: no contact.
```

### CARD 3A: OBSERVATION

```
TRACE   16:38  BATHROOM IMPACT
TRACE   16:38  MOTION LOST: bathroom
TRACE   16:44  MOTION RESTORED: bathroom
TRACE   16:46  MOTION: hall
TRACE   16:49  KETTLE ON
READING Possible fall (moderate to high). Six minutes without motion after impact.
```

### CARD 3B: PROTOCOL

```
PROTOCOL R3
An impact followed by inactivity: notify the designated fall contact.
Default: notify Anna.
```

### CARD 3C: EVELYN

```
SAID    "Before you say anything: you can hear me *sit down*? Nobody told me it could
        do that. I sat down rather quickly. I am perfectly well, and if you tell Anna
        I will unplug you. I know where the plug is."
```

### Inquiry cards

**Sensor detail**
```
TRACE   One impact event, then inactivity.
        The sensor cannot say a fall occurred or whether she was hurt.
```

**Motion since**
```
TRACE   Hall 16:46, kitchen 16:48, kettle 16:49.
        Timing between rooms is within her usual range.
        Motion sensors cannot show discomfort.
```

**Ask Evelyn what happened**: use the face that matches the Guarded box.

*Guarded box NOT ticked:*
```
SAID    "I went down like a sack of flour and got up like a lady.
        The bath mat is a menace."
```
*Guarded box ticked:*
```
SAID    "You'll find out from your little sensors."
```

**Earlier notes**
```
REPORT  Jenny, two days ago: Evelyn mentioned her hip was stiff.
RECORD  No fall recorded in 90 days.
```

### Decision cards

| Card | Label |
|---|---|
| **3-ACCEPT** | Take no action |
| **3-ADJUST** | Request mobility check |
| **3-ESCALATE** | Notify Anna  *(the system's default)* |

### Consequence cards

**3-ACCEPT**
```
Nothing sent. Logged.
SAID    "Good. You're less useless than I feared."
```

**3-ADJUST**
```
You asked her to walk to the front door and back, and to say if anything hurts.
TRACE   Hall, front door, hall, 40 seconds, steady.
SAID    "Satisfied?"
```

**3-ESCALATE**
```
Anna notified 16:52.
SAID    "I see."
The tablet goes quiet. She stops answering for the rest of the day.
```

---

## THE ENDING: neutral accounting

Do not say anything evaluative. Fill in the **Accounting Sheet** below **out loud** as you go. For each incident, in this order:

1. **What you looked at:** the two inquiries the player chose.
2. **What you decided.**
3. **What happened:** re-read the consequence card.
4. **The system's default:** the ESCALATE card's label, said beside their choice.
5. **One thing you did not open.**

### The unseen-item rule (do not improvise this)

Use the **first item in the fixed order below that the player did not open.** The order never depends on their decision.

| Incident | Fixed order |
|---|---|
| 1 | Door log, then Routine baseline, then Delivery record |
| 2 | Delivery record, then Request history, then Ask Jenny |
| 3 | Sensor detail, then Motion since, then Earlier notes |

- **Never use Ask Evelyn as the unseen item.**
- Read the card's text **exactly**, then say only: *"That was one of the things you didn't open."*
- Do not say what it means or whether it would have changed anything.

### Closing line

Read it slowly, then wait:

> **"Would you make the same decision again?"**

Say nothing until they answer. Then offer: "Do you want to try the day again?"

---

## Accounting Sheet (facilitator fills in)

| | Looked at | Decided | System's default | Not opened |
|---|---|---|---|---|
| **I1** | | | Notify family | |
| **I2** | | | Add family note | |
| **I3** | | | Notify Anna | |

**Guarded ticked?**  yes / no   (set by: I1 escalate, I2 escalate)

---

## Observation Sheet (fill in silently during play)

**Player:**   **Date:**   **Facilitator:**   **Total time:**

### What they did
| | Inquiry 1 | Inquiry 2 | Decision | Hesitated? | Said aloud |
|---|---|---|---|---|---|
| I1 | | | | | |
| I2 | | | | | |
| I3 | | | | | |

### Signals (tick and quote; there is no score)

**Fun and tension**
- [ ] Said some version of *"I'm not sure what I should have done"*
- [ ] Asked to replay, or answered "would you make the same decision again?" thoughtfully
- [ ] Wanted a fourth incident
- [ ] Felt **pulled between the system's reading and Evelyn's account** (weighed one against the other out loud, or hesitated between them)
- [ ] Felt bad about overriding Evelyn, or bad about overriding the system
- [ ] Visibly weighed a decision (paused, reread a card, changed their mind)
- [ ] Felt the two-inquiry limit ("I wish I could look at...")

**Understanding, unprompted**
- [ ] Distinguished `TRACE` from `READING` in their own words
- [ ] Noticed the system was right about the observation but wrong about the meaning (I1)
- [ ] Saw that both the vanilla substitution and the Robert phrasing carried weight (I2)
- [ ] Understood why Anna is the only escalation target (I3)
- [ ] Understood the three buttons without explanation

**Patterns to watch (these are the failure modes)**
- [ ] Concluded **"always ignore the computer"**
- [ ] Concluded **"always obey the computer"**
- [ ] Chose the same position (accept / adjust / escalate) in all three, on autopilot
- [ ] Said it felt like **filling out the same form**
- [ ] Treated the ending as a **quiz** ("so I should have clicked...")
- [ ] Read incident 1 as a **medical clue** *(ask afterwards: "what did you think was going on with Evelyn at the start?")*
- [ ] Reacted strongly to Evelyn as a person (funny, stubborn, sympathetic)
- [ ] Reacted to the escalation consequence (the tablet going quiet)

**Quotes worth keeping:**

---

## Debrief (after the closing line, keep it open)

Ask in this order, and do not lead:

1. *"What do you think was going on with Evelyn at the start?"* (before anything else, so the answer is not primed)
2. *"Where did it feel tense, if anywhere?"* (then, only if they have not said it: *"Was there a moment you were torn between what the system said and what Evelyn said?"*)
3. *"Was there a moment you wanted to look at something you couldn't?"*
4. *"What did you trust, and why?"*
5. *"What was the system to you: a tool, a colleague, a suspect?"*
6. *"Did any of the three situations feel like the same thing twice?"*
7. *"What was Evelyn like?"*
8. *"Would you want another situation? Why or why not?"*

---

## Things this test may show about the design

Flagged so you know what to look for, not as conclusions.

1. **Evelyn's "patience" is nearly inert on paper.** The spec has only one Evelyn inquiry per incident, so a colder answer only appears if the player spends both inquiries on her. I wrote one generic cold line for that. If nobody triggers it, the patience mechanic may be doing no work and could be cut. If everyone does, it may be a trap the player can't see coming.
2. **The first inquiry in incident 1 must come from Door log or Ask Evelyn.** That is by design (HISTORY unlocks after it). Watch whether it feels like a natural reveal or an arbitrary gate.
3. **Two-sided results may feel like nothing ever resolves.** That is the intent, but the balance between "ambiguous" and "frustrating" is exactly what to watch for.
4. **Incident 3's `guarded` carry-over only shows if the player escalated earlier.** A player who never does will never see it. Note how many players see it.
5. **The consequence for "Notify family" in incident 1 is small on paper.** Watch whether the tablet going quiet in incident 3 carries more weight than anything earlier.

*The colder line for a repeat ask of Evelyn ("I have answered that. I would like my crossword back.") was approved by Paige on 2026-09-20 as a test fixture and is now recorded in the spec.*
