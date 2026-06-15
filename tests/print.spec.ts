import test from "@playwright/test";
import routes from "./routes";
import { waitForMath } from "./util";

// not actually a "test", but run as one to produce printed pdfs as a side effect
// more convenient than writing standalone script b/c we can use existing test infra

// us letter size, in css units
const width = 8.5 * 96;
const height = 11 * 96;
const margin = 0.5 * 96;

const printPage = (route: string) =>
  test(`Print page "${route}"`, async ({ browserName, page }) => {
    // test should be independent of browser, so only run one
    test.skip(browserName !== "chromium", "Only test on chromium");

    // test can be slow
    test.setTimeout(60 * 1000);

    // navigate to page
    await page.goto(route);

    // wait for app to render
    await page.emulateMedia({ media: "print" });

    // force page resize event for e.g. auto-resizing elements
    await page.setViewportSize({ width, height });

    // wait for math to render
    await waitForMath(page);

    // wait a bit extra for page to settle
    await page.waitForTimeout(10000);

    // print pdf
    await page.pdf({
      path: `print/${route}.pdf`,
      format: "letter",
      width,
      height,
      margin: { top: margin, bottom: margin, left: margin, right: margin },
    });
  });

// print all pages
routes.map(printPage);
