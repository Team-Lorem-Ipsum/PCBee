
  let data;
  //url = item-desc.html?category=:category&itemId=:itemId
  //get the data from the server
  const getJSONData = async (url) => {
    try{
      let response = await fetch(url);
      let data = await response.json();
      return data;
    }
    catch(error){
      console.error("Error fetching data from eBay API:", error);
      res.status(500).send("Error fetching data from eBay API");
    }
  };
  //category ids
  const category_ids={
    "gpu": 27386,
    "cpu": 164,
    "memory": 170083,
    "motherboard": 1244,
    "caseFan": 131486,
    "case": 42014,
    "monitor": 80053
  };

  //get the category and item id from the url
  let url = new URLSearchParams(window.location.search);
  let catId = url.get("category");
  let itemName = url.get("itemName");
  console.log("cat: ",catId, "itemName: ",itemName);


   const displayItemDescription = () =>{
    //get the item description from the server
    /**
     * itemSummaries.image img
     * itemSummaries.title title
     * itemSummaries.price.value price
     * itemSummaries.condition condition
     */
    let itemSummaries = data.itemSummaries[0];


    let img = document.getElementById("item-img");
    let title = document.getElementById("title");
    let price = document.getElementById("price");
    let shortDescription = document.getElementById("shortDescription");
    let titleHTML = `<a href="${itemSummaries.itemWebUrl}" target ="_blank">${itemSummaries.title}</a>`;

    img.src = itemSummaries.image.imageUrl;
    title.innerHTML = titleHTML;
    price.innerHTML = "$ "+ itemSummaries.price.value +" " + itemSummaries.price.currency ;
    
    shortDescription.innerHTML = itemSummaries.shortDescription? itemSummaries.shortDescription : "No description available";

    
    
   };
   function createCard(item){
    //create a card for the item
    let card = document.createElement("div");
    card.className = "card shadow col-4";

    //create an image element
    let img = document.createElement("img");
    img.className = "card-img-top";
    img.src = item.image.imageUrl;
    card.appendChild(img);

    //create a card body
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    card.appendChild(cardBody);

    //create a title element
    let title = document.createElement("h2");
    title.className = "card-title";
    title.innerHTML = item.title;
    cardBody.appendChild(title);

    //create a text element
    let text = document.createElement("p");
    text.className = "card-text";
    text.innerHTML = item.shortDescription? item.shortDescription : "No description available";

    cardBody.appendChild(text);

    //create a price element
    let price = document.createElement("p");
    price.innerHTML = "$ "+ item.price.value +" " + item.price.currency;
    cardBody.appendChild(price);

  
    card.addEventListener("click",()=>{
      window.open(`/item-desc/category=${catId}&itemName=${item.title}`, "_blank");
    }); //add event listener to the card
    
    return card;
   }
   const displaySimilarItem = async() => {
    let similarItems = document.getElementById("similar-item-cards");
    data.itemSummaries.forEach((item,i)=>{
      if(i>0){
        let card = createCard(item);
        similarItems.appendChild(card);
      }
    });
   };
  document.addEventListener("DOMContentLoaded",async () => {
    data = await getJSONData(`/search/${itemName}`);
    displayItemDescription();
    displaySimilarItem();
    //displayPopItem();

  }); 
