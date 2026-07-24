import {
  setupWidgetTest,
  setupDonationIntercepts,
  fillDonorInfo,
  setCauseAreaAmount,
  setGlobalCut,
} from "./support/widget-setup.js";

// Renamed in spirit from "custom cut" (a fixed-kr-amount cut mode) to what the current
// widget actually implements: a percentage-only operations cut that can be toggled on/off
// per cause area (or globally, in multiple-cause-area mode). The fixed-amount entry mode
// this file used to test doesn't exist in the current widget - there is no
// custom-cut-input/global-custom-cut-input anywhere, unchecking the cut checkbox just
// disables the percentage input rather than switching to a different entry mode.
describe("Swedish Widget - Operations Cut Functionality", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  describe("Single Cause Area - Cut Toggle", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
    });

    it("Should have cut enabled by default with the configured percentage", () => {
      setCauseAreaAmount(1, 1000);

      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
      cy.get("[data-cy=percentage-cut-input-1]").should("have.value", "10");
    });

    it("Should disable the percentage input when cut is unchecked", () => {
      setCauseAreaAmount(1, 1000, false);

      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");
      cy.get("[data-cy=percentage-cut-input-1]").should("be.disabled");
    });

    it("Should allow changing the cut percentage", () => {
      setCauseAreaAmount(1, 1000);

      cy.get("[data-cy=percentage-cut-input-1]").clear().type("20");
      cy.get("[data-cy=percentage-cut-input-1]").should("have.value", "20");
    });

    it("Should send the correct operations split when submitting with the default cut", () => {
      setCauseAreaAmount(1, 1000);

      cy.get("[data-cy=next-button]").click();
      fillDonorInfo();
      setupDonationIntercepts();
      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;
        expect(body.amount).to.equal(1000);

        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(operations).to.exist;
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
      });
    });

    it("Should send no operations cause area when the cut is disabled", () => {
      setCauseAreaAmount(1, 1000, false);

      cy.get("[data-cy=next-button]").click();
      fillDonorInfo();
      setupDonationIntercepts();
      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;
        expect(body.amount).to.equal(1000);

        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(operations).to.not.exist;
      });
    });
  });

  describe("Multiple Cause Areas - Global Cut Toggle", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-multiple]").click();
    });

    it("Should have the global cut enabled by default with the configured percentage", () => {
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);

      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=global-percentage-cut-input]").should("have.value", "10");
    });

    it("Should disable the global percentage input when unchecked", () => {
      setCauseAreaAmount(1, 500, false);
      setCauseAreaAmount(2, 300, false);

      cy.get("[data-cy=global-cut-checkbox]").should("not.be.checked");
      cy.get("[data-cy=global-percentage-cut-input]").should("be.disabled");
    });

    it("Should send the correct proportional operations split for multiple cause areas", () => {
      setCauseAreaAmount(1, 600);
      setCauseAreaAmount(2, 400);
      setGlobalCut(true);

      cy.get("[data-cy=next-button]").click();
      fillDonorInfo();
      setupDonationIntercepts();
      cy.get("[data-cy=payment-method-autogiro]").click();

      cy.wait("@registerDonation").then((interception) => {
        const { body } = interception.request;
        expect(body.amount).to.equal(1000);

        const operations = body.distributionCauseAreas.find((ca) => ca.id === 4);
        expect(operations).to.exist;
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
      });
    });
  });

  describe("Edge Cases and State Management", () => {
    it("Should persist each cause area's own cut state when navigating between them", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 1000, false);

      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 500);

      // Cut defaults to enabled for a cause area that's never been touched
      cy.get("[data-cy=cut-checkbox-2]").should("be.checked");

      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // Cause area 1's explicit disable is preserved
      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");
    });

    it("Should not affect single cause area cut state when setting the global cut", () => {
      cy.get("[data-cy=cause-area-multiple]").click();
      setCauseAreaAmount(1, 600, false);
      setCauseAreaAmount(2, 400, false);
      setGlobalCut(true);

      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // Explicitly toggling the global checkbox cascades to every cause area's own flag
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "600");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });
  });
});
