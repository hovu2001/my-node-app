const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../../../libs/jwt");
const { generateResetPasswordToken, verifyResetPasswordToken } = require("../../../libs/jwt-reset");
const sendMail = require("../../../emails/mail");
const config = require("config");
const path = require("path");
const {
  deleteUserToken,
  storeUserToken,
} = require("../../../libs/token.user.service");
const {addTokenBlacklist, setRedis, getRedis, delRedis}   = require("../../../libs/redis.user.token");

exports.register = async (req, res) => {
  try {
    // Validate form
    const { email, password } = req.body;

    // Validate unique email
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
    });

    // Send mail
    const templatePath = path.join(
      __dirname,
      "../../../emails/templates/mail-user-register.ejs"
    );

    const mailPayload = {
      email: newUser.email, // Bắt buộc
      subject: "Xác nhận đăng ký thành công - Vietpro Shop",
      link: "https://vietproshop.com", // Link trang chủ hoặc link xác thực
    };

    await sendMail(templatePath, mailPayload);


    return res.status(201).json({
      status: "success",
      message: "Create User successfully!",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmail = await UserModel.findOne({ email });
    if (!isEmail) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email",
      });
    }
    const isPassword = await bcrypt.compare(password, isEmail.password);
    // ||  await UserModel.findOne({ password });

    if (!isPassword) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });
    }

    if (isEmail && isPassword) {

      // Generate Token
      const accessToken = await jwt.generateAccessToken(isEmail);
      const refreshToken = await jwt.generateRefreshToken(isEmail);
      const { password, ...user } = isEmail.toObject();
      
       // Insert Token to database
       await storeUserToken(user._id, accessToken, refreshToken);
      
      // Response API
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: "success",
        message: "Login successfully",
        user: user,
        accessToken,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    const { user } = req;
    // Move Token (Access Token & Refresh Token) to Redis
    await addTokenBlacklist(user.id);

  // Delete Token from Database
  await  deleteUserToken(user.id);
  return res.status(200).json({
      status: "success",
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }

};
exports.refreshToken = async (req, res) => {
  try {
    const { decoded } = req;
    const accessToken = await jwt.generateAccessToken(decoded);
    return res.status(200).json({
      status: "success",
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};
exports.getMe = async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ status: "error", message: "Email không tồn tại" });

    // Tạo token reset password
    const resetToken = generateResetPasswordToken(user);

    // Lưu token vào Redis, 15 phút
    await setRedis(`reset_password_${user._id}`, resetToken, 900);

    // Gửi mail
    const templatePath = path.join(__dirname, "../../../emails/templates/mail-reset-password.ejs");
    const mailPayload = {
      email: user.email,
      subject: "Đặt lại mật khẩu - Vietpro Shop",
      link: `http://localhost:3000/auth/reset-password?token=${resetToken}`, // link backend
    };
    await sendMail(templatePath, mailPayload);

    return res.status(200).json({ status: "success", message: "Gửi email lấy lại mật khẩu thành công!" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
  }
};

// Reset mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token) return res.status(400).json({ status: "error", message: "Token không hợp lệ" });

    // Xác thực token JWT
    let decoded;
    try { decoded = verifyResetPasswordToken(token); }
    catch { return res.status(400).json({ status: "error", message: "Token hết hạn hoặc không hợp lệ" }); }

    // Kiểm tra token trong Redis
    const redisToken = await getRedis(`reset_password_${decoded.id}`);
    if (!redisToken || redisToken !== token) {
      return res.status(400).json({ status: "error", message: "Token đã bị thu hồi hoặc hết hạn" });
    }

    // Hash mật khẩu mới và update DB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    // Xóa token trong Redis
    await delRedis(`reset_password_${decoded.id}`);

    return res.status(200).json({ status: "success", message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
  }
};