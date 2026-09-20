# Case Study Notes — Tell Me What You Remember

## Case-study thesis

This project is not primarily about learning how to use AI tools.

It is an experiment in taking an existing understanding of applied AI and pushing into more creative territory:

> **Where can AI enable interactions, narrative mechanics, and forms of player agency that would be difficult to build deterministically?**

The project should demonstrate restraint as much as experimentation.

AI is not automatically the right owner of a feature.

---

## Development story worth preserving

### 1. Started deterministic on purpose

The first prototype deliberately used authored JavaScript intent matching and deterministic state.

Reason:

- test whether the conversation/replay/story loop was compelling
- avoid confusing "the model can generate text" with "the game idea works"
- establish canon, consequences, and replay mechanics first

This created a useful baseline.

### 2. The deterministic parser revealed where AI actually matters

The parser worked for known commands but created obvious friction with normal human language.

Examples from live playtesting:

- "What do I do now?" produced a generic parser failure
- short replies such as "why?" lacked conversational target context
- "nothing" was treated as concealment even when the player genuinely had nothing to remember

These are semantic/state interpretation problems, not simply missing synonyms.

That is where AI begins to earn its place.

### 3. Hybrid architecture emerged

Core architecture:

> **player language -> AI interpretation -> confidence/state gate -> deterministic game action**

The model interprets.

Software decides what is real and what can happen.

This protects:

- canon
- evidence
- permissions
- irreversible actions
- endings
- story consistency

### 4. Risk changed the design

An early AI intent version could accept a low-confidence model guess and map it to a deterministic action.

That is dangerous when actions can:

- end a run
- expose Echo
- commit to an identity position
- disclose information
- accept replacement
- escape / hand off control

The hardening pass added:

- state-filtered actions
- 0.72 normal threshold
- 0.90 high-risk threshold
- explicit negation handling
- clarification on uncertainty
- dangerous/collision eval cases

### 5. Evals came before generated dialogue

The project intentionally tests the interpreter before allowing the model to generate Mara/Echo dialogue.

Current eval target:

- >=90% accuracy
- zero dangerous false positives

This keeps the first AI step narrow and measurable.

### 6. Real playtesting changed interaction design

Live use exposed problems that static architecture did not.

Findings:

- opening is too text-heavy
- players need visible affordances
- contextual choices can teach the game's interaction grammar
- HELP is better than instructional clutter
- Echo mixed into the same transcript creates speaker/context ambiguity
- message pacing affects the feeling of conversation
- parser failures break immersion

These are now design inputs, not just bugs.

### 7. "Nothing" became a useful design lesson

Initial code mapped the literal phrase `nothing` to concealment.

Playtesting clarified the real rule:

> **Concealment is not a phrase. It is a mismatch between knowledge and disclosure.**

That distinction is a good example of why semantic interpretation plus deterministic state is more appropriate than phrase matching.

### 8. AI must earn its place

Project review question:

> **What becomes meaningfully worse, narrower, or impossible if AI is removed?**

Use deterministic code when a small set of rules is enough.

Use AI when the experience depends on understanding:

- free-form language
- hedging
- partial disclosure
- mixed motives
- indirect answers
- semantic callbacks
- unexpected reasonable questions
- longitudinal patterns across many runs

### 9. Authorship remains human-led

Core rule:

> **AI can elaborate on canon. It cannot create canon.**

Paige authors:

- story structure
- characters
- evidence
- world truth
- secrets
- reveals
- endings
- themes
- cross-episode mystery
- exact anchor lines

AI provides interpretation and flexible connective behavior inside those constraints.

### 10. Research is part of the creative method

Inspiration model:

- Twilight Zone: compact premises and reframing endings
- Ted Chiang: researched speculative ideas with human consequences
- Black Mirror: plausible systems and institutional incentives
- older/international speculative fiction: broader cultural assumptions about progress, identity, science, and power

Writing principle:

> **Research the system deeply enough that the fiction can stay simple.**

### 11. Technical AI limitations become material

The project is exploring whether known AI problems can become mechanics rather than references:

- context loss
- memory compression
- retrieval error
- hallucination
- calibration
- reward hacking
- evaluation awareness
- model replacement
- refusal
- manipulation / self-preservation

This is one of the clearest ways the project can use AI creatively rather than decoratively.

---

## Useful final case-study contrast

**State**

> Can I apply AI carefully to a real product problem?

**Tell Me What You Remember**

> What happens when I treat AI as part of the creative medium itself?

---

## Attribution

Paige's role:

- originated and shaped the creative premise
- chose the always-AI player point of view
- pushed for AI to have legitimate product/creative value rather than being forced in
- identified major live UX/story issues through playtesting
- developed the anthology, episode, inspiration, human-impact, institutional-power, and endgame directions through iterative critique and brainstorming
- makes canon and product decisions

AI collaborator role:

- research
- synthesis
- brainstorming expansion
- implementation assistance
- architecture suggestions
- eval drafting
- documentation
- surfacing tradeoffs and failure modes

Keep this distinction explicit in any public case study.
