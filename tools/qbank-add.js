// usage: node tools/qbank-add.js <quiz-dir> [--dry]   (reads tools/qbank/<quiz-dir basename>.json)
// bank item: [question, correct, wrong1, wrong2, wrong3, 'medium'|'hard', cat?]  -> appended to QUESTIONS with a deterministic shuffled option order
const fs = require('fs'), path = require('path');
const dir = process.argv[2], dry = process.argv.includes('--dry');
const name = path.basename(dir), f = path.join(dir, 'index.html');
const bank = fs.readdirSync(path.join(__dirname, 'qbank')).filter(x => x === name + '.json' || x.startsWith(name + '.') && x.endsWith('.json')).sort()
  .flatMap(x => JSON.parse(fs.readFileSync(path.join(__dirname, 'qbank', x), 'utf8')));
let h = fs.readFileSync(f, 'utf8');
const qs = h.indexOf('const QUESTIONS = ['), qe = h.indexOf('\n];', qs);
const lines = h.slice(qs, qe).split('\n').filter(l => /^\s*\{q:/.test(l));
const dq = /^\s*\{q:"/.test(lines[0]);
const norm = s => s.replace(/[\u200e\u200f\u064B-\u0652]/g, '').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const unq = s => s.replace(/\\(['"])/g, '$1');
const ex = lines.map(l => {
  const q = unq((l.match(/q:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/) || []).slice(1).find(Boolean) || '');
  const o = [...(((l.match(/opts:\s*\[(.*?)\]\s*,\s*correct/) || [])[1]) || '').matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)].map(m => unq(m[1] ?? m[2]));
  const c = +((l.match(/correct:\s*(\d)/) || [])[1] || 0);
  const nq = norm(q);
  return { q: nq, a: norm(o[c] || ''), t: new Set(nq.split(' ').filter(w => w.length > 2)) };
});
const jac = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i || 1); };
const hash = s => { let x = 2166136261; for (const c of s) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619); } return x >>> 0; };
const sq = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const out = [], bad = [], seen = [];
const need = 400 - lines.length;
for (const it of bank) {
  if (out.length >= need) break;
  const [q, a, w1, w2, w3, d, cat] = it, nq = norm(q), na = norm(a), tk = new Set(nq.split(' ').filter(w => w.length > 2));
  const opts = [a, w1, w2, w3];
  if (opts.some(x => !x) || new Set(opts.map(norm)).size !== 4) { bad.push(['opts', q]); continue; }
  if (!['medium', 'hard'].includes(d)) { bad.push(['diff', q]); continue; }
  const dup = ex.concat(seen).find(e => e.q === nq || (e.a === na && jac(e.t, tk) >= 0.5) || jac(e.t, tk) >= 0.8);
  if (dup) { bad.push(['dup', q]); continue; }
  seen.push({ q: nq, a: na, t: tk });
  const pos = hash(q) % 4, o = [w1, w2, w3]; o.splice(pos, 0, a);
  const Q = /english/.test(name) && !/[\u0600-\u06FF]/.test(q) ? '\u200e' + q + '\u200e' : q;
  out.push(dq
    ? `  {q:${JSON.stringify(Q)},opts:${JSON.stringify(o)},correct:${pos},${cat ? `cat:"${cat}",` : ''}difficulty:"${d}"},`
    : `  {q:${sq(Q)}, opts:[${o.map(sq).join(',')}], correct:${pos},${cat ? ` cat:'${cat}',` : ''} difficulty:'${d}'},`);
}
console.log(name, 'existing', lines.length, 'bank', bank.length, 'ok', out.length, 'rejected', bad.length);
bad.forEach(b => console.log('  REJECT', b[0], b[1].slice(0, 70)));
if (!dry && out.length) {
  h = h.slice(0, qe) + '\n' + out.join('\n') + h.slice(qe);
  fs.writeFileSync(f, h);
  console.log('written, total', lines.length + out.length);
}
