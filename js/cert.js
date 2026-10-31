// Certificate verification. Certificates are signed with a private key that only the founder holds (tools/issue.js).
// Anyone can verify a certificate with the public key below. Replace PUB with your own key (tools/keygen.js) before launch.
const PUB={"key_ops":["verify"],"ext":true,"kty":"EC","x":"oYVFDvYxEgE3mO_urhomOg52mJeK9Xp8RkXP5BvvFLg","y":"Zp-0chI4q24O03SjyZ4qEaokzTLSNJ0nqACM2hB-8Y0","crv":"P-256"};
const canon=d=>JSON.stringify([d.rid,d.score,d.headline,d.date,d.n,d.level,d.ver,d.holder||'']);
const b64u=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
async function certValid(c,pub=PUB){const k=await crypto.subtle.importKey('jwk',pub,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);return crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},k,b64u(c.sig),new TextEncoder().encode(canon(c.data)))}
if(typeof module!=='undefined')module.exports={canon,certValid,b64u,PUB};
