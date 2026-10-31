// node tools/issue.js --rid=ELAB-XXXX-XXXX-XXXX --score=78 --headline="Promising, but not proven" --n=300 --holder="Name"
// Reproduce the person's file in the tool first and confirm the Report ID and score match. Then run this and commit data/registry.json.
const {webcrypto:{subtle}}=require('crypto'),fs=require('fs'),{canon}=require('../js/cert.js');
const a=Object.fromEntries(process.argv.slice(2).map(s=>{const i=s.indexOf('=');return[s.slice(0,i).replace(/^--/,''),s.slice(i+1)]}));
(async()=>{const d={rid:a.rid,score:+a.score,headline:a.headline,date:a.date||new Date().toISOString().slice(0,10),n:+a.n,level:a.level||'Reproduced by Edgelab from a supplied trade file. Not verified against a broker statement.',ver:a.ver||'0.6',holder:a.holder||''};
if(!/^ELAB-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(d.rid)||!(d.score>=0)||!d.headline||!(d.n>0))throw new Error('Missing or invalid --rid, --score, --headline or --n');
const k=await subtle.importKey('jwk',JSON.parse(fs.readFileSync('private-key.jwk')),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
const sig=Buffer.from(await subtle.sign({name:'ECDSA',hash:'SHA-256'},k,new TextEncoder().encode(canon(d)))).toString('base64url');
const f='data/registry.json',r=JSON.parse(fs.readFileSync(f));r.certificates=r.certificates.filter(c=>c.data.rid!==d.rid);r.certificates.push({data:d,sig});fs.writeFileSync(f,JSON.stringify(r,null,1));console.log('Issued',d.rid,'. Now commit data/registry.json')})().catch(e=>{console.error(e.message);process.exit(1)});
