function fan(R){
  const W=640,H=260,P=34,all=[R.actEq,...R.paths];
  let lo=Infinity,hi=-Infinity;all.forEach(p=>p.forEach(y=>{if(y<lo)lo=y;if(y>hi)hi=y}));
  const n=R.actEq.length,step=Math.ceil(n/250),X=i=>P+(W-P-8)*i/(n-1),Y=y=>H-22-(H-34)*(y-lo)/((hi-lo)||1);
  const d=p=>p.filter((_,i)=>i%step==0||i==n-1).map((y,i,arr)=>{const idx=Math.min(i*step,n-1);return(i?'L':'M')+X(idx).toFixed(1)+' '+Y(y).toFixed(1)}).join('');
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Equity curve fan chart">`;
  s+=`<line x1="${P}" x2="${W-8}" y1="${Y(R.bal)}" y2="${Y(R.bal)}" stroke="var(--line)" stroke-dasharray="4 4"/>`;
  R.paths.forEach(p=>s+=`<path d="${d(p)}" fill="none" stroke="var(--acc)" stroke-opacity=".22" stroke-width="1"/>`);
  s+=`<path d="${d(R.actEq)}" fill="none" stroke="var(--ink)" stroke-width="2.2"/>`;
  s+=`<text x="${P}" y="14" font-size="11" fill="var(--mute)">${fmt(hi)}</text><text x="${P}" y="${H-8}" font-size="11" fill="var(--mute)">${fmt(lo)}</text><text x="${W-8}" y="${H-8}" font-size="11" fill="var(--mute)" text-anchor="end">trade ${n-1}</text></svg>`;
  return s;
}
function hist(R){
  const W=640,H=240,P=30,B=18,mx=Math.max(R.dds[R.dds.length-1],R.act.dd)*1.05||1,bins=Array(B).fill(0);
  R.dds.forEach(x=>bins[Math.min(B-1,Math.floor(x/mx*B))]++);
  const top=Math.max(...bins),bw=(W-P-8)/B,X=v=>P+(W-P-8)*v/mx;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Max drawdown histogram">`;
  bins.forEach((c,i)=>{const h=(H-50)*c/top;s+=`<rect x="${P+i*bw+1}" y="${H-26-h}" width="${bw-2}" height="${h}" fill="var(--acc)" fill-opacity=".55"/>`});
  s+=`<line x1="${X(R.act.dd)}" x2="${X(R.act.dd)}" y1="10" y2="${H-26}" stroke="var(--ink)" stroke-width="2"/><text x="${X(R.act.dd)+4}" y="22" font-size="11" fill="var(--ink)">yours ${pct(R.act.dd)}</text>`;
  s+=`<line x1="${X(R.p95)}" x2="${X(R.p95)}" y1="10" y2="${H-26}" stroke="var(--bad)" stroke-width="2" stroke-dasharray="5 3"/><text x="${X(R.p95)-4}" y="38" font-size="11" fill="var(--bad)" text-anchor="end">95th pct ${pct(R.p95)}</text>`;
  s+=`<text x="${P}" y="${H-8}" font-size="11" fill="var(--mute)">0%</text><text x="${W-8}" y="${H-8}" font-size="11" fill="var(--mute)" text-anchor="end">${pct(mx)} max drawdown</text></svg>`;
  return s;
}
