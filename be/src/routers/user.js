import express from "express";
import { auth, isAdmin, canDeleteUser } from "../middlewares/auth.js";
import { register, login } from "../controllers/auth.js";
import {
  getAllUsers,
  getUserById,
  updateMe,
  updateUserRole,
  hideUser,
  changePassword
} from "../controllers/user.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerUser = express.Router();

// Đăng ký, đăng nhập
routerUser.post("/register", register); 
routerUser.post("/login", login);       
routerUser.get("/me", auth, getUserById);       // Lấy thông tin chính mình
routerUser.put("/me", auth, updateMe);          // Cập nhật thông tin cá nhân
routerUser.put("/change-password", auth, changePassword); // ✅ Đổi mật khẩu
routerUser.get("/", auth, requireStaffOrAdmin, getAllUsers);    // Lấy danh sách người dùng
routerUser.put("/:id/role", auth, isAdmin, updateUserRole);     // Cập nhật vai trò người dùng
routerUser.patch("/:id", auth, canDeleteUser, hideUser);        // Ẩn người dùng

export default routerUser;
