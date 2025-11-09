const OrderModel = require("../../models/order");
const paginate = require("../../../libs/paginate");
const mongoose = require("mongoose");
exports.fillAll = async (req, res) => {
  try {
    const query = {};
     // ===== Lọc theo trạng thái =====
    if (req.query.status) query.status = req.query.status;

  // ===== Lọc theo email hoặc số điện thoại =====
    if (req.query.email) query.email = { $regex: req.query.email, $options: "i" };
    if (req.query.phone) query.phone = { $regex: req.query.phone, $options: "i" };
    
   // ===== Lọc theo tổng tiền =====
if (req.query.minPrice || req.query.maxPrice) {
  query.totalPrice = {};
  if (req.query.minPrice) query.totalPrice.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) query.totalPrice.$lte = Number(req.query.maxPrice);
}

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;

    const orders = await OrderModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    return res.status(200).json({
      status: "success",
      message: "Get orders successfully",
      data: orders,
      page: await paginate(page, limit, query, OrderModel),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
   try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Status",
      });
    }

    const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Update status successfully",
      data: order,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await OrderModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Update order information successfully",
      data: order,
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

    // Kiểm tra định dạng ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Id Order",
      });
    }

    // Kiểm tra đơn hàng tồn tại
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Xóa đơn hàng
    await OrderModel.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Remove Order successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
