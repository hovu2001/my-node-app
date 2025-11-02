const mongoose = require("../../common/init.mongo")();
const tokenSchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Types.ObjectId,
        require: true,
    },
    accessToken:{
        type: String,
        require: true,
    },
    refreshToken:{
        type: String,
        require: true,
    },
   
    },
    {timestamps: true}
);
const TokenModel = mongoose.model("Tokens", tokenSchema, "tokens");
module.exports = TokenModel;
  