/* ================================================================
   පිවිසුම (Firebase Authentication) + පරිශීලක තත්ත්වය
   - ගුරුවරයා: ඊමේල්/මුරපදය හෝ Google → ඇඩ්මින් ප්‍රමිතියක් දුන් පසු පමණක් ප්‍රවේශය
   - ඇඩ්මින්: SUPER_ADMINS ලැයිස්තුවේ ඊමේල් (Google) හෝ ඇඩ්මින් විසින් ඇඩ්මින් ලෙස සකසන ලද අය
   ================================================================ */
let auth=null,unsubMe=null,pendingName='',pendingArea=0,mode='in',curKey='';
const SETUP_OK=!/^YOUR_/.test(FIREBASE_CONFIG.apiKey||'YOUR_');
const AERR={
 'auth/invalid-credential':'ඊමේල් ලිපිනය හෝ මුරපදය වැරදියි.','auth/wrong-password':'මුරපදය වැරදියි.','auth/user-not-found':'මෙම ඊමේල් ලිපිනයෙන් ගිණුමක් නැත.',
 'auth/email-already-in-use':'මෙම ඊමේල් ලිපිනය දැනටමත් ලියාපදිංචි කර ඇත – “පිවිසෙන්න” භාවිත කරන්න.','auth/weak-password':'මුරපදයේ අක්ෂර අවම වශයෙන් 6ක් තිබිය යුතුයි.',
 'auth/invalid-email':'ඊමේල් ලිපිනය වැරදියි.','auth/too-many-requests':'උත්සාහ කිරීම් වැඩියි. මොහොතකින් නැවත උත්සාහ කරන්න.','auth/network-request-failed':'අන්තර්ජාල සම්බන්ධතාව පරීක්ෂා කරන්න.',
 'auth/unauthorized-domain':'මෙම වෙබ් ලිපිනය Firebase → Authentication → Settings → Authorized domains වෙත එක් කරන්න.','auth/operation-not-allowed':'Firebase Console හි මෙම පිවිසුම් ක්‍රමය සක්‍රීය කර නැත.'};
const aerr=(m,ok)=>{const e=$('#aErr');e.textContent=m||'';e.classList.toggle('aok',!!ok)};
const errMsg=e=>AERR[e&&e.code]||('දෝෂයක්: '+((e&&(e.code||e.message))||e));

function screen(n){document.body.classList.remove('boot');$('#auth').hidden=n!=='auth';$('#wait').hidden=n!=='wait';$('#app').hidden=n!=='app'}
function setMode(m){mode=m;document.querySelectorAll('.atabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===m));
 $('#aName').hidden=m!=='up';$('#aArea').hidden=m!=='up';$('#aGo').textContent=m==='up'?'ලියාපදිංචි වන්න':'පිවිසෙන්න';$('#aPass').autocomplete=m==='up'?'new-password':'current-password';$('#aReset').hidden=m==='up';aerr('')}

function bindAuth(){
 $('#aArea').innerHTML='<option value="">— ඔබේ ප්‍රමිතිය තෝරන්න —</option>'+AREAS.map(a=>`<option value="${a.n}">${a.ic} ${a.n}. ${a.name}</option>`).join('');
 document.querySelectorAll('.atabs button').forEach(b=>b.onclick=()=>setMode(b.dataset.t));
 $('#fAuth').onsubmit=async e=>{e.preventDefault();if(!SETUP_OK)return aerr('Firebase සැකසුම් ගොනුව තවම පුරවා නැත.');
  const mail=$('#aMail').value.trim(),pw=$('#aPass').value,nm=$('#aName').value.trim();
  if(!mail||!pw)return aerr('ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.');
  if(mode==='up'&&!nm)return aerr('ඔබේ නම ඇතුළත් කරන්න.');
  if(mode==='up'&&!$('#aArea').value)return aerr('ඔබේ ප්‍රමිතිය තෝරන්න.');
  $('#aGo').disabled=true;aerr('');
  try{if(mode==='up'){pendingName=nm;pendingArea=+$('#aArea').value;await auth.createUserWithEmailAndPassword(mail,pw)}else await auth.signInWithEmailAndPassword(mail,pw)}
  catch(x){
   if(mode==='up'&&x.code==='auth/email-already-in-use'){try{await auth.signInWithEmailAndPassword(mail,pw);return}catch(y){}}
   aerr(errMsg(x))}finally{$('#aGo').disabled=false}};
 $('#aGoogle').onclick=async()=>{if(!SETUP_OK)return aerr('Firebase සැකසුම් ගොනුව තවම පුරවා නැත.');if(mode==='up'&&!$('#aArea').value)return aerr('පළමුව ඔබේ ප්‍රමිතිය තෝරන්න.');
  pendingArea=mode==='up'?+$('#aArea').value:0;aerr('');
  try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}catch(x){if(x.code!=='auth/popup-closed-by-user'&&x.code!=='auth/cancelled-popup-request')aerr(errMsg(x))}};
 $('#aReset').onclick=async()=>{const m=$('#aMail').value.trim();if(!m)return aerr('පළමුව ඊමේල් ලිපිනය ඇතුළත් කරන්න.');
  try{await auth.sendPasswordResetEmail(m);aerr('මුරපදය යළි සැකසීමේ සබැඳිය ඊමේල් වෙත යවන ලදී.',true)}catch(x){aerr(errMsg(x))}};
 $('#waitOut').onclick=()=>auth.signOut()}

/* පරිශීලක ලේඛනය සකසා ගැනීම */
async function ensureUser(u){
 const ref=fs.collection('users').doc(u.uid),snap=await ref.get();if(snap.exists)return;
 const mail=(u.email||'').toLowerCase(),sup=SUPER_ADMINS.map(x=>x.toLowerCase()).includes(mail)&&u.emailVerified;
 await ref.set({name:pendingName||u.displayName||mail.split('@')[0],email:mail,role:sup?'admin':'teacher',status:sup?'active':'pending',area:null,reqArea:(!sup&&pendingArea>=1&&pendingArea<=8)?pendingArea:null,createdAt:Date.now()});pendingName='';pendingArea=0}

function route(u,me){
 if(!me){return}
 ME={uid:u.uid,...me};
 const ok=me.role==='admin'||(me.status==='active'&&me.area>=1&&me.area<=8);
 if(!ok){
  if(curKey!=='wait'){stopAppKeepUser();curKey='wait'}
  const dis=me.status==='disabled';
  $('#waitT').textContent=dis?'ප්‍රවේශය අක්‍රියයි':me.status==='active'?'ප්‍රමිතිය තවම ලබා දී නැත':'අනුමැතිය බලාපොරොත්තුවෙන්';
  $('#waitB').innerHTML=`<b>${esc(me.name||'')}</b> (${esc(me.email)})<br>`+((!dis&&me.reqArea&&AREAS[me.reqArea-1])?`ඔබ ඉල්ලූ ප්‍රමිතිය: <b>${me.reqArea}. ${esc(AREAS[me.reqArea-1].name)}</b><br>`:'')+(dis?'ඔබගේ ගිණුම ඇඩ්මින් විසින් අක්‍රිය කර ඇත.':'ඔබගේ ගිණුම ලියාපදිංචි විය. ඇඩ්මින් විසින් ඔබට <b>ප්‍රමිතියක්</b> ලබා දුන් විට මෙම පිටුව ස්වයංක්‍රීයව විවෘත වේ.');
  screen('wait');return}
 const key=me.role+':'+(me.area||'all');
 if(curKey===key){ME={uid:u.uid,...me};return}      // වෙනසක් නැත
 if(curKey&&curKey!=='wait')stopAppKeepUser();
 curKey=key;screen('app');startApp()}
function stopAppKeepUser(){const keep=ME;stopApp();ME=keep}

function boot(){
 bindAuth();setMode('in');
 if(!SETUP_OK){$('#setupWarn').hidden=false;screen('auth');return}
 firebase.initializeApp(FIREBASE_CONFIG);auth=firebase.auth();fs=firebase.firestore();
 auth.languageCode='si';
 auth.onAuthStateChanged(async u=>{
  if(unsubMe){unsubMe();unsubMe=null}
  if(!u){stopApp();curKey='';screen('auth');return}
  try{await ensureUser(u)}catch(e){console.error(e);aerr('පරිශීලක ගිණුම සෑදීමට නොහැකි විය: '+(e.code||e.message));await auth.signOut();return}
  unsubMe=fs.collection('users').doc(u.uid).onSnapshot(s=>{
   if(!s.exists){auth.signOut();return}
   route(u,s.data())},e=>{console.error(e);aerr('ගිණුම කියවීමට නොහැකි විය: '+(e.code||e.message));auth.signOut()})})}
boot();
