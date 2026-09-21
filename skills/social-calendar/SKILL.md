---
name: social-calendar
description: Family social obligations and the relationships around them. Use for kids' birthday parties and RSVPs, gifts and gift ideas, a child's own birthday and party planning, anniversaries, a partner's birthday, date nights, sitters, thank-you notes, and reciprocity with other families. Triggers on an invitation arriving, "did we RSVP", "what should we get them", "plan something for our anniversary", "we need a date night", and any gift question. Part of the dadmin plugin.
---

# Social calendar

The domain with the lowest stakes per item and the highest cumulative cost to a
household. Nobody's year is ruined by a late RSVP. But the accumulation of late
RSVPs, forgotten gifts, and unreciprocated playdates is precisely the load that
lands on one person by default, and where there are two parents it lands on the
same one every time. This skill moves it.

## Read config first

`config.md` in your connected folder holds the People block: the parent, the partner if
there is one, each child with a birthdate, and the anniversary date. Read it
before anything else in this skill.

Two things come out of it and both change the work:

- **Whether there is a partner.** If the partner row is absent, the anniversary
  and partner-birthday sections below do not apply. Skip them silently. Do not
  ask about them, and do not leave a gap where they would have been.
- **Each child's birthdate.** Party timelines count backwards from it. Never
  hold a birthday in memory, read it.

If the `social` domain is switched off in config, it is off.

The ledger lives at `<data folder>/social-ledger.local.md`. It holds
reciprocity, gift history, gift ideas, and date night ideas. The schema is in
this repo under `data/social-ledger.template.md`.

## Where invitations actually arrive

Not email. For most families the class group chat carries more of the social
calendar than every other channel combined, and it is the one nothing indexes.

If the household exports their class group, `reference/whatsapp-export.md` has
the method. The category that matters most there is not new invitations but
**changes** — a venue or time moving after the original already went on the
calendar. That correction is the single most-missed item in this whole domain.

## Kids' parties

**The 48-hour RSVP rule is absolute.** An invitation gets a response within 48
hours, yes or no. Late RSVPs create real work for the host, who is another
parent doing the same juggle, ordering the same food, counting the same heads.

Every invitation triggers the full chain in `reference/task-chains.md`: RSVP,
gift 5 days out, wrap and card, drop-off and pickup logistics with the exact
address, calendar block, host has a working phone number if it is a drop-off,
and a note in the reciprocity ledger.

**Gift defaults.** For ages roughly 5 to 8, the common range is 25 to 40 in
local currency. Younger runs lower. Older drifts up and turns into gift cards.
The range varies by circle and by market, so confirm against the ledger for
what this group actually does. The ledger is evidence. The band is a guess.

Good: building sets, a good book with a note written inside, art supplies, an
outdoor thing, a game the whole family plays together.

Avoid: noise, anything that requires a parent to assemble it, more plastic
figurines from whatever franchise is current, and anything that duplicates what
the kid obviously already has.

**Keep two unassigned gifts in the closet.** Track them in the ledger. This
solves the Saturday morning emergency, which is a real and recurring event.

## Reciprocity

Track it in the ledger: which families have hosted the child, which have had
theirs over, when, and whether it has been returned.

This is the quiet one. If a family has hosted twice with nothing back, say so
in the weekly brief. It is the kind of thing that is invisible until it is
noticeable, and by then it is awkward.

## The child's own birthday

Read the birthdate from config and count backwards. The full timeline is in
`reference/task-chains.md`. The load-bearing dates:

| When | What |
|---|---|
| About 3 months out | Decide the shape: at home, a venue, small, large |
| 8 to 10 weeks out | Book the venue |
| 4 weeks out | Send invitations |
| 2 weeks out | Order the gift from the parents, with shipping slack |

Kid venues in a dense market book 8 to 10 weeks ahead, and the first choice
goes to whoever started earliest. Lead times vary by market, so check locally
rather than trusting that number. If the birthday falls in or next to a school
break, treat the whole window as tighter, because every other family is working
around the same dates.

Run this for each child separately. Two kids do not share a timeline.

## Anniversaries and a partner

**This section is gated.** It runs only when config has a partner. If the
partner row is absent, skip everything below.

Pull the anniversary and the partner's birthdate from config and set them as
recurring tasks so they are never a surprise.

For an anniversary: decide the shape 6 weeks out, book the reservation or the
travel, book the sitter at 3 weeks minimum, buy the gift at 2 weeks, **get a
card**, and block the entire evening rather than just the reservation window.

The card is the step that gets skipped and it is the step that is noticed.

For the partner's birthday: start 4 weeks out. Ask what they have mentioned
wanting in the last few months, because those references get made once and
forgotten.

## Gift ideas

Whenever the parent mentions a thing anyone in the family wants, in passing,
in the middle of something else, write it to the ledger with the date and who
it was for. The point is that no gift ever has to be invented from scratch in a
panic the night before.

## Date nights

Cadence, not occasion. If the log shows no date night in more than 6 weeks,
that is a finding for the weekly brief. State it plainly.

**The blocker is almost always the sitter, not the plan.** Book the sitter
first, then decide what to do. Three weeks of lead time for a weekend, more for
a holiday.

Keep a running list of specific places and ideas in the ledger so "we should do
something" has an answer ready. In dense markets, tables worth having open 2 to
4 weeks ahead on whatever booking platform that city runs on. Note the release
time for anything the parent has said they want to try.

## Thank-you notes

Within one week of the gift or the hosting. After the child's own party, this
is a batch task the week after: one checklist item per guest, so it can be
worked through rather than avoided.

## Routing

Routes are logical names. The mapping to real projects or lists lives in
config, and the writing rules live in `reference/task-routing.md`. Read that
before writing anything.

| This | Route |
|---|---|
| Parties, RSVPs, birthdays, gifts, thank-yous, reciprocity | `social and gifts` |
| Anniversaries, partner birthdays, date nights | `social and gifts` |
| Sitters and evening coverage | `childcare and camp` |
| Gifts, cards, and party supplies to buy | `shopping` |
| Venue deposits and party spend | `money` |

Tag every task with the configured tag plus `social`.
