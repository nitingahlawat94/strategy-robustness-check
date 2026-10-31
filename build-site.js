// Builds dist/site-preview.html: the landing page with CSS and JS inlined, for quick previews.
const fs=require('fs');let h=fs.readFileSync('index.html','utf8');const tool=process.argv[2]||'tool.html';
h=h.replace(/<link rel="stylesheet" href="(.*?)">/,(_,p)=>'<style>\n'+fs.readFileSync(p,'utf8')+'</style>');
h=h.replace(/<script src="(.*?)"><\/script>/,(_,p)=>'<script>\n'+fs.readFileSync(p,'utf8')+'</script>');
h=h.split('href="tool.html').join('href="'+tool);
h=h.replace(/src="(img\/[^"]+)"/g,(_,p)=>'src="data:image/jpeg;base64,'+fs.readFileSync(p).toString('base64')+'"');
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/site-preview.html',h);console.log('built dist/site-preview.html',h.length,'bytes');
