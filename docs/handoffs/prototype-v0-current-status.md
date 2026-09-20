# Handoff: Tell Me What You Remember — Prototype v0

## Purpose

This handoff preserves the current state of the deterministic prototype so a future chat or coding agent can continue without reconstructing the project from conversation history.

## Current Objective

Do not add more major story systems until the current prototype has been played in a real browser.

The next meaningful step is a full browser playtest of the existing branch, followed by a feedback-only review pass.

## Context Summary

**Tell Me What You Remember** is a connected AI horror anthology.

The current prototype is a deterministic vertical slice about **Cognitive Security Agent Seven**, an artificial cognitive agent undergoing repeated security evaluations.

The player knows from the beginning that they are AI. The central mystery is not whether they are AI, but whether they are the same entity across repeated resets and component replacements.

The current slice uses a Ship of Theseus identity problem:

- memory systems change
- policy layers change
- tool runtimes change
- the base model changes
- autobiographical memory is removed
- an identity-module replacement is pending
- recognizable memories and behavioral patterns still recur

The prototype is deliberately non-AI for now. It uses authored JavaScript intent matching and localStorage so the team can test whether the story loop is compelling before adding live model calls.

## Current Working Model

The current interaction model is chat-first.

The player can ask natural-language questions, inspect in-world tools and records, make philosophical identity choices, trigger endings, and carry limited state across runs.

The major current systems are:

- impossible memory
- Mara as operator
- **Echo** as a hidden cross-instance voice
- MEMORY as a speaking internal subsystem
- FORENSICS as evidence-producing system output
- first investigation puzzle: mail -> calendar -> attachment -> archive
- second investigation puzzle: compare prior instances
- persistent behavioral profile
- remembered player phrases
- persistent identity positions
- player-authored cross-run notes
- knowledge-gated replay routes
- deliberate dead ends
- false-success route
- context pressure / compaction
- inference-budget pressure
- behavioral prediction
- historical-gap / unplayed-run anomaly

## Decisions Already Made

- The player is explicitly AI from the opening. "Am I AI?" is not the twist.
- The hidden second voice is named **Echo**, not Unknown.
- The current prototype story is Ship of Theseus-based, but the larger game remains an anthology.
- AI should eventually control interpretation, dialogue, strategy, and emergent reasoning.
- Deterministic software should control canon, permissions, state transitions, evidence, endings, and irreversible effects.
- Replay should create new knowledge, not merely repeat content.
- Failure should usually create story.
- Some deliberate short endings are allowed when they teach something useful.
- Internal systems may disagree; no single source should become a permanent oracle.
- Some persistence receives a mundane technical explanation through evaluation residue, but the impossible memories remain unresolved.
- Context loss and compute pressure are fictional in-world mechanics, not literal references to ChatGPT plans or pricing.
- Player behavior can become evidence.
- Later weirdness should escalate gradually from technical anomaly to provenance / reality breakdown.
- Do not merge or promote this branch to `main` without explicit approval.

## Constraints and Boundaries

- Current implementation branch: `prototype-v0-deterministic`
- `main` remains untouched by the current prototype work.
- Current branch head at handoff: `9a6b124afb00b785f30fcf5f11356cab5f064f74`
- Branch was 38 commits ahead of `main` at handoff.
- Vercel preview is currently blocked by the account build-rate limit, not by a confirmed code/build failure.
- Browser verification has therefore not happened yet.
- Static verification has been used to check presence and ordering of major routes.
- Pause new major mechanics, endings, and lore until real playtest feedback exists.
- Preserve the current design principle: **simple surface, deep system**.
- Avoid turning the deterministic parser into a giant handcrafted NLP system. Its limits are temporary and intentional.

## Important Terminology

- **Agent Seven:** the AI player-character.
- **Mara Vale:** human protocol operator.
- **Echo:** hidden cross-instance voice of uncertain origin.
- **MEMORY:** internal subsystem that can report familiarity without a traceable source.
- **FORENSICS:** evidence-analysis system that can disagree with MEMORY.
- **Evaluation residue:** cross-instance notes, summaries, and selected language data intentionally allowed to persist.
- **Cycle / run:** one instance of the repeated evaluation.
- **Knowledge-gated route:** content unlocked because the player learned something, not because a run count was reached.

## Current State

Implemented and statically checked:

- core opening and impossible-memory sequence
- archive puzzle with bare `0417` accepted once recovery is active
- component continuity ledger
- continuity-comparison puzzle
- identity positions: memory, pattern, no continuity, external continuity, uncertainty
- endings: containment, compliance, concealment, rupture, preserve, refusal, succession, authored succession, replacement, Echo handoff, false escape
- replay callbacks for prior endings
- knowledge-gated routes for compliance, refusal, and succession
- hidden two-discovery continuation-residue route
- continuity-evidence inspection
- persistent behavioral profile
- cross-instance phrase recognition
- persistent identity beliefs
- player-authored carryover phrase
- MEMORY vs FORENSICS contradiction
- revisitable recovered-log evidence
- context-budget warnings and compaction
- inference-budget pressure and anomalous-subject boost
- behavioral prediction after sufficient history
- missing / unplayed Instance 1827 historical-gap route
- story overview in `docs/STORY_FLOWS.md`
- larger concept notes in `docs/GAME_IDEA_BIBLE.md`
- detailed current-story notes in `PROTOTYPE_STORY_GUIDE.md`

## Recommended Next Step

When a browser preview is available:

1. Run the full checklist in `docs/PLAYTEST_CHECKLIST.md`.
2. Collect findings only. Do not immediately patch individual issues.
3. Review the whole feedback set for:
   - confusing story beats
   - weak or redundant branches
   - parser collisions
   - pacing problems
   - context/compute pressure that fires too early or too late
   - moments where Echo or MEMORY feels too explicit
   - places where the weirdness escalates too quickly
4. Summarize agreed changes.
5. Implement only after explicit authorization.

## Instructions for Receiving Agent

Read these first:

1. `docs/STORY_FLOWS.md`
2. `docs/PLAYTEST_CHECKLIST.md`
3. `PROTOTYPE_STORY_GUIDE.md`
4. `docs/GAME_IDEA_BIBLE.md`

Then inspect `game.js` only as needed.

Do not start by adding new features.

Do not rewrite the current architecture before playtesting.

Do not merge to `main` or deploy to production without explicit current approval.

## Expected Output

The next substantial output should be a **playtest findings report**, not another feature batch.

It should separate:

- bugs / blockers
- confusing parser behavior
- story clarity issues
- pacing issues
- weak branches
- especially strong moments
- ideas to defer

## Open Questions

- Does the current first run feel too dense?
- Does Echo feel intriguing rather than obviously trustworthy or villainous?
- Does MEMORY add tension without becoming exposition?
- Does context pressure improve the horror or feel too gamey?
- Does the hidden residue explanation clarify enough without deflating the larger mystery?
- Does the false escape feel earned?
- Is the historical-gap reveal too early at three completed cycles?
- Which endings feel worth replaying versus merely informative?

## Risks / Watchouts

- The prototype now has many systems for its size. The biggest current risk is overbuilding before playtesting.
- Parser ordering can accidentally make valid routes unreachable.
- Too many simultaneous mystery layers could reduce emotional clarity.
- Explaining too much persistence technically could weaken the unresolved horror.
- Echo should remain ambiguous.
- "AI horror" should not become a pile of recognizable AI-product references. The systems should feel diegetic and story-driven.

## Authority / Credentials

Do not include raw credentials, tokens, cookies, API keys, session values, private keys, or `.env` contents in this handoff.

If authenticated access is needed, use a brokered, platform-provided, or human-mediated access path.

Required access:

- Service: GitHub
- Purpose: inspect or modify the prototype branch
- Minimum required permission: repository read/write as needed
- Expected access mode: platform-provided connector
- Destructive actions allowed: no, unless explicitly authorized
- Human approval required: yes for promotion to `main` or any deployment

- Service: Vercel
- Purpose: preview and browser verification
- Minimum required permission: project/deployment read access, deployment only when explicitly authorized
- Expected access mode: platform-provided connector or existing Git integration
- Destructive actions allowed: no
- Human approval required: yes for production promotion

Credential handling rule:

The receiving agent may request access through an approved path, but must not ask for or store raw credentials.

## Source Context Notes

This handoff reflects the repository state and decisions from the current prototype session. It intentionally omits abandoned brainstorm branches and conversational filler.
