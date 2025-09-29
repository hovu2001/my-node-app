const { body } = require("express-validator");
exports.registerValidator = [
    body("fullName").notEmpty().withMessage("Fullname is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("address").notEmpty().withMessage("Address is required"),
];
