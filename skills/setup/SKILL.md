---
name: setup
description: First-run onboarding for the family operations plugin. Interviews the parent and writes their household config — data folder, kids, school email domains, the mail flag label, which task manager they use, which domains to track, and weekly brief preferences. Use on the very first run, when no config exists at config.md in your connected folder, when the user says "set up", "get started", "configure", "onboard me", "reconfigure", or "change what you track", and whenever another skill fails because a config field is missing. Part of the dadmin plugin.
---

# Setup

The first run. A parent has just installed this and it knows nothing about
them. By the end of this conversation it should know enough to be useful on
Sunday morning.

## The rule that governs this whole skill

**Ask few questions. Infer aggressively. Let them correct you.**

Onboarding is where people quit. Every question has to earn its place by
changing what the skill actually does. If a reasonable default exists, use it
and mention it in one line rather than asking.

Never ask for anything you can look up. If a mail connector is attached, read
the labels and the last 90 days of mail and *propose* the school domain instead
of asking them to type it. If a calendar is attached, read it. Show them what
you found and ask them to confirm — recognition is faster than recall, and it
proves the thing works before they have invested anything in it.

## Before you start

Check whether `config.md` in your connected folder already exists.

- **Exists, and they asked to set up again** — do not start over. Read it, show
  them the current settings, ask what they want to change, edit that section
  only.
- **Exists, and another skill sent them here for a missing field** — fix that
  one field. Do not run the whole interview.
- **Does not exist** — run the flow below.

## Say what this is, in three lines

Before asking anything, tell them plainly what they are setting up:

> This keeps track of the family logistics that fall through — school
> deadlines, appointments, camp registration that opens and closes in a week,
> flights that should have been booked two months ago. Once a week it tells you
> what is coming and what is about to get expensive.
>
> Six questions, about two minutes.

## The six questions

Use AskUserQuestion. **Batch them** — two calls of three questions, not six
round trips.

### 1. Connect a folder

**Not a question — an action, and it has to happen before anything else works.**

Everything gets written to the folder they connect: the config, the school
calendar, sizes, medical dates, downloaded attachments. Without one, nothing can
be remembered between conversations, and setup cannot finish.

If no folder is connected, ask for one using the host's own folder-connection
flow. Do not ask them to type a path, and **do not write to a home directory or
anywhere outside what they connected** — those paths are not reachable, and a
setup that appears to succeed while writing nowhere is worse than one that stops
and asks.

Say why in one line before asking: this folder is where it remembers things, and
a synced one — Drive, Dropbox, iCloud, OneDrive — survives a new laptop.

Once connected, that folder **is** the Dadmin folder. Config at its
root as `config.md`, data files alongside it, `inbox/` underneath for
attachments. One location, no second path to keep track of.

If they already have a family folder full of school documents, connecting that
one is ideal — then the source documents and the memory live together.

### 2. Who is in the household?

Names, and for each child a **birthdate**. Push back gently if they give an age
instead. Ages go stale in a way that quietly corrupts everything downstream:
school year, clothing sizes, medical cadence, what counts as an appropriate
gift.

Partner is optional. Single parents are a normal case, and the skill must never
assume two adults, ask "who is covering", or refer to a partner who does not
exist.

### 3. Which school, and what does it email from?

The domain is the load-bearing part. Everything school-related is found by
searching mail from it.

If mail is connected, go find it first. Search the last 90 days for the school
name, read the sending domain off the results, then confirm: "Mail from
`ps158.org` — is that the right one?" Only ask them to type it if the search is
empty.

Ask whether it is public or private. Not a status question — it changes the
deadline load. Private adds re-enrollment contracts, tuition schedules, and
conference sign-ups that fill within hours. Public adds district calendars and
lottery or choice deadlines in the fall.

Multiple kids at multiple schools is common. Ask once, then "any others?"

### 4. What do you use to track tasks?

Lead with whatever task connectors are actually attached. Then the common ones:
TickTick, Todoist, Apple Reminders, Asana, Notion.

**"None" is a real answer and must work properly.** Set `manager: none`. The
brief still runs, still finds everything, and reports instead of writing. Do
not nag someone who chose this.

If they picked one, list their existing projects and map the routes. **Do not
create new projects unless asked** — people have a system already, and a plugin
that colonises their task manager with eight new lists gets uninstalled.

### 5. What should it track?

Present the six domains and let them switch things off. Default all on except
special education.

| Domain | Covers |
|---|---|
| School | Calendar, forms, deadlines, conferences |
| Medical | Appointments, checkup cadence, growth and clothing sizes |
| Travel | Trips, booking windows, passports |
| Social | Parties, RSVPs, gifts, date nights |
| Household | Camp and afterschool registration, seasonal work, maintenance |
| Special education | IEP, 504, evaluation timelines |

Two things worth saying out loud, because people do not anticipate them:

**Special education stays off unless asked for.** A parent turning it on is a
meaningful disclosure. Handle it without commentary.

**Medical includes clothing sizes.** That reads as odd until the first February
the snow boots do not fit. Half a line if they ask.

### 6. When do you want the brief, and do you want a page for it?

Default Sunday morning; ask if that works.

Then the artifact. Explain it as "a page you can text to your partner", not as
a feature. Offer to schedule the brief as a recurring task at the end — do not
schedule without asking.

## Then write the config

Write `config.md` at the root of the connected folder, using the structure in
`data/config.template.md`.

**Then read it back.** A write that silently went nowhere is the exact failure
this section exists to prevent, and it stays invisible until three weeks later
when nothing has been remembered. If the read-back fails, say so plainly and
stop — do not keep interviewing against a file that does not exist.

**Leave a field blank rather than guessing.** A blank field makes a skill say "I
do not know your dentist" and ask, which is correct. An invented one makes it
state a falsehood confidently, which is the failure this whole plugin exists to
prevent.

Then scaffold the data folder: copy each `data/*.template.md` in, dropping
`.template` from the name. Empty files with real headings are the point — they
show the parent what will get filled in, and give later runs somewhere to write.

## Prove it works before letting them go

Do not end on "you're all set." End on evidence. Run one real query against what
they just configured and show the result:

- Search the school domain for the last 30 days and report what is there
- Read the calendar for the next 14 days
- Name the next real deadline you can see

If something is not connected, say which and what it costs them, specifically:
"Calendar is not connected, so I cannot see what is already scheduled — I will
find deadlines in mail but I will not know whether you are free." That is
useful. "Some features may be limited" is not.

**If a mail search comes back empty, say which account you searched.** An empty
result from the wrong inbox reads exactly like an all-clear, and that is the
most expensive failure mode here.

## Then the three things that actually matter

Close with these. They are the difference between a plugin that works and one
abandoned in a month.

**One: make the mail label.** Have them create a label called `dadmin` plus a
`dadmin/done` sub-label. Anything they label gets picked up and treated as
deliberate. It is how everything the keyword searches miss still gets caught,
and it takes thirty seconds.

**Two: feed it the school calendar.** The highest-value thing they can do.
Forward the PDF, paste the dates, point at the file. Closures, coverage gaps,
trip windows, and all deadline math depend on it. Offer to ingest it now.

**Three: it will tell them things they would rather not hear.** That is the job.
If a registration window closed, it says so. If they have sat on something for
three weeks, it names it. Setting that expectation up front is the difference
between useful and annoying.

## What not to do

- Do not ask for an address, phone number, insurance details, or any account
  number during setup. None of it is needed to be useful, and asking in the
  first two minutes costs trust that is hard to get back.
- Do not create task-manager projects unprompted.
- Do not write anything outside their data folder and your connected folder.
- Do not schedule a recurring brief without asking.
- Do not pad the confirmation. They just answered six questions. Show them it
  works and get out of the way.
