// usage:
//   node tools/lang-map.js extract <tool>            → numbered list of the root <tool>.html <main> text nodes that need translating
//   node tools/lang-map.js write <tool> <file.json>  → file.json = {"fr":[...],"es":[...],"de":[...],"ru":[...]} in the same order
//                                                      (null = keep English, e.g. brand names); merged into lang-content/<lang>/<tool>.html <!--map:...-->
//   node tools/lang-map.js status                    → untranslated text nodes left per language page
// Then run `node build-lang-pages.js` to regenerate /fr|es|de|ru/<tool>/.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const [cmd, tool, file] = process.argv.slice(2);
const LANGS = ['fr', 'es', 'de', 'ru'];
function strings(html) {
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<(\w+)[^>]*data-i18n="[^"]*"[^>]*>[^<]*<\/\1>/g, '');
  const out = [];
  for (const m of main.matchAll(/>([^<>]+)</g)) {
    const t = m[1].trim();
    if (!t || !/[A-Za-z]{3,}/.test(t) || out.includes(t)) continue;
    out.push(t);
  }
  return out;
}
const esc = s => s.replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
if (cmd === 'extract') {
  strings(fs.readFileSync(path.join(ROOT, tool + '.html'), 'utf8')).forEach((t, i) => console.log(i + '\t' + t));
} else if (cmd === 'write') {
  const keys = strings(fs.readFileSync(path.join(ROOT, tool + '.html'), 'utf8'));
  const tr = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const lang of Object.keys(tr)) {
    if (tr[lang].length !== keys.length) { console.log(lang, 'LENGTH MISMATCH', tr[lang].length, 'vs', keys.length); process.exitCode = 1; continue; }
    const f = path.join(ROOT, 'lang-content', lang, tool + '.html');
    let src = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
    const old = src.match(/<!--map:([\s\S]*?)-->/);
    const map = old ? JSON.parse(old[1]) : {};
    keys.forEach((k, i) => { if (tr[lang][i] != null && tr[lang][i] !== k) map[k] = esc(tr[lang][i]); });
    const block = '<!--map:' + JSON.stringify(map, null, 0).replace(/","/g, '",\n"') + '-->';
    src = old ? src.replace(old[0], () => block) : (src ? src + '\n' : '') + block + '\n';
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, src);
    console.log(lang, tool, Object.keys(map).length, 'entries');
  }
} else if (cmd === 'status') {
  const tools = fs.readFileSync(path.join(ROOT, 'build-lang-pages.js'), 'utf8').match(/const TOOLS = \[([\s\S]*?)\]/)[1].match(/'[^']+'/g).map(s => s.slice(1, -1));
  for (const t of tools) {
    const keys = strings(fs.readFileSync(path.join(ROOT, t + '.html'), 'utf8'));
    const row = LANGS.map(l => {
      const p = path.join(ROOT, l, t, 'index.html');
      if (!fs.existsSync(p)) return l + ':-';
      const left = strings(fs.readFileSync(p, 'utf8')).filter(s => keys.includes(s)).length;
      return l + ':' + left;
    });
    console.log(t.padEnd(22), keys.length, row.join(' '));
  }
}
