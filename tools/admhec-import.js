// usage: node tools/admhec-import.js <file.html...> [--write]
// Imports admhec.gov.jo LeastAverages pages saved manually by the owner (Ctrl+S) into jo/students/bachelor-guide/index.html.
// University is taken from the page's selected dropdown value (not the filename); uses the latest year column.
// Without --write: prints a summary + unclassified majors only.
const fs = require('fs'), path = require('path');
const PAGE = path.join(__dirname, '../jo/students/bachelor-guide/index.html');
const UNIS = {
  '200': ['جامعة اليرموك', 'إربد'], '300': ['جامعة مؤتة', 'الكرك'], '400': ['جامعة العلوم والتكنولوجيا الأردنية', 'إربد'],
  '500': ['الجامعة الهاشمية', 'الزرقاء'], '600': ['جامعة آل البيت', 'المفرق'], '700': ['جامعة البلقاء التطبيقية', 'السلط'],
  '800': ['جامعة الحسين بن طلال', 'معان'], '900': ['جامعة الطفيلة التقنية', 'الطفيلة'], '1000': ['جامعة العلوم الإسلامية العالمية', 'عمّان']
};
const OVERRIDES = [
  ['law', /الجنائية والرقمية/], ['humanities', /جغراف|مكتبات|الموارد التراثية|التدريب الرياضي|الارشاد النفسي|الارشاد والصحة النفسية|الفنون الرقمية/],
  ['science', /مياه|اراضي|تربة|^(ال)?فيزياء/], ['health', /التغذية السريرية|التصنيع الدوائي|تجميل/], ['computing', /انترنت الاشياء/], ['business', /التسويق الرقمي|الاقتصاد الرقمي/]
];
const GROUPS = [
  ['law', /^(ال)?(قانون|حقوق)/], ['health', /(^|s|ال)طب|صيدل|تمريض|قبال|اشع|مختبر|بصريات|علاج|سمع|نطق|تخدير|صح[هة]|بيطري|اسنان|تاهيل|اسعاف|اطراف/],
  ['computing', /تطبيقات الاجهزه|تطبيقات الاجهزة|حاسوب|برمجيات|معلومات|شبكات|سيبراني|ذكاء|بيانات|وسائط|حوسب|انظمه|انظمة/],
  ['engineering', /هندس|عمار|انشاء المباني|مركبات|عمليات المستدامة/], ['education', /تربي|معلم|طفول|ارشاد نفسي|تعليم|رياض الاطفال/],
  ['business', /اداره|ادارة|محاسب|اقتصاد|تمويل|مالي|تسويق|اعمال|مصرفي|تامين|سياح|فندق|لوجست|ضريب|صيرف|ريادة|ازمات|مشاريع/],
  ['science', /رياضيات|فيزياء|كيمياء|احياء|حياتي|حيوي|علوم الارض|جيولوج|احصاء|زراع|بيئ|تغذي|غذا|نبات|حيوان|ذري|فلك|مياه|موارد|وقاية/],
  ['humanities', /لغ|ادب|اداب|تاريخ|جغراف|اجتماع|نفس|شريع|فقه|اصول|دعو|اعلام|اعلان|اذاع|علاقات|صحاف|فنون|موسيق|مسرح|اثار|تراث|سياسي|فلسف|ترجم|انثروبولوج|رياض|بدني|دراسات|انجليزي|عربي|فرنسي|الماني|اوروبي|ايطالي|اسباني|اسلامي|تصميم/]
];
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const args = process.argv.slice(2), write = args.includes('--write'), files = args.filter(a => a !== '--write');
const out = {};
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const sel = [...h.matchAll(/selected="selected" value="(\d+)"/g)].map(m => m[1]);
  const code = sel.find(c => UNIS[c]);
  if (!code) { console.log(f, '→ unknown university', sel); continue; }
  if (out[code]) { console.log(f, '→ duplicate of', UNIS[code][0], '(skipped)'); continue; }
  const rows = [...h.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m => [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(c => strip(c[1]))).filter(r => r.length > 2);
  const hdr = rows[0], yearCol = hdr.length - 1;
  const items = [];
  for (const r of rows.slice(1)) {
    const v = parseFloat(r[yearCol]);
    if (!r[0] || isNaN(v)) continue;
    const norm = r[0].replace(/[أإآ]/g, 'ا');
    const eng = /هندس|تكييف|طائرات|روبوتات|نانو/.test(norm) && !/حاسوب|برمجيات|شبكات/.test(norm) ? 'engineering' : null;
    const g = eng || (OVERRIDES.find(([, re]) => re.test(norm)) || [])[0] || (GROUPS.find(([, re]) => re.test(norm)) || [null])[0];
    items.push({ name: r[0], avg: v, g });
  }
  out[code] = { year: hdr[yearCol], items };
  if (process.env.SHOW) console.log(items.map(i => i.g + ':' + i.name).sort().join(' / '));
  console.log(f, '→', UNIS[code][0], '| year', hdr[yearCol], '|', items.length, 'majors | unclassified:', items.filter(i => !i.g).map(i => i.name).join('، ') || 'none');
}
if (!write) process.exit(0);
let page = fs.readFileSync(PAGE, 'utf8');
const NL = page.includes('\r\n') ? '\r\n' : '\n';
const today = new Date().toISOString().slice(0, 10);
const lines = page.split(NL);
let lastGov = -1;
lines.forEach((l, i) => { if (/universityType:"حكومية"/.test(l)) lastGov = i; });
for (const code of Object.keys(out)) {
  const [uni, city] = UNIS[code];
  for (let i = lines.length - 1; i >= 0; i--) if (lines[i].startsWith('{university:"' + uni + '",universityType:"حكومية"')) { lines.splice(i, 1); if (i <= lastGov) lastGov--; }
  const add = out[code].items.filter(it => it.g).map(it => '{university:"' + uni + '",universityType:"حكومية",city:"' + city + '",specialization:' + JSON.stringify(it.name) + ',specGroup:"' + it.g + '",minAvgCompetitive:' + it.avg + ',minAvgParallel:null,minAvgSingle:null,creditHours:null,tuitionPerHour:null,officialUrl:"https://www.admhec.gov.jo/LeastAverages.aspx",lastVerified:"' + today + '"},');
  lines.splice(lastGov + 1, 0, ...add);
  lastGov += add.length;
}
fs.writeFileSync(PAGE, lines.join(NL));
console.log('written');
