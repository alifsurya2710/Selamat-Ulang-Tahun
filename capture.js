const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage();
  
  // Membuka file lokal
  const filePath = 'file:///' + path.resolve(__dirname, 'qrcode-love.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Menunggu gambar QR termuat sempurna
  await page.waitForSelector('.qr-code');
  // Menunggu sedikit lebih lama untuk memastikan CSS tertanam
  await new Promise(r => setTimeout(r, 1500));

  // Ambil elemen div .capture-area
  const captureElement = await page.$('.capture-area');
  
  // Hapus shadow saat mau di-screenshot biar bersih
  await page.evaluate(() => {
    document.querySelector('.capture-area').style.boxShadow = 'none';
  });

  // Screenshot elemen dan simpan ke folder artifacts dengan resolusi HD
  await captureElement.screenshot({
    path: 'C:\\Users\\mmoch\\.gemini\\antigravity-ide\\brain\\965fe15d-5b67-401a-baf6-96eec444558e\\qrcode-love-special.png',
    omitBackground: true
  });

  await browser.close();
})();
