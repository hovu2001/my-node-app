const { body, validationResult } = require("express-validator");

const registerUserRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const registerUserValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      status: "error",
      errors: errors.array()
      // .map((err) => ({
      //   field: err.path,
      //   message: err.msg,
      // })),
    });
  next();
};

module.exports = { registerUserRules, registerUserValidator };
