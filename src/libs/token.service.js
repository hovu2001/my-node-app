const TokenModel = require("../apps/models/token");
const {addTokenBlacklist } = require("./redis.token")
exports.storeCustomerToken = async (
  customerId,
  accessToken,
  refreshToken
) => {
        const token = await TokenModel.findOne({customerId});
        if(token) this.deleteCusTomerToken(customerId);
        await TokenModel({
            customerId,
            accessToken,
            refreshToken
        }).save();

    };

exports.deleteCusTomerToken = async (customerId) => {
  const token = await TokenModel.findOne({ customerId });
  if (!token) {
    const error = new Error("No token found this customer");
    error.statusCode = 400;
    throw error;
  }
  // Move Token to Redis
  await addTokenBlacklist(customerId)

  // Delete Token from Database

  await TokenModel.deleteOne({ customerId });
};
