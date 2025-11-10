const TokenBlacklistModel = require("../apps/models/token-black");
const { jwtDecode } = require("jwt-decode");
const clientRedis = require("../common/init.redis");
exports.addTokenBlacklist = async (userId) => {
  const token = await TokenBlacklistModel.findOne({ userId });
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
      `tbu_${accessToken}`, 
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

// Lưu key với expire time (giây)
const setRedis = async (key, value, expireInSec) => await clientRedis.set(key, value, { EX: expireInSec });
const getRedis = async (key) => await clientRedis.get(key);
const delRedis = async (key) => await clientRedis.del(key);

module.exports = { setRedis, getRedis, delRedis };