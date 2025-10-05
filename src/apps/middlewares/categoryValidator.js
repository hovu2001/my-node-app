const { body, validationResult, param } = require("express-validator");
const categoryRules = [body("name").notEmpty().withMessage("Name is required")];
const updateCategoryRules = [
  //   param("id").isMongoId().withMessage("ID invalid"),
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
];

const categoryValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      status: "error",
      errors: errors.array(),
    });
  next();
};
module.exports = { categoryRules, updateCategoryRules, categoryValidator };
