(function () {
  var R = window.RESTS || [];
  var PAGE = 30;
  var st = { area: '', cuisine: '', q: '', sort: 'top', shown: PAGE };
  var RAT = {};
  var fbRef = null, curUser = null, isAdmin = false;
  var cur = null, reviews = [], myStars = 0;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return adsEsc(s == null ? '' : String(s)); };

  function norm(s) {
    return String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
  }
  R.forEach(function (r) { r._k = norm(r.n + ' ' + (r.e || '') + ' ' + r.a + ' ' + r.c); });

  function avg(id) { var x = RAT[id]; return x && x.c > 0 ? x.s / x.c : 0; }
  function starsHtml(v) {
    var full = Math.round(v), s = '';
    for (var i = 1; i <= 5; i++) s += i <= full ? '★' : '☆';
    return '<span style="color:#f59e0b;letter-spacing:1px;">' + s + '</span>';
  }
  function ratingLine(id) {
    var x = RAT[id];
    if (!x || !x.c) return '<span class="ads-meta">لا تقييمات بعد</span>';
    return starsHtml(avg(id)) + ' <strong>' + avg(id).toFixed(1) + '</strong> <span class="ads-meta">(' + x.c + ')</span>';
  }
  function mapUrl(r) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((r.e || r.n) + ' ' + r.a + ' Amman Jordan');
  }

  function linksHtml(r, small) {
    var st2 = small ? ' style="padding:5px 10px;font-size:12px;"' : '';
    var h = '';
    if (r.w) h += '<a class="ads-btn secondary"' + st2 + ' href="' + esc(r.w) + '" target="_blank" rel="noopener noreferrer nofollow">🌐 الموقع</a>';
    if (r.i) h += '<a class="ads-btn secondary"' + st2 + ' href="' + esc(r.i) + '" target="_blank" rel="noopener noreferrer nofollow">📸 إنستغرام</a>';
    if (r.f) h += '<a class="ads-btn secondary"' + st2 + ' href="' + esc(r.f) + '" target="_blank" rel="noopener noreferrer nofollow">👍 فيسبوك</a>';
    if (r.p) h += '<a class="ads-btn secondary"' + st2 + ' href="tel:' + esc(r.p) + '">📞 اتصال</a>';
    return h;
  }

  function filtered() {
    var q = norm(st.q);
    var list = R.filter(function (r) {
      return (!st.area || r.a === st.area) && (!st.cuisine || r.c === st.cuisine) && (!q || r._k.indexOf(q) !== -1);
    });
    list.sort(function (a, b) {
      if (st.sort === 'name') return a.n.localeCompare(b.n, 'ar');
      if (st.sort === 'most') return ((RAT[b.id] || {}).c || 0) - ((RAT[a.id] || {}).c || 0) || a.n.localeCompare(b.n, 'ar');
      var d = avg(b.id) - avg(a.id);
      if (d) { var ca = (RAT[a.id] || {}).c || 0, cb = (RAT[b.id] || {}).c || 0; if (!ca !== !cb) return ca ? -1 : 1; return d; }
      return a.n.localeCompare(b.n, 'ar');
    });
    return list;
  }

  function countBy(key, base) {
    var m = {};
    base.forEach(function (r) { m[r[key]] = (m[r[key]] || 0) + 1; });
    return m;
  }

  function drawFilters() {
    var q = norm(st.q);
    var forAreas = R.filter(function (r) { return (!st.cuisine || r.c === st.cuisine) && (!q || r._k.indexOf(q) !== -1); });
    var ac = countBy('a', forAreas);
    var areas = Object.keys(countBy('a', R)).sort(function (a, b) { return countBy('a', R)[b] - countBy('a', R)[a] || a.localeCompare(b, 'ar'); });
    var tot = countBy('a', R), top = areas.slice(0, 12);
    if (st.area && top.indexOf(st.area) < 0) top.push(st.area);
    var h = '<button type="button" class="rs-chip' + (st.area ? '' : ' on') + '" data-area="">الكل<small>' + forAreas.length + '</small></button>';
    top.forEach(function (a) {
      if (!ac[a] && st.area !== a) return;
      h += '<button type="button" class="rs-chip' + (st.area === a ? ' on' : '') + '" data-area="' + esc(a) + '">' + esc(a) + '<small>' + (ac[a] || 0) + '</small></button>';
    });
    var so = '<option value="">📍 كل المناطق (' + areas.length + ')</option>';
    areas.slice().sort(function (a, b) { return a.localeCompare(b, 'ar'); }).forEach(function (a) {
      so += '<option value="' + esc(a) + '"' + (st.area === a ? ' selected' : '') + '>' + esc(a) + ' (' + (ac[a] || 0) + ')</option>';
    });
    $('rsAreaSel').innerHTML = so;
    $('rsAreas').innerHTML = h;

    var forCu = R.filter(function (r) { return (!st.area || r.a === st.area) && (!q || r._k.indexOf(q) !== -1); });
    var cc = countBy('c', forCu), all = countBy('c', R);
    var cus = Object.keys(all).sort(function (a, b) { return all[b] - all[a] || a.localeCompare(b, 'ar'); });
    var o = '<option value="">🍴 كل المطابخ</option>';
    cus.forEach(function (c) {
      if (!cc[c] && st.cuisine !== c) return;
      o += '<option value="' + esc(c) + '"' + (st.cuisine === c ? ' selected' : '') + '>' + esc(c) + ' (' + (cc[c] || 0) + ')</option>';
    });
    $('rsCuisine').innerHTML = o;
  }

  function cardHtml(r) {
    return '<div class="ads-card rs-card" data-id="' + esc(r.id) + '">' +
      '<div class="rs-name">' + esc(r.n) + '</div>' +
      (r.e ? '<div class="rs-en">' + esc(r.e) + '</div>' : '') +
      '<div class="rs-tags"><span>📍 ' + esc(r.a) + '</span><span>🍴 ' + esc(r.c) + '</span></div>' +
      '<div data-rl>' + ratingLine(r.id) + '</div>' +
      '<div class="ads-row" style="margin-top:6px;"><button type="button" class="ads-btn" data-open="' + esc(r.id) + '">⭐ قيّم وعلّق</button>' +
      '<a class="ads-btn secondary" href="' + esc(mapUrl(r)) + '" target="_blank" rel="noopener noreferrer">📍 الخريطة</a></div>' + (r.w || r.i || r.f ? '<div class="ads-row" style="margin-top:2px;">' + linksHtml(r, true) + '</div>' : '') + '</div>';
  }

  function draw() {
    drawFilters();
    var list = filtered();
    $('rsCount').textContent = list.length + ' من ' + R.length + ' مطعم';
    var h = list.slice(0, st.shown).map(cardHtml).join('');
    $('rList').innerHTML = h || '<div class="card" style="text-align:center;">لا توجد نتائج — جرّب منطقة أو مطبخاً آخر.</div>';
    $('rsMore').hidden = list.length <= st.shown;
  }

  function loadRatings() {
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem('restRat') || 'null'); } catch (e) {}
    if (cached && Date.now() - cached.t < 600000) { RAT = cached.d; draw(); return; }
    adsFb().then(function (fb) {
      return fb.db.collection('restRatings').get();
    }).then(function (s) {
      var m = {};
      s.forEach(function (d) { var v = d.data(); if (v.ratingCount > 0) m[d.id] = { c: v.ratingCount, s: v.ratingSum }; });
      RAT = m;
      try { sessionStorage.setItem('restRat', JSON.stringify({ t: Date.now(), d: m })); } catch (e) {}
      draw();
    }).catch(function () {});
  }

  /* ---------- modal ---------- */
  function openModal(id) {
    cur = R.filter(function (r) { return r.id === id; })[0];
    if (!cur) return;
    reviews = []; myStars = 0;
    $('rsModal').hidden = false;
    document.body.style.overflow = 'hidden';
    drawSheet(true);
    adsFb().then(function (fb) {
      fbRef = fb;
      return fb.db.collection('restRatings').doc(cur.id).collection('reviews').orderBy('updatedAt', 'desc').limit(60).get();
    }).then(function (s) {
      reviews = s.docs.map(function (d) { return { uid: d.id, d: d.data() }; });
      drawSheet(false);
    }).catch(function () { drawSheet(false, true); });
  }
  function closeModal() { $('rsModal').hidden = true; document.body.style.overflow = ''; cur = null; }

  function drawSheet(loading, failed) {
    if (!cur) return;
    var user = curUser, mine = user && reviews.filter(function (r) { return r.uid === user.uid; })[0];
    if (mine) myStars = mine.d.rating;
    var form;
    if (!user) form = '<div style="margin-top:8px;"><button type="button" class="ads-btn secondary" id="rvLogin">🔐 سجّل الدخول لتقيّم وتعلّق</button></div>';
    else form = '<div class="ads-form" style="margin-top:8px;"><div id="rvStars" style="font-size:32px;cursor:pointer;letter-spacing:4px;">' +
      [1, 2, 3, 4, 5].map(function (i) { return '<span data-star="' + i + '">' + (i <= myStars ? '★' : '☆') + '</span>'; }).join('') + '</div>' +
      '<textarea id="rvText" maxlength="500" placeholder="اكتب تعليقك (اختياري)" style="min-height:70px;">' + (mine ? esc(mine.d.text) : '') + '</textarea>' +
      '<div class="ads-row"><button type="button" class="ads-btn" id="rvSave">' + (mine ? '💾 عدّل تقييمي' : '⭐ أرسل التقييم') + '</button>' +
      (mine ? '<button type="button" class="ads-btn secondary" id="rvDel">🗑️ احذف تقييمي</button>' : '') + '</div><div id="rvMsg"></div></div>';

    var list = loading ? '<p class="ads-meta">جارٍ التحميل...</p>' : failed ? '<p class="ads-meta">لم نستطع تحميل التعليقات الآن.</p>' : reviews.map(function (r) {
      var d = r.d;
      return '<div style="border-top:1px solid var(--border);padding:10px 0;margin-top:10px;" data-ruid="' + esc(r.uid) + '"><div style="display:flex;justify-content:space-between;gap:8px;"><strong>' + esc(d.name || 'مستخدم') + '</strong><span style="color:#f59e0b;">' + '★★★★★'.slice(0, d.rating) + '<span style="color:var(--border);">' + '★★★★★'.slice(d.rating) + '</span></span></div>' +
        (d.text ? '<p style="margin:6px 0;white-space:pre-line;font-size:14px;line-height:1.8;">' + esc(d.text) + '</p>' : '') +
        '<div class="ads-row" style="margin-top:4px;"><span class="ads-meta">' + esc(adsDate(d.updatedAt)) + '</span><button type="button" class="ads-btn secondary" style="padding:4px 10px;font-size:12px;" data-report="' + esc(r.uid) + '">🚩 إبلاغ</button>' +
        (isAdmin ? '<button type="button" class="ads-btn danger" style="padding:4px 10px;font-size:12px;" data-adel="' + esc(r.uid) + '">🗑️ حذف (أدمن)</button>' : '') + '</div><div class="rep-box"></div></div>';
    }).join('') || '<p class="ads-meta" style="margin-top:10px;">كن أول من يقيّم هذا المطعم.</p>';

    $('rsSheet').innerHTML = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;"><div><div class="rs-name">' + esc(cur.n) + '</div>' +
      (cur.e ? '<div class="rs-en">' + esc(cur.e) + '</div>' : '') + '</div><button type="button" class="ads-btn secondary" id="rsClose" aria-label="إغلاق">✕</button></div>' +
      '<div class="rs-tags" style="margin-top:8px;"><span>📍 ' + esc(cur.a) + '</span><span>🍴 ' + esc(cur.c) + '</span></div>' +
      '<div style="margin-top:8px;">' + ratingLine(cur.id) + '</div>' +
      '<div class="ads-row" style="margin-top:10px;"><a class="ads-btn secondary" href="' + esc(mapUrl(cur)) + '" target="_blank" rel="noopener noreferrer">📍 الخريطة</a>' + linksHtml(cur, false) + '</div>' +
      '<div class="card-title" style="font-size:16px;margin-top:14px;">⭐ التقييمات والتعليقات' + (loading || failed ? '' : ' (' + reviews.length + ')') + '</div>' + form + list;
  }

  function msg(t, ok) { var m = $('rvMsg'); if (m) m.innerHTML = '<div class="ads-msg ' + (ok ? 'ok' : 'err') + '">' + esc(t) + '</div>'; }

  function commit(fn, newCount, newSum) {
    var aggRef = fbRef.db.collection('restRatings').doc(cur.id), batch = fbRef.db.batch();
    fn(batch, aggRef.collection('reviews').doc(curUser.uid));
    batch.set(aggRef, { ratingCount: newCount, ratingSum: newSum });
    return batch.commit().then(function () {
      if (newCount > 0) RAT[cur.id] = { c: newCount, s: newSum }; else delete RAT[cur.id];
      try { sessionStorage.setItem('restRat', JSON.stringify({ t: Date.now(), d: RAT })); } catch (e) {}
    });
  }
  function agg() { var x = RAT[cur.id]; return x || { c: 0, s: 0 }; }

  function save() {
    if (!curUser) return openAuthModal();
    if (!myStars) return msg('اختر عدد النجوم أولاً.');
    var mine = reviews.filter(function (r) { return r.uid === curUser.uid; })[0];
    var ts = firebase.firestore.FieldValue.serverTimestamp(), a = agg();
    var data = { rating: myStars, text: $('rvText').value.trim().slice(0, 500), name: (curUser.displayName || (curUser.email || '').split('@')[0] || 'مستخدم').slice(0, 40), updatedAt: ts, createdAt: mine ? (mine.d.createdAt || ts) : ts };
    $('rvSave').disabled = true;
    commit(function (b, ref) { b.set(ref, data); }, mine ? a.c : a.c + 1, a.s + myStars - (mine ? mine.d.rating : 0)).then(function () {
      if (typeof gtag === 'function') gtag('event', mine ? 'rest_review_updated' : 'rest_review_added', { rating: myStars });
      reviews = []; openModal(cur.id); draw();
    }).catch(function () { msg('تعذّر الحفظ — حدّث الصفحة وحاول مجدداً.'); $('rvSave').disabled = false; });
  }
  function delMine() {
    var mine = reviews.filter(function (r) { return r.uid === curUser.uid; })[0]; if (!mine) return;
    var a = agg();
    commit(function (b, ref) { b.delete(ref); }, Math.max(0, a.c - 1), Math.max(0, a.s - mine.d.rating)).then(function () {
      myStars = 0; var id = cur.id; openModal(id); draw();
    }).catch(function () { msg('تعذّر الحذف.'); });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var ch = t.closest && t.closest('[data-area]');
    if (ch && $('rsAreas').contains(ch)) { st.area = ch.getAttribute('data-area'); st.shown = PAGE; draw(); return; }
    var op = t.closest && t.closest('[data-open]'); if (op) { openModal(op.getAttribute('data-open')); return; }
    var cd = t.closest && t.closest('.rs-card'); if (cd && !t.closest('a,button')) { openModal(cd.getAttribute('data-id')); return; }
    if (t === $('rsModal') || (t.closest && t.closest('#rsClose'))) { closeModal(); return; }
    if (t.closest && t.closest('#rvLogin')) { openAuthModal(); return; }
    if (t.closest && t.closest('#rvSave')) { save(); return; }
    if (t.closest && t.closest('#rvDel')) { delMine(); return; }
    var s = t.closest && t.closest('[data-star]');
    if (s) { myStars = +s.getAttribute('data-star'); document.querySelectorAll('#rvStars [data-star]').forEach(function (x) { x.textContent = +x.getAttribute('data-star') <= myStars ? '★' : '☆'; }); return; }
    var rp = t.closest && t.closest('[data-report]');
    if (rp) {
      if (!curUser) return openAuthModal();
      rp.closest('[data-ruid]').querySelector('.rep-box').innerHTML = '<div class="ads-form" style="margin-top:6px;"><select class="rep-reason"><option>محتوى مسيء أو غير لائق</option><option>معلومات كاذبة</option><option>سبام أو إعلان</option><option>غير ذلك</option></select><div class="ads-row"><button type="button" class="ads-btn danger" data-send-rep="' + esc(rp.getAttribute('data-report')) + '">🚩 أرسل البلاغ</button></div></div>';
      return;
    }
    var sr = t.closest && t.closest('[data-send-rep]');
    if (sr) {
      var box = sr.closest('.rep-box'); sr.disabled = true;
      fbRef.db.collection('restReports').add({ rid: cur.id, reviewUid: sr.getAttribute('data-send-rep'), reason: box.querySelector('.rep-reason').value, reporterUid: curUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() })
        .then(function () { box.innerHTML = '<div class="ads-msg ok">✅ وصلنا البلاغ، شكراً لك.</div>'; })
        .catch(function () { box.innerHTML = '<div class="ads-msg err">تعذّر إرسال البلاغ.</div>'; });
      return;
    }
    var ad = t.closest && t.closest('[data-adel]');
    if (ad && isAdmin) {
      var ruid = ad.getAttribute('data-adel'), r = reviews.filter(function (x) { return x.uid === ruid; })[0]; if (!r) return;
      ad.disabled = true;
      var ref = fbRef.db.collection('restRatings').doc(cur.id), b = fbRef.db.batch(), a = agg();
      var nc = Math.max(0, a.c - 1), ns = Math.max(0, a.s - r.d.rating);
      b.delete(ref.collection('reviews').doc(ruid)); b.set(ref, { ratingCount: nc, ratingSum: ns });
      b.commit().then(function () { if (nc) RAT[cur.id] = { c: nc, s: ns }; else delete RAT[cur.id]; var id = cur.id; openModal(id); draw(); }).catch(function () { ad.disabled = false; });
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('rsModal').hidden) closeModal(); });
  var timer;
  $('rsSearch').addEventListener('input', function () { clearTimeout(timer); var v = this.value; timer = setTimeout(function () { st.q = v; st.shown = PAGE; draw(); }, 120); });
  $('rsAreaSel').addEventListener('change', function () { st.area = this.value; st.shown = PAGE; draw(); });
  $('rsCuisine').addEventListener('change', function () { st.cuisine = this.value; st.shown = PAGE; draw(); });
  $('rsSort').addEventListener('change', function () { st.sort = this.value; st.shown = PAGE; draw(); });
  $('rsMore').addEventListener('click', function () { st.shown += PAGE; draw(); });

  draw();
  loadRatings();
  adsOnUser(function (user, fb) {
    curUser = user; if (fb) fbRef = fb;
    adsIsAdmin(fb, user).then(function (a) { isAdmin = a; if (cur) drawSheet(false); });
    if (cur) drawSheet(false);
  });
})();
