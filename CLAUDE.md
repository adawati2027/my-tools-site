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
- After adding a page: add URL to `build-sitemap.js` → `node build-sitemap.js` → `node build-search-index.js` → `node tools/indexnow.js <url>` + `node tools/gsc-sitemap.js`. OG images: headless `chrome --headless=new --screenshot --window-size=1200,630` of a small HTML card (templates in `tools/og-templates/`, local only).
- Language variants: edit root `<tool>.html` → `node build-lang-pages.js` (regenerates `/ar|fr|es|de|ru/<tool>/`; static translated blocks come from `lang-content/<lang>/<tool>.html`)
- Tests (need headless Chrome via CDP, see script headers): `node test-calculators.js`, `node test-e2e.js`
- `tools/gsc-inspect.js` (index status via API) · `tools/build-country-quiz.js` (country quiz from JSON) · `tools/js-syntax.js` (inline-JS syntax check) · `tools/wrap-block.js`, `tools/set-lang-obj.js`, `tools/i18n-gaps.js` (translation helpers) · `tools/build-admission-data.js` · `tools/build-tajweed-test-data.js` · `tools/quiz-levels.js list|apply <file> [hard-nums]` (new quizzes; easy counts as medium)
- Daily 22:00 Windows task "Adawati CLAUDE.md cleanup" runs `tools/md-cleanup.cmd` (headless `claude -p`, edits only CLAUDE.md + archive), then `tools/md-verify-deploy.js` sanity-checks and pushes those 2 files if changed; log `%LOCALAPPDATA%\adawati-md-cleanup.log`).
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

- **CSP**: any change must be made in BOTH the Worker `adawati-csp-nonce` and the "security headers" Transform Rule.
- **masters/bachelor guides**: read `docs/history/claude-md-archive.md` + `calculators-built.md` before extending (dead-end universities listed).
- **Indexing**: owner wants API, not UI (2026-10-06). `node tools/indexnow.js` (Bing/Yandex, all sitemap URLs). Google: `node tools/gsc-sitemap.js` resubmits sitemap.xml via API (SA has Full since 2026-10-07) — run after adding pages; Google has no legit API for "Request Indexing" (Indexing API is jobs/livestream only — don't use it). Don't resubmit AdSense until organic traffic grows.
- **Seasonal**: re-check `jo/students/parallel-results/` university links each admission season; re-run `tools/admhec-import.js` with new owner-saved admhec pages (bachelor-guide), then `tools/build-admission-data.js <same pages>` (what-can-i-study).
- **Student tools data gaps**: University of Jordan has 2025 only (no 2021–24 history — needs owner-saved admhec page, code 100). Some private entries in bachelor-guide list minimums below the national floor (e.g. AAU engineering 65 vs 80) — what-can-i-study applies the floor; the guide itself still shows the raw value (needs audit).
- Translations: only Arabic is maintained (fr/es/de/ru deliberately deferred, ~0 traffic).

## Documentation index (read only when relevant)

quiz-games · capacitor-app · bugs-fixed-registry · seo-growth · auth-accounts · i18n-language-bugs · export-image-feature · external-qa-reports (quick spot-check only, most were false) · technique-notes (raw CDP) · country-expansion · gold-price-worker · testing-infra · performance-security · onclick-csp-refactor · csp-worker · calculators-built · ads-board · quran-section · i18n-split-project · pdf-export-saga · claude-md-archive — all under `docs/history/<name>.md`.

## Style

- Jordan pages: Jordanian-dialect Arabic, casual and direct.
- Legal/financial calculators: visible "أداة تقديرية" disclaimer + link to the official source.
- No explanatory code comments except genuinely non-obvious constraints.
