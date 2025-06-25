import express from "express";
import {createCategory,getAllCategories,getCategoryById,updateCategory,hideCategory,deleteCategory} from "../controllers/category.js";
import { auth } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerCategory = express.Router();
routerCategory.get("/", getAllCategories);// Lấy tất cả danh mục
routerCategory.get("/:id", getCategoryById);// Lấy danh mục theo id
routerCategory.post("/", auth, requireStaffOrAdmin, createCategory);// Tạo danh mục
routerCategory.put("/:id", auth, requireStaffOrAdmin, updateCategory);// Cập nhật danh mục
routerCategory.delete("/:id", auth, requireStaffOrAdmin, deleteCategory ); // Xóa danh mục
routerCategory.patch("/hide/:id", auth, requireStaffOrAdmin, hideCategory); // Ẩn danh mục 
export default routerCategory;
