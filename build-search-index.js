'use strict';
const fs = require('fs');
const path = require('path');

const SITE_DIR = __dirname;
const BASE = 'https://adawati.space';

const sitemap = fs.readFileSync(path.join(SITE_DIR, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

function urlToFile(url) {
  let p = url.replace(BASE, '').replace(/^\//, '');
  if (p === '' ) return 'index.html';
  if (p.endsWith('/')) return path.join(p, 'index.html');
  return p;
}

const EXCLUDE_PREFIX = ['ar/', 'fr/', 'es/', 'de/', 'ru/', 'jo/games/'];

// URL-pattern-based synonym injection: real pages that are missing an obvious
// English search term in their own title/meta (e.g. omr-to-inr.html never says
// "currency", only "exchange rate") — cheaper and safer than editing every
// page's own SEO metadata just for search-matching purposes.
const SYNONYM_RULES = [
  [/^omr-to-/, 'currency converter exchange rate convert'],
  [/^jo\/calculators\/university-/, 'university jordan'],
  [/^jo\/calculators\/tawjihi-/, 'jordan high school tawjihi'],
  [/^jo\//, 'jordan'],
  [/^om\//, 'oman'],
  [/^ae\//, 'uae dubai'],
  [/^sa\//, 'saudi ksa'],
];

const entries = [];
for (const url of urls) {
  const rel = url.replace(BASE, '').replace(/^\//, '');
  if (EXCLUDE_PREFIX.some(p => rel.startsWith(p))) continue;
  const filePath = path.join(SITE_DIR, urlToFile(url));
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const keywords = (html.match(/<meta name="keywords" content="([^"]*)"/) || [])[1] || '';
  const h1 = (html.match(/<h1[^>]*>([^<]*)</) || [])[1] || '';
  if (!title) continue;
  const cleanTitle = title.replace(/\s*\|\s*Adawati\s*$/, '').trim();
  let searchText = [cleanTitle, h1, keywords, desc].join(' ').toLowerCase();
  for (const [pattern, extra] of SYNONYM_RULES) {
    if (pattern.test(rel)) searchText += ' ' + extra;
  }
  entries.push({ u: url, t: cleanTitle, s: searchText });
}

fs.writeFileSync(path.join(SITE_DIR, 'search-index.json'), JSON.stringify(entries), 'utf8');
console.log(`search-index.json written: ${entries.length} entries (${urls.length - entries.length} skipped/excluded)`);
