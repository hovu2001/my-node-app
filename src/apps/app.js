const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("config");
const path = require("path");
const app = express();
const redisClient = require("../common/init.redis");
app.use(cookieParser());
app.use(express.json()); // thay cho bodyParser.json()
app.use(express.urlencoded({ extended: true })); // thay cho bodyParser.urlencoded()
// Public thư mục uploads để client truy cập được ảnh
app.use("/uploads", express.static(path.join(__dirname, "uploads")));







app.use(config.get("app.prefixApiVersion"), require("../router/web"));
module.exports = app;