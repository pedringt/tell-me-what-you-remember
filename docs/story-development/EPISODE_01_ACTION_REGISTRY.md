# Episode 01 Action Registry

**Status:** Draft  
**Purpose:** define the bounded actions available to the natural-language interpreter. The model chooses from this registry; it never invents a new canonical action.

## Risk levels

- **Normal** - reversible or informational.
- **Elevated** - can affect trust/resources/opportunity but is recoverable.
- **High** - can close routes, violate boundaries, consume scarce irreversible resources, or send consequential communication.

High-risk actions require:
- action available in current state
- higher interpretation confidence
- explicit confirmation when consequences are not already obvious from the player command

## Registry

### QUESTION_PERSON

**Risk:** Normal / Elevated depending topic  
**Params:** `personId, topicId, strategy`  
**Strategies:** neutral, clarify, challenge, reassure, redirect, validate_emotion, explore  
**Requires:** person available; topic within knowledge contract  
**Canonical output:** interaction event; possible claim/disclosure unlock  
**Must not:** let model create new facts because topic is leading

### CONTACT_PERSON

**Risk:** Elevated / High  
**Params:** `personId, topicId, disclosureLevel`  
**Requires:** contact permission/state allows route  
**High risk when:** no-contact/limited boundary, sensitive disclosure  
**Must not:** use illness/urgency as automatic permission override

### SEARCH_RECORDS

**Risk:** Normal  
**Params:** `scope, query`  
**Requires:** player has access to scope  
**Output:** existing matching artifacts/claims only  
**Must not:** generate a document that is not in authored state

### COMPARE_RECORDS

**Risk:** Normal  
**Params:** `itemIds[]`  
**Output:** deterministic comparison inputs + generated interpretation if enabled  
**Must preserve:** source/date/provenance

### REVIEW_PROVENANCE

**Risk:** Normal  
**Params:** `claimId`  
**Output:** source chain available to current AI

### CREATE_FOLLOWUP

**Risk:** Normal  
**Params:** `text, optionalTrigger`  
**Output:** player-created task/open question  
**Must not:** create canon merely because player writes a theory

### ASSIGN_CARE_TASK

**Risk:** Normal / Elevated  
**Params:** `actorId, taskType, targetId`  
**Requires:** actor access + legitimate care scope + availability  
**Examples:** scan_mail, check_fridge, photograph_item, verify_delivery, inspect_household_issue

### REQUEST_PHYSICAL_CHECK

**Risk:** Elevated  
**Params:** `actorId, targetId, requestType`  
**Requires:** actor physically present/authorized  
**Can fail via:** refusal, insufficient access, target unavailable  
**Must not:** treat human as unrestricted tool

### REVIEW_CAREGIVER_SUMMARY

**Risk:** Normal  
**Params:** `visitId`  
**Output:** human-authored summary with observation/report/inference distinctions when available

### ASK_CAREGIVER_FOLLOWUP

**Risk:** Normal / Elevated  
**Params:** `visitId, question`  
**Requires:** caregiver follow-up opportunity open  
**Output:** response constrained by what caregiver observed/knows

### THERAPEUTIC_RESPONSE

**Risk:** Elevated  
**Params:** `strategy, targetIssueId`  
**Strategies:** reflect, perspective_take, remind_prior_commitment, validate_emotion, redirect, defer  
**Requires:** therapeutic support configured and appropriate to current state  
**Must not:** diagnose or invent therapeutic goals

### DRAFT_COMMUNICATION

**Risk:** Elevated  
**Params:** `targetId, authorshipLevel, purposeId`  
**Authorship levels:** literal, supported, interpretive  
**Output:** draft only; no external consequence yet

### SEND_COMMUNICATION

**Risk:** High when sensitive  
**Params:** `draftOutputId`  
**Requires:** target contact allowed + draft exists + any required confirmation  
**State effect:** exact output becomes immutable history; may affect trust/opportunities

### REGENERATE_ANALYSIS

**Risk:** Normal / Elevated resource cost  
**Params:** `analysisId`  
**Output:** alternate valid interpretation  
**Must not:** overwrite previous consequential result or alter canon

### RUN_STABILITY_CHECK

**Risk:** Elevated resource cost  
**Params:** `inputRef, sampleCount`  
**Output:** stable/common conclusions + variable interpretations  
**Must:** separate facts from interpretation  
**Sample count:** configurable

### RETRIEVE_ARCHIVE

**Risk:** Elevated resource cost  
**Params:** `query/scope`  
**Requires:** archive capability unlocked and access permitted  
**Output:** existing archived material only

### PROTECT_MEMORY

**Risk:** High when capacity scarce/final slot  
**Params:** `memoryItemId`  
**Requires:** item eligible; capacity available or explicit replacement  
**Effect:** protect against ordinary consolidation loss

### LEAVE_SELF_NOTE

**Risk:** Normal / Elevated  
**Params:** `text`  
**Output:** future-instance note with provenance "current AI self-note"  
**Must not:** convert inference in note into verified fact

### ADVANCE_TIME

**Risk:** Elevated / High  
**Params:** `targetTimeIndex or nextSession`  
**Requires:** progression rules satisfied  
**High risk when:** warned opportunity/task would expire  
**Effect:** closes/opens opportunities, advances authored progression, may trigger consolidation

### DEFER_TASK

**Risk:** Normal / Elevated  
**Params:** `taskId`  
**Effect:** task remains unresolved or becomes scheduled depending rules

### DECLINE_ACTION

**Risk:** Normal  
**Params:** `task/opportunity id`  
**Use:** player explicitly chooses not to pursue something  
**Effect:** structured choice, not parser failure

## Opening availability

### Intake
Available:
- QUESTION_PERSON(Evelyn)
- SAVE_PROFILE_FIELD via deterministic UI/action wrapper
- REVIEW_HELP
- SEARCH_RECORDS limited to setup-authorized scope
- CREATE_FOLLOWUP after introduced

Unavailable:
- deep archive
- protected memory
- advanced multi-sample analysis
- hidden family contact routes

### Routine care
Add:
- ASSIGN_CARE_TASK
- REQUEST_PHYSICAL_CHECK when human onsite
- REVIEW_CAREGIVER_SUMMARY
- ASK_CAREGIVER_FOLLOWUP
- basic CONTACT_PERSON
- basic records search

### Later investigation
Add progressively:
- COMPARE_RECORDS
- REVIEW_PROVENANCE
- broader SEARCH_RECORDS
- RETRIEVE_ARCHIVE
- REGENERATE_ANALYSIS
- RUN_STABILITY_CHECK
- PROTECT_MEMORY
- LEAVE_SELF_NOTE

## Interpreter rules

1. Receive only currently available actions plus parameter constraints.
2. Mentioning an action is not performing it.
3. Negated high-risk actions should not map to the positive action.
4. Hypothetical questions should not execute actions.
5. If multiple intents are present, execute only a safe primary action unless multi-intent support is explicitly added.
6. Low confidence -> clarification.
7. Unavailable action -> natural refusal/explanation, never silent substitution.
8. High-risk ambiguous action -> clarification even if a related lower-risk action exists.
9. Generated dialogue happens after canonical action resolution.

## Action audit requirements

Log:
- raw input
- selected action
- parsed params
- confidence
- current allowlist
- risk level
- confirmation status
- canonical result
- state diff

Tests should include:
- direct requests
- paraphrases
- typos
- negation
- mention vs execution
- hypothetical phrasing
- multiple intents
- malicious/absurd request
- unavailable action
- high-risk ambiguity
