# أدواتي (Adawati) — adawati.space

Free multi-tool Arabic website (calculators, converters, games, daily-info tools). Owner: Ahmed Amawi. Plain static site — no npm, no bundler, no local git repo.

## Token-saving rules (owner's standing request — apply every task)

- **Script/API first, browser last.** Browser only for actions with no API (e.g. GSC "Request Indexing").
- **Reuse `tools/`** helpers; save a one-off script there if it will be needed again.
- **Read narrowly** (`grep`/`sed -n`), never whole large data files. Read `docs/history/*` only for the topic at hand.
- **Screenshots**: zoomed/scaled only; prefer a DOM/JS read when it answers the question.
- **Long jobs** → `run_in_background`, don't poll. **Terse replies.** One session per work thread.
- **Execution**: max 2 sub-agents, sequential; normally none are needed.

## Commands & helpers

- Deploy changed files (default): `node push-files.js <files...> --message "..."` · full site: `node push-to-github.js "msg"` (~300 files, rate-limit prone)
- After adding a page: add URL to `build-sitemap.js` → `node build-sitemap.js` → `node build-search-index.js`
- Language variants: edit root `<tool>.html` → `node build-lang-pages.js` (regenerates `/ar|fr|es|de|ru/<tool>/`; static translated blocks come from `lang-content/<lang>/<tool>.html`)
- Tests (need headless Chrome via CDP, see script headers): `node test-calculators.js`, `node test-e2e.js`
- `tools/gsc-inspect.js` (index status via API) · `tools/build-country-quiz.js` (country quiz from JSON) · `tools/js-syntax.js` (inline-JS syntax check) · `tools/wrap-block.js`, `tools/set-lang-obj.js`, `tools/i18n-gaps.js` (translation helpers) · `tools/admhec-fetch.js`
- Daily 22:00 Windows task "Adawati CLAUDE.md cleanup" runs `tools/md-cleanup.cmd` (headless `claude -p`, edits only CLAUDE.md + `docs/history/claude-md-archive.md`, no push; log `%LOCALAPPDATA%dawati-md-cleanup.log`).
- Shared JS change (`i18n.js` etc.) → bump its `?v=N` in every referencing HTML (grep+sed) so browsers/Cloudflare pick it up.

## Deployment

- `push-*.js` use the GitHub REST API (blobs → tree → commit → ref) with `GITHUB_PAT` from local `.env` (never pushed, never hardcode secrets). Repo `adawati2027/my-tools-site`, branch `main`, GitHub Pages + Cloudflare on `adawati.space`.
- Live after ~30–90 s; verify with cache-busted `curl ...?x=$RANDOM | grep`. No Cloudflare purge access.
- 401 = token expired → owner must create a new fine-grained PAT (Contents: read/write) and put it in `.env`.
- 403 rate limit: don't trust `GET /rate_limit`; read `X-RateLimit-Reset` from a real failing call and `ScheduleWakeup` for that delay.

## Verification policy — the load-bearing rule

Never publish a legal/financial/religious fact without verifying it (WebSearch/WebFetch, cross-checking several sources — government pages can be outdated). If unverifiable or conflicting: say so in the page's disclaimer, or don't build the feature. Jordan income-tax brackets/exemptions were re-verified 2026-09-07 — don't re-investigate unless a *new* amendment is cited (details: `docs/history/claude-md-archive.md`).

## Site structure

- Root tools `<tool>.html` (English-first, 30 of them have `/ar|fr|es|de|ru/<tool>/` variants; picking a language redirects to the matching variant — `i18n.js` `_langVariantUrl`).
- Country verticals `/jo/` (deepest), `/om/`, `/sa/`, `/ae/`, `/eg/`, `/us/`, `/uk/` (+ bd/in/pk/ph hubs). Country quizzes under `<code>/games/<slug>/` (jo, om, sa, ae, eg).
- New `/jo/...` page: copy a similar existing page; keep `<base href="https://adawati.space/">`, GA + AdSense tags, JSON-LD (Breadcrumb + FAQPage), shared CSS classes, nav/footer, current `i18n.js?v=`.
- English-only content pages (Oman guides, omr-to-*, remittance) have `<main dir="ltr">`.

## Open items

- **Google sign-in**: fixed 2026-10-05 (CSP frame-src was blocking `adawati-challenges.firebaseapp.com`). Any CSP change must be made in BOTH the Worker `adawati-csp-nonce` and the "security headers" Transform Rule. See `docs/history/auth-accounts.md`.
- **Ads board phase 2**: ratings + comments + report (phase 1 + expiry + admin nav link are live). See `docs/history/ads-board.md`.
- **bachelor-guide government universities**: `admhec.gov.jo` blocks automation — needs the owner's manually saved pages.
- **masters/bachelor guides**: read `docs/history/claude-md-archive.md` + `calculators-built.md` before extending (dead-end universities listed).
- **GSC indexing**: ~10 URLs/day via browser (memory `gsc_indexing_queue`). Don't resubmit AdSense until organic traffic grows.
- **Quiz levels (medium/hard)**: done for om/sa/ae/eg country quizzes + cooking + jordan-quiz. Owner chose GRADUAL rollout for the other 12 `jo/games/*` quizzes — 1-2 per session via `node tools/quiz-levels.js list|apply <file> [hard-nums]`. Easy questions count as medium.
- **Seasonal**: re-check `jo/students/parallel-results/` university links each admission season.
- Translations: only Arabic is maintained (fr/es/de/ru deliberately deferred, ~0 traffic).

## Documentation index (read only when relevant)

quiz-games · capacitor-app · bugs-fixed-registry · seo-growth · auth-accounts · i18n-language-bugs · export-image-feature · external-qa-reports (quick spot-check only, most were false) · technique-notes (raw CDP) · country-expansion · gold-price-worker · testing-infra · performance-security · onclick-csp-refactor · csp-worker · calculators-built · ads-board · quran-section · i18n-split-project · pdf-export-saga · claude-md-archive — all under `docs/history/<name>.md`.

## Style

- Jordan pages: Jordanian-dialect Arabic, casual and direct.
- Legal/financial calculators: visible "أداة تقديرية" disclaimer + link to the official source.
- No explanatory code comments except genuinely non-obvious constraints.
