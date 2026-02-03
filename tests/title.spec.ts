import { expect, test } from "@playwright/test";

test("Has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/title/i);
});
