const express = require("express");
const router = express.Router();
const upload = require("../libs/upload");

//Import Controller
const AuthController = require("../apps/controllers/apis/auth2");
const BannerController = require("../apps/controllers/apis/banner");
const CategoryController = require("../apps/controllers/apis/category");
const ProductController = require("../apps/controllers/apis/product");
const CommentController = require("../apps/controllers/apis/comment");
const CustomerAuthController = require("../apps/controllers/apis/customerAuth");
const OrderController = require("../apps/controllers/apis/order");
const UserController = require("../apps/controllers/apis/userAuth");
const AdminOrderController = require("../apps/controllers/apis/adminOrder");

//import middleware
const {
  categoryRules,
  updateCategoryRules,
  categoryValidator,
} = require("../apps/middlewares/categoryValidator");

const {
  loginRules,
  loginValidator,
} = require("../apps/middlewares/authValidator");

const { registerValidator } = require("../apps/middlewares/customerValidator");

const {
  verifyAccessToken,
  verifyRefreshToken,
} = require("../apps/middlewares/customerAuth");

const {
  verifyUserAccessToken,
  verifyUserRefreshToken,
} = require("../apps/middlewares/userAuth");

const {
  registerUserRules,
  registerUserValidator,
} = require("../apps/middlewares/registerUserValidator");

const {
  loginUserRules,
  loginUserValidator,
} = require("../apps/middlewares/authUserValidator");

const { verifyCustomer } = require("../apps/middlewares/orderAuth");
const {
  createOrderRules,
  createOrderValidator,
} = require("../apps/middlewares/orderValidator");

//Auth2
router.post("/google", AuthController.googleLogin);

// Categories
router.get("/categories", CategoryController.findAll);
router.get("/categories/:id", CategoryController.findOne);
router.post(
  "/categories",
  categoryRules,
  categoryValidator,
  CategoryController.create
);
router.put(
  "/categories/:id",
  updateCategoryRules,
  categoryValidator,
  CategoryController.update
);
router.delete("/categories/:id", CategoryController.remove);

// Products
router.get("/products", ProductController.findAll);
router.get("/products/:id", ProductController.findOne);
router.put("/products/:id", ProductController.update);
router.delete("/products/:id", ProductController.remove);
router.post("/products", upload.single("image"), ProductController.create);

//Banner
router.get("/banners", BannerController.getAll);          
router.get("/banners/:id", BannerController.getById);    
router.post("/banners", upload.single("image"), BannerController.create); 
router.put("/banners/:id", upload.single("image"), BannerController.update); 
router.delete("/banners/:id", BannerController.remove);  



//Comment
router.get("/products/:id/comments", CommentController.findByProductId);
router.post("/products/:id/comments", CommentController.create);
router.put("/comments/:id/approve", CommentController.approve);
router.delete("/comments/:id", CommentController.remove);

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
router.post(
  "/auth/customers/logout",
  verifyAccessToken,
  CustomerAuthController.logout
);
router.post(
  "/auth/customers/refresh",
  verifyRefreshToken,
  CustomerAuthController.refreshToken
);
router.get(
  "/auth/customers/me",
  verifyAccessToken,
  CustomerAuthController.getMe
);

// User API
router.post(
  "/auth/users/register",
  registerUserRules,
  registerUserValidator,
  UserController.register
);

router.post(
  "/auth/users/login",
  loginUserRules,
  loginUserValidator,
  UserController.login
);
router.post("/auth/users/logout", verifyUserAccessToken, UserController.logout);
router.post(
  "/auth/users/refresh",
  verifyUserRefreshToken,
  UserController.refreshToken
);
router.get("/auth/users/me", verifyUserAccessToken, UserController.getMe);

//Order API
router.post(
  "/customers/orders",
  verifyCustomer,
  createOrderRules,
  createOrderValidator,
  OrderController.order
);

//Order Admin API
router.get("/admin/orders", AdminOrderController.fillAll);
router.patch("/admin/orders/:id/status", AdminOrderController.updateStatus);
router.patch("/admin/orders/:id",AdminOrderController.updateOrder);
router.delete("/admin/orders/:id", AdminOrderController.remove);

router.get(
  "/customers/orders",
  verifyAccessToken,
  OrderController.findByCustomerId
);
router.get("/customers/orders/:id", verifyAccessToken, OrderController.findOne);
router.patch(
  "/customers/orders/:id/cancel",
  verifyAccessToken,
  OrderController.cancel
);

module.exports = router;
