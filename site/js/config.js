// Edit this file only. Every page reads contact details from here.
const ROBUSTLY={
  email:'support@robustly.com', // Public address requested; it needs an owned domain and working mail routing.
  supportAddress:'support@robustly.com',
  linkedin:'https://www.linkedin.com/in/nitingahlawat94',
  github:'https://github.com/nitingahlawat94',
  reviewEndpoint:'',  // optional fallback: a Formspree URL, used only when Supabase is not set
  supabaseUrl:'https://twytfskmktpupcbrxnxs.supabase.co',     // Supabase > Settings > API > Project URL
  supabaseAnonKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eXRmc2tta3RwdXBjYnJ4bnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3MzY2ODAsImV4cCI6MjExMDMxMjY4MH0.Px9DDsbnWmMjlUTYfHxCZcLMmommz0jEyLUwEBtx2os', // Supabase > Settings > API > anon public key. Safe to publish. NEVER paste the service_role key here.
  razorpayKeyId:'',  // Public checkout key ID; never put the key secret here.
  paymentFunctionsReady:false, // Enable only after the server functions and webhook are deployed.
  reportPrices:{basic:{amount:700,currency:'USD'},pro:{amount:2300,currency:'USD'}}
};
// Opens an email compose window addressed to the public support address.
const mailHref=(s,b)=>'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(ROBUSTLY.email)+'&su='+encodeURIComponent(s||'')+'&body='+encodeURIComponent(b||'');
