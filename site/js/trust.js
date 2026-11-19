// Reproducibility: same trades + same settings + same tool version => same Report ID and same numbers.
const VER='0.6';
function h53(s,seed=0){let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0)}
function reportId(...args){const s=JSON.stringify([VER,...args]),a=h53(s),b=h53(s,1013);return{seed:a%4294967296,id:(a.toString(16).padStart(14,'0').slice(0,6)+b.toString(16).padStart(14,'0').slice(0,6)).toUpperCase()}}
function mkRng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
