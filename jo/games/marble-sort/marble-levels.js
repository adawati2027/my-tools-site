(function(){
'use strict';
var TILE_CAP = 9, UNIT_MULT = 3, GEN_POOL_MAX = 26, HINT_POOL_MAX = 38;

function rng(seed){
  var a = seed >>> 0;
  return function(){
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, r){
  for (var i = arr.length - 1; i > 0; i--){
    var j = Math.floor(r() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

function params(L){
  return {
    colors: Math.min(6, 2 + Math.floor((L - 1) / 2)),
    pipes: L <= 2 ? 2 : (L <= 6 ? 3 : 4),
    cols: L <= 2 ? 3 : 4,
    tpc: L <= 2 ? 2 : (L <= 4 ? 3 : (L <= 11 ? 4 : (L <= 24 ? 5 : 6)))
  };
}

function build(L, seed){
  var p = params(L), r = rng(L * 7919 + seed * 104729 + 13);
  var total = p.cols * p.tpc, tiles = [], i, c;
  for (i = 0; i < total; i++) tiles.push(i % p.colors);
  shuffle(tiles, r);
  var cols = [];
  for (i = 0; i < p.cols; i++) cols.push(tiles.slice(i * p.tpc, (i + 1) * p.tpc));
  var per = {};
  tiles.forEach(function(t){ per[t] = (per[t] || 0) + 1; });
  var blocks = [];
  Object.keys(per).forEach(function(k){
    var n = per[k];
    while (n > 0){
      var take = (n >= 2 && r() < (L >= 5 ? 0.55 : 0.4)) ? 2 : 1;
      blocks.push({ color: +k, units: take * TILE_CAP / UNIT_MULT });
      n -= take;
    }
  });
  var nPipes = Math.min(p.pipes, blocks.length);
  shuffle(blocks, r);
  var pipes = [];
  for (i = 0; i < nPipes; i++) pipes.push([]);
  blocks.forEach(function(b, idx){ pipes[idx % nPipes].push(b); });
  return { cols: cols, pipes: pipes, colorCount: p.colors };
}

function settle(cols, pool){
  var changed = true;
  while (changed){
    changed = false;
    for (var k = 0; k < cols.length; k++){
      var col = cols[k];
      if (!col.length) continue;
      var t = col[0], take = Math.min(t.need, pool[t.color]);
      if (take > 0){
        pool[t.color] -= take; t.need -= take; changed = true;
        if (t.need === 0){ col.shift(); }
      }
    }
  }
}

function solve(state, wantFirst, budget, poolMax){
  poolMax = poolMax || GEN_POOL_MAX;
  var seen = {}, nodes = 0;
  function key(s){
    return s.qi.join(',') + '|' + s.pool.join(',') + '|' + s.cols.map(function(c){
      return c.map(function(t){ return t.color + ':' + t.need; }).join('/');
    }).join(';');
  }
  function clone(s){
    return { qi: s.qi.slice(), pool: s.pool.slice(), pipes: s.pipes,
      cols: s.cols.map(function(c){ return c.map(function(t){ return { color: t.color, need: t.need }; }); }) };
  }
  function done(s){ return s.cols.every(function(c){ return c.length === 0; }); }
  function dfs(s){
    if (done(s)) return true;
    var k = key(s);
    if (k in seen) return seen[k];
    if (++nodes > budget) return false;
    seen[k] = false;
    for (var p = 0; p < s.pipes.length; p++){
      if (s.qi[p] >= s.pipes[p].length) continue;
      var n = clone(s), b = n.pipes[p][n.qi[p]];
      n.qi[p]++;
      n.pool[b.color] += b.units * UNIT_MULT;
      settle(n.cols, n.pool);
      var left = n.pool.reduce(function(a, v){ return a + v; }, 0);
      if (left > poolMax) continue;
      if (dfs(n)){ seen[k] = true; return true; }
    }
    return false;
  }
  if (!wantFirst) return dfs(state);
  var good = [];
  for (var p = 0; p < state.pipes.length; p++){
    if (state.qi[p] >= state.pipes[p].length) continue;
    var n = clone(state), b = n.pipes[p][n.qi[p]];
    n.qi[p]++;
    n.pool[b.color] += b.units * UNIT_MULT;
    settle(n.cols, n.pool);
    var left = n.pool.reduce(function(a, v){ return a + v; }, 0);
    if (left <= poolMax && dfs(n)) good.push(p);
  }
  return good;
}

function toState(def){
  return {
    qi: def.pipes.map(function(){ return 0; }),
    pool: new Array(def.colorCount).fill(0),
    pipes: def.pipes,
    cols: def.cols.map(function(c){ return c.map(function(t){ return { color: t, need: TILE_CAP }; }); })
  };
}

function makeLevel(L){
  var best = null;
  for (var seed = 0; seed < 60; seed++){
    var def = build(L, seed);
    var st = toState(def), good = solve(st, true, 60000);
    if (!good.length) continue;
    best = def;
    var tricky = good.length < st.pipes.length;
    if (L <= 2 || tricky) break;
  }
  return best || build(1, 0);
}

window.MarbleLevels = { make: makeLevel, solve: solve, HINT_POOL_MAX: HINT_POOL_MAX, TILE_CAP: TILE_CAP, UNIT_MULT: UNIT_MULT };
})();
