const fs=require('fs');
const js=['util','parse','brokers','trust','health','stats','charts','walkforward','ui'].map(f=>fs.readFileSync(__dirname+'/../js/'+f+'.js','utf8')).join('\n');
const stub=new Proxy(function(){},{get:(t,p)=>p==='addEventListener'?()=>{}:p==='classList'?{add(){},remove(){}}:p==='style'?{}:stub,set:()=>true,apply:()=>stub});
global.document={querySelector:()=>stub};global.FileReader=function(){};
eval(js+';global.analyse=analyse;');
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let bad=0;const chk=(n,c,x)=>{console.log((c?'PASS ':'FAIL ')+n+(x?'  '+x:''));if(!c)bad++};
const mk=(r,n,w,a,b)=>Array.from({length:n},()=>r()<w?a:-b);
const B=mk(rng(5),300,.55,100,90);
const A=analyse(B,1e5,30,1),A2=analyse(B,1e5,30,1),C=analyse(B.slice().reverse(),1e5,30,1);
chk('Reproducible: same file twice gives identical report',A.sc===A2.sc&&A.rid===A2.rid&&A.p95===A2.p95&&A.pL===A2.pL,A.rid);
chk('Different data gives a different Report ID',A.rid!==C.rid);
chk('Different settings give a different Report ID',analyse(B,1e5,30,5).rid!==A.rid);
let okH=0,okD=0;for(let s=1;s<=20;s++){const h=analyse(B,1e5,30,1,[],mk(rng(s*13),60,.55,100,90)).hl,d=analyse(B,1e5,30,1,[],mk(rng(s*17),60,.33,100,90)).hl;if(h.status!=='Degraded')okH++;if(d.status==='Degraded')okD++}
chk('Live check: healthy live data not flagged degraded (>=80% of 20)',okH>=16,okH+'/20');
chk('Live check: broken live data flagged degraded (>=80% of 20)',okD>=16,okD+'/20');
const S1=analyse(B,1e4,30,1).sz,S3=analyse(B.map(x=>x*3),1e4,30,1).sz;
chk('Safe size: 3x bigger trades need roughly 1/3 the multiplier',S3.k<S1.k&&S3.k/S1.k>.2&&S3.k/S1.k<.5,S1.k.toFixed(2)+'x vs '+S3.k.toFixed(2)+'x');
chk('Losing strategy gets no sizing',analyse(mk(rng(9),200,.4,100,100),1e5,30,1).sz===null);
chk('Underwater metrics present',A.act.uw>0&&A.uw95>=A.act.uw*.5,A.act.uw+' / '+A.uw95);
process.exit(bad?1:0);
