import { expect, test } from "@playwright/test";
import routes from "./routes";
import { log, stringify } from "./util";

log();

// wide viewport, where safari's flex layout quirks show up
const width = 2200;
const height = 1000;

// leeway for rounding and for svgs with no intrinsic size
const tolerance = 0.03;

// test that images aren't squished/stretched
const checkPage = (route: string) =>
  test(`Image check on page "${route}"`, async ({ page }) => {
    // test can be slow on very large page
    test.setTimeout(60 * 1000);

    await page.setViewportSize({ width, height });

    await page.goto(route);

    // scroll through page so lazy-loaded images load
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.waitForLoadState("networkidle");

    const distorted = await page.evaluate(
      (tolerance) =>
        Array.from(document.querySelectorAll("img"))
          .map((image) => {
            const { width, height } = image.getBoundingClientRect();
            const style = window.getComputedStyle(image);

            // skip images that legitimately don't match their natural ratio:
            // unloaded/unrendered, cropped/letterboxed, or padded
            if (!image.naturalWidth || !image.naturalHeight) return null;
            if (!width || !height) return null;
            if (style.objectFit !== "fill") return null;
            if (style.padding !== "0px") return null;

            const natural = image.naturalWidth / image.naturalHeight;
            const rendered = width / height;

            return {
              src: image.currentSrc,
              natural,
              rendered,
              off: Math.abs(rendered - natural) / natural,
            };
          })
          .filter((image) => !!image && image.off > tolerance),
      tolerance,
    );

    test.info().annotations.push({
      type: "Distorted images",
      description: stringify(distorted),
    });

    expect(distorted).toEqual([]);
  });

// check all pages
routes.map(checkPage);
