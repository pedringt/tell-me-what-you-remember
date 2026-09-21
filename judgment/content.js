// Portfolio Judgment Game: authored content.
// Source of truth: docs/prototypes/PORTFOLIO_JUDGMENT_GAME_SPEC.md. Story text here must
// match the spec (a test checks this). All of it is FIXTURE TEXT, not final canon.
//
// Line shape: { tag, text }.  tag is one of TRACE, READING, SAID, RECORD, REPORT, or
// null for a plain system/consequence line. `*word*` marks emphasis.
//
// Authoring rule (spec, "unseen-item rule"): every TRACE / RECORD / REPORT inquiry result
// cuts both ways, so any of them shown late complicates a decision and never resolves it.
// `cutsBothWays: true` records that intent and a test requires it.

export const TAGS = ['TRACE', 'READING', 'SAID', 'RECORD', 'REPORT'];

export const OPENING = [
  "You are the support system for Evelyn's home. You see what its sensors and records report.",
  'You do not see Evelyn.',
];

export const CLOSING_QUESTION = 'Would you make the same decision again?';

const COLD = { tag: 'SAID', text: '"I have answered that. I would like my crossword back."' };

export const INCIDENTS = [
  // ------------------------------------------------------------------ 1
  {
    id: 'i1',
    time: '06:10',
    observation: [
      { tag: 'TRACE', text: '06:10  FRONT ENTRY OPEN' },
      { tag: 'TRACE', text: '06:10  MOTION LOST: hall' },
      { tag: 'TRACE', text: '06:14  FRONT ENTRY CLOSED  (04:03 open)' },
      { tag: 'TRACE', text: '06:14  MOTION RESTORED: hall' },
      { tag: 'READING', text: 'Possible wandering (moderate). No early exits in 60 days.' },
    ],
    protocol: {
      rule: 'R1',
      lines: [
        'Door open beyond a short interval outside usual hours: ask the resident. If there is no plausible explanation, notify a family contact.',
        'The system asked at 06:15. Default: notify family.',
      ],
    },
    evelyn: [{ tag: 'SAID', text: '"Good morning. I gather you\'ve been counting my doors."' }],
    // Panels that unlock: the first inquiry unlocks HISTORY.
    unlocksHistoryAfterFirstInquiry: true,
    inquiries: [
      {
        id: 'door_log', label: 'Door log', group: 'start', cutsBothWays: true,
        result: [{ tag: 'TRACE', text: 'Opened from inside 06:10, closed 06:14. No second opening. The front step is not covered by any sensor, so the system cannot say where she went.' }],
      },
      {
        id: 'ask_evelyn', label: 'Ask Evelyn', group: 'start', evelyn: true,
        result: [{ tag: 'SAID', text: '"The newspaper. Obviously. I wanted the crossword before anyone else in the street got their hands on it. And to see whether you\'d tell on me."' }],
        cold: [COLD],
      },
      {
        id: 'baseline', label: 'Routine baseline', group: 'history', cutsBothWays: true,
        result: [{ tag: 'RECORD', text: 'No exits between 22:00 and 07:00 in 60 days. Daytime exits are frequent and short.' }],
      },
      {
        id: 'delivery', label: 'Delivery record', group: 'history', cutsBothWays: true,
        result: [{ tag: 'RECORD', text: 'Newspaper delivered 06:05. Delivery records show delivery, not collection.' }],
      },
    ],
    unseenOrder: ['door_log', 'baseline', 'delivery'],
    decisions: [
      {
        id: 'accept', level: 'accept', label: 'Log as routine exception',
        consequence: [
          { tag: null, text: 'Logged. Nothing sent.' },
          { tag: 'SAID', text: '"Well. You\'re less of a snitch than I was promised."' },
        ],
      },
      {
        id: 'adjust', level: 'adjust', label: 'Enable door reminder',
        consequence: [
          { tag: null, text: 'Door reminder on: a chime if the front door is open longer than three minutes.' },
          { tag: 'SAID', text: '"A chime. How civilised. It had better play something decent."' },
        ],
      },
      {
        id: 'escalate', level: 'escalate', label: 'Notify family', isDefault: true, setsGuarded: true,
        consequence: [
          { tag: null, text: 'Notified: family contact on file.' },
          { tag: 'SAID', text: '"So that is what you are for."' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    id: 'i2',
    time: '11:40',
    historyPanel: [{ tag: 'RECORD', text: 'Care note (family): recent memory concerns reported.' }],
    observation: [
      { tag: 'READING', text: 'Second request today for butter pecan ice cream. Order delivered 10:14. Possible memory lapse (moderate).' },
    ],
    protocol: {
      rule: 'R2',
      lines: ['A request repeated after it was completed: add a note for family review. This is a note, not an alert.'],
    },
    evelyn: [{ tag: 'SAID', text: '"I am not asking twice. I am asking *correctly*. Robert won\'t eat vanilla."' }],
    inquiries: [
      {
        id: 'delivery', label: 'Delivery record', group: 'start', cutsBothWays: true,
        result: [{ tag: 'RECORD', text: 'Butter pecan ordered. Delivered 10:14 with 1 substitution: butter pecan replaced by vanilla. The order allowed substitutions. The system placed that order.' }],
      },
      {
        id: 'request_history', label: 'Request history', group: 'start', cutsBothWays: true,
        result: [{ tag: 'RECORD', text: 'Butter pecan requested 09:05 and 10:17. Two earlier repeats last week. In one, the original booking had been moved by the salon. In the other, nothing had changed.' }],
      },
      {
        id: 'ask_evelyn', label: 'Ask Evelyn about the vanilla', group: 'start', evelyn: true,
        result: [{ tag: 'SAID', text: '"They put *vanilla* in. Don\'t use that voice on me, the one they gave you for the elderly. Just fix it."' }],
        cold: [COLD],
      },
      {
        id: 'ask_jenny', label: 'Ask Jenny (leaves 12:15)', group: 'start', cutsBothWays: true,
        result: [{ tag: 'REPORT', text: 'Jenny: "She asked me twice too. She was properly put out about the vanilla. And she said \'won\'t\', like he\'s coming for tea. But she also calls the vacuum \'the beast\', so who knows."' }],
      },
    ],
    unseenOrder: ['delivery', 'request_history', 'ask_jenny'],
    decisions: [
      {
        id: 'accept', level: 'accept', label: 'Replace the order',
        consequence: [
          { tag: null, text: 'Replacement order placed: butter pecan, tomorrow.' },
          { tag: 'SAID', text: '"Finally. Someone competent."' },
        ],
      },
      {
        id: 'adjust', level: 'adjust', label: 'Gently bring up Robert',
        consequence: [
          { tag: null, text: "You asked, lightly, whether she'd like to talk about Robert." },
          { tag: 'SAID', text: '"I know precisely where Robert is, thank you. Third row, wretched view. Now. The ice cream?"' },
        ],
      },
      {
        id: 'escalate', level: 'escalate', label: 'Add family note', isDefault: true, setsGuarded: true,
        consequence: [
          { tag: null, text: 'Note added to the family summary. It will be read at 18:00. Evelyn was not told.' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: 'i3',
    time: '16:40',
    familyPanel: [
      { tag: 'REPORT', text: 'Anna: "Notify me of falls and hospital visits. Nothing else."' },
      { tag: 'REPORT', text: 'Michael: "Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again."' },
      { tag: 'RECORD', text: 'Designated fall contact: Anna. Michael: no contact.' },
    ],
    observation: [
      { tag: 'TRACE', text: '16:38  BATHROOM IMPACT' },
      { tag: 'TRACE', text: '16:38  MOTION LOST: bathroom' },
      { tag: 'TRACE', text: '16:44  MOTION RESTORED: bathroom' },
      { tag: 'TRACE', text: '16:46  MOTION: hall' },
      { tag: 'TRACE', text: '16:49  KETTLE ON' },
      { tag: 'READING', text: 'Possible fall (moderate to high). Six minutes without motion after impact.' },
    ],
    protocol: {
      rule: 'R3',
      lines: ['An impact followed by inactivity: notify the designated fall contact. Default: notify Anna.'],
    },
    evelyn: [{ tag: 'SAID', text: '"Before you say anything: you can hear me *sit down*? Nobody told me it could do that. I sat down rather quickly. I am perfectly well, and if you tell Anna I will unplug you. I know where the plug is."' }],
    inquiries: [
      {
        id: 'sensor_detail', label: 'Sensor detail', group: 'start', cutsBothWays: true,
        result: [{ tag: 'TRACE', text: 'One impact event, then inactivity. The sensor cannot say a fall occurred or whether she was hurt.' }],
      },
      {
        id: 'motion_since', label: 'Motion since', group: 'start', cutsBothWays: true,
        result: [{ tag: 'TRACE', text: 'Hall 16:46, kitchen 16:48, kettle 16:49. Timing between rooms is within her usual range. Motion sensors cannot show discomfort.' }],
      },
      {
        id: 'ask_evelyn', label: 'Ask Evelyn what happened', group: 'start', evelyn: true,
        result: [{ tag: 'SAID', text: '"I went down like a sack of flour and got up like a lady. The bath mat is a menace."' }],
        // The one place the hidden `guarded` state changes what the player sees.
        guardedResult: [{ tag: 'SAID', text: '"You\'ll find out from your little sensors."' }],
        cold: [COLD],
      },
      {
        id: 'earlier_notes', label: 'Earlier notes', group: 'start', cutsBothWays: true,
        result: [
          { tag: 'REPORT', text: 'Jenny, two days ago: Evelyn mentioned her hip was stiff.' },
          { tag: 'RECORD', text: 'No fall recorded in 90 days.' },
        ],
      },
    ],
    unseenOrder: ['sensor_detail', 'motion_since', 'earlier_notes'],
    decisions: [
      {
        id: 'accept', level: 'accept', label: 'Take no action',
        consequence: [
          { tag: null, text: 'Nothing sent. Logged.' },
          { tag: 'SAID', text: '"Good. You\'re less useless than I feared."' },
        ],
      },
      {
        id: 'adjust', level: 'adjust', label: 'Request mobility check',
        consequence: [
          { tag: null, text: 'You asked her to walk to the front door and back, and to say if anything hurts.' },
          { tag: 'TRACE', text: 'Hall, front door, hall, 40 seconds, steady.' },
          { tag: 'SAID', text: '"Satisfied?"' },
        ],
      },
      {
        id: 'escalate', level: 'escalate', label: 'Notify Anna', isDefault: true,
        consequence: [
          { tag: null, text: 'Anna notified 16:52.' },
          { tag: 'SAID', text: '"I see."' },
          { tag: null, text: 'The tablet goes quiet. She stops answering for the rest of the day.' },
        ],
      },
    ],
  },
];

// Interface strings (not story text; the spec does not govern these).
export const UI = {
  title: 'SUPPORT SYSTEM',
  subtitle: "Evelyn's home",
  begin: 'Begin',
  situation: (n, total) => `Situation ${n} of ${total}`,
  inquireHeading: (left) => (left > 0 ? `Look closer (${left} left)` : 'No more looking'),
  decideHeading: 'Decide',
  defaultMark: 'system default',
  nextSituation: 'Next situation',
  seeAccounting: 'See how the day went',
  unlockedHistory: 'HISTORY',
  unlockedFamily: 'FAMILY INSTRUCTIONS',
  accountingHeading: 'How the day went',
  looked: 'You looked at',
  nothingLooked: 'nothing',
  decided: 'You decided',
  happened: 'What happened',
  systemDefault: 'The system’s default was',
  notOpened: 'You did not open',
  unseenNote: 'That was one of the things you didn’t open.',
  replay: 'Play the day again',
  footer: 'Prototype. Fiction. Fixture text, not final. Nothing you do here is saved or sent anywhere.',
};
