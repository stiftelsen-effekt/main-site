import {
  setupWidgetTest,
  setupDonationIntercepts,
  fillDonorInfo,
  setCauseAreaAmount,
  goToDonorPane,
  registerDonationResponse,
} from "./support/widget-setup.js";

// DK payment methods (from Sanity): bank transfer (single only), card and MobilePay via
// QuickPay (single and recurring), and DK bank (recurring only, also via an external
// provider). The QuickPay and DK bank methods redirect to the provider's URL from the
// registration response.

const toDonorPane = ({ recurring = false } = {}) => {
  cy.get("[data-cy=cause-area-1]").click();
  if (recurring) cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
  setCauseAreaAmount(1, 500);
  goToDonorPane();
};

describe("DK Widget - Payment Flow", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  describe("Donor information validation", () => {
    beforeEach(() => {
      setupDonationIntercepts();
      toDonorPane();
    });

    // Donor info isn't validated up-front - the payment buttons stay clickable and
    // validation runs on submit, so an invalid form simply doesn't register a donation.
    it("Should not register a donation with an invalid email", () => {
      cy.get("[data-cy=email-input]").type("invalid-email");
      cy.get("[data-cy=privacy-policy-checkbox]").check({ force: true });

      cy.get("[data-cy=payment-method-bank]").click({ force: true });
      cy.contains("Ugyldig email").should("be.visible");
      cy.get("@registerDonation.all").should("have.length", 0);

      cy.get("[data-cy=email-input]").clear().type("donor@email.dk");
      cy.get("[data-cy=payment-method-bank]").click({ force: true });
      cy.wait("@registerDonation");
    });

    it("Should require accepting the privacy policy", () => {
      cy.get("[data-cy=email-input]").type("donor@email.dk");

      cy.get("[data-cy=payment-method-bank]").click({ force: true });
      cy.contains("Du skal acceptere vores handelsbetingelser.").should("be.visible");
      cy.get("@registerDonation.all").should("have.length", 0);

      cy.get("[data-cy=privacy-policy-checkbox]").check({ force: true });
      cy.get("[data-cy=payment-method-bank]").click({ force: true });
      cy.wait("@registerDonation");
    });

    it("Should not register a donation with an invalid CPR when tax deduction is selected", () => {
      fillDonorInfo();
      cy.get("[data-cy=tax-deduction-checkbox]").check({ force: true });
      cy.get("[data-cy=ssn-input]").should("be.visible");

      cy.get("[data-cy=ssn-input]").type("12345");
      cy.get("[data-cy=payment-method-bank]").click({ force: true });
      cy.contains("Ugyldigt CPR eller CVR.").should("be.visible");
      cy.get("@registerDonation.all").should("have.length", 0);

      cy.get("[data-cy=ssn-input]").clear().type("1202900107");
      cy.get("[data-cy=payment-method-bank]").click({ force: true });
      cy.wait("@registerDonation");
    });

    it("Should not offer anonymous donations", () => {
      cy.get("[data-cy=anon-checkbox]").should("not.exist");
    });
  });

  describe("Available payment methods", () => {
    it("Should offer bank transfer, card and MobilePay for single donations", () => {
      toDonorPane();

      cy.get("[data-cy=payment-method-bank]").should("be.visible");
      cy.get("[data-cy=payment-method-quickpay_card]").should("be.visible");
      cy.get("[data-cy=payment-method-quickpay_mobilepay]").should("be.visible");
      cy.get("[data-cy=payment-method-dkbank]").should("not.exist");
    });

    it("Should offer card, MobilePay and DK bank for recurring donations", () => {
      toDonorPane({ recurring: true });

      cy.get("[data-cy=payment-method-quickpay_card]").should("be.visible");
      cy.get("[data-cy=payment-method-quickpay_mobilepay]").should("be.visible");
      cy.get("[data-cy=payment-method-dkbank]").should("be.visible");
      cy.get("[data-cy=payment-method-bank]").should("not.exist");
    });
  });

  describe("Payment methods", () => {
    beforeEach(() => {
      setupDonationIntercepts();
    });

    it("Should complete a bank transfer and show the KID", () => {
      toDonorPane();
      fillDonorInfo();
      cy.get("[data-cy=payment-method-bank]").click({ force: true });

      cy.wait(["@registerDonation", "@bankPending"]);
      cy.get("[data-cy=kidNumber]").should("contain.text", "87397824");
    });

    it("Should register a single MobilePay donation", () => {
      toDonorPane();
      fillDonorInfo();
      cy.get("[data-cy=payment-method-quickpay_mobilepay]").click({ force: true });

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.recurring).to.equal(0);
        expect(body.amount).to.equal(500);
      });
      // Bank pending is only for single bank transfers
      cy.get("@bankPending.all").should("have.length", 0);
    });

    it("Should register a recurring DK bank donation", () => {
      toDonorPane({ recurring: true });
      fillDonorInfo();
      cy.get("[data-cy=payment-method-dkbank]").click({ force: true });

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.recurring).to.equal(1);
        expect(body.amount).to.equal(500);
      });
      cy.get("@bankPending.all").should("have.length", 0);
    });

    it("Should redirect to the payment provider for card payments", () => {
      const paymentProviderUrl = "https://payment.quickpay.net/payments/test";
      cy.intercept("POST", "/donations/register", {
        ...registerDonationResponse,
        body: {
          ...registerDonationResponse.body,
          content: { ...registerDonationResponse.body.content, paymentProviderUrl },
        },
      }).as("registerDonationWithProvider");

      cy.window().then((win) => {
        cy.stub(win, "open").as("windowOpen");
      });

      toDonorPane();
      fillDonorInfo();
      cy.get("[data-cy=payment-method-quickpay_card]").click({ force: true });

      cy.wait("@registerDonationWithProvider");
      cy.get("@windowOpen").should("have.been.calledWith", paymentProviderUrl, "_self");
    });
  });

  describe("Error handling", () => {
    beforeEach(() => {
      toDonorPane();
      fillDonorInfo();
    });

    it("Should show the API's error message when registration fails", () => {
      cy.intercept("POST", "/donations/register", {
        statusCode: 400,
        body: {
          status: 400,
          content: "Invalid donation data",
        },
      }).as("registerDonationError");

      cy.get("[data-cy=payment-method-bank]").click({ force: true });

      cy.wait("@registerDonationError");
      cy.get("[data-cy=api-error-notification]").should("contain.text", "Invalid donation data");
      // The button shows its label again (not a stuck spinner) so the donor can retry
      cy.get("[data-cy=payment-method-bank]").should("contain.text", "Bankoverførsel");
    });

    it("Should recover from network errors", () => {
      cy.intercept("POST", "/donations/register", {
        forceNetworkError: true,
      }).as("networkError");

      cy.get("[data-cy=payment-method-bank]").click({ force: true });

      cy.wait("@networkError");
      cy.get("[data-cy=api-error-notification]").should("be.visible");
      cy.get("[data-cy=payment-method-bank]").should("contain.text", "Bankoverførsel");

      // Retrying once the network is back registers the donation
      setupDonationIntercepts();
      cy.get("[data-cy=payment-method-bank]").click({ force: true });
      cy.wait("@registerDonation");
    });
  });
});
