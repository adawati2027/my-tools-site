firebase.initializeApp({
  apiKey: "AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ",
  authDomain: "adawati-challenges.firebaseapp.com",
  projectId: "adawati-challenges",
  storageBucket: "adawati-challenges.firebasestorage.app",
  messagingSenderId: "360902823980",
  appId: "1:360902823980:web:bd85f87de77dcfc315c189"
});
const raceDb = firebase.firestore();

function raceEscapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function raceGetIdFromURL() {
  try { return new URLSearchParams(location.search).get('race'); } catch(e) { return null; }
}

async function raceCreateChallenge(game, creatorName) {
  const doc = await raceDb.collection('challenges').add({
    creatorName: creatorName,
    game: game,
    questions: [],
    acceptedCount: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return doc.id;
}

async function raceGetChallengeInfo(raceId) {
  try {
    const doc = await raceDb.collection('challenges').doc(raceId).get();
    return doc.exists ? doc.data() : null;
  } catch(e) { return null; }
}

async function raceSubmitEntry(raceId, name, timeMs) {
  try {
    await raceDb.collection('challenges').doc(raceId).collection('players').add({
      name: name, score: 0, total: 0, timeMs: timeMs,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch(e) { return false; }
}

function raceListenLeaderboard(raceId, renderFn) {
  return raceDb.collection('challenges').doc(raceId).collection('players')
    .orderBy('timeMs', 'asc')
    .onSnapshot(function(snap) {
      const rows = [];
      snap.forEach(function(d) { rows.push(d.data()); });
      renderFn(rows);
    }, function() {});
}
