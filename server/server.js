(() => {
  const config = require(`${__dirname}/config/config`);
  const express = require("express");
  const axios = require("axios");
  const app = express();
  const logs = [];
  let access_token;
  /**
   * Middleware declarations
   */
  app.use(express.json());
  app.use((request, response, next) => {
    config.logFile(request, logs);
    next();
  });

  app.use(express.static(`${__dirname}/../client`));

  app.get("/", (request, response) => {
    response.send(`${config.ROOT}/index.html`);
  });

  //ebay OAuth
  const EbayAuthToken = require("ebay-oauth-nodejs-client");

  console.log("ebay OAuth");
  const scopes = [
    "https://api.ebay.com/oauth/api_scope",
    "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.marketing",
    "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.inventory",
    "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.account",
    "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  ];
  // pass the credentials through constructor
  let ebayAuthToken = new EbayAuthToken({
    clientId: "MatthewW-PCBee-PRD-8d10abed2-1575fa5e",
    clientSecret: "PRD-d10abed232bd-dd2d-46cd-9cd7-52fb",
    redirectUri: "Matthew_Widjaja-MatthewW-PCBee--ozkizh",
  });

  const clientScope = "https://api.ebay.com/oauth/api_scope";
  // // Client Crendential Auth Flow
  ebayAuthToken
    .getApplicationToken("PRODUCTION", clientScope)
    .then((data) => {
      //console.log(data);
    })
    .catch((error) => {
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });

  // Authorization Code Auth Flow
  let userConsentUrl = ebayAuthToken.generateUserAuthorizationUrl(
    "PRODUCTION",
    scopes
  ); // get user consent url.

  console.log("Authorization Code Auth Flow END");

  app.get("/login/ebay", (request, response) => {
    response.redirect(userConsentUrl);
  });

  app.get("/auth/ebay/callback", async(req, res) => {
    let code = req.query.code;
    let access_token = await ebayAuthToken.exchangeCodeForAccessToken("PRODUCTION", code)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });
    console.log("Access Token:", access_token); // access_token is undefined???
    res.redirect("/");

  });

  // Start Node.js HTTP webserver
  app.listen(config.PORT, "0.0.0.0", () => {
    // 0.0.0.0 to host on render.com
    console.log(`\t|Server listening on ${config.PORT}`);
  });
})();
