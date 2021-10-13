const express = require("express");
const path = require("path");
const router = require("./src/router");

const app = express();
const pathToIndex = path.resolve(__dirname, "../client/index.html");
app.use(express.static(path.resolve(__dirname, "uploads")));
app.use("/", router);

app.use("/*", (request, response) => {
  response.sendFile(pathToIndex);
});
module.exports = app;
