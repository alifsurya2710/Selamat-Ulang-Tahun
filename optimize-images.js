const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const publicDir = path.join(__dirname, 'public');
  const appDir = path.join(__dirname, 'app');
  
  const logoPath = path.join(publicDir, 'logo.png');
  const faviconPath = path.join(appDir, 'favicon.ico');
  const faviconPublicPath = path.join(publicDir, 'favicon.ico'); // Sometimes favicon is in public

  console.log('Optimizing logo.png...');
  if (fs.existsSync(logoPath)) {
    await sharp(logoPath)
      .resize({ width: 512, withoutEnlargement: true }) // reasonable max size
      .png({ quality: 80, compressionLevel: 8 })
      .toFile(path.join(publicDir, 'logo_optimized.png'));
    
    fs.renameSync(path.join(publicDir, 'logo_optimized.png'), logoPath);
    console.log('logo.png optimized.');
  }

  const optimizeFavicon = async (filePath) => {
    if (fs.existsSync(filePath)) {
      console.log(`Optimizing ${filePath}...`);
      await sharp(filePath)
        .resize(64, 64)
        .png({ quality: 80 }) // usually icon is ico but sharp outputs png, we can just save it as smaller png then rename to ico for simple web apps (though not ideal for strict ico, next.js supports favicon.ico but it can be a png disguised as ico or we can just use favicon.png). Let's just compress it.
        .toFile(filePath + '.temp');
      fs.renameSync(filePath + '.temp', filePath);
      console.log(`${filePath} optimized.`);
    }
  };

  await optimizeFavicon(faviconPath);
  await optimizeFavicon(faviconPublicPath);
}

optimizeImages().then(() => console.log('Done optimizing images.')).catch(console.error);
