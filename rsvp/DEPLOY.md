# Deploy the RSVP Google Sheet + email script

The invitation can post each RSVP to a Google Apps Script web app. The script
appends a row to a spreadsheet and emails you a copy. It is not deployed yet;
follow these steps once, then paste the web-app URL into `js/config.js`.

## 1. Create the spreadsheet

1. Open [Google Sheets](https://sheets.google.com) in the Google account that
   should own the replies.
2. Start a new blank spreadsheet. Name it something like
   **Pragati weds Manjeet RSVPs**.
3. You do not need to create columns yourself. The script will add a header
   row (`Timestamp`, `Name`, `Guests`, `Attending`, `Message`) on the first
   submission, on a tab called `RSVPs`.

## 2. Add the script

1. In that spreadsheet, open **Extensions → Apps Script**.
2. Delete any starter code in `Code.gs`.
3. Paste the contents of `rsvp/Code.gs` from this site folder.
4. At the top of the file, set `OWNER_EMAIL` to the address that should
   receive each RSVP (for example your Gmail). Leave `SHEET_NAME` as `RSVPs`
   unless you have renamed the tab.
5. Click **Save** (the disk icon). Name the project if asked.

## 3. Deploy as a web app

1. Click **Deploy → New deployment**.
2. Next to “Select type”, choose **Web app**.
3. Fill in:
   - **Description:** `Wedding RSVP`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`  
     (This is required so guests can submit from the invitation without
     signing in. They will not see the spreadsheet.)
4. Click **Deploy**.
5. Authorise the script when Google asks: review permissions, choose your
   account, and allow access to the spreadsheet and to send email as you.
6. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfycb…/exec`.

## 4. Connect the invitation

1. Open `js/config.js`.
2. Find `rsvp.endpoint` and paste the web-app URL as a string, for example:

   ```js
   endpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
   ```

3. Upload the updated `config.js` with the rest of the site when you host it.
4. Open the invitation, send a test RSVP, then check:
   - a new row on the `RSVPs` tab, and
   - an email at `OWNER_EMAIL`.

If nothing arrives, confirm the deployment is “Anyone”, that `OWNER_EMAIL`
is a real address, and that you updated the *existing* deployment after any
later code changes (**Deploy → Manage deployments → Edit → New version**).

## 5. How the form talks to the script

The invitation sends a `POST` with a JSON body
`{ name, guests, attending, message }`. For Google’s web-app URLs it uses
`text/plain` and `mode: 'no-cors'`, which avoids a browser CORS error.
The script still reads the body and always writes the sheet and the email
when the request arrives.

Until `rsvp.endpoint` is set, the form shows a thank-you and stores the
reply only in that guest’s browser (`localStorage`).
