import express from "express";
import {getTotalRevenue,getWeeklyRevenue,getOrderStats,getTopBooks} from "../controllers/stats.js";
import {auth, isAdmin } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerDashboard = express.Router();

routerDashboard.get("/revenue/total", auth, isAdmin, getTotalRevenue);// Tổng doanh thu
routerDashboard.get("/revenue/weekly", auth, isAdmin, getWeeklyRevenue);// Doanh thu theo tuần
routerDashboard.get("/orders/stats", auth, requireStaffOrAdmin, getOrderStats);// Thống kê đơn hàng
routerDashboard.get("/books/top", auth, requireStaffOrAdmin, getTopBooks);// Sách bán chạy

export default routerDashboard;
