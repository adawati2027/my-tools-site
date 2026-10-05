const fs=require('fs');let bad=0;
for(const f of process.argv.slice(2)){const h=fs.readFileSync(f,'utf8');for(const m of h.matchAll(/<script(?![^>]*(src=|ld\+json))[^>]*>([\s\S]*?)<\/script>/g)){try{new Function(m[2])}catch(e){bad++;console.log(f,e.message)}}}
console.log(bad?`${bad} errors`:'syntax OK');
