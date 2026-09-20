# Start Here: New Chat / Tool Handoff

You are continuing work on **Tell Me What You Remember**.

## Repository

- GitHub: https://github.com/pedringt/tell-me-what-you-remember
- Active development branch: `ai-v1-hardening`
- Production branch: `main`
- Live production: https://tell-me-what-you-remember.vercel.app/

## First rule

Do **not** merge to `main`, deploy production, or publish anything unless Paige explicitly authorizes that destination in the current conversation.

## Read in this order

1. `docs/handoffs/prototype-v0-current-status.md`
2. `docs/GAME_IDEA_BIBLE.md`
3. `docs/story-development/RESEARCH_THEMES_AND_EPISODE_SEEDS.md`
4. `PROTOTYPE_STORY_GUIDE.md`
5. `docs/STORY_FLOWS.md`
6. `docs/CASE_STUDY_NOTES.md`
7. `docs/AI_ACTION_AUDIT.md`
8. `docs/AI_DIALOGUE_CANON.md`
9. `docs/AI_CANON_STATE_PACKET.md`
10. `docs/AI_V1_PLAYTEST.md`
11. `docs/ai-intent-evals.json`

## Current situation

Production has the first AI intent layer, but its live eval reports:

> AI interpreter not configured

The prepared hardening branch contains the long-term fix:

- Vercel AI SDK
- automatic Vercel OIDC path for AI Gateway
- GPT-5.6 Luna intent classification
- state-gated available actions
- 0.72 normal confidence threshold
- 0.90 high-risk threshold
- clarification instead of low-confidence action
- 34-case intent eval suite
- 10 dangerous/collision cases

The branch is currently 19 commits ahead and 1 commit behind `main`; the one commit behind is only the empty production redeploy retry commit.

## Most important recent playtest findings

Do not assume the current UI/story flow is final.

Paige found:

- opening transcript has too much system text
- a terminal-like landing page with a blinking cursor would be better
- practical instructions should move into HELP
- contextual choices should scaffold the beginning and important moments
- "nothing" should be truthful on the first clean run and only later become concealment when there is something to hide
- "What do I do now?" should get a useful in-world answer, not a parser failure
- parser failure should not introduce Echo
- Echo likely belongs in a separate private/unauthorized side channel
- text should reveal/stream quickly rather than appear all at once
- debug-like `INPUT INTERPRETATION FAILED` should not appear during ordinary play

These are recorded as design direction, not all implemented.

## Core creative rules

> The player is always AI.

> The story is authored; the solution space is not completely authored.

> Software controls reality. AI controls interpretation.

> AI can elaborate on canon. It cannot create canon.

> Concealment is not a phrase. Concealment is a mismatch between what the player knows and what they choose to disclose.

> Research the system deeply enough that the fiction can stay simple.

## Purpose of the project

This is not primarily an AI-learning project.

The goal is to use existing applied-AI understanding to push into creative territory and explore interactions, narrative mechanics, memory, ambiguity, and adaptation that would be difficult or impossible to achieve deterministically.

Do not force AI into features simply to say the game uses AI.

## If continuing technical work

Before generated dialogue:

1. reconcile branch divergence safely
2. promote hardening only with explicit `main` authorization
3. run live intent eval
4. require >=90% accuracy and zero dangerous false positives
5. fix intent layer first

## If continuing story/design work

Use `docs/GAME_IDEA_BIBLE.md` as the primary living idea bank.

Also read `docs/story-development/RESEARCH_THEMES_AND_EPISODE_SEEDS.md` for the expanded research-backed theme map, memory/dependency ideas, identity/selfhood notes, loneliness, digital immortality/Ozymandias material, new episode seeds, anthology-cohesion model, and inspiration compass. Treat that file as **story seed / research bank**, not canon.

Preserve the distinction between:

- established principles
- current prototype truth
- possible future material
- open questions

Do not silently turn brainstorming into canon.
