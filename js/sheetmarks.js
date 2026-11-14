/* ================================================================
   ඇගයීම් ආකෘති (ලකුණු කොළ) මත ඇඩ්මින් ලකුණු ස්වයංක්‍රීයව ඇඳීම
   - 3–8 ක්ෂේත්‍ර: "නිර්ණායකයට අදාළ මුළු ලකුණු" කොටුව + "මුළු ලකුණු" + පහළ සාරාංශ කොටුව
   - 1 ක්ෂේත්‍රය: ආකෘති 01-A (නිර්ණායක 1.1) සහ 01-B (නිර්ණායක 1.2–1.5) සාරාංශ කොටු
   - 2 ක්ෂේත්‍රය: සාරාංශ කොටුව (ගුරු 01 තීරුව)
   ඛණ්ඩාංක = ආකෘති පින්තූරයේ (978×1380) පික්සල්
   ================================================================ */
const SHEETMAP={"3":[{"p":0,"cells":[{"t":"c","k":"3.1","r":[782,525,890,558]},{"t":"c","k":"3.2","r":[782,764,890,798]},{"t":"c","k":"3.3","r":[782,1031,890,1069]},{"t":"c","k":"3.4","r":[782,1254,890,1290]}]},{"p":1,"cells":[{"t":"c","k":"3.5","r":[782,293,890,320]},{"t":"c","k":"3.6","r":[782,457,890,484]},{"t":"c","k":"3.7","r":[782,696,890,723]},{"t":"c","k":"3.8","r":[782,913,890,940]},{"t":"ao","r":[782,940,890,966]},{"t":"bn","r":[86,1099,255,1149]},{"t":"bx","r":[255,1099,591,1149]},{"t":"bo","r":[591,1099,748,1149]},{"t":"bp","r":[748,1099,892,1149]}]}],"4":[{"p":0,"cells":[{"t":"c","k":"4.1","r":[797,570,890,606]},{"t":"c","k":"4.2","r":[797,796,890,832]},{"t":"c","k":"4.3","r":[797,971,890,1009]},{"t":"c","k":"4.4","r":[797,1253,890,1288]}]},{"p":1,"cells":[{"t":"c","k":"4.5","r":[770,182,890,209]},{"t":"ao","r":[770,209,890,235]},{"t":"bn","r":[86,339,249,390]},{"t":"bx","r":[249,339,586,390]},{"t":"bo","r":[586,339,729,390]},{"t":"bp","r":[729,339,890,390]}]}],"5":[{"p":0,"cells":[{"t":"c","k":"5.1","r":[819,559,890,590]},{"t":"c","k":"5.2","r":[819,728,890,759]},{"t":"c","k":"5.3","r":[819,897,890,927]},{"t":"c","k":"5.4","r":[819,1044,890,1076]},{"t":"c","k":"5.5","r":[819,1240,890,1276]}]},{"p":1,"cells":[{"t":"c","k":"5.6","r":[804,230,892,257]},{"t":"c","k":"5.7","r":[804,400,892,426]},{"t":"c","k":"5.8","r":[804,522,892,548]},{"t":"c","k":"5.9","r":[804,686,892,713]},{"t":"ao","r":[804,713,892,740]},{"t":"bn","r":[86,844,255,894]},{"t":"bx","r":[255,844,591,894]},{"t":"bo","r":[591,844,735,894]},{"t":"bp","r":[735,844,890,894]}]}],"6":[{"p":0,"cells":[{"t":"c","k":"6.1","r":[820,504,890,531]},{"t":"c","k":"6.2","r":[820,790,890,818]},{"t":"c","k":"6.3","r":[820,914,890,941]},{"t":"c","k":"6.4","r":[820,1116,890,1142]},{"t":"c","k":"6.5","r":[820,1266,890,1292]}]},{"p":1,"cells":[{"t":"c","k":"6.6","r":[834,207,891,238]},{"t":"c","k":"6.7","r":[834,475,891,509]},{"t":"c","k":"6.8","r":[834,699,891,729]},{"t":"c","k":"6.9","r":[834,867,891,897]},{"t":"c","k":"6.10","r":[834,1101,891,1132]},{"t":"c","k":"6.11","r":[834,1257,891,1290]}]},{"p":2,"cells":[{"t":"c","k":"6.12","r":[834,278,891,305]},{"t":"c","k":"6.13","r":[834,469,891,496]},{"t":"c","k":"6.14","r":[834,591,891,618]},{"t":"c","k":"6.15","r":[834,734,891,762]},{"t":"c","k":"6.16","r":[834,926,891,955]},{"t":"ao","r":[834,955,891,987]},{"t":"bn","r":[86,1092,255,1142]},{"t":"bx","r":[255,1092,591,1142]},{"t":"bo","r":[591,1092,740,1142]},{"t":"bp","r":[740,1092,890,1142]}]}],"7":[{"p":0,"cells":[{"t":"c","k":"7.1","r":[823,568,891,595]},{"t":"c","k":"7.2","r":[823,785,891,817]},{"t":"c","k":"7.3","r":[823,933,891,964]},{"t":"c","k":"7.4","r":[823,1080,891,1108]},{"t":"c","k":"7.5","r":[823,1257,891,1287]}]},{"p":1,"cells":[{"t":"c","k":"7.6","r":[808,299,890,325]},{"t":"c","k":"7.7","r":[808,579,890,606]},{"t":"c","k":"7.8","r":[808,860,890,887]},{"t":"ao","r":[808,887,890,914]},{"t":"bn","r":[86,1047,255,1097]},{"t":"bx","r":[255,1047,591,1097]},{"t":"bo","r":[591,1047,732,1097]},{"t":"bp","r":[732,1047,890,1097]}]}],"8":[{"p":0,"cells":[{"t":"c","k":"8.1","r":[816,622,892,649]},{"t":"c","k":"8.2","r":[816,835,892,862]},{"t":"c","k":"8.3","r":[816,1045,892,1076]},{"t":"c","k":"8.4","r":[816,1257,892,1290]}]},{"p":1,"cells":[{"t":"c","k":"8.5","r":[804,224,891,261]},{"t":"ao","r":[804,261,891,288]},{"t":"bn","r":[86,392,255,442]},{"t":"bx","r":[255,392,579,442]},{"t":"bo","r":[579,392,735,442]},{"t":"bp","r":[735,392,890,442]}]}],"1":[{"p":0,"cells":[{"t":"bn","r":[86,1079,255,1149],"keys":["1.1"]},{"t":"bx","r":[255,1079,591,1149],"keys":["1.1"]},{"t":"bo","r":[591,1079,736,1149],"keys":["1.1"]},{"t":"bp","r":[736,1079,890,1149],"keys":["1.1"]}]},{"p":4,"cells":[{"t":"bn","r":[86,1165,255,1196],"keys":["1.2","1.3","1.4","1.5"]},{"t":"bx","r":[255,1165,578,1196],"keys":["1.2","1.3","1.4","1.5"]},{"t":"bo","r":[578,1165,734,1196],"keys":["1.2","1.3","1.4","1.5"]},{"t":"bp","r":[734,1165,890,1196],"keys":["1.2","1.3","1.4","1.5"]}]}],"2":[{"p":1,"cells":[{"t":"ao","r":[705,940,750,967]},{"t":"bn","r":[663,1096,710,1122]},{"t":"bx","r":[663,1122,710,1149]},{"t":"bo","r":[663,1149,710,1176]},{"t":"bp","r":[663,1176,710,1203]}]}]};
const SHP={},SM_CACHE={};
const smNum=v=>v==null?'':String(Math.round(v*10)/10);
function sheetStat(a,keys){let o=0,x=0,c=0;CRIT[a].forEach((_,i)=>{const k=a+'.'+(i+1);if(keys&&!keys.includes(k))return;const m=critMarks(a,k);if(m.has){o+=m.o;x+=m.x;c++}});
 return{c,o:r1(o),x:r1(x),n:r1(x/DEF_MAX),p:x?r1(o/x*100):null}}
function sheetVal(a,cell){
 if(cell.t==='c'){const m=critMarks(a,cell.k);return m.has?smNum(m.o):''}
 const s=sheetStat(a,cell.keys);if(!s.c)return '';
 return cell.t==='ao'?smNum(s.o):cell.t==='bn'?smNum(s.n):cell.t==='bx'?smNum(s.x):cell.t==='bo'?smNum(s.o):s.p+'%'}
const smLoad=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
async function sheetPages(n){
 const base=SHEETS[n]||[],map=SHEETMAP[n]||[];
 const any=CRIT[n]&&CRIT[n].some((_,i)=>critMarks(n,n+'.'+(i+1)).has);
 if(!any||!map.length)return base;
 const key=n+'|'+JSON.stringify(MK[n]||{});
 if(SM_CACHE[n]&&SM_CACHE[n].key===key)return SM_CACHE[n].pages;
 const pages=base.slice();
 for(const pg of map){
  const todo=pg.cells.map(c=>({c,v:sheetVal(n,c)})).filter(x=>x.v!=='');if(!todo.length)continue;
  const im=await smLoad(base[pg.p]);if(!im)continue;
  const cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;
  const g=cv.getContext('2d');g.drawImage(im,0,0);g.textAlign='center';g.textBaseline='middle';g.fillStyle='#0a34aa';
  for(const {c,v} of todo){const [x0,y0,x1,y1]=c.r,w=x1-x0,h=y1-y0;let fs=Math.min(24,h-8);
   g.font='700 '+fs+'px "Noto Sans Sinhala",Arial,sans-serif';while(g.measureText(v).width>w-3&&fs>9){fs-=1;g.font='700 '+fs+'px "Noto Sans Sinhala",Arial,sans-serif'}
   g.fillText(v,x0+w/2,y0+h/2+1)}
  pages[pg.p]=cv.toDataURL('image/jpeg',.9)}
 SM_CACHE[n]={key,pages};return pages}
async function prepSheets(ns){for(const n of ns)SHP[n]=await sheetPages(n)}
async function fillSheet(n,w){const p=await sheetPages(n);w.innerHTML=p.map(x=>`<img src="${x}" alt="" loading="lazy">`).join('')}
let _smT=0;
function schedSheets(){clearTimeout(_smT);_smT=setTimeout(()=>{document.querySelectorAll('details.sheet[open]').forEach(d=>{const w=d.querySelector('.sheetpages');if(w&&w.children.length)fillSheet(+d.dataset.a,w)})},500)}
(function(){const rm=refreshMarks;refreshMarks=function(){rm.apply(this,arguments);schedSheets()}})();
document.addEventListener('input',e=>{if(e.target.classList&&e.target.classList.contains('mkin'))schedSheets()});
