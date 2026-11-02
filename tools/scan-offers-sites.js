// Scans restaurants' own websites for offer/discount mentions -> prints candidates (id, url, snippets). usage: node tools/scan-offers-sites.js [out.json]
const fs = require('fs'), path = require('path');
global.window = {}; eval(fs.readFileSync(path.join(__dirname, '../jo/restaurants/data.js'), 'utf8'));
const out = {}, outFile = process.argv[2];
const list = window.RESTS.filter(r => r.w);
const KEY = /(عرض|عروض|خصم|تخفيض|تنزيلات|offers?\b|promotions?|promo|discount|deals?\b|% ?off|buffet|بوفيه)/i;
const strip = h => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
async function get(u) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), 9000);
  try { const res = await fetch(u, { signal: ac.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; AdawatiBot/1.0)' } }); return (await res.text()).slice(0, 400000); } catch (e) { return ''; } finally { clearTimeout(t); }
}
async function one(r) {
  const html = await get(r.w); if (!html) return;
  const links = [...html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]{0,120}?)<\/a>/gi)].map(m => ({ h: m[1], t: strip(m[2]).trim() })).filter(l => /(عرض|عروض|offers?|promotions?|deals?|discount|خصم)/i.test(l.t + ' ' + l.h));
  const text = strip(html), snips = [];
  let m; const re = new RegExp(KEY.source, 'gi');
  while ((m = re.exec(text)) && snips.length < 4) { snips.push(text.slice(Math.max(0, m.index - 60), m.index + 120)); re.lastIndex = m.index + 150; }
  if (!links.length && !snips.length) return;
  let page = null;
  if (links[0]) { try { const u = new URL(links[0].h, r.w).href; const h2 = await get(u); if (h2) page = { url: u, text: strip(h2).slice(0, 1500) }; } catch (e) {} }
  out[r.id] = { name: r.n, site: r.w, links: links.slice(0, 3), snips, page };
}
(async () => {
  let i = 0;
  await Promise.all(Array.from({ length: 12 }, async () => { while (i < list.length) await one(list[i++]); }));
  console.log('sites', list.length, 'with offer mentions', Object.keys(out).length);
  if (outFile) fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
})();
