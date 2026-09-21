# Deterministic calculator test suite + browser end-to-end test suite

Part of أدواتي (adawati.space) project history — split out of the main CLAUDE.md on 2026-09-21 to keep that file lean. See CLAUDE.md's "Documentation index" section for how this fits in.

## Deterministic calculator test suite — built 2026-09-14

Added `test-calculators.js` (repo root, no dependencies — matches the project's existing scriptless-Node-script convention, no `package.json`/test-framework introduced). Addresses the QA-report ask ("full calculator correctness still needs verification... use deterministic expected results") with real, working, reusable tests rather than a one-off manual check.

**How it works**: launches against the **live production site** (not local files) via raw CDP (same headless-Chrome-without-puppeteer technique used throughout this project — see the "Headless Chrome via raw CDP" section above), sets known input values through the real DOM, calls each page's real calculation function directly (`calcLoan()`, `calculateBMI()`, `calc1()`/`calc2()`/`calc3()`, `calculate()`, `calcAge()`, `generatePassword()`, `convert()`), reads the rendered result back out of the DOM, and asserts against an expected value **independently derived from each calculator's documented formula** (not just "whatever the code currently outputs" — that would only catch regressions, not existing bugs).

**Usage**:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --remote-debugging-port=9700 --user-data-dir=<any scratch dir> about:blank
node test-calculators.js
```
Prints PASS/FAIL per check plus a summary; exits non-zero if anything fails.

**Covers 20 checks across 9 calculators**: loan (monthly payment, total paid, total interest — standard amortization formula), BMI, percentage (all 3 modes: X% of Y, X is what% of Y, % change), VAT (both add-tax and extract-tax modes, Oman 5%), age (years/months/days and total-days-lived), date-diff, end-of-service gratuity, currency conversion, and password generator (length + character-set rules). **All 20 pass as of this writing** — no real calculator bugs found this round, every calculator's math matches its documented formula.

**Two real technique gotchas hit while building this, worth knowing if extended further**:
- **`let`/`const` top-level variables declared inside a page's own `<script>` tag are NOT reachable from an external `Runtime.evaluate` call** (only top-level `function` declarations attach to `window` and are externally callable) — tried to inject test exchange rates via `window.rates = {...}` for the currency-converter test, which silently created an unrelated global instead of setting the `let rates` variable the real `convert()` function actually reads. Worked around it by blocking the 3 live-rate API domains via CDP `Network.setBlockedURLs`, which makes the page fall through to its own already-in-source hardcoded `FALLBACK` rates table — a more realistic test anyway (exercises the page's real fallback code path, not just its math).
- **A reused Chrome profile's `localStorage` persists across test runs and can silently defeat a network block** — the currency-converter caches whatever rates it last successfully fetched, so blocking the live APIs on a profile that already has a cached rate from an earlier run just serves the stale cache instead of falling through to `FALLBACK`. Fixed by explicitly `localStorage.clear()`-ing the origin before that specific test.
- **Date-only ISO strings (`"YYYY-MM-DD"`) parse as UTC midnight in JavaScript, not local midnight** — `new Date(2026,0,15)` (component form) and `new Date("2026-01-15")` (date-only string) are NOT the same instant unless the system timezone is UTC+0. This project's environment runs at UTC+4 (Asia/Muscat) — first attempt at the age-calculator test computed its own "expected" total-days value using component-form construction for the birthdate, which didn't match the site's actual behavior (the site correctly uses `new Date(birthInput)` on the raw date-input string, i.e. UTC-midnight parsing) — a bug in the *test's* expected-value derivation, not the site. Recomputed the expected value using the same UTC-midnight parsing the real code uses, which then matched exactly. **If extending this suite, always derive expected values using the exact same date-construction method the production code actually uses, not whichever form is more convenient in Node.**


## Browser end-to-end test suite — built 2026-09-14

Added `test-e2e.js` (repo root, no dependencies, same raw-CDP-headless-Chrome pattern as `test-calculators.js` and the ad-hoc CDP scripts used throughout this project). Complements `test-calculators.js` — that one checks calculation *correctness*, this one checks that the interactive chrome around the tools actually works: search, category filters, language/country selectors, dark mode, the mobile hamburger menu, and the PWA install-prompt behavior. Same usage pattern (launch headless Chrome on port 9750 first, then `node test-e2e.js`).

**29 checks, all passing on first real run** — homepage search (matching + no-results state), category-tab filtering, language switching (with `dir=rtl` and reload-persistence checks), country-menu navigation (actually follows the Oman link and confirms the URL changes), dark-mode toggle (with reload-persistence), the mobile hamburger menu (open, Escape-to-close, click-outside-to-close — regression coverage for the mobile-nav-collapse feature built earlier this session), the PWA install banner (confirms the ~4s delay actually delays it, confirms "Later" dismissal is remembered in `localStorage`), and a basic health sample (exactly one `H1`, zero console/runtime errors) across 4 different page archetypes (homepage, a root calculator, a country hub, a game page).

This is real regression coverage for several features built earlier in this same session (mobile nav collapse, PWA banner delay/overlap fix) — running it after any future change to `i18n.js`, `style.css`, or the homepage's inline script would have caught a regression in any of those, not just a manual spot-check.

**Scope note**: doesn't include a full sitemap crawl (all 301 URLs returning 200, every page having exactly one H1/title/description/canonical) — that class of check has already been done repeatedly by external QA scans this session and isn't meaningfully different from re-running `curl` in a loop; the value-add here is specifically the *interactive* journeys a plain HTTP check can't exercise. If a true full-site crawl regression check is wanted later, it's a separate, simpler script (no browser needed, just HTTP + HTML parsing).

