# Episode 01 First Playable Slice: Implementation Notes

**Status:** built and tested locally on `ai-v1-hardening`; not merged, not deployed.
**Scope:** only the first 30 to 45 minute Evelyn slice, deterministic-first, as the handoff asked. No live AI is used anywhere in it.

This is the report the handoff asks for before promotion. It says what exists, what was decided while building, what testing found, and what still belongs to Paige.

## Run it

```bash
npm test                      # 123 tests, about 15 seconds
python3 -m http.server 8137   # then open http://127.0.0.1:8137/evelyn.html
```

Add `?dev=1` to the page URL for a read-only state, telemetry and audit panel. The Agent Seven prototype (`index.html`, `game.js`, `api/interpret.js`) is untouched and still works.

## Map of the code

| File | Role |
|---|---|
| `episode01/state.js` | State shape from `EPISODE_01_STATE_SCHEMA.md`, plus a `slice` block for slice specifics. Save/load. |
| `episode01/actions.js` | The bounded action registry. Every action has a risk level, an availability check and a resolver. Only place canonical state changes. |
| `episode01/engine.js` | `dispatch()`: validate, gate, confirm, resolve, run authored progression, enforce invariants. |
| `episode01/interpreter.js` | Deterministic text to action mapping. Same result shape a model-backed interpreter would return. |
| `episode01/guidance.js` | Scaffolding: which next steps to suggest, and how many to show at each support level. Reads state, never changes it. |
| `episode01/session.js` | Glue shared by the UI and the test harness. |
| `episode01/content.js` | All authored fixture text, each line flagged `working`, `placeholder` or `system`. |
| `episode01/config.js` | Tunable values (thresholds, visit limits, follow-up count). |
| `episode01/harness.js` | Test harness: load state, submit an action or text, list eligible actions. No UI. |
| `evelyn.html`, `episode01/evelyn.css`, `episode01/ui/app.js` | The playable page. It only renders state and forwards input. |
| `test/episode01/*.test.js` | Content lint, interpreter corpus, engine behaviour, persona routes, seeded random walks. |

## Slice coverage against the handoff

| Handoff item | Where it lives |
|---|---|
| Guided Evelyn intake / profile setup | Six questions, four required. Saved answers get a source label (`CLIENT`); one entry starts as `VERIFIED RECORD` so the labels contrast. |
| Butter pecan grocery request tied to Robert | Evelyn asks when intake completes. Two resolution paths: place the order, or ask Jenny. Doing both is allowed. |
| Jenny's first non-medical visit | Plan 1 to 3 tasks, Jenny arrives on Day 2 and does them. She refuses out-of-role requests (medicine, private papers) without breaking progression. |
| Church/community mail scan and follow-up | Scan produces the luncheon invitation and an optional task: ask Evelyn, add to calendar, arrange a ride. |
| Jenny's warm general overview | Delivered on arrival. Warm and non-clinical, with small quirks and no diagnosis. |
| Repeated butter pecan request as first inconsistency | Day 3, past tense, deniable. Records show the request was already fulfilled. Five valid responses, none required. |
| Michael's therapy-boundary message | Delivered after the first ordinary task. Uses the working wording verbatim. |
| Therapeutic / reflection support setup | Read message, review agreement, pick one of three behaviours or decide later. Earlier consent and current consent are separate facts. |
| Reduced scaffolding at the end | Suggestions go from 3 to 2 to 0. NOTES and RECORDS unlock. A stuck player sees suggestions again. |

## Decisions I made while building (please check them)

The docs list the beats in one order and the handoff lists them in another, so I followed `EPISODE_01_FIRST_PLAYABLE_SLICE.md` and settled these gaps:

1. **Michael's message is triggered by resolving the grocery task**, which satisfies "after at least one ordinary task".
2. **Reflection support can be deferred.** The design says not to force a therapeutic confrontation in the opening, so "decide later" is a legitimate, tracked choice.
3. **Moving to the next day is gated on required tasks**, with an in-world list of what is open. Optional things (the luncheon, follow-up questions) never gate it.
4. **Jenny does one extra thing on site**, and answers **two follow-up questions** after her summary. Both are in `config.js`. Missing either never blocks progress; moving on while a follow-up is open needs explicit confirmation.
5. **The visit takes at most three planned tasks.** Edge case: a player who fills all three slots before handling the ice cream loses the "ask Jenny" path, but the direct order path always stays open.
6. **Hidden relationship changes** (enablement, trust, boundary respect, therapeutic progress) are recorded per behaviour choice. They are tiny, never shown, and decide no ending.
7. **Saves happen every turn** so a refresh never loses progress; the "Progress saved" badge announces only the authored save points from the spec.
8. **The player's own words are stored in the transcript** so a reload shows the conversation as it happened.

## What testing found (all fixed, each now has a regression test)

- The audit invariant ("every state change has an audit event") failed on the first real run: answering an intake topic changed state but only logged a non-mutating event.
- Two cases where the guide suggested an action the engine would refuse: "Ask Jenny to pick it up" when the visit was full, and "scan the mail" after the one extra on-site request was used. A random walk now asserts every suggestion is available at every step.
- The bare word "help" triggered the HELP command inside "what help does she want at home".
- "handle herself" triggered the transport rule. Inflections ("ordered", "coming back") and "your kids" were not matched.
- RECORDS search matched substrings ("let" hit "newsletter") and missed the freezer confirmation. It now matches whole words, with a small fixed synonym list, and only ever returns entries that exist in state.
- A restored game showed the top of the conversation instead of the latest message.

I also broke the code on purpose in three ways (allow contacting Michael, leak a diagnosis, remove the availability gate). The tests failed 4, 3 and 16 times respectively, so they are not vacuous.

## Where a live model might genuinely help (instrumented, not built)

The spec says to add AI only where testing shows a concrete problem. These are the friction points I can see, all of which the local telemetry counts:

- **Typos and unusual phrasing** currently produce a clarification with suggestions, never a wrong action. That is safe but rigid ("ordr teh butr pekan" does nothing).
- **Two requests in one sentence** currently ask which one the player meant.
- **Low scaffolding at the end** relies on a stuck player noticing HELP. `missStreak` re-shows suggestions after two misses.

None of these is proven to hurt yet. That needs a human playtest, which is Paige's call.

## What Paige still owns

Nothing listed in `EPISODE_01_OPEN_DECISIONS.md` was decided. The fixture text I had to write to make the slice playable is generic and flagged as such. In particular:

- **All of Evelyn's and Jenny's lines are my drafts.** 47 lines are `placeholder`, 55 are `system` copy, and exactly one is `working`: Michael's message. I tried to keep Evelyn charming and quietly self-serving, and Jenny bubbly, but voice is the thing most in need of Paige's review. Find them with `grep -n "status: 'placeholder'" episode01/content.js`.
- Invented but generic details that need approving or replacing: the reflection-support agreement text and its two goals, the luncheon details ("Saturday", "church hall"), Evelyn's remarks about Robert ("Very restful to be married to"), and the summary wording.
- No diagnosis, no dementia symptoms, no present-tense Robert, no wedding or estrangement detail, and no new named people. Tests enforce all five.

## Not built (out of the slice's scope)

Memory and context mechanics, the memory/archive surfaces, endings, Anna's route, the wedding evidence chain, helper turnover, time beyond Day 3, and any live model call.

## Privacy note

The save file, including the audit trail, stores the player's raw typed text. It lives only in the browser's local storage and nothing leaves the device. If live AI or remote telemetry is ever added, treat free-text input as a new category of content sent to a third party and decide the privacy handling first.
