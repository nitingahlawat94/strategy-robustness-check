Claude
Account · JS
(async()=>{
  const $=s=>document.querySelector(s),row=(t,box)=>{const d=document.createElement('div');d.className='hrow';d.textContent=t;box.append(d)};
  const demo=location.hash==='#demo',dl=location.hash==='#demo-login';
  const otpBoxes=[...document.querySelectorAll('.otp-digit')],otpField=$('#otp');
  const syncOtp=()=>{otpField.value=otpBoxes.map(x=>x.value).join('')};
  const fillOtp=value=>{const digits=String(value||'').replace(/\D/g,'').slice(0,8);otpBoxes.forEach((box,i)=>box.value=digits[i]||'');syncOtp();otpBoxes[Math.min(digits.length,otpBoxes.length-1)]?.focus()};
  otpBoxes.forEach((box,i)=>{
    box.addEventListener('input',()=>{const v=box.value.replace(/\D/g,'');if(v.length>1){fillOtp(v);return}box.value=v;syncOtp();if(v&&i<otpBoxes.length-1)otpBoxes[i+1].focus()});
    box.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!box.value&&i>0){otpBoxes[i-1].focus();otpBoxes[i-1].value='';syncOtp()}else if(e.key==='ArrowLeft'&&i>0)otpBoxes[i-1].focus();else if(e.key==='ArrowRight'&&i<otpBoxes.length-1)otpBoxes[i+1].focus()});
    box.addEventListener('paste',e=>{e.preventDefault();fillOtp(e.clipboardData?.getData('text')||'')});
  });
 
  // FIX: always show the login panel first so any error message below is visible.
  if(!location.hash.includes('demo'))$('#login').hidden=false;
 
  if(typeof BE==='undefined'){
    $('#login').hidden=false;
    $('#lm').textContent='Account service did not load. Refresh this page or try again shortly.';
    console.error('BE is undefined: js/backend.js failed to load or crashed. Check Network tab and config.js.');
    return;
  }
  if(!BE.on&&(demo||dl)){$('#dm').hidden=false;
    Object.assign(BE,demo?{on:true,user:async()=>({email:'demo@example.com',created_at:'2026-11-01T00:00:00Z'}),profile:async()=>({full_name:'Demo User',phone:''}),updateProfile:async()=>{},signOut:async()=>{location.hash='#demo-login';location.reload()},clearReports:async()=>{},reportEntitlements:async()=>[],list:async t=>({profiles:[{plan:'free'}],reports:[{rid:'RBLY-0000-0000-0000',score:78,n:300,headline:'Promising, but not proven',created_at:'2026-11-01T00:00:00Z'}],certificate_requests:[{rid:'RBLY-0000-0000-0000',status:'pending',created_at:'2026-11-01T00:00:00Z'}]}[t])}:{on:true,user:async()=>null,signIn:async()=>{}})}
  if(!BE.on){
    $('#login').hidden=false;
    $('#off').hidden=false;
    $('#lm').textContent='Email sign-in is temporarily unavailable. Please try again shortly.';
    console.error('BE.on is false: backend not configured. Check js/config.js (Supabase URL + anon key).');
    return;
  }
  const msg=x=>{const m=String(x?.message||x);return /rate.?limit|too many|email.*rate/i.test(m)?'Email delivery is temporarily rate limited. Wait before retrying, and check spam/junk for any recent code.':/confirmation email|smtp|error sending email/i.test(m)?'Supabase could not send the email. Check the SMTP setup and wait if you recently requested codes.':m};
  $('#lf').onsubmit=async e=>{e.preventDefault();$('#lm').textContent='Sending code...';try{await BE.signIn($('#em').value.trim());$('#vf').hidden=false;$('#lm').textContent='Code sent. Keep your email address above and enter the one-time code below. Check spam/junk too.'}catch(x){$('#lm').textContent=msg(x)}};
  $('#vf').onsubmit=async e=>{e.preventDefault();syncOtp();const token=otpField.value;if(!/^\d{6}(\d{2})?$/.test(token)){ $('#lm').textContent='Enter the complete 6- or 8-digit code from your newest email.';return}$('#lm').textContent='Verifying your code…';try{await BE.verifyEmailCode($('#em').value.trim(),token);const u=await BE.user();if(!u)throw new Error('The code was accepted, but your sign-in session did not start. Request a fresh code and try again.');$('#login').hidden=true;$('#acct-main').hidden=false;$('#who').textContent=u.email||'Account';$('#account-email').value=u.email||'';$('#lm2').textContent='You are signed in.';history.replaceState(null,'',location.pathname+location.search)}catch(x){$('#lm').textContent=msg(x);$('#otp').value='';otpBoxes.forEach(b=>b.value='');otpBoxes[0]?.focus()}};
  for(const [id,provider,label] of [['google','google','Google'],['apple','apple','Apple']])$('#'+id).onclick=async()=>{const b=$('#'+id);b.disabled=true;$('#lm').textContent='Connecting to '+label+'…';try{await BE.signInWith(provider)}catch(x){$('#lm').textContent=label+' sign-in is not configured in Supabase yet. Email code sign-in is available.';b.disabled=false}};
  let u=null;try{u=await BE.user()}catch(e){$('#lm').textContent='Account service could not be reached. The email form is ready; if it fails, refresh and try again.';console.error(e);return}
  if(!u)return;
  $('#login').hidden=true;$('#acct-main').hidden=false;$('#who').textContent=u.email||'Account';$('#account-email').value=u.email||'';$('#out').onclick=async e=>{e.preventDefault();await BE.signOut();location.reload()};
  try{
    const profile=await BE.profile();$('#profile-name').value=profile?.full_name||'';$('#profile-phone').value=profile?.phone||'';
    $('#created').textContent=profile?.created_at?'Account created '+new Date(profile.created_at).toLocaleDateString():'';
  }catch(e){$('#profile-status').textContent='Could not load saved details. If this is a new database, run the profile-details migration in backend/migrations first.'}
  $('#profile-form').onsubmit=async e=>{e.preventDefault();$('#profile-status').textContent='Saving...';try{await BE.updateProfile({full_name:$('#profile-name').value.trim(),phone:$('#profile-phone').value.trim()});$('#profile-status').textContent='Your details are saved.'}catch(x){$('#profile-status').textContent=msg(x)}};
  $('#clr').onclick=async()=>{if(!confirm('Delete all your saved report summaries?'))return;try{await BE.clearReports();location.reload()}catch(x){$('#lm2').textContent=msg(x)}};
  try{
    const ent=await BE.reportEntitlements();ent.length?ent.forEach(x=>row(`${x.report_id}  |  ${String(x.package).toUpperCase()}  |  ${x.created_at.slice(0,10)}`,$('#entitlements'))):row('No report purchases yet.',$('#entitlements'));
    const next=new URLSearchParams(location.search).get('next');if(next==='tool.html?package=basic'||next==='tool.html?package=pro'){const a=document.createElement('a');a.href=next;a.textContent='Continue to the '+(next.includes('pro')?'Pro':'Basic')+' report';a.className='btn';const n=$('#return-note');n.hidden=false;n.textContent='Your account is ready. ';n.append(a)}
    const rs=await BE.list('reports');rs.length?rs.forEach(r=>row(`${r.rid}  |  score ${r.score}  |  ${r.n} trades  |  ${r.headline||''}  |  ${r.created_at.slice(0,10)}`,$('#reps'))):row('No saved reports yet.',$('#reps'));
    const q=await BE.list('certificate_requests');q.length?q.forEach(r=>row(`${r.rid}  |  ${r.status}  |  ${r.created_at.slice(0,10)}`,$('#reqs'))):row('No certificate requests yet.',$('#reqs'));
  }catch(e){$('#lm2').textContent=msg(e)}
})();
 