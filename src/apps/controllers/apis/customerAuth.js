const CustomerModel = require("../../models/customer");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("../../../libs/jwt");

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
      status: "error", // Đã sửa chính tả
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
    try {
        const {email, password}  = req.body;

        const isEmail =  await CustomerModel.findOne({email});
        if(!isEmail )
            return res.status(400).json({
                status: "error",
                message: "Invalid email",
            });
        //  const isPassword = await bcrypt.compare(password, isEmail.password) ;
        const isPassword = isEmail.password;
         if(!isPassword)  
             return res.status(400).json({
                status: "error",
                message: "Invalid password",
            });
            if(isEmail && isPassword){
                const accessToken = await jwt.generateAccessToken(isEmail);
                const {password, ...others} = isEmail.toObject();
                return res.status(200).json({
                    status: "success",
                    message: "Logged in successfully",
                    customer: others,
                    accessToken,
                })
            }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        })
    }

};
exports.logout = async (req, res) => {};
exports.refreshToken = async (req, res) => {};
exports.getMe = async (req, res) => {};
