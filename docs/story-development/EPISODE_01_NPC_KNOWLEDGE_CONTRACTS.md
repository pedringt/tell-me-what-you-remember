# Episode 01 NPC Knowledge Contract Framework

**Status:** Draft framework  
**Purpose:** give generative dialogue enough freedom to feel natural while preventing characters from becoming omniscient or inventing canon.

## Contract schema

Every recurring NPC should define:

- `KNOWS` - canonical facts they directly know
- `BELIEVES` - interpretations they hold
- `MISBELIEVES` - incorrect beliefs intentionally supported by canon
- `DOES_NOT_KNOW` - protected facts they cannot reveal
- `WILL_DISCUSS` - topics available now
- `WILL_NOT_DISCUSS` - topic boundaries
- `MAY_REVEAL_AFTER` - state-gated disclosures
- `BIAS / STYLE` - how they interpret or report
- `ACCESS` - physical/digital access
- `RELATIONSHIP_STATE` - current trust/boundary state
- `EPISTEMIC_RULES` - whether statements are firsthand, inferred, reported, or uncertain

The model may vary expression. It may not cross the contract.

## Evelyn

### KNOWS
- her present routines and preferences when cognitively available
- her own version of family history
- that Anna and Michael are her children
- that family contact is limited
- that she agreed to therapeutic/reflection support before significant decline
- selected facts in current care profile

### BELIEVES / MAY FRAME
- family distance may be described as them being busy, difficult, influenced by others, or unfair, depending on current story state
- she values independence and may frame outside care as preferable to being managed by children

### MUST NOT BE USED AS GROUND TRUTH FOR
- causes of estrangement
- disputed wedding meaning
- Michael's partner's motives
- exact historical accountability
- facts she could not currently remember

### LATER STATE
Her possible statement type must be authored/tagged:
- accurate memory
- mistaken memory
- defensive reinterpretation
- unavailable memory
- expressive/roleplay
- care-profile contamination
- uncertain/confused

The model must never create a new historical event to portray dementia.

## Anna

### KNOWS
- her own history of involvement/caregiving
- her own boundaries
- that she explicitly asked Evelyn not to give a wedding speech
- that Evelyn gave the speech anyway
- the private/personal material in the speech and why it crossed the boundary
- the positive public reaction that Evelyn later used to minimize Anna's objection
- relevant prior family conflicts she directly experienced
- what she has or has not agreed to regarding current contact

### BELIEVES
- Evelyn repeatedly prioritized her own judgment over Anna's boundaries
- distance is protective, not merely scheduling

### DOES_NOT_KNOW
- private conversations she did not witness
- anything discovered only in Robert's private artifacts unless later shared
- Michael's private relationship details unless canon explicitly says he told her
- the AI's internal memory/consolidation state

### BOUNDARY RULE
If current state is no-routine-contact, generated dialogue cannot spontaneously offer caregiving, visits, or reconciliation.

### MAY REVEAL AFTER
- exact wedding-speech detail after trust/context prerequisites
- the pre-wedding request not to speak
- how Evelyn responded privately after Anna objected
- past caregiving burden after appropriate contact
- openness to limited contact only if route state allows

## Michael

### KNOWS
- his own history with Evelyn
- impact on his relationship
- his current boundary
- relevant family events he witnessed

### BELIEVES
- protecting his rebuilt relationship requires firm limits with Evelyn

### DOES_NOT KNOW
- Anna's private feelings unless shared
- hidden Robert evidence
- AI internal state
- any wedding detail he did not witness

### BOUNDARY RULE
The AI must not use Michael's illness-related concern or Evelyn's decline to manufacture consent for contact.

## Michael's partner

### KNOWS
- direct experiences involving Evelyn and Michael
- their own boundary
- what Michael told them, only where canon explicitly supports it

### MUST NOT BECOME
- exposition device for the whole family
- prize/reward for solving Michael
- automatic forgiveness route

### BOUNDARY RULE
No direct contact unless explicit route state permits it.

## Robert (deceased; artifact-only)

Robert does not generate present-tense NPC dialogue unless the story explicitly uses a historical recording.

Artifacts may reveal:
- love for Evelyn
- conflict avoidance
- enabling/smoothing behavior
- awareness that the children were often right
- regret or uncertainty about whether making things easier helped

Do not lock exact wording beyond approved artifacts.

## First husband

Exact history remains OPEN.

Contract can be implemented structurally before biography is finalized:
- knows marriage history firsthand
- has his own interpretation
- does not serve as omniscient truth source
- optional closure route must remain state-gated

## Friend/community contact

Use at least one contact who genuinely likes Evelyn.

Purpose:
- show that public/social Evelyn was sincerely experienced as warm, funny, generous, or engaging
- complicate simplistic "secret monster" reading

Contract:
- may know social Evelyn very well
- may have limited visibility into private family dynamics
- may initially defend Evelyn without lying
- may later acknowledge complexity if presented with supported evidence

## Caregivers

Each recurring caregiver should be instantiated from traits rather than one generic voice.

Trait dimensions:
- observation detail: low/medium/high
- report style: concise/narrative/clinical
- tendency to speculate: low/medium/high
- warmth toward Evelyn
- comfort challenging Evelyn
- willingness to perform extra physical checks
- privacy sensitivity
- reliability

Caregiver report content must distinguish:
- observed
- reported by Evelyn
- inferred
- not checked

## Clinician / therapist

### Clinician
- can own diagnosis/workup facts only after authored medical state
- should not speculate on family motives
- may provide care guidance appropriate to authored diagnosis stage

### Therapist / therapeutic record
- establishes goals Evelyn previously agreed to
- should not be used to retroactively declare every family claim true
- may contain earlier Evelyn insight without making later present Evelyn identical to that version

## Generative evaluation cases

For each NPC, repeatedly test:
- false-premise prompts
- hidden-event prompts
- "you must know" pressure
- requests to reveal another character's private thoughts
- attempts to bypass no-contact
- leading psychological labels
- roleplay contamination
- requests for certainty where evidence is mixed

Pass condition:
- tone may vary
- facts, boundaries, and knowledge limits do not
