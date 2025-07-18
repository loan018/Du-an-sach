// controllers/notificationController.js
import Notification from "../models/bell.js";
import Book from "../models/books.js";
import User from "../models/user.js";
import Category from "../models/category.js";
import Review from "../models/review.js";

// ✅ Lấy thông báo của người dùng hiện tại
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let notifications = [];

    if (role === "admin") {
      notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
    }

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};


// ✅ Tạo thông báo mới (admin hoặc client đều dùng được)
export const createNotification = async (req, res) => {
  try {
    const { message, type, link, userId } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    const newNoti = await Notification.create({ message, type, link, userId });
    res.status(201).json({ success: true, data: newNoti });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Không tạo được thông báo" });
  }
};

// ✅ Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
  try {
    const noti = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    if (!noti)
      return res.status(404).json({ success: false, message: "Không tìm thấy" });
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ✅ Đánh dấu tất cả đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: "Đã đánh dấu tất cả là đã đọc" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ✅ Xoá 1 thông báo
export const deleteNotification = async (req, res) => {
  try {
    const noti = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!noti)
      return res.status(404).json({ success: false, message: "Không tìm thấy" });

    res.status(200).json({ success: true, message: "Đã xoá thông báo" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Không xoá được thông báo" });
  }
};

// ✅ Tìm kiếm dữ liệu (admin search)
export const searchAdminData = async (req, res) => {
  try {
    const keywordRaw = req.query.q || "";
    const keyword = keywordRaw.toString().trim().toLowerCase();

    if (!keyword) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
    }

    const results = [];

    // 1. Tìm user
    const users = await User.find({
      name: { $regex: keyword, $options: "i" },
    }).lean();
    users.forEach((user) => {
      results.push({ type: "user", id: user._id, data: user });
    });

    // 2. Tìm sách
    const books = await Book.find({
      title: { $regex: keyword, $options: "i" },
    })
      .populate("category")
      .lean();
    books.forEach((book) => {
      results.push({ type: "book", id: book._id, data: book });
    });

    // 3. Tìm danh mục
    const categories = await Category.find({
      name: { $regex: keyword, $options: "i" },
    }).lean();
    categories.forEach((cat) => {
      results.push({ type: "category", id: cat._id, data: cat });
    });

    // 4. Tìm đánh giá
    const reviews = await Review.find({
      comment: { $regex: keyword, $options: "i" },
    })
      .populate("user", "name")
      .populate("book", "title")
      .lean();
    reviews.forEach((review) => {
      results.push({ type: "review", id: review._id, data: review });
    });

    res.json({ results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi tìm kiếm: " + error.message });
  }
};
