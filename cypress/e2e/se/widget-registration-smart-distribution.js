import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Smart Distribution Registration", () => {
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

  it("Should send correct distribution for smart distribution", () => {
    // Select smart distribution and set 1000 kr
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("1000");

    // Go to donor pane and fill information
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify the registration request
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      expect(body.amount).to.equal(1000);

      // Based on fixture: Global hälsa has 90% standardPercentageShare, Operations has 10%
      // So 900 kr should go to Global hälsa, 100 kr to Operations
      expect(body.distributionCauseAreas).to.have.length(2);

      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(90);

      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.exist;
      expect(parseFloat(operations.percentageShare)).to.equal(10);
    });
  });

  it("Should handle smart distribution with preset amounts correctly", () => {
    // Select smart distribution with preset amount
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=suggested-sum-smart-500]").click();

    // Go to donor pane and fill information
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify the registration request
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      expect(body.amount).to.equal(500);

      // Since smart distribution uses standardPercentageShare from fixture
      // Global hälsa has 90%, Operations has 10% - this replaces manual tip functionality
      expect(body.distributionCauseAreas).to.have.length(2);

      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(90);

      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.exist;
      expect(parseFloat(operations.percentageShare)).to.equal(10);
    });
  });

  it("Should not show operations amounts in UI summary when switching to smart distribution", () => {
    // Start with single cause area and enable tip
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 100, true); // 100 kr with 5% tip = 95 kr + 5 kr operations

    // Go back and select smart distribution instead
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("500");

    // Go to donor pane to check UI summary
    cy.get("[data-cy=next-button]").click();

    // Check that the donation summary UI shows smart distribution, not leaked operations
    cy.get("[data-cy=donation-summary]").should("exist");

    // Operations cause area should not exist at all in smart distribution
    cy.get("[data-cy=summary-cause-area-4]").should("not.exist");

    // Should show smart distribution as a single entry, not breakdown
    cy.get("[data-cy=summary-smart-distribution]").should("exist");
    cy.get("[data-cy=summary-smart-distribution-amount]").should(($el) => {
      const text = $el.text().replace(/\s/g, ""); // Remove all whitespace
      expect(text).to.match(/500kr/i); // Should contain 500kr (case insensitive)
    });

    // Should NOT show individual cause area breakdowns in summary for smart distribution
    cy.get("[data-cy=summary-cause-area-1-amount]").should("not.exist");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("not.exist");
  });

  it("Should not show operations amounts from single cause area when switching to smart distribution", () => {
    // Start with single cause area and enable tip
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 500, true); // 500 kr with 5% tip = 475 kr + 25 kr operations

    // Go back and select smart distribution instead
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("1000");

    // Go to donor pane to check summary
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit to check the registration request
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify the registration request - should only have smart distribution (90%/10%)
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      expect(body.amount).to.equal(1000);
      expect(body.distributionCauseAreas).to.have.length(2);

      // Should be 900 kr to Global hälsa (90%) and 100 kr to Operations (10%)
      // NOT 475 kr to Global hälsa + 25 kr leftover operations + smart distribution operations
      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(90);

      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.exist;
      expect(parseFloat(operations.percentageShare)).to.equal(10);

      // Total should be exactly 100%
      const totalPercentage = body.distributionCauseAreas.reduce(
        (sum, ca) => sum + parseFloat(ca.percentageShare),
        0,
      );
      expect(totalPercentage).to.be.closeTo(100, 0.01);
    });
  });
});
