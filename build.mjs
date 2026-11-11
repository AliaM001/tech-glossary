import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const terms=JSON.parse(read('terms.json'));
const {sources}=JSON.parse(read('sources.json'));
const domains=['food','textiles','hard','design','digital','systems'];
const names=new Set();
for(const t of terms){
 if(!t.term||names.has(t.term))throw Error('Missing or duplicate term: '+t.term);
 names.add(t.term);
 for(const level of ['junior','senior']){
  if(!t.def[level]?.trim())throw Error('Missing definition: '+t.term+' '+level);
  for(const [domain,e]of Object.entries(t.examples)){
   if(!domains.includes(domain)||!e[level]?.length||e[level].some(x=>!x.trim()))throw Error('Missing or invalid example: '+t.term+' '+domain+' '+level);
  }
 }
 if(t.kind==='shared'&&domains.some(d=>!t.examples[d]))throw Error('Shared term missing a domain: '+t.term);
 if(!Object.keys(t.examples).length||!t.refs.length||t.refs.some(r=>!sources[r.id]||!r.section))throw Error('Invalid sources or domains: '+t.term);
}
terms.sort((a,b)=>a.term.localeCompare(b.term,'en-NZ'));
const data=JSON.stringify({terms,sources}).replace(/</g,'\\u003c');
const template=read('index.template.html');
if(!template.includes('__GLOSSARY_DATA__'))throw Error('Missing template marker');
fs.writeFileSync(path.join(root,'index.html'),template.replace('__GLOSSARY_DATA__',()=>data));
const csv=value=>'"'+String(value).replace(/"/g,'""')+'"';
const rows=[['Term','Type','Curriculum connections',...domains.map(d=>d+' junior/senior'),'Source locations'],...terms.map(t=>[t.term,t.kind,[...new Set(t.refs.map(r=>sources[r.id].curriculum))].join('; '),...domains.map(d=>t.examples[d]?'yes / yes':'not applicable'),t.refs.map(r=>sources[r.id].title+': '+r.section).join('; ')])];
fs.writeFileSync(path.join(root,'coverage.csv'),'\uFEFF'+rows.map(r=>r.map(csv).join(',')).join('\r\n')+'\r\n');
const shared=terms.filter(t=>t.kind==='shared').length;
console.log(JSON.stringify({entries:terms.length,shared,specialist:terms.length-shared,domains:domains.map(d=>({domain:d,entries:terms.filter(t=>t.examples[d]).length})),validation:'passed'}));

