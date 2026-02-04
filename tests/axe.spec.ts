import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { log, stringify } from "./util";

// paths to test
const paths = ["/", "/testbed"];

log();

// test page with deque axe
const checkPage = (path: string) =>
  test(`Axe check on page "${path}"`, async ({ browserName, page }) => {
    // axe tests should be independent of browser, so only run one
    test.skip(browserName !== "chromium", "Only test Axe on chromium");

    // test can be slow on ci on very large page
    test.setTimeout(2 * 60 * 1000);

    // navigate to page
    await page.goto(path);

    // wait for content to load
    await page.waitForSelector("footer");

    // axe check
    const check = async () => {
      // get page violations
      const { violations } = await new AxeBuilder({ page }).analyze();

      // split up critical/non-critical
      const { critical = [] } = Object.groupBy(violations, ({ id }) => {
        // https://github.com/dequelabs/axe-core/issues/3325#issuecomment-2383832705
        if (id === "color-contrast") return "warning";
        else return "critical";
      });

      // annotate test with all
      test.info().annotations.push({
        type: "Axe violations",
        description: stringify(violations),
      });

      // fail test on critical
      expect(critical?.length).toBe(0);
    };

    // check page
    await check();
    // turn on dark mode
    await page.getByLabel(/dark mode/i).click();
    // check page again
    await check();
  });

// check all pages
await Promise.all(paths.map(checkPage));
