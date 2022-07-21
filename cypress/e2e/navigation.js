describe("Navigation tests", () => {
    before(() => {
        cy.visit(`/`);
    });

    it("Click articles button", () => {
        cy.get("[data-cy=articles-link]").within(() => {
            cy.get("a").click({ force: true });
        })
        cy.url().should('include', '/articles')

        cy.get("[data-cy=articles-link]").within(() => {
            cy.get("a").click({ force: true });
        })
        cy.url().should('include', '/about')
    });
});