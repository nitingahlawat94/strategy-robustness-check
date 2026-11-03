(async()=>{
  const $=s=>document.querySelector(s),row=(t,box)=>{const d=document.createElement('div');d.className='hrow';d.textContent=t;box.append(d)};
  const demo=location.hash==='#demo',dl=location.hash==='#demo-login';
  if(!BE.on&&(demo||dl)){$('#dm').hidden=false;
    Object.assign(BE,demo?{on:true,user:async()=>({email:'demo@example.com'}),signOut:async()=>{location.hash='#demo-login';location.reload()},clearReports:async()=>{},list:async t=>({profiles:[{plan:'free'}],reports:[{rid:'RBLY-0000-0000-0000',score:78,n:300,headline:'Promising, but not proven',created_at:'2026-11-01T00:00:00Z'}],certificate_requests:[{rid:'RBLY-0000-0000-0000',status:'pending',created_at:'2026-11-01T00:00:00Z'}]}[t])}:{on:true,user:async()=>null,signIn:async()=>{}})}
  if(!BE.on){$('#off').hidden=false;return}
  let u=null;try{u=await BE.user()}catch(e){}
  if(!u){$('#login').hidden=false;$('#lf').onsubmit=async e=>{e.preventDefault();$('#lm').textContent='Sending...';try{await BE.signIn($('#em').value);$('#lm').textContent=dl?'Demo only: no email was sent.':'Check your inbox for the sign-in link (and your spam folder).'}catch(x){$('#lm').textContent=x.message}};return}
  $('#main').hidden=false;$('#who').textContent=u.email;$('#out').onclick=async e=>{e.preventDefault();await BE.signOut();location.reload()};
  $('#clr').onclick=async()=>{if(!confirm('Delete all your saved report summaries?'))return;try{await BE.clearReports();location.reload()}catch(x){$('#lm2').textContent=x.message}};
  try{
    const p=(await BE.list('profiles'))[0]||{},pro=p.plan==='pro'&&p.plan_until&&new Date(p.plan_until)>new Date();
    $('#plan').textContent=pro?'Pro, active until '+new Date(p.plan_until).toLocaleDateString():'Free';
    if(!pro&&ROBUSTLY.paymentUrl){const a=$('#up');a.href=ROBUSTLY.paymentUrl;a.hidden=false;$('#upn').hidden=false}
    const rs=await BE.list('reports');rs.length?rs.forEach(r=>row(`${r.rid}  |  score ${r.score}  |  ${r.n} trades  |  ${r.headline||''}  |  ${r.created_at.slice(0,10)}`,$('#reps'))):row('No saved reports yet. Press "Save to my account" on any report.',$('#reps'));
    const q=await BE.list('certificate_requests');q.length?q.forEach(r=>row(`${r.rid}  |  ${r.status}  |  ${r.created_at.slice(0,10)}`,$('#reqs'))):row('No certificate requests yet.',$('#reqs'));
  }catch(e){$('#lm2').textContent=e.message}
})();
