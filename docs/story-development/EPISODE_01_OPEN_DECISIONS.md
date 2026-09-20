# Episode 01 Open Decisions for Paige

**Status:** Living decision list  
**Purpose:** prevent implementation agents from filling creative gaps that belong to Paige.

This file is intentionally short. If a question is not listed here and is already defined in the implementation/story docs, an implementation agent may proceed within those constraints.

## Story canon decisions still open

- Exact first-husband history and reason for divorce.
- Exact supporting-cast identities, names, and biographies beyond current structural roles.
- The **form** of Anna's wedding incident is settled: Evelyn gives a boundary-crossing speech after Anna explicitly asked her not to. Still open:
  - the exact private/humiliating anecdote or detail Evelyn reveals
  - how much the speech centers Evelyn's sacrifices/role as Anna's mother
  - exact wording and length of the speech
  - exact private confrontation afterward
- Exact dementia diagnosis, clinical stage labels, and calendar duration. The progression direction is settled as gradual, beginning with small everyday inconveniences and repeated requests before becoming unmistakable.
- Exact circumstances/timing of Evelyn's death or final care transition.
- Exact form, wording, timing, and loss mechanism of Anna's possible final message.
- Whether the missed-Anna-message outcome is avoidable, fixed, or one of several branches.
- Exact threshold/prerequisites for each ending family.
- Whether any family relationship outcome is impossible within a single run.
- Exact wording of major apologies, recordings, therapy breakthroughs, or Robert artifacts.
- Final number/identity of recurring caregivers.
- Exact first physical clue and exact first scanned mail item.
- Exact final wording of Michael's early therapy-boundary message. Sender and function are settled: Michael sends it after Evelyn has been repeatedly contacting/pressuring him, and he makes use of the agreed therapeutic/reflection support a condition before she contacts him again.

## Product/design decisions still open

- Final user-facing names for difficulty modes.
- Whether adaptive difficulty defaults on or off.
- Exact compute/context economy values.
- Exact number of protected-memory slots.
- Whether regeneration is available from the start or unlocked later.
- Whether stability/ensemble analysis is a standard capability or later unlock.
- Exact save-slot / branch-from-checkpoint UX.
- Exact post-game archive / ending gallery presentation.
- Exact long-term commercial AI architecture. For the **first build**, the direction is settled: deterministic-first, with live generative AI added only where real player friction, rigidity, or other concrete problems show that it materially improves the experience.

## Safe implementation assumptions

Until Paige decides otherwise, implementation may:
- use placeholders for open names/text
- build data structures before final content exists
- create fixture artifacts clearly labeled as non-canon test content
- use tunable configuration values rather than hard-coded final thresholds
- stub ending eligibility behind named predicates
- implement UI shells for future features without exposing unresolved story content
- write automated tests for invariants and guardrails

Implementation must not:
- turn placeholder text into canon
- choose the "best" ending
- resolve family disputes as objective fact where the story intends ambiguity
- diagnose Evelyn beyond approved story state
- create new relatives, traumas, crimes, or hidden events
- promote changes to main/production without Paige's explicit current approval

## Next high-value decisions when Paige returns

If only a few decisions can be made, prioritize:

1. exact content of the boundary-crossing wedding speech, especially the private anecdote/detail
2. exact home-helper identity/name
3. exact grocery/delivery problem and first scanned mail item
4. exact wording of Michael's therapy-boundary message
5. exact dementia diagnosis/stage timing once medical research is complete
6. exact ending prerequisites and whether the one-child route can resolve through either Anna or Michael
