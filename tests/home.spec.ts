import { expect, test } from "@playwright/test";

test("Tab title works", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/^3Blue1Brown$/i);
  await page.goto("/about");
  await expect(page).toHaveTitle(/About/i);
  await expect(page).toHaveTitle(/3Blue1Brown/i);
  await page.goto("/extras");
  await expect(page).toHaveTitle(/Extras/i);
  await expect(page).toHaveTitle(/3Blue1Brown/i);
});

test("Topic buttons work", async ({ page }) => {
  await page.goto("/");
  await page.click('a:has-text("geometry")');
  await expect(
    page.locator('a:has-text("why slicing a cone gives an ellipse")'),
  ).toBeVisible();
  await expect(
    page.locator('a:has-text("read")[href*="sphere-area" i]'),
  ).toBeVisible();
  await page.click('a[aria-label*="back to" i]');
  await page.locator("a:has-text('physics')").click();
  await expect(page.locator('a:has-text("brachistochrone")')).toBeVisible();
});

test("Search works", async ({ page }) => {
  await page.goto("/");
  await page.click('button[aria-label*="lesson search" i]');
  await page.fill('input[placeholder*="search" i]', "euclid");
  await expect(
    page.locator('a:has-text("what was euclid really doing")').first(),
  ).toBeVisible();
  // fuzzy search
  await page.fill('input[placeholder*="search" i]', "harry ball");
  await expect(page.locator('a:has-text("hairy ball")').first()).toBeVisible();
});

test("Feedback form works", async ({ page }) => {
  await page.goto("/");
  await page.click('button[aria-label*="feedback" i]');
  await page.locator('label:has-text("subject") input').fill("test subject");
  await page.reload();
  await page.click('button[aria-label*="feedback" i]', { force: true });
  await expect(page.locator('label:has-text("subject") input')).toHaveValue(
    "test subject",
  );
  await page
    .locator('label:has-text("message") textarea')
    .fill("test feedback");
  await page.locator('*:has-text("submitted feedback")');
});

test("Lesson nav works", async ({ page }) => {
  await page.goto("?topic=linear-algebra&lesson=quick-eigen");
  await expect(page.locator("a:has-text('next')")).toHaveAttribute(
    "href",
    /lesson=abstract-vector-spaces/,
  );
  await expect(page.locator("a:has-text('prev')")).toHaveAttribute(
    "href",
    /lesson=eigenvalues/,
  );
});
