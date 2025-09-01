describe("Widget", () => {
  beforeEach(() => {
    cy.fixture("cause_areas")
      .then((causeAreas) => {
        cy.intercept("GET", "/causeareas/all", {
          statusCode: 200,
          body: {
            status: 200,
            content: causeAreas,
          },
        });
      })
      .as("getCauseAreas");

    cy.fixture("referrals").then((referrals) => {
      cy.intercept("GET", "/referrals/types", {
        statusCode: 200,
        body: {
          status: 200,
          content: referrals,
        },
      }).as("getReferrals");
    });

    cy.visit({
      url: "/",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });
    cy.wait(500);
    cy.get("[data-cy=gi-button]").click();
  });

  it("End-2-End DK donation with CPR validation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    // In DK locale, there should be no name field (show_name_field: false)
    cy.get("[data-cy=name-input]").should("not.exist");

    // Fill in email
    cy.get("[data-cy=email-input]").type("donor@email.dk");

    // Enable tax deduction and test CPR validation
    cy.get("[data-cy=tax-deduction-checkbox]").click();

    // Test invalid CPR first
    cy.get("[data-cy=ssn-input]").type("1234567890"); // 10 digits but invalid CPR
    cy.get("[data-cy=bank-method]").click({ force: true });
    cy.nextWidgetPane();
    cy.checkNextIsDisabled(); // Should be disabled due to invalid CPR

    // Clear and type valid CPR - using a known valid Danish CPR format
    cy.get("[data-cy=ssn-input]").clear();
    cy.get("[data-cy=ssn-input]").type("1202900107"); // Valid CPR format

    // Verify CPR formatting (should auto-format to DDMMYY-SSSS)
    cy.get("[data-cy=ssn-input]").should("have.value", "120290-0107");

    cy.get("[data-cy=newsletter-checkbox]").click();

    cy.intercept("POST", "/donations/register", {
      statusCode: 200,
      body: {
        status: 200,
        content: {
          KID: "87397824",
          donorID: 1464,
          hasAnsweredReferral: false,
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.get("[data-cy=privacy-policy-checkbox]").click({ force: true });

    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("DK CPR formatting test", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.get("[data-cy=email-input]").type("donor@email.dk");
    cy.get("[data-cy=tax-deduction-checkbox]").click();

    // Test CPR auto-formatting - type digits only
    cy.get("[data-cy=ssn-input]").type("1012901234");

    // Should auto-format to include dash
    cy.get("[data-cy=ssn-input]").should("have.value", "101290-1234");

    // Test partial input formatting
    cy.get("[data-cy=ssn-input]").clear();
    cy.get("[data-cy=ssn-input]").type("101290");
    cy.get("[data-cy=ssn-input]").should("have.value", "101290");

    cy.get("[data-cy=ssn-input]").type("12");
    cy.get("[data-cy=ssn-input]").should("have.value", "101290-12");
  });

  it("DK CPR validation edge cases", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.get("[data-cy=email-input]").type("donor@email.dk");
    cy.get("[data-cy=tax-deduction-checkbox]").click();

    // Test various invalid CPR numbers
    const invalidCprs = [
      "000000-0000", // All zeros
      "321290-1234", // Invalid date (32nd day)
      "101390-1234", // Invalid month (13th month)
    ];

    invalidCprs.forEach((invalidCpr, index) => {
      cy.get("[data-cy=ssn-input]").clear();
      cy.get("[data-cy=ssn-input]").type(invalidCpr);
      cy.get("[data-cy=bank-method]").click({ force: true });
      if (index === 0) {
        // First needed to trigger validation
        cy.nextWidgetPane();
      }
      cy.checkNextIsDisabled(); // Should be disabled due to invalid CPR
    });

    // Finally test with valid CPR
    cy.get("[data-cy=ssn-input]").clear();
    cy.get("[data-cy=ssn-input]").type("1202900107"); // Valid CPR

    cy.intercept("POST", "/donations/register", {
      statusCode: 200,
      body: {
        status: 200,
        content: {
          KID: "87397824",
          donorID: 1464,
          hasAnsweredReferral: false,
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.get("[data-cy=privacy-policy-checkbox]").click({ force: true });

    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });
});
