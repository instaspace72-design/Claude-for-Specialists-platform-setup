/* InstaSpace Learning Portal — content model (STR-flavored, no dashes per brand) */

const DEPARTMENTS = [
  {
    id: 'growth',
    name: 'Growth',
    badge: 'GR',
    tagline: 'Fill the funnel with the right hosts.',
    blurb: 'Acquire, score, and activate hosts across the GCC. Turn cold supply into verified, revenue ready listings.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    badge: 'MK',
    tagline: 'Words that make a stay feel inevitable.',
    blurb: 'Craft listing copy, guest emails, and campaigns that convert browsers into confirmed nights.',
  },
  {
    id: 'gtm',
    name: 'GTM',
    badge: 'GT',
    tagline: 'Launch a new emirate without breaking trust.',
    blurb: 'Sequence a market entry: supply, demand, regulation, and the messaging that carries all three.',
  },
  {
    id: 'brand',
    name: 'Brand',
    badge: 'BR',
    tagline: 'Distant, made dependable.',
    blurb: 'Hold the InstaSpace voice steady across every surface, from a push notification to an investor deck.',
  },
];

/* Specialty tracks: each intern is enrolled in one of these on login.
   Same shape as a department so the sidebar, dashboard, and course views
   render them without any special casing. */
const SPECIALTIES = [
  { id:'seo',       name:'SEO & Backlinks', badge:'SE', tagline:'Earn the links that earn the rankings.', blurb:'Read intent, spot link prospects, and write outreach that wins a real backlink for InstaSpace.' },
  { id:'design',    name:'Design & Video',  badge:'DS', tagline:'Brief once, ship a campaign.',           blurb:'Turn a one line ask into briefs, storyboards, and on voice captions for Dubai and Maldives launches.' },
  { id:'qa-nocode', name:'QA & No-code',    badge:'QA', tagline:'Break it before a guest does.',          blurb:'Think in test cases, generate a full suite with Claude, and wire no-code alerts that catch bugs early.' },
  { id:'qa-seo',    name:'QA & SEO',        badge:'QS', tagline:'Quality on the page and in the code.',    blurb:'Audit a listing for bugs and search gaps in one pass, then turn findings into a roadmap.' },
];
const SPECIALTY_BY_TRACK = SPECIALTIES.reduce((m, s) => { m[s.id] = s; return m; }, {});

const COURSES = {
  growth: {
    id: 'GRW001',
    dept: 'growth',
    title: 'Claude for Host Acquisition',
    level: 'Beginner',
    days: 14,
    instructor: 'Layla Al Marri',
    summary: 'Use Claude to find, qualify, and win short term rental hosts across Dubai and the wider GCC.',
    objectives: [
      'Read host intent from thin, messy signals',
      'Build a lead scoring prompt you can reuse daily',
      'Write outreach that earns a reply, not a report',
    ],
    lessons: [
      {
        id: 'GRW001L01', n: 1, title: 'Understanding Host Psychology', mins: 45, difficulty: 'Novice', status: 'done',
        concept: 'A Dubai landlord sitting on an empty two bedroom in Marina is not thinking about your platform. They are thinking about a mortgage, a service charge, and a unit that earns nothing while they wait. Your job is to meet that anxiety with a specific, believable number.',
        keyConcepts: [
          'Hosts convert on certainty, not features. Lead with expected occupancy and net yield.',
          'The first objection is always trust. Name DLD registration and escrow settlement early.',
          'Segment by motivation: the accidental host, the yield chaser, the portfolio operator.',
        ],
        videoLabel: 'Lesson walkthrough · 4:12',
      },
      {
        id: 'GRW001L02', n: 2, title: 'Scoring a Lead with Claude', mins: 50, difficulty: 'Intermediate', status: 'active',
        concept: 'You have a spreadsheet of 400 property owners and time for maybe 30 calls a day. A good scoring prompt turns that mess into a ranked list, with a one line reason for each score so you can trust it and defend it in standup.',
        keyConcepts: [
          'Give Claude a rubric, not a vibe. Weight signal fields explicitly.',
          'Always ask for a reason string. A score without a why is not actionable.',
          'Cap the output shape. Ask for strict JSON so it drops into your CRM.',
        ],
        videoLabel: 'Lesson walkthrough · 5:38',
      },
      {
        id: 'GRW001L03', n: 3, title: 'Outreach That Gets Replies', mins: 40, difficulty: 'Intermediate', status: 'locked',
        concept: 'Most host outreach reads like a bank letter. The reply rate reflects it. This lesson rebuilds the first message around one concrete number and one easy next step.',
        keyConcepts: [
          'One number, one ask. Nothing else in the opener.',
          'Reference the actual building, not the emirate.',
          'Close with a five minute call, never a demo.',
        ],
        videoLabel: 'Lesson walkthrough · 3:54',
      },
    ],
    exercise: {
      id: 'GRW001E01', lessonId: 'GRW001L02', title: 'Build a Lead Scoring Prompt', difficulty: 'Beginner', mins: 30,
      scenario: 'Growth handed you three raw host records pulled from a Marina building. You need Claude to score each from 0 to 100 for STR conversion likelihood and return strict JSON with a one line reason. Write the prompt.',
      success: ['Prompt defines a clear scoring rubric', 'Output is constrained to JSON', 'Every score carries a reason string'],
      recordsLabel: 'Host Records',
      records: [
        { title: 'Marina Gate · 2BR', ok: true, okLabel: 'DLD OK', badLabel: 'NO DLD', meta: 'A. Rahman · 96d vacant · yield unknown' },
        { title: 'Silverene · Studio', ok: true, okLabel: 'DLD OK', badLabel: 'NO DLD', meta: 'K. Farooqi · 12d vacant · yield 6.1% · listed elsewhere' },
        { title: 'Cayan Tower · 3BR', ok: false, okLabel: 'DLD OK', badLabel: 'NO DLD', meta: 'M. Idris · 210d vacant · yield unknown' },
      ],
      chatScript: [
        { text: "Let's build this together. Before you write anything, what single signal in those records do you think predicts STR conversion best?" },
        { text: "Good instinct. Vacancy days is your strongest signal, high vacancy means real pain. Now draft your rubric. Try weighting: vacancy 40, DLD registered 25, not listed elsewhere 20, yield curiosity 15." },
        { text: "That's a solid prompt. One upgrade: pin the output to strict JSON so it lands in the CRM without cleanup. Add a line like `Return only a JSON array of {unit, score, reason}`." },
        { text: "Excellent. That reason string is exactly what makes a score defensible in standup. You're ready to submit. Run it against the three records and check that Cayan Tower scores highest, it has 210 vacant days." },
      ],
      reward: { badge: 'Prompt Smith', note: 'You built a scoring prompt that returns clean JSON with a reason for every host. That is real Growth work.' },
    },
  },

  marketing: {
    id: 'MKT001', dept: 'marketing', title: 'Listing Copy that Converts', level: 'Beginner', days: 10,
    instructor: 'Omar Haddad', summary: 'Write listing and guest copy that turns views into confirmed nights across Dubai and the GCC.',
    objectives: ['Lead with the moment, not the amenity', 'Match tone to guest intent', 'Localize without losing the InstaSpace voice'],
    lessons: [
      {
        id: 'MKT001L01', n: 1, title: 'The Moment, Not the Amenity', mins: 40, difficulty: 'Novice', status: 'active',
        concept: 'A guest booking a Marina apartment is not buying a balcony. They are buying the coffee they will drink on it at 7am with the water still. Listing copy that lists features loses to copy that stages a single moment the guest can already feel.',
        keyConcepts: [
          'Open on one concrete moment, not a feature list.',
          'Amenities are proof, not the pitch. Move them below the fold.',
          'Cut every adjective that any listing could use. Vague words read as filler.',
        ],
        videoLabel: 'Lesson walkthrough · 4:02',
      },
      {
        id: 'MKT001L02', n: 2, title: 'Rewriting a Listing with Claude', mins: 45, difficulty: 'Intermediate', status: 'locked',
        concept: 'You inherited a flat, amenity stuffed listing that converts poorly. Claude can rebuild it around a guest moment in seconds, but only if you brief it on the guest, the season, and the one thing this unit does better than the building next door.',
        keyConcepts: [
          'Brief Claude on guest, season, and the single differentiator.',
          'Ask for a title, a hook line, and three short paragraphs.',
          'Constrain length. A listing that scrolls is a listing that loses.',
        ],
        videoLabel: 'Lesson walkthrough · 5:10',
      },
      {
        id: 'MKT001L03', n: 3, title: 'Guest Emails That Land', mins: 35, difficulty: 'Intermediate', status: 'locked',
        concept: 'The pre arrival email sets the tone for the entire stay. This lesson builds a warm, precise sequence that reduces support tickets and lifts review scores.',
        keyConcepts: [
          'One job per email. Confirmation, arrival, checkout, review.',
          'Precise beats friendly. Give times, codes, and one contact.',
          'Ask for the review on the morning after the best day, not at checkout.',
        ],
        videoLabel: 'Lesson walkthrough · 3:36',
      },
    ],
    exercise: {
      id: 'MKT001E01', lessonId: 'MKT001L01', title: 'Rewrite a Weak Listing', difficulty: 'Beginner', mins: 25,
      scenario: 'A Downtown Dubai studio listing is all amenities and no story. It converts at 1.8%. Brief Claude and rebuild it around a single guest moment, with a title, a hook, and three tight paragraphs.',
      success: ['Copy opens on a concrete moment', 'Amenities moved to proof, not pitch', 'Length stays under 120 words'],
      recordsLabel: 'The Current Listing',
      records: [
        { title: 'Burj Vista · Studio', ok: false, okLabel: 'GOOD', badLabel: 'WEAK COPY', meta: 'Converts 1.8% · 42 amenities listed · no hook' },
        { title: 'Guest profile', ok: true, okLabel: 'BRIEFED', badLabel: 'UNKNOWN', meta: 'Business traveller · 2 nights · books late evening' },
        { title: 'Differentiator', ok: true, okLabel: 'BRIEFED', badLabel: 'UNKNOWN', meta: 'Direct Burj Khalifa view from the desk' },
      ],
      chatScript: [
        { text: "Before I touch the copy, tell me the one thing this studio does that the unit next door cannot. That becomes our hook." },
        { text: "The desk facing the Burj is your moment. Picture a guest closing the laptop at 8pm and the fountains start. Let's open there, not on the amenity list." },
        { text: "Nice. Now move all 42 amenities into a single proof line near the end. The pitch is the view and the quiet, everything else is evidence." },
        { text: "That reads like a place, not a spec sheet. Keep it under 120 words and you're ready to submit. Title, hook, three paragraphs, done." },
      ],
      reward: { badge: 'Copy Craft', note: 'You rebuilt a dead listing around one real moment and kept it tight. That is how views become confirmed nights.' },
    },
  },

  gtm: {
    id: 'GTM001', dept: 'gtm', title: 'Launching in a New Emirate', level: 'Intermediate', days: 21,
    instructor: 'Sara Nasser', summary: 'Sequence a clean market entry across supply, demand, and regulation without breaking guest trust.',
    objectives: ['Map the regulatory surface first', 'Seed supply before demand', 'Message trust at every step'],
    lessons: [
      {
        id: 'GTM001L01', n: 1, title: 'Regulation Before Everything', mins: 50, difficulty: 'Intermediate', status: 'active',
        concept: 'A new emirate is not a new city, it is a new rulebook. Before a single listing goes live you map the licensing body, the registration path, and the settlement rules. Launch on top of an unclear rulebook and you inherit every host is problem.',
        keyConcepts: [
          'Identify the licensing authority and permit type first.',
          'Confirm the escrow and settlement path before onboarding hosts.',
          'Write the compliance summary a host can read in one minute.',
        ],
        videoLabel: 'Lesson walkthrough · 6:04',
      },
      {
        id: 'GTM001L02', n: 2, title: 'Sequencing a Launch with Claude', mins: 55, difficulty: 'Advanced', status: 'locked',
        concept: 'Supply and demand cannot arrive at the same time. Empty listings kill guest trust, empty search kills host trust. Claude can turn your constraints into a week by week sequence that seeds one side just ahead of the other.',
        keyConcepts: [
          'Seed supply two to three weeks ahead of demand spend.',
          'Set a listing floor before any paid guest acquisition.',
          'Give Claude your constraints and ask for a week by week plan.',
        ],
        videoLabel: 'Lesson walkthrough · 5:48',
      },
      {
        id: 'GTM001L03', n: 3, title: 'Launch Comms That Hold Trust', mins: 40, difficulty: 'Intermediate', status: 'locked',
        concept: 'The launch announcement is a trust document. It tells hosts you are licensed and tells guests you are safe. This lesson builds the message that carries supply, demand, and regulation in one breath.',
        keyConcepts: [
          'Lead with the license, not the discount.',
          'Name the settlement guarantee for hosts explicitly.',
          'One announcement, two audiences, no mixed signals.',
        ],
        videoLabel: 'Lesson walkthrough · 3:48',
      },
    ],
    exercise: {
      id: 'GTM001E01', lessonId: 'GTM001L01', title: 'Sequence a Sharjah Launch', difficulty: 'Intermediate', mins: 35,
      scenario: 'InstaSpace is entering Sharjah in eight weeks. You have three constraints and a marketing budget that unlocks in week five. Brief Claude and produce a week by week launch sequence that seeds supply before demand.',
      success: ['Supply seeded ahead of demand spend', 'Listing floor set before paid acquisition', 'Regulation cleared before week one'],
      recordsLabel: 'Launch Constraints',
      records: [
        { title: 'Regulation', ok: false, okLabel: 'CLEARED', badLabel: 'PENDING', meta: 'Sharjah permit in review · escrow path confirmed' },
        { title: 'Supply target', ok: true, okLabel: 'SET', badLabel: 'UNSET', meta: 'Floor of 120 verified listings before demand spend' },
        { title: 'Budget', ok: true, okLabel: 'READY', badLabel: 'LOCKED', meta: 'Paid guest acquisition unlocks week five' },
      ],
      chatScript: [
        { text: "Eight weeks is tight but workable. First question: is the Sharjah permit cleared, or are we sequencing around a pending approval?" },
        { text: "Then week one is regulation, not listings. Nothing goes live until the permit clears. Let's put host onboarding in weeks two and three to hit your 120 listing floor." },
        { text: "Good. Hold all paid demand until week five when the budget unlocks, and only if we have crossed the listing floor. Empty search on day one would burn host trust." },
        { text: "That sequence seeds supply a full two weeks ahead of demand and never launches on an unclear rulebook. You're ready to submit the plan." },
      ],
      reward: { badge: 'Market Maker', note: 'You sequenced a launch that respects the rulebook and seeds supply first. That is how a market opens without breaking trust.' },
    },
  },

  brand: {
    id: 'BRD001', dept: 'brand', title: 'The InstaSpace Voice', level: 'Beginner', days: 7,
    instructor: 'Yousef Karim', summary: 'Hold one voice steady from a push notification to an investor deck. Confident, precise, quietly premium.',
    objectives: ['Confident, precise, quietly premium', 'Cut every word that does not earn its place', 'Never hype, never clutter'],
    lessons: [
      {
        id: 'BRD001L01', n: 1, title: 'Distant, Made Dependable', mins: 30, difficulty: 'Novice', status: 'active',
        concept: 'The InstaSpace voice is trust infrastructure in sentence form. It never shouts, never pads, never hedges. When cross border capital and a stranger is home are both on the line, the writing has to feel like the platform: precise, calm, and quietly certain.',
        keyConcepts: [
          'Confident, not loud. State the fact, drop the exclamation.',
          'Precise, not clever. One reading only, no room for doubt.',
          'Quietly premium. Restraint reads as expensive.',
        ],
        videoLabel: 'Lesson walkthrough · 3:20',
      },
      {
        id: 'BRD001L02', n: 2, title: 'Editing to the Voice with Claude', mins: 35, difficulty: 'Intermediate', status: 'locked',
        concept: 'Most drafts arrive hyped, cluttered, or hedged. Claude can pull a paragraph back to the InstaSpace voice, but only if you give it the rules: no hype, no filler, one clear reading, every word earning its place.',
        keyConcepts: [
          'Give Claude the voice rules as constraints, not vibes.',
          'Ask it to flag every word that any brand could have written.',
          'Prefer the shorter version whenever meaning survives.',
        ],
        videoLabel: 'Lesson walkthrough · 4:26',
      },
      {
        id: 'BRD001L03', n: 3, title: 'One Voice, Every Surface', mins: 25, difficulty: 'Intermediate', status: 'locked',
        concept: 'A push notification and an investor deck are the same voice at different volumes. This lesson keeps the tone constant while the format changes, so the brand feels like one company everywhere.',
        keyConcepts: [
          'Change the length, never the temperature.',
          'A notification is a headline, a deck is the same headline with proof.',
          'If it would not sit in the deck, it does not sit in the app.',
        ],
        videoLabel: 'Lesson walkthrough · 3:02',
      },
    ],
    exercise: {
      id: 'BRD001E01', lessonId: 'BRD001L01', title: 'Rescue an Off Voice Draft', difficulty: 'Beginner', mins: 20,
      scenario: 'Marketing sent a launch line that is loud, padded, and full of hype. Brief Claude with the InstaSpace voice rules and pull it back to something confident, precise, and quietly premium.',
      success: ['Hype and exclamation removed', 'One clear reading, no filler words', 'Reads confident, not loud'],
      recordsLabel: 'The Draft',
      records: [
        { title: 'Original line', ok: false, okLabel: 'ON VOICE', badLabel: 'OFF VOICE', meta: '"Unlock AMAZING returns with the most revolutionary rental platform ever!"' },
        { title: 'Voice rule', ok: true, okLabel: 'GIVEN', badLabel: 'MISSING', meta: 'Confident, precise, quietly premium. No hype.' },
        { title: 'Surface', ok: true, okLabel: 'SET', badLabel: 'UNSET', meta: 'Homepage hero line' },
      ],
      chatScript: [
        { text: "This line is doing a lot of shouting. Before I rewrite it, what is the single true claim underneath all the adjectives?" },
        { text: "Right, the real claim is dependable yield on verified STR assets. Everything else is hype. Let's drop AMAZING, revolutionary, and the exclamation entirely." },
        { text: "Try this direction: state the outcome plainly and let the certainty carry it. Something like `Verified stays. Instant settlement. Yield you can plan around.` Calm, precise, premium." },
        { text: "That reads like InstaSpace now, one clear meaning and not a wasted word. You're ready to submit the rescued line." },
      ],
      reward: { badge: 'Voice Keeper', note: 'You pulled a loud, padded draft back to a line that sounds like InstaSpace. Restraint reads as expensive.' },
    },
  },

  seo: {
    id: 'SEO001', dept: 'seo', title: 'Claude for SEO & Backlinks', level: 'Beginner', days: 5,
    instructor: 'Sanwa', summary: 'Use Claude to read search intent, find link prospects, and win backlinks that lift InstaSpace across Dubai and the Maldives.',
    objectives: [
      'Tell buyer intent from booking intent in a single query',
      'Turn a messy site list into a ranked outreach shortlist',
      'Write a pitch that earns a real dofollow link',
    ],
    lessons: [
      {
        id:'SEO001L01', n:1, title:'Reading Search Intent', mins:40, difficulty:'Novice', status:'active',
        concept:'Two people search InstaSpace on the same morning. One types holiday homes dubai marina, the other types dld holiday home permit. One wants to book, the other wants to comply. If your page answers the wrong one, the ranking is wasted. Intent decides the page before a single word is written.',
        keyConcepts:[
          'Sort every keyword into book, research, or comply. The intent picks the page.',
          'Match the format to the intent. A booking query wants listings, a comply query wants a guide.',
          'One page, one intent. Mixed intent pages rank for nothing.',
        ],
        videoLabel:'Lesson walkthrough · 4:20',
      },
      {
        id:'SEO001L02', n:2, title:'Finding Link Prospects with Claude', mins:45, difficulty:'Intermediate', status:'locked',
        concept:'A backlink from a Dubai travel blog is worth more than fifty from a link farm. Claude can take a raw list of sites and rank them by relevance, authority signal, and how likely they are to say yes, so you spend your outreach hours on the ten that matter.',
        keyConcepts:[
          'Score prospects on relevance first, reach second. A tiny relevant site beats a huge unrelated one.',
          'Ask Claude for a reason on every score so you can defend the shortlist.',
          'Flag the contact angle for each site. A link is a favour, so give them a reason.',
        ],
        videoLabel:'Lesson walkthrough · 5:12',
      },
      {
        id:'SEO001L03', n:3, title:'Outreach That Earns a Backlink', mins:35, difficulty:'Intermediate', status:'locked',
        concept:'Most link outreach reads like a demand. The good ones read like a gift. This lesson rebuilds the first email around something the other site actually wants, a stat, a quote, or a resource their readers will thank them for.',
        keyConcepts:[
          'Lead with what they gain, never with what you need.',
          'Offer one concrete asset, a data point or a quote, not a vague partnership.',
          'Make the link the easy yes. Tell them exactly where it fits.',
        ],
        videoLabel:'Lesson walkthrough · 3:44',
      },
    ],
    exercise: {
      id:'SEO001E01', lessonId:'SEO001L01', title:'Build a Backlink Prospect Scorer', difficulty:'Beginner', mins:30,
      scenario:'Growth handed you three sites for a Dubai holiday homes backlink push. Brief Claude to score each from 0 to 100 for backlink value and return strict JSON with a one line reason and a contact angle for each.',
      success:['Prompt defines a clear scoring rubric', 'Output is constrained to JSON', 'Every score carries a reason and a contact angle'],
      recordsLabel:'Prospect Sites',
      records:[
        { title:'DubaiStayGuide.ae', ok:true, okLabel:'RELEVANT', badLabel:'OFF TOPIC', meta:'Travel blog · Dubai holiday homes · updated weekly' },
        { title:'GccPropertyWire.com', ok:true, okLabel:'RELEVANT', badLabel:'OFF TOPIC', meta:'Property news · high traffic · rarely links out' },
        { title:'CheapLinksDirectory.net', ok:false, okLabel:'RELEVANT', badLabel:'LINK FARM', meta:'Generic directory · 4000 outbound links · no editorial' },
      ],
      reward:{ badge:'Link Scout', note:'You built a scorer that ranks prospects on relevance and hands you a contact angle for each. That is a backlink campaign that respects your hours.' },
    },
  },

  design: {
    id: 'DSN001', dept: 'design', title: 'Claude for Design & Video', level: 'Beginner', days: 5,
    instructor: 'Ayesha', summary: 'Use Claude to turn a one line ask into briefs, storyboards, and on voice captions for InstaSpace launches in Dubai and the Maldives.',
    objectives: [
      'Turn a vague ask into a brief a designer can build from',
      'Draft a frame by frame storyboard in minutes',
      'Write captions that sound like InstaSpace, never like an ad',
    ],
    lessons: [
      {
        id:'DSN001L01', n:1, title:'Briefing Claude Like a Creative Director', mins:40, difficulty:'Novice', status:'active',
        concept:'A brief that says make it pop gets you nothing. A brief that names the audience, the one feeling, the format, and the single message gets you a first draft you can actually use. Claude is only as sharp as the brief you hand it, so the skill is the brief, not the prompt.',
        keyConcepts:[
          'Every brief names four things: who, one feeling, format, one message.',
          'Cut the second message. A post that says two things says nothing.',
          'Give brand rails up front: aubergine and orange, calm not loud, no emoji.',
        ],
        videoLabel:'Lesson walkthrough · 4:06',
      },
      {
        id:'DSN001L02', n:2, title:'From Brief to Storyboard', mins:45, difficulty:'Intermediate', status:'locked',
        concept:'A reel lives or dies in the first frame. Claude can turn a tight brief into a six frame storyboard with a hook, a build, and a close, plus a shot note for each frame, so the designer opens Canva already knowing every beat.',
        keyConcepts:[
          'Frame one is the hook. If it does not stop the scroll, rebuild it.',
          'One idea per frame. The story moves, the message holds.',
          'End on the ask. A reel with no close is a reel with no point.',
        ],
        videoLabel:'Lesson walkthrough · 5:02',
      },
      {
        id:'DSN001L03', n:3, title:'Captions in One Voice', mins:30, difficulty:'Intermediate', status:'locked',
        concept:'The visual earns the stop, the caption earns the trust. This lesson keeps the caption in the InstaSpace voice, confident and quiet, so a Maldives launch post never slips into hype.',
        keyConcepts:[
          'State the value plainly. Restraint reads as premium.',
          'No hype words, no exclamation, no emoji.',
          'One clear call to action, placed last.',
        ],
        videoLabel:'Lesson walkthrough · 3:18',
      },
    ],
    exercise: {
      id:'DSN001E01', lessonId:'DSN001L01', title:'Storyboard a Host Onboarding Reel', difficulty:'Beginner', mins:30,
      scenario:'Marketing needs a six frame reel that shows a new host how easy it is to list on InstaSpace before the Maldives launch. Brief Claude with the audience, feeling, and message, then produce a six frame storyboard with a shot note per frame.',
      success:['Brief names audience, one feeling, and one message', 'Storyboard has a hook, a build, and a close', 'Every frame carries a short shot note'],
      recordsLabel:'Creative Brief',
      records:[
        { title:'Audience', ok:true, okLabel:'SET', badLabel:'UNSET', meta:'First time host · owns one apartment · nervous about trust' },
        { title:'One feeling', ok:true, okLabel:'SET', badLabel:'UNSET', meta:'This is safe and simple, I can do this today' },
        { title:'Format', ok:true, okLabel:'SET', badLabel:'UNSET', meta:'Vertical reel · six frames · fifteen seconds' },
      ],
      reward:{ badge:'Frame One', note:'You briefed Claude like a creative director and shipped a storyboard the designer can build without a single follow up. That is a campaign in minutes.' },
    },
  },

  'qa-nocode': {
    id: 'QAN001', dept: 'qa-nocode', title: 'Claude for QA & No-code', level: 'Beginner', days: 5,
    instructor: 'Ahsan', summary: 'Use Claude to think in test cases, generate a full suite, and wire no-code alerts that catch bugs before a guest ever sees them.',
    objectives: [
      'Turn any flow into happy path and edge case tests',
      'Generate a structured test suite you can hand to engineering',
      'Wire a no-code alert that fires the moment a test fails',
    ],
    lessons: [
      {
        id:'QAN001L01', n:1, title:'Thinking in Test Cases', mins:40, difficulty:'Novice', status:'active',
        concept:'A guest in Dubai taps book, their card is in AED, the host set a two night minimum, and it is the last room. Four conditions, and every one of them can break. QA is the habit of seeing those four before the guest does. The test case is just where you write them down.',
        keyConcepts:[
          'Every input is a test. Empty, wrong, huge, and just right.',
          'The happy path is one test. The edges are the other nine.',
          'A test without an expected result is a note, not a test.',
        ],
        videoLabel:'Lesson walkthrough · 4:14',
      },
      {
        id:'QAN001L02', n:2, title:'Generating a Test Suite with Claude', mins:45, difficulty:'Intermediate', status:'locked',
        concept:'Writing forty test cases by hand is a lost afternoon. Claude can turn a described flow into a structured suite, with steps, expected results, and priority, in one pass, so you spend your time running tests, not typing them.',
        keyConcepts:[
          'Describe the flow and the rules, then ask for a table of cases.',
          'Force structure: id, steps, expected result, priority.',
          'Ask Claude to mark the edge cases so nothing hides in the happy path.',
        ],
        videoLabel:'Lesson walkthrough · 5:20',
      },
      {
        id:'QAN001L03', n:3, title:'Automating the Boring Parts', mins:35, difficulty:'Intermediate', status:'locked',
        concept:'A bug found on Friday and forgotten by Monday is a bug shipped. A no-code flow can catch a failed test and post it straight to the team channel with the details attached, so nothing falls through the weekend.',
        keyConcepts:[
          'Automate the handoff, not the judgement. The alert carries the facts.',
          'Every alert includes steps to reproduce, or it is noise.',
          'Route by severity. A payment bug and a typo are not the same ping.',
        ],
        videoLabel:'Lesson walkthrough · 3:40',
      },
    ],
    exercise: {
      id:'QAN001E01', lessonId:'QAN001L01', title:'Test the Booking Flow', difficulty:'Beginner', mins:30,
      scenario:'You are handed the InstaSpace checkout: pick dates, enter guests, pay in AED, confirm. Brief Claude and produce at least eight test cases as strict JSON, each with id, steps, expected result, and priority, covering the happy path and the edges.',
      success:['At least eight cases, happy path plus edges', 'Output is constrained to JSON', 'Every case has steps, expected result, and priority'],
      recordsLabel:'The Booking Flow',
      records:[
        { title:'Dates', ok:true, okLabel:'RULE', badLabel:'UNKNOWN', meta:'Two night minimum · no past dates · host blackout dates' },
        { title:'Payment', ok:true, okLabel:'RULE', badLabel:'UNKNOWN', meta:'AED only · card declined path · wallet balance path' },
        { title:'Availability', ok:false, okLabel:'RULE', badLabel:'RACE RISK', meta:'Last room · two guests book at once' },
      ],
      reward:{ badge:'Edge Finder', note:'You turned a four step flow into a suite that hunts the edges, not just the happy path. That is the difference between testing and hoping.' },
    },
  },

  'qa-seo': {
    id: 'QAS001', dept: 'qa-seo', title: 'Claude for QA & SEO', level: 'Beginner', days: 5,
    instructor: 'Ahsan', summary: 'Use Claude to audit a listing page for both bugs and search gaps, then turn the findings into a roadmap the team can ship.',
    objectives: [
      'Audit a page for correctness and for search in one pass',
      'Produce a reusable SEO audit prompt',
      'Turn a pile of findings into a prioritised thirty day plan',
    ],
    lessons: [
      {
        id:'QAS001L01', n:1, title:'Auditing a Page Like a Skeptic', mins:40, difficulty:'Novice', status:'active',
        concept:'Open a Dubai Marina listing and read it twice. The first pass hunts bugs, a broken gallery, a price that does not update. The second pass hunts search gaps, a missing title, a heading that says nothing. Same page, two lenses, and most people only ever use one.',
        keyConcepts:[
          'Pass one is correctness. Pass two is discoverability. Never mix them.',
          'A page can work perfectly and still be invisible to search.',
          'Write the finding so a stranger can act on it. Vague findings die in the backlog.',
        ],
        videoLabel:'Lesson walkthrough · 4:22',
      },
      {
        id:'QAS001L02', n:2, title:'A Reusable SEO Audit Prompt', mins:45, difficulty:'Intermediate', status:'locked',
        concept:'You will audit fifty pages, not one. Claude can run the same checklist every time, title, meta, headings, intent match, internal links, so every page gets the same rigour and the findings line up for comparison.',
        keyConcepts:[
          'Fix the checklist once, then run it on every page.',
          'Ask for a status and a fix on each item, not just a pass or fail.',
          'Constrain the output so fifty audits stack into one view.',
        ],
        videoLabel:'Lesson walkthrough · 5:08',
      },
      {
        id:'QAS001L03', n:3, title:'Findings into a Roadmap', mins:35, difficulty:'Intermediate', status:'locked',
        concept:'Forty findings with no order is a wall, not a plan. This lesson ranks every fix by impact and effort, so week one ships the changes that move rankings and week four handles the polish.',
        keyConcepts:[
          'Rank by impact over effort. High impact, low effort goes first.',
          'Group fixes so one deploy clears many findings.',
          'A roadmap names a week and an owner, or it is a wish list.',
        ],
        videoLabel:'Lesson walkthrough · 3:36',
      },
    ],
    exercise: {
      id:'QAS001E01', lessonId:'QAS001L01', title:'Audit a Listing Page', difficulty:'Beginner', mins:30,
      scenario:'You are given a Dubai Marina listing page with three issues below. Brief Claude to audit it on two lenses, correctness and search, and return strict JSON where each finding has a lens, a severity, a fix, and a priority.',
      success:['Findings split into correctness and search lenses', 'Output is constrained to JSON', 'Every finding has a severity, a fix, and a priority'],
      recordsLabel:'The Listing Page',
      records:[
        { title:'Title tag', ok:false, okLabel:'OK', badLabel:'MISSING', meta:'Page title reads Untitled · no location, no intent' },
        { title:'Gallery', ok:false, okLabel:'OK', badLabel:'BUG', meta:'Fourth image fails to load on mobile' },
        { title:'Price', ok:true, okLabel:'OK', badLabel:'STALE', meta:'Nightly rate updates correctly in AED' },
      ],
      reward:{ badge:'Two Lens Auditor', note:'You audited one page for bugs and for search in a single pass and handed back a ranked, fixable list. That is QA and SEO working as one.' },
    },
  },
};

/* Achievements for the progress screen. */
const ACHIEVEMENTS = [
  { id: 'first-lesson', label: 'First Lesson', note: 'Completed lesson one', earned: true, icon: '01' },
  { id: 'prompt-smith', label: 'Prompt Smith', note: 'Wrote a scoring prompt', earned: true, icon: 'PS' },
  { id: 'streak-3', label: '3 Day Streak', note: 'Three days in a row', earned: true, icon: 'x3' },
  { id: 'chat-master', label: 'Chat Master', note: 'Ten Claude sessions', earned: false, icon: 'CM' },
  { id: 'course-clear', label: 'Course Clear', note: 'Finish a full course', earned: false, icon: 'CC' },
  { id: 'top-scorer', label: 'Top Scorer', note: 'Grade A on an exercise', earned: false, icon: 'A+' },
];

/* ---------------------------------------------------------------------------
   Rich intern courses. Full 5 day curricula sourced from the InstaSpace
   "Specialized Courses for Interns" brief. Each lesson carries the day's
   teaching, the actual Claude prompt to run, and the task. These override the
   starter versions defined above. Day 5 of each course is the capstone.
--------------------------------------------------------------------------- */
const INTERN_COURSES = {
  seo: {
    id: 'SEO001', dept: 'seo', title: 'Claude for SEO & Backlink Strategy', level: 'Beginner', days: 5, instructor: 'Sanwa',
    summary: 'Build InstaSpace’s backlink strategy for the Dubai and Maldives launches: find prospects, study competitors, create linkable content, run outreach, and ship a 90 day roadmap.',
    objectives: [
      'Find and rank high quality backlink prospects with Claude',
      'Turn competitor link gaps into a target list InstaSpace is not on yet',
      'Run outreach that earns real links, then ship a 90 day roadmap',
    ],
    lessons: [
      {
        id: 'SEO001L01', n: 1, title: 'Why Backlinks Matter for InstaSpace', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'A backlink is another site vouching for instaspace.com. For a brand whose whole pitch is trust across borders, those votes of confidence do double duty: they lift search rankings and they signal credibility to investors who have never heard of you. Day one is about seeing backlinks the way search engines do, and spotting where InstaSpace can earn them.',
        keyConcepts: [
          'What a backlink is: a link from an external site to instaspace.com. Search engines read it as a vote of confidence, so it lifts domain authority and rankings, and for a trust first brand it also signals credibility.',
          'Backlink types for real estate tech: editorial links earned naturally, guest posts on industry blogs, resource links to your guides, partner links from Maldives resorts and UAE portals, and broken link replacements.',
          'Why InstaSpace needs them now: you are opening new markets, Dubai and then the Maldives in September, with low awareness in a competitive cross border niche, and links drive the organic discovery that paid spend cannot.',
          'Where to look: real estate portals like Bayut and Dubizzle, PropTech and fintech publications, cross border investment guides, and regulatory or legal resources that reinforce the trust angle.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Identify Backlink Opportunities', mins: 45, difficulty: 'Beginner',
          brief: 'Use the prompt below in your live Claude session to generate 20 or more high quality backlink prospects across five categories, then organise them by priority for tomorrow.',
          promptTemplate: 'You are an SEO specialist helping InstaSpace, a trust and borderless settlement platform for cross border real estate, build backlinks.\n\nWe are launching in Dubai (July 2026) and the Maldives (September 2026).\n\nIdentify 20 high quality backlink prospects across these categories:\n1. Real estate portals that link to thought leadership content\n2. PropTech publications that cover fintech and real estate\n3. Cross border real estate blogs that discuss payment challenges\n4. Escrow and trust infrastructure resources\n5. International investor guides for the UAE and the Maldives\n\nFor each prospect give: website name, URL, why they are relevant to InstaSpace, the type of content they link to, an estimated domain authority from 1 to 10, and the best contact person. Prioritise high domain authority, relevance to our niche, English language, and international reach. Return the list as JSON.',
          task: [
            'Run the prompt in your live Claude session on the right',
            'Get 20 or more prospects back',
            'Ask Claude to organise them by category and priority',
            'Keep your top 10 targets for the competitive analysis in lesson 2',
          ],
          success: [
            'Claude returns 20 or more relevant prospects as JSON',
            'Every prospect has a relevance reason and a contact',
            'You can name your top 10 targets by priority',
          ],
          reward: { badge: 'Link Scout', note: 'You turned a blank page into 20+ ranked backlink prospects with a contact angle for each. That is where every real link campaign starts.' },
        },
      },
      {
        id: 'SEO001L02', n: 2, title: 'Competitive Backlink Analysis', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'You do not have to guess where links come from. Your competitors already earned them. Day two is reverse engineering: study who links to comparable payment and property platforms, find the broken links and unlinked mentions you can claim, and turn all of it into a target list InstaSpace is not on yet.',
        keyConcepts: [
          'Competitor backlink analysis: look at who links to platforms like Stripe Climate, Landed, and PropertyShark, what content earns those links, and which publications cover cross border real estate.',
          'Broken link building: find dead links to real estate or escrow guides and offer InstaSpace content as the replacement, so you fix their page while earning a link.',
          'Unlinked mentions: find sites that mention cross border real estate or trust infrastructure without linking, then reach out to convert the mention into a link.',
          'The output is a gap list: publications that link to competitors but not yet to you, with the content angle most likely to win each one.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Analyse Competitor Backlinks', mins: 45, difficulty: 'Intermediate',
          brief: 'Run the prompt below to map competitor link profiles and surface the publications InstaSpace should be targeting but is not yet on.',
          promptTemplate: 'I am doing SEO for InstaSpace, cross border real estate plus borderless payments.\n\nAnalyse the backlink profiles of these competitors:\n1. Stripe Climate (payment fintech)\n2. Landed (real estate investment)\n3. PropertyShark (property platform)\n\nFor each, identify: the top 10 backlink sources, the types of content that earn those links, the geographic focus, and the content themes. Then find the gaps: publications that link to these competitors but not to InstaSpace.\n\nFinally, map where InstaSpace could earn similar links: which publications to pitch, which content angles to emphasise, and the regulatory or trust angle competitors may have missed. Return a structured report.',
          task: [
            'Run the analysis in your live Claude session',
            'Identify 10 publication targets InstaSpace is not in yet',
            'Note what type of content each one links to',
            'Save the gap list for your content plan in lesson 3',
          ],
          success: [
            'You have a ranked list of 10 target publications',
            'Each target names the content angle most likely to win it',
            'The gaps are specific, not generic',
          ],
          reward: { badge: 'Gap Hunter', note: 'You reverse engineered where competitors earn links and turned it into a target list InstaSpace can actually go after.' },
        },
      },
      {
        id: 'SEO001L03', n: 3, title: 'Content That Attracts Backlinks', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Nobody links to a pricing page. They link to something useful: original data, a sharp framework, a definitive guide. Day three is designing the asset other sites will want to cite, built around InstaSpace’s real numbers and the cross border trust story.',
        keyConcepts: [
          'Backlink worthy content types: original research, thought leadership, case studies, definitive guides, tools and calculators, and data visualisations.',
          'Why they get linked: they save publishers time, they lend credibility, they give readers real value, and they are quotable.',
          'InstaSpace angles that travel: investors losing 4 to 6 percent to fees, why verification matters more than price, escrow cutting closing time from six weeks to two, and an international investor survey.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Brief a Linkable Content Asset', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to generate five backlink worthy content ideas, then pick the two you would build first for the July launch.',
          promptTemplate: 'I am creating backlink worthy content for InstaSpace, cross border real estate plus trust and borderless payments.\n\nGenerate 5 content ideas that will naturally attract backlinks from real estate publications, fintech blogs, international business media, escrow and legal resources, and investment guides.\n\nFor each idea give: a specific quotable title, the format (research report, guide, case study, or tool), the key data points or findings, who would link to it by name, why it is linkable, and the effort in hours to create it.\n\nPrioritise ideas that can be created in one to two weeks for the July 15 launch. Focus on global investors, cross border barriers, payment costs, and the trust and regulatory landscape. Return a structured list.',
          task: [
            'Run the prompt in your live Claude session',
            'Get five content ideas back',
            'Pick your top two for the backlink strategy',
            'Note for each why it will attract links and who would link to it',
          ],
          success: [
            'You have five concrete, quotable content ideas',
            'You chose two to build first, each with a clear reason',
            'Each idea names the publications likely to link to it',
          ],
          reward: { badge: 'Asset Architect', note: 'You designed content other sites will want to cite, not just another page nobody links to.' },
        },
      },
      {
        id: 'SEO001L04', n: 4, title: 'Backlink Outreach Strategy', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A great asset still needs a great ask. Most outreach fails because it is generic and self serving. Day four builds the personalised, brief, valuable messages that actually get a reply, cold, broken link, and partnership, each tuned to the person receiving it.',
        keyConcepts: [
          'Outreach types: cold to unfamiliar publications, warm through a connection, partnership for mutual benefit, and broken link where you solve their problem first.',
          'What works: personalised to their recent work, brief at three or four sentences, genuinely valuable, easy to say yes to, and sent from a real person.',
          'What fails: generic spam, demanding a link, vague with no value, and slow follow up.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Create Outreach Templates', mins: 45, difficulty: 'Intermediate',
          brief: 'Run the prompt below to produce three outreach templates, then customise the cold template into a real pitch to Bayut.',
          promptTemplate: 'I am doing outreach for backlinks for InstaSpace.\n\nCreate 3 personalised email templates for different situations:\n\n1. COLD OUTREACH. Target: a PropTech blog covering fintech and real estate. Goal: a guest post or resource link. Angle: cross border payment problems. 150 to 200 words, mention their recent article, offer specific value, clear call to action, from a real person, professional but conversational.\n\n2. BROKEN LINK OUTREACH. Target: a real estate guide with a dead link to escrow resources. Goal: replace the dead link with our content. 100 to 150 words, tell them which link is broken, helpful and non salesy, links to our resource.\n\n3. PARTNERSHIP OUTREACH. Target: a Maldives tourism or property site. Goal: mutual promotion. 150 to 200 words, win win framing, specific about why we align, low lift.\n\nFor each template give: the full email text, a subject line, when to use it, follow up timing, and an expected success rate.',
          task: [
            'Run the prompt in your live Claude session',
            'Get three templates back',
            'Customise the cold template into a real pitch to Bayut',
            'Note your follow up timing for each',
          ],
          success: [
            'You have three tailored outreach templates with subject lines',
            'The cold template is customised to a real target',
            'Each template is brief, personalised, and offers value',
          ],
          reward: { badge: 'Outreach Ready', note: 'You built outreach a publisher would actually reply to, personalised and valuable, not spam.' },
        },
      },
      {
        id: 'SEO001L05', n: 5, title: 'Capstone: 90 Day Backlink Roadmap', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Everything comes together into one document Hamza and Sanwa can hand you each week and say execute this. Day five turns your prospects, content ideas, and templates into a prioritised 90 day roadmap with targets, a content calendar, an outreach sequence, and tracking.',
        keyConcepts: [
          'A roadmap names targets, timing, and owners: Tier 1 must have publications, Tier 2 high value, Tier 3 supportive, each with a week and a responsible person.',
          'It sequences outreach realistically: cold at 5 to 10 percent response, warm at 20 to 30, broken link at 30 to 40, and partnership at 40 plus.',
          'It defines success up front: backlinks per month, referring domain authority, referral traffic, and ranking movement.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship the 90 Day Backlink Roadmap', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to turn everything from this week into a production ready roadmap Hamza can hand to stakeholders.',
          promptTemplate: 'I have been learning SEO and backlinks for InstaSpace over the past five days. I have 20 prospects, five content ideas, three outreach templates, and a competitive gap analysis.\n\nCreate a professional InstaSpace 90 Day Backlink Roadmap for July to September 2026 that:\n1. Sets clear monthly backlink acquisition targets\n2. Prioritises 30 target publications into Tier 1, 2, and 3\n3. Maps a content creation timeline, what to publish when\n4. Plans the outreach sequence: cold, warm, broken link, partnership\n5. Includes realistic success rates and metrics\n6. Provides a tracking template: backlink acquired, domain authority, referring site\n7. Documents expected ROI in traffic, leads, and conversions\n\nFormat it as a professional document suitable for Hamza and Sanwa to review, actionable enough to hand to me each week. Include timeline, responsibilities, tracking methods, and a contingency plan.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Refine the roadmap until it is 5 to 10 pages and production ready',
            'Make sure every week has clear action items and an owner',
            'Export it as your capstone deliverable for the GTM team',
          ],
          success: [
            'A 90 day roadmap with monthly targets and a tracking template',
            '30 target publications prioritised into three tiers',
            'A weekly outreach and content sequence with owners',
          ],
          reward: { badge: 'Roadmap Builder', note: 'You shipped a production ready 90 day backlink roadmap the GTM team can execute. That is a capstone that actually gets used.' },
        },
      },
    ],
  },

  design: {
    id: 'DSN001', dept: 'design', title: 'Claude for Design, Video & Visual Content', level: 'Beginner', days: 5, instructor: 'Ayesha',
    summary: 'Create the visual assets for the Dubai launch with Claude and Canva: design briefs, social graphics, a video script and storyboard, animation specs, and a full launch kit.',
    objectives: [
      'Brief Claude like a creative director and get usable first drafts',
      'Design on brand social graphics and a video story with Claude and Canva',
      'Ship a complete visual launch kit for marketing',
    ],
    lessons: [
      {
        id: 'DSN001L01', n: 1, title: 'Design Briefs & Brand Understanding', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'Great design starts with a great brief, not a blank canvas. Day one is learning the InstaSpace brand cold and using Claude to turn a launch goal into briefs detailed enough to execute in Canva without a single follow up question.',
        keyConcepts: [
          'The InstaSpace brand: aubergine #2A1240, orange #F2622E, crimson #D11E4C, cream #F5EFE8, the Urbanist typeface, the "Insta" bold plus "Space" italic wordmark, and a calm, trust first, growth minded tone for international investors.',
          'The assets a launch needs: social graphics for Instagram, LinkedIn, and Twitter, website banners, email headers, investor slides, and infographics like the fee comparison.',
          'Claude’s role in design: analysing brand guidelines, writing briefs, generating on brand copy, suggesting layouts and creative direction, and drafting video scripts.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Create a Comprehensive Design Brief', mins: 45, difficulty: 'Beginner',
          brief: 'Use the prompt below to get design briefs for five Instagram posts for launch week, each detailed enough to build straight in Canva.',
          promptTemplate: 'I am Shahzaib, a designer at InstaSpace creating visual assets for our Dubai launch (July 15 to 20, 2026).\n\nBrand: InstaSpace. Tagline: trust and payments infrastructure for cross border real estate. Colours: aubergine #2A1240, orange #F2622E, crimson #D11E4C, cream #F5EFE8. Font: Urbanist, ExtraBold for Insta and SemiBold italic for Space. Audience: Dubai luxury investors and international property buyers. Context: Phase 2 fintech going live, escrow plus borderless settlement.\n\nCreate a design brief for 5 Instagram posts across launch week:\nDay 1 announcement, Day 2 the problem, Day 3 the solution, Day 4 trust, Day 5 call to action.\n\nFor each post give: the visual concept, the colour palette from our brand, the Urbanist weights to use, the copy angle and tone, the call to action, the dimensions (1080x1350 feed, 1080x1920 Stories), and Canva template suggestions. Make each brief detailed enough to execute without follow up questions.',
          task: [
            'Run the prompt in your live Claude session on the right',
            'Get briefs for all five posts',
            'For each, save the visual concept, copy text, colour codes, and font weights',
            'Keep the strongest two briefs to build in Canva tomorrow',
          ],
          success: [
            'Five briefs, one per launch day',
            'Each names colours, Urbanist weights, copy, and a call to action',
            'Each is detailed enough to build without asking Claude again',
          ],
          reward: { badge: 'Brief Master', note: 'You turned a launch goal into five build ready design briefs. That is a designer who briefs like a creative director.' },
        },
      },
      {
        id: 'DSN001L02', n: 2, title: 'Social Graphics with Canva and Claude', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Speed without losing the brand. Day two is the Claude plus Canva loop: Claude writes the copy and suggests the layout, you build it in Canva, then Claude reviews what you made and tells you what to sharpen.',
        keyConcepts: [
          'Canva for rapid design: start from templates, save an InstaSpace brand kit of colours and fonts, bulk create sizes, and share for review.',
          'Social design principles: one or two colours, large readable text, clear hierarchy of headline over body over detail, real white space, and a mobile first check.',
          'The Claude and Canva workflow: Claude drafts copy and layout, you build, Claude reviews a description of your design and suggests tweaks, and you iterate.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Write and Refine Launch Post Copy', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to write two Instagram posts, build them in Canva, then bring a description back to Claude for feedback.',
          promptTemplate: 'Write Instagram post copy for the InstaSpace Dubai launch.\n\nContext: we solve cross border real estate problems with Phase 2 fintech, escrow plus borderless payments. Target: Dubai luxury investors. Tone: professional, trustworthy, growth oriented. Goal: get them to try the platform.\n\nWrite 2 versions.\nVERSION 1 announcement: a headline hook of 14 words or fewer, a body of about 50 words covering problem plus solution, a clear call to action, and 8 to 10 relevant hashtags.\nVERSION 2 the problem: a pain point headline of 14 words or fewer, a body of about 50 words on why it matters and the cost, a call to action to learn how we solve it, and 8 to 10 hashtags.\n\nUse a professional tone, no dashes, sentence case, and reference the Dubai market specifically.',
          task: [
            'Run the prompt and get both post versions',
            'Build the two posts in Canva using the brand kit',
            'Describe each finished post back to Claude and ask for feedback on hierarchy and brand fit',
            'Refine the copy based on the feedback',
          ],
          success: [
            'Two on brand post copies with hooks, bodies, and hashtags',
            'Both built in Canva at the right dimensions',
            'You gathered and applied Claude feedback on each',
          ],
          reward: { badge: 'Scroll Stopper', note: 'You ran the full Claude and Canva loop and shipped two on brand posts that earn the stop.' },
        },
      },
      {
        id: 'DSN001L03', n: 3, title: 'Video Scripting and Storyboarding', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A launch video lives or dies in the first three seconds. Day three uses Claude to plan a 60 second explainer end to end: a script that hooks and closes, and a scene by scene storyboard an animator can build from.',
        keyConcepts: [
          'Video types for launch: a 30 to 60 second hero, a 2 to 3 minute tutorial, a testimonial, a case study, and a 1 to 2 minute animated explainer.',
          'Script structure: hook in the first three seconds, the problem, the solution, the proof, and the call to action.',
          'Storyboarding: a scene by scene breakdown with the footage or graphics needed, on screen text timing, and voiceover matched to visuals.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Write a 60 Second Script and Storyboard', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to produce a full 60 second explainer script and a scene by scene storyboard, then mock the scenes up in Canva.',
          promptTemplate: 'I am creating a 60 second explainer video for the InstaSpace Dubai launch.\n\nTarget: international investors who are scared of cross border real estate. Goal: show them InstaSpace solves the trust problem. Format: animated explainer with voiceover.\n\nCreate a complete script and storyboard.\nScript: about 150 words for 60 seconds, with a five second hook, 20 to 40 seconds of problem, 15 to 25 seconds of solution, and a five second call to action. Tone: professional and reassuring. Mention the Dubai launch, escrow, borderless settlement, and trust infrastructure.\nStoryboard: for each scene of 10 to 15 seconds give the scene description, the voiceover, the duration, the graphics needed, the animation type, and the music. Format each as SCENE with visual, voiceover, graphics, animation, and audio. Make it detailed enough to hand to an animator.',
          task: [
            'Run the prompt and get the full script and storyboard',
            'Review it and refine any scene that feels weak',
            'Create one Canva slide per scene as a visual storyboard',
            'Keep the script and storyboard for your launch kit',
          ],
          success: [
            'A 60 second script with a hook, body, solution, and call to action',
            'A scene by scene storyboard with graphics and animation notes',
            'A Canva storyboard, one slide per scene',
          ],
          reward: { badge: 'Storyteller', note: 'You planned a launch video an animator could build tomorrow, hook to call to action.' },
        },
      },
      {
        id: 'DSN001L04', n: 4, title: 'Animation Concepts and Design System', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'An animator cannot build a vibe. Day four turns your storyboard into precise animation specs, timings, easing, triggers, so motion feels on brand and a developer knows exactly what to build.',
        keyConcepts: [
          'Animation types: icon animations, number animations, map reveals, text animations, and scene transitions.',
          'A motion design system: consistent timing of 150 to 300ms, brand colours revealing, Urbanist letter reveals, and natural ease in and out.',
          'Explaining motion to developers: keyframes, transitions, duration, and the trigger that starts each animation.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Write an Animation Specification', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to turn the explainer scenes into a detailed animation spec a developer can build from exactly.',
          promptTemplate: 'I am writing animation specifications for the InstaSpace explainer video, to hand to a developer.\n\nKey scenes:\nScene 1: "Cross border deals take 6 weeks and cost 6.4 percent", number and percentage animate in brand orange.\nScene 2: "InstaSpace solves this", logo fades in, trust checkmark fills with the brand gradient.\nScene 3: "Escrow plus borderless settlement", money flows investor to InstaSpace to seller, a timeline shrinks from six weeks to two.\nScene 4: "Ready to try Phase 2?", a call to action button appears with a glow.\n\nFor each scene, give a detailed spec for every animated element: element name, animation type, duration in milliseconds, start time in the timeline, the end state, the easing, and the trigger. Make it detailed enough that a developer can build the exact motion. Format it as a technical specification document.',
          task: [
            'Run the prompt and get the animation spec',
            'Collect a short motion mood board of references you like',
            'Note the pace, fast or slow, each animation should feel',
            'Save the spec for the developer',
          ],
          success: [
            'A spec covering every animated element by scene',
            'Each element has type, duration, timing, easing, and trigger',
            'A mood board that shows the intended feel',
          ],
          reward: { badge: 'Motion Director', note: 'You specified motion precisely enough to hand straight to a developer. No guesswork left.' },
        },
      },
      {
        id: 'DSN001L05', n: 5, title: 'Capstone: Visual Launch Kit', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five consolidates the week into one kit marketing can execute: a social calendar with graphics, the video package, and a design system reference. This is what Hamza hands the team for launch.',
        keyConcepts: [
          'A social pack: the launch graphics with captions and hashtags, plus a seven day posting schedule and times.',
          'A video package: final script, storyboard, animation specs, and the full asset list.',
          'A design system reference: colours, Urbanist usage, logo rules, spacing, and clear do’s and don’ts.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship the Visual Launch Kit', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to consolidate the week into a launch kit marketing can execute end to end.',
          promptTemplate: 'I have created social graphics and video scripts this week. Consolidate everything into an InstaSpace Visual Launch Kit that Shahzaib can hand to Hamza for launch week.\n\nInclude:\n1. A social media calendar for July 15 to 21: each post with image, caption, hashtags, posting time, and engagement targets.\n2. A video production checklist: final script, storyboard, animation specs, asset list, timeline, and a budget estimate if outsourcing.\n3. A design system quick reference: colours with hex codes, typography weights and sizes, logo usage, spacing, and component styles.\n4. A brand voice for visuals: photography style, illustration style, icon style, and imagery themes of trust, growth, and global.\n\nMake it professional, organised, and ready for the team to execute.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Refine the kit until every asset is launch ready',
            'Assemble the graphics, script, storyboard, and design system into one folder',
            'Hand the kit to marketing for launch week',
          ],
          success: [
            'A social calendar with graphics, captions, and posting times',
            'A complete video package: script, storyboard, specs, asset list',
            'A design system reference the whole team can follow',
          ],
          reward: { badge: 'Launch Kit Shipped', note: 'You shipped a full visual launch kit marketing can run without you in the room. That is a capstone that goes live.' },
        },
      },
    ],
  },

  'qa-nocode': {
    id: 'QAN001', dept: 'qa-nocode', title: 'Claude for QA, No-code & SEO', level: 'Beginner', days: 5, instructor: 'Ahsan',
    summary: 'Test the InstaSpace portal, learn no-code automation, and run a basic SEO audit with Claude, then ship a full testing and optimisation report.',
    objectives: [
      'Write and run a real QA test plan for the portal',
      'Build a no-code automation that reacts to student activity',
      'Audit the portal for SEO and ship a testing report',
    ],
    lessons: [
      {
        id: 'QAN001L01', n: 1, title: 'QA Testing Fundamentals and Test Planning', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'QA is the habit of seeing what breaks before a user does. Day one is the vocabulary and the plan: what to test on the InstaSpace portal, and how to write a test case someone else could run.',
        keyConcepts: [
          'Types of testing: manual and automated, and functional, UX, performance, and security. The portal needs all of them.',
          'What to test on the portal: login, course navigation, the live Claude chat, exercise submission, progress tracking, mobile responsiveness, and error handling when the API fails.',
          'The test case format: an ID, a title, preconditions, numbered steps, the expected result, the actual result, and a status of pass, fail, or blocked.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Create a QA Test Plan', mins: 45, difficulty: 'Beginner',
          brief: 'Use the prompt below to generate a comprehensive test plan for the portal, then pick the ten highest priority tests to run first.',
          promptTemplate: 'I am a QA intern testing the InstaSpace learning portal. It has login, course and lesson navigation, a live Claude chat for exercises, exercise submission, progress tracking, a SQLite database, a Node.js backend, and a responsive frontend.\n\nCreate a comprehensive test plan covering:\n1. Functional testing: login (valid, invalid, empty, special characters), navigation, chat send and receive with error handling, submission and progress update, and database persistence after refresh.\n2. UX testing: is navigation intuitive, are buttons clear, is progress visible, is the chat easy, are error messages helpful.\n3. Mobile testing: responsive layout, touch targets, text readability, and form inputs.\n4. Edge cases: network disconnect, Claude API failure, database error, and invalid or malicious input.\n\nFor each area create 3 to 5 test cases with an ID, title, preconditions, numbered steps, expected result, and notes. Format as a structured list ready to execute.',
          task: [
            'Run the prompt in your live Claude session on the right',
            'Get the full test plan back',
            'Save it as your master test document',
            'Pick the ten highest priority tests to run in lesson 2',
          ],
          success: [
            'A test plan covering functional, UX, mobile, and edge cases',
            'Each test case has steps and an expected result',
            'You have a ranked list of ten tests to run first',
          ],
          reward: { badge: 'Test Planner', note: 'You turned a whole product into a runnable test plan. That is where real QA starts.' },
        },
      },
      {
        id: 'QAN001L02', n: 2, title: 'Manual QA Testing Execution', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A plan is worthless until it is run. Day two is executing your tests against the live portal, documenting exactly what happens, and writing bug reports an engineer can act on without asking you a single question.',
        keyConcepts: [
          'The testing process: follow the steps exactly, record what actually happens, screenshot issues, note the environment, and report clearly.',
          'The bug report format: a title, the environment, numbered steps to reproduce, expected versus actual, a screenshot, and a severity.',
          'Coverage across surfaces: desktop Chrome, Firefox, and Safari, mobile iOS and Android, and a range of screen sizes.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Execute Tests and Report Bugs', mins: 45, difficulty: 'Intermediate',
          brief: 'Run ten to fifteen of your tests against the portal, then use the prompt below to turn your findings into formal bug reports.',
          promptTemplate: 'I tested the InstaSpace learning portal and found these issues.\n\nIssue 1: I logged in, opened an exercise, and typed a message. Expected: my message shows and Claude responds. Actual: the message sent but no response appeared for over five minutes. Environment: Chrome, desktop, localhost:8000.\n\nIssue 2: I completed an exercise, clicked submit, and refreshed. Expected: progress updates to show completion. Actual: progress still shows zero, completion not saved. Environment: Safari on iPhone 12.\n\nGenerate a formal bug report for each issue with a title, description, numbered steps to reproduce, expected versus actual, a severity of critical, high, medium, or low, and the browser, device, and OS. Format professionally for the engineering team.',
          task: [
            'Run ten to fifteen test cases against localhost:8000',
            'Record each result as pass, fail, or blocked with a note',
            'Use the prompt to write up any failures as bug reports',
            'Compile a short testing summary',
          ],
          success: [
            'Ten or more tests executed and documented',
            'Any failures written as clear, reproducible bug reports',
            'Each bug has a severity and environment',
          ],
          reward: { badge: 'Bug Hunter', note: 'You ran real tests and wrote reports an engineer can act on without a single follow up.' },
        },
      },
      {
        id: 'QAN001L03', n: 3, title: 'No-Code Automation and Workflows', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A lot of ops work is just glue between apps. Day three builds a no-code automation with Airtable and Zapier so the system reacts on its own, for example emailing a student hints when they score low.',
        keyConcepts: [
          'The no-code toolkit: Zapier and Make for connecting apps, Airtable automations, Notion, and simple sheet scripts.',
          'InstaSpace use cases: emailing on submission, updating progress, notifying the team when a student struggles, and generating weekly reports.',
          'The workflow shape: a trigger, then a condition, then an action, for example submission with score under seven triggers a helpful hints email.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Build a No-Code Automation', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to get a step by step no-code workflow, then build and test it in a demo environment.',
          promptTemplate: 'I am building a no-code automation for InstaSpace with Airtable and Zapier.\n\nScenario: when a student submits an exercise and scores under seven out of ten, automatically email them helpful hints.\n\nCreate step by step instructions for:\n1. Airtable setup: an Exercise Submissions table with StudentName, ExerciseID, Score, Submitted date, and Hints, plus a Helpful Hints table.\n2. The Zapier workflow: trigger on a new submission, condition if score is under seven, action send an email. Include the exact Zapier steps.\n3. The email template: an encouraging subject, a body with hints and next steps, and a link to a helpful resource.\n4. Testing: create a record with score five and verify the email fires with the right hints.\n\nMake it followable without coding knowledge.',
          task: [
            'Run the prompt and get the step by step workflow',
            'Set up the automation in a test or demo environment',
            'Create a test record and verify it fires correctly',
            'Document the process for the team',
          ],
          success: [
            'A working trigger, condition, and action automation',
            'A tested email that fires on a low score',
            'A short doc so anyone can rebuild it',
          ],
          reward: { badge: 'Automator', note: 'You built a no-code workflow that reacts on its own. That is leverage without writing code.' },
        },
      },
      {
        id: 'QAN001L04', n: 4, title: 'Basic SEO and On-Page Optimization', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'If search cannot read the portal, nobody finds it. Day four is the on-page basics, titles, descriptions, headings, alt text, and an audit of the real pages with concrete fixes.',
        keyConcepts: [
          'On-page elements: title tags, meta descriptions, heading hierarchy, image alt text, clean URLs, internal links, and page speed.',
          'For the portal: keyword rich titles and descriptions, one H1 per page, and alt text on every image.',
          'Content SEO: use target keywords naturally, write for humans first, and place keywords in headings and the first paragraph.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Run an SEO Audit of the Portal', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to audit the portal pages, then check the real pages and list the fixes to make.',
          promptTemplate: 'I am doing an SEO audit of the InstaSpace learning portal. The pages are: a homepage with courses and login, a course page listing lessons, a lesson page with content and chat, and a leadership dashboard.\n\nFor each page type, audit and improve:\n1. Title tags: suggest improved titles with the target keyword, brand, and benefit, 50 to 60 characters.\n2. Meta descriptions: suggest compelling descriptions of 150 to 160 characters.\n3. Heading hierarchy: ensure one H1 and a logical structure with keywords.\n4. Image alt text: suggest alt text for key images.\n5. Internal linking: suggest links between lessons with keyword rich anchors.\n6. Page speed: suggest compression, minification, and lazy loading.\n7. Keyword strategy: map primary, secondary, and tertiary keywords to pages.\n\nCreate a detailed SEO improvement report with specific changes.',
          task: [
            'Run the prompt and get the SEO audit',
            'Check the real pages at localhost:8000',
            'Record current versus recommended for each element',
            'Create a prioritised list of SEO fixes',
          ],
          success: [
            'An audit of titles, descriptions, headings, and alt text',
            'A keyword map across the portal pages',
            'A prioritised list of concrete fixes',
          ],
          reward: { badge: 'Page Optimiser', note: 'You audited the portal the way search sees it and left a clear list of fixes.' },
        },
      },
      {
        id: 'QAN001L05', n: 5, title: 'Capstone: Testing and Optimization Report', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five packages the week into one report tech and ops can act on: test coverage and results, bug log, the no-code automation, and the SEO fixes, with a clear go or no go recommendation.',
        keyConcepts: [
          'A test results report: what was tested, pass and fail summary, critical issues, and a severity breakdown.',
          'A no-code automation playbook: what you built, how to use it, and how to maintain it.',
          'An SEO improvements list split into quick wins, medium effort, and long term.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship the Testing and Optimization Report', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to consolidate the week into a stakeholder ready report for Junaid and Hamza.',
          promptTemplate: 'I have completed five days of QA, no-code, and SEO work on the InstaSpace portal. Create a comprehensive Portal Testing and Optimisation Report that includes:\n1. An executive summary: overall assessment of launch readiness, key findings, risk assessment, and recommendations.\n2. Testing results: coverage, pass and fail summary, and critical, medium, and low issues.\n3. A bug log: each bug with details, priority, and a fix recommendation.\n4. A no-code automation guide: what we built, how to use and maintain it.\n5. SEO improvements: quick wins, medium effort, and long term.\n6. Performance and security notes with recommendations.\n\nFormat it professionally for stakeholder review with metrics, clear action items, and a timeline for fixes.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Refine it into a 10 to 20 page stakeholder ready report',
            'Make sure every issue has a severity and an owner',
            'Ship it to Junaid and Hamza',
          ],
          success: [
            'A report with test results, bug log, and a clear recommendation',
            'The no-code automation documented',
            'SEO fixes grouped by effort',
          ],
          reward: { badge: 'QA Lead', note: 'You shipped a testing and optimisation report leadership can act on. That is a capstone the tech team uses.' },
        },
      },
    ],
  },

  'qa-seo': {
    id: 'QAS001', dept: 'qa-seo', title: 'Claude for QA & SEO Strategy', level: 'Beginner', days: 5, instructor: 'Ahsan',
    summary: 'Combine quality assurance with SEO strategy: test the portal, then build a technical SEO audit and a 90 day SEO strategy with a content calendar.',
    objectives: [
      'Plan and run a complete QA test suite',
      'Run a technical SEO audit of the portal',
      'Ship a 90 day SEO strategy with a content calendar',
    ],
    lessons: [
      {
        id: 'QAS001L01', n: 1, title: 'QA Test Planning', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'Day one mirrors the QA track: learn to see what breaks and write a test plan for the InstaSpace portal that anyone on the team could pick up and run.',
        keyConcepts: [
          'Types of testing: manual and automated, and functional, UX, performance, and security.',
          'What to test: login, navigation, the live Claude chat, submission, progress tracking, mobile, and error handling.',
          'The test case format: ID, title, preconditions, numbered steps, expected result, actual result, and status.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Create a QA Test Plan', mins: 45, difficulty: 'Beginner',
          brief: 'Use the prompt below to generate a comprehensive test plan, then choose the ten highest priority tests to run first.',
          promptTemplate: 'I am a QA intern testing the InstaSpace learning portal. It has login, navigation, a live Claude chat, exercise submission, progress tracking, a database, a Node.js backend, and a responsive frontend.\n\nCreate a comprehensive test plan covering functional testing (login, navigation, chat, submission, persistence), UX testing, mobile testing, and edge cases (network disconnect, API failure, database error, invalid input). For each area create 3 to 5 test cases with an ID, title, preconditions, numbered steps, expected result, and notes. Format as a structured list ready to execute.',
          task: [
            'Run the prompt in your live Claude session on the right',
            'Save the full test plan',
            'Pick the ten highest priority tests to run',
            'Note which features feel riskiest',
          ],
          success: [
            'A test plan across functional, UX, mobile, and edge cases',
            'Each case has steps and an expected result',
            'A ranked list of ten tests to run first',
          ],
          reward: { badge: 'Test Planner', note: 'You turned the whole product into a runnable test plan.' },
        },
      },
      {
        id: 'QAS001L02', n: 2, title: 'Manual Testing and Bug Reports', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Day two runs the plan against the live portal and turns findings into clear bug reports, the core craft of QA.',
        keyConcepts: [
          'The testing process: follow steps exactly, record what actually happens, screenshot, note the environment, report clearly.',
          'The bug report format: title, environment, steps to reproduce, expected versus actual, screenshot, and severity.',
          'Coverage: desktop and mobile browsers and a range of screen sizes.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Execute Tests and Report Bugs', mins: 45, difficulty: 'Intermediate',
          brief: 'Run your tests against the portal, then use the prompt below to write up any failures as formal bug reports.',
          promptTemplate: 'I tested the InstaSpace learning portal and found issues. For each issue I will give what I did, what I expected, what happened, and the environment. Turn each into a formal bug report with a title, description, numbered steps to reproduce, expected versus actual, a severity of critical, high, medium, or low, and the browser, device, and OS. Format professionally for the engineering team.',
          task: [
            'Run ten to fifteen tests against localhost:8000',
            'Record each result with a note',
            'Write up failures as bug reports using the prompt',
            'Compile a testing summary',
          ],
          success: [
            'Tests executed and documented',
            'Failures written as reproducible bug reports',
            'Each bug has a severity and environment',
          ],
          reward: { badge: 'Bug Hunter', note: 'You ran real tests and wrote reports engineering can act on.' },
        },
      },
      {
        id: 'QAS001L03', n: 3, title: 'Building the Test Suite', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Day three consolidates your work into a reusable test suite: organised by feature, with clear pass criteria, so the next release can be tested in an hour, not a day.',
        keyConcepts: [
          'Organise by feature: group tests under login, navigation, chat, submission, and progress so coverage is obvious.',
          'A suite has a pass bar: 95 percent pass is a reasonable gate for a launch candidate.',
          'A suite is reusable: it is written once and run every release, so regressions are caught early.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Assemble the Reusable Test Suite', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to turn your test cases and results into an organised, reusable suite with a summary.',
          promptTemplate: 'I have run a set of QA tests on the InstaSpace portal. Help me consolidate them into a reusable test suite. Organise all test cases by feature (login, navigation, chat, submission, progress, mobile, error handling). For each, keep the ID, steps, expected result, and last status. Add a summary at the top: total tests, pass count, fail count, pass rate, and the critical issues. Format it so the team can rerun the whole suite every release.',
          task: [
            'Run the prompt and get the organised suite',
            'Fill in the last status for each test',
            'Confirm the summary numbers match your results',
            'Save the suite for the next release',
          ],
          success: [
            'Tests organised by feature with clear pass criteria',
            'A summary with total, pass, fail, and pass rate',
            'A suite that can be rerun each release',
          ],
          reward: { badge: 'Suite Builder', note: 'You built a reusable test suite the team can run every release. That is QA that scales.' },
        },
      },
      {
        id: 'QAS001L04', n: 4, title: 'Technical SEO Audit', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Day four shifts to SEO: a technical audit of the portal, site structure, speed, mobile, and structured data, so the pages are ready to rank.',
        keyConcepts: [
          'Technical SEO: site architecture, page speed, mobile optimisation, schema markup, sitemap and robots.txt, and HTTPS.',
          'On-page SEO: keyword mapping, title and description strategy, heading hierarchy, internal linking, and image optimisation.',
          'The audit produces a prioritised fix list, quick technical wins first.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Run a Technical SEO Audit', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to audit the portal technically and map keywords to pages.',
          promptTemplate: 'I am doing a technical SEO audit of the InstaSpace learning portal. Audit and recommend improvements across: technical SEO (site architecture, page speed, mobile, schema markup, sitemap and robots.txt, HTTPS), on-page SEO (keyword mapping per page, title and meta strategy, heading hierarchy, internal linking, image optimisation), and a prioritised fix list. Map target keywords to each page: homepage, course pages, and lesson pages. Return a structured audit with specific, prioritised changes.',
          task: [
            'Run the prompt and get the technical audit',
            'Check the real pages against the recommendations',
            'Map the target keywords to each page',
            'Prioritise the fixes, quick wins first',
          ],
          success: [
            'A technical audit across architecture, speed, and mobile',
            'A keyword map for the main pages',
            'A prioritised fix list',
          ],
          reward: { badge: 'Technical Auditor', note: 'You audited the portal the way a search engine crawls it and left a prioritised fix list.' },
        },
      },
      {
        id: 'QAS001L05', n: 5, title: 'Capstone: 90 Day SEO Strategy', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five is the capstone: a 90 day SEO strategy that turns the audit into a plan, technical fixes, a content calendar, keyword targets, and a measurement framework Hamza can run.',
        keyConcepts: [
          'A strategy names targets and timing: which keywords, which pages, and which month.',
          'It includes a content calendar of SEO friendly topics and long form guides.',
          'It defines measurement: rankings, traffic, and leads, with tools and a monthly reporting rhythm.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship the 90 Day SEO Strategy', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to produce a 90 day SEO strategy with a content calendar and measurement plan.',
          promptTemplate: 'I am doing strategic SEO planning for the InstaSpace learning portal. Our goal is to rank for keywords like "Claude AI learning platform", "real estate automation tools", "no-code business education", and "cross border real estate guides".\n\nCreate a comprehensive 90 day SEO strategy covering:\n1. Technical SEO: architecture, page speed, mobile, schema, sitemap and robots.txt, HTTPS.\n2. On-page SEO: keyword mapping, title and meta strategy, heading hierarchy, content gaps, internal linking, and image optimisation.\n3. Content strategy: SEO friendly blog topics, long form guides, keyword research, and a monthly content calendar.\n4. Link building that connects to the backlink work.\n5. Measurement: metrics, tools, monthly reporting, and success targets.\n6. Competitive analysis: competitor rankings and gaps to exploit.\n\nFormat as a strategic document for Hamza and Sanwa, actionable with specific keywords, topics, and timelines.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Refine it into a 10 to 15 page strategy document',
            'Build the three month content calendar',
            'Ship the strategy to Hamza',
          ],
          success: [
            'A 90 day strategy with technical, on-page, and content plans',
            'A three month content calendar with keywords',
            'A measurement framework with targets',
          ],
          reward: { badge: 'SEO Strategist', note: 'You shipped a 90 day SEO strategy ops can execute. That is a capstone that moves rankings.' },
        },
      },
    ],
  },
};
Object.assign(COURSES, INTERN_COURSES);

/* ---------------------------------------------------------------------------
   Rich department courses (5 day). Growth is sourced from the InstaSpace
   Growth Department Curriculum; Marketing, GTM, and Brand are authored in the
   same format and voice. These override the starter versions above.
--------------------------------------------------------------------------- */
const DEPT_COURSES = {
  growth: {
    id: 'GRW001', dept: 'growth', title: 'Claude for Growth Lead Generation', level: 'Beginner', days: 5, instructor: 'Layla Al Marri',
    summary: 'Use Claude as a growth multiplier: read buyer psychology, score investor leads, write personalized outreach, measure what works, and ship a reusable growth asset for Dubai and the Maldives.',
    objectives: [
      'Score investor leads on fintech readiness and time to conversion',
      'Write personalized outreach sequences by segment',
      'Measure, iterate, and ship a reusable growth asset',
    ],
    lessons: [
      {
        id: 'GRW001L01', n: 1, title: 'Real Estate Buyer Psychology in Dubai and the Maldives', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'Before you score a single lead you have to understand who is buying and why. Dubai buyers chase capital appreciation and need regulatory certainty. Maldives buyers chase lifestyle and ROI under a stricter regime. Day one reads both markets and the signals that separate a fast converter from a slow browser.',
        keyConcepts: [
          'Dubai psychology: UAE nationals, GCC investors, and Indian high net worth buyers focused on luxury and capital appreciation. Trust in escrow and regulatory verification drives conversion, and the cycle runs two to three months.',
          'Maldives psychology: a smaller resort focused market of EU, US, and Asian buyers chasing lifestyle plus ROI. The stricter regime makes verification the main selling point and stretches the cycle to three to four months.',
          'InstaSpace’s edge: it solves trust with AI native verification and escrow, settlement with borderless payments at 1.5 percent versus a 6.4 percent global average, and speed with digital workflows instead of months of paperwork.',
          'The signals that matter: portfolio size, prior cross border experience, regulatory or legal background, and liquid capital. In the Dubai launch the fast converters averaged an 85M portfolio and 75 percent had a legal or accounting background.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Build a Lead Scoring Prompt', mins: 45, difficulty: 'Beginner',
          brief: 'Fifty investors signed up in the first week of the Dubai launch. Use the prompt below to score which are highest intent for the Phase 2 fintech rollout.',
          promptTemplate: 'You are a growth analyst at InstaSpace, a trust and payments infrastructure platform for cross border real estate in Dubai and the Maldives.\n\nI will paste a list of investor profiles from our launch. Each has name, company, portfolio size, location, background, and sign up source.\n\nScore each investor 1 to 10 on two dimensions:\n1. Fintech readiness: how likely they are to use Phase 2 fintech features. Higher for a 50M plus portfolio, cross border experience, and a legal or accounting background.\n2. Time to conversion: how fast they will sign. One to three weeks for a partner referral with a large portfolio and prior UAE deals, four to eight weeks for organic discovery, eight weeks plus for a first time buyer.\n\nReturn JSON with the scores, the reasoning, and the top action items per investor, for example send an escrow walkthrough or share a case study.\n\nInvestor data:\n[PASTE CSV HERE]',
          task: [
            'Prepare or use synthetic investor data with portfolio, location, background, and source',
            'Run the prompt in your live Claude session on the right',
            'Check that the top 15 ranking matches your read of the data',
            'Save the prompt and output for lesson 2',
          ],
          success: [
            'Claude returns both scores per investor as JSON',
            'The reasoning cites specific signals from each profile',
            'You can defend the top 15 ranking',
          ],
          reward: { badge: 'Signal Reader', note: 'You turned a raw signup list into a defensible, scored ranking. That is Growth work the team can act on today.' },
        },
      },
      {
        id: 'GRW001L02', n: 2, title: 'AI Driven Lead Scoring Workflows', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A rule based score is rigid. An AI native score reasons about which signals matter for your exact situation and explains itself, so you learn. Day two turns a basic scoring prompt into one that ranks like a domain expert through a tight iteration loop.',
        keyConcepts: [
          'Rule based versus AI native: a points table cannot adapt or reason about nuance. Feeding Claude the profile plus your business rules lets it weigh signals and explain its thinking so you can trust and improve it.',
          'What makes a good scoring prompt: clear context, explicit scoring dimensions, one or two worked examples of high versus low, a strict output format, and any business constraints.',
          'The iteration loop: write a basic prompt, check the ranking against your knowledge, add examples, and refine until Claude ranks like an expert. On the Phase 2 launch this loop reached about 87 percent accuracy.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Refine the Scoring Prompt', mins: 45, difficulty: 'Intermediate',
          brief: 'Take your lesson 1 prompt and sharpen it. Add worked examples and refine across a few rounds until the ranking matches your domain knowledge.',
          promptTemplate: 'You are advising the growth team at InstaSpace during our Phase 2 fintech launch, escrow plus borderless settlement.\n\nScore each investor 1 to 10 on fintech adoption likelihood, considering portfolio size, cross border experience, regulatory background, and sign up source.\n\nExample of a HIGH score investor (8 to 10): Rajesh Patel, portfolio 450M, 70 percent international, legal background, partner referral. All four signals strong, likely to close within two to three weeks.\nExample of a MEDIUM score investor (5 to 7): Fatima Al Mansoori, portfolio 95M, domestic focus, real estate background, organic. Good portfolio but no international experience.\nExample of a LOW score investor (1 to 4): Ahmed Khan, portfolio 8M, first time buyer, no background, organic. Needs eight weeks plus of nurture.\n\n[INVESTOR DATA]\n\nReturn JSON with the score, reasoning, and recommended action for each.',
          task: [
            'Run the prompt with your data',
            'Compare the ranking to your own judgement',
            'Add or adjust the worked examples and rerun',
            'Document two or three rounds of refinement',
          ],
          success: [
            'The prompt includes worked high, medium, and low examples',
            'The ranking improves across rounds',
            'You documented what changed and why',
          ],
          reward: { badge: 'Prompt Tuner', note: 'You taught the prompt to rank like a domain expert and wrote down why. That is a scoring asset the team can reuse.' },
        },
      },
      {
        id: 'GRW001L03', n: 3, title: 'Personalized Outreach Sequences', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'One email to fifty investors converts almost nobody. Segment them by the signals from your score, then write a sequence tuned to each segment’s real problem. Day three uses Claude to turn one score into focused outreach sequences.',
        keyConcepts: [
          'The personalization problem: a single blast might open at 24 percent and convert at 2 percent. Segmenting and tailoring can lift that toward 42 percent open and 8 percent conversion.',
          'A segment sequence has five beats: a hook on day 0, the value prop on day 3, social proof on day 7, a demo or beta offer on day 10, and urgency on day 14.',
          'Match the message to the segment: high signal investors get an escrow walkthrough and a case study, medium signal get education and a product overview, low signal get a longer nurture.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Write a Personalized Outreach Sequence', mins: 45, difficulty: 'Intermediate',
          brief: 'Pick one segment from your scored list and use the prompt below to write a five email sequence tuned to their pain point.',
          promptTemplate: 'You are a growth expert at InstaSpace writing a five email outreach sequence for one investor segment.\n\nSegment name: [your segment]\nInvestor profile: portfolio, location, background, and pain point\nInstaSpace value for this segment: for example, we cut cross border settlement from 6.4 percent to 1.5 percent and close in two weeks not six\n\nWrite five emails on this schedule: email 1 day 0 a hook on why this investor specifically, email 2 day 3 the value prop, email 3 day 7 social proof from a similar investor, email 4 day 10 a demo or beta offer, email 5 day 14 urgency as the beta closes.\n\nEach email is 150 to 250 words, a warm professional tone, and one clear call to action. No hype, no dashes.',
          task: [
            'Pick a segment and write its specific pain point',
            'Run the prompt to generate the five emails',
            'Edit the output for tone and personalization',
            'Note your refinements',
          ],
          success: [
            'Five emails with subject lines that progress hook to urgency',
            'Each is tuned to the segment’s pain point',
            'The tone is trust focused, not salesy',
          ],
          reward: { badge: 'Sequence Writer', note: 'You turned one score into a segment ready outreach sequence. That is how a blast becomes a conversation.' },
        },
      },
      {
        id: 'GRW001L04', n: 4, title: 'Measuring and Iterating on Prompts', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A prompt is a hypothesis. Day four builds the feedback loop that proves whether your scores and sequences actually worked, so version two is sharper than version one. On the Phase 2 launch the first score was 40 percent accurate; a refined version reached 75 percent on the Maldives pilot.',
        keyConcepts: [
          'Measure the score on accuracy, bias, and consistency, and the sequences on open rate, reply rate, conversion, and segment precision.',
          'Build a four week loop: deploy and send in week one, measure early signal in week two, analyse mismatches in week three, and refine and redeploy in week four.',
          'Learn from the misses: the Phase 2 score overweighted portfolio size and missed engagement velocity and deal stage. Adding engagement signals lifted accuracy on the next cohort.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Design a Measurement and Iteration Plan', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to turn your score and sequences into a measurable four week plan with targets and predicted failure modes.',
          promptTemplate: 'You are a growth analyst at InstaSpace. I have a lead scoring prompt and a set of personalized outreach sequences. Help me design a four week measurement and iteration plan.\n\nInclude:\n1. Metrics for the scoring prompt: accuracy, bias, and consistency, with a target and a measurement window.\n2. Metrics for the outreach sequences: open rate, reply rate, demo booking, and conversion, with targets per segment.\n3. A week by week plan: baseline, early signal, iterate, and refine and redeploy for the Maldives launch.\n4. Predicted failure modes, for example overweighting portfolio size, and how you would check and fix each.\n\nReturn a structured plan I can hand to the growth lead.',
          task: [
            'Run the prompt to draft the plan',
            'Set realistic targets per segment',
            'List two or three predicted failure modes and the fix',
            'Save the plan for your capstone',
          ],
          success: [
            'Clear metrics and targets for both the score and the sequences',
            'A week by week measurement plan',
            'Predicted failure modes with checks',
          ],
          reward: { badge: 'Loop Closer', note: 'You turned a prompt into a measurable experiment with a plan to improve it. That is how prompts earn their place.' },
        },
      },
      {
        id: 'GRW001L05', n: 5, title: 'Capstone: Build a Reusable Growth Asset', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five consolidates the week into one documented, reusable asset the whole Growth team can deploy: a scoring prompt, a sequence system, or an end to end playbook that works across Dubai, the Maldives, and future markets.',
        keyConcepts: [
          'A reusable asset works across markets, is documented so anyone can run it, and saves hours every time. It names its purpose, when to use it, and when not to.',
          'It ships with the prompt template, step by step instructions, sample input and output, and a customization guide for the Maldives and future markets.',
          'It carries an honest accuracy estimate and a feedback loop, so the team can improve it as a versioned asset.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship a Reusable Growth Asset', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to consolidate your scoring, sequences, and measurement into one documented asset for the Growth toolbox.',
          promptTemplate: 'I have built a lead scoring prompt, personalized outreach sequences, and a measurement plan for InstaSpace growth. Consolidate them into one reusable, well documented Growth asset the team can deploy repeatedly.\n\nProduce a document with:\n1. Asset name and a one sentence purpose\n2. When to use it and when not to\n3. The full prompt template with clear placeholders\n4. Step by step instructions to run it\n5. Sample input CSV and sample output JSON\n6. A customization guide for the Maldives and future markets like KSA and Morocco\n7. An accuracy estimate and a feedback and iteration process\n\nFormat it so the Growth team can add it straight to the shared toolbox.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Refine it into a complete, documented asset',
            'Add a customization guide for the Maldives',
            'Ship it to the Growth toolbox',
          ],
          success: [
            'A documented asset with purpose, prompt, and instructions',
            'Sample input and output included',
            'A customization guide and an honest accuracy estimate',
          ],
          reward: { badge: 'Asset Builder', note: 'You shipped a reusable growth asset the whole team can deploy across markets. That is infrastructure, not just a prompt.' },
        },
      },
    ],
  },

  marketing: {
    id: 'MKT001', dept: 'marketing', title: 'Claude for Marketing', level: 'Beginner', days: 5, instructor: 'Omar Haddad',
    summary: 'Use Claude to run the InstaSpace launch marketing: sharpen positioning, write copy that converts, build email and social campaigns, and ship a full launch campaign kit for Dubai and the Maldives.',
    objectives: [
      'Turn the InstaSpace story into a clear message house',
      'Write launch copy, emails, and social that convert',
      'Ship a complete launch campaign kit',
    ],
    lessons: [
      {
        id: 'MKT001L01', n: 1, title: 'Positioning the InstaSpace Story', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'Marketing fails when the message is fuzzy. Day one uses Claude to pin down what InstaSpace stands for, trust and borderless settlement for cross border real estate, and turn it into a message house every campaign can pull from.',
        keyConcepts: [
          'The core promise: InstaSpace makes a cross border deal feel safe and fast, verified trust plus settlement at 1.5 percent instead of 6.4 percent, in two weeks not six.',
          'A message house has one core message, three pillars, trust, cost, and speed, and proof under each. Every asset traces back to it.',
          'Match the message to the audience: a Dubai investor cares about capital certainty, a Maldives buyer about verification and lifestyle. Same house, different door.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Build the InstaSpace Message House', mins: 45, difficulty: 'Beginner',
          brief: 'Use the prompt below to turn the InstaSpace promise into a message house you can hand to every campaign.',
          promptTemplate: 'You are a marketing strategist at InstaSpace, a trust and payments platform for cross border real estate in Dubai and the Maldives.\n\nBuild a message house with:\n1. One core message in a single sentence\n2. Three pillars: trust (AI native verification plus escrow), cost (settlement at 1.5 percent versus 6.4 percent), and speed (two weeks versus six)\n3. Two or three proof points under each pillar\n4. A one line variant of the core message for a Dubai investor and one for a Maldives buyer\n\nTone: confident, precise, quietly premium. No hype, no dashes. Return it as a clean structured document.',
          task: [
            'Run the prompt in your live Claude session on the right',
            'Refine the core message until it is one sharp sentence',
            'Confirm each pillar has real proof, not adjectives',
            'Save the message house for the rest of the week',
          ],
          success: [
            'One clear core message and three pillars with proof',
            'Audience variants for Dubai and the Maldives',
            'The tone is premium and free of hype',
          ],
          reward: { badge: 'Message Architect', note: 'You gave every future campaign a single source of truth. That is what keeps marketing on message.' },
        },
      },
      {
        id: 'MKT001L02', n: 2, title: 'Launch Copy that Converts', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Copy that lists features loses to copy that stages an outcome. Day two rebuilds a launch page section around one concrete moment an investor can already feel, then proves it with the numbers.',
        keyConcepts: [
          'Lead with the outcome, not the feature. An investor is buying certainty and speed, not a settlement rail.',
          'One idea per section, one call to action. A page that says three things converts on none of them.',
          'Proof beats adjectives. Replace revolutionary and seamless with 1.5 percent and two weeks.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Rewrite a Launch Page Section', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to rebuild a flat, feature stuffed hero section into launch copy that leads with the outcome.',
          promptTemplate: 'You are a conversion copywriter at InstaSpace, cross border real estate trust plus borderless payments.\n\nRewrite this hero section so it leads with the investor outcome and proves it with numbers.\n\nCurrent copy: "InstaSpace is a revolutionary platform with escrow, borderless settlement, verification, and a seamless dashboard for global real estate."\n\nProduce: a headline of 10 words or fewer, a subhead of one sentence, three short proof points (use 1.5 percent versus 6.4 percent, two weeks versus six, and AI native verification), and one clear call to action.\n\nTone: confident, precise, quietly premium. No hype words, no dashes. Give me two variants.',
          task: [
            'Run the prompt in your live Claude session',
            'Pick the stronger of the two variants',
            'Check every line traces back to the message house',
            'Cut any adjective that any platform could use',
          ],
          success: [
            'A headline that leads with the outcome',
            'Three proof points using real numbers',
            'One clear call to action, no hype',
          ],
          reward: { badge: 'Copy that Converts', note: 'You rebuilt dead feature copy into a section that sells the outcome. That is how a page earns a click.' },
        },
      },
      {
        id: 'MKT001L03', n: 3, title: 'Email and Nurture Campaigns', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'The pre launch and welcome emails set the whole relationship. Day three uses Claude to build a launch email sequence that earns opens, builds trust, and moves an investor from curious to booked.',
        keyConcepts: [
          'One job per email: announce, educate, prove, invite, remind. An email that does two jobs does neither.',
          'Precise beats friendly. Give the specific number, the specific next step, and one contact.',
          'Sequence the trust: lead with verification and settlement proof before you ask for a demo.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Build a Launch Email Sequence', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to write a five email launch sequence for investors on the Dubai waitlist.',
          promptTemplate: 'You are an email marketer at InstaSpace, cross border real estate trust plus borderless payments.\n\nWrite a five email launch sequence for investors on the Dubai waitlist, using the InstaSpace message house (trust, cost, speed).\n\nSchedule: email 1 the launch announcement, email 2 the cross border problem and its cost, email 3 how escrow and borderless settlement solve it, email 4 a short case study, email 5 an invitation to try Phase 2 with a soft deadline.\n\nEach email: a subject line, 120 to 200 words, one clear call to action, a warm professional tone, no hype, no dashes. Return all five.',
          task: [
            'Run the prompt to generate the sequence',
            'Edit each subject line to earn the open',
            'Confirm one job and one call to action per email',
            'Save the sequence for the campaign kit',
          ],
          success: [
            'Five emails each with a subject line and one job',
            'Trust and proof come before the ask',
            'The tone is warm, precise, and on brand',
          ],
          reward: { badge: 'Sequence Builder', note: 'You built a launch sequence that earns trust before it asks. That is how a waitlist becomes a pipeline.' },
        },
      },
      {
        id: 'MKT001L04', n: 4, title: 'Social and Content Calendar', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A launch needs a drumbeat, not a single post. Day four uses Claude to plan a two week social and content calendar that carries the message across surfaces without repeating itself.',
        keyConcepts: [
          'Plan around the message house: each day advances one pillar, trust, cost, or speed, with a specific proof point.',
          'Vary the format, hold the voice: an announcement, a stat card, a short explainer, a case study, a question to the community.',
          'Tie every post to one call to action and one metric, so you know what worked.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Generate a Launch Content Calendar', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to produce a two week launch content calendar mapped to the message house.',
          promptTemplate: 'You are a content strategist at InstaSpace, cross border real estate trust plus borderless payments, launching in Dubai.\n\nBuild a 14 day social and content calendar (Instagram and LinkedIn) mapped to our message pillars of trust, cost, and speed.\n\nFor each day give: the pillar, the post format (announcement, stat card, explainer, case study, or community question), the hook, the caption in fewer than 60 words, the call to action, and the metric to track.\n\nVary the format day to day, keep the InstaSpace voice, confident and quietly premium, with no hype and no dashes. Return it as a table.',
          task: [
            'Run the prompt to generate the calendar',
            'Check each day advances a real pillar with proof',
            'Adjust the mix so no format repeats two days running',
            'Save the calendar for the campaign kit',
          ],
          success: [
            'A 14 day calendar mapped to the three pillars',
            'A varied format mix with hooks and calls to action',
            'A metric to track for every post',
          ],
          reward: { badge: 'Calendar Keeper', note: 'You turned a launch into a two week drumbeat that never repeats itself. That is a campaign, not a post.' },
        },
      },
      {
        id: 'MKT001L05', n: 5, title: 'Capstone: Launch Campaign Kit', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five consolidates the week into one kit the team can execute: the message house, the launch page copy, the email sequence, and the content calendar, packaged so anyone can run the Dubai launch and adapt it for the Maldives.',
        keyConcepts: [
          'A campaign kit is self serve: message house, copy, emails, calendar, and a one page how to run it.',
          'It is adaptable: a short guide on what to change for the Maldives audience and regime.',
          'It defines success: the metric and target for each channel so the team knows if it worked.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship the Launch Campaign Kit', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to consolidate the week into a launch campaign kit the marketing team can execute.',
          promptTemplate: 'I have built a message house, launch page copy, a five email sequence, and a 14 day content calendar for the InstaSpace Dubai launch. Consolidate them into one Launch Campaign Kit the marketing team can execute.\n\nInclude:\n1. The message house on one page\n2. The launch page copy\n3. The email sequence with subject lines\n4. The 14 day content calendar\n5. A one page how to run the campaign, with owners and timing\n6. A short adaptation guide for the Maldives launch\n7. The metric and target for each channel\n\nMake it clean, organised, and ready for the team to run.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Assemble the message house, copy, emails, and calendar',
            'Add the run guide and the Maldives adaptation',
            'Ship the kit to the marketing team',
          ],
          success: [
            'A self serve kit with message, copy, emails, and calendar',
            'A run guide with owners, timing, and targets',
            'A Maldives adaptation guide',
          ],
          reward: { badge: 'Campaign Shipped', note: 'You shipped a launch campaign kit the team can run without you in the room. That is marketing that scales.' },
        },
      },
    ],
  },

  gtm: {
    id: 'GTM001', dept: 'gtm', title: 'Claude for Go To Market', level: 'Intermediate', days: 5, instructor: 'Sara Nasser',
    summary: 'Use Claude to sequence a clean market entry: map the regulation, seed supply before demand, hold trust in the messaging, line up channels, and ship a full launch plan for a new market.',
    objectives: [
      'Map the regulatory surface of a new market first',
      'Sequence supply, demand, and messaging without breaking trust',
      'Ship a launch plan for the Maldives entry',
    ],
    lessons: [
      {
        id: 'GTM001L01', n: 1, title: 'Regulation Before Everything', mins: 120, difficulty: 'Intermediate', status: 'active',
        concept: 'A new market is a new rulebook, not just a new city. Day one uses Claude to map the licensing body, the registration path, and the settlement rules before a single listing goes live, because launching on an unclear rulebook means inheriting every host’s problem.',
        keyConcepts: [
          'Identify the licensing authority and the permit type first. Nothing else is safe to sequence until this is clear.',
          'Confirm the escrow and settlement path before you onboard anyone, since trust is the whole product.',
          'Write the compliance summary a host or investor can read in one minute, so the rulebook becomes a selling point, not a barrier.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Map a New Market’s Regulation', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to map the regulatory surface of the Maldives entry and turn it into a one minute compliance summary.',
          promptTemplate: 'You are a go to market analyst at InstaSpace, cross border real estate trust plus borderless payments, entering the Maldives.\n\nMap the regulatory surface I need to clear before launch. Cover:\n1. The likely licensing authority and permit type for a real estate and payments platform\n2. The escrow and settlement requirements and any restrictions on foreign buyers\n3. The verification and anti money laundering expectations\n4. The open questions I must confirm with local counsel\n\nThen write a one minute compliance summary an investor could read to feel safe. Flag anything you are unsure of rather than guessing. Return a structured brief.',
          task: [
            'Run the prompt in your live Claude session on the right',
            'Separate what is known from what needs local counsel',
            'Draft the one minute compliance summary',
            'Save the regulatory map for the launch sequence',
          ],
          success: [
            'A map of the licensing, escrow, and verification surface',
            'A clear list of open questions for counsel',
            'A one minute compliance summary',
          ],
          reward: { badge: 'Rulebook Reader', note: 'You mapped the rulebook before touching supply. That is how a market opens without inheriting its problems.' },
        },
      },
      {
        id: 'GTM001L02', n: 2, title: 'Sequencing Supply and Demand', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Supply and demand cannot arrive together. Empty listings kill guest trust, empty search kills host trust. Day two uses Claude to turn your constraints into a week by week sequence that seeds one side just ahead of the other.',
        keyConcepts: [
          'Seed supply two to three weeks ahead of demand spend, and set a listing floor before any paid acquisition.',
          'Give Claude your real constraints, permit timing, budget unlock, and supply targets, and let it produce the sequence.',
          'Protect trust at the seams: never send paid demand to an empty market, and never onboard hosts you cannot yet settle.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Sequence the Launch', mins: 45, difficulty: 'Advanced',
          brief: 'Use the prompt below to turn your constraints into a week by week launch sequence that seeds supply before demand.',
          promptTemplate: 'You are planning the InstaSpace Maldives launch. Turn these constraints into a week by week launch sequence.\n\nConstraints:\n1. The permit is in review and must clear before anything goes live\n2. A supply floor of 120 verified listings before any paid demand\n3. Paid acquisition budget unlocks in week five\n\nProduce a week by week plan across eight weeks that clears regulation first, seeds supply two to three weeks ahead of demand, holds paid spend until the supply floor is crossed, and names the trust risk at each step. Return a structured timeline.',
          task: [
            'Run the prompt in your live Claude session',
            'Check regulation clears before anything goes live',
            'Confirm supply leads demand by two to three weeks',
            'Note the trust risk at each step',
          ],
          success: [
            'Regulation cleared before week one',
            'Supply seeded ahead of demand spend',
            'A listing floor set before paid acquisition',
          ],
          reward: { badge: 'Market Maker', note: 'You sequenced a launch that respects the rulebook and seeds supply first. That is how a market opens without breaking trust.' },
        },
      },
      {
        id: 'GTM001L03', n: 3, title: 'Launch Messaging that Holds Trust', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'The launch announcement is a trust document. It tells hosts you are licensed and tells investors you are safe. Day three uses Claude to write a message that carries supply, demand, and regulation in one breath.',
        keyConcepts: [
          'Lead with the license, not the discount. In a trust market, credibility is the offer.',
          'Name the settlement guarantee explicitly, so both sides know their money is safe.',
          'One announcement, two audiences, no mixed signals: hosts hear safety and speed, investors hear verification and settlement.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Write the Launch Announcement', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to draft a Maldives launch announcement that leads with trust and speaks to both audiences.',
          promptTemplate: 'You are writing the InstaSpace Maldives launch announcement. It must work as a trust document for two audiences at once.\n\nWrite a launch announcement that:\n1. Leads with the license and regulatory clearance, not a discount\n2. Names the escrow and settlement guarantee explicitly\n3. Speaks to hosts (safety and speed) and investors (verification and settlement) without mixing signals\n4. Ends with one clear next step for each audience\n\nTone: confident, precise, quietly premium. No hype, no dashes. Return the announcement plus a one line social version.',
          task: [
            'Run the prompt in your live Claude session',
            'Confirm it leads with the license, not a discount',
            'Check both audiences are addressed cleanly',
            'Save the announcement for the launch plan',
          ],
          success: [
            'The message leads with regulatory credibility',
            'The settlement guarantee is explicit',
            'Both audiences are addressed without mixed signals',
          ],
          reward: { badge: 'Trust Messenger', note: 'You wrote a launch that reads as a trust document. In this market, that is the whole pitch.' },
        },
      },
      {
        id: 'GTM001L04', n: 4, title: 'Channels and Partnerships', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'The fastest way into a trust market is through people who already have it. Day four uses Claude to map the channels and partners, resorts, portals, and local counsel, that lend InstaSpace credibility from day one.',
        keyConcepts: [
          'Partner for trust, not just reach. A Maldives resort or a UAE portal transfers credibility a paid ad cannot.',
          'Rank channels by relevance and trust transfer first, cost second.',
          'Give each partner a reason and an easy yes: a clear mutual benefit and a low lift ask.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Build the Channel and Partner Map', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to map and rank the channels and partners for the Maldives entry.',
          promptTemplate: 'You are planning channels and partnerships for the InstaSpace Maldives launch, cross border real estate trust plus borderless payments.\n\nMap and rank the channels and partners that would give us credibility and reach. Cover:\n1. Partner types: resorts, property portals, local counsel, and fintech or payment partners\n2. For each, the trust transfer, the reach, the relevance, and the mutual benefit\n3. A ranked shortlist of the ten to reach first\n4. A one line reason and an easy ask for each\n\nPrioritise trust transfer and relevance over raw reach. Return a ranked table.',
          task: [
            'Run the prompt in your live Claude session',
            'Rank partners by trust transfer and relevance',
            'Write a one line reason and ask for the top ten',
            'Save the map for the launch plan',
          ],
          success: [
            'A ranked shortlist of ten partners',
            'Each has a trust and relevance rationale',
            'Each has a clear mutual benefit and easy ask',
          ],
          reward: { badge: 'Channel Mapper', note: 'You found the partners who lend InstaSpace trust from day one. That beats a cold paid launch every time.' },
        },
      },
      {
        id: 'GTM001L05', n: 5, title: 'Capstone: Market Launch Plan', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five consolidates the week into one launch plan leadership can approve: the regulatory map, the supply and demand sequence, the messaging, and the channel plan, all on a timeline with owners.',
        keyConcepts: [
          'A launch plan sequences regulation, supply, demand, messaging, and channels on one timeline with owners.',
          'It names the trust risk at each step and the mitigation.',
          'It defines the go and no go gates: the conditions that must be true before each phase.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship the Market Launch Plan', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to consolidate the week into a Maldives launch plan leadership can approve.',
          promptTemplate: 'I have a regulatory map, a supply and demand sequence, a launch announcement, and a channel and partner map for the InstaSpace Maldives entry. Consolidate them into one Market Launch Plan leadership can approve.\n\nInclude:\n1. An executive summary of the entry\n2. The regulatory clearance path and open questions\n3. The week by week supply and demand sequence\n4. The launch messaging for both audiences\n5. The ranked channel and partner plan\n6. Go and no go gates for each phase\n7. Owners, timing, and the trust risk plus mitigation at each step\n\nFormat it as an approval ready plan for the leadership team.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Assemble the regulation, sequence, messaging, and channels',
            'Add the go and no go gates and owners',
            'Ship the plan to leadership',
          ],
          success: [
            'A single timeline covering regulation to channels',
            'Go and no go gates for each phase',
            'Owners, timing, and trust mitigation throughout',
          ],
          reward: { badge: 'Launch Planner', note: 'You shipped an approval ready launch plan that opens a market without breaking trust. That is GTM done right.' },
        },
      },
    ],
  },

  brand: {
    id: 'BRD001', dept: 'brand', title: 'Claude for Brand and Voice', level: 'Beginner', days: 5, instructor: 'Yousef Karim',
    summary: 'Use Claude to hold one InstaSpace voice from a push notification to an investor deck: learn the voice, edit to it, keep it consistent across surfaces, and ship a brand voice playbook.',
    objectives: [
      'Define the InstaSpace voice in rules, not vibes',
      'Edit any draft back to the voice with Claude',
      'Ship a brand voice playbook the whole team can use',
    ],
    lessons: [
      {
        id: 'BRD001L01', n: 1, title: 'The InstaSpace Voice', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'The InstaSpace voice is trust infrastructure in sentence form. When cross border capital and a stranger’s home are both on the line, the writing has to feel like the platform: precise, calm, and quietly certain. Day one turns that feeling into rules Claude can follow.',
        keyConcepts: [
          'Confident, not loud: state the fact and drop the exclamation. Certainty carries the sentence.',
          'Precise, not clever: one reading only, no room for doubt. Give the number, not the adjective.',
          'Quietly premium: restraint reads as expensive. Never hype, never clutter, and never use dashes as punctuation.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Write the Voice Rules', mins: 45, difficulty: 'Beginner',
          brief: 'Use the prompt below to turn the InstaSpace voice into a short, testable set of rules Claude and the team can follow.',
          promptTemplate: 'You are a brand editor at InstaSpace, a trust and payments platform for cross border real estate.\n\nOur voice is confident, precise, and quietly premium. It never hypes, never clutters, and never uses dashes as punctuation. It states facts and lets certainty carry the sentence.\n\nWrite a short brand voice guide with:\n1. Three to five voice principles, each in one line\n2. A do and a do not example sentence for each principle\n3. A short banned words list (hype words like revolutionary, seamless, game changer)\n4. A one line test anyone can apply to check a sentence is on voice\n\nKeep it tight and usable. Return it as a clean guide.',
          task: [
            'Run the prompt in your live Claude session on the right',
            'Tighten each principle to one clear line',
            'Confirm every principle has a do and a do not',
            'Save the voice rules for the rest of the week',
          ],
          success: [
            'Three to five one line voice principles',
            'A do and a do not example for each',
            'A banned words list and a one line test',
          ],
          reward: { badge: 'Voice Keeper', note: 'You turned a feeling into rules Claude and the team can follow. That is what keeps a brand sounding like itself.' },
        },
      },
      {
        id: 'BRD001L02', n: 2, title: 'Editing to the Voice with Claude', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Most drafts arrive hyped, cluttered, or hedged. Day two uses Claude to pull a paragraph back to the InstaSpace voice, but only if you hand it the rules as constraints instead of a vague ask.',
        keyConcepts: [
          'Give Claude the voice rules as constraints, not vibes. It edits to what you specify.',
          'Ask it to flag every word any brand could have written, then cut them.',
          'Prefer the shorter version whenever the meaning survives.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Rescue an Off Voice Draft', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to pull a loud, padded draft back to a line that sounds like InstaSpace.',
          promptTemplate: 'You are a brand editor at InstaSpace. Edit the draft below to our voice, which is confident, precise, and quietly premium, with no hype and no dashes.\n\nDraft: "Unlock AMAZING returns with the most revolutionary, seamless cross border real estate platform ever built!"\n\nDo three things:\n1. State the single true claim underneath the hype\n2. Rewrite it in the InstaSpace voice, two variants\n3. List every word you removed and why\n\nThe real claim is dependable, verified settlement on cross border deals. Return the two rewrites and the removed words list.',
          task: [
            'Run the prompt in your live Claude session',
            'Pick the stronger of the two rewrites',
            'Check the removed words list for anything still off voice',
            'Save the before and after as a teaching example',
          ],
          success: [
            'The hype and exclamation are gone',
            'One clear reading, no filler words',
            'A removed words list that shows the edit',
          ],
          reward: { badge: 'Line Editor', note: 'You pulled a loud, padded draft back to a line that sounds like InstaSpace. Restraint reads as expensive.' },
        },
      },
      {
        id: 'BRD001L03', n: 3, title: 'One Voice, Every Surface', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'A push notification and an investor deck are the same voice at different volumes. Day three uses Claude to keep the tone constant while the format changes, so the brand feels like one company everywhere.',
        keyConcepts: [
          'Change the length, never the temperature. The voice holds from a notification to a deck.',
          'A notification is a headline, a deck is the same headline with proof.',
          'If a line would not sit in the deck, it does not sit in the app.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Carry One Message Across Surfaces', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to express one InstaSpace message across four surfaces without changing the voice.',
          promptTemplate: 'You are a brand editor at InstaSpace. Take one core message and express it across four surfaces in the same voice, confident, precise, quietly premium, no hype, no dashes.\n\nCore message: cross border settlement that is verified, fast, and low cost, 1.5 percent instead of 6.4 percent, in two weeks not six.\n\nWrite it as:\n1. A push notification, one line\n2. An Instagram caption, under 50 words\n3. A landing page hero, a headline plus one subhead\n4. An investor deck line with one proof point\n\nKeep the temperature identical across all four. Return them labelled.',
          task: [
            'Run the prompt in your live Claude session',
            'Read the four versions aloud and check the voice never shifts',
            'Tighten any surface that slipped into hype',
            'Save the set as a cross surface example',
          ],
          success: [
            'The same message on four surfaces',
            'The voice is identical across all of them',
            'Each fits its format without losing the tone',
          ],
          reward: { badge: 'One Voice', note: 'You held one voice from a notification to a deck. That is what makes a brand feel like one company.' },
        },
      },
      {
        id: 'BRD001L04', n: 4, title: 'Building Brand Guidelines', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Rules only scale if they are written down. Day four uses Claude to turn your voice work into a short guidelines document the whole team, and Claude, can follow without you in the room.',
        keyConcepts: [
          'Guidelines are for the team, not the awards shelf. Short, testable, and full of examples.',
          'Pair every rule with a do and a do not, drawn from real InstaSpace copy.',
          'Include the design rails that touch writing: Dubai and the Maldives only, no dashes, sentence case, no emoji.',
        ],
        videoLabel: 'Lesson walkthrough',
        practice: {
          title: 'Draft the Brand Guidelines', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to turn your voice rules and examples into a short, usable brand guidelines document.',
          promptTemplate: 'You are a brand editor at InstaSpace. Turn our voice work into a short brand guidelines document the whole team can follow.\n\nInclude:\n1. The voice principles with a do and a do not for each\n2. The banned words list and the one line on voice test\n3. Writing rails: markets are Dubai and the Maldives only, no dashes as punctuation, sentence case, no emoji, no hype\n4. Three worked before and after examples from InstaSpace copy\n5. A quick checklist to run before anything ships\n\nKeep it tight and practical, no more than two pages. Return the guidelines.',
          task: [
            'Run the prompt in your live Claude session',
            'Confirm every rule has a do and a do not',
            'Add the writing rails and the pre ship checklist',
            'Save the guidelines for your capstone',
          ],
          success: [
            'Voice principles with examples and rails',
            'Three before and after examples',
            'A pre ship checklist',
          ],
          reward: { badge: 'Guideline Writer', note: 'You wrote guidelines the team will actually use, short, testable, and full of examples.' },
        },
      },
      {
        id: 'BRD001L05', n: 5, title: 'Capstone: Brand Voice Playbook', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five consolidates the week into one playbook the whole company can use to sound like InstaSpace: the voice rules, the editing method, the cross surface examples, and the guidelines, packaged so anyone, or Claude, can apply it.',
        keyConcepts: [
          'A playbook is self serve: rules, method, examples, and a checklist in one place.',
          'It includes a ready to paste Claude prompt so anyone can edit copy to the voice on demand.',
          'It is versioned and maintained, so the voice holds as the company grows.',
        ],
        videoLabel: 'Capstone walkthrough',
        practice: {
          title: 'Ship the Brand Voice Playbook', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to consolidate the week into a brand voice playbook the whole company can use.',
          promptTemplate: 'I have voice rules, an editing method, cross surface examples, and brand guidelines for InstaSpace. Consolidate them into one Brand Voice Playbook the whole company can use.\n\nInclude:\n1. The voice principles with do and do not examples\n2. The editing method: how to pull any draft back to the voice\n3. Cross surface examples from a notification to a deck\n4. The writing rails and a pre ship checklist\n5. A ready to paste Claude prompt anyone can use to edit copy to the InstaSpace voice\n6. A note on how to maintain and version the playbook\n\nFormat it as a clean, self serve playbook for the whole team.',
          task: [
            'Run the capstone prompt in your live Claude session',
            'Assemble the rules, method, examples, and guidelines',
            'Include the ready to paste editing prompt',
            'Ship the playbook to the whole team',
          ],
          success: [
            'A self serve playbook with rules, method, and examples',
            'A ready to paste Claude editing prompt',
            'A pre ship checklist and a maintenance note',
          ],
          reward: { badge: 'Playbook Author', note: 'You shipped a brand voice playbook the whole company can use to sound like InstaSpace. That is how a voice scales.' },
        },
      },
    ],
  },
};
Object.assign(COURSES, DEPT_COURSES);

Object.assign(window, { DEPARTMENTS, SPECIALTIES, SPECIALTY_BY_TRACK, COURSES, ACHIEVEMENTS });

// Optionally hydrate courses from Airtable when the backend has it configured.
// Any failure (offline, not configured / 503, empty) leaves the built-in
// courses above untouched, so the portal always has content to show.
window.loadAirtableCourses = async function(){
  try {
    const apiBase = (typeof window.PORTAL_API === 'string') ? window.PORTAL_API : 'http://localhost:3001';
    const res = await fetch(apiBase + '/api/content/courses');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.courses && Object.keys(data.courses).length){
      Object.assign(window.COURSES, data.courses);
      return data;
    }
  } catch (e) { /* keep built-in courses */ }
  return null;
};
