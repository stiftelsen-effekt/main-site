import {
  setupWidgetTest,
  setCauseAreaAmount,
  setCut,
  setGlobalCut,
  goToDonorPane,
  backToSelection,
} from "./support/widget-setup.js";

// Switching selection deliberately never discards what the donor already typed (see
// SET_CAUSE_AREA_SELECTION in the donation reducer).
describe("DK Widget - State Persistence", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  it("Should persist amounts and cut state when navigating between cause areas", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 500);
    setCut(1, true);

    backToSelection();
    cy.get("[data-cy=cause-area-2]").click();
    setCauseAreaAmount(2, 300);

    backToSelection();
    cy.get("[data-cy=cause-area-1]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
    cy.get("[data-cy=cut-checkbox-1]").should("be.checked");

    backToSelection();
    cy.get("[data-cy=cause-area-2]").click();
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
  });

  it("Should maintain state across the full navigation flow", () => {
    cy.get("[data-cy=cause-area-multiple]").click();
    setCauseAreaAmount(1, 300);
    setCauseAreaAmount(2, 200);
    setGlobalCut(true);

    goToDonorPane();
    cy.get("[data-cy=back-button]").click();

    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
    cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

    // Single cause area shows the amount entered in multiple mode
    backToSelection();
    cy.get("[data-cy=cause-area-1]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");

    backToSelection();
    cy.get("[data-cy=cause-area-multiple]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
  });

  it("Should preserve custom organization distribution", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 1000);

    cy.get("[data-cy=radio-custom-share-1]").click({ force: true });
    cy.get("[data-cy=org-2]").clear().type("600");

    backToSelection();
    cy.get("[data-cy=cause-area-1]").click();

    cy.get("[data-cy=radio-custom-share-1]").should("be.checked");
    cy.get("[data-cy=org-2]").should("have.value", "600");
  });

  it("Should preserve recurring donation preference", () => {
    cy.get("[data-cy=cause-area-1]").click();
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
    setCauseAreaAmount(1, 500);

    backToSelection();
    cy.get("[data-cy=cause-area-1]").click();

    cy.get('[data-cy="recurring-donation-radio"]').should("be.checked");
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
  });

  it("Should handle cross-navigation between single, multiple and operations", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 400);
    setCut(1, true);
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });

    // Multiple mode inherits the single selection's amount, cut and recurring choice
    backToSelection();
    cy.get("[data-cy=cause-area-multiple]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "400");
    cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
    cy.get('[data-cy="recurring-donation-radio"]').should("be.checked");

    setCauseAreaAmount(2, 250);

    backToSelection();
    cy.get("[data-cy=cause-area-4]").click();
    setCauseAreaAmount(4, 100);

    backToSelection();
    cy.get("[data-cy=cause-area-multiple]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "400");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "250");
    cy.get('[data-cy="recurring-donation-radio"]').should("be.checked");
  });

  // Smart distribution keeps its own separate total, so entering it starts empty without
  // wiping the per-cause-area amounts.
  it("Should keep per-cause-area amounts when switching via smart distribution", () => {
    cy.get("[data-cy=cause-area-multiple]").click();
    setCauseAreaAmount(1, 300);
    setCauseAreaAmount(2, 200);

    backToSelection();
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "");

    backToSelection();
    cy.get("[data-cy=cause-area-multiple]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
  });
});
