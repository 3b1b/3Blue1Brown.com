import { expect, test } from "@playwright/test";
import routes from "./routes";
import { log, stringify, waitForMath } from "./util";

log();

// test page for mathjax errors
const checkPage = (route: string) =>
  test(`MathJax check on page "${route}"`, async ({ browserName, page }) => {
    // test should be independent of browser, so only run one
    test.skip(browserName !== "chromium", "Only test on chromium");

    // test can be slow on ci on very large page (like testbed)
    test.setTimeout(60 * 1000);

    const errors: unknown[] = [];

    // listen for uncaught errors
    page.on("pageerror", (error) => {
      if (error.name === "MathJaxError") errors.push(error);
    });

    // navigate to page
    await page.goto(route, { waitUntil: "domcontentloaded" });

    // wait for math to render
    await waitForMath(page);

    test.info().annotations.push({
      type: "MathJax errors",
      description: stringify(errors),
    });

    // check for MathJax errors
    expect(errors.length).toBe(0);
  });

// check all pages
routes.map(checkPage);
