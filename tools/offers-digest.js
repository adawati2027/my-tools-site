// Twice-daily digest of restaurant offers (Firestore restOffers, public read via REST).
// usage: node tools/offers-digest.js   -> prints new/active offers, remembers what it already reported.
const fs = require('fs'), path = require('path'), https = require('https');
const root = path.join(__dirname, '..');
const stateFile = path.join(process.env.LOCALAPPDATA || root, 'adawati-offers-seen.json');
const outFile = path.join(process.env.LOCALAPPDATA || root, 'adawati-offers-latest.txt');
global.window = {}; eval(fs.readFileSync(path.join(root, 'jo/restaurants/data.js'), 'utf8'));
const BY = {}; window.RESTS.forEach(r => BY[r.id] = r);
const get = u => new Promise((res, rej) => https.get(u, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => r.statusCode === 200 ? res(JSON.parse(b)) : rej(new Error(r.statusCode + ' ' + b.slice(0, 200)))); }).on('error', rej));
const val = f => f && (f.stringValue !== undefined ? f.stringValue : f.timestampValue !== undefined ? f.timestampValue : '');
(async () => {
  const now = new Date(), today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  let docs = [], tok = '';
  do {
    const j = await get('https://firestore.googleapis.com/v1/projects/adawati-challenges/databases/(default)/documents/restOffers?pageSize=300' + (tok ? '&pageToken=' + encodeURIComponent(tok) : ''));
    docs = docs.concat(j.documents || []); tok = j.nextPageToken || '';
  } while (tok);
  let seen = {}; try { seen = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch (e) {}
  const live = docs.map(d => { const f = d.fields || {}; return { id: d.name.split('/').pop(), rid: val(f.rid), kind: val(f.kind), title: val(f.title), price: val(f.price), until: val(f.until), who: val(f.name), at: val(f.updatedAt) }; }).filter(o => o.until >= today);
  const fresh = live.filter(o => seen[o.id] !== o.at);
  const line = o => { const r = BY[o.rid] || { n: o.rid, a: '' }; return `- ${r.n} (${r.a}) | ${o.kind === 'buffet' ? 'بوفيه' : 'منيو'}: ${o.title}${o.price ? ' | ' + o.price : ''} | حتى ${o.until} | نشره ${o.who} | https://adawati.space/jo/restaurants/#${o.rid}`; };
  let txt = `==== ${now.toISOString()} ====\nعروض سارية: ${live.length} | جديدة/معدّلة منذ آخر تشغيل: ${fresh.length}\n`;
  if (fresh.length) txt += 'الجديد:\n' + fresh.map(line).join('\n') + '\n';
  txt += live.length ? 'كل العروض السارية:\n' + live.map(line).join('\n') + '\n' : 'لا توجد عروض سارية.\n';
  console.log(txt);
  fs.writeFileSync(outFile, txt);
  const ns = {}; live.forEach(o => ns[o.id] = o.at);
  fs.writeFileSync(stateFile, JSON.stringify(ns));
})().catch(e => { console.error('digest failed:', e.message); process.exit(1); });
