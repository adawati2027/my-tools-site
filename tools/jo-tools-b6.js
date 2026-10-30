const CSS = String.raw`
    <style>
      .pt-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;}
      .pt-btn2{padding:9px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:13px;cursor:pointer;}
      .pt-btn2.on{background:#2563eb;color:#fff;border-color:#2563eb;}
      .pt-note{font-size:13px;color:var(--text-muted);margin-top:10px;min-height:18px;line-height:1.7;text-align:center;}
      .pt-stat{display:flex;gap:10px;margin-top:12px;}
      .pt-stat div{flex:1;text-align:center;padding:8px;border-radius:10px;background:var(--surface-2);font-size:12px;color:var(--text-muted);}
      .pt-stat b{display:block;font-size:20px;color:var(--text);}
    </style>`;

const CROSSWORD = {
  icon: '🧩', bg: '#ede9fe', grad: '#6d28d9,#2e1065', title: 'لعبة الكلمات المتقاطعة', h1: 'لعبة الكلمات المتقاطعة 🧩',
  sub: 'حلّ الكلمات المتقاطعة بالعربية: تعريفات أفقية وعمودية، وشبكة جديدة في كل مرة',
  desc: 'لعبة كلمات متقاطعة بالعربية مجانية: شبكة جديدة في كل مرة بتعريفات أفقية وعمودية وفئات متنوعة، مع لوحة حروف عربية وتحقق وتلميحات ومؤقت وأفضل وقت، أو تسابق مع صديق أونلاين والأسرع يفوز.',
  kw: 'كلمات متقاطعة, لعبة الكلمات المتقاطعة, كلمات متقاطعة عربي, حل الكلمات المتقاطعة, crossword arabic',
  search: 'كلمات متقاطعة لعبة كلمات متقاطعة عربي تعريفات افقي عمودي crossword الغاز تسلية',
  cardDesc: 'كلمات متقاطعة بتعريفات أفقية وعمودية وشبكة جديدة كل مرة', cat: 'games',
  faq: [
    ['كيف ألعب الكلمات المتقاطعة؟', 'اضغط خانة في الشبكة، فيظهر التعريف في الأعلى. اكتب الجواب بلوحة الحروف أسفل الشبكة، وسينتقل المؤشر تلقائياً إلى الخانة التالية.'],
    ['كيف أبدّل بين الأفقي والعمودي؟', 'اضغط الخانة نفسها مرة ثانية إذا كانت تتقاطع فيها كلمتان، أو اضغط التعريف من القائمة تحت الشبكة.'],
    ['هل يجب كتابة الهمزة والتاء المربوطة؟', 'لا، تعدّ اللعبة الألف والهمزة حرفاً واحداً، والهاء والتاء المربوطة حرفاً واحداً، والياء والألف المقصورة حرفاً واحداً.'],
    ['كيف تعمل المساعدة؟', 'زر «تحقق» يلوّن الحروف الخاطئة بالأحمر، و«كشف حرف» يكتب لك حرف الخانة المحددة، و«كشف الكلمة» يكتب الكلمة كاملة. لا يُحفظ أفضل وقت إن استخدمت الكشف.'],
    ['هل الشبكة تتغير كل مرة؟', 'نعم، تُختار كلمات مختلفة وتُرتَّب بشكل جديد في كل مرة، ويمكنك اختيار فئة محددة أو منوّعة.'],
    ['كيف ألعب مع صديق؟', 'أنشئ غرفة وأرسل الرابط أو الرمز لصديقك. يحصل الاثنان على اللغز نفسه، ومن يكمل كل الكلمات أولاً هو الفائز. يُمنع الكشف أثناء السباق.'],
    ['هل أحتاج إنترنت؟', 'للعب الفردي لا، تعمل اللعبة بعد تحميل الصفحة دون اتصال. أما السباق مع صديق فيحتاج إنترنت.']
  ],
  how: ['اختر فئة.', 'اضغط خانة واقرأ التعريف في الأعلى.', 'اكتب الجواب بلوحة الحروف.', 'أكمل كل الخانات لتسجّل وقتك، أو أنشئ غرفة وتسابق مع صديق.'],
  rel: [['jo/tools/word-search/', '🔍 البحث عن الكلمات'], ['jo/tools/hangman-ar/', '🔤 لعبة المشنقة'], ['jo/games/wordle/', '🟩 ووردل بالعربي']],
  main: CSS + String.raw`
    <style>
      .cw-g{display:grid;direction:rtl;gap:2px;margin:14px auto 0;}
      .cw-g button{position:relative;aspect-ratio:1;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text);font-family:inherit;font-size:clamp(15px,4.6vw,22px);font-weight:800;padding:0;cursor:pointer;line-height:1;}
      .cw-g button.e{visibility:hidden;pointer-events:none;}
      .cw-g button.w{background:rgba(37,99,235,.2);} .cw-g button.s{background:#fde68a;color:#111;}
      .cw-g button.x{background:#fecaca;color:#7f1d1d;} .cw-g button.k{background:#bbf7d0;color:#052e16;}
      .cw-g .cw-n{position:absolute;top:2px;right:3px;font-size:9px;font-weight:700;opacity:.65;line-height:1;}
      .cw-clue{margin-top:12px;padding:10px 12px;border-radius:10px;background:var(--surface-2);font-weight:700;text-align:center;min-height:24px;line-height:1.7;}
      .cw-kb{display:grid;grid-template-columns:repeat(9,1fr);gap:5px;direction:rtl;margin:12px auto 0;max-width:460px;}
      .cw-kb button{padding:11px 0;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font-family:inherit;font-size:17px;font-weight:700;cursor:pointer;}
      .cw-lists{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px;}
      @media(max-width:560px){.cw-lists{grid-template-columns:1fr;}}
      .cw-lists h3{font-size:14px;margin:0 0 6px;}
      .cw-lists button{display:block;width:100%;text-align:right;padding:6px 8px;border:none;background:transparent;color:var(--text);font-family:inherit;font-size:13px;line-height:1.7;border-radius:8px;cursor:pointer;}
      .cw-lists button.a{background:rgba(37,99,235,.18);} .cw-lists button.f{text-decoration:line-through;opacity:.5;}
    </style>
    <div class="pt-row" id="cwCats"></div>
    <div class="pt-stat"><div><b id="cwT">0:00</b>الوقت</div><div><b id="cwF">0/0</b>الكلمات</div><div><b id="cwB">--</b>أفضل وقت</div></div>
    <div class="pt-note" id="cwMsg" aria-live="polite"></div>
    <div id="cwPlay">
    <div class="cw-clue" id="cwClue"></div>
    <div class="cw-g" id="cwG"></div>
    <div class="cw-kb" id="cwKb"></div>
    <div class="pt-row" style="justify-content:center;margin-top:12px;">
      <button type="button" class="pt-btn2" id="cwChk">✔ تحقق</button>
      <button type="button" class="pt-btn2" id="cwHint">💡 كشف حرف</button>
      <button type="button" class="pt-btn2" id="cwWd">💡 كشف الكلمة</button>
      <button type="button" class="pt-btn" id="cwNew">🔄 لغز جديد</button>
    </div>
    <div class="cw-lists"><div><h3>أفقياً ⬅</h3><div id="cwA"></div></div><div><h3>عمودياً ⬇</h3><div id="cwD"></div></div></div>
    </div>
    <div id="cwRoom"></div>`,
  room: true,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var B = {
    'حيوانات': [['أسد', 'ملك الغابة'], ['نمر', 'حيوان مفترس جلده مخطّط'], ['فيل', 'أكبر حيوان بري وله خرطوم طويل'], ['جمل', 'سفينة الصحراء'], ['زرافة', 'أطول حيوان في العالم'], ['حصان', 'حيوان سريع يُركب ويشارك في السباقات'], ['ذئب', 'حيوان مفترس يشبه الكلب ويعوي'], ['ثعلب', 'حيوان يُضرب به المثل في المكر'], ['غزال', 'حيوان رشيق سريع العدو'], ['قرد', 'حيوان يتسلق الأشجار ويقلّد الإنسان'], ['نسر', 'طائر جارح كبير يحلّق عالياً'], ['صقر', 'طائر جارح يُدرَّب على الصيد'], ['حمار', 'حيوان يحمل الأثقال'], ['بقرة', 'حيوان نأخذ منه الحليب'], ['خروف', 'حيوان يُربّى لصوفه ولحمه'], ['دلفين', 'حيوان بحري ذكي يقفز فوق الماء'], ['تمساح', 'زاحف ضخم يعيش قرب الأنهار'], ['سلحفاة', 'زاحف يحمل بيته على ظهره'], ['نحلة', 'حشرة تصنع العسل'], ['أرنب', 'حيوان أذناه طويلتان ويحب الجزر'], ['حوت', 'أكبر حيوان على وجه الأرض'], ['فراشة', 'حشرة جميلة بجناحين ملوّنين'], ['دجاجة', 'طائر نأخذ منه البيض'], ['بومة', 'طائر يسهر في الليل']],
    'دول ومدن': [['عمان', 'عاصمة الأردن'], ['القاهرة', 'عاصمة مصر'], ['دمشق', 'عاصمة سوريا'], ['بيروت', 'عاصمة لبنان'], ['بغداد', 'عاصمة العراق'], ['الرياض', 'عاصمة السعودية'], ['الدوحة', 'عاصمة قطر'], ['الرباط', 'عاصمة المغرب'], ['مسقط', 'عاصمة سلطنة عمان'], ['المنامة', 'عاصمة البحرين'], ['أبوظبي', 'عاصمة دولة الإمارات'], ['الكويت', 'دولة خليجية عاصمتها تحمل اسمها'], ['تونس', 'دولة في شمال أفريقيا عاصمتها تحمل اسمها'], ['الجزائر', 'أكبر دولة عربية من حيث المساحة'], ['ليبيا', 'دولة عربية عاصمتها طرابلس'], ['السودان', 'دولة عربية عاصمتها الخرطوم'], ['اليمن', 'دولة عربية عاصمتها صنعاء'], ['القدس', 'مدينة فيها المسجد الأقصى'], ['مكة', 'المدينة التي فيها الكعبة المشرفة'], ['تركيا', 'دولة عاصمتها أنقرة'], ['فرنسا', 'دولة عاصمتها باريس'], ['اليابان', 'دولة عاصمتها طوكيو'], ['مصر', 'دولة فيها الأهرامات'], ['النيل', 'أطول نهر في أفريقيا'], ['دجلة', 'نهر يمر في مدينة بغداد'], ['العقبة', 'المدينة الأردنية الوحيدة على البحر الأحمر'], ['البتراء', 'المدينة الوردية الأثرية في الأردن'], ['إربد', 'مدينة أردنية في شمال المملكة'], ['جرش', 'مدينة أردنية تشتهر بآثارها الرومانية'], ['مادبا', 'مدينة الفسيفساء في الأردن']],
    'فواكه وخضار': [['تفاح', 'فاكهة حمراء أو خضراء مشهورة'], ['موز', 'فاكهة صفراء مقوّسة'], ['عنب', 'فاكهة نصنع منها الزبيب'], ['برتقال', 'فاكهة حمضية غنية بفيتامين سي'], ['ليمون', 'فاكهة حامضة صفراء'], ['رمان', 'فاكهة حبّاتها حمراء متراصّة'], ['بطيخ', 'فاكهة صيفية خضراء من الخارج وحمراء من الداخل'], ['مشمش', 'فاكهة صغيرة صفراء برتقالية'], ['خوخ', 'فاكهة صيفية ناعمة القشرة'], ['تين', 'فاكهة حلوة تؤكل طازجة أو مجففة'], ['فراولة', 'فاكهة حمراء صغيرة تغطي سطحها حبوب'], ['كرز', 'فاكهة حمراء صغيرة بنواة'], ['شمام', 'فاكهة صيفية برتقالية اللب'], ['جزر', 'خضار برتقالي يحبه الأرنب'], ['بصل', 'خضار يُبكينا عند تقطيعه'], ['طماطم', 'خضار حمراء نصنع منها الصلصة'], ['خيار', 'خضار خضراء منعشة في السلطة'], ['بطاطا', 'درنة تُقلى فتصبح رقائق'], ['ثوم', 'خضار برائحة قوية يُستخدم في الطبخ'], ['فلفل', 'خضار حار أو حلو بألوان متعددة'], ['باذنجان', 'خضار بنفسجية اللون'], ['زيتون', 'ثمرة نأخذ منها الزيت'], ['تمر', 'ثمرة النخيل'], ['نعناع', 'عشب عطري يوضع في الشاي']],
    'مهن': [['طبيب', 'يعالج المرضى'], ['معلم', 'يعلّم الطلاب في المدرسة'], ['مهندس', 'يصمّم المباني والآلات'], ['طيار', 'يقود الطائرة'], ['شرطي', 'يحفظ الأمن'], ['نجار', 'يصنع الأثاث من الخشب'], ['خباز', 'يصنع الخبز'], ['طباخ', 'يعدّ الطعام'], ['ممرض', 'يساعد الطبيب في رعاية المرضى'], ['محامي', 'يدافع عن موكّله أمام القضاء'], ['مزارع', 'يزرع الأرض'], ['حداد', 'يطرق الحديد ليشكّله'], ['خياط', 'يخيط الملابس'], ['رسام', 'يرسم اللوحات'], ['صحفي', 'يكتب الأخبار'], ['سائق', 'يقود السيارة'], ['حلاق', 'يقصّ الشعر'], ['قاضي', 'يحكم بين الناس في المحكمة'], ['صيدلي', 'يبيع الأدوية'], ['مصور', 'يلتقط الصور'], ['جندي', 'يحمي الوطن'], ['تاجر', 'يبيع ويشتري'], ['كاتب', 'يؤلّف الكتب والقصص']]
  };
  var MIX = 'منوّعة', N = 13, KEY = 'adawati_crossword_best', BEST = {}, cat = MIX, R, C, words, sol, nn, user, num, cw, bad, sel, dir, t0, tm, done, hints, rc = null, rR = null, cLast = 0, LIMIT = 600, cCatSel = null, sent = -1, myFt = 0, cells = [], KEYS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهويأةىئءؤ'.split('');
  try { BEST = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nz(s) { return s.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'); }
  function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function fit(g, ch, r, c, d) {
    var dr = d, dc = 1 - d, L = ch.length, i, rr, cc, x, cross = 0, pr = r - dr, pc = c - dc, nr = r + dr * L, nc = c + dc * L;
    if (r < 0 || c < 0 || r + dr * (L - 1) >= N || c + dc * (L - 1) >= N) return -1;
    if (pr >= 0 && pc >= 0 && g[pr * N + pc]) return -1;
    if (nr < N && nc < N && g[nr * N + nc]) return -1;
    for (i = 0; i < L; i++) {
      rr = r + dr * i; cc = c + dc * i; x = g[rr * N + cc];
      if (x) { if (x.n !== nz(ch[i]) || (x.m & (d ? 2 : 1))) return -1; cross++; }
      else {
        if (rr + dc < N && cc + dr < N && g[(rr + dc) * N + cc + dr]) return -1;
        if (rr - dc >= 0 && cc - dr >= 0 && g[(rr - dc) * N + cc - dr]) return -1;
      }
    }
    return cross;
  }
  function put(g, ws, ch, clue, r, c, d) {
    for (var i = 0; i < ch.length; i++) {
      var idx = (r + (d ? i : 0)) * N + c + (d ? 0 : i);
      if (g[idx]) g[idx].m |= d ? 2 : 1; else g[idx] = { n: nz(ch[i]), m: d ? 2 : 1 };
    }
    ws.push({ ch: ch, clue: clue, r: r, c: c, d: d });
  }
  function gen(cname) {
    var bank = cname === MIX ? Object.keys(B).reduce(function (a, k) { return a.concat(B[k]); }, []) : B[cname], bestW = null, att;
    for (att = 0; att < 80; att++) {
      var pool = shuf(bank.slice()).slice(0, 20).sort(function (a, b) { return b[0].length - a[0].length; }), g = new Array(N * N).fill(null), ws = [], k;
      for (k = 0; k < pool.length && ws.length < 10; k++) {
        var ch = pool[k][0].split(''), L = ch.length;
        if (!ws.length) { put(g, ws, ch, pool[k][1], 6, Math.floor((N - L) / 2), 0); continue; }
        var cand = [], i, j, d, r, c2;
        for (i = 0; i < N * N; i++) {
          if (!g[i]) continue;
          for (j = 0; j < L; j++) if (nz(ch[j]) === g[i].n) for (d = 0; d < 2; d++) {
            r = Math.floor(i / N) - (d ? j : 0); c2 = i % N - (d ? 0 : j);
            if (fit(g, ch, r, c2, d) >= 1) cand.push([r, c2, d]);
          }
        }
        if (cand.length) { var pk = cand[Math.floor(Math.random() * cand.length)]; put(g, ws, ch, pool[k][1], pk[0], pk[1], pk[2]); }
      }
      if (!bestW || ws.length > bestW.length) bestW = ws;
      if (ws.length >= 9) break;
    }
    var r0 = 99, c0 = 99, r1 = 0, c1 = 0;
    bestW.forEach(function (w) { var L = w.ch.length; r0 = Math.min(r0, w.r); c0 = Math.min(c0, w.c); r1 = Math.max(r1, w.r + (w.d ? L - 1 : 0)); c1 = Math.max(c1, w.c + (w.d ? 0 : L - 1)); });
    return { R: r1 - r0 + 1, C: c1 - c0 + 1, words: bestW.map(function (w) { return { ch: w.ch, clue: w.clue, r: w.r - r0, c: w.c - c0, d: w.d }; }) };
  }
  function wc(wi) { var w = words[wi], a = [], k; for (k = 0; k < w.ch.length; k++) a.push((w.r + (w.d ? k : 0)) * C + w.c + (w.d ? 0 : k)); return a; }
  function wordDone(wi) { return wc(wi).every(function (i) { return user[i] && nz(user[i]) === nn[i]; }); }
  function allDone() { for (var i = 0; i < sol.length; i++) if (sol[i] && !(user[i] && nz(user[i]) === nn[i])) return false; return true; }
  function build(p) {
    p = p || gen(cat); R = p.R; C = p.C; words = p.words;
    var n = R * C, i, g = $('cwG');
    sol = new Array(n).fill(''); nn = new Array(n).fill(''); user = new Array(n).fill(''); num = new Array(n).fill(0); cw = []; bad = {}; hints = 0; done = false;
    for (i = 0; i < n; i++) cw.push([-1, -1]);
    words.forEach(function (w, wi) { w.ch.forEach(function (ch, k) { var ix = (w.r + (w.d ? k : 0)) * C + w.c + (w.d ? 0 : k); sol[ix] = ch; nn[ix] = nz(ch); cw[ix][w.d] = wi; }); });
    var cnt = 0;
    for (i = 0; i < n; i++) { var st = words.filter(function (w) { return w.r * C + w.c === i; }); if (st.length) { cnt++; num[i] = cnt; st.forEach(function (w) { w.num = cnt; }); } }
    var w1 = words.filter(function (w) { return w.num === 1; }); w1 = w1.filter(function (w) { return !w.d; })[0] || w1[0];
    sel = w1.r * C + w1.c; dir = w1.d;
    g.innerHTML = ''; g.style.gridTemplateColumns = 'repeat(' + C + ',1fr)'; g.style.width = 'min(' + (C * 46) + 'px,100%)'; cells = [];
    for (i = 0; i < n; i++) (function (ix) {
      var b = document.createElement('button'); b.type = 'button';
      if (!sol[ix]) { b.className = 'e'; b.tabIndex = -1; }
      else {
        if (num[ix]) { var s = document.createElement('span'); s.className = 'cw-n'; s.textContent = num[ix]; b.appendChild(s); }
        var l = document.createElement('span'); l.className = 'cw-l'; b.appendChild(l);
        b.addEventListener('click', function () { pick(ix); });
      }
      g.appendChild(b); cells.push(b);
    })(i);
    lists(); $('cwMsg').textContent = ''; clearInterval(tm); t0 = Date.now(); tm = setInterval(tick, 1000); tick(); best(); paint();
  }
  function lists() {
    ['cwA', 'cwD'].forEach(function (id, d) {
      var box = $(id); box.innerHTML = '';
      words.map(function (w, wi) { return [w, wi]; }).filter(function (x) { return x[0].d === d; }).sort(function (a, b) { return a[0].num - b[0].num; }).forEach(function (x) {
        var b = document.createElement('button'); b.type = 'button'; b.dataset.w = x[1]; b.textContent = x[0].num + '. ' + x[0].clue + ' (' + x[0].ch.length + ' حروف)';
        b.addEventListener('click', function () { if (done) return; sel = x[0].r * C + x[0].c; dir = x[0].d; paint(); });
        box.appendChild(b);
      });
    });
  }
  function paint() {
    var aw = sel >= 0 ? cw[sel][dir] : -1, inw = {}, fin = 0;
    if (aw >= 0) wc(aw).forEach(function (i) { inw[i] = 1; });
    cells.forEach(function (e, i) {
      if (!sol[i]) return;
      e.className = (i === sel ? 's' : inw[i] ? 'w' : '') + (bad[i] ? ' x' : '') + (done ? ' k' : '');
      e.querySelector('.cw-l').textContent = user[i];
    });
    words.forEach(function (w, wi) { if (wordDone(wi)) fin++; });
    $('cwF').textContent = fin + '/' + words.length;
    document.querySelectorAll('.cw-lists button').forEach(function (b) { var wi = +b.dataset.w; b.className = (wi === aw ? 'a ' : '') + (wordDone(wi) ? 'f' : ''); });
    if (rc && cLast && !done && fin !== sent) { sent = fin; myFt = Math.floor((Date.now() - t0) / 1000); rc.setMine({ sc: fin, sr: cLast, ft: myFt }); }
    $('cwClue').textContent = aw >= 0 ? words[aw].num + ' ' + (dir ? 'عمودي' : 'أفقي') + ': ' + words[aw].clue + ' (' + words[aw].ch.length + ' حروف)' : '';
  }
  function tick() {
    if (done) return;
    var s = Math.floor((Date.now() - t0) / 1000);
    if (rc) { s = Math.max(0, LIMIT - s); if (s <= 0 && cLast) { $('cwT').textContent = fmt(0); cwOver(); return; } }
    $('cwT').textContent = fmt(s);
  }
  function best() { var b = BEST[cat]; $('cwB').textContent = b ? fmt(b) : '--'; }
  function pick(i) { if (done) return; if (i === sel) { if (cw[i][1 - dir] >= 0) dir = 1 - dir; } else { sel = i; if (cw[i][dir] < 0) dir = 1 - dir; } paint(); }
  function cur() { var w = cw[sel][dir], cs = w >= 0 ? wc(w) : []; return { cs: cs, p: cs.indexOf(sel) }; }
  function typ(ch) {
    if (done || sel < 0) return;
    user[sel] = ch; delete bad[sel]; var c = cur(); if (c.p >= 0 && c.p < c.cs.length - 1) sel = c.cs[c.p + 1];
    paint(); if (allDone()) { if (rc) cwOver(); else win(); }
  }
  function back() {
    if (done || sel < 0) return;
    var c = cur();
    if (user[sel]) { user[sel] = ''; delete bad[sel]; } else if (c.p > 0) { sel = c.cs[c.p - 1]; user[sel] = ''; delete bad[sel]; }
    paint();
  }
  function win() {
    done = true; clearInterval(tm); var sec = Math.floor((Date.now() - t0) / 1000); $('cwT').textContent = fmt(sec);
    if (window.adCelebrate) adCelebrate(); $('cwMsg').textContent = '🎉 أحسنت! حللت اللغز في ' + fmt(sec) + (hints ? ' (استخدمت الكشف ' + hints + ' مرة)' : '') + '.';
    if (!hints && (!BEST[cat] || sec < BEST[cat])) { BEST[cat] = sec; try { localStorage.setItem(KEY, JSON.stringify(BEST)); } catch (e) {} best(); }
    paint();
  }
  var kb = $('cwKb');
  KEYS.forEach(function (k) { var b = document.createElement('button'); b.type = 'button'; b.textContent = k; b.addEventListener('click', function () { typ(k); }); kb.appendChild(b); });
  var bk = document.createElement('button'); bk.type = 'button'; bk.textContent = '⌫'; bk.setAttribute('aria-label', 'حذف'); bk.addEventListener('click', back); kb.appendChild(bk);
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target && e.target.tagName; if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
    if (e.key === 'Backspace') { back(); e.preventDefault(); } else if (/^[ء-ي]$/.test(e.key)) typ(e.key);
  });
  $('cwChk').addEventListener('click', function () {
    if (done) return; bad = {}; var n = 0; user.forEach(function (u, i) { if (u && nz(u) !== nn[i]) { bad[i] = 1; n++; } });
    $('cwMsg').textContent = n ? 'يوجد ' + n + ' حرف خاطئ، وقد لُوّن بالأحمر.' : 'لا توجد أخطاء حتى الآن، أحسنت!'; paint();
  });
  $('cwHint').addEventListener('click', function () {
    if (done || sel < 0) return; user[sel] = sol[sel]; delete bad[sel]; hints++; paint(); if (allDone()) win();
  });
  $('cwWd').addEventListener('click', function () {
    if (done || sel < 0) return; var w = cw[sel][dir]; if (w < 0) return;
    wc(w).forEach(function (i) { user[i] = sol[i]; delete bad[i]; }); hints++; paint(); if (allDone()) win();
  });
  $('cwNew').addEventListener('click', function () { build(); });
  var box = $('cwCats');
  [MIX].concat(Object.keys(B)).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-btn2' + (k === cat ? ' on' : ''); b.textContent = k;
    b.addEventListener('click', function () { cat = k; box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); build(); });
    box.appendChild(b);
  });
  var cwBtn = document.createElement('button'); cwBtn.type = 'button'; cwBtn.className = 'pt-btn'; cwBtn.hidden = true; cwBtn.textContent = '🔄 سباق جديد';
  $('cwNew').parentNode.appendChild(cwBtn);
  var soloEls = ['cwCats', 'cwNew', 'cwHint', 'cwWd'];
  function cwMe() { return rc.players.filter(function (p) { return p.id === rc.pid; })[0] || {}; }
  function cwOpp() { return rc.players.filter(function (p) { return p.id !== rc.pid; })[0]; }
  function myFin() { var n = 0; words.forEach(function (w, wi) { if (wordDone(wi)) n++; }); return n; }
  function cwOver() {
    if (done) return; done = true; clearInterval(tm); cwRes();
  }
  function cwRes() {
    var op = cwOpp(), m = $('cwMsg'), tot = words.length, mc = myFin(), oc = op && op.sr === cLast ? (op.sc || 0) : 0;
    if (!op) { m.textContent = 'غادر المنافس.'; return; }
    if (!done) { m.textContent = 'منافسك ' + op.name + ': ' + oc + ' من ' + tot + ' — وأنت: ' + mc + '.'; return; }
    var mt = mc ? myFt : 999999, ot = op.sr === cLast && oc && op.ft != null ? op.ft : 999999;
    var res = mc > oc || (mc === oc && mt < ot) ? '🏆 فزت!' : (mc === oc && mt === ot ? '🤝 تعادل' : '😅 فاز ' + op.name);
    if (res === '🏆 فزت!' && window.adCelebrate) adCelebrate(); m.textContent = res + ' — أنت ' + mc + ' وكلمات ' + op.name + ' ' + oc + ' من ' + tot + '.';
    if (rc.isHost()) cwBtn.hidden = false;
  }
  function cwSync() {
    if (!rc || !rR) return;
    var s = rR.s;
    if (rR.status === 'playing' && s.r && s.r !== cLast && s.p) {
      cLast = s.r; LIMIT = JoRoom.num(s.t, 60, 1800, 600); sent = -1; myFt = 0;
      build({ R: s.p.R, C: s.p.C, words: s.p.w.map(function (a) { return { ch: a[0].split(''), clue: a[1], r: a[2], c: a[3], d: a[4] }; }) });
      $('cwPlay').hidden = false; cwBtn.hidden = true;
      $('cwMsg').textContent = '⏱ بدأ السباق! أكمل كل الكلمات قبل منافسك. المهلة ' + Math.round(LIMIT / 60) + ' دقائق.';
    }
  }
  function cwStart(c) {
    var p = gen((cCatSel && cCatSel.value) || MIX);
    var r = ((c.room && c.room.s && c.room.s.r) || 0) + 1;
    c.setState({ r: r, p: { R: p.R, C: p.C, w: p.words.map(function (w) { return [w.ch.join(''), w.clue, w.r, w.c, w.d]; }) }, t: JoRoom.num(JoRoom.cfg('cw').seconds, 60, 1800, 600) }, 'playing');
  }
  cwBtn.addEventListener('click', function () { cwBtn.hidden = true; cwStart(rc); });
  if (window.JoRoom) JoRoom.mount($('cwRoom'), {
    game: 'cw', min: 2, max: 2, shareText: 'تعال نتسابق في لعبة الكلمات المتقاطعة',
    hostExtra: function () {
      var w = document.createElement('div');
      if (!cCatSel) {
        cCatSel = document.createElement('select'); cCatSel.className = 'jr-in';
        [MIX].concat(Object.keys(B)).forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = 'الفئة: ' + n; cCatSel.appendChild(o); });
      }
      w.appendChild(cCatSel); return w;
    },
    onHostStart: function (c) { cwStart(c); },
    onJoin: function (c) {
      rc = c; rR = null; cLast = 0; clearInterval(tm); done = true;
      soloEls.forEach(function (id) { $(id).hidden = true; }); $('cwB').parentNode.hidden = true; $('cwPlay').hidden = true;
      $('cwMsg').textContent = 'بانتظار بدء السباق…';
    },
    onPlayers: function () { if (!rc || !cLast) return; var op = cwOpp(); if (!done && op && op.sr === cLast && op.sc === words.length) cwOver(); else cwRes(); },
    onRoom: function (r) { rR = r; cwSync(); },
    onLeave: function () {
      rc = null; rR = null; cLast = 0; cwBtn.hidden = true;
      soloEls.forEach(function (id) { $(id).hidden = false; }); $('cwB').parentNode.hidden = false; $('cwPlay').hidden = false; build();
    }
  });
  build();
})();
`
};

const CHINESE_GENDER = {
  icon: '👶', bg: '#fce7f3', grad: '#db2777,#831843', title: 'الجدول الصيني لتوقّع جنس المولود', h1: 'الجدول الصيني لتوقّع جنس المولود 👶',
  sub: 'اكتب تاريخ ميلاد الأم وتاريخ الحمل، وانظر ماذا يتوقّع الجدول الصيني الشهير: ولد أم بنت',
  desc: 'الجدول الصيني لمعرفة جنس المولود (ولد أو بنت) حسب عمر الأم القمري وشهر الحمل القمري. للتسلية فقط وليس فحصاً طبياً، ويتم تحويل التاريخ إلى التقويم الصيني تلقائياً.',
  kw: 'الجدول الصيني, الجدول الصيني لمعرفة جنس الجنين, التقويم الصيني ولد أو بنت, معرفة جنس المولود, Chinese gender chart',
  search: 'الجدول الصيني جنس الجنين ولد بنت حمل توقع الجنس تقويم صيني chinese gender calendar chart',
  cardDesc: 'توقّع ولد أم بنت بالجدول الصيني الشهير (للتسلية فقط)', cat: 'health',
  faq: [
    ['ما الجدول الصيني لمعرفة جنس المولود؟', 'جدول شعبي قديم يُنسب إلى الصين، يربط بين عمر الأم القمري وشهر الحمل في التقويم الصيني، ويعطي توقعاً بولد أو بنت.'],
    ['هل الجدول الصيني دقيق؟', 'لا. لا يوجد دليل علمي عليه، ونسبة صحته قريبة من الصدفة (نحو النصف). استخدمه للتسلية فقط، ولا تبنِ عليه أي قرار.'],
    ['كيف أعرف جنس المولود فعلاً؟', 'بفحص السونار عند الطبيب، وفي حالات خاصة بالفحوص الجينية التي يطلبها الطبيب.'],
    ['ما العمر القمري؟', 'يُحسب بالسنوات الصينية: يولد الإنسان في سنته الأولى، ويزيد عمره سنة مع كل رأس سنة صينية جديدة. لذلك قد يزيد عمرك القمري سنة أو سنتين عن عمرك الميلادي. تحسب الأداة ذلك تلقائياً.'],
    ['لماذا تختلف نتيجة الجدول بين المواقع؟', 'تنتشر عدة نسخ من الجدول، وتختلف بعض خلاياه قليلاً. اعتمدنا النسخة التي تتطابق في عدة مواقع، لكنها تبقى للتسلية.'],
    ['ماذا لو كان الشهر القمري مكرراً (كبيساً)؟', 'إذا وقع الحمل في شهر قمري مكرر نستخدم رقم الشهر نفسه، وهو المعتاد في هذه الجداول.']
  ],
  how: ['اكتب تاريخ ميلاد الأم.', 'اكتب تاريخ الحمل، أو أول يوم من آخر دورة شهرية وسنضيف 14 يوماً.', 'تحوّل الأداة التواريخ إلى التقويم الصيني وتحسب العمر القمري وشهر الحمل القمري.', 'تقرأ الخلية المناسبة من الجدول: B ولد، G بنت.'],
  rel: [['jo/health/pregnancy-due-date/', '🤰 موعد الولادة المتوقع'], ['jo/tools/crossword/', '🧩 الكلمات المتقاطعة'], ['jo/tools/word-search/', '🔍 البحث عن الكلمات']],
  main: CSS + String.raw`
    <style>
      .cg-w{overflow-x:auto;margin-top:10px;}
      .cg-t{border-collapse:collapse;font-size:12px;text-align:center;margin:0 auto;}
      .cg-t th,.cg-t td{border:1px solid var(--border);padding:4px 6px;min-width:26px;}
      .cg-t th{background:var(--surface-2);}
      .cg-t td.b{background:rgba(37,99,235,.14);} .cg-t td.g{background:rgba(219,39,119,.14);}
      .cg-t td.hit{outline:3px solid #f59e0b;font-weight:800;}
      .cg-r{display:flex;gap:10px;margin-top:12px;} .cg-r div{flex:1;text-align:center;padding:10px;border-radius:10px;background:var(--surface-2);font-size:12px;color:var(--text-muted);} .cg-r b{display:block;font-size:20px;color:var(--text);}
    </style>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:var(--radius-sm);padding:10px 14px;font-size:13px;color:#92400e;line-height:1.7;margin-bottom:14px;">
      ⚠️ للتسلية فقط. لا يوجد دليل علمي على الجدول الصيني، ونسبة صحته قريبة من الصدفة. جنس المولود يُعرف بفحص السونار عند الطبيب.
    </div>
    <div class="row">
      <div><label>تاريخ ميلاد الأم</label><input type="date" id="cgB"></div>
      <div><label>التاريخ الذي تعرفه</label><select id="cgK"><option value="c">تاريخ الحمل</option><option value="l">أول يوم من آخر دورة (نضيف 14 يوماً)</option></select></div>
    </div>
    <div class="row" style="margin-top:10px;">
      <div><label>التاريخ</label><input type="date" id="cgC"></div>
    </div>
    <button type="button" class="pt-btn" id="cgGo" style="width:100%;margin-top:14px;">👶 اعرف التوقع</button>
    <div id="cgErr" style="display:none;margin-top:14px;padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:var(--radius-sm);font-size:13px;color:#991b1b;line-height:1.7;"></div>
    <div id="cgRes" style="display:none;margin-top:18px;">
      <div class="result-box show" style="margin-top:0;"><div class="result-value" id="cgMain"></div><div class="result-label">حسب الجدول الصيني (للتسلية)</div></div>
      <div class="cg-r"><div><b id="cgAge">-</b>العمر القمري للأم</div><div><b id="cgMon">-</b>شهر الحمل القمري</div></div>
      <button type="button" class="pt-btn2" id="cgCopy" style="width:100%;margin-top:10px;">📋 انسخ النتيجة</button>
    </div>
    <details style="margin-top:16px;"><summary style="cursor:pointer;font-weight:700;">عرض الجدول كاملاً</summary>
      <div class="cg-w"><table class="cg-t" id="cgT"></table></div>
      <p class="pt-note">B ولد، G بنت. الصفوف: العمر القمري للأم، والأعمدة: شهر الحمل القمري.</p>
    </details>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var T = ["GBGBBBBBBBBB","BGBGGBBBBBGG","GBGBBBBBBGBB","BGGGGGGGGGGG","GBBGBGGBGGGG","BBGBBGBGBBBG","BGBBGBBGGGGG","GBBGGBGBBBBB","BGBGGBGBGGGG","GBGBGGBBBBGB","BGBGGGBBBBGG","GBGGBBBBBGGG","BGGGGGGGGGBB","BGBGGGGGGGGB","BGBGGGGGGGGB","GBGBGGGBGGGB","BGBGGGGGGGBB","BBGBGGGBGGBB","GBBGBGGGBBBB","BGBBGBGBGBGB","GBGBBGBGBGBG","BGBBBGGBGBGG","GBGBGBBGBGBG","BGBGBGBBGBGB","GBGBGBGBBGBG","BGBGBGBGBBBB","BBGBBBGBGBGG","GBBGGGBGBGBB"];
  var cf = null;
  try { cf = new Intl.DateTimeFormat('en-u-ca-chinese', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }); } catch (e) {}
  function lun(ds) {
    var o = {}; cf.formatToParts(new Date(ds + 'T12:00:00Z')).forEach(function (p) { o[p.type] = p.value; });
    return { m: parseInt(o.month, 10), y: parseInt(o.relatedYear, 10) };
  }
  function addDays(ds, n) { var d = new Date(ds + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  var tb = $('cgT'), h = '<tr><th></th>', a, m;
  for (m = 1; m <= 12; m++) h += '<th>' + m + '</th>';
  h += '</tr>';
  for (a = 18; a <= 45; a++) { h += '<tr><th>' + a + '</th>'; for (m = 1; m <= 12; m++) { var ch = T[a - 18].charAt(m - 1); h += '<td class="' + ch.toLowerCase() + '" data-k="' + a + '-' + m + '">' + ch + '</td>'; } h += '</tr>'; }
  tb.innerHTML = h;
  function err(t) { var e = $('cgErr'); e.textContent = t; e.style.display = t ? 'block' : 'none'; $('cgRes').style.display = 'none'; }
  var last = '';
  $('cgGo').addEventListener('click', function () {
    var b = $('cgB').value, c = $('cgC').value;
    if (!cf) { err('متصفحك لا يدعم التقويم الصيني، جرّب متصفحاً أحدث.'); return; }
    if (!b || !c) { err('اكتب تاريخ ميلاد الأم والتاريخ المطلوب.'); return; }
    if ($('cgK').value === 'l') c = addDays(c, 14);
    if (c <= b) { err('تاريخ الحمل يجب أن يكون بعد تاريخ ميلاد الأم.'); return; }
    var lb = lun(b), lc = lun(c), age = lc.y - lb.y + 1;
    if (isNaN(age) || isNaN(lc.m)) { err('تعذّر تحويل التاريخ إلى التقويم الصيني.'); return; }
    if (age < 18 || age > 45) { err('الجدول يغطي الأعمار القمرية من 18 إلى 45 فقط، وعمرها القمري هنا ' + age + '.'); return; }
    var g = T[age - 18].charAt(lc.m - 1), boy = g === 'B';
    err('');
    $('cgMain').textContent = boy ? '👦 ولد' : '👧 بنت';
    $('cgAge').textContent = age; $('cgMon').textContent = lc.m; $('cgRes').style.display = 'block';
    tb.querySelectorAll('td.hit').forEach(function (x) { x.classList.remove('hit'); });
    var cell = tb.querySelector('td[data-k="' + age + '-' + lc.m + '"]'); if (cell) cell.classList.add('hit');
    last = 'الجدول الصيني (للتسلية) يتوقّع: ' + (boy ? 'ولد' : 'بنت') + ' — العمر القمري ' + age + '، شهر الحمل القمري ' + lc.m + '. https://adawati.space/jo/tools/chinese-gender-chart/';
  });
  $('cgCopy').addEventListener('click', function () {
    var bt = this; try { navigator.clipboard.writeText(last).then(function () { bt.textContent = '✅ تم النسخ'; setTimeout(function () { bt.textContent = '📋 انسخ النتيجة'; }, 1500); }); } catch (e) {}
  });
})();
`
};

module.exports = { 'crossword': CROSSWORD, 'chinese-gender-chart': CHINESE_GENDER };
