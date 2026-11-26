(function () {
  var Core = window.BlastCore;
  var W = Core.W, H = Core.H, ROCK = Core.ROCK, BOMB = Core.BOMB, ROCKET = Core.ROCKET;
  var $ = function (id) { return document.getElementById(id); };
  var canvas = $('rbCanvas'), ctx = canvas.getContext('2d');
  var stage = $('rbStage');
  var PAL = [['#ff7b88', '#d4152f', '#8f0b1f'], ['#78ef78', '#1fae3f', '#0e6b25'], ['#ffdc5c', '#f59a00', '#a35f00'], ['#6fc2ff', '#1f6fe0', '#12449a'], ['#d29aff', '#8a37e0', '#552090']];
  var st, level = 1, attempt = 0, cs = 40, dpr = 1, views = {}, dying = [], parts = [], fxs = [], shake = 0;
  var pendingEnd = false, hint = null, idleT = 0, last = 0, muted = false, ac = null, gridTop = 0;

  try { level = Math.max(1, parseInt(localStorage.getItem('rb_level'), 10) || 1); muted = localStorage.getItem('rb_mute') === '1'; } catch (e) {}

  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function lg(c, x0, y0, x1, y1, stops) {
    var g = c.createLinearGradient(x0, y0, x1, y1);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }

  function card(c, k, x, y, s) {
    var p = PAL[k];
    c.save();
    c.shadowColor = 'rgba(20,10,60,.35)'; c.shadowBlur = s * .1; c.shadowOffsetY = s * .05;
    rr(c, x, y, s, s, s * .24); c.fillStyle = lg(c, x, y, x, y + s, [[0, p[0]], [1, p[1]]]); c.fill();
    c.restore();
    c.save(); rr(c, x, y, s, s, s * .24); c.clip();
    c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(x, y + s * .84, s, s * .16);
    c.fillStyle = lg(c, x, y, x, y + s * .5, [[0, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]);
    c.beginPath(); c.ellipse(x + s * .5, y + s * .12, s * .62, s * .42, 0, 0, 6.3); c.fill();
    c.restore();
    rr(c, x + s * .02, y + s * .02, s * .96, s * .96, s * .23); c.lineWidth = s * .045; c.strokeStyle = p[2]; c.globalAlpha = .9; c.stroke(); c.globalAlpha = 1;
  }

  function icon(c, k, cx, cy, s) {
    c.save(); c.translate(cx, cy); c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
    if (k === 0) {
      c.beginPath(); c.moveTo(-.31, -.1); c.lineTo(-.18, -.29); c.lineTo(.18, -.29); c.lineTo(.31, -.1); c.lineTo(0, .31); c.closePath();
      c.fillStyle = lg(c, 0, -.3, 0, .3, [[0, '#ffffff'], [1, '#ffb0bd']]); c.fill(); c.lineWidth = .04; c.strokeStyle = '#7a0a1c'; c.stroke();
      c.lineWidth = .022; c.strokeStyle = 'rgba(122,10,28,.5)'; c.beginPath();
      c.moveTo(-.31, -.1); c.lineTo(.31, -.1); c.moveTo(-.18, -.29); c.lineTo(-.09, -.1); c.lineTo(0, .31); c.moveTo(.18, -.29); c.lineTo(.09, -.1); c.lineTo(0, .31); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.moveTo(-.15, -.25); c.lineTo(-.05, -.25); c.lineTo(-.1, -.14); c.lineTo(-.22, -.14); c.closePath(); c.fill();
    } else if (k === 1) {
      var ct = [[0, -.14], [.14, 0], [0, .14], [-.14, 0]];
      c.lineWidth = .05; c.strokeStyle = '#0b5d22'; c.beginPath(); c.moveTo(.05, .12); c.quadraticCurveTo(.12, .26, .24, .34); c.stroke();
      for (var i = 0; i < 4; i++) {
        c.beginPath(); c.arc(ct[i][0], ct[i][1], .15, 0, 6.3);
        c.fillStyle = lg(c, 0, -.3, 0, .3, [[0, '#f4ffd6'], [1, '#7fdc4a']]); c.fill(); c.lineWidth = .035; c.strokeStyle = '#0b5d22'; c.stroke();
      }
      c.beginPath(); c.arc(0, 0, .14, 0, 6.3); c.fillStyle = '#b5f07a'; c.fill();
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(-.05, -.17, .035, 0, 6.3); c.fill();
    } else if (k === 2) {
      c.beginPath(); c.moveTo(-.3, .24); c.lineTo(-.3, -.02); c.arc(0, -.02, .3, Math.PI, 2 * Math.PI); c.lineTo(.3, .24); c.closePath();
      c.fillStyle = lg(c, -.3, 0, .3, 0, [[0, '#ffffff'], [.5, '#c9d3e4'], [1, '#8d9bb5']]); c.fill(); c.lineWidth = .045; c.strokeStyle = '#2e3850'; c.stroke();
      rr(c, -.22, .02, .44, .09, .03); c.fillStyle = '#2e3850'; c.fill();
      rr(c, -.035, .1, .07, .14, .02); c.fillStyle = '#c9d3e4'; c.fill(); c.lineWidth = .025; c.stroke();
      c.beginPath(); c.moveTo(-.05, -.31); c.quadraticCurveTo(0, -.5, .24, -.38); c.quadraticCurveTo(.1, -.3, .05, -.31); c.closePath();
      c.fillStyle = '#e2252f'; c.fill(); c.lineWidth = .025; c.strokeStyle = '#7a0a14'; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = .04; c.beginPath(); c.arc(0, -.02, .22, 3.5, 4.5); c.stroke();
    } else if (k === 3) {
      var sh = function () { c.beginPath(); c.moveTo(-.27, -.28); c.lineTo(.27, -.28); c.lineTo(.27, .04); c.quadraticCurveTo(.25, .22, 0, .35); c.quadraticCurveTo(-.25, .22, -.27, .04); c.closePath(); };
      sh(); c.fillStyle = lg(c, 0, -.3, 0, .35, [[0, '#ffffff'], [1, '#c3d0ea']]); c.fill(); c.lineWidth = .045; c.strokeStyle = '#0f2f73'; c.stroke();
      c.save(); c.scale(.66, .66); c.translate(0, -.02); sh(); c.fillStyle = lg(c, 0, -.3, 0, .35, [[0, '#ffe273'], [1, '#f0a000']]); c.fill(); c.lineWidth = .05; c.strokeStyle = '#8a5200'; c.stroke(); c.restore();
      c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = .035; c.beginPath(); c.moveTo(-.1, -.14); c.lineTo(-.1, -.03); c.stroke();
    } else if (k === 4) {
      c.beginPath();
      for (var j = 0; j < 10; j++) {
        var a = -Math.PI / 2 + j * Math.PI / 5, rad = j % 2 ? .15 : .33;
        c[j ? 'lineTo' : 'moveTo'](Math.cos(a) * rad, Math.sin(a) * rad + .03);
      }
      c.closePath(); c.fillStyle = lg(c, 0, -.3, 0, .3, [[0, '#fff9ae'], [1, '#ffc400']]); c.fill(); c.lineWidth = .045; c.strokeStyle = '#7a4a00'; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(-.07, -.1, .045, 0, 6.3); c.fill();
    }
    c.restore();
  }

  function rock(c, cx, cy, s, hp, max) {
    c.save(); c.translate(cx, cy); c.scale(s, s); c.lineJoin = 'round';
    var pts = [[-.4, -.14], [-.28, -.34], [-.02, -.42], [.26, -.34], [.41, -.1], [.38, .2], [.2, .4], [-.12, .42], [-.36, .3]];
    c.beginPath();
    for (var i = 0; i < pts.length; i++) c[i ? 'lineTo' : 'moveTo'](pts[i][0], pts[i][1]);
    c.closePath();
    var tough = max === 2 && hp === 2;
    c.fillStyle = tough ? lg(c, 0, -.4, 0, .4, [[0, '#8fa0c4'], [1, '#3e4b6b']]) : lg(c, 0, -.4, 0, .4, [[0, '#d5dae4'], [1, '#7d8799']]);
    c.fill(); c.lineWidth = .05; c.strokeStyle = tough ? '#1f2740' : '#454d5e'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(-.3, -.14); c.lineTo(-.2, -.28); c.lineTo(.02, -.34); c.lineTo(-.1, -.16); c.closePath(); c.fill();
    c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.moveTo(.1, .12); c.lineTo(.36, .08); c.lineTo(.2, .36); c.lineTo(-.1, .38); c.closePath(); c.fill();
    if (tough) {
      c.fillStyle = '#d8e2ff';
      [[-.26, -.2], [.26, -.2], [-.24, .24], [.22, .26]].forEach(function (q) { c.beginPath(); c.arc(q[0], q[1], .04, 0, 6.3); c.fill(); });
    }
    if (max === 2 && hp === 1) {
      c.strokeStyle = '#2d3445'; c.lineWidth = .04; c.beginPath(); c.moveTo(-.05, -.4); c.lineTo(.04, -.15); c.lineTo(-.08, .02); c.lineTo(.06, .22); c.lineTo(0, .4); c.stroke();
      c.beginPath(); c.moveTo(.04, -.15); c.lineTo(.24, -.08); c.stroke();
    } else if (max === 1) {
      c.strokeStyle = 'rgba(45,52,69,.45)'; c.lineWidth = .028; c.beginPath(); c.moveTo(.08, -.3); c.lineTo(.0, -.1); c.lineTo(.12, .06); c.stroke();
    }
    c.restore();
  }

  function special(c, k, cx, cy, s, tm) {
    var pu = .5 + .5 * Math.sin(tm * 6);
    c.save(); c.translate(cx, cy);
    var g = c.createRadialGradient(0, 0, 0, 0, 0, s * .62);
    g.addColorStop(0, 'rgba(255,240,150,' + (.75 + .2 * pu) + ')'); g.addColorStop(1, 'rgba(255,200,60,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, s * .62, 0, 6.3); c.fill();
    c.scale(s, s); c.lineJoin = 'round'; c.lineCap = 'round';
    if (k === BOMB) {
      c.beginPath(); c.arc(0, .07, .29, 0, 6.3); c.fillStyle = lg(c, -.2, -.2, .25, .35, [[0, '#6b7390'], [.5, '#262c42'], [1, '#0d1020']]); c.fill(); c.lineWidth = .045; c.strokeStyle = '#05060f'; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(-.12, -.04, .07, .05, -.6, 0, 6.3); c.fill();
      rr(c, -.07, -.27, .14, .09, .02); c.fillStyle = '#9aa3bd'; c.fill(); c.lineWidth = .03; c.strokeStyle = '#05060f'; c.stroke();
      c.strokeStyle = '#7a4a1a'; c.lineWidth = .04; c.beginPath(); c.moveTo(0, -.27); c.quadraticCurveTo(.08, -.37, .18, -.34); c.stroke();
      c.fillStyle = '#ffd23a'; c.beginPath();
      for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4, r = i % 2 ? .04 : .09 + .03 * pu; c[i ? 'lineTo' : 'moveTo'](.2 + Math.cos(a) * r, -.35 + Math.sin(a) * r); }
      c.closePath(); c.fill(); c.fillStyle = '#ff6a1a'; c.beginPath(); c.arc(.2, -.35, .03, 0, 6.3); c.fill();
    } else {
      var fl = .08 + .05 * pu;
      c.beginPath(); c.moveTo(-.3, 0); c.lineTo(-.42 - fl, -.07); c.lineTo(-.36 - fl, 0); c.lineTo(-.42 - fl, .07); c.closePath(); c.fillStyle = '#ffb21a'; c.fill();
      c.beginPath(); c.moveTo(-.2, -.2); c.lineTo(-.34, -.32); c.lineTo(-.14, -.14); c.closePath(); c.fillStyle = '#e2252f'; c.fill(); c.lineWidth = .03; c.strokeStyle = '#7a0a14'; c.stroke();
      c.beginPath(); c.moveTo(-.2, .2); c.lineTo(-.34, .32); c.lineTo(-.14, .14); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(-.3, -.12); c.lineTo(.12, -.15); c.quadraticCurveTo(.34, -.1, .4, 0); c.quadraticCurveTo(.34, .1, .12, .15); c.lineTo(-.3, .12); c.closePath();
      c.fillStyle = lg(c, 0, -.15, 0, .15, [[0, '#ffffff'], [1, '#b9c4dd']]); c.fill(); c.lineWidth = .04; c.strokeStyle = '#3a2147'; c.stroke();
      c.beginPath(); c.moveTo(.16, -.14); c.quadraticCurveTo(.34, -.1, .4, 0); c.quadraticCurveTo(.34, .1, .16, .14); c.closePath(); c.fillStyle = '#e2252f'; c.fill(); c.stroke();
      c.beginPath(); c.arc(-.04, 0, .06, 0, 6.3); c.fillStyle = '#4aa8ff'; c.fill(); c.lineWidth = .025; c.stroke();
    }
    c.restore();
  }

  function drawTile(c, k, cx, cy, s, hp, max, tm) {
    if (k < 5) { var is = s * .9; card(c, k, cx - is / 2, cy - is / 2, is); icon(c, k, cx, cy + is * .02, is * 1.02); }
    else if (k === ROCK) rock(c, cx, cy, s * .92, hp, max);
    else special(c, k, cx, cy, s * .92, tm);
  }

  function layout() {
    var area = $('rbArea');
    var aw = area.clientWidth - 30, ah = area.clientHeight - 26;
    cs = Math.max(28, Math.floor(Math.min(aw / W, ah / H)));
    dpr = Math.min(2.5, window.devicePixelRatio || 1);
    canvas.style.width = cs * W + 'px'; canvas.style.height = cs * H + 'px';
    canvas.width = Math.round(cs * W * dpr); canvas.height = Math.round(cs * H * dpr);
  }

  var audioOK = function () {
    if (muted) return null;
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) { return null; }
    return ac;
  };
  function tone(f, d, type, vol, slide) {
    var a = audioOK(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol || .12, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + d + .02);
  }
  function sPop(n) { tone(420 + Math.min(n, 10) * 55, .16, 'triangle', .14, 700 + Math.min(n, 10) * 70); }
  function sBoom() { tone(160, .45, 'sawtooth', .16, 40); tone(90, .5, 'square', .1, 30); }
  function sRock() { tone(220, .12, 'square', .08, 120); }
  function sWin() { [523, 659, 784, 1047, 1319].forEach(function (f, i) { setTimeout(function () { tone(f, .3, 'triangle', .13); }, i * 120); }); }
  function sLose() { [392, 330, 262].forEach(function (f, i) { setTimeout(function () { tone(f, .35, 'sine', .13); }, i * 200); }); }

  function king(cls, ms) {
    var k = $('rbKing'); if (!k) return;
    k.setAttribute('class', 'king ' + cls);
    if (ms) setTimeout(function () { k.setAttribute('class', 'king'); }, ms);
  }
  function dragonFire(ms) {
    var d = $('rbDragon'); if (!d) return;
    d.setAttribute('class', 'dragon fire');
    setTimeout(function () { d.setAttribute('class', 'dragon'); }, ms || 900);
  }
  function combo(txt) {
    var e = $('rbCombo'); if (!e) return;
    e.textContent = txt; e.classList.remove('go'); void e.offsetWidth; e.classList.add('go');
  }

  function buildGoals() {
    var box = $('rbGoals'); box.innerHTML = '';
    st.goals.forEach(function (g, i) {
      var d = document.createElement('div'); d.className = 'rb-goal'; d.id = 'rbG' + i;
      var cv = document.createElement('canvas'); cv.width = 96; cv.height = 96;
      var cc = cv.getContext('2d');
      if (g.k < 5) { card(cc, g.k, 8, 8, 80); icon(cc, g.k, 48, 50, 82); } else rock(cc, 48, 48, 84, 1, 1);
      var n = document.createElement('span'); n.className = 'rb-gn'; n.id = 'rbGN' + i;
      d.appendChild(cv); d.appendChild(n); box.appendChild(d);
    });
    updateHud();
  }
  function updateHud() {
    st.goals.forEach(function (g, i) {
      var d = $('rbG' + i), n = $('rbGN' + i); if (!d) return;
      var left = Math.max(0, g.need - g.have);
      var txt = left ? String(left) : '✓';
      if (n.textContent !== txt) { n.textContent = txt; d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop'); }
      d.classList.toggle('done', !left);
    });
    var m = $('rbMoves'); m.textContent = st.moves; m.parentNode.classList.toggle('warn', st.moves <= 5);
    $('rbScore').textContent = st.score;
    $('rbLevel').textContent = 'المستوى ' + level;
  }

  function sync() {
    var live = {}, c, r, t, v, id;
    for (c = 0; c < W; c++) for (r = 0; r < H; r++) {
      t = st.g[c][r]; if (!t) continue;
      live[t.id] = 1; v = views[t.id];
      if (!v) { v = views[t.id] = { id: t.id, col: c, y: t.from, vy: 0, sq: 0, sh: 0, pop: 0, delay: (st.intro ? c * .05 + (H - 1 - r) * .012 : 0) }; }
      v.k = t.k; v.hp = t.hp; v.max = t.max || t.hp; v.row = t.row;
    }
    for (id in views) if (!live[id]) delete views[id];
  }

  function burst(cx, cy, k, n, rock) {
    var col = rock ? '#aab3c4' : PAL[k][0];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.3, sp = 2 + Math.random() * 5;
      parts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: .55 + Math.random() * .35, max: .9, c: i % 3 === 0 ? '#ffffff' : col, r: .08 + Math.random() * .1, rot: Math.random() * 6, vr: Math.random() * 10 - 5, star: i % 4 === 0 && !rock });
    }
  }

  function startLevel(retry) {
    if (retry) attempt++; else attempt = 0;
    st = Core.make(level, attempt); st.intro = true;
    views = {}; dying = []; parts = []; fxs = []; pendingEnd = false; hint = null; idleT = 0;
    $('rbOverlay').hidden = true; $('rbConfetti').innerHTML = '';
    sync(); st.intro = false;
    buildGoals(); king('', 0);
    try { localStorage.setItem('rb_level', level); } catch (e) {}
  }

  function busy() {
    if (dying.length || pendingEnd) return true;
    for (var id in views) { var v = views[id]; if (v.delay > 0 || v.y < v.row - .002) return true; }
    return false;
  }

  function handle(ev, c, r) {
    var n = ev.size;
    ev.removed.forEach(function (e) {
      var v = views[e.tile.id];
      dying.push({ v: v || { col: e.c, y: e.r, k: e.tile.k }, t: 0 });
      burst(e.c + .5, e.r + .5, e.tile.k, e.how === 'group' ? 4 : 6);
    });
    ev.rocks.forEach(function (e) {
      var v = views[e.tile.id];
      if (e.dead) { dying.push({ v: v || { col: e.c, y: e.r, k: ROCK, hp: 1, max: 1 }, t: 0 }); burst(e.c + .5, e.r + .5, 0, 10, true); sRock(); }
      else if (v) { v.sh = 1; v.hp = e.tile.hp; burst(e.c + .5, e.r + .5, 0, 5, true); sRock(); }
    });
    ev.blasts.forEach(function (b) {
      shake = Math.max(shake, .5); fxs.push({ type: b.k === BOMB ? 'ring' : 'beam', x: b.c + .5, y: b.r + .5, t: 0 });
      sBoom(); dragonFire(1100);
    });
    if (!ev.blasts.length) sPop(n);
    var msg = n >= 9 ? 'أسطوري!' : n >= 7 ? 'مذهل!' : n >= 5 ? 'رائع!' : n >= 4 ? 'جميل!' : (ev.blasts.length ? 'بووم!' : '');
    if (msg) combo(msg);
    if (n >= 5 || ev.blasts.length) king('cheer', 900);
    var shuffled = false;
    if (st.state === 'win') {
      var left = [];
      for (var cc = 0; cc < W; cc++) for (var rr2 = 0; rr2 < H; rr2++) { var t = st.g[cc][rr2]; if (t && views[t.id]) left.push({ v: views[t.id], d: cc * .035 + (H - rr2) * .02 }); }
      left.forEach(function (o) { dying.push({ v: o.v, t: -o.d, win: 1 }); });
      pendingEnd = true;
      for (var id in views) delete views[id];
    } else {
      shuffled = Core.settle(st);
      sync();
      if (ev.made) { var mvw = views[ev.made.tile.id]; if (mvw) mvw.pop = 1; }
      if (st.state === 'lose') pendingEnd = true;
    }
    if (shuffled) combo('خلط القطع');
    updateHud();
    if (pendingEnd) setTimeout(function () { endGame(); }, st.state === 'win' ? 1100 : 700);
  }

  function endGame() {
    var ov = $('rbOverlay'), win = st.state === 'win';
    var pct = st.moves / Math.max(1, Core.params(level).moves);
    var stars = win ? (pct >= .35 ? 3 : pct >= .15 ? 2 : 1) : 0;
    $('rbOvStars').textContent = win ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : '💔';
    $('rbOvTitle').textContent = win ? 'نصر ملكي!' : 'نفدت الحركات';
    $('rbOvText').textContent = win ? 'أنقذت المملكة في المستوى ' + level + ' وبقيت لك ' + st.moves + ' حركات.' : 'اقتربت من الهدف. جرّب مرة أخرى بخطة مختلفة.';
    $('rbRetry').textContent = win ? 'المستوى التالي ←' : 'حاول مجدداً ↻';
    ov.hidden = false; pendingEnd = false;
    if (win) { king('win', 0); sWin(); confetti(); level++; try { localStorage.setItem('rb_level', level); } catch (e) {} }
    else { king('sad', 0); sLose(); }
  }
  function confetti() {
    var box = $('rbConfetti'), cols = ['#ff4d6d', '#ffd23a', '#4ade80', '#38bdf8', '#c084fc', '#fb923c'];
    for (var i = 0; i < 60; i++) {
      var e = document.createElement('i');
      e.style.left = Math.random() * 100 + '%'; e.style.background = cols[i % cols.length];
      e.style.animationDuration = 1.6 + Math.random() * 1.6 + 's'; e.style.animationDelay = Math.random() * .5 + 's';
      box.appendChild(e);
    }
  }

  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    audioOK();
    idleT = 0; hint = null;
    if (busy() || st.state !== 'play') return;
    var rc = canvas.getBoundingClientRect();
    var c = Math.floor((e.clientX - rc.left) / (rc.width / W)), r = Math.floor((e.clientY - rc.top) / (rc.height / H));
    if (c < 0 || r < 0 || c >= W || r >= H) return;
    var t = st.g[c][r]; if (!t) return;
    var ev = Core.applyTap(st, c, r);
    if (!ev) { var v = views[t.id]; if (v) v.sh = 1; tone(150, .1, 'square', .06); return; }
    handle(ev, c, r);
  });

  function findHint() {
    var best = null, bn = 0, seen = {};
    for (var c = 0; c < W; c++) for (var r = 0; r < H; r++) {
      var t = st.g[c][r]; if (!t || t.k === ROCK || seen[c * 10 + r]) continue;
      if (t.k > 4) { if (bn < 5) { best = [[c, r]]; bn = 5; } continue; }
      var g = Core.group(st, c, r);
      g.forEach(function (q) { seen[q[0] * 10 + q[1]] = 1; });
      if (g.length >= 2 && g.length > bn) { best = g; bn = g.length; }
    }
    return best;
  }

  function frame(ts) {
    var dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    var tm = ts / 1000, id, v, i;
    for (id in views) {
      v = views[id];
      if (v.delay > 0) { v.delay -= dt; continue; }
      if (v.y < v.row) {
        v.vy += 48 * dt; v.y += v.vy * dt;
        if (v.y >= v.row) { v.y = v.row; if (v.vy > 7) { v.sq = 1; } v.vy = 0; }
      }
      if (v.sq > 0) v.sq = Math.max(0, v.sq - dt * 4.5);
      if (v.sh > 0) v.sh = Math.max(0, v.sh - dt * 3);
      if (v.pop > 0) v.pop = Math.max(0, v.pop - dt * 2.6);
    }
    for (i = dying.length - 1; i >= 0; i--) { dying[i].t += dt; if (dying[i].t > .24) { if (dying[i].win) burst(dying[i].v.col + .5, dying[i].v.y + .5, dying[i].v.k < 5 ? dying[i].v.k : 0, 5, dying[i].v.k === ROCK); dying.splice(i, 1); } }
    for (i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.vy += 16 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (i = fxs.length - 1; i >= 0; i--) { fxs[i].t += dt; if (fxs[i].t > .5) fxs.splice(i, 1); }
    if (shake > 0) shake = Math.max(0, shake - dt * 2.2);
    if (st && st.state === 'play' && !busy()) { idleT += dt; if (idleT > 5 && !hint) hint = findHint(); }
    draw(tm);
    requestAnimationFrame(frame);
  }

  function draw(tm) {
    var s = cs * dpr, c = ctx, id, v, i;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    var sx = shake ? (Math.random() - .5) * shake * 10 * dpr : 0, sy = shake ? (Math.random() - .5) * shake * 10 * dpr : 0;
    c.translate(sx, sy);
    rr(c, 0, 0, s * W, s * H, s * .22); c.save(); c.clip();
    c.fillStyle = lg(c, 0, 0, 0, s * H, [[0, '#3b2a9a'], [1, '#231a66']]); c.fillRect(0, 0, s * W, s * H);
    for (var cc = 0; cc < W; cc++) for (var r = 0; r < H; r++) {
      if ((cc + r) % 2) { c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(cc * s, r * s, s, s); }
    }
    var hintKey = {};
    if (hint) hint.forEach(function (q) { hintKey[q[0] * 10 + q[1]] = 1; });
    var order = [];
    for (id in views) order.push(views[id]);
    order.sort(function (a, b) { return a.y - b.y; });
    for (i = 0; i < order.length; i++) {
      v = order[i];
      if (v.delay > 0) continue;
      var sc = 1, sqx = 1, sqy = 1;
      if (v.sq) { sqx = 1 + .14 * v.sq; sqy = 1 - .14 * v.sq; }
      if (v.pop) sc = 1 + .5 * Math.sin(v.pop * Math.PI);
      if (hint && Math.abs(v.y - v.row) < .01 && hintKey[v.col * 10 + v.row]) sc *= 1 + .07 * Math.sin(tm * 8);
      var ox = v.sh ? Math.sin(v.sh * 30) * v.sh * .08 : 0;
      c.save(); c.translate((v.col + .5 + ox) * s, (v.y + .5) * s + (1 - sqy) * s * .45); c.scale(sc * sqx, sc * sqy);
      drawTile(c, v.k, 0, 0, s, v.hp, v.max, tm);
      c.restore();
    }
    for (i = 0; i < dying.length; i++) {
      var d = dying[i]; v = d.v;
      var t = Math.max(0, d.t), k2 = t / .24;
      var scl = k2 < .3 ? 1 + k2 * .9 : Math.max(0, 1.27 * (1 - (k2 - .3) / .7));
      c.save(); c.globalAlpha = d.t < 0 ? 1 : Math.max(0, 1 - k2 * k2); c.translate((v.col + .5) * s, (v.y + .5) * s); c.scale(scl, scl);
      drawTile(c, v.k, 0, 0, s, v.hp || 1, v.max || 1, tm);
      c.restore();
    }
    for (i = 0; i < fxs.length; i++) {
      var f = fxs[i], q = f.t / .5;
      c.save(); c.globalAlpha = 1 - q;
      if (f.type === 'ring') {
        var rad = (.6 + q * 2.2) * s; c.lineWidth = s * .22 * (1 - q); c.strokeStyle = '#fff3a0';
        c.beginPath(); c.arc(f.x * s, f.y * s, rad, 0, 6.3); c.stroke();
        c.fillStyle = 'rgba(255,170,40,.5)'; c.beginPath(); c.arc(f.x * s, f.y * s, rad * .8, 0, 6.3); c.fill();
      } else {
        c.fillStyle = lg(c, 0, f.y * s - s * .5, 0, f.y * s + s * .5, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,240,150,.95)'], [1, 'rgba(255,255,255,0)']]);
        c.fillRect(0, f.y * s - s * .5 * (1 - q * .4), s * W, s * (1 - q * .4));
      }
      c.restore();
    }
    for (i = 0; i < parts.length; i++) {
      var p = parts[i];
      c.save(); c.globalAlpha = Math.min(1, p.life / .3); c.translate(p.x * s, p.y * s); c.rotate(p.rot); c.fillStyle = p.c;
      var pr = p.r * s;
      if (p.star) { c.beginPath(); c.moveTo(0, -pr * 1.6); c.lineTo(pr * .4, 0); c.lineTo(0, pr * 1.6); c.lineTo(-pr * .4, 0); c.closePath(); c.fill(); c.rotate(1.57); c.fill(); }
      else { rr(c, -pr, -pr, pr * 2, pr * 2, pr * .4); c.fill(); }
      c.restore();
    }
    c.restore();
    c.setTransform(1, 0, 0, 1, 0, 0);
  }

  function resize() { layout(); }
  window.addEventListener('resize', resize);

  $('rbFs').addEventListener('click', function () {
    var on = document.body.classList.toggle('rb-full');
    $('rbFs').textContent = on ? '✕' : '⛶ ملء الشاشة';
    setTimeout(resize, 50);
  });
  $('rbRestart').addEventListener('click', function () { startLevel(true); });
  $('rbRetry').addEventListener('click', function () { startLevel(st.state === 'lose'); });
  $('rbMute').addEventListener('click', function () {
    muted = !muted; $('rbMute').textContent = muted ? '🔇' : '🔊';
    try { localStorage.setItem('rb_mute', muted ? '1' : '0'); } catch (e) {}
  });
  $('rbMute').textContent = muted ? '🔇' : '🔊';

  layout();
  startLevel(false);
  requestAnimationFrame(function (t) { last = t; frame(t); });
  if (window.ResizeObserver) new ResizeObserver(resize).observe($('rbArea'));
})();
