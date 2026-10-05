const fs = require('fs');
const files = process.argv.slice(2);
for (const f of files) {
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<head>[\s\S]*?<\/head>/, '');
  h = h.replace(/<(\w+)[^>]*data-i18n[^>]*>[\s\S]*?<\/\1>/g, '');
  const texts = [...h.matchAll(/>([^<>]*[A-Za-z]{3,}[^<>]*)</g)].map(m => m[1].trim()).filter(t => t && !/^[\s\d.,:%$()&;#-]*$/.test(t));
  const words = texts.join(' ').split(/\s+/).length;
  console.log(`${f}: ${texts.length} untagged text nodes, ~${words} words`);
  if (process.env.V) texts.forEach(t => console.log('   ', t.slice(0, 100)));
}
