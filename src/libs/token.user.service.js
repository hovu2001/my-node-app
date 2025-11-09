const TokenBlacklistModel = require("../apps/models/token-black");
const {addTokenBlacklist} = require("./redis.user.token")
exports.storeUserToken = async (userId, accessToken, refreshToken) => {
  //   Xử lý token đang tồn tại (nếu có)
  const token = await TokenBlacklistModel.findOne({ userId });
  if (token) this.deleteUserToken(userId);
  await TokenBlacklistModel({
    userId,
    accessToken,
    refreshToken,
  }).save();
};
exports.deleteUserToken = async (userId) => {
  const token = await TokenBlacklistModel.findOne({ userId });
  if (!token) {
    const error = new Error("No Token found this customer");
    error.statusCode = 404;
    throw error;
  }
  // Move Token to Redis
  await addTokenBlacklist(userId)
  // Delete Token from Database
  await TokenBlacklistModel.deleteOne({ userId });
};
