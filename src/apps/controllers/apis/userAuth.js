const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
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
exports.login = async (req, res) => {};
exports.logout = async (req, res) => {};
exports.refreshToken = async (req, res) => {};
exports.getMe = async (req, res) => {};
