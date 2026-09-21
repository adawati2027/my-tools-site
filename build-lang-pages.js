'use strict';
const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const SITE_DIR = __dirname;
const BASE_URL = 'https://adawati.space';

// ── Mock browser globals so i18n.js can be evaluated in Node ──
const el = () => ({
  style:{}, classList:{add:()=>{},toggle:()=>false,contains:()=>false,remove:()=>{}},
  setAttribute:()=>{}, getAttribute:()=>null, insertBefore:()=>{}, appendChild:()=>{},
  remove:()=>{}, querySelectorAll:()=>({forEach:()=>{}}), querySelector:()=>null,
  firstChild:null, textContent:'', innerHTML:'', append:()=>{}
});
const sandbox = {
  window: { addEventListener:()=>{}, onLangChange:null, dataLayer:[] },
  document: {
    querySelector:()=>null, querySelectorAll:()=>({forEach:()=>{}}),
    getElementById:()=>null, createElement:()=>el(), addEventListener:()=>{},
    documentElement: { classList:{add:()=>{},toggle:()=>false,contains:()=>false,remove:()=>{}},
                       style:{}, lang:'en', dir:'ltr', setAttribute:()=>{}, getAttribute:()=>null },
    head:{ appendChild:()=>{} }, body:{ dir:'ltr', appendChild:()=>{} }, title:''
  },
  localStorage: { getItem:()=>null, setItem:()=>{} },
  sessionStorage: { getItem:()=>null, setItem:()=>{} },
  navigator: { language:'en', userLanguage:'en', serviceWorker:{ register:()=>Promise.resolve() } },
  location: { pathname:'/my-tools-site/percentage-calculator.html', href:'', hash:'' },
  console: { log:()=>{}, warn:()=>{}, error:()=>{} },
  setTimeout:()=>0, clearTimeout:()=>{}, setInterval:()=>0, clearInterval:()=>{},
  fetch: ()=>Promise.resolve({ json:()=>({}) }),
  Promise, URL: (typeof URL !== 'undefined' ? URL : Object)
};
vm.createContext(sandbox);
const i18nCode = fs.readFileSync(path.join(SITE_DIR, 'i18n.js'), 'utf8');
try { vm.runInContext(i18nCode, sandbox); } catch(e) { /* ignore DOM runtime errors */ }
let PAGE_META = {};
try { PAGE_META = vm.runInContext('typeof PAGE_META !== "undefined" ? PAGE_META : {}', sandbox); } catch(e) {}
console.log(`PAGE_META loaded for: ${Object.keys(PAGE_META).join(', ')}`);

// ── All 30 tool slugs ──
const TOOLS = [
  'age-calculator','bmi-calculator','compound-interest','currency-converter',
  'date-diff','diet-plan','discount-calculator','end-of-service',
  'file-converter','hijri-converter','image-compressor','loan-calculator',
  'password-generator','percentage-calculator','qr-generator','random-number',
  'salary-calculator','stopwatch','timezone-converter','tip-calculator',
  'unit-converter','vat-calculator','word-counter','kids-learn',
  'memory-game','number-guess','quick-math','reaction-test','car-game','jump-game'
];

// ── 5 non-English languages to generate ──
const LANGS = [
  { code:'ar', dir:'rtl', htmlLang:'ar' },
  { code:'fr', dir:'ltr', htmlLang:'fr' },
  { code:'es', dir:'ltr', htmlLang:'es' },
  { code:'de', dir:'ltr', htmlLang:'de' },
  { code:'ru', dir:'ltr', htmlLang:'ru' }
];

// ── Extra country-specific hreflang entries per tool ──
const EXTRA = {
  'salary-calculator':    [{ hl:'ar-OM', href:`${BASE_URL}/om/salary-calculator/` }],
  'vat-calculator':       [{ hl:'en-AE', href:`${BASE_URL}/ae/vat-calculator/` },
                           { hl:'ar-SA', href:`${BASE_URL}/sa/vat-calculator/` }],
  'tip-calculator':       [{ hl:'en-US', href:`${BASE_URL}/us/tip-calculator/` }],
  'percentage-calculator':[{ hl:'en-GB', href:`${BASE_URL}/uk/percentage-calculator/` }]
};

// ── Build complete hreflang block for a tool (all 6 variants + x-default) ──
function buildHreflangBlock(tool) {
  const lines = [`<link rel="alternate" hreflang="en" href="${BASE_URL}/${tool}.html">`];
  LANGS.forEach(l => lines.push(`<link rel="alternate" hreflang="${l.code}" href="${BASE_URL}/${l.code}/${tool}/">`));
  (EXTRA[tool] || []).forEach(e => lines.push(`<link rel="alternate" hreflang="${e.hl}" href="${e.href}">`));
  lines.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/${tool}.html">`);
  return lines.join('\n');
}

// ── Regex matching one or more consecutive hreflang link lines ──
const HREFLANG_RE = /(<link rel="alternate" hreflang="[^"]*" href="[^"]*">\r?\n?)+/g;

let created = 0, rootsUpdated = 0;

TOOLS.forEach(tool => {
  const srcPath = path.join(SITE_DIR, `${tool}.html`);
  if (!fs.existsSync(srcPath)) { console.log(`SKIP (not found): ${tool}.html`); return; }

  // Normalize to LF for consistent regex matching
  const source = fs.readFileSync(srcPath, 'utf8').replace(/\r\n/g, '\n');
  const meta   = PAGE_META[tool] || null;
  const block  = buildHreflangBlock(tool);

  // English title/desc fallback from the HTML itself
  const enTitle = (source.match(/<title>([^<]*)<\/title>/) || [])[1] || tool;
  const enDesc  = (source.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';

  // ── 1. Update root HTML: replace old hreflang with full 7-lang block ──
  const rootHtml = source.replace(HREFLANG_RE, block + '\n');
  if (rootHtml !== source) {
    fs.writeFileSync(srcPath, rootHtml, 'utf8');
    rootsUpdated++;
    console.log(`  root: updated ${tool}.html`);
  }

  // ── 2. Generate 5 language variant pages ──
  LANGS.forEach(({ code, dir, htmlLang }) => {
    const title    = (meta && meta.title && meta.title[code]) ? meta.title[code] : enTitle;
    const desc     = (meta && meta.desc  && meta.desc[code])  ? meta.desc[code]  : enDesc;
    const canonUrl = `${BASE_URL}/${code}/${tool}/`;

    let html = rootHtml; // already has full hreflang block

    // a. <html lang/dir>
    html = html.replace(/^<html[^>]*>/m, `<html lang="${htmlLang}" dir="${dir}">`);

    // b. <base href> right after <meta charset="UTF-8">
    html = html.replace(
      '<meta charset="UTF-8">',
      `<meta charset="UTF-8">\n<base href="${BASE_URL}/">`
    );

    // c. <title>
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

    // d. <meta description>
    if (desc) {
      html = html.replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${escapeAttr(desc)}"`
      );
    }

    // e. <link rel="canonical"> → this language variant's URL
    html = html.replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${canonUrl}">`
    );

    // f. og:url → this language variant's URL
    html = html.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${canonUrl}"`
    );

    // g. i18n-lang-en.js pack tag (from the English-default root file) → this variant's language pack
    html = html.replace(/i18n-lang-en\.js/, `i18n-lang-${code}.js`);

    // Write to /lang/tool/index.html
    const outDir = path.join(SITE_DIR, code, tool);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    created++;
  });

  process.stdout.write(`  langs [${LANGS.map(l=>l.code).join(' ')}] created for ${tool}\n`);
});

function escapeHtml(str)  { return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeAttr(str)  { return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }

console.log(`\nDone: ${created} language pages created, ${rootsUpdated} root files updated.`);
