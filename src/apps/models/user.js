const mongoose = require("../../common/init.mongo")();
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
       type: String,
       default: "member",
    }
  },
  { timestamps: true }
);
const UserModel = mongoose.model("Users", userSchema, "users");
module.exports = UserModel;
