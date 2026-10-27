const fs = require('fs'), path = require('path');
process.chdir('C:/Users/96896/Downloads/my-tools-site');
const SNIP = String.raw`<script>
(function () {
  function fix(s) {
    s = s.replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 1632; })
         .replace(/[\u06F0-\u06F9]/g, function (d) { return d.charCodeAt(0) - 1776; })
         .replace(/[\u066B\u060C]/g, '.')
         .replace(/,(?=\d{1,2}$)/, '.').replace(/,/g, '');
    return s.replace(/[^0-9.\-]/g, '');
  }
  function h(e) {
    var t = e.target;
    if (!t || t.tagName !== 'INPUT' || !t.hasAttribute('data-num')) return;
    var v = fix(t.value);
    if (v !== t.value) t.value = v;
  }
  document.addEventListener('input', h, true);
  document.addEventListener('change', h, true);
})();
</script>
`;
function walk(d, out) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (f === 'index.html') out.push(p.replace(/\\/g, '/'));
  }
  return out;
}
const files = walk('jo', []).filter(f => fs.readFileSync(f, 'utf8').includes('type="number"'));
let n = 0;
for (const f of files) {
  let h = fs.readFileSync(f, 'utf8');
  if (h.includes('data-num')) { console.log('skip', f); continue; }
  h = h.replace(/<input\b[^>]*type="number"[^>]*>/g, function (tag) {
    let t = tag.replace('type="number"', 'type="text" data-num');
    if (!/inputmode=/.test(t)) t = t.replace('type="text"', 'type="text" inputmode="decimal"');
    return t;
  });
  const i = h.lastIndexOf('</body>');
  if (i < 0) { console.log('no body end', f); continue; }
  h = h.slice(0, i) + SNIP + h.slice(i);
  fs.writeFileSync(f, h);
  n++;
}
console.log('patched', n, 'of', files.length);
fs.writeFileSync(process.env.TEMP + '/numfix_files.txt', files.join('\n'));
