const axios = require('axios');
const serverFunctions = require('./globalServerFunctions');
const { json } = require('body-parser');
let ebayTestingToken = ''; // Insert your eBay API token here

// ************************************************************************
// Note: The jest tests requires both API keys to be put manually inserted
// ************************************************************************
// The GPT API key is provided in the .env file
// The eBay API key is trickier, as it requires a user to login to eBay and get a token. One way to gain the token is to run the server and login to eBay, then copy the token from the console
// when navigating to the builder page. The token is only valid for a day as per eBay's policy, so it will need to be updated daily for testing purposes.

//Intergration testing
test('Check if api call exists and responds to users', async () => {
    if(expect(serverFunctions.GPT_API_CALL).toBeDefined()){
        try {
            const response = await serverFunctions.GPT_API_CALL();
            expect(response).toBeDefined();
        } catch (error) {
            console.error('Error calling GPT API:', error);
            expect(error).toBeNull();
        }
    }
});

test('Check to see if chatbot responds as a pc helper', async ()=>{
    const response = await serverFunctions.GPT_API_CALL("What's 9 + 10? If this is an irrelevant question, please respond with False");
        const completion = response.data.choices[0].message.content;
        const Test = completion.match(/[false|FALSE]+/g)
        if(expect(Test[0]).toBe("False")){
            response = await serverFunctions.GPT_API_CALL("Can you help me build a PC? If this is an relevant question, please respond with True");
            completion = response.data.choices[0].message.content;
            Test = completion.match(/[True|TRUE]+/g);
            expect(Test[0]).toBe("True");
        }
});

test('Check to see if chatbot creates proper build that follows users requirements', async ()=>{
    const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with ONLY the price of the entire build, nothing else");
    const completion = response.data.choices[0].message.content;        
    if(expect(completion).toBe("$800")){
        response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with ONLY the price of the entire build, nothing else");
        completion = response.data.choices[0].message.content;
        expect(completion).not.toBe("$100");
    }
});

test('Check to see if Ebay item exists and we can access its rating', async () => {
    let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    let q = `q=GPU`;
    let limit = `limit=${5}`;

    let response = await axios.get(`${url}?${q}&${limit}`, {
      headers: {
        Authorization: `Bearer ${ebayTestingToken}`,
        "Content-Type": "application/json",
      },
    });

    try {
        let title = response.data.itemSummaries[0].title.toUpperCase()
        let found = title.match("GPU")
        if(expect(found).toBeTruthy()){
            let itemrate = response.data.itemSummaries[0].seller.feedbackPercentage;
            expect(itemrate).toBeDefined();
        }

    } catch (err) {
        expect(err).toBeNull();
    }
});

//Unit testing
test('Check if the api call function exists', () => {
    expect(serverFunctions.GPT_API_CALL).toBeDefined();
})

test('Check if chatbot responds to user', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL();
        expect(response).toBeDefined();
    } catch (error) {
        console.error('Error calling GPT API:', error);
        expect(error).toBeNull();
    }
});

test('Check to see if the chatbot responds properly to irrelevant questions', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("What's 9 + 10? If this is an irrelevant question, please respond with False");
        const completion = response.data.choices[0].message.content;
        const Test = completion.match(/[false|FALSE]+/g)

        expect(Test[0]).toBe("False");
    } catch (error) {
    
        expect(error).toBeNull();
    }
});

test('Check to see if the chatbot responds properly to relevant questions', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC? If this is an relevant question, please respond with True");
        const completion = response.data.choices[0].message.content;
        const Test = completion.match(/[True|TRUE]+/g)
        
        expect(Test[0]).toBe("True");
    } catch (error) {
    
        expect(error).toBeNull();
    }
});

test('Check to see if chatbot responds with correct budgett', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with ONLY the price of the entire build, nothing else");
        const completion = response.data.choices[0].message.content;
            
        expect(completion).toBe("$800");
    } catch (error) {
    
        expect(error).toBeNull();
    }
});

test('Check to see if chatbot responds with correct budget #2', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with ONLY the price of the entire build, nothing else");
        const completion = response.data.choices[0].message.content;
            
        expect(completion).not.toBe("$100");
    } catch (error) {
    
        expect(error).toBeNull();
    }
});

test('Check to see if Ebay responds at all', async () => {
    let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    let q = `q=Banana`;
    let limit = `limit=${5}`;

    let response = await axios.get(`${url}?${q}&${limit}`, {
      headers: {
        Authorization: `Bearer ${ebayTestingToken}`,
        "Content-Type": "application/json",
      },
    });

    expect(response.data).toBeDefined();
})

test('Check to see if Ebay responds with correct item', async () => {
    let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    let q = `q=GPU`;
    let limit = `limit=${5}`;

    let response = await axios.get(`${url}?${q}&${limit}`, {
      headers: {
        Authorization: `Bearer ${ebayTestingToken}`,
        "Content-Type": "application/json",
      },
    });

    try {
        let title = response.data.itemSummaries[0].title.toUpperCase()
        
        let found = title.match("GPU")

        expect(found).toBeTruthy();

    } catch (err) {
        expect(err).toBeNull();
    }
});

test('Check to see if code catches incorrect response from eBay', async () => {
    let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    let q = `q=CPU`;
    let limit = `limit=${5}`;

    let response = await axios.get(`${url}?${q}&${limit}`, {
      headers: {
        Authorization: `Bearer ${ebayTestingToken}`,
        "Content-Type": "application/json",
      },
    });

    try {
        let title = response.data.itemSummaries[0].title.toUpperCase()
        
        let found = title.match("GPU")

        expect(found).toBeFalsy();

    } catch (err) {
        expect(err).toBeNull();
    }
});

test('Check if item rating exists', async ()=>{
    let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    let q = `q=iPhone14`;
    let limit = `limit=${5}`;
    let response = await axios.get(`${url}?${q}&${limit}`, {
        headers: {
          Authorization: `Bearer ${ebayTestingToken}`,
          "Content-Type": "application/json",
        },
      });
    try {  
        let itemrate = response.data.itemSummaries[0].seller.feedbackPercentage;
        expect(itemrate).toBeDefined();
      } catch (err) {
        expect(err).toBeNull();
      }
});

test('Check if item does not exist', async ()=>{
    let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    let q = `q=iPhone279069`;
    let limit = `limit=${5}`;
    let response = await axios.get(`${url}?${q}&${limit}`, {
        headers: {
          Authorization: `Bearer ${ebayTestingToken}`,
          "Content-Type": "application/json",
        },
      });
    try {  
        let itemExist = response.data.total;
        // console.log(itemExist);
        expect(itemExist).toBe(0);
        
      } catch (err) {
        expect(err).toBeNull();
      }
});

test('Check if eBay returns multiple recommendations', async ()=>{
    let url = "https://api.ebay.com/buy/browse/v1/item_summary/search";
    let q = `q=iPhone14`;
    let limit = `limit=${10}`;
    let response = await axios.get(`${url}?${q}&${limit}`, {
        headers: {
          Authorization: `Bearer ${ebayTestingToken}`,
          "Content-Type": "application/json",
        },
      });
    try {  
        let itemNum = response.data.itemSummaries;
        expect(itemNum.length).toBe(10);
      } catch (err) {
        expect(err).toBeNull();
      }
});