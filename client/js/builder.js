// DECLARATIONS
let select = document.querySelector("#category-select");
let jsonData = new Map();
let selectedItems = document.querySelector(".selected-items")
let productListing = document.querySelector(".product-listing");
let isFirstTime = true;
let categories = ["case", "gpu", "cpu", "caseFan", "memory", "monitor", "motherboard"]
const maxListing = 50;

/**
 * fetches a json
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

/**
 * create product listing bubble
 */
const createListing = (category, name, price, listing) => {
    let wrapper = document.createElement("div");
    wrapper.classList.add("rounded-start", "item-listing", "d-flex", "p-3");

    let divImg = document.createElement("div");
    divImg.classList.add("col", "col-sm-4");

    let divDesc = document.createElement("div");
    divDesc.classList.add("col", "col-sm-8", "d-flex", "flex-column");

    let img = document.createElement("img");
    img.src = `./assets/${category}.png`;
    img.alt = category;

    let itemName = document.createElement("h5");
    itemName.textContent = name;

    let desc = document.createElement("p");
    desc.textContent = `Price: $${price}`;

    let addBtn = document.createElement("button");
    addBtn.innerHTML = listing?"Add to List":"Search Item";
    addBtn.style = "background-color: var(--custom-myNavbar);";
    addBtn.classList.add("btn", "w-50");
    if (listing)
        addBtn.addEventListener("click", () => addToList(category, name, price));
    else
        addBtn.addEventListener("click", () => console.log("eBay time")); // TODO

    divImg.appendChild(img);
    divDesc.appendChild(itemName);
    divDesc.appendChild(desc);
    divDesc.appendChild(addBtn);
    wrapper.appendChild(divImg);
    wrapper.appendChild(divDesc);

    if (listing)
        productListing.appendChild(wrapper);  
    else
        selectedItems.appendChild(wrapper);
}

/**
 * changes the category listings
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
 * set the listing appropriate to the category
 */
const setListing = (category) => {
    let data = jsonData.get(category);
    console.log(data);
    productListing.innerHTML = "";
    for (let i = 0; i < maxListing; i++) {
        let name = data[i].name;
        let price = data[i].price;
        createListing(category, name, price, true);
    }
}

/**
 * fills the selected item section
 */
const addToList = (category, name, price) => {
    if (isFirstTime) {
        isFirstTime = false;
        selectedItems.innerHTML = "";
        let searchBtn = document.createElement("button");
        searchBtn.style = "background-color: var(--custom-myNavbar);";
        searchBtn.classList.add("btn", "w-50", "mt-2");
        searchBtn.innerHTML = "Search All";
        document.querySelector(".pc-builder > div").appendChild(searchBtn);
    }
    createListing(category, name, price, false);
};

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