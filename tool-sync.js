(function () {
  var raw = window.__sync;
  if (!raw) return;
  var cfgs = (Array.isArray(raw) ? raw : [raw]).filter(function (c) { return c && c.key; });
  if (!cfgs.length) return;
  var seen = null, timers = {}, last = {};
  var CFG_KEY = 'adawati_cfg_v1', CFG_TTL = 1800000;
  var PRUNE = { adawati_split_v1: 'hist', adawati_payday_v1: 'h', adawati_hourly_wage_v1: 'h', adawati_savings_goal_v1: 'h', adawati_budget_split_v1: 'h', adawati_reading_goal_v1: 'h', adawati_pomo_v1: 'd', adawati_chal_hist_v1: '*' };

  function sc() {
    try { var r = JSON.parse(localStorage.getItem(CFG_KEY)); return (r && r.v && r.v.sync) || {}; } catch (e) { return {}; }
  }
  function allowed(c) { var s = sc(); return s.enabled !== false && (s.disabledKeys || []).indexOf(c.key) < 0; }
  function loadCfg(cb) {
    var fresh = false;
    try { var r = JSON.parse(localStorage.getItem(CFG_KEY)); fresh = !!(r && r.v && Date.now() - r.t < CFG_TTL); } catch (e) {}
    if (fresh) { cb(); return; }
    try {
      firebase.firestore().collection('config').doc('site').get().then(function (d) {
        try { localStorage.setItem(CFG_KEY, JSON.stringify({ v: d.exists ? d.data() : {}, t: Date.now() })); } catch (e) {}
        cb();
      }).catch(function () { cb(); });
    } catch (e) { cb(); }
  }
  function prune(key, v, days) {
    var p = PRUNE[key];
    if (!p || !(days > 0)) return v;
    var o; try { o = JSON.parse(v); } catch (e) { return v; }
    var cut = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10), re = /^\d{4}-\d\d-\d\d$/;
    function ok(x) { return !(x && typeof x.d === 'string' && re.test(x.d) && x.d < cut); }
    if (p === '*') { if (!Array.isArray(o)) return v; o = o.filter(ok); }
    else if (p === 'd') { if (o && o.d && typeof o.d === 'object') Object.keys(o.d).forEach(function (k) { if (re.test(k) && k < cut) delete o.d[k]; }); }
    else if (o && Array.isArray(o[p])) o[p] = o[p].filter(ok);
    return JSON.stringify(o);
  }

  function user() {
    try { return (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) || null; } catch (e) { return null; }
  }
  function ref(u) { return firebase.firestore().collection('users').doc(u.uid); }
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function reload(c) { if (typeof c.reload === 'function') { try { c.reload(); } catch (e) {} } }

  function pushNow(c) {
    var u = user(), v = ls(c.key);
    if (!u || v === null || !navigator.onLine || !allowed(c)) return;
    var s = sc(), pv = prune(c.key, v, s.retentionDays);
    if (pv !== v) { v = pv; lset(c.key, v); }
    if (v.length > (s.maxKeyKB > 0 ? s.maxKeyKB : 150) * 1024) return;
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
    loadCfg(function () {
      if (sc().enabled === false) return;
      ref(u).get().then(function (snap) {
        var td = (snap.exists && snap.data() && snap.data().toolData) || {};
        cfgs.forEach(function (c) { if (allowed(c)) pull1(c, td[c.key]); });
      }).catch(function () {});
    });
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
