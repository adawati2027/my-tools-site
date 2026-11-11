(function(){
  var main=document.querySelector('main .tool-page');
  if(!main||document.body.classList.contains('mb-full')||document.getElementById('gfsBtn'))return;
    var L={ar:['ملء الشاشة','خروج من ملء الشاشة'],fr:['Plein écran','Quitter le plein écran'],de:['Vollbild','Vollbild beenden'],es:['Pantalla completa','Salir de pantalla completa'],ru:['Во весь экран','Выйти из полноэкранного режима'],en:['Full screen','Exit full screen']};
  var t=L[(document.documentElement.lang||'ar').slice(0,2)]||L.en;
  var css='#gfsBtn{display:inline-flex;align-items:center;gap:6px;font:700 13px/1 inherit;font-family:inherit;padding:8px 14px;border-radius:10px;border:1px solid var(--border,#e2e8f0);background:var(--surface,#fff);color:var(--text-muted,#5c6b83);cursor:pointer;box-shadow:var(--shadow-xs,none)}'
   +'#gfsBtn:hover{color:var(--primary,#2563eb);border-color:var(--primary,#2563eb)}'
   +'.gfs-row{display:flex;justify-content:flex-end;margin:0 0 12px}'
   +'body.gfs{overflow:hidden}'
   +'body.gfs .navbar,body.gfs .footer,body.gfs .bottom-nav,body.gfs .pwa-banner,body.gfs ins.adsbygoogle,body.gfs .page-header>*:not(#gfsBtn){display:none!important}'
   +'body.gfs main{position:fixed;inset:0;z-index:9999;overflow:auto;-webkit-overflow-scrolling:touch;background:var(--bg,#f0f4ff);padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}'
   +'body.gfs .tool-page{max-width:720px;padding:70px 10px 24px}'
   +'body.gfs #gfsBtn{position:fixed;top:calc(env(safe-area-inset-top) + 14px);inset-inline-start:10px;z-index:10000;width:46px;height:46px;padding:0;justify-content:center;border-radius:50%;font-size:22px;touch-action:manipulation;background:var(--surface,#fff);box-shadow:0 2px 8px rgba(0,0,0,.2)}'
   +'body.gfs #gfsBtn .gfs-t{display:none}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var btn=document.createElement('button');
  btn.id='gfsBtn';btn.type='button';
  function label(){var on=document.body.classList.contains('gfs');btn.innerHTML=on?'✕':'⛶ <span class="gfs-t">'+t[0]+'</span>';btn.title=on?t[1]:t[0];btn.setAttribute('aria-label',btn.title);}
  var hdr=main.querySelector('.page-header');
  if(hdr)hdr.appendChild(btn);
  else{var row=document.createElement('div');row.className='gfs-row';row.appendChild(btn);main.insertBefore(row,main.firstChild);}
  function nativeFs(on){
    try{
      var d=document,el=d.documentElement;
      if(on){var f=el.requestFullscreen||el.webkitRequestFullscreen;if(f&&!d.fullscreenElement&&!d.webkitFullscreenElement){var p=f.call(el);if(p&&p.catch)p.catch(function(){});}}
      else if(d.fullscreenElement||d.webkitFullscreenElement){var x=d.exitFullscreen||d.webkitExitFullscreen;var q=x.call(d);if(q&&q.catch)q.catch(function(){});}
    }catch(e){}
  }
  function set(on){
    document.body.classList.toggle('gfs',on);
    nativeFs(on);label();
    window.scrollTo(0,0);document.querySelector("main").scrollTop=0;
    setTimeout(function(){window.dispatchEvent(new Event('resize'));},60);
  }
  btn.addEventListener('click',function(){set(!document.body.classList.contains('gfs'));});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.classList.contains('gfs')&&!document.fullscreenElement)set(false);});
  document.addEventListener('fullscreenchange',function(){
    if(document.fullscreenElement){btn.dataset.native='1';}
    else if(btn.dataset.native==='1'){btn.dataset.native='';if(document.body.classList.contains('gfs'))set(false);}
  });
  document.addEventListener('webkitfullscreenchange',function(){
    if(document.webkitFullscreenElement){btn.dataset.native='1';}
    else if(btn.dataset.native==='1'){btn.dataset.native='';if(document.body.classList.contains('gfs'))set(false);}
  });
  label();
})();
