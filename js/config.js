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

  blessings: {
    title: 'Blessings',
    body: 'May the bride and groom be blessed with a lifetime of love, laughter and companionship. As they take the seven sacred pheras, may each vow bind their hearts closer and guide them through every season of life. May their home be filled with warmth, respect and understanding, their days with joy and their years with good health and prosperity. May they always be each other\'s strength in difficult times and greatest joy in happy ones, and may the blessings of their families and elders stay with them forever.'
  },

  /* Optional Instagram hashtag for “Follow the action”. Leave empty to keep that section decorative only. */
  hashtag: '',

  /* Things to Know (Weather and Parking only). The section stays hidden until at least one is filled. */
  thingsToKnow: {
    intro: 'To help you feel at ease and enjoy every moment of the celebrations, we have gathered a few thoughtful details we would love for you to know before the big day.',
    weather: '',
    parking: ''
  },

  music: {
    src: 'assets/music.mp3',
    title: 'London Thumakda (From “Queen”)',
    credit: 'London Thumakda · Queen'
  },

  rsvp: {
    heading: 'Kindly respond',
    intro: 'We would be honoured to know if you can join us.',
    endpoint: '',
    mailto: ''
  },

  locationHeading: 'The Venue'
};
