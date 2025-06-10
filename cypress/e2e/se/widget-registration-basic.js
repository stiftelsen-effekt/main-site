import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Basic Registration Data", () => {
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

  it("Should send correct distribution for single cause area without tip", () => {
    // Select Global hälsa and set 100 kr
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 100);

    // Go to donor pane and fill information
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify the registration request
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      // Check basic request structure
      expect(body).to.have.property("distributionCauseAreas").that.is.an("array");
      expect(body).to.have.property("amount", 100);
      expect(body).to.have.property("donor");

      // Check distribution - should be 100% to Global hälsa (ID 1)
      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(globalHealth.name).to.equal("Global hälsa");
      expect(globalHealth.standardSplit).to.be.true;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(100);

      // Should not have operations cause area without tip
      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.not.exist;

      // Verify organizations within Global hälsa get correct shares
      expect(globalHealth.organizations).to.be.an("array").with.length.greaterThan(0);
      const totalOrgPercentage = globalHealth.organizations.reduce(
        (sum, org) => sum + parseFloat(org.percentageShare),
        0,
      );
      expect(totalOrgPercentage).to.be.closeTo(100, 0.01);
    });
  });

  it("Should send correct distribution for single cause area with tip", () => {
    // Select Global hälsa and set 100 kr with tip
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 100, true); // true = include tip

    // Go to donor pane and fill information
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify the registration request
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      // Total should still be 100 kr (95 kr to cause area + 5 kr to operations)
      expect(body.amount).to.equal(100);

      // Should have both Global hälsa and Operations
      expect(body.distributionCauseAreas).to.have.length(2);

      // Check Global hälsa - should be 95% (95/100)
      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(95, 0.01);

      // Check Operations - should be 5% (5/100)
      const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
      expect(operations).to.exist;
      expect(operations.name).to.include("Stöd");
      expect(parseFloat(operations.percentageShare)).to.be.closeTo(5, 0.01);

      // Total percentages should sum to 100%
      const totalPercentage = body.distributionCauseAreas.reduce(
        (sum, ca) => sum + parseFloat(ca.percentageShare),
        0,
      );
      expect(totalPercentage).to.be.closeTo(100, 0.01);
    });
  });

  it("Should handle operations/drift cause area correctly", () => {
    // Select operations cause area directly
    cy.get("[data-cy=cause-area-4]").click();
    cy.get("[data-cy=donation-sum-input-operations]").type("150");

    // Go to donor pane and fill information
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").type("Test Donor");
    cy.get("[data-cy=email-input]").type("test@example.com");

    // Submit by clicking payment method
    cy.get("[data-cy^=payment-method-]").first().click();

    // Verify the registration request
    cy.wait("@registerDonation").then((interception) => {
      const { body } = interception.request;

      expect(body.amount).to.equal(150);

      // Should only have Operations cause area
      expect(body.distributionCauseAreas).to.have.length(1);
      const operations = body.distributionCauseAreas[0];
      expect(operations.id).to.equal(4);
      expect(parseFloat(operations.percentageShare)).to.equal(100);
    });
  });
});
