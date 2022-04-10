describe("Details page", () => {
  before(() => {
    cy.login();

    cy.fixture('donor').then((donor) => {
      cy.intercept("GET", "/donors/27/", { 
        statusCode: 200,
        body: {
          status: 200,
          content: donor
        }
      })
    })

    cy.fixture('donations').then((donations) => {
      cy.intercept("GET", "/donors/27/donations", { 
        statusCode: 200,
        body: {
          status: 200,
          content: donations
        }
      })
    })

    cy.fixture('aggregated').then((aggregateddonations) => {
      cy.intercept("GET", "/donors/27/donations/aggregated", { 
        statusCode: 200,
        body: {
          status: 200,
          content: aggregateddonations
        }
      })
    })

    cy.fixture('kids_donations').then((kids) => {
      cy.intercept("GET", "/donors/27/distributions/*", { 
        statusCode: 200,
        body: {
          status: 200,
          content: kids
        }
      })
    })

    cy.visit(`/profile/`);
    cy.get("[data-cy=navbar]", { timeout: 15000 }).should("exist");
  });

  it("Should display a menu for selection donation year", () => {
    cy.get("[data-cy=year-menu]").should("exist")
    const firstYear = 2018
    for (let i = firstYear; i <= new Date().getFullYear(); i++) {
      cy.get("[data-cy=year-menu]").should("contain.text", i)
    }
    cy.get("[data-cy=year-menu]").should("contain.text", "Totalt")
  })

  it("Should display a donation distribution graph", () => {
    cy.get("[data-cy=aggregated-donations-distribution-graph]").should("exist")
    cy.get("[data-cy=aggregated-donations-distribution-graph-bar]").first().should("contain.text", "Against Malaria Foundation")
    cy.get("[data-cy=aggregated-donations-distribution-graph-bar]").first().should("contain.text", "623 060 kr")
  })

  it("Should display donation lists for all years on the total page", () => {
    const firstYear = 2018
    for (let i = firstYear; i <= new Date().getFullYear(); i++) {
      cy.get("[data-cy=generic-list-header]").should("contain.text", i)
    }
  })

  it("Should have date, sum, payment method and KID in donations list", () => {
    cy.get("[data-cy=generic-list-table]").first().find("tbody").first().should("contain.text", "22.04 2022")
    cy.get("[data-cy=generic-list-table]").first().find("tbody").first().should("contain.text", "40 000kr")
    cy.get("[data-cy=generic-list-table]").first().find("tbody").first().should("contain.text", "Bank u/KID")
    cy.get("[data-cy=generic-list-table]").first().find("tbody").first().should("contain.text", "32245953")
  })

  it("Should display a total distribution table", () => {
    cy.get("[data-cy=aggregated-distribution-table] table tr").should("have.length", 9)
    cy.get("[data-cy=aggregated-distribution-table] table tr").first().should("contain.text", "Against Malaria Foundation")
    cy.get("[data-cy=aggregated-distribution-table] table tr").first().should("contain.text", "623 060 kr")
    cy.get("[data-cy=aggregated-distribution-table] table tr").last().should("contain.text", "The End Fund")
    cy.get("[data-cy=aggregated-distribution-table] table tr").last().should("contain.text", "5 kr")
  })

  it("Should display a donation sum field", () => {
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "Siden 2018")
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "1 155 581 kr")
  })

  it("Should be possible to filter by year", () => {
    cy.get("[data-cy=year-menu]").find("ul").contains("li", /2021/i).click()
    cy.get("[data-cy=aggregated-distribution-table] table tr").should("have.length", 4)
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "I 2021")
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "108 574 kr")
  })

  it("Should only display the selected year in donation list", () => {
    cy.get("[data-cy=generic-list-header]").should("have.length", 1)
    cy.get("[data-cy=generic-list-header]").should("contain.text", "2021")
  })

  it("Should be possible to expand a donation to see actions and distribution graph", () => {
    // Expand the first donation
    cy.get("[data-cy=generic-list-table]").first()
      .find("tbody").first()
      .find("[data-cy=generic-list-row-expand]")
      .click()
    
    // Check that the graph is visible
    cy.get("[data-cy=generic-list-table]").first()
      .find("tbody").first()
      .find("[data-cy=donation-distribution-graph]")
      .should("be.visible")
    
    // Check that the graph information is correct
    cy.get("[data-cy=generic-list-table]").first()
      .find("tbody").first()
      .find("[data-cy=donation-distribution-graph] [data-cy=donation-distribution-graph-bar]")
      .should("contain.text", "Against Malaria Foundation")

    cy.get("[data-cy=generic-list-table]").first()
      .find("tbody").first()
      .find("[data-cy=donation-distribution-graph] [data-cy=donation-distribution-graph-bar]")
      .should("contain.text", "10 000 kr")
  })

  it("Should show empty placeholder for years with no donations", () => {
    // Go to 2018, which has no donations
    cy.get("[data-cy=year-menu]").find("ul").contains("li", /2018/i).click()

    // Check that the summation is correct
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "I 2018")
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "0 kr")

    cy.get("[data-cy=generic-list]").first().should("contain.text", "Vi har ikke registrert noen donasjoner fra deg")
    cy.get("[data-cy=generic-list]").first().should("contain.text", "Ta kontakt")
  })
});
