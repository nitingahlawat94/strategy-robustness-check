// Shared header, footer, mobile menu and contact wiring for every page.
(function(){
  const R=ROBUSTLY,$=s=>document.querySelector(s),home=/(^|\/)(index\.html)?$/.test(location.pathname),a=h=>(home?'':'index.html')+h;
  const links=[['Why Robustly',a('#different')],['Checks',a('#checks')],['Pricing',a('#pricing')],['Verify','verify.html'],['About','about.html'],['Methodology','methodology.html']];
  const logo=c=>`<a class="logo ${c||''}" href="index.html"><img class="mark" src="img/mark.png" alt="" width="30" height="30"><span>Robust<b>ly</b></span></a>`;
  const sh=$('#sh'),sf=$('#sf'),m=$('main');if(m&&!m.id)m.id='main';
  if(sh){sh.innerHTML=`<a class="skip" href="#${m?m.id:'main'}">Skip to content</a><div class="sh-in">${logo()}<button class="menu" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button><nav>${links.map(([t,h])=>`<a href="${h}">${t}</a>`).join('')}<a class="sh-btn" href="tool.html">Open the tool</a></nav></div>`;
    const b=sh.querySelector('.menu');b.onclick=()=>{b.setAttribute('aria-expanded',sh.classList.toggle('open'))};sh.querySelectorAll('nav a').forEach(x=>x.addEventListener('click',()=>{sh.classList.remove('open');b.setAttribute('aria-expanded','false')}))}
  if(sf)sf.innerHTML=`<div class="sf-in"><div><img class="flogo" src="img/logo.png" alt="Robustly" width="120" height="120"><p>Is your backtest skill, or luck? Check it before you risk real money.</p></div>
<div><h4>Product</h4><a href="tool.html">The tool</a><a href="verify.html">Verify a certificate</a><a href="methodology.html">Methodology</a><a href="${a('#pricing')}">Pricing</a></div>
<div><h4>Company</h4><a href="about.html">About</a><a href="${a('#contact')}">Contact</a><a href="${R.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="${R.github}" target="_blank" rel="noopener">GitHub</a></div>
<div><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="disclaimer.html">Disclaimer</a><a href="terms.html">Terms</a></div></div>
<div class="sf-bot"><b>Built by Nitin Gahlawat, Founder &amp; CEO.</b> &copy; ${new Date().getFullYear()} Robustly. Robustly analyses past trades you provide. It is not investment advice.</div>`;
  document.querySelectorAll('[data-email]').forEach(e=>e.textContent=R.email||'our LinkedIn page');
  document.querySelectorAll('[data-mail]').forEach(e=>{e.href=mailHref(e.dataset.mail,'');e.target='_blank';e.rel='noopener'});
  const cc=$('#ccopy'),cn=$('#cnote');
  if(cc){if(R.email){cc.onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(R.email):Promise.reject()).then(()=>{cc.textContent='Copied'},()=>{cn.textContent=R.email})}}else{cc.hidden=true;if(cn)cn.textContent='Our business email is coming soon. For now, message us on LinkedIn.'}}
  document.querySelectorAll('[data-li]').forEach(e=>{e.href=R.linkedin;e.target='_blank';e.rel='noopener'});document.querySelectorAll('[data-gh]').forEach(e=>{e.href=R.github;e.target='_blank';e.rel='noopener'});
})();
