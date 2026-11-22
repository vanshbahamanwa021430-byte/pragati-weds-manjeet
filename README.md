# Pragati weds Manjeet — wedding invitation

A static, mobile-first invitation site. Open `index.html` locally or serve the folder (for example `python3 -m http.server`) and send guests the link once you host it.

## How to edit

All names, the date, the venue and the RSVP destination live in `js/config.js`.

- The wedding is an all-day event on Monday 18 January 2027 (no clock time). Set `time` later if you want one.
- Paste a Google Apps Script URL into `rsvp.endpoint` after following `rsvp/DEPLOY.md` if you want replies in a Sheet and by email. Until then, replies stay in the guest’s browser.
- “See the route” and Get Directions open the official Maps link in `mapsUrl`.

There are no parents’ names on this invitation.

## Art

The painted backgrounds, oval miniature and side borders are taken from the purchased Missing Piece Invites artwork (cleaned of sample names, dates and watermarks). The typography you see is live HTML, so you can change the wording in `config.js`. Source screenshots were low-resolution phone captures, so the pictures will not look as sharp as a print file.

## Music

A soft shehnai track (CC0) starts after the first tap or scroll. Guests can mute it at any time. See `CREDITS.md` and `assets/MUSIC-LICENSE.txt`.

## Hosting

This folder is ready for GitHub Pages or any static host. Do not commit a filled-in RSVP endpoint if you treat it as private.
