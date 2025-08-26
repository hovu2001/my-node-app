const mongoose = require("../../common/init.mongo")();
const productSchema = new mongoose.Schema({
    category_id:{
        type: mongoose.Types.ObjectId,
        require: true,
    },
    name:{
        type: String,
        require: true,
    },
    image:{
        type: String,
        require: true,
    },
    price:{
        type: String,
        require: true,
    },
    status:{
        type: String,
        require: true,
    },
    accessories:{
        type: String,
        require: true,
    },
    promotion:{
        type: String,
        require: true,
    },
    details:{
        type: String,
        require: true,
    },
    is_stock:{
        type: Boolean,
        default: true,
    },
    is_featured:{
        type: Boolean,
        default: false,
    },
    },
    {timestamps: true}
);
const ProductModel = mongoose.model("Products", productSchema, "products");
module.exports = ProductModel;
  