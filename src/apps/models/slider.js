const mongoose = require("../../common/init.mongo")();

const sliderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
    publish: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SliderModel = mongoose.model("Slider", sliderSchema, "sliders");
module.exports = SliderModel;
