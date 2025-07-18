import User from "../models/user.js";

export const addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware xác thực
    const { bookId } = req.params;

    const user = await User.findById(userId);
    if (!user.favorites.includes(bookId)) {
      user.favorites.push(bookId);
      await user.save();
    }

    res.json({ success: true, message: "Đã thêm vào danh sách yêu thích" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi thêm yêu thích" });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.id; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    if (!user.favorites.includes(bookId)) {
      return res.status(400).json({ success: false, message: "Sách không nằm trong danh sách yêu thích" });
    }
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== bookId.toString()
    );
    await user.save();

    res.json({ success: true, message: "Đã xoá khỏi danh sách yêu thích" });
  } catch (error) {
    console.error("Lỗi xoá yêu thích:", error);
    res.status(500).json({ success: false, message: "Lỗi khi xoá yêu thích" });
  }
};
export const getFavoriteBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favorites");

    res.json({ success: true, data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách yêu thích" });
  }
};
