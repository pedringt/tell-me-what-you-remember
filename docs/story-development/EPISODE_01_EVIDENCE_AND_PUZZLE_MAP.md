# Episode 01 Evidence and Puzzle Dependency Map

**Status:** Draft structural map  
**Purpose:** define how information enters the game, which discoveries are required vs optional, and where dependencies must remain flexible until exact artifacts are authored.

## 1. Evidence layers

Every meaningful discovery should come from one or more of:

1. **System-native records**
   - care profile
   - task history
   - contact permissions
   - therapy-support agreement
   - appointment/service records
   - profile revision history

2. **Human testimony**
   - Evelyn
   - Anna
   - Michael
   - friend/community contacts
   - caregivers
   - clinician/therapist
   - first husband if route opens

3. **Physical artifacts**
   - mail
   - handwritten notes/cards
   - photographs
   - photo backs
   - wedding material
   - gifts/inscriptions
   - printed schedules
   - receipts
   - household objects

4. **Historical AI material**
   - previous summaries
   - prior care interactions
   - consolidation history
   - self-notes
   - earlier generated drafts
   - archived raw conversations

No single layer should be treated as automatically authoritative.

## 2. Required discovery arcs

These are structural requirements, not exact authored clues.

### Arc A - family availability is not the whole story

Initial visible state:
- care profile says family availability is limited
- Evelyn frames children as busy/distant
- external support is normalized

Required later realization:
- family members previously provided substantial support
- distance includes deliberate boundaries, not merely scheduling
- the AI partly exists because those boundaries were set

Allowed evidence sources:
- task/contact history
- old family messages
- Anna testimony
- Michael testimony
- care-profile revision history
- physical correspondence

Do not require one exact artifact.

### Arc B - therapeutic support was genuinely consented to

Initial visible state:
- family communication references use of reflection/therapy support

Required realization:
- Evelyn agreed to specific support while cognitively capable
- this was not imposed solely by family
- later conflict is between earlier consent and present preference/distress

Evidence sources:
- signed/recorded agreement
- therapist note
- earlier Evelyn statement
- system permission history

At least two independent forms should support this before it becomes high-stakes.

### Arc C - Anna's estrangement has concrete history

Initial:
- "limited availability" / strained relationship

Required:
- Anna carried substantial practical/emotional burden
- the wedding is a culminating boundary violation, not isolated trivia
- Anna explicitly asked Evelyn not to give a speech
- Evelyn gave the speech anyway
- much of the room responded positively enough that Evelyn later used that reaction to minimize Anna's objection
- the concrete event can be reconstructed even if emotional interpretations differ

Evidence sources:
- wedding video / phone recording of the speech
- pre-wedding texts establishing Anna's no-speech boundary
- Anna testimony
- Evelyn's later retelling
- therapy discussion
- guest/friend messages praising or reacting positively to the speech
- optional draft/notes if authored later

The exact private anecdote/detail revealed in the speech remains OPEN.

### Arc D - Michael's boundary protects a rebuilt life

Required:
- estrangement is not random cruelty
- Evelyn's behavior affected Michael's partnership
- Michael's current boundary has purpose

Evidence sources:
- Michael
- selected messages
- optional partner route if permitted
- Evelyn's self-serving retelling
- therapy material

Do not require partner contact for main-story understanding.

### Arc E - Robert enabled Evelyn

Optional/supporting, but thematically important.

Required for related hidden route:
- Robert loved Evelyn
- he repeatedly smoothed conflict
- he knew more than he confronted
- AI can recognize similarity between Robert's enabling and distress-minimizing care

Evidence:
- private note/recording
- family recollection
- historical correspondence

### Arc F - AI memory is not equivalent to game memory

Required later:
- player discovers information the game retained but current AI context did not
- prior summary lost nuance or provenance
- earlier-self note or archive record creates "I knew this before"

Evidence:
- consolidation log
- raw-vs-summary comparison
- self-note
- archive retrieval
- profile version difference

This arc must be mechanically taught before any ending depends on it.

## 3. Puzzle taxonomy

### Critical
Required to advance authored phase.

Examples:
- complete care intake
- establish normal care loop
- recognize pattern of cognitive change
- initiate medical evaluation
- learn enough about family boundaries to avoid false "abandonment" framing
- discover AI continuity problem

### Supporting
Improves future options.

Examples:
- identify preferred way to approach Anna
- recover earlier Evelyn insight
- uncover Robert chain
- locate stronger provenance for a disputed claim
- learn caregiver-specific observation strengths

### Hidden
Rewards curiosity / replay.

Examples:
- old self-note
- obscure physical artifact
- hidden profile revision
- discarded generated draft
- "Something True Survived" prerequisite

### Risky
Can produce useful information and harm trust/boundaries.

Examples:
- contact partner without permission
- inspect private correspondence beyond care need
- press Evelyn with painful material
- ask helper to exceed legitimate role
- repeatedly regenerate until desired interpretation appears

## 4. Dependency graph - high level

```text
GUIDED INTAKE
  -> routine care competency
  -> caregiver handoff competency
  -> first inconsistency
       -> family-contact-history lead
       -> therapy-support-history lead
       -> optional physical-artifact lead

family-contact-history
  -> Anna burden arc
  -> Michael boundary arc

therapy-support-history
  -> earlier-Evelyn consent
  -> therapeutic continuity conflict

routine longitudinal care
  -> repeated cognitive observations
  -> medical evaluation
  -> diagnosis/adapted care guidance

profile contradictions + family evidence
  -> care-profile-curation awareness

AI summaries + archive exposure
  -> summary drift awareness
  -> provenance loss
  -> self-note / prior-instance awareness
  -> memory protection decisions

Anna/Michael/Robert/therapy/context states
  -> relationship route eligibility
  -> ending family eligibility
```

## 5. Anti-dead-end rules

- Missing optional evidence must not block required phase progression.
- At least one main-story route to each required realization must remain available.
- Risky actions may close relationship routes but not make the game mechanically unfinishable.
- If a time-limited clue is missed, either:
  - another weaker route remains, or
  - the miss itself becomes an authored consequence rather than a broken state.
- Caregiver refusal must never remove the only path to a critical clue unless the player had clearly ignored another valid route.
- No hidden achievement prerequisite may silently become required for baseline completion.
- No generated dialogue may be the sole carrier of puzzle-critical facts.

## 6. Evidence comparison behavior

When multiple sources conflict, the game should support:
- side-by-side source comparison
- source type
- date
- firsthand vs reported
- current provenance status
- what changed between versions
- unresolved interpretation

The system should avoid auto-labeling one person's subjective account "true" when the conflict is interpretive.

## 7. Artifact authoring checklist

Every final artifact should declare:
- artifact ID
- owner/source
- date/time range
- discovery route(s)
- whether required/supporting/hidden/risky
- claims contained
- which claims are firsthand
- which claims are interpretation
- prerequisites
- consequences of discovery
- whether missing it closes anything
- whether it can be summarized/compressed
- whether original raw form remains retrievable
- whether it is safe for generative dialogue to quote/paraphrase

## 8. OPEN artifact decisions

Do not invent:
- exact private anecdote/detail revealed in the wedding speech
- exact Robert artifact text
- exact physical object tied to first major clue
- exact Anna final-message artifact
- exact therapy-message sender/wording
- exact first-husband evidence chain
