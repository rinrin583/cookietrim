# Installation and test report

- Date: 2026-09-29
- Version: 0.2.0
- Browser: Google Chrome
- Installation: User confirmed the unpacked extension was loaded

## Browser smoke tests

| Scenario | Expected behavior | Result |
|---|---|---|
| Direct reject | Click `Reject all`, never `Accept all` | PASS |
| Two-step preferences | Open `Manage choices`, keep strictly necessary, disable Analytics and Marketing, save | PASS |
| Accept-only fallback | Leave the banner visible and do not click `Accept all` | PASS |

The smoke tests ran against a local-only HTTP fixture at `127.0.0.1`; no personal data or external service was involved.

## Static and rule tests

- 28 multilingual matching assertions: PASS
- Manifest V3 structure and referenced files: PASS
- JavaScript syntax: PASS
- Safety check preventing direct cookie deletion or rewriting: PASS

## Boundary

This verifies the extension engine and installed Chrome execution path. Individual websites can change their consent interfaces, so unsupported banners should remain visible for manual handling rather than being hidden or accepted.
