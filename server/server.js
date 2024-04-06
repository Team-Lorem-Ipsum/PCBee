const { json } = require("body-parser");
const req = require("express/lib/request");

(() => {
  const config = require(`${__dirname}/config/config`);
  const express = require("express");
  const axios = require("axios");
  const globalServerFunctions = require("./globalServerFunctions")

  require("dotenv").config();

  const app = express();
  const logs = [];
  //category ids for ebay
  const category_ids={
    "gpu": 27386,
    "cpu": 164,
    "memory": 170083,
    "motherboard": 1244,
    "caseFan": 131486,
    "case": 42014,
    "monitor": 80053
  };
  let isSignedIn = false;

  //current category
  let currentCat = "gpu";
  // ebay access token
  let access_token = "";
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
  ebayAuthToken.getApplicationToken("PRODUCTION", clientScope)
    .then((data) => {
      //console.log(data);
    })
    .catch((error) => {
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });

  // Authorization Code Auth Flow
  let userConsentUrl = ebayAuthToken.generateUserAuthorizationUrl("PRODUCTION",
    scopes
  ); // get user consent url.

  console.log("Authorization Code Auth Flow END");

  app.get("/isSignedIn", (req, res) => { 
    res.send(isSignedIn);
  });

  // eBay search item
  app.get("/search/:keyword", async (req, res) => {
    try {
      let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
      let q = `q=${req.params.keyword}`;
      let limit = `limit=${5}`;

      let response = await axios.get(`${url}?${q}&${limit}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      res.send(response.data);
    } catch (e) {
      console.error("Error fetching data from eBay API:", error);
      res.status(500).send("Error fetching data from eBay API");
    }
  });

    app.get("/login/ebay", (request, response) => {
      response.redirect(userConsentUrl);
    });

    app.get("/getAccessToken", (req, res) => {
      let jsonData = json.stringify({ access_token: access_token });
      res.send(jsonData);
    });

    app.get("/auth/ebay/callback", async (req, res) => {
      let code = req.query.code;
      let response = await ebayAuthToken.exchangeCodeForAccessToken("PRODUCTION", code)
        .then((data) => {
          console.log(data);
          let jsonData = JSON.parse(data);
          access_token = jsonData.access_token;
        })
        .catch((error) => {
          console.log(error);
          console.log(`Error to get Access token :${JSON.stringify(error)}`);
        });
      console.log("Access Token:", access_token);
      isSignedIn = true;
      res.redirect("/");

    });    

  /**
   * eBay item description redirect end point
   * redirect to  PATH/search/:category/:ItemId in builder.js
   * 
   * redirect new tab to item description page with category and item id
   */
   app.get("/item-desc/category=:category&itemName=:itemName", async (req, res) => {
    console.log("Redirecting to item description page");
      let category = req.params.category;
      let itemName = req.params.itemName;
      console.log(`category: ${category}, itemName: ${itemName}`);
      let redirectURL = `/item-description.html?category=${category}&itemName=${itemName}`;
      res.redirect(redirectURL);
   });

    // AI

app.post("/response/gpt", async (req, res) => {
    const message = req.body.prompt;
    
    // Add user message to chat history
    globalServerFunctions.GPT_CHAT_HISTORY.push({
        "role": "user",
        "content": message
    });
    try {
        const response = await globalServerFunctions.GPT_API_CALL();
        console.log(response);
        const completion = response.data.choices[0].message.content;

        // Add AI response to chat history
        globalServerFunctions.GPT_CHAT_HISTORY.push({
            "role": "assistant",
            "content": completion
        });

        res.send(completion);

    } catch (error) {
        console.error('Error calling GPT API:', error);
        res.status(500).send('Error calling GPT API');
    }
});

    // Start Node.js HTTP webserver
    app.listen(config.PORT, "0.0.0.0", () => {
      // 0.0.0.0 to host on render.com
      console.log(`\t|Server listening on ${config.PORT}`);
    });
  })();