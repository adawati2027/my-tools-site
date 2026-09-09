const CACHE = 'adawati-v60';
const BASE = '';
const STATIC = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/style.css',
  BASE + '/i18n.js',
  BASE + '/manifest.json',
  BASE + '/icon-192.svg',
  BASE + '/icon-512.svg',
  BASE + '/bmi-calculator.html',
  BASE + '/diet-plan.html',
  BASE + '/currency-converter.html',
  BASE + '/loan-calculator.html',
  BASE + '/age-calculator.html',
  BASE + '/discount-calculator.html',
  BASE + '/tip-calculator.html',
  BASE + '/unit-converter.html',
  BASE + '/password-generator.html',
  BASE + '/word-counter.html',
  BASE + '/qr-generator.html',
  BASE + '/timezone-converter.html',
  BASE + '/random-number.html',
  BASE + '/stopwatch.html',
  BASE + '/about.html',
  BASE + '/contact.html',
  BASE + '/privacy.html',
  BASE + '/terms.html',
  BASE + '/vat-calculator.html',
  BASE + '/salary-calculator.html',
  BASE + '/end-of-service.html',
  BASE + '/hijri-converter.html',
  BASE + '/percentage-calculator.html',
  BASE + '/compound-interest.html',
  BASE + '/date-diff.html',
  BASE + '/image-compressor.html',
  BASE + '/number-guess.html',
  BASE + '/memory-game.html',
  BASE + '/file-converter.html',
  BASE + '/quick-math.html',
  BASE + '/reaction-test.html',
  BASE + '/car-game.html',
  BASE + '/jump-game.html',
  BASE + '/kids-learn.html',
  BASE + '/om/',
  BASE + '/ae/',
  BASE + '/sa/',
  BASE + '/us/',
  BASE + '/uk/',
  BASE + '/jo/',
  BASE + '/in/',
  BASE + '/pk/',
  BASE + '/oman-salary-guide.html',
  BASE + '/oman-labour-law-guide.html',
  BASE + '/oman-working-hours-guide.html',
  BASE + '/oman-visa-guide.html',
  BASE + '/oman-cost-of-living.html',
  BASE + '/bd/',
  BASE + '/eg/',
  BASE + '/ph/',
  BASE + '/kids-math.html',
  BASE + '/kids-times-tables.html',
  BASE + '/kids-alphabet.html',
  BASE + '/kids-clock.html',
  BASE + '/kids-spelling.html',
  BASE + '/kids-flags.html',
  BASE + '/kids-science.html',
  BASE + '/kids-money.html',
  BASE + '/kids-typing.html',
  BASE + '/omr-to-inr.html',
  BASE + '/omr-to-pkr.html',
  BASE + '/omr-to-bdt.html',
  BASE + '/omr-to-egp.html',
  BASE + '/omr-to-php.html',
  BASE + '/oman-tax-guide.html',
  BASE + '/oman-vat-guide.html',
  BASE + '/oman-minimum-wage.html',
  BASE + '/oman-loan-guide.html',
  BASE + '/oman-salary-slip-guide.html',
];

self.addEventListener('install', e => {
  self.skipWaiting(); // take control immediately without waiting for c.addAll
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(STATIC).then(() =>
        // Dynamically precache every URL in sitemap.xml so new pages (e.g. jo/ tools
        // and games added after this list was last hand-edited) get offline support
        // without needing a matching manual entry here.
        fetch(BASE + '/sitemap.xml').then(r => r.text()).then(xml => {
          const LANG_PREFIXES = ['/jo/', '/ar/', '/fr/', '/es/', '/de/', '/ru/'];
          const paths = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g))
            .map(m => { try { return new URL(m[1]).pathname; } catch (err) { return null; } })
            .filter(p => p && LANG_PREFIXES.some(prefix => p.startsWith(BASE + prefix)));
          return Promise.all(paths.map(p => c.add(p).catch(() => {})));
        }).catch(() => {})
      )
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()).then(() =>
      self.clients.matchAll({type:'window'}).then(clients =>
        clients.forEach(c => c.postMessage({type:'SW_UPDATED'}))
      )
    )
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Firebase Auth/Firestore + Google Sign-In: let the browser handle these natively.
  // Auth/Firestore calls are POSTs — Cache.put() throws on non-GET, and these must
  // never be served stale anyway.
  if (url.hostname === 'www.gstatic.com' || url.hostname === 'identitytoolkit.googleapis.com'
      || url.hostname === 'securetoken.googleapis.com' || url.hostname === 'firestore.googleapis.com'
      || url.hostname === 'accounts.google.com' || url.hostname === 'apis.google.com') {
    return;
  }
  // Network-first for live currency APIs
  if (url.hostname === 'open.er-api.com' || url.hostname === 'api.frankfurter.app' || url.hostname === 'api.exchangerate-api.com' || url.hostname === 'api.country.is') {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  // Network-first for CDN resources
  if (url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const fetchPromise = fetch(e.request).then(resp => { cache.put(e.request, resp.clone()); return resp; });
          return cached || fetchPromise;
        })
      )
    );
    return;
  }
  // Network-first for HTML + i18n.js + style.css — always fresh, cache as offline fallback
  const isHTML = url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  const isCore = url.pathname.endsWith('/i18n.js') || url.pathname.endsWith('/style.css') || url.pathname.endsWith('/quiz-engine.js');
  if (isHTML || isCore) {
    e.respondWith(
      fetch(e.request, {cache: 'no-cache'}).then(resp => {
        if (resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // Cache-first for static assets (CSS, JS, images, fonts)
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      if (resp.status === 200) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
