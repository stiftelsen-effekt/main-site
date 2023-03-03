describe("Tax reports page with ea funds donations", () => {
  beforeEach(() => {
    cy.login();

    cy.fixture("donor").then((donor) => {
      cy.intercept("GET", "/donors/*/", {
        statusCode: 200,
        body: {
          status: 200,
          content: donor,
        },
      }).as("getDonor");
    });

    cy.fixture("organizations").then((orgs) => {
      cy.intercept("GET", "/organizations/active", {
        statusCode: 200,
        body: {
          status: 200,
          content: orgs,
        },
      }).as("getOrganizations");
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

    cy.fixture("tax-reports/ea-funds").then((reports) => {
      cy.intercept("GET", "donors/*/taxreports", {
        statusCode: 200,
        body: {
          status: 200,
          content: reports,
        },
      }).as("getReports");
    });

    cy.fixture("donations")
      .then((donations) => {
        cy.intercept("GET", "/donors/*/donations", {
          statusCode: 200,
          body: {
            status: 200,
            content: donations,
          },
        });
      })
      .as("getDonations");

    cy.fixture("kids_donations")
      .then((kids) => {
        cy.intercept("GET", "/donors/*/distributions/*", {
          statusCode: 200,
          body: {
            status: 200,
            content: kids,
          },
        });
      })
      .as("getDistribution");

    cy.visit(`/min-side/skatt/aarsoppgaver`);

    /**
     * Wait for initial data load
     */
    cy.wait(
      ["@getDonor", "@getOrganizations", "@getReports", "@getDonations", "@getDistribution"],
      {
        timeout: 30000,
      },
    );
  });

  it("should contain info icon with tooltip in unit table title", () => {
    cy.get("[data-cy=yearly-tax-report-non-deductable-table]")
      .first()
      .find("thead")
      .find("[data-cy=tax-report-tooltip-icon]")
      .should("be.visible");

    cy.get("[data-cy=lightbox]").should("not.exist");

    cy.get("[data-cy=yearly-tax-report-non-deductable-table]")
      .first()
      .find("thead")
      .find("[data-cy=tax-report-tooltip-icon]")
      .click();

    cy.get("[data-cy=lightbox]").should("be.visible");
  });

  it("should display the correct information in the non deductable donations unit table", () => {
    cy.get("[data-cy=yearly-tax-report-non-deductable-table]")
      .first()
      .find("tbody tr")
      .should("have.length", 1);

    cy.get("[data-cy=yearly-tax-report-non-deductable-table]")
      .first()
      .find("tbody tr")
      .first()
      .should("contain.text", "Stiftelsen Effekt");
    cy.get("[data-cy=yearly-tax-report-non-deductable-table]")
      .first()
      .find("tbody tr")
      .first()
      .should("contain.text", "20 000");
  });
});
