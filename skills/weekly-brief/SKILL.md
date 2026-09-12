---
name: weekly-brief
description: The recurring family brief, usually Sunday. Use when the parent asks "what's coming up", "what am I forgetting", "family brief", "run the brief", or when a scheduled run fires. Scans the next 14 days tactically and the next 90 days for booking windows, publishes a week-ahead page when configured, and writes the resulting actions to the task manager. Part of the mrs-doubtfire plugin.
---

# Weekly brief

The heartbeat. Its purpose is to catch the things that are about to become
expensive or embarrassing while they are still cheap and easy.

Read `config.md` in your connected folder first. It sets the day, which domains are
live, whether to publish the page, and which sections the parent wants.

## Horizons

Scan three, in this order.

**Next 14 days — tactical.** What is actually happening. Appointments, parties,
school events, deadlines, travel. Anything unprepared for.

**Next 90 days — booking windows.** What is not urgent yet but crosses its lead
time this week. This is where the brief earns its keep. A flight that should be
booked in nine weeks is invisible to everyone else in the household, and is the
single most common way money gets wasted.

**Cadence check — overdue by rhythm.** Things with no deadline that have simply
gone too long. Last dentist visit. Last date night. Last time anyone measured a
shoe size. Last time the two adults talked about the summer.

## Sequence

0. **Check flagged mail first.** Anything the parent labeled with the configured
   flag label is a deliberate human signal and outranks every keyword query
   below. Work these before the category scans and lead with anything urgent
   among them. When a flagged item produces a task, say so, so they can move it
   to the `/done` sub-label.
1. **Load config**, then every data file in their folder. Note stale fields.
2. **Read the school calendar.** If it is not current for the term, that is
   finding number one — everything downstream depends on it.
3. **Pull the next 14 days from the calendar.**
4. **Search mail for the last 7 days**: school domains, invitations, appointment
   confirmations, and anything containing RSVP, deadline, due, registration.
   **Also look for booking and order confirmations** — travel, camp, tickets.
   Paid commitments do not announce themselves, and a confirmation sitting in an
   inbox with no calendar entry is a real finding.

   **Sort every invitation by who it is actually for**, because the three kinds
   carry completely different work:

   | Kind | What it means | What it triggers |
   |---|---|---|
   | **Child** | A classmate's party, a playdate, a sleepover | The full chain: RSVP in 48h, gift 5 days out, drop-off and pickup logistics, reciprocity ledger |
   | **Family** | All of you are invited. A wedding, a barbecue, a neighbor's thing | One calendar block, travel if it is not local, and a decision about whether the kids come |
   | **Individual** | One adult. A work event, a friend's dinner, a bachelor party | Coverage. If one parent is out, the other is solo that evening, and that is the actual obligation |

   **When it is genuinely ambiguous, ask rather than guess.** A Saturday
   afternoon invitation from another parent could be a kid's party or an adults'
   thing, and the two produce different tasks. One question in the brief costs
   less than buying a gift for an event that did not need one, or discovering
   nobody arranged childcare.

   Record the answer in the social ledger so the same host does not have to be
   classified twice.
5. **Pull open tasks** so nothing gets duplicated and overdue items surface.
6. **Walk `reference/lead-times.md` against today.** For every row, ask whether
   the action date for the next instance falls inside the next 7 days. If yes,
   it goes in the brief.
7. **Run the cadence check** against the health log and the social ledger.
8. **Write tasks. Publish the page. Report.**

## Output format

Short. This gets read on a Sunday morning. No preamble, no closing summary.
Drop any section that is empty — an empty "Slipping" is a good week and does not
need a line saying so.

```
## Act now or pay later
Booking windows crossing this week. For each: what, the deadline, the cost of
waiting as a number or a real consequence, and the action.
This section leads whenever it is not empty.

## This week
The 14-day tactical view. One line each: date, thing, what to do about it.
If nothing is required, say "nothing needed" rather than omitting the day.

## Slipping
Overdue by cadence, or an unactioned task older than three weeks. Blunt.

## Needs a decision
What cannot be resolved alone. Framed as a specific question with options, not
"you should discuss summer".

## Created
What was written, and where. If a task was updated rather than created, say so.
```

## Publish the page

When config has `artifact: yes`, build the week-ahead page from
`reference/week-ahead-artifact.md`.

**Show the manifest and wait** before publishing, unless config says
`artifact_review: no`. The full rule is in that reference file. Short version:
list what is going on the page, flag anything medical, named, addressed, or
financial, say what was left off, and let the parent cut things. Publishing is a
one-way door and the page outlives the week.

**Republish to the same URL every week.** The link gets sent to a partner once
and should keep working. Read the stored URL from
`<data folder>/week-ahead-url.local.md`, pass it on publish, and write it back
on the first run.

**Write a PDF alongside it**, into the data folder, from the same HTML. The
artifact is account-scoped and often cannot be shared with a partner outside the
owner's organization without opening it to anyone-with-the-link. The PDF goes by
text, needs no account, and leaves nothing hosted. Method and the landscape
print rule are in the reference file.

Mention the page and the PDF in one line each at the end of the chat brief. Do
not paste the URL into the reply — the card carries it.

## Rules specific to the brief

**Do not repeat last week.** Check existing tasks first. If the same item
surfaces twice running with no movement, escalate the framing rather than
restating it: "Still not booked. Fares are up $80 since I first flagged this."

**Lead with money and seats.** If something has a price consequence, it goes
first regardless of date.

**Name what the other adult would notice.** The brief exists to close the gap
between what one person knows and what the household needs. If a thank-you note
is three weeks late, or a family has hosted twice with nothing back, say it.

**Three findings minimum, eight maximum**, or whatever `max_findings` says.
Fewer than three means the scan was lazy. More than eight and nothing gets done.

**Say what you could not see.** If the calendar is not connected, or a mail
search came back empty, name it and name the account searched. An empty result
from an unchecked source reads exactly like an all-clear.

## Monthly variant

On the first run of the month, extend the booking scan to 180 days and add:

```
## On the horizon
Anything 90 to 180 days out needing a decision or a deposit. Holiday travel,
summer camp, the next school year, birthdays over $200.
```

## Scheduling it

Offer once, after the first successful brief. Do not schedule unprompted.

```
create_scheduled_task, cron from config (default "0 8 * * 0"), the household timezone
prompt: "Run the weekly family brief."
```
