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
  'split-bill': {
    icon: '🍽️', bg: '#ffedd5', grad: '#ea580c,#7c2d12', title: 'قسّم الحساب بين الأصدقاء', h1: 'قسّم الحساب بين الأصدقاء 🍽️',
    sub: 'اكتب مبلغ الفاتورة وعدد الأشخاص وبقشيشاً إن أردت، وسنحسب حصة كل واحد',
    desc: 'قسّم فاتورة المطعم أو السهرة بين الأصدقاء بالتساوي، مع إضافة بقشيش اختياري، واعرف حصة كل شخص بالدينار.',
    kw: 'تقسيم الفاتورة, تقسيم الحساب, حصة كل شخص, بقشيش, حاسبة المطعم',
    search: 'تقسيم الفاتورة الحساب الأصدقاء مطعم بقشيش split bill',
    cardDesc: 'حصة كل شخص من فاتورة المطعم، مع بقشيش اختياري', cat: 'daily',
    warn: 'القسمة بالتساوي بين الجميع. إن اختلفت طلباتكم كثيراً فاحسبوا كل طلب على حدة.',
    fields: [
      ['bill', 'مبلغ الفاتورة (دينار)', 'مثال: 48'],
      ['ppl', 'عدد الأشخاص', 'مثال: 5'],
      ['tip', 'بقشيش % (اختياري)', 'مثال: 10']
    ],
    compute: `
  const t = parseFloat(bill.value), n = parseInt(ppl.value), tp = parseFloat(tip.value) || 0;
  if (isNaN(t) || isNaN(n) || t <= 0 || n < 1 || n > 100 || tp < 0 || tp > 100) return null;
  const ta = t * tp / 100, tot = t + ta, per = tot / n;
  const ex = hStat(hJ(tot), 'المجموع مع البقشيش') + hStat(hJ(ta), 'البقشيش') + hStat(String(n), 'عدد الأشخاص');
  return { main: hJ(per) + ' دينار للشخص', lbl: 'حصة كل شخص', extra: '<div class="stat-grid">' + ex + '</div>',
    explain: '(' + hJ(t) + ' + ' + hJ(ta) + ' بقشيش) ÷ ' + n + ' = ' + hJ(per) + ' دينار.',
    share: 'حصة كل واحد منا ' + hJ(per) + ' دينار من فاتورة ' + hJ(t) + ' دينار' };`,
    how: ['البقشيش = الفاتورة × النسبة.', 'المجموع = الفاتورة + البقشيش.', 'الحصة = المجموع ÷ عدد الأشخاص.', 'اترك خانة البقشيش فارغة إن لم تردّ إضافته.'],
    faq: [
      ['كم نسبة البقشيش المناسبة؟', 'لا توجد نسبة ملزمة. اختر ما يناسبك، وتبقى الخانة اختيارية.'],
      ['هل تناسب الأداة طلبات مختلفة؟', 'لا، فهي تقسم بالتساوي. للطلبات المختلفة احسب كل طلب وحده.'],
      ['هل تحسب الضريبة والخدمة؟', 'لا تحسبها وحدها. أدخل المبلغ النهائي المكتوب في الفاتورة.']
    ],
    rel: [['tip-calculator.html', '💁 حاسبة البقشيش'], ['discount-calculator.html', '🏷️ حاسبة الخصم'], ['jo/tools/budget-split/', '🧮 توزيع الراتب']]
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
  'days-lived': {
    icon: '🎂', bg: '#fce7f3', grad: '#db2777,#500724', title: 'كم يوماً عشت؟', h1: 'كم يوماً عشت؟ 🎂',
    sub: 'اكتب تاريخ ميلادك، وتعرّف على عدد الأيام والأسابيع التي عشتها ومتى عيد ميلادك القادم',
    desc: 'اعرف كم يوماً وأسبوعاً وساعة عشت منذ ولادتك، وكم يوماً يتبقى على عيد ميلادك القادم.',
    kw: 'كم يوم عشت, حساب العمر بالأيام, عمري بالأيام, عيد ميلادي القادم',
    search: 'كم يوم عشت عمري بالأيام عيد ميلاد days alive',
    cardDesc: 'عمرك بالأيام والأسابيع، ومتى عيد ميلادك القادم', cat: 'daily',
    warn: 'يُحسب العمر بالتاريخ الميلادي وبتوقيت جهازك، وقد يختلف يوماً واحداً حسب ساعة ولادتك.',
    fields: [
      ['by', 'سنة الميلاد', 'مثال: 2000'],
      ['bm', 'الشهر (1 إلى 12)', 'مثال: 5'],
      ['bd', 'اليوم', 'مثال: 17']
    ],
    compute: `
  const y = parseInt(by.value), m = parseInt(bm.value), d = parseInt(bd.value);
  const I = function (n) { return Math.round(n).toLocaleString('en-US'); };
  const now = new Date(), ty = now.getFullYear();
  if (isNaN(y) || isNaN(m) || isNaN(d) || y < 1900 || y > ty || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const chk = new Date(Date.UTC(y, m - 1, d));
  if (chk.getUTCMonth() !== m - 1) return { err: 'هذا التاريخ غير صحيح، تأكد من اليوم والشهر.' };
  const today = Date.UTC(ty, now.getMonth(), now.getDate()), b = chk.getTime();
  if (b > today) return { err: 'تاريخ الميلاد في المستقبل.' };
  const days = Math.round((today - b) / 864e5);
  let nb = Date.UTC(ty, m - 1, d); if (nb < today) nb = Date.UTC(ty + 1, m - 1, d);
  const nxt = Math.round((nb - today) / 864e5);
  const ex = hStat(I(days / 7), 'أسبوعاً') + hStat(I(days * 24), 'ساعة') + hStat(nxt === 0 ? 'اليوم 🎉' : I(nxt), 'يوماً على عيد ميلادك القادم');
  return { main: I(days) + ' يوماً', lbl: 'عشت منذ ولادتك', extra: '<div class="stat-grid">' + ex + '</div>',
    explain: 'عدد الأيام بين ' + y + '/' + m + '/' + d + ' واليوم = ' + I(days) + ' يوماً، أي نحو ' + I(days / 365.25) + ' سنة.',
    share: 'عشت ' + I(days) + ' يوماً حتى الآن' };`,
    how: ['نحسب عدد الأيام بين تاريخ ميلادك واليوم.', 'الأسابيع = الأيام ÷ 7، والساعات = الأيام × 24.', 'عيد الميلاد القادم هو أقرب تاريخ مستقبلي لليوم والشهر الذي ولدت فيهما.', 'من وُلد في 29 شباط يُحتسب عيده في 1 آذار في السنوات غير الكبيسة.'],
    faq: [
      ['هل تعمل الأداة بالتاريخ الهجري؟', 'لا، تعتمد التاريخ الميلادي فقط.'],
      ['لماذا يختلف الناتج عن حاسبة أخرى بيوم؟', 'بسبب ساعة الولادة أو فرق التوقيت، فنحن نحسب الأيام الكاملة بتاريخ اليوم.'],
      ['كيف أحسب عمري بالسنوات والأشهر؟', 'استخدم حاسبة العمر العامة في الموقع.']
    ],
    rel: [['age-calculator.html', '🎂 حاسبة العمر'], ['jo/tools/event-countdown/', '⏳ العدّ التنازلي لمناسبتك'], ['jo/tools/days-to-payday/', '📅 كم تبقّى على الراتب']]
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
  const ex = '<div class="stat-grid">' + hStat(String(w), 'أسبوع كامل') + hStat(String(r), 'يوم إضافي') + hStat(String(a * 24), 'ساعة') + '</div>';
  if (diff === 0) return { main: 'إنها اليوم 🎉', lbl: 'موعد مناسبتك هو اليوم', extra: '', explain: 'تاريخ المناسبة يساوي تاريخ اليوم.', share: 'مناسبتي اليوم' };
  if (diff < 0) return { main: 'مضى ' + dd(a), lbl: 'على تاريخ هذه المناسبة', extra: ex, explain: 'بين ' + y + '/' + m + '/' + d + ' واليوم ' + dd(a) + '.', share: 'مضى ' + dd(a) + ' على مناسبتي' };
  return { main: 'باقي ' + dd(a), lbl: 'على مناسبتك', extra: ex, explain: 'بين اليوم و ' + y + '/' + m + '/' + d + ' ' + dd(a) + '، أي ' + w + ' أسبوعاً و ' + r + ' أيام.', share: 'باقي ' + dd(a) + ' على مناسبتي' };`,
    how: ['نحسب الأيام الكاملة بين تاريخ اليوم وتاريخ مناسبتك.', 'الأسابيع = الأيام ÷ 7 والباقي أيام إضافية.', 'الساعات = الأيام × 24.', 'إن كان التاريخ في الماضي نعرض كم يوماً مضى عليه.'],
    faq: [
      ['هل يُحسب يوم المناسبة نفسه؟', 'نحسب الفرق بين تاريخ اليوم وتاريخ المناسبة، فالأيام الباقية لا تشمل يوم اليوم.'],
      ['هل أستطيع استخدامه لامتحاناتي؟', 'نعم، اكتب تاريخ الامتحان وستعرف كم يوماً يتبقى لتنظم دراستك.'],
      ['هل يحفظ الموقع تاريخي؟', 'لا، كل شيء يُحسب في متصفحك ولا يُرسل لأي مكان.']
    ],
    rel: [['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو'], ['jo/tools/days-lived/', '🎂 كم يوماً عشت'], ['jo/tools/reading-goal/', '📖 كم صفحة أقرأ كل يوم']]
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
  'reaction-game': {
    icon: '⚡', bg: '#fef9c3', grad: '#ca8a04,#422006', title: 'اختبار سرعة ردة الفعل', h1: 'اختبار سرعة ردة الفعل ⚡',
    sub: 'اضغط بأسرع ما تستطيع عندما يتحول اللون إلى الأخضر، وانظر معدّلك بعد خمس جولات',
    desc: 'لعبة سريعة تقيس سرعة ردة فعلك بالمللي ثانية: انتظر اللون الأخضر ثم اضغط. خمس جولات ومعدّل وأفضل نتيجة محفوظة على جهازك.',
    kw: 'اختبار سرعة ردة الفعل, لعبة سرعة, قياس زمن رد الفعل, لعبة الضغط على الأخضر',
    search: 'اختبار ردة الفعل سرعة لعبة مللي ثانية reaction time game',
    cardDesc: 'اضغط عند اللون الأخضر وقِس سرعتك بالمللي ثانية', cat: 'games',
    faq: [
      ['كيف تعمل اللعبة؟', 'اضغط على المربع ليبدأ الانتظار، وعندما يصبح أخضر اضغط بأسرع ما تستطيع. إن ضغطت قبل الأخضر تعاد المحاولة.'],
      ['ما معنى النتيجة؟', 'هي الزمن بالمللي ثانية بين ظهور اللون الأخضر وضغطتك. كلما قلّت كانت ردة فعلك أسرع.'],
      ['هل النتيجة دقيقة؟', 'هي تقدير للتسلية، وتتأثر بسرعة جهازك وشاشتك، فلا تعتمد عليها طبياً.']
    ],
    how: ['اضغط على المربع لتبدأ الجولة.', 'انتظر حتى يتحول إلى الأخضر دون أن تضغط.', 'اضغط فور رؤية الأخضر.', 'بعد خمس جولات ترى المعدّل وأفضل نتيجة لك.'],
    rel: [['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو'], ['jo/tools/guess-number/', '🔢 خمّن الرقم'], ['jo/games/', '🎮 ألعاب الأردن']],
    main: `
    <div id="rPad" role="button" tabindex="0" style="user-select:none;-webkit-user-select:none;cursor:pointer;border-radius:16px;padding:56px 16px;text-align:center;font-weight:800;font-size:22px;color:#fff;background:#2563eb;touch-action:manipulation;line-height:1.6;">اضغط هنا للبدء</div>
    <div style="text-align:center;margin-top:14px;font-size:14px;">الجولة <strong id="rRound">0</strong> من 5 · آخر نتيجة: <strong id="rLast">—</strong></div>
    <div class="stat-grid" id="rStats" style="margin-top:14px;"></div>`,
    script: `
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var pad = $('rPad'), st = 'idle', t0 = 0, to = null, res = [], KEY = 'adawati_react_best', best = 0;
  try { best = parseInt(localStorage.getItem(KEY)) || 0; } catch (e) {}
  function box(v, l) { return '<div class="stat-box"><div class="stat-val">' + v + '</div><div class="stat-lbl">' + l + '</div></div>'; }
  function paint(bg, txt) { pad.style.background = bg; pad.textContent = txt; }
  function stats() { $('rStats').innerHTML = best ? box(best + ' ms', 'أفضل نتيجة لك') : ''; }
  function rate(a) { return a < 250 ? 'سريع جداً' : a < 350 ? 'جيد' : 'عادي، جرّب مرة أخرى'; }
  function press() {
    if (st === 'idle' || st === 'done') {
      if (st === 'done') { res = []; $('rRound').textContent = 0; $('rLast').textContent = '—'; stats(); }
      st = 'wait'; paint('#dc2626', 'انتظر اللون الأخضر…');
      to = setTimeout(function () { st = 'go'; paint('#16a34a', 'اضغط الآن!'); t0 = performance.now(); }, 1500 + Math.random() * 2500);
    } else if (st === 'wait') {
      clearTimeout(to); st = 'idle'; paint('#2563eb', 'ضغطت مبكراً! اضغط للمحاولة من جديد');
    } else if (st === 'go') {
      var ms = Math.round(performance.now() - t0); res.push(ms);
      $('rRound').textContent = res.length; $('rLast').textContent = ms + ' ms';
      if (!best || ms < best) { best = ms; try { localStorage.setItem(KEY, best); } catch (e) {} }
      if (res.length >= 5) {
        var avg = Math.round(res.reduce(function (a, b) { return a + b; }, 0) / res.length);
        st = 'done'; paint('#7c3aed', 'معدّلك ' + avg + ' ms — ' + rate(avg) + '. اضغط للإعادة');
        $('rStats').innerHTML = box(avg + ' ms', 'المعدّل') + box(Math.min.apply(null, res) + ' ms', 'أفضل جولة') + box(best + ' ms', 'أفضل نتيجة لك');
      } else { st = 'idle'; paint('#2563eb', ms + ' ms — اضغط للجولة التالية'); stats(); }
    }
  }
  pad.addEventListener('pointerdown', function (e) { e.preventDefault(); press(); });
  pad.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); press(); } });
  stats();
})();
`
  },
  'guess-number': {
    icon: '🔢', bg: '#dbeafe', grad: '#2563eb,#1e1b4b', title: 'لعبة خمّن الرقم', h1: 'لعبة خمّن الرقم 🔢',
    sub: 'اخترت رقماً بين 1 و100، فخمّنه بأقل عدد من المحاولات',
    desc: 'لعبة خمّن الرقم من 1 إلى 100: تلميح أكبر أو أصغر بعد كل محاولة، وعدّاد للمحاولات وأفضل نتيجة محفوظة على جهازك.',
    kw: 'لعبة خمن الرقم, لعبة تخمين, لعبة أرقام, خمن الرقم من 1 الى 100',
    search: 'خمن الرقم لعبة تخمين أرقام guess the number game',
    cardDesc: 'خمّن الرقم بين 1 و100 بأقل عدد من المحاولات', cat: 'games',
    faq: [
      ['كيف ألعب؟', 'اكتب رقماً بين 1 و100 واضغط تخمين، وسنخبرك إن كان الرقم السري أكبر أو أصغر.'],
      ['ما أفضل طريقة للفوز؟', 'ابدأ بالمنتصف 50، ثم نصّف المجال في كل مرة. بهذه الطريقة تصل في سبع محاولات على الأكثر.'],
      ['هل تحفظ اللعبة نتائجي؟', 'تحفظ أفضل نتيجة على جهازك فقط، ولا ترسلها لأي مكان.']
    ],
    how: ['اللعبة تختار رقماً عشوائياً بين 1 و100.', 'اكتب تخمينك وسنقول لك أكبر أم أصغر.', 'حاول الوصول بأقل عدد من المحاولات.', 'نصيحة: نصّف المجال في كل تخمين.'],
    rel: [['jo/tools/reaction-game/', '⚡ اختبار ردة الفعل'], ['jo/games/', '🎮 ألعاب الأردن'], ['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو']],
    main: `
    <div style="text-align:center;font-size:15px;margin-bottom:10px;">المحاولات: <strong id="gCnt">0</strong> · أفضل نتيجة: <strong id="gBest">—</strong></div>
    <div id="gMsg" style="text-align:center;font-weight:800;font-size:18px;min-height:52px;padding:10px;border-radius:12px;background:var(--surface-2);line-height:1.6;">خمّن رقماً بين 1 و100</div>
    <div style="display:flex;gap:8px;margin-top:14px;">
      <input type="text" data-num inputmode="numeric" id="gIn" placeholder="تخمينك" style="flex:2;" autocomplete="off">
      <button type="button" id="gGo" style="flex:1;padding:13px;border:none;border-radius:12px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:16px;cursor:pointer;">تخمين</button>
    </div>
    <div id="gHist" style="margin-top:12px;font-size:13px;color:var(--text-muted);line-height:1.8;"></div>
    <button type="button" id="gNew" style="margin-top:12px;width:100%;padding:11px;border:1px solid var(--border);border-radius:12px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;cursor:pointer;">↺ لعبة جديدة</button>`,
    script: `
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_guess_best', secret, cnt, over, best = 0, lo, hi;
  try { best = parseInt(localStorage.getItem(KEY)) || 0; } catch (e) {}
  function fresh() { secret = 1 + Math.floor(Math.random() * 100); cnt = 0; over = false; lo = 1; hi = 100; $('gCnt').textContent = 0; $('gBest').textContent = best || '—'; $('gMsg').textContent = 'خمّن رقماً بين 1 و100'; $('gHist').textContent = ''; $('gIn').value = ''; $('gIn').focus(); }
  function guess() {
    if (over) return;
    var v = parseInt($('gIn').value.replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }));
    if (isNaN(v) || v < 1 || v > 100) { $('gMsg').textContent = 'اكتب رقماً صحيحاً بين 1 و100'; return; }
    cnt++; $('gCnt').textContent = cnt; $('gIn').value = '';
    if (v === secret) {
      over = true; $('gMsg').textContent = '🎉 أحسنت! الرقم ' + secret + ' بعد ' + cnt + ' محاولة';
      if (!best || cnt < best) { best = cnt; try { localStorage.setItem(KEY, best); } catch (e) {} $('gBest').textContent = best; }
    } else if (v < secret) { lo = Math.max(lo, v + 1); $('gMsg').textContent = '⬆️ الرقم أكبر من ' + v; }
    else { hi = Math.min(hi, v - 1); $('gMsg').textContent = '⬇️ الرقم أصغر من ' + v; }
    if (!over) $('gHist').textContent = 'المجال الآن: من ' + lo + ' إلى ' + hi;
  }
  $('gGo').addEventListener('click', guess);
  $('gIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') guess(); });
  $('gNew').addEventListener('click', fresh);
  fresh();
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
  const html = head(s, slug) + mainHtml + lower(s) + '</div></main>\n\n' + footer.replace(/^<\/main>\s*/, '') + '<script>' + s.script + '</script>\n' + tail;
  out(slug, s, html);
}

const arg = process.argv[2] || 'all';
if (arg === 'all') { Object.keys(SPECS).forEach(build); buildPomo(); Object.keys(GAMES).forEach(buildGame); }
else if (arg === 'pomodoro-timer') buildPomo();
else if (GAMES[arg]) buildGame(arg);
else build(arg);
