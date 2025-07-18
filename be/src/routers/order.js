import express from "express";
import {createOrder,getMyOrders,getAllOrders,updateOrderStatus,getOrderById,repeatOrder,createVnpayPayment} from "../controllers/order.js";

import { auth } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerOrder = express.Router();
routerOrder.post("/", auth, createOrder); // Tạo đơn hàng
routerOrder.get("/me", auth, getMyOrders);// Lấy đơn hàng của người dùng
routerOrder.get("/admin", auth, requireStaffOrAdmin, getAllOrders);// Lấy tất cả đơn hàng 
routerOrder.patch("/update-status/:id", auth, requireStaffOrAdmin, updateOrderStatus);// Cập nhật trạng thái đơn hàng 
routerOrder.get("/:id", auth, getOrderById);
routerOrder.post("/:id/repeat", auth, repeatOrder);
routerOrder.post("/vnpay/create-payment", createVnpayPayment);
export default routerOrder;
