# WerkCV Vacature Keyword Highlighter

Chrome extension MVP for Dutch and English job pages.

## What it does

- scans the current job page
- highlights Dutch and English CV-relevant keywords directly on the page
- groups findings into:
  - hard skills
  - soft skills
  - credentials and languages
  - themes and repeated signals

The extension is designed as a narrow, single-purpose utility:

`Highlight and summarize Dutch and English job-page keywords that a job seeker may want to reuse in a CV.`

## Load it locally

1. Open `chrome://extensions`
2. Turn on `Developer mode`
3. Click `Load unpacked`
4. Select this folder:

   `chrome-extension/werkcv-vacature-keyword-highlighter`

## Fast local test page

From this extension folder, you can run:

`python -m http.server 4173`

Then open:

`http://localhost:4173/sample-vacancy.html`

English sample:

`http://localhost:4173/sample-job-en.html`

## Test flow

1. Open a Dutch or English job page
2. Click the extension icon
3. Click `Scan current page`
4. Confirm:
   - page text is highlighted
   - popup shows grouped keywords
   - `Remove highlights` clears the in-page markers

## Permissions

- `activeTab`
  - lets the extension work only on the current tab after user action
- `scripting`
  - injects the local highlighter script and CSS into the current tab

No backend is required for this MVP.

## Store prep

Before publishing, prepare:

- final extension screenshots
- public privacy policy URL on `werkcv.nl`
- Chrome Web Store listing copy
- developer registration and review submission

## Current limitations

- heuristic, dictionary-based matching only
- no cross-tab history
- no account sync
- no ATS scoring yet
