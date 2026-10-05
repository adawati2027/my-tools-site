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
