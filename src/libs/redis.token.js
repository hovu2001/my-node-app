const TokenModel = require("../apps/models/token");
const clientRedis = require("../common/init.redis");
const { jwtDecode } = require("jwt-decode");
exports.addTokenBlacklist = async (customerId) => {
  const token = await TokenModel.findOne({ customerId });
  if (!token) {
    const error = new Error("No token this customer");
    error.statusCode = 404;
    throw error;
  }
  const { accessToken, refreshToken } = token;
  // Move Access Token to Redis
  const decodeAccessToken = jwtDecode(accessToken);
  if (decodeAccessToken.exp > Date.now() / 1000) {
    await clientRedis.set(`tb_${accessToken}`, "revoked", {
      EX: decodeAccessToken.exp,
    });
  }
  // Move Refresh Token to Redis
  const decodeRefreshToken = jwtDecode(refreshToken);
  if (decodeRefreshToken.exp > Date.now() / 1000) {
    await clientRedis.set(`tb_${refreshToken}`, "revoked", {
      EX: decodeRefreshToken.exp,
    });
  }
};
