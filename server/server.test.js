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

// test('Check to see if the chatbot ', async () => {    
//     try {
//         const response = await serverFunctions.GPT_API_CALL()   ;
//         expect(response).toBeDefined();
//     } catch (error) {
//         console.error('Error calling GPT API:', error);
//         expect(error).toBeNull();
//     }
// });