describe("Navigation", () => {
    before(() => {
        cy.visit(`/`)
    });

    it("Tests if CookieBanner works correctly", () => {
        // CookieBanner should be visible
        cy.get('[data-cy=cookiebanner-container]')
            .invoke('css', 'display')
            .should('equal', 'flex')

        cy.get("[data-cy=accept-cookies]").click()

        // CookieBanner should be hidden
        cy.get('[data-cy=cookiebanner-container]')
            .invoke('css', 'display')
            .should('equal', 'none')

        cy.get("[data-cy=Maks-effekt-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/maks-effekt')

        // CookieBanner should still be hidden after changing page
        cy.get('[data-cy=cookiebanner-container]')
            .invoke('css', 'display')
            .should('equal', 'none')

        cy.reload()

        // CookieBanner should still be hidden after reloading
        cy.get('[data-cy=cookiebanner-container]')
            .invoke('css', 'display')
            .should('equal', 'none')
    });

    it("Tests if NavBar and scrolling works correctly", () => {
        // NavBar should be visible
        cy.get('[data-cy=header]')
            .invoke('css', 'transform')
            .should('equal', 'none')

        cy.scrollTo(0, 500)
        cy.wait(100)

        // Navbar should be hidden
        cy.get('[data-cy=header]')
            .invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 0, -89.3333)')

        cy.scrollTo(0, 0)
        cy.wait(100)

        // NavBar should be visible
        cy.get('[data-cy=header]')
            .invoke('css', 'transform')
            .should('equal', 'none')
        
        cy.scrollTo(0, 500)
        cy.wait(100)

        // Navbar should be hidden
        cy.get('[data-cy=header]')
            .invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 0, -89.3333)')

        cy.get('[data-cy=navigate-to-top]').click()
        cy.wait(100)
        cy.window().its('scrollY').should('equal', 0)

        // NavBar should be visible
        cy.get('[data-cy=header]')
            .invoke('css', 'transform')
            .should('equal', 'none')
    });

    it("Tests buttons for opening and closing Widget", () => {
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
    
        cy.get("[data-cy=gi-button]").click()

        // Widget should be open
        cy.get('[data-cy=widget-pane]')
            .invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 0, 0)')

        cy.get("[data-cy=close-widget]").click()

        // Widget should be closed
        cy.get('[data-cy=widget-pane]')
            .invoke('css', 'transform')
            .should('equal', 'matrix(1, 0, 0, 1, 762, 0)')
    })

    it("Tests links in the NavBar", () => {
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
        cy.url().should('include', '/smart-fordeling')

        cy.get("[data-cy=Full-oversikt-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/full-oversikt')

        cy.get("[data-cy=FAQ-link]").within(() => {
            cy.get("a").click({force: true})
        })
        cy.url().should('include', '/support')
    });

    it("Tests links in the Footer", () => {
        cy.get("[data-cy=articles-link]").within(() => {
            cy.get("a").click({ force: true })
        })
        cy.url().should('include', '/articles')
    });

    it("Tests newsletter signup", () => {
        cy.get("[data-cy=newsletter-input]").type("test@gieffektivt.no")
        cy.get('[data-cy=newsletter-input]').should('have.value', 'test@gieffektivt.no')
        cy.get("[data-cy=newsletter-submit]").click()
    });
});