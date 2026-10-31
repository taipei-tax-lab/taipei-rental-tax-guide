# TASK — V2 operation tutorial videos (2026-10-31)

Status: **IN_PROGRESS — LOCAL_PASS / AWAITING_HTTPS**

## Scope / workflow

- [x] Clean worktree and specified branch; safe fetch/pull, remote equals baseline 1c3d3a905ab7d1feb9f3c818b7365a439d330862. Read State/current Task/README/build/source/tests/development docs. No applicable AGENTS.md found.
- [x] Verify existing HTTPS baseline and source via Cloudflare GitHub check: af51e4aa-84fc-4b3b-b923-ea372e9651eb SUCCESS. Archive prior State/Task verbatim under docs/history/*BEFORE_VIDEO_V2_2026-10-31.md; preserve old evidence.
- [x] Reverify existing public R2 objects, V2 metadata and first/tail Range with and without ?v=2.
- [x] Minimal video-only layout/build/config/poster change; retain existing device-selection/pause JS.
- [x] Local build/check, 58 tests, performance and existing frontend regression PASS.
- [ ] Commit/push same branch; wait for Cloudflare Git check completion and exact source SHA.
- [ ] Actual HTTPS V2 browser acceptance, save evidence, final docs commit/push and final source/byte-parity verification.

## Baseline / implementation

Actual pre-edit HTTPS video metadata already reads V2 (PC 144.133333s at 1920×1080; mobile 150.933333s at 1080×1920), but both display 960×540 on desktop. The fixed 16:9 rule squeezes the portrait video into a landscape box.

- site/media.json retains both original R2 object names and adds ?v=2 to prevent old browser-cache reuse after in-place replacement. No needless object rename and no R2 writes. Plain/versioned URLs return identical ETags, sizes and MIME; both first and last 1024-byte ranges return correct 206 Content-Range.
- assets/css/guide-v2.css adds only mobile-video max-width 360px and aspect-ratio 9/16; PC remains 16/9 and max-width 960px inherited from the existing panel. Both retain object-fit contain, no cropping/stretch. Fullscreen removes max-width and uses full viewport with contain.
- scripts/build.mjs emits correct width/height per video and matching portrait SVG poster; adds no custom controls. scripts/build-pages-test.mjs adds only that poster to the public allowlist (33 files). No MP4 in repository/output.
- assets/js/operation-guide.js unchanged: device hint/phone UA chooses once, PC/phone fixed option order, tablet defaults PC, resizing does not reset manual choice; switching/navigation/background/pagehide pause remains.
- Existing extension-browser-check.cjs expanded for V2 object metadata/ranges, dimensions/duration, native scrubber drag and resumed playback, audio volume property, native fullscreen controls on desktop and Chromium-emulated phones, iPhone/Android/tablet defaults/manual selection. Other regression script count label updated to 33 assets; existing tests updated for poster/dimensions/tablets.
- No CSS layout redesign, route change, policy/application changes, CX/GCP/Data Store/Messenger/GA4/formal deployment changes. Impeccable detector reports only pre-existing out-of-scope accent-border warnings; leave existing UI unchanged.

## R2 source verification

| Version | Source | Bytes | Dimensions | Duration |
| --- | --- | ---: | --- | ---: |
| PC | https://pub-20ae83e09e324873be7bff4d861f23b0.r2.dev/operation-guide-pc.mp4?v=2 | 19659311 | 1920×1080 (16:9) | 144.133333s |
| Mobile | https://pub-20ae83e09e324873be7bff4d861f23b0.r2.dev/operation-guide-mobile.mp4?v=2 | 35123380 | 1080×1920 (9:16) | 150.933333s |

Plain URLs and versioned URLs: HEAD 200, Content-Type video/mp4, Accept-Ranges bytes; first/tail GET Range 206 and correct totals. PC ETag 17b8578ed2488288d59f378b552bf6a4; mobile ETag 149b8953f83cece3f3d853e6ec55f5d1. Last-Modified 2026-10-31 11:51:10/11:51:13 UTC. Actual browser V2 duration/dimensions distinguish the former 268.19s/135.65s landscape test clips. No object upload/overwrite/delete attempted.

## Local validation

node scripts/build-pages-test.mjs; node scripts/build.mjs --check; node --test tests/*.test.mjs; node scripts/performance-budget.mjs — PASS, 58/58 tests, 33 allowlisted public files.

pages-live-acceptance.cjs, pages-test-browser-check.cjs, ux2-browser-check.cjs, extension-browser-check.cjs on rebuilt test preview — PASS. Five widths 320/390/768/1100/1440, six entries, owner/tenant/four schemes/quick guide/comparison/application/history/focus, private paths 404, asset MIME and zero GA4 requests. Both actual R2 V2 videos play, native scrubber drag moves to ~94.7s/~101.3s, explicit seek to 60s resumes; native fullscreen enters/exits. Switch/leave/return pauses and selection retention PASS.

Chromium mobile emulation uses iPhone/Android UA and touch settings, not Safari/iOS runtime. iPad/Android tablet emulations select PC. Representative decoded frames at 60s visually reviewed: correct aspect, no frontend crop/stretch or landscape bars around portrait. Reading small source text/subtitles on physical devices and orientation/fullscreen still need human checks; videos themselves unchanged.

Live CX requests remain isolated in browser regression: test domain is not authorized for CX. No live CX conversation, API or config change; unchanged Messenger fragment/config plus CX request/date/Playbook and analytics contracts covered by existing unit tests and unchanged-file diff. Do not claim live CX end-to-end acceptance.
