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

/**
 * function to make ai chatbox appear and disappear
 * gpt prompt: please create a js function which hides a certain div
 */
function toggleChatbot() {
    var overlay = document.getElementById('chatBotID');
    if (overlay.style.display === 'none') {
        overlay.style.display = 'block';
        content.style.visibility = 'hidden';
    } else {
        overlay.style.display = 'none';
        content.style.visibility = 'visible';
    }
}


select.addEventListener("change", setCategory);