const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("config");
const app = express();

app.use(cookieParser());
app.use(express.json()); // thay cho bodyParser.json()
app.use(express.urlencoded({ extended: true })); // thay cho bodyParser.urlencoded()









app.use(config.get("app.prefixApiVersion"), require("../router/web"));
module.exports = app;