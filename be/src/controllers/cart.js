import Cart from "../models/cart.js";
import Book from "../models/books.js";

//Lấy giỏ hàng của người dùng
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.book");
    res.json({ success: true,message: "Lấy giỏ hàng thành công", data: cart || { user: req.user.id, items: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lấy giỏ hàng thất bại", error: err.message });
  }
};
// Thêm sách vào giỏ
export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Số lượng phải lớn hơn 0" });
    }

    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({ success: false, message: "Sách không tồn tại hoặc đã ngừng bán" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.book.toString() === bookId);
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (totalQuantity > book.quantity) {
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${book.quantity} cuốn trong kho`,
      });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ book: bookId, quantity });
    }

    await cart.save();
    const updated = await Cart.findById(cart.id).populate("items.book");

    res.json({ success: true, message: "Đã thêm vào giỏ", data: updated });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Thêm vào giỏ hàng thất bại",
      error: err.message,
    });
  }
};


//Cập nhật số lượng sách
export const updateCartItem = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Số lượng phải >= 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng" });
    }

    const item = cart.items.find((item) => item.book.toString() === bookId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Sản phẩm không có trong giỏ hàng" });
    }

    item.quantity = quantity;
    await cart.save();
    const updated = await Cart.findById(cart.id).populate("items.book");

    res.json({ success: true, message: "Cập nhật thành công", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cập nhật giỏ hàng thất bại", error: err.message });
  }
};

// Xóa 1 sản phẩm khỏi giỏ
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng" });
    }

    const beforeLength = cart.items.length;

    cart.items = cart.items.filter((item) => {
      const bookId = item.book.id ? item.book.id.toString() : item.book.toString();
      return bookId !== req.params.bookId;
    });

    if (cart.items.length === beforeLength) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sách trong giỏ hàng" });
    }

    await cart.save();

    const updated = await Cart.findById(cart.id).populate("items.book");
    res.json({ success: true, message: "Xoá sách thành công", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Xoá sách thất bại", error: err.message });
  }
};


// 🧹 Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.json({
        success: true,
        message: "Không còn sách nào trong giỏ hàng"
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: "Đã xoá toàn bộ giỏ hàng"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Xoá toàn bộ thất bại",
      error: err.message
    });
  }
};


