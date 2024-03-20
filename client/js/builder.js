// DECLARATIONS
let select = document.querySelector("#category-select");

// setCategory
const setCategory = () => {
    console.log("hit");
    let heading = document.querySelector("#category-title");
    let value = select.value;
    heading.innerHTML = value;
}

select.addEventListener("change", setCategory);