# Task routing

Where commitments land, and what a good task looks like.

Read `config.md` in your connected folder first. The `Task manager` section names the
tool and maps each logical route to a real project or list. **Skills refer only
to logical routes.** Never hardcode a project name or ID into a skill file — it
belongs to one household and breaks for everyone else.

## The routes

Eight logical routes cover everything this plugin generates.

| Route | Send here |
|---|---|
| `school` | Forms, deadlines, conferences, teacher contact, re-enrollment |
| `medical` | Appointments, prescriptions, claims, evaluations |
| `travel` | Trips, flights, lodging, passports |
| `social and gifts` | Parties, RSVPs, gifts, thank-yous, date nights, anniversaries |
| `childcare and camp` | Camp, afterschool, sitters, coverage for closures |
| `household` | Maintenance, seasonal work, building and home |
| `shopping` | Clothes, gear, supplies |
| `money` | Tuition, deposits, reimbursements, budget decisions |

If a task has no obvious home, use the configured `fallback` and **say so in the
report**. Never invent a project.

## When no task manager is configured

`manager: none` is a legitimate choice, not a degraded state.

The brief still runs and still finds everything. It reports instead of writing,
and the report carries the same specificity a task would have: the action, the
date to do it, and everything needed at the moment of acting. Do not nag someone
who chose this to connect a tool.

## Task construction

The format is what makes the difference between a task that gets done and a task
that gets scrolled past.

```
title      Imperative verb, object, and the constraint that makes it urgent.
           Under about 80 characters.
body       Everything needed at the moment of action. Phone numbers, logins,
           prices, confirmation numbers, sizes, links, the real deadline, and
           where the fact came from.
due        The ACTION date, computed backwards from the deadline.
           Never the deadline itself.
priority   Highest  hard external deadline, money or a seat at stake
           Medium   real deadline, recoverable if it slips
           Low      should happen, no cliff
           None     someday
tag        The tag from config, on every task without exception.
reminder   One day before, for high and medium. Skip for low.
```

**The constraint in the title is the whole trick.** "Book dentist" gets ignored.
"Book dentist — last cleaning was 8 months ago, they book 6 weeks out" gets
done, because it carries its own justification.

**The body exists for one moment**: the parent standing in a store or sitting in
a waiting room with their phone. If they have to go look something up, the task
failed.

Set the due date on the action date. Put the actual deadline in the body. A task
due the day something is due is a task that arrives too late to act on.

## Priority discipline

Reserve the top level for hard external deadlines where money or a seat is at
stake: registration open dates, re-enrollment contracts, fare cliffs, anything
the school called required.

Everything cannot be urgent. Overusing high priority destroys the signal, and
once the signal is gone the whole system is just another list being ignored.

## Before writing anything

**Search the task manager first.** Most parents already track a lot manually,
and a duplicate is worse than nothing because it trains them to stop trusting
the list.

If a task exists but is wrong — bad date, missing detail — update it rather than
creating a second one. Most APIs need the full object to update: fetch, modify,
write back.

When more than about three tasks come out of one planning pass, batch the write
and group by project.

## Tags and domains

Every task carries the configured tag, plus a domain tag: `school`, `medical`,
`travel`, `social`, `household`, `growth`.

One tag on everything means the parent can filter, audit, or delete the entire
output of this plugin in a single move. That reversibility is the price of being
allowed to write into someone's task manager at all.

## A worked example

Good:

```
title    Book the 6-year well visit — school health form is due Sep 1
due      July 15 (the action date)
body     Dr. Chen, (212) 555-0188. Last visit 2025-09-14, from health-log.
         School requires an updated form by Sep 1. The practice books about
         six weeks out, so calling now is the last comfortable moment.
         Ask them to send the form directly to the school nurse.
priority highest
tags     dadmin, medical
```

Bad:

```
title    Doctor appointment
due      Sep 1
```

The second one has no action, no context, arrives on the deadline rather than in
time to act, and will be looked at and closed without anything happening.
