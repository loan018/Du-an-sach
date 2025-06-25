import User from "../models/user.js";

//Lấy danh sách tất cả người dùng 
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true,  message: "Lấy danh sách tài khoản thành công",users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ: " + err.message });
  }
};

//Lấy thông tin tài khoản chính mình
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      success: true,
      message: "Lấy tài khoản thành công",
      user: user, 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ: " + err.message });
  }
};



// ✏️ Cập nhật thông tin cá nhân 
export const updateMe = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("name email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật thành công",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cập nhật thất bại"  + error.message,
    });
  }
};

//Admin cập nhật vai trò người dùng
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

//Admin Ẩn người dùng
export const hideUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        name: "Người dùng đã ẩn",
        email: `hidden+${Date.now()}_${req.params.id}@deleted.com`
      },
      { new: true }
    );
     if (!user.isActive) {
      return res.status(400).json({ success: false, message: "Người dùng đã bị ẩn trước đó" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({ success: true, message: "Ẩn người dùng thành công", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Ẩn người dùng thất bại: " + err.message });
  }
};
