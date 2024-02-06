import mockDonor from "../../fixtures/no/donor.json";

describe("Widget", () => {
  beforeEach(() => {
    cy.fixture("cause_areas")
      .then((causeAreas) => {
        cy.intercept("GET", "/causeareas/active", {
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

    cy.visit("/");
    cy.wait(500);
    cy.get("[data-cy=gi-button]").click();
  });

  it("End-2-End single bank donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
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

    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("End-2-End recurring avtalegiro donation", () => {
    /**
     * Ignore iframeLoaded error on nets iframe
     */
    cy.origin("https://pvu.nets.no", () => {
      cy.on("uncaught:exception", (e) => {
        if (e.message.includes("iframeLoaded is not defined")) {
          // we expected this error, so let's ignore it
          // and let the test continue
          return false;
        }
      });
    });

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickRecurringDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=avtalegiro-method]").click({ force: true });
    cy.wait(500);

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
    cy.nextWidgetPane();

    cy.wait(500);

    cy.intercept("POST", "/avtalegiro/draft", {
      statusCode: 200,
      body: {
        status: 200,
      },
    }).as("draftAvtaleGiro");

    cy.get("[data-cy=avtalegiro-form]").submit();
  });

  it("End-2-End single vipps donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
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
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");
    cy.nextWidgetPane();

    cy.get("[data-cy=vipps-single-button]").within(() => {
      cy.get("button").click({ force: true });
    });
    cy.wait(500);
  });

  it("End-2-End recurring vipps donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickRecurringDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
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
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");
    cy.nextWidgetPane();

    cy.wait(500);

    cy.intercept("POST", "/vipps/agreement/draft", {
      statusCode: 200,
      body: {
        status: 200,
      },
    }).as("draftVippsAgreement");

    cy.get("[data-cy=vipps-recurring-button]").within(() => {
      cy.get("button").click();
    });
    cy.wait(500);
  });

  it("End-2-End shared donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]")
      .first()
      .find("[data-cy=smart-distribution-toggle]")
      .click({ force: true });
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type(500); // should truncate numbers ove 100
    cy.checkNextIsDisabled();
    cy.get("[data-cy=org-12]").type("{moveToStart}");
    cy.get("[data-cy=org-12]").type("-"); // should ignore negative numbers
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

    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("End-2-End for all input fields", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
    cy.nextWidgetPane();

    cy.prevWidgetPane();
    cy.get("[data-cy=donation-sum-input]").clear();
    cy.get("[data-cy=donation-sum-input]").type(0);
    cy.checkNextIsDisabled();
    cy.get("[data-cy=donation-sum-input]").type(1);
    cy.nextWidgetPane();

    cy.wait(500);
    cy.checkNextIsDisabled();
    cy.get("[data-cy=name-input]").type("Donor Name");
    cy.get("[data-cy=email-input]").type("donor@email.com");
    cy.get("[data-cy=tax-deduction-checkbox]").click();
    cy.get("[data-cy=ssn-input]").type("916741057"); // Check 9 digit organization number
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

    cy.nextWidgetPane();

    cy.prevWidgetPane();
    cy.get("[data-cy=ssn-input]").clear();
    cy.get("[data-cy=ssn-input]").type("1234567890"); // 10 digits invalid snn
    cy.checkNextIsDisabled();

    cy.get("[data-cy=ssn-input]").clear();
    cy.get("[data-cy=ssn-input]").type("10915596784"); // 11 digits valid ssn
    cy.get("[data-cy=email-input]").clear();
    cy.get("[data-cy=email-input]").type("incorrect email");
    cy.checkNextIsDisabled();

    cy.get("[data-cy=email-input]").clear();
    cy.get("[data-cy=email-input]").type("donor@email.com");
    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });

    cy.intercept("POST", "/referrals", {
      statusCode: 200,
      body: {
        status: 200,
      },
    }).as("postReferrals");

    cy.get("[data-cy=referral-button-1]").click();
    cy.get("[data-cy=referral-button-10]").click();
    cy.get("[data-cy=referral-text-input]").type("Referral text");
  });

  it("End-2-End for existing donor", () => {
    cy.login();

    cy.intercept("GET", "/donors/*/", {
      statusCode: 200,
      body: {
        status: 200,
        content: mockDonor,
      },
    }).as("getDonor");

    cy.fixture("donations")
      .then((donations) => {
        cy.intercept("GET", "/donors/*/donations", {
          statusCode: 200,
          body: {
            status: 200,
            content: donations,
          },
        });
      })
      .as("getDonations");

    cy.fixture("aggregated")
      .then((aggregateddonations) => {
        cy.intercept("GET", "/donors/*/donations/aggregated", {
          statusCode: 200,
          body: {
            status: 200,
            content: aggregateddonations,
          },
        });
      })
      .as("getAggregated");

    cy.fixture("kids_donations")
      .then((kids) => {
        cy.intercept("GET", "/donors/*/distributions/*", {
          statusCode: 200,
          body: {
            status: 200,
            content: kids,
          },
        });
      })
      .as("getDistribution");

    cy.fixture("referrals").then((referrals) => {
      cy.intercept("GET", "/referrals/types", {
        statusCode: 200,
        body: {
          status: 200,
          content: referrals,
        },
      }).as("getReferrals");
    });

    cy.fixture("organizations").then((orgs) => {
      cy.intercept("GET", "/organizations/all", {
        statusCode: 200,
        body: {
          status: 200,
          content: orgs,
        },
      }).as("getOrganizations");
    });

    cy.fixture(`evaluations/evaluations.json`)
      .then((evaluations) => {
        cy.intercept(
          "https://impact.gieffektivt.no/api/evaluations?charity_abbreviation=*&currency=*&language=*&donation_year=*&donation_month=*",
          (req) => {
            const [, abbriv, year, month] = req.url.match(
              /.*abbreviation=(.*)\&currency.*year=(\d{4}).*month=(\d{1,2})/,
            );
            const filename = `${year}-${month}-${abbriv}`;
            if (evaluations[filename]) {
              req.reply(evaluations[filename]);
            } else {
              req.reply({ evaluations: [] });
            }
          },
        ).as("getEvaluations");
      })
      .as("evaluationFixture");

    cy.fixture("grants")
      .then((grants) => {
        cy.intercept(
          "GET",
          "https://impact.gieffektivt.no/api/max_impact_fund_grants?currency=*&language=*&*",
          {
            statusCode: 200,
            body: grants,
          },
        ).as("getGrants");
      })
      .as("grantsFixture");

    cy.wait(500);
    cy.visit("/min-side");

    cy.wait(
      ["@getDonor", "@getDonations", "@getAggregated", "@getDistribution", "@getCauseAreas"],
      {
        timeout: 30000,
      },
    );

    cy.get("[data-cy=send-donation-button]").click();

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=cause-area]").first().type("100");
    cy.nextWidgetPane();

    cy.get("[data-cy=name-input]").should("have.value", mockDonor.name);
    cy.get("[data-cy=email-input]").should("have.value", mockDonor.email);

    cy.get("[data-cy=bank-method]").click({ force: true });
    cy.wait(500);

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("donor");
      expect(req.body.donor).to.have.property("email", mockDonor.email);
      expect(req.body.donor).to.have.property("name", mockDonor.name);

      req.reply({
        statusCode: 200,
        body: {
          status: 200,
          content: {
            KID: "87397824",
            donorID: mockDonor.id,
            hasAnsweredReferral: false,
            paymentProviderUrl: "",
          },
        },
      });
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", (req) => {
      expect(req.body).to.eql(`data={"KID":"87397824", "sum":${randomSum}}`);

      req.reply({
        statusCode: 200,
        body: {
          status: 200,
          content: "OK",
        },
      });
    }).as("bankPending");

    cy.nextWidgetPane();
  });
});
