// Pure helpers for the payment webhook. Imported by index.ts (Deno) and by tests (Node).
const enc=new TextEncoder();
export async function hmacHex(secret,msg){const k=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return[...new Uint8Array(await crypto.subtle.sign('HMAC',k,enc.encode(msg)))].map(b=>b.toString(16).padStart(2,'0')).join('')}
export function same(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0}
// Returns the payment to act on, or null if the event should be ignored.
export function proFromEvent(ev,proAmount){
  if(!ev||ev.event!=='payment.captured')return null;
  const p=ev.payload&&ev.payload.payment&&ev.payload.payment.entity;
  if(!p||p.status!=='captured'||p.currency!=='INR'||!p.id||!p.email)return null;
  if(proAmount&&p.amount!==proAmount)return null;
  return{id:p.id,email:String(p.email).toLowerCase(),amount:p.amount};
}
