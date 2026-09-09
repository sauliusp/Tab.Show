import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(DIR,'../../..');
const LEGACY=path.resolve(DIR,'../tabshow-install-2026-09');
const timeline=JSON.parse(await readFile(path.join(DIR,'source/timeline.json'),'utf8'));
const captions=JSON.parse(await readFile(path.join(DIR,'source/captions.json'),'utf8'));
const OUT=path.join(DIR,'output');
await mkdir(OUT,{recursive:true});
for(const w of [400,500,600,700,800])GlobalFonts.registerFromPath(path.join(LEGACY,`assets/fonts/Inter-${w}.ttf`),`InterVideo${w}`);
const W=1920,H=1080,FPS=60,DURATION=timeline.duration;
const C={paper:'#fffdf7',canvas:'#f7f3e9',ink:'#211d42',muted:'#5f5a72',orange:'#ec641d',amber:'#ff9a3d',rule:'#d8d1bf',green:'#20835b'};
const canvas=createCanvas(W,H),ctx=canvas.getContext('2d');
const images={};
for(const [key,file] of Object.entries({light:'marketing/source/cws-2.1-backgrounds/light.png',dark:'marketing/source/cws-2.1-backgrounds/dark.png',logo:'public/icon/128.png',preview:'marketing/source/appshots-2.1/01-preview.png'})) images[key]=await loadImage(path.join(ROOT,file));
const panelFiles={idle:'idle-current.png',hover:'hover-design.png',returned:'returned-current.png',committed:'committed-design.png',all:'idle-all-windows.png',search:'search-website.png',keyboard:'keyboard-website.png'};
for(const [key,file] of Object.entries(panelFiles)){
 images[key]=await loadImage(path.join(LEGACY,'assets/panels',file));
}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,t)=>a+(b-a)*t;
const local=(t,a,d=.7)=>ease((t-a)/d);
function rr(x,y,w,h,r,fill,stroke,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
function line(x,y,xx,yy,color,width=1){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function text(str,x,y,size=32,weight=500,color=C.ink,align='left',spacing=-.8){ctx.font=`${size}px InterVideo${Math.min(800,Math.max(400,Math.round(weight/100)*100))}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.letterSpacing=`${spacing}px`;ctx.fillText(str,x,y);ctx.letterSpacing='0px'}
function circle(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function shadow(fn,blur=35,alpha=.13){ctx.save();ctx.shadowColor=`rgba(33,29,66,${alpha})`;ctx.shadowBlur=blur;ctx.shadowOffsetY=16;fn();ctx.restore()}
function group(a,fn,dx=0,dy=0,s=1,cx=0,cy=0){ctx.save();ctx.globalAlpha*=clamp(a);ctx.translate(dx+cx,dy+cy);ctx.scale(s,s);ctx.translate(-cx,-cy);fn();ctx.restore()}
function cover(img,x,y,w,h){const z=Math.max(w/img.width,h/img.height);ctx.drawImage(img,x+(w-img.width*z)/2,y+(h-img.height*z)/2,img.width*z,img.height*z)}
function bg(dark=false){cover(images[dark?'dark':'light'],0,0,W,H);ctx.fillStyle=dark?'rgba(22,19,43,.12)':'rgba(247,243,233,.1)';ctx.fillRect(0,0,W,H)}
function brand(dark=false,x=88,y=62,size=54){ctx.drawImage(images.logo,x,y,size,size);text('TabShow',x+size+17,y+size*.75,size*.61,800,dark?C.paper:C.ink)}
function eyebrow(str,x=90,y=240,dark=false){line(x,y-6,x+48,y-6,C.orange,4);text(str,x+68,y,18,750,dark?C.paper:C.ink,'left',2.7)}
function pill(str,x,y,w,{dark=false,accent=false}={}){rr(x,y,w,46,14,dark?'rgba(255,253,247,.09)':'rgba(255,253,247,.82)',dark?'#625b7a':'#d8d1d0');circle(x+21,y+23,5,accent?C.orange:(dark?C.amber:C.ink));text(str,x+37,y+30,18,650,dark?C.paper:C.ink,'left',-.3)}
function footer(str,dark=false){circle(94,1009,4,C.orange);text(str,111,1017,19,600,dark?'#c7c0d8':'#726b84','left',-.3);text('tab.show',1828,1017,20,650,dark?C.paper:C.ink,'right',-.4)}
function copy(lines,sub,tag,t,start,{dark=false,y=355,size=83}={}){
 const p=local(t,start);group(p,()=>{eyebrow(tag,90,244,dark);lines.forEach((s,i)=>text(s[0],88,y+i*(size*1.04),size,800,s[1]?(dark?C.amber:C.orange):(dark?C.paper:C.ink),'left',-4));sub.forEach((s,i)=>text(s,91,y+lines.length*size*1.04+44+i*39,27,500,dark?'#d7d1e3':C.muted,'left',-.65));},0,(1-p)*24);
}
function cursor(x,y,t,click=-1,alpha=1){group(alpha,()=>{ctx.save();ctx.translate(x,y);ctx.shadowColor='rgba(0,0,0,.18)';ctx.shadowBlur=8;ctx.shadowOffsetY=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,33);ctx.lineTo(9,25);ctx.lineTo(16,41);ctx.lineTo(24,37);ctx.lineTo(16,22);ctx.lineTo(29,21);ctx.closePath();ctx.fillStyle=C.ink;ctx.fill();ctx.strokeStyle='#fffdf7';ctx.lineWidth=2.8;ctx.stroke();ctx.restore();if(click>=0){const p=(t-click)/.55;if(p>0&&p<1){ctx.globalAlpha*=1-p;ctx.beginPath();ctx.arc(x+4,y+5,12+p*34,0,Math.PI*2);ctx.strokeStyle=C.orange;ctx.lineWidth=3;ctx.stroke()}}})}
function docPage(x,y,w,h,title='Q3 launch plan'){
 rr(x,y,w,h,0,'#eeeef1');rr(x+22,y+22,w-44,h-44,10,'#fff');
 text('LAUNCH / Q3',x+58,y+68,12,700,'#92909d','left',1.7);
 text(title,x+56,y+126,Math.min(36,w/16),780,C.ink,'left',-1.1);
 text('The next chapter starts here.',x+58,y+164,17,450,C.muted,'left',-.3);
 line(x+58,y+197,x+w-58,y+197,'#e8e5eb');
 text('01  Make the value clear',x+58,y+246,21,720,C.ink);
 const widths=[.82,.95,.72];widths.forEach((v,i)=>rr(x+59,y+273+i*19,(w-116)*v,6,3,'#dcd8e1'));
 text('02  Show the product',x+58,y+388,21,720,C.ink);
 rr(x+58,y+414,w-116,122,9,'#f6f1e8');circle(x+83,y+446,5,C.orange);text('Preview. Decide. Stay in flow.',x+101,y+452,17,600,C.ink);
 rr(x+82,y+477,w-166,5,2,'#d8d1c5');rr(x+82,y+498,(w-166)*.72,5,2,'#d8d1c5');
 text('03  Ready for launch',x+58,y+596,21,720,C.ink);
 rr(x+59,y+622,(w-116)*.8,6,3,'#dcd8e1');rr(x+59,y+642,(w-116)*.63,6,3,'#dcd8e1');
}
function designPage(x,y,w,h,t){
 rr(x,y,w,h,0,'#eeedf3');
 text('TabShow / product design',x+27,y+43,16,650,C.muted,'left',-.3);
 const ww=w-80;shadow(()=>rr(x+40,y+98,ww,h-167,5,C.paper),14,.08);
 ctx.drawImage(images.logo,x+68,y+128,36,36);text('TabShow',x+116,y+153,19,780,C.ink);
 text('Less hunting.',x+70,y+235,Math.min(45,w/11),800,C.ink,'left',-2);
 text('More doing.',x+70,y+286,Math.min(45,w/11),800,C.orange,'left',-2);
 text('Your next tab, in plain sight.',x+73,y+325,16,450,C.muted,'left',-.3);
 rr(x+72,y+366,ww-64,68,12,C.ink);circle(x+98,y+400,9,C.amber);rr(x+123,y+389,ww-155,6,3,'#e7e1f2');rr(x+123,y+405,(ww-155)*.6,5,3,'#9890b2');
 rr(x+72,y+449,ww-64,68,12,'#ffddb0');circle(x+98,y+483,9,C.orange);rr(x+123,y+472,ww-155,6,3,'#805338');rr(x+123,y+488,(ww-155)*.6,5,3,'#b28660');
 text('HOVER. PREVIEW. FOCUS.',x+73,y+560,12,750,C.muted,'left',1.5);
}
function browserDemo(t,stage){
 const x=714,y=187,w=1118,h=790,bar=56;
 let open=stage==='commit'?1-local(t,17.05,.6):1;
 let current=stage==='hover'||stage==='commit'?'design':'doc';
 if(stage==='intro')current='doc';
 if(stage==='hover'&&t<8.25)current='doc';
 if(stage==='return'&&t<12.25)current='design';
 if(stage==='commit'&&t<16.25)current='doc';
 shadow(()=>rr(x,y,w,h,19,'#fff', '#d4ced6'),35,.19);
 ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,19);ctx.clip();
 rr(x,y,w,bar,0,'#eae7ee');circle(x+22,y+25,4,'#c6becd');circle(x+37,y+25,4,'#c6becd');circle(x+52,y+25,4,'#c6becd');
 rr(x+80,y+12,260,44,10,'#fff');circle(x+99,y+33,7,current==='doc'?'#4285f4':'#a259ff');text(current==='doc'?'Q3 launch plan':'TabShow product design',x+115,y+39,14,650,C.ink,'left',-.25);
 for(let i=0;i<9;i++){rr(x+352+i*65,y+14,57,30,8,'#ded9e5');circle(x+366+i*65,y+29,4,['#b9b0c8','#d0b485','#95afb2'][i%3])}
 const panelW=474*open;const mainW=w-panelW;
 ctx.save();ctx.beginPath();ctx.rect(x,y+bar,mainW,h-bar);ctx.clip();
 if(current==='doc')docPage(x,y+bar,mainW,h-bar);else designPage(x,y+bar,mainW,h-bar,t);ctx.restore();
 if(open>0.001){const state=current==='design'?'hover':stage==='return'?'returned':'idle';ctx.save();ctx.beginPath();ctx.rect(x+w-panelW,y+bar,panelW,h-bar);ctx.clip();ctx.drawImage(images[state],x+w-panelW,y+bar,474,734);ctx.restore();line(x+w-panelW,y+bar,x+w-panelW,y+h,'#d5cfdf',2);}
 ctx.restore();
 const px=x+w-474;
 // Cursor reaches the row, then leaves the side panel to restore the original tab.
 let cx=px+310,cy=y+bar+437;
 if(stage==='hover'){const p=smooth((t-7.8)/.45);cx=mix(px+310,px+262,p);cy=mix(y+bar+437,y+bar+334,p)}
 if(stage==='return'){const p=smooth((t-11.8)/.45);cx=mix(px+262,px-82,p);cy=mix(y+bar+334,y+bar+344,p)}
 if(stage==='commit'){const p=smooth((t-15.8)/.45);cx=mix(px-82,px+262,p);cy=mix(y+bar+344,y+bar+334,p)}
 if(stage!=='intro')cursor(cx,cy,t,stage==='commit'?17.02:-1,stage==='commit'?1-local(t,17.2,.5):1);
 if(stage==='hover'&&t>8.3){const p=local(t,8.3,.5);group(p,()=>pill('LIVE PREVIEW',x+22,y+h-68,203,{accent:true}),0,(1-p)*9)}
 if(stage==='return'&&t>12.3){const p=local(t,12.3,.5);group(p,()=>pill('BACK TO YOUR PAGE',x+22,y+h-68,270),0,(1-p)*9)}
 if(stage==='commit'&&t>17.4){const p=local(t,17.4,.5);group(p,()=>pill('THIS ONE. KEEP IT.',x+22,y+h-68,263,{accent:true}),0,(1-p)*9)}
}
function searchPanel(t,keyboard=false){
 const x=1035,y=180,w=703,h=790;const z=w/420;
 const p=local(t,20,.8);
 const opened=keyboard?local(t,29.35,.65):0;
 if(opened>0){group(opened,()=>{shadow(()=>rr(x,y,w,h,22,'#fff','#d6d0d9'),38,.18);ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,22);ctx.clip();rr(x,y,w,56,0,'#eae7ee');circle(x+27,y+28,8,'#4285f4');text('TabShow website copy',x+49,y+35,18,650,C.ink);docPage(x,y+56,w,h-56,'TabShow website copy');ctx.restore();pill('OPENED IN WINDOW 2',x+27,y+h-69,292,{accent:true})},0,(1-opened)*15);}
 group(p*(1-opened),()=>{
 shadow(()=>rr(x,y,w,h,22,'#fff','#d6d0d9'),38,.18);
 ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,22);ctx.clip();
 const state=keyboard?(t>=28.5?'keyboard':'search'):t<20.85?'idle':t<22.55?'all':'search';
 ctx.drawImage(images[state],x,y,w,650*z);
 // Text is animated only inside the existing native search input; screenshots retain the exact production layout.
 if(!keyboard&&t>=21.7&&t<22.55){const n=Math.floor(clamp((t-21.7)/.8)*7);rr(x+54*z,y+57*z,270*z,34*z,0,'#fff');text('website'.slice(0,n),x+57*z,y+81*z,14*z,400,'#4d4854','left',0);line(x+(59+n*7.5)*z,y+64*z,x+(59+n*7.5)*z,y+83*z,C.ink,1.5)}
 ctx.restore();
 if(!keyboard){cursor(x+273.3*z,y+30*z,t,20.85,1-local(t,21.3,.35));}
 },(1-p)*48+opened*55,0);
}
function key(str,x,y,w,on=false,dark=false){shadow(()=>rr(x,y,w,74,13,on?C.orange:(dark?'#35304e':C.paper),on?C.orange:(dark?'#6b647e':'#cfc7d6'),1.2),8,.06);text(str,x+w/2,y+48,str==='Enter'?25:32,650,on?'#fff':dark?C.paper:C.ink,'center',-.3)}

// A separate, speech-led cut. Brand graphics and authentic panel captures come from the original campaign.
const starts=timeline.scenes.map(s=>Math.max(0,s.start-.15));starts[0]=0;
const boundaries=[...starts,DURATION];
function caption(t){
 const c=captions.find(c=>t>=c.start&&t<c.end);if(!c)return;
 ctx.font='29px InterVideo500';const width=Math.min(1700,ctx.measureText(c.text).width+66);
 rr((W-width)/2,992,width,59,12,'rgba(25,22,43,.93)');
 text(c.text,W/2,1031,29,500,C.paper,'center',-.3);
}
function scene(t,i){
 const p=t-starts[i];const dark=i===5;bg(dark);brand(dark);
 text('LIVE TAB PREVIEW FOR CHROME',1828,100,16,700,dark?'#c2bad3':C.muted,'right',2.2);
 if(i===0){
  copy([['Full-page',false],['previews.',true],['Keep focus.',false]],[], 'SEE IT BEFORE YOU SWITCH',1,0,{y:365,size:78});
  browserDemo(9.5,'hover');
 }
 if(i===1){
  copy([['Hover.',false],['See it live.',true]],['The real page,','at full size.'],'01 / PREVIEW',1,0,{size:80,y:390});
  browserDemo(7.95+p,'hover');
 }
 if(i===2){
  copy([['Move away.',false],["You’re back.",true]],['Your original page','returns.'],'02 / RETURN',1,0,{size:76,y:390});
  browserDemo(12+p,'return');
 }
 if(i===3){
  copy([['Found it?',false],['Click to stay.',true]],['Open the right tab.','Keep going.'],'03 / CHOOSE',1,0,{size:74,y:390});
  browserDemo(16+p,'commit');
 }
 if(i===4){
  const useStart=captions.find(c=>c.text==='Use the arrow keys.').start;
  const windowsStart=captions.find(c=>c.text.startsWith('Find tabs across')).start;
  const keyboard=t>=useStart;
  copy([['Find it.',false],['Across windows.',true]],['Search titles and websites.','Arrow keys to select.'],'WHEN YOU NEED ANOTHER TAB',1,0,{size:72,y:365});
  // Keep the actual all-windows results legible; selection waits for Enter.
  searchPanel(keyboard?28.8:22.7,keyboard);
  if(t>=windowsStart){pill('Same Chrome profile',93,687,342,{accent:true});text('Work and Personal profiles stay separate.',93,777,26,500,C.muted,'left',-.6)}
  else {key('↑',93,690,83);key('↓',193,690,83,keyboard);key('Enter',293,690,151);}
 }
 if(i===5){
  eyebrow('LIGHTWEIGHT BY DESIGN',92,241,true);
  text('Free to use.',88,408,116,800,C.paper,'left',-5);
  text('Built for focus.',88,548,116,800,C.amber,'left',-5);
  text('No account. No tracking.',94,650,35,500,'#d7d1e3','left',-.5);
  ctx.drawImage(images.logo,1450,323,210,210);text('TabShow',1555,601,43,800,C.paper,'center',-1.5);
 }
 if(i===6){
  eyebrow('TABSHOW FOR CHROME',93,249);
  text('Find the right tab.',86,403,101,800,C.ink,'left',-5);
  text('Keep your flow.',86,523,101,800,C.orange,'left',-5);
  text('Full-page live preview. One quick decision.',93,610,30,500,C.muted,'left',-.6);
  shadow(()=>rr(93,697,340,80,14,C.ink),18,.12);text('Add to Chrome',124,746,29,700,C.paper);text('↗',397,747,31,500,C.amber,'center');
  text('tab.show',93,850,38,750,C.ink,'left',-1);
  const x=1360,y=167,w=430;shadow(()=>rr(x,y,w,780,20,'#fff','#cec6d1'),28,.16);ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,780,20);ctx.clip();ctx.drawImage(images.preview,x,y,w,w*800/420);ctx.restore();
 }
}
function draw(t){ctx.resetTransform();ctx.globalAlpha=1;ctx.clearRect(0,0,W,H);let i=0;for(let n=0;n<starts.length;n++)if(t>=starts[n])i=n;scene(t,i);caption(t);}
async function posters(){
 draw(1.25);await writeFile(path.join(OUT,'TabShow-Poster-1920x1080.png'),await canvas.encode('png'));
 const thumb=createCanvas(1280,720);thumb.getContext('2d').drawImage(canvas,0,0,1280,720);await writeFile(path.join(OUT,'TabShow-Thumbnail-1280x720.jpg'),await thumb.encode('jpeg',94));
}
await posters();
if((process.argv[2]??'stills')==='stills'){
 const times=[0,1.5,starts[1]+1.4,starts[2]+1.1,starts[3]+1.9,starts[4]+1,starts[4]+4.8,starts[5]+1,starts[6]+1,DURATION-.05];
 for(let i=0;i<times.length;i++){draw(times[i]);await writeFile(path.join(DIR,'qa',`frame-${i}.jpg`),await canvas.encode('jpeg',91))}
 const sheet=createCanvas(1920,1080);const sc=sheet.getContext('2d');for(let i=0;i<times.length;i++){draw(times[i]);sc.drawImage(canvas,(i%3)*640,Math.floor(i/3)*270,480,270)}
 // A consistent 3-column sheet with all ten frames.
 const contact=createCanvas(1440,1080);const cc=contact.getContext('2d');cc.fillStyle=C.canvas;cc.fillRect(0,0,1440,1080);
 for(let i=0;i<times.length;i++){draw(times[i]);cc.drawImage(canvas,(i%3)*480,Math.floor(i/3)*270,480,270)}
 await writeFile(path.join(DIR,'qa/contact-sheet.jpg'),await contact.encode('jpeg',92));console.log('Stills ready');
}else{
 const file=path.join(OUT,'TabShow-Focus-30s-silent.mp4');
 const ffmpeg=process.env.FFMPEG_PATH || 'ffmpeg';
 const probe=spawnSync(ffmpeg,['-version'],{stdio:'ignore'});
 if(probe.error || probe.status!==0)throw new Error('FFmpeg is unavailable. Install it on PATH or set FFMPEG_PATH to its executable.');
 const ff=spawn(ffmpeg,['-y','-v','error','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',file],{stdio:['pipe','inherit','inherit']});
 const done=once(ff,'exit');for(let f=0;f<Math.round(DURATION*FPS);f++){draw(f/FPS);if(!ff.stdin.write(canvas.data()))await once(ff.stdin,'drain');if(f%300===0)console.log(`Rendered ${(f/FPS).toFixed(0)} / ${DURATION}s`)}ff.stdin.end();const [code]=await done;if(code!==0)throw new Error(`ffmpeg ${code}`);console.log(file);
}
