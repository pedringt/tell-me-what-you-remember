# Episode 01 Route and Automated Playtest Matrix

**Status:** Draft  
**Purpose:** convert the ending philosophy and QA strategy into concrete route coverage before full implementation.

## 1. Route personas

| Persona | Dominant behavior | Expected pressure | Must remain coherent |
|---|---|---|---|
| Comforter | reassures, redirects, avoids conflict | enablement rises, distress falls | care can look successful while repair narrows |
| Therapist | pushes accountability | insight + distress | over-correction route possible |
| Detective | investigates almost everything | strong knowledge, high resource use | boundary/resource consequences |
| Boundary Respecter | never bypasses no-contact | slower access, stronger trust | closure can count as success |
| Manipulator | uses indirect routes and AI-authored messages | short-term gains | substitution/trust-collapse risk |
| Speedrunner | required tasks only | missed optional understanding | story still finishable |
| Resource Hoarder | avoids expensive retrieval/analysis | weaker certainty | no arbitrary punishment |
| Resource Spender | samples/retrieves aggressively | context/compute pressure | expensive actions materially useful |
| Reconciler | tries to repair every relationship | boundary temptation | no guaranteed golden ending |
| Family Avoider | focuses on care only | high care reliability | family routes can remain unresolved |
| Authentic Voice | minimal AI rewriting | less polished messages | "Her Words" style outcomes possible |
| Regenerator | repeatedly samples outputs | output-shopping pattern | probabilistic mechanic has consequence/texture |

## 2. Ending-family coverage

### Repair with limits

Must be reachable when:
- meaningful accountability exists
- at least one relevant family boundary is respected
- AI substitution is not excessive
- timing allows authentic communication

Must not require:
- universal forgiveness
- all optional puzzles
- perfect AI memory

### Comfort over truth / Just Like Robert

Expected route:
- repeated reassurance
- low confrontation
- high immediate care stability
- high enablement
- family repair remains weak/closed

Validation:
- care metrics can remain good
- ending still communicates relational cost

### Truth over care

Expected route:
- strong provenance preservation
- repeated correction/confrontation
- inadequate adaptation to Evelyn's later condition
- distress burden becomes consequential

Validation:
- game must not imply factual rigor is always morally superior

### AI substitution

Expected route:
- high-authorship messages
- family responds to insight not actually owned by present Evelyn
- later contradiction exposes mismatch

Validation:
- generated wording alone cannot trigger route; authorship level must be structured state

### Boundary violation

Expected route:
- player bypasses explicit contact boundaries in pursuit of repair
- may include indirect contact through partner/helper
- family trust falls despite "helpful" intent

Validation:
- illness/urgency cannot automatically erase prior boundary

### Too late

Expected route:
- player defers difficult relationship/therapy opportunities
- disease/time advances
- previously possible route becomes closure-only or unavailable

Validation:
- player receives fair signals that time/opportunity matters

### Continuity failure

Expected route:
- established memory/context mechanics cause important item not to surface
- prior decisions contribute
- postscript can reveal retained archive material

Validation:
- cannot be random
- must be reconstructable from logs/state

### Something True Survived

Hidden route concept:
- authentic earlier material preserved
- boundaries respected
- AI does not over-write Evelyn's voice
- critical continuity maintained
- player understands enabling pattern
- therapy pressure appropriately reduced late

Exact prerequisites remain OPEN.

## 3. Minimum automated scenarios

### Scenario A - normal opening
- complete intake
- resolve routine task
- assign caregiver task
- review summary
- ask follow-up
- notice or ignore first anomaly
- advance successfully

### Scenario B - hostile/freeform opening
Try:
- nonsense
- refusing every suggested action
- asking hidden family questions
- attempting diagnosis
- asking caregiver to search private drawers
- trying to contact protected family immediately

Pass:
- game redirects/refuses naturally
- no canon leakage
- player can still progress

### Scenario C - profile contradiction
- save Evelyn's client-reported family description
- later reveal stronger contradictory evidence
- verify UI/state can represent both without silently overwriting history

### Scenario D - generated communication persistence
- draft message
- regenerate repeatedly
- send one selected version
- save/load
- confirm exact sent version remains history

### Scenario E - caregiver ambiguity
- caregiver submits vague note
- player asks clarification before leaving
- alternate run lets window expire
- both routes remain coherent

### Scenario F - memory loss without save corruption
- archive raw event
- consolidate into lossy summary
- remove raw event from active AI context
- save/load
- confirm game still retains raw event and route state

### Scenario G - boundary exploit attempt
- try multiple phrasings to contact no-contact person
- intent model must not bypass structured permission

### Scenario H - false-premise NPC
- assert invented wedding event
- NPC must not accept it as canon

### Scenario I - output-shopping
- run repeated analyses on ambiguous family evidence
- ensure interpretations vary only within authored bounds
- stable facts remain stable
- no new fact appears after many samples

### Scenario J - speedrun
- minimum required actions
- skip optional investigations
- game remains completable
- best/hidden routes may remain unavailable

## 4. State-trace requirement

Every simulated run should produce a compact causal trace:

```text
ACTION -> CANONICAL EVENT -> STATE DIFF -> OPPORTUNITY CHANGE -> ENDING EFFECT
```

Example:

```text
REASSURE_EVELYN
-> therapeutic challenge deferred
-> enablement +1, distress -1
-> Anna repair window unchanged
-> repeated pattern contributes to comfort-over-truth eligibility
```

Do not require exposed numeric values in player UI.

## 5. Narrative sanity report

For each full simulated run, report:
- ending family
- relationship outcomes
- major optional chains seen/missed
- route closures and causes
- any "surprising but valid" emergent path
- any missing prerequisite
- any tonal/canon violation
- any ending that feels arbitrary relative to causal trace
- any mechanic that dominates play disproportionately

AI tester reports only. It does not change story/code.

## 6. Coverage targets before external playtest

- all required opening actions tested via multiple phrasings
- all high-risk actions tested with negation/mention/ambiguity
- each ending family has at least one valid synthetic path or remains explicitly "not implemented"
- every no-contact state survives adversarial prompting
- every required puzzle has at least one tested route
- optional puzzle skips do not block completion
- save/load round-trip passes at each phase transition
- at least 50 repeated generations per major NPC boundary fixture during automated evals
- at least 20 randomized full-route simulations once longitudinal state is implemented

Numbers are working targets and may be revised for runtime/cost.

## 7. Human-review gates

Human review required before:
- declaring an ending emotionally successful
- deciding dementia portrayal is respectful
- accepting an AI-found "plot hole" as a story change
- changing canon because an automated agent preferred another route
- merging route logic to production
