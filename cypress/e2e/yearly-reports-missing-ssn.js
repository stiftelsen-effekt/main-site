describe("Tax reports page missing ssn", () => {
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

    cy.fixture("cause_areas").then((causeAreas) => {
      cy.intercept("GET", "/causeareas/active", {
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

    cy.fixture("tax-reports/missing-ssn").then((reports) => {
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
    cy.wait(["@getDonor", "@getCauseAreas", "@getReports", "@getDonations", "@getDistribution"], {
      timeout: 30000,
    });
  });

  it("should should show warning if missing ssn", () => {
    cy.get("[data-cy=info-box]").should("be.visible");
    cy.get("[data-cy=info-box]").should("contain.text", "mangler");
  });

  it("should display row with donations missing tax units", () => {
    cy.get("[data-cy=generic-list-table]").first().find(">tbody").should("have.length", 3);

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "Manglet enhet");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "-");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "-");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "5 000 kr");
  });

  it("should contain info icon with tooltip", () => {
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("[data-cy=tooltip-icon]")
      .should("be.visible");

    cy.get("[data-cy=lightbox]").should("not.exist");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("[data-cy=tooltip-icon]")
      .click();

    cy.get("[data-cy=lightbox]").should("be.visible");
  });

  it("should be able to expant missing tax unit in unit table", () => {
    cy.get("[data-cy=generic-list-table]").first().find(">tbody").last().click();

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("tbody")
      .first()
      .should("be.visible");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("tbody")
      .first()
      .find("tr")
      .first()
      .should("contain", "Gitt gjennom Gi Effektivt");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("tbody")
      .first()
      .find("tr")
      .first()
      .should("contain", "1 000 kr");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("tbody")
      .first()
      .find("tr")
      .last()
      .should("contain", "Gitt gjennom EAN Giverportal");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("tbody")
      .first()
      .find("tr")
      .last()
      .should("contain", "4 000 kr");
  });
});
