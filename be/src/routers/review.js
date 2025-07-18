import express from "express";
import {createReview,getReviewsBook,getReviewsByBook,hideReview} from "../controllers/review.js";
import { auth } from "../middlewares/auth.js";
import { requireStaffOrAdmin } from "../middlewares/role.js";

const routerReview = express.Router();
routerReview.post("/", auth, createReview);// Tạo đánh giá
routerReview.get("/book/:id", getReviewsByBook);// Lấy đánh giá theo sách
routerReview.patch("/hide/:id", auth, requireStaffOrAdmin, hideReview);// Ẩn đánh giá
routerReview.get("/", auth, requireStaffOrAdmin,getReviewsBook);
export default routerReview;
