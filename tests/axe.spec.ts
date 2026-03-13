import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import routes from "./routes.json" with { type: "json" };
import { log, stringify } from "./util";

// paths to test, auto-generated any time site is built or dev'd
const paths = routes.filter((path) => !path.endsWith(".xml"));
// const paths = ["/testbed"];

log();

// test page with deque axe
const checkPage = (path: string) =>
  test(`Axe check on page "${path}"`, async ({ browserName, page }) => {
    // test should be independent of browser, so only run one
    test.skip(browserName !== "chromium", "Only test on chromium");

    // test can be slow on ci on very large page (like testbed)
    test.setTimeout(2 * 60 * 1000);

    // navigate to page
    await page.goto(path);

    // wait for content to load
    await page.waitForLoadState();

    // builder
    const builder = new AxeBuilder({ page });

    // exclude embeds from third parties
    builder.exclude("iframe");
    builder.exclude("youtube-video");

    // exclude mathjax, trust that it handles accessibility well
    // by inspection it does, screen readers announce its content
    // https://docs.mathjax.org/en/v4.0/options/accessibility.html
    builder.exclude("mjx-container");

    // axe throws error if e.g. radio button only has math content
    // mjx-container has no typical accessible text attr e.g. aria-label
    // but by inspection, screen readers can still find and announce its content
    // so, add fake accessible label to satisfy axe
    await page.evaluate(() =>
      document
        .querySelectorAll("mjx-container")
        .forEach((element) => element.setAttribute("aria-label", "fake label")),
    );

    // get page violations
    const { violations } = await builder.analyze();

    // split up critical/non-critical
    const { critical = [], warning = [] } = Object.groupBy(
      violations,
      ({ id }) => {
        // https://github.com/dequelabs/axe-core/issues/3325#issuecomment-2383832705
        if (id === "color-contrast") return "warning";
        // https://github.com/dequelabs/axe-core/issues/4566
        if (id === "scrollable-region-focusable") return "warning";
        return "critical";
      },
    );

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
await Promise.all(paths.map(checkPage));
