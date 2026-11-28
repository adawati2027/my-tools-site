(function(){
'use strict';
var CAP = 4, BIGCAP = 8;
var COLORS = ['#ff3b5c', '#ff9f0a', '#ffd60a', '#8fe000', '#00c853', '#00cfc1', '#2db7ff', '#3d5afe', '#a855ff', '#ff4fd8', '#8d5a3b', '#8e9bb0', '#2b2d42', '#ff9eb0', '#e6e8f2'];
var KEY = 'adawati_water_level', MUTE = 'adawati_water_mute';
var G = { big: false, tgt: -1 }, PAL = [];

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
  if (L > 25){
    var n = L <= 30 ? 9 : (L <= 40 ? 10 : (L <= 50 ? 11 : 12));
    return { colors: n, empty: L > 50 ? 1 : 2, hidden: L > 50 || (L - 26) % 3 === 1, big: true, noAdd: L > 50 };
  }
  return { colors: Math.min(12, 3 + Math.floor((L - 1) / 2)), empty: 2, hidden: false, big: false, noAdd: false };
}
function setG(L){
  var p = params(L), i, r, j, t;
  G.big = p.big; G.tgt = p.colors;
  PAL = [];
  for (i = 0; i < COLORS.length; i++) PAL.push(i);
  if (L > 25){
    r = rng(L * 31 + 7);
    for (i = PAL.length - 1; i > 0; i--){ j = Math.floor(r() * (i + 1)); t = PAL[i]; PAL[i] = PAL[j]; PAL[j] = t; }
  }
  return p;
}
function colorHex(c){ return COLORS[PAL[c]]; }
var TAUNTS = ['أصعب من دقات قلبك 💓', 'ألوان كثيرة وصبر أكثر 😅', 'هل تقدر؟ جرّب 😎', 'اسكب بحكمة 🧪', 'فكّر قبل أن تسكب 🧠'];
function tauntFor(L){
  if (L > 50) return 'مستوى الأساطير! لا مجال للخطأ 🔥';
  if (params(L).hidden) return 'ألوان مخفية! ركّز وتذكّر 🕵️';
  return TAUNTS[L % TAUNTS.length];
}

function capOf(tubes, i){ return G.big && i === tubes.length - 1 ? BIGCAP : CAP; }
function key(tubes){
  var n = G.big ? tubes.length - 1 : tubes.length;
  return tubes.slice(0, n).map(function(t){ return t.join(','); }).sort().join('|') + (G.big ? '#' + tubes[n].length : '');
}
function topRun(t){
  var c = t[t.length - 1], n = 0, i = t.length - 1;
  while (i >= 0 && t[i] === c){ n++; i--; }
  return n;
}
function isSolved(tubes){
  return tubes.every(function(t, i){
    if (G.big && i === tubes.length - 1) return t.length === BIGCAP;
    return !t.length || (t.length === CAP && topRun(t) === CAP);
  });
}
function moves(tubes){
  var out = [], i, j, last = tubes.length - 1;
  for (i = 0; i < tubes.length; i++){
    if (G.big && i === last) continue;
    var s = tubes[i]; if (!s.length) continue;
    var run = topRun(s), mono = run === s.length, top = s[s.length - 1];
    for (j = 0; j < tubes.length; j++){
      if (i === j) continue;
      var d = tubes[j], big = G.big && j === last, free = capOf(tubes, j) - d.length; if (free <= 0) continue;
      if (big){ if (top !== G.tgt) continue; }
      else if (d.length && d[d.length - 1] !== top) continue;
      if (!big && !d.length && mono) continue;
      var n = Math.min(run, free);
      out.push({ i: i, j: j, n: n, score: (big ? 5 : 0) + (d.length ? 2 : 0) + (n === run ? 1 : 0) + (mono ? 2 : 0) });
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

var cache = {};
function makeLevel(L){
  var p = setG(L);
  if (cache[L]) return cache[L];
  var seed, tubes;
  for (seed = 0; seed < 200; seed++){
    var r = rng(L * 7919 + seed * 104729 + 5), pool = [], i, c;
    for (c = 0; c < p.colors; c++) for (i = 0; i < CAP; i++) pool.push(c);
    if (p.big) for (i = 0; i < BIGCAP; i++) pool.push(G.tgt);
    for (i = pool.length - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    tubes = [];
    var full = pool.length / CAP;
    for (i = 0; i < full; i++) tubes.push(pool.slice(i * CAP, (i + 1) * CAP));
    for (i = 0; i < p.empty; i++) tubes.push([]);
    if (p.big) tubes.push([]);
    if (tubes.some(function(t, k){ return t.length === CAP && topRun(t) === CAP && !(p.big && k === tubes.length - 1); }) && L > 2) continue;
    if (solvable(tubes, 150000)) break;
  }
  return (cache[L] = tubes);
}

var level = Math.max(1, parseInt(ls(KEY), 10) || 1), muted = ls(MUTE) === '1';
var tubes, hist, sel = -1, busy = false, moveCount = 0, extraUsed = false, ac = null, noAdd = false;
var big = el('wsBig'), bigT = el('wsBigT'), bigLiq = el('wsBigLiq'), board = el('wsBoard'), stage = el('wsStage'), els = [];

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
  var n = G.big ? tubes.length - 1 : tubes.length, area = board.parentNode;
  var availW = Math.min(area.clientWidth || 360, 560) - 28, availH = (area.clientHeight || 560) - 30 - (G.big ? 64 : 0);
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
  var base = colorHex(c);
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
function bsegEl(c){
  var s = document.createElement('div');
  s.className = 'bseg';
  segStyle(s, c);
  return s;
}

function build(){
  board.textContent = '';
  els = [];
  sizeBoard();
  var small = G.big ? tubes.length - 1 : tubes.length;
  tubes.forEach(function(t, i){
    if (i >= small) return;
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
  big.hidden = !G.big;
  if (G.big){
    var bi = tubes.length - 1, hex = colorHex(G.tgt);
    bigLiq.textContent = '';
    tubes[bi].forEach(function(c){ bigLiq.appendChild(bsegEl(c)); });
    bigT.style.setProperty('--tc', hex);
    bigT.style.setProperty('--ghost', hex + '33');
    el('wsBigDot').style.background = hex;
    bigT.onclick = function(){ onTube(bi); };
    els.push({ w: bigT, liq: bigLiq, cap: document.createElement('div') });
  }
  refresh();
}

function refresh(){
  var P = params(level);
  tubes.forEach(function(t, i){
    var cap = capOf(tubes, i), full = t.length === cap && topRun(t) === cap;
    if (full && !(G.big && i === tubes.length - 1)) segStyle(els[i].cap, t[0]);
    els[i].w.classList.toggle('done', full);
    els[i].w.classList.toggle('sel', i === sel);
    var kids = els[i].liq.children, vis = t.length - topRun(t);
    for (var k = 0; k < kids.length; k++) kids[k].classList.toggle('hid', P.hidden && k < vis && t.length === kids.length);
  });
  if (G.big) el('wsBigCnt').textContent = tubes[tubes.length - 1].length + '/' + BIGCAP;
  el('wsLevel').textContent = 'المستوى ' + level;
  el('wsMoves').textContent = 'الحركات: ' + moveCount;
  el('wsUndo').disabled = !hist.length || busy;
  el('wsAdd').disabled = extraUsed || busy || noAdd;
}

function start(L, same){
  var p = setG(L);
  level = L; ls(KEY, String(L)); noAdd = p.noAdd;
  var tz = el('wsTaunt'); tz.textContent = tauntFor(L); tz.hidden = L <= 25;
  tubes = makeLevel(L).map(function(t){ return t.slice(); });
  hist = []; sel = -1; busy = false; moveCount = 0; extraUsed = false;
  el('wsOverlay').hidden = true;
  build();
  if (!same && window.gtag) gtag('event', 'water_level_start', { level: L });
}

function isCapped(i){
  var t = tubes[i], cap = capOf(tubes, i);
  return (G.big && i === tubes.length - 1) || (t.length === cap && topRun(t) === cap);
}
function onTube(i){
  if (busy) return;
  if (sel < 0){
    if (!tubes[i].length || isCapped(i)) return;
    sel = i; sndPick(); refresh(); return;
  }
  if (sel === i){ sel = -1; refresh(); return; }
  var s = tubes[sel], d = tubes[i], isBig = G.big && i === tubes.length - 1, top = s[s.length - 1];
  var ok = s.length && d.length < capOf(tubes, i) && (isBig ? top === G.tgt : (!d.length || d[d.length - 1] === top));
  if (!ok){
    if (tubes[i].length && !isCapped(i)){ sel = i; sndPick(); } else { sndBad(); sel = -1; }
    refresh(); return;
  }
  doPour(sel, i);
}

function doPour(a, b){
  busy = true;
  var s = tubes[a], d = tubes[b], toBig = G.big && b === tubes.length - 1;
  var color = s[s.length - 1], run = topRun(s), n = Math.min(run, capOf(tubes, b) - d.length);
  hist.push(tubes.map(function(t){ return t.slice(); }));
  moveCount++;
  var from = els[a], to = els[b];
  var sr = from.w.getBoundingClientRect(), tr = to.w.getBoundingClientRect(), br = stage.getBoundingClientRect();
  var tcx = toBig ? tr.left + tr.width * (d.length + n / 2) / BIGCAP : tr.left + tr.width / 2;
  var side = tcx >= (sr.left + sr.width / 2) ? 1 : -1;
  var ang = 62 * Math.PI / 180, H = sr.height;
  var scx = sr.left + sr.width / 2, scy = sr.top + sr.height / 2;
  var fx = tcx - side * Math.sin(ang) * H / 2 - side * sr.width * 0.15;
  var fy = tr.top - 8 + Math.cos(ang) * H / 2 - 4;
  var dx = fx - scx, dy = fy - scy;
  sel = -1;
  from.w.classList.remove('sel');
  from.w.style.zIndex = 20;
  from.w.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (side * 62) + 'deg)';
  sndPour();
  setTimeout(function(){
    var mouthX = tcx - br.left, mouthY = tr.top - 6 - br.top;
    var targetTop = toBig ? (tr.top - br.top) + tr.height * 0.5 : (tr.top - br.top) + tr.height - 5 - (d.length + n) * (tr.width * 0.9);
    var st = document.createElement('div');
    st.className = 'stream';
    st.style.cssText = 'left:' + (mouthX - 3) + 'px;top:' + mouthY + 'px;height:' + Math.max(10, targetTop - mouthY + 6) + 'px;background:' + colorHex(color);
    stage.appendChild(st);
    var prop = toBig ? 'width' : 'height';
    for (var k = 0; k < n; k++){
      var top = from.liq.children[from.liq.children.length - 1 - k]; if (top){ top.style.height = '0px'; (function(x){ setTimeout(function(){ x.remove(); }, 380); })(top); }
      var ns = toBig ? bsegEl(color) : segEl(color); ns.style[prop] = '0px'; to.liq.appendChild(ns);
      (function(x){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ x.style[prop] = ''; }); }); })(ns);
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
  if (busy || extraUsed || noAdd) return;
  extraUsed = true; tubes.splice(G.big ? tubes.length - 1 : tubes.length, 0, []); sel = -1; build();
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
