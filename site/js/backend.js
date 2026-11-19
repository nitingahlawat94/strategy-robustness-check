// Optional backend (Supabase). When js/config.js has no supabaseUrl, everything here stays off and the site works as before.
const BE={
  on:!!(ROBUSTLY.supabaseUrl&&ROBUSTLY.supabaseAnonKey),client:null,
  async init(){if(!this.on)return null;if(this.client)return this.client;
    if(!window.supabase)await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';s.onload=ok;s.onerror=()=>no(new Error('Could not load the account service.'));document.head.appendChild(s)});
    return this.client=window.supabase.createClient(ROBUSTLY.supabaseUrl,ROBUSTLY.supabaseAnonKey)},
  async user(){const c=await this.init();if(!c)return null;const{data}=await c.auth.getUser();return data&&data.user||null},
  async profile(){const c=await this.init(),u=await this.user();if(!u)return null;const{data,error}=await c.from('profiles').select('full_name,phone,created_at').eq('id',u.id).single();if(error)throw error;return data},
  async updateProfile(details){const c=await this.init(),u=await this.user();if(!u)throw new Error('Sign in first.');const{error}=await c.from('profiles').update({full_name:details.full_name||null,phone:details.phone||null}).eq('id',u.id);if(error)throw error},
  async signIn(email){const c=await this.init(),{error}=await c.auth.signInWithOtp({email,options:{shouldCreateUser:true}});if(error)throw error},
  async verifyEmailCode(email,token){const c=await this.init(),{error}=await c.auth.verifyOtp({email,token,type:'email'});if(error)throw error},
  async signInWith(provider){const c=await this.init(),{error}=await c.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+location.pathname}});if(error)throw error},
  async signOut(){const c=await this.init();await c.auth.signOut()},
  async saveReport(r){const c=await this.init(),u=await this.user();if(!u)throw new Error('Sign in first.');const{error}=await c.from('reports').upsert({user_id:u.id,rid:r.rid,score:r.sc,headline:r.hl,n:r.n,source:r.src},{onConflict:'user_id,rid'});if(error)throw error},
  async clearReports(){const c=await this.init(),u=await this.user();if(!u)return;const{error}=await c.from('reports').delete().eq('user_id',u.id);if(error)throw error},
  async requestCert(r,holder){const c=await this.init(),u=await this.user();if(!u)return;const{error}=await c.from('certificate_requests').insert({user_id:u.id,rid:r.rid,score:r.sc,n:r.n,holder:holder||null});if(error)throw error},
  async list(t){const c=await this.init(),{data,error}=await c.from(t).select('*').order('created_at',{ascending:false});if(error)throw error;return data||[]},
  async publicCert(rid){const c=await this.init(),{data}=await c.from('certificates').select('data,sig').eq('rid',rid).maybeSingle();return data},
  async reviews(){const c=await this.init(),{data}=await c.from('reviews').select('rating,body,name').eq('approved',true).order('created_at',{ascending:false}).limit(9);return data||[]},
  async addReview(x){const c=await this.init(),{error}=await c.from('reviews').insert({rating:+x.rating,body:x.review,name:x.name||null});if(error)throw error},
  async reportEntitlements(){const c=await this.init(),{data,error}=await c.from('report_access').select('report_id,package,created_at').order('created_at',{ascending:false});if(error)throw error;return data||[]},
  async createReportOrder(reportId,plan){const c=await this.init(),{data,error}=await c.functions.invoke('create-report-order',{body:{reportId,package:plan}});if(error)throw error;return data},
  async verifyReportPayment(payload){const c=await this.init(),{data,error}=await c.functions.invoke('verify-report-payment',{body:payload});if(error)throw error;return data},
  async hasReportAccess(reportId,plan){const c=await this.init(),{data,error}=await c.from('report_access').select('package').eq('report_id',reportId).maybeSingle();if(error)throw error;return !!data&&(data.package==='pro'||data.package===plan)}
};

// Tells setup-check whether a pasted key is safe to publish.
function keyKind(k){k=String(k||'');if(/^sb_secret_/.test(k))return'secret';if(/^sb_publishable_/.test(k))return'publishable';try{const r=JSON.parse(atob(k.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role;return r==='anon'?'anon':r==='service_role'?'service':'unknown'}catch(e){return'unknown'}}
