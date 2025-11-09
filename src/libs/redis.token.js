const TokenModel = require("../apps/models/token");
const { jwtDecode } = require("jwt-decode");
const clientRedis = require("../common/init.redis");
exports.addTokenBlacklist = async (customerId) => {
  const token = await TokenModel.findOne({ customerId });
  if (!token) {
    const error = new Error("No token found for this customer");
    error.statusCode = 404;
    throw error;
  }
  const { accessToken, refreshToken } = token;
  // Move Access Token in Redis

  const decodedAccessToken = jwtDecode(accessToken);
  if (decodedAccessToken.exp > Date.now() / 1000) {
    await clientRedis.set(
      `tb_${accessToken}`, 
      "revoked", 
      {
        EXAT: decodedAccessToken.exp,
      }
  );
  }
  // Refresh Token
  const decodedRefreshToken = jwtDecode(refreshToken);
  if (decodedRefreshToken.exp > Date.now() / 1000) {
    await clientRedis.set(`tb_${refreshToken}`, "revoked", {
      EXAT: decodedRefreshToken.exp,
    });
  }
};
