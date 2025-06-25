import Banner from "../models/banner.js";

// Tạo banner mới
export const createBanner = async (req, res) => {
  try {
    const newBanner = await Banner.create(req.body);
    res.status(201).json({
      message: "Tạo banner thành công",
      banner: newBanner,
    });
  } catch (error) {
    res.status(400).json({
      message: "Tạo banner thất bại",
      error: error.message,
    });
  }
};

// Hiển thị danh sách tất cả banner
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({  message: "Lấy danh sách banner thành công", banners });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách banner",
      error: error.message,
    });
  }
};

// Lấy banner theo ID
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }
    res.status(200).json({message:"Lấy banner theo ID thành công", banner });
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi lấy banner theo ID",
      error: error.message,
    });
  }
};
// Cập nhật banner 
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner để cập nhật" });
    }
    res.status(200).json({
      message: "Cập nhật banner thành công",
      banner,
    });
  } catch (error) {
    res.status(400).json({
      message: "Cập nhật banner thất bại" + err.message
    });
  }
};

// Xóa banner theo ID
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner để xóa" });
    }
    res.status(200).json({ message: "Xóa banner thành công" });
  } catch (error) {
    res.status(400).json({
      message: "Xóa banner thất bại",
      error: error.message,
    });
  }
};
