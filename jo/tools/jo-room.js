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
      .then(function () { return typeof firebase.auth === 'function' ? 0 : load(FB + 'firebase-auth-compat.js').catch(function () {}); })
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
    '.jr-chat{margin-top:10px;padding:12px;border:1px solid var(--border,#cbd5e1);border-radius:14px;background:var(--surface,#fff)}.jr-cl{height:230px;overflow-y:auto;margin:8px 0;padding:8px;border:1px solid var(--border,#cbd5e1);border-radius:10px;background:var(--surface-2,#f1f5f9);display:flex;flex-direction:column;gap:6px}.jr-ce0{text-align:center;color:var(--text-muted,#64748b);font-size:13px;padding:30px 0}.jr-cm{font-size:14px;line-height:1.6;padding:6px 10px;border-radius:12px;background:var(--surface,#fff);border:1px solid var(--border,#cbd5e1);max-width:85%;word-break:break-word;align-self:flex-start}.jr-cm.me{background:var(--primary,#2563eb);color:#fff;border-color:transparent;align-self:flex-end}.jr-cm b{font-size:11px;display:block;opacity:.75}.jr-cp{border:none;background:none;color:inherit;font-family:inherit;font-size:14px;cursor:pointer;padding:0}.jr-cq{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px}.jr-cqb{white-space:nowrap;padding:6px 10px;border-radius:99px;border:1px solid var(--border,#cbd5e1);background:var(--surface,#fff);color:inherit;font-family:inherit;font-size:13px;cursor:pointer}.jr-ce{grid-template-columns:repeat(8,1fr);gap:4px;margin-top:6px}.jr-ceb{font-size:22px;border:none;background:none;cursor:pointer}.jr-cf{display:flex;gap:6px;margin-top:8px}.jr-cf .jr-in{flex:1;min-width:0}.jr-cf .jr-b{margin:0}.jr-cb{font-size:20px;border:1px solid var(--border,#cbd5e1);border-radius:10px;background:var(--surface,#fff);cursor:pointer;padding:0 10px}.jr-m{font-size:13px;color:#b91c1c;min-height:18px;margin:4px 0}.jr-n{font-size:13px;color:var(--text-muted,#64748b);line-height:1.7}';
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
      var ctx = null, un = [], cbox = null, clast = 0;
      var name = ls('adawati_pname') || '';
      var urlCode = ''; try { urlCode = norm(new URLSearchParams(location.search).get('room') || ''); } catch (e) {}

      function idle() {
        box.innerHTML = '';
        box.appendChild(el('div', 'jr-t', '🌐 العب أونلاين مع صديق'));
        box.appendChild(el('div', 'jr-n', urlCode ? 'تمت دعوتك إلى غرفة. اكتب اسمك ثم اضغط انضمام.' : 'كل لاعب يلعب من جواله. أنشئ غرفة وأرسل الرابط، أو أدخل رمز غرفة صديقك.'));
        var nm = el('input', 'jr-in'); nm.placeholder = 'اسمك'; nm.maxLength = 20; nm.value = name; nm.style.marginTop = '10px'; box.appendChild(nm);
        var msg = el('div', 'jr-m');
        var cr = el('button', 'jr-b', '➕ إنشاء غرفة'); cr.type = 'button';
        var cd = el('input', 'jr-in'); cd.placeholder = 'رمز الغرفة'; cd.maxLength = 8; cd.style.direction = 'ltr'; cd.style.textAlign = 'center'; cd.value = urlCode;
        var jn = el('button', 'jr-b s', '🚪 انضمام'); jn.type = 'button';
        function nmOk() { name = nm.value.trim().slice(0, 20); if (name.length < 2) { msg.textContent = 'اكتب اسمك أولًا (حرفان على الأقل).'; return false; } ls('adawati_pname', name); return true; }
        function busy(b) { cr.disabled = jn.disabled = b; }
        cr.addEventListener('click', function () { if (!nmOk()) return; msg.textContent = ''; busy(true); create().catch(function (e) { msg.textContent = 'تعذّر إنشاء الغرفة. حاول لاحقًا.'; busy(false); }); });
        jn.addEventListener('click', function () { if (!nmOk()) return; var c = norm(cd.value); if (c.length < 4) { msg.textContent = 'اكتب رمز الغرفة.'; return; } msg.textContent = ''; busy(true); join(c).catch(function (e) { msg.textContent = (e && e.m) || 'تعذّر الانضمام. تأكد من الرمز.'; busy(false); }); });
        if (!urlCode) { box.appendChild(cr); box.appendChild(el('div', 'jr-n', 'أو')); } box.appendChild(cd); box.appendChild(jn); box.appendChild(msg);
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
          chatOpen(rref);
          if (o.onJoin) o.onJoin(ctx);
          try { history.replaceState(null, '', location.pathname + '?room=' + code); } catch (e) {}
        });
      }

      var EMO = ['😂','🤣','😅','😎','🔥','👏','💪','🤔','😮','😭','😡','🥳','❤️','👍','👎','🙏','🎯','🏆','🥇','🤯','😴','🫡','✅','❌'];
      var QK = ['😂 ما توقعتها!', '🔥 جاوبت صح', '🤔 السؤال صعب', '🏆 مين الأول؟', '💪 جاي أغلبكم', '👏 برافو عليك'];
      var BAD = ['كلب','حمار','حيوان','زبالة','وسخ','قذر','تافه','غبي','حقير','واطي','fuck','shit','bitch','asshole','bastard','dick','idiot','stupid'];
      function cclean(t) {
        BAD.forEach(function (w) { t = t.replace(new RegExp('(^|[\\s.,!?؟،])(' + w + ')(?=$|[\\s.,!?؟،])', 'gi'), function (m, x, y) { return x + '*'.repeat(y.length); }); });
        return t;
      }
      function chatOpen(rref) {
        chatClose();
        cbox = el('div', 'jr-chat'); box.parentNode.insertBefore(cbox, box.nextSibling);
        var head = el('div', 'jr-t', '💬 دردشة الغرفة'), cl = el('div', 'jr-cl'), ctl = el('div', 'jr-cc'), lg = el('div', 'jr-n'), er = el('div', 'jr-m');
        var qk = el('div', 'jr-cq'), ep = el('div', 'jr-ce'), cf = el('div', 'jr-cf');
        var eb = el('button', 'jr-cb', '😊'), mb = el('button', 'jr-cb', '🎤'), ci = el('input', 'jr-in'), cs = el('button', 'jr-b', 'إرسال');
        eb.type = mb.type = cs.type = 'button'; ci.placeholder = 'اكتب رسالة…'; ci.maxLength = 200; ep.style.display = 'none';
        eb.setAttribute('aria-label', 'إيموجي'); mb.setAttribute('aria-label', 'رسالة صوتية');
        QK.forEach(function (q) { var b = el('button', 'jr-cqb', q); b.type = 'button'; b.addEventListener('click', function () { send(q); }); qk.appendChild(b); });
        EMO.forEach(function (e) { var b = el('button', 'jr-ceb', e); b.type = 'button'; b.addEventListener('click', function () { ci.value += e; ci.focus(); }); ep.appendChild(b); });
        cf.appendChild(eb); cf.appendChild(mb); cf.appendChild(ci); cf.appendChild(cs);
        ctl.appendChild(qk); ctl.appendChild(ep); ctl.appendChild(cf);
        [head, cl, ctl, lg, er].forEach(function (x) { cbox.appendChild(x); });
        var cu = null, msgs = [], playing = null, rec = null, recChunks = [], recStart = 0, recTimer = null, recStream = null;
        function gate(u) {
          cu = u; ctl.style.display = u ? '' : 'none'; lg.style.display = u ? 'none' : ''; lg.innerHTML = '';
          if (u) return;
          lg.appendChild(document.createTextNode('يمكن للجميع قراءة الدردشة، لكن الكتابة للمسجّلين فقط. '));
          var lb = el('button', 'jr-b', '🔑 سجّل الدخول'); lb.type = 'button'; lb.style.margin = '6px 0 0';
          lb.addEventListener('click', function () { if (typeof window.openAuthModal === 'function') window.openAuthModal(); });
          lg.appendChild(el('br')); lg.appendChild(lb);
        }
        gate(null);
        ready().then(function () {
          if (typeof firebase.auth !== 'function' || !cbox) return;
          un.push(firebase.auth().onAuthStateChanged(function (u) { gate(u || null); }));
        }).catch(function () {});
        function fail(e) { er.textContent = e && e.code === 'permission-denied' ? 'ما انبعتت الرسالة — يمكن حسابك موقوف عن الدردشة.' : 'ما انبعتت الرسالة، جرّب مرة ثانية.'; }
        function send(text) {
          var t = String(text || '').trim().slice(0, 200), now = Date.now();
          if (!cu) { er.textContent = 'سجّل الدخول أولاً لتكتب.'; return; }
          if (!t) return;
          if (now - clast < 1500) { er.textContent = '⏳ انتظر ثانية قبل الرسالة التالية.'; return; }
          clast = now; er.textContent = ''; ci.value = ''; ep.style.display = 'none';
          rref.collection('chat').doc(now.toString(36) + rid(4)).set({ p: PID, u: cu.uid, n: name, t: t, ts: now }).catch(function (e) { ci.value = t; fail(e); });
        }
        cs.addEventListener('click', function () { send(ci.value); });
        ci.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(ci.value); } });
        eb.addEventListener('click', function () { ep.style.display = ep.style.display === 'none' ? 'grid' : 'none'; });
        mb.addEventListener('click', function () {
          if (rec && rec.state === 'recording') { rec.stop(); return; }
          if (!window.MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { er.textContent = 'جهازك لا يدعم التسجيل الصوتي.'; return; }
          if (Date.now() - clast < 1500) { er.textContent = '⏳ انتظر ثانية قبل الرسالة التالية.'; return; }
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            recStream = stream; recChunks = [];
            var mime = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].filter(function (c) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c); })[0] || '';
            rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : { audioBitsPerSecond: 24000 });
            rec.ondataavailable = function (e) { if (e.data && e.data.size) recChunks.push(e.data); };
            rec.onstop = function () {
              clearInterval(recTimer); mb.textContent = '🎤'; recStream.getTracks().forEach(function (x) { x.stop(); });
              var dur = Math.min(20, (Date.now() - recStart) / 1000);
              if (dur < 1) { er.textContent = 'التسجيل قصير جداً.'; return; }
              sendVoice(new Blob(recChunks, { type: rec.mimeType || mime || 'audio/webm' }), dur);
            };
            rec.start(); recStart = Date.now(); er.textContent = '';
            recTimer = setInterval(function () { var n = Math.floor((Date.now() - recStart) / 1000); mb.textContent = '⏹️ ' + n; if (n >= 20) rec.stop(); }, 250);
          }).catch(function (e) { er.textContent = e && e.name === 'NotAllowedError' ? 'اسمح للموقع باستخدام المايكروفون.' : 'تعذّر تشغيل المايكروفون.'; });
        });
        function shrink(blob, maxSec) {
          var AC = window.AudioContext || window.webkitAudioContext, OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
          if (!AC || !OAC) return Promise.reject(new Error('no audio'));
          return blob.arrayBuffer().then(function (buf) {
            var ctx = new AC();
            return new Promise(function (res, rej) { ctx.decodeAudioData(buf, res, rej); }).then(function (audio) {
              ctx.close && ctx.close();
              var rate = 11025, len = Math.min(audio.duration, maxSec), off = new OAC(1, Math.ceil(len * rate), rate), src = off.createBufferSource();
              src.buffer = audio; src.connect(off.destination); src.start(0);
              return off.startRendering().then(function (out) {
                var d = out.getChannelData(0), n = d.length, view = new DataView(new ArrayBuffer(44 + n));
                var w = function (o, t) { for (var i = 0; i < t.length; i++) view.setUint8(o + i, t.charCodeAt(i)); };
                w(0, 'RIFF'); view.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); view.setUint32(16, 16, true);
                view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate, true);
                view.setUint16(32, 1, true); view.setUint16(34, 8, true); w(36, 'data'); view.setUint32(40, n, true);
                for (var i = 0; i < n; i++) view.setUint8(44 + i, Math.round((Math.max(-1, Math.min(1, d[i])) + 1) * 127.5));
                return { blob: new Blob([view], { type: 'audio/wav' }), dur: len };
              });
            });
          });
        }
        function sendVoice(blob, dur) {
          if (!cu) return;
          if (blob.size > 380000) {
            er.textContent = '⏳ جاري تجهيز الرسالة الصوتية…';
            shrink(blob, 20).then(function (r) { sendVoice(r.blob, r.dur); }).catch(function () { er.textContent = 'تعذّر تجهيز الرسالة الصوتية، جرّب رسالة أقصر.'; });
            return;
          }
          var fr = new FileReader();
          fr.onload = function () {
            var now = Date.now(), id = now.toString(36) + rid(4), bt = db.batch();
            clast = now; er.textContent = '⏳ جاري الإرسال…';
            bt.set(rref.collection('chat').doc(id), { p: PID, u: cu.uid, n: name, t: '🎤', ts: now, v: true, d: Math.round(dur * 10) / 10 });
            bt.set(rref.collection('voices').doc(id), { u: cu.uid, a: fr.result, ts: now });
            bt.commit().then(function () { er.textContent = ''; }).catch(fail);
          };
          fr.readAsDataURL(blob);
        }
        function play(btn, id) {
          if (playing) { playing.a.pause(); var was = playing.id; playing.b.textContent = playing.label; playing = null; if (was === id) return; }
          var label = btn.textContent; btn.textContent = '⏳';
          rref.collection('voices').doc(id).get().then(function (d) {
            var src = d.exists ? String(d.data().a || '') : '', comma = src.indexOf(','), hd = src.slice(0, comma);
            if (comma < 0 || !/^data:/i.test(hd) || !/;base64$/i.test(hd)) { btn.textContent = 'لا يوجد صوت'; return; }
            var type = (hd.slice(5).split(';')[0] || '').trim().toLowerCase(); if (!/^audio\/|^video\//.test(type)) type = 'audio/mp4';
            var bin = atob(src.slice(comma + 1)), arr = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
            var a = new Audio(URL.createObjectURL(new Blob([arr], { type: type })));
            playing = { a: a, b: btn, id: id, label: label };
            a.onended = function () { btn.textContent = label; playing = null; };
            btn.textContent = '⏸️ إيقاف';
            a.play().catch(function () { btn.textContent = '⚠️ تعذّر التشغيل'; playing = null; });
          }).catch(function () { btn.textContent = label; });
        }
        un.push(function () { if (playing) playing.a.pause(); if (rec && rec.state === 'recording') { rec.onstop = null; rec.stop(); if (recStream) recStream.getTracks().forEach(function (x) { x.stop(); }); } clearInterval(recTimer); });
        un.push(rref.collection('chat').orderBy('ts').limitToLast(50).onSnapshot(function (q) {
          msgs = []; q.forEach(function (x) { var m = x.data(); m.id = x.id; msgs.push(m); });
          msgs.sort(function (p, z) { return p.ts - z.ts; });
          var atEnd = cl.scrollHeight - cl.scrollTop - cl.clientHeight < 60 || (msgs.length && msgs[msgs.length - 1].p === PID);
          cl.innerHTML = '';
          if (!msgs.length) { cl.appendChild(el('div', 'jr-ce0', 'لا توجد رسائل بعد — ابدأ الحديث 👋')); return; }
          msgs.forEach(function (m) {
            var d = el('div', 'jr-cm' + (m.p === PID ? ' me' : ''));
            if (m.p !== PID) d.appendChild(el('b', '', m.n));
            if (m.v) { var pb = el('button', 'jr-cp', '▶️ رسالة صوتية · ' + Math.round(m.d || 0) + ' ث'); pb.type = 'button'; pb.addEventListener('click', function () { play(pb, m.id); }); d.appendChild(pb); }
            else d.appendChild(document.createTextNode(cclean(String(m.t))));
            cl.appendChild(d);
          });
          if (atEnd) cl.scrollTop = cl.scrollHeight;
        }, function () { er.textContent = 'تعذّر تحميل الدردشة.'; }));
      }
      function chatClose() { if (cbox && cbox.parentNode) cbox.parentNode.removeChild(cbox); cbox = null; }

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
        un.forEach(function (f) { try { f(); } catch (e) {} }); un = []; chatClose();
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
