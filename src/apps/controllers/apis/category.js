const CategoryModel = require("../../models/category");
exports.findAll = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json({
      status: "success",
      message: "Get categories successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error ",
      error: error.message,
    });
  }
};
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    return res.status(200).json({
      status: "success",
      message: "Get Category successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Get category error",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const nameExist = await CategoryModel.findOne({ name: name.trim() });
    if (nameExist) {
      return res.status(400).json({
        status: "error",
        message: "Name already exists",
      });
    }

    const category = new CategoryModel({ name: name.trim() });
    await category.save();

    res.status(201).json({
      status: "success",
      message: "Category successfully",
      data: category,
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
    const { name } = req.body;

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }
    const existed = await CategoryModel.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existed) {
      return res.status(400).json({
        status: "error",
        message: "CategoryName already exists",
      });
    }
    category.name = name.trim();
    await category.save();

    return res.status(200).json({
      status: "success",
      message: "Category update successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};
exports.remove = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID",
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};
