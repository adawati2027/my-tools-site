(function(){
'use strict';
var CAP = 4;
var COLORS = ['#ff3b5c', '#ff9f0a', '#ffd60a', '#8fe000', '#00c853', '#00cfc1', '#2db7ff', '#3d5afe', '#a855ff', '#ff4fd8', '#8d5a3b', '#8e9bb0'];
var KEY = 'adawati_water_level', MUTE = 'adawati_water_mute';

function el(id){ return document.getElementById(id); }
function ls(k, v){ try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
function mix(hex, t, to){
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, m = to === 'w' ? 255 : 0;
  r = Math.round(r + (m - r) * t); g = Math.round(g + (m - g) * t); b = Math.round(b + (m - b) * t);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
function rng(seed){
  var a = seed >>> 0;
  return function(){
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function params(L){
  if (L > 50) return { colors: 12, empty: 1, hidden: true, deep: 160, noAdd: true };
  if (L > 25){
    var hid = (L - 26) % 3 === 1;
    return { colors: [12, 9, 11, 10][(L - 26) % 4], empty: (L <= 30 || hid) ? 2 : 1, hidden: hid, deep: 70 };
  }
  return { colors: Math.min(12, 3 + Math.floor((L - 1) / 2)), empty: 2, hidden: false, deep: 70 };
}
var TAUNTS = ['أصعب من دقات قلبك 💓', 'ألوان كثيرة وصبر أكثر 😅', 'هل تقدر؟ جرّب 😎', 'اسكب بحكمة 🧪', 'فكّر قبل أن تسكب 🧠'];
function tauntFor(L){
  if (L > 50) return 'مستوى الأساطير! لا مجال للخطأ 🔥';
  if (params(L).hidden) return 'ألوان مخفية! ركّز وتذكّر 🕵️';
  return TAUNTS[L % TAUNTS.length];
}

function key(tubes){ return tubes.map(function(t){ return t.join(''); }).sort().join('|'); }
function topRun(t){
  var c = t[t.length - 1], n = 0, i = t.length - 1;
  while (i >= 0 && t[i] === c){ n++; i--; }
  return n;
}
function isSolved(tubes){
  return tubes.every(function(t){ return !t.length || (t.length === CAP && topRun(t) === CAP); });
}
function moves(tubes){
  var out = [], i, j;
  for (i = 0; i < tubes.length; i++){
    var s = tubes[i]; if (!s.length) continue;
    var run = topRun(s), mono = run === s.length;
    for (j = 0; j < tubes.length; j++){
      if (i === j) continue;
      var d = tubes[j], free = CAP - d.length; if (free <= 0) continue;
      if (d.length && d[d.length - 1] !== s[s.length - 1]) continue;
      if (!d.length && mono) continue;
      var n = Math.min(run, free);
      out.push({ i: i, j: j, n: n, score: (d.length ? 2 : 0) + (n === run ? 1 : 0) + (mono ? 2 : 0) });
    }
  }
  out.sort(function(a, b){ return b.score - a.score; });
  return out;
}
function apply(tubes, m){
  var n = tubes.map(function(t){ return t.slice(); });
  for (var k = 0; k < m.n; k++) n[m.j].push(n[m.i].pop());
  return n;
}
function solvable(start, budget){
  var seen = {}, nodes = 0;
  function dfs(t){
    if (isSolved(t)) return true;
    var k = key(t);
    if (seen[k]) return false;
    seen[k] = 1;
    if (++nodes > budget) return false;
    var ms = moves(t);
    for (var x = 0; x < ms.length; x++) if (dfs(apply(t, ms[x]))) return true;
    return false;
  }
  return dfs(start);
}

function scramble(p, r){
  var t = [], i, c, steps = 0, guard = 0;
  for (c = 0; c < p.colors; c++){ var x = []; for (i = 0; i < CAP; i++) x.push(c); t.push(x); }
  for (i = 0; i < p.empty; i++) t.push([]);
  var n = t.length, want = p.colors * (p.deep || 70);
  while ((steps < want || t.some(function(q){ return q.length === CAP && topRun(q) === CAP; })) && guard++ < 20000){
    var d = Math.floor(r() * n), s = Math.floor(r() * n);
    if (d === s || !t[d].length) continue;
    var free = CAP - t[s].length; if (free <= 0) continue;
    var col = t[d][t[d].length - 1], k = 1 + Math.floor(r() * Math.min(topRun(t[d]), free));
    var sLen = t[s].length, dLen = t[d].length - k;
    var dTop = dLen ? t[d][dLen - 1] : -1;
    if (dLen && dTop !== col) continue;
    var sRun = (t[s].length && t[s][t[s].length - 1] === col) ? topRun(t[s]) + k : k;
    if (Math.min(sRun, CAP - dLen) !== k) continue;
    for (i = 0; i < k; i++) t[s].push(t[d].pop());
    steps++;
  }
  return t;
}

var cache = {};
function makeLevel(L){
  if (cache[L]) return cache[L];
  var p = params(L), seed = 0, tubes;
  if (p.empty < 2){
    tubes = scramble(p, rng(L * 7919 + 17));
    return (cache[L] = tubes);
  }
  for (seed = 0; seed < 200; seed++){
    var r = rng(L * 7919 + seed * 104729 + 5), pool = [], i, c;
    for (c = 0; c < p.colors; c++) for (i = 0; i < CAP; i++) pool.push(c);
    for (i = pool.length - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    tubes = [];
    for (i = 0; i < p.colors; i++) tubes.push(pool.slice(i * CAP, (i + 1) * CAP));
    for (i = 0; i < p.empty; i++) tubes.push([]);
    if (tubes.some(function(t){ return t.length === CAP && topRun(t) === CAP; }) && L > 2) continue;
    if (solvable(tubes, 120000)) break;
  }
  return (cache[L] = tubes);
}

var level = Math.max(1, parseInt(ls(KEY), 10) || 1), muted = ls(MUTE) === '1';
var collOrder = [], tubes, hist, sel = -1, busy = false, moveCount = 0, extraUsed = false, ac = null;
var coll = el('wsColl'), collFill = el('wsCollFill'), board = el('wsBoard'), stage = el('wsStage'), els = [];

function tone(f, d, type, vol, when){
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    var o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + (when || 0);
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(vol || 0.12, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + d + 0.02);
  } catch (e) {}
}
function sndPour(){ tone(420, 0.18, 'sine', 0.1); tone(520, 0.18, 'sine', 0.08, 0.08); }
function sndPick(){ tone(660, 0.08, 'triangle', 0.08); }
function sndBad(){ tone(180, 0.15, 'square', 0.05); }
function sndWin(){ [523, 659, 784, 1047].forEach(function(f, i){ tone(f, 0.25, 'triangle', 0.12, i * 0.12); }); }

function sizeBoard(){
  var n = tubes.length, area = board.parentNode;
  var availW = Math.min(area.clientWidth || 360, 560) - 28 - (level > 25 ? 70 : 0), availH = (area.clientHeight || 560) - 30;
  var best = null, rows, gapX = 12, gapY = 30;
  for (rows = 1; rows <= 4; rows++){
    var per = Math.ceil(n / rows);
    var twW = (availW - gapX * (per - 1)) / per;
    var twH = ((availH - gapY * (rows - 1)) / rows - 28) / 4.1;
    var tw = Math.min(twW, twH, 84);
    if (!best || tw > best.tw + 0.5) best = { tw: tw, per: per };
  }
  board.style.setProperty('--tw', Math.max(26, Math.floor(best.tw)) + 'px');
  board.style.setProperty('--per', best.per);
}

function segStyle(s, c){
  var base = COLORS[c];
  s.style.setProperty('--c', base);
  s.style.setProperty('--cl', mix(base, 0.45, 'w'));
  s.style.setProperty('--cd', mix(base, 0.25, 'k'));
}
function segEl(c){
  var s = document.createElement('div');
  s.className = 'seg';
  segStyle(s, c);
  return s;
}

function renderColl(P){
  var on = level > 25;
  coll.hidden = !on;
  if (!on) return;
  var capped = [];
  tubes.forEach(function(t){ if (t.length === CAP && topRun(t) === CAP) capped.push(t[0]); });
  var prev = collOrder.length;
  collOrder = collOrder.filter(function(c){ return capped.indexOf(c) >= 0; });
  if (collOrder.length !== prev) collFill.textContent = '';
  capped.forEach(function(c){ if (collOrder.indexOf(c) < 0) collOrder.push(c); });
  var h = 100 / P.colors;
  while (collFill.children.length < collOrder.length){
    var d = document.createElement('div');
    d.className = 'cl'; segStyle(d, collOrder[collFill.children.length]); d.style.height = '0%';
    collFill.appendChild(d);
    (function(x){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ x.style.height = h + '%'; }); }); })(d);
  }
  for (var i = 0; i < collFill.children.length; i++){ segStyle(collFill.children[i], collOrder[i]); collFill.children[i].style.height = h + '%'; }
  el('wsCollCnt').textContent = collOrder.length + '/' + P.colors;
}

function build(){
  board.textContent = '';
  els = [];
  sizeBoard();
  tubes.forEach(function(t, i){
    var w = document.createElement('div'); w.className = 'tube'; w.setAttribute('role', 'button'); w.setAttribute('aria-label', 'أنبوب ' + (i + 1));
    var g = document.createElement('div'); g.className = 'glass';
    var nk = document.createElement('div'); nk.className = 'neck';
    var cp = document.createElement('div'); cp.className = 'cap';
    var l = document.createElement('div'); l.className = 'liq';
    var sh = document.createElement('div'); sh.className = 'shine';
    g.appendChild(l); g.appendChild(sh); w.appendChild(g); w.appendChild(nk); w.appendChild(cp);
    w.addEventListener('click', function(){ onTube(i); });
    board.appendChild(w);
    els.push({ w: w, liq: l, cap: cp });
    t.forEach(function(c){ l.appendChild(segEl(c)); });
  });
  refresh();
}

function refresh(){
  tubes.forEach(function(t, i){
    var full = t.length === CAP && topRun(t) === CAP;
    if (full) segStyle(els[i].cap, t[0]);
    els[i].w.classList.toggle('done', full);
    els[i].w.classList.toggle('sel', i === sel);
  });
  var P = params(level);
  tubes.forEach(function(t, i){
    var kids = els[i].liq.children, vis = t.length - topRun(t);
    for (var k = 0; k < kids.length; k++) kids[k].classList.toggle('hid', P.hidden && k < vis && t.length === kids.length);
  });
  renderColl(P);
  el('wsLevel').textContent = 'المستوى ' + level;
  el('wsMoves').textContent = 'الحركات: ' + moveCount;
  el('wsUndo').disabled = !hist.length || busy;
  el('wsAdd').disabled = extraUsed || busy || !!P.noAdd;
}

function start(L, same){
  level = L; ls(KEY, String(L)); collOrder = []; collFill.textContent = '';
  var tz = el('wsTaunt'); tz.textContent = tauntFor(L); tz.hidden = L <= 25;
  tubes = makeLevel(L).map(function(t){ return t.slice(); });
  hist = []; sel = -1; busy = false; moveCount = 0; extraUsed = false;
  el('wsOverlay').hidden = true;
  build();
  if (!same && window.gtag) gtag('event', 'water_level_start', { level: L });
}

function isCapped(i){ var t = tubes[i]; return t.length === CAP && topRun(t) === CAP; }
function onTube(i){
  if (busy) return;
  if (sel < 0){
    if (!tubes[i].length || isCapped(i)) return;
    sel = i; sndPick(); refresh(); return;
  }
  if (sel === i){ sel = -1; refresh(); return; }
  var s = tubes[sel], d = tubes[i];
  var ok = s.length && d.length < CAP && (!d.length || d[d.length - 1] === s[s.length - 1]);
  if (!ok){
    if (tubes[i].length && !isCapped(i)){ sel = i; sndPick(); } else { sndBad(); sel = -1; }
    refresh(); return;
  }
  doPour(sel, i);
}

function doPour(a, b){
  busy = true;
  var s = tubes[a], d = tubes[b];
  var color = s[s.length - 1], run = topRun(s), n = Math.min(run, CAP - d.length);
  hist.push(tubes.map(function(t){ return t.slice(); }));
  moveCount++;
  var from = els[a], to = els[b];
  var sr = from.w.getBoundingClientRect(), tr = to.w.getBoundingClientRect(), br = stage.getBoundingClientRect();
  var side = (tr.left + tr.width / 2) >= (sr.left + sr.width / 2) ? 1 : -1;
  var ang = 62 * Math.PI / 180, H = sr.height;
  var scx = sr.left + sr.width / 2, scy = sr.top + sr.height / 2;
  var fx = tr.left + tr.width / 2 - side * Math.sin(ang) * H / 2 - side * sr.width * 0.15;
  var fy = tr.top - 8 + Math.cos(ang) * H / 2 - 4;
  var dx = fx - scx, dy = fy - scy;
  sel = -1;
  from.w.classList.remove('sel');
  from.w.style.zIndex = 20;
  from.w.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (side * 62) + 'deg)';
  sndPour();
  setTimeout(function(){
    var mouthX = tr.left + tr.width / 2 - br.left, mouthY = tr.top - 6 - br.top;
    var segH = tr.height * 0.18;
    var targetTop = (tr.top - br.top) + tr.height - 5 - (d.length + n) * (tr.width * 0.9);
    var st = document.createElement('div');
    st.className = 'stream';
    st.style.cssText = 'left:' + (mouthX - 3) + 'px;top:' + mouthY + 'px;height:' + Math.max(10, targetTop - mouthY + 6) + 'px;background:' + COLORS[color];
    stage.appendChild(st);
    for (var k = 0; k < n; k++){
      var top = from.liq.children[from.liq.children.length - 1 - k]; if (top){ top.style.height = '0px'; (function(x){ setTimeout(function(){ x.remove(); }, 380); })(top); }
      var ns = segEl(color); ns.style.height = '0px'; to.liq.appendChild(ns);
      (function(x){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ x.style.height = ''; }); }); })(ns);
    }
    for (k = 0; k < n; k++) d.push(s.pop());
    setTimeout(function(){ st.remove(); }, 420);
    setTimeout(function(){
      from.w.style.transform = '';
      setTimeout(function(){
        from.w.style.zIndex = '';
        busy = false;
        refresh();
        if (isSolved(tubes)) win();
      }, 330);
    }, 440);
  }, 360);
  refresh();
}

function win(){
  busy = true; sndWin();
  if (window.gtag) gtag('event', 'water_level_win', { level: level, moves: moveCount });
  ls(KEY, String(level + 1));
  var cf = el('wsConfetti'); cf.textContent = '';
  for (var i = 0; i < 46; i++){
    var p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = COLORS[i % COLORS.length];
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    p.style.animationDuration = (1.4 + Math.random() * 1.2) + 's';
    cf.appendChild(p);
  }
  el('wsOvTitle').textContent = 'أحسنت! أكملت المستوى ' + level;
  el('wsOvText').textContent = 'أنجزته في ' + moveCount + ' حركة.';
  setTimeout(function(){ el('wsOverlay').hidden = false; }, 350);
}

function undo(){
  if (busy || !hist.length) return;
  tubes = hist.pop(); moveCount = Math.max(0, moveCount - 1); sel = -1;
  build();
}
function addTube(){
  if (busy || extraUsed) return;
  extraUsed = true; tubes.push([]); sel = -1; build();
}

el('wsUndo').addEventListener('click', undo);
el('wsAdd').addEventListener('click', addTube);
el('wsRestart').addEventListener('click', function(){ if (!busy) start(level, true); });
el('wsRetry').addEventListener('click', function(){ start(level + 1); });
el('wsMute').addEventListener('click', function(){
  muted = !muted; ls(MUTE, muted ? '1' : '0'); el('wsMute').textContent = muted ? '🔇' : '🔊';
});
el('wsMute').textContent = muted ? '🔇' : '🔊';
el('wsFs').addEventListener('click', function(){
  var full = document.body.classList.toggle('ws-full');
  el('wsFs').textContent = full ? '✕' : '⛶ ملء الشاشة';
  setTimeout(build, 50);
});
window.addEventListener('resize', function(){ if (!busy) build(); });
start(level);
})();
