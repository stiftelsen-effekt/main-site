import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Percentage Conversion with Cuts", () => {
  beforeEach(() => {
    setupWidgetTest();

    // Intercept the registration API call to verify the data being sent
    cy.intercept("POST", "**/donations/register", {
      statusCode: 200,
      body: {
        KID: "test-kid-123",
        donorID: 12345,
        hasAnsweredReferral: false,
        paymentProviderUrl: "https://test-payment.com",
      },
    }).as("registerDonation");

    // Intercept the bank pending call
    cy.intercept("POST", "**/donations/bank/pending", {
      statusCode: 200,
      body: {},
    }).as("bankPending");
  });

  describe("Single Cause Area with Cut", () => {
    it("Should calculate correct percentages with the default cut for single cause area", () => {
      // Select Global Health directly
      cy.get("[data-cy=cause-area-1]").click();

      // Enter 1000 kr - the cut defaults to enabled, at the configured percentage
      cy.get("[data-cy=donation-sum-input-1]").type("1000");

      // Go to donor pane
      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");

      // Submit
      cy.get("[data-cy^=payment-method-]").first().click();

      // Verify the registration request
      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        // Total should be 1000 (user input)
        expect(body.amount).to.equal(1000);

        // Should have 2 cause areas: Global Health (90%) and Operations (10%)
        expect(body.distributionCauseAreas).to.have.length(2);

        // Global Health: 900/1000 = 90%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(90, 0.01);

        // Operations: 100/1000 = 10%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
      });
    });

    it("Should handle navigation between cause areas with different cut settings", () => {
      // First: Global Health with cut (enabled by default)
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").type("500");

      // Go back and select Animal Welfare, explicitly disabling its cut (also enabled by default)
      cy.get("[data-cy=back-button]").click();
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=donation-sum-input-2]").type("500");
      cy.get("[data-cy=cut-checkbox-2]").uncheck({ force: true });

      // Submit
      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        // Total should be 500 (only Animal Welfare, no cut)
        expect(body.amount).to.equal(500);

        // Should only have Animal Welfare
        expect(body.distributionCauseAreas).to.have.length(1);

        const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
        expect(parseFloat(animalWelfare.percentageShare)).to.equal(100);
      });
    });

    it("Should handle custom organization distribution with cut", () => {
      cy.get("[data-cy=cause-area-1]").click();

      // Check if custom distribution is available
      cy.get("body").then(($body) => {
        if ($body.find('input[type="radio"]').length > 1) {
          // Switch to custom distribution
          cy.get("[data-cy=radio-custom-share-1]").click({ force: true });

          cy.wait(500);
          // Set custom amounts that sum to 1000
          cy.get("[data-cy=org-12]").clear().type("600");
          cy.get("[data-cy=org-15]").clear().type("400");

          // Cut is enabled by default at the configured percentage
          cy.get("[data-cy=cut-checkbox-1]").should("be.checked");

          cy.get("[data-cy=next-button]").click();
          cy.get("[data-cy=name-input]").type("Test Donor");
          cy.get("[data-cy=email-input]").type("test@example.com");
          cy.get("[data-cy^=payment-method-]").first().click();

          cy.wait("@registerDonation").then((interception) => {
            const { body } = interception.request;

            // Log the body for debugging
            cy.log("Request body:", JSON.stringify(body));

            // Total should be 1000
            expect(body.amount).to.equal(1000);

            // Should have 2 cause areas
            expect(body.distributionCauseAreas).to.have.length(2);

            // Global Health with custom distribution
            const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
            expect(globalHealth.standardSplit).to.be.false;
            expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(90, 0.01);

            // Organization shares are percentages *within* their cause area, and the cut
            // scales every organization equally, so the entered 600/400 split is preserved:
            // 540/900 = 60% and 360/900 = 40%.
            const org12 = globalHealth.organizations.find((org) => org.id === 12);
            expect(parseFloat(org12.percentageShare)).to.be.closeTo(60, 0.01);

            const org15 = globalHealth.organizations.find((org) => org.id === 15);
            expect(parseFloat(org15.percentageShare)).to.be.closeTo(40, 0.01);

            // Operations: 10%
            const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
            expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
          });
        }
      });
    });
  });

  describe("Multiple Cause Areas with Global Cut", () => {
    it("Should calculate correct percentages with the default global cut", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      // Set amounts for different cause areas (total 1000) - global cut defaults to enabled
      setCauseAreaAmount(1, 500); // Global Health
      setCauseAreaAmount(2, 300); // Animal Welfare
      setCauseAreaAmount(3, 200); // Climate

      // Submit
      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        // Total should be 1000
        expect(body.amount).to.equal(1000);

        // Should have 4 cause areas (3 selected + operations)
        expect(body.distributionCauseAreas).to.have.length(4);

        // Global Health: 500 - (100 * 500/1000) = 450, 450/1000 = 45%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(45, 0.01);

        // Animal Welfare: 300 - (100 * 300/1000) = 270, 270/1000 = 27%
        const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
        expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(27, 0.01);

        // Climate: 200 - (100 * 200/1000) = 180, 180/1000 = 18%
        const climate = body.distributionCauseAreas.find((ca) => ca.id === 3);
        expect(parseFloat(climate.percentageShare)).to.be.closeTo(18, 0.01);

        // Operations: 100/1000 = 10%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
      });
    });

    it("Should handle mixed standard and custom distribution with global cut", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      // Global Health - standard distribution
      setCauseAreaAmount(1, 400);

      // Animal Welfare - custom distribution if available
      cy.get("body").then(($body) => {
        const radioButtons = $body.find('[data-cy^="cause-area-form-2"] input[type="radio"]');
        if (radioButtons.length > 1) {
          // Find and click custom distribution for Animal Welfare
          cy.get("[data-cy=radio-custom-share-2]").click({ force: true });

          cy.wait(500);
          // Set custom amounts
          cy.get("[data-cy=org-21]").clear().type("400");
          cy.get("[data-cy=org-22]").clear().type("200");

          // Global cut is enabled by default

          cy.get("[data-cy=next-button]").click();
          cy.get("[data-cy=name-input]").type("Test Donor");
          cy.get("[data-cy=email-input]").type("test@example.com");
          cy.get("[data-cy^=payment-method-]").first().click();

          cy.wait("@registerDonation").then((interception) => {
            const { body } = interception.request;

            // Total: 400 + 600 = 1000
            expect(body.amount).to.equal(1000);

            // Global Health (standard): 400 - (100 * 400/1000) = 360, 360/1000 = 36%
            const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
            expect(globalHealth.standardSplit).to.be.true;
            expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(36, 0.01);

            // Animal Welfare (custom): 600 - (100 * 600/1000) = 540, 540/1000 = 54%
            const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
            expect(animalWelfare.standardSplit).to.be.false;
            expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(54, 0.01);

            // Check individual org percentages for Animal Welfare
            // Org 21: 400 * (540/600) / 1000 = 36%
            const org21 = animalWelfare.organizations.find((org) => org.id === 21);
            expect(parseFloat(org21.percentageShare)).to.be.closeTo(36, 0.01);

            // Org 22: 200 * (540/600) / 1000 = 18%
            const org22 = animalWelfare.organizations.find((org) => org.id === 22);
            expect(parseFloat(org22.percentageShare)).to.be.closeTo(18, 0.01);

            // Operations: 10%
            const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
            expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
          });
        }
      });
    });

    it("Should handle toggling global cut on and off", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      setCauseAreaAmount(1, 600);
      setCauseAreaAmount(2, 400);

      // Enable then disable global cut
      cy.get("[data-cy=global-cut-checkbox]").check({ force: true });
      cy.get("[data-cy=global-cut-checkbox]").uncheck({ force: true });

      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        // Total should be 1000 with no cuts
        expect(body.amount).to.equal(1000);

        // Should have only 2 cause areas (no operations)
        expect(body.distributionCauseAreas).to.have.length(2);

        // Global Health: 600/1000 = 60%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(60, 0.01);

        // Animal Welfare: 400/1000 = 40%
        const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
        expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(40, 0.01);

        // No operations
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(operations).to.be.undefined;
      });
    });
  });

  describe("Edge Cases and Complex Scenarios", () => {
    it("Should handle zero amounts correctly", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      setCauseAreaAmount(1, 1000);
      setCauseAreaAmount(2, 0); // Zero amount

      // Global cut is enabled by default

      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        expect(body.amount).to.equal(1000);

        // Should have 2 cause areas (Global Health + Operations)
        expect(body.distributionCauseAreas).to.have.length(2);

        // Global Health: 900/1000 = 90%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(90, 0.01);

        // Operations: 100/1000 = 10%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);

        // Animal Welfare should not be included
        const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
        expect(animalWelfare).to.be.undefined;
      });
    });

    it("Should handle switching between single and multiple modes", () => {
      // Start with single cause area with cut (enabled by default)
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").type("500");

      // Switch to multiple mode
      cy.get("[data-cy=back-button]").click();
      cy.get("[data-cy=cause-area-multiple]").click();

      // Add more cause areas
      setCauseAreaAmount(2, 300);
      setCauseAreaAmount(3, 200);

      // The individual cut should be preserved as part of global cut
      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        expect(body.amount).to.equal(1000);

        // Should have 4 cause areas
        expect(body.distributionCauseAreas).to.have.length(4);

        // Verify all percentages add up to 100
        const totalPercentage = body.distributionCauseAreas.reduce(
          (sum, ca) => sum + parseFloat(ca.percentageShare),
          0,
        );
        expect(totalPercentage).to.be.closeTo(100, 0.01);
      });
    });

    it("Should handle very small amounts with cuts", () => {
      cy.get("[data-cy=cause-area-1]").click();

      // 20 kr - 10% cut (enabled by default) = 2 kr to operations
      cy.get("[data-cy=donation-sum-input-1]").type("20");

      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        expect(body.amount).to.equal(20);

        // Global Health: 18/20 = 90%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(90, 0.01);

        // Operations: 2/20 = 10%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
      });
    });
  });
});
