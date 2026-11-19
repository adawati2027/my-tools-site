(function(){
'use strict';
var db = null, boardCol = null;
function el(id){ return document.getElementById(id); }
function ls(k, v){ try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
function pid(){
  var p = ls('adawati_marble_pid');
  if (!p || !/^[a-z0-9]{16,40}$/.test(p)){
    p = ''; var a = new Uint8Array(24);
    (window.crypto || window.msCrypto).getRandomValues(a);
    for (var i = 0; i < a.length; i++) p += (a[i] % 36).toString(36);
    ls('adawati_marble_pid', p);
  }
  return p;
}
function init(){
  if (db) return true;
  if (!window.firebase) return false;
  try {
    if (!firebase.apps.length) firebase.initializeApp({
      apiKey: "AIzaSyAO8ZKfiaKlqTIw8xUfEp5xHFy0ilBztKQ",
      authDomain: "adawati-challenges.firebaseapp.com",
      projectId: "adawati-challenges",
      storageBucket: "adawati-challenges.firebasestorage.app",
      messagingSenderId: "360902823980",
      appId: "1:360902823980:web:bd85f87de77dcfc315c189"
    });
    db = firebase.firestore(); boardCol = db.collection('marbleBoard');
  } catch (e) { return false; }
  return true;
}
function name(){ return (ls('adawati_marble_name') || '').slice(0, 20); }
function cleanName(s){ return String(s || '').replace(/[<>\n\r]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 20); }
function completed(){ return Math.max(0, (parseInt(ls('adawati_marble_level'), 10) || 1) - 1); }
function submit(){
  var n = name(), lv = completed();
  if (!n || lv < 1 || !init()) return Promise.resolve(false);
  var sent = parseInt(ls('adawati_marble_sent'), 10) || 0, sentName = ls('adawati_marble_sentname');
  if (lv <= sent && sentName === n) return Promise.resolve(true);
  return boardCol.doc(pid()).set({ name: n, level: lv, updatedAt: firebase.firestore.FieldValue.serverTimestamp() })
    .then(function(){ ls('adawati_marble_sent', String(lv)); ls('adawati_marble_sentname', n); return true; })
    .catch(function(){ return false; });
}
function saveName(s){
  var n = cleanName(s);
  if (n.length < 2) return false;
  ls('adawati_marble_name', n); submit(); return true;
}
function render(list, mine){
  var ol = el('mbBoardList'); ol.textContent = '';
  if (!list.length){ var e0 = document.createElement('li'); e0.textContent = 'لا أحد بعد. كن الأول!'; e0.style.listStyle = 'none'; ol.appendChild(e0); return; }
  list.forEach(function(d, i){
    var li = document.createElement('li'); li.className = 'mb-row' + (d.id === mine ? ' me' : '');
    var r = document.createElement('span'); r.className = 'mb-rank'; r.textContent = i < 3 ? ['🥇','🥈','🥉'][i] : String(i + 1);
    var nm = document.createElement('span'); nm.className = 'mb-nm'; nm.textContent = d.name;
    var lv = document.createElement('span'); lv.className = 'mb-lv'; lv.textContent = 'م ' + d.level;
    li.appendChild(r); li.appendChild(nm); li.appendChild(lv); ol.appendChild(li);
  });
}
function load(){
  var ol = el('mbBoardList');
  if (!init()){ ol.textContent = 'تعذر تحميل الترتيب الآن.'; return; }
  ol.textContent = 'جارٍ التحميل...';
  boardCol.orderBy('level', 'desc').limit(20).get().then(function(snap){
    var arr = []; snap.forEach(function(doc){ var d = doc.data(); arr.push({ id: doc.id, name: String(d.name || ''), level: d.level }); });
    render(arr, pid());
  }).catch(function(){ ol.textContent = 'تعذر تحميل الترتيب الآن.'; });
}
function open(){
  el('mbOverlay').hidden = true;
  var inp = el('mbBoardName'); inp.value = name();
  el('mbBoard').hidden = false;
  submit().then(load);
  load();
}
function close(){ el('mbBoard').hidden = true; }
function winRow(show){
  var row = el('mbNameRow'); if (!row) return;
  row.hidden = !show || !!name();
  if (!row.hidden) el('mbWinName').value = '';
}
function bind(){
  el('mbBoardBtn').addEventListener('click', open);
  el('mbBoardClose').addEventListener('click', close);
  el('mbBoardSave').addEventListener('click', function(){
    if (saveName(el('mbBoardName').value)){ el('mbBoardMsg').textContent = 'تم حفظ اسمك.'; setTimeout(load, 900); }
    else el('mbBoardMsg').textContent = 'اكتب اسماً من حرفين على الأقل.';
  });
  el('mbWinSave').addEventListener('click', function(){
    if (saveName(el('mbWinName').value)){ el('mbNameRow').hidden = true; el('mbWinMsg').textContent = 'سُجّل اسمك في الترتيب.'; }
    else el('mbWinMsg').textContent = 'اكتب اسماً من حرفين على الأقل.';
  });
  el('mbWinBoard').addEventListener('click', open);
}
window.MarbleBoard = { onWin: function(){ el('mbWinMsg').textContent = ''; winRow(true); submit(); }, onLose: function(){ winRow(false); el('mbWinMsg').textContent = ''; } };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
