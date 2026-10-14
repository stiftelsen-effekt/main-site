import {
  setupWidgetTest,
  setCauseAreaAmount,
  setCut,
  setGlobalCut,
  goToDonorPane,
  backToSelection,
} from "./support/widget-setup.js";

// The operations cut ("tip") adds a percentage of the donation to Giv Effektivts arbejde og
// vækst (operations cause area 4). It's toggled per cause area when a single cause area is
// selected, and with one global toggle in multiple cause areas / smart distribution mode.
// Whether it starts enabled is Sanity config, so these tests always set it explicitly.
describe("DK Widget - Operations Cut", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  describe("Single cause area", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
    });

    it("Should show the cut option with a percentage input", () => {
      setCauseAreaAmount(1, 1000);
      cy.get("[data-cy=cut-checkbox-1]").should("exist");
      cy.get("[data-cy=percentage-cut-input-1]").should("exist");
    });

    it("Should disable the percentage input when the cut is unchecked", () => {
      setCauseAreaAmount(1, 1000);
      setCut(1, false);

      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");
      cy.get("[data-cy=percentage-cut-input-1]").should("be.disabled");
    });

    it("Should allow changing the cut percentage", () => {
      setCauseAreaAmount(1, 1000);
      setCut(1, true, 20);

      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
      cy.get("[data-cy=percentage-cut-input-1]").should("not.be.disabled");
    });

    it("Should keep the cut and the entered amount when the amount changes", () => {
      setCauseAreaAmount(1, 500);
      setCut(1, true);

      cy.get("[data-cy=donation-sum-input-1]").clear().type("800");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
      // The entered amount is the total; the cut is taken out of it, not added on top
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "800");
    });

    it("Should keep the cut when picking a suggested amount", () => {
      setCauseAreaAmount(1, 100);
      setCut(1, true);

      cy.get("[data-cy=suggested-sum-1-500]").click();

      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should take the cut out of the entered amount in the summary", () => {
      setCauseAreaAmount(1, 1000);
      setCut(1, true, 10);

      goToDonorPane();

      cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "900 kr");
      cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "100 kr");
      cy.get("[data-cy=summary-total-amount]").should("contain.text", "1 000 kr");
    });
  });

  describe("Multiple cause areas", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-multiple]").click();
    });

    it("Should show a global cut option instead of per-cause-area ones", () => {
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);

      cy.get("[data-cy=global-cut-checkbox]").should("exist");
      cy.get("[data-cy=cut-checkbox-1]").should("not.exist");
      cy.get("[data-cy=cut-checkbox-2]").should("not.exist");
    });

    it("Should disable the global percentage input when unchecked", () => {
      setCauseAreaAmount(1, 500);
      setGlobalCut(false);

      cy.get("[data-cy=global-cut-checkbox]").should("not.be.checked");
      cy.get("[data-cy=global-percentage-cut-input]").should("be.disabled");
    });

    it("Should toggle the global cut without changing the entered amounts", () => {
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);

      setGlobalCut(true);
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");

      setGlobalCut(false);
      cy.get("[data-cy=global-cut-checkbox]").should("not.be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=total-amount-wrapper]").should("contain.text", "800 kr");
    });

    it("Should preserve the global cut when amounts change", () => {
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);
      setGlobalCut(true);

      cy.get("[data-cy=donation-sum-input-1]").clear().type("800");

      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "800");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
    });

    it("Should preserve the global cut across navigation to the donor pane and back", () => {
      setCauseAreaAmount(1, 400);
      setCauseAreaAmount(2, 300);
      setGlobalCut(true);

      goToDonorPane();
      cy.get("[data-cy=back-button]").click();

      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "400");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
    });
  });

  describe("Cut state across single and multiple selection", () => {
    it("Should keep each cause area's own cut state when navigating between them", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 1000);
      setCut(1, false);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 500);
      setCut(2, true);

      backToSelection();
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=cut-checkbox-2]").should("be.checked");
    });

    it("Should enable the global cut when any single cause area has the cut enabled", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, true);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300);
      setCut(2, false);

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();

      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
    });

    it("Should leave the global cut off when no single cause area has the cut enabled", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, false);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300);
      setCut(2, false);

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();

      cy.get("[data-cy=global-cut-checkbox]").should("not.be.checked");

      // Explicitly enabling it globally cascades to every cause area's own toggle
      setGlobalCut(true);

      backToSelection();
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should preserve local cut states when the global toggle is not touched", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, false);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300);
      setCut(2, true);

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // Without touching the global toggle, each cause area keeps its own state
      backToSelection();
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=cut-checkbox-2]").should("be.checked");
    });

    it("Should update all local cut states when the global toggle is explicitly changed", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, false);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300);
      setCut(2, true);

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      setGlobalCut(false);

      backToSelection();
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=cut-checkbox-2]").should("not.be.checked");

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();
      setGlobalCut(true);

      backToSelection();
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should not inflate the amount when a cause area's cut is turned off after visiting multiple", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, false);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300);
      setCut(2, true);

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=cut-checkbox-2]").should("be.checked");
      setCut(2, false);
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
    });

    it("Should split the global cut proportionally while preserving local states", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, true);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300);
      setCut(2, false);

      backToSelection();
      cy.get("[data-cy=cause-area-multiple]").click();
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      // Only the percentage is changed - the checkbox itself is left untouched
      cy.get("[data-cy=global-percentage-cut-input]").type("{selectall}10");

      goToDonorPane();

      // 10% of 800 = 80 kr to operations, taken proportionally from each cause area
      cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "450 kr");
      cy.get("[data-cy=summary-cause-area-2-amount]").should("contain.text", "270 kr");
      cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "80 kr");
      cy.get("[data-cy=summary-total-amount]").should("contain.text", "800 kr");

      // Back on the selection pane, each cause area still has its own cut state
      cy.get("[data-cy=back-button]").click();
      backToSelection();
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=cut-checkbox-2]").should("not.be.checked");
    });
  });
});
