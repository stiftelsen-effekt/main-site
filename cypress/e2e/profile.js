describe("Profile page", () => {
  beforeEach(() => {
    cy.login();

    cy.fixture("donor")
      .then((donor) => {
        cy.intercept("GET", "/donors/14649/", {
          statusCode: 200,
          body: {
            status: 200,
            content: donor,
          },
        });
      })
      .as("getDonor");

    cy.visit(`/profile/details/`);

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

  it("Should fail with invalid info", () => {
    cy.intercept("PUT", "/donors/*/", {
      statusCode: 400,
      body: {
        status: 400,
        content: "The SSN is invalid, it must be 11 or 9 numbers in one word ",
      },
    });

    cy.get("#ssn").clear().type("123");
    cy.get('button[role="submit"]').click();
    cy.get(".Toastify").contains("Noe gikk galt");
  });
});
