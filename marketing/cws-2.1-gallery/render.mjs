import { chromium } from '/Users/spetreikis/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(sourceDirectory, '../..');
const outputDirectory = path.resolve(projectDirectory, 'marketing/output/chrome-web-store-2.1');
const pageUrl = new URL(`file://${path.resolve(sourceDirectory, 'index.html')}`);
const filenames = [
  '01-live-preview.png',
  '02-search-150-tabs.png',
  '03-keyboard-navigation.png',
  '04-all-windows.png',
  '05-tab-chaos-score.png',
];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  for (let index = 0; index < filenames.length; index += 1) {
    pageUrl.searchParams.set('shot', String(index + 1));
    await page.goto(pageUrl.href, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.ready === 'true');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.resolve(outputDirectory, filenames[index]),
      type: 'png',
      clip: { x: 0, y: 0, width: 1280, height: 800 },
    });
  }
} finally {
  await browser.close();
}
