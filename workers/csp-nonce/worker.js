const TROY_OZ_IN_GRAMS = 31.1034768;

async function handleGoldFallback(request, env, ctx) {
  const url = new URL(request.url);
  const currency = (url.searchParams.get('currency') || 'USD').toUpperCase();

  const cache = caches.default;
  const cacheKey = new Request(url.origin + url.pathname + '?currency=' + currency, { method: 'GET' });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const goldHeaders = {};
    if (env && env.GOLDPRICE_API_KEY) goldHeaders['Authorization'] = 'Bearer ' + env.GOLDPRICE_API_KEY;
    const goldRes = await fetch('https://api.goldprice.dev/v1/prices?symbol=XAU-USD-SPOT', { headers: goldHeaders });
    if (!goldRes.ok) throw new Error('goldprice.dev http ' + goldRes.status);
    const goldData = await goldRes.json();
    const symbol = goldData.symbols && goldData.symbols[0];
    if (!symbol || !symbol.price) throw new Error('goldprice.dev empty response');
    const usdPerOz = parseFloat(symbol.price);

    const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!rateRes.ok) throw new Error('open.er-api.com http ' + rateRes.status);
    const rateData = await rateRes.json();
    const rate = rateData.rates && rateData.rates[currency];
    if (!rate) throw new Error('no rate for ' + currency);

    const price24 = (usdPerOz / TROY_OZ_IN_GRAMS) * rate;
    const response = new Response(JSON.stringify({ price24, currency, source: 'goldprice.dev+open.er-api.com', usdPerOz, rate }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
    });
    if (ctx && ctx.waitUntil) ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: 'fallback_failed', message: String(err && err.message || err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const API_CORS = { 'Access-Control-Allow-Origin': '*' };

function apiError(status, error) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', ...API_CORS }
  });
}

async function loadUsdRates() {
  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error('rates upstream ' + res.status);
  const data = await res.json();
  if (data.result !== 'success' || !data.rates) throw new Error('rates upstream invalid');
  return data;
}

async function loadGoldSpotUsd(env) {
  const headers = {};
  if (env && env.GOLDPRICE_API_KEY) headers['Authorization'] = 'Bearer ' + env.GOLDPRICE_API_KEY;
  const res = await fetch('https://api.goldprice.dev/v1/prices?symbol=XAU-USD-SPOT', { headers });
  if (!res.ok) throw new Error('gold upstream ' + res.status);
  const data = await res.json();
  const symbol = data.symbols && data.symbols[0];
  if (!symbol || !symbol.price) throw new Error('gold upstream empty');
  return parseFloat(symbol.price);
}

async function handleApiV1(request, env, ctx) {
  if (request.method !== 'GET') return apiError(405, 'method_not_allowed');
  const url = new URL(request.url);
  const cache = caches.default;
  const cacheKey = new Request(url.origin + url.pathname + url.search, { method: 'GET' });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let body;
  let maxAge;
  try {
    if (url.pathname === '/api/v1/rates') {
      const data = await loadUsdRates();
      body = {
        base: 'USD',
        updated: data.time_last_update_utc,
        source: 'Exchange Rate API (open.er-api.com)',
        provider_url: data.provider,
        rates: data.rates
      };
      maxAge = 3600;
    } else {
      const currency = (url.searchParams.get('currency') || 'USD').toUpperCase();
      if (!/^[A-Z]{3}$/.test(currency)) return apiError(400, 'invalid_currency');
      const [usdPerOz, rateData] = await Promise.all([loadGoldSpotUsd(env), loadUsdRates()]);
      const rate = rateData.rates[currency];
      if (!rate) return apiError(400, 'unsupported_currency');
      body = {
        metal: 'gold',
        karat: 24,
        unit: 'gram',
        type: 'spot',
        currency,
        price: Math.round((usdPerOz / TROY_OZ_IN_GRAMS) * rate * 100) / 100,
        usd_per_troy_oz: usdPerOz,
        rate,
        fetched_at: new Date().toISOString(),
        source: 'goldprice.dev (XAU/USD spot) + Exchange Rate API (open.er-api.com)',
        note: 'International spot price converted to the requested currency. Not a local market price.'
      };
      maxAge = 60;
    }
  } catch (err) {
    return apiError(502, 'upstream_failed');
  }

  const response = new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=' + maxAge, ...API_CORS }
  });
  if (ctx && ctx.waitUntil) ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const incomingUrlEarly = new URL(request.url);
    if (incomingUrlEarly.pathname === '/api/gold-fallback') {
      return handleGoldFallback(request, env, ctx);
    }
    if (incomingUrlEarly.pathname === '/api/v1/rates' || incomingUrlEarly.pathname === '/api/v1/gold') {
      return handleApiV1(request, env, ctx);
    }
    try {
      const incomingUrl = new URL(request.url);
      const originUrl = 'https://adawati.space' + incomingUrl.pathname + incomingUrl.search;
      const originRequest = new Request(originUrl, request);
      const response = await fetch(originRequest);
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        return response;
      }
      const nonceBytes = crypto.getRandomValues(new Uint8Array(16));
      let binary = '';
      for (const b of nonceBytes) { binary += String.fromCharCode(b); }
      const nonce = btoa(binary);
      const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'nonce-" + nonce + "' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.adtrafficquality.google https://static.cloudflareinsights.com https://www.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://apis.google.com https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://api.country.is https://open.er-api.com https://xaus.com https://api.aladhan.com https://api.open-meteo.com https://api.frankfurter.app https://api.exchangerate-api.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google; frame-src https://accounts.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self' https://buttondown.com";
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Content-Security-Policy', csp);
      newHeaders.delete('Content-Security-Policy-Report-Only');
      newHeaders.set('X-CSP-Nonce-Worker', 'enforced');
      class ScriptNonceHandler {
        element(el) {
          if (!el.hasAttribute('src')) {
            el.setAttribute('nonce', nonce);
          }
        }
      }
      const rewriter = new HTMLRewriter().on('script', new ScriptNonceHandler());
      return rewriter.transform(new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      }));
    } catch (err) {
      try {
        const incomingUrl2 = new URL(request.url);
        const originUrl2 = 'https://adawati.space' + incomingUrl2.pathname + incomingUrl2.search;
        return await fetch(new Request(originUrl2, request));
      } catch (err2) {
        return new Response('Upstream error', { status: 502 });
      }
    }
  }
};
