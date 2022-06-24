import "cypress-localstorage-commands";
import jwt_decode from "jwt-decode";

Cypress.Commands.add("login", (overrides = {}) => {
  cy.clearLocalStorage();
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
    const auth0State = {
      nonce: "",
      state: "some-random-state",
    };
    const claims = jwt_decode(body.access_token);
    const { nickname, name, picture, updated_at, email, email_verified, sub, exp } = claims;

    const item = {
      body: {
        client_id,
        access_token: body.access_token,
        id_token: body.id_token,
        scope,
        expires_in: body.expires_in,
        token_type: body.token_type,
        decodedToken: {
          user: JSON.parse(Buffer.from(body.id_token.split(".")[1], "base64").toString("ascii")),
        },
        audience,
      },
      expiresAt: exp,
    };

    cy.window().then((win) => {
      win.localStorage.setItem(
        `@@auth0spajs@@::${client_id}::${audience}::${scope}`,
        JSON.stringify(item),
      );
      // cy.reload();
    });
  });
});

const getState = () => cy.window().its("store").invoke("getState");

const pickRecurring = (recurring) => {
  cy.react("RadioButton", {
    props: { value: recurring ? 1 : 0 },
  }).click();
};

const pickMethod = (methodName) => {
  cy.react("MethodButton", { props: { className: methodName } }).click();
  cy.wait(500);
};

const pickAnonymous = () => {
  cy.react("RichSelectOption", {
    props: { value: DonorType.ANONYMOUS },
  }).click();
};

// TODO: Use this in a test
const inputDonorValues = () => {
  cy.react("TextInput", { props: { name: "name" } }).type("Cypress Test");
  cy.react("TextInput", { props: { name: "email" } }).type(
    `cypress@testeffekt.no`
  );
  cy.get("[data-cy=checkboxTaxDeduction]").click("left");
  cy.get("[data-cy=checkboxNewsletter]").click("left");
  cy.get("[data-cy=checkboxPrivacyPolicy]").click("left");

  cy.react("TextInput", { props: { name: "ssn" } }).type("123456789");
  cy.wait(500);
};

Cypress.Commands.add("getState", getState);
Cypress.Commands.add("pickRecurring", pickRecurring);
Cypress.Commands.add("pickMethod", pickMethod);
Cypress.Commands.add("pickAnonymous", pickAnonymous);
Cypress.Commands.add("inputDonorValues", inputDonorValues);

export {};
