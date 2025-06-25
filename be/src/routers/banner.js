import express from "express";
import {createBanner,getAllBanners,getBannerById,deleteBanner,updateBanner} from "../controllers/banner.js";
import { auth } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerBanner = express.Router();
routerBanner.post("/", auth, requireStaffOrAdmin, createBanner); // Tạo banner
routerBanner.put("/:id", auth, requireStaffOrAdmin, updateBanner); // Cập nhật banner
routerBanner.delete("/:id", auth, requireStaffOrAdmin, deleteBanner); // Xóa banner
routerBanner.get("/", getAllBanners);// Lấy tất cả banner
routerBanner.get("/:id", getBannerById);// Lấy banner theo id

export default routerBanner;
