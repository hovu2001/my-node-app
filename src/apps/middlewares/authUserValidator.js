const { body, validationResult } = require("express-validator");
const loginUserRules = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
const loginUserValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      status: "error",
      errors: errors.array(),
    });
  next();
};
module.exports = { loginUserRules, loginUserValidator };
