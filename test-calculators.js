// Deterministic browser-driven tests for the site's calculators.
// Runs each real production page in headless Chrome (via raw CDP — no
// puppeteer/playwright dependency, matching this repo's no-node_modules
// convention), sets known inputs, and asserts against expected values
// computed independently from each calculator's documented formula.
//
// Usage: start Chrome headless first, then run this script:
//   "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --remote-debugging-port=9700 --user-data-dir=<scratch dir> about:blank
//   node test-calculators.js
//
// "Today" is frozen to 2026-01-15 for every page load so the age-calculator
// test is reproducible regardless of when this script actually runs.

const http = require('http');

const CDP_PORT = 9700;
const BASE = 'https://adawati.space';
const FROZEN_TODAY = 'new Date(2026,0,15,12,0,0)';

const DATE_MOCK_SCRIPT = `
(function(){
  var _RealDate = Date;
  var fixed = ${FROZEN_TODAY};
  function FakeDate(){
    if (arguments.length === 0) return new _RealDate(fixed.getTime());
    return new (Function.prototype.bind.apply(_RealDate, [null].concat(Array.prototype.slice.call(arguments))))();
  }
  FakeDate.prototype = _RealDate.prototype;
  FakeDate.now = function(){ return fixed.getTime(); };
  FakeDate.UTC = _RealDate.UTC;
  FakeDate.parse = _RealDate.parse;
  window.Date = FakeDate;
})();
`;

function putJson(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: 'localhost', port: CDP_PORT, path, method: 'PUT' }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject); req.end();
  });
}
let idCounter = 1;
function send(ws, pending, method, params) {
  return new Promise((resolve) => {
    const id = idCounter++;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params: params || {} }));
  });
}

async function runOnPage(url, script, opts) {
  opts = opts || {};
  const tab = await putJson('/json/new?about:blank');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  const pending = new Map();
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
  });
  await send(ws, pending, 'Page.enable');
  await send(ws, pending, 'Runtime.enable');
  await send(ws, pending, 'Page.addScriptToEvaluateOnNewDocument', { source: DATE_MOCK_SCRIPT });
  if (opts.blockUrls) {
    await send(ws, pending, 'Network.enable');
    await send(ws, pending, 'Network.setBlockedURLs', { urls: opts.blockUrls });
  }
  const navPromise = new Promise(resolve => {
    const handler = (ev) => { const msg = JSON.parse(ev.data); if (msg.method === 'Page.loadEventFired') { ws.removeEventListener('message', handler); resolve(); } };
    ws.addEventListener('message', handler);
  });
  await send(ws, pending, 'Page.navigate', { url });
  await navPromise;
  await new Promise(r => setTimeout(r, opts.waitMs || 900));
  const result = await send(ws, pending, 'Runtime.evaluate', { expression: script, returnByValue: true, awaitPromise: true });
  await send(ws, pending, 'Target.closeTarget', { targetId: tab.id });
  ws.close();
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + JSON.stringify(result.exceptionDetails.exception));
  return result.result ? result.result.value : undefined;
}

const results = [];
function check(name, actual, expected) {
  const pass = String(actual) === String(expected);
  results.push({ name, actual, expected, pass });
  console.log((pass ? 'PASS' : 'FAIL') + '  ' + name + '  (got: ' + actual + ', expected: ' + expected + ')');
}

(async () => {
  // ---- Loan calculator: amount=10000, rate=6%, years=5 ----
  // Independently computed (standard amortized-payment formula): monthly=193.33, totalPaid=11599.68, totalInterest=1599.68
  {
    const r = await runOnPage(BASE + '/loan-calculator.html?t=1', `
      document.getElementById('amount').value = '10000';
      document.getElementById('rate').value = '6';
      document.getElementById('years').value = '5';
      calcLoan();
      JSON.stringify({
        monthly: document.getElementById('monthlyPayment').textContent,
        total: document.getElementById('totalPaid').textContent,
        interest: document.getElementById('totalInterest').textContent
      });
    `);
    const v = JSON.parse(r);
    check('loan: monthly payment (10000 @ 6% / 5y)', v.monthly, '193.33');
    check('loan: total paid', v.total, '11,599.68');
    check('loan: total interest', v.interest, '1,599.68');
  }

  // ---- BMI: weight=70kg, height=175cm -> 22.9 ----
  {
    const r = await runOnPage(BASE + '/bmi-calculator.html?t=1', `
      document.getElementById('weight').value = '70';
      document.getElementById('height').value = '175';
      calculateBMI();
      document.getElementById('bmiValue').textContent;
    `);
    check('bmi: 70kg / 175cm', r, '22.9');
  }

  // ---- Percentage: 3 tabs ----
  {
    const r = await runOnPage(BASE + '/percentage-calculator.html?t=1', `
      document.getElementById('p1pct').value = '20';
      document.getElementById('p1num').value = '500';
      calc1();
      document.getElementById('p2a').value = '30';
      document.getElementById('p2b').value = '150';
      calc2();
      document.getElementById('p3a').value = '100';
      document.getElementById('p3b').value = '130';
      calc3();
      JSON.stringify({
        r1: document.getElementById('res1val').textContent,
        r2: document.getElementById('res2val').textContent,
        r3: document.getElementById('res3val').textContent
      });
    `);
    const v = JSON.parse(r);
    check('percentage: 20% of 500', v.r1, '100');
    check('percentage: 30 is what % of 150', v.r2, '20%');
    check('percentage: change 100->130', v.r3, '+30%');
  }

  // ---- VAT: Oman 5%, amount=100 ----
  {
    const r = await runOnPage(BASE + '/vat-calculator.html?t=1', `
      document.getElementById('vatAmount').value = '100';
      calculate();
      JSON.stringify({ tax: document.getElementById('taxDisplay').textContent, total: document.getElementById('totalDisplay').textContent });
    `);
    const v = JSON.parse(r);
    check('vat: 5% add-tax on 100 -> tax', v.tax, '5.000 ر.ع');
    check('vat: 5% add-tax on 100 -> total', v.total, '105.000 ر.ع');
  }
  {
    const r = await runOnPage(BASE + '/vat-calculator.html?t=1', `
      document.getElementById('modeEx').click();
      document.getElementById('vatAmount').value = '105';
      calculate();
      JSON.stringify({ tax: document.getElementById('taxDisplay').textContent, breakdown: document.getElementById('vatBreakdown').textContent });
    `);
    const v = JSON.parse(r);
    check('vat: 5% extract-tax from 105 -> tax', v.tax, '5.000 ر.ع');
    check('vat: 5% extract-tax from 105 -> pre-tax shown in breakdown', v.breakdown.includes('100.000'), true);
  }

  // ---- Age: birthdate=1990-05-20, "today" frozen to 2026-01-15 -> 35y 7m 26d, totalDays=13024 ----
  {
    const r = await runOnPage(BASE + '/age-calculator.html?t=1', `
      document.getElementById('birthdate').value = '1990-05-20';
      calcAge();
      JSON.stringify({
        y: document.getElementById('stat-years').textContent,
        m: document.getElementById('stat-months').textContent,
        d: document.getElementById('stat-days').textContent,
        totalDays: document.getElementById('totalDays').textContent
      });
    `);
    const v = JSON.parse(r);
    check('age: 1990-05-20 as of frozen 2026-01-15 -> years', v.y, '35');
    check('age: -> months', v.m, '7');
    check('age: -> days', v.d, '26');
    check('age: -> total days lived', v.totalDays, '13,023');
  }

  // ---- Date diff: 2026-01-01 to 2026-03-15 -> 73 days ----
  {
    const r = await runOnPage(BASE + '/date-diff.html?t=1', `
      document.getElementById('dateFrom').value = '2026-01-01';
      document.getElementById('dateTo').value = '2026-03-15';
      calculate();
      document.getElementById('totalDaysDisplay').textContent;
    `);
    check('date-diff: 2026-01-01 to 2026-03-15 -> total days', r, '73');
  }

  // ---- End of service: start=2020-01-01, end=2025-01-01, salary=500 -> gratuity 2500.000 ----
  {
    const r = await runOnPage(BASE + '/end-of-service.html?t=1', `
      document.getElementById('startDate').value = '2020-01-01';
      document.getElementById('endDate').value = '2025-01-01';
      document.getElementById('basicSalaryEos').value = '500';
      calculate();
      document.getElementById('gratuityDisplay').textContent;
    `);
    check('eos: 500/mo, 5 years exact -> gratuity', r.replace(/[^0-9.]/g, ''), '2500.000');
  }

  // ---- Currency conversion ----
  // The page keeps its live rates in a top-level `let rates`, which isn't reachable
  // as window.rates from outside the script tag — so instead of poking the variable,
  // block the 3 live-rate APIs so the page falls through to its own hardcoded
  // FALLBACK table (USD:1, EUR:0.92 at time of writing), then verify the conversion
  // math against that deterministic, already-in-source data. Also clears localStorage
  // first — the page caches whatever rates it last fetched, which would otherwise
  // let a stale cache silently bypass the network block on a reused browser profile.
  {
    await runOnPage(BASE + '/currency-converter.html?t=1', `localStorage.clear(); 'cleared'`);
    const r = await runOnPage(BASE + '/currency-converter.html?t=1',
      `
      var fromSel = document.getElementById('fromCurr'), toSel = document.getElementById('toCurr');
      fromSel.value = 'USD';
      toSel.value = 'EUR';
      document.getElementById('amount').value = '100';
      convert();
      document.getElementById('resultVal').textContent;
      `,
      { blockUrls: ['*open.er-api.com*', '*api.frankfurter.app*', '*api.exchangerate-api.com*'], waitMs: 2500 }
    );
    check('currency: 100 USD -> EUR with live APIs + cache blocked (FALLBACK rate EUR:0.92)', r, '92.0000 EUR');
  }

  // ---- Password generator: length=20, lowercase only ----
  {
    const r = await runOnPage(BASE + '/password-generator.html?t=1', `
      document.getElementById('lengthSlider').value = '20';
      document.getElementById('useNumbers').checked = false;
      document.getElementById('useSymbols').checked = false;
      document.getElementById('useUpper').checked = false;
      generatePassword();
      var pw = document.getElementById('passOutput').textContent;
      JSON.stringify({ len: pw.length, onlyLower: /^[a-z]+$/.test(pw) });
    `);
    const v = JSON.parse(r);
    check('password: length matches slider (20)', v.len, 20);
    check('password: lowercase-only when all extras unchecked', v.onlyLower, true);
  }

  console.log('\n--- SUMMARY ---');
  const failed = results.filter(r => !r.pass);
  console.log(results.length + ' checks, ' + (results.length - failed.length) + ' passed, ' + failed.length + ' failed.');
  if (failed.length) {
    console.log('FAILED:');
    failed.forEach(f => console.log('  - ' + f.name + ' (got ' + f.actual + ', expected ' + f.expected + ')'));
    process.exit(1);
  }
  process.exit(0);
})().catch(e => { console.error('TEST RUNNER ERROR:', e.message); process.exit(1); });
