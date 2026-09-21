# Headless Chrome via raw CDP — reusable technique for testing without a browser tool

Part of أدواتي (adawati.space) project history — split out of the main CLAUDE.md on 2026-09-21 to keep that file lean. See CLAUDE.md's "Documentation index" section for how this fits in.

## Headless Chrome via raw CDP — reusable technique when no browser tool is available, 2026-09-10

This session had no CDP/browser-automation tool (confirmed via repeated `ToolSearch`, unlike earlier sessions this project references). Built a minimal working substitute using only Bash/PowerShell + Node, since Chrome itself is installed on this machine (`C:\Program Files\Google\Chrome\Application\chrome.exe`, used before for icon rendering):
1. Launch: `chrome.exe --headless=new --disable-gpu --remote-debugging-port=9333 --user-data-dir=<scratch dir> "about:blank"` in the background.
2. `GET http://localhost:9333/json/version` confirms it's up and gives the browser-level `webSocketDebuggerUrl`.
3. Open a tab: `PUT http://localhost:9333/json/new?about:blank` (must be PUT, not GET, on this Chrome version — GET returns a plain-text rejection instead of JSON, easy to misdiagnose as a JSON parse bug at first).
4. Connect via Node's built-in global `WebSocket` (Node 22+, confirmed on this machine at v24) to the tab's `webSocketDebuggerUrl`, send raw CDP JSON-RPC messages (`{id, method, params}`), track responses by `id` in a `Map`.
5. Useful methods for actually testing a live page's JS: `Runtime.enable` + `Runtime.evaluate` (run arbitrary JS in the page, `returnByValue:true` to get real values back, not just object refs) to both drive the page (e.g. set a search box's `.value` and call its `filterTools()` directly) and read results back (e.g. read `#crossSiteGrid`'s rendered `innerHTML`); `Page.navigate`; `Page.captureScreenshot` (base64 PNG, write via `Buffer.from(data,'base64')`).
6. **This is real functional verification, not a guess** — used it to confirm the cross-site smart search feature (built same session) actually returns correct live results for "jordan university", "currency india", "salary oman" queries, not just that the JS has no syntax errors.

**Gotcha hit while using this**: a first quick-and-dirty test script showed stale results across sequential queries in the same tab (looked like a real site bug at first) — turned out to be a bug in the *test script's* own timing/tab-reuse logic, not the site. A cleaner rewrite (explicit `inputVal` read-back alongside the result, reusing the already-open tab via `/json/list` instead of opening a fresh one per script run) confirmed the site itself was correct all along. **Lesson: when a CDP-driven test shows a suspicious result, suspect the test script's own async/tab-state handling before concluding the site is broken** — same category of lesson as the CDP mobile-emulation false positives documented elsewhere in this file, just inverted (false negative from the test tool this time, not a false positive).

**Real mistake made while doing this, worth flagging so it isn't repeated**: killed Chrome afterward with `taskkill /F /IM chrome.exe` — this kills **every** `chrome.exe` process system-wide, including the user's own actual browser windows/tabs, not just the isolated headless test instance. Got lucky this time (user confirmed no actual work was lost). **If this technique is reused, kill only the specific PID(s) actually launched for the test** (capture the PID when starting the background process, e.g. via `$!` in bash or `Start-Process ... -PassThru` in PowerShell), never a blanket `taskkill /IM chrome.exe`.

