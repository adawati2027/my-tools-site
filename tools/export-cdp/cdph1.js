const {spawn}=require('child_process');
const ch=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--remote-debugging-port=9333','--user-data-dir='+process.env.TEMP+'/cdpprof','--allow-file-access-from-files','--window-size=480,1000','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await sleep(3000);
 const tabs=await (await fetch('http://127.0.0.1:9333/json')).json();
 const t=tabs.find(x=>x.type==='page');
 const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
 let id=0;const pend={};ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend[m.id])pend[m.id](m)};
 const send=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}))});
 await send('Page.enable');
 await send('Page.navigate',{url:'file:///C:/Users/96896/Downloads/my-tools-site/jo/health/water-intake/index.html'});
 await sleep(3000);
 const set="tgArabic.value=88;tgEnglish.value=92;tgIslamic.value=90;tgHistory.value=85;";
 for (const e of ["hW.value=70;calc();hMain.innerText+' | '+hLbl.innerText+' | '+hExtra.innerText.split(String.fromCharCode(10)).join(' ')+' | '+hExplain.innerText","document.querySelector('#hAct [data-v=\"0.35\"]').click();document.querySelector('#hHot [data-v=\"0.5\"]').click();hMain.innerText+' | '+hExplain.innerText","hW.value='';calc();getComputedStyle(hResult).display"]) {
  const r=await send('Runtime.evaluate',{expression:e}); console.log(r.result.result.value===undefined?JSON.stringify(r.result).slice(0,300):r.result.result.value);
 }
 ch.kill();process.exit();
})();
