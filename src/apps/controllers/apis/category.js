const CategoryModel = require("../../models/category");
exports.index = async (req, res) => {
  const categories = await CategoryModel.find()
  console.log(categories);
  res.json({ message: "Category API works!" });
};
