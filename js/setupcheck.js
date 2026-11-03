(async()=>{
  const R=ROBUSTLY,L=document.querySelector('#ck');
  const add=(ok,t,d)=>{const r=document.createElement('div'),s=document.createElement('span');r.className='hrow';s.textContent=(ok===true?'\u2713  ':ok===false?'\u2717  ':'i  ')+t+(d?': '+d:'');s.style.color=ok===true?'var(--good)':ok===false?'var(--bad)':'var(--mute)';r.append(s);L.append(r)};
  if(!BE.on)add(false,'Supabase keys are set in js/config.js','not yet. Paste supabaseUrl and supabaseAnonKey there, then reload this page.');
  else{
    const k=keyKind(R.supabaseAnonKey),bad=k==='service'||k==='secret';
    add(!bad,'Key type',bad?'DANGER: this is a SECRET key. Remove it from js/config.js right now and rotate it in Supabase.':k==='unknown'?'format not recognised (it may still work)':'public key, safe to publish');
    try{const c=await BE.init(),{error}=await c.auth.getSession();add(!error,'Can reach your Supabase project',error&&error.message)}catch(e){add(false,'Can reach your Supabase project',e.message)}
    for(const t of ['profiles','payments','reports','certificate_requests','certificates','reviews','waitlist']){try{const c=await BE.init(),{error}=await c.from(t).select('*',{count:'exact',head:true});add(!error,'Table "'+t+'" exists',error&&error.message)}catch(e){add(false,'Table "'+t+'" exists',e.message)}}
  }
  add(R.email?true:null,'Business email',R.email?'set':'not set (contact buttons use LinkedIn)');
  add(R.paymentUrl?true:null,'Payment link',R.paymentUrl?'set':'not set yet (the Razorpay step)');
})();
