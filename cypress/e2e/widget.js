context("Window", () => {
    before(() => {
        cy.visit("http://localhost:3000");
    });

    it("End-2-End single bank donation", () => {
        const randomSum = Math.floor(Math.random() * 1000) + 100;
        cy.get("[data-cy=gi-button]").click();
        cy.pickSingleDonation();
        cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
        cy.nextWidgetPane();

        cy.pickAnonymous();
        cy.get("[data-cy=bank-method]").click({ force: true });
        cy.wait(500);

    
        cy.intercept("POST", "/donations/register", {
          statusCode: 200,
          body: {
            status: 200,
            content: {
                KID: "87397824",
                donorID: 1464,
                hasAnsweredReferral: false,
                paymentProviderUrl: ""
            },
          },
        }).as("registerDonation");

        cy.nextWidgetPane();

        cy.wait("@registerDonation")
            .its("response.statusCode")
            .should("be.oneOf", [200, 304]);
        cy.wait(500);

        cy.get("[data-cy=kidNumber]").should(($kid) => {
            const kid = $kid.text();
            expect(kid).to.be.length(8);
        });
    });
});

context("Window", () => {
    before(() => {
        cy.visit("http://localhost:3000");
    });

    it("End-2-End recurring bank donation", () => {
        const randomSum = Math.floor(Math.random() * 1000) + 100;
        cy.get("[data-cy=gi-button]").click();
        cy.pickRecurringDonation();
        cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
        cy.nextWidgetPane();

        cy.pickAnonymous();
        cy.get("[data-cy=bank-method]").click({ force: true });
        cy.wait(500);
        cy.intercept("POST", "/donations/register", {
            statusCode: 200,
            body: {
              status: 200,
              content: {
                  KID: "87397824",
                  donorID: 1464,
                  hasAnsweredReferral: false,
                  paymentProviderUrl: ""
              },
            },
          }).as("registerDonation");
        cy.nextWidgetPane();

        cy.wait(500);

        cy.intercept("POST", "/avtalegiro/draft", {
            statusCode: 200,
            body: {
              status: 200
            },
          }).as("draftAvtaleGiro");

        cy.get("[data-cy=avtalegiro-form]").submit();
    });
});

context("Window", () => {
    before(() => {
        cy.visit("http://localhost:3000");
    });

    it("End-2-End single vipps donation", () => {
        const randomSum = Math.floor(Math.random() * 1000) + 100;
        cy.get("[data-cy=gi-button]").click();
        cy.pickSingleDonation();
        cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
        cy.nextWidgetPane();

        cy.pickAnonymous();
        cy.get("[data-cy=vipps-method]").click({ force: true });
        cy.wait(500);
        cy.intercept("POST", "/donations/register", {
            statusCode: 200,
            body: {
              status: 200,
              content: {
                  KID: "87397824",
                  donorID: 1464,
                  hasAnsweredReferral: false,
                  paymentProviderUrl: ""
              },
            },
          }).as("registerDonation");
        cy.nextWidgetPane();

        cy.get("[data-cy=vipps-single-button]").within(() => {
            cy.get("button").click({ force: true });
        })
        cy.wait(500);
    });
});

context("Window", () => {
    before(() => {
        cy.visit("http://localhost:3000");
    });

    it("End-2-End recurring vipps donation", () => {
        const randomSum = Math.floor(Math.random() * 1000) + 100;
        cy.get("[data-cy=gi-button]").click();
        cy.pickRecurringDonation();
        cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
        cy.nextWidgetPane();

        cy.pickAnonymous();
        cy.get("[data-cy=vipps-method]").click({ force: true });
        cy.wait(500);
        cy.intercept("POST", "/donations/register", {
            statusCode: 200,
            body: {
              status: 200,
              content: {
                  KID: "87397824",
                  donorID: 1464,
                  hasAnsweredReferral: false,
                  paymentProviderUrl: ""
              },
            },
          }).as("registerDonation");
        cy.nextWidgetPane();

        cy.wait(500);

        cy.intercept("POST", "/vipps/agreement/draft", {
            statusCode: 200,
            body: {
              status: 200
            },
          }).as("draftVippsAgreement");

        cy.get("[data-cy=vipps-recurring-button]").within(() => {
            cy.get("button").click();
        })
        cy.wait(500);
    });
});


context("Window", () => {
    before(() => {
      cy.visit("http://localhost:3000");
    });
  
    it("End-2-End shared donation", () => {
      const randomSum = Math.floor(Math.random() * 1000) + 100;
      cy.get("[data-cy=gi-button]").click();
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=radio-custom-share]").click({ force: true });
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type(50);
    cy.get("[data-cy=org-11]").type(50);
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });
    cy.intercept("POST", "/donations/register", {
        statusCode: 200,
        body: {
            status: 200,
            content: {
                KID: "87397824",
                donorID: 1464,
                hasAnsweredReferral: false,
                paymentProviderUrl: ""
            },
        },
    }).as("registerDonation");
    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
        const kid = $kid.text();
        expect(kid).to.be.length(8);
        });
    });
  });

context("Window", () => {
    before(() => {
      cy.visit("http://localhost:3000");
    });
  
    it("End-2-End for all input fields", () => {
      const randomSum = Math.floor(Math.random() * 1000) + 100;
      cy.get("[data-cy=gi-button]").click();
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.get("[data-cy=name-input]").type("Donor Name");
    cy.get("[data-cy=email-input]").type("donor@email.com");
    cy.get("[data-cy=tax-deduction-checkbox]").click();
    cy.get("[data-cy=ssn-input]").type("916741057");
    cy.get("[data-cy=newsletter-checkbox]").click();
    cy.get("[data-cy=bank-method]").click({ force: true });
    cy.intercept("POST", "/donations/register", {
        statusCode: 200,
        body: {
            status: 200,
            content: {
                KID: "87397824",
                donorID: 973,
                hasAnsweredReferral: false,
                paymentProviderUrl: ""
            },
        },
    }).as("registerDonation");
    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
        const kid = $kid.text();
        expect(kid).to.be.length(8);
        });
    });
  });