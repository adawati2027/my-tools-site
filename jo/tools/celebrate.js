(function () {
  var running = false;
  var COL = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#06b6d4', '#facc15'];
  var EMO = ['🎉', '✨', '🎊', '⭐', '💥', '🌟', '🎆'];
  function rnd(n) { return Math.random() * n; }
  window.adCelebrate = function () {
    if (running) return;
    try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}
    running = true;
    var c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:99999';
    document.body.appendChild(c);
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = window.innerWidth, H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    var x = c.getContext('2d'); x.scale(dpr, dpr);
    var sparks = [], conf = [], emo = [], t0 = performance.now(), last = t0, nextB = t0, nextE = t0;
    function burst(cx, cy) {
      var col = COL[Math.floor(rnd(COL.length))], col2 = COL[Math.floor(rnd(COL.length))], n = 54, i, a, sp;
      for (i = 0; i < n; i++) {
        a = Math.PI * 2 * i / n + rnd(0.2); sp = 1.5 + rnd(4.8);
        sparks.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, col: i % 3 ? col : col2, r: 1.8 + rnd(2.2) });
      }
    }
    function end() { if (c.parentNode) c.parentNode.removeChild(c); running = false; }
    function frame(now) {
      var dt = Math.min(32, now - last) / 16.67, el = now - t0, i, p;
      last = now;
      x.clearRect(0, 0, W, H);
      if (el < 2800 && now >= nextB) { burst(W * (0.12 + rnd(0.76)), H * (0.1 + rnd(0.4))); nextB = now + 260 + rnd(260); }
      if (el < 2400) for (i = 0; i < 3; i++) conf.push({ x: rnd(W), y: -12, vx: (rnd(1) - 0.5) * 2, vy: 2 + rnd(3), w: 6 + rnd(6), h: 4 + rnd(5), rot: rnd(6), vr: (rnd(1) - 0.5) * 0.3, col: COL[Math.floor(rnd(COL.length))] });
      if (el < 2600 && now >= nextE) { emo.push({ x: 20 + rnd(W - 40), y: H + 20, vy: -(1.6 + rnd(2.2)), s: 22 + rnd(18), e: EMO[Math.floor(rnd(EMO.length))], sw: rnd(6) }); nextE = now + 110; }
      for (i = sparks.length - 1; i >= 0; i--) {
        p = sparks[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.07 * dt; p.vx *= 0.985; p.life -= 0.013 * dt;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        x.globalAlpha = p.life; x.fillStyle = p.col; x.beginPath(); x.arc(p.x, p.y, p.r * (0.5 + p.life / 2), 0, 6.283); x.fill();
      }
      for (i = conf.length - 1; i >= 0; i--) {
        p = conf[i]; p.x += p.vx * dt + Math.sin(p.rot) * 0.6; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.y > H + 20) { conf.splice(i, 1); continue; }
        x.globalAlpha = 1; x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.col; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore();
      }
      x.globalAlpha = 1; x.textAlign = 'center'; x.textBaseline = 'middle';
      for (i = emo.length - 1; i >= 0; i--) {
        p = emo[i]; p.y += p.vy * dt; p.sw += 0.05 * dt; p.x += Math.sin(p.sw) * 0.6;
        if (p.y < -40) { emo.splice(i, 1); continue; }
        x.font = p.s + 'px sans-serif'; x.fillText(p.e, p.x, p.y);
      }
      if (el > 7000 || (el > 2800 && !sparks.length && !conf.length && !emo.length)) { end(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
})();
