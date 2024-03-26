//get the current category id from the server might need to change this
let catId = require(`${__dirname}/../../server/server.js`).currentCat;
(() =>{
  //get the data from the server
  const getJSONData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }
  let data = getJSONData(`/popular/${catId}`);
  console.log(data);
})();