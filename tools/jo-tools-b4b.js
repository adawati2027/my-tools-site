// Batch 4b game-style jo tools: cv-builder, typing-speed, invoice-generator. Merged into GAMES by build-jo-tool.js.
const CSS = String.raw`
    <style>
      .pt-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
      .pt-in{width:100%;padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;min-width:0;}
      .pt-lbl{display:block;font-size:13px;font-weight:700;margin:12px 0 5px;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;}
      .pt-btn2{padding:9px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:13px;cursor:pointer;}
      .pt-btn2.on{background:#2563eb;color:#fff;border-color:#2563eb;}
      .pt-note{font-size:12px;color:var(--text-muted);margin-top:10px;min-height:18px;line-height:1.7;}
      .pt-box{border:1px solid var(--border);border-radius:12px;padding:12px;margin-top:10px;background:var(--surface-2);}
      .pt-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
      @media (max-width:560px){.pt-grid2{grid-template-columns:1fr;}}
    </style>`;

const PRINT = function (id) {
  return '@media print{body *{visibility:hidden!important}#' + id + ',#' + id + ' *{visibility:visible!important}#' + id + '{position:absolute!important;left:0;top:0;width:100%!important;max-width:none!important;margin:0!important;box-shadow:none!important;border:none!important}@page{size:A4;margin:12mm}}';
};

const CV = {
  icon: '📄', bg: '#e0e7ff', grad: '#4338ca,#1e1b4b', title: 'منشئ السيرة الذاتية', h1: 'منشئ السيرة الذاتية (CV) 📄',
  sub: 'املأ بياناتك وشاهد السيرة تتشكل أمامك، ثم احفظها PDF جاهزاً للإرسال. بالعربية أو الإنجليزية',
  desc: 'منشئ سيرة ذاتية مجاني بالعربية والإنجليزية: قالبان أنيقان، معاينة مباشرة، وحفظ PDF بضغطة. بياناتك تبقى في متصفحك ولا تُرسل لأي خادم.',
  kw: 'سيرة ذاتية, عمل سيرة ذاتية, منشئ سيرة ذاتية, CV, نموذج سيرة ذاتية, سيرة ذاتية PDF, سيرة ذاتية بالعربي',
  search: 'سيرة ذاتية cv عمل سيرة ذاتية نموذج سيرة ذاتية pdf وظيفة خريج',
  cardDesc: 'اصنع سيرتك الذاتية بالعربي أو الإنجليزي واحفظها PDF', cat: 'productivity',
  faq: [
    ['كيف أحفظ السيرة الذاتية كملف PDF؟', 'اضغط "حفظ PDF / طباعة" ثم اختر "حفظ كملف PDF" كوجهة الطباعة في نافذة المتصفح.'],
    ['هل بياناتي آمنة؟', 'نعم، لا تغادر بياناتك جهازك. تُحفظ في متصفحك فقط حتى تعود إليها، ويمكنك مسحها بزر "مسح كل شيء".'],
    ['هل أضيف صورتي الشخصية؟', 'لا تضع القوالب صورة عمداً، فأغلب أنظمة التوظيف الآلية تقرأ النص فقط وتفضّل السيرة بلا صورة.'],
    ['كم صفحة يجب أن تكون السيرة؟', 'يفضّل صفحة واحدة لحديثي التخرج وصفحتان كحد أقصى لأصحاب الخبرة. اكتب الأهم أولاً.'],
    ['هل يمكنني كتابة سيرة إنجليزية؟', 'نعم، بدّل اللغة إلى English فتتغير العناوين والاتجاه، واكتب بياناتك بالإنجليزية.']
  ],
  how: ['أدخل بياناتك في الأقسام؛ تظهر المعاينة فورا.', 'اختر القالب واللون واللغة.', 'أضف خبراتك وتعليمك بأحدث ما عندك أولاً.', 'احفظ PDF من نافذة الطباعة.'],
  rel: [['jo/students/what-can-i-study/', '🎓 ماذا أدرس؟'], ['jo/tools/job-offer-compare/', '⚖️ أي عرض وظيفي أفضل'], ['jo/tools/hourly-wage/', '⏱️ قيمة ساعة عملك']],
  main: CSS + '<style>' + PRINT('cvPrev') + String.raw`
      .cvp{background:#fff;color:#111;border:1px solid #d1d5db;border-radius:6px;padding:28px;margin-top:16px;max-width:794px;margin-inline:auto;line-height:1.6;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,.08);box-sizing:border-box;}
      .cvp h2.cvh{font-size:15px;margin:16px 0 6px;padding-bottom:3px;border-bottom:2px solid var(--ac);color:var(--ac);}
      .cvp .nm{font-size:26px;font-weight:800;line-height:1.3;}
      .cvp .jt{font-size:15px;color:#444;margin-top:2px;}
      .cvp .ct{font-size:12.5px;color:#444;margin-top:6px;}
      .cvp .it{margin-top:8px;} .cvp .it b{font-size:14px;} .cvp .it .pd{font-size:12px;color:#555;} .cvp .it p{margin:3px 0 0;white-space:pre-wrap;}
      .cvp.mod{display:flex;gap:0;padding:0;overflow:hidden;}
      .cvp.mod .sd{width:32%;background:var(--ac);color:#fff;padding:22px 16px;box-sizing:border-box;}
      .cvp.mod .sd h2.cvh{color:#fff;border-bottom-color:rgba(255,255,255,.5);}
      .cvp.mod .sd .ct,.cvp.mod .sd .ln{color:#fff;font-size:12.5px;word-break:break-word;margin-top:4px;}
      .cvp.mod .mn{flex:1;padding:22px 20px;min-width:0;box-sizing:border-box;}
      .cvp .sk{display:inline-block;background:#eef2ff;border-radius:4px;padding:1px 8px;margin:2px;font-size:12.5px;}
      .cvp.mod .sd .sk{background:rgba(255,255,255,.2);}
      @media (max-width:560px){.cvp{padding:16px;} .cvp.mod{flex-direction:column;} .cvp.mod .sd{width:100%;}}
    </style>
    <div class="pt-row">
      <span id="cvLblLay" style="font-size:13px;font-weight:700;">القالب:</span>
      <button type="button" class="pt-btn2 on" data-lay="classic">كلاسيكي</button>
      <button type="button" class="pt-btn2" data-lay="mod">عصري</button>
      <span id="cvLblLang" style="font-size:13px;font-weight:700;margin-inline-start:8px;">اللغة:</span>
      <button type="button" class="pt-btn2 on" data-dir="ar">العربية</button>
      <button type="button" class="pt-btn2" data-dir="en">English</button>
      <input type="color" id="cvCol" value="#1d4ed8" aria-label="اللون" style="width:38px;height:34px;border:none;background:none;cursor:pointer;">
    </div>
    <div class="pt-grid2">
      <div><label class="pt-lbl" for="cvName">الاسم الكامل</label><input class="pt-in" id="cvName" maxlength="60" autocomplete="off"></div>
      <div><label class="pt-lbl" for="cvTitle">المسمى الوظيفي</label><input class="pt-in" id="cvTitle" maxlength="60" autocomplete="off"></div>
      <div><label class="pt-lbl" for="cvPhone">الهاتف</label><input class="pt-in" id="cvPhone" maxlength="30" dir="ltr" style="text-align:right;" autocomplete="off"></div>
      <div><label class="pt-lbl" for="cvEmail">البريد الإلكتروني</label><input class="pt-in" id="cvEmail" maxlength="60" dir="ltr" style="text-align:right;" autocomplete="off"></div>
    </div>
    <label class="pt-lbl" for="cvCity">المدينة / الدولة</label><input class="pt-in" id="cvCity" maxlength="60" autocomplete="off">
    <label class="pt-lbl" for="cvSum">نبذة مهنية (٢ إلى ٣ أسطر)</label><textarea class="pt-in" id="cvSum" rows="3" maxlength="500"></textarea>
    <div class="pt-grid2" style="margin-top:8px;"><input class="pt-in" id="cvAiField" maxlength="80" placeholder="مجال عملك (مثال: محاسبة، تسويق، برمجة)"><input class="pt-in" id="cvAiYears" maxlength="10" inputmode="numeric" placeholder="سنوات الخبرة (اختياري)"></div>
    <button type="button" class="pt-btn2" id="cvAiBtn" style="margin-top:8px;">✨ اكتب لي النبذة بالذكاء الاصطناعي</button><div class="pt-note" id="cvAiMsg" style="margin-top:6px;" hidden></div>
    <div class="pt-lbl" id="cvLblExp">الخبرات العملية</div><div id="cvExpL"></div><button type="button" class="pt-btn2" id="cvExpAdd">+ إضافة خبرة</button>
    <div class="pt-lbl" id="cvLblEdu">التعليم</div><div id="cvEduL"></div><button type="button" class="pt-btn2" id="cvEduAdd">+ إضافة مؤهل</button>
    <label class="pt-lbl" for="cvSk">المهارات (افصل بينها بفاصلة)</label><textarea class="pt-in" id="cvSk" rows="2" maxlength="400"></textarea>
    <div class="pt-lbl" id="cvLblLg">اللغات</div><div id="cvLgBox"></div>
    <div class="pt-row" style="margin-top:16px;">
      <button type="button" class="pt-btn" id="cvPrint">📄 حفظ PDF / طباعة</button>
      <button type="button" class="pt-btn2" id="cvClear">🗑 مسح كل شيء</button>
    </div>
    <div class="pt-note" id="cvMsg">🔒 بياناتك تبقى في متصفحك ولا تُرسل إلى أي خادم.</div>
    <datalist id="cvUni"></datalist>
    <div class="cvp" id="cvPrev"></div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_cv_v1';
  var S = { lay: 'classic', dir: 'ar', col: '#1d4ed8', name: '', title: '', phone: '', email: '', city: '', sum: '', sk: '', lg: '', exp: [], edu: [] };
  try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.exp) S = Object.assign(S, r); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var LB = { ar: { sum: 'نبذة مهنية', exp: 'الخبرات العملية', edu: 'التعليم', sk: 'المهارات', lg: 'اللغات', ct: 'التواصل' }, en: { sum: 'Summary', exp: 'Experience', edu: 'Education', sk: 'Skills', lg: 'Languages', ct: 'Contact' } };

  var LV = {
    ar: { tj: 'التوجيهي (الثانوية العامة)', dip: 'دبلوم', bach: 'بكالوريوس', hd: 'دبلوم عالٍ', mast: 'ماجستير', phd: 'دكتوراه' },
    en: { tj: 'Tawjihi (General Secondary Certificate)', dip: 'Diploma', bach: "Bachelor's Degree", hd: 'Higher Diploma', mast: "Master's Degree", phd: 'PhD' }
  };
  var UNI = {
    ar: ['الجامعة الأردنية', 'جامعة العلوم والتكنولوجيا الأردنية', 'جامعة اليرموك', 'جامعة مؤتة', 'الجامعة الهاشمية', 'جامعة آل البيت', 'جامعة الحسين بن طلال', 'جامعة البلقاء التطبيقية', 'جامعة الطفيلة التقنية', 'الجامعة الألمانية الأردنية', 'جامعة الأميرة سمية للتكنولوجيا', 'جامعة فيلادلفيا', 'جامعة الزيتونة الأردنية', 'جامعة عمّان الأهلية', 'جامعة عمّان العربية', 'جامعة الإسراء', 'جامعة جرش', 'جامعة جدارا', 'جامعة الشرق الأوسط', 'جامعة العلوم التطبيقية الخاصة', 'جامعة البترا', 'جامعة الزرقاء', 'جامعة إربد الأهلية', 'جامعة عجلون الوطنية', 'الجامعة الأمريكية في مادبا', 'جامعة الحسين التقنية'],
    en: ['The University of Jordan', 'Jordan University of Science and Technology', 'Yarmouk University', 'Mutah University', 'The Hashemite University', 'Al al-Bayt University', 'Al-Hussein Bin Talal University', 'Al-Balqa Applied University', 'Tafila Technical University', 'German Jordanian University', 'Princess Sumaya University for Technology', 'Philadelphia University', 'Al-Zaytoonah University of Jordan', 'Al-Ahliyya Amman University', 'Amman Arab University', 'Isra University', 'Jerash University', 'Jadara University', 'Middle East University', 'Applied Science Private University', 'Petra University', 'Zarqa University', 'Irbid National University', 'Ajloun National University', 'American University of Madaba', 'Al-Hussein Technical University']
  };
  var UI = {
    ar: {
      t: { '#cvLblLay': 'القالب:', '[data-lay=classic]': 'كلاسيكي', '[data-lay=mod]': 'عصري', '#cvLblLang': 'اللغة:', 'label[for=cvName]': 'الاسم الكامل', 'label[for=cvTitle]': 'المسمى الوظيفي', 'label[for=cvPhone]': 'الهاتف', 'label[for=cvEmail]': 'البريد الإلكتروني', 'label[for=cvCity]': 'المدينة / الدولة', 'label[for=cvSum]': 'نبذة مهنية (٢ إلى ٣ أسطر)', '#cvLblExp': 'الخبرات العملية', '#cvLblEdu': 'التعليم', 'label[for=cvSk]': 'المهارات (افصل بينها بفاصلة)', '#cvLblLg': 'اللغات', '#cvExpAdd': '+ إضافة خبرة', '#cvEduAdd': '+ إضافة مؤهل', '#cvAiBtn': '✨ اكتب لي النبذة بالذكاء الاصطناعي', '#cvPrint': '📄 حفظ PDF / طباعة', '#cvClear': '🗑 مسح كل شيء', '#cvMsg': '🔒 بياناتك تبقى في متصفحك ولا تُرسل إلى أي خادم.' },
      p: { '#cvAiField': 'مجال عملك (مثال: محاسبة، تسويق، برمجة)', '#cvAiYears': 'سنوات الخبرة (اختياري)' },
      pe: ['المسمى الوظيفي', 'الشركة', 'الفترة (مثال: 2022 - 2024)'], pd: ['التخصص (مثال: هندسة حاسوب)', 'الجامعة أو المدرسة', 'السنة'],
      lgo: 'لغة أخرى (اكتبها)', lga: 'إضافة', desc: 'وصف مختصر (اختياري)', del: 'حذف', lvl: '— المستوى الدراسي —', clr: 'هل تريد مسح كل البيانات؟'
    },
    en: {
      t: { '#cvLblLay': 'Template:', '[data-lay=classic]': 'Classic', '[data-lay=mod]': 'Modern', '#cvLblLang': 'Language:', 'label[for=cvName]': 'Full name', 'label[for=cvTitle]': 'Job title', 'label[for=cvPhone]': 'Phone', 'label[for=cvEmail]': 'Email', 'label[for=cvCity]': 'City / Country', 'label[for=cvSum]': 'Professional summary (2-3 lines)', '#cvLblExp': 'Work experience', '#cvLblEdu': 'Education', 'label[for=cvSk]': 'Skills (separate with commas)', '#cvLblLg': 'Languages', '#cvExpAdd': '+ Add experience', '#cvEduAdd': '+ Add education', '#cvAiBtn': '✨ Write my summary with AI', '#cvPrint': '📄 Save PDF / Print', '#cvClear': '🗑 Clear everything', '#cvMsg': '🔒 Your data stays in your browser and is never sent to any server.' },
      p: { '#cvAiField': 'Your field (e.g. accounting, marketing, software)', '#cvAiYears': 'Years of experience (optional)' },
      pe: ['Job title', 'Company', 'Period (e.g. 2022 - 2024)'], pd: ['Major / Field (e.g. Computer Engineering)', 'University or school', 'Year'],
      lgo: 'Other language (type it)', lga: 'Add', desc: 'Short description (optional)', del: 'Delete', lvl: '- Education level -', clr: 'Clear all data?'
    }
  };
  function ui() {
    var u = UI[S.dir];
    Object.keys(u.t).forEach(function (q) {
      var e = document.querySelector(q); if (!e) return;
      if ((q === '#cvPrint' && (e._blob || e.disabled)) || (q === '#cvAiBtn' && e.disabled)) return;
      e.textContent = u.t[q];
    });
    Object.keys(u.p).forEach(function (q) { var e = document.querySelector(q); if (e) e.placeholder = u.p[q]; });
    var dl = $('cvUni'); dl.innerHTML = '';
    UNI[S.dir].forEach(function (n) { var o = document.createElement('option'); o.value = n; dl.appendChild(o); });
    refreshRows();
  }
  var LGS = [['ar', 'العربية', 'Arabic'], ['en', 'الإنجليزية', 'English'], ['fr', 'الفرنسية', 'French'], ['de', 'الألمانية', 'German'], ['es', 'الإسبانية', 'Spanish'], ['tr', 'التركية', 'Turkish'], ['ru', 'الروسية', 'Russian'], ['it', 'الإيطالية', 'Italian'], ['zh', 'الصينية', 'Chinese']];
  function lgToks() { return String(S.lg || '').split(/[,،\n]/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function lgName(t) { if (t.charAt(0) === '#') { for (var i = 0; i < LGS.length; i++) if (LGS[i][0] === t.slice(1)) return LGS[i][S.dir === 'en' ? 2 : 1]; } return t; }
  function lgSet(a) { S.lg = a.join(','); upd(); lgPaint(); }
  function lgPaint() {
    var b = $('cvLgBox'), U = UI[S.dir], t = lgToks(); b.innerHTML = '';
    var row = el('div', 'pt-row');
    LGS.forEach(function (l) {
      var k = '#' + l[0], on = t.indexOf(k) >= 0, btn = el('button', 'pt-btn2' + (on ? ' on' : ''), l[S.dir === 'en' ? 2 : 1]); btn.type = 'button';
      btn.addEventListener('click', function () { lgSet(on ? t.filter(function (x) { return x !== k; }) : t.concat([k])); });
      row.appendChild(btn);
    });
    t.forEach(function (x) {
      if (x.charAt(0) === '#') return;
      var btn = el('button', 'pt-btn2 on', x + ' ✕'); btn.type = 'button';
      btn.addEventListener('click', function () { lgSet(t.filter(function (y) { return y !== x; })); });
      row.appendChild(btn);
    });
    b.appendChild(row);
    var r2 = el('div', 'pt-row'); r2.style.marginTop = '8px';
    var inp = el('input', 'pt-in'); inp.maxLength = 30; inp.placeholder = U.lgo; inp.style.flex = '1'; inp.style.width = 'auto';
    var ad = el('button', 'pt-btn2', U.lga); ad.type = 'button';
    function add() { var v = inp.value.replace(/[,،#]/g, ' ').trim(); if (!v || t.length >= 12) return; lgSet(t.concat([v])); }
    ad.addEventListener('click', add); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    r2.appendChild(inp); r2.appendChild(ad); b.appendChild(r2);
  }
  function refreshRows() { lgPaint(); rows('exp', 'cvExpL', UI[S.dir].pe); rows('edu', 'cvEduL', UI[S.dir].pd); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function list(s) { return String(s || '').split(/[,،\n]/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function items(arr, a, b, c) {
    var w = document.createElement('div');
    arr.forEach(function (x) {
      if (!x[a] && !x[b]) return;
      var d = el('div', 'it'); d.appendChild(el('b', '', x[a] || ''));
      var sub = [x[b], x[c]].filter(Boolean).join(' · ');
      if (sub) d.appendChild(el('div', 'pd', sub));
      if (x.d) d.appendChild(el('p', '', x.d));
      w.appendChild(d);
    });
    return w.children.length ? w : null;
  }
  function sec(t) { return el('h2', 'cvh', t); }
  function render() {
    var P = $('cvPrev'), L = LB[S.dir];
    P.innerHTML = ''; P.dir = S.dir === 'ar' ? 'rtl' : 'ltr'; P.className = 'cvp' + (S.lay === 'mod' ? ' mod' : '');
    P.style.setProperty('--ac', S.col);
    var head = document.createElement('div');
    head.appendChild(el('div', 'nm', S.name || (S.dir === 'ar' ? 'الاسم الكامل' : 'Full Name')));
    if (S.title) head.appendChild(el('div', 'jt', S.title));
    var contact = [S.phone, S.email, S.city].filter(Boolean);
    var sums = S.sum ? [sec(L.sum), el('div', '', S.sum)] : [];
    var exp = items(S.exp, 't', 'c', 'p'), edu = items(S.edu.map(function (x) { return Object.assign({}, x, { t: [LV[S.dir][x.lv], x.t].filter(Boolean).join(' — ') }); }), 't', 'c', 'p');
    var sk = list(S.sk), lg = lgToks().map(lgName);
    function chips(a) { var w = document.createElement('div'); a.forEach(function (x) { w.appendChild(el('span', 'sk', x)); }); return w; }
    if (S.lay === 'mod') {
      var sd = el('div', 'sd'), mn = el('div', 'mn');
      sd.dir = P.dir; mn.dir = P.dir;
      if (contact.length) { sd.appendChild(sec(L.ct)); contact.forEach(function (x) { sd.appendChild(el('div', 'ln', x)); }); }
      if (sk.length) { sd.appendChild(sec(L.sk)); sd.appendChild(chips(sk)); }
      if (lg.length) { sd.appendChild(sec(L.lg)); sd.appendChild(chips(lg)); }
      mn.appendChild(head); sums.forEach(function (x) { mn.appendChild(x); });
      if (exp) { mn.appendChild(sec(L.exp)); mn.appendChild(exp); }
      if (edu) { mn.appendChild(sec(L.edu)); mn.appendChild(edu); }
      P.appendChild(sd); P.appendChild(mn);
    } else {
      if (contact.length) head.appendChild(el('div', 'ct', contact.join('  |  ')));
      P.appendChild(head); sums.forEach(function (x) { P.appendChild(x); });
      if (exp) { P.appendChild(sec(L.exp)); P.appendChild(exp); }
      if (edu) { P.appendChild(sec(L.edu)); P.appendChild(edu); }
      if (sk.length) { P.appendChild(sec(L.sk)); P.appendChild(chips(sk)); }
      if (lg.length) { P.appendChild(sec(L.lg)); P.appendChild(chips(lg)); }
    }
  }
  function upd() { save(); render(); }
  var simple = { cvName: 'name', cvTitle: 'title', cvPhone: 'phone', cvEmail: 'email', cvCity: 'city', cvSum: 'sum', cvSk: 'sk' };
  Object.keys(simple).forEach(function (id) { $(id).addEventListener('input', function () { S[simple[id]] = $(id).value; upd(); }); });
  $('cvCol').addEventListener('input', function () { S.col = $('cvCol').value; upd(); });
  function rows(arrKey, boxId, ph) {
    var box = $(boxId); box.innerHTML = '';
    S[arrKey].forEach(function (x, i) {
      var d = el('div', 'pt-box'), g = el('div', 'pt-grid2'), U = UI[S.dir];
      if (arrKey === 'edu') {
        var sl = el('select', 'pt-in'); sl.style.marginBottom = '6px'; sl.setAttribute('aria-label', U.lvl);
        var o0 = el('option', '', U.lvl); o0.value = ''; sl.appendChild(o0);
        Object.keys(LV[S.dir]).forEach(function (k) { var o = el('option', '', LV[S.dir][k]); o.value = k; sl.appendChild(o); });
        sl.value = x.lv || ''; sl.addEventListener('change', function () { x.lv = sl.value; upd(); }); d.appendChild(sl);
      }
      [['t', ph[0]], ['c', ph[1]], ['p', ph[2]]].forEach(function (f) {
        var inp = el('input', 'pt-in'); inp.placeholder = f[1]; inp.value = x[f[0]] || ''; inp.maxLength = 80; inp.setAttribute('aria-label', f[1]);
        if (arrKey === 'edu' && f[0] === 'c') inp.setAttribute('list', 'cvUni');
        inp.addEventListener('input', function () { x[f[0]] = inp.value; upd(); }); g.appendChild(inp);
      });
      var ta = el('textarea', 'pt-in'); ta.rows = 2; ta.maxLength = 400; ta.placeholder = U.desc; ta.value = x.d || '';
      ta.addEventListener('input', function () { x.d = ta.value; upd(); });
      var rm = el('button', 'pt-btn2', U.del); rm.type = 'button'; rm.style.marginTop = '6px';
      rm.addEventListener('click', function () { S[arrKey].splice(i, 1); upd(); rows(arrKey, boxId, ph); });
      d.appendChild(g); d.appendChild(ta); d.appendChild(rm); box.appendChild(d);
    });
  }
  $('cvExpAdd').addEventListener('click', function () { if (S.exp.length >= 8) return; S.exp.push({}); upd(); refreshRows(); });
  $('cvEduAdd').addEventListener('click', function () { if (S.edu.length >= 6) return; S.edu.push({}); upd(); refreshRows(); });
  document.querySelectorAll('[data-lay]').forEach(function (b) { b.addEventListener('click', function () { S.lay = b.getAttribute('data-lay'); sync(); upd(); }); });
  document.querySelectorAll('[data-dir]').forEach(function (b) { b.addEventListener('click', function () { S.dir = b.getAttribute('data-dir'); sync(); ui(); upd(); }); });
  function sync() {
    document.querySelectorAll('[data-lay]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-lay') === S.lay); });
    document.querySelectorAll('[data-dir]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-dir') === S.dir); });
  }
    function pdfX(id, name, btn) {
    var nat = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (!nat) { window.print(); return; }
    var old = btn.textContent;
    function load(u) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
    function done() { btn.textContent = old; btn.disabled = false; }
    if (btn._blob) {
      var f0 = new File([btn._blob], name, { type: 'application/pdf' }); btn._blob = null; done();
      if (navigator.canShare && navigator.canShare({ files: [f0] })) navigator.share({ files: [f0] }).catch(function () {});
      return;
    }
    btn.textContent = '⏳'; btn.disabled = true;
    (window.html2canvas ? Promise.resolve() : load('vendor/html2canvas-1.4.1.min.js')).then(function () {
      return window.jspdf ? 0 : load('vendor/jspdf-2.5.1.umd.min.js');
    }).then(function () {
      var el = document.getElementById(id);
      return window.html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    }).then(function (cv) {
      var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
      var pw = 210, ph = 297, ratio = pw / cv.width, sliceH = Math.floor(ph / ratio), y = 0, first = true;
      while (y < cv.height) {
        var h = Math.min(sliceH, cv.height - y), c2 = document.createElement('canvas');
        c2.width = cv.width; c2.height = h;
        var cx = c2.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c2.width, h); cx.drawImage(cv, 0, y, cv.width, h, 0, 0, cv.width, h);
        if (!first) pdf.addPage();
        pdf.addImage(c2.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pw, h * ratio);
        first = false; y += h;
      }
      btn._blob = pdf.output('blob'); btn.disabled = false; btn.textContent = '📤 اضغط لحفظ الملف أو مشاركته';
    }).catch(function () { done(); alert('تعذّر إنشاء الملف. حاول مرة أخرى.'); });
  }
  $('cvPrint').addEventListener('click', function () { pdfX('cvPrev', 'cv.pdf', $('cvPrint')); });
  function aiLocal(f, y, ar) {
    var yy = parseInt(y, 10);
    if (ar) return 'متخصص في مجال ' + f + (yy > 0 ? ' بخبرة تزيد على ' + yy + (yy > 10 ? ' سنة' : yy > 2 ? ' سنوات' : yy === 2 ? ' سنتين' : ' سنة') : '') + '، أتميز بالالتزام والدقة وحسن التواصل مع الزملاء والعملاء. أسعى إلى تطوير مهاراتي باستمرار وتقديم عمل متقن يخدم أهداف المؤسسة.';
    return 'Dedicated professional in ' + f + (yy > 0 ? ' with ' + yy + '+ years of experience' : '') + ', known for reliability, attention to detail and clear communication. Committed to continuous learning and delivering quality work that supports team goals.';
  }
  $('cvAiBtn').addEventListener('click', function () {
    var f = $('cvAiField').value.trim(), y = $('cvAiYears').value.trim(), m = $('cvAiMsg'), b = $('cvAiBtn'), ar = S.dir !== 'en';
    y = y.replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; });
    if (f.length < 2) { m.hidden = false; m.textContent = ar ? 'اكتب مجال عملك أولًا.' : 'Please enter your field first.'; return; }
    var old = b.textContent; b.disabled = true; b.textContent = ar ? '⏳ جارٍ الكتابة...' : '⏳ Writing...'; m.hidden = true;
    function put(t, note) { $('cvSum').value = t; S.sum = t; upd(); b.disabled = false; b.textContent = old; if (note) { m.hidden = false; m.textContent = note; } }
    var ctl = new AbortController(), tm = setTimeout(function () { ctl.abort(); }, 20000);
    fetch('https://adawati.space/api/cv-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal, body: JSON.stringify({ field: f, years: y, title: S.title, skills: S.sk, lang: ar ? 'ar' : 'en' }) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { clearTimeout(tm); if (!j.text) throw new Error('empty'); put(j.text, ar ? 'راجع النص وعدّله بما يناسبك قبل الحفظ.' : 'Review the text and edit it before saving.'); })
      .catch(function () { clearTimeout(tm); put(aiLocal(f, y, ar), ar ? 'الكتابة الذكية غير متاحة الآن، فكتبنا لك نبذة جاهزة. عدّلها بما يناسبك.' : 'AI writing is unavailable right now, so we drafted a ready summary. Edit it to fit you.'); });
  });
  $('cvClear').addEventListener('click', function () {
    if (!window.confirm(UI[S.dir].clr)) return;
    S = { lay: S.lay, dir: S.dir, col: S.col, name: '', title: '', phone: '', email: '', city: '', sum: '', sk: '', lg: '', exp: [], edu: [] };
    fill(); upd();
  });
  function fill() {
    Object.keys(simple).forEach(function (id) { $(id).value = S[simple[id]] || ''; });
    $('cvCol').value = S.col; sync(); ui();
  }
  fill(); render();
})();
`
};

const TYPING = {
  icon: '⌨️', bg: '#fef9c3', grad: '#ca8a04,#422006', title: 'اختبار سرعة الكتابة بالعربي', h1: 'اختبار سرعة الكتابة بالعربي ⌨️',
  sub: 'اكتب الكلمات العربية قبل انتهاء الوقت، واعرف سرعتك بالكلمة في الدقيقة ودقتك',
  desc: 'اختبار سرعة الكتابة بالعربية: اعرف عدد كلماتك في الدقيقة ودقتك خلال 30 أو 60 أو 120 ثانية، وتابع أفضل نتيجة لك وشاركها مع أصدقائك.',
  kw: 'اختبار سرعة الكتابة, سرعة الكتابة بالعربي, اختبار الطباعة, كلمة في الدقيقة, تدريب على الكتابة, typing test arabic',
  search: 'اختبار سرعة الكتابة بالعربي كلمة في الدقيقة طباعة تدريب لوحة المفاتيح typing test',
  cardDesc: 'كم كلمة تكتب في الدقيقة؟ اختبر سرعتك بالعربي', cat: 'games',
  faq: [
    ['كيف تُحسب سرعة الكتابة؟', 'نحسب الحروف الصحيحة (مع المسافات) ونقسمها على 5 لتحصل على عدد الكلمات المعيارية، ثم نقسمها على الزمن بالدقائق.'],
    ['ما هي السرعة الجيدة بالعربية؟', 'المعدل العام للكتابة على لوحة المفاتيح يتراوح حول 20 إلى 30 كلمة في الدقيقة، ومن تجاوز 45 يُعد سريعاً، ومن تخطى 60 فهو محترف.'],
    ['كيف أحسّن سرعتي؟', 'تدرّب يومياً 5 دقائق، ولا تنظر إلى لوحة المفاتيح، وركّز على الدقة أولاً فالسرعة تأتي معها.'],
    ['هل تُحسب الكلمة الخاطئة؟', 'لا تُحسب الحروف في الكلمة الخاطئة ضمن سرعتك، لكنها تخفض نسبة الدقة.'],
    ['أحتاج لوحة مفاتيح عربية؟', 'نعم، فعّل التخطيط العربي على جهازك. وفي الجوال استخدم لوحة المفاتيح العربية.']
  ],
  how: ['السرعة = (الحروف الصحيحة + المسافات) ÷ 5 ÷ الزمن بالدقائق.', 'الدقة = الحروف الصحيحة ÷ كل الحروف المكتوبة.', 'يبدأ المؤقت عند أول حرف تكتبه.', 'اضغط المسافة للانتقال إلى الكلمة التالية.'],
  rel: [['kids-typing.html', '👶 تعلّم الكتابة للأطفال'], ['reaction-test.html', '⚡ اختبار ردّ الفعل'], ['jo/tools/pomodoro-timer/', '🍅 مؤقّت بومودورو']],
  main: CSS + String.raw`
    <style>
      .tp-box{margin-top:12px;padding:14px;border-radius:12px;background:var(--surface-2);height:7.8em;overflow:hidden;font-size:20px;line-height:2.1;position:relative;}
      .tp-w{display:inline-block;padding:0 5px;border-radius:5px;margin-inline-end:2px;}
      .tp-w.cur{background:#dbeafe;color:#1e3a8a;}
      .tp-w.cur.bad{background:#fecaca;color:#7f1d1d;}
      .tp-w.ok{color:#16a34a;} .tp-w.no{color:#dc2626;text-decoration:line-through;}
      .tp-stat{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;}
      .tp-stat div{flex:1;min-width:90px;text-align:center;padding:10px;border-radius:10px;background:var(--surface-2);}
      .tp-stat b{display:block;font-size:22px;}
      .tp-stat span{font-size:12px;color:var(--text-muted);}
    </style>
    <div class="pt-row"><span style="font-size:13px;font-weight:700;">المدة:</span>
      <button type="button" class="pt-btn2" data-t="30">30 ثانية</button>
      <button type="button" class="pt-btn2 on" data-t="60">60 ثانية</button>
      <button type="button" class="pt-btn2" data-t="120">120 ثانية</button>
    </div>
    <div class="tp-stat">
      <div><b id="tpTime">60</b><span>الوقت المتبقي</span></div>
      <div><b id="tpWpm">0</b><span>كلمة في الدقيقة</span></div>
      <div><b id="tpAcc">100%</b><span>الدقة</span></div>
      <div><b id="tpBest">0</b><span>أفضل نتيجة</span></div>
    </div>
    <div class="tp-box" id="tpBox" aria-label="الكلمات المطلوبة"></div>
    <input class="pt-in" id="tpIn" type="text" dir="rtl" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="ابدأ الكتابة هنا ثم اضغط المسافة بعد كل كلمة" style="margin-top:10px;font-size:18px;">
    <div class="pt-row" style="margin-top:10px;"><button type="button" class="pt-btn" id="tpAgain">🔄 نص جديد</button><button type="button" class="pt-btn2" id="tpShare" hidden>📋 نسخ النتيجة</button></div>
    <div class="pt-note" id="tpMsg">اضغط داخل الخانة وابدأ الكتابة، يبدأ الوقت مع أول حرف.</div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var SENT = [
    'الصبر مفتاح الفرج والعمل الجاد طريق النجاح', 'القراءة غذاء العقل وهي أجمل رفيق في الرحلة الطويلة', 'تشرق الشمس كل صباح وتحمل معها أملا جديدا',
    'الوقت كالسيف إن لم تقطعه قطعك', 'من جد وجد ومن زرع حصد ومن سار على الدرب وصل', 'تعلم اليوم ما سينفعك غدا ولا تؤجل عمل اليوم إلى الغد',
    'الصديق الصادق كنز لا يعوض في هذه الحياة', 'يجتمع أفراد العائلة على مائدة واحدة في المساء', 'البحر واسع والسماء صافية والنسيم عليل',
    'العلم نور والجهل ظلام فاختر لنفسك طريق النور', 'التعاون بين الناس يصنع مجتمعا قويا متماسكا', 'تحتاج الأشجار إلى الماء والشمس لكي تنمو وتثمر',
    'النجاح لا يأتي بالصدفة بل بالتخطيط والمثابرة', 'المدرسة بيت ثان نتعلم فيه القيم والمعارف', 'الأمانة والصدق من أجمل الصفات التي يتحلى بها الإنسان',
    'يسافر الناس إلى بلاد بعيدة ليتعرفوا على ثقافات جديدة', 'الرياضة تقوي الجسم وتصفي الذهن وتمنح النشاط', 'احترام الكبير والعطف على الصغير من أخلاق المجتمع الكريم',
    'الكتب نوافذ مفتوحة على عوالم لا حدود لها', 'من لا يشكر الناس لا يشكر الله فلنحرص على قول شكرا', 'الحياة مدرسة كبيرة وكل يوم فيها درس جديد',
    'اجتهد في دراستك وكن عونا لوالديك وقدوة لإخوتك', 'تنمو الزهور في الربيع وتكسو الأرض ثوبا جميلا', 'يعمل الفريق معا لإنجاز المهمة قبل نهاية الأسبوع',
    'الكلمة الطيبة صدقة وهي تفتح القلوب المغلقة', 'نشرب الماء بانتظام ونأكل الطعام الصحي ونحافظ على نومنا', 'اللغة العربية لغة جميلة غنية بالمفردات والمعاني',
    'الطريق إلى القمة يبدأ بخطوة صغيرة وإرادة كبيرة', 'يساعدنا الحاسوب في الدراسة والعمل وتنظيم الوقت', 'المطر نعمة من السماء تحيي الأرض بعد موتها',
    'الأم مدرسة إذا أعددتها أعددت شعبا طيب الأعراق', 'لا تقل لا أستطيع بل قل سأحاول وسأتعلم كيف أنجح', 'المدينة القديمة تحكي قصصا عن الماضي بين أزقتها وأبوابها'
  ];
  var KEY = 'adawati_typing_v1', BEST = {}, dur = 60, words = [], idx = 0, started = false, left = 60, timer = null, okC = 0, allC = 0, okW = 0, noW = 0, done = false;
  try { BEST = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function norm(s) { return s.replace(/[​‌‍ـ]/g, '').trim(); }
  function build() {
    words = [];
    var ss = shuffle(SENT.slice());
    for (var i = 0; i < ss.length && words.length < 260; i++) words = words.concat(ss[i].split(' '));
    var box = $('tpBox'); box.innerHTML = '';
    words.forEach(function (w, i) { var s = document.createElement('span'); s.className = 'tp-w' + (i ? '' : ' cur'); s.textContent = w; box.appendChild(s); });
    box.scrollTop = 0;
  }
  function stats() {
    var mins = Math.max((dur - left) / 60, 1 / 60), w = Math.round(okC / 5 / mins);
    $('tpWpm').textContent = started ? w : 0;
    $('tpAcc').textContent = (allC ? Math.round(okC / allC * 100) : 100) + '%';
    $('tpTime').textContent = left;
    return w;
  }
  function reset() {
    clearInterval(timer); started = false; done = false; idx = 0; okC = allC = okW = noW = 0; left = dur;
    $('tpIn').value = ''; $('tpIn').disabled = false; $('tpShare').hidden = true;
    $('tpBest').textContent = BEST[dur] || 0; build(); stats();
    $('tpMsg').textContent = 'اضغط داخل الخانة وابدأ الكتابة، يبدأ الوقت مع أول حرف.';
  }
  function level(w) { return w < 15 ? 'مبتدئ' : w < 30 ? 'متوسط' : w < 45 ? 'جيد' : w < 60 ? 'سريع' : 'محترف'; }
  function finish() {
    clearInterval(timer); done = true; $('tpIn').disabled = true;
    var w = stats();
    var nb = !BEST[dur] || w > BEST[dur];
    if (nb) { BEST[dur] = w; try { localStorage.setItem(KEY, JSON.stringify(BEST)); } catch (e) {} }
    $('tpBest').textContent = BEST[dur];
    $('tpMsg').textContent = 'انتهى الوقت: ' + w + ' كلمة في الدقيقة، مستواك ' + level(w) + '. ' + okW + ' كلمة صحيحة و' + noW + ' خاطئة.' + (nb ? ' 🎉 رقم قياسي جديد!' : '');
    $('tpShare').hidden = false;
  }
  function tick() { left--; if (left <= 0) { left = 0; stats(); finish(); } else stats(); }
  function mark(i, cls) { var s = $('tpBox').children[i]; if (s) s.className = 'tp-w ' + cls; }
  function focusCur() {
    var s = $('tpBox').children[idx]; if (!s) return;
    s.className = 'tp-w cur';
    var b = $('tpBox'); if (s.offsetTop - b.scrollTop > b.clientHeight - 50) b.scrollTop = s.offsetTop - 12;
  }
  $('tpIn').addEventListener('input', function () {
    if (done) return;
    var v = $('tpIn').value;
    if (!started && v.length) { started = true; timer = setInterval(tick, 1000); }
    var t = words[idx], cur = $('tpBox').children[idx];
    if (/\s$/.test(v) && norm(v)) {
      var typed = norm(v);
      allC += typed.length + 1;
      if (typed === t) { okC += t.length + 1; okW++; mark(idx, 'ok'); } else { noW++; mark(idx, 'no'); }
      idx++; $('tpIn').value = ''; focusCur(); stats();
      if (idx >= words.length) finish();
    } else if (cur) {
      cur.className = 'tp-w cur' + (t.indexOf(norm(v)) === 0 ? '' : ' bad');
    }
  });
  document.querySelectorAll('[data-t]').forEach(function (b) {
    b.addEventListener('click', function () {
      dur = +b.getAttribute('data-t');
      document.querySelectorAll('[data-t]').forEach(function (x) { x.classList.toggle('on', x === b); });
      reset();
    });
  });
  $('tpAgain').addEventListener('click', function () { reset(); $('tpIn').focus(); });
  $('tpShare').addEventListener('click', function () {
    var w = stats(), t = 'كتبت ' + w + ' كلمة في الدقيقة بدقة ' + $('tpAcc').textContent + ' في اختبار سرعة الكتابة بالعربي. جرّب أنت: https://adawati.space/jo/tools/typing-speed-ar/';
    function ok(v) { $('tpMsg').textContent = v ? '✓ تم نسخ النتيجة، شاركها مع أصدقائك.' : 'تعذّر النسخ تلقائياً.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { ok(true); }, function () { ok(false); });
    else ok(false);
  });
  reset();
})();
`
};

const INVOICE = {
  icon: '🧾', bg: '#ecfccb', grad: '#4d7c0f,#1a2e05', title: 'منشئ الفواتير', h1: 'منشئ الفواتير للعمل الحر 🧾',
  sub: 'أنشئ فاتورة مرتبة بالعربية أو الإنجليزية مع الضريبة والخصم، واحفظها PDF لترسلها لعميلك',
  desc: 'منشئ فواتير مجاني للعاملين لحسابهم: أضف البنود والضريبة والخصم، واحفظ الفاتورة PDF بالعربية أو الإنجليزية. بياناتك تبقى في متصفحك.',
  kw: 'منشئ فواتير, عمل فاتورة, فاتورة PDF, نموذج فاتورة, فاتورة للعمل الحر, invoice generator arabic',
  search: 'منشئ فواتير عمل فاتورة نموذج فاتورة pdf فريلانسر عمل حر invoice',
  cardDesc: 'فاتورة جاهزة بالعربي أو الإنجليزي واحفظها PDF', cat: 'money',
  faq: [
    ['كيف أحفظ الفاتورة PDF؟', 'اضغط "حفظ PDF / طباعة" ثم اختر "حفظ كملف PDF" من نافذة الطباعة.'],
    ['هل هذه فاتورة ضريبية رسمية؟', 'لا، هي نموذج فاتورة تجاري بسيط. إن كان نشاطك يلزمه نظام فوترة إلكتروني رسمي في بلدك فاعتمد ذلك النظام.'],
    ['كيف تُحسب الضريبة؟', 'الضريبة = (المجموع − الخصم) × النسبة التي تكتبها أنت. حدّد النسبة حسب نظام بلدك ونشاطك.'],
    ['هل تُحفظ بياناتي؟', 'نعم في متصفحك فقط: بيانات البائع والعملة والتفضيلات، ولا تُرسل لأي خادم.'],
    ['هل أستطيع استخدام عملة أخرى؟', 'نعم، اختر من القائمة: دينار أردني وريال سعودي ودرهم إماراتي ودولار ويورو وغيرها.']
  ],
  how: ['إجمالي البند = الكمية × السعر.', 'المجموع الفرعي = مجموع البنود.', 'الضريبة = (المجموع الفرعي − الخصم) × نسبة الضريبة.', 'الإجمالي = المجموع الفرعي − الخصم + الضريبة.'],
  rel: [['jo/tools/tafqeet/', '✍️ تفقيط المبلغ'], ['vat-calculator.html', '🧮 حاسبة VAT'], ['jo/tools/hourly-wage/', '⏱️ قيمة ساعة عملك']],
  main: CSS + '<style>' + PRINT('ivPrev') + String.raw`
      .ivp{background:#fff;color:#111;border:1px solid #d1d5db;border-radius:6px;padding:26px;margin-top:16px;max-width:794px;margin-inline:auto;font-size:14px;line-height:1.6;box-shadow:0 2px 10px rgba(0,0,0,.08);box-sizing:border-box;}
      .ivp h3{margin:0;font-size:24px;color:#1d4ed8;} .ivp .meta{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:14px 0;}
      .ivp table{width:100%;border-collapse:collapse;margin-top:10px;} .ivp th{background:#eef2ff;padding:7px;font-size:13px;text-align:start;} .ivp td{padding:7px;border-bottom:1px solid #e5e7eb;vertical-align:top;}
      .ivp .tot{margin-top:12px;margin-inline-start:auto;width:min(280px,100%);} .ivp .tot div{display:flex;justify-content:space-between;padding:3px 0;} .ivp .tot .g{font-weight:800;font-size:16px;border-top:2px solid #111;margin-top:4px;padding-top:6px;}
      .ivp .nt{margin-top:16px;font-size:13px;color:#444;white-space:pre-wrap;}
      @media (max-width:560px){.ivp{padding:14px;font-size:13px;}}
    </style>
    <div class="pt-row"><span style="font-size:13px;font-weight:700;">اللغة:</span>
      <button type="button" class="pt-btn2 on" data-dir="ar">العربية</button><button type="button" class="pt-btn2" data-dir="en">English</button></div>
    <div class="pt-grid2">
      <div><label class="pt-lbl" for="ivSeller">اسمك أو اسم نشاطك</label><input class="pt-in" id="ivSeller" maxlength="60" autocomplete="off"></div>
      <div><label class="pt-lbl" for="ivContact">هاتفك / بريدك / العنوان</label><input class="pt-in" id="ivContact" maxlength="100" autocomplete="off"></div>
      <div><label class="pt-lbl" for="ivClient">اسم العميل</label><input class="pt-in" id="ivClient" maxlength="60" autocomplete="off"></div>
      <div><label class="pt-lbl" for="ivNo">رقم الفاتورة</label><input class="pt-in" id="ivNo" maxlength="20" dir="ltr" style="text-align:right;" autocomplete="off"></div>
      <div><label class="pt-lbl" for="ivDate">التاريخ</label><input class="pt-in" id="ivDate" type="date"></div>
      <div><label class="pt-lbl" for="ivCur">العملة</label><select class="pt-in" id="ivCur"></select></div>
    </div>
    <div class="pt-lbl">البنود</div><div id="ivItems"></div><button type="button" class="pt-btn2" id="ivAdd">+ إضافة بند</button>
    <div class="pt-grid2">
      <div><label class="pt-lbl" for="ivTax">نسبة الضريبة %</label><input class="pt-in" id="ivTax" type="text" inputmode="decimal" placeholder="0"></div>
      <div><label class="pt-lbl" for="ivDisc">خصم (مبلغ)</label><input class="pt-in" id="ivDisc" type="text" inputmode="decimal" placeholder="0"></div>
    </div>
    <label class="pt-lbl" for="ivNote">ملاحظات / شروط الدفع</label><textarea class="pt-in" id="ivNote" rows="2" maxlength="300"></textarea>
    <div class="pt-row" style="margin-top:16px;"><button type="button" class="pt-btn" id="ivPrint">📄 حفظ PDF / طباعة</button><button type="button" class="pt-btn2" id="ivNew">+ فاتورة جديدة</button></div>
    <div class="pt-note">نموذج فاتورة تجاري بسيط وليس فاتورة ضريبية رسمية. إن كان نشاطك يستلزم الفوترة الإلكترونية الرسمية في بلدك فاعتمد النظام الرسمي. 🔒 بياناتك تبقى في متصفحك.</div>
    <div class="ivp" id="ivPrev"></div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_invoice_v1';
  var CUR = [['JOD', 'دينار أردني', 3], ['SAR', 'ريال سعودي', 2], ['AED', 'درهم إماراتي', 2], ['OMR', 'ريال عماني', 3], ['KWD', 'دينار كويتي', 3], ['BHD', 'دينار بحريني', 3], ['QAR', 'ريال قطري', 2], ['EGP', 'جنيه مصري', 2], ['USD', 'دولار أمريكي', 2], ['EUR', 'يورو', 2], ['GBP', 'جنيه إسترليني', 2]];
  var S = { dir: 'ar', seller: '', contact: '', client: '', no: '', date: '', cur: 'JOD', tax: '', disc: '', note: '', items: [{ d: '', q: '1', p: '' }], n: 1 };
  try { var r = JSON.parse(localStorage.getItem(KEY)); if (r && r.items) S = Object.assign(S, r); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  if (!S.date) S.date = today();
  if (!S.no) S.no = 'INV-' + ('000' + S.n).slice(-4);
  function normDigits(s) { return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/٫/g, '.'); }
  function num(v) { var x = parseFloat(normDigits(v)); return isNaN(x) ? 0 : x; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var LB = { ar: { inv: 'فاتورة', no: 'رقم الفاتورة', dt: 'التاريخ', to: 'إلى', desc: 'البند', qty: 'الكمية', pr: 'السعر', tt: 'الإجمالي', sub: 'المجموع الفرعي', dis: 'الخصم', tax: 'الضريبة', gr: 'الإجمالي المستحق', nt: 'ملاحظات' }, en: { inv: 'INVOICE', no: 'Invoice No.', dt: 'Date', to: 'Bill to', desc: 'Description', qty: 'Qty', pr: 'Price', tt: 'Total', sub: 'Subtotal', dis: 'Discount', tax: 'Tax', gr: 'Total due', nt: 'Notes' } };
  function dec() { for (var i = 0; i < CUR.length; i++) if (CUR[i][0] === S.cur) return CUR[i][2]; return 2; }
  function money(v) { return v.toLocaleString('en-US', { minimumFractionDigits: dec(), maximumFractionDigits: dec() }) + ' ' + S.cur; }
  function render() {
    var P = $('ivPrev'), L = LB[S.dir]; P.innerHTML = ''; P.dir = S.dir === 'ar' ? 'rtl' : 'ltr';
    P.appendChild(el('h3', '', L.inv));
    var m = el('div', 'meta'), a = el('div'), b = el('div');
    a.appendChild(el('b', '', S.seller || '—')); if (S.contact) a.appendChild(el('div', '', S.contact));
    b.appendChild(el('div', '', L.no + ': ' + S.no)); b.appendChild(el('div', '', L.dt + ': ' + S.date));
    if (S.client) b.appendChild(el('div', '', L.to + ': ' + S.client));
    m.appendChild(a); m.appendChild(b); P.appendChild(m);
    var t = el('table'), h = el('tr');
    [L.desc, L.qty, L.pr, L.tt].forEach(function (x) { h.appendChild(el('th', '', x)); }); t.appendChild(h);
    var sub = 0;
    S.items.forEach(function (it) {
      var q = num(it.q), p = num(it.p), tot = q * p; if (!it.d && !p) return; sub += tot;
      var tr = el('tr'); tr.appendChild(el('td', '', it.d)); tr.appendChild(el('td', '', String(q))); tr.appendChild(el('td', '', money(p))); tr.appendChild(el('td', '', money(tot))); t.appendChild(tr);
    });
    P.appendChild(t);
    var dsc = Math.min(num(S.disc), sub), tx = (sub - dsc) * num(S.tax) / 100, gr = sub - dsc + tx;
    var T = el('div', 'tot');
    function row(l, v, c) { var d = el('div', c || ''); d.appendChild(el('span', '', l)); d.appendChild(el('span', '', v)); T.appendChild(d); }
    row(L.sub, money(sub)); if (dsc) row(L.dis, '- ' + money(dsc)); if (num(S.tax)) row(L.tax + ' (' + num(S.tax) + '%)', money(tx)); row(L.gr, money(gr), 'g');
    P.appendChild(T);
    if (S.note) P.appendChild(el('div', 'nt', L.nt + ': ' + S.note));
  }
  function upd() { save(); render(); }
  var simple = { ivSeller: 'seller', ivContact: 'contact', ivClient: 'client', ivNo: 'no', ivDate: 'date', ivTax: 'tax', ivDisc: 'disc', ivNote: 'note' };
  Object.keys(simple).forEach(function (id) { $(id).addEventListener('input', function () { S[simple[id]] = $(id).value; upd(); }); });
  var sel = $('ivCur');
  CUR.forEach(function (c) { var o = document.createElement('option'); o.value = c[0]; o.textContent = c[1] + ' (' + c[0] + ')'; sel.appendChild(o); });
  sel.addEventListener('change', function () { S.cur = sel.value; upd(); });
  function rows() {
    var box = $('ivItems'); box.innerHTML = '';
    S.items.forEach(function (x, i) {
      var d = el('div', 'pt-box'), d1 = el('input', 'pt-in'), g = el('div', 'pt-grid2');
      d1.placeholder = 'وصف البند'; d1.maxLength = 100; d1.value = x.d || ''; d1.setAttribute('aria-label', 'وصف البند');
      d1.addEventListener('input', function () { x.d = d1.value; upd(); });
      var q = el('input', 'pt-in'), p = el('input', 'pt-in');
      q.placeholder = 'الكمية'; q.value = x.q || ''; q.inputMode = 'decimal'; q.setAttribute('aria-label', 'الكمية');
      p.placeholder = 'سعر الوحدة'; p.value = x.p || ''; p.inputMode = 'decimal'; p.setAttribute('aria-label', 'سعر الوحدة');
      q.addEventListener('input', function () { x.q = q.value; upd(); }); p.addEventListener('input', function () { x.p = p.value; upd(); });
      g.appendChild(q); g.appendChild(p);
      var rm = el('button', 'pt-btn2', 'حذف البند'); rm.type = 'button'; rm.style.marginTop = '6px';
      rm.addEventListener('click', function () { if (S.items.length > 1) S.items.splice(i, 1); else S.items = [{ d: '', q: '1', p: '' }]; upd(); rows(); });
      d.appendChild(d1); d.appendChild(g); d.appendChild(rm); box.appendChild(d);
    });
  }
  $('ivAdd').addEventListener('click', function () { if (S.items.length >= 30) return; S.items.push({ d: '', q: '1', p: '' }); upd(); rows(); });
  document.querySelectorAll('[data-dir]').forEach(function (b) { b.addEventListener('click', function () { S.dir = b.getAttribute('data-dir'); sync(); upd(); }); });
  function sync() { document.querySelectorAll('[data-dir]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-dir') === S.dir); }); }
    function pdfX(id, name, btn) {
    var nat = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    if (!nat) { window.print(); return; }
    var old = btn.textContent;
    function load(u) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
    function done() { btn.textContent = old; btn.disabled = false; }
    if (btn._blob) {
      var f0 = new File([btn._blob], name, { type: 'application/pdf' }); btn._blob = null; done();
      if (navigator.canShare && navigator.canShare({ files: [f0] })) navigator.share({ files: [f0] }).catch(function () {});
      return;
    }
    btn.textContent = '⏳'; btn.disabled = true;
    (window.html2canvas ? Promise.resolve() : load('vendor/html2canvas-1.4.1.min.js')).then(function () {
      return window.jspdf ? 0 : load('vendor/jspdf-2.5.1.umd.min.js');
    }).then(function () {
      var el = document.getElementById(id);
      return window.html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    }).then(function (cv) {
      var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
      var pw = 210, ph = 297, ratio = pw / cv.width, sliceH = Math.floor(ph / ratio), y = 0, first = true;
      while (y < cv.height) {
        var h = Math.min(sliceH, cv.height - y), c2 = document.createElement('canvas');
        c2.width = cv.width; c2.height = h;
        var cx = c2.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c2.width, h); cx.drawImage(cv, 0, y, cv.width, h, 0, 0, cv.width, h);
        if (!first) pdf.addPage();
        pdf.addImage(c2.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pw, h * ratio);
        first = false; y += h;
      }
      btn._blob = pdf.output('blob'); btn.disabled = false; btn.textContent = '📤 اضغط لحفظ الملف أو مشاركته';
    }).catch(function () { done(); alert('تعذّر إنشاء الملف. حاول مرة أخرى.'); });
  }
  $('ivPrint').addEventListener('click', function () { pdfX('ivPrev', 'invoice.pdf', $('ivPrint')); });
  $('ivNew').addEventListener('click', function () {
    S.n = (S.n || 1) + 1; S.no = 'INV-' + ('000' + S.n).slice(-4); S.date = today(); S.client = ''; S.disc = ''; S.note = ''; S.items = [{ d: '', q: '1', p: '' }];
    fill(); upd();
  });
  function fill() {
    Object.keys(simple).forEach(function (id) { $(id).value = S[simple[id]] || ''; });
    sel.value = S.cur; rows(); sync();
  }
  fill(); render();
})();
`
};

module.exports = { 'cv-builder': CV, 'typing-speed-ar': TYPING, 'invoice-generator': INVOICE };
