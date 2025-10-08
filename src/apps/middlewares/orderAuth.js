const CustomerModel = require("../models/customer");
const jwt = require("jsonwebtoken");
const config = require("config");
exports.verifyCustomer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, config.get("app.jwtAccessKey"), async (err, decode)=>{
        if (err){
            req.customer = null;
            return next();
        }
        const customer = await CustomerModel.findById(decode.id).select(
            "-password"
        );
        req.customer = customer || null;
        return next();
    });
} catch (error) {
    req.customer = null;
    next();
}
};
