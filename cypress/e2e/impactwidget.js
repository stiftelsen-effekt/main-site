describe("ImpactWidget", () => {
    before(() => {
        cy.visit(`/`)
    });

    it("Should by default show more than 0 intervention output", () => {
        // Impact widget tests
        cy.get('[data-cy=impact-output]').invoke('text').then(parseFloat).should('be.gt', 0)
        cy.get('[data-cy=A-vitamin-button]').click()
        cy.get('[data-cy=impact-output]').invoke('text').then(parseFloat).should('be.gt', 0)
        cy.get('[data-cy=Ormekur-button]').click()
        cy.get('[data-cy=impact-output]').invoke('text').then(parseFloat).should('be.gt', 0)
    });

    it("0 NOK should give 0 interventions output", () => {
        cy.get('[data-cy=impact-input]').clear()
        cy.get('[data-cy=impact-output]').invoke('text').then(parseFloat).should('be.equal', 0)
        cy.get('[data-cy=A-vitamin-button]').click()
        cy.get('[data-cy=impact-output]').invoke('text').then(parseFloat).should('be.equal', 0)
        cy.get('[data-cy=Myggnett-button]').click()
        cy.get('[data-cy=impact-output]').invoke('text').then(parseFloat).should('be.equal', 0)
    });
});