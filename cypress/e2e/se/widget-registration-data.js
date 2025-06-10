import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Registration Data Validation", () => {
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

      // Based on fixture: Global hälsa has 100% standardPercentageShare, others have 0%
      // So all 1000 kr should go to Global hälsa
      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(100);

      // Should only have Global hälsa in distribution (others have 0% share)
      expect(body.distributionCauseAreas).to.have.length(1);
    });
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

  it("Should handle smart distribution with tip correctly", () => {
    // Select smart distribution with preset amount that includes tip
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
      // Global hälsa has 100%, so all should go there with no operations tip
      // (operations tip is only added when manually enabled in UI, not in smart distribution)
      const globalHealth = body.distributionCauseAreas.find((ca) => ca.id === 1);
      expect(globalHealth).to.exist;
      expect(parseFloat(globalHealth.percentageShare)).to.equal(100);
    });
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
