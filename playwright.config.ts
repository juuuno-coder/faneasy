import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  use: {
    actionTimeout: 0,
    baseURL: process.env.PW_BASE_URL || "http://localhost:3500",
    trace: "on-first-retry",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
