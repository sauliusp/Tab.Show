import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));const out=path.join(dir,'output');
const md=await readFile(path.join(dir,'youtube-draft.md'),'utf8');
const blocks=[...md.matchAll(/```text\n([\s\S]*?)\n```/g)].map(x=>x[1]);
const [title,description,tags]=blocks;
let publication={};try{publication=JSON.parse(await readFile(path.join(dir,'publication.json'),'utf8'));}catch{}
const cues=[
[0,4.65,'[Instrumental music]\n[On-screen text] Too many tabs. One right page.'],
[4.8,7.9,'[On-screen text] See the page. Keep your place.\nYour tabs, right beside the page you’re using.'],
[8,11.9,'[On-screen text] Hover. See it live.\nPoint at a tab to preview the page in your window.'],
[12,15.9,'[On-screen text] Move away. You’re back.\nLeave the side panel. Your original page returns.'],
[16,19.9,'[On-screen text] Found it? Click to keep.\nOpen the tab you want. Get straight back to work.'],
[20,23.9,'[On-screen text] Every window. One search.\nFind an open tab by title, URL, or domain.'],
[24,27.4,'[On-screen text] Search all Chrome windows.\nTabs in another window open when you choose them.'],
[27.5,30.4,'[On-screen text] Find it. Open it.\nUse the arrow keys to select. Press Enter to open.'],
[30.5,33.9,'[On-screen text] Opened in window 2.\nKeyboard selection waits for Enter. Hover still previews.'],
[34,36.5,'[On-screen text] Less friction. More focus.\nFree to use. No account to create.'],
[36.6,39.9,'[On-screen text] No tracking. No ads or extension analytics.\nTab information stays local.'],
[40,43.2,'[On-screen text] TabShow. Find the right tab. Keep your flow.\nLive tab preview for Chrome.'],
[43.3,48,'[On-screen text] Add to Chrome.\nFree. No account. No tracking. tab.show']];
const ts=s=>{let ms=Math.round(s*1000);const h=Math.floor(ms/3600000);ms%=3600000;const m=Math.floor(ms/60000);ms%=60000;const ss=Math.floor(ms/1000);ms%=1000;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')},${String(ms).padStart(3,'0')}`};
const srt=cues.map(([a,b,c],i)=>`${i+1}\n${ts(a)} --> ${ts(b)}\n${c}\n`).join('\n');
await writeFile(path.join(out,'TabShow-English.srt'),srt);
await writeFile(path.join(out,'TabShow-English.vtt'),'WEBVTT\n\n'+srt.replace(/(\d\d:\d\d:\d\d),(\d{3})/g,'$1.$2'));
await writeFile(path.join(out,'YouTube-Title.txt'),title+'\n');
await writeFile(path.join(out,'YouTube-Description.txt'),description+'\n');
await writeFile(path.join(out,'YouTube-Tags.txt'),tags+'\n');
await writeFile(path.join(out,'TabShow-Transcript.txt'),title+'\n\n48-second music-only product animation. The text below describes the visible words; there is no spoken narration. The side panel is the production TabShow 2.1 interface with example tabs. Surrounding browser/page content is an illustrative animation of the verified workflow.\n\n'+cues.map(([a,b,c])=>`${ts(a).slice(3,8)}–${ts(b).slice(3,8)}\n${c}`).join('\n\n')+'\n');
await writeFile(path.join(out,'YouTube-Metadata.json'),JSON.stringify({title,description,tags:tags.split(', '),defaultLanguage:'en',categoryId:'28',madeForKids:false,embeddable:true,license:'youtube',suggestedVisibility:'public',publishStatus:'not_uploaded',durationSeconds:48,chapters:[{start:0,title:'Preview Chrome tabs before you switch'},{start:20,title:'Search tabs across Chrome windows'},{start:34,title:'Free and private tab preview'}],captions:{file:'TabShow-English.srt',language:'en',kind:'on-screen text and music description'},thumbnail:'TabShow-YouTube-Thumbnail-1280x720.jpg',...publication},null,2)+'\n');
console.log(JSON.stringify({titleCharacters:title.length,descriptionCharacters:description.length,cues:cues.length,lastCaptionEnd:cues.at(-1)[1]}));
