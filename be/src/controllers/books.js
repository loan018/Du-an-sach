import Book from "../models/books.js";

// Tạo sách mới
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, message: "Tạo sách thành công", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tạo sách thất bại", error });
  }
};

// Lấy danh sách tất cả sách (chỉ sách đang hoạt động)
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true });
    res.json({ success: true,message: "Lấy danh sách sách thành công", data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách sách" });
  }
};

// Lấy sách theo ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sách" });
    }
    res.json({ success: true,message: "Lấy sách theo ID thành công", data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy sách theo ID" });
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
