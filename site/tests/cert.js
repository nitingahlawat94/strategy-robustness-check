const {webcrypto:{subtle}}=require('crypto'),fs=require('fs'),{canon,certValid,PUB}=require('../js/cert.js');
let bad=0;const chk=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)bad++};
(async()=>{
 const reg=JSON.parse(fs.readFileSync(__dirname+'/../data/registry.json')),s=reg.certificates.find(c=>c.data.rid==='RBLY-0000-0000-0000');
 chk('Shipped sample certificate verifies with the shipped public key',!!s&&await certValid(s));
 chk('Changing the score breaks the signature',!await certValid({data:{...s.data,score:99},sig:s.sig}));
 chk('Changing the holder name breaks the signature',!await certValid({data:{...s.data,holder:'Someone else'},sig:s.sig}));
 chk('Changing the Report ID breaks the signature',!await certValid({data:{...s.data,rid:'RBLY-1111-1111-1111'},sig:s.sig}));
 const k=await subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']),d={rid:'RBLY-ABCD-1234-5678',score:81,headline:'Evidence of a real edge, with caveats',date:'2026-02-01',n:420,level:'x',ver:'0.6',holder:'T'};
 const sig=Buffer.from(await subtle.sign({name:'ECDSA',hash:'SHA-256'},k.privateKey,new TextEncoder().encode(canon(d)))).toString('base64url'),pub=await subtle.exportKey('jwk',k.publicKey);
 chk('A fresh keypair signs and verifies (tools flow)',await certValid({data:d,sig},pub));
 chk('A certificate signed by a different key is rejected',!await certValid({data:d,sig},PUB));
 chk('The private test key is not in the project',!fs.existsSync(__dirname+'/../private-key.jwk'));
 process.exit(bad?1:0)})();
