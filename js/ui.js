function render(R){
  $('#out').style.display='block';
  $('#sc').textContent=R.sc;$('#mk').style.left=R.sc+'%';
  $('#vd').textContent=R.wr===1?'Check your file: no losing trades found':R.sc>=75?'Looks robust':R.sc>=50?'Mixed: some fragility':'Fragile: likely overfit or lucky';
  $('#src').textContent=`${R.n} trades read from ${srcName}`;
  $('#fl').innerHTML=R.fl.map(t=>`<li>${t}</li>`).join('');
  const m=[['Net profit',fmt(R.total)],['Trades',R.n],['Win rate',pct(R.wr)],['Profit factor',isFinite(R.pf)?R.pf.toFixed(2):'∞'],['Avg win / avg loss',fmt(R.avgW)+' / '+fmt(R.avgL)],['Expectancy per trade',fmt(R.exp,2)],['Backtest max drawdown',pct(R.act.dd)],['Median shuffled drawdown',pct(R.p50)],['Worst-case (95%) drawdown',pct(R.p95)],['Longest losing streak',R.ls],['Losing streak, 95% case',R.ls95],['Chance of profit',pct(R.pProf)],['Chance of ruin',pct(R.pRuin)]];
  $('#mt').innerHTML=m.map(([k,v])=>`<div class="m"><b>${v}</b><span>${k}</span></div>`).join('');
  const hv=[['First half',R.H1],['Second half',R.H2]].flatMap(([t,x])=>[[t+' net profit',fmt(x.net)],[t+' profit factor',isFinite(x.pf)?x.pf.toFixed(2):'∞'],[t+' win rate',pct(x.wr)]]);
  $('#hv').innerHTML=hv.map(([k,v])=>`<div class="m"><b>${v}</b><span>${k}</span></div>`).join('');
  $('#wfc').style.display=R.wf?'block':'none';
  if(R.wf){const{a,b}=R.wf,eff=a.exp>0?b.exp/a.exp:0,pff=x=>isFinite(x)?x.toFixed(2):'∞';$('#wf').innerHTML=[['In-sample trades / net',a.n+' / '+fmt(a.net)],['Out-of-sample trades / net',b.n+' / '+fmt(b.net)],['In-sample profit factor',pff(a.pf)],['Out-of-sample profit factor',pff(b.pf)],['Win rate in / out',pct(a.wr)+' / '+pct(b.wr)],['Walk-forward efficiency',pct(Math.max(0,eff))]].map(([k,v])=>`<div class="m"><b>${v}</b><span>${k}</span></div>`).join('')}
  const ex=[['Deflated Sharpe confidence ('+R.tr+' variants)',pct(R.dsrv)],['Net profit, costs +10% of avg trade',fmt(R.cost[0])],['Net profit, costs +25%',fmt(R.cost[1])],['Net profit, costs +50%',fmt(R.cost[2])],['Extra cost that erases profit',pct(Math.max(0,R.be))+' of avg trade'],['Profitable time windows',R.seg.filter(x=>x>0).length+' of '+R.K],['Luck test p-value (lower is better)',R.pL.toFixed(3)]];
  $('#ex').innerHTML=ex.map(([k,v])=>`<div class="m"><b>${v}</b><span>${k}</span></div>`).join('');
  const wm=Math.max(...R.seg.map(Math.abs))||1;
  $('#wb').innerHTML=`<svg viewBox="0 0 ${R.K*70} 100" role="img" aria-label="Profit by time window"><line x1="0" x2="${R.K*70}" y1="50" y2="50" stroke="var(--line)"/>`+R.seg.map((x,i)=>{const h=Math.abs(x)/wm*40;return`<rect x="${i*70+10}" y="${x>=0?50-h:50}" width="50" height="${Math.max(h,1)}" fill="var(--${x>=0?'good':'bad'})"/><text x="${i*70+35}" y="96" font-size="10" text-anchor="middle" fill="var(--mute)">W${i+1}</text>`}).join('')+'</svg>';
  $('#c1').innerHTML=fan(R);$('#c2').innerHTML=hist(R);
  $('#out').scrollIntoView({behavior:'smooth'});
}
function go(){
  $('#msg').textContent='';
  if(trades.length<10){$('#msg').textContent='Load a CSV with at least 10 non-zero trades first.';return}
  const bal=+$('#bal').value,ru=+$('#ruin').value;
  if(!(bal>0)||!(ru>0&&ru<100)){$('#msg').textContent='Enter a balance above 0 and a ruin level between 1 and 99.';return}
  const P=$('#ps').value.split('\n').map(l=>(l.match(/-?\d+(\.\d+)?/g)||[]).map(Number)).filter(a=>a.length);setTimeout(()=>render(analyse(trades,bal,ru,Math.max(1,Math.floor(+$('#nt').value||1)),P,oosT)),10);
}
function load(text,name){
  try{const r=extract(text);trades=r.vals;srcName=name+' ('+r.name+')';
    if(trades.length<10){$('#msg').textContent=`Found only ${trades.length} usable trades in "${r.name}". Check that this is the profit column.`;return}
    go()}catch(e){$('#msg').textContent=e.message}
}
function readFile(f){if(!f)return;const r=new FileReader();r.onload=()=>load(r.result,f.name);r.readAsText(f)}
$('#f').onchange=e=>readFile(e.target.files[0]);
$('#f2').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{oosT=extract(r.result).vals;$('#f2n').textContent=oosT.length+' out-of-sample trades loaded';if(trades.length>=10)go()}catch(x){$('#msg').textContent=x.message}};r.readAsText(f)};
$('#go').onclick=go;
$('#demo').onclick=()=>{let t='Profit\n';for(let i=0;i<160;i++)t+=(Math.random()<.52?(300+Math.random()*500):-(250+Math.random()*450)).toFixed(2)+'\n';load(t,'sample data')};
const dz=$('#drop');
['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('on')}));
['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('on')}));
dz.addEventListener('drop',e=>readFile(e.dataTransfer.files[0]));
