const ProductModel = require("../../models/product");
const OrderModel = require("../../models/order");
const sendMail = require("../../../emails/mail");
const config = require("config");
const paginate = require("../../../libs/paginate");
exports.order = async (req, res) => {
  try {
    let customerInfo = {};
    if (req.customer) {
      // Khách hàng
      customerInfo = {
        customer_id: req.customer._id,
        fullName: req.customer.fullName,
        email: req.customer.email,
        phone: req.customer.phone,
        address: req.customer.address,
      };
    } else {
      // Khách vãng lai
      const { fullName, email, phone, address } = req.body;
      customerInfo = { fullName, email, phone, address };
    }
    // Tính toán lại giá từ DB
    let totalPrice = 0;
    let orderItems = [];
    let orderMail = [];
    const { items } = req.body;
    for (let item of items) {
      const product = await ProductModel.findById(item.prd_id);
      if (!product) {
        return res.status(400).json({
          status: "error",
          message: `Product ${item.prd_id} not found`,
        });
      }
      const itemPrice = product.price;
      totalPrice += item.qty * itemPrice;
      orderItems.push({
        prd_id: product._id,
        qty: item.qty,
        price: itemPrice,
      });
      orderMail.push({
        name: product.name,
        qty: item.qty,
        price: itemPrice,
      });
    }
    // Tạo đơn hàng
    const order = await OrderModel.create({
      ...customerInfo,
      totalPrice,
      items: orderItems,
    });
    //Send mail
    await sendMail(`${config.get("mail.mailTemplate")}/mail-order.ejs`, {
      ...customerInfo,
      totalPrice,
      items: orderMail,
      subject: "Xác nhận đơn hàng từ Vietpro Shop",
    });

    //Response
    return res.status(201).json({
      status: "success",
      message: "Create order successfully",
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

exports.findByCustomerId = async (req, res) => {
  try {
    const { id } = req.customer;
    const query = {};
    query.customer_id = id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;
    const orders = await OrderModel.find()
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
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    return res.status(200).json({
      status: "success",
      message: "Get order successfully",
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

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status: "canceled" },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: "Order has been canceled successfully",
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
