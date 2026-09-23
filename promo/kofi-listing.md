# Ko-fi shop listing

Copy for the Dadmin listing at ko-fi.com/cj48744/shop. Pay-what-you-want, same
posture as Best Bot: the plugin is free and MIT on GitHub, and the shop listing
exists so people who do not use a terminal can click one file, and so people who
got value from it have somewhere to put a few dollars.

**Deliverable:** `dadmin.plugin` — built with `node scripts/build-plugin.mjs`.
Rebuild and re-upload on every release so the listing never ships a stale
version.

**Price:** pay what you want, minimum $0.

---

## Title

Dadmin — the family admin nobody scheduled

## Short description

*(the one-liner under the title)*

A Claude plugin that tracks school deadlines, appointments, camp registration
and booking windows — and tells you while acting is still cheap.

## Full description

Nobody emails you when the camp registration window opens. Nobody tells you the
flights are about to climb four hundred dollars, or that the dentist was
fourteen months ago, or that the form is due Friday and the gift for Saturday's
party has not been bought.

None of it is hard. All of it is invisible until it is late.

Dadmin is a Claude plugin that keeps track of the family logistics that fall
through. Once a week it tells you what is coming, what is about to get
expensive, and what you are already behind on. It writes the actions into
whatever task manager you already use, and it publishes a page showing the week
ahead that you can send to your partner.

**What makes it different from a calendar:**

- **It works backwards from deadlines.** Nothing gets scheduled on the day it is
  due. Every obligation gets a lead time, and the task lands on the date when
  acting is still cheap. Camp registration goes on the calendar in December, not
  March.
- **It surfaces the second task.** A party invitation is not one thing, it is
  four: RSVP, gift, ride, and a calendar block so nothing else lands there. Most
  family failures live in items two through four.
- **It tells you the uncomfortable part.** If a registration window closed, it
  says so. If fares are climbing, it says by how much.
- **It never invents a fact about your family.** Sizes, dates, provider names,
  past appointments — these come from your files or from you. If something is
  missing or stale, it says so and asks. A confidently wrong shoe size is worse
  than no shoe size, because you will act on it.

**What you need:** Claude, and a folder to keep data in. A mail connector is
strongly recommended — most of what this finds arrives by email. Calendar and
task-manager connectors are optional and it degrades honestly without them.

**Free and open source.** MIT licensed, the whole thing is on GitHub at
github.com/CR8-OS/dadmin, and you can install it from there without paying
anyone anything. This listing is for the one-click file and for people who want
to chip in. If it caught nothing for you, you owe nothing.

## Tags

claude, claude-plugin, ai, family, parenting, productivity, organization,
mental-load, household, school

## Install instructions (include with the download)

Two ways in.

**Click to install:** download `dadmin.plugin` and open it. Claude handles the
rest.

**From the terminal:**

    /plugin marketplace add CR8-OS/dadmin
    /plugin install dadmin@cr8os-family

Then say **"set up Dadmin"** — nothing prompts you, you have to ask. Setup is
six questions and about two minutes.

Three things make the difference between a thin first week and a useful one:
feed it your school calendar, fill in the last dentist and check-up dates, and
make a mail label called `dadmin` so you can flag anything it would otherwise
miss.
