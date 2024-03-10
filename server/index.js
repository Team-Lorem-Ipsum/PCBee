const express = require('express');
const port = 3000;
const app = express();

app.get("/", async (request, response) => {
    console.log("hello world");
});

app.listen(port, "localhost", () => console.log(`Node js running on port ${port}`));