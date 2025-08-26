const mongoose = require('mongoose');
const config = require("config");

module.exports = () => {
    mongoose
    .connect(config.get("db.mongo.uri"))
    .then(() => console.log('MongoDB Connected!'));
    return mongoose;
};

