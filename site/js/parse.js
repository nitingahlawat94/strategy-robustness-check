function parseCSV(t){
  const first=(t.split(/\r?\n/).find(l=>l.trim())||'');
  const d=[',',';','\t'].map(c=>[c,first.split(c).length]).sort((a,b)=>b[1]-a[1])[0][0];
  const rows=[];let row=[],f='',q=false;
  for(let i=0;i<t.length;i++){const c=t[i];
    if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}
    else if(c=='"')q=true;
    else if(c==d){row.push(f);f=''}
    else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;row.push(f);rows.push(row);row=[];f=''}
    else f+=c}
  if(f||row.length){row.push(f);rows.push(row)}
  return{rows:rows.filter(r=>r.some(x=>x.trim())),d};
}
function num(s,d){
  s=String(s==null?'':s).trim();const neg=/^\(.*\)$/.test(s);
  s=s.replace(/[()\s₹$€£]/g,'');
  if(d==';'&&s.includes(',')&&!s.includes('.'))s=s.replace(',','.');else s=s.replace(/,/g,'');
  const v=Number(s);return s===''||isNaN(v)?NaN:(neg?-v:v);
}
function extract(text){
  const{rows,d}=parseCSV(text);
  if(!rows.length)throw new Error('The file is empty.');
  const hasHead=rows[0].some(c=>isNaN(num(c,d)));
  const head=hasHead?rows[0].map(h=>h.trim()):null;
  const body=hasHead?rows.slice(1):rows;
  let col=-1;
  if(head){
    col=head.findIndex(h=>/^(net\s*)?profit$/i.test(h));
    if(col<0)col=head.findIndex(h=>/profit|pnl|p\s*[&\/]\s*l|realized|result|gain|net/i.test(h)&&!/commission|swap|fee|%/i.test(h));
    if(col<0){const b=head.findIndex(h=>/^<?\s*balance\s*>?$/i.test(h));
      if(b>=0){const bv=body.map(r=>num(r[b],d)).filter(x=>!isNaN(x));
        return{vals:bv.slice(1).map((x,i)=>x-bv[i]).filter(x=>Math.abs(x)>1e-9),name:head[b]+' (balance changes = trade results)'}}}
  }
  if(col<0){
    const w=Math.max(...rows.map(r=>r.length));let best=-1,cnt=0;
    for(let c=0;c<w;c++){if(head&&/deposit|load|margin|equity|%|date|time|ticket|volume|price|\bid\b|size/i.test(head[c]||''))continue;const k=body.filter(r=>!isNaN(num(r[c],d))).length;if(k>=cnt){cnt=k;best=c}}
    col=best;
  }
  const vals=body.map(r=>num(r[col],d)).filter(x=>!isNaN(x)&&x!==0);
  return{vals,name:head?head[col]:'column '+(col+1)};
}
