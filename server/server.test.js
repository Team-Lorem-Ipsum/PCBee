const axios = require('axios');
const serverFunctions = require('./globalServerFunctions');
const { json } = require('body-parser');
let ebayTestingToken = 'v^1.1#i^1#f^0#p^1#I^3#r^0#t^H4sIAAAAAAAAAOVYa2zTVhRO+pqgLQjBXmUawWxDhcW5duIk9ppMIS1tgLRp0xaoYMixr1sPxzb2ddvspa5M7CG0/RlIg6FVaN0PQGibEGLS6BCToPwBtCHYxEsMjU17gDZpQnSbmO2EknaIVyOt0iJL0T333HO/77vn3Htt0Fc2ZcGGhg1XK50PFA30gb4ip5MoB1PKShdOKy6qKnWAPAfnQN8TfSX9xT/W6GxaUpkWqKuKrENXb1qSdcY2hjBDkxmF1UWdkdk01BnEMclIfBlD4oBRNQUpnCJhrlhtCPN6WZYAfgF6eR9J+QKmVb4Rs1UJYb6Ul+S4oJcgBMrLenmzX9cNGJN1xMoohJGA9LmB+VCtwMcQNEOROB0EHZirHWq6qMimCw6wsA2XscdqeVhvD5XVdaghMwgWjkUWJ5sisdq6xtYaT16scE6HJGKRoY9tRRUeutpZyYC3n0a3vZmkwXFQ1zFPODvD2KBM5AaY+4BvS01zQZKjg34aBlOCAKiCSLlY0dIsuj0OyyLybsF2ZaCMRJS5k6KmGqnnIYdyrUYzRKzWZf01G6wkCiLUQljdosjKSCKBheMsQl2wZ7k7EV0EoTvRUusO8gRgU5An3QQVoASWgrlZsqFyGo+bJqrIvGgpprsaFbQImpDheGFAnjCmU5PcpEUEZMHJ9/PfEDAQ6LBWNLuEBuqSrUWFaVMFl928s/yjoxHSxJSB4GiE8R22PiGMVVWRx8Z32omYy51ePYR1IaQyHk9PTw/e48UVrdNDAkB4VsSXJbkumGaxrK9V66a/eOcBbtGmwkFzpC4yKKOaWHrNRDUByJ1Y2EcTpJ/M6T4WVni89V+GPM6eseVQqPJICQHI+1m/j6Z9RCBVkJ0mnMtQj4UDptiMO81qayFSJZaDbs7MMyMNNZFnvJRAeoMCdPN+WnD7aEFwpyje7yYECAGEqZRZuP+bKrnbPE9CToOoUIlemCTX03XNfq3b15Z4Ybmf8y+MQGLxknh3G9fDeWhP3ONtXmo0NohQDXChuy2FW5KPSqKpTKs5f+EEsGq9ECI0KDqC/IToJTlFhQlFErnM5Fpgr8YnWA1lklCSTMOESEZUNVawjbow9O5lj7g/0gU9nf6Lk+mWrHQrXycXK2u8bgZgVRG3zh6cU9IehTUvHZbJqvU1NuoJ8RbNC+ukYm2SzLIV+exNE7cp43o3h2tQVwzNvGTjTdbdq1VZC2XzMEOaIklQaycmXMzptIHYlAQnW1UXIMFFdpKdtESAIEkaBOiJ8eLsc3TNZNuSCroPlzxzD7dpz9gX+7DD/hH9zoOg3zlU5HSCGvAkMQ/MLStuKymuqNJFBHGRFXBd7JTN91UN4mthRmVFrWim4/ftmxqiVXVNmxe82Jo5vvWwoyLvu8LAavDI6JeFKcVEed5nBvDYzZ5SYvrDlaQP+AAFfARNkR1g3s3eEuKhkllbDv51sXL7jPrdF/bEzjZculZsXKoGlaNOTmepo6Tf6Wi7+Oihkd3H3puzwlU2s+JMJF6+tPYLoRe2bQ30nxk5LCwjD9R3fBXnBv8YdLyy/tTG5rknuw89ffHAyjXbkguXXP9886yf9wWPHNr1/bGj381ZX7/prXN7Kz97+RP58kdLq/dGh9cP8ucPnq4auDL1nZbDl4ZmfZCM7yzbfvWbN6X26Y5y440tDbu622cfvVDXhQ2d+fTPPb37d53/+/WNFRfmj/ywLvwrVv36kc2bhn85sWPjvqfafxuYP23HIPHTs+vOHj852DL04fszXr16VG6Jx6Zeob6tfvzLbTXDSteq06+t+Lh+annwpeG3qefKT5wamddJxAaMVfHu6/O/Js5VX3lw9e79jfve3Tn7WvRydi3/ATPLnFbxEQAA'

// ************************************************************************
// Note: The jest tests requires both API keys to be put manually inserted
// ************************************************************************

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