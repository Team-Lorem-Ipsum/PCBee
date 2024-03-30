const axios = require('axios');
const server = require('./server');
const builder = require('../client/js/builder');



test('Check if chatbot responds to user', async ()=>{
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
    expect(response).toBeDefined();
} );