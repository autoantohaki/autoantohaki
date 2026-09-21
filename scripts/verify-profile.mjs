import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const readme=await readFile(resolve(root,'README.md'),'utf8');
const files=[...readme.matchAll(/(?:src|srcset)="(assets\/[^" ]+)"/g)].map(m=>m[1]);
for(const file of files)await access(resolve(root,file));
assert.equal((readme.match(/<picture>/g)||[]).length,(readme.match(/<\/picture>/g)||[]).length);
assert.equal((readme.match(/<a href=/g)||[]).length,7);
for(const url of ['https://phorminx.net','https://github.com/impossibleG/phorminx','https://www.impossibleg.org/','https://github.com/impossibleG','https://dispersalwolves.com/','https://github.com/dispersal-wolves','https://antohaki.tech'])assert.ok(readme.includes(`href="${url}"`),url);
assert.ok(!/Kaiken|tokyo.?night|github-readme-activity-graph/i.test(readme));
for(const theme of ['light','dark']) {
  const header=await readFile(resolve(root,`assets/header-${theme}.svg`),'utf8');
  const original=await readFile(resolve(root,'assets/source/phorminx-illustration.svg'),'utf8');
  const geometry=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(geometry(header),geometry(original),'Existing illustration geometry must remain unchanged');
  assert.ok(!/<script|<foreignObject|https?:\/\/(?!www.w3.org)/.test(header));
}
console.log(`Verified ${files.length} local image references, both themes, project links, and unchanged illustration paths.`);
