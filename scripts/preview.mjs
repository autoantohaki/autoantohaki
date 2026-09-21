// Local-only QA output; not part of the public profile.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const markdown=await readFile(resolve(root,'README.md'),'utf8');
const response=await fetch('https://api.github.com/markdown',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/vnd.github+json'},body:JSON.stringify({text:markdown,mode:'gfm'})});
if(!response.ok)throw Error(`GitHub Markdown renderer: ${response.status}`);
const html=await response.text();
if(!html.includes('<picture>')||!html.includes('<source'))throw Error('Theme-aware pictures were removed by the renderer.');
const cssResponse=await fetch('https://raw.githubusercontent.com/sindresorhus/github-markdown-css/main/github-markdown.css');
if(!cssResponse.ok)throw Error('Could not retrieve preview styles.');
const css=await cssResponse.text();
await mkdir(resolve(root,'.preview'),{recursive:true});
await writeFile(resolve(root,'.preview/github-rendered.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}\nbody{margin:0;padding:32px;background:#fff} .markdown-body{max-width:840px;margin:auto;padding:32px;border:1px solid #d1d9e0;border-radius:6px}h3 img{vertical-align:middle}p picture img{margin:0 4px 6px 0} @media(prefers-color-scheme:dark){body{background:#0d1117}.markdown-body{border-color:#3d444d}}@media(max-width:600px){body{padding:12px}.markdown-body{padding:16px}}</style><article class="markdown-body">${html.replaceAll('="assets/','="../assets/')}</article>`);
console.log('GitHub-rendered HTML saved to .preview/github-rendered.html');
