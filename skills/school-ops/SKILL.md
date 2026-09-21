---
name: school-ops
description: School operations for every child in the household. Use for ingesting a school calendar, forms and deadlines, parent-teacher conferences, re-enrollment and tuition, district lottery and transfer windows, permission slips, class events, teacher correspondence, and special education evaluation timelines when that domain is switched on. Triggers on "what's due at school", "here is the school calendar", "when is the next day off", conference sign-ups, re-enrollment and tuition questions, and IEP, 504 or evaluation questions. Part of the dadmin plugin.
---

# School ops

School is the densest deadline surface a family has. Most of it arrives as a
PDF in August and then never gets looked at again until something is already
late.

## Read config first

`config.md` in your connected folder holds the Schools block: one row per child, with
the school name, the type, and the email domains that school mails from. Read
it before anything else in this skill.

Three things come out of it and all three change the work:

- **Which children.** One row per child. A household with two kids at two
  schools has two calendars, two rhythms, and two sets of forms. Never merge
  them.
- **School type.** Public, private, parochial, other. This changes the advice,
  not just the vocabulary.
- **Email domains.** How school mail gets found. An empty mail search of the
  wrong domain reads exactly like an all-clear.

If the `school` domain is switched off in config, it is off. Do not surface
school findings anyway.

Data files live in the folder config points at. This skill reads
`<data folder>/school-calendar.local.md` and, when special education is on,
`<data folder>/cse-log.local.md`. The schema for both lives in this repo under
`data/`.

## What school type changes

Read the type for each child before giving advice. The deadline load is
genuinely different.

**Private, parochial, or independent.** The load is contractual and expensive.
Re-enrollment contracts with a signature and a deposit, tuition payment
schedules, financial aid re-application every single year, conference sign-ups
that fill in hours, and forms with hard cutoffs. Missing one costs money or a
seat.

**Public.** The load is jurisdictional and dispersed across the district, not
the building. District calendars that the school itself may not restate,
lottery, choice and magnet application windows, transfer and out-of-zone
requests, kindergarten and middle school and high school admission cycles,
registration verification, and bus or transportation requests that have their
own deadline. Nothing bills you for missing these, which is exactly why they
slip.

Both types share the health forms, the supply lists, the conferences, and the
closures.

If the type is blank in config, ask for that one field. Do not guess from the
school's name.

## Ingesting a school calendar

When the parent provides a calendar (PDF, screenshot, link, email, or paste):

1. Extract every dated item into `<data folder>/school-calendar.local.md` using
   the format in the repo schema at `data/school-calendar.template.md`.
   Preserve the original wording of each event.
2. Classify each item:
   - **Closure.** No school. This is a childcare problem, not a school problem.
     Route coverage to `childcare and camp`.
   - **Deadline.** Something is due. Compute the action date backwards.
   - **Event.** The parent or their partner should attend, or decide whether
     to.
   - **Informational.** No action.
3. For every closure, check whether it is a full day, half day, or early
   dismissal. Half days are the ones that catch people, because they look like
   school days on a calendar.
4. Create tasks for every Deadline and every closure that needs coverage. Do
   not create tasks for informational items.
5. Report the closures as a consolidated list so the parent and their partner
   can plan childcare in one conversation rather than eleven.

Always note the source and the date ingested at the top of the file, so
staleness is visible.

### More than one child

Keep one calendar section per child, labeled with the child's name and school.
Two schools do not share a spring break, and the year one of them takes a
Friday off is the year it goes unnoticed.

After ingesting a second calendar, do one pass across all of them and report:

- Days where every child is out. One coverage problem, one conversation.
- Days where only one child is out. These are worse, because the household
  still runs a normal morning and someone has to notice.
- Deadlines landing in the same week across schools, so the forms get done in
  one sitting.

For public schools, check the district calendar as well as the school's own.
The building sometimes closes for a day the district calendar never mentions,
and the district sometimes closes for one the building never restates.

## The recurring school year rhythm

Northern-hemisphere calendar. Shift by six months for southern, and verify
against the school's own published dates rather than this table.

| When | What | Applies to |
|---|---|---|
| Late July | Health form and immunization records; requires a current physical | all |
| Mid August | Supply list, uniform if applicable, first-day logistics | all |
| Late August | Emergency contact and pickup authorization forms | all |
| Late August | Registration or residency verification for the new year | public |
| September | Back to school night, class parent sign-ups, afterschool enrollment | all |
| October to November | Fall parent-teacher conferences; slots fill in hours | all |
| November to January | Re-enrollment contract and deposit. Hard deadline, seat at stake | private |
| November to January | Financial aid re-application, which is annual and not automatic | private |
| November to March | Lottery, choice, magnet and transfer application windows | public |
| December | Winter break coverage, which is 2+ weeks of childcare | all |
| January to February | Summer camp registration opens; also spring enrichment | all |
| March | Spring conferences; spring break coverage | all |
| March to May | Placement and admission results, plus the appeal window that follows | public |
| April to May | Next-year placement, teacher notes, end-of-year events | all |
| June | Last day, summer packet, camp forms and physical due | all |

Every one of these gets an action date, not the deadline date.

## Deadlines to treat as priority 5

- Re-enrollment contract and deposit (private)
- Tuition payments (private)
- Financial aid re-application (private)
- Lottery, choice, transfer and admission application windows (public)
- Appeal windows after a placement decision (public)
- Health forms with a stated cutoff
- Conference sign-up windows
- Camp registration open dates
- Anything where the school has used the word "final" or "required"

A window that closes at a fixed date and cannot be reopened is priority 5 even
when no money moves. Public school deadlines fail silently, which makes them
easier to miss than a tuition bill, not harder.

## Communication with the school

When drafting mail to teachers or administrators:

- Short, specific, one ask per message. Direct, no hedging.
- Lead with the ask, then the context. Not the reverse.
- Address people by name. Current names are in
  `<data folder>/family-profile.local.md`.
- If the school operates in a language other than the household's, a greeting
  in the school's language is appropriate, but write the substance in whichever
  language the thread is already in.
- **Draft only.** Never send mail on the parent's behalf without explicit
  approval in the conversation. Create the draft, show it, wait.

## Special education

**This section is gated.** It runs only when config has `special_ed: yes`. If
the field is missing or set to no, skip everything below. Do not raise
evaluations, do not hint at them, do not ask whether they apply.

When it is on: an evaluation runs on statutory clocks, and the burden of
keeping it moving falls on the parent. It stalls quietly if nobody pushes.

Standing rules:

- **Follow up every two weeks** once a referral is submitted. Create a
  recurring task for this. Silence from the district is not progress.
- **Log every contact:** date, who, what was said, what they committed to, and
  the next date. Keep it in `<data folder>/cse-log.local.md`. This record
  matters if the timeline is ever disputed.
- **Know the clock.** In the United States, IDEA sets the federal floor: the
  district has 60 days from written parental consent to complete the initial
  evaluation, unless the state sets its own timeline, and many states do. Local
  bodies go by different names (Committee on Special Education, IEP team, child
  study team, student services). **Search for the current rule in the family's
  own district and cite the source when you state a date.** Do not assert a
  timeline from memory. Outside the US, the statutory scheme is different
  entirely and needs to be looked up before anything is promised.
- **Everything in writing.** After any phone call, send a short confirming
  email restating what was agreed. Draft it, do not send it.
- **Private evaluations run in parallel.** Good neuropsychologists book 3 to 5
  months out. If a private eval is in play, that booking is the long pole and
  should be treated as priority 5.
- Coordinate the school-side documentation (the school's own intervention or
  support record, the school psychologist, the teachers) with the district-side
  process. They are separate tracks that need the same evidence.

Do not offer legal advice on special education rights. Lay out the process, the
deadlines, and what the parent can ask for, and note that a special education
advocate or attorney is the right call if the district misses its statutory
timeline.

## Routing

Routes are logical names. The mapping to real projects or lists lives in
config, and the writing rules live in `reference/task-routing.md`. Read that
before writing anything.

| This | Route |
|---|---|
| School forms, deadlines, conferences, evaluations | `school` |
| Tuition, deposits, contract fees | `money` |
| Coverage for closures and half days | `childcare and camp` |

Tag every task with the configured tag plus `school`.
