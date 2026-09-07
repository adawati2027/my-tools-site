firebase.initializeApp({
  apiKey: "AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ",
  authDomain: "adawati-challenges.firebaseapp.com",
  projectId: "adawati-challenges",
  storageBucket: "adawati-challenges.firebasestorage.app",
  messagingSenderId: "360902823980",
  appId: "1:360902823980:web:bd85f87de77dcfc315c189"
});
const db = firebase.firestore();

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
    return '<button type="button" class="cat-select-btn" data-cat="' + c.key + '" style="padding:8px 14px;border-radius:8px;border:2px solid var(--border);background:' + (c.key === selectedCategory ? 'var(--primary)' : 'var(--surface)') + ';color:' + (c.key === selectedCategory ? '#fff' : 'var(--text)') + ';font-size:13px;font-weight:700;cursor:pointer;">' + escapeHtml(c.label) + '</button>';
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
  if (!name) { alert('اكتب اسمك الأول 🙂'); return; }
  const btn = document.querySelector('#challengeStartArea button');
  document.getElementById('creatorNameInput').disabled = true;
  btn.disabled = true; btn.textContent = 'جاري الإنشاء...';
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
    alert('صار خطأ بإنشاء التحدي، جرب مرة ثانية.');
    document.getElementById('creatorNameInput').disabled = false;
    btn.disabled = false; btn.textContent = 'ابدأ تحدي';
  }
}

let acceptsUnsub = null;

function listenForAcceptance() {
  if (acceptsUnsub) acceptsUnsub();
  acceptsUnsub = db.collection('challenges').doc(challengeId).collection('accepts')
    .onSnapshot(function(snap) {
      if (!snap.empty) {
        const names = snap.docs.map(function(d) { return d.data().name || 'صاحبك'; });
        const totalPlayers = names.length + 1; // +1 for the creator
        const shown = names.slice(0, 3).map(escapeHtml).join('، ');
        const extra = names.length > 3 ? ' و' + (names.length - 3) + ' غيرهم' : '';
        document.getElementById('accepterNameSpan').textContent = shown + extra;
        const countLabel = document.getElementById('acceptCountLabel');
        if (countLabel) countLabel.textContent = totalPlayers + ' من ' + MAX_PLAYERS + ' لاعب انضموا';
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
      document.getElementById('challengeJoinMsg').textContent = 'هذا التحدي غير موجود أو انتهى، جرب رابط جديد.';
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
      document.getElementById('challengeJoinMsg').textContent = 'التحدي مكتمل! وصل للحد الأقصى (' + MAX_PLAYERS + ' لاعب). اطلب من صاحبك يعمل تحدي جديد.';
      document.getElementById('challengeJoinForm').style.display = 'none';
      return;
    }

    let alreadyStarted = false;
    try {
      const startsSnap = await db.collection('challenges').doc(id).collection('starts').get();
      alreadyStarted = !startsSnap.empty;
    } catch (e) { /* if this check fails, show the normal pre-start message below */ }

    document.getElementById('challengeJoinMsg').textContent = alreadyStarted
      ? ('🏆 ' + escapeHtml(data.creatorName) + ' وأصحابه بلشوا يلعبوا! اكتب اسمك وانضم دغري.')
      : ('🏆 ' + escapeHtml(data.creatorName) + ' تحداك! جاهز تنافسه؟ (' + joinedCount + '/' + MAX_PLAYERS + ' انضموا)');
  } catch (e) {
    document.getElementById('challengeJoinMsg').textContent = 'صار خطأ بتحميل التحدي، تأكد من اتصالك وجرب تاني.';
    document.getElementById('challengeJoinForm').style.display = 'none';
  }
}

async function joinChallenge() {
  const name = document.getElementById('joinerNameInput').value.trim();
  if (!name) { alert('اكتب اسمك الأول 🙂'); return; }
  const btn = document.querySelector('#challengeJoinForm button');
  if (btn.disabled) return;
  document.getElementById('joinerNameInput').disabled = true;
  btn.disabled = true; btn.textContent = 'جاري الانضمام...';

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
        alert('للأسف التحدي مكتمل، وصل للحد الأقصى (' + MAX_PLAYERS + ' لاعب).');
        document.getElementById('joinerNameInput').disabled = false;
        btn.disabled = false; btn.textContent = 'قبول التحدي ✅';
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
    alert('صار خطأ، تأكد من اتصالك وجرب تاني.');
    document.getElementById('joinerNameInput').disabled = false;
    btn.disabled = false; btn.textContent = 'قبول التحدي ✅';
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
  document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="3" style="padding:8px;text-align:center;color:var(--text-muted);">جاري التحميل...</td></tr>';
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
      document.getElementById('leaderboardBody').innerHTML = rows.join('') || '<tr><td colspan="3" style="padding:8px;text-align:center;">لسا محدا لعب</td></tr>';
      latestLeaderboard = board;
    }, function() {
      document.getElementById('leaderboardBody').innerHTML = '<tr><td colspan="3" style="padding:8px;text-align:center;">تعذر تحميل لوحة الترتيب حالياً</td></tr>';
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
  return '\n\n🏆 ترتيب التحدي:\n' + lines.join('\n');
}

function shareResult() {
  const pct = Math.round((score / activeQuestions.length) * 100);
  let text = QUIZ_CONFIG.resultText(score, activeQuestions.length, pct);
  if (challengeMode && challengeId) text += buildLeaderboardShareText();
  const url = (challengeMode && challengeId)
    ? (location.origin + location.pathname + '?challenge=' + challengeId)
    : (location.origin + location.pathname);
  if (navigator.share) {
    navigator.share({ title: QUIZ_CONFIG.shareTitle, text: text, url: url }).catch(function() {});
    return;
  }
  const full = text + ' ' + url;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(full).then(function() { alert('تم نسخ نتيجتك! الصقها بأي مكان بدك تشاركها فيه.'); }).catch(function() { alert(full); });
  } else {
    alert(full);
  }
}

function shareOrCopy(inputId, btnId) {
  const url = document.getElementById(inputId).value;
  if (navigator.share) {
    navigator.share({ title: QUIZ_CONFIG.shareTitle, text: QUIZ_CONFIG.challengeText, url: url }).catch(function() {});
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
    btn.textContent = '✅ تم النسخ';
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
  el.textContent = '⏱️ ' + remaining + ' ثانية';
  el.style.color = 'var(--text-muted)';
  timerInterval = setInterval(function() {
    remaining--;
    if (remaining <= 0) {
      clearQuestionTimer();
      el.textContent = '⏱️ خلص الوقت!';
      el.style.color = '#dc2626';
      handleTimeout();
      return;
    }
    el.textContent = '⏱️ ' + remaining + ' ثانية';
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

function loadQuestion() {
  answered = false;
  clearQuestionTimer();
  const q = activeQuestions[currentQ];
  document.getElementById('progressLabel').textContent = 'سؤال ' + (currentQ + 1) + ' من ' + activeQuestions.length;
  document.getElementById('questionText').textContent = q.q;
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
  const rm = QUIZ_CONFIG.resultMessages.find(function(r) { return pct >= r.min; }) || QUIZ_CONFIG.resultMessages[QUIZ_CONFIG.resultMessages.length - 1];
  document.getElementById('resultEmoji').textContent = rm.emoji;
  document.getElementById('resultScore').textContent = score + ' من ' + activeQuestions.length + ' (' + pct + '%)';
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
  if (leaderboardUnsub) { leaderboardUnsub(); leaderboardUnsub = null; }
  if (startUnsub) { startUnsub(); startUnsub = null; }
  if (!challengeMode) pickQuestions();
  currentQ = 0;
  score = 0;
  quizStartTime = Date.now();
  document.getElementById('quizArea').style.display = 'block';
  document.getElementById('resultArea').style.display = 'none';
  if (challengeMode && challengeId) showActiveChallengeLink();
  loadQuestion();
}

const urlChallengeId = getChallengeIdFromUrl();
document.getElementById('quizArea').style.display = 'none';
if (urlChallengeId) {
  document.getElementById('challengeStartArea').style.display = 'none';
  document.getElementById('challengeJoinArea').style.display = 'block';
  showChallengeJoinIntro(urlChallengeId);
} else {
  initCategorySelector();
}
