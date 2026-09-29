# Privacy

CookieTrim runs locally in Chrome.

CookieTrim is an independent, non-commercial personal open-source project. It has no advertising, analytics, affiliate tracking, paid backend, account system, or data-selling business model.

## Data it stores

- Extension settings, such as whether automation and the success indicator are enabled.
- The site allowlist you create.
- A local summary of the 20 most recent actions so the popup can show what happened.

This data is stored in `chrome.storage.local` inside your Chrome profile.

## Data it does not collect

CookieTrim has no telemetry, analytics, advertising, account system, remote code, or external network service. It does not upload browsing history, page content, cookies, or stored settings.

The shipped runtime contains no `fetch`, XMLHttpRequest, WebSocket, or `sendBeacon` call. The manifest requests no `cookies`, `webRequest`, `declarativeNetRequest`, `history`, or `tabs` permission.

## Website access

CookieTrim needs permission to run on HTTP and HTTPS pages so it can find and operate cookie-consent controls embedded in those pages. It does not delete or directly rewrite cookies that a website has already stored.

## Removing local data

Uninstalling the extension removes its locally stored extension data through Chrome. Website cookies remain under Chrome's normal site-data controls.
