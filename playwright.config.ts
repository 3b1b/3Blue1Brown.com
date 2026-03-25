import { defineConfig, devices } from "@playwright/test";

const port = 31415;
const url = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: "75%",
  reporter: [["html", { open: process.env.CI ? "never" : "on-failure" }]],

  use: {
    baseURL: url,
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    // command: "bun run build && bun run preview",
    command: "bun run dev",
    url,
    reuseExistingServer: true,
  },
});
