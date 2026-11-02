// OSM (Overpass dumps) -> restaurants json. usage: node tools/osm-to-restaurants.js <ov_rest.json> <ov_places.json> <ov_streets.json> <existing data.js> <out.json>
const fs = require('fs');
const [fr, fp, fst, fd, fo, SRC = 'OpenStreetMap', MINC = '0'] = process.argv.slice(2);
const rest = JSON.parse(fs.readFileSync(fr, 'utf8'));
const places = JSON.parse(fs.readFileSync(fp, 'utf8')).filter(e => e.tags.place);
const streets = JSON.parse(fs.readFileSync(fst, 'utf8'));
global.window = {}; eval(fs.readFileSync(fd, 'utf8')); const existing = window.RESTS;
const ll = e => e.type === 'node' ? [e.lat, e.lon] : [e.center.lat, e.center.lon];
const dist = (a, b) => { const k = 111320, dx = (a[1] - b[1]) * k * Math.cos(a[0] * Math.PI / 180), dy = (a[0] - b[0]) * k; return Math.sqrt(dx * dx + dy * dy); };
const STREET = { 'شارع المدينة المنورة': 'شارع المدينة المنورة', 'شارع الجامعة': 'شارع الجامعة', 'شارع مكة': 'شارع مكة', 'شارع مكة المكرمة': 'شارع مكة' };
const segs = [];
streets.forEach(w => { const a = STREET[w.tags['name:ar']]; if (a && w.geometry) w.geometry.forEach(g => segs.push([a, [g.lat, g.lon]])); });
const AL = {
  'جبل عمان': 'جبل عمّان', 'البلد': 'وسط البلد', 'ماركا الشمالية': 'ماركا', 'ماركا الجنوبية': 'ماركا', 'منطقة ماركا': 'ماركا',
  'اسكان ماركا القديم': 'ماركا', 'اسكان ماركا الجديد': 'ماركا', 'عبدون الجنوبي': 'عبدون', 'التلاع الشرقي': 'تلاع العلي', 'التلاع الشمالي': 'تلاع العلي',
  'منطقة تلاع العلي': 'تلاع العلي', 'منطقة المقابلين': 'المقابلين', 'ام اذينة الغربي': 'أم أذينة', 'ام اذينة الشرقي': 'أم أذينة',
  'الرشيد': 'ضاحية الرشيد', 'حي الرشيد': 'ضاحية الرشيد', 'الياسمين': 'ضاحية الياسمين', 'الاميرة هيا': 'ضاحية الأميرة هيا', 'الأمير الحسن': 'ضاحية الأمير حسن',
  'الايمان': 'جاوا', 'الاحسان': 'جاوا', 'الوفاء': 'جاوا', 'التقوى': 'جاوا', 'جاوا الجنوبي': 'جاوا', 'جاوا الشمالي': 'جاوا',
  'مكة المكرمة': 'شارع مكة', 'الأخضر': 'الجبل الأخضر', 'ام السماق': 'أم السماق', 'منطقة القويسمة': 'القويسمة', 'منطقة أبو نصير': 'أبو نصير',
  'منطقة مرج الحمام': 'مرج الحمام', 'منطقة ناعور': 'ناعور', 'منطقة وادي السير': 'وادي السير', 'حي وادي السير': 'وادي السير', 'منطقة اليرموك': 'اليرموك',
  'منطقة المدينة': 'شارع المدينة المنورة', 'زهران': 'جبل عمّان', 'وادي صفراء': 'وسط البلد', 'رجم الشميساني': 'الشميساني', 'وادي الحدادة': 'وادي الحدادة', 'خربيه السوق': 'خريبة السوق', 'خربیه السوق': 'خريبة السوق', 'الطيبة وخريبة السوق': 'خريبة السوق', 'وادي أم الضباع': 'أم الضباع', 'خربة أم الضباع': 'أم الضباع', 'نفق الصحابة': 'الصحابة', 'الحدادة': 'وادي الحدادة', 'العدلية': 'العدلية', 'الأمير حمزة': 'الأمير حمزة', 'الجاردنز': 'الجاردنز'
};
const BAD = /مخيم|حي الزعتري|منطقة بدر|منطقة احد|^المحطة$|المطار|البلدية|الامانة|الجمارك/;
const clean = n => { if (AL[n]) return AL[n]; const m = n.replace(/^منطقة /, '').replace(/^حي /, ''); return AL[m] || m; };
const pl = places.map(p => ({ raw: (p.tags['name:ar'] || p.tags.name || '').trim(), c: ll(p) })).filter(p => p.raw && !BAD.test(p.raw)).map(p => ({ n: clean(p.raw), c: p.c }));
const SPORT = [[31.9857, 35.9037], [31.9858, 35.8978], [31.9830, 35.9046]];
const latinOnly = s => /[a-z]/i.test(s) && !/[؀-ۿ]/.test(s);
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '');
const CUI = [[/buffet|بوفيه|بوفية/, 'بوفيه مفتوح'], [/breakfast|brunch/, 'فطور'], [/burger/, 'برغر ووجبات سريعة'], [/pizza/, 'بيتزا'], [/chicken|fried/, 'دجاج'], [/kebab|grill|bbq|barbecue/, 'مشاوي'], [/seafood|fish/, 'مأكولات بحرية'], [/italian|pasta/, 'إيطالي'], [/chinese|asian|thai|sushi|japanese|korean|indian/, 'آسيوي'], [/shawarma|sandwich/, 'شاورما وسندويشات'], [/falafel|hummus|local|arab|oriental|jordanian|lebanese|syrian|mansaf|middle/, 'شرقي'], [/mexican|american|steak/, 'عالمي']];
const cuisine = (t, fast) => { const s = (t.cuisine || '').toLowerCase(); for (const [re, v] of CUI) if (re.test(s)) return v; return fast ? 'برغر ووجبات سريعة' : 'عالمي'; };
const url = (u, host) => { if (!u) return ''; if (!/^https?:/.test(u)) u = host ? 'https://' + host + '/' + u.replace(/^@/, '') : 'https://' + u; return u.replace(/^http:/, 'https:'); };
const EN = { abdoun: 'عبدون', sweifieh: 'الصويفية', sweifiyeh: 'الصويفية', swayfieh: 'الصويفية', jubeiha: 'الجبيهة', jubaiha: 'الجبيهة', khalda: 'خلدا', rabieh: 'الرابية', rabiah: 'الرابية', "tla'a al ali": 'تلاع العلي', 'tla al ali': 'تلاع العلي', shmeisani: 'الشميساني', shmeisany: 'الشميساني', 'jabal amman': 'جبل عمّان', weibdeh: 'جبل اللويبدة', webdeh: 'جبل اللويبدة', lweibdeh: 'جبل اللويبدة', marka: 'ماركا', tabarbour: 'طبربور', sweileh: 'صويلح', downtown: 'وسط البلد', 'al balad': 'وسط البلد', abdali: 'العبدلي', dabouq: 'دابوق', gardens: 'الجاردنز', 'mecca st': 'شارع مكة', 'university st': 'شارع الجامعة', 'madina': 'شارع المدينة المنورة', 'marj al hamam': 'مرج الحمام', 'um uthaina': 'أم أذينة', 'um uthayna': 'أم أذينة', 'sports city': 'المدينة الرياضية', 'airport road': 'طريق المطار', 'wadi saqra': 'وادي صقرة', 'rainbow': 'شارع الرينبو', 'jabal al hussein': 'جبل الحسين', muqabalain: 'المقابلين', 'abu nusair': 'أبو نصير', 'shafa badran': 'شفا بدران', naour: 'ناعور', 'abu alanda': 'أبو علندا', 'al jandaweel': 'الجندويل', jandawil: 'الجندويل', 'wadi alseer': 'وادي السير', 'wadi al seer': 'وادي السير', 'al yadudah': 'اليادودة', nazzal: 'نزال', 'al bayader': 'البيادر', bayader: 'البيادر', rawabi: 'الروابي', 'abu alia': 'أبو علياء' };
const KN = {}; [...new Set(existing.map(r => r.a))].forEach(a => KN[norm(a)] = a); Object.values(AL).forEach(a => KN[norm(a)] = a);
const fromAddr = a => { a = String(a || ''); const lo = a.toLowerCase(); let best = '', bl = 0;
  for (const k of Object.keys(EN)) if (lo.includes(k) && k.length > bl) { best = EN[k]; bl = k.length; }
  const na = norm(a); for (const k of Object.keys(KN)) if (k.length >= 5 && na.includes(k) && k.length > bl) { best = KN[k]; bl = k.length; }
  return best; };
const out = [], seen = new Set();
rest.forEach(e => {
  const t = e.tags; if (t._conf !== undefined && t._conf < +MINC) return; const n = (t['name:ar'] || (/[؀-ۿ]/.test(t.name || '') ? t.name : '')).trim();
  const en = (t['name:en'] || (latinOnly(t.name || '') ? t.name : '')).trim();
  const name = n || en; if (!name) return;
  const c = ll(e);
  let area = '', best = 1e9;
  for (const [a, p] of segs) { const d = dist(c, p); if (d < 90 && d < best) { best = d; area = a; } }
  if (!area && t._addr) area = fromAddr(t._addr);
  if (!area && SPORT.some(s => dist(c, s) < 1300)) area = 'المدينة الرياضية';
  if (!area) { best = 1e9; pl.forEach(p => { const d = dist(c, p.c); if (d < best) { best = d; area = p.n; } }); if (best > 2500) area = ''; }
  if (!area) return;
  const key = norm(en || name);
  if (/^(shawarma|restaurant|pizza|cafe|falafel)$/i.test(en || '') && !n) return;
  out.push({ name, en, area, cuisine: cuisine(t, t.amenity === 'fast_food'), c, key, nk: norm(n), sources: [SRC], website: url(t.website || t['contact:website']), instagram: url(t['contact:instagram'] || t.instagram, 'instagram.com'), facebook: url(t['contact:facebook'] || t.facebook, 'facebook.com'), phone: (t.phone || t['contact:phone'] || '').split(';')[0] });
});
const fin = [];
function post() {
  const cnt = {}; out.forEach(r => cnt[r.area] = (cnt[r.area] || 0) + 1);
  const exA = {}; existing.forEach(r => exA[r.a] = (exA[r.a] || 0) + 1);
  const big = a => (cnt[a] || 0) + (exA[a] || 0) >= 4;
  out.forEach(r => { if (!big(r.area)) { let b = 1e9, na = r.area; pl.forEach(p => { if (big(p.n)) { const d = dist(r.c, p.c); if (d < b) { b = d; na = p.n; } } }); if (b < 3500) r.area = na; } });
}
post(); post();
const nameCnt = {}; out.forEach(r => nameCnt[r.key] = (nameCnt[r.key] || 0) + 1);
out.forEach(r => {
  const exSame = existing.some(x => (norm(x.e || x.n) === r.key || (r.nk && norm(x.n) === r.nk)) && (x.a === r.area || nameCnt[r.key] < 3));
  if (exSame) return;
  const k = r.key + '|' + r.area; if (seen.has(k)) return; seen.add(k);
  delete r.c; delete r.key; delete r.nk; fin.push(r);
});
fs.writeFileSync(fo, JSON.stringify(fin, null, 1));
const c = {}; fin.forEach(r => c[r.area] = (c[r.area] || 0) + 1);
console.log(fin.length, Object.entries(c).sort((a, b) => b[1] - a[1]).map(x => x.join(':')).join(' | '));
