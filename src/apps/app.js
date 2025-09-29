const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const app = express();

app.use(express.json()); // thay cho bodyParser.json()
app.use(express.urlencoded({ extended: true })); // thay cho bodyParser.urlencoded()









app.use(config.get("app.prefixApiVersion"), require("../router/web"));
module.exports = app;