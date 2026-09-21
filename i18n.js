(function() {
  try {
    var capApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (capApp) {
      capApp.addListener('appUrlOpen', function(data) {
        if (data && data.url && data.url !== location.href) location.href = data.url;
      });
    }
  } catch (e) {}
})();

var T = window.T = window.T || {};
var I18N_BASE = (function() {
  try {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/i18n\.js(\?.*)?$/, '');
  } catch (e) {}
  return '';
})();
var _langPackPromises = {};
function loadLangPack(lang) {
  if (T[lang]) return Promise.resolve();
  if (_langPackPromises[lang]) return _langPackPromises[lang];
  var p = new Promise(function(resolve, reject) {
    var s = document.createElement('script');
    s.src = I18N_BASE + 'i18n-lang-' + lang + '.js?v=1';
    s.onload = function() { resolve(); };
    s.onerror = function() { reject(new Error('lang pack failed: ' + lang)); };
    document.head.appendChild(s);
  });
  _langPackPromises[lang] = p;
  return p;
}

const LABELS = {ar:'عر', en:'EN', fr:'FR', es:'ES', de:'DE', ru:'RU'};

function setLang(lang) {
  localStorage.setItem('lang', lang);
  if (!T[lang]) {
    loadLangPack(lang).then(function() { setLang(lang); }).catch(function() {
      if (lang !== 'en') loadLangPack('en').then(function() { setLang('en'); });
    });
    return;
  }
  const t = T[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.textContent = t[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-ph');
    if (t[k] !== undefined) el.placeholder = t[k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.getAttribute('data-i18n-html');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });
  document.querySelectorAll('.fav-star[data-id]').forEach(el => {
    const id = el.getAttribute('data-id');
    el.title = isFav(id) ? (t.remove_fav || 'Remove from Favorites') : (t.add_fav || 'Add to Favorites');
  });
  const cl = document.getElementById('currentLang');
  if (cl) cl.textContent = LABELS[lang] || lang.toUpperCase();
  const menu = document.getElementById('langMenu');
  if (menu) menu.classList.remove('open');
  // Brand name: Arabic script for AR, Latin for all others
  const brandName = lang === 'ar' ? 'أدواتي' : 'Adawati';
  document.querySelectorAll('.nav-brand, .footer-brand').forEach(function(el) {
    el.textContent = brandName;
  });
  updateAuthBtn();
  // Re-render country section cards with the new language
  const cc = sessionStorage.getItem('adawati_country');
  if (cc && typeof COUNTRY_DATA !== 'undefined' && COUNTRY_DATA[cc] && document.getElementById('countrySection')) {
    renderCountrySection(cc);
  }
  // Update <title> and meta description per page
  const page = _getPageSlug();
  if (PAGE_META[page]) {
    const pm = PAGE_META[page];
    if (pm.title && pm.title[lang]) document.title = pm.title[lang];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && pm.desc && pm.desc[lang]) metaDesc.setAttribute('content', pm.desc[lang]);
  }
  // Render FAQ section if page has one in PAGE_FAQ
  renderFAQ(lang);
  // Fire per-page language hook
  if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  // Hide English-only static sections for non-English
  document.querySelectorAll('[lang="en"]:not(html)').forEach(function(el) {
    el.style.display = lang === 'en' ? '' : 'none';
  });
}

function toggleLangMenu() {
  document.getElementById('langMenu').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.lang-switcher')) {
    const m = document.getElementById('langMenu');
    if (m) m.classList.remove('open');
  }
});

/* ── Auth (Firebase, lazy-loaded — see loadFirebaseAuth) ── */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ",
  authDomain: "adawati-challenges.firebaseapp.com",
  projectId: "adawati-challenges",
  storageBucket: "adawati-challenges.firebasestorage.app",
  messagingSenderId: "360902823980",
  appId: "1:360902823980:web:bd85f87de77dcfc315c189"
};
let _fbAuthReady = null;
function loadFirebaseAuth() {
  if (_fbAuthReady) return _fbAuthReady;
  _fbAuthReady = new Promise(function(resolve, reject) {
    function loadScript(src) {
      return new Promise(function(res, rej) {
        const s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    Promise.resolve()
      .then(function() { return (typeof firebase === 'undefined') ? loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js') : null; })
      .then(function() { return (typeof firebase.auth === 'function') ? null : loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js'); })
      .then(function() { return (typeof firebase.firestore === 'function') ? null : loadScript('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js'); })
      .then(function() {
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        const authInst = firebase.auth();
        // Explicit LOCAL persistence, awaited before the auth object is ever
        // used — without this, signInWithRedirect() on some mobile/embedded
        // browsers completes the OAuth exchange server-side (confirmed via a
        // live redirect-chain trace: Google returns a real auth code) but
        // getRedirectResult() on the landing page still resolves to a null
        // user with no error, because the SDK's pending-redirect marker
        // wasn't durably persisted before the page navigated away. Relying
        // on the SDK's unstated default persistence is what was broken.
        return authInst.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
          resolve({ auth: authInst, db: firebase.firestore() });
        });
      })
      .catch(reject);
  });
  return _fbAuthReady;
}

function mergeArraysUnion(a, b) {
  return Array.from(new Set([].concat(a || [], b || [])));
}

function onAuthSuccessSync(user) {
  try { localStorage.setItem('adawati_uid', user.uid); } catch (e) {}
  return loadFirebaseAuth().then(function(fb) {
    const ref = fb.db.collection('users').doc(user.uid);
    return ref.get().then(function(snap) {
      const localFavs = getFavs(), localRecent = getRecent();
      let mergedFavs = localFavs, mergedRecent = localRecent.slice(0, 6);
      if (snap.exists) {
        const cloud = snap.data() || {};
        mergedFavs = mergeArraysUnion(localFavs, cloud.favorites);
        mergedRecent = mergeArraysUnion(cloud.recent, localRecent).slice(0, 6);
      }
      saveFavs(mergedFavs);
      localStorage.setItem('adawati_recent', JSON.stringify(mergedRecent));
      return ref.set({ favorites: mergedFavs, recent: mergedRecent, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
        .then(function() {
          if (document.getElementById('toolsGrid')) { renderFavSection(); renderRecentSection(); injectStarBtns(); }
        });
    });
  }).catch(function() { /* offline, or Firestore rules for users/{uid} not deployed yet — local stays authoritative */ });
}

function syncFavsToCloud() {
  if (typeof firebase === 'undefined' || !firebase.auth || !firebase.auth().currentUser || !navigator.onLine) return;
  firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    .set({ favorites: getFavs(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
    .catch(function() {});
}
function syncRecentToCloud() {
  if (typeof firebase === 'undefined' || !firebase.auth || !firebase.auth().currentUser || !navigator.onLine) return;
  firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    .set({ recent: getRecent(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
    .catch(function() {});
}

function restoreSessionIfAny() {
  let hasUid = false;
  try { hasUid = !!localStorage.getItem('adawati_uid'); } catch (e) {}
  if (!hasUid) return;
  loadFirebaseAuth().then(function(fb) {
    fb.auth.onAuthStateChanged(function(user) {
      if (user) { onAuthSuccessSync(user); updateAuthBtn(); }
    });
  }).catch(function() {});
}

function getCurrentAuthUser() {
  return (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
}

function injectAuthBtn() {
  const nav = document.querySelector('.nav-links');
  if (!nav || document.getElementById('authNavBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'authNavBtn';
  btn.style.cssText = 'background:none;border:none;font-family:inherit;font-size:14px;cursor:pointer;color:inherit;padding:6px 4px;';
  btn.onclick = openAuthModal;
  const darkBtn = document.getElementById('darkToggleBtn');
  const langSwitcher = nav.querySelector('.lang-switcher');
  if (darkBtn) nav.insertBefore(btn, darkBtn);
  else if (langSwitcher) nav.insertBefore(btn, langSwitcher);
  else nav.appendChild(btn);
  updateAuthBtn();
}

function updateAuthBtn() {
  const btn = document.getElementById('authNavBtn');
  if (!btn) return;
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const user = getCurrentAuthUser();
  if (user) {
    const label = (user.displayName || user.email || '').split(' ')[0].split('@')[0];
    btn.textContent = '👤 ' + label;
  } else {
    btn.textContent = t.signup_btn || 'Sign Up';
  }
}

let _authMode = 'signup';

function openAuthModal() {
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const user = getCurrentAuthUser();
  const existing = document.getElementById('signupModal');
  if (existing) existing.remove();
  // Kick off the Firebase SDK fetch now, while the modal is just opening —
  // not lazily inside the Google button's own click handler. On a cold
  // load, loadFirebaseAuth() has to fetch 3 external scripts over the
  // network before signInWithPopup() can even be called; that delay is
  // enough for iOS Safari's popup blocker to decide the window.open() call
  // is no longer "synchronous with the user gesture" and silently kill the
  // popup — which is exactly what a generic "Something went wrong" report
  // right after tapping Google on a phone looks like. Preloading here means
  // loadFirebaseAuth() is normally already resolved/cached by the time the
  // user actually taps the Google button, so signInWithPopup() fires within
  // the same click's activation window instead of after a network round trip.
  loadFirebaseAuth().catch(function() {});

  const modal = document.createElement('div');
  modal.id = 'signupModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';

  const box = document.createElement('div');
  // color-scheme:light is required here, not just background:#fff — without
  // it, a phone set to system dark mode makes the browser auto-dark-style
  // native <input> elements (dark fill, washed-out text) even though this
  // box's own background stays explicitly white, since color-scheme is what
  // actually governs default form-control rendering, not the parent bg.
  box.style.cssText = 'background:#fff;color:#0f172a;color-scheme:light;border-radius:16px;padding:32px 28px;max-width:380px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.15);';

  if (user) {
    box.style.textAlign = 'center';
    const avatar = document.createElement('div');
    avatar.style.cssText = 'font-size:48px;margin-bottom:12px;';
    avatar.textContent = '👤';
    const greeting = document.createElement('div');
    greeting.style.cssText = 'font-size:20px;font-weight:700;margin-bottom:4px;';
    greeting.textContent = (t.signup_welcome || 'Welcome') + ', ' + (user.displayName || user.email) + '!';
    const emailEl = document.createElement('div');
    emailEl.style.cssText = 'font-size:14px;color:#64748b;margin-bottom:24px;';
    emailEl.textContent = user.email || '';
    const logoutBtn = document.createElement('button');
    logoutBtn.style.cssText = 'width:100%;padding:12px;background:#ef4444;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px;';
    logoutBtn.textContent = t.signup_logout || 'Sign Out';
    logoutBtn.onclick = logoutUser;
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'width:100%;padding:12px;background:#f1f5f9;color:#334155;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => document.getElementById('signupModal').remove();
    box.append(avatar, greeting, emailEl, logoutBtn, closeBtn);
  } else {
    box.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const isSignup = _authMode === 'signup';
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
    const title = document.createElement('div');
    title.style.cssText = 'font-size:19px;font-weight:700;';
    title.textContent = isSignup ? (t.signup_title || 'Create Account') : (t.auth_signin_title || 'Sign In');
    const xBtn = document.createElement('button');
    xBtn.style.cssText = 'background:none;border:none;font-size:20px;cursor:pointer;color:#94a3b8;';
    xBtn.textContent = '✕';
    xBtn.onclick = () => document.getElementById('signupModal').remove();
    header.append(title, xBtn);
    const note = document.createElement('div');
    note.style.cssText = 'font-size:13px;color:#64748b;margin-bottom:20px;';
    note.textContent = isSignup ? (t.signup_note || '') : '';
    const errBox = document.createElement('div');
    errBox.id = 'authErrBox';
    errBox.style.cssText = 'font-size:13px;color:#ef4444;margin-bottom:12px;display:none;';

    // Google first, pill-shaped, above the email fields — matches the
    // reference layout the user asked to follow (primary OAuth button up
    // top, email as the secondary path below a divider), not the original
    // "email form first, Google buried at the bottom" order.
    const googleBtn = document.createElement('button');
    googleBtn.style.cssText = 'width:100%;padding:13px;background:#fff;border:1.5px solid #e2e8f0;border-radius:999px;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;color:#334155;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:18px;';
    googleBtn.innerHTML = '<svg width="19" height="19" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.5-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.4 0 10.3-1.8 14.1-5l-6.5-5.5c-2.1 1.5-4.8 2.4-7.6 2.4-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.6 40.5 16.3 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.4 36.4 44 30.8 44 24c0-1.3-.1-2.5-.4-3.5z"/></svg><span>' + (t.auth_google_btn || 'Sign in with Google') + '</span>';
    googleBtn.onclick = () => signInGoogle(lang);

    const divider = document.createElement('div');
    divider.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:12px;color:#94a3b8;margin-bottom:18px;';
    divider.innerHTML = '<span style="flex:1;height:1px;background:#e2e8f0;"></span><span>' + (t.auth_or || 'or') + '</span><span style="flex:1;height:1px;background:#e2e8f0;"></span>';

    const fields = [];
    if (isSignup) {
      const lbl1 = document.createElement('label');
      lbl1.style.cssText = 'display:block;font-size:13px;font-weight:700;margin-bottom:6px;';
      lbl1.textContent = t.signup_name || 'Name';
      const inp1 = document.createElement('input');
      inp1.id = 'su_name'; inp1.type = 'text'; inp1.maxLength = 60;
      inp1.style.cssText = 'width:100%;padding:11px 16px;background:#fff;color:#0f172a;border:1.5px solid #e2e8f0;border-radius:999px;font-size:15px;font-family:inherit;margin-bottom:14px;box-sizing:border-box;';
      fields.push(lbl1, inp1);
    }
    const lbl2 = document.createElement('label');
    lbl2.style.cssText = 'display:block;font-size:13px;font-weight:700;margin-bottom:6px;';
    lbl2.textContent = t.signup_email || 'Email';
    const inp2 = document.createElement('input');
    inp2.id = 'su_email'; inp2.type = 'email'; inp2.dir = 'ltr'; inp2.maxLength = 120;
    inp2.style.cssText = 'width:100%;padding:11px 16px;background:#fff;color:#0f172a;border:1.5px solid #e2e8f0;border-radius:999px;font-size:15px;font-family:inherit;margin-bottom:14px;box-sizing:border-box;';
    const lbl3 = document.createElement('label');
    lbl3.style.cssText = 'display:block;font-size:13px;font-weight:700;margin-bottom:6px;';
    lbl3.textContent = t.auth_password || 'Password';
    const inp3 = document.createElement('input');
    inp3.id = 'su_pass'; inp3.type = 'password'; inp3.dir = 'ltr'; inp3.maxLength = 100;
    inp3.style.cssText = 'width:100%;padding:11px 16px;background:#fff;color:#0f172a;border:1.5px solid #e2e8f0;border-radius:999px;font-size:15px;font-family:inherit;margin-bottom:20px;box-sizing:border-box;';
    fields.push(lbl2, inp2, lbl3, inp3);

    const submitBtn = document.createElement('button');
    submitBtn.id = 'authSubmitBtn';
    submitBtn.style.cssText = 'width:100%;padding:13px;background:#2563eb;color:#fff;border:none;border-radius:999px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px;';
    submitBtn.textContent = isSignup ? (t.signup_submit || 'Create Account') : (t.auth_signin_title || 'Sign In');
    submitBtn.onclick = () => submitAuthForm(_authMode, lang);

    const switchLink = document.createElement('div');
    switchLink.style.cssText = 'text-align:center;font-size:13px;color:#2563eb;cursor:pointer;';
    switchLink.textContent = isSignup ? (t.auth_switch_to_login || 'Already have an account? Sign in') : (t.auth_switch_to_signup || "Don't have an account? Sign up");
    switchLink.onclick = () => { _authMode = isSignup ? 'signin' : 'signup'; openAuthModal(); };

    box.append(header, note, errBox, googleBtn, divider, ...fields, submitBtn, switchLink);
  }

  modal.appendChild(box);

  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  const firstInput = document.getElementById('su_name') || document.getElementById('su_email');
  if (firstInput) firstInput.focus();
}

function showToast(msg, type) {
  const existing = document.getElementById('adawatiToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'adawatiToast';
  const bg = type === 'error' ? '#ef4444' : '#22c55e';
  toast.style.cssText = `position:fixed;bottom:28px;${document.documentElement.dir==='rtl'?'right':'left'}:50%;transform:translateX(${document.documentElement.dir==='rtl'?'50%':'-50%'});background:${bg};color:#fff;padding:12px 24px;border-radius:10px;font-size:15px;font-weight:600;z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,0.18);pointer-events:none;`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 2800);
}

function submitAuthForm(mode, lang) {
  const t = T[lang] || T.ar;
  const errBox = document.getElementById('authErrBox');
  const showErr = function(msg) { if (errBox) { errBox.textContent = msg; errBox.style.display = 'block'; } };
  const email = (document.getElementById('su_email').value || '').trim();
  const pass = (document.getElementById('su_pass').value || '');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRe.test(email)) { showErr(t.contact_email_invalid || 'Invalid email address'); return; }
  if (pass.length < 6) { showErr(t.auth_error_weak_password || 'Password must be at least 6 characters'); return; }
  let name = '';
  if (mode === 'signup') {
    name = (document.getElementById('su_name').value || '').trim();
    if (!name) { showErr(t.contact_error || 'Please fill in all fields'); return; }
  }
  const btn = document.getElementById('authSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = t.auth_syncing || 'Working...'; }
  loadFirebaseAuth().then(function(fb) {
    const action = mode === 'signup'
      ? fb.auth.createUserWithEmailAndPassword(email, pass).then(function(cred) {
          return cred.user.updateProfile({ displayName: name.slice(0, 60) }).then(function() { return cred.user; });
        })
      : fb.auth.signInWithEmailAndPassword(email, pass).then(function(cred) { return cred.user; });
    return action;
  }).then(function(user) {
    return onAuthSuccessSync(user).then(function() {
      const modal = document.getElementById('signupModal');
      if (modal) modal.remove();
      updateAuthBtn();
      showToast((t.signup_welcome || 'Welcome') + ', ' + (user.displayName || user.email).split(' ')[0] + '!', 'success');
    });
  }).catch(function(err) {
    if (btn) { btn.disabled = false; btn.textContent = mode === 'signup' ? (t.signup_submit || 'Create Account') : (t.auth_signin_title || 'Sign In'); }
    const code = err && err.code;
    if (code === 'auth/email-already-in-use') showErr(t.auth_error_email_in_use || 'This email is already in use');
    else if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') showErr(t.auth_error_wrong_password || 'Wrong email or password');
    else if (code === 'auth/weak-password') showErr(t.auth_error_weak_password || 'Password must be at least 6 characters');
    else showErr(t.generic_error || 'Something went wrong — try again');
  });
}

function signInGoogle(lang) {
  const t = T[lang] || T.ar;
  const errBox = document.getElementById('authErrBox');
  const showErr = function(msg) { if (errBox) { errBox.textContent = msg; errBox.style.display = 'block'; } };
  const finishSignIn = function(user) {
    return onAuthSuccessSync(user).then(function() {
      const modal = document.getElementById('signupModal');
      if (modal) modal.remove();
      updateAuthBtn();
      showToast((t.signup_welcome || 'Welcome') + ', ' + (user.displayName || user.email).split(' ')[0] + '!', 'success');
    });
  };
  // Google's OAuth popup is blocked inside an embedded WebView
  // (disallowed_useragent) — inside the Capacitor app, use the native
  // @capacitor-firebase/authentication plugin instead (it drives the
  // native Google account picker, bypassing the WebView entirely), then
  // sync the resulting credential into the JS SDK so firebase.auth() stays
  // consistent with the web-only email/password path.
  const nativeAuth = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseAuthentication;
  if (nativeAuth) {
    loadFirebaseAuth().then(function(fb) {
      return nativeAuth.signInWithGoogle().then(function(result) {
        const idToken = result && result.credential && result.credential.idToken;
        if (!idToken) throw { code: 'auth/no-id-token' };
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
        return fb.auth.signInWithCredential(credential);
      });
    }).then(function(cred) { return finishSignIn(cred.user); })
    .catch(function(err) {
      if (err && (err.code === 'auth/no-id-token' || String(err.message || '').indexOf('cancel') !== -1)) return;
      showErr(t.generic_error || 'Something went wrong — try again');
    });
    return;
  }
  // Popup is the primary path on every platform, including mobile web —
  // live-tested: signInWithRedirect (tried first, matching Firebase's own
  // generic mobile-web guidance) reproducibly failed here even with
  // explicit setPersistence(LOCAL) — the OAuth exchange completes
  // server-side (confirmed via a full redirect-chain trace: Google returns
  // a real auth code and the final hop lands back on the app) but
  // getRedirectResult() on the returning page still resolves to a null
  // user with no thrown error, both before and after the persistence fix.
  // Root cause not fully isolated (likely an interaction between this
  // Firebase compat SDK version and the authDomain iframe relay across a
  // hard page reload) — rather than keep chasing it blind, popup is used
  // everywhere since it's proven to complete reliably end-to-end
  // (verified with a real account, session persists across reload).
  // signInWithRedirect is kept ONLY as a last-resort fallback for the
  // narrow case where the popup is actually blocked by the browser.
  loadFirebaseAuth().then(function(fb) {
    const provider = new firebase.auth.GoogleAuthProvider();
    return fb.auth.signInWithPopup(provider).then(function(cred) { return finishSignIn(cred.user); });
  }).catch(function(err) {
    if (err && err.code === 'auth/popup-closed-by-user') return;
    if (err && (err.code === 'auth/popup-blocked' || err.code === 'auth/operation-not-supported-in-this-environment')) {
      loadFirebaseAuth().then(function(fb) {
        const provider = new firebase.auth.GoogleAuthProvider();
        try { localStorage.setItem('adawati_google_redirect_pending', '1'); } catch (e) {}
        return fb.auth.signInWithRedirect(provider);
      }).catch(function() { showErr(t.generic_error || 'Something went wrong — try again'); });
      return;
    }
    showErr(t.generic_error || 'Something went wrong — try again');
  });
}

function checkGoogleRedirectResult() {
  let pending = false;
  try { pending = localStorage.getItem('adawati_google_redirect_pending') === '1'; } catch (e) {}
  if (!pending) return;
  try { localStorage.removeItem('adawati_google_redirect_pending'); } catch (e) {}
  loadFirebaseAuth().then(function(fb) {
    return fb.auth.getRedirectResult();
  }).then(function(result) {
    const lang = localStorage.getItem('lang') || 'en';
    const t = T[lang] || T.ar;
    if (!result || !result.user) {
      // A pending flag was set right before navigating away, so this branch
      // means the redirect round-trip didn't hand back a usable result —
      // tell the visitor rather than leaving them wondering if anything
      // happened (this used to fail completely silently).
      showToast(t.generic_error || 'Something went wrong — try again', 'error');
      return;
    }
    return onAuthSuccessSync(result.user).then(function() {
      updateAuthBtn();
      showToast((t.signup_welcome || 'Welcome') + ', ' + (result.user.displayName || result.user.email).split(' ')[0] + '!', 'success');
    });
  }).catch(function() {
    const lang = localStorage.getItem('lang') || 'en';
    const t = T[lang] || T.ar;
    showToast(t.generic_error || 'Something went wrong — try again', 'error');
  });
}

function logoutUser() {
  loadFirebaseAuth().then(function(fb) { return fb.auth.signOut(); }).finally(function() {
    try { localStorage.removeItem('adawati_uid'); } catch (e) {}
    const modal = document.getElementById('signupModal');
    if (modal) modal.remove();
    updateAuthBtn();
  });
}

/* ── PAGE_META: dynamic <title> + meta description per language ── */
const PAGE_META = {
  'percentage-calculator': {
    title: {
      en:'Free Percentage Calculator — Discount, VAT & Ratio | Adawati',
      ar:'حاسبة النسبة المئوية المجانية — خصم، ضريبة ونسبة | أدواتي',
      fr:'Calculateur de pourcentage — Remise, TVA & ratio | Adawati',
      es:'Calculadora de porcentaje — Descuento, IVA y ratio | Adawati',
      de:'Prozentrechner — Rabatt, MwSt & Verhältnis | Adawati',
      ru:'Калькулятор процентов — Скидка, НДС и отношение | Adawati'
    },
    desc: {
      en:'Free online percentage calculator: find X% of any number, calculate percentage increase or decrease, and percentage ratio. Instant results, no signup.',
      ar:'حاسبة نسبة مئوية مجانية: احسب X% من أي رقم، نسبة الزيادة أو النقص، والنسبة بين رقمين. نتائج فورية بدون تسجيل.',
      fr:'Calculateur de pourcentage gratuit en ligne : trouvez X% d\'un nombre, calculez l\'augmentation ou la diminution en pourcentage. Résultats instantanés.',
      es:'Calculadora de porcentaje gratuita en línea: encuentra X% de cualquier número, calcula aumento o disminución porcentual. Resultados instantáneos.',
      de:'Kostenloser Online-Prozentrechner: X% einer Zahl berechnen, prozentuale Zu- oder Abnahme ermitteln. Sofortige Ergebnisse, keine Anmeldung.',
      ru:'Бесплатный онлайн-калькулятор процентов: вычислите X% от числа, процентный рост или снижение. Мгновенные результаты без регистрации.'
    }
  },
  'loan-calculator': {
    title: {
      en:'Free Loan & Monthly Payment Calculator | Adawati',
      ar:'حاسبة القسط الشهري والقرض المجانية | أدواتي',
      fr:'Calculateur de prêt et mensualités gratuit | Adawati',
      es:'Calculadora de préstamo y cuota mensual gratuita | Adawati',
      de:'Kostenloser Kredit- und Ratenrechner | Adawati',
      ru:'Бесплатный калькулятор кредита и ежемесячных платежей | Adawati'
    },
    desc: {
      en:'Calculate monthly loan payments, total interest and repayment schedule for any loan amount, interest rate and duration. Free, instant, no signup.',
      ar:'احسب القسط الشهري للقرض، إجمالي الفائدة وجدول السداد لأي مبلغ ومدة. مجاني وفوري بدون تسجيل.',
      fr:'Calculez vos mensualités de prêt, le coût total des intérêts et le calendrier de remboursement. Gratuit, instantané, sans inscription.',
      es:'Calcula cuotas mensuales de préstamo, intereses totales y cronograma de pago. Gratis, instantáneo, sin registro.',
      de:'Berechnen Sie monatliche Kreditraten, Gesamtzinsen und Rückzahlungsplan. Kostenlos, sofort, ohne Anmeldung.',
      ru:'Рассчитайте ежемесячные платежи по кредиту, общую сумму процентов и график погашения. Бесплатно, мгновенно, без регистрации.'
    }
  },
  'vat-calculator': {
    title: {
      en:'Free VAT Calculator — Oman, Saudi Arabia, UAE & Gulf | Adawati',
      ar:'حاسبة VAT — عمان، السعودية والإمارات | أدواتي',
      fr:'Calculateur de TVA gratuit — Oman, Arabie Saoudite, EAU | Adawati',
      es:'Calculadora de IVA gratuita — Omán, Arabia Saudita, EAU | Adawati',
      de:'Kostenloser MwSt-Rechner — Oman, Saudi-Arabien, VAE | Adawati',
      ru:'Калькулятор НДС — Оман, Саудовская Аравия, ОАЭ | Adawati'
    },
    desc: {
      en:'Calculate VAT for Oman (5%), Saudi Arabia (15%), UAE (5%) and Bahrain (10%). Add or extract VAT instantly. Free tool, no signup required.',
      ar:'احسب ضريبة القيمة المضافة لعمان (5%)، السعودية (15%)، الإمارات (5%) والبحرين (10%). أضف أو استخرج الضريبة فوراً.',
      fr:'Calculez la TVA pour Oman (5%), Arabie Saoudite (15%), EAU (5%) et Bahreïn (10%). Ajoutez ou extrayez la TVA instantanément.',
      es:'Calcula el IVA para Omán (5%), Arabia Saudita (15%), EAU (5%) y Baréin (10%). Añade o extrae el IVA al instante.',
      de:'Berechnen Sie die MwSt für Oman (5%), Saudi-Arabien (15%), VAE (5%) und Bahrain (10%). Sofort hinzufügen oder extrahieren.',
      ru:'Рассчитайте НДС для Омана (5%), Саудовской Аравии (15%), ОАЭ (5%) и Бахрейна (10%). Добавьте или извлеките НДС мгновенно.'
    }
  },
  'bmi-calculator': {
    title: {
      en:'Free BMI Calculator — Body Mass Index Online | Adawati',
      ar:'حاسبة مؤشر كتلة الجسم BMI المجانية | أدواتي',
      fr:'Calculateur d\'IMC gratuit en ligne | Adawati',
      es:'Calculadora de IMC gratuita en línea | Adawati',
      de:'Kostenloser BMI-Rechner online | Adawati',
      ru:'Бесплатный онлайн-калькулятор ИМТ | Adawati'
    },
    desc: {
      en:'Calculate your Body Mass Index (BMI) instantly. Enter your height and weight to get your BMI and health status classification. Free, no signup.',
      ar:'احسب مؤشر كتلة جسمك (BMI) فوراً. أدخل طولك ووزنك للحصول على المؤشر وتصنيف وضعك الصحي. مجاني بدون تسجيل.',
      fr:'Calculez votre indice de masse corporelle (IMC) instantanément. Entrez votre taille et votre poids pour connaître votre IMC.',
      es:'Calcula tu índice de masa corporal (IMC) al instante. Introduce tu altura y peso para obtener tu IMC y clasificación de salud.',
      de:'Berechnen Sie Ihren Body-Mass-Index (BMI) sofort. Geben Sie Größe und Gewicht ein, um BMI und Gesundheitsstatus zu erhalten.',
      ru:'Рассчитайте свой индекс массы тела (ИМТ) мгновенно. Введите рост и вес, чтобы получить ИМТ и оценку состояния здоровья.'
    }
  },
  'currency-converter': {
    title: {
      en:'Free Currency Converter — Live Exchange Rates | Adawati',
      ar:'محول العملات المجاني — أسعار صرف حية | أدواتي',
      fr:'Convertisseur de devises — Taux de change en direct | Adawati',
      es:'Conversor de divisas gratuito — Tasas de cambio en vivo | Adawati',
      de:'Kostenloser Währungsrechner — Live-Wechselkurse | Adawati',
      ru:'Бесплатный конвертер валют — Актуальные курсы обмена | Adawati'
    },
    desc: {
      en:'Convert between 30+ world currencies with live exchange rates. Free currency converter — USD, EUR, GBP, SAR, AED, OMR and more. No signup required.',
      ar:'حول بين أكثر من 30 عملة عالمية بأسعار صرف حية. محول عملات مجاني — دولار، يورو، جنيه، ريال سعودي، درهم، ريال عماني والمزيد.',
      fr:'Convertissez entre plus de 30 devises mondiales avec des taux en direct. Convertisseur de devises gratuit — USD, EUR, GBP, SAR, AED, OMR.',
      es:'Convierte entre más de 30 divisas mundiales con tasas de cambio en vivo. Conversor de divisas gratis — USD, EUR, GBP, SAR, AED, OMR.',
      de:'Rechnen Sie zwischen 30+ Weltwährungen mit Live-Kursen um. Kostenloser Währungsrechner — USD, EUR, GBP, SAR, AED, OMR und mehr.',
      ru:'Конвертируйте между 30+ мировыми валютами по актуальным курсам. Бесплатный конвертер — USD, EUR, GBP, SAR, AED, OMR и другие.'
    }
  },
  'salary-calculator': {
    title: {
      en:'Free Salary Calculator Oman — Net Pay with SPF | Adawati',
      ar:'حاسبة الراتب عمان المجانية — الراتب الصافي مع SPF | أدواتي',
      fr:'Calculateur salaire Oman — Salaire net avec SPF | Adawati',
      es:'Calculadora salario Omán — Salario neto con SPF | Adawati',
      de:'Kostenloser Gehaltsrechner Oman — Nettogehalt mit SPF | Adawati',
      ru:'Калькулятор зарплаты Оман — Чистая зарплата с SPF | Adawati'
    },
    desc: {
      en:'Calculate your net salary in Oman including SPF deduction (8% for Omanis). Add basic salary, housing and transport allowances. Free, instant results.',
      ar:'احسب راتبك الصافي في عمان مع خصم SPF (8% للمواطنين). أضف الراتب الأساسي وبدلات السكن والنقل. مجاني ونتائج فورية.',
      fr:'Calculez votre salaire net à Oman avec déduction SPF (8% pour les Omanais). Ajoutez salaire de base, logement et transport.',
      es:'Calcula tu salario neto en Omán con deducción SPF (8% para omaníes). Añade salario básico, vivienda y transporte.',
      de:'Berechnen Sie Ihr Nettogehalt in Oman mit SPF-Abzug (8% für Omaner). Fügen Sie Grundgehalt, Wohn- und Transportzulage hinzu.',
      ru:'Рассчитайте чистую зарплату в Омане с вычетом SPF (8% для оманцев). Добавьте базовую зарплату, жилищные и транспортные надбавки.'
    }
  },
  'end-of-service': {
    title: {
      en:'End of Service Calculator Oman — Gratuity under Omani Labor Law | Adawati',
      ar:'حاسبة نهاية الخدمة — قانون العمل العماني | أدواتي',
      fr:'Calculateur d\'indemnité de fin de service Oman | Adawati',
      es:'Calculadora de indemnización por fin de servicio Omán | Adawati',
      de:'Abfindungsrechner Oman — Omanisches Arbeitsrecht | Adawati',
      ru:'Выходное пособие Оман — Трудовое законодательство | Adawati'
    },
    desc: {
      en:'Calculate end-of-service gratuity for Oman under the Omani Labor Law. Enter start date, end date, salary and reason for termination. Free, accurate.',
      ar:'احسب مكافأة نهاية الخدمة في عمان وفق قانون العمل العماني. أدخل تاريخ البداية والنهاية والراتب وسبب انتهاء الخدمة.',
      fr:'Calculez l\'indemnité de fin de service pour Oman selon le droit du travail omanais.',
      es:'Calcula la indemnización por fin de servicio en Omán según el derecho laboral omaní.',
      de:'Berechnen Sie die Abfindung für Oman gemäß omanischem Arbeitsrecht.',
      ru:'Рассчитайте выходное пособие в Омане по omanskому трудовому законодательству.'
    }
  },
  'age-calculator': {
    title: {
      en:'Free Age Calculator — Exact Age in Years, Months & Days | Adawati',
      ar:'حاسبة العمر — السنوات والأشهر والأيام | أدواتي',
      fr:'Calculateur d\'âge — Âge en années, mois et jours | Adawati',
      es:'Calculadora de edad — Edad en años, meses y días | Adawati',
      de:'Altersrechner — Alter in Jahren, Monaten und Tagen | Adawati',
      ru:'Калькулятор возраста — возраст в годах, месяцах и днях | Adawati'
    },
    desc: {
      en:'Calculate your exact age in years, months and days. Find days until your next birthday. Free online age calculator, no signup required.',
      ar:'احسب عمرك بالتفصيل — سنوات وأشهر وأيام. اعرف عدد الأيام حتى عيد ميلادك القادم. حاسبة عمر مجانية بدون تسجيل.',
      fr:'Calculez votre âge exact en années, mois et jours. Trouvez le nombre de jours jusqu\'à votre prochain anniversaire.',
      es:'Calcula tu edad exacta en años, meses y días. Encuentra los días hasta tu próximo cumpleaños.',
      de:'Berechnen Sie Ihr genaues Alter in Jahren, Monaten und Tagen. Erfahren Sie, wie viele Tage bis zu Ihrem nächsten Geburtstag.',
      ru:'Рассчитайте свой точный возраст в годах, месяцах и днях. Узнайте количество дней до следующего дня рождения.'
    }
  },
  'compound-interest': {
    title:{en:'Free Compound Interest Calculator — Investment Growth | Adawati',ar:'حاسبة الفائدة المركبة المجانية — نمو الاستثمار | أدواتي',fr:'Intérêts composés — Croissance des investissements | Adawati',es:'Interés compuesto — Crecimiento de inversión | Adawati',de:'Kostenloser Zinseszinsrechner — Investitionswachstum | Adawati',ru:'Сложные проценты — Рост инвестиций | Adawati'},
    desc:{en:'Calculate compound interest and investment growth over time. Enter principal, interest rate, compounding frequency and duration. Free online calculator.',ar:'احسب الفائدة المركبة ونمو استثمارك مع الوقت. أدخل رأس المال وسعر الفائدة ومدة الاحتساب. مجاني وفوري.',fr:'Calculez les intérêts composés et la croissance de vos investissements. Entrez le capital, le taux d\'intérêt et la durée.',es:'Calcula el interés compuesto y el crecimiento de tu inversión. Ingresa el capital, tasa de interés y período.',de:'Berechnen Sie Zinseszinsen und Investitionswachstum. Geben Sie Kapital, Zinssatz und Laufzeit ein.',ru:'Рассчитайте сложные проценты и рост инвестиций. Введите капитал, процентную ставку и срок.'}
  },
  'date-diff': {
    title:{en:'Free Date Difference Calculator — Days Between Dates | Adawati',ar:'حاسبة الفرق بين التواريخ — أيام بين تاريخين | أدواتي',fr:'Différence de dates — Jours entre deux dates | Adawati',es:'Diferencia de fechas — Días entre dos fechas | Adawati',de:'Kostenloser Datumsrechner — Tage zwischen zwei Daten | Adawati',ru:'Бесплатный калькулятор разницы дат — Дни между датами | Adawati'},
    desc:{en:'Calculate the exact number of days, weeks and months between any two dates. Free date difference calculator. Instant results, no signup.',ar:'احسب الفرق الدقيق بالأيام والأسابيع والأشهر بين أي تاريخين. حاسبة فرق التواريخ مجانية. نتائج فورية بدون تسجيل.',fr:'Calculez le nombre exact de jours, semaines et mois entre deux dates. Résultats instantanés, sans inscription.',es:'Calcula el número exacto de días, semanas y meses entre dos fechas. Resultados instantáneos, sin registro.',de:'Berechnen Sie die genaue Anzahl von Tagen, Wochen und Monaten zwischen zwei Daten. Sofortige Ergebnisse.',ru:'Рассчитайте точное количество дней, недель и месяцев между двумя датами. Мгновенные результаты.'}
  },
  'diet-plan': {
    title:{en:'Free Daily Calorie Calculator & Diet Plan | Adawati',ar:'حاسبة السعرات الحرارية اليومية والخطة الغذائية المجانية | أدواتي',fr:'Calories quotidiennes et plan de régime | Adawati',es:'Calculadora de calorías diarias y plan de dieta gratis | Adawati',de:'Kostenloser Tageskalorienrechner und Ernährungsplan | Adawati',ru:'Бесплатный калькулятор дневных калорий и план питания | Adawati'},
    desc:{en:'Calculate your daily calorie needs based on weight, height, age and activity level. Get a personalized diet plan. Free, no signup required.',ar:'احسب احتياجك اليومي من السعرات الحرارية بناءً على وزنك وطولك وعمرك ومستوى نشاطك. احصل على خطة غذائية مخصصة. مجاني بدون تسجيل.',fr:'Calculez vos besoins caloriques quotidiens selon votre poids, taille, âge et activité. Plan alimentaire personnalisé.',es:'Calcula tus necesidades calóricas diarias según peso, altura, edad y actividad. Plan de dieta personalizado.',de:'Berechnen Sie Ihren täglichen Kalorienbedarf nach Gewicht, Größe, Alter und Aktivität. Personalisierter Ernährungsplan.',ru:'Рассчитайте дневную норму калорий по весу, росту, возрасту и уровню активности. Персонализированный план питания.'}
  },
  'discount-calculator': {
    title:{en:'Free Discount Calculator — Sale Price & Savings | Adawati',ar:'حاسبة الخصم المجانية — سعر البيع والتوفير | أدواتي',fr:'Calculateur de remise — Prix de vente et économies | Adawati',es:'Calculadora de descuento — Precio de venta y ahorro | Adawati',de:'Rabattrechner — Verkaufspreis und Ersparnisse | Adawati',ru:'Бесплатный калькулятор скидки — Цена продажи и экономия | Adawati'},
    desc:{en:'Calculate the final sale price after any discount percentage. Find out exactly how much you save. Free discount calculator, instant results, no signup.',ar:'احسب السعر النهائي بعد الخصم. اعرف كم ستوفر بالضبط. حاسبة خصم مجانية وفورية بدون تسجيل.',fr:'Calculez le prix final après remise. Découvrez exactement vos économies. Gratuit, sans inscription.',es:'Calcula el precio final después del descuento. Descubre exactamente cuánto ahorras. Gratis, sin registro.',de:'Berechnen Sie den Endpreis nach Rabatt. Erfahren Sie genau, wie viel Sie sparen. Kostenlos.',ru:'Рассчитайте итоговую цену после скидки. Узнайте точно, сколько сэкономите. Бесплатно.'}
  },
  'file-converter': {
    title:{en:'Free File Converter — Convert Images Online | Adawati',ar:'محول الملفات المجاني — تحويل الصور أونلاين | أدواتي',fr:'Convertisseur de fichiers gratuit — Images en ligne | Adawati',es:'Conversor de archivos gratis — Imágenes en línea | Adawati',de:'Kostenloser Dateikonverter — Bilder online | Adawati',ru:'Бесплатный конвертер файлов — Изображения онлайн | Adawati'},
    desc:{en:'Convert image files online for free. Supports JPG, PNG, WebP and more. No upload to servers — all processing in your browser. No signup.',ar:'حول ملفات الصور أونلاين مجاناً. يدعم JPG وPNG وWebP والمزيد. لا رفع لخوادم — كل المعالجة في متصفحك. بدون تسجيل.',fr:'Convertissez des images en ligne gratuitement. Supporte JPG, PNG, WebP. Traitement dans le navigateur, sans inscription.',es:'Convierte imágenes en línea gratis. Soporta JPG, PNG, WebP. Procesamiento en el navegador, sin registro.',de:'Konvertieren Sie Bilder kostenlos online. Unterstützt JPG, PNG, WebP. Verarbeitung im Browser, ohne Anmeldung.',ru:'Конвертируйте изображения онлайн бесплатно. Поддерживает JPG, PNG, WebP. Обработка в браузере, без регистрации.'}
  },
  'hijri-converter': {
    title:{en:'Free Hijri Date Converter — Islamic & Gregorian Calendar | Adawati',ar:'محول التاريخ الهجري المجاني — التقويم الإسلامي والميلادي | أدواتي',fr:'Convertisseur date Hijri — Calendrier islamique | Adawati',es:'Convertidor fecha Hijri — Calendario islámico | Adawati',de:'Hijri-Datumskonverter — Islamischer Kalender | Adawati',ru:'Конвертер даты Хиджры — Исламский календарь | Adawati'},
    desc:{en:'Convert between Hijri (Islamic) and Gregorian calendar dates instantly. Free online Hijri date converter, accurate and easy to use. No signup.',ar:'حول بين التاريخ الهجري والميلادي فوراً. محول تاريخ هجري مجاني ودقيق وسهل الاستخدام. بدون تسجيل.',fr:'Convertissez instantanément entre les dates Hijri et grégoriennes. Convertisseur gratuit et facile à utiliser.',es:'Convierte fechas Hijri y gregorianas al instante. Conversor gratuito y fácil de usar.',de:'Konvertieren Sie sofort zwischen Hijri- und gregorianischen Daten. Kostenloser und einfacher Konverter.',ru:'Мгновенно конвертируйте даты между Хиджрой и григорианским календарём. Бесплатный и удобный конвертер.'}
  },
  'image-compressor': {
    title:{en:'Free Image Compressor — Reduce Photo Size Online | Adawati',ar:'ضاغط الصور المجاني — تقليل حجم الصور أونلاين | أدواتي',fr:'Compresseur d\'images — Réduire la taille en ligne | Adawati',es:'Compresor de imágenes gratis — Reducir tamaño en línea | Adawati',de:'Bildkompressor — Fotogröße online reduzieren | Adawati',ru:'Компрессор изображений — Уменьшить размер онлайн | Adawati'},
    desc:{en:'Compress images online for free without quality loss. Reduce JPG, PNG and WebP sizes instantly. No upload to servers — all in your browser. No signup.',ar:'اضغط الصور أونلاين مجاناً بدون فقدان الجودة. قلل حجم JPG وPNG وWebP فوراً. لا رفع لخوادم — كل شيء في متصفحك.',fr:'Compressez des images en ligne gratuitement sans perte de qualité. Réduisez JPG, PNG et WebP instantanément.',es:'Comprime imágenes en línea gratis sin pérdida de calidad. Reduce JPG, PNG y WebP al instante.',de:'Bilder kostenlos online komprimieren ohne Qualitätsverlust. JPG, PNG und WebP sofort reduzieren.',ru:'Сжимайте изображения онлайн бесплатно без потери качества. Уменьшайте JPG, PNG и WebP мгновенно.'}
  },
  'password-generator': {
    title:{en:'Free Password Generator — Strong & Secure Passwords | Adawati',ar:'مولّد كلمات المرور المجاني — كلمات مرور قوية وآمنة | أدواتي',fr:'Générateur de mots de passe — Mots de passe forts | Adawati',es:'Generador de contraseñas — Contraseñas fuertes | Adawati',de:'Passwort-Generator — Starke & sichere Passwörter | Adawati',ru:'Генератор паролей — Надёжные и безопасные пароли | Adawati'},
    desc:{en:'Generate strong, random and secure passwords instantly. Choose length and character types. Free password generator, no signup, nothing stored.',ar:'ولّد كلمات مرور قوية وعشوائية وآمنة فوراً. اختر الطول ونوع الأحرف. مجاني، بدون تسجيل، لا شيء يُحفظ.',fr:'Générez des mots de passe forts et sécurisés instantanément. Choisissez longueur et caractères. Gratuit, sans inscription.',es:'Genera contraseñas fuertes y seguras al instante. Elige longitud y tipos de caracteres. Gratis, sin registro.',de:'Generieren Sie sofort starke und sichere Passwörter. Länge und Zeichentypen wählen. Kostenlos, ohne Anmeldung.',ru:'Генерируйте надёжные случайные пароли мгновенно. Выберите длину и типы символов. Бесплатно, без регистрации.'}
  },
  'qr-generator': {
    title:{en:'Free QR Code Generator — Create QR Codes Instantly | Adawati',ar:'مولّد رموز QR المجاني — أنشئ رموز QR فوراً | أدواتي',fr:'Générateur QR codes — Créez des QR codes | Adawati',es:'Generador QR — Crea códigos QR al instante | Adawati',de:'QR-Code-Generator — QR-Codes sofort erstellen | Adawati',ru:'Генератор QR-кодов — Создавайте QR-коды мгновенно | Adawati'},
    desc:{en:'Generate QR codes for URLs, text or contact info instantly. Download as PNG or SVG. Free online QR code generator, no signup, no watermark.',ar:'ولّد رموز QR للروابط والنصوص ومعلومات الاتصال فوراً. حمّل بصيغة PNG أو SVG. مجاني بدون تسجيل وبدون علامة مائية.',fr:'Générez des QR codes pour URLs, textes ou contacts instantanément. Téléchargez en PNG ou SVG. Gratuit, sans filigrane.',es:'Genera códigos QR para URLs, texto o contactos al instante. Descarga en PNG o SVG. Gratis, sin marca de agua.',de:'QR-Codes für URLs, Text oder Kontakte sofort erstellen. Als PNG oder SVG herunterladen. Kostenlos, kein Wasserzeichen.',ru:'Создавайте QR-коды для URL, текста или контактов мгновенно. Скачивайте в PNG или SVG. Бесплатно, без водяного знака.'}
  },
  'random-number': {
    title:{en:'Free Random Number Generator — Pick Random Numbers | Adawati',ar:'مولّد الأرقام العشوائية المجاني — اختيار أرقام عشوائية | أدواتي',fr:'Générateur de nombres aléatoires gratuit | Adawati',es:'Generador de números aleatorios gratis | Adawati',de:'Kostenloser Zufallszahlengenerator | Adawati',ru:'Бесплатный генератор случайных чисел | Adawati'},
    desc:{en:'Generate random numbers in any range. Pick lottery numbers, random list items or dice rolls. Free, instant, no signup required.',ar:'ولّد أرقاماً عشوائية في أي نطاق. اختر أرقام يانصيب أو عناصر من قائمة. مجاني وفوري بدون تسجيل.',fr:'Générez des nombres aléatoires dans n\'importe quelle plage. Numéros de loterie, dés ou sélections. Gratuit, instantané.',es:'Genera números aleatorios en cualquier rango. Números de lotería, dados o selecciones. Gratis, instantáneo.',de:'Zufallszahlen in jedem Bereich generieren. Lottozahlen, Würfel oder zufällige Auswahlen. Kostenlos, sofort.',ru:'Генерируйте случайные числа в любом диапазоне. Лотерейные номера, броски кубика. Бесплатно, мгновенно.'}
  },
  'stopwatch': {
    title:{en:'Free Online Stopwatch & Timer | Adawati',ar:'ساعة إيقاف وموقت أونلاين مجاني | أدواتي',fr:'Chronomètre et minuterie en ligne gratuits | Adawati',es:'Cronómetro y temporizador en línea gratis | Adawati',de:'Kostenlose Online-Stoppuhr & Timer | Adawati',ru:'Бесплатный онлайн-секундомер и таймер | Adawati'},
    desc:{en:'Free online stopwatch and countdown timer. Start, stop, pause and record laps. Works in your browser — no download needed. Free, no signup.',ar:'ساعة إيقاف وموقت عد تنازلي أونلاين. ابدأ وأوقف وسجّل الأشواط. يعمل في متصفحك بدون تنزيل. مجاني بدون تسجيل.',fr:'Chronomètre et minuterie en ligne gratuits. Démarrez, arrêtez et enregistrez les tours. Fonctionne dans votre navigateur.',es:'Cronómetro y temporizador en línea gratis. Inicia, detén y registra vueltas. Funciona en tu navegador.',de:'Kostenlose Online-Stoppuhr und Timer. Starten, stoppen und Runden aufzeichnen. Im Browser, kein Download.',ru:'Бесплатный онлайн-секундомер и обратный отсчёт. Запускайте, останавливайте и записывайте круги. В браузере.'}
  },
  'timezone-converter': {
    title:{en:'Free Time Zone Converter — World Clock Online | Adawati',ar:'محول المناطق الزمنية المجاني — الساعة العالمية أونلاين | أدواتي',fr:'Convertisseur fuseaux horaires — Horloge mondiale | Adawati',es:'Conversor de zonas horarias gratis — Reloj mundial | Adawati',de:'Kostenloser Zeitzonenkonverter — Weltzeituhr online | Adawati',ru:'Бесплатный конвертер часовых поясов — Мировые часы | Adawati'},
    desc:{en:'Convert time between world time zones instantly. Plan international meetings and calls. Free online timezone converter, no signup required.',ar:'حول الوقت بين مناطق زمنية عالمية فوراً. خطّط للاجتماعات الدولية. محول مناطق زمنية مجاني بدون تسجيل.',fr:'Convertissez l\'heure entre les fuseaux horaires mondiaux instantanément. Planifiez des réunions internationales.',es:'Convierte el tiempo entre zonas horarias mundiales al instante. Planifica reuniones internacionales.',de:'Zeit zwischen Weltzeitzonien sofort konvertieren. Internationale Meetings planen. Kostenlos.',ru:'Мгновенно конвертируйте время между мировыми часовыми поясами. Планируйте международные встречи.'}
  },
  'tip-calculator': {
    title:{en:'Free Tip Calculator — Split Bill & Calculate Gratuity | Adawati',ar:'حاسبة الإكرامية — تقسيم الفاتورة | أدواتي',fr:'Calculateur de pourboire gratuit — Partager l\'addition | Adawati',es:'Calculadora de propina — Dividir cuenta y propina | Adawati',de:'Kostenloser Trinkgeldrechner — Rechnung aufteilen | Adawati',ru:'Бесплатный калькулятор чаевых — Разделить счёт | Adawati'},
    desc:{en:'Calculate tip amount and split the bill between any number of people. Choose tip percentage and see totals per person. Free, instant, no signup.',ar:'احسب مبلغ الإكرامية وقسّم الفاتورة بين أي عدد من الأشخاص. اختر نسبة الإكرامية وشاهد المجموع لكل شخص. مجاني وفوري.',fr:'Calculez le pourboire et partagez l\'addition. Choisissez le pourcentage et voyez les totaux par personne.',es:'Calcula la propina y divide la cuenta. Elige el porcentaje y ve los totales por persona.',de:'Trinkgeldbetrag berechnen und Rechnung aufteilen. Prozentsatz wählen und Summen pro Person sehen.',ru:'Рассчитайте чаевые и разделите счёт. Выберите процент и посмотрите итоги на человека.'}
  },
  'unit-converter': {
    title:{en:'Free Unit Converter — Length, Weight, Volume & Temperature | Adawati',ar:'محول الوحدات المجاني — طول، وزن، حجم ودرجة حرارة | أدواتي',fr:'Convertisseur d\'unités — Longueur, poids & volume | Adawati',es:'Convertidor de unidades — Longitud, peso y volumen | Adawati',de:'Einheitenrechner — Länge, Gewicht & Volumen | Adawati',ru:'Конвертер единиц — Длина, вес, объём и температура | Adawati'},
    desc:{en:'Convert units of length, weight, volume, temperature and more. Metric and imperial supported. Free online unit converter, instant results.',ar:'حول وحدات الطول والوزن والحجم ودرجة الحرارة والمزيد. يدعم النظام المتري والإمبريالي. مجاني وفوري.',fr:'Convertissez longueur, poids, volume, température et plus. Métrique et impérial supportés.',es:'Convierte longitud, peso, volumen, temperatura y más. Sistemas métrico e imperial soportados.',de:'Einheiten für Länge, Gewicht, Volumen, Temperatur konvertieren. Metrisch und imperial unterstützt.',ru:'Конвертируйте длину, вес, объём, температуру и многое другое. Метрическая и британская системы.'}
  },
  'word-counter': {
    title:{en:'Free Word Counter — Count Words, Characters & Reading Time | Adawati',ar:'عدّاد الكلمات المجاني — كلمات، أحرف ووقت القراءة | أدواتي',fr:'Compteur de mots — Mots, caractères et temps de lecture | Adawati',es:'Contador de palabras — Palabras, caracteres y lectura | Adawati',de:'Kostenloser Wortzähler — Wörter, Zeichen & Lesezeit | Adawati',ru:'Бесплатный счётчик слов — Слова, символы и время чтения | Adawati'},
    desc:{en:'Count words, characters, sentences and estimate reading time instantly. Paste any text to analyze. Free online word counter, no signup.',ar:'عدّ الكلمات والأحرف والجمل وقدّر وقت القراءة فوراً. الصق أي نص للتحليل. مجاني بدون تسجيل.',fr:'Comptez mots, caractères, phrases et estimez le temps de lecture. Collez n\'importe quel texte. Gratuit.',es:'Cuenta palabras, caracteres, oraciones y estima el tiempo de lectura. Pega cualquier texto. Gratis.',de:'Wörter, Zeichen, Sätze zählen und Lesezeit schätzen. Text einfügen. Kostenlos, ohne Anmeldung.',ru:'Считайте слова, символы, предложения и оценивайте время чтения. Вставьте любой текст. Бесплатно.'}
  },
  'kids-learn': {
    title:{en:'Free Kids Learning Game — Letters, Numbers & Colors | Adawati',ar:'لعبة تعليمية للأطفال المجانية — حروف، أرقام وألوان | أدواتي',fr:'Jeu éducatif enfants — Lettres, chiffres et couleurs | Adawati',es:'Juego educativo para niños — Letras, números y colores | Adawati',de:'Lernspiel für Kinder — Buchstaben, Zahlen & Farben | Adawati',ru:'Обучающая игра для детей — Буквы, цифры и цвета | Adawati'},
    desc:{en:'Help children learn letters, numbers and colors with fun interactive activities. Free online learning game for kids, works on all devices. No signup.',ar:'ساعد الأطفال على تعلم الحروف والأرقام والألوان بأنشطة تفاعلية ممتعة. لعبة تعليمية مجانية تعمل على جميع الأجهزة.',fr:'Aidez les enfants à apprendre lettres, chiffres et couleurs avec des activités interactives. Gratuit pour tous appareils.',es:'Ayuda a los niños a aprender letras, números y colores con actividades interactivas. Gratuito para todos los dispositivos.',de:'Kindern beim Lernen von Buchstaben, Zahlen und Farben helfen. Kostenloses Lernspiel für alle Geräte.',ru:'Помогите детям учить буквы, цифры и цвета с интерактивными заданиями. Бесплатная игра для всех устройств.'}
  },
  'memory-game': {
    title:{en:'Free Memory Card Game — Train Your Memory Online | Adawati',ar:'لعبة الذاكرة المجانية — درّب ذاكرتك أونلاين | أدواتي',fr:'Jeu de mémoire — Entraînez votre mémoire en ligne | Adawati',es:'Juego de memoria gratis — Entrena tu memoria en línea | Adawati',de:'Gedächtnisspiel — Gedächtnis online trainieren | Adawati',ru:'Бесплатная игра на память — Тренируйте память онлайн | Adawati'},
    desc:{en:'Match pairs of cards and train your memory. 6 difficulty levels from beginner to legend. Free online memory game, works on all devices. No signup.',ar:'طابق أزواج البطاقات ودرّب ذاكرتك. 6 مستويات من المبتدئ إلى الأسطوري. لعبة ذاكرة مجانية تعمل على جميع الأجهزة.',fr:'Associez des paires de cartes et entraînez votre mémoire. 6 niveaux du débutant à la légende. Gratuit, tous appareils.',es:'Empareja tarjetas y entrena tu memoria. 6 niveles de principiante a leyenda. Gratuito para todos los dispositivos.',de:'Kartenpaare finden und Gedächtnis trainieren. 6 Schwierigkeitsgrade. Kostenloses Spiel für alle Geräte.',ru:'Находите пары карточек и тренируйте память. 6 уровней сложности. Бесплатная онлайн-игра.'}
  },
  'number-guess': {
    title:{en:'Free Number Guessing Game — Guess the Hidden Number | Adawati',ar:'لعبة تخمين الأرقام المجانية — خمّن الرقم المخفي | أدواتي',fr:'Devinette de nombres — Devinez le nombre caché | Adawati',es:'Adivinanza de números — Adivina el número oculto | Adawati',de:'Kostenloses Zahlratespiel — Errate die versteckte Zahl | Adawati',ru:'Бесплатная игра угадай число — Угадайте скрытое число | Adawati'},
    desc:{en:'Guess the hidden number with hints. Multiple difficulty levels. Fun brain game for all ages. Free, instant, no signup required.',ar:'خمّن الرقم المخفي مع تلميحات. مستويات صعوبة متعددة. لعبة ذكاء ممتعة لجميع الأعمار. مجاني بدون تسجيل.',fr:'Devinez le nombre caché avec des indices. Plusieurs niveaux. Jeu cérébral pour tous les âges. Gratuit.',es:'Adivina el número oculto con pistas. Múltiples niveles. Juego mental para todas las edades. Gratis.',de:'Versteckte Zahl mit Hinweisen erraten. Verschiedene Schwierigkeitsgrade. Gehirnspiel für alle. Kostenlos.',ru:'Угадайте скрытое число с подсказками. Несколько уровней. Игра для всех возрастов. Бесплатно.'}
  },
  'quick-math': {
    title:{en:'Free Quick Math Game — 100-Level Smart Challenge | Adawati',ar:'لعبة الرياضيات السريعة — تحدي الأذكياء 100 مستوى | أدواتي',fr:'Calcul rapide — Défi intelligent 100 niveaux | Adawati',es:'Matemáticas rápidas — Desafío inteligente 100 niveles | Adawati',de:'Schnellrechenspiel — 100-Level Intelligenz-Challenge | Adawati',ru:'Быстрый счёт — 100 уровней умного вызова | Adawati'},
    desc:{en:'Test your mental math speed across 100 progressive levels from beginner to unbelievable. Free online math game, no signup required.',ar:'اختبر سرعتك في الحساب الذهني عبر 100 مستوى متصاعد من المبتدئ إلى غير قابل للتصديق. مجاني بدون تسجيل.',fr:'Testez votre calcul mental sur 100 niveaux progressifs. Du débutant à l\'incroyable. Gratuit, sans inscription.',es:'Prueba tu velocidad de cálculo mental en 100 niveles progresivos. De principiante a increíble. Gratis.',de:'Kopfrechenfähigkeiten in 100 progressiven Leveln testen. Vom Anfänger zum Unglaublichen. Kostenlos.',ru:'Проверьте скорость устного счёта на 100 прогрессивных уровнях. Бесплатно, без регистрации.'}
  },
  'reaction-test': {
    title:{en:'Free Reaction Time Test — How Fast Are You? | Adawati',ar:'اختبار سرعة رد الفعل المجاني — كم هي سرعتك؟ | أدواتي',fr:'Test de temps de réaction gratuit — Êtes-vous rapide? | Adawati',es:'Test de reacción — ¿Qué tan rápido eres? | Adawati',de:'Kostenloser Reaktionszeit-Test — Wie schnell bist du? | Adawati',ru:'Бесплатный тест скорости реакции — Насколько быстры вы? | Adawati'},
    desc:{en:'Test your reaction time across 6 difficulty levels. Click when the button turns green, avoid red. Free online reaction game, no signup.',ar:'اختبر سرعة رد فعلك عبر 6 مستويات. اضغط عندما يتحول الزر للأخضر، تجنب الأحمر. مجاني بدون تسجيل.',fr:'Testez votre temps de réaction sur 6 niveaux. Cliquez quand le bouton devient vert, évitez le rouge. Gratuit.',es:'Prueba tu tiempo de reacción en 6 niveles. Haz clic cuando el botón se vuelva verde, evita el rojo. Gratis.',de:'Reaktionszeit in 6 Schwierigkeitsgraden testen. Klicken wenn der Button grün wird, Rot vermeiden. Kostenlos.',ru:'Проверьте скорость реакции на 6 уровнях. Нажимайте при зелёной кнопке, избегайте красной. Бесплатно.'}
  },
  'car-game': {
    title:{en:'Free Car Racing Game — Dodge Traffic & Set High Scores | Adawati',ar:'لعبة سباق السيارات — تجنب المرور وسجّل نقاط | أدواتي',fr:'Jeu de course de voitures gratuit — Évitez le trafic | Adawati',es:'Juego de carreras de coches gratis — Esquiva el tráfico | Adawati',de:'Kostenloses Autorennenspiel — Verkehr ausweichen | Adawati',ru:'Бесплатная гоночная игра — Уворачивайтесь от трафика | Adawati'},
    desc:{en:'Drive your car and dodge oncoming traffic. Survive as long as possible and beat your high score. Free browser car game, no download needed.',ar:'قد سيارتك وتجنب السيارات القادمة. تمسّك أطول فترة ممكنة وحطّم رقمك القياسي. لعبة سيارات مجانية في المتصفح.',fr:'Conduisez et évitez le trafic. Survivez le plus longtemps possible. Jeu gratuit dans le navigateur.',es:'Conduce y esquiva el tráfico. Sobrevive el mayor tiempo posible. Juego de coches gratis en el navegador.',de:'Auto fahren und Verkehr ausweichen. So lange wie möglich überleben. Kostenloses Browserspiel.',ru:'Ведите машину и уворачивайтесь от встречного транспорта. Бесплатная браузерная игра.'}
  },
  'jump-game': {
    title:{en:'Free Jump Game — Endless Platformer Challenge | Adawati',ar:'لعبة القفز المجانية — تحدي المنصات اللانهائي | أدواتي',fr:'Jeu de saut gratuit — Défi de plateforme sans fin | Adawati',es:'Juego de salto gratis — Desafío de plataformas infinito | Adawati',de:'Kostenloses Sprungspiel — Endloser Plattform-Challenge | Adawati',ru:'Бесплатная прыжковая игра — Бесконечный платформер | Adawati'},
    desc:{en:'Jump over obstacles and survive as long as possible. Simple endless platformer. Free, plays in your browser, no download or signup needed.',ar:'اقفز فوق العقبات وتمسّك أطول فترة ممكنة. لعبة منصات بسيطة ولانهائية. مجانية في متصفحك بدون تنزيل.',fr:'Sautez par-dessus les obstacles et survivez. Jeu de plateforme sans fin. Gratuit dans le navigateur.',es:'Salta sobre obstáculos y sobrevive. Juego de plataformas infinito. Gratis en el navegador.',de:'Über Hindernisse springen und überleben. Endloser Platformer. Kostenlos im Browser.',ru:'Прыгайте через препятствия и продержитесь как можно дольше. Бесплатная игра в браузере.'}
  }
};

/* ── PAGE_FAQ: per-page FAQ in all 6 languages ── */
const PAGE_FAQ = {
  'percentage-calculator': {
    en: [
      {q:'How do I calculate 20% of 500?', a:'Multiply the number by the percentage then divide by 100: 500 × 20 ÷ 100 = 100. Or simply 500 × 0.20 = 100. Use the first tab in the calculator above for instant results.'},
      {q:'How do I calculate percentage price increase?', a:'% Change = ((New price − Old price) ÷ Old price) × 100. Example: 100 to 130 = ((130−100)÷100)×100 = 30% increase. Use the "% change" tab in the calculator.'},
      {q:'What percentage is 30 of 150?', a:'Divide the first number by the second then multiply by 100: 30 ÷ 150 × 100 = 20%. Use the "What percentage?" tab.'},
      {q:'How do I calculate a price after a 30% discount?', a:'Multiply the original price by (1 − discount rate). Example: 200 with 30% discount = 200 × 0.70 = 140. Or use Tab 1: enter 30 as percentage and 200 as the number to get the discount amount (60), then subtract from the original.'},
      {q:'How do I calculate 5% VAT on a price?', a:'Multiply the price by 0.05 to get the tax amount. Example: 100 × 0.05 = 5 tax, total = 105. Oman and UAE: VAT 5%. Saudi Arabia: VAT 15%.'},
      {q:'What is the difference between percentage and percentage point?', a:'A percentage point (pp) is the absolute difference between two percentages. Example: rising from 10% to 15% is +5 percentage points, but a 50% increase (since 5 ÷ 10 × 100 = 50%). This confusion is common in financial reporting.'},
      {q:'How do I calculate profit or loss percentage?', a:'% Profit/Loss = ((Sell price − Buy price) ÷ Buy price) × 100. Example: bought at 200, sold at 250 = ((250−200)÷200)×100 = 25% profit. Use the "% change" tab.'},
      {q:'How do I calculate 15% of my monthly salary?', a:'Multiply the salary by 0.15. Example: salary 1000 × 0.15 = 150. In Tab 1: enter 15 as the percentage and your salary as the number.'}
    ],
    ar: [
      {q:'كيف أحسب 20% من 500؟', a:'اضرب العدد في النسبة المئوية ثم اقسم على 100: 500 × 20 ÷ 100 = 100. أو ببساطة 500 × 0.20 = 100. استخدم التبويب الأول في الحاسبة للنتيجة الفورية.'},
      {q:'كيف أحسب نسبة الزيادة في السعر؟', a:'نسبة التغيير = ((السعر الجديد − السعر القديم) ÷ السعر القديم) × 100. مثال: من 100 إلى 130 = ((130−100)÷100)×100 = 30% زيادة. استخدم تبويب «نسبة التغيير» في الحاسبة.'},
      {q:'ما نسبة 30 من 150؟', a:'اقسم الرقم الأول على الثاني ثم اضرب في 100: 30 ÷ 150 × 100 = 20%. استخدم تبويب «ما النسبة؟».'},
      {q:'كيف أحسب السعر بعد خصم 30%؟', a:'اضرب السعر الأصلي في (1 − نسبة الخصم). مثال: 200 بخصم 30% = 200 × 0.70 = 140. أو استخدم التبويب الأول: أدخل 30 كنسبة و200 كرقم للحصول على الخصم (60) ثم اطرحه من الأصلي.'},
      {q:'كيف أحسب ضريبة القيمة المضافة 5% على سعر؟', a:'اضرب السعر في 0.05 للحصول على قيمة الضريبة. مثال: 100 × 0.05 = 5 ضريبة، والإجمالي = 105. عمان والإمارات: VAT 5%. السعودية: VAT 15%.'},
      {q:'ما الفرق بين النسبة المئوية والنقطة المئوية؟', a:'النقطة المئوية هي الفرق المطلق بين نسبتين. مثال: الارتفاع من 10% إلى 15% هو +5 نقاط مئوية، لكن نسبة الزيادة هي 50% (لأن 5 ÷ 10 × 100 = 50%). هذا الخلط شائع في التقارير المالية.'},
      {q:'كيف أحسب نسبة الربح أو الخسارة؟', a:'نسبة الربح/الخسارة = ((سعر البيع − سعر الشراء) ÷ سعر الشراء) × 100. مثال: اشتريت بـ 200 وبعت بـ 250 = ((250−200)÷200)×100 = 25% ربح. استخدم تبويب «نسبة التغيير».'},
      {q:'كيف أحسب 15% من راتبي الشهري؟', a:'اضرب الراتب في 0.15. مثال: راتب 1000 × 0.15 = 150. في التبويب الأول: أدخل 15 كنسبة وراتبك كرقم.'}
    ],
    fr: [
      {q:'Comment calculer 20% de 500?', a:'Multipliez le nombre par le pourcentage puis divisez par 100 : 500 × 20 ÷ 100 = 100. Ou simplement 500 × 0,20 = 100. Utilisez le premier onglet de la calculatrice.'},
      {q:'Comment calculer une augmentation de prix en pourcentage?', a:'% Variation = ((Nouveau prix − Ancien prix) ÷ Ancien prix) × 100. Exemple : de 100 à 130 = 30% d\'augmentation. Utilisez l\'onglet «% de variation».'},
      {q:'Quel pourcentage représente 30 sur 150?', a:'Divisez le premier nombre par le second puis multipliez par 100 : 30 ÷ 150 × 100 = 20%.'},
      {q:'Comment calculer un prix après une remise de 30%?', a:'Multipliez le prix original par (1 − taux de remise). Exemple : 200 avec 30% de remise = 200 × 0,70 = 140.'},
      {q:'Comment calculer une TVA de 5% sur un prix?', a:'Multipliez le prix par 0,05 pour obtenir le montant de la taxe. Exemple : 100 × 0,05 = 5 de taxe, total = 105.'},
      {q:'Quelle est la différence entre pourcentage et point de pourcentage?', a:'Un point de pourcentage (pp) est la différence absolue entre deux pourcentages. Exemple : passer de 10% à 15% représente +5 points de pourcentage, mais une augmentation de 50%.'},
      {q:'Comment calculer un pourcentage de profit ou de perte?', a:'% Profit/Perte = ((Prix de vente − Prix d\'achat) ÷ Prix d\'achat) × 100.'},
      {q:'Comment calculer 15% de mon salaire mensuel?', a:'Multipliez le salaire par 0,15. Exemple : salaire 1000 × 0,15 = 150.'}
    ],
    es: [
      {q:'¿Cómo calculo el 20% de 500?', a:'Multiplica el número por el porcentaje y divide entre 100: 500 × 20 ÷ 100 = 100. O simplemente 500 × 0,20 = 100.'},
      {q:'¿Cómo calculo el aumento porcentual de un precio?', a:'% Cambio = ((Precio nuevo − Precio anterior) ÷ Precio anterior) × 100. Ejemplo: de 100 a 130 = 30% de aumento.'},
      {q:'¿Qué porcentaje representa 30 de 150?', a:'Divide el primer número entre el segundo y multiplica por 100: 30 ÷ 150 × 100 = 20%.'},
      {q:'¿Cómo calculo un precio después de un descuento del 30%?', a:'Multiplica el precio original por (1 − tasa de descuento). Ejemplo: 200 con 30% descuento = 200 × 0,70 = 140.'},
      {q:'¿Cómo calculo el IVA del 5% sobre un precio?', a:'Multiplica el precio por 0,05 para obtener el monto del impuesto. Ejemplo: 100 × 0,05 = 5 de impuesto, total = 105.'},
      {q:'¿Cuál es la diferencia entre porcentaje y punto porcentual?', a:'Un punto porcentual (pp) es la diferencia absoluta entre dos porcentajes. Subir del 10% al 15% son +5 puntos porcentuales, pero un aumento del 50%.'},
      {q:'¿Cómo calculo el porcentaje de ganancia o pérdida?', a:'% Ganancia/Pérdida = ((Precio de venta − Precio de compra) ÷ Precio de compra) × 100.'},
      {q:'¿Cómo calculo el 15% de mi salario mensual?', a:'Multiplica el salario por 0,15. Ejemplo: salario 1000 × 0,15 = 150.'}
    ],
    de: [
      {q:'Wie berechne ich 20% von 500?', a:'Multiplizieren Sie die Zahl mit dem Prozentsatz und dividieren Sie durch 100: 500 × 20 ÷ 100 = 100. Oder einfach 500 × 0,20 = 100.'},
      {q:'Wie berechne ich einen prozentualen Preisanstieg?', a:'% Änderung = ((Neuer Preis − Alter Preis) ÷ Alter Preis) × 100. Beispiel: von 100 auf 130 = 30% Anstieg.'},
      {q:'Wie viel Prozent sind 30 von 150?', a:'Teilen Sie die erste Zahl durch die zweite und multiplizieren Sie mit 100: 30 ÷ 150 × 100 = 20%.'},
      {q:'Wie berechne ich einen Preis nach einem 30% Rabatt?', a:'Multiplizieren Sie den Originalpreis mit (1 − Rabattrate). Beispiel: 200 mit 30% Rabatt = 200 × 0,70 = 140.'},
      {q:'Wie berechne ich 5% MwSt auf einen Preis?', a:'Multiplizieren Sie den Preis mit 0,05, um den Steuerbetrag zu erhalten. Beispiel: 100 × 0,05 = 5 Steuer, Gesamt = 105.'},
      {q:'Was ist der Unterschied zwischen Prozent und Prozentpunkt?', a:'Ein Prozentpunkt (pp) ist die absolute Differenz zwischen zwei Prozentwerten. Von 10% auf 15% = +5 Prozentpunkte, aber 50% Anstieg.'},
      {q:'Wie berechne ich den Gewinn- oder Verlustsatz?', a:'% Gewinn/Verlust = ((Verkaufspreis − Kaufpreis) ÷ Kaufpreis) × 100.'},
      {q:'Wie berechne ich 15% meines monatlichen Gehalts?', a:'Multiplizieren Sie das Gehalt mit 0,15. Beispiel: Gehalt 1000 × 0,15 = 150.'}
    ],
    ru: [
      {q:'Как вычислить 20% от 500?', a:'Умножьте число на процент и разделите на 100: 500 × 20 ÷ 100 = 100. Или просто 500 × 0,20 = 100.'},
      {q:'Как рассчитать процентный рост цены?', a:'% Изменения = ((Новая цена − Старая цена) ÷ Старая цена) × 100. Пример: от 100 до 130 = 30% рост.'},
      {q:'Каков процент 30 от 150?', a:'Разделите первое число на второе и умножьте на 100: 30 ÷ 150 × 100 = 20%.'},
      {q:'Как рассчитать цену после скидки 30%?', a:'Умножьте исходную цену на (1 − ставка скидки). Пример: 200 со скидкой 30% = 200 × 0,70 = 140.'},
      {q:'Как рассчитать НДС 5% на цену?', a:'Умножьте цену на 0,05, чтобы получить сумму налога. Пример: 100 × 0,05 = 5 налог, итого = 105.'},
      {q:'В чём разница между процентом и процентным пунктом?', a:'Процентный пункт (пп) — это абсолютная разница между двумя процентами. Рост с 10% до 15% = +5 процентных пунктов, но увеличение на 50%.'},
      {q:'Как рассчитать процент прибыли или убытка?', a:'% Прибыли/Убытка = ((Цена продажи − Цена покупки) ÷ Цена покупки) × 100.'},
      {q:'Как рассчитать 15% от моей ежемесячной зарплаты?', a:'Умножьте зарплату на 0,15. Пример: зарплата 1000 × 0,15 = 150.'}
    ]
  }
};


/* ── renderFAQ: inject FAQ from PAGE_FAQ for current page ── */
function renderFAQ(lang) {
  const page = _getPageSlug();
  const faqData = PAGE_FAQ[page];
  if (!faqData) return;
  const t = T[lang] || T.en;
  const faqCard = document.getElementById('faqCard');
  if (!faqCard) return;
  const items = faqData[lang] || faqData.en;
  if (!items || !items.length) return;
  // Clear existing details elements and rebuild
  faqCard.querySelectorAll('details').forEach(function(d) { d.remove(); });
  // Ensure title exists
  let titleEl = faqCard.querySelector('[data-i18n="faq_title"]');
  if (!titleEl) {
    titleEl = document.createElement('div');
    titleEl.className = 'card-title';
    titleEl.style.fontSize = '15px';
    titleEl.setAttribute('data-i18n', 'faq_title');
    titleEl.textContent = t.faq_title || '❓ FAQ';
    faqCard.insertBefore(titleEl, faqCard.firstChild);
  } else {
    titleEl.textContent = t.faq_title || '❓ FAQ';
  }
  items.forEach(function(item, i) {
    const details = document.createElement('details');
    details.style.cssText = 'margin-top:' + (i === 0 ? '12' : '8') + 'px;border:1px solid var(--border);border-radius:8px;padding:12px;';
    const summary = document.createElement('summary');
    summary.style.cssText = 'font-weight:700;cursor:pointer;font-size:14px;';
    summary.textContent = item.q;
    const p = document.createElement('p');
    p.style.cssText = 'margin-top:8px;font-size:14px;color:var(--text-muted);line-height:1.7;';
    p.textContent = item.a;
    details.append(summary, p);
    faqCard.appendChild(details);
  });
}

function _getPageSlug() {
  // Nested pages under /jo/, /om/, etc. all end in .../<tool-name>/index.html
  // — the last path segment is always literally "index", so this used to
  // return the single string "index" for every one of them (a shared id,
  // making them all silently collide as "the same favorite"). Fall through
  // to the parent folder name whenever the last segment is index/empty.
  var parts = location.pathname.split('/').filter(function(s) { return s.length > 0; });
  var last = (parts[parts.length - 1] || '').replace('.html', '');
  if (!last || last === 'index') return parts[parts.length - 2] || 'index';
  return last;
}

function detectDefaultLang() {
  var urlLangs = ['ar', 'fr', 'es', 'de', 'ru'];
  var pathParts = location.pathname.split('/').filter(function(s) { return s.length > 0; });
  // 1. Explicit language code in URL path — /ar/tool/, /fr/tool/ etc. Always
  //    wins: this is an unambiguous navigation signal (a direct link, a
  //    translated search result) and must not be overridden by a stale
  //    preference from a previous, differently-languaged visit.
  for (var i = 0; i < pathParts.length; i++) {
    if (urlLangs.indexOf(pathParts[i]) !== -1) {
      try { localStorage.setItem('lang', pathParts[i]); } catch(e) {}
      return pathParts[i];
    }
  }
  // 2. A user's own explicit choice (setLang() via the dropdown) always
  //    writes localStorage.lang — but this function used to never read it
  //    back, so switching language only ever affected the current page view
  //    and silently reverted on every subsequent navigation (user-reported:
  //    "changing the language disappears"). Respect it before falling back
  //    to any country-based guess.
  try {
    var savedLang = localStorage.getItem('lang');
    if (savedLang && T[savedLang]) return savedLang;
  } catch(e) {}
  // 3. Country-specific pages — /om/ → ar, /sa/ → ar, /ae/ /us/ /uk/ → en
  var cmap = {om:'ar', sa:'ar', jo:'ar', ae:'en', us:'en', uk:'en'};
  for (var j = 0; j < pathParts.length; j++) {
    if (cmap[pathParts[j]] !== undefined) return cmap[pathParts[j]];
  }
  // 4. Root pages (no language in URL, no saved preference yet): check this
  //    session's detected country (set by initCountryDetect() when the user
  //    visited a country hub like /jo/) rather than blindly forcing English.
  try {
    var sessCountry = sessionStorage.getItem('adawati_country');
    var countryLangMap = {OM:'ar', SA:'ar', JO:'ar', AE:'en', US:'en', GB:'en'};
    if (sessCountry && countryLangMap[sessCountry]) return countryLangMap[sessCountry];
  } catch(e) {}
  // No saved preference and no session country detected: default to English.
  //    Arabic/French/Spanish users should use /ar/ /fr/ /es/ subdirectories.
  return 'en';
}

/* ── Dark Mode ── */
function initDarkMode() {
  if (localStorage.getItem('dark') === '1') document.documentElement.classList.add('dark');
}
function toggleDark() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('dark', isDark ? '1' : '0');
  updateDarkBtn();
}
function updateDarkBtn() {
  const btn = document.getElementById('darkToggleBtn');
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.title = isDark ? 'Light mode' : 'Dark mode';
}
function injectDarkToggle() {
  const nav = document.querySelector('.nav-links');
  if (!nav || document.getElementById('darkToggleBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'darkToggleBtn';
  btn.className = 'dark-toggle';
  btn.onclick = toggleDark;
  const isDark = document.documentElement.classList.contains('dark');
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.title = isDark ? 'Light mode' : 'Dark mode';
  const langSwitcher = nav.querySelector('.lang-switcher');
  if (langSwitcher) nav.insertBefore(btn, langSwitcher);
  else nav.appendChild(btn);
}

/* ── Mobile nav collapse ──
   Below 768px, .nav-links (About/Contact/auth/dark-toggle/country/language —
   whatever a given page has injected into it) is hidden by CSS and shown only
   via this hamburger toggle, instead of shrinking font/padding to force
   everything onto one crowded row. Operates purely on the existing shared
   .nav-links element so it needs no per-page markup changes. */
function initMobileNavToggle() {
  const container = document.querySelector('.nav-container');
  const links = document.querySelector('.nav-links');
  if (!container || !links || document.getElementById('navToggleBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'navToggleBtn';
  btn.className = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '☰';
  container.insertBefore(btn, links);

  function closeMenu() {
    links.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '☰';
  }
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const open = links.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? '✕' : '☰';
  });
  document.addEventListener('click', function(e) {
    if (links.classList.contains('nav-open') && !links.contains(e.target) && e.target !== btn) closeMenu();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && links.classList.contains('nav-open')) closeMenu();
  });
}

/* ── PWA / Service Worker ── */
let _deferredInstall = null;
// Auto-reload when a new SW takes over, so stale HTML is never served to users
if ('serviceWorker' in navigator && !sessionStorage.getItem('sw_reloaded')) {
  navigator.serviceWorker.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'SW_UPDATED') {
      sessionStorage.setItem('sw_reloaded', '1');
      location.reload();
    }
  });
}
function initPWA() {
  if (!('serviceWorker' in navigator)) return;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  navigator.serviceWorker.register(base + '/sw.js', {updateViaCache:'none'}).catch(() => {});

  if (!document.querySelector('link[rel="manifest"]')) {
    const l = document.createElement('link');
    l.rel = 'manifest'; l.href = base + '/manifest.json';
    document.head.appendChild(l);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const m = document.createElement('meta');
    m.name = 'theme-color'; m.content = '#2563eb';
    document.head.appendChild(m);
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _deferredInstall = e;
    if (!localStorage.getItem('pwa_dismissed')) {
      setTimeout(() => { if (_deferredInstall) showPWABanner(); }, 4000);
    }
  });
}

function showPWABanner() {
  if (document.getElementById('pwaBanner')) return;
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const banner = document.createElement('div');
  banner.id = 'pwaBanner';
  banner.className = 'pwa-banner';
  banner.innerHTML = '';
  const title = document.createElement('div');
  title.className = 'pwa-banner-title';
  title.textContent = '⚡ ' + (t.pwa_title || 'Install App');
  const sub = document.createElement('div');
  sub.className = 'pwa-banner-sub';
  sub.textContent = t.pwa_sub || 'Add to your home screen';
  const btns = document.createElement('div');
  btns.className = 'pwa-banner-btns';
  const installBtn = document.createElement('button');
  installBtn.className = 'pwa-install-btn';
  installBtn.textContent = t.pwa_install || 'Install';
  installBtn.onclick = () => { if (_deferredInstall) { _deferredInstall.prompt(); _deferredInstall.userChoice.then(() => { banner.remove(); }); } };
  const dismissBtn = document.createElement('button');
  dismissBtn.className = 'pwa-dismiss-btn';
  dismissBtn.textContent = t.pwa_later || 'Later';
  dismissBtn.onclick = () => { localStorage.setItem('pwa_dismissed', '1'); banner.remove(); };
  btns.append(installBtn, dismissBtn);
  banner.append(title, sub, btns);
  document.body.appendChild(banner);
}

/* ── Related Tools ── */
const RELATED_MAP = {
  'bmi-calculator':      [['diet-plan','🥗','diet_card_title'],['age-calculator','📅','age_card_title']],
  'diet-plan':           [['bmi-calculator','⚖️','bmi_card_title'],['unit-converter','🔄','unit_card_title']],
  'currency-converter':  [['loan-calculator','🧮','loan_card_title'],['tip-calculator','🤝','tip_card_title']],
  'loan-calculator':     [['currency-converter','💱','currency_card_title'],['discount-calculator','💯','discount_card_title']],
  'age-calculator':      [['bmi-calculator','⚖️','bmi_card_title'],['diet-plan','🥗','diet_card_title']],
  'discount-calculator': [['loan-calculator','🧮','loan_card_title'],['tip-calculator','🤝','tip_card_title']],
  'tip-calculator':      [['currency-converter','💱','currency_card_title'],['discount-calculator','💯','discount_card_title']],
  'unit-converter':      [['currency-converter','💱','currency_card_title'],['word-counter','🔤','word_card_title']],
  'password-generator':  [['qr-generator','📱','qr_card_title'],['word-counter','🔤','word_card_title']],
  'word-counter':        [['password-generator','🔑','pass_card_title'],['qr-generator','📱','qr_card_title']],
  'qr-generator':        [['password-generator','🔑','pass_card_title'],['word-counter','🔤','word_card_title']],
  'timezone-converter':  [['stopwatch','⏱️','sw_card_title'],['currency-converter','💱','currency_card_title']],
  'random-number':       [['stopwatch','⏱️','sw_card_title'],['qr-generator','📱','qr_card_title']],
  'stopwatch':           [['random-number','🎲','rng_card_title'],['timezone-converter','🕐','tz_card_title']],
  'vat-calculator':     [['salary-calculator','💼','sal_card_title'],['loan-calculator','🧮','loan_card_title']],
  'salary-calculator':  [['end-of-service','📋','eos_card_title'],['vat-calculator','🧾','vat_card_title']],
  'end-of-service':     [['salary-calculator','💼','sal_card_title'],['loan-calculator','🧮','loan_card_title']],
  'hijri-converter':    [['age-calculator','📅','age_card_title'],['end-of-service','📋','eos_card_title']],
  'percentage-calculator': [['vat-calculator','🧾','vat_card_title'],['loan-calculator','🧮','loan_card_title'],['discount-calculator','💯','discount_card_title']],
};

/* ── Branded result-image export/share ──
   Renders a shareable, designed image (portrait, WhatsApp-friendly) of a
   calculator's result via plain Canvas 2D — no image/screenshot library
   needed, works everywhere, and Arabic RTL renders correctly via
   ctx.direction. Individual calculator pages call this with their own
   already-computed rows; it does not read the DOM itself, since every
   calculator's result markup is different. */
function exportResultImage(titleText, rows, embedCanvas) {
  const lang = localStorage.getItem('lang') || 'en';
  const isRtl = lang === 'ar';
  const W = 1080;
  // Optional embedded image (e.g. a generated QR code) drawn between the
  // title and the rows — every existing caller omits this 3rd argument, so
  // imgBlockH stays 0 and the layout is byte-for-byte unchanged for them.
  const imgSize = embedCanvas ? 460 : 0;
  const imgBlockH = embedCanvas ? imgSize + 60 : 0;

  // Two-pass measurement: a throwaway canvas decides which rows are too
  // long for the normal side-by-side label/value layout (e.g. a full
  // sentence — a historical-events row — rather than a short number or
  // word) and how many lines that needs, before the real canvas (whose
  // height depends on this) is created. Rows below the threshold render
  // exactly as before — this only changes behavior for genuinely long
  // values, zero risk to the many short label/value calculators already
  // using this function.
  const cardWMeasure = W - 120 - 100; // matches cardW - (50px padding each side) below
  const valueColMaxW = cardWMeasure * 0.55;
  const measureCanvas = document.createElement('canvas');
  const mctx = measureCanvas.getContext('2d');
  function wrapLines(text, font, maxW) {
    mctx.font = font;
    const words = String(text).split(' ');
    let line = '', lines = [];
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (mctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }
  const rowPlans = rows.map(function(r) {
    const big = !!r.highlight;
    const valueFont = (big ? '800 46px' : '700 36px') + ' Tahoma, Arial, sans-serif';
    mctx.font = valueFont;
    if (mctx.measureText(String(r.value)).width <= valueColMaxW) {
      return { row: r, wrapped: false, height: big ? 78 : 66 };
    }
    const stackedFont = (big ? '800 34px' : '700 30px') + ' Tahoma, Arial, sans-serif';
    const lines = wrapLines(r.value, stackedFont, cardWMeasure);
    const lineH = big ? 44 : 40;
    return { row: r, wrapped: true, lines: lines, lineH: lineH, height: 40 + lines.length * lineH + 24 };
  });

  // Height follows row content instead of a fixed value — a 3-row result
  // (e.g. a simple percentage calc) shouldn't render with a huge empty
  // card, and a long breakdown (e.g. a loan amortization summary)
  // shouldn't get clipped.
  const rowsHeight = rowPlans.reduce((sum, p) => sum + p.height, 0);
  const H = Math.min(Math.max(260 + (imgBlockH + rowsHeight + 140) + 170, 900), 1920);
  const cardH = H - 260 - 170;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#2563eb');
  bg.addColorStop(1, '#7c3aed');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.direction = isRtl ? 'rtl' : 'ltr';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = '700 52px Tahoma, Arial, sans-serif';
  ctx.fillText('⚡ ' + (isRtl ? 'أدواتي' : 'Adawati'), W / 2, 110);
  ctx.font = '700 40px Tahoma, Arial, sans-serif';
  wrapText(titleText, W / 2, 185, W - 160, 48);

  const cardX = 60, cardY = 260, cardW = W - 120;
  roundRect(cardX, cardY, cardW, cardH, 32);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;

  // A row's label/value can be pure Latin (a currency code, "1 EUR = 1.16
  // USD", an English abbreviation) even while the card itself is in Arabic
  // — rendering those with ctx.direction still set to 'rtl' bidi-reorders
  // the whole string ("1 EUR = 1.16 USD" becomes "EUR = 1.16 USD 1"), the
  // same class of bug fixed elsewhere in this file for untranslated static
  // text. ctx.textAlign stays anchored to the fixed x position regardless;
  // only ctx.direction (which governs internal character/word reordering)
  // needs to match the string's own script, not the card's overall layout.
  function fillRowText(str, x, align) {
    // direction and textAlign are set together, immediately before
    // fillText, in one call — WebKit/Safari has a real canvas bug where
    // assigning ctx.direction *after* ctx.textAlign was already set in an
    // earlier statement can silently flip which edge textAlign anchors to
    // (confirmed via a real user report: a right-anchored LTR value like
    // "Muscat" rendered as if left-aligned, overflowing past the card's
    // and even the canvas's right edge — invisible in Chrome-based testing,
    // which doesn't have this bug). Keeping both assignments atomic here,
    // with textAlign set last, avoids the ordering entirely.
    ctx.direction = /[؀-ۿ]/.test(str) ? 'rtl' : 'ltr';
    ctx.textAlign = align;
    ctx.fillText(str, x, rowY);
  }

  let rowY = cardY + 100;
  if (embedCanvas) {
    const imgX = cardX + (cardW - imgSize) / 2;
    const imgY = rowY;
    roundRect(imgX - 12, imgY - 12, imgSize + 24, imgSize + 24, 16);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.drawImage(embedCanvas, imgX, imgY, imgSize, imgSize);
    rowY += imgBlockH;
  }
  const rowMaxY = cardY + cardH - 40;
  rowPlans.forEach(function(p, i) {
    const r = p.row;
    const big = !!r.highlight;
    if (!p.wrapped) {
      ctx.fillStyle = '#64748b';
      ctx.font = '500 32px Tahoma, Arial, sans-serif';
      fillRowText(r.label, isRtl ? cardX + cardW - 50 : cardX + 50, isRtl ? 'right' : 'left');
      ctx.fillStyle = big ? '#2563eb' : '#0f172a';
      ctx.font = (big ? '800 46px' : '700 36px') + ' Tahoma, Arial, sans-serif';
      fillRowText(r.value, isRtl ? cardX + 50 : cardX + cardW - 50, isRtl ? 'left' : 'right');
      rowY += big ? 78 : 66;
    } else {
      // Long value (e.g. a full sentence) — stack label as a small heading
      // above the wrapped value text, both anchored to the same edge,
      // instead of the normal opposing-edges label/value columns.
      const anchorX = isRtl ? cardX + cardW - 50 : cardX + 50;
      ctx.fillStyle = '#64748b';
      ctx.font = '600 28px Tahoma, Arial, sans-serif';
      fillRowText(r.label, anchorX, isRtl ? 'right' : 'left');
      rowY += 40;
      ctx.fillStyle = big ? '#2563eb' : '#0f172a';
      ctx.font = (big ? '800 34px' : '700 30px') + ' Tahoma, Arial, sans-serif';
      p.lines.forEach(function(line) {
        fillRowText(line, anchorX, isRtl ? 'right' : 'left');
        rowY += p.lineH;
      });
      rowY += 8;
    }
    if (i < rowPlans.length - 1 && rowY < rowMaxY) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX + 30, rowY - 28);
      ctx.lineTo(cardX + cardW - 30, rowY - 28);
      ctx.stroke();
    }
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = '600 28px Tahoma, Arial, sans-serif';
  ctx.fillText('adawati.space', W / 2, H - 55);

  function wrapText(text, cx, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    lines.forEach(function(l, i) { ctx.fillText(l, cx, y + i * lineHeight); });
  }

  canvas.toBlob(function(blob) {
    if (!blob) return;
    const file = new File([blob], 'adawati-result.png', { type: 'image/png' });
    // A PNG's own pixels can never be a clickable link — this is a real
    // format limitation, not something fixable in the image itself. The
    // closest real equivalent: pass the page's own URL as accompanying
    // share text, since apps like WhatsApp/Messages/Mail auto-linkify a
    // URL in that text field, so it IS tappable once actually shared —
    // just not by tapping on the image pixels themselves.
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: titleText, text: location.href }).catch(function() {});
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'adawati-result.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function() { URL.revokeObjectURL(url); }, 4000);
    }
  }, 'image/png');
}

function injectShareBtn() {
  const page = _getPageSlug();
  if (!page || page === 'index') return;
  const card = document.querySelector('.card');
  if (!card || document.getElementById('shareResultBtn')) return;
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const btn = document.createElement('button');
  btn.id = 'shareResultBtn';
  btn.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:16px;padding:13px;background:linear-gradient(135deg,#2563eb,#7c3aed);border:none;border-radius:12px;font-size:15px;font-weight:800;font-family:inherit;cursor:pointer;color:#fff;box-shadow:0 4px 14px rgba(37,99,235,0.28);';
  btn.textContent = '📤 ' + (t.share_btn || 'Share');
  btn.onclick = function() {
    const shareData = { title: document.title, url: location.href };
    if (navigator.share) {
      navigator.share(shareData).catch(function() {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(function() {
        showToast(t.share_result_copied || '✅ Link copied', 'success');
      }).catch(function() {});
    }
  };
  card.appendChild(btn);
}

function injectRelatedTools() {
  const page = _getPageSlug();
  const related = RELATED_MAP[page];
  if (!related) return;
  const card = document.querySelector('.card');
  if (!card) return;
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  const section = document.createElement('div');
  section.className = 'related-tools';
  const heading = document.createElement('h3');
  heading.textContent = t.related_title || 'Related Tools';
  const links = document.createElement('div');
  links.className = 'related-links';
  related.forEach(([slug, icon, titleKey]) => {
    const a = document.createElement('a');
    a.href = base + '/' + slug + '.html';
    a.className = 'related-link';
    a.textContent = icon + ' ' + (t[titleKey] || slug);
    links.appendChild(a);
  });
  section.append(heading, links);
  card.appendChild(section);
}

/* ── Favorites & Recent ── */
const TOOL_META = {
  'bmi-calculator':      {icon:'⚖️', bg:'#eff6ff', titleKey:'bmi_card_title', descKey:'bmi_card_desc'},
  'diet-plan':           {icon:'🥗', bg:'#f0fdf4', titleKey:'diet_card_title', descKey:'diet_card_desc'},
  'currency-converter':  {icon:'💱', bg:'#fefce8', titleKey:'currency_card_title', descKey:'currency_card_desc'},
  'loan-calculator':     {icon:'🧮', bg:'#faf5ff', titleKey:'loan_card_title', descKey:'loan_card_desc'},
  'age-calculator':      {icon:'📅', bg:'#fff7ed', titleKey:'age_card_title', descKey:'age_card_desc'},
  'discount-calculator': {icon:'💯', bg:'#fef2f2', titleKey:'discount_card_title', descKey:'discount_card_desc'},
  'tip-calculator':      {icon:'🤝', bg:'#fdf4ff', titleKey:'tip_card_title', descKey:'tip_card_desc'},
  'unit-converter':      {icon:'🔄', bg:'#f0f9ff', titleKey:'unit_card_title', descKey:'unit_card_desc'},
  'password-generator':  {icon:'🔑', bg:'#f8fafc', titleKey:'pass_card_title', descKey:'pass_card_desc'},
  'word-counter':        {icon:'🔤', bg:'#fefce8', titleKey:'word_card_title', descKey:'word_card_desc'},
  'qr-generator':        {icon:'📱', bg:'#f0fdf4', titleKey:'qr_card_title', descKey:'qr_card_desc'},
  'timezone-converter':  {icon:'🕐', bg:'#fff7ed', titleKey:'tz_card_title', descKey:'tz_card_desc'},
  'random-number':       {icon:'🎲', bg:'#fdf4ff', titleKey:'rng_card_title', descKey:'rng_card_desc'},
  'stopwatch':           {icon:'⏱️', bg:'#eff6ff', titleKey:'sw_card_title', descKey:'sw_card_desc'},
  'vat-calculator':      {icon:'🧾', bg:'#fefce8', titleKey:'vat_card_title', descKey:'vat_card_desc'},
  'salary-calculator':   {icon:'💼', bg:'#f0fdf4', titleKey:'sal_card_title', descKey:'sal_card_desc'},
  'end-of-service':      {icon:'📋', bg:'#f0f9ff', titleKey:'eos_card_title', descKey:'eos_card_desc'},
  'hijri-converter':     {icon:'🌙', bg:'#fdf4ff', titleKey:'hijri_card_title', descKey:'hijri_card_desc'},
  'percentage-calculator':{icon:'💯', bg:'#fef2f2', titleKey:'pct_card_title', descKey:'pct_card_desc'},
  'compound-interest':   {icon:'📈', bg:'#f0fdf4', titleKey:'ci_card_title', descKey:'ci_card_desc'},
  'date-diff':           {icon:'📆', bg:'#fff7ed', titleKey:'dd_card_title', descKey:'dd_card_desc'},
  'file-converter':      {icon:'📂', bg:'#f0fdf4', titleKey:'fc_card_title', descKey:'fc_card_desc'},
  'image-compressor':    {icon:'🖼️', bg:'#f0f9ff', titleKey:'ic_card_title', descKey:'ic_card_desc'},
  'number-guess':        {icon:'🎯', bg:'#fdf4ff', titleKey:'guess_card_title', descKey:'guess_card_desc'},
  'memory-game':         {icon:'🃏', bg:'#fef9c3', titleKey:'memory_card_title', descKey:'memory_card_desc'},
  'quick-math':          {icon:'🔢', bg:'#fef3c7', titleKey:'qmath_card_title', descKey:'qmath_card_desc'},
  'reaction-test':       {icon:'⚡', bg:'#f0fdf4', titleKey:'react_card_title', descKey:'react_card_desc'},
  'car-game':            {icon:'🚗', bg:'#fef3c7', titleKey:'car_card_title',  descKey:'car_card_desc'},
  'jump-game':           {icon:'🦸', bg:'#f0fdf4', titleKey:'jump_card_title', descKey:'jump_card_desc'},
  'kids-learn':          {icon:'🧒', bg:'#fef9c3', titleKey:'kids_card_title', descKey:'kids_card_desc'},
};

function getFavs() {
  try { return JSON.parse(localStorage.getItem('adawati_favs') || '[]'); } catch { return []; }
}
function saveFavs(arr) { localStorage.setItem('adawati_favs', JSON.stringify(arr)); }
function isFav(id) { return getFavs().includes(id); }
function toggleFav(id) {
  const favs = getFavs();
  const idx = favs.indexOf(id);
  if (idx > -1) favs.splice(idx, 1); else favs.push(id);
  saveFavs(favs);
  syncFavsToCloud();
  renderFavSection();
  document.querySelectorAll('.fav-star[data-id="' + id + '"]').forEach(function(s) {
    s.textContent = isFav(id) ? '⭐' : '☆';
    s.classList.toggle('fav-active', isFav(id));
  });
}
function getRecent() {
  try { return JSON.parse(localStorage.getItem('adawati_recent') || '[]'); } catch { return []; }
}
function trackRecent(id) {
  var list = getRecent().filter(function(x) { return x !== id; });
  list.unshift(id);
  localStorage.setItem('adawati_recent', JSON.stringify(list.slice(0, 6)));
  syncRecentToCloud();
}

function captureFavMeta(id) {
  // TOOL_META only covers the ~30 original root-level tools — every /jo/,
  // /om/, /ae/... country-vertical page (100+, and growing) is missing from
  // it, so favoriting one used to render nothing in the favorites section
  // (buildMiniCard returned null). Capture title+url from the live page
  // itself so any page can be favorited, not just the ones in the registry.
  try {
    var meta = JSON.parse(localStorage.getItem('adawati_fav_meta') || '{}');
    var h1 = document.querySelector('h1');
    var title = (h1 && h1.textContent.trim()) || document.title.split('|')[0].split('—')[0].trim() || id;
    meta[id] = { title: title, url: location.pathname };
    localStorage.setItem('adawati_fav_meta', JSON.stringify(meta));
  } catch (e) {}
}

function buildMiniCard(id, t, base) {
  const meta = TOOL_META[id];
  if (meta) {
    const a = document.createElement('a');
    a.href = base + '/' + id + '.html';
    a.className = 'tool-card';
    a.style.position = 'relative';
    a.innerHTML =
      '<div class="tool-icon-wrap" style="background:' + meta.bg + ';">' + meta.icon + '</div>' +
      '<div class="tool-card-title" data-i18n="' + meta.titleKey + '">' + (t[meta.titleKey] || id) + '</div>' +
      '<div class="tool-card-desc" data-i18n="' + meta.descKey + '">' + (t[meta.descKey] || '') + '</div>' +
      '<div class="tool-card-arrow" data-i18n="start">' + (t.start || '→') + '</div>';
    return a;
  }
  // Fallback for pages outside TOOL_META: use metadata captured when the
  // page itself was visited/favorited (see captureFavMeta). Not available
  // if this favorite arrived via cross-device sync and this device never
  // visited that page locally — an accepted limitation, not a crash.
  var favMeta;
  try { favMeta = JSON.parse(localStorage.getItem('adawati_fav_meta') || '{}')[id]; } catch (e) {}
  if (!favMeta) return null;
  const a = document.createElement('a');
  a.href = favMeta.url;
  a.className = 'tool-card';
  a.style.position = 'relative';
  a.innerHTML =
    '<div class="tool-icon-wrap" style="background:#f0f9ff;">🔧</div>' +
    '<div class="tool-card-title">' + favMeta.title + '</div>' +
    '<div class="tool-card-desc"></div>' +
    '<div class="tool-card-arrow">' + (t.start || '→') + '</div>';
  return a;
}

function renderFavSection() {
  const favSection = document.getElementById('favSection');
  const favGrid = document.getElementById('favGrid');
  if (!favSection || !favGrid) return;
  const favs = getFavs();
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  favGrid.innerHTML = '';
  if (favs.length === 0) { favSection.style.display = 'none'; return; }
  const validFavs = [];
  favs.forEach(function(id) {
    const card = buildMiniCard(id, t, base);
    if (card) { favGrid.appendChild(card); validFavs.push(id); }
  });
  if (validFavs.length !== favs.length) saveFavs(validFavs);
  favSection.style.display = favGrid.querySelector('.tool-card') ? '' : 'none';
  injectStarBtns();
}

function renderRecentSection() {
  const recentSection = document.getElementById('recentSection');
  const recentGrid = document.getElementById('recentGrid');
  if (!recentSection || !recentGrid) return;
  const recent = getRecent();
  const lang = localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.ar;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  recentGrid.innerHTML = '';
  if (recent.length === 0) { recentSection.style.display = 'none'; return; }
  recent.forEach(function(id) {
    const card = buildMiniCard(id, t, base);
    if (card) recentGrid.appendChild(card);
  });
  recentSection.style.display = recentGrid.querySelector('.tool-card') ? '' : 'none';
}

function injectStarBtns() {
  if (!document.getElementById('toolsGrid')) return;
  var lang = localStorage.getItem('lang') || 'en';
  var t = T[lang] || T.en;
  document.querySelectorAll('#toolsGrid .tool-card, #favGrid .tool-card, #recentGrid .tool-card').forEach(function(card) {
    if (card.querySelector('.fav-star')) return;
    const href = card.getAttribute('href') || '';
    const id = href.split('/').pop().replace('.html', '');
    if (!TOOL_META[id]) return;
    const star = document.createElement('button');
    star.className = 'fav-star' + (isFav(id) ? ' fav-active' : '');
    star.setAttribute('data-id', id);
    star.textContent = isFav(id) ? '⭐' : '☆';
    star.title = isFav(id) ? (t.remove_fav || 'Remove from Favorites') : (t.add_fav || 'Add to Favorites');
    star.onclick = function(e) { e.preventDefault(); e.stopPropagation(); toggleFav(id); };
    card.style.position = 'relative';
    card.appendChild(star);
  });
}

/* ── Country Detection & Geo-recommended tools ── */
const COUNTRY_DATA = {
  // ── Gulf & Levant ──────────────────────────────────────────────────────────
  'OM': { flag:'🇴🇲', name:'عُمان',          nameEn:'Oman',
    tools:['vat-calculator','salary-calculator','end-of-service','hijri-converter'] },
  'SA': { flag:'🇸🇦', name:'السعودية',        nameEn:'Saudi Arabia',
    tools:['vat-calculator','loan-calculator','hijri-converter','currency-converter'] },
  'AE': { flag:'🇦🇪', name:'الإمارات',        nameEn:'UAE',
    tools:['vat-calculator','loan-calculator','currency-converter','hijri-converter'] },
  'KW': { flag:'🇰🇼', name:'الكويت',          nameEn:'Kuwait',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'QA': { flag:'🇶🇦', name:'قطر',             nameEn:'Qatar',
    tools:['currency-converter','loan-calculator','discount-calculator','hijri-converter'] },
  'BH': { flag:'🇧🇭', name:'البحرين',         nameEn:'Bahrain',
    tools:['vat-calculator','loan-calculator','currency-converter','hijri-converter'] },
  'JO': { flag:'🇯🇴', name:'الأردن',          nameEn:'Jordan',
    tools:['currency-converter','loan-calculator','age-calculator','hijri-converter'] },
  'PS': { flag:'🇵🇸', name:'فلسطين',          nameEn:'Palestine',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'SY': { flag:'🇸🇾', name:'سوريا',           nameEn:'Syria',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'LB': { flag:'🇱🇧', name:'لبنان',           nameEn:'Lebanon',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'IQ': { flag:'🇮🇶', name:'العراق',          nameEn:'Iraq',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  // ── North Africa ───────────────────────────────────────────────────────────
  'EG': { flag:'🇪🇬', name:'مصر',             nameEn:'Egypt',
    tools:['currency-converter','loan-calculator','discount-calculator','age-calculator'] },
  'MA': { flag:'🇲🇦', name:'المغرب',          nameEn:'Morocco',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'DZ': { flag:'🇩🇿', name:'الجزائر',         nameEn:'Algeria',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'TN': { flag:'🇹🇳', name:'تونس',            nameEn:'Tunisia',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'LY': { flag:'🇱🇾', name:'ليبيا',           nameEn:'Libya',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'SD': { flag:'🇸🇩', name:'السودان',         nameEn:'Sudan',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  // ── Sub-Saharan & Horn of Africa (Arab League members) ────────────────────
  'SO': { flag:'🇸🇴', name:'الصومال',         nameEn:'Somalia',
    tools:['currency-converter','loan-calculator','age-calculator','hijri-converter'] },
  'MR': { flag:'🇲🇷', name:'موريتانيا',       nameEn:'Mauritania',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'DJ': { flag:'🇩🇯', name:'جيبوتي',          nameEn:'Djibouti',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'KM': { flag:'🇰🇲', name:'جزر القمر',       nameEn:'Comoros',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'YE': { flag:'🇾🇪', name:'اليمن',           nameEn:'Yemen',
    tools:['currency-converter','loan-calculator','age-calculator','hijri-converter'] },
  // ── Top world countries by internet users ─────────────────────────────────
  'CN': { flag:'🇨🇳', name:'الصين',           nameEn:'China',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'IN': { flag:'🇮🇳', name:'الهند',           nameEn:'India',
    tools:['currency-converter','bmi-calculator','loan-calculator','percentage-calculator'] },
  'US': { flag:'🇺🇸', name:'الولايات المتحدة',nameEn:'USA',
    tools:['tip-calculator','discount-calculator','loan-calculator','currency-converter'] },
  'ID': { flag:'🇮🇩', name:'إندونيسيا',       nameEn:'Indonesia',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'BR': { flag:'🇧🇷', name:'البرازيل',        nameEn:'Brazil',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'RU': { flag:'🇷🇺', name:'روسيا',           nameEn:'Russia',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'JP': { flag:'🇯🇵', name:'اليابان',         nameEn:'Japan',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'NG': { flag:'🇳🇬', name:'نيجيريا',        nameEn:'Nigeria',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'PK': { flag:'🇵🇰', name:'باكستان',         nameEn:'Pakistan',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'BD': { flag:'🇧🇩', name:'بنغلاديش',        nameEn:'Bangladesh',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'DE': { flag:'🇩🇪', name:'ألمانيا',         nameEn:'Germany',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'GB': { flag:'🇬🇧', name:'المملكة المتحدة', nameEn:'United Kingdom',
    tools:['tip-calculator','currency-converter','loan-calculator','discount-calculator'] },
  'TR': { flag:'🇹🇷', name:'تركيا',           nameEn:'Turkey',
    tools:['currency-converter','loan-calculator','percentage-calculator','hijri-converter'] },
  'FR': { flag:'🇫🇷', name:'فرنسا',           nameEn:'France',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'MX': { flag:'🇲🇽', name:'المكسيك',         nameEn:'Mexico',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'PH': { flag:'🇵🇭', name:'الفلبين',         nameEn:'Philippines',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'ET': { flag:'🇪🇹', name:'إثيوبيا',         nameEn:'Ethiopia',
    tools:['currency-converter','loan-calculator','percentage-calculator','age-calculator'] },
  'KR': { flag:'🇰🇷', name:'كوريا الجنوبية', nameEn:'South Korea',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'IT': { flag:'🇮🇹', name:'إيطاليا',         nameEn:'Italy',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
  'ES': { flag:'🇪🇸', name:'إسبانيا',         nameEn:'Spain',
    tools:['currency-converter','loan-calculator','discount-calculator','percentage-calculator'] },
};

// Map browser language to country code
const LANG_COUNTRY = {
  // Arabic dialects → Arab countries
  'ar-om':'OM','ar-sa':'SA','ar-ae':'AE','ar-kw':'KW','ar-qa':'QA','ar-bh':'BH',
  'ar-jo':'JO','ar-ps':'PS','ar-sy':'SY','ar-eg':'EG','ar-iq':'IQ','ar-ye':'YE',
  'ar-ma':'MA','ar-dz':'DZ','ar-tn':'TN','ar-lb':'LB','ar-ly':'LY','ar-sd':'SD',
  'ar-so':'SO','ar-mr':'MR','ar-dj':'DJ','ar-km':'KM','ar':'SA',
  // Major world languages
  'zh':'CN','zh-cn':'CN','zh-hans':'CN','zh-hant':'CN','zh-tw':'CN',
  'hi':'IN','hi-in':'IN','en-in':'IN',
  'en-us':'US','en-ca':'US',
  'id':'ID','id-id':'ID',
  'pt-br':'BR','pt':'BR',
  'ru':'RU','ru-ru':'RU',
  'ja':'JP','ja-jp':'JP',
  'ha':'NG','en-ng':'NG',
  'ur':'PK','ur-pk':'PK',
  'bn':'BD','bn-bd':'BD',
  'de':'DE','de-de':'DE','de-at':'DE','de-ch':'DE',
  'en-gb':'GB','en-au':'GB','en-nz':'GB',
  'tr':'TR','tr-tr':'TR',
  'fr':'FR','fr-fr':'FR','fr-be':'FR','fr-ch':'FR','fr-ca':'FR',
  'es-mx':'MX','es':'ES','es-es':'ES','es-ar':'MX','es-co':'MX',
  'fil':'PH','tl':'PH','en-ph':'PH',
  'am':'ET',
  'ko':'KR','ko-kr':'KR',
  'it':'IT','it-it':'IT',
};

function detectCountryFromLang() {
  const lang = (navigator.language || navigator.languages && navigator.languages[0] || '').toLowerCase();
  return LANG_COUNTRY[lang] || null;
}

function renderCountrySection(countryCode) {
  const cd = COUNTRY_DATA[countryCode];
  if (!cd || !document.getElementById('toolsGrid')) return;
  const existing = document.getElementById('countrySection');
  if (existing) existing.remove();

  const lang = document.documentElement.lang || localStorage.getItem('lang') || 'en';
  const t = T[lang] || T.en;
  const base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';

  const section = document.createElement('div');
  section.id = 'countrySection';
  section.style.cssText = 'margin-bottom:28px;';

  const heading = document.createElement('div');
  heading.style.cssText = 'font-size:13px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;';
  const countryName = lang === 'ar' ? cd.name : cd.nameEn;
  heading.textContent = '📍 ' + (t.country_recommended || 'Recommended for') + ' ' + countryName;

  const grid = document.createElement('div');
  grid.className = 'tools-grid';
  grid.id = 'countryGrid';

  cd.tools.forEach(function(id) {
    const card = buildMiniCard(id, t, base);
    if (card) grid.appendChild(card);
  });

  section.append(heading, grid);

  // Insert before favSection (or before toolsGrid if no favSection)
  const favSection = document.getElementById('favSection');
  const toolsGrid = document.getElementById('toolsGrid');
  const parent = toolsGrid.parentNode;
  const ref = favSection || toolsGrid;
  parent.insertBefore(section, ref);
  injectStarBtns();

  // Hide Oman tab + Oman tool cards for non-Oman users
  const omanTab = document.querySelector('.cat-tab[data-cat="oman"]');
  if (omanTab) omanTab.style.display = countryCode === 'OM' ? '' : 'none';
  window._hideOmanTools = (countryCode !== 'OM');
  if (typeof filterTools === 'function') filterTools();
}

async function initCountryDetect() {
  if (!document.getElementById('toolsGrid')) return;
  // URL override for testing — ?country=jo (not saved to sessionStorage)
  const _urlCode = (new URLSearchParams(location.search).get('country') || '').toUpperCase();
  if (_urlCode && COUNTRY_DATA[_urlCode]) { renderCountrySection(_urlCode); return; }
  // Country-specific pages override country from URL path (/om/ → OM, /ae/ → AE …)
  var _urlCountryMap = {om:'OM',ae:'AE',sa:'SA',us:'US',uk:'GB',jo:'JO',in:'IN',pk:'PK',bd:'BD',eg:'EG',ph:'PH'};
  var _pathParts = location.pathname.split('/').filter(function(s){return s.length>0;});
  for (var _pi = 0; _pi < _pathParts.length; _pi++) {
    var _mapped = _urlCountryMap[_pathParts[_pi]];
    if (_mapped && COUNTRY_DATA[_mapped]) {
      sessionStorage.setItem('adawati_country', _mapped);
      renderCountrySection(_mapped);
      return;
    }
  }
  // Use sessionStorage so country detection is fresh each browser session
  let code = sessionStorage.getItem('adawati_country');
  if (!code) {
    code = detectCountryFromLang();
    if (!code) {
      // Try free IP API as fallback (no key needed)
      try {
        const r = await fetch('https://api.country.is/');
        const d = await r.json();
        code = d.country || null;
      } catch(e) {}
    }
    if (code) sessionStorage.setItem('adawati_country', code);
  }
  if (code && COUNTRY_DATA[code]) renderCountrySection(code);
}

/* ── Track recent on tool pages ── */
function autoTrackRecent() {
  const page = _getPageSlug();
  if (TOOL_META[page] && page !== 'index') trackRecent(page);
}

/* ── Country-aware "home" link: respects the country hub the user is actually in ── */
function getHomeHref() {
  var base = location.pathname.includes('/my-tools-site') ? '/my-tools-site' : '';
  try {
    var country = sessionStorage.getItem('adawati_country');
    var countryHubMap = {OM:'om/', SA:'sa/', JO:'jo/', AE:'ae/', US:'us/', GB:'uk/'};
    if (country && countryHubMap[country]) return base + '/' + countryHubMap[country];
  } catch(e) {}
  return base + '/index.html';
}

/* ── Fix the static "← Back to Home" link on tool pages to respect country context ── */
function fixBackLink() {
  var link = document.querySelector('.page-header a[data-i18n="back"]');
  if (link) link.setAttribute('href', getHomeHref());
}

/* ── Universal "Return to Home" floating prompt ── */
var _homePromptShown = false;
var _homePromptTimer = null;

function showHomePrompt() {
  if (_homePromptShown) return;
  // Don't show on the homepage itself
  var page = _getPageSlug();
  if (!TOOL_META[page]) return;
  _homePromptShown = true;
  if (_homePromptTimer) { clearTimeout(_homePromptTimer); _homePromptTimer = null; }

  var lang = localStorage.getItem('lang') || 'en';
  var msgs = {
    ar: '🏠 العودة للصفحة الرئيسية',
    en: '🏠 Back to Home',
    fr: '🏠 Retour à l\'accueil',
    es: '🏠 Volver al inicio',
    de: '🏠 Zur Startseite',
    ru: '🏠 На главную'
  };
  var msg = msgs[lang] || msgs.en;
  var homeHref = getHomeHref();

  // Inject CSS once
  if (!document.getElementById('hp-style')) {
    var s = document.createElement('style');
    s.id = 'hp-style';
    s.textContent = [
      '.hp-prompt{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);',
      'background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;border-radius:99px;',
      'padding:12px 20px 12px 16px;display:flex;align-items:center;gap:10px;',
      'box-shadow:0 4px 24px rgba(37,99,235,0.35);z-index:9999;font-weight:700;',
      'font-size:14px;white-space:nowrap;font-family:inherit;',
      'animation:hp-up 0.35s cubic-bezier(.4,0,.2,1);}',
      '@keyframes hp-up{from{transform:translateX(-50%) translateY(80px);opacity:0}',
      'to{transform:translateX(-50%) translateY(0);opacity:1}}',
      '.hp-prompt a{color:#fff;text-decoration:none;flex:1;}',
      '.hp-dismiss{background:rgba(255,255,255,0.2);border:none;color:#fff;',
      'border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:13px;',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;',
      'font-family:inherit;line-height:1;}'
    ].join('');
    document.head.appendChild(s);
  }

  var prompt = document.createElement('div');
  prompt.className = 'hp-prompt';
  prompt.innerHTML = '<a href="' + homeHref + '">' + msg + '</a>' +
    '<button class="hp-dismiss" onclick="this.parentNode.remove()" title="Dismiss">✕</button>';
  document.body.appendChild(prompt);

  // Auto-dismiss after 10 seconds
  setTimeout(function() { if (prompt.parentNode) prompt.remove(); }, 10000);
}

function initHomePrompt() {
  var page = _getPageSlug();
  if (!TOOL_META[page]) return;
  // Show after 15 seconds of being on a tool page
  _homePromptTimer = setTimeout(showHomePrompt, 15000);
}

/* ── Favorite-star button on individual tool pages ──
   injectStarBtns() only adds stars to cards on a hub page's #toolsGrid —
   there was previously no way to favorite a tool while actually looking at
   it, which meant most visitors would never populate their favorites list
   at all (user-reported: opening a tool page showed no way to add it, and
   the bottom-nav Favorites link therefore always led to an empty, hidden
   section). Reuses the exact same isFav()/toggleFav() and .fav-star class
   the hub-grid stars use, so both stay in sync automatically. */
function injectPageFavStar() {
  var page = _getPageSlug();
  if (!page || page === 'index') return;
  var header = document.querySelector('.page-header');
  if (!header || header.querySelector('.fav-star')) return;
  // Proactively cache this page's title/url so it renders correctly in the
  // favorites section later even if TOOL_META doesn't know about it (see
  // captureFavMeta / buildMiniCard) — capture on every visit, not just when
  // the star is actually clicked, so cross-page favoriting from the hub
  // grid still resolves once the user has viewed the page at least once.
  if (!TOOL_META[page]) captureFavMeta(page);
  var lang = localStorage.getItem('lang') || 'en';
  var t = T[lang] || T.en;
  var star = document.createElement('button');
  star.className = 'fav-star' + (isFav(page) ? ' fav-active' : '');
  star.setAttribute('data-id', page);
  star.title = isFav(page) ? (t.remove_fav || 'Remove from Favorites') : (t.add_fav || 'Add to Favorites');
  star.innerHTML = '<span class="fav-star-icon">' + (isFav(page) ? '⭐' : '☆') + '</span>';
  star.onclick = function() {
    if (!TOOL_META[page]) captureFavMeta(page);
    toggleFav(page);
    var lang2 = localStorage.getItem('lang') || 'en';
    var t2 = T[lang2] || T.en;
    star.title = isFav(page) ? (t2.remove_fav || 'Remove from Favorites') : (t2.add_fav || 'Add to Favorites');
  };
  header.appendChild(star);
}

/* ── Bottom Navigation (mobile app shell) ── */
function initBottomNav() {
  var home = getHomeHref();
  var nav = document.getElementById('bottomNav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'bottomNav';
    nav.className = 'bottom-nav';
    // Label spans use data-i18n so applyTranslations() (called on every
    // setLang(), not just on first load) keeps them in sync — a prior version
    // baked the text in once here, so switching language after page load left
    // this nav showing the auto-detected default language forever.
    nav.innerHTML =
      '<div class="bottom-nav-inner">' +
        '<a class="bottom-nav-item" href="' + home + '"><span class="bn-icon">🏠</span><span data-i18n="nav_home">Home</span></a>' +
        '<a class="bottom-nav-item" href="' + home + '#toolsGrid"><span class="bn-icon">🧰</span><span data-i18n="section_tools">Tools</span></a>' +
        '<a class="bottom-nav-item" href="' + home + '#favSection"><span class="bn-icon">⭐</span><span data-i18n="bottom_nav_favorites">Favorites</span></a>' +
      '</div>';
    document.body.appendChild(nav);
    document.body.classList.add('has-bottom-nav');
  } else {
    // Home href is country-dependent and can only be known after country
    // detection runs, which happens after this first fires — refresh it.
    var links = nav.querySelectorAll('a.bottom-nav-item');
    if (links[0]) links[0].setAttribute('href', home);
    if (links[1]) links[1].setAttribute('href', home + '#toolsGrid');
    if (links[2]) links[2].setAttribute('href', home + '#favSection');
  }
}

/* ── Offline banner ── */
function initOfflineBanner() {
  var lang = localStorage.getItem('lang') || 'en';
  var msg = lang === 'ar'
    ? '📡 أنت غير متصل بالإنترنت — بعض المزايا الحية قد لا تعمل، لكن الحاسبات الأساسية تعمل بدون نت.'
    : '📡 You\'re offline — live features may be unavailable, but core calculators still work without internet.';
  var banner = document.getElementById('offlineBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'offlineBanner';
    banner.className = 'offline-banner';
    document.body.insertBefore(banner, document.body.firstChild);
  }
  banner.textContent = msg;
  banner.style.display = navigator.onLine ? 'none' : 'block';
}

function _initAfterLangReady() {
  initDarkMode();
  setLang(_initLang);
  updateAuthBtn();
  injectDarkToggle();
  injectAuthBtn();
  initMobileNavToggle();
  restoreSessionIfAny();
  checkGoogleRedirectResult();
  injectShareBtn();
  injectRelatedTools();
  initPWA();
  autoTrackRecent();
  initHomePrompt();
  injectPageFavStar();
  fixBackLink();
  initBottomNav();
  initOfflineBanner();
  if (document.getElementById('toolsGrid')) {
    renderFavSection();
    renderRecentSection();
    injectStarBtns();
    initCountryDetect();
  }
}

var _initLang;
document.addEventListener('DOMContentLoaded', function() {
  _initLang = detectDefaultLang();
  if (T[_initLang]) {
    _initAfterLangReady();
  } else {
    loadLangPack(_initLang).then(_initAfterLangReady).catch(function() {
      if (_initLang !== 'en') {
        _initLang = 'en';
        loadLangPack('en').then(_initAfterLangReady);
      }
    });
  }
});

window.addEventListener('online', initOfflineBanner);
window.addEventListener('offline', initOfflineBanner);
