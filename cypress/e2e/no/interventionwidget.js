describe("InterventionWidget", () => {
  beforeEach(() => {
    cy.fixture("impact_evaluations")
      .then((impactEvaluations) => {
        cy.intercept("GET", "https://impact.gieffektivt.no/api/evaluations*", {
          statusCode: 200,
          body: {
            evaluations: impactEvaluations,
          },
        });
      })
      .as("getImpactEvaluations");

    cy.visit({
      url: "/",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });
  });

  it("Should by default show more than 0 intervention output", () => {
    cy.wait("@getImpactEvaluations").its("response.statusCode").should("be.oneOf", [200, 304]);

    cy.get("[data-cy=impact-input]").scrollIntoView();
    cy.get("[data-cy=impact-output]").invoke("text").then(parseFloat).should("be.gt", 0);
    cy.get("[data-cy=A-vitamin-button]").click();
    cy.get("[data-cy=impact-output]").invoke("text").then(parseFloat).should("be.gt", 0);
    cy.get("[data-cy=Vaksinering-button]").click();
    cy.get("[data-cy=impact-output]").invoke("text").then(parseFloat).should("be.gt", 0);
  });

  it("0 NOK should give 0 interventions output", () => {
    cy.get("[data-cy=impact-input]").scrollIntoView();
    cy.get("[data-cy=impact-input]").clear();
    cy.get("[data-cy=impact-output]").invoke("text").then(parseFloat).should("be.equal", 0);
    cy.get("[data-cy=A-vitamin-button]").click();
    cy.get("[data-cy=impact-output]").invoke("text").then(parseFloat).should("be.equal", 0);
    cy.get("[data-cy=Myggnett-button]").click();
    cy.get("[data-cy=impact-output]").invoke("text").then(parseFloat).should("be.equal", 0);
  });
});
