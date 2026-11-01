// Edit this file only. Every page reads contact details from here.
const ROBUSTLY={
  email:'',   // your BUSINESS email, e.g. hello@robustly.in. Leave empty until you have one.
  linkedin:'https://www.linkedin.com/in/nitingahlawat94',
  github:'https://github.com/nitingahlawat94',
  reviewEndpoint:'',  // optional fallback: a Formspree URL, used only when Supabase is not set
  supabaseUrl:'',     // Supabase > Settings > API > Project URL
  supabaseAnonKey:'', // Supabase > Settings > API > anon public key. Safe to publish. NEVER paste the service_role key here.
  paymentUrl:''       // your Razorpay payment page link for the Pro plan
};
// Opens a Gmail compose window (works in any browser, no mail app needed). Falls back to LinkedIn if no email is set.
const mailHref=(s,b)=>ROBUSTLY.email?'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(ROBUSTLY.email)+'&su='+encodeURIComponent(s||'')+'&body='+encodeURIComponent(b||''):ROBUSTLY.linkedin;
