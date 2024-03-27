
(() =>{
  //url = item-desc.html?category=:category&itemId=:itemId
  //get the data from the server
  const getJSONData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }

  //get the category and item id from the url
  let url = new URLSearchParams(window.location.search);
  let catId = url.get("category");
  let itemId = url.get("itemId");
  console.log(catId, "itemid: ",itemId);
  let data = getJSONData(`/popular/${catId}`);
  console.log(data);
})();