import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Single Cause Area Flow", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  it("Should allow amount input for single cause area", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // Set amount for Global hälsa
    setCauseAreaAmount(1, 500);

    // Check that amount is set correctly
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
  });

  it("Should handle suggested amounts", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // Click on a suggested amount button (assuming 500 kr is available)
    cy.get("[data-cy=suggested-sum-1-500]").click();

    // Should populate the input field and button should be selected
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
  });

  it("Should validate minimum amount", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // Try to proceed without amount
    cy.get("[data-cy=next-button]").should("be.disabled");

    // Set amount to 0
    cy.get("[data-cy=donation-sum-input-1]").type("0");
    cy.get("[data-cy=next-button]").should("be.disabled");

    // Set valid amount
    cy.get("[data-cy=donation-sum-input-1]").clear().type("100");
    cy.get("[data-cy=next-button]").should("not.be.disabled");
  });

  it("Should advance to donor pane", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 500);

    cy.get("[data-cy=next-button]").click();

    // Should show donor form
    cy.get("[data-cy=name-input]").should("be.visible");
    cy.get("[data-cy=email-input]").should("be.visible");
    cy.get("[data-cy=anon-checkbox]").should("exist");
  });

  it("Should handle operations cause area", () => {
    cy.get("[data-cy=cause-area-4]").click();

    // Set amount for operations - use operations input
    cy.get("[data-cy=donation-sum-input-operations]").type("200");

    // Check that amount is set correctly
    cy.get("[data-cy=donation-sum-input-operations]").should("have.value", "200");

    // Should be able to proceed
    cy.get("[data-cy=next-button]").should("not.be.disabled");
  });

  it("Should display recurring vs single donation options", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // Should show recurring/single options
    cy.get('[data-cy="single-donation-radio"]').should("exist");
    cy.get('[data-cy="recurring-donation-radio"]').should("exist");

    // Default should be single donation
    cy.get('[data-cy="single-donation-radio"]').should("be.checked");
  });

  it("Should switch between recurring and single donation", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // Switch to recurring by clicking the radio input
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
    cy.get('[data-cy="recurring-donation-radio"]').should("be.checked");

    // Switch back to single by clicking the radio input
    cy.get('[data-cy="single-donation-radio"]').click({ force: true });
    cy.get('[data-cy="single-donation-radio"]').should("be.checked");
  });

  it("Should show correct donation summary for single cause area", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 750, false); // operations cut can default to on

    // Go to donor pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Check that donation summary is visible
    cy.get("[data-cy=donation-summary]").should("exist");

    // Check donation type (should be single donation by default)
    cy.get("[data-cy=donation-type]").should("contain.text", "Ge en engångsgåva");

    // Check cause area amount in summary
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "750 kr");

    // Check total amount matches
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "750 kr");
  });

  it("Should show correct summary for single cause area with tip and recurring", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // Switch to recurring first
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });

    // Set amount with tip
    setCauseAreaAmount(1, 500, true);

    // Go to donor pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Check donation type is recurring
    cy.get("[data-cy=donation-type]").should("contain.text", "Bli månadsgivare");

    // Check that both cause area and operations are shown
    cy.get("[data-cy=summary-cause-area-1-amount]").should("exist");
    cy.get("[data-cy=summary-cause-area-4-name]").should("contain.text", "Stöd Ge Effektivt");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("exist");

    // Check total includes both amounts
    cy.get("[data-cy=summary-total-amount]").should("exist");
  });

  it("Should show correct summary for operations cause area", () => {
    cy.get("[data-cy=cause-area-4]").click();
    cy.get("[data-cy=donation-sum-input-operations]").type("150");

    // Go to donor pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Check that donation summary shows operations
    cy.get("[data-cy=donation-summary]").should("exist");
    cy.get("[data-cy=summary-cause-area-4-name]").should("contain.text", "Stöd Ge Effektivt");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "150 kr");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "150 kr");
  });
});
