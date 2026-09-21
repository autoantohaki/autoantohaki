// Optional visual QA: requires @playwright/test and its Chromium browser.
// Changes only a disposable browser's DOM, never the live GitHub repository.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const preview=await readFile(resolve(root,'.preview/github-rendered.html'),'utf8');
const markup=preview.match(/<article class="markdown-body">([\s\S]*)<\/article>/)[1]
  .replaceAll('../assets/','https://github.com/__profile-preview-assets__/');
const browser=await chromium.launch();
try {
  const page=await browser.newPage();
  await page.route('**/__profile-preview-assets__/**',async route=>{
    const name=basename(new URL(route.request().url()).pathname);
    await route.fulfill({body:await readFile(resolve(root,'assets',name)),contentType:name.endsWith('.png')?'image/png':'image/svg+xml'});
  });
  await page.goto('https://github.com/autoantohaki',{waitUntil:'networkidle'});
  await page.locator('.markdown-body').evaluate((el,html)=>{el.innerHTML=html;},markup);
  for(const theme of ['light','dark'])for(const width of [320,390,768,1199,1200,1400]) {
    await page.setViewportSize({width,height:1100});
    await page.emulateMedia({colorScheme:theme});
    await page.evaluate(theme=>document.documentElement.setAttribute('data-color-mode',theme),theme);
    await page.waitForFunction(()=>[...document.querySelectorAll('.markdown-body img')].every(i=>i.complete));
    await page.waitForTimeout(250);
    const panels=await page.locator('.markdown-body img[src*="work-"]').evaluateAll(images=>images.map(i=>{
      const r=i.getBoundingClientRect();return {alt:i.alt,x:r.x,y:r.y,w:r.width,h:r.height,src:i.currentSrc,href:i.closest('a')?.href};
    }).filter(i=>i.w>0&&i.h>0));
    assert.equal(panels.length,9,`${theme}/${width}: exactly nine active panels`);
    assert.ok(panels.every(p=>p.src.endsWith(`-${theme}.svg`)),`${theme}/${width}: theme`);
    if(width>=1200) {
      for(let row=0;row<3;row++)assert.ok(Math.max(...panels.slice(row*3,row*3+3).map(p=>p.y))-Math.min(...panels.slice(row*3,row*3+3).map(p=>p.y))<1,'Three panels per desktop row');
    }else{
      for(let i=1;i<9;i++)assert.ok(panels[i].y>=panels[i-1].y+panels[i-1].h-1,'Mobile rows stay sequential');
      for(let i=0;i<3;i++) {
        assert.ok(panels[i*3+1].alt.endsWith('GitHub'));
        assert.ok(panels[i*3+2].alt.endsWith('website'));
      }
    }
    const overflow=await page.locator('.markdown-body').evaluate(el=>el.scrollWidth>el.clientWidth+1);
    assert.equal(overflow,false,`${theme}/${width}: no README overflow`);
    assert.ok(panels.filter(p=>p.href).length===6,'Six actionable buttons');
    if([390,1400].includes(width))await page.locator('.markdown-body').screenshot({path:resolve(root,`.preview/github-panels-${theme}-${width}.png`)});
    console.log(`PASS ${theme} ${width}px: 9 panels, 6 links, correct order/theme, no overflow`);
  }
}finally{await browser.close();}
