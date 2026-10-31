const CONTACT='nitingahlawat094@gmail.com'; // set to your email to enable the Pro waitlist button
(function(){
  let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647,svg=document.getElementById('fan');
  if(svg){const W=400,H=150,N=60,P=[];let hi=-9,lo=9;
    for(let k=0;k<29;k++){let y=0;const a=[0];for(let i=1;i<=N;i++){y+=.018+(r()-.5)*.2;a.push(y)}P.push(a);a.forEach(v=>{hi=Math.max(hi,v);lo=Math.min(lo,v)})}
    const X=i=>i/N*W,Y=v=>H-8-(v-lo)/(hi-lo)*(H-16);let h='';
    [...P.slice(1),P[0]].forEach((a,k,all)=>{const m=k==all.length-1;h+=`<polyline fill="none" stroke="${m?'var(--acc)':'currentColor'}" stroke-opacity="${m?1:.2}" stroke-width="${m?2.6:1}" points="${a.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ')}"/>`});
    svg.innerHTML=h}
  const b=document.getElementById('wl');if(b&&CONTACT){b.href='mailto:'+CONTACT+'?subject=Edgelab%20Pro%20waitlist';b.textContent='Join the Pro waitlist';b.classList.remove('off')}
})();
