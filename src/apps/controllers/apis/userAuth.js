const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../../../libs/jwt");
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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmail = await UserModel.findOne({ email });
    if(!isEmail) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email",
      });
    }

    const isPassword = await bcrypt.compare(password, isEmail.password) 
    // ||  await UserModel.findOne({ password });
    
    if(!isPassword) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });
    }
    
    if(isEmail && isPassword){
      // Generate Token
      const accessToken = await jwt.generateAccessToken(isEmail);
      const {password, ...user} = isEmail.toObject();
      // Response API
      return res.status(200).json({
        status: "success",
        message: "Login successfully",
        user: user,
        accessToken
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
exports.logout = async (req, res) => {};
exports.refreshToken = async (req, res) => {};
exports.getMe = async (req, res) => {};
