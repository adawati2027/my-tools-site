// Finds Instagram profiles via Google Programmable Search API (free: 100 queries/day). usage: node tools/google-cse-instagram.js <out.json> [perRun=95]
// Needs GOOGLE_CSE_KEY and GOOGLE_CSE_CX in .env. Resumable: re-run daily with the same out file.
const fs = require('fs'), path = require('path');
global.window = {}; eval(fs.readFileSync(path.join(__dirname, '../jo/restaurants/data.js'), 'utf8'));
const env = {}; fs.readFileSync(path.join(__dirname, '../.env'), 'utf8').split(/\r?\n/).forEach(l => { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2].trim(); });
const KEY = env.GOOGLE_CSE_KEY, CX = env.GOOGLE_CSE_CX;
if (!KEY || !CX) { console.error('missing GOOGLE_CSE_KEY / GOOGLE_CSE_CX in .env'); process.exit(1); }
const outFile = process.argv[2] || 'links_ig.json', PER = +(process.argv[3] || 95);
let out = {}, tried = {}; try { const s = JSON.parse(fs.readFileSync(outFile, 'utf8')); out = s.found || {}; tried = s.tried || {}; } catch (e) {}
const save = () => fs.writeFileSync(outFile, JSON.stringify({ found: out, tried }, null, 1));
const STOP = /\b(restaurants?|resto|cafe|coffee|jordan|amman|jo|the|branch|al|el|and|shop|grill|house|kitchen|bakery|sweets)\b/gi;
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const AR = /[؀-ۿ]/, SKIP = /^(p|reel|reels|explore|accounts|tv|stories|share)$/i;
const JO = /jordan|amman|\bjo\b|عمان|عمّان|الأردن|الاردن/i;
const ARSTOP = /(مطعم|مطاعم|كافيه|فرع|وكافيه|ومطعم|ال)/g;
const arTokens = n => n.replace(ARSTOP, ' ').split(/[\s\-–_|()\/&]+/).filter(t => t.length >= 3);
function pick(r, items) {
  const en = (r.e && !AR.test(r.e)) ? r.e : '', key = norm(en.replace(STOP, ' '));
  for (const it of items) {
    const m = (it.link || '').match(/instagram\.com\/([A-Za-z0-9_.]{2,30})\/?$/i); if (!m || SKIP.test(m[1])) continue;
    const h = norm(m[1]), t = (it.title || '') + ' ' + (it.snippet || '');
    if (key.length >= 5 && h.includes(key) && (JO.test(t) || /jo$|jor$|_jo|\.jo/i.test(m[1]) || h.length <= key.length + 6)) return m[1];
    const toks = AR.test(r.n) ? arTokens(r.n) : [];
    if (toks.length && toks.every(x => t.includes(x)) && JO.test(t)) return m[1];
  }
  return '';
}
(async () => {
  const list = window.RESTS.filter(r => !r.i && !tried[r.id]).sort((a, b) => (b.f ? 1 : 0) + (b.p ? 1 : 0) - (a.f ? 1 : 0) - (a.p ? 1 : 0)).slice(0, PER);
  let n = 0;
  for (const r of list) {
    const name = (r.e && !AR.test(r.e) ? r.e : r.n);
    const url = 'https://www.googleapis.com/customsearch/v1?key=' + KEY + '&cx=' + CX + '&num=5&q=' + encodeURIComponent(name + (AR.test(name) ? ' عمان' : ' Amman Jordan'));
    const res = await fetch(url);
    if (res.status === 429 || res.status === 403) { console.log('quota/denied', res.status, 'stopping'); break; }
    if (!res.ok) { console.log('err', res.status); continue; }
    const h = pick(r, (await res.json()).items || []);
    if (h) out[r.id] = { instagram: 'https://www.instagram.com/' + h + '/' };
    tried[r.id] = 1; n++;
  }
  save(); console.log('queried', n, 'found total', Object.keys(out).length, 'remaining', window.RESTS.filter(r => !r.i && !tried[r.id]).length);
})();
