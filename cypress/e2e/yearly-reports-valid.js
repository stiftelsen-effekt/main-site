describe("Tax reports page valid", () => {
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

    cy.fixture("tax-reports/valid").then((reports) => {
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

  it("should display correct information in unit table", () => {
    cy.get("[data-cy=generic-list-header-title]").should("contain.text", "2022");

    cy.get("[data-cy=generic-list-table]").first().find(">tbody").should("have.length", 2);

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .should("contain.text", "Elise Egg");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .should("contain.text", "24029358224");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .should("contain.text", "50 000 kr");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .should("contain.text", "25 000 kr");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "Elise Høne AS");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "928457234");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "20 000 kr");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .should("contain.text", "20 000 kr");
  });

  it("should be possible to expand units in unit table", () => {
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .find("tbody")
      .first()
      .should("not.be.visible");

    cy.get("[data-cy=generic-list-table]").first().find(">tbody").first().click();

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .find("tbody")
      .first()
      .should("be.visible");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .find("tbody")
      .first()
      .should("contain", "Gitt gjennom Gi Effektivt");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .first()
      .find("tbody")
      .first()
      .should("contain", "50 000 kr");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find(">tbody")
      .last()
      .find("tbody")
      .first()
      .should("not.be.visible");

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
      .should("contain", "10 000 kr");

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
      .should("contain", "10 000 kr");
  });

  it("should display correct infomration in large summation number", () => {
    cy.get("[data-cy=yearly-tax-report-sum]").should("contain.text", "70 000");
  });

  it("should display correct information in summation table", () => {
    cy.get("[data-cy=yearly-tax-report-summary-table]")
      .first()
      .find("tbody tr")
      .should("have.length", 3);

    cy.get("[data-cy=yearly-tax-report-summary-table]")
      .first()
      .find("tbody tr")
      .first()
      .should("contain.text", "Gitt gjennom Gi Effektivt");
    cy.get("[data-cy=yearly-tax-report-summary-table]")
      .first()
      .find("tbody tr")
      .first()
      .should("contain.text", "60 000 kr");

    cy.get("[data-cy=yearly-tax-report-summary-table]")
      .first()
      .find("tbody tr")
      .eq(1)
      .should("contain.text", "Gitt gjennom EAN Giverportal");
    cy.get("[data-cy=yearly-tax-report-summary-table]")
      .first()
      .find("tbody tr")
      .eq(1)
      .should("contain.text", "10 000 kr");

    cy.get("[data-cy=yearly-tax-report-summary-table]")
      .first()
      .find("tbody tr")
      .last()
      .should("contain.text", "Totalt");
    cy.get("[data-cy=yearly-tax-report-summary-table]")
      .first()
      .find("tbody tr")
      .last()
      .should("contain.text", "70 000");
  });

  /*
  it("should show crypto and stiftelsen effekt donations in separate table"),

  it("should display custom message if no data"), 
  
  
  */
});
