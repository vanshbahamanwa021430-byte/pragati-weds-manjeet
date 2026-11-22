/* ============================================================
   Pragati weds Manjeet — invitation settings
   Edit THIS FILE to change names, dates, venue, music, RSVP
   destination and copy. The rest of the site reads from INVITE.
   ============================================================ */

window.INVITE = {
  documentTitle: 'Pragati weds Manjeet',
  shareDescription: 'You are invited to the wedding of Pragati and Manjeet.',

  monogram: 'P & M',

  /* No parents' names are shown on this invitation. */
  requestLine: 'Request the honour of your presence at their wedding',

  groom: {
    firstName: 'Manjeet',
    fullName: 'Manjeet'
  },
  bride: {
    firstName: 'Pragati',
    fullName: 'Pragati'
  },

  date: '2027-01-18',
  time: null,
  timeZone: 'Asia/Kolkata',
  timeDisplay: '',
  dateIsPlaceholder: false,
  durationMinutes: 180,

  ceremony: {
    title: 'The Wedding',
    tagline: 'Shaadi · Pheras',
    note: 'Join us as the couple take their vows and the seven pheras.'
  },

  venueName: 'Dhankhar Farmhouse',
  venueAddress: 'Jhajjar, Jhajjarrural, Haryana 124103',
  mapsUrl: 'https://maps.app.goo.gl/YmEde1wiVfAr88XcA',
  mapsQuery: 'Dhankhar Farmhouse, Jhajjar, Jhajjarrural, Haryana 124103',

  photos: [],

  blessing: 'With love and blessings',

  music: {
    src: 'assets/music.mp3',
    title: 'Hindu Wedding Ceremony Music',
    credit: 'Shehnai · CC0, see CREDITS.md'
  },

  rsvp: {
    heading: 'Kindly respond',
    intro: 'We would be honoured to know if you can join us.',
    endpoint: '',
    mailto: ''
  },

  locationHeading: 'The Venue'
};
