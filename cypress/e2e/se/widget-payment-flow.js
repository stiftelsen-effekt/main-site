import {
  setupWidgetTest,
  setupDonationIntercepts,
  fillDonorInfo,
  setCauseAreaAmount,
} from "./support/widget-setup.js";

describe("Swedish Widget - Payment Flow", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  describe("Donor Information Validation", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      cy.get("[data-cy=next-button]").click();
    });

    it("Should validate required donor information", () => {
      // All payment buttons should be disabled initially
      cy.get("[data-cy=payment-method-autogiro]").should("be.disabled");

      // Fill invalid email
      cy.get("[data-cy=name-input]").type("Test Person");
      cy.get("[data-cy=email-input]").type("invalid-email");

      // Payment buttons should still be disabled
      cy.get("[data-cy=payment-method-autogiro]").should("be.disabled");

      // Fix email
      cy.get("[data-cy=email-input]").clear().type("test@example.com");

      // Payment buttons should now be enabled
      cy.get("[data-cy=payment-method-autogiro]").should("not.be.disabled");
    });

    it("Should handle anonymous donation", () => {
      // Select anonymous donation
      cy.get("[data-cy=anon-checkbox]").check();

      // Should skip name/email validation
      cy.get("[data-cy=payment-method-autogiro]").should("not.be.disabled");

      // Name and email should be hidden/disabled
      cy.get("[data-cy=name-input]").should("not.be.visible");
      cy.get("[data-cy=email-input]").should("not.be.visible");
    });

    it("Should validate Swedish tax deduction information", () => {
      fillDonorInfo();

      // Enable tax deduction
      cy.get("[data-cy=tax-deduction-checkbox]").check();

      // Should show SSN input
      cy.get("[data-cy=ssn-input]").should("be.visible");

      // Invalid SSN should disable payment
      cy.get("[data-cy=ssn-input]").type("invalid-ssn");
      cy.get("[data-cy=payment-method-autogiro]").should("be.disabled");

      // Valid Swedish SSN should enable payment
      cy.get("[data-cy=ssn-input]").clear().type("19900101-1234");
      cy.get("[data-cy=payment-method-autogiro]").should("not.be.disabled");
    });

    it("Should handle newsletter signup", () => {
      fillDonorInfo();

      // Newsletter should be optional
      cy.get("[data-cy=payment-method-autogiro]").should("not.be.disabled");

      // Should be able to toggle newsletter
      cy.get("[data-cy=newsletter-checkbox]").check();
      cy.get("[data-cy=newsletter-checkbox]").should("be.checked");

      cy.get("[data-cy=newsletter-checkbox]").uncheck();
      cy.get("[data-cy=newsletter-checkbox]").should("not.be.checked");
    });
  });

  describe("Autogiro Payment Flow", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, true); // With tip
      cy.get("[data-cy=next-button]").click();
      fillDonorInfo();
      setupDonationIntercepts();
    });

    it("Should complete single autogiro donation", () => {
      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait(["@registerDonation"]);

      // Should show success with KID
      cy.get("[data-cy=autogiro-kid]").should("contain.text", "87397824");
    });

    it("Should complete recurring autogiro donation", () => {
      // Navigate back
      cy.get("[data-cy=back-button]").click();
      cy.get('input[value="1"]').click();
      cy.get("[data-cy=next-button]").click();

      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait(["@draftAutoGiroPaymentDate", "@registerDonation"]);

      // Should show autogiro setup options
      cy.get("[data-cy=autogiro-radio-manual-transaction]").should("exist");
      cy.get("[data-cy=autogiro-radio-manual-autogiro-setup]").should("exist");
    });

    it("Should handle autogiro date selection", () => {
      // Navigate back
      cy.get("[data-cy=back-button]").click();
      cy.get('input[value="1"]').click();
      cy.get("[data-cy=next-button]").click();

      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait(["@draftAutoGiroPaymentDate", "@registerDonation"]);

      // Select autogiro setup option
      cy.get("[data-cy=autogiro-radio-manual-autogiro-setup]").click();

      // Should show date selector
      cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").should("be.visible");
      cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").click();

      // Select day 10
      cy.get("[data-cy=date-picker-button-10]").click();
      cy.wait("@draftAutoGiroPaymentDate");

      // Should update button text
      cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").should("contain.text", "10");
    });
  });

  describe("Multiple Payment Methods", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      cy.get("[data-cy=next-button]").click();
      fillDonorInfo();
    });

    it("Should show available payment methods", () => {
      // Check that Swedish payment methods are available
      cy.get("[data-cy=payment-method-autogiro]").should("be.visible");

      // May also have bank transfer and other methods
      cy.get("[data-cy^=payment-method-]").should("have.length.at.least", 1);
    });

    it("Should handle bank transfer", () => {
      setupDonationIntercepts();

      // If bank transfer is available
      cy.get("body").then(($body) => {
        if ($body.find("[data-cy=payment-method-bank]").length > 0) {
          cy.get("[data-cy=payment-method-bank]").click();
          cy.wait(["@registerDonation", "@bankPending"]);
          cy.get("[data-cy=kidNumber]").should("be.visible");
        }
      });
    });
  });

  describe("Complex Donation Scenarios", () => {
    it("Should handle multiple cause areas with tips and different payment methods", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      // Set up complex donation
      setCauseAreaAmount(1, 400, true); // Global health with tip
      setCauseAreaAmount(2, 300); // Animal welfare no tip
      setCauseAreaAmount(3, 200, true); // Climate with tip

      // Switch to recurring
      cy.get('input[value="1"]').click();

      // Check total is displayed
      cy.get("[data-cy=total-amount-wrapper]").should("exist"); // Complex calculation with tips

      cy.get("[data-cy=next-button]").click();
      fillDonorInfo();

      setupDonationIntercepts();
      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait(["@draftAutoGiroPaymentDate", "@registerDonation"]);

      // Should complete successfully
      cy.get("[data-cy=autogiro-kid]").should("be.visible");
    });

    it("Should preserve donation details in confirmation", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 1000, true);

      cy.get("[data-cy=next-button]").click();
      fillDonorInfo("John Doe", "john@example.com");

      setupDonationIntercepts();
      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait("@registerDonation").then((interception) => {
        // Verify the request contains correct data
        expect(interception.request.body).to.have.property("donor");
        expect(interception.request.body.donor).to.have.property("name", "John Doe");
        expect(interception.request.body.donor).to.have.property("email", "john@example.com");
        expect(interception.request.body).to.have.property("amount");
      });
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      cy.get("[data-cy=next-button]").click();
      fillDonorInfo();
    });

    it("Should handle donation registration errors", () => {
      cy.intercept("POST", "/donations/register", {
        statusCode: 400,
        body: {
          status: 400,
          content: "Invalid donation data",
        },
      }).as("registerDonationError");

      cy.get("[data-cy=payment-method-autogiro]").click();

      // Should show error message
      cy.contains("Invalid donation data").should("be.visible");
    });

    it("Should handle network errors gracefully", () => {
      cy.intercept("POST", "/donations/register", {
        forceNetworkError: true,
      }).as("networkError");

      cy.get("[data-cy=payment-method-autogiro]").click();

      // Should show appropriate error handling
      cy.get("[data-cy=payment-method-autogiro]").should("not.be.disabled");
    });
  });
});
