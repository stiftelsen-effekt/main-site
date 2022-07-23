describe("Navigation tests", () => {
    before(() => {
        cy.visit(`/`)
    });

    it("Click articles button", () => {
        cy.get("[data-cy=articles-link]").within(() => {
            cy.get("a").click({ force: true })
        })
        cy.url().should('include', '/articles')

        cy.get("[data-cy=about-link]").within(() => {
            cy.get("a").click({ force: true })
        })
        cy.url().should('include', '/about')

        cy.get("[data-cy=Topplista-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/organizations')

        cy.get("[data-cy=Kriterier-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/criteria')

        cy.get("[data-cy=Maks-effekt-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/maks-effekt')

        cy.get("[data-cy=Smart-fordeling-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/maks-effekt')

        cy.get("[data-cy=Full-oversikt-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/full-oversikt')
    
        cy.get("[data-cy=FAQ-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/support')
    
         // Widget should be closed
        cy.get('[data-cy=widget-pane]')
            .invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 762, 0)')
    
        cy.get("[data-cy=send-donation-button]").click()

         // Widget should be open
        cy.get('[data-cy=widget-pane]')
            .invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 0, 0)')

        cy.get("[data-cy=close-widget]").click()

        // Widget should be closed
        cy.get('[data-cy=widget-pane]')
            .invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 762, 0)')

        // CookieBanner should be visible
        cy.get('[data-cy=cookiebanner-container]')
            .invoke('css', 'display')
            .should('equal', 'flex')

        cy.get("[data-cy=accept-cookies]").click()

        // CookieBanner should be hidden
        cy.get('[data-cy=cookiebanner-container]')
            .invoke('css', 'display')
            .should('equal', 'none')
    });
});