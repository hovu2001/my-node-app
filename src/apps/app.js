const express = require("express");
const config = require("config");
const app = express();










app.use(config.get("app.prefixApiVersion"), require("../router/web"));
module.exports = app;