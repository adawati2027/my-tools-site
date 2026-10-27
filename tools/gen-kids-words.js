const fs = require('fs');
const OUT = 'C:/Users/96896/Downloads/my-tools-site/';
const { AR_W, TR, CATN, PAGE_AR } = require('./kids-words-i18n.js');
PAGE_AR['kids-first-words.html'].desc = 'تعلّم الإنجليزي للأطفال في الروضة (KG): أجزاء الجسم والحيوانات والطيور والفواكه والخضار ووسائل النقل، مع صوت ونطق إنجليزي وصور وترجمة عربية واختبار ممتع.';
PAGE_AR['kids-first-words.html'].ogTitle = 'إنجليزي للـ KG — كلمات بالصوت';
PAGE_AR['kids-colors-shapes.html'].desc = 'تعلّم الألوان والأشكال والأرقام من 1 إلى 20 وكلمات المدرسة بالإنجليزي لأطفال الروضة (KG)، مع صوت ونطق وترجمة عربية واختبار ممتع.';
PAGE_AR['kids-colors-shapes.html'].ogTitle = 'ألوان وأشكال وأرقام للـ KG بالصوت';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const PAGES = [
{
  file: 'kids-first-words.html',
  og: 'kids-first-words',
  title: 'English for Kindergarten (KG) — Words with Sound & Pictures | Adawati',
  ogTitle: 'English for KG — First Words with Sound',
  desc: 'Free English words for KG children: body parts, animals, birds, sea life, insects, flowers, fruits, vegetables and transport. Tap a picture to hear the word, then play the listen-and-pick quiz.',
  h1: 'English for KG — First Words',
  icon: '🗣️',
  sub: 'Tap a picture to hear the word — Ages 3–7',
  cats: 'FIRST',
  links: [['kids-colors-shapes.html', '🎨 Colors, Shapes & Numbers'], ['kids-alphabet.html', '🔤 ABC Alphabet'], ['kids-learn.html', '🧒 All Kids Tools']],
  faq: [
    ['What ages is this English page for?', 'It is made for kindergarten (KG) children, roughly ages 3 to 7, who are starting to learn English. Every word has a picture and a spoken voice, so children who cannot read yet can still learn.'],
    ['How does the sound work?', 'Tap any picture and your device reads the word aloud in English. The “Slow” button repeats it more slowly, and “Play all” reads the whole group one word after another. The voice comes from your own phone or computer.'],
    ['I cannot hear any sound. What should I check?', 'Make sure the volume is up and the phone is not in silent mode. Some browsers need one tap on the page before they will play speech. If it is still silent, try Chrome or Safari — the page uses the voice that is built into your device.'],
    ['What topics are included?', 'Parts of the body, wild animals, pets and farm animals, birds, sea animals, insects, flowers, fruits, vegetables and vehicles. Colors, shapes and numbers are on a separate page.'],
  ],
  aboutLearn: 'Children learn words fastest when they see, hear and say them together. Each card shows a picture with the spoken word, grouped by topic the way many KG English books do, so a child can move from “nose” and “hand” to “lion”, “apple” and “bus” in small, friendly steps.',
  aboutTips: 'Keep each session short (5–10 minutes) and pick one topic a day. Ask your child to say the word after the voice, point to the real thing at home or in the street, and use “Play all” as a warm-up before the quiz. Praise tries, not only correct answers.',
},
{
  file: 'kids-colors-shapes.html',
  og: 'kids-colors-shapes',
  title: 'Colors, Shapes & Numbers in English for KG Kids — With Sound | Adawati',
  ogTitle: 'Colors, Shapes & Numbers for KG — With Sound',
  desc: 'Free English page for KG children: learn colors, shapes, numbers 1–20 and school words. Tap to hear each word, then play the listen-and-pick quiz.',
  h1: 'Colors, Shapes & Numbers',
  icon: '🎨',
  sub: 'Tap to hear — English for KG, Ages 3–7',
  cats: 'BASICS',
  links: [['kids-first-words.html', '🗣️ English First Words'], ['kids-alphabet.html', '🔤 ABC Alphabet'], ['kids-learn.html', '🧒 All Kids Tools']],
  faq: [
    ['What will my child learn here?', 'Twelve basic colors, twelve shapes, the numbers 1 to 20 and common school words such as book, pencil and bag. Each one is shown clearly and read aloud in English.'],
    ['Do the numbers show the quantity too?', 'Yes. Each number card shows the digit, the English word and a row of dots so the child connects the symbol, the sound and the amount.'],
    ['Can we practise without reading?', 'Yes. In Quiz mode the voice says a word and the child taps the matching color, shape, number or object, so no reading is needed.'],
  ],
  aboutLearn: 'Colors, shapes and numbers are the first concepts in most KG English programs. Seeing the color or shape while hearing its English name helps children build vocabulary they can use straight away — “a red circle”, “three apples”.',
  aboutTips: 'Turn it into a game: ask your child to find something blue in the room, count the steps on the stairs in English, or spot a triangle on the way to school. Revisit the same group a few days in a row before moving on.',
},
];

const DATA = {};

const BODY = {
  hair: [60, 9], head: [60, 22], forehead: [60, 17], eye: [52, 27], ear: [40, 30], nose: [60, 33], mouth: [60, 41],
  neck: [60, 54], chin: [60, 47], shoulder: [37, 66], chest: [60, 78], arm: [26, 86], elbow: [19, 102], abdomen: [60, 106],
  wrist: [13, 124], hand: [10, 138], finger: [8, 151], thumb: [17, 140], thigh: [50, 138], knee: [48, 160], leg: [48, 178],
  ankle: [48, 194], foot: [43, 205], heel: [52, 207], toe: [36, 210],
};
function bodySvg(name) {
  const [x, y] = BODY[name];
  const skin = '#f5c9a0', stroke = '#d9a574';
  return `<svg viewBox="0 -8 120 234" class="bsvg" aria-hidden="true">` +
    `<g fill="${skin}" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="M37 66 L19 102 L13 124" fill="none" stroke="${skin}" stroke-width="10"/>` +
    `<path d="M83 66 L101 102 L107 124" fill="none" stroke="${skin}" stroke-width="10"/>` +
    `<path d="M51 120 L48 160 L48 196" fill="none" stroke="${skin}" stroke-width="14"/>` +
    `<path d="M69 120 L72 160 L72 196" fill="none" stroke="${skin}" stroke-width="14"/>` +
    `<rect x="38" y="60" width="44" height="64" rx="14"/>` +
    `<rect x="54" y="48" width="12" height="14" rx="4"/>` +
    `<circle cx="10" cy="136" r="6"/><circle cx="110" cy="136" r="6"/>` +
    `<ellipse cx="43" cy="205" rx="10" ry="5"/><ellipse cx="77" cy="205" rx="10" ry="5"/>` +
    `<circle cx="40" cy="30" r="4"/><circle cx="80" cy="30" r="4"/><circle cx="60" cy="28" r="20"/></g>` +
    `<path d="M40 24 Q42 6 60 6 Q78 6 80 24 Q70 14 60 14 Q50 14 40 24Z" fill="#6b4423"/>` +
    `<circle cx="52" cy="27" r="2" fill="#333"/><circle cx="68" cy="27" r="2" fill="#333"/>` +
    `<path d="M56 41 Q60 45 64 41" fill="none" stroke="#c0504d" stroke-width="2" stroke-linecap="round"/>` +
    `<circle cx="${x}" cy="${y}" r="11" fill="rgba(239,68,68,.4)" stroke="#ef4444" stroke-width="3"/>` +
    `<circle cx="${x}" cy="${y}" r="3" fill="#ef4444"/></svg>`;
}
const bodyWords = ['hair', 'head', 'forehead', 'eye', 'ear', 'nose', 'mouth', 'chin', 'neck', 'shoulder', 'chest', 'arm', 'elbow', 'wrist', 'hand', 'finger', 'thumb', 'abdomen', 'thigh', 'knee', 'leg', 'ankle', 'foot', 'heel', 'toe'];

const E = (arr) => arr.map(([e, w]) => ({ w, v: e }));

const FIRST = [
  { id: 'body', name: '🧍 Body', items: bodyWords.map(w => ({ w, v: bodySvg(w), say: w + '. Touch your ' + w + '.', subKey: w === 'abdomen' ? 'tummy' : '' })) },
  { id: 'wild', name: '🦁 Wild Animals', items: E([['🐘', 'elephant'], ['🦁', 'lion'], ['🐯', 'tiger'], ['🐆', 'leopard'], ['🐻', 'bear'], ['🦓', 'zebra'], ['🦒', 'giraffe'], ['🦏', 'rhinoceros'], ['🦛', 'hippopotamus'], ['🐒', 'monkey'], ['🦍', 'gorilla'], ['🐺', 'wolf'], ['🦊', 'fox'], ['🦌', 'deer'], ['🦬', 'bison'], ['🦘', 'kangaroo'], ['🐗', 'boar'], ['🐍', 'snake'], ['🐊', 'crocodile'], ['🐨', 'koala'], ['🐼', 'panda'], ['🐿️', 'squirrel'], ['🐸', 'frog'], ['🐢', 'tortoise']]) },
  { id: 'farm', name: '🐄 Pets & Farm', items: E([['🐶', 'dog'], ['🐱', 'cat'], ['🐄', 'cow'], ['🐐', 'goat'], ['🐑', 'sheep'], ['🐴', 'horse'], ['🐪', 'camel'], ['🐃', 'buffalo'], ['🫏', 'donkey'], ['🐷', 'pig'], ['🐰', 'rabbit'], ['🐭', 'mouse'], ['🐔', 'hen'], ['🐥', 'chick'], ['🦆', 'duck'], ['🐓', 'rooster']]) },
  { id: 'birds', name: '🦜 Birds', items: E([['🦜', 'parrot'], ['🦉', 'owl'], ['🦅', 'eagle'], ['🦚', 'peacock'], ['🐧', 'penguin'], ['🦢', 'swan'], ['🦩', 'flamingo'], ['🕊️', 'dove'], ['🐔', 'hen'], ['🐥', 'chick'], ['🦆', 'duck'], ['🦃', 'turkey']]) },
  { id: 'sea', name: '🐠 Sea Animals', items: E([['🐟', 'fish'], ['🐠', 'tropical fish'], ['🐋', 'whale'], ['🐬', 'dolphin'], ['🦈', 'shark'], ['🐙', 'octopus'], ['🦀', 'crab'], ['🦞', 'lobster'], ['🦐', 'shrimp'], ['🐢', 'turtle'], ['🦭', 'seal'], ['🐚', 'shell']]) },
  { id: 'insects', name: '🐝 Insects', items: E([['🐝', 'bee'], ['🐜', 'ant'], ['🦋', 'butterfly'], ['🐞', 'ladybird'], ['🦟', 'mosquito'], ['🪰', 'fly'], ['🕷️', 'spider'], ['🪳', 'cockroach'], ['🦗', 'grasshopper'], ['🐛', 'caterpillar'], ['🐌', 'snail'], ['🦂', 'scorpion']]) },
  { id: 'flowers', name: '🌹 Flowers', items: E([['🌹', 'rose'], ['🌻', 'sunflower'], ['🪷', 'lotus'], ['🌺', 'hibiscus'], ['🌷', 'tulip'], ['🌸', 'cherry blossom'], ['🌼', 'daisy'], ['💐', 'bouquet'], ['🌱', 'seedling'], ['🌳', 'tree']]) },
  { id: 'fruits', name: '🍎 Fruits', items: E([['🍎', 'apple'], ['🍌', 'banana'], ['🍊', 'orange'], ['🍇', 'grapes'], ['🍉', 'watermelon'], ['🍓', 'strawberry'], ['🍍', 'pineapple'], ['🥭', 'mango'], ['🍑', 'peach'], ['🍐', 'pear'], ['🍒', 'cherries'], ['🍋', 'lemon'], ['🥥', 'coconut'], ['🥝', 'kiwi'], ['🍈', 'melon'], ['🫐', 'blueberries']]) },
  { id: 'veg', name: '🥕 Vegetables', items: E([['🥕', 'carrot'], ['🍅', 'tomato'], ['🥔', 'potato'], ['🧅', 'onion'], ['🥒', 'cucumber'], ['🥬', 'cabbage'], ['🥦', 'broccoli'], ['🍆', 'eggplant'], ['🌶️', 'chilli'], ['🫑', 'capsicum'], ['🌽', 'corn'], ['🧄', 'garlic'], ['🍄', 'mushroom'], ['🍠', 'sweet potato'], ['🫘', 'beans']]) },
  { id: 'transport', name: '🚌 Transport', items: E([['🚗', 'car'], ['🚌', 'bus'], ['🚆', 'train'], ['✈️', 'aeroplane'], ['🚢', 'ship'], ['🚲', 'bicycle'], ['🛵', 'scooter'], ['🏍️', 'motorcycle'], ['🚁', 'helicopter'], ['🚑', 'ambulance'], ['🚒', 'fire engine'], ['🚓', 'police car'], ['🚙', 'jeep'], ['🚜', 'tractor'], ['🚚', 'truck'], ['🚕', 'taxi'], ['🛺', 'auto rickshaw'], ['🚀', 'rocket'], ['⛵', 'sailboat']]) },
];

const sw = (c, extra = '') => `<span class="sw" style="background:${c};${extra}"></span>`;
const colors = [['red', '#ef4444'], ['blue', '#2563eb'], ['yellow', '#facc15'], ['green', '#22c55e'], ['orange', '#f97316'], ['purple', '#8b5cf6'], ['pink', '#ec4899'], ['brown', '#92400e'], ['black', '#111827'], ['white', '#ffffff'], ['gray', '#9ca3af'], ['light blue', '#7dd3fc']];
const shp = (inner) => `<svg viewBox="0 0 100 100" class="shsvg" aria-hidden="true">${inner}</svg>`;
const shapes = [
  ['circle', `<circle cx="50" cy="50" r="38" fill="#3b82f6"/>`],
  ['square', `<rect x="14" y="14" width="72" height="72" fill="#ef4444"/>`],
  ['triangle', `<polygon points="50,10 92,88 8,88" fill="#22c55e"/>`],
  ['rectangle', `<rect x="6" y="26" width="88" height="48" fill="#f97316"/>`],
  ['oval', `<ellipse cx="50" cy="50" rx="44" ry="28" fill="#8b5cf6"/>`],
  ['star', `<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38" fill="#facc15"/>`],
  ['heart', `<path d="M50 88 C10 56 6 30 26 20 C40 14 50 26 50 32 C50 26 60 14 74 20 C94 30 90 56 50 88Z" fill="#ec4899"/>`],
  ['diamond', `<polygon points="50,6 92,50 50,94 8,50" fill="#06b6d4"/>`],
  ['pentagon', `<polygon points="50,8 93,40 77,90 23,90 7,40" fill="#84cc16"/>`],
  ['hexagon', `<polygon points="27,10 73,10 96,50 73,90 27,90 4,50" fill="#a855f7"/>`],
  ['crescent', `<path d="M64 8 A42 42 0 1 0 64 92 A32 32 0 1 1 64 8Z" fill="#f59e0b"/>`],
  ['plus sign', `<polygon points="36,8 64,8 64,36 92,36 92,64 64,64 64,92 36,92 36,64 8,64 8,36 36,36" fill="#14b8a6"/>`],
];
const numWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const dots = n => '<span class="dots">' + '●'.repeat(Math.min(n, 10)) + (n > 10 ? '<br>' + '●'.repeat(n - 10) : '') + '</span>';
const BASICS = [
  { id: 'colors', name: '🎨 Colors', items: colors.map(([w, c]) => ({ w, ar: w === 'orange' ? 'برتقالي' : undefined, v: sw(c, c === '#ffffff' ? 'border:2px solid #cbd5e1;' : '') })) },
  { id: 'shapes', name: '🔺 Shapes', items: shapes.map(([w, s]) => ({ w, v: shp(s) })) },
  { id: 'numbers', name: '🔢 Numbers', items: numWords.map((w, i) => ({ w, v: `<span class="num">${i + 1}</span>`, sub: dots(i + 1), say: (i + 1) + '. ' + w + '.' })) },
  { id: 'school', name: '🎒 School', items: E([['📚', 'book'], ['✏️', 'pencil'], ['🖍️', 'crayon'], ['🎒', 'school bag'], ['📏', 'ruler'], ['✂️', 'scissors'], ['📒', 'notebook'], ['🖊️', 'pen'], ['🎨', 'paint'], ['⏰', 'clock'], ['🌍', 'globe'], ['💻', 'computer'], ['🔔', 'bell'], ['🧮', 'abacus']]) },
];
DATA.FIRST = FIRST; DATA.BASICS = BASICS;

function pageTexts(p, lang) {
  const src = lang === 'ar' ? PAGE_AR[p.file] : { title: p.title, h1: p.h1, sub: p.sub, faq: p.faq, aboutLearn: p.aboutLearn, aboutTips: p.aboutTips, links: p.links.map(l => l[1]) };
  const o = { title: src.title, h1: src.h1, sub: src.sub, aboutLearn: src.aboutLearn, aboutTips: src.aboutTips };
  src.faq.forEach((f, i) => { o['faq' + i + 'q'] = f[0]; o['faq' + i + 'a'] = f[1]; });
  src.links.forEach((l, i) => { o['link' + i] = l; });
  return o;
}

function build(p, lang) {
  const cats = DATA[p.cats];
  const slug = p.file.replace('.html', '');
  const isAr = lang === 'ar';
  const enUrl = 'https://adawati.space/' + p.file;
  const arUrl = 'https://adawati.space/ar/' + slug + '/';
  const url = isAr ? arUrl : enUrl;
  const ogImg = 'https://adawati.space/og/' + p.og + '.png';
  const T = pageTexts(p, lang);
  const trUI = TR[lang];
  const desc = isAr ? PAGE_AR[p.file].desc : p.desc;
  const ogTitle = isAr ? PAGE_AR[p.file].ogTitle : p.ogTitle;
  const faqJson = p.faq.map((f, i) => `{"@type":"Question","name":${JSON.stringify(T['faq' + i + 'q'])},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(T['faq' + i + 'a'])}}}`).join(',\n');
  const faqHtml = p.faq.map((f, i) => `    <details style="margin-top:12px;border:1px solid var(--border);border-radius:8px;padding:12px;">
      <summary style="font-weight:700;cursor:pointer;font-size:14px;" data-t="faq${i}q">${esc(T['faq' + i + 'q'])}</summary>
      <p style="margin-top:8px;font-size:14px;color:var(--text-muted);line-height:1.7;" data-t="faq${i}a">${esc(T['faq' + i + 'a'])}</p>
    </details>`).join('\n');
  const pre = isAr ? '' : '';
  const href = h => isAr ? (h === 'kids-learn.html' ? 'ar/kids-learn/' : /^kids-(first-words|colors-shapes)\.html$/.test(h) ? 'ar/' + h.replace('.html', '') + '/' : h) : h;
  const links = p.links.map(([h, t], i) => `<a href="${href(h)}" class="btn" style="background:var(--surface-2);color:var(--text);text-decoration:none;" data-t="link${i}">${esc(T['link' + i])}</a>`).join('\n      ');
  const catsJson = JSON.stringify(cats.map(c => ({ id: c.id, name: c.name, items: c.items.map(i => { const o = { w: i.w, v: i.v }; if (i.say) o.say = i.say; if (i.sub) o.sub = i.sub; if (i.subKey) o.subKey = i.subKey; const a = i.ar || AR_W[i.w]; if (!a) throw new Error('no ar for ' + i.w); o.ar = a; return o; }) }))).replace(/</g, '\\u003c');
  const ptJson = JSON.stringify({ en: pageTexts(p, 'en'), ar: pageTexts(p, 'ar') });
  const alt = `<link rel="alternate" hreflang="en" href="${enUrl}">\n<link rel="alternate" hreflang="ar" href="${arUrl}">\n<link rel="alternate" hreflang="x-default" href="${enUrl}">`;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
<meta charset="UTF-8">
${isAr ? '<base href="https://adawati.space/">\n' : ''}<link rel="preload" as="font" type="font/woff2" href="fonts/cairo-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="fonts/cairo-arabic.woff2" crossorigin>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-97DQT5FHPF"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-97DQT5FHPF');</script>
<script>try{(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=(localStorage.getItem("adawati_ad_consent")==="personalized")?0:1;}catch(e){}</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3337905412116301" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<link rel="icon" href="/icon-192.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#2563eb">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<title>${esc(T.title)}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
${alt}
<meta property="og:title" content="${ogTitle} | ${isAr ? 'أدواتي' : 'Adawati'}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle} | ${isAr ? 'أدواتي' : 'Adawati'}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImg}">
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"WebApplication","@id":"${url}#app","name":${JSON.stringify(T.h1)},"url":"${url}","description":${JSON.stringify(desc)},"applicationCategory":"EducationalApplication","operatingSystem":"All","inLanguage":"${lang}","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}},
{"@type":"FAQPage","mainEntity":[
${faqJson}
]}]}
</script>
<link rel="stylesheet" href="style.css?v=4">
<style>
.fw-tabs{display:flex;gap:8px;justify-content:center;margin-bottom:12px;}
.fw-tab{padding:9px 22px;border-radius:99px;border:2px solid transparent;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit;background:var(--surface-2);color:var(--text);}
.fw-tab.active{background:var(--primary);color:#fff;}
.fw-cats{display:flex;gap:6px;overflow-x:auto;padding:4px 2px 10px;margin-bottom:8px;-webkit-overflow-scrolling:touch;}
.fw-cat{flex:0 0 auto;padding:7px 13px;border-radius:99px;border:2px solid var(--border);background:var(--surface-2);font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;color:var(--text);white-space:nowrap;}
.fw-cat.active{border-color:var(--primary);background:var(--primary);color:#fff;}
.fw-big{text-align:center;padding:18px 12px;background:linear-gradient(135deg,#fef9c3,#fde68a);border-radius:20px;margin-bottom:12px;cursor:pointer;min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.fw-big:active{transform:scale(.98);}
.fw-vis{font-size:96px;line-height:1.1;height:130px;display:flex;align-items:center;justify-content:center;direction:ltr;}
.fw-word{font-size:34px;font-weight:900;color:#1e293b;margin:6px 0 2px;text-transform:capitalize;direction:ltr;}
.fw-ar{font-size:24px;font-weight:800;color:#b45309;min-height:30px;}
.fw-sub{font-size:14px;font-weight:700;color:#475569;min-height:20px;}
.fw-acts{display:flex;gap:10px;justify-content:center;margin-bottom:12px;flex-wrap:wrap;}
.fw-acts button{padding:10px 16px;border-radius:12px;border:2px solid var(--border);background:var(--surface-2);font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;color:var(--text);}
.fw-acts button:hover{border-color:var(--primary);}
.fw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;}
.fw-item{background:var(--surface-2);border-radius:12px;padding:8px 4px;text-align:center;cursor:pointer;border:2px solid transparent;font-weight:800;}
.fw-item:hover,.fw-item.on{border-color:var(--primary);}
.fw-item .iv{font-size:38px;line-height:1.2;height:48px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.fw-item .iw{font-size:12px;color:var(--text);margin-top:2px;text-transform:capitalize;direction:ltr;}
.fw-item .ia{font-size:12px;color:#b45309;font-weight:700;}
.fw-item.txt .iv{display:none;}
.fw-item.txt{padding:14px 4px;}
.fw-item.txt .iw{font-size:14px;margin:0;}
.bsvg{height:100%;width:auto;max-width:100%;}
.fw-big .bsvg{height:210px;}
.fw-vis:has(.bsvg){height:auto;}
.shsvg{height:100%;width:auto;}
.fw-big .shsvg{height:120px;}
.sw{display:inline-block;width:1em;height:1em;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.2);}
.fw-item .sw{width:38px;height:38px;}
.fw-big .sw{width:110px;height:110px;}
.num{font-size:.9em;font-weight:900;color:#2563eb;}
.dots{font-size:13px;letter-spacing:2px;color:#f97316;line-height:1.3;}
.fw-item .iv .num{font-size:30px;}
.q-vis{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;max-width:360px;margin:12px auto;}
.q-ch{padding:10px;border-radius:16px;border:3px solid var(--border);background:var(--surface-2);cursor:pointer;height:116px;display:flex;align-items:center;justify-content:center;font-size:62px;font-family:inherit;color:inherit;overflow:hidden;}
.q-ch:hover{border-color:var(--primary);}
.q-ch.correct{background:#dcfce7;border-color:#22c55e;}
.q-ch.wrong{background:#fee2e2;border-color:#ef4444;}
.q-ch .shsvg{height:96px;}
.q-ch .bsvg{height:140px;}
.q-ch:has(.bsvg){height:160px;}
.q-ch .sw{width:70px;height:70px;}
.q-ch .num{font-size:56px;}
@media(max-width:380px){.fw-vis{font-size:80px}.q-ch{height:100px;font-size:52px}}
</style>
</head>
<body>
<nav class="navbar"><div class="nav-container">
  <a href="/" class="nav-brand">${isAr ? 'أدواتي' : 'Adawati'}</a>
  <div class="nav-links"><a href="${isAr ? 'ar/kids-learn/' : 'kids-learn.html'}" id="navKids" data-t="kids">${trUI.kids}</a><a href="/" id="navHome" data-t="home">${trUI.home}</a></div>
</div></nav>

<main><div class="tool-page">
  <div class="page-header"><a href="${isAr ? 'ar/kids-learn/' : 'kids-learn.html'}" id="backToKids" data-t="back">${trUI.back}</a></div>
  <div class="card">
    <div class="card-icon" style="background:#fef9c3;">${p.icon}</div>
    <h1 class="card-title" data-t="h1">${esc(T.h1)}</h1>
    <div class="card-subtitle" data-t="sub">${esc(T.sub)}</div>
    <div class="divider"></div>

    <div class="fw-tabs">
      <button class="fw-tab active" data-mode="learn" id="tabLearn" data-t="tabLearn">${trUI.tabLearn}</button>
      <button class="fw-tab" data-mode="quiz" id="tabQuiz" data-t="tabQuiz">${trUI.tabQuiz}</button>
    </div>
    <div class="fw-cats" id="cats"></div>

    <div id="learnMode">
      <div class="fw-big" id="big" role="button" tabindex="0">
        <div class="fw-vis" id="bigVis"></div>
        <div class="fw-word" id="bigWord"></div>
        <div class="fw-ar" id="bigAr"></div>
        <div class="fw-sub" id="bigSub">${trUI.tap}</div>
      </div>
      <div class="fw-acts">
        <button id="btnSlow" data-t="slow">${trUI.slow}</button>
        <button id="btnPlayAll">${trUI.playAll}</button>
      </div>
      <div class="fw-grid" id="grid"></div>
    </div>

    <div id="quizMode" style="display:none;">
      <div id="qUI">
        <div style="font-size:14px;font-weight:700;color:var(--text-muted);text-align:center;margin-bottom:6px;" id="qScore"></div>
        <div style="font-size:16px;font-weight:700;text-align:center;margin-bottom:8px;" data-t="quizPrompt">${trUI.quizPrompt}</div>
        <div class="fw-acts"><button id="qHear" data-t="hearAgain">${trUI.hearAgain}</button></div>
        <div class="q-vis" id="qChoices"></div>
        <div style="font-size:20px;font-weight:800;text-align:center;min-height:28px;" id="qFeedback"></div>
      </div>
      <div id="qDone" style="display:none;"></div>
    </div>
  </div>

  <div class="card" style="margin-top:16px;">
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
      ${links}
    </div>
  </div>
  <div class="card" style="margin-top:16px;">
    <div class="card-title" style="font-size:15px;" data-t="faqTitle">${trUI.faqTitle}</div>
${faqHtml}
  </div>

<!--kids-about-->
  <div class="card" style="margin-top:16px;">
    <h2 class="card-title" style="font-size:16px;" data-t="aboutHead">${trUI.aboutHead}</h2>
    <h3 style="font-size:15px;margin-top:10px;" data-t="aboutLearnH">${trUI.aboutLearnH}</h3>
    <p style="font-size:14px;color:var(--text-muted);line-height:1.8;" data-t="aboutLearn">${esc(T.aboutLearn)}</p>
    <h3 style="font-size:15px;margin-top:10px;" data-t="aboutTipsH">${trUI.aboutTipsH}</h3>
    <p style="font-size:14px;color:var(--text-muted);line-height:1.8;" data-t="aboutTips">${esc(T.aboutTips)}</p>
    <p style="font-size:13px;color:var(--text-muted);line-height:1.8;" data-t="aboutNote">${trUI.aboutNote}</p>
  </div>
<!--/kids-about-->
</div></main>

<script>
const CATS = ${catsJson};
const TR = ${JSON.stringify(TR)};
const CATN = ${JSON.stringify(CATN)};
const PT = ${ptJson};
const SLUG = '${slug}';
let lang = '${lang}', ready = false;
let cat = CATS[0], idx = 0, mode = 'learn', playing = false;
const $ = id => document.getElementById(id);
const say = i => i.say || i.w;
const ui = k => ((TR[lang] || TR.en)[k]) || TR.en[k];
const fill = (s, o) => s.replace(/\\{(\\w+)\\}/g, (m, k) => o[k]);
const pt = k => ((PT[lang] || PT.en)[k]) || PT.en[k];

function wantPath(l) { return l === 'ar' ? '/ar/' + SLUG + '/' : '/' + SLUG + '.html'; }
window.onLangChange = function (l) {
  if (!TR[l]) l = 'en';
  const here = location.pathname.replace(/index\\.html$/, '');
  const want = wantPath(l);
  if (/^https?:/.test(location.protocol) && here !== want) { location.replace(want + location.search + location.hash); return; }
  lang = l;
  if (ready) applyLang();
};

function catLabel(c) {
  const e = c.name.split(' ')[0];
  const n = (CATN[c.id] && CATN[c.id][lang]) || c.name.slice(e.length + 1);
  return e + ' ' + n;
}

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-t]').forEach(el => { const k = el.dataset.t; const v = TR[lang] && TR[lang][k] !== undefined ? TR[lang][k] : (PT[lang] && PT[lang][k] !== undefined ? PT[lang][k] : (TR.en[k] !== undefined ? TR.en[k] : PT.en[k])); if (v !== undefined) el.textContent = v; });
  document.title = pt('title');
  const kidsHref = lang === 'ar' ? '/ar/kids-learn/' : '/kids-learn.html';
  ['navKids', 'backToKids'].forEach(id => { const a = $(id); if (a) a.setAttribute('href', kidsHref); });
  $('btnPlayAll').textContent = playing ? ui('stop') : ui('playAll');
  buildCats(); buildGrid(); showBig();
  if (mode === 'quiz') $('qScore').textContent = qLine();
}

function speak(text, rate, onend) {
  if (!window.speechSynthesis) { if (onend) onend(); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = rate || 0.8;
  if (onend) { u.onend = onend; u.onerror = onend; }
  speechSynthesis.speak(u);
}

function showBig() {
  const it = cat.items[idx];
  $('bigVis').innerHTML = it.v;
  $('bigWord').textContent = it.w;
  $('bigAr').textContent = lang === 'ar' ? it.ar : '';
  $('bigSub').innerHTML = it.sub || (it.subKey ? ui(it.subKey) : ui('tap'));
  document.querySelectorAll('.fw-item').forEach((el, n) => el.classList.toggle('on', n === idx));
}

function buildCats() {
  $('cats').innerHTML = CATS.map(c => '<button class="fw-cat' + (c === cat ? ' active' : '') + '" data-id="' + c.id + '">' + catLabel(c) + '</button>').join('');
}

function buildGrid() {
  $('grid').innerHTML = cat.items.map((it, n) => { const t = it.v.indexOf('bsvg') > -1; return '<div class="fw-item' + (t ? ' txt' : '') + '" data-n="' + n + '"><div class="iv">' + (t ? '' : it.v) + '</div><div class="iw">' + it.w + '</div>' + (lang === 'ar' ? '<div class="ia">' + it.ar + '</div>' : '') + '</div>'; }).join('');
}

function stopAll() { playing = false; $('btnPlayAll').textContent = ui('playAll'); if (window.speechSynthesis) speechSynthesis.cancel(); }

function pickCat(id) {
  stopAll();
  cat = CATS.find(c => c.id === id) || CATS[0];
  idx = 0;
  buildCats();
  if (mode === 'quiz') startQuiz(); else { buildGrid(); showBig(); }
}

function playAll() {
  if (playing) { stopAll(); return; }
  playing = true; $('btnPlayAll').textContent = ui('stop');
  let n = 0;
  (function next() {
    if (!playing || n >= cat.items.length) { stopAll(); return; }
    idx = n++; showBig();
    speak(say(cat.items[idx]), 0.8, () => setTimeout(next, 450));
  })();
}

function setMode(m) {
  stopAll(); mode = m;
  $('learnMode').style.display = m === 'learn' ? '' : 'none';
  $('quizMode').style.display = m === 'quiz' ? '' : 'none';
  $('tabLearn').classList.toggle('active', m === 'learn');
  $('tabQuiz').classList.toggle('active', m === 'quiz');
  if (m === 'quiz') startQuiz(); else { buildGrid(); showBig(); }
}

let qOrder = [], qi = 0, qScore = 0, qAns = false, QN = 10;
const qLine = () => fill(ui('qLine'), { a: qi + 1, b: QN, s: qScore });
function startQuiz() {
  const pool = cat.items.slice().sort(() => Math.random() - .5);
  QN = Math.min(10, pool.length);
  qOrder = pool.slice(0, QN); qi = 0; qScore = 0;
  renderQ();
}
function renderQ() {
  if (qi >= QN) {
    const pct = Math.round(qScore / QN * 100);
    $('qUI').style.display = 'none';
    $('qDone').innerHTML = '<div style="text-align:center;padding:24px;background:linear-gradient(135deg,#fef9c3,#fde68a);border-radius:16px;"><div style="font-size:60px;">🏆</div><div style="font-size:22px;font-weight:900;color:#1e293b;margin:10px 0;">' + (pct >= 80 ? ui('superstar') : pct >= 50 ? ui('great') : ui('keep')) + '</div><div style="font-size:15px;color:#475569;">' + fill(ui('scoreLbl'), { s: qScore, n: QN }) + '</div><button class="btn btn-primary" id="qAgain" style="margin-top:16px;">' + ui('again') + '</button></div>';
    $('qDone').style.display = 'block';
    return;
  }
  $('qDone').style.display = 'none'; $('qUI').style.display = '';
  const a = qOrder[qi];
  const seen = new Set([a.w]);
  const wrong = [];
  cat.items.slice().sort(() => Math.random() - .5).forEach(x => { if (wrong.length < 3 && !seen.has(x.w)) { seen.add(x.w); wrong.push(x); } });
  const ch = [a].concat(wrong).sort(() => Math.random() - .5);
  $('qScore').textContent = qLine();
  $('qChoices').innerHTML = ch.map(c => '<button class="q-ch" data-w="' + c.w + '">' + c.v + '</button>').join('');
  $('qFeedback').textContent = '';
  qAns = false;
  speak(a.w, 0.8);
}
function answer(btn) {
  if (qAns) return; qAns = true;
  const a = qOrder[qi];
  const nm = a.w + (lang === 'ar' ? ' (' + a.ar + ')' : '');
  if (btn.dataset.w === a.w) { btn.classList.add('correct'); qScore++; $('qFeedback').textContent = ui('correct') + ' ' + nm; speak('Correct! ' + a.w, 0.9); }
  else {
    btn.classList.add('wrong');
    document.querySelectorAll('.q-ch').forEach(b => { if (b.dataset.w === a.w) b.classList.add('correct'); });
    $('qFeedback').textContent = ui('itIs') + ' ' + nm; speak('It is ' + a.w, 0.8);
  }
  setTimeout(() => { qi++; renderQ(); }, 1700);
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.fw-tab').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('cats').addEventListener('click', e => { const b = e.target.closest('.fw-cat'); if (b) pickCat(b.dataset.id); });
  $('grid').addEventListener('click', e => {
    const el = e.target.closest('.fw-item'); if (!el) return;
    stopAll(); idx = +el.dataset.n; showBig(); speak(say(cat.items[idx]), 0.8);
  });
  const big = $('big');
  const hear = () => { stopAll(); speak(say(cat.items[idx]), 0.8); };
  big.addEventListener('click', hear);
  big.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hear(); } });
  $('btnSlow').addEventListener('click', () => { stopAll(); speak(cat.items[idx].w, 0.45); });
  $('btnPlayAll').addEventListener('click', playAll);
  $('qHear').addEventListener('click', () => speak(qOrder[qi].w, 0.8));
  $('quizMode').addEventListener('click', e => {
    if (e.target.closest('#qAgain')) { startQuiz(); return; }
    const c = e.target.closest('.q-ch'); if (c) answer(c);
  });
  ready = true;
  applyLang();
});
</script>
<script src="i18n-lang-${isAr ? 'ar' : 'en'}.js?v=3" defer></script>
<script src="i18n.js?v=63" defer></script>
</body></html>
`;
}

for (const p of PAGES) {
  fs.writeFileSync(OUT + p.file, build(p, 'en'));
  const dir = OUT + 'ar/' + p.file.replace('.html', '') + '/';
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + 'index.html', build(p, 'ar'));
}
console.log('ok');
