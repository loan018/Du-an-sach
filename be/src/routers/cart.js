import express from "express";
import {getCart,addToCart,updateCartItem,removeCartItem,clearCart} from "../controllers/cart.js";
import { auth } from "../middlewares/auth.js";
const routerCart = express.Router();
routerCart.get("/", auth, getCart); // Lấy giỏ hàng của người dùng
routerCart.post("/", auth, addToCart);// Thêm sản phẩm vào giỏ hàng
routerCart.put("/", auth, updateCartItem);// Cập nhật sản phẩm trong giỏ hàng
routerCart.delete("/:id", auth, removeCartItem);// Xóa sản phẩm khỏi giỏ hàng
routerCart.delete("/clear/all", auth, clearCart);// Xóa tất cả sản phẩm trong giỏ hàng
export default routerCart;
