// Import layer: turns broker exports (CSV, MetaTrader HTML, Excel) into per-trade profit values.
function decodeBuf(b){const u=new Uint8Array(b);if(u[0]==255&&u[1]==254)return new TextDecoder('utf-16le').decode(b);if(u[0]==254&&u[1]==255)return new TextDecoder('utf-16be').decode(b);return new TextDecoder('utf-8').decode(b)}
const KEY=/p.?&?l|profit|balance|price|qty|quantity|symbol|side|volume/i;
function tableOf(text){
  let rows,d='.';
  if(/<table/i.test(text)){
    const cells=r=>[...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>m[1].replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim());
    rows=[...text.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>cells(m[1])).filter(r=>r.length);
  }else{const p=parseCSV(text);rows=p.rows;d=p.d}
  const hi=rows.slice(0,60).findIndex(r=>r.filter(c=>c.trim()).length>=3&&r.some(c=>KEY.test(c))&&r.filter(c=>isNaN(num(c,d))).length>=2);
  if(hi<0)throw new Error('Could not find a header row. Check the file has column names such as Profit, Symbol or Price.');
  const head=rows[hi].map(h=>h.trim().replace(/^<|>$/g,''));
  return{head,body:rows.slice(hi+1).filter(r=>r.length>=head.length-2),d};
}
function fifo(t,sy,sd,qt,pr,tm){
  const d=t.d,x=t.body.map((r,i)=>{const s=(r[sd]||'').trim();return{s:(r[sy]||'').trim(),b:/^(b|buy|bot|long)/i.test(s)?1:/^(s|sell|sld|short)/i.test(s)?-1:0,q:Math.abs(num(r[qt],d)),p:num(r[pr],d),i,t:tm>=0?Date.parse(r[tm]):NaN}}).filter(o=>o.b&&o.q>0&&o.p>0);
  if(x.every(o=>!isNaN(o.t)))x.sort((a,b)=>a.t-b.t||a.i-b.i);
  const book={},out=[];
  for(const o of x){const L=book[o.s]=book[o.s]||[];let q=o.q,pnl=0,hit=false;
    while(q>1e-12&&L.length&&L[0].b!==o.b){const m=Math.min(q,L[0].q);pnl+=(o.p-L[0].p)*m*L[0].b;L[0].q-=m;q-=m;hit=true;if(L[0].q<=1e-12)L.shift()}
    if(hit)out.push(pnl);if(q>1e-12)L.push({b:o.b,q,p:o.p})}
  return out;
}
function smartExtract(text){
  const t=tableOf(text),{head:H,body,d}=t,ix=(re,ex)=>H.findIndex(h=>re.test(h)&&!(ex&&ex.test(h))),N=(r,i)=>num(r[i],d),z=x=>isNaN(x)?0:x,f=v=>v.filter(x=>isFinite(x)&&Math.abs(x)>1e-9);
  const pc=ix(/^(net\s*)?(profit|p.?&?l|pnl|p\/l)\b|^realis?ed.*p.?&?l|^net.*p.?&?l/i,/%|cum|run.?up|drawdown|unreal|total|gross|open/i);
  if(pc>=0){
    const sw=ix(/^swap$/i),cm=ix(/^commission$/i),tx=ix(/^taxes?$/i),dr=ix(/^direction$/i),ty=ix(/^type$/i),mt=sw>=0;
    const v=body.filter(r=>{const T=ty>=0?(r[ty]||''):'',D=dr>=0?(r[dr]||''):'';return!/balance|credit|deposit|withdraw|correction|bonus|charge/i.test(T)&&!/^entry/i.test(T)&&(dr<0||/out/i.test(D))})
      .map(r=>N(r,pc)+(mt?z(N(r,sw))+(cm>=0?z(N(r,cm)):0)+(tx>=0?z(N(r,tx)):0):0));
    return{vals:f(v),name:mt?'MetaTrader: profit + commission + swap':H[pc]};
  }
  const bc=ix(/^balance$/i);
  if(bc>=0){const b=body.map(r=>N(r,bc)).filter(x=>!isNaN(x));return{vals:f(b.slice(1).map((x,i)=>x-b[i])),name:H[bc]+' (balance changes = trade results)'}}
  const sy=ix(/symbol|instrument|ticker|scrip|stock|contract|item|pair|asset/i),sd=ix(/^(trade[_ ]?type|side|buy\/?sell|action|b\/s|order[_ ]?type|type)$/i),qt=ix(/qty|quantity|volume|size|shares|lots/i),pr=ix(/price|rate/i,/value|stop|limit|trigger/i),tm=ix(/time|date/i);
  if(sy>=0&&sd>=0&&qt>=0&&pr>=0)return{vals:f(fifo(t,sy,sd,qt,pr,tm)),name:'buy/sell fills, FIFO-matched by symbol (fees not included)'};
  const e=new Error('I could not tell which column is profit. Choose it below.');e.table=t;throw e;
}
function loadXLSX(){return window.XLSX?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=ok;s.onerror=()=>no(new Error('Could not load the Excel reader. Save the file as CSV and try again.'));document.head.appendChild(s)})}
async function extractFile(f){
  const buf=await f.arrayBuffer(),u=new Uint8Array(buf);
  if(u[0]==80&&u[1]==75){await loadXLSX();const wb=XLSX.read(buf,{type:'array'});let best=null,err=null;
    for(const n of wb.SheetNames){try{const r=smartExtract(XLSX.utils.sheet_to_csv(wb.Sheets[n]));if(!best||r.vals.length>best.vals.length)best=r}catch(e){err=err||e}}
    if(best)return best;throw err||new Error('No readable sheet found.')}
  return smartExtract(decodeBuf(buf));
}
function askMap(t,name){
  const m=$('#map');m.textContent='';const l=document.createElement('label');l.textContent='Which column holds profit per trade?';const s=document.createElement('select');
  t.head.forEach((h,i)=>s.add(new Option(h||'column '+(i+1),i)));const b=document.createElement('button');b.type='button';b.textContent='Use this column';
  b.onclick=()=>{const i=+s.value,v=t.body.map(r=>num(r[i],t.d)).filter(x=>!isNaN(x)&&x!==0);m.textContent='';if(v.length<10){$('#msg').textContent='Only '+v.length+' usable values in that column.';return}trades=v;srcName=name+' ('+t.head[i]+', chosen by you)';go()};
  m.append(l,' ',s,' ',b);
}
async function loadFile(f){
  $('#msg').textContent='';$('#map').textContent='';
  try{const r=await extractFile(f);trades=r.vals;srcName=f.name+' ('+r.name+')';
    if(trades.length<10){$('#msg').textContent=`Found only ${trades.length} usable trades (${r.name}). If this is a per-symbol summary, export the trade-level report or tradebook instead.`;return}
    go()}catch(e){$('#msg').textContent=e.message;if(e.table)askMap(e.table,f.name)}
}
