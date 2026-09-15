# Changelog

## 2.1.0 — 2026-09-15

The week-ahead page grew a build process, after a week of it being rebuilt by
hand and breaking in the same two ways each time.

### Added

- **`scripts/`.** Build and archive tooling for the weekly page:
  `install-paths.ps1` (one-time path setup), `publish-week-ahead.ps1`,
  `audit-encoding.ps1`, `repair-encoding.ps1`, `check-fonts.ps1`,
  `shoot-both-themes.ps1`, `sync-spec-template.ps1`, `recycle.ps1`. Optional —
  the skills work without them.
- **Dated weekly PDF archive.** One file per week named for that week's Monday
  (`Week Ahead 2026-09-14.pdf`), overwritten as the week updates rather than
  accumulating near-identical drafts. An undated filename is indistinguishable
  from a stale one six days later, which is the failure the page exists to
  prevent.
- **Dark mode** for the page, carrying the same meanings rather than inverted
  colours: warm tint still means act on this, cells still lift off the ground,
  standing facts still recess. Print always forces light.
- **Guards that fail loudly.** `publish-week-ahead.ps1` refuses to print a page
  containing mojibake; `check-fonts.ps1` asserts doctype, charset and inherited
  type. Both failures used to be silent and reach the archive.

### Changed

- **Contrast raised**, weighted toward the smallest text. The 11px keys under
  each event were the weakest thing on the page and are what gets read from
  across a kitchen. Category colours darkened — they were mid-tone pastels that
  looked fine on screen and vanished on paper.
- **Horizon table margins.** It was the only surface with no horizontal padding,
  text flush against both rule ends, and its description column ran the full
  page width at roughly 140 characters a line. Now capped and inset.
- **Paths are configured, not hardcoded.** Machine-specific locations live in
  `~/.mrs-doubtfire/paths.json`, outside the repo. No personal path ships in a
  public, household-agnostic plugin.
- **The week-ahead page is delivered as a file, not a link.** README corrected:
  it had described a hosted artifact as the mechanism. Hosting is now optional
  and off unless asked.
- **`reference/data-sources.md`** named a `_Doubtfire` data folder that does not
  exist — the convention is `_MrsDoubtfire`. Anyone following the docs would
  have created the wrong folder. Placeholders now read as placeholders,
  including the Google Drive letter, which is not always `G:`.

### Fixed

- **Encoding corruption.** A `Get-Content -Raw` / `Set-Content -Encoding UTF8`
  round-trip on PowerShell 5.1 reads through the ANSI codepage and writes a BOM,
  turning every accented name into mojibake and the BOM into a stray glyph at
  the top-left of the page. Fixed at the source with explicit UTF-8 byte I/O,
  plus a repair script and a publish-time guard.
- **`<meta charset="utf-8">` was absent.** The file was valid UTF-8 with nothing
  saying so, so anything opening it from disk could fall back to the system
  codepage and mangle every accented name.
- **Missing doctype turned tables serif.** Without `<!DOCTYPE html>` the browser
  uses quirks mode, where `<table>` does not inherit `font-family` from `<body>`
  — so the horizon table fell back to Times New Roman while the rest of the page
  stayed sans. No serif was ever declared anywhere.

## 2.0.0 — 2026-09-08

Genericized for any household, and made public.

Everything specific to one family moved out of the skills and into a config file
the user owns. The skills now carry doctrine only, which is what was worth
sharing in the first place.

### Added

- **`setup` skill.** Six-question onboarding that writes
  `config.md` in your connected folder and scaffolds the data folder. Infers where it
  can — reads mail to propose the school domain rather than asking for it — and
  ends by proving the connection works rather than by claiming it does.
- **`reference/week-ahead-artifact.md`.** Spec and template for a published
  weekly page: the coming seven days as a grid, plus what is closing, what is
  due, and what the school memo actually said. Built for the partner who was not
  part of the conversation. Opt-in through config, republished to a stable URL
  each week.
- **`reference/task-routing.md`.** Replaces the TickTick-specific routing file.
  Eight logical routes that map to whatever the household uses, and `none` as a
  first-class option where the brief reports instead of writing.
- **MIT license.**

### Changed

- **Config lives at `config.md` in your connected folder**, a fixed path, so skills can
  find it before they know anything else. It points at the data folder, which
  can be anywhere.
- **Multiple children supported** across school, medical, sizes, and social.
  Previously assumed one.
- **Public and private schools both handled.** Private adds re-enrollment
  contracts and tuition schedules; public adds district calendars and lottery or
  choice deadlines. Previously private only.
- **Single parents supported.** Anniversary and partner sections are gated on a
  partner existing rather than assumed.
- **Travel is party-size driven** rather than assuming three people, one airline
  status, and three specific airports.
- **Housing type drives household work.** Rental, co-op, condo, and house each
  constrain different things. Previously assumed a co-op.
- **Special education is off by default** and gated on config. Statutory
  mechanics kept, jurisdiction made a variable with an instruction to verify
  local timelines by search rather than asserting them.
- **Mail is connector-agnostic.** The flag-label pattern survives intact: a
  hand-applied label outranks every keyword guess, and is the escape hatch for
  everything the category searches miss.
- Cross-platform paths throughout. No more Windows drive letters.

### Removed

- All personal data: names, addresses, school, birthdates, drive letters, mail
  addresses, and every hardcoded task-manager project ID.
- `reference/ticktick-routing.md`, replaced by `task-routing.md`.
- `data/family-profile.md`, folded into the template.

### Kept deliberately

The parts that were expensive to learn, which is most of the value:

- Work backwards from the deadline, never forward from today
- Surface the second-order task
- Never invent a fact about the family, and say plainly when data is stale
- Say the uncomfortable part, with a number and a date
- Half days look like school days on a calendar
- Book the next appointment before leaving the current one
- Buy the next size up when the current one is within a half size of tight
- The 48-hour RSVP rule
- Book the sitter first, then decide what to do
- An empty mail search of the wrong inbox reads exactly like an all-clear

## 1.1.0 — 2026-08-28

Added the data-sources reference, the source registry pattern, and flagged-mail
handling. Wired the weekly brief to check hand-flagged mail before running any
keyword scan.

## 1.0.0 — 2026-08-27

Initial build. Router skill, five domain sub-skills, weekly brief, lead-time and
task-chain references, data templates.

Original idea by Sam Dolgin.
