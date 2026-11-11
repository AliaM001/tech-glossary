'use strict';
const {terms: TERMS, sources: SOURCES} = JSON.parse(document.getElementById('glossary-data').textContent);
const AREAS=[
 {key:'food',label:'Food & processing',pillCls:'pill-food',chipCls:'ex-food'},
 {key:'textiles',label:'Textiles',pillCls:'pill-textiles',chipCls:'ex-textiles'},
 {key:'hard',label:'Resistant materials',pillCls:'pill-hard',chipCls:'ex-hard'},
 {key:'design',label:'Spatial & product design',pillCls:'pill-design',chipCls:'ex-design'},
 {key:'digital',label:'Digital technology',pillCls:'pill-digital',chipCls:'ex-digital'},
 {key:'systems',label:'Systems & control',pillCls:'pill-systems',chipCls:'ex-systems'}
];
let activeLevel='junior', activeFilter='all', activeAlpha='all';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalise=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en-NZ');
function selectedAreas(){return activeFilter==='all'?AREAS:AREAS.filter(a=>a.key===activeFilter);}
function matchingTerms(){
 const q=normalise(document.getElementById('searchInput').value.trim());
 const curriculum=document.getElementById('curriculumSelect').value;
 const kind=document.getElementById('kindSelect').value;
 const areas=selectedAreas();
 return TERMS.filter(t=>{
  const applicable=areas.filter(a=>t.examples[a.key]?.[activeLevel]?.length);
  const content=[t.term,t.def[activeLevel],...applicable.flatMap(a=>t.examples[a.key][activeLevel])].join(' ');
  return applicable.length && (!q||normalise(content).includes(q)) && (activeAlpha==='all'||t.term[0].toUpperCase()===activeAlpha) && (kind==='all'||kind===t.kind) && (curriculum==='all'||t.refs.some(r=>SOURCES[r.id].curriculum===curriculum));
 });
}
function render(){
 const filtered=matchingTerms();
 const areas=selectedAreas();
 document.getElementById('countLabel').textContent=filtered.length+' of '+TERMS.length+' entries · '+(activeLevel==='junior'?'Junior':'Senior')+' explanations'+(activeFilter==='all'?'':' · '+areas[0].label);
 document.getElementById('termList').innerHTML=filtered.length?filtered.map(t=>{
  const chips=areas.filter(a=>t.examples[a.key]?.[activeLevel]?.length).map(a=>'<div class="ex-chip '+a.chipCls+'"><span class="area">'+esc(a.label)+'</span><ul>'+t.examples[a.key][activeLevel].map(b=>'<li>'+esc(b)+'</li>').join('')+'</ul></div>').join('');
  const refLabels=[...new Set(t.refs.map(r=>SOURCES[r.id].curriculum))].map(c=>({nzc:'NZC 2007+',p4:'Phase 4',p5:'Phase 5 · proposed'}[c]));
  return '<article class="term-card"><div class="term-meta">'+esc(t.kind==='shared'?'Shared · six domains':'Specialist · '+areas.filter(a=>t.examples[a.key]).map(a=>a.label).join(', '))+'<span>'+refLabels.map(esc).join(' · ')+'</span></div><h2 class="term-name">'+esc(t.term)+'</h2><p class="def-text">'+esc(t.def[activeLevel])+'</p><div class="examples-label">Examples</div><div class="examples-grid">'+chips+'</div><details class="term-sources"><summary>Curriculum connections &amp; source locations'+(t.revised?' · definition revised':'')+'</summary><ul>'+t.refs.map(r=>'<li><a href="'+esc(SOURCES[r.id].url)+'" target="_blank" rel="noopener noreferrer">'+esc(SOURCES[r.id].label)+'</a> — '+esc(r.section)+'<br><small>'+esc(SOURCES[r.id].title)+'</small></li>').join('')+'</ul></details></article>';
 }).join(''):'<div class="no-results">No entries match these filters. Try another search or use Reset filters.</div>';
}
function updateButtons(container,attribute,value){document.querySelectorAll(container+' button').forEach(b=>{const active=b.getAttribute(attribute)===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
document.getElementById('filterRow').innerHTML=[{key:'all',label:'All domains',pillCls:'pill-all'},...AREAS].map(a=>'<button class="pill '+a.pillCls+(a.key==='all'?' active':'')+'" data-area="'+a.key+'" aria-pressed="'+(a.key==='all')+'">'+esc(a.label)+'</button>').join('');
document.getElementById('alphaBar').innerHTML=['all',...[...new Set(TERMS.map(t=>t.term[0].toUpperCase()))].sort()].map(l=>'<button class="alpha-btn'+(l==='all'?' active':'')+'" data-letter="'+l+'" aria-pressed="'+(l==='all')+'">'+(l==='all'?'All':l)+'</button>').join('');
document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{activeLevel=b.dataset.level;updateButtons('.level-toggle','data-level',activeLevel);render();}));
document.getElementById('filterRow').addEventListener('click',event=>{const b=event.target.closest('button[data-area]');if(!b)return;activeFilter=b.dataset.area;updateButtons('#filterRow','data-area',activeFilter);render();});
document.getElementById('alphaBar').addEventListener('click',event=>{const b=event.target.closest('button[data-letter]');if(!b)return;activeAlpha=b.dataset.letter;updateButtons('#alphaBar','data-letter',activeAlpha);render();});
document.getElementById('searchInput').addEventListener('input',render);
document.getElementById('curriculumSelect').addEventListener('change',render);
document.getElementById('kindSelect').addEventListener('change',render);
document.getElementById('resetBtn').addEventListener('click',()=>{activeFilter='all';activeAlpha='all';document.getElementById('searchInput').value='';document.getElementById('curriculumSelect').value='all';document.getElementById('kindSelect').value='all';updateButtons('#filterRow','data-area',activeFilter);updateButtons('#alphaBar','data-letter',activeAlpha);render();});
document.getElementById('sourceList').innerHTML='<h3>Reviewed sources</h3><ul>'+Object.values(SOURCES).map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a><br><small>'+esc(s.status)+'</small></li>').join('')+'</ul>';
render();

