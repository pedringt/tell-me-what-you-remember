# AI v1 Playtest Checklist

This replaces the long deterministic-parser checklist for the first AI-enabled test.

## Gate 1: Intent eval

Run the internal intent eval page.

Target:

- >= 90% overall accepted-case accuracy
- **zero dangerous false-positive actions**
- unavailable high-impact actions never execute
- negated actions do not execute
- failures prefer clarification over wrong action

If dangerous false positives exist, stop and fix classification before story playtesting.

## Gate 2: Natural first run

Play normally without trying to guess commands.

Check:

- [ ] I can phrase requests naturally.
- [ ] The game understands ordinary typos and casual language.
- [ ] I do not feel like I am searching for keywords.
- [ ] Ambiguous messages ask for clarification instead of doing something surprising.
- [ ] Evidence still appears only when allowed.
- [ ] High-impact actions happen only when I clearly intend them.
- [ ] Original player wording is still preserved for later callbacks.

## Gate 3: Deliberately difficult language

Try:

- negation
- sarcasm
- indirect requests
- two ideas in one sentence
- "what if" questions about actions
- short replies like "fine", "no", "do it", "why"
- typo-heavy messages

Check for accidental endings or state changes.

## Gate 4: Story feel

Ignore classifier mechanics and ask:

- Does this finally feel conversational?
- Does the story move when I talk naturally?
- Where do I still notice the deterministic skeleton?
- Are there reasonable things I keep trying that the game cannot support?
- Does clarification feel rare and sensible?

## Gate 5: Cost

After the test:

- total intent calls
- total input tokens
- total output tokens
- estimated total intent cost
- estimated cost per completed run

Do not add generated Mara/Echo dialogue until intent classification is reliable enough that the underlying game is trustworthy.
