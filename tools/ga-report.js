// usage: node tools/ga-report.js [days=28]   → top pages, traffic sources, countries, key events (GA4 Data API)
//        node tools/ga-report.js enable      → try enabling analyticsdata.googleapis.com on the key's GCP project
// Needs the local GA service-account key (never in the repo) with access to property 551984547.
const fs = require('fs'), https = require('https'), crypto = require('crypto');
const KEY = process.env.GA_KEY || 'C:/Users/96896/Downloads/adawati-challenges-b5a8f4d38552.json';
const PROP = '551984547';
const key = JSON.parse(fs.readFileSync(KEY, 'utf8'));
const arg = process.argv[2] || '28';
const b = o => Buffer.from(JSON.stringify(o)).toString('base64url'), n = Math.floor(Date.now() / 1000);
const scope = arg === 'enable' ? 'https://www.googleapis.com/auth/cloud-platform' : 'https://www.googleapis.com/auth/analytics.readonly';
const h = b({ alg: 'RS256', typ: 'JWT' }) + '.' + b({ iss: key.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat: n, exp: n + 3600 });
const jwt = h + '.' + crypto.createSign('RSA-SHA256').update(h).sign(key.private_key, 'base64url');
const rq = (u, o, d) => new Promise((r, j) => { const q = https.request(u, o, s => { let x = ''; s.on('data', c => x += c); s.on('end', () => r([s.statusCode, x])); }); q.on('error', j); d && q.write(d); q.end(); });
(async () => {
  const tok = JSON.parse((await rq('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt))[1]).access_token;
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
  if (arg === 'enable') {
    const [s, x] = await rq(`https://serviceusage.googleapis.com/v1/projects/${key.project_id}/services/analyticsdata.googleapis.com:enable`, { method: 'POST', headers: H }, '{}');
    return console.log(s, x.slice(0, 400));
  }
  const run = async (dims, mets, limit, extra) => {
    const body = JSON.stringify(Object.assign({ dateRanges: [{ startDate: arg + 'daysAgo', endDate: 'today' }], dimensions: dims.map(d => ({ name: d })), metrics: mets.map(m => ({ name: m })), orderBys: [{ metric: { metricName: mets[0] }, desc: true }], limit }, extra || {}));
    const [s, x] = await rq(`https://analyticsdata.googleapis.com/v1beta/properties/${PROP}:runReport`, { method: 'POST', headers: H }, body);
    if (s !== 200) throw new Error(s + ' ' + x.slice(0, 300));
    return (JSON.parse(x).rows || []).map(r => (r.dimensionValues || []).map(v => v.value).concat(r.metricValues.map(v => v.value)));
  };
  const show = (t, rows) => { console.log('\n## ' + t); rows.forEach(r => console.log(r.join(' | '))); };
  show('Totals (users | new | sessions | avg engagement s | events)', (await run([], ['activeUsers', 'newUsers', 'sessions', 'userEngagementDuration', 'eventCount'], 1)).map(r => [r[0], r[1], r[2], Math.round(r[3] / Math.max(1, r[0])), r[4]]));
  show('Channels (sessions | users | engaged sessions)', await run(['sessionDefaultChannelGroup'], ['sessions', 'activeUsers', 'engagedSessions'], 10));
  show('Sources', await run(['sessionSource'], ['sessions'], 12));
  show('Countries', await run(['country'], ['activeUsers'], 10));
  show('Top pages (views | users | avg engagement s)', (await run(['pagePath'], ['screenPageViews', 'activeUsers', 'userEngagementDuration'], 25)).map(r => [r[0], r[1], r[2], Math.round(r[3] / Math.max(1, r[2]))]));
  show('Organic landing pages', await run(['landingPage'], ['sessions'], 15, { dimensionFilter: { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { value: 'Organic Search' } } } }));
  show('Device', await run(['deviceCategory'], ['activeUsers'], 5));
  show('Key/custom events', await run(['eventName'], ['eventCount'], 30));
})().catch(e => { console.error(e.message); process.exit(1); });
