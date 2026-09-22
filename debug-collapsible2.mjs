import { chromium } from 'playwright';
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

// throttle network to simulate slow image load, and disable cache
const client = await context.newCDPSession(page);
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 400,
  downloadThroughput: 200 * 1024 / 8, // 200kbps
  uploadThroughput: 100 * 1024 / 8,
});

await page.goto('http://localhost:31415/talent/exa', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(1000);

const trigger = page.getByText("The librarian's scroll");
await trigger.scrollIntoViewIfNeeded();
await trigger.click();

// immediately measure panel height right after click (before image likely loaded)
await page.waitForTimeout(200);
const heightRightAfterClick = await page.locator('img[src*="scroll"]').evaluate(el => {
  const panel = el.closest('div[style]');
  return panel ? getComputedStyle(panel).maxHeight : 'not found';
});
console.log('maxHeight 200ms after click (image likely still loading):', heightRightAfterClick);

await page.waitForTimeout(3000);
const heightAfterLoad = await page.locator('img[src*="scroll"]').evaluate(el => {
  const panel = el.closest('div[style]');
  return panel ? getComputedStyle(panel).maxHeight : 'not found';
});
console.log('maxHeight 3s after click (image should be loaded):', heightAfterLoad);

const imgVisible = await page.locator('img[src*="scroll"]').isIntersectingViewport().catch(()=> 'n/a');
await page.screenshot({ path: '/tmp/collapsible-slow-network.png' });
await browser.close();
