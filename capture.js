const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
        const page = await browser.newPage();
        
        // Set higher device scale factor for high quality image and adjust viewport to fit the card nicely
        await page.setViewport({ width: 500, height: 700, deviceScaleFactor: 4 });
        
        console.log('Navigating to http://localhost:8080/qrcode-love.html...');
        await page.goto('http://localhost:8080/qrcode-love.html', { waitUntil: 'networkidle0' });
        
        // Wait an extra second for web fonts or anything else to be fully settled
        await new Promise(r => setTimeout(r, 2000));
        
        // Hide the download button so it doesn't appear in the screenshot
        await page.evaluate(() => {
            const btn = document.querySelector('.btn-download');
            if (btn) btn.style.display = 'none';
            document.body.style.margin = '0';
        });

        console.log('Capturing screenshot of the whole page...');
        const body = await page.$('body');
        
        await body.screenshot({
            path: 'qrcode-love-premium.png'
        });
        
        console.log('Successfully saved to qrcode-love-premium.png');
        await browser.close();
    } catch (err) {
        console.error('Error:', err);
    }
})();
