const jwt = require("jsonwebtoken");
const config = require("config");
const redisClient = require("../../common/init.redis");
const CustomerModel = require("../../apps/models/customer");
exports.verifyAccessToken = async (req, res, next) => {
  try {
    // console.log('HEADER AUTHORIZATION:', req.headers.authorization);  <-- THÊM DÒNG NÀY
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access token is required",
      });
    }
    // Check Token in blacklist
    const isTokenBlacklist = await redisClient.get(`tb_${token}`);
    if(isTokenBlacklist) return res.status(401).json({
      status: "error",
      message: "Access token has benn revoked",
    });
    jwt.verify(token, config.get("app.jwtAccessKey"), async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            status: "error",
            message: "Access token expired",
            error: err.message,
          });
        }
        return res.status(401).json({
          status: "error",
          message: "Invalid access token",
          error: err.message,
        });
      }
      const customer = await CustomerModel.findById(decoded.id).select(
        "-password"
      );
      req.customer = customer;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.verifyRefreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token is required",
      });
    }
    jwt.verify(token, config.get("app.jwtRefreshKey"), async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            status: "error",
            message: "Refresh token expired",
            error: err.message,
          });
        }
        return res.status(401).json({
          status: "error",
          message: "Invalid refresh token",
          error: err.message,
        });
      }
      console.log(decoded);
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
