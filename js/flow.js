// Upload -> Start -> blurred waiting screen -> animated reveal. Also keeps this browser's report history.
function waitSecs(n,hasLive,hasPasses,reduced){return reduced?1.5:Math.min(15,Math.max(5,5+Math.log2(n/50+1)*1.6+(hasLive?1:0)+(hasPasses?1:0)))}
function ready(){$('#msg').textContent='';$('#info').textContent=`Loaded ${trades.length} trades from ${srcName}${oosT.length?' and '+oosT.length+' live or out-of-sample trades':''}. Press "Start analysis".`;$('#go').focus()}
function runFlow(compute,renderFn,P){
  const n=trades.length,red=matchMedia('(prefers-reduced-motion: reduce)').matches,secs=waitSecs(n,oosT.length>0,P&&P.length>=5,red);
  const st=['Reading '+n+' trades','Reshuffling your trades 2,000 times','Running the luck test','Stress-testing costs and slippage'].concat(oosT.length?['Comparing live and out-of-sample trades']:[],['Deflating the Sharpe ratio','Sizing risk and recovery time','Writing your honest read','Sealing your Report ID']);
  const ov=$('#wait'),tx=$('#wtx'),fl=$('#wfill'),pc=$('#wp'),cu=$('#wcur');
  let pts='',y=40;const r=mkRng(n*7+3);for(let i=0;i<=40;i++){y=Math.max(8,Math.min(72,y+(r()-.45)*9));pts+=(i*7.5)+','+(80-y).toFixed(1)+' '}
  cu.setAttribute('points',pts);const L=cu.getTotalLength?cu.getTotalLength():600;cu.style.strokeDasharray=L;cu.style.strokeDashoffset=L;
  $('#info').textContent='';$('#out').style.display='none';document.body.classList.add('waiting');ov.classList.add('on');
  let R=null,err=null;setTimeout(()=>{try{R=compute()}catch(e){err=e}},400);
  const t0=performance.now();
  const tick=now=>{const t=Math.min(1,(now-t0)/(secs*1000)),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,p=Math.floor(e*100);
    fl.style.width=p+'%';pc.textContent=p+'%';cu.style.strokeDashoffset=L*(1-e);tx.textContent=st[Math.min(st.length-1,Math.floor(t*st.length))];
    if(t<1||(!R&&!err))return requestAnimationFrame(tick);
    ov.classList.remove('on');document.body.classList.remove('waiting');
    if(err){$('#msg').textContent='Something went wrong: '+err.message;return}
    renderFn(R);const o=$('#out');o.classList.remove('reveal');[...o.children].forEach((c,i)=>c.style.setProperty('--i',i));void o.offsetWidth;o.classList.add('reveal');saveHist(R)};
  requestAnimationFrame(tick);
}
const fid=r=>'ELAB-'+r.slice(0,4)+'-'+r.slice(4,8)+'-'+r.slice(8);
function saveHist(R){try{const k='edgelab.history',a=JSON.parse(localStorage.getItem(k)||'[]').filter(x=>x.rid!==R.rid);a.unshift({rid:R.rid,sc:R.sc,n:R.n,f:srcName,d:new Date().toISOString().slice(0,10)});localStorage.setItem(k,JSON.stringify(a.slice(0,30)))}catch(e){}renderHist()}
function renderHist(){let a=[];try{a=JSON.parse(localStorage.getItem('edgelab.history')||'[]')}catch(e){}
  $('#histc').style.display=a.length?'block':'none';const h=$('#hist');h.textContent='';
  a.forEach(x=>{const row=document.createElement('div'),s=document.createElement('span'),b=document.createElement('a');row.className='hrow';s.textContent=`${fid(x.rid)}  |  score ${x.sc}  |  ${x.n} trades  |  ${x.d}  |  ${x.f}`;
    b.textContent='Request certificate';b.href='mailto:nitingahlawat094@gmail.com?subject='+encodeURIComponent('Certificate request '+fid(x.rid))+'&body='+encodeURIComponent(`Hi Nitin,\n\nPlease issue an Edgelab certificate for this report.\nReport ID: ${fid(x.rid)}\nScore: ${x.sc}\nTrades: ${x.n}\nName to print on the certificate: \n\nI will attach my trade file so you can reproduce the report.`);row.append(s,b);h.append(row)})}
renderHist();
