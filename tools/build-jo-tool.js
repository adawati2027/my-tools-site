// Usage: node tools/build-jo-tool.js <slug|all>
// Builds jo/tools/<slug>/index.html from jo/tools/days-to-payday/index.html (shared head/nav/footer/export code) + the spec below,
// and writes an OG card template to tools/og-templates/jo-tools-<slug>.html.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const T = fs.readFileSync(path.join(ROOT, 'jo/tools/days-to-payday/index.html'), 'utf8');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const jstr = s => JSON.stringify(s);

const SPECS = {
  'hourly-wage': {
    icon: '⏱️', bg: '#dcfce7', grad: '#16a34a,#14532d', title: 'كم قيمة ساعة عملك؟', h1: 'كم قيمة ساعة عملك؟ ⏱️',
    sub: 'اكتب راتبك وساعات عملك، وتعرّف على أجر الساعة وكم ساعة تعمل لتشتري ما تريد',
    desc: 'احسب أجر ساعة عملك من راتبك الشهري وساعات الدوام، وتعرّف على عدد ساعات العمل التي يكلّفك أي شيء تريد شراءه.',
    kw: 'أجر الساعة, قيمة ساعة العمل, حساب أجر الساعة من الراتب, كم ساعة عمل يكلفني الشراء',
    search: 'أجر الساعة راتب ساعات العمل قيمة الساعة hourly wage',
    cardDesc: 'أجر الساعة من راتبك، وكم ساعة عمل يكلّفك أي شراء', cat: 'daily',
    warn: 'حساب تقريبي يعتمد على 52 أسبوعاً في السنة. استخدم الراتب الذي يصلك فعلاً (الصافي) لنتيجة أقرب لواقعك.',
    fields: [
      ['sal', 'راتبك الشهري الصافي (دينار)', 'مثال: 600'],
      ['hrs', 'ساعات العمل في الأسبوع', 'مثال: 40'],
      ['price', 'سعر شيء تفكر بشرائه (اختياري)', 'مثال: 150']
    ],
    compute: `
  const s = parseFloat(sal.value), w = parseFloat(hrs.value), p = parseFloat(price.value) || 0;
  if (isNaN(s) || isNaN(w) || s <= 0 || w <= 0 || w > 100) return null;
  const mh = w * 52 / 12, hr = s / mh;
  let ex = hStat(hJ(mh), 'ساعة عمل في الشهر') + hStat(hJ(hr / 60), 'دينار كل دقيقة');
  let e = hJ(s) + ' ÷ (' + hJ(w) + ' × 52 ÷ 12 = ' + hJ(mh) + ' ساعة) = ' + hJ(hr) + ' دينار للساعة.';
  let share = 'قيمة ساعة عملي ' + hJ(hr) + ' دينار';
  if (p > 0) { const ph = p / hr; ex += hStat(hJ(ph), 'ساعة عمل ثمناً لما تريد شراءه'); e += ' ثمن ' + hJ(p) + ' دينار يعادل ' + hJ(ph) + ' ساعة عمل.'; share += '، وشراء بـ ' + hJ(p) + ' دينار يكلّفني ' + hJ(ph) + ' ساعة عمل'; }
  return { main: hJ(hr) + ' دينار للساعة', lbl: 'قيمة ساعة عملك', extra: '<div class="stat-grid">' + ex + '</div>', explain: e, share: share };`,
    how: ['ساعات الشهر = ساعات الأسبوع × 52 ÷ 12.', 'أجر الساعة = الراتب ÷ ساعات الشهر.', 'ساعات الشراء = السعر ÷ أجر الساعة، وتساعدك على الحكم إن كان الشيء يستحق وقتك.', 'استخدم الراتب الصافي بعد الاقتطاعات لنتيجة أدق.'],
    faq: [
      ['كيف أحسب أجر الساعة من الراتب الشهري؟', 'اقسم الراتب على عدد ساعات العمل في الشهر، وهو ساعات الأسبوع × 52 ÷ 12.'],
      ['هل أستخدم الراتب الإجمالي أم الصافي؟', 'الصافي أفضل لأنه ما يصلك فعلاً، لكن الإجمالي مناسب إن أردت المقارنة بعروض أخرى.'],
      ['ماذا عن وقت المواصلات؟', 'لا تحسبه الأداة. أضف ساعات المواصلات إلى ساعات الأسبوع لتعرف الأجر الحقيقي لوقتك.']
    ],
    rel: [['jo/calculators/net-salary/', '💵 صافي الراتب'], ['jo/tools/job-offer-compare/', '⚖️ أي عرض وظيفي أفضل'], ['jo/tools/days-to-payday/', '📅 كم تبقّى على الراتب']]
  },
  'savings-goal': {
    icon: '🎯', bg: '#fef3c7', grad: '#d97706,#78350f', title: 'متى أحقق هدفي الادخاري؟', h1: 'متى أحقق هدفي الادخاري؟ 🎯',
    sub: 'اكتب المبلغ الذي تريد جمعه وما ادخرته وكم توفّر شهرياً، وسنخبرك متى تصل',
    desc: 'احسب كم شهراً تحتاج لتجمع مبلغاً تريده (سيارة، سفر، زواج) وفي أي شهر تصل إليه حسب ما توفّره كل شهر.',
    kw: 'هدف ادخاري, كم أحتاج لأوفر مبلغ, حاسبة التوفير, متى أجمع المبلغ',
    search: 'هدف ادخار توفير جمع مبلغ شهر savings goal',
    cardDesc: 'كم شهراً تحتاج لتجمع المبلغ الذي تريده', cat: 'daily',
    warn: 'حساب بسيط لا يشمل أي أرباح أو فوائد على المبلغ المدّخر، ويفترض أن تدّخر المبلغ نفسه كل شهر.',
    fields: [
      ['goal', 'المبلغ الذي تريد جمعه (دينار)', 'مثال: 5000'],
      ['have', 'ما ادخرته حتى الآن (دينار)', 'مثال: 800'],
      ['mon', 'ما توفّره كل شهر (دينار)', 'مثال: 150']
    ],
    compute: `
  const g = parseFloat(goal.value), h = parseFloat(have.value) || 0, m = parseFloat(mon.value);
  if (isNaN(g) || isNaN(m) || g <= 0 || m <= 0 || h < 0) return null;
  const pct = Math.min(100, h / g * 100);
  if (h >= g) return { main: 'وصلت إلى هدفك', lbl: 'ما ادخرته يغطي المبلغ كاملاً', extra: '<div class="stat-grid">' + hStat(hJ(pct) + '%', 'نسبة التحقق') + '</div>', explain: 'ما ادخرته ' + hJ(h) + ' أكبر من أو يساوي ' + hJ(g) + '.', share: 'وصلت إلى هدفي الادخاري' };
  const left = g - h, n = Math.ceil(left / m);
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + n);
  const M = ['كانون الثاني','شباط','آذار','نيسان','أيار','حزيران','تموز','آب','أيلول','تشرين الأول','تشرين الثاني','كانون الأول'];
  const when = M[d.getMonth()] + ' ' + d.getFullYear();
  const y = Math.floor(n / 12), r = n % 12;
  const mo = function (k) { return k === 1 ? 'شهر' : k === 2 ? 'شهران' : k <= 10 ? k + ' أشهر' : k + ' شهراً'; };
  const yr = function (k) { return k === 1 ? 'سنة' : k === 2 ? 'سنتان' : k <= 10 ? k + ' سنوات' : k + ' سنة'; };
  const span = (y ? yr(y) : '') + (y && r ? ' و' : '') + (r ? mo(r) : '');
  return { main: mo(n), lbl: 'المدة المتوقعة لتصل إلى هدفك',
    extra: '<div class="stat-grid">' + hStat(when, 'الوصول المتوقع') + hStat(hJ(left), 'المتبقي (دينار)') + hStat(hJ(pct) + '%', 'نسبة التحقق') + '</div>' + (y ? '<div style="margin-top:8px;font-size:13px;">أي ما يعادل ' + span + '.</div>' : ''),
    explain: '(' + hJ(g) + ' − ' + hJ(h) + ') ÷ ' + hJ(m) + ' = ' + hJ(left / m) + '، نقرّبها إلى ' + mo(n) + '.',
    share: 'سأصل إلى هدفي الادخاري (' + hJ(g) + ' دينار) بعد ' + mo(n) };`,
    how: ['المتبقي = الهدف − ما ادخرته.', 'عدد الأشهر = المتبقي ÷ ما توفّره شهرياً، ويُقرَّب لأعلى.', 'لا نحسب أي أرباح، فإن وضعت المال في وعاء له عائد ستصل أسرع قليلاً.', 'جرّب رفع المبلغ الشهري لتعرف كم شهراً تختصر.'],
    faq: [
      ['هل تحسب الأداة الفوائد أو الأرباح؟', 'لا، الحساب بسيط ويعتمد على المبلغ المدّخر فقط.'],
      ['ماذا لو تغيّر ما أوفّره كل شهر؟', 'استخدم متوسط ما توفّره، وأعد الحساب كلما تغيّر الرقم.'],
      ['كيف أعرف كم يجب أن أوفّر شهرياً لهدف في وقت محدد؟', 'اقسم المتبقي من الهدف على عدد الأشهر التي تريدها.']
    ],
    rel: [['jo/tools/budget-split/', '🧮 توزيع الراتب'], ['jo/tools/days-to-payday/', '📅 كم تبقّى على الراتب'], ['compound-interest.html', '📈 الفائدة المركبة']]
  },
  'budget-split': {
    icon: '🧮', bg: '#ede9fe', grad: '#7c3aed,#3b0764', title: 'كيف أوزّع راتبي؟', h1: 'كيف أوزّع راتبي؟ 🧮',
    sub: 'وزّع راتبك بين الاحتياجات والرغبات والادخار حسب قاعدة 50/30/20 أو بنسب تختارها',
    desc: 'وزّع راتبك الشهري بين الاحتياجات والرغبات والادخار بقاعدة 50/30/20 الشهيرة، أو غيّر النسب كما يناسب ظروفك.',
    kw: 'توزيع الراتب, قاعدة 50/30/20, ميزانية شهرية, كيف أقسم راتبي',
    search: 'توزيع الراتب ميزانية 50 30 20 ادخار budget',
    cardDesc: 'قاعدة 50/30/20: احتياجات ورغبات وادخار', cat: 'daily',
    warn: 'القاعدة 50/30/20 إرشاد عام وليست نصيحة مالية شخصية. عدّل النسب بما يناسب التزاماتك.',
    fields: [
      ['sal', 'راتبك الشهري (دينار)', 'مثال: 700'],
      ['pn', 'نسبة الاحتياجات %', '50'],
      ['pw', 'نسبة الرغبات %', '30'],
      ['ps', 'نسبة الادخار %', '20']
    ],
    compute: `
  const s = parseFloat(sal.value);
  const a = pn.value === '' ? 50 : parseFloat(pn.value), b = pw.value === '' ? 30 : parseFloat(pw.value), c = ps.value === '' ? 20 : parseFloat(ps.value);
  if (isNaN(s) || s <= 0 || isNaN(a) || isNaN(b) || isNaN(c) || a < 0 || b < 0 || c < 0) return null;
  if (Math.abs(a + b + c - 100) > 0.01) return { err: 'مجموع النسب يجب أن يساوي 100، والآن مجموعها ' + hJ(a + b + c) + '.' };
  const x = s * a / 100, y = s * b / 100, z = s * c / 100;
  return { main: hJ(z) + ' دينار للادخار', lbl: 'الجزء الذي تدّخره من راتبك كل شهر',
    extra: '<div class="stat-grid">' + hStat(hJ(x), 'احتياجات (' + a + '%)') + hStat(hJ(y), 'رغبات (' + b + '%)') + hStat(hJ(z), 'ادخار (' + c + '%)') + '</div><div style="margin-top:8px;font-size:13px;">الادخار في السنة: ' + hJ(z * 12) + ' دينار.</div>',
    explain: hJ(s) + ' × ' + a + '% = ' + hJ(x) + ' احتياجات، × ' + b + '% = ' + hJ(y) + ' رغبات، × ' + c + '% = ' + hJ(z) + ' ادخار.',
    share: 'توزيع راتبي: احتياجات ' + hJ(x) + '، رغبات ' + hJ(y) + '، ادخار ' + hJ(z) + ' دينار' };`,
    how: ['الاحتياجات: إيجار وفواتير وطعام ومواصلات وأقساط.', 'الرغبات: مطاعم وترفيه وتسوّق وسفر.', 'الادخار: ادخار وسداد ديون إضافية.', 'القاعدة الأصلية 50/30/20، ويمكنك تغييرها، مثلاً 60/20/20 إن كانت التزاماتك كبيرة.'],
    faq: [
      ['ما هي قاعدة 50/30/20؟', 'إرشاد بسيط يقترح أن يذهب 50% من الدخل للاحتياجات و30% للرغبات و20% للادخار.'],
      ['ماذا لو كانت احتياجاتي أكثر من 50%؟', 'غيّر النسب، أو قلّل الرغبات أولاً، وحاول أن تبقي جزءاً ولو صغيراً للادخار.'],
      ['هل هذه نصيحة مالية؟', 'لا، هي أداة حسابية بسيطة، والقرار يعود لظروفك.']
    ],
    rel: [['jo/tools/savings-goal/', '🎯 هدفي الادخاري'], ['jo/tools/days-to-payday/', '📅 كم تبقّى على الراتب'], ['jo/calculators/net-salary/', '💵 صافي الراتب']]
  }
};

const POMO = {
  slug: 'pomodoro-timer', icon: '🍅', bg: '#fee2e2', grad: '#dc2626,#7f1d1d', title: 'مؤقّت بومودورو للدراسة والعمل', h1: 'مؤقّت بومودورو 🍅',
  sub: '25 دقيقة تركيز ثم استراحة قصيرة، لدراسة وعمل أكثر إنتاجية',
  desc: 'مؤقّت بومودورو مجاني: 25 دقيقة تركيز و5 دقائق راحة و15 دقيقة راحة طويلة، مع تنبيه صوتي. مناسب للدراسة والعمل.',
  kw: 'مؤقت بومودورو, تقنية بومودورو, مؤقت دراسة, تنظيم الوقت',
  search: 'بومودورو مؤقت دراسة تركيز pomodoro timer',
  cardDesc: '25 دقيقة تركيز ثم استراحة، للدراسة والعمل', cat: 'daily',
  faq: [
    ['ما هي تقنية بومودورو؟', 'تقسّم وقتك إلى فترات تركيز مدتها 25 دقيقة تتخللها استراحات قصيرة، وبعد أربع فترات تأخذ استراحة أطول.'],
    ['هل أستطيع تغيير المدة؟', 'نعم، اكتب عدد الدقائق الذي تريده لكل نوع في الحقول الظاهرة.'],
    ['هل يعمل المؤقّت والصفحة في الخلفية؟', 'نعم في أغلب المتصفحات، لكن قد يتباطأ على بعض الهواتف عند قفل الشاشة، فأبقِ الصفحة مفتوحة.']
  ],
  how: ['اختر مهمة واحدة وابدأ فترة التركيز.', 'لا تفتح هاتفك حتى ينتهي المؤقّت.', 'بعد انتهائها استرح 5 دقائق.', 'بعد أربع فترات خذ استراحة طويلة 15 دقيقة.'],
  rel: [['jo/tools/hourly-wage/', '⏱️ قيمة ساعة عملك'], ['jo/students/credit-hours-planner/', '📚 مخطط الساعات'], ['stopwatch.html', '⏲️ ساعة إيقاف']]
};

function head(s, slug) {
  const url = `https://adawati.space/jo/tools/${slug}/`;
  const img = `https://adawati.space/og/jo_tools_${slug}.png`;
  const faqLd = s.faq.map(([q, a]) => `  {"@type":"Question","name":${jstr(q)},"acceptedAnswer":{"@type":"Answer","text":${jstr(a)}}}`).join(',\n');
  const ld = `<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Adawati","item":"https://adawati.space/"},
  {"@type":"ListItem","position":2,"name":"أدوات الأردن","item":"https://adawati.space/jo/"},
  {"@type":"ListItem","position":3,"name":${jstr(s.title)},"item":${jstr(url)}}
]},
{"@type":"WebApplication","name":${jstr(s.title)},"url":${jstr(url)},"description":${jstr(s.desc)},"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"JOD"}},
{"@type":"FAQPage","mainEntity":[
${faqLd}
]}
]}
</script>`;
  const meta = `<title>${esc(s.title)} | Adawati</title>
<meta name="description" content="${esc(s.desc)}">
<meta name="keywords" content="${esc(s.kw)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="x-default" href="https://adawati.space/">
<link rel="alternate" hreflang="ar" href="${url}">
<link rel="alternate" hreflang="ar-JO" href="${url}">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">
<meta name="twitter:title" content="${esc(s.title)}">
<meta name="twitter:description" content="${esc(s.desc)}">
${ld}
<link rel="stylesheet" href="../../../style.css?v=4">
</head>`;
  return T.slice(0, T.indexOf('<title>')) + meta + '\n' + T.slice(T.indexOf('<body>'), T.indexOf('<main>'));
}

function lower(s) {
  const how = s.how.map(x => `      <li>${x}</li>`).join('\n');
  const faq = s.faq.map(([q, a]) => `    <details style="margin-top:10px;">
      <summary style="font-weight:700;cursor:pointer;font-size:14px;">${q}</summary>
      <p style="margin-top:8px;font-size:14px;color:var(--text-muted);line-height:1.7;">${a}</p>
    </details>`).join('\n');
  const rel = s.rel.map(([h, t]) => `      <a href="${h}" style="font-size:13px;padding:8px 14px;background:var(--surface-2);color:var(--text);text-decoration:none;border-radius:8px;">${t}</a>`).join('\n');
  return `
  <div class="card" style="margin-top:16px;">
    <h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">💡 كيف نحسب؟</h2>
    <ul style="font-size:14px;color:var(--text-muted);line-height:1.9;padding-inline-start:20px;">
${how}
    </ul>
  </div>

  <div class="card" style="margin-top:16px;">
    <div class="card-title" style="font-size:15px;">❓ أسئلة شائعة</div>
${faq}
  </div>

  <div style="margin-top:16px;text-align:center;">
    <strong>أدوات أخرى قد تفيدك:</strong>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:8px;">
${rel}
      <a href="jo/" style="font-size:13px;padding:8px 14px;background:var(--primary);color:#fff;text-decoration:none;border-radius:8px;">🇯🇴 كل أدوات الأردن</a>
    </div>
  </div>

`;
}

const footer = T.slice(T.indexOf('</main>'), T.indexOf('<script>\nlet hLast'));
const common = T.slice(T.indexOf('<script>\nlet hLast') + 9, T.indexOf('\n\nfunction hInit'));
const tail = T.slice(T.indexOf('<script src="i18n-lang-ar.js'));

function card(s, slug) {
  const fs_ = s.fields.map(([id, l, ph]) => `<div><label>${l}</label><input type="text" data-num inputmode="decimal" id="${id}" min="0" step="any" placeholder="${ph}"></div>`);
  const rows = [];
  for (let i = 0; i < fs_.length; i += 2) rows.push(`    <div class="row">\n      ${fs_.slice(i, i + 2).join('\n      ')}\n    </div>`);
  const cs = T.indexOf('<div class="card">'), ce = T.indexOf('<div class="row">');
  const resStart = T.indexOf('<div id="hErr"'), resEnd = T.indexOf('  <div class="card" style="margin-top:16px;">');
  const results = T.slice(resStart, resEnd).replace(/\n\s*$/, '\n');
  return `<main><div class="tool-page">
  <div class="page-header"><a href="jo/">→ العودة لأدوات الأردن</a></div>

  <div class="card">
    <div class="card-icon" style="background:${s.bg};">${s.icon}</div>
    <h1 class="card-title">${s.h1}</h1>
    <div class="card-subtitle">${s.sub}</div>
    <div class="divider"></div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:var(--radius-sm);padding:10px 14px;font-size:13px;color:#92400e;line-height:1.7;margin-bottom:14px;">
      ⚠️ ${s.warn}
    </div>

${rows.join('\n')}

    ${results}`;
}

function build(slug) {
  const s = SPECS[slug];
  const html = head(s, slug) + card(s, slug) + lower(s) + '</div></main>\n\n' + footer.replace(/^<\/main>\s*/, '') +
    '<script>' + common + '\n\nfunction hInit() {}\nfunction hJ(n) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }\n\nfunction hCompute() {' + s.compute + '\n}\n</script>\n' + tail;
  out(slug, s, html);
}

function out(slug, s, html) {
  const dir = path.join(ROOT, 'jo/tools', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  const og = `<!doctype html><html dir=rtl><head><meta charset=utf-8><link rel=stylesheet href='https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&display=swap'><style>html,body{margin:0;width:1200px;height:630px;overflow:hidden}body{background:radial-gradient(circle at 30% 20%,${s.grad.split(',')[0]},${s.grad.split(',')[1]} 70%);font-family:Cairo,sans-serif;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative}.frame{position:absolute;inset:26px;border:3px solid #fbbf24;border-radius:28px}.e{font-size:120px;line-height:1}.t{font-size:80px;font-weight:800;margin:10px 40px 0}.s{font-size:36px;font-weight:600;opacity:.92;margin-top:6px;padding:0 60px}.b{position:absolute;bottom:52px;font-size:30px;font-weight:800;color:#fbbf24;letter-spacing:1px}</style></head><body><div class=frame></div><div class=e>${s.icon}</div><div class=t>${s.title}</div><div class=s>${s.cardDesc}</div><div class=b>⚡ أدواتي · adawati.space</div></body></html>`;
  fs.writeFileSync(path.join(ROOT, 'tools/og-templates', `jo-tools-${slug}.html`), og);
  console.log('built', slug, html.length);
}

function buildPomo() {
  const s = POMO, slug = s.slug;
  const inputs = [['pf', 'تركيز', 25], ['ps', 'راحة قصيرة', 5], ['pl', 'راحة طويلة', 15]].map(([id, l, v]) =>
    `<div><label>${l} (دقيقة)</label><input type="text" data-num inputmode="decimal" id="${id}" value="${v}"></div>`).join('\n      ');
  const mainHtml = `<main><div class="tool-page">
  <div class="page-header"><a href="jo/">→ العودة لأدوات الأردن</a></div>

  <div class="card">
    <div class="card-icon" style="background:${s.bg};">${s.icon}</div>
    <h1 class="card-title">${s.h1}</h1>
    <div class="card-subtitle">${s.sub}</div>
    <div class="divider"></div>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;" id="pModes">
      <button type="button" class="option-btn active" data-m="f">تركيز</button>
      <button type="button" class="option-btn" data-m="s">راحة قصيرة</button>
      <button type="button" class="option-btn" data-m="l">راحة طويلة</button>
    </div>
    <div style="text-align:center;margin:22px 0 6px;">
      <div id="pTime" style="font-size:72px;font-weight:800;font-variant-numeric:tabular-nums;line-height:1;direction:ltr;">25:00</div>
      <div id="pLbl" style="font-size:14px;color:var(--text-muted);margin-top:8px;">جاهز للبدء</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px;">
      <button type="button" id="pStart" style="flex:2;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:16px;cursor:pointer;">▶ ابدأ</button>
      <button type="button" id="pReset" style="flex:1;padding:13px;border:1px solid var(--border);border-radius:12px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;cursor:pointer;">↺ إعادة</button>
    </div>
    <div style="text-align:center;margin-top:14px;font-size:14px;">🍅 فترات التركيز المنجزة اليوم: <strong id="pCount">0</strong></div>
    <details style="margin-top:14px;">
      <summary style="font-weight:700;cursor:pointer;font-size:14px;">⚙️ تغيير المدد</summary>
      <div class="row" style="margin-top:10px;">
      ${inputs}
      </div>
    </details>
  </div>
`;
  const script = `<script>
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var mode = 'f', left = 25 * 60, timer = null, endAt = 0, count = 0, lastKey = 'adawati_pomo_' + new Date().toISOString().slice(0, 10);
  try { count = parseInt(localStorage.getItem(lastKey)) || 0; } catch (e) {}
  $('pCount').textContent = count;
  function mins(m) { var v = parseFloat($({ f: 'pf', s: 'ps', l: 'pl' }[m]).value); return v > 0 && v <= 180 ? v : { f: 25, s: 5, l: 15 }[m]; }
  function show() { var m = Math.floor(left / 60), s = left % 60; var t = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; $('pTime').textContent = t; document.title = (timer ? t + ' · ' : '') + 'مؤقّت بومودورو | Adawati'; }
  function setMode(m) { stop(); mode = m; left = Math.round(mins(m) * 60); document.querySelectorAll('#pModes .option-btn').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-m') === m); }); $('pLbl').textContent = 'جاهز للبدء'; $('pStart').textContent = '▶ ابدأ'; show(); }
  function beep() { try { var C = window.AudioContext || window.webkitAudioContext, c = new C(), t = c.currentTime; [0, 0.25, 0.5].forEach(function (d) { var o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; o.connect(g); g.connect(c.destination); g.gain.setValueAtTime(0.2, t + d); g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.2); o.start(t + d); o.stop(t + d + 0.2); }); } catch (e) {} }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function tick() {
    left = Math.max(0, Math.round((endAt - Date.now()) / 1000)); show();
    if (left === 0) {
      stop(); beep(); $('pStart').textContent = '▶ ابدأ';
      if (mode === 'f') { count++; $('pCount').textContent = count; try { localStorage.setItem(lastKey, count); } catch (e) {} $('pLbl').textContent = 'أحسنت! خذ استراحة'; setMode(count % 4 === 0 ? 'l' : 's'); $('pLbl').textContent = 'أحسنت! خذ استراحة'; }
      else { setMode('f'); $('pLbl').textContent = 'انتهت الراحة، هيّا للتركيز'; }
    }
  }
  $('pStart').addEventListener('click', function () {
    if (timer) { stop(); $('pStart').textContent = '▶ متابعة'; $('pLbl').textContent = 'متوقّف مؤقتاً'; show(); return; }
    endAt = Date.now() + left * 1000; timer = setInterval(tick, 250); $('pStart').textContent = '⏸ إيقاف'; $('pLbl').textContent = mode === 'f' ? 'ركّز على مهمتك' : 'استرح قليلاً'; show();
  });
  $('pReset').addEventListener('click', function () { setMode(mode); });
  document.querySelectorAll('#pModes .option-btn').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-m')); }); });
  ['pf', 'ps', 'pl'].forEach(function (i) { $(i).addEventListener('change', function () { if (!timer) setMode(mode); }); });
  show();
})();
</script>
`;
  const html = head(s, slug) + mainHtml + lower(s) + '</div></main>\n\n' + footer.replace(/^<\/main>\s*/, '') + script + tail;
  out(slug, s, html);
}

const arg = process.argv[2] || 'all';
if (arg === 'all') { Object.keys(SPECS).forEach(build); buildPomo(); }
else if (arg === 'pomodoro-timer') buildPomo();
else build(arg);
