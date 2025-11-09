const mongoose = require("../../common/init.mongo")();
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
       type: String,
       default: "member",
    },
     name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    providerId: {
      type: String, // ID từ Google hoặc Facebook
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("Users", userSchema, "users");
module.exports = UserModel;
