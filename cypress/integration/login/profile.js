// describe("End-to-end test", () => {
//   it("Test secure log-in", () => {
//     cy.request(options);
//     cy.visit("http://konduit.no");
//     cy.get('a[href*="/profile"]').click();
//   });
// });

describe("login", () => {
  it("should successfully log into our app", () => {
    cy.login()
      .then((resp) => {
        console.log(resp.body);
        return resp.body;
      })
      .then((body) => {
        const { access_token, expires_in, id_token } = body;
        const auth0State = {
          nonce: "",
          state: "some-random-state",
        };
        // const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
        // cy.visit(callbackUrl, {
        //   onBeforeLoad(win) {
        //     win.document.cookie =
        //       "com.auth0.auth.some-random-state=" + JSON.stringify(auth0State);
        //   },
        // });
        cy.visit("https://konduit.no/");
      });
  });
});
