describe("Profile page", () => {
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

    cy.visit({
      url: `/min-side/profil/`,
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });

    /**
     * Wait for initial data load
     */
    cy.wait(["@getDonor"], { timeout: 30000 });
    cy.get("[data-cy=navbar]", { timeout: 30000 }).should("exist");
  });

  it("Should display correct profile information", () => {
    cy.get("#email").should("have.value", Cypress.env("AUTH_USERNAME"));
  });

  it("Should update profile information correctly", () => {
    cy.intercept("PUT", "/donors/*/", {
      statusCode: 200,
      body: {
        status: 200,
        content: true,
      },
    });

    const newName = "Keef";
    cy.get("#name").clear().type(newName);
    cy.get('button[role="submit"]').click();
    cy.get(".Toastify").contains("Lagret");
    cy.get("h3").should("contain.text", newName);

    cy.fixture("donor").then((donor) => {
      cy.intercept("GET", "/donors/*/", {
        statusCode: 200,
        body: {
          status: 200,
          content: {
            ...donor,
            name: newName,
          },
        },
      });
    });
    cy.reload();
    cy.get("h3").should("contain.text", newName);
    cy.get("#name").should("have.value", newName);
  });
});
