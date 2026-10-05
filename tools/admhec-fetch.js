// usage: node tools/admhec-fetch.js <outDir> <univCode> [univCode...]
// Fresh session (GET → POST postback) per university; saves raw HTML + parsed rows JSON.
const fs = require('fs'), https = require('https'), path = require('path');
const URL_ = 'https://admhec.gov.jo/LeastAverages.aspx';
const P = 'ctl00$MainContentPlaceHolder$';
function req(method, body, cookie) {
  return new Promise((res, rej) => {
    const r = https.request(URL_, { method, headers: Object.assign({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36' },
      cookie ? { Cookie: cookie } : {}, body ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) } : {}) },
      s => { let d = ''; s.setEncoding('utf8'); s.on('data', c => d += c); s.on('end', () => res({ html: d, cookie: (s.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ') })); });
    r.on('error', rej); r.setTimeout(60000, () => r.destroy(new Error('timeout'))); if (body) r.write(body); r.end();
  });
}
const field = (h, n) => (h.match(new RegExp(`name="${n}"[^>]*value="([^"]*)"`)) || [])[1] || '';
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
(async () => {
  const [out, ...codes] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  for (const code of codes) {
    try {
      const g = await req('GET');
      const form = { __EVENTTARGET: '', __EVENTARGUMENT: '', __VIEWSTATE: field(g.html, '__VIEWSTATE'), __VIEWSTATEGENERATOR: field(g.html, '__VIEWSTATEGENERATOR'),
        __EVENTVALIDATION: field(g.html, '__EVENTVALIDATION'), [P + 'ddlCertType']: '1', [P + 'ddlUniversity']: code, [P + 'btnSearch']: 'عرض الحدود الدنيا' };
      const body = Object.entries(form).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
      const p = await req('POST', body, g.cookie);
      fs.writeFileSync(path.join(out, code + '.html'), p.html);
      const rows = [...p.html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m => [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(c => strip(c[1]))).filter(r => r.length > 2);
      fs.writeFileSync(path.join(out, code + '.json'), JSON.stringify(rows));
      console.log(code, rows.length, 'rows |', JSON.stringify(rows[0] || []).slice(0, 120), '|', JSON.stringify(rows[1] || []).slice(0, 120));
    } catch (e) { console.log(code, 'ERR', e.message); }
    await new Promise(r => setTimeout(r, 3000));
  }
})();
