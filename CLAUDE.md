# أدواتي (Adawati) — adawati.space

Free multi-tool Arabic website (calculators, converters, games, daily-info tools). Owner: Ahmed Amawi. This file exists so a new Claude Code session can resume work with zero ramp-up if this session is lost.


## Deployment — READ THIS FIRST

**There is no local git repo.** Do not run `git init`, `git commit`, etc. — they will not work as expected and are not how this project deploys.

Deployment is via a custom script that talks to the GitHub REST API directly:

```
node push-to-github.js "commit message here"
```

- Reads `GITHUB_PAT` from a local `.env` file (`GITHUB_PAT=...`, gitignored/excluded from the pushed tree).
- Repo: `adawati2027/my-tools-site`, branch `main`, pushed via blobs → tree → commit → ref update (not a real git working directory).
- **Always pushes every file in the project** (no diffing) — pushing after any edit is normal and expected, don't wait to "batch" unless GitHub's rate limit forces it.
- Site is served via GitHub Pages, custom domain `adawati.space` (CNAME on GitHub Pages auto-redirects `adawati2027.github.io/my-tools-site/` → `adawati.space/` with a real 301 — already verified working, don't re-verify).
- Has retry logic built in for transient network errors (`ECONNRESET` etc.) — exponential backoff, 4 attempts.
- After pushing, changes take roughly 30–90 seconds to actually go live; poll with `curl` + `grep` for a known string rather than assuming instant.

### GitHub API rate limiting (hits this OFTEN with ~260 files/push)

Two different things can fail with a 403:
- A short secondary/abuse-detection throttle — usually clears in 1–3 minutes.
- The real hourly quota (5000 req/hr) — tied to a fixed reset epoch.

**`GET /rate_limit` is unreliable** — it has repeatedly shown "5000/5000 fresh" moments before/after real failures this project. Do not trust it.

The correct way to get the real reset time: make one direct failing call (e.g. `POST /repos/adawati2027/my-tools-site/git/blobs`) and read the `X-RateLimit-Reset` response header from that actual call. Compute wait seconds from `epoch - now`, then use `ScheduleWakeup` for exactly that delay (capped at 3600s). Do not guess, do not poll in a tight loop, do not retry more than once without getting a fresh real reset time.


## Verification policy — the load-bearing rule of this whole project

**Never publish a legal/financial/religious fact without verifying it via WebSearch/WebFetch first.** This site has real calculators (taxes, zakat, customs, social security) that Jordanians and others actually rely on. If a fact can't be verified, or sources conflict, either:
- Say so transparently in the UI (a disclaimer, not a fabricated number), or
- Don't build that feature at all.

Concrete precedent: an income-tax calculator bug was reported where "extra expense exemption" was a flat 5,000 JOD for everyone. Investigation found the real law (Article 9, Income Tax Law 34/2014, as amended 2020+) breaks it down as 1,000 self + 1,000 spouse + up to 1,000/child (max 3 kids) = up to 5,000. A different official government page ("الجديد في أحكام القانون" on istd.gov.jo) shows totally different numbers (28,000 cap, 7/14/20% brackets) — that page turned out to describe the law's *original 2014 enactment*, superseded by later amendments; it's just an outdated government page, not current law. This took 5+ rounds of WebFetch on conflicting sources to resolve. **Government pages are not automatically authoritative over other corroborated sources — cross-reference multiple sources and reason about which is actually current before trusting any single one, including official ones.**

**This got re-flagged by external QA reviewers three separate times** (each citing the same superseded 7/14/20%/28,000 numbers) before being put to rest 2026-09-07 with a dedicated fresh re-verification fork: (1) istd.gov.jo's own laws listing explicitly confirms the law *currently in force* is "رقم 34 لسنة 2014 المعدّل بالقانون رقم 38 لسنة 2018", effective 1/1/2019 — direct proof the "الجديد في أحكام القانون" page describes the superseded original text, not current law; (2) a source quoting Article 9 directly; (3) PwC's Worldwide Tax Summaries for Jordan (tax-rates and deductions pages, last reviewed July 2026 — 2 months before this check) match the site's numbers exactly on both brackets (5/10/15/20/25/30%) and exemptions (9,000 + 9,000 + up to 5,000 = 23,000 cap). Three independent angles, one of them the regulator itself. **Do not re-investigate this from scratch again** if it resurfaces — point to this note and the on-page disclaimer (`jo/calculators/income-tax/index.html`) instead, unless the user has specific knowledge of a *new* legislative change (a real amendment, not a re-read of the same old istd.gov.jo page). One genuine gap found during this re-check — **added 2026-09-14**: a 1% "national contribution tax" applies to income over 200,000 JOD/year (very high earners only), introduced by Law 38/2018, effective 1/1/2019. Re-verified independently before publishing (WebSearch + a fresh PwC Worldwide Tax Summaries fetch, still last-reviewed July 2026) rather than trusting this note alone. Added as a transparent disclosure — a new bullet in the "معلومات مهمة" card, a new FAQ `<details>` entry, and a matching JSON-LD `Question` — explicitly stating the calculator does **not** apply this surcharge automatically (not a correctness bug in the existing brackets, which only go up to 30% and were never meant to include this separate surcharge).

When genuinely unresolvable, say so in the page's own disclaimer text rather than picking a number with false confidence.


## Site structure

- Root-level tool pages (English-first, generic): `age-calculator.html`, `bmi-calculator.html`, etc. — ~29 tools.
- Language variants: `/ar/`, `/fr/`, `/es/`, `/de/`, `/ru/<tool>/`.
- Country verticals: `/om/` (Oman, deepest/original), `/ae/`, `/sa/`, `/us/`, `/uk/`, `/jo/` (Jordan — actively being built out, now the second-deepest vertical, ~20+ pages across `calculators/`, `students/`, `games/`, `tools/`, plus daily-info pages like `prayer-times/`, `weather/`, `fuel-prices/`, `holidays/`, `emergency-numbers/`, `gold-price/`).
- Shared `style.css`, shared `i18n.js` (site-wide translations, language switching, country auto-detection and the "📍 Recommended for X" / "✨ You might like" widgets on hub pages).
- `build-sitemap.js` — regenerate `sitemap.xml` after adding any new page (`node build-sitemap.js`), then add the new URL to the `countryTools` array inside it first.

### Standard template for a new `/jo/...` page
Copy `om/salary-calculator/index.html` as the reference. Must include: `<base href="https://adawati.space/">` in `<head>` (makes all relative links resolve from site root regardless of nesting depth), GA + AdSense script tags, JSON-LD (`BreadcrumbList` + `WebApplication` + `FAQPage`), shared CSS classes (`.card`, `.tool-page`, `.option-toggle`/`.option-btn`, `.result-box`, `.stat-grid`, `.row`), standard nav/footer.


## Known open items — check here first before a deep dive

- **CSP oninput/onchange bug (site-wide, only 3 pages confirmed fixed)** — enforced CSP silently blocks `oninput`/`onchange`/etc. attributes, not just `onclick`. A full sweep hasn't been done. See [docs/history/onclick-csp-refactor.md](docs/history/onclick-csp-refactor.md).
- **Duplicate security headers from an old Cloudflare Transform Rule** — harmless (verified via real CSP semantics + browser testing) but not cleaned up; needs Cloudflare dashboard access or a Rulesets-scoped API token this session doesn't have. See [docs/history/csp-worker.md](docs/history/csp-worker.md).
- **No Cloudflare cache-purge access** — a push touching a shared CSS/JS file can take a few minutes to stop serving stale content from Cloudflare's edge; always verify with a cache-busted `curl`. See [docs/history/csp-worker.md](docs/history/csp-worker.md).
- **GSC "Duplicate, Google chose different canonical than user"** — Request Indexing already resubmitted for the 2 affected URLs (2026-09-20); waiting on Google to re-crawl, not a code bug. See [docs/history/seo-growth.md](docs/history/seo-growth.md).
- **AdSense "low value content" flag** — the "replicated content" half was fixed (2026-09-20); don't resubmit for review until real organic-traffic growth is confirmed in GSC. See [docs/history/seo-growth.md](docs/history/seo-growth.md).
- **Logo quiz at 263/~400 target questions** (jumped from 218 via a 2026-09-23 large-scale Wikidata pass skewed toward Adobe/Google/Microsoft app-icon monograms — much higher yield than prior rounds). Still short of 400; further growth needs either more of that same app-icon vein or a genuinely new sourcing method — not a shortfall to force by loosening the visual-review bar. See [docs/history/quiz-games.md](docs/history/quiz-games.md).
- **xlsx CVE, mammoth CVE** — both resolved/assessed-not-exploitable, see [docs/history/performance-security.md](docs/history/performance-security.md) if this resurfaces.
- **i18n.js split project — DONE, not open.** Full core+lazy-load+static-tags rollout verified live 2026-09-21. See [docs/history/i18n-split-project.md](docs/history/i18n-split-project.md) only if extending it further.

## Documentation index

CLAUDE.md was split 2026-09-21 (it had grown to ~430KB / 1,284 lines, all reloaded into context on every session — a real, avoidable token cost). This file now holds only the standing operational rules + a pointer to detailed history. **Only read a file below when a task actually touches that topic** — don't load them all "just in case".

- [Firebase quiz engine, 14-game arcade + logo-quiz history, result-sharing](docs/history/quiz-games.md)
- [Android/iOS Capacitor native app (adawati-app)](docs/history/capacitor-app.md)
- [Fixed content/UX bugs — reference so they are not reintroduced](docs/history/bugs-fixed-registry.md)
- [SEO audits, GSC/search-index work, growth features, AdSense, canonical issue](docs/history/seo-growth.md)
- [Firebase Auth, favorites/recent sync, Google Sign-In (desktop + mobile)](docs/history/auth-accounts.md)
- [Mixed-language / untranslated-element bugs across country hubs and pages](docs/history/i18n-language-bugs.md)
- [Branded result-image export/share feature — built, extended, and its bugs](docs/history/export-image-feature.md)
- [Unsolicited external "QA report" pastes — verification pattern and outcomes](docs/history/external-qa-reports.md)
- [Headless Chrome via raw CDP — reusable technique for testing without a browser tool](docs/history/technique-notes.md)
- [Daily-info modules, 5-module expansion, emergency numbers — rolled out to all countries](docs/history/country-expansion.md)
- [Gold-price accuracy investigation + Cloudflare Worker server-side fallback](docs/history/gold-price-worker.md)
- [Deterministic calculator test suite + browser end-to-end test suite](docs/history/testing-infra.md)
- [Lighthouse/performance, dependency & security audits, xlsx CVE fix](docs/history/performance-security.md)
- [Inline onclick→addEventListener refactor + the active CSP oninput bug](docs/history/onclick-csp-refactor.md)
- [CSP hardening via Cloudflare Worker + nonce, enforcement, edge-cache staleness](docs/history/csp-worker.md)
- [New calculators built (Jordan pension, GOSI, gratuity, loan modes, etc.)](docs/history/calculators-built.md)
- [i18n.js split into lazy-loaded per-language packs (DONE 2026-09-21)](docs/history/i18n-split-project.md)
- [Loan-calculator amortization CSV/PDF export — the full 6-round mobile bug saga](docs/history/pdf-export-saga.md)

## Style/tone conventions

- All Jordan-vertical copy is in Jordanian-dialect Arabic (not MSA), casual and direct — match existing pages' voice, not formal Arabic.
- Every calculator with a legal/financial figure gets a visible "ليست رسمية / أداة تقديرية" disclaimer and a link to the actual official source (istd.gov.jo, customs.gov.jo, ssc.gov.jo, etc.).
- Don't add comments to code explaining what it does; this codebase has none and it should stay that way except where a genuinely non-obvious constraint needs recording (see existing sparse examples in the quiz JS for the bar this should clear).

