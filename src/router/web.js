const express = require("express");
const router = express.Router();

//Import Controller
const CategoryController = require("../apps/controllers/apis/category");
const ProductController = require("../apps/controllers/apis/product");
const CommentController = require("../apps/controllers/apis/comment");
const CustomerAuthController = require("../apps/controllers/apis/customerAuth");

//import middleware
const {
  loginRules,
  loginValidator,
} = require("../apps/middlewares/authValidator");
const { registerValidator } = require("../apps/middlewares/customerValidator");

// Categories
router.get("/categories", CategoryController.findAll);
router.get("/categories/:id", CategoryController.findOne);

// Products
router.get("/products", ProductController.fillAll);
router.get("/products/:id", ProductController.findOne);

router.get("/products/:id/comments", CommentController.findByProductId);
router.post("/products/:id/comments", CommentController.create);

//Auth

router.post(
  "/auth/customers/register",
  registerValidator,
  CustomerAuthController.register
);
router.post(
  "/auth/customers/login",
  loginRules,
  loginValidator,
  CustomerAuthController.login
);
router.post("/auth/customers/logout", CustomerAuthController.logout);
router.post("/auth/customers/refresh", CustomerAuthController.refreshToken);
router.get("/auth/customers/me", CustomerAuthController.getMe);

module.exports = router;
