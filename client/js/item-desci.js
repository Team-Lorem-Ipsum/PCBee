let catId = require(`${__dirname}/../../server/server.js`).currentCat;
(() =>{
  const getJSONData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }
  let data = getJSONData(`/popular/${catId}`);
  console.log(data);
})();