const TokenModel = require("../apps/models/token");
const {addTokenBlacklist} = require("./redis.token")
exports.storeCustomerToken = async (customerId, accessToken, refreshToken) => {
  const token = await TokenModel.findOne({ customerId });
  if (token) this.deleteCustomerToken(customerId);
  await TokenModel({
    customerId,
    accessToken,
    refreshToken,
  }).save();
};
exports.deleteCustomerToken = async (customerId) => {
  const token = await TokenModel.findOne({ customerId });
  if (!token) {
    const error = new Error("No Token found this customer");
    error.statusCode = 404;
    throw error;
  }
  // Move Token to Redis
  await addTokenBlacklist(customerId)
  // Delete Token from Database
  await TokenModel.deleteOne({ customerId });
};
