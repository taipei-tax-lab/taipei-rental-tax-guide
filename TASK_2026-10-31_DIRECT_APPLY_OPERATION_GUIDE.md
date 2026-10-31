# TASK — Entry heading positioning (2026-10-31)

Status: **COMPLETE — NON-CX FRONTEND SCROLL ACCEPTANCE ON TEST HTTPS**

## Scope and result

- [x] Clean worktree, safe fetch/fast-forward pull same branch from 7d150348e2650a1c2f5de9b2e140c4aa6f9ac339; read State/Task/README/JS/CSS; no AGENTS.md found.
- [x] Reproduce on actual HTTPS before edits; archive prior completed State/Task without deleting evidence.
- [x] Minimal scroll/navigation change in assets/js/guide-ui.js; generated index.html updates source hash. No CSS/content/application URL/player/CX/config changes.
- [x] Build, build --check, all 58 tests, performance guards and existing non-CX browser suites PASS.
- [x] Push same branch, reuse Pages auto deployment; actual HTTPS four-entry/device/zoom/navigation acceptance PASS.
- [x] Save evidence and update State/Task. Final evidence-only commit deploys the same public files; final handoff checks canonical deployment SHA and public-file byte parity.

Runtime accepted commit: 28bf22e252cdd4f1c7e37caa997c2de64e8717a6.
Cloudflare deployment: 1a3b7ad0-7bc7-41fe-a09e-f8c3d27d264d, deploy SUCCESS, exact branch match.
URL: https://rental-tax-guide-test.pages.dev/ . Existing build command/output/environment unchanged.

## Cause and implementation

Original route() skipped scrolling when heading was merely visible; when scrolling, it positioned the section with up to 240px allowance rather than the heading. Section padding/kicker added offset.

New alignment measures actual heading.getBoundingClientRect().top + scrollY, subtracts 28 CSS px plus visualViewport offset, and clamps against actual document limits. Two layout frames allow switched content to reflow; generation guards discard stale routes. Initial load correction is registered synchronously, preventing missed load/fragment positioning. No fixed absolute scrollY values or resolution-specific production rules.

Entry/history/repeat/resize intent is explicit. Hash-specific history metadata and initial-entry replaceState preserve browser-managed restoration without adding history entries. Repeated entry actions and breakpoint changes retain reading position. Focus uses the existing accessible heading helper; resize does not move focus. Existing inline-plan, return, guide and comparison branches remain.

## Actual HTTPS heading top (CSS px, 100%)

| Viewport | Owner before→after | Tenant before→after | Application before→after | Video before→after |
| --- | ---: | ---: | ---: | ---: |
| Desktop 1440×900 | 602.42→28.42 | 609.42→28.42 | 571.63→27.63 | 571.63→27.63 |
| Tablet 768×1024 | 682.34→28.34 | 689.34→28.34 | 651.55→27.55 | 651.55→27.55 |
| Phone 390×844 | 292.14→28.14 | 299.14→28.14 | 258.34→28.34 | 258.34→28.34 |

36 actual HTTPS measurements cover the three viewport sizes with 100/125/150% layout-viewport equivalents; every heading is ~28px where scrollable. These are explicitly marked as equivalent viewport emulation, not native zoom.

12 additional actual HTTPS measurements use native Chromium/Edge page zoom in isolated disposable Playwright profiles, fixed outer width 1440px; Preferences partition.default_zoom_level with default partition key x. Verified DPR 1/1.25/1.5 and CSS widths 1414/1131/943, heights 807/646/538. All four headings at every native 100/125/150% setting are within 2px of 28. No user browser/profile was modified.

Navigation PASS: four initial deep links, reloads, same-entry repeats while reading, 1440↔1000 breakpoint resizing, keyboard Enter/focus, Back to each initially deep-linked entry, Back/Forward reading-position restoration. Hero/cards remain visible in DOM. Bottom limit: 1440×2200 video page has maxY=0, scrollY=0, heading top=571.625px; cannot reach 28px without adding artificial layout space, which this task forbids.

## Full regression / evidence

Commands: node scripts/build-pages-test.mjs; node scripts/build.mjs --check; node --test tests/*.test.mjs; node scripts/performance-budget.mjs. All PASS, 58/58 tests.

Actual HTTPS suites (PREVIEW_URL=https://rental-tax-guide-test.pages.dev/): entry-scroll-check.cjs, pages-live-acceptance.cjs, pages-test-browser-check.cjs, ux2-browser-check.cjs, extension-browser-check.cjs — all PASS. CX third-party requests isolated in tests; Messenger never opened/queried.

Existing functionality PASS: six entries at 320/390/768/1100/1440px, four plan details and responsive transition, owner guide/tenant groups/comparison, application cards/internal navigation, keyboard/history, no horizontal overflow. 32 public asset status/MIME checks PASS, 11 private paths return 404, no runtime errors or GA4 tracking requests. Both unchanged R2 MP4s return 206/video/mp4 and play with advancing currentTime; native fullscreen, no autoplay, switch/leave/return pause, desktop/mobile defaults and manual choice retention PASS.

Evidence directory: docs/evidence/2026-10-31-entry-scroll/ . Contains baseline before-https-7d150348.json, after-local.json, after-https-28bf22e.json, non-cx-https.json, pages-artifact-browser.json, ux2-https.json, r2-player-https.json, all four desktop heading screenshots and tablet/phone representative screenshots. Baseline is from the actual pre-edit HTTPS site; after screenshots and final JSON are from the accepted HTTPS runtime.

## Failed cases resolved / remaining limits

- First implementation f9e2af48b3d01291cb06d63abd4fed47a311daec deployed successfully as 772d628c-3672-4b49-ab35-696b01acb5d6; existing non-CX tests passed, but expanded scroll checks exposed cold-load fragment timing and initial deep-link history. It was not accepted as the final runtime.
- Registering load correction inside requestAnimationFrame could miss load entirely, allowing native fragment scroll to win. Registering synchronously fixed this. Hash-specific markers distinguish fresh fragment navigation from history restoration and include initially deep-linked entries.
- Test setup initially raced CSS smooth scrolling and native history rendering; reading scroll now uses instant behavior and waits a layout frame before traversal. Final suite waits for actual route/restoration completion, and all assertions pass on HTTPS.
- Native Chrome shortcut dispatch did not alter measured zoom; native-window Computer Use then stopped because it could not reliably identify the browser URL for policy enforcement. No further native-window action attempted. Independent isolated Edge native page zoom passed; Chrome UI controls and real iOS/Android dynamic address-bar/pinch behavior remain manual checks.
- No unresolved automated frontend failures. Page-bottom clamp is expected, not a defect. CX remains excluded. Previous application-specific link review limits remain in prior Task/history; this task changes none of those links or policy.

Prior completed State/Task preserved in docs/history/*BEFORE_ENTRY_SCROLL_2026-10-31.md; all older evidence retained. No main merge, PR, formal deployment, ZIP or media changes.