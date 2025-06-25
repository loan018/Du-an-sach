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
export const canDeleteUser = async (req, res, next) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    const currentRole = req.user.role;
    const targetRole = userToDelete.role;

    if (currentRole === "admin" || (currentRole === "staff" && targetRole === "user")) {
      return next(); 
    }

    return res.status(403).json({ success: false, message: "Bạn không có quyền xoá người dùng này" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Lỗi máy chủ: " + err.message });
  }
};
