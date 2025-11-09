const mongoose = require("../../common/init.mongo")();
const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
    target: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      require: true,
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: false }
);
const BannerModel = mongoose.model("Banners", bannerSchema, "banners");
module.exports = BannerModel;
