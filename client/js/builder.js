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
    price = price? `$${price}`: "Not available";
    desc.innerHTML = `Price: ${price}`;

    let addBtn = document.createElement("button");
    addBtn.innerHTML = listing?"Add to List":"Search Item";
    addBtn.classList.add("btn", "w-50");
    if (listing) // if bubble is for product listing, NOT cart
        addBtn.addEventListener("click", () => addToList(category, name, price));
    else
        addBtn.addEventListener("click", async (name, category) => await fetch(`/searchResult/${category}`)); // TODO

    let rmButton;
    if (!listing) {
        rmButton = document.createElement("button");
        rmButton.innerHTML = "Remove";
        rmButton.classList.add("btn", "w-50", "mt-1");
        rmButton.addEventListener("click", () => {
            wrapper.remove();
            updateTotalCost();
            itemsInCart--;
            if (!itemsInCart) 
                clearAll();
        });
    }

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
    if (!itemsInCart) {
        selectedItems.innerHTML = "";

        let searchBtn = document.createElement("button");
        searchBtn.id = "search-all"
        searchBtn.style = "background-color: var(--custom-myNavbar);";
        searchBtn.classList.add("btn", "w-50", "mt-2", "m-auto");
        searchBtn.innerHTML = "Search All";

        let totalCost = document.createElement("h5");
        totalCost.id = "total-cost";

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
};

const clearAll = () => {
    let searchBtn = document.getElementById("search-all");
    let totalCost = document.getElementById("total-cost")
    let clearBtn = document.getElementById("clear-all");

    searchBtn.remove();
    totalCost.remove();
    clearBtn.remove();
    selectedItems.innerHTML = "";
    let h5 = document.createElement("h5");
    h5.innerHTML = "Start adding items to see them here!";
    document.querySelector(".pc-builder > div").appendChild(h5);
    itemsInCart = 0;
};

const updateTotalCost = () => {
    let totalCostHeader = document.getElementById("total-cost");
    let items = selectedItems.childNodes; 
    let totalCost = 0;

    items.forEach((item) => {
        let price = item.childNodes[1].childNodes[1].innerHTML;
        if (price == "Price: Not available")
            price = 0;
        else
            price = price.split("$")[1];
        totalCost += parseFloat(price);
    })
    totalCostHeader.innerHTML = `Total: $${totalCost}`;
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