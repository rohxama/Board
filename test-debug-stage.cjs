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
    await page.waitForFunction(() => !!window.__benchStage, { timeout: 5000 });

    // Draw shape first
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.left-toolbar button');
      for (const b of btns) {
        if ((b.getAttribute('title') || '').startsWith('Rectangle')) { b.click(); break; }
      }
    });
    await new Promise(r => setTimeout(r, 100));
    await page.mouse.move(300, 250);
    await page.mouse.down();
    await page.mouse.move(500, 350);
    await page.mouse.up();
    await new Promise(r => setTimeout(r, 300));

    // Check stage state
    const s1 = await page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return 'null';
      return { type: s.getClassName?.() || s.constructor?.name, x: s.x(), y: s.y(), scaleX: s.scaleX() };
    });
    console.log('After draw:', JSON.stringify(s1));

    // Switch to Pan
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.left-toolbar button');
      for (const b of btns) {
        if ((b.getAttribute('title') || '').startsWith('Pan')) { b.click(); break; }
      }
    });
    await new Promise(r => setTimeout(r, 100));

    // Pan
    await page.mouse.move(400, 300);
    await page.mouse.down();
    await page.mouse.move(450, 330);
    await new Promise(r => setTimeout(r, 50));
    
    const s2 = await page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return 'null';
      return { x: s.x(), y: s.y(), scaleX: s.scaleX() };
    });
    console.log('During pan:', JSON.stringify(s2));

    await page.mouse.up();
    await new Promise(r => setTimeout(r, 300));

    const s3 = await page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return 'null';
      return { x: s.x(), y: s.y(), scaleX: s.scaleX() };
    });
    console.log('After pan:', JSON.stringify(s3));

    // Zoom in
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.zoom-controls button');
      if (btns[0]) btns[0].click();
    });
    await new Promise(r => setTimeout(r, 300));

    const s4 = await page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return 'null';
      const zoomBtn = document.querySelector('.zoom-controls button:nth-child(2)');
      return { x: s.x(), y: s.y(), scaleX: s.scaleX(), zoomText: zoomBtn?.textContent };
    });
    console.log('After zoom:', JSON.stringify(s4));

    // Pan after zoom
    await page.mouse.move(400, 300);
    await page.mouse.down();
    await page.mouse.move(430, 315);
    await new Promise(r => setTimeout(r, 50));
    
    const s5 = await page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return 'null';
      return { x: s.x(), y: s.y(), scaleX: s.scaleX() };
    });
    console.log('Pan after zoom (during):', JSON.stringify(s5));

    await page.mouse.up();
    await new Promise(r => setTimeout(r, 300));

    const s6 = await page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return 'null';
      return { x: s.x(), y: s.y(), scaleX: s.scaleX() };
    });
    console.log('Pan after zoom (after):', JSON.stringify(s6));

    await browser.close();
  } catch (e) {
    console.error('Error:', e.message);
    await browser.close();
  }
})();
