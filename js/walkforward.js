// Real walk-forward on price data using a moving-average crossover demo engine.
function wfCloses(t){const{rows,d}=parseCSV(t),hd=rows[0].some(x=>isNaN(num(x,d))),h=hd?rows[0].map(x=>x.trim()):[];let c=h.findIndex(x=>/^<?(adj.?)?close>?$|^price$|^last$/i.test(x));if(c<0)c=rows[0].length-1;return(hd?rows.slice(1):rows).map(r=>num(r[c],d)).filter(x=>x>0)}
function walkForward(cl,folds,cost){
  const N=cl.length,F=[5,10,20],S=[30,50,100,200],M={},combos=[];
  const sma=w=>{const o=Array(N).fill(NaN);let s=0;for(let i=0;i<N;i++){s+=cl[i];if(i>=w)s-=cl[i-w];if(i>=w-1)o[i]=s/w}return o};
  [...F,...S].forEach(w=>M[w]=sma(w));
  for(const f of F)for(const s of S){
    const pos=cl.map((_,t)=>M[f][t]>M[s][t]?1:M[f][t]<M[s][t]?-1:0);
    combos.push({f,s,r:cl.map((_,t)=>t<2?0:pos[t-1]*(cl[t]/cl[t-1]-1)-cost*Math.abs(pos[t-1]-pos[t-2]))});
  }
  const L=Math.floor(N/(folds+3)),sum=(r,a,b)=>{let x=0;for(let i=a;i<b;i++)x+=r[i];return x},out=[];
  for(let i=0;i<folds;i++){const a=i*L,b=(i+3)*L;let best=combos[0],bs=-Infinity;
    for(const c of combos){const v=sum(c.r,a,b);if(v>bs){bs=v;best=c}}
    out.push({p:best.f+'/'+best.s,is:bs,oos:sum(best.r,b,b+L)})}
  return out;
}
function renderWF(o,N){
  const s=k=>o.reduce((a,x)=>a+x[k],0),pos=o.filter(x=>x.oos>0).length,wfe=s('is')>0?3*s('oos')/s('is'):0;
  $('#wfo').style.display='block';
  $('#wfs').innerHTML=[['Folds',o.length],['Price bars',N],['OOS folds profitable',pos+' of '+o.length],['Stitched OOS return',pct(s('oos'))],['Avg in-sample return per fold',pct(s('is')/o.length)],['Walk-forward efficiency',pct(Math.max(0,wfe))]].map(([k,v])=>`<div class="m"><b>${v}</b><span>${k}</span></div>`).join('');
  $('#wft').innerHTML='<table style="width:100%;border-collapse:collapse;font-size:14px"><tr><th align=left>Fold</th><th align=left>Best fast/slow</th><th align=right>In-sample</th><th align=right>Out-of-sample</th></tr>'+o.map((x,i)=>`<tr><td>${i+1}</td><td>${x.p}</td><td align=right>${pct(x.is)}</td><td align=right style="color:var(--${x.oos>0?'good':'bad'})">${pct(x.oos)}</td></tr>`).join('')+'</table>';
  $('#wfo').scrollIntoView({behavior:'smooth'});
}
$('#fp').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const cl=wfCloses(r.result),fo=Math.max(2,Math.min(12,Math.floor(+$('#fo').value||5)));if(cl.length<800)throw new Error('Need at least 800 price bars; found '+cl.length+'.');$('#msg').textContent='';renderWF(walkForward(cl,fo,(+$('#fc').value||0)/100),cl.length)}catch(x){$('#msg').textContent=x.message}};r.readAsText(f)};
