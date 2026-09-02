import { expect, test } from "@playwright/test";
import routes from "./routes";
import { log, stringify } from "./util";

log();

// viewport sizes to test for layout quirks
const sizes = [
  { width: 3000, height: 1000 },
  { width: 300, height: 1000 },
];

// test that assets aren't stretched
const checkPage = (route: string) =>
  test(`Image check on page "${route}" @safari`, async ({ page }) => {
    // test can be slow on very large page
    test.setTimeout(60 * 1000);

    // navigate to page
    await page.goto(route);

    type Asset = HTMLImageElement | HTMLVideoElement;

    // get assets to test
    const assets = page.locator(
      "img, video:not(youtube-video video, vimeo-video video)",
    );

    // remove any lazy loading
    assets.evaluateAll((elements) => {
      for (const element of elements) {
        // remove if not visible, e.g. tab panel
        if (!element.checkVisibility()) element.remove();
        // remove lazy loading attribute
        element.removeAttribute("loading");
      }
    });

    // wait for assets to load
    await expect
      .poll(
        () =>
          assets.evaluateAll<boolean, Asset>((elements) =>
            elements.every((element) =>
              "complete" in element ? element.complete : element.readyState > 0,
            ),
          ),
        { intervals: [100], timeout: 10 * 1000 },
      )
      .toBe(true);

    // collect distorted assets
    const distortedAssets: string[] = [];

    // check each viewport size
    for (const size of sizes) {
      await page.setViewportSize(size);

      const distorted = await assets.evaluateAll<string[], Asset>((elements) =>
        elements.flatMap((asset) => {
          // natural/intrinsic size
          const naturalWidth =
            "naturalWidth" in asset ? asset.naturalWidth : asset.videoWidth;
          const naturalHeight =
            "naturalHeight" in asset ? asset.naturalHeight : asset.videoHeight;
          // rendered size
          const { width, height } = asset.getBoundingClientRect();

          // ignore if missing dimension
          if (!naturalWidth || !naturalHeight) return [];
          if (!width || !height) return [];

          // ignore if intentionally stretched/cropped/etc
          const style = window.getComputedStyle(asset);
          if (style.objectFit !== "") return [];

          // if aspect ratio is off by more than a few %
          if (Math.abs(naturalWidth / naturalHeight - width / height) > 0.05)
            return asset.currentSrc;

          return [];
        }),
      );

      distortedAssets.push(...distorted);
    }

    test.info().annotations.push({
      type: "Distorted assets",
      description: stringify(distortedAssets),
    });

    expect(distortedAssets.length).toEqual(0);
  });

// check all pages
routes.map(checkPage);
