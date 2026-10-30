const MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const ORIGINS = ['https://adawati.space', 'https://www.adawati.space', 'capacitor://localhost', 'https://localhost', 'http://localhost'];
const LEVELS = ['tj', 'dip', 'bach', 'hd', 'mast', 'phd'];
const LANGS = ['ar', 'en', 'fr', 'de', 'es', 'tr', 'ru', 'it', 'zh'];

function json(o, s, origin) {
  return new Response(JSON.stringify(o), { status: s || 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': origin || 'https://adawati.space', 'Vary': 'Origin' } });
}
const clean = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]+/g, ' ').replace(/ {2,}/g, ' ').trim().slice(0, n);
const digits = (s) => String(s).replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632).replace(/\D/g, '');
function parseJson(t) {
  const a = t.indexOf('{'), z = t.lastIndexOf('}');
  if (a < 0 || z <= a) return null;
  try { return JSON.parse(t.slice(a, z + 1)); } catch (e) { return null; }
}
function bullets(v, max) {
  const arr = Array.isArray(v) ? v : String(v || '').split(/\n+/);
  return arr.map((x) => clean(x, 160).replace(/^[\-\*•·\d\.\)\s]+/, '')).filter(Boolean).slice(0, 4).map((x) => '• ' + x).join('\n').slice(0, max);
}
async function ask(env, sys, usr, tokens, temp) {
  const out = await env.AI.run(MODEL, { messages: [{ role: 'system', content: sys }, { role: 'user', content: usr }], max_tokens: tokens, temperature: temp });
  const r = out && out.response;
  return r && typeof r === 'object' ? JSON.stringify(r) : String(r || '');
}

async function summary(b, env, en, origin) {
  const field = clean(b.field, 80), years = clean(b.years, 10), title = clean(b.title, 60), skills = clean(b.skills, 200);
  if (field.length < 2) return json({ error: 'field' }, 400, origin);
  const sys = en
    ? 'You write concise, honest professional CV summaries. Output ONLY the summary text: 2 to 3 sentences, first person implied, no title, no quotes, no markdown. Never invent employers, degrees, numbers or achievements.'
    : 'أنت تكتب نبذة مهنية قصيرة وصادقة للسيرة الذاتية بلغة عربية فصحى بسيطة. اكتب النبذة فقط: من جملتين إلى ثلاث جمل، بدون عنوان وبدون علامات اقتباس وبدون تنسيق. لا تخترع أسماء شركات أو شهادات أو أرقاما أو إنجازات غير مذكورة.';
  const usr = (en ? 'Field: ' : 'مجال العمل: ') + field + (title ? (en ? '\nJob title: ' : '\nالمسمى الوظيفي: ') + title : '') + (years ? (en ? '\nYears of experience: ' : '\nسنوات الخبرة: ') + years : '') + (skills ? (en ? '\nSkills: ' : '\nالمهارات: ') + skills : '');
  const text = (await ask(env, sys, usr, 220, 0.6)).replace(/^["«\s]+|["»\s]+$/g, '').slice(0, 700);
  if (!text) return json({ error: 'empty' }, 502, origin);
  return json({ mode: 'summary', text }, 200, origin);
}

async function build(b, env, en, origin) {
  const about = clean(b.about, 1500);
  if (about.length < 8) return json({ error: 'about' }, 400, origin);
  const sys = (en ? 'Write all CV text in clear professional English.' : 'اكتب نصوص السيرة بالعربية الفصحى البسيطة.') +
    ' You turn a person\'s free-text self description into CV data. Reply with ONE JSON object only, no markdown, with exactly these keys: ' +
    '{"name":"","title":"","phone":"","email":"","city":"","summary":"","skills":[],"languages":[],"exp":[{"t":"","c":"","p":"","d":[]}],"edu":[{"lv":"","t":"","c":"","p":""}]}. ' +
    'Rules: use ONLY facts stated in the text; leave "" or [] when something is not stated. Copy name, phone, email exactly as written. ' +
    'NEVER invent employers, schools, dates, numbers, percentages or achievements. summary: 2-3 sentences. exp.t = job title, exp.c = employer, exp.p = period as written, exp.d = up to 3 short achievement/duty phrases rephrased from the text. ' +
    'edu.lv must be one of tj (high school), dip (diploma), bach (bachelor), hd (higher diploma), mast (master), phd, or "". edu.t = major, edu.c = university/school, edu.p = year. ' +
    'skills: up to 10 short skills, mentioned in the text or obviously implied by the stated job. languages: codes from ' + LANGS.join(',') + ' only for languages the text mentions.';
  const raw = await ask(env, sys, about, 1100, 0.3);
  const j = parseJson(raw);
  if (!j) return json({ error: 'parse' }, 502, origin);
  const aboutDigits = digits(about), aboutLow = about.toLowerCase();
  const phone = clean(j.phone, 30), email = clean(j.email, 60);
  const data = {
    name: clean(j.name, 60), title: clean(j.title, 60), city: clean(j.city, 60),
    phone: phone && digits(phone).length >= 7 && aboutDigits.includes(digits(phone)) ? phone : '',
    email: email && aboutLow.includes(email.toLowerCase()) ? email : '',
    summary: clean(j.summary, 500),
    skills: (Array.isArray(j.skills) ? j.skills : []).map((x) => clean(x, 40)).filter(Boolean).slice(0, 10),
    languages: (Array.isArray(j.languages) ? j.languages : []).filter((x) => LANGS.includes(x)).slice(0, 6),
    exp: (Array.isArray(j.exp) ? j.exp : []).slice(0, 5).map((x) => ({ t: clean(x && x.t, 80), c: clean(x && x.c, 80), p: clean(x && x.p, 80), d: bullets(x && x.d, 400) })).filter((x) => x.t || x.c),
    edu: (Array.isArray(j.edu) ? j.edu : []).slice(0, 3).map((x) => ({ lv: LEVELS.includes(x && x.lv) ? x.lv : '', t: clean(x && x.t, 80), c: clean(x && x.c, 80), p: clean(x && x.p, 80) })).filter((x) => x.t || x.c || x.lv)
  };
  return json({ mode: 'build', data }, 200, origin);
}

async function improve(b, env, en, origin) {
  const text = clean(b.text, 500), t = clean(b.t, 80), c = clean(b.c, 80);
  if (!text && !t) return json({ error: 'text' }, 400, origin);
  const sys = en
    ? 'You polish CV experience descriptions. Reply with 2 to 4 short bullet lines only, each starting with "• ", action verbs, no markdown, no intro. Keep only facts the user gave; never invent numbers, percentages, tools, employers or achievements. If the user gave no text, write general responsibilities typical for the job title, with no numbers.'
    : 'أنت تحسّن وصف الخبرة في السيرة الذاتية بالعربية الفصحى البسيطة. اكتب من سطرين إلى أربعة أسطر قصيرة فقط، كل سطر يبدأ بـ "• " وبفعل مضارع أو ماضٍ قوي، بدون مقدمة وبدون تنسيق. استخدم الحقائق التي كتبها المستخدم فقط، ولا تخترع أرقاما أو نسبا أو أدوات أو شركات أو إنجازات. إذا لم يكتب المستخدم نصا فاكتب مسؤوليات عامة معتادة لهذا المسمى بدون أرقام.';
  const usr = (en ? 'Job title: ' : 'المسمى: ') + t + (c ? (en ? '\nEmployer: ' : '\nالجهة: ') + c : '') + '\n' + (en ? 'Current text: ' : 'النص الحالي: ') + (text || '-');
  const out = bullets(await ask(env, sys, usr, 260, 0.5), 450);
  if (!out) return json({ error: 'empty' }, 502, origin);
  return json({ mode: 'improve', text: out }, 200, origin);
}

async function skillsMode(b, env, en, origin) {
  const title = clean(b.title, 60), field = clean(b.field, 80), have = clean(b.skills, 300), jobs = clean(b.jobs, 200);
  if (!title && !field && !jobs) return json({ error: 'title' }, 400, origin);
  const sys = en
    ? 'Suggest 8 relevant CV skills for the given job. Reply with ONE JSON object only: {"skills":["..."]}. Short (1-3 words each), realistic for the job, mix of technical and soft skills, none already in the user\'s list.'
    : 'اقترح ٨ مهارات مناسبة للسيرة الذاتية للوظيفة المذكورة بالعربية. أجب بكائن JSON واحد فقط: {"skills":["..."]}. كل مهارة من كلمة إلى ثلاث كلمات، واقعية للوظيفة، تجمع بين التقنية والشخصية، ولا تكرر مهارات المستخدم الحالية.';
  const usr = (en ? 'Job title: ' : 'المسمى: ') + (title || '-') + (field ? (en ? '\nField: ' : '\nالمجال: ') + field : '') + (jobs ? (en ? '\nPast roles: ' : '\nخبرات سابقة: ') + jobs : '') + (have ? (en ? '\nExisting skills: ' : '\nالمهارات الحالية: ') + have : '');
  const j = parseJson(await ask(env, sys, usr, 220, 0.5));
  const haveLow = have.toLowerCase();
  const list = (j && Array.isArray(j.skills) ? j.skills : []).map((x) => clean(x, 40)).filter((x) => x && !haveLow.includes(x.toLowerCase())).slice(0, 8);
  if (!list.length) return json({ error: 'empty' }, 502, origin);
  return json({ mode: 'skills', list }, 200, origin);
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
    const en = b.lang === 'en';
    const mode = String(b.mode || 'summary');
    try {
      if (mode === 'build') return await build(b, env, en, okOrigin);
      if (mode === 'improve') return await improve(b, env, en, okOrigin);
      if (mode === 'skills') return await skillsMode(b, env, en, okOrigin);
      return await summary(b, env, en, okOrigin);
    } catch (e) { return json({ error: 'ai' }, 502, okOrigin); }
  }
};
