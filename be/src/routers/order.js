import express from "express";
import {createOrder,getMyOrders,getAllOrders,updateOrderStatus} from "../controllers/order.js";

import { auth } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerOrder = express.Router();
routerOrder.post("/", auth, createOrder); // Tạo đơn hàng
routerOrder.get("/me", auth, getMyOrders);// Lấy đơn hàng của người dùng
routerOrder.get("/admin", auth, requireStaffOrAdmin, getAllOrders);// Lấy tất cả đơn hàng 
routerOrder.patch("/update-status/:id", auth, requireStaffOrAdmin, updateOrderStatus);// Cập nhật trạng thái đơn hàng 

export default routerOrder;
