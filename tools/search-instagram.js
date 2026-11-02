// Finds Instagram profiles via Brave Search HTML (strict name + Jordan match). usage: node tools/search-instagram.js <out.json> [limit]
// Resumable: re-run with the same out file to continue.
const fs = require('fs'), path = require('path');
global.window = {}; eval(fs.readFileSync(path.join(__dirname, '../jo/restaurants/data.js'), 'utf8'));
const outFile = process.argv[2] || 'links_ig.json', LIMIT = +(process.argv[3] || 1e9);
let out = {}, tried = {}; try { const s = JSON.parse(fs.readFileSync(outFile, 'utf8')); out = s.found || {}; tried = s.tried || {}; } catch (e) {}
const save = () => fs.writeFileSync(outFile, JSON.stringify({ found: out, tried }, null, 1));
const STOP = /\b(restaurants?|resto|cafe|coffee|jordan|amman|jo|the|branch|al|el|and|shop|grill|house|kitchen|bakery|sweets)\b/gi;
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const ARSTOP = /(مطعم|مطاعم|كافيه|فرع|وكافيه|ومطعم|ال)/g;
const AR = /[؀-ۿ]/;
const SKIP = /^(p|reel|reels|explore|accounts|tv|stories|share)$/i;
const JO = /jordan|amman|\bjo\b|عمان|عمّان|الأردن|الاردن|اردن/i;
const dec = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
function arTokens(n) { return n.replace(ARSTOP, ' ').split(/[\s\-–_|()\/&]+/).filter(t => t.length >= 3); }
async function search(q) {
  const html = require('child_process').execFileSync('curl', ['-s', '-m', '25', '-w', '\n%{http_code}', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36', 'https://search.brave.com/search?q=' + encodeURIComponent(q)], { maxBuffer: 50e6 }).toString();
  const code = html.slice(html.lastIndexOf('\n') + 1).trim();
  if (code !== '200') throw new Error('blocked ' + code);
  const items = [];
  html.split('class="snippet ').slice(1).forEach(b => {
    const mm = b.match(/href="https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9_.]{2,30})\/?"/i);
    if (!mm || SKIP.test(mm[1])) return;
    items.push({ h: mm[1], text: b.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').slice(0, 900) });
  });
  return items;
}
function pick(r, items) {
  const en = (r.e && !AR.test(r.e)) ? r.e : '';
  const key = norm(en.replace(STOP, ' '));
  for (const it of items) {
    const h = norm(it.h), t = it.text;
    if (key.length >= 5 && h.includes(key) && (JO.test(t) || /jo$|jor$|_jo|\.jo/i.test(it.h))) return it.h;
    if (key.length >= 5 && h.includes(key) && h.length <= key.length + 6) return it.h;
    const toks = AR.test(r.n) ? arTokens(r.n) : [];
    if (toks.length && toks.every(x => t.includes(x)) && JO.test(t) && /\(@|@/.test(t)) return it.h;
  }
  return '';
}
(async () => {
  const list = window.RESTS.filter(r => !r.i && !tried[r.id]).sort((a, b) => (b.f ? 1 : 0) + (b.p ? 1 : 0) - (a.f ? 1 : 0) - (a.p ? 1 : 0)).slice(0, LIMIT);
  let n = 0, fail = 0;
  for (const r of list) {
    const name = (r.e && !AR.test(r.e) ? r.e : r.n);
    try {
      const items = await search('site:instagram.com ' + name + ' ' + (AR.test(name) ? 'عمان' : 'Amman Jordan'));
      const h = pick(r, items);
      if (h) out[r.id] = { instagram: 'https://www.instagram.com/' + h + '/' };
      tried[r.id] = 1; fail = 0;
    } catch (e) { fail++; console.log('err', e.message); if (fail >= 30) { console.log('stopping: blocked'); break; } await sleep(Math.min(60000 * fail, 300000)); continue; }
    if (++n % 25 === 0) { save(); console.log(n, '/', list.length, 'found', Object.keys(out).length); }
    await sleep(9000 + Math.random() * 3000);
  }
  save(); console.log('finished', n, 'found', Object.keys(out).length);
})();
