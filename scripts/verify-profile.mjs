import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const readme=await readFile(resolve(root,'README.md'),'utf8');
const files=[...readme.matchAll(/(?:src|srcset)="(assets\/[^" ]+)"/g)].map(m=>m[1]);
for(const file of files)await access(resolve(root,file));
assert.equal((readme.match(/<picture>/g)||[]).length,(readme.match(/<\/picture>/g)||[]).length);
assert.equal((readme.match(/<a href=/g)||[]).length,13);
for(const url of ['https://phorminx.net','https://github.com/impossibleG/phorminx','https://www.impossibleg.org/','https://github.com/impossibleG','https://dispersalwolves.com/','https://github.com/dispersal-wolves','https://antohaki.tech'])assert.ok(readme.includes(`href="${url}"`),url);
assert.ok(!/Kaiken|tokyo.?night|github-readme-activity-graph/i.test(readme));
assert.ok(readme.includes('Leave room for the next idea.'));
assert.ok(!/<table|<tr|<td/.test(readme),'Selected work must not use a table');
assert.equal((readme.match(/srcset="assets\/empty.svg" width="0" height="0"/g)||[]).length,18);
for(let i=0;i<4;i++)assert.ok(readme.includes(`assets/category-${i}-dark.svg`));
for(const description of [
  'Speak, write, and find the thought again. Local dictation and meeting transcription, powered by your own computer.',
  'AI infrastructure you can own. Ready-made services for embeddings, documents, speech, and inference.',
  'Ten defensive utilities for Linux hosts. Inspect the machine, understand its exposure, and keep the evidence readable.',
])assert.ok(readme.includes(description),'Project descriptions must stay unchanged');
for(const theme of ['light','dark']) {
  for(const project of ['phorminx','impossible-g','dispersal-wolves']) {
    const panel=await readFile(resolve(root,`assets/work-${project}-panel-${theme}.svg`),'utf8');
    assert.ok(!panel.includes('<rect x="0"'),'No enclosing project frame');
    for(const kind of ['github','website']) {
      const button=await readFile(resolve(root,`assets/work-${project}-${kind}-${theme}.svg`),'utf8');
      assert.ok(button.includes('rx="6"'),'Project actions use rounded rectangles, not pills');
      assert.ok(button.includes(kind==='github'?'fill="none"':`fill="${theme==='dark'?'#ededed':'#171717'}"`));
    }
  }
  const header=await readFile(resolve(root,`assets/header-${theme}.svg`),'utf8');
  const original=await readFile(resolve(root,'assets/source/phorminx-illustration.svg'),'utf8');
  const geometry=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(geometry(header),geometry(original),'Existing illustration geometry must remain unchanged');
  assert.ok(!/<script|<foreignObject|https?:\/\/(?!www.w3.org)/.test(header));
}
console.log(`Verified ${files.length} local image references, both themes, project links, and unchanged illustration paths.`);
