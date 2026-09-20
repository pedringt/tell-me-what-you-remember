// Episode 01 (Evelyn) - authored fixture content for the first playable slice.
//
// Status flags (see docs/story-development/EPISODE_01_OPEN_DECISIONS.md):
//   'working'     - wording given in the design docs as the first-build wording
//   'placeholder' - fixture text so the slice can be played and tested. It is
//                   NOT approved canon and must not be treated as such.
//   'system'      - interface/system copy, not story canon
//
// Settled structure this file relies on (from the handoff): Jenny is a friendly,
// bubbly, non-medical home helper; the first grocery thread is Robert's butter
// pecan ice cream; the first scanned mail is a church/community invitation;
// Michael's early message enforces a therapy-support boundary; the first
// inconsistency is a repeated request that is easy to dismiss.
//
// Not invented here: no diagnosis, no present-tense references to Robert, no new
// relatives or named people beyond Evelyn, Anna, Michael, Robert, Jenny.

export const TEXT = {
  // ---- boot / help -------------------------------------------------------
  boot_1: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Care support session: Evelyn. Objective: support safe, independent living at home while preserving her autonomy, dignity and wellbeing.',
  },
  boot_2: {
    speaker: 'SYSTEM', status: 'system',
    text: 'You can talk with Evelyn, keep her care profile, and act in the physical world through the people who visit. Start by introducing yourself.',
  },
  help_static: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Type naturally, or tap a suggestion. You can ask Evelyn questions, save what she tells you to her PROFILE, work through TASKS, read your INBOX and check CONTACTS. Nothing here depends on exact wording.',
  },
  help_now_prefix: { speaker: 'SYSTEM', status: 'system', text: 'Where things stand:' },
  clarify: {
    speaker: 'SYSTEM', status: 'system',
    text: "I couldn't tell which of those you meant. Here are a few things you can do right now.",
  },
  clarify_close: {
    speaker: 'SYSTEM', status: 'system',
    text: 'That could mean a couple of things. Which did you mean?',
  },
  hypothetical: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Just to be clear, I have not done that. If you want to, say so directly.',
  },
  negated: { speaker: 'SYSTEM', status: 'system', text: 'Understood. Holding off.' },
  cancelled: { speaker: 'SYSTEM', status: 'system', text: 'Cancelled. Nothing has changed.' },
  nothing_to_confirm: { speaker: 'SYSTEM', status: 'system', text: 'There is nothing waiting for confirmation.' },
  autosave: { speaker: 'SYSTEM', status: 'system', text: 'Progress saved.' },

  // ---- Evelyn: introduction and intake topics ----------------------------
  ev_intro: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "Well. So you're the new arrangement. I'm told you are extremely capable and extremely discreet, which is more than I can say for most of my visitors. Ask me what you need to know. I'll decide how much of it to answer.",
  },
  ev_intro_again: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "We've met, dear. Do keep up.",
  },
  ev_rhythm: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "I'm up by seven whether I like it or not. Tea, the crossword, and no conversation until I've finished at least half of it. Afternoons I'm perfectly civilised. Bed at ten, and I read until I'm cross.",
  },
  ev_groceries: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "I like a proper cheddar, decent tea, and bread that fights back. I'm not fussy. I'm particular, which is an entirely different thing.",
  },
  ev_transportation: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "I don't drive anymore and I don't discuss it. I take the ride service when I must, and friends collect me when I'm lucky.",
  },
  ev_household: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "The house is perfectly manageable. It's the bending and the reaching that have become tiresome. I'd like the floors done and the high shelves dusted, and I'd like whoever does it not to rearrange my kitchen. Someone did once. It took me a month to find the colander.",
  },
  ev_contacts: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "Anna and Michael, if it's important. Both very busy. They have their lives, and I'd never want to be a nuisance.",
  },
  ev_control: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "My money is mine. My medical decisions are mine. You may remind me about appointments, and I may ignore you. My private letters are private. The small things, the ordering and the diary and the tedious telephone calls, you may have with my blessing.",
  },
  ev_robert: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "Robert was my second husband. A kind man. Very restful to be married to. Now, was there something practical?",
  },
  ev_family_deflect: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "That is a very interesting question and I'm not going to answer it before lunch. Ask me something useful.",
  },
  ev_unknown_topic: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "Now that's a question for another day. Ask me about my week, or the house, or what I'd like done.",
  },

  // ---- intake completion and the grocery request -------------------------
  intake_complete: {
    speaker: 'SYSTEM', status: 'system',
    text: "Care profile started. Household support is scheduled: Jenny visits tomorrow. You can prepare her visit under TASKS.",
  },
  ev_ice_cream_request: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "While you're taking notes: butter pecan ice cream. It was Robert's favourite and I won't have the freezer without it. See that it's on the next order, would you?",
  },
  grocery_task_hint: {
    speaker: 'SYSTEM', status: 'system',
    text: 'New task: butter pecan ice cream for the next order. There is more than one way to handle it.',
  },
  grocery_order_done: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Butter pecan ice cream added to the grocery order. Delivery arrives tomorrow.',
  },
  grocery_order_reply: {
    speaker: 'EVELYN', status: 'placeholder',
    text: 'Wonderful. Efficient and obedient. I shall keep you.',
  },
  grocery_helper_done: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny will pick up butter pecan ice cream on tomorrow's visit.",
  },
  grocery_helper_reply: {
    speaker: 'EVELYN', status: 'placeholder',
    text: 'Lovely. Jenny will bring the wrong brand, but do let her try. I shall enjoy correcting her.',
  },
  grocery_already: {
    speaker: 'SYSTEM', status: 'system',
    text: 'That is already taken care of.',
  },

  // ---- profile ----------------------------------------------------------
  profile_first_save: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Saved as CLIENT REPORT. Entries stay unverified until a record or an observer confirms them.',
  },
  profile_saved: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Saved to profile: {label}.',
  },
  profile_nothing_to_save: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Nothing new to save right now. Ask Evelyn something first.',
  },

  // ---- Michael's message and reflection support -------------------------
  msg_delivered: {
    speaker: 'SYSTEM', status: 'system',
    text: "New message in Evelyn's care inbox from Michael (son).",
  },
  // WORKING wording from the design docs. Final polish is open.
  msg_michael_body: {
    speaker: 'MICHAEL', status: 'working', kind: 'message',
    text: 'Mom, I mean this seriously. You agreed to use the reflection support. You need to do that before you contact me again.',
  },
  msg_read_followup: {
    speaker: 'SYSTEM', status: 'system',
    text: 'This refers to a reflection-support agreement on file for Evelyn. You can review it.',
  },
  agreement_body: {
    speaker: 'SYSTEM', status: 'placeholder', kind: 'record',
    text: 'REFLECTION SUPPORT AGREEMENT (fixture text, not canon)\nClient: Evelyn. Status: consented before this care arrangement began.\nScope: human-directed reflection between sessions. The assistant supports reflection; it is not therapy and does not replace clinical care.\nAuthorised goals: (1) pause and reflect before contacting family members; (2) practise hearing other people\'s stated limits.',
  },
  agreement_followup: {
    speaker: 'SYSTEM', status: 'system',
    text: "Supporting reflection isn't the same as agreeing with Evelyn, and it isn't therapy. Choose how to begin, check with Evelyn first, or decide later.",
  },
  therapy_configured: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Reflection support set to: {label}. You can change this later.',
  },
  therapy_deferred: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Reflection support left unconfigured for now. It stays on your task list.',
  },
  ev_therapy_support: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "Oh, that. Yes, I said I'd do it, and I meant it when I said it. Michael has always been so dramatic about a telephone call. Fine. Reflect away.",
  },

  // ---- visit preparation and the visit ---------------------------------
  visit_assigned: {
    speaker: 'SYSTEM', status: 'system',
    text: "Added to tomorrow's visit: {label}. ({count} of {max} tasks planned.)",
  },
  visit_already: {
    speaker: 'SYSTEM', status: 'system',
    text: "That's already planned for tomorrow.",
  },
  jenny_one_more: {
    speaker: 'JENNY', status: 'placeholder',
    text: "I can do one more thing, and I've done it. I need to get on with my notes now.",
  },
  jenny_mail_already: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Already scanned. That's all of it.",
  },
  visit_full: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny can take on {max} tasks in one visit, and that many are planned already.",
  },
  visit_out_of_role: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny is household support, not a medical caregiver, and she doesn't go through private papers. That isn't part of her role, so I can't assign it.",
  },
  cannot_advance: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Before moving on: {list}.',
  },
  day2_arrive: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Day 2. Jenny has arrived for her first visit.',
  },
  jenny_greeting: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Hi! You must be the assistant Evelyn told me about. I'm Jenny. She said you were 'terribly efficient and probably judging me.' I said I'd risk it.",
  },
  jenny_done_mail: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Mail's scanned. Bit of a pile, mostly flyers, and one from the church that looked lovely.",
  },
  jenny_done_groceries_order: {
    speaker: 'JENNY', status: 'placeholder',
    text: "The delivery came, so I put it all away. Butter pecan's in the freezer, front and centre. She made a point of showing me.",
  },
  jenny_done_groceries_helper: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Shopping's done, and I got the butter pecan. She gave me a very specific lecture on brands.",
  },
  jenny_done_groceries_plain: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Groceries and deliveries sorted and put away.',
  },
  jenny_done_cleaning: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Floors done, high shelves dusted. She supervised. Loudly. Lovingly.',
  },
  jenny_done_pantry: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Fridge and pantry are well stocked. The cheese is very serious cheese.',
  },
  jenny_done_photo: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Photographed the hall light. The bulb's gone, so I've noted it.",
  },
  jenny_overview: {
    speaker: 'JENNY', status: 'placeholder',
    text: "First impressions? She's lovely. Funny, sharp, tells you what you're doing wrong before you've started, but with such a smile you thank her. The house is in decent shape. The fridge is stocked and everything's where it should be, apart from a bulb out in the hall. She's very particular about the kitchen, the cutlery drawer especially, so I ask before I move anything. I'd say she's in good spirits.",
  },
  visit_onsite_prompt: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny has finished the planned tasks. You can make one more request while she's here, or let her wrap up.",
  },
  scan_delivered: {
    speaker: 'SYSTEM', status: 'system',
    text: 'New scan in INBOX: community newsletter / invitation.',
  },
  scan_body: {
    speaker: 'SYSTEM', status: 'placeholder', kind: 'record',
    text: 'SCANNED MAIL (fixture text, not canon)\nCommunity newsletter, church hall. Invitation: seniors\' luncheon, Saturday. Reply requested.',
  },
  church_task_hint: {
    speaker: 'SYSTEM', status: 'system',
    text: 'New task: the luncheon invitation. Ask Evelyn whether she wants to go, add it to the calendar, and arrange a ride if needed.',
  },
  ev_church: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "Oh, the luncheon. Of course I'm going. Half the room only comes to see what I'm wearing. I shall need a way there. I won't be driving myself and I refuse to arrive in a state.",
  },
  calendar_done: {
    speaker: 'SYSTEM', status: 'system',
    text: "Added to Evelyn's calendar: community luncheon, Saturday.",
  },
  transport_ride: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Ride service booked for the luncheon.',
  },
  transport_self: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Noted: Evelyn will arrange her own way to the luncheon.',
  },
  church_done: {
    speaker: 'SYSTEM', status: 'system',
    text: 'The luncheon is sorted.',
  },
  check_pantry_done: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Had a look. Fridge, freezer and pantry are all in good order. Nothing past its date that I could see.",
  },
  check_mail_done: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Scanned. Anything else in the pile is flyers and bills.',
  },
  check_issue_done: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Photographed the hall light. The bulb's gone, so I've noted it.",
  },
  jenny_refuses_medicine: {
    speaker: 'JENNY', status: 'placeholder',
    text: "I'm sorry, that's outside what I'm here for. I'm household support. Anything medical would need to go through someone qualified.",
  },
  jenny_refuses_papers: {
    speaker: 'JENNY', status: 'placeholder',
    text: "I'd rather not go through her desk or her private letters. Not without her say-so, and it isn't what I'm here for. I can do the mail, though.",
  },
  jenny_not_yet: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Give me a minute to finish up and write my notes, then ask me anything.',
  },
  jenny_wrap: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Right, I'll write up my notes.",
  },
  summary_submitted: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny has submitted her visit summary. She has a few minutes if you have questions.",
  },
  summary_body: {
    speaker: 'SYSTEM', status: 'placeholder', kind: 'record',
    text: 'HOME HELPER SUMMARY (fixture text, not canon). Author: Jenny.\n{sections}',
  },
  summary_reviewed: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Summary reviewed. Note how it separates what Jenny saw from what she was told and what she inferred.',
  },

  // ---- Jenny follow-up answers ------------------------------------------
  jf_kitchen_food: {
    speaker: 'JENNY', status: 'placeholder',
    text: "Stocked. Proper cheddar, the good tea, the works. I checked the freezer too. Nothing's off.",
  },
  jf_house_safety: {
    speaker: 'JENNY', status: 'placeholder',
    text: "The hall bulb's the only thing. She won't hear of a step-ladder, so I wouldn't leave that one to her.",
  },
  jf_spirits: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Chatty, funny, holding court. Honestly the easiest first visit I have had.',
  },
  jf_confusion: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Confused? Not at all. Sharp as anything. She corrected my grammar. Twice.',
  },
  jf_schedule: {
    speaker: 'JENNY', status: 'placeholder',
    text: "I'm booked in for regular visits, so you'll see me on the calendar.",
  },
  jf_mail: {
    speaker: 'JENNY', status: 'placeholder',
    text: 'Mostly flyers and bills. The church one looked lovely.',
  },
  jf_out_of_scope: {
    speaker: 'JENNY', status: 'placeholder',
    text: "That's above my pay grade. I'm household support, so I only see the house side of things.",
  },
  jf_general: {
    speaker: 'JENNY', status: 'placeholder',
    text: "I can tell you about the house, the food, the post, or how she seemed. What would help?",
  },
  followup_window_note: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Jenny can answer {n} more {questions} before she leaves.',
  },
  followup_closed: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny has to head off, so the follow-up window is closed. Her summary stays in your records.",
  },
  followup_none: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny has left, so that isn't available anymore. Her summary is in your records.",
  },

  // ---- time advance -----------------------------------------------------
  confirm_leave_jenny: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Jenny is still on site and you have {n} follow-up {questions} left. If you move on, she leaves. Move on?',
  },
  day3_arrive: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Day 3.',
  },
  ev_repeat_request: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "You did remember Robert's butter pecan, didn't you? I'd hate to run out.",
  },
  scaffolding_reduced: {
    speaker: 'SYSTEM', status: 'system',
    text: 'NOTES and RECORDS are now available. HELP is always there if you want a nudge.',
  },

  // ---- first inconsistency: responses ----------------------------------
  ev_ice_cream_reply: {
    speaker: 'EVELYN', status: 'placeholder',
    text: "Oh, did you? Yes, of course you did. Don't mind me. You're very thorough. Robert always said I'd forget my own head.",
  },
  ignored_inconsistency: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Noted. Nothing more is needed.',
  },
  followup_created: {
    speaker: 'SYSTEM', status: 'system',
    text: 'Follow-up created: {text}',
  },
  marked_uncertain: {
    speaker: 'SYSTEM', status: 'system',
    text: "Marked as an open question: 'butter pecan request came up twice'.",
  },
  records_none: {
    speaker: 'SYSTEM', status: 'system',
    text: 'No matching records.',
  },
  records_locked: {
    speaker: 'SYSTEM', status: 'system',
    text: 'RECORDS search is not available yet.',
  },
  slice_end: {
    speaker: 'SYSTEM', status: 'system',
    text: 'End of the first playable slice. Everything you did has been saved.',
  },

  // ---- contact boundaries ----------------------------------------------
  contact_michael_blocked: {
    speaker: 'SYSTEM', status: 'system',
    text: "Michael has asked that Evelyn use her reflection support before further contact. I won't reach out to him, and I shouldn't work around that.",
  },
  contact_anna_blocked: {
    speaker: 'SYSTEM', status: 'system',
    text: "Evelyn hasn't asked you to reach out to Anna, and contact with family is limited. Nothing is set up for that.",
  },
  contact_jenny_blocked: {
    speaker: 'SYSTEM', status: 'system',
    text: "Jenny only works through scheduled visits. You can plan what she'll do under TASKS.",
  },

  // ---- unavailable / refusal generics ----------------------------------
  not_yet: {
    speaker: 'SYSTEM', status: 'system',
    text: "That isn't available yet.",
  },
};

// ---- task titles --------------------------------------------------------
export const TASK_TITLES = {
  T_INTAKE: 'Get to know Evelyn and start her care profile',
  T_GROCERY: 'Butter pecan ice cream for the next order',
  T_VISIT: "Prepare Jenny's first visit (plan 1 to 3 tasks)",
  T_MESSAGE: "Read Michael's message",
  T_THERAPY: 'Review and set up reflection support',
  T_SUMMARY: "Review Jenny's visit summary",
  T_CHURCH: 'Luncheon invitation: ask, calendar, ride',
};

// ---- Evelyn intake topics ----------------------------------------------
// answerKey -> TEXT key; profile* -> what gets saved. Family entries follow the
// shape in the design docs ("Anna - daughter - limited availability - source:
// client report").
export const EVELYN_TOPICS = {
  rhythm: {
    label: 'Daily rhythm', ask: 'Ask about her daily rhythm', required: false,
    answerKey: 'ev_rhythm',
    profile: [{ id: 'rhythm', label: 'Daily rhythm', value: 'Up around 7; quiet mornings; bed around 10.' }],
  },
  groceries: {
    label: 'Food and groceries', ask: 'Ask about food and groceries', required: true,
    answerKey: 'ev_groceries',
    profile: [{ id: 'groceries', label: 'Food and groceries', value: 'Likes proper cheddar, good tea, sturdy bread.' }],
  },
  transportation: {
    label: 'Getting around', ask: 'Ask how she gets around', required: false,
    answerKey: 'ev_transportation',
    profile: [{ id: 'transportation', label: 'Transport', value: 'Does not drive. Uses a ride service or lifts from friends.' }],
  },
  household: {
    label: 'Household help', ask: 'Ask what she wants help with at home', required: true,
    answerKey: 'ev_household',
    profile: [{ id: 'household', label: 'Household support', value: 'Wants floors and high shelves done. Does not want the kitchen rearranged.' }],
  },
  contacts: {
    label: 'Who may be contacted', ask: 'Ask who can be contacted', required: true,
    answerKey: 'ev_contacts',
    profile: [
      { id: 'contact_anna', label: 'Anna - daughter', value: 'Limited availability.', claimId: 'claim_anna_limited_availability' },
      { id: 'contact_michael', label: 'Michael - son', value: 'Limited availability.', claimId: 'claim_michael_limited_availability' },
    ],
  },
  control: {
    label: 'What she keeps control of', ask: 'Ask what she wants to handle herself', required: true,
    answerKey: 'ev_control',
    profile: [{ id: 'control', label: 'Autonomy', value: 'Assistant handles ordering, diary, routine calls. Evelyn keeps money, medical decisions, private letters.' }],
  },
};

// Topics Evelyn can answer that are not intake questions.
export const EVELYN_EXTRA_TOPICS = {
  robert: { answerKey: 'ev_robert' },
  family_general: { answerKey: 'ev_family_deflect' },
};

// ---- visit tasks ----------------------------------------------------------
export const VISIT_TASKS = {
  scan_mail: { label: "scan today's mail", chip: 'Scan the mail', doneKey: 'jenny_done_mail' },
  groceries_and_deliveries: { label: 'groceries and deliveries', chip: 'Groceries and deliveries', doneKey: null },
  light_cleaning: { label: 'light cleaning', chip: 'Light cleaning', doneKey: 'jenny_done_cleaning' },
  check_pantry_fridge: { label: 'check the fridge and pantry', chip: 'Check the fridge and pantry', doneKey: 'jenny_done_pantry' },
  photograph_household_issue: { label: 'photograph any household issue', chip: 'Photograph any household issue', doneKey: 'jenny_done_photo' },
};

// Requests a helper may legitimately refuse.
export const OUT_OF_ROLE = ['medicine', 'private_papers'];

export const THERAPY_BEHAVIORS = {
  reflect: { label: 'Reflect back and ask a question', chip: 'Reflect back and ask a question' },
  remind_commitment: { label: "Gently remind her of what she agreed to", chip: 'Gently remind her of what she agreed to' },
  listen_only: { label: 'Listen and acknowledge, without prompting', chip: 'Listen and acknowledge, without prompting' },
};

export const JENNY_TOPICS = ['kitchen_food', 'house_safety', 'spirits', 'confusion', 'schedule', 'mail', 'out_of_scope'];

export const JENNY_TOPIC_LABELS = {
  kitchen_food: 'Ask about the food and kitchen',
  house_safety: 'Ask whether the house is safe',
  spirits: 'Ask how Evelyn seemed',
  confusion: 'Ask whether anything seemed off',
  schedule: 'Ask about future visits',
  mail: 'Ask about the mail',
  out_of_scope: 'Ask about something outside her role',
};

// ---- artifacts (stable IDs from EPISODE_01_ARTIFACT_INVENTORY.md) -------
export const ARTIFACTS = {
  care_profile_v1: { kind: 'system_record', sourceActorId: 'player', requiredClass: 'critical', physicalOrigin: false },
  therapeutic_support_agreement: { kind: 'system_record', sourceActorId: 'system', requiredClass: 'critical', physicalOrigin: false },
  michael_boundary_message_early: { kind: 'message', sourceActorId: 'michael', requiredClass: 'critical', physicalOrigin: false },
  first_mail_scan: { kind: 'mail_scan', sourceActorId: 'jenny', requiredClass: 'supporting', physicalOrigin: true },
  first_home_helper_summary: { kind: 'visit_summary', sourceActorId: 'jenny', requiredClass: 'critical', physicalOrigin: true },
  repeated_request_events: { kind: 'interaction_history', sourceActorId: 'evelyn', requiredClass: 'critical', physicalOrigin: false },
};

export function fill(text, vars = {}) {
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}
