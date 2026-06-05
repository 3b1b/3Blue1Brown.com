import { expect, test } from "@playwright/test";
import { pickBy, size } from "lodash-es";
import routes from "./routes";
import { log, stringify } from "./util";

log();

const ignore = [
  /youtube\.com/,
  /mathjax/,
  /phosphor-icons/,
  /google-analytics/,
];

// test page resources
const checkPage = (route: string) =>
  test(`Resource check on page "${route}"`, async ({ browserName, page }) => {
    // test should be independent of browser, so only run one
    test.skip(browserName !== "chromium", "Only test on chromium");

    // test can be slow on ci on very large page
    test.setTimeout(60 * 1000);

    type Details = Partial<{
      size: number;
      status: number;
      statusText: string;
      ok: boolean;
      resourceType: string;
      errorText: string;
    }>;

    // track all resource details
    const resources: Record<string, Details[]> = {};

    // collect all failed responses on page
    page.on("requestfailed", (request) => {
      const url = request.url();

      // ignore certain requests
      if (ignore.some((some) => some.test(url))) return;

      resources[url] ??= [];

      // collect details
      resources[url].push({
        errorText: request.failure()?.errorText ?? "",
        resourceType: request.resourceType() ?? "",
      });
    });

    // collect all responses on page
    const responses: Promise<void>[] = [];
    page.on("response", (response) => {
      const url = response.url();

      // ignore certain requests
      if (ignore.some((some) => some.test(url))) return;

      const promise = (async () => {
        resources[url] ??= [];

        // collect details
        const resource = {
          size: 0,
          ok: response.ok(),
          status: response.status(),
          statusText: response.statusText(),
          resourceType: response.request().resourceType(),
          errorText: "",
        };

        // get response body
        const body = await response.body().catch(() => undefined);
        if (body) resource.size = body.byteLength ?? 0;
        else resource.errorText = "Failed to get response body";

        resources[url].push(resource);
      })();

      responses.push(promise);
    });

    // navigate to page
    await page.goto(route);

    // wait a bit extra
    await page.waitForLoadState("networkidle");

    // wait for all responses to finish
    await Promise.allSettled(responses);

    // large resources
    const largeResources = pickBy(resources, (resource) =>
      resource.some((response) => (response.size ?? 0) >= 3 * 1000 * 1000),
    );

    // broken resources
    const brokenResources = pickBy(resources, (resource) =>
      resource.every((response) => !response.ok),
    );

    test.info().annotations.push({
      type: "Large resources",
      description: stringify(largeResources),
    });

    test.info().annotations.push({
      type: "Broken resources",
      description: stringify(brokenResources),
    });

    test.info().annotations.push({
      type: "Checked resources",
      description: stringify(resources),
    });

    expect(size(largeResources)).toBe(0);
    expect(size(brokenResources)).toBe(0);
  });

// check all pages
routes.map(checkPage);
