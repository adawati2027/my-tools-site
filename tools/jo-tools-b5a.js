const CSS = String.raw`
    <style>
      .pt-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
      .pt-in{width:100%;padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-family:inherit;font-size:15px;box-sizing:border-box;min-width:0;}
      .pt-lbl{display:block;font-size:13px;font-weight:700;margin:12px 0 5px;}
      .pt-btn{padding:12px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;}
      .pt-btn2{padding:9px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:13px;cursor:pointer;}
      .pt-btn2.on{background:#2563eb;color:#fff;border-color:#2563eb;}
      .pt-note{font-size:12px;color:var(--text-muted);margin-top:10px;min-height:18px;line-height:1.7;}
      .pt-big{margin-top:14px;padding:26px 14px;border-radius:14px;background:var(--surface-2);text-align:center;font-size:26px;font-weight:800;line-height:1.6;}
    </style>`;

const OUTSIDER = {
  icon: '🕵️', bg: '#fee2e2', grad: '#b91c1c,#450a0a', title: 'لعبة برّا السالفة', h1: 'لعبة برّا السالفة 🕵️',
  sub: 'لعبة جماعية بجوال واحد أو أونلاين مع أصدقائك (كل واحد من جواله): الكل يعرف الكلمة إلا واحد، فمن هو الدخيل؟',
  desc: 'لعبة برّا السالفة أونلاين بجوال واحد: يعرف الجميع الكلمة السرية إلا لاعب واحد، ويحاول الباقون كشفه بالأسئلة. فئات متنوعة ومؤقت نقاش.',
  kw: 'برا السالفة, لعبة برا السالفة, لعبة جماعية, العاب جماعية, لعبة الدخيل, لعبة سهرة',
  search: 'برا السالفة لعبة جماعية الدخيل سهرة اصدقاء عائلة العاب جماعية بدون انترنت',
  cardDesc: 'الكل يعرف الكلمة إلا واحد، اكتشف الدخيل بين أصدقائك', cat: 'games',
  faq: [
    ['كيف تُلعب برّا السالفة؟', 'يمرّر اللاعبون الجوال واحداً واحداً، فيرى كل لاعب الكلمة السرية سراً، إلا الدخيل فيرى أنه "برّا السالفة". ثم يتناقش الجميع بأسئلة عن الكلمة دون ذكرها صراحة.'],
    ['كم لاعباً نحتاج؟', 'من ٣ إلى ١٢ لاعباً، والأفضل من ٥ إلى ٨.'],
    ['كيف يفوز الدخيل؟', 'يفوز إذا لم يكتشفه الآخرون، أو إذا خمّن الكلمة السرية بعد كشفه.'],
    ['هل يمكن اللعب من جوالات مختلفة؟', 'نعم، أنشئ غرفة أونلاين وأرسل الرابط لأصدقائك؛ كل لاعب يرى دوره على جواله، ثم تصوّتون على الدخيل.'],
    ['هل تحتاج اللعبة إلى إنترنت؟', 'اللعب بجوال واحد يعمل دون اتصال. أما الغرفة الأونلاين فتحتاج إنترنت.'],
    ['كيف أغيّر الفئة؟', 'اختر فئة محددة أو "عشوائي" قبل بدء الجولة.']
  ],
  how: ['اختر عدد اللاعبين والفئة وزمن النقاش.', 'مرّروا الجوال؛ كل لاعب يكشف دوره سراً ثم يخفيه.', 'اسألوا بعضكم أسئلة عن الكلمة دون ذكرها.', 'عند انتهاء الوقت صوّتوا ثم اكشفوا الدخيل.'],
  rel: [['jo/tools/lucky-wheel/', '🎡 عجلة الحظ'], ['jo/tools/which-more/', '🤔 أيهما أكثر؟'], ['jo/tools/hangman-ar/', '🔤 لعبة المشنقة']],
  main: CSS + String.raw`
    <div id="osSetup">
      <label class="pt-lbl" for="osN">عدد اللاعبين</label>
      <input class="pt-in" id="osN" type="text" inputmode="numeric" value="5" maxlength="2">
      <label class="pt-lbl" for="osCat">الفئة</label>
      <select class="pt-in" id="osCat"></select>
      <label class="pt-lbl" for="osMin">زمن النقاش (دقائق)</label>
      <select class="pt-in" id="osMin"><option>2</option><option selected>3</option><option>5</option><option>8</option></select>
      <div class="pt-row" style="margin-top:14px;"><button type="button" class="pt-btn" id="osStart">▶ ابدأ الجولة</button></div>
    </div>
    <div id="osPlay" hidden>
      <div class="pt-big" id="osCard"></div>
      <div class="pt-row" style="margin-top:12px;justify-content:center;"><button type="button" class="pt-btn" id="osNext">👁 اكشف دوري</button></div>
      <div class="pt-note" id="osMsg" style="text-align:center;"></div>
    </div>
    <div id="osOnline" hidden>
      <div class="pt-big" id="osOCard" style="white-space:pre-line;cursor:pointer;"></div>
      <div id="osOVote" class="pt-row" style="margin-top:12px;justify-content:center;"></div>
      <div class="pt-row" style="margin-top:12px;justify-content:center;"><button type="button" class="pt-btn" id="osOBtn" hidden></button></div>
      <div class="pt-note" id="osOMsg" style="text-align:center;"></div>
    </div>
    <div id="osRoom"></div>`,
  room: true,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var CATS = {
    'أماكن': ['مطعم', 'مستشفى', 'مدرسة', 'مطار', 'شاطئ', 'سوق شعبي', 'مسجد', 'ملعب كرة', 'مكتبة', 'سينما', 'حديقة', 'فندق', 'جامعة', 'محطة بنزين', 'مزرعة', 'مخبز', 'صالون حلاقة', 'بنك'],
    'أكلات': ['منسف', 'مقلوبة', 'فلافل', 'شاورما', 'كنافة', 'مندي', 'بيتزا', 'حمص', 'مجدّرة', 'كبسة', 'برغر', 'مسخّن', 'ملوخية', 'سمك مشوي', 'بقلاوة', 'شوربة عدس', 'فتّة', 'كباب'],
    'مهن': ['طبيب', 'معلم', 'مهندس', 'طيار', 'شرطي', 'طباخ', 'نجار', 'محامي', 'صحفي', 'سائق تكسي', 'مزارع', 'ممرض', 'ميكانيكي', 'خياط', 'رسام', 'مصور', 'صيدلاني', 'حلاق'],
    'حيوانات': ['أسد', 'جمل', 'حصان', 'قطة', 'نسر', 'دلفين', 'فيل', 'أرنب', 'ثعلب', 'زرافة', 'بطريق', 'تمساح', 'قرد', 'خروف', 'ذئب', 'نحلة', 'سلحفاة', 'ببغاء'],
    'دول ومدن': ['الأردن', 'السعودية', 'مصر', 'عمّان', 'القدس', 'دبي', 'القاهرة', 'إسطنبول', 'باريس', 'لندن', 'طوكيو', 'الرياض', 'العقبة', 'البتراء', 'بيروت', 'مراكش', 'نيويورك', 'روما'],
    'أشياء': ['مفتاح', 'ساعة', 'نظارة', 'مظلة', 'كاميرا', 'سرير', 'مرآة', 'مقص', 'حقيبة', 'كرسي', 'هاتف', 'قلم', 'سيارة', 'دراجة', 'كتاب', 'مصباح', 'ثلاجة', 'سجادة']
  };
  var names = Object.keys(CATS), sel = $('osCat');
  var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'عشوائي'; sel.appendChild(o0);
  names.forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = n; sel.appendChild(o); });
  var st = null, tmr = null;
  function normDigits(s) { return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function start() {
    var n = parseInt(normDigits($('osN').value), 10);
    n = Math.min(12, Math.max(3, n || 5)); $('osN').value = n;
    var cat = sel.value || names[rnd(names.length)], list = CATS[cat];
    st = { n: n, i: 0, cat: cat, word: list[rnd(list.length)], out: rnd(n), min: +$('osMin').value, phase: 'hide' };
    $('osSetup').hidden = true; $('osPlay').hidden = false; show();
  }
  function show() {
    var card = $('osCard'), btn = $('osNext'), msg = $('osMsg');
    clearInterval(tmr);
    if (st.phase === 'hide') {
      card.textContent = 'اللاعب ' + (st.i + 1) + ' من ' + st.n; btn.textContent = '👁 اكشف دوري';
      msg.textContent = 'سلّم الجوال للاعب ' + (st.i + 1) + ' ثم اضغط الزر. لا ينظر أحد غيره.';
    } else if (st.phase === 'see') {
      card.textContent = st.i === st.out ? '🕵️ أنت برّا السالفة!' : 'الكلمة: ' + st.word;
      card.style.color = st.i === st.out ? '#dc2626' : '';
      btn.textContent = st.i === st.n - 1 ? '✔ إخفاء وبدء النقاش' : '🙈 إخفاء ومرّر الجوال';
      msg.textContent = st.i === st.out ? 'الفئة: ' + st.cat + '. حاول أن تفهم الكلمة من أجوبة الآخرين دون أن تُكشف.' : 'الفئة: ' + st.cat + '. لا تقل الكلمة صراحة.';
    } else if (st.phase === 'talk') {
      card.style.color = ''; btn.textContent = '🛑 انتهى النقاش، اكشفوا الدخيل';
      var left = st.min * 60;
      function paint() { card.textContent = '💬 ' + Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2); }
      paint(); msg.textContent = 'اسألوا بعضكم أسئلة عن الكلمة، ثم صوّتوا على من تظنونه الدخيل.';
      tmr = setInterval(function () { left--; if (left <= 0) { clearInterval(tmr); left = 0; msg.textContent = 'انتهى الوقت! صوّتوا الآن.'; } paint(); }, 1000);
    } else {
      card.style.color = '';
      card.textContent = 'الدخيل هو اللاعب ' + (st.out + 1) + ' والكلمة كانت: ' + st.word;
      btn.textContent = '🔄 جولة جديدة'; msg.textContent = 'إن خمّن الدخيل الكلمة بعد كشفه فهو الفائز.';
    }
  }
  $('osNext').addEventListener('click', function () {
    if (st.phase === 'hide') st.phase = 'see';
    else if (st.phase === 'see') { if (st.i === st.n - 1) st.phase = 'talk'; else { st.i++; st.phase = 'hide'; } }
    else if (st.phase === 'talk') st.phase = 'end';
    else { st = null; $('osPlay').hidden = true; $('osSetup').hidden = false; $('osCard').style.color = ''; clearInterval(tmr); return; }
    show();
  });
  $('osStart').addEventListener('click', start);

  var oc = null, oR = null, oLast = 0, oRole = null, oShow = false, oEnd = 0, oTm = null, oCatSel = null, oMinSel = null;
  function oName(id) { var p = oc.players.filter(function (x) { return x.id === id; })[0]; return p ? p.name : '؟'; }
  function oRoleTxt() {
    if (oRole == null) return '…';
    var a = oRole.split('|');
    return a[0] === '#OUT' ? '🕵️ أنت برّا السالفة!\nالفئة: ' + a[1] : 'الكلمة: ' + a[1] + '\nالفئة: ' + a[2];
  }
  function oPaint() {
    if (!oc || !oR) return;
    var s = oR.s, card = $('osOCard'), msg = $('osOMsg'), vote = $('osOVote'), btn = $('osOBtn'), host = oc.isHost();
    clearInterval(oTm); vote.innerHTML = ''; btn.hidden = true;
    if (oR.status !== 'playing' || !s.ph) { card.textContent = ''; msg.textContent = ''; return; }
    if (s.ph === 'play') {
      card.style.color = oShow && oRole && oRole.indexOf('#OUT') === 0 ? '#dc2626' : '';
      card.textContent = oShow ? oRoleTxt() : '👁 اضغط هنا لإظهار دورك (أخفِه قبل أن يراه أحد)';
      var tick = function () { var l = Math.max(0, Math.round((oEnd - Date.now()) / 1000)); msg.textContent = '💬 النقاش ' + Math.floor(l / 60) + ':' + ('0' + (l % 60)).slice(-2) + ' — اسألوا بعضكم عن الكلمة دون ذكرها.'; };
      tick(); oTm = setInterval(tick, 1000);
      if (host) { btn.hidden = false; btn.textContent = '🗳 ابدأ التصويت'; }
    } else if (s.ph === 'vote') {
      card.style.color = ''; card.textContent = '🗳 من الدخيل برأيك؟';
      var mine = oc.players.filter(function (p) { return p.id === oc.pid; })[0], mv = mine && mine.vr === s.r ? mine.v : '', n = oc.players.filter(function (p) { return p.vr === s.r && p.v; }).length;
      oc.players.forEach(function (p) {
        if (p.id === oc.pid) return;
        var b = document.createElement('button'); b.type = 'button'; b.className = 'pt-btn2' + (mv === p.id ? ' on' : ''); b.textContent = p.name;
        b.addEventListener('click', function () { oc.setMine({ v: p.id, vr: s.r }); }); vote.appendChild(b);
      });
      msg.textContent = (mv ? 'صوّتَّ لـ ' + oName(mv) + '. ' : '') + 'صوّت ' + n + ' من ' + oc.players.length + '.';
      if (host) { btn.hidden = false; btn.textContent = '📢 اكشف النتيجة'; }
    } else {
      var r = s.res || {}, lines = ['الدخيل: ' + r.outName, 'الكلمة: ' + r.word, '', r.caught ? '✅ كشفتم الدخيل!' : '😈 نجا الدخيل!'];
      card.style.color = ''; card.textContent = lines.join('\n');
      msg.textContent = 'الأصوات: ' + (r.tally || []).map(function (t) { return t[0] + ' (' + t[1] + ')'; }).join('، ') + '. إن خمّن الدخيل الكلمة بعد كشفه فهو الفائز.';
      if (host) { btn.hidden = false; btn.textContent = '🔄 جولة جديدة'; }
    }
  }
  function oSync() {
    if (!oc || !oR) return;
    var s = oR.s;
    if (oR.status === 'playing' && s.r && s.r !== oLast) {
      oLast = s.r; oRole = null; oShow = false; oEnd = Date.now() + (s.dur || 3) * 60000;
      oc.getSecret().then(function (t) { oRole = t; oPaint(); });
    }
    oPaint();
  }
  function oHostRound(c) {
    var ids = c.players.map(function (p) { return p.id; }), prev = (c.room && c.room.s) || {};
    var cat = (oCatSel && oCatSel.value) || prev.cf || '', real = cat || names[rnd(names.length)], list = CATS[real], word = list[rnd(list.length)], out = ids[rnd(ids.length)];
    var dur = oMinSel ? +oMinSel.value : (prev.dur || 3), r = (prev.r || 0) + 1;
    Promise.all(ids.map(function (id) { return c.setSecret(id, id === out ? '#OUT|' + real : 'W|' + word + '|' + real); }))
      .then(function () { return c.setState({ ph: 'play', r: r, cat: real, cf: cat, dur: dur }, 'playing'); });
  }
  function oResult(c) {
    var s = c.room.s, ids = c.players.map(function (p) { return p.id; });
    Promise.all(ids.map(function (id) { return c.getSecret(id).then(function (t) { return [id, t]; }); })).then(function (all) {
      var out = '', word = '';
      all.forEach(function (x) { if (x[1] && x[1].indexOf('#OUT') === 0) out = x[0]; else if (x[1] && !word) word = x[1].split('|')[1]; });
      var cnt = {}; c.players.forEach(function (p) { if (p.vr === s.r && p.v) cnt[p.v] = (cnt[p.v] || 0) + 1; });
      var top = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; });
      var tally = top.map(function (id) { return [oName(id), cnt[id]]; });
      var caught = top.length > 0 && top[0] === out && (top.length < 2 || cnt[top[1]] < cnt[top[0]]);
      c.setState({ ph: 'res', r: s.r, cat: s.cat, cf: s.cf, dur: s.dur, res: { outName: oName(out), word: word, tally: tally, caught: caught } }, 'playing');
    });
  }
  $('osOCard').addEventListener('click', function () { if (oR && oR.s.ph === 'play') { oShow = !oShow; oPaint(); } });
  $('osOBtn').addEventListener('click', function () {
    var s = oR.s;
    if (s.ph === 'play') oc.setState({ ph: 'vote', r: s.r, cat: s.cat, cf: s.cf, dur: s.dur }, 'playing');
    else if (s.ph === 'vote') oResult(oc);
    else oHostRound(oc);
  });
  if (window.JoRoom) JoRoom.mount($('osRoom'), {
    game: 'os', min: 3, max: 12, shareText: 'تعال العب برّا السالفة معنا أونلاين',
    hostExtra: function () {
      var w = document.createElement('div');
      if (!oCatSel) {
        oCatSel = document.createElement('select'); oCatSel.className = 'jr-in';
        var o0 = document.createElement('option'); o0.value = ''; o0.textContent = 'الفئة: عشوائي'; oCatSel.appendChild(o0);
        names.forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = 'الفئة: ' + n; oCatSel.appendChild(o); });
        oMinSel = document.createElement('select'); oMinSel.className = 'jr-in';
        [2, 3, 5, 8].forEach(function (m) { var o = document.createElement('option'); o.value = m; o.textContent = 'زمن النقاش: ' + m + ' دقائق'; if (m === 3) o.selected = true; oMinSel.appendChild(o); });
      }
      w.appendChild(oCatSel); w.appendChild(oMinSel); return w;
    },
    onHostStart: function (c) { oHostRound(c); },
    onJoin: function (c) { oc = c; oR = null; oLast = 0; $('osSetup').hidden = true; $('osPlay').hidden = true; $('osOnline').hidden = false; $('osOCard').textContent = ''; $('osOMsg').textContent = ''; },
    onPlayers: function () { oPaint(); },
    onRoom: function (r) { oR = r; oSync(); },
    onLeave: function () { oc = null; oR = null; clearInterval(oTm); $('osOnline').hidden = true; $('osSetup').hidden = false; }
  });
})();
`
};

const WHEEL = {
  icon: '🎡', bg: '#fef3c7', grad: '#d97706,#451a03', title: 'عجلة الحظ', h1: 'عجلة الحظ: دَوِّر وقرّر 🎡',
  sub: 'اكتب خياراتك ودوّر العجلة لتختار لك بالصدفة: ماذا نأكل؟ أين نذهب؟ من يبدأ؟',
  desc: 'عجلة حظ عشوائية مجانية: اكتب خياراتك ودوّر العجلة لتحصل على قرار عادل. مناسبة للمطاعم والألعاب والقرعة والاختيار بين الأصدقاء.',
  kw: 'عجلة الحظ, عجلة قرارات, اختيار عشوائي, قرعة, عجلة عشوائية, ماذا نأكل اليوم',
  search: 'عجلة الحظ قرعة اختيار عشوائي قرار ماذا نأكل اصدقاء سحب اسماء wheel spinner',
  cardDesc: 'دوّر العجلة ودعها تقرّر بدلاً عنك', cat: 'decisions',
  faq: [
    ['هل النتيجة عشوائية فعلاً؟', 'نعم، يُختار الفائز عشوائياً قبل الدوران ثم تدور العجلة لتقف عنده، فلا تأثير لأي شيء آخر.'],
    ['كم خياراً أستطيع إضافة؟', 'من خيارين إلى ٢٤ خياراً، كل خيار في سطر مستقل.'],
    ['هل أحذف الفائز بعد كل دوران؟', 'فعّل خيار "احذف الفائز" لتصلح العجلة للقرعة بين عدة أشخاص دون تكرار.'],
    ['هل تُحفظ خياراتي؟', 'نعم، تُحفظ في متصفحك فقط لتجدها في زيارتك التالية.'],
    ['هل تصلح لسحب الجوائز العلنية؟', 'هي للتسلية واتخاذ القرارات اليومية، وإن كان السحب رسمياً فاعتمد الجهة المنظمة.']
  ],
  how: ['اكتب كل خيار في سطر.', 'اضغط "دوّر" وانتظر توقف العجلة.', 'الفائز يظهر أسفل العجلة.', 'فعّل "احذف الفائز" للقرعة دون تكرار.'],
  rel: [['jo/tools/outsider-game/', '🕵️ برّا السالفة'], ['jo/tools/what-to-cook/', '🍳 شو أطبخ اليوم'], ['jo/tools/which-more/', '🤔 أيهما أكثر؟']],
  main: CSS + String.raw`
    <style>
      .wh-wrap{position:relative;width:min(340px,100%);margin:14px auto 0;}
      .wh-wrap canvas{width:100%;height:auto;display:block;}
      .wh-pin{position:absolute;top:-6px;left:50%;transform:translateX(-50%);font-size:30px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.4));}
    </style>
    <label class="pt-lbl" for="whIn">الخيارات (كل خيار في سطر)</label>
    <textarea class="pt-in" id="whIn" rows="5" maxlength="1200"></textarea>
    <label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-size:14px;"><input type="checkbox" id="whDel"> احذف الفائز بعد كل دوران</label>
    <div class="wh-wrap"><div class="wh-pin">▼</div><canvas id="whCv" width="680" height="680" aria-label="عجلة الحظ"></canvas></div>
    <div class="pt-row" style="justify-content:center;margin-top:12px;"><button type="button" class="pt-btn" id="whGo">🎡 دوّر</button></div>
    <div class="pt-big" id="whRes" aria-live="polite">اضغط "دوّر" لتعرف النتيجة</div>`,
  script: String.raw`
(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KEY = 'adawati_wheel_v1', DEF = ['بيتزا', 'شاورما', 'برغر', 'منسف', 'فلافل'];
  var COLS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  var cv = $('whCv'), cx = cv.getContext('2d'), ang = 0, busy = false;
  var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  $('whIn').value = saved || DEF.join('\n');
  function opts() { return $('whIn').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 24); }
  function draw() {
    var o = opts(), n = o.length, R = 340;
    cx.clearRect(0, 0, 680, 680);
    if (n < 2) { cx.fillStyle = '#e5e7eb'; cx.beginPath(); cx.arc(R, R, R - 6, 0, 7); cx.fill(); cx.fillStyle = '#6b7280'; cx.font = 'bold 34px sans-serif'; cx.textAlign = 'center'; cx.fillText('أضف خيارين على الأقل', R, R); return; }
    var a = 2 * Math.PI / n;
    for (var i = 0; i < n; i++) {
      var s = ang + i * a;
      cx.beginPath(); cx.moveTo(R, R); cx.arc(R, R, R - 6, s, s + a); cx.closePath();
      cx.fillStyle = COLS[i % COLS.length]; cx.fill(); cx.strokeStyle = '#fff'; cx.lineWidth = 3; cx.stroke();
      cx.save(); cx.translate(R, R); cx.rotate(s + a / 2); cx.textAlign = 'right'; cx.fillStyle = '#fff';
      cx.font = 'bold ' + (n > 12 ? 22 : 30) + 'px sans-serif';
      var t = o[i].length > 14 ? o[i].slice(0, 13) + '…' : o[i];
      cx.fillText(t, R - 28, 10); cx.restore();
    }
    cx.beginPath(); cx.arc(R, R, 26, 0, 7); cx.fillStyle = '#fff'; cx.fill(); cx.strokeStyle = '#d1d5db'; cx.lineWidth = 3; cx.stroke();
  }
  function spin() {
    var o = opts(), n = o.length;
    if (busy) return;
    if (n < 2) { $('whRes').textContent = 'أضف خيارين على الأقل.'; return; }
    busy = true; $('whGo').disabled = true;
    var win = Math.floor(Math.random() * n), a = 2 * Math.PI / n;
    var target = -Math.PI / 2 - (win + 0.5) * a;
    var from = ang, delta = target - from; delta = ((delta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI * (5 + Math.floor(Math.random() * 3));
    var t0 = performance.now(), dur = 4200;
    function frame(t) {
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      ang = from + delta * e; draw();
      if (p < 1) requestAnimationFrame(frame);
      else {
        busy = false; $('whGo').disabled = false;
        $('whRes').textContent = '🎉 ' + o[win];
        if ($('whDel').checked) { o.splice(win, 1); $('whIn').value = o.join('\n'); try { localStorage.setItem(KEY, $('whIn').value); } catch (e2) {} draw(); }
      }
    }
    requestAnimationFrame(frame);
  }
  $('whIn').addEventListener('input', function () { try { localStorage.setItem(KEY, $('whIn').value); } catch (e) {} draw(); });
  $('whGo').addEventListener('click', spin);
  draw();
})();
`
};

module.exports = { 'outsider-game': OUTSIDER, 'lucky-wheel': WHEEL };
