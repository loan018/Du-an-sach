import Book from "../models/books.js";
import Category from "../models/category.js";

// Tạo sách mới
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, message: "Tạo sách thành công", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tạo sách thất bại", error });
  }
};

// Lấy danh sách tất cả sách 
export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", isActive, categorySlug } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (isActive === "true") query.isActive = true;
    if (isActive === "false") query.isActive = false;

    // 🔍 Nếu có slug, tìm categoryId từ slug
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        query.category = category._id;
      } else {
        // Không tìm thấy slug => trả về rỗng
        return res.json({
          success: true,
          message: "Không có sách cho danh mục này",
          data: [],
          pagination: {
            total: 0,
            totalPages: 0,
            currentPage: Number(page),
          },
        });
      }
    }

    const skip = (page - 1) * limit;
    const books = await Book.find(query)
      .populate("category", "name slug")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      message: "Lấy danh sách sách thành công",
      data: books,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách sách" });
  }
};




// Lấy sách theo ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category", "name slug");
    if (!book) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
    }
    res.json({
      success: true,
      message: "Lấy sách theo ID thành công",
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sách theo ID"
    });
  }
};


// Cập nhật sách
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
    }
    res.json({ success: true, message: "Cập nhật sách thành công", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cập nhật sách thất bại" });
  }
};

// Ẩn sách (isActive = false)
export const hideBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
    }
    if (!book.isActive) {
      return res.status(400).json({ success: false, message: "Sách đã bị ẩn" });
    }
    book.isActive = false;
    await book.save();
    res.json({ success: true, message: "Ẩn sách thành công", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Ẩn sách thất bại" });
  }
};

// Xoá vĩnh viễn
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
    }
    res.json({ success: true, message: "Xoá sách thành công", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xoá sách thất bại" });
  }
};

//book tương tự 
export const getRelatedBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await Book.findById(id);
    if (!current) return res.status(404).json({ success: false, message: "Không tìm thấy sách" });

    const books = await Book.find({
      _id: { $ne: id },
      category: current.category,
      isActive: true,
    }).limit(6);

    res.json({ success: true, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy sách liên quan", error: err.message });
  }
};