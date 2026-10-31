# TASK — Four action labels and retired shared note (2026-10-31)

Status: **COMPLETE — LABEL/NOTE ACCEPTED ON TEST HTTPS**

- [x] Clean same feature branch safely fetched/pulled at 0a1f4a20e475d1a4b9e12e87eb06373d9973f42c. Read State/Task/README/template/build/content/tests; no AGENTS.md found.
- [x] Archive prior State/Task verbatim under docs/history/*BEFORE_LABEL_NOTE_2026-10-31.md; preserve all historical evidence.
- [x] Record actual pre-edit HTTPS: ordinary/social already use requested label, public/personal use previous shorter label; all hrefs already correct. Direct-apply notice contains exactly the retired sentence.
- [x] Uniform four labels; remove meta.note and all NOTE rendering/paragraphs (direct application, comparison, footer and generated plan details use the same sentence). No blank paragraphs left; other policy and scheme-specific action notes/cautions unchanged.
- [x] Full build/check, 59/59 tests, performance, pages-live/pages-test/UX2/entry-history and action-toggle local browser regressions PASS. Four real popup URLs and source equality boundary PASS; all player tests run unchanged implementation.
- [x] Commit/push same branch, exact runtime SHA Pages success, actual HTTPS acceptance, evidence and final docs delivery. Final docs-only deployment SHA/public-file parity verified in final handoff.

Production edits limited to site/content.json (two differing label values and removed meta.note), site/template.html (three NOTE paragraphs removed), scripts/build.mjs (shared note paragraph and replacement key removed), regenerated index.html. No CSS/JS/media/player/CX/GA4/deployment changes.

Tests: extend ux2 source/render regression for exact four labels/hrefs, absence of retired note/empty paragraphs and preservation of scheme cautions. Extend pages-live actual DOM checks for uniform labels/URLs and removal of notice/empty block. Update historical action-toggle browser baseline boundary to current pre-edit SHA, restoring only label/meta.note for equality check; four real popup URLs now tested. This maintains existing player regression without changing player implementation.

Scope boundary: removal applies only to the one retired sentence, including all copies emitted by the shared NOTE mechanism. Other reminders, action notes, periods, rates, processes and references remain byte-equivalent in source. Live CX remains excluded from test-domain acceptance, per existing authorization; phone tests are Chromium emulation, not physical hardware.

Verification note: the new empty-paragraph assertion was initially too broad and matched existing dynamic status containers elsewhere. Scoped it to the affected application/footer and retired notice paragraphs; unrelated status containers remain unchanged. Final complete test suite passes.

## Actual HTTPS acceptance

Runtime commit 17d21c42934b04f7b525bdae7007cb7f75a5e653; Cloudflare deployment 937e0c96-13b4-4e2e-a770-b0109b227e74 SUCCESS with exact head SHA from GitHub Cloudflare check. Main test URL https://rental-tax-guide-test.pages.dev/ HTML bytes matched the immutable source deployment https://937e0c96.rental-tax-guide-test.pages.dev/ and local test artifact before acceptance. No stale-site results substituted. No Cloudflare settings changes or new service/credentials.

Actual HTTPS suites PASS: pages-live-acceptance.cjs (exact four labels/hrefs + absent note/empty containers), pages-test-browser-check.cjs, ux2-browser-check.cjs, entry-scroll-check.cjs --navigation-only, action-toggle-browser-check.cjs (all four real popup URLs + unchanged player). 33 public assets status/MIME, private documents 404, zero GA4 requests, no console/page errors. Existing owner/tenant/4 plans/quick guide/comparison/history/keyboard retained. Desktop/iPhone/Android-emulated player interaction regression passes unchanged implementation.

Dedicated 1440×1000 / 768×1024 / 390×844 HTTPS DOM measurements and full-page screenshots PASS: uniform labels/hrefs, zero retired notice/empty paragraphs, application list is final child, trailing space equals existing section padding/border only (within 1px), no horizontal overflow. Desktop/phone screenshots visually reviewed; no leftover disclaimer box. Other source fields compare exactly to baseline after restoring only labels and meta.note. Generated HTML matches baseline after only two changed labels and removal of seven copies of the same shared sentence paragraph; all other generated markup/asset-version references byte-identical.

Evidence: docs/evidence/2026-10-31-label-note/ includes before/after HTTPS DOM, exact scope boundary, runtime deployment check, regression results and three layout screenshots. No unresolved automated failures. No hardware-device acceptance claimed; browser sizes/phone gestures are emulation. CX live traffic remains isolated per existing test-domain scope; CX/GA4/media/player/other policy files unchanged.

Final evidence/docs commit modifies no public runtime. Its auto deployment is checked for exact final SHA, all 33 published-file bytes vs accepted runtime and fresh actual-HTTPS label/note smoke. History is preserved under docs/history/*BEFORE_LABEL_NOTE_2026-10-31.md. No main merge/PR/formal deployment.
