const mongoose = require("../../common/init.mongo")();
const customerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
const CustomerModel = mongoose.model("Customers", customerSchema, "customers");
module.exports = CustomerModel;
