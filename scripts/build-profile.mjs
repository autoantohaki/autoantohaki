import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = resolve(root, 'assets');
await mkdir(assets, {recursive:true});
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const themes = {light:{ink:'#171717',muted:'#666666',line:'#a7adb4'},dark:{ink:'#ededed',muted:'#999999',line:'#626870'}};
const groups = [
  ['Certifications', ['Lean Six Sigma · Black Belt','ISO 27001 · Lead Implementer','SOC 2','MITRE ATT&CK','Harvard · ML & AI / CS50','MIT · Prescriptive AI','IBM · AI & Cybersecurity','Google · Data Analytics','ITIL 4 · Foundation & Specialist']],
  ['Artificial intelligence', ['Harness construction','ReAct agents','LLMOps & observability','RAG pipelines','LLM-as-a-Judge','Multi-step reasoning','Prompt engineering','Self-hosted models']],
  ['Tech', ['Rust','Go','TypeScript','Python','C#','Java','C++','Azure','AWS','GCP']],
];
const stats = ['Framework author','Contributing · 12 years','Avg. contributions · 863/year','Avg. commits · 2.36/day'];
const svg = (width,height,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">${body}</svg>\n`;
const picture = (file,alt,width,height) => `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${file}-dark.svg"><img src="assets/${file}-light.svg" alt="${escape(alt)}"${width?` width="${width}"`:''}${height?` height="${height}"`:''}></picture>`;
const pill = (label,index,prefix='pill') => picture(`${prefix}-${index}`,label,undefined,28);
const illustration = await readFile(resolve(assets,'source/aperture-signed.svg'),'utf8');
const wolf = await readFile(resolve(assets,'source/dispersal-wolves.svg'),'utf8');
const phorminx = await readFile(resolve(assets,'phorminx.svg'),'utf8');
const impossibleG = (await readFile(resolve(assets,'impossible-g.png'))).toString('base64');
const projects = [
  {id:'phorminx',name:'Phorminx',website:'https://phorminx.net',github:'https://github.com/impossibleG/phorminx',lines:['Speak, write, and find the thought','again. Local dictation and meeting','transcription, powered by your','own computer.']},
  {id:'impossible-g',name:'Impossible G',website:'https://www.impossibleg.org/',github:'https://github.com/impossibleG',lines:['AI infrastructure you can own.','Ready-made services for embeddings,','documents, speech, and inference.']},
  {id:'dispersal-wolves',name:'Dispersal Wolves',website:'https://dispersalwolves.com/',github:'https://github.com/dispersal-wolves',lines:['Ten defensive utilities for Linux','hosts. Inspect the machine,','understand its exposure, and keep','the evidence readable.']},
];
const innerSvg = source => source.replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
// The source dimensions collapse the inactive layout without custom README CSS.
await writeFile(resolve(assets,'empty.svg'),svg(0,0,''));
for(const [theme,c] of Object.entries(themes)) {
  await writeFile(resolve(assets,`divider-${theme}.svg`),svg(840,1,`<path d="M0 .5H840" stroke="${c.line}"/>`));
  const art = illustration.replace(/<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replaceAll('currentColor',c.ink);
  await writeFile(resolve(assets,`header-${theme}.svg`),svg(840,200,`<title>Maurício — Leave room for the next idea.</title><g font-family="Arial,Helvetica,sans-serif"><rect x="1" y="12" width="36" height="36" fill="${c.ink}"/><text x="8" y="38" fill="${theme==='dark'?'#0d1117':'#ffffff'}" font-size="24">m.</text><text x="52" y="37" fill="${c.ink}" font-size="18">Maurício Antohaki</text><text x="0" y="108" fill="${c.ink}" font-size="43" letter-spacing="-2">Leave room for</text><text x="0" y="155" fill="${c.muted}" font-size="43" letter-spacing="-2">the next idea.</text></g><svg x="402" y="0" width="438" height="200" viewBox="0 0 560 260">${art}</svg>`));
  await writeFile(resolve(assets,`dispersal-wolves-${theme}.svg`),wolf.replace('fill="currentColor"',`fill="${c.ink}"`));
  for(const project of projects) {
    const mark = project.id==='phorminx'
      ? `<svg x="14" y="12" width="28" height="28" viewBox="0 0 48 48">${innerSvg(phorminx)}</svg>`
      : project.id==='impossible-g'
        ? `<image x="14" y="12" width="28" height="28" href="data:image/png;base64,${impossibleG}"/>`
        : `<svg x="10" y="14" width="36" height="24" viewBox="0 0 1471 702">${innerSvg(wolf).replaceAll('currentColor',c.ink)}</svg>`;
    const copy = project.lines.map((line,i)=>`<text x="14" y="70" dy="${i*22}" fill="${c.ink}" font-family="Arial,Helvetica,sans-serif" font-size="13">${escape(line)}</text>`).join('');
    await writeFile(resolve(assets,`work-${project.id}-panel-${theme}.svg`),svg(260,170,`<title>${escape(project.name)}</title><desc>${escape(project.lines.join(' '))}</desc>${mark}<text x="52" y="33" fill="${c.ink}" font-family="Arial,Helvetica,sans-serif" font-size="19" font-weight="600">${escape(project.name)}</text>${copy}`).replace('role="img"','role="img" preserveAspectRatio="xMinYMin meet"'));
    for(const kind of ['github','website']) {
      const solid=kind==='website';
      const label=solid?'Visit website':'GitHub';
      await writeFile(resolve(assets,`work-${project.id}-${kind}-${theme}.svg`),svg(260,solid?68:48,`<title>${escape(project.name)} — ${label}</title><rect x="14.5" y="4.5" width="231" height="35" rx="6" fill="${solid?c.ink:'none'}" stroke="${solid?c.ink:c.line}"/><g fill="${solid?(theme==='dark'?'#000000':'#ffffff'):c.ink}" font-family="Arial,Helvetica,sans-serif" font-size="13"><text x="28" y="27">${label}</text><text x="220" y="27">↗</text></g>`).replace('role="img"','role="img" preserveAspectRatio="xMinYMin meet"'));
    }
  }
  const makePill = async (text,name,solid=false) => {
    const width = Math.ceil(text.length*6.65+26);
    await writeFile(resolve(assets,`${name}-${theme}.svg`),svg(width,28,`<title>${escape(text)}</title><rect x=".5" y=".5" width="${width-1}" height="27" rx="13.5" fill="${solid?c.ink:'none'}" stroke="${solid?c.ink:c.line}"/><text x="13" y="18" fill="${solid?(theme==='dark'?'#000000':'#ffffff'):c.ink}" font-size="11" font-family="monospace">${escape(text)}</text>`));
  };
  let i=0;for(const [,labels] of groups)for(const label of labels)await makePill(label,`pill-${i++}`);
  for(const [i,label] of stats.entries())await makePill(label,`stat-${i}`);
  for(const [i,title] of [...groups.map(g=>g[0]),'Along the way'].entries())await makePill(title,`category-${i}`,true);
  for(const [name,label] of [['website','Website ↗'],['github','GitHub ↗'],['portfolio','Explore the portfolio ↗']])await makePill(label,name,name!=='github');
}
const action = (name,url,label) => `<a href="${url}">${picture(name,label,undefined,28)}</a>`;
const projectPart = (project,kind,layout) => {
  const file=`work-${project.id}-${kind}`;
  const alt=kind==='panel'?`${project.name}. ${project.lines.join(' ')}`:`${project.name} ${kind==='github'?'GitHub':'website'}`;
  const inactive=layout==='desktop'?'(max-width: 1199px)':'(min-width: 1200px)';
  const dimensions=layout==='desktop'?'width="32%"':`width="100%" height="${kind==='panel'?170:kind==='github'?48:68}"`;
  const image=`<picture><source media="${inactive}" srcset="assets/empty.svg" width="0" height="0"><source media="(prefers-color-scheme: dark)" srcset="assets/${file}-dark.svg"><img src="assets/${file}-light.svg" ${dimensions} alt="${escape(alt)}"></picture>`;
  return kind==='panel'?image:`<a href="${project[kind]}">${image}</a>`;
};
// Desktop: three panels, then three GitHub links, then three website links.
// Narrow screens: each panel is followed immediately by its own two links.
const selectedWork = ['panel','github','website'].flatMap(kind=>projects.map(p=>projectPart(p,kind,'desktop'))).join('')
  +projects.flatMap(p=>['panel','github','website'].map(kind=>projectPart(p,kind,'mobile'))).join('');
const readme = `${picture('header','Maurício Antohaki — Leave room for the next idea. Aperture, signed: architectural wave engraving with an m. in a square opening.',840)}

Leader · Architect · Polyglot

I like making complicated things usable. I build local AI tools, software that connects systems, and infrastructure people can run themselves. I lead the work and write the code.

${action('portfolio','https://antohaki.tech','Explore the portfolio')}

${picture('divider','',840,1)}

### 01 / Selected work

<p>${selectedWork}</p>

${picture('divider','',840,1)}

### 02 / Foundations & tools

<!-- Existing profile activity figures retained; not recalculated live. The private framework name is intentionally omitted. -->
<p>
${(()=>{let index=0;return groups.map(([title,labels],groupIndex)=>`${picture(`category-${groupIndex}`,title,undefined,28)}\n${labels.map(label=>pill(label,index++)).join('\n')}`).join('\n');})()}
${picture('category-3','Along the way',undefined,28)}
${stats.map((s,i)=>pill(s,i,'stat')).join('\n')}
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-streak-stats.herokuapp.com/?user=autoantohaki&amp;hide_border=true&amp;background=FFFFFF00&amp;stroke=444444&amp;ring=999999&amp;fire=999999&amp;currStreakNum=EDEDED&amp;sideNums=EDEDED&amp;currStreakLabel=999999&amp;sideLabels=999999&amp;dates=999999">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=autoantohaki&amp;hide_border=true&amp;background=FFFFFF00&amp;stroke=D1D9E0&amp;ring=666666&amp;fire=666666&amp;currStreakNum=171717&amp;sideNums=171717&amp;currStreakLabel=666666&amp;sideLabels=666666&amp;dates=666666" width="380" alt="Public GitHub contributions and contribution streaks">
</picture>

<sub>[Explore the work](https://antohaki.tech) · [Start a conversation](https://antohaki.tech/#contact)</sub>
`;
// No delayed reveal: the small statistics card should be readable immediately.
await writeFile(resolve(root,'README.md'),readme.replaceAll('hide_border=true&amp;background', 'hide_border=true&amp;disable_animations=true&amp;background'));
console.log('Generated transparent light/dark profile assets and README.');
