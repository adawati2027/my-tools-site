// usage: node tools/indexnow.js [url ...]   (no args = every URL in sitemap.xml)
// Submits to IndexNow (Bing, Yandex, Seznam, Naver...). Key file: /9c11112b9baf0392894fad4e2b6f89d3.txt at the site root.
const fs = require('fs'), https = require('https');
const KEY = '9c11112b9baf0392894fad4e2b6f89d3';
let urls = process.argv.slice(2);
if (!urls.length) urls = [...fs.readFileSync(__dirname + '/../sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const body = JSON.stringify({ host: 'adawati.space', key: KEY, keyLocation: 'https://adawati.space/' + KEY + '.txt', urlList: urls.slice(0, 10000) });
const r = https.request('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) } },
  s => { let d = ''; s.on('data', c => d += c); s.on('end', () => console.log('IndexNow', s.statusCode, urls.length + ' URLs', d.slice(0, 200))); });
r.on('error', e => console.log('error', e.message)); r.end(body);
