import Category from "../models/category.js";

// Tạo danh mục
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: category
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Tạo thất bại", error: err.message });
  }
};

// Lấy tất cả danh mục
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json({ success: true,message:"Lấy danh sách danh mục thành công", data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lấy danh sách danh mục thất bại" });
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.isActive === false) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }
    res.json({ success: true,message:"Lấy danh sách danh mục theo ID thành công", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lấy danh sách danh mục theo ID thất bại" });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category || category.isActive === false) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }
    res.json({ success: true, message: "Cập nhật danh mục thành công", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cập nhật danh mục thất bại" });
  }
};

// Ẩn danh mục 
export const hideCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    if (!category.isActive) {
      return res.status(400).json({ success: false, message: "Danh mục đã bị ẩn" });
    }

    category.isActive = false;
    await category.save();

    res.json({ success: true, message: "Ẩn danh mục thành công", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Ẩn danh mục thất bại" });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    res.json({ success: true, message: "Xóa danh mục thành công", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Xóa danh mục thất bại" });
  }
};
