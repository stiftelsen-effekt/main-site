describe("Navigation", () => {
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

    cy.fixture("inflation").then((inflation) => {
      cy.intercept(
        "GET",
        "https://corsproxy.io/?https://www.ssb.no/priser-og-prisindekser/konsumpriser/statistikk/konsumprisindeksen/_/service/mimir/kpi?startValue=100&startYear=2017&startMonth=01&endYear=*&endMonth=*&language=nb",
        {
          statusCode: 200,
          body: inflation,
        },
      ).as("getInflation");
    });

    cy.visit({
      url: "/",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });

    cy.wait(["@getCauseAreas", "@getReferrals"]);
  });

  it("Tests if CookieBanner works correctly", () => {
    // CookieBanner should be visible
    cy.get("[data-cy=cookiebanner-container]").should("be.visible");

    cy.get("[data-cy=accept-cookies]").click();

    // CookieBanner should be hidden
    cy.get("[data-cy=cookiebanner-container]").should("not.exist");

    cy.get("[data-cy=var-metode-link]").within(() => {
      cy.get("a").click({ force: true });
    });
    cy.url({ timeout: 10000 }).should("include", "/var-metode", { timeout: 10000 });

    // CookieBanner should still be hidden after changing page
    cy.get("[data-cy=cookiebanner-container]").should("not.exist");

    cy.reload();

    // CookieBanner should still be hidden after reloading
    cy.get("[data-cy=cookiebanner-container]").should("not.exist");
  });

  it("Tests if NavBar and scrolling works correctly", () => {
    // NavBar should be visible
    cy.get("[data-cy=header]").should("be.visible");

    cy.scrollTo(0, 500);
    cy.wait(100);

    // Navbar should be hidden
    cy.get("[data-cy=header]").should("not.be.visible");

    cy.scrollTo(0, 0);
    cy.wait(100);

    // NavBar should be visible
    cy.get("[data-cy=header]").should("be.visible");

    cy.scrollTo(0, 500);
    cy.wait(100);

    // Navbar should be hidden
    cy.get("[data-cy=header]").should("not.be.visible");

    cy.get("[data-cy=navigate-to-top]").click();
    cy.wait(100);
    cy.window().its("scrollY").should("equal", 0);

    // NavBar should be visible
    cy.get("[data-cy=header]").should("be.visible");
  });

  it("Tests buttons for opening and closing Widget from menu", () => {
    // Widget should be closed
    cy.get("[data-cy=widget-pane]").should("not.be.visible");

    // Click button in menu
    cy.get("[data-cy=send-donation-button]").click();

    // Wait for widget to open
    cy.wait(200);

    // Widget should be open
    cy.get("[data-cy=widget-pane]").should("be.visible");

    cy.get("[data-cy=close-widget]").click();

    // Widget should be closed
    cy.get("[data-cy=widget-pane]").should("not.be.visible");
  });

  it("Tests buttons for opening and closing Widget from floating button ", () => {
    // Widget should be closed
    cy.get("[data-cy=widget-pane]").should("not.be.visible");

    // Click floating button
    cy.get("[data-cy=gi-button]").click();

    // Wait for widget to open
    cy.wait(200);

    // Widget should be open
    cy.get("[data-cy=widget-pane]").should("be.visible");

    cy.get("[data-cy=close-widget]").click();

    // Widget should be closed
    cy.get("[data-cy=widget-pane]").should("not.be.visible");
  });

  it("Tests buttons for opening and closing Widget from hero CTA", () => {
    // Widget should be closed
    cy.get("[data-cy=widget-pane]").should("not.be.visible");

    // Click hero CTA
    cy.get("[data-cy=hero-cta-open-widget]").click();

    // Wait for widget to open
    cy.wait(200);

    // Widget should be open
    cy.get("[data-cy=widget-pane]").should("be.visible");

    cy.get("[data-cy=close-widget]").click();

    // Widget should be closed
    cy.get("[data-cy=widget-pane]").should("not.be.visible");
  });

  it("Tests links in the NavBar", () => {
    cy.get("[data-cy=artikler-link]").within(() => {
      cy.get("a").click({ force: true });
    });
    cy.url({ timeout: 10000 }).should("include", "/artikler", { timeout: 10000 });

    cy.get("[data-cy=om-oss-link]").within(() => {
      cy.get("a").click({ force: true });
    });
    cy.url({ timeout: 10000 }).should("include", "/om-oss", { timeout: 10000 });

    cy.get("[data-cy=topplista-link]").within(() => {
      cy.get("a").click({ force: true });
    });
    cy.url({ timeout: 10000 }).should("include", "/topplista", { timeout: 10000 });

    cy.get("[data-cy=var-metode-link]").within(() => {
      cy.get("a").click({ force: true });
    });
    cy.url({ timeout: 10000 }).should("include", "/var-metode", { timeout: 10000 });

    cy.get("[data-cy=smart-fordeling-link]").within(() => {
      cy.get("a").click({ force: true });
    });
    cy.url({ timeout: 10000 }).should("include", "/smart-fordeling", { timeout: 10000 });

    cy.get("[data-cy=ofte-stilte-sporsmal-link]").within(() => {
      cy.get("a").click({ force: true });
    });
    cy.url({ timeout: 10000 }).should("include", "/ofte-stilte-sporsmal", { timeout: 10000 });
  });

  it("Tests newsletter signup", () => {
    cy.get("[data-cy=newsletter-input]").scrollIntoView();
    cy.get("[data-cy=newsletter-input]").type("test@gieffektivt.no");
    cy.get("[data-cy=newsletter-input]").should("have.value", "test@gieffektivt.no");
    cy.get("[data-cy=newsletter-submit]").should("be.visible");
    cy.get("[data-cy=newsletter-submit]").should("not.be.disabled");
  });
});
