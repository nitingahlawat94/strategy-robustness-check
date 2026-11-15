// Edit this file only. Every page reads contact details from here.
const ROBUSTLY={
  email:'',   // your BUSINESS email, e.g. hello@robustly.in. Leave empty until you have one.
  linkedin:'https://www.linkedin.com/in/nitingahlawat94',
  github:'https://github.com/nitingahlawat94',
  reviewEndpoint:'',  // optional fallback: a Formspree URL, used only when Supabase is not set
  supabaseUrl:'https://twytfskmktpupcbrxnxs.supabase.co',     // Supabase > Settings > API > Project URL
  supabaseAnonKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eXRmc2tta3RwdXBjYnJ4bnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3MzY2ODAsImV4cCI6MjExMDMxMjY4MH0.Px9DDsbnWmMjlUTYfHxCZcLMmommz0jEyLUwEBtx2os', // Supabase anon public key. Safe to publish. NEVER use a secret/service_role key here.
  paymentUrl:''       // your Razorpay payment page link for the Pro plan
};
// Opens a Gmail compose window (works in any browser, no mail app needed). Falls back to LinkedIn if no email is set.
const mailHref=(s,b)=>ROBUSTLY.email?'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(ROBUSTLY.email)+'&su='+encodeURIComponent(s||'')+'&body='+encodeURIComponent(b||''):ROBUSTLY.linkedin;
