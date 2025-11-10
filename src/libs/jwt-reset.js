const jwt = require("jsonwebtoken");
const config = require("config");

const generateResetPasswordToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_RESET_PASSWORD_SECRET,
    { expiresIn: "15m" } // token chỉ 15 phút
  );
};

const verifyResetPasswordToken = (token) => {
  return jwt.verify(token,  process.env.JWT_RESET_PASSWORD_SECRET);
};

module.exports = { generateResetPasswordToken, verifyResetPasswordToken };
