import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["**/*.spec.ts"],
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:13000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: [
    {
      command:
        "../api/mvnw -f ../api/pom.xml spring-boot:run -Dspring-boot.run.useTestClasspath=true -Dspring-boot.run.arguments=--spring.config.additional-location=file:../tests/application-e2e.properties",
      url: "http://127.0.0.1:18081/posts/liked",
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command:
        "NEXT_PUBLIC_BASE_URL=http://127.0.0.1:18081 npm --prefix ../client run dev -- -p 13000",
      url: "http://127.0.0.1:13000",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
