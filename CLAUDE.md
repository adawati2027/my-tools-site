# أدواتي (Adawati) — adawati.space

Multi-tool Arabic site (calculators/converters/games). Owner: Ahmed Amawi. Static, no npm/bundler/local-git.

## Token-saving rules (owner's standing request — apply every task)

- **API/script > browser.** Browser only when no API exists (e.g. GCP console, Cloudflare dashboard).
- **Reuse `tools/`**; save one-offs there if reusable later.
- **Partial reads only** (`grep`/`sed -n`/line-range) — never whole large files.
- **Reference, don't inline.** Point to `docs/history/<name>.md` by name (see index below); don't paste its contents here or re-explain it in replies unless asked.
- **Daily/in-progress task status → memory** (`~/.claude/.../memory/*.md`), not CLAUDE.md. Only a *stable, reusable method* graduates to `docs/history/` + a one-line index pointer here.
- **Screenshots**: zoomed only; prefer DOM/JS reads.
- **Long jobs** → background, no polling.
- **Replies**: terse — the change itself, not a recap of unchanged code or theory.
- **Sub-agents**: max 2, sequential; usually none needed.

## Commands & helpers

- Deploy changed files (default): `node push-files.js <files...> --message "..."` · full site: `node push-to-github.js "msg"` (~300 files, rate-limit prone)
- After adding a page: add URL to `build-sitemap.js` → `node build-sitemap.js` → `node build-search-index.js` → `node tools/indexnow.js <url>` + `node tools/gsc-sitemap.js`. OG images: headless `chrome --headless=new --screenshot --window-size=1200,630` of a small HTML card (templates in `tools/og-templates/`, local only).
- Language variants: root `<tool>.html` + per-language maps (`node tools/lang-map.js extract|write|merge|status` → `lang-content/<lang>/<tool>.html`) → `node build-lang-pages.js` regenerates `/ar|fr|es|de|ru/<tool>/` (body + JSON-LD). Editing English text = update the maps too.
- Tests (need headless Chrome via CDP, see script headers): `node test-calculators.js`, `node test-e2e.js`
- Other `tools/`: ga-report [days] (GA4 Data API: channels, sources, top pages, events) · gsc-inspect (index status) · build-country-quiz (then re-run quiz-static) · quiz-static (quiz about/sample Q&A) · quiz-levels list|apply · fill-data-t (WT-object pages) · js-syntax · build-admission-data · build-tajweed-test-data · admhec-import · i18n-gaps/wrap-block/set-lang-obj · fb-fresh-groups [n] (unused FB groups for comment batches; run before opening the browser).
- Daily 22:00 task: `tools/md-cleanup.cmd` (this CLAUDE.md cleanup) → `tools/md-verify-deploy.js` pushes if changed; log `%LOCALAPPDATA%\adawati-md-cleanup.log`.
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
- **AdSense** (rejected 2026-10-08; fixes in seo-growth.md): request review only after organic grows (traffic ~70% FB). Due ~2026-10-15: `ga-report 7` → did /jo/students/parallel-results/ engagement (was 2 s) improve?
- **Indexing** via API only (commands above); never Google's Indexing API (jobs/livestream only).
- **Seasonal** (each admission season): re-check parallel-results links; re-run admhec-import → build-admission-data (steps in claude-md-archive.md).
- **Data audit**: some private bachelor-guide minimums are below the national floor (e.g. AAU engineering 65 vs 80); what-can-i-study applies the floor, the guide doesn't yet.

## Documentation index (read only when relevant)

quiz-games · capacitor-app · bugs-fixed-registry · seo-growth · auth-accounts · i18n-language-bugs · export-image-feature · external-qa-reports (quick spot-check only, most were false) · technique-notes (raw CDP) · country-expansion · gold-price-worker · testing-infra · performance-security · onclick-csp-refactor · csp-worker · calculators-built · ads-board · quran-section · i18n-split-project · pdf-export-saga · claude-md-archive · social-groups-campaign (FB student-group posting method + target list) · joined-university-groups · joined-groups-by-category (already-joined FB groups) · jo-pages-to-group-categories (which /jo/ page fits which group category) · social-posting (FB/IG daily Story/post routine, Page vs profile link-button quirks) — all under `docs/history/<name>.md`.

## Style

- All Arabic pages (jo/om/sa/ae/eg, games, challenges): simple Modern Standard Arabic (فصحى), friendly not stiff — owner request 2026-10-27, replaces the old dialect rule. Quiz content that is itself dialect/proverbs stays as is. Number inputs on jo pages use `type="text" data-num inputmode="decimal"` + the inline Arabic-digit normalizer (so Arabic keyboards work).
- Legal/financial calculators: visible "أداة تقديرية" disclaimer + link to the official source.
- No explanatory code comments except genuinely non-obvious constraints.
