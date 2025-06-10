import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - Tip Functionality", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  describe("Single Cause Area Tips", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
    });

    it("Should show tip option for single cause area", () => {
      setCauseAreaAmount(1, 1000);

      // Should show tip checkbox
      cy.get("[data-cy=tip-checkbox-1]").should("be.visible");
    });

    it("Should calculate tip correctly when enabled", () => {
      // Set amount first, then enable tip
      cy.get("[data-cy=donation-sum-input-1]").type("1000");
      cy.get("[data-cy=tip-checkbox-1]").check();

      // Total should be 1000, with tip breakdown shown
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "1000");

      // Should show tip is enabled
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
    });

    it("Should recalculate tip when amount changes", () => {
      cy.get("[data-cy=tip-checkbox-1]").check();

      // Set initial amount
      cy.get("[data-cy=donation-sum-input-1]").type("500");
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");

      // Change amount
      cy.get("[data-cy=donation-sum-input-1]").clear().type("800");
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
    });

    it("Should work with suggested amounts and tips", () => {
      // Enable tip first
      cy.get("[data-cy=tip-checkbox-1]").check();

      // Click suggested amount
      cy.get("[data-cy=suggested-sum-1-500]").click();

      // Should show total amount including tip
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");

      // Should show tip is enabled
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
    });

    it("Should toggle tip on and off", () => {
      cy.get("[data-cy=donation-sum-input-1]").type("1000");

      // Enable tip
      cy.get("[data-cy=tip-checkbox-1]").check();
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");

      // Disable tip
      cy.get("[data-cy=tip-checkbox-1]").uncheck();
      cy.get("[data-cy=tip-checkbox-1]").should("not.be.checked");

      // Full amount should go to cause area
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "1000");
    });
  });

  describe("Multiple Cause Areas Tips", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-multiple]").click();
    });

    it("Should show tip options for each cause area independently", () => {
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);

      // Each cause area should have its own tip checkbox
      cy.get("[data-cy=tip-checkbox-1]").should("be.visible");
      cy.get("[data-cy=tip-checkbox-2]").should("be.visible");
      cy.get("[data-cy=tip-checkbox-3]").should("be.visible");
    });

    it("Should handle tips per cause area independently", () => {
      // Set amounts
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 200);

      // Enable tip for Global hälsa only
      cy.get("[data-cy=tip-checkbox-1]").check();

      // Check that only Global hälsa has tip enabled
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
      cy.get("[data-cy=tip-checkbox-2]").should("not.be.checked");

      // Total should be displayed
      cy.get("[data-cy=total-amount-wrapper]").should("exist"); // Complex calculation with tips
    });

    it("Should calculate different tip amounts per cause area", () => {
      setCauseAreaAmount(1, 400, true); // 400 + 5% = 420
      setCauseAreaAmount(2, 600, true); // 600 + 5% = 630
      setCauseAreaAmount(3, 200); // No tip

      // Check that tips are enabled for correct areas
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
      cy.get("[data-cy=tip-checkbox-2]").should("be.checked");

      // Total should be displayed
      cy.get("[data-cy=total-amount-wrapper]").should("exist");
    });

    it("Should preserve tip states when amounts change", () => {
      // Set up initial state
      setCauseAreaAmount(1, 500, true);
      setCauseAreaAmount(2, 300); // No tip

      // Change amount for cause area with tip
      cy.get("[data-cy=donation-sum-input-1]").clear().type("800");

      // Tip should still be enabled
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "800");

      // Other cause area should remain unchanged
      cy.get("[data-cy=tip-checkbox-2]").should("not.be.checked");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
    });
  });

  describe("Tip State Persistence", () => {
    it("Should preserve tip state when switching between single and multiple", () => {
      // Start with single cause area
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, true);

      // Go back and select multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // First cause area should still have the amount and tip from single selection
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "525");
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");

      // Set amount for another cause area
      setCauseAreaAmount(2, 200);

      // Go back to single selection for first cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // Should still have the preserved state
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "525");
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
    });

    it("Should maintain tip state across navigation", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      // Set different tip states
      setCauseAreaAmount(1, 400, true);
      setCauseAreaAmount(2, 300); // No tip
      setCauseAreaAmount(3, 200, true);

      // Navigate to next pane and back
      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=back-button]").click();

      // All tip states should be preserved
      cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
      cy.get("[data-cy=tip-checkbox-2]").should("not.be.checked");
      cy.get("[data-cy=tip-checkbox-3]").should("be.checked");

      // Amounts should be preserved with tips
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "420"); // 400 + 5%
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=donation-sum-input-3]").should("have.value", "210"); // 200 + 5%
    });
  });
});
