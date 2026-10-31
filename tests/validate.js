const fs=require('fs');
const js=['util','parse','brokers','trust','health','insight','stats','charts','walkforward','ui'].map(f=>fs.readFileSync(__dirname+'/../js/'+f+'.js','utf8')).join('\n');
const stub=new Proxy(function(){},{get:(t,p)=>p==='addEventListener'?()=>{}:p==='classList'?{add(){},remove(){}}:p==='style'?{}:stub,set:()=>true,apply:()=>stub});
global.document={querySelector:()=>stub};global.FileReader=function(){};
eval(js+';global.analyse=analyse;global.walkForward=walkForward;');
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const gen={
 'A coin-flip, no edge (n=200)':r=>Array.from({length:200},()=>r()<.5?100:-100),
 'B modest real edge 55% 100/-90 (n=300)':r=>Array.from({length:300},()=>r()<.55?100:-90),
 'C strong edge 60% 120/-100 (n=300)':r=>Array.from({length:300},()=>r()<.6?120:-100),
 'D lucky few: 5% huge winners (n=200)':r=>Array.from({length:200},()=>r()<.05?600:-20),
 'E edge decays: 65% then 40% (n=200)':r=>Array.from({length:200},(_,i)=>r()<(i<100?.65:.4)?100:-100),
 'F tiny sample, 80% win (n=30)':r=>Array.from({length:30},()=>r()<.8?100:-100),
 'G negative edge 45% (n=300)':r=>Array.from({length:300},()=>r()<.45?100:-100),
};
const avg=k=>{let s=0;for(let i=1;i<=12;i++)s+=analyse(gen[k](rng(i*131)),1e5,30,1).sc;return s/12};
const [A,B,C,D,E,F,G]=Object.keys(gen).map(avg);
console.log('avg scores A..G:',[A,B,C,D,E,F,G].map(x=>x.toFixed(0)).join(' '));
const ok=C>B&&B>A&&B>D&&B>E&&G<50&&F<=60;console.log('ordering ok:',ok);

const R1=analyse(gen['B modest real edge 55% 100/-90 (n=300)'](rng(5)),1e5,30,1,[],Array.from({length:100},()=>-50));console.log('failed OOS lowers score:',R1.sc<analyse(gen['B modest real edge 55% 100/-90 (n=300)'](rng(5)),1e5,30,1).sc);
let fp=0;for(let i=1;i<=40;i++){if(analyse(gen['A coin-flip, no edge (n=200)'](rng(i*977)),1e5,30,1).sc>65)fp++}
console.log('coin-flip runs scoring above 65 (of 40):',fp);
const rw=s=>{const r=rng(s);let p=100;return Array.from({length:1500},()=>{p*=1+0.02*(r()+r()+r()-1.5);return p})};
const mo=s=>{const r=rng(s);let p=100,q=0;return Array.from({length:1500},()=>{q=0.35*q+0.02*(r()+r()+r()-1.5);p*=1+q;return p})};
for(const[nm,f]of[['random walk',rw],['momentum series',mo]]){let pos=0,tot=0,w=0;for(let s=1;s<=20;s++){const o=walkForward(f(s*31),5,.0001);pos+=o.filter(x=>x.oos>0).length;tot+=o.reduce((a,x)=>a+x.oos,0);w+=o.reduce((a,x)=>a+x.is,0)}console.log('walk-forward',nm,'| OOS folds profitable',pos+'/100','| avg OOS/fold',(tot).toFixed(2)+'%','| avg IS/fold',(w).toFixed(2)+'%')}
const BD=gen['B modest real edge 55% 100/-90 (n=300)'](rng(5));
const same=analyse(BD,1e5,30,1,[[4000,300],[4200,320],[3900,290],[4100,310],[4300,305]]).dsrv,odd=analyse(BD,1e5,30,1,[[4000,300],[4200,320],[3900,290],[4100,310],[9000,900]]).dsrv;
console.log('DSR, passes with similar trade counts vs one pass with 3x trades:',(same*100).toFixed(1)+'%',(odd*100).toFixed(1)+'%');
process.exit(ok&&R1.sc<analyse(gen['B modest real edge 55% 100/-90 (n=300)'](rng(5)),1e5,30,1).sc?0:1);
