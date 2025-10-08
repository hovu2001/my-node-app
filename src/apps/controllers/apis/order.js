const ProductModel = require("../../models/product");
const OrderModel = require("../../models/order");

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
    }
    // Tạo đơn hàng
    const order = await OrderModel.create({
      ...customerInfo,
      totalPrice,
      items: orderItems,
    });
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

