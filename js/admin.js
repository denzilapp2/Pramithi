/* ================================================================
   ඇඩ්මින් පැනලය – 📊 ලකුණු යෙදීම · 👥 ගුරුවරු කළමනාකරණය
   ලකුණු: ඒ ඒ නිර්ණායකයට ලබාගත් ලකුණු / උපරිම ලකුණු (නිර්ණායක දර්ශක 1ක් = ලකුණු 6)
   ================================================================ */
let USERS=[],adminTab='marks',lastAdminSig='';
const DEF_MAX=6;
const GRADES=[[90,'විශිෂ්ටයි','#2e9e4f'],[75,'ඉතා හොඳයි','#4a9d3f'],[60,'හොඳයි','#1f8fd0'],[45,'සාමාන්‍යයි','#d9a60f'],[25,'සංවර්ධනය විය යුතුයි','#e8782a'],[0,'ඉතා ඉක්මනින් සංවර්ධනය විය යුතුයි','#e0527a']];
const gradeOf=p=>GRADES.find(g=>p>=g[0]);
const pillH=p=>{if(p==null)return '';const g=gradeOf(p);return `<span class="pill" style="background:${g[2]}">${g[1]}</span>`};
const r1=n=>Math.round(n*10)/10;

/* ---------- ලකුණු දත්ත ---------- */
const mk=(a,k)=>((MK[a]||{})[enc(k)])||{};
function critMarks(a,k){
 if(isIndId(k)){const r=mk(a,k),has=r.o!=null&&r.o!==''&&!isNaN(r.o);return{has,o:has?+r.o:0,x:DEF_MAX,t:r.t||'',p:has?r1(r.o/DEF_MAX*100):null,over:has&&+r.o>DEF_MAX}}
 const ind=IND[k];
 if(ind){let o=0,c=0;ind.forEach(i=>{const r=mk(a,i.id);if(r.o!=null&&r.o!==''&&!isNaN(r.o)){o+=+r.o;c++}});
  if(c){const x=c*DEF_MAX;return{has:true,o,x,t:'',p:r1(o/x*100),over:false,c,all:ind.length}}}
 const r=mk(a,k),has=r.o!=null&&r.o!==''&&!isNaN(r.o),x=r.x>0?+r.x:DEF_MAX;return{has,o:has?+r.o:0,x,t:r.t||'',p:has?r1(r.o/x*100):null,over:has&&+r.o>x}}
function areaMarks(n){let o=0,x=0,c=0;CRIT[n].forEach((_,i)=>{const m=critMarks(n,n+'.'+(i+1));if(m.has){o+=m.o;x+=m.x;c++}});return{o:r1(o),x:r1(x),c,n:CRIT[n].length,p:x?r1(o/x*100):null}}
function doWriteMark(a,k,f,v){
 const val=(f==='t')?(v||FV().delete()):(v===''||v==null||isNaN(v)?FV().delete():+v);
 fs.collection('marks').doc(String(a)).set({m:{[enc(k)]:{[f]:val}},by:ME.uid,ts:Date.now()},{merge:true}).catch(fail)}
const wm={};
function setMark(a,k,f,v){const key=a+'|'+k+'|'+f;
 const row=(MK[a]=MK[a]||{}),r=(row[enc(k)]=row[enc(k)]||{});
 if(f==='t'){if(v)r.t=v;else delete r.t}else{if(v===''||isNaN(v))delete r[f];else r[f]=+v}
 (wm[key]=wm[key]||later(doWriteMark,600))(a,k,f,v)}

/* ---------- සියලු ලකුණු UI යාවත්කාලීන කිරීම ---------- */
function refreshMarks(){
 document.querySelectorAll('.mkin').forEach(e=>{if(document.activeElement===e)return;const r=mk(+e.dataset.a,e.dataset.k),f=e.dataset.f;e.value=r[f]==null?'':r[f]});
 visAreas().forEach(a=>{
  CRIT[a.n].forEach((_,i)=>{const k=a.n+'.'+(i+1);
   [k].concat(IND[k]?IND[k].map(x=>x.id):[]).forEach(u=>{const m=critMarks(a.n,u);
    document.querySelectorAll(`.apc[data-pc="${u}"]`).forEach(pc=>{pc.textContent=m.has?m.p+'%':'';pc.hidden=!m.has});
    document.querySelectorAll(`.mkin[data-k="${u}"][data-f="o"],.mkin[data-k="${u}"][data-f="x"]`).forEach(e=>e.classList.toggle('over',m.over));
    document.querySelectorAll(`[data-tpc="${u}"]`).forEach(x=>{x.textContent=m.has?m.p+'%':'—'});
    document.querySelectorAll(`[data-tot="${u}"]`).forEach(x=>{x.textContent=m.has?r1(m.o)+' / '+m.x:'—'});
    const mv=document.getElementById('mv'+u);if(mv){mv.hidden=!m.has;if(m.has)mv.innerHTML=`🛡️ <b>ඇඩ්මින් ලකුණු: ${r1(m.o)} / ${m.x}</b> (${m.p}%) ${pillH(m.p)}${m.t?`<span>· ${esc(m.t)}</span>`:''}`}})});
  const am=areaMarks(a.n),pe=document.getElementById('am'+a.n);
  if(pe){pe.hidden=am.p==null;if(am.p!=null){const g=gradeOf(am.p);pe.style.background=g[2];pe.textContent=`ලකුණු ${am.p}% · ${g[1]}`}}});
 if(isAdmin())renderAdmin(true)}

/* ================= ඇඩ්මින් පැනල HTML ================= */
function marksTable(){
 let totO=0,totX=0,marked=0,all=0,evd=0;
 const inp=(a,k)=>mkIn(a,k,'o','type="number" min="0" max="'+DEF_MAX+'" step="0.5"');
 const body=AREAS.map(a=>{const am=areaMarks(a.n);totO+=am.o;totX+=am.x;marked+=am.c;all+=am.n;
  const rows=CRIT[a.n].map((t,i)=>{const k=a.n+'.'+(i+1),m=critMarks(a.n,k),ind=IND[k],fl=items.filter(x=>inCrit(String(x.pk),k)).length;if(fl)evd++;
   const fc=n=>n?n:'<span class="bad">0</span>';
   if(!ind){const pl=getP(k);
    return `<tr><td>${k}</td><td class="l">${esc(t)}</td><td>${pl.length}</td><td>${fc(fl)}</td><td>${mkIn(a.n,k,'o','type="number" min="0" step="0.5"')}</td><td>${mkIn(a.n,k,'x','type="number" min="1" step="0.5" placeholder="'+DEF_MAX+'"')}</td><td data-tpc="${k}">${m.has?m.p+'%':'—'}</td><td class="l">${mkIn(a.n,k,'t','placeholder="සටහන"').replace('class="mkin ant"','class="mkin mkt"')}</td></tr>`}
   let h=`<tr class="cr"><td>${k}</td><td class="l">${esc(t)}</td><td>${ind.reduce((n,x)=>n+getP(x.id).length,0)}</td><td>${fc(fl)}</td><td colspan="2" data-tot="${k}">${m.has?r1(m.o)+' / '+m.x:'—'}</td><td data-tpc="${k}">${m.has?m.p+'%':'—'}</td><td class="l"><span class="tag">දර්ශක ලකුණු වල එකතුව</span></td></tr>`;
   ind.forEach(x=>{const im=critMarks(a.n,x.id),f2=items.filter(y=>inCrit(String(y.pk),x.id)).length;
    h+=`<tr><td>${x.id}</td><td class="l">${indHTML(x)}</td><td>${getP(x.id).length}</td><td>${fc(f2)}</td><td>${inp(a.n,x.id)}</td><td>${DEF_MAX}</td><td data-tpc="${x.id}">${im.has?im.p+'%':'—'}</td><td class="l">${mkIn(a.n,x.id,'t','placeholder="සටහන"').replace('class="mkin ant"','class="mkin mkt"')}</td></tr>`});
   return h}).join('');
  return `<tr class="ah" style="--c:${a.c}"><td colspan="4">${a.ic} ${a.n}. ${esc(a.name)}</td><td colspan="4" style="text-align:right">${am.c?`ලකුණු ${am.o} / ${am.x} · <b>${am.p}%</b> ${pillH(am.p)}`:'<span style="opacity:.85">ලකුණු යොදා නැත</span>'}</td></tr>`+rows}).join('');
 const p=totX?r1(totO/totX*100):null;
 return `<div class="kpis"><div class="kpi"><small>සමස්ත ලකුණු ප්‍රතිශතය</small><b>${p==null?'—':p+'%'}</b></div><div class="kpi"><small>සමස්ත ශ්‍රේණිය</small><b style="font-size:19px">${p==null?'—':gradeOf(p)[1]}</b></div><div class="kpi"><small>ලකුණු යොදා ඇති නිර්ණායක</small><b>${marked} / ${all}</b></div><div class="kpi"><small>සාක්ෂි ඇති නිර්ණායක</small><b>${evd} / ${all}</b></div></div>
 <p class="note" style="text-align:left;margin:0 0 10px">ක්ෂේත්‍ර 1–8 හි <b>සෑම දර්ශකයකටම</b> (3.1.1, 3.1.2 …) ලකුණු 0–${DEF_MAX} අතර ඇතුළත් කරන්න (6 = විශිෂ්ටයි). නිර්ණායකයේ මුළු ලකුණු ස්වයංක්‍රීයව දර්ශක ලකුණු වල එකතුව වේ; එය ඇගයීම් ආකෘතියේ “නිර්ණායකයට අදාළ මුළු ලකුණු” කොටුවටත්, දර්ශක කොටු වලටත් ආකෘතියට යයි. ගුරුවරුන්ට ඔවුන්ගේ ප්‍රමිතියේ ලකුණු බැලිය හැක (වෙනස් කළ නොහැක).</p>
 <div class="tw"><table><thead><tr><th>#</th><th>නිර්ණායකය / දර්ශකය</th><th>වැඩසටහන්</th><th>ගොනු</th><th>ලබාගත් ලකුණු</th><th>උපරිම</th><th>%</th><th>සටහන</th></tr></thead><tbody>${body}<tr class="tot"><td colspan="4" class="l">සමස්ත එකතුව</td><td>${r1(totO)}</td><td>${r1(totX)}</td><td>${p==null?'—':p+'%'}</td><td class="l">${pillH(p)}</td></tr></tbody></table></div>
 <div class="admrow"><button class="pdfbtn all" id="mkCsv">⬇️ ලකුණු CSV ලෙස බාගන්න</button><button class="pdfbtn all" id="mkPrint">🖨️ මුද්‍රණය</button></div>`}
const ROLE_L={teacher:'ගුරුවරයා',admin:'ඇඩ්මින්'},ST_L={active:'අනුමතයි',pending:'අනුමැතිය බලාපොරොත්තුවෙන්',disabled:'අක්‍රියයි'};
function usersTable(){
 if(!USERS.length)return '<p class="note">තවම පරිශීලකයින් නැත.</p>';
 const opt=(arr,sel)=>arr.map(([v,l])=>`<option value="${v}"${String(v)===String(sel)?' selected':''}>${l}</option>`).join('');
 const areaOpts=[['','— තෝරන්න —']].concat(AREAS.map(a=>[a.n,a.n+'. '+a.name]));
 const list=USERS.slice().sort((x,y)=>(x.status==='pending'?0:1)-(y.status==='pending'?0:1)||String(x.name).localeCompare(String(y.name)));
 return `<p class="note" style="text-align:left;margin:0 0 10px">ලියාපදිංචි වන ගුරුවරුන් මුලින් <b>අනුමැතිය බලාපොරොත්තුවෙන්</b> පවතී. ඔවුන්ට <b>ප්‍රමිතියක්</b> තෝරා දුන් විට ස්වයංක්‍රීයව අනුමත වේ. එක් ප්‍රමිතියකට ගුරුවරුන් කිහිප දෙනෙකුට ද ප්‍රවේශය දිය හැක.</p>
 <div class="tw"><table><thead><tr><th>නම / ඊමේල්</th><th>භූමිකාව</th><th>ප්‍රමිතිය</th><th>තත්ත්වය</th><th></th></tr></thead><tbody>${list.map(u=>{const me=u.id===ME.uid;
  return `<tr class="${u.status==='pending'?'pend':''}" data-u="${u.id}"><td class="l"><b>${esc(u.name||'—')}</b>${me?' <span class="tag">(ඔබ)</span>':''}<br><span class="tag">${esc(u.email)}</span>${u.reqArea&&AREAS[u.reqArea-1]?`<br><span class="tag">📌 ඉල්ලූ ප්‍රමිතිය: <b>${u.reqArea}. ${esc(AREAS[u.reqArea-1].name)}</b></span>`:''}</td>
  <td><select data-uf="role"${me?' disabled':''}>${opt(Object.entries(ROLE_L),u.role)}</select></td>
  <td><select data-uf="area"${u.role==='admin'?' disabled':''}>${opt(areaOpts,u.area==null?'':u.area)}</select></td>
  <td><select data-uf="status"${me?' disabled':''}>${opt(Object.entries(ST_L),u.status)}</select></td>
  <td>${u.status==='pending'&&u.reqArea&&AREAS[u.reqArea-1]?'<button class="pdfbtn" style="--c:#2e9e4f" data-uok="'+u.id+'">✅ අනුමත කරන්න</button> ':''}${me?'':'<button class="pdfbtn" style="--c:#e0527a" data-udel="'+u.id+'">🗑️</button>'}</td></tr>`}).join('')}</tbody></table></div>`}
function listenUsers(U,er){U(fs.collection('users').onSnapshot(s=>{USERS=s.docs.map(d=>({id:d.id,...d.data()}));renderAdmin(true)},er))}

let adminBound=false;
function renderAdmin(soft){
 const root=$('#admin');if(!root||!isAdmin())return;
 const pend=USERS.filter(u=>u.status==='pending').length;
 const nb=document.getElementById('navPend');if(nb){nb.hidden=!pend;nb.textContent=pend}
 if(root.hidden&&soft)return;                      // පෙනෙන්නේ නැතිනම් යාවත්කාලීන නොකරන්න
 if(!root.dataset.ready){root.innerHTML=`<h3>🛡️ ඇඩ්මින් පැනලය</h3><div class="atab"><button data-at="marks">📊 ලකුණු යෙදීම</button><button data-at="users">👥 ගුරුවරු <span class="bdg" id="pendBdg" hidden></span></button></div><div id="adminBody"></div>`;root.dataset.ready=1}
 root.querySelectorAll('.atab button').forEach(b=>b.classList.toggle('on',b.dataset.at===adminTab));
 const pb=$('#pendBdg');pb.hidden=!pend;pb.textContent=pend;
 const body=$('#adminBody');
 // සංස්කරණයේ යෙදී සිටින විට (focus) තාවකාලිකව නැවත නොඅඳින්න
 const ae=document.activeElement;if(soft&&ae&&root.contains(ae)&&/INPUT|SELECT/.test(ae.tagName))return;
 const sig=adminTab+'|'+(adminTab==='marks'?JSON.stringify(MK)+items.length+JSON.stringify(PR):JSON.stringify(USERS));
 if(soft&&sig===lastAdminSig&&body.innerHTML)return;lastAdminSig=sig;
 body.innerHTML=adminTab==='marks'?marksTable():usersTable();
 if(adminTab==='marks'){$('#mkCsv').onclick=exportMarksCsv;$('#mkPrint').onclick=printMarks;refreshMarkInputs()}
 else bindUsers()}
function refreshMarkInputs(){$('#adminBody').querySelectorAll('.mkin').forEach(e=>{const r=mk(+e.dataset.a,e.dataset.k),f=e.dataset.f;e.value=r[f]==null?'':r[f];
 if(f==='o'||f==='x')e.classList.toggle('over',critMarks(+e.dataset.a,e.dataset.k).over)})}
/* ---------- අනුමත කළ ගුරුවරයා ප්‍රමිතියේ සාමාජික ලැයිස්තුවට එක් කිරීම ---------- */
const memRef=id=>fs.collection('members').doc('u_'+id);
async function syncTeacher(u,n){
 const ref=memRef(u.id),s=await ref.get();
 if(s.exists)await ref.update({area:n});
 else await ref.set({area:n,name:u.name||(u.email||'').split('@')[0],role:'ගුරුවරයා',photo:'',uid:u.id,ts:Date.now(),by:ME.uid})}
const unsyncTeacher=id=>memRef(id).delete().catch(()=>{});
function applyUser(u,upd){
 fs.collection('users').doc(u.id).update(upd)
  .then(()=>{if(upd.area)return syncTeacher(u,upd.area);if('area' in upd)return unsyncTeacher(u.id)})
  .then(()=>{if(upd.area)toast('✅ '+(u.name||u.email)+' ප්‍රමිතිය '+upd.area+' හි ගුරු ලැයිස්තුවට එක් කරන ලදී')}).catch(fail)}
function bindUsers(){
 document.querySelectorAll('#adminBody select[data-uf]').forEach(s=>s.onchange=()=>{
  const id=s.closest('tr').dataset.u,f=s.dataset.uf,u=USERS.find(x=>x.id===id);if(!u)return;
  const upd={};
  if(f==='area'){upd.area=s.value===''?null:+s.value;if(upd.area&&u.status==='pending')upd.status='active'}
  else if(f==='role'){upd.role=s.value;if(s.value==='admin'){upd.status='active';upd.area=null}}
  else upd.status=s.value;
  applyUser(u,upd)});
 document.querySelectorAll('#adminBody [data-uok]').forEach(b=>b.onclick=()=>{const u=USERS.find(x=>x.id===b.dataset.uok);if(u&&u.reqArea)applyUser(u,{status:'active',area:u.reqArea})});
 document.querySelectorAll('#adminBody [data-udel]').forEach(b=>b.onclick=()=>{const u=USERS.find(x=>x.id===b.dataset.udel);
  if(u&&confirm('“'+(u.name||u.email)+'” ගේ ප්‍රවේශය ඉවත් කරන්නද?\n(ඔහුගේ ඉහත ඇතුළත් කළ සාක්ෂි ඉවත් නොවේ.)'))fs.collection('users').doc(u.id).delete().then(()=>unsyncTeacher(u.id)).catch(fail)})}

/* ---------- CSV / මුද්‍රණය ---------- */
function exportMarksCsv(){
 const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"',rows=[['ක්ෂේත්‍රය','නිර්ණායකය / දර්ශකය','විස්තරය','වැඩසටහන්','ගොනු','ලබාගත් ලකුණු','උපරිම','ප්‍රතිශතය','සටහන']];
 AREAS.forEach(a=>CRIT[a.n].forEach((t,i)=>{const k=a.n+'.'+(i+1),m=critMarks(a.n,k),ind=IND[k];
  rows.push([a.n+'. '+a.name,k,t,ind?ind.reduce((n,x)=>n+getP(x.id).length,0):getP(k).length,items.filter(x=>inCrit(String(x.pk),k)).length,m.has?m.o:'',m.has?m.x:'',m.has?m.p+'%':'',m.t]);
  if(ind)ind.forEach(x=>{const im=critMarks(a.n,x.id);rows.push([a.n+'. '+a.name,x.id,(x.lab?x.lab+' '+x.txt:'(දර්ශකය)'),getP(x.id).length,items.filter(y=>inCrit(String(y.pk),x.id)).length,im.has?im.o:'',im.has?im.x:'',im.has?im.p+'%':'',im.t])})}));
 const blob=new Blob(['﻿'+rows.map(r=>r.map(q).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download='ලකුණු-'+(($('#syear').value)||new Date().getFullYear())+'.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function printMarks(){
 const sn=esc(($('#sname').value||'').trim())||'පාසල',yr=$('#syear').value||new Date().getFullYear();
 const rows=AREAS.map(a=>{const am=areaMarks(a.n);return `<h3 style="font-family:var(--fh);color:${a.c};margin:14px 0 4px">${a.ic} ${a.n}. ${esc(a.name)} — ${am.c?`${am.o} / ${am.x} (${am.p}%) · ${gradeOf(am.p)[1]}`:'ලකුණු යොදා නැත'}</h3><table style="width:100%;border-collapse:collapse;font-size:10.5pt">`+CRIT[a.n].map((t,i)=>{const k=a.n+'.'+(i+1),m=critMarks(a.n,k);const td='border:1px solid #bbb;padding:3px 6px',ind=IND[k];return `<tr><td style="${td};width:44px">${k}</td><td style="${td}"><b>${esc(t)}</b>${m.t?`<br><i style="color:#555">${esc(m.t)}</i>`:''}</td><td style="${td};width:90px;text-align:center">${m.has?r1(m.o)+' / '+m.x:'—'}</td></tr>`+(ind?ind.map(x=>{const im=critMarks(a.n,x.id);return `<tr><td style="${td};font-size:9.5pt">${x.id}</td><td style="${td};font-size:9.5pt">${x.txt?esc((x.lab||'')+' '+x.txt):'දර්ශකය'}${im.t?` – <i>${esc(im.t)}</i>`:''}</td><td style="${td};text-align:center;font-size:9.5pt">${im.has?r1(im.o)+' / '+im.x:'—'}</td></tr>`}).join(''):'')}).join('')+'</table>'}).join('');
 let tO=0,tX=0;AREAS.forEach(a=>{const m=areaMarks(a.n);tO+=m.o;tX+=m.x});const p=tX?r1(tO/tX*100):null;
 const root=$('#printRoot');root.innerHTML=`<div style="padding:4mm"><h2 style="font-family:var(--fh);margin:0">${sn} – ${yr} ගුණාත්මක ඇගයීම් ලකුණු සාරාංශය</h2><p style="margin:2px 0 6px">සමස්ත: <b>${p==null?'—':p+'% · '+gradeOf(p)[1]}</b></p>${rows}</div>`;
 const old=document.title;document.title=`${yr} - ලකුණු සාරාංශය`;const done=()=>{window.removeEventListener('afterprint',done);root.innerHTML='';document.title=old};window.addEventListener('afterprint',done);setTimeout(()=>window.print(),80)}

/* ---------- සිදුවීම් (delegation) ---------- */
document.addEventListener('input',e=>{const t=e.target;if(!t.classList||!t.classList.contains('mkin')||!isAdmin())return;
 setMark(+t.dataset.a,t.dataset.k,t.dataset.f,t.value);
 const m=critMarks(+t.dataset.a,t.dataset.k);document.querySelectorAll(`.mkin[data-k="${t.dataset.k}"][data-f="o"],.mkin[data-k="${t.dataset.k}"][data-f="x"]`).forEach(x=>x.classList.toggle('over',m.over));
 document.querySelectorAll(`.apc[data-pc="${t.dataset.k}"]`).forEach(x=>{x.textContent=m.has?m.p+'%':'';x.hidden=!m.has});
 document.querySelectorAll(`[data-tpc="${t.dataset.k}"]`).forEach(x=>{x.textContent=m.has?m.p+'%':'—'});refreshMarks()});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.atab button');if(b&&b.dataset.at){adminTab=b.dataset.at;lastAdminSig='';renderAdmin()}});
function stopAdmin(){USERS=[];lastAdminSig='';const r=$('#admin');if(r){r.dataset.ready='';r.hidden=true}}
