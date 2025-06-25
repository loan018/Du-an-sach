import express from "express";
import { auth, isAdmin,canDeleteUser } from "../middlewares/auth.js";
import {register,login} from "../controllers/auth.js";
import {getAllUsers,getUserById,updateMe,updateUserRole,hideUser} from "../controllers/user.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerUser = express.Router();
routerUser.post("/register", register); 
routerUser.post("/login", login);       
routerUser.get("/me", auth, getUserById);// Lấy thông tin cá nhân 
routerUser.put("/me", auth, updateMe);// Cập nhật thông tin cá nhân
routerUser.get("/", auth, requireStaffOrAdmin, getAllUsers);// Lấy danh sách người dùng
routerUser.put("/:id/role", auth, isAdmin, updateUserRole); // Cập nhật vai trò
routerUser.patch("/:id", auth, canDeleteUser, hideUser);     // Ân người dùng

export default routerUser;
