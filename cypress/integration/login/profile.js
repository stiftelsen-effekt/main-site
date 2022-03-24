describe("Login with Auth0", () => {
  beforeEach(() => {
    cy.login();
  });

  function compareName() {
    cy.get("#name")
      .invoke("val")
      .then((currentName) => {
        cy.get('h1[class="Profile_header__lcWeF"]').contains(currentName);
      });
  }

  it("Check that profile information is correct", () => {
    cy.get('a[href="/profile/details"]').click();
    compareName();
    cy.get("#email").should("have.value", Cypress.env("auth_username"));
  });

  it("Update profile information", () => {
    const newName = "Keef";
    cy.get('a[href="/profile/details"]').click();
    cy.get("#name").clear().type(newName);
    compareName();
    cy.get('button[role="submit"]').click();
    cy.reload();
    cy.get("#name").should("have.value", newName);
  });
});
