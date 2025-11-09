const { OAuth2Client } = require("google-auth-library");
const UserModel = require("../../models/user");
const jwt = require("../../../libs/jwt");
const { storeUserToken } = require("../../../libs/token.user.service");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; // token từ FE

    if (!credential) {
      return res.status(400).json({
        status: "error",
        message: "Thiếu Google credential token",
      });
    }

    // Xác thực token Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Kiểm tra user đã tồn tại chưa
    let user = await UserModel.findOne({ email });

    if (!user) {
      // Nếu chưa có thì tạo mới
      user = await UserModel.create({
        email,
        full_name: name,
        avatar: picture,
        provider: "google",
        providerId: sub,
        password: "", // Google login không dùng password
      });
    }

    // Sinh accessToken + refreshToken
    const accessToken = await jwt.generateAccessToken(user);
    const refreshToken = await jwt.generateRefreshToken(user);

    // Lưu refresh token vào DB
    await storeUserToken(user._id, accessToken, refreshToken);

    return res.status(200).json({
      status: "success",
      message: "Đăng nhập Google thành công",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Lỗi đăng nhập Google",
      error: error.message,
    });
  }
};
