//chat gt openai api implementation
import OpenAi from "openai";

require("dotenv").config();

const openAIClient= new OpenAi({apikey: process.env['OPENAI_API_KEY']})

const chatcompletion = await openAIClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    message : []
    
})

// DECLARATIONS
let select = document.querySelector("#category-select");

// setCategory
const setCategory = () => {
    console.log("hit");
    let heading = document.querySelector("#category-title");
    let value = select.value;
    heading.innerHTML = value;
}

/**
 * function to change h4 category title
 * @param {*} newName 
 */
function changeName(newName) {
    document.getElementById('category-title').textContent = newName;
}

select.addEventListener("change", setCategory);

/**
 * gpt front end section
*/

let button = document.getElementById('sendButton')
let chatInput = document.getElementById('input')

let chatBox = document.querySelector('.chatBox')
let chatBoxFrame = document.querySelector('.chatBoxFrame')

/**
 * this function is used to create chat bubbles inside the chatbox
 * @param {*} args 
 */
const createBubble = (args) => {
    let text = args.Message
    let className = args.Class
    
    let chatBubble = document.createElement('li')
    chatBubble.classList.add(className);
    chatBubble.innerHTML = `<h1 class=${className}>${className == 'userChat' ? 'You' : 'ChatBot'}</h1> <p>${text}</p>`
    
    chatBox.appendChild(chatBubble);
    chatBoxFrame.scrollTo(0, chatBoxFrame.scrollHeight)
}

/**
 * this function is used to handle messaging
 * @param {*} args 
 * @returns 
 */
const sendChat = (args) => {
    if (!args.Message)
        return

    createBubble(args)
}

/**
 * this handles the click button effect
 * @param {} button 
 */
let buttonFlicker = (button) => {
    button.classList.add('sendButton')
}

/**
 * this is initializes everything above
 */
button.addEventListener('click', function() {
    var button = this;
    
    sendChat({
        Class: 'userChat',
        Message: chatInput.value
    });

    buttonFlicker(button)
});