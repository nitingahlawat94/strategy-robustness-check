// Edit this file only. Every page reads contact details from here.
const ROBUSTLY={
  email:'',   // your BUSINESS email, e.g. hello@robustly.in. Leave empty until you have one.
  linkedin:'https://www.linkedin.com/in/nitingahlawat94',
  github:'https://github.com/nitingahlawat94',
  reviewEndpoint:'',  // optional fallback: a Formspree URL, used only when Supabase is not set
  supabaseUrl:'https://mhidmtyraersnapeopxt.supabase.co',     // Supabase > Settings > API > Project URL
  supabaseAnonKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oaWRtdHlyYWVyc25hcGVvcHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MDk3MzMsImV4cCI6MjEwOTI4NTczM30.p9CfvWBhbLNs1uNGh_1GlAK8svy30qj5oTw2PpcdB8k', // Supabase > Settings > API > anon public key. Safe to publish. NEVER paste the service_role key here.
  paymentUrl:''       // your Razorpay payment page link for the Pro plan
};
// Opens a Gmail compose window (works in any browser, no mail app needed). Falls back to LinkedIn if no email is set.
const mailHref=(s,b)=>ROBUSTLY.email?'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(ROBUSTLY.email)+'&su='+encodeURIComponent(s||'')+'&body='+encodeURIComponent(b||''):ROBUSTLY.linkedin;
