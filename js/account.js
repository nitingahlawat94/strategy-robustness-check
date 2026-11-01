(async()=>{
  const $=s=>document.querySelector(s),fid=r=>'RBLY-'+r.slice(5,9)+'-'+r.slice(10,14)+'-'+r.slice(15);
  const row=(t,box)=>{const d=document.createElement('div');d.className='hrow';d.textContent=t;box.append(d)};
  if(!BE.on){$('#off').hidden=false;return}
  let u=null;try{u=await BE.user()}catch(e){}
  if(!u){$('#login').hidden=false;$('#lf').onsubmit=async e=>{e.preventDefault();$('#lm').textContent='Sending...';try{await BE.signIn($('#em').value);$('#lm').textContent='Check your inbox for the sign-in link.'}catch(x){$('#lm').textContent=x.message}};return}
  $('#main').hidden=false;$('#who').textContent=u.email;$('#out').onclick=async()=>{await BE.signOut();location.reload()};
  try{
    const p=(await BE.list('profiles'))[0]||{},pro=p.plan==='pro'&&p.plan_until&&new Date(p.plan_until)>new Date();
    $('#plan').textContent=pro?'Pro, active until '+new Date(p.plan_until).toLocaleDateString():'Free';
    if(!pro&&ROBUSTLY.paymentUrl){const a=$('#up');a.href=ROBUSTLY.paymentUrl;a.hidden=false;$('#upn').hidden=false}
    const rs=await BE.list('reports');rs.length?rs.forEach(r=>row(`${r.rid}  |  score ${r.score}  |  ${r.n} trades  |  ${r.headline||''}  |  ${r.created_at.slice(0,10)}`,$('#reps'))):row('No saved reports yet. Press "Save to my account" on any report.',$('#reps'));
    const q=await BE.list('certificate_requests');q.length?q.forEach(r=>row(`${r.rid}  |  ${r.status}  |  ${r.created_at.slice(0,10)}`,$('#reqs'))):row('No certificate requests yet.',$('#reqs'));
  }catch(e){$('#lm2').textContent=e.message}
})();
