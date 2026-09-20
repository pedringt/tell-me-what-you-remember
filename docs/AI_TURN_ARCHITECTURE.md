# AI Turn Architecture

## Current v1 turn

1. Player enters natural language.
2. Client sends:
   - player message
   - compact deterministic state snapshot
3. Intent model receives only actions currently available.
4. Model returns:
   - action
   - confidence
   - short reason
5. Server validates:
   - action is on current allowlist
   - confidence meets threshold
   - high-risk action meets higher threshold
6. If accepted:
   - server returns canonical deterministic input
   - existing game engine resolves the action
7. If uncertain:
   - game asks the player to clarify
8. If AI service fails:
   - old deterministic parser may handle the raw input as a temporary fallback

## Future dialogue turn

After deterministic resolution:

1. engine produces a canonical event, for example:
   - evidence opened
   - request denied
   - identity stance recorded
   - ending triggered
2. dialogue model receives:
   - canonical event
   - relevant facts only
   - character knowledge packet
   - short recent conversational context
3. model generates character response
4. output is checked for:
   - unsupported new facts
   - forbidden certainty
   - invented player quotes
5. canonical tool/evidence output is always rendered separately from generated dialogue

## State packet principle

Do not send the full game world every turn.

Send only:

- current scene
- currently available actions
- relevant evidence already discovered
- current relationship/stance flags
- limited prior-run callbacks needed for the scene
- character-specific knowledge

This is cheaper and makes hallucination less likely.

## Logging

For development, record:

- raw player input
- interpreted action
- confidence
- threshold
- accepted/rejected
- state gate
- token usage
- estimated cost

Do not expose internal classifier reasoning to the player.
