# The week-ahead page

The visual output of the weekly brief. A published page showing the coming week
as a grid, with what needs doing before it costs something.

Built when config has `artifact: yes`. Skip it entirely when `artifact: no` —
the chat brief is the whole deliverable then.

## Who it is for

Not the parent who asked for it. **Their partner, or the other adult who needs
to know what is happening this week without reading a task manager.**

That single fact settles most design questions. It has to be readable in
fifteen seconds on a phone, make sense to someone who was not part of the
conversation that produced it, and be sendable without editing.

## What goes on it

Four blocks, in this order. Drop any that is empty rather than showing an empty
shell.

**1. Act now.** The money and seats block. Booking windows crossing this week,
registration opening, anything with a fare cliff or a sellout risk. Each line
carries the action, the real deadline, and **what waiting costs, as a number or
a concrete consequence.** This block leads because it is the only one where
delay is expensive. If it is empty, the week is calm and the grid leads.

**2. The week.** Seven day columns. Every dated thing: school events, closures
and half days, appointments, activities, parties, travel, and anything due that
day. Category is carried by color and repeated in text, never by color alone.

Mark today. Mark closures loudly — a school closure is a childcare problem, and
it is the single most common thing to notice too late.

**3. Due this week.** Forms, RSVPs, sign-ups, payments. Checkbox-shaped, because
this is the block people work through. Each line says what it is, when it is
due, and where it came from, so nobody has to go digging for the original email.

**4. From the school memo.** Whatever the week's school communication actually
said, in plain language. Field trip needs a permission slip. Pajama day
Thursday. Picture day retakes. These are low-stakes individually and they are
exactly what gets missed, because they arrive in a newsletter nobody finishes
reading.

## Rules for the content

**Never invent an entry to fill the grid.** An empty Wednesday is information.
A fabricated one is a trap.

**Say where things came from.** "From the Sept 4 school memo", "from your
calendar", "from the Chase Travel confirmation". The parent needs to know
whether to trust it and where to look for detail.

**Mark uncertainty inline.** If a time is unconfirmed or a date is disputed,
say so on the entry itself. Do not silently pick the likelier one.

**Respect the domain switches.** A household with `travel: no` gets no travel
entries, and no note about what they are missing.

**Everything on this page is family data.** Publishing is opt-in through config
precisely because it puts a child's schedule on a hosted page. Do not add
addresses, phone numbers, medical detail beyond the fact of an appointment, or
anything financial beyond a price already discussed. "Dentist, 3pm" is right.
"Dentist, 3pm, re: the cavity on the lower left" is not.

**Mental-health appointments get less than that.** Therapy, counselling,
psychiatry, and substance-related appointments appear as a bare
**"Appointment"** with the time. No practice name, no provider, no clinician,
nothing that identifies the kind of care, and no indication of which family
member it belongs to.

This is not squeamishness. The page is a URL. It gets texted to a partner,
left open on a laptop, glanced at over a shoulder, and it outlives the week it
describes. A dentist appointment surviving all that is fine. A standing
Thursday therapy slot is a disclosure the person in it did not agree to make,
and the calendar is not the place they should have to make it.

The private chat brief is different, and can name what it needs to. **The
distinction is the page's shareability, not the information's importance.**

If a household marks specific senders as sensitive in their mail config, honor
that first. Where nothing is marked, apply the rule above by inference from the
sender or the appointment type, and err toward saying less.

## Show it before you publish it

**Never publish without showing what is on it first.** Publishing puts a child's
week on a hosted URL. That is a one-way door: the link gets texted, forwarded,
and left open, and it outlives the week it describes.

So the last step before publishing is a short manifest in chat, not the page
itself:

```
About to publish. Here is what goes on the page:

Grid        11 entries across 7 days
Act now     3 items
Due         6 items
From school 4 notes

Worth a look before it goes up:
- "Neuropsychological evaluation, 9:30am" names the kind of care
- "Ms. Davis, Room 323" names a teacher and a room number
- The picnic entry includes the address

Publish, or tell me what to cut.
```

Three rules for that manifest:

**Flag by category, not by vibe.** Anything medical beyond "Appointment", any
third party's name, any address, anything financial, anything about a sibling or
another family's child. List it even when it seems obviously fine — the parent
is the one who knows who will see the link.

**Say what the page does not show**, so nothing is a surprise later. If therapy
appointments were reduced to a bare "Appointment" under the rule above, say so.
Silent redaction is its own problem: a parent who does not know something was
withheld cannot correct it.

**Take edits as edits, not as a fresh request.** "Drop the teacher's name" means
change that one entry and publish. Do not rebuild the page or re-ask the other
questions.

**Skip the gate only when the parent has said to** — "just publish it", "stop
asking me every week". Record that in config as `artifact_review: no` and
respect it. Some people want the gate once and never again; some want it every
time. Neither is wrong.

## Building it

Write the HTML to a file, show the manifest above, then publish with the
Artifact tool once the parent says go.

**Republish to the same URL each week** by passing the stored artifact URL, so
the link the parent already sent their partner keeps working and always shows
the current week. Record that URL in `<data folder>/week-ahead-url.local.md` on
first publish and read it on every run after.

Title it for the week: `Week of September 8`. Keep the favicon stable across
weeks.

## Write a PDF alongside it

Publish the page, then render the same HTML to a PDF in the data folder.

**This is not a fallback, it is the copy that gets sent.** Artifact sharing is
account-scoped, so a partner outside the owner's organization often cannot be
granted access at all without switching the page to anyone-with-the-link. A PDF
sidesteps the question: it goes by text or email, needs no account, works
offline, and leaves nothing hosted.

Render it with headless Chrome against the local file:

```
chrome --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf=<data folder>/week-ahead.pdf \
  file:///<path to the html>
```

Edge works the same way if Chrome is absent.

The page carries print styles that keep it **portrait** but wrap the week to
**two rows of four days** rather than seven columns across. Seven columns on
portrait letter is about an inch each, which nothing readable fits into; four
gives each day close to two inches and still reads left-to-right as a week.
Nothing splits across a page break. Keep that rule if you rework the CSS —
reverting to a flat seven-column grid in print is the obvious change and it
makes the printout worse.

### Where to put it

If config sets `agenda_folder`, write it there. Otherwise put it in the data
folder.

**One file, overwritten in place.** `Week Ahead.pdf`, same name every week.

Not dated filenames. A shared folder that accumulates a PDF a week is a folder
nobody opens by March, and the partner it exists for has to work out which one
is current. One file at a stable path means the link, the bookmark, and the
phone shortcut all keep working, and "the agenda" is unambiguous.

The history is not lost: cloud storage keeps prior versions of an overwritten
file. **Say once that version history is where old weeks live**, and note that
most providers age those out — Google Drive keeps them for around 30 days unless
a version is explicitly marked to keep. If a household wants a durable archive,
that is a deliberate choice to make, not a default to assume.

An `agenda_folder` pointing at a **shared** cloud folder is the best answer to
the sharing problem. A partner gets folder access once and always has the
current week, with no link to send, no account to create, and nothing hosted
publicly. Say in one line where the file landed, so it can be found without
hunting.

## Design

A schedule, not a dashboard. It is closer to a wall calendar than to an
analytics page, and it should feel ordered and quiet rather than urgent — the
urgency lives in one block at the top, and everything below it is just the week.

- **Grid**: seven columns on desktop, stacked full-width on mobile. Let day
  height follow content; do not stretch empty days to match a busy one.
- **Category color carries meaning**, so keep the surrounding palette restrained
  and let those be the only saturated things on the page.
- **Today** gets a visible marker. Past days in the current week stay visible but
  recede.
- **Tabular numerals** for dates and times.
- Both themes, tokens defined on bare `:root`, explicit background on `body`.
- Print cleanly. Some parents will put this on the fridge.

## Template

A working starting point. Fill the data, delete blocks that are empty, and
adjust the palette if the household has a preference. Do not treat it as fixed —
it is a floor, not a ceiling.

```html
<title>Week of MONTH DAY</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600;700&display=swap">
<style>
  :root {
    --paper: #F6F7F4;
    --card: #FFFFFF;
    --ink: #1A2420;
    --ink-soft: #5C6862;
    --rule: #DDE2DC;
    --today: #2E5E4E;

    --school: #3D5A98;
    --medical: #A63D52;
    --activity: #B0742A;
    --social: #2E7D53;
    --travel: #2A6F7A;
    --closure: #8A4B2A;

    --alert-bg: #FBF3E8;
    --alert-rule: #D9A441;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --paper: #141917; --card: #1C2320; --ink: #E8EDE9; --ink-soft: #93A099;
      --rule: #2C3531; --today: #6BB394;
      --school: #8FA9E0; --medical: #E58A9C; --activity: #E0AC63;
      --social: #6FC395; --travel: #6FB8C4; --closure: #D0906B;
      --alert-bg: #2A2317; --alert-rule: #B98D3A;
    }
  }
  :root[data-theme="dark"] {
    --paper: #141917; --card: #1C2320; --ink: #E8EDE9; --ink-soft: #93A099;
    --rule: #2C3531; --today: #6BB394;
    --school: #8FA9E0; --medical: #E58A9C; --activity: #E0AC63;
    --social: #6FC395; --travel: #6FB8C4; --closure: #D0906B;
    --alert-bg: #2A2317; --alert-rule: #B98D3A;
  }

  * { box-sizing: border-box; }
  body {
    background: var(--paper); color: var(--ink);
    font-family: Archivo, system-ui, sans-serif;
    line-height: 1.45; margin: 0; padding: 28px 20px 64px;
  }
  .wrap { max-width: 1180px; margin: 0 auto; }

  .masthead { border-bottom: 2px solid var(--ink); padding-bottom: 14px; margin-bottom: 26px; }
  .masthead h1 {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: clamp(2.1rem, 5vw, 3.1rem); font-weight: 400;
    margin: 0; letter-spacing: -0.01em; text-wrap: balance;
  }
  .masthead .meta {
    display: flex; flex-wrap: wrap; gap: 14px; justify-content: space-between;
    font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.09em;
    color: var(--ink-soft); margin-top: 8px;
  }

  .alert {
    background: var(--alert-bg); border-left: 3px solid var(--alert-rule);
    padding: 16px 20px; margin-bottom: 28px;
  }
  .alert h2 {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em;
    margin: 0 0 12px; color: var(--ink-soft);
  }
  .alert ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 11px; }
  .alert li { display: grid; grid-template-columns: 1fr auto; gap: 6px 18px; align-items: baseline; }
  .alert .what { font-weight: 600; }
  .alert .when { font-size: 0.8rem; color: var(--ink-soft); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .alert .cost { grid-column: 1 / -1; font-size: 0.86rem; color: var(--ink-soft); }

  .week { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); }
  .day { background: var(--card); padding: 12px 11px 16px; min-height: 130px; display: flex; flex-direction: column; gap: 9px; }
  .day.is-today { background: color-mix(in srgb, var(--today) 8%, var(--card)); }
  .day.is-past { opacity: 0.55; }
  .day header { display: flex; align-items: baseline; gap: 7px; border-bottom: 1px solid var(--rule); padding-bottom: 7px; }
  .dow { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-soft); }
  .dnum { font-size: 1.15rem; font-weight: 700; font-variant-numeric: tabular-nums; }
  .is-today .dnum { color: var(--today); }
  .is-today .dow::after { content: " · today"; color: var(--today); }

  .ev { font-size: 0.83rem; border-left: 3px solid var(--rule); padding-left: 8px; }
  .ev .t { font-variant-numeric: tabular-nums; color: var(--ink-soft); font-size: 0.76rem; display: block; }
  .ev .k { font-size: 0.63rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); display: block; margin-top: 2px; }
  .ev.school { border-color: var(--school); }
  .ev.medical { border-color: var(--medical); }
  .ev.activity { border-color: var(--activity); }
  .ev.social { border-color: var(--social); }
  .ev.travel { border-color: var(--travel); }
  .ev.closure { border-color: var(--closure); background: color-mix(in srgb, var(--closure) 10%, transparent); padding: 6px 8px; font-weight: 600; }

  .lower { display: grid; grid-template-columns: 1fr 1fr; gap: 34px; margin-top: 34px; }
  .lower h2 {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--ink-soft); margin: 0 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--rule);
  }
  .due { list-style: none; margin: 0; padding: 0; display: grid; gap: 13px; }
  .due li { display: grid; grid-template-columns: auto 1fr; gap: 11px; align-items: start; }
  .box { width: 15px; height: 15px; border: 1.5px solid var(--ink-soft); border-radius: 3px; margin-top: 3px; }
  .due .when { font-size: 0.78rem; color: var(--ink-soft); font-variant-numeric: tabular-nums; }
  .due .src { font-size: 0.74rem; color: var(--ink-soft); font-style: italic; }
  .memo { display: grid; gap: 13px; font-size: 0.9rem; }
  .memo p { margin: 0; }
  .memo .src { font-size: 0.74rem; color: var(--ink-soft); font-style: italic; }

  @media (max-width: 860px) {
    .week { grid-template-columns: 1fr; }
    .day { min-height: 0; }
    .day:empty { display: none; }
    .lower { grid-template-columns: 1fr; gap: 26px; }
  }
  @media print {
    body { background: #fff; padding: 0; }
    .alert { border-left-width: 2px; }
  }
</style>

<div class="wrap">
  <div class="masthead">
    <h1>Week of MONTH DAY</h1>
    <div class="meta">
      <span>HOUSEHOLD</span>
      <span>Updated MONTH DAY</span>
    </div>
  </div>

  <!-- Delete this block entirely when nothing is closing this week -->
  <div class="alert">
    <h2>Act now</h2>
    <ul>
      <li>
        <span class="what">ACTION</span>
        <span class="when">by DATE</span>
        <span class="cost">WHAT WAITING COSTS</span>
      </li>
    </ul>
  </div>

  <div class="week">
    <!-- One .day per day. Add is-today / is-past as appropriate. -->
    <div class="day">
      <header><span class="dnum">8</span><span class="dow">Mon</span></header>
      <div class="ev school"><span class="t">8:30am</span>EVENT<span class="k">School</span></div>
    </div>
  </div>

  <div class="lower">
    <section>
      <h2>Due this week</h2>
      <ul class="due">
        <li>
          <span class="box"></span>
          <span>THING<br><span class="when">due DATE</span> · <span class="src">source</span></span>
        </li>
      </ul>
    </section>
    <section>
      <h2>From the school memo</h2>
      <div class="memo">
        <p>NOTE</p>
        <p class="src">SOURCE AND DATE</p>
      </div>
    </section>
  </div>
</div>
```
