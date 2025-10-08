const ProductModel = require("../../models/product");
const paginate = require("../../../libs/paginate");
exports.findAll = async (req, res) => {
  try {
    const query = {};
    if (req.query.is_featured) query.is_featured = req.query.is_featured;
    if (req.query.category_id) query.category_id = req.query.category_id;
    if (req.query.keyword) query.$text = { $search: req.query.keyword };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;

    const products = await ProductModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });
    return res.status(200).json({
      status: "success",
      message: "Get products successfully",
      data: products,
      page: await paginate(page, limit, query, ProductModel),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    return res.status(200).json({
      status: "success",
      message: "Get product successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    // Cập nhật sản phẩm
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { $set: req.body }, // Dữ liệu truyền từ body request
      { new: true, runValidators: true } // new: true => trả về bản ghi sau khi update
    );

    return res.status(200).json({
      status: "success",
      message: "Update product successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Xoá sản phẩm
    await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Delete product successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.create = async (req, res) => {
  try {
    const { category_id, name, price, status, accessories, promotion, details } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Image is required",
      });
    }

    const newProduct = new ProductModel({
      category_id,
      name,
      price,
      status,
      accessories,
      promotion,
      details,
      image: "/uploads/" + req.file.filename, // Lưu đường dẫn ảnh
    });

    await newProduct.save();

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
