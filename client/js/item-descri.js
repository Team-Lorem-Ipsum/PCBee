

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
  let itemId = url.get("itemId");
  console.log("cat: ",catId, "itemid: ",itemId);

  const displayPopItem = async() => {
    console.log("hit");
    let data = await getJSONData(`/popular/${category_ids[catId]}`);
    console.log(data);
  };
  document.addEventListener("DOMContentLoaded", () => {
    //displyItemDescription();
    //displaySimilarItem();
    //displayPopItem();

  }); 
