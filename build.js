// Inlines css/ and js/ into one self-contained file: dist/robustness-check.html
const fs=require('fs');let h=fs.readFileSync('tool.html','utf8'),js='';
h=h.replace(/<link rel="stylesheet" href="(.*?)">/,(_,p)=>'<style>\n'+fs.readFileSync(p,'utf8')+'</style>');
h=h.replace(/<script src="(.*?)"><\/script>\n?/g,(_,p)=>{js+=fs.readFileSync(p,'utf8');return''});
h=h.replace('</body>',()=>'<script>\n'+js+'</script>\n</body>');
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/robustness-check.html',h);console.log('built dist/robustness-check.html',h.length,'bytes');
