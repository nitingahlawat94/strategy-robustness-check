const $=s=>document.querySelector(s);
let trades=[],srcName='',oosT=[];
const fmt=(x,d=0)=>x.toLocaleString(undefined,{maximumFractionDigits:d});
const pct=x=>(x*100).toFixed(1)+'%';
