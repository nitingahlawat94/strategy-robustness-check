const CONTACT='nitingahlawat094@gmail.com';
const REVIEW_ENDPOINT=''; // paste a Formspree form URL here to switch on review submissions // set to your email to enable the Pro waitlist button
(function(){
  let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647,svg=document.getElementById('fan');
  if(svg){const W=400,H=150,N=60,P=[];let hi=-9,lo=9;
    for(let k=0;k<29;k++){let y=0;const a=[0];for(let i=1;i<=N;i++){y+=.018+(r()-.5)*.2;a.push(y)}P.push(a);a.forEach(v=>{hi=Math.max(hi,v);lo=Math.min(lo,v)})}
    const X=i=>i/N*W,Y=v=>H-8-(v-lo)/(hi-lo)*(H-16);let h='';
    [...P.slice(1),P[0]].forEach((a,k,all)=>{const m=k==all.length-1;h+=`<polyline fill="none" stroke="${m?'var(--acc)':'currentColor'}" stroke-opacity="${m?1:.2}" stroke-width="${m?2.6:1}" points="${a.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ')}"/>`});
    svg.innerHTML=h}
  const b=document.getElementById('wl');if(b&&CONTACT){b.href='mailto:'+CONTACT+'?subject=Edgelab%20Pro%20waitlist';b.textContent='Join the Pro waitlist';b.classList.remove('off')}
})();

(function(){
  const q=s=>document.querySelector(s),vf=q('#vf');
  if(vf)vf.onsubmit=e=>{e.preventDefault();location.href='verify.html#'+encodeURIComponent(vf.q.value)};
  const rv=q('#rv');
  if(rv)fetch('data/reviews.json',{cache:'no-store'}).then(r=>r.json()).then(a=>{if(!a.length)return;q('#rvn').remove();a.slice(0,9).forEach(x=>{const c=document.createElement('div'),s=document.createElement('p'),t=document.createElement('p'),n=document.createElement('p');c.className='card';s.className='num';s.textContent='\u2605'.repeat(Math.max(1,Math.min(5,+x.rating||5)));t.textContent=String(x.review||'').slice(0,400);n.className='fine';n.textContent='\u2014 '+(String(x.name||'').slice(0,30)||'Anonymous trader');c.append(s,t,n);rv.append(c)})}).catch(()=>{});
  const rf=q('#rf');
  if(rf){if(!REVIEW_ENDPOINT){q('#rfb').disabled=true;q('#rfm').textContent='Review submissions open soon.'}
    rf.onsubmit=e=>{e.preventDefault();if(rf.website.value||!REVIEW_ENDPOINT)return;q('#rfb').disabled=true;
      fetch(REVIEW_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({rating:rf.rating.value,review:rf.review.value,name:rf.name.value})})
        .then(r=>{if(!r.ok)throw 0;rf.reset();q('#rfm').textContent='Thank you. Your review will appear after a quick check.'}).catch(()=>{q('#rfm').textContent='Could not send. Please try again.'}).finally(()=>{q('#rfb').disabled=false})}}
})();
