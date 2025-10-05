const ProductModel = require("../../models/product");
const OrderModel = require("../../models/order");

exports.order = async (req, res) => {
  try {
    let customerInfo = {};
    if (req.customer) {
      // Customer
      customerInfo = {
        customer_id: req.customer._id,
        email: req.customer.email,
        phone: req.customer.phone,
        address: req.customer.address,
      };
    } else {
      // Guest
      const { email, phone, address } = req.body;
      customerInfo = { email, phone, address };
    }

    // Create order
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

    const order = await OrderModel.create({
      ...customerInfo,
      totalPrice,
      items: orderItems,
    });

    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
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
