# Xiaohongshu Mini Tool validation

Artifact: `CookieTrim-Xiaohongshu-MiniTool.zip`

Build date: 2026-09-29

## Package summary

- ZIP size: 41,130 bytes.
- SHA-256: `5865E6654EFA663A8304F12010AD101DA6AC586D64867791334EF2BCAFECDFED`.
- Root entry: `index.html` is at the ZIP root.
- Included files: 4 (`index.html`, `assets/style.css`, `assets/main.js`, `assets/logo.png`).
- No parent `dist/` directory is included in the archive.

## Automated checks

- JavaScript syntax: passed with `node --check`.
- Official Node artifact audit: passed, 4 files, 0 warnings.
- Official Python artifact audit: passed, 4 files, 0 warnings.
- ZIP audit: passed, 4 files, 0 warnings.
- Forbidden-pattern scan: no external URL, network request, WebSocket, clipboard, download, popup, outbound navigation, module script, inline event handler, iframe, object, dynamic-code execution, worker, or WebAssembly pattern found.
- Asset references: all local and present in the package.
- Compatibility approach: classic external JavaScript, ES2017-safe syntax, local assets, system fonts, Flexbox layout, and no CSS features that are known to require a newer baseline than Chrome/WebView 61.
- Local visual check: passed for the landing page and poster-generation fallback; a sticky-navigation overlap found during the first pass was fixed and rechecked.

## Platform-specific behavior

- Promotional-card generation is local Canvas rendering.
- Photo-album saving runs only after the user presses the save button.
- The implementation uses `window.xhs.miniTool.writeTempFile` when available, then `saveImageToPhotosAlbum`.
- In an ordinary browser, the card can be previewed but the page explains that album saving requires the Xiaohongshu Mini Tool environment.
- The tool contains no outbound link. It shows `CookieTrim` and `rinrin583` as GitHub search terms to comply with the offline/outbound-navigation restrictions.

## Manual validation still required

The downloaded skill states that ordinary browser checks are not a substitute for platform validation. Before publication, upload the ZIP to the Xiaohongshu Mini Tool console and complete:

1. Platform simulator validation.
2. Android QR-code real-device validation.
3. iOS QR-code real-device validation.
4. A real save-to-album permission and result check on both platforms.
5. A performance and long-page scrolling check on representative devices.

These platform and real-device checks are intentionally reported as pending rather than passed.
