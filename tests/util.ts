import test from "@playwright/test";

// wait ms
export const sleep = async (ms = 0) =>
  new Promise((resolve) => globalThis.setTimeout(resolve, ms));

// stringify object with indentation
export const stringify = (object: unknown) => JSON.stringify(object, null, 2);

// pass browser console logs to cli logs
export const log = () => {
  // https://docs.github.com/en/actions/reference/workflows-and-actions/variables
  if (process.env.RUNNER_DEBUG)
    test.beforeEach(({ page }) =>
      page.on("console", (msg) => console.info(msg.text())),
    );
};
