# TASK — Four action labels and retired shared note (2026-10-31)

Status: **LOCAL_PASS — AWAITING_HTTPS**

- [x] Clean same feature branch safely fetched/pulled at 0a1f4a20e475d1a4b9e12e87eb06373d9973f42c. Read State/Task/README/template/build/content/tests; no AGENTS.md found.
- [x] Archive prior State/Task verbatim under docs/history/*BEFORE_LABEL_NOTE_2026-10-31.md; preserve all historical evidence.
- [x] Record actual pre-edit HTTPS: ordinary/social already use requested label, public/personal use previous shorter label; all hrefs already correct. Direct-apply notice contains exactly the retired sentence.
- [x] Uniform four labels; remove meta.note and all NOTE rendering/paragraphs (direct application, comparison, footer and generated plan details use the same sentence). No blank paragraphs left; other policy and scheme-specific action notes/cautions unchanged.
- [x] Full build/check, 59/59 tests, performance, pages-live/pages-test/UX2/entry-history and action-toggle local browser regressions PASS. Four real popup URLs and source equality boundary PASS; all player tests run unchanged implementation.
- [ ] Commit/push same branch, wait exact SHA Pages success, actual HTTPS acceptance, final evidence/docs push/source parity.

Production edits limited to site/content.json (two differing label values and removed meta.note), site/template.html (three NOTE paragraphs removed), scripts/build.mjs (shared note paragraph and replacement key removed), regenerated index.html. No CSS/JS/media/player/CX/GA4/deployment changes.

Tests: extend ux2 source/render regression for exact four labels/hrefs, absence of retired note/empty paragraphs and preservation of scheme cautions. Extend pages-live actual DOM checks for uniform labels/URLs and removal of notice/empty block. Update historical action-toggle browser baseline boundary to current pre-edit SHA, restoring only label/meta.note for equality check; four real popup URLs now tested. This maintains existing player regression without changing player implementation.

Scope boundary: removal applies only to the one retired sentence, including all copies emitted by the shared NOTE mechanism. Other reminders, action notes, periods, rates, processes and references remain byte-equivalent in source. Live CX remains excluded from test-domain acceptance, per existing authorization; phone tests are Chromium emulation, not physical hardware.

Verification note: the new empty-paragraph assertion was initially too broad and matched existing dynamic status containers elsewhere. Scoped it to the affected application/footer and retired notice paragraphs; unrelated status containers remain unchanged. Final complete test suite passes.
