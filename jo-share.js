(function () {
  var BTN_STYLE = 'flex:1;padding:11px;border:1px solid var(--border);border-radius:12px;background:var(--surface);color:var(--text);font-weight:700;font-family:inherit;font-size:14px;cursor:pointer;';
  var COPY = '📋 انسخ النتيجة';
  var SHARE = '🔗 شارك';

  function capture(exportBtn) {
    var got = null;
    var orig = window.exportResultImage;
    window.exportResultImage = function (title, rows) { got = { title: title, rows: rows || [] }; };
    try { exportBtn.click(); } catch (e) {}
    window.exportResultImage = orig;
    return got;
  }

  function buildText(exportBtn) {
    var c = capture(exportBtn);
    if (!c || !c.rows.length) return '';
    var lines = [c.title];
    c.rows.forEach(function (r) {
      var v = String(r.value == null ? '' : r.value).replace(/<[^>]*>/g, '').trim();
      lines.push(String(r.label).replace(/<[^>]*>/g, '').trim() + ': ' + v);
    });
    lines.push('');
    lines.push('احسبها بنفسك: ' + location.origin + location.pathname);
    return lines.join('\n');
  }

  function track(name) {
    try { if (typeof gtag === 'function') gtag('event', name, { page_path: location.pathname }); } catch (e) {}
  }

  function inject(exportBtn) {
    if (exportBtn.dataset.joShare) return;
    exportBtn.dataset.joShare = '1';
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;margin-top:10px;';
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.style.cssText = BTN_STYLE;
    copyBtn.textContent = COPY;
    var shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.style.cssText = BTN_STYLE;
    shareBtn.textContent = SHARE;
    row.appendChild(copyBtn);
    row.appendChild(shareBtn);
    exportBtn.insertAdjacentElement('afterend', row);

    copyBtn.addEventListener('click', function () {
      var txt = buildText(exportBtn);
      if (!txt) return;
      track('copy_result');
      navigator.clipboard.writeText(txt).then(function () {
        copyBtn.textContent = '✅ تم النسخ';
        setTimeout(function () { copyBtn.textContent = COPY; }, 1600);
      }).catch(function () {});
    });
    shareBtn.addEventListener('click', function () {
      var txt = buildText(exportBtn);
      if (!txt) return;
      track('share_result');
      if (navigator.share) navigator.share({ text: txt }).catch(function () {});
      else navigator.clipboard.writeText(txt).then(function () {
        shareBtn.textContent = '✅ تم النسخ';
        setTimeout(function () { shareBtn.textContent = SHARE; }, 1600);
      }).catch(function () {});
    });
  }

  function scan() {
    document.querySelectorAll('button[data-i18n="export_img_btn"]').forEach(inject);
  }

  function start() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
