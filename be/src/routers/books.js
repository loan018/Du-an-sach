import express from "express";
import {createBook,getAllBooks,getBookById,updateBook,hideBook,deleteBook} from "../controllers/books.js";
import { auth } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerBook = express.Router();
routerBook.get("/", getAllBooks);// Lấy tất cả sách
routerBook.get("/:id", getBookById);// Lấy sách theo id
routerBook.post("/", auth, requireStaffOrAdmin, createBook); // Tạo sách
routerBook.put("/:id", auth, requireStaffOrAdmin, updateBook); // Cập nhật sách
routerBook.patch("/hide/:id", auth, requireStaffOrAdmin, hideBook); // Ẩn sách
routerBook.delete("/:id", auth, requireStaffOrAdmin, deleteBook); // Xóa sách

export default routerBook;
