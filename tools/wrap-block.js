// usage: node tools/wrap-block.js file.html specs.json   (specs: [[name,startText,endText],...])
const fs=require('fs');const [f,spec]=process.argv.slice(2);let s=fs.readFileSync(f,'utf8');const NL=s.includes('\r\n')?'\r\n':'\n';
for(let [name,start,end] of JSON.parse(fs.readFileSync(spec,'utf8'))){
  if(s.includes(`<!--i18n-block:${name}-->`)){console.log('exists',name);continue;}
  start=start.split('\n').join(NL);end=end.split('\n').join(NL);const i=s.indexOf(start);const k=s.indexOf(end,i);
  if(i<0||k<0){console.log('NOT FOUND',name);continue;}const j=k+end.length;
  s=s.slice(0,i)+`<!--i18n-block:${name}-->`+s.slice(i,j)+`<!--/i18n-block:${name}-->`+s.slice(j);console.log('wrapped',name);
}
fs.writeFileSync(f,s);
