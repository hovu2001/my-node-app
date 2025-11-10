const jwt = require("jsonwebtoken");
const config = require("config");
exports.generateAccessToken = (payload) =>
  jwt.sign(
    {
      id: payload.id || payload._id,   // nhận cả id và _id
      email: payload.email,
    },
    config.get("app.jwtAccessKey"),
    { expiresIn: "1d" }
  );

exports.generateRefreshToken = (payload) =>
  jwt.sign(
    {
      id: payload.id || payload._id,
      email: payload.email,
    },
    config.get("app.jwtRefreshKey"),
    { expiresIn: "1d" }
  );

  // Token reset password
exports.generateResetPasswordToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    config.get("jwt.resetPasswordSecret"),
    { expiresIn: "15m" } // Token chỉ 15 phút
  );
};

exports.verifyResetPasswordToken = (token) => {
  return jwt.verify(token, config.get("jwt.resetPasswordSecret"));
};