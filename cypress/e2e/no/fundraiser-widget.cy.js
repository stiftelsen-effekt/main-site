const BASE_PATH = "/innsamling";

const SLUGS = {
  default: "e2e-test-do-not-delete-fundraiser-default",
  noNewsletter: "e2e-test-do-not-delete-fundraiser-no-newsletter",
  noTax: "e2e-test-do-not-delete-fundraiser-no-tax-deduction",
  noNewsletterNoTax: "e2e-test-do-not-delete-fundraiser-no-newsletter-no-tax-deduction",
};

const visitFundraiser = (slug) => {
  cy.visit(`${BASE_PATH}/${slug}`);
  cy.get("[data-cy='fundraiser-widget']", { timeout: 10000 }).should("exist");
};

const startWidget = () => {
  cy.get("[data-cy='fundraiser-pane-organization']").should("be.visible");
  cy.get("[data-cy='fundraiser-start-button']").click();
  cy.get("[data-cy='fundraiser-pane-donation']").should("be.visible");
  cy.get("[data-cy='fundraiser-pane-organization']").should("not.be.visible");
};

const fillDonationDetails = ({ amount, showName = false, name, message }) => {
  cy.get("[data-cy='fundraiser-amount-input']").clear({ force: true }).type(String(amount));

  if (message) {
    cy.get("[data-cy='fundraiser-message-input']").clear().type(message);
  }

  cy.get("[data-cy='fundraiser-show-name']").then(($wrapper) => {
    const input = $wrapper.find("input[type='checkbox']")[0];
    const isChecked = input ? input.checked : false;
    if (showName && !isChecked) {
      cy.wrap($wrapper).click();
    }
    if (!showName && isChecked) {
      cy.wrap($wrapper).click();
    }
  });

  if (showName && name) {
    cy.get("[data-cy='fundraiser-name-input']").clear().type(name);
  }

  cy.get("[data-cy='fundraiser-donation-next']").click();
};

const goToPaymentPane = (options) => {
  startWidget();
  fillDonationDetails(options);
  cy.get("[data-cy='fundraiser-pane-payment']").should("be.visible");
};

const assertCheckboxChecked = (dataCy, checked) => {
  cy.get(`[data-cy='${dataCy}']`)
    .find("input[type='checkbox']")
    .should("have.prop", "checked", checked);
};

describe("Fundraiser widget - default configuration", () => {
  beforeEach(() => {
    visitFundraiser(SLUGS.default);
  });

  it("renders fundraiser content and stats", () => {
    // Need to grab the second h1 because the first one is for mobile
    cy.get("h1")
      .eq(1)
      .contains("[E2E test] [Do not delete] Fundraiser Default")
      .should("be.visible");
    cy.get("[data-cy='fundraiser-progress-current']").should("contain", "10 kr samlet inn");
    cy.get("[data-cy='fundraiser-progress-bar']").should("exist");

    cy.get("[data-cy='fundraiser-organization-info']")
      .should("contain", "WALL-E samler inn til")
      .within(() => {
        cy.get("[data-cy='fundraiser-organization-link']").should(
          "have.attr",
          "href",
          "/malaria-consortium",
        );
      });

    cy.get("[data-cy='fundraiser-gift-activity']")
      .should("contain", "Siste gaver")
      .within(() => {
        cy.get("[data-cy='fundraiser-gift-item']").should("have.length", 1);
        cy.get("[data-cy='fundraiser-gift-message']").should(
          "contain",
          "Directive: PROTECT LIFE. Deploy nets. ♥",
        );
      });
    cy.get("[data-cy='fundraiser-gift-show-more']").should("not.exist");
  });

  it("handles navigation, validation, and dynamic toggles", () => {
    startWidget();

    cy.get("[data-cy='fundraiser-show-name']").click();
    cy.get("[data-cy='fundraiser-donation-next']").click();
    cy.get("[data-cy='fundraiser-pane-donation']").should("be.visible");

    fillDonationDetails({
      amount: 600,
      showName: true,
      name: "Wall-E",
      message: "Directive: protect life.",
    });
    cy.get("[data-cy='fundraiser-pane-payment']").should("be.visible");

    assertCheckboxChecked("fundraiser-tax-deduction", true);
    cy.get("[data-cy='fundraiser-email-input']").should("exist").and("have.attr", "required");
    cy.get("[data-cy='fundraiser-ssn-input']").should("exist");

    cy.get("[data-cy='fundraiser-back-button']").click();
    cy.get("[data-cy='fundraiser-pane-donation']").should("be.visible");

    cy.get("[data-cy='fundraiser-amount-input']").clear({ force: true }).type("100");
    cy.get("[data-cy='fundraiser-donation-next']").click();
    cy.get("[data-cy='fundraiser-pane-payment']").should("be.visible");

    assertCheckboxChecked("fundraiser-tax-deduction", false);
    cy.get("body").find("[data-cy='fundraiser-email-input']").should("not.exist");

    cy.get("[data-cy='fundraiser-newsletter']").click();
    cy.get("[data-cy='fundraiser-email-input']").should("exist").and("have.attr", "required");
    cy.get("[data-cy='fundraiser-newsletter']").click();
    cy.get("body").find("[data-cy='fundraiser-email-input']").should("not.exist");

    cy.get("[data-cy='fundraiser-method-bank']").click({ force: true });
    cy.get("[data-cy='fundraiser-method-vipps']").click({ force: true });
  });

  it("completes a bank donation flow and reveals transfer details", () => {
    goToPaymentPane({
      amount: 200,
      showName: true,
      name: "Wall-E",
      message: "Directive: protect life.",
    });

    cy.get("[data-cy='fundraiser-method-bank']").click({ force: true });

    cy.intercept("POST", "**/donations/register", {
      statusCode: 200,
      body: {
        status: 200,
        content: {
          KID: "12345678",
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");

    cy.window().then((win) => cy.stub(win, "open").as("windowOpen"));

    cy.get("[data-cy='fundraiser-submit-button']").should("contain", "Gi med bank");
    cy.get("[data-cy='fundraiser-submit-button']").click({ force: true });

    cy.wait("@registerDonation");
    cy.get("[data-cy='fundraiser-pane-bank']").should("be.visible");
    cy.get("[data-cy='fundraiser-kid']").should("contain", "12345678");
    cy.get("@windowOpen").should("not.have.been.called");
  });
});

describe("Fundraiser widget variations", () => {
  it("hides the newsletter checkbox when disabled", () => {
    visitFundraiser(SLUGS.noNewsletter);
    goToPaymentPane({ amount: 600 });
    cy.get("body").find("[data-cy='fundraiser-newsletter']").should("not.exist");
    cy.get("[data-cy='fundraiser-tax-deduction']").should("exist");
  });

  it("hides tax deduction controls when disabled", () => {
    visitFundraiser(SLUGS.noTax);
    goToPaymentPane({ amount: 600 });

    cy.get("body").find("[data-cy='fundraiser-tax-deduction']").should("not.exist");
    cy.get("[data-cy='fundraiser-newsletter']").should("exist");

    cy.get("body").find("[data-cy='fundraiser-email-input']").should("not.exist");
    cy.get("[data-cy='fundraiser-newsletter']").click();
    cy.get("[data-cy='fundraiser-email-input']").should("exist").and("have.attr", "required");
    cy.get("[data-cy='fundraiser-ssn-input']").should("not.exist");
  });

  it("hides both newsletter and tax deduction when disabled together", () => {
    visitFundraiser(SLUGS.noNewsletterNoTax);
    goToPaymentPane({ amount: 600 });

    cy.get("body").find("[data-cy='fundraiser-tax-deduction']").should("not.exist");
    cy.get("body").find("[data-cy='fundraiser-newsletter']").should("not.exist");
    cy.get("body").find("[data-cy='fundraiser-email-input']").should("not.exist");
    cy.get("body").find("[data-cy='fundraiser-ssn-input']").should("not.exist");
  });

  it("redirects to Vipps when the API includes a provider URL", () => {
    visitFundraiser(SLUGS.noTax);
    goToPaymentPane({ amount: 600 });

    cy.get("[data-cy='fundraiser-method-vipps']").click({ force: true });

    cy.intercept("POST", "**/donations/register", {
      statusCode: 200,
      body: {
        status: 200,
        content: {
          KID: "98765432",
          paymentProviderUrl: "https://vipps.test/redirect",
        },
      },
    }).as("registerVippsDonation");

    cy.window().then((win) => cy.stub(win, "open").as("windowOpen"));

    cy.get("[data-cy='fundraiser-submit-button']").should("contain", "Gi med Vipps");
    cy.get("[data-cy='fundraiser-submit-button']").click({ force: true });

    cy.wait("@registerVippsDonation");
    cy.get("@windowOpen").should("have.been.calledWith", "https://vipps.test/redirect", "_self");
    cy.get("[data-cy='fundraiser-pane-bank']").should("not.be.visible");
  });
});
