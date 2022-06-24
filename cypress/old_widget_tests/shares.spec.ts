// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../support/index.d.ts" />
import "cypress-react-selector";
import { API_URL } from "../../src/config/api";
import { ShareType } from "../../src/types/Enums";

context("Window", () => {
  before(() => {
    cy.intercept("GET", `${API_URL}/organizations/active`).as(
      "getOrganizations"
    );

    cy.visit("http://localhost:3000");
    cy.waitForReact();

    cy.wait("@getOrganizations")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
  });

  it("End-2-End shared donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.intercept("POST", `${API_URL}/donations/register`).as(
      "registerDonation"
    );

    cy.pickMethod("bank");
    cy.pickAnonymous();
    cy.get("button").click();
    cy.wait(500);

    cy.react("TextInput", { props: { name: "sum" } }).type(
      randomSum.toString()
    );

    // DonationPane
    cy.react("RichSelectOption", {
      props: { value: ShareType.CUSTOM },
    }).click();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.get("@getOrganizations").then((req: any) => {
      const organizations = req.response.body.content;
      for (let i = 0; i < 4; i += 1) {
        cy.get(`input[label="${organizations[i].name}"]`).type("25", {
          force: true,
        });
      }
    });
    cy.get("button").click();

    // ReferralPane
    cy.wait("@registerDonation")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
    cy.wait(500);
    cy.get("[data-cy=nextReferral]").click();

    // PaymentPane
    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });
});
