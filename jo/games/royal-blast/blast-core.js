(function (root) {
  var W = 7, H = 8, ROCK = 5, BOMB = 6, ROCKET = 7, NID = 1;

  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function params(L) {
    var types = L < 10 ? 3 : (L < 25 ? 4 : 5);
    var rocks = L < 3 ? 0 : Math.min(12, 2 + Math.floor(L * 0.35));
    var hp2 = L < 12 ? 0 : Math.min(rocks, Math.floor((L - 12) / 5));
    var ncol = L < 14 ? 2 : 3;
    var need = Math.round(Math.min(20, 8 + L * 0.45));
    var moves = Math.max(21, 27 - Math.floor(L / 5));
    return { types: types, rocks: rocks, hp2: hp2, ncol: ncol, need: need, moves: moves };
  }

  function tile(k, row, from) {
    return { id: NID++, k: k, hp: 1, row: row, from: from };
  }

  function make(L, seed) {
    var rng = mulberry(L * 7919 + (seed || 0) * 131 + 17);
    var p = params(L);
    var g = [], c, r;
    for (c = 0; c < W; c++) {
      var col = [];
      for (r = 0; r < H; r++) col.push(tile(Math.floor(rng() * p.types), r, r - H));
      g.push(col);
    }
    var cells = [];
    for (c = 0; c < W; c++) for (r = 1; r < H; r++) cells.push([c, r]);
    for (var i = cells.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1)), t = cells[i]; cells[i] = cells[j]; cells[j] = t;
    }
    for (i = 0; i < p.rocks; i++) {
      var tt = g[cells[i][0]][cells[i][1]];
      tt.k = ROCK; tt.hp = i < p.hp2 ? 2 : 1; tt.max = tt.hp;
    }
    var ks = [];
    for (i = 0; i < p.types; i++) ks.push(i);
    for (i = ks.length - 1; i > 0; i--) {
      j = Math.floor(rng() * (i + 1)); t = ks[i]; ks[i] = ks[j]; ks[j] = t;
    }
    var goals = [];
    for (i = 0; i < p.ncol; i++) goals.push({ k: ks[i], need: p.need - (i ? 3 * i : 0), have: 0 });
    if (p.rocks) goals.push({ k: ROCK, need: p.rocks, have: 0 });
    var st = { L: L, g: g, goals: goals, moves: p.moves, types: p.types, score: 0, rng: rng, state: 'play' };
    ensureMove(st);
    return st;
  }

  function group(st, c, r) {
    var t = st.g[c][r];
    if (!t || t.k > 4) return [];
    var seen = {}, out = [], q = [[c, r]];
    seen[c * 10 + r] = 1;
    while (q.length) {
      var cur = q.pop();
      out.push(cur);
      var d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (var i = 0; i < 4; i++) {
        var nc = cur[0] + d[i][0], nr = cur[1] + d[i][1];
        if (nc < 0 || nr < 0 || nc >= W || nr >= H || seen[nc * 10 + nr]) continue;
        var n = st.g[nc][nr];
        if (n && n.k === t.k) { seen[nc * 10 + nr] = 1; q.push([nc, nr]); }
      }
    }
    return out;
  }

  function goalAdd(st, k) {
    for (var i = 0; i < st.goals.length; i++) if (st.goals[i].k === k) st.goals[i].have++;
  }

  function applyTap(st, c, r) {
    if (st.state !== 'play') return null;
    var t = st.g[c][r];
    if (!t || t.k === ROCK) return null;
    var ev = { removed: [], rocks: [], made: null, blasts: [] };
    var hit = {};
    var queue = [], done = {};

    function rockHit(cc, rr) {
      var rt = st.g[cc][rr];
      if (!rt || rt.k !== ROCK || hit[rt.id]) return;
      hit[rt.id] = 1;
      rt.hp--;
      var dead = rt.hp <= 0;
      if (dead) { st.g[cc][rr] = null; goalAdd(st, ROCK); st.score += 30; }
      ev.rocks.push({ c: cc, r: rr, tile: rt, dead: dead });
    }
    function remove(cc, rr, how) {
      var x = st.g[cc][rr];
      if (!x) return;
      if (x.k === ROCK) { rockHit(cc, rr); return; }
      if (x.k === BOMB || x.k === ROCKET) {
        if (!done[x.id]) { done[x.id] = 1; queue.push([cc, rr, x]); }
        return;
      }
      st.g[cc][rr] = null;
      goalAdd(st, x.k);
      ev.removed.push({ c: cc, r: rr, tile: x, how: how });
    }
    function neighbors(cc, rr) {
      var d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (var i = 0; i < 4; i++) {
        var nc = cc + d[i][0], nr = rr + d[i][1];
        if (nc >= 0 && nr >= 0 && nc < W && nr < H) rockHit(nc, nr);
      }
    }

    if (t.k < 5) {
      var grp = group(st, c, r);
      if (grp.length < 2) return null;
      var n = grp.length;
      st.score += n * n * 5;
      var special = n >= 7 ? ROCKET : (n >= 5 ? BOMB : 0);
      for (var i = 0; i < grp.length; i++) {
        if (special && grp[i][0] === c && grp[i][1] === r) continue;
        remove(grp[i][0], grp[i][1], 'group');
      }
      if (special) {
        goalAdd(st, t.k);
        var s = tile(special, r, r);
        st.g[c][r] = s;
        ev.made = { c: c, r: r, tile: s, from: t };
      }
      for (i = 0; i < grp.length; i++) neighbors(grp[i][0], grp[i][1]);
      ev.size = n;
    } else {
      done[t.id] = 1;
      queue.push([c, r, t]);
      ev.size = 1;
    }

    while (queue.length) {
      var q = queue.shift(), qc = q[0], qr = q[1], qt = q[2];
      if (st.g[qc][qr] === qt) st.g[qc][qr] = null;
      ev.blasts.push({ c: qc, r: qr, k: qt.k });
      st.score += 40;
      if (qt.k === BOMB) {
        for (var dc = -1; dc <= 1; dc++) for (var dr = -1; dr <= 1; dr++) {
          var nc = qc + dc, nr = qr + dr;
          if (nc >= 0 && nr >= 0 && nc < W && nr < H) remove(nc, nr, 'bomb');
        }
      } else {
        for (var cc = 0; cc < W; cc++) remove(cc, qr, 'rocket');
      }
    }

    st.moves--;
    var win = true;
    for (var gi = 0; gi < st.goals.length; gi++) if (st.goals[gi].have < st.goals[gi].need) win = false;
    st.state = win ? 'win' : (st.moves <= 0 ? 'lose' : 'play');
    return ev;
  }

  function settle(st) {
    var rng = st.rng;
    for (var c = 0; c < W; c++) {
      var keep = [];
      for (var r = H - 1; r >= 0; r--) if (st.g[c][r]) keep.push(st.g[c][r]);
      var miss = H - keep.length, col = new Array(H), i;
      for (i = 0; i < keep.length; i++) { keep[i].row = H - 1 - i; col[H - 1 - i] = keep[i]; }
      for (i = 0; i < miss; i++) col[i] = tile(Math.floor(rng() * st.types), i, i - miss);
      st.g[c] = col;
    }
    return ensureMove(st);
  }

  function hasMove(st) {
    for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
      var t = st.g[c][r];
      if (!t) continue;
      if (t.k === BOMB || t.k === ROCKET) return true;
      if (t.k < 5 && group(st, c, r).length >= 2) return true;
    }
    return false;
  }

  function ensureMove(st) {
    var shuffled = false, n = 0;
    while (!hasMove(st) && n++ < 50) {
      shuffled = true;
      for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
        var t = st.g[c][r];
        if (t && t.k < 5) t.k = Math.floor(st.rng() * st.types);
      }
    }
    return shuffled;
  }

  function bot(st, eps) {
    var best = null, bs = -1, seen = {};
    for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
      var t = st.g[c][r];
      if (!t || t.k === ROCK || seen[c * 10 + r]) continue;
      var s = 0;
      if (t.k > 4) s = 6;
      else {
        var grp = group(st, c, r);
        if (grp.length < 2) continue;
        for (var i = 0; i < grp.length; i++) {
          seen[grp[i][0] * 10 + grp[i][1]] = 1;
          for (var gi = 0; gi < st.goals.length; gi++) {
            var go = st.goals[gi];
            if (go.k === t.k && go.have < go.need) s += 3;
          }
          var d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          for (var j = 0; j < 4; j++) {
            var nc = grp[i][0] + d[j][0], nr = grp[i][1] + d[j][1];
            if (nc >= 0 && nr >= 0 && nc < W && nr < H && st.g[nc][nr] && st.g[nc][nr].k === ROCK) s += 4;
          }
        }
        s += grp.length >= 5 ? 5 : 0;
      }
      s += st.rng() * (eps || 0) * 10;
      if (s > bs) { bs = s; best = [c, r]; }
    }
    return best;
  }

  var api = { W: W, H: H, ROCK: ROCK, BOMB: BOMB, ROCKET: ROCKET, make: make, params: params, group: group, applyTap: applyTap, settle: settle, hasMove: hasMove, bot: bot };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BlastCore = api;
})(this);
