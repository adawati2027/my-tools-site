const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const ORIGINS = ['https://adawati.space', 'https://www.adawati.space', 'capacitor://localhost', 'https://localhost', 'http://localhost'];

function json(o, s, origin) {
  return new Response(JSON.stringify(o), { status: s || 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': origin || 'https://adawati.space', 'Vary': 'Origin' } });
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const okOrigin = ORIGINS.includes(origin) ? origin : 'https://adawati.space';
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': okOrigin, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' } });
    if (req.method !== 'POST') return json({ error: 'method' }, 405, okOrigin);
    if (origin && !ORIGINS.includes(origin)) return json({ error: 'origin' }, 403, okOrigin);
    const ip = req.headers.get('CF-Connecting-IP') || 'x';
    if (env.LIMIT) { const r = await env.LIMIT.limit({ key: ip }); if (!r.success) return json({ error: 'rate' }, 429, okOrigin); }
    let b; try { b = await req.json(); } catch (e) { return json({ error: 'bad' }, 400, okOrigin); }
    const field = String(b.field || '').trim().slice(0, 80);
    const years = String(b.years || '').trim().slice(0, 10);
    const title = String(b.title || '').trim().slice(0, 60);
    const skills = String(b.skills || '').trim().slice(0, 200);
    const en = b.lang === 'en';
    if (field.length < 2) return json({ error: 'field' }, 400, okOrigin);
    const sys = en
      ? 'You write concise, honest professional CV summaries. Output ONLY the summary text: 2 to 3 sentences, first person implied, no title, no quotes, no markdown. Never invent employers, degrees, numbers or achievements.'
      : 'أنت تكتب نبذة مهنية قصيرة وصادقة للسيرة الذاتية بلغة عربية فصحى بسيطة. اكتب النبذة فقط: من جملتين إلى ثلاث جمل، بدون عنوان وبدون علامات اقتباس وبدون تنسيق. لا تخترع أسماء شركات أو شهادات أو أرقاما أو إنجازات غير مذكورة.';
    const usr = (en ? 'Field: ' : 'مجال العمل: ') + field + (title ? (en ? '\nJob title: ' : '\nالمسمى الوظيفي: ') + title : '') + (years ? (en ? '\nYears of experience: ' : '\nسنوات الخبرة: ') + years : '') + (skills ? (en ? '\nSkills: ' : '\nالمهارات: ') + skills : '');
    try {
      const out = await env.AI.run(MODEL, { messages: [{ role: 'system', content: sys }, { role: 'user', content: usr }], max_tokens: 220, temperature: 0.6 });
      const text = String(out && out.response || '').replace(/^["«\s]+|["»\s]+$/g, '').slice(0, 700);
      if (!text) return json({ error: 'empty' }, 502, okOrigin);
      return json({ text }, 200, okOrigin);
    } catch (e) { return json({ error: 'ai' }, 502, okOrigin); }
  }
};
