// usage: node tools/qbank-list.js <quiz-dir> [q]  -> compact list of existing correct answers (or question heads with "q") to avoid overlap
const fs = require('fs');
const h = fs.readFileSync(process.argv[2] + '/index.html', 'utf8');
const qs = h.indexOf('const QUESTIONS = ['), qe = h.indexOf('\n];', qs), mode = process.argv[3];
const r = [];
for (const l of h.slice(qs, qe).split('\n')) {
  if (!/^\s*\{q:/.test(l)) continue;
  const q = (l.match(/q:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/) || []).slice(1).find(Boolean) || '';
  const o = [...(((l.match(/opts:\s*\[(.*?)\]\s*,\s*correct/) || [])[1]) || '').matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)].map(m => m[1] ?? m[2]);
  const c = +((l.match(/correct:\s*(\d)/) || [])[1] || 0);
  r.push(mode === 'q' ? q.slice(0, 40) : o[c]);
}
console.log(r.length + ': ' + r.join(' | '));
