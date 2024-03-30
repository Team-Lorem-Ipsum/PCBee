const axios = require('axios');
const serverFunctions = require('./globalServerFunctions');

test('Check if chatbot responds to user', async () => {    
    try {
        const response = await serverFunctions.GPT_API_CALL();
        expect(response).toBeDefined();
    } catch (error) {
        console.error('Error calling GPT API:', error);
        expect(error).toBeNull();
    }
});

test('Check to see if the chatbot responds to irrelevant questions', async () => {    
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