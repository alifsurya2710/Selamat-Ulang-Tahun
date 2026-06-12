const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage();
  
  // Set deviceScaleFactor untuk high-res (anti ngeblur)
  await page.setViewport({
    width: 1200,
    height: 1000,
    deviceScaleFactor: 4
  });
  
  // Membuka file lokal
  const filePath = 'file:///' + path.resolve(__dirname, 'qrcode-love.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Menunggu font selesai diload
  await page.evaluateHandle('document.fonts.ready');

  // Menunggu gambar QR termuat sempurna
  await page.waitForSelector('.qr-code');
  await new Promise(r => setTimeout(r, 1500));

  // Ambil elemen div .capture-area
  const captureElement = await page.$('.capture-area');
  
  // Hapus shadow saat mau di-screenshot biar bersih tepinya
  await page.evaluate(() => {
    document.querySelector('.capture-area').style.boxShadow = 'none';
  });

  // Screenshot elemen dan simpan ke file utama
  const outputPath = path.resolve(__dirname, 'qrcode-love-premium.png');
  await captureElement.screenshot({
    path: outputPath,
    omitBackground: true
  });

  console.log('✅ Berhasil menggenerate qrcode-love-premium.png dengan resolusi tinggi (tidak blur) dan desain premium.');
  await browser.close();
})();
