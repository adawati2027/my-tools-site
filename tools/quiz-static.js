// usage: node tools/quiz-static.js [quiz.html...]   (default: every */games/*/index.html with a QUESTIONS array)
// Adds/refreshes a crawlable "about this quiz" section (description, question counts per level, how to play,
// sample questions with answers) inside <main>, between <!--quiz-about--> markers. Content comes from the page's
// own meta description and QUESTIONS, so every quiz page gets unique static text (AdSense "replicated/low value" fix).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let files = process.argv.slice(2);
if (!files.length) for (const c of fs.readdirSync(ROOT)) {
  const g = path.join(ROOT, c, 'games');
  if (fs.existsSync(g) && fs.statSync(g).isDirectory()) for (const q of fs.readdirSync(g)) {
    const f = path.join(g, q, 'index.html');
    if (fs.existsSync(f)) files.push(f);
  }
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unq = s => s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
let done = 0;
for (const f of files) {
  let h = fs.readFileSync(f, 'utf8');
  const qs = h.indexOf('const QUESTIONS = [');
  if (qs < 0) continue;
  const qe = h.indexOf('\n];', qs);
  const lines = h.slice(qs, qe).split('\n').filter(l => /^\s*\{q:/.test(l));
  const Q = lines.map(l => {
    const q = unq((l.match(/q:\s*'((?:[^'\\]|\\.)*)'/) || [])[1] || '');
    const opts = [...(((l.match(/opts:\s*\[(.*?)\]\s*,\s*correct/) || [])[1]) || '').matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => unq(m[1]));
    const c = +((l.match(/correct:\s*(\d)/) || [])[1] || 0);
    const d = (l.match(/difficulty:\s*'([a-z]+)'/) || [])[1] || '';
    return { q, a: opts[c] || '', d };
  }).filter(x => x.q && x.a);
  if (Q.length < 10) continue;
  const title = ((h.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1] || '').trim();
  const desc = ((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '').trim();
  const secs = +((h.match(/questionSeconds:\s*(\d+)/) || [])[1] || 15);
  const med = Q.filter(x => x.d === 'medium').length, hard = Q.filter(x => x.d === 'hard').length;
  const step = Math.max(1, Math.floor(Q.length / 8));
  const sample = [];
  for (let i = Math.floor(step / 2); i < Q.length && sample.length < 8; i += step) sample.push(Q[i]);
  const levels = med && hard ? `، موزّعة على مستويين: <b>${med}</b> سؤال متوسط و<b>${hard}</b> سؤال صعب` : '';
  const sec = `<!--quiz-about-->
  <div class="card" style="margin-top:16px;">
    <h2 class="card-title" style="font-size:17px;">ℹ️ عن ${esc(title)}</h2>
    <p style="font-size:14px;color:var(--text-muted);line-height:1.9;margin-top:8px;">${esc(desc)}</p>
    <p style="font-size:14px;color:var(--text-muted);line-height:1.9;">بنك الأسئلة فيه <b>${Q.length}</b> سؤال${levels}. كل جولة بتختار 12 سؤال عشوائي، فكل مرة بتلعب بتطلعلك أسئلة مختلفة.</p>
    <h3 style="font-size:15px;margin-top:14px;">🎮 كيف تلعب؟</h3>
    <ul style="font-size:14px;color:var(--text-muted);line-height:1.9;padding-right:18px;">
      <li>اختار المستوى (متوسط، صعب، أو مشكّل) واضغط ابدأ.</li>
      <li>عندك ${secs} ثانية لكل سؤال — كل ما جاوبت أسرع وصح بتجمع نقاط أكثر.</li>
      <li>بعد كل جواب بتشوف الإجابة الصحيحة، فبتتعلّم حتى لو غلطت.</li>
      <li>بالآخر بتطلعلك نتيجتك، وبتقدر تتحدّى أصحابك بنفس الأسئلة وتشوفوا مين الأول.</li>
    </ul>
    <h3 style="font-size:15px;margin-top:14px;">📝 أمثلة من أسئلة الكويز</h3>
    <ol style="font-size:14px;line-height:1.9;padding-right:22px;">
${sample.map(x => `      <li>${esc(x.q)}<br><span style="color:var(--text-muted);">الجواب: <b>${esc(x.a)}</b></span></li>`).join('\n')}
    </ol>
  </div>
<!--/quiz-about-->`;
  if (h.includes('<!--quiz-about-->')) h = h.replace(/<!--quiz-about-->[\s\S]*?<!--\/quiz-about-->/, () => sec);
  else {
    const i = h.lastIndexOf('</div></main>');
    if (i < 0) { console.log('skip (no </div></main>)', f); continue; }
    h = h.slice(0, i) + sec + '\n' + h.slice(i);
  }
  fs.writeFileSync(f, h);
  done++;
  console.log(path.relative(ROOT, f), Q.length, 'Qs, sample', sample.length);
}
console.log('updated', done);
