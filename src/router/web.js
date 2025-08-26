const express = require("express");
const router = express.Router();

//Import Controller
const CategoryController = require("../apps/controllers/apis/category");
const ProductController = require("../apps/controllers/apis/product");

router.get("/categories", CategoryController.index);


router.get("/products", ProductController.index);


module.exports = router;