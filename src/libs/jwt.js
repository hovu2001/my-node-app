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
    { expiresIn: "30s" }
  );
