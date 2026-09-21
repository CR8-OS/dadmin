# Data sources

Where the information lives, and the rules for reading it.

## The split

**Skill logic** lives in this repo. It is versioned, it is public, and it holds
no personal data.

**Live data** lives in the parent's data folder. Synced across devices, it
survives every session and is never committed to git.

`config.md` in your connected folder names that folder. Read the config first on every
run. Everything below calls it `<data folder>`.

The repo's `data/*.template.md` files are the schema. The filled-in copies live
in the data folder as `*.local.md`. Never write a `.local.md` file into the
repo.

## Paths

The data folder is wherever the parent put it. Take the path from config
verbatim. Do not assume an operating system, a drive letter, or a sync product.

```
Windows   C:\Users\<you>\Family\_Dadmin
          <drive>:\My Drive\Family\_Dadmin   (Google Drive for Desktop)
Mac       /Users/<you>/Library/Mobile Documents/com~apple~CloudDocs/Family/_Dadmin
          /Users/<you>/Dropbox/Family/_Dadmin
Linux     /home/<you>/family/_mrsdadmin
```

Every part in `<angle brackets>` is a placeholder, including the Google Drive
letter — it is assigned at install time and is not always `G:`. The folder name
is a convention, not a requirement: whatever `config.md` says wins.

Build every other path by joining onto the configured folder. A path hardcoded
into a skill file belongs to one household and breaks for everyone else.

If the configured folder does not exist, say so and stop. Do not create a
second one somewhere else, and do not guess at a replacement.

## The source registry

`<data folder>/sources.md` is the authoritative list of folders that may be
read. **Read it first on every run and open only what it lists.**

It is deliberately a plain table, so the parent grants access to a new folder by
adding a row. Do not hardcode folder paths into skill files. Add them to
`sources.md` instead. The one exception is the data folder itself, which is
always readable.

Each row carries a scan mode:

- `always` sweep on every relevant run
- `on-demand` open only when the request clearly calls for it

| Folder | Holds | Scan |
|---|---|---|
| `<data folder>` | The `.local.md` files and the mail inbox | always |
| `.../Family/School` | Calendars, forms, report cards | always |
| `.../Family/Medical` | Visit summaries, immunization records | on-demand |
| `.../Family/Travel` | Itineraries, passports | on-demand |
| `.../Family/Finances` | Tuition, savings plans, insurance | on-demand |

That table is an example. The real one is whatever the parent wrote.

If `sources.md` is missing, create it with the data folder as the only row and
tell the parent how to add more.

## Sensitive folders

Financial, legal, and identity documents are in scope when a request genuinely
requires them, and only then.

- Read them only when the request clearly requires it
- Never sweep them on a routine run
- **Never copy account numbers, balances, or identity document numbers into a
  task or a chat response.** Reference the document by name and location so the
  parent opens it themselves.

## Cloud-native file formats

Google Docs, Sheets, and Slides files on a synced drive are **pointer stubs**,
not documents. Reading one off disk returns a short JSON stub holding a document
ID and no content. It looks like a corrupt file. It is not.

To get the real content, use a Drive connector with that document ID, or ask the
parent to export the file. Ordinary files read normally from a synced folder:
`.pdf`, `.docx`, `.xlsx`, `.md`, `.csv`, `.txt`.

Check that the connected Drive account owns the file. A connector bound to a
different account cannot open the ID, and that failure looks like a missing
document rather than a permissions problem.

## Loose files

School and medical documents get saved to a download folder or a drive root
rather than filed. Permission slips, camp liability releases, health forms,
report cards.

Sweep those locations periodically for filenames matching the kids' names, the
school name, `form`, `medical`, or `camp`. When one turns up, propose filing it
into the right folder. **Never move a file silently.**

## Mail

Mail is the highest-yield source and the easiest one to get wrong.

Use whichever mail connector is attached. Config names the connector and the
account that school mail arrives at.

**State which account was searched whenever a result is empty.** An empty result
from the wrong inbox reads exactly like an all-clear, and that is the most
expensive failure mode here.

### Households with more than one mail account

A common setup: work mail on one account, family mail on another. School, camp,
and doctors write to the personal address. The attached connector is often the
work one.

If the connected account is not the account config names for school mail, say so
plainly before reporting anything else. Do not report an empty work inbox as a
quiet week. Some setups need a second connector to reach the family account.
Whether one is available depends on what the parent has installed.

### The flag label

The parent applies the flag label from config, `dadmin` by default, to
anything they want acted on.

**Search that label first, every run.** A hand-applied label is a deliberate
human signal. Keyword searches are guesses. Flagged mail outranks everything the
keyword scans return.

Exclude the `<label>/done` sub-label so the list stays a live queue. Once a
flagged item becomes a task, tell the parent, so they can move it to `/done` and
it drops out of future runs.

This is the coverage escape hatch. Sender domains cover the categories that can
be predicted. The label covers everything the keyword searches miss.

### Query construction

- **Bound every query with a date window.** The weekly brief uses 7 days, the
  monthly horizon scan uses 90. An unbounded search returns years of noise.
- **Quote multi-word phrases.** `"permission slip"` is one thing. Unquoted, it
  is two common words in any order.
- **Uppercase OR.** Lowercase `or` is read as a search term, not an operator.
- **Start narrow, then widen.** One sender, one short date window. Widen only
  when that comes back empty, and say what you widened.

### Attachments

**List the attachments before downloading any.** School mail carries logos and
signature images alongside the real document, and downloading everything fills
the inbox folder with junk.

Give each download a descriptive filename. The original is almost always
`document.pdf`. Land them in `<data folder>/inbox`, then read and file from
there.

### Sending

Read mail freely. Never send. If a reply is needed, draft it and let the parent
send it.

## Precedence

When two sources disagree:

1. What the parent says in the conversation
2. `<data folder>/*.local.md`
3. A source document read this session
4. Defaults in this repo

Never fabricate to fill a gap. Say what is missing and create a task to capture
it.
