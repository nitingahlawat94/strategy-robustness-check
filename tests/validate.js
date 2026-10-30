const fs=require('fs');
const js=['util','parse','stats','charts','ui'].map(f=>fs.readFileSync(__dirname+'/../js/'+f+'.js','utf8')).join('\n');
const stub=new Proxy(function(){},{get:(t,p)=>p==='addEventListener'?()=>{}:p==='classList'?{add(){},remove(){}}:p==='style'?{}:stub,set:()=>true,apply:()=>stub});
global.document={querySelector:()=>stub};global.FileReader=function(){};
eval(js+';global.analyse=analyse;');
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
process.exit(ok&&R1.sc<analyse(gen['B modest real edge 55% 100/-90 (n=300)'](rng(5)),1e5,30,1).sc?0:1);
