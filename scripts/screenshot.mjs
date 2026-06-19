// Captures screenshots of the running app in light and dark themes for the
// README and for a quick visual sanity check. Run with the dev server up:
//   npm run dev   (in one shell)
//   node scripts/screenshot.mjs
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL = process.env.URL || 'http://localhost:5173/';
const OUT = 'docs';

async function settle(page) {
  await page.waitForSelector('[data-testid="advice-text"]');
  await page.waitForTimeout(500); // let the card-in animation finish
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

// Desktop, light
const desktop = await browser.newPage({
  viewport: { width: 1200, height: 900 },
  colorScheme: 'light',
  deviceScaleFactor: 2,
});
await desktop.goto(URL, { waitUntil: 'networkidle' });
await settle(desktop);
await desktop.screenshot({ path: `${OUT}/light.png` });

// Desktop, dark (toggle via the theme button)
await desktop.click('button[aria-label*="dark theme"]');
await desktop.waitForTimeout(400);
await desktop.screenshot({ path: `${OUT}/dark.png` });

// Mobile, light
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  colorScheme: 'light',
  deviceScaleFactor: 2,
});
await mobile.goto(URL, { waitUntil: 'networkidle' });
await settle(mobile);
await mobile.screenshot({ path: `${OUT}/mobile.png` });

await browser.close();
console.log('Saved screenshots to', OUT);
