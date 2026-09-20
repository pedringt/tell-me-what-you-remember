# Episode 01 Open Decisions for Paige

**Status:** Living decision list  
**Purpose:** prevent implementation agents from filling creative gaps that belong to Paige.

This file is intentionally short. If a question is not listed here and is already defined in the implementation/story docs, an implementation agent may proceed within those constraints.

## Story canon decisions still open

- Exact first-husband history and reason for divorce.
- Exact supporting-cast identities, names, and biographies beyond current structural roles.
- Exact wedding speech/private disclosure that becomes Anna's final-straw incident.
- Exact dementia diagnosis, stage progression, and calendar duration.
- Exact circumstances/timing of Evelyn's death or final care transition.
- Exact form, wording, timing, and loss mechanism of Anna's possible final message.
- Whether the missed-Anna-message outcome is avoidable, fixed, or one of several branches.
- Exact threshold/prerequisites for each ending family.
- Whether any family relationship outcome is impossible within a single run.
- Exact wording of major apologies, recordings, therapy breakthroughs, or Robert artifacts.
- Final number/identity of recurring caregivers.
- Exact first physical clue and exact first scanned mail item.
- Exact sender/wording of the early "use the therapeutic features" message.

## Product/design decisions still open

- Final user-facing names for difficulty modes.
- Whether adaptive difficulty defaults on or off.
- Exact compute/context economy values.
- Exact number of protected-memory slots.
- Whether regeneration is available from the start or unlocked later.
- Whether stability/ensemble analysis is a standard capability or later unlock.
- Exact save-slot / branch-from-checkpoint UX.
- Exact post-game archive / ending gallery presentation.
- Whether a hypothetical commercial version keeps live generative AI, moves mostly deterministic, or offers a separate generative mode.

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

1. exact first 30-45 minute content details
   - caregiver identity
   - grocery problem
   - first scanned mail item
   - family-message sender/wording
2. exact wedding incident/private disclosure
3. dementia timeline/diagnosis shape
4. which ending(s) should be achievable in an initial vertical slice
5. whether the first build should implement real generative dialogue or deterministic fixtures behind the same interfaces
