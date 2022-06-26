import "cypress-react-selector";
import { API_URL } from "../../components/widget/config/api";

context("Window", () => {
    before(() => {
        cy.visit("http://localhost:3002");
        cy.waitForReact();
    });

    it("End-2-End single bank donation", () => {
        const randomSum = Math.floor(Math.random() * 1000) + 100;
        cy.get("[data-cy=gi-button]").click();
        cy.pickSingleDonation();
        cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
        cy.nextWidgetPane();

        cy.pickAnonymous();
        cy.get("[data-cy=bank-method]").click({ force: true });
        cy.wait(500);
        cy.intercept("POST", `${API_URL}/donations/register`).as(
            "registerDonation"
        );
        cy.nextWidgetPane();

        cy.wait("@registerDonation")
            .its("response.statusCode")
            .should("be.oneOf", [200, 304]);
        cy.wait(500);

        cy.get("[data-cy=kidNumber]").should(($kid) => {
            const kid = $kid.text();
            expect(kid).to.be.length(8);
        });
    });
});