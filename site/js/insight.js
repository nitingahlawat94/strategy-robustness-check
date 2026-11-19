// "The honest read": edge range, break-even margin, trades still needed, pain test, verdict and top concerns.
// Everything here comes from fixed rules and standard statistics, not from a prediction model.
function edgeStats(v){const n=v.length,mu=v.reduce((a,b)=>a+b,0)/n,sd=Math.sqrt(v.reduce((a,x)=>a+(x-mu)**2,0)/(n-1))||1e-9,t=1.96+2.38/n+4.5/(n*n),h=t*sd/Math.sqrt(n);return{mu,sd,lo:mu-h,hi:mu+h}}
function wilson(p,n){const z=1.96,d=1+z*z/n,c=p+z*z/(2*n),h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n));return[(c-h)/d,(c+h)/d]}
function insights(R,v,bal){
  const n=v.length,E=edgeStats(v),{mu,sd,lo,hi}=E,p=R.wr,be=R.avgL/((R.avgW+R.avgL)||1),wl=wilson(p,n)[0],d=mu/sd,need=d>0?Math.ceil((1.645/d)**2):null,more=need==null?null:Math.max(0,need-n);
  const rnd=mkRng(h53(R.rid+'pain')%4294967296);let a=0,b=0;
  for(let i=0;i<1000;i++){let e=bal,pk=bal,w=false;for(let j=0;j<100;j++){e+=v[rnd()*n|0];if(e>pk)pk=e;const dd=(pk-e)/pk;if(dd>=.1)w=true;if(dd>=.2){b++;break}}if(w)a++}
  const C=[],S=[],add=(s,t)=>C.push({s,t}),wins=R.seg.filter(x=>x>0).length;
  if(hi<=0)add(1,`Even the optimistic end of your edge range is negative (${fmt(hi,1)} per trade). The data shows no edge.`);
  else if(lo<=0)add(.9,`Your true edge could plausibly be anywhere from ${fmt(lo,1)} to ${fmt(hi,1)} per trade. That range includes zero, so you cannot yet rule out having no edge.`);
  if(R.wf&&R.wf.b.net<=0)add(1,'Your out-of-sample trades lost money. The edge did not survive data the optimizer never saw.');
  if(R.hl&&R.hl.status!=='Healthy')add(R.hl.status==='Degraded'?1:.5,`Your live trades are ${R.hl.status.toLowerCase()} compared with what your backtest predicted.`);
  if(R.total>0&&R.H2.net<=0)add(.9,'The second half of your trades lost money, so the edge may have faded.');
  if(R.pL>.05)add(.85,`Luck cannot be ruled out: ${pct(R.pL)} of random sign-flips matched your profit.`);
  if(n<100)add(.8,`Only ${n} trades. Results from fewer than 100 trades are mostly noise.`);
  if(R.total>0&&R.cost[1]<=0)add(.8,'Slippage and fees worth 25% of an average trade would erase your profit.');
  if(wl<be)add(.7,`You need to win ${pct(be)} of trades to break even. You win ${pct(p)}, but with this many trades your true win rate could plausibly be as low as ${pct(wl)}.`);
  if(R.dsrv<.95)add(.6,`After ${R.tr} tried variant${R.tr>1?'s':''}, only ${pct(R.dsrv)} confidence that the edge is real.`);
  if(R.act.dd>0&&R.p95/R.act.dd>1.5)add(.6,`Expect a deeper drawdown than your backtest: ${pct(R.p95)} is plausible, against ${pct(R.act.dd)} in the backtest.`);
  if(R.total>0&&wins<R.K*.6)add(.6,`Only ${wins} of ${R.K} time windows were profitable.`);
  if(lo>0)S.push(`Even the cautious end of your edge range is positive (${fmt(lo,1)} per trade).`);
  if(R.pL<=.05)S.push(`The luck test rejects pure chance (p = ${R.pL.toFixed(3)}).`);
  if(R.total>0&&R.cost[1]>0)S.push('Profit survives costs worth 25% of an average trade.');
  if(R.dsrv>=.95)S.push(`Deflated Sharpe confidence is ${pct(R.dsrv)} after ${R.tr} tried variant${R.tr>1?'s':''}.`);
  if(R.total>0&&wins>=R.K*.8)S.push(`${wins} of ${R.K} time windows were profitable.`);
  if(R.hl&&R.hl.status==='Healthy')S.push('Live trades look like your backtest.');
  C.sort((x,y)=>y.s-x.s);
  const headline=lo>0&&R.pL<=.05&&R.sc>=70?'Evidence of a real edge, with caveats':R.total>0&&R.sc>=50?'Promising, but not proven':R.total>0?'Not enough evidence of an edge':'No edge found in these trades';
  const tiles=[['Plausible edge per trade (95%)',fmt(lo,1)+' to '+fmt(hi,1)],['Break-even win rate',pct(be)],['Your win rate, plausible low end',pct(wl)],['More trades to be 95% sure of the edge',need==null?'n/a: no positive edge':more===0?'You have enough':(more>1e5?'100,000+':fmt(more))],['Chance of a 10% drop in your next 100 trades',pct(a/1000)],['Chance of a 20% drop in your next 100 trades',pct(b/1000)]];
  return{headline,concerns:C.map(x=>x.t),strengths:S,tiles};
}
function renderInsights(R){
  const I=insights(R,trades,+$('#bal').value||1e5),li=(a,e)=>a.length?a.map(t=>`<li>${t}</li>`).join(''):`<li>${e}</li>`;
  $('#hrh').textContent=I.headline;$('#hrcn').innerHTML=li(I.concerns.slice(0,3),'No major concerns found in this data.');$('#hrs').innerHTML=li(I.strengths.slice(0,3),'Nothing stands out yet.');
  $('#hrt').innerHTML=I.tiles.map(([k,v])=>`<div class="m"><b>${v}</b><span>${k}</span></div>`).join('');
  $('#phm').textContent='Report ID RBLY-'+R.rid.slice(0,4)+'-'+R.rid.slice(4,8)+'-'+R.rid.slice(8)+'  |  '+new Date().toLocaleDateString()+'  |  '+srcName;
}
