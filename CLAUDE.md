# أدواتي (Adawati) — adawati.space

Free multi-tool Arabic website (calculators, converters, games, daily-info tools). Owner: Ahmed Amawi. Plain static site — no npm, no bundler, no local git repo.

## Token-saving rules (owner's standing request — apply every task)

- **Script/API first, browser last.** Browser only for actions with no API (e.g. enabling a GCP API, Cloudflare dashboard).
- **Reuse `tools/`** helpers; save a one-off script there if it will be needed again.
- **Read narrowly** (`grep`/`sed -n`), never whole large data files. Read `docs/history/*` only for the topic at hand.
- **Screenshots**: zoomed/scaled only; prefer a DOM/JS read when it answers the question.
- **Long jobs** → `run_in_background`, don't poll. **Terse replies.** One session per work thread.
- **Execution**: max 2 sub-agents, sequential; normally none are needed.

## Commands & helpers

- Deploy changed files (default): `node push-files.js <files...> --message "..."` · full site: `node push-to-github.js "msg"` (~300 files, rate-limit prone)
- After adding a page: add URL to `build-sitemap.js` → `node build-sitemap.js` → `node build-search-index.js` → `node tools/indexnow.js <url>` + `node tools/gsc-sitemap.js`. OG images: headless `chrome --headless=new --screenshot --window-size=1200,630` of a small HTML card (templates in `tools/og-templates/`, local only).
- Language variants: root `<tool>.html` + per-language maps (`node tools/lang-map.js extract|write|merge|status` → `lang-content/<lang>/<tool>.html`) → `node build-lang-pages.js` regenerates `/ar|fr|es|de|ru/<tool>/` (body + JSON-LD). Editing English text = update the maps too.
- Tests (need headless Chrome via CDP, see script headers): `node test-calculators.js`, `node test-e2e.js`
- Other `tools/`: ga-report [days] (GA4 Data API: channels, sources, top pages, events) · gsc-inspect (index status) · build-country-quiz (then re-run quiz-static) · quiz-static (quiz about/sample Q&A) · quiz-levels list|apply · fill-data-t (WT-object pages) · js-syntax · build-admission-data · build-tajweed-test-data · admhec-import · i18n-gaps/wrap-block/set-lang-obj.
- Daily 22:00 Windows task "Adawati CLAUDE.md cleanup" runs `tools/md-cleanup.cmd` (headless `claude -p`, edits only CLAUDE.md + archive), then `tools/md-verify-deploy.js` sanity-checks and pushes those 2 files if changed; log `%LOCALAPPDATA%\adawati-md-cleanup.log`).
- Shared JS change (`i18n.js` etc.) → bump its `?v=N` in every referencing HTML (grep+sed) so browsers/Cloudflare pick it up.

## Social posting (Facebook/Instagram) — daily, via browser

- Image templates: `tools/social-templates/*.html` (1080×1080 feed post, 1080×1920 story) → render to PNG with headless Chrome: `chrome --headless=new --window-size=W,H --screenshot=out.png "file:///...html"`.
- Facebook: post to **both** the Page (Adawati2027) and the personal profile (Adawati Adawati) — switch between them via the top-right avatar → pick profile. Confirm with the owner before each publish (don't auto-publish).
- Facebook Page Stories support a real clickable link: Create story → upload image → sidebar "Add button" → "Web link button" → pick a label (e.g. "Learn more") → paste the URL. **Personal-profile Stories do NOT support link buttons** — Pages only. For the profile, bake "🔗 الرابط بالبايو" into the image instead and keep the real link in the profile's About → **Links** tab (not the Social-media/Instagram field) — one-time setup, already done for Adawati Adawati.
- A Story's in-image hint text should name the real button ("اضغط هنا Learn more 👇") — a generic "دوس تحت" or a bare arrow glyph reads as its own (dead) button and confuses viewers into tapping the wrong spot.
- Instagram: **no Story posting is possible from the desktop browser** — confirmed dead end two ways: plain instagram.com's Create menu only offers Post/Live video/Ad (no Story), and Meta Business Suite's Create-story composer's "Add photo/video" button has no accessible `<input type=file>` (`document.querySelectorAll('input[type=file]').length === 0`, confirmed via JS). Feed posts *can* be published via instagram.com (Create → Post → crop → filters → caption → Share), with an optional "Share to Facebook" toggle. For Instagram **Stories**, send the rendered PNG to the owner via `SendUserFile` and have them post from their phone (Stickers tray → search "Link").
- Instagram (adawati2027) is linked to Meta Business Suite (done 2026-10-10) — doesn't unlock web Story posting, but keeps both platforms manageable from one place for anything else.

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
- **AdSense** (rejected 2026-10-08; fixes done, see seo-growth.md). Traffic is ~70% Facebook, organic search small — request review only after organic grows. ~2026-10-15: `node tools/ga-report.js 7`, check whether /jo/students/parallel-results/ engagement (was 2 s) improved after the next-step links.
- **Indexing** via API only (commands above); never Google's Indexing API (jobs/livestream only).
- **Seasonal**: re-check `jo/students/parallel-results/` university links each admission season; re-run `tools/admhec-import.js` with new owner-saved admhec pages (bachelor-guide), then `tools/build-admission-data.js <same pages>` (what-can-i-study).
- **Data audit**: some private bachelor-guide minimums are below the national floor (e.g. AAU engineering 65 vs 80); what-can-i-study applies the floor, the guide doesn't yet.

## Documentation index (read only when relevant)

quiz-games · capacitor-app · bugs-fixed-registry · seo-growth · auth-accounts · i18n-language-bugs · export-image-feature · external-qa-reports (quick spot-check only, most were false) · technique-notes (raw CDP) · country-expansion · gold-price-worker · testing-infra · performance-security · onclick-csp-refactor · csp-worker · calculators-built · ads-board · quran-section · i18n-split-project · pdf-export-saga · claude-md-archive · social-groups-campaign (FB student-group posting method + target list) — all under `docs/history/<name>.md`.

## Style

- Jordan pages: Jordanian-dialect Arabic, casual and direct.
- Legal/financial calculators: visible "أداة تقديرية" disclaimer + link to the official source.
- No explanatory code comments except genuinely non-obvious constraints.
