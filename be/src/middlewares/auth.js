import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(403).json({ message: "Tài khoản đã bị vô hiệu hóa hoặc không tồn tại." });
    }

    req.user = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Bạn không có quyền admin" });
  }
  next();
};

export const isStaff = (req, res, next) => {
  if (!["staff", "admin"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Bạn không có quyền nhân viên" });
  }
  next();
};
export const canDeleteUser = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Bạn không có quyền ẩn người dùng" });
  }
  next();
};
