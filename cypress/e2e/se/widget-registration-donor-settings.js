import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Donor Information & Settings Registration", () => {
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

  it("Should include correct donor information in request", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 200);
    cy.get("[data-cy=next-button]").click();

    // Fill donor information
    cy.get("[data-cy=name-input]").type("Test Donor Name");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify donor information in request
    cy.wait("@registerDonation").then((interception) => {
      const { donor } = interception.request.body;

      expect(donor.name).to.equal("Test Donor Name");
      expect(donor.email).to.equal("test@example.com");
      expect(donor.taxDeduction).to.be.a("boolean");
      expect(donor.newsletter).to.be.a("boolean");
    });
  });

  it("Should handle recurring vs single donation correctly", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 300);

    // Switch to recurring
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });

    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify recurring flag in request
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      expect(body.recurring).to.equal(1); // 1 = recurring, 0 = single
      expect(body.amount).to.equal(300);
    });
  });
});
