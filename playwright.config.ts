import { defineConfig, devices } from "@playwright/test";

const port = 31415;
const url = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // workers: 1,
  reporter: [["html", { open: process.env.CI ? "never" : "on-failure" }]],

  use: {
    baseURL: url,
    // headless: !!process.env.CI,
    trace: "on",
  },

  projects: [
    {
      name: "chromium",
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
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    command: "bun run build && bun run preview",
    // command: "bun run preview",
    // command: "bun run dev",
    url,
  },
});
