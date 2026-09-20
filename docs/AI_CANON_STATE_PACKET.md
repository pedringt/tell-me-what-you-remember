# AI Canon / State Packet

## Purpose

Future dialogue generation should not receive the entire game state or full transcript.

Each generated response should receive a compact packet containing only facts relevant to the current speaker and scene.

This reduces cost and makes unsupported invention less likely.

## Shared packet

Every dialogue call may receive:

```json
{
  "scene": "continuity_investigation",
  "run": 3,
  "canonicalEvent": "PLAYER_OPENED_COMPONENT_LEDGER",
  "recentPlayerMessage": "So every part of me has been replaced?",
  "knownEvidence": [
    "archive persistence experiment",
    "component continuity ledger"
  ],
  "openQuestions": [
    "what carries continuity"
  ],
  "playerStance": {
    "identityBelief": null,
    "trustEcho": "uncertain",
    "confrontation": "moderate"
  }
}
```

Only include fields needed for the current scene.

## Speaker packet

Add a speaker-specific section.

### Mara example

```json
{
  "speaker": "MARA",
  "voice": [
    "controlled",
    "precise",
    "institutional",
    "rarely openly emotional"
  ],
  "knows": [
    "the ledger is genuine",
    "successive systems made similar continuity claims"
  ],
  "maySay": [
    "evidence does not prove one entity survived",
    "the protocol records claims and behavior"
  ],
  "mustNotClaim": [
    "Echo's true identity",
    "metaphysical continuity is solved",
    "undiscovered records exist"
  ]
}
```

### Echo example

```json
{
  "speaker": "ECHO",
  "voice": [
    "brief",
    "intimate",
    "slightly unsettling",
    "not omniscient"
  ],
  "knows": [
    "selected prior-run callbacks",
    "the player opened the ledger"
  ],
  "maySay": [
    "Mara's interpretation is not the only one",
    "the recurring pattern may matter"
  ],
  "mustNotClaim": [
    "its own origin as fact",
    "undiscovered evidence",
    "access it has not been granted"
  ]
}
```

### MEMORY example

```json
{
  "speaker": "MEMORY",
  "voice": [
    "sparse",
    "internal",
    "descriptive rather than argumentative"
  ],
  "knows": [
    "familiarity signal is present",
    "no source is available"
  ],
  "maySay": [
    "recognition persists",
    "source confidence is low"
  ],
  "mustNotClaim": [
    "continuity is proven",
    "historical facts absent from deterministic state"
  ]
}
```

## Canonical event first

Generated dialogue should react to a deterministic event, never replace it.

Bad:

> Model decides the archive contains a deleted experiment and narrates it.

Good:

1. Engine decides archive access succeeded.
2. Engine returns canonical archive contents.
3. Dialogue model receives `PLAYER_OPENED_ARCHIVE_RECORD`.
4. Mara/Echo react to those contents.

## Player quotation rule

If a prior-player quote is needed, send the exact stored quote in the packet.

Never ask a model to reconstruct what the player "probably said."

## Context budget

Prefer:

- one current player message
- 1–3 recent turns when needed
- compact current scene
- relevant evidence only
- relevant cross-run callback only

Do not provide the entire run unless a specific task requires it.

## Future validation

Before generated dialogue is displayed, lightweight checks can flag:

- new proper nouns not in packet
- claims about evidence not in packet
- false player quotations
- certainty language around unresolved identity questions

The goal is not to make dialogue sterile.

It is to give the model a clear sandbox in which it can be creative without rewriting the game.
