// Merges restaurant research JSON files (args) -> jo/restaurants/data.js + index.html (from index.template.html)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const files = process.argv.slice(2);
if (!files.length) { console.error('usage: node tools/build-restaurants.js a.json [b.json ...]'); process.exit(1); }

const AREA_FIX = { 'أخرى': 'جبل النزهة', 'الجبيهه': 'الجبيهة', 'الجبيهة': 'الجبيهة', 'داخلية': 'الداخلية', 'الداخليه': 'الداخلية', 'الدوار السابع': 'الدوار السابع' };
const normKey = s => String(s || '').toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '');
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let all = [];
files.forEach(f => JSON.parse(fs.readFileSync(f, 'utf8')).forEach(r => all.push(r)));

const seen = new Map(), out = [];
all.forEach(r => {
  if (!r.name || !r.area) return;
  const area = AREA_FIX[r.area.trim()] || r.area.trim();
  const key = normKey(r.en || r.name) + '|' + normKey(area);
  if (seen.has(key)) return;
  seen.set(key, 1);
  out.push({ n: r.name.trim(), e: (r.en || '').trim(), a: area, c: (r.cuisine || 'متنوع').trim() });
});

const ids = new Set();
out.forEach(r => {
  let base = slug(r.e) || 'r';
  let id = base.slice(0, 60);
  if (ids.has(id)) id = (base.slice(0, 50) + '-' + slug(r.a)).slice(0, 80);
  let k = 2, orig = id;
  while (ids.has(id)) id = orig.slice(0, 74) + '-' + k++;
  ids.add(id); r.id = id;
});

out.sort((x, y) => x.a.localeCompare(y.a, 'ar') || x.n.localeCompare(y.n, 'ar'));
const js = 'window.RESTS=' + JSON.stringify(out.map(r => ({ id: r.id, n: r.n, e: r.e, a: r.a, c: r.c }))) + ';\n';
fs.writeFileSync(path.join(root, 'jo/restaurants/data.js'), js);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const areas = [...new Set(out.map(r => r.a))];
let stat = '';
areas.forEach(a => {
  const rs = out.filter(r => r.a === a);
  stat += `<section class="card" style="grid-column:1/-1;"><h2 class="card-title" style="font-size:17px;">مطاعم ${esc(a)} (${rs.length})</h2><ul class="rs-static">` +
    rs.map(r => `<li>${esc(r.n)}${r.e ? ' — ' + esc(r.e) : ''} <span class="ads-meta">(${esc(r.c)})</span></li>`).join('') + '</ul></section>';
});

let tpl = fs.readFileSync(path.join(root, 'jo/restaurants/index.template.html'), 'utf8');
const dv = Math.floor(Date.now() / 60000);
tpl = tpl.replace(/\{\{COUNT\}\}/g, out.length).replace(/\{\{AREAS\}\}/g, areas.length).replace('{{DV}}', dv).replace('{{STATIC}}', () => stat);
fs.writeFileSync(path.join(root, 'jo/restaurants/index.html'), tpl);
console.log('restaurants:', out.length, 'areas:', areas.length);
const c = {}; out.forEach(r => c[r.a] = (c[r.a] || 0) + 1); console.log(c);
