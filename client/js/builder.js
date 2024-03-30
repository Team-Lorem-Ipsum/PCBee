//chat gt openai api implementation

// DECLARATIONS
let select = document.querySelector("#category-select");
let jsonData = new Map();
let selectedItems = document.querySelector(".selected-items")
let productListing = document.querySelector(".product-listing");
let itemsInCart = 0;
let categories = ["case", "gpu", "cpu", "caseFan", "memory", "monitor", "motherboard"]
const maxListing = 50;

/**
 * fetches a json
 * @param name of JSON file
 * @return data from JSON
 */
const fetchJSON = async (name) => {
    try{
        let response = await fetch(`data/${name}.json`);
        let data = await response.json();
        return data;
    } catch (error) {
        console.log("Error: " + error);
    }
}

/** ==================================
 *  PC BUILDER SECTION
 *  ==================================
 */ 

/**
 * create product listing bubble
 * @param category of the item
 * @param name of the item
 * @param price of the item
 * @listing whether or not its part of the item listing (true) or cart (false)
 */
const createListing = (category, name, price, listing) => {
    // create wrapper div
    let wrapper = document.createElement("div");
    wrapper.classList.add("rounded-start", "item-listing", "d-flex", "p-3");

    // create the img div and product img
    let divImg = document.createElement("div");
    divImg.classList.add("col", "col-sm-4");

    let img = document.createElement("img");
    img.src = `./assets/${category}.png`;
    img.alt = category;

    // create description div, filled with item name and price
    let divDesc = document.createElement("div");
    divDesc.classList.add("col", "col-sm-8", "d-flex", "flex-column");

    let itemName = document.createElement("h5");
    itemName.textContent = name;

    let desc = document.createElement("p");
    price = price? `$${price}`: "Not available";
    desc.innerHTML = `Price: ${price}`;

    // create the add button if its for listing
    // create the search and remove item for cart
    let addBtn = document.createElement("button");
    addBtn.innerHTML = listing?"Add to List":"Search Item";
    addBtn.classList.add("btn", "w-50");
    if (listing) // if bubble is for product listing, NOT cart
        addBtn.addEventListener("click", () => addToCart(category, name, price));
    else
        addBtn.addEventListener("click", async (name, category) => await fetch(`/searchResult/${category}`)); // TODO

    let rmButton;
    if (!listing) { // if its not for listing
        rmButton = document.createElement("button");
        rmButton.innerHTML = "Remove";
        rmButton.classList.add("btn", "w-50", "mt-1");
        rmButton.addEventListener("click", () => {
            wrapper.remove();
            updateTotalCost();
            itemsInCart--;
            if (!itemsInCart) 
                clearAll();
            showNotification("Item has been removed");
        });
    }

    // append all elements
    divImg.appendChild(img);
    divDesc.appendChild(itemName);
    divDesc.appendChild(desc);
    divDesc.appendChild(addBtn);
    if (rmButton)
        divDesc.appendChild(rmButton)
    wrapper.appendChild(divImg);
    wrapper.appendChild(divDesc);

    if (listing) // if bubble is for product listing, NOT cart
        productListing.appendChild(wrapper);  
    else
        selectedItems.appendChild(wrapper);
}

/**
 * changes the category header of listing through dropdown
 */
const setCategory = () => {
    let heading = document.querySelector("#category-title");
    let value = select.value;
    let options = select.childNodes;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value == value)
            heading.innerHTML = options[i].innerHTML;
    }
  
    setListing(value);
}

/**
 * changes the category header of listing through image clicker
 * @param {*} value of img (category)
 */
const setCategoryThruImg = (value) => {
    let heading = document.querySelector("#category-title");
    let options = select.childNodes;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value == value)
            heading.innerHTML = options[i].innerHTML;
    }
  
    setListing(value);
}

/**
 * changes the listing when category is changed
 * @param {*} category newly selected category
 */
const setListing = (category) => {
    let data = jsonData.get(category);
    productListing.innerHTML = "";
    for (let i = 0; i < maxListing; i++) {
        let name = data[i].name;
        let price = data[i].price;
        createListing(category, name, price, true);
    }
}

/**
 * adds item to cart
 * @param {*} category of item
 * @param {*} name of item
 * @param {*} price of item
 */
const addToCart = (category, name, price) => {
    // if cart is empty
    if (!itemsInCart) {
        selectedItems.innerHTML = ""; // clears cart

        // create search all button
        let searchBtn = document.createElement("button");
        searchBtn.id = "search-all"
        searchBtn.style = "background-color: var(--custom-myNavbar);";
        searchBtn.classList.add("btn", "w-50", "mt-2", "m-auto");
        searchBtn.innerHTML = "Search All";

        // create total cost header
        let totalCost = document.createElement("h5");
        totalCost.id = "total-cost";

        // create clear all button
        let clearBtn = document.createElement("button");
        clearBtn.id = "clear-all"
        clearBtn.style = "background-color: var(--custom-myNavbar);";
        clearBtn.classList.add("btn", "w-50", "mt-2", "m-auto");
        clearBtn.innerHTML = "Clear All";
        clearBtn.addEventListener("click", () => clearAll());

        document.querySelector(".pc-builder > div").appendChild(totalCost);
        document.querySelector(".pc-builder > div").appendChild(searchBtn);
        document.querySelector(".pc-builder > div").appendChild(clearBtn);
    }
    price = parseFloat(price.split("$")[1]); // to account for ther dollar sign
    itemsInCart += 1;
    createListing(category, name, price, false);
    updateTotalCost();
    showNotification("Item has been added");
};

/**
 * clears and reset the cart
 */
const clearAll = () => {
    let searchBtn = document.getElementById("search-all");
    let totalCost = document.getElementById("total-cost")
    let clearBtn = document.getElementById("clear-all");
    let h5 = document.createElement("h5");

    searchBtn.remove();
    totalCost.remove();
    clearBtn.remove();
    selectedItems.innerHTML = "";
    
    h5.innerHTML = "Start adding items to see them here!";
    selectedItems.appendChild(h5);
    itemsInCart = 0;
};

/**
 * updates the total cost
 */
const updateTotalCost = () => {
    let totalCostHeader = document.getElementById("total-cost");
    let items = selectedItems.childNodes; 
    let totalCost = 0;

    // loops through all items in cart
    items.forEach((item) => {
        let price = item.childNodes[1].childNodes[1].innerHTML;
        if (price == "Price: Not available") // if price data is not available
            price = 0;
        else
            price = price.split("$")[1];
        totalCost += parseFloat(price);
    })
    totalCostHeader.innerHTML = `Total: $${totalCost}`;
};

/**
 * shows notification on screen
 * @param {*} message the message to be displayed
 */
const showNotification = (message) => {
    let notice = document.createElement("div");
    let icon = document.createElement("i");

    icon.classList.add("bi", "bi-check", "h5");
    notice.textContent = message;
    notice.classList.add("notification");
    notice.appendChild(icon);
    document.body.appendChild(notice);

    setTimeout(() => {
        notice.remove();
    }, 2000); 
}

select.addEventListener("change", setCategory);





/** ==================================
 *  GPT CHATBOT SECTION
 *  ==================================
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
async function sendChat(args) {
    console.log(args.Message)
    if (!args.Message)
        return

    createBubble(args)
    chatInput.value = ''

    // chat gpt respond here
    try {
        const response = await fetch('/response/gpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: args.Message  
            })
        });

        if (!response.ok)
            throw new Error('failed to catch')

        const AI_response = await response.text();
        console.log(AI_response);      
        
        createBubble({
            Class: 'botChat',
            Message: AI_response
        })

    } catch (error) {
        
    }
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
button.addEventListener('click', function () {
    var button = this;

    sendChat({
        Class: 'userChat',
        Message: chatInput.value
    });

    buttonFlicker(button)
});

/**
 * invokes all functions that need to be invoked immediately
 */
window.addEventListener("load", async () => {
    try {
        const promises = categories.map(async (element) => {
            return await fetchJSON(element);
        });
        const jsonDataValues = await Promise.all(promises);
        categories.forEach((category, index) => {
            jsonData.set(category, jsonDataValues[index]);
        });
        setCategory();
    } catch (error) {
        console.error("Error fetching JSON data:", error);
    }
});

module.exports = { testEnvironment: 'jsdom',clearAll, sendChat, addToCart, setListing, createListing};