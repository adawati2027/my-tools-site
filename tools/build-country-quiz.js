// usage: node tools/build-country-quiz.js config.json
// config: {code:"sa", slug:"saudi-quiz", nameAr:"السعودية", fullAr:"المملكة العربية السعودية", nameEn:"Saudi Arabia", flag:"🇸🇦",
//          iconBg:"#dcfce7", questions:"path/to/q.json" ({easy:[[q,correct,w1,w2,w3]...],medium:[...],hard:[...]}),
//          links:[[url,label],...], levels:false}  (levels:true adds the easy/medium/hard selector; default = random mix)
// Builds <code>/games/<slug>/index.html from jo/games/jordan-quiz/ (correct answer stored at index 0; the engine shuffles).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const c = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const q = JSON.parse(fs.readFileSync(c.questions, 'utf8'));
let h = fs.readFileSync(ROOT + '/jo/games/jordan-quiz/index.html', 'utf8');
const NL = h.includes('\r\n') ? '\r\n' : '\n';
const must = (re, to) => { if (!re.test(h)) throw new Error('not found: ' + re); h = h.replace(re, to); };
const total = q.easy.length + q.medium.length + q.hard.length;
const url = `https://adawati.space/${c.code}/games/${c.slug}/`;
const title = `شو بتعرف عن ${c.fullAr}؟`;

must(/<title>[^<]*<\/title>/, `<title>${title} — تحدي ${total} سؤال | Adawati</title>`);
must(/<meta name="description" content="[^"]*"/, `<meta name="description" content="تحدّى نفسك وأصحابك: ${total} سؤال عن ${c.fullAr} — التاريخ، الجغرافيا، المعالم، الثقافة والرياضة. 12 سؤال عشوائي في كل تحدي."`);
must(/<meta name="keywords" content="[^"]*"/, `<meta name="keywords" content="اسئلة عن ${c.nameAr}, مسابقة عن ${c.nameAr}, كويز ${c.nameAr}, معلومات عن ${c.nameAr}, ${c.nameEn} trivia quiz">`);
h = h.split('https://adawati.space/jo/games/jordan-quiz/').join(url);
must(/hreflang="ar-JO"/, `hreflang="ar-${c.code.toUpperCase()}"`);
h = h.replace(/شو بتعرف عن الأردن؟ \| Adawati/g, `${title} | Adawati`);
h = h.replace(/اختبر معلوماتك عن الأردن بـ12 سؤال ممتع\./g, `تحدّى أصحابك بأسئلة عشوائية من بنك ${total} سؤال عن ${c.fullAr}.`);
h = h.split('og/jo_games_jordan-quiz.jpg').join(`og/${c.code}.jpg`);
must(/<a href="jo\/" class="nav-brand">Adawati 🇯🇴<\/a>/, `<a href="${c.code}/" class="nav-brand">Adawati ${c.flag}</a>`);
h = h.replace(/<a href="jo\/" data-qt="nav_jordan">أدوات الأردن<\/a>/g, `<a href="${c.code}/">أدوات ${c.nameAr}</a>`);
must(/<div class="page-header"><a href="jo\/"/, `<div class="page-header"><a href="${c.code}/"`);
must(/<div class="card-icon" style="background:#fef3c7;">🇯🇴<\/div>/, `<div class="card-icon" style="background:${c.iconBg};">${c.flag}</div>`);
must(/<h1 class="card-title" data-en="How Well Do You Know Jordan\?">شو بتعرف عن الأردن؟<\/h1>/, `<h1 class="card-title" data-en="How Well Do You Know ${c.nameEn}?">${title}</h1>`);
if (c.levels) must(/(<div style="font-size:13px;color:var\(--text-muted\);margin-bottom:8px;" data-qt="challenge_start_subtitle">[^\n]*<\/div>)/,
  '$1' + NL + '      <div style="font-size:13px;font-weight:700;margin-bottom:6px;">اختار المستوى:</div>' + NL + '      <div id="difficultySelectArea" style="display:none;gap:8px;flex-wrap:wrap;margin-bottom:10px;"></div>');

const linkStyle = 'font-size:13px;padding:8px 14px;background:var(--surface-2);color:var(--text);text-decoration:none;border-radius:8px;';
must(/<strong data-qt="other_games">أدوات الأردن الأخرى:<\/strong>/, `<strong>أدوات ${c.nameAr} والكويزات الأخرى:</strong>`);
const endTag = 'data-qt="all_jordan_tools">🇯🇴 كل أدوات الأردن</a>';
const a = h.indexOf('<a href="jo/games/culture-quiz/"'), b = h.indexOf(endTag);
if (a < 0 || b < 0) throw new Error('links block');
h = h.slice(0, a) + c.links.map(([u, t]) => `<a href="${u}" style="${linkStyle}">${t}</a>`).join(NL + '      ') + NL +
  `      <a href="${c.code}/" style="font-size:13px;padding:8px 14px;background:var(--primary);color:#fff;text-decoration:none;border-radius:8px;">${c.flag} كل أدوات ${c.nameAr}</a>` + h.slice(b + endTag.length);

const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const rows = [];
for (const lvl of ['easy', 'medium', 'hard']) for (const [qq, ok, w1, w2, w3] of q[lvl])
  rows.push(`  {q:'${esc(qq)}', opts:['${[ok, w1, w2, w3].map(esc).join("','")}'], correct:0, difficulty:'${lvl}'}`);
const qs = h.indexOf('const QUESTIONS = ['), qe = h.indexOf(NL + '];', qs);
h = h.slice(0, qs) + 'const QUESTIONS = [' + NL + rows.join(',' + NL) + h.slice(qe);

const cs = h.indexOf('const QUIZ_CONFIG = {'), ce = h.indexOf(NL + '};', cs) + NL.length + 2;
const cfg = `const QUIZ_CONFIG = {
  gameId: '${c.slug}',
  questionSeconds: 15,${c.levels ? `
  difficulties: [
    {key:'mix', label:'🎲 مشكّل', labelEn:'🎲 Mixed'},
    {key:'easy', label:'🟢 سهل', labelEn:'🟢 Easy'},
    {key:'medium', label:'🟡 متوسط', labelEn:'🟡 Medium'},
    {key:'hard', label:'🔴 صعب', labelEn:'🔴 Hard'}
  ],` : ''}
  shareTitle: '${title} ${c.flag}',
  challengeText: 'تحداك بكويز عن ${c.nameAr}، جاهز تنافسني؟',
  resultText: function(score, total, pct) {
    return 'حصلت على ' + score + '/' + total + ' (' + pct + '%) بتحدي "${title}" ${c.flag} جرب تتحداني!';
  },
  shareTitleEn: 'How Well Do You Know ${c.nameEn}? ${c.flag}',
  challengeTextEn: 'I challenge you to the ${c.nameEn} quiz — ready to compete?',
  resultTextEn: function(score, total, pct) {
    return 'I scored ' + score + '/' + total + ' (' + pct + '%) on How Well Do You Know ${c.nameEn}? ${c.flag} Try to beat me!';
  },
  resultMessagesEn: [
    {min:90, emoji:'🏆', msg:'A ${c.nameEn} expert! Amazing score.'},
    {min:70, emoji:'${c.flag}', msg:'Your knowledge of ${c.nameEn} is excellent!'},
    {min:50, emoji:'👍', msg:'Not bad, but there\\'s room to improve.'},
    {min:0, emoji:'📚', msg:'Time to learn a bit more about ${c.nameEn}!'}
  ],
  resultMessages: [
    {min:90, emoji:'🏆', msg:'خبير بـ${c.nameAr}! نتيجة رهيبة.'},
    {min:70, emoji:'${c.flag}', msg:'معلوماتك عن ${c.nameAr} ممتازة!'},
    {min:50, emoji:'👍', msg:'مش بطال، بس فيه مجال تتحسن.'},
    {min:0,  emoji:'📚', msg:'وقتها نتعرف أكثر على ${c.nameAr}!'}
  ]
};`.split('\n').join(NL);
h = h.slice(0, cs) + cfg + NL + h.slice(ce);

const outDir = path.join(ROOT, c.code, 'games', c.slug);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), h);
console.log(`written ${c.code}/games/${c.slug}/ — ${rows.length} questions (${q.easy.length}/${q.medium.length}/${q.hard.length}); leftover Jordan refs: ${(h.match(/الأردن|أردني|🇯🇴|jordan/gi) || []).length}`);
