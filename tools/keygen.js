// Run once on your own computer: node tools/keygen.js
// Saves private-key.jwk (KEEP SECRET, never upload it) and prints the public key to paste into js/cert.js as PUB.
const {webcrypto:{subtle}}=require('crypto'),fs=require('fs');
(async()=>{const k=await subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
fs.writeFileSync('private-key.jwk',JSON.stringify(await subtle.exportKey('jwk',k.privateKey)));
console.log('Saved private-key.jwk. Paste this into js/cert.js as PUB:\n'+JSON.stringify(await subtle.exportKey('jwk',k.publicKey)))})();
