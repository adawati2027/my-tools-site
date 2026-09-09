const KEY = 'a5ea7337c7887c9e2f59989180c48e33';
const HOST = 'adawati.space';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function main() {
  const sitemapRes = await fetch(`https://${HOST}/sitemap.xml`);
  const sitemapXml = await sitemapRes.text();
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  if (urls.length === 0) throw new Error('No URLs found in sitemap.xml');

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });
  console.log(`Submitted ${urls.length} URLs — IndexNow responded ${res.status} ${res.statusText}`);
  const text = await res.text();
  if (text) console.log(text);
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
