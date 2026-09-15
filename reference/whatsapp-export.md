# Reading a WhatsApp class group

Class group chats are where the social calendar actually lives. Not the school
calendar, not email — a parent rep posting "picnic moved to Saturday!" at 10pm
between forty messages about a lost water bottle.

There is no sanctioned API for a personal WhatsApp account in a group chat.
**Do not suggest, install, or build against the unofficial libraries** that
reverse-engineer WhatsApp Web. They work, they violate Meta's terms, and account
bans are enforced. For a parent, a banned account means losing the class group
entirely, which is worse than the problem being solved.

What works instead is WhatsApp's own export.

## Getting an export

In the chat: **the group name → Export Chat → Without Media**, then save the
`.txt` to `<data folder>/whatsapp/`.

Without Media matters. With media, a term of class photos runs to hundreds of
megabytes of other people's children.

Exports are **cumulative** — each one contains the whole history, not just what
is new. Dedup is therefore mandatory, and is handled below.

## The file format

Two shapes, depending on the phone that produced it.

```
[2/14/26, 9:32:15 AM] Sarah Chen: Bake sale Friday, bring something!
```

```
2/14/26, 09:32 - Sarah Chen: Bake sale Friday, bring something!
```

Rules that matter when parsing:

- **A line without a leading timestamp is a continuation** of the message above
  it. Long posts — exactly the ones carrying details — wrap across many lines.
  Treat them as one message or the important half is lost.
- Exports carry invisible left-to-right marks (`U+200E`) before timestamps and
  around attachments. Strip them before matching.
- `<Media omitted>`, `image omitted`, `sticker omitted` are placeholders. A
  message that is only a placeholder carries nothing; one with a caption might.
- Dates are **ambiguous**: `2/3/26` is February 3rd or March 2nd depending on
  the exporting phone's locale. Never assume. Infer from a date later in the
  file that exceeds 12, and if the file gives no evidence, say so and ask rather
  than guessing a party date wrong by a month.
- System lines — joins, leaves, "changed the subject" — are noise.

## Dedup

Keep a high-water mark in `<data folder>/whatsapp-processed.local.md`: the
timestamp of the newest message already read, and the date of the last export.

On each run, parse only messages after that mark, then update it. Without this,
every week resurfaces the same three events and the brief trains the parent to
stop reading it.

If an export is older than the mark, the parent has re-exported without new
messages. Say that plainly rather than reporting nothing found.

## What to pull out

A class group is perhaps 95% noise. Being aggressive about what to ignore is
what makes this useful rather than a second inbox.

**Take:**

| Kind | Looks like |
|---|---|
| Dated events | Picnics, parties, meetups, working bees, concerts |
| RSVP asks | "Let me know by Friday", a form link, a headcount request |
| Changes | A venue, date, or time moving. **These matter most and are easiest to miss** — the original went on the calendar weeks ago and this is the correction |
| Money | Teacher gift collections, class funds, ticket costs |
| Things aimed at you | Being asked directly to bring, host, drive, or volunteer |
| Deadlines | Sign-up sheets, order cutoffs, costume days |

**Leave:**

Lost property, thank-yous, emoji, "can anyone recommend a...", homework
questions, general chat, and anything already known from the school calendar or
a school email. The school's own channels are authoritative; the group chat is a
supplement that occasionally corrects them.

## Then classify it

Every event found goes through the invitation rules in
`skills/social-calendar/SKILL.md` — child, family, or individual. A class party
is a full chain: RSVP, gift, logistics, reciprocity. A parents' drinks night is
a coverage problem. They are not the same work.

Where the chat does not make it clear, **ask rather than guess**. "Saturday
11am at the park" from a class rep could be either.

## Report it as a separate block

Group-chat findings go in their own section of the brief, labelled as coming
from the class chat. The parent needs to weigh them differently: a rep's message
is not the school speaking, plans in a group chat change, and something said at
10pm on WhatsApp is less settled than something in the Tuesday Memo.

Quote the original line when reporting a date. Paraphrasing a time or venue is
exactly where an error enters, and the parent can sanity-check a quote.

## Privacy

The export contains other families' names, phone numbers, and conversations.

- **Phone numbers never leave the file.** Not into a task, not into a chat
  reply, not onto a page.
- Other parents' names can be used where they are the point — "Sarah is
  organising this" — but keep them off the shared week-ahead page, which exists
  for the household and not for the class.
- Do not summarise other people's conversations. Extract the logistics and
  ignore the rest, including anything that reads as private, medical, or
  difficult. Those are not yours to carry forward.
- Once parsed, the export is disposable. Keep the most recent one; delete older
  ones rather than accumulating a searchable archive of other families' chat.

## When there is a better source

Ask once, early: do the class reps post the same information anywhere else — a
school portal, a mailing list, a shared calendar? A channel already arriving by
email beats any export routine, because it needs nobody to remember anything.
