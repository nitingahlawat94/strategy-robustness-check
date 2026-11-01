// Inlines css/ and js/ into one self-contained file: dist/robustness-check.html
const fs=require('fs');let h=fs.readFileSync('tool.html','utf8'),js='';
h=h.replace(/<link rel="stylesheet" href="(.*?)">/g,(_,p)=>'<style>\n'+fs.readFileSync(p,'utf8')+'</style>');
h=h.replace(/<script src="(.*?)"><\/script>\n?/g,(_,p)=>{js+=fs.readFileSync(p,'utf8');return''});
h=h.replace('</body>',()=>'<script>\n'+js+'</script>\n</body>');
const IMG={png:'image/png',jpg:'image/jpeg'};h=h.replace(/img\/[\w.-]+\.(png|jpg)/g,m=>'data:'+IMG[m.split('.').pop()]+';base64,'+fs.readFileSync(m).toString('base64'));
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/robustness-check.html',h);console.log('built dist/robustness-check.html',h.length,'bytes');
