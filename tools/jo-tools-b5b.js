const CSS = String.raw`
    <style>
      .pt-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
      .pt-in{width:100%;padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;min-width:0;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;}
      .pt-btn2{padding:9px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:13px;cursor:pointer;}
      .pt-btn2.on{background:#2563eb;color:#fff;border-color:#2563eb;}
      .pt-note{font-size:13px;color:var(--text-muted);margin-top:10px;min-height:18px;line-height:1.7;text-align:center;}
      .pt-big{margin-top:12px;padding:16px 12px;border-radius:14px;background:var(--surface-2);text-align:center;font-size:20px;font-weight:800;line-height:1.7;}
      .pt-stat{display:flex;gap:10px;margin-top:12px;}
      .pt-stat div{flex:1;text-align:center;padding:8px;border-radius:10px;background:var(--surface-2);font-size:12px;color:var(--text-muted);}
      .pt-stat b{display:block;font-size:20px;color:var(--text);}
    </style>`;

const MORE = {
  icon: '🤔', bg: '#e0e7ff', grad: '#4f46e5,#1e1b4b', title: 'لعبة أيهما أكثر؟', h1: 'لعبة أيهما أكثر؟ 🤔',
  sub: 'اختر الأكبر أو الأعلى أو الأبعد بين خيارين، وكم تستطيع أن تحقق من الإجابات الصحيحة المتتالية؟ أو تسابق أصدقاءك أونلاين.',
  desc: 'لعبة أيهما أكثر؟ قارن بين جبال ودول وكواكب وأنهار وخمّن الأكبر أو الأعلى. سلسلة إجابات متتالية ورقم قياسي يحفظه متصفحك.',
  kw: 'لعبة أيهما أكثر, لعبة معلومات عامة, لعبة تخمين, اسئلة ثقافية, لعبة المقارنة',
  search: 'ايهما اكثر لعبة تخمين معلومات عامة مقارنة اكبر اعلى دول جبال كواكب',
  cardDesc: 'خمّن أيّ الخيارين أكبر وحافظ على سلسلتك', cat: 'games',
  faq: [
    ['كيف تُلعب؟', 'يظهر لك عنصران، وعليك أن تختار الأكبر أو الأعلى أو الأبعد حسب السؤال. كل إجابة صحيحة تزيد سلسلتك، وخطأ واحد ينهي الجولة.'],
    ['هل الأرقام دقيقة؟', 'هي أرقام تقريبية مقرّبة من المصادر العامة المعروفة، وقد تختلف قليلاً بين مرجع وآخر. وتختار اللعبة عنصرين بينهما فرق واضح.'],
    ['هل يُحفظ رقمي القياسي؟', 'نعم، يُحفظ في متصفحك لكل فئة.'],
    ['ما الفئات المتوفرة؟', 'ارتفاع الجبال والمعالم، مساحة الدول، عدد السكان، أقطار الشمس والكواكب والقمر، وأطوال الأنهار.'],
    ['كيف ألعب مع أصدقائي؟', 'أنشئ غرفة أونلاين وأرسل الرابط (حتى ٤ لاعبين). تظهر الأسئلة نفسها للجميع وهي عشرة أسئلة؛ الفائز صاحب أكثر إجابات صحيحة، وعند التعادل الأسرع.'],
    ['هل أحتاج إنترنت؟', 'اللعب الفردي يعمل دون اتصال بعد تحميل الصفحة، أما السباق مع الأصدقاء فيحتاج إنترنت.']
  ],
  how: ['اختر الفئة.', 'اضغط على الخيار الذي تظنه الأكبر.', 'تظهر القيم الحقيقية بعد الإجابة.', 'استمر ما دامت إجاباتك صحيحة.'],
  rel: [['jo/tools/outsider-game/', '🕵️ برّا السالفة'], ['jo/games/', '🎯 مسابقات الأردن'], ['jo/tools/lucky-wheel/', '🎡 عجلة الحظ']],
  main: CSS + String.raw`
    <style>
      .wm-pair{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;}
      .wm-card{padding:22px 8px;border:2px solid var(--border);border-radius:14px;background:var(--surface);color:var(--text);font-family:inherit;font-size:19px;font-weight:800;cursor:pointer;text-align:center;line-height:1.6;}
      .wm-card small{display:block;font-size:14px;font-weight:700;margin-top:6px;min-height:20px;}
      .wm-card.ok{border-color:#16a34a;background:#dcfce7;color:#14532d;} .wm-card.no{border-color:#dc2626;background:#fee2e2;color:#7f1d1d;}
    </style>
    <div class="pt-row" id="wmCats"></div>
    <div class="pt-stat"><div><b id="wmS">0</b>السلسلة</div><div><b id="wmB">0</b>أفضل سلسلة</div></div>
    <div class="pt-big" id="wmQ"></div>
    <div class="wm-pair"><button type="button" class="wm-card" id="wmA"></button><button type="button" class="wm-card" id="wmBt"></button></div>
    <div class="pt-note" id="wmMsg"></div>
    <div class="pt-row" style="justify-content:center;"><button type="button" class="pt-btn" id="wmNext" hidden>التالي ←</button></div>
    <div class="pt-note" id="wmRank" style="white-space:pre-line;font-weight:700;"></div>
    <div id="wmRoom"></div>`,
  room: true,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var D = {
    h: { n: 'الارتفاع', q: 'أيهما أعلى؟', u: ' م', it: [['جبل إفرست', 8849], ['جبل كي 2', 8611], ['جبل أكونكاغوا', 6961], ['جبل دينالي', 6190], ['جبل كليمنجارو', 5895], ['جبل إلبروس', 5642], ['جبل مونت بلان', 4806], ['جبل ماترهورن', 4478], ['جبل فوجي', 3776], ['جبل الشيخ', 2814], ['جبل سانت كاترين', 2629], ['جبل أم الدامي', 1854], ['برج خليفة', 828], ['برج إيفل', 330], ['الهرم الأكبر', 139], ['تمثال الحرية', 93]] },
    a: { n: 'المساحة', q: 'أيهما أكبر مساحة؟', u: ' ألف كم²', it: [['روسيا', 17098], ['كندا', 9985], ['الولايات المتحدة', 9834], ['الصين', 9597], ['البرازيل', 8516], ['أستراليا', 7692], ['الهند', 3287], ['الجزائر', 2382], ['السعودية', 2150], ['السودان', 1886], ['مصر', 1010], ['تركيا', 784], ['فرنسا', 551], ['ألمانيا', 358], ['الأردن', 89], ['الكويت', 17.8], ['قطر', 11.6], ['لبنان', 10.5]] },
    p: { n: 'السكان', q: 'أيهما أكثر سكاناً؟', u: ' مليون تقريباً', it: [['الهند', 1430], ['الصين', 1410], ['الولايات المتحدة', 335], ['إندونيسيا', 277], ['باكستان', 240], ['نيجيريا', 224], ['البرازيل', 216], ['روسيا', 144], ['مصر', 112], ['تركيا', 85], ['ألمانيا', 84], ['فرنسا', 68], ['السعودية', 36], ['الأردن', 11], ['الإمارات', 10], ['الكويت', 4.3], ['قطر', 2.9]] },
    s: { n: 'الأجرام', q: 'أيهما أكبر قطراً؟', u: ' كم', it: [['الشمس', 1391000], ['المشتري', 139820], ['زحل', 116460], ['أورانوس', 50724], ['نبتون', 49244], ['الأرض', 12742], ['الزهرة', 12104], ['المريخ', 6779], ['عطارد', 4879], ['القمر', 3474]] },
    r: { n: 'الأنهار', q: 'أيهما أطول؟', u: ' كم تقريباً', it: [['نهر النيل', 6650], ['نهر الدانوب', 2850], ['نهر الفرات', 2800], ['نهر دجلة', 1900], ['نهر الراين', 1230], ['نهر التايمز', 346], ['نهر الأردن', 251]] }
  };
  var wmc = null, wmR = null, wmLast = 0, wmQs = [], wmI = 0, wmScore = 0, wmT0 = 0, wmCatSel = null, wmDone = false, QN = 10, KEY = 'adawati_whichmore_v1', BEST = {}, cur = 'h', streak = 0, pair = null, locked = false;
  try { BEST = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  function fmt(v) { return v.toLocaleString('en-US'); }
  function pickIdx(k) {
    var it = D[k].it, a, b, t = 0, ia, ib;
    do { ia = Math.floor(Math.random() * it.length); ib = Math.floor(Math.random() * it.length); a = it[ia]; b = it[ib]; t++; }
    while ((ia === ib || Math.max(a[1], b[1]) / Math.min(a[1], b[1]) < 1.12) && t < 200);
    return [ia, ib];
  }
  function pick() {
    var ix = pickIdx(cur);
    pair = [D[cur].it[ix[0]], D[cur].it[ix[1]]]; draw();
  }
  function draw() {
    locked = false;
    $('wmQ').textContent = D[cur].q;
    [['wmA', pair[0]], ['wmBt', pair[1]]].forEach(function (x) { var e = $(x[0]); e.className = 'wm-card'; e.textContent = x[1][0]; var s = document.createElement('small'); e.appendChild(s); });
    $('wmMsg').textContent = 'اضغط على إجابتك'; $('wmNext').hidden = true;
  }
  function stat() { $('wmS').textContent = streak; $('wmB').textContent = BEST[cur] || 0; }
  function ans(i) {
    if (locked) return; locked = true;
    var win = pair[0][1] > pair[1][1] ? 0 : 1, ok = i === win;
    ['wmA', 'wmBt'].forEach(function (id, k) { var e = $(id); e.querySelector('small').textContent = fmt(pair[k][1]) + D[cur].u; if (k === win) e.classList.add('ok'); else if (k === i) e.classList.add('no'); });
    if (wmc) { wmOnAns(ok); return; }
    if (ok) {
      streak++; if (streak > (BEST[cur] || 0)) { BEST[cur] = streak; try { localStorage.setItem(KEY, JSON.stringify(BEST)); } catch (e) {} }
      $('wmMsg').textContent = '✓ إجابة صحيحة!'; $('wmNext').textContent = 'التالي ←';
    } else { $('wmMsg').textContent = '✗ إجابة خاطئة. وصلت إلى سلسلة ' + streak + '.'; streak = 0; $('wmNext').textContent = '🔄 ابدأ من جديد'; }
    stat(); $('wmNext').hidden = false;
  }
  var box = $('wmCats');
  Object.keys(D).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-btn2' + (k === cur ? ' on' : ''); b.textContent = D[k].n;
    b.addEventListener('click', function () { cur = k; streak = 0; box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); stat(); pick(); });
    box.appendChild(b);
  });
  $('wmA').addEventListener('click', function () { ans(0); }); $('wmBt').addEventListener('click', function () { ans(1); });
  $('wmNext').addEventListener('click', function () { if (wmc) wmNextOn(); else pick(); });
  stat(); pick();
  function wmOnAns(ok) {
    if (ok) wmScore++;
    var n = wmI + 1;
    wmc.setMine({ sc: wmScore, pg: n, sr: wmLast, ft: Math.floor((Date.now() - wmT0) / 1000) });
    $('wmMsg').textContent = ok ? '✓ إجابة صحيحة!' : '✗ إجابة خاطئة.';
    $('wmNext').textContent = n >= wmQs.length ? '🏁 انتهيت' : 'التالي ←'; $('wmNext').hidden = false;
  }
  function wmNextOn() {
    wmI++;
    if (wmI >= wmQs.length) { wmDone = true; $('wmNext').hidden = true; $('wmMsg').textContent = 'أنهيت الأسئلة: ' + wmScore + ' من ' + wmQs.length + '.'; wmRank(); return; }
    wmShow();
  }
  function wmShow() {
    var q = wmQs[wmI]; cur = q[0];
    pair = [D[cur].it[q[1]], D[cur].it[q[2]]]; draw();
    $('wmMsg').textContent = 'سؤال ' + (wmI + 1) + ' من ' + wmQs.length;
  }
  function wmRank() {
    var r = $('wmRank'); if (!wmc || !wmLast) { r.textContent = ''; return; }
    var pl = wmc.players.filter(function (p) { return p.sr === wmLast; });
    pl.sort(function (a, b) { return (b.sc || 0) - (a.sc || 0) || (a.ft || 0) - (b.ft || 0); });
    var all = pl.length === wmc.players.length && pl.every(function (p) { return (p.pg || 0) >= wmQs.length; });
    var t = pl.map(function (p, i) { return (all && i === 0 ? '🏆 ' : '') + p.name + (p.id === wmc.pid ? ' (أنت)' : '') + ': ' + (p.sc || 0) + ' صحيحة — ' + (p.pg || 0) + '/' + wmQs.length; }).join('\n');
    if (all) t += '\n' + (pl.length > 1 && pl[0].sc === pl[1].sc && pl[0].ft === pl[1].ft ? '🤝 تعادل!' : 'انتهى السباق! الفائز: ' + pl[0].name);
    r.textContent = t; wmAgain.hidden = !(all && wmc.isHost());
  }
  var wmAgain = document.createElement('button'); wmAgain.type = 'button'; wmAgain.className = 'pt-btn'; wmAgain.hidden = true; wmAgain.textContent = '🔄 سباق جديد';
  $('wmNext').parentNode.appendChild(wmAgain);
  wmAgain.addEventListener('click', function () { wmStart(wmc); });
  function wmStart(c) {
    var keys = (wmCatSel && wmCatSel.value) ? [wmCatSel.value] : Object.keys(D), q = [], i, k;
    var qn = JoRoom.num(JoRoom.cfg('wm').questions, 5, 20, QN);
    for (i = 0; i < qn; i++) { k = keys[Math.floor(Math.random() * keys.length)]; var ix = pickIdx(k); q.push([k, ix[0], ix[1]]); }
    c.setState({ r: ((c.room && c.room.s && c.room.s.r) || 0) + 1, q: q }, 'playing');
  }
  function wmSync() {
    if (!wmc || !wmR) return;
    var s = wmR.s;
    if (wmR.status === 'playing' && s.r && s.r !== wmLast && s.q) {
      wmLast = s.r; wmQs = s.q; wmI = 0; wmScore = 0; wmDone = false; wmT0 = Date.now(); wmAgain.hidden = true;
      $('wmQ').hidden = false; document.querySelector('.wm-pair').hidden = false;
      wmc.setMine({ sc: 0, pg: 0, sr: wmLast, ft: 0 }); wmShow();
    }
  }
  if (window.JoRoom) JoRoom.mount($('wmRoom'), {
    game: 'wm', min: 2, max: 4, shareText: 'تعال نتسابق في لعبة أيهما أكثر؟',
    hostExtra: function () {
      var w = document.createElement('div');
      if (!wmCatSel) {
        wmCatSel = document.createElement('select'); wmCatSel.className = 'jr-in';
        var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'الفئة: منوّعة'; wmCatSel.appendChild(o0);
        Object.keys(D).forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = 'الفئة: ' + D[n].n; wmCatSel.appendChild(o); });
      }
      w.appendChild(wmCatSel); return w;
    },
    onHostStart: function (c) { wmStart(c); },
    onJoin: function (c) {
      wmc = c; wmR = null; wmLast = 0; locked = true; $('wmCats').hidden = true; document.querySelector('.pt-stat').hidden = true;
      $('wmQ').hidden = true; document.querySelector('.wm-pair').hidden = true; $('wmNext').hidden = true; $('wmMsg').textContent = 'بانتظار بدء السباق…';
    },
    onPlayers: function () { wmRank(); },
    onRoom: function (r) { wmR = r; wmSync(); },
    onLeave: function () {
      wmc = null; wmR = null; wmLast = 0; wmAgain.hidden = true; $('wmRank').textContent = '';
      $('wmCats').hidden = false; document.querySelector('.pt-stat').hidden = false; $('wmQ').hidden = false; document.querySelector('.wm-pair').hidden = false; streak = 0; stat(); pick();
    }
  });
})();
`
};

const HANG = {
  icon: '🔤', bg: '#fce7f3', grad: '#be185d,#500724', title: 'لعبة المشنقة بالعربي', h1: 'لعبة المشنقة بالعربي 🔤',
  sub: 'خمّن الكلمة حرفاً بحرف قبل أن تنفد محاولاتك. فئات متنوعة وكلمات عربية مألوفة',
  desc: 'لعبة المشنقة (هانغمان) بالعربية: خمّن الكلمة حرفاً حرفاً من فئات الحيوانات والفواكه والدول والمهن قبل انتهاء المحاولات الست.',
  kw: 'لعبة المشنقة, هانغمان عربي, لعبة تخمين الكلمات, لعبة كلمات, hangman arabic',
  search: 'لعبة المشنقة هانغمان تخمين كلمة حروف عربي فئات حيوانات فواكه دول مهن',
  cardDesc: 'خمّن الكلمة العربية حرفاً بحرف قبل أن تُشنق', cat: 'games',
  faq: [
    ['كم محاولة خاطئة مسموحة؟', 'ست محاولات، وفي كل خطأ يُرسم جزء جديد من الشكل.'],
    ['هل الهمزة والتاء المربوطة تُحسب؟', 'لتسهيل اللعب تُعامل الألف بأشكالها (أ إ آ) حرفاً واحداً، والتاء المربوطة كالهاء، والألف المقصورة كالياء.'],
    ['هل يمكنني اللعب بلوحة المفاتيح؟', 'نعم، اكتب الحرف العربي مباشرة أو اضغط على الحرف في اللوحة المعروضة.'],
    ['ما الفئات؟', 'حيوانات، فواكه وخضار، دول عربية، مهن، وأشياء من البيت.'],
    ['هل تُحفظ نتائجي؟', 'نعم، يحفظ متصفحك عدد انتصاراتك فقط.']
  ],
  how: ['اختر فئة.', 'اضغط حرفاً أو اكتبه من لوحة المفاتيح.', 'الحرف الصحيح يظهر في مكانه والخطأ يُنقص محاولاتك.', 'أكمل الكلمة قبل نفاد المحاولات.'],
  rel: [['jo/games/wordle/', '🟩 ووردل بالعربي'], ['jo/tools/xo-game/', '❌ لعبة XO'], ['jo/tools/outsider-game/', '🕵️ برّا السالفة']],
  main: CSS + String.raw`
    <style>
      .hg-w{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:14px 0;direction:rtl;}
      .hg-w span{width:38px;height:46px;border-bottom:4px solid var(--text);font-size:28px;font-weight:800;text-align:center;line-height:46px;}
      .hg-kb{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;direction:rtl;}
      .hg-kb button{width:40px;height:44px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);font-family:inherit;font-size:19px;font-weight:700;cursor:pointer;}
      .hg-kb button:disabled{opacity:.35;cursor:default;} .hg-kb button.g{background:#dcfce7;opacity:1;color:#14532d;} .hg-kb button.b{background:#fee2e2;opacity:1;color:#7f1d1d;}
      #hgSvg{display:block;margin:6px auto 0;max-width:180px;width:60%;} #hgSvg .p{display:none;stroke:var(--text);stroke-width:4;fill:none;stroke-linecap:round;} #hgSvg .f{stroke:var(--text);stroke-width:5;fill:none;stroke-linecap:round;}
    </style>
    <div class="pt-row" id="hgCats"></div>
    <svg id="hgSvg" viewBox="0 0 160 190" aria-hidden="true"><path class="f" d="M20 180H100M40 180V15H110V40"/><circle class="p" cx="110" cy="55" r="15"/><path class="p" d="M110 70V120"/><path class="p" d="M110 82L88 105"/><path class="p" d="M110 82L132 105"/><path class="p" d="M110 120L92 152"/><path class="p" d="M110 120L128 152"/></svg>
    <div class="pt-note" id="hgLives"></div>
    <div class="hg-w" id="hgWord" aria-live="polite"></div>
    <div class="hg-kb" id="hgKb"></div>
    <div class="pt-big" id="hgMsg" style="font-size:16px;"></div>
    <div class="pt-row" style="justify-content:center;margin-top:10px;"><button type="button" class="pt-btn" id="hgNew">🔄 كلمة جديدة</button></div>
    <div class="pt-note">الانتصارات: <b id="hgWins">0</b></div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var W = {
    'حيوانات': ['أسد', 'نمر', 'ذئب', 'ثعلب', 'غزال', 'زرافة', 'فيل', 'جمل', 'حصان', 'حمار', 'قرد', 'دب', 'كلب', 'قطة', 'أرنب', 'سلحفاة', 'تمساح', 'ضفدع', 'نسر', 'صقر', 'ببغاء', 'دلفين', 'قرش', 'أخطبوط', 'عقرب', 'فراشة'],
    'فواكه وخضار': ['تفاح', 'موز', 'برتقال', 'عنب', 'فراولة', 'مشمش', 'خوخ', 'رمان', 'بطيخ', 'شمام', 'ليمون', 'تمر', 'تين', 'كمثرى', 'بطاطا', 'بندورة', 'خيار', 'جزر', 'بصل', 'ثوم', 'فلفل', 'باذنجان', 'كوسا', 'سبانخ'],
    'دول عربية': ['الأردن', 'مصر', 'سوريا', 'لبنان', 'العراق', 'فلسطين', 'السعودية', 'الكويت', 'قطر', 'البحرين', 'عمان', 'اليمن', 'ليبيا', 'تونس', 'الجزائر', 'المغرب', 'السودان', 'الإمارات', 'موريتانيا', 'الصومال'],
    'مهن': ['طبيب', 'معلم', 'مهندس', 'طيار', 'شرطي', 'طباخ', 'نجار', 'محامي', 'صحفي', 'مزارع', 'ممرض', 'ميكانيكي', 'خياط', 'رسام', 'مصور', 'صيدلاني', 'حلاق', 'محاسب', 'بائع', 'عامل'],
    'أشياء': ['كرسي', 'طاولة', 'سرير', 'خزانة', 'ثلاجة', 'غسالة', 'مروحة', 'مكنسة', 'مفتاح', 'ساعة', 'مرآة', 'وسادة', 'سجادة', 'مصباح', 'ستارة', 'مقص', 'ملعقة', 'سكين', 'صحن', 'كوب']
  };
  var LET = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
  var KEY = 'adawati_hangman_wins', wins = 0, cat = 'حيوانات', word = '', norm = '', got = {}, bad = 0, over = true;
  try { wins = +localStorage.getItem(KEY) || 0; } catch (e) {}
  $('hgWins').textContent = wins;
  function nz(s) { return s.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْ]/g, ''); }
  function paint() {
    var w = $('hgWord'); w.innerHTML = '';
    word.split('').forEach(function (ch, i) { var s = document.createElement('span'); s.textContent = got[norm[i]] || over && bad >= 6 ? ch : ''; if (over && bad >= 6 && !got[norm[i]]) s.style.color = '#dc2626'; w.appendChild(s); });
    document.querySelectorAll('#hgSvg .p').forEach(function (e, i) { e.style.display = i < bad ? 'block' : 'none'; });
    $('hgLives').textContent = 'المحاولات المتبقية: ' + (6 - bad);
  }
  function newGame() {
    var l = W[cat]; word = l[Math.floor(Math.random() * l.length)]; norm = nz(word); got = {}; bad = 0; over = false;
    $('hgMsg').textContent = 'خمّن الحرف الأول: الفئة ' + cat;
    var kb = $('hgKb'); kb.innerHTML = '';
    LET.forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.dataset.l = c; b.addEventListener('click', function () { guess(c); }); kb.appendChild(b); });
    paint();
  }
  function guess(c) {
    if (over) return;
    var b = document.querySelector('#hgKb button[data-l="' + c + '"]'); if (!b || b.disabled) return;
    b.disabled = true;
    if (norm.indexOf(c) >= 0) { got[c] = true; b.classList.add('g'); } else { bad++; b.classList.add('b'); }
    var done = norm.split('').every(function (x) { return got[x]; });
    if (done) { over = true; wins++; try { localStorage.setItem(KEY, wins); } catch (e) {} $('hgWins').textContent = wins; $('hgMsg').textContent = '🎉 أحسنت! الكلمة: ' + word; }
    else if (bad >= 6) { over = true; $('hgMsg').textContent = '😢 خسرت. الكلمة كانت: ' + word; }
    paint();
  }
  document.addEventListener('keydown', function (e) { if (e.ctrlKey || e.metaKey || e.altKey) return; var c = nz(e.key || ''); if (LET.indexOf(c) >= 0) guess(c); });
  var box = $('hgCats');
  Object.keys(W).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-btn2' + (k === cat ? ' on' : ''); b.textContent = k;
    b.addEventListener('click', function () { cat = k; box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); newGame(); });
    box.appendChild(b);
  });
  $('hgNew').addEventListener('click', newGame);
  newGame();
})();
`
};

const XO = {
  icon: '❌', bg: '#dbeafe', grad: '#1d4ed8,#172554', title: 'لعبة إكس أو XO', h1: 'لعبة إكس أو (XO) ❌⭕',
  sub: 'العب ضد الجوال، أو مع صديق على الجهاز نفسه، أو أونلاين كل واحد من جواله',
  desc: 'لعبة XO (إكس أو) مجانية: العب ضد الكمبيوتر بمستوى سهل أو متوسط أو صعب لا يُهزم، أو مع صديق على نفس الجهاز، مع عدّاد للنقاط.',
  kw: 'لعبة XO, لعبة اكس او, لعبة إكس أو, tic tac toe عربي, لعبة التيك تاك تو',
  search: 'xo اكس او لعبة تيك تاك تو tic tac toe ضد الكمبيوتر لاعبين اونلاين مع صديق',
  cardDesc: 'العب XO ضد الجوال أو مع صديق', cat: 'games',
  faq: [
    ['كيف أفوز في XO؟', 'اجعل ثلاث علامات متتالية، أفقياً أو عمودياً أو قطرياً، قبل خصمك.'],
    ['هل المستوى الصعب لا يُهزم؟', 'نعم، يلعب بأفضل حركة ممكنة دائماً، وأفضل ما تحققه ضده هو التعادل.'],
    ['هل يمكن اللعب مع صديق؟', 'نعم، إما على الشاشة نفسها بوضع لاعبين، أو أونلاين: أنشئ غرفة وأرسل الرابط لصديقك فيلعب كل منكما من جواله.'],
    ['كيف ألعب أونلاين؟', 'اضغط إنشاء غرفة تحت اللوحة، أرسل الرابط أو الرمز لصديقك، وتبدأ المباراة فور انضمامه.'],
    ['من يبدأ؟', 'يبدأ اللاعب X، وتتناوب البداية بين الجولات.'],
    ['هل تُحفظ النقاط؟', 'تُعدّ النقاط خلال زيارتك فقط وتُصفَّر بإعادة تحميل الصفحة.']
  ],
  how: ['اختر الوضع: ضد الجوال أو لاعبين.', 'اضغط على مربع فارغ لوضع علامتك.', 'ثلاث علامات متتالية تعني الفوز.', 'اضغط "جولة جديدة" للاستمرار وتتبّع النقاط.'],
  rel: [['jo/tools/hangman-ar/', '🔤 لعبة المشنقة'], ['jo/tools/sudoku/', '🔢 سودوكو'], ['memory-game.html', '🧠 لعبة الذاكرة']],
  main: CSS + String.raw`
    <style>
      .xo-b{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:min(330px,100%);margin:14px auto 0;direction:ltr;}
      .xo-b button{aspect-ratio:1;border:2px solid var(--border);border-radius:14px;background:var(--surface);font-size:clamp(36px,12vw,56px);font-weight:800;font-family:inherit;cursor:pointer;color:var(--text);line-height:1;}
      .xo-b button.x{color:#2563eb;} .xo-b button.o{color:#dc2626;} .xo-b button.w{background:#fef9c3;border-color:#eab308;}
    </style>
    <div class="pt-row" id="xoModes">
      <button type="button" class="pt-btn2" data-m="easy">سهل</button><button type="button" class="pt-btn2 on" data-m="mid">متوسط</button><button type="button" class="pt-btn2" data-m="hard">صعب</button><button type="button" class="pt-btn2" data-m="two">لاعبان</button>
    </div>
    <div class="pt-stat"><div><b id="xoX">0</b>X</div><div><b id="xoD">0</b>تعادل</div><div><b id="xoO">0</b>O</div></div>
    <div class="pt-big" id="xoMsg" aria-live="polite" style="font-size:17px;"></div>
    <div class="xo-b" id="xoB"></div>
    <div class="pt-row" style="justify-content:center;margin-top:12px;"><button type="button" class="pt-btn" id="xoNew">🔄 جولة جديدة</button></div>
    <div id="xoRoom"></div>`,
  room: true,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  var b, turn, over, mode = 'mid', sc = { X: 0, O: 0, D: 0 }, first = 'X', btns = [];
  function win(bd) { for (var i = 0; i < 8; i++) { var l = L[i]; if (bd[l[0]] && bd[l[0]] === bd[l[1]] && bd[l[0]] === bd[l[2]]) return l; } return null; }
  function minimax(bd, p) {
    var w = win(bd); if (w) return bd[w[0]] === 'O' ? 10 : -10;
    var free = bd.map(function (v, i) { return v ? -1 : i; }).filter(function (i) { return i >= 0; });
    if (!free.length) return 0;
    var best = p === 'O' ? -99 : 99;
    free.forEach(function (i) { bd[i] = p; var s = minimax(bd, p === 'O' ? 'X' : 'O'); bd[i] = ''; best = p === 'O' ? Math.max(best, s - 0) : Math.min(best, s); });
    return best;
  }
  function bestMove() {
    var free = [], i; for (i = 0; i < 9; i++) if (!b[i]) free.push(i);
    var bs = -99, mv = [];
    free.forEach(function (c) { b[c] = 'O'; var s = minimax(b, 'X'); b[c] = ''; if (s > bs) { bs = s; mv = [c]; } else if (s === bs) mv.push(c); });
    return mv[Math.floor(Math.random() * mv.length)];
  }
  function cpu() {
    var free = [], i; for (i = 0; i < 9; i++) if (!b[i]) free.push(i);
    var smart = mode === 'hard' || (mode === 'mid' && Math.random() < 0.6);
    return smart ? bestMove() : free[Math.floor(Math.random() * free.length)];
  }
  function msg() { $('xoMsg').textContent = mode === 'two' ? 'دور اللاعب ' + turn : (turn === 'X' ? 'دورك (X)' : 'الجوال يفكر…'); }
  function render() { btns.forEach(function (e, i) { e.textContent = b[i]; e.className = b[i].toLowerCase(); }); }
  function end() {
    var w = win(b);
    if (w) { over = true; sc[b[w[0]]]++; w.forEach(function (i) { btns[i].classList.add('w'); }); $('xoMsg').textContent = '🎉 فاز ' + (mode === 'two' ? 'اللاعب ' + b[w[0]] : (b[w[0]] === 'X' ? 'أنت' : 'الجوال')); }
    else if (b.every(Boolean)) { over = true; sc.D++; $('xoMsg').textContent = '🤝 تعادل'; }
    $('xoX').textContent = sc.X; $('xoO').textContent = sc.O; $('xoD').textContent = sc.D;
    return over;
  }
  function play(i) {
    if (on) { onlinePlay(i); return; }
    if (over || b[i] || (mode !== 'two' && turn === 'O')) return;
    b[i] = turn; render(); if (end()) return;
    turn = turn === 'X' ? 'O' : 'X'; msg();
    if (mode !== 'two' && turn === 'O') setTimeout(function () { if (over) return; b[cpu()] = 'O'; render(); if (end()) return; turn = 'X'; msg(); }, 400);
  }
  function fresh() {
    b = ['', '', '', '', '', '', '', '', '']; over = false; turn = first; first = first === 'X' ? 'O' : 'X'; render(); msg();
    if (mode !== 'two' && turn === 'O') { turn = 'O'; setTimeout(function () { b[cpu()] = 'O'; render(); turn = 'X'; msg(); }, 400); }
  }
  var box = $('xoB');
  for (var k = 0; k < 9; k++) (function (i) { var e = document.createElement('button'); e.type = 'button'; e.setAttribute('aria-label', 'مربع ' + (i + 1)); e.addEventListener('click', function () { play(i); }); box.appendChild(e); btns.push(e); })(k);
  document.querySelectorAll('[data-m]').forEach(function (e) { e.addEventListener('click', function () { mode = e.getAttribute('data-m'); document.querySelectorAll('[data-m]').forEach(function (x) { x.classList.toggle('on', x === e); }); sc = { X: 0, O: 0, D: 0 }; first = 'X'; fresh(); end(); $('xoMsg').textContent = ''; msg(); }); });
  $('xoNew').addEventListener('click', function () { if (on) { if (R && R.s.o) newRound(); } else fresh(); });
  fresh();
  var on = null, R = null, my = '';
  function pname(m) { var p = on.players[m === 'X' ? 0 : 1]; return p ? p.name : (m === 'X' ? 'X' : 'O'); }
  function sync() {
    if (!on || !R) return;
    if (R.status !== 'playing' || !R.s.b) { $('xoMsg').textContent = 'بانتظار اللاعب الثاني…'; return; }
    var s = R.s, ids = on.players.map(function (p) { return p.id; }), ix = ids.indexOf(on.pid);
    my = ix === 0 ? 'X' : ix === 1 ? 'O' : '';
    b = s.b.split('').map(function (c) { return c === '.' ? '' : c; }); turn = s.t; over = !!s.o; sc = s.sc; render();
    var wl = win(b); if (over && wl) wl.forEach(function (i) { btns[i].classList.add('w'); });
    $('xoX').textContent = sc.X; $('xoO').textContent = sc.O; $('xoD').textContent = sc.D;
    var m;
    if (on.players.length < 2) m = 'غادر اللاعب الآخر. بانتظار لاعب جديد…';
    else if (over) m = s.w === 'D' ? '🤝 تعادل' : s.w === my ? '🎉 فزت!' : '😅 فاز ' + pname(s.w);
    else m = turn === my ? 'دورك (' + my + ')' : 'دور ' + pname(turn) + ' (' + turn + ')';
    $('xoMsg').textContent = m;
  }
  function onlinePlay(i) {
    if (!R || !R.s.b || over || b[i] || turn !== my || on.players.length < 2) return;
    var nb = b.slice(); nb[i] = my; var w = win(nb), s = R.s;
    var ns = { b: nb.map(function (c) { return c || '.'; }).join(''), t: my === 'X' ? 'O' : 'X', f: s.f, sc: { X: s.sc.X, O: s.sc.O, D: s.sc.D }, n: s.n, o: 0 };
    if (w) { ns.o = 1; ns.w = my; ns.sc[my]++; } else if (nb.every(Boolean)) { ns.o = 1; ns.w = 'D'; ns.sc.D++; }
    on.setState(ns, 'playing');
  }
  function newRound() {
    var s = R.s, f = s.f === 'X' ? 'O' : 'X';
    on.setState({ b: '.........', t: f, f: f, sc: s.sc, n: s.n + 1, o: 0 }, 'playing');
  }
  if (window.JoRoom) JoRoom.mount($('xoRoom'), {
    game: 'xo', min: 2, max: 2, shareText: 'تعال نلعب XO أونلاين',
    onHostStart: function (c) { c.setState({ b: '.........', t: 'X', f: 'X', sc: { X: 0, O: 0, D: 0 }, n: 1, o: 0 }, 'playing'); },
    onJoin: function (c) { on = c; R = null; $('xoModes').hidden = true; mode = 'online'; sc = { X: 0, O: 0, D: 0 }; b = ['', '', '', '', '', '', '', '', '']; over = true; render(); $('xoMsg').textContent = 'بانتظار اللاعب الثاني…'; },
    onPlayers: function (pl, c) { if (c.isHost() && c.room && c.room.status === 'lobby' && pl.length >= 2) c.setState({ b: '.........', t: 'X', f: 'X', sc: { X: 0, O: 0, D: 0 }, n: 1, o: 0 }, 'playing'); sync(); },
    onRoom: function (r) { R = r; sync(); },
    onLeave: function (forced) { on = null; R = null; mode = 'mid'; $('xoModes').hidden = false; sc = { X: 0, O: 0, D: 0 }; first = 'X'; fresh(); end(); $('xoMsg').textContent = forced ? 'أغلق المضيف الغرفة.' : ''; $('xoX').textContent = 0; $('xoO').textContent = 0; $('xoD').textContent = 0; }
  });

})();
`
};

module.exports = { 'which-more': MORE, 'hangman-ar': HANG, 'xo-game': XO };
