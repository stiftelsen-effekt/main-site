describe("Widget referral code", () => {
  beforeEach(() => {
    cy.fixture("cause_areas").then((causeAreas) => {
      cy.intercept("GET", "/causeareas/all", {
        statusCode: 200,
        body: {
          status: 200,
          content: causeAreas,
        },
      }).as("getCauseAreas");
    });

    cy.fixture("referrals").then((referrals) => {
      cy.intercept("GET", "/referrals/types", {
        statusCode: 200,
        body: {
          status: 200,
          content: referrals,
        },
      }).as("getReferrals");
    });

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

    cy.visit({
      url: "/",
      qs: { referral: "match-2026" },
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });
    cy.wait("@getCauseAreas");
    cy.get("[data-cy=gi-button]").should("be.visible").click();
    cy.get("[data-cy=widget-pane]").should("be.visible");
  });

  it("sends the referral query param with donation registration", () => {
    cy.pickSingleDonation();
    cy.get("[data-cy^=donation-sum-input]").type("500");
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=payment-method-bank]").click({ force: true });
    cy.nextWidgetPane();

    cy.wait("@registerDonation").then((interception) => {
      expect(interception.request.body.referralCode).to.equal("match-2026");
    });
  });
});
