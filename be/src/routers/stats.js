import express from "express";
import {getTotalRevenue,getMonthlyRevenue,getOrderStats,getTopBooks} from "../controllers/stats.js";
import {auth, isAdmin } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerDashboard = express.Router();

routerDashboard.get("/revenue/total", auth, isAdmin, getTotalRevenue);// Tổng doanh thu
routerDashboard.get("/revenue/weekly", auth, isAdmin,getMonthlyRevenue );// Doanh thu theo tháng
routerDashboard.get("/orders/stats", auth, requireStaffOrAdmin, getOrderStats);// Thống kê đơn hàng
routerDashboard.get("/books/top", auth, requireStaffOrAdmin, getTopBooks);// Sách bán chạy

export default routerDashboard;
