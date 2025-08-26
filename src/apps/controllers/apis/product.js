const ProductModel = require("../../models/product");
exports.index = async (req, res) => {
    const products = await ProductModel.find().limit(10);
    console.log(products);
    res.json({ message: "Product API works!" });
};