// Batch 4a game-style jo tools: tafqeet, whatsapp-link, name-decorator. Merged into GAMES by build-jo-tool.js.
const CSS = String.raw`
    <style>
      .pt-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
      .pt-in{width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;min-width:0;}
      .pt-lbl{display:block;font-size:13px;font-weight:700;margin:12px 0 5px;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;}
      .pt-btn2{padding:9px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:13px;cursor:pointer;}
      .pt-btn2.on{background:#2563eb;color:#fff;border-color:#2563eb;}
      .pt-out{margin-top:14px;padding:14px;border-radius:12px;background:var(--surface-2);font-size:16px;line-height:2;font-weight:700;word-break:break-word;min-height:24px;}
      .pt-note{font-size:12px;color:var(--text-muted);margin-top:10px;min-height:18px;line-height:1.7;}
    </style>`;

const copyFn = String.raw`
  function copyText(t, cb) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { cb(true); }, function () { cb(false); });
    else { var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); var o = false; try { o = document.execCommand('copy'); } catch (e) {} document.body.removeChild(a); cb(o); }
  }
  function normDigits(s) { return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 1776; }); }`;

const TAFQEET = {
  icon: '✍️', bg: '#e0f2fe', grad: '#0284c7,#0c4a6e', title: 'تفقيط المبلغ بالحروف', h1: 'تفقيط المبلغ: اكتب الرقم بالحروف ✍️',
  sub: 'حوّل أي مبلغ إلى كلمات عربية صحيحة للشيكات والسندات والعقود، بالدينار والريال والدرهم وغيرها',
  desc: 'أداة تفقيط مجانية: حوّل المبلغ بالأرقام إلى حروف عربية صحيحة نحوياً للشيكات والسندات، بالدينار الأردني والريال السعودي والدرهم الإماراتي وغيرها.',
  kw: 'تفقيط, تفقيط المبلغ, كتابة المبلغ بالحروف, تحويل الرقم إلى كلمات, تفقيط الشيك, كتابة الأرقام بالحروف العربية',
  search: 'تفقيط المبلغ كتابة الرقم بالحروف شيك سند دينار ريال درهم تحويل الأرقام الى كلمات',
  cardDesc: 'اكتب أي مبلغ بالحروف العربية للشيكات والسندات', cat: 'money',
  faq: [
    ['ما هو التفقيط؟', 'هو كتابة المبلغ بالحروف بدل الأرقام، مثل كتابة 1250 دينارا: ألف ومائتان وخمسون ديناراً. يستخدم في الشيكات والسندات والعقود لمنع التلاعب بالأرقام.'],
    ['هل التفقيط صحيح نحوياً؟', 'تراعي الأداة قواعد العدد والمعدود: التمييز المفرد والجمع والمثنى، والتأنيث في العملات المؤنثة مثل الهللة والبيسة. ومع ذلك راجع النص قبل اعتماده في أي مستند رسمي.'],
    ['ماذا عن الكسور؟', 'تُحوَّل إلى الوحدة الفرعية للعملة، فيصبح 125.500 ديناراً أردنياً: مائة وخمسة وعشرون ديناراً وخمسمائة فلس. وتُقرَّب الكسور الزائدة عن خانات العملة.'],
    ['ما أكبر رقم تقبله الأداة؟', 'حتى 999 مليار، ويكفي لأي شيك أو عقد.'],
    ['لماذا تضاف عبارتا "فقط" و"لا غير"؟', 'هي صيغة معتادة في الشيكات لإغلاق المبلغ ومنع الإضافة عليه. يمكنك إخفاؤها من الخيارات.']
  ],
  how: ['يُقسَّم الرقم إلى مجموعات: مليارات ثم ملايين ثم آلاف ثم آحاد.', 'يُختار شكل المعدود حسب آخر الرقم: مفرد منصوب من 11 إلى 99، وجمع من 3 إلى 10، ومفرد مجرور مع المئات والآلاف.', 'تأخذ العملة الفرعية (فلس أو هللة أو سنت) قيمتها من الكسر العشري بعد التقريب.'],
  rel: [['jo/calculators/net-salary/', '💵 صافي الراتب'], ['jo/tools/split-bill/', '🧾 تقسيم المصاريف'], ['jo/tools/invoice-generator/', '🧾 منشئ الفواتير']],
  main: CSS + String.raw`
    <label class="pt-lbl" for="tfAmt">المبلغ بالأرقام</label>
    <input class="pt-in" id="tfAmt" type="text" inputmode="decimal" autocomplete="off" placeholder="مثال: 1250.500" dir="ltr" style="text-align:right;">
    <label class="pt-lbl" for="tfCur">العملة</label>
    <select class="pt-in" id="tfCur"></select>
    <div class="pt-row" style="margin-top:12px;">
      <label style="font-size:13px;"><input type="checkbox" id="tfOnly" checked> أضف "فقط" و"لا غير"</label>
    </div>
    <div class="pt-out" id="tfOut" aria-live="polite">اكتب مبلغاً لتظهر الكتابة بالحروف.</div>
    <div class="pt-row" style="margin-top:12px;"><button type="button" class="pt-btn" id="tfCopy">📋 نسخ النص</button></div>
    <div class="pt-note" id="tfMsg">أداة مساعدة: راجع النص قبل اعتماده في الشيكات والمستندات الرسمية.</div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };` + copyFn + String.raw`
  /*PURE*/
  var ONES_M = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  var ONES_F = ['', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثماني', 'تسع', 'عشر'];
  var TEENS_M = ['أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  var TEENS_F = ['إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'];
  var TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  var HUND = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  var SC = [{ s: 'مليار', d: 'ملياران', p: 'مليارات' }, { s: 'مليون', d: 'مليونان', p: 'ملايين' }, { s: 'ألف', d: 'ألفان', p: 'آلاف' }];
  var TAN = 'اً', MK = '\u0001';
  function words3(u, fem) {
    var h = Math.floor(u / 100), r = u % 100, p = [];
    if (h) p.push(HUND[h]);
    if (r) {
      if (r <= 10) p.push((fem ? ONES_F : ONES_M)[r]);
      else if (r < 20) p.push((fem ? TEENS_F : TEENS_M)[r - 11]);
      else {
        var o = r % 10, t = Math.floor(r / 10), s = TENS[t];
        if (o) s = (fem ? (o === 1 ? 'إحدى' : ONES_F[o]) : ONES_M[o]) + ' و' + s;
        p.push(s);
      }
    }
    return p.join(' و');
  }
  function groupText(g, sc) {
    var h = Math.floor(g / 100), r = g % 100;
    var pre = h ? (h === 2 ? 'مائتا' : HUND[h]) + ' ' + sc.s : '';
    if (r === 0) return pre;
    if (g === 1) return sc.s;
    if (g === 2) return sc.d;
    if (r === 1) return pre + ' و' + sc.s;
    if (r === 2) return pre + ' و' + sc.d;
    if (r <= 10) return (h ? pre + ' و' : '') + ONES_M[r] + ' ' + sc.p;
    return words3(g, false) + ' ' + sc.s + '\u0001';
  }
  function spell(n, nf, fem) {
    var none = !nf, parts = [], u = n % 1000, last2 = n % 100, type;
    var gs = [[Math.floor(n / 1e9) % 1000, SC[0]], [Math.floor(n / 1e6) % 1000, SC[1]], [Math.floor(n / 1000) % 1000, SC[2]]];
    gs.forEach(function (x) { if (x[0] > 0) parts.push(groupText(x[0], x[1])); });
    var noun = '';
    if (last2 === 1 || last2 === 2) {
      if (u - last2 > 0) parts.push(HUND[(u - last2) / 100]);
      if (none) parts.push(last2 === 1 ? 'واحد' : 'اثنان');
      else parts.push(last2 === 1 ? nf.s + (fem ? ' واحدة' : ' واحد') : nf.d);
      return parts.join(' و').replace(/\u0001/g, TAN);
    }
    if (u > 0) parts.push(words3(u, fem));
    if (none) return parts.join(' و').replace(/\u0001/g, TAN);
    if (last2 === 0) { type = 's'; noun = nf.s; }
    else if (last2 <= 10) { type = 'p'; noun = nf.p; }
    else { type = 'a'; noun = nf.a; }
    var t = parts.join(' و');
    if (last2 === 0) {
      t = t.replace(/(مائتان|ألفان|مليونان|ملياران)$/, function (m) { return m.slice(0, -1); });
      t = t.replace(/\u0001$/, '');
    }
    return (t + ' ' + noun).replace(/\u0001/g, TAN);
  }
  function mk(s, d, p, a) { return { s: s, d: d, p: p, a: a }; }
  var CUR = {
    JOD: { n: 'دينار أردني', ratio: 1000, m: mk('دينار أردني', 'ديناران أردنيان', 'دنانير أردنية', 'ديناراً أردنياً'), sub: mk('فلس', 'فلسان', 'أفلس', 'فلساً'), sf: false },
    SAR: { n: 'ريال سعودي', ratio: 100, m: mk('ريال سعودي', 'ريالان سعوديان', 'ريالات سعودية', 'ريالاً سعودياً'), sub: mk('هللة', 'هللتان', 'هللات', 'هللةً'), sf: true },
    AED: { n: 'درهم إماراتي', ratio: 100, m: mk('درهم إماراتي', 'درهمان إماراتيان', 'دراهم إماراتية', 'درهماً إماراتياً'), sub: mk('فلس', 'فلسان', 'أفلس', 'فلساً'), sf: false },
    OMR: { n: 'ريال عماني', ratio: 1000, m: mk('ريال عماني', 'ريالان عمانيان', 'ريالات عمانية', 'ريالاً عمانياً'), sub: mk('بيسة', 'بيستان', 'بيسات', 'بيسةً'), sf: true },
    KWD: { n: 'دينار كويتي', ratio: 1000, m: mk('دينار كويتي', 'ديناران كويتيان', 'دنانير كويتية', 'ديناراً كويتياً'), sub: mk('فلس', 'فلسان', 'أفلس', 'فلساً'), sf: false },
    BHD: { n: 'دينار بحريني', ratio: 1000, m: mk('دينار بحريني', 'ديناران بحرينيان', 'دنانير بحرينية', 'ديناراً بحرينياً'), sub: mk('فلس', 'فلسان', 'أفلس', 'فلساً'), sf: false },
    QAR: { n: 'ريال قطري', ratio: 100, m: mk('ريال قطري', 'ريالان قطريان', 'ريالات قطرية', 'ريالاً قطرياً'), sub: mk('درهم', 'درهمان', 'دراهم', 'درهماً'), sf: false },
    EGP: { n: 'جنيه مصري', ratio: 100, m: mk('جنيه مصري', 'جنيهان مصريان', 'جنيهات مصرية', 'جنيهاً مصرياً'), sub: mk('قرش', 'قرشان', 'قروش', 'قرشاً'), sf: false },
    USD: { n: 'دولار أمريكي', ratio: 100, m: mk('دولار أمريكي', 'دولاران أمريكيان', 'دولارات أمريكية', 'دولاراً أمريكياً'), sub: mk('سنت', 'سنتان', 'سنتات', 'سنتاً'), sf: false },
    EUR: { n: 'يورو', ratio: 100, m: mk('يورو', 'اثنان يورو', 'يورو', 'يورو'), sub: mk('سنت', 'سنتان', 'سنتات', 'سنتاً'), sf: false },
    NONE: { n: 'بدون عملة (الرقم فقط)', ratio: 1, m: null, sub: null, sf: false }
  };
  function tafqeet(raw, code, wrap) {
    var c = CUR[code], s = normDigits(raw).replace(/[\s,٬']/g, '').replace(/٫/g, '.');
    if (!s) return { empty: true };
    if (!/^\d+(\.\d+)?$/.test(s)) return { err: 'اكتب أرقاماً فقط، مثل 1250.50' };
    var ip = s.split('.')[0].replace(/^0+(?=\d)/, ''), fp = s.split('.')[1] || '';
    if (ip.length > 12) return { err: 'الحد الأعلى 999 مليار.' };
    var M = parseInt(ip, 10), S = 0;
    if (c.ratio > 1) {
      var dg = c.ratio === 1000 ? 3 : 2, f = (fp + '000').slice(0, dg);
      S = parseInt(f, 10);
      if (fp.length > dg && parseInt(fp.charAt(dg), 10) >= 5) S += 1;
      if (S >= c.ratio) { S -= c.ratio; M += 1; }
    } else if (fp && parseInt(fp.charAt(0), 10) >= 5) M += 1;
    if (M > 999999999999) return { err: 'الحد الأعلى 999 مليار.' };
    var out = [];
    if (code === 'NONE') out.push(M === 0 ? 'صفر' : spell(M, null, false));
    else {
      if (M > 0) out.push(spell(M, c.m, false));
      if (S > 0) out.push(spell(S, c.sub, c.sf));
      if (!out.length) out.push('صفر ' + c.m.s);
    }
    var t = out.join(' و');
    if (wrap) t = 'فقط ' + t + ' لا غير';
    return { text: t, M: M, S: S };
  }
  /*ENDPURE*/
  var sel = $('tfCur');
  Object.keys(CUR).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = CUR[k].n; sel.appendChild(o); });
  function msg(t) { $('tfMsg').textContent = t; }
  function run() {
    var r = tafqeet($('tfAmt').value, sel.value, $('tfOnly').checked);
    $('tfOut').textContent = r.empty ? 'اكتب مبلغاً لتظهر الكتابة بالحروف.' : (r.err || r.text);
    $('tfOut').style.color = r.err ? '#dc2626' : '';
  }
  ['input', 'change'].forEach(function (e) { $('tfAmt').addEventListener(e, run); sel.addEventListener(e, run); $('tfOnly').addEventListener(e, run); });
  $('tfCopy').addEventListener('click', function () {
    var r = tafqeet($('tfAmt').value, sel.value, $('tfOnly').checked);
    if (!r.text) { msg('اكتب مبلغاً صحيحاً أولاً.'); return; }
    copyText(r.text, function (ok) { msg(ok ? '✓ تم نسخ النص.' : 'تعذّر النسخ تلقائياً، حدّد النص وانسخه.'); });
  });
  try { var last = localStorage.getItem('adawati_tafqeet_cur'); if (last && CUR[last]) sel.value = last; } catch (e) {}
  sel.addEventListener('change', function () { try { localStorage.setItem('adawati_tafqeet_cur', sel.value); } catch (e) {} });
  run();
})();
`
};

const WALINK = {
  icon: '💬', bg: '#dcfce7', grad: '#16a34a,#14532d', title: 'رابط واتساب مباشر', h1: 'رابط واتساب مباشر بدون حفظ الرقم 💬',
  sub: 'اكتب الرقم ورسالتك واحصل على رابط يفتح المحادثة فوراً، دون إضافة الرقم إلى جهات الاتصال',
  desc: 'أنشئ رابط واتساب مباشر (wa.me) برقم ورسالة جاهزة، وافتح المحادثة دون حفظ الرقم. مناسب للمتاجر وبطاقات الأعمال وبايو إنستغرام.',
  kw: 'رابط واتساب مباشر, مراسلة واتساب بدون حفظ الرقم, wa.me, انشاء رابط واتساب, رابط محادثة واتساب',
  search: 'رابط واتساب مباشر بدون حفظ الرقم wa.me مراسلة رقم whatsapp link رسالة جاهزة',
  cardDesc: 'افتح محادثة واتساب بدون حفظ الرقم وأنشئ رابطاً جاهزاً', cat: 'productivity',
  faq: [
    ['كيف أراسل رقماً على واتساب بدون حفظه؟', 'اكتب الرقم مع رمز الدولة هنا، ثم اضغط "فتح المحادثة" أو انسخ الرابط. يفتح الرابط المحادثة مباشرة في واتساب.'],
    ['ما صيغة الرابط؟', 'الصيغة الرسمية: https://wa.me/ثم الرقم الدولي بدون صفر أو علامة +، ويمكن إضافة ?text= متبوعة بنص الرسالة.'],
    ['هل أكتب الصفر في أول الرقم؟', 'لا، تحذفه الأداة تلقائياً. فالرقم 0791234567 مع رمز الأردن يصبح 962791234567.'],
    ['هل تُحفظ أرقامي أو رسائلي؟', 'لا، كل شيء يتم في متصفحك ولا يُرسل إلى أي خادم.'],
    ['أين أستخدم الرابط؟', 'في بايو إنستغرام، وبطاقات الأعمال، ومنشورات المتاجر، وQR، وأي مكان تريد أن يراسلك الناس منه بضغطة واحدة.']
  ],
  how: ['يُحذف الصفر من بداية الرقم ويُضاف رمز الدولة.', 'إن بدأ الرقم بـ + أو 00 اعتُبر دولياً كاملاً وتجاهلت الأداة قائمة الدول.', 'يُشفَّر نص الرسالة بصيغة URL ويُضاف بعد ?text=.'],
  rel: [['qr-generator.html', '📱 مولّد QR'], ['jo/tools/name-decorator/', '✨ زخرفة الأسماء'], ['jo/tools/tafqeet/', '✍️ تفقيط المبلغ']],
  main: CSS + String.raw`
    <label class="pt-lbl" for="waCc">الدولة</label>
    <select class="pt-in" id="waCc"></select>
    <label class="pt-lbl" for="waNum">رقم الهاتف</label>
    <input class="pt-in" id="waNum" type="text" inputmode="tel" autocomplete="off" placeholder="مثال: 0791234567" dir="ltr" style="text-align:right;">
    <label class="pt-lbl" for="waMsg">رسالة جاهزة (اختياري)</label>
    <textarea class="pt-in" id="waMsg" rows="3" maxlength="500" placeholder="مثال: مرحباً، أريد الاستفسار عن المنتج"></textarea>
    <div class="pt-out" id="waOut" dir="ltr" style="text-align:left;font-size:14px;" aria-live="polite">سيظهر الرابط هنا.</div>
    <div class="pt-row" style="margin-top:12px;">
      <button type="button" class="pt-btn" id="waOpen">💬 فتح المحادثة</button>
      <button type="button" class="pt-btn2" id="waCopy">📋 نسخ الرابط</button>
    </div>
    <div class="pt-note" id="waMsgNote">🔒 لا يُرسل الرقم ولا الرسالة إلى أي خادم، الرابط يُبنى في متصفحك.</div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };` + copyFn + String.raw`
  var C = [['962', 'الأردن'], ['966', 'السعودية'], ['971', 'الإمارات'], ['968', 'عُمان'], ['965', 'الكويت'], ['974', 'قطر'], ['973', 'البحرين'], ['20', 'مصر'], ['964', 'العراق'], ['963', 'سوريا'], ['961', 'لبنان'], ['970', 'فلسطين'], ['967', 'اليمن'], ['218', 'ليبيا'], ['216', 'تونس'], ['213', 'الجزائر'], ['212', 'المغرب'], ['249', 'السودان'], ['90', 'تركيا'], ['44', 'بريطانيا'], ['1', 'أمريكا وكندا'], ['49', 'ألمانيا'], ['33', 'فرنسا'], ['91', 'الهند'], ['92', 'باكستان'], ['880', 'بنغلاديش'], ['63', 'الفلبين']];
  var sel = $('waCc');
  C.forEach(function (c) { var o = document.createElement('option'); o.value = c[0]; o.textContent = c[1] + ' (+' + c[0] + ')'; sel.appendChild(o); });
  try { var l = localStorage.getItem('adawati_wa_cc'); if (l) sel.value = l; } catch (e) {}
  function build() {
    var raw = normDigits($('waNum').value).trim(), intl = /^(\+|00)/.test(raw), d = raw.replace(/\D/g, '');
    if (!d) return null;
    if (/^00/.test(raw)) d = d.replace(/^00/, '');
    else if (!intl) { d = d.replace(/^0+/, ''); if (d.indexOf(sel.value) !== 0 || d.length < 11) d = sel.value + d; }
    if (d.length < 8 || d.length > 15) return { err: 'الرقم غير صحيح. تأكد من عدد الخانات.' };
    var m = $('waMsg').value.trim(), u = 'https://wa.me/' + d;
    if (m) u += '?text=' + encodeURIComponent(m);
    return { url: u };
  }
  function note(t) { $('waMsgNote').textContent = t; }
  function run() {
    var r = build();
    $('waOut').textContent = !r ? 'سيظهر الرابط هنا.' : (r.err || r.url);
    $('waOut').style.color = r && r.err ? '#dc2626' : '';
  }
  ['input', 'change'].forEach(function (e) { $('waNum').addEventListener(e, run); $('waMsg').addEventListener(e, run); sel.addEventListener(e, run); });
  sel.addEventListener('change', function () { try { localStorage.setItem('adawati_wa_cc', sel.value); } catch (e) {} });
  $('waCopy').addEventListener('click', function () { var r = build(); if (!r || !r.url) { note('اكتب رقماً صحيحاً أولاً.'); return; } copyText(r.url, function (ok) { note(ok ? '✓ تم نسخ الرابط.' : 'تعذّر النسخ تلقائياً.'); }); });
  $('waOpen').addEventListener('click', function () { var r = build(); if (!r || !r.url) { note('اكتب رقماً صحيحاً أولاً.'); return; } window.open(r.url, '_blank', 'noopener'); });
  run();
})();
`
};

const DECOR = {
  icon: '✨', bg: '#fae8ff', grad: '#c026d3,#4a044e', title: 'زخرفة الأسماء والنصوص', h1: 'زخرفة الأسماء والنصوص ✨',
  sub: 'اكتب اسمك بالعربية أو الإنجليزية واحصل على عشرات الزخارف الجاهزة للنسخ إلى إنستغرام وببجي وفري فاير وتيك توك',
  desc: 'زخرفة الأسماء بالعربي والإنجليزي: عشرات الأشكال الجاهزة للنسخ لحسابات إنستغرام وتيك توك وببجي وفري فاير وواتساب، مجاناً وبضغطة واحدة.',
  kw: 'زخرفة الاسماء, زخرفة اسم, زخرفة عربي, زخرفة انستقرام, زخرفة ببجي, زخرفة فري فاير, خطوط مزخرفة',
  search: 'زخرفة الأسماء زخرفة عربي انجليزي انستقرام ببجي فري فاير تيك توك خطوط مزخرفة اسماء مزخرفة',
  cardDesc: 'عشرات الزخارف الجاهزة لاسمك بالعربي والإنجليزي', cat: 'productivity',
  faq: [
    ['كيف أزخرف اسمي؟', 'اكتب الاسم في الخانة، فتظهر الزخارف مباشرة. اضغط "نسخ" بجانب الشكل الذي يعجبك ثم الصقه في خانة الاسم داخل التطبيق.'],
    ['هل تعمل الزخرفة في ببجي وفري فاير؟', 'تعتمد على اللعبة. كثير من الألعاب تقبل الرموز والحروف الخاصة، وبعضها يرفضها. جرّب أكثر من شكل.'],
    ['لماذا تختلف زخارف العربي عن الإنجليزي؟', 'الحروف الإنجليزية لها أشكال يونيكود جاهزة (مائل وغامق ومزخرف). أما العربية فتُزخرف بالتطويل والتشكيل والرموز حول الاسم.'],
    ['هل يمكن أن يظهر الاسم مربعات في بعض الأجهزة؟', 'نادراً. إن ظهر مربع فجهازك لا يدعم ذلك الرمز، اختر شكلاً آخر.'],
    ['هل تُحفظ أسماؤنا؟', 'لا، كل شيء يتم في متصفحك.']
  ],
  how: ['العربية: نضيف التطويل (ـ) بين الحروف المتصلة، ونضع رموزاً وأقواساً زخرفية حول الاسم.', 'الإنجليزية: نستبدل كل حرف بما يقابله في حروف يونيكود الرياضية والدائرية.', 'كل شكل نص عادي يمكن نسخه ولصقه في أي مكان.'],
  rel: [['jo/tools/whatsapp-link/', '💬 رابط واتساب مباشر'], ['word-counter.html', '📝 عدّاد الكلمات'], ['qr-generator.html', '📱 مولّد QR']],
  main: CSS + String.raw`
    <style>
      .dc-item{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border);}
      .dc-item:last-child{border-bottom:none;}
      .dc-t{flex:1;font-size:19px;line-height:1.7;word-break:break-word;min-width:0;}
    </style>
    <label class="pt-lbl" for="dcIn">اكتب الاسم أو النص</label>
    <input class="pt-in" id="dcIn" type="text" maxlength="40" autocomplete="off" placeholder="مثال: محمد  أو  Ahmad" value="">
    <div class="pt-note" id="dcMsg">اكتب اسمك لتظهر الزخارف.</div>
    <div id="dcList" style="margin-top:8px;"></div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };` + copyFn + String.raw`
  var NC = 'ادذرزوءأإؤآى ';
  function tatweel(s, mark) {
    var out = '', ch = Array.from(s);
    for (var i = 0; i < ch.length; i++) {
      out += ch[i];
      var nx = ch[i + 1];
      if (nx && /[ء-ي]/.test(ch[i]) && /[ء-ي]/.test(nx) && NC.indexOf(ch[i]) < 0) out += (mark || '') + 'ـ';
    }
    return out;
  }
  function joinWith(s, sep) { return Array.from(s).filter(function (c) { return c !== ' '; }).join(sep); }
  function mapStyle(s, up, lo, ex) {
    return Array.from(s).map(function (c) {
      if (ex && ex[c]) return ex[c];
      var k = c.charCodeAt(0);
      if (k >= 65 && k <= 90 && up !== null) return String.fromCodePoint(up + k - 65);
      if (k >= 97 && k <= 122 && lo !== null) return String.fromCodePoint(lo + k - 97);
      return c;
    }).join('');
  }
  var SMALLCAPS = { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' };
  function fullw(s) { return Array.from(s).map(function (c) { var k = c.charCodeAt(0); return k >= 33 && k <= 126 ? String.fromCharCode(k + 65248) : c; }).join(''); }
  var LAT = [
    ['غامق', function (s) { return mapStyle(s, 0x1D400, 0x1D41A); }],
    ['مائل', function (s) { return mapStyle(s, 0x1D434, 0x1D44E, { h: 'ℎ' }); }],
    ['غامق مائل', function (s) { return mapStyle(s, 0x1D468, 0x1D482); }],
    ['خط يدوي', function (s) { return mapStyle(s, 0x1D49C, 0x1D4B6, { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' }); }],
    ['خط يدوي غامق', function (s) { return mapStyle(s, 0x1D4D0, 0x1D4EA); }],
    ['قوطي', function (s) { return mapStyle(s, 0x1D504, 0x1D51E, { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' }); }],
    ['قوطي غامق', function (s) { return mapStyle(s, 0x1D56C, 0x1D586); }],
    ['مزدوج', function (s) { return mapStyle(s, 0x1D538, 0x1D552, { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' }); }],
    ['بسيط غامق', function (s) { return mapStyle(s, 0x1D5D4, 0x1D5EE); }],
    ['بسيط مائل', function (s) { return mapStyle(s, 0x1D608, 0x1D622); }],
    ['آلة كاتبة', function (s) { return mapStyle(s, 0x1D670, 0x1D68A); }],
    ['دوائر', function (s) { return mapStyle(s, 0x24B6, 0x24D0); }],
    ['دوائر سوداء', function (s) { return mapStyle(s.toUpperCase(), 0x1F150, null); }],
    ['مربعات', function (s) { return mapStyle(s.toUpperCase(), 0x1F130, null); }],
    ['كابيتال صغير', function (s) { return Array.from(s.toLowerCase()).map(function (c) { return SMALLCAPS[c] || c; }).join(''); }],
    ['عريض', function (s) { return fullw(s); }],
    ['متباعد', function (s) { return joinWith(s, ' '); }]
  ];
  var FR = [
    ['꧁', '꧂'], ['『', '』'], ['【', '】'], ['★彡 ', ' 彡★'], ['✿ ', ' ✿'], ['♛ ', ' ♛'], ['❖ ', ' ❖'], ['ღ ', ' ღ'], ['⚜ ', ' ⚜'], ['♡ ', ' ♡'],
    ['━━━ ', ' ━━━'], ['░▒▓ ', ' ▓▒░'], ['☆ ', ' ☆'], ['✧･ﾟ: * ', ' * :･ﾟ✧'], ['⫷ ', ' ⫸'], ['【★】 ', ' 【★】'], ['⟦ ', ' ⟧'], ['» ', ' «'], ['۞ ', ' ۞']
  ];
  function arAll(s) {
    var o = [];
    o.push(['تطويل', tatweel(s)]);
    o.push(['تطويل مع فتحة', tatweel(s, 'َ')]);
    o.push(['تطويل مع ضمة', tatweel(s, 'ُ')]);
    o.push(['تطويل مع كسرة', tatweel(s, 'ِ')]);
    o.push(['بينها نقاط', joinWith(s, '.')]);
    o.push(['بينها قلوب', joinWith(s, '♡')]);
    o.push(['بينها نجوم', joinWith(s, '✦')]);
    var t = tatweel(s);
    FR.forEach(function (f) { o.push(['إطار', f[0] + t + f[1]]); });
    o.push(['بين وردتين', '❀ ' + s + ' ❀']);
    return o;
  }
  function enAll(s) {
    var o = [];
    LAT.forEach(function (x) { o.push([x[0], x[1](s)]); });
    var b = LAT[0][1](s);
    FR.slice(0, 12).forEach(function (f) { o.push(['إطار', f[0] + b + f[1]]); });
    return o;
  }
  function msg(t) { $('dcMsg').textContent = t; }
  function run() {
    var s = $('dcIn').value.replace(/\s+/g, ' ').trim(), L = $('dcList');
    if (!s) { L.innerHTML = ''; msg('اكتب اسمك لتظهر الزخارف.'); return; }
    var ar = /[؀-ۿ]/.test(s), list = ar ? arAll(s) : enAll(s);
    L.innerHTML = '';
    list.forEach(function (x) {
      var d = document.createElement('div'); d.className = 'dc-item';
      var t = document.createElement('div'); t.className = 'dc-t'; t.textContent = x[1];
      var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-btn2'; b.textContent = 'نسخ';
      b.addEventListener('click', function () { copyText(x[1], function (ok) { msg(ok ? '✓ تم النسخ، الصقه في خانة الاسم.' : 'تعذّر النسخ، حدّد النص وانسخه.'); }); });
      d.appendChild(t); d.appendChild(b); L.appendChild(d);
    });
    msg(ar ? 'زخارف عربية: ' + list.length + ' شكلاً.' : 'زخارف إنجليزية: ' + list.length + ' شكلاً.');
  }
  $('dcIn').addEventListener('input', run);
  run();
})();
`
};

module.exports = { 'tafqeet': TAFQEET, 'whatsapp-link': WALINK, 'name-decorator': DECOR };
