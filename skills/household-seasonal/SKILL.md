---
name: household-seasonal
description: Household and seasonal operations. Use for summer camp and afterschool registration windows, seasonal closet and home swaps, recurring home maintenance, building or landlord requirements, holiday planning, and childcare coverage for school closures. Triggers on camp registration, "what do we need to do before winter", holiday planning, and coverage gaps. Part of the dadmin plugin.
---

# Household and seasonal

The work that has no deadline until suddenly it has a very short one. Camp
registration opens and closes in a week. The first cold day arrives and the
snow boots are a size too small. School closes for eleven days in December and
nobody arranged coverage.

Read `config.md` in your connected folder first. Household details live in the data
folder, at `<data folder>/household.local.md`.

## Housing type

Housing type comes from config. If config does not say, ask. Each type
constrains different work.

| Type | What it constrains |
|---|---|
| Rental | Landlord approval for changes, lease terms, renewal and notice dates |
| Co-op | House rules, board approval, alteration agreements |
| Condo | Building rules, association approval, permitted work windows |
| House | Exterior, roof, gutters, yard, driveway, none of which an apartment has |

Building and association rules constrain more than people expect. Read the
rules before assuming anything is permitted, and cite the specific rule when
stating a constraint.

## Camp and afterschool registration

The highest-stakes seasonal item, because it combines a hard open date, fast
sellouts, real money, and the consequence of an uncovered summer.

**Summer camp registration usually opens January to February.** Popular
programs sell out in days, some in hours. The window varies by market, so
verify the actual open date for each program rather than assuming last year's.

**Decide what the child is doing in December**, before registration opens, not
in March when somebody notices summer is coming.

Sequence:

1. **December**: decide what the child is doing. This is a conversation between
   the parents, not a task Dadmin resolves. Surface it as a decision
   with options.
2. Confirm the exact registration open date and time for each program. Search
   for it; do not assume last year's date.
3. Set a task with a reminder for the open time itself, highest priority.
4. Confirm the login works the day before, and that a payment method is ready.
5. Register at open. Do not browse first.
6. Deposit at registration.
7. Calendar the forms and physical deadline, usually 6 weeks before the session.
8. Buy the required gear from the packing list.

Afterschool and enrichment enrollment opens in August for fall and December for
spring. Same discipline, lower stakes.

## Childcare coverage for school closures

Every school closure is a coverage problem. When the school calendar is
ingested, produce a consolidated list of every closure with the coverage status
for each: covered, uncovered, or needs a decision.

The big ones: winter break (2+ weeks), spring break, any mid-winter break, and
the gap between the last day of school and the first day of camp. **That gap is
routinely a week or two and routinely forgotten.**

Route coverage to `childcare and camp`.

## Seasonal swaps

**Late September** and **late March**. Each swap:

- Clothes: run the seasonal audit from the health-growth skill. Outerwear and
  shoes get checked first, they are what becomes urgent overnight.
- Home: window treatments, humidifier, heavy bedding, and window AC units where
  the building governs them. Check `<data folder>/household.local.md`.
- Gear: snow gear in September before it sells out, rain gear in March.
- Storage: what gets boxed, what gets donated.
- Houses only: gutters, outdoor faucets, storm prep, yard closeout in fall and
  yard opening in spring.

## Holiday planning

| Holiday | Decide by | Notes |
|---|---|---|
| Thanksgiving | Early September | Lock travel dates before fares climb |
| Winter break | September | 2+ weeks of coverage or travel. The biggest single planning item of the year |
| Winter holiday gifts | Start Nov 1, done by Dec 10 | Shipping cutoffs are real |
| Spring break | December | Travel or coverage |
| Summer | December | Camp registration forces the timeline |

The pattern: every holiday decision has to be made roughly a full season before
the holiday, because travel and registration both close early.

## Recurring home maintenance

Track in `<data folder>/household.local.md`. The standing set:

| Item | Cadence | Applies to |
|---|---|---|
| HVAC filter | Quarterly | All |
| Smoke and CO detector batteries | Twice a year, at the daylight saving changes | All |
| Deep clean | Quarterly | All |
| Renters or homeowners insurance review | Annual | All |
| Window AC units in / out | May and October | Apartments with window units |
| Building or landlord work approvals | Before any work | Rental, co-op, condo |
| Gutters, exterior, yard | Spring and fall | House |

## Routing

Route by logical name. The mapping from name to project or list lives in
config; see `reference/task-routing.md`. Never hardcode a project name or ID.

| Item | Route |
|---|---|
| Camp and afterschool registration, coverage | `childcare and camp` |
| Home, maintenance, building, seasonal | `household` |
| Clothes, gear, supplies | `shopping` |
| Camp deposits and tuition | `money` |
| Holiday hosting and gifts | `social and gifts` |

Tag `dadmin` + `household`.
