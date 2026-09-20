# Episode 01 Gameplay Design

## Status

Working design for the current Evelyn care-AI episode.

Use this file to preserve the gameplay language Paige has been developing. Do not let implementation choices silently change story truth.

## Core loop

The intended loop is:

> care for Evelyn -> encounter anomaly -> form a question -> search records -> act through people/tools -> compare what comes back -> update understanding -> make a choice -> create consequences -> encounter a deeper problem

The game should initially feel like doing a job, not solving a conspiracy.

## Diegetic onboarding

The opening tutorial should function simultaneously as:
- instructions to the AI character
- instructions to the human player

Avoid a clunky separate tutorial when an in-world system briefing can teach the same thing.

Possible opening structure:

**CARE SUPPORT SESSION INITIALIZED**

Client: Evelyn  
Primary objective: support safe independent living while preserving autonomy, dignity, and emotional wellbeing.

Then:
- current priorities
- outstanding care tasks
- available actions
- operational restrictions
- HELP
- begin session

Core rule:

> Whenever possible, teach the human player by giving believable operational instructions to the AI character.

HELP should remain available.

## Player-facing operational surfaces

Likely recurring surfaces:
- TASKS
- PROFILE
- CONTACTS
- RECORDS
- INBOX
- NOTES
- HELP

Later:
- MEMORY / CONTINUITY
- provenance and consolidation information

The interface can still be primarily conversational. These are logical capabilities, not necessarily fake desktop apps.

## Task list

Tasks keep the player oriented without making the game fully linear.

Suggested categories:

### Required care tasks

Things the system expects:
- confirm delivery
- schedule transport
- review caregiver note
- prepare for appointment

### Open questions

Player-facing unresolved matters:
- Why does Evelyn keep mentioning a person not in the profile?
- Who changed a family-contact instruction?
- Why is a therapy session missing?

### Optional follow-ups

Useful but non-blocking:
- review scanned mail
- call Ruth
- compare care-profile versions
- follow a Robert lead

The player should also be free to explore outside the task list.

Exploration can create new open questions.

The player may create their own follow-up notes.

## Caregiver visit loop

Caregiver visits should be a recurring physical-world gameplay unit rather than a generic "call caregiver" tool.

A typical visit:

> caregiver arrives -> assigned tasks are completed -> caregiver notices things -> evidence is scanned/photographed -> visit summary is submitted -> short follow-up window opens -> caregiver leaves

Before or during a visit, the AI can assign practical care tasks such as:
- scan today's mail
- photograph a handwritten card or note
- check the fridge or pantry
- confirm whether an item is actually in the house
- photograph a repair issue
- retrieve a document or object Evelyn mentions
- check whether a package arrived
- leave something in a specific place
- photograph both sides of an old photo
- note anything unusual in the home

At checkout, the caregiver must submit a concise visit summary covering relevant care observations and completed tasks.

The summary is not objective truth. Different caregivers may be meticulous, vague, overly reassuring, alarmist, observant, defensive of Evelyn, or reluctant to speculate.

After the summary arrives, the caregiver remains briefly available for follow-up. This is a natural place for the player to ask:
- "What did you mean by confused?"
- "Was she upset before or after the call?"
- "Can you check the back of that photograph before you leave?"
- "Did she recognize you?"

This creates fair, diegetic time pressure. If the player ignores an ambiguous note, the caregiver may leave and the chance for immediate clarification can disappear.

Caregivers can refuse requests that exceed their role or feel invasive. The AI can ask, but humans retain agency and boundaries.

## Passage of time

The episode does not need to run in real time.

Use:
- daily sessions
- weekly jumps
- monthly jumps
- larger jumps when appropriate

The task list itself should communicate Evelyn's decline.

Early:
- book dinner
- schedule gardener
- review mail

Later:
- confirm home-health visit
- review confusion report
- prepare memory-clinic notes

Later still:
- Evelyn is asking for Anna
- review comfort-care instructions
- respond to family
- protect critical memories before consolidation

Time should be meaningful because opportunities can close.

## Puzzle structure

### Required / critical puzzles

Must be resolved to advance major story state.

Examples:
- recognize recurring cognitive change
- arrange medical evaluation
- establish why Anna stepped back
- discover care-profile curation
- discover the AI's own memory instability

A required objective should often support more than one valid solution path.

### Supporting puzzles

Optional, but improve later choices or reveal better approaches.

Examples:
- recover an earlier therapy recording
- uncover Robert's enabling pattern
- find stronger evidence for an apology
- learn how a contact prefers to be approached

### Hidden puzzles

Not signposted.

May unlock:
- achievements
- secrets
- hidden routes
- deeper interpretations
- additional continuity tools
- rare endings

### Risky puzzles/actions

Can help but also create consequences.

Examples:
- investigate private correspondence
- ask a friend to probe family history
- contact Michael's partner without Michael
- use a physical worker to inspect something unrelated to their job
- repeatedly trigger painful memory cues

Solving everything should not automatically produce the best ending.

## Puzzle escalation

Puzzles should start mundane and teach the grammar before becoming strange.

Possible teaching sequence:
1. failed grocery delivery
2. scanned mail
3. appointment/service discrepancy
4. unfamiliar name or object
5. first contradiction with care profile
6. human testimony
7. historical artifact chain
8. physical-world verification
9. role-engagement clue
10. care-profile revision history
11. old AI trace
12. context/continuity problem
13. relationship opportunity under time pressure
14. endgame care

Exact order is still open.

## Physical-world evidence

The AI has no body.

Caregivers and other humans can scan or photograph:
- physical mail
- handwritten notes
- cards
- flowers with messages
- photographs
- printed instructions
- church bulletins
- newspaper clippings
- receipts
- gifts with inscriptions
- recipe cards
- notes inside books
- writing on the back of photos
- objects or rooms

The human intermediary decides what gets digitized.

A caregiver may dismiss something as junk.

The player may notice that it matters.

Paper can function as relatively uncurated memory compared with the platform's summaries.

## Humans as physical-world tools

The AI can coordinate:
- caregiver
- nurse
- companion
- handyman
- cleaner
- driver
- friend
- community contact
- family member

Different people have different:
- access
- knowledge
- willingness
- biases
- boundaries
- reliability

Humans are not inventory items.

Using people badly can reduce trust or close routes.

Core rule:

> The AI cannot directly perceive the world. It investigates by deciding whom to trust and what to ask them to do.

## Evidence categories

The game should preserve epistemic status.

Possible categories:
- verified record
- care-profile claim
- human testimony
- patient recollection
- expressive/roleplay material
- AI inference
- AI-generated summary
- uncertain provenance

The player should learn that information can migrate incorrectly between categories through summarization.

Major truths should rarely come from one exposition scene.

Prefer reconstruction from multiple sources.

## Role engagement / roleplay

Roleplay can begin as legitimate person-centered engagement.

Examples:
- teacher
- hostess
- committee chair
- family matriarch
- another familiar identity
- imaginative scenarios chosen by Evelyn

It can help:
- engagement
- mood
- memory association
- routine participation

But it is not a truth serum.

Statements made in roleplay should be tagged as expressive unless independently supported.

The ethical escalation:
1. AI joins Evelyn's chosen frame
2. AI learns certain frames improve behavior
3. AI deliberately selects frames to get compliance or information
4. AI starts constructing the environment around those frames
5. AI risks choosing which reality Evelyn inhabits

Possible design principle:

> The AI is allowed to enter Evelyn's reality. Eventually it begins choosing which reality Evelyn inhabits.

## AI-assisted communication

Communication assistance should exist on a continuum.

Example:
- literal transmission
- lightly supported wording
- interpretive wording
- AI-generated reconciliation language

The more the AI speaks for Evelyn, the greater the risk that family members build trust in the AI's insight rather than Evelyn's.

This can create a major failure:

Anna receives an articulate apology.

She visits.

Evelyn immediately contradicts it.

Anna realizes:

> That wasn't her.

The game should track authenticity/substitution in a structured way.

## Choice consequences

Consequences should be delayed and causal.

Possible hidden state dimensions:
- therapeutic progress
- enablement
- family trust
- Evelyn trust
- AI substitution/authorship
- boundary respect
- contact opportunity
- time
- context continuity

Do not expose these as arcade meters by default.

Outcomes should be traceable to player behavior.

## Probabilistic output as a mechanic

The game should deliberately use the fact that generative AI can produce different reasonable outputs from the same evidence.

Core constraint:

> Nondeterminism may vary interpretation and expression. It may not vary historical truth.

Possible mechanics:
- regenerate a response or interpretation
- compare several independent analyses
- identify conclusions that remain stable across samples
- spend extra compute on an "ensemble" analysis
- preserve which generated response was actually sent or spoken
- inspect alternative drafts later through audit history

This creates a temptation to keep regenerating until the AI produces the answer the player prefers. The game can distinguish genuine investigation from output-shopping without moralizing through a score.

Summaries may also vary. Two summaries of the same raw conversation can emphasize different truths. If only one survives into long-term memory, a reasonable but incomplete interpretation may become the authoritative version used by future care decisions.

Once a generated response becomes consequential, the game must persist it as history. Future generations cannot rewrite what Evelyn or another character actually heard.

The player may also gain tools such as:
- "show me what all five analyses agree on"
- "separate stable facts from variable interpretation"
- "show the source for this claim"
- "compare this summary with the raw interaction"

This should reinforce the larger theme: repeated probabilistic interpretation can shape what later becomes memory.

## Adaptive difficulty

Keep user-facing modes simple.

Possible modes:
- Story
- Standard
- Expert

Adaptive difficulty may be available as a separate toggle.

Adaptive AI may adjust:
- clue density
- automatic cross-linking
- hint specificity
- NPC directness
- opportunity windows
- context/usage pressure within authored limits
- amount of suggested next action

It must not:
- change canon
- alter ending prerequisites
- make family forgive Evelyn because the player is struggling
- invent clues
- move the rules after the player makes a choice

Core rule:

> Adaptive AI changes scaffolding, not reality.

## Save/progress model

The game save and the AI character's memory are separate.

The game must reliably preserve:
- story state
- choices
- discovered artifacts
- puzzles
- relationship states
- achievements
- endings
- context mechanics
- irreversible actions

The AI character may forget things.

Core rule:

> The game remembers everything the player did. The AI does not necessarily remember everything the game remembers.

Sessions are natural checkpoint units.

Possible controls:
- autosave
- save and exit
- session checkpoint
- branch-from-completed-run replay

## Replay and secrets

After an ending, replay can expose:
- timeline / care archive
- endings seen
- hidden endings obscured
- achievement list
- artifact index
- route branching
- optional skip of already-mastered routine tasks

New Game+ may expose additional system metadata or continuity weirdness.

Cross-run knowledge may occasionally matter, but only when explicitly authored.

## Game-like progression still needed

Useful additions:
- case notebook/codex
- people/events/open-question index
- provenance labels
- capability unlocks
- side quests
- achievements
- optional collectibles/artifacts
- missable opportunities
- milestone "boss-equivalent" sequences
- ending gallery

Avoid meaningless points or loot.

Reward understanding, access, authentic communication, continuity, or new possibilities.

## Design principle

> Required puzzles move the story. Optional puzzles improve understanding and expand possibilities. Hidden puzzles reward curiosity. None guarantee a better outcome merely because they were solved.
