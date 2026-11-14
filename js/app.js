/* ================================================================
   ගුරු පුවරුව – ප්‍රධාන යෙදුම (Firebase Firestore + Storage)
   ගුරුවරයා  → තමන්ගේ ප්‍රමිතිය පමණක්
   ඇඩ්මින්   → ප්‍රමිති 8 ම + ලකුණු යෙදීම + ගුරුවරු කළමනාකරණය
   ================================================================ */
let fs=null,st=null,ME=null,VIS=[],items=[],mems=[],PR={},INFO={},SL={},MK={},UP={},PEND={},BLOBS={},LOGO='',unsubs=[],lastSig='',lastLeg='',hashBound=false;
let TCH={},tchSig=null;   // ක්ෂේත්‍ර 2: ඇගයීමට ලක්වන ගුරුවරු
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const kind=f=>f.type.startsWith('image/')?'img':f.type.startsWith('video/')?'vid':'doc';
const enc=s=>String(s).replace(/\./g,'_'),dec=s=>String(s).replace(/_/g,'.');
const areaOf=pk=>+String(pk).split(/[.~]/)[0];
const isAdmin=()=>!!ME&&ME.role==='admin';
const FV=()=>firebase.firestore.FieldValue;
const areaRef=n=>fs.collection('areas').doc(String(n));
const visAreas=()=>AREAS.filter(a=>VIS.includes(a.n));
let _tt=0;
function toast(m,ms=3500){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(_tt);if(ms)_tt=setTimeout(()=>{t.hidden=true},ms)}
function untoast(){const t=$('.toast');if(t)t.hidden=true}
const fail=e=>{console.error(e);toast('⚠️ සුරැකීම අසාර්ථකයි: '+(e&&(e.code||e.message)||e),7000)};
const later=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};

/* ---------- රූප කුඩා කිරීම ---------- */
async function shrink(f,max=2000,q=.85){
 if(!f.type.startsWith('image/')||/gif|svg/.test(f.type)||f.size<350e3)return f;
 try{const bm=await createImageBitmap(f),sc=Math.min(1,max/Math.max(bm.width,bm.height)),cv=document.createElement('canvas');cv.width=Math.round(bm.width*sc);cv.height=Math.round(bm.height*sc);cv.getContext('2d').drawImage(bm,0,0,cv.width,cv.height);
  const b=await new Promise(r=>cv.toBlob(r,'image/jpeg',q));return b&&b.size<f.size?b:f}catch(e){return f}}
async function smallData(f,max,type='image/jpeg',q=.82){
 const bm=await createImageBitmap(f),sc=Math.min(1,max/Math.max(bm.width,bm.height)),cv=document.createElement('canvas');cv.width=Math.round(bm.width*sc);cv.height=Math.round(bm.height*sc);
 const x=cv.getContext('2d');if(type==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height)}x.drawImage(bm,0,0,cv.width,cv.height);return cv.toDataURL(type,q)}
const dataToBlob=d=>{try{const[h,b]=d.split(','),m=/:(.*?);/.exec(h)[1],s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return new Blob([u],{type:m})}catch(e){return null}};

/* ================= Firestore කියවීම (real-time) ================= */
function applyArea(id,d){const a=+id;
 if(a===2){const ae=document.activeElement;if(!(ae&&ae.classList&&ae.classList.contains('tchin')))TCH=d.tch||{}}
 [PR,INFO,SL].forEach(o=>Object.keys(o).forEach(k=>{if(areaOf(k)===a)delete o[k]}));
 Object.entries(d.progs||{}).forEach(([k,v])=>{PR[dec(k)]=v});
 Object.entries(d.info||{}).forEach(([k,v])=>{if(!PEND[dec(k)])INFO[dec(k)]=v});
 Object.entries(d.slots||{}).forEach(([k,v])=>{SL[dec(k)]=v})}
function postArea(){const sig=JSON.stringify(PR);if(sig!==lastSig){lastSig=sig;renderProgs()}renderTeachers();refreshInfo();render()}
function applySettings(d){d=d||{};const sn=$('#sname'),sy=$('#syear');
 if(document.activeElement!==sn)sn.value=d.name||'';
 if(document.activeElement!==sy)sy.value=d.year||new Date().getFullYear();
 LOGO=d.logo||'';logoUI()}
function listen(){
 const A=isAdmin(),U=u=>unsubs.push(u),er=e=>{console.error(e);toast('⚠️ දත්ත කියවීමේ දෝෂය: '+(e.code||e.message),9000)};
 if(A)U(fs.collection('areas').onSnapshot(s=>{s.docs.forEach(d=>applyArea(d.id,d.data()));postArea()},er));
 else U(areaRef(ME.area).onSnapshot(s=>{if(s.exists)applyArea(s.id,s.data());postArea()},er));
 const fq=A?fs.collection('files'):fs.collection('files').where('area','==',ME.area);
 U(fq.onSnapshot(s=>{items=s.docs.map(d=>{const x={id:d.id,...d.data()};x.cap=x.cap||'';x.blob=BLOBS[x.id];return x});const ls=legacySig();if(ls!==lastLeg){lastLeg=ls;renderProgs()}render()},er));
 const mq=A?fs.collection('members'):fs.collection('members').where('area','==',ME.area);
 U(mq.onSnapshot(s=>{mems=s.docs.map(d=>{const x={id:d.id,...d.data()};x.blob=x.photo?dataToBlob(x.photo):null;return x});renderMembers()},er));
 if(A)U(fs.collection('marks').onSnapshot(s=>{s.docs.forEach(d=>{MK[+d.id]=d.data().m||{}});refreshMarks()},er));
 else U(fs.collection('marks').doc(String(ME.area)).onSnapshot(s=>{MK[ME.area]=s.exists?(s.data().m||{}):{};refreshMarks()},er));
 U(fs.collection('settings').doc('school').onSnapshot(s=>applySettings(s.exists?s.data():{}),er));
 if(A&&typeof listenUsers==='function')listenUsers(U,er)}

/* ================= Firestore ලිවීම ================= */
const saveProgs=k=>areaRef(areaOf(k)).set({progs:{[enc(k)]:PR[k]}},{merge:true}).catch(fail);
const saveSL=pk=>areaRef(areaOf(pk)).set({slots:{[enc(pk)]:SL[pk]}},{merge:true}).catch(fail);
function setInfo(pk,f,v){(INFO[pk]=INFO[pk]||{})[f]=v;const stamp=PEND[pk]=Date.now();flushInfo(pk,stamp)}
const flushers={};
function flushInfo(pk,stamp){(flushers[pk]=flushers[pk]||later((p,s)=>{
  areaRef(areaOf(p)).set({info:{[enc(p)]:{d:(INFO[p]||{}).d||'',t:(INFO[p]||{}).t||'',g:(INFO[p]||{}).g||''}}},{merge:true}).then(()=>{if(PEND[p]===s)delete PEND[p]}).catch(fail)},700))(pk,stamp)}

/* ================= ගොනු එක් කිරීම / ඉවත් කිරීම ================= */
const SLOT_DEF=5;   // එක් වැඩසටහනකට පෙරනිමි ගොනු කොටු ගණන (අවශ්‍ය නම් එකතු කළ හැක)
const nSlots=k=>Math.max(SLOT_DEF,SL[k]||SLOT_DEF);
function freeSlot(k,from){const u=new Set(items.filter(x=>x.pk===k).map(x=>x.slot).concat(Object.values(UP).filter(x=>x.pk===k).map(x=>x.slot)));let s=from;while(u.has(s))s++;return s}
let pickK=null,pickI=0;
async function fill(k,i,files){
 const area=areaOf(k);
 for(const f of files){
  if(f.size>DRIVE_MAX_MB*1024*1024){toast('“'+f.name+'” ගොනුව '+DRIVE_MAX_MB+'MB ට වඩා විශාලයි',5000);continue}
  const id=fs.collection('files').doc().id,s=freeSlot(k,i);
  if(s>=nSlots(k)){SL[k]=s+1;saveSL(k)}
  UP[id]={id,pk:k,slot:s,name:f.name,pct:0};
  upload(id,k,s,area,f)}
 render()}
const DRIVE_MAX_MB=20;
const b2b64=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(',')[1]||'');r.onerror=()=>rej(new Error('ගොනුව කියවීමට නොහැකි විය'));r.readAsDataURL(b)});
function driveCall(payload,onPct){
 return new Promise((res,rej)=>{
  if(typeof DRIVE_API_URL==='undefined'||/^PASTE/.test(DRIVE_API_URL))return rej(new Error('js/firebase-config.js හි DRIVE_API_URL තවම සකසා නැත'));
  if(!auth||!auth.currentUser)return rej(new Error('පිවිසී නැත'));
  auth.currentUser.getIdToken().then(token=>{
   if(onPct)onPct(30);
   /* fetch + text/plain = "සරල" CORS ඉල්ලීමක් (preflight නැත) – Apps Script සමඟ ක්‍රියා කරයි */
   fetch(DRIVE_API_URL,{method:'POST',redirect:'follow',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({},payload,{token}))})
    .then(r=>r.text())
    .then(t=>{let j;try{j=JSON.parse(t)}catch(_){return rej(new Error('Drive සේවාවෙන් වැරදි පිළිතුරක් ලැබුණි (Web app “Anyone” ලෙස deploy කර ඇතිද?)'))}
     if(onPct)onPct(99);j.ok?res(j):rej(new Error(j.error||'Drive දෝෂයකි'))})
    .catch(()=>rej(new Error('අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කරන්න')))}).catch(rej)})}
async function upload(id,pk,slot,area,f){
 try{const b=await shrink(f),safe=f.name.replace(/[^\w.\-]+/g,'_').slice(-80),data=await b2b64(b);
  const j=await driveCall({action:'upload',area,name:safe,type:b.type||f.type||'application/octet-stream',data},p=>{if(UP[id])UP[id].pct=p;const e=document.getElementById('up'+id);if(e)e.textContent=p+'%'});
  const url='https://drive.google.com/file/d/'+j.id+'/view';
  await fs.collection('files').doc(id).set({area,pk,slot,name:f.name,type:f.type||b.type||'',kind:kind(f),cap:f.name.replace(/\.[^.]+$/,''),url,driveId:j.id,path:'',size:b.size||f.size,ts:Date.now(),by:ME.uid})
 }catch(e){fail(e)}finally{delete UP[id];render()}}
async function del(id){const it=items.find(i=>i.id===id);if(!it||!confirm('මෙම ගොනුව ඉවත් කරන්නද?'))return;
 try{await fs.collection('files').doc(id).delete();if(it.driveId)driveCall({action:'delete',id:it.driveId}).catch(()=>{})}catch(e){fail(e)}}
function cap(id,v){fs.collection('files').doc(id).update({cap:v}).catch(fail)}
function openIt(id){const i=items.find(x=>x.id===id);if(i)window.open(i.url,'_blank','noopener')}

/* ================= සාමාජිකයන් ================= */
function renderMembers(){visAreas().forEach(a=>{const l=mems.filter(m=>m.area===a.n).sort((x,y)=>x.ts-y.ts),el=document.getElementById('mem'+a.n);if(!el)return;
 el.innerHTML=l.length?l.map(m=>{const av=m.photo?`<img src="${m.photo}" alt="">`:`<span>${esc((m.name||'').trim().charAt(0))}</span>`;
  return `<div class="mem"><div class="av" style="--c:${a.c};cursor:pointer" onclick="photoMem('${m.id}')" title="ඡායාරූපය වෙනස් කරන්න">${av}</div><b>${esc(m.name)}</b><small>${esc(m.role)}</small><button class="x ed" onclick="editMem('${m.id}')" title="සංස්කරණය කරන්න">✏️</button><button class="x" onclick="delMem('${m.id}')" title="ඉවත් කරන්න">✕</button></div>`}).join(''):'<div class="empty" style="margin:4px 0">තවම සාමාජිකයින් නැත – පහළින් එක් කරන්න</div>'})}
function delMem(id){if(confirm('මෙම සාමාජිකයා ඉවත් කරන්නද?'))fs.collection('members').doc(id).delete().catch(fail)}
function editMem(id){const m=mems.find(x=>x.id===id);if(!m)return;const n=prompt('නම',m.name);if(n===null)return;const r=prompt('තනතුර / භූමිකාව',m.role||'');if(r===null)return;
 fs.collection('members').doc(id).update({name:n.trim()||m.name,role:r.trim()}).catch(fail)}
function photoMem(id){const f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=async()=>{if(!f.files[0])return;try{fs.collection('members').doc(id).update({photo:await smallData(f.files[0],320)}).catch(fail)}catch(e){toast('ඡායාරූපය කියවීමට නොහැකි විය')}};f.click()}
function initMem(){document.querySelectorAll('.madd').forEach(f=>{const n=+f.dataset.a;let ph=null;const fi=f.querySelector('.mfile'),pv=f.querySelector('.mpv');
 fi.onchange=()=>{ph=fi.files[0]||null;if(ph)pv.innerHTML=`<img src="${URL.createObjectURL(ph)}" alt="">`};
 f.querySelector('.mbtn').onclick=async()=>{const nm=f.querySelector('.mname').value.trim();if(!nm){f.querySelector('.mname').focus();return}
  let photo='';if(ph){try{photo=await smallData(ph,320)}catch(e){}}
  try{await fs.collection('members').add({area:n,name:nm,role:f.querySelector('.mrole').value.trim(),photo,ts:Date.now(),by:ME.uid})}catch(e){return fail(e)}
  f.querySelector('.mname').value='';f.querySelector('.mrole').value='';ph=null;fi.value='';pv.textContent='📷'}})}

/* ================= ව්‍යුහය ගොඩනැගීම ================= */
/* දර්ශකය පෙන්වීම: පින්තූරය (3–8) හෝ පෙළ (1–2) */
function indHTML(i){return i.img?`<img class="indimg" src="${i.img}" alt="${i.id}">`:`<span class="indtxt">${i.lab&&i.lab!==i.id?`<b>${esc(i.lab)}</b> `:''}${esc(i.txt||'')}</span>`}
const mkIn=(a,k,f,attr)=>`<input class="mkin ${f==='t'?'ant':'amk'}" data-a="${a}" data-k="${k}" data-f="${f}" ${attr}>`;
const mkBarI=(a,k)=>`<div class="adm"><b>🛡️ ලකුණු</b>${mkIn(a,k,'o','type="number" min="0" max="6" step="0.5" placeholder="0–6"')}<span>/ ${DEF_MAX}</span><span class="apc" data-pc="${k}"></span>${mkIn(a,k,'t','placeholder="සටහන (අවශ්‍ය නම්)"')}</div>`;
function critHTML(a,t,k){const ind=IND[k],sum=`<summary><span class="kn">${k}</span><span class="kt">${t}</span><span class="kc" id="c${k}">0</span></summary>`;
 if(!ind)return `<details class="crit" id="k${k}">${sum}${isAdmin()?mkBar(a.n,k):`<div class="mkview" id="mv${k}" hidden></div>`}<div id="pl${k}"></div><div class="addrow"><button class="addprog" data-k="${k}">➕ වැඩසටහනක් එක් කරන්න</button></div></details>`;
 return `<details class="crit" id="k${k}">${sum}<div class="mkview" id="mv${k}" hidden></div><div id="pl${k}"></div>`+ind.map(i=>`<details class="crit ind" id="k${i.id}"><summary><span class="kn">${i.id}</span><span class="kt">${indHTML(i)}</span><span class="kc" id="c${i.id}">0</span></summary>${isAdmin()?(a.n===2?`<div class="adm" data-tm="${i.id}"></div>`:mkBarI(a.n,i.id)):`<div class="mkview" id="mv${i.id}" hidden></div>`}<div id="pl${i.id}"></div><div class="addrow"><button class="addprog" data-k="${i.id}">➕ වැඩසටහනක් එක් කරන්න</button></div></details>`).join('')+`</details>`}
const mkBar=(a,k)=>`<div class="adm"><b>🛡️ ලකුණු</b>${mkIn(a,k,'o','type="number" min="0" step="0.5" placeholder="ලබාගත්"')}<span>/</span>${mkIn(a,k,'x','type="number" min="1" step="0.5" placeholder="6"')}<span class="apc" data-pc="${k}"></span>${mkIn(a,k,'t','placeholder="ඇඩ්මින් සටහන (අවශ්‍ය නම්)"')}</div>`;
function sectionHTML(a){return `<section id="a${a.n}" style="--c:${a.c};--c2:${a.c2}">
  <div class="head"><div class="num">${a.ic}</div><h2>${a.n}. ${a.name}</h2><span class="cnt" id="c${a.n}">0</span></div><div class="aprog"><span>📈 ප්‍රගතිය</span><div class="pbar"><i id="pb${a.n}"></i></div><b id="pt${a.n}"></b><span class="pill" id="am${a.n}" hidden></span></div>
  <div class="body"><div class="pdfbar"><button class="pdfbtn" data-a="${a.n}" style="--c:${a.c}">📄 මෙම ප්‍රමිතිය PDF කරන්න</button><button class="pdfbtn" data-p="${a.n}" style="--c:#d24726">📊 මෙම ප්‍රමිතිය PPT කරන්න</button></div><div class="two"><div class="std"><h4>📌 ප්‍රමිති</h4>${a.std.map((s,i)=>`<div><b>${i+1}.</b> ${s}</div>`).join('')}</div><div class="std req"><h4>📋 අවශ්‍යතා</h4>${REQ[a.n].map((s,i)=>`<div><b>${i+1}.</b> ${s}</div>`).join('')}</div></div><h4 class="ch">👥 සාමාජිකයන් (කණ්ඩායම)</h4><div class="mems" id="mem${a.n}"></div><div class="madd" data-a="${a.n}"><label class="mph" title="ඡායාරූපය තෝරන්න"><input type="file" accept="image/*" hidden class="mfile"><span class="mpv">📷</span></label><input class="mname" placeholder="නම"><input class="mrole" placeholder="තනතුර / භූමිකාව"><button class="btn mbtn">＋ සාමාජිකයෙකු එක් කරන්න</button></div>${a.n===2?'<div class="tchbox" id="tch2"></div>':''}<h4 class="ch">✅ නිර්ණායක – සාක්ෂි / ගොනු එක් කරන්න</h4>
  <div class="sub" style="font-weight:700;margin:6px 0 2px">📌 නිර්ණායක → දර්ශක – ඒ ඒ දර්ශකය යටතේ සාක්ෂි (පින්තූර / ගොනු 5ක් බැගින්) එක් කරන්න; අවශ්‍ය නම් කොටු හෝ වැඩසටහන් වැඩි කරන්න</div>${CRIT[a.n].map((t,i)=>critHTML(a,t,a.n+'.'+(i+1))).join('')}
  </div></section>`}
function build(){
 const AV=visAreas();
 $('#nav').innerHTML=AV.map(a=>`<a href="#a${a.n}" style="--c:${a.c}">${a.ic} ${a.n}. ${a.name} <span class="pc">0%</span></a>`).join('')+(isAdmin()?`<a href="#admin" style="--c:#6a5acd">🛡️ ඇඩ්මින් පැනලය <span class="pc" id="navPend" hidden></span></a>`:'');
 $('#areas').innerHTML=AV.map(sectionHTML).join('');
 if(!$('#fpick')){document.body.insertAdjacentHTML('beforeend','<input type="file" id="fpick" multiple hidden>');$('#fpick').onchange=e=>{if(pickK)fill(pickK,pickI,[...e.target.files]);e.target.value=''}}
 const A=isAdmin();
 $('#who').innerHTML=`<span>👤 ${esc(ME.name||ME.email)}</span><span class="role">${A?'ඇඩ්මින්':'ගුරුවරයා'}</span><button id="outBtn">පිටවෙන්න</button>`;
 $('#outBtn').onclick=()=>auth.signOut();
 $('#hsub').textContent=A?'ඇඩ්මින් දර්ශනය – සියලු ප්‍රමිති බලන්න, සාක්ෂි පරීක්ෂා කර ලකුණු යොදන්න':'ඔබගේ ප්‍රමිතිය: '+AV[0].n+'. '+AV[0].name+' – සාක්ෂි (පින්තූර · වීඩියෝ · ලේඛන) එක් කරන්න'}

/* ---------- වැඩසටහන් (උපමාතෘකා) ---------- */
const getP=k=>PR[k]&&PR[k].length?PR[k]:[k];
const hasLegacy=k=>items.some(x=>String(x.pk)===k||String(x.pk).startsWith(k+'~'))||!!(PR[k]&&PR[k].length>1);
const legacySig=()=>Object.keys(IND).filter(hasLegacy).join(',');
function progBlock(k,pk,i,n){return `<div class="prog"><div class="ph"><b>📋 වැඩසටහන ${i+1}</b><span class="kc" id="pc${pk}">0</span>${n>1?`<button class="dp" onclick="delProg('${k}','${pk}')">🗑️ ඉවත් කරන්න</button>`:''}</div>${infoHTML(pk)}<div class="slots" id="g${pk}"></div><div class="addrow"><button class="more" data-k="${pk}" data-n="5">＋ තවත් කොටු 5ක්</button><button class="more" data-k="${pk}" data-n="1">＋ කොටුවක්</button></div></div>`}
function renderProgs(){visAreas().forEach(a=>CRIT[a.n].forEach((_,ci)=>{const k=a.n+'.'+(ci+1);[k].concat(IND[k]?IND[k].map(i=>i.id):[]).forEach(u=>{const l=getP(u),el=document.getElementById('pl'+u);if(!el)return;el.innerHTML=(u===k&&IND[k]&&!hasLegacy(k))?'':l.map((pk,i)=>progBlock(u,pk,i,l.length)).join('')})}));bindInfo();
 document.querySelectorAll('.more').forEach(b=>b.onclick=()=>{const k=b.dataset.k;SL[k]=nSlots(k)+(+b.dataset.n||5);saveSL(k);render()})}
async function delProg(k,pk){if(!confirm('මෙම වැඩසටහන සහ එහි පින්තූර ඉවත් කරන්නද?'))return;
 const gone=items.filter(i=>i.pk===pk);
 try{await Promise.all(gone.map(g=>fs.collection('files').doc(g.id).delete().then(()=>{if(g.driveId)driveCall({action:'delete',id:g.driveId}).catch(()=>{})})));
  const nl=getP(k).filter(x=>x!==pk);PR[k]=nl;delete INFO[pk];delete SL[pk];
  await areaRef(areaOf(k)).set({progs:{[enc(k)]:nl},info:{[enc(pk)]:FV().delete()},slots:{[enc(pk)]:FV().delete()}},{merge:true})}catch(e){fail(e)}
 renderProgs();render()}
function infoHTML(k){const tsel=areaOf(k)===2?`<label>👩‍🏫 අදාළ ගුරුවරයා<select class="itch" data-k="${k}"><option value="">— සියලු / තෝරා නැත —</option>${tchIds().map(t=>`<option value="${t}">${esc(tchName(t))}</option>`).join('')}</select></label>`:'';
 return `<div class="info">${tsel}<label>📅 දිනය<input type="date" class="idate" data-k="${k}"></label><label class="iw">📝 වැඩසටහන / සිද්ධිය පිළිබඳ කෙටි විස්තරය<textarea class="itext" data-k="${k}" rows="4" placeholder="සිදුකළ වැඩසටහන හෝ සිද්ධිය ගැන කෙටියෙන් ලියන්න..."></textarea></label></div>`}
function refreshInfo(){
 document.querySelectorAll('.idate').forEach(e=>{if(document.activeElement!==e)e.value=(INFO[e.dataset.k]||{}).d||''});
 document.querySelectorAll('.itext').forEach(e=>{if(document.activeElement!==e)e.value=(INFO[e.dataset.k]||{}).t||''});
 document.querySelectorAll('.itch').forEach(e=>{e.value=(INFO[e.dataset.k]||{}).g||''})}
function bindInfo(){
 document.querySelectorAll('.idate').forEach(e=>{e.onchange=()=>setInfo(e.dataset.k,'d',e.value)});
 document.querySelectorAll('.itext').forEach(e=>{e.oninput=()=>setInfo(e.dataset.k,'t',e.value)});
 document.querySelectorAll('.itch').forEach(e=>{e.onchange=()=>setInfo(e.dataset.k,'g',e.value)});refreshInfo()}
function initInfo(){renderProgs();
 document.querySelectorAll('.addprog').forEach(b=>b.onclick=()=>{const k=b.dataset.k,l=getP(k).slice();let n=2;while(l.includes(k+'~'+n))n++;l.push(k+'~'+n);PR[k]=l;saveProgs(k);renderProgs();render()});
 const pdfGo=async ns=>{if(!(await hydrate(ns)))return;makePDF(ns)};
 document.querySelectorAll('.pdfbtn[data-a]').forEach(b=>b.onclick=()=>pdfGo([+b.dataset.a]));
 $('#pdfAll').onclick=()=>pdfGo(visAreas().map(a=>a.n));
 document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>makePPT([+b.dataset.p]));$('#pptAll').onclick=()=>makePPT(visAreas().map(a=>a.n))}

/* ---------- ගොනු කොටු ---------- */
function full(i){const u=i.url,
 th=i.kind==='img'||(i.kind==='vid'&&i.driveId)?`<img src="${esc(i.driveId?'https://drive.google.com/thumbnail?id='+i.driveId+'&sz=w800':u)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:i.kind==='vid'?`<video src="${esc(u)}" muted preload="metadata"></video>`:`<span class="ico">${/pdf/i.test(i.type)?'📕':/sheet|excel|csv/i.test(i.type)?'📊':/word|document/i.test(i.type)?'📝':'📄'}</span>`;
 return `<div class="slot"><div class="th" onclick="openIt('${i.id}')" title="${esc(i.name)}">${th}</div><input class="sc" value="${esc(i.cap)}" onchange="cap('${i.id}',this.value)" placeholder="සටහන"><button class="x" onclick="del('${i.id}')" title="ඉවත් කරන්න">✕</button></div>`}
const upSlot=u=>`<div class="slot up"><span class="ico">⏳</span><b id="up${u.id}">${u.pct}%</b><span>${esc(u.name.slice(0,18))}</span></div>`;
let rT=0;
function render(){cancelAnimationFrame(rT);rT=requestAnimationFrame(doRender)}
function doRender(){
 if(!ME)return;
 visAreas().forEach(a=>{let tot=0;CRIT[a.n].forEach((_,ci)=>{const k=a.n+'.'+(ci+1);
  [k].concat(IND[k]?IND[k].map(i=>i.id):[]).forEach(u=>{getP(u).forEach(pk=>{const list=items.filter(x=>x.pk===pk),ups=Object.values(UP).filter(x=>x.pk===pk);
   const n=Math.max(nSlots(pk),...list.map(x=>x.slot+1),...ups.map(x=>x.slot+1));let h='';
   for(let i=0;i<n;i++){const it=list.find(x=>x.slot===i),up=ups.find(x=>x.slot===i);h+=it?full(it):up?upSlot(up):`<div class="slot empty" data-k="${pk}" data-i="${i}"><span class="plus">＋</span><small>${i+1}</small></div>`}
   const g=document.getElementById('g'+pk);if(g)g.innerHTML=h;const pc=document.getElementById('pc'+pk);if(pc)pc.textContent=list.length+' / '+n});const ue=document.getElementById('c'+u);if(ue)ue.textContent=items.filter(x=>inCrit(String(x.pk),u)).length});
  tot+=items.filter(x=>inCrit(String(x.pk),k)).length});
  const ca=$('#c'+a.n);if(ca)ca.textContent=tot+' ගොනු'});
 document.querySelectorAll('.slot.empty').forEach(el=>{
  el.onclick=()=>{pickK=el.dataset.k;pickI=+el.dataset.i;$('#fpick').click()};
  el.ondragover=e=>{e.preventDefault();el.classList.add('over')};el.ondragleave=()=>el.classList.remove('over');
  el.ondrop=e=>{e.preventDefault();el.classList.remove('over');fill(el.dataset.k,+el.dataset.i,e.dataTransfer.files)}});
 const c=k=>items.filter(i=>i.kind===k).length;
 $('#tot').textContent='ගොනු '+items.length;$('#img').textContent='🖼️ '+c('img');$('#vid').textContent='🎬 '+c('vid');$('#doc').textContent='📄 '+c('doc');progress()}
function progress(){let all=0,tot=0;
 visAreas().forEach(a=>{let d=0,n=0;
  CRIT[a.n].forEach((_,i)=>{const k=a.n+'.'+(i+1),us=unitKeys(k);let ok=0;
   us.forEach(u=>{const has=items.some(x=>inCrit(String(x.pk),u));n++;if(has){ok++;d++}if(u!==k){const ue=document.getElementById('k'+u);if(ue)ue.classList.toggle('done',has)}});
   const e=document.getElementById('k'+k);if(e)e.classList.toggle('done',IND[k]?ok===us.length:ok>0)});
  tot+=n;all+=d;const p=n?Math.round(d/n*100):0;
  const pb=document.getElementById('pb'+a.n);if(pb)pb.style.width=p+'%';const pt=document.getElementById('pt'+a.n);if(pt)pt.textContent=d+' / '+n+' · '+p+'%';
  const nv=document.querySelector('nav a[href="#a'+a.n+'"] .pc');if(nv)nv.textContent=p+'%'});
 const p=tot?Math.round(all/tot*100):0;$('#opb').style.width=p+'%';$('#opt').textContent='සාක්ෂි එක් කර ඇති දර්ශක / නිර්ණායක '+all+' / '+tot+' ('+p+'%)';
 if(typeof renderAdmin==='function'&&isAdmin())renderAdmin(true)}

/* ---------- පිටු මාරුව ---------- */
function show(id){const ok=VIS.map(n=>'a'+n).concat(isAdmin()?['admin']:[]);if(!ok.includes(id))id=isAdmin()?'admin':ok[0];
 ok.forEach(x=>{const e=document.getElementById(x);if(e)e.hidden=(x!==id)});
 document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));
 if(id==='admin'&&typeof renderAdmin==='function')renderAdmin();
 window.scrollTo(0,0)}
function pages(){const AV=visAreas();
 AV.forEach((a,idx)=>{const s=document.getElementById('a'+a.n),d=document.createElement('div');d.className='pager';d.style.setProperty('--c',a.c);
  const pv=AV[idx-1],nx=AV[idx+1];
  d.innerHTML=(pv?`<a class="pg" href="#a${pv.n}">◀ ${pv.n}. ${pv.name}</a>`:'<span></span>')+(nx?`<a class="pg" href="#a${nx.n}">${nx.n}. ${nx.name} ▶</a>`:'<span></span>');
  s.querySelector('.body').appendChild(d)});
 if(!hashBound){window.addEventListener('hashchange',()=>{if(ME)show(location.hash.slice(1))});hashBound=true}
 show(location.hash.slice(1))}

/* ---------- පාසලේ විස්තර (ඇඩ්මින්ට පමණක් සංස්කරණය) ---------- */
const schoolRef=()=>fs.collection('settings').doc('school');
function logoUI(){const A=isAdmin();$('#slp').innerHTML=LOGO?`<img src="${LOGO}" alt="">`:'🏷️';$('#sldel').hidden=!(A&&LOGO);$('#slp').classList.toggle('ro',!A)}
const saveName=later(v=>schoolRef().set({name:v},{merge:true}).catch(fail),600);
const saveYear=later(v=>schoolRef().set({year:v},{merge:true}).catch(fail),600);
function bindSchool(){const A=isAdmin();
 $('#sname').disabled=$('#syear').disabled=!A;$('#pdfAll').hidden=$('#pptAll').hidden=!A;$('#slp').title=A?'ලාංඡනය තෝරන්න':'';
 $('#sname').oninput=e=>saveName(e.target.value);$('#syear').oninput=e=>saveYear(e.target.value);
 $('#slp').onclick=A?()=>$('#slf').click():null;
 $('#slf').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{schoolRef().set({logo:await smallData(f,400,'image/png')},{merge:true}).catch(fail)}catch(x){toast('ලාංඡනය කියවීමට නොහැකි විය')}};
 $('#sldel').onclick=()=>schoolRef().set({logo:FV().delete()},{merge:true}).catch(fail);
 logoUI()}

/* ---------- පින්තූර PPT සඳහා සූදානම් කිරීම ---------- */
async function hydrate(ns){
 const need=items.filter(i=>i.kind==='img'&&ns.includes(i.area)&&!i.blob);let bad=0;
 if(need.length){toast('පින්තූර සූදානම් කරමින්… ('+need.length+')',0);
  const one=async i=>{try{
   if(i.driveId){const j=await driveCall({action:'get',id:i.driveId});const b=dataToBlob('data:'+(j.type||'image/jpeg')+';base64,'+j.data);if(!b)throw 0;BLOBS[i.id]=i.blob=b}
   else{const r=await fetch(i.url,{mode:'cors'});if(!r.ok)throw 0;BLOBS[i.id]=i.blob=await r.blob()}}catch(e){bad++}};
  for(let k=0;k<need.length;k+=4)await Promise.all(need.slice(k,k+4).map(one));
  untoast()}
 if(bad&&!confirm('පින්තූර '+bad+'ක් PPT එකට ගත නොහැක. ඒවා නැතිව ඉදිරියට යන්නද?'))return false;
 return true}

/* ================= ආරම්භය / අවසානය ================= */
function startApp(){
 VIS=isAdmin()?AREAS.map(a=>a.n):[ME.area];
 build();initInfo();pages();initMem();bindSchool();if(typeof addSheets==='function')addSheets();
 document.body.classList.remove('boot');$('#app').hidden=false;listen()}
function stopApp(){
 unsubs.forEach(u=>{try{u()}catch(e){}});unsubs=[];ME=null;VIS=[];items=[];mems=[];PR={};INFO={};SL={};MK={};UP={};TCH={};tchSig=null;PEND={};lastSig='';lastLeg='';LOGO='';
 $('#areas').innerHTML='';$('#admin').innerHTML='';$('#nav').innerHTML='';$('#app').hidden=true;$('#sname').value='';
 if(typeof stopAdmin==='function')stopAdmin()}

/* ================= ක්ෂේත්‍ර 2: ඇගයීමට ලක්වන ගුරුවරු (අවශ්‍ය පරිදි එක් කරන්න) ================= */
const tchIds=()=>Object.keys(TCH).sort((x,y)=>(TCH[x].ts||0)-(TCH[y].ts||0));
const tchName=t=>((TCH[t]&&TCH[t].n)||'').trim()||('ගුරු '+String(tchIds().indexOf(t)+1).padStart(2,'0'));
const saveTch=id=>{if(TCH[id])areaRef(2).set({tch:{[id]:TCH[id]}},{merge:true}).catch(fail)};
const tchW={};
function renderTeachers(){
 const el=document.getElementById('tch2');if(!el)return;
 const ae=document.activeElement;if(el.contains(ae)&&/INPUT/.test(ae.tagName))return;
 const ids=tchIds();
 el.innerHTML=`<h4 class="ch">👩‍🏫 ඇගයීමට ලක්වන ගුරුවරු</h4><p class="sub" style="margin:2px 14px 8px">ඇගයීම් ආකෘතියේ ගුරු 01, 02… ලෙස එක් එක් ගුරුවරයා අවශ්‍ය පරිදි එක් කරන්න (සංඛ්‍යාවට සීමාවක් නැත). ඒ ඒ වැඩසටහනට ගුරුවරයා තෝරා දිය හැකි අතර, ඇඩ්මින් දර්ශකයට ගුරුවරයා අනුව ලකුණු දේ.</p>`+
  (ids.length?ids.map((t,i)=>{const T=TCH[t];return `<div class="trow"><span class="tn">${i+1}</span><input class="tchin" data-t="${t}" data-f="n" placeholder="ගුරුභවතාගේ නම" value="${esc(T.n)}"><input class="tchin" data-t="${t}" data-f="s" placeholder="විෂයය" value="${esc(T.s)}"><input class="tchin" data-t="${t}" data-f="g" placeholder="ශ්‍රේණිය" value="${esc(T.g)}"><input class="tchin" data-t="${t}" data-f="p" placeholder="කාලච්ඡේදය" value="${esc(T.p)}"><button class="x" data-tdel="${t}" title="ඉවත් කරන්න">✕</button></div>`}).join(''):'<div class="empty" style="margin:4px 14px">තවම ගුරුවරු එක් කර නැත</div>')+
  `<div class="addrow"><button class="addprog" id="tchAdd">➕ ගුරුවරයෙකු එක් කරන්න</button></div>`;
 const sig=ids.map(t=>t+':'+tchName(t)).join('|');
 if(sig!==tchSig){tchSig=sig;renderProgs();renderTchMarks()}}
function renderTchMarks(){
 if(!isAdmin())return;
 const ae=document.activeElement;if(ae&&ae.classList&&ae.classList.contains('mkin')&&ae.closest('[data-tm]'))return;
 const ids=tchIds();
 document.querySelectorAll('[data-tm]').forEach(el=>{const k=el.dataset.tm;
  el.innerHTML='<b>🛡️ ලකුණු</b>'+(ids.length?ids.map(t=>`<label class="tmk" title="${esc(tchName(t))}"><span>${esc(tchName(t))}</span>${mkIn(2,k+'@'+t,'o','type="number" min="0" max="'+DEF_MAX+'" step="0.5" placeholder="0–'+DEF_MAX+'"')}</label>`).join('')+`<span>/ ${DEF_MAX}</span><span class="apc" data-pc="${k}"></span>`+mkIn(2,k,'t','placeholder="සටහන (අවශ්‍ය නම්)"'):'<span>ලකුණු දීමට ඉහත “ඇගයීමට ලක්වන ගුරුවරු” කොටසට ගුරුවරුන් එක් කරන්න</span>')});
 if(typeof refreshMarks==='function')refreshMarks()}
document.addEventListener('input',e=>{const t=e.target;if(!t.classList||!t.classList.contains('tchin'))return;const id=t.dataset.t;if(!TCH[id])return;
 TCH[id][t.dataset.f]=t.value;(tchW[id]=tchW[id]||later(saveTch,700))(id)});
document.addEventListener('focusout',e=>{if(e.target.classList&&e.target.classList.contains('tchin'))setTimeout(renderTeachers,1000)});
document.addEventListener('click',e=>{
 if(e.target.closest&&e.target.closest('#tchAdd')){const id='t'+Date.now().toString(36);TCH[id]={n:'',s:'',g:'',p:'',ts:Date.now()};saveTch(id);renderTeachers();
  const f=document.querySelector('.tchin[data-t="'+id+'"][data-f="n"]');if(f)f.focus();return}
 const d=e.target.closest&&e.target.closest('[data-tdel]');
 if(d&&confirm('මෙම ගුරුවරයා ඉවත් කරන්නද? (ඔහුට දුන් ලකුණු සාමාන්‍යයට ගණන් නොගනී)')){const id=d.dataset.tdel;delete TCH[id];areaRef(2).set({tch:{[id]:FV().delete()}},{merge:true}).catch(fail);renderTeachers()}});
