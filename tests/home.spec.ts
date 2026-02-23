import { expect, test } from "@playwright/test";

test("Has title", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveTitle(/3Blue1Brown/i);
  await expect(page).toHaveTitle(/About/i);
});
