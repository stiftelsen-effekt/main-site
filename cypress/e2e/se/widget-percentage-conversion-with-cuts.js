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
    it("Should calculate correct percentages with 5% cut for single cause area", () => {
      // Select Global Health directly
      cy.get("[data-cy=cause-area-1]").click();

      // Enter 1000 kr
      cy.get("[data-cy=donation-sum-input-1]").type("1000");

      // Enable 5% cut
      cy.get("[data-cy=cut-checkbox-1]").click();

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

        // Should have 2 cause areas: Global Health (95%) and Operations (5%)
        expect(body.distributionCauseAreas).to.have.length(2);

        // Global Health: 950/1000 = 95%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(95, 0.01);

        // Operations: 50/1000 = 5%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(5, 0.01);
      });
    });

    it("Should handle navigation between cause areas with different cut settings", () => {
      // First: Global Health with cut
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").type("500");
      cy.get("[data-cy=cut-checkbox-1]").click();

      // Go back and select Animal Welfare without cut
      cy.get("[data-cy=back-button]").click();
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=donation-sum-input-2]").type("500");
      // Don't enable cut

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
          cy.contains("Velj organisasjoner selv").click();

          cy.wait(500);
          // Set custom amounts that sum to 1000
          cy.get("[data-cy=org-12]").clear().type("600");
          cy.get("[data-cy=org-15]").clear().type("400");

          // Enable 5% cut
          cy.get("[data-cy=cut-checkbox-1]").check();
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
            expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(95, 0.01);

            // Organizations should have proportional cuts
            // Org 12: 600 * 0.95 = 570, 570/1000 = 57%
            const org12 = globalHealth.organizations.find((org) => org.id === 12);
            expect(parseFloat(org12.percentageShare)).to.be.closeTo(57, 0.01);

            // Org 15: 400 * 0.95 = 380, 380/1000 = 38%
            const org15 = globalHealth.organizations.find((org) => org.id === 15);
            expect(parseFloat(org15.percentageShare)).to.be.closeTo(38, 0.01);

            // Operations: 5%
            const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
            expect(parseFloat(operations.percentageShare)).to.be.closeTo(5, 0.01);
          });
        }
      });
    });
  });

  describe("Multiple Cause Areas with Global Cut", () => {
    it("Should calculate correct percentages with global 5% cut", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      // Set amounts for different cause areas (total 1000)
      setCauseAreaAmount(1, 500); // Global Health
      setCauseAreaAmount(2, 300); // Animal Welfare
      setCauseAreaAmount(3, 200); // Climate

      // Enable global cut
      cy.get("[data-cy=global-cut-checkbox]").check();

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

        // Global Health: 500 - (50 * 500/1000) = 475, 475/1000 = 47.5%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(47.5, 0.01);

        // Animal Welfare: 300 - (50 * 300/1000) = 285, 285/1000 = 28.5%
        const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
        expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(28.5, 0.01);

        // Climate: 200 - (50 * 200/1000) = 190, 190/1000 = 19%
        const climate = body.distributionCauseAreas.find((ca) => ca.id === 3);
        expect(parseFloat(climate.percentageShare)).to.be.closeTo(19, 0.01);

        // Operations: 50/1000 = 5%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(5, 0.01);
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
          cy.get('[data-cy^="cause-area-form-2"]').within(() => {
            cy.contains("Velj organisasjoner selv").click();
          });

          cy.wait(500);
          // Set custom amounts
          cy.get("[data-cy=org-21]").clear().type("400");
          cy.get("[data-cy=org-22]").clear().type("200");

          // Enable global cut
          cy.get("[data-cy=global-cut-toggle]").click();

          cy.get("[data-cy=next-button]").click();
          cy.get("[data-cy=name-input]").type("Test Donor");
          cy.get("[data-cy=email-input]").type("test@example.com");
          cy.get("[data-cy^=payment-method-]").first().click();

          cy.wait("@registerDonation").then((interception) => {
            const { body } = interception.request;

            // Total: 400 + 600 = 1000
            expect(body.amount).to.equal(1000);

            // Global Health (standard): 400 - (50 * 400/1000) = 380, 380/1000 = 38%
            const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
            expect(globalHealth.standardSplit).to.be.true;
            expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(38, 0.01);

            // Animal Welfare (custom): 600 - (50 * 600/1000) = 570, 570/1000 = 57%
            const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
            expect(animalWelfare.standardSplit).to.be.false;
            expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(57, 0.01);

            // Check individual org percentages for Animal Welfare
            // Org 21: 400 * (570/600) / 1000 = 38%
            const org21 = animalWelfare.organizations.find((org) => org.id === 21);
            expect(parseFloat(org21.percentageShare)).to.be.closeTo(38, 0.01);

            // Org 22: 200 * (570/600) / 1000 = 19%
            const org22 = animalWelfare.organizations.find((org) => org.id === 22);
            expect(parseFloat(org22.percentageShare)).to.be.closeTo(19, 0.01);

            // Operations: 5%
            const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
            expect(parseFloat(operations.percentageShare)).to.be.closeTo(5, 0.01);
          });
        }
      });
    });

    it("Should handle toggling global cut on and off", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      setCauseAreaAmount(1, 600);
      setCauseAreaAmount(2, 400);

      // Enable then disable global cut
      cy.get("[data-cy=global-cut-checkbox]").check();
      cy.get("[data-cy=global-cut-checkbox]").uncheck();

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

      cy.get("[data-cy=global-cut-toggle]").click();

      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        expect(body.amount).to.equal(1000);

        // Should have 2 cause areas (Global Health + Operations)
        expect(body.distributionCauseAreas).to.have.length(2);

        // Global Health: 950/1000 = 95%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(95, 0.01);

        // Operations: 50/1000 = 5%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(5, 0.01);

        // Animal Welfare should not be included
        const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
        expect(animalWelfare).to.be.undefined;
      });
    });

    it("Should handle switching between single and multiple modes", () => {
      // Start with single cause area with cut
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").type("500");
      cy.get("[data-cy=cut-checkbox-1]").click();

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

      // 20 kr - 5% cut = 1 kr to operations
      cy.get("[data-cy=donation-sum-input-1]").type("20");
      cy.get("[data-cy=cut-checkbox-1]").click();

      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=name-input]").type("Test Donor");
      cy.get("[data-cy=email-input]").type("test@example.com");
      cy.get("[data-cy^=payment-method-]").first().click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;

        expect(body.amount).to.equal(20);

        // Global Health: 19/20 = 95%
        const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(95, 0.01);

        // Operations: 1/20 = 5%
        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(5, 0.01);
      });
    });
  });
});
