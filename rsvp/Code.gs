/**
 * RSVP web app for the Pragati weds Manjeet invitation.
 *
 * Each submission is appended to a Google Sheet and emailed to the owner.
 * Follow rsvp/DEPLOY.md, then paste the web-app URL into js/config.js
 * as rsvp.endpoint.
 *
 * The invitation POSTs a JSON body (also accepted as text/plain to avoid
 * browser CORS preflights):
 *   { name, guests, attending, message }
 */

/* ---- Edit these before you deploy -------------------------------- */
var OWNER_EMAIL = 'YOUR_EMAIL_HERE';  // RSVP notifications go here
var SHEET_NAME = 'RSVPs';             // tab name in the spreadsheet
/* ------------------------------------------------------------------ */

var HEADERS = ['Timestamp', 'Name', 'Guests', 'Attending', 'Message'];

function doGet() {
  return ContentService
    .createTextOutput('Pragati weds Manjeet RSVP endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var data = parseBody_(e);
    var row = appendRsvp_(data);
    emailOwner_(data);
    return json_({ ok: true, row: row });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function parseBody_(e) {
  var data = {};
  if (e && e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = {};
    }
  }
  if (e && e.parameter) {
    data.name = data.name || e.parameter.name;
    data.guests = data.guests || e.parameter.guests;
    data.attending = data.attending || e.parameter.attending;
    data.message = data.message || e.parameter.message;
  }
  return {
    name: String(data.name || '').trim(),
    guests: String(data.guests || '').trim(),
    attending: String(data.attending || '').trim(),
    message: String(data.message || '').trim()
  };
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var needsHeader = !first[0];
  if (needsHeader) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendRsvp_(data) {
  var sheet = getSheet_();
  sheet.appendRow([
    new Date(),
    data.name,
    data.guests,
    data.attending,
    data.message
  ]);
  return sheet.getLastRow();
}

function emailOwner_(data) {
  var to = String(OWNER_EMAIL || '').trim();
  if (!to || to === 'YOUR_EMAIL_HERE') {
    return;
  }
  var attendingLabel = data.attending === 'yes'
    ? 'Yes, with joy'
    : (data.attending === 'no' ? 'Sadly, no' : (data.attending || '(not given)'));
  var subject = 'RSVP: ' + (data.name || 'A guest') + ' — Pragati weds Manjeet';
  var body = [
    'A new wedding RSVP has arrived.',
    '',
    'Name: ' + (data.name || ''),
    'Guests: ' + (data.guests || ''),
    'Attending: ' + attendingLabel,
    'Message: ' + (data.message || ''),
    '',
    'This reply has also been added to the RSVPs sheet.'
  ].join('\n');
  MailApp.sendEmail({
    to: to,
    subject: subject,
    body: body
  });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
