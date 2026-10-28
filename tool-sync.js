(function () {
  var cfg = window.__sync;
  if (!cfg || !cfg.key) return;
  var key = cfg.key, tkey = key + '_t', bkey = key + '_bak', timer = null, seen = null;

  function user() {
    try { return (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) || null; } catch (e) { return null; }
  }
  function ref(u) { return firebase.firestore().collection('users').doc(u.uid); }
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function doPush() {
    var u = user(), v = ls(key);
    if (!u || v === null || !navigator.onLine) return;
    var t = Date.now(), d = {};
    lset(tkey, String(t));
    d[key] = { v: v, t: t };
    ref(u).set({ toolData: d, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(function () {});
  }

  window.__syncPush = function () {
    lset(tkey, String(Date.now()));
    clearTimeout(timer);
    timer = setTimeout(doPush, 800);
  };

  function pull(u) {
    ref(u).get().then(function (snap) {
      var data = snap.exists ? (snap.data() || {}) : {};
      var rem = data.toolData && data.toolData[key];
      var lv = ls(key), lt = parseInt(ls(tkey), 10) || 0;
      if (rem && typeof rem.v === 'string' && rem.t > lt) {
        try { JSON.parse(rem.v); } catch (e) { return; }
        if (lv !== null && lv !== rem.v) lset(bkey, lv);
        lset(key, rem.v); lset(tkey, String(rem.t));
        if (typeof cfg.reload === 'function') cfg.reload();
      } else if (lv !== null && (!rem || lt > rem.t)) {
        doPush();
      }
    }).catch(function () {});
  }

  setInterval(function () {
    var u = user(), id = u ? u.uid : null;
    if (id === seen) return;
    seen = id;
    if (u) pull(u);
  }, 3000);
})();
