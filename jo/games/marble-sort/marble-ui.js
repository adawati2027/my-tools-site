(function(){
'use strict';
var E = window.MarbleEngine, W = E.W, H = E.H, R = E.R;
var PAL = [
  { b: '#ff2d7a', l: '#ff9cc4', d: '#a0104f', t: '#ff4f90' },
  { b: '#ffbf00', l: '#fff08a', d: '#b87900', t: '#ffd21f' },
  { b: '#0a84ff', l: '#8fcdff', d: '#0a4fb5', t: '#2e98ff' },
  { b: '#14c850', l: '#8ff0ad', d: '#0a7a2c', t: '#2ede67' },
  { b: '#ff6a00', l: '#ffc08a', d: '#b03c00', t: '#ff8420' },
  { b: '#8a3dff', l: '#cdb0ff', d: '#4a14b5', t: '#9c58ff' }
];
var canvas = document.getElementById('mbCanvas'), ctx = canvas.getContext('2d');
var wrap = document.getElementById('mbWrap'), game, level = 1, scale = 1, dpr = 1, sprites = [], hintPipe = -1, hintT = 0, muted = false, ac = null, last = 0, showTutorial = true, running = false;
try { level = Math.max(1, parseInt(localStorage.getItem('adawati_marble_level'), 10) || 1); muted = localStorage.getItem('adawati_marble_mute') === '1'; } catch (e) {}

function el(id){ return document.getElementById(id); }

function makeSprites(){
  sprites = [];
  var k = scale * dpr, size = Math.ceil(R * 2 * k) + 8;
  PAL.forEach(function(p){
    var c = document.createElement('canvas'); c.width = c.height = size;
    var x = c.getContext('2d'), r = R * k, cx = size / 2, cy = size / 2;
    x.beginPath(); x.arc(cx, cy, r, 0, 6.2832); x.fillStyle = p.d; x.fill();
    var g = x.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.05, cx, cy, r * 0.94);
    g.addColorStop(0, p.l); g.addColorStop(0.4, p.b); g.addColorStop(1, p.d);
    x.beginPath(); x.arc(cx, cy, r * 0.94, 0, 6.2832); x.fillStyle = g; x.fill();
    var bl = x.createRadialGradient(cx + r * 0.3, cy + r * 0.55, 0, cx + r * 0.3, cy + r * 0.55, r * 0.55);
    bl.addColorStop(0, 'rgba(255,255,255,.38)'); bl.addColorStop(1, 'rgba(255,255,255,0)');
    x.beginPath(); x.arc(cx, cy, r * 0.94, 0, 6.2832); x.fillStyle = bl; x.fill();
    x.beginPath(); x.ellipse(cx - r * 0.34, cy - r * 0.42, r * 0.28, r * 0.17, -0.7, 0, 6.2832); x.fillStyle = 'rgba(255,255,255,.92)'; x.fill();
    x.beginPath(); x.arc(cx - r * 0.05, cy - r * 0.62, r * 0.07, 0, 6.2832); x.fillStyle = 'rgba(255,255,255,.7)'; x.fill();
    sprites.push(c);
  });
}

function resize(){
  var full = document.body.classList.contains('mb-full');
  var w = full ? window.innerWidth - 8 : Math.min(wrap.parentNode.clientWidth, 440);
  var maxH = full ? Math.max(300, window.innerHeight - 130) : Math.max(420, window.innerHeight - 150);
  scale = Math.min(w / W, maxH / H);
  dpr = Math.min(Math.max(window.devicePixelRatio || 1, 3), 4);
  var cw = Math.round(W * scale), ch = Math.round(H * scale);
  wrap.style.width = cw + 'px'; wrap.style.height = ch + 'px';
  canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
  if (cw * ch * dpr * dpr > 7e6) dpr = Math.max(2, Math.sqrt(7e6 / (cw * ch)));
  canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  scale = cw / W;
  makeSprites();
}

function rr(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function drawBg(){
  var g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#dfe2ff'); g.addColorStop(1, '#b9beee');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  var f = E.FUNNEL;
  ctx.beginPath();
  ctx.moveTo(0, 214); ctx.lineTo(152, 274); ctx.lineTo(152, 296); ctx.lineTo(208, 296); ctx.lineTo(208, 274); ctx.lineTo(360, 214);
  ctx.lineTo(360, 232); ctx.lineTo(214, 290); ctx.lineTo(214, 306); ctx.lineTo(146, 306); ctx.lineTo(146, 290); ctx.lineTo(0, 232); ctx.closePath();
  var fg = ctx.createLinearGradient(0, 214, 0, 306); fg.addColorStop(0, '#5f86e0'); fg.addColorStop(1, '#3358b4');
  ctx.fillStyle = fg; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, 214); ctx.lineTo(152, 274); ctx.lineTo(208, 274); ctx.lineTo(360, 214);
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(4, 214); ctx.moveTo(356, 0); ctx.lineTo(356, 214);
  ctx.strokeStyle = 'rgba(80,90,160,.25)'; ctx.lineWidth = 4; ctx.stroke();
}

function drawBelt(g){
  var cx = E.CX, lh = E.LH, br = E.BR, top = E.TOP_Y, bot = E.BOT_Y;
  function path(){
    ctx.beginPath();
    ctx.moveTo(cx - lh, top); ctx.lineTo(cx + lh, top); ctx.arc(cx + lh, E.MID_Y, br, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(cx - lh, bot); ctx.arc(cx - lh, E.MID_Y, br, Math.PI / 2, Math.PI * 1.5); ctx.closePath();
  }
  ctx.save();
  ctx.shadowColor = 'rgba(40,50,120,.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
  path(); ctx.lineWidth = 31; ctx.strokeStyle = '#f4f5fb'; ctx.stroke();
  ctx.restore();
  path(); ctx.lineWidth = 22; ctx.strokeStyle = '#aab0d4'; ctx.stroke();
  path(); ctx.lineWidth = 19; ctx.strokeStyle = '#8f96c2'; ctx.stroke();
  ctx.save();
  path(); ctx.lineWidth = 19; ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.setLineDash([3, 14]); ctx.lineDashOffset = -(g.t * 120) % 17; ctx.stroke();
  ctx.restore();
}

function drawPipes(g){
  g.pipes.forEach(function(p, i){
    var x = p.x, w = 54;
    var tg = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
    tg.addColorStop(0, '#7b8196'); tg.addColorStop(0.35, '#e3e6f0'); tg.addColorStop(0.7, '#b6bbcc'); tg.addColorStop(1, '#6d7387');
    ctx.fillStyle = tg; rr(x - w / 2, -12, w, 118, 6); ctx.fill();
    var qn = p.queue.length;
    for (var q = Math.min(qn - 1, 3); q >= 1; q--){
      var pal = PAL[p.queue[q].color];
      ctx.fillStyle = pal.b; rr(x - 17, 78 - q * 17 + p.shift * 17, 34, 13, 4); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.35)'; rr(x - 15, 79 - q * 17 + p.shift * 17, 30, 4, 2); ctx.fill();
    }
    ctx.fillStyle = '#5c6278'; rr(x - w / 2 - 3, 102, w + 6, 9, 3); ctx.fill();
    if (qn){
      var pc = PAL[p.queue[0].color], pour = p.pouring;
      var bg = ctx.createLinearGradient(0, 110, 0, 132); bg.addColorStop(0, pc.t); bg.addColorStop(1, pc.d);
      ctx.fillStyle = bg; rr(x - 25, 110, 50, 22, 6); ctx.fill();
      for (var d = 0; d < 5; d++){
        ctx.beginPath(); ctx.arc(x - 16 + d * 8, 121, 2.6, 0, 6.2832); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill();
      }
      ctx.font = '800 17px Cairo, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var num = String(p.queue[0].units * 3);
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(30,30,60,.85)'; ctx.strokeText(num, x, 88);
      ctx.fillStyle = '#fff'; ctx.fillText(num, x, 88);
      if (!pour && g.status === 'play'){
        var pulse = 0.5 + 0.5 * Math.sin(g.t * 5 + i);
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.35 + 0.4 * pulse) + ')'; ctx.lineWidth = 2.5;
        rr(x - 28, 106, 56, 30, 8); ctx.stroke();
      }
    } else {
      ctx.fillStyle = 'rgba(60,66,100,.55)'; rr(x - 25, 110, 50, 22, 6); ctx.fill();
    }
    if (hintPipe === i && hintT > 0){
      var a = 0.5 + 0.5 * Math.sin(hintT * 9);
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.5 + 0.5 * a) + ')'; ctx.lineWidth = 4; rr(x - 32, 98, 64, 40, 12); ctx.stroke();
      ctx.font = '30px serif'; ctx.fillStyle = '#000'; ctx.fillText('👆', x, 154 + 4 * a);
    }
  });
  g.pipes.forEach(function(p){
    var x = p.x, fl = 0;
    g.gateFlash.forEach(function(f){ if (Math.abs(f.x - x) < 36) fl = Math.max(fl, f.t / 0.18); });
    var gg = ctx.createLinearGradient(0, E.GATE_Y - 6, 0, E.GATE_Y + 12);
    gg.addColorStop(0, fl ? '#8d96c8' : '#6a7093'); gg.addColorStop(1, '#3d4262');
    ctx.fillStyle = gg; rr(x - 34, E.GATE_Y - 7, 68, 20, 5); ctx.fill();
    ctx.font = '800 14px Cairo, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = fl ? '#fff' : '#d6daf0'; ctx.fillText('x3', x, E.GATE_Y + 3.5);
  });
}

function drawTile(col, tile, front){
  var x = col.x0, y = E.COL_TOP + tile.y, w = col.w, h = E.TILE_H, pal = PAL[tile.color];
  var sc = 1;
  if (tile.done) sc = 1 + 0.12 * Math.sin(Math.max(0, tile.pop) * 3.1416) ;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2); ctx.scale(sc, sc);
  if (tile.done) ctx.globalAlpha = Math.max(0, Math.min(1, tile.pop * 1.4));
  ctx.translate(-w / 2, -h / 2);
  var g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, pal.t); g.addColorStop(1, pal.d);
  ctx.shadowColor = 'rgba(30,40,100,.3)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2;
  ctx.fillStyle = g; rr(0, 0, w, h, 9); ctx.fill();
  ctx.shadowColor = 'transparent';
  if (!front){ ctx.fillStyle = 'rgba(40,40,90,.08)'; rr(0, 0, w, h, 9); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; rr(1, 1, w - 2, h - 2, 8); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.22)'; rr(3, 3, w - 6, 9, 5); ctx.fill(); ctx.strokeStyle = pal.d; ctx.lineWidth = 1.2; rr(0.5, 0.5, w - 1, h - 1, 9); ctx.stroke();
  var k = w / 72;
  for (var i = 0; i < 9; i++){
    var dx = w / 2 + E.DOT_OFF[i][0] * k, dy = h / 2 + E.DOT_OFF[i][1];
    ctx.beginPath(); ctx.arc(dx, dy, 7.6, 0, 6.2832); ctx.fillStyle = 'rgba(0,0,0,.32)'; ctx.fill();
    ctx.beginPath(); ctx.arc(dx, dy + 0.5, 6.6, 0, 6.2832); ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fill(); ctx.beginPath(); ctx.arc(dx, dy + 1, 5.2, 0, 6.2832); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fill();
    if (i < tile.filled){ ctx.save(); ctx.translate(-0, 0); marbleAt(dx, dy, tile.color); ctx.restore(); }
  }
  ctx.restore();
}

function marbleAt(x, y, c){
  var sp = sprites[c], sz = sp.width / (scale * dpr);
  ctx.drawImage(sp, x - sz / 2, y - sz / 2, sz, sz);
}

function drawCols(g){
  g.cols.forEach(function(col){
    for (var i = col.tiles.length - 1; i >= 0; i--) drawTile(col, col.tiles[i], i === 0);
  });
}

function render(){
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
  drawBg();
  if (!game) return;
  drawPipes(game);
  game.marbles.forEach(function(m){ marbleAt(m.x, m.y, m.color); });
  drawBelt(game);
  game.belt.forEach(function(m){
    var p = E.beltPos(m.s), x = p.x, y = p.y;
    if (m.a > 0){ x = p.x + (m.fx - p.x) * m.a; y = p.y + (m.fy - p.y) * m.a; }
    marbleAt(x, y, m.color);
  });
  drawCols(game);
  game.flying.forEach(function(f){
    var t = Math.min(1, f.t), e = t * t * (3 - 2 * t);
    marbleAt(f.x + (f.tx - f.x) * e, f.y + (f.ty - f.y) * e - Math.sin(t * 3.1416) * 8, f.color);
  });
  game.particles.forEach(function(p){
    ctx.globalAlpha = Math.max(0, p.t / 0.7); ctx.fillStyle = PAL[p.c].b;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.2832); ctx.fill();
  });
  ctx.globalAlpha = 1;
  if (showTutorial && level === 1 && game.t < 8 && game.status === 'play' && !game.pipes.some(function(p){ return p.pouring; })){
    var p0 = game.pipes[0], b = Math.sin(game.t * 5) * 5;
    ctx.font = '34px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#000';
    ctx.fillText('👆', p0.x + 8, 156 + b);
  }
}

function tone(freq, dur, type, vol){
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol || 0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur);
  } catch (e) {}
}

var lastCatch = 0, combo = 0;
function handleEvents(){
  var ev = game.events; game.events = [];
  ev.forEach(function(e){
    if (e.type === 'catch'){
      var now = performance.now();
      combo = now - lastCatch < 350 ? Math.min(combo + 1, 12) : 0; lastCatch = now;
      tone(520 + combo * 38, 0.07, 'triangle', 0.04);
    } else if (e.type === 'tile'){
      tone(784, 0.14, 'sine', 0.07); setTimeout(function(){ tone(1046, 0.2, 'sine', 0.07); }, 90);
      try { navigator.vibrate && navigator.vibrate(18); } catch (er) {}
    } else if (e.type === 'pour'){ tone(220, 0.12, 'sine', 0.05);
    } else if (e.type === 'win'){ showOverlay('win');
    } else if (e.type === 'lose'){ showOverlay('lose'); tone(160, 0.4, 'sawtooth', 0.05); }
  });
}

function showOverlay(kind){
  var o = el('mbOverlay');
  el('mbOvTitle').textContent = kind === 'win' ? 'أحسنت! أكملت المستوى ' + level : 'الحزام امتلأ';
  el('mbOvText').textContent = kind === 'win' ? 'التقطت كل الكرات ورتّبتها في مكانها الصحيح.' : 'بقيت كرات ما لها بلاطة تلتقطها. جرّب ترتيباً آخر للأنابيب.';
  el('mbNext').hidden = kind !== 'win';
  el('mbRetry').textContent = kind === 'win' ? 'أعد المستوى' : 'حاول مرة أخرى';
  o.hidden = false;
  if (kind === 'win'){
    try { localStorage.setItem('adawati_marble_level', String(level + 1)); } catch (e) {}
    if (window.gtag) gtag('event', 'marble_level_win', { level: level });
  }
}

function startLevel(L, same){
  level = L;
  if (!same || !game) game = new E.Game(L); else game.reset();
  hintPipe = -1; hintT = 0;
  el('mbOverlay').hidden = true;
  el('mbLevel').textContent = 'المستوى ' + L;
  if (window.gtag) gtag('event', 'marble_level_start', { level: L });
}

function frame(ts){
  var dt = Math.min(0.033, (ts - last) / 1000 || 0.016); last = ts;
  if (game){
    game.step(dt);
    handleEvents();
    if (hintT > 0) hintT -= dt;
    var left = game.cols.reduce(function(a, c){ return a + c.tiles.length; }, 0);
    el('mbProgress').textContent = (game.totalTiles - left) + ' / ' + game.totalTiles + ' بلاطات';
  }
  render();
  requestAnimationFrame(frame);
}

function pointer(e){
  var r = canvas.getBoundingClientRect();
  var x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
  var i = game.pipeAt(x, y);
  if (i >= 0 && game.tapPipe(i)){ showTutorial = false; hintPipe = -1; }
  e.preventDefault();
}

function init(){
  resize();
  window.addEventListener('resize', resize);
  var fsBtn = el('mbFs');
  function syncFs(){ fsBtn.textContent = document.body.classList.contains('mb-full') ? '✕' : '⛶ ملء الشاشة'; fsBtn.setAttribute('aria-label', document.body.classList.contains('mb-full') ? 'خروج من ملء الشاشة' : 'ملء الشاشة'); }
  function nativeFs(on){
    var d = document, e = d.documentElement;
    try {
      if (on && !d.fullscreenElement && e.requestFullscreen) e.requestFullscreen({ navigationUI: 'hide' }).catch(function(){});
      if (!on && d.fullscreenElement && d.exitFullscreen) d.exitFullscreen().catch(function(){});
    } catch (er) {}
  }
  fsBtn.addEventListener('click', function(){
    var on = !document.body.classList.contains('mb-full');
    document.body.classList.toggle('mb-full', on);
    nativeFs(on); syncFs(); resize(); window.scrollTo(0, 0);
  });
  document.addEventListener('pointerdown', function once(){
    document.removeEventListener('pointerdown', once);
    if (document.body.classList.contains('mb-full')) nativeFs(true);
  });
  document.addEventListener('fullscreenchange', function(){
    if (!document.fullscreenElement && document.body.classList.contains('mb-full')){ document.body.classList.remove('mb-full'); syncFs(); resize(); }
  });
  syncFs();
  canvas.addEventListener('pointerdown', pointer);
  el('mbRetry').addEventListener('click', function(){ startLevel(level, true); });
  el('mbNext').addEventListener('click', function(){ startLevel(level + 1); });
  el('mbRestart').addEventListener('click', function(){ startLevel(level, true); });
  el('mbHint').addEventListener('click', function(){
    if (!game || game.status !== 'play') return;
    var h = game.hint();
    if (h < 0){ el('mbMsg').textContent = 'ما في ترتيب ينجح من هذي النقطة — أعد المستوى.'; }
    else { hintPipe = h; hintT = 3; el('mbMsg').textContent = ''; }
  });
  el('mbMute').addEventListener('click', function(){
    muted = !muted; el('mbMute').textContent = muted ? '🔇' : '🔊';
    try { localStorage.setItem('adawati_marble_mute', muted ? '1' : '0'); } catch (e) {}
  });
  el('mbMute').textContent = muted ? '🔇' : '🔊';
  startLevel(level);
  requestAnimationFrame(frame);
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(init); else init();
window.__marble = { get game(){ return game; }, startLevel: startLevel };
})();
