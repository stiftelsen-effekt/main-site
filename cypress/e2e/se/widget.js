import mockDonor from "../../fixtures/no/donor.json";

describe("Widget", () => {
  beforeEach(() => {
    cy.fixture("cause_areas")
      .then((causeAreas) => {
        cy.intercept("GET", "/causeareas/active", {
          statusCode: 200,
          body: {
            status: 200,
            content: causeAreas,
          },
        });
      })
      .as("getCauseAreas");

    cy.fixture("referrals").then((referrals) => {
      cy.intercept("GET", "/referrals/types", {
        statusCode: 200,
        body: {
          status: 200,
          content: referrals,
        },
      }).as("getReferrals");
    });

    cy.visit("/", {
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });
    cy.wait(500);
    cy.get("[data-cy=gi-button]").click();
  });

  it("End-2-End single bank donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });

    cy.intercept("POST", "/donations/register", {
      statusCode: 200,
      body: {
        status: 200,
        content: {
          KID: "87397824",
          donorID: 1464,
          hasAnsweredReferral: false,
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("End-2-End recurring autogiro donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickRecurringDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=autogiro-method]").click({ force: true });
    cy.wait(500);

    cy.intercept("POST", "/donations/register", {
      statusCode: 200,
      body: {
        status: 200,
        content: {
          KID: "87397824",
          donorID: 1464,
          hasAnsweredReferral: false,
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");

    cy.intercept("PUT", "/autogiro/*/drafted/paymentdate", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("draftAutoGiroPaymentDate");

    cy.nextWidgetPane();

    cy.wait(["@draftAutoGiroPaymentDate", "@registerDonation"]);

    cy.get("[data-cy=autogiro-kid]").should("contain.text", "87397824");

    cy.get("[data-cy=autogiro-radio-manual-transaction]").should("exist");
    cy.get("[data-cy=autogiro-radio-manual-autogiro-setup]").should("exist");

    cy.get("[data-cy=autogiro-radio-manual-transaction]").click({ force: true });
    cy.get("[data-cy=autogiro-manual-sum]").should(($sum) => {
      const sumtext = $sum.text();
      // Remove spaces and non digit characters
      const sum = sumtext.replace(/\D/g, "");
      expect(sum).to.be.eq(randomSum.toString());
    });
    cy.get("[data-cy=autogiro-manual-bank-account").should("contain.text", "5232-3524");

    cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").should("not.be.visible");

    cy.get("[data-cy=autogiro-radio-manual-autogiro-setup]").click({ force: true });
    cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").should("be.visible");
    cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").should(
      "contain.text",
      "varje månad",
    );

    cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").click({ force: true });

    cy.get("[data-cy=autogiro-manual-setup-date-selector-wrapper] [data-cy=date-picker]").should(
      "be.visible",
    );

    cy.get(
      "[data-cy=autogiro-manual-setup-date-selector-wrapper] [data-cy=date-picker] [data-cy=date-picker-button-10]",
    ).click();
    cy.wait("@draftAutoGiroPaymentDate");

    cy.get("[data-cy=autogiro-manual-setup-date-selector-button]").should("contain.text", "10");

    cy.get("[data-cy=autogiro-radio-manual-transaction]").click({ force: true });
    cy.get("[data-cy=autogiro-manual-transaction-setup-complete-button").click();

    cy.get("[data-cy=autogiro-completed-text").should("be.visible");
  });
});
