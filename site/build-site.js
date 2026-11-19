
// Builds the Cloudflare landing page
const fs = require('fs');

let h = fs.readFileSync('index.html', 'utf8');
const tool = 'robustness-check.html';

h = h.replace(/<link rel="stylesheet" href="(.*?)">/g, (_, p) =>
  '<style>\n' + fs.readFileSync(p, 'utf8') + '</style>'
);

h = h.replace(/<script src="(.*?)"><\/script>/g, (_, p) =>
  '<script>\n' + fs.readFileSync(p, 'utf8') + '</script>'
);

h = h.split('href="tool.html').join('href="' + tool);

const IMG = { png: 'image/png', jpg: 'image/jpeg' };

h = h.replace(/img\/[\w.-]+\.(png|jpg)/g, m =>
  'data:' + IMG[m.split('.').pop()] + ';base64,' +
  fs.readFileSync(m).toString('base64')
);

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', h);

console.log('Built dist/index.html');
