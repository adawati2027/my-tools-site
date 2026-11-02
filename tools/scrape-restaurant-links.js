// Scans each restaurant's own website for Instagram/Facebook links. usage: node tools/scrape-restaurant-links.js <out.json>
const fs = require('fs'), path = require('path');
global.window = {}; eval(fs.readFileSync(path.join(__dirname, '../jo/restaurants/data.js'), 'utf8'));
const out = {}, outFile = process.argv[2] || 'links_site.json';
const list = window.RESTS.filter(r => r.w && (!r.i || !r.f));
const BADIG = /^(p|reel|reels|explore|accounts|share|sharer|tv|stories|about|legal|developer|direct|web|instagram|embed\.js)$/i;
const BADFB = /^(sharer|sharer\.php|share|tr|plugins|dialog|login|policies|privacy|help|events|groups|watch|marketplace|photo|photo\.php|permalink\.php|story\.php|profile\.php|pages|people|public|hashtag|business|ads|legal|l\.php|about)$/i;
const top = m => { const c = {}; m.forEach(x => c[x] = (c[x] || 0) + 1); return Object.keys(c).sort((a, b) => c[b] - c[a])[0]; };
async function one(r) {
  try {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), 9000);
    const res = await fetch(r.w, { signal: ac.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; AdawatiBot/1.0)' } });
    const html = (await res.text()).slice(0, 600000); clearTimeout(t);
    const ig = [...html.matchAll(/instagram\.com\/([A-Za-z0-9_.]{2,30})(?=[\/"'?\s<\\])/gi)].map(m => m[1]).filter(h => !BADIG.test(h));
    const fb = [...html.matchAll(/facebook\.com\/([A-Za-z0-9_.\-]{3,60})(?=[\/"'?\s<\\])/gi)].map(m => m[1]).filter(h => !BADFB.test(h));
    const o = {}; if (!r.i && ig.length) o.instagram = 'https://www.instagram.com/' + top(ig) + '/'; if (!r.f && fb.length) o.facebook = 'https://www.facebook.com/' + top(fb);
    if (o.instagram || o.facebook) out[r.id] = o;
  } catch (e) {}
}
(async () => {
  let i = 0; const W = 16;
  await Promise.all(Array.from({ length: W }, async () => { while (i < list.length) { const r = list[i++]; await one(r); if (i % 100 === 0) console.log(i, '/', list.length, Object.keys(out).length); } }));
  fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
  console.log('done', list.length, 'sites ->', Object.keys(out).length, 'with links; instagram:', Object.values(out).filter(o => o.instagram).length);
})();
