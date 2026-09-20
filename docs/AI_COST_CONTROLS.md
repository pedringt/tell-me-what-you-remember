# AI Cost Controls

## Current intent layer

Model: GPT-5.6 Luna through Vercel AI Gateway.

Intent classification is deliberately tiny:

- one short system contract
- compact state
- one player message
- short JSON response
- capped output

The API reports token use and estimated request cost.

## Rules

1. Do not call a strong narrative model for intent classification.
2. Do not call any model for deterministic system/tool output.
3. Do not send full transcripts when compact state will work.
4. Keep generated character responses short by default.
5. Use stronger models only when quality materially changes the scene.
6. Track cost by turn and by run during development.
7. Set a per-run soft budget before public testing.
8. Cache static prompt components where the provider supports it and the economics make sense.
9. If an action can be resolved locally with certainty, later versions may skip classification entirely.
10. Do not optimize cost by weakening deterministic validation.

## Proposed first-run budget philosophy

Intent calls should be cheap enough that dozens of test turns are negligible.

Narrative generation is where budget should be spent selectively.

Possible later routing:

- **Intent:** Luna
- **routine character response:** Luna or equivalent inexpensive model
- **major reveal / emotionally important exchange:** stronger model
- **evidence/tool results:** no model

## Metrics to watch

- average intent input tokens
- average intent output tokens
- average intent cost
- calls per completed run
- model calls that could have been avoided
- expensive dialogue turns per run
- cost of a complete normal run
- cost of a replay-heavy session

Never optimize solely for the cheapest model if false high-impact actions increase.


## Gateway authentication

Production should use the Vercel AI SDK with a plain AI Gateway model string such as `openai/gpt-5.6-luna`.

On Vercel deployments, the AI SDK can use Vercel OIDC for AI Gateway authentication automatically. Application code should not assume `VERCEL_OIDC_TOKEN` is exposed as a normal environment variable and should not manually build the Gateway Authorization header for this path.

For local development outside Vercel, an `AI_GATEWAY_API_KEY` may still be used if needed.
