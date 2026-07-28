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

      expect(body.distributionCauseAreas).to.have.length(2);

      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(81);

      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.exist;
      expect(parseFloat(operations.percentageShare)).to.equal(19);
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

      expect(body.distributionCauseAreas).to.have.length(2);

      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(81);

      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.exist;
      expect(parseFloat(operations.percentageShare)).to.equal(19);
    });
  });

  it("Should show only the current operations amount when switching to smart distribution", () => {
    // Start with single cause area and enable tip
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 100, true); // 100 kr with 10% tip = 90 kr + 10 kr operations

    // Go back and select smart distribution instead
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("500");

    // Go to donor pane to check UI summary
    cy.get("[data-cy=next-button]").click();

    // Check that the donation summary UI shows smart distribution, not leaked operations
    cy.get("[data-cy=donation-summary]").should("exist");

    cy.get("[data-cy=summary-smart-distribution]").should("exist");
    cy.get("[data-cy=summary-smart-distribution-amount]").should(($el) => {
      const text = $el.text().replace(/\s/g, "");
      expect(text).to.match(/450kr/i);
    });

    cy.get("[data-cy=summary-cause-area-1-amount]").should("not.exist");
    cy.get("[data-cy=summary-cause-area-4-amount]").should(($el) => {
      const text = $el.text().replace(/\s/g, "");
      expect(text).to.match(/50kr/i);
    });
  });

  it("Should not retain operations amounts from a previous selection", () => {
    // Start with single cause area and enable tip
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 500, true); // 500 kr with 10% tip = 450 kr + 50 kr operations

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

    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      expect(body.amount).to.equal(1000);
      expect(body.distributionCauseAreas).to.have.length(2);

      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(81);

      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.exist;
      expect(parseFloat(operations.percentageShare)).to.equal(19);

      // Total should be exactly 100%
      const totalPercentage = body.distributionCauseAreas.reduce(
        (sum, ca) => sum + parseFloat(ca.percentageShare),
        0,
      );
      expect(totalPercentage).to.be.closeTo(100, 0.01);
    });
  });
});
