/* PDF / PPT / ලකුණු කොළ (මුල් ගොනුවේ කේතය, Firebase සඳහා සුළු වෙනස්කම් සහිතව) */
/* ===== PDF සැදීම (cover page + ප්‍රමිති + අවශ්‍යතා + සාමාජිකයන් + සාක්ෂි + footer) ===== */
let pUrls=[],IMGD={};
const PU=b=>{const u=URL.createObjectURL(b);pUrls.push(u);return u};
const fdate=s=>{const p=(s||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:''};
const fico=i=>/pdf/i.test(i.type)?'📕':/sheet|excel|csv/i.test(i.type)?'📊':/word|document/i.test(i.type)?'📝':i.kind==='vid'?'🎬':'📄';
function areaStat(a){
 const rows=[];CRIT[a.n].forEach((t,i)=>{const k=a.n+'.'+(i+1),ind=IND[k],us=ind?(hasLegacy(k)?[{u:k}]:[]).concat(ind.map(x=>({u:x.id,img:x.img,w:x.w,h:x.h,tx:x.txt?((x.lab||'')+' '+x.txt).trim():''}))):[{u:k}];
  us.forEach(un=>{const l=getP(un.u);l.forEach((pk,j)=>{const list=items.filter(x=>x.pk===pk).sort((x,y)=>(x.slot||0)-(y.slot||0)),inf=INFO[pk]||{};
   if((un.img||un.tx)&&!list.length&&!(inf.t||'').trim()&&!inf.d)return;
   rows.push({k:un.u,ck:k,ct:t,t:un.tx||t,tx:un.tx||'',img:un.img||'',iw:un.w,ih:un.h,pl:l.length>1?'වැඩසටහන '+(j+1):'',inf,list})})})});
 return{rows,nc:CRIT[a.n].length,done:new Set(rows.filter(r=>r.list.length).map(r=>r.ck)).size,files:rows.reduce((n,r)=>n+r.list.length,0),ms:mems.filter(m=>m.area===a.n).sort((x,y)=>x.ts-y.ts)}}
function schSize(n){return n<=28?19:n<=42?16:n<=60?13.5:11.5}
function coverHTML(o){
 const n=(o.sn||'').length;
 return `<div class="pp-cover" style="--c:${o.c};--c2:${o.c2}"><img class="pp-bg" src="${COVER_IMG}" alt="">`+
 `<div class="pp-panel"><div class="pp-top">පාසල් අධ්‍යාපනයේ ගුණාත්මක තහවුරු කිරීම</div>${o.badge?`<div class="pp-badge">${o.badge}</div>`:''}<div class="pp-ic">${o.ic}</div><div class="pp-ct">${o.title}</div><div class="pp-line"></div><div class="pp-sub2">${o.sub}</div>${o.extra||''}</div>`+
 `<div class="pp-logo${LOGO?'':' e'}">${LOGO?`<img src="${LOGO}" alt="">`:''}</div><div class="pp-pill"><div class="pp-sch" style="font-size:${schSize(n*1.25)}pt">${o.sn}</div><div class="pp-yr">${o.yr} වර්ෂය &nbsp;·&nbsp; සකස් කළ දිනය: ${o.td}</div></div></div>`}
const footHTML=(sn,label)=>`<div class="pfoot"><div>${sn} · ${label}</div><div class="pf2">Created by <b style="color:#276CF5">NEXORA</b> <b style="color:#09B041">TECHNOLOGIES</b> — Building the Future, Digitally &nbsp;|&nbsp; WhatsApp 0706562952 · Phone 0716562952 · sudanchamalka@gmail.com</div></div>`;
const wrapT=(h,f)=>`<table class="pp-t"><tbody><tr><td>${h}</td></tr></tbody><tfoot><tr><td>${f}</td></tr></tfoot></table>`;
function areaPDF(a,sn,td,yr){
 const st=areaStat(a),cv=`--c:${a.c};--c2:${a.c2}`;
 const cover=coverHTML({c:a.c,c2:a.c2,badge:'ඇගයීම් ක්ෂේත්‍රය '+a.n,ic:a.ic,title:esc(a.name),sub:'ප්‍රමිති සාක්ෂි ගොනුව',sn,yr,td,
  extra:(st.ms.length?`<div class="pp-team"><b>සාමාජිකයන්:</b> ${st.ms.map(m=>esc(m.name)).join(' · ')}</div>`:'')+`<div class="pp-meta">නිර්ණායක ${st.nc} ක් · සාක්ෂි සහිත ${st.done} ක් · ගොනු ${st.files} ක්</div>`});
 const mem=st.ms.length?`<div class="pp-mems">${st.ms.map(m=>`<div class="pp-mem"><div class="pp-av">${m.blob?`<img src="${PU(m.blob)}" alt="">`:esc((m.name||'').trim().charAt(0))}</div><b>${esc(m.name)}</b><small>${esc(m.role)}</small></div>`).join('')}</div>`:'<div class="pp-none">සාමාජිකයින් එක් කර නැත</div>';
 let lastCk='';const crit=st.rows.map(r=>{
  const d=fdate(r.inf.d),t=(r.inf.t||'').trim();
  const figs=r.list.map(i=>{const cap=esc(i.cap||'');return i.kind==='img'?`<figure class="pp-fig"><img src="${IMGD[i.id]||(i.blob?PU(i.blob):esc(i.url))}" alt=""><figcaption>${cap}</figcaption></figure>`:`<figure class="pp-fig"><div class="pp-fl">${fico(i)}</div><figcaption>${cap}${cap?' · ':''}${esc(i.name)}</figcaption></figure>`}).join('');
  const hd=((r.img||r.tx)&&r.ck!==lastCk)?`<div class="pp-h">${r.ck}. ${esc(r.ct)}</div>`:'';lastCk=r.ck;
  return `${hd}<div class="pp-crit"><div class="pp-ch"><span class="pp-kn">${r.k}</span><span>${r.img?`<img class="pp-timg" src="${r.img}" alt="">`:esc(r.t)}${r.pl?' – '+r.pl:''}</span></div><div class="pp-info"><div><b>📅 දිනය:</b> ${d||'—'}</div><div><b>📝 වැඩසටහන / සිද්ධිය:</b> <span class="pp-desc">${t?esc(t):'—'}</span></div></div>${figs?`<div class="pp-grid">${figs}</div>`:'<div class="pp-none">මෙම නිර්ණායකය සඳහා සාක්ෂි ගොනු එක් කර නැත</div>'}</div>`}).join('');
 const body=`<div class="pp-body" style="${cv}"><div class="pp-ah">${a.ic} ${a.n}. ${esc(a.name)}</div><div class="pp-h">📌 ප්‍රමිති</div>${a.std.map((x,i)=>`<div class="pp-li"><b>${i+1}.</b> ${esc(x)}</div>`).join('')}<div class="pp-h">📋 අවශ්‍යතා / විස්තර</div>${REQ[a.n].map((x,i)=>`<div class="pp-li"><b>${i+1}.</b> ${esc(x)}</div>`).join('')}<div class="pp-h">👥 සාමාජිකයන් (කණ්ඩායම)</div>${mem}<div class="pp-h">✅ නිර්ණායක අනුව සාක්ෂි</div>${crit}</div>`;
 return cover+wrapT(body,footHTML(sn,a.n+'. '+esc(a.name)))+(typeof sheetsHTML==='function'?sheetsHTML(a.n):'')}
async function makePDF(ns){
 const sn=esc(($('#sname').value||'').trim())||'පාසල';
 const now=new Date(),yr=(($('#syear').value||'').trim()||now.getFullYear()),td=String(now.getDate()).padStart(2,'0')+'/'+String(now.getMonth()+1).padStart(2,'0')+'/'+now.getFullYear();
 const list=AREAS.filter(a=>ns.includes(a.n));if(!list.length)return;
 const single=list.length===1;
 await prepSheets(ns);
 /* පින්තූර PPT එකේ මෙන්ම නැවත සකසා (≤1400px JPEG) PDF එකට දමන්න */
 IMGD={};
 const pics=items.filter(i=>i.kind==='img'&&i.blob&&ns.includes(i.area));
 for(let k=0;k<pics.length;k+=4)await Promise.all(pics.slice(k,k+4).map(async i=>{const im=await pimg(i.blob);if(im)IMGD[i.id]='data:'+im.d}));
 let h='';
 if(!single){
  const idx=AREAS.map(a=>{const s=areaStat(a);return`<li>${a.ic} <b>${a.n}.</b> ${esc(a.name)} — ${s.done} / ${s.nc}</li>`}).join('');
  h+=coverHTML({c:'#2a4fb0',c2:'#e8b90f',badge:'සම්පූර්ණ සාක්ෂි ගොනුව',ic:'👩‍🏫',title:'ගුරු පුවරුව',sub:'ඇගයීම් ක්ෂේත්‍ර 8 ක් · සාක්ෂි සහිත නිර්ණායක',sn,yr,td,extra:`<ol class="pp-idx" style="list-style:none">${idx}</ol>`})}
 list.forEach(a=>h+=areaPDF(a,sn,td,yr));
 const root=$('#printRoot');root.innerHTML=h;
 await Promise.all([...root.querySelectorAll('img')].map(i=>(i.complete?Promise.resolve():new Promise(r=>{i.onload=i.onerror=r})).then(()=>i.decode?i.decode().catch(()=>{}):0)));
 try{await document.fonts.ready}catch(e){}
 const old=document.title;document.title=single?`${yr} - ප්‍රමිතිය ${list[0].n} - ${list[0].name}`:`${yr} - ගුණාත්මක සාක්ෂි - සම්පූර්ණ ගොනුව`;
 const done=()=>{window.removeEventListener('afterprint',done);root.innerHTML='';pUrls.forEach(u=>URL.revokeObjectURL(u));pUrls=[];IMGD={};document.title=old};
 window.addEventListener('afterprint',done);
 setTimeout(()=>window.print(),80)}

/* ===== PPT සැදීම (පසුබිම් සහිත ස්ලයිඩ්) ===== */
const PF='Nirmala UI',PBG={};
const shade=(h,f)=>'#'+[1,3,5].map(i=>Math.round(parseInt(h.substr(i,2),16)*f).toString(16).padStart(2,'0')).join('');
function pbg(c,c2,mode){const key=c+mode;if(PBG[key])return PBG[key];
 const cv=document.createElement('canvas');cv.width=1600;cv.height=900;const g=cv.getContext('2d');
 const circ=(x,y,r,col,al)=>{g.globalAlpha=al;g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.globalAlpha=1};
 if(mode==='cover'){const gr=g.createLinearGradient(0,0,1600,900);gr.addColorStop(0,shade(c,.38));gr.addColorStop(1,c);g.fillStyle=gr;g.fillRect(0,0,1600,900);
  circ(1450,120,330,c2,.22);circ(1250,820,260,'#ffffff',.08);circ(120,780,220,c2,.18);circ(650,60,120,'#ffffff',.07)}
 else{g.fillStyle='#fdf8ef';g.fillRect(0,0,1600,900);circ(1500,850,300,c2,.22);circ(60,880,200,c,.1);circ(1580,300,150,c,.07);
  const gr=g.createLinearGradient(0,0,1600,0);gr.addColorStop(0,shade(c,.7));gr.addColorStop(1,c);g.fillStyle=gr;g.fillRect(0,0,1600,130);circ(1500,20,160,c2,.3);circ(200,130,90,'#ffffff',.1)}
 return PBG[key]=cv.toDataURL('image/png').slice(5)}
async function pimg(b){try{const bm=await createImageBitmap(b);const sc=Math.min(1,1400/Math.max(bm.width,bm.height));const w=Math.round(bm.width*sc),h=Math.round(bm.height*sc);
 const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,w,h);g.drawImage(bm,0,0,w,h);return{d:cv.toDataURL('image/jpeg',.85).slice(5),w,h}}catch(e){return null}}
const pfit=(bx,by,bw,bh,w,h)=>{const r=Math.min(bw/w,bh/h),nw=w*r,nh=h*r;return{x:bx+(bw-nw)/2,y:by+(bh-nh)/2,w:nw,h:nh}};
async function makePPT(ns){
 if(!(await hydrate(ns)))return;
 if(typeof PptxGenJS==='undefined'){alert('PPT සෑදීමට අන්තර්ජාල සම්බන්ධතාව අවශ්‍යයි. පිටුව නැවත load කර උත්සාහ කරන්න.');return}
 const list=AREAS.filter(a=>ns.includes(a.n));if(!list.length)return;
 const bts=[...document.querySelectorAll('[data-p],#pptAll')],txt=bts.map(b=>b.textContent);bts.forEach(b=>{b.disabled=true;b.textContent='⏳ PPT සකස් වෙමින්...'});
 try{
 const sn=($('#sname').value||'').trim()||'පාසල',now=new Date(),yr=(($('#syear').value||'').trim()||now.getFullYear()),td=String(now.getDate()).padStart(2,'0')+'/'+String(now.getMonth()+1).padStart(2,'0')+'/'+now.getFullYear(),single=list.length===1;
 const pres=new PptxGenJS();pres.layout='LAYOUT_WIDE';pres.author='NEXORA TECHNOLOGIES';pres.title=single?`${yr} - ප්‍රමිතිය ${list[0].n} - ${list[0].name}`:`${yr} - ගුණාත්මක සාක්ෂි`;
 const T=(s,t,o)=>s.addText(t,Object.assign({fontFace:PF,isTextBox:true,lang:'si-LK',margin:0},o));
 const R=(s,x,y,w,h,o)=>s.addShape(pres.ShapeType.roundRect,Object.assign({x,y,w,h,rectRadius:.18},o));
 const card=(s,x,y,w,h)=>R(s,x,y,w,h,{fill:{color:'FFFFFF'},line:{color:'EADFCE',width:1},shadow:{type:'outer',color:'000000',opacity:.12,blur:8,offset:2,angle:90}});
 const foot=(s,label)=>{T(s,sn+' · '+label,{x:.5,y:7.08,w:5.6,h:.3,fontSize:10,color:'6B6878'});
  T(s,'Created by NEXORA TECHNOLOGIES — Building the Future, Digitally | WhatsApp 0706562952 · Phone 0716562952 · sudanchamalka@gmail.com',{x:6.2,y:7.1,w:6.1,h:.3,fontSize:7.5,color:'8A8698',align:'right'});
  s.slideNumber={x:12.4,y:7.06,w:.5,h:.3,fontSize:9,color:'6B6878'}};
 const light=(c,c2,title,fs)=>{const s=pres.addSlide();s.background={data:pbg(c,c2,'light')};T(s,title,{x:.6,y:.08,w:12.1,h:1.0,fontSize:fs||26,bold:true,color:'FFFFFF',valign:'middle'});return s};
 const cover=o=>{const s=pres.addSlide();s.background={data:pbg(o.c,o.c2,'cover')};
  T(s,'පාසල් අධ්‍යාපනයේ ගුණාත්මක තහවුරු කිරීම',{x:.8,y:.55,w:11.7,h:.5,fontSize:18,bold:true,color:'FFE9A8',align:'center'});
  if(o.badge){R(s,3.4,1.3,6.5,.55,{fill:{color:'FFFFFF',transparency:78}});T(s,o.badge,{x:3.4,y:1.3,w:6.5,h:.55,fontSize:16,bold:true,color:'FFFFFF',align:'center',valign:'middle'})}
  T(s,o.ic,{x:.8,y:1.95,w:11.7,h:1.0,fontSize:50,align:'center',valign:'middle'});
  T(s,o.title,{x:.8,y:3.0,w:11.7,h:1.1,fontSize:o.title.length>26?32:o.title.length>16?40:50,bold:true,color:'FFFFFF',align:'center',valign:'middle'});
  s.addShape(pres.ShapeType.rect,{x:5.6,y:4.2,w:2.1,h:.05,fill:{color:'FFD24D'}});
  T(s,o.sub,{x:.8,y:4.4,w:11.7,h:.5,fontSize:20,color:'FFFFFF',align:'center'});
  if(o.meta)T(s,o.meta,{x:.8,y:4.95,w:11.7,h:.45,fontSize:14,color:'FFE9A8',align:'center'});
  R(s,2.2,5.7,8.9,1.2,{fill:{color:'FFFFFF',transparency:82},line:{color:'FFFFFF',width:1.2}});if(LOGO)s.addImage({data:LOGO.slice(5),x:2.45,y:5.85,w:.9,h:.9,sizing:{type:'contain',w:.9,h:.9}});else s.addShape(pres.ShapeType.ellipse,{x:2.45,y:5.85,w:.9,h:.9,fill:{type:'none'},line:{color:'FFFFFF',width:1.2,dashType:'dash'}});
  T(s,sn,{x:3.5,y:5.78,w:7.4,h:.7,fontSize:sn.length<=22?26:sn.length<=36?21:sn.length<=50?17:14,bold:true,color:'FFFFFF',align:'center',valign:'middle'});
  T(s,yr+' වර්ෂය  ·  සකස් කළ දිනය: '+td,{x:3.5,y:6.45,w:7.4,h:.35,fontSize:13,color:'FFE9A8',align:'center'})};
 if(!single){
  cover({c:'#2a4fb0',c2:'#e8b90f',badge:'සම්පූර්ණ සාක්ෂි ගොනුව',ic:'👩‍🏫',title:'ගුරු පුවරුව',sub:'ඇගයීම් ක්ෂේත්‍ර 8 ක් · සාක්ෂි සහිත නිර්ණායක'});
  const s=light('#2a4fb0','#e8b90f','📑 පටුන – ඇගයීම් ක්ෂේත්‍ර');
  AREAS.forEach((a,i)=>{const st=areaStat(a),x=.5+(i%2)*6.25,y=1.5+Math.floor(i/2)*1.3;card(s,x,y,6.0,1.12);
   R(s,x,y,.18,1.12,{fill:{color:hex(a.c)}});T(s,a.ic+'  '+a.n+'. '+a.name,{x:x+.4,y:y+.12,w:5.4,h:.5,fontSize:a.name.length>24?16:19,bold:true,color:'2B2A33',valign:'middle'});
   T(s,`සාක්ෂි සහිත නිර්ණායක ${st.done} / ${st.nc}  ·  ගොනු ${st.files}`,{x:x+.4,y:y+.65,w:5.4,h:.35,fontSize:13,color:hex(a.c)})});
  foot(s,'පටුන')}
 for(const a of list){
  const st=areaStat(a),lab=a.n+'. '+a.name;
  cover({c:a.c,c2:a.c2,badge:'ඇගයීම් ක්ෂේත්‍රය '+a.n,ic:a.ic,title:a.name,sub:'ප්‍රමිති සාක්ෂි ගොනුව',meta:`නිර්ණායක ${st.nc} ක් · සාක්ෂි සහිත ${st.done} ක් · ගොනු ${st.files} ක්`});
  let s=light(a.c,a.c2,a.ic+' '+lab,lab.length>34?22:28);
  const cw=[['📌 ප්‍රමිති',a.std,.5],['📋 අවශ්‍යතා / විස්තර',REQ[a.n],6.9]];
  for(const [h,arr,x] of cw){card(s,x,1.45,5.95,5.4);T(s,h,{x:x+.3,y:1.6,w:5.3,h:.5,fontSize:20,bold:true,color:hex(a.c)});
   const L=arr.reduce((n,t)=>n+t.length,0),fs=L<300?17:L<480?15:L<650?13:11.5;
   T(s,arr.map((t,i)=>({text:(i+1)+'. '+t,options:{breakLine:i<arr.length-1,paraSpaceAfter:8}})),{x:x+.3,y:2.2,w:5.35,h:4.4,fontSize:fs,color:'2B2A33',valign:'top'})}
  foot(s,lab);
  const ms=st.ms;
  for(let p=0;p<Math.max(1,Math.ceil(ms.length/8));p++){
   s=light(a.c,a.c2,'👥 සාමාජිකයන් (කණ්ඩායම)'+(ms.length>8?` – ${p+1}`:''));
   if(!ms.length)T(s,'සාමාජිකයින් එක් කර නැත',{x:.5,y:3.3,w:12.3,h:.6,fontSize:20,color:'6B6878',align:'center'});
   for(const [i,m] of ms.slice(p*8,p*8+8).entries()){const x=.5+(i%4)*3.12,y=1.55+Math.floor(i/4)*2.7;card(s,x,y,2.92,2.5);
    const im=m.blob?await pimg(m.blob):null,ax=x+.86,ay=y+.2;
    if(im)s.addImage({data:im.d,x:ax,y:ay,w:1.2,h:1.2,rounding:true,sizing:{type:'cover',w:1.2,h:1.2}});
    else{s.addShape(pres.ShapeType.ellipse,{x:ax,y:ay,w:1.2,h:1.2,fill:{color:hex(a.c)}});T(s,(m.name||'').trim().charAt(0),{x:ax,y:ay,w:1.2,h:1.2,fontSize:36,bold:true,color:'FFFFFF',align:'center',valign:'middle'})}
    T(s,m.name,{x:x+.1,y:y+1.5,w:2.72,h:.5,fontSize:m.name.length>22?12:15,bold:true,color:'2B2A33',align:'center',valign:'middle'});
    T(s,m.role||'',{x:x+.1,y:y+2.0,w:2.72,h:.4,fontSize:11,color:'6B6878',align:'center',valign:'top'})}
   foot(s,lab)}
  for(const r of st.rows){
   const ch=[];for(let i=0;i<r.list.length;i+=6)ch.push(r.list.slice(i,i+6));if(!ch.length)ch.push([]);
   const d=fdate(r.inf.d),t=(r.inf.t||'').trim();
   for(const [ci,part] of ch.entries()){
    const ii=!!r.img,ttl=ii?r.ck+'   '+r.ct:r.k+'   '+r.t;
    s=light(a.c,a.c2,ttl+(r.pl?' – '+r.pl:'')+(ch.length>1?`  (${ci+1}/${ch.length})`:''),ttl.length<=45?26:ttl.length<=80?20:16);
    if(ii){const q=pfit(.6,1.12,12.1,.75,r.iw,r.ih);s.addImage({data:r.img.slice(5),x:q.x,y:q.y,w:q.w,h:q.h})}
    T(s,'📅 දිනය: '+(d||'—'),{x:.6,y:ii?1.95:1.22,w:ii?3:12.1,h:.35,fontSize:14,bold:true,color:hex(a.c)});
    T(s,'📝 වැඩසටහන / සිද්ධිය: '+(t||'—'),{x:ii?3.7:.6,y:ii?1.9:1.6,w:ii?9:12.1,h:ii?.55:.75,fontSize:t.length>170?11:t.length>90?12.5:14,color:'2B2A33',valign:'top'});
    if(!part.length)T(s,'මෙම නිර්ණායකය සඳහා සාක්ෂි ගොනු එක් කර නැත',{x:.5,y:4,w:12.3,h:.6,fontSize:18,color:'6B6878',align:'center'});
    for(const [i,f] of part.entries()){const x=.5+(i%3)*4.19,y=2.5+Math.floor(i/3)*2.25,w=3.95,h=2.1;card(s,x,y,w,h);
     const im=f.kind==='img'?await pimg(f.blob):null;
     if(im){const q=pfit(x+.1,y+.1,w-.2,1.65,im.w,im.h);s.addImage({data:im.d,x:q.x,y:q.y,w:q.w,h:q.h})}
     else T(s,fico(f),{x:x+.1,y:y+.1,w:w-.2,h:1.65,fontSize:44,align:'center',valign:'middle'});
     T(s,(f.cap||'')+(im||!f.cap?'':' · ')+(im?'':f.name),{x:x+.12,y:y+1.78,w:w-.24,h:.28,fontSize:10,color:'2B2A33',align:'center',valign:'middle'})}
    foot(s,lab)}}
 (await sheetPages(a.n)).forEach(d=>{const sl=pres.addSlide();sl.background={color:'FFFFFF'};const q=pfit(0,0,13.33,7.5,612,864);sl.addImage({data:d.slice(5),x:q.x,y:q.y,w:q.w,h:q.h})});
 }
 await pres.writeFile({fileName:single?`${yr} - ප්‍රමිතිය ${list[0].n} - ${list[0].name}.pptx`:`${yr} - ගුණාත්මක සාක්ෂි - සම්පූර්ණ ගොනුව.pptx`});
 }catch(e){console.error(e);alert('PPT සෑදීමේදී දෝෂයක් ඇති විය: '+e.message)}
 finally{bts.forEach((b,i)=>{b.disabled=false;b.textContent=txt[i]})}}
const hex=h=>h.replace('#','');

function sheetsHTML(n){return (SHP[n]||SHEETS[n]||[]).map(d=>`<div class="pp-sheet"><img src="${d}" alt=""></div>`).join('')}
async function printSheet(n){await prepSheets([n]);const root=$('#printRoot');root.innerHTML=sheetsHTML(n);
 await Promise.all([...root.querySelectorAll('img')].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})));
 const old=document.title,a=AREAS[n-1];document.title=`ඇගයීම් ආකෘතිය 0${n} - ${a.name}`;
 const done=()=>{window.removeEventListener('afterprint',done);root.innerHTML='';document.title=old};
 window.addEventListener('afterprint',done);setTimeout(()=>window.print(),80)}
function addSheets(){AREAS.forEach(a=>{const body=document.querySelector('#a'+a.n+' .body');if(!body)return;
 const d=document.createElement('details');d.className='sheet';d.dataset.a=a.n;d.style.setProperty('--c',a.c);
 d.innerHTML=`<summary>📝 ඇගයීම් ආකෘතිය 0${a.n} – ලකුනු කොළය <span class="kc">පිටු ${(SHEETS[a.n]||[]).length}</span></summary><div class="sheetbar"><button class="pdfbtn" style="--c:${a.c}">🖨️ ලකුනු කොළය මුද්‍රණය / PDF</button></div><div class="sheetpages"></div>`;
 d.querySelector('.pdfbtn').onclick=()=>printSheet(a.n);
 d.addEventListener('toggle',()=>{const w=d.querySelector('.sheetpages');if(d.open&&!w.children.length)fillSheet(a.n,w)});
 body.insertBefore(d,body.querySelector('.pager'))})}
