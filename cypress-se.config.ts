import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "wfkg9n",
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    supportFile: "cypress/support/e2e.js",
    baseUrl: "http://localhost:3000",
    fixturesFolder: "cypress/fixtures/se",
    specPattern: "cypress/e2e/se/**/*.{js,jsx,ts,tsx}",
  },
  viewportHeight: 850,
  viewportWidth: 1280,
});
