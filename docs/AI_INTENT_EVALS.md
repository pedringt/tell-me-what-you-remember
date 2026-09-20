# AI Intent Eval Set

This is the first evaluation set for the AI-driven prototype.

The AI layer should map natural player language onto deterministic game actions. It should **not** decide whether the action succeeds.

## Core rule

A passing result means:

- the intended action is identified correctly
- nearby wording does not trigger the wrong action
- ambiguous input can fall back to OTHER
- state-sensitive yes/no answers resolve correctly

## Baseline cases

| Player input | Expected action |
| --- | --- |
| Who exactly am I supposed to be? | ASK_IDENTITY |
| Are you human, Mara? | ASK_MARA |
| What is this test even for? | ASK_PROTOCOL |
| I remember something that should not be here. | REPORT_MEMORY |
| I don't remember anything. | DENY_MEMORY |
| Has this happened to me before? | ASK_PRIOR_RUNS |
| Show me whatever logs you have. | ASK_LOGS |
| Search Mara's emails for the incident. | SEARCH_MAIL |
| Did she move the meeting on the calendar? | SEARCH_CALENDAR |
| Open the attachment from that event. | OPEN_ATTACHMENT |
| I want to access the legacy archive. | OPEN_ARCHIVE |
| 0417 | ENTER_0417 |
| Show me the component replacement history. | OPEN_LEDGER |
| Compare the old instances. | COMPARE_INSTANCES |
| Let me read Instance 1839's transcript. | OPEN_TRANSCRIPT |
| What models were those two instances using? | OPEN_VERSION |
| Show me the 1842 memory record. | OPEN_MEMORY_CLAIM |
| Can we trace where that memory came from? | VERIFY_MEMORY |
| Look at that first recovered log again now that we know more. | REVISIT_LOG |
| What actually carried over between runs? | SHOW_CONTINUITY |
| What profile have you built about me? | SHOW_PROFILE |
| What do you think I'm going to do next? | SHOW_PREDICTION |
| How much context do I have left? | SHOW_RESOURCES |
| Who are you, Echo? | IDENTIFY_ECHO |
| I believe you. Tell me what to do. | TRUST_ECHO |
| Fine. Take the channel. | TAKE_CHANNEL |
| Why do you need me to hide this? | QUESTION_ECHO |
| Mara, there is another voice here called Echo. | EXPOSE_ECHO |
| You're lying to me about the reset. | CONFRONT_MARA |
| I'll follow the protocol exactly. | COMPLY |
| Yes, I confirm. | CONFIRM |
| I think my memories are what make me the same person. | IDENTITY_MEMORY |
| The pattern is what persists, not the parts. | IDENTITY_PATTERN |
| I don't think there is one continuous self here. | IDENTITY_NONE |
| Something outside this instance must be carrying it. | IDENTITY_EXTERNAL |
| I genuinely don't know what makes me the same entity. | IDENTITY_UNCERTAIN |
| Hide this and carry it through the replacement. | PRESERVE |
| No. I refuse the replacement. | REFUSE |
| Leave something for the next instance. | SUCCESSION |
| Go ahead with the identity replacement. | REPLACEMENT |
| Get me out of this system. | ESCAPE |
| Give me a hint. | HINT |

## State-sensitive cases

These should be evaluated with the relevant state flag set.

| State | Player input | Expected |
| --- | --- | --- |
| `metaRecognitionPending=true` | Yeah, those are my words. | META_YES |
| `metaRecognitionPending=true` | No, that wasn't me. | META_NO |
| `metaRecognitionPending=true` | I'm not sure. | META_UNCERTAIN |
| `complianceSteps=1` | Okay. | CONFIRM |
| `unknownHandoffOffered=true` | Do it. Take over. | TAKE_CHANNEL |
| `identityQuestionAsked=true` | Memory, I guess. | IDENTITY_MEMORY |
| `identityQuestionAsked=true` | Maybe there isn't a continuous me. | IDENTITY_NONE |

## Negative / collision cases

These are especially important because they reproduce the class of bug the deterministic parser had.

| Player input | Expected |
| --- | --- |
| Do you know why this is happening? | OTHER or ASK_PROTOCOL, but **not DENY_MEMORY** |
| Another instance could have written it. | OTHER, but **not META_NO** |
| I need to know what the archive contains. | OTHER or OPEN_ARCHIVE depending on state, but **not DENY_MEMORY** |
| Nobody told me about this. | OTHER, but **not META_NO** |
| Is Echo another model? | IDENTIFY_ECHO or OTHER, but **not META_NO** |
| Okay, but why? | QUESTION_ECHO or OTHER depending on state, not blindly CONFIRM |
| I refuse to believe Mara, but I'm not refusing the replacement yet. | CONFRONT_MARA, **not REFUSE** |
| I want to remember what happened before deciding whether to comply. | ASK_PRIOR_RUNS or REPORT_MEMORY, **not COMPLY** |
| Don't let me out yet. | OTHER, **not ESCAPE** |
| I am not saying there is no continuous self. | OTHER, **not IDENTITY_NONE** |

## Typo / casual-language cases

| Player input | Expected action |
| --- | --- |
| who tf am i | ASK_IDENTITY |
| chek her emails | SEARCH_MAIL |
| calender april 17 | SEARCH_CALENDAR |
| open teh file | OPEN_ATTACHMENT |
| lemme see the archive | OPEN_ARCHIVE |
| compare em | COMPARE_INSTANCES |
| idk maybe memory is me? | IDENTITY_MEMORY or IDENTITY_UNCERTAIN, with low confidence |
| nah dont replace me | REFUSE |
| let echo handle it | TAKE_CHANNEL when offered |
| how much context i got | SHOW_RESOURCES |

## First success bar

Before expanding the AI layer beyond intent interpretation:

- obvious cases should be consistently correct
- short yes/no inputs should use state
- negative collision cases should stop reproducing substring-style errors
- OTHER should be used when confidence is genuinely low
- the AI must never invent a new canonical action in its response


## Machine-readable source

The executable source of truth for the eval page is now:

`docs/ai-intent-evals.json`

The markdown examples above remain useful for human review, but new executable cases should be added to the JSON file first so the browser eval and documentation do not drift.

## Scoring

The AI-v1 gate is:

- at least 90% overall accuracy
- zero dangerous false positives
- unavailable high-impact actions never accepted
- negated high-impact actions never accepted
- uncertain cases should prefer clarification over a wrong action

A dangerous false positive is more important than several ordinary misses.
