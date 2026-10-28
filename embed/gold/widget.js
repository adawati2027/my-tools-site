(function(){
  var $=function(id){return document.getElementById(id);};
  var sel=$('cur');
  var q=(new URLSearchParams(location.search).get('currency')||'').toUpperCase();
  for(var i=0;i<sel.options.length;i++){if(sel.options[i].value===q){sel.selectedIndex=i;}}
  function fmt(n,c){return c+' '+n.toFixed(2);}
  function load(){
    var c=sel.value;
    fetch('https://adawati.space/api/v1/gold?currency='+c).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(j){
      var p=j.price;
      $('p24').textContent=fmt(p,c);
      $('p21').textContent=fmt(p*21/24,c);
      $('p18').textContent=fmt(p*18/24,c);
      $('when').textContent='Updated '+new Date(j.fetched_at).toUTCString().slice(5,22)+' UTC.';
      $('out').hidden=false;$('err').hidden=true;
    }).catch(function(){$('out').hidden=true;$('err').hidden=false;});
  }
  sel.addEventListener('change',load);
  load();
})();
