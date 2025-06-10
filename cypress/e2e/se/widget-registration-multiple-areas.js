import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Multiple Cause Areas Registration", () => {
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
        swishOrderID: "",
        swishPaymentRequestToken: "",
      },
    }).as("registerDonation");

    // Intercept the bank pending call
    cy.intercept("POST", "**/donations/bank/pending", {
      statusCode: 200,
      body: {},
    }).as("bankPending");
  });

  it("Should send correct distribution for multiple cause areas", () => {
    // Select multiple cause areas
    cy.get("[data-cy=cause-area-multiple]").click();

    // Set amounts for different cause areas
    setCauseAreaAmount(1, 300); // Global hälsa
    setCauseAreaAmount(2, 200); // Djurvälfärd
    setCauseAreaAmount(3, 100); // Klimat

    // Go to donor pane and fill information
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify the registration request
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      expect(body.amount).to.equal(600); // 300 + 200 + 100

      // Should have 3 cause areas
      expect(body.distributionCauseAreas).to.have.length(3);

      // Check percentages: 300/600=50%, 200/600=33.33%, 100/600=16.67%
      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(50, 0.01);

      const animalWelfare = body.distributionCauseAreas.find((ca) => ca.id === 2);
      expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(33.33, 0.01);

      const climate = body.distributionCauseAreas.find((ca) => ca.id === 3);
      expect(parseFloat(climate.percentageShare)).to.be.closeTo(16.67, 0.01);
    });
  });

  it("Should handle custom organization distribution correctly", () => {
    cy.get("[data-cy=cause-area-multiple]").click();
    setCauseAreaAmount(1, 1000);

    // Check if custom distribution is available for cause area 1
    cy.get("body").then(($body) => {
      if ($body.find('input[type="radio"]').length > 1) {
        // Switch to custom distribution
        cy.contains("Velj organisasjoner selv").click();

        // Wait for animation and set custom amounts
        cy.wait(500);
        cy.get("[data-cy=org-12]").clear().type("600");
        cy.get("[data-cy=org-15]").clear().type("400");

        cy.get("[data-cy=next-button]").click();
        cy.get("[data-cy=name-input]").type("Test Donor");
        cy.get("[data-cy=email-input]").type("test@example.com");

        // Submit by clicking payment method
        cy.get("[data-cy^=payment-method-]").first().click();

        // Verify the registration request
        cy.wait("@registerDonation").then((interception) => {
          const { body } = interception.request;

          expect(body.amount).to.equal(1000);

          // Should have custom distribution for Global hälsa
          const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
          expect(globalHealth).to.exist;
          expect(globalHealth.standardSplit).to.be.false; // Custom distribution
          expect(parseFloat(globalHealth.percentageShare)).to.equal(100);

          // Check that organizations have correct individual shares
          const org12 = globalHealth.organizations.find((org) => org.id === 12);
          const org15 = globalHealth.organizations.find((org) => org.id === 15);

          expect(parseFloat(org12.percentageShare)).to.equal(60); // 600/1000 * 100
          expect(parseFloat(org15.percentageShare)).to.equal(40); // 400/1000 * 100
        });
      } else {
        cy.log("Custom distribution not available - single organization cause area");
      }
    });
  });
});
