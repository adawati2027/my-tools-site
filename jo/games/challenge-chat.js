(function() {
  var EMOJI = ['😂','🤣','😅','😎','🔥','👏','💪','🤔','😮','😭','😡','🥳','❤️','👍','👎','🙏','🎯','🏆','🥇','🤯','😴','🫡','✅','❌'];
  var QUICK = ['😂 ما توقعتها!', '🔥 جاوبت صح', '🤔 السؤال صعب', '🏆 مين الأول؟', '💪 جاي أغلبكم', '👏 برافو عليك'];
  var BAD = ['كلب','حمار','حيوان','زبالة','وسخ','قذر','تافه','غبي','حقير','واطي','fuck','shit','bitch','asshole','bastard','dick','idiot','stupid'];
  var mounted = false, unsub = null, box, user = null, isAdmin = false, chId = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clean(t) {
    BAD.forEach(function(w) {
      var re = new RegExp('(^|[\\s.,!?؟،])(' + w + ')(?=$|[\\s.,!?؟،])', 'gi');
      t = t.replace(re, function(m, a, b) { return a + '*'.repeat(b.length); });
    });
    return t;
  }
  function loadScript(src) {
    return new Promise(function(res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  function authReady() {
    return typeof firebase.auth === 'function' ? Promise.resolve() : loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js');
  }
  var signingIn = false;
  function signIn() {
    if (typeof firebase.auth !== 'function') { var m0 = box.querySelector('.cc-msg'); if (m0) m0.textContent = '⏳ لحظة، لسا بنجهّز الدخول — جرّب كمان ثانيتين.'; return; }
    signingIn = true;
    var nativeAuth = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseAuthentication;
    var msg = box.querySelector('.cc-msg');
    if (nativeAuth) {
      nativeAuth.signInWithGoogle().then(function(r) {
        var tok = r && r.credential && r.credential.idToken;
        if (tok) return firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(tok));
      }).catch(function(e) { if (msg) msg.textContent = 'ما زبط الدخول (' + ((e && (e.code || e.message)) || '') + ')'; });
      return;
    }
    var lb = box.querySelector('.cc-login');
    if (lb) { if (lb.disabled) return; lb.disabled = true; lb.textContent = '⏳ جاري الدخول...'; }
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function(e) {
      if (lb) { lb.disabled = false; lb.textContent = '🔐 الدخول عبر Google'; }
      if (e && (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request')) return;
      if (msg) msg.textContent = 'ما زبط الدخول (' + ((e && e.code) || '') + ') — جرّب مرة ثانية.';
    });
  }
  function fmtTime(ts) { try { var d = ts && ts.toDate ? ts.toDate() : new Date(); return d.toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }

  function renderShell() {
    if (!user) {
      box.innerHTML = '<div style="font-weight:800;font-size:16px;">💬 شات التحدي</div>' +
        '<div class="cc-list" style="height:240px;overflow-y:auto;border:1px solid var(--border);border-radius:10px;padding:8px;margin-top:8px;background:var(--surface-2);"></div>' +
        '<div style="margin-top:10px;padding:10px 12px;border-radius:10px;background:var(--surface-2);border:1px dashed var(--border);">' +
        '<p style="font-size:14px;color:var(--text-muted);margin:0 0 8px;">👀 إنت بتتفرّج بس — سجّل دخول عشان تكتب وتبعت صوت وتشارك بالشات.</p>' +
        '<button type="button" class="cc-login" style="padding:10px 16px;border-radius:999px;border:1.5px solid var(--border);background:#fff;color:#334155;font-weight:700;font-family:inherit;font-size:15px;cursor:pointer;">🔐 الدخول عبر Google</button><div class="cc-msg" style="font-size:13px;color:#dc2626;margin-top:6px;"></div></div>';
      box.querySelector('.cc-login').addEventListener('click', signIn);
      listen();
      return;
    }
    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="font-weight:800;font-size:16px;">💬 شات التحدي</div><div style="font-size:12px;color:var(--text-muted);">👤 ' + esc((user.displayName || user.email || '').split(' ')[0]) + '</div></div>' +
      '<div class="cc-list" style="height:280px;overflow-y:auto;border:1px solid var(--border);border-radius:10px;padding:8px;margin-top:8px;background:var(--surface-2);"></div>' +
      '<div class="cc-quick" style="display:flex;gap:6px;overflow-x:auto;margin-top:8px;padding-bottom:4px;">' + QUICK.map(function(q) { return '<button type="button" data-q="' + esc(q) + '" style="white-space:nowrap;padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:inherit;font-size:13px;cursor:pointer;">' + esc(q) + '</button>'; }).join('') + '</div>' +
      '<div class="cc-emoji" hidden style="display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin-top:6px;">' + EMOJI.map(function(e) { return '<button type="button" data-e="' + e + '" style="font-size:22px;border:none;background:none;cursor:pointer;">' + e + '</button>'; }).join('') + '</div>' +
      '<div style="display:flex;gap:6px;margin-top:8px;"><button type="button" class="cc-emo" aria-label="إيموجي" style="font-size:22px;border:1px solid var(--border);border-radius:10px;background:var(--surface);cursor:pointer;padding:0 10px;">😊</button>' +
      '<button type="button" class="cc-mic" aria-label="رسالة صوتية" style="font-size:20px;border:1px solid var(--border);border-radius:10px;background:var(--surface);cursor:pointer;padding:0 10px;">🎤</button>' +
      '<input class="cc-input" maxlength="300" placeholder="اكتب رسالة..." style="flex:1;min-width:0;padding:10px;border:1px solid var(--border);border-radius:10px;font-size:16px;font-family:inherit;background:var(--surface);color:var(--text);">' +
      '<button type="button" class="cc-send" style="padding:0 16px;border:none;border-radius:10px;background:var(--primary);color:#fff;font-weight:800;font-family:inherit;cursor:pointer;">إرسال</button></div>' +
      '<div class="cc-msg" style="font-size:12px;color:#dc2626;margin-top:6px;min-height:14px;"></div>' +
      '<div style="font-size:11px;color:var(--text-muted);">احترم غيرك 🤝 — أي رسالة مسيئة بتقدر تبلّغ عنها بـ🚩</div>';
    var input = box.querySelector('.cc-input');
    box.querySelector('.cc-send').addEventListener('click', function() { send(input.value); });
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); send(input.value); } });
    box.querySelector('.cc-emo').addEventListener('click', function() { var p = box.querySelector('.cc-emoji'); p.hidden = !p.hidden; p.style.display = p.hidden ? 'none' : 'grid'; });
    box.querySelector('.cc-emoji').style.display = 'none';
    box.querySelector('.cc-mic').addEventListener('click', toggleRecord);
    listen();
  }

  var msgs = [];
  function listen() {
    if (unsub) unsub();
    unsub = db.collection('challenges').doc(chId).collection('messages').orderBy('createdAt').limitToLast(100).onSnapshot(function(snap) {
      msgs = snap.docs.map(function(d) { return { id: d.id, d: d.data() }; });
      var list = box.querySelector('.cc-list'); if (!list) return;
      var atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
      list.innerHTML = msgs.length ? msgs.map(function(m) {
        var d = m.d, mine = !!user && d.uid === user.uid;
        return '<div data-id="' + m.id + '" style="display:flex;flex-direction:column;align-items:' + (mine ? 'flex-start' : 'flex-end') + ';margin:6px 0;">' +
          '<div style="max-width:85%;padding:7px 10px;border-radius:12px;background:' + (mine ? 'var(--primary)' : 'var(--surface)') + ';color:' + (mine ? '#fff' : 'var(--text)') + ';border:1px solid var(--border);font-size:15px;line-height:1.6;word-break:break-word;">' +
          (mine ? '' : '<div style="font-size:11px;font-weight:800;opacity:.75;">' + esc(d.name) + '</div>') +
          (d.voice ? '<button type="button" data-play="' + m.id + '" style="border:none;background:none;color:inherit;font-family:inherit;font-size:15px;cursor:pointer;padding:0;">▶️ رسالة صوتية · ' + Math.round(d.dur || 0) + ' ث</button>' : esc(clean(d.text))) + '</div>' +
          '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">' + esc(fmtTime(d.createdAt)) +
          (!user ? '' : mine ? ' · <a href="#" data-del="' + m.id + '" style="color:inherit;">حذف</a>' : ' · <a href="#" data-rep="' + m.id + '" style="color:inherit;">🚩 إبلاغ</a>') +
          (isAdmin && !mine ? ' · <a href="#" data-del="' + m.id + '" style="color:#dc2626;">حذف</a> · <a href="#" data-ban="' + esc(d.uid) + '" data-name="' + esc(d.name) + '" style="color:#dc2626;">حظر</a>' : '') +
          '</div></div>';
      }).join('') : '<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:30px 0;">' + (user ? 'لسا ما في رسائل — ابدأ الحكي 👋' : 'لسا ما في رسائل.') + '</div>';
      if (atBottom || msgs.length && user && msgs[msgs.length - 1].d.uid === user.uid) list.scrollTop = list.scrollHeight;
    }, function() { var m = box.querySelector('.cc-msg'); if (m) m.textContent = 'ما قدرنا نحمّل الشات.'; });
  }

  var lastSend = 0;
  function send(text) {
    var msg = box.querySelector('.cc-msg'), input = box.querySelector('.cc-input');
    text = String(text || '').trim().slice(0, 300);
    if (!text) return;
    if (Date.now() - lastSend < 3000) { msg.textContent = '⏳ استنى ثواني قبل الرسالة الجاي.'; return; }
    lastSend = Date.now(); msg.textContent = '';
    var ts = firebase.firestore.FieldValue.serverTimestamp(), b = db.batch();
    b.set(db.collection('chatMeta').doc(user.uid), { lastAt: ts });
    b.set(db.collection('challenges').doc(chId).collection('messages').doc(), { uid: user.uid, name: (user.displayName || (user.email || '').split('@')[0] || 'لاعب').slice(0, 40), text: text, createdAt: ts });
    input.value = '';
    b.commit().then(function() { if (typeof gtag === 'function') gtag('event', 'chat_message', { game_id: typeof QUIZ_CONFIG !== 'undefined' ? QUIZ_CONFIG.gameId : '' }); }).catch(function(e) { msg.textContent = e && e.code === 'permission-denied' ? 'ما انبعتت — يمكن بسرعة كبيرة أو حسابك موقوف عن الشات.' : 'ما انبعتت الرسالة، جرّب مرة ثانية.'; input.value = text; });
  }
  var rec = null, recChunks = [], recStart = 0, recTimer = null, recStream = null, playing = null;
  function pickMime() {
    var c = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
    for (var i = 0; i < c.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c[i])) return c[i];
    return '';
  }
  function toggleRecord() {
    var btn = box.querySelector('.cc-mic'), msg = box.querySelector('.cc-msg');
    if (rec && rec.state === 'recording') { rec.stop(); return; }
    if (!window.MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = 'جهازك أو متصفحك ما بيدعم التسجيل الصوتي.'; return; }
    if (Date.now() - lastSend < 3000) { msg.textContent = '⏳ استنى ثواني قبل الرسالة الجاي.'; return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      recStream = stream; recChunks = [];
      var mime = pickMime();
      rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : { audioBitsPerSecond: 24000 });
      rec.ondataavailable = function(e) { if (e.data && e.data.size) recChunks.push(e.data); };
      rec.onstop = function() {
        clearInterval(recTimer); btn.textContent = '🎤'; btn.style.background = 'var(--surface)';
        recStream.getTracks().forEach(function(t) { t.stop(); });
        var dur = Math.min(20, (Date.now() - recStart) / 1000);
        if (dur < 1) { msg.textContent = 'التسجيل قصير كثير.'; return; }
        sendVoice(new Blob(recChunks, { type: rec.mimeType || mime || 'audio/webm' }), dur);
      };
      rec.start(); recStart = Date.now(); msg.textContent = '';
      btn.style.background = '#fee2e2';
      recTimer = setInterval(function() {
        var s = Math.floor((Date.now() - recStart) / 1000);
        btn.textContent = '⏹️ ' + s;
        if (s >= 20) rec.stop();
      }, 250);
    }).catch(function(e) {
      msg.textContent = e && e.name === 'NotAllowedError' ? 'لازم تسمح باستخدام المايكروفون.' : 'ما قدرنا نشغّل المايكروفون.';
    });
  }
  function shrinkVoice(blob, maxSec) {
    var AC = window.AudioContext || window.webkitAudioContext, OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AC || !OAC) return Promise.reject(new Error('no audio api'));
    return blob.arrayBuffer().then(function(buf) {
      var ctx = new AC();
      return new Promise(function(res, rej) { ctx.decodeAudioData(buf, res, rej); }).then(function(audio) {
        ctx.close && ctx.close();
        var rate = 11025, len = Math.min(audio.duration, maxSec), frames = Math.ceil(len * rate);
        var off = new OAC(1, frames, rate), src = off.createBufferSource();
        src.buffer = audio; src.connect(off.destination); src.start(0);
        return off.startRendering().then(function(out) {
          var d = out.getChannelData(0), n = d.length, view = new DataView(new ArrayBuffer(44 + n));
          var w = function(o, s) { for (var i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
          w(0, 'RIFF'); view.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); view.setUint32(16, 16, true);
          view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, rate, true); view.setUint32(28, rate, true);
          view.setUint16(32, 1, true); view.setUint16(34, 8, true); w(36, 'data'); view.setUint32(40, n, true);
          for (var i = 0; i < n; i++) { var v = Math.max(-1, Math.min(1, d[i])); view.setUint8(44 + i, Math.round((v + 1) * 127.5)); }
          return { blob: new Blob([view], { type: 'audio/wav' }), dur: len };
        });
      });
    });
  }
  function sendVoice(blob, dur) {
    var msg = box.querySelector('.cc-msg');
    if (blob.size > 380000) {
      msg.textContent = '⏳ جاري تجهيز الرسالة الصوتية...';
      shrinkVoice(blob, 20).then(function(r) { sendVoice(r.blob, r.dur); }).catch(function() { msg.textContent = 'ما قدرنا نجهّز الرسالة الصوتية — جرّب رسالة أقصر.'; });
      return;
    }
    var r = new FileReader();
    r.onload = function() {
      lastSend = Date.now();
      var ts = firebase.firestore.FieldValue.serverTimestamp(), b = db.batch();
      var mref = db.collection('challenges').doc(chId).collection('messages').doc();
      b.set(db.collection('chatMeta').doc(user.uid), { lastAt: ts });
      b.set(mref, { uid: user.uid, name: (user.displayName || (user.email || '').split('@')[0] || 'لاعب').slice(0, 40), text: '🎤', voice: true, dur: Math.round(dur * 10) / 10, createdAt: ts });
      b.set(db.collection('challenges').doc(chId).collection('voices').doc(mref.id), { uid: user.uid, audio: r.result, createdAt: ts });
      msg.textContent = '⏳ جاري الإرسال...';
      b.commit().then(function() { msg.textContent = ''; if (typeof gtag === 'function') gtag('event', 'chat_voice', { dur: Math.round(dur) }); }).catch(function() { msg.textContent = 'ما انبعتت الرسالة الصوتية، جرّب مرة ثانية.'; });
    };
    r.readAsDataURL(blob);
  }
  function play(btn) {
    var id = btn.getAttribute('data-play');
    if (playing) { playing.a.pause(); var was = playing.id; playing.b.textContent = playing.label; playing = null; if (was === id) return; }
    var label = btn.textContent; btn.textContent = '⏳';
    db.collection('challenges').doc(chId).collection('voices').doc(id).get().then(function(d) {
      var src = d.exists ? String(d.data().audio || '') : '';
      var comma = src.indexOf(','), head = src.slice(0, comma);
      if (comma < 0 || !/^data:/i.test(head) || !/;base64$/i.test(head)) { btn.textContent = 'ما في صوت'; return; }
      var type = (head.slice(5).split(';')[0] || '').trim().toLowerCase();
      if (!/^audio\/|^video\//.test(type)) type = 'audio/mp4';
      var bin = atob(src.slice(comma + 1)), arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      var a = new Audio(URL.createObjectURL(new Blob([arr], { type: type })));
      playing = { a: a, b: btn, id: id, label: label };
      a.onended = function() { btn.textContent = label; playing = null; };
      btn.textContent = '⏸️ إيقاف';
      a.play().catch(function() { btn.textContent = '⚠️ ما اشتغل'; playing = null; });
    }).catch(function() { btn.textContent = label; });
  }
  function find(id) { return msgs.filter(function(m) { return m.id === id; })[0]; }
  function report(a) {
    var m = find(a.getAttribute('data-rep')); if (!m) return;
    a.textContent = '⏳';
    db.collection('chatReports').add({ challengeId: chId, msgId: m.id, text: String(m.d.text).slice(0, 300), offenderUid: m.d.uid, offenderName: String(m.d.name || '').slice(0, 40), reason: 'محتوى مسيء', reporterUid: user.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() })
      .then(function() { a.textContent = '✅ وصل البلاغ'; }).catch(function() { a.textContent = 'ما زبط'; });
  }
  function del(a) {
    var mid = a.getAttribute('data-del'), m = find(mid);
    (m && m.d.voice ? db.collection('challenges').doc(chId).collection('voices').doc(mid).delete().catch(function() {}) : Promise.resolve())
      .then(function() { return db.collection('challenges').doc(chId).collection('messages').doc(mid).delete(); }).catch(function() {});
  }
  function ban(a) {
    if (a.getAttribute('data-sure') !== '1') { a.setAttribute('data-sure', '1'); a.textContent = 'متأكد؟'; return; }
    db.collection('chatBans').doc(a.getAttribute('data-ban')).set({ name: a.getAttribute('data-name') || '', at: firebase.firestore.FieldValue.serverTimestamp() })
      .then(function() { a.textContent = '⛔ انحظر'; }).catch(function() { a.textContent = 'ما زبط'; });
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    chId = challengeId;
    var anchor = document.getElementById('leaderboardArea');
    var card = anchor && (anchor.closest('.card') || anchor.parentElement);
    box = document.createElement('div');
    box.className = 'card';
    box.style.marginTop = '16px';
    box.innerHTML = '⏳';
    if (card && card.parentNode) card.parentNode.insertBefore(box, card.nextSibling); else document.body.appendChild(box);
    box.addEventListener('click', function(e) {
      var pl0 = e.target.closest('[data-play]'); if (pl0) { play(pl0); return; }
      if (!user) return;
      var input = box.querySelector('.cc-input');
      var em = e.target.closest('[data-e]'); if (em && input) { input.value += em.getAttribute('data-e'); input.focus(); return; }
      var q = e.target.closest('[data-q]'); if (q) { send(q.getAttribute('data-q')); return; }
      var rp = e.target.closest('[data-rep]'); if (rp) { e.preventDefault(); report(rp); return; }
      var dl = e.target.closest('[data-del]'); if (dl) { e.preventDefault(); del(dl); return; }
      var bn = e.target.closest('[data-ban]'); if (bn) { e.preventDefault(); ban(bn); return; }
      var pl = e.target.closest('[data-play]'); if (pl) { play(pl); return; }
    });
    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;"><div style="font-weight:800;font-size:16px;">💬 شات التحدي</div>' +
      '<button type="button" class="cc-open" style="padding:9px 16px;border:none;border-radius:10px;background:var(--primary);color:#fff;font-weight:800;font-family:inherit;cursor:pointer;">💬 افتح الشات</button></div>' +
      '<div style="font-size:12px;color:var(--text-muted);margin-top:6px;">احكي مع أصحابك بالتحدي — أي حدا بيقدر يتفرّج، والكتابة للمسجّلين</div>';
    box.querySelector('.cc-open').addEventListener('click', openChat);
  }

  function openChat() {
    user = null; isAdmin = false;
    renderShell();
    authReady().then(function() {
      firebase.auth().onAuthStateChanged(function(u) {
        if (!u && !user) return;
        user = u;
        if (!u) { isAdmin = false; renderShell(); return; }
        if (signingIn && typeof gtag === 'function') gtag('event', 'login', { method: 'google_chat' });
        signingIn = false;
        db.collection('admins').doc(u.uid).get().then(function(d) { isAdmin = d.exists; }).catch(function() {}).then(renderShell);
      });
    }).catch(function() { var m = box.querySelector('.cc-msg'); if (m) m.textContent = 'ما قدرنا نحمّل الدخول — بتقدر تتفرّج على الرسائل بس.'; });
  }


  var tries = 0;
  var t = setInterval(function() {
    tries++;
    if (typeof challengeId !== 'undefined' && challengeId) { clearInterval(t); mount(); }
    else if (tries > 3600) clearInterval(t);
  }, 1000);
})();
