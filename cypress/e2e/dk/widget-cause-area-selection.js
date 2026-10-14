import {
  setupWidgetTest,
  setGlobalCut,
  goToDonorPane,
  backToSelection,
  normalizedText,
  OPERATIONS_SUMMARY_LABEL,
  SINGLE_DONATION_TEXT,
  SMART_DISTRIBUTION_TITLE,
} from "./support/widget-setup.js";

describe("DK Widget - Cause Area Selection", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  it("Should display all cause area options", () => {
    cy.get("[data-cy=cause-area-recommendation]").should("be.visible");
    cy.get("[data-cy=cause-area-1]").should("be.visible");
    cy.get("[data-cy=cause-area-2]").should("be.visible");
    cy.get("[data-cy=cause-area-multiple]").should("be.visible");
    // Operations is shown below the line, separately from the regular cause areas
    cy.get("[data-cy=cause-area-4]").should("be.visible");
  });

  it("Should allow selection of recommendation (smart distribution)", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").should("be.visible");
  });

  it("Should allow selection of individual cause areas", () => {
    cy.get("[data-cy=cause-area-2]").click();
    cy.get("[data-cy=donation-sum-input-2]").should("be.visible");
  });

  it("Should allow selection of multiple cause areas", () => {
    cy.get("[data-cy=cause-area-multiple]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("be.visible");
    cy.get("[data-cy=donation-sum-input-2]").should("be.visible");
  });

  it("Should allow selection of operations cause area", () => {
    cy.get("[data-cy=cause-area-4]").click();
    cy.get("[data-cy=donation-sum-input-operations]").should("be.visible");
  });

  it("Should navigate back to cause area selection", () => {
    cy.get("[data-cy=cause-area-1]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("be.visible");

    backToSelection();
    cy.get("[data-cy=cause-area-1]").should("be.visible");
  });

  it("Should show smart distribution as a single summary entry without a cut", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("1000");
    setGlobalCut(false);

    goToDonorPane();

    cy.get("[data-cy=donation-summary]").should("exist");
    cy.get("[data-cy=donation-type]").should("contain.text", SINGLE_DONATION_TEXT);

    // Smart distribution must appear as one entry, not a per-cause-area breakdown, since
    // the underlying distribution percentages can change over time
    cy.get("[data-cy=summary-smart-distribution-name]").should(
      "contain.text",
      SMART_DISTRIBUTION_TITLE,
    );
    cy.get("[data-cy=summary-smart-distribution-amount]").should(($el) => {
      expect(normalizedText($el)).to.match(/^1000kr$/i);
    });
    cy.get("[data-cy=summary-cause-area-1-amount]").should("not.exist");
    cy.get("[data-cy=summary-cause-area-2-amount]").should("not.exist");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("not.exist");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "1 000 kr");
  });

  it("Should show smart distribution and the operations cut separately in the summary", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("1000");
    setGlobalCut(true, 10);

    goToDonorPane();

    cy.get("[data-cy=summary-smart-distribution-amount]").should(($el) => {
      expect(normalizedText($el)).to.match(/^900kr$/i);
    });
    cy.get("[data-cy=summary-cause-area-1-name]").should("not.exist");
    cy.get("[data-cy=summary-cause-area-4-name]").should("contain.text", OPERATIONS_SUMMARY_LABEL);
    cy.get("[data-cy=summary-cause-area-4-amount]").should(($el) => {
      expect(normalizedText($el)).to.match(/^100kr$/i);
    });
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "1 000 kr");
  });

  it("Should preserve smart distribution amount when navigating back from donor pane", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("500");

    goToDonorPane();
    cy.get("[data-cy=back-button]").click();

    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "500");
    cy.get("[data-cy=next-button]").last().should("not.be.disabled");
  });

  it("Should maintain smart distribution state when switching between selections", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();
    cy.get("[data-cy=donation-sum-input-overall]").type("750");

    backToSelection();
    cy.get("[data-cy=cause-area-1]").click();
    cy.get("[data-cy=donation-sum-input-1]").type("300");

    backToSelection();
    cy.get("[data-cy=cause-area-recommendation]").click();

    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "750");
  });

  it("Should work with preset amounts for smart distribution", () => {
    cy.get("[data-cy=cause-area-recommendation]").click();
    setGlobalCut(false);

    // 500 kr is the first DK single-donation preset in Sanity
    cy.get("[data-cy=suggested-sum-smart-500]").click();

    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "500");
    cy.get("[data-cy=next-button]").last().should("not.be.disabled");

    goToDonorPane();
    cy.get("[data-cy=summary-smart-distribution]").should("exist");
    cy.get("[data-cy=summary-smart-distribution-amount]").should(($el) => {
      expect(normalizedText($el)).to.match(/^500kr$/i);
    });
  });
});
