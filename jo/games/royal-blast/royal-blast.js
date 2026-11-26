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

  function poly(c, pts) { c.beginPath(); for (var i = 0; i < pts.length; i++) c[i ? 'lineTo' : 'moveTo'](pts[i][0], pts[i][1]); c.closePath(); }
  function starPath(c, cx, cy, R, r, rot) {
    c.beginPath();
    for (var i = 0; i < 10; i++) { var a = rot + i * Math.PI / 5, q = i % 2 ? r : R; c[i ? 'lineTo' : 'moveTo'](cx + Math.sin(a) * q, cy - Math.cos(a) * q); }
    c.closePath();
  }
  function card(c, k, x, y, s) {
    var r = s * .2, th = s * .1, h = s - th, m = s * .045;
    c.save();
    c.shadowColor = 'rgba(20,8,0,.55)'; c.shadowBlur = s * .14; c.shadowOffsetY = s * .1;
    rr(c, x, y + th * .5, s, h + th * .5, r); c.fillStyle = '#8d99bd'; c.fill();
    c.restore();
    rr(c, x, y + th * .5, s, h + th * .5, r); c.fillStyle = lg(c, x, y + th, x, y + s, [[0, '#cfd6ea'], [1, '#8d99bd']]); c.fill();
    rr(c, x, y, s, h, r); c.fillStyle = lg(c, x, y, x, y + h, [[0, '#ffffff'], [.55, '#f3f5fb'], [1, '#d9deee']]); c.fill();
    c.save(); rr(c, x, y, s, h, r); c.clip();
    var tg = c.createRadialGradient(x + s * .5, y + h * .55, s * .08, x + s * .5, y + h * .55, s * .7);
    tg.addColorStop(0, 'rgba(255,255,255,0)'); tg.addColorStop(1, PAL[k][0] + '44');
    c.fillStyle = tg; c.fillRect(x, y, s, h);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x, y, s, h * .08);
    c.restore();
    rr(c, x + m, y + m, s - 2 * m, h - 2 * m, r * .8); c.lineWidth = s * .02; c.strokeStyle = 'rgba(120,132,170,.35)'; c.stroke();
    rr(c, x + s * .012, y + s * .012, s - s * .024, h - s * .024, r * .95); c.lineWidth = s * .024; c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke();
  }

  function gem(c) {
    var T = [[-.22, -.36], [.22, -.36], [.43, -.13], [0, .43], [-.43, -.13]];
    poly(c, T); c.fillStyle = '#b30f29'; c.fill();
    c.save(); poly(c, T); c.clip();
    c.fillStyle = '#ffa0ab'; poly(c, [[-.22, -.36], [.22, -.36], [.13, -.13], [-.13, -.13]]); c.fill();
    c.fillStyle = '#ff5468'; poly(c, [[-.22, -.36], [-.13, -.13], [-.43, -.13]]); c.fill();
    c.fillStyle = '#e41f3d'; poly(c, [[.22, -.36], [.43, -.13], [.13, -.13]]); c.fill();
    c.fillStyle = '#f0304c'; poly(c, [[-.43, -.13], [-.13, -.13], [0, .43]]); c.fill();
    c.fillStyle = '#c8102e'; poly(c, [[-.13, -.13], [.13, -.13], [0, .43]]); c.fill();
    c.fillStyle = '#8f0b1f'; poly(c, [[.43, -.13], [.13, -.13], [0, .43]]); c.fill();
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = .016;
    c.beginPath(); c.moveTo(-.43, -.13); c.lineTo(.43, -.13); c.moveTo(-.22, -.36); c.lineTo(-.13, -.13); c.moveTo(.22, -.36); c.lineTo(.13, -.13); c.moveTo(-.13, -.13); c.lineTo(0, .43); c.moveTo(.13, -.13); c.lineTo(0, .43); c.stroke();
    poly(c, T); c.lineWidth = .05; c.strokeStyle = '#6e0618'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.92)'; poly(c, [[-.17, -.31], [-.06, -.31], [-.1, -.21], [-.2, -.2]]); c.fill();
    c.beginPath(); c.arc(-.3, -.12, .028, 0, 6.3); c.fill();
  }

  function heart(c) {
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(-.2, -.1, -.3, -.31, -.13, -.39);
    c.bezierCurveTo(-.05, -.43, 0, -.37, 0, -.31);
    c.bezierCurveTo(0, -.37, .05, -.43, .13, -.39);
    c.bezierCurveTo(.3, -.31, .2, -.1, 0, 0);
    c.closePath();
  }
  function clover(c) {
    c.lineCap = 'round';
    c.strokeStyle = '#0e5a20'; c.lineWidth = .1; c.beginPath(); c.moveTo(.02, .08); c.quadraticCurveTo(.08, .3, .22, .43); c.stroke();
    c.strokeStyle = '#2fbf4e'; c.lineWidth = .05; c.beginPath(); c.moveTo(.02, .08); c.quadraticCurveTo(.08, .3, .22, .43); c.stroke();
    for (var i = 0; i < 3; i++) {
      c.save(); c.translate(0, .06); c.rotate(i * 2.0944); c.scale(1.02, 1.02);
      heart(c); c.fillStyle = lg(c, 0, -.42, 0, 0, [[0, '#a2f58f'], [.5, '#33c04c'], [1, '#157a2c']]); c.fill();
      c.lineWidth = .045; c.strokeStyle = '#0b5a20'; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = .028; c.beginPath(); c.moveTo(0, -.03); c.lineTo(0, -.27); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-.12, -.3, .055, .03, -.7, 0, 6.3); c.fill();
      c.restore();
    }
    c.fillStyle = '#157a2c'; c.beginPath(); c.arc(0, .06, .035, 0, 6.3); c.fill();
  }

  function helmet(c) {
    c.beginPath(); c.moveTo(-.42, .2); c.bezierCurveTo(-.46, -.2, -.26, -.42, 0, -.42); c.bezierCurveTo(.26, -.42, .46, -.2, .42, .2); c.closePath();
    c.fillStyle = lg(c, -.42, 0, .42, 0, [[0, '#e8a400'], [.3, '#ffe58a'], [.55, '#ffc21a'], [1, '#b86e00']]); c.fill();
    c.lineWidth = .05; c.lineJoin = 'round'; c.strokeStyle = '#7a4500'; c.stroke();
    c.strokeStyle = 'rgba(255,248,200,.75)'; c.lineWidth = .035; c.beginPath(); c.moveTo(0, -.4); c.quadraticCurveTo(.05, -.15, 0, .14); c.stroke();
    c.strokeStyle = 'rgba(122,69,0,.35)'; c.lineWidth = .025; c.beginPath(); c.moveTo(-.2, -.36); c.quadraticCurveTo(-.3, -.1, -.28, .14); c.moveTo(.2, -.36); c.quadraticCurveTo(.3, -.1, .28, .14); c.stroke();
    rr(c, -.46, .12, .92, .22, .07); c.fillStyle = lg(c, 0, .12, 0, .34, [[0, '#fff0a0'], [.45, '#ffc21a'], [1, '#c77700']]); c.fill();
    c.lineWidth = .05; c.strokeStyle = '#7a4500'; c.stroke();
    c.fillStyle = '#8a5200';
    [-.34, .34].forEach(function (x) { c.beginPath(); c.arc(x, .23, .028, 0, 6.3); c.fill(); });
    c.beginPath(); c.arc(0, .23, .075, 0, 6.3); c.fillStyle = lg(c, -.05, .16, .05, .3, [[0, '#ff7b88'], [1, '#c8102e']]); c.fill();
    c.lineWidth = .025; c.strokeStyle = '#7a0f20'; c.stroke();
    c.fillStyle = '#ffd23a'; c.beginPath(); c.arc(0, -.44, .06, 0, 6.3); c.fill(); c.lineWidth = .03; c.strokeStyle = '#7a4500'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(-.2, -.18, .07, .035, -1, 0, 6.3); c.fill();
  }

  function shield(c) {
    function path(sc) {
      c.beginPath(); c.moveTo(-.38 * sc, -.36 * sc); c.quadraticCurveTo(0, -.25 * sc, .38 * sc, -.36 * sc); c.lineTo(.38 * sc, .02 * sc);
      c.bezierCurveTo(.38 * sc, .26 * sc, .16 * sc, .38 * sc, 0, .46 * sc); c.bezierCurveTo(-.16 * sc, .38 * sc, -.38 * sc, .26 * sc, -.38 * sc, .02 * sc); c.closePath();
    }
    path(1); c.fillStyle = lg(c, -.4, 0, .4, 0, [[0, '#e8a400'], [.3, '#fff0a0'], [.6, '#ffc21a'], [1, '#b86e00']]); c.fill();
    c.lineWidth = .05; c.lineJoin = 'round'; c.strokeStyle = '#7a4500'; c.stroke();
    path(.8); c.fillStyle = lg(c, 0, -.3, 0, .38, [[0, '#6fc2ff'], [.5, '#2c7be8'], [1, '#12449a']]); c.fill();
    c.lineWidth = .03; c.strokeStyle = '#0c2f70'; c.stroke();
    c.save(); path(.8); c.clip(); c.fillStyle = 'rgba(255,255,255,.2)'; poly(c, [[-.4, -.4], [0, -.4], [-.1, .5], [-.4, .5]]); c.fill(); c.restore();
    starPath(c, 0, -.02, .17, .075, 0); c.fillStyle = lg(c, 0, -.2, 0, .14, [[0, '#fffbe0'], [1, '#ffcf3a']]); c.fill();
    c.lineWidth = .025; c.strokeStyle = '#9a5a00'; c.stroke();
  }

  function starIcon(c) {
    var R = .45, r = .2, cy = .03, i, a1, a2, a0;
    function pt(a, q) { return [Math.sin(a) * q, cy - Math.cos(a) * q]; }
    starPath(c, 0, cy, R, r, 0); c.fillStyle = '#5a2398'; c.fill();
    var cols = [['#e9c6ff', '#b46cf0'], ['#c88bff', '#7c2fd0']];
    for (i = 0; i < 5; i++) {
      a0 = i * Math.PI * 2 / 5; a1 = a0 - Math.PI / 5; a2 = a0 + Math.PI / 5;
      var tip = pt(a0, R), l = pt(a1, r), rt = pt(a2, r);
      poly(c, [tip, l, [0, cy]]); c.fillStyle = cols[0][1]; c.fill();
      poly(c, [tip, rt, [0, cy]]); c.fillStyle = '#7a2cc8'; c.fill();
      if (i === 0) { poly(c, [tip, l, [0, cy]]); c.fillStyle = cols[0][0]; c.fill(); }
    }
    starPath(c, 0, cy, R, r, 0); c.lineWidth = .06; c.lineJoin = 'round'; c.strokeStyle = '#3d1470'; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = .015; c.beginPath();
    for (i = 0; i < 5; i++) { var q = pt(i * Math.PI * 2 / 5, R); c.moveTo(0, cy); c.lineTo(q[0], q[1]); }
    c.stroke();
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(-.1, -.2, .05, .028, -.9, 0, 6.3); c.fill();
    c.beginPath(); c.arc(.2, .02, .022, 0, 6.3); c.fill();
  }

  function icon(c, k, cx, cy, s) {
    var d = Math.ceil(s * 1.5), t = document.createElement('canvas'); t.width = t.height = d;
    var tc = t.getContext('2d');
    tc.translate(d / 2, d / 2); tc.scale(s, s); tc.lineJoin = 'round'; tc.lineCap = 'round';
    [gem, clover, helmet, shield, starIcon][k](tc);
    tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-atop';
    var hl = tc.createRadialGradient(d / 2 - s * .17, d / 2 - s * .2, s * .01, d / 2 - s * .1, d / 2 - s * .1, s * .55);
    hl.addColorStop(0, 'rgba(255,255,255,.6)'); hl.addColorStop(.5, 'rgba(255,255,255,.12)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
    tc.fillStyle = hl; tc.fillRect(0, 0, d, d);
    var sh = tc.createLinearGradient(0, d / 2 - s * .1, 0, d / 2 + s * .46);
    sh.addColorStop(0, 'rgba(40,0,20,0)'); sh.addColorStop(1, 'rgba(40,0,20,.34)');
    tc.fillStyle = sh; tc.fillRect(0, 0, d, d);
    c.save();
    c.shadowColor = 'rgba(30,10,0,.45)'; c.shadowBlur = s * .07; c.shadowOffsetY = s * .055;
    c.drawImage(t, cx - d / 2, cy - d / 2);
    c.restore();
  }

  function rock(c, cx, cy, s, hp, max) {
    c.save(); c.translate(cx, cy); c.scale(s, s); c.lineJoin = 'round';
    var pts = [[-.4, -.14], [-.28, -.34], [-.02, -.42], [.26, -.34], [.41, -.1], [.38, .2], [.2, .4], [-.12, .42], [-.36, .3]];
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = .05; c.shadowOffsetY = .03;
    poly(c, pts); c.fillStyle = '#555d70'; c.fill(); c.restore();
    var tough = max === 2 && hp === 2;
    poly(c, pts);
    var rg = c.createRadialGradient(-.12, -.2, .02, 0, 0, .55); if (tough) { rg.addColorStop(0, '#c9d6f2'); rg.addColorStop(.5, '#7f90b8'); rg.addColorStop(1, '#303c5c'); } else { rg.addColorStop(0, '#ffffff'); rg.addColorStop(.35, '#d4d9e4'); rg.addColorStop(.75, '#9aa3b6'); rg.addColorStop(1, '#5f687c'); } c.fillStyle = rg;
    c.fill(); c.lineWidth = .05; c.strokeStyle = tough ? '#1f2740' : '#454d5e'; c.stroke();
    c.save(); poly(c, pts); c.clip();
    c.fillStyle = 'rgba(255,255,255,.4)'; poly(c, [[-.4, -.14], [-.28, -.34], [-.02, -.42], [-.08, -.2], [-.3, -.04]]); c.fill();
    c.fillStyle = 'rgba(0,0,0,.14)'; poly(c, [[.1, .1], [.41, .02], [.38, .2], [.2, .4], [-.12, .42], [-.06, .2]]); c.fill();
    c.strokeStyle = 'rgba(40,48,66,.28)'; c.lineWidth = .022; c.beginPath(); c.moveTo(-.2, -.3); c.lineTo(-.06, -.12); c.lineTo(.12, -.14); c.lineTo(.3, -.28); c.moveTo(-.06, -.12); c.lineTo(-.14, .1); c.lineTo(-.3, .22); c.moveTo(.12, -.14); c.lineTo(.18, .12); c.stroke();
    c.restore();
    if (tough) {
      c.fillStyle = '#d8e2ff';
      [[-.26, -.2], [.26, -.2], [-.24, .24], [.22, .26]].forEach(function (q) { c.beginPath(); c.arc(q[0], q[1], .04, 0, 6.3); c.fill(); });
    }
    if (max === 2 && hp === 1) {
      c.strokeStyle = '#2d3445'; c.lineWidth = .045; c.beginPath(); c.moveTo(-.05, -.4); c.lineTo(.04, -.15); c.lineTo(-.08, .02); c.lineTo(.06, .22); c.lineTo(0, .4); c.stroke();
      c.beginPath(); c.moveTo(.04, -.15); c.lineTo(.24, -.08); c.stroke();
    } else if (max === 1) {
      c.strokeStyle = 'rgba(45,52,69,.45)'; c.lineWidth = .028; c.beginPath(); c.moveTo(.08, -.3); c.lineTo(.0, -.1); c.lineTo(.12, .06); c.stroke();
    }
    c.restore();
  }

  function bomb(c, pu) {
    c.beginPath(); c.arc(0, .08, .3, 0, 6.3);
    var g = c.createRadialGradient(-.1, -.06, .02, 0, .08, .34); g.addColorStop(0, '#8a90ad'); g.addColorStop(.4, '#2e3250'); g.addColorStop(1, '#0a0b16');
    c.fillStyle = g; c.fill(); c.lineWidth = .04; c.strokeStyle = '#05060d'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(-.12, -.04, .07, .045, -.7, 0, 6.3); c.fill();
    rr(c, -.1, -.3, .2, .1, .03); c.fillStyle = lg(c, 0, -.3, 0, -.2, [[0, '#cfd3e4'], [1, '#6b718c']]); c.fill(); c.lineWidth = .03; c.strokeStyle = '#05060d'; c.stroke();
    c.strokeStyle = '#8a5a2a'; c.lineWidth = .045; c.beginPath(); c.moveTo(0, -.3); c.quadraticCurveTo(.02, -.42, .14, -.44); c.stroke();
    var sg = c.createRadialGradient(.16, -.45, 0, .16, -.45, .16 + .04 * pu); sg.addColorStop(0, '#fff'); sg.addColorStop(.35, '#ffe45a'); sg.addColorStop(1, 'rgba(255,90,0,0)');
    c.fillStyle = sg; c.beginPath(); c.arc(.16, -.45, .17 + .04 * pu, 0, 6.3); c.fill();
    starPath(c, .16, -.45, .11 + .03 * pu, .04, pu); c.fillStyle = '#fff6a8'; c.fill();
  }
  function rocket(c, pu) {
    c.rotate(Math.PI / 4);
    var fl = c.createLinearGradient(0, .26, 0, .5 + .05 * pu); fl.addColorStop(0, '#fff6a8'); fl.addColorStop(.4, '#ffb01f'); fl.addColorStop(1, 'rgba(255,70,0,0)');
    c.fillStyle = fl; c.beginPath(); c.moveTo(-.09, .26); c.quadraticCurveTo(0, .55 + .06 * pu, .09, .26); c.closePath(); c.fill();
    c.fillStyle = lg(c, -.3, 0, .3, 0, [[0, '#a80d28'], [1, '#e8344f']]);
    poly(c, [[-.12, .02], [-.3, .3], [-.12, .24]]); c.fill(); poly(c, [[.12, .02], [.3, .3], [.12, .24]]); c.fill();
    c.lineWidth = .035; c.strokeStyle = '#5e0415'; poly(c, [[-.12, .02], [-.3, .3], [-.12, .24]]); c.stroke(); poly(c, [[.12, .02], [.3, .3], [.12, .24]]); c.stroke();
    c.beginPath(); c.moveTo(0, -.46); c.bezierCurveTo(.2, -.3, .17, .0, .15, .26); c.lineTo(-.15, .26); c.bezierCurveTo(-.17, .0, -.2, -.3, 0, -.46); c.closePath();
    c.fillStyle = lg(c, -.18, 0, .18, 0, [[0, '#cdd3e8'], [.35, '#ffffff'], [1, '#aab2cf']]); c.fill(); c.lineWidth = .045; c.strokeStyle = '#4a5070'; c.stroke();
    c.save(); c.clip();
    c.fillStyle = lg(c, 0, -.46, 0, -.2, [[0, '#ff6a80'], [1, '#c8102e']]); c.fillRect(-.3, -.5, .6, .3);
    c.fillStyle = '#c8102e'; c.fillRect(-.3, .16, .6, .1);
    c.restore();
    c.beginPath(); c.arc(0, -.06, .085, 0, 6.3); c.fillStyle = lg(c, 0, -.15, 0, .03, [[0, '#9fe3ff'], [1, '#2a7ee0']]); c.fill(); c.lineWidth = .035; c.strokeStyle = '#3b4468'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(-.03, -.09, .022, 0, 6.3); c.fill();
  }

  function special(c, k, cx, cy, s, tm) {
    var pu = .5 + .5 * Math.sin(tm * 6);
    c.save(); c.translate(cx, cy);
    var g = c.createRadialGradient(0, 0, 0, 0, 0, s * .62);
    g.addColorStop(0, 'rgba(255,240,150,' + (.75 + .2 * pu) + ')'); g.addColorStop(1, 'rgba(255,200,60,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, s * .62, 0, 6.3); c.fill();
    c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = s * .05; c.shadowOffsetY = s * .035;
    c.scale(s * .98, s * .98); c.lineJoin = 'round'; c.lineCap = 'round';
    if (k === BOMB) bomb(c, pu); else rocket(c, pu);
    c.restore();
  }

  function drawTile(c, k, cx, cy, s, hp, max, tm) {
    if (k < 5) { var is = s * .9; card(c, k, cx - is / 2, cy - is / 2 - is * .03, is); icon(c, k, cx, cy - is * .04, is * 1.04); }
    else if (k === ROCK) rock(c, cx, cy, s * .92, hp, max);
    else special(c, k, cx, cy, s * .92, tm);
  }

  var sprites = {}, amb = [], texts = [], hoverKey = null, SP = 40, PADS = 10;
  for (var ai = 0; ai < 16; ai++) amb.push({ x: Math.random(), y: Math.random(), ph: Math.random() * 6.3, sp: 1 + Math.random() * 2, z: .5 + Math.random() });

  function layout() {
    var area = $('rbArea');
    var aw = area.clientWidth - 30, ah = area.clientHeight - 26;
    cs = Math.max(28, Math.floor(Math.min(aw / W, ah / H)));
    dpr = Math.min(2.5, window.devicePixelRatio || 1);
    canvas.style.width = cs * W + 'px'; canvas.style.height = cs * H + 'px';
    canvas.width = Math.round(cs * W * dpr); canvas.height = Math.round(cs * H * dpr);
    sprites = {}; SP = Math.round(cs * dpr); PADS = Math.ceil(SP * .3);
  }
  function sprite(k, hp, max) {
    var key = k === ROCK ? '5_' + hp + '_' + max : String(k), sp = sprites[key];
    if (sp) return sp;
    var d = SP + PADS * 2; sp = document.createElement('canvas'); sp.width = sp.height = d;
    drawTile(sp.getContext('2d'), k, d / 2, d / 2, SP, hp, max, 0);
    return (sprites[key] = sp);
  }
  function spr(c, k, hp, max) { var sp = sprite(k, hp || 1, max || 1); c.drawImage(sp, -sp.width / 2, -sp.height / 2); }

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
  function sTick(i) { tone(520 + Math.min(i, 12) * 70, .07, 'sine', .045); }
  function sBoom() { tone(160, .45, 'sawtooth', .16, 40); tone(90, .5, 'square', .1, 30); }
  function sWhoosh() { tone(300, .4, 'sawtooth', .08, 1400); tone(700, .3, 'triangle', .06, 200); }
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
  function frameFx(cls) {
    var f = canvas.parentNode; f.classList.remove('shk1', 'shk2'); void f.offsetWidth; f.classList.add(cls);
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
      if (!v) { v = views[t.id] = { id: t.id, col: c, y: t.from, vy: 0, sq: 0, sh: 0, pop: 0, born: 0, bn: 0, wait: 0, delay: (st.intro ? c * .05 + (H - 1 - r) * .012 : 0) }; }
      v.col = c; v.k = t.k; v.hp = t.hp; v.max = t.max || t.hp; v.row = t.row;
    }
    for (id in views) if (!live[id]) delete views[id];
  }

  function burst(x, y, k, n, mode) {
    var P = mode === 'rock' ? ['#d5dae4', '#8a93a6', '#5b6477'] : mode === 'gold' ? ['#fff3a0', '#ffc83d', '#ffffff'] : [PAL[k][0], PAL[k][1], '#ffffff'];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.3, sp = 2.5 + Math.random() * 6;
      var type = mode === 'rock' ? (i % 2 ? 'chunk' : 'sq') : (i % 3 === 0 ? 'star' : 'sq');
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3, life: .5 + Math.random() * .45, c: P[i % 3], r: (mode === 'rock' ? .1 : .06) + Math.random() * .08, rot: Math.random() * 6, vr: Math.random() * 14 - 7, type: type });
    }
  }
  function ring(x, y, col, big, delay) { fxs.push({ type: 'pring', x: x, y: y, t: -(delay || 0), dur: big ? .55 : .38, col: col, big: big }); }

  function startFx(f) {
    if (f.type === 'bomb') {
      sBoom(); frameFx('shk2'); dragonFire(1100); king('cheer', 900);
      for (var i = 0; i < 24; i++) { var a = Math.random() * 6.3, sp = 7 + Math.random() * 12; parts.push({ x: f.x, y: f.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: .3 + Math.random() * .3, c: i % 2 ? '#ffd23a' : '#fff3a0', r: .05, rot: a, vr: 0, type: 'streak' }); }
      for (i = 0; i < 8; i++) { var b = Math.random() * 6.3; parts.push({ x: f.x, y: f.y, vx: Math.cos(b) * 2.5, vy: Math.sin(b) * 2.5 - 1, life: .6 + Math.random() * .3, c: 'rgba(90,70,110,.55)', r: .22 + Math.random() * .12, rot: 0, vr: 0, type: 'smoke' }); }
    } else if (f.type === 'rocket') {
      sWhoosh(); sBoom(); frameFx('shk1'); dragonFire(1100); king('cheer', 900);
    }
  }

  function startLevel(retry) {
    if (retry) attempt++; else attempt = 0;
    st = Core.make(level, attempt); st.intro = true;
    views = {}; dying = []; parts = []; fxs = []; texts = []; pendingEnd = false; hint = null; idleT = 0; hoverKey = null;
    $('rbOverlay').hidden = true; $('rbConfetti').innerHTML = '';
    var fr = $('rbStage').querySelectorAll('canvas.rb-fly'); for (var i = 0; i < fr.length; i++) fr[i].remove();
    sync(); st.intro = false;
    buildGoals(); king('', 0);
    setTimeout(function () { combo('المستوى ' + level); }, 250);
    try { localStorage.setItem('rb_level', level); } catch (e) {}
  }

  function busy() {
    if (dying.length || pendingEnd) return true;
    for (var id in views) { var v = views[id]; if (v.delay > 0 || v.wait > 0 || v.vy !== 0 || v.y < v.row - .002) return true; }
    return false;
  }

  function flyGoals(ev) {
    var rc = canvas.getBoundingClientRect(), sr = stage.getBoundingClientRect(), cell = rc.width / W;
    st.goals.forEach(function (g, gi) {
      var items = [];
      ev.removed.forEach(function (e) { if (e.tile.k === g.k) items.push(e); });
      if (ev.made && ev.made.from.k === g.k) items.push({ c: ev.made.c, r: ev.made.r });
      ev.rocks.forEach(function (e) { if (e.dead && g.k === ROCK) items.push(e); });
      var rem = Math.max(0, g.need - (g.have - items.length)), cnt = Math.min(items.length, rem, 6);
      var src = $('rbG' + gi), gcv = src && src.firstChild; if (!gcv || !cnt) return;
      var gr = gcv.getBoundingClientRect(), sz = cell * .85;
      for (var j = 0; j < cnt; j++) {
        var it = items[j], el = document.createElement('canvas'); el.width = el.height = 96; el.className = 'rb-fly';
        el.getContext('2d').drawImage(gcv, 0, 0);
        el.style.cssText = 'position:absolute;z-index:30;pointer-events:none;opacity:0;left:0;top:0;width:' + sz + 'px;height:' + sz + 'px;filter:drop-shadow(0 3px 4px rgba(0,0,0,.4));';
        var x0 = rc.left - sr.left + (it.c + .5) * cell - sz / 2, y0 = rc.top - sr.top + (it.r + .5) * cell - sz / 2;
        var x1 = gr.left - sr.left + gr.width / 2 - sz / 2, y1 = gr.top - sr.top + gr.height / 2 - sz / 2;
        stage.appendChild(el);
        var an = el.animate([
          { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(1)', opacity: 1 },
          { transform: 'translate(' + (x0 + (x1 - x0) * .3) + 'px,' + (y0 - 36) + 'px) scale(1.3)', opacity: 1, offset: .3 },
          { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.5)', opacity: 1 }
        ], { duration: 620 + j * 50, delay: 220 + j * 70, easing: 'cubic-bezier(.5,0,.6,1)', fill: 'forwards' });
        an.onfinish = (function (e2, d) { return function () { e2.remove(); d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop'); tone(900, .08, 'sine', .05); }; })(el, src);
      }
    });
  }

  function handle(ev, c, r, gain) {
    var n = ev.size, hold = 0, bl = ev.blasts;
    function popDelay(e, how) {
      if (how === 'group') return Math.hypot(e.c - c, e.r - r) * (ev.made ? .012 : .035);
      var want = how === 'bomb' ? BOMB : ROCKET, bi = 0;
      for (var i = 0; i < bl.length; i++) {
        if (bl[i].k !== want) continue;
        if (want === BOMB ? (Math.abs(bl[i].c - e.c) <= 1 && Math.abs(bl[i].r - e.r) <= 1) : bl[i].r === e.r) { bi = i; break; }
      }
      var b = bl[bi] || { c: c, r: r };
      return .06 + bi * .14 + Math.hypot(e.c - b.c, e.r - b.r) * (want === BOMB ? .05 : .062);
    }
    ev.removed.forEach(function (e, idx) {
      var v = views[e.tile.id] || { col: e.c, y: e.r, k: e.tile.k, hp: 1, max: 1 };
      var d = { v: v, t: -popDelay(e, e.how), dur: ev.made && e.how === 'group' ? .2 : .26, i: idx, on: 0 };
      if (ev.made && e.how === 'group') d.fly = { c: c, r: r };
      dying.push(d); hold = Math.max(hold, -d.t + d.dur * .6);
    });
    if (ev.made) {
      var fv = views[ev.made.from.id];
      if (fv) { dying.push({ v: fv, t: 0, dur: .2, i: 99, on: 0 }); }
    }
    bl.forEach(function (b, bi) {
      var st0 = bi * .14 + .02;
      fxs.push({ type: b.k === BOMB ? 'bomb' : 'rocket', x: b.c + .5, y: b.r + .5, t: -st0, dur: b.k === BOMB ? .6 : .75 });
      for (var id in views) { var bv = views[id]; if (bv.col === b.c && bv.row === b.r && bv.k === b.k && !bv.gone) { bv.gone = 1; dying.push({ v: bv, t: -st0, dur: .2, i: 99, on: 0 }); } }
      hold = Math.max(hold, st0 + .35);
    });
    ev.rocks.forEach(function (e) {
      var v = views[e.tile.id], dl = bl.length ? popDelay(e, 'bomb') : Math.hypot(e.c - c, e.r - r) * .035;
      if (e.dead) { var d = { v: v || { col: e.c, y: e.r, k: ROCK, hp: 1, max: 1 }, t: -dl, dur: .3, i: 99, on: 0 }; dying.push(d); hold = Math.max(hold, dl + .15); }
      else if (v) { v.sh = 1; v.hp = e.tile.hp; burst(e.c + .5, e.r + .5, 0, 6, 'rock'); sRock(); }
    });
    if (!bl.length) sPop(n);
    var msg = n >= 9 ? 'أسطوري!' : n >= 7 ? 'مذهل!' : n >= 5 ? 'رائع!' : n >= 4 ? 'جميل!' : (bl.length ? 'بووم!' : '');
    if (msg) combo(msg);
    if (n >= 5 || bl.length) king('cheer', 900);
    if (n >= 4 && !bl.length) frameFx(n >= 7 ? 'shk2' : 'shk1');
    if (gain > 0) texts.push({ x: c + .5, y: r + .3, txt: '+' + gain, t: 0, big: gain >= 150 });
    flyGoals(ev);
    var shuffled = false;
    if (st.state === 'win') {
      var base = hold + .15, endAt = base;
      for (var cc = 0; cc < W; cc++) for (var rr2 = 0; rr2 < H; rr2++) {
        var t = st.g[cc][rr2];
        if (t && views[t.id]) { var dd = { v: views[t.id], t: -(base + cc * .04 + (H - rr2) * .025), dur: .3, i: 99, on: 0 }; dying.push(dd); endAt = Math.max(endAt, -dd.t + .3); }
      }
      pendingEnd = true;
      for (var id2 in views) delete views[id2];
      setTimeout(endGame, endAt * 1000 + 250);
    } else {
      shuffled = Core.settle(st);
      sync();
      for (var id in views) { var w = views[id]; if (w.y < w.row - .001 && !(w.delay > 0)) { w.wait = hold + w.col * .012; w.bn = 0; } }
      if (ev.made) { var mv = views[ev.made.tile.id]; if (mv) { mv.delay = .22; mv.pop = 1; mv.born = 1; ring(c + .5, r + .5, '#ffd84d', 1, .22); setTimeout(function () { burst(c + .5, r + .5, 0, 12, 'gold'); tone(880, .2, 'triangle', .1, 1500); }, 220); } }
      if (st.state === 'lose') { pendingEnd = true; setTimeout(endGame, hold * 1000 + 700); }
    }
    if (shuffled) combo('خلط القطع');
    updateHud();
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
    for (var i = 0; i < 70; i++) {
      var e = document.createElement('i');
      e.style.left = Math.random() * 100 + '%'; e.style.background = cols[i % cols.length];
      e.style.animationDuration = 1.6 + Math.random() * 1.6 + 's'; e.style.animationDelay = Math.random() * .5 + 's';
      box.appendChild(e);
    }
  }

  function cellAt(e) {
    var rc = canvas.getBoundingClientRect();
    var c = Math.floor((e.clientX - rc.left) / (rc.width / W)), r = Math.floor((e.clientY - rc.top) / (rc.height / H));
    return (c < 0 || r < 0 || c >= W || r >= H) ? null : [c, r];
  }
  canvas.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || !st || st.state !== 'play' || busy()) { hoverKey = null; return; }
    var p = cellAt(e); hoverKey = null; if (!p) return;
    var t = st.g[p[0]][p[1]]; if (!t || t.k > 4) return;
    var g = Core.group(st, p[0], p[1]); if (g.length < 2) return;
    hoverKey = {}; g.forEach(function (q) { hoverKey[q[0] * 10 + q[1]] = 1; });
  });
  canvas.addEventListener('pointerleave', function () { hoverKey = null; });
  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    audioOK();
    idleT = 0; hint = null; hoverKey = null;
    if (busy() || st.state !== 'play') return;
    var p = cellAt(e); if (!p) return;
    var c = p[0], r = p[1], t = st.g[c][r]; if (!t) return;
    var before = st.score;
    var ev = Core.applyTap(st, c, r);
    if (!ev) { var v = views[t.id]; if (v) v.sh = 1; tone(150, .1, 'square', .06); return; }
    handle(ev, c, r, st.score - before);
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

  function dieFx(d) {
    var v = d.v, x = v.col + .5, y = v.y + .5, k = v.k;
    if (d.fly) { burst(x, y, k, 2); return; }
    if (k === ROCK) { burst(x, y, 0, 12, 'rock'); ring(x, y, '#cfd5e2', 0); sRock(); frameFx('shk1'); }
    else if (k < 5) { burst(x, y, k, 7); ring(x, y, PAL[k][0], 0); if (d.i < 10) sTick(d.i); }
    else burst(x, y, 0, 8, 'gold');
  }

  function frame(ts) {
    var dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    var tm = ts / 1000, id, v, i;
    for (id in views) {
      v = views[id];
      if (v.delay > 0) { v.delay -= dt; continue; }
      if (v.wait > 0) v.wait -= dt;
      else if (v.y < v.row || v.vy < 0) {
        v.vy += 48 * dt; v.y += v.vy * dt;
        if (v.y >= v.row && v.vy > 0) {
          v.y = v.row;
          if (v.vy > 8 && !v.bn) { v.vy = -v.vy * .2; v.bn = 1; v.sq = 1; }
          else { v.vy = 0; if (v.bn) v.sq = Math.max(v.sq, .45); v.bn = 0; }
        }
      }
      if (v.sq > 0) v.sq = Math.max(0, v.sq - dt * 4.5);
      if (v.sh > 0) v.sh = Math.max(0, v.sh - dt * 3);
      if (v.pop > 0) v.pop = Math.max(0, v.pop - dt * 2.2);
    }
    for (i = dying.length - 1; i >= 0; i--) {
      var d = dying[i]; d.t += dt;
      if (d.t >= 0 && !d.on) { d.on = 1; dieFx(d); }
      if (d.t > d.dur) dying.splice(i, 1);
    }
    for (i = parts.length - 1; i >= 0; i--) {
      var p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; }
      if (p.type === 'streak') { p.vx *= .9; p.vy *= .9; }
      else if (p.type === 'smoke') { p.r += dt * .4; p.vx *= .96; p.vy *= .96; }
      else if (p.type !== 'dot') p.vy += 16 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (i = fxs.length - 1; i >= 0; i--) {
      var f = fxs[i]; f.t += dt;
      if (f.t >= 0 && !f.on) { f.on = 1; startFx(f); }
      if (f.on && f.type === 'rocket' && f.t < .6) {
        for (var dr = -1; dr <= 1; dr += 2) {
          var rx = f.x + dr * 16 * f.t;
          parts.push({ x: rx - dr * .35, y: f.y + (Math.random() - .5) * .2, vx: -dr * 1.5, vy: (Math.random() - .5) * 2, life: .28, c: Math.random() < .5 ? '#ffb21a' : '#fff3a0', r: .09, rot: 0, vr: 0, type: 'dot' });
        }
      }
      if (f.t > f.dur) fxs.splice(i, 1);
    }
    for (i = texts.length - 1; i >= 0; i--) { texts[i].t += dt; if (texts[i].t > .9) texts.splice(i, 1); }
    if (st && st.state === 'play' && !busy()) { idleT += dt; if (idleT > 5 && !hint) hint = findHint(); }
    draw(tm);
    requestAnimationFrame(frame);
  }

  function eob(u) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); }

  function draw(tm) {
    var s = cs * dpr, c = ctx, id, v, i;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    rr(c, 0, 0, s * W, s * H, s * .22); c.save(); c.clip();
    c.fillStyle = lg(c, 0, 0, 0, s * H, [[0, '#5a3516'], [1, '#2e180a']]); c.fillRect(0, 0, s * W, s * H);
    for (var cc = 0; cc < W; cc++) for (var r = 0; r < H; r++) {
      if ((cc + r) % 2) { c.fillStyle = 'rgba(0,0,0,.14)'; c.fillRect(cc * s, r * s, s, s); }
    }
    for (i = 0; i < amb.length; i++) {
      var am = amb[i], al = .5 + .5 * Math.sin(tm * am.sp + am.ph), ay = ((am.y - tm * .012 * am.z) % 1 + 1) % 1;
      c.globalAlpha = al * .45; c.fillStyle = '#fff'; var ar = s * .03 * am.z * (.6 + al);
      c.beginPath(); c.moveTo(am.x * s * W, ay * s * H - ar * 2.4); c.lineTo(am.x * s * W + ar * .6, ay * s * H); c.lineTo(am.x * s * W, ay * s * H + ar * 2.4); c.lineTo(am.x * s * W - ar * .6, ay * s * H); c.closePath(); c.fill();
    }
    c.globalAlpha = 1;
    var hintKey = {};
    if (hint) hint.forEach(function (q) { hintKey[q[0] * 10 + q[1]] = 1; });
    var order = [];
    for (id in views) order.push(views[id]);
    order.sort(function (a, b) { return a.y - b.y; });
    for (i = 0; i < order.length; i++) {
      v = order[i];
      if (v.delay > 0) continue;
      var sc = 1, sqx = 1, sqy = 1, settled = Math.abs(v.y - v.row) < .01, key = v.col * 10 + v.row, hov = settled && hoverKey && hoverKey[key];
      if (v.sq) { sqx = 1 + .16 * v.sq; sqy = 1 - .16 * v.sq; }
      if (v.born) sc = eob(1 - v.pop);
      if (hov) sc *= 1.07;
      if (hint && settled && hintKey[key]) sc *= 1 + .07 * Math.sin(tm * 8);
      if (v.k > 5) sc *= 1 + .05 * Math.sin(tm * 6 + v.id);
      var ox = v.sh ? Math.sin(v.sh * 30) * v.sh * .08 : 0;
      c.save(); c.translate((v.col + .5 + ox) * s, (v.y + .5) * s + (1 - sqy) * s * .45); c.scale(sc * sqx, sc * sqy);
      spr(c, v.k, v.hp, v.max);
      if (hov) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = .22; spr(c, v.k, v.hp, v.max); }
      c.restore();
    }
    for (i = 0; i < dying.length; i++) {
      var d = dying[i], dv = d.v, t = d.t, scl = 1, a2 = 1, px = dv.col + .5, py = dv.y + .5, rot = 0, fl = 0;
      if (t > 0) {
        var q = t / d.dur;
        if (d.fly) { var e = q * q; px = dv.col + (d.fly.c - dv.col) * e + .5; py = dv.y + (d.fly.r - dv.y) * e + .5; scl = 1 - .4 * q; a2 = 1 - q * q * .6; }
        else if (q < .3) { scl = 1 + q / .3 * .24; fl = q / .3; }
        else { var u = (q - .3) / .7; scl = 1.24 * (1 - u * u); a2 = 1 - u * u * .4; rot = u * .6; fl = 1 - u; }
      }
      if (scl <= 0) continue;
      c.save(); c.globalAlpha = a2; c.translate(px * s, py * s); c.rotate(rot); c.scale(scl, scl);
      spr(c, dv.k, dv.hp, dv.max);
      if (fl > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = fl * .75; spr(c, dv.k, dv.hp, dv.max); }
      c.restore();
    }
    c.globalCompositeOperation = 'lighter';
    for (i = 0; i < fxs.length; i++) {
      var f = fxs[i]; if (f.t < 0) continue;
      var fq = f.t / f.dur;
      c.save(); c.globalAlpha = 1 - fq;
      if (f.type === 'pring') {
        c.lineWidth = s * (f.big ? .2 : .1) * (1 - fq); c.strokeStyle = f.col; c.beginPath(); c.arc(f.x * s, f.y * s, s * ((f.big ? .5 : .3) + fq * (f.big ? 1.6 : .9)), 0, 6.3); c.stroke();
      } else if (f.type === 'bomb') {
        var R = s * (.5 + fq * 2.6), g1 = c.createRadialGradient(f.x * s, f.y * s, 0, f.x * s, f.y * s, R);
        g1.addColorStop(0, 'rgba(255,255,255,' + (1 - fq) + ')'); g1.addColorStop(.35, 'rgba(255,190,60,.85)'); g1.addColorStop(1, 'rgba(255,90,0,0)');
        c.fillStyle = g1; c.beginPath(); c.arc(f.x * s, f.y * s, R, 0, 6.3); c.fill();
        c.lineWidth = s * .22 * (1 - fq); c.strokeStyle = '#fff3a0'; c.beginPath(); c.arc(f.x * s, f.y * s, s * (.6 + fq * 3), 0, 6.3); c.stroke();
      } else if (f.type === 'rocket') {
        var bh = s * .9 * (1 - fq * .7);
        c.fillStyle = lg(c, 0, f.y * s - bh / 2, 0, f.y * s + bh / 2, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,230,120,.85)'], [1, 'rgba(255,255,255,0)']]);
        c.fillRect(0, f.y * s - bh / 2, s * W, bh);
      }
      c.restore();
    }
    c.globalCompositeOperation = 'source-over';
    for (i = 0; i < fxs.length; i++) {
      var rf = fxs[i]; if (rf.type !== 'rocket' || rf.t < 0 || rf.t > .6) continue;
      for (var dd = -1; dd <= 1; dd += 2) {
        c.save(); c.translate((rf.x + dd * 16 * rf.t) * s, rf.y * s); if (dd < 0) c.rotate(Math.PI); c.scale(1.15, 1.15); spr(c, ROCKET, 1, 1); c.restore();
      }
    }
    for (i = 0; i < parts.length; i++) {
      var p = parts[i], pr = p.r * s, pa = Math.min(1, p.life / .3);
      c.save(); c.globalAlpha = pa; c.translate(p.x * s, p.y * s); c.rotate(p.rot); c.fillStyle = p.c;
      if (p.type === 'star') { c.globalCompositeOperation = 'lighter'; c.beginPath(); c.moveTo(0, -pr * 1.8); c.lineTo(pr * .4, 0); c.lineTo(0, pr * 1.8); c.lineTo(-pr * .4, 0); c.closePath(); c.fill(); c.rotate(1.57); c.fill(); }
      else if (p.type === 'streak') { c.globalCompositeOperation = 'lighter'; c.fillRect(-pr * 6, -pr * .5, pr * 12, pr); }
      else if (p.type === 'dot') { c.globalCompositeOperation = 'lighter'; c.beginPath(); c.arc(0, 0, pr, 0, 6.3); c.fill(); }
      else if (p.type === 'smoke') { c.globalAlpha = pa * .55; c.beginPath(); c.arc(0, 0, pr * s * .0 + p.r * s, 0, 6.3); c.fill(); }
      else if (p.type === 'chunk') { c.beginPath(); c.moveTo(-pr, pr); c.lineTo(0, -pr * 1.2); c.lineTo(pr * 1.1, pr * .7); c.closePath(); c.fill(); }
      else { rr(c, -pr, -pr, pr * 2, pr * 2, pr * .4); c.fill(); }
      c.restore();
    }
    for (i = 0; i < texts.length; i++) {
      var tx = texts[i], tq = tx.t / .9, fs = s * (tx.big ? .5 : .38) * (tq < .12 ? .6 + tq / .12 * .5 : 1.1);
      c.save(); c.globalAlpha = tq > .6 ? 1 - (tq - .6) / .4 : 1; c.font = '900 ' + fs + 'px Cairo,Tajawal,system-ui,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      var tyy = (tx.y - tq * 1.2) * s; c.lineWidth = fs * .22; c.strokeStyle = '#6a2a00'; c.strokeText(tx.txt, tx.x * s, tyy); c.fillStyle = '#fff3a0'; c.fillText(tx.txt, tx.x * s, tyy);
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
