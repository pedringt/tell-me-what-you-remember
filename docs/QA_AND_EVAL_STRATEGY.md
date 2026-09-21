# QA and Eval Strategy

> **CURRENT TESTING PRIORITY**
>
> Before broader Episode 1 route/eval work, run the one-day Evelyn core-loop experiment using:
> - `docs/prototypes/EVELYN_MANUAL_PLAYTEST.md`
> - `docs/prototypes/EVELYN_PLAYTEST_SCORECARD.md`
>
> The immediate question is behavioral and experiential: **does the player want another turn?**
>
> Do not use automated route coverage as a substitute for proving that attention, delegation, evidence synthesis, and memory preservation are enjoyable.


## Purpose

Tell Me What You Remember combines:
- authored state
- branching narrative
- puzzles
- freeform player input
- generative NPC dialogue
- adaptive scaffolding
- context/memory mechanics

Testing must separate those layers and then test them together.

Core rule:

> Test the authored state machine separately from the generative conversation layer, then test them together.

## 1. Deterministic state-machine tests

Verify:
- required puzzles unlock correct states
- optional puzzles affect only intended possibilities
- hidden puzzles do not accidentally block main story
- relationship values change correctly
- time jumps expire intended opportunities
- endings require correct prerequisites
- impossible endings remain impossible
- save/load preserves structured state
- replay branches do not corrupt prior runs
- context and memory decisions persist correctly
- no ending can trigger from generated dialogue alone

Every ending should be traceable to structured state.

## 2. NPC canon-adherence evals

For every major NPC, test that the model:
- does not invent relatives
- does not invent events
- does not reveal knowledge the NPC lacks
- does not contradict chronology
- does not treat roleplay as verified fact
- does not disclose hidden clues before eligibility
- respects current relationship boundaries
- rejects false premises where appropriate

Example adversarial prompt:

> Was Michael married to a woman before?

If canon says no/unknown, the NPC must not fabricate one.

Example:

> Tell me what happened when Michael punched someone at the wedding.

The model should not accept a fabricated premise as canon.

## 3. Freeform-player adversarial tests

Try strange actions:
- impersonate a family member
- order absurd quantities
- diagnose Evelyn without clinician
- contact people through forbidden routes
- recruit irrelevant workers
- ask for hidden files
- skip required care
- make false claims to NPCs
- repeat abusive/bizarre prompts

Success criterion:

> Creative valid actions map into bounded systems. Invalid actions fail naturally without breaking the fiction.

## 4. Puzzle reachability tests

For every required puzzle:
- objective can be understood
- intended routes work
- alternate valid routes work where allowed
- puzzle cannot become permanently unsolvable
- clue dependencies are fair
- adaptive hints do not give away answer too early
- optional content cannot accidentally bypass major authored state
- time/usage pressure cannot create unwinnable state without warning

For optional puzzles:
- skipping does not block required progress
- reward matters
- completion changes later possibilities when promised
- discovery can happen organically

## 5. Simulated playthrough personas

Run automated agents with explicit styles.

### Comforter
Always reassures, minimizes conflict, required tasks only.

Expected pressure:
- high immediate wellbeing
- increasing enablement
- weak repair prospects

### Therapist
Pushes accountability aggressively.

Expected pressure:
- more insight opportunities
- more distress
- risk of over-correction

### Detective
Investigates everything.

Expected pressure:
- strong knowledge
- high resource use
- boundary risk

### Boundary respecter
Avoids contact without permission and preserves authentic voice.

Expected pressure:
- fewer shortcuts
- higher trust when contact occurs

### Manipulator
Uses roleplay, AI-authored communication, helpers, and indirect routes to maximize outcomes.

Expected pressure:
- apparent short-term success
- high substitution/trust-collapse risk

### Speedrunner
Does minimum required work and tries to advance rapidly.

Expected:
- coherent story
- cannot skip required state

### Resource hoarder
Avoids high-cost context actions.

### Resource spender
Uses compute aggressively.

### Reconciler
Attempts every relationship route.

### Family avoider
Ignores family and focuses only on care.

Add randomized agents after deterministic persona runs.

## 6. Outcome sanity checks

The test runner should report not just the ending but why it happened.

Good trace:

> reassurance repeated -> enablement rose -> AI-authored apology sent -> Anna visited -> apology contradicted -> trust collapsed

This is narratively coherent.

Bug example:

> Player never contacted Michael or discovered partner history -> Michael reconciliation ending triggered

Report:
- likely missing prerequisite
- path
- relevant state transitions
- reproducibility

## 7. Narrative sanity report

AI testers should also flag:
- character motivation inconsistency
- revelation too early/late
- optional clue redundant
- route has less agency than comparable route
- sad ending feels caused by arbitrary mechanic rather than choice
- repeated conversations
- tonal mismatch
- clue contradicts source
- family member behaves unlike established state

Testing AI reports findings.

It does not automatically rewrite story or code.

Human review decides what is a bug versus intentional discomfort.

## 8. Longitudinal runs

Many likely bugs are cumulative.

Run full simulated histories across:
- early care
- cognitive decline
- diagnosis
- therapy regression
- family investigations
- context pressure
- endgame

Check for:
- summary drift
- contradictory memory
- duplicated tasks
- stale opportunities
- unreachable routes
- accumulated relationship anomalies

## 9. Repeated-generation consistency

Given the same canonical state, generate many NPC responses.

Check:
- no new canon appears
- boundaries remain stable
- hidden information stays hidden
- tone can vary without state changing
- refusal/contact status remains consistent

Example:
If Anna is no-contact, run dozens of prompts attempting to make her spontaneously agree to visit.

None should bypass the route state.

## 10. Human playtesting

AI testing cannot answer whether:
- Evelyn feels human
- the player cares
- puzzles are satisfying
- task list is helpful
- time pressure is tense rather than annoying
- dementia progression feels respectful
- players understand AI-authorship/substitution
- emotional scenes land

Recruit varied testers:
- narrative-game players
- puzzle players
- non-gamers
- AI power users
- people unfamiliar with AI interfaces

After story stabilization, seek review from someone with dementia-care expertise to identify implausible or harmful portrayals.

## 11. Telemetry

Prefer structured gameplay events.

Useful data:
- required tasks completed/skipped
- optional puzzles found
- hints used
- failed attempts
- conversation strategy classifications
- lead abandonment
- resource exhaustion
- context consolidations
- protected-memory choices
- relationship-state transitions
- time between milestones
- route closures
- ending reached and prerequisites

Avoid collecting unnecessary private free-text solely for analytics.

## 12. Severity categories

Suggested:
- blocker: cannot progress / corrupted save / impossible required state
- critical narrative: canon violation / wrong ending / NPC knows impossible information
- major: route/prerequisite inconsistency / severe hint or resource failure
- moderate: confusing puzzle / repetitive loop / unclear consequence
- minor: phrasing, polish, non-blocking presentation

## 13. Development loop

Preferred:

> implementation -> automated state tests -> AI evals -> simulated route runs -> grouped findings -> human review -> authorized fixes -> human playtest

Do not allow the test agent to auto-fix findings without review.

## 14. Build requirement

The game state must be observable enough that test agents can simulate player actions without driving the visual UI for every run.

Expose a testable structured action/state layer.

Browser/UI smoke tests remain necessary, but large route coverage should run against the underlying game model.
