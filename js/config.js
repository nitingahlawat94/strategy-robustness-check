// Edit this file only. Every page reads contact details from here.
const ROBUSTLY={
  email:'',   // your BUSINESS email, e.g. hello@robustly.in. Leave empty until you have one.
  linkedin:'https://www.linkedin.com/in/nitingahlawat94',
  github:'https://github.com/nitingahlawat94',
  reviewEndpoint:'' // paste a Formspree form URL here to switch on anonymous reviews
};
// Opens a Gmail compose window (works in any browser, no mail app needed). Falls back to LinkedIn if no email is set.
const mailHref=(s,b)=>ROBUSTLY.email?'https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(ROBUSTLY.email)+'&su='+encodeURIComponent(s||'')+'&body='+encodeURIComponent(b||''):ROBUSTLY.linkedin;
