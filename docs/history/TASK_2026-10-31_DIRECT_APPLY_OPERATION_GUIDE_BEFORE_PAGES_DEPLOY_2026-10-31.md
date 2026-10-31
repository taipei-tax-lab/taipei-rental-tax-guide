# TASK 2026-10-31 — Cloudflare Pages test publication

Status: **READY_TO_CREATE_PAGES_TEST_PROJECT — NOT RELEASED**

## Scope

Continue approved feature branch `feat/direct-apply-operation-guide-20261031` from `1401ce2f`. Build isolated static output for Pages `rental-tax-guide-test`; production branch is this feature branch. Disable GA4 only in the test artifact. Retain R2 test URLs; do not upload MP4, change CX/GCP, create another service, PR, main merge or institutional deployment. Prefer existing Cloudflare connection/Git integration; report any GitHub authorization/repository selection the user must complete. No keys requested.

## Progress

- [x] Clean worktree, fetched/pulled same branch; already up to date at approved commit.
- [x] Read latest README/State/Task/build flow; Cloudflare skill and current Pages documentation consulted.
- [x] Archived complete prior State and Task under docs/history; current files now track this phase only.
- [x] Implement isolated Pages test build and tests.
- [x] Verify output, GA4 isolation, browser/hash/media regressions.
- [x] Assess Pages/Git access and update results; commit/push same branch for handoff.

## History

- [Approved feature/device correction and all prior evidence](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_PAGES_TEST_2026-10-31.md).
- [Prior State](docs/history/PROJECT_STATE_BEFORE_PAGES_TEST_2026-10-31.md).

## Implementation and build settings

- `scripts/build-pages-test.mjs` invokes the existing build and writes only a fixed allowlist to `dist-pages-test` (ignored by Git). 32 files: index/404, hero PNG/WebP, 3 CSS, 5 JS, 7 entry/logo/poster images, bubble image and 12 dynamic assistant state images. No repo-root copying, documents, metadata, assistant manifest, unused snapshots or MP4.
- Clears only the fixed output directory; refuses a symlink output or non-regular allowlisted asset. Repeat builds remove stale files.
- Removes the known GA4 loader/config block only in output HTML, and fails if the expected block is missing or tracking code remains. Normal index.html/template/analytics.js and events unchanged. Tests restore the removed block and compare the whole HTML, and compare analytics helper unchanged.
- Static 404.html prevents Pages' implicit SPA fallback. Tests verify every local HTML/CSS asset, dynamic assistant fallback, internal hash destination and unchanged media URL.
- `scripts/serve.mjs --pages-test` previews only the isolated directory; default preview is unchanged. `scripts/pages-test-browser-check.cjs` checks no GA4 requests during interactions and 404s for seven representative repo/source paths.
- Pages settings: project `rental-tax-guide-test`, Git repo `taipei-tax-lab/taipei-rental-tax-guide`, production branch `feat/direct-apply-operation-guide-20261031`, framework None, root blank, build `node scripts/build-pages-test.mjs`, output `dist-pages-test`, NODE_VERSION=22 and SKIP_DEPENDENCY_INSTALL=1 in both build environments; preview branches None. No bindings/secrets/functions required.

## Verification — Pages artifact

- `node scripts/build-pages-test.mjs`: PASS (32 static files).
- `node scripts/build.mjs --check`: PASS; normal tracked index.html identical to approved commit.
- `node --test tests/*.test.mjs`: **56/56 PASS**, including three new artifact/isolation tests in a temporary fixture. Exact package-script entrypoints used because npm is absent in local shell.
- `node scripts/performance-budget.mjs`, `git diff --check`: PASS.
- Local server: PORT=4175, `node scripts/serve.mjs --pages-test`; all browser checks use PREVIEW_URL=http://127.0.0.1:4175/ and installed Playwright/Edge.
- `scripts/browser-check.cjs`: PASS; `scripts/chat-viewport-check.cjs`: PASS. No live CX question submitted.
- `scripts/pages-test-browser-check.cjs`: PASS; window.gtag absent, helper returns false, no GA4 loader/collector request during owner/tenant/plan/page/video interactions, no failed runtime assets, documents/source/Git paths return 404.
- `scripts/extension-browser-check.cjs`: PASS at 1440/1100/768/390/320px; hash/history, phone/desktop defaults and retained override; both supplied R2 videos decoded 1920×1080 with advancing currentTime and no media error; native fullscreen entry/exit, switch/leave pause and no autoplay on return. No video upload or URL change.
- Ignored local evidence: `.preview/pages-test-results.json`, `.preview/extension-results.json`, `.preview/browser-results.json` and regression screenshots. No new issue found in these checks.

## Existing Cloudflare/Git integration assessment

- Cloudflare plugin `GET /accounts` identified the existing account; Pages API list returned zero existing projects (page=1/per_page=10; an initial per_page=100 request was rejected as invalid and corrected).
- Dashboard inspected read-only through Workers & Pages → Create application → Pages → Import existing Git repository. Existing GitHub account `taipei-tax-lab` is available and the exact `taipei-rental-tax-guide` repo is listed. No new authorization, repo access expansion or key is required.
- **Ready to create directly with the README settings.** No Pages project created or deployment started in this preparation/feasibility handoff. No other service created or changed.
- Next operator action: select that exact repo → Begin setup → enter target project/feature production branch/build/output/env settings → Save and Deploy. Then inspect build logs and validate the live Pages URL. Pages calls its primary test URL “Production”; this does not authorize main merge or institutional deployment.
- Real Messenger operation on a new Pages hostname remains unverified and may hit existing domain restrictions; do not change CX/GCP to resolve it within this scope. Physical iOS/Android and accessibility review remain pending.
- Documentation references: [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), [build image and skip dependency install](https://developers.cloudflare.com/pages/configuration/build-image/), [static serving behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).
