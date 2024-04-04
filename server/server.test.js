const axios = require('axios');
const serverFunctions = require('./globalServerFunctions');

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

test('Check to see if chatbot responds with correct budge', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with only the price of the entire build");
        const completion = response.data.choices[0].message.content;
            
        expect(completion).toBe("$800");
    } catch (error) {
        // if (error)
            // console.error('Error calling GPT API:', error);
    
        expect(error).toBeNull();
    }
});

test('Check to see if chatbot responds with correct budge', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL("Can you help me build a PC with a budget of 800 dollars? Respond with only the price of the entire build");
        const completion = response.data.choices[0].message.content;
            
        expect(completion).not.toBe("$100");
    } catch (error) {
        // if (error)
            // console.error('Error calling GPT API:', error);
    
        expect(error).toBeNull();
    }
});

// test('', async() => {

// })