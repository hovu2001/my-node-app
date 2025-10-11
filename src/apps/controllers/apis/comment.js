const CommentModel = require("../../models/comment");
const paginate = require("../../../libs/paginate");
const badWords = require("../../../libs/badwords.json");

exports.findByProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { product_id: id };
    const sort = {};
    if (req.query.sort && req.query.sort == true) {
      sort._id = 1;
    } else {
      sort._id = -1;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await CommentModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    return res.status(200).json({
      status: "success",
      message: "Get Comments successfully",
      data: comments,
      page: await paginate(page, limit, query, CommentModel),
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
    const { id } = req.params;
    const { body } = req;
    if (body.name === "")
      return res.status(400).json({
        status: "error",
        message: "Name is require",
      });

    if (!body.content || body.content.trim() === "")
      return res.status(400).json({
        status: "error",
        message: "Content is required",
      });
    let content = body.content.toLowerCase();
    badWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      content = content.replace(regex, "***");
    });
 
  
    const newComment = await CommentModel.create({
      product_id: id,
      name: body.name,
      email: body.email,
      content: content.trim(),
    });
    return res.status(201).json({
      status: "success",
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await CommentModel.findById(id);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    comment.isApproved = true;
    await comment.save();

    return res.status(200).json({
      status: "success",
      message: "Comment approved successfully",
      data: comment,
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
    const comment = await CommentModel.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
