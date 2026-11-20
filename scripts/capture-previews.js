import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = '/Users/wong/.gemini/antigravity/brain/e3c28cf3-0f97-441d-ad49-068709009a44';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1200,920'],
    defaultViewport: { width: 1200, height: 920 },
  });

  try {
    const page = await browser.newPage();

    // 1. Captured Revealed State on Puzzle 0 with Why? drawer expanded
    await page.goto('http://localhost:5173/?puzzle=0', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const sub = {
        puzzleId: 'mcat-bio-01-enzyme-kinetics',
        value: 8.0,
        submittedAt: Date.now(),
        verdict: 'Spot on.',
        whyExpanded: true,
      };
      localStorage.setItem('fp_bio_submissions_v1', JSON.stringify({
        'mcat-bio-01-enzyme-kinetics': sub
      }));
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'preview-revealed.png') });
    console.log('Saved preview-revealed.png');

    // 2. Nephron Osmolarity (Puzzle 1)
    await page.goto('http://localhost:5173/?puzzle=1', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'preview-nephron.png') });
    console.log('Saved preview-nephron.png');

    // 3. Neurobiology Membrane Potential (Puzzle 3)
    await page.goto('http://localhost:5173/?puzzle=3', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'preview-neuro.png') });
    console.log('Saved preview-neuro.png');

    // 4. Archive Drawer Open
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Puzzle'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'preview-archive.png') });
    console.log('Saved preview-archive.png');

    console.log('All screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
