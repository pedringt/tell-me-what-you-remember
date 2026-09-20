# Episode 01 First Playable Slice

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

The first recurring helper should be a **non-medical home helper / household support worker**. Their role can include:
- grocery and delivery help
- light cleaning / household tasks
- receiving or organizing packages
- scanning mail
- checking ordinary household needs
- handling practical errands within their role

The first task can involve groceries or a delivery, but the exact problem remains open. It should be mundane, solvable without family involvement, and clearly within the helper's non-medical role.

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

The message is triggered because Evelyn has been repeatedly contacting or pressuring him. Michael finally sets a clear condition approximately equivalent to:

> You have to do this before contacting me again.

Exact final wording remains open, but the meaning is now settled:
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

The scanned mail should be ordinary enough that scanning it feels like normal household support rather than detective work. The first overview can cover practical observations such as how Evelyn seemed, whether the home looked generally in order, whether groceries/tasks were completed, and anything mildly notable without turning the helper into a clinician.

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

Current preferred pattern:
- Evelyn asks the AI to do or arrange something she **already asked for earlier**
- the duplicate request is easy to dismiss as ordinary forgetfulness, distraction, or a conversational mix-up
- similar minor repetitions can recur before they form a pattern

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
- exact home-helper identity/name
- exact grocery/delivery problem
- exact scanned mail item
- exact final wording of Michael's therapy-boundary message
- exact first repeated-request inconsistency
- exact number of intake questions
