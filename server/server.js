(() => {
    const config = require(`${__dirname}/config/config`)
    const express = require('express')
    const app = express()
    const logs = []
    
    
    // // Exchange Code for Authorization token
    // ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', code).then((data) => { // eslint-disable-line no-undef
    //   console.log(data);
    // }).catch((error) => {
    //   console.log(error);
    //   console.log(`Error to get Access token :${JSON.stringify(error)}`);
    // });
    // console.log('Exchange Code for Authorization token END');

    // // Getting access token from refresh token obtained from Authorization Code flow
    // const refreshToken = 'v^1.1#i^1#r^1#f^0#I^3#p^3#t^Ul4xMF8yOjNDMjU1MUI0OTJBMDg5NUZGMUY4RkEwNjk1MDRBQjQ2XzNfMSNFXjI2MA==';
    // ebayAuthToken.getAccessToken('PRODUCTION', refreshToken, scopes).then((data) => {
    //   console.log(data);
    // }).catch((error) => {
    //   console.log(`Error to get Access token from refresh token:${JSON.stringify(error)}`);
    // });
    // console.log('Getting access token from refresh token END');

    //ebay OAuth END

    /**
     * Middleware declarations
     */
    app.use(express.json());
    app.use((request, response, next) => {
        config.logFile(request, logs)
        next()
    })
    
    
    app.use(express.static(`${__dirname}/../client`))
    
    app.get('/',  (request, response) => {
        response.send(`${config.ROOT}/index.html`);
    })
    
    //ebay OAuth
    const EbayAuthToken = require('ebay-oauth-nodejs-client');

    console.log('ebay OAuth');
    const scopes = ['https://api.ebay.com/oauth/api_scope',
        'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.marketing',
        'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.inventory',
        'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.account',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment'
    ];
        // pass the credentials through constructor
    let ebayAuthToken = new EbayAuthToken({
      clientId: 'MatthewW-PCBee-PRD-8d10abed2-1575fa5e',
      clientSecret: 'PRD-d10abed232bd-dd2d-46cd-9cd7-52fb',
      redirectUri: 'Matthew_Widjaja-MatthewW-PCBee--ozkizh'
    });

    const clientScope = 'https://api.ebay.com/oauth/api_scope';
    // // Client Crendential Auth Flow
    ebayAuthToken.getApplicationToken('PRODUCTION', clientScope).then((data) => {
      //console.log(data);
    }).catch((error) => {
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });

    // Authorization Code Auth Flow
    let userConsentUrl = ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes); // get user consent url.
    
    console.log('Authorization Code Auth Flow END');

    app.get('/login/ebay', (request, response) => {
      response.redirect(userConsentUrl);
    });
    
    app.get("/auth/ebay/callback", (req, res) => {
      axios("https://api.ebay.com/identity/v1/oauth2/token", {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              `client public key:client secret keys`
            )
        },
        data: qs.stringify({
          grant_type: "authorization_code",
          // parsed from redirect URI after returning from eBay,
          code: req.query.code,
          // this is set in your dev account, also called RuName
          redirect_uri: "Matthew_Widjaja-MatthewW-PCBee--ozkizh"
        })
      })
        .then(response => console.log(response))
        .catch(err => console.log(err));
        response.redirect(`${config.ROOT}/index.html`);
    });
   


    // Start Node.js HTTP webserver
    app.listen(config.PORT, "localhost", () => {
        console.log(`\t|Server listening on ${config.PORT}`)
    })
})()