const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  await page.setViewport({ width: 800, height: 600 });

  try {
    await page.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.waitForFunction(() => {
      const splash = document.querySelector('.splash-screen');
      return !splash || splash.classList.contains('is-leaving');
    }, { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1500));

    // Debug: check what __benchStage exposes
    const debug = await page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return { error: 'no stage' };
      return {
        type: typeof s,
        hasX: typeof s.x,
        hasY: typeof s.y,
        hasScaleX: typeof s.scaleX,
        hasGetScaleX: typeof s.getScaleX,
        xVal: typeof s.x === 'function' ? s.x() : s.x,
        yVal: typeof s.y === 'function' ? s.y() : s.y,
        scaleXVal: typeof s.scaleX === 'function' ? s.scaleX() : s.scaleX,
        keys: Object.keys(s).filter(k => k.includes('scale') || k.includes('pos')).slice(0, 10),
      };
    });
    console.log('Stage debug:', JSON.stringify(debug, null, 2));

    await browser.close();
  } catch (e) {
    console.error('Error:', e.message);
    await browser.close();
  }
})();
