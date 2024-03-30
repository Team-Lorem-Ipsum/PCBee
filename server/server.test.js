const axios = require('axios');
const serverFunctions = require('./globalServerFunctions');

test('CHeck if the api call function exists', () => {
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
        
        console.log(Test[0])

        expect(Test[0]).toBe("True");
    } catch (error) {
        // if (error)
            // console.error('Error calling GPT API:', error);
    
        expect(error).toBeNull();
    }
});