import { expect, test } from "@playwright/test";

test("Has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/3Blue1Brown/i);
});
