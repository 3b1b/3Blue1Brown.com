import { expect, test } from "@playwright/test";
import routes from "./routes";
import { log, stringify } from "./util";

log();

// test page load size and times
const checkPage = (route: string) =>
  test(`Size check on page "${route}"`, async ({ browserName, page }) => {
    // test should be independent of browser, so only run one
    test.skip(browserName !== "chromium", "Only test on chromium");

    // test can be slow on ci on very large page
    test.setTimeout(60 * 1000);

    const resources: Record<string, number> = {};
    const responses: Promise<void>[] = [];

    // collect all responses on page
    page.on("response", (response) => {
      const task = (async () => {
        try {
          // collect response size
          resources[response.url()] = (await response.body()).byteLength;
        } catch {}
      })();
      responses.push(task);
    });

    // navigate to page
    await page.goto(route);

    // wait for all responses to finish
    await Promise.allSettled(responses);

    // large resources
    const largeResources = Object.entries(resources).filter(
      ([url, size]) =>
        // flag resources > few MB
        size >= 3 * 1000 * 1000 &&
        // ignore certain requests
        ![/youtube\.com/, /mathjax/, /phosphor-icons/].some((some) =>
          some.test(url),
        ),
    );

    test.info().annotations.push({
      type: "Large resources",
      description: stringify(largeResources),
    });

    expect(largeResources.length).toBe(0);
  });

// check all pages
await Promise.all(routes.map(checkPage));
