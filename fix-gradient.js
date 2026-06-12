const fs = require('fs');
const path = require('path');

function fixTransparent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(/WebkitTextFillColor:\s*'transparent',/g, "WebkitTextFillColor: 'transparent',\n                color: 'transparent',");
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      fixTransparent(fullPath);
    }
  });
}

walk('c:/laragon/www/ulang-tahun-gebetan/app');
console.log('Fixed WebkitTextFillColor issues');
