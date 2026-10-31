# TASK — Entry heading positioning (2026-10-31)

Status: **IN_PROGRESS**

## Scope / progress

- [x] Clean worktree, safe fetch/fast-forward pull same branch at 7d150348e2650a1c2f5de9b2e140c4aa6f9ac339; read latest State/Task/README/route/CSS; no AGENTS.md found.
- [x] Reproduce on actual Pages HTTPS before edits and save all four heading offsets across 36 responsive/zoom-equivalent cases.
- [x] Preserve completed UX2 State/Task in docs/history without removing evidence.
- [ ] Minimal route-only DOM-derived alignment to 28px after content reflow, clamp at document limits; avoid repeat/resize/history jumps; preserve focus/hash/deep links.
- [ ] Complete device/zoom/navigation/full non-CX regressions; push same branch and verify final Pages HTTPS/source SHA.

## Confirmed cause and baseline

`route()` positions only when heading is outside its visibility threshold and subtracts up to 240px from the content section, not the actual heading. Section padding and owner kicker add further offset. Actual HTTPS before modification, 100% CSS viewport:

| Viewport | owner | tenant | application | video |
| --- | ---: | ---: | ---: | ---: |
| 1440×900 | 602.42 | 609.42 | 571.63 | 571.63 |
| 768×1024 | 682.34 | 689.34 | 651.55 | 651.55 |
| 390×844 | 292.14 | 299.14 | 258.34 | 258.34 |

Numbers are getBoundingClientRect().top in CSS pixels after real clicks. 36-case before.json records viewport-equivalent 100/125/150% layouts explicitly as emulation, not native browser zoom.

## Native UI limitation

Attempted native Chrome zoom validation through Browser/Computer Use. Browser shortcut dispatch did not change measured DPR/viewport. Native-window access then stopped because the tool could not reliably identify current browser URL to enforce policy. No further native UI action attempted. Any native zoom not independently verified must be reported as untested; equivalent viewport tests must not be misrepresented as real browser zoom.

All changes restricted to scroll logic/test/docs/generated JS hash. No layout redesign or application/media/CX configuration changes. Full non-CX suites isolate CX requests; never open/query Messenger.

## Implementation / local verification

- Replaced viewport visibility gating/240px section offset with actual heading DOM coordinate minus 28 CSS px, plus visualViewport offset and document scroll-limit clamp.
- Two layout frames and generation guard prevent stale queued routes; initial load correction handles native fragment/restored scrolling.
- Explicit entry/history/repeat/resize intent retains native history reading-position restoration and avoids repositioning on repeated entries or breakpoint changes. History entries carry only a local navigation marker; no analytics changes.
- Production source: assets/js/guide-ui.js only; generated index.html updates its source hash. CSS/content/application URLs/player untouched.
- Build, build --check, 58/58 tests and performance guards PASS. Existing four non-CX browser suites PASS locally, including both R2 MP4s returning 206/video/mp4 and playback progression/fullscreen/pause.
- Browser test development initially exposed direct-fragment versus history discrimination and asynchronous native scroll restoration. Added explicit history marker; measurement now waits for route/restoration completion instead of racing native scrolling. Final live outcomes recorded below after deployment.
- Isolated disposable Edge profiles successfully enable native engine page zoom (DPR 1/1.25/1.5 and reduced CSS viewport at fixed outer width). This is separate from the stopped native Chrome UI attempt; no user profile or blocked window was operated.

- Local new scroll suite PASS: 36 responsive/zoom-equivalent + 12 native engine page-zoom measurements, four deep/reload/repeat/resize cases, keyboard/history, bottom clamp. Evidence: docs/evidence/2026-10-31-entry-scroll/. Awaiting pushed HTTPS acceptance.
