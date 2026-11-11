(function(){
'use strict';
var ML = window.MarbleLevels;
var W = 360, H = 640;
var R = 7.2, GRAV = 950, REST = 0.22;
var PIPE_X = { 2: [110, 250], 3: [70, 180, 290], 4: [48, 138, 228, 318] };
var EMIT_Y = 134, GATE_Y = 168, POUR_RATE = 7;
var FUNNEL = [ [[4, 215], [152, 274]], [[356, 215], [208, 274]], [[152, 274], [152, 294]], [[208, 274], [208, 294]], [[152, 296], [208, 296]], [[4, 0], [4, 215]], [[356, 0], [356, 215]] ];
var CX = 180, LH = 138, BR = 24, TOP_Y = 312, MID_Y = TOP_Y + BR, BOT_Y = TOP_Y + 2 * BR;
var C = 4 * LH + 2 * Math.PI * BR, SPACING = 17, BELT_SPEED = 120, ENTRY_S = LH;
var BELT_CAP = Math.floor(C / SPACING);
var COL_TOP = 384, TILE_W = 72, TILE_H = 54, TILE_PITCH = 60;
var DOT_OFF = [[-20, -15], [0, -15], [20, -15], [-20, 0], [0, 0], [20, 0], [-20, 15], [0, 15], [20, 15]];

function beltPos(s){
  s = ((s % C) + C) % C;
  var q = Math.PI * BR;
  if (s < 2 * LH) return { x: CX + LH - s, y: TOP_Y, seg: 0 };
  s -= 2 * LH;
  if (s < q){ var a = s / BR; return { x: CX - LH - BR * Math.sin(a), y: MID_Y - BR * Math.cos(a), seg: 1 }; }
  s -= q;
  if (s < 2 * LH) return { x: CX - LH + s, y: BOT_Y, seg: 2 };
  s -= 2 * LH;
  var b = s / BR;
  return { x: CX + LH + BR * Math.sin(b), y: MID_Y + BR * Math.cos(b), seg: 3 };
}

function colX(k, n){
  var w = n === 3 ? 82 : 74, gap = n === 3 ? 10 : 8, total = n * w + (n - 1) * gap, x0 = (W - total) / 2;
  return { x0: x0 + k * (w + gap), w: w };
}

function Game(level){
  this.level = level;
  this.def = ML.make(level);
  this.reset();
}

Game.prototype.reset = function(){
  var def = this.def, g = this, n = def.pipes.length;
  this.t = 0;
  this.status = 'play';
  this.marbles = [];
  this.belt = [];
  this.flying = [];
  this.particles = [];
  this.gateFlash = [];
  this.nextId = 1;
  this.captured = 0;
  this.idle = 0;
  this.entryWait = 0;
  this.pipes = def.pipes.map(function(q, i){
    return { x: PIPE_X[n][i], queue: q.map(function(b){ return { color: b.color, units: b.units }; }), pouring: false, acc: 0, shift: 0 };
  });
  var cn = def.cols.length;
  this.cols = def.cols.map(function(c, k){
    var g0 = colX(k, cn);
    return { x0: g0.x0, w: g0.w, tiles: c.map(function(col){ return { color: col, filled: 0, pending: 0, pop: 0, y: 0 }; }) };
  });
  this.cols.forEach(function(col){ col.tiles.forEach(function(t, i){ t.y = i * TILE_PITCH; }); });
  this.totalTiles = this.cols.reduce(function(a, c){ return a + c.tiles.length; }, 0);
  this.events = [];
};

Game.prototype.emit = function(type, data){ this.events.push({ type: type, data: data }); };

Game.prototype.tapPipe = function(i){
  var p = this.pipes[i];
  if (this.status !== 'play' || !p || p.pouring || !p.queue.length) return false;
  p.pouring = true; p.acc = 1;
  this.emit('pour', { color: p.queue[0].color });
  return true;
};

Game.prototype.pipeAt = function(x, y){
  if (y > GATE_Y + 20) return -1;
  var best = -1, bd = 1e9;
  for (var i = 0; i < this.pipes.length; i++){
    var d = Math.abs(this.pipes[i].x - x);
    if (d < 40 && d < bd){ bd = d; best = i; }
  }
  return best;
};

function addMarble(g, x, y, vx, vy, color, gated){
  g.marbles.push({ id: g.nextId++, x: x, y: y, vx: vx, vy: vy, color: color, gated: gated });
}

Game.prototype.step = function(dt){
  if (this.status !== 'play') { this.stepFx(dt); return; }
  this.t += dt;
  var i, j, p, m;
  for (i = 0; i < this.pipes.length; i++){
    p = this.pipes[i];
    if (p.shift > 0) p.shift = Math.max(0, p.shift - dt * 4);
    if (!p.pouring) continue;
    p.acc += POUR_RATE * dt;
    while (p.acc >= 1 && p.queue.length){
      p.acc -= 1;
      var b = p.queue[0];
      addMarble(this, p.x + (Math.random() - 0.5) * 12, EMIT_Y, (Math.random() - 0.5) * 30, 120, b.color, false);
      b.units--;
      if (b.units <= 0){ p.queue.shift(); p.pouring = false; p.shift = 1; break; }
    }
  }
  var sub = 3, h = dt / sub;
  for (var s = 0; s < sub; s++) this.physics(h);
  this.stepBelt(dt);
  this.stepFx(dt);
  this.checkEnd(dt);
};

Game.prototype.physics = function(h){
  var ms = this.marbles, n = ms.length, i, j, m, a, b;
  for (i = 0; i < n; i++){
    m = ms[i];
    m.vy += GRAV * h;
    m.x += m.vx * h; m.y += m.vy * h;
    if (!m.gated && m.y > GATE_Y){
      m.gated = true;
      addMarble(this, m.x - 6, m.y - 2, m.vx - 40, m.vy * 0.9, m.color, true);
      addMarble(this, m.x + 6, m.y - 4, m.vx + 40, m.vy * 0.95, m.color, true);
      this.gateFlash.push({ x: m.x, t: 0.18 });
      this.emit('gate', {});
    }
  }
  n = ms.length;
  for (var it = 0; it < 3; it++){
    for (i = 0; i < n; i++){
      a = ms[i];
      for (j = i + 1; j < n; j++){
        b = ms[j];
        var dx = b.x - a.x, dy = b.y - a.y;
        if (dx > 2 * R || dx < -2 * R || dy > 2 * R || dy < -2 * R) continue;
        var d2 = dx * dx + dy * dy;
        if (d2 >= 4 * R * R) continue;
        var d = Math.sqrt(d2) || 0.0001, nx = dx / d, ny = dy / d, ov = (2 * R - d) * 0.5 * 0.85;
        a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov;
        var rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rv < 0){
          var jn = -(1 + REST) * rv * 0.5;
          a.vx -= jn * nx; a.vy -= jn * ny; b.vx += jn * nx; b.vy += jn * ny;
        }
      }
      wallCollide(a);
    }
  }
  for (i = 0; i < n; i++){ ms[i].vx *= 0.9995; ms[i].vy *= 0.9995; }
};

function wallCollide(m){
  for (var k = 0; k < FUNNEL.length; k++){
    var s = FUNNEL[k], ax = s[0][0], ay = s[0][1], bx = s[1][0], by = s[1][1];
    var ex = bx - ax, ey = by - ay, len2 = ex * ex + ey * ey;
    var t = Math.max(0, Math.min(1, ((m.x - ax) * ex + (m.y - ay) * ey) / len2));
    var px = ax + ex * t, py = ay + ey * t, dx = m.x - px, dy = m.y - py, d2 = dx * dx + dy * dy;
    if (d2 < R * R){
      var d = Math.sqrt(d2);
      var nx, ny;
      if (d < 0.0001){ nx = -ey; ny = ex; var l = Math.sqrt(len2); nx /= l; ny /= l; if (ny > 0 && k < 5) { nx = -nx; ny = -ny; } }
      else { nx = dx / d; ny = dy / d; }
      m.x = px + nx * R; m.y = py + ny * R;
      var vn = m.vx * nx + m.vy * ny;
      if (vn < 0){
        m.vx -= (1 + REST) * vn * nx; m.vy -= (1 + REST) * vn * ny;
        var tx = -ny, ty = nx, vt = m.vx * tx + m.vy * ty;
        m.vx -= vt * 0.04 * tx; m.vy -= vt * 0.04 * ty;
      }
    }
  }
}

Game.prototype.beltFree = function(){
  for (var i = 0; i < this.belt.length; i++){
    var d = Math.abs((((this.belt[i].s - ENTRY_S) % C) + C * 1.5) % C - C / 2);
    if (d < SPACING) return false;
  }
  return true;
};

Game.prototype.stepBelt = function(dt){
  var i, m;
  for (i = 0; i < this.belt.length; i++) this.belt[i].s += BELT_SPEED * dt;
  var cand = null;
  for (i = 0; i < this.marbles.length; i++){
    m = this.marbles[i];
    if (m.y > 276 && Math.abs(m.x - CX) < 32 && (!cand || m.y > cand.y)) cand = m;
  }
  if (cand && !this.beltFree()) this.entryWait = (this.entryWait || 0) + dt;
  if (cand && this.beltFree()){
    this.entryWait = 0;
    this.marbles.splice(this.marbles.indexOf(cand), 1);
    this.belt.push({ s: ENTRY_S, color: cand.color, fx: cand.x, fy: cand.y, a: 1 });
  }
  var cn = this.cols.length;
  for (i = this.belt.length - 1; i >= 0; i--){
    m = this.belt[i];
    if (m.a > 0) m.a = Math.max(0, m.a - dt * 7);
    var pos = beltPos(m.s);
    if (pos.seg !== 2) continue;
    for (var k = 0; k < cn; k++){
      var col = this.cols[k], tile = col.tiles[0];
      if (!tile || tile.color !== m.color || tile.filled + tile.pending >= ML.TILE_CAP) continue;
      if (pos.x < col.x0 + 6 || pos.x > col.x0 + col.w - 6) continue;
      var idx = tile.filled + tile.pending;
      tile.pending++;
      var cx = col.x0 + col.w / 2 + DOT_OFF[idx][0] * (col.w / 72), cy = COL_TOP + tile.y + TILE_H / 2 + DOT_OFF[idx][1];
      this.flying.push({ x: pos.x, y: pos.y, tx: cx, ty: cy, t: 0, color: m.color, tile: tile, col: col });
      this.belt.splice(i, 1);
      break;
    }
  }
};

Game.prototype.stepFx = function(dt){
  var i, f;
  for (i = this.flying.length - 1; i >= 0; i--){
    f = this.flying[i]; f.t += dt / 0.2;
    if (f.t >= 1){
      f.tile.pending--; f.tile.filled++;
      this.captured++;
      this.emit('catch', { n: f.tile.filled });
      this.flying.splice(i, 1);
      if (f.tile.filled >= ML.TILE_CAP && !f.tile.done){
        f.tile.done = true; f.tile.pop = 1;
        this.emit('tile', { color: f.color });
        var tx = f.col.x0 + f.col.w / 2, ty = COL_TOP + f.tile.y + TILE_H / 2;
        for (var q = 0; q < 16; q++){
          var an = Math.random() * 6.283, sp = 90 + Math.random() * 140;
          this.particles.push({ x: tx, y: ty, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp - 60, c: f.color, t: 0.7 });
        }
      }
    }
  }
  for (i = 0; i < this.cols.length; i++){
    var col = this.cols[i], tiles = col.tiles;
    if (tiles.length && tiles[0].done){
      tiles[0].pop -= dt * 4;
      if (tiles[0].pop <= 0){ tiles.shift(); }
    }
    for (var k = 0; k < tiles.length; k++){
      var want = k * TILE_PITCH, t = tiles[k];
      t.y += (want - t.y) * Math.min(1, dt * 12);
    }
  }
  for (i = this.particles.length - 1; i >= 0; i--){
    var p = this.particles[i];
    p.t -= dt; p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.t <= 0) this.particles.splice(i, 1);
  }
  for (i = this.gateFlash.length - 1; i >= 0; i--){
    this.gateFlash[i].t -= dt;
    if (this.gateFlash[i].t <= 0) this.gateFlash.splice(i, 1);
  }
  if (this.status === 'play' && this.cols.every(function(c){ return c.tiles.length === 0; }) && !this.flying.length){
    this.status = 'win'; this.emit('win', {});
  }
};

Game.prototype.canCatch = function(color){
  for (var k = 0; k < this.cols.length; k++){
    var t = this.cols[k].tiles[0];
    if (t && t.color === color && t.filled + t.pending < ML.TILE_CAP) return true;
  }
  return false;
};

Game.prototype.checkEnd = function(dt){
  var self = this, i, onBelt = false;
  for (i = 0; i < this.belt.length && !onBelt; i++) if (this.canCatch(this.belt[i].color)) onBelt = true;
  var pouring = this.pipes.some(function(p){ return p.pouring; });
  var stuck = false;
  if (!onBelt && !this.flying.length && !pouring){
    if (this.belt.length >= BELT_CAP - 4 || (this.entryWait || 0) > 6.5) stuck = true;
    else if (this.marbles.length) stuck = false;
    else {
      this.probe = (this.probe || 0) - dt;
      if (this.probe <= 0){ this.probe = 0.4; this.noMove = self.hint() < 0; }
      stuck = !!this.noMove;
    }
  } else { this.probe = 0; this.noMove = false; if (onBelt || this.flying.length) this.entryWait = 0; }
  if (stuck) this.idle += dt; else this.idle = 0;
  if (this.idle > 0.8){ this.status = "lose"; this.emit("lose", {}); }
};

Game.prototype.hint = function(){
  var st = { qi: [], pool: new Array(this.def.colorCount).fill(0), pipes: [], cols: [] }, g = this;
  this.pipes.forEach(function(p){
    st.qi.push(0);
    st.pipes.push(p.queue.map(function(b){ return { color: b.color, units: b.units }; }));
  });
  this.belt.forEach(function(m){ st.pool[m.color]++; });
  this.marbles.forEach(function(m){ st.pool[m.color] += m.gated ? 1 : 3; });
  this.flying.forEach(function(f){ st.pool[f.color] += 0; });
  this.cols.forEach(function(c){
    st.cols.push(c.tiles.filter(function(t){ return !t.done; }).map(function(t){
      return { color: t.color, need: ML.TILE_CAP - t.filled - t.pending };
    }));
  });
  var idle = [];
  this.pipes.forEach(function(p, i){ if (!p.pouring && p.queue.length) idle.push(i); });
  var res = ML.solve(st, true, 60000);
  for (var i = 0; i < res.length; i++) if (idle.indexOf(res[i]) >= 0) return res[i];
  return -1;
};

window.MarbleEngine = { Game: Game, W: W, H: H, R: R, beltPos: beltPos, CX: CX, LH: LH, BR: BR, TOP_Y: TOP_Y, MID_Y: MID_Y, BOT_Y: BOT_Y,
  C: C, EMIT_Y: EMIT_Y, GATE_Y: GATE_Y, FUNNEL: FUNNEL, COL_TOP: COL_TOP, TILE_W: TILE_W, TILE_H: TILE_H, DOT_OFF: DOT_OFF, BELT_CAP: BELT_CAP };
})();
