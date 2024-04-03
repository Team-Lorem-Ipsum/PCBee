const { json } = require("body-parser");
const req = require("express/lib/request");

(() => {
  const config = require(`${__dirname}/config/config`);
  const express = require("express");
  const axios = require("axios");

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

  //current category
  let currentCat = "gpu";
  // ebay access token
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
      res.redirect("/");

    });    
   // eBay popular item
  // 
  // 
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

const chatHistory = [{
  "role": "system",
  "content": `You are an assistant that helps explain PC parts, give PC builds with specific features (budget, range, fidelity), and guide users how to build PCs. You do not answer anything that isn't related to PC or PC parts.`
}];

app.post("/response/gpt", async (req, res) => {
    const message = req.body.prompt;
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey = "";
    // Add user message to chat history
    chatHistory.push({
        "role": "user",
        "content": message
    });
    try {
        const response = await axios.post(apiUrl, {
            model: "gpt-3.5-turbo-0125",
            messages: chatHistory,
            temperature: 0.7,
            n: 1
        }, {
            headers: {
                'Authorization':  `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const completion = response.data.choices[0].message.content;

        // Add AI response to chat history
        chatHistory.push({
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