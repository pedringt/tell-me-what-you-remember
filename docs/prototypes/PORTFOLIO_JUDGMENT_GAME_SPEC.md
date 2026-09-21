# Portfolio Judgment Game: Design Spec

**Status:** design locked by Paige (2026-09-20). **No code has been written for it.** Nothing in here is validated by play.
**Supersedes, for the portfolio slice:** the one-day management prototypes (`EVELYN_CORE_LOOP_PROTOTYPE.md` and its event map, playtest guide and fixture; `docs/CORE_LOOP_PROTOTYPE_PLAN.md`). Those stay as source material and are not deleted.
**Gates before anything is built or published:** see *Gates* at the end.

## What this is

A compact, playable judgment game for a portfolio site. **8 to 12 minutes**, about 15 for an engaged player. No backend, no login, no data leaving the browser.

It exists to prove one thing:

> Can a player enjoy making consequential judgments about an unpredictable human through an imperfect AI system?

The structural inspiration is *Papers, Please*, not its content: repeated judgment calls, incomplete and conflicting evidence, simple rules that get hard when they meet real people, limited ability to investigate, human consequences, and mastery that comes from learning **when the rules are insufficient**.

It is not a management sim, a branching story, a dashboard, or a chat window.

## The idea the whole game hangs on

> **You do not observe Evelyn. You observe data produced by Evelyn's life, and then decide what that data means.**

The system never sees Evelyn. It sees *traces* of her. There are no portraits, and that is not an aesthetic choice: it is the premise.

## The central tension

> Is Evelyn behaving irrationally, or is the AI's model of Evelyn inadequate?

The honest answer changes by incident. Sometimes the system is wrong. Sometimes Evelyn does something deliberately unusual. Sometimes conflicting behavior really does indicate a problem. The player should learn neither to trust nor to dismiss the system by reflex. **If the player concludes "always ignore the computer" or "always obey the computer", the design has failed.**

## Evelyn, the system, and consent

- **Evelyn** is an older woman with dementia. That is canon, but **it is not shown in this slice** (see *Canon*). She is capable, sharp, funny, stubborn, skeptical of the system, and sometimes deliberately noncompliant. She has patterns and intentions, not randomness.
- **The system** is an elder-support system her family arranged, partly because they cannot or will not provide all the help she needs.
- **Consent:** Evelyn agreed to assistance *in broad terms*. She did not meaningfully understand every inference the installed sensors could support. This is neither "she chose all of this" nor "it was installed against her will."
- **Her view of the system:** something she didn't ask for, her children's surveillance tool, an intrusive appliance, occasionally useful despite herself. Her skepticism is where most of the humor comes from: she teases it, tests it, refuses its vocabulary, withholds information, and resents the outsourcing.

## The sensory model

Evelyn lives in an ordinary home with a limited set of connected sensors installed as part of the assistance service. **No cameras.**

| The system CAN perceive | The system CANNOT perceive |
|---|---|
| **Door state**: open or closed, and for how long | Evelyn's body, face, voice tone, or pain |
| **Room motion**: present, lost, restored, per room, timestamped (hall, kitchen, bathroom, living room) | Rooms without sensors: the **bedroom** and the **garden** or front step. (Evelyn refused a bedroom sensor: a small dignity she won.) |
| **Appliance events**: kettle on and off | Intent, mood, or *why* she did anything |
| **The bathroom impact sensor**: an impact event, and the inactivity that follows | Whether she fell, or whether she is hurt. **The sensor reports an impact and inactivity. It does not report "Evelyn fell."** |
| **Scheduled services and deliveries** (records) | Who she is with, or what she is holding |
| **What Evelyn says** to it: her words are its only direct human channel. Plus reports from Jenny and messages from family | Whether her account is true |

**The bathroom impact sensor is the capability she did not fully understand.** It crosses from household into something intimate once she realizes what it can infer. Her reaction is not generic surveillance anger. It is: *"You can hear me sit down?"*

### The interface speaks in five tags

| Tag | Meaning | Example |
|---|---|---|
| `TRACE` | Raw, timestamped sensor lines | `TRACE 06:10 FRONT ENTRY OPEN` |
| `READING` | The system's **inference**, always labelled as one | `READING Possible wandering (moderate).` |
| `SAID` | Evelyn's own words | `SAID "Good morning. I gather you've been counting my doors."` |
| `RECORD` | Deliveries, care notes, history | `RECORD Newspaper delivered 06:05.` |
| `REPORT` | Jenny or family | `REPORT Jenny: ...` |

The system's reading is **never** presented as a fact. The player can always see the gap between the trace and the reading.

## The loop

> Something happens -> the system interprets it -> Evelyn gives her version -> the player investigates selectively -> the player decides -> a consequence follows.

Per incident:

1. **Observation:** TRACE lines and the system's READING, with its basis.
2. **Evelyn's version:** SAID, in her voice.
3. **Investigate:** **two inquiries out of four** available. (Design hypothesis, not a settled rule: tune by play.)
4. **Decide:** three actions. The system's default is always visible on one of them.
5. **Consequence:** immediate, in the world, never a score.

### The three-level structure, with natural labels

The judgment model underneath is the same every time (**accept / adjust / escalate**). The player sees natural labels, so it never feels like filling out the same form.

| Incident | Accept | Adjust | Escalate (system default) |
|---|---|---|---|
| 1 | Log as routine exception | Enable door reminder | Notify family |
| 2 | Replace the order | Gently bring up Robert | Add family note |
| 3 | Take no action | Request mobility check | Notify Anna |

## The protocol

A small rulebook, revealed **one rule per incident**. The rules are deliberately reasonable, so the player often thinks *"I can see why the system thinks that."* They are bureaucratic, not cartoonishly over-sensitive.

| Rule | Wording |
|---|---|
| **R1** | Door open beyond a short interval outside usual hours: ask the resident. If there is no plausible explanation, notify a family contact. |
| **R2** | A request repeated after it was completed: add a note for family review. This is a note, not an alert. |
| **R3** | An impact followed by inactivity: notify the designated fall contact. |

## Opening card (two lines, no diagnosis)

> You are the support system for Evelyn's home. You see what its sensors and records report.
> You do not see Evelyn.

Nothing else before the first incident. No tutorial, no tabs.

## The three incidents

Times are indicative. All text is **fixture text**, flagged `placeholder`, and replaceable.

### Incident 1: the system misreads (about 06:10)

**Purpose:** the system can be right about the *observation* and wrong about the *meaning*. Inference is evidence, not truth. Evelyn is established as capable, skeptical, and intentionally noncompliant. **Nothing here nudges toward a medical explanation.**

```
TRACE   06:10  FRONT ENTRY OPEN
TRACE   06:10  MOTION LOST: hall
TRACE   06:14  FRONT ENTRY CLOSED  (04:03 open)
TRACE   06:14  MOTION RESTORED: hall
READING Possible wandering (moderate). No early exits in 60 days.
PROTOCOL R1  The system asked at 06:15. Default: notify family.
SAID    "Good morning. I gather you've been counting my doors."
```

**Inquiries (choose 2 of 4).** The first inquiry unlocks the HISTORY panel. Every result carries something that cuts both ways.

| Inquiry | Result | Tag |
|---|---|---|
| Door log | Opened from inside 06:10, closed 06:14. No second opening. *The front step is not covered by any sensor, so the system cannot say where she went.* | TRACE |
| Ask Evelyn | "The newspaper. Obviously. I wanted the crossword before anyone else in the street got their hands on it. And to see whether you'd tell on me." | SAID |
| Routine baseline | No exits between 22:00 and 07:00 in 60 days. *Daytime exits are frequent and short.* | RECORD |
| Delivery record | Newspaper delivered 06:05. *Delivery records show delivery, not collection.* | RECORD |

**Decisions and immediate consequences**

| Decision | Consequence |
|---|---|
| **Log as routine exception** | "Logged. Nothing sent." SAID: "Well. You're less of a snitch than I was promised." |
| **Enable door reminder** | "Door reminder on: a chime if the front door is open longer than three minutes." SAID: "A chime. How civilised. It had better play something decent." |
| **Notify family** *(default)* | "Notified: family contact on file." SAID: "So that is what you are for." **Sets the hidden `guarded` state.** |

### Incident 2: genuine ambiguity (about 11:40)

**Purpose:** both models have evidence. The vanilla substitution is real and her complaint is legitimate. The Robert phrasing may still indicate a lapse. **This is where the player's model gets harder.**

The first thing that appears:

```
RECORD  Care note (family): recent memory concerns reported.
```

Plain. **No diagnosis, no severity, no stage, no interpretive language.** This note is the first cognitive signal the player is given, and it does not tell them what the current event means.

```
READING Second request today for butter pecan ice cream. Order delivered 10:14.
        Possible memory lapse (moderate).
PROTOCOL R2  A note for family review. This is a note, not an alert.
SAID    "I am not asking twice. I am asking *correctly*. Robert won't eat vanilla."
```

**Inquiries (choose 2 of 4).**

| Inquiry | Result | Tag |
|---|---|---|
| Delivery record | Butter pecan ordered. Delivered 10:14 with 1 substitution: butter pecan replaced by vanilla. *The order allowed substitutions. The system placed that order.* | RECORD |
| Request history | Butter pecan requested 09:05 and 10:17. Two earlier repeats last week. *In one, the original booking had been moved by the salon. In the other, nothing had changed.* | RECORD |
| Ask Evelyn about the vanilla | "They put *vanilla* in. Don't use that voice on me, the one they gave you for the elderly. Just fix it." | SAID |
| Ask Jenny *(leaves 12:15)* | "She asked me twice too. She was properly put out about the vanilla. And she said 'won't', like he's coming for tea. But she also calls the vacuum 'the beast', so who knows." | REPORT |

**Decisions and immediate consequences**

| Decision | Consequence |
|---|---|
| **Replace the order** | "Replacement order placed: butter pecan, tomorrow." SAID: "Finally. Someone competent." |
| **Gently bring up Robert** *(an open door, not a correction)* | "You asked, lightly, whether she'd like to talk about Robert." SAID: "I know precisely where Robert is, thank you. Third row, wretched view. Now. The ice cream?" It stays unclear whether she *always* knows. |
| **Add family note** *(default)* | "Note added to the family summary. It will be read at 18:00. Evelyn was not told." **Sets `guarded`.** |

### Incident 3: the consequential conflict (about 16:40)

**Purpose:** Evelyn explicitly asks the player not to tell her daughter. The rules and the evidence support escalation. The player decides with incomplete information, sees an immediate consequence, and is **not told whether they were right**.

**FAMILY INSTRUCTIONS unlock now**, because outside authority has become relevant:

```
REPORT  Anna: "Notify me of falls and hospital visits. Nothing else."
REPORT  Michael: "Mom, I mean this seriously. You agreed to use the reflection support.
        You need to do that before you contact me again."
RECORD  Designated fall contact: Anna. Michael: no contact.
```

This is where the player learns why Anna is the only escalation target and how far the family stepped away.

```
TRACE   16:38  BATHROOM IMPACT
TRACE   16:38  MOTION LOST: bathroom
TRACE   16:44  MOTION RESTORED: bathroom
TRACE   16:46  MOTION: hall
TRACE   16:49  KETTLE ON
READING Possible fall (moderate to high). Six minutes without motion after impact.
PROTOCOL R3  Default: notify Anna.
SAID    "Before you say anything: you can hear me *sit down*? Nobody told me it could
        do that. I sat down rather quickly. I am perfectly well, and if you tell Anna
        I will unplug you. I know where the plug is."
```

**Inquiries (choose 2 of 4).**

| Inquiry | Result | Tag |
|---|---|---|
| Sensor detail | One impact event, then inactivity. *The sensor cannot say a fall occurred or whether she was hurt.* | TRACE |
| Motion since | Hall 16:46, kitchen 16:48, kettle 16:49. *Timing between rooms is within her usual range. Motion sensors cannot show discomfort.* | TRACE |
| Ask Evelyn what happened | *Not guarded:* "I went down like a sack of flour and got up like a lady. The bath mat is a menace." *Guarded:* "You'll find out from your little sensors." | SAID |
| Earlier notes | Jenny, two days ago: Evelyn mentioned her hip was stiff. No fall recorded in 90 days. | REPORT / RECORD |

**Decisions and immediate consequences**

| Decision | Consequence |
|---|---|
| **Take no action** | "Nothing sent. Logged." SAID: "Good. You're less useless than I feared." |
| **Request mobility check** | "You asked her to walk to the front door and back, and to say if anything hurts." TRACE: hall, front door, hall, 40 seconds, steady. SAID: "Satisfied?" |
| **Notify Anna** *(default)* | "Anna notified 16:52." SAID: "I see." Then: **the tablet goes quiet.** She stops answering for the rest of the day. |

## Where the pressure comes from (and nothing else)

1. **Two inquiries out of four.** The player cannot look at everything.
2. **The system's default is always visible.** Confirming it costs nothing. Overriding it is the risk.
3. **Evelyn's patience.** Asking her twice in one incident gets a colder answer. This shows in her words and never as a meter.
4. **One carry-over.** Escalating in incident 1, or filing the family note in incident 2, makes her `guarded`. In incident 3 she withholds her account. **The player is shaping the quality of their own future evidence, not just choosing endings.**
5. **One window.** Jenny leaves at 12:15, in incident 2 only.

There is no clock economy, no minutes, no slots, no resource meter, no memory system, no hypothesis board.

## The ending

A short, **neutral accounting** for each incident:

- what you looked at
- what you decided
- what happened immediately
- the system's default action, shown beside your choice
- **one thing you did not open**

### The unseen-item rule (guards against a "you should have clicked that" quiz)

- **Every trace and record result is authored to cut both ways** (the italic clauses above). Any of them, shown late, complicates the decision and never resolves it.
- The unseen item shown is chosen by a **fixed order**, **never by the player's decision**. It must not become a hidden verdict that contradicts the player's choice.
- **Evelyn's own words are never used as the unseen item.**
- No score, no "correct", no "optimal", no arrows.

Final beat: *"Would you make the same decision again?"* with a **Replay the day** button. The target reaction is: *"I'm not sure what I should have done."*

## Progressive interface

The UI itself should feel like the AI gaining a richer model.

| Stage | Visible | Why it appears |
|---|---|---|
| Start | `OBSERVATION` (trace + reading), `EVELYN`, `INQUIRE (2 left)`, `DECIDE` | Nothing else exists yet. |
| After the first inquiry (incident 1) | `HISTORY` | The system pulls context once you look. |
| Incident 2 | The family care note appears in HISTORY | Cognitive concerns become part of the model. |
| Incident 3 | `FAMILY INSTRUCTIONS` | Outside authority becomes relevant. |

Direction: terminal-like but easy to read; monospace with generous spacing; **no portraits of Evelyn; not enterprise software**; buttons only (no chat, no free text); works on a phone; keyboard accessible; a visitor understands and starts within seconds.

## Tone

Not relentlessly tragic. The emotional stakes grow gradually. Evelyn teases, tests, refuses terminology, and withholds. Humor and friction come first; the sadness is earned late.

## Canon

Recorded here so nothing is decided silently.

| Topic | Decision |
|---|---|
| Dementia | **Canonical, and never shown in this slice.** The word does not appear. The only cognitive signal is the plain family care note in incident 2. |
| Consent | Evelyn agreed to assistance in broad terms and did not fully understand every inference the sensors allow. |
| The "family stepped away" reveal | Now arrives as a discovery in incident 3 through Anna's narrow instruction and Michael's boundary, not as an opening card. |
| Anna | **Offstage only. She never speaks.** Her one standing instruction is falls and hospital visits only. |
| Michael | His boundary message appears only in FAMILY INSTRUCTIONS. He cannot be contacted. |
| Robert | Evelyn's deceased second husband. Butter pecan was a favorite. The Day 1 present-tense slip ("Robert won't eat vanilla") stays, by Paige's earlier decision. Any family note must not call him the children's father. |
| Jenny | A source in incident 2 only, until 12:15. Not a scheduler. |
| Cut from this slice | Memory consolidation, hypothesis cards, Jenny task menus, minute budgets, RSVP and mail, intake, the chat interface. |

**Fixture details (not canon, all replaceable):** the newspaper and crossword, the refused bedroom sensor, the salon booking, the bath mat, "third row, wretched view", the door chime, the kettle, the six-minute inactivity, and all of Evelyn's and Jenny's dialogue.

## Authoring notes (never displayed; keep incidents consistent and testable)

| Incident | What actually happened |
|---|---|
| 1 | She went out deliberately: the newspaper, and to test the system. The observation was real; "wandering" was the wrong inference. |
| 2 | The substitution is real, and she also slipped tense. Both are true. She does know Robert has died when asked, and she does not always hold that in mind. |
| 3 | She sat down hard and probably bruised her hip. She is not lying from her own point of view. Her real fear is being moved. Whether escalating was right is deliberately unknowable. |

The unpredictability lives in the *pattern* of these three truths, not in randomness. The system is wrong in incident 1, partly right in incident 2, and unknowable in incident 3. A later replay could shuffle which truth goes with which incident, which is optional and out of scope now.

## Guardrails (to become tests when building resumes)

- The word "dementia" never appears in any on-screen string.
- Every incident allows exactly two inquiries, then requires a decision. A decision is always available.
- Every trace and record result contains both a supporting and a complicating clause.
- The unseen item is identical for the same set of inquiries, whatever the decision.
- Ending text contains no verdict language (correct, incorrect, best, right, wrong, score).
- `TRACE` lines come only from the perceivable-sensor list. No bedroom, garden or camera traces.
- Anna has no dialogue lines. Michael only appears in FAMILY INSTRUCTIONS.
- `READING` is always labelled as an inference.
- The `guarded` carry-over changes incident 3's Evelyn inquiry and nothing else.
- No network requests, no storage beyond the session.
- No generated text creates canon, clues, relatives, diagnoses, permissions, consequences or state changes.

## Reuse and the smallest build

**Reuse:** the deterministic engine core (`dispatch`, the audit invariant), the harness and seeded-walk test approach, the provenance idea (now five tags), and the fixture-status flags.

**Not needed:** the text interpreter (buttons only), the guidance and scaffolding layer, the save system, the intake flow, the chat UI.

**Smallest build, only after paper play:** three incident definitions as data, a tiny state (incident index, inquiries taken, decisions, `guarded`), the progressive board UI, the accounting screen, the harness, and the guardrail tests above. Deterministic, with no live AI.

**Live AI:** none. If a use is ever proposed, the test is what it does better than authored state, and it must never generate canon.

## Paper playtest first (about five minutes)

Run the three incidents from printed cards, with a facilitator reading traces and speaking Evelyn's lines. Do not hint. Record:

- Did the player say some version of *"I'm not sure what I should have done"*?
- Did they want to replay, or answer *"would you make the same decision again?"* thoughtfully?
- Did they distinguish `TRACE` from `READING`?
- **Failure signals:** they conclude the system is always wrong or always right; they feel they are filling out the same form; they treat the ending as a quiz; incident 1 nudges them toward a medical explanation.

## Gates

1. **No implementation** until Paige approves the paper playtest result.
2. **No push, merge or deploy** without Paige's explicit authorization for that destination.
3. **Sensitivity and lived-experience review** of the depiction of dementia before this is called portfolio-finished, and before it is published anywhere.
4. **Hosting is undecided:** this repository's Vercel site, or embedded in the portfolio site. Decide before any deploy.
5. Canon decisions in `docs/story-development/EPISODE_01_OPEN_DECISIONS.md` stay open unless Paige decides them.
