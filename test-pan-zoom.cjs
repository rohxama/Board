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

    // Wait for stage to be ready
    await page.waitForFunction(() => !!window.__benchStage, { timeout: 5000 });

    const clickTool = async (name) => {
      await page.evaluate((n) => {
        const btns = document.querySelectorAll('.left-toolbar button');
        for (const b of btns) {
          if ((b.getAttribute('title') || '').startsWith(n)) { b.click(); return; }
        }
      }, name);
      await new Promise(r => setTimeout(r, 100));
    };

    const getTool = () => page.evaluate(() => {
      const btn = document.querySelector('.left-toolbar button.active');
      return btn ? (btn.getAttribute('title') || '').split(' ')[0].toLowerCase() : null;
    });

    const getView = () => page.evaluate(() => {
      const s = window.__benchStage;
      if (!s) return null;
      return { x: s.x(), y: s.y(), scale: s.scaleX() };
    });

    const waitForStable = async (ms = 150) => new Promise(r => setTimeout(r, ms));

    const zoomIn = async () => {
      await page.mouse.move(400, 300);
      // Use keyboard shortcut instead of wheel for reliability
      await page.evaluate(() => {
        const btn = document.querySelector('.zoom-controls button:first-child');
        if (btn) btn.click();
      });
      await waitForStable();
    };

    const zoomOut = async () => {
      await page.evaluate(() => {
        const btns = document.querySelectorAll('.zoom-controls button');
        if (btns[0]) btns[0].click();
      });
      await waitForStable();
    };

    const resetZoom = async () => {
      await page.evaluate(() => {
        const btn = document.querySelector('.zoom-controls button:nth-child(2)');
        if (btn) btn.click();
      });
      await waitForStable();
    };

    const pan = async (cx, cy, dx, dy) => {
      const before = getView();
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) {
        await page.mouse.move(cx + (dx * i / 10), cy + (dy * i / 10));
        await new Promise(r => setTimeout(r, 16));
      }
      await waitForStable(50);
      const during = getView();
      await page.mouse.up();
      await waitForStable(300);
      const after = getView();
      return { before, during, after };
    };

    let passed = 0, failed = 0;
    const assert = (cond, msg) => { if (cond) { passed++; } else { failed++; console.log('  FAIL: ' + msg); } };

    // Draw a shape
    await clickTool('Rectangle');
    await page.mouse.move(300, 250);
    await page.mouse.down();
    await page.mouse.move(500, 350);
    await page.mouse.up();
    await waitForStable(300);

    const v0 = getView();
    console.log('Initial view:', JSON.stringify(v0));

    // === Test 1: Pan → Zoom in → Pan ===
    console.log('\n=== Test 1: Pan → Zoom in → Pan ===');
    {
      await clickTool('Pan');
      const r1 = await pan(400, 300, 50, 30);
      console.log(`  Pan1: before=(${r1.before.x.toFixed(0)},${r1.before.y.toFixed(0)}) during=(${r1.during.x.toFixed(0)},${r1.during.y.toFixed(0)}) after=(${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan 1 moved');

      const beforeZoom = getView();
      await zoomIn();
      const afterZoom = getView();
      console.log(`  Zoom: scale ${beforeZoom.scale.toFixed(2)} → ${afterZoom.scale.toFixed(2)}`);
      assert(afterZoom.scale > beforeZoom.scale, `Zoom increased: ${afterZoom.scale.toFixed(2)} > ${beforeZoom.scale.toFixed(2)}`);

      const r2 = await pan(400, 300, 40, 25);
      console.log(`  Pan2: before=(${r2.before.x.toFixed(0)},${r2.before.y.toFixed(0)}) during=(${r2.during.x.toFixed(0)},${r2.during.y.toFixed(0)}) after=(${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after zoom');
    }

    // === Test 2: Pan → Zoom out → Pan ===
    console.log('\n=== Test 2: Pan → Zoom out → Pan ===');
    {
      await resetZoom();
      await clickTool('Pan');

      const r1 = await pan(400, 300, -40, -20);
      console.log(`  Pan1: after=(${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan 1 moved');

      const beforeZoom = getView();
      await zoomOut();
      const afterZoom = getView();
      console.log(`  Zoom: scale ${beforeZoom.scale.toFixed(2)} → ${afterZoom.scale.toFixed(2)}`);
      assert(afterZoom.scale < beforeZoom.scale, `Zoom decreased: ${afterZoom.scale.toFixed(2)} < ${beforeZoom.scale.toFixed(2)}`);

      const r2 = await pan(400, 300, -30, -15);
      console.log(`  Pan2: after=(${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after zoom out');
    }

    // === Test 3: Pan → Reset 100% → Pan ===
    console.log('\n=== Test 3: Pan → Reset 100% → Pan ===');
    {
      await clickTool('Pan');

      const r1 = await pan(400, 300, 60, 40);
      console.log(`  Pan1: after=(${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan 1 moved');

      await resetZoom();
      const afterReset = getView();
      console.log(`  Reset: (${afterReset.x.toFixed(0)},${afterReset.y.toFixed(0)}) scale=${afterReset.scale.toFixed(2)}`);
      assert(Math.abs(afterReset.scale - 1) < 0.01, `Reset to 100%: scale=${afterReset.scale.toFixed(2)}`);

      const r2 = await pan(400, 300, 50, 30);
      console.log(`  Pan2: after=(${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after reset');
    }

    // === Test 4: Pan → Zoom-to-fit (has shapes) → Pan ===
    console.log('\n=== Test 4: Pan → Zoom-to-fit → Pan ===');
    {
      await clickTool('Pan');

      const r1 = await pan(400, 300, -30, -20);
      console.log(`  Pan1: after=(${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);

      await resetZoom();
      const afterFit = getView();
      console.log(`  After reset: (${afterFit.x.toFixed(0)},${afterFit.y.toFixed(0)}) scale=${afterFit.scale.toFixed(2)}`);

      const r2 = await pan(400, 300, 40, 30);
      console.log(`  Pan2: after=(${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after reset');
    }

    // === Test 5: Zoom → Rectangle → Pan → Pan ===
    console.log('\n=== Test 5: Zoom → Rectangle → Pan → Pan ===');
    {
      const beforeZoom = getView();
      await zoomIn();
      await zoomIn();
      const afterZoom = getView();
      console.log(`  Zoom: scale ${beforeZoom.scale.toFixed(2)} → ${afterZoom.scale.toFixed(2)}`);
      assert(afterZoom.scale > beforeZoom.scale, 'Zoomed in');

      await clickTool('Rectangle');
      assert(await getTool() === 'rectangle', 'Tool is Rectangle');
      await waitForStable(100);

      await clickTool('Pan');
      assert(await getTool() === 'pan', 'Tool is Pan');
      await waitForStable(100);

      const r1 = await pan(400, 300, 30, 20);
      console.log(`  Pan1: after=(${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)}) scale=${r1.after.scale.toFixed(2)}`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan moved after zoom+tool switch');
      assert(Math.abs(r1.after.scale - afterZoom.scale) < 0.01, 'Scale preserved after pan');
    }

    // === Final verification ===
    console.log('\n=== Final verification ===');
    const finalView = getView();
    console.log(`  Final: (${finalView.x.toFixed(1)},${finalView.y.toFixed(1)}) scale=${finalView.scale.toFixed(2)}`);
    assert(finalView !== null, 'View readable');

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
