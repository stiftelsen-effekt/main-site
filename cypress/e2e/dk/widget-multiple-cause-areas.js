// Forces a multi-cause-area fixture (cause_areas_multiple) to cover the
// SelectionPane + multi-cause-area AmountPane flow with operations tipping.
import {
  setupWidgetTest,
  setCauseAreaAmount,
  setGlobalCut,
  goToDonorPane,
  OPERATIONS_SUMMARY_LABEL,
  SINGLE_DONATION_TEXT,
  MONTHLY_DONATION_TEXT,
  SMART_DISTRIBUTION_TITLE,
} from "./support/widget-setup.js";

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

  it("Can distribute a donation across multiple cause areas with a tip", () => {
    cy.get('[data-cy="cause-area-multiple"]').click();

    cy.get('[data-cy="donation-sum-input-1"]').type("700");
    cy.get('[data-cy="donation-sum-input-2"]').type("300");

    cy.get('[data-cy="global-cut-checkbox"]').check({ force: true });
    cy.get('[data-cy="global-percentage-cut-input"]').should("exist");

    cy.nextWidgetPane();

    cy.get("[data-cy=name-input]").should("not.exist");
    cy.get("[data-cy=email-input]").type("donor@email.dk");
    cy.get("[data-cy=privacy-policy-checkbox]").click({ force: true });

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
    // Cause area 4 ("Drift") in this fixture is the operations cause area —
    // selecting it directly must never show or apply a tip.
    cy.get('[data-cy="cause-area-4"]').click();

    cy.get('[data-cy="donation-sum-input-operations"]').type("1000");
    cy.get('[data-cy="cut-checkbox-4"]').should("not.exist");

    cy.nextWidgetPane();

    cy.get("[data-cy=email-input]").type("donor@email.dk");
    cy.get("[data-cy=privacy-policy-checkbox]").click({ force: true });

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

// Amount entry, organization distribution and summary for the multiple cause areas pane.
// In cause_areas_multiple.json, Global sundhed (1) has orgs 100 (standardShare 100) and
// 101, Dyrevelfærd (2) has orgs 200 (standardShare 100) and 102, and Drift (4) is the
// operations cause area.
describe("Widget multiple cause areas - amounts, distribution and summary", () => {
  beforeEach(() => {
    setupWidgetTest({ fixture: "cause_areas_multiple" });
    cy.get("[data-cy=cause-area-multiple]").click();
  });

  it("Shows an input per cause area plus smart distribution, but not operations", () => {
    cy.get("[data-cy=donation-sum-input-overall]").should("be.visible");
    cy.get("[data-cy=donation-sum-input-1]").should("be.visible");
    cy.get("[data-cy=donation-sum-input-2]").should("be.visible");
    // Operations is a below-the-line cause area and is only added via the global cut
    cy.get("[data-cy=donation-sum-input-4]").should("not.exist");
    cy.get("[data-cy=donation-sum-input-operations]").should("not.exist");
    cy.get("[data-cy=global-cut-checkbox]").should("exist");
    // Per-cause-area cut toggles only exist when a single cause area is selected
    cy.get("[data-cy=cut-checkbox-1]").should("not.exist");
    cy.get("[data-cy=cut-checkbox-2]").should("not.exist");
  });

  it("Sums the amounts for each cause area", () => {
    setCauseAreaAmount(1, 300);
    setCauseAreaAmount(2, 200);

    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
    cy.get("[data-cy=total-amount-wrapper]").should("contain.text", "500 kr");
  });

  it("Requires at least one amount to proceed", () => {
    cy.get("[data-cy=next-button]").last().should("be.disabled");

    setCauseAreaAmount(1, 100);
    cy.get("[data-cy=next-button]").last().should("not.be.disabled");

    cy.get("[data-cy=donation-sum-input-1]").clear();
    cy.get("[data-cy=next-button]").last().should("be.disabled");
  });

  it("Auto-populates organization amounts from standard shares when switching to custom distribution", () => {
    setCauseAreaAmount(1, 500);

    cy.get("[data-cy=radio-smart-share-1]").should("exist");
    cy.get("[data-cy=radio-custom-share-1]").click({ force: true });

    cy.get("[data-cy=org-100]").should("have.value", "500");
    cy.get("[data-cy=org-101]").should("have.value", "");
    cy.get("[data-cy=next-button]").last().should("not.be.disabled");
  });

  it("Shows custom organization amounts in the summary", () => {
    setCauseAreaAmount(1, 500);
    setGlobalCut(false);

    cy.get("[data-cy=radio-custom-share-1]").click({ force: true });
    cy.get("[data-cy=org-100]").should("have.value", "500");
    cy.get("[data-cy=org-101]").type("300");
    cy.get("[data-cy=org-101]").should("have.value", "300");

    goToDonorPane();

    cy.get("[data-cy=summary-org-100-amount]").should("contain.text", "500 kr");
    cy.get("[data-cy=summary-org-101-amount]").should("contain.text", "300 kr");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "800 kr");
  });

  it("Preserves amounts when navigating to the donor pane and back", () => {
    setCauseAreaAmount(1, 300);
    setCauseAreaAmount(2, 200);

    goToDonorPane();
    cy.get("[data-cy=back-button]").click();

    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
    cy.get("[data-cy=total-amount-wrapper]").should("contain.text", "500 kr");
  });

  it("Shows each cause area in the donation summary", () => {
    setCauseAreaAmount(1, 500);
    setCauseAreaAmount(2, 300);
    setGlobalCut(false);

    goToDonorPane();

    cy.get("[data-cy=donation-type]").should("contain.text", SINGLE_DONATION_TEXT);
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "500 kr");
    cy.get("[data-cy=summary-cause-area-2-amount]").should("contain.text", "300 kr");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("not.exist");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "800 kr");
  });

  it("Keeps smart distribution, direct cause areas and operations separate in the summary", () => {
    cy.get("[data-cy=donation-sum-input-overall]").type("500");
    setCauseAreaAmount(1, 100);
    setCauseAreaAmount(2, 200);
    setGlobalCut(true, 10);

    goToDonorPane();

    // 800 kr total, 10% (80 kr) to operations taken proportionally from every part
    cy.get("[data-cy=summary-smart-distribution-name]").should(
      "contain.text",
      SMART_DISTRIBUTION_TITLE,
    );
    cy.get("[data-cy=summary-smart-distribution-amount]").should("contain.text", "450 kr");
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "90 kr");
    cy.get("[data-cy=summary-cause-area-2-amount]").should("contain.text", "180 kr");
    cy.get("[data-cy=summary-cause-area-4-name]").should("contain.text", OPERATIONS_SUMMARY_LABEL);
    cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "80 kr");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "800 kr");
  });

  it("Shows the operations cut for a recurring donation with the global cut", () => {
    setCauseAreaAmount(1, 400);
    setCauseAreaAmount(2, 600);
    setGlobalCut(true, 10);
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
    cy.get("[data-cy=next-button]").last().should("not.be.disabled");

    goToDonorPane();

    cy.get("[data-cy=donation-type]").should("contain.text", MONTHLY_DONATION_TEXT);
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "360 kr");
    cy.get("[data-cy=summary-cause-area-2-amount]").should("contain.text", "540 kr");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "100 kr");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "1 000 kr");
  });
});
