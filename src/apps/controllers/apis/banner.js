const BannerModel = require("../../models/banner");

// ===== Lấy tất cả banner =====
exports.getAll = async (req, res) => {
  try {
    const banners = await BannerModel.find().sort({ position: -1 });
    res.status(200).json({
      message: "Get Banners successfully",
      data: banners
    });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error", error: error.message });
  }
};

// ===== Lấy banner theo ID =====
exports.getById = async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Get Banner successfully", data: banner });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error", error: error.message });
  }
};

// ===== Tạo banner mới =====
exports.create = async (req, res) => {
  try {
    const { url, target, publish } = req.body;

    // Tìm position lớn nhất hiện có
    const lastBanner = await BannerModel.findOne().sort({ position: -1 });
    const newPosition = lastBanner ? lastBanner.position + 1 : 1;

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    if (!image) return res.status(400).json({ message: "Image banner is require" });

    const banner = await BannerModel.create({
      image,
      url,
      target,
      publish,
      position: newPosition
    });

    res.status(201).json({
      message: "Create banner successfully",
      data: banner
    });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error", error: error.message });
  }
};

// ===== Cập nhật banner =====
exports.update = async (req, res) => {
  try {
    const { url, target, publish } = req.body;
    const id = req.params.id;

    const banner = await BannerModel.findById(id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    if (req.file) banner.image = `/uploads/${req.file.filename}`;
    if (url) banner.url = url;
    if (target !== undefined) banner.target = target;
    if (publish !== undefined) banner.publish = publish;

    await banner.save();

    res.status(200).json({ message: "Update banner successfully", data: banner });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error", error: error.message });
  }
};

// ===== Xóa banner =====
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await BannerModel.findByIdAndDelete(id);

    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json({ message: "Delete banner successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal sever error", error: error.message });
  }
};