
/*
  functions that need to be required by the server.test.js file
*/
const axios = require("axios");

const globalServerFunctions = {
    
    GPT_CHAT_HISTORY: [{
        "role": "system",
        "content": `You are an assistant that helps explain PC parts, give PC builds with specific features (budget, range, fidelity), and guide users how to build PCs. You do not answer anything that isn't related to PC or PC parts.`
    }],

    GPT_API_CALL: async function (testMessage) {
        const apiUrl = "https://api.openai.com/v1/chat/completions";
        const apiKey = process.env.OPENAI_API_KEY;
        console.log("API Key: ", apiKey);

        try {
            const response = await axios.post(apiUrl, {
                model: "gpt-3.5-turbo-0125",
                messages: testMessage != null ? [
                    {
                        "role": globalServerFunctions.GPT_CHAT_HISTORY[0].role,
                        "content": globalServerFunctions.GPT_CHAT_HISTORY[0].content
                    },
                    {
                        "role": "user",
                        "content": testMessage,
                    }
                ] : globalServerFunctions.GPT_CHAT_HISTORY,
                temperature: 0.7,
                n: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response
        } catch (Error) {
            console.error(Error.message);
            return null
        }
    }

};

module.exports = globalServerFunctions