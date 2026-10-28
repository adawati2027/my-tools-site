// Adds a "related tools" card (static internal links) to jo/* pages. Idempotent. Usage: node tools/add-related.js [--dry]
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..') + '/';
const dry = process.argv.includes('--dry');
const idx = fs.readFileSync(R + 'jo/index.html', 'utf8');
const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const cat = new Map();
const re = /<a href="([^"]+)" class="tool-card"[^>]*>([\s\S]*?)<\/a>/g;
let m;
while ((m = re.exec(idx))) {
  const href = m[1];
  if (cat.has(href) || href.startsWith('jo/ads')) continue;
  const icon = (m[2].match(/tool-icon-wrap[^>]*>([^<]*)</) || [])[1] || '';
  const title = strip((m[2].match(/tool-card-title[^>]*>([\s\S]*?)<\/div>/) || [])[1] || '');
  if (title) cat.set(href, { href, icon: strip(icon), title });
}
const GROUPS = ['calculators', 'tools', 'students', 'health', 'games'];
const byGroup = {};
for (const e of cat.values()) {
  const g = (e.href.match(/^jo\/([^/]+)\//) || [])[1];
  if (GROUPS.includes(g) && e.href !== 'jo/' + g + '/') (byGroup[g] = byGroup[g] || []).push(e);
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
let done = 0, skipped = [];
for (const g of GROUPS) {
  const list = byGroup[g] || [];
  const others = GROUPS.filter(x => x !== g).flatMap(x => byGroup[x] || []);
  list.forEach((e, i) => {
    const file = R + e.href + 'index.html';
    if (!fs.existsSync(file)) { skipped.push(e.href + ' (no file)'); return; }
    let h = fs.readFileSync(file, 'utf8');
    h = h.replace(/<!--related-->[\s\S]*?<!--\/related-->/, '');
    const pick = [];
    for (let k = 1; pick.length < 3 && k < list.length; k++) pick.push(list[(i + k) % list.length]);
    if (others.length) pick.push(others[(i * 7 + g.length) % others.length]);
    if (!pick.length) return;
    const block = '<!--related--><div class="card" style="margin-top:16px;"><h2 style="font-size:17px;font-weight:700;margin-bottom:10px;">🔗 أدوات ذات صلة</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;">' +
      pick.map(p => '<a href="' + p.href + '" style="display:flex;gap:8px;align-items:center;padding:10px 12px;border:1px solid var(--border);border-radius:10px;text-decoration:none;color:var(--text);font-size:14px;font-weight:600;"><span>' + esc(p.icon) + '</span><span>' + esc(p.title) + '</span></a>').join('') +
      '</div></div><!--/related-->';
    const k = h.lastIndexOf('</div></main>');
    if (k < 0) { skipped.push(e.href + ' (no </div></main>)'); return; }
    h = h.slice(0, k) + block + '\n' + h.slice(k);
    if (!dry) fs.writeFileSync(file, h);
    done++;
    (module.exports.files = module.exports.files || []).push(e.href + 'index.html');
  });
}
console.log('updated', done, 'skipped', skipped.length, skipped.slice(0, 20));
if (!dry) fs.writeFileSync(R + 'tools/.related-files.txt', (module.exports.files || []).join(' '));
