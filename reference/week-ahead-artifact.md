# The week-ahead page

The visual output of the weekly brief. A published page showing the coming week
as a grid, with what needs doing before it costs something.

Built when config has `artifact: yes`. Skip it entirely when `artifact: no` ═
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

Mark today. Mark closures loudly ═ a school closure is a childcare problem, and
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

**One-off clinical appointments sit between the two.** An evaluation, a
specialist referral, a scan - these are not a standing weekly slot, but naming
the discipline or the clinician still discloses more than the page needs. Take
off **the kind of care and the provider's name**. Keep the logistics, because
without them the entry fails at its job:

- who it is for, and who is taking them
- the date and time
- what it collides with - a school day, a work meeting, another child's pickup
- what is still unknown, and who has to chase it

So: *"Elias - appointment, 9:30am. CJ taking him. A school day; duration still
unknown, and it decides whether he goes back after lunch."* Not *"Elias -
neuropsychological evaluation with Dr. Smith."*

**Whichever reduction applies, apply it everywhere on the page in the same
pass.** A name that comes out of the grid but survives in Act now, the checklist,
or the further-out table has not been removed - it has just been made harder to
notice, which is worse than leaving it. Grep the finished page for the provider's
name and the discipline before publishing.

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
another family's child. List it even when it seems obviously fine ═ the parent
is the one who knows who will see the link.

**Say what the page does not show**, so nothing is a surprise later. If therapy
appointments were reduced to a bare "Appointment" under the rule above, say so.
Silent redaction is its own problem: a parent who does not know something was
withheld cannot correct it.

**Take edits as edits, not as a fresh request.** "Drop the teacher's name" means
change that one entry and publish. Do not rebuild the page or re-ask the other
questions.

**Skip the gate only when the parent has said to** ═ "just publish it", "stop
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

Use the publish script, which handles naming, stamping, and rendering together:

```
scripts/publish-week-ahead.ps1 -StampNow      # content was rebuilt from sources
scripts/publish-week-ahead.ps1                # design-only change, leave the stamp
```

It shells out to headless Chrome, which also works by hand if you need it:

```
chrome --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="<archive>/Week Ahead <yyyy-MM-dd>.pdf" \
  file:///<path to the html>
```

Edge works the same way if Chrome is absent.

### One file per week, named for its Monday

The archive is `Week Ahead <yyyy-MM-dd>.pdf`, where the date is the **Monday**
of the week the page covers - `Week Ahead 2026-09-14.pdf`. These are meant to be
memorialized weekly, so re-running inside the same week **overwrites that week's
file** rather than accumulating copies. The week keeps one artifact, holding its
latest state. ISO dates sort chronologically in the folder listing, which is why
they beat `Sep 14`.

Do not leave an undated `Week Ahead.pdf` in the folder. A file with no week on it
is indistinguishable from a stale one six days later, which is the exact failure
this page exists to prevent.

### Encoding: UTF-8, declared, and verified before publishing

This page carries accented names (Élodie, Apéro, P'tit Déj), em dashes, and box
drawing in the CSS comments. Three rules keep them intact, and all three were
learned by breaking them:

**Declare the charset.** `<meta charset="utf-8">` must be the first line of the
page. The file being valid UTF-8 is not enough — with no declaration, a browser
opening it from disk falls back to the system codepage and every accented name
renders as two garbage characters. The PDF is printed from that same file, so a
missing declaration corrupts the archive too.

**Never round-trip through PowerShell's defaults.** On PowerShell 5.1,
`Get-Content -Raw` reads using the ANSI codepage (CP1252), not UTF-8, and
`Set-Content -Encoding UTF8` writes a BOM. One read/write pair turns every
multi-byte character into mojibake and the BOM into a stray `?` glyph in the
top-left of the page. Use explicit byte I/O instead:

```powershell
$UTF8 = New-Object System.Text.UTF8Encoding($false, $false)   # no BOM
$text = $UTF8.GetString([System.IO.File]::ReadAllBytes($path))
[System.IO.File]::WriteAllText($path, $text, $UTF8)
```

This applies to every script that touches the page — stamping, syncing, or
anything else. A script that only *reads* is still dangerous if it writes
somewhere else afterwards.

**Verify, do not assume.** `scripts/publish-week-ahead.ps1` refuses to publish
a page containing U+FFFD, U+00E2 or U+00C3, so corruption fails loudly instead
of being printed into the weekly archive. `scripts/audit-encoding.ps1` lists
every non-ASCII character with counts; `scripts/repair-encoding.ps1` reverses a
double-encode if one happens anyway. Do not write literal mojibake into a
comment as an example — it trips the guard.

### The "Updated" stamp means content, not printing

The masthead `Updated` line records **when the content was last rebuilt from
sources** - mail, the memo, the calendar, TickTick. It is not the print time.

Re-rendering the same content with new CSS is not an update. Bumping the stamp
for a design change makes the page claim a freshness it does not have, and a
parent who trusts that stamp will skip the re-read that would have caught the
closure. That is why stamping is opt-in via `-StampNow` instead of automatic:
the script cannot tell whether you refreshed the content, so it refuses to guess,
and it prints back what the stamp actually says so a wrong one is visible
immediately.

The page carries print styles that keep it **portrait** but wrap the week to
**two rows of four days** rather than seven columns across. Seven columns on
portrait letter is about an inch each, which nothing readable fits into; four
gives each day close to two inches and still reads left-to-right as a week.
Nothing splits across a page break. Keep that rule if you rework the CSS ═
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
most providers age those out ═ Google Drive keeps them for around 30 days unless
a version is explicitly marked to keep. If a household wants a durable archive,
that is a deliberate choice to make, not a default to assume.

An `agenda_folder` pointing at a **shared** cloud folder is the best answer to
the sharing problem. A partner gets folder access once and always has the
current week, with no link to send, no account to create, and nothing hosted
publicly. Say in one line where the file landed, so it can be found without
hunting.

## Design

A schedule, not a dashboard. It is closer to a wall calendar than to an
analytics page, and it should feel ordered and quiet rather than urgent ═ the
urgency lives in one block at the top, and everything below it is just the week.

**Legibility is the functional requirement, not a preference.** This is read in
about fifteen seconds, on a phone, often one-handed, sometimes by someone who
did not ask for it. Every rule below follows from that.

### One typeface

**Atkinson Hyperlegible Next**, variable 300═800, from Google Fonts. It is drawn
by the Braille Institute specifically to keep similar characters apart ═ `1`/`l`,
`0`/`O`, `rn`/`m` ═ at small sizes and low contrast. On a page that is mostly
dates, times and room numbers, that is the whole job.

One family, with weight doing the work a second family would otherwise do.
Always declare a real fallback stack; a silent fallback on this page costs
legibility, which is the one thing it cannot afford.

### Six sizes, and a floor

```
11px  category labels, section headings, uppercase meta
13px  times, sources, deadlines, the consequence line
15px  body ═ event text, checklist items, memo prose
17px  emphasised events, the action line in Act now
22px  day numbers
clamp(30px, 6vw, 42px)  the masthead
```

**Nothing below 11px, ever.** The version this replaced ran to eleven sizes and
bottomed out at 9.6px ═ not readable on a phone at arm's length, and used for
exactly the labels that carry category.

### Colour does two things

Not six. Earlier revisions gave every event a saturated left border in one of
six category hues, which turned the grid into chrome and left nothing for
genuine signal to stand out against.

- **One accent** ═ used for today, for live deadlines, and for a closed school.
  That last is loud on purpose: a closure is a childcare problem, and it is the
  single most common thing to notice too late.
- **Category gets a 5px dot beside its word.** The dot survives for scanning;
  the word carries the meaning. This satisfies "never by colour alone" by
  construction, because the category is always spelled out.

Everything else is ink on paper.

### The rest

- **Grid**: seven columns on desktop, a stacked list on mobile ═ which is how it
  is actually read on a phone. Let day height follow content; do not stretch
  empty days to match a busy one.
- **Today** gets the accent on its number and a rule across the top of its
  column. Past days in the current week stay visible but recede.
- **Whitespace before rules.** Where a border and more spacing would both work,
  use the spacing.
- **Cap measure.** Prose stops around 62═78ch; the Act now list is capped so a
  deadline stays beside the action it belongs to instead of drifting to the far
  edge of a wide screen.
- **Tabular numerals** for every date and time.
- Both themes, tokens defined on bare `:root`, explicit background on `body`.
- Print cleanly. Some parents will put this on the fridge.

### What minimalism does not mean here

It does not mean less information. Every entry still carries its source, its
uncertainty, and what waiting costs ═ the content rules above are unchanged. The
reduction is in typefaces, type sizes, colours and borders, not in what the page
tells you. Quiet and complete is the target. Quiet because it left things out is
a failure at the page's actual job.


## Template

A working starting point. Fill the data, delete blocks that are empty, and
adjust the accent if the household has a preference. Do not treat it as fixed -
it is a floor, not a ceiling. The type scale and the two-job colour rule above
are the parts worth keeping.

```html
<meta charset="utf-8">
<title>Week of MONTH DAY</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,300..800;1,400&display=swap">

<style>
/* ═══════════════════════════════════════════════════════════════════════
   One typeface. Six sizes. One saturated colour.

   Atkinson Hyperlegible Next is drawn by the Braille Institute to keep
   similar characters apart at small sizes and low contrast — which is the
   job this page has. Nothing here is set below 11px.

   Colour does two things only: marks today, and marks a closed school.
   Categories carry a 5px dot and a word; the word is what does the work.
   ═══════════════════════════════════════════════════════════════════════ */

:root {
  /* Four grounds, each meaning something:
     paper = the page   card = a cell you read
     sunk  = standing facts, always true, never urgent
     tint  = act on this, or this is today                        */
  /* Every ink here clears 4.5:1 on the ground it sits on, and the small
     11px keys clear 7:1 — they are the text most likely to be read at arm's
     length on a kitchen counter, so they get the most contrast, not the least. */
  --paper:    #E7E5DD;
  --card:     #FFFFFF;
  --card-2:   #EFECE2;
  --sunk:     #D8D5CB;
  --tint:     #FAEBE6;
  --ink:      #121415;
  --ink-2:    #3F4547;
  --ink-3:    #5C6366;
  --rule:     #C9C6BC;
  --rule-2:   #A29E94;
  --mark:     #97281D;
  --mark-bg:  #F2DBD5;

  --school:   #35578A;
  --medical:  #8A3B49;
  --activity: #7A5622;
  --social:   #2B6344;
  --travel:   #275E69;
  --closure:  #97281D;

  --s1: 11px; --s2: 13px; --s3: 15px; --s4: 17px; --s5: 22px;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper:   #0C0E0F;
    --card:    #1E2325;
    --card-2:  #171B1C;
    --sunk:    #060809;
    --tint:    #37211D;
    --ink:     #F1F3F3;
    --ink-2:   #BAC1C4;
    --ink-3:   #949B9F;
    --rule:    #343A3C;
    --rule-2:  #4C5356;
    --mark:    #FF9585;
    --mark-bg: #452A26;

    --school:   #A6C1EE;
    --medical:  #EDA4B0;
    --activity: #E8C184;
    --social:   #8DD2AB;
    --travel:   #87CCD7;
    --closure:  #FF9585;
  }
}
:root[data-theme="dark"] {
  --paper:   #0C0E0F;
  --card:    #1E2325;
  --card-2:  #171B1C;
  --sunk:    #060809;
  --tint:    #37211D;
  --ink:     #F1F3F3;
  --ink-2:   #BAC1C4;
  --ink-3:   #949B9F;
  --rule:    #343A3C;
  --rule-2:  #4C5356;
  --mark:    #FF9585;
  --mark-bg: #452A26;

  --school:   #A6C1EE;
  --medical:  #EDA4B0;
  --activity: #E8C184;
  --social:   #8DD2AB;
  --travel:   #87CCD7;
  --closure:  #FF9585;
}

*, *::before, *::after { box-sizing: border-box; }

/* Belt and braces for the quirks-mode trap above: tables and form controls are
   the elements that historically refuse to inherit type. Say it explicitly so
   the page keeps one typeface even if it is embedded somewhere unexpected. */
table, th, td, button, input, select, textarea {
  font-family: inherit; font-size: inherit; line-height: inherit; color: inherit;
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: "Atkinson Hyperlegible Next", "Atkinson Hyperlegible",
               -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  font-size: var(--s3);
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  padding: 0 20px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.wrap { max-width: 1120px; margin: 0 auto; padding-block: 40px 72px; }

/* ── masthead ──────────────────────────────────────────────────────── */
.masthead { margin-bottom: 40px; }
.masthead h1 {
  font-size: clamp(30px, 6vw, 42px);
  font-weight: 800;
  letter-spacing: -0.022em;
  line-height: 1.05;
  margin: 0;
  text-wrap: balance;
}
.masthead .meta {
  display: flex; flex-wrap: wrap; gap: 6px 20px;
  font-size: var(--s2); color: var(--ink-2); margin-top: 10px;
}
.masthead .meta span { position: relative; }
.masthead .meta span + span::before {
  content: ""; position: absolute; left: -11px; top: .55em;
  width: 3px; height: 3px; border-radius: 50%; background: var(--ink-3);
}

/* ── section headings — one treatment, used everywhere ─────────────── */
h2 {
  font-size: var(--s1);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  margin: 0 0 16px;
}

/* ── act now ───────────────────────────────────────────────────────── */
.alert { margin-bottom: 40px; }
.alert ol {
  margin: 0; padding: 0; list-style: none;
  display: grid; gap: 1px;
  background: var(--rule);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--mark);
  /* Capped so the deadline stays beside the action it belongs to, rather
     than drifting to the far edge of a wide screen. */
  max-width: 86ch;
}
.alert li {
  background: var(--tint);
  padding: 15px 20px 17px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 20px;
  align-items: baseline;
}
.alert .what { font-size: var(--s4); font-weight: 700; letter-spacing: -0.008em; }
.alert .when {
  font-size: var(--s2); font-weight: 600; color: var(--mark);
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.alert .cost {
  grid-column: 1 / -1;
  font-size: var(--s2); color: var(--ink-2); line-height: 1.55;
  max-width: 78ch;
}
.alert .cost strong { color: var(--ink); font-weight: 700; }

/* ── the week ──────────────────────────────────────────────────────── */
/* Real cells on a toned ground. The gap is the separator, not a hairline. */
.week {
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  /* A quiet day should look quiet. Do not stretch it to match a busy one. */
  align-items: start;
  margin-bottom: 14px;
}
.day {
  background: var(--card);
  border: 1px solid var(--rule);
  padding: 11px 12px 16px;
  display: flex; flex-direction: column; gap: 12px;
  min-width: 0;
}
/* Weekends are a different kind of day, so they get a different ground. */
.day.is-weekend { background: var(--card-2); }
.day.is-today {
  background: var(--tint);
  border-color: var(--mark);
}
.day > header {
  display: flex; align-items: baseline; gap: 7px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--rule);
}
.dnum {
  font-size: var(--s5); font-weight: 700; line-height: 1;
  font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
}
.dow {
  font-size: var(--s1); font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--ink-2);
}
.is-today .dnum,
.is-today .dow { color: var(--mark); }
.is-today > header { border-bottom-color: var(--mark); }
.is-past { opacity: .5; }

/* events — no coloured borders; a dot and a word */
.ev { font-size: var(--s3); line-height: 1.35; }
.ev .t {
  display: block; font-size: var(--s2); font-weight: 600;
  color: var(--ink-2); font-variant-numeric: tabular-nums;
  margin-bottom: 1px;
}
.ev .k {
  display: block; font-size: var(--s1); color: var(--ink-2);
  margin-top: 3px; padding-left: 11px; position: relative;
  line-height: 1.35;
}
.ev .k::before {
  content: ""; position: absolute; left: 0; top: .45em;
  width: 5px; height: 5px; border-radius: 50%; background: var(--ink-3);
}
.ev.school   .k::before { background: var(--school); }
.ev.medical  .k::before { background: var(--medical); }
.ev.activity .k::before { background: var(--activity); }
.ev.social   .k::before { background: var(--social); }
.ev.travel   .k::before { background: var(--travel); }
.ev.big { font-size: var(--s4); font-weight: 700; letter-spacing: -0.008em; }

/* the one loud thing: a closed school is a childcare problem */
.ev.flag {
  background: var(--mark-bg);
  border-left: 3px solid var(--closure);
  padding: 7px 10px; font-weight: 700;
}
.ev.flag .k { color: var(--ink-2); }
.ev.flag .k::before { background: var(--closure); }

/* ── standing band ─────────────────────────────────────────────────── */
/* Standing facts: always true, never urgent. Recessed, not raised. */
.band {
  display: flex; flex-wrap: wrap; gap: 6px 28px;
  font-size: var(--s2); color: var(--ink-2);
  background: var(--sunk);
  border: 1px solid var(--rule);
  padding: 11px 16px;
  margin-bottom: 40px;
}
.band strong { color: var(--ink); font-weight: 700; }

/* ── lower two columns ─────────────────────────────────────────────── */
.lower { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 40px; align-items: start; }

/* Due is a surface you work through, so it gets a surface. The memo is
   reading, so it stays on the page ground. */
.lower .worklist {
  background: var(--card); border: 1px solid var(--rule); padding: 18px 20px 20px;
}
.due { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
.due li { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; }
.box {
  width: 15px; height: 15px; margin-top: 3px;
  border: 1.5px solid var(--ink-3); border-radius: 2px; flex: none;
}
.due .lbl { font-size: var(--s3); font-weight: 600; line-height: 1.35; }
.due .when {
  font-size: var(--s2); color: var(--ink-2); font-variant-numeric: tabular-nums;
}
.due .src { font-size: var(--s2); color: var(--ink-3); }
.due li.hot .box { border-color: var(--mark); border-width: 2px; }
.due li.hot .when { color: var(--mark); font-weight: 700; }

.memo { display: grid; gap: 18px; }
.memo .tag {
  display: block; font-size: var(--s1); font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-2);
  margin-bottom: 3px;
}
.memo p { margin: 0; font-size: var(--s3); line-height: 1.5; max-width: 62ch; }
.memo .hl .tag { color: var(--mark); }
.memo strong { font-weight: 700; }

/* ── horizon ───────────────────────────────────────────────────────── */
.horizon { margin-bottom: 36px; }
/* Capped like every other block here. Left to run at full page width the
   description column reaches ~140 characters a line, which is roughly twice
   a comfortable measure and far longer than anything else on the page. */
.horizon table { border-collapse: collapse; width: 100%; max-width: 98ch; }
.horizon tr { border-top: 1px solid var(--rule); }
.horizon tr:last-child { border-bottom: 1px solid var(--rule); }
/* Cells are inset from the rule ends rather than flush against them, so the
   table matches the padded surfaces above it instead of looking unlined. */
.horizon td {
  padding: 13px 16px; vertical-align: top;
  font-size: var(--s3); line-height: 1.45;
}
.horizon td:first-child {
  white-space: nowrap; width: 1%;
  padding-left: 0; padding-right: 20px; padding-top: 15px;
  font-weight: 700; font-variant-numeric: tabular-nums; font-size: var(--s2);
  color: var(--ink-2);
}
.horizon td:last-child { padding-right: 4px; }
.horizon td strong { font-weight: 700; }

footer {
  border-top: 1px solid var(--rule); padding-top: 16px;
  font-size: var(--s2); color: var(--ink-2); line-height: 1.55; max-width: 74ch;
}

/* ── phone: the week becomes a list, which is how it is actually read ─ */
@media (max-width: 880px) {
  .wrap { padding-block: 28px 56px; }
  .week { grid-template-columns: 1fr; border-top: 0; }
  .day {
    border-right: 0; border-top: 1px solid var(--rule);
    padding: 14px 0 18px; gap: 11px;
  }
  .day:empty { display: none; }
  .is-today::before { right: 0; }
  .lower { grid-template-columns: 1fr; gap: 32px; }
  .alert li { grid-template-columns: 1fr; gap: 3px; }
  .alert .when { justify-self: start; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
}

/* ── print: portrait, two rows of four. Seven across is unreadable. ─── */
@media print {
  /* Keep the grounds on paper — they carry meaning, not decoration — but
     lighten them so they survive a cheap printer without going muddy. */
  :root {
    --paper: #fff; --card: #fff; --card-2: #F4F3EF; --sunk: #EEEDE8;
    --tint: #F5EDEA; --ink: #000; --ink-2: #444; --ink-3: #666;
    --rule: #bbb; --rule-2: #999; --mark: #000; --mark-bg: #EFE6E3;
  }
  .day, .band, .alert li, .alert ol, .lower .worklist { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { background: #fff; padding: 0; font-size: 10.5pt; }
  .wrap { max-width: none; padding: 0; }
  @page { size: portrait; margin: 14mm 12mm; }

  .masthead { margin-bottom: 16px; }
  .masthead h1 { font-size: 22pt; }

  .alert { margin-bottom: 18px; }
  .alert li { padding: 8px 12px 9px; }
  .alert .what { font-size: 11.5pt; }
  .alert .cost { font-size: 9pt; }

  .week { grid-template-columns: repeat(4, 1fr); gap: 4px; margin-bottom: 10px; }
  .day { padding: 8px 9px 11px; gap: 8px; }
  .dnum { font-size: 14pt; }
  .ev { font-size: 9.5pt; }
  .ev.big { font-size: 10.5pt; }
  .is-past { opacity: 1; }

  .band { margin-bottom: 18px; padding: 8px 12px; }
  .lower { gap: 20px; margin-bottom: 18px; }
  .lower .worklist { padding: 12px 14px 14px; }
  .due { gap: 10px; }
  .memo { gap: 11px; }
  .horizon { margin-bottom: 16px; }
  .horizon table { max-width: none; }
  .horizon td { padding: 7px 12px; }
  .horizon td:first-child { padding-left: 0; padding-right: 14px; padding-top: 8px; }
  .horizon td:last-child { padding-right: 0; }

  /* nothing splits across a page break */
  .day, .due li, .memo > div, .horizon tr, .alert li { break-inside: avoid; page-break-inside: avoid; }
  .week, .alert, .lower section { break-inside: avoid; }
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
    <ol>
      <li>
        <span class="what">ACTION</span>
        <span class="when">by DATE</span>
        <span class="cost">WHAT WAITING COSTS</span>
      </li>
    </ol>
  </div>

  <div class="week">
    <!-- One .day per day. Add is-today / is-past as appropriate. -->
    <div class="day is-today">
      <header><span class="dnum">8</span><span class="dow">Mon &middot; today</span></header>
      <div class="ev school"><span class="t">8:30am</span>EVENT<span class="k">School</span></div>
      <!-- .flag is the loud one: closures, no-school days, uniform days -->
      <div class="ev flag">NO SCHOOL<span class="k">Closure</span></div>
    </div>
  </div>

  <!-- Standing facts that are true every week. Delete when there are none. -->
  <div class="band">
    <span><strong>Every week this term:</strong> RECURRING PATTERN</span>
  </div>

  <div class="lower">
    <section>
      <h2>Due</h2>
      <ul class="due">
        <li class="hot">
          <span class="box"></span>
          <span>
            <span class="lbl">THING</span><br>
            <span class="when">due DATE</span> &middot;
            <span class="src">where it came from</span>
          </span>
        </li>
      </ul>
    </section>
    <section>
      <h2>From the school memo</h2>
      <div class="memo">
        <div class="hl">
          <span class="tag">SOURCE AND DATE</span>
          <p>NOTE</p>
        </div>
      </div>
    </section>
  </div>

  <!-- Dated things beyond this week that the memo already announced -->
  <div class="horizon">
    <h2>Further out, from the same memo</h2>
    <table>
      <tr><td>DATE</td><td>WHAT</td></tr>
    </table>
  </div>

  <footer>
    WHERE THIS CAME FROM, AND ANYTHING STILL OPEN.
  </footer>

</div>
```
