<div align="center">
  <img src="assets/brand/cookietrim-logo.png" width="144" alt="CookieTrim logo">
  <h1>CookieTrim</h1>
  <p><strong>Keep only what you need.</strong></p>
  <p>A local-first Chrome extension that safely chooses <em>Reject all</em> or <em>Necessary only</em> on cookie consent banners.</p>

  [![Manifest V3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
  [![Tests](https://github.com/rinrin583/cookietrim/actions/workflows/test.yml/badge.svg)](https://github.com/rinrin583/cookietrim/actions/workflows/test.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-08783f.svg)](LICENSE)
  [![No telemetry](https://img.shields.io/badge/telemetry-none-f3a52b.svg)](PRIVACY.md)

  [中文说明](README.zh-CN.md)
</div>

## Why CookieTrim?

Cookie banners should not make the privacy-preserving choice the hardest one. CookieTrim handles common consent dialogs automatically while following one strict rule: **never click “Accept all.”**

## Features

- Chooses **Reject all** or **Necessary only** when a reliable control is available.
- Handles two-step flows: open preferences, disable clearly non-essential categories, then save.
- Recognizes common consent platforms and safe action text in 11 languages.
- Watches dynamic pages, open Shadow DOM, and matching frames for up to 60 seconds.
- Supports per-site pause rules and a local activity summary.
- Runs entirely in the browser with no telemetry, analytics, remote code, or external requests.
- Leaves an unsupported banner visible instead of pretending it was handled.

## Install from source

1. Download or clone this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the repository folder.
5. Pin CookieTrim to the toolbar if you want quick access to site controls.

The extension requests access to HTTP and HTTPS pages because consent banners are embedded in the pages it handles. See [Privacy](PRIVACY.md) for a plain-language explanation.

## Test

```bash
npm test
```

The suite checks multilingual action matching, Manifest V3 structure, referenced assets, JavaScript syntax, and the safety rule that CookieTrim must not delete or rewrite site cookies directly.

## What CookieTrim does not do

- It cannot support every banner: sites can change their markup at any time.
- It does not classify, delete, or rewrite cookies already stored by a website.
- It does not hide an unresolved banner with CSS.
- It is a convenience tool, not a guarantee of legal compliance or complete tracking prevention.

## Project status

CookieTrim is an early open-source release. The rule engine has passed 28 multilingual assertions and three installed-browser smoke scenarios: direct rejection, two-step preferences, and safe fallback on an accept-only banner. See [the test report](TEST_REPORT.md).

## Contributing

Bug reports and new banner patterns are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Security-sensitive issues should follow [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 CookieTrim contributors.
