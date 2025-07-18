import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Notification from "../models/bell.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại" });
    }

    const user = await User.create({ name, email, password, phone });

    // Gửi thông báo cho admin
    await Notification.create({
      message: `Người dùng mới đăng ký: ${user.name}`,
      type: "user",
      link: `/admin/user`,
      userId: user._id,
    });

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err.message);
    res.status(500).json({ success: false, message: "Đăng ký không thành công" });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng nhập email và mật khẩu" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Tài khoản không tồn tại" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Sai mật khẩu" 
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Đăng nhập không thành công " + err.message
    });
  }
};

