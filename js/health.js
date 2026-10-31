// Live health check (does live trading still look like the backtest?) and safe-size simulation.
function liveCheck(v,L,bal,rnd){
  const n=v.length,m=L.length,mu=v.reduce((a,b)=>a+b,0)/n,sd=Math.sqrt(v.reduce((a,b)=>a+(b-mu)**2,0)/(n-1))||1e-9,M=1000,tot=L.reduce((a,b)=>a+b,0),ld=pathStats(L,bal).dd;
  const k=Math.max(0,mu)/(2*sd),cus=(a,h)=>{let S=0,mx=0,al=-1;for(let i=0;i<a.length;i++){S=Math.max(0,S+(mu-a[i])/sd-k);if(S>mx)mx=S;if(h!=null&&S>h&&al<0)al=i+1}return{mx,al}};
  let low=0,worse=0;const mxs=[];
  for(let i=0;i<M;i++){const s=Array.from({length:m},()=>v[rnd()*n|0]);if(s.reduce((a,b)=>a+b,0)<=tot)low++;if(pathStats(s,bal).dd>=ld)worse++;mxs.push(cus(s).mx)}
  mxs.sort((a,b)=>a-b);const hc=mxs[Math.floor(.95*M)],alarm=cus(L,hc).al;
  const pc=low/M;
  return{m,tot,pc,pd:worse/M,alarm,mu,liveMu:tot/m,status:pc<.05||(alarm>0&&pc<.25)?'Degraded':(pc<.25||alarm>0)?'Watch':'Healthy'};
}
function ruinP(v,k,bal,ruin,rnd,M){let h=0;const n=v.length,lim=bal*(1-ruin);for(let i=0;i<M;i++){let e=bal;for(let j=0;j<n;j++){e+=k*v[rnd()*n|0];if(e<=lim){h++;break}}}return h/M}
function safeSize(v,bal,ruin,rnd){
  const M=600,at1=ruinP(v,1,bal,ruin,rnd,M);
  if(ruinP(v,200,bal,ruin,rnd,M)<=.05)return{k:200,cap:true,at1};
  if(ruinP(v,.01,bal,ruin,rnd,M)>.05)return{k:0,cap:false,at1};
  let lo=Math.log(.01),hi=Math.log(200);for(let i=0;i<12;i++){const mid=(lo+hi)/2;if(ruinP(v,Math.exp(mid),bal,ruin,rnd,M)<=.05)lo=mid;else hi=mid}
  return{k:Math.exp(lo),cap:false,at1};
}
