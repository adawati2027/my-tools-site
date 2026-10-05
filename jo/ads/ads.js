var ADS_CATS = { shop: '🏪 محل', project: '🚀 مشروع', service: '🛠️ خدمة', page: '📱 صفحة', other: '✨ غير ذلك' };
var ADS_STATUS = { pending: '⏳ قيد المراجعة', changes: '✏️ مطلوب تعديل', approved: '✅ منشور', rejected: '⛔ مرفوض' };

function adsEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function adsSafeUrl(u) {
  u = String(u || '').trim();
  return /^https?:\/\/[^\s<>"']+$/i.test(u) ? u : '';
}

function adsLinkLabel(u) {
  try {
    var h = new URL(u).hostname.replace(/^www\./, '');
    if (/instagram\./.test(h)) return '📸 إنستغرام';
    if (/facebook\.|fb\./.test(h)) return '📘 فيسبوك';
    if (/tiktok\./.test(h)) return '🎵 تيك توك';
    if (/wa\.me|whatsapp\./.test(h)) return '💬 واتساب';
    if (/x\.com|twitter\./.test(h)) return '𝕏 إكس';
    if (/youtube\.|youtu\.be/.test(h)) return '▶️ يوتيوب';
    if (/maps\.|goo\.gl/.test(h)) return '📍 الموقع على الخريطة';
    return '🔗 ' + h;
  } catch (e) { return '🔗 رابط'; }
}

function adsLinksHtml(links) {
  return (links || []).map(adsSafeUrl).filter(Boolean).map(function(u) {
    return '<a href="' + adsEsc(u) + '" target="_blank" rel="nofollow sponsored ugc noopener" class="ads-link">' + adsEsc(adsLinkLabel(u)) + '</a>';
  }).join('');
}

function adsFb() {
  return loadFirebaseAuth();
}

function adsOnUser(cb) {
  adsFb().then(function(fb) {
    fb.auth.onAuthStateChanged(function(user) { cb(user, fb); });
  }).catch(function() { cb(null, null); });
}

function adsIsAdmin(fb, user) {
  if (!user) return Promise.resolve(false);
  return fb.db.collection('admins').doc(user.uid).get()
    .then(function(d) { return d.exists; })
    .catch(function() { return false; });
}

function adsSignInPrompt(el, text) {
  el.innerHTML = '<div style="text-align:center;padding:18px;">' +
    '<p style="font-size:14px;color:var(--text-muted);margin-bottom:12px;">' + adsEsc(text) + '</p>' +
    '<button type="button" class="ads-btn ads-signin">🔐 سجّل دخول / أنشئ حساب</button></div>';
  el.querySelector('.ads-signin').addEventListener('click', function() { openAuthModal(); });
}

function adsDate(ts) {
  try { return ts && ts.toDate ? ts.toDate().toLocaleDateString('ar-JO', { year: 'numeric', month: 'long', day: 'numeric' }) : ''; }
  catch (e) { return ''; }
}

function adsCardHtml(id, a) {
  return '<a class="ads-card card" href="jo/ads/view/?id=' + encodeURIComponent(id) + '">' +
    '<div class="ads-card-top"><span class="ads-cat">' + adsEsc(ADS_CATS[a.category] || '') + '</span>' +
    (a.city ? '<span class="ads-city">📍 ' + adsEsc(a.city) + '</span>' : '') + '</div>' +
    '<div class="ads-title">' + adsEsc(a.title) + '</div>' +
    '<div class="ads-desc">' + adsEsc((a.description || '').slice(0, 140)) + ((a.description || '').length > 140 ? '…' : '') + '</div>' +
    '<div class="ads-meta">❤️ ' + (a.likeCount || 0) + '</div></a>';
}

var ADS_DURATIONS = [[7, '7 أيام'], [14, 'أسبوعين'], [30, 'شهر'], [60, 'شهرين'], [90, '3 شهور'], [0, 'بدون حد']];

function adsDurationSelect(def) {
  return '<select class="dur" style="padding:9px;border:1px solid var(--border);border-radius:8px;font-family:inherit;font-size:15px;">' +
    ADS_DURATIONS.map(function(d) { return '<option value="' + d[0] + '"' + (d[0] === def ? ' selected' : '') + '>⏱️ ' + d[1] + '</option>'; }).join('') + '</select>';
}

function adsExpiresFromDays(days) {
  days = Number(days) || 0;
  return days > 0 ? firebase.firestore.Timestamp.fromMillis(Date.now() + days * 86400000) : null;
}

function adsExpired(a) {
  return !!(a.expiresAt && a.expiresAt.toMillis && a.expiresAt.toMillis() < Date.now());
}

function adsExpiryText(a) {
  if (a.status !== 'approved') return '';
  if (!a.expiresAt) return '♾️ بدون تاريخ انتهاء';
  return adsExpired(a) ? '⌛ انتهت مدته بتاريخ ' + adsDate(a.expiresAt) : '⏱️ بينتهي بتاريخ ' + adsDate(a.expiresAt);
}

var ADS_IG_URL = 'https://www.instagram.com/adawati2027/';
var ADS_IG_HANDLE = '@adawati2027';

function adsCompressImage(file) {
  return new Promise(function(resolve, reject) {
    if (!file || !/^image\//.test(file.type)) return reject(new Error('type'));
    var reader = new FileReader();
    reader.onerror = function() { reject(new Error('read')); };
    reader.onload = function() {
      var img = new Image();
      img.onerror = function() { reject(new Error('decode')); };
      img.onload = function() {
        var max = 900, w = img.width, h = img.height;
        if (w > max || h > max) { var r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
        var q = 0.7, out = c.toDataURL('image/jpeg', q);
        while (out.length > 450000 && q > 0.3) { q -= 0.1; out = c.toDataURL('image/jpeg', q); }
        out.length > 590000 ? reject(new Error('size')) : resolve(out);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function adsIgProfileUrl(h) {
  h = adsIgHandle(h).slice(1);
  return h ? 'https://www.instagram.com/' + h + '/' : '';
}

function adsIgHandle(h) {
  h = String(h || '').trim().replace(/^@/, '').replace(/^(https?:\/\/)?(www\.|m\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '');
  return /^[A-Za-z0-9._]{1,30}$/.test(h) ? '@' + h : '';
}
