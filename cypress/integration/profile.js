describe("Details page", () => {
  before(() => {
    cy.login();
    cy.visit(`/profile/details/`);
    cy.get("[data-cy=navbar]", { timeout: 15000 }).should("exist");
  });

  it("Should display correct profile information", () => {
    cy.get("#email").should("have.value", Cypress.env("AUTH_USERNAME"));
  });

  it("Should update profile information correctly", () => {
    const newName = "Keef";
    cy.get("#name").clear().type(newName);
    cy.get('button[role="submit"]').click();
    cy.get(".Toastify").contains("Lagret");
    cy.get("h1").should("contain.text", newName);
    cy.reload();
    cy.get("h1").should("contain.text", newName);
    cy.get("#name").should("have.value", newName);
  });

  it("Should fail with invalid info", () => {
    cy.get("#ssn").clear().type("123");
    cy.get('button[role="submit"]').click();
    cy.get(".Toastify").contains("Noe gikk galt");
  })
});
