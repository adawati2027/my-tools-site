// Browser-driven end-to-end tests for real user journeys on adawati.space —
// search, category filters, country/language selectors, dark mode, the
// mobile hamburger menu, and the PWA install-prompt dismiss behavior.
// Complements test-calculators.js (which checks calculation correctness);
// this one checks that the interactive chrome around the tools actually works.
//
// No dependencies (matches this repo's no-node_modules convention). Runs
// against the live production site via raw CDP.
//
// Usage:
//   "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --remote-debugging-port=9750 --user-data-dir=<scratch dir> about:blank
//   node test-e2e.js

const http = require('http');

const CDP_PORT = 9750;
const BASE = 'https://adawati.space';

function putJson(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: 'localhost', port: CDP_PORT, path, method: 'PUT' }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject); req.end();
  });
}
let idCounter = 1;

class Session {
  constructor() { this.pending = new Map(); this.consoleErrors = []; }
  async open() {
    this.tab = await putJson('/json/new?about:blank');
    this.ws = new WebSocket(this.tab.webSocketDebuggerUrl);
    await new Promise(r => this.ws.addEventListener('open', r));
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) { this.pending.get(msg.id)(msg.result); this.pending.delete(msg.id); }
      if (msg.method === 'Runtime.exceptionThrown') {
        this.consoleErrors.push(msg.params.exceptionDetails.text);
      }
    });
    await this.send('Page.enable');
    await this.send('Runtime.enable');
  }
  send(method, params) {
    return new Promise((resolve) => {
      const id = idCounter++;
      this.pending.set(id, resolve);
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  async setViewport(width, height, mobile) {
    await this.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile });
  }
  async goto(url) {
    const navPromise = new Promise(resolve => {
      const handler = (ev) => { const msg = JSON.parse(ev.data); if (msg.method === 'Page.loadEventFired') { this.ws.removeEventListener('message', handler); resolve(); } };
      this.ws.addEventListener('message', handler);
    });
    await this.send('Page.navigate', { url });
    await navPromise;
    await this.wait(700);
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ': ' + JSON.stringify(r.exceptionDetails.exception));
    return r.result ? r.result.value : undefined;
  }
  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  async close() {
    await this.send('Target.closeTarget', { targetId: this.tab.id });
    this.ws.close();
  }
}

const results = [];
function check(name, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, actual, expected, pass });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + '  (got: ' + JSON.stringify(actual) + ', expected: ' + JSON.stringify(expected) + ')');
}

(async () => {
  // ==================== Homepage: search ====================
  {
    const s = new Session(); await s.open();
    await s.goto(BASE + '/?e2e=1');
    const localSearch = await s.eval(`
      document.getElementById('toolSearch').value = 'bmi';
      filterTools();
      Array.from(document.querySelectorAll('#toolsGrid .tool-card')).filter(c => c.style.display !== 'none').length;
    `);
    check('search "bmi" shows at least 1 matching local card', localSearch >= 1, true);

    const noResultQuery = await s.eval(`
      document.getElementById('toolSearch').value = 'zzzznonexistenttoolzzzz';
      filterTools();
      var visible = Array.from(document.querySelectorAll('#toolsGrid .tool-card')).filter(c => c.style.display !== 'none').length;
      var noResEl = document.getElementById('noResults');
      JSON.stringify({ visible: visible, noResultsShown: noResEl ? noResEl.style.display !== 'none' : false });
    `);
    const nr = JSON.parse(noResultQuery);
    check('nonsense query shows 0 local cards', nr.visible, 0);
    check('nonsense query shows the no-results message', nr.noResultsShown, true);

    await s.eval(`document.getElementById('toolSearch').value=''; filterTools();`);
    await s.close();
  }

  // ==================== Homepage: category filter tabs ====================
  {
    const s = new Session(); await s.open();
    await s.goto(BASE + '/?e2e=1');
    const r = await s.eval(`
      var moneyBtn = document.querySelector('.cat-tab[data-cat="money"]');
      moneyBtn.click();
      var visible = Array.from(document.querySelectorAll('#toolsGrid .tool-card')).filter(c => c.style.display !== 'none');
      var allMoney = visible.every(c => c.dataset.cat === 'money');
      JSON.stringify({ activeClass: moneyBtn.classList.contains('active'), count: visible.length, allMoney: allMoney });
    `);
    const v = JSON.parse(r);
    check('category tab "money" becomes active on click', v.activeClass, true);
    check('category tab "money" filters to only money-tagged cards', v.allMoney, true);
    check('category tab "money" shows at least 1 card', v.count >= 1, true);
    await s.close();
  }

  // ==================== Homepage: language selector ====================
  {
    const s = new Session(); await s.open();
    await s.goto(BASE + '/?e2e=1');
    const r = await s.eval(`
      document.getElementById('langToggleBtn').click();
      var menuOpenAfterClick = document.getElementById('langMenu').classList.contains('open');
      document.querySelector('#langMenu a[data-lang="ar"]').click();
      JSON.stringify({ menuOpenAfterClick: menuOpenAfterClick, htmlLang: document.documentElement.lang, dir: document.documentElement.dir });
    `);
    const v = JSON.parse(r);
    check('language menu opens on click', v.menuOpenAfterClick, true);
    check('switching to Arabic sets html lang=ar', v.htmlLang, 'ar');
    check('switching to Arabic sets dir=rtl', v.dir, 'rtl');

    // switch back to English and confirm it sticks after reload (localStorage persistence)
    await s.eval(`document.getElementById('langToggleBtn').click(); document.querySelector('#langMenu a[data-lang="en"]').click();`);
    await s.goto(BASE + '/?e2e=2');
    const persisted = await s.eval(`document.documentElement.lang`);
    check('language choice persists across reload (back to en)', persisted, 'en');
    await s.close();
  }

  // ==================== Homepage: country selector navigates ====================
  {
    const s = new Session(); await s.open();
    await s.goto(BASE + '/?e2e=1');
    const r = await s.eval(`
      document.getElementById('ctyToggleBtn').click();
      var link = document.querySelector('#ctyMenu a[href="om/"]');
      !!link;
    `);
    check('country menu contains an Oman link', r, true);
    // Actually follow it and confirm real navigation happens
    await s.eval(`document.querySelector('#ctyMenu a[href="om/"]').click();`);
    await s.wait(1000);
    const url = await s.eval(`location.pathname`);
    check('clicking Oman in country menu navigates to /om/', url, '/om/');
    await s.close();
  }

  // ==================== Dark mode toggle ====================
  {
    const s = new Session(); await s.open();
    await s.goto(BASE + '/?e2e=1');
    const r = await s.eval(`
      var before = document.documentElement.classList.contains('dark');
      document.getElementById('darkToggleBtn').click();
      var after = document.documentElement.classList.contains('dark');
      JSON.stringify({ before: before, after: after, flipped: before !== after });
    `);
    const v = JSON.parse(r);
    check('dark mode toggle flips the dark class', v.flipped, true);
    // confirm it persists across reload
    await s.goto(BASE + '/?e2e=2');
    const persisted = await s.eval(`document.documentElement.classList.contains('dark')`);
    check('dark mode choice persists across reload', persisted, v.after);
    // flip back to leave state clean for other tests sharing this profile
    if (persisted) await s.eval(`document.getElementById('darkToggleBtn').click();`);
    await s.close();
  }

  // ==================== Mobile hamburger menu ====================
  {
    const s = new Session(); await s.open();
    await s.setViewport(390, 844, true);
    await s.goto(BASE + '/?e2e=1');
    const opened = await s.eval(`
      document.getElementById('navToggleBtn').click();
      document.querySelector('.nav-links').classList.contains('nav-open');
    `);
    check('mobile menu opens on hamburger click', opened, true);
    const closedByEscape = await s.eval(`
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      document.querySelector('.nav-links').classList.contains('nav-open');
    `);
    check('mobile menu closes on Escape', closedByEscape, false);
    await s.eval(`document.getElementById('navToggleBtn').click();`);
    const closedByOutsideClick = await s.eval(`
      document.querySelector('.hero').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      document.querySelector('.nav-links').classList.contains('nav-open');
    `);
    check('mobile menu closes on outside click', closedByOutsideClick, false);
    await s.close();
  }

  // ==================== PWA install prompt: delayed + dismiss persists ====================
  {
    const s = new Session(); await s.open();
    await s.setViewport(390, 844, true);
    await s.goto(BASE + '/?e2e=1');
    // Simulate the browser's install-eligibility event firing (can't force a real
    // one headlessly) and confirm the banner does NOT appear immediately.
    const immediate = await s.eval(`
      localStorage.removeItem('pwa_dismissed');
      var fakeEvent = new Event('beforeinstallprompt');
      fakeEvent.preventDefault = function(){};
      window.dispatchEvent(fakeEvent);
      !!document.getElementById('pwaBanner');
    `);
    check('PWA banner does not appear immediately on beforeinstallprompt', immediate, false);
    await s.wait(4300);
    const afterDelay = await s.eval(`!!document.getElementById('pwaBanner')`);
    check('PWA banner appears after the ~4s delay', afterDelay, true);
    const afterDismiss = await s.eval(`
      document.querySelector('.pwa-dismiss-btn').click();
      JSON.stringify({ bannerGone: !document.getElementById('pwaBanner'), flagSet: localStorage.getItem('pwa_dismissed') === '1' });
    `);
    const v = JSON.parse(afterDismiss);
    check('PWA banner closes on "Later"', v.bannerGone, true);
    check('PWA dismissal is remembered in localStorage', v.flagSet, true);
    await s.close();
  }

  // ==================== Basic health sample across page types ====================
  {
    const pages = [
      BASE + '/?e2e=1',
      BASE + '/salary-calculator.html?e2e=1',
      BASE + '/om/index.html?e2e=1',
      BASE + '/jo/games/logo-quiz/?e2e=1',
    ];
    for (const url of pages) {
      const s = new Session(); await s.open();
      await s.goto(url);
      const h1Count = await s.eval(`document.querySelectorAll('h1').length`);
      check('exactly one H1 on ' + url.replace(BASE, ''), h1Count, 1);
      check('no console/runtime errors on ' + url.replace(BASE, ''), s.consoleErrors.length === 0, true);
      await s.close();
    }
  }

  console.log('\n--- SUMMARY ---');
  const failed = results.filter(r => !r.pass);
  console.log(results.length + ' checks, ' + (results.length - failed.length) + ' passed, ' + failed.length + ' failed.');
  if (failed.length) {
    console.log('FAILED:');
    failed.forEach(f => console.log('  - ' + f.name + ' (got ' + JSON.stringify(f.actual) + ', expected ' + JSON.stringify(f.expected) + ')'));
    process.exit(1);
  }
  process.exit(0);
})().catch(e => { console.error('TEST RUNNER ERROR:', e.message); process.exit(1); });
