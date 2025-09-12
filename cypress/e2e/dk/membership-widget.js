describe("DK Membership Widget CPR Validation", () => {
  beforeEach(() => {
    // Stub the KPI request that shows membership numbers
    cy.intercept("GET", "**/api/kpi", {
      statusCode: 200,
      body: {
        kpi: {
          dkk_total: 6614560,
          dkk_total_ops: 15474,
          dkk_pending_transfer: 75765,
          dkk_last_30_days: 146927,
          dkk_recurring_next_year: 7728,
          members_confirmed: 138,
          members_pending_renewal: 0,
          monthly_donors: 2,
          number_of_donors: 920,
          number_of_gavebrev: 12,
          is_max_tax_deduction_known: 1,
          oldest_stopped_donation_age: 102221436,
          missing_gavebrev_income_proof: 0,
          pending_skat_update: 0,
        },
      },
    }).as("getKPI");

    cy.visit({
      url: "/bliv-medlem",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });
    cy.wait(500);
  });

  describe("CPR Input Formatting", () => {
    it("should dynamically add dash when typing CPR number", () => {
      // Select Denmark as country (should be default)
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");

      // Fill required fields first
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");

      // Test CPR formatting - dash appears as soon as we have more than 6 digits
      const tinInput = cy.get('[data-cy="tin-input"]');

      // Type 6 digits - no dash should appear yet
      tinInput.type("120290");
      tinInput.should("have.value", "120290");

      // Type 1 more digit (7 total) - dash should now appear
      tinInput.type("0");
      tinInput.should("have.value", "120290-0");

      // Type 1 more digit (8 total) - dash should remain
      tinInput.type("1");
      tinInput.should("have.value", "120290-01");

      // Type final 2 digits (10 total) - complete formatted CPR
      tinInput.type("07");
      tinInput.should("have.value", "120290-0107");
    });

    it("should format partial input correctly when typing incrementally", () => {
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");

      const tinInput = cy.get('[data-cy="tin-input"]');

      // Test incremental typing - dash appears after 6th digit
      tinInput.type("1");
      tinInput.should("have.value", "1");

      tinInput.type("2");
      tinInput.should("have.value", "12");

      tinInput.type("0290");
      tinInput.should("have.value", "120290");

      tinInput.type("0");
      tinInput.should("have.value", "120290-0");

      tinInput.type("107");
      tinInput.should("have.value", "120290-0107");
    });

    it("should handle clearing and retyping correctly", () => {
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");

      const tinInput = cy.get('[data-cy="tin-input"]');

      // Type full CPR - dash appears after 6 digits
      tinInput.type("1202900107");
      tinInput.should("have.value", "120290-0107");

      // Clear and type again
      tinInput.clear();
      tinInput.type("101290");
      tinInput.should("have.value", "101290");

      // Add 7th digit - dash should appear
      tinInput.type("1");
      tinInput.should("have.value", "101290-1");

      // Complete the CPR
      tinInput.type("234");
      tinInput.should("have.value", "101290-1234");
    });
  });

  describe("CPR Validation - Invalid CPR Numbers", () => {
    beforeEach(() => {
      // Fill required fields
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
    });

    it("should reject CPR with invalid date - 32nd day", () => {
      cy.get('[data-cy="tin-input"]').type("3212901234");
      cy.get('[data-cy="tin-input"]').should("have.value", "321290-1234");

      // Should show invalid message
      cy.get('[data-cy="cpr-invalid-message"]').should("exist");
      cy.get('[data-cy="cpr-invalid-message"]').should("contain", "Invalid CPR number");

      // Form should not be submittable
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });

    it("should reject CPR with invalid month - 13th month", () => {
      cy.get('[data-cy="tin-input"]').type("1013901234");
      cy.get('[data-cy="tin-input"]').should("have.value", "101390-1234");

      cy.get('[data-cy="cpr-invalid-message"]').should("exist");
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });

    it("should reject CPR with invalid month - 0th month", () => {
      cy.get('[data-cy="tin-input"]').type("1000901234");
      cy.get('[data-cy="tin-input"]').should("have.value", "100090-1234");

      cy.get('[data-cy="cpr-invalid-message"]').should("exist");
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });

    it("should reject CPR with invalid day - 0th day", () => {
      cy.get('[data-cy="tin-input"]').type("0012901234");
      cy.get('[data-cy="tin-input"]').should("have.value", "001290-1234");

      cy.get('[data-cy="cpr-invalid-message"]').should("exist");
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });

    it("should reject all zeros CPR", () => {
      cy.get('[data-cy="tin-input"]').type("0000000000");
      cy.get('[data-cy="tin-input"]').should("have.value", "000000-0000");

      cy.get('[data-cy="cpr-invalid-message"]').should("exist");
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });

    it("should reject CPR with invalid day - 32nd day", () => {
      cy.get('[data-cy="tin-input"]').type("3201901234");
      cy.get('[data-cy="tin-input"]').should("have.value", "320190-1234");

      cy.get('[data-cy="cpr-invalid-message"]').should("exist");
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });
  });

  describe("CPR Validation - Suspicious CPR Numbers (Mod 11 Failures)", () => {
    beforeEach(() => {
      // Fill required fields
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
    });

    it("should accept suspicious CPR that fails mod 11 check but has valid date", () => {
      // This CPR has valid date (22/06/96) but fails mod 11 check
      cy.get('[data-cy="tin-input"]').type("2206961234");
      cy.get('[data-cy="tin-input"]').should("have.value", "220696-1234");

      // Should show suspicious message, not invalid message
      cy.get('[data-cy="cpr-suspicious-message"]').should("exist");
      cy.get('[data-cy="cpr-suspicious-message"]').should(
        "contain",
        "Kontroller venligst at det er korrekt",
      );
      cy.get('[data-cy="cpr-invalid-message"]').should("not.exist");

      // Form should be submittable (suspicious CPR is accepted)
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("not.exist");
    });
  });

  describe("CPR Validation - Valid CPR Numbers", () => {
    beforeEach(() => {
      // Fill required fields
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
    });

    it("should accept valid CPR that passes mod 11 check", () => {
      // This is a valid CPR that passes both date and mod 11 validation
      cy.get('[data-cy="tin-input"]').type("1202900107");
      cy.get('[data-cy="tin-input"]').should("have.value", "120290-0107");

      // Should not show any validation messages
      cy.get('[data-cy="cpr-suspicious-message"]').should("not.exist");
      cy.get('[data-cy="cpr-invalid-message"]').should("not.exist");

      // Form should be submittable
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="tin-input"]:invalid').should("not.exist");
    });
  });

  describe("Country Selection Impact", () => {
    it("should show CPR field for Denmark and hide birthday field", () => {
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");

      // CPR field should be visible with Danish label
      cy.get('[data-cy="tin-input"]').should("be.visible");
      cy.get('[data-cy="tin-input"]').should("have.attr", "placeholder").should("contain", "CPR");

      // Birthday field should not exist for Denmark
      cy.get('[data-cy="birthday-input"]').should("not.exist");
    });

    it("should show TIN field and birthday field for non-Denmark countries", () => {
      cy.get('[data-cy="country-selector"]').clear().type("Sweden");

      // TIN field should be visible but without CPR-specific formatting
      cy.get('[data-cy="tin-input"]').should("be.visible");
      cy.get('[data-cy="tin-input"]')
        .should("have.attr", "placeholder")
        .should("not.contain", "CPR");

      // Birthday field should exist for non-Denmark
      cy.get('[data-cy="birthday-input"]').should("be.visible");

      // Test that CPR formatting doesn't apply
      cy.get('[data-cy="tin-input"]').type("1234567890");
      cy.get('[data-cy="tin-input"]').should("have.value", "1234567890"); // No dash formatting
    });

    it("should clear CPR and show birthday when switching from Denmark to another country", () => {
      // Start with Denmark
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="tin-input"]').type("1202900107");
      cy.get('[data-cy="tin-input"]').should("have.value", "120290-0107");

      // Switch to another country
      cy.get('[data-cy="country-selector"]').clear().type("Norway");

      // CPR should be cleared and birthday field should appear
      cy.get('[data-cy="tin-input"]').should("have.value", "");
      cy.get('[data-cy="birthday-input"]').should("be.visible");
    });

    it("should clear birthday and show CPR when switching to Denmark", () => {
      // Start with non-Denmark
      cy.get('[data-cy="country-selector"]').clear().type("Norway");
      cy.get('[data-cy="birthday-input"]').type("1990-12-02");

      // Switch to Denmark
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");

      // Birthday should be cleared and CPR field should have Danish behavior
      cy.get('[data-cy="birthday-input"]').should("not.exist");
      cy.get('[data-cy="tin-input"]').should("have.attr", "placeholder").should("contain", "CPR");
    });
  });

  describe("Form Submission Edge Cases", () => {
    beforeEach(() => {
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
    });

    it("should prevent submission with incomplete CPR", () => {
      cy.get('[data-cy="tin-input"]').type("12029001"); // Only 8 digits
      cy.get('[data-cy="tin-input"]').should("have.value", "120290-01");

      cy.get('[data-cy="submit-button"]').click();
      // Form should not submit due to pattern validation
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });

    it("should prevent submission with empty CPR", () => {
      // Don't fill CPR field
      cy.get('[data-cy="submit-button"]').click();

      // Form should not submit due to required validation
      cy.get('[data-cy="tin-input"]:invalid').should("exist");
    });

    it("should handle maxlength restriction for CPR field", () => {
      cy.get('[data-cy="tin-input"]').should("have.attr", "maxlength", "12");

      // Try to type more than 12 characters (including dash)
      cy.get('[data-cy="tin-input"]').type("12345678901234567890");

      // Should be limited to 12 characters max (DDMMYY-SSSS format)
      cy.get('[data-cy="tin-input"]')
        .invoke("val")
        .then((val) => {
          expect(val.length).to.be.at.most(12);
        });
    });
  });

  describe("Validation Message Display", () => {
    beforeEach(() => {
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
    });

    it("should show and hide validation messages dynamically", () => {
      const tinInput = cy.get('[data-cy="tin-input"]');

      // Type invalid CPR
      tinInput.type("3212901234");
      cy.get('[data-cy="cpr-invalid-message"]').should("exist");

      // Clear and type suspicious CPR
      tinInput.clear();
      tinInput.type("2206961234");
      cy.get('[data-cy="cpr-invalid-message"]').should("not.exist");
      cy.get('[data-cy="cpr-suspicious-message"]').should("exist");

      // Clear and type valid CPR
      tinInput.clear();
      tinInput.type("1202900107");
      cy.get('[data-cy="cpr-invalid-message"]').should("not.exist");
      cy.get('[data-cy="cpr-suspicious-message"]').should("not.exist");
    });

    it("should clear validation messages when switching countries", () => {
      // Type invalid CPR for Denmark
      cy.get('[data-cy="tin-input"]').type("3212901234");
      cy.get('[data-cy="cpr-invalid-message"]').should("exist");

      // Switch country
      cy.get('[data-cy="country-selector"]').clear().type("Sweden");

      // Validation messages should be cleared
      cy.get('[data-cy="cpr-invalid-message"]').should("not.exist");
      cy.get('[data-cy="cpr-suspicious-message"]').should("not.exist");
    });
  });

  describe("Complete Form Submission Flow", () => {
    it("should successfully submit form with valid CPR", () => {
      // Mock the API endpoint
      cy.intercept("POST", "**/api/membership", {
        statusCode: 200,
        body: {
          redirect: "https://example.com/payment",
        },
      }).as("membershipSubmission");

      // Prevent the redirect by stubbing window.open
      cy.window().then((win) => {
        cy.stub(win, "open").as("windowOpen");
      });

      // Fill form with valid data
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
      cy.get('[data-cy="tin-input"]').type("1202900107");

      // Submit form
      cy.get('[data-cy="submit-button"]').click();

      // Wait for API call and verify it was made with correct data
      cy.wait("@membershipSubmission").then((interception) => {
        expect(interception.request.body).to.deep.include({
          name: "Test Testesen",
          email: "test@example.dk",
          country: "Denmark",
          tin: "120290-0107",
        });
      });

      // Verify redirect would have been called with the returned URL
      cy.get("@windowOpen").should("have.been.calledWith", "https://example.com/payment", "_self");
    });

    it("should successfully submit form with suspicious but valid CPR", () => {
      cy.intercept("POST", "**/api/membership", {
        statusCode: 200,
        body: {
          redirect: "https://example.com/payment-suspicious",
        },
      }).as("membershipSubmission");

      // Prevent the redirect by stubbing window.open
      cy.window().then((win) => {
        cy.stub(win, "open").as("windowOpen");
      });

      // Fill form with suspicious CPR
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("test@example.dk");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
      cy.get('[data-cy="tin-input"]').type("2206961234");

      // Verify suspicious message appears
      cy.get('[data-cy="cpr-suspicious-message"]').should("exist");

      // Form should still be submittable
      cy.get('[data-cy="submit-button"]').click();

      // Wait for API call and verify the suspicious CPR was submitted
      cy.wait("@membershipSubmission").then((interception) => {
        expect(interception.request.body).to.deep.include({
          name: "Test Testesen",
          email: "test@example.dk",
          country: "Denmark",
          tin: "220696-1234",
        });
      });

      // Verify redirect would have been called with the returned URL
      cy.get("@windowOpen").should(
        "have.been.calledWith",
        "https://example.com/payment-suspicious",
        "_self",
      );
    });

    it("should handle error response for email 'a@a'", () => {
      // Mock the API endpoint to return non-200 for a@a
      cy.intercept("POST", "**/api/membership", (req) => {
        if (req.body.email === "a@a") {
          req.reply({
            statusCode: 400,
            body: {
              error: "Invalid email domain",
            },
          });
        } else {
          req.reply({
            statusCode: 200,
            body: {
              redirect: "https://example.com/payment",
            },
          });
        }
      }).as("membershipSubmission");

      // Fill form with a@a email
      cy.get('[data-cy="country-selector"]').clear().type("Denmark");
      cy.get('[data-cy="name-input"]').type("Test Testesen");
      cy.get('[data-cy="email-input"]').type("a@a");
      cy.get('[data-cy="address-input"]').type("Testgade 123");
      cy.get('[data-cy="postcode-input"]').type("1234");
      cy.get('[data-cy="city-input"]').type("København");
      cy.get('[data-cy="tin-input"]').type("1202900107");

      // Submit form
      cy.get('[data-cy="submit-button"]').click();

      // Wait for API call and verify it was made with the a@a.com email
      cy.wait("@membershipSubmission").then((interception) => {
        expect(interception.request.body).to.deep.include({
          name: "Test Testesen",
          email: "a@a",
          country: "Denmark",
          tin: "120290-0107",
        });
        // Verify the response was non-200
        expect(interception.response.statusCode).to.equal(999);
      });
    });
  });
});
