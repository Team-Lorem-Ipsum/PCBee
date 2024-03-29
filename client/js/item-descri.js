
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

  const displayPopItem = async() => {
    console.log("hit");
    let data = await getJSONData(`/popular/${category_ids[catId]}`);
    console.log(data);
  };

   const displyItemDescription = () =>{
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
    let condition = document.getElementById("condition");

    img.src = itemSummaries.image.imageUrl;
    title.innerHTML = itemSummaries.title;
    price.innerHTML = itemSummaries.price.value;
    condition.innerHTML = itemSummaries.condition;

    
    
   };
  document.addEventListener("DOMContentLoaded", () => {
    data = getJSONData(`/search/${itemName}`);
    displyItemDescription();
    //displaySimilarItem();
    //displayPopItem();

  }); 
