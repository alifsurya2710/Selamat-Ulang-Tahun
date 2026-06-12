const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = 'http://ulang-tahun-gebetan.test';
const outputPath = path.join(__dirname, 'public', 'qrcode.png');

QRCode.toFile(outputPath, url, {
  width: 600,
  margin: 2,
  color: {
    dark: '#7c1d4e',   // pink tua
    light: '#fff0f6',  // pink muda
  },
  errorCorrectionLevel: 'H',
}, function (err) {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log(`✅ QR Code berhasil dibuat: ${outputPath}`);
    console.log(`🔗 URL yang di-encode: ${url}`);
  }
});
