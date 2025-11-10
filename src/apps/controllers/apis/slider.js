const SliderModel = require("../../models/slider");
exports.getAll = async (req, res) => {
try {
    const { publish } = req.query;
    const filter = {};

    // Xử lý query publish, bỏ khoảng trắng và chuyển thành lowercase
    if (publish) {
      const pub = publish.toLowerCase().trim();
      if (pub === "true") filter.publish = true;
      else if (pub === "false") filter.publish = false;
      // Nếu không phải true/false, bỏ qua filter để lấy tất cả
    }

    const sliders = await SliderModel.find(filter).sort({ position: 1 });

    res.status(200).json({
      message: "Get sliders successfully",
      data: sliders,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ===== Lấy slider theo ID =====
exports.getById = async (req, res) => {
  try {
    const slider = await SliderModel.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: "Slider not found" });
    res.status(200).json({ message: "Get slider successfully", data: slider });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ===== Tạo slider mới =====
exports.create = async (req, res) => {
  try {
    const { publish } = req.body;

    const lastSlider = await SliderModel.findOne().sort({ position: -1 });
    const newPosition = lastSlider ? lastSlider.position + 1 : 1;

    const image = req.file ? `/uploads/sliders/${req.file.filename}` : null;
    if (!image) return res.status(400).json({ message: "Image is required" });

    const slider = await SliderModel.create({
      image,
      position: newPosition,
      publish,
    });

    res.status(201).json({
      message: "Create slider successfully",
      data: slider,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ===== Cập nhật slider =====
exports.update = async (req, res) => {
  try {
    const { publish, position } = req.body;
    const id = req.params.id;

    const slider = await SliderModel.findById(id);
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    if (req.file) slider.image = `/uploads/sliders/${req.file.filename}`;
    if (publish !== undefined) slider.publish = publish;
    if (position !== undefined) slider.position = position;

    await slider.save();

    res.status(200).json({ message: "Update slider successfully", data: slider });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ===== Xóa slider =====
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const slider = await SliderModel.findByIdAndDelete(id);
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    res.status(200).json({ message: "Delete slider successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ===== Bật/tắt trạng thái hiển thị =====
exports.togglePublish = async (req, res) => {
  try {
    const slider = await SliderModel.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    slider.publish = !slider.publish;
    await slider.save();

    res.status(200).json({
      message: slider.publish ? "Đã bật hiển thị" : "Đã ẩn hiển thị",
      data: slider,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ===== Cập nhật lại thứ tự hiển thị =====
exports.reorder = async (req, res) => {
  try {
    const { sliders } = req.body;
    // Expect: [{ _id: "...", position: 1 }, { _id: "...", position: 2 }, ...]

    if (!Array.isArray(sliders) || sliders.length === 0) {
      return res.status(400).json({ message: "Danh sách slider không hợp lệ" });
    }

    const bulkOps = sliders.map((s) => ({
      updateOne: {
        filter: { _id: s._id },
        update: { $set: { position: s.position } },
      },
    }));

    await SliderModel.bulkWrite(bulkOps);

    res.status(200).json({
      message: "Cập nhật thứ tự slider thành công",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


exports.moveSlider = async (req, res) => {
  try {
    const { sliderId, newPosition } = req.body;

    if (!sliderId || newPosition === undefined) {
      return res.status(400).json({ message: "sliderId và newPosition là bắt buộc" });
    }

    const slider = await SliderModel.findById(sliderId);
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    const oldPosition = slider.position;

    if (newPosition < oldPosition) {
      // Tăng vị trí các slider giữa newPosition và oldPosition - 1
      await SliderModel.updateMany(
        { _id: { $ne: sliderId }, position: { $gte: newPosition, $lt: oldPosition } },
        { $inc: { position: 1 } }
      );
    } else if (newPosition > oldPosition) {
      // Giảm vị trí các slider giữa oldPosition + 1 và newPosition
      await SliderModel.updateMany(
        { _id: { $ne: sliderId }, position: { $gt: oldPosition, $lte: newPosition } },
        { $inc: { position: -1 } }
      );
    }

    slider.position = newPosition;
    await slider.save();

    res.status(200).json({
      message: "Cập nhật vị trí slider thành công",
      data: slider,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};