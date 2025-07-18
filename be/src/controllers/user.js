import User from "../models/user.js";
import bcrypt from "bcrypt";
import Notification from "../models/bell.js";

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";
    const role = req.query.role;
    const isActive = req.query.isActive;

    const query = {};

    if (role) query.role = role;
    if (isActive === "true") query.isActive = true;
    if (isActive === "false") query.isActive = false;
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } }
      ];
    }

    const totalItems = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("-password");

    res.json({
      success: true,
      users,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    console.error("Lỗi khi phân trang người dùng:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

// Lấy thông tin tài khoản chính mình
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({
      success: true,
      message: "Lấy tài khoản thành công",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ: " + err.message });
  }
};

// ✏️ Cập nhật thông tin cá nhân
export const updateMe = async (req, res) => {
  try {
    const { name, email, phone,avatar } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Nếu người dùng đổi email thì kiểm tra xem email đã tồn tại chưa
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email đã được sử dụng" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    // ✅ Gửi thông báo
    await Notification.create({
      message: "Bạn đã cập nhật hồ sơ thành công",
      type: "user",
      userId: user._id,
      link: "/user",
    });

    res.json({
      success: true,
      message: "Cập nhật thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cập nhật thất bại: " + error.message,
    });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const {avatar } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    console.log(avatar);
    
    if (avatar) user.avatar = avatar;

    await user.save();
  } catch (error) {
    console.log(error);
  }
};
// 🔐 Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// 🛠 Admin cập nhật vai trò
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, message: "Cập nhật vai trò thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cập nhật vai trò thất bại: " + err.message });
  }
};

// 🚫 Ẩn người dùng
export const hideUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    if (!user.isActive) {
      return res.status(400).json({ success: false, message: "Người dùng đã bị ẩn trước đó" });
    }

    user.isActive = false;
    user.name = "Người dùng đã ẩn";
    await user.save();

    res.json({ success: true, message: "Ẩn người dùng thành công", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Ẩn người dùng thất bại: " + err.message });
  }
};
