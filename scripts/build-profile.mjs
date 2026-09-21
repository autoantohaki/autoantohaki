import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = resolve(root, 'assets');
await mkdir(assets, {recursive:true});
const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const themes = {light:{ink:'#171717',muted:'#666666',line:'#d1d9e0'},dark:{ink:'#ededed',muted:'#999999',line:'#3d444d'}};
const groups = [
  ['Certifications', ['Lean Six Sigma · Black Belt','ISO 27001 · Lead Implementer','SOC 2','MITRE ATT&CK','Harvard · ML & AI / CS50','MIT · Prescriptive AI','IBM · AI & Cybersecurity','Google · Data Analytics','ITIL 4 · Foundation & Specialist']],
  ['Artificial intelligence', ['Harness construction','ReAct agents','LLMOps & observability','RAG pipelines','LLM-as-a-Judge','Multi-step reasoning','Prompt engineering','Self-hosted models']],
  ['Tech', ['Rust','Go','TypeScript','Python','C#','Java','C++','Azure','AWS','GCP']],
];
const stats = ['Framework author','Contributing · 12 years','Avg. contributions · 863/year','Avg. commits · 2.36/day'];
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const svg = (width,height,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">${body}</svg>\n`;
const picture = (file,alt,width,height) => `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${file}-dark.svg"><img src="assets/${file}-light.svg" alt="${escape(alt)}"${width?` width="${width}"`:''}${height?` height="${height}"`:''}></picture>`;
const pill = (label,index,prefix='pill') => picture(`${prefix}-${index}`,label,undefined,28);
const illustration = await readFile(resolve(assets,'source/phorminx-illustration.svg'),'utf8');
const wolf = await readFile(resolve(assets,'source/dispersal-wolves.svg'),'utf8');
for(const [theme,c] of Object.entries(themes)) {
  await writeFile(resolve(assets,`divider-${theme}.svg`),svg(840,1,`<path d="M0 .5H840" stroke="${c.line}"/>`));
  const art = illustration.replace(/<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replaceAll('currentColor',c.ink);
  await writeFile(resolve(assets,`header-${theme}.svg`),svg(840,200,`<title>Maurício — Less friction. More possibility.</title><g font-family="Arial,Helvetica,sans-serif"><rect x="1" y="12" width="36" height="36" fill="${c.ink}"/><text x="8" y="38" fill="${theme==='dark'?'#0d1117':'#ffffff'}" font-size="24">m.</text><text x="52" y="37" fill="${c.ink}" font-size="18">Maurício Antohaki</text><text x="0" y="108" fill="${c.ink}" font-size="43" letter-spacing="-2">Less friction.</text><text x="0" y="155" fill="${c.muted}" font-size="43" letter-spacing="-2">More possibility.</text></g><svg x="408" y="8" width="430" height="182" viewBox="0 0 560 250" fill="none" opacity=".8">${art}</svg>`));
  await writeFile(resolve(assets,`dispersal-wolves-${theme}.svg`),wolf.replace('fill="currentColor"',`fill="${c.ink}"`));
  const makePill = async (text,name) => {
    const width = Math.ceil(text.length*6.65+26);
    await writeFile(resolve(assets,`${name}-${theme}.svg`),svg(width,28,`<title>${escape(text)}</title><rect x=".5" y=".5" width="${width-1}" height="27" rx="13.5" fill="none" stroke="${c.line}"/><text x="13" y="18" fill="${c.ink}" font-size="11" font-family="monospace">${escape(text)}</text>`));
  };
  let i=0;for(const [,labels] of groups)for(const label of labels)await makePill(label,`pill-${i++}`);
  for(const [i,label] of stats.entries())await makePill(label,`stat-${i}`);
  for(const [name,label] of [['website','Website ↗'],['github','GitHub ↗'],['portfolio','Explore the portfolio ↗']])await makePill(label,name);
}
const action = (name,url,label) => `<a href="${url}">${picture(name,label,undefined,28)}</a>`;
const readme = `${picture('header','Maurício Antohaki — Less friction. More possibility. Voice-to-text illustration reused from antohaki.tech.',840)}

Leader · Architect · Polyglot

I like making complicated things usable. I build local AI tools, software that connects systems, and infrastructure people can run themselves. I lead the work and write the code.

${action('portfolio','https://antohaki.tech','Explore the portfolio')}

${picture('divider','',840,1)}

### 01 / Selected work

<h3><img src="assets/phorminx.svg" width="28" height="28" alt="">&nbsp; Phorminx</h3>

Speak, write, and find the thought again. Local dictation and meeting transcription, powered by your own computer.

${action('website','https://phorminx.net','Phorminx website')} ${action('github','https://github.com/impossibleG/phorminx','Phorminx repository')}

<h3><img src="assets/impossible-g.png" width="30" height="30" alt="">&nbsp; Impossible G</h3>

AI infrastructure you can own. Ready-made services for embeddings, documents, speech, and inference.

${action('website','https://www.impossibleg.org/','Impossible G website')} ${action('github','https://github.com/impossibleG','Impossible G repositories')}

<h3>${picture('dispersal-wolves','',42,22)}&nbsp; Dispersal Wolves</h3>

Ten defensive utilities for Linux hosts. Inspect the machine, understand its exposure, and keep the evidence readable.

${action('website','https://dispersalwolves.com/','Dispersal Wolves website')} ${action('github','https://github.com/dispersal-wolves','Dispersal Wolves repositories')}

${picture('divider','',840,1)}

### 02 / Foundations & tools

${(()=>{let index=0;return groups.map(([title,labels])=>`**${title}**\n\n<p>\n${labels.map(label=>pill(label,index++)).join('\n')}\n</p>`).join('\n\n');})()}

${picture('divider','',840,1)}

### 03 / Along the way

<!-- Existing profile activity figures retained; not recalculated live. The private framework name is intentionally omitted. -->
<p>
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
