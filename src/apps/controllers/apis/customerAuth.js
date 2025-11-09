const CustomerModel = require("../../models/customer");
const {addTokenBlacklist}  = require("../../../libs/redis.token")
const jwt = require("../../../libs/jwt");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const {
  deleteCustomerToken,
  storeCustomerToken,
} = require("../../../libs/token.service");


exports.register = async (req, res) => {
  try {
    // validate form
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array(),
      });
    }
    const { fullName, email, password, phone, address } = req.body;

    // validate unique email
    const emailExists = await CustomerModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // validate unique phone
    const phoneExists = await CustomerModel.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        status: "error",
        message: "Phone already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create customer
    const newCustomer = await CustomerModel.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    return res.status(201).json({
      status: "success",
      message: "Create customer successfully!",
      data: newCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check email
    const isEmail = await CustomerModel.findOne({ email });
    if (!isEmail)
      return res.status(400).json({
        status: "error",
        message: "Invalid email",
      });

    // check password
    const isPassword = await bcrypt.compare(password, isEmail.password);
    if (!isPassword)
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });

    if (isEmail && isPassword) {
      // Generate Token
      const accessToken = await jwt.generateAccessToken(isEmail);
      const refreshToken = await jwt.generateRefreshToken(isEmail);
      const { password, ...others } = isEmail.toObject();

      // Insert Token to Database
      storeCustomerToken(others._id, accessToken, refreshToken);
      // Response Token & Customer
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        customer: others,
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
    const { customer } = req;
    // Move Token (Access Token & Refresh Token) to Redis
    await addTokenBlacklist(customer.id)
    // Delete Token from Database
     deleteCustomerToken(customer.id); 
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
    const { customer } = req;
    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal sever error",
      error: error.message,
    });
  }
};
