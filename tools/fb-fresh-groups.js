#!/usr/bin/env node
// Lists FB groups from the joined-groups candidate files that haven't been used yet
// in the comment campaign logs, so a batch can be planned without live-searching/
// visiting groups just to discover they're already used (saves tokens + FB API calls).
//
// Usage: node tools/fb-fresh-groups.js [count]

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const CANDIDATE_FILES = [
  'docs/history/joined-university-groups.md',
  'docs/history/joined-groups-by-category.md',
];

const USED_FILES = [
  'docs/history/social-groups-campaign.md',
  'comment.md',
];

// Known-bad groups to always exclude (stuck comment-box glitch, rules banning links, etc.)
const SKIP_LIST = [
  'تجمع طلاب جامعة البلقاء التطبيقية',
  'كلية الإعلام - جامعة جدارا',
  'كلية الاعمال - جامعة جدارا',
  'TTU Pulse',
  'جامعة العلوم التطبيقية',
  'سنافر جامعة الطفيلة التقنية 2026',
  'طلاب جامعة آل البيت',
];

const EMOJI_MAIN = /[\u{1F000}-\u{1FFFF}]/gu; // emoji incl. flags (regional indicators)
const EMOJI_MISC = /[\u{2600}-\u{27BF}]/gu; // misc symbols & dingbats
const VARIATION_ZWJ_MOJIBAKE = /[️‍�]/g;
const PUNCT = /[()[\]{}|~*_#"'.,!؟?؛:«»“”\-–—]/g;
const ARABIC_DIACRITICS = /[ً-ٟؐ-ؚۖ-ۭ]/g;
// Visually-identical Arabic letter variants that commonly differ by codepoint
// depending on keyboard/source (e.g. يرقى vs ارقۍ) — fold to one canonical form
// so near-duplicate group names still match.
const ARABIC_LETTER_VARIANTS = [
  [/[أإآا]/g, 'ا'],
  [/[ۍئ]/g, 'ي'],
  [/ى/g, 'ي'],
  [/ؤ/g, 'و'],
  [/ة/g, 'ه'],
];

function normalize(name) {
  let s = name
    .replace(ARABIC_DIACRITICS, '')
    .replace(EMOJI_MAIN, '')
    .replace(EMOJI_MISC, '')
    .replace(VARIATION_ZWJ_MOJIBAKE, '')
    .replace(PUNCT, ' ');
  for (const [re, rep] of ARABIC_LETTER_VARIANTS) s = s.replace(re, rep);
  return s
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function read(relPath) {
  const p = path.join(ROOT, relPath);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function extractCandidates(text) {
  const names = [];
  for (const line of text.split('\n')) {
    if (!line.startsWith('- ')) continue;
    const idx = line.lastIndexOf(' — ');
    if (idx === -1) continue;
    const name = line.slice(2, idx).trim();
    if (name) names.push(name);
  }
  return names;
}

function extractUsed(text) {
  const ids = new Set();
  const idRe = /facebook\.com\/groups\/([A-Za-z0-9_.]+)/g;
  let m;
  while ((m = idRe.exec(text))) ids.add(m[1]);

  const names = new Set();
  const boldRe = /\*\*(.+?)\*\*/g;
  while ((m = boldRe.exec(text))) names.add(normalize(m[1]));
  const quoteRe = /"([^"]{3,80})"/g;
  while ((m = quoteRe.exec(text))) names.add(normalize(m[1]));

  // Fallback: any whole line mentioning a groups/ URL — used as a substring-search
  // blob below, to catch group names written as plain text (no bold/quotes) in
  // older log entries, regardless of exact formatting.
  const usedLines = [];
  for (const line of text.split('\n')) {
    if (/facebook\.com\/groups\//.test(line)) usedLines.push(normalize(line));
  }

  return { ids, names, usedLines };
}

function main() {
  const count = parseInt(process.argv[2], 10) || 8;

  let candidateNames = [];
  for (const f of CANDIDATE_FILES) candidateNames.push(...extractCandidates(read(f)));

  const seen = new Set();
  candidateNames = candidateNames.filter((n) => {
    const key = normalize(n);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const usedIds = new Set();
  const usedNames = new Set();
  const usedLines = [];
  for (const f of USED_FILES) {
    const { ids, names, usedLines: lines } = extractUsed(read(f));
    ids.forEach((id) => usedIds.add(id));
    names.forEach((n) => usedNames.add(n));
    usedLines.push(...lines);
  }

  const skipNorm = SKIP_LIST.map(normalize);

  const fresh = candidateNames.filter((name) => {
    const norm = normalize(name);
    if (norm.length < 4) return true; // too short to match reliably, let it through
    if (usedNames.has(norm)) return false;
    for (const s of skipNorm) {
      if (norm.includes(s) || s.includes(norm)) return false;
    }
    for (const line of usedLines) {
      if (line.includes(norm)) return false;
    }
    return true;
  });

  console.log(`Fresh candidates: ${fresh.length} / ${candidateNames.length} total (showing ${count})\n`);
  fresh.slice(0, count).forEach((n, i) => console.log(`${i + 1}. ${n}`));
  console.log(`\n(tracked: ${usedIds.size} used group IDs, ${usedNames.size} used names)`);
}

main();
