describe("Donations page", () => {
  beforeEach(() => {
    cy.login();

    cy.fixture("donor")
      .then((donor) => {
        cy.intercept("GET", "/donors/*/", {
          statusCode: 200,
          body: {
            status: 200,
            content: donor,
          },
        });
      })
      .as("getDonor");

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

    cy.fixture("aggregated")
      .then((aggregateddonations) => {
        cy.intercept("GET", "/donors/*/donations/aggregated", {
          statusCode: 200,
          body: {
            status: 200,
            content: aggregateddonations,
          },
        });
      })
      .as("getAggregated");

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

    cy.fixture("organizations").then((orgs) => {
      cy.intercept("GET", "/organizations/all", {
        statusCode: 200,
        body: {
          status: 200,
          content: orgs,
        },
      }).as("getOrganizations");
    });

    cy.fixture("taxunits").then((units) => {
      cy.intercept("GET", "/donors/*/taxunits/", {
        statusCode: 200,
        body: {
          status: 200,
          content: units,
        },
      }).as("getTaxUnits");
    });

    cy.fixture(`evaluations/evaluations.json`)
      .then((evaluations) => {
        cy.intercept(
          "https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=*&currency=NOK&language=NO&donation_year=*&donation_month=*",
          (req) => {
            const [, abbriv, year, month] = req.url.match(
              /.*abbreviation=(.*)\&currency.*year=(\d{4}).*month=(\d{1,2})/,
            );
            const filename = `${year}-${month}-${abbriv}`;
            if (evaluations[filename]) {
              req.reply(evaluations[filename]);
            } else {
              req.reply({ evaluations: [] });
            }
          },
        ).as("getEvaluations");
      })
      .as("evaluationFixture");

    cy.fixture("grants")
      .then((grants) => {
        cy.intercept(
          "GET",
          "https://impact.gieffektivt.no/api/max_impact_fund_grants?currency=NOK&language=NO&*",
          {
            statusCode: 200,
            body: grants,
          },
        ).as("getGrants");
      })
      .as("grantsFixture");

    cy.visit({
      url: `/min-side/`,
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });

    /**
     * Wait for initial data load
     */
    cy.wait(
      ["@getDonor", "@getDonations", "@getAggregated", "@getDistribution", "@getCauseAreas"],
      {
        timeout: 30000,
      },
    );
  });

  it("Should display a menu for selection donation year", () => {
    cy.get("[data-cy=year-menu]").should("exist");
    const firstYear = 2018;
    for (let i = firstYear; i <= new Date().getFullYear(); i++) {
      cy.get("[data-cy=year-menu]").should("contain.text", i);
    }
    cy.get("[data-cy=year-menu]").should("contain.text", "Totalt");
  });

  it("Should display a donation distribution graph", () => {
    cy.get("[data-cy=aggregated-donations-distribution-graph]").should("exist");
    cy.get("[data-cy=aggregated-donations-distribution-graph-bar]")
      .first()
      .should("contain.text", "Against Malaria Foundation");
    cy.get("[data-cy=aggregated-donations-distribution-graph-bar]")
      .first()
      .should("contain.text", "623\u00A0060 kr");
  });

  it("Should display donation lists for all years on the total page", () => {
    const firstYear = 2018;
    for (let i = firstYear; i <= new Date().getFullYear(); i++) {
      cy.get("[data-cy=generic-list-header]").should("contain.text", i);
    }
  });

  it("Should have date, sum, payment method and KID in donations list", () => {
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .should("contain.text", "22.04");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .should("contain.text", "40\u00A0000 kr");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .should("contain.text", "Bank");
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .should("contain.text", "32245953");
  });

  it("Should display a donation aggregate impact table", () => {
    cy.get("[data-cy=donation-aggregate-impact-distribution-row]", {
      timeout: 15000,
    }).should("have.length", 6);
    cy.get("[data-cy=donation-aggregate-impact-distribution-row]")
      .first()
      .should("contain.text", "118");
    cy.get("[data-cy=donation-aggregate-impact-distribution-row]")
      .first()
      .should("contain.text", "A-vitamintilskudd");

    cy.get("[data-cy=donation-aggregate-impact-distribution-row]")
      .last()
      .should("contain.text", "12");
    cy.get("[data-cy=donation-aggregate-impact-distribution-row]")
      .last()
      .should("contain.text", "vaksinasjoner");
  });

  it("Should display a donation sum field", () => {
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "Siden 2018");
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "1\u00A0155\u00A0581 kr");
  });

  it("Should be possible to filter by year", () => {
    cy.get("[data-cy=year-menu]").find("ul").contains("li", /2021/i).click();

    cy.get("[data-cy=generic-list-header]").should("have.length", 1, { timeout: 5000 });

    cy.get("[data-cy=donation-aggregate-impact-distribution-row]", {
      timeout: 15000,
    }).should("have.length", 5);
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "I 2021");
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "108\u00A0574 kr");
  });

  it("Should only display the selected year in donation list", () => {
    cy.get("[data-cy=year-menu]").find("ul").contains("li", /2021/i).click();

    cy.get("[data-cy=generic-list-header]").should("have.length", 1, { timeout: 5000 });
    cy.get("[data-cy=generic-list-header]").should("contain.text", "2021");
  });

  it("Should be possible to expand a donation to see actions and donation impact", () => {
    cy.get("[data-cy=year-menu]").find("ul").contains("li", /2021/i).click();

    // Wait for the list to filter
    cy.get("[data-cy=generic-list-header]").should("have.length", 1, { timeout: 5000 });

    // Expand the first donation
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=generic-list-row-expand]")
      .first()
      .click();

    // Check that the impact list is visible
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]", { timeout: 15000 })
      .should("be.visible");

    // Check that the graph information is correct

    // 3 evaluations
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]")
      .find("[data-cy=donation-impact-list-item-overview]")
      .should("have.length", 3);

    // check that the three evaluation values are correct

    // check amount to organization
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]")
      .find("[data-cy=donation-impact-list-item-overview]")
      .eq(0)
      .should("contain.text", "500 kr til Against Malaria Foundation");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]")
      .find("[data-cy=donation-impact-list-item-overview]")
      .eq(1)
      .should("contain.text", "200 kr til GiveDirectly");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]")
      .find("[data-cy=donation-impact-list-item-overview]")
      .eq(2)
      .should("contain.text", "300 kr til New Incentives");

    // check output values
    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]")
      .find("[data-cy=donation-impact-list-item-overview]")
      .eq(0)
      .find("[data-cy=donation-impact-list-item-output]")
      .first()
      .should("contain.text", "12,0");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]")
      .find("[data-cy=donation-impact-list-item-overview]")
      .eq(1)
      .find("[data-cy=donation-impact-list-item-output]")
      .first()
      .should("contain.text", "20,0");

    cy.get("[data-cy=generic-list-table]")
      .first()
      .find("tbody")
      .first()
      .find("[data-cy=donation-impact-list]")
      .find("[data-cy=donation-impact-list-item-overview]")
      .eq(2)
      .find("[data-cy=donation-impact-list-item-output]")
      .first()
      .should("contain.text", "0,2");
  });

  it("Should show empty placeholder for years with no donations", () => {
    // Go to 2018, which has no donations
    cy.get("[data-cy=year-menu]").find("ul").contains("li", /2018/i).click();

    // Check that the summation is correct
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "I 2018");
    cy.get("[data-cy=aggregated-donation-totals]").should("contain.text", "0 kr");

    cy.get("[data-cy=generic-list]")
      .first()
      .should("contain.text", "Vi har ikke registrert noen donasjoner fra deg");
    cy.get("[data-cy=generic-list]").first().should("contain.text", "Ta kontakt");
  });
});
