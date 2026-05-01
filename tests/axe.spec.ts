import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { groupBy } from "lodash-es";
import routes from "./routes";
import { log, stringify } from "./util";

log();

// test page with deque axe
const checkPage = (route: string) =>
  test(`Axe check on page "${route}"`, async ({ browserName, page }) => {
    // test should be independent of browser, so only run one
    test.skip(browserName !== "chromium", "Only test on chromium");

    // disable mathjax entirely just for this test
    // trust that it handles accessibility well
    // by inspection it does, screen readers announce its content
    // https://docs.mathjax.org/en/v4.0/options/accessibility.html
    await page.route(
      (url) => !!url.href.match(/jsdelivr.*mathjax.*\.js/),
      (route) => route.abort(),
    );

    // navigate to page
    await page.goto(route, { waitUntil: "domcontentloaded" });

    // wait for some content to appear
    await expect(page.locator("footer")).toBeVisible();

    // builder
    const builder = new AxeBuilder({ page });

    // exclude embeds from third parties
    builder.exclude("iframe");
    builder.exclude("youtube-video");

    // get page violations
    const { violations } = await test.step("analyze", () => builder.analyze(), {
      timeout: 30 * 1000,
    });

    // split up critical/non-critical
    const { critical = [], warning = [] } = groupBy(violations, ({ id }) => {
      // https://github.com/dequelabs/axe-core/issues/3325#issuecomment-2383832705
      if (id === "color-contrast") return "warning";
      // https://github.com/dequelabs/axe-core/issues/4566
      if (id === "scrollable-region-focusable") return "warning";
      return "critical";
    });

    test.info().annotations.push({
      type: "Axe violations",
      description: stringify(critical),
    });

    test.info().annotations.push({
      type: "Axe warnings",
      description: stringify(warning),
    });

    // fail test on critical
    expect(critical?.length).toBe(0);
  });

// check all pages
routes.map(checkPage);
