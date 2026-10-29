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

const SUDOKU = {
  icon: '🔢', bg: '#e0f2fe', grad: '#0369a1,#082f49', title: 'لعبة سودوكو', h1: 'لعبة سودوكو 🔢',
  sub: 'املأ الشبكة بالأرقام من ١ إلى ٩ دون تكرار في الصف والعمود والمربع. ثلاثة مستويات وتلميحات',
  desc: 'سودوكو مجانية بالعربية: ثلاثة مستويات سهل ومتوسط وصعب، كل لغز له حل واحد، مع مؤقت وتلميحات وتظليل للأخطاء. العب على الجوال أو الحاسوب.',
  kw: 'سودوكو, لعبة سودوكو, سودوكو عربي, sudoku, العاب ذكاء, لعبة الارقام',
  search: 'سودوكو sudoku لعبة ارقام ذكاء الغاز منطق تسلية',
  cardDesc: 'ألغاز سودوكو بثلاثة مستويات مع تلميحات ومؤقت', cat: 'games',
  faq: [
    ['ما قاعدة سودوكو؟', 'املأ كل خلية فارغة برقم من 1 إلى 9 بحيث لا يتكرر الرقم في أي صف ولا عمود ولا مربع من المربعات التسعة الصغيرة.'],
    ['هل لكل لغز حل واحد؟', 'نعم، تُولَّد الألغاز بحيث يكون لكل منها حل واحد فقط، فلا حاجة للتخمين.'],
    ['ما الفرق بين المستويات؟', 'كلما قلّ عدد الأرقام الظاهرة صعب اللغز: سهل نحو 40 رقماً، متوسط نحو 32، صعب نحو 26.'],
    ['كيف يعمل التلميح؟', 'يملأ لك الخلية المحددة بالرقم الصحيح، ويُسجَّل عدد التلميحات المستخدمة.'],
    ['هل يُحفظ تقدمي؟', 'لا، يبدأ لغز جديد عند فتح الصفحة، لكن أفضل وقت لكل مستوى يُحفظ في متصفحك.']
  ],
  how: ['اضغط خلية فارغة.', 'اضغط الرقم من اللوحة أو اكتبه من لوحة المفاتيح.', 'تظلَّل الأخطاء بالأحمر.', 'أكمل الشبكة لتفوز واحفظ أفضل وقت.'],
  rel: [['jo/tools/xo-game/', '❌ لعبة XO'], ['jo/games/wordle/', '🟩 ووردل بالعربي'], ['memory-game.html', '🧠 لعبة الذاكرة']],
  main: CSS + String.raw`
    <style>
      .sd-g{display:grid;grid-template-columns:repeat(9,1fr);width:min(400px,100%);margin:14px auto 0;border:3px solid var(--text);direction:ltr;}
      .sd-g button{aspect-ratio:1;border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:inherit;font-size:clamp(16px,5vw,24px);font-weight:700;padding:0;cursor:pointer;line-height:1;}
      .sd-g button.gv{background:var(--surface-2);font-weight:800;}
      .sd-g button.r3{border-right:3px solid var(--text);} .sd-g button.b3{border-bottom:3px solid var(--text);}
      .sd-g button.hl{background:#dbeafe;color:#111;} .sd-g button.sel{background:#bfdbfe;color:#111;outline:2px solid #2563eb;outline-offset:-2px;} .sd-g button.bad{background:#fecaca;color:#7f1d1d;} .sd-g button.usr{color:#2563eb;}
      .sd-p{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:min(400px,100%);margin:12px auto 0;direction:ltr;}
      .sd-p button{padding:12px 0;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:20px;font-weight:800;cursor:pointer;}
    </style>
    <div class="pt-row"><button type="button" class="pt-btn2" data-d="40">سهل</button><button type="button" class="pt-btn2 on" data-d="32">متوسط</button><button type="button" class="pt-btn2" data-d="26">صعب</button></div>
    <div class="pt-stat"><div><b id="sdT">0:00</b>الوقت</div><div><b id="sdH">0</b>التلميحات</div><div><b id="sdB">--</b>أفضل وقت</div></div>
    <div class="sd-g" id="sdG"></div>
    <div class="sd-p" id="sdP"></div>
    <div class="pt-row" style="justify-content:center;margin-top:12px;"><button type="button" class="pt-btn2" id="sdHint">💡 تلميح</button><button type="button" class="pt-btn" id="sdNew">🔄 لغز جديد</button></div>
    <div class="pt-note" id="sdMsg" aria-live="polite"></div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_sudoku_best', BEST = {}, clues = 32, sol, puz, cur, sel = -1, hints = 0, t0, tm, done = false, cells = [];
  try { BEST = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function makeSolved() {
    var base = [], r, c, g = shuf([0, 1, 2]), rows = [], cols = [], d = shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    g.forEach(function (x) { shuf([0, 1, 2]).forEach(function (y) { rows.push(x * 3 + y); }); });
    shuf([0, 1, 2]).forEach(function (x) { shuf([0, 1, 2]).forEach(function (y) { cols.push(x * 3 + y); }); });
    for (r = 0; r < 9; r++) for (c = 0; c < 9; c++) base.push(d[(Math.floor(rows[r] % 3) * 3 + Math.floor(rows[r] / 3) + cols[c]) % 9]);
    return base;
  }
  function ok(b, i, v) {
    var r = Math.floor(i / 9), c = i % 9, k, br = r - r % 3, bc = c - c % 3;
    for (k = 0; k < 9; k++) { if (b[r * 9 + k] === v || b[k * 9 + c] === v || b[(br + Math.floor(k / 3)) * 9 + bc + k % 3] === v) return false; }
    return true;
  }
  function count(b, lim) {
    var best = -1, bc = 10, i, v, n;
    for (i = 0; i < 81; i++) if (!b[i]) { n = 0; for (v = 1; v <= 9; v++) if (ok(b, i, v)) n++; if (n < bc) { bc = n; best = i; if (n <= 1) break; } }
    if (best < 0) return 1;
    var tot = 0;
    for (v = 1; v <= 9 && tot < lim; v++) if (ok(b, best, v)) { b[best] = v; tot += count(b, lim - tot); b[best] = 0; }
    return tot;
  }
  function build() {
    sol = makeSolved(); puz = sol.slice();
    var order = shuf(Array.apply(null, { length: 81 }).map(function (_, i) { return i; })), left = 81;
    for (var k = 0; k < 81 && left > clues; k++) {
      var i = order[k], v = puz[i]; puz[i] = 0;
      if (count(puz.slice(), 2) !== 1) puz[i] = v; else left--;
    }
    cur = puz.slice(); sel = -1; hints = 0; done = false; t0 = Date.now(); $('sdH').textContent = 0; $('sdMsg').textContent = '';
    clearInterval(tm); tm = setInterval(tick, 1000); tick(); paint();
  }
  function tick() { var s = Math.floor((Date.now() - t0) / 1000); $('sdT').textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function paint() {
    var sr = sel >= 0 ? Math.floor(sel / 9) : -1, sc = sel >= 0 ? sel % 9 : -1, sb = sel >= 0 ? Math.floor(sr / 3) * 3 + Math.floor(sc / 3) : -1;
    cells.forEach(function (e, i) {
      var r = Math.floor(i / 9), c = i % 9, cls = [];
      if (puz[i]) cls.push('gv'); else if (cur[i]) cls.push('usr');
      if (c % 3 === 2 && c < 8) cls.push('r3'); if (r % 3 === 2 && r < 8) cls.push('b3');
      if (sel >= 0 && (r === sr || c === sc || Math.floor(r / 3) * 3 + Math.floor(c / 3) === sb)) cls.push('hl');
      if (i === sel) cls.push('sel');
      if (cur[i] && cur[i] !== sol[i]) cls.push('bad');
      e.className = cls.join(' '); e.textContent = cur[i] || '';
    });
  }
  function put(v) {
    if (done || sel < 0 || puz[sel]) return;
    cur[sel] = v; paint();
    if (cur.every(function (x, i) { return x === sol[i]; })) {
      done = true; clearInterval(tm); var s = Math.floor((Date.now() - t0) / 1000), b = BEST[clues];
      $('sdMsg').textContent = '🎉 أحسنت! أنجزت اللغز في ' + $('sdT').textContent + (hints ? ' باستخدام ' + hints + ' تلميح' : '') + '.';
      if (!hints && (!b || s < b)) { BEST[clues] = s; try { localStorage.setItem(KEY, JSON.stringify(BEST)); } catch (e) {} best(); }
    }
  }
  function best() { var b = BEST[clues]; $('sdB').textContent = b ? Math.floor(b / 60) + ':' + ('0' + b % 60).slice(-2) : '--'; }
  var g = $('sdG'), p = $('sdP');
  for (var k = 0; k < 81; k++) (function (i) { var e = document.createElement('button'); e.type = 'button'; e.setAttribute('aria-label', 'خلية ' + (i + 1)); e.addEventListener('click', function () { sel = i; paint(); }); g.appendChild(e); cells.push(e); })(k);
  for (var n = 1; n <= 9; n++) (function (v) { var b = document.createElement('button'); b.type = 'button'; b.textContent = v; b.addEventListener('click', function () { put(v); }); p.appendChild(b); })(n);
  var er = document.createElement('button'); er.type = 'button'; er.textContent = '⌫'; er.setAttribute('aria-label', 'مسح'); er.addEventListener('click', function () { put(0); }); p.appendChild(er);
  document.addEventListener('keydown', function (e) {
    var m = e.key.replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; });
    if (/^[1-9]$/.test(m)) put(+m); else if (e.key === 'Backspace' || e.key === 'Delete' || m === '0') put(0);
    else if (sel >= 0 && /^Arrow/.test(e.key)) { e.preventDefault(); var d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -9, ArrowDown: 9 }[e.key], n2 = sel + d; if (n2 >= 0 && n2 < 81 && !(Math.abs(d) === 1 && Math.floor(n2 / 9) !== Math.floor(sel / 9))) { sel = n2; paint(); } }
  });
  $('sdHint').addEventListener('click', function () { if (done || sel < 0 || puz[sel] || cur[sel] === sol[sel]) { $('sdMsg').textContent = 'حدّد خلية فارغة أو خاطئة أولاً.'; return; } hints++; $('sdH').textContent = hints; $('sdMsg').textContent = ''; put(sol[sel]); });
  $('sdNew').addEventListener('click', build);
  document.querySelectorAll('[data-d]').forEach(function (e) { e.addEventListener('click', function () { clues = +e.getAttribute('data-d'); document.querySelectorAll('[data-d]').forEach(function (x) { x.classList.toggle('on', x === e); }); best(); build(); }); });
  best(); build();
})();
`
};

const WSEARCH = {
  icon: '🔍', bg: '#dcfce7', grad: '#15803d,#052e16', title: 'لعبة البحث عن الكلمات', h1: 'لعبة البحث عن الكلمات 🔍',
  sub: 'ابحث عن الكلمات العربية المخفية بين الحروف أفقياً وعمودياً وقطرياً قبل أن يمضي الوقت',
  desc: 'لعبة البحث عن الكلمات (حروف متشابكة) بالعربية: شبكة جديدة في كل مرة بفئات متنوعة، اضغط أول حرف ثم آخر حرف لتحديد الكلمة. مؤقت وأفضل وقت.',
  kw: 'البحث عن الكلمات, لعبة الكلمات المتقاطعة, حروف متشابكة, لعبة كلمات عربي, word search arabic',
  search: 'البحث عن الكلمات كلمات متقاطعة حروف متشابكة لعبة كلمات عربي word search تسلية',
  cardDesc: 'اعثر على الكلمات المخفية بين الحروف العربية', cat: 'games',
  faq: [
    ['كيف أحدّد الكلمة؟', 'اضغط على أول حرف في الكلمة ثم على آخر حرف فيها. إن كانت الكلمة صحيحة فستُلوَّن وتُشطب من القائمة.'],
    ['بأي اتجاهات تختبئ الكلمات؟', 'أفقياً من اليمين إلى اليسار، وعمودياً من الأعلى إلى الأسفل، وقطرياً بالاتجاهين نحو الأسفل.'],
    ['هل الشبكة تتغير كل مرة؟', 'نعم، تُولَّد شبكة جديدة وكلمات مختلفة في كل مرة.'],
    ['ما الفئات؟', 'حيوانات، فواكه، دول، مهن.'],
    ['هل أحتاج إنترنت؟', 'لا، تعمل بعد تحميل الصفحة.']
  ],
  how: ['اختر فئة.', 'ابحث عن كلمات القائمة داخل الشبكة.', 'اضغط على أول حرف ثم آخر حرف.', 'أكمل كل الكلمات لتسجّل وقتك.'],
  rel: [['jo/tools/hangman-ar/', '🔤 لعبة المشنقة'], ['jo/games/wordle/', '🟩 ووردل بالعربي'], ['jo/tools/sudoku/', '🔢 سودوكو']],
  main: CSS + String.raw`
    <style>
      .ws-g{display:grid;grid-template-columns:repeat(10,1fr);width:min(400px,100%);margin:14px auto 0;direction:rtl;gap:2px;}
      .ws-g button{aspect-ratio:1;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text);font-family:inherit;font-size:clamp(14px,4.4vw,21px);font-weight:700;padding:0;cursor:pointer;line-height:1;}
      .ws-g button.s{background:#fde68a;color:#111;} .ws-g button.f{background:#86efac;color:#052e16;}
      .ws-l{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:12px;}
      .ws-l span{padding:5px 10px;border-radius:8px;background:var(--surface-2);font-weight:700;font-size:14px;} .ws-l span.f{text-decoration:line-through;opacity:.5;}
    </style>
    <div class="pt-row" id="wsCats"></div>
    <div class="pt-stat"><div><b id="wsT">0:00</b>الوقت</div><div><b id="wsF">0/0</b>الكلمات</div><div><b id="wsB">--</b>أفضل وقت</div></div>
    <div class="ws-g" id="wsG"></div>
    <div class="ws-l" id="wsL"></div>
    <div class="pt-row" style="justify-content:center;margin-top:12px;"><button type="button" class="pt-btn" id="wsNew">🔄 شبكة جديدة</button></div>
    <div class="pt-note" id="wsMsg" aria-live="polite"></div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var W = {
    'حيوانات': ['أسد', 'نمر', 'ذئب', 'ثعلب', 'غزال', 'زرافة', 'فيل', 'جمل', 'حصان', 'قرد', 'كلب', 'قطة', 'أرنب', 'نسر', 'صقر', 'دلفين', 'ضفدع', 'تمساح'],
    'فواكه': ['تفاح', 'موز', 'عنب', 'مشمش', 'خوخ', 'رمان', 'بطيخ', 'شمام', 'ليمون', 'تمر', 'تين', 'كمثرى', 'برتقال', 'فراولة', 'جوافة', 'كرز'],
    'دول': ['الأردن', 'مصر', 'سوريا', 'لبنان', 'العراق', 'السعودية', 'الكويت', 'قطر', 'عمان', 'اليمن', 'ليبيا', 'تونس', 'المغرب', 'السودان', 'تركيا', 'فرنسا'],
    'مهن': ['طبيب', 'معلم', 'مهندس', 'طيار', 'شرطي', 'طباخ', 'نجار', 'محامي', 'صحفي', 'مزارع', 'ممرض', 'رسام', 'مصور', 'حلاق', 'محاسب', 'خياط']
  };
  var N = 10, KEY = 'adawati_wsearch_best', BEST = {}, cat = 'حيوانات', grid, words, found, cells = [], first = -1, t0, tm, done = false;
  var LET = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
  try { BEST = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nz(s) { return s.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'); }
  var DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];
  function place(w) {
    var tries = 0;
    while (tries++ < 200) {
      var d = DIRS[Math.floor(Math.random() * 4)], r = Math.floor(Math.random() * N), c = Math.floor(Math.random() * N), i, rr, cc, okp = true;
      for (i = 0; i < w.length; i++) { rr = r + d[0] * i; cc = c + d[1] * i; if (rr < 0 || rr >= N || cc < 0 || cc >= N || (grid[rr * N + cc] && grid[rr * N + cc] !== w[i])) { okp = false; break; } }
      if (okp) { for (i = 0; i < w.length; i++) grid[(r + d[0] * i) * N + c + d[1] * i] = w[i]; return true; }
    }
    return false;
  }
  function build() {
    var ok = false, pool;
    while (!ok) {
      grid = new Array(N * N).fill(''); pool = shuf(W[cat].slice()).slice(0, 8); words = [];
      pool.forEach(function (w) { var n = nz(w).replace(/ /g, ''); if (n.length <= N && place(n.split(''))) words.push({ w: w, n: n }); });
      ok = words.length >= 6;
    }
    grid = grid.map(function (x) { return x || LET[Math.floor(Math.random() * LET.length)]; });
    found = {}; first = -1; done = false; t0 = Date.now(); $('wsMsg').textContent = '';
    clearInterval(tm); tm = setInterval(tick, 1000); tick(); paint(); list(); best();
  }
  function tick() { var s = Math.floor((Date.now() - t0) / 1000); $('wsT').textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function best() { var b = BEST[cat]; $('wsB').textContent = b ? Math.floor(b / 60) + ':' + ('0' + b % 60).slice(-2) : '--'; }
  var fcells = {};
  function paint() { cells.forEach(function (e, i) { e.textContent = grid[i]; e.className = fcells[i] ? 'f' : (i === first ? 's' : ''); }); }
  function list() {
    var l = $('wsL'); l.innerHTML = '';
    words.forEach(function (x) { var s = document.createElement('span'); s.textContent = x.w; if (found[x.n]) s.className = 'f'; l.appendChild(s); });
    $('wsF').textContent = Object.keys(found).length + '/' + words.length;
  }
  function tap(i) {
    if (done) return;
    if (first < 0) { first = i; paint(); return; }
    var r1 = Math.floor(first / N), c1 = first % N, r2 = Math.floor(i / N), c2 = i % N, dr = r2 - r1, dc = c2 - c1;
    var len = Math.max(Math.abs(dr), Math.abs(dc)) + 1, line = [];
    if (i === first || !(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) { first = i === first ? -1 : i; paint(); return; }
    var sr = Math.sign(dr), sc = Math.sign(dc), k, s = '';
    for (k = 0; k < len; k++) { var idx = (r1 + sr * k) * N + c1 + sc * k; line.push(idx); s += grid[idx]; }
    var rev = s.split('').reverse().join(''), hit = null;
    words.forEach(function (x) { if (!found[x.n] && (x.n === s || x.n === rev)) hit = x; });
    first = -1;
    if (hit) {
      found[hit.n] = true; line.forEach(function (j) { fcells[j] = true; });
      if (Object.keys(found).length === words.length) {
        done = true; clearInterval(tm); var sec = Math.floor((Date.now() - t0) / 1000);
        $('wsMsg').textContent = '🎉 أحسنت! وجدت كل الكلمات في ' + $('wsT').textContent + '.';
        if (!BEST[cat] || sec < BEST[cat]) { BEST[cat] = sec; try { localStorage.setItem(KEY, JSON.stringify(BEST)); } catch (e) {} best(); }
      }
      list();
    } else $('wsMsg').textContent = 'ليست من الكلمات المطلوبة، جرّب مجدداً.';
    paint();
  }
  var g = $('wsG');
  for (var k = 0; k < N * N; k++) (function (i) { var e = document.createElement('button'); e.type = 'button'; e.addEventListener('click', function () { tap(i); }); g.appendChild(e); cells.push(e); })(k);
  var box = $('wsCats');
  Object.keys(W).forEach(function (k2) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-btn2' + (k2 === cat ? ' on' : ''); b.textContent = k2;
    b.addEventListener('click', function () { cat = k2; box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); fcells = {}; build(); });
    box.appendChild(b);
  });
  $('wsNew').addEventListener('click', function () { fcells = {}; build(); });
  build();
})();
`
};

module.exports = { 'sudoku': SUDOKU, 'word-search': WSEARCH };
