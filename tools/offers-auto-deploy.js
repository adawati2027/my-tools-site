// Validates tools/offers-auto.json (written by the twice-daily research run) -> jo/restaurants/offers.js, then pushes if it changed.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.join(__dirname, '..');
global.window = {}; eval(fs.readFileSync(path.join(root, 'jo/restaurants/data.js'), 'utf8'));
const ids = new Set(window.RESTS.map(r => r.id));
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = iso(new Date()), max = iso(new Date(Date.now() + 14 * 864e5));
const cut = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);
let raw = []; try { raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'offers-auto.json'), 'utf8')); } catch (e) { console.log('no/invalid offers-auto.json'); process.exit(0); }
const out = [], seen = new Set();
(Array.isArray(raw) ? raw : []).forEach(o => {
  if (!o || !ids.has(o.rid) || !/^\d{4}-\d{2}-\d{2}$/.test(o.until || '') || o.until < today || o.until > max) return;
  if (!/^https:\/\//.test(o.link || '')) return;
  const title = cut(o.title, 80); if (title.length < 3) return;
  const k = o.rid + '|' + title; if (seen.has(k)) return; seen.add(k);
  out.push({ rid: o.rid, kind: o.kind === 'buffet' ? 'buffet' : 'menu', title, details: cut(o.details, 300), price: cut(o.price, 40), until: o.until, link: cut(o.link, 200) });
});
const js = 'window.RESTOFFERS_AUTO=' + JSON.stringify(out) + ';\n';
const file = path.join(root, 'jo/restaurants/offers.js');
if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === js) { console.log('offers unchanged:', out.length); process.exit(0); }
fs.writeFileSync(file, js);
console.log('offers updated:', out.length);
const r = cp.spawnSync('node', ['push-files.js', 'jo/restaurants/offers.js', '--message', 'Restaurants: auto offers refresh (' + out.length + ')'], { cwd: root, encoding: 'utf8' });
console.log((r.stdout || '').trim().split('\n').pop(), r.stderr || '');
