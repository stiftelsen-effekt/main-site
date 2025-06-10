import { setupWidgetTest } from "./support/widget-setup.js";

describe("Swedish Widget - Cause Area Selection", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  it("Should display all cause area options", () => {
    // Check that our recommendation is displayed
    cy.get("[data-cy=cause-area-recommendation]").should("be.visible");

    // Check that at least some individual cause areas are available
    cy.get("[data-cy^=cause-area-]").should("have.length.at.least", 3);

    // Check multiple cause areas option
    cy.get("[data-cy=cause-area-multiple]").should("be.visible");

    // Check that at least one operations/support cause area exists
    cy.get("[data-cy^=cause-area-]").should("have.length.at.least", 4);
  });

  it("Should allow selection of recommendation (smart distribution)", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();
    // Should advance to amount pane with overall input for smart distribution
    cy.get("[data-cy=donation-sum-input-overall]").should("be.visible");
  });

  it("Should allow selection of individual cause areas", () => {
    cy.get("[data-cy=cause-area-1]").click();
    // Should advance to amount pane for selected cause area
    cy.get("[data-cy=donation-sum-input-1]").should("be.visible");
  });

  it("Should allow selection of multiple cause areas", () => {
    cy.get("[data-cy=cause-area-multiple]").click();
    // Should advance to amount pane showing multiple cause areas
    cy.get("[data-cy^=donation-sum-input-]").should("have.length.at.least", 3);
  });

  it("Should allow selection of operations cause area", () => {
    cy.get("[data-cy=cause-area-4]").click();
    // Should advance to amount pane for operations
    cy.get("[data-cy=donation-sum-input-operations]").should("be.visible");
  });

  it("Should navigate back to cause area selection", () => {
    cy.get("[data-cy=cause-area-1]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("be.visible");

    // Navigate back
    cy.get("[data-cy=back-button]").click();

    // Should be back at cause area selection
    cy.get("[data-cy=cause-area-recommendation]", { timeout: 10000 }).should("be.visible");
    cy.get("[data-cy=cause-area-1]").should("be.visible");
  });

  it("Should show correct summary for smart distribution", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();

    // Set amount for smart distribution
    cy.get("[data-cy=donation-sum-input-overall]").type("1000");

    // Go to donor pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Check that donation summary is visible
    cy.get("[data-cy=donation-summary]").should("exist");

    // Check donation type (should be single by default)
    cy.get("[data-cy=donation-type]").should("contain.text", "Enkelt givande");

    // Based on fixture data: Global hälsa (ID 1) has 100% standardPercentageShare, others have 0%
    // So for 1000 kr, Global hälsa should get the full amount
    cy.get("[data-cy=summary-cause-area-1-name]").should("contain.text", "Global hälsa");
    // Use Unicode non-breaking space (U+00A0) which is used by Norwegian locale formatting
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "1\u00A0000 kr");

    // Other cause areas should not appear (they have 0% share)
    cy.get("[data-cy=summary-cause-area-2-amount]").should("not.exist");
    cy.get("[data-cy=summary-cause-area-3-amount]").should("not.exist");

    // Check total amount matches what was entered
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "1\u00A0000 kr");
  });

  it("Should preserve smart distribution amount when navigating back from donor pane", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();

    // Set amount for smart distribution
    cy.get("[data-cy=donation-sum-input-overall]").type("500");

    // Go to donor pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Navigate back to amount pane
    cy.get("[data-cy=back-button]").click();

    // Should still be on smart distribution with preserved amount
    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "500");
    cy.get("[data-cy=next-button]").should("not.be.disabled");
  });

  it("Should maintain smart distribution state when switching between selections", () => {
    // Start with smart distribution
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("750");

    // Switch to single cause area
    cy.get("[data-cy=back-button]").click();
    cy.get("[data-cy=cause-area-1]").click();
    cy.get("[data-cy=donation-sum-input-1]").type("300");

    // Switch back to smart distribution
    cy.get("[data-cy=back-button]").click();
    cy.get("[data-cy=cause-area-recommendation]").click();

    // Smart distribution amount should be preserved
    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "750");
  });

  it("Should work with preset amounts for smart distribution", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();

    // Click a preset amount button (assuming 500 kr is available)
    cy.get("[data-cy=suggested-sum-smart-500]").click();

    // Should populate the input field
    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "500");
    cy.get("[data-cy=next-button]").should("not.be.disabled");

    // Go to donor pane and verify summary
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Check that summary shows the preset amount distributed
    cy.get("[data-cy=donation-summary]").should("exist");
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "500 kr");
  });
});
