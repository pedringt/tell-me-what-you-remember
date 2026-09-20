// Tunable values for the Episode 01 slice. Nothing here is final balancing:
// EPISODE_01_OPEN_DECISIONS.md lists compute/context economy, difficulty modes
// and thresholds as open, so these stay configuration rather than magic numbers.

export const CONFIG = {
  // Minimum interpretation confidence per action risk level.
  thresholds: { normal: 0.6, elevated: 0.75, high: 0.9 },

  maxVisitTasks: 3,
  followupQuestions: 2,

  // The visit is scheduled by the service enrolment. Day index -> label.
  dayLabels: ['Day 1', 'Day 2', 'Day 3'],

  // Scaffolding: how many suggested actions are offered at each support level.
  suggestionCount: { high: 3, medium: 2, low: 0 },
  // After this many unrecognised inputs in a row, suggestions are shown again.
  missStreakReveal: 2,

  // Hidden relationship-dimension changes for the therapy-behaviour choice.
  // Small on purpose; nothing is displayed to the player and none of this
  // decides an ending.
  therapyBehaviorDeltas: {
    reflect: { therapeuticProgress: 1 },
    remind_commitment: { boundaryRespect: 1 },
    listen_only: { enablement: 1, evelynTrust: 1 },
  },

  // Cap on transcript length kept in the save.
  maxTranscript: 400,
};
