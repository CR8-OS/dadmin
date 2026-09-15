# WhatsApp export — processing marker

Tracks what has already been read out of a class group chat export, so the same
events are not surfaced week after week.

Copy this to your data folder as `whatsapp-processed.local.md`. It is written
automatically; you should not need to edit it.

## Groups

One block per chat. Add a block when you start exporting a new group.

### <group name>

```
export_file:     <filename of the most recent export>
export_date:     <when it was exported, YYYY-MM-DD>
high_water_mark: <timestamp of the newest message already read>
messages_read:   <count, for sanity checking>
```

Notes: <anything worth remembering — who the class reps are, which parent
organises what, whether this group duplicates a school channel>

---

## Why the high-water mark matters

WhatsApp exports are cumulative. Every export contains the entire chat history,
not only what arrived since last time. Without a marker, each week's parse finds
the same picnic, the same bake sale, the same RSVP that was answered a month
ago — and a brief that repeats itself is one that stops being read.

## Date format ambiguity

Record which way the exporting phone writes dates once it is known:

```
date_order: <DMY or MDY, or unknown>
```

`2/3/26` is February 3rd or March 2nd depending on the phone's locale. Getting
this wrong puts a party on the calendar a month out. If the file contains no
date with a day above 12, there is no evidence either way — leave this as
`unknown` and ask rather than assume.
