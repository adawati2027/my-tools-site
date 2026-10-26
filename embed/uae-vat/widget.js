(function(){
  var mode='add';
  var $=function(id){return document.getElementById(id);};
  function setMode(m){
    mode=m;
    $('modeAdd').classList.toggle('on',m==='add');
    $('modeEx').classList.toggle('on',m==='ex');
    $('lbl').textContent=m==='add'?'Amount before VAT (AED)':'Amount including VAT (AED)';
    $('totLbl').textContent=m==='add'?'Total incl. VAT':'Pre-tax amount';
    calc();
  }
  function calc(){
    var v=parseFloat($('amt').value);
    if(isNaN(v)||v<0){$('out').hidden=true;return;}
    var before,vat,after;
    if(mode==='add'){before=v;vat=v*0.05;after=v+vat;}
    else{after=v;before=v/1.05;vat=v-before;}
    $('vat').textContent='AED '+vat.toFixed(2);
    $('tot').textContent='AED '+(mode==='add'?after:before).toFixed(2);
    $('out').hidden=false;
  }
  $('modeAdd').addEventListener('click',function(){setMode('add');});
  $('modeEx').addEventListener('click',function(){setMode('ex');});
  $('amt').addEventListener('input',calc);
})();
