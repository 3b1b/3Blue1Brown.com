import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1400, height: 1000 },
});
const page = await context.newPage();

await page.goto("http://localhost:31415/talent", { waitUntil: "networkidle" });

const names = [
  "Jane Street",
  "0xPARC",
  "Doppel",
  "MatX",
  "Luminal AI",
  "Oklo",
  "Exa",
];
for (const name of names) {
  const count = await page.locator(`img[alt="${name}"]`).count();
  console.log(name, "=>", count);
}

const luminalTile = page.locator('img[alt="Luminal AI"]');
await luminalTile.scrollIntoViewIfNeeded();
await page.screenshot({ path: ".tmp-luminal-tile.png" });

await browser.close();
