import { defineConfig, devices } from "@playwright/test";

const port = 31415;
const url = `http://localhost:${port}`;
const { CI } = process.env;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [
    ["json", { outputFile: "playwright-report/json/results.json" }],
    [
      "html",
      {
        outputFolder: "playwright-report/html",
        open: CI ? "never" : "on-failure",
      },
    ],
  ],

  use: {
    baseURL: url,
    // headless: !!process.env.CI,
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "Chrome",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--disable-background-timer-throttling",
            "--disable-renderer-backgrounding",
            "--disable-backgrounding-occluded-windows",
          ],
        },
      },
    },
    // {
    //   name: "Firefox",
    //   use: { ...devices["Desktop Firefox"] },
    //   grep: /@firefox/,
    // },
    {
      name: "Safari",
      use: { ...devices["Desktop Safari"] },
      grep: /@safari/,
    },
  ],

  webServer: {
    command: "bun run build && bun run preview",
    // command: "bun run preview",
    // command: "bun run dev",
    url,
  },
});
