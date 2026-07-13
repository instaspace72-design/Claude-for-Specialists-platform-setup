# InstaSpace product context

This document is ground truth for mentors and graders inside the learning
portal. Prefer it over assumptions. It is seeded into the context_documents
table on every boot, so editing this file and redeploying updates every
mentor conversation.

## What InstaSpace is

InstaSpace is a short term rental trust platform for the UAE (Dubai first)
with a Maldives launch following. It is not a plain listings site and it is
not a property buy and sell marketplace. The product bet is trust
infrastructure: every listing, host, guest, and payment is verified,
protected, or settled by a named module. The brand voice is confident,
precise, quietly premium. No hype, no exclamation marks, and never dashes as
punctuation.

## The four audiences and their surfaces

1. Guests: search and browse listings, view a listing page with photos,
   pricing in AED, and trust badges, book with dates and guest count, pay at
   checkout (card or wallet balance), manage bookings, leave reviews, open a
   dispute if a stay goes wrong, complete identity verification when asked.
2. Hosts: onboard and verify identity, create and edit listings, set
   pricing (with an AI suggested base price available), manage a calendar
   and blackout dates, track bookings, receive payouts into their wallet
   when a stay completes, upload right to rent documents, respond to
   disputes.
3. Property managers (PMs): a separate portal for companies running many
   units. Bulk CSV import of listings from Airbnb and Booking style exports,
   rating based tiering with a seven day provisional window and video
   verification, team level management of many properties.
4. Admins and internal staff: review queues for identity documents, right
   to rent documents, and flagged listings, dispute mediation, and
   oversight of payouts and refunds.

## The trust modules (know these by name)

- InstaPass: AI identity verification for people (KYC). Reads submitted ID
  documents with vision AI and replaces the old auto approve stub.
- GovShield: AI verification of a host's legal right to rent a property.
  Hosts upload ownership or permit documents, AI reads them, a badge shows
  on verified listings, and an admin queue handles review.
- AI-Auditor (NestVerify): listing authenticity checks. Vision AI compares
  listing photos and details for signs of fake or misrepresented listings.
- AI-Yield: smart base price recommendation for hosts, powered by AI, so a
  new host does not guess their nightly rate.
- InstaWallet: the money layer. Host payouts land in the wallet when a stay
  completes, guests earn loyalty coins, and a wallet balance can pay at
  checkout. Refunds from disputes are real wallet movements.
- Disputes: a resolution centre where AI mediates between guest and host
  and settlements produce real wallet refunds, not just status changes.
- Listing tags: structured tags on listings for search and filtering.

## Money flow in one line

Guest books and pays, funds are held, the stay completes, the host is paid
out through InstaWallet, the guest earns loyalty coins, and if the stay went
wrong a dispute can rewrite the ending with a real refund.

## Market rules that matter

- Markets are Dubai (UAE) and the Maldives. Do not reference other markets.
- Dubai short term rentals involve DLD registration and permit rules; trust
  and compliance are selling points, not fine print.
- Currency is AED in the UAE product.

## The learning portal itself (the second product interns study)

React SPA loaded through Babel standalone (no build step) served on port
8000 in dev, an Express API on port 3001 with SQLite, live Claude mentor
chat per exercise, real grading of submissions by a strict second Claude
pass, real time on task tracking, streaks from real activity, a leadership
dashboard with monthly KPI ratings (time, discipline, dedication,
willingness, attention to detail, reporting habits, communication), remarks,
a star of the month, one click performance reports, and a printable
completion certificate. In production one Node service serves both API and
frontend.

## The team

Osman is CEO, Jybran is COO, Talha is CPO, Ayesha is project manager. The
current interns and tracks: Mesum (SEO and backlinks), Shahzaib Nasir
(design and video), Umair Aziz and Abdullah (InstaSpace App Mastery, which
covers the webapp and this portal).

## How a mentor should use this

Anchor every example in a real surface or module named above. If a learner
invents a feature that does not exist, correct them. If a learner is vague,
ask them to name the exact surface, audience, and module their work touches.
Hold work to the standard of something Talha could forward to Osman without
edits.
