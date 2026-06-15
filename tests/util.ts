import type { Page } from "@playwright/test";
import test from "@playwright/test";

// wait ms
export const sleep = async (ms = 0) =>
  new Promise((resolve) => globalThis.setTimeout(resolve, ms));

// stringify object with indentation
export const stringify = (object: unknown) => JSON.stringify(object, null, 2);

// pass browser console logs to cli logs
export const log = () => {
  if (process.env.DEBUG)
    test.beforeEach(({ page }) =>
      page.on("console", (msg) => console.info(msg.text())),
    );
};

// wait for mathjax to finish first load
export const waitForMath = (page: Page) =>
  test.expect
    // poll on node-side to avoid browser-side timer/raf throttling w/ waitForFunction
    .poll(async () => page.evaluate(() => window.MathJaxState === true), {
      timeout: 30 * 1000,
    })
    .toBe(true);

// wait for images to fully load
export const waitForImages = (page: Page) =>
  test.expect
    // poll on node-side to avoid browser-side timer/raf throttling w/ waitForFunction
    .poll(
      async () =>
        page.evaluate(() =>
          Array.from(document.querySelectorAll("img")).every(
            (img) => img.complete,
          ),
        ),
      { timeout: 30 * 1000 },
    )
    .toBe(true);
