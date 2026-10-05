const fs = require('fs'), https = require('https'), crypto = require('crypto');
const KEY = process.env.GSC_KEY || 'C:/Users/96896/Downloads/adawati-challenges-d4eb2a2b4a09.json';
const SITE = 'sc-domain:adawati.space';
const key = JSON.parse(fs.readFileSync(KEY, 'utf8'));
const b64 = o => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
function req(url, opts, body) {
  return new Promise((res, rej) => {
    const r = https.request(url, opts, s => { let d = ''; s.on('data', c => d += c); s.on('end', () => res({ status: s.statusCode, body: d })); });
    r.on('error', rej); if (body) r.write(body); r.end();
  });
}
async function token() {
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const jwt = head + '.' + crypto.createSign('RSA-SHA256').update(head).sign(key.private_key, 'base64url');
  const body = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt;
  const r = await req('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, body);
  return JSON.parse(r.body).access_token;
}
(async () => {
  let urls = process.argv.slice(2);
  if (!urls.length) urls = [...fs.readFileSync(__dirname + '/../sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const CACHE = process.env.GSC_CACHE;
  const done = CACHE && fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  const t = await token();
  const todo = urls.filter(u => !done[u]);
  async function one(u) {
    for (let a = 0; a < 3; a++) {
      const r = await req('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' } }, JSON.stringify({ inspectionUrl: u, siteUrl: SITE }));
      let j; try { j = JSON.parse(r.body); } catch { j = {}; }
      if (r.status === 200) { const s = j.inspectionResult.indexStatusResult; done[u] = { verdict: s.verdict, state: s.coverageState, crawl: s.lastCrawlTime || '' }; return; }
      if (r.status === 429) throw new Error('quota');
      await new Promise(z => setTimeout(z, 2000 * (a + 1)));
    }
    console.error('failed', u);
  }
  try { for (let i = 0; i < todo.length; i += 5) { await Promise.all(todo.slice(i, i + 5).map(one)); if (CACHE) fs.writeFileSync(CACHE, JSON.stringify(done)); } }
  catch (e) { console.error(e.message); }
  const out = urls.filter(u => done[u]).map(u => ({ u, ...done[u] }));
  const bad = out.filter(o => o.verdict !== 'PASS');
  console.log(`checked ${out.length}/${urls.length}, indexed ${out.length - bad.length}, not indexed ${bad.length}`);
  for (const o of bad) console.log(o.state.padEnd(45), o.crawl.slice(0, 10).padEnd(11), o.u);
})();
