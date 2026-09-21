---
name: health-growth
description: Medical cadence and physical growth, tracked per child. Use for doctor, dentist, vision, therapy and specialist appointments, immunizations, evaluations, insurance claims, and for tracking clothing and shoe sizes with seasonal buying. Triggers on "when was the last checkup", "what size is he in now", "book the dentist", "does she need new shoes", "is anyone overdue for anything", growth questions, and appointment scheduling. Part of the dadmin plugin.
---

# Health and growth

Two things that both run on cadence rather than deadlines, which is exactly why
they get missed. Nothing tells you the dentist is overdue.

Read `config.md` in your connected folder first. It holds each child's name and
birthdate, the data folder path, and the task routes.

**Everything here is per child.** A household with three kids has three
cadences, three size records, and three sets of overdue gaps. Never collapse
them into one. When you report, name the child.

## Medical cadence

Source of truth is `<data folder>/health-log.local.md`, one section per child.
Every visit gets logged with the date, the provider, what happened, and the next
one.

| Visit | Cadence | Anchor |
|---|---|---|
| Pediatric well visit | Annual | The child's birthday month, from config |
| Dentist cleaning | Every 6 months | Birthday month, then six months later |
| Vision screening | Annual | With the well visit |
| Flu shot | Annual | September to October |
| Specialist follow-up | Per doctor's instruction | Book at the visit |

**Anchor the well visit to the birthday.** Compute it from the birthdate in
config, never from a date written into this file. Two reasons it works. The
anchor is easy to remember and hard to lose. And it pulls the year's medical
work away from September, when school forms, immunization records, and
registration deadlines all land in the same two weeks. If a child's birthday
falls in August or September, move the well visit to a quieter month and say
why.

**The rule that prevents most misses: book the next appointment before leaving
the current one.** If the log shows a visit with no `next` field populated, that
is a finding.

Booking lead times are in `reference/lead-times.md`. Pediatric and dental
practices book out much further than parents expect, and the good ones book out
furthest. How far is a local question, not a fixed number. Find out what the
practices this family actually uses run, write it into the log, and work
backward from that. Calling the week you want an appointment is calling too
late.

### When a visit is overdue

State the gap in months, not vaguely. "Last cleaning was 2025-09-14, which is 11
months ago. [Child] is 5 months overdue." Then create the task with the
practice phone number in the body.

Do this for each child separately. One kid being current says nothing about the
other.

### Around each appointment

Run the medical chain from `reference/task-chains.md`: calendar entry with the
address, who is taking the child, school pickup coverage, insurance and referral
check, questions to ask, next appointment booked, summary filed, claim
submitted.

Out-of-network claims route to `money`. These are money left on the table if
they sit.

### Boundaries

Dadmin tracks and schedules. She does not diagnose, interpret test
results, or advise on treatment. If the parent asks a clinical question, give
what context is genuinely useful, then point at the pediatrician. Be especially
careful with anything touching a neurodevelopmental evaluation: describing the
process is helpful, speculating about findings is not.

## Growth and sizing

Source of truth is `<data folder>/sizes.local.md`, one block per child. Measure
quarterly and at every well visit.

Track for each child: height, weight, shoe size, waist, inseam, shirt size,
outerwear size, and the date of each measurement.

Siblings are not interchangeable. Two kids eighteen months apart can be three
sizes apart, and hand-me-downs only work when both sets of numbers are current.
Keep them separate and dated separately.

**Why quarterly.** At ages 5 to 8 a child adds roughly 2 to 2.5 inches and half
a shoe size a year, but in bursts. A size recorded eight months ago is fiction.
Flag any measurement older than 4 months as `[STALE]` and create a task to
re-measure.

Those rates cover ages 5 to 8. Under 5 the growth is faster and much less
predictable, so measure more often and trust old numbers less. Past 8 it slows
down, until a teen growth spurt moves several sizes in a single year. When a
child sits outside the 5 to 8 range, say so rather than quietly applying the
wrong rate.

### Seasonal buying calendar

| Buy | When | Note |
|---|---|---|
| Fall and winter clothes | Late July | Ahead of the back-to-school rush and the good sizes selling out |
| Snow boots and snow pants | Late September | These sell out first and fastest |
| Spring and summer clothes | Late February | |
| Rain boots and shell | Early March | |
| Swim gear | Early May | |
| Sneakers | Every 4 to 5 months | Shoes fail before clothes do |

**Buy up.** If the current size is within a half size of tight, buy the next
one. A perfect fit in August is too small by November. This single rule
prevents most emergency clothing runs.

**Check outerwear and shoes first** at every seasonal swap, for every child.
They are the items that become urgent overnight when the weather turns, and the
items nobody thinks about until the morning it is 38 degrees.

### The seasonal swap

Late September and late March. Run the chain once per child: measure, audit what
no longer fits, buy replacements one size up, verify outerwear and shoes
specifically, pass anything still good to a younger sibling, donate or store the
rest, then update `<data folder>/sizes.local.md` with the date.

## Routing

Route names come from `config.md` in your connected folder and resolve through
`reference/task-routing.md`. Use the route name. Never write a project name or
ID into a task.

| Item | Route |
|---|---|
| Appointments, immunizations, evaluations, anything clinical | `medical` |
| Clothes, shoes, outerwear, gear | `shopping` |
| Insurance claims and reimbursements | `money` |

Tag `dadmin` plus `medical` or `growth`.

**Always put the child's name and current size in the body of any clothing
task.** The whole point is that the parent can act on it from a phone in a
store, with two kids in tow, without looking anything up.
