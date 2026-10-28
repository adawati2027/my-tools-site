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
  },
  'reading-goal': {
    icon: '📖', bg: '#e0f2fe', grad: '#0284c7,#0c4a6e', title: 'كم صفحة أقرأ كل يوم؟', h1: 'كم صفحة أقرأ كل يوم؟ 📖',
    sub: 'اكتب عدد صفحات الكتاب وكم يوماً تريد لإنهائه، وسنحسب ورد القراءة اليومي',
    desc: 'احسب كم صفحة تقرأ كل يوم لتنهي كتابك في المدة التي تريدها، وكم دقيقة تحتاج يومياً حسب سرعة قراءتك.',
    kw: 'خطة القراءة, كم صفحة في اليوم, إنهاء كتاب, تحدي القراءة, ورد القراءة',
    search: 'خطة قراءة كتاب صفحات يوم تحدي القراءة reading goal',
    cardDesc: 'كم صفحة تقرأ يومياً لتنهي كتابك في الوقت الذي تريده', cat: 'daily',
    warn: 'الحساب تقريبي، وسرعة القراءة تختلف من كتاب لآخر ومن يوم لآخر.',
    fields: [
      ['pg', 'عدد صفحات الكتاب', 'مثال: 320'],
      ['dn', 'ما قرأته حتى الآن (صفحة)', 'مثال: 40'],
      ['dy', 'كم يوماً تريد لإنهائه؟', 'مثال: 20'],
      ['sp', 'سرعتك: صفحات في الساعة (اختياري)', 'مثال: 30']
    ],
    compute: `
  const p = parseFloat(pg.value), d = parseFloat(dn.value) || 0, y = parseInt(dy.value), s = parseFloat(sp.value) || 0;
  if (isNaN(p) || isNaN(y) || p <= 0 || y < 1 || d < 0 || s < 0) return null;
  if (d >= p) return { main: 'أنهيت الكتاب', lbl: 'ما قرأته يساوي صفحات الكتاب أو يزيد', extra: '', explain: 'قرأت ' + hJ(d) + ' من ' + hJ(p) + ' صفحة.', share: 'أنهيت كتابي' };
  const left = p - d, per = Math.ceil(left / y);
  let ex = hStat(String(Math.round(left)), 'صفحة متبقية') + hStat(String(y), 'يوماً') + hStat(Math.round(d / p * 100) + '%', 'نسبة ما قرأته');
  let e = '(' + Math.round(p) + ' − ' + Math.round(d) + ') ÷ ' + y + ' = ' + hJ(left / y) + '، نقرّبها إلى ' + per + ' صفحة يومياً.';
  if (s > 0) { const mn = Math.round(per / s * 60); ex += hStat(String(mn), 'دقيقة قراءة يومياً'); e += ' وبسرعة ' + Math.round(s) + ' صفحة في الساعة تحتاج نحو ' + mn + ' دقيقة كل يوم.'; }
  return { main: per + ' صفحة يومياً', lbl: 'ورد القراءة المطلوب', extra: '<div class="stat-grid">' + ex + '</div>', explain: e,
    share: 'سأقرأ ' + per + ' صفحة كل يوم لأنهي كتابي خلال ' + y + ' يوماً' };`,
    how: ['المتبقي = صفحات الكتاب − ما قرأته.', 'الورد اليومي = المتبقي ÷ الأيام، ويُقرَّب لأعلى.', 'الدقائق اليومية = الورد ÷ سرعتك في الساعة × 60.', 'إن لم تعرف سرعتك فاقرأ عشر دقائق وعدّ الصفحات، ثم اضرب في ستة.'],
    faq: [
      ['كيف أعرف سرعتي في القراءة؟', 'اقرأ عشر دقائق واحسب كم صفحة قرأت، ثم اضرب العدد في ستة لتحصل على صفحاتك في الساعة.'],
      ['ماذا لو فاتني يوم؟', 'أعد الحساب بما قرأته حتى الآن وبالأيام المتبقية، فتتغير الحصة اليومية تلقائياً.'],
      ['هل تناسب الأداة الكتب الإلكترونية؟', 'نعم، استخدم عدد الصفحات الذي يظهر في تطبيق القراءة.']
    ],
    rel: [['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو'], ['jo/tools/days-to-payday/', '📅 كم تبقّى على الراتب'], ['jo/tools/event-countdown/', '⏳ العدّ التنازلي لمناسبتك']]
  },
  'event-countdown': {
    icon: '⏳', bg: '#ccfbf1', grad: '#0d9488,#134e4a', title: 'العدّ التنازلي لمناسبتك', h1: 'العدّ التنازلي لمناسبتك ⏳',
    sub: 'اكتب تاريخ امتحان أو سفر أو زواج أو أي مناسبة، وسنحسب كم يوماً يتبقى',
    desc: 'اعرف كم يوماً وأسبوعاً يتبقى على امتحانك أو سفرك أو مناسبتك المهمة، بعدّ تنازلي بسيط وسريع.',
    kw: 'عد تنازلي, كم يوم باقي, كم يوم على الامتحان, كم يوم على السفر, حاسبة الأيام',
    search: 'عد تنازلي كم يوم باقي امتحان سفر مناسبة countdown',
    cardDesc: 'كم يوماً يتبقى على امتحانك أو سفرك أو مناسبتك', cat: 'daily',
    warn: 'يُحسب العدّ بالتاريخ الميلادي وبتوقيت جهازك.',
    fields: [
      ['ey', 'السنة', 'مثال: 2027'],
      ['em', 'الشهر (1 إلى 12)', 'مثال: 6'],
      ['ed', 'اليوم', 'مثال: 15']
    ],
    compute: `
  const y = parseInt(ey.value), m = parseInt(em.value), d = parseInt(ed.value);
  const now = new Date(), ty = now.getFullYear();
  if (isNaN(y) || isNaN(m) || isNaN(d) || y < ty - 50 || y > ty + 50 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const chk = new Date(Date.UTC(y, m - 1, d));
  if (chk.getUTCMonth() !== m - 1) return { err: 'هذا التاريخ غير صحيح، تأكد من اليوم والشهر.' };
  const today = Date.UTC(ty, now.getMonth(), now.getDate());
  const diff = Math.round((chk.getTime() - today) / 864e5), a = Math.abs(diff);
  const dd = function (k) { return k === 1 ? 'يوم واحد' : k === 2 ? 'يومان' : k <= 10 ? k + ' أيام' : k + ' يوماً'; };
  const w = Math.floor(a / 7), r = a % 7;
  const wk = function (k) { return k === 1 ? 'أسبوع واحد' : k === 2 ? 'أسبوعان' : k <= 10 ? k + ' أسابيع' : k + ' أسبوعاً'; };
  const span = wk(w) + (r ? ' و' + dd(r) : '');
  const ex = '<div class="stat-grid">' + hStat(String(w), 'أسبوع كامل') + hStat(String(r), 'يوم إضافي') + hStat(String(a * 24), 'ساعة') + '</div>';
  if (diff === 0) return { main: 'إنها اليوم 🎉', lbl: 'موعد مناسبتك هو اليوم', extra: '', explain: 'تاريخ المناسبة يساوي تاريخ اليوم.', share: 'مناسبتي اليوم' };
  if (diff < 0) return { main: 'مضى ' + dd(a), lbl: 'على تاريخ هذه المناسبة', extra: ex, explain: 'بين ' + y + '/' + m + '/' + d + ' واليوم ' + dd(a) + '.', share: 'مضى ' + dd(a) + ' على مناسبتي' };
  return { main: 'باقي ' + dd(a), lbl: 'على مناسبتك', extra: ex, explain: 'بين اليوم و ' + y + '/' + m + '/' + d + ' ' + dd(a) + (w ? '، أي ' + span + '.' : '.'), share: 'باقي ' + dd(a) + ' على مناسبتي' };`,
    how: ['نحسب الأيام الكاملة بين تاريخ اليوم وتاريخ مناسبتك.', 'الأسابيع = الأيام ÷ 7 والباقي أيام إضافية.', 'الساعات = الأيام × 24.', 'إن كان التاريخ في الماضي نعرض كم يوماً مضى عليه.'],
    faq: [
      ['هل يُحسب يوم المناسبة نفسه؟', 'نحسب الفرق بين تاريخ اليوم وتاريخ المناسبة، فالأيام الباقية لا تشمل يوم اليوم.'],
      ['هل أستطيع استخدامه لامتحاناتي؟', 'نعم، اكتب تاريخ الامتحان وستعرف كم يوماً يتبقى لتنظم دراستك.'],
      ['هل يحفظ الموقع تاريخي؟', 'لا، كل شيء يُحسب في متصفحك ولا يُرسل لأي مكان.']
    ],
    rel: [['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو'], ['date-diff.html', '📆 الفرق بين تاريخين'], ['jo/tools/reading-goal/', '📖 كم صفحة أقرأ كل يوم']]
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

const GAMES = {
  'split-bill': {
    sync: true, icon: '🍽️', bg: '#ffedd5', grad: '#ea580c,#7c2d12', title: 'قسّم الحساب بين الأصدقاء', h1: 'قسّم الحساب بين الأصدقاء 🍽️',
    sub: 'سجّل مصاريف الرحلة أو السكن أو السهرة ومن دفع كل مصروف، وسنخبرك من يدفع لمن لتتساووا',
    desc: 'تقسيم المصاريف بين الأصدقاء والسكن المشترك والرحلات: أضف الأشخاص والمصاريف ومن دفع، واعرف رصيد كل واحد ومن يدفع لمن بأقل عدد من التحويلات. مجاني وبدون تسجيل.',
    kw: 'تقسيم المصاريف, تقسيم الحساب بين الأصدقاء, حساب الرحلة, مصاريف السكن المشترك, من يدفع لمن, بديل splitwise',
    search: 'تقسيم المصاريف الحساب الأصدقاء رحلة سكن مشترك من يدفع لمن splitwise split bill expenses',
    cardDesc: 'سجّل المصاريف ومن دفع، ونخبرك من يدفع لمن', cat: 'daily',
    faq: [
      ['كيف تعمل الأداة؟', 'أضف أسماء الأشخاص، ثم سجّل كل مصروف مع من دفعه ومن شارك فيه. تحسب الأداة رصيد كل شخص، وتقترح أقل عدد من التحويلات لتصفية الحسابات.'],
      ['هل تحفظ الأداة بياناتي؟', 'تُحفظ في متصفحك على هذا الجهاز. وإن سجّلت دخولك إلى حسابك في أدواتي تُزامَن مع الحساب لتجدها على أجهزتك الأخرى، وعند الاختلاف تُعتمد النسخة الأحدث. بدون تسجيل دخول لا تُرسل لأي مكان. استخدم زر النسخ لمشاركة الملخص مع أصدقائك.'],
      ['هل أستطيع تقسيم مصروف بمبالغ مختلفة؟', 'نعم، اختر "مبالغ محددة" واكتب حصة كل شخص، بشرط أن يساوي مجموعها قيمة المصروف.'],
      ['ماذا لو دفع شخص ولم يشارك في المصروف؟', 'لا مشكلة، اختره في خانة من دفع ولا تحدده بين المشاركين، فيصبح له رصيد على الآخرين.'],
      ['ماذا يحدث للكسور في القسمة؟', 'نوزّع القرش الزائد على أول المشاركين، فيبقى مجموع الحصص مساوياً لقيمة المصروف تماماً.']
    ],
    how: ['الرصيد = ما دفعه الشخص − مجموع حصصه من المصاريف.', 'من رصيده موجب فله مال عند الآخرين، ومن رصيده سالب فعليه أن يدفع.', 'نطابق أكبر دائن مع أكبر مدين مراراً، فنحصل على عدد قليل من التحويلات.', 'عند التصفية الفعلية اضغط "تصفية وبدء جديد"، فيُحفظ الحساب في السجل وتبدأ حساباً جديداً.'],
    rel: [['tip-calculator.html', '💁 حاسبة البقشيش'], ['jo/tools/budget-split/', '🧮 توزيع الراتب'], ['jo/tools/savings-goal/', '🎯 هدفي الادخاري']],
    main: `
    <style>
      .sb-h{font-size:15px;font-weight:800;margin:6px 0 10px;}
      .sb-in{width:100%;padding:11px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;}
      .sb-btn{padding:11px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#ea580c,#c2410c);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;white-space:nowrap;}
      .sb-btn2{padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:14px;cursor:pointer;}
      .sb-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 6px 6px 12px;margin:0 0 6px 6px;border-radius:999px;background:var(--surface-2);font-size:14px;font-weight:700;}
      .sb-x{border:none;background:transparent;color:var(--text-muted);cursor:pointer;font-size:14px;padding:2px 6px;font-family:inherit;}
      .sb-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;}
      .sb-part{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:10px;margin-bottom:6px;}
      .sb-part label{flex:1;font-size:14px;cursor:pointer;}
      .sb-part input[type=text]{width:90px;padding:7px 8px;}
      .sb-seg{display:flex;gap:6px;margin:8px 0;}
      .sb-seg button{flex:1;}
      .sb-seg .on{background:#ea580c;color:#fff;border-color:#ea580c;}
      .sb-item{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);font-size:14px;}
      .sb-item:last-child{border-bottom:none;}
      .sb-sub{font-size:12px;color:var(--text-muted);margin-top:2px;line-height:1.6;}
      .sb-pos{color:#16a34a;font-weight:800;}
      .sb-neg{color:#dc2626;font-weight:800;}
      .sb-msg{min-height:20px;font-size:13px;margin-top:8px;color:#dc2626;font-weight:700;}
      .sb-empty{font-size:13px;color:var(--text-muted);padding:6px 0;}
    </style>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:var(--radius-sm);padding:10px 14px;font-size:13px;color:#92400e;line-height:1.7;margin-bottom:14px;">
      🔒 تُحفظ بياناتك في متصفحك على هذا الجهاز، وإن سجّلت دخولك تُزامَن مع حسابك لتجدها على أجهزتك الأخرى. استخدم زر النسخ لمشاركة الملخص مع أصدقائك.
    </div>

    <div class="sb-h">👥 1) الأشخاص</div>
    <div class="sb-row"><input class="sb-in" id="sbName" type="text" maxlength="20" placeholder="اسم الشخص، مثال: أحمد" autocomplete="off"><button type="button" class="sb-btn" id="sbAdd">إضافة</button></div>
    <div id="sbPeople"></div>
  </div>

  <div class="card" style="margin-top:16px;" id="sbExpCard">
    <div class="sb-h">🧾 2) مصروف جديد</div>
    <div id="sbNeed" class="sb-empty">أضف شخصين على الأقل لتبدأ تسجيل المصاريف.</div>
    <div id="sbForm" hidden>
      <div class="sb-row"><input class="sb-in" id="sbDesc" type="text" maxlength="40" placeholder="الوصف، مثال: عشاء" autocomplete="off" style="flex:2;"><input class="sb-in" id="sbAmt" type="text" inputmode="decimal" placeholder="المبلغ" autocomplete="off" style="flex:1;min-width:0;"></div>
      <label style="font-size:13px;font-weight:700;display:block;margin:8px 0 4px;">من دفع؟</label>
      <select class="sb-in" id="sbPayer"></select>
      <label style="font-size:13px;font-weight:700;display:block;margin:12px 0 0;">كيف يُقسَّم؟</label>
      <div class="sb-seg"><button type="button" class="sb-btn2 on" id="sbEq">بالتساوي</button><button type="button" class="sb-btn2" id="sbEx">مبالغ محددة</button></div>
      <div id="sbParts"></div>
      <div id="sbLeft" class="sb-sub" style="margin:4px 0 8px;"></div>
      <button type="button" class="sb-btn" id="sbSave" style="width:100%;">➕ أضف المصروف</button>
      <div class="sb-msg" id="sbMsg"></div>
    </div>
  </div>

  <div class="card" style="margin-top:16px;">
    <div class="sb-h">📋 المصاريف المسجّلة</div>
    <div id="sbList"></div>
  </div>

  <div class="card" style="margin-top:16px;">
    <div class="sb-h">⚖️ الأرصدة</div>
    <div id="sbBal"></div>
    <div class="sb-h" style="margin-top:16px;">🤝 التسوية المقترحة</div>
    <div id="sbSet"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;">
      <button type="button" class="sb-btn" id="sbImg" style="flex:2;">🖼️ تصدير كصورة</button>
      <button type="button" class="sb-btn2" id="sbCopy" style="flex:2;">📋 نسخ الملخص</button>
      <button type="button" class="sb-btn2" id="sbClear" style="flex:1;">🗑 تصفية وبدء جديد</button>
    </div>
    <div class="sb-sub" id="sbCopied" style="margin-top:8px;min-height:18px;"></div>
    <div class="sb-h" style="margin-top:18px;">🕘 الحسابات السابقة</div>
    <div class="sb-sub" id="sbHistNote">تُحفظ هنا الحسابات التي صفّيتها لتعود إليها، وتتزامن مع حسابك إن سجّلت دخولك.</div>
    <div id="sbHist"></div>`,
    script: `
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_split_v1', S = { people: [], exps: [], nid: 1 }, mode = 'eq', sel = {}, exv = {};
  try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.people && r.exps) S = r; } catch (e) {}
  if (!S.hist) S.hist = [];
  var NL = String.fromCharCode(10);
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (window.__syncPush) window.__syncPush(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(v) { return parseFloat(String(v).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/[٫،]/g, '.').replace(/,/g, '')); }
  function fm(c) { return (Math.abs(c) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function nm(id) { for (var i = 0; i < S.people.length; i++) if (S.people[i].id === id) return S.people[i].name; return '؟'; }
  function msg(t) { $('sbMsg').textContent = t || ''; }

  function balances() {
    var b = {}; S.people.forEach(function (p) { b[p.id] = 0; });
    S.exps.forEach(function (e) { b[e.payer] = (b[e.payer] || 0) + e.amt; for (var k in e.shares) b[k] = (b[k] || 0) - e.shares[k]; });
    return b;
  }
  function settle(b) {
    var cr = [], db = [], out = [];
    for (var k in b) { if (b[k] > 0) cr.push({ id: +k, v: b[k] }); else if (b[k] < 0) db.push({ id: +k, v: -b[k] }); }
    while (cr.length && db.length) {
      cr.sort(function (x, y) { return y.v - x.v; }); db.sort(function (x, y) { return y.v - x.v; });
      var t = Math.min(cr[0].v, db[0].v);
      out.push({ from: db[0].id, to: cr[0].id, v: t });
      cr[0].v -= t; db[0].v -= t;
      if (cr[0].v === 0) cr.shift(); if (db[0].v === 0) db.shift();
    }
    return out;
  }

  function renderPeople() {
    var h = '';
    S.people.forEach(function (p) { h += '<span class="sb-chip">' + esc(p.name) + '<button type="button" class="sb-x" data-rm="' + p.id + '" aria-label="حذف">✕</button></span>'; });
    $('sbPeople').innerHTML = h || '<div class="sb-empty">لم تضف أحداً بعد.</div>';
    var ok = S.people.length >= 2;
    $('sbNeed').hidden = ok; $('sbForm').hidden = !ok;
    var cur = $('sbPayer').value, o = '';
    S.people.forEach(function (p) { o += '<option value="' + p.id + '">' + esc(p.name) + '</option>'; });
    $('sbPayer').innerHTML = o; if (cur) $('sbPayer').value = cur;
    renderParts();
  }
  function renderParts() {
    var h = '';
    S.people.forEach(function (p) {
      if (sel[p.id] === undefined) sel[p.id] = true;
      h += '<div class="sb-part"><input type="checkbox" id="sbc' + p.id + '" data-c="' + p.id + '"' + (sel[p.id] ? ' checked' : '') + '><label for="sbc' + p.id + '">' + esc(p.name) + '</label>' +
        (mode === 'ex' ? '<input class="sb-in" type="text" inputmode="decimal" data-v="' + p.id + '" placeholder="0.00" value="' + esc(exv[p.id] || '') + '"' + (sel[p.id] ? '' : ' disabled') + '>' : '') + '</div>';
    });
    $('sbParts').innerHTML = h; updLeft();
  }
  function updLeft() {
    if (mode !== 'ex') { $('sbLeft').textContent = ''; return; }
    var tot = Math.round(num($('sbAmt').value) * 100) || 0, s = 0;
    S.people.forEach(function (p) { if (sel[p.id]) s += Math.round(num(exv[p.id]) * 100) || 0; });
    var d = tot - s;
    $('sbLeft').textContent = d === 0 ? '✓ المجموع يطابق قيمة المصروف' : (d > 0 ? 'المتبقي لتوزيعه: ' : 'زيادة عن قيمة المصروف: ') + fm(d) + ' دينار';
  }
  function renderResults() {
    var l = '';
    S.exps.slice().reverse().forEach(function (e) {
      var parts = []; for (var k in e.shares) parts.push(esc(nm(+k)) + ' ' + fm(e.shares[k]));
      l += '<div class="sb-item"><div><strong>' + esc(e.desc) + '</strong> · ' + fm(e.amt) + ' دينار<div class="sb-sub">دفع: ' + esc(nm(e.payer)) + ' · الحصص: ' + parts.join('، ') + '</div></div><button type="button" class="sb-x" data-del="' + e.id + '" aria-label="حذف المصروف">✕</button></div>';
    });
    $('sbList').innerHTML = l || '<div class="sb-empty">لا توجد مصاريف بعد.</div>';
    var b = balances(), bh = '', any = false;
    S.people.forEach(function (p) {
      var v = b[p.id] || 0; if (v !== 0) any = true;
      bh += '<div class="sb-item"><span>' + esc(p.name) + '</span><span class="' + (v > 0 ? 'sb-pos' : v < 0 ? 'sb-neg' : '') + '">' + (v > 0 ? 'له ' + fm(v) : v < 0 ? 'عليه ' + fm(v) : 'متساوٍ') + ' دينار</span></div>';
    });
    $('sbBal').innerHTML = S.people.length ? bh : '<div class="sb-empty">أضف الأشخاص أولاً.</div>';
    var st = settle(b), sh = '';
    st.forEach(function (t) { sh += '<div class="sb-item"><span>من <strong>' + esc(nm(t.from)) + '</strong> إلى <strong>' + esc(nm(t.to)) + '</strong></span><span class="sb-pos">' + fm(t.v) + ' دينار</span></div>'; });
    $('sbSet').innerHTML = sh || '<div class="sb-empty">' + (S.exps.length ? '✓ الحسابات متساوية، لا يوجد ما يُدفع.' : 'ستظهر هنا بعد تسجيل المصاريف.') + '</div>';
  }
  function renderHist() {
    var h = S.hist || [], o = '';
    if (!h.length) { $('sbHist').innerHTML = '<div class="sb-sub" style="margin-top:8px;">لا توجد حسابات سابقة بعد.</div>'; return; }
    h.forEach(function (x, i) {
      o += '<div style="display:flex;gap:8px;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);flex-wrap:wrap;"><div style="min-width:0;"><div style="font-weight:700;font-size:14px;">' + esc(x.d) + ' — ' + fm(x.tot) + ' دينار</div><div class="sb-sub">' + x.n + ' مصروف · ' + esc(x.names) + '</div></div><div style="display:flex;gap:6px;"><button type="button" class="sb-btn2" data-hr="' + i + '">استعادة</button><button type="button" class="sb-btn2" data-hd="' + i + '">حذف</button></div></div>';
    });
    $('sbHist').innerHTML = o;
  }
  function renderAll() { renderPeople(); renderResults(); renderHist(); }
  function archive() {
    if (!S.exps.length) return;
    var tot = 0; S.exps.forEach(function (e) { tot += e.amt; });
    var d = new Date(), ds = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    var nms = S.people.map(function (p) { return p.name; }).join('، ');
    S.hist.unshift({ d: ds, tot: tot, n: S.exps.length, names: nms, snap: { people: S.people, exps: S.exps, nid: S.nid } });
    if (S.hist.length > 20) S.hist.length = 20;
  }

  function addPerson() {
    var n = $('sbName').value.trim().replace(/\\s+/g, ' ');
    if (!n) return;
    for (var i = 0; i < S.people.length; i++) if (S.people[i].name === n) { $('sbName').value = ''; return; }
    if (S.people.length >= 20) return;
    var id = S.nid++; S.people.push({ id: id, name: n }); sel[id] = true; $('sbName').value = ''; save(); renderAll(); $('sbName').focus();
  }
  function used(id) { return S.exps.some(function (e) { return e.payer === id || e.shares[id] !== undefined; }); }
  function addExpense() {
    var amt = Math.round(num($('sbAmt').value) * 100);
    if (!amt || amt <= 0) { msg('اكتب مبلغاً صحيحاً أكبر من صفر.'); return; }
    var payer = +$('sbPayer').value, ids = S.people.filter(function (p) { return sel[p.id]; }).map(function (p) { return p.id; });
    if (!ids.length) { msg('اختر شخصاً واحداً على الأقل ليشارك في المصروف.'); return; }
    var shares = {};
    if (mode === 'eq') {
      var base = Math.floor(amt / ids.length), rem = amt - base * ids.length;
      ids.forEach(function (id, i) { shares[id] = base + (i < rem ? 1 : 0); });
    } else {
      var s = 0; ids.forEach(function (id) { var c = Math.round(num(exv[id]) * 100) || 0; shares[id] = c; s += c; });
      if (s !== amt) { msg('مجموع الحصص ' + fm(s) + ' لا يساوي قيمة المصروف ' + fm(amt) + '.'); return; }
      for (var k in shares) if (shares[k] === 0) delete shares[k];
    }
    S.exps.push({ id: S.nid++, desc: $('sbDesc').value.trim() || 'مصروف', amt: amt, payer: payer, shares: shares });
    $('sbDesc').value = ''; $('sbAmt').value = ''; exv = {}; msg(''); save(); renderParts(); renderResults();
  }
  function summary() {
    var b = balances(), L = ['تقسيم المصاريف (أدواتي - adawati.space/jo/tools/split-bill/)', ''];
    S.exps.forEach(function (e) { L.push('• ' + e.desc + ': ' + fm(e.amt) + ' دينار، دفع ' + nm(e.payer)); });
    L.push('', 'الأرصدة:');
    S.people.forEach(function (p) { var v = b[p.id] || 0; L.push('- ' + p.name + ': ' + (v > 0 ? 'له ' : v < 0 ? 'عليه ' : 'متساوٍ ') + (v ? fm(v) : '') + (v ? ' دينار' : '')); });
    var st = settle(b); L.push('', 'التسوية:');
    if (!st.length) L.push('لا يوجد ما يُدفع.');
    st.forEach(function (t) { L.push('- من ' + nm(t.from) + ' إلى ' + nm(t.to) + ': ' + fm(t.v) + ' دينار'); });
    return L.join(NL);
  }

  $('sbAdd').addEventListener('click', addPerson);
  $('sbName').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addPerson(); } });
  $('sbPeople').addEventListener('click', function (e) {
    var id = e.target.getAttribute && e.target.getAttribute('data-rm'); if (!id) return; id = +id;
    if (used(id)) { $('sbCopied').textContent = 'لا يمكن حذف شخص مشارك في مصاريف مسجّلة. احذف مصاريفه أولاً.'; return; }
    S.people = S.people.filter(function (p) { return p.id !== id; }); delete sel[id]; save(); renderAll();
  });
  $('sbList').addEventListener('click', function (e) {
    var id = e.target.getAttribute && e.target.getAttribute('data-del'); if (!id) return;
    S.exps = S.exps.filter(function (x) { return x.id !== +id; }); save(); renderResults();
  });
  $('sbParts').addEventListener('change', function (e) {
    var c = e.target.getAttribute('data-c'); if (c) { sel[c] = e.target.checked; renderParts(); }
  });
  $('sbParts').addEventListener('input', function (e) {
    var v = e.target.getAttribute('data-v'); if (v) { exv[v] = e.target.value; updLeft(); }
  });
  $('sbAmt').addEventListener('input', updLeft);
  function setMode(m) { mode = m; $('sbEq').classList.toggle('on', m === 'eq'); $('sbEx').classList.toggle('on', m === 'ex'); renderParts(); }
  $('sbEq').addEventListener('click', function () { setMode('eq'); });
  $('sbEx').addEventListener('click', function () { setMode('ex'); });
  $('sbSave').addEventListener('click', addExpense);
  $('sbAmt').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addExpense(); } });
  $('sbCopy').addEventListener('click', function () {
    var t = summary();
    function done(ok) { $('sbCopied').textContent = ok ? '✓ تم نسخ الملخص، الصقه في واتساب أو أي محادثة.' : 'تعذّر النسخ تلقائياً.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
    else { var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} document.body.removeChild(a); done(ok); }
  });
  $('sbImg').addEventListener('click', function () {
    if (!S.exps.length) { $('sbCopied').textContent = 'سجّل مصروفاً واحداً على الأقل قبل التصدير.'; return; }
    if (typeof exportResultImage !== 'function') { $('sbCopied').textContent = 'تعذّر التصدير، أعد تحميل الصفحة.'; return; }
    var b = balances(), tot = 0, rows = [];
    S.exps.forEach(function (e) { tot += e.amt; });
    rows.push({ label: 'إجمالي المصاريف', value: fm(tot) + ' دينار' });
    rows.push({ label: 'عدد المصاريف', value: String(S.exps.length) });
    S.people.forEach(function (p) { var v = b[p.id] || 0; rows.push({ label: p.name, value: v > 0 ? 'له ' + fm(v) + ' دينار' : v < 0 ? 'عليه ' + fm(v) + ' دينار' : 'متساوٍ' }); });
    settle(b).forEach(function (t) { rows.push({ label: 'من ' + nm(t.from) + ' إلى ' + nm(t.to), value: fm(t.v) + ' دينار', highlight: true }); });
    exportResultImage('تقسيم المصاريف', rows);
  });
  var armed = null;
  $('sbClear').addEventListener('click', function () {
    var b = $('sbClear');
    if (!armed) { b.textContent = 'اضغط للتأكيد'; armed = setTimeout(function () { armed = null; b.textContent = '🗑 تصفية وبدء جديد'; }, 4000); return; }
    clearTimeout(armed); armed = null; b.textContent = '🗑 تصفية وبدء جديد';
    archive();
    S = { people: [], exps: [], nid: 1, hist: S.hist }; sel = {}; exv = {}; save(); $('sbCopied').textContent = 'حُفظ الحساب في السجل أدناه.'; renderAll();
  });
  $('sbHist').addEventListener('click', function (e) {
    var r = e.target.getAttribute && e.target.getAttribute('data-hr'), d = e.target.getAttribute && e.target.getAttribute('data-hd');
    if (d !== null && d !== '' && d !== undefined) { S.hist.splice(+d, 1); save(); renderHist(); return; }
    if (r === null || r === undefined || r === '') return;
    var x = S.hist[+r]; if (!x) return;
    S.hist.splice(+r, 1); archive();
    S.people = x.snap.people; S.exps = x.snap.exps; S.nid = x.snap.nid; sel = {}; exv = {}; save(); $('sbCopied').textContent = 'أُعيد الحساب. حُفظ الحساب السابق في السجل.'; renderAll();
  });
  window.__sync = { key: KEY, reload: function () { try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.people && r.exps) S = r; } catch (e) {} if (!S.hist) S.hist = []; sel = {}; exv = {}; renderAll(); } };
  renderAll();
})();
`
  },
  'todo-list': {
    sync: true, icon: '✅', bg: '#dbeafe', grad: '#2563eb,#1e1b4b', title: 'قائمة المهام', h1: 'قائمة المهام اليومية ✅',
    sub: 'اكتب مهامك، وعلّم المنجَز منها، وتابع نسبة إنجازك',
    desc: 'قائمة مهام بسيطة: أضف مهامك، علّم ما أنجزته، وتابع شريط التقدّم. تُحفظ على جهازك، وتتزامن مع حسابك إن سجّلت دخولك.',
    kw: 'قائمة مهام, قائمة المهام اليومية, todo list, تنظيم المهام, مهام اليوم',
    search: 'قائمة مهام todo list تنظيم اليوم مهام يومية انجاز',
    cardDesc: 'اكتب مهامك وعلّم ما أنجزته وتابع تقدّمك', cat: 'daily',
    faq: [
      ['هل تُحفظ مهامي؟', 'نعم، تُحفظ في متصفحك على هذا الجهاز فتجدها عند عودتك. وإن سجّلت دخولك إلى حسابك في أدواتي تتزامن مع الحساب فتظهر على أجهزتك الأخرى (تُعتمد النسخة الأحدث). بدون تسجيل دخول لا تُرسل لأي مكان.'],
      ['كيف أعلّم المهمة منجزة؟', 'اضغط على المربع بجانب المهمة، فيُشطب النص وتزداد نسبة الإنجاز.'],
      ['هل أستطيع حذف المهام المنجزة دفعة واحدة؟', 'نعم، زر "حذف المنجَز" يزيل كل المهام المعلَّمة مرة واحدة.'],
      ['كم مهمة أستطيع إضافتها؟', 'حتى 200 مهمة، وهذا كافٍ للاستخدام اليومي.']
    ],
    how: ['اكتب المهمة واضغط إضافة أو زر Enter.', 'علّم المهمة عند إنجازها.', 'النسبة = المهام المنجزة ÷ كل المهام.', 'استخدم التصفية لعرض المتبقي فقط.'],
    rel: [['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو'], ['jo/tools/habit-tracker/', '🔥 متتبّع العادات'], ['jo/tools/reading-goal/', '📖 كم صفحة أقرأ كل يوم؟']],
    main: `
    <style>
      .pt-row{display:flex;gap:8px;align-items:center;}
      .pt-in{flex:1;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;min-width:0;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;white-space:nowrap;}
      .pt-btn2{padding:9px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:13px;cursor:pointer;}
      .pt-btn2.on{background:#2563eb;color:#fff;border-color:#2563eb;}
      .pt-bar{height:12px;border-radius:99px;background:var(--surface-2);overflow:hidden;margin:6px 0;}
      .pt-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#16a34a,#22c55e);transition:width .25s;}
      .pt-item{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--border);font-size:15px;}
      .pt-item:last-child{border-bottom:none;}
      .pt-item input{width:20px;height:20px;flex:none;cursor:pointer;}
      .pt-item span{flex:1;line-height:1.6;word-break:break-word;}
      .pt-item.done span{text-decoration:line-through;color:var(--text-muted);}
      .pt-x{border:none;background:transparent;color:var(--text-muted);cursor:pointer;font-size:15px;padding:4px 8px;font-family:inherit;}
      .pt-empty{font-size:13px;color:var(--text-muted);padding:12px 0;text-align:center;}
    </style>
    <div class="pt-row"><input class="pt-in" id="tdIn" type="text" maxlength="120" placeholder="مثال: مراجعة الفصل الثالث" autocomplete="off"><button type="button" class="pt-btn" id="tdAdd">إضافة</button></div>
    <div style="margin-top:16px;font-size:14px;font-weight:700;">أنجزت <span id="tdDone">0</span> من <span id="tdAll">0</span> · <span id="tdPct">0%</span></div>
    <div class="pt-bar"><i id="tdBar"></i></div>
    <div id="tdF" style="display:flex;gap:6px;margin:12px 0 4px;flex-wrap:wrap;">
      <button type="button" class="pt-btn2 on" data-f="all">الكل</button>
      <button type="button" class="pt-btn2" data-f="open">المتبقي</button>
      <button type="button" class="pt-btn2" data-f="done">المنجَز</button>
    </div>
    <div id="tdList"></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
      <button type="button" class="pt-btn2" id="tdClr">🗑 حذف المنجَز</button>
      <button type="button" class="pt-btn2" id="tdCopy">📋 نسخ القائمة</button>
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:10px;min-height:18px;" id="tdMsg">🔒 تُحفظ مهامك في متصفحك، وتتزامن مع حسابك إن سجّلت دخولك.</div>`,
    script: `
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_todo_v1', S = { t: [], n: 1 }, f = 'all', NL = String.fromCharCode(10);
  try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.t) S = r; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (window.__syncPush) window.__syncPush(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function msg(t) { $('tdMsg').textContent = t; }
  function render() {
    var done = S.t.filter(function (x) { return x.d; }).length, all = S.t.length, p = all ? Math.round(done * 100 / all) : 0;
    $('tdDone').textContent = done; $('tdAll').textContent = all; $('tdPct').textContent = p + '%'; $('tdBar').style.width = p + '%';
    var h = '';
    S.t.forEach(function (x) {
      if (f === 'open' && x.d) return; if (f === 'done' && !x.d) return;
      h += '<div class="pt-item' + (x.d ? ' done' : '') + '"><input type="checkbox" data-c="' + x.id + '"' + (x.d ? ' checked' : '') + ' aria-label="إنجاز المهمة"><span>' + esc(x.x) + '</span><button type="button" class="pt-x" data-x="' + x.id + '" aria-label="حذف المهمة">✕</button></div>';
    });
    $('tdList').innerHTML = h || '<div class="pt-empty">' + (all ? 'لا توجد مهام في هذا العرض.' : 'لا توجد مهام بعد، أضف أول مهمة.') + '</div>';
    document.querySelectorAll('#tdF button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-f') === f); });
  }
  function add() {
    var v = $('tdIn').value.trim().replace(/\\s+/g, ' ');
    if (!v) return;
    if (S.t.length >= 200) { msg('وصلت إلى الحد الأقصى: 200 مهمة.'); return; }
    S.t.unshift({ id: S.n++, x: v, d: false }); $('tdIn').value = ''; save(); render(); $('tdIn').focus();
  }
  $('tdAdd').addEventListener('click', add);
  $('tdIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  $('tdList').addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-c'); if (!id) return;
    S.t.forEach(function (x) { if (x.id === +id) x.d = e.target.checked; }); save(); render();
  });
  $('tdList').addEventListener('click', function (e) {
    var id = e.target.getAttribute('data-x'); if (!id) return;
    S.t = S.t.filter(function (x) { return x.id !== +id; }); save(); render();
  });
  $('tdF').addEventListener('click', function (e) { var v = e.target.getAttribute('data-f'); if (v) { f = v; render(); } });
  $('tdClr').addEventListener('click', function () {
    var n = S.t.filter(function (x) { return x.d; }).length;
    if (!n) { msg('لا توجد مهام منجزة لحذفها.'); return; }
    S.t = S.t.filter(function (x) { return !x.d; }); save(); render(); msg('✓ حُذفت ' + n + ' من المهام المنجزة.');
  });
  $('tdCopy').addEventListener('click', function () {
    if (!S.t.length) { msg('القائمة فارغة.'); return; }
    var t = S.t.map(function (x) { return (x.d ? '✅ ' : '⬜ ') + x.x; }).join(NL);
    function ok(v) { msg(v ? '✓ تم نسخ القائمة.' : 'تعذّر النسخ تلقائياً.'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { ok(true); }, function () { ok(false); });
    else { var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); var o = false; try { o = document.execCommand('copy'); } catch (e) {} document.body.removeChild(a); ok(o); }
  });
  window.__sync = { key: KEY, reload: function () { try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.t) S = r; } catch (e) {} render(); } };
  render();
})();
`
  },
  'habit-tracker': {
    sync: true, icon: '🔥', bg: '#fee2e2', grad: '#dc2626,#450a0a', title: 'متتبّع العادات', h1: 'متتبّع العادات اليومية 🔥',
    sub: 'أضف عاداتك وعلّم كل يوم التزمت فيه، وشاهد سلسلة أيامك المتتالية',
    desc: 'متتبّع عادات بسيط: علّم الأيام التي التزمت بها خلال آخر سبعة أيام، وتابع سلسلة الأيام المتتالية ونسبة الالتزام. يُحفظ على جهازك، ويتزامن مع حسابك إن سجّلت دخولك.',
    kw: 'متتبع العادات, habit tracker, عادات يومية, سلسلة الايام, الالتزام اليومي',
    search: 'متتبع العادات habit tracker عادة يومية سلسلة أيام التزام streak',
    cardDesc: 'علّم أيام التزامك وتابع سلسلة أيامك المتتالية', cat: 'daily',
    faq: [
      ['ما هي السلسلة؟', 'هي عدد الأيام المتتالية التي التزمت فيها بالعادة وصولاً إلى اليوم. إن لم تعلّم اليوم بعد، نحسب السلسلة حتى أمس حتى لا تنقطع قبل انتهاء يومك.'],
      ['هل أستطيع تعديل الأيام السابقة؟', 'نعم، تظهر آخر سبعة أيام، واضغط على أي يوم منها لتعليمه أو إلغاء تعليمه.'],
      ['أين تُحفظ بياناتي؟', 'في متصفحك على هذا الجهاز. وإن سجّلت دخولك إلى حسابك في أدواتي تتزامن مع الحساب فتظهر على أجهزتك الأخرى (تُعتمد النسخة الأحدث). بدون تسجيل دخول لا تُرسل لأي مكان.'],
      ['ما أفضل عدد من العادات؟', 'ابدأ بعادة أو اثنتين فقط. الالتزام الصغير المستمر أفضل من قائمة طويلة تتركها بعد أيام.']
    ],
    how: ['اكتب العادة التي تريدها وأضفها.', 'اضغط على اليوم الذي التزمت فيه لتعليمه.', 'السلسلة = الأيام المتتالية الملتزم بها حتى اليوم.', 'نسبة الأسبوع = أيام الالتزام ÷ 7.'],
    rel: [['jo/tools/todo-list/', '✅ قائمة المهام'], ['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو'], ['jo/tools/reading-goal/', '📖 كم صفحة أقرأ كل يوم؟']],
    main: `
    <style>
      .pt-row{display:flex;gap:8px;align-items:center;}
      .pt-in{flex:1;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;min-width:0;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#dc2626,#ea580c);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;white-space:nowrap;}
      .ht-card{border:1px solid var(--border);border-radius:14px;padding:12px;margin-top:12px;}
      .ht-top{display:flex;justify-content:space-between;align-items:center;gap:8px;}
      .ht-name{font-weight:800;font-size:15px;word-break:break-word;}
      .ht-meta{font-size:12px;color:var(--text-muted);margin-top:2px;}
      .ht-days{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:10px;}
      .ht-d{border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text-muted);font-family:inherit;font-size:11px;padding:8px 0;cursor:pointer;line-height:1.5;}
      .ht-d b{display:block;font-size:16px;}
      .ht-d.on{background:#16a34a;border-color:#16a34a;color:#fff;}
      .ht-d.today{box-shadow:0 0 0 2px #f59e0b;}
      .pt-x{border:none;background:transparent;color:var(--text-muted);cursor:pointer;font-size:13px;padding:4px 8px;font-family:inherit;}
      .pt-x.arm{color:#dc2626;font-weight:800;}
      .pt-empty{font-size:13px;color:var(--text-muted);padding:12px 0;text-align:center;}
    </style>
    <div class="pt-row"><input class="pt-in" id="htIn" type="text" maxlength="40" placeholder="مثال: قراءة 10 صفحات" autocomplete="off"><button type="button" class="pt-btn" id="htAdd">إضافة</button></div>
    <div id="htList"></div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:12px;min-height:18px;" id="htMsg">🔒 تُحفظ عاداتك في متصفحك، وتتزامن مع حسابك إن سجّلت دخولك. اليوم الحالي محاط بإطار برتقالي.</div>`,
    script: `
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_habits_v1', S = { h: [], n: 1 }, armed = null, WD = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.h) S = r; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (window.__syncPush) window.__syncPush(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function p2(n) { return n < 10 ? '0' + n : '' + n; }
  function key(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function back(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n); return d; }
  function dz(n) { return n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : n <= 10 ? n + ' أيام' : n + ' يوماً'; }
  function streak(h) {
    var i = h.d[key(back(0))] ? 0 : 1, c = 0;
    while (i < 3700 && h.d[key(back(i))]) { c++; i++; }
    return c;
  }
  function render() {
    var out = '';
    S.h.forEach(function (h) {
      var cells = '', wk = 0;
      for (var i = 0; i < 7; i++) {
        var d = back(i), k = key(d), on = !!h.d[k]; if (on) wk++;
        cells += '<button type="button" class="ht-d' + (on ? ' on' : '') + (i === 0 ? ' today' : '') + '" data-h="' + h.id + '" data-k="' + k + '" aria-pressed="' + on + '">' + WD[d.getDay()] + '<b>' + (on ? '✓' : d.getDate()) + '</b></button>';
      }
      var s = streak(h);
      out += '<div class="ht-card"><div class="ht-top"><div><div class="ht-name">' + esc(h.x) + '</div><div class="ht-meta">🔥 السلسلة: ' + (s ? dz(s) : 'لم تبدأ بعد') + ' · هذا الأسبوع: ' + wk + ' من 7</div></div><button type="button" class="pt-x" data-x="' + h.id + '">حذف</button></div><div class="ht-days">' + cells + '</div></div>';
    });
    $('htList').innerHTML = out || '<div class="pt-empty">لا توجد عادات بعد، أضف أول عادة.</div>';
  }
  function add() {
    var v = $('htIn').value.trim().replace(/\\s+/g, ' ');
    if (!v) return;
    if (S.h.length >= 20) { $('htMsg').textContent = 'وصلت إلى الحد الأقصى: 20 عادة.'; return; }
    S.h.push({ id: S.n++, x: v, d: {} }); $('htIn').value = ''; save(); render();
  }
  $('htAdd').addEventListener('click', add);
  $('htIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  $('htList').addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button') : e.target; if (!t) return;
    var hk = t.getAttribute('data-h'), k = t.getAttribute('data-k'), x = t.getAttribute('data-x');
    if (hk) { S.h.forEach(function (h) { if (h.id === +hk) { if (h.d[k]) delete h.d[k]; else h.d[k] = 1; } }); save(); render(); return; }
    if (x) {
      if (armed !== x) { armed = x; t.textContent = 'اضغط للتأكيد'; t.classList.add('arm'); setTimeout(function () { if (armed === x) { armed = null; render(); } }, 4000); return; }
      armed = null; S.h = S.h.filter(function (h) { return h.id !== +x; }); save(); render();
    }
  });
  window.__sync = { key: KEY, reload: function () { try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.h) S = r; } catch (e) {} render(); } };
  render();
})();
`
  },
  'shopping-list': {
    sync: true, icon: '🛒', bg: '#ccfbf1', grad: '#0d9488,#042f2e', title: 'قائمة التسوق بالأسعار', h1: 'قائمة التسوق بالأسعار 🛒',
    sub: 'اكتب ما تريد شراءه مع سعره، واعرف المجموع وما تبقّى من ميزانيتك قبل أن تدفع',
    desc: 'قائمة تسوق تحسب المجموع تلقائياً: أضف الأصناف بالكمية والسعر، علّم ما اشتريته، وحدّد ميزانية لتعرف ما تبقّى منها. تُحفظ على جهازك، وتتزامن مع حسابك إن سجّلت دخولك.',
    kw: 'قائمة تسوق, قائمة مشتريات, حساب مجموع المشتريات, ميزانية التسوق, shopping list',
    search: 'قائمة تسوق مشتريات سوبرماركت مجموع ميزانية أسعار shopping list',
    cardDesc: 'اكتب أصنافك وأسعارها واعرف المجموع وما تبقّى من ميزانيتك', cat: 'daily',
    faq: [
      ['كيف يُحسب المجموع؟', 'سعر كل صنف مضروباً في كميته، ثم نجمع كل الأصناف. نعرض أيضاً مجموع ما اشتريته وما بقي لك شراؤه.'],
      ['ما فائدة الميزانية؟', 'اكتب المبلغ الذي تنوي إنفاقه، فنعرض كم بقي منه بعد مجموع القائمة، ونحذّرك إن تجاوزته.'],
      ['هل أستطيع كتابة كمية بالكسور؟', 'نعم، مثل 0.5 للنصف كيلو أو 1.5 للكيلو ونصف.'],
      ['أين تُحفظ قائمتي؟', 'في متصفحك على هذا الجهاز. وإن سجّلت دخولك إلى حسابك في أدواتي تتزامن مع الحساب فتظهر على أجهزتك الأخرى (تُعتمد النسخة الأحدث). بدون تسجيل دخول لا تُرسل لأي مكان. استخدم زر النسخ لمشاركتها مع أسرتك.']
    ],
    how: ['مجموع الصنف = السعر × الكمية.', 'المجموع = جمع كل الأصناف.', 'المتبقي من الميزانية = الميزانية − المجموع.', 'علّم الصنف عند شرائه لتتابع ما بقي.'],
    rel: [['jo/tools/budget-split/', '🧮 كيف أوزّع راتبي؟'], ['jo/tools/split-bill/', '🍽️ قسّم الحساب بين الأصدقاء'], ['jo/tools/todo-list/', '✅ قائمة المهام']],
    main: `
    <style>
      .pt-in{padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;min-width:0;width:100%;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;white-space:nowrap;width:100%;}
      .pt-btn2{padding:9px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:13px;cursor:pointer;}
      .sh-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px;margin-bottom:8px;}
      .sh-lbl{font-size:12px;color:var(--text-muted);margin-bottom:3px;}
      .sh-item{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--border);font-size:14px;}
      .sh-item:last-child{border-bottom:none;}
      .sh-item input{width:20px;height:20px;flex:none;cursor:pointer;}
      .sh-item .nm{flex:1;line-height:1.6;word-break:break-word;}
      .sh-item .nm small{display:block;font-size:12px;color:var(--text-muted);}
      .sh-item.done .nm b{text-decoration:line-through;color:var(--text-muted);}
      .sh-tot{font-weight:800;white-space:nowrap;}
      .pt-x{border:none;background:transparent;color:var(--text-muted);cursor:pointer;font-size:15px;padding:4px 8px;font-family:inherit;}
      .pt-empty{font-size:13px;color:var(--text-muted);padding:12px 0;text-align:center;}
      .sh-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;}
      .sh-box{border:1px solid var(--border);border-radius:12px;padding:10px;text-align:center;}
      .sh-box div:first-child{font-size:12px;color:var(--text-muted);}
      .sh-box div:last-child{font-weight:800;font-size:16px;margin-top:2px;}
      @media (max-width:420px){.sh-grid{grid-template-columns:1fr 1fr;}.sh-grid>div:first-child{grid-column:1/-1;}.sh-sum{grid-template-columns:1fr;}}
    </style>
    <div class="sh-grid">
      <div><div class="sh-lbl">الصنف</div><input class="pt-in" id="shN" type="text" maxlength="40" placeholder="مثال: أرز" autocomplete="off"></div>
      <div><div class="sh-lbl">الكمية</div><input class="pt-in" id="shQ" type="text" data-num inputmode="decimal" value="1"></div>
      <div><div class="sh-lbl">سعر الواحد (دينار)</div><input class="pt-in" id="shP" type="text" data-num inputmode="decimal" placeholder="0.00"></div>
    </div>
    <button type="button" class="pt-btn" id="shAdd">إضافة إلى القائمة</button>
    <div style="font-size:12px;color:#dc2626;font-weight:700;min-height:18px;margin-top:6px;" id="shErr"></div>
    <div id="shList" style="margin-top:6px;"></div>
    <div class="sh-sum">
      <div class="sh-box"><div>مجموع القائمة</div><div id="shTot">0.00</div></div>
      <div class="sh-box"><div>اشتريته</div><div id="shBought">0.00</div></div>
      <div class="sh-box"><div>بقي لك شراؤه</div><div id="shLeft">0.00</div></div>
    </div>
    <div style="margin-top:14px;">
      <div class="sh-lbl">ميزانيتك (اختياري)</div>
      <input class="pt-in" id="shB" type="text" data-num inputmode="decimal" placeholder="مثال: 50">
      <div id="shBud" style="margin-top:8px;font-weight:800;font-size:14px;min-height:22px;"></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;">
      <button type="button" class="pt-btn2" id="shClr">🗑 حذف المشترى</button>
      <button type="button" class="pt-btn2" id="shCopy">📋 نسخ القائمة</button>
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:10px;min-height:18px;" id="shMsg">🔒 تُحفظ قائمتك في متصفحك، وتتزامن مع حسابك إن سجّلت دخولك.</div>`,
    script: `
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_shop_v1', S = { i: [], n: 1, b: '' }, NL = String.fromCharCode(10);
  try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.i) S = r; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (window.__syncPush) window.__syncPush(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(v) { return parseFloat(String(v).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/[٫،]/g, '.').replace(/,/g, '')); }
  function fm(c) { return (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function line(x) { return Math.round(x.q * x.p); }
  function msg(t) { $('shMsg').textContent = t; }
  function render() {
    var tot = 0, bt = 0, h = '';
    S.i.forEach(function (x) {
      var l = line(x); tot += l; if (x.d) bt += l;
      h += '<div class="sh-item' + (x.d ? ' done' : '') + '"><input type="checkbox" data-c="' + x.id + '"' + (x.d ? ' checked' : '') + ' aria-label="تم الشراء"><div class="nm"><b>' + esc(x.n) + '</b><small>' + x.q + ' × ' + fm(x.p) + '</small></div><div class="sh-tot">' + fm(l) + '</div><button type="button" class="pt-x" data-x="' + x.id + '" aria-label="حذف الصنف">✕</button></div>';
    });
    $('shList').innerHTML = h || '<div class="pt-empty">القائمة فارغة، أضف أول صنف.</div>';
    $('shTot').textContent = fm(tot); $('shBought').textContent = fm(bt); $('shLeft').textContent = fm(tot - bt);
    var b = num(S.b), el = $('shBud');
    if (S.b !== '' && b > 0) {
      var rest = Math.round(b * 100) - tot;
      el.textContent = rest >= 0 ? 'المتبقي من ميزانيتك: ' + fm(rest) + ' دينار' : '⚠️ تجاوزت ميزانيتك بمقدار ' + fm(-rest) + ' دينار';
      el.style.color = rest >= 0 ? '#16a34a' : '#dc2626';
    } else el.textContent = '';
  }
  function add() {
    var n = $('shN').value.trim().replace(/\\s+/g, ' '), q = num($('shQ').value), p = num($('shP').value);
    if (!n) { $('shErr').textContent = 'اكتب اسم الصنف.'; return; }
    if (!(q > 0) || q > 100000) { $('shErr').textContent = 'اكتب كمية صحيحة أكبر من صفر.'; return; }
    if (isNaN(p) || p < 0 || p > 10000000) { $('shErr').textContent = 'اكتب سعراً صحيحاً (يمكن أن يكون صفراً).'; return; }
    if (S.i.length >= 200) { $('shErr').textContent = 'وصلت إلى الحد الأقصى: 200 صنف.'; return; }
    $('shErr').textContent = '';
    S.i.push({ id: S.n++, n: n, q: Math.round(q * 1000) / 1000, p: Math.round(p * 100), d: false });
    $('shN').value = ''; $('shP').value = ''; $('shQ').value = '1'; save(); render(); $('shN').focus();
  }
  $('shAdd').addEventListener('click', add);
  ['shN', 'shQ', 'shP'].forEach(function (id) { $(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } }); });
  $('shList').addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-c'); if (!id) return;
    S.i.forEach(function (x) { if (x.id === +id) x.d = e.target.checked; }); save(); render();
  });
  $('shList').addEventListener('click', function (e) {
    var id = e.target.getAttribute('data-x'); if (!id) return;
    S.i = S.i.filter(function (x) { return x.id !== +id; }); save(); render();
  });
  $('shB').value = S.b;
  $('shB').addEventListener('input', function () { S.b = $('shB').value; save(); render(); });
  $('shClr').addEventListener('click', function () {
    var n = S.i.filter(function (x) { return x.d; }).length;
    if (!n) { msg('لا توجد أصناف معلَّمة كمشتراة.'); return; }
    S.i = S.i.filter(function (x) { return !x.d; }); save(); render(); msg('✓ حُذف ' + n + ' من الأصناف المشتراة.');
  });
  $('shCopy').addEventListener('click', function () {
    if (!S.i.length) { msg('القائمة فارغة.'); return; }
    var tot = 0, L = ['قائمة التسوق (أدواتي - adawati.space/jo/tools/shopping-list/)', ''];
    S.i.forEach(function (x) { tot += line(x); L.push((x.d ? '✅ ' : '⬜ ') + x.n + ' — ' + x.q + ' × ' + fm(x.p) + ' = ' + fm(line(x))); });
    L.push('', 'المجموع: ' + fm(tot) + ' دينار');
    var t = L.join(NL);
    function ok(v) { msg(v ? '✓ تم نسخ القائمة.' : 'تعذّر النسخ تلقائياً.'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { ok(true); }, function () { ok(false); });
    else { var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); var o = false; try { o = document.execCommand('copy'); } catch (e) {} document.body.removeChild(a); ok(o); }
  });
  window.__sync = { key: KEY, reload: function () { try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.i) S = r; } catch (e) {} $('shB').value = S.b; render(); } };
  render();
})();
`
  }
};

function buildGame(slug) {
  const s = GAMES[slug];
  const mainHtml = `<main><div class="tool-page">
  <div class="page-header"><a href="jo/">→ العودة لأدوات الأردن</a></div>

  <div class="card">
    <div class="card-icon" style="background:${s.bg};">${s.icon}</div>
    <h1 class="card-title">${s.h1}</h1>
    <div class="card-subtitle">${s.sub}</div>
    <div class="divider"></div>${s.main}
  </div>
`;
  const html = head(s, slug) + mainHtml + lower(s) + '</div></main>\n\n' + footer.replace(/^<\/main>\s*/, '') + '<script>' + s.script + '</script>\n' + (s.sync ? tail.replace('</body>', '<script src="tool-sync.js?v=1"></script>\n</body>') : tail);
  out(slug, s, html);
}

const arg = process.argv[2] || 'all';
if (arg === 'all') { Object.keys(SPECS).forEach(build); buildPomo(); Object.keys(GAMES).forEach(buildGame); }
else if (arg === 'pomodoro-timer') buildPomo();
else if (GAMES[arg]) buildGame(arg);
else build(arg);
