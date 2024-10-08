describe("Navigation", () => {
  beforeEach(() => {
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

    cy.visit(`/rikdomskalkulator`);

    cy.wait(["@getCauseAreas", "@getReferrals"]);
  });

  it("Should initialize correctly", () => {
    cy.get("[data-cy=wealthcalculator-container]").should("be.visible");

    cy.get("[data-cy=wealthcalculator-income-input]").find("input").should("be.empty");

    cy.get("[data-cy=wealthcalculator-children-input]").should("contain.text", "Ingen barn");
    cy.get("[data-cy=wealthcalculator-adults-input]").should("contain.text", "Én voksen");

    cy.get("[data-cy=wealthcalculator-graph]").should("not.contain.text", "Om du donerer");

    cy.get("[data-cy=wealthcalculator-explanation]").should("not.be.visible");
  });

  it("Should update graph when income is changed", () => {
    cy.get("[data-cy=wealthcalculator-income-input]").find("input").type("572000");

    // Weird symbols are a hack to get bold percentage text
    // We have some symbols in the font set to semibold numbers
    cy.get("[data-cy=wealthcalculator-graph]").should(
      "contain.text",
      "Om du donerer 10% avinntekten din er du blantde ϦϬϣϭ rikeste i verden.",
    );
    cy.get("[data-cy=wealthcalculator-graph]").should(
      "contain.text",
      "Du er i dag blant de ϥϬϤϭrikeste i verden.",
    );
  });

  it("Should update graph when children is changed", () => {
    cy.get("[data-cy=wealthcalculator-income-input]").find("input").type("572000");

    cy.get("[data-cy=wealthcalculator-children-input]").click();
    cy.get("[data-cy=wealthcalculator-children-input]").find("[data-cy=dropdown-option-2]").click();

    cy.get("[data-cy=wealthcalculator-graph]").should(
      "contain.text",
      "Om du donerer 10% avinntekten din er du blantde ϪϬϩϭ rikeste i verden.",
    );
  });

  it("Should update graph when adults is changed", () => {
    cy.get("[data-cy=wealthcalculator-income-input]").find("input").type("572000");

    cy.get("[data-cy=wealthcalculator-adults-input]").click();
    cy.get("[data-cy=wealthcalculator-adults-input]").find("[data-cy=dropdown-option-1]").click();

    cy.get("[data-cy=wealthcalculator-graph]").should(
      "contain.text",
      "Om du donerer 10% avinntekten din er du blantde",
    );
  });

  it("Should update graph when percentage is changed", () => {
    cy.get("[data-cy=wealthcalculator-income-input]").find("input").type("572000");

    cy.get("[data-cy=wealthcalculator-donation-percentage-input]").clear().type("20");

    cy.get("[data-cy=wealthcalculator-graph]").should(
      "contain.text",
      "Om du donerer 20% avinntekten din er du blantde ϧϭ rikeste i verden.",
    );
    cy.get("[data-cy=wealthcalculator-graph]").should("contain.text", "Du er i dag blant de ");
  });

  it("Should allow users to slide the percentage slider", () => {
    cy.get("[data-cy=wealthcalculator-income-input]").find("input").type("572000");

    cy.get("[data-cy=slider-handle]").trigger("mousedown", { which: 1 });
    cy.get("[data-cy=slider-handle]").trigger("mousemove", { clientX: 250 });
    cy.get("[data-cy=slider-handle]").trigger("mouseup");

    cy.get("[data-cy=wealthcalculator-graph]").should(
      "contain.text",
      "Om du donerer 25% avinntekten din er du blantde ϧϬϨϭ rikeste i verden.",
    );
    cy.get("[data-cy=wealthcalculator-graph]").should("contain.text", "Du er i dag blant de ");
    cy.get("[data-cy=wealthcalculator-donation-percentage-input]").should("have.value", "25");
  });

  it("Should allow users to tap the slider track to change percentage", () => {
    cy.get("[data-cy=wealthcalculator-income-input]").find("input").type("572000");

    cy.get("[data-cy=slider-track]").click(250, 0);

    cy.get("[data-cy=wealthcalculator-graph]").should(
      "contain.text",
      "Om du donerer 39% avinntekten din er du blantde",
    );
    cy.get("[data-cy=wealthcalculator-graph]").should("contain.text", "Du er i dag blant de ");
    cy.get("[data-cy=wealthcalculator-donation-percentage-input]").should("have.value", "39");
  });

  it("Should be possible to expand and collapse the explanation", () => {
    cy.get("[data-cy=wealthcalculator-explanation]").should("not.be.visible");

    cy.get("[data-cy=wealthcalculator-explanation-toggle]").click();

    cy.get("[data-cy=wealthcalculator-explanation]").should("be.visible");

    cy.get("[data-cy=wealthcalculator-explanation-toggle]").click();

    cy.get("[data-cy=wealthcalculator-explanation]").should("not.be.visible");
  });

  it("Should be possible to click the create agreement button to open the widget", () => {
    cy.get("[data-cy=widget-pane]").should("not.be.visible");

    cy.get("[data-cy=wealthcalculator-income-input]").find("input").type("572000");

    cy.get("[data-cy=wealthcalculator-impact-create-agreement-button]").click();

    cy.get("[data-cy=widget-pane]").should("be.visible");
  });
});
