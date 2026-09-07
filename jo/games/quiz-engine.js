firebase.initializeApp({
  apiKey: "AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ",
  authDomain: "adawati-challenges.firebaseapp.com",
  projectId: "adawati-challenges",
  storageBucket: "adawati-challenges.firebasestorage.app",
  messagingSenderId: "360902823980",
  appId: "1:360902823980:web:bd85f87de77dcfc315c189"
});
const db = firebase.firestore();

// Quiz-page UI language: independent of i18n.js (which would force Arabic on
// any /jo/ path via its path-based cmap check) so a visitor arriving from an
// English country hub (ae/us/uk) sees English chrome. Question/answer content
// stays Arabic-only regardless — no translated question banks exist yet.
const quizLang = (function() {
  try { return localStorage.getItem('lang') === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; }
})();

const QT = {
  ar: {
    enter_name: 'اكتب اسمك الأول 🙂',
    creating: 'جاري الإنشاء...',
    create_error: 'صار خطأ بإنشاء التحدي، جرب مرة ثانية.',
    start_challenge_btn: 'ابدأ تحدي',
    of_word: ' من ',
    players_joined_suffix: ' لاعب انضموا',
    your_friend: 'صاحبك',
    and_others: function(n) { return ' و' + n + ' غيرهم'; },
    joining: 'جاري الانضمام...',
    challenge_full: function(max) { return 'للأسف التحدي مكتمل، وصل للحد الأقصى (' + max + ' لاعب).'; },
    accept_btn: 'قبول التحدي ✅',
    generic_error: 'صار خطأ، تأكد من اتصالك وجرب تاني.',
    not_found: 'هذا التحدي غير موجود أو انتهى، جرب رابط جديد.',
    challenge_full_join: function(max) { return 'التحدي مكتمل! وصل للحد الأقصى (' + max + ' لاعب). اطلب من صاحبك يعمل تحدي جديد.'; },
    already_playing: function(name) { return '🏆 ' + name + ' وأصحابه بلشوا يلعبوا! اكتب اسمك وانضم دغري.'; },
    challenge_intro: function(name, count, max) { return '🏆 ' + name + ' تحداك! جاهز تنافسه؟ (' + count + '/' + max + ' انضموا)'; },
    load_error: 'صار خطأ بتحميل التحدي، تأكد من اتصالك وجرب تاني.',
    copied: '✅ تم النسخ',
    result_copied: 'تم نسخ نتيجتك! الصقها بأي مكان بدك تشاركها فيه.',
    loading: 'جاري التحميل...',
    no_one_yet: 'لسا محدا لعب',
    leaderboard_error: 'تعذر تحميل لوحة الترتيب حالياً',
    leaderboard_share_header: '\n\n🏆 ترتيب التحدي:\n',
    question_progress: function(cur, total) { return 'سؤال ' + cur + ' من ' + total; },
    time_left: function(s) { return '⏱️ ' + s + ' ثانية'; },
    time_up: '⏱️ خلص الوقت!',
    score_label: function(score, total, pct) { return score + ' من ' + total + ' (' + pct + '%)'; },
    arabic_note: '(الأسئلة بالعربي)',
    challenge_start_title: '🏆 تحدَّ أصحابك بنفس الأسئلة!',
    challenge_start_subtitle: 'لازم صديق واحد ع الأقل يشارك (من 2 لـ20 شخص) — اكتب اسمك، ابدأ التحدي، وشارك الرابط.',
    challenge_start_subtitle_songs: 'لازم صديق واحد ع الأقل يشارك (من 2 لـ20 شخص) — اختار نوع الأغاني، اكتب اسمك، ابدأ التحدي، وشارك الرابط.',
    name_placeholder: 'اسمك',
    joiner_waiting: '⏳ قبلت التحدي! بانتظار ما يبلش صاحبك اللعب... بتبلشوا مع بعض.',
    challenge_ready: '⏳ التحدي جاهز! ابعت الرابط لصاحبك — بمجرد ما يقبل التحدي، رح تقدر تبلش تلعب انت كمان.',
    share_btn: '📤 مشاركة',
    copy_link_btn: 'نسخ الرابط',
    start_playing_btn: 'ابدأ اللعب 🚀',
    active_link_label: '🔗 رابط التحدي — شاركه مع صاحبك قبل أو أثناء اللعب:',
    share_result_btn: '📤 شارك نتيجتك',
    try_again_btn: '🔄 جرّب مرة ثانية',
    share_challenge_title: '📤 شارك التحدي مع أصحابك',
    leaderboard_title: '🏆 لوحة الترتيب',
    leaderboard_name: 'الاسم',
    leaderboard_score: 'النتيجة',
    other_games: 'أدوات الأردن الأخرى:'
  },
  en: {
    enter_name: 'Enter your name first 🙂',
    creating: 'Creating...',
    create_error: 'Something went wrong creating the challenge — try again.',
    start_challenge_btn: 'Start Challenge',
    of_word: ' of ',
    players_joined_suffix: ' players joined',
    your_friend: 'your friend',
    and_others: function(n) { return ' and ' + n + ' others'; },
    joining: 'Joining...',
    challenge_full: function(max) { return 'Sorry, this challenge is full (' + max + ' players max).'; },
    accept_btn: 'Accept Challenge ✅',
    generic_error: 'Something went wrong — check your connection and try again.',
    not_found: "This challenge doesn't exist or has expired — try a new link.",
    challenge_full_join: function(max) { return 'This challenge is full! It reached the max of ' + max + ' players. Ask your friend to create a new one.'; },
    already_playing: function(name) { return '🏆 ' + name + ' and friends already started playing! Enter your name and jump right in.'; },
    challenge_intro: function(name, count, max) { return '🏆 ' + name + ' challenged you! Ready to compete? (' + count + '/' + max + ' joined)'; },
    load_error: 'Something went wrong loading the challenge — check your connection and try again.',
    copied: '✅ Copied',
    result_copied: 'Your result was copied! Paste it anywhere you want to share it.',
    loading: 'Loading...',
    no_one_yet: 'No one has played yet',
    leaderboard_error: "Couldn't load the leaderboard right now",
    leaderboard_share_header: '\n\n🏆 Challenge Leaderboard:\n',
    question_progress: function(cur, total) { return 'Question ' + cur + ' of ' + total; },
    time_left: function(s) { return '⏱️ ' + s + 's'; },
    time_up: "⏱️ Time's up!",
    score_label: function(score, total, pct) { return score + ' of ' + total + ' (' + pct + '%)'; },
    arabic_note: '(questions are in Arabic)',
    challenge_start_title: '🏆 Challenge your friends with the same questions!',
    challenge_start_subtitle: 'You need at least one friend to join (2 to 20 people) — enter your name, start the challenge, and share the link.',
    challenge_start_subtitle_songs: 'You need at least one friend to join (2 to 20 people) — pick the song category, enter your name, start the challenge, and share the link.',
    name_placeholder: 'Your name',
    joiner_waiting: "⏳ You're in! Waiting for your friend to start playing... you'll begin together.",
    challenge_ready: "⏳ Challenge ready! Send the link to your friend — once they accept, you'll be able to start playing too.",
    share_btn: '📤 Share',
    copy_link_btn: 'Copy Link',
    start_playing_btn: 'Start Playing 🚀',
    active_link_label: '🔗 Challenge link — share it with your friend before or during the game:',
    share_result_btn: '📤 Share Your Result',
    try_again_btn: '🔄 Try Again',
    share_challenge_title: '📤 Share the Challenge with Your Friends',
    leaderboard_title: '🏆 Leaderboard',
    leaderboard_name: 'Name',
    leaderboard_score: 'Score',
    other_games: 'More trivia games:'
  }
};
function qt(key) { return QT[quizLang][key]; }

function qGetHomeHref() {
  try {
    var country = sessionStorage.getItem('adawati_country');
    var countryHubMap = { OM: 'om/', SA: 'sa/', JO: 'jo/', AE: 'ae/', US: 'us/', GB: 'uk/' };
    if (country && countryHubMap[country]) return countryHubMap[country];
  } catch (e) {}
  return 'index.html';
}

function applyQuizTranslations() {
  document.querySelectorAll('[data-qt]').forEach(function(el) {
    var key = el.getAttribute('data-qt');
    var val = QT[quizLang][key];
    if (typeof val === 'string') el.textContent = val;
  });
  if (quizLang === 'en') {
    document.querySelectorAll('[data-en]').forEach(function(el) {
      el.textContent = el.getAttribute('data-en');
    });
  }
  document.querySelectorAll('[data-qt-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-qt-placeholder');
    var val = QT[quizLang][key];
    if (typeof val === 'string') el.setAttribute('placeholder', val);
  });
  var backLink = document.querySelector('.page-header a');
  if (backLink) {
    backLink.setAttribute('href', qGetHomeHref());
    backLink.textContent = quizLang === 'en' ? '← Back to Home' : '← العودة للرئيسية';
  }
  var arNote = document.getElementById('quizArabicNote');
  if (arNote) arNote.textContent = quizLang === 'en' ? qt('arabic_note') : '';
}

let currentQ = 0;
let score = 0;
let answered = false;
const QUESTIONS_PER_GAME = 12;
let activeQuestions = [];

let challengeId = null;
let challengeMode = false;
let challengeSubmitted = false;
let playerName = '';
let quizStartTime = 0;
let selectedCategory = 'mix';
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 20;

function initCategorySelector() {
  const area = document.getElementById('categorySelectArea');
  if (!area || !QUIZ_CONFIG.categories) return;
  area.style.display = 'flex';
  area.innerHTML = QUIZ_CONFIG.categories.map(function(c) {
    var label = (quizLang === 'en' && c.labelEn) ? c.labelEn : c.label;
    return '<button type="button" class="cat-select-btn" data-cat="' + c.key + '" style="padding:8px 14px;border-radius:8px;border:2px solid var(--border);background:' + (c.key === selectedCategory ? 'var(--primary)' : 'var(--surface)') + ';color:' + (c.key === selectedCategory ? '#fff' : 'var(--text)') + ';font-size:13px;font-weight:700;cursor:pointer;">' + escapeHtml(label) + '</button>';
  }).join('');
  area.querySelectorAll('.cat-select-btn').forEach(function(btn) {
    btn.onclick = function() {
      selectedCategory = btn.getAttribute('data-cat');
      area.querySelectorAll('.cat-select-btn').forEach(function(b) {
        const active = b.getAttribute('data-cat') === selectedCategory;
        b.style.background = active ? 'var(--primary)' : 'var(--surface)';
        b.style.color = active ? '#fff' : 'var(--text)';
      });
    };
  });
}

function getChallengeIdFromUrl() {
  return new URLSearchParams(location.search).get('challenge');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

async function createChallenge() {
  const name = document.getElementById('creatorNameInput').value.trim();
  if (!name) { alert(qt('enter_name')); return; }
  const btn = document.querySelector('#challengeStartArea button');
  document.getElementById('creatorNameInput').disabled = true;
  btn.disabled = true; btn.textContent = qt('creating');
  try {
    pickQuestions();
    const ref = await db.collection('challenges').add({
      creatorName: name,
      questions: activeQuestions,
      game: QUIZ_CONFIG.gameId,
      acceptedCount: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    challengeId = ref.id;
    challengeMode = true;
    challengeSubmitted = false;
    playerName = name;
    document.getElementById('challengeStartArea').style.display = 'none';
    document.getElementById('quizArea').style.display = 'none';
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('challengeWaitingLinkInput').value = location.origin + location.pathname + '?challenge=' + challengeId;
    document.getElementById('challengeWaitingArea').style.display = 'block';
    listenForAcceptance();
  } catch (e) {
    alert(qt('create_error'));
    document.getElementById('creatorNameInput').disabled = false;
    btn.disabled = false; btn.textContent = qt('start_challenge_btn');
  }
}

let acceptsUnsub = null;

function listenForAcceptance() {
  if (acceptsUnsub) acceptsUnsub();
  acceptsUnsub = db.collection('challenges').doc(challengeId).collection('accepts')
    .onSnapshot(function(snap) {
      if (!snap.empty) {
        const names = snap.docs.map(function(d) { return d.data().name || qt('your_friend'); });
        const totalPlayers = names.length + 1; // +1 for the creator
        const shown = names.slice(0, 3).map(escapeHtml).join(quizLang === 'en' ? ', ' : '، ');
        const extra = names.length > 3 ? qt('and_others')(names.length - 3) : '';
        document.getElementById('accepterNameSpan').textContent = shown + extra;
        const countLabel = document.getElementById('acceptCountLabel');
        if (countLabel) countLabel.textContent = totalPlayers + qt('of_word') + MAX_PLAYERS + qt('players_joined_suffix');
        document.getElementById('challengeAcceptedBox').style.display = 'block';
        const startBtn = document.getElementById('creatorStartBtn');
        if (startBtn) startBtn.disabled = totalPlayers < MIN_PLAYERS;
      }
    }, function() { /* listener error: link still works manually, no UI change needed */ });
}

async function creatorStartPlaying() {
  if (acceptsUnsub) { acceptsUnsub(); acceptsUnsub = null; }
  document.getElementById('challengeWaitingArea').style.display = 'none';
  currentQ = 0; score = 0; quizStartTime = Date.now();
  document.getElementById('quizArea').style.display = 'block';
  showActiveChallengeLink();
  loadQuestion();
  try {
    await db.collection('challenges').doc(challengeId).collection('starts').add({
      startedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) { /* non-critical: friend's own click can't force-start, but their tab may need a manual refresh */ }
}

let startUnsub = null;

function listenForStart() {
  if (startUnsub) startUnsub();
  startUnsub = db.collection('challenges').doc(challengeId).collection('starts')
    .onSnapshot(function(snap) {
      if (!snap.empty) {
        if (startUnsub) { startUnsub(); startUnsub = null; }
        document.getElementById('joinerWaitingArea').style.display = 'none';
        currentQ = 0; score = 0; quizStartTime = Date.now();
        document.getElementById('quizArea').style.display = 'block';
        showActiveChallengeLink();
        loadQuestion();
      }
    }, function() { /* listener error: nothing to do, joiner stays in waiting state */ });
}

function challengeStorageKey(id) {
  return 'adawati_quiz_played_' + id;
}

function getPlayedRecord(id) {
  try { return JSON.parse(localStorage.getItem(challengeStorageKey(id))); } catch (e) { return null; }
}

function savePlayedRecord(id, data) {
  try { localStorage.setItem(challengeStorageKey(id), JSON.stringify(data)); } catch (e) {}
}

async function showChallengeJoinIntro(id) {
  challengeId = id;
  try {
    const doc = await db.collection('challenges').doc(id).get();
    if (!doc.exists) {
      document.getElementById('challengeJoinMsg').textContent = qt('not_found');
      document.getElementById('challengeJoinForm').style.display = 'none';
      return;
    }
    const data = doc.data();
    activeQuestions = data.questions;

    const played = getPlayedRecord(id);
    if (played) {
      playerName = played.name;
      score = played.score;
      challengeMode = true;
      challengeSubmitted = true;
      document.getElementById('challengeJoinArea').style.display = 'none';
      document.getElementById('quizArea').style.display = 'none';
      showResult();
      return;
    }

    const acceptsSnap = await db.collection('challenges').doc(id).collection('accepts').get();
    const joinedCount = acceptsSnap.size + 1; // +1 for the creator
    if (joinedCount >= MAX_PLAYERS) {
      document.getElementById('challengeJoinMsg').textContent = qt('challenge_full_join')(MAX_PLAYERS);
      document.getElementById('challengeJoinForm').style.display = 'none';
      return;
    }

    let alreadyStarted = false;
    try {
      const startsSnap = await db.collection('challenges').doc(id).collection('starts').get();
      alreadyStarted = !startsSnap.empty;
    } catch (e) { /* if this check fails, show the normal pre-start message below */ }

    document.getElementById('challengeJoinMsg').textContent = alreadyStarted
      ? qt('already_playing')(escapeHtml(data.creatorName))
      : qt('challenge_intro')(escapeHtml(data.creatorName), joinedCount, MAX_PLAYERS);
  } catch (e) {
    document.getElementById('challengeJoinMsg').textContent = qt('load_error');
    document.getElementById('challengeJoinForm').style.display = 'none';
  }
}

async function joinChallenge() {
  const name = document.getElementById('joinerNameInput').value.trim();
  if (!name) { alert(qt('enter_name')); return; }
  const btn = document.querySelector('#challengeJoinForm button');
  if (btn.disabled) return;
  document.getElementById('joinerNameInput').disabled = true;
  btn.disabled = true; btn.textContent = qt('joining');

  try {
    try {
      await db.runTransaction(async function(t) {
        const challengeRef = db.collection('challenges').doc(challengeId);
        const snap = await t.get(challengeRef);
        const current = (snap.exists && snap.data().acceptedCount) || 0;
        if (current + 1 >= MAX_PLAYERS) throw new Error('CHALLENGE_FULL');
        t.update(challengeRef, { acceptedCount: current + 1 });
        const newAcceptRef = challengeRef.collection('accepts').doc();
        t.set(newAcceptRef, { name: name, acceptedAt: firebase.firestore.FieldValue.serverTimestamp() });
      });
    } catch (e) {
      if (e.message === 'CHALLENGE_FULL') {
        alert(qt('challenge_full')(MAX_PLAYERS));
        document.getElementById('joinerNameInput').disabled = false;
        btn.disabled = false; btn.textContent = qt('accept_btn');
        return;
      }
      /* transaction failed for another reason (e.g. old challenge doc predating acceptedCount): non-critical, still let them play */
    }

    playerName = name;
    challengeMode = true;
    challengeSubmitted = false;
    document.getElementById('challengeJoinArea').style.display = 'none';

    let alreadyStarted = false;
    try {
      const startsSnap = await db.collection('challenges').doc(challengeId).collection('starts').get();
      alreadyStarted = !startsSnap.empty;
    } catch (e) { /* if this check fails, fall back to the normal wait-for-start flow below */ }

    if (alreadyStarted) {
      currentQ = 0; score = 0; quizStartTime = Date.now();
      document.getElementById('quizArea').style.display = 'block';
      showActiveChallengeLink();
      loadQuestion();
      return;
    }

    document.getElementById('joinerWaitingArea').style.display = 'block';
    listenForStart();
  } catch (e) {
    alert(qt('generic_error'));
    document.getElementById('joinerNameInput').disabled = false;
    btn.disabled = false; btn.textContent = qt('accept_btn');
  }
}

async function submitChallengeScore() {
  try {
    const timeMs = Date.now() - quizStartTime;
    await db.collection('challenges').doc(challengeId).collection('players').add({
      name: playerName,
      score: score,
      total: activeQuestions.length,
      timeMs: timeMs,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    savePlayedRecord(challengeId, { name: playerName, score: score, total: activeQuestions.length });
  } catch (e) { /* still render leaderboard best-effort below */ }
  renderLeaderboard();
}

let leaderboardUnsub = null;
let latestLeaderboard = [];

function renderLeaderboard() {
  document.getElementById('leaderboardArea').style.display = 'block';
  document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="3" style="padding:8px;text-align:center;color:var(--text-muted);">' + qt('loading') + '</td></tr>';
  if (leaderboardUnsub) { leaderboardUnsub(); leaderboardUnsub = null; }
  leaderboardUnsub = db.collection('challenges').doc(challengeId).collection('players')
    .orderBy('score', 'desc').orderBy('timeMs', 'asc')
    .onSnapshot(function(snap) {
      const rows = [];
      const board = [];
      let rank = 1;
      snap.forEach(function(doc) {
        const d = doc.data();
        const mine = d.name === playerName;
        rows.push('<tr' + (mine ? ' style="font-weight:800;color:var(--primary);"' : '') + '><td style="padding:6px;">' + rank + '</td><td style="padding:6px;">' + escapeHtml(d.name) + '</td><td style="padding:6px;">' + d.score + '/' + d.total + '</td></tr>');
        board.push({ name: d.name, score: d.score, total: d.total });
        rank++;
      });
      document.getElementById('leaderboardBody').innerHTML = rows.join('') || '<tr><td colspan="3" style="padding:8px;text-align:center;">' + qt('no_one_yet') + '</td></tr>';
      latestLeaderboard = board;
    }, function() {
      document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="3" style="padding:8px;text-align:center;">' + qt('leaderboard_error') + '</td></tr>';
    });
  document.getElementById('challengeShareArea').style.display = 'block';
  document.getElementById('challengeShareLink').value = location.origin + location.pathname + '?challenge=' + challengeId;
}

function copyChallengeLink() {
  copyLinkGeneric('challengeShareLink', 'copyLinkBtn');
}

function buildLeaderboardShareText() {
  if (!latestLeaderboard.length) return '';
  const medals = ['🥇', '🥈', '🥉'];
  const lines = latestLeaderboard.slice(0, 5).map(function(p, i) {
    return (medals[i] || (i + 1) + '.') + ' ' + p.name + ': ' + p.score + '/' + p.total;
  });
  return qt('leaderboard_share_header') + lines.join('\n');
}

function qShareTitle() {
  return (quizLang === 'en' && QUIZ_CONFIG.shareTitleEn) ? QUIZ_CONFIG.shareTitleEn : QUIZ_CONFIG.shareTitle;
}
function qChallengeText() {
  return (quizLang === 'en' && QUIZ_CONFIG.challengeTextEn) ? QUIZ_CONFIG.challengeTextEn : QUIZ_CONFIG.challengeText;
}
function qResultText(score, total, pct) {
  const fn = (quizLang === 'en' && QUIZ_CONFIG.resultTextEn) ? QUIZ_CONFIG.resultTextEn : QUIZ_CONFIG.resultText;
  return fn(score, total, pct);
}
function qResultMessages() {
  return (quizLang === 'en' && QUIZ_CONFIG.resultMessagesEn) ? QUIZ_CONFIG.resultMessagesEn : QUIZ_CONFIG.resultMessages;
}

function shareResult() {
  const pct = Math.round((score / activeQuestions.length) * 100);
  let text = qResultText(score, activeQuestions.length, pct);
  if (challengeMode && challengeId) text += buildLeaderboardShareText();
  const url = (challengeMode && challengeId)
    ? (location.origin + location.pathname + '?challenge=' + challengeId)
    : (location.origin + location.pathname);
  if (navigator.share) {
    navigator.share({ title: qShareTitle(), text: text, url: url }).catch(function() {});
    return;
  }
  const full = text + ' ' + url;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(full).then(function() { alert(qt('result_copied')); }).catch(function() { alert(full); });
  } else {
    alert(full);
  }
}

function shareOrCopy(inputId, btnId) {
  const url = document.getElementById(inputId).value;
  if (navigator.share) {
    navigator.share({ title: qShareTitle(), text: qChallengeText(), url: url }).catch(function() {});
  } else {
    copyLinkGeneric(inputId, btnId);
  }
}

function copyLinkGeneric(inputId, btnId) {
  const input = document.getElementById(inputId);
  input.select();
  input.setSelectionRange(0, 99999);
  const btn = document.getElementById(btnId);
  const done = function() {
    const old = btn.textContent;
    btn.textContent = qt('copied');
    setTimeout(function(){ btn.textContent = old; }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value).then(done).catch(function(){ try { document.execCommand('copy'); } catch(e){} done(); });
  } else {
    try { document.execCommand('copy'); } catch(e) {}
    done();
  }
}

function showActiveChallengeLink() {
  document.getElementById('challengeActiveLinkInput').value = location.origin + location.pathname + '?challenge=' + challengeId;
  document.getElementById('challengeActiveLink').style.display = 'block';
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  const pool = (QUIZ_CONFIG.categories && selectedCategory !== 'mix')
    ? QUESTIONS.filter(function(q) { return q.cat === selectedCategory; })
    : QUESTIONS;
  const selected = shuffle(pool).slice(0, QUESTIONS_PER_GAME);
  activeQuestions = selected.map(function(q) {
    const order = shuffle(q.opts.map(function(_, i) { return i; }));
    return {
      q: q.q,
      img: q.img,
      opts: order.map(function(i) { return q.opts[i]; }),
      correct: order.indexOf(q.correct)
    };
  });
}

const QUESTION_SECONDS = 10;
let timerInterval = null;

function clearQuestionTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function getTimerEl() {
  let el = document.getElementById('questionTimer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'questionTimer';
    el.style.cssText = 'font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-align:center;';
    const progressLabel = document.getElementById('progressLabel');
    progressLabel.parentNode.insertBefore(el, progressLabel.nextSibling);
  }
  return el;
}

function startQuestionTimer() {
  clearQuestionTimer();
  let remaining = QUESTION_SECONDS;
  const el = getTimerEl();
  el.textContent = qt('time_left')(remaining);
  el.style.color = 'var(--text-muted)';
  timerInterval = setInterval(function() {
    remaining--;
    if (remaining <= 0) {
      clearQuestionTimer();
      el.textContent = qt('time_up');
      el.style.color = '#dc2626';
      handleTimeout();
      return;
    }
    el.textContent = qt('time_left')(remaining);
    el.style.color = remaining <= 3 ? '#dc2626' : 'var(--text-muted)';
  }, 1000);
}

function handleTimeout() {
  if (answered) return;
  answered = true;
  const q = activeQuestions[currentQ];
  const allButtons = document.querySelectorAll('#optionsArea button');
  allButtons.forEach(function(b, idx) {
    b.disabled = true;
    if (idx === q.correct) { b.style.background = '#dcfce7'; b.style.borderColor = '#16a34a'; }
  });
  setTimeout(function() {
    currentQ++;
    if (currentQ < activeQuestions.length) loadQuestion();
    else showResult();
  }, 900);
}

function getQuestionImageEl() {
  let el = document.getElementById('questionImage');
  if (!el) {
    el = document.createElement('img');
    el.id = 'questionImage';
    el.alt = '';
    el.loading = 'lazy';
    // Explicit width/height (not just CSS max-width/max-height) are required —
    // many Commons SVGs carry no intrinsic size, and Safari/iOS renders such an
    // <img> at 0x0 when it only has CSS-based sizing to lay out from.
    el.width = 220;
    el.height = 140;
    el.style.cssText = 'display:none;width:220px;height:140px;max-width:100%;margin:0 auto 12px;object-fit:contain;';
    const questionText = document.getElementById('questionText');
    questionText.parentNode.insertBefore(el, questionText);
  }
  return el;
}

function loadQuestion() {
  answered = false;
  clearQuestionTimer();
  const q = activeQuestions[currentQ];
  document.getElementById('progressLabel').textContent = qt('question_progress')(currentQ + 1, activeQuestions.length);
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('questionText').setAttribute('dir', 'rtl');
  const imgEl = getQuestionImageEl();
  if (q.img) {
    imgEl.src = q.img;
    imgEl.style.display = 'block';
  } else {
    imgEl.removeAttribute('src');
    imgEl.style.display = 'none';
  }
  const optionsArea = document.getElementById('optionsArea');
  optionsArea.innerHTML = '';
  q.opts.forEach(function(opt, i) {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.cssText = 'padding:12px;border:2px solid var(--border);border-radius:8px;background:var(--surface);font-size:15px;cursor:pointer;text-align:right;';
    btn.onclick = function() { selectAnswer(i, btn); };
    optionsArea.appendChild(btn);
  });
  startQuestionTimer();
}

function selectAnswer(i, btn) {
  if (answered) return;
  answered = true;
  clearQuestionTimer();
  const q = activeQuestions[currentQ];
  const allButtons = document.querySelectorAll('#optionsArea button');
  allButtons.forEach(function(b, idx) {
    b.disabled = true;
    if (idx === q.correct) { b.style.background = '#dcfce7'; b.style.borderColor = '#16a34a'; }
    else if (idx === i) { b.style.background = '#fee2e2'; b.style.borderColor = '#dc2626'; }
  });
  if (i === q.correct) score++;
  setTimeout(function() {
    currentQ++;
    if (currentQ < activeQuestions.length) loadQuestion();
    else showResult();
  }, 900);
}

function showResult() {
  document.getElementById('quizArea').style.display = 'none';
  document.getElementById('challengeActiveLink').style.display = 'none';
  document.getElementById('resultArea').style.display = 'block';
  const pct = Math.round((score / activeQuestions.length) * 100);
  const rmList = qResultMessages();
  const rm = rmList.find(function(r) { return pct >= r.min; }) || rmList[rmList.length - 1];
  document.getElementById('resultEmoji').textContent = rm.emoji;
  document.getElementById('resultScore').textContent = qt('score_label')(score, activeQuestions.length, pct);
  document.getElementById('resultMessage').textContent = rm.msg;

  if (challengeMode && challengeId) {
    if (!challengeSubmitted) {
      challengeSubmitted = true;
      submitChallengeScore();
    } else {
      renderLeaderboard();
    }
  } else {
    document.getElementById('challengeShareArea').style.display = 'none';
    document.getElementById('leaderboardArea').style.display = 'none';
  }
}

function restart() {
  location.href = location.origin + location.pathname;
}

// Game pages don't load i18n.js (see the translation-system note above), so they
// never got initPWA()'s service-worker registration / manifest link either — meaning
// a visitor whose *first ever* site visit is a shared challenge link (a common entry
// point for this feature) got no offline support or install prompt. The service worker
// itself still applies site-wide once any page registers it (default root scope), but
// nothing did that for a game-page-first visit. Register it here too so it doesn't
// depend on the visitor having loaded some other page first.
// Game pages don't load i18n.js, so they never picked up the site-wide dark-mode
// preference either — a visitor who turned dark mode on elsewhere on the site got
// forced back to light mode on every game page. No toggle button here (that's a
// bigger UX addition left for later), just honoring whatever they already chose.
try { if (localStorage.getItem('dark') === '1') document.documentElement.classList.add('dark'); } catch (e) {}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {updateViaCache:'none'}).catch(function(){});
  if (!document.querySelector('link[rel="manifest"]')) {
    const l = document.createElement('link');
    l.rel = 'manifest'; l.href = '/manifest.json';
    document.head.appendChild(l);
  }
}

// Same mobile bottom nav as the rest of the site (i18n.js's initBottomNav()) —
// duplicated here for the same reason as the SW/dark-mode snippets above: game
// pages don't load i18n.js. Style classes (.bottom-nav etc.) already exist in
// the shared style.css, loaded by every game page.
(function initGameBottomNav() {
  if (document.getElementById('bottomNav')) return;
  const home = qGetHomeHref();
  const nav = document.createElement('nav');
  nav.id = 'bottomNav';
  nav.className = 'bottom-nav';
  nav.innerHTML =
    '<div class="bottom-nav-inner">' +
      '<a class="bottom-nav-item" href="' + home + '"><span class="bn-icon">🏠</span>' + (quizLang === 'en' ? 'Home' : 'الرئيسية') + '</a>' +
      '<a class="bottom-nav-item" href="' + home + '#toolsGrid"><span class="bn-icon">🧰</span>' + (quizLang === 'en' ? 'Tools' : 'الأدوات') + '</a>' +
      '<a class="bottom-nav-item" href="' + home + '#favSection"><span class="bn-icon">⭐</span>' + (quizLang === 'en' ? 'Favorites' : 'المفضلة') + '</a>' +
    '</div>';
  document.body.appendChild(nav);
  document.body.classList.add('has-bottom-nav');
})();

applyQuizTranslations();
const urlChallengeId = getChallengeIdFromUrl();
document.getElementById('quizArea').style.display = 'none';
if (urlChallengeId) {
  document.getElementById('challengeStartArea').style.display = 'none';
  document.getElementById('challengeJoinArea').style.display = 'block';
  showChallengeJoinIntro(urlChallengeId);
} else {
  initCategorySelector();
}
