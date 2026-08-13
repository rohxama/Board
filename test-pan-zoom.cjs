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
    await new Promise(r => setTimeout(r, 2000));
    await page.waitForFunction(() => !!window.__benchStage, { timeout: 5000 });

    const clickTool = async (name) => {
      await page.evaluate((n) => {
        const btns = document.querySelectorAll('.left-toolbar button');
        for (const b of btns) {
          if ((b.getAttribute('title') || '').startsWith(n)) { b.click(); return; }
        }
      }, name);
      await new Promise(r => setTimeout(r, 150));
    };

    const getTool = () => page.evaluate(() => {
      const btn = document.querySelector('.left-toolbar button.active');
      return btn ? (btn.getAttribute('title') || '').split(' ')[0].toLowerCase() : null;
    });

    const getView = async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const v = await page.evaluate(() => {
          const s = window.__benchStage;
          if (!s) return { err: 'no stage ref' };
          try {
            const x = s.x(), y = s.y(), sc = s.scaleX();
            if (typeof x !== 'number' || typeof y !== 'number' || typeof sc !== 'number') {
              return { err: 'non-number', x: typeof x, y: typeof y, sc: typeof sc };
            }
            return { x, y, scale: sc };
          } catch (e) {
            return { err: e.message };
          }
        });
        if (!v.err) return v;
        if (attempt === 0) console.log('  getView attempt 0:', JSON.stringify(v));
        await new Promise(r => setTimeout(r, 200));
      }
      return null;
    };

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const clickZoomIn = async () => {
      await page.evaluate(() => {
        document.querySelector('.zoom-controls button[title="Zoom in"]').click();
      });
      await wait(300);
    };

    const clickZoomOut = async () => {
      await page.evaluate(() => {
        document.querySelector('.zoom-controls button[title="Zoom out"]').click();
      });
      await wait(300);
    };

    const clickReset = async () => {
      await page.evaluate(() => {
        document.querySelector('.zoom-controls button[title="Reset zoom (double-click)"]').click();
      });
      await wait(300);
    };

    const pan = async (cx, cy, dx, dy) => {
      const before = await getView();
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      for (let i = 1; i <= 10; i++) {
        await page.mouse.move(cx + (dx * i / 10), cy + (dy * i / 10));
        await new Promise(r => setTimeout(r, 16));
      }
      await wait(50);
      await page.mouse.up();
      await wait(400);
      const after = await getView();
      return { before, after };
    };

    let passed = 0, failed = 0;
    const assert = (cond, msg) => { if (cond) { passed++; } else { failed++; console.log('  FAIL: ' + msg); } };

    // Draw shapes
    await clickTool('Rectangle');
    await page.mouse.move(200, 150);
    await page.mouse.down();
    await page.mouse.move(350, 280);
    await page.mouse.up();
    await wait(300);
    await clickTool('Ellipse');
    await page.mouse.move(500, 350);
    await page.mouse.down();
    await page.mouse.move(600, 450);
    await page.mouse.up();
    await wait(500);

    const v0 = await getView();
    console.log('Initial view:', v0 ? `(${v0.x.toFixed(0)},${v0.y.toFixed(0)}) scale=${v0.scale.toFixed(2)}` : 'null');
    assert(v0 !== null, 'Stage readable');

    // === Test 1: Pan → Zoom in → Pan ===
    console.log('\n=== Test 1: Pan → Zoom in → Pan ===');
    {
      await clickTool('Pan');
      assert(await getTool() === 'pan', 'Tool is Pan');

      const r1 = await pan(400, 300, 50, 30);
      assert(r1.before !== null && r1.after !== null, 'Views not null');
      console.log(`  Pan1: (${r1.before.x.toFixed(0)},${r1.before.y.toFixed(0)}) → (${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan 1 moved');

      const beforeZoom = await getView();
      await clickZoomIn();
      const afterZoom = await getView();
      console.log(`  Zoom: scale ${beforeZoom.scale.toFixed(2)} → ${afterZoom.scale.toFixed(2)}`);
      assert(afterZoom.scale > beforeZoom.scale, 'Zoom increased');

      const r2 = await pan(400, 300, 40, 25);
      console.log(`  Pan2: (${r2.before.x.toFixed(0)},${r2.before.y.toFixed(0)}) → (${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after zoom in');
    }

    // === Test 2: Pan → Zoom out → Pan ===
    console.log('\n=== Test 2: Pan → Zoom out → Pan ===');
    {
      await clickReset();
      await clickTool('Pan');

      const r1 = await pan(400, 300, -40, -20);
      console.log(`  Pan1: (${r1.before.x.toFixed(0)},${r1.before.y.toFixed(0)}) → (${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan 1 moved');

      const beforeZoom = await getView();
      await clickZoomOut();
      const afterZoom = await getView();
      console.log(`  Zoom: scale ${beforeZoom.scale.toFixed(2)} → ${afterZoom.scale.toFixed(2)}`);
      assert(afterZoom.scale < beforeZoom.scale, 'Zoom decreased');

      const r2 = await pan(400, 300, -30, -15);
      console.log(`  Pan2: (${r2.before.x.toFixed(0)},${r2.before.y.toFixed(0)}) → (${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after zoom out');
    }

    // === Test 3: Pan → Reset 100% → Pan ===
    console.log('\n=== Test 3: Pan → Reset 100% → Pan ===');
    {
      await clickTool('Pan');

      const r1 = await pan(400, 300, 60, 40);
      console.log(`  Pan1: (${r1.before.x.toFixed(0)},${r1.before.y.toFixed(0)}) → (${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan 1 moved');

      await clickReset();
      const afterReset = await getView();
      console.log(`  Reset: (${afterReset.x.toFixed(0)},${afterReset.y.toFixed(0)}) scale=${afterReset.scale.toFixed(2)}`);
      assert(Math.abs(afterReset.scale - 1) < 0.01, `Reset to 100% (scale=${afterReset.scale.toFixed(2)})`);

      const r2 = await pan(400, 300, 50, 30);
      console.log(`  Pan2: (${r2.before.x.toFixed(0)},${r2.before.y.toFixed(0)}) → (${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after reset');
    }

    // === Test 4: Pan → Zoom-to-fit → Pan ===
    console.log('\n=== Test 4: Pan → Zoom-to-fit → Pan ===');
    {
      await clickTool('Pan');

      const r1 = await pan(400, 300, -30, -20);
      console.log(`  Pan1: (${r1.before.x.toFixed(0)},${r1.before.y.toFixed(0)}) → (${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)})`);

      await clickReset();
      const afterFit = await getView();
      console.log(`  After reset: (${afterFit.x.toFixed(0)},${afterFit.y.toFixed(0)}) scale=${afterFit.scale.toFixed(2)}`);
      assert(Math.abs(afterFit.scale - 1) < 0.01, 'Reset to 100%');

      const r2 = await pan(400, 300, 40, 30);
      console.log(`  Pan2: (${r2.before.x.toFixed(0)},${r2.before.y.toFixed(0)}) → (${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Pan 2 moved after reset');
    }

    // === Test 5: Zoom → Rectangle → Pan → Pan ===
    console.log('\n=== Test 5: Zoom → Rectangle → Pan → Pan ===');
    {
      const beforeZoom = await getView();
      await clickZoomIn();
      await clickZoomIn();
      const afterZoom = await getView();
      console.log(`  Zoom: scale ${beforeZoom.scale.toFixed(2)} → ${afterZoom.scale.toFixed(2)}`);
      assert(afterZoom.scale > beforeZoom.scale, 'Zoomed in');

      await clickTool('Rectangle');
      assert(await getTool() === 'rectangle', 'Tool is Rectangle');
      await wait(100);

      await clickTool('Pan');
      assert(await getTool() === 'pan', 'Tool is Pan');
      await wait(100);

      const r1 = await pan(400, 300, 30, 20);
      console.log(`  Pan1: (${r1.before.x.toFixed(0)},${r1.before.y.toFixed(0)}) → (${r1.after.x.toFixed(0)},${r1.after.y.toFixed(0)}) scale=${r1.after.scale.toFixed(2)}`);
      assert(r1.after.x !== r1.before.x || r1.after.y !== r1.before.y, 'Pan moved after zoom+tool switch');
      assert(Math.abs(r1.after.scale - afterZoom.scale) < 0.01, 'Scale preserved after pan');

      const r2 = await pan(400, 300, -20, -15);
      console.log(`  Pan2: (${r2.before.x.toFixed(0)},${r2.before.y.toFixed(0)}) → (${r2.after.x.toFixed(0)},${r2.after.y.toFixed(0)})`);
      assert(r2.after.x !== r2.before.x || r2.after.y !== r2.before.y, 'Second pan after tool switch');
    }

    // === Final ===
    console.log('\n=== Final ===');
    const fv = await getView();
    console.log(`  Final view: (${fv.x.toFixed(1)},${fv.y.toFixed(1)}) scale=${fv.scale.toFixed(2)}`);

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
