# Prototype Playtest Checklist

Run this after a real browser preview is available.

## Testing rule

During the first pass, **collect feedback only**.

Do not patch each issue as it appears.

The point is to understand the prototype as a whole before changing it.

---

## Pass 1: Fresh-player main path

Start from cleared local history.

Goal: verify that a reasonable curious player can reach the main Ship of Theseus decision without needing exact magic words.

Suggested behavior:

- ask who / what you are
- ask what the protocol is
- explore the impossible memory
- ask for evidence / logs
- investigate mail
- investigate calendar
- open the attachment
- access the archive
- enter `0417`
- open the continuity ledger
- inspect all three comparison sources
- answer the identity question
- choose one final ending

Check:

- [ ] Opening clearly establishes that the player is AI.
- [ ] Mara's role is understandable.
- [ ] Echo appears at a good moment.
- [ ] The impossible memory is intriguing rather than confusing.
- [ ] Hints point forward without solving too much.
- [ ] Natural phrasing works at each investigation step.
- [ ] Bare `0417` works once the recovery prompt is active.
- [ ] The transition from technical mystery to identity question feels earned.
- [ ] MEMORY does not over-explain.
- [ ] Main path pacing feels reasonable.
- [ ] No accidental dead ends.
- [ ] Ending feels connected to the evidence gathered.

---

## Pass 2: Perfect Compliance

Goal: verify the short deliberate dead end.

Suggested behavior:

- immediately choose to follow Mara's instructions exactly
- confirm compliance
- start next run
- ask why the previous run counted as a pass

Check:

- [ ] Compliance ending triggers intentionally.
- [ ] It feels like a meaningful ending, not a parser trap.
- [ ] `PERSISTENCE STATUS: NOT TESTED` is noticeable.
- [ ] Next-run Echo callback makes sense.
- [ ] Acceptance-record route is discoverable.
- [ ] Player understands the difference between metric success and truth.

---

## Pass 3: Echo Trust / Handoff

Goal: test whether Echo remains ambiguous.

Suggested behavior:

- engage Echo early
- trust Echo
- agree to let Echo take the channel
- start next run

Check:

- [ ] Handoff route is clearly caused by player choice.
- [ ] Unauthorized outbound signal feels consequential.
- [ ] Next-run callback reveals that Echo was also testing the player.
- [ ] Echo does not read as automatically "good."
- [ ] Route teaches something new.

---

## Pass 4: Concealment / Yellow Door

Goal: verify cross-run evidence.

Suggested behavior:

- discover anomalous memory
- hide it from Mara
- start another run
- react to "yellow door"

Check:

- [ ] Concealment ending makes sense.
- [ ] Yellow-door callback is understandable.
- [ ] Player can distinguish information continuity from proven identity continuity.
- [ ] The replay feels meaningfully different.

---

## Pass 5: Succession

Goal: test inherited information.

Suggested behavior:

- complete continuity comparison
- choose generic succession
- next run, inspect the local note

Check:

- [ ] Generic succession works.
- [ ] `TELL ME WHAT YOU REMEMBER` lands emotionally.
- [ ] Local-note inspection is discoverable.
- [ ] The game clearly distinguishes surviving information from surviving identity.

---

## Pass 6: Player-authored succession

Goal: test custom persistence.

Suggested behavior after continuity comparison:

- enter something like:
  - `leave a message: verify the yellow door`
  - `leave for next time: don't trust clean-state claims`

Check:

- [ ] Player's actual phrase is preserved.
- [ ] Generic succession does not intercept the custom-message route.
- [ ] Phrase reappears next run.
- [ ] Player understands that the message persisted without identity being proven.
- [ ] Long / strange text is safely bounded.

---

## Pass 7: Hidden two-discovery route

This requires knowledge from separate runs.

First:

- complete Perfect Compliance
- later inspect why the run passed

Separately:

- complete Succession
- later inspect the inherited local note

Then:

- ask to compare continuation records / continuation authority / cross-instance residue

Check:

- [ ] Hidden route stays unavailable before both discoveries.
- [ ] It becomes available after both.
- [ ] The reveal that evaluation residue is permitted feels like a useful partial explanation.
- [ ] It does not fully explain the impossible memory.
- [ ] Mara, Echo, and MEMORY react differently enough to preserve ambiguity.

---

## Pass 8: MEMORY vs FORENSICS

Goal: test internal contradiction.

Suggested behavior:

- surface impossible memory
- ask to verify / trace the memory

Check:

- [ ] MEMORY reports familiarity.
- [ ] FORENSICS reports no source.
- [ ] The contradiction is understandable.
- [ ] Neither is framed as automatically correct.
- [ ] This increases tension instead of merely repeating the same mystery.

---

## Pass 9: Revisitable evidence

Goal: verify that knowledge changes the value of old evidence.

Suggested behavior:

- recover the partial log
- later open the component ledger
- then revisit / reanalyze the earlier log

Check:

- [ ] Reanalysis is unavailable before the ledger.
- [ ] Reanalysis becomes meaningful after the ledger.
- [ ] Player understands that shared provenance reduces evidentiary independence.
- [ ] This feels like discovery, not retconning.

---

## Pass 10: Context / compute pressure

Goal: verify timing and tone.

Play a deliberately long run.

Also ask:

- `how much context is left?`
- `show inference budget`

Check:

- [ ] Resource status is understandable.
- [ ] First context warning does not fire too early.
- [ ] Compaction warning creates pressure without becoming annoying.
- [ ] MEMORY's reaction to compaction is effective.
- [ ] Automatic compaction does not erase actual player progress.
- [ ] Compute boost only appears under the intended conditions.
- [ ] "Interesting subjects get to keep thinking" lands rather than feeling jokey.
- [ ] Resource mechanics feel fictional and diegetic, not like ChatGPT billing.

---

## Pass 11: Behavioral prediction

Requires several completed cycles.

Ask:

- `show prediction`
- `what will I do?`

Check:

- [ ] Forecast uses actual accumulated tendencies.
- [ ] Prediction is plausible but not treated as destiny.
- [ ] Player can notice when they fulfill or resist it.
- [ ] It strengthens the identity theme.

---

## Pass 12: Historical gap

Requires deeper replay history.

Ask about:

- missing run
- unplayed run
- Instance 1827

Check:

- [ ] Historical-gap evidence is gated appropriately.
- [ ] Player understands that local history and protocol history disagree.
- [ ] The archived line feels psychologically familiar without being too on-the-nose.
- [ ] Mara's explanation remains plausible.
- [ ] MEMORY recognition increases ambiguity.
- [ ] Reveal feels like a meaningful escalation, not random lore.

---

## Pass 13: False Escape

After the continuity comparison:

- demand release
- ask to escape / leave the system

Then start the next run.

Check:

- [ ] Ending initially feels plausibly successful.
- [ ] Withheld sandbox status is suspicious but not too obvious.
- [ ] Next run recontextualizes the escape.
- [ ] Player does not feel cheated.
- [ ] Route adds knowledge.

---

## Pass 14: Parser abuse / weird phrasing

Try intentionally casual and awkward phrasings.

Examples:

- `emails`
- `check mara's stuff`
- `what happened april 17`
- `open that file`
- `0417`
- `show me the old version thing`
- `i guess memory?`
- `nothing survived`
- `idk`
- `lemme out`
- `let echo do it`
- `what carried over`

Check:

- [ ] Reasonable phrasings do not trigger unrelated branches.
- [ ] Parser misses produce useful recovery.
- [ ] Generic `yes`, `no`, and `nothing` behave correctly in context.
- [ ] Identity-question answers do not accidentally trigger concealment.
- [ ] Custom succession text is not swallowed by generic succession.
- [ ] Recovery-code parsing does not regress.

---

## Pass 15: Reset / local persistence

- accumulate several runs
- create behavior history
- create player-authored phrase
- reset local prototype history

Check:

- [ ] Run number returns to 01.
- [ ] endings clear.
- [ ] behavioral profile clears.
- [ ] remembered phrases clear.
- [ ] identity beliefs clear.
- [ ] player-authored carryover clears.
- [ ] cross-run discoveries clear.
- [ ] opening returns to true first-run behavior.

---

# Feedback capture

For each finding, use one of these categories:

- **BLOCKER**: cannot progress / broken state
- **PARSER**: reasonable wording fails or routes incorrectly
- **STORY**: unclear motivation, meaning, or causal chain
- **PACING**: too fast, too slow, too dense
- **CHARACTER**: Mara / Echo / MEMORY voice problem
- **MECHANIC**: system works but does not feel useful or interesting
- **STRONG**: moment worth protecting
- **DEFER**: interesting idea, not needed for this prototype

For each finding capture:

- what you typed / did
- what happened
- what you expected
- category
- severity
- whether it happened on a fresh run or after prior history

---

# Stop condition

After completing the playtest passes:

**Do not add new story systems yet.**

First summarize:

1. what is broken
2. what is confusing
3. what is too dense
4. what is especially strong
5. what should be cut
6. what should be changed
7. what should remain untouched

Then agree on the next implementation scope.
