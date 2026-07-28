// This platform's real cause-area data (cause_areas.json) has only one active
// cause area, which routes the widget straight into SingleCauseAreaPane (see
// widget.js). That leaves the SelectionPane + multi-cause-area AmountPane
// flow untested even though it's shared, non-locale-specific widget code.
// This spec forces a multi-cause-area fixture so that flow keeps working too.
describe("Widget multiple cause areas", () => {
  beforeEach(() => {
    cy.fixture("cause_areas_multiple")
      .then((causeAreas) => {
        cy.intercept("GET", "/causeareas/all", {
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

    cy.visit({
      url: "/",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });
    cy.wait(500);
    cy.get("[data-cy=gi-button]").click();
  });

  it("Shows the cause area selection pane instead of SingleCauseAreaPane", () => {
    cy.get('[data-cy="cause-area-recommendation"]').should("exist");
    cy.get('[data-cy="cause-area-1"]').should("exist");
    cy.get('[data-cy="cause-area-multiple"]').should("exist");
  });

  it("Can pick a single cause area out of several via the selection pane", () => {
    cy.get('[data-cy="cause-area-1"]').click();
    cy.get('[data-cy="single-donation-radio"]').should("exist");

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.get('[data-cy^="donation-sum-input-"]').type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();

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

    cy.get("[data-cy=payment-method-bank]").click({ force: true });

    cy.wait("@registerDonation");

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("Can distribute a donation across multiple cause areas with a tip", () => {
    cy.get('[data-cy="cause-area-multiple"]').click();

    cy.get('[data-cy="donation-sum-input-1"]').type("700");
    cy.get('[data-cy="donation-sum-input-3"]').type("300");

    cy.get('[data-cy="global-cut-checkbox"]').check({ force: true });
    cy.get('[data-cy="global-percentage-cut-input"]').should("exist");

    cy.nextWidgetPane();

    cy.pickAnonymous();

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

    cy.get("[data-cy=payment-method-bank]").click({ force: true });

    cy.wait("@registerDonation");

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("Never adds a tip on top of a donation to the operations cause area itself", () => {
    // Cause area 4 in this fixture ("Stöd Ge Effektivt") is the operations
    // cause area — selecting it directly must never show or apply a tip.
    cy.get('[data-cy="cause-area-4"]').click();

    cy.get('[data-cy="donation-sum-input-operations"]').type("1000");
    // OperationsCauseAreaForm never renders a tip toggle for its own cause area
    cy.get('[data-cy="cut-checkbox-4"]').should("not.exist");

    cy.nextWidgetPane();
    cy.pickAnonymous();

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body.amount).to.eq(1000);
      expect(req.body.distributionCauseAreas).to.have.length(1);
      expect(req.body.distributionCauseAreas[0].id).to.eq(4);
      expect(parseFloat(req.body.distributionCauseAreas[0].percentageShare)).to.eq(100);

      req.reply({
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
      });
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.get("[data-cy=payment-method-bank]").click({ force: true });

    cy.wait("@registerDonation");

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });
});
