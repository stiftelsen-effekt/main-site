describe("Tax reports page no data", () => {
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

    cy.fixture("tax-reports/empty").then((reports) => {
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

  it("should display custom message if no data", () => {
    cy.get("[data-cy=generic-list-header-title]").should("contain.text", "2022");
    cy.get("[data-cy=generic-list-empty-placeholder]").should(
      "contain.text",
      "Vi har ikke registrert noen donasjoner på deg i 2022.",
    );
  });

  /*
  it("should show crypto and stiftelsen effekt donations in separate table"),
  
  
  */
});
