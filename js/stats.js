function pathStats(a,bal){
  let e=bal,p=bal,dd=0,ls=0,cur=0;
  for(const x of a){e+=x;if(e>p)p=e;const d=p>0?(p-e)/p:0;if(d>dd)dd=d;if(x<0){cur++;if(cur>ls)ls=cur}else cur=0}
  return{dd,ls};
}
const eq=(a,bal)=>{let e=bal;return[bal,...a.map(x=>e+=x)]};
const qt=(s,p)=>s[Math.min(s.length-1,Math.floor(p*s.length))];
const erf=x=>{const s=x<0?-1:1;x=Math.abs(x);const t=1/(1+.3275911*x);return s*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x))};
const Phi=x=>.5*(1+erf(x/Math.SQRT2));
const PhiInv=p=>{if(p<.5)return-PhiInv(1-p);const t=Math.sqrt(-2*Math.log(1-p));return t-(2.515517+.802853*t+.010328*t*t)/(1+1.432788*t+.189269*t*t+.001308*t*t*t)};
function dsr(v,N,P){const n=v.length,m=v.reduce((a,b)=>a+b,0)/n,sd=Math.sqrt(v.reduce((a,b)=>a+(b-m)**2,0)/(n-1))||1e-9,z=v.map(x=>(x-m)/sd),g3=z.reduce((a,b)=>a+b**3,0)/n,g4=z.reduce((a,b)=>a+b**4,0)/n,sr=m/sd,g=.5772156649,useP=P&&P.length>=5,NN=useP?P.length:N,ts=useP?P.map(x=>x/(n*sd)):[],tm=ts.reduce((a,b)=>a+b,0)/(ts.length||1),tsd=useP?Math.sqrt(ts.reduce((a,b)=>a+(b-tm)**2,0)/(ts.length-1)):Math.sqrt(1/(n-1)),s0=NN>1?tsd*((1-g)*PhiInv(1-1/NN)+g*PhiInv(1-1/(NN*Math.E))):0,den=Math.sqrt(Math.max(1e-9,1-g3*sr+(g4-1)/4*sr*sr));return Phi((sr-s0)*Math.sqrt(n-1)/den)}
function wfs(x){const w=x.filter(y=>y>0).reduce((s,y)=>s+y,0),l=-x.filter(y=>y<0).reduce((s,y)=>s+y,0);return{n:x.length,net:w-l,exp:(w-l)/x.length,pf:l>0?w/l:Infinity,wr:x.filter(y=>y>0).length/x.length}}
function analyse(v,bal,ruinPct,tr,P,oos){if(P&&P.length>=5)tr=P.length;
  const n=v.length,N=2000,ruin=ruinPct/100;
  const wins=v.filter(x=>x>0),loss=v.filter(x=>x<0);
  const sumW=wins.reduce((a,b)=>a+b,0),sumL=-loss.reduce((a,b)=>a+b,0),total=sumW-sumL;
  const pf=sumL>0?sumW/sumL:Infinity;
  const k=Math.max(1,Math.ceil(n*0.05)),trimmed=total-[...wins].sort((a,b)=>b-a).slice(0,k).reduce((a,b)=>a+b,0);
  const act=pathStats(v,bal);
  const hs=x=>{const w=x.filter(y=>y>0).reduce((s,y)=>s+y,0),l=-x.filter(y=>y<0).reduce((s,y)=>s+y,0);return{net:w-l,pf:l>0?w/l:(w>0?Infinity:0),wr:x.filter(y=>y>0).length/(x.length||1)}};
  const hf=Math.floor(n/2),H1=hs(v.slice(0,hf)),H2=hs(v.slice(hf));
  const aa=v.reduce((s,x)=>s+Math.abs(x),0)/n,cost=[.1,.25,.5].map(c=>total-c*aa*n),be=total/n/aa,K=n>=50?5:3,seg=Array.from({length:K},(_,i)=>v.slice(Math.floor(i*n/K),Math.floor((i+1)*n/K)).reduce((s,x)=>s+x,0)),dsrv=dsr(v,tr,P),wf=oos&&oos.length>=10?{a:wfs(v),b:wfs(oos)}:null;
  const a=v.slice(),dds=[],lss=[],paths=[];let ruined=0,prof=0;
  for(let i=0;i<N;i++){
    for(let j=n-1;j>0;j--){const r=Math.random()*(j+1)|0;[a[j],a[r]]=[a[r],a[j]]}
    const s=pathStats(a,bal);dds.push(s.dd);lss.push(s.ls);
    if(i<40)paths.push(eq(a,bal));
    let e=bal,hit=false;
    for(let j=0;j<n;j++){e+=v[Math.random()*n|0];if(e<=bal*(1-ruin))hit=true}
    if(hit)ruined++;if(e>bal)prof++;
  }
  dds.sort((x,y)=>x-y);lss.sort((x,y)=>x-y);
  const p95=qt(dds,.95),pProf=prof/N,pRuin=ruined/N;
  const cl=x=>Math.max(0,Math.min(1,x));
  const r=act.dd>0?p95/act.dd:1;
  const sc=Math.round(cl((pProf-.5)/.5)*20+cl(pf-1)*15+Math.min(n/200,1)*15+cl((dsrv-.5)/.5)*20+Math.max(0,15-Math.max(0,r-1.3)*10)+(trimmed>0?15:total>0?4:0)-(total>0&&H2.net<=0?15:H1.pf>0&&H2.pf<.6*H1.pf?8:0)-(wf?(wf.b.net<=0?25:wf.a.exp>0&&wf.b.exp/wf.a.exp<.5?12:0):0));
  const fl=[];
  if(n<100)fl.push(`Only ${n} trades. Fewer than 100 trades is usually noise, not proof of an edge.`);
  if(total>0&&trimmed<=0)fl.push(`Remove the best ${k} winning trade${k>1?'s':''} (top 5%) and the strategy loses money. Profit depends on a few lucky trades.`);
  if(r>1.5)fl.push(`Your backtest drawdown (${pct(act.dd)}) is far smaller than the 95th-percentile drawdown from reshuffling (${pct(p95)}). Expect worse live.`);
  if(pProf<.9)fl.push(`Only ${pct(pProf)} of bootstrap simulations ended in profit.`);
  if(pf>3&&n<150)fl.push(`Profit factor of ${pf.toFixed(2)} on ${n} trades is a classic sign of curve-fitting.`);
  if(pRuin>.05)fl.push(`${pct(pRuin)} of simulations hit your ${ruinPct}% drawdown ruin level.`);
  if(total<=0)fl.push('The strategy lost money overall in this trade list.');
  if(total>0&&H2.net<=0)fl.push(`The second half of your trades lost money (${fmt(H2.net)}) while the first half made ${fmt(H1.net)}. The edge may have decayed or been fitted to early data.`);
  else if(H1.pf>0&&H2.pf<.6*H1.pf)fl.push(`Profit factor fell from ${H1.pf.toFixed(2)} in the first half to ${H2.pf.toFixed(2)} in the second. Check whether the edge is fading.`);
  if(dsrv<.95)fl.push(`Deflated Sharpe: only ${pct(dsrv)} confidence the edge is real after ${tr} tried variant${tr>1?'s':''}. Aim for 95% or more.`);
  if(total>0&&cost[1]<=0)fl.push('Profit vanishes if extra slippage or fees cost just 25% of an average trade.');
  if(total>0&&seg.filter(x=>x>0).length<K*.6)fl.push(`Only ${seg.filter(x=>x>0).length} of ${K} time windows were profitable. Results are not consistent over time.`);
  if(wf){const eff=wf.a.exp>0?wf.b.exp/wf.a.exp:0;if(wf.b.net<=0)fl.push('Out-of-sample trades lost money. The edge did not survive data the optimizer never saw.');else if(eff<.5)fl.push(`Out-of-sample expectancy is only ${pct(eff)} of in-sample (walk-forward efficiency). A healthy range is 50% or more.`)}
  if(!loss.length)fl.unshift('Every trade is a winner. This is almost certainly not a trade-profit column, so ignore this score and check the column name shown above.');
  if(!fl.length)fl.push('No major warning signs found. That does not guarantee future results.');
  return{n,total,pf,wr:wins.length/n,avgW:wins.length?sumW/wins.length:0,avgL:loss.length?sumL/loss.length:0,exp:total/n,act,p50:qt(dds,.5),p95,ls:act.ls,ls95:qt(lss,.95),pProf,pRuin,sc:loss.length?Math.min(n<100?60:100,Math.max(0,sc)):0,fl,paths,actEq:eq(v,bal),dds,bal,H1,H2,dsrv,cost,be,seg,K,tr,wf};
}
