const mongoose = require("../../common/init.mongo")();
const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const TokenBlacklistModel = mongoose.model("TokensBlacklist", tokenSchema, "tokens_blacklist");
module.exports = TokenBlacklistModel;
