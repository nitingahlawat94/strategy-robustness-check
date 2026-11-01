// Optional backend (Supabase). When js/config.js has no supabaseUrl, everything here stays off and the site works as before.
const BE={
  on:!!(ROBUSTLY.supabaseUrl&&ROBUSTLY.supabaseAnonKey),client:null,
  async init(){if(!this.on)return null;if(this.client)return this.client;
    if(!window.supabase)await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';s.onload=ok;s.onerror=()=>no(new Error('Could not load the account service.'));document.head.appendChild(s)});
    return this.client=window.supabase.createClient(ROBUSTLY.supabaseUrl,ROBUSTLY.supabaseAnonKey)},
  async user(){const c=await this.init();if(!c)return null;const{data}=await c.auth.getUser();return data&&data.user||null},
  async signIn(email){const c=await this.init(),{error}=await c.auth.signInWithOtp({email,options:{emailRedirectTo:location.href.replace(/[^/]*$/,'')+'account.html'}});if(error)throw error},
  async signOut(){const c=await this.init();await c.auth.signOut()},
  async saveReport(r){const c=await this.init(),u=await this.user();if(!u)throw new Error('Sign in first.');const{error}=await c.from('reports').upsert({user_id:u.id,rid:r.rid,score:r.sc,headline:r.hl,n:r.n,source:r.src},{onConflict:'user_id,rid'});if(error)throw error},
  async requestCert(r,holder){const c=await this.init(),u=await this.user();if(!u)return;const{error}=await c.from('certificate_requests').insert({user_id:u.id,rid:r.rid,score:r.sc,n:r.n,holder:holder||null});if(error)throw error},
  async list(t){const c=await this.init(),{data,error}=await c.from(t).select('*').order('created_at',{ascending:false});if(error)throw error;return data||[]},
  async publicCert(rid){const c=await this.init(),{data}=await c.from('certificates').select('data,sig').eq('rid',rid).maybeSingle();return data},
  async reviews(){const c=await this.init(),{data}=await c.from('reviews').select('rating,body,name').eq('approved',true).order('created_at',{ascending:false}).limit(9);return data||[]},
  async addReview(x){const c=await this.init(),{error}=await c.from('reviews').insert({rating:+x.rating,body:x.review,name:x.name||null});if(error)throw error},
  async joinWaitlist(email){const c=await this.init(),{error}=await c.from('waitlist').insert({email:email.trim().toLowerCase()});if(error&&error.code!=='23505')throw error}
};
