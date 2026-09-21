# Dadmin!

<!-- TODO before listing: needs original artwork. The previous image was a film
     still and has been removed - see "A note on the name". -->


A Claude plugin that keeps track of the family logistics that fall through.

School deadlines. The dentist nobody has booked in fourteen months. Camp
registration that opens and closes in a week. Flights that should have been
booked two months ago and now cost four hundred dollars more. The birthday party
you RSVP'd to and forgot to buy a gift for.

None of it is hard. All of it is invisible until it is late.

Once a week this tells you what is coming, what is about to get expensive, and
what you are already behind on. It writes the actions into whatever task manager
you already use, and it can publish a page showing the week ahead that you can
send to your partner.

---

## What it actually does

**Works backwards from deadlines.** Nothing gets scheduled on the day it is due.
Every obligation gets a lead time, and the task lands on the date when acting is
still cheap. Camp registration goes on the calendar in December, not March.

**Surfaces the second task.** A party invitation is not one thing, it is four:
RSVP, gift, ride, and a calendar block so nothing else lands there. Most family
failures live in items two through four.

**Tells you the uncomfortable part.** If a registration window closed, it says
so. If fares are climbing, it says by how much. If you have been sitting on
something for three weeks, it names it.

**Never invents a fact about your family.** Sizes, dates, provider names, past
appointments — these come from your files or from you. If something is missing
or stale, it says so and asks. A confidently wrong shoe size is worse than no
shoe size, because you will act on it.

---

## Install

This repo is its own marketplace, so you add it once and install from it.

**In Claude Code:**

```
/plugin marketplace add CR8-OS/dadmin
/plugin install dadmin@cr8os-family
```

**In the Claude desktop app**, once the marketplace above is added: click the
**+** next to the prompt box, choose **Plugins → Add plugin**, and pick
Dadmin from the browser.

Worth knowing: the desktop plugin browser lists plugins from marketplaces you
have already configured. Adding a *new* marketplace may still need the
`/plugin marketplace add` line above, run once. If you are sending this to
someone who does not use a terminal, check that first rather than assuming, or
just send them the packaged `.plugin` file and let them click install.

Updating later:

```
/plugin marketplace update cr8os-family
```

## Setup

Once installed, say **"set up Dadmin"**. Nothing prompts you — you have
to ask.

Six questions, about two minutes:

1. Connect a folder — it keeps everything there, so pick a synced one
2. Who is in the household, and the kids' birthdates
3. Which school, and what address it emails from
4. What you use to track tasks — or nothing, which works fine
5. Which domains to track
6. When you want the weekly brief

That writes `config.md` into the folder you connected. It is plain markdown and
you can edit it by hand any time, which is the point — you should never have to
ask an AI to change a fact about your own family.

### Then do these three things

Everything else degrades gracefully. These three do not.

**Feed it your school calendar.** Forward the PDF, paste the dates, point at the
file. Closures, coverage gaps, trip windows and every deadline calculation come
from it. Without one the whole school domain is guessing.

**Fill in the last dentist visit and last check-up.** Two dates. Nothing can be
called overdue until something knows when it last happened, so until these exist
the medical side stays silent.

**Make a mail label called `dadmin`**, plus a `dadmin/done` sub-label.
Anything you label gets picked up on the next run and treated as deliberate,
outranking every keyword guess. It is how the things a search would never have
found still get caught. Thirty seconds, and the highest-leverage minute here.

### What the first week feels like

Thin, and then not. Before you feed it anything it knows nothing about your
family, and it says so rather than filling the gap with plausible guesses.

That is the honest cost of a tool that refuses to invent facts about your
children. Give it a calendar and two dates and the Sunday brief starts earning
its place.

---

## The domains

Turn off anything you do not want. Off means silent.

| Domain | Covers |
|---|---|
| **School** | Calendar ingestion, forms, deadlines, conferences, re-enrollment |
| **Medical** | Appointment cadence, overdue checks, growth and clothing sizes |
| **Travel** | Trips, booking windows, passports, the school-calendar boundary |
| **Social** | Parties, RSVPs, gifts, reciprocity, date nights |
| **Household** | Camp and afterschool registration, seasonal work, maintenance |
| **Special education** | IEP, 504, evaluation timelines. Off by default. |

---

## What you need

**Required:** Claude, and a folder to keep data in.

**Strongly recommended:** a mail connector. Most of what this finds arrives by
email, and without it you are typing things in by hand.

**Optional but good:** a calendar connector, so it knows whether you are
actually free before proposing a date. A task manager, so commitments land
somewhere durable. Pick `none` and the brief simply reports instead of writing.

It degrades honestly. Anything not connected gets named, along with what that
costs you, rather than silently producing a thinner answer.

---

## Where your data lives

**Nothing personal is in this repo, and nothing personal is sent anywhere.**

Skill logic lives here, on GitHub, versioned. Your family's actual data lives in
the folder you chose during setup — school calendar, sizes, medical dates,
reciprocity ledger. Those files are yours, they stay on your machine and your
own cloud drive, and they are gitignored.

The week-ahead page is the one thing that leaves the folder, and it is designed
to leave as a **file, not a link**. The page itself is an HTML file in your data
folder, gitignored like everything else there. Each week it is printed to a
dated PDF — `Week Ahead 2026-09-14.pdf`, named for that week's Monday — in an
archive folder you choose. The PDF is what you send: it needs no account, works
offline, and leaves nothing hosted.

Publishing it as a hosted page is optional and off unless you ask. Either way it
carries schedule information only — no addresses, no phone numbers, no medical
detail beyond the fact of an appointment.

One PDF per week, overwritten as the week updates, so the folder becomes a
readable record of what each week actually looked like rather than a pile of
near-identical drafts.

---

## Structure

```
skills/
  setup/              first-run onboarding, writes your config
  dadmin/      the router and the operating doctrine
  school-ops/         calendar ingestion, deadlines, conferences, IEP
  health-growth/      medical cadence, sizes, seasonal buying
  travel-planner/     booking windows, passports, trip logistics
  social-calendar/    parties, gifts, reciprocity, date nights
  household-seasonal/ camp, afterschool, seasonal, maintenance
  weekly-brief/       the recurring scan and the week-ahead page

reference/
  lead-times.md            how far ahead everything has to happen
  task-chains.md           the second-order tasks
  task-routing.md          where commitments land, and what a good task looks like
  data-sources.md          reading files and mail safely
  week-ahead-artifact.md   the weekly page: spec and template

data/
  config.template.md       the household config
  *.template.md            scaffolds copied into your folder at setup

scripts/                   build and archive the week-ahead page (PowerShell)
  install-paths.ps1        one-time: where your page and PDF archive live
  publish-week-ahead.ps1   prints the dated weekly PDF
  audit/repair-encoding    catch and reverse text corruption
  check-fonts.ps1          asserts doctype, charset, inherited type
```

`scripts/` is optional. The skills work without it; it exists so the weekly page
builds the same way every time instead of being rebuilt by hand. See
`scripts/README.md`, which also documents the two traps that cost the most time:
PowerShell's default encoding, and the missing doctype that silently turns
tables serif.

The two files worth reading if you want to understand the thing:
`reference/lead-times.md` and `reference/task-chains.md`. They are the accumulated
answer to "how far ahead does this actually need to happen", and they are useful
even if you never install this.

---

## Making it yours

Everything here is markdown. Open a skill and edit it.

The lead times are a starting point, not gospel — venue booking windows and camp
registration dates vary a lot by city, and if yours are different, change the
table. The task chains are the same: if your family has a step that always gets
missed, add it.

Pull requests welcome, particularly for lead times in other cities and school
systems, and for task managers not yet supported.

---

## If you are one of the first people trying this

Setup has been written carefully and reviewed, but it has not been run by many
people yet. Something will be wrong. Tell me where it breaks rather than working
around it — a confusing question, a step that did nothing, a place you weren't
sure what it wanted. That is more useful than a bug report about the code.

Two known rough edges:

**Nothing announces setup.** You have to say "set up Dadmin". If you
install it and start asking family questions first, it will not know anything.

**The desktop install path is less tested than the terminal one.** If the plugin
browser will not add the marketplace, ask whoever sent you this for the
packaged `.plugin` file instead — it installs with a click and needs no
terminal.

---

## Credit

The idea is **Sam Dolgin's** — friend, neighbor, and fellow dad, who worked out
that the hard part of parenting logistics is not doing the thing, it is knowing
about the thing early enough for doing it to be cheap.

Everything here is an implementation of that observation. Thanks, Sam.

---

## A note on the name

"Dadmin" is the unglamorous administrative half of parenting — the forms, the
deadlines, the registration windows, the appointment nobody booked. The name is
the job description.

It is not named after, affiliated with, or derived from any film, character or
brand.

---

MIT licensed. Use it, fork it, change it.
