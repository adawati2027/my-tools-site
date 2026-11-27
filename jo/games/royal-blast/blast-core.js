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
    var types = L < 10 ? 4 : 5;
    var rocks = L < 3 ? 0 : Math.min(12, 2 + Math.floor(L * 0.35));
    var hp2 = L < 12 ? 0 : Math.min(rocks, Math.floor((L - 12) / 5));
    var ncol = L < 14 ? 2 : 3;
    var need = Math.round(Math.min(24, 10 + L * 0.5));
    var moves = Math.max(20, 26 - Math.floor(L / 5));
    return { types: types, rocks: rocks, hp2: hp2, ncol: ncol, need: need, moves: moves };
  }

  function tile(k, row, from) {
    return { id: NID++, k: k, hp: 1, row: row, from: from };
  }

  function normal(t) { return t && t.k < 5; }

  function pickKind(g, col, c, r, types, rng) {
    var bad = {};
    if (c >= 2 && g[c - 1][r] && g[c - 2][r] && g[c - 1][r].k === g[c - 2][r].k) bad[g[c - 1][r].k] = 1;
    if (r >= 2 && col[r - 1] && col[r - 2] && col[r - 1].k === col[r - 2].k) bad[col[r - 1].k] = 1;
    var ok = [];
    for (var k = 0; k < types; k++) if (!bad[k]) ok.push(k);
    return ok[Math.floor(rng() * ok.length)];
  }

  function make(L, seed) {
    var rng = mulberry(L * 7919 + (seed || 0) * 131 + 17);
    var p = params(L);
    var g = [], c, r;
    for (c = 0; c < W; c++) {
      var col = [];
      for (r = 0; r < H; r++) col.push(tile(pickKind(g, col, c, r, p.types, rng), r, r - H));
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

  function goalAdd(st, k) {
    for (var i = 0; i < st.goals.length; i++) if (st.goals[i].k === k) st.goals[i].have++;
  }

  function checkWin(st) {
    for (var gi = 0; gi < st.goals.length; gi++) if (st.goals[gi].have < st.goals[gi].need) return;
    st.state = 'win';
  }

  function matches(st) {
    var inH = {}, inV = {}, c, r, e, x, t;
    for (r = 0; r < H; r++) {
      c = 0;
      while (c < W) {
        t = st.g[c][r];
        if (!normal(t)) { c++; continue; }
        e = c + 1;
        while (e < W && normal(st.g[e][r]) && st.g[e][r].k === t.k) e++;
        if (e - c >= 3) for (x = c; x < e; x++) inH[x * 10 + r] = e - c;
        c = e;
      }
    }
    for (c = 0; c < W; c++) {
      r = 0;
      while (r < H) {
        t = st.g[c][r];
        if (!normal(t)) { r++; continue; }
        e = r + 1;
        while (e < H && normal(st.g[c][e]) && st.g[c][e].k === t.k) e++;
        if (e - r >= 3) for (x = r; x < e; x++) inV[c * 10 + x] = e - r;
        r = e;
      }
    }
    var seen = {}, comps = [], d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (c = 0; c < W; c++) for (r = 0; r < H; r++) {
      var key = c * 10 + r;
      if (seen[key] || !(inH[key] || inV[key])) continue;
      var k = st.g[c][r].k, q = [[c, r]], cells = [], maxRun = 0, cross = null;
      seen[key] = 1;
      while (q.length) {
        var cur = q.pop(), ck = cur[0] * 10 + cur[1];
        cells.push(cur);
        maxRun = Math.max(maxRun, inH[ck] || 0, inV[ck] || 0);
        if (inH[ck] && inV[ck]) cross = cross || cur;
        for (var i = 0; i < 4; i++) {
          var nc = cur[0] + d[i][0], nr = cur[1] + d[i][1], nk = nc * 10 + nr;
          if (nc < 0 || nr < 0 || nc >= W || nr >= H || seen[nk] || !(inH[nk] || inV[nk]) || st.g[nc][nr].k !== k) continue;
          seen[nk] = 1; q.push([nc, nr]);
        }
      }
      var special = (cross || maxRun >= 5) ? BOMB : (maxRun === 4 ? ROCKET : 0);
      comps.push({ k: k, cells: cells, special: special, cross: cross });
    }
    return comps;
  }

  function resolve(st, comps, pref) {
    var ev = { removed: [], rocks: [], made: null, blasts: [], size: 0, at: null }, hit = {}, i, j;
    function rockHit(cc, rr) {
      var rt = st.g[cc][rr];
      if (!rt || rt.k !== ROCK || hit[rt.id]) return;
      hit[rt.id] = 1;
      rt.hp--;
      var dead = rt.hp <= 0;
      if (dead) { st.g[cc][rr] = null; goalAdd(st, ROCK); st.score += 30; }
      ev.rocks.push({ c: cc, r: rr, tile: rt, dead: dead });
    }
    var best = null;
    for (i = 0; i < comps.length; i++) if (comps[i].special && (!best || comps[i].cells.length > best.cells.length)) best = comps[i];
    var keep = null;
    if (best) {
      keep = best.cross;
      if (!keep && pref) for (i = 0; i < pref.length && !keep; i++) for (j = 0; j < best.cells.length; j++) if (best.cells[j][0] === pref[i][0] && best.cells[j][1] === pref[i][1]) { keep = best.cells[j]; break; }
      if (!keep) keep = best.cells[Math.floor(best.cells.length / 2)];
    }
    var cleared = [];
    comps.forEach(function (cp) {
      var n = cp.cells.length;
      st.score += n * n * 5;
      ev.size += n;
      cp.cells.forEach(function (cl) {
        var x = st.g[cl[0]][cl[1]];
        if (keep && cl[0] === keep[0] && cl[1] === keep[1]) {
          var sp = tile(best.special, cl[1], cl[1]);
          goalAdd(st, x.k);
          st.g[cl[0]][cl[1]] = sp;
          ev.made = { c: cl[0], r: cl[1], tile: sp, from: x };
          return;
        }
        st.g[cl[0]][cl[1]] = null;
        goalAdd(st, x.k);
        ev.removed.push({ c: cl[0], r: cl[1], tile: x, how: 'group' });
        cleared.push(cl);
      });
    });
    if (keep) cleared.push(keep);
    var d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    cleared.forEach(function (cl) {
      for (var m = 0; m < 4; m++) {
        var nc = cl[0] + d[m][0], nr = cl[1] + d[m][1];
        if (nc >= 0 && nr >= 0 && nc < W && nr < H) rockHit(nc, nr);
      }
    });
    ev.at = keep || comps[0].cells[Math.floor(comps[0].cells.length / 2)];
    return ev;
  }

  function applySwap(st, c1, r1, c2, r2) {
    if (st.state !== 'play') return null;
    if (Math.abs(c1 - c2) + Math.abs(r1 - r2) !== 1) return null;
    var a = st.g[c1][r1], b = st.g[c2][r2];
    if (!normal(a) || !normal(b) || a.k === b.k) return null;
    st.g[c1][r1] = b; st.g[c2][r2] = a;
    var comps = matches(st);
    if (!comps.length) { st.g[c1][r1] = a; st.g[c2][r2] = b; return null; }
    var ev = resolve(st, comps, [[c2, r2], [c1, r1]]);
    st.moves--;
    checkWin(st);
    return ev;
  }

  function cascade(st) {
    if (st.state !== 'play') return null;
    var comps = matches(st);
    if (!comps.length) return null;
    var ev = resolve(st, comps, null);
    checkWin(st);
    return ev;
  }

  function applyTap(st, c, r) {
    if (st.state !== 'play') return null;
    var t = st.g[c][r];
    if (!t || t.k < 6) return null;
    var ev = { removed: [], rocks: [], made: null, blasts: [], size: 1, at: [c, r] };
    var hit = {}, queue = [], done = {};

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

    done[t.id] = 1;
    queue.push([c, r, t]);
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
    checkWin(st);
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

  function swapValue(st, c1, r1, c2, r2) {
    var a = st.g[c1][r1], b = st.g[c2][r2];
    if (!normal(a) || !normal(b) || a.k === b.k) return 0;
    st.g[c1][r1] = b; st.g[c2][r2] = a;
    var comps = matches(st), v = 0;
    st.g[c1][r1] = a; st.g[c2][r2] = b;
    if (!comps.length) return 0;
    var d = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    comps.forEach(function (cp) {
      v += cp.cells.length;
      for (var gi = 0; gi < st.goals.length; gi++) { var go = st.goals[gi]; if (go.k === cp.k && go.have < go.need) v += 3 * cp.cells.length; }
      if (cp.special) v += 6;
      cp.cells.forEach(function (cl) {
        for (var j = 0; j < 4; j++) {
          var nc = cl[0] + d[j][0], nr = cl[1] + d[j][1];
          if (nc >= 0 && nr >= 0 && nc < W && nr < H && st.g[nc][nr] && st.g[nc][nr].k === ROCK) v += 4;
        }
      });
    });
    return v;
  }

  function findSwap(st, eps) {
    var best = null, bs = 0;
    for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
      var opts = [[c + 1, r], [c, r + 1]];
      for (var i = 0; i < 2; i++) {
        var nc = opts[i][0], nr = opts[i][1];
        if (nc >= W || nr >= H) continue;
        var v = swapValue(st, c, r, nc, nr);
        if (!v) continue;
        v += (eps ? st.rng() * eps * 10 : 0);
        if (v > bs) { bs = v; best = [c, r, nc, nr]; }
      }
    }
    return best;
  }

  function hasMove(st) {
    for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
      var t = st.g[c][r];
      if (t && t.k > 5) return true;
    }
    return !!findSwap(st, 0);
  }

  function ensureMove(st) {
    var shuffled = false, n = 0;
    if (matches(st).length) return false;
    while (!hasMove(st) && n++ < 60) {
      shuffled = true;
      for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
        var t = st.g[c][r];
        if (normal(t)) t.k = pickKind(st.g, st.g[c], c, r, st.types, st.rng);
      }
    }
    return shuffled;
  }

  function bot(st, eps) {
    var sw = findSwap(st, eps);
    if (sw) return sw;
    for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
      var t = st.g[c][r];
      if (t && t.k > 5) return [c, r];
    }
    return null;
  }

  var api = { W: W, H: H, ROCK: ROCK, BOMB: BOMB, ROCKET: ROCKET, make: make, params: params, applyTap: applyTap, applySwap: applySwap, cascade: cascade, settle: settle, ensureMove: ensureMove, findSwap: findSwap, hasMove: hasMove, bot: bot };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BlastCore = api;
})(this);
