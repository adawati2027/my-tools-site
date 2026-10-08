// usage: node tools/fill-data-t.js <page.html...>
// Pages that translate via data-t="key" + a `const WT = {ar:{...},en:{...}}` object ship placeholder text (Q1/A1...) in the
// static HTML. This fills each data-t element with the page's default-language value so crawlers see real content.
const fs = require('fs');
for (const f of process.argv.slice(2)) {
  let h = fs.readFileSync(f, 'utf8');
  const m = h.match(/const WT = (\{[\s\S]*?\n\});/);
  if (!m) { console.log('no WT', f); continue; }
  const WT = new Function('return ' + m[1])();
  const lang = (h.match(/<html[^>]*lang="([a-z]+)"/) || [])[1] || 'ar';
  const T = WT[lang] || WT.ar;
  let n = 0;
  h = h.replace(/(<([a-z0-9]+)[^>]*data-t="([a-z0-9_]+)"[^>]*>)([^<]*)(<\/\2>)/g, (all, open, tag, key, txt, close) => {
    if (typeof T[key] !== 'string' || T[key] === txt) return all;
    n++; return open + T[key].replace(/&(?![a-z#0-9]+;)/g, '&amp;').replace(/</g, '&lt;') + close;
  });
  fs.writeFileSync(f, h);
  console.log(f, lang, n, 'filled');
}
