import { setupWidgetTest, setCauseAreaAmount, setGlobalCut } from "./support/widget-setup.js";

describe("Swedish Widget - Cut Functionality", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  describe("Single Cause Area Cuts", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-1]").click();
    });

    it("Should show cut option for single cause area", () => {
      setCauseAreaAmount(1, 1000);

      // Should show cut checkbox (hidden checkbox exists, but we interact with the wrapper)
      cy.get("[data-cy=cut-checkbox-1]").should("exist");
    });

    it("Should calculate cut correctly when enabled", () => {
      // Set amount first, then enable cut
      cy.get("[data-cy=donation-sum-input-1]").type("1000");
      cy.get("[data-cy=cut-checkbox-1]").check();

      // Total should be 1000, with cut breakdown shown (with thousand separator)
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "1 000");

      // Should show cut is enabled
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should maintain cut state when amount changes", () => {
      // Set initial amount
      cy.get("[data-cy=donation-sum-input-1]").type("500");

      // Enable cut
      cy.get("[data-cy=cut-checkbox-1]").check();
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");

      // Change amount - cut should remain checked
      cy.get("[data-cy=donation-sum-input-1]").clear().type("800");
      // Wait a moment for state to update
      cy.wait(500);
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should work with suggested amounts and cuts", () => {
      // First set an amount to make the cut checkbox appear
      cy.get("[data-cy=donation-sum-input-1]").type("100");

      // Enable cut
      cy.get("[data-cy=cut-checkbox-1]").check();

      // Click suggested amount
      cy.get("[data-cy=suggested-sum-1-500]").click();

      // Should show total amount
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");

      // Should show cut is still enabled
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should toggle cut on and off", () => {
      cy.get("[data-cy=donation-sum-input-1]").type("1000");

      // Enable cut
      cy.get("[data-cy=cut-checkbox-1]").check();
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");

      // Disable cut
      cy.get("[data-cy=cut-checkbox-1]").uncheck();
      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");

      // Full amount should go to cause area
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "1 000");
    });
  });

  describe("Multiple Cause Areas Cuts", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-multiple]").click();
    });

    it("Should show global cut option for multiple cause areas", () => {
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);

      // Should show global cut checkbox, not individual ones
      cy.get("[data-cy=global-cut-checkbox]").should("exist");

      // Individual cut checkboxes should not exist in multiple cause areas mode
      cy.get("[data-cy=cut-checkbox-1]").should("not.exist");
      cy.get("[data-cy=cut-checkbox-2]").should("not.exist");
      cy.get("[data-cy=cut-checkbox-3]").should("not.exist");
    });

    it("Should apply cut globally to all cause areas when enabled", () => {
      // Set amounts for multiple cause areas
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 200);
      setCauseAreaAmount(3, 300);

      // Enable global cut
      setGlobalCut(true);

      // Global cut should be checked
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // All cause areas with amounts should have cuts applied
      // Note: The amounts shown in input fields represent total intended amounts (including cut)
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
      cy.get("[data-cy=donation-sum-input-3]").should("have.value", "300");

      // Total should be displayed
      cy.get("[data-cy=total-amount-wrapper]").should("exist");
    });

    it("Should calculate cut for all cause areas with amounts", () => {
      // Set different amounts
      setCauseAreaAmount(1, 400);
      setCauseAreaAmount(2, 600);
      setCauseAreaAmount(3, 200);

      // Enable global cut
      setGlobalCut(true);

      // Global cut should be enabled
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // Total should be displayed
      cy.get("[data-cy=total-amount-wrapper]").should("exist");
    });

    it("Should preserve global cut state when amounts change", () => {
      // Set up initial state with global cut enabled
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);
      setGlobalCut(true);

      // Change amount for one cause area
      cy.get("[data-cy=donation-sum-input-1]").clear().type("800");

      // Global cut should still be enabled
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "800");

      // Other cause area should remain unchanged
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
    });

    it("Should toggle global cut on and off for all cause areas", () => {
      // Set amounts
      setCauseAreaAmount(1, 500);
      setCauseAreaAmount(2, 300);

      // Enable global cut
      setGlobalCut(true);
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // Disable global cut
      setGlobalCut(false);
      cy.get("[data-cy=global-cut-checkbox]").should("not.be.checked");

      // Amounts should remain the same (full amount goes to cause areas)
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
    });
  });

  describe("Cut State Persistence", () => {
    it("Should preserve cut state when switching between single and multiple", () => {
      // Start with single cause area
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, true);

      // Go back and select multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // First cause area should show the total amount (500) in the input
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      // In multiple mode, should show global cut checkbox as checked
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // Set amount for another cause area - should also get operations cut
      setCauseAreaAmount(2, 200);

      // Both should maintain their total amounts in inputs
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");

      // Go back to single selection for first cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // Should still have the operations cut enabled
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should maintain separate operations cut states for single vs multiple cause areas", () => {
      // Start with single cause area with operations cut
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, true);

      // Go back and select another single cause area without operations cut
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300, false);

      // Now switch to multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // Both cause areas should have amounts and global operations cut should be checked
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // Add a third cause area
      setCauseAreaAmount(3, 200);
      cy.get("[data-cy=donation-sum-input-3]").should("have.value", "200");

      // Go back to single selection for second cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();

      // Should still NOT have operations cut (local state preserved, not propagated from multiple)
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=cut-checkbox-2]").should("not.be.checked");
    });

    it("Should preserve local operations cut states when global toggle is not touched", () => {
      // Start with first cause area WITHOUT operations cut
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, false);

      // Go to second cause area WITH operations cut
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300, true);

      // Switch to multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // Global operations cut should be checked (because at least one area had it)
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");

      // WITHOUT touching the global toggle, go back to first cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // First cause area should STILL not have operations cut (preserve local state)
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");

      // Go back and check second cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();

      // Second cause area should STILL have operations cut (preserve local state)
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=cut-checkbox-2]").should("be.checked");
    });

    it("Should update all local states when global toggle is explicitly changed", () => {
      // Start with mixed states: first WITHOUT, second WITH operations cut
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, false);

      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300, true);

      // Switch to multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // Global should be checked
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // EXPLICITLY toggle global operations cut OFF
      cy.get("[data-cy=global-cut-checkbox]").uncheck();
      cy.get("[data-cy=global-cut-checkbox]").should("not.be.checked");

      // Go back to first cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // First cause area should now have operations cut DISABLED (following global change)
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("not.be.checked");

      // Check second cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();

      // Second cause area should also have operations cut DISABLED (following global change)
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=cut-checkbox-2]").should("not.be.checked");

      // Go back to multiple and toggle ON
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // EXPLICITLY toggle global operations cut ON
      cy.get("[data-cy=global-cut-checkbox]").check();

      // Check first cause area again
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // Should now have operations cut ENABLED
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should handle amount preservation correctly with local states", () => {
      // This tests the specific bug scenario mentioned
      // Start with first cause area without operations cut
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, false);

      // Second cause area with operations cut
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300, true);

      // Switch to multiple - global should be checked
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");

      // Without touching global, go back to cause area 2
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();

      // Should still have operations cut (local state preserved)
      cy.get("[data-cy=cut-checkbox-2]").should("be.checked");

      // Now uncheck it
      cy.get("[data-cy=cut-checkbox-2]").uncheck();
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");

      // Go back to multiple
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // Amount should still be 300, not increased
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");

      // Global should still be checked (cause area 1 still contributes to this)
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
    });

    it("Should preserve local state when switching from multiple to single without touching global toggle", () => {
      // Test the exact scenario described:
      // 1. Set global health (CA1) with cut enabled
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").type("100");
      cy.get("[data-cy=cut-checkbox-1]").check();
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");

      // 2. Go back and set animal welfare (CA2) WITHOUT cut
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=donation-sum-input-2]").type("100");
      // Explicitly ensure cut is NOT checked
      cy.get("[data-cy=cut-checkbox-2]").should("not.be.checked");

      // 3. Go to multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // Global cut should be enabled (because CA1 has it)
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "100");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "100");

      // 4. WITHOUT touching global toggle, go back to animal welfare
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();

      // CRITICAL: Animal welfare should STILL not have cut checked
      // This is the bug - it's currently being checked when it shouldn't be
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "100");
      cy.get("[data-cy=cut-checkbox-2]").should("not.be.checked");
    });

    it("Should calculate operations cut correctly in multiple mode while preserving local states", () => {
      // 1. Set up mixed states: CA1 with operations cut, CA2 without
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=donation-sum-input-1]").type("500");
      cy.get("[data-cy=cut-checkbox-1]").check();

      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=donation-sum-input-2]").type("300");
      // Leave operations cut unchecked

      // 2. Go to multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // Global should be checked
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // 3. Navigate to next pane to check summary
      cy.get("[data-cy=next-button]").click();

      // 4. Check the donation summary
      // When global operations cut is enabled in multiple mode:
      // - CA1: 500 - (40 * 500/800) = 475 kr (after proportional cut)
      // - CA2: 300 - (40 * 300/800) = 285 kr (after proportional cut)
      // - Operations: 5% of 800 = 40 kr
      // - Total: 800 kr (what the user entered)
      cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "475 kr");
      cy.get("[data-cy=summary-cause-area-2-amount]").should("contain.text", "285 kr");
      cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "40 kr"); // Operations (5% of 800)
      cy.get("[data-cy=summary-total-amount]").should("contain.text", "800 kr");

      // 5. Go back and verify local states are preserved
      cy.get("[data-cy=back-button]").click();
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);

      // Check CA1 - should still have operations cut
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");

      // Check CA2 - should NOT have operations cut (local state preserved)
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      cy.get("[data-cy=cut-checkbox-2]").should("not.be.checked");
    });

    it("Should preserve individual states when no operations cut is enabled", () => {
      // Start with single cause area without operations cut
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500, false);

      // Go to another single cause area also without operations cut
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 300, false);

      // Switch to multiple cause areas
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-multiple]").click();

      // Both amounts should be preserved, global operations cut should not be checked
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=global-cut-checkbox]").should("not.be.checked");

      // Enable global operations cut
      setGlobalCut(true);

      // Amounts should remain the same in inputs
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");

      // Go back to single cause area
      cy.get("[data-cy=back-button]").click();
      cy.wait(500);
      cy.get("[data-cy=cause-area-1]").click();

      // Should now have operations cut enabled
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
      cy.get("[data-cy=cut-checkbox-1]").should("be.checked");
    });

    it("Should maintain cut state across navigation in multiple cause areas", () => {
      cy.get("[data-cy=cause-area-multiple]").click();

      // Set amounts and enable global cut
      setCauseAreaAmount(1, 400);
      setCauseAreaAmount(2, 300);
      setCauseAreaAmount(3, 200);
      setGlobalCut(true);

      // Navigate to next pane and back
      cy.get("[data-cy=next-button]").click();
      cy.get("[data-cy=back-button]").click();

      // Global cut state should be preserved
      cy.get("[data-cy=global-cut-checkbox]").should("be.checked");

      // Amounts should be preserved
      cy.get("[data-cy=donation-sum-input-1]").should("have.value", "400");
      cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
      cy.get("[data-cy=donation-sum-input-3]").should("have.value", "200");
    });
  });
});
