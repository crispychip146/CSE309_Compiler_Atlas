const {cards,meta}=JSON.parse(document.getElementById('atlasData').textContent);
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const years=['2023-2024','2022-2023','2021-2022','2020-2021','2019-2020'];
const topics=[...new Set(cards.flatMap(c=>c.topics))].sort();
const byId=new Map(cards.map(c=>[c.id,c]));
function stored(key){try{return new Set(JSON.parse(localStorage.getItem(key)||'[]'));}catch{return new Set();}}
const saved=stored('compiler-atlas-saved-v1'),reviewed=stored('compiler-atlas-reviewed-v1');
function persist(key,set){try{localStorage.setItem(key,JSON.stringify([...set]));}catch{toast('This browser could not save your revision choices.');}}
let state={view:'years',year:'',section:'',topic:'',query:'',id:null};
let lastView='years',mermaidPromise,renderVersion=0,graphCounter=0;
try{const t=localStorage.getItem('compiler-atlas-theme');if(t==='light'){document.body.classList.remove('dark');document.body.classList.add('light');}else{document.body.classList.add('dark');document.body.classList.remove('light');}}catch{document.body.classList.add('dark');}
try{if(localStorage.getItem('compiler-atlas-sidebar-collapsed')==='true'&&window.innerWidth>1024){document.body.classList.add('sidebar-collapsed');$('#menuButton')?.setAttribute('aria-expanded','false');$('#menuButton')?.setAttribute('title','Show sidebar');}}catch{}
$('#yearFilter').insertAdjacentHTML('beforeend',years.map(y=>`<option value="${y}">${y.replace('-','–')}</option>`).join(''));
$('#topicFilter').insertAdjacentHTML('beforeend',topics.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join(''));
$('#yearNav').innerHTML=years.map(y=>`<button class="year-link" data-year="${y}">${y.replace('-','–')} <span>${cards.filter(c=>c.year===y).length} answers</span></button>`).join('');
$('#topicCount').textContent=topics.length;$('#allCount').textContent=cards.length;$('#solutionStat').textContent=cards.length;
function filtered(){return cards.filter(c=>(!state.year||c.year===state.year)&&(!state.section||c.section===state.section)&&(!state.topic||c.topics.includes(state.topic))&&(state.view!=='saved'||saved.has(c.id))&&(!state.query||c.search.includes(state.query.toLowerCase())));}
function hash(){const p=new URLSearchParams();p.set('view',state.view);for(const k of ['year','section','topic','query'])if(state[k])p.set(k,state[k]);if(state.id)p.set('q',state.id);return '#'+p.toString();}
function syncHash(replace=false){history[replace?'replaceState':'pushState'](null,'',hash());}
function readHash(){const p=new URLSearchParams(location.hash.slice(1));state={view:['years','topics','questions','saved'].includes(p.get('view'))?p.get('view'):'years',year:years.includes(p.get('year'))?p.get('year'):'',section:['A','B'].includes(p.get('section'))?p.get('section'):'',topic:topics.includes(p.get('topic'))?p.get('topic'):'',query:p.get('query')||'',id:byId.has(p.get('q'))?p.get('q'):null};lastView=state.view;}
function navigate(changes,scroll=true){state={...state,...changes};if(!state.id)lastView=state.view;syncHash();render();closeMenu();if(scroll)window.scrollTo({top:0,behavior:'instant'});}
function chooseYear(year,section=''){navigate({view:'questions',year,section,topic:'',query:'',id:null});}
function labelCount(n,singular,plural=singular+'s'){return `${n} ${n===1?singular:plural}`;}
function render(){
 renderVersion++;$('#savedCount').textContent=saved.size;
 $('#searchInput').value=state.query;$('#yearFilter').value=state.year;$('#sectionFilter').value=state.section;$('#topicFilter').value=state.topic;
 document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));
 document.querySelectorAll('.year-link').forEach(b=>b.classList.toggle('current',b.dataset.year===state.year));
 const filteredCards=filtered(),active=byId.get(state.id),hasFilters=state.year||state.section||state.topic||state.query;
 $('#clearFilters').hidden=!hasFilters;
 $('#filterStatus').textContent=labelCount(filteredCards.length,'answer')+(state.view==='saved'?' saved':' available');
 $('#intro').hidden=!!active||!!hasFilters||state.view==='questions'||state.view==='saved';
 $('#catalog').hidden=!!active;$('#reader').hidden=!active;
 $('#breadcrumb').innerHTML=active?`${esc(active.year.replace('-','–'))} <span>/</span> Section ${active.section} <span>/</span> ${esc(active.number)}`:state.view==='topics'?'Study library <span>/</span> Topic catalog':state.view==='saved'?'Study library <span>/</span> Saved questions':'Study library <span>/</span> '+(state.year?esc(state.year.replace('-','–')):'Past papers');
 if(active){renderAnswer(active,filteredCards);return;}
 if(state.view==='years'&&!hasFilters)renderYears();
 else if(state.view==='topics'&&!state.topic&&!state.query)renderTopics(filteredCards);
 else renderQuestions(filteredCards);
}
const paperTopics={
 '2023-2024':['Lexical analysis','LR parsing','Code optimization'],
 '2022-2023':['LL parsing','Intermediate code','Register allocation'],
 '2021-2022':['Syntax-directed translation','Garbage collection','LR parsing'],
 '2020-2021':['FIRST and FOLLOW','Control flow and backpatching','Code optimization'],
 '2019-2020':['Types and arrays','Liveness analysis','Register allocation']
};
function renderYears(){
 $('#catalog').innerHTML=`<div class="section-heading"><h2>Choose your paper.</h2><span>Newest to oldest · all questions included</span></div><div class="year-grid">${years.map((y,i)=>{let list=cards.filter(c=>c.year===y);let count=list.filter(c=>reviewed.has(c.id)).length;return `<article class="paper-card"><div class="paper-top"><span>EXAM PAPER ${String(i+1).padStart(2,'0')}</span>${i===0?'<span class="paper-chip">Latest paper</span>':'<span>SECTIONS A + B</span>'}</div><h3>${y.replace('-','–')}</h3><p class="paper-desc">${new Set(list.map(c=>c.main)).size} main questions · ${list.length} worked answers</p><div class="paper-tags">${paperTopics[y].map(t=>`<button class="topic-tag" data-topic="${esc(t)}" data-topic-year="${y}">${esc(t)}</button>`).join('')}</div><div class="paper-bottom"><button class="paper-button" data-year="${y}">Open paper <span>↗</span></button><button class="section-shortcut" data-year="${y}" data-section="A">A</button><button class="section-shortcut" data-year="${y}" data-section="B">B</button></div>${count?`<div class="paper-progress">${count} of ${list.length} reviewed</div>`:''}</article>`;}).join('')}</div><div class="note-banner"><span aria-hidden="true">↳</span><p><strong>Revising a concept across years?</strong> Open the topic catalog to find related questions, then narrow by year and section. Every answer includes a reference basis and clearly stated assumptions where needed.</p></div>`;
}
function renderTopics(list){
 const available=topics.filter(t=>list.some(c=>c.topics.includes(t)));
 $('#catalog').innerHTML=`<div class="section-heading"><h2>Follow a concept.</h2><span>${available.length} topics · year and section breakdown</span></div><div class="topic-grid">${available.map(t=>{const related=list.filter(c=>c.topics.includes(t));return `<article class="topic-card"><button data-topic="${esc(t)}">${esc(t)}</button><small>${labelCount(related.length,'worked answer')}</small><div class="topic-years">${years.filter(y=>related.some(c=>c.year===y)).map(y=>`<div class="topic-year-row"><span>${y.replace('-','–')}</span><span>${['A','B'].map(s=>{let n=related.filter(c=>c.year===y&&c.section===s).length;return n?`<button data-topic="${esc(t)}" data-topic-year="${y}" data-topic-section="${s}" title="${esc(t)}, ${y}, Section ${s}">${s} · ${n}</button>`:'';}).join(' ')}</span></div>`).join('')}</div></article>`;}).join('')}</div>`;
}
function renderQuestions(list){
 let heading=state.topic|| (state.view==='saved'?'Saved for revision':state.year?state.year.replace('-','–')+' · '+(state.section?'Section '+state.section:'all questions'):state.query?'Search results':'Every question. Every year.');
 if(!list.length){$('#catalog').innerHTML=`<div class="section-heading"><h2>${esc(heading)}</h2><span>0 results</span></div><div class="empty-state"><h3>${state.view==='saved'&&!state.query?'A little space for your next revision.':'No matching questions.'}</h3><p>${state.view==='saved'?'Use the star beside a question to save it here.':'Try a broader search or remove a filter.'}</p><button data-reset="true">Browse all questions</button></div>`;return;}
 let groups=[];for(const c of list){let key=c.year+' · Section '+c.section;let g=groups.at(-1);if(!g||g.key!==key){g={key,cards:[]};groups.push(g);}g.cards.push(c);}
 $('#catalog').innerHTML=`<div class="section-heading"><h2>${esc(heading)}</h2><span>${labelCount(list.length,'answer')}</span></div>${groups.map(g=>`<div class="panel-label" style="margin-top:25px">${esc(g.key.replace('-','–'))} <span>· ${g.cards.length}</span></div><div class="question-list">${g.cards.map(c=>`<article class="question-row"><div class="question-index">${esc(c.number)}</div><div class="question-content"><button class="question-open" data-open="${c.id}">${esc(c.title)}</button><div class="question-meta">${esc(c.year.replace('-','–'))} · Section ${c.section} · Question ${esc(c.number)}${reviewed.has(c.id)?'<span class="reviewed-dot">✓ Reviewed</span>':''}</div><div class="question-tags">${c.topics.map(t=>`<button class="topic-tag" data-topic="${esc(t)}">${esc(t)}</button>`).join('')}</div>${c.warnings.length?'<span class="source-warning">△ Assumption / source note included</span>':''}</div><button class="row-save ${saved.has(c.id)?'saved':''}" data-save="${c.id}" aria-label="${saved.has(c.id)?'Unsave':'Save'} question ${esc(c.number)}" aria-pressed="${saved.has(c.id)}">${saved.has(c.id)?'★':'☆'}</button></article>`).join('')}</div>`).join('')}`;
}
function sourcesHTML(c){return `<div class="reference-panel"><h4>Reference basis</h4><div class="source-pills">${c.sources.flatMap(s=>s.pages.map(p=>`<a href="references/${s.doc}.pdf#page=${p}" target="_blank" rel="noopener">${s.doc==='rumi'?'Rumi':'KMS'} · PDF p. ${p} ↗</a>`)).join('')}</div><p class="reference-explanation">These pages support the methods used above; the worked result is derived for this question.</p>${c.checks.length?`<details class="checks"><summary>Verification notes</summary><ul>${c.checks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`:''}</div>`;}
function warningsHTML(c){return c.warnings.length?`<aside class="warning-box"><b>Read the assumptions</b><ul>${c.warnings.map(w=>`<li>${esc(w)}</li>`).join('')}</ul></aside>`:'';}
function renderAnswer(c,list){
 const index=list.findIndex(x=>x.id===c.id);$('#readerPosition').textContent=index>=0?`${index+1} / ${list.length}`:'';$('#previousButton').disabled=index<=0;$('#nextButton').disabled=index<0||index>=list.length-1;
 $('#answerArticle').innerHTML=`<header class="answer-heading"><div class="answer-kicker">${esc(c.year.replace('-','–'))} <span> / </span> SECTION ${c.section} <span> / </span> QUESTION ${esc(c.number)}</div><h2>${esc(c.title)}</h2><div class="answer-heading-tags">${c.topics.map(t=>`<button class="topic-tag" data-topic="${esc(t)}">${esc(t)}</button>`).join('')}</div><div class="answer-actions"><button data-save="${c.id}" aria-pressed="${saved.has(c.id)}">${saved.has(c.id)?'★ Saved for revision':'☆ Save for revision'}</button><button data-review="${c.id}" class="${reviewed.has(c.id)?'reviewed':''}" aria-pressed="${reviewed.has(c.id)}">${reviewed.has(c.id)?'✓ Reviewed':'○ Mark as reviewed'}</button><button data-copy="${c.id}">Copy link ↗</button></div></header><section class="question-panel"><div class="panel-label">The question</div><div class="markdown">${c.questionHTML}</div></section>${warningsHTML(c)}<section><div class="solution-header"><h3>Worked solution</h3><button id="solutionToggle" aria-expanded="true" aria-controls="solutionBody">Hide solution −</button></div><div class="solution-body markdown" id="solutionBody">${c.solutionHTML}</div></section>${sourcesHTML(c)}`;
 const serial=renderVersion;enhanceDiagrams($('#answerArticle'),serial);
}
async function getMermaid(){if(!mermaidPromise)mermaidPromise=import('./vendor/mermaid/mermaid.esm.min.mjs').then(m=>{m.default.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',fontFamily:'Inter, system-ui, sans-serif',themeVariables:{primaryColor:'#161726',primaryTextColor:'#f8fafc',primaryBorderColor:'#818cf8',lineColor:'#a78bfa',secondaryColor:'#12131d',tertiaryColor:'#0a0a0f',mainBkg:'#12131d',nodeBorder:'#818cf8',clusterBkg:'#0d0e17',clusterBorder:'#383b58',titleColor:'#f8fafc',edgeLabelBackground:'#0a0a0f'},flowchart:{htmlLabels:false,useMaxWidth:true},suppressErrorRendering:true});return m.default;});return mermaidPromise;}
async function enhanceDiagrams(root,serial){const nodes=[...root.querySelectorAll('pre.mermaid')];if(!nodes.length)return;try{const m=await getMermaid();for(const node of nodes){if(serial!==renderVersion&&!root.closest('.print-content'))return;try{const definition=node.textContent;const {svg}=await m.render('graph-'+(++graphCounter),definition);node.innerHTML=svg;node.classList.add('diagram-rendered');}catch(error){node.classList.add('diagram-fallback');console.warn('Atlas diagram:',error.message);}}}catch(error){console.warn('Atlas diagram module:',error.message);}}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),2300);}
function isMobileOrTablet(){return window.innerWidth<=1024;}
function toggleSidebar(){
  if(isMobileOrTablet()){
    const open=$('#sidebar').classList.toggle('open');
    $('#menuButton').setAttribute('aria-expanded',open?'true':'false');
    $('#menuButton').setAttribute('title',open?'Hide sidebar':'Show sidebar');
  }else{
    const collapsed=document.body.classList.toggle('sidebar-collapsed');
    $('#menuButton').setAttribute('aria-expanded',collapsed?'false':'true');
    $('#menuButton').setAttribute('title',collapsed?'Show sidebar':'Hide sidebar');
    try{localStorage.setItem('compiler-atlas-sidebar-collapsed',collapsed?'true':'false');}catch{}
  }
}
function closeMenu(){
  $('#sidebar').classList.remove('open');
  if(isMobileOrTablet()){
    $('#menuButton').setAttribute('aria-expanded','false');
    $('#menuButton').setAttribute('title','Show sidebar');
  }
}
function openQuestion(id){navigate({id,view:state.view==='years'||state.view==='topics'?'questions':state.view});}
document.addEventListener('click',async e=>{
 const open=e.target.closest('[data-open]');if(open){openQuestion(open.dataset.open);return;}
 const save=e.target.closest('[data-save]');if(save){let id=save.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);persist('compiler-atlas-saved-v1',saved);render();toast(saved.has(id)?'Saved for revision':'Removed from saved questions');return;}
 const review=e.target.closest('[data-review]');if(review){let id=review.dataset.review;if(reviewed.has(id))reviewed.delete(id);else reviewed.add(id);persist('compiler-atlas-reviewed-v1',reviewed);render();return;}
 const topic=e.target.closest('[data-topic]');if(topic){navigate({view:'questions',topic:topic.dataset.topic,year:topic.dataset.topicYear||'',section:topic.dataset.topicSection||'',query:'',id:null});return;}
 const year=e.target.closest('[data-year]');if(year){chooseYear(year.dataset.year,year.dataset.section||'');return;}
 const view=e.target.closest('[data-view]');if(view){navigate({view:view.dataset.view,year:'',section:'',topic:'',query:'',id:null});return;}
 const copy=e.target.closest('[data-copy]');if(copy){try{await navigator.clipboard.writeText(location.href);toast('Question link copied');}catch{toast('Copy the address from your browser to share this question.');}return;}
 if(e.target.closest('[data-reset]'))navigate({view:'questions',year:'',section:'',topic:'',query:'',id:null});
});
$('#searchInput').addEventListener('input',()=>{state={...state,query:$('#searchInput').value,id:null};if(state.view==='years'||state.view==='topics')state.view='questions';syncHash(true);const pos=$('#searchInput').selectionStart;render();$('#searchInput').focus();$('#searchInput').setSelectionRange?.(pos,pos);});
for(const [selector,key]of [['#yearFilter','year'],['#sectionFilter','section'],['#topicFilter','topic']])$(selector).addEventListener('change',()=>navigate({[key]:$(selector).value,view:'questions',id:null},false));
$('#clearFilters').onclick=()=>navigate({year:'',section:'',topic:'',query:'',id:null},false);
$('#backButton').onclick=()=>navigate({id:null,view:lastView},false);
$('#previousButton').onclick=()=>{const list=filtered(),i=list.findIndex(c=>c.id===state.id);if(i>0)navigate({id:list[i-1].id});};
$('#nextButton').onclick=()=>{const list=filtered(),i=list.findIndex(c=>c.id===state.id);if(i>=0&&i<list.length-1)navigate({id:list[i+1].id});};
$('#answerArticle').addEventListener('click',e=>{if(e.target.id==='solutionToggle'){const b=$('#solutionBody');b.hidden=!b.hidden;e.target.textContent=b.hidden?'Show solution +':'Hide solution −';e.target.setAttribute('aria-expanded',!b.hidden);}});
function openReferences(){closeMenu();$('#referenceDialog').showModal();}
$('#referenceButton').onclick=openReferences;$('#aboutButton').onclick=openReferences;$('#closeDialog').onclick=()=>$('#referenceDialog').close();
$('#referenceDialog').addEventListener('click',e=>{if(e.target===$('#referenceDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('#menuButton').onclick=toggleSidebar;
const collapseBtn=$('#sidebarCollapseButton');if(collapseBtn)collapseBtn.onclick=toggleSidebar;
$('#backdrop').onclick=closeMenu;
$('#themeButton').onclick=()=>{const dark=document.body.classList.toggle('dark');document.body.classList.toggle('light',!dark);try{localStorage.setItem('compiler-atlas-theme',dark?'dark':'light');}catch{}};
$('#exportButton').onclick=()=>{const a=document.createElement('a');a.href='CSE_309_Worked_Solutions.md';a.download='CSE_309_Worked_Solutions.md';a.click();};
$('#printButton').onclick=async()=>{const chosen=state.id?[byId.get(state.id)]:filtered();if(!chosen.length){toast('Choose at least one question to print.');return;}$('#printContent').innerHTML=`<header class="print-heading"><h1>CSE 309 · Worked Solutions</h1><p>${chosen.length} answers · Reference basis: Rumi Sir Merged and KMS Merged · ${state.id?'Selected question':'Current year / section / topic filters'}</p></header>`+chosen.map(c=>`<article class="print-answer"><p>${esc(c.year)} · Section ${c.section} · Question ${esc(c.number)}</p><h2>${esc(c.title)}</h2><div class="markdown"><h3>Question</h3>${c.questionHTML}</div>${warningsHTML(c)}<div class="markdown"><h3>Solution</h3>${c.solutionHTML}</div>${sourcesHTML(c)}</article>`).join('');toast('Preparing '+labelCount(chosen.length,'answer')+' for printing…');await enhanceDiagrams($('#printContent'),renderVersion);await document.fonts.ready;window.print();};
window.addEventListener('popstate',()=>{readHash();render();window.scrollTo(0,0);});
document.addEventListener('keydown',e=>{const typing=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName);if(e.key==='/'&&!typing&&!$('#referenceDialog').open){e.preventDefault();$('#searchInput').focus();}if(e.key==='Escape')closeMenu();if((e.key==='['||(e.key==='b'&&(e.ctrlKey||e.metaKey)))&&!typing&&!$('#referenceDialog').open){e.preventDefault();toggleSidebar();}});
$('.brand').addEventListener('click',e=>{e.preventDefault();navigate({view:'years',year:'',section:'',topic:'',query:'',id:null});});
readHash();render();
window.__atlasQA={cards,meta,getMermaid,filtered,getState:()=>({...state})};
