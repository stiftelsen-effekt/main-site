import { defineConfig } from "cypress";
import cypressFailFast from "cypress-fail-fast/plugin";

export default defineConfig({
  projectId: "wfkg9n",
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      cypressFailFast(on, config);
    },
    supportFile: "cypress/support/e2e.js",
    baseUrl: "http://localhost:3000",
    fixturesFolder: "cypress/fixtures/se",
    specPattern: "cypress/e2e/se/**/*.{js,jsx,ts,tsx}",
    env: {
      FAIL_FAST_ENABLED: true,
      FAIL_FAST_STRATEGY: "run",
    },
  },
  viewportHeight: 850,
  viewportWidth: 1280,
  screenshotOnRunFailure: false,
  video: false,
  reporter: "json",
  reporterOptions: {
    toConsole: true,
  },
});
