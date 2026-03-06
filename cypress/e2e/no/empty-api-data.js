describe("Profile and dashboard empty API data", () => {
  beforeEach(() => {
    cy.login();
  });

  it("shows the profile no data message when donor data is empty", () => {
    cy.intercept("GET", "/donors/*/", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getDonor");

    cy.visit({
      url: "/min-side/profil/",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });

    cy.wait("@getDonor", { timeout: 30000 });
    cy.contains("h1", "No data available").should("be.visible");
  });

  it("shows the donations empty placeholder when donations are empty", () => {
    cy.fixture("donor").then((donor) => {
      cy.intercept("GET", "/donors/*/", {
        statusCode: 200,
        body: {
          status: 200,
          content: donor,
        },
      }).as("getDonor");
    });

    cy.intercept("GET", "/donors/*/donations", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getDonations");

    cy.intercept("GET", "/donors/*/donations/aggregated", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getAggregated");

    cy.intercept("GET", "/donors/*/distributions/*", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getDistribution");

    cy.fixture("organizations").then((organizations) => {
      cy.intercept("GET", "/organizations/all", {
        statusCode: 200,
        body: {
          status: 200,
          content: organizations,
        },
      }).as("getOrganizations");
    });

    cy.intercept("GET", "/donors/*/taxunits/", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getTaxUnits");

    cy.visit({
      url: "/min-side/",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });

    cy.wait(["@getDonor", "@getDonations", "@getAggregated", "@getOrganizations", "@getTaxUnits"], {
      timeout: 30000,
    });
    cy.get("[data-cy=generic-list-empty-placeholder]").should(
      "contain.text",
      "Vi har ikke registrert noen donasjoner fra deg",
    );
    cy.get("@getDistribution.all").should("have.length", 0);
  });

  it("shows the agreements empty placeholders when agreements are empty arrays", () => {
    cy.fixture("donor").then((donor) => {
      cy.intercept("GET", "/donors/*/", {
        statusCode: 200,
        body: {
          status: 200,
          content: donor,
        },
      }).as("getDonor");
    });

    cy.intercept("GET", "/donors/*/recurring/vipps/", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getVipps");

    cy.intercept("GET", "/donors/*/recurring/avtalegiro/", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getAvtalegiro");

    cy.intercept("GET", "/donors/*/recurring/autogiro/", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getAutogiro");

    cy.intercept("GET", "/donors/*/distributions/*", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getDistribution");

    cy.intercept("GET", "/donors/*/taxunits/", {
      statusCode: 200,
      body: {
        status: 200,
        content: [],
      },
    }).as("getTaxUnits");

    cy.visit({
      url: "/min-side/avtaler/",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });

    cy.wait(["@getDonor", "@getVipps", "@getAvtalegiro", "@getAutogiro", "@getTaxUnits"], {
      timeout: 30000,
    });
    cy.get("[data-cy=agreement-list-empty-placeholder]").should("have.length", 2);
    cy.get("@getDistribution.all").should("have.length", 0);
  });
});
