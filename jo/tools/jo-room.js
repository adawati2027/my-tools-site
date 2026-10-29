(function () {
  var CFG = { apiKey: 'AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ', authDomain: 'adawati-challenges.firebaseapp.com', projectId: 'adawati-challenges', appId: '1:360902823980:web:bd85f87de77dcfc315c189' };
  var FB = 'https://www.gstatic.com/firebasejs/10.13.2/';
  var ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var db = null;

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function rid(n) { var s = ''; var a = new Uint8Array(n); (window.crypto || window.msCrypto).getRandomValues(a); for (var i = 0; i < n; i++) s += ALPH[a[i] % ALPH.length]; return s; }
  var PID = ls('adawati_pid'); if (!PID) { PID = rid(24); ls('adawati_pid', PID); }
  function load(u) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  function ready() {
    if (db) return Promise.resolve(db);
    return Promise.resolve(typeof firebase === 'undefined' ? load(FB + 'firebase-app-compat.js') : 0)
      .then(function () { return typeof firebase.firestore === 'function' ? 0 : load(FB + 'firebase-firestore-compat.js'); })
      .then(function () { if (!firebase.apps.length) firebase.initializeApp(CFG); db = firebase.firestore(); return db; });
  }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function norm(s) { return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; }).replace(/[^A-Za-z0-9]/g, '').toUpperCase(); }

  var CSS = '.jr-box{margin-top:18px;padding:14px;border:1px dashed var(--border,#cbd5e1);border-radius:14px;background:var(--surface-2,#f1f5f9)}' +
    '.jr-t{font-weight:800;font-size:16px;margin-bottom:8px}.jr-in{width:100%;padding:11px;border:1px solid var(--border,#cbd5e1);border-radius:10px;background:var(--surface,#fff);color:var(--text,#0f172a);font-family:inherit;font-size:16px;box-sizing:border-box;margin-bottom:8px}' +
    '.jr-b{padding:10px 14px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-weight:800;font-family:inherit;font-size:15px;cursor:pointer;margin:3px}.jr-b.s{background:var(--surface,#fff);color:var(--text,#0f172a);border:1px solid var(--border,#cbd5e1)}.jr-b:disabled{opacity:.5}' +
    '.jr-code{font-size:30px;font-weight:900;letter-spacing:6px;text-align:center;direction:ltr;padding:8px;background:var(--surface,#fff);border-radius:12px;margin:8px 0}' +
    '.jr-pl{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.jr-pl span{padding:5px 11px;border-radius:99px;background:var(--surface,#fff);border:1px solid var(--border,#cbd5e1);font-size:14px;font-weight:700}' +
    '.jr-m{font-size:13px;color:#b91c1c;min-height:18px;margin:4px 0}.jr-n{font-size:13px;color:var(--text-muted,#64748b);line-height:1.7}';
  (function () { var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); })();

  var G = {};
  function gval(v) { if (!v) return undefined; if (v.integerValue != null) return +v.integerValue; if (v.doubleValue != null) return +v.doubleValue; if (v.mapValue) { var o = {}, f = v.mapValue.fields || {}; Object.keys(f).forEach(function (k) { o[k] = gval(f[k]); }); return o; } return undefined; }
  var gp = null;
  function gload() {
    if (!gp) gp = fetch('https://firestore.googleapis.com/v1/projects/' + CFG.projectId + '/databases/(default)/documents/config/site?mask.fieldPaths=games').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { var g = j && j.fields && gval(j.fields.games); if (g) G = g; return G; }).catch(function () { return G; });
    return gp;
  }
  function num(v, lo, hi, d) { v = Math.round(+v); return v >= lo && v <= hi ? v : d; }
  var JoRoom = {
    pid: PID,
    cfg: function (game) { return G[game] || {}; },
    num: num,
    mount: function (host, o) {
      var box = el('div', 'jr-box'); host.appendChild(box);
      gload().then(function () { var c = G[o.game]; if (c && c.max) o.max = num(c.max, o.min, o.max, o.max); });
      var ctx = null, un = [];
      var name = ls('adawati_pname') || '';
      var urlCode = ''; try { urlCode = norm(new URLSearchParams(location.search).get('room') || ''); } catch (e) {}

      function idle() {
        box.innerHTML = '';
        box.appendChild(el('div', 'jr-t', '🌐 العب أونلاين مع صديق'));
        box.appendChild(el('div', 'jr-n', 'كل لاعب يلعب من جواله. أنشئ غرفة وأرسل الرابط، أو أدخل رمز غرفة صديقك.'));
        var nm = el('input', 'jr-in'); nm.placeholder = 'اسمك'; nm.maxLength = 20; nm.value = name; nm.style.marginTop = '10px'; box.appendChild(nm);
        var msg = el('div', 'jr-m');
        var cr = el('button', 'jr-b', '➕ إنشاء غرفة'); cr.type = 'button';
        var cd = el('input', 'jr-in'); cd.placeholder = 'رمز الغرفة'; cd.maxLength = 8; cd.style.direction = 'ltr'; cd.style.textAlign = 'center'; cd.value = urlCode;
        var jn = el('button', 'jr-b s', '🚪 انضمام'); jn.type = 'button';
        function nmOk() { name = nm.value.trim().slice(0, 20); if (name.length < 2) { msg.textContent = 'اكتب اسمك أولًا (حرفان على الأقل).'; return false; } ls('adawati_pname', name); return true; }
        function busy(b) { cr.disabled = jn.disabled = b; }
        cr.addEventListener('click', function () { if (!nmOk()) return; msg.textContent = ''; busy(true); create().catch(function (e) { msg.textContent = 'تعذّر إنشاء الغرفة. حاول لاحقًا.'; busy(false); }); });
        jn.addEventListener('click', function () { if (!nmOk()) return; var c = norm(cd.value); if (c.length < 4) { msg.textContent = 'اكتب رمز الغرفة.'; return; } msg.textContent = ''; busy(true); join(c).catch(function (e) { msg.textContent = (e && e.m) || 'تعذّر الانضمام. تأكد من الرمز.'; busy(false); }); });
        box.appendChild(cr); box.appendChild(el('div', 'jr-n', 'أو')); box.appendChild(cd); box.appendChild(jn); box.appendChild(msg);
        if (urlCode) { box.scrollIntoView && box.scrollIntoView({ block: 'center' }); }
      }

      function create() {
        return ready().then(function () {
          var code = rid(5);
          return db.collection('rooms').doc(code).get().then(function (d) {
            if (d.exists) return create();
            var now = Date.now();
            return db.collection('rooms').doc(code).set({ game: o.game, hostId: PID, hostName: name, status: 'lobby', state: '{}', createdAt: now, updatedAt: now })
              .then(function () { return enter(code, true); });
          });
        });
      }
      function join(code) {
        return ready().then(function () {
          return db.collection('rooms').doc(code).get().then(function (d) {
            if (!d.exists) throw { m: 'الغرفة غير موجودة.' };
            var r = d.data();
            if (r.game !== o.game) throw { m: 'هذا الرمز للعبة أخرى.' };
            if (r.status === 'closed') throw { m: 'أُغلقت هذه الغرفة.' };
            return db.collection('rooms').doc(code).collection('players').get().then(function (q) {
              var ids = q.docs.map(function (x) { return x.id; });
              if (ids.indexOf(PID) < 0 && ids.length >= o.max) throw { m: 'الغرفة ممتلئة.' };
              if (ids.indexOf(PID) < 0 && r.status === 'playing' && !o.lateJoin) throw { m: 'بدأت اللعبة في هذه الغرفة.' };
              return enter(code, r.hostId === PID);
            });
          });
        });
      }

      function enter(code, isHost) {
        var rref = db.collection('rooms').doc(code), pref = rref.collection('players');
        var room = null;
        ctx = {
          code: code, pid: PID, name: name, db: db, room: null, players: [],
          isHost: function () { return room && room.hostId === PID; },
          setState: function (s, status) { var u = { state: JSON.stringify(s), updatedAt: Date.now() }; if (status) u.status = status; return rref.update(u); },
          setSecret: function (pid, text) { return rref.collection('secret').doc(pid).set({ d: String(text).slice(0, 300) }); },
          getSecret: function (pid) { return rref.collection('secret').doc(pid || PID).get().then(function (d) { return d.exists ? d.data().d : null; }); },
          setMine: function (f) { return pref.doc(PID).set(f, { merge: true }); },
          leave: leave
        };
        return pref.doc(PID).get().then(function (me) { return pref.doc(PID).set(me.exists ? { name: name } : { name: name, jt: Date.now() }, { merge: true }); }).then(function () {
          un.push(rref.onSnapshot(function (d) {
            if (!d.exists) return;
            var r = d.data(); room = r; var s = {}; try { s = JSON.parse(r.state || '{}'); } catch (e) {}
            ctx.room = { game: r.game, hostId: r.hostId, hostName: r.hostName, status: r.status, s: s };
            if (r.status === 'closed' && r.hostId !== PID) { leave(true); return; }
            paint(); if (o.onRoom) o.onRoom(ctx.room, ctx);
          }));
          un.push(pref.onSnapshot(function (q) {
            var a = []; q.forEach(function (x) { var v = x.data(); a.push({ id: x.id, name: v.name, jt: v.jt || 0, v: v.v, vr: v.vr, sc: v.sc, sr: v.sr, ft: v.ft, pg: v.pg }); });
            a.sort(function (p, z) { return p.jt - z.jt || (p.id < z.id ? -1 : 1); });
            ctx.players = a; paint(); if (o.onPlayers) o.onPlayers(a, ctx);
          }));
          if (o.onJoin) o.onJoin(ctx);
          try { history.replaceState(null, '', location.pathname + '?room=' + code); } catch (e) {}
        });
      }

      function link() { return location.origin + location.pathname + '?room=' + ctx.code; }
      function paint() {
        if (!ctx || !ctx.room) return;
        var r = ctx.room, pl = ctx.players, host = ctx.isHost();
        box.innerHTML = '';
        box.appendChild(el('div', 'jr-t', '🌐 غرفة أونلاين'));
        box.appendChild(el('div', 'jr-code', ctx.code));
        var row = el('div');
        var sh = el('button', 'jr-b', '📤 شارك الرابط'); sh.type = 'button';
        var text = o.shareText || 'تعال العب معي';
        sh.addEventListener('click', function () {
          if (navigator.share) navigator.share({ title: document.title, text: text, url: link() }).catch(function () {});
          else if (navigator.clipboard) navigator.clipboard.writeText(link()).then(function () { sh.textContent = '✔ تم النسخ'; });
        });
        var lv = el('button', 'jr-b s', '🚪 خروج'); lv.type = 'button'; lv.addEventListener('click', function () { leave(); });
        row.appendChild(sh); row.appendChild(lv); box.appendChild(row);
        var pe = el('div', 'jr-pl'); pl.forEach(function (p, i) { pe.appendChild(el('span', '', (p.id === r.hostId ? '👑 ' : '') + p.name + (p.id === PID ? ' (أنت)' : ''))); }); box.appendChild(pe);
        if (r.status === 'lobby') {
          if (host) {
            if (o.hostExtra) box.appendChild(o.hostExtra(ctx));
            var st = el('button', 'jr-b', '▶ ابدأ اللعب'); st.type = 'button';
            st.disabled = pl.length < o.min;
            st.addEventListener('click', function () { st.disabled = true; o.onHostStart(ctx); });
            box.appendChild(st);
            box.appendChild(el('div', 'jr-n', pl.length < o.min ? 'بانتظار انضمام ' + (o.min - pl.length) + (o.min - pl.length === 1 ? ' لاعب على الأقل.' : ' لاعبين على الأقل.') : 'يمكنك البدء الآن، أو انتظر باقي اللاعبين (حتى ' + o.max + ').'));
          } else box.appendChild(el('div', 'jr-n', 'بانتظار المضيف ليبدأ اللعبة…'));
        }
      }

      function leave(forced) {
        un.forEach(function (f) { try { f(); } catch (e) {} }); un = [];
        var c = ctx; ctx = null;
        var done = function () { try { history.replaceState(null, '', location.pathname); } catch (e) {} urlCode = ''; idle(); if (o.onLeave) o.onLeave(forced); };
        if (!c) { done(); return; }
        var rref = db.collection('rooms').doc(c.code);
        var p = rref.collection('players').doc(PID).delete().catch(function () {});
        if (c.room && c.room.hostId === PID) p = p.then(function () { return rref.update({ status: 'closed', updatedAt: Date.now() }).catch(function () {}); });
        p.then(done, done);
      }

      idle();
      return { leave: function () { if (ctx) leave(); } };
    }
  };
  window.JoRoom = JoRoom;
})();
