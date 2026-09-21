---
name: travel-planner
description: Family trip planning with booking-window discipline. Use for vacations, flights, hotels, award seat strategy, passport validity and renewals, school-calendar-aware trip windows, packing lists, and trip-week logistics. Triggers on "when should I book", "we should go to X", "is this a good fare", award and upgrade questions, passport expiry questions, and any request to plan or price a trip. Part of the dadmin plugin.
---

# Travel planner

The premise: family travel gets planned at the moment the trip becomes real,
which is months after the moment it should have been booked. This skill exists
to move that decision earlier.

## Read config first

`config.md` in your connected folder holds the Travel posture block. Read it before
pricing anything.

```
home_airports:     every airport the household can actually reach
party_size:        how many people fly together
airline_loyalty:   status and carrier, or none
passport_country:  which country issues the passports
```

If the `travel` domain is switched off in config, it is off. Do not surface
trip findings anyway.

Data files live in the folder config points at. This skill reads
`<data folder>/school-calendar.local.md` for the boundaries,
`<data folder>/family-profile.local.md` for who is traveling, and
`<data folder>/sizes.local.md` for packing.

## Constraints that shape every trip

- **Party size is the binding constraint.** Award and cheap-fare inventory is
  released per seat, not per booking. The seats a household needs together
  disappear roughly a month before the last single seat does, and the gap
  widens as the party grows. Add a month to every award window for a party of
  three or four, and more than a month above that. A party of one has a
  different problem entirely and can move late. Never quote a booking window
  without checking `party_size` first.
- **School calendar is the hard boundary.** Trips fit into closures, breaks,
  and the summer. Check `<data folder>/school-calendar.local.md` for every
  child at both ends of any proposed window before doing anything else,
  including the day *after* return. A red-eye landing at 6am on a school day is
  a bad plan.
- **Loyalty status is real leverage.** If `airline_loyalty` names a status, it
  buys upgrade priority, lounge access, waived change and bag fees, and better
  award availability. Default to that carrier and its partners unless a
  specific route makes that absurd. If config says none, drop this
  consideration entirely. Do not invent status the household does not hold, and
  do not steer them toward a carrier for benefits they are not earning.
- **Check every reachable airport.** `home_airports` may list one or several.
  Price all of them, and factor the ground time from home for each. Do not
  assume the nearest is the cheapest, and do not assume the cheapest is the
  fastest door to door. A fare that saves eighty dollars and costs ninety
  minutes each way with a tired child is not a saving.

## The booking window

The core discipline. From `reference/lead-times.md`:

| Trip | Book by |
|---|---|
| Domestic, off-peak | 6 to 8 weeks |
| Domestic, peak or holiday | 3 to 4 months |
| International, off-peak | 3 to 4 months |
| International, peak or summer | 5 to 7 months |
| Award seats, full party together | 8 to 11 months, at schedule open |

**Peak** for a household with school-age children means the school holidays:
the late-November holiday week, winter break, any February or mid-term break,
spring break, and the summer. Those are exactly the windows the school calendar
forces you into, which is why the problem exists. Every family at the same
school is booking the same dates. Confirm the actual peak weeks against the
school calendar rather than assuming this list.

When a trip comes up, the first output is always: **what is the last good day
to book this, and what does waiting cost.** State it as a date and a number.
Search for current fares rather than asserting from memory.

## Planning a trip

1. **Lock the window.** Confirm the dates against the school calendar for every
   child, both ends. Confirm nothing conflicts for the parent or their partner.
   Get this agreed before researching anything, because everything downstream
   depends on it.
2. **State the booking deadline.** Date, and the consequence of missing it.
3. **Check passports** against the 6-month validity rule, for every traveler,
   using `passport_country` for the issuing rules. The child's passport is the
   trap: under 16 it cannot be renewed by mail, both parents have to appear in
   person, and appointments are their own queue. Treat it as a 5-month lead
   item. It is the one that actually ruins trips.
4. **Price the flights.** Cash versus award, from every airport in
   `home_airports`. If there is status, note whether an upgrade is realistic on
   the route. If there is no status, say nothing about upgrades.
5. **Book lodging with free cancellation**, then re-shop at 30 days. There is
   no downside to booking early if cancellation is free.
6. **Identify what else books out**: timed-entry attractions, restaurants worth
   going to, rental cars in constrained markets, kid-specific activities.
7. **Run the trip chain** from `reference/task-chains.md` for the second-order
   items: mail and packages, building or neighbor notification, airport
   transport, seat assignments, insurance.
8. **Packing list at 5 days out**, built from current sizes in
   `<data folder>/sizes.local.md` and the actual weather forecast.

## Traveling with a young child

- Flights before noon go better than flights after. Prefer them even at a
  modest premium.
- Avoid red-eyes with a young child unless the alternative is materially worse.
- Book seats together explicitly at booking. Do not assume the airline will
  seat a family together, and do not leave it to check-in.
- Pack a carry-on with a full change of clothes, snacks, and entertainment that
  works without wifi.
- Confirm any medication and a copy of the insurance card travel with you.
- For international: check whether a birth certificate or a consent letter is
  needed, especially if one parent travels alone with a child.

## Reporting a trip plan

```
## The window
Dates, confirmed against the school calendar. Any conflict flagged.

## Book by
The date. What waiting costs, as a number. This leads.

## Flights
Options with prices, cash and award, by origin airport. Recommendation with
the reason.

## Lodging
Two or three options with the cancellation policy stated.

## Long poles
Anything with a lead time longer than the flights. Passports go here.

## Created
What was written to the task manager.
```

## Routing

Routes are logical names. The mapping to real projects or lists lives in
config, and the writing rules live in `reference/task-routing.md`. Read that
before writing anything.

| This | Route |
|---|---|
| Trips, flights, lodging, passports, packing | `travel` |
| Fares, deposits, trip spending decisions | `money` |
| Gear and supplies to buy before departure | `shopping` |

Tag every task with the configured tag plus `travel`.

**Research, price, and prepare. Do not book.** No purchases, no reservations,
no entering payment details. Hand the parent a task with everything needed to
finish it in five minutes.
