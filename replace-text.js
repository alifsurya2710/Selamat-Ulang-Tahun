const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace specific text-white classes
  content = content.replace(/text-white\/80/g, 'text-rose-950 font-medium');
  content = content.replace(/text-white\/70/g, 'text-rose-950 font-medium');
  content = content.replace(/text-white\/65/g, 'text-rose-900');
  content = content.replace(/text-white\/60/g, 'text-rose-900');
  content = content.replace(/text-white\/55/g, 'text-rose-900');
  content = content.replace(/text-white\/50/g, 'text-rose-800');
  content = content.replace(/text-white\/40/g, 'text-rose-800');
  content = content.replace(/text-white\/35/g, 'text-rose-800');
  content = content.replace(/text-white\/30/g, 'text-rose-700 font-medium');
  content = content.replace(/text-white\/25/g, 'text-rose-700');
  content = content.replace(/text-white\/20/g, 'text-rose-700');
  content = content.replace(/text-white\b(?!\/)/g, 'text-rose-950 font-medium');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  });
}

walk('c:/laragon/www/ulang-tahun-gebetan/app');
console.log('Done replacing text-white with readable rose text.');
