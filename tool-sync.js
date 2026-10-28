(function () {
  var raw = window.__sync;
  if (!raw) return;
  var cfgs = (Array.isArray(raw) ? raw : [raw]).filter(function (c) { return c && c.key; });
  if (!cfgs.length) return;
  var seen = null, timers = {}, last = {};

  function user() {
    try { return (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) || null; } catch (e) { return null; }
  }
  function ref(u) { return firebase.firestore().collection('users').doc(u.uid); }
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function reload(c) { if (typeof c.reload === 'function') { try { c.reload(); } catch (e) {} } }

  function pushNow(c) {
    var u = user(), v = ls(c.key);
    if (!u || v === null || !navigator.onLine) return;
    var t = Date.now(), d = {};
    lset(c.key + '_t', String(t));
    d[c.key] = { v: v, t: t };
    last[c.key] = v;
    ref(u).set({ toolData: d, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(function () {});
  }
  function schedule(c) {
    lset(c.key + '_t', String(Date.now()));
    clearTimeout(timers[c.key]);
    timers[c.key] = setTimeout(function () { pushNow(c); }, 800);
  }

  window.__syncPush = function () { schedule(cfgs[0]); };

  function pull1(c, rem) {
    var key = c.key, tkey = key + '_t', bkey = key + '_bak', lv = ls(key), lt = parseInt(ls(tkey), 10) || 0;
    if (rem && typeof rem.v === 'string') {
      if (c.merge) {
        var m;
        try { m = c.merge(lv, rem.v); } catch (e) { return; }
        if (typeof m !== 'string') return;
        if (m !== lv) { if (lv !== null) lset(bkey, lv); lset(key, m); last[key] = m; reload(c); }
        if (m !== rem.v) pushNow(c); else lset(tkey, String(rem.t));
        return;
      }
      if (rem.t > lt) {
        try { JSON.parse(rem.v); } catch (e) { return; }
        if (lv !== null && lv !== rem.v) lset(bkey, lv);
        lset(key, rem.v); lset(tkey, String(rem.t)); last[key] = rem.v;
        reload(c);
        return;
      }
    }
    if (lv !== null && (!rem || lt > rem.t)) pushNow(c);
  }

  function pull(u) {
    ref(u).get().then(function (snap) {
      var td = (snap.exists && snap.data() && snap.data().toolData) || {};
      cfgs.forEach(function (c) { pull1(c, td[c.key]); });
    }).catch(function () {});
  }

  cfgs.forEach(function (c) { if (c.poll) last[c.key] = ls(c.key); });
  setInterval(function () {
    cfgs.forEach(function (c) {
      if (!c.poll) return;
      var cur = ls(c.key);
      if (cur !== last[c.key]) { last[c.key] = cur; if (cur !== null) schedule(c); }
    });
  }, 2000);

  setInterval(function () {
    var u = user(), id = u ? u.uid : null;
    if (id === seen) return;
    seen = id;
    if (u) pull(u);
  }, 3000);
})();
