// usage:
//   node tools/quiz-levels.js list <quiz.html>                 → numbered compact list of questions (q | correct answer)
//   node tools/quiz-levels.js apply <quiz.html> <hard-numbers> → tag each {q:...} with difficulty medium/hard
//      <hard-numbers>: comma list with ranges, e.g. "2,5,7-12,40"
// Also adds the medium/hard selector (QUIZ_CONFIG.difficulties + #difficultySelectArea) if missing.
const fs = require('fs');
const [cmd, file, hardArg] = process.argv.slice(2);
let h = fs.readFileSync(file, 'utf8');
const NL = h.includes('\r\n') ? '\r\n' : '\n';
const qs = h.indexOf('const QUESTIONS = ['), qe = h.indexOf(NL + '];', qs);
if (qs < 0 || qe < 0) throw new Error('QUESTIONS array not found');
const lines = h.slice(qs, qe).split(NL);

if (cmd === 'list') {
  let n = 0;
  for (const l of lines) {
    if (!/^\s*\{q:/.test(l)) continue;
    n++;
    const q = (l.match(/q:\s*'((?:[^'\\]|\\.)*)'/) || [])[1] || '';
    const opts = [...((l.match(/opts:\s*\[(.*?)\]\s*,\s*correct/) || [])[1] || '').matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => m[1]);
    const c = +((l.match(/correct:\s*(\d)/) || [])[1] || 0);
    console.log(n + '. ' + q.slice(0, 90) + ' | ' + (opts[c] || '').slice(0, 30));
  }
  process.exit(0);
}

if (cmd === 'apply') {
  const hard = new Set();
  for (const part of String(hardArg || '').split(',').filter(Boolean)) {
    const [a, b] = part.split('-').map(Number);
    for (let i = a; i <= (b || a); i++) hard.add(i);
  }
  let n = 0;
  const out = lines.map(l => {
    if (!/^\s*\{q:/.test(l)) return l;
    n++;
    const lvl = hard.has(n) ? 'hard' : 'medium';
    if (/difficulty:'/.test(l)) return l.replace(/difficulty:'[a-z]+'/, `difficulty:'${lvl}'`);
    return l.replace(/\}(,?)\s*$/, `, difficulty:'${lvl}'}$1`);
  });
  h = h.slice(0, qs) + out.join(NL) + h.slice(qe);
  const ci = h.indexOf('const QUIZ_CONFIG = {');
  if (!/difficulties:/.test(h.slice(ci, ci + 800))) {
    const gi = h.indexOf(NL, h.indexOf('gameId:', ci));
    h = h.slice(0, gi) + NL + "  difficulties: [" + NL + "    {key:'mix', label:'🎲 مشكّل', labelEn:'🎲 Mixed'}," + NL + "    {key:'medium', label:'🟡 متوسط', labelEn:'🟡 Medium'}," + NL + "    {key:'hard', label:'🔴 صعب', labelEn:'🔴 Hard'}" + NL + "  ]," + h.slice(gi);
  }
  if (!h.includes('difficultySelectArea')) {
    const re = /(<div style="font-size:13px;color:var\(--text-muted\);margin-bottom:8px;" data-qt="challenge_start_subtitle[^"]*">[^\n]*<\/div>)/;
    if (!re.test(h)) throw new Error('subtitle anchor not found');
    h = h.replace(re, '$1' + NL + '      <div style="font-size:13px;font-weight:700;margin-bottom:6px;">اختار المستوى:</div>' + NL + '      <div id="difficultySelectArea" style="display:none;gap:8px;flex-wrap:wrap;margin-bottom:10px;"></div>');
  }
  fs.writeFileSync(file, h);
  console.log(`${n} questions: medium ${n - [...hard].filter(i => i <= n).length}, hard ${[...hard].filter(i => i <= n).length}`);
}
