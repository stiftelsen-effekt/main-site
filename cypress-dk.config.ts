import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "2k8sn9h2",
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    supportFile: "cypress/support/e2e.js",
    baseUrl: "http://localhost:3000",
    fixturesFolder: "cypress/fixtures/dk",
    specPattern: "cypress/e2e/dk/**/*.{js,jsx,ts,tsx}",
  },
  viewportHeight: 850,
  viewportWidth: 1280,
});
