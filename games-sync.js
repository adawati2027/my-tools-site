(function () {
  var p = location.pathname;
  var G = {
    'car-game': { lb: 'adawati_car_lb', cmp: function (a, b) { return b.score - a.score; }, best: 'adawati_car_best' },
    'jump-game': { lb: 'adawati_jump_lb', cmp: function (a, b) { return b.score - a.score; }, best: 'adawati_jump_best' },
    'memory-game': { lb: 'adawati_memory_lb', cmp: function (a, b) { return b.level - a.level || a.score - b.score; } },
    'number-guess': { lb: 'adawati_guess_lb', cmp: function (a, b) { return b.level - a.level || a.score - b.score; } },
    'quick-math': { lb: 'adawati_qmath_lb', cmp: function (a, b) { return b.level - a.level || b.correct - a.correct; } },
    'reaction-test': { lb: 'adawati_react_lb', cmp: function (a, b) { return b.level - a.level || a.avg - b.avg; } }
  };
  var g = null;
  Object.keys(G).forEach(function (k) { if (p.indexOf(k) >= 0) g = G[k]; });
  if (!g) return;
  function arr(s) { try { var a = JSON.parse(s); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  var cfg = [{
    key: g.lb, poll: true,
    merge: function (l, r) {
      var seen = {}, all = arr(l).concat(arr(r)).filter(function (x) {
        var k = JSON.stringify(x); if (seen[k]) return false; seen[k] = 1; return true;
      });
      all.sort(g.cmp);
      return JSON.stringify(all.slice(0, 3));
    }
  }];
  if (g.best) cfg.push({
    key: g.best, poll: true,
    merge: function (l, r) { return String(Math.max(parseInt(l, 10) || 0, parseInt(r, 10) || 0)); }
  });
  window.__sync = cfg;
  var s = document.createElement('script');
  s.src = '/tool-sync.js?v=3';
  document.head.appendChild(s);
})();
