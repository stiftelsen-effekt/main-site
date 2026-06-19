import "cypress-localstorage-commands";

Cypress.Commands.add("login", (overrides = {}) => {
  cy.clearLocalStorage();
  cy.ignorePlausibleTracking();
  Cypress.log({
    name: "loginAuth0",
  });

  const client_id = Cypress.env("AUTH_CLIENT_ID");
  const client_secret = Cypress.env("AUTH_CLIENT_SECRET");
  const audience = Cypress.env("AUTH_AUDIENCE");
  const scope =
    "openid profile email read:donations read:profile write:profile read:distributions read:agreements write:agreements";
  const username = Cypress.env("AUTH_USERNAME");
  const password = Cypress.env("AUTH_PASSWORD");

  const options = {
    method: "POST",
    url: `https://${Cypress.env("AUTH_DOMAIN")}/oauth/token`,
    failOnStatusCode: false,
    body: {
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      username,
      password,
      audience,
      scope,
      client_id,
      client_secret,
      realm: "Username-Password-Authentication",
    },
  };

  cy.request(options).then(({ body }) => {
    const [header, payload, signature] = body.id_token.split(".");
    const idTokenPayload = JSON.parse(Buffer.from(payload, "base64").toString("ascii"));
    const oauthTokenScope = "openid profile email";

    cy.window().then((win) => {
      win.localStorage.setItem(
        `@@auth0spajs@@::${client_id}::${audience}::${oauthTokenScope}`,
        JSON.stringify({
          body: {
            access_token: body.access_token,
            scope: oauthTokenScope,
            expires_in: body.expires_in,
            token_type: body.token_type,
            audience,
            oauthTokenScope,
            client_id,
          },
          expiresAt: Math.floor(Date.now() / 1000) + body.expires_in,
        }),
      );

      win.localStorage.setItem(
        `@@auth0spajs@@::${client_id}::@@user@@`,
        JSON.stringify({
          id_token: body.id_token,
          decodedToken: {
            encoded: { header, payload, signature },
            header: JSON.parse(Buffer.from(header, "base64").toString("ascii")),
            claims: { __raw: body.id_token, ...idTokenPayload },
            user: idTokenPayload,
          },
        }),
      );
    });

    cy.setCookie(`auth0.${client_id}.is.authenticated`, "true");
    cy.setCookie(`_legacy_auth0.${client_id}.is.authenticated`, "true");
  });
});

const getState = () => cy.window().its("store").invoke("getState");

const nextWidgetPane = () => {
  cy.get("[data-cy=next-button-div]")
    .last()
    .within(() => {
      cy.get("button").click();
      cy.wait(250);
    });
};

const prevWidgetPane = () => {
  cy.get("[data-cy=back-button]").click();
  cy.wait(250);
};

const checkNextIsDisabled = () => {
  cy.get("[data-cy=next-button-div]").within(() => {
    cy.get("button").should("have.css", "opacity", "0.5");
  });
};

const pickRecurringDonation = () => {
  cy.get("[data-cy=radio-recurring]").click({ force: true });
};

const registerDonationStub = () => {
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
};

const pickSingleDonation = () => {
  cy.get("[data-cy=radio-single]").click({ force: true });
};

const pickAnonymous = () => {
  cy.get("[data-cy=anon-checkbox]").click();
};

const inputDonorValues = () => {
  cy.react("TextInput", { props: { name: "name" } }).type("Cypress Test");
  cy.react("TextInput", { props: { name: "email" } }).type(`cypress@testeffekt.no`);
  cy.get("[data-cy=checkboxTaxDeduction]").click("left");
  cy.get("[data-cy=checkboxNewsletter]").click("left");
  cy.get("[data-cy=checkboxPrivacyPolicy]").click("left");

  cy.react("TextInput", { props: { name: "ssn" } }).type("123456789");
  cy.wait(500);
};

Cypress.Commands.add("getState", getState);
Cypress.Commands.add("nextWidgetPane", nextWidgetPane);
Cypress.Commands.add("prevWidgetPane", prevWidgetPane);
Cypress.Commands.add("checkNextIsDisabled", checkNextIsDisabled);
Cypress.Commands.add("pickRecurringDonation", pickRecurringDonation);
Cypress.Commands.add("pickSingleDonation", pickSingleDonation);
Cypress.Commands.add("pickAnonymous", pickAnonymous);
Cypress.Commands.add("inputDonorValues", inputDonorValues);

Cypress.Commands.add("ignorePlausibleTracking", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("plausible_ignore", "true");
  });
});

export {};
