# PROJECT_STATE

Last updated: 2026-10-31

- Repository: `taipei-tax-lab/taipei-rental-tax-guide`; frontend only.
- Branch: `feat/direct-apply-operation-guide-20261031`; synced clean at `1401ce2f02f210a81ad753cb59fb25d604d08075`.
- ChatGPT approved the six-entry/application/video features and device-default correction at that commit.
- Current phase: **READY_TO_CREATE_PAGES_TEST_PROJECT — NOT RELEASED**.
- Target: Cloudflare Pages `rental-tax-guide-test`, production branch = this feature branch. Git integration preferred; only publish an isolated static directory with GA4 disabled in that test artifact.
- Canonical task: [TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md](TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE.md).
- Frozen: policy, player copy/behavior, R2 video URLs/files, Messenger/CX/GCP and existing environments' GA4. No PR, main merge or institutional deployment.
- Prior State: [before Pages phase](docs/history/PROJECT_STATE_BEFORE_PAGES_TEST_2026-10-31.md). Prior Task/evidence: [before Pages phase](docs/history/TASK_2026-10-31_DIRECT_APPLY_OPERATION_GUIDE_BEFORE_PAGES_TEST_2026-10-31.md). Earlier snapshots remain intact.

## Current result

- Build: `node scripts/build-pages-test.mjs` (`npm run build:pages:test`); output `dist-pages-test`; framework None, root blank, NODE_VERSION=22 and SKIP_DEPENDENCY_INSTALL=1 for Production/Preview. Preview branch deployments: None. Settings documented in README.
- Output: 32 allowlisted static files; no Repo documents/source/metadata/MP4. Root 404.html prevents Pages SPA fallback. GA4 loader/config removed only from test HTML; normal index.html and analytics helper are unchanged.
- Validation: build + canonical build check PASS; full Node suite **56/56 PASS**; performance budget/diff check PASS. Browser integration, chat viewport, Pages-specific GA4/404/assets/hash checks and extension/R2 regression PASS against the actual isolated output at five widths. No new problem found.
- Cloudflare connection: Pages API read succeeds; no Pages projects exist. Dashboard's existing Cloudflare Pages GitHub integration lists account `taipei-tax-lab` and exact repo `taipei-rental-tax-guide`. **Can create directly; no new GitHub authorization or keys needed.**
- This phase prepares and assesses creation as requested; no Pages project was created and no Cloudflare/institutional site was deployed. On creation select this repo, project `rental-tax-guide-test`, feature production branch, and the README build settings. Existing services untouched.
- Remaining: create/save/deploy the test project using those settings and verify its live Pages URL. Real Messenger on a new domain is unverified and may be domain-restricted; CX/GCP configuration stays frozen. Physical-device/accessibility acceptance remains pending.
