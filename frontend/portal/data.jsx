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
  { id:'seo',            name:'SEO & Backlinks',     badge:'SE', tagline:'Earn the links that earn the rankings.', blurb:'Read intent, spot link prospects, and write outreach that wins a real backlink for InstaSpace.' },
  { id:'design',         name:'Design & Video',      badge:'DS', tagline:'Brief once, ship a campaign.',           blurb:'Turn a one line ask into briefs, storyboards, and on voice captions for Dubai and Maldives launches.' },
  { id:'qa-nocode',      name:'QA & No-code',        badge:'QA', tagline:'Break it before a guest does.',          blurb:'Think in test cases, generate a full suite with Claude, and wire no-code alerts that catch bugs early.' },
  { id:'qa-seo',         name:'QA & SEO',            badge:'QS', tagline:'Quality on the page and in the code.',    blurb:'Audit a listing for bugs and search gaps in one pass, then turn findings into a roadmap.' },
  { id:'webapp-portal',  name:'InstaSpace App Mastery', badge:'WP', tagline:'Know the product cold, teach it back.',   blurb:'Master the InstaSpace webapp and the Learning Portal itself: surfaces, flows, roles, and the QA that keeps them honest.' },
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
        mistakes: [
          'Chasing domain authority over relevance: a DA 80 news site that never covers property is worth less than a DA 35 Dubai travel blog whose readers book stays. Relevance converts, authority alone does not.',
          'Counting directories as prospects: a site with four thousand outbound links and no editorial voice passes no trust. If nobody curates it, search engines discount it.',
          'Prospecting without a contact angle: a list of urls is not a campaign. Every prospect needs a named person and a reason they would say yes, or it will sit in a spreadsheet forever.',
        ],
        worked: {
          intro: 'Study how a senior SEO builds a prospect list before you build yours. The difference is that every row is ready to act on: a real site, a reason, a contact, and an honest value score.',
          setup: 'Three rows from a real prospect list for the Dubai launch. Notice the third row: a high authority site scored LOW because it never links out editorially. A junior would have wasted a week on it.',
          example: `BACKLINK PROSPECTS (three rows of twenty)

{"site":"DubaiStayGuide.ae","category":"Travel blog","da_estimate":6,
 "why":"Weekly Dubai holiday home content, audience actively books stays",
 "links_to":"Neighbourhood guides and data pieces",
 "contact":"Editor, Mariam K., accepts guest data pieces",
 "angle":"Offer our occupancy by district data as an exclusive chart",
 "value":9}

{"site":"GccPropertyWire.com","category":"Property news","da_estimate":8,
 "why":"Covers UAE rental regulation, high trust readership",
 "links_to":"Original research and expert quotes",
 "contact":"News desk, pitches via tips email",
 "angle":"Quote from InstaSpace on DLD permit trends plus our fee data",
 "value":8}

{"site":"BigTravelPortal.com","category":"Global travel","da_estimate":9,
 "why":"Huge reach but zero editorial outbound links in 12 months",
 "links_to":"Nothing, affiliate content only",
 "contact":"None findable",
 "angle":"None viable",
 "value":2}`,
          notes: [
            'The value score is not the DA score. Row three has the highest authority and the lowest value because there is no realistic path to a link.',
            'Every angle names a specific asset we would offer, occupancy data, a regulation quote. "Ask them for a link" is not an angle.',
            'The contact is a person or a route, not "info@". Outreach to a named editor with a relevant asset is the whole game.',
          ],
        },
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
        mistakes: [
          'Copying the competitor instead of the gap: the point is not to get the same links they have, it is to find the publications that link to them and NOT to you, and the angle they missed.',
          'Ignoring why the link exists: a competitor earned that link with a data report or a tool. Without knowing the earning asset, the gap list is a wish list.',
          'Treating every gap as equal: a gap on a relevant, editorially active site is gold. A gap on a dead blog from 2019 is noise. Filter by freshness before you pitch.',
        ],
        worked: {
          intro: 'A gap analysis is only useful if every gap comes with the reason the competitor earned the link and the angle you would use to win the same publication.',
          setup: 'One gap entry from a real competitive analysis. Notice it names the earning asset (their fee comparison report) and proposes a sharper counter asset, not a me too pitch.',
          example: `COMPETITIVE GAP LIST (one entry of ten)

Publication: PropTechDaily.com (fintech and property, weekly links out)
Links to: Competitor fee comparison report, linked in 3 articles this year
Why it worked: original numbers journalists could quote without doing math
The gap: they cover cross border payments but have never mentioned escrow
  or trust verification, the half of the story our competitor cannot tell
Our angle: pitch "the real cost of a cross border property deal", our fee
  data PLUS the trust failures the fee focused report ignores
First touch: comment with data on their latest cross border piece, then
  pitch the editor within the week while the topic is warm
Priority: Tier 1, pitch in week one`,
          notes: [
            'The angle extends the conversation the publication already cares about instead of repeating the competitor asset they already linked to.',
            'The first touch is planned, warm the editor before the ask. Cold pitches to editors who have never seen your name convert in low single digits.',
            'Priority is explicit. Ten gaps with tiers is a plan, forty gaps without tiers is homework nobody does.',
          ],
        },
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
        mistakes: [
          'Making content about yourself: nobody links to "why InstaSpace is great". They link to data, frameworks, and answers their readers need. Your brand rides along, it does not lead.',
          'No quotable line: journalists link to what they can quote. If your asset has no single startling number or one line claim, it will be read and never cited.',
          'Scoping a three month project: a linkable asset you can ship in two weeks beats a definitive guide that never ships. Effort estimates are part of the idea.',
        ],
        worked: {
          intro: 'One fully specified content idea is worth more than ten vague ones. Study how a pro specifies a linkable asset down to the quotable line and the named targets.',
          setup: 'The strongest idea from a real ideation session, specified to the point where a writer could start tomorrow. Notice the quotable line is written before the content exists.',
          example: `LINKABLE ASSET SPEC (the chosen idea)

Title: The Real Cost of Buying Property Across Borders in 2026
Format: data report, 8 pages, one hero chart per section
The quotable line: "International buyers lose 4 to 6 percent of every
  cross border deal to fees and delays, an average of 38,000 dollars
  on a Dubai apartment."
Data sources: our settlement data, published bank FX margins, DLD fee
  schedule, a 40 investor survey we can run in one week
Who links to it, by name: GccPropertyWire (regulation angle),
  PropTechDaily (fintech angle), expat finance blogs (the fee table),
  investor newsletters (the survey findings)
Why they link: original numbers nobody else has published, a chart
  they can embed with attribution
Effort: 2 weeks, one analyst plus one designer
Ships: July 8, one week before launch, so coverage lands launch week`,
          notes: [
            'The quotable line is engineered first, the content is built to support it. That is backwards from how juniors work and it is why pros get cited.',
            'Every target publication is matched to the specific section it would care about. One asset, four different pitches.',
            'The ship date is tied to the launch so the links compound with the news moment instead of arriving after it.',
          ],
        },
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
        mistakes: [
          'Opening with your own name and company: the first line decides the open. Lead with THEIR article, THEIR audience, THEIR broken link. You come second.',
          'Asking for "a link or share": vague asks get archived. Name the exact page, the exact anchor, and where it fits in their piece. Make yes a thirty second job.',
          'Following up like a debt collector: one follow up at day 4 with new value (an updated stat, a chart) doubles replies. Three "just bumping this" emails burn the relationship.',
        ],
        worked: {
          intro: 'Read a cold outreach email that actually earned a link, then hold your templates to its standard: personal in line one, valuable by line three, effortless to say yes to.',
          setup: 'A real style cold pitch to a property publication. Count the sentences about the sender: one. Count the sentences about the recipient and their readers: four.',
          example: `SUBJECT: A number for your DLD permits piece

Hi Mariam,

Your piece on the new DLD holiday home permits answered the question
every host is asking right now, especially the part on renewal timing.

One thing your readers might want next: what the paperwork actually
costs them in lost nights. We measured it across 120 Dubai listings,
hosts lose an average of 11 booked nights waiting on permits, about
9,400 AED each.

The full chart is here [link]. If it is useful for your follow up,
you are welcome to embed it with attribution, no strings.

Either way, the permits piece was the clearest I have read on this.

Sanwa
InstaSpace`,
          notes: [
            'The subject line promises value for THEIR work, not an introduction to ours. That is the difference between 8 percent and 30 percent opens.',
            'The data point is specific enough to be irresistible, 11 nights, 9,400 AED, and it extends their article instead of pitching ours.',
            '"No strings" plus a genuine compliment closes warm. Editors remember who made their job easier.',
          ],
        },
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
        mistakes: [
          'Planning outreach volume you cannot sustain: 50 pitches a week sounds impressive and collapses by week three. A pro plans 10 quality pitches a week and hits 12 weeks straight.',
          'No kill criteria: a roadmap that never drops a dead target wastes months. Every tier needs an exit rule, for example two ignored pitches and one follow up means move on.',
          'Reporting activity instead of outcomes: "40 emails sent" is not a result. Links earned, referring domain quality, and ranking movement are the numbers leadership reads.',
        ],
        worked: {
          intro: 'A roadmap earns its name when any week can be executed without asking you a question. Study one week from a real roadmap and the tracking row that proves the work.',
          setup: 'Week three of a 90 day roadmap plus one row of the tracking sheet. Notice the week has owners, exact counts, and a decision rule, and the tracking row records the outcome, not the effort.',
          example: `WEEK 3 (of 12) · Content ships, Tier 1 outreach opens

Mon  Publish "Real Cost of Cross Border Deals" report      Owner: Sanwa
Tue  Pitch 4 Tier 1 targets with personalised angles       Owner: Mesum
Wed  Broken link sweep on 6 Tier 2 property guides         Owner: Mesum
Thu  Follow up week 2 pitches (day 4 rule, add new stat)   Owner: Mesum
Fri  Log outcomes, move 2 ignored targets to Tier 3        Owner: Sanwa

Decision rule: any target ignoring pitch plus one follow up drops a tier.
Week target: 2 links earned or in editorial review.

TRACKING SHEET (one row)
| Date | Target           | Asset pitched     | Outcome         | DA | Link |
| 7/18 | GccPropertyWire  | Fee data report   | LIVE, dofollow  | 8  | /research/cross-border-costs |`,
          notes: [
            'Every day names one owner and one countable action. "Do outreach" is not a plan, "pitch 4 Tier 1 targets" is.',
            'The decision rule prevents the roadmap from silting up with dead targets, the most common way link campaigns die.',
            'The tracking row records the earned url and follow status, which is what makes month three reporting take ten minutes instead of a day.',
          ],
        },
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
        mistakes: [
          'Briefing the mood instead of the message: "premium and trustworthy" describes every luxury brand on earth. A brief that does not name the single message produces a pretty post that says nothing.',
          'Skipping the dimensions and platform: a concept that works at 1080x1350 dies in a 1080x1920 story. Format is part of the idea, not an export setting.',
          'Leaving copy to the designer: "add some text about trust" guarantees a rewrite. The brief carries the final words, the designer gives them form.',
        ],
        worked: {
          intro: 'A design brief is finished when the designer never has to come back with a question. Study one launch day brief written to that bar.',
          setup: 'Day 3 of the launch week series, the solution post. Every choice is spelled out: the exact copy, the exact hex, the exact weights, and what NOT to do.',
          example: `DESIGN BRIEF · LAUNCH DAY 3 OF 5 · "THE SOLUTION"

Message (one line): Escrow plus borderless settlement, a deal that
  used to take six weeks now closes in two.
Visual concept: a split timeline. Left side, six week bar in muted
  cream at 40 percent opacity labelled "the old way". Right side,
  two week bar in the brand gradient, bold, labelled "InstaSpace".
Copy on image: headline "Six weeks becomes two." set in Urbanist
  ExtraBold 64pt cream. Sub line "Escrow and settlement, built in."
  Urbanist SemiBold 28pt at 70 percent opacity.
Colours: ground #120822, bars #F5EFE8 and the #F2622E to #D11E4C
  gradient. No other colours.
Dimensions: 1080x1350 feed. Safe margins 96px all sides.
Caption: 40 words max, ends with "Early access opens July 15."
Do not: use a photo, use more than two type sizes, add the logo
  larger than 120px, it sits bottom right at 80 percent opacity.`,
          notes: [
            'The visual concept is described so precisely a designer who has never seen InstaSpace could build it, yet it leaves the craft, spacing, motion of the bars, to them.',
            'The copy is final, written words, not a theme. Approving words before design kills the most expensive revision loop.',
            'The do not list encodes brand rules where they are most often broken. A brief without one produces on average two extra review rounds.',
          ],
        },
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
        mistakes: [
          'Writing the caption after the visual: the words carry the message, the visual earns the stop. Approve copy first or you will redesign twice.',
          'Burying the hook: on Instagram only the first line shows before "more". If line one does not stop the scroll, lines two through ten do not exist.',
          'Hashtag soup: thirty generic tags read as spam to both the algorithm and the investor. Eight to ten specific tags outperform, and none of them is #realestate alone.',
        ],
        worked: {
          intro: 'Study a before and after on one launch caption. The rewrite is not more clever, it is more concrete, and that is the whole craft.',
          setup: 'The same day one announcement, first as a junior drafted it, then as it shipped. Read both aloud and notice where your attention dies in the first version.',
          example: `BEFORE (junior draft)
"We are SO excited to announce that InstaSpace is finally launching in
Dubai!! Our revolutionary platform makes cross border real estate
seamless and stress free. Stay tuned for more!!
#realestate #dubai #startup #excited #launch #proptech #innovation"

AFTER (as shipped)
"A Dubai apartment. A buyer in Singapore. Settled in two weeks, not six.

InstaSpace opens in Dubai on July 15. Escrow, verification, and
borderless settlement at 1.5 percent, built in from day one.

Early access for the first 100 investors. Link in bio.
#DubaiRealEstate #CrossBorderInvesting #UAEProperty #PropTechMENA
#DubaiInvestors #EscrowProtected #MaldivesNext #InstaSpace"

WHY EVERY EDIT HAPPENED
Line 1: a concrete scene replaced excitement nobody shares
Numbers replaced adjectives: two weeks, 1.5 percent, 100 investors
The ask sharpened: "stay tuned" became a countable action`,
          notes: [
            'The after version contains zero exclamation marks and zero hype words, yet reads more confident. Specificity is what confidence looks like in writing.',
            'Every number survived from the message house, nothing was invented for the caption. Copy that invents numbers gets the brand in trouble.',
            'The first line works as a standalone story in six words. That is the test: cover everything below line one and ask if you would tap more.',
          ],
        },
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
        mistakes: [
          'Spending the hook on a logo: the first three seconds decide completion rate, and a logo animation answers a question nobody asked. Open on the viewer problem, brand at the end.',
          'Writing radio, not video: a script where the voiceover says exactly what the screen shows wastes one of the two channels. Voice carries the argument, visuals carry the proof.',
          'No scene durations: a storyboard without seconds per scene always produces a 90 second video for a 60 second slot, and the cut kills the best scene.',
        ],
        worked: {
          intro: 'Study the first two scenes of a shipped explainer script. Notice how the hook is a problem the viewer already feels, and how voice and visuals never repeat each other.',
          setup: 'The opening 20 seconds of the Dubai launch explainer, in the exact format an animator was handed. Total script is 148 words for 60 seconds, roughly 2.5 words per second.',
          example: `SCENE 1 · 0:00 to 0:05 · THE HOOK
Visual: a wire transfer progress bar crawling, stamps piling onto
  documents, a calendar flipping through six weeks, fast cuts
Voiceover: "Buying property in another country still takes six weeks
  and costs more than most people ever find out."
On screen text: "6 weeks. 6.4 percent."
Animation: calendar pages flip harder as the bar crawls
Audio: a low clock tick under muted strings

SCENE 2 · 0:05 to 0:18 · THE PROBLEM MADE PERSONAL
Visual: a split screen, a buyer in Singapore at night, a Dubai
  apartment in daylight, a dotted line between them snapping at
  the middle where a bank icon sits
Voiceover: "Between you and the keys sit intermediaries, fees, and
  paperwork that was designed before the internet."
On screen text: none, let the visual breathe
Animation: the dotted line snaps twice, rebuilds slower each time
Audio: tick continues, one beat of silence at the snap`,
          notes: [
            'The hook states the viewer problem in numbers within five seconds and never mentions the brand. Completion rate is bought in scene one.',
            'The voiceover and visuals carry different halves: voice gives the argument, screen gives the evidence. Where the visual is strong, the text stays silent.',
            'Every scene has exact timestamps, so the 60 second budget is spent on paper before a single frame is animated.',
          ],
        },
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
        mistakes: [
          'Describing motion with adjectives: "smooth and snappy" means four different things to four developers. Milliseconds, easing curves, and triggers are the only shared language.',
          'One off timings everywhere: 180ms here, 240ms there, 310ms somewhere else reads as sloppy in the final cut. A motion system reuses three or four durations everywhere.',
          'Forgetting the trigger: an animation without a defined start event either autoplays wrong or never plays. Every element needs "starts when" in the spec.',
        ],
        worked: {
          intro: 'A motion spec is done when a developer can build the exact animation without watching a reference video. Study one element specified to that standard.',
          setup: 'The fee number from scene one of the explainer, specified as a developer receives it. Notice the shared duration tokens, this project uses only 200ms, 300ms, and 600ms everywhere.',
          example: `ANIMATION SPEC · SCENE 1 · ELEMENT "FEE COUNTER"

Element: the "6.4 percent" figure, Urbanist ExtraBold 96px, #F2622E
Trigger: 400ms after scene 1 visual settles (t = 0:01.2)
Sequence:
  1. Count up 0.0 to 6.4 over 600ms, ease out cubic
     (fast start, decelerating, the number lands with weight)
  2. On land: scale 1.0 to 1.06 to 1.0 over 200ms, ease in out
  3. Colour hold #F5EFE8 during count, snaps to #F2622E on land
End state: 6.4 percent at scale 1.0, #F2622E, remains until scene cut
Do not: loop, bounce more than once, or animate the percent sign
  separately from the digits

MOTION SYSTEM TOKENS (whole project)
fast   200ms  ease in out    micro feedback, scale taps
base   300ms  ease out       reveals, fades, slides
count  600ms  ease out cubic number counts only`,
          notes: [
            'Three duration tokens cover the whole video. Consistency of timing is what makes motion feel designed instead of decorated.',
            'The spec includes the end state and the do nots, the two things developers otherwise have to guess and usually guess differently.',
            'The trigger is expressed relative to the scene, not the video start, so scenes can be re cut without re specifying every element.',
          ],
        },
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
        mistakes: [
          'Shipping a folder, not a kit: fifty files with no index is homework for the receiver. The kit opens with one page that says what exists, where it lives, and who posts what when.',
          'Assets without their captions: a graphic separated from its approved caption gets posted with improvised words, and the voice breaks on day two.',
          'No adaptation notes: the Maldives launch will reuse this kit. Without "what to change and what to never change" notes, someone will change the wrong half.',
        ],
        worked: {
          intro: 'The test of a launch kit is whether marketing can run day one without messaging you. Study the kit index and one calendar entry from a kit that passed that test.',
          setup: 'The first page of the kit plus the day 1 row of the calendar. Every asset is named, every caption travels with its graphic, and posting is an execution task, not a judgement call.',
          example: `VISUAL LAUNCH KIT · INDEX (page 1)

01 Message house one pager          /kit/01-message.pdf
02 Social calendar July 15 to 21    /kit/02-calendar.pdf
03 Feed graphics x5 with captions   /kit/03-feed/
04 Story graphics x5                /kit/04-stories/
05 Video: script, board, specs      /kit/05-video/
06 Design system quick reference    /kit/06-design-ref.pdf
07 Maldives adaptation notes        /kit/07-maldives.pdf

CALENDAR · DAY 1 · TUESDAY JULY 15
Post: 03-feed/day1-announcement.png (1080x1350)
Time: 5:00 PM GST (peak for Dubai investors, tested)
Caption: final text in 03-feed/day1-caption.txt, do not edit
Story: 04-stories/day1.png at 5:30 PM, link sticker to early access
Owner: Ayesha posts, Shahzaib on standby for comments with the
  approved FAQ answers in 01-message
Metric: profile visits and early access signups, log at 9 PM`,
          notes: [
            'The index is the kit. Anyone can find any asset in ten seconds, which is the difference between a kit and a zip file.',
            'Captions ship as locked files next to their graphics. "Do not edit" protects the voice from well meaning improvisation at posting time.',
            'Each day has an owner, a time backed by a reason, and a metric with a check time. Execution needs zero decisions.',
          ],
        },
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
        mistakes: [
          'Testing only the happy path: "user logs in with correct password" is one test. The other nine are wrong password, empty fields, pasted whitespace, expired session, and the back button after logout.',
          'Steps a stranger cannot follow: "test the chat" is not a step. "Type hello, press Enter, wait 10 seconds" is. If a new hire cannot run your case, it is a note, not a test.',
          'No expected result written down: without "expected: error message names the wrong field" you cannot fail the test, and a test that cannot fail is theatre.',
        ],
        worked: {
          intro: 'Study two test cases from a professional plan, one happy path, one edge, and notice they share the same discipline: exact steps, one expected result, no ambiguity.',
          setup: 'Two cases from the portal login area of a real plan. The second one is the kind juniors never write and seniors always write, because it is where products actually break.',
          example: `TEST CASES (two of thirty)

ID: LOGIN-01 · Valid sign in
Precondition: seeded account exists, user signed out, on /
Steps:
  1. Enter the account email in the Email field
  2. Enter the correct password
  3. Press Enter
Expected: dashboard loads within 3 seconds, the sidebar shows the
  user name and track, no console errors
Priority: P0

ID: LOGIN-07 · Session expiry mid exercise (edge)
Precondition: signed in, exercise chat open, session token deleted
  from the database to simulate expiry
Steps:
  1. Type a message in the exercise chat
  2. Press Send
Expected: a clear re authentication message appears, the typed
  message is NOT lost, and after signing back in the user returns
  to the same exercise
Priority: P1
Note: silent failure here loses learner work, worst case for trust`,
          notes: [
            'LOGIN-07 tests what happens at the seam between two features, session and chat. Seams are where the real bugs live.',
            'The expected result for the edge case includes what must NOT happen, the typed message is not lost. Negative expectations catch silent failures.',
            'Priorities are on the case, not in your head, so when time runs short the P0s still run.',
          ],
        },
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
        mistakes: [
          'Reporting the symptom without the reproduction: "chat is broken sometimes" cannot be fixed. If you cannot reproduce it, report exactly what you observed, when, and what you tried, labelled as intermittent.',
          'Severity by annoyance: a typo that made YOU wince is minor, a payment failure you happened to shrug off is critical. Severity follows user impact, not your mood.',
          'Bundling three bugs in one report: each gets one ticket or two of them never get fixed. One report, one bug, one reproduction.',
        ],
        worked: {
          intro: 'An engineer should be able to fix your bug without ever talking to you. Study a report that meets that bar.',
          setup: 'A real style bug report for a progress persistence failure. Notice the environment block, the numbered reproduction, and the severity justified by impact, not emotion.',
          example: `BUG REPORT · PORTAL-BUG-014

Title: Exercise completion lost after page refresh on Safari iOS
Severity: HIGH. Learners lose passed work, which breaks trust in
  the whole portal. Not CRITICAL because work recovers on re grade.
Environment: Safari 17, iPhone 12, iOS 17.5, portal on localhost:8000,
  API healthy at time of test
Steps to reproduce:
  1. Sign in as a seeded intern account
  2. Open lesson 1, complete the exercise, pass the grade
  3. See the success overlay, progress shows 20 percent
  4. Pull to refresh the page
Expected: progress still 20 percent, lesson 1 marked done
Actual: progress shows 0 percent, lesson 1 back to active. The
  same flow on Chrome desktop persists correctly.
Frequency: 3 of 3 attempts on Safari iOS, 0 of 3 on Chrome
Evidence: screen recording attached, console shows a blocked
  localStorage write in private browsing mode
Suspected area: auth token storage falls back silently when
  localStorage is unavailable`,
          notes: [
            'The severity line argues its own rating in one sentence. Triage meetings go twice as fast when every report does this.',
            'Frequency with counts, 3 of 3 versus 0 of 3, turns "it happens sometimes" into a browser specific lead an engineer can chase.',
            'The suspected area is offered humbly and saves an hour of hunting. You are allowed to be wrong, you are not allowed to be vague.',
          ],
        },
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
        mistakes: [
          'Automating judgement instead of handoff: an automation that decides who "deserves" help will be wrong in ways nobody notices. Automate the notification, keep the judgement human.',
          'No failure path: what happens when the email service is down or the record has no address? An automation without an error branch fails silently for months.',
          'Skipping the test record: every automation gets tested with a fake record BEFORE it touches real students, or your first test is a real person getting a wrong email.',
        ],
        worked: {
          intro: 'A production automation is a contract: this trigger, this condition, this action, this failure behaviour. Study one written out to that standard.',
          setup: 'The low score helper automation as documented for handover. Notice the failure branch and the test log, the two sections juniors leave out.',
          example: `AUTOMATION SPEC · LOW SCORE HELPER

Trigger: new record in Exercise Submissions (Airtable)
Condition: Score is less than 7 AND Hints Sent is unchecked
Action:
  1. Look up the exercise in Helpful Hints by ExerciseID
  2. Send email via Zapier Gmail step:
     To: student email · Subject: "A nudge on {ExerciseName}"
     Body: warm opening, the two matched hints, one resource link,
     "reply to this email and a mentor will jump in"
  3. Check the Hints Sent box (prevents double sending)
Failure branch:
  If no hints match the ExerciseID: do NOT email the student,
  post to the mentors channel instead: "No hints exist for
  {ExerciseID}, {Student} scored {Score}, follow up manually."
  If the email step errors: retry once after 10 minutes, then flag.
Test log (before go live):
  7/12 test record score 5, matched hints, email received, box checked
  7/12 test record score 9, correctly ignored
  7/12 test record score 4 with fake exercise id, mentor alert fired,
       student received nothing`,
          notes: [
            'The Hints Sent checkbox is the idempotency guard. Without it, every edit to the record fires another email, the classic no code disaster.',
            'The failure branch protects the student first: no matching hints means a human follows up, never a broken template email.',
            'The test log has three cases: fires, correctly does not fire, and fails safely. All three, every time, before real data.',
          ],
        },
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
        mistakes: [
          'Writing titles for robots: "Claude AI Learning Platform | Course | Learn Claude AI" is keyword stuffing that no human clicks. The title is a promise to a person that also contains the keyword.',
          'Auditing without the current state: a recommendation with no "before" cannot be verified as an improvement. Every finding records what is there now, then what it should be.',
          'Ranking every fix as urgent: an audit where everything is priority one is an audit with no priorities. Quick wins ship this week, structural fixes get a milestone.',
        ],
        worked: {
          intro: 'An audit finding is only useful when it shows the before, the after, and the reason. Study two findings written that way.',
          setup: 'Two rows from a real on page audit of a learning portal. Notice each names the current state, the exact replacement text, and why the change earns clicks or rankings.',
          example: `SEO AUDIT FINDINGS (two of eighteen)

FINDING 03 · Homepage title tag
Current: "InstaSpace Learning Portal"
Problem: no keyword a searcher would type, wastes the most powerful
  30 characters on the site
Recommended: "Learn Claude AI for Real Work | InstaSpace Academy"
  (51 chars: keyword first, brand last, a benefit in the middle)
Effort: 5 minutes · Impact: high · Priority: quick win, this week

FINDING 07 · Lesson pages share one H1
Current: every lesson renders the course title as the H1, so ten
  pages compete for the same phrase
Problem: search cannot tell lessons apart, so none of them rank
Recommended: H1 becomes the lesson title, "Reading Search Intent",
  course title moves to a breadcrumb above it
Effort: one template change · Impact: unlocks ten pages ranking
  for ten different queries · Priority: this sprint`,
          notes: [
            'Both findings quote the exact replacement text. An audit that says "improve the title" outsources the actual work back to the developer.',
            'Effort and impact ride on every finding, which is what lets someone else sequence the work without re reading the whole audit.',
            'Finding 07 is structural, one fix unlocks ten pages. Spotting the template level fix instead of ten page level fixes is what experience looks like.',
          ],
        },
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
        mistakes: [
          'Burying the verdict: leadership opens your report asking one question, can we launch. If the answer is not in the first three lines, the report failed regardless of its quality.',
          'Hiding behind data: forty pages of test results with no recommendation is an abdication. You ran the tests, you make the call, the data defends it.',
          'A bug log without owners and dates: "should be fixed" is a wish. "Junaid, before July 15" is a plan. Reports that assign nothing change nothing.',
        ],
        worked: {
          intro: 'The opening of a testing report decides whether the rest gets read. Study a verdict first opening and one row of a bug log with teeth.',
          setup: 'The first lines of a real style launch readiness report plus one bug log row. The verdict comes first, the evidence follows, and every issue has an owner and a date.',
          example: `PORTAL TESTING AND OPTIMISATION REPORT

VERDICT: Conditional GO. The portal can launch on July 15 if the
two critical issues below are fixed and re tested by July 12.
Everything else can follow launch without user visible risk.

BY THE NUMBERS
Tests executed: 42 of 45 planned (3 blocked on a test account issue)
Pass rate: 86 percent · Critical: 2 · High: 3 · Medium: 6 · Low: 4

THE TWO THAT BLOCK LAUNCH
1. Progress lost on Safari iOS refresh (BUG-014). One in three of
   our interns uses an iPhone. Owner: Junaid. Fix by: July 11.
2. Chat send button dead after an API timeout (BUG-009). The retry
   never re enables, learners think the portal is down.
   Owner: Junaid. Fix by: July 12.

BUG LOG (one row of fifteen)
| ID  | Title                     | Sev  | Owner  | Fix by | Status |
| 014 | Progress lost on refresh  | CRIT | Junaid | 7/11   | Open   |`,
          notes: [
            'The verdict is conditional and specific, launch IF these two by these dates. That is more useful than either a yes or a no.',
            'The two blockers are argued in user terms, one in three interns on iPhone, learners think the portal is down. Impact language gets fixes prioritised.',
            'Three tests were blocked and the report says so. Hiding the gap between planned and executed is how QA loses credibility.',
          ],
        },
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
        mistakes: [
          'Planning by feature list instead of by risk: the features most likely to break are the ones touching money, auth, and third party APIs. A plan that gives login and a static footer equal attention is not a plan.',
          'Tests that depend on each other: if test 12 only works when test 11 passed, one failure cascades into noise. Every case sets up its own preconditions.',
          'Forgetting the failure states: the portal talks to a live AI API. What the user sees when that API is down is a feature, and it needs its own tests.',
        ],
        worked: {
          intro: 'A risk ranked plan spends its first hour where the product is most likely to embarrass you. Study how a pro allocates forty five test cases.',
          setup: 'The allocation table from the front of a real test plan. Notice that surface area does not equal test count, risk does, and the reasoning is written down.',
          example: `TEST PLAN · RISK ALLOCATION (45 cases)

| Area              | Cases | Why this many                        |
| Auth and session  | 10    | Breaks silently, blocks everything   |
| Live Claude chat  | 9     | Third party API, timeout and error   |
|                   |       | paths are the real product           |
| Submission and    | 9     | Data loss here destroys learner      |
| progress          |       | trust permanently                    |
| Navigation        | 6     | High traffic, low complexity         |
| Mobile layout     | 6     | One third of interns are on phones   |
| Error handling    | 5     | API down, network drop, bad input    |

FIRST TEN TO RUN (P0 sweep, in order)
1. LOGIN-01 valid sign in          6. CHAT-03 API timeout message
2. LOGIN-02 wrong password         7. SUB-01 passing grade persists
3. LOGIN-07 session expiry         8. SUB-04 progress after refresh
4. CHAT-01 send and receive        9. NAV-01 course to lesson to chat
5. CHAT-02 empty message blocked  10. MOB-01 exercise chat on iPhone`,
          notes: [
            'The why column forces honesty about risk. If you cannot say why an area gets nine cases, you are testing by habit, not by thinking.',
            'The first ten are ordered so that a failure early, sign in broken, stops the run before wasting an hour on tests that cannot pass.',
            'Chat error paths get as much attention as chat happy paths. With third party APIs, the error path IS the product half the time.',
          ],
        },
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
        mistakes: [
          'Deviating from the steps and not saying so: you clicked somewhere extra, the bug appeared, and your report describes steps that do not reproduce it. Record what you actually did, keystroke by keystroke.',
          'Testing only your own account state: a fresh account, a mid course account, and a completed account hit different code paths. One state is one third of the coverage.',
          'Softening the finding to be polite: "might be a small issue maybe" wastes everyone who reads it. State what happened plainly, kindness lives in precision, not hedging.',
        ],
        worked: {
          intro: 'Severity is the judgement call that separates professional QA from clicking around. Study the ladder a pro uses and one report where the rating was argued, not felt.',
          setup: 'The severity ladder from a real QA handbook, then the severity paragraph from one report. The rating is derived from user impact using the ladder, so any teammate would reach the same one.',
          example: `THE SEVERITY LADDER

CRITICAL  Blocks a core flow with no workaround, or loses user
          data, or leaks anything private. Ship stops.
HIGH      Core flow broken but a workaround exists, or a visible
          failure that erodes trust (wrong numbers, lost state).
MEDIUM    A feature misbehaves in edge conditions, or UX confusing
          enough to generate support questions.
LOW       Cosmetic, copy, spacing, and anything a user would not
          notice unless told.

APPLYING IT (from report BUG-021)
"Severity: HIGH, not CRITICAL. The exercise chat send button stays
disabled after an API timeout, which kills the session for that
learner. A workaround exists, refreshing the page restores the
button, but no learner would discover it unaided. It is not
CRITICAL because no data is lost and re grade recovers everything.
If the refresh workaround did not exist, this would be CRITICAL."`,
          notes: [
            'The ladder is written in terms of user impact and workarounds, never in terms of how hard the fix is. Fix effort is engineering business, severity is user business.',
            'The report argues both directions, why HIGH and why not CRITICAL. Ratings argued both ways almost never bounce in triage.',
            'The invisible workaround is called out. A workaround nobody can find barely counts as one, and the report says so honestly.',
          ],
        },
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
        mistakes: [
          'A suite that only you can run: if the preconditions live in your head, the suite retires the day you do. Every case must be runnable by someone who joined yesterday.',
          'Keeping dead tests: a case for a feature that was removed, or one that has passed 50 releases straight without ever mattering, is drag. Prune on every release.',
          'No smoke subset: when a hotfix ships in an hour you cannot run 45 cases. A marked 10 minute smoke subset is the difference between tested and hoped.',
        ],
        worked: {
          intro: 'A reusable suite is a product with an interface: a summary anyone can read, groups anyone can navigate, and a smoke subset anyone can run in ten minutes.',
          setup: 'The header block of a real regression suite plus how one feature group is organised. Notice the suite tells you its own state before you run a single test.',
          example: `REGRESSION SUITE · INSTASPACE PORTAL · v6

LAST FULL RUN: July 12 against commit 79626e8
RESULT: 41 pass · 2 fail · 2 blocked · pass rate 91 percent
GATE: launch candidates need 95 percent and zero critical fails
SMOKE SUBSET: the 8 cases marked [S], runtime about 10 minutes

OPEN FAILS
BUG-014 progress on Safari refresh (HIGH, owner Junaid)
BUG-021 chat send after timeout (HIGH, owner Junaid)

GROUP: AUTH AND SESSION (10 cases)
[S] LOGIN-01 valid sign in                       last: PASS
[S] LOGIN-02 wrong password shows generic error  last: PASS
    LOGIN-03 empty fields blocked                last: PASS
    LOGIN-07 session expiry mid exercise         last: PASS
    ...
Retired this version: LOGIN-05 (remember me box removed in v5,
  test deleted, noted here for one version then gone)`,
          notes: [
            'The header answers the three questions any teammate asks: when did this last run, what failed, and what is the bar. Nobody has to scroll to learn the state.',
            'The [S] smoke marks turn one suite into two: the full regression and the ten minute hotfix check. One artefact, two speeds.',
            'Retired tests are logged for one version before deletion, so nobody hunts for a case that intentionally disappeared.',
          ],
        },
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
        mistakes: [
          'Auditing what tools can see instead of what matters: a perfect Lighthouse score on a page nobody searches for is a vanity metric. Start from the queries, then audit the pages that should answer them.',
          'Recommending schema before crawlability: structured data on pages the crawler cannot reach or render is decoration. Fix rendering and internal links first, schema second.',
          'A single page app blind spot: content rendered only by JavaScript may be invisible to crawlers. For a Babel in browser portal, this is finding number one, not a footnote.',
        ],
        worked: {
          intro: 'Technical audits earn trust by finding the one structural issue that explains ten symptoms. Study how a pro writes up exactly that kind of finding.',
          setup: 'The lead finding from a technical audit of this very kind of portal, a client rendered single page app. One root cause, its symptoms, and a staged fix.',
          example: `TECHNICAL AUDIT · LEAD FINDING

FINDING 01 · The portal is invisible to crawlers (root cause)
Evidence: fetching any page with JavaScript disabled returns an
  empty <div id="root"> and three script tags. The crawler sees
  no headings, no text, no links.
Symptoms this one issue explains:
  - zero indexed pages beyond the homepage
  - no lesson page appears for any content query
  - social shares show no preview text
Staged fix, cheapest first:
  1. This week: add static <title>, meta description, and open
     graph tags per route to index.html templates
  2. This sprint: pre render the public marketing pages to plain
     HTML, keep the app behind login as is
  3. This quarter: evaluate server rendering only if public
     content pages become a growth channel
What NOT to do: do not server render the authenticated portal,
  it is behind login and crawlers will never see it anyway.`,
          notes: [
            'One root cause is traced to three visible symptoms. Reports that treat each symptom separately produce three tickets that fix nothing.',
            'The fix is staged by cost with a calendar word on each stage. "Pre render everything" would be correct and would never ship.',
            'The what not to do line saves the team from the expensive over correction, which is half the value of an expert audit.',
          ],
        },
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
        mistakes: [
          'Strategy without sequencing: listing technical fixes, content, and links as three parallel streams ignores that they compound in order. Crawlability first, content second, links to content that exists.',
          'Keyword targets you cannot win in 90 days: a new portal will not outrank established players for "AI learning platform" by October. Pick winnable long tail queries first and say so.',
          'No monthly checkpoint that can change the plan: a 90 day strategy reviewed only at day 90 is a 90 day guess. Each month ends with a decision, continue, adjust, or kill.',
        ],
        worked: {
          intro: 'A strategy document is a sequence of bets with checkpoints. Study month one of a real 90 day plan and the checkpoint that ends it.',
          setup: 'Month one from a 90 day SEO strategy for the portal. Notice everything ships in dependency order and the month ends with a measurable gate, not a vibe check.',
          example: `90 DAY SEO STRATEGY · MONTH 1 · FOUNDATIONS

Bet: the portal cannot rank for anything until crawlers can read
it, so month one buys visibility, not rankings.

Week 1  Static meta and open graph tags on all public routes
Week 1  XML sitemap and robots.txt shipped
Week 2  Pre render the 4 public pages (home, tracks, about, verify)
Week 2  Search Console verified, baseline recorded: 1 page indexed
Week 3  Keyword map, 20 long tail queries we can win, for example
        "learn claude ai for seo work" not "ai learning platform"
Week 4  First two content pieces drafted against that map

MONTH 1 CHECKPOINT (day 30)
Gate: 4 or more public pages indexed, zero crawl errors
If met: month 2 proceeds, content and internal linking
If not met: STOP. Month 2 becomes diagnosis, publishing content
  onto an unindexable site is burning the budget.

Measurement rhythm: indexed pages weekly, impressions weekly,
one ranked query by day 60, first organic signup by day 90.`,
          notes: [
            'The bet is stated in one sentence, so anyone reading month one knows what it is buying and why rankings are not promised yet.',
            'The keyword example shows the discipline: a query the portal can actually win this quarter, with the vanity query explicitly rejected.',
            'The checkpoint has a stop condition. Strategies that can only ever say continue are reports, not strategies.',
          ],
        },
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

  'webapp-portal': {
    id: 'WPM001', dept: 'webapp-portal', title: 'Master the InstaSpace Webapp and Learning Portal', level: 'Beginner', days: 5, instructor: 'Talha Asif',
    summary: 'A hands on tour of the two products you will live inside: the InstaSpace webapp and this Learning Portal. Learn the surfaces, the flows, the roles, and the QA habits that keep them honest, and finish with a report leadership can act on.',
    objectives: [
      'Know every surface of the InstaSpace webapp and who each one is for',
      'Walk the booking, hosting, wallet, and trust flows end to end',
      'Ship a QA report on both products with a real, prioritised bug list',
    ],
    lessons: [
      {
        id: 'WPM001L01', n: 1, title: 'Tour the InstaSpace Webapp', mins: 120, difficulty: 'Novice', status: 'active',
        concept: 'You cannot QA what you do not know. Day one is a guided tour of the InstaSpace webapp: the guest side, the host side, the property manager portal, the admin console, and the trust surfaces (KYC, disputes, GovShield). Open each one, map who it serves, and write down what it lets that person do in one line. By the end you should be able to draw the app on a napkin from memory.',
        keyConcepts: [
          'The webapp has four audiences: guests booking a stay, hosts renting out property, property managers running many units, and internal admins keeping trust intact.',
          'Every surface exists to make one of those four either faster or safer. If a screen does not do either, it is a candidate for a cleanup ticket.',
          'The trust surfaces (KYC/InstaPass, GovShield, disputes, AI-Auditor) are what separates InstaSpace from a plain listings site. Learn to spot them.',
        ],
        videoLabel: 'Lesson walkthrough',
        mistakes: [
          'Touring as a user instead of a mapper: clicking around for an hour feels productive and produces nothing. The map is built one row at a time WHILE you tour, or it never gets built.',
          'Describing surfaces by their looks: "the page with the cards" will mean nothing in a week. Name surfaces by their job, search results, checkout, payout list.',
          'Skipping the admin side: the surfaces guests never see, KYC queues, dispute mediation, are where the trust product actually lives. A map without them is half a map.',
        ],
        worked: {
          intro: 'Before you map the app yourself, study how a senior product person does it. The difference is never effort, it is structure: one row per surface, one job per row, and an improvement note specific enough to file as a ticket.',
          setup: 'A senior PM toured the guest side for twenty minutes and produced the rows below. Notice that every row names a real surface, a single job, the trust module involved, and a could be better note that an engineer could act on tomorrow.',
          example: `PRODUCT MAP · GUEST SIDE (excerpt)

| Surface        | Audience | The one job it does            | Trust module        | Could be better                                      |
| Search results | Guest    | Find a stay by area and dates  | AI-Auditor badges   | Filters reset after back navigation, guests re-enter dates |
| Listing page   | Guest    | Decide and book one property   | GovShield badge     | Gallery loads all images at once, slow on 4G          |
| Checkout       | Guest    | Pay in AED, card or wallet     | InstaWallet         | No line item price breakdown until the final step      |
| Bookings list  | Guest    | Manage upcoming stays          | none                | Cancelled stays mix with upcoming, needs a filter      |
| Dispute centre | Guest    | Escalate a stay gone wrong     | Disputes + wallet   | No indication of expected resolution time              |`,
          notes: [
            'Every "could be better" note names the surface, the symptom, and who it hurts. "Gallery is slow" would die in a backlog, "loads all images at once, slow on 4G" gets fixed.',
            'The one job column is a single phrase. If you need "and" to describe a surface, you have found either two surfaces or a design problem, both worth noting.',
            'Trust modules are named precisely (GovShield, not "verification stuff"). Leadership reads this map too, and precision is what makes it reusable.',
          ],
        },
        practice: {
          title: 'Map the InstaSpace Webapp', mins: 45, difficulty: 'Beginner',
          brief: 'Use the prompt below in your live Claude session to turn your first hands on tour of the app into a structured product map you and the team can reuse.',
          promptTemplate: 'I am touring the InstaSpace webapp for the first time as a new specialist. InstaSpace is a short term rental trust platform for the UAE (Dubai) and the Maldives. It has four audiences: guests, hosts, property managers, and admins. Trust modules include InstaPass (identity verification), GovShield (right to rent), AI-Auditor (listing authenticity), InstaWallet (payouts and pay from wallet), Disputes (resolution centre), and AI-Yield (host price suggestions).\n\nHelp me turn my tour into a Product Map document. Ask me a short set of questions about each audience, one at a time. For each answer I give, add a row to a table with these columns: surface name, audience, the one job it does, the trust module it touches (if any), and one thing I noticed that could be better.\n\nStart by asking me to name the first three guest side surfaces I opened.',
          task: [
            'Open the InstaSpace webapp on localhost or the live URL',
            'Sign in as a guest first, walk the search and booking flow, and answer Claude\'s questions',
            'Repeat for host, property manager, and admin surfaces',
            'Save the finished Product Map as your reference for the rest of the week',
          ],
          success: [
            'A single Product Map table covering all four audiences',
            'Every row names the surface, the job, and any trust module it touches',
            'At least three concrete "could be better" notes to feed into QA later',
          ],
          reward: { badge: 'Product Cartographer', note: 'You mapped the entire InstaSpace webapp in one pass. That map is the foundation for every test and every teach back you will do this week.' },
        },
      },

      {
        id: 'WPM001L02', n: 2, title: 'Walk the Money Flows: Booking, Wallet, Payouts', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'Money is where trust either holds or breaks. Day two walks the flows that move money through the platform: a guest books, funds land in escrow, the stay completes, InstaWallet pays the host, the guest earns loyalty coins, or a dispute rewrites the ending. Do each flow twice, once as the happy path and once trying to break it, and write down where you had to guess what would happen next.',
        keyConcepts: [
          'Booking is a chain: search, availability, price (including AI-Yield suggestion for hosts), payment, escrow, host payout on completion, wallet credit for the guest.',
          'InstaWallet plugs in at two places: hosts get paid out on completion, and guests can pay from their wallet balance at checkout. Both need to be tested.',
          'A dispute is a booking that ended sideways. The resolution centre must produce a real wallet refund, not just a status change.',
        ],
        videoLabel: 'Lesson walkthrough',
        mistakes: [
          'Testing money with one account: payouts, refunds, and wallet balances involve two parties. Testing only the guest side means the host side failures, the expensive ones, go unseen.',
          'Assuming the happy path completed: "I paid and it said confirmed" is not the end of the flow. Did escrow show HELD, did the payout land, did the coins credit. Follow the money to its final resting place.',
          'Writing severities without a rule: money bugs are never minor. If a dirham can be lost, duplicated, or orphaned, the floor is major, and blocker if there is no workaround.',
        ],
        worked: {
          intro: 'A money flow test sheet lives or dies on the observed result column. Anyone can write what should happen. A tester writes down what actually happened, and scores the gap.',
          setup: 'A QA engineer walked one booking end to end and logged every step as JSON. Study the third row: the expected and observed results differ, so it carries a severity and a one line fix idea. That row is the whole craft.',
          example: `MONEY FLOW TEST SHEET (three rows of twelve)

{"step":"Guest pays at checkout","actor":"guest",
 "expected":"AED total charged once, booking confirmed, funds held in escrow",
 "observed":"Charged once, booking confirmed, escrow status shown as HELD",
 "severity":null,"fix":null}

{"step":"Stay completes","actor":"system",
 "expected":"Booking flips to completed within the hour after checkout time",
 "observed":"Flipped to completed as expected",
 "severity":null,"fix":null}

{"step":"Host payout lands","actor":"host",
 "expected":"Payout appears in InstaWallet with the booking reference attached",
 "observed":"Payout arrived but shows no booking reference, host cannot tell which stay paid",
 "severity":"major",
 "fix":"Attach booking id to the wallet transaction record and show it in the payout row"}`,
          notes: [
            'Rows where expected equals observed carry null severity. Do not invent problems, a clean pass is real information too.',
            'The failing row names who it hurts (the host cannot reconcile) and a fix scoped to one change. That is a ticket, not a complaint.',
            'Severity words are fixed: blocker, major, minor. A shared vocabulary is what lets leadership rank fifty findings in one pass.',
          ],
        },
        practice: {
          title: 'Run the End to End Money Flow', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to convert your live walkthrough into a step by step flow document, with an expected result for every step and a note wherever the app surprised you.',
          promptTemplate: 'I am QA testing InstaSpace, a short term rental trust platform. I need to walk the full money flow from a guest booking to a host payout, then again through a dispute path.\n\nHelp me build a Money Flow Test Sheet. Ask me for each step in order (guest search, availability, price shown, payment, escrow confirmation, stay completion, host payout via InstaWallet, guest loyalty coins, dispute path).\n\nFor each step I describe, output a JSON row: {step, actor, expected result, observed result, severity if it differs (blocker, major, minor), and a one line fix idea}. At the end, produce a ranked bug list from the rows I flagged.\n\nStart by asking me what happens on the search screen for a Dubai Marina stay next weekend.',
          task: [
            'Book a test stay end to end using a seeded test guest account',
            'Complete the stay (or simulate it) and confirm the host payout arrives in InstaWallet',
            'Open a dispute on a second test booking and confirm the refund lands in the wallet',
            'Feed each observed step back to Claude and keep the JSON rows for lesson 4',
          ],
          success: [
            'Every step of the booking, payout, and dispute flow has an expected and an observed result',
            'Any difference is scored blocker, major, or minor with a one line fix idea',
            'You can name the single riskiest gap you found in the money flow',
          ],
          reward: { badge: 'Flow Auditor', note: 'You walked the money flow twice, once for trust and once trying to break it. That is the difference between clicking around and testing a product.' },
        },
      },

      {
        id: 'WPM001L03', n: 3, title: 'Inside the Learning Portal', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'This portal is a real product too, not just a slide deck with a login. Day three opens the hood: a React SPA loaded with Babel standalone on port 8000, an Express plus SQLite backend on port 3001, a Claude proxy at POST /api/chat, and content that either comes from a built in data.jsx or from Airtable when configured. Sign in as your intern account, then as a leadership account, and see how the same code branches to two different dashboards.',
        keyConcepts: [
          'Two servers in dev: frontend static server on 8000, Express API on 3001. In production the API serves the frontend on one port.',
          'Content model: COURSES keyed by track id, each with lessons, each with a practice block. Airtable hydrates on boot if configured, otherwise the built in data ships.',
          'Auth uses scrypt hashed passwords and bearer tokens in SQLite. First login forces a password change. Interns land on a specialty track, leadership lands on the overview.',
        ],
        videoLabel: 'Lesson walkthrough',
        mistakes: [
          'Documenting what the code says instead of what it means: listing every file is an index, not an architecture note. The note explains the three decisions that shape everything else.',
          'Writing for yourself: you know what a bearer token is today. The intern joining next month may not. Every term either explains itself or earns a one line explanation.',
          'No reading order: "here are the important files" without a sequence sends the newcomer to the hardest file first. Rank the reading list and say why each file is on it.',
        ],
        worked: {
          intro: 'An architecture note is judged by one test: can a new intern read it in ten minutes and not ask you anything obvious afterwards. Study the excerpt below, then hold your own note to the same bar.',
          setup: 'This is the opening of a real one page architecture note for this portal, written for someone joining next month. Notice it explains in plain sentences, names exact files, and never assumes the reader knows the stack.',
          example: `HOW THE LEARNING PORTAL WORKS (excerpt)

The portal is two programs. A tiny static server (frontend/serve.js) hands
the browser index.html on port 8000, and an Express API (backend/server.js)
answers on port 3001. In production one Node service does both jobs.

The frontend has no build step. index.html loads React and Babel from a CDN,
then loads each portal/*.jsx file as a script that Babel compiles in the
browser. Every file shares one global scope, which is why components hang
off window instead of using imports.

When you sign in, the API checks your password against a salted scrypt hash
in SQLite and hands back a bearer token. The frontend keeps it in
localStorage and sends it on every request. Your track (for example
webapp-portal) picks which course object from data.jsx becomes your world.

Three files to read first:
1. frontend/portal/app.jsx, the routing brain, every screen hangs off it
2. frontend/portal/data.jsx, every course, lesson, and exercise as data
3. backend/server.js, every endpoint, table, and the Claude proxies`,
          notes: [
            'Every paragraph answers one question a newcomer would actually ask, in the order they would ask them: what runs, how does it load, how do I get in.',
            'File paths are exact and the reading list is ranked with a reason. "Look at the code" is not an onboarding doc.',
            'No jargon without a payoff. "Babel compiles in the browser" is immediately followed by the consequence that matters, one shared global scope.',
          ],
        },
        practice: {
          title: 'Reverse Engineer the Portal', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to turn a walk through the portal codebase into a plain English architecture note a new hire could read in ten minutes.',
          promptTemplate: 'I am learning how the InstaSpace Learning Portal works from the inside. The stack is: React 18 loaded via Babel standalone, a tiny static frontend server (frontend/serve.js) on port 8000, an Express API (backend/server.js) on port 3001, SQLite for users, sessions, progress, and chat history, optional Airtable content hydration, and a Claude proxy at POST /api/chat.\n\nHelp me write a one page architecture note for a new intern joining next month. Ask me questions in order about: the frontend load order, how a user signs in, how the current specialty track picks the course, how a lesson\'s practice block becomes the exercise chat, and how progress is persisted for the leadership dashboard.\n\nFor each answer, add a paragraph to the note in clear, no dashes prose. At the end, list three files a new intern should read first and why.',
          task: [
            'Read frontend/index.html, frontend/portal/app.jsx, frontend/portal/data.jsx, backend/server.js in that order',
            'Sign in once as an intern account and once as a leadership account, watch the different routes',
            'Answer Claude\'s questions with what you actually see, not what you assume',
            'Save the finished architecture note as your onboarding doc for the next specialist',
          ],
          success: [
            'A one page architecture note covering frontend, backend, auth, content, and progress',
            'Three named files a new intern should read first, each with a reason',
            'Zero dashes as punctuation, InstaSpace voice held throughout',
          ],
          reward: { badge: 'Portal Insider', note: 'You can now explain the Learning Portal to a new hire without looking anything up. That is the level of ownership this team needs.' },
        },
      },

      {
        id: 'WPM001L04', n: 4, title: 'Testing Both Products End to End', mins: 120, difficulty: 'Intermediate', status: 'locked',
        concept: 'You have the map (day 1), the money flow bug list (day 2), and the portal architecture (day 3). Day four turns all three into a single test suite that covers both products. Think in inputs and outcomes: what a guest, host, PM, admin, intern, and leadership user each try to do, what should happen, and what does happen. The test suite goes to engineering; the report goes to leadership.',
        keyConcepts: [
          'One suite, two products, six actor types. Do not mix them into one column; every case names its actor.',
          'Every case has an id, a precondition, steps, an expected result, an observed result, and a priority.',
          'A test without an expected result is a note, not a test, and a test without an observed result has not run yet.',
        ],
        videoLabel: 'Lesson walkthrough',
        mistakes: [
          'One giant suite with no actor column: when a case fails, the first question is always whose experience broke. A suite that cannot answer that by sorting one column slows every triage.',
          'Priorities by gut: money and trust cases are P1 by rule, not by feel. A written priority rule is what keeps two testers from rating the same case P1 and P3.',
          'Testing the systems only when they work: the portal grading an honest fail, the webapp rejecting a double booking, systems saying NO correctly is half the suite.',
        ],
        worked: {
          intro: 'A test case is a contract: given this setup, when I do these steps, exactly this must happen. Study the three cases below, one happy path, one edge, one that crosses products, then write yours to the same shape.',
          setup: 'Three cases from a real cross product suite. Notice the precondition (the world before the test), numbered steps a stranger could follow, one unambiguous expected result, and honest priority. The money touching case is P1 by rule, not by mood.',
          example: `CROSS PRODUCT TEST SUITE (three cases of twenty)

{"id":"WA-BOOK-01","actor":"guest","product":"webapp","surface":"checkout",
 "precondition":"Signed in guest, listing available for the chosen dates",
 "steps":["Pick two nights next month","Enter two guests","Pay with a valid card"],
 "expected":"Booking confirmed, AED total matches the listing price times nights plus fees, escrow shows HELD",
 "priority":"P1","is_edge":false}

{"id":"WA-BOOK-07","actor":"guest","product":"webapp","surface":"checkout",
 "precondition":"Two signed in guests, the SAME last available room in separate browsers",
 "steps":["Both reach payment for identical dates","Both confirm within five seconds"],
 "expected":"Exactly one booking succeeds, the other gets a clear availability error and no charge",
 "priority":"P1","is_edge":true}

{"id":"PT-EX-03","actor":"intern learner","product":"portal","surface":"exercise chat",
 "precondition":"Intern signed in, exercise open, two chat turns sent",
 "steps":["Type only the word ok","Press Submit for grading"],
 "expected":"Grader fails the submission with per criterion reasons, lesson does NOT advance",
 "priority":"P2","is_edge":true}`,
          notes: [
            'The precondition is what most beginners skip and it is why their bugs cannot be reproduced. State the world before step one.',
            'WA-BOOK-07 is the race condition, the last room double booking. Edges like this are where real products break, one happy path plus nine edges is the right ratio.',
            'PT-EX-03 tests this portal itself, and its expected result is that lazy work FAILS. Testing that the system rejects bad input matters as much as accepting good input.',
          ],
        },
        practice: {
          title: 'Build the Cross Product Test Suite', mins: 45, difficulty: 'Intermediate',
          brief: 'Use the prompt below to convert everything from day 1 to 3 into a structured test suite Claude can help you keep consistent.',
          promptTemplate: 'I am QA lead intern for InstaSpace. I need one test suite that covers both the InstaSpace webapp and this Learning Portal.\n\nThe actors are: guest, host, property manager, admin, intern learner, and leadership viewer. The webapp surfaces to cover include search, listing, booking, InstaWallet, disputes, KYC/InstaPass, GovShield, and admin queues. The portal surfaces to cover include login, forced password change, intern dashboard, lesson view, live Claude exercise chat, progress screen, and leadership overview.\n\nGenerate at least 20 test cases as strict JSON. Each case has: id, actor, product (webapp or portal), surface, precondition, steps as an array, expected result, priority (P0 to P3), and a boolean is_edge. Cover the happy path and the edges. Mark every case that touches money or trust as at least P1.\n\nReturn ONLY the JSON array.',
          task: [
            'Run the prompt and get at least 20 cases back as JSON',
            'Execute the P0 and P1 cases against your local webapp and this portal',
            'Log the observed result for each and mark any failures with severity',
            'Keep the completed suite for the capstone report tomorrow',
          ],
          success: [
            'At least 20 cases, split across both products and all six actors',
            'Every case has expected and observed results and a priority',
            'All money and trust cases are marked at least P1',
          ],
          reward: { badge: 'Suite Builder', note: 'You built one test suite that spans two products and six actors. That is a QA lead moving with real leverage.' },
        },
      },

      {
        id: 'WPM001L05', n: 5, title: 'Capstone: Ship the Product Report', mins: 120, difficulty: 'Advanced', status: 'locked',
        concept: 'Day five is the capstone. Consolidate the Product Map, the Money Flow Test Sheet, the Portal Architecture note, and the Cross Product Test Suite into one Product Report leadership can act on this week. Executive summary at the top, ranked bug list in the middle, thirty day fix plan at the end. Ship it to Talha.',
        keyConcepts: [
          'A capstone report leads with the top three risks in plain English, before any table.',
          'A ranked bug list names the actor, the product, the severity, and a one line fix.',
          'A thirty day fix plan groups fixes into week one (blockers), week two (majors), weeks three and four (polish and prevention).',
        ],
        videoLabel: 'Capstone walkthrough',
        mistakes: [
          'Reporting everything you did: the week produced four artefacts, the report is not their sum. Leadership needs the three risks, the ranked list, and the plan, everything else is appendix.',
          'Bugs without victims: "gallery loads slowly" ranks below "a host cannot tell which stay paid them" even if the gallery bug is technically harder. Rank by who bleeds, not by engineering interest.',
          'A plan without a week one: thirty day plans that start "eventually" never start. Week one has names, dates, and the two fixes that matter most.',
        ],
        worked: {
          intro: 'Leadership reads the first six lines of a report and decides whether to read the rest. Study how this executive summary earns the next page, then hold your capstone to it.',
          setup: 'The opening of a product report the CEO actually acted on. Three risks, each in plain English, each with the evidence and the cost of ignoring it. No table yet, no jargon, no throat clearing.',
          example: `INSTASPACE PRODUCT REPORT (executive summary excerpt)

The three risks that matter this week:

1. Hosts cannot reconcile payouts. Wallet transactions arrive without a
   booking reference, so a host with five stays cannot tell which one paid.
   Every support ticket this causes erodes the exact trust we sell.
   Fix is one field on the transaction record. Week one.

2. The last room can double book. Two guests confirming the same final
   night within seconds both succeed in testing. One of them arrives to an
   occupied apartment. This is a refund, a review, and a story they tell.
   Needs a availability lock at payment. Week one.

3. New PM imports fail silently on bad rows. A property manager importing
   forty listings loses three to formatting errors with no message saying
   which three or why. They discover it when a guest asks about a missing
   unit. Week two.

Everything else found this week is ranked in the table below. None of it
is a launch blocker. The thirty day plan puts the two week one items first
because both touch money and trust, the two things we cannot ask anyone to
be patient about.`,
          notes: [
            'Each risk is a story with a victim, not a bug id. "A host with five stays cannot tell which one paid" makes an executive feel the problem in one sentence.',
            'Every risk ends with the size of the fix and a week. A risk without a next step is anxiety, a risk with one is a plan.',
            'The summary tells leadership what is NOT urgent too. Saying "none of it is a launch blocker" is what makes the two week one calls credible.',
          ],
        },
        practice: {
          title: 'Ship the InstaSpace Product Report', mins: 60, difficulty: 'Advanced', capstone: true,
          brief: 'This is your capstone. Use the prompt below to consolidate the week into one report Talha can hand to the CEO on Monday.',
          promptTemplate: 'I have four artefacts from this week for InstaSpace: 1) a Product Map of every webapp surface by audience, 2) a Money Flow Test Sheet with a ranked bug list, 3) a Learning Portal Architecture note, and 4) a Cross Product Test Suite of 20+ cases with observed results.\n\nConsolidate them into a single InstaSpace Product Report for leadership. Include:\n1. An executive summary naming the top three risks in plain English\n2. A ranked bug list (actor, product, severity, one line fix)\n3. A thirty day fix plan split into week one blockers, week two majors, weeks three and four polish\n4. A short note on the Learning Portal itself, what works and what would help the next intern cohort\n5. A one paragraph recommendation on the single next thing to build\n\nWrite it in the InstaSpace voice, confident, precise, quietly premium, no hype and no dashes as punctuation. Format it as a clean two to three page report for Talha, Osman, and Jybran.',
          task: [
            'Run the capstone prompt and produce the first draft of the report',
            'Cross check every bug in the report against your actual test suite results',
            'Tighten the executive summary until anyone on leadership could read it in one minute',
            'Ship the finished report to Talha and mark this course complete',
          ],
          success: [
            'A two to three page report with an executive summary and a thirty day plan',
            'A ranked bug list where every row names actor, product, severity, and a fix',
            'A recommendation on the single next thing to build',
          ],
          reward: { badge: 'Product Report Author', note: 'You shipped a Product Report leadership can act on this week. That is the kind of work that turns an intern into a specialist.' },
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
        mistakes: [
          'Scoring on wealth alone: a 500M portfolio with zero cross border experience converts slower than an 80M portfolio with three international deals. Behaviour beats balance sheet.',
          'Treating both markets as one: a rubric tuned for Dubai speed misreads every Maldives lead, where the cycle is longer and verification is the hook. One rubric per market.',
          'Scores without reasons: a 9 with no reason string cannot be defended in standup and cannot be improved next month. The reason is the product, the number is the summary.',
        ],
        worked: {
          intro: 'Study one scored lead from a professional scoring run before you build your own rubric. The score is almost the least interesting part of the row.',
          setup: 'One investor from a real scoring output. Notice the two separate dimensions, the reason citing specific profile signals, and the action that turns a score into tomorrow morning work.',
          example: `SCORED LEAD (one of fifty)

{"name":"R. Patel","portfolio_m":450,"source":"partner referral",
 "background":"legal","cross_border_deals":3,

 "fintech_readiness":9,
 "readiness_reason":"Large portfolio with 70 percent held offshore,
   legal background means escrow terms will not scare him, and he
   has settled cross border before, the exact user Phase 2 exists for",

 "time_to_conversion":8,
 "conversion_reason":"Partner referral plus prior UAE deals is the
   fastest converting combination in the launch cohort, expect two
   to three weeks",

 "next_action":"Send the escrow walkthrough today and offer a 20
   minute settlement demo this week, do NOT start with the lifestyle
   deck, he buys certainty, not views"}`,
          notes: [
            'Two dimensions, not one blended number. A lead can be a 9 on readiness and a 3 on speed, and the outreach differs completely for each combination.',
            'Every reason cites profile fields by name. When the ranking looks wrong, you can see exactly which signal misled the score and fix the rubric.',
            'The next action includes a do not. Knowing which pitch would lose this lead is worth as much as knowing which one wins him.',
          ],
        },
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
        mistakes: [
          'Adding examples that all look alike: three high examples with big portfolios teach the model one thing three times. The teaching power is in the contrasts, especially the deceptive middle cases.',
          'Refining without a fixed test set: if you change the prompt AND the leads every round, you cannot tell whether the prompt improved. Freeze twenty leads as your benchmark and score the prompt against them.',
          'Chasing 100 percent agreement: if the model agrees with you completely, it has learned your biases too. The disagreements you cannot explain are the ones worth investigating, sometimes the model is right.',
        ],
        worked: {
          intro: 'Prompt refinement is an experiment, not a vibe. Study one round from a real refinement log: hypothesis, change, measured result.',
          setup: 'Round two of three from a scoring prompt iteration log. The team froze twenty hand ranked leads as ground truth, so every prompt version gets a hard number.',
          example: `REFINEMENT LOG · ROUND 2 OF 3

Benchmark: 20 leads hand ranked by the growth lead, frozen
Round 1 result: 12 of 20 in the right band (60 percent)

Diagnosis of the 8 misses:
  6 were organic signups with mid portfolios that the prompt
  scored 7 to 8, humans scored 4 to 5. The prompt is treating
  portfolio size as the dominant signal.

Hypothesis: adding one deceptive middle example, big portfolio
  but weak behavioural signals, will teach the separation.

Change (added to prompt):
  "Example of a MEDIUM score that looks HIGH: Omar S., portfolio
   210M, but organic signup, no cross border history, no legal or
   accounting background. Score 5. A large domestic portfolio
   without cross border behaviour is a browser, not a buyer."

Round 2 result: 17 of 20 in the right band (85 percent)
Remaining misses: 3 edge cases, logged for round 3.
Decision: ship this version, round 3 after the Maldives cohort.`,
          notes: [
            'The benchmark is frozen before refinement starts. Without it, "the ranking looks better now" is an opinion wearing a lab coat.',
            'The added example is deceptive on purpose, it looks high and scores medium. Deceptive cases teach separations, obvious cases teach nothing.',
            'The log ships at 85 percent with known misses instead of chasing perfect. A shipped 85 beats an unshipped 95, and the next cohort provides round 3 for free.',
          ],
        },
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
        mistakes: [
          'Personalising the name and nothing else: "Hi Rajesh" followed by the same email everyone gets is worse than no personalisation, it advertises the automation. Personalise the problem, not the greeting.',
          'Five asks in five emails: each email that asks for a meeting resets the trust clock. The first three emails give, the fourth asks, the fifth closes with urgency. That is the give ask ratio.',
          'Fake urgency: "spots filling fast" for a product with no capacity limit poisons the whole sequence when the investor finds out. Real deadlines only, or no deadline.',
        ],
        worked: {
          intro: 'Study the first email of a sequence written for one specific segment, then notice how everything, the hook, the proof, the ask, derives from that segment definition.',
          setup: 'Email 1 of 5 for the segment "high readiness legal background investors from partner referrals". Compare every line against the segment and watch nothing generic survive.',
          example: `SEGMENT: High readiness, legal or accounting background,
  partner referred, Dubai launch cohort
PAIN POINT: they have done cross border deals and remember
  exactly where the six weeks went

EMAIL 1 OF 5 · DAY 0

Subject: The six weeks you lost on your last cross border deal

Rajesh,

You have closed deals across borders before, which means you know
where the time actually goes. Not the decision, the settlement:
correspondent banks, compliance queues, and paperwork that repeats
itself in two jurisdictions.

We built InstaSpace to remove exactly that layer. Escrow and
settlement run inside the platform, verified end to end, and a
deal that took six weeks closes in two. The fee is 1.5 percent,
against the 6.4 percent average you have likely paid.

Amir at Meridian Capital suggested you would want to see the
escrow flow itself rather than a deck. Here is a three minute
walkthrough: [link]

No reply needed. Email 2 on Thursday shows the numbers from our
first forty Dubai settlements.

Layla Al Marri · InstaSpace`,
          notes: [
            'The subject assumes expertise instead of explaining basics, which is itself a compliment to this segment. The same subject would confuse a first time buyer.',
            'The referral is used by name in the body, not the subject. Name dropping in subjects reads as spam, in the body it reads as context.',
            '"No reply needed" plus a preview of email 2 removes all pressure while guaranteeing the open. Sequences that telegraph their next step train the reader to keep reading.',
          ],
        },
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
        mistakes: [
          'Measuring opens instead of outcomes: open rate proves the subject line worked, nothing more. The score is judged on conversion accuracy, the sequence on demos booked and deals closed.',
          'Sample sizes too small to mean anything: eight sends per segment cannot separate a good sequence from a lucky one. Below thirty sends, report direction, never percentages.',
          'Iterating everything at once: changing the score AND the sequence AND the timing in one cycle means the improvement, if any, cannot be attributed. One change per cycle per asset.',
        ],
        worked: {
          intro: 'A measurement plan earns its keep when a number comes back wrong. Study how a pro pre commits to what wrong means and what happens next.',
          setup: 'The metrics table and one failure mode card from a real four week plan. Every metric has a target, a floor, and an owner, and the failure mode was written BEFORE the campaign ran.',
          example: `MEASUREMENT PLAN · METRICS TABLE

| Metric                  | Target | Floor | Owner  | Read on |
| Score accuracy (top 15) | 75%    | 55%   | Layla  | Day 14  |
| Open rate (high seg)    | 40%    | 25%   | Mesum  | Day 7   |
| Reply rate (high seg)   | 12%    | 5%    | Mesum  | Day 14  |
| Demos booked            | 6      | 2     | Layla  | Day 21  |
Floor rule: any metric under its floor at read time triggers the
matching failure mode card, no waiting for the cycle to end.

FAILURE MODE CARD F2 (pre written)
Signal: high segment opens fine but replies under 5 percent
Likely cause: the pitch is right, the ask is wrong, demo feels
  too heavy for a first conversation
Check: re read replies received, are any asking lighter questions
Fix: swap email 4 ask from "20 minute demo" to "3 minute recorded
  walkthrough", rerun on the next 20 leads only
Not the fix: rewriting the whole sequence, the opens prove the
  hook works, do not burn what is working`,
          notes: [
            'Targets come with floors. A target is what success looks like, a floor is where you stop and intervene, and the two jobs are different.',
            'The failure mode card was written before launch, when heads were cold. Diagnosis written during a miss inherits the panic of the miss.',
            'The fix is scoped to the next 20 leads, not the whole list. Small reversible fixes are how you iterate without gambling the cohort.',
          ],
        },
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
        mistakes: [
          'Documenting the how without the when not: an asset used in the wrong situation produces confident garbage. The "do not use this for" section prevents more damage than the instructions section.',
          'Shipping without a worked sample: instructions plus a real input and its real output is what makes an asset runnable by a stranger. Instructions alone get abandoned on first ambiguity.',
          'Claiming accuracy you have not measured: "highly accurate" is marketing, "85 percent on a 20 lead benchmark, tested July 2026" is engineering. The team will trust the asset exactly as much as its honesty deserves.',
        ],
        worked: {
          intro: 'A reusable asset is judged by a stranger test: can someone who never met you run it correctly and know when not to trust it. Study the front page of one that passes.',
          setup: 'The header sections of a real growth asset doc. Notice the honest accuracy line and the when not to use list, the two sections that separate an asset from a pasted prompt.',
          example: `GROWTH ASSET · GA-003 · INVESTOR LEAD SCORER · v2

PURPOSE (one sentence)
Ranks a raw signup list by fintech readiness and time to
conversion so the team calls the right fifteen people first.

WHEN TO USE
New cohort of 20 plus signups with portfolio, source, and
background fields populated. Dubai and Maldives rubrics included.

WHEN NOT TO USE
- Lists without a source field, referral signal drives 30 percent
  of the score, without it every score inflates
- Institutional buyers, the rubric is built for individuals
- Any market we have not launched, the conversion bands are
  measured, not universal

MEASURED ACCURACY
85 percent band agreement on a 20 lead benchmark (July 2026,
Dubai cohort). Maldives rubric unvalidated until the first
50 signups, treat its output as a draft ranking.

TO RUN IT
1. Export signups as CSV with the five required columns
2. Paste into the prompt template below at [INVESTOR DATA]
3. Sanity check: the top 3 should not surprise you, if they do,
   check the source column populated correctly
Sample input and output: appendix A (real, anonymised)`,
          notes: [
            'The when not to use list is specific enough to actually stop someone, naming the missing field and why it breaks the score.',
            'Accuracy is a number with a date and a benchmark, and the unvalidated Maldives rubric is flagged as a draft. Honesty is what makes the 85 percent believable.',
            'Step 3 builds in a sanity check. Assets that teach their users to distrust surprising output survive their own errors.',
          ],
        },
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
        mistakes: [
          'A core message that is a category, not a claim: "trust infrastructure for real estate" describes what shelf we sit on. The core message says what changes for the customer, in numbers if possible.',
          'Pillars that are adjectives: trustworthy, fast, affordable is a horoscope, it fits anyone. Pillars are claims with proof attached or they are decoration.',
          'Building the house and never using it: a message house that does not get quoted in every brief within a month was a workshop, not an asset. Every campaign asset should trace to a pillar.',
        ],
        worked: {
          intro: 'A message house works when a stranger can write on brand copy from it alone. Study one built to that bar and check every part carries proof.',
          setup: 'The InstaSpace message house as a senior strategist would build it. Notice the core message is a claim you could falsify, and every pillar carries numbers, not adjectives.',
          example: `MESSAGE HOUSE · INSTASPACE

CORE MESSAGE
A cross border property deal, settled in two weeks at 1.5 percent,
with every party verified. That is the whole promise.

PILLAR 1 · TRUST          PILLAR 2 · COST        PILLAR 3 · SPEED
AI native verification    1.5 percent all in     Two weeks to keys
of people, property,      versus the 6.4         versus the six
and right to rent         percent global         week average
                          average
Proof:                    Proof:                 Proof:
- InstaPass ID checks     - fee schedule public  - digital escrow,
- GovShield permits       - no correspondent       no bank queue
- escrow on every deal      bank chain           - 40 settlements
                                                   averaged 13 days

AUDIENCE DOORS (same house, different entrance)
Dubai investor: lead with COST and SPEED, trust is the reassurance
Maldives buyer: lead with TRUST, the stricter regime makes
  verification the purchase reason, speed is the bonus

BANNED: revolutionary, seamless, game changer, unlock, empower`,
          notes: [
            'The core message contains three verifiable facts, two weeks, 1.5 percent, verified. If legal cannot sign off every word, the message is not done.',
            'Each pillar proof names a product surface, InstaPass, GovShield, escrow. Proof that points at real features survives a skeptical reader.',
            'The audience doors reorder the same pillars instead of inventing new messages. One house, many doors is what keeps ten campaigns coherent.',
          ],
        },
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
        mistakes: [
          'Writing the headline last: teams polish body copy for hours under a headline nobody chose deliberately. Eighty percent of visitors read only the headline, spend the effort in proportion.',
          'Two calls to action: "book a demo or join the waitlist" splits intent and both numbers drop. One section, one ask, and the page can have different asks per section.',
          'Proof points that need proof: "trusted by leading investors" is a claim pretending to be evidence. A number, a name, or a mechanism, anything else is filler.',
        ],
        worked: {
          intro: 'Study a hero section rewrite with the reasoning attached to every line, then apply the same surgery to the section in your exercise.',
          setup: 'The before is real junior work: every feature named, nothing felt. The after leads with the outcome and lets three numbers do the persuading.',
          example: `BEFORE
"InstaSpace is a revolutionary platform with escrow, borderless
settlement, verification, and a seamless dashboard for global
real estate."

AFTER
Headline: Keys in two weeks, not six.
Subhead:  InstaSpace settles cross border property deals with
          escrow and verification built in, at 1.5 percent
          instead of the 6.4 percent you pay today.
Proof row:
  13 days    average settlement, last 40 Dubai deals
  1.5%       all in, published fee schedule
  100%       of parties verified, InstaPass and GovShield
CTA: See a real settlement, 3 minutes  →

THE SURGERY, LINE BY LINE
"revolutionary" deleted: claims about us, replaced by claims
  about the buyer outcome
Four features became one outcome: the features moved to the
  proof row where they justify instead of pitch
CTA sells the next 3 minutes, not the product: low commitment
  asks outconvert "get started" for high consideration purchases`,
          notes: [
            'The headline is the outcome in six words with a number. It would survive being read alone, which is exactly how most visitors read it.',
            'The proof row is where the features went to work. Features as proof convert, features as pitch scroll past.',
            'The call to action prices the click honestly, three minutes. For a product bought with this much deliberation, selling the demo beats selling the signup.',
          ],
        },
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
        mistakes: [
          'Subject lines that summarise instead of open a loop: "Our launch announcement" tells the whole story, so nobody opens it. "The fee nobody itemises" demands the click to close the loop.',
          'Educating forever and never asking: five emails of pure value with no ask is a newsletter, not a launch sequence. Email four asks, plainly, and the earlier emails earn it the right to.',
          'Ignoring the reply channel: launch emails that come from noreply@ tell the reader their questions are unwelcome. A real sender name with a monitored inbox converts questions into demos.',
        ],
        worked: {
          intro: 'A sequence is an argument delivered in instalments. Study the skeleton of a five email launch sequence, subject, job, and ask for each, before writing full drafts.',
          setup: 'The sequence plan a senior marketer writes BEFORE any email is drafted. Each email has one job and hands off to the next, and only one of the five asks for the meeting.',
          example: `LAUNCH SEQUENCE SKELETON · DUBAI WAITLIST

E1 · Day 0 · ANNOUNCE
Subject: Dubai is live. Here is what that means for your money.
Job: confirm the launch, restate the core promise in two lines
Ask: none. One link to the fee schedule for the curious.

E2 · Day 3 · THE PROBLEM PRICED
Subject: The 6.4 percent nobody itemises
Job: make the current cost concrete, a 38,000 dollar example on
  a 2M AED apartment, sourced
Ask: none. "Thursday: how escrow removes each line."

E3 · Day 6 · THE MECHANISM
Subject: Where your money actually sits during a deal
Job: walk escrow and settlement step by step, this is the trust
  email, InstaPass and GovShield by name
Ask: soft. Three minute recorded walkthrough.

E4 · Day 10 · PROOF THEN ASK
Subject: 40 settlements, 13 day average. See one.
Job: the case study, real numbers from the first cohort
Ask: THE ask. A 20 minute demo, two time slots offered.

E5 · Day 14 · CLOSE THE WINDOW
Subject: Early access closes Friday
Job: real deadline, restate the one number that matters per
  pillar, answer the top objection in one line
Ask: last call demo link. After Friday, the waitlist.`,
          notes: [
            'Each email promises the next one. Sequences with visible structure train opens, the reader knows the Thursday email completes the fee story.',
            'The ask escalates: nothing, nothing, three minutes recorded, twenty minutes live, deadline. Each yes is slightly bigger than the last, which is how strangers become bookings.',
            'The deadline in E5 is real, early access genuinely closes. One honest deadline outperforms four manufactured ones, forever.',
          ],
        },
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
        mistakes: [
          'Fourteen posts that are all announcements: by day three the audience has heard the news. The calendar rotates jobs, teach, prove, ask, entertain, and announcement is one job, used twice.',
          'Same post, both platforms: LinkedIn rewards an argument, Instagram rewards a moment. Cross posting the identical asset to both is half a calendar wearing two hats.',
          'No slot for reacting: launches generate questions, press, and unexpected moments. A calendar with every slot pre filled cannot capitalise on the best content of launch week, the live stuff.',
        ],
        worked: {
          intro: 'Study three days of a professional launch calendar, enough to see the rhythm: pillars rotate, formats vary, and every post knows its metric.',
          setup: 'Days 2 through 4 of a fourteen day calendar. Notice no format repeats on consecutive days, each platform gets native treatment, and day 4 is deliberately held open.',
          example: `LAUNCH CALENDAR · DAYS 2 TO 4 OF 14

DAY 2 · Pillar: COST · Format: stat card
IG: single image, "6.4 percent" crossed out, "1.5 percent" in
  the gradient. Caption 38 words ending "fee schedule in bio".
LI: the same claim as a 120 word post, the math on a 2M AED
  apartment, no image, let the number be the visual.
Metric: IG saves (cost content gets saved), LI comments

DAY 3 · Pillar: TRUST · Format: 30 second explainer
IG Reel: screen recording of the GovShield badge on a real
  listing, voiceover explains right to rent in plain words.
LI: native video, same footage, opening line "Most listings
  cannot prove the host is allowed to rent them."
Metric: completion rate, profile visits

DAY 4 · HELD OPEN · react slot
Planned fallback if nothing happens: founder note on why we
  publish our fee schedule (pillar COST, format text).
If press or big questions land: respond same day with a post,
  the fallback moves to day 9.
Metric: whatever the moment demands`,
          notes: [
            'Each platform gets a native version of the same pillar, not a copy. The LinkedIn cost post is an argument, the Instagram one is a visual moment.',
            'Metrics are chosen per format, saves for reference content, completion for video. One metric for everything measures nothing.',
            'The held open day is planned spontaneity. The fallback means it never posts nothing, the open slot means launch week can answer back.',
          ],
        },
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
        mistakes: [
          'A kit without a decision maker: launch week produces judgement calls, a negative comment thread, a press question. The kit names who decides what in an hour, or every call escalates to the founder.',
          'Metrics without a baseline: "track signups" means nothing without the pre launch number next to it. Every metric in the kit records its day zero value.',
          'The Maldives guide as an afterthought: "change Dubai to Maldives" is not adaptation. The second market guide names what changes (the lead pillar, the regulation, the examples) and what never changes (the voice, the numbers discipline).',
        ],
        worked: {
          intro: 'The run guide is the page that makes a kit executable by people who did not build it. Study one written for a real launch week.',
          setup: 'The one page how to run it from a campaign kit. Note the daily rhythm, the decision rules for the predictable surprises, and the honest escalation line.',
          example: `HOW TO RUN LAUNCH WEEK (one page)

DAILY RHYTHM
09:00  Post per calendar (owner: Ayesha)
09:15  Yesterday metrics into the tracker, next to baselines
13:00  Reply pass: every comment and DM answered inside 4 hours
       using the approved FAQ, escalate anything about fees or
       regulation, do not improvise those
17:00  Evening post where scheduled, story reshares of mentions

DECISION RULES (pre agreed, do not re litigate mid week)
Negative thread with facts wrong: correct once, politely, with
  the fee schedule link, then disengage. Never twice.
Press inquiry: acknowledge inside the hour, route to Talha,
  no substantive answers in DMs.
A post underperforms by half against baseline: do not delete,
  do not repost, log it and let the calendar continue. One post
  never decides a launch.
Anything legal or a customer complaint: straight to Osman.

SUCCESS THIS WEEK MEANS
Waitlist grows 30 percent (baseline 412 on July 14)
Two press or newsletter mentions
Demo slots 60 percent booked by Friday

If none of the three is trending by Wednesday noon, we meet for
15 minutes and swap emails 4 and 5 forward. That is the only
mid week change we allow.`,
          notes: [
            'The decision rules cover the three predictable dramas of every launch, criticism, press, and a flopped post, so nobody makes those calls at 9 PM in a panic.',
            'Success is three numbers with baselines and a date, and the mid week correction is limited to one pre agreed move. Kits that allow unlimited mid week changes produce launches with no signal.',
            'The fee and regulation FAQ topics are marked never improvise. Knowing which questions are load bearing is what protects a trust brand.',
          ],
        },
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
        mistakes: [
          'Treating AI research as legal clearance: Claude maps the terrain fast, but a licensing question is closed by local counsel, not by a confident paragraph. The map tells counsel what to check, it does not replace them.',
          'Mapping only the launch permits: the settlement rules, money movement, escrow custody, foreign ownership limits, are the rules that can kill the business model, not just delay the launch.',
          'One long memo instead of a decision document: leadership needs to see what is known, what is assumed, and what is blocking, in three separate lists. Mixing them hides the risk.',
        ],
        worked: {
          intro: 'A regulatory map is a sorting exercise: known, assumed, blocking. Study how a pro keeps the three ruthlessly separate.',
          setup: 'The summary page of a Maldives regulatory map. Every line is tagged with its confidence and its source, and the one minute compliance summary is written for an investor, not a lawyer.',
          example: `REGULATORY MAP · MALDIVES ENTRY · SUMMARY

KNOWN (sourced, high confidence)
- Foreign buyers face restrictions on freehold, leasehold
  structures up to 99 years are the standard route [source:
  government land act, verified against two law firm guides]
- Tourism sector property runs under a separate regime from
  residential [source: ministry publications]

ASSUMED (probable, needs counsel sign off)
- Our escrow structure likely requires a local licensed partner
  rather than a direct licence [pattern from comparable markets,
  UNVERIFIED for Maldives]
- AML expectations follow FATF standards [typical, unverified]

BLOCKING (no launch date until closed)
B1: which authority licenses a payments plus property platform,
    two candidate regulators, counsel question 1
B2: can settlement funds be held offshore or must they sit in a
    local bank, changes our whole treasury design, counsel
    question 2

ONE MINUTE COMPLIANCE SUMMARY (investor facing, draft)
"Buying in the Maldives as a foreigner means a leasehold, and it
means trusting the structure that holds your money. InstaSpace
enters only after local licensing is confirmed, your funds sit
in regulated escrow, and every property's lease status is
verified before it lists. We publish the licence details on
every listing."`,
          notes: [
            'Assumed is its own category with the reasoning shown. The fastest way to lose leadership trust is an assumption dressed as a fact.',
            'The blocking list is short, named, and numbered, and each item maps to a specific counsel question. That is what makes the legal engagement cheap and fast.',
            'The investor summary admits the constraint, leasehold, and turns compliance into the selling point. In trust markets, honesty about rules is marketing.',
          ],
        },
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
        mistakes: [
          'Sequencing to the calendar instead of to conditions: "week 5: start paid demand" is wrong the moment supply slips. The trigger is the listing floor, the week number is just the forecast.',
          'Counting signed hosts as supply: a host who signed but has not passed verification is not bookable inventory. The floor counts verified, listable units, nothing else.',
          'One sided trust math: every week of the sequence has a host trust risk AND a guest trust risk. Plans that only track one side get blindsided by the other.',
        ],
        worked: {
          intro: 'A launch sequence is a chain of gates, not a list of weeks. Study three weeks of one and notice every phase begins with a condition, not a date.',
          setup: 'Weeks 4 to 6 from a real market entry sequence. The dates are forecasts, the gates are law. Notice week 6 simply does not fire if the week 5 gate is not met.',
          example: `LAUNCH SEQUENCE · WEEKS 4 TO 6 OF 8

WEEK 4 · SUPPLY PUSH
Enter only if: permit cleared (gate G1, week 1)
Work: onboard 60 more hosts, verification SLA 48 hours,
  GovShield review queue staffed daily
Exit gate G2: 120 verified, listable units
Trust risk this week: hosts onboarded faster than verification
  can process, mitigation: cap onboarding to queue capacity,
  a slow yes beats an unverified listing

WEEK 5 · SOFT DEMAND
Enter only if: G2 met (120 listings live)
Work: organic and referral demand only, watch search to booking
  conversion, seed 20 bookings with the partner network
Exit gate G3: search returns 3 plus relevant results in every
  launch district AND first 10 stays complete without a dispute
Trust risk: a guest searches a district with 2 listings and
  concludes the platform is empty, mitigation: launch districts
  are gated individually, thin districts stay hidden

WEEK 6 · PAID DEMAND
Enter only if: G3 met. If not met, budget holds, week 6 becomes
  a second supply week. The budget does not expire, trust does.`,
          notes: [
            'Every phase names its entry gate. The sequence self corrects when reality slips, which is the entire point of sequencing.',
            'The listing floor counts verified units and the search experience is gated per district. Aggregate numbers hide the empty search that actually burns a guest.',
            'Week 6 has a pre written miss path, the budget waits. Deciding that now costs nothing, deciding it in week 6 under spend pressure costs the launch.',
          ],
        },
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
        mistakes: [
          'Leading with excitement instead of standing: "we are thrilled to announce" spends the most read sentence on your feelings. In a trust market, the first sentence is the licence, the guarantee, or the number.',
          'One message trying to hug two audiences: a paragraph that alternates host benefits and guest benefits reassures neither. One shared trust foundation, then a clean fork, hosts here, guests there.',
          'Vague guarantees: "your money is protected" invites the question how. "Funds sit in regulated escrow until checkout day" answers it before it is asked.',
        ],
        worked: {
          intro: 'A launch announcement in a trust market is closer to a bank notice than a party invitation. Study one that holds that discipline without going cold.',
          setup: 'The full launch announcement, about 150 words, plus its one line social version. Count how early the licence appears and where the audiences fork.',
          example: `LAUNCH ANNOUNCEMENT · MALDIVES

InstaSpace is live in the Maldives, licensed under [authority,
licence no.], with every listing verified and every payment held
in regulated escrow.

We built one thing: a stay you can trust from both sides.

For hosts: your property earns without risk to it or to you.
Guests are identity verified before they book, payouts land in
your wallet the day a stay completes, and our team stands behind
every settlement.

For guests: every listing is checked, the host's right to rent
is verified, and your money is not released until you have
checked in. If a stay goes wrong, resolution is built into the
platform, not a phone queue.

The first fifty listings are live across three atolls. Both
sides start here: [link]

SOCIAL VERSION (one line)
The Maldives, verified. Licensed, escrow protected stays are
now live on InstaSpace.`,
          notes: [
            'The licence number appears in the first sentence. Nothing signals a trust product like leading with the thing that can be checked.',
            'The fork is explicit, for hosts, for guests, and each side hears its own worry answered, not a generic benefit.',
            'Fifty listings across three atolls is honest scale. Overclaiming inventory at launch is the mistake a trust brand never recovers from.',
          ],
        },
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
        mistakes: [
          'Ranking partners by size: the biggest resort chain gives you a meeting in six months. The mid size operator whose problem you solve this quarter gives you a pilot next week. Rank by fit and speed, reach comes third.',
          'Asks that cost the partner effort: "promote us to your guests" is work. "Let us verify and list your overflow inventory, you keep the relationship" is relief. The best ask solves their problem, not yours.',
          'Collecting logos instead of trust: a partnership that transfers no credibility to your listings is a press release, not a channel. Ask of every partner: does their name make a guest or host trust us more.',
        ],
        worked: {
          intro: 'A partner map earns its place when each row explains what trust flows in which direction and why the partner says yes. Study two rows built that way.',
          setup: 'Two entries from a Maldives partner shortlist, one obvious, one clever. Notice the mutual benefit is specific enough to open the first meeting with.',
          example: `PARTNER MAP (two of ten)

PARTNER: Mid size guesthouse association (40 member properties)
Type: supply plus credibility
Trust transfer: their members are locally known, their badge on
  our listings tells guests these are real places, our
  verification tells THEIR guests the association modernised
Reach: modest, 40 properties
The easy yes: we verify and list member properties free for six
  months, the association gets a compliance dashboard it can
  show the ministry. Their problem, proving members follow the
  new rules, solved by our product doing what it already does.
First meeting ask: pilot with five properties in one atoll
Priority: Tier 1, speed and fit both high

PARTNER: Regional airline loyalty programme
Type: demand
Trust transfer: their brand vouches for us at the exact moment,
  post booking, when a traveller plans where to stay
Reach: large
The easy yes: verified stays as a redemption option, zero
  integration work for them in phase one, a co branded landing
  page we build
First meeting ask: one email to their Maldives bound segment
Priority: Tier 2, high value, slower legal, start now for Q4`,
          notes: [
            'The association ask converts our compliance machinery into their membership benefit. The strongest partnerships resell something you already built.',
            'Trust transfer is written in both directions. Partnerships that only take credibility do not renew.',
            'Each row ends with a first meeting ask small enough to get a yes in the room. A pilot of five beats a memorandum of anything.',
          ],
        },
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
        mistakes: [
          'An executive summary that hedges: leadership approves plans that make a clear recommendation and own its risks. "There are several considerations" is not a recommendation.',
          'Gates without owners: a go no go gate that nobody is accountable for measuring will be waved through the week everyone is busy. Every gate names who calls it and on what evidence.',
          'The plan hides its biggest risk: every launch plan has one assumption that, if wrong, sinks it. Naming it on page one is what separates a plan from a pitch.',
        ],
        worked: {
          intro: 'An approval ready plan answers the three questions leadership actually asks: what are we betting, what kills us, and when can we stop. Study an opening page that answers all three.',
          setup: 'The first page of a market launch plan as it went to a leadership meeting. The recommendation is unhedged, the kill risk is named, and the gates have owners.',
          example: `MALDIVES MARKET LAUNCH PLAN · PAGE 1

RECOMMENDATION
Enter the Maldives in Q4 with a leasehold verified, escrow first
model, gated on licensing (B1) closing by August 15. If B1 slips
past September 1, we recommend deferring to Q1 rather than
launching into peak season underprepared.

THE BET IN ONE PARAGRAPH
Trust is scarcer in this market than inventory. Guesthouses can
not prove compliance and travellers cannot verify listings. We
win by being the only platform where verification is the product,
not a badge.

THE ASSUMPTION THAT KILLS US IF WRONG
That the regulator licenses a foreign platform holding escrow
via a local partner. Counsel confirms or denies by August 1.
Everything else in this plan is recoverable, this is not.

THE GATES (owner · evidence · date)
G1 Licence path confirmed     Talha  · counsel letter   · Aug 15
G2 120 verified listings      Osman  · live count       · Oct 1
G3 Districts search ready     Jybran · 3 results per district
G4 Paid demand opens          Jybran · G3 plus 10 clean stays

BUDGET EXPOSURE BEFORE EACH GATE
Before G1: legal fees only. Before G2: onboarding team. The
majority of spend sits behind G3, by design.`,
          notes: [
            'The recommendation includes its own stop condition, defer if B1 slips. Plans that can recommend stopping earn the right to recommend going.',
            'The kill assumption is separated from ordinary risks. Leadership can hold one existential question in mind, not fourteen equal caveats.',
            'Budget exposure is mapped to gates, so approving the plan does not mean spending the budget, it means releasing it gate by gate. That framing gets plans approved.',
          ],
        },
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
        mistakes: [
          'Rules that cannot fail a sentence: "be authentic" has never rejected a draft in history. A voice rule earns its place by being checkable, if you cannot point at a word that breaks it, it is a mood, not a rule.',
          'Defining the voice only by what it is: without a banned list, every writer relitigates "seamless" from scratch. The do not side of the rules does more daily work than the do side.',
          'Ten principles: nobody applies ten of anything under deadline. Three to five rules that are always true beat ten that are usually true.',
        ],
        worked: {
          intro: 'Voice rules are a test suite for sentences. Study a rule written properly, with its test, its pass, and its fail, and hold your own rules to that shape.',
          setup: 'One of four rules from the InstaSpace voice guide, complete with the one line test anyone can run. Notice the do and do not are real product sentences, not toy examples.',
          example: `VOICE RULE 2 OF 4 · THE NUMBER CARRIES THE SENTENCE

The rule: where a claim can be a number, it must be a number.
Adjectives describing scale, speed, or cost are placeholders for
research nobody did.

DO   "Settlement lands in your wallet the day a stay completes."
DO   "1.5 percent, published, all in."
NOT  "Lightning fast payouts you can rely on."
NOT  "Industry leading low fees."

The test: cover every number in the sentence. If nothing concrete
remains, the sentence was decoration.

Banned words this rule retires: fast, affordable, seamless,
instant (unless it is), competitive, market leading.

Edge case ruling: "instant" is permitted only for the wallet
balance display, which is actually instant. It is banned for
settlement, which takes a day. Precision includes knowing your
own product's clock.`,
          notes: [
            'The rule explains its own why, adjectives are unresearched claims. Rules with reasons survive the writer who disagrees.',
            'The test is mechanical, cover the numbers. Anyone can run it on any sentence in five seconds, which is what makes the rule enforceable at scale.',
            'The edge case ruling shows the rule meeting reality. A voice guide that has never ruled on a hard case has never been used.',
          ],
        },
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
        mistakes: [
          'Polishing instead of excavating: rearranging a hyped sentence produces polished hype. The edit starts by asking what is actually true underneath, then rebuilds from that.',
          'Deleting the energy along with the hype: a rescued draft that reads like terms and conditions overcorrected. Calm is not flat, the certainty should still have a pulse.',
          'Editing without showing the removals: a rewrite teaches nothing. The removed words list, with reasons, is what turns one edit into a lesson the next writer applies alone.',
        ],
        worked: {
          intro: 'Watch a full rescue: loud draft in, on voice line out, with the excavation step in the middle that juniors skip.',
          setup: 'A real style rescue of a partnerships email opener. The middle step, finding the true claim, is where the work happens. The rewrite is almost mechanical after it.',
          example: `THE DRAFT (as received from the partnerships team)
"We are beyond excited to unveil our game changing partnership
that will revolutionize how travelers experience the Maldives
like never before!!!"

STEP 1 · EXCAVATE THE TRUE CLAIM
Strip every adjective and ask what remains provable:
- there is a partnership (with whom? the guesthouse association)
- it changes something (what? 40 verified properties list at once)
The true claim: forty verified guesthouses join the platform.

STEP 2 · REBUILD FROM THE CLAIM
"Forty guesthouses across three atolls, verified and live today.
Our partnership with the Guesthouse Association makes InstaSpace
the largest verified selection in the Maldives."

REMOVED WORDS, WITH CHARGES
beyond excited      our feelings, not their benefit
game changing       claim with no evidence, banned list
revolutionize       banned list
like never before   unfalsifiable
!!!                 the voice never shouts

KEPT: nothing. When a sentence is all packaging, the rescue is
a rebuild, and that is normal.`,
          notes: [
            'The excavation found a number, forty, hiding under the adjectives. There is almost always a number, and it is always more impressive than the hype was.',
            'The rewrite leads with the concrete achievement and lets the partnership explain it. Order matters, proof then claim reads as confidence.',
            'The removed words each carry a charge. An edit that can name why each word died is an edit the original writer accepts without a fight.',
          ],
        },
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
        mistakes: [
          'Changing the temperature per surface: writing the push notification "fun" and the deck "serious" splits the brand in two. The length changes, the format changes, the temperature never does.',
          'Cutting the proof to fit: shrinking a message by dropping its number leaves the claim naked on the smallest, most seen surface. Shrink the words around the number, never the number.',
          'Starting from the long version: compressing a deck slide into a notification produces a bruised summary. Write the shortest surface first, then let the longer ones earn their extra words with proof.',
        ],
        worked: {
          intro: 'One message, four surfaces, one temperature. Study the set and notice the number survives every compression while everything else flexes.',
          setup: 'The settlement message expressed across all four surfaces, written shortest first. Read them in a row and check the voice never wavers, only the depth.',
          example: `THE CORE: verified settlement, 1.5 percent, two weeks not six.

PUSH NOTIFICATION (one line)
Your settlement cleared. 13 days, 1.5 percent, done.

INSTAGRAM CAPTION (under 50 words)
A cross border deal used to mean six weeks and 6.4 percent in
fees you never itemised. On InstaSpace it means verified parties,
regulated escrow, and settlement at 1.5 percent, in around two
weeks. The fee schedule is public. Link in bio.

LANDING PAGE HERO
Headline: Two weeks. 1.5 percent. Every party verified.
Subhead: InstaSpace settles cross border property deals through
regulated escrow, at a published fee, in a fifth of the usual
fee and a third of the usual time.

INVESTOR DECK LINE
Settlement is the wedge: 40 completed settlements averaging 13
days at 1.5 percent all in, against a 6.4 percent market average,
with zero disputes escalated beyond the platform.`,
          notes: [
            'The numbers appear on all four surfaces including the one line notification. Proof is the last thing to cut, not the first.',
            'The deck line adds evidence the caption cannot carry, forty settlements, zero escalations, but it makes the same claim. Longer surfaces go deeper, never different.',
            'The notification celebrates with a period, not an exclamation mark. Restraint at the moment of good news is the strongest voice signal a product sends.',
          ],
        },
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
        mistakes: [
          'Guidelines as an aspiration document: "we speak with warmth and authority" belongs in a pitch, not a guideline. Every line either changes what someone types or it is taking up the page.',
          'Examples from other brands: a do and do not borrowed from famous companies teaches the reader about those companies. Every example comes from InstaSpace copy, real or realistic.',
          'No pre ship checklist: guidelines get read once and forgotten. The checklist is the part that gets used every day, and it fits on a sticky note or it does not get used.',
        ],
        worked: {
          intro: 'The pre ship checklist is the working end of any brand guideline. Study one that a whole team actually runs, and notice it takes under a minute per piece.',
          setup: 'The final page of the InstaSpace guidelines, the checklist, plus one worked before and after that the guideline itself carries as teaching material.',
          example: `BEFORE ANYTHING SHIPS · THE 60 SECOND CHECK

1. Cover the numbers. Does anything concrete remain?
   If not, the piece is packaging. Find the number.
2. Read it aloud once. Did you shout anywhere?
   Exclamation marks, ALL CAPS, "very", delete on sight.
3. The two market rule: Dubai and the Maldives only.
   Any other geography is a mistake or a leak.
4. The dash sweep: no dashes as punctuation, commas or
   periods. Middle dot is fine in labels.
5. Would this sentence survive in the investor deck?
   If it is too silly for the deck, it is too silly for
   the app. One company, one voice.

WORKED EXAMPLE THE GUIDELINE CARRIES
Before: "Amazing news!! Your listing is now live and ready
  to earn BIG!"
After:  "Your listing is live. Verified, published, and
  bookable from today."
What changed and why: the checklist, lines 1, 2, and 5.
The after version passes all five in one read.`,
          notes: [
            'Five checks, sixty seconds, no judgement calls. Checklists fail when any item needs a meeting to interpret.',
            'Check 5 is the portable one, the deck test. It compresses the entire one voice principle into a question any intern can answer alone.',
            'The guideline teaches with its own before and after, so reading it is itself a small training. Documents that demonstrate outlive documents that describe.',
          ],
        },
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
        mistakes: [
          'A playbook without a paste ready prompt: the whole point of the playbook era is that anyone can ask Claude to edit to the voice. If the prompt is not in the playbook, verbatim, every writer improvises their own and the voice drifts.',
          'No versioning: the voice will evolve, the Maldives launch alone will add rulings. A playbook without a version number and a change log becomes three conflicting PDFs by December.',
          'Shipping without a first reader test: hand it to the newest person on the team and watch them edit one paragraph with it. Every place they hesitate is a bug in the playbook, not in them.',
        ],
        worked: {
          intro: 'The paste ready prompt is the heart of a modern voice playbook, it turns every teammate into an on voice editor. Study one built to production standard.',
          setup: 'The prompt section from a shipped playbook, the exact text anyone on the team pastes into Claude, followed by their own draft. Notice it carries the rules, the banned list, and the output format.',
          example: `THE PLAYBOOK PROMPT (copy from here, paste before your draft)

"You are the brand editor for InstaSpace, a trust platform for
short term rentals in Dubai and the Maldives. Edit the draft
below to our voice.

The rules:
1. Confident, not loud. No exclamation marks, no ALL CAPS.
2. Where a claim can be a number, make it the number. If the
   draft has no number, flag it, do not invent one.
3. One reading only. If a sentence can be misread, rewrite it.
4. Never use dashes as punctuation. Commas or periods.
5. Markets are Dubai and the Maldives. Flag any other market.

Banned words: revolutionary, seamless, game changer, unlock,
empower, amazing, exciting, cutting edge, world class, instant
(unless describing the wallet balance display).

Return exactly:
1. The edited version
2. Removed words, each with a one line reason
3. Any flags (missing numbers, wrong market, ambiguity)

Do not change facts, prices, or dates. If a fact looks wrong,
flag it, do not fix it.

Draft follows:"

PLAYBOOK METADATA
Version 1.2 · July 2026 · Owner: brand · Changes from 1.1:
added the "instant" edge case ruling, added market flag rule.`,
          notes: [
            'The prompt embeds the output format, edit, removals, flags, so every editing session doubles as voice training for the writer reading the removals.',
            'The "do not change facts, flag them" line is what makes the prompt safe to hand to everyone. An editor that silently fixes prices is a liability, one that flags them is a colleague.',
            'The metadata block makes the playbook a living document, versioned, owned, and changelogged like the product it protects.',
          ],
        },
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
//
// Airtable owns the words (titles, concepts, prompts). The presentation layer
// enrichments live in this file and survive hydration: worked examples,
// common mistakes, video urls, and each practice's records and chat script
// are carried over from the built-in lesson when Airtable does not have them.
window.loadAirtableCourses = async function(){
  try {
    const apiBase = (typeof window.PORTAL_API === 'string') ? window.PORTAL_API : 'http://localhost:3001';
    const res = await fetch(apiBase + '/api/content/courses');
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.courses && Object.keys(data.courses).length){
      Object.keys(data.courses).forEach((deptId) => {
        const incoming = data.courses[deptId];
        const local = window.COURSES[deptId];
        if (local && Array.isArray(incoming.lessons)){
          const localById = {};
          (local.lessons || []).forEach((l) => { localById[l.id] = l; });
          incoming.lessons.forEach((lesson) => {
            const base = localById[lesson.id];
            if (!base) return;
            if (!lesson.worked && base.worked) lesson.worked = base.worked;
            if (!(lesson.mistakes && lesson.mistakes.length) && base.mistakes) lesson.mistakes = base.mistakes;
            if (!lesson.videoUrl && base.videoUrl) lesson.videoUrl = base.videoUrl;
            const basePractice = base.practice;
            if (lesson.practice && basePractice){
              if (!(lesson.practice.records && lesson.practice.records.length) && basePractice.records) lesson.practice.records = basePractice.records;
              if (!lesson.practice.chatScript && basePractice.chatScript) lesson.practice.chatScript = basePractice.chatScript;
              if (!lesson.practice.reward && basePractice.reward) lesson.practice.reward = basePractice.reward;
            }
          });
        }
        window.COURSES[deptId] = incoming;
      });
      return data;
    }
  } catch (e) { /* keep built-in courses */ }
  return null;
};
