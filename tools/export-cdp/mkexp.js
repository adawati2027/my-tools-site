const fs=require('fs');
const tpl=fs.readFileSync(__dirname+'/cdph1.js','utf8');
const [dir,setup]=[process.argv[2],process.argv[3]];
const ex=[setup+";calc();window.__r=null;exportResultImage=function(t,r){window.__r={t:t,r:r}};hExport();JSON.stringify(window.__r)",
"buildResultCanvas(window.__r.t,window.__r.r).toDataURL('image/png')"];
let s=tpl.replace(/jo\/health\/water-intake\/index\.html/,dir+'/index.html').replace(/for \(const e of \[.*\]\) \{/,'for (const e of '+JSON.stringify(ex)+') {');
s=s.replace(/console\.log\(r\.result\.result\.value===undefined[^;]*;/,"const v=r.result.result.value; if(typeof v==='string'&&v.startsWith('data:image')){require('fs').writeFileSync(process.env.TEMP+'/exp_out.png',Buffer.from(v.split(',')[1],'base64'));console.log('png saved',v.length);}else console.log(v===undefined?JSON.stringify(r.result).slice(0,400):v);");
fs.writeFileSync(process.env.TEMP+'/cdpexp.js',s);
