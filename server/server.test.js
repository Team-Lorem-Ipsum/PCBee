const axios = require('axios');
const serverFunctions = require('./globalServerFunctions');
const { json } = require('body-parser');

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
        // if (error)
            // console.error('Error calling GPT API:', error);
    
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
        // if (error)
            // console.error('Error calling GPT API:', error);
    
        expect(error).toBeNull();
    }
});

test('Check to see if chatbot responds with correct budgett', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with ONLY the price of the entire build, nothing else");
        const completion = response.data.choices[0].message.content;
            
        expect(completion).toBe("$800");
    } catch (error) {
        // if (error)
            // console.error('Error calling GPT API:', error);
    
        expect(error).toBeNull();
    }
});

test('Check to see if chatbot responds with correct budget #2', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with ONLY the price of the entire build, nothing else");
        const completion = response.data.choices[0].message.content;
            
        expect(completion).not.toBe("$100");
    } catch (error) {
        // if (error)
            // console.error('Error calling GPT API:', error);
    
        expect(error).toBeNull();
    }
});

let ebayTestingToken = 'v^1.1#i^1#f^0#r^0#I^3#p^1#t^H4sIAAAAAAAAAOVYf2wTVRxf1w4YMEElqISxedMQGHe9u971x7EWum7LxthW1m5zRBz345UdtHfnvXcbRQxjIkRjEH8RkKhoYnBoiCQqCQIqmgAJUYyEYJjZosEQQ1zCP4Ah4l1bRjcJv9bEJbZNmvd93/d9n8/nfb/vvTuyZ0Lh/M21my8X2Sbm7+4he/JtNmoKWTihoPwBe/6sgjwyy8G2u+eJHkev/UIF5BNxjWsGUFMVCErXJuIK5FJGP2boCqfyUIacwicA5JDIRYINSzmaIDlNV5EqqnGstK7Kj/E05fXxUszNAJbhfV7TqtyIGVX9GOPyeT0eIALS43F5vC6zH0ID1CkQ8QryYzRJMzhp/aIkw5EujqYJt5ddjpW2Ah3KqmK6ECQWSMHlUmP1LKy3h8pDCHRkBsECdcGaSFOwrqq6MVrhzIoVyOgQQTwy4MhWSJVAaSsfN8Dtp4Epby5iiCKAEHMG0jOMDMoFb4C5D/gpqdmYwNI+WvCRtCh4KConUtaoeoJHt8dhWWQJj6VcOaAgGSXvpKiphrAaiCjTajRD1FWVWn/LDD4ux2Sg+7HqymB7MBzGAg08Qp2guw0PhyoBwMPNVbhXokheABKNU6yHjfEsyMySDpXReNQ0IVWRZEsxWNqookpgQgYjhXFxbJYwplOT0qQHY8iCk+3nHhaQWm6taHoJDdSpWIsKEqYKpanmneUfHo2QLgsGAsMRRnek9DFrStNkCRvdmUrETO6shX6sEyGNczq7u7uJbheh6qucNElSzqcalkbETpDgsbSvVeumv3znAbicoiICcySUOZTUTCxrzUQ1ASirsADjo2g3ndF9JKzAaOu/DFmcnSPLIVflIXrcFMtQZpUIbjfFgFyURyCToU4LBxD4JJ7g9TUAaXFeBLho5pmRALoscS42Rru8MYBLbl8MZ3yxGC6wkhunYgCQAAiC6PP+b6rkbvM8AkQdoFwlem6SHCaql7n1LqYlvK7NLbrLg4CqWdLQ1SJ2i06fs8HpWlZvNNbKQPOI/rsthVuSD8VlU5moOX/uBLBqPRci1KoQAWlM9CKiqoGwGpfF5PhaYJcuhXkdJSMgHjcNYyIZ1LS6nG3UuaF3L3vE/ZHO6en0X5xMt2QFrXwdX6ys8dAMwGsyYZ09hKgmnCpvXjosk1XrHSnUY+ItmxfWccXaJJlmK0vpmyaRokzALpHQAVQN3bxkE03W3SuqrgGKeZghXY3Hgd5KjbmYEwkD8UIcjLeqzkGCy/w4O2kpD0XTpIshx8ZLTJ2jHeNtS8rpPuxYeA+3aefIB/tAXupD9dqOkr22I/k2G1lBPkmVkY9PsLc47FNnQRkBQuZjBJRXKebzqg6INSCp8bKe/3DepQ/eqg3Nqm7aPv+5aPLUrmN5U7PeK+xeQT46/Gah0E5NyXrNQM6+2VNATXukiGbI9NdF08vJspu9DmqmY8bOp/vm7Xlz47sl5z46VHR+0ftzvMXXyaJhJ5utIM/Ra8tbMu2vwU3fn1445cSOFah9+h97rgwOccf3Tb64Em/YCz8u/Kq/v/2H6X2btr4+cdu89pmC8em3v9av38Q8dn7LwKQh8Xp55779kbIHqz4ZKF/5LPPFxpqT782bVLLzWvNp24EFv6uDM9dtOfvageIvsbe7Fn9eaZ/d/5Oj8sUH2hcJB19df/qC0nfgcoudPTn9ma3XDonPY79c7ZP6D/752UtH60va5g4c66j65uqlvg6lnj2MBrcOfL0ffyM0Z4O96eWTQXpi8SnHh2cY6mzrK/3ePTs2lKyefObqQ1eGLhLMby1tG6IzVhZv//ncO9+Fds39ceiFI9tOxPHjrQvK/Oz2xfW479Jm4/Devyua02v5D3CeYinxEQAA'
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
})