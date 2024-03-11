(() => {
    const config = require(`${__dirname}/config/config`)
    const Utils = require(`${__dirname}/utils`)
    const fs = require('fs')
    const express = require('express')
    const app = express()
    const logs = []
    let countries = undefined  
    
    const getJsonData = async (url) => {
        const response = await fetch(url)
        const data = await response.json()
        return data
    } 
    //ebay OAuth
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
    ebayAuthToken = new EbayAuthToken({
      clientId: 'MatthewW-PCBee-PRD-8d10abed2-1575fa5e',
      clientSecret: 'PRD-d10abed232bd-dd2d-46cd-9cd7-52fb',
      redirectUri: 'Matthew_Widjaja-MatthewW-PCBee--ozkizh'
    });

    const clientScope = 'https://api.ebay.com/oauth/api_scope';
    // // Client Crendential Auth Flow
    ebayAuthToken.getApplicationToken('PRODUCTION', clientScope).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });

    // // Authorization Code Auth Flow
    let code = ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes); // get user consent url.
    // Using user consent url, you will be able to generate the code which you can use it for exchangeCodeForAccessToken.
    
    // // Exchange Code for Authorization token
    ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', code).then((data) => { // eslint-disable-line no-undef
      console.log(data);
    }).catch((error) => {
      console.log(error);
      console.log(`Error to get Access token :${JSON.stringify(error)}`);
    });

    // // Getting access token from refresh token obtained from Authorization Code flow
    const refreshToken = 'v^1.1#i^1#r^1#f^0#I^3#p^3#t^Ul4xMF8yOjNDMjU1MUI0OTJBMDg5NUZGMUY4RkEwNjk1MDRBQjQ2XzNfMSNFXjI2MA==';
    ebayAuthToken.getAccessToken('PRODUCTION', refreshToken, scopes).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log(`Error to get Access token from refresh token:${JSON.stringify(error)}`);
    });
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
        response.send(`${config.ROOT}/index.html`)
    })
    
    
   

   

    // Start Node.js HTTP webserver
    app.listen(config.PORT, "localhost", () => {
        console.log(`\t|Server listening on ${config.PORT}`)
    })
})()