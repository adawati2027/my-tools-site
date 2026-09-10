'use strict';
const fs = require('fs');
const path = require('path');

const BASE = 'https://adawati.space';
const TODAY = new Date().toISOString().slice(0, 10);

const TOOLS = [
  'age-calculator','bmi-calculator','compound-interest','currency-converter',
  'date-diff','diet-plan','discount-calculator','end-of-service',
  'file-converter','hijri-converter','image-compressor','loan-calculator',
  'password-generator','percentage-calculator','qr-generator','random-number',
  'salary-calculator','stopwatch','timezone-converter','tip-calculator',
  'unit-converter','vat-calculator','word-counter',
  'kids-learn','memory-game','number-guess','quick-math','reaction-test',
  'car-game','jump-game'
];

const LANGS = ['ar','fr','es','de','ru'];

const EXTRA = {
  'salary-calculator':     [{ hl:'ar-OM', href:`${BASE}/om/salary-calculator/` }],
  'vat-calculator':        [{ hl:'en-AE', href:`${BASE}/ae/vat-calculator/` }, { hl:'ar-SA', href:`${BASE}/sa/vat-calculator/` }],
  'tip-calculator':        [{ hl:'en-US', href:`${BASE}/us/tip-calculator/` }],
  'percentage-calculator': [{ hl:'en-GB', href:`${BASE}/uk/percentage-calculator/` }],
};

function urlEntry(loc, priority, changefreq) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const entries = [];

// Homepage
entries.push(urlEntry(`${BASE}/`, '1.0', 'weekly'));

// Country pages
for (const code of ['om','ae','sa','us','uk','jo']) {
  entries.push(urlEntry(`${BASE}/${code}/`, '0.8', 'weekly'));
}

// Country-specific tool pages
const countryTools = [
  `${BASE}/om/salary-calculator/`,
  `${BASE}/ae/vat-calculator/`,
  `${BASE}/sa/vat-calculator/`,
  `${BASE}/us/tip-calculator/`,
  `${BASE}/uk/percentage-calculator/`,
  `${BASE}/jo/calculators/university-gpa/`,
  `${BASE}/jo/calculators/tawjihi-average/`,
  `${BASE}/jo/calculators/package-customs/`,
  `${BASE}/jo/emergency-numbers/`,
  `${BASE}/jo/prayer-times/`,
  `${BASE}/jo/weather/`,
  `${BASE}/jo/fuel-prices/`,
  `${BASE}/jo/holidays/`,
  `${BASE}/jo/calculators/social-security/`,
  `${BASE}/jo/calculators/income-tax/`,
  `${BASE}/jo/calculators/car-cost/`,
  `${BASE}/jo/calculators/university-cost/`,
  `${BASE}/jo/tools/government-vs-private/`,
  `${BASE}/jo/tools/jordan-vs-gulf/`,
  `${BASE}/jo/calculators/rent-vs-buy/`,
  `${BASE}/jo/calculators/zakat/`,
  `${BASE}/jo/calculators/wedding-cost/`,
  `${BASE}/jo/games/jordan-quiz/`,
  `${BASE}/jo/games/world-sports-quiz/`,
  `${BASE}/jo/games/world-football-quiz/`,
  `${BASE}/jo/games/songs-quiz/`,
  `${BASE}/jo/games/cooking-quiz/`,
  `${BASE}/jo/games/makeup-quiz/`,
  `${BASE}/jo/games/math-quiz/`,
  `${BASE}/jo/games/general-quiz/`,
  `${BASE}/jo/games/geography-quiz/`,
  `${BASE}/jo/games/islamic-history-quiz/`,
  `${BASE}/jo/games/science-quiz/`,
  `${BASE}/jo/games/inventions-quiz/`,
  `${BASE}/jo/games/animals-quiz/`,
  `${BASE}/jo/games/culture-quiz/`,
  `${BASE}/jo/games/logo-quiz/`,
  `${BASE}/jo/games/wordle/`,
  `${BASE}/jo/gold-price/`,
  `${BASE}/jo/students/scholarships-loans/`,
  `${BASE}/jo/students/best-tools/`,
  `${BASE}/om/gold-price/`,
  `${BASE}/om/weather/`,
  `${BASE}/om/prayer-times/`,
  `${BASE}/sa/gold-price/`,
  `${BASE}/sa/weather/`,
  `${BASE}/sa/prayer-times/`,
  `${BASE}/ae/gold-price/`,
  `${BASE}/ae/weather/`,
  `${BASE}/ae/prayer-times/`,
  `${BASE}/us/gold-price/`,
  `${BASE}/us/weather/`,
  `${BASE}/us/prayer-times/`,
  `${BASE}/uk/gold-price/`,
  `${BASE}/uk/weather/`,
  `${BASE}/uk/prayer-times/`,
];

// 5-module expansion to all 6 countries (holidays, fuel-prices, car-cost,
// wedding-cost, university-cost) — built 2026-09-10, previously jo/om-only.
for (const code of ['om','sa','ae','us','uk']) {
  countryTools.push(
    `${BASE}/${code}/holidays/`,
    `${BASE}/${code}/fuel-prices/`,
    `${BASE}/${code}/calculators/car-cost/`,
    `${BASE}/${code}/calculators/wedding-cost/`,
    `${BASE}/${code}/calculators/university-cost/`,
  );
}
for (const url of countryTools) {
  entries.push(urlEntry(url, '0.7', 'monthly'));
}

// Static pages
for (const page of ['about.html','contact.html']) {
  entries.push(urlEntry(`${BASE}/${page}`, '0.4', 'yearly'));
}

// Root tool pages (English)
for (const tool of TOOLS) {
  entries.push(urlEntry(`${BASE}/${tool}.html`, '0.9', 'monthly'));
}

// Language variant pages
for (const lang of LANGS) {
  for (const tool of TOOLS) {
    entries.push(urlEntry(`${BASE}/${lang}/${tool}/`, '0.7', 'monthly'));
  }
}

// Root-only English pages with no lang variants (not in TOOLS on purpose —
// adding them there would generate {lang}/{tool}/ sitemap entries for pages
// that don't actually exist). Found missing entirely from the sitemap via
// an audit 2026-09-10 — these are all real, substantial pages that simply
// fell through the cracks of the TOOLS list.
const KIDS_ROOT_ONLY = [
  'kids-alphabet','kids-clock','kids-flags','kids-math','kids-money',
  'kids-science','kids-spelling','kids-times-tables','kids-typing',
];
for (const tool of KIDS_ROOT_ONLY) {
  entries.push(urlEntry(`${BASE}/${tool}.html`, '0.7', 'monthly'));
}

const OMAN_GUIDES = [
  'oman-cost-of-living','oman-labour-law-guide','oman-loan-guide',
  'oman-minimum-wage','oman-salary-guide','oman-salary-slip-guide',
  'oman-tax-guide','oman-vat-guide','oman-visa-guide','oman-working-hours-guide',
];
for (const page of OMAN_GUIDES) {
  entries.push(urlEntry(`${BASE}/${page}.html`, '0.6', 'monthly'));
}

const OMR_CONVERTERS = ['omr-to-bdt','omr-to-egp','omr-to-inr','omr-to-php','omr-to-pkr'];
for (const page of OMR_CONVERTERS) {
  entries.push(urlEntry(`${BASE}/${page}.html`, '0.7', 'weekly'));
}

for (const page of ['privacy.html','terms.html']) {
  entries.push(urlEntry(`${BASE}/${page}`, '0.3', 'yearly'));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
console.log(`Sitemap written: ${entries.length} URL entries`);
