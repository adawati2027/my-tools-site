// Live health check: sitemap URLs return 200, external links in local jo/ pages resolve, shared assets + config REST respond.
// Usage: node tools/site-health.js [--no-external]   (exit code 1 if anything failed)
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..') + '/';
const noExt = process.argv.includes('--no-external');
const bad = [];

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const it = items[i++]; await fn(it); } }));
}
async function status(url, method) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 15000);
  try {
    const r = await fetch(url, { method: method || 'GET', redirect: 'follow', signal: c.signal, headers: { 'user-agent': 'Mozilla/5.0 adawati-health' } });
    return r.status;
  } catch (e) { return 0; } finally { clearTimeout(t); }
}
function walk(d, out) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (f.name === 'node_modules' || f.name.startsWith('.')) continue;
    const p = d + '/' + f.name;
    if (f.isDirectory()) walk(p, out); else if (f.name.endsWith('.html')) out.push(p);
  }
  return out;
}

(async () => {
  const sm = fs.readFileSync(R + 'sitemap.xml', 'utf8');
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  await pool(urls, 8, async u => { const s = await status(u, 'HEAD'); if (s !== 200) bad.push(['sitemap', u, s]); });
  console.log('sitemap urls:', urls.length);

  const assets = ['i18n.js', 'tool-sync.js', 'jo/games/quiz-engine.js', 'style.css', 'manifest.json'];
  for (const a of assets) { const s = await status('https://adawati.space/' + a); if (s !== 200) bad.push(['asset', a, s]); }
  const cfg = await status('https://firestore.googleapis.com/v1/projects/adawati-challenges/databases/(default)/documents/config/site?key=AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ');
  if (cfg !== 200 && cfg !== 404) bad.push(['config-rest', 'config/site', cfg]);

  if (!noExt) {
    const ext = new Map();
    for (const f of walk(R + 'jo', [])) {
      const h = fs.readFileSync(f, 'utf8');
      for (const m of h.matchAll(/<a [^>]*href="(https?:\/\/(?!adawati\.space)[^"#]+)"/g)) {
        const u = m[1];
        if (/googletagmanager|googlesyndication|google\.com\/(search|maps)|facebook\.com|instagram\.com|wa\.me|t\.me|twitter\.com/.test(u)) continue;
        if (!ext.has(u)) ext.set(u, f.slice(R.length));
      }
    }
    console.log('external links:', ext.size);
    await pool([...ext.keys()], 6, async u => {
      let s = await status(u, 'HEAD');
      if (s === 0 || s >= 400) s = await status(u);
      if (s === 0 || s >= 400) bad.push(['external', u + '  (in ' + ext.get(u) + ')', s]);
    });
  }
  if (!bad.length) console.log('OK: all checks passed');
  else { console.log('FAILED:', bad.length); bad.forEach(b => console.log(' ', b.join(' | '))); process.exitCode = 1; }
})();
