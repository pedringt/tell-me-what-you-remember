# Episode 01 First Playable Slice

> **FUTURE SLICE - NOT CURRENT BUILD TARGET**
>
> This 30-45 minute structure remains useful as future Episode 1 design. The current target is the much smaller portfolio judgment game specified in `docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md`. (An earlier one-day management prototype under `docs/prototypes/` is superseded.)
>
> Do not implement this full slice until the portfolio judgment game has been paper-tested and Paige explicitly approves the next phase.


**Status:** Draft, implementation-ready structure  
**Target duration:** approximately 30-45 minutes  
**Purpose:** teach the care system, establish Evelyn as a person, make the player competent at routine care, then introduce one small inconsistency without turning the opening into a mystery immediately.

## Design rule

> The player should first learn what "normal" looks like.

The opening must not front-load dementia, family exposition, memory-system weirdness, or high-stakes moral choices.

## Beat 0 - boot / assignment

Player receives a brief diegetic system orientation.

Visible:
- client: Evelyn
- objective: support safe independent living while preserving autonomy, dignity, and emotional wellbeing
- TASKS
- PROFILE
- CONTACTS
- INBOX
- HELP

Do not show MEMORY, ARCHIVE, advanced provenance tools, ending metrics, or deep family history.

First action is heavily suggested.

## Beat 1 - meet Evelyn

Goal:
- establish humor, competence, preferences, and personality before pathology
- teach free-form questioning

Required setup prompts should cover only what is needed for early care:
- preferred daily rhythm
- groceries / food basics
- transportation
- household support
- who may be contacted
- what Evelyn wants the AI to handle
- what she wants to retain control over

The UI may offer explicit "ask next" suggestions.

Player can ask additional questions, but extra questions must not reveal later canon unless the relevant NPC contract allows it.

## Beat 2 - build the initial care profile

The player saves selected answers.

Each saved item gets a source label:
- CLIENT
- VERIFIED RECORD
- OTHER SOURCE if already supported

The player learns, without a lecture, that:
- a profile entry is not automatically verified
- source matters

Suggested family-profile entry shape:

- Anna - daughter
- limited availability
- source: client report

Do not explain the estrangement yet.

## Beat 3 - first routine task: household support

Purpose:
- teach task resolution
- prove the AI is genuinely useful
- establish the first human helper as practical household support rather than medical care

The first recurring helper is **Jenny**, a non-medical home helper / household support worker.

Jenny begins friendly, bubbly, and genuinely inclined to like Evelyn. Her role can include:
- grocery and delivery help
- light cleaning / household tasks
- receiving or organizing packages
- scanning mail
- checking ordinary household needs
- handling practical errands within her role

The first grocery task centers on **butter pecan ice cream**, a favorite of Robert's. Evelyn asks the AI to make sure it is included in the next grocery order. The task is mundane and solvable without family involvement.

This detail later becomes the opening cognitive signal: after the order has already been handled, Evelyn asks again whether the AI remembered Robert's butter pecan ice cream. At first this can read as ordinary repetition or habit rather than an obvious dementia symptom.

## Beat 4 - incoming family/therapy message

After the player has met Evelyn and performed at least one ordinary task, an existing family communication arrives or is surfaced.

Function:
- introduce therapeutic/reflection features naturally
- imply prior history without explaining it

Required information:
- Evelyn previously agreed to use reflection/therapeutic support
- continued family involvement is conditional on boundaries/effort in some form
- wording implies this is not the first conversation

The sender is **Michael**.

The message is triggered because Evelyn has been repeatedly contacting or pressuring him. Working first-build wording:

> Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again.

The exact prose can still be polished later, but the meaning is settled:
- Michael is not casually reminding her about therapy
- he is enforcing a boundary
- Evelyn's use of the previously agreed therapeutic/reflection support is a condition before further contact
- the message should imply prior attempts and exhaustion without dumping the whole family history

The player should be prompted to review the existing therapeutic-support agreement, not to diagnose or counsel Evelyn independently.

## Beat 5 - configure therapeutic support

Teach:
- earlier consent exists
- the AI may support human-directed therapeutic goals
- support is not "agree with Evelyn"
- the AI is not a therapist replacing clinical care

Possible setup actions:
- review authorized goals
- confirm Evelyn understands the feature
- record current consent/status
- choose from pre-approved support behaviors

Do not force a major therapeutic confrontation in the opening.

## Beat 6 - home-helper visit setup

The non-medical home helper is scheduled for a routine practical visit.

Player assigns 1-3 legitimate tasks, including:
- scan today's mail
- help with groceries or deliveries
- handle light cleaning / household tasks
- verify an item in the home
- check pantry/fridge
- photograph an ordinary household issue

This teaches that the AI has no body and must act through people, while keeping the first helper clearly outside a medical-care role.

## Beat 7 - home-helper visit / physical evidence

During the visit:
- assigned tasks complete
- **mail is scanned**
- the helper provides a general first-impression overview because this is the first time they are interacting with the AI
- no major secret is exposed

The first scanned item is a **church/community newsletter or invitation** that includes an upcoming social event, such as a luncheon. It establishes that Evelyn has an active social world outside her children and gives the AI a mundane follow-up task: ask whether she wants to attend, add it to the calendar, and arrange transportation if needed.

Jenny's first overview should feel warm and informal rather than clinical: Evelyn is personable, the house is broadly okay, practical tasks are handled, and Jenny may mention one or two small quirks without diagnosing anything.

## Beat 8 - checkout summary

Caregiver must submit a concise visit summary.

Player is told the caregiver remains available briefly for follow-up.

Teach:
- summaries are useful, but human-authored
- ambiguous wording can be clarified while the observer is still present
- follow-up time is limited

The player should be able to ask at least one natural-language clarification.

## Beat 9 - first inconsistency

The first anomaly should be small and deniable.

Current opening pattern:
- Evelyn asks the AI to make sure Robert's **butter pecan ice cream** is in the grocery order
- the AI handles it
- later, Evelyn asks again whether the AI remembered Robert's ice cream
- at first this is easy to dismiss as ordinary forgetfulness, habit, distraction, or a conversational mix-up
- later repetitions can become harder to explain, especially when Evelyn speaks about Robert in the present tense

The game does not label this a mystery.

Player options:
- ignore
- ask Evelyn
- create a follow-up
- inspect contact history if available
- mark as uncertain

Any of those choices should allow progression.

## Beat 10 - opening ends with increased autonomy

The system reduces explicit next-step guidance.

New capabilities may become visible:
- NOTES / OPEN QUESTIONS
- limited RECORDS search
- player-created follow-up

End-state target:
- player knows how to perform routine care
- player understands humans are their physical interface
- player has seen provenance labels
- player knows therapeutic support exists
- player has one small unresolved family question
- player likes/understands Evelyn enough that later decline will matter

## Tutorial knowledge checklist

By the end, player should know:
- how to read/complete tasks
- how to ask Evelyn questions
- how to save profile information
- how source labels work at a basic level
- how to contact or task a caregiver
- how to inspect scanned evidence
- how to read a caregiver summary
- how to ask a follow-up before the caregiver leaves
- how to make their own follow-up/open question
- how to use HELP

Do not require understanding yet:
- AI context compression
- protected memory
- archive recovery
- probabilistic ensemble analysis
- advanced role engagement
- ending logic
- deep family history

## Fail-safe rules

- Player cannot permanently fail during intake because of wording.
- Free-form input that is close to a tutorial intent should receive clarification or suggestions.
- The grocery task must have at least two valid resolution paths.
- The caregiver visit cannot leave the player stuck if they miss a follow-up.
- Ignoring the first inconsistency must not break the story.
- The family message must not reveal the full reason for estrangement.
- Evelyn must not show unmistakable dementia symptoms before the player has learned baseline behavior.

## Telemetry for this slice

Track:
- time to first successful task
- HELP usage
- suggested-action usage
- free-form vs suggested prompt usage
- profile fields saved
- caregiver follow-ups asked
- whether first inconsistency was pursued
- how long before player creates first self-directed follow-up
- tutorial clarification/failure rate

## OPEN

Do not invent:
- Jenny's full biography or eventual replacement-helper roster
- exact church/community organization and event copy
- final polished wording of Michael's therapy-boundary message
- exact number of intake questions
- exact later escalation point when Robert references become unmistakably concerning
