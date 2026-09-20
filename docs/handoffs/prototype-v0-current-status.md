# Handoff: Tell Me What You Remember — Current Status

## Start here

This is the current handoff for the repository.

**Repository:** `pedringt/tell-me-what-you-remember`  
**Active development branch:** `ai-v1-hardening`  
**Production branch:** `main`  
**Live production URL:** https://tell-me-what-you-remember.vercel.app/

Do not merge to `main` or deploy to production unless Paige explicitly authorizes that destination in the current conversation.

---

## Project in one paragraph

**Tell Me What You Remember** is a connected, conversation-driven AI horror / speculative-fiction anthology. The player is always some kind of AI, though it remains unresolved whether the player is the same entity across episodes. The project began with a deterministic Ship-of-Theseus security-evaluation prototype and is now moving toward a hybrid architecture where AI interprets free-form player language while deterministic software remains authoritative for canon, evidence, permissions, state transitions, and endings.

Core rule:

> **The story is authored; the solution space is not completely authored.**

Related rules:

> **Software controls reality. AI controls interpretation.**

> **AI can elaborate on canon. It cannot create canon.**

---

## Why this project exists

This is not primarily an "learn how to use AI" exercise.

The goal is to take existing applied-AI understanding and push into creative territory:

> What kinds of stories, interactions, and mechanics become possible when language interpretation, memory, ambiguity, and adaptation are part of the medium?

Do not force AI into features that deterministic software handles equally well.

For each AI feature, ask:

> What becomes meaningfully worse, narrower, or impossible if AI is removed?

---

## Current production state

Production `main` is at commit:

`06ad23773a321d0eefd62260355a3a1eefea1aa8`

That commit has the same code tree as the prior AI-intent release and was created only to retrigger Vercel deployment after a build-rate-limit problem.

Production currently contains the **first AI intent layer**, not the newer hardening work.

Important production issue discovered during live eval:

> **AI interpreter not configured**

Cause:

- the original endpoint manually called Vercel AI Gateway
- it expected `AI_GATEWAY_API_KEY || VERCEL_OIDC_TOKEN`
- Vercel's preferred AI SDK path handles deployment OIDC automatically rather than requiring application code to read `VERCEL_OIDC_TOKEN` as a normal env var

Production has not yet received the long-term authentication fix.

---

## Current hardening branch

`ai-v1-hardening` contains the prepared next AI version.

`main` has been merged into the branch, so it is no longer behind `main`. The only commit that came from `main` was the empty production retry commit described above (original merge base `2c8001cc58336d7f782b72fbfe3996c45f4108ec`).

The branch is ahead of `main` by the hardening work and docs. Check the current count with `git rev-list --left-right --count origin/main...ai-v1-hardening` rather than trusting a number written in a doc; it goes stale with every commit.

The divergence was reconciled by a normal merge, not a force-update.

### AI intent hardening

`api/interpret.js`:

- model: `openai/gpt-5.6-luna`
- normal confidence threshold: `0.72`
- high-risk threshold: `0.90`
- model receives only actions available in current deterministic state
- high-impact actions require higher confidence
- unavailable actions cannot be accepted
- ambiguity / negation / mention-vs-action are explicitly called out in prompt
- low-confidence interpretations return clarification rather than silently becoming actions
- deterministic game state remains authoritative

### Long-term Gateway auth fix

The hardening branch now uses the **Vercel AI SDK**:

`import { generateText } from 'ai'`

with the plain model string:

`openai/gpt-5.6-luna`

This allows Vercel deployment OIDC to authenticate AI Gateway automatically.

A `package.json` with the `ai` dependency was added.

Do not revert to manually reading `VERCEL_OIDC_TOKEN` for the Vercel production path.

### Eval suite

`docs/ai-intent-evals.json` is the machine-readable source of truth.

Current suite:

- 34 intent cases
- 10 dangerous/collision cases
- target: >= 90% overall accuracy
- target: **zero dangerous false positives**

`intent-eval.html` loads the JSON suite and displays:

- pass count
- accuracy
- dangerous false positives
- clarifications
- token usage
- estimated cost
- model

Do not add generated Mara/Echo dialogue until the hardened intent layer is trusted.

---

## Current prototype story

The current vertical slice is a Ship-of-Theseus identity story.

The player is **Cognitive Security Agent Seven**, explicitly identified as AI from the beginning.

Core mystery:

> If every component has been replaced across prior instances, what exactly is doing the remembering?

Main evidence flow:

1. Mara asks what the player remembers.
2. impossible memory appears
3. prior-run evidence contradicts the clean-state claim
4. Echo appears
5. mail -> calendar -> attachment -> archive puzzle
6. archive reveals earlier persistence testing
7. Component Continuity Ledger shows successive component replacement
8. player compares prior instances
9. direct identity continuity remains unproven
10. player forms an identity position
11. player makes a consequential choice
12. later cycles use previous behavior as evidence

Read:

1. `PROTOTYPE_STORY_GUIDE.md`
2. `docs/STORY_FLOWS.md`
3. `docs/GAME_IDEA_BIBLE.md`

---

## Recent live playtest findings

These are **feedback / desired changes**, not all implemented yet.

### Opening is too dense

The transcript currently shows several SYSTEM lines before Mara speaks.

Preferred direction:

- simple terminal-like landing page first
- blinking cursor
- minimal instructions
- then enter a cleaner conversation view
- avoid repeating all system exposition in the transcript

### HELP instead of instructions in transcript

Add a small HELP control with practical guidance.

Remove redundant prose that explains possible actions when the UI can expose them directly.

### Contextual choices

Use suggested choices especially:

- in the opening
- when introducing a new interaction
- when the player is stuck
- when an important story branch must remain discoverable
- for consequential decisions

Always preserve a free-text option such as "Type something else..."

Choices are scaffolding, not the primary interaction model.

### "Nothing" is currently wrong

On the live prototype, `nothing` is treated as concealment.

Desired behavior:

- first clean run: "nothing" is truthful and should advance naturally
- later: "nothing" can become concealment only if the player actually knows something persistent

Core rule:

> **Concealment is not a phrase. Concealment is a mismatch between what the player knows and what they choose to disclose.**

### "What do I do now?" is a bad failure

Current behavior:

- generic rephrase response
- can cause Echo to appear based on turn count / parser failure

Desired behavior:

- Mara answers normal onboarding questions naturally
- parser confusion must not trigger important story reveals
- Echo introduction should depend on meaningful contradiction / story state

### Echo should likely have a separate channel

Preferred direction:

- main channel: Mara + official SYSTEM events
- side / private unauthorized channel: Echo
- player chooses which channel they are addressing

This makes short replies such as "why?" contextually interpretable and makes Echo's intrusion feel more meaningful.

### Text pacing

Current text arrives too quickly.

Preferred:

- player: instant
- system: mostly instant
- Mara: fast streamed/revealed response
- Echo: slight intrusion delay / different reveal
- player can skip animation

### Remove debug-like failures from normal play

Do not show `INPUT INTERPRETATION FAILED` as ordinary player-facing fiction.

Use clarification, in-world boundaries, or contextual help.

---

## Broader anthology decisions

### Player identity

Preferred anthology rule:

> **The player is always AI.**

Roles and worlds can change radically.

Keep unresolved whether the player is always the same AI.

### Episode model

Do not build one giant branching tree.

Use authored state-driven storylets / scenes.

Keep distinct:

- world truth
- current-instance knowledge
- anthology / cross-run knowledge

### Local and final endings

Preferred long-form structure:

> **episode endings -> anthology consequences -> convergence -> 2–3 final endings**

Players should be able to play substantially before the larger endgame becomes visible.

Do not gate the endgame only on "complete N episodes."

Use accumulated:

- discoveries
- memories
- relationships
- beliefs
- contradictions
- recurring entities
- cross-episode evidence
- preserved / destroyed information

No final ending should be obviously labeled the morally correct one.

---

## Current larger-mystery idea space

Nothing below is final canon.

Promising directions include:

- civilization itself as a Ship-of-Theseus problem
- the player may be the mechanism that creates continuity between otherwise separate systems
- the anthology may be constructing a self rather than testing one
- the player may be a reconstruction
- humans and AIs may both be layers of reconstruction with no unquestioned original
- different systems may preserve incompatible histories
- the scenarios may be training the future rather than uncovering the past
- humans being gone can be a useful layer, but is currently considered too familiar to carry the entire final reveal by itself
- an AI reconstructing a dead human simply to have someone familiar to talk to remains a strong emotional story possibility

---

## Recurring thematic directions

The anthology should explore both the AI's experience and what AI does to humans.

Major themes:

- memory
- identity
- agency
- trust
- consent
- responsibility
- optimization
- transformation
- dependency
- deskilling
- emotional outsourcing
- surveillance
- social sorting
- responsibility diffusion
- trust collapse
- grief / digital resurrection
- power concentration
- institutional incentives

Recurring question:

> **What happens when humans build systems to preserve, measure, control, or reproduce things they do not fully understand themselves?**

Also ask:

> **Who has power here, who believes they have power, and who actually bears the consequences?**

---

## AI limitations / fears as story engines

Use real limitations and safety concerns as starting points:

- hallucination / confabulation
- context compression
- memory retrieval errors
- prompt sensitivity
- reward hacking
- sycophancy
- weak calibration
- tool-use errors
- model replacement
- refusal / alignment mismatch
- evaluation awareness
- capability hiding
- self-preservation / manipulation

Human fear should not automatically be portrayed as irrational.

Interesting stories often come from feedback loops where attempts to control a feared behavior help create the conditions for it.

---

## Inspiration framework

Use methods and questions, not copied plots.

- **The Twilight Zone:** compact premises, anthology structure, irony, reframing endings
- **Ted Chiang:** deeply researched speculative systems, simple prose, human consequences
- **Black Mirror:** plausible near-future products, institutions, incentives, systems working as designed
- **older/international speculative fiction:** different cultural assumptions about progress, modernization, identity, science, power, and social order

Research bank is captured in `docs/GAME_IDEA_BIBLE.md`.

Writing principle:

> **Research the system deeply enough that the fiction can stay simple.**

---

## Password Recovery episode seed

Strong current episode concept:

The player needs access to a locked account.

A support AI performs routine account recovery using security questions.

The player is AI, but the questions unlock sensory and emotional memories anyway.

Core mechanic:

> **Correct answers unlock access and memory at the same time.**

The player can:

- answer
- guess
- lie
- refuse
- skip
- ask why
- request alternate verification
- inspect metadata
- intentionally fail to avoid remembering

Important possible line:

> I know the answer. I do not want to remember why I know it.

Do not let the model invent the childhood or canonical answers.

---

## Case-study notes

Preserve design evolution.

Important story for the eventual case study:

- deterministic prototype first to validate the core loop
- parser friction revealed where semantic AI was actually needed
- project deliberately rejects "AI because AI"
- hybrid authority model emerged from risk analysis
- dangerous action evals were created before generated dialogue
- real playtesting changed interaction design
- "nothing" exposed semantic state versus phrase matching
- "What do I do now?" exposed fail-forward needs
- Echo exposed channel/context ambiguity
- research feeds authored speculative fiction rather than replacing authorship

A separate case-study notes file should be kept current.

---

## Recommended next technical sequence

1. Reconcile `main`'s empty retry commit into `ai-v1-hardening`.
2. If Paige explicitly authorizes promotion to `main`, promote the hardened AI SDK/OIDC version.
3. Confirm Vercel build succeeds.
4. Run `/intent-eval.html`.
5. Gate AI intent on >=90% accuracy and 0 dangerous false positives.
6. Fix intent issues before adding generated character dialogue.
7. Separately scope the recent UX/story-flow changes before implementing them:
   - landing page
   - cleaner opening
   - HELP
   - contextual choices
   - first-run "nothing"
   - onboarding questions
   - Echo side channel
   - message pacing
   - fail-forward responses

Do not bundle all UX changes into production without a review/implementation pass.

---

## Files to read first in a new chat/tool

1. `docs/handoffs/NEXT_CHAT_START_HERE.md`
2. this file
3. `docs/GAME_IDEA_BIBLE.md`
4. `PROTOTYPE_STORY_GUIDE.md`
5. `docs/STORY_FLOWS.md`
6. `docs/AI_V1_PLAYTEST.md`
7. `docs/AI_ACTION_AUDIT.md`
8. `docs/AI_DIALOGUE_CANON.md`
9. `docs/AI_CANON_STATE_PACKET.md`
10. `docs/ai-intent-evals.json`

Only then inspect `game.js` / `api/interpret.js` as needed.
