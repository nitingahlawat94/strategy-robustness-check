const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>{s=(s||'').toUpperCase().replace(/[^0-9A-Z]/g,'').replace(/^RBLY/,'');return s.length===12?'RBLY-'+s.slice(0,4)+'-'+s.slice(4,8)+'-'+s.slice(8):null};
const say=(k,t)=>{const d=document.createElement('div');d.className='vmsg '+k;d.textContent=t;$('#vr').textContent='';$('#vr').append(d)};
function show(d){$('#vr').innerHTML=`<div class="cert"><div class="seal">&#10003;</div><p class="eyebrow">Certificate of robustness verification</p><div class="logo">Robust<b>ly</b></div>
<div class="cscore">${esc(d.score)}<small>/100</small></div><h2>${esc(d.headline)}</h2>${d.holder?`<p>Issued to <b>${esc(d.holder)}</b></p>`:''}
<dl><dt>Report ID</dt><dd>${esc(d.rid)}</dd><dt>Trades analysed</dt><dd>${esc(d.n)}</dd><dt>Issued on</dt><dd>${esc(d.date)}</dd><dt>Tool version</dt><dd>${esc(d.ver)}</dd></dl>
<p class="level">${esc(d.level)}</p><p class="csig"><span class="sig">Nitin Gahlawat</span><br>Founder &amp; CEO, Robustly</p>
<p class="vok">Signature valid. This certificate was issued by Robustly and has not been edited.</p></div><p><button class="btn ghost" type="button" onclick="window.print()">Print or save as PDF</button></p>`}
async function check(raw){
  const id=norm(raw);if(!id)return say('bad','That does not look like a Report ID. It should look like RBLY-1ADA-7215-7A36.');
  let c=null;
  if(BE.on){try{c=await BE.publicCert(id)}catch(e){}}
  if(!c){try{const reg=await(await fetch('data/registry.json',{cache:'no-store'})).json();c=reg.certificates.find(x=>x.data.rid===id)||null}catch(e){if(!BE.on)return say('bad','Could not load the certificate registry. Check your connection.')}}
  if(!c)return say('no','No certificate has been issued for '+id+'. A Report ID alone proves nothing, because anyone can generate one by running any file through the tool. If someone claims a result with this ID, ask them for the certificate.');
  let ok=false;try{ok=await certValid(c)}catch(e){}
  if(!ok)return say('bad','This registry entry does not match its signature. Do not trust it.');
  show(c.data);
}
$('#vf').onsubmit=e=>{e.preventDefault();location.hash=$('#vid').value;check($('#vid').value)};
addEventListener('hashchange',()=>{const h=decodeURIComponent(location.hash.slice(1));if(h){$('#vid').value=h;check(h)}});
if(location.hash.length>1){$('#vid').value=decodeURIComponent(location.hash.slice(1));check($('#vid').value)}
