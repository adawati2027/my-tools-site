// usage: node tools/set-lang-obj.js page.html lang patch.json
// patch: {"keys":{"name":"value",...},"faq":[["q","a"],null,["q",null],...]}  (null = keep that item / answer)
// Rewrites single-quoted string keys / {q:'',a:''} items inside the page's `  <lang>: {` translation object.
const fs = require('fs');
const [f, lang, patchFile] = process.argv.slice(2);
const patch = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
let s = fs.readFileSync(f, 'utf8');
const am = new RegExp(`\\n\\s*${lang}\\s*:\\s*\\{`).exec(s);
const a = am ? am.index : -1;
const bm = /\n\s*[a-z]{2}\s*:\s*\{|\n\s*\};?/.exec(s.slice(a + 1));
const b = bm ? a + 1 + bm.index : -1;
if (a < 0 || b < 0) throw new Error('lang object not found');
let o = s.slice(a, b);
const esc = v => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
for (const [k, v] of Object.entries(patch.keys || {})) {
  const re = new RegExp(`(\\b${k}\\s*:\\s*)'(?:[^'\\\\]|\\\\.)*'`);
  if (!re.test(o)) { console.log('key not found:', k); continue; }
  o = o.replace(re, (_, p) => `${p}'${esc(v)}'`);
}
if (patch.faq) {
  const items = [...o.matchAll(/\{\s*q\s*:\s*'((?:[^'\\]|\\.)*)'\s*,\s*a\s*:\s*'((?:[^'\\]|\\.)*)'\s*\}/g)];
  if (items.length !== patch.faq.length) throw new Error(`faq count ${items.length} != ${patch.faq.length}`);
  let out = '', last = 0;
  items.forEach((m, i) => {
    out += o.slice(last, m.index);
    const p = patch.faq[i];
    out += p ? `{q:'${esc(p[0])}', a:'${p[1] === null ? m[2] : esc(p[1])}'}` : m[0];
    last = m.index + m[0].length;
  });
  o = out + o.slice(last);
}
s = s.slice(0, a) + o + s.slice(b);
fs.writeFileSync(f, s);
console.log('ok');
