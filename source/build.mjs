import fs from 'node:fs';
import path from 'node:path';
import {marked} from 'marked';
import katex from 'katex';
const preview=process.argv.includes('--preview');
const years=['2023-2024','2022-2023','2021-2022','2020-2021','2019-2020'];
const counts=[25,32,27,22,21];
const topics=new Set(['Compiler pipeline','Linking and loading','Lexical analysis','FIRST and FOLLOW','LL parsing','LR parsing','Syntax-directed translation','Types and arrays','Intermediate code','Control flow and backpatching','Runtime environments','Garbage collection','Code optimization','Liveness analysis','Register allocation']);
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mathErrors=[];
function math(text,display){try{return katex.renderToString(text.trim(),{displayMode:display,throwOnError:true,strict:'ignore',trust:false});}catch(e){mathErrors.push(text);return `<code class="math-fallback">${escape(text)}</code>`;}}
marked.use({renderer:{code({text,lang}){if(lang?.toLowerCase()==='mermaid')return `<pre class="mermaid">${escape(text)}</pre>`;return `<pre><code${lang?` class="language-${escape(lang)}"`:''}>${escape(text)}</code></pre>`;},table(token){const cell=(x,tag)=>`<${tag}>${this.parser.parseInline(x.tokens)}</${tag}>`;return `<div class="table-wrap"><table><thead><tr>${token.header.map(x=>cell(x,'th')).join('')}</tr></thead><tbody>${token.rows.map(row=>`<tr>${row.map(x=>cell(x,'td')).join('')}</tr>`).join('')}</tbody></table></div>`;}},extensions:[
{name:'displayMath',level:'block',start:src=>src.indexOf('$$'),tokenizer(src){const m=/^\$\$\s*\n?([\s\S]+?)\n?\$\$(?:\n|$)/.exec(src);if(m)return {type:'displayMath',raw:m[0],text:m[1]};},renderer:t=>math(t.text,true)},
{name:'bracketMath',level:'block',start:src=>src.indexOf('\\['),tokenizer(src){const m=/^\\\[([\s\S]+?)\\\](?:\n|$)/.exec(src);if(m)return {type:'bracketMath',raw:m[0],text:m[1]};},renderer:t=>math(t.text,true)},
{name:'inlineMath',level:'inline',start:src=>{let i=src.indexOf('$');return i>=0?i:undefined;},tokenizer(src){const m=/^\$([^$\n]+?)\$/.exec(src);if(m)return {type:'inlineMath',raw:m[0],text:m[1]};},renderer:t=>math(t.text,false)},
{name:'parenMath',level:'inline',start:src=>src.indexOf('\\('),tokenizer(src){const m=/^\\\((.+?)\\\)/.exec(src);if(m)return {type:'parenMath',raw:m[0],text:m[1]};},renderer:t=>math(t.text,false)}
]});
const cards=[];
for(const [i,year]of years.entries()){
 const file=`content/answers-${year}.json`;
 if(!fs.existsSync(file)){if(preview)continue;throw Error('Missing '+file);}
 let list;try{list=JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){if(preview)continue;throw e;}
 if(!preview&&list.length!==counts[i])throw Error(`${year}: expected ${counts[i]}, got ${list.length}`);
 for(const c of list){
  for(const field of ['id','year','section','main','part','number','title','topics','question','solution','sources','warnings','checks'])if(!(field in c))throw Error(`${c.id}: missing ${field}`);
  if(c.year!==year||!['A','B'].includes(c.section)||c.solution.length<180||!c.question.trim()||!c.sources.length)throw Error('Invalid card '+c.id);
  for(const t of c.topics)if(!topics.has(t))throw Error(`${c.id}: noncanonical topic ${t}`);
  for(const s of c.sources)if(!['rumi','kms'].includes(s.doc)||!s.pages.length||s.pages.some(p=>!Number.isInteger(p)||p<1||p>(s.doc==='rumi'?727:568)))throw Error('Invalid sources '+c.id);
  if(/\[TODO\]|\bTBD\b|solution pending|to be completed/i.test(c.solution))throw Error('Placeholder '+c.id);
  const mainEnd=year==='2019-2020'?9:4;
  if(c.section!==(c.main<=mainEnd?'A':'B'))throw Error('Section mismatch '+c.id);
  c.questionHTML=marked.parse(c.question);c.solutionHTML=marked.parse(c.solution);
  c.search=[c.year,c.number,c.title,c.topics.join(' '),c.question,c.solution].join(' ').toLowerCase();
  cards.push(c);
 }
}
if(new Set(cards.map(c=>c.id)).size!==cards.length)throw Error('Duplicate card ids');
if(!preview&&cards.length!==127)throw Error('Expected all 127 cards');
const coverage={
 '2023-2024':['abc','abcd','abc','abcd','abc','abc','abc','ab'],
 '2022-2023':['abcdefg','abcde','abcd','abcd','ab','abcd','abc','abc'],
 '2021-2022':['abc','abcde','abcde','abcd','abc','abc','ab','ab'],
 '2020-2021':['abcd','abcd','ab','ab','abc','abc','ab','ab'],
 '2019-2020':['','','','ab','','ab','','','','abc','ab','abc','ab']
};
if(!preview)for(const year of years)for(const [i,letters]of coverage[year].entries())for(const part of letters?letters.split(''):['']){
 if(!cards.some(c=>c.year===year&&c.main===i+1&&c.part===part))throw Error(`Missing ${year} ${i+1}${part}`);
}
const meta={papers:years.length,mainQuestions:45,answerCount:cards.length,sourcePages:{rumi:727,kms:568},builtAt:'2026-10-25',preview};
fs.mkdirSync('dist',{recursive:true});
for(const file of ['app.js','style.css'])fs.copyFileSync('site/'+file,'dist/'+file);
const html=fs.readFileSync('site/index.html','utf8').replace('__ATLAS_DATA__',()=>JSON.stringify({cards,meta}).replaceAll('<','\\u003c'));
fs.writeFileSync('dist/index.html',html);
fs.writeFileSync('dist/solutions.json',JSON.stringify(cards.map(({questionHTML,solutionHTML,search,...c})=>c),null,2));
let exportMD='# CSE 309 - Complete Worked Solutions\n\n127 worked answers covering all 45 main questions in five papers. Supporting references: Rumi Sir Merged (727 PDF pages) and KMS Merged (568 PDF pages). Page citations refer to merged PDF positions. These are derived solutions, not an official marking scheme.\n';
for(const year of years){exportMD+='\n---\n\n# '+year+'\n';for(const section of ['A','B']){exportMD+='\n## Section '+section+'\n';for(const c of cards.filter(c=>c.year===year&&c.section===section)){exportMD+=`\n### ${c.number} - ${c.title}\n\nTopics: ${c.topics.join('; ')}\n\n#### Question\n\n${c.question}\n`;if(c.warnings.length)exportMD+='\n> **Assumptions and source notes**\n'+c.warnings.map(w=>'> - '+w.replaceAll('\n','\n> ')).join('\n')+'\n';exportMD+='\n#### Solution\n\n'+c.solution+'\n\n**Reference basis:** '+c.sources.map(s=>(s.doc==='rumi'?'Rumi':'KMS')+' PDF pp. '+s.pages.join(', ')).join('; ')+'.\n';if(c.checks.length)exportMD+='\n**Verification:**\n\n'+c.checks.map(x=>'- '+x).join('\n')+'\n';}}}
fs.writeFileSync('dist/CSE_309_Worked_Solutions.md',exportMD);
fs.mkdirSync('dist/vendor/mermaid/chunks/mermaid.esm.min',{recursive:true});
fs.copyFileSync('node_modules/mermaid/dist/mermaid.esm.min.mjs','dist/vendor/mermaid/mermaid.esm.min.mjs');
for(const f of fs.readdirSync('node_modules/mermaid/dist/chunks/mermaid.esm.min'))if(f.endsWith('.mjs'))fs.copyFileSync('node_modules/mermaid/dist/chunks/mermaid.esm.min/'+f,'dist/vendor/mermaid/chunks/mermaid.esm.min/'+f);
fs.mkdirSync('dist/vendor/katex',{recursive:true});fs.copyFileSync('node_modules/katex/dist/katex.min.css','dist/vendor/katex/katex.min.css');fs.cpSync('node_modules/katex/dist/fonts','dist/vendor/katex/fonts',{recursive:true});
fs.writeFileSync('dist/vendor/LICENSES.txt','Mermaid 11.4.1 (MIT), KaTeX 0.16.22 (MIT), and marked 15.0.12 (MIT). Bundled dependencies preserve their license notices.');
fs.copyFileSync('node_modules/katex/LICENSE','dist/vendor/katex/LICENSE');fs.copyFileSync('node_modules/mermaid/LICENSE','dist/vendor/mermaid/LICENSE');
fs.mkdirSync('dist/references',{recursive:true});
const source=process.env.ATLAS_REFERENCE_DIR ? path.resolve(process.env.ATLAS_REFERENCE_DIR)+path.sep : '../website/references/';
for(const [input,output]of [['Rumi Sir Merged(1).pdf','rumi.pdf'],['KMS Merged.pdf','kms.pdf'],['CSE 309 merged-1-30.pdf','exam-papers.pdf']])if(!fs.existsSync('dist/references/'+output)){const original=source+input;const portable='../website/references/'+output;fs.copyFileSync(fs.existsSync(original)?original:portable,'dist/references/'+output);}
const report={complete:!preview,cards:cards.length,yearCounts:Object.fromEntries(years.map(y=>[y,cards.filter(c=>c.year===y).length])),mainQuestions:new Set(cards.map(c=>c.year+'-'+c.main)).size,mermaidBlocks:cards.reduce((n,c)=>n+(c.question.match(/```mermaid/g)||[]).length+(c.solution.match(/```mermaid/g)||[]).length,0),mathErrors};
fs.writeFileSync('content/build-verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
if(mathErrors.length)process.exitCode=1;
