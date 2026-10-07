// usage: node tools/gsc-sitemap.js   → resubmits https://adawati.space/sitemap.xml to Google Search Console and prints its status
// Needs the local service-account key (never in the repo) with Full permission on sc-domain:adawati.space.
const fs = require('fs'), https = require('https'), crypto = require('crypto');
const KEY = process.env.GSC_KEY || 'C:/Users/96896/Downloads/adawati-challenges-d4eb2a2b4a09.json';
const key = JSON.parse(fs.readFileSync(KEY, 'utf8'));
const b = o => Buffer.from(JSON.stringify(o)).toString('base64url'), n = Math.floor(Date.now() / 1000);
const h = b({ alg: 'RS256', typ: 'JWT' }) + '.' + b({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters', aud: 'https://oauth2.googleapis.com/token', iat: n, exp: n + 3600 });
const jwt = h + '.' + crypto.createSign('RSA-SHA256').update(h).sign(key.private_key, 'base64url');
const rq = (u, o, d) => new Promise((r, j) => { const q = https.request(u, o, s => { let x = ''; s.on('data', c => x += c); s.on('end', () => r([s.statusCode, x])); }); q.on('error', j); d && q.write(d); q.end(); });
(async () => {
  const tok = JSON.parse((await rq('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt))[1]).access_token;
  const url = 'https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent('sc-domain:adawati.space') + '/sitemaps/' + encodeURIComponent('https://adawati.space/sitemap.xml');
  const [s] = await rq(url, { method: 'PUT', headers: { Authorization: 'Bearer ' + tok, 'Content-Length': 0 } });
  const [s2, x2] = await rq(url, { headers: { Authorization: 'Bearer ' + tok } });
  const r = JSON.parse(x2);
  console.log('submit', s === 204 ? 'OK' : s, '| lastSubmitted', r.lastSubmitted, '| lastDownloaded', r.lastDownloaded, '| pending', r.isPending, '| urls', (r.contents || []).map(c => c.submitted).join(','));
})().catch(e => { console.error(e.message); process.exit(1); });
