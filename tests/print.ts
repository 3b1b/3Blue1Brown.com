import { exec } from "child_process";
import playwright from "playwright";
import { sleep } from "~/util/misc";
import routes from "./routes";

// us letter size, in css units
const width = 8.5 * 96;
const height = 11 * 96;
const margin = 0.5 * 96;

// regex pattern for where app is run in dev mode
const host = "http://localhost:31415";

// run app
const dev = exec(
  `bun run dev`,
  // suppress console prints
  () => null,
);

// wait for app to be ready
await sleep(5000);

// set up browser instance, page, etc
export const browser = await playwright.chromium.launch({ headless: false });
export const context = await browser.newContext();

// number of currently running promises
let running = 0;

// max number of concurrent promises to avoid overwhelming browser
const concurrency = 10;

await Promise.all(
  routes.map(async (route: (typeof routes)[number]) => {
    try {
      // wait until # of running promises is less than limit
      while (running >= concurrency) await sleep(100);

      // increment running promises
      running++;

      // create new tab
      const page = await context.newPage();

      // go to route
      await page.goto(host + route);

      // wait for app to render
      await page.emulateMedia({ media: "print" });
      await page.waitForSelector("main");

      // force page resize event for e.g. auto-resizing elements
      await page.setViewportSize({ width, height });

      // wait for rendering, layout shifts, animations, etc. to finish
      await page.waitForTimeout(2000);

      // print pdf
      await page.pdf({
        path: `print/${route}.pdf`,
        format: "letter",
        width,
        height,
        margin: { top: margin, bottom: margin, left: margin, right: margin },
      });

      return true;
    } finally {
      // decrement running promises
      running--;
    }
  }),
);

// close app
dev.kill();
